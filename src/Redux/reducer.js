import { ADD_USER, DELETE_USER } from "./actionTypes";

export const initialState = {
  user: null,
};

export const Reducer = (store = initialState, { type, payload }) => {
  switch (type) {
    case ADD_USER:
      return { ...store, user: payload };
    case DELETE_USER:
      return { ...store, user: null };
    default:
      return store;
  }
};
