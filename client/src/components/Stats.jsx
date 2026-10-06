function Stats() {
  const stats = [
    { number: "1250+", label: "Reports Submitted" },
    { number: "18", label: "Rivers Covered" },
    { number: "500+", label: "Volunteers" },
    { number: "2.5 Tons", label: "Plastic Removed" },
  ];

  return (
    <section className="bg-blue-700 text-white py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          RiverEye Impact
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-blue-600 rounded-xl p-6 shadow-lg hover:scale-105 transition"
            >
              <h3 className="text-4xl font-bold">{item.number}</h3>
              <p className="mt-3">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;