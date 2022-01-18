import * as FireBase from "firebase/app"
import 'firebase/auth'
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    updateEmail,
    updatePassword
} from "firebase/auth"
import 'firebase/firestore'
import {
    Firestore,
    getFirestore,
    collection,
    getDoc,
    getDocs,
    setDoc,
    DocumentSnapshot,
    terminate,
    doc,
    FirestoreDataConverter,
    deleteDoc
} from "firebase/firestore"
import { ModeData, OptionGroupData, PageData, OptionData } from "./models"

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

    /**
     * Retrieve all data for the specified user's page
     */
    getPageData = async ( user: string ) => {
        const docRef = doc( this._db, "pages", user ).withConverter( this.pageConverter )
        const docSnap = await getDoc( docRef )

        if( docSnap.exists ) {
            const page = docSnap.data()
            page.modes = await this.getModeData( user )
            page.optionGroups = await this.getOptionGroupData( user )
            page.options = await this.getOptionData( user )

            return page
        }
        else {
            console.log( "Attempted to retrieve non-existant page " + user )

            return null
        }
    }

    /**
     * Write all page data, including modes/options/optiongroups,
     * to the firestore database
     */
    writePageData = async ( user: string, data: PageData ) => {
        // Write page
        const pageRef = doc( this._db, "pages", user )

        await setDoc( pageRef, data )

        // Write modes
        const modePromises: Promise<void>[] = []
        data.modes.forEach( ( m ) => {
            const modeRef = doc( this._db, "pages", user, "modes", m.id )

            if( m.deleted ) {
                modePromises.push( deleteDoc( modeRef ) )
            }
            else {
                modePromises.push( setDoc( modeRef, m ) )
            }
        } )
        await Promise.all( modePromises )

        // Write option groups
        const ogPromises: Promise<void>[] = []
        data.optionGroups.forEach( ( og ) => {
            const ogRef = doc( this._db, "pages", user, "optionGroups", og.id )

            if( og.deleted ) {
                ogPromises.push( deleteDoc( ogRef ) )
            }
            else {
                ogPromises.push( setDoc( ogRef, og ) )
            }
        } )
        await Promise.all( ogPromises )

        // Write options
        const oPromises: Promise<void>[] = []
        data.options.forEach( ( o ) => {
            const oRef = doc( this._db, "pages", user, "options", o.id )

            if( o.deleted ) {
                oPromises.push( deleteDoc( oRef ) )
            }
            else {
                oPromises.push( setDoc( oRef, o ) )
            }
        } )
        await Promise.all( oPromises )
    }

    /**
     * Private helper functions
     */
    private getModeData = async ( user: string ) => {
        const modesQuery = collection( this._db, "pages", user, "modes" ).withConverter( this.modeConverter )
        const modesQuerySnapshot = await getDocs( modesQuery )

        const modes: Map<string, ModeData> = new Map()
        modesQuerySnapshot.forEach( ( doc ) => {
            modes.set( doc.id, doc.data() )
        } )

        return modes
    }

    private getOptionGroupData = async ( user: string ) => {
        const optionGroupsQuery = collection( this._db, "pages", user, "optionGroups" ).withConverter( this.optionGroupConverter )
        const optionGroupsQuerySnapshot = await getDocs( optionGroupsQuery )

        const optionGroups: Map<string, OptionGroupData> = new Map()
        optionGroupsQuerySnapshot.forEach( ( doc ) => {
            optionGroups.set( doc.id, doc.data() )
        } )

        return optionGroups
    }

    private getOptionData = async ( user: string ) => {
        const optionsQuery = collection( this._db, "pages", user, "options" ).withConverter( this.optionConverter )
        const optionsQuerySnapshot = await getDocs( optionsQuery )

        const options: Map<string, OptionData> = new Map()
        optionsQuerySnapshot.forEach( ( doc ) => {
            options.set( doc.id, doc.data() )
        } )

        return options
    }

    /**
     * Converters
     */
    private pageConverter: FirestoreDataConverter<PageData> = {
        toFirestore: ( page: PageData ) => {
            return {
                root: page.root,
                tier: page.tier,
                defaultMode: page.defaultMode,
                externalLink: page.externalLink,
                externalLinkText: page.externalLinkText
            }
        },
        fromFirestore: ( snapshot, options ) => {
            const data = snapshot.data( options );
            return { ...data } as PageData
        }
    }

    private modeConverter: FirestoreDataConverter<ModeData> = {
        toFirestore: ( mode: ModeData ) => {
            return {
                displayName: mode.displayName,
                useFreeSpace: mode.useFreeSpace,
                groupPerColumn: mode.groupPerColumn,
                disabled: mode.disabled,
                optionGroups: mode.optionGroups
            }
        },
        fromFirestore: ( snapshot, options ) => {
            const data = snapshot.data( options );
            return { ...data, id: snapshot.id } as ModeData
        }
    }

    private optionGroupConverter: FirestoreDataConverter<OptionGroupData> = {
        toFirestore: ( og: OptionGroupData ) => {
            return {
                displayName: og.displayName,
                disabed: og.disabled,
                options: og.options
            }
        },
        fromFirestore: ( snapshot, options ) => {
            const data = snapshot.data( options );
            return { ...data, id: snapshot.id } as OptionGroupData
        }
    }

    private optionConverter: FirestoreDataConverter<OptionData> = {
        toFirestore: ( o: OptionData ) => {
            return {
                displayName: o.displayName,
                tooltip: o.tooltip,
                disabled: o.disabled
            }
        },
        fromFirestore: ( snapshot, options ) => {
            const data = snapshot.data( options );
            return { ...data, id: snapshot.id } as OptionData
        }
    }
}

export const uid = () =>{
    // Alphanumeric characters
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return autoId;
  }

export default Firebase
