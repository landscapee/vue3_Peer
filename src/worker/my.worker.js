import {initEquipmentsSocket,offlineEquipmentsSocket,sengMessage} from './module/equipmentManage'

self.addEventListener('message', ({data:e_data}) => {
    /**   数据格式
     *to  命名格式：   UI__  加 页面名称
     * data  传递给页面的数据
     */
    const typeToFnMap={
        worker__initEquipmentsSocket:initEquipmentsSocket,
        worker__offlineEquipmentsSocket:offlineEquipmentsSocket,
        worker__sengMessage:sengMessage,
    }
    let {data,type} = e_data
    console.log('workerMessage',data,type);

    if(typeToFnMap[type]){
         typeToFnMap[type](data)
     }

})