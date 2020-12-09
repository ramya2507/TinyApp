const express = require('express');
const app = express();
const PORT = 8080; //default port
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.set('view engine','ejs'); //EJS as templating engine
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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

//method to save the username and password registered
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
  console.log(users[id]);
  res.cookie('userid',id);
  res.redirect('/urls');  
});

//cookie to store username
app.post('/login',(req,res) => {
  res.redirect('/urls');
});

//method to clear cookie
app.post('/logout',(req,res) => {
  res.clearCookie('userid');
  res.redirect('/urls');
});

//method to return registeration template
app.get('/register',(req,res) =>{
  res.render('registeration');
})

app.get('/urls.json',(req,res) => {
  res.json(urlDatabase);
});

//to get all the short and long urls
app.get('/urls', (req, res) => {
  let userObj = {};
  for(let user in users){
    if(user === req.cookies['userid']){
      userObj = users[user];
    }
  }
  const templateVars = {
    user: userObj,
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

//to get a single short and long urls
app.get('/urls/:shortURL', (req, res) => {
  let userObj = {};
  for(let user in users){
    if(user === req.cookies['userid']){
      userObj = users[user];
    }
  }
  const templateVars = {
    user: userObj,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render('urls_show',templateVars);
});
//Renders form to enter long url
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

//to redirect to urls after the creating a new URL
app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`urls/${shortURL}`);
});

//redirecting to long URLs for the corresponding short URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//to delete a url
app.post('/urls/:shortURL/delete',(req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//post method for updating
app.post('/urls/:shortURL/update',(req, res) => {
  let userObj = {};
  for(let user in users){
    if(user === req.cookies['userid']){
      userObj = users[user];
    }
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL : req.body.longURL,
    user:userObj,  
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