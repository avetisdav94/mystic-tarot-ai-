-- Пользователи
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  language_code TEXT DEFAULT 'ru',
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP WITH TIME ZONE,
  total_spreads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Расклады пользователей
CREATE TABLE user_spreads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  spread_type TEXT NOT NULL,
  spread_name TEXT NOT NULL,
  cards JSONB NOT NULL,
  interpretation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Транзакции
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PLN',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_provider TEXT,
  payment_id TEXT,
  spread_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Статистика
CREATE TABLE statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_users_premium ON users(is_premium, premium_until);
CREATE INDEX idx_user_spreads_user_id ON user_spreads(user_id);
CREATE INDEX idx_user_spreads_created_at ON user_spreads(created_at DESC);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_statistics_user_id ON statistics(user_id);
CREATE INDEX idx_statistics_event_type ON statistics(event_type);

-- Функция обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры
CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_spreads ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- Политики (для сервисного ключа)
CREATE POLICY "Service role has full access to users" ON users FOR ALL USING (true);
CREATE POLICY "Service role has full access to user_spreads" ON user_spreads FOR ALL USING (true);
CREATE POLICY "Service role has full access to transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Service role has full access to statistics" ON statistics FOR ALL USING (true);