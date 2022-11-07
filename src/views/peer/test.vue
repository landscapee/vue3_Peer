<template>
  <video src="#" class="video"></video>
  <video src="#" class="video"></video>
</template>

<script>
import Peer from 'simple-peer'
export default {
  name: "test",
  setup(){
    navigator.mediaDevices.getDisplayMedia({
      voice:true,
      video:true
    }).then((stream)=>{
      let videos=document.querySelectorAll('video')
      let peer1=new Peer()
      let peer2=new Peer()
      let offerPeer=new Peer({stream,initiator:true})
      let offerPeer2=new Peer({stream,initiator:true})
      offerPeer.on('signal',(data)=>{
            peer1.signal(data)
      }) ;
      offerPeer2.on('signal',(data)=>{
            peer2.signal(data)
      })
      peer1.on('signal',(data)=>{
        console.log('signal',data);
        // data.type1='peer1'
        offerPeer.signal(data)
      })
      peer1.on('stream',(stream)=>{
        console.log('stream',stream);

        let video=videos[0]
        if ('srcObject' in video) {
          console.log('srcObject');
          video.srcObject = stream
        } else {
          video.src = window.URL.createObjectURL(new Blob([stream])) // for older browsers
        }
        video.play()
      })
      peer2.on('signal',(data)=>{
        console.log('signal2',data);
        // data.type1='peer2'
        offerPeer2.signal(data)
      })
      peer2.on('stream',(stream)=>{
        console.log('stream2',stream);
        let video=videos[1]
        if ('srcObject' in video) {
          console.log('srcObject');
          video.srcObject = stream
        } else {
          video.src = window.URL.createObjectURL(new Blob([stream])) // for older browsers
        }
        video.play()
      })

    })

  [[]].flat()

  },
}
</script>

<style scoped>
.video{
  width: 100%;
  height: 150px;
}
</style>