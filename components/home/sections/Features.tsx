import DiscoverFeaturePresentation from "./featuresPresentation/DiscoverFeaturePresentation";
import GeographicFeaturePresentation from "./featuresPresentation/GeographicFeaturePresentation";

export default function Features() {
  return (
    <div className="flex flex-col items-center gap-8 py-8 px-2">
      <h2 className="text-2xl font-bold text-center">
        Découvrer comment cuisiner facilement grâce à nos fonctionnalités
      </h2>
      <DiscoverFeaturePresentation />
      <GeographicFeaturePresentation />
    </div>
  );
}
