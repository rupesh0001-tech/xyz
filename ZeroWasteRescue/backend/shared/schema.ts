import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, pgEnum, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";


// User types enum
export const userTypeEnum = pgEnum('user_type', ['provider', 'ngo']);
export const urgencyEnum = pgEnum('urgency', ['low', 'medium', 'high']);
export const claimStatusEnum = pgEnum('claim_status', [
  'open', 
  'claimed', 
  'confirmed',
  'in_process', 
  'delivery_partner_assigned', 
  'in_transit', 
  'completed', 
  'cancelled'
]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  userType: userTypeEnum("user_type").notNull(),
  organizationType: text("organization_type").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Food listings table
export const foodListings = pgTable("food_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  quantity: text("quantity").notNull(),
  location: text("location").notNull(),
  foodType: text("food_type").notNull(),
  urgency: urgencyEnum("urgency").notNull().default('medium'),
  expiresIn: text("expires_in").notNull(),
  contactInfo: text("contact_info").notNull(),
  specialInstructions: text("special_instructions"),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  providerId: varchar("provider_id").notNull().references(() => users.id),
  claimedByNgoId: varchar("claimed_by_ngo_id").references(() => users.id, { onDelete: "set null" }),
  claimStatus: claimStatusEnum("claim_status").default('open').notNull(),
  claimedAt: timestamp("claimed_at"),
  isActive: integer("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messages table for chat functionality
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  listingId: varchar("listing_id").notNull().references(() => foodListings.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  foodListings: many(foodListings),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
}));

export const foodListingsRelations = relations(foodListings, ({ one, many }) => ({
  provider: one(users, {
    fields: [foodListings.providerId],
    references: [users.id],
  }),
  claimedByNgo: one(users, {
    fields: [foodListings.claimedByNgoId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
  listing: one(foodListings, {
    fields: [messages.listingId],
    references: [foodListings.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
  phone: true,
  userType: true,
  organizationType: true,
  address: true,
  description: true,
});

export const insertFoodListingSchema = createInsertSchema(foodListings).pick({
  title: true,
  description: true,
  quantity: true,
  location: true,
  foodType: true,
  urgency: true,
  expiresIn: true,
  contactInfo: true,
  specialInstructions: true,
  tags: true,
  providerId: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  text: true,
  senderId: true,
  receiverId: true,
  listingId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFoodListing = z.infer<typeof insertFoodListingSchema>;
export type FoodListing = typeof foodListings.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
