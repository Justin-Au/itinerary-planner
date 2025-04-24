import express from "express";
import { env } from "./env";

export function app() {
  const server = express();

  server.get("/health-check", (_, res) => {
    res.json({
      status: "health",
    });
  });

  const port = env.PORT ?? "5000";

  server.listen(port, () => {
    console.log("express server started on port " + port);
  });
}
