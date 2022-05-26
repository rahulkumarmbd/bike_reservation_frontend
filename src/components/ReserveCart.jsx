import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

export const ReserveCart = () => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState();
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["token"]);
  const [bike, setBike] = useState(null);
  const { id: bikeId } = useParams();

  useEffect(() => {
    setEndTime(startTime);
    axios
      .get(`http://localhost:8080/bikes/${bikeId}`, {
        headers: {
          token: cookies.token,
        },
      })
      .then(({ data }) => {
        setBike(data);
      })
      .catch((err) => {
        console.log(err);
        navigate(-1);
      });
  }, [startTime]);

  const handleReserve = () => {
    axios
      .post(
        `http://localhost:8080/reservedbike`,
        {
          startTime: `${startTime}`,
          endTime: `${endTime}`,
          bikeId,
        },
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        navigate("/home/allreservations");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div className="calendar">
          <div className="date">
            Initial Date : {JSON.stringify(startTime + 1)?.slice(1, 11)}
          </div>{" "}
          <Calendar
            onChange={(e) => {
              if (e > new Date()) {
                setStartTime(e);
              }
            }}
            value={startTime}
          />
        </div>

        <div className="calendar">
          <div className="date">
            Final Date : {JSON.stringify(endTime + 1)?.slice(1, 11)}
          </div>
          <Calendar
            onChange={(e) => {
              if (e >= startTime) {
                setEndTime(e);
              }
            }}
            value={endTime}
          />
        </div>
      </div>
      <div className="reserve-bike-details">
        <div>
          <div>Model : {bike?.model}</div>
          <div>Color : {bike?.color}</div>
        </div>
        <div>
          <div>Available : {bike?.available ? "Yes" : "No"}</div>
          <div>Location : {bike?.location}</div>
        </div>
        <div>
          <Button colorScheme="whatsapp" onClick={handleReserve}>
            Click Here To Procced
          </Button>
          <Button colorScheme="red" onClick={() => navigate("/home")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
