import Image from "next/image";

export default function GeographicFeaturePresentation() {
  return (
    <div className="w-[80%] h-auto my-10 flex flex-col items-center [@media(min-width:1050px)]:relative [@media(min-width:1050px)]:h-[90vh]">
      {/* Image */}
      <div className="w-full h-64 relative [@media(min-width:1050px)]:absolute [@media(min-width:1050px)]:top-0 [@media(min-width:1050px)]:right-0 [@media(min-width:1050px)]:w-[85%] [@media(min-width:1050px)]:h-[90%]">
        <Image
          src="/HowToCookHomePage.png"
          alt="Feature Image"
          fill
          className="rounded-lg shadow-2xl border border-neutral object-cover object-left-top"
        />
      </div>

      {/* Texte */}
      <div className="mt-6 flex items-center justify-center text-center py-6 px-6 bg-neutral-600 text-white border border-white font-semibold rounded-3xl max-w-[50vh] [@media(min-width:1050px)]:absolute [@media(min-width:1050px)]:top-1/2 [@media(min-width:1050px)]:left-0 [@media(min-width:1050px)]:mt-0">
        <p>
          Trouvez les{" "}
          <span className="font-bold" style={{ color: "rgb(251, 186, 114)" }}>
            ingrédients aux prix les plus bas
          </span>{" "}
          près de chez vous.
        </p>
      </div>
    </div>
  );
}
