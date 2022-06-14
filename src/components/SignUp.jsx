import {
  Input,
  FormHelperText,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Button,
  InputGroup,
  InputLeftAddon,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
export const initState = {
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  roles: "regular",
};

export const SignUp = ({ adduser }) => {
  const [userCredentials, setUserCredentials] = useState(initState);
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  if (adduser && user.roles === "regular") {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        UnAuthorized Route
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleSubmit = () => {
    const { fullName, email, password, phoneNumber } = userCredentials;

    if (fullName.length < 3)
      return alert("Full name must be at least 3 characters");
    if (!email.length) return alert("Email is required");
    if (password.length < 6)
      return alert("Password must be at least 6 characters");
    if (phoneNumber.length !== 10)
      return alert("Phone number must be at least 10 digits");

    axios
      .post("http://localhost:8080/users/register", userCredentials)
      .then(({ data }) => {
        if (adduser) {
          alert("User Added");
          return navigate("/home/users");
        }
        alert("Registration Successfully");
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div>
      {!adduser ? (
        <div>
          <h1
            style={{ fontSize: "30px", textAlign: "center", marginTop: "20px" }}
          >
            Bike Reservation System
          </h1>
          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            Reserve your premium bikes
          </p>
        </div>
      ) : (
        ""
      )}

      <div
        style={{
          width: "650px",
          margin: "auto",
          padding: "16px",
          border: "1px solid black",
          borderRadius: "8px",
          marginTop: "25px",
        }}
      >
        <FormControl isInvalid={true}>
          <FormLabel htmlFor="fullName">Full Name</FormLabel>
          <Input
            id="fullName"
            type="fullName"
            name="fullName"
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {userCredentials.fullName.length > 3 ? (
            <FormHelperText style={{ marginBottom: "8px" }}>
              Enter the full name you'd like to receive the newsletter on.
            </FormHelperText>
          ) : (
            <FormErrorMessage style={{ marginBottom: "8px" }}>
              Full Name is required. Your Name should be at least 4 characters
            </FormErrorMessage>
          )}
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Enter your email address"
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
          <InputGroup>
            <InputLeftAddon children="+91" />
            <Input
              type="number"
              name="phoneNumber"
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </InputGroup>
          {userCredentials.phoneNumber.length === 10 ? (
            <FormHelperText style={{ marginBottom: "8px" }}>
              Enter the phoneNumber you'd like to receive the newsletter on.
            </FormHelperText>
          ) : (
            <FormErrorMessage style={{ marginBottom: "8px" }}>
              Phone Number is required. It should be at least 10 characters
            </FormErrorMessage>
          )}
          {adduser ? (
            <RadioGroup
              value={userCredentials.roles}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <span>Role : </span>
              <Stack direction="row" onChange={handleChange}>
                <Radio value="regular" name="roles">
                  regular
                </Radio>
                <Radio value="manager" name="roles">
                  manager
                </Radio>
              </Stack>
            </RadioGroup>
          ) : (
            ""
          )}
          <Button
            style={{ width: "100%" }}
            onClick={handleSubmit}
            colorScheme="teal"
            size="md"
          >
            {adduser ? "Add User" : "SignUp"}
          </Button>
        </FormControl>
        {!adduser ? (
          <div style={{ textAlign: "center", margin: "8px 0px" }}>
            Already have an account ?{" "}
            <span style={{ color: "blue", textDecoration: "underline" }}>
              <Link to="/">Login</Link>
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
