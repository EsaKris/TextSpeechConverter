CREATE TABLE "text_presets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tts_conversions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"source_file_id" integer,
	"text_content" text NOT NULL,
	"audio_file_path" text,
	"voice_settings" json NOT NULL,
	"language" text DEFAULT 'en',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "uploaded_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"file_path" text NOT NULL,
	"file_name" text NOT NULL,
	"file_type" text NOT NULL,
	"extracted_text" text,
	"processed" boolean DEFAULT false,
	"upload_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text,
	"profile_photo" text,
	"dark_mode" boolean DEFAULT false,
	"tts_credits" integer DEFAULT 100,
	"account_type" text DEFAULT 'free',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "text_presets" ADD CONSTRAINT "text_presets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tts_conversions" ADD CONSTRAINT "tts_conversions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tts_conversions" ADD CONSTRAINT "tts_conversions_source_file_id_uploaded_files_id_fk" FOREIGN KEY ("source_file_id") REFERENCES "public"."uploaded_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;