import FeatureCard from "./FeatureCard";

import {
  FaRobot,
  FaMapMarkedAlt,
  FaGift,
  FaUsers,
  FaCamera,
  FaLeaf,
} from "react-icons/fa";

function Features() {
  return (
    <section className="py-20 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-12">
        Why Choose RiverEye?
      </h1>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-8">
        <FeatureCard
          icon={<FaRobot />}
          title="AI Detection"
          description="Automatically detect plastic waste using AI."
        />

        <FeatureCard
          icon={<FaMapMarkedAlt />}
          title="Live Maps"
          description="View pollution reports on an interactive map."
        />

        <FeatureCard
          icon={<FaGift />}
          title="Reward Points"
          description="Earn rewards by reporting verified pollution."
        />

        <FeatureCard
          icon={<FaUsers />}
          title="Community"
          description="Work together with volunteers and NGOs."
        />

        <FeatureCard
          icon={<FaCamera />}
          title="Easy Reporting"
          description="Upload pollution photos in seconds."
        />

        <FeatureCard
          icon={<FaLeaf />}
          title="Save Nature"
          description="Help create cleaner rivers for everyone."
        />
      </div>
    </section>
  );
}

export default Features;