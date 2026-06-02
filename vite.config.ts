import { defineConfig, loadEnv } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  // Загружаем переменные из .env без префикса VITE_
  const env = loadEnv(mode, process.cwd(), "");

  // На WAMP:  PHP_SERVER=http://localhost/chpinterest
  // На Linux: PHP_SERVER=http://localhost:8000   (php -S localhost:8000 -t .)
  const phpServer = "c:\\wamp64\\bin\\php\\php8.2.0\\php.exe - S 127.0.0.1:8000";

  return {
    plugins: [figmaAssetResolver(), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    assetsInclude: ["**/*.svg", "**/*.csv"],
    server: {
      proxy: {
        // API-запросы → PHP-сервер
        "/api": {
          target: phpServer,
          changeOrigin: true,
        },
        // Загруженные изображения → PHP-сервер
        "/assets/uploads": {
          target: phpServer,
          changeOrigin: true,
        },
      },
    },
  };
});
