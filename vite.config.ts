import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    define: {
      "process.env.REACT_APP_API_ENVIRONMENT": JSON.stringify(env.VITE_API_ENVIRONMENT),
    },
  };
});
