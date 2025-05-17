import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../backend/src/index";

const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3000",
            headers() {
                return {
                    Authorization: "Bearer " + localStorage.getItem("authFinTrack"),
                };
            },
        }),
    ],
});

export default trpc;