import {createApp} from 'vue'
import App from './src/App.vue'
import router from './src/router/index'
import store from './src/store/index'
import {registerIconSvg} from '@/icons/index'
import MyTable from '@/components/myTable'
import '@/worker/initWorker'
import core from '@/common/core'
import request from '@/lib/axios'
let app = createApp(App);
// app.config.globalProperties.$Core = core
app.config.globalProperties.$axios = request
app.config.globalProperties.$sendMessage = (type,data)=>{
    window.dispatchEvent(new CustomEvent('myWorker__',{
        detail:{
            type:type,
            data
        }
    }))
}
app.component('my-table', MyTable)
app.use(router)
app.use(store)
registerIconSvg(app)
router.isReady().then(() => app.mount('#app'))
