import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserNav from './UserNav';
import Channels from './Channels';
import DirectMessage from './DirectMessage'

const SideBar = ({ currentUser }) => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: '#4C3C4C', fontSize: '1.2rem'}}
    >
      <UserNav currentUser={currentUser} />
      <Channels currentUser={currentUser} />
      <DirectMessage currentUser={currentUser} />
    </Menu>
  )
}

export default SideBar;