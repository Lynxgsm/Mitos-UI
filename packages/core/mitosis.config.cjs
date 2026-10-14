/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
  files: "src/**",
  exclude: ["src/**/*.test.*", "src/**/*.stories.*"],
  targets: ["react"],
  commonOptions: { typescript: true },
};
