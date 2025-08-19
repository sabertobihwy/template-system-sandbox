import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 先展开 next 的推荐配置
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 再加你自己的规则覆盖
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
export default eslintConfig;
