import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  {
    ignores: ["dist/**", ".netlify/**", ".tanstack/**", "src/routeTree.gen.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // This codebase loads localStorage-backed state inside useEffect on
      // purpose (see AGENTS.md, "Browser Storage"): reading it during render
      // would cause hydration mismatches. That is exactly what
      // react-hooks/set-state-in-effect flags, so it stays off here.
      "react-hooks/set-state-in-effect": "off",
    },
  },
);
