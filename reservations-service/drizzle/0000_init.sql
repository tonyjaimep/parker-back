CREATE TABLE "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"spot_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"starts_at" timestamp DEFAULT now() NOT NULL,
	"ends_at" timestamp
);
