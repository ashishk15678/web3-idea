-- Add category column to users table
ALTER TABLE users
ADD COLUMN category VARCHAR(50) DEFAULT NULL;

-- Add comment to explain the field
COMMENT ON COLUMN users.category IS 'Optional category for user classification';

-- Create an index for faster category-based queries
CREATE INDEX idx_users_category ON users(category);

-- Update existing users with a default category if needed (optional)
-- UPDATE users SET category = 'general' WHERE category IS NULL; 