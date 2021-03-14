import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../firebase';
import UploadModal from './UploadModal';
import ProgressBar from './ProgressBar';
import { Segment, Button, Input } from 'semantic-ui-react';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const MessageForm = ({ messageData, currentChannel, currentUser, getMessagesData, isPrivateChannel }) => {
  const [message, setMessage] = useState('');
  const [user] = useState(currentUser);
  const [channel] = useState(currentChannel);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([])
  const [modal, setModal] = useState(false);
  const [uploadState, setUploadState] = useState('')
  const [uploadTask, setUploadTask] = useState(null);
  const [storageData] = useState(firebase.storage().ref());
  const [uploadProgress, setUploadProgress] = useState(0);
  const [typingData] = useState(firebase.database().ref('typing'));
  const [emojiPicker, setEmojiPicker] = useState(false);
  const messageInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if(uploadTask !== null) {
        uploadTask.cancel();
        setUploadTask(null);
      }
    }
  })

  const handleChange = e => {
    setMessage(e.target.value)
  }

  const handleKeyDown = (event) => {
    if(event.ctrlKey && event.keyCode === 13) {
      sendMessage();
    }
    if(message) {
      typingData
        .child(channel.id)
        .child(user.uid)
        .set(user.displayName)
    } else {
      typingData
        .child(channel.id)
        .child(user.uid)
        .remove()
    }
  }

  const togglePicker = () => {
    setEmojiPicker(!emojiPicker)
  }

  const addEmoji = emoji => {
    const oldMessage = message;
    const newMessage = colonToUnicode(` ${oldMessage} ${emoji.colons} `)
    setMessage(newMessage);
    setEmojiPicker(false);
    setTimeout(() => messageInputRef.current.focus(), 0)
  }

  const colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  }

  const createMessage = (fileURL = null) => {
    const msgObj = {
      content: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    }

    if(fileURL !== null) {
      msgObj['image'] = fileURL;
    } else {
      msgObj['content'] = message;
    }
    return msgObj;
  }

  const sendMessage = () => {
    if(message) {
      setIsLoading(true)
      getMessagesData()
        .child(channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setIsLoading(false);
          setMessage('')
          setError([])
          typingData
            .child(channel.id)
            .child(user.uid)
            .remove()
        })
        .catch(err => {
          console.log(err)
          setIsLoading(false)
          setError([...err, err])
        })
    } else {
      setError([{ message: 'Add a message' }])
    }
  }
  const handleError = (errorName) => error.some(err => err.message.includes(errorName)) ? 'error' : ''

  const getPath = () => {
    if(isPrivateChannel) {
      return `chat/private-${channel.id}`
    } else {
      return `chat/public`
    }
  }

  const uploadFile = (file, data) => {
    const channelPath = channel.id;
    const msgData = messageData;
    const dataz = getMessagesData()
    const filePath = `${getPath()}/${uuidv4()}.jpg`;
    setUploadState('uploading');
    
    try {
      setUploadTask(storageData.child(filePath).put(file, data));
      const task = storageData.child(filePath).put(file, data)
      //console.log(task)
      task.on('state_change', data => {
        const progress = Math.round((data.bytesTransferred / data.totalBytes) * 100)
        setUploadProgress(progress)
      },
      (err) => {
        setError([...error, err]);
        setUploadState('error');
        setUploadTask(null);
        console.log(err);
      }, () => {
        task.snapshot.ref.getDownloadURL().then(url => {
          sendFileMessage(url, dataz, channelPath)
        })
      })
    } catch (err) {
      setError([...error, err]);
      setUploadState('error');
      setUploadTask(null);
      console.log(err);
    }
  }

  const sendFileMessage = (url, msgData, channelPath) => {
    msgData.child(channelPath)
      .push()
      .set(createMessage(url))
      .then(() => {
        setUploadState('done');
      })
      .catch(err => {
        setError([...error, err]);
        console.log(err)
      })
  }

  return (
    <Segment className="message_form">
      {emojiPicker && (
        <Picker 
          set="apple"
          className="emojiPicker"
          title="Picker your emoji"
          emoji="point_up"
          onSelect={addEmoji}
        />
      )}
      <Input
        fluid
        ref={messageInputRef}
        name="message"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={message}
        style={{ marginBottom: '0.7em' }}
        label={
          <Button 
            icon={emojiPicker ? 'close' : 'add'}
            content={emojiPicker ? 'Close' : null}
            onClick={togglePicker} 
          />
        }
        labelPosition="left"
        placeholder="Write your message"
        className={handleError('message')}
      />
      <Button.Group icon widths="2">
        <Button 
          onClick={sendMessage}
          disabled={isLoading}
          color="blue"
          content="Reply"
          labelPosition="left"
          icon="reply"
        />
        <Button
          color="teal"
          onClick={() => setModal(true)}
          content="Upload"
          disabled={uploadState === 'uploading'}
          labelPosition="right"
          icon="upload"
        />
      </Button.Group>
      <UploadModal
        modal={modal}
        closeModal={() => setModal(false)}
        uploadFile={uploadFile}
      />
      <ProgressBar 
        uploadState={uploadState}
        uploadProgress={uploadProgress}
      />
    </Segment>
  )
}

export default MessageForm;