import type { ThemeId } from "./composables/useTheme";

export default defineAppConfig({
  // Any id from app/utils/themes.ts, e.g. "catppuccin-mocha" or "gruvbox-dark". Visitors who already picked a theme keep theirs.
  defaultTheme: "moonfly-default" satisfies ThemeId,
});
