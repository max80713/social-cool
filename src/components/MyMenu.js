import React from 'react';
import { List } from 'semantic-ui-react';
import 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';

function MyMenu() {
  const location = useLocation();
  const menuItems = [
    {
      name: '我的文章',
      path: '/my/posts',
    },
    {
      name: '我的收藏',
      path: '/my/collections',
    },
    {
      name: '會員資料',
      path: '/my/settings',
    },
  ];
  return (
    <List animated selection>
      {menuItems.map((menuItem) => {
        return (
          <List.Item
            as={Link}
            to={menuItem.path}
            key={menuItem.name}
            active={menuItem.path === location.pathname}
          >
            {menuItem.name}
          </List.Item>
        );
      })}
    </List>
  );
}

export default MyMenu;
