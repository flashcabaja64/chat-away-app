import React, { useState } from 'react';
import { Segment, Accordion, Header, Icon, Image, List } from 'semantic-ui-react'

const MetaPanel = ({ isPrivateChannel, currentChannel, userPosts }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [privateChannel] = useState(isPrivateChannel);
  const [channel] = useState(currentChannel);

  const addActiveIndex = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  }

  if(privateChannel) return null

  const formatPost = (count) => {
    return count === 1 ? `${count} post` : `${count} posts`
  }

  const displayTopPosters = posts => (
    Object.entries(posts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{formatPost(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 3)
  )

  return (
    
    <Segment loading={!channel}>
      <Header as="h3" attached="top">
        About #{channel && channel.name}
      </Header>
      <Accordion styled attached="true">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={addActiveIndex}
        >
          <Icon name="dropdown"/>
          <Icon name="info"/>
            Channel Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {channel && channel.details}
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={addActiveIndex}
        >
          <Icon name="dropdown"/>
          <Icon name="user circle"/>
            Top Posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <List>
            {userPosts && displayTopPosters(userPosts)}
          </List>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={addActiveIndex}
        >
          <Icon name="dropdown"/>
          <Icon name="pencil alternate"/>
            Created By
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
        <Header as="h3">
          <Image circular src={channel && channel.createdBy.avatar}/>
          {channel && channel.createdBy.name}
        </Header>
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}

export default MetaPanel;