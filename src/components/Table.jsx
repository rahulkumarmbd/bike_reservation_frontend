import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Table = ({ data, fetchReservations }) => {
  const [cookies, setCookies] = useCookies(["token"]);
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const cancelReservation = (reservationId) => {
    axios
      .patch(
        `http://localhost:8080/reservedbike/${reservationId}`,
        {},
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        fetchReservations();
        toast.success("Reservation is successfully canceled.");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {data.columns.map((column, index) => {
              return <th key={index}>{column.label}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.rows.map(
            (
              {
                id,
                fullName,
                model,
                location,
                bookingDate,
                returnDate,
                status,
                Review,
                cancel,
                reservationId,
                bikeId,
                userId,
                commentId,
              },
              index
            ) => {
              return (
                <tr key={index}>
                  <td>{id}</td>
                  <td>{fullName}</td>
                  <td>{model}</td>
                  <td>{location}</td>
                  <td>{bookingDate}</td>
                  <td>{returnDate}</td>
                  <td>{status}</td>
                  <td>
                    <Button
                      disabled={
                        status !== "active" || userId !== user.id || commentId
                          ? true
                          : false
                      }
                      colorScheme="blue"
                      onClick={() =>
                        navigate(`/home/reservation/${reservationId}/addreview`)
                      }
                    >
                      {Review}
                    </Button>
                  </td>
                  <td>
                    <Button
                      colorScheme="red"
                      disabled={
                        status !== "active" || userId !== user.id
                          ? true
                          : false
                      }
                      onClick={() => cancelReservation(reservationId)}
                    >
                      {cancel}
                    </Button>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};
