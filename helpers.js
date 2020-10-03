//To fetch the user id from the email
const getUserByEmail = (users, email) => {
  for (let user in users) {
    if (users[user].email === email) {
      console.log('User Id Value'+users[user].id);
      return users[user].id;
    }
  }
};

//Function verify if the user exits before registering a new user
const checkExistingUser = function (users, email) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    } else {
      false;
    }
  }
};

//checks to see if password matches userid
const passwordMatch = (bcrypt,user_id,users, password) => {
  return bcrypt.compareSync(password, users[user_id].password);
}

//Function to filter the urls userwise
const urlsForUser =  function (urlDatabase,id) {
  let filteredObj = {};
  for (let item in urlDatabase) {
    if (urlDatabase[item].userID === id) {
      filteredObj[item] = urlDatabase[item];
    }
  }
  return filteredObj;
}

//To generate a unique Id while adding an entry to DB
const generateRandomString = function () {
  let array = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randString = "";

  randString += array[Math.floor(Math.random() * array.length)];
  array += "0123456789";

  while (randString.length < 7) {
    randString += array[Math.floor(Math.random() * array.length)];
  }
  return randString;
}

module.exports = { getUserByEmail, checkExistingUser,passwordMatch,urlsForUser,generateRandomString };
