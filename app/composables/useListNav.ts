export function useListNav(count: () => number, open: (index: number) => void) {
  const selected = ref(0);

  function move(step: number) {
    const total = count();
    if (!total) return;
    selected.value = (selected.value + step + total) % total;
  }

  useHotkeys([
    {
      keys: ["j", "ArrowDown"],
      hint: "j/k",
      label: "move",
      run: () => move(1),
    },
    { keys: ["k", "ArrowUp"], run: () => move(-1) },
    {
      keys: ["Enter", "o"],
      hint: "⏎",
      label: "open",
      run: () => count() && open(selected.value),
    },
  ]);

  return selected;
}
