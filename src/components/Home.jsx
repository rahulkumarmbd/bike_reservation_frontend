import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { Bike } from "./Bike";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { Input, Flex, Button } from "@chakra-ui/react";
import "./components.css";

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
        console.log(data);
        setBikes(data.bikes);
        setTotalPages(data.pages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchBikes();
  }, [pathname, page]);

  return (
    <div>
      <div>
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
            Search
          </Button>
        </Flex>
      </div>
      <div className="bikes-container">
        {!bikes.length ? (
          <div>There is no bikes available</div>
        ) : (
          bikes.map((bike) => {
            return <Bike key={bike.id} bike={bike} fetchBikes={fetchBikes} />;
          })
        )}
      </div>
      <div style={{ margin: "20px" }}>
        <Paginate pageCount={totalPages} getFunction={setPage} />
      </div>
    </div>
  );
};

const Paginate = ({ pageCount, getFunction }) => {
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    getFunction(currentPage);
  };
  return (
    <div className="paginate">
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
};
