import Image from "next/image";
import AddressSearch from "./_components/addressSearchNOMINATIM";
import AddressSearchHERE from "./_components/addressSearchHERE";
import AddressForm from "./_components/addressForm";
import MapSelect from "./_components/mapSelect";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <AddressSearch />
        <AddressSearchHERE />
        <AddressForm />
        <MapSelect />
      </main>
    </div>
  );
}
