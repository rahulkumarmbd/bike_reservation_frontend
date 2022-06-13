import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { Bike } from "./Bike";
import { useSelector } from "react-redux";
import { Input, Flex, Button } from "@chakra-ui/react";
import "./components.css";
import { Paginate } from "./Pagination";

const initState = {
  model: "",
  color: "",
  location: "",
  avgRating: "",
};

export const Home = () => {
  const [bikes, setBikes] = useState([]);
  const { pathname } = useLocation();
  const [cookies, setCookies] = useCookies(["token"]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookingDate, setBookingDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [{ model, color, location, avgRating }, setfilter] =
    useState(initState);
  const user = useSelector((store) => store.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setfilter({ ...{ model, color, location, avgRating }, [name]: value });
  };

  const fetchBikes = () => {
    axios
      .get(
        `http://localhost:8080/bikes${
          user.roles !== "manager" ? "/available" : ""
        }?limit=4&page=${page}`,
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        setBikes(data.bikes);
        setTotalPages(data.pages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    const condition = !model && !color && !location && !avgRating;
    if (condition && (!bookingDate || !returnDate)) {
      return fetchBikes();
    }

    if (condition && bookingDate && returnDate) {
      return;
    }

    if (bookingDate && returnDate) {
      return fetchNonReservedBikes();
    }

    axios
      .get(
        `http://localhost:8080/bikes/filter?model=${model}&color=${color}&location=${location}&avgRating=${avgRating}&page=${page}&limit=4`,
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        setBikes(data.bikes);
        setTotalPages(data.pages);
        setfilter(initState);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchNonReservedBikes = () => {
    axios
      .get(
        `http://localhost:8080/bikes/nonreserved?bookingDate=${bookingDate}&returnDate=${returnDate}&model=${model}&color=${color}&location=${location}&avgRating=${avgRating}&page=${page}&limit=4`,
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        setBikes(data.bikes);
        setTotalPages(data.pages);
      });
  };

  useEffect(() => {
    if (!bookingDate || !returnDate) {
      return;
    }
    fetchNonReservedBikes();
  }, [returnDate, bookingDate]);

  useEffect(() => {
    fetchBikes();
  }, [pathname, page]);

  return (
    <div>
      <div>
        <Flex spacing={3} gap={10} className="searchBikes">
          <span>Booking Date : </span>
          <input
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={bookingDate}
            onChange={({ target }) => {
              if (!returnDate || target.value <= returnDate)
                setBookingDate(target.value);
            }}
          />
          <span>Return Date : </span>
          <input
            min={bookingDate || new Date().toISOString().slice(0, 10)}
            type="date"
            value={returnDate}
            onChange={({ target }) => {
              if (!bookingDate) {
                setBookingDate(new Date().toISOString().slice(0, 10));
              }
              setReturnDate(target.value);
            }}
          />
        </Flex>
        <Flex spacing={3} gap={10} className="filter">
          <Input
            placeholder="Filter By model"
            size="md"
            name="model"
            onChange={handleChange}
            value={model}
          />
          <Input
            placeholder="Filter By color"
            size="md"
            name="color"
            onChange={handleChange}
            value={color}
          />
          <Input
            placeholder="Filter By location"
            size="md"
            name="location"
            onChange={handleChange}
            value={location}
          />
          <Input
            placeholder="Filter By avgRating"
            size="md"
            name="avgRating"
            onChange={handleChange}
            value={avgRating}
          />
          <Button onClick={handleSearch} width={"300px"} colorScheme="teal">
            Filter
          </Button>
        </Flex>
      </div>
      <div className="bikes-container">
        {!bikes.length ? (
          <div>There is no bikes available</div>
        ) : (
          bikes.map((bike) => {
            return (
              <Bike
                key={bike.id}
                bike={bike}
                fetchBikes={fetchBikes}
                returnDate={returnDate}
                bookingDate={bookingDate}
              />
            );
          })
        )}
      </div>
      <div style={{ margin: "20px" }}>
        <Paginate pageCount={totalPages} getFunction={setPage} />
      </div>
    </div>
  );
};
