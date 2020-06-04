'use strict'
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

function resolve(dir) {
  return path.join(__dirname, dir)
}
console.log(resolve('/'))
module.exports = {
  publicPath: './',
  outputDir: 'site',
  // webpack 链式配置   默认已经配置好了  node_moudles/@vue
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .end()
  },
  devServer: {
    port: 9666,
    proxy: {
      '/testApi': {
        target: 'http://www.shoe.cn', // 正式环境
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/testApi': '' // 这里理解成用‘/testApi’代替target里面的地址，后面组件中我们掉接口时直接用api代替
        }
      }
    }
  },
  // configureWebpack 是Vue CLI3.0 中用于配置 webpack 插件参数的地方，你在这里设置，会新建或者覆盖 webpack 默认配置。
  // webpack ProvidePlugin 的含义是创建一个全局的变量，使这个变量在 webpack 各个模块内都可以使用。这里的配置含义是创建 '$'、'jQuery'、'window.jQuery' 三个变量指向 jquery 依赖，创建 'Popper' 变量指向 popper.js 依赖。
  configureWebpack: {
    plugins: [
      // new webpack.ProvidePlugin({
      //   $: 'jquery',
      //   jQuery: 'jquery',
      //   'window.jQuery': 'jquery',
      //   Popper: ['popper.js', 'default']
      // })
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, 'site'),
        // Optional - The path your rendered app should be output to.
        // Required - Routes to render.
        // ['/', '/lantu', '/yingjian', '/jiejue', '/kehu', '/hezuo', '/lianxi', '/xinwen', '/xwinfo'],
        routes: ['/', '/lantu', '/yingjian', '/jiejue', '/kehu', '/hezuo'],
        // 这个很重要，如果没有配置这段，也不会进行预编译
        renderer: new Renderer({
          inject: {
            foo: 'bar'
          },
          headless: true,
          // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
          renderAfterDocumentEvent: 'render-event',
          captureAfterTime: 5000
        })
      })
    ]
  }
}
