import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./components.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { Paginate } from "./Pagination";
import { Table } from "./Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DatatablePage = () => {
  const [bikes, setBikes] = useState([]);
  const [cookies, setCookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const { pathname } = useLocation();
  const { id } = useParams();

  const fetchReservations = () => {
    axios
      .get(
        `http://localhost:8080/reservedbike/${
          pathname === `/home/allreservations/bike/${id}`
            ? `bike/${id}`
            : pathname === `/home/allreservations/user/${id}`
            ? `user/${id}`
            : "user"
        }?limit=10&page=${page}`,
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
        setTotalPages(data.pages);
        setBikes(
          data.allReservations.map((bike, index) => {
            return {
              id: index + 1 + (page - 1) * 10,
              fullName: bike.user.fullName,
              model: bike.bike.model,
              location: bike.bike.location,
              bookingDate: bike.bookingDate.slice(0, 10),
              returnDate: bike.returnDate.slice(0, 10),
              status: bike.status,
              Review: "Add Review",
              cancel: "Cancel",
              reservationId: bike.id,
              bikeId: bike.bike.id,
              userId: bike.user.id,
              commentId: bike.comment?.id,
            };
          })
        );
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, [pathname, page]);

  const data = {
    columns: [
      {
        label: "S_No.",
        field: "id",
        width: 100,
      },
      {
        label: "User Name",
        field: "fullName",
        width: 270,
      },
      {
        label: "Bike Model",
        field: "model",
        width: 200,
      },
      {
        label: "Location",
        field: "location",
        width: 200,
      },
      {
        label: "Booking Date",
        field: "bookingDate",
        width: 150,
      },
      {
        label: "Return Date",
        field: "returnDate",
        width: 150,
      },
      {
        label: "Status",
        field: "status",
        width: 100,
      },
      {
        label: "Review",
        field: "Review",
        width: 100,
      },
      {
        label: "Cancel",
        field: "cancel",
        width: 100,
      },
    ],
    rows: bikes,
  };

  // console.log(data.rows);

  return (
    <div style={{ width: "95%", margin: "20px auto" }}>
      <Table data={data} fetchReservations={fetchReservations} />
      <div style={{ margin: "20px" }}>
        <Paginate pageCount={totalPages} getFunction={setPage} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button colorScheme="red" onClick={() => navigate("/home")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default DatatablePage;
