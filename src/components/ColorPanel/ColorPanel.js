import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import { connect } from 'react-redux'
import { setColors } from '../../actions'

const ColorPanel = ({ currentUser, setColors }) => {
  const [open, setOpen] = useState(false);
  const [user] = useState(currentUser);
  const [userData] = useState(firebase.database().ref('users'));
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [userColors, setUserColors] = useState([]);

  useEffect(() => {
    if(user) {
      addColors(user.uid)
    }
  }, [])

  const addColors = (userId) => {
    let userColors = [];
    userData.child(`${userId}/colors`).on('child_added', color => {
      userColors.unshift(color.val());
      setUserColors(userColors)
    })
  }

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const primaryChange = (color) => setPrimary(color.hex)
  const secondaryChange = (color) => setSecondary(color.hex)

  const handleSaveColors = () => {
    if(primary && secondary) {
      saveColors(primary, secondary)
    }
  }

  const displayUserColors = colors => (
    colors.length > 0 && colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider/>
        <div className="color_container" onClick={() => setColors(color.primary, color.secondary)}>
          <div className="color_square" style={{ background: color.primary }}>
            <div className="color_overlay" style={{ background: color.secondary }}>

            </div>
          </div>
        </div>
      </React.Fragment>
    ))
  )

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
      {displayUserColors(userColors)}

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

export default connect(null, { setColors })(ColorPanel);