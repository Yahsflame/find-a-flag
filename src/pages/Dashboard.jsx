import React from 'react';
import DataTable from "../components/Datatable";
import BarChart from '../components/BarChart';
import { useCountryContext } from '../contexts/CountryContext';

const Dashboard = () => {
  const { countries } = useCountryContext();
  return (
    <>
      {
        countries === null ? (
          <div>Loading...</div>
        ) : (
          <>
            <h1 className='text-center text-lg lg:text-4xl'>Welcome to the Flag Finder 3000!</h1>
            <DataTable />
            <BarChart />
          </>
        )
      }
    </>
  );
}

export default Dashboard;
