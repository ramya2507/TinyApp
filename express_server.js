const express = require('express');
const app = express();
const PORT = 8080; //default port

app.set('view engine','ejs') //EJS as templating engine 

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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

app.get('/urls/:shortURL',(req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL : urlDatabase[req.params.shortURL]};
  res.render('urls_show', templateVars);
});

app.get('/hello', (req, resp) => {
  resp.send('<html><body>Hello <b>World</b></body></html>\n')
});

//to listen to the port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});