import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions/';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

const Channels = ({ currentUser, setCurrentChannel }) => {
  const [channels, setChannels] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [channelData] = useState({ channels: firebase.database().ref('channels') })
  const [currUser] = useState({ user: currentUser })
  const [active, setActive] = useState({})
  const [form, setForm] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    populateChannels();
    return () => {
      stopChannelFetch();
    }
  },[initialLoad])

  const populateChannels = () => {
    let getChannels = [];
     channelData.channels.on('child_added', (child) => {
      getChannels.push(child.val());
      setChannels(getChannels);
      setInitialChannel();
    })
  } 

  const stopChannelFetch = () => {
    channelData.channels.off()
  }

  const changeChannel = channel => {
    setActiveChannel(channel)
    setCurrentChannel(channel)
  }

  const setActiveChannel = channel => {
    setActive({ activeChannel: channel.id })
  }

  const setInitialChannel = () => {
    setInitialLoad(true)
    const initialChannel = channels[0]
    if(initialLoad && channels.length > 0) {
      setCurrentChannel(initialChannel);
      setActiveChannel(initialChannel);
    }
    setInitialLoad(false);
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
            onClick={() => changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
            active={channel.id === active.activeChannel}
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

export default connect(null, { setCurrentChannel })(Channels);