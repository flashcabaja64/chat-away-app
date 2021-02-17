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
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    if(channel && user) {
      getMessages(channel.id)
    }
  }, [])

  const getMessages = channelId => {
    addMessages(channelId)
  }

  const addMessages = channelId => {
    //let fetchedMessages = [];
    setMessages([]);
    messageData.messages.child(channelId).on('child_added', msg => {
      setMessages((state) => {
        return [...state, msg.val()]
      })
      setMessageLoaded(false);
      totalUsers(messages)
    })
  }

  const totalUsers = messages => {
    const users = messages.reduce((acc, message) => {
      if(!acc.includes(message.user.name)) {
        acc.push(message.user.name)
        console.log(message.user.name)
      }
      return acc
    }, [])
    const countUsers = users.length
    setUserCount(countUsers)
    //console.log(users)
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

  const displayChannelName = channel => channel ? `# ${channel.name}` : '';
  
  return (
    <>
      <MessagesHeader 
        channelName={displayChannelName(channel)}
        userCount={userCount}
      />
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