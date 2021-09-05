import React from "react";
import TweetItem from "./TweetItem";
import { useEffect, useState, useRef } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

const TweetList = (props) => {
  const isMounted = useRef(false);
  const [amountToShow, setAmountToShow] = useState(10);
  const [tweets, setTweets] = useState([]);
  const [lastKey, setLastKey] = useState("");
  const [nextTweets_loading, setNextTweetsLoading] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    const unsubscribe = firebase
      .firestore()
      .collection("tweets")
      .orderBy("date", "desc")
      .limit(amountToShow)
      .onSnapshot((snap) => {
        const tweets = snap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTweets(tweets);
        tweets.length < amountToShow - 1
          ? setLastKey(0)
          : setLastKey(tweets[amountToShow - 1].date);
      });
    return () => {
      unsubscribe();
      isMounted.current = false;
    };
  }, [amountToShow]);

  const fetchMoreTweets = (key) => {
    if (key.length > 0) {
      setNextTweetsLoading(true);
      const tweetAmount = amountToShow + 10;
      setAmountToShow(tweetAmount);
      setNextTweetsLoading(false);
    }
  };

  const allTweets = (
    <div>
      {tweets.map((item) => {
        return <TweetItem key={item.id} item={item} />;
      })}
    </div>
  );

  return (
    <>
      <div className="container">
        <div>{allTweets}</div>
        <div style={{ textAlign: "center" }}>
          {nextTweets_loading ? (
            <p>Loading tweets ...</p>
          ) : lastKey.length > 0 ? (
            <button
              className="btn btn-primary"
              onClick={() => fetchMoreTweets(lastKey)}
            >
              Load more tweets
            </button>
          ) : (
            <span>You have reached the end of the tweet list.</span>
          )}
        </div>
      </div>
    </>
  );
};

export default TweetList;
