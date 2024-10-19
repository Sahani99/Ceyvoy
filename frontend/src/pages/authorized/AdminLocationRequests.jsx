import SideBarForRole from "@/components/side-bars/SideBarForRole";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { errorToast, successToast } from "@/lib/toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdLocationPin } from "react-icons/md";

const LocationRequests = () => {
  const [locations, setLocations] = useState([]);

  const loadData = async () => {
    await axios
      .get("/location?status=PENDING")
      .then(({ data }) => {
        setLocations(data?.locations);
      })
      .catch(() => {
        errorToast("Failed to load data");
      });
  };

  const approveLocation = async (id, status) => {
    const formData = new FormData();
    formData.append("status", status);
    formData.append("id", id);
    formData.append("type", "APPROVE");
    await axios
      .post("/location", formData)
      .then(() => {
        loadData();
        successToast(`Location ${status.toLowerCase()} successfully`);
      })
      .catch(() => {
        errorToast("Failed to approve location");
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="w-full">
      {/* sidebar */}
      <SideBarForRole />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <div className="mt-8 grid max-w-7xl grid-cols-1 gap-4 xl:grid-cols-2">
          {locations.map((location, index) => (
            <div
              key={index}
              className="flex w-full flex-col gap-x-3 rounded-lg border border-gray-300 bg-white p-1 shadow-md sm:flex-row"
            >
              {/* image */}
              <div className="flex items-center justify-center sm:w-1/2">
                <img
                  src={
                    import.meta.env.VITE_APP_API_URL +
                    location?.image +
                    `?${new Date().getSeconds()}`
                  }
                  alt="gallery"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>

              <div className="flex flex-col items-center justify-between p-4 sm:w-1/2">
                <h1 className="line-clamp-2 text-lg font-medium">
                  {location.title}
                </h1>
                {/* location */}
                <p className="line-clamp-2 flex w-full text-start text-sm text-gray-700">
                  <MdLocationPin className="-ms-1 size-5 text-red-600" />
                  {location.city}, {location.province} Province
                </p>
                {/* lat and long */}
                <div className="mb-2 flex w-full items-center justify-between">
                  <p className="text-sm text-gray-700">
                    <span className="text-red-600">Latitude : </span>
                    {location.latitude}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="text-red-600">Longitude : </span>
                    {location.longitude}
                  </p>
                </div>
                <p className="line-clamp-4 text-sm text-gray-700">
                  {location.description}
                </p>
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
                          This action cannot be undone. This will approve the
                          location. Do you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            approveLocation(location.id, "APPROVED")
                          }
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
                          This action cannot be undone. This will reject the
                          location. Are you sure you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            approveLocation(location.id, "REJECTED")
                          }
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* if no location requests */}
        {locations.length === 0 && (
          <div className="mt-10 flex w-full items-center justify-center">
            <h1 className="text-lg font-medium">No location requests</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationRequests;
