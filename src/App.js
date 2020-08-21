import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Card,
  CardContent,
  MenuItem,
  Select
} from '@material-ui/core';
import './App.css';
import { sortData } from './utils';
import LineGraph from './LineGraph';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios.get('https://disease.sh/v3/covid-19/all').then(({ data }) => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await axios
        .get('https://disease.sh/v3/covid-19/countries')
        .then(({ data }) => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async event => {
    const countryCode = event.target.value;

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await axios.get(url).then(({ data }) => {
      setCountry(countryCode);
      setCountryInfo(data);
    });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
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

        <div className="app_stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
        </CardContent>
        <LineGraph maintainAspectRatio={false} />
      </Card>
    </div>
  );
}

export default App;
