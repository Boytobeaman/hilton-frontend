const purgecss = require('@fullhuman/postcss-purgecss');
const glob = require('glob');
const path = require('path');

module.exports = {
  plugins: [
    purgecss({
      content: [
        './src/**/*.html',
        './src/**/*.{js,jsx,ts,tsx}',
        // ...glob.sync(`${path.resolve()}/node_modules/antd/es/**/*.css`, {
        //   nodir: true,
        // }),
      ],
      // extractors: [
      //   {
      //     extractor: (content) => content.match(/([a-zA-Z-]+)(?= {)/g) || [],
      //     extensions: ["css"],
      //   },
      // ],
      safelist: {
        greedy: [/^ant-/], //过滤以ant 开头的类名，不用删除ant 的样式，目前还没有办法精准删除antd 中没有用的的css
      },
    }),
  ],
};
