import React, { useState } from 'react';
import mime from 'mime-types';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';

const UploadModal = ({ modal, closeModal, uploadFile }) => {
  const [file, setFile] = useState(null);
  const [authorized] = useState(['image/jpeg', 'image/png'])

  const addFile = e => {
    const image = e.target.files[0];
    if(image) {
      setFile(image)
    }
  }

  const sendFile = () => {
    if(file !== null) {
      if(isAuthorized(file.name)) {
        const data = {contentType: mime.lookup(file.name)};
        uploadFile(file, data)
        closeModal();
        setFile(null);
      }
    }
  }

  const isAuthorized = fileName => authorized.includes(mime.lookup(fileName));

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
          onChange={addFile}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          inverted
          onClick={sendFile}
        >
        <Icon name="checkmark"/> Send
        </Button>
        <Button
          color="red"
          inverted
          onClick={closeModal}
        >
        <Icon name="remove"/> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default UploadModal;