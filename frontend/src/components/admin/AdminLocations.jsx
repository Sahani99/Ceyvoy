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
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { IoLocationSharp } from "react-icons/io5";
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
import { Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { CgClose } from "react-icons/cg";
import { getStart } from "@/data/get-start";

const AdminLocations = () => {
  const [search, setSearch] = useState("");
  const [isPopUpShow, setIsPopUpShow] = useState(false);
  const [locations, setLocations] = useState([]);

  const loadData = async () => {
    await axios
      .get("/location")
      .then(({ data }) => {
        setLocations(data?.locations);
      })
      .catch(() => {
        errorToast("Failed to load data");
      });
  };

  // if search value change
  useEffect(() => {
    const loadData = async () => {
      await axios
        .get(`/location?search=${search}`)
        .then(({ data }) => {
          setLocations(data?.locations);
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
      {/* add locations pop up */}
      <AddLocation
        isOpen={isPopUpShow}
        setIsOpen={setIsPopUpShow}
        loadData={loadData}
      />

      <section className="container mx-auto mt-10 px-4 py-8">
        {/* search locations */}
        <div className="mb-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Input
            placeholder="Search locations..."
            className="max-w-lg border-sky-600/80 !outline-0 !ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* add new locations button */}
          <Button
            onClick={() => setIsPopUpShow(true)}
            className="w-full max-w-[10rem] bg-sky-600 hover:bg-sky-700"
          >
            <Plus className="size-5" />
            Add Location
          </Button>
        </div>

        {/* locations */}
        <div className="flex w-full justify-center pt-2">
          <LocationsCards items={locations} loadData={loadData} />
        </div>
      </section>
    </div>
  );
};

const AddLocation = ({ isOpen, setIsOpen, loadData }) => {
  const dataDefault = {
    title: "",
    city: "",
    province: provinces[0].value,
    category: getStart.environments[0],
    lat: "",
    long: "",
    description: "",
    image: null,
  };
  const errorDefault = {
    title: "",
    city: "",
    province: "",
    category: "",
    lat: "",
    long: "",
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
    await axios
      .post("/location", data)
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
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Add new location to the system. user will be able to see this
            location.
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
              defaultValue={getStart.environments[0]}
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
                  {getStart.environments.map((item) => (
                    <SelectItem key={item} value={item} className="capitalize">
                      {item}
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

          {/* lat and long */}
          <div className="flex w-full flex-col gap-x-2 sm:flex-row">
            {/* lat */}
            <div className="mt-2 w-full">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                name="lat"
                type="text"
                maxLength="50"
                placeholder="6.0535"
                value={formData.lat}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    lat: e.target.value,
                  }))
                }
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.lat && (
                <p className="text-sm text-red-500">{errors.lat}</p>
              )}
            </div>
            {/* long */}
            <div className="mt-2 w-full">
              <Label htmlFor="long">Longitude</Label>
              <Input
                id="long"
                name="long"
                type="text"
                maxLength="50"
                placeholder="80.2210"
                value={formData.long}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    long: e.target.value,
                  }))
                }
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.long && (
                <p className="text-sm text-red-500">{errors.long}</p>
              )}
            </div>
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
            <Label htmlFor="location-image">Location Image</Label>
            {/* if image null */}
            {!formData.image && (
              <label htmlFor="location-image">
                <input
                  type="file"
                  id="location-image"
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
                  alt="location"
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
            {loading ? "Loading..." : "Add Location"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UpdateLocation = ({ id, item, isOpen, setIsOpen, loadData }) => {
  const dataDefault = {
    title: item?.title || "",
    city: item?.city || "",
    province: item?.province || "",
    category: item?.category || "",
    lat: item?.latitude || "",
    long: item?.longitude || "",
    description: item?.description || "",
    image: item?.image || "",
  };
  const errorDefault = {
    title: "",
    city: "",
    province: "",
    category: "",
    lat: "",
    long: "",
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
    await axios
      .post("/location", data)
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
        lat: item?.latitude,
        long: item?.longitude,
        description: item?.description,
        image: item?.image,
      });
    }
  }, [item]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Location</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Update location details.
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
                  {getStart.environments.map((item) => (
                    <SelectItem key={item} value={item} className="capitalize">
                      {item}
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

          {/* lat and long */}
          <div className="flex w-full flex-col gap-x-2 sm:flex-row">
            {/* lat */}
            <div className="mt-2 w-full">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                name="lat"
                type="text"
                maxLength="50"
                placeholder="6.0535"
                value={formData.lat}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    lat: e.target.value,
                  }))
                }
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.lat && (
                <p className="text-sm text-red-500">{errors.lat}</p>
              )}
            </div>
            {/* long */}
            <div className="mt-2 w-full">
              <Label htmlFor="long">Longitude</Label>
              <Input
                id="long"
                name="long"
                type="text"
                maxLength="50"
                placeholder="80.2210"
                value={formData.long}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    long: e.target.value,
                  }))
                }
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.long && (
                <p className="text-sm text-red-500">{errors.long}</p>
              )}
            </div>
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
            <Label htmlFor="location-image">Location Image</Label>
            {/* if image null */}
            {!formData.image && (
              <label htmlFor="location-image">
                <input
                  type="file"
                  id="location-image"
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
                  alt="location"
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
            {loading ? "Loading..." : "Update Location"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const LocationsCards = ({ items, loadData }) => {
  const [isUpdatePopUpShow, setIsUpdatePopUpShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  if (!items?.length) {
    return (
      <div className="flex w-full items-center justify-center pt-5">
        <h1 className="text-gray-600">No locations found</h1>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <UpdateLocation
        isOpen={isUpdatePopUpShow}
        setIsOpen={setIsUpdatePopUpShow}
        item={selectedItem}
        id={selectedItem?.id}
        loadData={loadData}
      />
      {items?.map((item) => (
        <div
          key={item?.id}
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
            <h2 className="line-clamp-2 font-medium">{item?.title}</h2>
            <p className="mb-1 flex w-fit rounded bg-fuchsia-700 px-2 py-0.5 text-xs text-white">
              {item?.category}
            </p>
            <p className="flex items-end gap-x-1 text-xs capitalize text-gray-600">
              <IoLocationSharp className="-ms-1 size-5 text-red-600" />
              {item?.city}, {item?.province.replace(/-/g, " ")} Province
            </p>
            <p className="mt-2 line-clamp-4 text-sm text-gray-700">
              {item?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminLocations;
