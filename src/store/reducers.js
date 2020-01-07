import CONSTS from "../constants";

const initialState = {
  access_token: ''
};

function rootReducer(state = initialState, action) {
  if (action.type === CONSTS.SET_TOKEN) {
    return {
      ...state,
      access_token: action.payload
    }
  }
  return state;
}

export default rootReducer;
