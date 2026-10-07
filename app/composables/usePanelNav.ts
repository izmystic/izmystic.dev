export interface NavPanel {
  id: string;
  count: number;
  open: (index: number) => void;
}

export function usePanelNav(panels: () => NavPanel[]) {
  const focusedId = ref<string>();
  const selection = reactive<Record<string, number>>({});

  const available = () => panels().filter((panel) => panel.count > 0);
  const current = () => {
    const list = available();
    return list.find((panel) => panel.id === focusedId.value) ?? list[0];
  };

  // Clamped because a refetch can shrink a list below its stored selection
  function indexOf(panel: NavPanel) {
    return Math.min(selection[panel.id] ?? 0, panel.count - 1);
  }

  function revealSelection() {
    nextTick(() => document.querySelector("[data-nav-selected]")?.scrollIntoView({ block: "nearest" }));
  }

  function cycle(step: number) {
    const list = available();
    if (!list.length) return;
    const index = list.findIndex((panel) => panel.id === current().id);
    focusedId.value = list[(index + step + list.length) % list.length].id;
    revealSelection();
  }

  function move(step: number) {
    const panel = current();
    if (!panel) return;
    focusedId.value = panel.id;
    selection[panel.id] = (indexOf(panel) + step + panel.count) % panel.count;
    revealSelection();
  }

  useHotkeys([
    { keys: ["Tab"], hint: "tab", label: "focus", run: (event) => cycle(event.shiftKey ? -1 : 1) },
    { keys: ["j", "ArrowDown"], hint: "j/k", label: "move", run: () => move(1) },
    { keys: ["k", "ArrowUp"], run: () => move(-1) },
    {
      keys: ["Enter", "o"],
      hint: "⏎",
      label: "open",
      run: () => {
        const panel = current();
        if (panel) panel.open(indexOf(panel));
      },
    },
  ]);

  const isFocused = (id: string) => current()?.id === id;
  const isSelected = (id: string, index: number) => {
    const panel = current();
    return panel?.id === id && indexOf(panel) === index;
  };

  function select(id: string, index: number) {
    focusedId.value = id;
    selection[id] = index;
  }

  return { isFocused, isSelected, select };
}
