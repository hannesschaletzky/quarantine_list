import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  {
    // Neue React-Compiler-Regeln. Der alte Code liest refs beim Rendern und setzt State im Effect.
    // Bewusst nicht umgebaut, damit sich an der Logik nichts ändert.
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-location-assign-relative-destination": "off",
    },
  },
];

export default config;
