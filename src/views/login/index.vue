<template>
    <div id="app">
        <img src="/static/icons/position.svg" alt="">
        {{ $route.path }}
        <div @click="openMedia">openMedia</div>
        <div v-if="$route.path!='/'">
            <router-view></router-view>
        </div>
        
        <div v-else>
            asdasd
            <div @click="open">open</div>
            <div @click="send">发送</div>
            <div @click="close">close</div>
           
            <div @click="closeMedia">closeMedia</div>
            <router-view></router-view>
        </div>
        <video ref="video" style="height: 100px;height:200px; "></video>
    
    </div>
</template>
<script>
import Peer from "simple-peer";

export default {
    name: "App",
    data() {
        return {
            socket: null,
            peer1: null,
            peer2: null,
        }
    },
    components: {},
    methods: {
        send() {
            this.peer2.signal({
                candidate: {
                    candidate: "candidate:2908979170 1 udp 2122129151 192.168.3.23…eration 0 ufrag GQmi network-id 2 network-cost 10",
                    sdpMLineIndex: 0,
                    sdpMid: "0"
                },
                type: "candidate"
            })
            // this.socket.send('Hello Server!');
        },
        open() {
            
            const socket = new WebSocket('ws://localhost:3000');
            this.socket = socket
            // Connection opened
            socket.addEventListener('open',   (event)=> {
                this.openMedia()
            });
           
            socket.addEventListener('close', function (event) {
                console.log('close ', event);
            });
            socket.addEventListener('error', function (event) {
                console.log('error ', event);
            });
            
            addEventListener('beforeunload', (d) => {
                socket.close()
            })
            
            // socket.on('offer', (data) => {
            //     //console.log('send offer')
            //     peer.signal(JSON.parse(data));
            // })
            
        },
        close() {
            if (this.socket) {
                this.socket.close()
            }
        },
        closeMedia() {
            this.peer1.removeStream()
        },
        startMedia() {
            this.peer1.addStream(this.stream)
        },
        openMedia(){
            const socket = new WebSocket('ws://192.168.0.85:3000');
    
            // Connection opened
            socket.addEventListener('open', function (event) {
        
            });
            socket.addEventListener('close', function (event) {
                console.log('close ', event);
            });
            socket.addEventListener('error', function (event) {
                console.log('error ', event);
            });
          // getDisplayMedia 桌面窗口
          // getUserMedia 摄像头 录音  （也可配置为桌面窗口）
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio:true,
            }).then((stream)=>{
                try {
                    let peer = new Peer({initiator: true, stream: stream})
                    socket.addEventListener('message', function (event) {
                        peer.signal(JSON.parse(event.data));
                    });
                    peer.on('signal', function (data) {
                        socket.send(JSON.stringify(data));
                    });
                } catch (e) {
                    console.log(e)
                }
            })
            return
            navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio:true,
            }).then((stream) => {
                console.log('qqq',stream,JSON.stringify(stream));
                let peer1 = new Peer({initiator: true,stream})
                this.socket.addEventListener('message', (event) => {
                    let data = JSON.parse(event.data)
                    console.log('Message  ', data, data.type);
                    
                        data.type &&  peer1.signal(data)
                   
                    
                });
                peer1.on('signal', data => {
                    console.log('signal',1,data);
                    this.socket&& this.socket.send(JSON.stringify(data))
                    // peer2.signal(data)
                })
                
                
                this.peer1 = peer1
                return
                let peer2 = new Peer()
    
                this.peer2 = peer2
                this.peer2.on('signal', data => {
                    console.log('signal_p2  ',2, data,2)
                    peer1.signal(data)
                    // this.socket.send(JSON.stringify(data))
                })
                this.peer2.on('stream', stream => {
                    console.log('p2   stream',3, stream)
                    this.play(stream)
                })
                this.stream=stream
            }).catch((e) => {
                console.log(e);
            })
            
        },
        play(stream){
            console.log('play',stream);
            var video = document.querySelector('video')
            
            if ('srcObject' in video) {
                video.srcObject = stream
            } else {
                video.src = window.URL.createObjectURL(stream) // for older browsers
            }
            video.play()
        }
    },
    mounted() {
        // this.open()
    },
    beforeUnmount() {
        this.socket&&this.socket.close()
        
        this.peer1.destroy()
        this.peer2.destroy()
    }
    
}
</script>
<style lang="scss">

</style>
<style lang="scss" scoped>
#app {
    height: 100vh;
    //box-sizing: border-box;
}
</style>
