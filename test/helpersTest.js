const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user1@example.com", 
    password: "user1"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers,"user1@example.com")
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(user,expectedOutput);
  });

  it('should return undefined with invalid email', function() {
    const user = getUserByEmail(testUsers,"user8@example.com")
    const expectedOutput = undefined;
    // Write your assert statement here
    assert.equal(user,expectedOutput);
  });


});