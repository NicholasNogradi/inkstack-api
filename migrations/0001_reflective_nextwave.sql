ALTER TABLE "book_table" ADD COLUMN "sales" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "stock" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "availability" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "updated_at" timestamp DEFAULT now();