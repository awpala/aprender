SELECT COUNT(*) AS encounters_count
FROM profile
WHERE user_id = ${userId}
LIMIT 1
;
