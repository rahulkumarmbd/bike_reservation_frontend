import { useEffect, useState } from "react";
import { User } from "./User";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Paginate } from "./Pagination";

export const Users = () => {
  const [usersArr, setUserArr] = useState([]);
  const [cookies, setCookies] = useCookies(["token"]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

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
        console.log(err);
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
        console.log(data);
        fetchUsers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
