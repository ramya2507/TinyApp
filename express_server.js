const express = require('express');
const app = express();
const PORT = 8080; //default port
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { validateEmailPassword, getUserId } = require('./helper');

app.set('view engine','ejs'); //EJS as templating engine
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": {longURL:"http://www.google.com", userID: "userRandomID"}
};

//object to store users information
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

//function to generate random string for short url
const generateRandomString = () => {
  return Math.random().toString(36).slice(2,8);
};
//to render root page
app.get('/', (req, res) => {
  res.send('Hello!');
});

//method to return registeration template
app.get('/register',(req,res) =>{
  const templateVars = { user: req.cookies['user'],};
  res.render('registeration', templateVars);
});

//method to return login template
app.get('/login',(req,res) =>{
  const templateVars = { user: req.cookies['user'],};
  res.render('login', templateVars);
});

app.get('/urls.json',(req,res) => {
  res.json(urlDatabase);
});

//POST for registeration
app.post('/register',(req,res) => {
  const id = generateRandomString();
  for(let user in users){
    if (users[user]['email'] === req.body.email){
      res.status(400);
      res.send('The email already exists');
    } 
  } 
  if(req.body.email && req.body.password ){
    users[id] = {
      id,
      email:req.body.email,
      password:req.body.password
    };
  } else {
    res.status(400);
    res.send('Enter valid email and password');
  }
  const user = users[id];
  console.log(user);
  res.cookie('user',user);
  res.redirect('/urls');  
});

//POST for login
app.post('/login',(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (validateEmailPassword(email, password, users)) {
    let user = getUserId(email,users);
    res.cookie('user',user);
    res.redirect('/urls'); 
  }
  res.status(400);
  res.send('Invalid email')
});

//method to clear cookie
app.post('/logout',(req,res) => {
  res.clearCookie('user');
  res.redirect('/urls');
});

//to get all the short and long urls
app.get('/urls', (req, res) => {
  const templateVars = {
    user: req.cookies['user'],
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});
//Renders form to enter long url
app.get('/urls/new', (req, res) => {
  const user = req.cookies['user'];
  if(user){
    const templateVars = { user };
    res.render('urls_new',templateVars);
  } else {
    res.redirect('/login');
  }
    
});


//to get a single short and long urls
app.get('/urls/:shortURL', (req, res) => {
  let user = req.cookies['user'];
  if (!urlDatabase[req.params.shortURL]) {
    res.sendStatus(404);
  } else if(!user){
    res.redirect('/login');
  } else if(urlDatabase[req.params.shortURL].userID === user['id']) {
    const templateVars = {
      user: req.cookies['user'],
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]['longURL'],
    };
    res.render('urls_show',templateVars);
  } 
});

//to redirect to urls after the creating a new URL
app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`urls/${shortURL}`);
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
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//post method for updating
app.post('/urls/:shortURL/update',(req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL : req.body.longURL,
    user: req.cookies['user'],  
  };
  res.render('urls_show', templateVars);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

//to listen to the port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});