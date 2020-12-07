const express = require('express');
const app = express();
const PORT = 8080; //default port

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

//to listen to the port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});