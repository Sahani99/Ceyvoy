import React, { useEffect, useState } from 'react';
import '../styles/CurrencyConverter.css';  // Import the CSS file

const CurrencyConverter = ({ closeConverter }) => {
  const apiKey = '493df1fd7e574693b94326174caa6f10';
  const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState(localStorage.getItem('fromCurrency') || 'LKR');
  const [toCurrency, setToCurrency] = useState(localStorage.getItem('toCurrency') || 'USD');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setCurrencies(Object.keys(data.rates));
      });
  }, [apiUrl]);

  useEffect(() => {
    localStorage.setItem('fromCurrency', fromCurrency);
  }, [fromCurrency]);

  useEffect(() => {
    localStorage.setItem('toCurrency', toCurrency);
  }, [toCurrency]);

  const convertCurrency = () => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const fromRate = data.rates[fromCurrency];
        const toRate = data.rates[toCurrency];
        const conversionResult = (amount / fromRate) * toRate;
        setResult(`${amount} ${fromCurrency} = ${conversionResult.toFixed(2)} ${toCurrency}`);
      });
  };


  
  return (
    <div className="currency-converter-container">
     
      <h2>Currency Converter</h2>
      <label htmlFor="amount">Amount:</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <label htmlFor="from-currency">From:</label>
      <select
        id="from-currency"
        value={fromCurrency}
        onChange={e => setFromCurrency(e.target.value)}
      >
        {currencies.map(currency => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
      <label htmlFor="to-currency">To:</label>
      <select
        id="to-currency"
        value={toCurrency}
        onChange={e => setToCurrency(e.target.value)}
      >
        {currencies.map(currency => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
      <button onClick={convertCurrency}>Convert</button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default CurrencyConverter;
