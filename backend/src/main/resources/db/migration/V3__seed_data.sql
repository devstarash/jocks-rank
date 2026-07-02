-- Seed: пользователи + глобальные результаты
-- Все пароли: 123456
-- Хеш для "123456": $2a$10$envVBRkBNpZwKRVLj.49tO5Bec.1snRSUBcD8Ifs8vyyIhbQOKA0u

INSERT INTO users (username, email, password_hash, role) VALUES
  ('admin', 'admin@jocksrank.ru', '$2a$10$envVBRkBNpZwKRVLj.49tO5Bec.1snRSUBcD8Ifs8vyyIhbQOKA0u', 'ADMIN'),
  ('alex', 'alex@test.com', '$2a$10$envVBRkBNpZwKRVLj.49tO5Bec.1snRSUBcD8Ifs8vyyIhbQOKA0u', 'USER'),
  ('max', 'max@test.com', '$2a$10$envVBRkBNpZwKRVLj.49tO5Bec.1snRSUBcD8Ifs8vyyIhbQOKA0u', 'USER'),
  ('dim', 'dim@test.com', '$2a$10$envVBRkBNpZwKRVLj.49tO5Bec.1snRSUBcD8Ifs8vyyIhbQOKA0u', 'USER'),
  ('serg', 'serg@test.com', '$2a$10$envVBRkBNpZwKRVLj.49tO5Bec.1snRSUBcD8Ifs8vyyIhbQOKA0u', 'USER');

-- Подтягивания (category_id = 1)
INSERT INTO results (user_id, category_id, "value", status, recorded_at) VALUES
  (2, 1, 25,  'APPROVED', NOW()),
  (3, 1, 20,  'APPROVED', NOW()),
  (4, 1, 18,  'APPROVED', NOW()),
  (5, 1, 15,  'APPROVED', NOW());

-- Жим (category_id = 2)
INSERT INTO results (user_id, category_id, "value", status, recorded_at) VALUES
  (2, 2, 120, 'APPROVED', NOW()),
  (3, 2, 100, 'APPROVED', NOW()),
  (4, 2, 95,  'APPROVED', NOW()),
  (5, 2, 80,  'APPROVED', NOW());

-- Комплекс (category_id = 3)
INSERT INTO results (user_id, category_id, "value", status, recorded_at) VALUES
  (2, 3, 45,  'APPROVED', NOW()),
  (3, 3, 52,  'APPROVED', NOW()),
  (4, 3, 60,  'APPROVED', NOW()),
  (5, 3, 55,  'APPROVED', NOW());

-- Тоннаж (category_id = 4)
INSERT INTO results (user_id, category_id, "value", status, recorded_at) VALUES
  (2, 4, 5000, 'APPROVED', NOW()),
  (3, 4, 4200, 'APPROVED', NOW()),
  (4, 4, 3800, 'APPROVED', NOW()),
  (5, 4, 3200, 'APPROVED', NOW());

-- На раз (category_id = 5)
INSERT INTO results (user_id, category_id, "value", status, recorded_at) VALUES
  (2, 5, 180, 'APPROVED', NOW()),
  (3, 5, 155, 'APPROVED', NOW()),
  (4, 5, 140, 'APPROVED', NOW()),
  (5, 5, 120, 'APPROVED', NOW());
