// script.js

document.getElementById('sendButton').addEventListener('click', function() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value;
    
    if (message.trim() !== "") {
        addMessage('Usuario: ' + message + "\n\n");
        userInput.value = '';
        respondToUser (message);
    }
});

function addMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Desplazar hacia abajo
}

async function respondToUser(message) {
        const responseBot = await generateResponse(message);
        const response = "Bot: " + formatResponse(responseBot);
        addMessage(response);
}

function formatResponse(response) {
    const formattedResponse = response
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/\d+\.\s*/g, '')
       .replace(/:\s*/g, ': ')
       .trim();
    
    return formattedResponse;
}

async function generateResponse(message) {
        const response = await fetch('/bot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
}

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('hidden');
}

function closeChatbot() {
    const chatbot = document.getElementById('chatbot');
    if(!chatbot.classList.contains('hidden')){
        chatbot.classList.add('hidden');
        return
    }
}