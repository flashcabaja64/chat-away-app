import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

const MessagesHeader = ({ channelName, userCount, handleSearch, searching }) => {
  //console.log(userCount)
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floadted="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          <Icon name='star outline' color="black"/>
        </span>
        <Header.Subheader>{userCount}</Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          size="mini"
          loading={searching}
          onChange={handleSearch}
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  )
}

export default MessagesHeader;