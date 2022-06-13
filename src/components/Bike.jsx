import { Rating, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { AddBike } from "./AddBike";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

export const Bike = ({ bike, fetchBikes, bookingDate, returnDate }) => {
  const [editBike, setEditBike] = useState(false);
  const [cookies, setCookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const { id, model, color, location, available, avgRating } = bike;
  const user = useSelector((store) => store.user);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/bikes/${id}`, {
        headers: {
          token: cookies.token,
        },
      })
      .then(({ data }) => {
        console.log(data);
        fetchBikes();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reserveThisBike = () => {
    if (!bookingDate || !returnDate) {
      return alert("Please select valid Booking & Return date...");
    }

    axios
      .post(
        `http://localhost:8080/reservedbike`,
        {
          bookingDate,
          returnDate,
          bikeId: bike.id,
        },
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
        navigate("/home/allreservations");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="bike" key={id}>
      <div>
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/82614c38823695.5770ea557a3a8.gif"
          alt=""
        />
      </div>
      {!editBike ? (
        <div>
          <div>Model: {model}</div>
          <div>Color: {color}</div>
          <div>Location: {location}</div>
          <div>
            <input
              type="checkbox"
              name="isAvailable"
              checked={available}
              readOnly
            />{" "}
            is Available ?
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>Rating : </span>
            <Rating
              name="simple-controlled"
              precision={0.1}
              value={avgRating}
              readOnly
            />
          </div>
          <div className="button">
            <Button variant="contained" onClick={() => navigate(`/home/bike/${id}`)}>View Details</Button>
            {user.roles === "manager" ? (
              <Button variant="contained" onClick={() => setEditBike(true)}>
                Edit
              </Button>
            ) : (
              ""
            )}
            {user.roles === "manager" ? (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(id)}
              >
                Delete
              </Button>
            ) : (
              <Link to={`/home/reserve/${id}`}>
                <Button variant="contained">Reserve Bike</Button>
              </Link>
            )}
            {user.roles === "regular" ? (
              ""
            ) : (
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/home/allreservations/bike/${bike.id}`)
                }
              >
                See all reservations
              </Button>
            )}
            {user.roles === "regular" ? (
              ""
            ) : (
              <Button variant="contained" onClick={reserveThisBike}>
                Reserve Bike
              </Button>
            )}
          </div>
        </div>
      ) : (
        <AddBike
          editBike={editBike}
          bike={bike}
          setEditBike={setEditBike}
          fetchBikes={fetchBikes}
        />
      )}
    </div>
  );
};
