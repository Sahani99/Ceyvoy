/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { getStart } from "@/data/get-start";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionnaire } from "@/state/trip-slice";
import { useState } from "react";

const Questionnaire = ({ setCurrentStep }) => {
  const { questionnaire } = useSelector((state) => state.trip);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    people: "",
    arrival: "",
    days: "",
    budget: "",
    language: "",
    environment: "",
  });

  const validateForm = (questionnaire) => {
    const keys = Object.keys(questionnaire);
    keys.forEach((key) => {
      if (!questionnaire[key]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: `${key} is required`,
        }));
        return false;
      }
    });

    // if environment is empty
    if (!questionnaire.environment.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        environment: "environment is required",
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(questionnaire)) return;
    setCurrentStep(2);
  };

  return (
    <div className="flex w-full justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-4xl flex-col items-center justify-center"
      >
        {/* people count */}
        <div className="mb-2 w-full">
          <Label htmlFor="people">
            How many people are traveling with you :
          </Label>
          <Select
            value={questionnaire.people}
            onValueChange={(value) =>
              dispatch(
                setQuestionnaire({ key: "people", value: parseInt(value) }),
              )
            }
          >
            <SelectTrigger className="w-full border-gray-400/80">
              <SelectValue placeholder="Select a peoples count" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from({ length: 25 }, (_, i) => i + 1).map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* errors */}
          {errors.people && (
            <p className="text-sm text-red-500">{errors.people}</p>
          )}
        </div>

        {/* arrival date */}
        <div className="mb-2 w-full">
          <Label htmlFor="arrival">When do you plan to arrive :</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start border-gray-400/80 text-left font-normal hover:bg-white",
                  !questionnaire.arrival && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {questionnaire.arrival ? (
                  format(questionnaire.arrival, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={questionnaire.arrival}
                onSelect={(date) =>
                  dispatch(setQuestionnaire({ key: "arrival", value: date }))
                }
                initialFocus
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
          {/* errors */}
          {errors.arrival && (
            <p className="text-sm text-red-500">{errors.arrival}</p>
          )}
        </div>

        {/* days count */}
        <div className="mb-2 w-full">
          <Label htmlFor="days">How many days do you plan to stay :</Label>
          <Select
            value={questionnaire.days}
            onValueChange={(value) =>
              dispatch(
                setQuestionnaire({ key: "days", value: parseInt(value) }),
              )
            }
          >
            <SelectTrigger className="w-full border-gray-400/80">
              <SelectValue placeholder="Select a days count" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* errors */}
          {errors.days && <p className="text-sm text-red-500">{errors.days}</p>}
        </div>

        {/* budget */}
        <div className="mb-2 w-full">
          <Label htmlFor="budget">
            What is your maximum budget for your trip?
          </Label>
          <Select
            value={questionnaire.budget}
            onValueChange={(value) =>
              dispatch(
                setQuestionnaire({ key: "budget", value: parseInt(value) }),
              )
            }
          >
            <SelectTrigger className="w-full border-gray-400/80">
              <SelectValue placeholder="Select a budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {getStart.budget.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* errors */}
          {errors.budget && (
            <p className="text-sm text-red-500">{errors.budget}</p>
          )}
        </div>

        {/* environment */}
        <div className="mb-2 w-full">
          <Label htmlFor="environment">
            What kind of environments are you interested in :
          </Label>
          <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {getStart.environments.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Checkbox
                  id={item}
                  checked={questionnaire.environment.includes(item)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      dispatch(
                        setQuestionnaire({
                          key: "environment",
                          value: [...questionnaire.environment, item],
                        }),
                      );
                    } else {
                      dispatch(
                        setQuestionnaire({
                          key: "environment",
                          value: questionnaire.environment.filter(
                            (env) => env !== item,
                          ),
                        }),
                      );
                    }
                  }}
                />
                <Label htmlFor={item} className="capitalize">
                  {item}
                </Label>
              </div>
            ))}
          </div>
          {/* errors */}
          {errors.environment && (
            <p className="text-sm text-red-500">{errors.environment}</p>
          )}
        </div>

        {/* language */}
        <div className="mb-2 w-full">
          <Label htmlFor="language">Which languages do you speak :</Label>
          <Select
            value={questionnaire.language}
            onValueChange={(value) =>
              dispatch(setQuestionnaire({ key: "language", value: value }))
            }
          >
            <SelectTrigger className="w-full border-gray-400/80">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {getStart.languages.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* errors */}
          {errors.language && (
            <p className="text-sm text-red-500">{errors.language}</p>
          )}
        </div>

        <Button className="mt-4 w-full max-w-lg rounded-md bg-sky-700 px-4 py-2 text-white">
          Next
        </Button>
      </form>
    </div>
  );
};

export default Questionnaire;
