import React, { useState } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]); // To store chat history
  const [inputMessage, setInputMessage] = useState(""); // To handle input message
  const [selectedChat, setSelectedChat] = useState(null); // To handle selected chat
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // To toggle sidebar visibility

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return; // Prevent empty messages

    // Send the message to the backend to store it in MySQL and get a bot response
    axios
      .post("http://localhost:5000/api/message", { message: inputMessage })
      .then((response) => {
        const botMessage = { sender: "bot", text: response.data.response };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  
    // Clear input field
    setInputMessage("");
    passToServer();
  };

  

  const passToServer = async () => {
    if (inputMessage.trim() === "") return; // Prevent empty messages

    // Add user message to the chat
    const newMessages = [...messages, { sender: "user", text: inputMessage }];
    setMessages(newMessages);

    // Send the message to the backend and get the response
    try {
      const response = await axios.post('http://localhost:5001/api/message', {
        message: inputMessage,
      }
    );

      // Add bot response after receiving from backend
      const botMessage = { sender: "bot", text: response.data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Error sending message to the backend:", error);
    }

    // Clear input field
    setInputMessage("");
  };

  // Function to handle chat selection
  const handleChatSelection = (chatId) => {
    setSelectedChat(chatId);
    setMessages([{ sender: "bot", text: "Hello! I am your chatbot. I can assist with various tasks. Ask me anything!" }]);
    setIsSidebarOpen(false); // Close sidebar on chat selection
  };

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-poppins">
      {/* Sidebar for recent chats */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-gray-800 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 text-lg font-semibold flex justify-between items-center">
          <span>Recent</span>
          {/* Close button inside the sidebar */}
          <button
            onClick={toggleSidebar}
            className="text-white px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-500 hover:text-cyan-400 focus:outline-none"
          >
            Close
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {[1, 2, 3].map((chatId) => (
            <div
              key={chatId}
              onClick={() => handleChatSelection(chatId)}
              className="p-4 cursor-pointer hover:bg-gray-700 transition"
            >
              Chat {chatId}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col w-full h-screen">
        {/* Header */}
        <div className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
          {/* Toggle sidebar button */}
          <button
            onClick={toggleSidebar}
            className="text-white px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 focus:outline-none"
          >
            ☰
          </button>
          <h1 className="text-2xl font-semibold text-center w-full">Lega-Ai</h1>
        </div>

        {/* Chat Window */}
        <div className="flex-grow p-6 overflow-auto bg-gray-800">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Example Cards Section */}
            {/* You can add your example cards here */}

            {/* Chat Messages */}
            <div className="space-y-4">
              {/* Render Messages */}
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-4 py-2 rounded-lg shadow w-fit max-w-xs ${
                      message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800 p-4 shadow-md">
          <div className="max-w-2xl mx-auto flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage(); // Allow pressing 'Enter' to send
              }}
            />
            <button
              onClick={() => {
                
                                handleSendMessage();
                                //passToServer();
                             }}
                              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none"
                                >Send
                            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
