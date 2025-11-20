import { useQueryState } from "nuqs";

export function useSidebarTab() {
  return useQueryState("tab", {
    defaultValue: "dashboard",
  });
}
