/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
  files: "src/**",
  exclude: ["src/**/*.test.*"],
  targets: ["react"],
  commonOptions: { typescript: true },
};
