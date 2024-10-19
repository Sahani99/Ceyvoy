/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { errorToast, successToast } from "@/lib/toastify";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { FaPen } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { provinces } from "@/data/provinces";
import { CalendarIcon, Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { CgClose } from "react-icons/cg";
import { eventTypes } from "@/data/events";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { IoLocationSharp } from "react-icons/io5";

const AdminEvents = () => {
  const [search, setSearch] = useState("");
  const [isPopUpShow, setIsPopUpShow] = useState(false);
  const [events, setEvents] = useState([]);

  const loadData = async () => {
    await axios
      .get("/event")
      .then(({ data }) => {
        setEvents(data?.events);
      })
      .catch(() => {
        errorToast("Failed to load data");
      });
  };

  // if search value change
  useEffect(() => {
    const loadData = async () => {
      await axios
        .get(`/event?search=${search}`)
        .then(({ data }) => {
          setEvents(data?.events);
        })
        .catch(() => {
          errorToast("Failed to load data");
        });
    };
    loadData();
  }, [search]);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* add events pop up */}
      <AddEvent
        isOpen={isPopUpShow}
        setIsOpen={setIsPopUpShow}
        loadData={loadData}
      />

      <section className="container mx-auto mt-10 px-4 py-8">
        {/* search events */}
        <div className="mb-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Input
            placeholder="Search events..."
            className="max-w-lg border-sky-600/80 !outline-0 !ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* add new events button */}
          <Button
            onClick={() => setIsPopUpShow(true)}
            className="w-full max-w-[10rem] bg-sky-600 hover:bg-sky-700"
          >
            <Plus className="size-5" />
            Add Event
          </Button>
        </div>

        {/* events */}
        <div className="flex w-full justify-center pt-2">
          <EventsCards items={events} loadData={loadData} />
        </div>
      </section>
    </div>
  );
};

