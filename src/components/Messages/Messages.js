import React, { useState } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import MessageForm from './MessageForm';
import MessagesHeader from './MessagesHeader';

const Messages = ({ currentChannel, currentUser }) => {
  const [messageData] = useState({ messages: firebase.database().ref('messages') });
  const [channel] = useState(currentChannel);
  const [user] = useState(currentUser);
  
  return (
    <>
      <MessagesHeader />
      <Segment>
        <Comment.Group className="messages"></Comment.Group>
      </Segment>
      <MessageForm 
        messageData={messageData.messages}
        currentChannel={channel}
        currentUser={user}
      />
    </>
  )
}

export default Messages;