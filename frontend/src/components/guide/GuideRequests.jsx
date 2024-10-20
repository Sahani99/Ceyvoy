import { errorToast } from "@/lib/toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

const GuideRequests = () => {
  const [trips, setTrips] = useState([]);

  const getTrips = async () => {
    await axios
      .get("/travels")
      .then(({ data }) => {
        setTrips(data?.travels);
      })
      .catch(() => {
        errorToast("Failed to fetch trips");
      });
  };

  const approveOrRejectTrip = async (id, status) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    axios
      .post("/travels", formData)
      .then(() => {
        getTrips();
      })
      .catch(() => {
        errorToast("Something went wrong");
      });
  };

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <div className="mt-5 flex w-full flex-col items-center gap-5">
      {trips &&
        trips?.map((trip, index) => (
          <div
            key={index}
            className="flex w-full flex-col justify-center rounded-md border border-gray-700/20 bg-white p-4 shadow-sm drop-shadow-lg xl:max-w-5xl"
          >
            <p className="text-sm text-gray-600">
              Arrivals on : {new Date(trip?.arrival).toDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Departures on : {new Date(trip?.departure).toDateString()}
            </p>
            <p className="text-sm text-gray-600">Budget : {trip?.budget} LKR</p>
            <p className="text-sm text-gray-600">
              Status :{" "}
              <span
                className={` ${trip?.guide_status === "PENDING" && "text-yellow-500"} ${trip?.guide_status === "APPROVED" && "text-green-500"} ${trip?.guide_status === "REJECTED" && "text-red-500"} `}
              >
                {trip?.guide_status}
              </span>
            </p>

            <p className="mt-2 border-t border-dashed border-gray-500 pt-2 text-sm text-gray-600">
              Traveler : {trip?.traveler_name}
            </p>
            <p className="mt-2 border-t border-dashed border-gray-500 pt-2 text-sm font-medium text-gray-600">
              Accommodations
            </p>
            {trip?.accommodations.map((accommodation, index) => (
              <div
                key={index}
                className="my-1 border-b border-t border-sky-700/50 py-1 text-sm text-gray-600"
              >
                <p>
                  Name : {accommodation?.name} - {accommodation?.category}
                </p>
                <p>Price : {accommodation?.price} LKR / Day</p>
                <p>Address : {accommodation?.address}</p>
              </div>
            ))}
            <p className="mt-2 border-t border-dashed border-gray-500 pt-2 text-sm font-medium text-gray-600">
              Locations
            </p>
            {trip?.locations.map((location, index) => (
              <div
                key={index}
                className="my-1 border-b border-t border-sky-700/50 py-1 text-sm text-gray-600"
              >
                <p>Name : {location?.title}</p>
                <p>Category : {location?.category}</p>
                <p>City : {location?.city}</p>
                <p className="capitalize">
                  Province : {location?.province} Province
                </p>
              </div>
            ))}

            {trip.guide_status === "PENDING" && (
              <div className="mt-4 flex space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="w-28 bg-green-500 py-2 text-white"
                    >
                      Approve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will approve the trip
                        and make it available for the users.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => approveOrRejectTrip(trip.id, "APPROVED")}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="w-28 bg-red-500 py-2 text-white"
                    >
                      Reject
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will reject the trip.
                        Are you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => approveOrRejectTrip(trip.id, "REJECTED")}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        ))}

      {/* no trips available */}
      {trips?.length === 0 && (
        <div className="flex w-full flex-col items-center justify-center rounded-md border border-gray-700/20 bg-white p-4 shadow-sm drop-shadow-lg xl:max-w-5xl">
          <p className="text-sm text-gray-600">No trips available</p>
        </div>
      )}
    </div>
  );
};

export default GuideRequests;
