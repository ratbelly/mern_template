import C from './constants';
import axios from 'axios';
import cookie from 'react-cookie';

const API_URL = 'http://localhost:8000/api';

export function errorHandler(dispatch, errResp, type) {
  
  let errorMessage = '';

  if (errResp.data.error) {
    errorMessage = errResp.data.error;
  } else if (errResp.data) {
    errorMessage = errResp.data;
  } else {
    errorMessage = errResp;
  }

  if (errResp.status === 401) {
    dispatch({
      type: type,
      payload: 'You are not authorized to do this. Please login and try again.',
    });
    logoutUser();
  } else {
    dispatch({
      type: type,
      payload: errorMessage,
    });
  }
}

export function loginUser({email, password}) {
  // user is logged in and their token saved to cookie
  return function(dispatch) {
    axios.post(`${API_URL}/auth/login`, {email, password})
    .then((response) => {
      cookie.save('token', response.data.token, {path: '/'});
      dispatch({type: C.AUTH_USER});
      window.location.href = C.CLIENT_ROOT_URL + '/dashboard';
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, C.AUTH_ERROR);
    });
    };
  }

export function registerUser({email, firstName, lastName, password}) {
  // user is registered and their token stored in cookie
  return function(dispatch) {
    axios.post(`${API_URL}/auth/register`, {email, firstName, lastName, password})
    .then((response) => {
      cookie.save('token', response.data.token, {path: '/'});
      dispatch({type: C.AUTH_USER});
      window.location.href = '/dashboard';
    })
    .catch((error) => {
      console.log("error with registration");
      errorHandler(dispatch, error.response, C.AUTH_ERROR);
    });
  };
}

export function logoutUser() {
  // clear the user's token from cookie
  return function(dispatch) {
    dispatch({type: C.UNAUTH_USER});
    cookie.remove('token', {path: '/'});

    window.location.href = C.CLIENT_ROOT_URL + '/login';
  };
}

export function protectedTest() {
  // validate the user's token and see if they are authorized
  return function(dispatch) {
    axios.get(`${API_URL}/protected`, {
      headers: {'Authorization': cookie.load('token')},
    })
    .then((response) => {
      dispatch({
        type: C.PROTECTED_TEST,
        payload: response.data.content,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, C.AUTH_ERROR);
    });
  };
}
