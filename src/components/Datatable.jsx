import React from 'react';
import { useCountryContext } from '../contexts/CountryContext';

const DataTable = () => {
  const { countries, populationFilter, setPopulationFilter } = useCountryContext();

  const handleFilterChange = (e) => {
    setPopulationFilter(e.target.value);
  };

  const filteredCountries = React.useMemo(() => countries.filter(country => {
    if (!populationFilter) return true;
    const population = country.population;
    const [min, max] = populationFilter.split('-').map(Number);
    return population >= min && (!max || population <= max);
  }), [countries, populationFilter]);

  const headers = countries.length ? Object.keys(countries[0]) : [];

  return (
    <div className="relative flex flex-col gap-5 overflow-x-auto shadow-lg sm:rounded-lg text-center md:text-left w-[360px] md:w-[800px] xl:w-[1200px] max-w-[95%] md:max-w-full xl:max-w-[1200px] max-h-[400px] m-auto">
        <div className="text-center w-full m-0 sticky top-0 right-[50%] filter-bar">
          <label htmlFor="population-filter" className="mr-2">Population Filter:</label>
          <select id="population-filter" className="border-2" value={populationFilter} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="0-1000000">&lt; 1 Million</option>
            <option value="1000000-5000000">1 - 5 Million</option>
            <option value="5000000-10000000">5 - 10 Million</option>
            <option value="10000000-15000000">10 - 15 Million</option>
            <option value="50000000-">&gt; 50 Million</option>
          </select>
        </div>
        <div className="relative flex flex-col gap-5 overflow-x-auto text-center md:text-left w-[360px] md:w-[800px] xl:w-[1200px] md:max-w-full xl:max-w-[1200px] max-h-[400px] m-auto">
          <table className="w-full text-sm text-center text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                  {headers.map(header => (
                    <th key={header} className="px-6 py-3">
                      {header.charAt(0).toUpperCase() + header.slice(1)}
                    </th>
                  ))}
                  </tr>
              </thead>
              <tbody>
              {filteredCountries.map((country) => (
                <tr key={country.name} className="border-b">
                  {Object.entries(country).map(([key, value]) => (
                    <td key={key} className="px-6 py-4 truncate">
                      {key === 'download' ? (
                        <a href={`/api/download/${value}`} download className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-1 rounded">
                          Download
                        </a>
                      ) : value}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
          </table>
        </div>
    </div>
  );
};

export default DataTable;
