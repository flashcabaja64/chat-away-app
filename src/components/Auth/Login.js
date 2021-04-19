import React, { useState } from 'react';
import firebase from '../../firebase';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import useForm from '../../helpers/useForm';
import validateLogin from '../../validations/validateLogin';
import ValidationError from '../../validations/ValidationError';
import { Link } from 'react-router-dom';

const Login = () => {
  const [resStatus, setResStatus] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleChange, handleSubmit, values, errors } = useForm({
    email: '',
    password: ''
  }, 
    onSubmit,
    validateLogin
  )

  function onSubmit() {
    setLoading(true)
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        setLoading(false);
        setError(false);
        setResStatus('');
      })
      .catch(err => {
        setError(true);
        setResStatus(err.message);
        setLoading(false)
      })
  }

  const handleError = (errorName) => resStatus.includes(errorName) ? 'error' : ''

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="blue" textAlign="center">
          <Icon name="wpforms" color="blue" />
            Login to Chat-Away
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
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
        <Message>Need an account? <Link to="/register">Register</Link></Message>
      </Grid.Column>
    </Grid>
  )
}

export default Login;