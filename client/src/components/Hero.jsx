import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white h-[85vh] flex flex-col justify-center items-center text-center"
    >
      <h1 className="text-6xl font-bold">
        Protect Our Rivers
      </h1>

      <p className="text-2xl mt-5">
        AI Powered River Pollution Monitoring
      </p>

      <Link to="/report">
        <button className="mt-8 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:scale-105 duration-300">
          Report Pollution
        </button>
      </Link>
    </section>
  );
}

export default Hero;