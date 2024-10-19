import { errorToast } from "@/lib/toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
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

const AdminAccountManage = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    await axios
      .get("/accounts")
      .then(({ data }) => {
        setUsers(data?.users);
      })
      .catch(() => {
        errorToast("Failed to fetch users");
      });
  };

  const handleUserActivation = async (id, status) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    await axios
      .post("/accounts", formData)
      .then(() => {
        getUsers();
      })
      .catch(() => {
        errorToast(`Failed to ${status.toLowerCase()} user`);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="mt-5 flex w-full flex-col items-center gap-2">
      {users &&
        users?.map((user, index) => (
          <div
            key={index}
            className="flex w-full flex-col justify-center rounded-md border border-gray-700/20 bg-white p-4 shadow-sm drop-shadow-lg sm:flex-row sm:items-center xl:max-w-5xl"
          >
            <p className="flex w-full justify-between gap-x-2 text-sm text-gray-600 sm:flex-col">
              {user?.name}
              <span className="text-xs italic">{user.role}</span>
            </p>
            {user.is_active === 1 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="mt-2 w-32 rounded-md bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                  >
                    Deactivate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will deactivate the user account. Are you sure you
                      want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleUserActivation(user.id, "DEACTIVATE")
                      }
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {user.is_active === 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="mt-2 w-32 rounded-md bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
                  >
                    Activate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will activate the user account. Are you sure you want
                      to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleUserActivation(user.id, "ACTIVATE")}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ))}

      {/* no users available */}
      {users?.length === 0 && (
        <div className="flex w-full flex-col items-center justify-center rounded-md border border-gray-700/20 bg-white p-4 shadow-sm drop-shadow-lg xl:max-w-5xl">
          <p className="text-sm text-gray-600">No users available</p>
        </div>
      )}
    </div>
  );
};

export default AdminAccountManage;
