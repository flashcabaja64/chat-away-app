import React, { useState } from 'react';
import mime from 'mime-types';
import { Modal, Input, Button, Icon, Image } from 'semantic-ui-react';

const UploadModal = ({ modal, closeModal, uploadFile }) => {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null)
  const [authorized] = useState(['image/jpeg', 'image/png'])

  const addFile = e => {
    const image = e.target.files[0];
    const reader = new FileReader();
    if(image) {
      setFile(image);
      reader.onload = e => {
        setImg(e.target.result);
      }
      reader.readAsDataURL(e.target.files[0]);
    } 
  }

  const sendFile = () => {
    if(file !== null) {
      if(isAuthorized(file.name)) {
        const data = {contentType: mime.lookup(file.name)};
        uploadFile(file, data);
        closeModal();
        setFile(null);
        setImg(null);
      }
    }
  }

  const isAuthorized = fileName => authorized.includes(mime.lookup(fileName));

  return (
    <Modal dimmer="inverted" open={modal} onClose={closeModal}>
      <Modal.Header>Upload an Image</Modal.Header>
      <Modal.Content>
          <Image 
            size="large" 
            src={img} 
            centered 
            style={{ display: file !== null ? 'flex' : 'none' }}
          />
          <Input
            fluid
            hidden
            label="File types: jpg, png"
            name="file"
            type="file"
            onChange={addFile}
          />
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          onClick={sendFile}
        >
        <Icon name="checkmark"/> Send
        </Button>
        <Button
          color="red"
          onClick={() => {
            closeModal();
            setFile(null);
            setImg(null);
          }}
        >
        <Icon name="remove"/> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default UploadModal;