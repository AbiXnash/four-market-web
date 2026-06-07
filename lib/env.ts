import { loadEnvConfig } from "@next/env";

if (typeof window === "undefined") {
  loadEnvConfig(process.cwd());
}
