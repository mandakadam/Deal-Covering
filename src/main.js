import configLoader from "config.js"

configLoader(function (config) {
  window.config = config;
  return import("./bootstrap");
});