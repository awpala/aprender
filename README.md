# ¡Aprender!

## Dependencies and Usage

To deploy locally, clone repository and issue terminal command `npm install` from root directory to install dependencies. (***N.B.*** Requires `node.js` v.14.x higher and `npm` v.6.x.)

**Live version**: [aprender.tech](http://aprender.tech)

## Technologies Used

**Client**: React, Sass/SCSS, HTML

  * ***React***: Hooks for UI components, Redux for state management

**Server**: Node.js, Express

**Database**: PostgreSQL

### **Local Setup Instructions**

***N.B.*** All paths referenced in the following sections are relative to the top-level directory (i.e., `aprender`). Furthermore, terminal commands assume a UNIX-based terminal (e.g., `bash`), running in the top-level directory.

#### **Preliminaries**

Before proceeding, ensure you have local dependencies as follows:
* Node v.14.x
* npm v.6.x
* yarn v.1.x
* PostgreSQL (latest LTS)

Pull down the repository locally as follows:

```bash
git clone https://github.com/awpala/aprender.git
cd aprender
```

Install dependencies as follows:

```bash
yarn install
```

#### **Environment Variables**

***N.B.*** `<value>` indicates a value to be substituted.

Create a new file `.env` in the top-level directory, and define the following environment variables (cf. file `/sample.env` for reference):

`SERVER_PORT`
```
SERVER_PORT=5555
```
* ***N.B.***: To change to a different server port, update file `/package.json` accordingly (cf. field `"proxy":"http://localhost:<port-goes-here>"`)

`CONNECTION_STRING`
```
CONNECTION_STRING=postgres://<user>:<password>@<location-url>:<port>/<db-name>?ssl=disable
```
  * Above format is for PostgreSQL connection ([reference](https://stackoverflow.com/a/20722229))

`SESSION_SECRET`
```
SESSION_SECRET=<alphanumeric-string>
```
  * Create a custom alphanumeric-string secret (a strong-password generator is advised)

#### **Launching the Application**

Before proceeding, ensure that the PostgreSQL database is seeded. To accomplish this, run the statements contained in the files of directory `/db/seed/` in the appropriate database (run `seed.sql` first, followed by the other files).
  * ***N.B.*** The seed data for table `word` is not publicly available.

Run the server application as follows:

```bash
node server
```
  * Server starts on port `5555` by default, unless specified otherwise

In a ***separate*** terminal, run the client application as follows:

```bash
yarn start
```
  * Client starts on port `3000` by default

To access the application, use the provided user `guest` (cf. file `/db/seed/user_data.sql`) via `Log in as guest` button, or otherwise register a new user using the form on the landing page (cf. `/src/components/Landing`).

## About ¡Aprender!

### Purpose and Methodology

The purpose of this application is to train the user's familiarity with Spanish vocabulary. The set of words included in this application are the top 5000 Spanish words in common usage, based on linguistic analysis of spoken and written word. The **frequency ID** identifies a given word's ranking by this methodology (i.e., ID 1 is the most frequently used Spanish word, whereas ID 5000 is the 5000th most frequently used Spanish word).

### Usage

The "Vocab" page randomly queries a word from a dynamically generated range, starting with the top 100 words. Once these words are familiarized, the range expands to the top 500 words. If any words from the preceding top 100 range become unfamiliar in this phase, the selection will adjust to focus on these words before returning to the top 500 range. The application proceeds in this manner through the top 500, top 1000, and then top 5000 words ranges.

In general, it is ill-advised to "guess" a selection; rather, "I don't know!" should be selected if a word is unfamiliar. This is more conducive to training the user's procedural memory in order to promote retention of unfamiliar words (i.e., returning these words into the "unfamiliar pool" of randomly generated candidate query words instead, for subsequent re-evaluation).

Additionally, the "Profile" page summarizes progress on gaining familiarity with the 5000 words. Summaries are provided with respect to **cognates** (words that share a resemblance between Spanish and English, i.e., via common etymology) and **non-cognates** (unresembling words).
