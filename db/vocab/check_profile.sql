SELECT COUNT(*)
FROM profile
WHERE user_id = ${userId} AND frequency_id = ${freqId}
;
