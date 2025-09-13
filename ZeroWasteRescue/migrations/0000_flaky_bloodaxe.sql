CREATE TYPE "public"."claim_status" AS ENUM('open', 'claimed', 'confirmed', 'in_process', 'delivery_partner_assigned', 'in_transit', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."urgency" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('provider', 'ngo');--> statement-breakpoint
CREATE TABLE "food_listings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"quantity" text NOT NULL,
	"location" text NOT NULL,
	"food_type" text NOT NULL,
	"urgency" "urgency" DEFAULT 'medium' NOT NULL,
	"expires_in" text NOT NULL,
	"contact_info" text NOT NULL,
	"special_instructions" text,
	"tags" text[] DEFAULT '{}'::text[],
	"provider_id" varchar NOT NULL,
	"claimed_by_ngo_id" varchar,
	"claim_status" "claim_status" DEFAULT 'open' NOT NULL,
	"claimed_at" timestamp,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"sender_id" varchar NOT NULL,
	"receiver_id" varchar NOT NULL,
	"listing_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"user_type" "user_type" NOT NULL,
	"organization_type" text NOT NULL,
	"address" text NOT NULL,
	"description" text,
	"is_admin" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "food_listings" ADD CONSTRAINT "food_listings_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_listings" ADD CONSTRAINT "food_listings_claimed_by_ngo_id_users_id_fk" FOREIGN KEY ("claimed_by_ngo_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_listing_id_food_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."food_listings"("id") ON DELETE no action ON UPDATE no action;