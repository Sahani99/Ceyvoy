import AdminAccountManage from "@/components/admin/AdminAccountManage";
import SideBarForRole from "@/components/side-bars/SideBarForRole";
import { ROLES } from "@/data/roles";
import { useSelector } from "react-redux";

const Accounts = () => {
  const { user } = useSelector((state) => state.user);
  const { role } = user;

  return (
    <div className="w-full">
      {/* sidebar */}
      <SideBarForRole />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        {ROLES.Admin === role && <AdminAccountManage />}
      </div>
    </div>
  );
};

export default Accounts;
