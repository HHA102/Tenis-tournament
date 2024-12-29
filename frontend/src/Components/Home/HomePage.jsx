import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { getAllUsers } from "../../redux/apiRequest";
import {deleteUser} from "../../redux/apiRequest";
import { createAxios} from "../../createInstance";
import { loginSuccess } from "../../redux/authSlice";
import axios from "axios";
import "./home.css";

const HomePage = () => {
  const user = useSelector((state)=>state.auth.login?.currentUser);
  //optional chaining
  //ternary operator
  const userList = useSelector((state)=>state.users.users?.allUsers);
  const msg = useSelector((state)=>state.users?.msg);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch,loginSuccess)
  //DUMMY DATA

  const handleDelete = (id)=>{
    deleteUser(user?.accessToken,dispatch,id, axiosJWT);
  };
 
  useEffect(()=> {
    console.log('user', user);
    
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
