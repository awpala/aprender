UPDATE profile
SET
    is_familiar = $3,
    familiarity_score = $4,
    encounters = $5
WHERE user_id = $1 AND frequency_id = $2
;