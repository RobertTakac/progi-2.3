//uvoz slike iz mape src/assets
import cycling from '../assets/cycling.jpg'

//pocetna stranica aplikacije
export default function Home() {
  return (  //sve unutar returna ce se prikazati korisniku u pregledniku
    //koristi se Tailwind css da se slozi izgled
    //flex layout: na mobitelu stupac, flex-col, na vecim ekranima red md:flex-row
    //poravnanje: items-centar vertikalno, justify-between, centrira sadrzaj
    //visina: min-h = skoro cijeli ekran - header i footer
    //padding px-8, unutarnji razmaci desno i lijevo
    //pozadina svijetlo siva do jos svjetlija
    <section className="flex flex-col md:flex-row items-center justify-between min-h-[calc(100vh-160px)] px-8 bg-gradient-to-b from-slate-50 to-slate-100">
      
      {/* Tekst - lijeva strana */} 
      {/* sirina na vecim ekranima zauzima pola 
      poravnanje teksta na mobitelu centar, na vecim ekranima lijevo
      vertikalni razmak medju elementima space-y-6*/}
      <div className="md:w-1/2 text-center md:text-left space-y-6">
        {/*glavni naslov aplikacije*/}
        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-800">
          GearShare
        </h1>
        {/*podnaslov*/}
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-700">
          Iznajmi sportsku opremu bez brige
        </h2>
        {/*kratki opis*/}
        <p className="max-w-xl text-lg text-slate-600">
          Pronađi, rezerviraj i preuzmi sezonsku sportsku opremu na jednom mjestu.<br />
          Jednostavno, brzo i sigurno – bilo da si klijent ili trgovac.
        </p>
      </div>


      {/* Slika - desna strana */}
      <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img
            src={cycling}
            alt="Cikliranje - iznajmi sportsku opremu"
            className="w-3/4 max-w-sm rounded-2xl shadow-lg object-cover"
          />
      </div>
    </section>
  )
}
