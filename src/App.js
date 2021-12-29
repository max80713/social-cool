import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';
import React from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './utils/firebase';

import Header from './Header';

import Signin from './pages/Signin';
import Posts from './pages/Posts';
import NewPost from './pages/NewPost';
import Post from './pages/Post';
import MyPosts from './pages/MyPosts';
import MyCollections from './pages/MyCollections';
import MySettings from './pages/MySettings';

import Topics from './components/Topics';
import MyMenu from './components/MyMenu';

function App() {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  if (user === undefined) return null;

  return (
    <BrowserRouter>
      <Header user={user} />
      <Routes>
        <Route
          path="posts"
          element={
            <Container>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <Topics />
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <Outlet />
                  </Grid.Column>
                  <Grid.Column width={3} />
                </Grid.Row>
              </Grid>
            </Container>
          }
        >
          <Route index element={<Posts />} />
          <Route
            path=":postId"
            element={user ? <Post /> : <Navigate to="/posts" replace />}
          />
        </Route>
        <Route
          path="my"
          element={
            user ? (
              <Container>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <MyMenu />
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <Outlet />
                    </Grid.Column>
                    <Grid.Column width={3} />
                  </Grid.Row>
                </Grid>
              </Container>
            ) : (
              <Navigate to="/posts" />
            )
          }
        >
          <Route path="posts" element={<MyPosts />} />
          <Route path="collections" element={<MyCollections />} />
          <Route path="settings" element={<MySettings user={user} />} />
        </Route>
        <Route
          path="signin"
          element={user ? <Navigate to="/posts" replace /> : <Signin />}
        />
        <Route
          path="new-post"
          element={user ? <NewPost /> : <Navigate to="/posts" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
