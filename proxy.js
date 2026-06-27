// proxy : dont touch unless you understand
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onDisconnect
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

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
const db = getDatabase(app);

// ONE USER PER BROWSER
const userId =
  localStorage.getItem("userId") ||
  crypto.randomUUID();

localStorage.setItem("userId", userId);

const userRef = ref(db, "online/" + userId);
const connectedRef = ref(db, ".info/connected");

// 🔥 presence system
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    // mark online immediately
    set(userRef, true);

    // auto remove when disconnected
    onDisconnect(userRef).remove();
  }
});

// 🟢 live counter
const onlineRef = ref(db, "online");

onValue(onlineRef, (snapshot) => {
  const data = snapshot.val() || {};
  const count = Object.keys(data).length;

  const onlineDiv = document.getElementById("online");
  if (onlineDiv) {
    onlineDiv.textContent =
      `🟢 ${count} user${count === 1 ? "" : "s"} online`;
  }
});
