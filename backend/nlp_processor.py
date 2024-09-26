# nlp_processor.py

import spacy
import mysql.connector
from fuzzywuzzy import fuzz


# Load the spaCy model for English
nlp = spacy.load('en_core_web_sm')

# Connect to MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="sachin1605",
    database="chatbot_db"
)

def get_response(message):
    # Process the message with spaCy NLP
    doc = nlp(message)

    # Convert the message to lowercase
    message_lower = message.lower()

    # Query the knowledge base for matching questions
    cursor = db.cursor()
    cursor.execute("SELECT question, answer FROM knowledge_base")
    results = cursor.fetchall()
    
    best_match = None
    highest_ratio = 0

    # # Search for a match in the knowledge base
    # for question, answer in results:
    #     if question.lower() in message_lower:
    #         return answer

    # # Default response if no match is found
    # return "Sorry, I don't have an answer for that."
    for question, answer in results:
        ratio = fuzz.ratio(message_lower, question.lower())
        if ratio > highest_ratio:
            highest_ratio = ratio
            best_match = answer

    if highest_ratio > 70:  # 70 is an arbitrary threshold for match strength
        return best_match
    else:
        return "Sorry, I don't have an answer for that."
    
    

if __name__ == '__main__':
    # Example usage (for testing)
    user_message = "What is AI?"
    response = get_response(user_message)
    print(response)

