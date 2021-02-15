import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import MessageForm from './MessageForm';
import Message from './Message';
import MessagesHeader from './MessagesHeader';

const Messages = ({ currentChannel, currentUser }) => {
  const [messageData] = useState({ messages: firebase.database().ref('messages') });
  const [messages, setMessages] = useState([]);
  const [messageLoaded, setMessageLoaded] = useState(true)
  const [channel] = useState(currentChannel);
  const [user] = useState(currentUser);

  useEffect(() => {
    if(channel && user) {
      getMessages(channel.id)
    }
  }, [])

  const getMessages = channelId => {
    addMessages(channelId)
  }

  const addMessages = channelId => {
    let fetchedMessages = [];
    messageData.messages.child(channelId).on('child_added', msg => {
      fetchedMessages.push(msg.val())
      setMessages(fetchedMessages);
      setMessageLoaded(false);
      //console.log(fetchedMessages);
    })
  }

  const displayMessages = messages => (
    messages.length && messages.map(msg => (
      <Message 
        key={msg.timestamp}
        message={msg}
        user={user}
      />
    ))
  )
  
  return (
    <>
      <MessagesHeader />
      <Segment>
        <Comment.Group className="messages">
          {displayMessages(messages)}
        </Comment.Group>
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