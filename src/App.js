import React, {useState, useEffect} from 'react';
import './App.css';
import Infobox from './InfoBox';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from "@material-ui/core";
import Map from './Map';
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});

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
          })
  };
console.log("Country Info ", countryInfo);
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
    <Infobox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />

    <Infobox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />

    <Infobox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />     
    </div>   

    {/* Map */}
    <Map />
    </div>  
    <Card className="app__right">
    <CardContent>
      <h3>Live Cases by Country</h3>

      <h3>Worldwide new cases</h3>
    </CardContent>
    </Card>
    </div>
  );
}

export default App;
