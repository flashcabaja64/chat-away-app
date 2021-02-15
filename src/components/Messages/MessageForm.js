import React, { useState } from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';

const MessageForm = ({ messageData, currentChannel, currentUser }) => {
  const [message, setMessage] = useState('');
  const [user] = useState(currentUser);
  const [channel, setChannel] = useState(currentChannel);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([])

  const handleChange = e => {
    setMessage(e.target.value)
  }

  const createMessage = () => {
    const msgObj = {
      content: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    }
    return msgObj;
  }

  const sendMessage = () => {
    if(message) {
      setIsLoading(true)
      messageData
        .child(channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setIsLoading(false);
          setMessage('')
          setError([])
        })
        .catch(err => {
          console.log(err)
          setIsLoading(false)
          setError([...err, err])
        })
    } else {
      setError([{ message: 'Add a message' }])
    }
  }
  const handleError = (errorName) => error.some(err => err.message.includes(errorName)) ? 'error' : ''

  return (
    <Segment className="message_form">
      <Input
        fluid
        name="message"
        onChange={handleChange}
        value={message}
        style={{ marginBottom: '0.7em' }}
        label={<Button icon='add'/>}
        labelPosition="left"
        placeholder="Write your message"
        className={handleError('message')}
      />
      <Button.Group icon widths="2">
        <Button 
          onClick={sendMessage}
          disabled={isLoading}
          color="blue"
          content="Reply"
          labelPosition="left"
          icon="reply"
        />
        <Button
          color="teal"
          content="Upload"
          labelPosition="right"
          icon="upload"
        />
      </Button.Group>
    </Segment>
  )
}

export default MessageForm;