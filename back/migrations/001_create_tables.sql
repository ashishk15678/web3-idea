-- Drop existing tables if they exist
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS rates;
DROP TABLE IF EXISTS ideas;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT NOT NULL,
    wallet_address TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ideas table
CREATE TABLE ideas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    creator_id TEXT NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'active', -- active, closed, resolved
    resolution_outcome TEXT, -- null until resolved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create rates table (for tracking idea price history)
CREATE TABLE rates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    idea_id TEXT NOT NULL REFERENCES ideas(id),
    rate DECIMAL(20,8) NOT NULL, -- Using DECIMAL for precise financial calculations
    volume DECIMAL(20,8) NOT NULL DEFAULT 0, -- Trading volume at this rate
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(idea_id, created_at) -- One rate per idea per timestamp
);

-- Create transactions table
CREATE TABLE transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    idea_id TEXT NOT NULL REFERENCES ideas(id),
    buyer_id TEXT NOT NULL REFERENCES users(id),
    seller_id TEXT NOT NULL REFERENCES users(id),
    amount DECIMAL(20,8) NOT NULL, -- Amount of idea tokens
    rate DECIMAL(20,8) NOT NULL, -- Rate at which transaction occurred
    total_value DECIMAL(20,8) NOT NULL, -- amount * rate
    status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_ideas_creator ON ideas(creator_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_rates_idea_created ON rates(idea_id, created_at);
CREATE INDEX idx_transactions_idea ON transactions(idea_id);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ideas_updated_at
    BEFORE UPDATE ON ideas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 