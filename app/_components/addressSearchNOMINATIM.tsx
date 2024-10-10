'use client'
import React, { useEffect, useState } from 'react'

export default function AddressSearch() {
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
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=5&dedupe=1&countrycodes=BR`
    console.log(url)
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setList(data)
      })
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // search(value);
  };

  return (
    <div className='p-8 space-x-2 bg-slate-200 text-black'>
      <input type="text" placeholder="Enter address" value={query} onChange={handleInputChange} />
      <button type='button' className='p-2 rounded-md bg-emerald-600' onClick={() => search(query)}>Search</button>
      {list &&
        <ul className='flex flex-col gap-2'>
          {list.map((item, i) => (
            <div key={i} className='bg-slate-300 p-2 rounded-lg'>
              {item.display_name}
              {item.address.suburb && <div><strong>Quadra:</strong> {item.address.suburb}</div>}
              {item.address.house_number && <div><strong>Lote:</strong> {item.address.house_number}</div>}
            </div>
          ))}
        </ul>
      }
    </div>
  )
}
