/// <reference types="vite/client" />

// Remove once migrated to shadcn — @chakra-ui/react@2.3.5 lacks exports field for bundler moduleResolution
declare module "@chakra-ui/react";
declare module "@chakra-ui/icons";
declare module "@chakra-ui/anatomy";

interface ImportMetaEnv {
  readonly VITE_API_ENVIRONMENT: string;
  readonly VITE_FIREBASE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
