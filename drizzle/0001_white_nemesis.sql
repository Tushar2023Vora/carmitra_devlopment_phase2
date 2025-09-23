CREATE TABLE IF NOT EXISTS "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"carId" integer NOT NULL,
	"offer" varchar NOT NULL,
	"contact" varchar NOT NULL,
	"createdAt" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offers" ADD CONSTRAINT "offers_carId_carListing_id_fk" FOREIGN KEY ("carId") REFERENCES "public"."carListing"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
