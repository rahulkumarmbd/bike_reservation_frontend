import {
  Stack,
  Input,
  Checkbox,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
const initState = {
  model: "",
  color: "",
  location: "",
  available: false,
};

export const AddBike = ({ editBike, bike, setEditBike, fetchBikes }) => {
  const [bikeCredentials, setBikeCredentials] = useState(
    !editBike ? initState : bike
  );
  const [cookies, setCookies] = useCookies(["token"]);
  console.log(bikeCredentials);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, checked, value } = e.target;
    value = name === "available" ? checked : value;
    setBikeCredentials({ ...bikeCredentials, [name]: value });
  };

  const handleEdit = () => {
    if (!bikeCredentials.model.length) return alert("Model can't be empty");
    if (!bikeCredentials.color.length) return alert("Color can't be empty");
    if (!bikeCredentials.location.length)
      return alert("location can't be empty");

    axios
      .patch(
        `http://localhost:8080/bikes/${bikeCredentials.id}`,
        bikeCredentials,
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
        setBikeCredentials(initState);
        setEditBike(false);
        fetchBikes();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:8080/bikes", bikeCredentials,{
        headers: {
          token: cookies.token,
        },
      })
      .then(({ data }) => {
        setBikeCredentials(initState);
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className={!editBike ? "newBike" : ""}
      tabIndex={"1"}
      onBlur={(e) => {
        if (
          e.relatedTarget === null ||
          (e.relatedTarget.type === "button" &&
            e.relatedTarget.innerText !== "Edit Bike")
        ) {
          if (setEditBike) setEditBike(false);
        }
      }}
    >
      {!editBike ? (
        <Heading style={{ textAlign: "center", marginTop: "25px" }}>
          Add New Bike
        </Heading>
      ) : (
        ""
      )}
      <Stack
        spacing={!editBike ? 3 : 2}
        className={!editBike ? "inputFields" : ""}
      >
        <Input
          placeholder="Enter your bike Model"
          size={editBike ? "sm" : "md"}
          onChange={handleChange}
          name="model"
          value={bikeCredentials.model}
          autoFocus
        />
        <Input
          placeholder="Enter your bike Color"
          size={editBike ? "sm" : "md"}
          onChange={handleChange}
          name="color"
          value={bikeCredentials.color}
        />
        <Input
          placeholder="Enter your bike Location"
          size={editBike ? "sm" : "md"}
          onChange={handleChange}
          name="location"
          value={bikeCredentials.location}
        />
        <Checkbox
          defaultChecked={bikeCredentials.available}
          onChange={handleChange}
          name="available"
          size={editBike ? "sm" : "md"}
        >
          is Available ?
        </Checkbox>
        <Button
          size={editBike ? "sm" : "md"}
          colorScheme={"teal"}
          onClick={!editBike ? handleAdd : handleEdit}
        >
          {!editBike ? "Add" : "Edit"} Bike
        </Button>
      </Stack>
    </div>
  );
};
