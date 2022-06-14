import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Error = () => {
  const navigate = useNavigate();
  const [state, setState] = useState();
  
  
  useEffect(() => {
    setState(true);
  }, []);
  
  if (state) {
    return navigate(-1);
  }
  
  return <div>404 Not Found</div>;
};
