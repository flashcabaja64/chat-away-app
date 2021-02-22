import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions/';
import { Menu, Icon, Modal, Form, Input, Button, Popup, Label } from 'semantic-ui-react';

const Channels = ({ currentUser, setCurrentChannel, setPrivateChannel }) => {
  const [channels, setChannels] = useState([]);
  const [channel, setChannel] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [channelData] = useState({ channels: firebase.database().ref('channels') })
  const [messagesData] = useState(firebase.database().ref('messages'));
  const [notifications, setNotifications] = useState([])
  const [currUser] = useState({ user: currentUser })
  const [active, setActive] = useState({})
  const [form, setForm] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getChannels();
    return () => stopChannelFetch();
  }, [])

  const getChannels = () => {
    setChannels([]);
    channelData.channels.on('child_added', (child) => {
      setChannels(state => { 
        const updated = [...state, child.val()];
        setInitialChannel(updated);
        return updated;
      });
      addNotifications(child.key)
    });
  } 

  const addNotifications = (channelId) => {
    messagesData.child(channelId).on('value', channel => {
      if(channel) {
        handleNotifications(channelId, channel.id, notifications, channel)
      }
    })
  }

  const handleNotifications = (channelId, currentChannel, notifications, channelValue) => {
    let lastTotal = 0;
    let index = notifications.findIndex(notification => notification.id === channelId)

    if(index !== -1) {
      if(channelId !== currentChannel) {
        lastTotal = notifications[index].total;

        if(channelValue.numChildren() - lastTotal > 0) {
          notifications[index].count = channelValue.numChildren() - lastTotal
        }
      }
      notifications[index].lastKnownTotal = channelValue.numChildren()
    } else {
      notifications.push({
        id: channelId,
        total: channelValue.numChildren(),
        lastKnownTotal: channelValue.numChildren(),
        count: 0
      })
    }
    setNotifications(notifications)
  }

  const stopChannelFetch = () => {
    channelData.channels.off();
  }

  const changeChannel = channel => {
    setActiveChannel(channel);
    clearNotifications()
    setCurrentChannel(channel);
    setPrivateChannel(false);
    setChannel(channel);
  }

  const clearNotifications = () => {
    let index = notifications.findIndex(notification => notification.id === channel.id)

    if(index !== -1) {
      let updatedNotification = [...notifications];
      updatedNotification[index].total = notifications[index].lastKnownTotal;
      updatedNotification[index].count = 0;
      setNotifications([updatedNotification])
    }
  }

  const getTotalNotification = (channel) => {
    let count = 0;

    notifications.forEach(notification => {
      if(notification.id === channel.id) {
        count = notification.count
      }
    })

    if(count > 0) return count
  }

  const setActiveChannel = channel => {
    setActive({ activeChannel: channel.id });
  }

  const setInitialChannel = updated => {
    if(initialLoad && updated.length) {
      const initialChannel = updated[0];
      setCurrentChannel(initialChannel);
      setActiveChannel(initialChannel);
      setPrivateChannel(false);
      setInitialLoad(false); 
      setChannel(initialChannel)
    }
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

  const displayChannels = channels => (
    channels.length > 0 && channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === active.activeChannel}
      >
        {getTotalNotification(channel) && (
          <Label color="red">{getTotalNotification(channel)}</Label>
        )}
        # { channel.name }
      </Menu.Item>
  )));

  return (
    <>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange" />CHANNELS{" "}
          </span>
          ({ channels.length }) 
          <Popup
            content="Add Channels"
            size="tiny"
            trigger={
              <Icon 
                style={{ cursor: 'pointer' }} 
                name="add" 
                onClick={() => setOpen(true)} 
              />
            }
          />
          
        </Menu.Item>
        {displayChannels(channels)}
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

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);