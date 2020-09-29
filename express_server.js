const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//To generate a unique Id while adding an entry to DB
function generateRandomString() {
  let array = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randString = "";

  randString += array[Math.floor(Math.random() * array.length)];
  array += "0123456789";

  while (randString.length < 7) {
    randString += array[Math.floor(Math.random() * array.length)];
  }
  return randString;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//To display the list of urls
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

//To render urls_new.ejs.ie to display the page to add a new url to tiny app
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//To filter for each url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

//To submit a form on creating a new URL
app.post("/urls", (req, res) => {
  let randString = generateRandomString();
  urlDatabase[randString] =req.body.longURL
  console.log(urlDatabase);
  
  res.redirect(`/urls/${randString}`); 
});

//To redirect from short url to Long
app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  //let longURL = urlDatabase[shortURL];
  console.log(urlDatabase[req.params.shortURL]);
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});

//To deleete a URL
app.post('/urls/:shortURL/delete',(req,res)=>{

  console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
