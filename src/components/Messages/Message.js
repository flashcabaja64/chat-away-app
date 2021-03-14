import React from 'react';
import { Comment, Image } from 'semantic-ui-react';
import moment from 'moment'

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? 'message_self' : ''
}

const timeStamp = time => {
  return moment(time).fromNow()
}

const isImage = (message) => {
  return message.hasOwnProperty('image') && !message.content.length
}

const Message = ({ message, user, avatar }) => {
  return (
    <Comment>
      <Comment.Avatar src={avatar ? avatar : message.user.avatar}/>
      <Comment.Content className={isOwnMessage(message,user)}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeStamp(message.timestamp)}</Comment.Metadata>
        {isImage(message) ? 
          <Image src={message.image} className="message_image" /> :
          <Comment.Text>{message.content}</Comment.Text>
        }
      </Comment.Content>
    </Comment>
  )
}

export default Message;