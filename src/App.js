import React, { useState, useEffect } from 'react';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import './App.css';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  useEffect(() => {
    const getCountriesData = async () => {
      await axios
        .get('https://disease.sh/v3/covid-19/countries')
        .then(({ data }) => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
  const onCountryChange = async event => {
    const countryCode = event.target.value;
    console.log(countryCode);
    setCountry(countryCode);
  };
  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID 19 TRACKER</h1>

        <FormControl className="app__dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            <MenuItem key="worldwide" value="worldwide">
              Worldwide
            </MenuItem>
            {countries.map(country => (
              <MenuItem key={country.name} value={country.value}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Header */}
      {/* Title + Select input dropdown field */}

      {/* InfoBoxes */}
      {/* InfoBoxes */}
      {/* InfoBoxes */}

      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>
  );
}

export default App;
