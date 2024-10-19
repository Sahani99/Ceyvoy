import { errorToast } from "@/lib/toastify";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminReceivedFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const getTrips = async () => {
    await axios
      .get("/feedbacks")
      .then(({ data }) => {
        setFeedbacks(data?.feedbacks);
      })
      .catch(() => {
        errorToast("Failed to fetch feedbacks");
      });
  };

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <div className="mt-5 flex w-full flex-col items-center gap-5">
      {feedbacks &&
        feedbacks?.map((trip, index) => (
          <div
            key={index}
            className="flex w-full flex-col justify-center rounded-md border border-gray-700/20 bg-white p-4 shadow-sm drop-shadow-lg xl:max-w-5xl"
          >
            <p className="flex w-full justify-between gap-x-2 text-sm text-gray-600">
              {trip?.name}
              <span className="text-xs italic">
                {new Date(trip?.created_at).toUTCString()}
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-600">{trip?.feedback}</p>
          </div>
        ))}

      {/* no feedbacks available */}
      {feedbacks?.length === 0 && (
        <div className="flex w-full flex-col items-center justify-center rounded-md border border-gray-700/20 bg-white p-4 shadow-sm drop-shadow-lg xl:max-w-5xl">
          <p className="text-sm text-gray-600">No feedbacks available</p>
        </div>
      )}
    </div>
  );
};

export default AdminReceivedFeedbacks;
