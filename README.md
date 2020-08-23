# ¡Aprender!

## Dependencies and Usage

To deploy locally, clone repository and issue shell command `npm install` to install dependencies. (N.B. Requires `node.js` v.12 or higher.)

**Live version**: [aprender.tech](http://aprender.tech)

## Technologies Used

**Client**: React, Sass/SCSS, HTML

  * ***React***: Hooks for UI components, Context API for state management

**Server**: Node.js, Express

**Database**: PostgreSQL

## About ¡Aprender!

### Purpose and Methodology

The purpose of this application is to train the user's familiarity with Spanish vocabulary. The set of words included in this application are the top 5000 Spanish words in common usage, based on linguistic analysis of spoken and written word. The **frequency ID** identifies a given word's ranking by this methodology (i.e., ID 1 is the most frequently used Spanish word, whereas ID 5000 is the 5000th most frequently used Spanish word).

### Usage

The "Vocab" page randomly queries a word from a dynamically generated range, starting with the top 100 words. Once these words are familiarized, the range expands to the top 500 words. If any words from the preceding top 100 range become unfamiliar in this phase, the selection will adjust to focus on these words before returning to the top 500 range. The application proceeds in this manner through the top 500, top 1000, and then top 5000 words ranges.

In general, it is ill-advised to "guess" a selection; rather, "I don't know!" should be selected if a word is unfamiliar. This is more conducive to training the user's procedural memory in order to promote retention of unfamiliar words (i.e., returning these words into the "unfamiliar pool" of randomly generated candidate query words instead, for subsequent re-evaluation).

Additionally, the "Profile" page summarizes progress on gaining familiarity with the 5000 words. Summaries are provided with respect to **cognates** (words that share a resemblance between Spanish and English, i.e., via common etymology) and **non-cognates** (unresembling words).