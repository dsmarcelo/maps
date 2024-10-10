'use client'
import React, { useEffect, useState } from 'react'

export default function AddressSearchHERE() {
  const [query, setQuery] = React.useState('')
  const [list, setList] = React.useState([])
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000); // 1000 ms = 1 segundo

    // Cleanup do timeout caso o usuário continue digitando
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery]);

  async function search(searchQuery) {
    // const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=5&dedupe=1&countrycodes=BR`
    const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(searchQuery)}&in=countryCode:BRA&lang=pt-BR&apiKey=Gcy440MYwjzGdDM_JrXxDLDMhaIilP6IhwJMOEnnUk0`
    console.log(url)
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setList(data.items)
      })
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // search(value);
  };

  return (
    <div className='p-8 space-x-2 bg-slate-200 text-black'>
      <input className='p-4' type="text" placeholder="Enter address" value={query} onChange={handleInputChange} />
      <button type='button' className='p-2 rounded-md bg-emerald-600' onClick={() => search(query)}>Search</button>
      {list &&
        <ul className='flex flex-col gap-2'>
          {list.map((item, i) => (
            <div key={i} className='bg-slate-300 p-2 rounded-lg'>
              {item.title}
            </div>
          ))}
        </ul>
      }
    </div>
  )
}
