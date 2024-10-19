/* eslint-disable react/prop-types */
import { IoLocationSharp } from "react-icons/io5";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventTypes } from "@/data/events";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { provinces } from "@/data/provinces";
import axios from "axios";
import { errorToast } from "@/lib/toastify";

const Events = () => {
  const [date, setDate] = useState();
  const [location, setLocation] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [events, setEvents] = useState([]);

  const loadData = async () => {
    await axios
      .get("/event")
      .then(({ data }) => {
        setEvents(data?.events);
        setFilteredEvents(data?.events);
      })
      .catch(() => {
        errorToast("Failed to load data");
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) => {
      if (
        date &&
        (date < new Date(event.start).setHours(0, 0, 0, 0) ||
          date > new Date(event.end))
      ) {
        return false;
      }
      if (location !== "all" && event.province.toLowerCase() !== location) {
        return false;
      }
      if (type !== "all" && event.category.toLowerCase() !== type) {
        return false;
      }
      if (search && !event.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
    setFilteredEvents(filtered);
  }, [date, location, type, search, events]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <Header />

      {/* events */}
      <section className="container mx-auto mt-20 px-4 py-8">
        <h1 className="mb-8 text-center text-2xl font-medium md:text-3xl">
          Upcoming Events
        </h1>

        {/* search events */}
        <div className="mb-5 flex justify-center">
          <Input
            placeholder="Search events..."
            className="max-w-lg border-sky-600/80 !outline-0 !ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* filter events */}
        <div className="mb-10 flex justify-center">
          <div className="grid w-full max-w-5xl grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {/* date picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start border-gray-400/80 text-left font-normal hover:bg-white sm:col-span-2 lg:col-span-1",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            {/* locations */}
            <Select
              defaultValue="all"
              onValueChange={(value) => setLocation(value)}
            >
              <SelectTrigger className="w-full border-gray-400/80">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Locations</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* types */}
            <Select
              defaultValue="all"
              onValueChange={(value) => setType(value)}
            >
              <SelectTrigger className="w-full border-gray-400/80">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Types</SelectItem>
                  {eventTypes.map((eventType) => (
                    <SelectItem key={eventType.value} value={eventType.value}>
                      {eventType.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <EventsCards items={filteredEvents} />
      </section>

      {/* flex grow for fill space */}
      <div className="flex-grow" />

      {/* footer */}
      <Footer />
    </div>
  );
};

const EventsCards = ({ items }) => {
  if (!items?.length) {
    return (
      <div className="flex w-full items-center justify-center pt-5">
        <h1 className="text-gray-600">No events found</h1>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items?.map((item) => (
        <div
          key={item.id}
          className="w-full max-w-md rounded-lg bg-white shadow-md drop-shadow-xl"
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
          <div className="p-4">
            <h2 className="mb-2 line-clamp-2 font-medium">
              {item.title}
              <span className="flex w-fit rounded bg-fuchsia-700 px-2 py-0.5 text-xs text-white">
                {item.category}
              </span>
            </h2>
            <p className="flex items-end gap-x-1 text-xs text-gray-600">
              <IoLocationSharp className="-ms-1 size-5 text-red-600" />
              {item.city} , {item.province} Province
            </p>
            <p className="mt-1 flex items-end gap-x-1 text-xs text-gray-600">
              <CalendarIcon className="size-4 text-red-600" />
              {format(new Date(item.start), "PPP")} -{" "}
              {format(new Date(item.end), "PPP")}
            </p>
            <div className="flex justify-center">
              <Dialog>
                <DialogTrigger>
                  <Button
                    className="mt-5 border-sky-800 duration-300 hover:bg-sky-800 hover:text-white"
                    variant="outline"
                    size="sm"
                  >
                    More Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {item.title}
                      <span className="ms-2 rounded bg-fuchsia-700 px-2 py-0.5 text-xs text-white">
                        {item.category}
                      </span>
                    </DialogTitle>
                    <DialogDescription>
                      More details about the event and the location.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="">
                    <img
                      src={
                        import.meta.env.VITE_APP_API_URL +
                        item?.image +
                        `?${new Date().getSeconds()}`
                      }
                      alt="gallery"
                      className="my-3 h-48 w-full rounded-lg object-cover"
                    />

                    <p className="flex items-end gap-x-1 text-xs text-gray-600">
                      <IoLocationSharp className="-ms-1 size-5 text-red-600" />
                      {item.city} , {item.province} Province
                    </p>

                    <p className="mt-1 flex items-end gap-x-1 text-xs text-gray-600">
                      <CalendarIcon className="size-4 text-red-600" />
                      {format(new Date(item.start), "PPP")} -{" "}
                      {format(new Date(item.end), "PPP")}
                    </p>
                    <p className="mt-2 line-clamp-4 text-sm text-gray-700">
                      {item.description}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Events;
