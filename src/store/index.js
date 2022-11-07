 import { createStore } from 'vuex'
 import getters from './getters'
 import pageControl from './module/pageControl';
 import globalData from './module/globalData';
const store =createStore({
    modules:{
        pageControl,
        globalData
    },
    getters
})

export default store
