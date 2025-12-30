CREATE TABLE "book_categories_table" (
	"book_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "book_categories_table_book_id_category_id_pk" PRIMARY KEY("book_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "book_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(100) NOT NULL,
	"isbn" varchar(13) NOT NULL,
	"description" text,
	"cover_image" text,
	CONSTRAINT "book_table_isbn_unique" UNIQUE("isbn")
);
--> statement-breakpoint
CREATE TABLE "categories_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "categories_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "favorites_table" (
	"user_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_table_user_id_book_id_pk" PRIMARY KEY("user_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "user_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_table_email_unique" UNIQUE("email"),
	CONSTRAINT "user_table_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "book_categories_table" ADD CONSTRAINT "book_categories_table_book_id_book_table_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_categories_table" ADD CONSTRAINT "book_categories_table_category_id_categories_table_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites_table" ADD CONSTRAINT "favorites_table_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites_table" ADD CONSTRAINT "favorites_table_book_id_book_table_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book_table"("id") ON DELETE cascade ON UPDATE no action;