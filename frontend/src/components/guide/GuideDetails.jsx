import { errorToast, successToast } from "@/lib/toastify";
import { resetUserValue, setUserValue } from "@/state/user-slice";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { getStart } from "@/data/get-start";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

const experiences = [
  { label: "0-1 years", value: "0-1 years" },
  { label: "1-2 years", value: "1-2 years" },
  { label: "2-5 years", value: "2-5 years" },
  { label: "5-10 years", value: "5-10 years" },
  { label: "10+ years", value: "10+ years" },
];

const GuideDetails = () => {
  const { user } = useSelector((state) => state.user);
  const { guide } = user;
  const dispatch = useDispatch();
  const dataDefault = {
    license: guide?.license || "",
    description: guide?.description || "",
    cost: guide?.cost || 0,
    languages: guide?.languages?.split(",") || [],
    contact: guide?.contact || "",
    experience: guide?.experience || experiences[0].value,
  };
  const errorDefault = {
    license: "",
    description: "",
    cost: "",
    languages: "",
    contact: "",
    experience: "",
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

    // if languages not selected
    if (formData.languages.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        languages: "At least one language is required",
      }));
      return false;
    }

    return true;
  };

  const updateState = async () => {
    await axios
      .get("/authorize")
      .then(async ({ data }) => {
        if (data?.user) dispatch(setUserValue(data?.user));
      })
      .catch(() => {
        dispatch(resetUserValue());
      });
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
    if (guide?.id !== null) data.append("type", "UPDATE");
    await axios
      .post("/guide", data)
      .then(async ({ data }) => {
        successToast(data.message);
        // update user state
        await updateState();
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
    <div className="flex w-full flex-col items-center gap-5">
      {guide?.id === null && (
        <div className="mt-5 flex w-full max-w-3xl flex-col items-center rounded-md bg-red-500 px-5 py-2">
          <p className="text-sm font-medium text-white">
            You have not provided your guide details yet.
          </p>
        </div>
      )}

      {guide !== null && guide?.is_verified === 0 && (
        <div className="mt-5 flex w-full max-w-3xl flex-col items-center rounded-md bg-amber-500 px-5 py-2">
          <p className="text-sm font-medium text-white">
            Your guide details are not verified yet.
          </p>
        </div>
      )}

      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-full max-w-3xl flex-col items-center justify-center"
      >
        {/* license */}
        <div className="mt-2 w-full">
          <Label htmlFor="license">Guide License</Label>
          <Input
            id="license"
            name="license"
            type="text"
            maxLength="256"
            placeholder="Galle fort"
            value={formData.license}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                license: e.target.value,
              }))
            }
            className="w-full border-gray-400/80 p-2"
          />
          {/* errors */}
          {errors.license && (
            <p className="text-sm text-red-500">{errors.license}</p>
          )}
        </div>

        {/* cost */}
        <div className="mt-2 w-full">
          <Label htmlFor="cost">Cost for Day (LKR)</Label>
          <Input
            id="cost"
            name="cost"
            type="number"
            placeholder="1000"
            value={formData.cost}
            onChange={(e) =>
              setFormData((prevData) => ({ ...prevData, cost: e.target.value }))
            }
            className="w-full border-gray-400/80 p-2"
          />
          {/* errors */}
          {errors.cost && <p className="text-sm text-red-500">{errors.cost}</p>}
        </div>

        {/* experience */}
        <div className="mt-2 w-full">
          <Label htmlFor="experience">Experience</Label>
          <Select
            defaultValue={experiences[0].value}
            onValueChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                experience: value,
              }))
            }
          >
            <SelectTrigger className="w-full border-gray-400/80">
              <SelectValue placeholder="Select a experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {experiences.map((experience) => (
                  <SelectItem key={experience.value} value={experience.value}>
                    {experience.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* errors */}
          {errors.experience && (
            <p className="text-sm text-red-500">{errors.experience}</p>
          )}
        </div>

        {/* contact */}
        <div className="mt-2 w-full">
          <Label htmlFor="contact">Contact Number</Label>
          <Input
            id="contact"
            name="contact"
            type="text"
            placeholder="0712345678"
            value={formData.contact}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                contact: e.target.value,
              }))
            }
            className="w-full border-gray-400/80 p-2"
          />
          {/* errors */}
          {errors.contact && (
            <p className="text-sm text-red-500">{errors.contact}</p>
          )}
        </div>

        {/* languages */}
        <div className="mt-2 w-full">
          <Label htmlFor="languages">
            Languages You Can Guide In (Select all that apply)
          </Label>
          <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {getStart.languages.map((item) => (
              <div key={item.value} className="flex items-center gap-2">
                <Checkbox
                  id={item.value}
                  checked={formData.languages.includes(item.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({
                        ...formData,
                        languages: [...formData.languages, item.value],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        languages: formData.languages.filter(
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
          {errors.languages && (
            <p className="text-sm text-red-500">{errors.languages}</p>
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
            placeholder="I am a professional guide with 5 years of experience..."
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

        {/* submit button */}
        <Button
          type="submit"
          className="mt-5 w-full max-w-sm rounded-md bg-primary p-2 text-white"
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default GuideDetails;
