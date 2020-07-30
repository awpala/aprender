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
    ${password}
)
;

-- 2) add user-words entries to profile table
INSERT INTO profile (user_id, frequency_id) -- N.B. remaining fields initialized to DEFAULTs (cf. db/seed/seed.sql)
SELECT
    (SELECT user_id FROM users WHERE username=${username}) AS registered_user,
    frequency_id
FROM word 
ORDER BY frequency_id
;

-- 3) return user info
SELECT user_id, first_name, username
FROM users
WHERE username=${username}
;