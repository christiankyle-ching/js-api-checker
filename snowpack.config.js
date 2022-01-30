// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    // Mount src to /
    src: "/",
    // Mount public folder to /_
    public: {
      url: "/_",
      static: true,
    },
  },
  plugins: [
    /* ... */
    [
      "@snowpack/plugin-babel",
      {
        input: [".js", ".mjs", ".jsx", ".ts", ".tsx"], // (optional) specify files for Babel to transform
        transformOptions: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  ie: "11",
                },
                modules: false,
              },
            ],
          ],
        },
      },
    ],
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
