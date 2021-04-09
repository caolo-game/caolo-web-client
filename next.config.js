module.exports = {
  target: "serverless",
  webpack: (config) => {
    config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    return config;
  },
};