const AddEvent = ({ isOpen, setIsOpen, loadData }) => {
  const dataDefault = {
    title: "",
    start: new Date(),
    end: new Date(),
    city: "",
    province: provinces[0].value,
    category: eventTypes[0].value,
    description: "",
    image: null,
  };
  const errorDefault = {
    title: "",
    city: "",
    start: "",
    end: "",
    province: "",
    category: "",
    description: "",
    image: "",
  };
  const [formData, setFormData] = useState(dataDefault);
  const [errors, setErrors] = useState(errorDefault);
  const [loading, setLoading] = useState(false);

  // validate form
  const validateForm = (formData) => {
    const keys = Object.keys(formData);
    keys.forEach((key) => {
      if (!formData[key]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: `${key} is required`,
        }));
        return false;
      }
    });

    // description length
    if (formData.description.length > 500) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: "Description length must be less than 500 characters",
      }));
      return false;
    }

    // validate image size
    if (formData.image && formData.image.size > 1024 * 1024 * 2) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Image size must be less than 2MB",
      }));
      return false;
    }

    return true;
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    setLoading(true);
    // reset errors
    setErrors(errorDefault);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    // change start and end date to YYYY-MM-DD format
    data.set(
      "start",
      `${formData.start.getFullYear()}-${formData.start.getMonth() + 1}-${formData.start.getDate()}`,
    );
    data.set(
      "end",
      `${formData.end.getFullYear()}-${formData.end.getMonth() + 1}-${formData.end.getDate()}`,
    );
    await axios
      .post("/event", data)
      .then(({ data }) => {
        successToast(data.message);
        // reset form data
        setFormData(dataDefault);
        loadData();
        setIsOpen(false);
      })
      .catch((error) => {
        const data = error.response.data;
        // if error code 500 show error toast
        if (error.response.status === 500) {
          return errorToast(data.message);
        }
        // set errors
        setErrors((prevErrors) => ({
          ...prevErrors,
          [data?.property]: data.message,
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Events</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Add new events to the system.
          </DialogDescription>
        </DialogHeader>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center"
        >
          {/* title */}
          <div className="mt-2 w-full">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              maxLength="256"
              placeholder="Galle fort"
              value={formData.title}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  title: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* start */}
          <div className="mb-2 w-full">
            <Label htmlFor="start">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start border-gray-400/80 text-left font-normal hover:bg-white",
                    !formData.start && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start ? (
                    format(formData.start, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.start}
                  onSelect={(date) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      start: date,
                    }))
                  }
                  initialFocus
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            {/* errors */}
            {errors.start && (
              <p className="text-sm text-red-500">{errors.start}</p>
            )}
          </div>

          {/* end */}
          <div className="mb-2 w-full">
            <Label htmlFor="end">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start border-gray-400/80 text-left font-normal hover:bg-white",
                    !formData.end && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end ? (
                    format(formData.end, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.end}
                  onSelect={(date) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      end: date,
                    }))
                  }
                  initialFocus
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            {/* errors */}
            {errors.end && <p className="text-sm text-red-500">{errors.end}</p>}
          </div>

          {/* near city*/}
          <div className="mt-2 w-full">
            <Label htmlFor="city">Near City</Label>
            <Input
              id="city"
              name="city"
              type="text"
              maxLength="50"
              placeholder="Galle"
              value={formData.city}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  city: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          {/* province */}
          <div className="mt-2 w-full">
            <Label htmlFor="province">Province</Label>
            <Select
              defaultValue={provinces[0].value}
              onValueChange={(value) =>
                setFormData((prevData) => ({
                  ...prevData,
                  province: value,
                }))
              }
            >
              <SelectTrigger className="w-full border-gray-400/80">
                <SelectValue placeholder="Select a province" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {provinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* errors */}
            {errors.province && (
              <p className="text-sm text-red-500">{errors.province}</p>
            )}
          </div>

          {/* category */}
          <div className="mt-2 w-full">
            <Label htmlFor="category">Category</Label>
            <Select
              defaultValue={eventTypes[0].value}
              onValueChange={(value) =>
                setFormData((prevData) => ({
                  ...prevData,
                  category: value,
                }))
              }
            >
              <SelectTrigger className="w-full border-gray-400/80 capitalize">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {eventTypes.map((eventType) => (
                    <SelectItem key={eventType.value} value={eventType.value}>
                      {eventType.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* errors */}
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* description */}
          <div className="mt-2 w-full">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows="5"
              maxLength="500"
              placeholder="Galle fort is a historical fort..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  description: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* image */}
          <div className="mt-2 w-full">
            <Label htmlFor="event-image">Event Image</Label>
            {/* if image null */}
            {!formData.image && (
              <label htmlFor="event-image">
                <input
                  type="file"
                  id="event-image"
                  className="peer sr-only"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData((prevData) => ({
                      ...prevData,
                      image: file,
                    }));
                  }}
                />
                <div className="mt-2 flex h-28 w-28 cursor-pointer items-center justify-center rounded-sm bg-gray-400 p-2 text-white">
                  <Plus className="size-10" />
                </div>
              </label>
            )}

            {/* if image not null , show image */}
            {formData.image && (
              <div className="relative mt-2 h-28 w-28">
                <CgClose
                  className="absolute end-1 top-1 size-5 cursor-pointer rounded-full bg-black p-1 text-white"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      image: null,
                    }))
                  }
                />

                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="event"
                  className="h-28 w-28 rounded-md border border-gray-400/80 object-cover"
                />
              </div>
            )}

            {/* errors */}
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full max-w-[10rem] rounded-md bg-sky-700 px-4 py-2 text-white"
          >
            {loading ? "Loading..." : "Add Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UpdateEvent = ({ id, item, isOpen, setIsOpen, loadData }) => {
  const dataDefault = {
    title: item?.title || "",
    city: item?.city || "",
    start: new Date(item?.start || new Date()),
    end: new Date(item?.end || new Date()),
    province: item?.province || "",
    category: item?.category || "",
    description: item?.description || "",
    image: item?.image || "",
  };
  const errorDefault = {
    title: "",
    city: "",
    start: "",
    end: "",
    province: "",
    category: "",
    description: "",
    image: "",
  };
  const [formData, setFormData] = useState(dataDefault);
  const [errors, setErrors] = useState(errorDefault);
  const [loading, setLoading] = useState(false);

  // validate form
  const validateForm = (formData) => {
    const keys = Object.keys(formData);
    keys.forEach((key) => {
      if (!formData[key]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: `${key} is required`,
        }));
        return false;
      }
    });

    // description length
    if (formData.description.length > 500) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: "Description length must be less than 500 characters",
      }));
      return false;
    }

    // if image value is not an string then it is a file
    if (typeof formData.image !== "string") {
      if (formData.image && formData.image.size > 1024 * 1024 * 2) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Image size must be less than 2MB",
        }));
        return false;
      }
    }

    return true;
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    setLoading(true);
    // reset errors
    setErrors(errorDefault);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("type", "UPDATE");
    data.append("id", id);
    // change start and end date to YYYY-MM-DD format
    data.set(
      "start",
      `${formData.start.getFullYear()}-${formData.start.getMonth() + 1}-${formData.start.getDate()}`,
    );
    data.set(
      "end",
      `${formData.end.getFullYear()}-${formData.end.getMonth() + 1}-${formData.end.getDate()}`,
    );
    await axios
      .post("/event", data)
      .then(({ data }) => {
        successToast(data.message);
        // reset form data
        setFormData(dataDefault);
        loadData();
        setIsOpen(false);
      })
      .catch((error) => {
        const data = error.response.data;
        // if error code 500 show error toast
        if (error.response.status === 500) {
          return errorToast(data.message);
        }
        // set errors
        setErrors((prevErrors) => ({
          ...prevErrors,
          [data?.property]: data.message,
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (item) {
      setFormData({
        title: item?.title,
        city: item?.city,
        province: item?.province,
        category: item?.category,
        start: new Date(item?.start),
        end: new Date(item?.end),
        description: item?.description,
        image: item?.image,
      });
    }
  }, [item]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Event</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Update event details.
          </DialogDescription>
        </DialogHeader>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center"
        >
          {/* title */}
          <div className="mt-2 w-full">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              maxLength="256"
              placeholder="Galle fort"
              value={formData.title}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  title: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* near city*/}
          <div className="mt-2 w-full">
            <Label htmlFor="city">Near City</Label>
            <Input
              id="city"
              name="city"
              type="text"
              maxLength="50"
              placeholder="Galle"
              value={formData.city}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  city: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          {/* province */}
          <div className="mt-2 w-full">
            <Label htmlFor="city">Near City</Label>
            <Select
              value={formData.province}
              onValueChange={(value) =>
                setFormData((prevData) => ({
                  ...prevData,
                  province: value,
                }))
              }
            >
              <SelectTrigger className="w-full border-gray-400/80">
                <SelectValue placeholder="Select a province" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {provinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* errors */}
            {errors.province && (
              <p className="text-sm text-red-500">{errors.province}</p>
            )}
          </div>

          {/* category */}
          <div className="mt-2 w-full">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prevData) => ({
                  ...prevData,
                  category: value,
                }))
              }
            >
              <SelectTrigger className="w-full border-gray-400/80 capitalize">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {eventTypes.map((eventType) => (
                    <SelectItem key={eventType.value} value={eventType.value}>
                      {eventType.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* errors */}
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* start */}
          <div className="mb-2 w-full">
            <Label htmlFor="start">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start border-gray-400/80 text-left font-normal hover:bg-white",
                    !formData?.start && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData?.start ? (
                    format(formData?.start, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.start}
                  onSelect={(date) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      start: date,
                    }))
                  }
                  initialFocus
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            {/* errors */}
            {errors.start && (
              <p className="text-sm text-red-500">{errors.start}</p>
            )}
          </div>

          {/* end */}
          <div className="mb-2 w-full">
            <Label htmlFor="end">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start border-gray-400/80 text-left font-normal hover:bg-white",
                    !formData?.end && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData?.end ? (
                    format(formData?.end, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.end}
                  onSelect={(date) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      end: date,
                    }))
                  }
                  initialFocus
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            {/* errors */}
            {errors.end && <p className="text-sm text-red-500">{errors.end}</p>}
          </div>

          {/* description */}
          <div className="mt-2 w-full">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows="5"
              maxLength="500"
              placeholder="Galle fort is a historical fort..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  description: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* image */}
          <div className="mt-2 w-full">
            <Label htmlFor="event-image">Event Image</Label>
            {/* if image null */}
            {!formData.image && (
              <label htmlFor="event-image">
                <input
                  type="file"
                  id="event-image"
                  className="peer sr-only"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData((prevData) => ({
                      ...prevData,
                      image: file,
                    }));
                  }}
                />
                <div className="mt-2 flex h-28 w-28 cursor-pointer items-center justify-center rounded-sm bg-gray-400 p-2 text-white">
                  <Plus className="size-10" />
                </div>
              </label>
            )}

            {/* if image not null , show image */}
            {formData.image && (
              <div className="relative mt-2 h-28 w-28">
                <CgClose
                  className="absolute end-1 top-1 size-5 cursor-pointer rounded-full bg-black p-1 text-white"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      image: null,
                    }))
                  }
                />

                <img
                  src={
                    typeof formData.image === "string"
                      ? import.meta.env.VITE_APP_API_URL +
                        item?.image +
                        `?${new Date().getSeconds()}`
                      : URL.createObjectURL(formData.image)
                  }
                  alt="event"
                  className="h-28 w-28 rounded-md border border-gray-400/80 object-cover"
                />
              </div>
            )}

            {/* errors */}
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full max-w-[10rem] rounded-md bg-sky-700 px-4 py-2 text-white"
          >
            {loading ? "Loading..." : "Update Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EventsCards = ({ items, loadData }) => {
  const [isUpdatePopUpShow, setIsUpdatePopUpShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  if (!items?.length) {
    return (
      <div className="flex w-full items-center justify-center pt-5">
        <h1 className="text-gray-600">No events found</h1>
      </div>
    );
  }

  return (
    <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <UpdateEvent
        isOpen={isUpdatePopUpShow}
        setIsOpen={setIsUpdatePopUpShow}
        item={selectedItem}
        id={selectedItem?.id}
        loadData={loadData}
      />
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

          <div
            onClick={() => {
              setSelectedItem(item);
              setIsUpdatePopUpShow(true);
            }}
            className="absolute right-2 top-1 h-8 w-8 cursor-pointer rounded-full bg-white p-2 text-sky-700"
          >
            <FaPen />
          </div>

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
              {format(new Date(item?.start), "PPP")} -{" "}
              {format(new Date(item?.end), "PPP")}
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

export default AdminEvents;
