ALTER TABLE "reservations" RENAME COLUMN "starts_at" TO "check_in_at";--> statement-breakpoint
ALTER TABLE "reservations" RENAME COLUMN "ends_at" TO "check_out_at";--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "expires_at" timestamp;