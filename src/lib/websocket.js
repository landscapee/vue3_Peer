// tcp client class for xml communication ---------------------------------------
'use strict'
// import {map} from 'lodash'
class Client {
    constructor(equipmengList){
         this.sockets = null
        this.init(equipmengList)
    }
    init( equipmengList) {
        this.sockets={}
        map(equipmengList,k=>{
            this.socket=new WebSocket('ws://192.168.0.92')
            
            if( this.socket){
                this.socket.addEventListener('message',data=>{
                    console.log(k.no,'message',data);
                });
                this.socket.addEventListener('close',data=>{
                    console.log(k.no,'close',data);
                });
                this.socket.addEventListener('err',data=>{
                    console.log(k.no,'err',data);
                })
                this.socket.addEventListener('open',data=>{
                    console.log(k.no,'open',open);
                })

            }
        })

    }


}
class MySocket {
    constructor(params,fn){
         this.socket = null
        this.init(params,fn)
    }
    init({port,ip},fn) {
        let url= `ws://${ip}:${port}`
        this.socket=new WebSocket(url)
        if( this.socket){
            this.socket.addEventListener('message',data=>{
                console.log(k.no,'message',data);
                fn('message',data)
            });
            this.socket.addEventListener('close',data=>{
                console.log(k.no,'close',data);
                fn('message',data)
            });
            this.socket.addEventListener('err',data=>{
                console.log(k.no,'err',data);
            })
            this.socket.addEventListener('open',data=>{
                console.log(k.no,'open',open);
            })

        }

    }


}

module.exports = Client;




