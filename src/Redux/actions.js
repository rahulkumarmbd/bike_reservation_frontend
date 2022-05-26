import { ADD_USER, DELETE_USER } from "./actionTypes";

const helper = (type, payload) => ({ type, payload });

export const Add_User = (payload) => helper(ADD_USER, payload);
export const Delete_User = () => helper(DELETE_USER);
