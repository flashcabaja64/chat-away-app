import React from 'react';
import { Dropdown, Grid, Header, Icon } from 'semantic-ui-react';

const UserNav = () => {

  const dropdownOptions = () => [
    {
      key: 'user',
      text: <span>Signed in as <strong>User</strong></span>,
      disabled: true
    },
    {
      key: 'avatar',
      text: <span>Change Avatar</span>
    },
    {
      key: 'log-out',
      text: <span>Log Out</span>
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
            trigger={<span>User</span>}
            options={dropdownOptions()}
          />
        </Header>
      </Grid.Column>
    </Grid>
  )
}

export default UserNav;