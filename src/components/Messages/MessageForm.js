import React from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';

const MessageForm = () => {
  return (
    <Segment className="message_form">
      <Input
        fluid
        name="message"
        style={{ marginBottom: '0.7em' }}
        label={<Button icon='add'/>}
        labelPosition="left"
        placeholder="Write your message"
      />
    </Segment>
  )
}

export default MessageForm;