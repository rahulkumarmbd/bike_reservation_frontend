import { Button } from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Delete_User } from "../Redux/actions";
import "./components.css";

export const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [cookies, setCookies, removeCookie] = useCookies(["token"]);
  const { pathname } = useLocation();
  return (
    <div>
      <div className="Navbar">
        <div>Welcome to our Bike Reservation Platform</div>
        <div className="button">
          {pathname !== "/home/allreservations" ? (
            <Link to="/home/allreservations">
              <Button colorScheme="teal">See all reservations</Button>
            </Link>
          ) : (
            <Link to="/home">
              <Button colorScheme="teal">Home</Button>
            </Link>
          )}
          {user.roles === "manager" ? (
            pathname === "/home/users" ? (
              <Link to="/home">
                <Button colorScheme="teal">Home</Button>
              </Link>
            ) : (
              <Link to="/home/users">
                <Button colorScheme="teal">All Users</Button>
              </Link>
            )
          ) : (
            ""
          )}
          {user.roles === "manager" ? (
            pathname === "/home/addbike" ? (
              <Link to="/home">
                <Button colorScheme="teal">Home</Button>
              </Link>
            ) : (
              <Link to="/home/addbike">
                <Button colorScheme="teal">Add Bike</Button>
              </Link>
            )
          ) : (
            ""
          )}
          {user.roles === "manager" ? (
            pathname !== "/home/adduser" ? (
              <Link to="/home/adduser">
                <Button colorScheme="teal">Add User</Button>
              </Link>
            ) : (
              <Link to="/home">
                <Button colorScheme="teal">Home</Button>
              </Link>
            )
          ) : (
            ""
          )}
          <Link
            to="/"
            onClick={() => {
              dispatch(Delete_User());
              removeCookie();
            }}
          >
            <Button colorScheme="teal">LogOut</Button>
          </Link>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "yellow",
          color: "red",
          fontSize: "18px",
          padding: "8px",
        }}
      >
        <div>Hi {user.fullName}!</div>
        <div>Email : {user.email}</div>
        <div>You are a {user.roles} user</div>
      </div>
      <Outlet />
    </div>
  );
};
