import React from "react";
import { Redirect } from "react-router";
import firebase from "firebase/app";
import "firebase/firestore";

export default class SignOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
    };
  }

  componentWillUnmount() {
    firebase
      .auth()
      .signOut()
      .then(
        function () {
          console.log("Signed Out");
        },
        function (error) {
          console.error("Sign Out Error", error);
        }
      );
    this.setState((prevState) => {
      return { redirect: "/" };
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="container text-white profile">
        <h3>You have been successfully signed out.</h3>
      </div>
    );
  }
}
