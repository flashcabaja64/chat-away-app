import React, { useState, useRef, useEffect, useCallback } from 'react';
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor';
import { Dropdown, Grid, Header, Icon, Image, Modal, Input, Button } from 'semantic-ui-react';

const UserNav = ({ currentUser, primaryColor }) => {
  const [currUser] = useState({ user: currentUser });
  const [open, setOpen] = useState(false);
  const [rotate, setRotate] = useState(parseInt(0));
  const [previewImage, setPreviewImage] = useState('');
  const [croppedImage, setCroppedImage] = useState('');
  const [uploadedCroppedImage, setUploadedCroppedImage] = useStateCallback('');
  //const [startUpload, setStartUpload] = useState(false);
  const [blob, setBlob] = useState('');
  const avatarEditor = useRef(null);
  const [avatar, setAvatar] = useState('')
  const [storageData] = useState(firebase.storage().ref());
  const [userData] = useState(firebase.auth().currentUser); 
  const [usersData] = useState(firebase.database().ref('users'));

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('logged out'))
      .catch((err) => console.log(err))
  }

  const openModal = () => setOpen(true);

  const closeModal = () => {
    setOpen(false)
    setPreviewImage('')
  }

  useEffect(() => {
    getAvatar();
  },[currUser])

  const dropdownOptions = [
    {
      key: 'user',
      text: <span>Signed in as <strong>{currUser.user.displayName}</strong></span>,
      disabled: true
    },
    {
      key: 'avatar',
      text: <span onClick={openModal}>Change Avatar</span>
    },
    {
      key: 'log-out',
      text: <span onClick={handleSignOut}>Log Out</span>
    }
  ];

  const handleChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if(file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        setPreviewImage(reader.result)
      })
    }
  }

  const handleRange = e => setRotate(parseInt(e.target.value))

  const cropImage = () => {
    if(avatarEditor.current) {
      avatarEditor.current.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        setCroppedImage(imageUrl)
        setBlob(blob)
      })
    }
  }

  const uploadCroppedImage = () => {
    let metaData = { contentType: 'image/jpeg' }
    storageData
      .child(`avatars/user-${userData.uid}`)
      .put(blob, metaData)
      .then(image => {
        image.ref.getDownloadURL().then((url) => {
          console.log(url)
          setUploadedCroppedImage(url, () => changeAvatar());
          console.log(url)
          //setStartUpload(true);
          getAvatar()
        })
      })
      .catch(err => console.log(err))
  }

  const getAvatar = () => {
    let storage = firebase.storage().ref(`avatars/user-${userData.uid}`)
    storage.getDownloadURL().then(url => {
      setAvatar(url)
    })
  }

  const changeAvatar = () => {
    userData
      .updateProfile({
        photoURL: uploadedCroppedImage
      })
      .then(() => {
        console.log(uploadedCroppedImage)
        console.log('PhotoURL updated')
        closeModal();
      })
      .catch(err => console.log(err))
      
    usersData
      .child(userData.uid)
      .update({ avatar: uploadedCroppedImage })
      .then(() => console.log('User avatar updated'))
      .catch(err => console.log(err))
  }

  return (
    <Grid style={{ background: primaryColor }}>
      <Grid.Column>
        <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
          <Header inverted floated="left" as="h2" style={{ marginRight: 0 }}>
            <Icon name="code"/>
            <Header.Content>Chat-Away</Header.Content>
          </Header>
          <Header style={{ padding: '0.25em' }} as="h4" inverted>
            <Dropdown 
              trigger={
                <span>
                  <Image src={avatar} spaced="right" avatar/>
                  {currUser.user.displayName}
                </span>
              }
              options={dropdownOptions}
            />
          </Header>
        </Grid.Row>
        <Modal basic open={open} onClose={closeModal} dimmer="inverted">
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input
              fluid
              type="file"
              label="New Avatar"
              name="previewImage"
              onChange={handleChange}
            />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {previewImage && (
                    <>
                      <AvatarEditor 
                        ref={avatarEditor}
                        image={previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                        rotate={rotate}
                      />
                      <Input 
                        type="range"
                        min={0}
                        max={360}
                        onChange={handleRange}
                        label="Rotate Image"
                        value={rotate}
                      />
                    </>
                  )}
                </Grid.Column>
                <Grid.Column>
                  {croppedImage && (
                    <Image
                      margin={{ margin: '3.5 auto'}}
                      width={100}
                      height={100}
                      src={croppedImage}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
              {croppedImage && (
                <Button color="green" onClick={uploadCroppedImage}>
                  <Icon name="save"/> Change Avatar
                </Button>
              )}
              <Button color="green" onClick={cropImage}>
                <Icon name="image"/> Preview
              </Button>
              <Button color="red" onClick={closeModal}>
                <Icon name="remove"/> Cancel
              </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  )
}

const useStateCallback = (initialState) => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null);

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb; 
    setState(state);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
}

export default UserNav;