import { useEffect, useState } from "react";
import { User } from "./User";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Paginate } from "./Pagination";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Users = () => {
  const [usersArr, setUserArr] = useState([]);
  const [cookies, setCookies] = useCookies(["token"]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const user = useSelector((store) => store.user);

  const fetchUsers = () => {
    axios
      .get(`http://localhost:8080/users?limit=4&page=${page}`, {
        headers: {
          token: cookies.token,
        },
      })
      .then(({ data }) => {
        setUserArr(data.users);
        setTotalPages(data.pages);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/users/${id}`, {
        headers: {
          token: cookies.token,
        },
      })
      .then(({ data }) => {
        toast.success("successfully deleted");
        fetchUsers();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  if (user.roles === "regular") {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        UnAuthorized Route
      </div>
    );
  }

  return (
    <>
      <div className="users-container">
        {!usersArr.length
          ? "there is no registered user"
          : usersArr.map((user) => {
              return (
                <User
                  key={user.id}
                  user={user}
                  handleDelete={handleDelete}
                  fetchUsers={fetchUsers}
                />
              );
            })}
      </div>
      <div style={{ margin: "20px" }}>
        <Paginate pageCount={totalPages} getFunction={setPage} />
      </div>
    </>
  );
};
