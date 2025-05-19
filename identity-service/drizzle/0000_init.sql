CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_user_id" varchar NOT NULL,
	"full_name" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_firebaseUserId_unique" UNIQUE("firebase_user_id")
);
