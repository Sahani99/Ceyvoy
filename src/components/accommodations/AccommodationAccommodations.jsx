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
import { Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { CgClose } from "react-icons/cg";
import { categories, facilities } from "@/data/accommodations";
import { Checkbox } from "../ui/checkbox";
import { Link } from "react-router-dom";

const AccommodationAccommodations = () => {
  const [search, setSearch] = useState("");
  const [isPopUpShow, setIsPopUpShow] = useState(false);
  const [accommodations, setAccommodations] = useState([]);

  const loadData = async () => {
    await axios
      .get("/accommodation")
      .then(({ data }) => {
        setAccommodations(data?.accommodations);
      })
      .catch(() => {
        errorToast("Failed to load data");
      });
  };

  // if search value change
  useEffect(() => {
    const loadData = async () => {
      await axios
        .get(`/accommodation?search=${search}`)
        .then(({ data }) => {
          setAccommodations(data?.accommodations);
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
      {/* add accommodations pop up */}
      <AddAccommodation
        isOpen={isPopUpShow}
        setIsOpen={setIsPopUpShow}
        loadData={loadData}
      />

      <section className="container mx-auto mt-10 px-4 py-8">
        {/* search accommodations */}
        <div className="mb-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Input
            placeholder="Search accommodations..."
            className="max-w-lg border-sky-600/80 !outline-0 !ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* add new accommodations button */}
          <Button
            onClick={() => setIsPopUpShow(true)}
            className="w-full max-w-[13rem] bg-sky-600 hover:bg-sky-700"
          >
            <Plus className="size-5" />
            Add Accommodation
          </Button>
        </div>

        {/* accommodations */}
        <div className="flex w-full justify-center pt-2">
          <AccommodationsCards items={accommodations} loadData={loadData} />
        </div>
      </section>
    </div>
  );
};

const AddAccommodation = ({ isOpen, setIsOpen, loadData }) => {
  const dataDefault = {
    name: "",
    address: "",
    category: categories[0].value,
    city: "",
    website: "",
    maxGuests: "",
    price: 0,
    description: "",
    contactNo: "",
    facilities: [],
    image: null,
  };
  const errorDefault = {
    name: "",
    address: "",
    category: "",
    city: "",
    website: "",
    maxGuests: "",
    price: "",
    description: "",
    contactNo: "",
    facilities: "",
    image: "",
  };
  const [formData, setFormData] = useState(dataDefault);
  const [errors, setErrors] = useState(errorDefault);
  const [loading, setLoading] = useState(false);

  // validate form
  const validateForm = (formData) => {
    const keys = Object.keys(formData);
    keys.forEach((key) => {
      if (!formData[key] || formData[key] === null) {
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

    // check facilities
    if (!formData.facilities.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        facilities: "Facilities is required",
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
      .post("/accommodation", data)
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
      <DialogContent className="max-h-[90%] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Accommodation</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Add new accommodation details.
          </DialogDescription>
        </DialogHeader>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center"
        >
          {/* name */}
          <div className="mt-2 w-full">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              maxLength="50"
              placeholder="Galle fort hotel"
              value={formData.name}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  name: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* address */}
          <div className="mt-2 w-full">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              type="text"
              maxLength="256"
              placeholder="Galle fort"
              value={formData.address}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  address: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          {/* category */}
          <div className="mt-2 w-full">
            <Label htmlFor="category">Category</Label>
            <Select
              defaultValue={categories[0].value}
              onValueChange={(value) =>
                setFormData((prevData) => ({
                  ...prevData,
                  category: value,
                }))
              }
            >
              <SelectTrigger className="w-full border-gray-400/80">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
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

          {/* website */}
          <div className="mt-2 w-full">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="text"
              maxLength="256"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  website: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website}</p>
            )}
          </div>

          {/* max guest */}
          <div className="mt-2 w-full">
            <Label htmlFor="max-guest">Max Guest</Label>
            <Input
              id="max-guest"
              name="maxGuests"
              type="number"
              maxLength="50"
              placeholder="10"
              value={formData.maxGuests}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  maxGuests: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.maxGuests && (
              <p className="text-sm text-red-500">{errors.maxGuests}</p>
            )}
          </div>

          {/* price */}
          <div className="mt-2 w-full">
            <Label htmlFor="price">One Night Price (LKR)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              maxLength="50"
              placeholder="1000"
              value={formData.price}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  price: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          {/* contact no */}
          <div className="mt-2 w-full">
            <Label htmlFor="contact-no">Contact No</Label>
            <Input
              id="contact-no"
              name="contactNo"
              type="text"
              maxLength="50"
              placeholder="0712345678"
              value={formData.contactNo}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  contactNo: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.contactNo && (
              <p className="text-sm text-red-500">{errors.contactNo}</p>
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

          {/* facilities */}
          <div className="mt-2 w-full">
            <Label htmlFor="facilities">Facilities</Label>
            <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {facilities.map((item) => (
                <div key={item.value} className="flex items-center gap-2">
                  <Checkbox
                    id={item}
                    checked={formData.facilities.includes(item.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          facilities: [...formData.facilities, item.value],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          facilities: formData.facilities.filter(
                            (env) => env !== item.value,
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={item.value} className="capitalize">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
            {/* error */}
            {errors.facilities && (
              <p className="text-sm text-red-500">{errors.facilities}</p>
            )}
          </div>

          {/* image */}
          <div className="mt-2 w-full">
            <Label htmlFor="location-image">Accommodation Image</Label>
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
            className="mt-4 w-full max-w-[13rem] rounded-md bg-sky-700 px-4 py-2 text-white"
          >
            {loading ? "Loading..." : "Add Accommodation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UpdateAccommodation = ({ id, item, isOpen, setIsOpen, loadData }) => {
  const dataDefault = {
    name: item?.name || "",
    address: item?.address || "",
    category: item?.category || categories[0].value,
    city: item?.city || "",
    website: item?.website || "",
    maxGuests: item?.max_guests || "",
    price: item?.price || 0,
    contactNo: item?.contact_no || "",
    description: item?.description || "",
    facilities: item?.facilities.split(",") || [],
    image: item?.image || "",
  };
  const errorDefault = {
    name: "",
    address: "",
    category: "",
    city: "",
    website: "",
    maxGuests: "",
    price: "",
    contactNo: "",
    description: "",
    facilities: "",
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

    // check facilities
    if (!formData.facilities.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        facilities: "Facilities is required",
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
    data.append("type", "UPDATE");
    data.append("id", id);
    await axios
      .post("/accommodation", data)
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
        name: item?.name,
        address: item?.address,
        category: item?.category,
        city: item?.city,
        website: item?.website,
        maxGuests: item?.max_guests,
        price: item?.price,
        contactNo: item?.contact_no,
        description: item?.description,
        facilities: item?.facilities.split(","),
        image: item?.image,
      });
    }
  }, [item]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90%] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Accommodation</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Update accommodation details.
          </DialogDescription>
        </DialogHeader>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center"
        >
          {/* name */}
          <div className="mt-2 w-full">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              maxLength="50"
              placeholder="Galle fort hotel"
              value={formData.name}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  name: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* address */}
          <div className="mt-2 w-full">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              type="text"
              maxLength="256"
              placeholder="Galle fort"
              value={formData.address}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  address: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
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
              <SelectTrigger className="w-full border-gray-400/80">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
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

          {/* website */}
          <div className="mt-2 w-full">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="text"
              maxLength="256"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  website: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website}</p>
            )}
          </div>

          {/* max guest */}
          <div className="mt-2 w-full">
            <Label htmlFor="max-guest">Max Guest</Label>
            <Input
              id="max-guest"
              name="maxGuests"
              type="number"
              maxLength="50"
              placeholder="10"
              value={formData.maxGuests}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  maxGuests: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.maxGuests && (
              <p className="text-sm text-red-500">{errors.maxGuests}</p>
            )}
          </div>

          <div className="mt-2 w-full">
            <Label htmlFor="price">One Night Price (LKR)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              maxLength="50"
              placeholder="1000"
              value={formData.price}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  price: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          {/* contact no */}
          <div className="mt-2 w-full">
            <Label htmlFor="contact-no">Contact No</Label>
            <Input
              id="contact-no"
              name="contactNo"
              type="text"
              maxLength="50"
              placeholder="0712345678"
              value={formData.contactNo}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  contactNo: e.target.value,
                }))
              }
              className="w-full border-gray-400/80 p-2"
            />
            {/* errors */}
            {errors.contactNo && (
              <p className="text-sm text-red-500">{errors.contactNo}</p>
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

          {/* facilities */}
          <div className="mt-2 w-full">
            <Label htmlFor="facilities">Facilities</Label>
            <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {facilities.map((item) => (
                <div key={item.value} className="flex items-center gap-2">
                  <Checkbox
                    id={item}
                    checked={formData.facilities.includes(item.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          facilities: [...formData.facilities, item.value],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          facilities: formData.facilities.filter(
                            (env) => env !== item.value,
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={item.value} className="capitalize">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
            {/* error */}
            {errors.facilities && (
              <p className="text-sm text-red-500">{errors.facilities}</p>
            )}
          </div>

          {/* image */}
          <div className="mt-2 w-full">
            <Label htmlFor="location-image">Accommodation Image</Label>
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
            className="mt-4 w-full max-w-[13rem] rounded-md bg-sky-700 px-4 py-2 text-white"
          >
            {loading ? "Loading..." : "Update Accommodation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AccommodationsCards = ({ items, loadData }) => {
  const [isUpdatePopUpShow, setIsUpdatePopUpShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  if (!items?.length) {
    return (
      <div className="flex w-full items-center justify-center pt-5">
        <h1 className="text-gray-600">No accommodations found</h1>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <UpdateAccommodation
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
            <h2 className="line-clamp-2 font-medium">
              {item?.name}
              <span className="mb-1 ms-2 w-fit rounded bg-fuchsia-700 px-2 py-0.5 text-xs text-white">
                {item?.category}
              </span>
            </h2>
            <p className="flex items-end justify-between gap-x-1 text-xs capitalize text-gray-600">
              <span className="flex items-end gap-x-1">
                <IoLocationSharp className="-ms-1 size-5 text-red-600" />
                {item?.city}
              </span>
              <span className="">Max Guests: {item?.max_guests}</span>
            </p>
            <p className="mt-1 text-xs text-gray-700">
              Contact No: {item?.contact_no}
            </p>
            <p className="mt-1 text-xs text-gray-700">
              One Night Price: LKR {item?.price?.toFixed(2)}
            </p>

            <p className="mt-1 text-xs text-gray-700">
              Website:{" "}
              <Link to={item?.website} className="text-sky-600 underline">
                {item?.website}
              </Link>
            </p>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2">
              {item?.facilities.split(",").map((facility, key) => (
                <div
                  key={key}
                  className="flex items-center gap-1 text-xs capitalize text-gray-700"
                >
                  <Checkbox
                    checked
                    readOnly
                    className="!border-none !bg-emerald-600 p-[0.3px]"
                  />
                  <span>{facility}</span>
                </div>
              ))}
            </div>

            <p className="mt-2 line-clamp-4 text-sm text-gray-700">
              {item?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccommodationAccommodations;
