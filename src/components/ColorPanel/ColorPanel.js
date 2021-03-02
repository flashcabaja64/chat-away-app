import React, { useState } from 'react';
import firebase from '../../firebase';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

const ColorPanel = ({ currentUser }) => {
  const [open, setOpen] = useState(false);
  const [user] = useState(currentUser)
  const [userData] = useState(firebase.database().ref('users'))
  const [primary, setPrimary] = useState('')
  const [secondary, setSecondary] = useState('')

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const primaryChange = (color) => setPrimary(color.hex)
  const secondaryChange = (color) => setSecondary(color.hex)

  const handleSaveColors = () => {
    if(primary && secondary) {
      saveColors(primary, secondary)
    }
  }

  const saveColors = (primary, secondary) => {
    userData
      .child(`${currentUser.uid}/colors`)
      .push()
      .update({
        primary,
        secondary
      })
      .then(() => {
        console.log('colors added')
        closeModal();
      })
      .catch(err => console.log(err))
  }

  return (
    <Sidebar
      as={Menu}
      icon="labeled"
      inverted
      vertical
      visible
      width="very thin"
    >
      <Divider />
      <Button icon="add" size="small" color="blue" onClick={openModal} />

      <Modal basic open={open} onClose={closeModal} dimmer="inverted">
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Segment>
            <Label content="Primary Color"/>
            <SliderPicker color={primary} onChange={primaryChange} />
          </Segment>
          
          <Segment>
            <Label content="Secondary Color"/>
            <SliderPicker color={secondary} onChange={secondaryChange} />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={handleSaveColors}>
            <Icon name="checkmark"/> Save Color
          </Button>
          <Button color="red" onClick={closeModal}>
            <Icon name="remove"/> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  )
}

export default ColorPanel;