import React from "react";
import { useEffect, useState, useRef } from "react";
import { Redirect } from "react-router";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,
// };

// firebase.initializeApp(firebaseConfig);
// var storage = firebase.storage();

const ProfilePicture = (props) => {
  const { currentUser } = props;
  console.log(currentUser);
  const [image, setImage] = useState("");
  const [noImage, setNoImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  // const [profileImageRef, setProfileImageRef] = useState("/images/bird.jpeg");

  // useEffect(() => {}, image);

  const inputFile = useRef(null);

  const onButtonClick = (event) => {
    // `current` points to the mounted file input element
    inputFile.current.click(event);
  };

  const deletePicture = () => {
    // var desertRef = storageRef.child("images/bird.jpeg");
    firebase
      .storage()
      .ref(`/images/${currentUser}`)
      // .ref(`/images/${image.name}`)
      .delete()
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };

  const setNewImage = (file) => {
    console.log(file);
    setImage(file);
    console.log(image);
    uploadPicture();
  };

  const uploadPicture = () => {
    if (profileImageUrl) deletePicture();
    if (image == null) return;
    console.log("image: " + image);
    firebase
      .storage()
      .ref(`/images/${currentUser}`)
      // .ref(`/images/${image.name}`)
      .put(image)
      .on("state_changed", alert("success"), alert);
  };

  let imageRef = firebase.storage().ref("/images/" + currentUser);
  imageRef
    .getDownloadURL()
    .then((url) => {
      //from url you can fetched the uploaded image easily
      setProfileImageUrl(url);
      setNoImage(false);
    })
    .catch((e) => {
      console.log("getting downloadURL of image error => ", e);
      setNoImage(true);
    });

  console.log("profileimageurl: ", profileImageUrl);

  return (
    <>
      <div className="container text-white profile">
        <h2>Profile</h2>
        <h3>Profile picture</h3>
        <div className="card-body-profile">
          <div className="input-group">
            <input
              type="file"
              className="form-control"
              id="inputGroupFile04"
              aria-describedby="inputGroupFileAddon04"
              aria-label="Upload"
              style={{ display: "none" }}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="inputGroupFileAddon04">
              Button
            </button>
          </div>
        </div>

        <div className="card-body-profile">
          The real one
          <input
            className="form-control"
            type="file"
            onChange={(event) => setImage(event.target.files[0])}
          />
          <label className="input-group-text" htmlFor="inputGroupFile02">
            Upload
          </label>
        </div>

        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">
            Default file input example
          </label>
          <input className="form-control" type="file" id="formFile"></input>
        </div>
        <button onClick={uploadPicture}>Upload - the real one</button>
        <button onClick={deletePicture}>Delete1</button>
        <div className="card-body tweet-header">
          <div className="float-end">
            {profileImageUrl !== profileImageUrl && (
              <button className="btn btn-primary">Save</button>
            )}
            {profileImageUrl === profileImageUrl && (
              <button className="btn btn-primary disabled">Save</button>
            )}
          </div>
        </div>
        <img
          src={profileImageUrl}
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />

        <img
          src={image}
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
        {/* </form> */}
      </div>

      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={(event) => setNewImage(event.target.files[0])}
      />
      <div className="col-lg-3 col-md-3">
        <li>
          <a>
            {noImage && <img src="default.png" onClick={onButtonClick} />}
            {!noImage && (
              <img
                src={profileImageUrl}
                onClick={(event) => onButtonClick(event)}
              />
            )}
          </a>
        </li>
      </div>
    </>
  );
};

export default ProfilePicture;
