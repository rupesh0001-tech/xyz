import { users, foodListings, messages, type User, type InsertUser, type FoodListing, type InsertFoodListing, type Message, type InsertMessage } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

// Storage interface with all CRUD methods needed
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Admin methods
  getNgosByStatus(status?: string): Promise<User[]>;
  verifyNgo(id: string): Promise<User | undefined>;
  rejectNgo(id: string): Promise<boolean>;
  
  // Food listing methods
  getFoodListings(filters?: { location?: string; urgency?: string; foodType?: string; providerId?: string }): Promise<FoodListing[]>;
  getFoodListing(id: string): Promise<FoodListing | undefined>;
  createFoodListing(listing: InsertFoodListing): Promise<FoodListing>;
  updateFoodListing(id: string, updates: Partial<InsertFoodListing>): Promise<FoodListing | undefined>;
  updateFoodListingStatus(id: string, status: string): Promise<FoodListing | undefined>;
  deleteFoodListing(id: string): Promise<boolean>;
  claimFoodListing(id: string, ngoId: string): Promise<FoodListing | undefined>;
  unclaimFoodListing(id: string): Promise<FoodListing | undefined>;
  
  // Message methods
  getMessages(listingId: string): Promise<Message[]>;
  getUserMessagesForListing(listingId: string, userId: string): Promise<Message[]>;
  getConversationMessages(listingId: string, user1Id: string, user2Id: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getConversations(userId: string): Promise<{ listing: FoodListing; lastMessage: Message }[]>;
}

// Database storage implementation using javascript_database blueprint
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Admin methods
  async getNgosByStatus(status?: string): Promise<User[]> {
    let whereConditions = [eq(users.userType, 'ngo')];
    
    if (status === 'pending') {
      whereConditions.push(eq(users.isVerified, false));
    } else if (status === 'verified') {
      whereConditions.push(eq(users.isVerified, true));
    }
    
    return db.select()
      .from(users)
      .where(and(...whereConditions))
      .orderBy(desc(users.createdAt));
  }

  async verifyNgo(id: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        isVerified: true, 
        verifiedAt: new Date() 
      })
      .where(and(eq(users.id, id), eq(users.userType, 'ngo')))
      .returning();
    return user || undefined;
  }

  async rejectNgo(id: string): Promise<boolean> {
    // For now, rejection just removes the user. In a real app, 
    // you might want to keep a record with rejection reason
    const result = await db
      .delete(users)
      .where(and(eq(users.id, id), eq(users.userType, 'ngo'), eq(users.isVerified, false)))
      .returning();
    return result.length > 0;
  }

  // Food listing methods
  async getFoodListings(filters?: { location?: string; urgency?: string; foodType?: string; providerId?: string }): Promise<FoodListing[]> {
    let whereConditions = [eq(foodListings.isActive, 1)];
    
    if (filters?.location) {
      whereConditions.push(eq(foodListings.location, filters.location));
    }
    if (filters?.urgency) {
      whereConditions.push(eq(foodListings.urgency, filters.urgency as any));
    }
    if (filters?.foodType) {
      whereConditions.push(eq(foodListings.foodType, filters.foodType));
    }
    if (filters?.providerId) {
      whereConditions.push(eq(foodListings.providerId, filters.providerId));
    }
    
    return db.select()
      .from(foodListings)
      .where(and(...whereConditions))
      .orderBy(desc(foodListings.createdAt));
  }

  async getFoodListing(id: string): Promise<FoodListing | undefined> {
    const [listing] = await db.select().from(foodListings).where(eq(foodListings.id, id));
    return listing || undefined;
  }

  async createFoodListing(insertListing: InsertFoodListing): Promise<FoodListing> {
    const [listing] = await db
      .insert(foodListings)
      .values(insertListing)
      .returning();
    return listing;
  }

  async updateFoodListing(id: string, updates: Partial<InsertFoodListing>): Promise<FoodListing | undefined> {
    const [listing] = await db
      .update(foodListings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(foodListings.id, id))
      .returning();
    return listing || undefined;
  }

  async deleteFoodListing(id: string): Promise<boolean> {
    const [listing] = await db
      .update(foodListings)
      .set({ isActive: 0 })
      .where(eq(foodListings.id, id))
      .returning();
    return !!listing;
  }

  async claimFoodListing(id: string, ngoId: string): Promise<FoodListing | undefined> {
    const [listing] = await db
      .update(foodListings)
      .set({ 
        claimedByNgoId: ngoId,
        claimStatus: 'claimed',
        claimedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(and(
        eq(foodListings.id, id), 
        eq(foodListings.claimStatus, 'open'),
        eq(foodListings.isActive, 1)
      ))
      .returning();
    return listing || undefined;
  }

  async unclaimFoodListing(id: string): Promise<FoodListing | undefined> {
    const [listing] = await db
      .update(foodListings)
      .set({ 
        claimedByNgoId: null,
        claimStatus: 'open',
        claimedAt: null,
        updatedAt: new Date() 
      })
      .where(eq(foodListings.id, id))
      .returning();
    return listing || undefined;
  }

  async updateFoodListingStatus(id: string, status: string): Promise<FoodListing | undefined> {
    const [listing] = await db
      .update(foodListings)
      .set({ 
        claimStatus: status as any,
        updatedAt: new Date() 
      })
      .where(eq(foodListings.id, id))
      .returning();
    return listing || undefined;
  }

  // Message methods
  async getMessages(listingId: string): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(eq(messages.listingId, listingId))
      .orderBy(messages.createdAt);
  }

  async getUserMessagesForListing(listingId: string, userId: string): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(and(
        eq(messages.listingId, listingId),
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      ))
      .orderBy(messages.createdAt);
  }

  async getConversationMessages(listingId: string, user1Id: string, user2Id: string): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(and(
        eq(messages.listingId, listingId),
        or(
          and(
            eq(messages.senderId, user1Id),
            eq(messages.receiverId, user2Id)
          ),
          and(
            eq(messages.senderId, user2Id),
            eq(messages.receiverId, user1Id)
          )
        )
      ))
      .orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getConversations(userId: string): Promise<{ listing: FoodListing; lastMessage: Message }[]> {
    // This would need a more complex query in a real app, simplified for now
    const userMessages = await db.select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));
    
    const conversationMap = new Map<string, Message>();
    for (const message of userMessages) {
      if (!conversationMap.has(message.listingId)) {
        conversationMap.set(message.listingId, message);
      }
    }
    
    const conversations = [];
    for (const [listingId, lastMessage] of Array.from(conversationMap.entries())) {
      const listing = await this.getFoodListing(listingId);
      if (listing) {
        conversations.push({ listing, lastMessage });
      }
    }
    
    return conversations;
  }
}

export const storage = new DatabaseStorage();
