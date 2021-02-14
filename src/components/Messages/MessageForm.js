import React, { useState } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';

const MessageForm = ({ messageData, currentChannel }) => {
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState(currentChannel)
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setMessage(e.target.value)
  }

  const sendMessage = () => {
    if(message) {
      setIsLoading(true)
      // messageData
      //   .child(channel.id)
      //   .push()
      //   .set()
    }
  }

  return (
    <Segment className="message_form">
      <Input
        fluid
        name="message"
        onChange={handleChange}
        style={{ marginBottom: '0.7em' }}
        label={<Button icon='add'/>}
        labelPosition="left"
        placeholder="Write your message"
      />
      <Button.Group icon widths="2">
        <Button 
          onClick={sendMessage}
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