ALTER TABLE "book_table" DROP CONSTRAINT "book_table_isbn_unique";--> statement-breakpoint
ALTER TABLE "book_table" ALTER COLUMN "title" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "book_table" ALTER COLUMN "author" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "book_table" ALTER COLUMN "isbn" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "book_table" ALTER COLUMN "isbn" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "book_table" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "book_table" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "page_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "average_rating" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "ratings_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "is_ebook" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "price" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "saleability" varchar(50) DEFAULT 'UNKNOWN';--> statement-breakpoint
ALTER TABLE "book_table" ADD COLUMN "country" varchar(2) DEFAULT 'US';