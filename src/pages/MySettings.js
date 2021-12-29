import React from 'react';
import {
  Header,
  Button,
  Segment,
  Modal,
  Input,
  Image,
} from 'semantic-ui-react';
import {
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { storage } from '../utils/firebase';

function MyName({ user }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [displayName, setDisplayName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit() {
    setIsLoading(true);

    await updateProfile(user, {
      displayName,
    });

    setIsLoading(false);
    setDisplayName('');
    setIsModalOpen(false);
  }

  return (
    <>
      <Header size="small">
        會員名稱
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
      </Header>
      <Segment vertical>{user.displayName}</Segment>
      <Modal open={isModalOpen} size="mini">
        <Modal.Header>修改會員名稱</Modal.Header>
        <Modal.Content>
          <Input
            placeholder="輸入新的會員名稱"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fluid
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button onClick={onSubmit} loading={isLoading}>
            修改
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

function MyPhoto({ user }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const previewImageUrl = file ? URL.createObjectURL(file) : user.photoURL;

  async function onSubmit() {
    setIsLoading(true);
    const metadata = {
      contentType: file.type,
    };
    const result = await uploadBytes(
      ref(storage, 'user-photos/' + user.uid),
      file,
      metadata
    );
    const imageUrl = await getDownloadURL(result.ref);
    await updateProfile(user, {
      photoURL: imageUrl,
    });
    setIsLoading(false);
    setFile(null);
    setIsModalOpen(false);
  }

  return (
    <>
      <Header size="small">
        會員照片
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
      </Header>
      <Segment vertical>
        <Image src={user.photoURL} avatar />
      </Segment>
      <Modal open={isModalOpen} size="mini">
        <Modal.Header>修改會員照片</Modal.Header>
        <Modal.Content image>
          <Image src={previewImageUrl} avatar wrapped />
          <Modal.Description>
            <Button as="label" htmlFor="post-image">
              上傳
            </Button>
            <Input
              type="file"
              id="post-image"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button onClick={onSubmit} loading={isLoading}>
            修改
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

function MyPassword({ user }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit() {
    setIsLoading(true);

    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      oldPassword
    );
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);

    setIsModalOpen(false);
    setOldPassword('');
    setNewPassword('');
    setIsLoading(false);
  }

  return (
    <>
      <Header size="small">
        會員密碼
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
      </Header>
      <Segment vertical>******</Segment>
      <Modal open={isModalOpen} size="mini">
        <Modal.Header>修改會員密碼</Modal.Header>
        <Modal.Content>
          <Header size="small">目前密碼</Header>
          <Input
            placeholder="輸入舊密碼"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fluid
          />
          <Header size="small">新密碼</Header>
          <Input
            placeholder="輸入新密碼"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fluid
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button onClick={onSubmit} loading={isLoading}>
            修改
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

function MySettings({ user }) {
  return (
    <>
      <Header>會員資料</Header>
      <MyName user={user} />
      <MyPhoto user={user} />
      <MyPassword user={user} />
    </>
  );
}

export default MySettings;
