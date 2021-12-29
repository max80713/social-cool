import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Header, Form, Image, Button } from 'semantic-ui-react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { auth, db, storage } from '../utils/firebase';

function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [topics, setTopics] = React.useState([]);
  const [topicName, setTopicName] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function getTopics() {
      const querySnapshot = await getDocs(collection(db, 'topics'));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setTopics(data);
    }
    getTopics();
  }, []);

  const options = topics.map((topic) => {
    return {
      text: topic.name,
      value: topic.name,
    };
  });

  const previewUrl = file
    ? URL.createObjectURL(file)
    : 'https://react.semantic-ui.com/images/wireframe/image.png';

  async function onSubmit() {
    setIsLoading(true);
    const docRef = doc(collection(db, 'posts'));
    const metadata = {
      contentType: file.type,
    };
    const result = await uploadBytes(
      ref(storage, 'post-images/' + docRef.id),
      file,
      metadata
    );
    const imageUrl = await getDownloadURL(result.ref);
    await setDoc(docRef, {
      title,
      content,
      topic: topicName,
      createdAt: Timestamp.now(),
      author: {
        displayName: auth.currentUser.displayName || '',
        photoURL: auth.currentUser.photoURL || '',
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
      },
      imageUrl,
    });
    setIsLoading(false);
    navigate('/posts');
  }

  return (
    <Container>
      <Header>發表文章</Header>
      <Form onSubmit={onSubmit}>
        <Image src={previewUrl} size="small" floated="left" />
        <Button basic as="label" htmlFor="post-image">
          上傳文章圖片
        </Button>
        <Form.Input
          type="file"
          id="post-image"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Form.Input
          placeholder="輸入文章標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Form.TextArea
          placeholder="輸入文章內容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Form.Dropdown
          placeholder="選擇文章主題"
          options={options}
          selection
          value={topicName}
          onChange={(e, { value }) => setTopicName(value)}
        />
        <Form.Button loading={isLoading}>送出</Form.Button>
      </Form>
    </Container>
  );
}

export default NewPost;
