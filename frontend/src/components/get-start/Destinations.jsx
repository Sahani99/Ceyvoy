/* eslint-disable react/prop-types */
import { errorToast } from "@/lib/toastify";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { Checkbox } from "../ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrRemoveLocation,
  resetDistanceAndDurations,
  setDistanceAndDurations,
  setTrip,
} from "@/state/trip-slice";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { MdDragIndicator } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Map } from "lucide-react";
import { Label } from "../ui/label";

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_API_KEY;
let map;

const Destinations = ({ setCurrentStep }) => {
  const [viewport] = useState({
    latitude: 7.8731,
    longitude: 80.7718,
    zoom: 7,
    width: "100%",
    height: "70vh",
  });

  const mapContainerRef = useRef(null);
  const geocoderContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [markerList, setMarkerList] = useState([]);
  const [pagination, setPagination] = useState({
    start: 0,
    end: 9,
  });
  const { locations, distanceAndDurations, questionnaire } = useSelector(
    (state) => state.trip,
  );
  // dispatch
  const dispatch = useDispatch();

  // load data
  const loadData = useCallback(async () => {
    const formData = new FormData();
    formData.append("environment", questionnaire.environment);
    formData.append("step", 1);
    await axios
      .post("/get_start", formData)
      .then(({ data }) => {
        setData(data?.locations);
        // set pagination end if data is less than 6
        if (data?.locations.length < 9) {
          setPagination({ start: 0, end: data?.locations.length });
        }
      })
      .catch(() => {
        errorToast("Failed to load data");
      });
  }, [questionnaire.environment]);

  // move card
  const moveCard = (from, to) => {
    const copy = [...locations];
    const [removed] = copy.splice(from, 1);
    copy.splice(to, 0, removed);
    dispatch(setTrip(copy));
  };

  // get distance and duration
  const getDistanceAndDuration = useCallback(async () => {
    if (locations.length < 2) return dispatch(resetDistanceAndDurations());

    const coordinates = locations
      .map((location) => [location.longitude, location.latitude])
      .join(";");

    await fetch(
      `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinates}?annotations=distance,duration&access_token=${mapboxgl.accessToken}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.durations && data.distances) {
          const distanceAndDurations = [];
          let totalDuration = 0;
          for (let index = 0; index < data.durations.length - 1; index++) {
            distanceAndDurations.push({
              distance: data.distances[index][index + 1] / 1000,
              duration: data.durations[index][index + 1],
              from: locations[index]?.id,
              to: locations[index + 1]?.id,
            });
            totalDuration += data.durations[index][index + 1];
          }
          setTotalDuration(totalDuration);
          dispatch(setDistanceAndDurations(distanceAndDurations));
        }
      })

      .catch((error) => {
        console.error("Error fetching distance and duration:", error);
      });
  }, [locations, dispatch]);

  // update the map with the new locations data
  const updatePointers = useCallback(() => {
    try {
      // remove existing markers
      if (markerList) markerList.forEach((marker) => marker.remove());

      if (locations) {
        locations.forEach((card) => {
          const location = card;
          if (location.latitude && location.longitude) {
            const marker = new mapboxgl.Marker()
              .setLngLat([location.longitude, location.latitude])
              .addTo(mapRef.current)
              .setPopup(
                new mapboxgl.Popup({ closeButton: true }).setHTML(
                  `<div class="p-1">
                      <span><strong>City:</strong> ${
                        data.find((item) => item.id === location.id)?.city
                      }</span><br>
                      <span><strong>Description:</strong> ${
                        data.find((item) => item.id === location.id)
                          ?.description
                      }</span><br>
                    </div>`,
                ),
              );
            // update the marker list
            setMarkerList((prev) => [...prev, marker]);
          } else {
            console.error(`Invalid location data: ${location.title}`, location);
          }
        });
      }
    } catch (error) {
      console.error("Error initializing geocoder or adding markers:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    getDistanceAndDuration();
  }, [locations, getDistanceAndDuration]);

  // set map
  useEffect(() => {
    // initialize map
    if (!mapContainerRef.current) return;
    map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
    });

    // set mapRef
    mapRef.current = map;

    return () => {
      map?.remove();
    };
  }, [mapContainerRef, viewport]);

  // update pointers
  useEffect(() => {
    updatePointers();
  }, [locations, updatePointers]);

  const validateForm = () => {
    if (locations.length < 2) {
      errorToast("Select at least 2 places to continue");
      return false;
    }
 
    // check total duration less than days *  2hours
    if (totalDuration / 3600 > questionnaire.days * 7) {
      errorToast(
        `Total duration is more than ${questionnaire.days * 7} hours. Please select less places or increase the number of days`,
      );
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(questionnaire)) return;
    setCurrentStep(3);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative flex w-full flex-col justify-center gap-5 lg:flex-row">
        {/* left side */}
        <div className="flex w-full flex-col items-center lg:w-1/2 xl:w-3/5">
          <div className="grid h-fit grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.slice(pagination.start, pagination.end).map((item) => (
              <LocationsCards item={item} key={item.id} />
            ))}
          </div>

          {/* if no data found */}
          {data?.length === 0 && (
            <p className="text-sm italic">No locations found</p>
          )}

          {/* pagination */}
          {/* show pagination only if data is more than 9 */}
          {data?.length > 9 && (
            <div className="mt-4 flex w-full justify-between gap-2 border-b border-b-sky-700/30 pb-4">
              <Button
                size="sm"
                disabled={pagination.start === 0}
                className="w-28 bg-sky-700 shadow-sm drop-shadow-lg"
                onClick={() =>
                  setPagination({
                    start: pagination.start - 9,
                    end: (pagination.end % 9) * 9,
                  })
                }
              >
                <ArrowLeft className="me-1 size-4" />
                Previous
              </Button>
              <Button
                size="sm"
                disabled={pagination.end >= data.length}
                className="w-28 bg-sky-700 shadow-sm drop-shadow-lg"
                onClick={() =>
                  setPagination({
                    start: pagination.start + 9,
                    end:
                      data.length > pagination.end + 9
                        ? pagination.end + 9
                        : data.length,
                  })
                }
              >
                Next <ArrowRight className="ms-1 size-4" />
              </Button>
            </div>
          )}
        </div>

        {/* map popup */}
        <div
          className={`fixed start-0 top-0 z-[99999] ${isOpen ? "translate-y-0" : "-translate-y-full"} flex h-full w-full items-center justify-center bg-black/30 p-5 backdrop-blur-sm duration-100`}
        >
          {/* close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute end-5 top-5 rounded-full bg-black p-2 text-white shadow-sm"
          >
            <FaTimes className="size-5" />
          </button>

          <div
            className="h-[90vh] w-full max-w-3xl rounded-md"
            id="map-container"
            ref={mapContainerRef}
            style={{ width: "100%", height: "90vh" }}
          >
            <div
              ref={geocoderContainerRef}
              id="geocoder"
              className="geocoder-container"
            />
          </div>
        </div>

        {/* right side */}
        <div className="flex w-full flex-col gap-y-5 lg:w-1/2 xl:w-2/5">
          {/* selected places list */}
          <div className="">
            {/* view on map button */}
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => setIsOpen(true)}
                className="flex gap-x-1 bg-sky-700 shadow-sm drop-shadow-lg"
              >
                <Map className="size-5" />
                View on Map
              </Button>
            </div>
            <h3 className="mb-2 font-medium">Selected Places:</h3>

            <ul className="flex flex-col gap-y-2">
              {locations?.map((card, index) => (
                <DraggableListItem
                  key={index}
                  index={index}
                  card={data?.find((location) => location.id === card.id) || {}}
                  moveCard={moveCard}
                  handleCardSelection={() =>
                    dispatch(addOrRemoveLocation({ id: card.id, days: 1 }))
                  }
                />
              ))}
            </ul>

            {/*  no places selected */}
            {locations?.length === 0 && (
              <p className="text-sm italic">No places selected</p>
            )}
          </div>

          {/* distances and durations */}
          <div className="selected-list">
            <h3 className="mb-2 font-medium">Distances and Durations:</h3>
            <ul className="flex flex-col gap-y-2">
              {distanceAndDurations?.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col items-center justify-between rounded-md border bg-white p-4 shadow-sm drop-shadow-xl"
                >
                  <p className="w-full text-start text-sm">
                    <span className="font-medium">From : </span>
                    {data.find((location) => location.id === item.from)?.title}
                  </p>
                  <p className="w-full text-start text-sm">
                    <span className="font-medium">To : </span>
                    {data.find((location) => location.id === item.to)?.title}
                  </p>
                  <p className="mt-2 w-full border-t border-sky-700/50 pt-2 text-start text-sm">
                    <span className="font-medium">Distance : </span>
                    {item.distance.toFixed(2)} km
                  </p>
                  <p className="w-full text-start text-sm">
                    <span className="font-medium">Duration : </span>
                    {new Date(item?.duration * 1000)
                      .toISOString()
                      .substring(11, 16)}{" "}
                    hours
                  </p>
                </li>
              ))}
            </ul>

            {/*  no places selected */}
            {locations.length < 2 && (
              <p className="text-sm italic">
                Select at least 2 places to view distances and durations
              </p>
            )}
          </div>
        </div>
      </div>

      {/* buttons */}
      <div className="mt-8 flex justify-between gap-4">
        <Button
          onClick={() => setCurrentStep(1)}
          className="mt-4 w-28 rounded-md bg-gray-500 px-4 py-2 text-white"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="mt-4 w-28 rounded-md bg-sky-700 px-4 py-2 text-white"
        >
          Next
        </Button>
      </div>
    </DndProvider>
  );
};

const LocationsCards = ({ item }) => {
  const dispatch = useDispatch();
  const { locations } = useSelector((state) => state.trip);
  return (
    <div
      key={item?.id}
      className="relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-md drop-shadow-xl"
    >
      <img
        src={
          import.meta.env.VITE_APP_API_URL +
          item?.image +
          `?${new Date().getSeconds()}`
        }
        alt="gallery"
        className="h-48 w-full rounded-lg object-cover"
      />

      {/* details */}
      <div className="p-4 pb-16">
        <h2 className="line-clamp-2 font-medium">{item?.title}</h2>
        <p className="mb-1 flex w-fit rounded bg-fuchsia-700 px-2 py-0.5 text-xs text-white">
          {item?.category}
        </p>
        <p className="flex items-end gap-x-1 text-xs capitalize text-gray-600">
          <IoLocationSharp className="-ms-1 size-5 text-red-600" />
          <span className="line-clamp-1">
            {item?.city}, {item?.province.replace(/-/g, " ")} Province
          </span>
        </p>
        <p className="mt-2 text-xs text-gray-700">{item?.description}</p>
      </div>

      {/* selection and days */}
      <div className="absolute bottom-0 start-0 mt-5 flex w-full items-center justify-between gap-2 p-4">
        {/* check */}
        <div className="flex w-full items-center justify-end gap-2">
          <Label htmlFor={item?.id}>
            <Checkbox
              id={item?.id}
              checked={locations.some((location) => location.id === item?.id)}
              onCheckedChange={() => {
                dispatch(
                  addOrRemoveLocation({
                    id: item?.id,
                    latitude: item?.latitude,
                    longitude: item?.longitude,
                  }),
                );
              }}
              className="peer sr-only"
            />

            <div className="flex w-32 cursor-pointer justify-center rounded-full bg-sky-600 py-2.5 text-white peer-aria-checked:bg-red-500">
              {locations.some((location) => location.id === item?.id)
                ? "Selected"
                : "Select"}
            </div>
          </Label>
        </div>
      </div>
    </div>
  );
};

const DraggableListItem = ({ card, index, moveCard, handleCardSelection }) => {
  const [, ref] = useDrop({
    accept: "CARD",
    hover(item) {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <li
      ref={(node) => drag(ref(node))}
      className={`flex items-center justify-between gap-2 rounded-md border bg-white p-3 shadow-sm drop-shadow-xl ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <MdDragIndicator className="size-5" />
      <span className="line-clamp-1">{card.title}</span>
      <FaTimes onClick={handleCardSelection} className="remove-icon" />
    </li>
  );
};

export default Destinations;
