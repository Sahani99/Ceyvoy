/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { PiCaretUpDownBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toastify";
import {
  addOrRemoveSummerAccommodations,
  addOrRemoveSummeryGuide,
  clearLocations,
  resetDistanceAndDurations,
  resetQuestionnaire,
  resetSummery,
} from "@/state/trip-slice";

const Summery = ({ setCurrentStep }) => {
  const { user } = useSelector((state) => state.user);
  const { questionnaire, locations, summery } = useSelector(
    (state) => state.trip,
  );
  const dispatch = useDispatch();
  const [guides, setGuides] = useState([]);
  const [accommodations, setAccommodations] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // load data
  const loadData = useCallback(async () => {
    const formData = new FormData();
    formData.append(
      "locations",
      locations.map((location) => location.id).join(","),
    );
    formData.append("step", 2);
    formData.append("language", questionnaire.language);
    formData.append("start_date", questionnaire.arrival);
    formData.append(
      "end_date",
      new Date(questionnaire.arrival).setDate(
        new Date(questionnaire.arrival).getDate() + questionnaire.days,
      ),
    );
    formData.append("people", questionnaire.people);
    await axios
      .post("/get_start", formData)
      .then(({ data }) => {
        setGuides(data?.guides);
        setAccommodations(data?.accommodations);
      })
      .catch(() => {
        errorToast("Failed to load data");
      });
  }, [locations, questionnaire.arrival, questionnaire.days, questionnaire.language, questionnaire.people]);

  const validateForm = () => {
    if (summery.accommodations.length === 0) {
      errorToast("Please select accommodations");
      return false;
    }

    if (summery.guide === null) {
      errorToast("Please select a guide");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append(
      "locations",
      locations.map((location) => location.id).join(","),
    );
    formData.append("step", 3);
    formData.append("language", questionnaire.language);
    formData.append("people", questionnaire.people);
    formData.append("budget", questionnaire.budget);
    formData.append("environment", questionnaire.environment.join(","));
    formData.append("guide", summery.guide);
    formData.append("accommodations", summery.accommodations.join(","));
    formData.append(
      "accommodation_prices",
      summery.accommodationPrices.join(","),
    );
    const arrival = new Date(questionnaire.arrival);
    // convert date to yyyy-mm-dd
    const start_date = `${arrival.getFullYear()}-${arrival.getMonth() + 1}-${arrival.getDate()}`;
    formData.append("start_date", start_date);
    const departure = new Date(
      new Date(arrival).setDate(arrival.getDate() + questionnaire.days),
    );
    console.log(departure);
    // convert date to yyyy-mm-dd
    const end_date = `${departure.getFullYear()}-${departure.getMonth() + 1}-${departure.getDate()}`;
    formData.append("end_date", end_date);
    await axios
      .post("/get_start/finish", formData)
      .then(() => {
        successToast("Trip saved successfully");
        // reset the state
        dispatch(clearLocations());
        dispatch(resetDistanceAndDurations());
        dispatch(resetQuestionnaire());
        dispatch(resetSummery());
        navigate("/dashboard");
      })
      .catch(() => {
        errorToast("Failed to load data");
      });
  };

  const accommodationsPrice = () => {
    let price = 0;
    summery.accommodationPrices.forEach((p) => {
      price += p;
    });
    return price;
  };

  const guidePrice = () => {
    const guide = summery.guidePrice * questionnaire.days;
    return guide;
  };

  const total = () => {
    return (
      questionnaire.people * 1000 * questionnaire.days +
      accommodationsPrice() +
      guidePrice()
    );
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {/* accommodations */}
      <h2 className="mb-2 w-full text-lg font-medium">Accommodations</h2>

      {accommodations &&
        Object.keys(accommodations).map((a, key) => {
          const acc = accommodations[a];
          return (
            <Fragment key={key}>
              <h3 className="mb-1 mt-4 w-full text-gray-800">{a}</h3>
              <div className="mb-2 w-full">
                {/* accommodation cards */}
                {acc && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {acc?.map((accommodation, index) => (
                      <div
                        key={index}
                        className="flex flex-col rounded-lg border border-gray-300 bg-white p-4 shadow-sm drop-shadow-2xl"
                      >
                        <img
                          src={
                            import.meta.env.VITE_APP_API_URL +
                            accommodation?.image +
                            `?${new Date().getSeconds()}`
                          }
                          alt="gallery"
                          className="mb-3 h-full max-h-48 w-full rounded-lg object-cover"
                        />

                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium">
                            {accommodation?.name}
                          </h4>
                          <Button
                            onClick={() => {
                              dispatch(
                                addOrRemoveSummerAccommodations({
                                  id: accommodation?.id,
                                  price: accommodation?.price,
                                }),
                              );
                            }}
                            size="sm"
                            className="h-7 bg-sky-700"
                          >
                            {summery.accommodations.includes(accommodation?.id)
                              ? "Remove"
                              : "Select"}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          Category :{accommodation?.category}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price :{accommodation?.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          Max. Guests :{accommodation?.max_guests}
                        </p>
                        <p className="text-sm text-gray-500">
                          Address :{accommodation?.address}
                        </p>
                        <p className="text-sm text-gray-500">
                          Facilities :{accommodation?.facilities}
                        </p>
                        <p className="text-end text-sm font-medium text-emerald-500 underline">
                          <Link to={accommodation?.website}>Visit website</Link>
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {acc?.length === 0 && (
                  <p className="text-xs text-gray-600">
                    No accommodation available for this location.
                  </p>
                )}
              </div>
            </Fragment>
          );
        })}

      {/* guides */}
      <h2 className="my-2 w-full text-lg font-medium">Guides</h2>
      <div className="mb-2 w-full">
        {/* guide cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {guides?.map((guide, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg border border-gray-300 bg-white p-4 shadow-sm drop-shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">{guide?.name}</h4>
                <Button
                  onClick={() => {
                    dispatch(
                      addOrRemoveSummeryGuide({
                        id: guide?.id,
                        price: guide?.cost,
                      }),
                    );
                  }}
                  size="sm"
                  className="h-7 bg-sky-700"
                >
                  {summery.guide === guide?.id ? "Remove" : "Select"}
                </Button>
              </div>
              <p className="text-sm text-gray-500">Email : {guide?.email}</p>
              <p className="text-sm text-gray-500">Phone : {guide?.contact}</p>
              <p className="text-sm text-gray-500">Price : {guide?.cost}</p>
              <p className="text-sm text-gray-500">
                Experience : {guide?.experience}
              </p>
              <p className="text-sm text-gray-500">Rating : {guide?.ratings}</p>
              <p className="text-sm text-gray-500">
                Description : {guide?.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* budget details */}
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="sticky bottom-2 mt-5 w-full max-w-xl rounded-md border border-gray-300 bg-white px-4 shadow-sm drop-shadow-xl"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute end-1 top-1 rounded-full"
          >
            <PiCaretUpDownBold className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <h2 className="my-2 font-medium">Budget Details (LKR - Approx.)</h2>
        <div className="mb-2 w-full">
          <CollapsibleContent>
            {/* for foods */}
            <div className="flex items-center justify-between text-sm">
              <h3 className="">Foods</h3>
              <p className="">
                {(questionnaire.people * 1000 * questionnaire.days).toFixed(2)}
              </p>
            </div>
            {/* accommodations */}
            <div className="flex items-center justify-between text-sm">
              <h3 className="">Accommodations</h3>
              <p className="">{accommodationsPrice().toFixed(2)}</p>
            </div>
            {/* guides */}
            <div className="flex items-center justify-between border-b-[1.5px] border-dashed border-gray-600 pb-2 text-sm">
              <h3 className="">Guides</h3>
              <p className="">{guidePrice().toFixed(2)}</p>
            </div>
          </CollapsibleContent>
          {/* total */}
          <div className="mt-2 flex items-center justify-between border-gray-400 text-sm font-medium">
            <h3 className="">Total</h3>
            <p className="">{total().toFixed(2)}</p>
          </div>
          {/* your budget */}
          <div className="flex items-center justify-between text-sm font-medium">
            <h3 className="">Your Budget</h3>
            <p className="">{questionnaire.budget.toFixed(2)}</p>
          </div>
          {/* remaining */}
          <div className="flex items-center justify-between text-sm font-medium">
            <h3 className="">Remaining</h3>
            <p
              className={
                total() > questionnaire.budget
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              {(questionnaire.budget - total()).toFixed(2)}
            </p>
          </div>

          <div className="flex gap-x-2">
            <Button
              onClick={() => setCurrentStep(2)}
              className="mt-4 w-full rounded-md bg-gray-700 px-4 py-2 text-white"
            >
              Back
            </Button>
            {user && (
              <Button
                onClick={handleSubmit}
                className="mt-4 w-full rounded-md bg-sky-700 px-4 py-2 text-white"
              >
                Save Trip
              </Button>
            )}
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

export default Summery;
