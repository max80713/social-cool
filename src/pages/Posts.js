import React from 'react';
import { useLocation } from 'react-router-dom';
import { Item } from 'semantic-ui-react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { Waypoint } from 'react-waypoint';

import { db } from '../utils/firebase';
import Post from '../components/Post';

function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function Posts() {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentTopic = urlSearchParams.get('topic');
  const [posts, setPosts] = React.useState([]);
  const lastPostSnapshotRef = React.useRef();
  const previousTopic = usePrevious(currentTopic);

  async function getPosts() {
    const queryConstraints = [];
    if (currentTopic) {
      queryConstraints.push(where('topic', '==', currentTopic));
    }
    queryConstraints.push(orderBy('createdAt', 'desc'));
    if (lastPostSnapshotRef.current) {
      queryConstraints.push(startAfter(lastPostSnapshotRef.current));
    }
    queryConstraints.push(limit(10));
    const q = query(collection(db, 'posts'), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    const { docs } = querySnapshot;
    const data = docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    if (docs[docs.length - 1]) {
      lastPostSnapshotRef.current = docs[docs.length - 1];
    }

    setPosts((prev) => [...prev, ...data]);
  }

  React.useEffect(() => {
    lastPostSnapshotRef.current = undefined;
    setPosts([]);
  }, [currentTopic]);

  return (
    <>
      <Item.Group>
        {posts.map((post) => {
          return <Post post={post} key={post.id} />;
        })}
      </Item.Group>
      <Waypoint key={currentTopic} onEnter={getPosts} />
    </>
  );
}

export default Posts;
