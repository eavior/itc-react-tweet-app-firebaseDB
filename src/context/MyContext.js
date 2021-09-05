import { createContext } from "react";

export const MyContext = createContext({
  serverTweets: [],
  error: "",
  currentUser: "",
  onAddTweet: () => { }
});