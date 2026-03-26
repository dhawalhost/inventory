CREATE TABLE households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL
);

ALTER TABLE users ADD COLUMN household_id UUID REFERENCES households(id);

-- Items, categories, etc. reference household_id instead of user_id