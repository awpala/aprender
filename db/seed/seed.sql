CREATE TABLE part_of_speech (
  pos_id INTEGER PRIMARY KEY UNIQUE NOT NULL,
	pos_abbreviated TEXT,
	pos_full TEXT,
	pos_standardized TEXT
);

CREATE TABLE word (
	frequency_id INTEGER PRIMARY KEY UNIQUE NOT NULL,
	word_es TEXT,
	part_of_speech_id INTEGER REFERENCES part_of_speech(pos_id),
	word_en TEXT,
	is_cognate BOOLEAN,
	phrase_es TEXT,
	phrase_en TEXT
);

CREATE TABLE users (
	user_id	SERIAL PRIMARY KEY UNIQUE NOT NULL,
	first_name VARCHAR(30),
	last_name VARCHAR(50),
	username VARCHAR(70),
	password VARCHAR(200)
);

CREATE TABLE profile (
	user_id INTEGER REFERENCES users(user_id),
	frequency_id INTEGER REFERENCES word(frequency_id),
	is_familiar BOOLEAN DEFAULT FALSE,
	familiarity_score INTEGER DEFAULT 0,
	encounters INTEGER DEFAULT 0,
	is_saved BOOLEAN DEFAULT FALSE,
	PRIMARY KEY(user_id, frequency_id) -- composite primary key
);

-- indexes
CREATE INDEX idx_word_part_of_speech ON word(part_of_speech_id);
CREATE INDEX idx_profile_users ON profile(user_id);
CREATE INDEX idx_profile_word ON profile(frequency_id);
