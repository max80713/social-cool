import { Menu, Search } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import algolia from './utils/algolia';

import { auth } from './utils/firebase';
import { signOut } from 'firebase/auth';

function Header({ user }) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = React.useState('');
  const [results, setResults] = React.useState([]);

  async function onSearchChange(e, { value }) {
    setInputValue(value);

    const result = await algolia.search(value);
    const searchResults = result.hits.map((hit) => ({
      title: hit.title,
      description: hit.content,
      id: hit.objectID,
    }));
    setResults(searchResults);
  }

  function onResultSelect(e, { result }) {
    navigate(`/posts/${result.id}`);
  }

  return (
    <Menu>
      <Menu.Item as={Link} to="/posts">
        Social Cool
      </Menu.Item>
      <Menu.Item>
        <Search
          value={inputValue}
          onSearchChange={onSearchChange}
          results={results}
          noResultsMessage="找不到相關文章"
          onResultSelect={onResultSelect}
        />
      </Menu.Item>
      <Menu.Menu position="right">
        {user ? (
          <>
            <Menu.Item as={Link} to="/new-post">
              發表文章
            </Menu.Item>
            <Menu.Item as={Link} to="/my/posts">
              會員
            </Menu.Item>
            <Menu.Item onClick={() => signOut(auth)}>登出</Menu.Item>
          </>
        ) : (
          <Menu.Item as={Link} to="/signin">
            註冊/登入
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
}

export default Header;
