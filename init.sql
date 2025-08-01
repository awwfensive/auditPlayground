CREATE TABLE pg_promise_example (
  result INTEGER,
  name TEXT
);

-- For additional fun, also create the `users` table for context
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT,
  balance INTEGER
);

INSERT INTO users (username, balance) VALUES ('cat', 1000);
