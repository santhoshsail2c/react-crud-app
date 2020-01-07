import CONSTS from "../constants";

export function setToken(payload) {
  return {
    type: CONSTS.SET_TOKEN,
    payload: payload.token
  };
}
