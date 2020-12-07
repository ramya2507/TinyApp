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

app.get('/hello', (req, resp) => {
  resp.send('<html><body>Hello <b>World</b></body></html>\n')
});

//to listen to the port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});