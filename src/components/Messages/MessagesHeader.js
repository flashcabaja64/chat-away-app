import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

const MessagesHeader = ({ channelName, userCount }) => {
  //console.log(userCount)
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floadted="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          <Icon name='star outline' color="black"/>
        </span>
        <Header.Subheader>{userCount < 1 ? 'No Users' : `${userCount} Users`}</Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  )
}

export default MessagesHeader;