import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import firebase from "firebase/app";
import "firebase/firestore";
import Login from "./components/Login";
import TweetUI from "./components/TweetUI";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
// var storage = firebase.storage();

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [authStorage, setAuthStorage] = useState(null);
  const login = async (authUser) => {
    setAuthUser(authUser);
    setAuthStorage(firebase.storage());
    await firebase
      .firestore()
      .collection("users")
      .doc(authUser.uid)
      .set({ name: authUser.displayName });
  };

  useEffect(() => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL); // NONE, LOCAL or SESSION
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        authStorage,
        login,
        logout: () => setAuthUser(null),
      }}>
      {!authUser && <Login />}
      {authUser && <TweetUI authUser={authUser} authStorage={authStorage} />}
    </AuthContext.Provider>
  );
}

export default App;
