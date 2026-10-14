// Babel ships no types; library.test.ts only uses parse() to read the comments of Mitosis sources.
declare module "@babel/core" {
  export function parse(
    code: string,
    options: object,
  ): { comments?: { value: string; loc?: { start: { line: number } } }[] } | null;
}

declare module "@babel/plugin-syntax-typescript";
