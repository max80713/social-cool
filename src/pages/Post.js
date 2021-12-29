import React from 'react';
import { useParams } from 'react-router-dom';
import { Image, Header, Segment, Icon, Comment, Form } from 'semantic-ui-react';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import { auth, db } from '../utils/firebase';

function Post() {
  const { postId } = useParams();
  const [post, setPost] = React.useState({
    author: {},
  });
  const [commentContent, setCommentContent] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    onSnapshot(doc(db, 'posts', postId), (doc) => {
      setPost(doc.data());
    });
  }, []);

  React.useEffect(() => {
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt')
    );
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setComments(data);
    });
  }, []);

  function toggle(isActive, field) {
    const uid = auth.currentUser.uid;
    updateDoc(doc(db, 'posts', postId), {
      [field]: isActive ? arrayRemove(uid) : arrayUnion(uid),
    });
  }

  const isCollected = post.collectedBy?.includes(auth.currentUser.uid);

  const isLiked = post.likedBy?.includes(auth.currentUser.uid);

  async function onSubmit() {
    setIsLoading(true);
    const batch = writeBatch(db);

    const postRef = doc(db, 'posts', postId);
    batch.update(postRef, {
      commentsCount: increment(1),
    });

    const commentRef = doc(collection(db, 'posts', postId, 'comments'));
    batch.set(commentRef, {
      content: commentContent,
      createdAt: Timestamp.now(),
      author: {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName || '',
        photoURL: auth.currentUser.photoURL || '',
      },
    });

    const mailRef = doc(collection(db, 'mail'));
    batch.set(mailRef, {
      to: post.author.email,
      message: {
        subject: `新訊息：${auth.currentUser.displayName} 剛剛回覆了你的文章`,
        html: `<a href="${window.location.origin}/posts/${postId}">前往文章</a>`,
      },
    });

    await batch.commit();
    setCommentContent('');
    setIsLoading(false);
  }

  return (
    <>
      {post.author.photoURL ? (
        <Image src={post.author.photoURL} avatar />
      ) : (
        <Icon name="user circle" />
      )}
      {post.author.displayName || '使用者'}
      <Header>
        {post.title}
        <Header.Subheader>
          {post.topic}．{post.createdAt?.toDate().toLocaleDateString()}
        </Header.Subheader>
      </Header>
      <Image src={post.imageUrl} />
      <Segment basic vertical>
        {post.content}
      </Segment>
      <Segment basic vertical>
        留言 {post.commentsCount || 0}．讚 {post.likedBy?.length || 0}．
        <Icon
          name={`thumbs up${isLiked ? '' : ' outline'}`}
          color={isLiked ? 'blue' : 'grey'}
          link
          onClick={() => toggle(isLiked, 'likedBy')}
        />
        ．
        <Icon
          name={`bookmark${isCollected ? '' : ' outline'}`}
          color={isCollected ? 'blue' : 'grey'}
          link
          onClick={() => toggle(isCollected, 'collectedBy')}
        />
      </Segment>
      <Comment.Group>
        <Form reply>
          <Form.TextArea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Form.Button onClick={onSubmit} loading={isLoading}>
            留言
          </Form.Button>
        </Form>
        <Header>共 {post.commentsCount || 0} 則留言</Header>
        {comments.map((comment) => {
          return (
            <Comment>
              <Comment.Avatar src={comment.author.photoURL} />
              <Comment.Content>
                <Comment.Author as="span">
                  {comment.author.displayName || '使用者'}
                </Comment.Author>
                <Comment.Metadata>
                  {comment.createdAt.toDate().toLocaleString()}
                </Comment.Metadata>
                <Comment.Text>{comment.content}</Comment.Text>
              </Comment.Content>
            </Comment>
          );
        })}
      </Comment.Group>
    </>
  );
}

export default Post;
