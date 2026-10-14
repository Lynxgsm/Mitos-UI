// Mitosis' JSX types predate the `inert` attribute; React 19 (our peer) supports it natively.
declare module "@builder.io/mitosis/jsx-runtime" {
  namespace JSX {
    interface HTMLAttributes<T> {
      inert?: boolean;
    }
  }
}

export {};
