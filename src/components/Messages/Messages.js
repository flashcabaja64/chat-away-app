import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setUserPosts } from '../../actions'
import firebase from '../../firebase';
import MessageForm from './MessageForm';
import Message from './Message';
import MessagesHeader from './MessagesHeader';
import Typing from './Typing';

const Messages = ({ currentChannel, currentUser, isPrivateChannel, setUserPosts }) => {
  const [messageData] = useState({ messages: firebase.database().ref('messages') });
  const [messages, setMessages] = useState([]);
  const [messageLoaded, setMessageLoaded] = useState(true)
  const [channel] = useState(currentChannel);
  const [user] = useState(currentUser);
  const [userData] = useState(firebase.database().ref('users'));
  const [userCount, setUserCount] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [searchResults, setSearchResults] = useState([])
  const [privateChannel] = useState(isPrivateChannel)
  const [privateMessageData] = useState(firebase.database().ref('privateMessages'))
  const [typingData] = useState(firebase.database().ref('typing'))
  const [connectedData] = useState(firebase.database().ref('.info/connected'))
  const [isFavorite, setIsFavorite] = useState(false);
  const [load, setLoad] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

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

  // useEffect(() => {
  //   favoriteChannel()
  // }, [load])

  const getMessages = channelId => {
    addMessages(channelId)
    addTyping(channelId)
    setLoad(true);
  }

  const addTyping = channelId => {
    let typingUsers = [];

    typingData.child(channelId).on('child_added', typing => {
      if(typing.key !== user.uid) {
        typingUsers = typingUsers.concat({
          id: typing.key,
          name: typing.val()
        })
        setTypingUsers(typingUsers)
      }
    })

    typingData.child(channelId).on('child_removed', typing => {
      const index = typingUsers.findIndex(user => user.id === typing.key);
      if(index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== typing.key);
        setTypingUsers(typingUsers)
      }
    })

    connectedData.on('value', connect => {
      if(connect.val() === true) {
        typingData
          .child(channelId)
          .child(user.uid)
          .onDisconnect()
          .remove(err => {
            if(err !== null) {
              console.error(err)
            }
          })
      }
    })
  }

  const addUserFavorites = (channelId, userId) => {
    userData
      .child(userId)
      .child('favorites')
      .once('value')
      .then(data => {
        if(data.val() !== null) {
          //console.log(data.val())
          const channelIds = Object.keys(data.val());
          const prevFavs = channelIds.includes(channelId);
          setIsFavorite(prevFavs)
          //console.log(channelIds, channelId)
          //console.log(isFavorite)
        }
      })
  }

  const handleFavorites = () => {
    setIsFavorite(state => !state);
  }

  const favoriteChannel = () => {
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

  const addMessages = channelId => {
    let updatedMessages = [];
    const data = getMessagesData();
    data.child(channelId).on('child_added', msg => {
      updatedMessages.push(msg.val())
      setMessages(updatedMessages)
      setMessageLoaded(false)
      totalUsersPosts(updatedMessages)
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

  const totalUsersPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if(message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }
      return acc
    }, {})
    setUserPosts(userPosts)
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

  const displayTypingUsers = users => (
    users.length > 0 && users.map(user => (
      <div key={user.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2em' }}>
        <span className="user_typing"></span>{user.name} is typing<Typing />
      </div>
    ))
  )

  const displayChannelName = channel => {
    return channel 
      ? `${privateChannel ? '@' : '#'}${channel.name}`
      : ''
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

          {displayTypingUsers(typingUsers)}
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

export default connect(null, { setUserPosts })(Messages);