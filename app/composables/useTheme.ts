export const DEFAULT_THEME = "github-dark";

type Theme = (typeof themes)[number];

function isLight(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 128;
}

export function useTheme() {
  const themeId = useCookie<string>("theme", {
    default: () => DEFAULT_THEME,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const theme = computed<Theme>(
    () =>
      themes.find((t) => t.id === themeId.value) ??
      themes.find((t) => t.id === DEFAULT_THEME),
  );

  return { themeId, theme };
}

// Applied as inline vars on <html> so the server renders the chosen theme and there's no flash on load
export function useThemeStyle() {
  const { theme } = useTheme();

  useHead({
    htmlAttrs: {
      style: computed(() => {
        const { bg, fg, red, green, yellow, magenta, cyan } = theme.value.colors;
        return [
          `--color-bg: ${bg}`,
          `--color-fg: ${fg}`,
          `--color-accent: ${red}`,
          `--color-green: ${green}`,
          `--color-yellow: ${yellow}`,
          `--color-magenta: ${magenta}`,
          `--color-cyan: ${cyan}`,
          `color-scheme: ${isLight(bg) ? "light" : "dark"}`,
        ].join("; ");
      }),
    },
  });
}
