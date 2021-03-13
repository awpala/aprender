DELETE FROM profile
WHERE user_id = ${userId};

DELETE FROM users
WHERE user_id = ${userId};
