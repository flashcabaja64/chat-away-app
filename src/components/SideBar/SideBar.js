import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserNav from './UserNav'

const SideBar = () => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: '#4C3C4C', fontSize: '1.2rem'}}
    >
      <UserNav />
    </Menu>
  )
}

export default SideBar;