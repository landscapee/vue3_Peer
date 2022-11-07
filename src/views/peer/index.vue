<template>
    <div class="peer">
        
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
            stream: null,
        }
    },
    components: {},
    methods: {
        
        open() {
            const socket = new WebSocket('ws://192.168.0.85:3000?qqqqqqqqqqqqqqqqqqqq=wwww');
            this.socket = socket
            socket.addEventListener('open',   (event)=> {
            this.openMedia()
            });
            let map={}
            socket.addEventListener('message', (event) => {
                
                let data = JSON.parse(event.data)
                console.log('..22222...',data );
                if( data.type && !map[data.type] &&data.type!='answer'){
                    data.type&& this.peer2.signal(data)
                }else{
                    // data.type&& this.peer1.signal(data)
                }
                // data.addTrack(this.stream.get)
                // this.stream.addTrack(this.stream.get)
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
            
            
            
        },
        close() {
            if (this.socket) {
                this.socket.close()
            }
        },
        closeMedia() {
            this.peer1.removeStream()
        },
        startMedia(stream) {
             this.peer1.addStream( stream)
        },
        async openMedia(){
            this.peer2 = new Peer()
            this.peer2.on('signal', data => {
                console.log('peer2_signal',data);
                this.socket.send(JSON.stringify(data))
            })
            this.peer2.on('stream', stream => {
                console.log('peer2   stream',stream);
                let video = document.querySelector('video')
                if ('srcObject' in video) {
                    video.srcObject = stream
                } else {
                    video.src = window.URL.createObjectURL(stream) // for older browsers
                }
                video.play()
            })
            return
            let s = await  navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio:true,
            })
            this.stream=s
            console.log(s);
                this.peer1 = new Peer({initiator: true,stream: s })
                this.peer2 = new Peer()
                this.peer1.on('signal', data => {
                    console.log('signal    ',data);
                    // this.socket.send(JSON.stringify(data))
                    data.type&&this.peer2.signal(data)
                })
    
                this.peer2.on('signal', data => {
                    console.log('peer2   signal',data);
                    this.peer1.signal(data)
                })
                this.peer2.on('stream', stream => {
                    console.log('peer2   stream',stream);
                    let video = document.querySelector('video')
                    if ('srcObject' in video) {
                        video.srcObject = stream
                    } else {
                        video.src = window.URL.createObjectURL(stream) // for older browsers
                    }
                    video.play()
                })
            
            // console.log(stream);
           
        }
    },
    mounted() {
        // this.openMedia()
         this.open()
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

</style>
