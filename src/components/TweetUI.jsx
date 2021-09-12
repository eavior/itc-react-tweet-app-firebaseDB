import React from "react";
import "../App.css";
import TweetForm from "./TweetForm";
import TweetList from "./TweetList";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import { MyContext } from "../context/MyContext";
import ProfileUI from "./ProfileUI";
import SignOut from "./SignOut";
import { useState } from "react";

const NavBar = () => {
  return (
    <nav className="container navbar navbar-expand fixed-top">
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink className="nav-link" exact activeClassName="selected" to="/">
            Home
          </NavLink>
          <NavLink
            className="nav-link"
            activeClassName="selected"
            to="/profile">
            Profile
          </NavLink>
          <NavLink
            className="nav-link"
            activeClassName="selected"
            to="/sign_out">
            Sign out
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const TweetUI = (props) => {
  const { authUser, authStorage } = props;
  const [error, setError] = useState(null);
  const [currentUser] = useState(authUser.uid);

  const onAddTweet = async (item) => {
    const newTweet = await firebase.firestore().collection("tweets").add(item);
    if (typeof newTweet === "string") {
      if (newTweet.includes("Oops! Something went wrong.")) {
        setError(newTweet);
      }
    }
  };

  return (
    <MyContext.Provider value={{ error, currentUser, onAddTweet }}>
      <Router>
        <NavBar />
        <div className="container">
          <Switch>
            <Route exact path="/">
              <TweetForm />
              <TweetList />
            </Route>
            <Route path="/profile">
              <ProfileUI
                authUser={authUser}
                authStorage={authStorage}></ProfileUI>
            </Route>
            <Route path="/sign_out">
              <SignOut />
            </Route>
          </Switch>
        </div>
      </Router>
    </MyContext.Provider>
  );
};

export default TweetUI;
