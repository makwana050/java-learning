// ============================================================
//  Platform settings — the only file you normally need to edit
// ============================================================

// From Firebase console → Project settings → Your apps
export const firebaseConfig = {
  apiKey: "AIzaSyAqbhP2dMz-4MzkrGDF5uX5vOZTKb7Ls30",
  authDomain: "java-learning-platform-f36bf.firebaseapp.com",
  projectId: "java-learning-platform-f36bf",
  storageBucket: "java-learning-platform-f36bf.firebasestorage.app",
  messagingSenderId: "547666501756",
  appId: "1:547666501756:web:ae22aea7fa463d348229f9"
};

// Google accounts that can open the Faculty dashboard.
// If you add an email here, add it in firestore.rules too.
export const FACULTY_EMAILS = ["mak005500@gmail.com"];

// Only Google accounts from these domains can use the site (unless the faculty
// dashboard's Access tab is switched to "only listed emails").
// If you change them, change the domainOk() line in firestore.rules too.
export const ALLOWED_DOMAINS = ["rru.ac.in", "student.rru.ac.in"];
export const ALLOWED_DOMAIN = ALLOWED_DOMAINS.join(" or @");   // shown on screen: "rru.ac.in or @student.rru.ac.in"
export const domainAllowed = email => ALLOWED_DOMAINS.some(d => (email || "").toLowerCase().endsWith("@" + d));

export const SITE_TITLE = "Java Lab";

// Fast run server (optional). Leave "" to run Java inside the browser only.
// You can also set or change it any time in Faculty → Settings → Fast run server.
export const RUN_SERVER = "";
