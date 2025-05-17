import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "../components/Header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="px-10">
        <Header />
      </div>
      <Outlet />
      {/* <TanStackRouterDevtools />
      <ReactQueryDevtools /> */}
    </>
  );
}
