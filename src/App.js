import './App.css';
import { Button } from 'react-bootstrap';

import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    createUserWithEmailAndPassword,
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
        password: '',
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
                    password: '',
                    isValid: false,
                };
                setUser(signedOutUser);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.message);
            });
    };

    // Create an Account

    const is_valid_email = (email) =>
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
            email
        );
    const hasNumber = (input) => /\d/.test(input);

    const handleChange = (e) => {
        const newUserInfo = {
            ...user,
        };

        // perform validation

        let isValid = true;
        if (e.target.name === 'email') {
            isValid = is_valid_email(e.target.value);
        }
        if (e.target.name === 'password') {
            isValid = e.target.value.length > 8 && hasNumber(e.target.value);
        }

        newUserInfo[e.target.name] = e.target.value;
        newUserInfo.isValid = isValid;
        setUser(newUserInfo);
    };

    // Create user Method

    const HandleCreateAccount = (e) => {
        if (user.isValid) {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, user.email, user.password)
                .then((result) => {
                    console.log(result);
                    const createdUser = { ...user };
                    createdUser.isSignedIn = true;
                    setUser(createdUser);
                })
                .catch((err) => {
                    console.log(err);
                    console.error(err.message);
                });
        } else {
            console.log('form is not valid..', user);
        }
        //
        e.preventDefault();
    };

    return (
        <div className='App pt-3'>
            {user.isSignedIn ? (
                <button onClick={handleSignOut}>Sign Out</button>
            ) : (
                <Button variant='primary' onClick={handleSign}>
                    Sign In
                </Button>
            )}
            {user.isSignedIn && (
                <div>
                    <p>Welcome. {user.name}</p>
                    <p>Your email: {user.email}</p>
                    <img src={user.photo} alt='' />
                </div>
            )}
            {/* New User Account */}
            <div>
                <h2>Create a new account</h2>
                <form onSubmit={HandleCreateAccount}>
                    <input
                        placeholder='Enter name'
                        className='mb-3'
                        type='text'
                        name='name'
                        onBlur={handleChange}
                        required
                    />{' '}
                    <br />
                    <input
                        placeholder='Enter email'
                        className='mb-3'
                        type='text'
                        name='email'
                        onBlur={handleChange}
                        required
                    />{' '}
                    <br />
                    <input
                        placeholder='Enter password'
                        className='mb-3'
                        type='password'
                        name='password'
                        onBlur={handleChange}
                        required
                    />{' '}
                    <br />
                    <Button className='mb-3' variant='success' type='submit'>
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default App;
