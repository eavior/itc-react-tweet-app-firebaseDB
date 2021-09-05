import React from "react";
import { useEffect, useState, useRef } from "react";
import { Redirect } from "react-router";
import firebase from "firebase/app";
import "firebase/firestore";

// Get a reference to the storage service, which is used to create references in your storage bucket
// const storage = firebase.storage();

// Create a storage reference from our storage service
// var storageRef = storage.ref();

const Profile = (props) => {
  const [currentNickName, setCurrentNickName] = useState(null);
  const [newNickName, setNewNickName] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [userName, setUserName] = useState(null);
  const [value, setValue] = useState("");
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    firebase
      .firestore()
      .collection("users")
      .doc(props.currentUser)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUserName(doc.data().name);
        } else {
          console.log("No such document!" + props.currentUser);
        }
      })
      .catch((error) => {
        console.log("Error getting username:", error);
      });
    firebase
      .firestore()
      .collection("nicknames")
      .doc(props.currentUser)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setCurrentNickName(doc.data().nickName);
        } else {
          setCurrentNickName(userName);
        }
      })
      .catch((error) => {
        console.log("Error getting user or nickname: ", error);
      });
    return () => {
      isMounted.current = false;
    };
  }, [props.currentUser, userName]);

  const createNewNickName = async () => {
    await firebase
      .firestore()
      .collection("nicknames")
      .doc(props.currentUser)
      .get()
      .then((doc) => {
        if (doc.exists) {
          firebase
            .firestore()
            .collection("nicknames")
            .doc(props.currentUser)
            .set({
              nickName: newNickName,
            });
        } else {
          firebase
            .firestore()
            .collection("nicknames")
            .doc(props.currentUser)
            .set({
              nickName: newNickName,
            });
        }
      })
      .catch((error) => {
        console.log("Error getting user or nickname:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createNewNickName();
    alert(
      "The user name has been succesfully changed to " +
        newNickName +
        ". You will now be redirected to the main page."
    );
    setRedirect("/");
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    setNewNickName(event.target.value);
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div className="container text-white profile">
      <h2>Profile</h2>
      <h3>User Name</h3>
      {!currentNickName && (
        <span>
          The name that will appear on the tweets you send is "{userName}". You
          can set a nickname below instead of using your real name.
        </span>
      )}
      {currentNickName && (
        <span>
          {userName}, the name that will appear on the tweets is "
          {currentNickName}" . You can change that name here:
        </span>
      )}
      <form className="card-profile" onSubmit={(event) => handleSubmit(event)}>
        <div className="card-body-profile">
          <input
            className="form-control"
            name="text"
            type="text"
            rows="1"
            value={value}
            placeholder={currentNickName}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="card-body tweet-header">
          <div className="float-end">
            {newNickName !== currentNickName && (
              <button className="btn btn-primary">Save</button>
            )}
            {newNickName === currentNickName && (
              <button className="btn btn-primary disabled">Save</button>
            )}
          </div>
        </div>
      </form>
      {/* <h3>Upload profile picture</h3>
        <img src={user}></img>
        <form
          className="card-profile"
          onSubmit={(file) => this.uploadBlob(file)}
        >
          <div className="card-body-profile">
            <input
              className="form-control"
              name="text"
              type="text"
              rows="1"
              value={this.state.value}
              onChange={(event) => this.handleChange(event)}
            />
          </div>
          <input type="file" id="myFile" name="filename"></input>
          <div className="card-body tweet-header">
            <button className="btn btn-primary">Upload</button>
          </div>
        </form> */}
    </div>
  );
};

export default Profile;
