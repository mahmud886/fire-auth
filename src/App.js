import './App.css';

import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from 'firebase/auth';
import firebaseConfig from './firebase.config';
import { useState } from 'react';

const app = initializeApp(firebaseConfig);

function App() {
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
    });

    const provider = new GoogleAuthProvider();

    const handleSign = () => {
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                const { displayName, email, photoURL } = result.user;
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL,
                };
                setUser(signedInUser);
                console.log(displayName, email, photoURL);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.message);
            });
    };

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth)
            .then((result) => {
                const signedOutUser = {
                    isSignedIn: false,
                    name: '',
                    email: '',
                    photo: '',
                };
                setUser(signedOutUser);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.message);
            });
    };

    return (
        <div className='App'>
            {user.isSignedIn ? (
                <button onClick={handleSignOut}>Sign Out</button>
            ) : (
                <button onClick={handleSign}>Sign In</button>
            )}
            {user.isSignedIn && (
                <div>
                    <p>Welcome. {user.name}</p>
                    <p>Your email: {user.email}</p>
                    <img src={user.photo} alt='' />
                </div>
            )}
        </div>
    );
}

export default App;
