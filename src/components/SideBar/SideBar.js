import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserNav from './UserNav';
import Channels from './Channels';
import Favorites from './Favorites';
import DirectMessage from './DirectMessage'

const SideBar = ({ currentUser, primaryColor }) => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: primaryColor, fontSize: '1.2rem'}}
    >
      <UserNav 
        currentUser={currentUser} 
        primaryColor={primaryColor}
      />
      <Favorites currentUser={currentUser} />
      <Channels currentUser={currentUser} />
      <DirectMessage currentUser={currentUser} />
    </Menu>
  )
}

export default SideBar;