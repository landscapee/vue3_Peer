import {map} from 'lodash';
import {mySocket} from '@/lib/socket'
const socketMap={}
export const initEquipmentsSocket =(list)=>{
    map(list,k=>{
        if(k.status===0){
            return
        }
        if(socketMap[k.code]?.socket){
            socketMap[k.code].socket.close()
        }
        socketMap[k.code]= mySocket(k.ipPort)
        socketMap[k.code].socket.onmessage=({data})=>{
            // console.log('message',JSON.parse(data));
            self.postMessage({
                to:'UI__EquipmentMessage'+k.code,
                data:JSON.parse(data)
            })
            socketMap[k.code].heartCheck.start()
        }
    })
}
export const offlineEquipmentsSocket =(list)=>{
    map(list,k=>{
        if(socketMap[k.code]?.socket){
            let fn=()=>{}
            socketMap[k.code].socket.onerror=fn
            socketMap[k.code].socket.onclose=fn
            socketMap[k.code].socket.close()
        }
    })
}
export const sengMessage =({code,data})=>{
    let socket=socketMap[code]?.socket
    console.log('send',code, data,socket.readyState);
    // socket.readyState==1 表示已连接状态
    if(socket&&socket.readyState==1){
        socketMap[code].socket.send(data)
    }
}
