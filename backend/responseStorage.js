// responseStorage.js

let storedResponse = '';

const storeResponse = (response) => {
  storedResponse = response;
  console.log(`Response stored: "${storedResponse}"`);
};

module.exports = { storeResponse };
