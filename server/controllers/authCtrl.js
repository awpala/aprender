const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const {firstName, lastName, username, password} = req.body;
    const db = req.app.get('db');

    const foundUser = await db.users.check_user({username});
    if(foundUser[0]) {
      return res.status(400).send('Username already in use')
    }

    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await db.users.register_user({firstName, lastName, username, hashedPassword});
    req.session.user = newUser[0];
    res.status(201).send(req.session.user);
  },
  login: async (req, res) => {
    const {username, password} = req.body;
    const db = req.app.get('db');

    const foundUser = await db.users.check_user({username});
    if(!foundUser[0]) {
      return res.status(400).send('Username not found');
    }

    const isAuthenticated = bcrypt.compareSync(password, foundUser[0].password);
    if(!isAuthenticated) {
      return res.status(401).send('Password is incorrect')
    }

    delete foundUser[0].password;
    req.session.user = foundUser[0];
    res.status(202).send(req.session.user);
  },
  loginGuest: async (req, res) => {
    const db = req.app.get('db');
    const guestUser = await db.users.check_user({ username: 'guest' });
    delete guestUser[0].password;
    req.session.user = guestUser[0];
    res.status(202).send(req.session.user);
  },
  getSession: (req, res) => {
    req.session.user
    ? res.status(200).send(req.session.user)
    : res.sendStatus(404);
  },
  logout: (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  }
}