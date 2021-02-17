import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../firebase';
import UploadModal from './UploadModal';
import ProgressBar from './ProgressBar';
import { Segment, Button, Input } from 'semantic-ui-react';

const MessageForm = ({ messageData, currentChannel, currentUser }) => {
  const [message, setMessage] = useState('');
  const [user] = useState(currentUser);
  const [channel] = useState(currentChannel);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([])
  const [modal, setModal] = useState(false);
  const [uploadState, setUploadState] = useState('')
  //const [uploadTask, setUploadTask] = useState(null);
  const [storageData] = useState(firebase.storage().ref());
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = e => {
    setMessage(e.target.value)
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
      messageData
        .child(channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setIsLoading(false);
          setMessage('')
          setError([])
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

  const uploadFile = (file, data) => {
    const channelPath = channel.id;
    const msgData = messageData;
    const filePath = `chat/public/${uuidv4()}.jpg`;
    setUploadState('uploading');

    try {
      //setUploadTask(storageData.child(filePath).put(file, data));
      const task = storageData.child(filePath).put(file, data)
      //console.log(task)
      task.on('state_change', data => {
        const progress = Math.round((data.bytesTransferred / data.totalBytes) * 100)
        setUploadProgress(progress)
      },
      (err) => {
        setError([...error, err]);
        setUploadState('error');
        //setUploadTask(null);
        console.log(err);
      }, () => {
        task.snapshot.ref.getDownloadURL().then(url => {
          sendFileMessage(url, msgData, channelPath)
        })
      })
    } catch (err) {
      setError([...error, err]);
      setUploadState('error');
      //setUploadTask(null);
      console.log(err);
    }
  }

  const sendFileMessage = (url, msgData, channelPath) => {
    msgData.child(channelPath)
      .push()
      .set(createMessage(url))
      .then(() => setUploadState('done'))
      .catch(err => {
        setError([...error, err]);
        console.log(err)
      })
  }

  return (
    <Segment className="message_form">
      <Input
        fluid
        name="message"
        onChange={handleChange}
        value={message}
        style={{ marginBottom: '0.7em' }}
        label={<Button icon='add'/>}
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