// nlpProcessor.js
const { knowledgeBase } = require('./knowledgeBase');

const processMessage = (message) => {
  // Basic matching to find a response in the knowledge base
  const lowerCaseMessage = message.toLowerCase();

  for (const question in knowledgeBase) {
    if (lowerCaseMessage.includes(question.toLowerCase())) {
      return knowledgeBase[question];
    }
  }

  return "Sorry, I don't have an answer for that. - js";
};

module.exports = { processMessage };