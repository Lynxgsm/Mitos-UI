// Framework-agnostic toast queue: plain TypeScript, so every Mitosis target shares it as-is.
// One queue per page (module singleton). Each <Toaster /> shows the toasts addressed to its name: usually a
// single unnamed Toaster shows them all; a named one (a preview, a panel) only shows the toasts sent to it.

export type ToastVariant = "default" | "destructive";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss. `Infinity` keeps it until dismissed. */
  duration?: number;
  /** A toast with an action never auto-dismisses: the user must get time to act (WCAG 2.2.1). */
  action?: { label: string; onClick: () => void };
  /** Name of the Toaster that shows it; without it, the unnamed Toaster does. */
  toaster?: string;
};

export type Toast = ToastOptions & { id: number };

export const DEFAULT_TOAST_DURATION = 5000;

type Timer = { remaining: number; startedAt: number; handle?: ReturnType<typeof setTimeout> };

let toasts: Toast[] = [];
let nextId = 1;
let paused = false;
const timers = new Map<number, Timer>();
const listeners = new Set<(toasts: Toast[]) => void>();

function emit() {
  for (const listener of listeners) listener(toasts);
}

function start(id: number) {
  const timer = timers.get(id);
  if (!timer) return;
  timer.startedAt = Date.now();
  timer.handle = setTimeout(() => dismissToast(id), timer.remaining);
}

export function toast(options: ToastOptions): number {
  const id = nextId++;
  toasts = [...toasts, { ...options, id }];
  const duration = options.duration ?? DEFAULT_TOAST_DURATION;
  if (!options.action && Number.isFinite(duration)) {
    timers.set(id, { remaining: duration, startedAt: 0 });
    if (!paused) start(id);
  }
  emit();
  return id;
}

export function dismissToast(id: number) {
  const timer = timers.get(id);
  if (timer?.handle) clearTimeout(timer.handle);
  timers.delete(id);
  if (!toasts.some((t) => t.id === id)) return;
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function dismissAllToasts() {
  for (const t of toasts) dismissToast(t.id);
}

/** Hover or keyboard focus on the toasts: freeze every countdown (WCAG 2.2.1). */
export function pauseToasts() {
  if (paused) return;
  paused = true;
  for (const timer of timers.values()) {
    if (!timer.handle) continue;
    clearTimeout(timer.handle);
    timer.handle = undefined;
    timer.remaining -= Date.now() - timer.startedAt;
  }
}

export function resumeToasts() {
  if (!paused) return;
  paused = false;
  for (const id of timers.keys()) start(id);
}

export function subscribeToasts(listener: (toasts: Toast[]) => void) {
  listeners.add(listener);
  listener(toasts);
  return () => {
    listeners.delete(listener);
  };
}
