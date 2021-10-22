import React from 'react';
import { Item } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';

import firebase from '../utils/firebase';
import Post from '../components/Post';

function Posts() {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentTopic = urlSearchParams.get('topic');
  const [posts, setPosts] = React.useState([]);
  const lastPostSnapshotRef = React.useRef();
  React.useEffect(() => {
    if (currentTopic) {
      firebase
        .firestore()
        .collection('posts')
        .where('topic', '==', currentTopic)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get()
        .then((collectionSnapshot) => {
          const data = collectionSnapshot.docs.map((docSnapshot) => {
            const id = docSnapshot.id;
            return { ...docSnapshot.data(), id };
          });
          lastPostSnapshotRef.current =
            collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
          setPosts(data);
        });
    } else {
      firebase
        .firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get()
        .then((collectionSnapshot) => {
          const data = collectionSnapshot.docs.map((docSnapshot) => {
            const id = docSnapshot.id;
            return { ...docSnapshot.data(), id };
          });
          lastPostSnapshotRef.current =
            collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
          setPosts(data);
        });
    }
  }, [currentTopic]);
  return (
    <>
      <Item.Group>
        {posts.map((post) => {
          return <Post post={post} key={post.id} />;
        })}
      </Item.Group>
      <Waypoint
        onEnter={() => {
          if (lastPostSnapshotRef.current) {
            if (currentTopic) {
              firebase
                .firestore()
                .collection('posts')
                .where('topic', '==', currentTopic)
                .orderBy('createdAt', 'desc')
                .startAfter(lastPostSnapshotRef.current)
                .limit(10)
                .get()
                .then((collectionSnapshot) => {
                  const data = collectionSnapshot.docs.map((docSnapshot) => {
                    const id = docSnapshot.id;
                    return { ...docSnapshot.data(), id };
                  });
                  lastPostSnapshotRef.current =
                    collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
                  setPosts([...posts, ...data]);
                });
            } else {
              firebase
                .firestore()
                .collection('posts')
                .orderBy('createdAt', 'desc')
                .startAfter(lastPostSnapshotRef.current)
                .limit(10)
                .get()
                .then((collectionSnapshot) => {
                  const data = collectionSnapshot.docs.map((docSnapshot) => {
                    const id = docSnapshot.id;
                    return { ...docSnapshot.data(), id };
                  });
                  lastPostSnapshotRef.current =
                    collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
                  setPosts([...posts, ...data]);
                });
            }
          }
        }}
      />
    </>
  );
}

export default Posts;
