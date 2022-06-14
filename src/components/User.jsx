import { useState } from "react";
import { Stack, Input, Button, Radio, RadioGroup } from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const User = ({ user, handleDelete, fetchUsers }) => {
  const [editUser, setEditUser] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="user-container">
      <div>
        <img
          src="https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59095529-stock-illustration-profile-icon-male-avatar.jpg"
          alt=""
        />
      </div>
      {!editUser ? (
        <div>
          <div>
            <span>Name : </span>
            <span>{user.fullName}</span>
          </div>
          <div>
            <span>Email : </span>
            {user.email}
          </div>
          <div>Password : *********</div>
          <div>Phone Number : {user.phoneNumber}</div>
          <div>Role: {user.roles}</div>
          <div className="button">
            <Button colorScheme={"messenger"} onClick={() => setEditUser(true)}>
              Edit
            </Button>
            <Button
              colorScheme={"messenger"}
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </Button>
          </div>
            <Button
              colorScheme={"messenger"}
              onClick={() => navigate(`/home/allreservations/user/${user.id}`)}
            >
              See all reservations
            </Button>
        </div>
      ) : (
        <EditUser
          user={user}
          fetchUsers={fetchUsers}
          setEditUser={setEditUser}
        />
      )}
    </div>
  );
};

const EditUser = ({ user, fetchUsers, setEditUser }) => {
  const [userCredentials, setUserCredentials] = useState(user);
  const [cookies, setCookies] = useCookies(["token"]);
  console.log(userCredentials);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleEdit = () => {
    const { fullName, email, phoneNumber } = userCredentials;

    if (fullName.length < 3)
      return alert("Full name must be at least 3 characters");
    if (!email.length) return alert("Email is required");
    if (String(phoneNumber).length !== 10)
      return alert("Phone number must be at least 10 digits");

    axios
      .patch(
        `http://localhost:8080/users/${userCredentials.id}`,
        userCredentials,
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        toast.success("successfully updated");
        fetchUsers();
        setEditUser(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div
      onBlur={(e) => {
        console.log(e.target);
        if (e.relatedTarget?.type === "radio") {
          return;
        }

        if (
          e.relatedTarget === null ||
          (e.relatedTarget.type === "button" &&
            e.relatedTarget.innerText !== "Edit User")
        ) {
          if (setEditUser) setEditUser(false);
        }
      }}
    >
      <Stack spacing={2} className={"inputFields"}>
        <Input
          placeholder="Enter user full name"
          size={"sm"}
          onChange={handleChange}
          name="fullName"
          value={userCredentials.fullName}
          autoFocus
        />
        <Input
          placeholder="Enter user email address"
          size={"sm"}
          onChange={handleChange}
          name="email"
          value={userCredentials.email}
        />
        <Input
          placeholder="Enter user password"
          size={"sm"}
          onChange={handleChange}
          name="password"
          value={userCredentials.password}
        />
        <Input
          placeholder="Enter user phone number"
          size={"sm"}
          onChange={handleChange}
          name="phoneNumber"
          value={userCredentials.phoneNumber}
        />
        <RadioGroup value={userCredentials.roles}>
          <Stack direction="row" onChange={handleChange}>
            <Radio value="regular" name="roles">
              regular
            </Radio>
            <Radio value="manager" name="roles">
              manager
            </Radio>
          </Stack>
        </RadioGroup>
        <Button size={"sm"} colorScheme={"teal"} onClick={handleEdit}>
          Edit User
        </Button>
      </Stack>
    </div>
  );
};
