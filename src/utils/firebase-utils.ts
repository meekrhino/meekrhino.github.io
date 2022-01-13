import * as FireBase from "firebase/app"
import 'firebase/auth'
import { createUserWithEmailAndPassword, getAuth, reauthenticateWithCredential, reauthenticateWithPopup, sendPasswordResetEmail, signInWithEmailAndPassword, updateEmail, updatePassword } from "firebase/auth"
import 'firebase/firestore'
import { Firestore, getFirestore, collection, getDoc, getDocs, DocumentReference, DocumentSnapshot, terminate } from "firebase/firestore"

/**
 * These values are stored in var.env
 */
const firebaseConfig = {
    apiKey: "AIzaSyBQ0estffIgPTpdRGZ5qKW9uRH6spfGoyo",
    authDomain: "streamer-bingo.firebaseapp.com",
    projectId: "streamer-bingo",
    storageBucket: "streamer-bingo.appspot.com",
    messagingSenderId: "891392496844",
    appId: "1:891392496844:web:712ce28bf40a01771c9e69",
    measurementId: "G-4ERX2YT95N"
}

/**
 * Class to initialize database and authentication context
 */
class Firebase {
    constructor() {
        /* Only initialize app if it has not yet been initialized */
        if( FireBase.getApps().length === 0 ) {
            this._app = FireBase.initializeApp( firebaseConfig )
            this._db = getFirestore( this._app )
        }
        else {
            this._app = FireBase.getApps()[ 0 ]
        }
    }

    /***
     * Public Variables
     **/
    DataMap: Map<string, DocumentSnapshot> = new Map()

    /* Private variables */
    private _app: FireBase.FirebaseApp
    private _db: Firestore


    /***
     * Private Functions
     **/
    terminate = () => terminate( this._db )

    /***
     * Authentication
     **/

    /* Create a user with email and password */
    async createUser(
        username: string,
        email: string,
        password: string
     ) {
        /* Firebase auth user credential */
        return await createUserWithEmailAndPassword(
            getAuth( this._app ), email, password
        )
    }

    /* Get the currently signed in user */
    getCurrentUser = () => {
        return getAuth( this._app ).currentUser
    }

    /* Send an email to reset a user's password */
    sendPasswordReset = ( email: string ) => {
        sendPasswordResetEmail( getAuth( this._app ), email )
    }

    /* Set a listener on the change of auth state */
    setAuthStateUpdate = ( callback: () => void ) => {
        getAuth( this._app ).onAuthStateChanged( callback )
    }

    /* Sign in a user with email and password */
    signInUser = async ( email: string, password: string ) => {
        await signInWithEmailAndPassword( getAuth( this._app ), email, password )
    }

    /* Sign out a user */
    signOutUser = () => {
        return getAuth( this._app ).signOut()
    }

    /* Updates a user's password */
    updatePassword = ( password: string ) => {
        updatePassword( getAuth( this._app ).currentUser, password )
    }

    /* Updates a user's email */
    updateEmail = ( email: string ) => {
        updateEmail( getAuth( this._app ).currentUser, email )
    }
}

export default Firebase
