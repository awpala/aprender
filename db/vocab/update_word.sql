UPDATE profile
SET
    is_familiar = $3,
    familiarity_score = $4,
    encounters = $5
WHERE user_id = $1 AND frequency_id = $2
;

SELECT frequency_id, is_familiar, familiarity_score, encounters
FROM profile
WHERE user_id = $1 AND frequency_id = $2
;