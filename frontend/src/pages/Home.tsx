import cycling from '../assets/cycling.jpg'

export default function Home() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-[calc(100vh-160px)] px-8 bg-gradient-to-b from-slate-50 to-slate-100">
      
      {/* Tekst - lijeva strana */}
      <div className="md:w-1/2 text-center md:text-left space-y-6">
        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-800">
          GearShare
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-700">
          Iznajmi sportsku opremu bez brige
        </h2>
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
