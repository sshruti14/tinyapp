const express = require("express");
const cookieParser = require("cookie-parser");
const util = require("util");
const { getUserByEmail,checkExistingUser } = require("./helpers.js");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user1@example.com",
    password: "user1",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "user2",
  },
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
  let userId = req.cookies["user_id"];
  console.log("User Id in fetch /urls" + userId);
  let user = users[userId];

  console.log(`User Obj value ${util.inspect(user)}`);

  const templateVars = {
    user: user,
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

//To render urls_new.ejs.ie to display the page to add a new url to tiny app
app.get("/urls/new", (req, res) => {
  let userId = req.cookies["user_id"];
  let user = users[userId];

  const templateVars = {
    user: user,
  };
  res.render("urls_new", templateVars);
});

//To filter for each url
app.get("/urls/:shortURL", (req, res) => {
  let userId = req.cookies["user_id"];
  let user = users[userId];

  const templateVars = {
    user: user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

//To submit a form on creating a new URL
app.post("/urls", (req, res) => {
  let randString = generateRandomString();
  urlDatabase[randString] = req.body.longURL;
  console.log(urlDatabase);

  res.redirect(`/urls/${randString}`);
});

//To redirect from short url to Long
app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  //let longURL = urlDatabase[shortURL];
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//To delete a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//Post a updated URL
app.post("/urls/:shortURL", (req, res) => {
  const shortUrl = req.params.shortURL;
  // const userURL = ;
  console.log(req.body.newLongURL);
  urlDatabase[shortUrl] = req.body.newLongURL;
  res.redirect("/urls");
});

//To display the login form
app.get("/login", (req, res) => {
  let userId = req.cookies["user_id"];
  let user = users[userId];

  const templateVars = {
    user: user,
  };
  res.render("login", templateVars);
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//to submit the login request
app.post("/login", (req, res) => {
  const user_id = getUserByEmail(users, req.body.email);

  res.cookie("user_id", user_id);
  res.redirect("/urls");
});

//To view the registration form
app.get("/register", (req, res) => {
  const templateVars = {
    user: undefined,
  };
  res.render("register", templateVars);
});

//To register a new user
app.post("/register", (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;
  const id = generateRandomString();

  if (!email || !pass) {
    res.status(400).send("Please enter email or password to register");
  } else if (checkExistingUser(users, req.body.email)) {
    res.status(400).send("User already exists.");
  } else {
    users[id] = {
      id: id,
      email: email,
      password: pass,
    };
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
