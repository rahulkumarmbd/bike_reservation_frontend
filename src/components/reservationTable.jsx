import React, { useEffect, useState } from "react";
import { MDBDataTable } from "mdbreact";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./components.css";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const DatatablePage = () => {
  const [bikes, setBikes] = useState([]);
  const [cookies, setCookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const { pathname } = useLocation();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/reservedbike/${
          pathname === `/home/allreservations/bike/${id}`
            ? `bike/${id}`
            : pathname === `/home/allreservations/user/${id}`
            ? `user/${id}`
            : "user"
        }`,
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
        setBikes(
          data.map((bike, index) => {
            return {
              id: index + 1,
              fullName: bike.userId.fullName,
              model: bike.bikeId.model,
              location: bike.bikeId.location,
              startTime: bike.startTime.slice(0, 16),
              endTime: bike.endTime.slice(0, 16),
              status: bike.status,
              Review: "Add Review",
              cancel: "Cancel",
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pathname]);

  const data = {
    columns: [
      {
        label: "S_No.",
        field: "id",
        sort: "asc",
        width: 100,
      },
      {
        label: "User Name",
        field: "fullName",
        sort: "asc",
        width: 270,
      },
      {
        label: "Bike Model",
        field: "model",
        sort: "asc",
        width: 200,
      },
      {
        label: "Location",
        field: "location",
        sort: "asc",
        width: 200,
      },
      {
        label: "Initial Date",
        field: "startTime",
        sort: "asc",
        width: 150,
      },
      {
        label: "Final Date",
        field: "endTime",
        sort: "asc",
        width: 150,
      },
      {
        label: "Status",
        field: "status",
        sort: "asc",
        width: 100,
      },
      {
        label: "Review",
        field: "Review",
        sort: "asc",
        width: 100,
      },
      {
        label: "Cancel",
        field: "cancel",
        sort: "asc",
        width: 100,
      },
    ],
    rows: bikes,
  };

  return (
    <div style={{ width: "95%", margin: "20px auto" }}>
      <MDBDataTable striped bordered small hover data={data} />
      <div style={{display: "flex",justifyContent:"flex-end"}}>
      <Button colorScheme="red" onClick={() => navigate("/home")}>Back to Home</Button>
      </div>
    </div>
  );
};

export default DatatablePage;
