import { Routes, Route } from "react-router-dom";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { Home } from "./Home";
import { useSelector } from "react-redux";
import { Error } from "./Error";
import { AddBike } from "./AddBike";
import { Navbar } from "./Navbar";
import { Users } from "./Users";
import DatatablePage from "./reservationTable";
import { AddReview } from "./AddReviews";
import { BikeDetails } from "./BikeDetails";

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
            <Route path="allreservations" element={<DatatablePage />}></Route>
            <Route path="users" element={<Users />}></Route>
            <Route
              path="reservation/:reservationId/addreview"
              element={<AddReview />}
            ></Route>
            <Route path="adduser" element={<SignUp adduser={true} />}></Route>
            <Route path="bike/:bikeId" element={<BikeDetails />}></Route>
          </Route>
          <Route path="*" element={<Error />}></Route>
        </Routes>
      )}
    </div>
  );
};
