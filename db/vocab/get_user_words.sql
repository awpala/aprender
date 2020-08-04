SELECT
    w.word_es AS quiz_word_es,
    w.frequency_id AS quiz_word_es_fid,
    pos.pos_full AS part_of_speech_full,
    w.word_en AS correct_word_en,
    p.is_familiar,
    p.familiarity_score,
    p.encounters,
    ARRAY(SELECT word_en
        FROM word
        WHERE
            -- TODO: 
                -- case: part of speech is article, then all 3 results only
            -- else:
            frequency_id != w.frequency_id
            AND frequency_id IN (
                SELECT frequency_id 
                FROM word
                WHERE part_of_speech_id = w.part_of_speech_id 
                ORDER BY RANDOM() 
                LIMIT 3
            )
    ) AS incorrect_words_en,
    w.phrase_es,
    w.phrase_en
FROM word AS w
INNER JOIN profile AS p
    ON w.frequency_id = p.frequency_id
INNER JOIN part_of_speech AS pos
    ON w.part_of_speech_id = pos.pos_id
WHERE 
    p.user_id = $1 AND
    CASE
        -- Case 1) randomly select from top 100 if any freq_id <= 100 are unfamiliar
        WHEN
            EXISTS (
                SELECT * 
                FROM profile
                WHERE user_id = $1
                    AND frequency_id <= 100
                    AND NOT is_familiar
            )
            THEN 
                (p.frequency_id BETWEEN 1 AND 100)
                AND p.familiarity_score IN 
                    (SELECT MIN(familiarity_score)
                    FROM profile
                    WHERE user_id = $1
                    AND NOT is_familiar 
                    GROUP BY familiarity_score
                    ORDER BY 1
                    LIMIT 1)
        -- Case 2) randomly select from top 500 if any freq_id <= 500 are unfamiliar and freq_id <= 100 are familiar
        WHEN
            EXISTS (
                SELECT * 
                FROM profile
                WHERE user_id = $1
                    AND frequency_id <= 500
                    AND NOT is_familiar
            )
            THEN 
                (p.frequency_id BETWEEN 101 AND 500)
                    AND p.familiarity_score IN 
                        (SELECT MIN(familiarity_score)
                        FROM profile
                        WHERE user_id = $1
                        AND NOT is_familiar 
                        GROUP BY familiarity_score
                        ORDER BY 1
                        LIMIT 1)
                OR
                    p.frequency_id BETWEEN 1 AND 100
        -- Case 3) randomly select from top 1000 if any freq_id <= 1000 are unfamiliar and freq_id <= 500 are familiar
        WHEN
            EXISTS (
                SELECT * 
                FROM profile
                WHERE user_id = $1
                    AND frequency_id <= 1000
                    AND NOT is_familiar
            )
            THEN 
                (p.frequency_id BETWEEN 501 AND 1000)
                    AND p.familiarity_score IN 
                        (SELECT MIN(familiarity_score)
                        FROM profile
                        WHERE user_id = $1
                        AND NOT is_familiar 
                        GROUP BY familiarity_score
                        ORDER BY 1
                        LIMIT 1)
                OR
                    p.frequency_id BETWEEN 1 AND 500                
        -- Case 4) randomly select from top 5000 if any freq_id <= 5000 are unfamiliar and freq_id <= 1000 are familiar
        WHEN
            EXISTS (
                SELECT * 
                FROM profile
                WHERE user_id = $1
                    AND frequency_id <= 5000
                    AND NOT is_familiar
            )
            THEN 
                (p.frequency_id BETWEEN 1001 AND 5000)
                    AND p.familiarity_score IN 
                        (SELECT MIN(familiarity_score)
                        FROM profile
                        WHERE user_id = $1
                        AND NOT is_familiar 
                        GROUP BY familiarity_score
                        ORDER BY 1
                        LIMIT 1)
                OR
                    p.frequency_id BETWEEN 1 AND 1000
        -- Case DEFAULT) randomly select any word if all are familiar        
        ELSE
            p.frequency_id BETWEEN 1 AND 5000
    END
-- select one random query word (w.word_es) to return from filtered-range subset produced by WHERE clause
ORDER BY RANDOM()
LIMIT 1
;