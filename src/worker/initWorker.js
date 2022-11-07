import Worker from "./my.worker.js";

const worker = new Worker();


// 消息转发给页面
worker.addEventListener("message", function ({data:{to,data}}) {
    /**  数据格式
     * to  命名格式：   UI__  加 页面名称
     * data  传递给页面的数据
     */
    window.dispatchEvent(new CustomEvent(to,{
        detail:data
    }))
});
// 消息转发给worker
window.addEventListener('myWorker__',({detail})=>{
    console.log(detail);
    worker.postMessage(detail);
})