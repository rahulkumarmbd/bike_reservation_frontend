import { Routes, Route } from "react-router-dom";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { Home } from "./Home";
import { useSelector } from "react-redux";
import { Error } from "./Error";
import { AddBike } from "./AddBike";
import { Navbar } from "./Navbar";
import { Users } from "./Users";
import { ReserveCart } from "./ReserveCart";
// import CustomPaginationActionsTable from "./reservationTable";
// import BasicTable from "./reservationTable";
import DatatablePage from "./reservationTable";

export const RoutesComponent = () => {
  const user = useSelector((store) => store.user);

  return (
    <div>
      {!user ? (
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="*" element={<Error />}></Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/home" element={<Navbar />}>
            <Route path="" element={<Home />}></Route>
            <Route path="addBike" element={<AddBike />}></Route>
            <Route
              path="allreservations/user/:id"
              element={<DatatablePage />}
            ></Route>
            <Route
              path="allreservations/bike/:id"
              element={<DatatablePage />}
            ></Route>
            <Route
              path="allreservations"
              element={<DatatablePage />}
            ></Route>
            <Route path="users" element={<Users />}></Route>
            <Route path="adduser" element={<SignUp adduser={true} />}></Route>
            <Route path="reserve/:id" element={<ReserveCart />}></Route>
          </Route>
          <Route path="*" element={<Error />}></Route>
        </Routes>
      )}
    </div>
  );
};
