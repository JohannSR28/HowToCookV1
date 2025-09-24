import ThemeButton from "./ThemeButton";
import GobackButton from "./GobackButton";

export default function PageTitle({ title }: { title: string }) {
  return (
    <div className="relative flex items-center justify-between p-4 mb-5">
      <GobackButton />
      <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg">
        {title}
      </h1>
      <div className="w-8">
        <ThemeButton />
      </div>
    </div>
  );
}
