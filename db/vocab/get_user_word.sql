SELECT
  -- query word
  w.word_es AS quiz_word_es,
  -- query word metadata
  w.frequency_id AS quiz_word_es_fid,
  pos.pos_full AS part_of_speech_full,
  w.word_en AS correct_word_en,
  -- array of 3 random incorrect choices from same part of speech as query word
  ARRAY (
    SELECT word_en
    FROM word
    WHERE
      frequency_id != w.frequency_id
      AND frequency_id IN (
        SELECT frequency_id
        FROM word
        WHERE part_of_speech_id = w.part_of_speech_id 
        ORDER BY RANDOM() 
        LIMIT 3
      )
  ) AS incorrect_words_en,
  -- query word usage example phrase (Spanish and English)
  w.phrase_es,
  w.phrase_en

FROM word AS w
INNER JOIN part_of_speech AS pos
  ON w.part_of_speech_id = pos.pos_id
LEFT JOIN (SELECT * FROM profile WHERE user_id = ${userId}) AS p
  ON w.frequency_id = p.frequency_id

WHERE
  (p.user_id = ${userId} OR p.user_id IS NULL)
  AND CASE
    -- Case 1) randomly select from top 100 if any freq_id <= 100 are unfamiliar
    WHEN
      EXISTS (
        SELECT *
        FROM profile
        WHERE user_id = ${userId}
          AND ${totalUniqueEncounters} >= 1
          AND ${totalUniqueEncounters} <= 99
          AND is_familiar
        ) 
        OR ${totalUniqueEncounters} = 0
      THEN
        (w.frequency_id BETWEEN 1 AND 100)
        AND (
          p.familiarity_score IN (
            SELECT MIN(familiarity_score)
            FROM profile
            WHERE user_id = ${userId}
            AND NOT is_familiar
            GROUP BY familiarity_score
            ORDER BY 1
            LIMIT 1
          )
          OR p.familiarity_score IS NULL
        )
    -- Case 2) randomly select from top 500 if any freq_id <= 500 are unfamiliar and all freq_id <= 100 are familiar
    WHEN
      EXISTS (
        SELECT *
        FROM profile
        WHERE user_id = ${userId}
          AND ${totalUniqueEncounters} >= 101
          AND ${totalUniqueEncounters} <= 499
          AND is_familiar
        ) 
        OR ${totalUniqueEncounters} = 100
      THEN
        (w.frequency_id BETWEEN 1 AND 500)
        AND (
          p.familiarity_score IN (
            SELECT MIN(familiarity_score)
            FROM profile
            WHERE user_id = ${userId}
            AND NOT is_familiar
            GROUP BY familiarity_score
            ORDER BY 1
            LIMIT 1
          )
          OR p.familiarity_score IS NULL
        )
    -- Case 3) randomly select from top 1000 if any freq_id <= 1000 are unfamiliar and all freq_id <= 500 are familiar
    WHEN
      EXISTS (
        SELECT *
        FROM profile
        WHERE user_id = ${userId}
          AND ${totalUniqueEncounters} >= 501
          AND ${totalUniqueEncounters} <= 999
          AND is_familiar
        ) 
        OR ${totalUniqueEncounters} = 500
      THEN
        (w.frequency_id BETWEEN 1 AND 1000)
        AND (
          p.familiarity_score IN (
            SELECT MIN(familiarity_score)
            FROM profile
            WHERE user_id = ${userId}
            AND NOT is_familiar
            GROUP BY familiarity_score
            ORDER BY 1
            LIMIT 1
          )
          OR p.familiarity_score IS NULL
        )
    -- Case 4) randomly select from top 5000 if any freq_id <= 5000 are unfamiliar and all freq_id <= 1000 are familiar
    WHEN
      EXISTS (
        SELECT *
        FROM profile
        WHERE user_id = ${userId}
          AND ${totalUniqueEncounters} >= 1001
          AND ${totalUniqueEncounters} <= 4999
          AND is_familiar
        ) 
        OR ${totalUniqueEncounters} = 1000
      THEN
        (w.frequency_id BETWEEN 1 AND 5000)
        AND (
          p.familiarity_score IN (
            SELECT MIN(familiarity_score)
            FROM profile
            WHERE user_id = ${userId}
            AND NOT is_familiar
            GROUP BY familiarity_score
            ORDER BY 1
            LIMIT 1
          )
          OR p.familiarity_score IS NULL
        )
    -- Case DEFAULT) randomly select any word if all are familiar        
    ELSE
    w.frequency_id BETWEEN 1 AND 5000
  END

-- select one random query word (w.word_es) to return from filtered-range subset produced by main WHERE clause
ORDER BY RANDOM()
LIMIT 1
;
