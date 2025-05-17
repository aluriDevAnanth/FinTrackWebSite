import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <div>
        <p className="w-[100vw] mt-20 text-2xl font-bold text-center">
          Welcome to FinTrack!!!
        </p>
      </div>
    </>
  );
}
