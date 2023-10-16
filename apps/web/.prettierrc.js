var base = require("config/prettier.config");

module.exports = {
  ...base,
  plugins: [...(base.plugins || []), "prettier-plugin-tailwindcss"],
};
