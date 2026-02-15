import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import './Dealers.css';
import '../assets/style.css';

const SearchCars = () => {
  const { id } = useParams();
  const root_url = `${window.location.origin}/`;
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const inventory_url = `${root_url}djangoapp/get_inventory/${id}/`;

  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [dealer, setDealer] = useState({});
  const [message, setMessage] = useState('Loading...');

  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedModel, setSelectedModel] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMileage, setSelectedMileage] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');

  const populateMakesAndModels = (carsList, makeValue = 'All') => {
    const uniqueMakes = Array.from(new Set(carsList.map((car) => car.make))).sort();
    setMakes(uniqueMakes);

    const modelSource = makeValue === 'All' ? carsList : carsList.filter((car) => car.make === makeValue);
    const uniqueModels = Array.from(new Set(modelSource.map((car) => car.model))).sort();
    setModels(uniqueModels);
  };

  const fetchDealer = async () => {
    const res = await fetch(dealer_url, { method: 'GET' });
    const retobj = await res.json();
    if (retobj.status === 200) {
      const dealerObjs = Array.from(retobj.dealer);
      setDealer(dealerObjs[0] || {});
    }
  };

  const fetchCars = async () => {
    const res = await fetch(inventory_url, { method: 'GET' });
    const retobj = await res.json();
    if (retobj.status === 200) {
      const carsArr = Array.from(retobj.cars || []);
      setCars(carsArr);
      setAllCars(carsArr);
      populateMakesAndModels(carsArr);
      setMessage(carsArr.length === 0 ? 'No cars found' : '');
    } else {
      setMessage('Unable to load cars');
    }
  };

  const buildUrl = (overrides = {}) => {
    const make = overrides.make ?? selectedMake;
    const model = overrides.model ?? selectedModel;
    const year = overrides.year ?? selectedYear;
    const mileage = overrides.mileage ?? selectedMileage;
    const price = overrides.price ?? selectedPrice;

    const params = new URLSearchParams();
    if (make !== 'All') params.append('make', make);
    if (model !== 'All') params.append('model', model);
    if (year !== 'All') params.append('year', year);
    if (mileage !== 'All') params.append('mileage', mileage);
    if (price !== 'All') params.append('price', price);

    const query = params.toString();
    return query ? `${inventory_url}?${query}` : inventory_url;
  };

  const setCarsmatchingCriteria = async (url, effectiveMake = selectedMake) => {
    const res = await fetch(url, { method: 'GET' });
    const retobj = await res.json();
    if (retobj.status === 200) {
      const filteredCars = Array.from(retobj.cars || []);
      setCars(filteredCars);
      setMessage(filteredCars.length === 0 ? 'No cars found matching criteria' : '');
      populateMakesAndModels(allCars, effectiveMake);
    } else {
      setMessage('Unable to fetch cars for selected criteria');
    }
  };

  const SearchCarsByMake = async (event) => {
    const makeValue = event.target.value;
    setSelectedMake(makeValue);
    setSelectedModel('All');
    const url = buildUrl({ make: makeValue, model: 'All' });
    await setCarsmatchingCriteria(url, makeValue);
  };

  const SearchCarsByModel = async (event) => {
    const modelValue = event.target.value;
    setSelectedModel(modelValue);
    const url = buildUrl({ model: modelValue });
    await setCarsmatchingCriteria(url, selectedMake);
  };

  const SearchCarsByYear = async (event) => {
    const yearValue = event.target.value;
    setSelectedYear(yearValue);
    const url = buildUrl({ year: yearValue });
    await setCarsmatchingCriteria(url, selectedMake);
  };

  const SearchCarsByMileage = async (event) => {
    const mileageValue = event.target.value;
    setSelectedMileage(mileageValue);
    const url = buildUrl({ mileage: mileageValue });
    await setCarsmatchingCriteria(url, selectedMake);
  };

  const SearchCarsByPrice = async (event) => {
    const priceValue = event.target.value;
    setSelectedPrice(priceValue);
    const url = buildUrl({ price: priceValue });
    await setCarsmatchingCriteria(url, selectedMake);
  };

  const reset = async () => {
    setSelectedMake('All');
    setSelectedModel('All');
    setSelectedYear('All');
    setSelectedMileage('All');
    setSelectedPrice('All');
    await fetchCars();
  };

  useEffect(() => {
    fetchDealer();
    fetchCars();
  }, []);

  return (
    <div style={{ margin: '20px' }}>
      <Header />
      <h1 style={{ color: 'black' }}>Cars at {dealer.full_name}</h1>

      <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '15px' }}>
        <label>
          Make
          <select value={selectedMake} onChange={SearchCarsByMake} style={{ marginLeft: '10px' }}>
            <option value='All'>-- All --</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </label>

        <label>
          Model
          <select value={selectedModel} onChange={SearchCarsByModel} style={{ marginLeft: '10px' }}>
            <option value='All'>-- All --</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </label>

        <label>
          Year
          <select value={selectedYear} onChange={SearchCarsByYear} style={{ marginLeft: '10px' }}>
            <option value='All'>-- All --</option>
            <option value='2021'>2021 or newer</option>
            <option value='2022'>2022 or newer</option>
            <option value='2023'>2023 or newer</option>
            <option value='2024'>2024 or newer</option>
            <option value='2025'>2025 or newer</option>
            <option value='2026'>2026 or newer</option>
          </select>
        </label>

        <label>
          Mileage
          <select value={selectedMileage} onChange={SearchCarsByMileage} style={{ marginLeft: '10px' }}>
            <option value='All'>-- All --</option>
            <option value='50000'>Under 50000</option>
            <option value='100000'>50000 - 100000</option>
            <option value='150000'>100000 - 150000</option>
            <option value='200000'>150000 - 200000</option>
            <option value='200001'>Over 200000</option>
          </select>
        </label>

        <label>
          Price
          <select value={selectedPrice} onChange={SearchCarsByPrice} style={{ marginLeft: '10px' }}>
            <option value='All'>-- All --</option>
            <option value='20000'>Under 20000</option>
            <option value='40000'>20000 - 40000</option>
            <option value='60000'>40000 - 60000</option>
            <option value='80000'>60000 - 80000</option>
            <option value='80001'>Over 80000</option>
          </select>
        </label>

        <button onClick={reset}>Reset</button>
      </div>

      <hr />

      {message ? <div>{message}</div> : null}

      {cars.map((car, index) => (
        <div key={`${car.make}-${car.model}-${car.year}-${index}`} style={{ borderBottom: '1px solid lightgray', paddingBottom: '15px', marginBottom: '15px' }}>
          <h2>
            {car.make} {car.model}
          </h2>
          <p>Year: {car.year}</p>
          <p>Mileage: {car.mileage}</p>
          <p>Price: {car.price}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchCars;
