import React from 'react';
import { Item, Header } from 'semantic-ui-react';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { auth, db } from '../utils/firebase';
import Post from '../components/Post';

function MyPosts() {
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    async function getPosts() {
      const q = query(
        collection(db, 'posts'),
        where('author.uid', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPosts(data);
    }
    getPosts();
  }, []);
  return (
    <>
      <Header>我的文章</Header>
      <Item.Group>
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </Item.Group>
    </>
  );
}

export default MyPosts;
