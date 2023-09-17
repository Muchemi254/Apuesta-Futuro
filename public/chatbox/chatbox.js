import app from "../firebase-config.js"; // Import the Firebase app instance
import {
  getDatabase,
  ref,
  set,
  get,
  orderByChild,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

const auth = getAuth(app);
const database = getDatabase(app);

const isLoggedIn = localStorage.getItem('isLoggedIn');
const user = JSON.parse(localStorage.getItem("user"));
const userUid = user.uid;

const outgoing_msg = document.getElementById("outgoing_msg");
const date = new Date();
const usernamemsg = document.getElementById("username");
const sendMessageButton = document.getElementById("send_msg_btn");

const options = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  month: "long",
  day: "numeric",
};

// Format the date and time
const time_outgoing_msg = new Intl.DateTimeFormat("en-US", options).format(
  date
);

sendMessageButton.addEventListener("click", function () {
  const message = outgoing_msg.value;
  const timestamp = new Date().getTime();

  function generateRandomId(length) {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }

    return result;
  }
  // Generate a random unique identifier (you can use a library for this)
  const uniqueId = generateRandomId(8);
  const messageId = `${timestamp}-${uniqueId}`;
 

  //console.log(message);
  //console.log(time_outgoing_msg);
  if (user) {
    if (
      typeof message !== "undefined" &&
      message !== "" &&
      typeof time_outgoing_msg !== "undefined" &&
      time_outgoing_msg !== ""
    ) {
      const userUid = user.uid; // Replace with the actual user UID
      const senderIdentifier = 'sent';
      const messageDataRef = ref(
        database,
        `users/${userUid}/messageData/sent/${messageId}`
      );
      const messageData = {
        message: message,
        time_outgoing_msg: time_outgoing_msg,
        timestamp: timestamp,
        messageId: messageId,
        senderUserId:userUid,
        senderIdentifier: senderIdentifier,
        read: false,
        // Other user profile data...
      };

      set(messageDataRef, messageData)
        .then(() => {
          console.log("Profile data stored successfully.");
        })
        .catch((error) => {
          console.error("Error storing profile data:", error);
        });
    } else {
      console.error("message or time_outgoing_msg is undefined or empty.");
    }
  } else {
    console.error("No authenticated user.");
  }
});

const messageRef = ref(database, `users/${userUid}/messageData/sent`);
var messageIds = [];

function createAndAppendsentMessage(message, timestamp, senderIdentifier) {
  // Create a new div element with the given structure
  var messageDiv = document.createElement("div");
  if (senderIdentifier === "sent") {
    messageDiv.className = "sent-msg";
    messageDiv.innerHTML = `
      <div class="sent-chats-msg">
          <p class="multi-msg" id="sent_msg">${message}</p>
          <span class="time" id="time_sent_msg">${timestamp}</span>
      </div>
    `;
  } else if (senderIdentifier === "received") {
    messageDiv.className = "received-msg";
    messageDiv.innerHTML = `
      <div class="received-msg-inbox">
          <p class="multi-msg" id="received_msg">${message}</p>
          <span class="time" id="time_received_msg">${timestamp}</span>
      </div>
    `;
  }

  // Append the new message to the 'msg-page' class
  var msgPage = document.querySelector(".msg-page");
  msgPage.appendChild(messageDiv);
}

function handleNewDatasent(snapshot) {
  if (snapshot.exists()) {
    const messageData = snapshot.val();

    for (const messageId in messageData) {
      if (Object.hasOwnProperty.call(messageData, messageId)) {
        if (!messageIds.includes(messageId)) {
          const message = messageData[messageId].message;
          
          const timestamp = messageData[messageId].time_outgoing_msg;
          const senderIdentifier = messageData[messageId].senderIdentifier;
          createAndAppendsentMessage(message, timestamp, senderIdentifier);

          messageIds.push(messageId);

          var myDiv = document.querySelector(".msg-page");
          myDiv.scrollTop = myDiv.scrollHeight;
          var inputElement = document.getElementById("outgoing_msg");

          inputElement.value = "";
        }
      }
    }
  } else {
    console.log("No messages found for this user.");
  }
}

onValue(messageRef, handleNewDatasent, {
  onlyOnce: false,
});

const usernameRef = ref(database, `users/${userUid}/profiledata`);

// Retrieve data from the database
get(usernameRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const username = data.username;
      const firstName = data.firstname;
      const lastName = data.lastname;

      // Combine first name and last name into full name
      const fullName = `${firstName} ${lastName}`;
      const usernameElement = document.getElementById("username");

      // Update the content of the element with the fullName
      usernameElement.textContent = fullName;
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error("Error retrieving data:", error);
  });
