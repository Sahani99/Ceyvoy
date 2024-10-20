/* eslint-disable react/prop-types */
import { errorToast, successToast } from "@/lib/toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { TiStarFullOutline } from "react-icons/ti";

const TravelerTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [guideId, setGuideId] = useState(null);

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

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <div className="mt-5 flex w-full flex-col items-center gap-5">
      {/* submit feedback pop up */}
      <SubmitFeedback
        isOpen={isFeedbackOpen}
        setIsOpen={setIsFeedbackOpen}
        guideId={guideId}
      />

      {trips &&
        trips.map((trip, index) => (
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

            <div className="relative">
              <p className="mt-2 border-t border-dashed border-gray-500 pt-2 text-sm text-gray-600">
                Guide : {trip?.guide_name}
              </p>
              <p className="text-sm text-gray-600">
                Guide Status :{" "}
                <span
                  className={` ${trip?.guide_status === "PENDING" && "text-yellow-500"} ${trip?.guide_status === "APPROVED" && "text-green-500"} ${trip?.guide_status === "REJECTED" && "text-red-500"} `}
                >
                  {trip?.guide_status}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Guide Contact : {trip?.guide_contact}
              </p>

              {/* submit feedback button this button available only
              accepted and departure date is passed */}
              {trip?.guide_status === "APPROVED" &&
                new Date(trip?.departure) < new Date() && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="h-8 bg-sky-600 px-2 text-white hover:bg-sky-700"
                      onClick={() => {
                        setIsFeedbackOpen(true);
                        setGuideId(trip?.guide);
                      }}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                )}
            </div>
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

const SubmitFeedback = ({ isOpen, setIsOpen, guideId }) => {
  const [feedback, setFeedback] = useState("");
  const [ratings, setRatings] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // if feedback is empty
    if (!feedback || feedback.length < 1) {
      return errorToast("Feedback is required");
    }
    const data = new FormData();
    data.append("feedback", feedback);
    data.append("rating", ratings);
    data.append("guide_id", guideId);
    data.append("type", "GUIDE");
    setLoading(true);
    await axios
      .post("/feedbacks", data)
      .then(() => {
        successToast("Feedback submitted successfully");
        setIsOpen(false);
        setFeedback("");
      })
      .catch((err) => {
        if (err?.response?.data?.message) errorToast(err.response.data.message);
        else errorToast("Failed to submit feedback");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Please describe your feedback in detail so that we can help you
            better.
          </DialogDescription>
        </DialogHeader>
        {/* ratings stars */}
        <div className="pt-4">
          <Label htmlFor="rating" className="text-start">
            Rating
          </Label>
          <div className="flex items-center gap-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                className={`${ratings >= star ? "!text-amber-500" : "text-gray-300 hover:text-amber-400"} !border-none !bg-transparent px-0 !outline-none !ring-0`}
                onClick={() => setRatings(star)}
              >
                <TiStarFullOutline className="h-5 w-5" />
              </Button>
            ))}

            <span className="text-sm font-medium">
              {ratings ? `${ratings} of 5 stars` : "No rating"}
            </span>
          </div>
        </div>

        {/* feedback */}
        <div className="">
          <Label
            htmlFor="feedback"
            className="flex items-center justify-between"
          >
            Feedback
            {/* letter count */}
            <span className="text-sm text-gray-500">
              {feedback?.length || 0}/1000
            </span>
          </Label>
          <Textarea
            id="feedback"
            className="border-gray-400/80"
            value={feedback}
            maxLength={1000}
            onChange={(e) => setFeedback(e.target.value)}
            rows={8}
            placeholder="Write your feedback here"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="bg-sky-600 text-white hover:bg-sky-700"
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TravelerTrips;
