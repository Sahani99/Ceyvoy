/* eslint-disable react/prop-types */
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserValue, resetUserValue } from "../state/user-slice";
import { PiSpinnerBold } from "react-icons/pi";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  // dispatcher
  const dispatch = useDispatch();
  // access resume state
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if user is already loaded
    if (user !== null) {
      setLoading(false);
      return;
    }
    // if user is not loaded yet
    let isMounted = true;

    if (!user) {
      axios
        .get("/authorize")
        .then(async ({ data }) => {
          if (data?.user) dispatch(setUserValue(data?.user));
        })
        .catch(() => {
          dispatch(resetUserValue());
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [user, dispatch]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <PiSpinnerBold className="mr-1 h-14 w-14 animate-spin font-bold text-sky-400" />
      </div>
    );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
