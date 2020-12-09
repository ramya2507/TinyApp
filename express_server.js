const express = require('express');
const app = express();
const PORT = 8080; //default port
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set('view engine','ejs'); //EJS as templating engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//function to generate random string for short url
const generateRandomString = () => {
  return Math.random().toString(36).slice(2,8);
};
//to render root page
app.get('/', (req, res) => {
  res.send('Hello!');
});

//cookie to store username
app.post('/login',(req,res) => {
  const username = req.body.username;
  res.cookie('username',username);
  res.redirect('/urls');
});

//method to clear cookie
app.post('/logout',(req,res) => {
  res.clearCookie('username');
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
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

//to get a single short and long urls
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
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
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL : req.body.longURL,
    username: req.cookies["username"],
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