-- add user entry to users table
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
RETURNING user_id, first_name, username
;

-- add user-words entries to profile table
INSERT INTO profile (user_id, frequency_id)
SELECT
    (SELECT user_id FROM users WHERE username=${username}), frequency_id
    FROM word 
    ORDER BY frequency_id
;
