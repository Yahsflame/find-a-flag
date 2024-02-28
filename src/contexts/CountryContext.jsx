import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CountryContext = createContext();

export const useCountryContext = () => useContext(CountryContext);

export const CountryProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [populationFilter, setPopulationFilter] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      const formattedData = data.map(country => ({
        name: country.name.common,
        population: country.population,
        capital: country.capital ? country.capital[0] : 'Unknown',
        flag: country.flag,
        download: country.flags.png
      }));
      setCountries(formattedData);
    };

    fetchCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      if (!populationFilter) return true;
      const population = country.population;
      const [min, max] = populationFilter.split('-').map(Number);
      return population >= min && (!max || population <= max);
    });
  }, [countries, populationFilter]);

  const value = {
    countries: filteredCountries,
    setPopulationFilter,
    populationFilter
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
};
