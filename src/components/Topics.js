import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../utils/firebase';

function Topics() {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentTopic = urlSearchParams.get('topic');
  const [topics, setTopics] = React.useState([]);
  React.useEffect(() => {
    async function getTopics() {
      const querySnapshot = await getDocs(collection(db, 'topics'));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setTopics(data);
    }
    getTopics();
  }, []);
  return (
    <List animated selection>
      {topics.map((topic) => (
        <List.Item
          key={topic.name}
          as={Link}
          to={`/posts?topic=${topic.name}`}
          active={currentTopic === topic.name}
        >
          {topic.name}
        </List.Item>
      ))}
    </List>
  );
}

export default Topics;
