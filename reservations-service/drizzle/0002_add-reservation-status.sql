CREATE TYPE "public"."reservation_status" AS ENUM('pending', 'active', 'completed', 'canceled', 'expired');--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "status" "reservation_status";
