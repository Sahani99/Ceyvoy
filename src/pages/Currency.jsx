/* eslint-disable react-hooks/exhaustive-deps */
import Footer from "@/components/Footer";
import Header from "@/components/Header";
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

const Currency = () => {
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
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <Header />

      {/* flex grow for fill space */}
      <div className="flex-grow" />

      {/* currency */}
      <section className="container mx-auto mt-20 max-w-4xl px-4 py-8">
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

      {/* flex grow for fill space */}
      <div className="flex-grow" />

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Currency;
