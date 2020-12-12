const express = require('express');
const app = express();
const PORT = 8080; //default port
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateRandomString, getUserByEmail, urlsForUser, validateEmailPassword } = require('./helper');

app.set('view engine','ejs'); //EJS as templating engine
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({ name: 'session', secret: 'secret', }));

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID", },
  "9sm5xK": { longURL:"http://www.google.com", userID: "userRandomID", }
};

//object to store users information
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user1@example.com",
    password: bcrypt.hashSync("cat", saltRounds),
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dog", saltRounds),
  }
};

//to render root page
app.get('/', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

//method to return registeration template
app.get('/register',(req,res) =>{
  const templateVars = { user: users[req.session.user_id], };
  res.render('registeration', templateVars);
});

//method to return login template
app.get('/login',(req,res) =>{
  const templateVars = { user: users[req.session.user_id], };
  res.render('login', templateVars);
});

//POST for registeration
app.post('/register',(req,res) => {
  const id = generateRandomString();
  for (let user in users) {
    if (users[user]['email'] === req.body.email) {
      res.status(400).send('The email already exists');
    }
  }
  if (req.body.email && req.body.password) {
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    users[id] = {
      id,
      email:req.body.email,
      password:hashedPassword,
    };
    req.session.user_id = users[id]['id'];
    res.redirect('/urls');
  } else {
    res.status(400).send('Enter valid email and password');
  }
});

//POST for login
app.post('/login',(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (validateEmailPassword(email, password, users)) {
    let user = getUserByEmail(email,users);
    req.session.user_id = user['id'];
    res.redirect('/urls');
  } else {
    res.status(400).send('Invalid email');
  }
});

//method to clear cookie
app.post('/logout',(req,res) => {
  req.session = null;
  res.redirect('/urls');
});

//to get all the short and long urls
app.get('/urls', (req, res) => {
  const user = users[req.session.user_id];
  if (user) {
    const userUrls = urlsForUser(user.id, urlDatabase);
    const templateVars = { user, urls: userUrls, };
    res.render('urls_index', templateVars);
  } else {
    const templateVars = { user:undefined, urls:undefined };
    res.render('urls_index',templateVars);
  }
});

//Renders form to enter long url
app.get('/urls/new', (req, res) => {
  const user = users[req.session.user_id];
  if (user) {
    const templateVars = { user };
    res.render('urls_new',templateVars);
  } else {
    res.redirect('/login');
  }
});

//to get a single short and long urls
app.get('/urls/:shortURL', (req, res) => {
  const user = users[req.session.user_id];
  if (!urlDatabase[req.params.shortURL]) {
    res.sendStatus(404);
  } else if (!user) {
    res.redirect('/login');
  } else if (urlDatabase[req.params.shortURL].userID === user['id']) {
    const templateVars = {
      user,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]['longURL'],
    };
    res.render('urls_show',templateVars);
  } else {
    res.sendStatus(400);
  }
});

//to redirect to urls after the creating a new URL
app.post('/urls', (req, res) => {
  const user = users[req.session.user_id];
  if (user) {
    const longURL = req.body.longURL;
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: longURL,
      userID: user['id'],
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.sendStatus(403);
  }
});

//redirecting to long URLs for the corresponding short URL
app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL]['longURL'];
    res.redirect(longURL);
  } else {
    res.sendStatus(404);
  }
  
});

//to delete a url
app.post('/urls/:shortURL/delete',(req, res) => {
  const user = users[req.session.user_id];
  const shortURL = req.params.shortURL;
  if (user['id'] === urlDatabase[shortURL]['userID']) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(400).send('Login first');
  }
});

//post method for updating
app.post('/urls/:shortURL/update',(req, res) => {
  const user = users[req.session.user_id];
  const shortURL = req.params.shortURL;
  if (user['id'] === urlDatabase[shortURL]['userID']) {
    urlDatabase[shortURL]['longURL'] = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.status(400).send('Login first');
  }
});

//to listen to the port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});