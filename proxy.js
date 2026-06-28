import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"; // Added Auth
import { getDatabase, ref, set, onValue, onDisconnect } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
const firebaseConfig = { /* Your config here */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Auth
const db = getDatabase(app);
signInAnonymously(auth).catch((error) => {
  console.error("Anonymous auth failed: ", error);
});
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid; // Secure ID from Firebase
    const userRef = ref(db, "online/" + userId);
    const connectedRef = ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(userRef, true);
        onDisconnect(userRef).remove();
      }
    });
  }
});
const onlineRef = ref(db, "online");
onValue(onlineRef, (snapshot) => {
  const data = snapshot.val() || {};
  const count = Object.keys(data).length;
  const onlineDiv = document.getElementById("online");
  if (onlineDiv) {
    onlineDiv.textContent = 🟢 ${count} user${count === 1 ? "" : "s"} online;
  }
});
