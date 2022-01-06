import firebase from "firebase";

// Clef d'auth de firebase
const firebaseConfig = {
    apiKey: "AIzaSyDn5CphVA9zHYmaQ-rmjTXAMGvjzKbpP2k",
    authDomain: "ffgestion-e960e.firebaseapp.com",
    projectId: "ffgestion-e960e",
    storageBucket: "ffgestion-e960e.appspot.com",
    messagingSenderId: "482435496397",
    appId: "1:482435496397:web:406628850ae878de77ec84"
};

// Initialisation de l'application firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

// On va chercher les modules qu'on veut
const db = app.firestore() // Base de donnée
const fields = firebase.firestore.FieldValue // Champs de base de donnée (permet de faire des requêtes plus complexes)
const storage = app.storage() // Espace de stockage de fichier

// On export le tout
export { db, fields, storage }