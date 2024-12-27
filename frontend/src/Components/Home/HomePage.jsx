import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { getAllUsers } from "../../redux/apiRequest";
import {deleteUser} from "../../redux/apiRequest";
import { loginSuccess } from "../../redux/authSlice";
import axios from "axios";
import "./home.css";

const HomePage = () => {
  const user = useSelector((state)=>state.auth.login?.currentUser);
  //optional chaining
  //ternary operator
  const userList = useSelector((state)=>state.users.users?.allUsers);
  const msg = useSelector((state)=>state.users?.msg);
  let axiosJWT  = axios.create();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //DUMMY DATA

 

  const handleDelete = (id)=>{
    deleteUser(user?.accessToken,dispatch,id);
  };

  const refreshToken = async () =>{
    try{
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`,{
          withCredentials:true,
        });
        return res.data;
    }catch(err){
      console.log(err);
    }
  }

  axiosJWT.interceptors.request.use(
    async(config)=>{
        let date = new Date();
        const decodedToken = jwt_decode(user?.accessToken);
        if(decodedToken.exp < date.getTime() / 1000){
          const data = await refreshToken();
          const refreshUser = {
            ...user,
            accessToken: data.accessToken,
          };
          dispatch(loginSuccess(refreshUser));
          config.headers["token"] = "Bearer " + data.accessToken;
        }
        return config;
    },
    (err)=>{
      return Promise.reject(err);
    }
  );
  useEffect(()=> {
    if(!user){
      navigate("/login");
    }
    if(user?.accessToken){
      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    }
  },[]);

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">
        {`Your role: ${user?.admin ? `Admin` : `User`}`}
        </div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div 
                className="delete-user" 
                onClick ={()=>handleDelete(user._id)} 
                >
                  {" "}
                  Delete {" "}
                </div>
            </div>
          );
        })}
      </div>
      <div className="rerorSsg">{msg}</div>
    </main>
  );
};

export default HomePage;
