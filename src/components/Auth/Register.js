import React, { useState } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Register = () => {

  const [field, setField] = useState({
    username: '',
    email: '',
    password: '',
    passConfirm: ''
  })

  const handleChange = (e) => {
    setField({[e.target.name]: e.target.value})
    console.log(field)
  }
  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon color="orange" textAlign="center">
          <Icon name="wpforms" color="orange" />
            Register for Chat-Away
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input 
              fluid 
              name="username"
              icon="user"
              type="text"
              iconPosition="left"
              placeholder="Username"
              onChange={handleChange}
            >
            </Form.Input>
            <Form.Input 
              fluid 
              name="email"
              icon="mail"
              type="email"
              iconPosition="left"
              placeholder="Email Address"
              onChange={handleChange}
            >
            </Form.Input>
            <Form.Input 
              fluid 
              name="password"
              icon="lock"
              type="email"
              iconPosition="left"
              placeholder="Password"
              onChange={handleChange}
            >
            </Form.Input>
            <Form.Input 
              fluid 
              name="passConfirm"
              icon="repeat"
              type="password"
              iconPosition="left"
              placeholder="Password Confirmation"
              onChange={handleChange}
            >
            </Form.Input>
            <Button color="orange" fluid size="large">Submit</Button>
          </Segment>
        </Form>
        <Message>Already a user? <Link to="/login">Login</Link></Message>
      </Grid.Column>
    </Grid>
  )
}

export default Register;