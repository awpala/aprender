INSERT INTO profile
(user_id, frequency_id)
VALUES
(${userId}, ${freqId})
;

SELECT familiarity_score, encounters
FROM profile
WHERE user_id = ${userId} AND frequency_id = ${freqId}
;
