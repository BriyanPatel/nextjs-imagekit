import { FlatCompat } from "@eslint/eslintrc";
import checkFile from "eslint-plugin-check-file";
import drizzle from "eslint-plugin-drizzle";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "check-file": checkFile,
      drizzle,
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/components/ui/**",
      "src/lib/utils.ts",
    ],
  },
];

export default eslintConfig;
