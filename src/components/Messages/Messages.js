import React, { useState } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import MessageForm from './MessageForm';
import MessagesHeader from './MessagesHeader';

const Messages = ({ currentChannel }) => {
  const [messageData] = useState({ messages: firebase.database().ref('messages') });
  const [channel] = useState(currentChannel)
  return (
    <>
      <MessagesHeader />
      <Segment>
        <Comment.Group className="messages"></Comment.Group>
      </Segment>
      <MessageForm 
        messageData={messageData.messages}
        currentChannel={channel}
      />
    </>
  )
}

export default Messages;