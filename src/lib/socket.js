export const mySocket = (ipPort) => {
    let lockReconnect = false; //避免重复连接
    let ws;
    let retimer; //重连timer
    let handleStatus; //是否是手动连接状态  true 就不自动连接
    let heartNum = 0; //心跳次数
    let heartCheck = {
        timeout: 30000,
        timer: null,
        heartNum: 15,
        servertimer: null,
        start() {
            this.timer && clearTimeout(this.timer);
            this.servertimer && clearTimeout(this.servertimer);
            this.timer = setTimeout(() => {
                ws.send( JSON.stringify({
                    requestType: "checkHeart",
                    param: {}
                }));
                this.servertimer = setTimeout(function () {
                    // ws.close();
                }, this.timeout);
            }, this.timeout)
        }
    }

    function createWebSocket() {
        let url = `ws://${ipPort}`
        ws = new WebSocket(url);
        ws.onclose = function () {
            reconnect();
            console.log('close')
        };
        ws.handleStatus = function (blo) {
            //blo=true 手动断开 不需要重连
            //blo=false 自动连接状态
            handleStatus = blo
            ws.close()
        };
        ws.onerror = function () {
            !handleStatus && reconnect();
            console.log('err')
        };
        ws.onopen = function () {
            retimer && clearTimeout(retimer);
            heartNum = 0
            heartCheck.start();
        };
        ws.onmessage = function (e) {
            // console.log('message', e);
            // let {type, message} = JSON.parse(e.data)
            // // message=JSON.parse(message)
            // console.log('接收到消息', type, message);
            // heartCheck.start();
        }

    }


    function reconnect() {
        if (lockReconnect) {
            return;
        }
        lockReconnect = true;
        //没连接上会⼀直重连，设置延迟避免请求过多
        retimer && clearTimeout(retimer);
        retimer = setTimeout(function () {
            heartNum++
            if (heartNum <= heartCheck.heartNum) {
                ws&&ws.close()
                createWebSocket();
            }
            lockReconnect = false;
        }, 2000);

    }

    addEventListener('beforeunload', (d) => {
        // ws.close()
    })
//⼼跳检测
    createWebSocket()
    return {
        socket: ws,
        reconnect,
        heartCheck
    }
}