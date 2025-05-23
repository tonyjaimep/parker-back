CREATE TYPE "public"."currency" AS ENUM('mxn', 'usd');--> statement-breakpoint
CREATE TABLE "lot" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"default_price_id" integer,
	"address" varchar NOT NULL,
	"location" geometry(point) NOT NULL,
	"owner_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"currency" "currency" DEFAULT 'mxn' NOT NULL,
	"amount" integer NOT NULL,
	"lot_id" integer NOT NULL,
	"base_amount" integer NOT NULL,
	"hourly_rate" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spots" (
	"id" serial PRIMARY KEY NOT NULL,
	"lot_id" integer NOT NULL,
	"price_id" integer,
	"is_available" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "lot" ADD CONSTRAINT "lot_default_price_id_price_id_fk" FOREIGN KEY ("default_price_id") REFERENCES "public"."price"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price" ADD CONSTRAINT "price_lot_id_lot_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."lot"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spots" ADD CONSTRAINT "spots_lot_id_lot_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."lot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spots" ADD CONSTRAINT "spots_price_id_price_id_fk" FOREIGN KEY ("price_id") REFERENCES "public"."price"("id") ON DELETE set null ON UPDATE no action;