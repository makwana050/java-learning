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

// Only Google accounts from this domain can use the site (unless the faculty
// dashboard's Access tab is switched to "only listed emails").
// If you change it, change it in firestore.rules too.
export const ALLOWED_DOMAIN = "rru.ac.in";

export const SITE_TITLE = "Java Lab";
