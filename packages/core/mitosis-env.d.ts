// Mitosis' JSX types lag behind the DOM; React 19 (our peer) supports all of these natively.
declare module "@builder.io/mitosis/jsx-runtime" {
  namespace JSX {
    interface HTMLAttributes<T> {
      inert?: boolean;
    }
    interface InputHTMLAttributes<T> {
      // compiled to defaultChecked in React and to an unbound checked attribute in Svelte (mitosis.config.cjs)
      defaultChecked?: boolean;
    }
    interface DialogHtmlAttributes<T> {
      onCancel?: (event: Event) => void;
      onClose?: (event: Event) => void;
    }
  }
}

export {};
