// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // 配置HTML元素自闭合规则 - 关闭自闭合检查
      "vue/html-self-closing": "off",
    },
  }
);
