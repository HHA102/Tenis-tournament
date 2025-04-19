import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logOutFailed,
  logOutStart,
  logOutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";
import {
  deleteUserFailed,
  deleteUsersSuccess,
  deleteUserStart,
  getUsersFailed,
  getUsersStart,
  getUsersSuccess,
} from "./userSlice";
import { store } from "./store";
import axiosClient, { saveNewAccessToken } from "../utils/axiosClient";
//npm install axios

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/v1/auth/login`,
      user, {
      withCredentials: true
    }
    );
    saveNewAccessToken(res?.data?.accessToken)
    dispatch(loginSuccess(res.data));
    // navigate("/");
    return res.data;
  } catch (err) {
    dispatch(loginFailed());
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/register`, user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (err) {
    dispatch(registerFailed());
  }
};

export const getAllUsers = async () => {
  store.dispatch(getUsersStart());
  try {
    const res = await axiosClient.get('/v1/user');
    store.dispatch(getUsersSuccess(res.data));
  } catch (err) {
    store.dispatch(getUsersFailed());
  }
};

export const deleteUser = async (id) => {
  store.dispatch(deleteUserStart());
  try {
    const res = await axiosClient.delete(
      `/v1/user/` + id);
    store.dispatch(deleteUsersSuccess(res.data));
  } catch (err) {
    store.dispatch(deleteUserFailed(err.response.data));
  }
};

export const logOut = async (navigate) => {
  store.dispatch(logOutStart());
  try {
    const res = await axiosClient.post('/v1/auth/logout');
    if (res.data) {
      store.dispatch(logOutSuccess());
      navigate("/login");
    }
  } catch (err) {
    store.dispatch(logOutFailed());
  }
};
