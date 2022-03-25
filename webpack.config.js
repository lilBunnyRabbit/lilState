const filename = "lilstate";
const entry = "./src/lilState.js";
const path = require("path").resolve(__dirname, "dist");

module.exports = [
  {
    mode: "production",
    entry,
    output: {
      filename: `${filename}.js`,
      path,
      clean: true,
    },
    optimization: {
      minimize: false,
    },
  },
  {
    mode: "production",
    entry,
    output: {
      filename: `${filename}.min.js`,
      path,
    },
    optimization: {
      minimize: true,
    },
  },
];
