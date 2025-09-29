import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { createHtmlPlugin } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'  //便于使用组件名
import { resolve } from 'path'

const name = 'vue3后台管理系统'
// 获取环境变量
const buildMode = process.env.VITE_BUILD_MODE || 'app'
const isLib = buildMode === 'lib'

const baseConfig:any = {
  server: {
    host: '0.0.0.0'
  },
  plugins: [
    vue(),
    vueSetupExtend(),
    eslintPlugin({
      include: [ 'src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue' ],
      exclude: [ 'node_modules', 'dist' ]
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: name
        }
      }
    }),
    AutoImport({
      imports: [
        // 需要自动导入的插件，自定义导入的API
        'vue',
        'vue-router',
        'pinia'
      ],
      dts: true
    }),
    ElementPlus({
      // options
      useSource: true
    })
  ],
  
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [ 'legacy-js-api' ]
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 路径别名
    },
    extensions: [ '.js', '.json', '.ts' ]
  }
}
const libConfig = {
  build: {
    target: 'esnext',
    lib: {
      // src/indext.ts 是我们导出组件的地方
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'toolite',
      // 运行构建时输出文件的名称
      fileName: 'index'
    },
    rollupOptions: {
      // 确保外部依赖项不应捆绑到你的库中
      external: [ 'vue', 'element-plus', '@element-plus/icons-vue', /element-plus/ ],
      output: {
        exports: 'named',
        // 提供全局变量以便在 UMD 构建中可以被外部依赖项使用
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        }
      }
    }
  }
}
const appConfig = {
  build: {
    outDir: 'dist-app'
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  ...isLib ? libConfig : appConfig
})
