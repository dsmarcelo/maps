'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

interface Address {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
}

export default function AddressForm() {
  const [location, setLocation] = useState(null);
  const [cep, setCep] = React.useState('')
  const [address, setAddress] = React.useState<Address>()

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('🚀 ~ getLocation ~ latitude, longitude:', latitude, longitude);
          setLocation({ latitude, longitude });
          fetchAddress(latitude, longitude); // Fetch address based on coordinates
        },
        (err) => {
          setError('Erro ao obter localização: ' + err.message);
        }
      );
    } else {
      setError('Geolocalização não é suportada pelo seu navegador.');
    }
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      const data = await response.json();
      console.log('🚀 ~ fetchAddress ~ data:', data);
      if (data && data.address) {
        setAddress(data.display_name); // Set full address
      } else {
        setError('Não foi possível encontrar o endereço para essa localização.');
      }
    } catch (err) {
      setError('Erro ao buscar o endereço.');
    }
  };

  const updateFormFields = (data) => {
    console.log('🚀 ~ updateFormFields ~ data.logradouro:', data.logradouro);
    setValue("logradouro", data.logradouro);
    setValue("complemento", data.complemento);
    setValue("bairro", data.bairro);
    setValue("localidade", data.localidade);
    setValue("uf", data.uf);
    setAddress(data)
  };

  async function searchCep() {
    const url = `https://viacep.com.br/ws/${cep}/json/`
    console.log(url)
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      updateFormFields(data)
    }
  }

  useEffect(() => {
    getLocation()
  }, [])


  useEffect(() => {
    if (cep.length > 7) {
      searchCep()
    }
  }, [cep])


  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='container flex flex-col gap-4 bg-slate-900 p-2 rounded-lg'>
      <div className='flex flex-col'>
        <label htmlFor="cep">CEP</label>
        <input
          id="cep"
          {...register("cep", {
            required: true,
            pattern: /^\d{5}-\d{3}$/,
          })}
          type="text"
          placeholder="00000-000"
          className='p-2 rounded-lg bg-slate-200 text-black'
          onChange={(e) => setCep(e.target.value)}
        />
      </div>
      <div className='flex flex-col'>
        <label htmlFor="logradouro">RUA</label>
        <input
          id="logradouro"
          {...register("logradouro", {
            required: true,
          })}
          type="text"
          placeholder="Rua"
          className='p-2 rounded-lg bg-slate-200 text-black'
          onChange={(e) => setCep(e.target.value)}
        />
      </div>
      <div className='flex flex-col'>
        <label htmlFor="complemento">Complemento</label>
        <input
          id="complemento"
          {...register("complemento", {
            required: false,
          })}
          type="text"
          placeholder="Complemento"
          className='p-2 rounded-lg bg-slate-200 text-black'
          onChange={(e) => setCep(e.target.value)}
        />
      </div>
      <div className='flex flex-col'>
        <label htmlFor="bairro">Bairro</label>
        <input
          id="bairro"
          {...register("bairro", {
            required: true,
          })}
          type="text"
          placeholder="Bairro"
          className='p-2 rounded-lg bg-slate-200 text-black'
          onChange={(e) => setCep(e.target.value)}
        />
      </div>
      <div className='flex flex-col'>
        <label htmlFor="localidade">Cidade</label>
        <input
          id="localidade"
          {...register("localidade", {
            required: true,
          })}
          type="text"
          placeholder="Cidade"
          className='p-2 rounded-lg bg-slate-200 text-black'
          onChange={(e) => setCep(e.target.value)}
        />
      </div>
      <div className='flex flex-col'>
        <label htmlFor="uf">UF</label>
        <input
          id="uf"
          {...register("uf", {
            required: true,
          })}
          type="text"
          placeholder="UF"
          className='p-2 rounded-lg bg-slate-200 text-black'
          onChange={(e) => setCep(e.target.value)}
        />
      </div>
      <button type='button' onClick={() => searchCep()} className='p-2 rounded-lg bg-emerald-600'>Search</button>
      <div className='p-2 rounded-lg bg-slate-800 text-white'>
        {address &&
          <div>
            <strong>CEP:</strong> {address.cep}
            <div><strong>Logradouro:</strong> {address.logradouro}</div>
            <div><strong>Complemento:</strong> {address.complemento}</div>
            <div><strong>Bairro:</strong> {address.bairro}</div>
            <div><strong>Cidade:</strong> {address.localidade}</div>
            <div><strong>UF:</strong> {address.uf}</div>
          </div>
        }
      </div>
    </form>
  )
}
