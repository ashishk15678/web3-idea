-- Drop existing table if it exists
DROP TABLE IF EXISTS "users";

-- Create users table with TEXT columns
CREATE TABLE "users" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_users_wallet_address ON "users" (wallet_address);
CREATE INDEX idx_users_username ON "users" (username); 