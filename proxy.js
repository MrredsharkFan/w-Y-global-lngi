// proxy : dont touch unless you understand
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js"; // connect
import {
  getDatabase,
  ref,
  set,
  onValue,
  onDisconnect,
  remove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js"; //import essentials func

const firebaseConfig = {
  apiKey: "AIzaSyC1WnDm6XEtVNMFHFXDV9QCLVlJSo4-nrQ",
  authDomain: "wy-sequence-lngi.firebaseapp.com",
  databaseURL: "https://wy-sequence-lngi-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wy-sequence-lngi",
  storageBucket: "wy-sequence-lngi.firebasestorage.app",
  messagingSenderId: "171132084225",
  appId: "1:171132084225:web:44253d73a290bbf8d62000"
}; // from my proxy essentials

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ONE USER PER BROWSER
const userId =
  localStorage.getItem("userId") ||
  crypto.randomUUID();

localStorage.setItem("userId", userId);

const userRef = ref(db, "online/" + userId);

// mark online
set(userRef, {
  lastSeen: Date.now()
});

// remove when tab closes
onDisconnect(userRef).remove();

// heartbeat (keeps user alive)
setInterval(() => {
  set(userRef, {
    lastSeen: Date.now()
  });
}, 10000);

// cleanup OLD users (safe version)
function cleanup() {
  const onlineRef = ref(db, "online");

  onValue(onlineRef, (snapshot) => {
    const data = snapshot.val() || {};
    const now = Date.now();

    Object.entries(data).forEach(([id, user]) => {
      if (user?.lastSeen && now - user.lastSeen > 30000) {
        remove(ref(db, "online/" + id));
      }
    });
  }, { onlyOnce: true });
}

setInterval(cleanup, 15000);

// count users
onValue(ref(db, "online"), (snapshot) => {
  const data = snapshot.val() || {};
  const count = Object.keys(data).length;

  document.getElementById("online").textContent =
    `🟢 ${count} user${count === 1 ? "" : "s"} online`;
});
