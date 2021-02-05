export default function validateRegister(values) {
  let errors = {};
  let email_address = values.email.trim();
  let emails = /\S+@\S+\.\S+/
  let REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
  
  //Email validation errors
  if(email_address.length === 0) {
    errors.email = 'Email address is required';
  } else if(!emails.test(email_address)) {
    errors.email = 'Email address is invalid';
  }
  //Password validation errors
  if((values.password.length) === 0) {
    errors.password = 'Password field cannot be blank'
  } else if((values.password.length) > 14) {
    errors.password = 'Password length cannot exceed 14 characters'
  } else if ((values.password.length) < 8) {
    errors.password = 'Password must be more than 8 characters'
  } else if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(values.password)) {
    errors.password = 'Password must have an uppercase letter, number, and special character';
  }
  return errors;
}