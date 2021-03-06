import authReducer from './auth_reducer';
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
});

export default rootReducer;
