const { assert } = require('chai');

const { getUserByEmail } = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user1@example.com", 
    password: "cat"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com", 
    password: "dog"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user1@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput);
  });
  it('should returned undefined when passed an email that doesn\'t exist', () => {
    const user = getUserByEmail('beep@boop.com',testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});