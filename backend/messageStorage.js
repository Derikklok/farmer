// messageStorage.js

let storedMessage = '';

const storeMessage = (message) => {
  storedMessage = message;
  console.log(`Message stored: "${storedMessage}"`);
};

module.exports = { storeMessage };
