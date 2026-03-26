-- Initial Categories for Home Inventory
-- Assuming public.categories table exists after migration

INSERT INTO categories (id, name, created_at, updated_at) VALUES 
(gen_random_uuid(), 'Kitchen', NOW(), NOW()),
(gen_random_uuid(), 'Pantry', NOW(), NOW()),
(gen_random_uuid(), 'Bathroom', NOW(), NOW()),
(gen_random_uuid(), 'Cleaning', NOW(), NOW()),
(gen_random_uuid(), 'Medicine', NOW(), NOW()),
(gen_random_uuid(), 'Tools', NOW(), NOW())
ON CONFLICT (name) DO NOTHING; -- Assuming name is unique or just an example