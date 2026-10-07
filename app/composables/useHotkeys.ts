export interface Hotkey {
  keys: string[];
  run: (event: KeyboardEvent) => void;
  label?: string;
  hint?: string;
}

interface HotkeyHint {
  id: string;
  key: string;
  label: string;
}

export function useHotkeyHints() {
  return useState<HotkeyHint[]>("hotkey-hints", () => []);
}

export function useHotkeys(bindings: Hotkey[]) {
  const id = useId();
  const hints = useHotkeyHints();

  function onKeydown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("input, textarea, select, [contenteditable]")) return;
    // A focused link or button already acts on Enter natively; handling it too would open things twice
    if (event.key === "Enter" && target?.closest("a, button")) return;

    const binding = bindings.find((b) => b.keys.includes(event.key));
    if (!binding) return;
    event.preventDefault();
    binding.run(event);
  }

  // Registered on mount rather than in setup: the shell's key bar renders before async page setups finish on the server, so SSR'd hints would never match the client
  onMounted(() => {
    window.addEventListener("keydown", onKeydown);
    hints.value = [
      ...hints.value,
      ...bindings
        .filter((binding) => binding.label)
        .map((binding) => ({
          id,
          key: binding.hint ?? binding.keys[0],
          label: binding.label,
        })),
    ];
  });
  onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeydown);
    hints.value = hints.value.filter((hint) => hint.id !== id);
  });
}
