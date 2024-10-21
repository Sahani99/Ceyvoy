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

const GuideApprovals = () => {
  const [guides, setGuides] = useState([]);

  const loadData = async () => {
    await axios
      .get("/guide")
      .then(({ data }) => {
        setGuides(data?.guides);
      })
      .catch(() => {
        errorToast("Failed to load data");
      });
  };

  const approveGuide = async (id, status) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("type", "VERIFY");
    await axios
      .post("/guide", formData)
      .then(() => {
        loadData();
        successToast(`Guide ${status.toLowerCase()} successfully`);
      })
      .catch(() => {
        errorToast("Failed to approve guide");
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
          {guides?.map((location, index) => (
            <div
              key={index}
              className="flex w-full flex-col gap-x-3 rounded-lg border border-gray-300 bg-white p-4 shadow-md"
            >
              <h1 className="line-clamp-2 text-lg font-medium">
                {location.name}
              </h1>

              {/* license */}
              <p className="text-sm text-gray-700">
                <span className="font-medium">License: </span>
                {location.license}
              </p>

              {/* contact */}
              <p className="text-sm text-gray-700">
                <span className="font-medium">Contact: </span>
                {location.contact}
              </p>

              {/* experience */}
              <p className="text-sm text-gray-700">
                <span className="font-medium">Experience: </span>
                {location.experience}
              </p>

              {/* cost */}
              <p className="text-sm text-gray-700">
                <span className="font-medium">Charge per day:</span>
                {location.cost}
              </p>

              <p className="mt-2 line-clamp-4 text-sm text-gray-700">
                {location.description}
              </p>

              <div className="mt-4 flex justify-end space-x-2">
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
                        guide and make them available for the users.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => approveGuide(location?.user, "APPROVED")}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>

        {/* if no location requests */}
        {guides?.length === 0 && (
          <div className="mt-10 flex w-full items-center justify-center">
            <h1 className="text-lg font-medium">No Guide Approval requests</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideApprovals;
