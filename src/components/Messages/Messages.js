import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessageForm from './MessageForm';
import MessagesHeader from './MessagesHeader';

const Messages = () => {
  return (
    <>
      <MessagesHeader />
      <Segment>
        <Comment.Group className="messages">

        </Comment.Group>
      </Segment>
      <MessageForm />
    </>
  )
}

export default Messages;