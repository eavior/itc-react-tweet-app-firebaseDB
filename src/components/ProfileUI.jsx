import React from "react";
import { useState } from "react";
import "firebase/firestore";
import ProfileName from "./ProfileName";
import ProfilePicture from "./ProfilePicture";
import { MyContext } from "../context/MyContext";

// Get a reference to the storage service, which is used to create references in your storage bucket
// const storage = firebase.storage();

// Create a storage reference from our storage service
// var storageRef = storage.ref();

const ProfileUI = (props) => {
  const { authUser, authStorage } = props;
  const [currentUser] = useState(authUser.uid);

  return (
    <MyContext.Provider value={{ currentUser }}>
      <ProfileName currentUser={authUser.uid}></ProfileName>
      <ProfilePicture
        currentUser={authUser.uid}
        storage={authStorage}></ProfilePicture>
    </MyContext.Provider>
  );
};

export default ProfileUI;
