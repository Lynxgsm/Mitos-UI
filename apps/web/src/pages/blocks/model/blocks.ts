import type { ComponentType } from "react";

// Every block is a pair of files in ../blocks: the React one (preview and source) and the Svelte one (source
// only: the site is a React app, the Svelte sources are compiled by component-blocks tests instead).
const components = import.meta.glob<ComponentType>("../blocks/*.tsx", { eager: true, import: "default" });
const sources = import.meta.glob<string>("../blocks/*.tsx", { eager: true, query: "?raw", import: "default" });
const svelteSources = import.meta.glob<string>("../blocks/*.svelte", { eager: true, query: "?raw", import: "default" });

export const CATEGORIES = ["Authentication", "Settings", "Dashboard", "Marketing", "Feedback", "Commerce"] as const;
export type Category = (typeof CATEGORIES)[number];

// Order within a category is the order on the page.
const CATALOG: { id: string; title: string; description: string; category: Category }[] = [
  { id: "login", title: "Sign in", description: "Email and password, remember me, links to reset and sign up.", category: "Authentication" },
  { id: "signup", title: "Sign up", description: "Two-column name fields, password rules and terms.", category: "Authentication" },
  { id: "forgot-password", title: "Forgot password", description: "Email form with a confirmation announced to screen readers.", category: "Authentication" },
  { id: "account-settings", title: "Account settings", description: "Tabs for profile, notifications and a guarded delete.", category: "Settings" },
  { id: "notification-preferences", title: "Notification preferences", description: "Channels, digest frequency and volume in one card.", category: "Settings" },
  { id: "stats-overview", title: "Stats overview", description: "Key numbers with their trend written out.", category: "Dashboard" },
  { id: "team-members", title: "Team members", description: "Members with roles, row actions and an invite button.", category: "Dashboard" },
  { id: "app-sidebar", title: "App sidebar", description: "Side navigation with the current section, next to the content.", category: "Dashboard" },
  { id: "activity-loading", title: "Loading activity", description: "Skeleton rows inside a region marked as busy.", category: "Dashboard" },
  { id: "pricing", title: "Pricing plans", description: "Monthly or yearly toggle and three plans.", category: "Marketing" },
  { id: "faq", title: "FAQ", description: "Frequently asked questions in an accordion.", category: "Marketing" },
  { id: "contact-form", title: "Contact form", description: "Name, email, topic and message, with a confirmation toast.", category: "Marketing" },
  { id: "confirm-delete", title: "Confirm deletion", description: "Alert dialog that asks to type the project name.", category: "Feedback" },
  { id: "share-link", title: "Share link", description: "Read-only link with a copy button and its tooltip.", category: "Feedback" },
  { id: "empty-state", title: "Empty state", description: "What to show before there is anything to show.", category: "Feedback" },
  { id: "checkout", title: "Checkout", description: "Seats, billing period and the order total.", category: "Commerce" },
  { id: "product-card", title: "Product card", description: "Image, price, size and joined purchase buttons.", category: "Commerce" },
];

export const BLOCKS = CATALOG.map((block) => {
  const path = `../blocks/${block.id}.tsx`;
  const sveltePath = `../blocks/${block.id}.svelte`;
  if (!components[path] || !sources[path] || !svelteSources[sveltePath]) {
    throw new Error(`Block "${block.id}" needs ${block.id}.tsx and ${block.id}.svelte in pages/blocks/blocks`);
  }
  return { ...block, Component: components[path], source: sources[path], svelteSource: svelteSources[sveltePath] };
});
