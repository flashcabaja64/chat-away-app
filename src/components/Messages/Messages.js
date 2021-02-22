import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import MessageForm from './MessageForm';
import Message from './Message';
import MessagesHeader from './MessagesHeader';

const Messages = ({ currentChannel, currentUser, isPrivateChannel }) => {
  const [messageData] = useState({ messages: firebase.database().ref('messages') });
  const [messages, setMessages] = useState([]);
  const [messageLoaded, setMessageLoaded] = useState(true)
  const [channel] = useState(currentChannel);
  const [user] = useState(currentUser);
  const [userData] = useState(firebase.database().ref('users'));
  const [userCount, setUserCount] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [searchResults, setSearchResults] = useState([])
  const [isFavorite, setIsFavorite] = useState(false);
  const [privateChannel] = useState(isPrivateChannel)
  const [privateMessageData] = useState(firebase.database().ref('privateMessages'))

  useEffect(() => {
    if(channel && user) {
      getMessages(channel.id)
      addUserFavorites(channel.id, user.uid)
    }
  }, [])

  useEffect(() => {
    searchChannelMessage();
  },[searchMessage])

  useEffect(() => {
    setMessageLoaded(false);
    totalUsers(messages);
  }, [messages])

  useEffect(() => {
    favoriteChannel();
  }, [isFavorite])

  const getMessages = channelId => {
    addMessages(channelId)
  }

  const addUserFavorites = (channelId, userId) => {
    userData
      .child(userId)
      .child('favorites')
      .once('value')
      .then(data => {
        if(data.val() !== null) {
          console.log(data.val())
          const channelIds = Object.keys(data.val());
          const prevFavs = channelIds.includes(channelId);
          setIsFavorite(prevFavs)
        }
      })
  }

  const addMessages = channelId => {
    setMessages([]);
    const data = getMessagesData();
    data.child(channelId).on('child_added', msg => {
      setMessages((state) => {
        return [...state, msg.val()]
      })
    })
  }

  const getMessagesData = () => {
    return privateChannel ? privateMessageData : messageData.messages
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

  const displayChannelName = channel => {
    return channel 
      ? `${privateChannel ? '@' : '#'}${channel.name}`
      : ''
  }

  const handleFavorites = () => {
    setIsFavorite((state) => !state)
  }

  const favoriteChannel = () => {
    console.log(userData
      .child(`${user.uid}/favorites`).child(channel.id))
    if(isFavorite) {
      userData
        .child(`${user.uid}/favorites`)
        .update({
          [channel.id]: {
            name: channel.name,
            details: channel.details,
            createdBy: {
                name: channel.createdBy.name,
                avatar: channel.createdBy.avatar
            }
          }
        })
    } else {
      userData
        .child(`${user.uid}/favorites`)
        .child(channel.id)
        .remove(err => {
          if(err !== null) {
            console.error(err)
          }
        })
    }
  }

  return (
    <>
      <MessagesHeader 
        channelName={displayChannelName(channel)}
        userCount={userCount}
        handleSearch={handleSearchInput}
        isPrivateChannel={isPrivateChannel}
        isFavorite={isFavorite}
        handleFavorites={handleFavorites}
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
        isPrivateChannel={isPrivateChannel}
        getMessagesData={getMessagesData}
      />
    </>
  )
}

export default Messages;