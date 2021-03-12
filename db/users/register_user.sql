-- 1) add user entry to users table
INSERT INTO users (
  first_name,
  last_name,
  username,
  password
) VALUES (
  ${firstName},
  ${lastName},
  ${username},
  ${hashedPassword}
)
;

-- 2) return user info
SELECT user_id, first_name, username
FROM users
WHERE username=${username}
;