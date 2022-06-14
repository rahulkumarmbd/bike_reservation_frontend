import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Reviews } from "./AddReviews";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const BikeDetails = () => {
  const [bike, setBike] = useState({});
  const [reviews, setReviews] = useState([]);
  const [cookies, setCookies] = useCookies(["token"]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const user = useSelector((store) => store.user);
  const { bikeId } = useParams();

  const fetchData = async (url) => {
    try {
      return await axios.get(
        `http://localhost:8080/${url}?limit=4&page=${page}`,
        {
          headers: {
            token: cookies.token,
          },
        }
      );
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    (async () => {
      const bikeUrl =
        user.roles === "manager"
          ? `bikes/${bikeId}/manager`
          : `bikes/${bikeId}`;
      const fetchedBike = await fetchData(bikeUrl);
      setBike(fetchedBike.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const fetchedReviews = await fetchData(`comments/${bikeId}`);
      if (!fetchedReviews) {
        return toast.error("Not able to fetch reviews");
      }
      setReviews((prev) => {
        const ids = prev.map((review) => review.id);
        return [
          ...prev,
          ...fetchedReviews.data.comments.filter(
            (review) => !ids.includes(review.id)
          ),
        ];
      });
      setTotalPages(fetchedReviews.data.pages);
    })();
  }, [page]);

  return (
    <div>
      <div className="bikeDetails">
        <div>Model : {bike.model}</div>
        <div>Average Rating : {bike.avgRating}</div>
        <div>Color : {bike.color}</div>
        <div>Location : {bike.location}</div>
      </div>
      <div>Reviews</div>
      <Reviews
        reviews={reviews}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
};
