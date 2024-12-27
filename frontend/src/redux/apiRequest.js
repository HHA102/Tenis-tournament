import axios from "axios";
import { loginFailed, loginStart, loginSuccess} from "./authSlice";

export const loginUser = async(user,dispatch,navigate)=>{
    dispatch(loginStart());
    try {
        console.log(`${process.env.REACT_APP_API_URL}/v1/auth/login`)
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/login`,user);
        dispatch(loginSuccess(res.data));
        navigate("/");
    }catch(err){
        dispatch(loginFailed());
    }
};