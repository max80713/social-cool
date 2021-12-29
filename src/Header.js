import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import React from 'react';

import { auth } from './utils/firebase';
import { signOut } from 'firebase/auth';

function Header({ user }) {
  return (
    <Menu>
      <Menu.Item as={Link} to="/posts">
        Social Cool
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
