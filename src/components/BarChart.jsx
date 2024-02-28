import React, { useState, useEffect, useMemo } from 'react';
import { useCountryContext } from '../contexts/CountryContext';

const BarChart = () => {
  const { countries } = useCountryContext();
  const [selectedCountries, setSelectedCountries] = useState(() => {
    return countries.length >= 2 ? [countries[0].name, countries[1].name] : ['', ''];
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (countries.length >= 2 && !selectedCountries.every(name => countries.find(c => c.name === name))) {
      setSelectedCountries([countries[0].name, countries[1].name]);
    }
  }, [countries]);

  const handleCountryChange = (index, newName) => {
    const updatedCountries = [...selectedCountries];
    updatedCountries[index] = newName;

    const duplicate = updatedCountries[0] === updatedCountries[1];
    setErrorMessage(duplicate ? 'Error: The same country has been selected twice. Please select different countries.' : '');

    setSelectedCountries(updatedCountries);
  };

  const selectedCountryObjects = useMemo(() => selectedCountries.map(name => 
    countries.find(country => country.name === name)
  ), [selectedCountries, countries]);

  const maxPopulation = useMemo(() => Math.max(...selectedCountryObjects.map(country => country?.population || 0)), [selectedCountryObjects]);

  return (
     <div className='text-center md:text-left w-[360px] md:w-[800px] xl:w-[1200px] max-w-[95%] md:max-w-full xl:max-w-[1200px] max-h-[400px] m-auto'>
      <div className="flex justify-between mb-4">
        <div className="flex-1 mr-2">
          <select
            value={selectedCountries[0]}
            onChange={(e) => handleCountryChange(0, e.target.value)}
            className="p-2 rounded border w-full"
            aria-label="Select country 1"
          >
            {countries.map(country => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 ml-2">
          <select
            value={selectedCountries[1]}
            onChange={(e) => handleCountryChange(1, e.target.value)}
            className="p-2 rounded border w-full"
            aria-label="Select country 2"
          >
            {countries.map(country => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMessage && <div className="text-red-500" aria-live="assertive">{errorMessage}</div>}

      <div className="flex flex-col space-y-4 w-full">
        {selectedCountryObjects.map((country, index) => country && (
          <div key={index} className="flex items-center">
            <div className="text-sm font-semibold w-32">{country.name}</div>
            <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700">
              <div
                className={`${index % 2 === 0 ? 'bg-green-600' : 'bg-blue-600'} h-6 rounded-full`}
                style={{ width: `${(country.population / maxPopulation) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm font-semibold ml-2">{country.population.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
