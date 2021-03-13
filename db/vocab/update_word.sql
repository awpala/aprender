UPDATE profile
SET
  is_familiar = ${isFamiliar},
  familiarity_score = ${familiarityScore},
  encounters = ${encounters}
WHERE user_id = ${userId} AND frequency_id = ${freqId}
;

SELECT frequency_id, is_familiar, familiarity_score, encounters
FROM profile
WHERE user_id = ${userId} AND frequency_id = ${freqId}
;