<template>
  <div>
    <h2 style="text-align: center; font: 40px">Error Example</h2>
    <div class="img-container"></div>
    <button @click="onClickImageError">触发图片资源加载错误</button>
    <br />
    <button @click="onClickPromiseError">触发 promise rejected</button>
    <br />
    <button @click="onClickJSError">触发 JS 运行时错误</button>
    <br />
    <button @click="onClickThrowError">触发 throw 错误</button>
    <br />
    <button @click="onClickFectchError">触发网络请求错误</button>
  </div>
</template>
<script>
  import { handleError } from '../../error-manager/error-handler'

  export default {
    created() {
      throw 'this is vue error'
    },
    methods: {
      onClickImageError() {
        const img = document.createElement('img')
        const imgEle = document.querySelector('.img-container')
        img.src = 'text.png'
        img.alt = '图片加载失败'
        imgEle.appendChild(img)
      },
      onClickPromiseError() {
        new Promise(() => {
          throw 'this is a error'
        })
      },
      onClickJSError() {
        const a = null
        a.b()
      },
      onClickThrowError() {
        throw 'this is a error'
      },
      onClickFectchError() {
        handleError(fetch('http://error.example'))
      }
    }
  }
</script>
