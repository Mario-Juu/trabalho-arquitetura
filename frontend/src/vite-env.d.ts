/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_PEDIDOS_API_URL?: string;
  readonly VITE_TRANSACOES_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
