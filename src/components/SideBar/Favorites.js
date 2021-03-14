import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import { Menu, Icon } from 'semantic-ui-react'

const Favorites = ({ setCurrentChannel, setPrivateChannel, currentUser }) => {
  const [favorites, setFavorites] = useState([]);
  const [active, setActive] = useState({});
  const [user] = useState(currentUser);
  const [userData] = useState(firebase.database().ref('users'));

  useEffect(() => {
    if(user) {
      addFavorites(user.uid);
    }

    return () => {
      removeListeners()
    }
  }, [])

  const removeListeners = () => {
    userData.child(`${user.uid}/favorites`).off();
  }

  const addFavorites = userId => {
    userData
      .child(userId)
      .child('favorites')
      .on('child_added', favs => {
        const favChannels = { id: favs.key, ...favs.val() }
        setFavorites([...favorites, favChannels])
      })
    
      userData
        .child(userId)
        .child('favorites')
        .on('child_removed', favs => {
          const removeFavs = { id: favs.key, ...favs.val() }
          const filterChannels = favorites.filter(channel => {
            return channel.id !== removeFavs.id
          })
          setFavorites([filterChannels])
        })
  }

  const setActiveChannel = channel => {
    setActive({ activeChannel: channel.id });
  }

  const changeChannel = channel => {
    setActiveChannel(channel);
    setCurrentChannel(channel);
    setPrivateChannel(false);
  }

  const displayChannels = favorites => (
    favorites.length > 0 && favorites.map(favorite => (
      <Menu.Item
        key={favorite.id}
        onClick={() => changeChannel(favorite)}
        name={favorite.name}
        style={{ opacity: 0.7 }}
        active={favorite.id === active.activeChannel}
      >
        # { favorite.name }
      </Menu.Item>
  )));

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> FAVORITES 
        </span>
        ({ favorites.length }) 
      </Menu.Item>
      {displayChannels(favorites)}
    </Menu.Menu>
  )
}

export default connect(null, { setPrivateChannel, setCurrentChannel })(Favorites);