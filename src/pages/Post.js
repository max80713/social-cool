import React from 'react';
import { useParams } from 'react-router-dom';
import { Image, Header, Segment, Icon, Comment, Form } from 'semantic-ui-react';

import firebase from '../utils/firebase';

function Post() {
  const { postId } = useParams();
  const [post, setPost] = React.useState({
    author: {},
  });
  const [commentContent, setCommentContent] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    firebase
      .firestore()
      .collection('posts')
      .doc(postId)
      .onSnapshot((docSnapshot) => {
        const data = docSnapshot.data();
        setPost(data);
      });
    //   .get()
    //   .then((docSnapshot) => {
    //     const data = docSnapshot.data();
    //     setPost(data);
    //   });
  }, []);

  React.useEffect(() => {
    firebase
      .firestore()
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('createdAt')
      .onSnapshot((collectionSnapshot) => {
        const data = collectionSnapshot.docs.map((doc) => {
          return doc.data();
        });
        setComments(data);
      });
  }, []);

  function toggle(isActive, field) {
    const uid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection('posts')
      .doc(postId)
      .update({
        [field]: isActive
          ? firebase.firestore.FieldValue.arrayRemove(uid)
          : firebase.firestore.FieldValue.arrayUnion(uid),
      });
  }

  const isCollected = post.collectedBy?.includes(
    firebase.auth().currentUser.uid
  );

  const isLiked = post.likedBy?.includes(firebase.auth().currentUser.uid);

  function onSubmit() {
    setIsLoading(true);
    const firestore = firebase.firestore();

    const batch = firestore.batch();

    const postRef = firestore.collection('posts').doc(postId);
    batch.update(postRef, {
      commentsCount: firebase.firestore.FieldValue.increment(1),
    });

    const commentRef = postRef.collection('comments').doc();
    batch.set(commentRef, {
      content: commentContent,
      createdAt: firebase.firestore.Timestamp.now(),
      author: {
        uid: firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName || '',
        photoURL: firebase.auth().currentUser.photoURL || '',
      },
    });

    const mailRef = firestore.collection('mail').doc();
    batch.set(mailRef, {
      to: post.author.email,
      message: {
        subject: `新訊息：${
          firebase.auth().currentUser.displayName
        } 剛剛回覆了你的文章`,
        html: `<a href="${window.location.origin}/posts/${postId}">前往文章</a>`,
      },
    });

    batch.commit().then(() => {
      setCommentContent('');
      setIsLoading(false);
    });
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
