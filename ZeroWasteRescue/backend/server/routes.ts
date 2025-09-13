import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFoodListingSchema, insertMessageSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";

// Simple session-based auth middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Admin middleware
const requireAdmin = async (req: any, res: any, next: any) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  next();
};

// Verified NGO middleware
const requireVerifiedNgo = async (req: any, res: any, next: any) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || user.userType !== 'ngo') {
    return res.status(403).json({ error: "NGO access required" });
  }
  
  if (!user.isVerified) {
    return res.status(403).json({ error: "NGO verification required. Please wait for admin approval." });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Check if this email should be admin (from environment variable)
      const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
      const isAdmin = adminEmails.includes(userData.email);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        ...(isAdmin && { isAdmin })
      });
      
      // Set session
      (req as any).session.userId = user.id;
      (req as any).session.userType = user.userType;
      
      // Return user without password
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set session
      (req as any).session.userId = user.id;
      (req as any).session.userType = user.userType;
      
      // Return user without password
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    (req as any).session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser((req as any).session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/ngos", requireAdmin, async (req, res) => {
    try {
      const { status } = req.query;
      const ngos = await storage.getNgosByStatus(status as string);
      // Remove password from response for security
      const sanitizedNgos = ngos.map(({ password, ...ngo }) => ngo);
      res.json(sanitizedNgos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/ngos/:id/verify", requireAdmin, async (req, res) => {
    try {
      const ngoId = req.params.id;
      const ngo = await storage.verifyNgo(ngoId);
      if (!ngo) {
        return res.status(404).json({ error: "NGO not found" });
      }
      // Remove password from response for security
      const { password, ...sanitizedNgo } = ngo;
      res.json({ message: "NGO verified successfully", ngo: sanitizedNgo });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/ngos/:id/reject", requireAdmin, async (req, res) => {
    try {
      const ngoId = req.params.id;
      const success = await storage.rejectNgo(ngoId);
      if (!success) {
        return res.status(404).json({ error: "NGO not found" });
      }
      res.json({ message: "NGO verification rejected" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Food listing routes
  app.get("/api/food-listings", async (req, res) => {
    try {
      const { location, urgency, foodType, providerId } = req.query;
      const listings = await storage.getFoodListings({
        location: location as string,
        urgency: urgency as string,
        foodType: foodType as string,
        providerId: providerId as string
      });
      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/food-listings/:id", async (req, res) => {
    try {
      const listing = await storage.getFoodListing(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.json(listing);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/food-listings", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      const user = await storage.getUser(userId);
      
      if (!user || user.userType !== 'provider') {
        return res.status(403).json({ error: "Only providers can create listings" });
      }
      
      const listingData = insertFoodListingSchema.parse({
        ...req.body,
        providerId: userId
      });
      
      const listing = await storage.createFoodListing(listingData);
      res.json(listing);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/food-listings/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      const listing = await storage.getFoodListing(req.params.id);
      
      if (!listing || listing.providerId !== userId) {
        return res.status(403).json({ error: "Not authorized to update this listing" });
      }
      
      const updates = insertFoodListingSchema.partial().parse(req.body);
      const updatedListing = await storage.updateFoodListing(req.params.id, updates);
      
      res.json(updatedListing);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/food-listings/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      const listing = await storage.getFoodListing(req.params.id);
      
      if (!listing || listing.providerId !== userId) {
        return res.status(403).json({ error: "Not authorized to delete this listing" });
      }
      
      const deleted = await storage.deleteFoodListing(req.params.id);
      res.json({ success: deleted });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Claim routes
  app.post("/api/food-listings/:id/claim", requireVerifiedNgo, async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      const listingId = req.params.id;
      
      const listing = await storage.claimFoodListing(listingId, userId);
      if (!listing) {
        return res.status(400).json({ error: "Unable to claim listing. It may already be claimed or not exist." });
      }
      
      res.json({ message: "Listing claimed successfully", listing });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/food-listings/:id/unclaim", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      const listingId = req.params.id;
      const user = await storage.getUser(userId);
      
      // Check if user is admin or the NGO who claimed it
      const listing = await storage.getFoodListing(listingId);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      
      if (!user?.isAdmin && listing.claimedByNgoId !== userId) {
        return res.status(403).json({ error: "Not authorized to unclaim this listing" });
      }
      
      const unclaimedListing = await storage.unclaimFoodListing(listingId);
      res.json({ message: "Listing unclaimed successfully", listing: unclaimedListing });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Status update route for claimed listings
  app.patch("/api/food-listings/:id/status", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      const listingId = req.params.id;
      const { claimStatus } = req.body;
      
      // Define valid status transitions
      const statusTransitions: Record<string, string[]> = {
        'claimed': ['confirmed', 'cancelled'],
        'confirmed': ['in_process', 'cancelled'],
        'in_process': ['delivery_partner_assigned', 'in_transit', 'cancelled'],
        'delivery_partner_assigned': ['in_transit', 'cancelled'],
        'in_transit': ['completed'],
        'completed': [], // Terminal state
        'cancelled': []  // Terminal state
      };
      
      // Get the listing to check authorization and current status
      const listing = await storage.getFoodListing(listingId);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      
      // Only the NGO who claimed it can update status (or admin)
      const user = await storage.getUser(userId);
      if (!user?.isAdmin && listing.claimedByNgoId !== userId) {
        return res.status(403).json({ error: "Not authorized to update status for this listing" });
      }
      
      // Validate status transition
      const currentStatus = listing.claimStatus || 'open';
      const allowedNextStatuses = statusTransitions[currentStatus] || [];
      
      if (!allowedNextStatuses.includes(claimStatus)) {
        return res.status(400).json({ 
          error: `Invalid status transition from '${currentStatus}' to '${claimStatus}'. Allowed transitions: ${allowedNextStatuses.join(', ')}` 
        });
      }
      
      // Update the status
      const updatedListing = await storage.updateFoodListingStatus(listingId, claimStatus);
      if (!updatedListing) {
        return res.status(400).json({ error: "Unable to update listing status" });
      }
      
      res.json({ message: "Status updated successfully", listing: updatedListing });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Message routes
  app.get("/api/messages/:listingId", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      const listingId = req.params.listingId;
      const otherUserId = req.query.otherUserId as string;
      
      if (!otherUserId) {
        return res.status(400).json({ error: "otherUserId parameter is required" });
      }
      
      // Get the listing to check authorization
      const listing = await storage.getFoodListing(listingId);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      
      // Check if current user is authorized to access this conversation
      const isProvider = listing.providerId === userId;
      const isClaimedNgo = listing.claimedByNgoId === userId;
      
      // Additional check: see if user has existing messages in this conversation
      const userMessages = await storage.getUserMessagesForListing(listingId, userId);
      const hasExistingMessages = userMessages.length > 0;
      
      if (!isProvider && !isClaimedNgo && !hasExistingMessages) {
        return res.status(403).json({ error: "Not authorized to access this conversation" });
      }
      
      // Get messages only between the current user and the specified other user
      const messages = await storage.getConversationMessages(listingId, userId, otherUserId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: userId
      });
      
      // Get the listing to validate authorization
      const listing = await storage.getFoodListing(messageData.listingId);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      
      // Validate that sender and receiver are legitimate participants
      const validParticipants = [listing.providerId];
      if (listing.claimedByNgoId) {
        validParticipants.push(listing.claimedByNgoId);
      }
      
      // Check if sender is authorized
      if (!validParticipants.includes(userId)) {
        return res.status(403).json({ error: "Not authorized to send messages for this listing" });
      }
      
      // Check if receiver is authorized
      if (!validParticipants.includes(messageData.receiverId)) {
        return res.status(403).json({ error: "Receiver is not a valid participant for this listing" });
      }
      
      // Ensure sender and receiver are different
      if (messageData.senderId === messageData.receiverId) {
        return res.status(400).json({ error: "Cannot send message to yourself" });
      }
      
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
