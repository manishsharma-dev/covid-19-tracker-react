import React, {useState, useEffect} from 'react';
import './App.css';
import Infobox from './InfoBox';
import { sortData } from "./util";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from "@material-ui/core";
import CovidMap from './CovidMap';
import Table from './Table';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then(data => {      
      setCountryInfo(data);
    })
  },[])

  useEffect(() => {
   const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
          .then((response) => response.json())
          .then((data) => {
            const countries = data.map((country) =>(
              {
              name : country.country,
              value : country.countryInfo.iso2
            }
            ));
            const sortedData = sortData(data); 
            setTableData(sortedData);
            setCountries(countries);
          });
   }
   getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === "worldwide" ?
      "https://disease.sh/v3/covid-19/all" :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`

      await fetch(url)
          .then((response) => response.json())
          .then(data => {
            setCountry(countryCode);
            setCountryInfo(data);
            console.log(data.countryInfo.lat, data.countryInfo.long);
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(4);
          })
  };
  return (
    <div className="app"> 
    <div className="app__left">
    <div className="app__header">
    <h1>Covid-19 Tracker</h1> 
    <FormControl className="app__dropdown">
    <Select
        variant="outlined"
        value={country}
        onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
    </FormControl>
    </div>
    
    <div className="app__stats">
    <Infobox 
    title="Coronavirus cases" 
    cases={countryInfo.todayCases} 
    total={countryInfo.cases} />

    <Infobox 
    title="Recovered" 
    cases={countryInfo.todayRecovered} 
    total={countryInfo.recovered} />

    <Infobox 
    title="Deaths" 
    cases={countryInfo.todayDeaths} 
    total={countryInfo.deaths} />     
    </div>   

    {/* Map */}
    <CovidMap center = {mapCenter}
    zoom = {mapZoom} />
    </div>  
    <Card className="app__right">
    <CardContent>
      <h3>Live Cases by Country</h3>
        <Table countries = {tableData} />        
      <h3>Worldwide new cases</h3>
      <LineGraph />
    </CardContent>
    </Card>
    </div>
  );
}

export default App;
