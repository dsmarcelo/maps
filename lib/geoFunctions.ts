export async function latLongToAddress({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat}%2C${lng}&lang=pt-BR&apiKey=Gcy440MYwjzGdDM_JrXxDLDMhaIilP6IhwJMOEnnUk0`;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    console.log(data[0].title);
    return data[0];
  }
}
