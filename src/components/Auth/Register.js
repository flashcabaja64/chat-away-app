import React, { useState } from 'react';
import firebase from '../../firebase';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import useForm from '../../helpers/useForm';
import validateRegister from '../../validations/validateRegister';
import ValidationError from '../../validations/ValidationError';
import { Link } from 'react-router-dom';

const Register = () => {
  const [resStatus, setResStatus] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
      .then(user => {
        console.log(user);
      })
      .then(setLoading(false))
      .catch(err => {
        setLoading(false)
        setError(true);
        setResStatus(err.message)
      })
    console.log(values)
  }

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon color="blue" textAlign="center">
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