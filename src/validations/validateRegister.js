export default function validateRegister(values) {
  let errors = {};
  let user = values.username.trim();
  let letters = /^[A-Za-z0-9]+$/
  let emails = /\S+@\S+\.\S+/
  let REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
  
  //Username validation errors
  if(user.length < 3) {
    errors.username = 'Please enter more than 3 characters';
  } else if(user.length > 14) {
    errors.username = 'Username cannot exceed 14 characters'
  } else if(user === '') {
    errors.username = 'Username required'
  } else if(!letters.test(user)) {
    errors.username = 'Please enter alpha-numeric characters only'
  }
  //Email validation errors
  if(values.email.length === 0) {
    errors.email = 'Email address is required';
  } else if(!emails.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  //Password validation errors
  if((values.password.length || values.passConfirm.length) === 0) {
    errors.password = 'Password field cannot be blank'
  } else if((values.password.length || values.passConfirm.length) > 14) {
    errors.password = 'Password length cannot exceed 14 characters'
  } else if ((values.password.length || values.passConfirm.length) < 8) {
    errors.password = 'Password must be more than 8 characters'
  } else if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(values.password)) {
    errors.password = 'Password must have an uppercase letter, number, and special character';
  }

  if(values.password !== values.passConfirm) {
    errors.password = 'Passwords do not match'
  }
  return errors;
}