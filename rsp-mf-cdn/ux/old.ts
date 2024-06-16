import { defineConfig } from '@rsbuild/core';
import { CssExtractRspackPlugin } from '@rspack/core';
import { pluginVue2 } from '@rsbuild/plugin-vue2';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  tools: {
    rspack: {
      plugins: [
        pluginVue2(),
        pluginSass(),
        new CssExtractRspackPlugin(), // Ensure this is initialized correctly
      ],
    },
  },
});
