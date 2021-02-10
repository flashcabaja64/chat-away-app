import React, { useState } from 'react';
import firebase from '../../firebase';
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react';

const UserNav = ({ currentUser }) => {
  const [currUser] = useState({
    user: currentUser
  })

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('logged out'))
      .catch((err) => console.log(err))
  }

  const dropdownOptions = () => [
    {
      key: 'user',
      text: <span>Signed in as <strong>{currUser.user.displayName}</strong></span>,
      disabled: true
    },
    {
      key: 'avatar',
      text: <span>Change Avatar</span>
    },
    {
      key: 'log-out',
      text: <span onClick={handleSignOut}>Log Out</span>
    }
  ]

  return (
    <Grid style={{ background: '#4C3C4C' }}>
      <Grid.Column>
        <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>Chat-Away</Header.Content>
          </Header>
        </Grid.Row>
        <Header style={{ padding: '0.25em' }} as="h4" inverted>
          <Dropdown 
            trigger={
              <span>
                <Image src={currUser.user.photoURL} spaced="right" avatar/>
                {currUser.user.displayName}
              </span>
            }
            options={dropdownOptions()}
          />
        </Header>
      </Grid.Column>
    </Grid>
  )
}

export default UserNav;