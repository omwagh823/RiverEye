function HowItWorks() {
  const steps = [
    "📷 Take a Photo",
    "📍 Select Location",
    "📤 Submit Report",
    "🤖 AI Analysis",
    "🧹 Cleanup Team Responds",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">
          How RiverEye Works
        </h2>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">
                {step}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;