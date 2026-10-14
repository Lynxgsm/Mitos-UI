import { useSyncExternalStore } from "react";

export type Framework = "react" | "svelte";

// One choice for the whole site: every framework tab follows it, across pages and browser tabs.
const STORAGE_KEY = "mitos-framework";
const listeners = new Set<() => void>();
let chosen: Framework | null = null;

function read(): Framework {
  if (chosen) return chosen;
  try {
    return localStorage.getItem(STORAGE_KEY) === "svelte" ? "svelte" : "react";
  } catch {
    return "react";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    chosen = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function setFramework(framework: Framework) {
  chosen = framework;
  try {
    localStorage.setItem(STORAGE_KEY, framework);
  } catch {
    // storage can be blocked (private mode, policies): the choice still holds for this page
  }
  for (const listener of listeners) listener();
}

// the server can't know the stored choice: it renders React, the client switches after hydration
export function useFramework() {
  return useSyncExternalStore(subscribe, read, () => "react" as const);
}
