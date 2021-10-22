import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';
import React from 'react';

import firebase from './utils/firebase';

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
    firebase.auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);
  return (
    <BrowserRouter>
      <Header user={user} />
      <Switch>
        <Route path="/posts">
          <Container>
            <Grid>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Topics />
                </Grid.Column>
                <Grid.Column width={10}>
                  <Switch>
                    <Route path="/posts" exact>
                      <Posts />
                    </Route>
                    <Route path="/posts/:postId" exact>
                      {user !== null ? <Post /> : <Redirect to="/posts" />}
                    </Route>
                  </Switch>
                </Grid.Column>
                <Grid.Column width={3}></Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Route>

        <Route path="/my">
          {user !== null ? (
            <Container>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <MyMenu />
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <Switch>
                      <Route path="/my/posts" exact>
                        <MyPosts />
                      </Route>
                      <Route path="/my/collections" exact>
                        <MyCollections />
                      </Route>
                      <Route path="/my/settings" exact>
                        <MySettings user={user} />
                      </Route>
                    </Switch>
                  </Grid.Column>
                  <Grid.Column width={3}></Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          ) : (
            <Redirect to="/posts" />
          )}
        </Route>

        <Route path="/signin" exact>
          {user !== null ? <Redirect to="/posts" /> : <Signin />}
        </Route>
        <Route path="/new-post" exact>
          {user !== null ? <NewPost /> : <Redirect to="/posts" />}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
