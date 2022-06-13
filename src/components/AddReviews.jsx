import { Button, Input } from "@chakra-ui/react";
import { Rating } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { format } from "timeago.js";

const initState = {
  comment: "",
  userName: "",
  rating: 0,
  model: "",
  time: "",
  reservation: "",
};

export const AddReview = () => {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState({});
  const [cookies, setCookies] = useCookies(["token"]);
  const [bikeId, setBikeId] = useState();
  const [review, setReview] = useState(initState);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReservation();
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchReviews(bikeId);
    }
  }, [page]);

  const fetchReviews = (bikeId) => {
    axios
      .get(`http://localhost:8080/comments/${bikeId}?limit=4&page=${page}`, {
        headers: {
          token: cookies.token,
        },
      })
      .then(({ data }) => {
        setReviews((prev) => {
          const ids = prev.map((review) => review.id);
          return [
            ...prev,
            ...data.comments.filter((review) => !ids.includes(review.id)),
          ];
        });
        setTotalPages(data.pages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchReservation = () => {
    axios
      .get(`http://localhost:8080/reservedbike/${reservationId}`, {
        headers: {
          token: cookies.token,
        },
      })
      .then(({ data }) => {
        setReservation(data);
        setBikeId(data.bike.id);
        fetchReviews(data.bike.id);
        setReview((prev) => {
          return {
            ...prev,
            userName: data.user.fullName,
            model: data.bike.model,
            reservation: data.id,
          };
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addReview = () => {
    if (!review.comment) return;

    axios
      .post(
        `http://localhost:8080/comments/${bikeId}?limit=4&page=${page}`,
        { ...review, time: new Date().toISOString() },
        {
          headers: {
            token: cookies.token,
          },
        }
      )
      .then(({ data }) => {
        setReview(initState);
        setReviews((prev) => {
          const ids = prev.map((review) => review.id);
          return [
            ...data.comments.filter((review) => !ids.includes(review.id)),
            ...prev,
          ];
        });
        setTotalPages(data.pages);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  console.log(reviews);

  return (
    <div>
      <div className="review-reservation-container">
        <div>Booking Date: {reservation.bookingDate?.slice(0, 10)}</div>
        <div>Return Date: {reservation.returnDate?.slice(0, 10)}</div>
        <div>Status: {reservation.status}</div>
        <div>Model : {reservation.bike?.model}</div>
        <div>Color : {reservation.bike?.color}</div>
        <div>Location : {reservation.bike?.location}</div>
        <div>Average Rating : {reservation.bike?.avgRating}</div>
        <div>Name:{reservation.user?.fullName}</div>
        <div>Email: {reservation.user?.email}</div>
      </div>
      <div className="add-review-box">
        <Input
          placeholder="Add a comment...."
          size="md"
          name="comment"
          value={review.comment}
          onChange={(e) =>
            setReview((prev) => ({ ...prev, comment: e.target.value }))
          }
        />
        <Rating
          name="simple-controlled"
          value={+review.rating}
          onChange={(e) => {
            setReview((prev) => ({ ...prev, rating: e.target.value }));
          }}
        />
        <Button
          disabled={!review.comment}
          onClick={addReview}
          colorScheme="teal"
        >
          Add Review
        </Button>
      </div>
      <Reviews
        reviews={reviews}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
};

export const Reviews = ({ reviews, page, totalPages, setPage }) => {
  return (
    <>
      <div className="reviews-container">
        {reviews.map(({ userName, comment, time, rating }, index) => {
          return (
            <div key={index}>
              <div>
                <span>{userName}</span>
                <span>{format(time)}</span>
              </div>
              <div>{comment}</div>
              <Rating name="simple-controlled" value={+rating} readOnly />
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "95%",
          margin: "auto",
        }}
      >
        {page < totalPages ? (
          <Button
            colorScheme={"twitter"}
            onClick={() => setPage((prev) => prev + 1)}
          >
            load more...
          </Button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
