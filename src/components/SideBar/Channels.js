import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

const Channels = ({ currentUser }) => {
  const [channels, setChannels] = useState([]);
  const [channelData] = useState({ channels: firebase.database().ref('channels') })
  const [currUser] = useState({ user: currentUser })
  const [form, setForm] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    populateChannels()
  }, [])

  const populateChannels = () => {
    let getChannels = [];
    channelData.channels.on('child_added', (child) => {
      getChannels.push(child.val());
      setChannels(getChannels)
      console.log(getChannels)
    })
  } 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault();
   if(isValidForm(form)) {
    addChannel();
   } else {
     console.log('invalid')
   }
  }

  const isValidForm = ({ channelName, channelDetails }) => {
    return channelName && channelDetails
  }

  const addChannel = () => {
    const key = channelData.channels.push().key;

    const newChannel = {
      id: key,
      name: form.channelName,
      details: form.channelDetails,
      createdBy: {
        name: currUser.user.displayName,
        avatar: currUser.user.photoURL
      }
    };

    channelData.channels
      .child(key)
      .update(newChannel)
      .then(() => {
        setForm({});
        setOpen(false);
        console.log('channel created')
      })
      .catch(err => console.log(err))
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
        {channels.length > 0 && channels.map(channel => (
          <Menu.Item
            key={channel.id}
            onClick={() => console.log(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
          >
            # { channel.name }
          </Menu.Item>
        ))}
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