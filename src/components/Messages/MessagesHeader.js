import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

const MessagesHeader = ({ channelName, userCount, handleSearch, isPrivateChannel, isFavorite, handleFavorites }) => {
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floadted="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          {/* {!isPrivateChannel && (
            <Icon 
              name={isFavorite ? 'star' : 'star outline'} 
              color={isFavorite ? 'yellow' : 'black'}
              onClick={handleFavorites}
            />)} */}
        </span>
        <Header.Subheader>{userCount}</Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          size="mini"
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