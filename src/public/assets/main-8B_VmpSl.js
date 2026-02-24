import{a as w}from"./api-BR1iiO1w.js";const Q=Object.create(null);Q.open="0";Q.close="1";Q.ping="2";Q.pong="3";Q.message="4";Q.upgrade="5";Q.noop="6";const ve=Object.create(null);Object.keys(Q).forEach(s=>{ve[Q[s]]=s});const Oe={type:"error",data:"parser error"},ut=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",ht=typeof ArrayBuffer=="function",pt=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s&&s.buffer instanceof ArrayBuffer,je=({type:s,data:e},t,n)=>ut&&e instanceof Blob?t?n(e):nt(e,n):ht&&(e instanceof ArrayBuffer||pt(e))?t?n(e):nt(new Blob([e]),n):n(Q[s]+(e||"")),nt=(s,e)=>{const t=new FileReader;return t.onload=function(){const n=t.result.split(",")[1];e("b"+(n||""))},t.readAsDataURL(s)};function it(s){return s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new Uint8Array(s.buffer,s.byteOffset,s.byteLength)}let Be;function Ot(s,e){if(ut&&s.data instanceof Blob)return s.data.arrayBuffer().then(it).then(e);if(ht&&(s.data instanceof ArrayBuffer||pt(s.data)))return e(it(s.data));je(s,!1,t=>{Be||(Be=new TextEncoder),e(Be.encode(t))})}const at="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ae=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let s=0;s<at.length;s++)ae[at.charCodeAt(s)]=s;const Dt=s=>{let e=s.length*.75,t=s.length,n,i=0,r,o,c,l;s[s.length-1]==="="&&(e--,s[s.length-2]==="="&&e--);const y=new ArrayBuffer(e),u=new Uint8Array(y);for(n=0;n<t;n+=4)r=ae[s.charCodeAt(n)],o=ae[s.charCodeAt(n+1)],c=ae[s.charCodeAt(n+2)],l=ae[s.charCodeAt(n+3)],u[i++]=r<<2|o>>4,u[i++]=(o&15)<<4|c>>2,u[i++]=(c&3)<<6|l&63;return y},Nt=typeof ArrayBuffer=="function",We=(s,e)=>{if(typeof s!="string")return{type:"message",data:gt(s,e)};const t=s.charAt(0);return t==="b"?{type:"message",data:Ft(s.substring(1),e)}:ve[t]?s.length>1?{type:ve[t],data:s.substring(1)}:{type:ve[t]}:Oe},Ft=(s,e)=>{if(Nt){const t=Dt(s);return gt(t,e)}else return{base64:!0,data:s}},gt=(s,e)=>{switch(e){case"blob":return s instanceof Blob?s:new Blob([s]);case"arraybuffer":default:return s instanceof ArrayBuffer?s:s.buffer}},ft="",Vt=(s,e)=>{const t=s.length,n=new Array(t);let i=0;s.forEach((r,o)=>{je(r,!1,c=>{n[o]=c,++i===t&&e(n.join(ft))})})},qt=(s,e)=>{const t=s.split(ft),n=[];for(let i=0;i<t.length;i++){const r=We(t[i],e);if(n.push(r),r.type==="error")break}return n};function Ut(){return new TransformStream({transform(s,e){Ot(s,t=>{const n=t.length;let i;if(n<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,n);else if(n<65536){i=new Uint8Array(3);const r=new DataView(i.buffer);r.setUint8(0,126),r.setUint16(1,n)}else{i=new Uint8Array(9);const r=new DataView(i.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(n))}s.data&&typeof s.data!="string"&&(i[0]|=128),e.enqueue(i),e.enqueue(t)})}})}let Ie;function pe(s){return s.reduce((e,t)=>e+t.length,0)}function ge(s,e){if(s[0].length===e)return s.shift();const t=new Uint8Array(e);let n=0;for(let i=0;i<e;i++)t[i]=s[0][n++],n===s[0].length&&(s.shift(),n=0);return s.length&&n<s[0].length&&(s[0]=s[0].slice(n)),t}function Ht(s,e){Ie||(Ie=new TextDecoder);const t=[];let n=0,i=-1,r=!1;return new TransformStream({transform(o,c){for(t.push(o);;){if(n===0){if(pe(t)<1)break;const l=ge(t,1);r=(l[0]&128)===128,i=l[0]&127,i<126?n=3:i===126?n=1:n=2}else if(n===1){if(pe(t)<2)break;const l=ge(t,2);i=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),n=3}else if(n===2){if(pe(t)<8)break;const l=ge(t,8),y=new DataView(l.buffer,l.byteOffset,l.length),u=y.getUint32(0);if(u>Math.pow(2,21)-1){c.enqueue(Oe);break}i=u*Math.pow(2,32)+y.getUint32(4),n=3}else{if(pe(t)<i)break;const l=ge(t,i);c.enqueue(We(r?l:Ie.decode(l),e)),n=0}if(i===0||i>s){c.enqueue(Oe);break}}}})}const mt=4;function I(s){if(s)return zt(s)}function zt(s){for(var e in I.prototype)s[e]=I.prototype[e];return s}I.prototype.on=I.prototype.addEventListener=function(s,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+s]=this._callbacks["$"+s]||[]).push(e),this};I.prototype.once=function(s,e){function t(){this.off(s,t),e.apply(this,arguments)}return t.fn=e,this.on(s,t),this};I.prototype.off=I.prototype.removeListener=I.prototype.removeAllListeners=I.prototype.removeEventListener=function(s,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+s];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+s],this;for(var n,i=0;i<t.length;i++)if(n=t[i],n===e||n.fn===e){t.splice(i,1);break}return t.length===0&&delete this._callbacks["$"+s],this};I.prototype.emit=function(s){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+s],n=1;n<arguments.length;n++)e[n-1]=arguments[n];if(t){t=t.slice(0);for(var n=0,i=t.length;n<i;++n)t[n].apply(this,e)}return this};I.prototype.emitReserved=I.prototype.emit;I.prototype.listeners=function(s){return this._callbacks=this._callbacks||{},this._callbacks["$"+s]||[]};I.prototype.hasListeners=function(s){return!!this.listeners(s).length};const Le=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),q=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Gt="arraybuffer";function vt(s,...e){return e.reduce((t,n)=>(s.hasOwnProperty(n)&&(t[n]=s[n]),t),{})}const jt=q.setTimeout,Wt=q.clearTimeout;function Pe(s,e){e.useNativeTimers?(s.setTimeoutFn=jt.bind(q),s.clearTimeoutFn=Wt.bind(q)):(s.setTimeoutFn=q.setTimeout.bind(q),s.clearTimeoutFn=q.clearTimeout.bind(q))}const Qt=1.33;function Kt(s){return typeof s=="string"?Yt(s):Math.ceil((s.byteLength||s.size)*Qt)}function Yt(s){let e=0,t=0;for(let n=0,i=s.length;n<i;n++)e=s.charCodeAt(n),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(n++,t+=4);return t}function yt(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Jt(s){let e="";for(let t in s)s.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(s[t]));return e}function Xt(s){let e={},t=s.split("&");for(let n=0,i=t.length;n<i;n++){let r=t[n].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class Zt extends Error{constructor(e,t,n){super(e),this.description=t,this.context=n,this.type="TransportError"}}class Qe extends I{constructor(e){super(),this.writable=!1,Pe(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,n){return super.emitReserved("error",new Zt(e,t,n)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=We(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Jt(e);return t.length?"?"+t:""}}class es extends Qe{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let n=0;this._polling&&(n++,this.once("pollComplete",function(){--n||t()})),this.writable||(n++,this.once("drain",function(){--n||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=n=>{if(this.readyState==="opening"&&n.type==="open"&&this.onOpen(),n.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(n)};qt(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Vt(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=yt()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let bt=!1;try{bt=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const ts=bt;function ss(){}class ns extends es{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let n=location.port;n||(n=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||n!==e.port}}doWrite(e,t){const n=this.request({method:"POST",data:e});n.on("success",t),n.on("error",(i,r)=>{this.onError("xhr post error",i,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,n)=>{this.onError("xhr poll error",t,n)}),this.pollXhr=e}}class W extends I{constructor(e,t,n){super(),this.createRequest=e,Pe(this,n),this._opts=n,this._method=n.method||"GET",this._uri=t,this._data=n.data!==void 0?n.data:null,this._create()}_create(){var e;const t=vt(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const n=this._xhr=this.createRequest(t);try{n.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){n.setDisableHeaderCheck&&n.setDisableHeaderCheck(!0);for(let i in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(i)&&n.setRequestHeader(i,this._opts.extraHeaders[i])}}catch{}if(this._method==="POST")try{n.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{n.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(n),"withCredentials"in n&&(n.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(n.timeout=this._opts.requestTimeout),n.onreadystatechange=()=>{var i;n.readyState===3&&((i=this._opts.cookieJar)===null||i===void 0||i.parseCookies(n.getResponseHeader("set-cookie"))),n.readyState===4&&(n.status===200||n.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof n.status=="number"?n.status:0)},0))},n.send(this._data)}catch(i){this.setTimeoutFn(()=>{this._onError(i)},0);return}typeof document<"u"&&(this._index=W.requestsCount++,W.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=ss,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete W.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}W.requestsCount=0;W.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",rt);else if(typeof addEventListener=="function"){const s="onpagehide"in q?"pagehide":"unload";addEventListener(s,rt,!1)}}function rt(){for(let s in W.requests)W.requests.hasOwnProperty(s)&&W.requests[s].abort()}const is=function(){const s=wt({xdomain:!1});return s&&s.responseType!==null}();class as extends ns{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=is&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new W(wt,this.uri(),e)}}function wt(s){const e=s.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||ts))return new XMLHttpRequest}catch{}if(!e)try{return new q[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const kt=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class rs extends Qe{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,n=kt?{}:vt(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(n.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,n)}catch(i){return this.emitReserved("error",i)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const n=e[t],i=t===e.length-1;je(n,this.supportsBinary,r=>{try{this.doWrite(n,r)}catch{}i&&Le(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=yt()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Te=q.WebSocket||q.MozWebSocket;class os extends rs{createSocket(e,t,n){return kt?new Te(e,t,n):t?new Te(e,t):new Te(e)}doWrite(e,t){this.ws.send(t)}}class cs extends Qe{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Ht(Number.MAX_SAFE_INTEGER,this.socket.binaryType),n=e.readable.pipeThrough(t).getReader(),i=Ut();i.readable.pipeTo(e.writable),this._writer=i.writable.getWriter();const r=()=>{n.read().then(({done:c,value:l})=>{c||(this.onPacket(l),r())}).catch(c=>{})};r();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const n=e[t],i=t===e.length-1;this._writer.write(n).then(()=>{i&&Le(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const ls={websocket:os,webtransport:cs,polling:as},ds=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,us=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function De(s){if(s.length>8e3)throw"URI too long";const e=s,t=s.indexOf("["),n=s.indexOf("]");t!=-1&&n!=-1&&(s=s.substring(0,t)+s.substring(t,n).replace(/:/g,";")+s.substring(n,s.length));let i=ds.exec(s||""),r={},o=14;for(;o--;)r[us[o]]=i[o]||"";return t!=-1&&n!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=hs(r,r.path),r.queryKey=ps(r,r.query),r}function hs(s,e){const t=/\/{2,9}/g,n=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&n.splice(0,1),e.slice(-1)=="/"&&n.splice(n.length-1,1),n}function ps(s,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(n,i,r){i&&(t[i]=r)}),t}const Ne=typeof addEventListener=="function"&&typeof removeEventListener=="function",ye=[];Ne&&addEventListener("offline",()=>{ye.forEach(s=>s())},!1);class X extends I{constructor(e,t){if(super(),this.binaryType=Gt,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const n=De(e);t.hostname=n.host,t.secure=n.protocol==="https"||n.protocol==="wss",t.port=n.port,n.query&&(t.query=n.query)}else t.host&&(t.hostname=De(t.host).host);Pe(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(n=>{const i=n.prototype.name;this.transports.push(i),this._transportsByName[i]=n}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Xt(this.opts.query)),Ne&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},ye.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=mt,t.transport=e,this.id&&(t.sid=this.id);const n=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](n)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&X.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",X.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let n=0;n<this.writeBuffer.length;n++){const i=this.writeBuffer[n].data;if(i&&(t+=Kt(i)),n>0&&t>this._maxPayload)return this.writeBuffer.slice(0,n);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Le(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,n){return this._sendPacket("message",e,t,n),this}send(e,t,n){return this._sendPacket("message",e,t,n),this}_sendPacket(e,t,n,i){if(typeof t=="function"&&(i=t,t=void 0),typeof n=="function"&&(i=n,n=null),this.readyState==="closing"||this.readyState==="closed")return;n=n||{},n.compress=n.compress!==!1;const r={type:e,data:t,options:n};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),i&&this.once("flush",i),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},n=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?n():e()}):this.upgrading?n():e()),this}_onError(e){if(X.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Ne&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const n=ye.indexOf(this._offlineEventListener);n!==-1&&ye.splice(n,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}X.protocol=mt;class gs extends X{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),n=!1;X.priorWebsocketSuccess=!1;const i=()=>{n||(t.send([{type:"ping",data:"probe"}]),t.once("packet",m=>{if(!n)if(m.type==="pong"&&m.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;X.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{n||this.readyState!=="closed"&&(u(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const b=new Error("probe error");b.transport=t.name,this.emitReserved("upgradeError",b)}}))};function r(){n||(n=!0,u(),t.close(),t=null)}const o=m=>{const b=new Error("probe error: "+m);b.transport=t.name,r(),this.emitReserved("upgradeError",b)};function c(){o("transport closed")}function l(){o("socket closed")}function y(m){t&&m.name!==t.name&&r()}const u=()=>{t.removeListener("open",i),t.removeListener("error",o),t.removeListener("close",c),this.off("close",l),this.off("upgrading",y)};t.once("open",i),t.once("error",o),t.once("close",c),this.once("close",l),this.once("upgrading",y),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{n||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let n=0;n<e.length;n++)~this.transports.indexOf(e[n])&&t.push(e[n]);return t}}let fs=class extends gs{constructor(e,t={}){const n=typeof e=="object"?e:t;(!n.transports||n.transports&&typeof n.transports[0]=="string")&&(n.transports=(n.transports||["polling","websocket","webtransport"]).map(i=>ls[i]).filter(i=>!!i)),super(e,n)}};function ms(s,e="",t){let n=s;t=t||typeof location<"u"&&location,s==null&&(s=t.protocol+"//"+t.host),typeof s=="string"&&(s.charAt(0)==="/"&&(s.charAt(1)==="/"?s=t.protocol+s:s=t.host+s),/^(https?|wss?):\/\//.test(s)||(typeof t<"u"?s=t.protocol+"//"+s:s="https://"+s),n=De(s)),n.port||(/^(http|ws)$/.test(n.protocol)?n.port="80":/^(http|ws)s$/.test(n.protocol)&&(n.port="443")),n.path=n.path||"/";const r=n.host.indexOf(":")!==-1?"["+n.host+"]":n.host;return n.id=n.protocol+"://"+r+":"+n.port+e,n.href=n.protocol+"://"+r+(t&&t.port===n.port?"":":"+n.port),n}const vs=typeof ArrayBuffer=="function",ys=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s.buffer instanceof ArrayBuffer,Et=Object.prototype.toString,bs=typeof Blob=="function"||typeof Blob<"u"&&Et.call(Blob)==="[object BlobConstructor]",ws=typeof File=="function"||typeof File<"u"&&Et.call(File)==="[object FileConstructor]";function Ke(s){return vs&&(s instanceof ArrayBuffer||ys(s))||bs&&s instanceof Blob||ws&&s instanceof File}function be(s,e){if(!s||typeof s!="object")return!1;if(Array.isArray(s)){for(let t=0,n=s.length;t<n;t++)if(be(s[t]))return!0;return!1}if(Ke(s))return!0;if(s.toJSON&&typeof s.toJSON=="function"&&arguments.length===1)return be(s.toJSON(),!0);for(const t in s)if(Object.prototype.hasOwnProperty.call(s,t)&&be(s[t]))return!0;return!1}function ks(s){const e=[],t=s.data,n=s;return n.data=Fe(t,e),n.attachments=e.length,{packet:n,buffers:e}}function Fe(s,e){if(!s)return s;if(Ke(s)){const t={_placeholder:!0,num:e.length};return e.push(s),t}else if(Array.isArray(s)){const t=new Array(s.length);for(let n=0;n<s.length;n++)t[n]=Fe(s[n],e);return t}else if(typeof s=="object"&&!(s instanceof Date)){const t={};for(const n in s)Object.prototype.hasOwnProperty.call(s,n)&&(t[n]=Fe(s[n],e));return t}return s}function Es(s,e){return s.data=Ve(s.data,e),delete s.attachments,s}function Ve(s,e){if(!s)return s;if(s&&s._placeholder===!0){if(typeof s.num=="number"&&s.num>=0&&s.num<e.length)return e[s.num];throw new Error("illegal attachments")}else if(Array.isArray(s))for(let t=0;t<s.length;t++)s[t]=Ve(s[t],e);else if(typeof s=="object")for(const t in s)Object.prototype.hasOwnProperty.call(s,t)&&(s[t]=Ve(s[t],e));return s}const $s=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var E;(function(s){s[s.CONNECT=0]="CONNECT",s[s.DISCONNECT=1]="DISCONNECT",s[s.EVENT=2]="EVENT",s[s.ACK=3]="ACK",s[s.CONNECT_ERROR=4]="CONNECT_ERROR",s[s.BINARY_EVENT=5]="BINARY_EVENT",s[s.BINARY_ACK=6]="BINARY_ACK"})(E||(E={}));class Cs{constructor(e){this.replacer=e}encode(e){return(e.type===E.EVENT||e.type===E.ACK)&&be(e)?this.encodeAsBinary({type:e.type===E.EVENT?E.BINARY_EVENT:E.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===E.BINARY_EVENT||e.type===E.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=ks(e),n=this.encodeAsString(t.packet),i=t.buffers;return i.unshift(n),i}}class Ye extends I{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const n=t.type===E.BINARY_EVENT;n||t.type===E.BINARY_ACK?(t.type=n?E.EVENT:E.ACK,this.reconstructor=new _s(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(Ke(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const n={type:Number(e.charAt(0))};if(E[n.type]===void 0)throw new Error("unknown packet type "+n.type);if(n.type===E.BINARY_EVENT||n.type===E.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(r,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");n.attachments=Number(o)}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););n.nsp=e.substring(r,t)}else n.nsp="/";const i=e.charAt(t+1);if(i!==""&&Number(i)==i){const r=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}n.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(Ye.isPayloadValid(n.type,r))n.data=r;else throw new Error("invalid payload")}return n}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case E.CONNECT:return ot(t);case E.DISCONNECT:return t===void 0;case E.CONNECT_ERROR:return typeof t=="string"||ot(t);case E.EVENT:case E.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&$s.indexOf(t[0])===-1);case E.ACK:case E.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class _s{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Es(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function ot(s){return Object.prototype.toString.call(s)==="[object Object]"}const Ss=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Ye,Encoder:Cs,get PacketType(){return E}},Symbol.toStringTag,{value:"Module"}));function H(s,e,t){return s.on(e,t),function(){s.off(e,t)}}const Ls=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class $t extends I{constructor(e,t,n){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,n&&n.auth&&(this.auth=n.auth),this._opts=Object.assign({},n),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[H(e,"open",this.onopen.bind(this)),H(e,"packet",this.onpacket.bind(this)),H(e,"error",this.onerror.bind(this)),H(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var n,i,r;if(Ls.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const o={type:E.EVENT,data:t};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const u=this.ids++,m=t.pop();this._registerAckCallback(u,m),o.id=u}const c=(i=(n=this.io.engine)===null||n===void 0?void 0:n.transport)===null||i===void 0?void 0:i.writable,l=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,t){var n;const i=(n=this.flags.timeout)!==null&&n!==void 0?n:this._opts.ackTimeout;if(i===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===e&&this.sendBuffer.splice(c,1);t.call(this,new Error("operation has timed out"))},i),o=(...c)=>{this.io.clearTimeoutFn(r),t.apply(this,c)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...t){return new Promise((n,i)=>{const r=(o,c)=>o?i(o):n(c);r.withError=!0,t.push(r),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const n={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((i,...r)=>(this._queue[0],i!==null?n.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(i)):(this._queue.shift(),t&&t(null,...r)),n.pending=!1,this._drainQueue())),this._queue.push(n),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:E.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(n=>String(n.id)===e)){const n=this.acks[e];delete this.acks[e],n.withError&&n.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case E.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case E.EVENT:case E.BINARY_EVENT:this.onevent(e);break;case E.ACK:case E.BINARY_ACK:this.onack(e);break;case E.DISCONNECT:this.ondisconnect();break;case E.CONNECT_ERROR:this.destroy();const n=new Error(e.data.message);n.data=e.data.data,this.emitReserved("connect_error",n);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const n of t)n.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let n=!1;return function(...i){n||(n=!0,t.packet({type:E.ACK,id:e,data:i}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:E.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let n=0;n<t.length;n++)if(e===t[n])return t.splice(n,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let n=0;n<t.length;n++)if(e===t[n])return t.splice(n,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const n of t)n.apply(this,e.data)}}}function ne(s){s=s||{},this.ms=s.min||100,this.max=s.max||1e4,this.factor=s.factor||2,this.jitter=s.jitter>0&&s.jitter<=1?s.jitter:0,this.attempts=0}ne.prototype.duration=function(){var s=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*s);s=Math.floor(e*10)&1?s+t:s-t}return Math.min(s,this.max)|0};ne.prototype.reset=function(){this.attempts=0};ne.prototype.setMin=function(s){this.ms=s};ne.prototype.setMax=function(s){this.max=s};ne.prototype.setJitter=function(s){this.jitter=s};class qe extends I{constructor(e,t){var n;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,Pe(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((n=t.randomizationFactor)!==null&&n!==void 0?n:.5),this.backoff=new ne({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const i=t.parser||Ss;this.encoder=new i.Encoder,this.decoder=new i.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new fs(this.uri,this.opts);const t=this.engine,n=this;this._readyState="opening",this.skipReconnect=!1;const i=H(t,"open",function(){n.onopen(),e&&e()}),r=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),e?e(c):this.maybeReconnectOnOpen()},o=H(t,"error",r);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{i(),r(new Error("timeout")),t.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(i),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(H(e,"ping",this.onping.bind(this)),H(e,"data",this.ondata.bind(this)),H(e,"error",this.onerror.bind(this)),H(e,"close",this.onclose.bind(this)),H(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){Le(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let n=this.nsps[e];return n?this._autoConnect&&!n.active&&n.connect():(n=new $t(this,e,t),this.nsps[e]=n),n}_destroy(e){const t=Object.keys(this.nsps);for(const n of t)if(this.nsps[n].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let n=0;n<t.length;n++)this.engine.write(t[n],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var n;this.cleanup(),(n=this.engine)===null||n===void 0||n.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const n=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(i=>{i?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",i)):e.onreconnect()}))},t);this.opts.autoUnref&&n.unref(),this.subs.push(()=>{this.clearTimeoutFn(n)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const ie={};function we(s,e){typeof s=="object"&&(e=s,s=void 0),e=e||{};const t=ms(s,e.path||"/socket.io"),n=t.source,i=t.id,r=t.path,o=ie[i]&&r in ie[i].nsps,c=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return c?l=new qe(n,e):(ie[i]||(ie[i]=new qe(n,e)),l=ie[i]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(we,{Manager:qe,Socket:$t,io:we,connect:we});class Ps{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=we({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(t=>{this.socket.emit("subscribe:manga",t)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",t=>{console.log("[Socket] Disconnected:",t)}),this.socket.on("connect_error",t=>{console.error("[Socket] Connection error:",t.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var t;this.subscribedMangas.add(e),(t=this.socket)!=null&&t.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var t;this.subscribedMangas.delete(e),(t=this.socket)!=null&&t.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,t){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),this.socket&&this.socket.on(e,t)}off(e,t){this.listeners.has(e)&&this.listeners.get(e).delete(t),this.socket&&this.socket.off(e,t)}emit(e,t){var n;(n=this.socket)!=null&&n.connected&&this.socket.emit(e,t)}}const F={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone"},M=new Ps;function z(s="manga"){return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">📚 Manga<span>Reader</span></a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${s==="manga"?"active":""}" data-view="manga" title="Manga view">📚</button>
            <button class="view-toggle-btn ${s==="series"?"active":""}" data-view="series" title="Series view">📖</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">⭐ Favorites</button>
          <button class="btn btn-secondary" id="scan-btn">📁 Scan Folder</button>
          <button class="btn btn-primary" id="add-manga-btn">+ Add Manga</button>
          <button class="btn btn-secondary" id="logout-btn">🚪</button>
          <a href="#/admin" class="btn btn-secondary" title="Admin">🔧</a>
          <a href="#/settings" class="btn btn-secondary" title="Settings">⚙️</a>
        </div>
        <button class="hamburger-btn mobile-only" id="hamburger-btn">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu hidden" id="mobile-menu">
        <div class="mobile-view-toggle">
          <button class="view-toggle-btn ${s==="manga"?"active":""}" data-view="manga">📚 Manga</button>
          <button class="view-toggle-btn ${s==="series"?"active":""}" data-view="series">📖 Series</button>
        </div>
        <button class="mobile-menu-item" id="mobile-favorites-btn">⭐ Favorites</button>
        <button class="mobile-menu-item" id="mobile-scan-btn">📁 Scan Folder</button>
        <button class="mobile-menu-item primary" id="mobile-add-btn">+ Add Manga</button>
        <button class="mobile-menu-item" id="mobile-logout-btn">🚪 Logout</button>
        <a href="#/admin" class="mobile-menu-item">🔧 Admin</a>
        <a href="#/settings" class="mobile-menu-item">⚙️ Settings</a>
      </div>
    </header>
  `}function de(){const s=document.getElementById("hamburger-btn"),e=document.getElementById("mobile-menu");s&&e&&s.addEventListener("click",()=>{e.classList.toggle("hidden")});const t=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),i=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};t&&t.addEventListener("click",i),n&&n.addEventListener("click",i),document.querySelectorAll("[data-view]").forEach(o=>{o.addEventListener("click",()=>{const c=o.dataset.view;localStorage.setItem("library_view_mode",c),document.querySelectorAll("[data-view]").forEach(l=>{l.classList.toggle("active",l.dataset.view===c)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:c}}))})});const r=document.querySelector(".logo");r&&r.addEventListener("click",o=>{localStorage.removeItem("library_active_category"),window.dispatchEvent(new CustomEvent("clearFilters"))})}const D={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},j=new Set,B=new Map,re=new Map;function Bs(s){return D[s]}function Is(s,e){D[s]=e,j.add(s),he(s)}function Ts(s,e){return re.has(s)||re.set(s,new Set),re.get(s).add(e),()=>{var t;return(t=re.get(s))==null?void 0:t.delete(e)}}function he(s){const e=re.get(s);e&&e.forEach(t=>t(D[s]))}function oe(s){j.delete(s),B.delete(s)}function As(s){return j.has(s)}async function ce(s=!1){if(!s&&j.has("bookmarks"))return D.bookmarks;if(B.has("bookmarks"))return B.get("bookmarks");const e=w.getBookmarks().then(t=>(D.bookmarks=t||[],j.add("bookmarks"),B.delete("bookmarks"),he("bookmarks"),D.bookmarks)).catch(t=>{throw B.delete("bookmarks"),t});return B.set("bookmarks",e),e}async function xs(s=!1){if(!s&&j.has("series"))return D.series;if(B.has("series"))return B.get("series");const e=w.get("/series").then(t=>(D.series=t||[],j.add("series"),B.delete("series"),he("series"),D.series)).catch(t=>{throw B.delete("series"),t});return B.set("series",e),e}async function Ms(s=!1){if(!s&&j.has("categories"))return D.categories;if(B.has("categories"))return B.get("categories");const e=w.get("/categories").then(t=>(D.categories=t.categories||[],j.add("categories"),B.delete("categories"),he("categories"),D.categories)).catch(t=>{throw B.delete("categories"),t});return B.set("categories",e),e}async function Rs(s=!1){if(!s&&j.has("favorites"))return D.favorites;if(B.has("favorites"))return B.get("favorites");const e=w.getFavorites().then(t=>(D.favorites=t||{favorites:{},listOrder:[]},j.add("favorites"),B.delete("favorites"),he("favorites"),D.favorites)).catch(t=>{throw B.delete("favorites"),t});return B.set("favorites",e),e}function Os(){M.on(F.MANGA_UPDATED,()=>{oe("bookmarks"),ce(!0)}),M.on(F.MANGA_ADDED,()=>{oe("bookmarks"),ce(!0)}),M.on(F.MANGA_DELETED,()=>{oe("bookmarks"),ce(!0)}),M.on(F.DOWNLOAD_COMPLETED,()=>{oe("bookmarks"),ce(!0)})}Os();const Y={get:Bs,set:Is,subscribe:Ts,invalidate:oe,isLoaded:As,loadBookmarks:ce,loadSeries:xs,loadCategories:Ms,loadFavorites:Rs};function p(s,e="info"){document.querySelectorAll(".toast").forEach(i=>{i.classList.contains("show")&&i.classList.remove("show")});const n=document.createElement("div");n.className=`toast toast-${e}`,n.textContent=s,document.body.appendChild(n),requestAnimationFrame(()=>n.classList.add("show")),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>n.remove(),300)},3e3)}let g={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:"",sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0},ke=[];function Je(s){return[...s].sort((e,t)=>{var n,i;switch(g.sortBy){case"az":return(e.alias||e.title).localeCompare(t.alias||t.title);case"za":return(t.alias||t.title).localeCompare(e.alias||e.title);case"lastread":return(t.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const r=((n=e.chapters)==null?void 0:n.length)||e.uniqueChapters||0;return(((i=t.chapters)==null?void 0:i.length)||t.uniqueChapters||0)-r}case"updated":default:return(t.updatedAt||"").localeCompare(e.updatedAt||"")}})}function Xe(s){var u,m,b;const e=s.alias||s.title,t=s.downloadedCount??((u=s.downloadedChapters)==null?void 0:u.length)??0,n=new Set(s.excludedChapters||[]),i=(s.chapters||[]).filter(k=>!n.has(k.number)),r=new Set(i.map(k=>k.number)).size||s.uniqueChapters||0,o=s.readCount??((m=s.readChapters)==null?void 0:m.length)??0,c=(s.updatedCount??((b=s.updatedChapters)==null?void 0:b.length)??0)>0,l=s.localCover?`/api/public/covers/${s.id}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover,y=s.source==="local";return`
    <div class="manga-card" data-id="${s.id}">
      <div class="manga-card-cover">
        ${l?`<img src="${l}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:`<div class="placeholder">${y?"💾":"📚"}</div>`}
        <div class="manga-card-badges">
          ${o>0?`<span class="badge badge-read" title="Read">${o}</span>`:""}
          <span class="badge badge-chapters" title="Total">${r}</span>
          ${t>0?`<span class="badge badge-downloaded" title="Downloaded">${t}</span>`:""}
          ${c?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${s.autoCheck?'<span class="badge badge-monitored" title="Monitored">🔔</span>':""}
          ${g.activeCategory==="Favorites"?'<span class="badge badge-play" title="Click to Read">▶</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Ze(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function Ds(s){var i;const e=s.alias||s.title,t=((i=s.entries)==null?void 0:i.length)||s.entry_count||0;let n=null;return s.localCover&&s.coverBookmarkId?n=`/api/public/covers/${s.coverBookmarkId}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover&&(n=s.cover),`
    <div class="manga-card series-card" data-series-id="${s.id}">
      <div class="manga-card-cover">
        ${n?`<img src="${n}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>'}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${t} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Ee(){const s=localStorage.getItem("library_view_mode");if(s&&s!==g.viewMode&&(g.viewMode=s),g.viewMode==="series"){const n=g.series.map(Ds).join("");return`
        ${z(g.viewMode)}
<div class="container">
  <div class="library-grid" id="library-grid">
    ${g.loading?'<div class="loading-spinner"></div>':n||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p></div>'}
  </div>
</div>
`}if(g.activeCategory==="Favorites")return $.go("/favorites"),"";let e=g.activeCategory?g.bookmarks.filter(n=>(n.categories||[]).includes(g.activeCategory)):g.bookmarks;if(g.artistFilter&&(e=e.filter(n=>(n.artists||[]).includes(g.artistFilter))),g.searchQuery){const n=g.searchQuery.toLowerCase();e=e.filter(i=>(i.title||"").toLowerCase().includes(n)||(i.alias||"").toLowerCase().includes(n))}e=Je(e);const t=e.map(Xe).join("");return`
    ${z(g.viewMode)}
    <div class="container">
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" id="library-search" placeholder="Search manga..." value="${g.searchQuery}" autocomplete="off">
          ${g.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${g.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${g.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${g.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${g.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${g.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
      </div>
      ${g.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">🎨</span>
          <span class="artist-filter-name">${g.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${g.loading?'<div class="loading-spinner"></div>':t||Ze()}
      </div>
    </div>
    ${Ns()}
    ${Fs()}
    `}function Ns(){const{activeCategory:s}=g,e=Array.isArray(g.categories)?g.categories:[];return`
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${s?"has-filter":""}" id="category-fab-btn">
        ${s||"🏷️"}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn">⚙️</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${s?"":"active"}" data-category="">All</button>
          ${e.map(t=>`
            <button class="category-menu-item ${s===t?"active":""}" data-category="${t}">
              ${t}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
      `}function Fs(){return`
      <div class="modal" id="add-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add Manga</h2>
          <button class="modal-close" id="add-modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="manga-url">Manga URL</label>
            <input type="url" id="manga-url" placeholder="https://comix.to/..." required>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="add-modal-cancel">Cancel</button>
          <button class="btn btn-primary" id="add-modal-submit">Add</button>
        </div>
      </div>
    </div>
      `}function Ue(){g.activeCategory=null,g.artistFilter=null,localStorage.removeItem("library_active_category"),K()}function Ct(){document.getElementById("app").addEventListener("click",L=>{const h=L.target.closest(".manga-card");if(h){if(h.classList.contains("gallery-card")){const P=h.dataset.gallery;$.go(`/ read / gallery / ${encodeURIComponent(P)} `);return}const d=h.dataset.id,v=h.dataset.seriesId;if(v){$.go(`/ series / ${v} `);return}if(d){if(g.activeCategory==="Favorites"){const P=g.bookmarks.find(S=>S.id===d);if(P){let S=P.last_read_chapter;if(!S&&P.chapters&&P.chapters.length>0&&(S=[...P.chapters].sort((Z,te)=>Z.number-te.number)[0].number),S){$.go(`/ read / ${d}/${S}`);return}else p("No chapters available to read","warning")}}$.go(`/manga/${d}`)}}}),de();const e=document.getElementById("favorites-btn"),t=document.getElementById("scan-btn");document.getElementById("quick-check-btn");const n=document.getElementById("mobile-favorites-btn"),i=document.getElementById("mobile-scan-btn");document.getElementById("mobile-quick-check-btn");const r=()=>{g.activeCategory==="Favorites"?Ae(null):Ae("Favorites")};e&&e.addEventListener("click",r),n&&n.addEventListener("click",r);const o=async()=>{try{t&&(t.disabled=!0,t.textContent="Scanning..."),i&&(i.textContent="Scanning..."),p("Scanning downloads folder...","info"),await w.scanLibrary(),p("Scan complete. Refreshing...","success"),await He(),K()}catch(L){p("Scan failed: "+L.message,"error")}finally{t&&(t.disabled=!1,t.textContent="📁 Scan Folder"),i&&(i.textContent="📁 Scan Folder")}};t&&t.addEventListener("click",o),i&&i.addEventListener("click",o),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",L=>{g.viewMode=L.detail.mode;const h=document.getElementById("app");h.innerHTML=Ee(),Ct(),de()}));const c=document.getElementById("category-fab-btn"),l=document.getElementById("category-fab-menu");c&&l&&(c.addEventListener("click",()=>{l.classList.toggle("hidden")}),l.addEventListener("click",L=>{const h=L.target.closest(".category-menu-item");if(h){const d=h.dataset.category||null;Ae(d),l.classList.add("hidden")}}));const y=document.getElementById("artist-filter-badge");y&&y.addEventListener("click",()=>{g.artistFilter=null,K()});const u=document.getElementById("library-search");u&&(u.addEventListener("input",L=>{var d;g.searchQuery=L.target.value;const h=document.getElementById("library-grid");if(h){let v=g.activeCategory?g.bookmarks.filter(S=>(S.categories||[]).includes(g.activeCategory)):g.bookmarks;if(g.artistFilter&&(v=v.filter(S=>(S.artists||[]).includes(g.artistFilter))),g.searchQuery){const S=g.searchQuery.toLowerCase();v=v.filter(O=>(O.title||"").toLowerCase().includes(S)||(O.alias||"").toLowerCase().includes(S))}v=Je(v),h.innerHTML=v.map(Xe).join("")||Ze();const P=document.getElementById("search-clear");!P&&g.searchQuery?(u.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(d=document.getElementById("search-clear"))==null||d.addEventListener("click",()=>{g.searchQuery="",u.value="",K()})):P&&!g.searchQuery&&P.remove()}}),g.searchQuery&&u.focus());const m=document.getElementById("search-clear");m&&m.addEventListener("click",()=>{g.searchQuery="",K()});const b=document.getElementById("library-sort");b&&b.addEventListener("change",L=>{g.sortBy=L.target.value,localStorage.setItem("library_sort",g.sortBy),K()}),window.removeEventListener("clearFilters",Ue),window.addEventListener("clearFilters",Ue);const k=document.getElementById("add-manga-btn"),C=document.getElementById("add-modal"),_=document.getElementById("add-modal-close"),A=document.getElementById("add-modal-cancel"),R=document.getElementById("add-modal-submit");k&&C&&k.addEventListener("click",()=>C.classList.add("open")),_&&_.addEventListener("click",()=>C.classList.remove("open")),A&&A.addEventListener("click",()=>C.classList.remove("open")),R&&R.addEventListener("click",async()=>{const L=document.getElementById("manga-url"),h=L.value.trim();if(!h){p("Please enter a URL","error");return}try{R.disabled=!0,R.textContent="Adding...",await w.addBookmark(h),p("Manga added successfully!","success"),C.classList.remove("open"),L.value="",await He(),K()}catch(d){p("Failed to add manga: "+d.message,"error")}finally{R.disabled=!1,R.textContent="Add"}});const U=document.getElementById("empty-add-btn");U&&C&&U.addEventListener("click",()=>C.classList.add("open"));const V=C==null?void 0:C.querySelector(".modal-overlay");V&&V.addEventListener("click",()=>C.classList.remove("open"))}function Ae(s){g.activeCategory=s,s?localStorage.setItem("library_active_category",s):localStorage.removeItem("library_active_category"),K()}async function He(){try{const[s,e,t,n]=await Promise.all([Y.loadBookmarks(),Y.loadCategories(),Y.loadSeries(),Y.loadFavorites()]);g.bookmarks=s,g.categories=e,g.series=t,g.favorites=n,g.loading=!1}catch{p("Failed to load library","error"),g.loading=!1}}async function K(){const s=document.getElementById("app"),e=localStorage.getItem("library_active_category");g.activeCategory!==e&&(g.activeCategory=e),g.loading&&(s.innerHTML=Ee()),g.bookmarks.length===0&&g.loading&&await He(),s.innerHTML=Ee(),Ct(),ke.forEach(t=>t()),ke=[Y.subscribe("bookmarks",t=>{g.bookmarks=t;const n=document.getElementById("library-grid");if(n){let i=g.activeCategory?g.bookmarks.filter(r=>(r.categories||[]).includes(g.activeCategory)):g.bookmarks;if(g.artistFilter&&(i=i.filter(r=>(r.artists||[]).includes(g.artistFilter))),g.searchQuery){const r=g.searchQuery.toLowerCase();i=i.filter(o=>(o.title||"").toLowerCase().includes(r)||(o.alias||"").toLowerCase().includes(r))}i=Je(i),n.innerHTML=i.map(Xe).join("")||Ze()}})]}function Vs(){window.removeEventListener("clearFilters",Ue),ke.forEach(s=>s()),ke=[]}const qs={mount:K,unmount:Vs,render:Ee};let a={manga:null,chapter:null,images:[],trophyPages:{},mode:"webtoon",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!1,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,favoriteLists:[],navigationDirection:null,nextChapterImage:null,nextChapterNum:null};function $e(){var l;if(a.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!a.manga||!a.images.length)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const s=a.manga.alias||a.manga.title,e=(l=a.chapter)==null?void 0:l.number,n=x().length,i=a.images.length;let r,o;a.mode==="webtoon"?(r=i-1,o=`${i} pages`):a.singlePageMode?(r=i-1,o=`${a.currentPage+1} / ${i}`):(r=n-1,o=`${a.currentPage+1} / ${n}`);const c=Lt();return`
    <div class="reader ${a.mode}-mode ${a.showControls?"":"controls-hidden"}">
      <!-- Header -->
      <div class="reader-header">
        <button class="btn-icon" id="reader-close-btn">×</button>
        <div class="reader-title">
          <span class="manga-name">${s}</span>
          <span class="chapter-name">Ch. ${e}</span>
        </div>
        <div class="reader-header-actions">
          ${a.isGalleryMode?"":`
          ${a.mode==="manga"?`
            <button class="btn-icon ${a.singlePageMode?"active":""}" id="single-page-btn" title="${a.singlePageMode?"Switch to double page":"Switch to single page"}">
              ${a.singlePageMode?"1️⃣":"2️⃣"}
            </button>
            <button class="btn-icon ${c?"active":""}" id="trophy-btn" title="${c?"Unmark trophy":"Mark as trophy"}">🏆</button>
          `:""}
          <button class="btn-icon" id="fullscreen-btn" title="Toggle fullscreen">⛶</button>
          <button class="btn-icon" id="reader-settings-btn">⚙️</button>
          `}
        </div>
      </div>
      
      <!-- Page Manipulation Toolbar -->
      ${a.isGalleryMode?"":`
      <div class="reader-toolbar" id="reader-toolbar">
        <button class="btn-icon toolbar-btn" id="rotate-btn" title="Rotate 90° CW">🔄</button>
        ${a.mode==="manga"&&!a.singlePageMode?`
          <button class="btn-icon toolbar-btn" id="swap-btn" title="Swap pages in spread">⇄</button>
        `:""}
        ${a.singlePageMode||a.mode==="webtoon"?`
          <button class="btn-icon toolbar-btn" id="split-btn" title="Split wide image into halves">✂️</button>
        `:""}
        <button class="btn-icon toolbar-btn danger" id="delete-page-btn" title="Delete page">🗑️</button>
        <div class="favorites-btn-wrapper">
          <button class="btn-icon toolbar-btn" id="favorites-btn" title="Add to favorites">⭐</button>
          <div class="favorites-dropdown hidden" id="favorites-dropdown">
            <div class="favorites-dropdown-title">Add to list:</div>
            <div class="favorites-dropdown-list" id="favorites-list-items"></div>
          </div>
        </div>
      </div>
      `}
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${a.mode==="webtoon"?`zoom: ${a.zoom}%`:""}">
        ${a.isGalleryMode?Us():a.mode==="webtoon"?_t():St()}
      </div>
      
      <!-- Footer -->
      <div class="reader-footer">
        <button class="btn btn-secondary" id="prev-chapter-btn">← Prev</button>
        <div class="page-slider-container">
          ${a.mode!=="webtoon"?`
          <input type="range" class="page-slider" id="page-slider"
            min="0" max="${r}" value="${a.currentPage}"
          >
          `:""}
          <span class="page-indicator" id="page-indicator">${o}</span>
        </div>
        <button class="btn btn-secondary" id="next-chapter-btn">Next →</button>
      </div>
      
      <!-- Settings panel -->
      <div class="reader-settings hidden" id="reader-settings">
        <div class="settings-panel">
          <h3>Reader Settings</h3>
          <div class="setting-row">
            <label>Mode</label>
            <div class="btn-group">
              <button class="btn ${a.mode==="webtoon"?"btn-primary":"btn-secondary"}" data-mode="webtoon">Webtoon</button>
              <button class="btn ${a.mode==="manga"?"btn-primary":"btn-secondary"}" data-mode="manga">Manga</button>
            </div>
          </div>
          ${a.mode==="webtoon"?`
          <div class="setting-row">
            <label>Zoom: ${a.zoom}%</label>
            <input type="range" min="50" max="200" value="${a.zoom}" id="zoom-slider">
          </div>
          `:`
          <div class="setting-row">
            <label>Direction</label>
            <div class="btn-group">
              <button class="btn ${a.direction==="rtl"?"btn-primary":"btn-secondary"}" data-direction="rtl">RTL ←</button>
              <button class="btn ${a.direction==="ltr"?"btn-primary":"btn-secondary"}" data-direction="ltr">→ LTR</button>
            </div>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="first-page-single" ${a.firstPageSingle?"checked":""}> First Page Single
            </label>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="last-page-single" ${a.lastPageSingle?"checked":""}> Last Page Single
            </label>
          </div>
          </div>
          `}
          <button class="btn btn-secondary" id="close-settings-btn">Close</button>
        </div>
      </div>
    </div>
  `}function Us(){return`
    <div class="gallery-pages">
      ${a.images.map((s,e)=>{const t=s.displayMode||"single",n=s.displaySide||"left",i=s.urls||[s.url];return t==="double"&&i.length>=2?`
            <div class="gallery-page double-page side-${n}" data-page="${e}">
              <img src="${i[0]}" alt="Page ${e+1}A" loading="lazy">
              <img src="${i[1]}" alt="Page ${e+1}B" loading="lazy">
            </div>
          `:`
            <div class="gallery-page single-page" data-page="${e}">
              <img src="${i[0]}" alt="Page ${e+1}" loading="lazy">
            </div>
          `}).join("")}
    </div>
  `}function _t(){return`
    <div class="webtoon-pages">
      ${a.images.map((s,e)=>{const t=typeof s=="string"?s:s.url,n=a.trophyPages[e];return`
        <div class="webtoon-page ${n?"trophy-page":""}" data-page="${e}">
          ${n?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${t}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function St(){if(a.singlePageMode)return Hs();const e=x()[a.currentPage];if(!e)return"";if(e.type==="link"){const t=e.pages[0],n=a.images[t],i=typeof n=="string"?n:n.url,r=a.trophyPages[t];return`
        <div class="manga-spread ${a.direction}">
          <div class="manga-page ${r?"trophy-page":""}">
            ${r?'<div class="trophy-indicator">🏆</div>':""}
            <img src="${i}" alt="Page ${t+1}">
          </div>
          <div class="manga-page link-page" id="link-page">
            <div class="link-overlay">Ch. ${e.nextChapter} →</div>
            <img src="${e.nextImage}" alt="Next chapter preview">
          </div>
        </div>
      `}return`
    <div class="manga-spread ${a.direction}">
      ${e.map(t=>{const n=a.images[t],i=typeof n=="string"?n:n.url,r=a.trophyPages[t];return`
        <div class="manga-page ${r?"trophy-page":""}">
          ${r?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${i}" alt="Page ${t+1}">
        </div>
      `}).join("")}
    </div>
  `}function Hs(){const s=a.currentPage,e=a.trophyPages[s];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[r,o]=e.pages,c=a.images[r],l=a.images[o],y=typeof c=="string"?c:c==null?void 0:c.url,u=typeof l=="string"?l:l==null?void 0:l.url;if(y&&u)return`
            <div class="manga-spread ${a.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${y}" alt="Page ${r+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${u}" alt="Page ${o+1}"></div>
            </div>
            `}const t=a.images[s];if(!t)return"";const n=typeof t=="string"?t:t.url,i=a.trophyPages[s];return`
    <div class="manga-spread single ${a.direction}">
      <div class="manga-page ${i?"trophy-page":""}">
        ${i?'<div class="trophy-indicator">🏆</div>':""}
        <img src="${n}" alt="Page ${s+1}">
      </div>
    </div>
  `}function x(){const s=[],e=a.images.length;let t=0;for(a.firstPageSingle&&e>0&&(s.push([0]),t=1);t<e;){if(a.trophyPages[t]){s.push([t]),t++;continue}if(a.lastPageSingle&&t===e-1){a.nextChapterImage?s.push({type:"link",pages:[t],nextImage:a.nextChapterImage,nextChapter:a.nextChapterNum}):s.push([t]),t++;break}t+1<e?a.trophyPages[t+1]?(s.push([t]),t++):a.lastPageSingle&&t+1===e-1?(s.push([t]),a.nextChapterImage?s.push({type:"link",pages:[t+1],nextImage:a.nextChapterImage,nextChapter:a.nextChapterNum}):s.push([t+1]),t+=2):(s.push([t,t+1]),t+=2):(s.push([t]),t++)}return s}function Lt(){if(a.singlePageMode)return!!a.trophyPages[a.currentPage];const e=x()[a.currentPage];return e?e.some(t=>!!a.trophyPages[t]):!1}function et(){if(a.singlePageMode)return[a.currentPage];const e=x()[a.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function zs(){if(!a.manga||!a.chapter||a.isGalleryMode)return;const s=et();if(s.length===0)return;const e=s.some(n=>!!a.trophyPages[n]),t=a.singlePageMode||s.length===1;if(e){const n=[...s];if(a.singlePageMode){const i=a.trophyPages[a.currentPage];i&&!i.isSingle&&i.pages&&i.pages.length>1&&(n.length=0,n.push(...i.pages))}n.forEach(i=>delete a.trophyPages[i]),p(`Page${n.length>1?"s":""} unmarked as trophy`,"info")}else{s.forEach(i=>{a.trophyPages[i]={isSingle:t,pages:[...s]}});const n=t?"single":"double";p(`Page${s.length>1?"s":""} marked as trophy (${n}) 🏆`,"success")}try{await w.saveTrophyPages(a.manga.id,a.chapter.number,a.trophyPages)}catch(n){console.error("Failed to save trophy pages:",n)}ee(),Pt()}function Pt(){const s=document.getElementById("trophy-btn");if(s){const e=Lt();s.classList.toggle("active",e),s.title=e?"Unmark trophy":"Mark as trophy"}}async function se(){if(!a.manga||!a.chapter||a.isGalleryMode||!a.images.length)return;let s=1;if(a.mode==="manga")if(a.singlePageMode)s=a.currentPage+1;else{const t=x()[a.currentPage];t&&t.length>0&&(s=t[0]+1)}else{const e=document.getElementById("reader-content");if(e){const t=e.querySelectorAll("img"),n=e.scrollTop;let i=0;t.forEach((r,o)=>{n>=i&&(s=o+1),i+=r.offsetHeight})}}try{await w.updateReadingProgress(a.manga.id,a.chapter.number,s,a.images.length)}catch(e){console.error("Failed to save progress:",e)}}function Bt(){var t,n,i,r,o,c,l,y,u,m,b,k,C,_,A,R,U,V,L;const s=document.getElementById("app");(t=document.getElementById("reader-close-btn"))==null||t.addEventListener("click",async()=>{await se(),a.manga&&a.manga.id!=="gallery"?$.go(`/manga/${a.manga.id}`):$.go("/")}),(n=document.getElementById("reader-back-btn"))==null||n.addEventListener("click",()=>{$.go("/")}),(i=document.getElementById("reader-settings-btn"))==null||i.addEventListener("click",()=>{var h;(h=document.getElementById("reader-settings"))==null||h.classList.toggle("hidden")}),(r=document.getElementById("close-settings-btn"))==null||r.addEventListener("click",()=>{var h;(h=document.getElementById("reader-settings"))==null||h.classList.add("hidden")}),(o=document.getElementById("single-page-btn"))==null||o.addEventListener("click",()=>{if(a.singlePageMode){const h=x();let d=0;for(let v=0;v<h.length;v++)if(h[v].includes(a.currentPage)){d=v;break}a.singlePageMode=!1,a.currentPage=d}else{const d=x()[a.currentPage];a.singlePageMode=!0,a.currentPage=d?d[0]:0}Me()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{zs()}),s.querySelectorAll("[data-mode]").forEach(h=>{h.addEventListener("click",()=>{var P,S;const d=h.dataset.mode;let v=Ws();if(a.mode=d,localStorage.setItem("reader_mode",a.mode),d==="webtoon")a.currentPage=v;else if(a.singlePageMode)a.currentPage=v;else{const O=x();let Z=0;for(let te=0;te<O.length;te++)if(O[te].includes(v)){Z=te;break}a.currentPage=Z}(P=a.manga)!=null&&P.id&&((S=a.chapter)!=null&&S.number)&&me(),Me(),d==="webtoon"&&setTimeout(()=>{const O=document.getElementById("reader-content");if(O){const Z=O.querySelectorAll("img");Z[v]&&Z[v].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),s.querySelectorAll("[data-direction]").forEach(h=>{h.addEventListener("click",async()=>{var d,v;a.direction=h.dataset.direction,localStorage.setItem("reader_direction",a.direction),(d=a.manga)!=null&&d.id&&((v=a.chapter)!=null&&v.number)&&await me(),Me()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async h=>{a.firstPageSingle=h.target.checked,await me(),ee()}),(y=document.getElementById("last-page-single"))==null||y.addEventListener("change",async h=>{var d,v;a.lastPageSingle=h.target.checked,await me(),a.lastPageSingle&&((d=a.manga)!=null&&d.id)&&((v=a.chapter)!=null&&v.number)?await It():(a.nextChapterImage=null,a.nextChapterNum=null),ee()}),(u=document.getElementById("zoom-slider"))==null||u.addEventListener("input",h=>{a.zoom=parseInt(h.target.value);const d=document.getElementById("reader-content");d&&(d.style.zoom=`${a.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",h=>{const d=parseInt(h.target.value),v=document.getElementById("page-indicator");v&&(a.singlePageMode?v.textContent=`${d+1} / ${a.images.length}`:v.textContent=`${d+1} / ${x().length}`)}),e.addEventListener("change",h=>{a.currentPage=parseInt(h.target.value),ee()})),a.mode==="manga"){const h=document.getElementById("reader-content");h==null||h.addEventListener("click",d=>{const v=h.getBoundingClientRect();d.clientX-v.left<v.width/2?xt():At()})}document.addEventListener("keydown",Tt),(m=document.getElementById("prev-chapter-btn"))==null||m.addEventListener("click",()=>_e(-1)),(b=document.getElementById("next-chapter-btn"))==null||b.addEventListener("click",()=>_e(1)),a.mode==="webtoon"&&((k=document.getElementById("reader-content"))==null||k.addEventListener("click",()=>{var h;a.showControls=!a.showControls,(h=document.querySelector(".reader"))==null||h.classList.toggle("controls-hidden",!a.showControls)})),(C=document.getElementById("rotate-btn"))==null||C.addEventListener("click",async()=>{const h=xe();if(!(!h||!a.manga||!a.chapter))try{p("Rotating...","info");const d=await w.rotatePage(a.manga.id,a.chapter.number,h);d.images&&(await fe(d.images),p("Page rotated","success"))}catch(d){p("Rotate failed: "+d.message,"error")}}),(_=document.getElementById("swap-btn"))==null||_.addEventListener("click",async()=>{const d=x()[a.currentPage];if(!d||d.length!==2||!a.manga||!a.chapter){p("Select a spread with 2 pages to swap","info");return}const v=Ce(a.images[d[0]]),P=Ce(a.images[d[1]]);if(!(!v||!P))try{p("Swapping...","info");const S=await w.swapPages(a.manga.id,a.chapter.number,v,P);S.images&&(await fe(S.images),p("Pages swapped","success"))}catch(S){p("Swap failed: "+S.message,"error")}}),(A=document.getElementById("split-btn"))==null||A.addEventListener("click",async()=>{const h=xe();if(!(!h||!a.manga||!a.chapter)&&confirm("Split this page into left and right halves? This is permanent."))try{p("Splitting...","info");const d=await w.splitPage(a.manga.id,a.chapter.number,h);d.images&&(await fe(d.images),p("Page split into halves","success"))}catch(d){p("Split failed: "+d.message,"error")}}),(R=document.getElementById("delete-page-btn"))==null||R.addEventListener("click",async()=>{const h=xe();if(!(!h||!a.manga||!a.chapter)&&confirm(`Delete page "${h}" permanently? This cannot be undone.`))try{p("Deleting...","info");const d=await w.deletePage(a.manga.id,a.chapter.number,h);d.images&&(await fe(d.images),p("Page deleted","success"))}catch(d){p("Delete failed: "+d.message,"error")}}),(U=document.getElementById("favorites-btn"))==null||U.addEventListener("click",async()=>{const h=document.getElementById("favorites-dropdown");if(!h)return;if(h.classList.contains("hidden"))try{const v=await w.getFavorites(),P=Object.keys(v.favorites||v||{});a.favoriteLists=P;const S=document.getElementById("favorites-list-items");S&&(P.length===0?S.innerHTML='<div class="favorites-dropdown-empty">No lists yet</div>':(S.innerHTML=P.map(O=>`<button class="favorites-dropdown-item" data-list="${O}">${O}</button>`).join(""),S.querySelectorAll(".favorites-dropdown-item").forEach(O=>{O.addEventListener("click",async()=>{await Gs(O.dataset.list),h.classList.add("hidden")})})))}catch(v){p("Failed to load favorites: "+v.message,"error");return}h.classList.toggle("hidden")}),document.addEventListener("click",h=>{const d=document.getElementById("favorites-dropdown"),v=document.getElementById("favorites-btn");d&&!d.contains(h.target)&&h.target!==v&&d.classList.add("hidden")}),(V=document.getElementById("fullscreen-btn"))==null||V.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{p("Fullscreen not supported","info")})}),(L=document.getElementById("link-page"))==null||L.addEventListener("click",()=>{a.nextChapterNum&&a.manga&&(se(),a.navigationDirection="next-linked",$.go(`/read/${a.manga.id}/${a.nextChapterNum}`))}),document.body.classList.add("reader-active")}function Ce(s){var i;const e=typeof s=="string"?s:(s==null?void 0:s.url)||((i=s==null?void 0:s.urls)==null?void 0:i[0]);if(!e)return null;const n=e.split("?")[0].split("/");return decodeURIComponent(n[n.length-1])}function xe(){const s=et();return s.length===0?null:Ce(a.images[s[0]])}async function fe(s){const e=Date.now();if(a.images=s.map(t=>t+(t.includes("?")?"&":"?")+`_t=${e}`),a.mode==="manga")if(a.singlePageMode)a.currentPage=Math.min(a.currentPage,a.images.length-1);else{const t=x();a.currentPage=Math.min(a.currentPage,t.length-1)}a.currentPage=Math.max(0,a.currentPage),ee()}async function Gs(s){if(!a.manga||!a.chapter)return;const e=et();if(e.length===0){p("No page selected","info");return}const t=e.map(r=>{const o=Ce(a.images[r]);return o?{filename:o}:null}).filter(Boolean),n=e.length>1?"double":"single",i={mangaId:a.manga.id,chapterNum:a.chapter.number,title:`${a.manga.alias||a.manga.title} Ch.${a.chapter.number} p${e[0]+1}`,imagePaths:t,displayMode:n,displaySide:a.direction==="rtl"?"right":"left"};try{await w.addFavoriteItem(s,i),p(`Added to "${s}" ⭐`,"success")}catch(r){p("Failed to add favorite: "+r.message,"error")}}async function It(){var s,e;if(!(!((s=a.manga)!=null&&s.id)||!((e=a.chapter)!=null&&e.number)))try{const t=await w.getNextChapterPreview(a.manga.id,a.chapter.number);a.nextChapterImage=t.firstImage||null,a.nextChapterNum=t.nextChapter||null}catch{a.nextChapterImage=null,a.nextChapterNum=null}}function js(s,e){return new Promise(t=>{const n=document.createElement("div");n.className="version-modal-overlay",n.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${s.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const i=n.querySelector(".version-list");s.forEach((r,o)=>{const c=document.createElement("button");c.className="version-item",c.textContent=`Version ${o+1}`,c.addEventListener("click",()=>{n.remove(),t(r)}),i.appendChild(c)}),n.querySelector(".version-cancel").addEventListener("click",()=>{n.remove(),t(null)}),n.addEventListener("click",r=>{r.target===n&&(n.remove(),t(null))}),document.body.appendChild(n)})}function Ws(){if(a.mode==="webtoon"){const s=document.getElementById("reader-content");if(s){const e=s.querySelectorAll("img");if(e.length>0){const t=s.scrollTop;if(t>10){let n=0;for(let i=0;i<e.length;i++){const r=e[i].offsetHeight;if(n+r>t)return i;n+=r}}}}return 0}else{if(a.singlePageMode)return a.currentPage;{const e=x()[a.currentPage];return e&&e.length>0?e[0]:0}}}function Tt(s){if(s.key==="Escape"){se(),a.manga&&$.go(`/manga/${a.manga.id}`);return}a.mode==="manga"&&(s.key==="ArrowLeft"?xt():s.key==="ArrowRight"&&At())}function At(){const s=a.singlePageMode?a.images.length-1:x().length-1;a.currentPage<s?(a.currentPage++,ee()):(se(),_e(1))}function xt(){a.currentPage>0?(a.currentPage--,ee()):_e(-1)}function ee(){const s=document.getElementById("reader-content");if(s){s.innerHTML=a.mode==="webtoon"?_t():St();const e=document.getElementById("page-indicator");e&&(a.singlePageMode?e.textContent=`${a.currentPage+1} / ${a.images.length}`:e.textContent=`${a.currentPage+1} / ${x().length}`);const t=document.getElementById("page-slider");t&&(t.value=a.currentPage,t.max=a.singlePageMode?a.images.length-1:x().length-1),Pt()}}function Me(){const s=document.getElementById("app");s&&(s.innerHTML=$e(),Bt())}async function _e(s){if(!a.manga||!a.chapter)return;await se();const t=[...a.manga.downloadedChapters||[]].sort((r,o)=>r-o),i=t.indexOf(a.chapter.number)+s;i>=0&&i<t.length?(a.navigationDirection=s<0?"prev":null,$.go(`/read/${a.manga.id}/${t[i]}`)):p(s>0?"Last chapter":"First chapter","info")}async function Re(s,e,t){var n,i;try{if(a.mode=localStorage.getItem("reader_mode")||"webtoon",a.direction=localStorage.getItem("reader_direction")||"rtl",s==="gallery"){const r=decodeURIComponent(e),c=(await w.getFavorites()).favorites[r]||[];a.images=[];for(const l of c){const y=l.imagePaths||[],u=[];for(const m of y){let b;typeof m=="string"?b=m:m&&typeof m=="object"&&(b=m.filename||m.path||m.name||m.url,b&&b.includes("/")&&(b=b.split("/").pop()),b&&b.includes("\\")&&(b=b.split("\\").pop())),b&&u.push(`/api/public/chapter-images/${l.mangaId}/${l.chapterNum}/${encodeURIComponent(b)}`)}u.length>0&&a.images.push({urls:u,displayMode:l.displayMode||"single",displaySide:l.displaySide||"left"})}a.manga={id:"gallery",title:r,alias:r},a.chapter={number:"Gallery"},a.isGalleryMode=!0,a.images.length===0&&p("Gallery is empty","warning")}else{a.isGalleryMode=!1;const r=await w.getBookmark(s);a.manga=r,a.chapter=((n=r.chapters)==null?void 0:n.find(u=>u.number===parseFloat(e)))||{number:parseFloat(e)};const o=t?`/bookmarks/${s}/chapters/${e}/images?versionUrl=${encodeURIComponent(t)}`:`/bookmarks/${s}/chapters/${e}/images`,c=await w.get(o);a.images=c.images||[];try{const u=await w.getChapterSettings(s,e);u&&(u.mode&&(a.mode=u.mode),u.direction&&(a.direction=u.direction),u.firstPageSingle!==void 0&&(a.firstPageSingle=u.firstPageSingle),u.lastPageSingle!==void 0&&(a.lastPageSingle=u.lastPageSingle))}catch(u){console.warn("Failed to load chapter settings",u)}try{const u=await w.getTrophyPages(s,e);a.trophyPages=u||{}}catch(u){a.trophyPages={},console.warn("Failed to load trophy pages",u)}const l=parseFloat(e),y=(i=r.readingProgress)==null?void 0:i[l];if(y&&y.page<y.totalPages)if(a.mode==="manga")if(a.singlePageMode)a.currentPage=Math.max(0,y.page-1);else{const u=Math.max(0,y.page-1),m=x();let b=0;for(let k=0;k<m.length;k++){const C=m[k],_=Array.isArray(C)?C:C.pages||[];if(_.includes(u)||_[0]>=u){b=k;break}b=k}a.currentPage=b}else a.currentPage=0,a._resumeScrollToPage=y.page-1;else a.currentPage=0}if(a.navigationDirection==="prev"&&a.mode==="manga"){if(a.singlePageMode)a.currentPage=Math.max(0,a.images.length-1);else{const r=x();a.currentPage=Math.max(0,r.length-1)}a.navigationDirection=null}else a.navigationDirection==="next-linked"&&a.mode==="manga"&&(a.currentPage=a.firstPageSingle?1:0),a.navigationDirection=null;a.lastPageSingle&&await It(),a.loading=!1}catch(r){console.error("Failed to load chapter:",r),p("Failed to load chapter: "+(r.message||"Unknown error"),"error"),a.loading=!1}}async function Qs(s=[]){console.log("[Reader] mount called with params:",s);const[e,t]=s;if(!e||!t){$.go("/");return}const n=document.getElementById("app");a.loading=!0,a.images=[],a.singlePageMode=!1,a._resumeScrollToPage=null,a.nextChapterImage=null,a.nextChapterNum=null,n.innerHTML=$e();try{const i=await w.getBookmark(e),r=i.downloadedVersions||{},o=new Set(i.deletedChapterUrls||[]),c=r[parseFloat(t)];let l=[];if(Array.isArray(c)&&(l=c.filter(y=>!o.has(y))),l.length>1){const y=await js(l,t);if(y===null){$.go(`/manga/${e}`);return}await Re(e,t,y)}else await Re(e,t)}catch{await Re(e,t)}if(n.innerHTML=$e(),Bt(),a.mode==="webtoon"&&a._resumeScrollToPage!=null){const i=a._resumeScrollToPage;a._resumeScrollToPage=null,setTimeout(()=>{const r=document.getElementById("reader-content");if(r){const o=r.querySelectorAll("img");o[i]&&o[i].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function Ks(){await se(),document.body.classList.remove("reader-active"),document.removeEventListener("keydown",Tt),a.manga=null,a.chapter=null,a.images=[],a.loading=!0,a.singlePageMode=!1,a._resumeScrollToPage=null}async function me(){if(!(!a.manga||!a.chapter||a.manga.id==="gallery"))try{await w.updateChapterSettings(a.manga.id,a.chapter.number,{mode:a.mode,direction:a.direction,firstPageSingle:a.firstPageSingle,lastPageSingle:a.lastPageSingle})}catch(s){console.error("Failed to save settings:",s)}}async function Mt(s){try{const e=await w.getBookmark(s),t=e.downloadedChapters||[],n=new Set(e.readChapters||[]),i=e.readingProgress||{},r=[...t].sort((c,l)=>c-l);let o=null;for(const c of r){const l=i[c];if(l&&l.page<l.totalPages&&!n.has(c)){o=c;break}}if(o===null){for(const c of r)if(!n.has(c)){o=c;break}}o===null&&r.length>0&&(o=r[0]),o!==null?$.go(`/read/${s}/${o}`):p("No downloaded chapters to read","info")}catch(e){p("Failed to continue reading: "+e.message,"error")}}const Ys={mount:Qs,unmount:Ks,render:$e,continueReading:Mt},le=50;let f={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null};function ze(){var h;if(f.loading)return`
      ${z()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const s=f.manga;if(!s)return`
      ${z()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=s.alias||s.title,t=s.chapters||[],n=new Set(s.downloadedChapters||[]),i=new Set(s.readChapters||[]),r=new Set(s.excludedChapters||[]),o=new Set(s.deletedChapterUrls||[]),c=s.volumes||[],l=new Set;c.forEach(d=>{(d.chapters||[]).forEach(v=>l.add(v))});let y;f.filter==="hidden"?y=t.filter(d=>r.has(d.number)||o.has(d.url)):y=t.filter(d=>!r.has(d.number)&&!o.has(d.url));const u=y.filter(d=>!l.has(d.number));let m=[];if(f.activeVolume){const d=new Set(f.activeVolume.chapters||[]);m=y.filter(v=>d.has(v.number))}else m=u;const b=new Map;m.forEach(d=>{b.has(d.number)||b.set(d.number,[]),b.get(d.number).push(d)});let k=Array.from(b.entries()).sort((d,v)=>d[0]-v[0]);f.filter==="downloaded"?k=k.filter(([d])=>n.has(d)):f.filter==="not-downloaded"?k=k.filter(([d])=>!n.has(d)):f.filter==="main"?k=k.filter(([d])=>Number.isInteger(d)):f.filter==="extra"&&(k=k.filter(([d])=>!Number.isInteger(d)));const C=Math.max(1,Math.ceil(k.length/le));f.currentPage>=C&&(f.currentPage=Math.max(0,C-1));const _=f.currentPage*le,R=[...k.slice(_,_+le)].reverse(),U=b.size,V=[...b.keys()].filter(d=>n.has(d)).length;i.size;let L="";if(f.activeVolume){const d=f.activeVolume;let v=null;d.local_cover?v=`/api/public/covers/${s.id}/${encodeURIComponent(d.local_cover.split(/[/\\]/).pop())}`:d.cover&&(v=d.cover),L=`
      ${z()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${v?`<img src="${v}" alt="${d.name}">`:'<div class="placeholder">📚</div>'}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${s.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${d.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${U} Chapters</span>
                ${V>0?`<span class="meta-item downloaded">${V} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${s.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${d.id}">✏️ Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const d=s.localCover?`/api/public/covers/${s.id}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover;L=`
        ${z()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${d?`<img src="${d}" alt="${e}">`:'<div class="placeholder">📚</div>'}
              </div>
              <div class="manga-detail-info">
                <h1>${e}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent">${s.website||"Local"}</span>
                  <span class="meta-item">${((h=s.chapters)==null?void 0:h.length)||0} Total Chapters</span>
                  ${n.size>0?`<span class="meta-item downloaded">${n.size} Downloaded</span>`:""}
                  ${i.size>0?`<span class="meta-item">${i.size} Read</span>`:""}
                </div>
                <div class="manga-detail-actions">
                  <button class="btn btn-primary" id="continue-btn">
                    ▶ ${s.lastReadChapter?"Continue":"Start"} Reading
                  </button>
              <button class="btn btn-secondary" id="download-all-btn">
                ↓ Download All
              </button>
              <button class="btn btn-secondary" id="refresh-btn">🔄 Refresh</button>
              <button class="btn btn-secondary" id="edit-btn">✏️ Edit</button>
            </div>
            ${s.description?`<p class="manga-description">${s.description}</p>`:""}
            <div class="manga-tags">
              ${(s.tags||[]).map(v=>`<span class="tag">${v}</span>`).join("")}
            </div>
          </div>
        </div>
      `}return`
    ${L}
        
        ${f.activeVolume?"":Zs(s,n)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${f.filter==="all"?"active":""}" data-filter="all">
                All (${b.size})
              </button>
              <button class="filter-btn ${f.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${V})
              </button>
              <button class="filter-btn ${f.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${f.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${C>1?ct(C):""}
          
          <div class="chapter-list">
            ${R.map(([d,v])=>Xs(d,v,n,i,s)).join("")}
          </div>
          
          ${C>1?ct(C):""}
        </div>
      ${Js()}
    </div>
  `}function Js(){return`
    <!-- Edit Volume Modal -->
    <div class="modal" id="edit-volume-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Volume</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="volume-name-input">Volume Name</label>
            <input type="text" id="volume-name-input" placeholder="e.g. Volume 1">
          </div>
          <div class="form-group">
            <label>Cover Image</label>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" id="vol-cover-upload-btn">Upload</button>
                <button class="btn btn-primary" id="vol-cover-selector-btn">Select from Chapter</button>
            </div>
             <p class="text-muted" style="font-size:0.8em; margin-top:5px;">
                You can also set the main series cover using the "Select from Chapter" tool.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger" id="delete-volume-btn" style="margin-right:auto;">Delete Volume</button>
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="save-volume-btn">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Cover Selector Modal -->
    <div class="modal" id="cover-selector-modal" style="z-index: 210;">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 800px;">
        <div class="modal-header">
          <h2>Select Cover Image</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body" style="height: 60vh; display:flex; flex-direction:column;">
          <div class="form-group">
            <label>Select Chapter</label>
            <select id="cover-chapter-select" style="width:100%"></select>
          </div>
          <div id="cover-images-grid" style="flex:1; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:10px; padding:10px; background:var(--bg-secondary); border-radius:var(--radius-sm);">
            <div class="loading-center"><div class="loading-spinner"></div></div>
          </div>
           <div class="form-group" style="margin-top:10px;">
             <label>Apply To:</label>
             <div style="display:flex; gap:15px; align-items:center;">
                <label style="display:inline-flex; align-items:center; gap:5px; margin:0;">
                    <input type="radio" name="cover-target" value="volume" checked> Volume
                </label>
                <label style="display:inline-flex; align-items:center; gap:5px; margin:0;">
                    <input type="radio" name="cover-target" value="manga"> Main Series
                </label>
             </div>
           </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
        </div>
      </div>
    </div>
  `}function Xs(s,e,t,n,i){var V,L;const r=t.has(s),o=n.has(s),c=!Number.isInteger(s),l=((V=i.downloadedVersions)==null?void 0:V[s])||[],y=new Set(i.deletedChapterUrls||[]),u=e.filter(h=>f.filter==="hidden"?!0:!y.has(h.url)),m=!!f.activeVolume;let b=u;m&&(b=u.filter(h=>Array.isArray(l)?l.includes(h.url):l===h.url));const k=b.length>1,C=i.chapterSettings||{},_=m?!0:(L=C[s])==null?void 0:L.locked,A=["chapter-item",r?"downloaded":"",o?"read":"",c?"extra":""].filter(Boolean).join(" "),R=k?`
    <div class="versions-dropdown hidden" id="versions-${s}">
      ${b.map(h=>{const d=encodeURIComponent(h.url),v=Array.isArray(l)?l.includes(h.url):l===h.url;return`
          <div class="version-row ${v?"downloaded":""}"
               data-version-url="${d}" data-num="${s}">
            <span class="version-title">${h.title||h.releaseGroup||"Version"}</span>
            <div class="version-actions">
              ${v?`<button class="btn-icon small success" data-action="read-version" data-num="${s}" data-url="${d}">▶</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${s}" data-url="${d}">🗑️</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${s}" data-url="${d}">↓</button>`}
              ${y.has(h.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${s}" data-url="${d}" title="Restore Version">↩️</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${s}" data-url="${d}" title="Hide Version">👁️‍🗨️</button>`}
            </div>
          </div>
        `}).join("")}
    </div>
  `:"",U=(i.excludedChapters||[]).includes(s);return`
    <div class="chapter-group" data-chapter="${s}">
      <div class="${A}" data-num="${s}" style="${U?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${s}</span>
        <span class="chapter-title">
          ${b[0]?b[0].title!==`Chapter ${s}`?b[0].title:"":e[0].title}
          ${U?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
        </span>
        ${c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${U?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${s}" title="Restore Chapter">↩️</button>`:m?'<span style="margin-right:8px; opacity:0.5; font-size:0.8em">Vol</span>':`<button class="btn-icon small lock-btn ${_?"locked":""}"
                        data-action="lock" data-num="${s}"
                        title="${_?"Unlock":"Lock"}">
                  ${_?"🔒":"🔓"}
                </button>`}       <button class="btn-icon small ${o?"success":"muted"}"
                  data-action="read" data-num="${s}"
                  title="${o?"Mark unread":"Mark read"}">
            ${o?"👁️":"○"}
          </button>
          <button class="btn-icon small ${r?"success":""}"
                  data-action="download" data-num="${s}"
                  title="${r?"Downloaded":"Download"}">
            ${r?"✓":"↓"}
          </button>
          ${k?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${s}">
              ${u.length} ▼
            </button>
          `:""}
        </div>
      </div>
      ${R}
    </div>
  `}function ct(s){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${f.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${f.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${f.currentPage+1} of ${s}</span>
      <button class="btn btn-icon" data-page="next" ${f.currentPage>=s-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${f.currentPage>=s-1?"disabled":""}>»</button>
    </div>
  `}function Zs(s,e){const t=s.volumes||[];return t.length===0?"":`
    <div class="volumes-section">
      <h2>Volumes</h2>
      <div class="volumes-grid">
        ${t.map(i=>{const r=i.chapters||[],o=r.filter(c=>e.has(c)).length;return`
      <div class="volume-card" data-volume-id="${i.id}">
        <div class="volume-cover">
          ${i.cover?`<img src="${i.cover}" alt="${i.name}">`:'<div class="placeholder">📚</div>'}
          <div class="volume-badges">
            <span class="badge badge-chapters">${r.length} ch</span>
            ${o>0?`<span class="badge badge-downloaded">${o}</span>`:""}
          </div>
        </div>
        <div class="volume-info">
          <div class="volume-name">${i.name}</div>
        </div>
      </div>
    `}).join("")}
      </div>
    </div>
  `}function en(){var t,n,i,r,o;const s=document.getElementById("app"),e=f.manga;e&&((t=document.getElementById("back-btn"))==null||t.addEventListener("click",()=>$.go("/")),(n=document.getElementById("back-library-btn"))==null||n.addEventListener("click",()=>$.go("/")),(i=document.getElementById("continue-btn"))==null||i.addEventListener("click",()=>{Mt(e.id)}),(r=document.getElementById("download-all-btn"))==null||r.addEventListener("click",async()=>{try{p("Queueing downloads...","info"),p("Download queued!","success")}catch(c){p("Failed to download: "+c.message,"error")}}),(o=document.getElementById("check-updates-btn"))==null||o.addEventListener("click",async()=>{try{p("Checking for updates...","info"),await w.post(`/bookmarks/${e.id}/quick-check`),p("Check complete!","success")}catch(c){p("Check failed: "+c.message,"error")}}),s.querySelectorAll(".filter-btn").forEach(c=>{c.addEventListener("click",()=>{f.filter=c.dataset.filter,f.currentPage=0,N([e.id])})}),s.querySelectorAll("[data-page]").forEach(c=>{c.addEventListener("click",()=>{const l=c.dataset.page,y=Math.ceil(f.manga.chapters.length/le);switch(l){case"first":f.currentPage=0;break;case"prev":f.currentPage=Math.max(0,f.currentPage-1);break;case"next":f.currentPage=Math.min(y-1,f.currentPage+1);break;case"last":f.currentPage=y-1;break}N([e.id])})}),s.querySelectorAll(".chapter-item").forEach(c=>{c.addEventListener("click",l=>{if(l.target.closest(".chapter-actions"))return;const y=parseFloat(c.dataset.num);(e.downloadedChapters||[]).includes(y)?$.go(`/read/${e.id}/${y}`):p("Chapter not downloaded","info")})}),s.querySelectorAll("[data-action]").forEach(c=>{c.addEventListener("click",async l=>{l.stopPropagation();const y=c.dataset.action,u=parseFloat(c.dataset.num),m=c.dataset.url?decodeURIComponent(c.dataset.url):null;switch(y){case"lock":await tn(u);break;case"read":await sn(u);break;case"download":await nn(u);break;case"versions":an(u);break;case"read-version":$.go(`/read/${e.id}/${u}?version=${encodeURIComponent(m)}`);break;case"download-version":await rn(u,m);break;case"delete-version":await on(u,m);break;case"hide-version":await cn(u,m);break;case"restore-version":await ln(u,m);break;case"restore-chapter":await dn(u);break}})}),s.querySelectorAll(".volume-card").forEach(c=>{c.addEventListener("click",()=>{const l=c.dataset.volumeId;$.go(`/manga/${e.id}/volume/${l}`)})}),pn(s),M.subscribeToManga(e.id))}async function tn(s){var i;const e=f.manga,t=((i=e.chapterSettings)==null?void 0:i[s])||{},n=!t.locked;try{n?await w.lockChapter(e.id,s):await w.unlockChapter(e.id,s),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[s]={...t,locked:n},p(n?"Chapter locked":"Chapter unlocked","success"),N([e.id])}catch(r){p("Failed: "+r.message,"error")}}async function sn(s){const e=f.manga,t=new Set(e.readChapters||[]),n=t.has(s);try{await w.post(`/bookmarks/${e.id}/chapters/${s}/read`,{read:!n}),n?t.delete(s):t.add(s),e.readChapters=[...t],p(n?"Marked unread":"Marked read","success"),N([e.id])}catch(i){p("Failed: "+i.message,"error")}}async function nn(s){const e=f.manga;try{p(`Downloading chapter ${s}...`,"info"),await w.post(`/bookmarks/${e.id}/download`,{chapter:s}),p("Download queued!","success")}catch(t){p("Failed: "+t.message,"error")}}function an(s){document.querySelectorAll(".versions-dropdown").forEach(t=>{t.id!==`versions-${s}`&&t.classList.add("hidden")});const e=document.getElementById(`versions-${s}`);e&&e.classList.toggle("hidden")}async function rn(s,e){const t=f.manga;try{p("Downloading version...","info"),await w.post(`/bookmarks/${t.id}/download`,{chapter:s,url:e}),p("Download queued!","success")}catch(n){p("Failed: "+n.message,"error")}}async function on(s,e){const t=f.manga;if(confirm("Delete this version from disk?"))try{await w.delete(`/bookmarks/${t.id}/chapters/${s}/version?url=${encodeURIComponent(e)}`),p("Version deleted","success"),await J(t.id),N([t.id])}catch(n){p("Failed: "+n.message,"error")}}async function cn(s,e){const t=f.manga;try{await w.hideVersion(t.id,s,e),p("Version hidden","success"),await J(t.id),N([t.id])}catch(n){p("Failed: "+n.message,"error")}}async function ln(s,e){const t=f.manga;try{await w.unhideVersion(t.id,s,e),p("Version restored","success"),await J(t.id),N([t.id])}catch(n){p("Failed to restore version: "+n.message,"error")}}async function dn(s){const e=f.manga;try{await w.unexcludeChapter(e.id,s),p("Chapter restored","success"),await J(e.id),N([e.id])}catch(t){p("Failed to restore chapter: "+t.message,"error")}}async function J(s){try{const[e,t]=await Promise.all([w.getBookmark(s),Y.loadCategories()]);f.manga=e,f.categories=t,f.loading=!1;const n=new Set((e.chapters||[]).map(r=>r.number)).size,i=Math.ceil(n/le);f.currentPage=Math.max(0,i-1),f.activeVolumeId?f.activeVolume=(e.volumes||[]).find(r=>r.id===f.activeVolumeId):f.activeVolume=null}catch{p("Failed to load manga","error"),f.loading=!1}}async function N(s=[]){const[e,t,n]=s;if(!e){$.go("/");return}f.activeVolumeId=t==="volume"?n:null;const i=document.getElementById("app");!f.manga||f.manga.id!==e?(f.loading=!0,f.manga=null,i.innerHTML=ze(),await J(e)):f.activeVolumeId?f.activeVolume=(f.manga.volumes||[]).find(r=>r.id===f.activeVolumeId):f.activeVolume=null,i.innerHTML=ze(),en()}function un(){f.manga&&M.unsubscribeFromManga(f.manga.id),f.manga=null,f.loading=!0}const hn={mount:N,unmount:un,render:ze};function pn(s){const e=f.manga;if(!e)return;const t=s.querySelector("#edit-vol-btn"),n=s.querySelector("#edit-volume-modal");t&&n&&t.addEventListener("click",()=>{const u=t.dataset.volId,m=e.volumes.find(b=>b.id===u);m&&(s.querySelector("#volume-name-input").value=m.name,n.dataset.editingVolId=u,n.classList.add("open"))});const i=s.querySelector("#save-volume-btn");i&&i.addEventListener("click",async()=>{const u=n.dataset.editingVolId,m=s.querySelector("#volume-name-input").value.trim();if(!m)return p("Volume name cannot be empty","error");try{await w.renameVolume(e.id,u,m),p("Volume renamed","success"),n.classList.remove("open"),await J(e.id),N([e.id,"volume",u])}catch(b){p(b.message,"error")}});const r=s.querySelector("#delete-volume-btn");r&&r.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const u=n.dataset.editingVolId;try{await w.deleteVolume(e.id,u),p("Volume deleted","success"),n.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch(m){p(m.message,"error")}});const o=s.querySelector("#vol-cover-upload-btn");if(o){let u=document.getElementById("vol-cover-input-hidden");u||(u=document.createElement("input"),u.type="file",u.id="vol-cover-input-hidden",u.accept="image/*",u.style.display="none",document.body.appendChild(u),u.addEventListener("change",async m=>{const b=m.target.files[0];if(!b)return;const k=n.dataset.editingVolId;if(!k)return;const C=new FormData;C.append("cover",b);try{await fetch(`/api/bookmarks/${e.id}/volumes/${k}/cover`,{method:"POST",body:C,headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}),p("Cover uploaded","success"),await J(e.id),N([e.id,"volume",k])}catch(_){p("Upload failed: "+_.message,"error")}})),o.addEventListener("click",()=>u.click())}const c=s.querySelector("#vol-cover-selector-btn"),l=s.querySelector("#cover-selector-modal");c&&l&&c.addEventListener("click",async()=>{const u=l.querySelector("#cover-chapter-select");u.innerHTML='<option value="">Select a chapter...</option>';const m=s.querySelector("#edit-volume-modal"),b=m?m.dataset.editingVolId:null;let k=[...e.chapters||[]];if(b){const _=e.volumes.find(A=>A.id===b);if(_&&_.chapters){const A=new Set(_.chapters);k=k.filter(R=>A.has(R.number))}}k.sort((_,A)=>_.number-A.number);const C=new Set;k.forEach(_=>{if(!C.has(_.number)){C.add(_.number);const A=document.createElement("option");A.value=_.number,A.textContent=`Chapter ${_.number}`,u.appendChild(A)}}),k.length>0&&(u.value=k[0].number,lt(e.id,k[0].number)),l.classList.add("open")});const y=s.querySelector("#cover-chapter-select");y&&y.addEventListener("change",u=>{u.target.value&&lt(e.id,u.target.value)}),s.querySelectorAll(".modal-close, .modal-close-btn").forEach(u=>{u.addEventListener("click",()=>{u.closest(".modal").classList.remove("open")})}),s.querySelectorAll(".modal-overlay").forEach(u=>{u.addEventListener("click",()=>{u.closest(".modal").classList.remove("open")})})}async function lt(s,e){const t=document.getElementById("cover-images-grid");if(t){t.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const i=(await w.getChapterImages(s,e)).images||[];if(t.innerHTML="",i.length===0){t.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}i.forEach(r=>{const o=document.createElement("div");o.className="cover-grid-item",o.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",o.innerHTML=`<img src="${r}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,o.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=r.split("/").pop();gn(l,e,c)}),t.appendChild(o)})}catch(n){t.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${n.message}</div>`}}}async function gn(s,e,t){const n=f.manga,i=document.getElementById("edit-volume-modal"),r=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${t} cover?`))try{if(t==="volume"){const o=i.dataset.editingVolId;if(!o)throw new Error("No volume selected");await w.setVolumeCoverFromChapter(n.id,o,e,s),p("Volume cover updated","success"),r.classList.remove("open"),i.classList.remove("open"),await J(n.id),N([n.id,"volume",o])}else{await w.setMangaCoverFromChapter(n.id,e,s),p("Series cover updated","success"),r.classList.remove("open"),await J(n.id);const o=window.location.hash.replace("#","");f.activeVolumeId?N([n.id,"volume",f.activeVolumeId]):N([n.id])}}catch(o){p("Failed to set cover: "+o.message,"error")}}let G={series:null,loading:!0};function ue(){if(G.loading)return`
      ${z("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const s=G.series;if(!s)return`
      ${z("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=s.alias||s.title,t=s.entries||[],n=t.reduce((r,o)=>r+(o.chapter_count||0),0);let i=null;if(t.length>0){const r=t[0];r.local_cover&&r.bookmark_id?i=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.local_cover.split(/[/\\]/).pop())}`:r.localCover&&r.bookmark_id?i=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.localCover.split(/[/\\]/).pop())}`:r.cover&&(i=r.cover)}return`
    ${z("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${i?`<img src="${i}" alt="${e}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>'}
          </div>
          <div class="series-detail-info">
            <h1>${e}</h1>
            <div class="series-detail-meta">
              <span class="meta-item">${t.length} Entries</span>
              <span class="meta-item">${n} Total Chapters</span>
            </div>
            <div class="series-detail-actions">
              <button class="btn btn-secondary" id="add-entry-btn">+ Add Entry</button>
              <button class="btn btn-secondary" id="edit-series-btn">✏️ Edit</button>
              <button class="btn btn-secondary" id="back-library-btn">← Library</button>
            </div>
          </div>
        </div>
        
        <div class="series-entries-section">
          <h2>Entries</h2>
          <div class="series-entries-grid">
            ${t.map((r,o)=>fn(r,o,t.length)).join("")}
          </div>
        </div>
      </div>
    </div>
  `}function fn(s,e,t){var r;const n=s.alias||s.title;let i=null;return s.local_cover?i=`/api/public/covers/${s.bookmark_id}/${encodeURIComponent(s.local_cover.split(/[/\\]/).pop())}`:s.localCover?i=`/api/public/covers/${s.bookmark_id}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover&&(i=s.cover),`
    <div class="series-entry-card" data-id="${s.bookmark_id}" data-order="${s.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${e+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${s.bookmark_id}" ${e===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${s.bookmark_id}" ${e===t-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${i?`<img src="${i}" alt="${n}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:'<div class="placeholder">📚</div>'}
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${s.chapter_count||0} ch</span>
          ${((r=s.downloadedChapters)==null?void 0:r.length)>0?`<span class="badge badge-downloaded">${s.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${s.bookmark_id}" title="Use as series cover">🖼️</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${n}</div>
      </div>
    </div>
  `}function tt(){var e,t,n,i;const s=document.getElementById("app");(e=document.getElementById("back-btn"))==null||e.addEventListener("click",()=>$.go("/")),(t=document.getElementById("back-library-btn"))==null||t.addEventListener("click",()=>$.go("/")),s.querySelectorAll(".series-entry-card").forEach(r=>{r.addEventListener("click",o=>{if(o.target.closest("[data-action]"))return;const c=r.dataset.id;$.go(`/manga/${c}`)})}),s.querySelectorAll("[data-action]").forEach(r=>{r.addEventListener("click",async o=>{o.stopPropagation();const c=r.dataset.action,l=r.dataset.id;switch(c){case"move-up":await dt(l,-1);break;case"move-down":await dt(l,1);break;case"set-cover":await mn(l);break}})}),(n=document.getElementById("add-entry-btn"))==null||n.addEventListener("click",()=>{p("Add entry modal coming soon","info")}),(i=document.getElementById("edit-series-btn"))==null||i.addEventListener("click",()=>{p("Edit series coming soon","info")})}async function dt(s,e){const t=G.series;if(!t)return;const n=t.entries||[],i=n.findIndex(c=>c.bookmark_id===s);if(i===-1)return;const r=i+e;if(r<0||r>=n.length)return;const o=n.map(c=>c.bookmark_id);[o[i],o[r]]=[o[r],o[i]];try{await w.post(`/series/${t.id}/reorder`,{order:o}),p("Order updated","success"),await st(t.id);const c=document.getElementById("app");c.innerHTML=ue(),tt()}catch(c){p("Failed to reorder: "+c.message,"error")}}async function mn(s){const e=G.series;if(e)try{await w.post(`/series/${e.id}/cover`,{bookmark_id:s}),p("Series cover updated","success"),await st(e.id);const t=document.getElementById("app");t.innerHTML=ue(),tt()}catch(t){p("Failed to set cover: "+t.message,"error")}}async function st(s){try{const e=await w.get(`/series/${s}`);G.series=e,G.loading=!1}catch{p("Failed to load series","error"),G.loading=!1}}async function vn(s=[]){const[e]=s;if(!e){$.go("/");return}const t=document.getElementById("app");G.loading=!0,G.series=null,t.innerHTML=ue(),await st(e),t.innerHTML=ue(),tt()}function yn(){G.series=null,G.loading=!0}const bn={mount:vn,unmount:yn,render:ue},wn={mount:async s=>{const e=document.getElementById("app");e.innerHTML=`
            <div class="settings-container">
                <header class="settings-header">
                    <h1>Settings</h1>
                </header>
                <div class="settings-content">
                    <div id="settings-loader" class="loader">Loading settings...</div>
                    <form id="settings-form" style="display: none;">
                        <div class="settings-group">
                            <h2>General</h2>
                            <div class="setting-item">
                                <label for="theme">Theme</label>
                                <select id="theme" name="theme">
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                    <option value="system">System Default</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Add more settings here as needed -->

                        <div class="settings-actions">
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;try{const t=await w.get("/settings")||{},n=document.getElementById("settings-form"),i=document.getElementById("settings-loader");t.theme&&(document.getElementById("theme").value=t.theme),i.style.display="none",n.style.display="block",n.addEventListener("submit",async r=>{r.preventDefault();const o=new FormData(n),c={};for(const[l,y]of o.entries())c[l]=y;try{await w.post("/settings/bulk",c),p("Settings saved successfully"),c.theme}catch(l){console.error(l),p("Failed to save settings","error")}})}catch(t){console.error(t),document.getElementById("settings-loader").textContent="Error loading settings"}}},kn={mount:async s=>{const e=document.getElementById("app");e.innerHTML=`
            <div class="admin-container">
                <header class="admin-header">
                    <h1>System Admin</h1>
                </header>
                <div class="admin-layout">
                    <aside class="admin-sidebar" id="admin-sidebar">
                        <div class="loader">Loading tables...</div>
                    </aside>
                    <main class="admin-main" id="admin-main">
                        <div class="empty-state">Select a table to view data</div>
                    </main>
                </div>
            </div>
        `,await En()}};async function En(){try{const s=await w.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
            <h3>Tables</h3>
            <ul class="table-list">
                ${s.tables.map(t=>`
                    <li>
                        <a href="#/admin/tables/${t.name}" class="table-link" data-table="${t.name}">
                            ${t.name} <span class="badge">${t.rowCount}</span>
                        </a>
                    </li>
                `).join("")}
            </ul>
        `,e.querySelectorAll(".table-link").forEach(t=>{t.addEventListener("click",n=>{n.preventDefault();const i=n.currentTarget.dataset.table;Ge(i),e.querySelectorAll(".table-link").forEach(r=>r.classList.remove("active")),n.currentTarget.classList.add("active")})})}catch(s){console.error(s),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function Ge(s,e=0){var n,i;const t=document.getElementById("admin-main");t.innerHTML=`<div class="loader">Loading ${s}...</div>`;try{const o=await w.get(`/admin/tables/${s}?page=${e}&limit=50`);if(!o.rows||o.rows.length===0){t.innerHTML=`
                <h2>${s}</h2>
                <div class="empty-state">No records found</div>
            `;return}const c=Object.keys(o.rows[0]);t.innerHTML=`
            <div class="table-header">
                <h2>${s}</h2>
                <div class="table-actions">
                    <span class="page-info">
                        Page ${o.pagination.page+1} of ${o.pagination.totalPages} 
                        (${o.pagination.total} records)
                    </span>
                    <div class="pagination">
                        <button ${e===0?"disabled":""} id="prev-page">Previous</button>
                        <button ${!o.pagination.hasMore&&e>=o.pagination.totalPages-1?"disabled":""} id="next-page">Next</button>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${c.map(l=>`<th>${l}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${o.rows.map(l=>`
                            <tr>
                                ${c.map(y=>{const u=l[y];let m=u;return u===null?m='<span class="null">NULL</span>':typeof u=="object"?m=JSON.stringify(u):String(u).length>100&&(m=String(u).substring(0,100)+"..."),`<td>${m}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(n=document.getElementById("prev-page"))==null||n.addEventListener("click",()=>Ge(s,e-1)),(i=document.getElementById("next-page"))==null||i.addEventListener("click",()=>Ge(s,e+1))}catch(r){console.error(r),t.innerHTML=`<div class="error">Failed to load data for ${s}</div>`}}let T={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function $n(s,e){let t=null;if(e.length>0){const i=e[0];if(i.imagePaths&&i.imagePaths.length>0){const r=i.imagePaths[0];let o;typeof r=="string"?o=r:r&&typeof r=="object"&&(o=r.filename||r.path||r.name||r.url,o&&o.includes("/")&&(o=o.split("/").pop()),o&&o.includes("\\")&&(o=o.split("\\").pop())),o&&(t=`/api/public/chapter-images/${i.mangaId}/${i.chapterNum}/${encodeURIComponent(o)}`)}}const n=e.reduce((i,r)=>{var o;return i+(((o=r.imagePaths)==null?void 0:o.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${s}">
      <div class="manga-card-cover">
        ${t?`<img src="${t}" alt="${s}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📁</div>'">`:'<div class="placeholder">📁</div>'}
        <div class="manga-card-badges">
            <span class="badge badge-series">${n} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${s}</div>
    </div>
  `}function Cn(s){const e=T.bookmarks.find(t=>t.id===s);return e?e.alias||e.title:s}function _n(s){const e=T.bookmarks.find(t=>t.id===s);if(e&&e.seriesId){const t=T.series.find(n=>n.id===e.seriesId);if(t)return{id:t.id,name:t.alias||t.title}}return null}function Sn(s,e,t,n=!1){return`
    <div class="manga-card trophy-gallery-card" data-trophy-id="${s}" data-is-series="${n}">
      <div class="manga-card-cover">
        <div class="placeholder trophy-placeholder">🏆</div>
        <div class="manga-card-badges">
            <span class="badge badge-trophy">🏆 ${t}</span>
            ${n?'<span class="badge badge-series">Series</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Ln(){const s={};console.log("Building trophy groups from:",T.trophyPages);for(const e of Object.keys(T.trophyPages)){const t=T.trophyPages[e];let n=0;for(const[r,o]of Object.entries(t))n+=Object.keys(o).length;if(console.log(`Manga ${e}: ${n} trophies`),n===0)continue;const i=_n(e);if(i)s[i.id]||(s[i.id]={name:i.name,isSeries:!0,count:0,mangaIds:[]}),s[i.id].count+=n,s[i.id].mangaIds.push(e);else{const r=Cn(e);console.log(`No series for ${e}, using name: ${r}`),s[e]={name:r,isSeries:!1,count:n,mangaIds:[e]}}}return console.log("Trophy groups result:",s),s}function Se(){if(T.loading)return`
      ${z("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:s,listOrder:e}=T.favorites,t=`
    <div class="favorites-tabs">
      <button class="tab-btn ${T.activeTab==="galleries"?"active":""}" data-tab="galleries">
        📁 Galleries
      </button>
      <button class="tab-btn ${T.activeTab==="trophies"?"active":""}" data-tab="trophies">
        🏆 Trophies
      </button>
    </div>
  `;let n="";if(T.activeTab==="galleries")e.length===0?n=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:n=`
        <div class="library-grid">
          ${e.map(r=>{const o=s&&s[r]||[];return $n(r,o)}).join("")}
        </div>
      `;else{const i=Ln(),r=Object.keys(i);r.length===0?n=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:n=`
        <div class="library-grid">
          ${r.map(c=>{const l=i[c];return Sn(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${z("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${t}
      ${n}
    </div>
  `}function Rt(){de();const s=document.getElementById("app");s.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",()=>{T.activeTab=t.dataset.tab,s.innerHTML=Se(),Rt()})});const e=s.querySelectorAll(".gallery-card");console.log("[Favorites] Found gallery cards:",e.length),e.forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.gallery;console.log("[Favorites] Gallery clicked:",n),$.go(`/read/gallery/${encodeURIComponent(n)}`)})}),s.querySelectorAll(".trophy-gallery-card").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.trophyId;t.dataset.isSeries==="true"?$.go(`/series/${n}`):$.go(`/manga/${n}`)})})}async function Pn(){try{const[s,e,t,n]=await Promise.all([Y.loadFavorites(),w.get("/trophy-pages"),Y.loadBookmarks(),Y.loadSeries()]);T.favorites=s||{favorites:{},listOrder:[]},T.trophyPages=e||{},T.bookmarks=t||[],T.series=n||[],T.loading=!1}catch(s){console.error("Failed to load favorites:",s),p("Failed to load favorites","error"),T.loading=!1}}async function Bn(){console.log("[Favorites] mount called"),T.loading=!0;const s=document.getElementById("app");s.innerHTML=Se(),await Pn(),console.log("[Favorites] Data loaded, rendering..."),s.innerHTML=Se(),console.log("[Favorites] Calling setupListeners..."),Rt(),console.log("[Favorites] setupListeners complete")}function In(){}const Tn={mount:Bn,unmount:In,render:Se};class An{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,t){this.routes.set(e,t)}async navigate(){const e=window.location.hash.slice(1)||"/",[t,...n]=e.split("/").filter(Boolean),i=`/${t||""}`;this.currentView&&this.currentView.unmount&&this.currentView.unmount();let r=this.routes.get(i);!r&&this.routes.has("/")&&(r=this.routes.get("/")),r&&(this.currentRoute=i,this.currentView=r,r.mount&&await r.mount(n),de())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),de())}}const $=new An;$.register("/",qs);$.register("/manga",hn);$.register("/read",Ys);$.register("/series",bn);$.register("/settings",wn);$.register("/admin",kn);$.register("/favorites",Tn);class xn{constructor(){this.currentView=null,this.mangaCache=new Map}async init(){if(console.log("[App] Initializing..."),!w.isAuthenticated()){window.location.href="/login.html";return}M.connect(),this.setupSocketListeners(),$.init(),this.hideLoading(),console.log("[App] Ready")}setupSocketListeners(){M.on(F.CHAPTER_DOWNLOADED,e=>{console.log("[Socket] Chapter downloaded:",e),this.onChapterUpdate(e)}),M.on(F.CHAPTER_HIDDEN,e=>{console.log("[Socket] Chapter hidden:",e),this.onChapterUpdate(e)}),M.on(F.CHAPTER_UNHIDDEN,e=>{console.log("[Socket] Chapter unhidden:",e),this.onChapterUpdate(e)}),M.on(F.MANGA_UPDATED,e=>{console.log("[Socket] Manga updated:",e),this.onMangaUpdate(e)}),M.on(F.DOWNLOAD_PROGRESS,e=>{this.onDownloadProgress(e)}),M.on(F.DOWNLOAD_COMPLETED,e=>{console.log("[Socket] Download completed:",e),this.showToast(`Downloaded: ${e.chapterNumber}`,"success")}),M.on(F.QUEUE_UPDATED,e=>{this.onQueueUpdate(e)}),M.on(F.ACTION_RECORDED,e=>{console.log("[Socket] Action recorded:",e),this.updateUndoButton()}),M.on(F.ACTION_UNDONE,e=>{console.log("[Socket] Action undone:",e),this.showToast("Action undone","info"),this.updateUndoButton()})}onChapterUpdate(e){window.dispatchEvent(new CustomEvent("chapter:update",{detail:e}))}onMangaUpdate(e){this.mangaCache.delete(e.mangaId),window.dispatchEvent(new CustomEvent("manga:update",{detail:e}))}onDownloadProgress(e){window.dispatchEvent(new CustomEvent("download:progress",{detail:e}))}onQueueUpdate(e){window.dispatchEvent(new CustomEvent("queue:update",{detail:e}))}async updateUndoButton(){try{const{undoableCount:e}=await w.getActions({limit:1}),t=document.getElementById("undo-btn");if(t){t.style.display=e>0?"flex":"none";const n=t.querySelector(".count");n&&(n.textContent=e)}}catch{}}showToast(e,t="info"){const n=document.createElement("div");n.className=`toast toast-${t}`,n.textContent=e,document.body.appendChild(n),requestAnimationFrame(()=>n.classList.add("show")),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>n.remove(),300)},3e3)}hideLoading(){const e=document.querySelector(".loading-screen");e&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),300))}}const Mn=new xn;document.addEventListener("DOMContentLoaded",()=>Mn.init());
