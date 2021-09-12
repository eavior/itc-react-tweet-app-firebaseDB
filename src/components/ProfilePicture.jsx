import React from "react";
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const ProfilePicture = (props) => {
  const { currentUser } = props;
  console.log(currentUser);
  const [image, setImage] = useState("");
  const [noImage, setNoImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const deletePicture = (event) => {
    firebase
      .storage()
      .ref(`/images/${currentUser}`)
      .delete()
      .then(() => {
        alert("Picture has been removed successfully!");
        setNoImage(true);
      })
      .catch((error) => {
        alert("Something went wrong. Please try again.");
      });
    event.preventDefault();
  };

  const uploadPicture = (event) => {
    if (!image) return;
    console.log("image: " + image);
    firebase
      .storage()
      .ref(`/images/${currentUser}`)
      .put(image)
      .on(
        "state_changed",
        alert("Your picture has been uploaded successfully!"),
        alert,
        setNoImage(false),
        setImage("")
      );

    event.preventDefault();
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

  return (
    <>
      <div className="container text-white profile">
        <h3>Profile picture</h3>
        {noImage && (
          <span>
            Here you can set your profile picture. Select a picture and upload
            it.
          </span>
        )}
        {!noImage && (
          <span>Here you can change your profile picture, or delete it.</span>
        )}
        <form className="card-profile">
          <div className="card-body-profile">
            <input
              className="form-control"
              type="file"
              onChange={(event) => setImage(event.target.files[0])}
              rows="1"
            />
          </div>
          <div className="card-body tweet-header">
            <div className="float-end">
              {!noImage && !image && (
                <button
                  onClick={(event) => deletePicture(event)}
                  className="btn btn-danger">
                  Delete current picture and set the standard avatar
                </button>
              )}
              {image && (
                <button
                  onClick={(event) => uploadPicture(event)}
                  className="btn btn-warning">
                  Upload the selected picture
                </button>
              )}
            </div>
          </div>
        </form>
        <div className="col-lg-3 col-md-3">
          {noImage && <img src="default.png" alt="avatar" />}
          {!noImage && <img src={profileImageUrl} alt="avatar" />}
        </div>
      </div>
    </>
  );
};

export default ProfilePicture;
