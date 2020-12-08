const express = require('express');
const app = express();
const PORT = 8080; //default port

app.set('view engine','ejs'); //EJS as templating engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//function to generate random string for short url
function generateRandomString() {
  return Math.random().toString(36).slice(2,8);
};

app.get('/', (req, resp) => {
  resp.send('Hello!');
});

app.get('/urls.json',(req,resp) => {
  resp.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

//Renders form to enter long url
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

//redirecting to long URLs to the corresponding short URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//Displays short and corresponding long URLS
app.get('/urls/:shortURL',(req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL : urlDatabase[req.params.shortURL]};
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`urls/${shortURL}`); 
});

app.get('/hello', (req, resp) => {
  resp.send('<html><body>Hello <b>World</b></body></html>\n');
});

//to listen to the port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});