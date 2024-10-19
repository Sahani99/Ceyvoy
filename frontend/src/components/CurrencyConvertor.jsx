/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/data/currencies";
import { useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { PiCurrencyDollarSimple } from "react-icons/pi";

const CurrencyConvertor = () => {
  const [firstCurrency, setFirstCurrency] = useState({
    type: "USD",
    amount: 1,
  });
  const [secondCurrency, setSecondCurrency] = useState({
    type: "LKR",
    amount: 0,
  });
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [calculatedRate, setCalculatedRate] = useState(0);
  const [isShow, setIsShow] = useState(false);

  // convert currency
  const convertCurrency = useCallback(
    (fromCurrency, toCurrency, amount, isFirstToSecond = true) => {
      const firstRate = rates[fromCurrency] || 1;
      const secondRate = rates[toCurrency] || 1;
      const rate = secondRate / firstRate;
      setCalculatedRate(rate.toFixed(2));

      if (isFirstToSecond) {
        setSecondCurrency({
          ...secondCurrency,
          amount: (amount * rate).toFixed(2),
        });
      } else {
        setFirstCurrency({
          ...firstCurrency,
          amount: (amount / rate).toFixed(2),
        });
      }
    },
    [rates, firstCurrency, secondCurrency],
  );

  // get rates
  useEffect(() => {
    setLoading(true);
    const appID = import.meta.env.VITE_APP_CURRENCY_API_KEY;
    if (!appID) return;
    fetch(`https://openexchangerates.org/api/latest.json?app_id=${appID}`)
      .then((response) => response.json())
      .then((data) => {
        setRates(data.rates || {});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // load rates first time
  useEffect(() => {
    if (!loading) convertCurrency("USD", "LKR", 1);
  }, [loading]);

  return (
    <div>
      <section
        className={`fixed ${isShow ? "translate-y-0" : "translate-y-[28rem]"} bottom-28 end-4 z-[999] max-w-md rounded-md border border-sky-600 bg-white px-4 py-8 shadow-md drop-shadow-2xl duration-500 ease-out`}
      >
        <h1 className="mb-8 text-center text-2xl font-medium md:text-3xl">
          Currency Convertor
        </h1>

        <p className="text-sm text-gray-700">
          1 {currencies[firstCurrency.type]} equals
        </p>

        {!loading && (
          <p className="mb-5 text-xl md:text-2xl">
            {calculatedRate} {currencies[secondCurrency?.type]}
          </p>
        )}

        {/* currency 1 */}
        <div className="">
          <div className="mt-2 flex w-full">
            <Input
              id="name"
              name="name"
              type="number"
              min="1"
              value={firstCurrency.amount}
              onInput={({ target }) => {
                convertCurrency(
                  firstCurrency.type,
                  secondCurrency.type,
                  target.value,
                );
              }}
              onChange={({ target }) => {
                setFirstCurrency({ ...firstCurrency, amount: target.value });
              }}
              placeholder="1"
              className="w-full rounded-none rounded-l-md border-gray-400/80 p-2"
            />
            <Select
              defaultValue="USD"
              onValueChange={(value) => {
                setFirstCurrency({ ...firstCurrency, type: value });
                convertCurrency(
                  value,
                  secondCurrency.type,
                  firstCurrency.amount,
                );
              }}
            >
              <SelectTrigger className="w-full rounded-none rounded-r-md border-gray-400/80">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.keys(currencies).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currencies[currency]} ({currency})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* currency 2 */}
        <div className="">
          <div className="mt-2 flex w-full">
            <Input
              id="name"
              name="name"
              type="number"
              min="1"
              value={secondCurrency.amount}
              onInput={({ target }) => {
                convertCurrency(
                  firstCurrency.type,
                  secondCurrency.type,
                  target.value,
                  false,
                );
              }}
              onChange={({ target }) => {
                setSecondCurrency({ ...secondCurrency, amount: target.value });
              }}
              placeholder="1"
              className="w-full rounded-none rounded-l-md border-gray-400/80 p-2"
            />
            <Select
              defaultValue="LKR"
              onValueChange={(value) => {
                setSecondCurrency({ ...secondCurrency, type: value });
                convertCurrency(
                  firstCurrency.type,
                  value,
                  secondCurrency.amount,
                  false,
                );
              }}
            >
              <SelectTrigger className="w-full rounded-none rounded-r-md border-gray-400/80">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.keys(currencies).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currencies[currency]} ({currency})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* convertor button */}
      <button
        className={`fixed bottom-16 right-3 z-[999] flex h-10 w-10 items-center justify-center rounded-full bg-sky-700 text-white outline-none backdrop-blur-lg backdrop-filter duration-200 ease-in`}
        onClick={() => setIsShow(!isShow)}
      >
        {!isShow && <PiCurrencyDollarSimple className="h-6 w-6" />}
        {isShow && <IoClose className="h-6 w-6" />}
        <span className="sr-only">Back to top</span>
      </button>
    </div>
  );
};

export default CurrencyConvertor;
