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
  const [userCount, setUserCount] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if(channel && user) {
      getMessages(channel.id)
    }
  }, [])

  useEffect(() => {
    searchChannelMessage();
  },[searchMessage])

  useEffect(() => {
    setMessageLoaded(false);
    totalUsers(messages);
  }, [messages])

  const getMessages = channelId => {
    addMessages(channelId)
  }

  const addMessages = channelId => {
    setMessages([]);
    messageData.messages.child(channelId).on('child_added', msg => {
      setMessages((state) => {
        return [...state, msg.val()]
      })
    })
  }

  const handleSearchInput = e => {
    setSearchMessage(e.target.value);
  }

  const searchChannelMessage = () => {
    const channelMessages = [...messages];
    const regex = new RegExp(searchMessage, 'gi');
    const results = channelMessages.reduce((acc, message) => {
      if(message.content.match(regex) && message.content || message.user.name.match(regex)) {
        acc.push(message)
      }
      return acc
    },[])
    setSearchResults([...results])
  }

  const totalUsers = messages => {
    const users = messages.reduce((acc, message) => {
      if(!acc.includes(message.user.name)) {
        acc.push(message.user.name)
      }
      return acc
    }, [])
    const plural = users.length > 1 || users.length === 0 ? 'Users' : 'User'
    setUserCount(`${users.length} ${plural}`)
  }

  const displayMessages = messages => (
    messages.length > 0 && messages.map(msg => (
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
        handleSearch={handleSearchInput}
      />
      <Segment>
        <Comment.Group className="messages">
          {searchMessage ? displayMessages(searchResults) : displayMessages(messages)}
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