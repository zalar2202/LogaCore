import { defineConfig } from '@logacore/core';
import { plugin as helloWorld } from '@logacore/plugin-hello-world';

export default defineConfig({
  plugins: [helloWorld],
});
