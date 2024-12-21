
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, set, push, onValue, query, orderByChild, equalTo, get } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbbhY5INR8eecF3gXWwKB8pJ75Tko3Zpw",
  authDomain: "bondback-7664f.firebaseapp.com",
  databaseURL: "https://bondback-7664f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bondback-7664f",
  storageBucket: "bondback-7664f.firebasestorage.app",
  messagingSenderId: "108312823634",
  appId: "1:108312823634:web:eef02a0e5ea5b483761c8b",
  measurementId: "G-D8M41LHR1J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const messagesRef = ref(database, "messages");

// Elements from HTML
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message');
const chatHeader = document.getElementById('chat-header');
const userList = document.getElementById('user-list');
const searchUsers = document.getElementById('search-users');
const logoutBtn = document.getElementById('logout-btn');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

// Function to register the user and add them to the database
async function registerUser(email) {
  try {
    // Using the UID from Firebase Authentication as a unique user identifier
    const userId = auth.currentUser.uid;

    // Reference to the user's data in the database
    const userRef = ref(database, 'users/' + userId);

    // Add user information to the database (You can also store additional user details like username)
    await set(userRef, {
      email: email,
      username: email.split('@')[0]  // Optional: Generate a username from email or ask for a custom one
    });

    console.log("User registered and data added to Firebase");
  } catch (error) {
    console.error("Error registering user: ", error);
  }
}

// Function to load users after the user is logged in
function loadUsers() {
  const usersRef = ref(database, 'users'); // Get reference to the "users" node
  onValue(usersRef, (snapshot) => {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';  // Clear the list before adding new users

    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();  // Get the user data (email, username)
      const userItem = document.createElement('li');  // Create a new list item
      userItem.classList.add('list-group-item');  // Add Bootstrap styling
      userItem.textContent = userData.username || userData.email;  // Display username/email

      // Add event listener to select the user for chatting
      userItem.addEventListener('click', () => {
        selectUserForChat(userData);  // Function to handle when a user is selected
      });

      userList.appendChild(userItem);  // Add the user item to the list
    });
  });
}

// Function to handle user selection for chat
function selectUserForChat(userData) {
  const chatHeader = document.getElementById('chat-header');
  chatHeader.textContent = `Chat with ${userData.username || userData.email}`;  // Update the chat header

  // Optionally, store the selected user for later use (e.g., for sending messages)
  selectedUser = userData;
  
  // Load existing messages for this user
  loadMessagesForUser(selectedUser);
}

// Function to load messages between the current user and selected user
function loadMessagesForUser(selectedUser) {
  const messagesRef = ref(database, 'messages');
  onValue(messagesRef, (snapshot) => {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';  // Clear the existing messages

    snapshot.forEach((childSnapshot) => {
      const messageData = childSnapshot.val();
      // Check if the message is between the logged-in user and selected user
      if (messageData.sender === auth.currentUser.email && messageData.recipient === selectedUser.email) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sent');
        messageDiv.textContent = messageData.message;
        messagesContainer.appendChild(messageDiv);
      } else if (messageData.sender === selectedUser.email && messageData.recipient === auth.currentUser.email) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'received');
        messageDiv.textContent = messageData.message;
        messagesContainer.appendChild(messageDiv);
      }
    });
  });
}

// Send Message Functionality
const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", () => {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  if (message.trim()) {
    // Push the message to Firebase Realtime Database
    const messagesRef = ref(database, "messages");
    push(messagesRef, {
      sender: auth.currentUser.email,  // Sender's email
      recipient: selectedUser.email,  // Recipient's email
      message: message,
      timestamp: Date.now(),
    });

    messageInput.value = "";  // Clear input field
  }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password-input").value;

  try {
    // Attempt to log in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in: ", userCredential.user);

    // After successful login, load users
    loadUsers();  // Call the loadUsers function to populate the user list

  } catch (error) {
    console.error("Login failed: ", error.message);
    alert("Login failed: " + error.message);
  }
});
// Sign Up
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = registerEmail.value;
  const password = registerPassword.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('User signed up:', userCredential.user);
      registerForm.reset();
      authContainer.style.display = 'none';
      chatContainer.style.display = 'block';
      showUserList();
    })
    .catch((error) => {
      console.error('Error signing up:', error);
    });
});

// Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('User logged in:', userCredential.user);
      loginForm.reset();
      authContainer.style.display = 'none';
      chatContainer.style.display = 'block';
      showUserList();
    })
    .catch((error) => {
      console.error('Error logging in:', error);
    });
});

// Show Register Form
showRegisterBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});

// Show Login Form
showLoginBtn.addEventListener('click', () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Logout
logoutBtn.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      authContainer.style.display = 'block';
      chatContainer.style.display = 'none';
    })
    .catch((error) => {
      console.error('Error logging out:', error);
    });
});

// Searching users
searchUsers.addEventListener('input', (e) => {
  const queryText = e.target.value.toLowerCase();
  get(query(ref(database, 'users'), orderByChild('email'), equalTo(queryText)))
    .then(snapshot => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        userList.innerHTML = '';
        Object.values(users).forEach(user => {
          const userItem = document.createElement('li');
          userItem.classList.add('list-group-item');
          userItem.textContent = user.email;
          userItem.addEventListener('click', () => openChat(user.email));
          userList.appendChild(userItem);
        });
      }
    });
});

// Send Message
sendMessageBtn.addEventListener('click', () => {
  const messageText = messageInput.value;
  if (messageText.trim()) {
    const messageData = {
      sender: auth.currentUser.email,
      message: messageText,
      timestamp: Date.now(),
    };
    push(ref(database, 'messages'), messageData);
    messageInput.value = '';
  }
});

// Show messages for a user
function openChat(userEmail) {
  chatHeader.textContent = `Chatting with ${userEmail}`;
  const userMessagesRef = query(ref(database, 'messages'), orderByChild('timestamp'));
  onValue(userMessagesRef, (snapshot) => {
    chatBox.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message');
      if (message.sender === auth.currentUser.email) {
        messageDiv.classList.add('sent');
      } else {
        messageDiv.classList.add('received');
      }
      messageDiv.textContent = message.message;
      chatBox.appendChild(messageDiv);
    });
  });
}

// Show user list
function showUserList() {
  const usersRef = ref(database, 'users');
  onValue(usersRef, (snapshot) => {
    userList.innerHTML = '';
    snapshot.forEach(childSnapshot => {
      const user = childSnapshot.val();
      const userItem = document.createElement('li');
      userItem.classList.add('list-group-item');
      userItem.textContent = user.email;
      userItem.addEventListener('click', () => openChat(user.email));
      userList.appendChild(userItem);
    });
  });
}