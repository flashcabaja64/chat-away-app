import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import { Menu, Icon } from 'semantic-ui-react';

const DirectMessage = ({ currentUser, setCurrentChannel, setPrivateChannel }) => {
  const [users, setUsers] = useState([]);
  const [user] = useState(currentUser);
  const [activeChannel, setActiveChannel] = useState('')
  const [userData] = useState(firebase.database().ref('users'));
  const [onlineData] = useState(firebase.database().ref('.info/connected'));
  const [statusData] = useState(firebase.database().ref('presence'));

  useEffect(() => {
    user && getUsers(user.uid);
    return () => {
      removeListeners()
    }
  },[])

  const removeListeners = () => {
    userData.off();
    statusData.off();
    onlineData.off();
  }

  const addStatusToUser = (userId, connected = true) => {
    const updatedUsers = users.reduce((acc, user) => {
      if(user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return acc.concat(user)
    }, [])
    setUsers([updatedUsers])
  }

  const getUsers = currentUserId => {
    //setUsers([])
    let loadedUsers = []
    userData.on('child_added', (users) => {
      
      if(currentUserId !== users.key) {
        let user = users.val();
        user["uid"] = users.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        setUsers(loadedUsers);
        // setUsers(state => {
        //   let user = users.val();
        //   user['uid'] = users.key;
        //   user['status'] = 'offline';
        //   return [...state, user]
        // })
      }
      
    })
    onlineData.on('value', online => {
      if(online.val() === true) {
        const ref = statusData.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if(err !== null) {
            console.log(err)
          }
        })
      }
    })
    statusData.on('child_added', status => {
      if(currentUserId !== status.key) {
        addStatusToUser(status.key)
      }
    })
    statusData.on('child_removed', status => {
      if(currentUserId !== status.key) {
        addStatusToUser(status.key, false)
      }
    })
  }

  const isUserOnline = (user) => user.status === 'online';

  const changeChannel = user => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.username
    }
    
    setCurrentChannel(channelData);
    setPrivateChannel(true);
    setActiveChannel(user.uid)
  }

  const getChannelId = userId => {
    const currentId = user.uid;
    return userId < currentId 
      ? `${userId}/${currentId}` 
      : `${currentId}/${userId}`
  }

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail"/> DIRECT MESSAGES 
          ({users.length})
        </span>
      </Menu.Item>
      {users.map(user => (
        <Menu.Item
          key={user.uid}
          active={user.uid === activeChannel}
          onClick={() => changeChannel(user)}
          style={{ opacity: 0.7, fontStyle: 'italic' }}
        >
          <Icon
            name="circle"
            color={isUserOnline(user) ? 'green' : 'red'}
          />
          @ {user.username}
        </Menu.Item>
      ))}
    </Menu.Menu>
  )
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessage);