import { provinces } from "@/data/provinces";
import { errorToast } from "@/lib/toastify";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminStatistics = () => {
  const [data, setData] = useState([]);

  const getStatistics = async () => {
    await axios
      .get("/statistics")
      .then(({ data }) => {
        setData(data);
      })
      .catch(() => {
        errorToast("Failed to fetch statistics");
      });
  };

  useEffect(() => {
    getStatistics();
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* total count and monthly gain of 3 role types */}
      <div className="z-[1] mt-8 flex w-full max-w-xl flex-col gap-4 md:max-w-5xl md:flex-row md:items-center md:justify-between">
        {["traveler", "guide", "accommodation"].map((role, index) => (
          <div
            key={index}
            className="flex w-full flex-col items-center justify-center rounded-md border border-gray-700/20 bg-white p-4 shadow-sm drop-shadow-lg md:w-1/3"
          >
            <h2 className="text-lg font-semibold">Total {role}s</h2>
            <p className="text-3xl font-bold">{data[`total_${role}s`]}</p>
            {/* gain */}
            <p className="mt-1 w-full border-t border-sky-500/50 pt-2 text-center">
              <span className="me-1 text-sm font-semibold">Monthly Gain:</span>
              <span className="text-sm font-semibold capitalize text-green-500">
                {data[`monthly_${role}s_gain`]} {role}s
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-xl flex-col gap-3 md:max-w-5xl md:flex-row">
        <div className="w-full rounded-md border border-gray-700/20 bg-white p-4">
          <div className="flex flex-col items-center">
            <h2 className="mt-8 text-lg font-semibold">Total Locations</h2>
            <p className="text-4xl font-bold">{data.total_locations}</p>
          </div>
          <div className="">
            {/* locations by province */}
            <div className="mt-8 flex w-full flex-col items-center gap-5">
              <h2 className="text-lg font-semibold">Locations by Province</h2>
              {data.locations_by_province &&
                data.locations_by_province.map(
                  ({ province, total_locations }, index) => (
                    <div
                      key={index}
                      className="flex w-full items-center justify-between"
                    >
                      <p className="justify-between text-sm text-gray-600">
                        {
                          provinces.find(
                            (provinceData) => provinceData.value === province,
                          ).label
                        }
                      </p>

                      <div className="mx-3 flex-grow border border-dashed border-gray-600"></div>

                      <p className="flex">
                        {total_locations} location{total_locations > 1 && "s"}
                      </p>
                    </div>
                  ),
                )}
            </div>
          </div>
        </div>
        <div className="w-full rounded-md border border-gray-700/20 bg-white p-4">
          <div className="flex flex-col items-center">
            <h2 className="mt-8 text-lg font-semibold">Total Events</h2>
            <p className="text-4xl font-bold">{data.total_events}</p>
          </div>
          <div className="">
            {/* locations by province */}
            <div className="mt-8 flex w-full flex-col items-center gap-5">
              <h2 className="text-lg font-semibold">Events by Province</h2>
              {data.events_by_province &&
                data.events_by_province.map(
                  ({ province, total_events }, index) => (
                    <div
                      key={index}
                      className="flex w-full items-center justify-between"
                    >
                      <p className="justify-between text-sm text-gray-600">
                        {
                          provinces.find(
                            (provinceData) => provinceData.value === province,
                          ).label
                        }
                      </p>

                      <div className="mx-3 flex-grow border border-dashed border-gray-600"></div>

                      <p className="flex">
                        {total_events} location{total_events > 1 && "s"}
                      </p>
                    </div>
                  ),
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
