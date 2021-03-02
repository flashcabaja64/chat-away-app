import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

const initialState = {
  currentUser: null,
  isLoading: true
}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      }
    case actionTypes.CLEAR_USER:
        return {
          ...state,
          isLoading: false 
        }
    default:
      return state;
  }
}

const initialChannelState = {
  currentChannel: null,
  isPrivateChannel: false,
  userPosts: null
}

const channelReducer = (state = initialChannelState, action) => {
  switch(action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      }
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel
      }
    case actionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts
      }
    default:
      return state;
  }
}

const initalColorState = {
  primaryColor: '#4c3c4c',
  secondaryColor: '#eee'
}

const colors_reducer = (state = initalColorState, action) => {
  switch(action.type) {
    case actionTypes.SET_COLORS:
      return {
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor
      }
    default:
      return state;
  }
}

const reducer = combineReducers({
  user: userReducer,
  channel: channelReducer,
  colors: colors_reducer
});

export default reducer;