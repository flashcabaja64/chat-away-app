import React, { useState } from 'react';
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

const Channels = () => {
  const [channels] = useState([]);
  const [channelData] = useState({channels: firebase.database().ref('channels') })
  const [form, setForm] = useState({});
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault();
   if(isValidForm(form)) {
     console.log('form valid')
   } else {
     console.log('invalid')
   }
  }

  const isValidForm = ({ channelName, channelDetails }) => {
    return channelName && channelDetails
  }

  const addChannel = () => {
    
  }

  return (
    <>
      <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" />CHANNELS{" "}
          </span>
          ({ channels.length }) 
          <Icon 
            style={{ cursor: 'pointer' }} 
            name="add" 
            onClick={() => setOpen(true)} 
          />
        </Menu.Item>
      </Menu.Menu>

      <Modal
        basic
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header>Add Channels</Modal.Header>
        <Modal.Content>
          <Form onSubmit={onSubmit}>
            <Form.Field>
              <Input 
                fluid
                label="Name of Channel"
                name="channelName"
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input 
                fluid
                label="Channel Description"
                name="channelDetails"
                onChange={handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={onSubmit}>
            <Icon name="plus circle"/> Add
          </Button>
          <Button color="red" inverted onClick={() => setOpen(false)} >
            <Icon name="close"/> Close
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default Channels;