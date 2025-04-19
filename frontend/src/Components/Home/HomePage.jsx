import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import "./home.css";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  //optional chaining
  //ternary operator
  const userList = useSelector((state) => state.users.users?.allUsers);
  const msg = useSelector((state) => state.users?.msg);
  const navigate = useNavigate();
  //DUMMY DATA

  const handleDelete = () => {
    deleteUser(user?.accessToken);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.accessToken) {
      getAllUsers();
    }
  }, [user, navigate]);

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
                onClick={handleDelete}
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
