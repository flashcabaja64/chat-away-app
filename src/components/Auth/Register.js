import React, { useState } from 'react';
import firebase from '../../firebase';
import md5 from 'md5';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import useForm from '../../helpers/useForm';
import validateRegister from '../../validations/validateRegister';
import ValidationError from '../../validations/ValidationError';
import { Link } from 'react-router-dom';

const Register = () => {
  const [resStatus, setResStatus] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firebaseData] = useState({ users: firebase.database().ref('users') })

  const { handleChange, handleSubmit, values, errors } = useForm({
    username: '',
    email: '',
    password: '',
    passConfirm: ''
  }, 
    onSubmit,
    validateRegister
  )

  function onSubmit() {
    setLoading(true)
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(newUser => {  
        newUser.user.updateProfile({
          displayName: values.username,
          photoURL: `http://www.gravatar.com/avatar/${md5(newUser.user.email)}?d=identicon`
        })
        .then(() => {
          saveUser(newUser).then(() => console.log('user saved'));
          setLoading(false);
          setError(false);
          setResStatus('');
        })
        .catch(err => {
          setLoading(false);
          setError(true);
          setResStatus(err.message);
        })
        console.log(newUser);
      })
      .catch(err => {
        setLoading(false);
        setError(true);
        setResStatus(err.message);
      })
    console.log(values)
  }

  const saveUser = createdUser => {
    return firebaseData.users.child(createdUser.user.uid).set({
      username: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  }

  const handleError = (errorName) => resStatus.includes(errorName) ? 'error' : ''

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="blue" textAlign="center">
          <Icon name="wpforms" color="blue" />
            Register for Chat-Away
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input 
              fluid 
              name="username"
              icon="user"
              type="text"
              iconPosition="left"
              placeholder="Username"
              value={values.username}
              onChange={handleChange}
            >
            </Form.Input>
            {errors.username && <ValidationError message={errors.username}/>}
            <Form.Input 
              fluid 
              name="email"
              icon="mail"
              type="email"
              iconPosition="left"
              placeholder="Email Address"
              value={values.email}
              className={handleError('email')}
              onChange={handleChange}
            >
            </Form.Input>
            {errors.email && <ValidationError message={errors.email}/>}
            <Form.Input 
              fluid 
              name="password"
              icon="lock"
              type="password"
              iconPosition="left"
              placeholder="Password"
              value={values.password}
              className={handleError('password')}
              onChange={handleChange}
            >
            </Form.Input>
            {errors.password && <ValidationError message={errors.password}/>}
            <Form.Input 
              fluid 
              name="passConfirm"
              icon="repeat"
              type="password"
              iconPosition="left"
              placeholder="Password Confirmation"
              value={values.passConfirm}
              className={handleError('password')}
              onChange={handleChange}
            >
            </Form.Input>
            {errors.passConfirm && <ValidationError message={errors.passConfirm}/>}
            <Button 
              disabled={loading} 
              className={loading ? 'loading' : ''}
              color="blue" 
              fluid 
              size="large">Submit
            </Button>
            {error && <ValidationError message={resStatus} submitError={true}/>}
          </Segment>
        </Form>
        <Message>Already a user? <Link to="/login">Login</Link></Message>
      </Grid.Column>
    </Grid>
  )
}

export default Register;