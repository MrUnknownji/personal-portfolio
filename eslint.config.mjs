import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "next-env.d.ts",
      "pnpm-lock.yaml",
    ],
  },
  ...nextCoreWebVitals,
];

export default eslintConfig;
