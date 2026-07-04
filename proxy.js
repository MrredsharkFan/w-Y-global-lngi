import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, set, onValue, onDisconnect, onChildAdded, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1WnDm6XEtVNMFHFXDV9QCLVlJSo4-nrQ",
  authDomain: "wy-sequence-lngi.firebaseapp.com",
  databaseURL: "https://wy-sequence-lngi-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wy-sequence-lngi",
  storageBucket: "wy-sequence-lngi.firebasestorage.app",
  messagingSenderId: "171132084225",
  appId: "1:171132084225:web:44253d73a290bbf8d62000"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Function to handle sign-in with automatic retries
function loginWithRetry(auth, delay = 2000) {
  signInAnonymously(auth)
    .then(() => {
      console.log("Successfully signed in anonymously!");
    })
    .catch((error) => {
      // Double the wait time for the next retry, capping it at 30 seconds
      const nextDelay = Math.min(delay * 2, 30000); 
      setTimeout(() => loginWithRetry(auth, nextDelay), delay);
    });
}

// Start the sign-in process
loginWithRetry(auth);

onAuthStateChanged(auth, (user) => {
  if (!user) return;
  const userId = user.uid;
  const userRef = ref(db, "online/" + userId);
  const connectedRef = ref(db, ".info/connected");

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      set(userRef, true);
      onDisconnect(userRef).remove();
    }
  });
});

// OPTIMIZED COUNTER: Use child listeners instead of pulling the entire snapshot object
const onlineRef = ref(db, "online");
const onlineDiv = document.getElementById("online");
let onlineCount = 0;

function updateOnlineUI() {
  if (onlineDiv) {
    onlineDiv.textContent = `🟢 ${onlineCount} user${onlineCount === 1 ? "" : "s"} online`;
  }
}

// Triggered individually when a user comes online
onChildAdded(onlineRef, () => {
  onlineCount++;
  updateOnlineUI();
});

// Triggered individually when a user goes offline
onChildRemoved(onlineRef, () => {
  onlineCount = Math.max(0, onlineCount - 1);
  updateOnlineUI();
});