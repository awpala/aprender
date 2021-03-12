require('dotenv').config();

const express = require('express');
const massive = require('massive');
const session = require('express-session');

const authCtrl = require('./controllers/authCtrl');
const profileCtrl = require('./controllers/profileCtrl');
const vocabCtrl = require('./controllers/vocabCtrl');

const path = require('path');

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

// build configuration (client redirect)
app.use(express.static(__dirname + '/../build'));

// -- route-level middleware

// auth endpoints
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/session', authCtrl.getSession);
app.post('/auth/logout', authCtrl.logout);

// vocab endpoints
app.get('/api/vocab/:userId', vocabCtrl.getUserWord);
app.put('/api/vocab/:userId', vocabCtrl.updateWord);

// profile endpoints
app.get('/api/profile/:id', profileCtrl.getUserProfile);
app.put('/api/profile/:id', profileCtrl.resetUserProfile);
app.delete('/api/profile/:id', profileCtrl.deleteUserProfile);

// build configuration (client redirect)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
});

// -- server listening
app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));
