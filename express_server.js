const express = require("express");
const cookieParser = require("cookie-parser");
const util = require("util");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session')

const {
  getUserByEmail,
  checkExistingUser,
  passwordMatch,
  urlsForUser,
} = require("./helpers.js");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

// const urlDatabase = {
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
// };

const urlDatabase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "userRandomID" },
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user2RandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user1@example.com",
    password: bcrypt.hashSync("user1", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password:bcrypt.hashSync("user2", 10),
  },
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['shruti'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

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
  let userId = req.session.user_id;
  let user = users[userId];

  const templateVars = {
    user: user,
    urls: urlsForUser(urlDatabase, userId),
  };

  if (userId) {
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

//To render urls_new.ejs.ie to display the page to add a new url to tiny app
app.get("/urls/new", (req, res) => {
  let userId = req.session.user_id;
  let user = users[userId];

  const templateVars = {
    user: user,
  };

  if (userId) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

//To filter for each url
app.get("/urls/:shortURL", (req, res) => {
  let userId = req.session.user_id;
  let user = users[userId];

  //console.log("Cookie Value inside edit" + req.session.user_id);
  if (!userId) {
    res.status(403).send("You are not logged in!");
    return;
  }

  if (urlDatabase[req.params.shortURL].userID !== userId) {
    res.status(403).send("This URL does not belong to you");
    return;
  } else {
    const templateVars = {
      user: user,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
    };
    res.render("urls_show", templateVars);
  }
});

//To submit a form on creating a new URL
app.post("/urls", (req, res) => {
  let randString = generateRandomString();
  urlDatabase[randString] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };
  res.redirect(`/urls/${randString}`);
});

//To redirect from short url to Long
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//To delete a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session.user_id) {
    res.status(403).send("You are not logged in!");
    return;
  }
  if (urlDatabase[req.params.shortURL].userID !== req.session.user_id) {
    res.status(403).send("This URL does not belong to you");
    return;
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});

//Post a updated URL
app.post("/urls/:shortURL", (req, res) => {
  const shortUrl = req.params.shortURL;
  urlDatabase[shortUrl].longURL = req.body.newLongURL;
  res.redirect("/urls");
});

//To display the login form
app.get("/login", (req, res) => {
  let userId = req.session.user_id;
  let user = users[userId];

  const templateVars = {
    user: user,
  };
  res.render("login", templateVars);
});

app.post("/logout", (req, res) => {
  //res.clearCookie("user_id");
  req.session.user_id=null;
  res.redirect("/urls");
});

//to submit the login request
app.post("/login", (req, res) => {
  const user_id = getUserByEmail(users, req.body.email);
  if (!checkExistingUser(users, req.body.email)) {
    res.status(403).send("Invalid credentials");
    return;
  } else if (!passwordMatch(bcrypt,user_id,users, req.body.password)) {
    res.status(403).send("User Password is wrong");
  } else {
    req.session.user_id= user_id;
    res.redirect("/urls");
  }
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
    req.session.user_id = id;
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
