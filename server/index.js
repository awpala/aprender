require('dotenv').config();

const express = require('express'),
    massive = require('massive'),
    session = require('express-session');

const authCtrl = require('./controllers/authCtrl'),
    profileCtrl = require('./controllers/profileCtrl'),
    vocabCtrl = require('./controllers/vocabCtrl');

const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;

const app = express();

// -- top-level middleware
app.use(express.json());

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 365}
}));

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
})
.then(db => {
    app.set('db', db); // db connection
    console.log('db connected');
});

// -- route-level middleware

// auth endpoints
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

// vocab endpoints
app.get('/api/vocab/:id', vocabCtrl.getUserWords);
app.post('/api/vocab/:id', vocabCtrl.updateWord);

// profile endpoints
app.get('/api/profile/:id', profileCtrl.getUserProfile);

// -- server listening
app.listen(SERVER_PORT, () => console.log('Listening on REDACTED SERVER PORT'));