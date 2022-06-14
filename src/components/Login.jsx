import {
  Input,
  FormHelperText,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Add_User } from "../Redux/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const initState = {
  email: "",
  password: "",
};

export const Login = () => {
  const [userCredentials, setUserCredentials] = useState(initState);
  const [cookies, setCookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleSubmit = () => {
    const { email, password } = userCredentials;

    if (email === "" || password.length < 6) {
      return toast.error("Please Enter required fields");
    }

    axios
      .post("http://localhost:8080/users/login", userCredentials)
      .then(({ data }) => {
        toast.success(data.message);
        if (data.message === "login successful") {
          setCookies("token", data.token);
          dispatch(Add_User(data.user));
          navigate("/home");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div>
      <h1 style={{ fontSize: "30px", textAlign: "center", marginTop: "20px" }}>
        Bike Reservation System
      </h1>
      <p style={{ textAlign: "center", marginBottom: "20px" }}>
        Reserve your premium bikes
      </p>
      <div
        style={{
          width: "650px",
          margin: "auto",
          padding: "16px",
          border: "1px solid black",
          borderRadius: "8px",
        }}
      >
        <FormControl isInvalid={true}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            onChange={handleChange}
          />
          {userCredentials.email.length ? (
            <FormHelperText style={{ marginBottom: "8px" }}>
              Enter the email you'd like to receive the newsletter on.
            </FormHelperText>
          ) : (
            <FormErrorMessage style={{ marginBottom: "8px" }}>
              Email is required.
            </FormErrorMessage>
          )}
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {userCredentials.password.length > 5 ? (
            <FormHelperText style={{ marginBottom: "8px" }}>
              Enter the password you'd like to receive the newsletter on.
            </FormHelperText>
          ) : (
            <FormErrorMessage style={{ marginBottom: "8px" }}>
              Password is required. Your password should be at least 5
              characters
            </FormErrorMessage>
          )}
          <Button
            style={{ width: "100%" }}
            onClick={handleSubmit}
            colorScheme="teal"
            size="md"
          >
            Login
          </Button>
        </FormControl>
        <div style={{ textAlign: "center", margin: "8px 0px" }}>
          don't have an account ?{" "}
          <span style={{ color: "blue", textDecoration: "underline" }}>
            <Link to="/signup">SignUp</Link>
          </span>
        </div>
      </div>
    </div>
  );
};
