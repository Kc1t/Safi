import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Desativa uso de <img>
      "@next/next/no-img-element": "off",

      // Desativa escape obrigatório de '
      "react/no-unescaped-entities": "off",

      // Desativa reclamação de deps no useEffect/useCallback
      "react-hooks/exhaustive-deps": "off",

      // Desativa variáveis não usadas
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Desativa uso de any
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-implicit-any": "off",

      // Ignora diretivas desnecessárias do eslint
      "no-unused-eslint-disable": "off",

      // Desativa sugestão de trocar let por const
      "prefer-const": "off",
    },
  },
];

export default eslintConfig;