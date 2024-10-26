// script.js

document.getElementById('sendButton').addEventListener('click', function() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value;
    
    if (message.trim() !== "") {
        addMessage('Usuario: ' + message);
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
        console.log(responseBot)
        const response = "Bot: " + responseBot;
        addMessage(response);
}

async function generateResponse(message) {
        const response = await fetch('/bot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
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