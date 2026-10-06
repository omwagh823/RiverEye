function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition duration-300">
      <div className="text-5xl text-blue-600 mb-4">{icon}</div>

      <h2 className="text-2xl font-bold mb-3">
        {title}
      </h2>

      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;