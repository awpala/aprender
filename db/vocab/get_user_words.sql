SELECT
    w.word_es AS quiz_word_es,
    -- TODO: add part of speech (via INNER JOIN pos)
    w.frequency_id AS quiz_word_es_fid,
    pos.pos_full AS part_of_speech_full,
    w.word_en AS correct_word_en,
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
WHERE p.user_id = $1
ORDER BY RANDOM()
LIMIT 1
;