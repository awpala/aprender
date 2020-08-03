SELECT p.frequency_id, p.is_familiar, p.familiarity_score, p.encounters, w.is_cognate, pos.pos_standardized
FROM profile AS p
INNER JOIN word AS w
    ON p.frequency_id = w.frequency_id
INNER JOIN part_of_speech AS pos
    ON w.part_of_speech_id = pos.pos_id
WHERE p.user_id = $1
;