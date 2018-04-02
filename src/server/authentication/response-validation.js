export const text = {
  signUpForm: {
    errors: {
      email: 'Please provide a correct email address.',
      password: 'Password must have at least 8 characters.',
      message: 'Check the form for errors.'
    }
  },
  signUpResponse: {
    success: 'You have successfully signed up! Now you should be able to log in.',
    error400: 'Could not process the form.',
    errors: {
      message: 'Check the form for errors.',
      email: 'This email is already taken.'
    }
  },
  loginForm: {
    errors: {
      email: 'Please provide your email address.',
      password: 'Please provide your password (has at least 8 characters).',
      message: 'Check the form for errors.'
    }
  },
  loginResponse: {
    success: 'You have successfully logged in!',
    error400: 'Could not process the form.'
  }
};

export function validateSignUpResponse(err) {
  const res = {
    status: 200,
    body: {
      success: true,
      message: text.signUpResponse.success
    }
  };
  if (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status = 409;
      res.body = {
        success: false,
        message: text.signUpResponse.errors.message,
        errors: {
          email: text.signUpResponse.errors.email
        }
      };
    } else {
      res.status = 400;
      res.body = {
        success: false,
        message: text.signUpResponse.error400
      };
    }
  }
  return res;
}

export function validateLoginResponse(err, token, userData) {
  const res = {
    status: 200,
    body: {
      success: true,
      message: text.loginResponse.success,
      token,
      user: userData
    }
  };
  if (err) {
    if (err.name === 'IncorrectCredentialsError') {
      res.status = 400;
      res.body = {
        success: false,
        message: err.message
      };
    } else {
      res.status = 400;
      res.body = {
        success: false,
        message: text.loginResponse.error400
      };
    }
  }
  return res;
}

