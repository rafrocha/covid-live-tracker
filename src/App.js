import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Card,
  CardContent,
  MenuItem,
  Select
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import './App.css';
import { sortData } from './utils';
import LineGraph from './LineGraph';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  const useStyles = makeStyles({
    option: {
      fontSize: 15,
      '& > span': {
        marginRight: 10,
        fontSize: 20
      }
    }
  });

  const classes = useStyles();

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
            value: country.countryInfo.iso3,
            flag: country.countryInfo.flag
          }));
          countries.push({
            name: 'Worldwide',
            value: 'Worldwide',
            flag:
              'https://cdn2.iconfinder.com/data/icons/pittogrammi/142/39-512.png'
          });
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e, country) => {
    const countryCode = (country && country.value) || 'Worldwide';
    const url =
      countryCode === 'Worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await axios.get(url).then(({ data }) => {
      if (countryCode === 'Worldwide') {
        setMapZoom(2);
      } else {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(3);
      }
      setCountry(countryCode);
      setCountryInfo(data);
    });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <Autocomplete
            id="country-select"
            className="app__dropdown"
            style={{ width: 300 }}
            options={countries}
            classes={{
              option: classes.option
            }}
            autoHighlight
            onChange={onCountryChange}
            getOptionLabel={option => option.name}
            renderOption={option => (
              <>
                <span>
                  <img src={option.flag} alt="" width="20" height="20" />
                </span>
                {option.name}
              </>
            )}
            renderInput={params => (
              <TextField
                {...params}
                label="Choose a country"
                variant="outlined"
                inputProps={{
                  ...params.inputProps
                  // autoComplete: 'new-password' // disable autocomplete and autofill
                }}
              />
            )}
          />
        </div>

        <div className="app__stats">
          <InfoBox
            active={casesType === 'cases'}
            isRed
            onClick={() => setCasesType('cases')}
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            active={casesType === 'recovered'}
            isGreen
            onClick={() => setCasesType('recovered')}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            active={casesType === 'deaths'}
            isOrange
            onClick={() => setCasesType('deaths')}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph
            casesType={casesType}
            className="app__graph"
            country={country}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
