import{a as g}from"./api-B9ZAqTvz.js";const Ie=Object.create(null);Ie.open="0";Ie.close="1";Ie.ping="2";Ie.pong="3";Ie.message="4";Ie.upgrade="5";Ie.noop="6";const gt=Object.create(null);Object.keys(Ie).forEach(e=>{gt[Ie[e]]=e});const Kt={type:"error",data:"parser error"},na=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",ra=typeof ArrayBuffer=="function",oa=e=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(e):e&&e.buffer instanceof ArrayBuffer,ys=({type:e,data:t},s,a)=>na&&t instanceof Blob?s?a(t):Ds(t,a):ra&&(t instanceof ArrayBuffer||oa(t))?s?a(t):Ds(new Blob([t]),a):a(Ie[e]+(t||"")),Ds=(e,t)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];t("b"+(a||""))},s.readAsDataURL(e)};function Fs(e){return e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}let jt;function Ga(e,t){if(na&&e.data instanceof Blob)return e.data.arrayBuffer().then(Fs).then(t);if(ra&&(e.data instanceof ArrayBuffer||oa(e.data)))return t(Fs(e.data));ys(e,!1,s=>{jt||(jt=new TextEncoder),t(jt.encode(s))})}const Ns="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",st=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let e=0;e<Ns.length;e++)st[Ns.charCodeAt(e)]=e;const Ka=e=>{let t=e.length*.75,s=e.length,a,n=0,r,i,c,l;e[e.length-1]==="="&&(t--,e[e.length-2]==="="&&t--);const d=new ArrayBuffer(t),u=new Uint8Array(d);for(a=0;a<s;a+=4)r=st[e.charCodeAt(a)],i=st[e.charCodeAt(a+1)],c=st[e.charCodeAt(a+2)],l=st[e.charCodeAt(a+3)],u[n++]=r<<2|i>>4,u[n++]=(i&15)<<4|c>>2,u[n++]=(c&3)<<6|l&63;return d},Ya=typeof ArrayBuffer=="function",bs=(e,t)=>{if(typeof e!="string")return{type:"message",data:ia(e,t)};const s=e.charAt(0);return s==="b"?{type:"message",data:Ja(e.substring(1),t)}:gt[s]?e.length>1?{type:gt[s],data:e.substring(1)}:{type:gt[s]}:Kt},Ja=(e,t)=>{if(Ya){const s=Ka(e);return ia(s,t)}else return{base64:!0,data:e}},ia=(e,t)=>{switch(t){case"blob":return e instanceof Blob?e:new Blob([e]);case"arraybuffer":default:return e instanceof ArrayBuffer?e:e.buffer}},la="",Xa=(e,t)=>{const s=e.length,a=new Array(s);let n=0;e.forEach((r,i)=>{ys(r,!1,c=>{a[i]=c,++n===s&&t(a.join(la))})})},Za=(e,t)=>{const s=e.split(la),a=[];for(let n=0;n<s.length;n++){const r=bs(s[n],t);if(a.push(r),r.type==="error")break}return a};function en(){return new TransformStream({transform(e,t){Ga(e,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const r=new DataView(n.buffer);r.setUint8(0,126),r.setUint16(1,a)}else{n=new Uint8Array(9);const r=new DataView(n.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(a))}e.data&&typeof e.data!="string"&&(n[0]|=128),t.enqueue(n),t.enqueue(s)})}})}let zt;function ut(e){return e.reduce((t,s)=>t+s.length,0)}function pt(e,t){if(e[0].length===t)return e.shift();const s=new Uint8Array(t);let a=0;for(let n=0;n<t;n++)s[n]=e[0][a++],a===e[0].length&&(e.shift(),a=0);return e.length&&a<e[0].length&&(e[0]=e[0].slice(a)),s}function tn(e,t){zt||(zt=new TextDecoder);const s=[];let a=0,n=-1,r=!1;return new TransformStream({transform(i,c){for(s.push(i);;){if(a===0){if(ut(s)<1)break;const l=pt(s,1);r=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(ut(s)<2)break;const l=pt(s,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(ut(s)<8)break;const l=pt(s,8),d=new DataView(l.buffer,l.byteOffset,l.length),u=d.getUint32(0);if(u>Math.pow(2,21)-1){c.enqueue(Kt);break}n=u*Math.pow(2,32)+d.getUint32(4),a=3}else{if(ut(s)<n)break;const l=pt(s,n);c.enqueue(bs(r?l:zt.decode(l),t)),a=0}if(n===0||n>e){c.enqueue(Kt);break}}}})}const ca=4;function re(e){if(e)return sn(e)}function sn(e){for(var t in re.prototype)e[t]=re.prototype[t];return e}re.prototype.on=re.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+e]=this._callbacks["$"+e]||[]).push(t),this};re.prototype.once=function(e,t){function s(){this.off(e,s),t.apply(this,arguments)}return s.fn=t,this.on(e,s),this};re.prototype.off=re.prototype.removeListener=re.prototype.removeAllListeners=re.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+e];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+e],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===t||a.fn===t){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+e],this};re.prototype.emit=function(e){this._callbacks=this._callbacks||{};for(var t=new Array(arguments.length-1),s=this._callbacks["$"+e],a=1;a<arguments.length;a++)t[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,t)}return this};re.prototype.emitReserved=re.prototype.emit;re.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks["$"+e]||[]};re.prototype.hasListeners=function(e){return!!this.listeners(e).length};const _t=typeof Promise=="function"&&typeof Promise.resolve=="function"?t=>Promise.resolve().then(t):(t,s)=>s(t,0),we=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),an="arraybuffer";function da(e,...t){return t.reduce((s,a)=>(e.hasOwnProperty(a)&&(s[a]=e[a]),s),{})}const nn=we.setTimeout,rn=we.clearTimeout;function Pt(e,t){t.useNativeTimers?(e.setTimeoutFn=nn.bind(we),e.clearTimeoutFn=rn.bind(we)):(e.setTimeoutFn=we.setTimeout.bind(we),e.clearTimeoutFn=we.clearTimeout.bind(we))}const on=1.33;function ln(e){return typeof e=="string"?cn(e):Math.ceil((e.byteLength||e.size)*on)}function cn(e){let t=0,s=0;for(let a=0,n=e.length;a<n;a++)t=e.charCodeAt(a),t<128?s+=1:t<2048?s+=2:t<55296||t>=57344?s+=3:(a++,s+=4);return s}function ua(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function dn(e){let t="";for(let s in e)e.hasOwnProperty(s)&&(t.length&&(t+="&"),t+=encodeURIComponent(s)+"="+encodeURIComponent(e[s]));return t}function un(e){let t={},s=e.split("&");for(let a=0,n=s.length;a<n;a++){let r=s[a].split("=");t[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return t}class pn extends Error{constructor(t,s,a){super(t),this.description=s,this.context=a,this.type="TransportError"}}class ws extends re{constructor(t){super(),this.writable=!1,Pt(this,t),this.opts=t,this.query=t.query,this.socket=t.socket,this.supportsBinary=!t.forceBase64}onError(t,s,a){return super.emitReserved("error",new pn(t,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(t){this.readyState==="open"&&this.write(t)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(t){const s=bs(t,this.socket.binaryType);this.onPacket(s)}onPacket(t){super.emitReserved("packet",t)}onClose(t){this.readyState="closed",super.emitReserved("close",t)}pause(t){}createUri(t,s={}){return t+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const t=this.opts.hostname;return t.indexOf(":")===-1?t:"["+t+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(t){const s=dn(t);return s.length?"?"+s:""}}class hn extends ws{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(t){this.readyState="pausing";const s=()=>{this.readyState="paused",t()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(t){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};Za(t,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const t=()=>{this.write([{type:"close"}])};this.readyState==="open"?t():this.once("open",t)}write(t){this.writable=!1,Xa(t,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const t=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=ua()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(t,s)}}let pa=!1;try{pa=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const mn=pa;function gn(){}class fn extends hn{constructor(t){if(super(t),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&t.hostname!==location.hostname||a!==t.port}}doWrite(t,s){const a=this.request({method:"POST",data:t});a.on("success",s),a.on("error",(n,r)=>{this.onError("xhr post error",n,r)})}doPoll(){const t=this.request();t.on("data",this.onData.bind(this)),t.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=t}}class Le extends re{constructor(t,s,a){super(),this.createRequest=t,Pt(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var t;const s=da(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(t=this._opts.cookieJar)===null||t===void 0||t.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=Le.requestsCount++,Le.requests[this._index]=this)}_onError(t){this.emitReserved("error",t,this._xhr),this._cleanup(!0)}_cleanup(t){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=gn,t)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Le.requests[this._index],this._xhr=null}}_onLoad(){const t=this._xhr.responseText;t!==null&&(this.emitReserved("data",t),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Le.requestsCount=0;Le.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Os);else if(typeof addEventListener=="function"){const e="onpagehide"in we?"pagehide":"unload";addEventListener(e,Os,!1)}}function Os(){for(let e in Le.requests)Le.requests.hasOwnProperty(e)&&Le.requests[e].abort()}const vn=function(){const e=ha({xdomain:!1});return e&&e.responseType!==null}();class yn extends fn{constructor(t){super(t);const s=t&&t.forceBase64;this.supportsBinary=vn&&!s}request(t={}){return Object.assign(t,{xd:this.xd},this.opts),new Le(ha,this.uri(),t)}}function ha(e){const t=e.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!t||mn))return new XMLHttpRequest}catch{}if(!t)try{return new we[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const ma=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class bn extends ws{get name(){return"websocket"}doOpen(){const t=this.uri(),s=this.opts.protocols,a=ma?{}:da(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(t,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=t=>this.onClose({description:"websocket connection closed",context:t}),this.ws.onmessage=t=>this.onData(t.data),this.ws.onerror=t=>this.onError("websocket error",t)}write(t){this.writable=!1;for(let s=0;s<t.length;s++){const a=t[s],n=s===t.length-1;ys(a,this.supportsBinary,r=>{try{this.doWrite(a,r)}catch{}n&&_t(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const t=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=ua()),this.supportsBinary||(s.b64=1),this.createUri(t,s)}}const Qt=we.WebSocket||we.MozWebSocket;class wn extends bn{createSocket(t,s,a){return ma?new Qt(t,s,a):s?new Qt(t,s):new Qt(t)}doWrite(t,s){this.ws.send(s)}}class kn extends ws{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(t){return this.emitReserved("error",t)}this._transport.closed.then(()=>{this.onClose()}).catch(t=>{this.onError("webtransport error",t)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(t=>{const s=tn(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=t.readable.pipeThrough(s).getReader(),n=en();n.readable.pipeTo(t.writable),this._writer=n.writable.getWriter();const r=()=>{a.read().then(({done:c,value:l})=>{c||(this.onPacket(l),r())}).catch(c=>{})};r();const i={type:"open"};this.query.sid&&(i.data=`{"sid":"${this.query.sid}"}`),this._writer.write(i).then(()=>this.onOpen())})})}write(t){this.writable=!1;for(let s=0;s<t.length;s++){const a=t[s],n=s===t.length-1;this._writer.write(a).then(()=>{n&&_t(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var t;(t=this._transport)===null||t===void 0||t.close()}}const $n={websocket:wn,webtransport:kn,polling:yn},En=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Cn=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Yt(e){if(e.length>8e3)throw"URI too long";const t=e,s=e.indexOf("["),a=e.indexOf("]");s!=-1&&a!=-1&&(e=e.substring(0,s)+e.substring(s,a).replace(/:/g,";")+e.substring(a,e.length));let n=En.exec(e||""),r={},i=14;for(;i--;)r[Cn[i]]=n[i]||"";return s!=-1&&a!=-1&&(r.source=t,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=Sn(r,r.path),r.queryKey=xn(r,r.query),r}function Sn(e,t){const s=/\/{2,9}/g,a=t.replace(s,"/").split("/");return(t.slice(0,1)=="/"||t.length===0)&&a.splice(0,1),t.slice(-1)=="/"&&a.splice(a.length-1,1),a}function xn(e,t){const s={};return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,r){n&&(s[n]=r)}),s}const Jt=typeof addEventListener=="function"&&typeof removeEventListener=="function",ft=[];Jt&&addEventListener("offline",()=>{ft.forEach(e=>e())},!1);class Re extends re{constructor(t,s){if(super(),this.binaryType=an,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,t&&typeof t=="object"&&(s=t,t=null),t){const a=Yt(t);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=Yt(s.host).host);Pt(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=un(this.opts.query)),Jt&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},ft.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(t){const s=Object.assign({},this.opts.query);s.EIO=ca,s.transport=t,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[t]);return new this._transportsByName[t](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const t=this.opts.rememberUpgrade&&Re.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(t);s.open(),this.setTransport(s)}setTransport(t){this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",Re.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",t),this.emitReserved("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=t.data,this._onError(s);break;case"message":this.emitReserved("data",t.data),this.emitReserved("message",t.data);break}}onHandshake(t){this.emitReserved("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this._pingInterval=t.pingInterval,this._pingTimeout=t.pingTimeout,this._maxPayload=t.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const t=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+t,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},t),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const t=this._getWritablePackets();this.transport.send(t),this._prevBufferLen=t.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=ln(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const t=Date.now()>this._pingTimeoutTime;return t&&(this._pingTimeoutTime=0,_t(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),t}write(t,s,a){return this._sendPacket("message",t,s,a),this}send(t,s,a){return this._sendPacket("message",t,s,a),this}_sendPacket(t,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const r={type:t,data:s,options:a};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),n&&this.once("flush",n),this.flush()}close(){const t=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),t()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():t()}):this.upgrading?a():t()),this}_onError(t){if(Re.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",t),this._onClose("transport error",t)}_onClose(t,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Jt&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=ft.indexOf(this._offlineEventListener);a!==-1&&ft.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",t,s),this.writeBuffer=[],this._prevBufferLen=0}}}Re.protocol=ca;class Ln extends Re{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let t=0;t<this._upgrades.length;t++)this._probe(this._upgrades[t])}_probe(t){let s=this.createTransport(t),a=!1;Re.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",m=>{if(!a)if(m.type==="pong"&&m.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;Re.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(u(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const f=new Error("probe error");f.transport=s.name,this.emitReserved("upgradeError",f)}}))};function r(){a||(a=!0,u(),s.close(),s=null)}const i=m=>{const f=new Error("probe error: "+m);f.transport=s.name,r(),this.emitReserved("upgradeError",f)};function c(){i("transport closed")}function l(){i("socket closed")}function d(m){s&&m.name!==s.name&&r()}const u=()=>{s.removeListener("open",n),s.removeListener("error",i),s.removeListener("close",c),this.off("close",l),this.off("upgrading",d)};s.once("open",n),s.once("error",i),s.once("close",c),this.once("close",l),this.once("upgrading",d),this._upgrades.indexOf("webtransport")!==-1&&t!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(t){this._upgrades=this._filterUpgrades(t.upgrades),super.onHandshake(t)}_filterUpgrades(t){const s=[];for(let a=0;a<t.length;a++)~this.transports.indexOf(t[a])&&s.push(t[a]);return s}}let In=class extends Ln{constructor(t,s={}){const a=typeof t=="object"?t:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>$n[n]).filter(n=>!!n)),super(t,a)}};function Bn(e,t="",s){let a=e;s=s||typeof location<"u"&&location,e==null&&(e=s.protocol+"//"+s.host),typeof e=="string"&&(e.charAt(0)==="/"&&(e.charAt(1)==="/"?e=s.protocol+e:e=s.host+e),/^(https?|wss?):\/\//.test(e)||(typeof s<"u"?e=s.protocol+"//"+e:e="https://"+e),a=Yt(e)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const r=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+r+":"+a.port+t,a.href=a.protocol+"://"+r+(s&&s.port===a.port?"":":"+a.port),a}const An=typeof ArrayBuffer=="function",Mn=e=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(e):e.buffer instanceof ArrayBuffer,ga=Object.prototype.toString,Tn=typeof Blob=="function"||typeof Blob<"u"&&ga.call(Blob)==="[object BlobConstructor]",_n=typeof File=="function"||typeof File<"u"&&ga.call(File)==="[object FileConstructor]";function ks(e){return An&&(e instanceof ArrayBuffer||Mn(e))||Tn&&e instanceof Blob||_n&&e instanceof File}function vt(e,t){if(!e||typeof e!="object")return!1;if(Array.isArray(e)){for(let s=0,a=e.length;s<a;s++)if(vt(e[s]))return!0;return!1}if(ks(e))return!0;if(e.toJSON&&typeof e.toJSON=="function"&&arguments.length===1)return vt(e.toJSON(),!0);for(const s in e)if(Object.prototype.hasOwnProperty.call(e,s)&&vt(e[s]))return!0;return!1}function Pn(e){const t=[],s=e.data,a=e;return a.data=Xt(s,t),a.attachments=t.length,{packet:a,buffers:t}}function Xt(e,t){if(!e)return e;if(ks(e)){const s={_placeholder:!0,num:t.length};return t.push(e),s}else if(Array.isArray(e)){const s=new Array(e.length);for(let a=0;a<e.length;a++)s[a]=Xt(e[a],t);return s}else if(typeof e=="object"&&!(e instanceof Date)){const s={};for(const a in e)Object.prototype.hasOwnProperty.call(e,a)&&(s[a]=Xt(e[a],t));return s}return e}function qn(e,t){return e.data=Zt(e.data,t),delete e.attachments,e}function Zt(e,t){if(!e)return e;if(e&&e._placeholder===!0){if(typeof e.num=="number"&&e.num>=0&&e.num<t.length)return t[e.num];throw new Error("illegal attachments")}else if(Array.isArray(e))for(let s=0;s<e.length;s++)e[s]=Zt(e[s],t);else if(typeof e=="object")for(const s in e)Object.prototype.hasOwnProperty.call(e,s)&&(e[s]=Zt(e[s],t));return e}const Rn=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var W;(function(e){e[e.CONNECT=0]="CONNECT",e[e.DISCONNECT=1]="DISCONNECT",e[e.EVENT=2]="EVENT",e[e.ACK=3]="ACK",e[e.CONNECT_ERROR=4]="CONNECT_ERROR",e[e.BINARY_EVENT=5]="BINARY_EVENT",e[e.BINARY_ACK=6]="BINARY_ACK"})(W||(W={}));class Dn{constructor(t){this.replacer=t}encode(t){return(t.type===W.EVENT||t.type===W.ACK)&&vt(t)?this.encodeAsBinary({type:t.type===W.EVENT?W.BINARY_EVENT:W.BINARY_ACK,nsp:t.nsp,data:t.data,id:t.id}):[this.encodeAsString(t)]}encodeAsString(t){let s=""+t.type;return(t.type===W.BINARY_EVENT||t.type===W.BINARY_ACK)&&(s+=t.attachments+"-"),t.nsp&&t.nsp!=="/"&&(s+=t.nsp+","),t.id!=null&&(s+=t.id),t.data!=null&&(s+=JSON.stringify(t.data,this.replacer)),s}encodeAsBinary(t){const s=Pn(t),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class $s extends re{constructor(t){super(),this.reviver=t}add(t){let s;if(typeof t=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(t);const a=s.type===W.BINARY_EVENT;a||s.type===W.BINARY_ACK?(s.type=a?W.EVENT:W.ACK,this.reconstructor=new Fn(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(ks(t)||t.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(t),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+t)}decodeString(t){let s=0;const a={type:Number(t.charAt(0))};if(W[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===W.BINARY_EVENT||a.type===W.BINARY_ACK){const r=s+1;for(;t.charAt(++s)!=="-"&&s!=t.length;);const i=t.substring(r,s);if(i!=Number(i)||t.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(i)}if(t.charAt(s+1)==="/"){const r=s+1;for(;++s&&!(t.charAt(s)===","||s===t.length););a.nsp=t.substring(r,s)}else a.nsp="/";const n=t.charAt(s+1);if(n!==""&&Number(n)==n){const r=s+1;for(;++s;){const i=t.charAt(s);if(i==null||Number(i)!=i){--s;break}if(s===t.length)break}a.id=Number(t.substring(r,s+1))}if(t.charAt(++s)){const r=this.tryParse(t.substr(s));if($s.isPayloadValid(a.type,r))a.data=r;else throw new Error("invalid payload")}return a}tryParse(t){try{return JSON.parse(t,this.reviver)}catch{return!1}}static isPayloadValid(t,s){switch(t){case W.CONNECT:return Us(s);case W.DISCONNECT:return s===void 0;case W.CONNECT_ERROR:return typeof s=="string"||Us(s);case W.EVENT:case W.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&Rn.indexOf(s[0])===-1);case W.ACK:case W.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Fn{constructor(t){this.packet=t,this.buffers=[],this.reconPack=t}takeBinaryData(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){const s=qn(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function Us(e){return Object.prototype.toString.call(e)==="[object Object]"}const Nn=Object.freeze(Object.defineProperty({__proto__:null,Decoder:$s,Encoder:Dn,get PacketType(){return W}},Symbol.toStringTag,{value:"Module"}));function Ee(e,t,s){return e.on(t,s),function(){e.off(t,s)}}const On=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class fa extends re{constructor(t,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=t,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const t=this.io;this.subs=[Ee(t,"open",this.onopen.bind(this)),Ee(t,"packet",this.onpacket.bind(this)),Ee(t,"error",this.onerror.bind(this)),Ee(t,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...t){return t.unshift("message"),this.emit.apply(this,t),this}emit(t,...s){var a,n,r;if(On.hasOwnProperty(t))throw new Error('"'+t.toString()+'" is a reserved event name');if(s.unshift(t),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const i={type:W.EVENT,data:s};if(i.options={},i.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const u=this.ids++,m=s.pop();this._registerAckCallback(u,m),i.id=u}const c=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(i),this.packet(i)):this.sendBuffer.push(i)),this.flags={},this}_registerAckCallback(t,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[t]=s;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[t];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===t&&this.sendBuffer.splice(c,1);s.call(this,new Error("operation has timed out"))},n),i=(...c)=>{this.io.clearTimeoutFn(r),s.apply(this,c)};i.withError=!0,this.acks[t]=i}emitWithAck(t,...s){return new Promise((a,n)=>{const r=(i,c)=>i?n(i):a(c);r.withError=!0,s.push(r),this.emit(t,...s)})}_addToQueue(t){let s;typeof t[t.length-1]=="function"&&(s=t.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:t,flags:Object.assign({fromQueue:!0},this.flags)};t.push((n,...r)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...r)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(t=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!t||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(t){t.nsp=this.nsp,this.io._packet(t)}onopen(){typeof this.auth=="function"?this.auth(t=>{this._sendConnectPacket(t)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(t){this.packet({type:W.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},t):t})}onerror(t){this.connected||this.emitReserved("connect_error",t)}onclose(t,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",t,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(t=>{if(!this.sendBuffer.some(a=>String(a.id)===t)){const a=this.acks[t];delete this.acks[t],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(t){if(t.nsp===this.nsp)switch(t.type){case W.CONNECT:t.data&&t.data.sid?this.onconnect(t.data.sid,t.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case W.EVENT:case W.BINARY_EVENT:this.onevent(t);break;case W.ACK:case W.BINARY_ACK:this.onack(t);break;case W.DISCONNECT:this.ondisconnect();break;case W.CONNECT_ERROR:this.destroy();const a=new Error(t.data.message);a.data=t.data.data,this.emitReserved("connect_error",a);break}}onevent(t){const s=t.data||[];t.id!=null&&s.push(this.ack(t.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(t){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,t)}super.emit.apply(this,t),this._pid&&t.length&&typeof t[t.length-1]=="string"&&(this._lastOffset=t[t.length-1])}ack(t){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:W.ACK,id:t,data:n}))}}onack(t){const s=this.acks[t.id];typeof s=="function"&&(delete this.acks[t.id],s.withError&&t.data.unshift(null),s.apply(this,t.data))}onconnect(t,s){this.id=t,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(t=>this.emitEvent(t)),this.receiveBuffer=[],this.sendBuffer.forEach(t=>{this.notifyOutgoingListeners(t),this.packet(t)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(t=>t()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:W.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(t){return this.flags.compress=t,this}get volatile(){return this.flags.volatile=!0,this}timeout(t){return this.flags.timeout=t,this}onAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(t),this}prependAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(t),this}offAny(t){if(!this._anyListeners)return this;if(t){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(t===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(t),this}prependAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(t),this}offAnyOutgoing(t){if(!this._anyOutgoingListeners)return this;if(t){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(t===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(t){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,t.data)}}}function Ze(e){e=e||{},this.ms=e.min||100,this.max=e.max||1e4,this.factor=e.factor||2,this.jitter=e.jitter>0&&e.jitter<=1?e.jitter:0,this.attempts=0}Ze.prototype.duration=function(){var e=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var t=Math.random(),s=Math.floor(t*this.jitter*e);e=Math.floor(t*10)&1?e+s:e-s}return Math.min(e,this.max)|0};Ze.prototype.reset=function(){this.attempts=0};Ze.prototype.setMin=function(e){this.ms=e};Ze.prototype.setMax=function(e){this.max=e};Ze.prototype.setJitter=function(e){this.jitter=e};class es extends re{constructor(t,s){var a;super(),this.nsps={},this.subs=[],t&&typeof t=="object"&&(s=t,t=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,Pt(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new Ze({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=t;const n=s.parser||Nn;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(t){return arguments.length?(this._reconnection=!!t,t||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(t){return t===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=t,this)}reconnectionDelay(t){var s;return t===void 0?this._reconnectionDelay:(this._reconnectionDelay=t,(s=this.backoff)===null||s===void 0||s.setMin(t),this)}randomizationFactor(t){var s;return t===void 0?this._randomizationFactor:(this._randomizationFactor=t,(s=this.backoff)===null||s===void 0||s.setJitter(t),this)}reconnectionDelayMax(t){var s;return t===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=t,(s=this.backoff)===null||s===void 0||s.setMax(t),this)}timeout(t){return arguments.length?(this._timeout=t,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(t){if(~this._readyState.indexOf("open"))return this;this.engine=new In(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=Ee(s,"open",function(){a.onopen(),t&&t()}),r=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),t?t(c):this.maybeReconnectOnOpen()},i=Ee(s,"error",r);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{n(),r(new Error("timeout")),s.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(i),this}connect(t){return this.open(t)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const t=this.engine;this.subs.push(Ee(t,"ping",this.onping.bind(this)),Ee(t,"data",this.ondata.bind(this)),Ee(t,"error",this.onerror.bind(this)),Ee(t,"close",this.onclose.bind(this)),Ee(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(t){try{this.decoder.add(t)}catch(s){this.onclose("parse error",s)}}ondecoded(t){_t(()=>{this.emitReserved("packet",t)},this.setTimeoutFn)}onerror(t){this.emitReserved("error",t)}socket(t,s){let a=this.nsps[t];return a?this._autoConnect&&!a.active&&a.connect():(a=new fa(this,t,s),this.nsps[t]=a),a}_destroy(t){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(t){const s=this.encoder.encode(t);for(let a=0;a<s.length;a++)this.engine.write(s[a],t.options)}cleanup(){this.subs.forEach(t=>t()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(t,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",t,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{t.skipReconnect||(this.emitReserved("reconnect_attempt",t.backoff.attempts),!t.skipReconnect&&t.open(n=>{n?(t._reconnecting=!1,t.reconnect(),this.emitReserved("reconnect_error",n)):t.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const t=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",t)}}const et={};function ot(e,t){typeof e=="object"&&(t=e,e=void 0),t=t||{};const s=Bn(e,t.path||"/socket.io"),a=s.source,n=s.id,r=s.path,i=et[n]&&r in et[n].nsps,c=t.forceNew||t["force new connection"]||t.multiplex===!1||i;let l;return c?l=new es(a,t):(et[n]||(et[n]=new es(a,t)),l=et[n]),s.query&&!t.query&&(t.query=s.queryKey),l.socket(s.path,t)}Object.assign(ot,{Manager:es,Socket:fa,io:ot,connect:ot});class Un{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var t;(t=this.socket)!=null&&t.connected||(this.socket=ot({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(t){var s;this.subscribedMangas.add(t),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",t)}unsubscribeFromManga(t){var s;this.subscribedMangas.delete(t),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",t)}on(t,s){this.listeners.has(t)||this.listeners.set(t,new Set),this.listeners.get(t).add(s),this.socket&&this.socket.on(t,s)}off(t,s){this.listeners.has(t)&&this.listeners.get(t).delete(s),this.socket&&this.socket.off(t,s)}emit(t,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(t,s)}}const ne={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone",SITE_CHALLENGE:"site:challenge",SITE_CHALLENGE_CLEARED:"site:challenge-cleared",SITE_SESSION:"site:session",TORRENT_UPDATE:"torrent:update"},Z=new Un,he={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},Ce=new Set,se=new Map,at=new Map;function Vn(e){return he[e]}function Hn(e,t){he[e]=t,Ce.add(e),ct(e)}function jn(e,t){return at.has(e)||at.set(e,new Set),at.get(e).add(t),()=>{var s;return(s=at.get(e))==null?void 0:s.delete(t)}}function ct(e){const t=at.get(e);t&&t.forEach(s=>s(he[e]))}function nt(e){Ce.delete(e),se.delete(e)}function zn(e){return Ce.has(e)}async function rt(e=!1){if(!e&&Ce.has("bookmarks"))return he.bookmarks;if(se.has("bookmarks"))return se.get("bookmarks");const t=g.getBookmarks().then(s=>(he.bookmarks=s||[],Ce.add("bookmarks"),se.delete("bookmarks"),ct("bookmarks"),he.bookmarks)).catch(s=>{throw se.delete("bookmarks"),s});return se.set("bookmarks",t),t}async function Qn(e=!1){if(!e&&Ce.has("series"))return he.series;if(se.has("series"))return se.get("series");const t=g.get("/series").then(s=>(he.series=s||[],Ce.add("series"),se.delete("series"),ct("series"),he.series)).catch(s=>{throw se.delete("series"),s});return se.set("series",t),t}async function Wn(e=!1){if(!e&&Ce.has("categories"))return he.categories;if(se.has("categories"))return se.get("categories");const t=g.get("/categories").then(s=>(he.categories=s.categories||[],Ce.add("categories"),se.delete("categories"),ct("categories"),he.categories)).catch(s=>{throw se.delete("categories"),s});return se.set("categories",t),t}async function Gn(e=!1){if(!e&&Ce.has("favorites"))return he.favorites;if(se.has("favorites"))return se.get("favorites");const t=g.getFavorites().then(s=>(he.favorites=s||{favorites:{},listOrder:[]},Ce.add("favorites"),se.delete("favorites"),ct("favorites"),he.favorites)).catch(s=>{throw se.delete("favorites"),s});return se.set("favorites",t),t}function Kn(){Z.on(ne.MANGA_UPDATED,()=>{nt("bookmarks"),rt(!0)}),Z.on(ne.MANGA_ADDED,()=>{nt("bookmarks"),rt(!0)}),Z.on(ne.MANGA_DELETED,()=>{nt("bookmarks"),rt(!0)}),Z.on(ne.DOWNLOAD_COMPLETED,()=>{nt("bookmarks"),rt(!0)})}Kn();const me={get:Vn,set:Hn,subscribe:jn,invalidate:nt,isLoaded:zn,loadBookmarks:rt,loadSeries:Qn,loadCategories:Wn,loadFavorites:Gn};function p(e,t="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${t}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}const Yn={library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',"book-open":'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',"book-marked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',"layout-grid":'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',check:'<path d="M20 6 9 17l-5-5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',"trash-2":'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',"undo-2":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',scissors:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',play:'<polygon points="6 3 20 12 6 21 6 3"/>',pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',"hard-drive":'<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',package:'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"eye-off":'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',circle:'<circle cx="12" cy="12" r="10"/>',lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',"lock-open":'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',"triangle-alert":'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',"shield-alert":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',"circle-help":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',"traffic-cone":'<path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"/><path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"/><path d="M13.9 3.5a1.93 1.93 0 0 0-3.8 0L6.1 19.5a1.93 1.93 0 0 0 1.9 2.5h8a1.93 1.93 0 0 0 1.9-2.5z"/><path d="M2 21h20"/>',sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',"alarm-clock":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',loader:'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',"search-x":'<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',"list-checks":'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',"log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',sliders:'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',"chevron-up":'<path d="m18 15-6-6-6 6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"chevron-left":'<path d="m15 18-6-6 6-6"/>',"chevron-right":'<path d="m9 18 6-6-6-6"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',images:'<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>',"columns-2":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',"rectangle-vertical":'<rect width="12" height="20" x="6" y="2" rx="2"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',"arrow-left-right":'<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',"refresh-cw":'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>',"rotate-cw":'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"message-circle":'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'};function h(e,t={}){const s=Yn[e];if(!s)return console.warn("[icons] unknown icon:",e),"";const{size:a,cls:n="",title:r,spin:i=!1}=t,c=["icon",i?"icon-spin":"",n].filter(Boolean).join(" "),l=a?` width="${a}" height="${a}"`:"",d=r?` role="img" aria-label="${String(r).replace(/"/g,"&quot;")}"`:' aria-hidden="true"';return`<svg class="${c}"${l} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${d}>${s}</svg>`}function fe(e="book"){return`<div class="placeholder" data-icon="${e}"></div>`}function Te(e,t,s={}){const{kind:a="book",self:n=!1,attrs:r=""}=s,i=String(t??"").replace(/"/g,"&quot;"),c=`<div class=&quot;placeholder&quot; data-icon=&quot;${a}&quot;></div>`,l=n?"this.outerHTML":"this.parentElement.innerHTML";return`<img src="${e}" alt="${i}" loading="lazy"${r?" "+r:""} onerror="${l}='${c}'">`}const Vs=`${h("folder")} Scan Folder`,Hs=`${h("loader",{spin:!0})} Scanning...`;async function Jn(e,t,s){try{e&&(e.disabled=!0,e.innerHTML=Hs),t&&(t.innerHTML=Hs),p("Scanning downloads folder...","info");const n=(await g.scanLibrary()).found||[];if(n.length===0){p("Scan complete: No new manga found","info"),s&&s();return}Xn(n,s)}catch(a){p("Scan failed: "+a.message,"error")}finally{e&&(e.disabled=!1,e.innerHTML=Vs),t&&(t.innerHTML=Vs)}}async function Xn(e,t){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
    <h2 style="margin:0 0 16px 0;">Import Local Manga</h2>
    <p style="margin:0 0 16px 0;color:var(--text-secondary);">Found ${e.length} new folder(s). Select which to import:</p>
    <div id="import-folder-list" style="max-height:300px;overflow-y:auto;margin-bottom:16px;">
      ${e.map(n=>`
        <label style="display:flex;align-items:center;gap:12px;padding:8px;background:var(--bg-secondary);border-radius:4px;margin-bottom:8px;cursor:pointer;">
          <input type="checkbox" class="import-checkbox" data-folder="${n.folderName}" checked>
          <div style="flex:1;">
            <div style="font-weight:bold;">${n.folderName}</div>
            <div style="font-size:12px;color:var(--text-secondary);">
              ${n.hasChapters?`${n.chapterCount} chapter(s)`:""}
              ${n.hasChapters&&n.hasCbz?" | ":""}
              ${n.hasCbz?`${n.cbzFiles} CBZ file(s)`:""}
            </div>
          </div>
        </label>
      `).join("")}
    </div>
    <div style="display:flex;gap:12px;justify-content:flex-end;">
      <button id="import-cancel-btn" class="btn" style="background:var(--bg-secondary);">Cancel</button>
      <button id="import-all-btn" class="btn btn-primary">Import Selected</button>
    </div>
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),r=Array.from(n).map(l=>l.dataset.folder);if(r.length===0){p("No folders selected","warning");return}const i=document.getElementById("import-all-btn");i.disabled=!0,i.textContent="Importing...";let c=0;for(const l of r)try{await g.importLocalManga(l),c++}catch(d){console.error("Failed to import",l,d)}s.remove(),p(`Imported ${c} manga`,"success"),t&&t()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function Zn(e={}){const{size:t,stroke:s="currentColor",accent:a="var(--accent-primary, #E03A2F)",strokeWidth:n=2,cls:r=""}=e,i=t?` width="${t}" height="${t}"`:"";return`<svg class="${`logo-mark ${r}`.trim()}"${i} viewBox="0 0 24 24" fill="none" stroke="${s}" stroke-width="${n}" stroke-linejoin="round" aria-hidden="true"><polygon points="3,3 10.5,3 8.5,21 3,21"/><polygon points="13,3 21,3 21,10.5 12.17,10.5" fill="${a}" stroke="${a}"/><polygon points="11.89,13 21,13 21,21 11,21"/></svg>`}function js(){return`${Zn()}<span class="logo-text">Manga<span>Reader</span></span>`}const K={user:null,get isAdmin(){var e;return((e=this.user)==null?void 0:e.role)==="admin"},get isDemo(){var e;return((e=this.user)==null?void 0:e.role)==="demo"},get canDownload(){var e;return this.isAdmin||!this.isDemo&&!!((e=this.user)!=null&&e.canDownload)},get canEdit(){var e;return this.isAdmin||!this.isDemo&&!!((e=this.user)!=null&&e.canEdit)}};function Ni(e){K.user=e||null}function pe(e="manga"){if(K.isDemo)return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${js()}</a>
        <div class="header-actions">
          <div class="view-toggle">
            <button class="view-toggle-btn ${e==="manga"?"active":""}" data-view="manga" title="Manga view">${h("library",{title:"Manga view"})}</button>
            <button class="view-toggle-btn ${e==="series"?"active":""}" data-view="series" title="Series view">${h("book-open",{title:"Series view"})}</button>
          </div>
          <span class="demo-badge">Demo</span>
          <a href="/login.html" class="btn btn-secondary" id="demo-exit-btn" title="Exit the demo">${h("log-out",{title:"Exit the demo"})} Exit</a>
        </div>
      </div>
    </header>
  `;const t=K.isAdmin?`<a href="#/admin" class="btn btn-secondary" title="Admin">${h("wrench",{title:"Admin"})}</a>`:"",s=K.isAdmin?`<a href="#/admin" class="mobile-menu-item">${h("wrench")} Admin</a>`:"",a=K.canDownload?`<button class="btn btn-secondary" id="scan-btn">${h("folder")} Scan Folder</button>`:"",n=K.canDownload?`<button class="mobile-menu-item" id="mobile-scan-btn">${h("folder")} Scan Folder</button>`:"",r=K.canEdit?e==="series"?`<button class="btn btn-primary" id="add-series-btn">${h("plus")} Add Series</button>`:`<button class="btn btn-primary" id="add-manga-btn">${h("plus")} Add Manga</button>`:"",i=K.canEdit?e==="series"?`<button class="mobile-menu-item primary" id="mobile-add-series-btn">${h("plus")} Add Series</button>`:`<button class="mobile-menu-item primary" id="mobile-add-btn">${h("plus")} Add Manga</button>`:"";return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${js()}</a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${e==="manga"?"active":""}" data-view="manga" title="Manga view">${h("library",{title:"Manga view"})}</button>
            <button class="view-toggle-btn ${e==="series"?"active":""}" data-view="series" title="Series view">${h("book-open",{title:"Series view"})}</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">${h("star")} Favorites</button>
          <a href="#/queue" class="btn btn-secondary" id="queue-nav-btn" title="Task Queue">${h("list-checks")} Queue</a>
          ${a}
          ${r}
          <button class="btn btn-secondary" id="logout-btn" title="Log out">${h("log-out",{title:"Log out"})}</button>
          <a href="#/scrapers" class="btn btn-secondary" title="Search Scrapers">${h("search",{title:"Search Scrapers"})}</a>
          ${t}
          <a href="#/settings" class="btn btn-secondary" title="Settings">${h("settings",{title:"Settings"})}</a>
        </div>
        <button class="hamburger-btn mobile-only" id="hamburger-btn">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu hidden" id="mobile-menu">
        <div class="mobile-view-toggle">
          <button class="view-toggle-btn ${e==="manga"?"active":""}" data-view="manga">${h("library")} Manga</button>
          <button class="view-toggle-btn ${e==="series"?"active":""}" data-view="series">${h("book-open")} Series</button>
        </div>
        <button class="mobile-menu-item" id="mobile-favorites-btn">${h("star")} Favorites</button>
        <a href="#/queue" class="mobile-menu-item">${h("list-checks")} Task Queue</a>
        ${n}
        ${i}
        <button class="mobile-menu-item" id="mobile-logout-btn">${h("log-out")} Logout</button>
        <a href="#/scrapers" class="mobile-menu-item">${h("search")} Scrapers</a>
        ${s}
        <a href="#/settings" class="mobile-menu-item">${h("settings")} Settings</a>
      </div>
    </header>
  `}function _e(){const e=document.querySelector("header");if(e&&e.dataset.listenersBound)return;e&&(e.dataset.listenersBound="true");const t=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");t&&s&&t.addEventListener("click",()=>{s.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),r=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",r),n&&n.addEventListener("click",r);const i=document.getElementById("demo-exit-btn");i&&i.addEventListener("click",S=>{S.preventDefault(),localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"}),document.querySelectorAll("[data-view]").forEach(S=>{S.addEventListener("click",()=>{const B=S.dataset.view;localStorage.setItem("library_view_mode",B),document.querySelectorAll("[data-view]").forEach(D=>{D.classList.toggle("active",D.dataset.view===B)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:B}}))})});const c=document.querySelector(".logo");c&&c.addEventListener("click",S=>{localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),me.loadBookmarks(!0).catch(()=>{}),window.dispatchEvent(new CustomEvent("clearFilters"))});const l=document.getElementById("favorites-btn"),d=document.getElementById("mobile-favorites-btn"),u=S=>{S.preventDefault(),F.go("/favorites")};l&&l.addEventListener("click",u),d&&d.addEventListener("click",u);const m=document.getElementById("queue-nav-btn");m&&m.addEventListener("click",S=>{S.preventDefault(),F.go("/queue")});const f=document.getElementById("add-manga-btn"),w=document.getElementById("mobile-add-btn"),x=()=>{document.getElementById("add-modal")||(sessionStorage.setItem("open_add_modal","1"),F.go("/"))};f&&f.addEventListener("click",x),w&&w.addEventListener("click",x);const v=document.getElementById("scan-btn"),L=document.getElementById("mobile-scan-btn");if(v||L){const S=()=>{Jn(v,L,async()=>{await me.loadBookmarks(!0),F.reload()})};v&&v.addEventListener("click",S),L&&L.addEventListener("click",S)}}const Et={series:"any",downloads:"any",reading:"any",source:"any",monitor:"any"};function er(){try{const e=JSON.parse(localStorage.getItem("library_filters")||"{}");return{...Et,...e&&typeof e=="object"?e:{}}}catch{return{...Et}}}let I={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",searchAuthor:localStorage.getItem("library_search_author")||null,searchAuthorSource:localStorage.getItem("library_search_author_source")||null,sortBy:localStorage.getItem("library_sort")||"updated",filters:er(),viewMode:"manga",loading:!0},Ct=[],De=null;function tr(){localStorage.setItem("library_filters",JSON.stringify(I.filters))}function sr(e){var i,c,l;const t=new Set(e.excludedChapters||[]),s=new Set((e.chapters||[]).filter(d=>!t.has(d.number)).map(d=>d.number)).size||e.uniqueChapters||0,a=e.downloadedCount??((i=e.downloadedChapters)==null?void 0:i.length)??0,n=e.readCount??((c=e.readChapters)==null?void 0:c.length)??0,r=(e.updatedCount??((l=e.updatedChapters)==null?void 0:l.length)??0)>0;return{total:s,downloaded:a,read:n,updates:r}}const ar=[{key:"series",label:"Series",options:[{value:"none",label:"Not in a series",test:e=>!e.series},{value:"in",label:"In a series",test:e=>!!e.series}]},{key:"downloads",label:"Downloads",options:[{value:"none",label:"Nothing downloaded",test:(e,t)=>t.downloaded===0},{value:"partial",label:"Partly downloaded",test:(e,t)=>t.downloaded>0&&t.downloaded<t.total},{value:"complete",label:"Fully downloaded",test:(e,t)=>t.total>0&&t.downloaded>=t.total}]},{key:"reading",label:"Reading",options:[{value:"unread",label:"Not started",test:(e,t)=>t.read===0},{value:"progress",label:"In progress",test:(e,t)=>t.read>0&&t.read<t.total},{value:"finished",label:"Finished",test:(e,t)=>t.total>0&&t.read>=t.total},{value:"updates",label:"New chapters",test:(e,t)=>t.updates}]},{key:"source",label:"Source",options:[]},{key:"monitor",label:"Auto-check",options:[{value:"on",label:"On",test:e=>!!e.autoCheck},{value:"off",label:"Off",test:e=>!e.autoCheck}]}];function nr(){const t=[...new Set(I.bookmarks.filter(s=>s.source!=="local"&&s.website).map(s=>s.website))].sort().map(s=>({value:`site:${s}`,label:s,test:a=>a.source!=="local"&&a.website===s}));return I.bookmarks.some(s=>s.source==="local")&&t.unshift({value:"local",label:"Local files",test:s=>s.source==="local"}),t}function va(){return ar.map(e=>e.key==="source"?{...e,options:nr()}:e)}function ya(){return Object.values(I.filters).filter(e=>e&&e!=="any").length}function rr(e){const s=va().map(a=>({g:a,option:a.options.find(n=>n.value===I.filters[a.key])})).filter(a=>a.option);return s.length===0?e:e.filter(a=>{const n=sr(a);return s.every(({option:r})=>r.test(a,n))})}function St(e){return String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}function or(e){return[...e].sort((t,s)=>{var a,n;switch(I.sortBy){case"az":return(t.alias||t.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(t.alias||t.title);case"lastread":return(s.lastReadAt||"").localeCompare(t.lastReadAt||"");case"chapters":{const r=((a=t.chapters)==null?void 0:a.length)||t.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-r}case"updated":default:return(s.updatedAt||"").localeCompare(t.updatedAt||"")}})}function qt(){let e=I.bookmarks;const t=(Array.isArray(I.categories)?I.categories:[]).filter(s=>typeof s=="object"?s.isNsfw:!1).map(s=>s.name);if(I.activeCategory==="__nsfw__"?e=e.filter(s=>(s.categories||[]).some(a=>t.includes(a))):I.activeCategory?e=e.filter(s=>(s.categories||[]).includes(I.activeCategory)):t.length>0&&(e=e.filter(s=>!(s.categories||[]).some(a=>t.includes(a)))),I.artistFilter&&(e=e.filter(s=>(s.artists||[]).includes(I.artistFilter))),I.searchQuery){const s=I.searchQuery.toLowerCase();e=e.filter(a=>(a.title||"").toLowerCase().includes(s)||(a.alias||"").toLowerCase().includes(s)||(a.artists||[]).some(n=>n.toLowerCase().includes(s)))}return e=rr(e),or(e)}function ir(e){const t=ya(),s=va().filter(a=>a.options.length>0);return`
    <div class="library-filter" id="library-filter">
      <button type="button" class="library-filter-btn ${t?"has-filter":""}" id="library-filter-btn" aria-haspopup="true" aria-expanded="false">
        ${h("sliders")} Filter${t?` · ${t}`:""}
      </button>
      <div class="library-filter-menu hidden" id="library-filter-menu" role="menu">
        <div class="library-filter-header">
          <span>Filter library</span>
          <button type="button" class="library-filter-reset" id="library-filter-reset" ${t?"":"hidden"}>Reset</button>
        </div>
        ${s.map(a=>`
          <div class="library-filter-group">
            <div class="library-filter-group-title">${a.label}</div>
            <div class="library-filter-options">
              <button type="button" class="filter-chip ${I.filters[a.key]==="any"||!I.filters[a.key]?"active":""}" data-group="${a.key}" data-value="any">Any</button>
              ${a.options.map(n=>`<button type="button" class="filter-chip ${I.filters[a.key]===n.value?"active":""}" data-group="${a.key}" data-value="${St(n.value)}">${St(n.label)}</button>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    <span class="library-count" id="library-count" title="Shown / in library">${e} / ${I.bookmarks.length}</span>
  `}function zs(){const e=document.getElementById("library-grid");if(!e)return;const t=qt();e.innerHTML=t.map(Rt).join("")||Dt();const s=document.getElementById("library-count");s&&(s.textContent=`${t.length} / ${I.bookmarks.length}`);const a=ya(),n=document.getElementById("library-filter-btn");n&&(n.classList.toggle("has-filter",a>0),n.innerHTML=`${h("sliders")} Filter${a?` · ${a}`:""}`);const r=document.getElementById("library-filter-reset");r&&(r.hidden=a===0),document.querySelectorAll("#library-filter-menu .filter-chip").forEach(i=>{const c=I.filters[i.dataset.group]||"any";i.classList.toggle("active",i.dataset.value===c)})}function Rt(e){var u,m,f;const t=e.alias||e.title,s=e.downloadedCount??((u=e.downloadedChapters)==null?void 0:u.length)??0,a=new Set(e.excludedChapters||[]),n=(e.chapters||[]).filter(w=>!a.has(w.number)),r=new Set(n.map(w=>w.number)).size||e.uniqueChapters||0,i=e.readCount??((m=e.readChapters)==null?void 0:m.length)??0,c=(e.updatedCount??((f=e.updatedChapters)==null?void 0:f.length)??0)>0,l=e.localCover?`/api/public/covers/${e.id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover,d=e.source==="local";return`
    <div class="manga-card" data-id="${e.id}">
      <div class="manga-card-cover">
        ${l?Te(l,t,{kind:d?"local":"book"}):fe(d?"local":"book")}
        <div class="manga-card-badges">
          ${i>0?`<span class="badge badge-read" title="Read">${i}</span>`:""}
          <span class="badge badge-chapters" title="Total">${r}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${c?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${e.autoCheck?`<span class="badge badge-monitored" title="Auto-check enabled">${h("alarm-clock",{title:"Auto-check enabled"})}</span>`:""}
          ${I.activeCategory==="Favorites"?`<span class="badge badge-play" title="Click to Read">${h("play",{title:"Click to Read"})}</span>`:""}
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function Dt(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function lr(e){var n;const t=e.alias||e.title,s=((n=e.entries)==null?void 0:n.length)||e.entry_count||0;let a=null;return e.localCover&&e.coverBookmarkId?a=`/api/public/covers/${e.coverBookmarkId}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover&&(a=e.cover),`
    <div class="manga-card series-card" data-series-id="${e.id}">
      <div class="manga-card-cover">
        ${a?Te(a,t,{kind:"series"}):fe("series")}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${s} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function xt(){const e=localStorage.getItem("library_view_mode");if(e&&e!==I.viewMode&&(I.viewMode=e),I.activeCategory==="Favorites")return F.go("/favorites"),"";let t="";if(I.viewMode==="series"){const s=I.series.map(lr).join("");t=`
      <div class="library-grid" id="library-grid">
        ${I.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const s=qt(),n=I.searchAuthor&&I.searchQuery===I.searchAuthor?`
      <div class="manga-card search-sources-card" id="search-sources-card" title="Search online sources for ${St(I.searchAuthor)}"
           style="display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed var(--border-color, #3a3a4a);background:transparent;min-height:220px;text-align:center;">
        <div style="padding:1rem;color:var(--text-muted, #9aa);">
          <div style="font-size:2.5rem;line-height:1;margin-bottom:.5rem;">＋</div>
          <div style="font-size:.85rem;">Search sources for<br><strong style="color:var(--text-color, #fff);">${St(I.searchAuthor)}</strong></div>
        </div>
      </div>`:"",r=s.map(Rt).join("")+n;t=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">${h("search")}</span>
          <input type="text" id="library-search" placeholder="Search manga or author..." value="${I.searchQuery}" autocomplete="off">
          ${I.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${I.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${I.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${I.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${I.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${I.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
        ${ir(s.length)}
      </div>
      ${I.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">${h("palette")}</span>
          <span class="artist-filter-name">${I.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${I.loading?'<div class="loading-spinner"></div>':r||Dt()}
      </div>
    `}return`
    ${pe(I.viewMode)}
    <div class="container">
      ${t}
    </div>
    ${cr()}
    ${ur()}
    ${pr()}
  `}function cr(){const{activeCategory:e}=I,s=(Array.isArray(I.categories)?I.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=s.some(n=>n.isNsfw);return`
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${e?"has-filter":""}" id="category-fab-btn">
        ${e==="__nsfw__"?h("shield-alert",{title:"18+"}):e||h("tag",{title:"Filter by category"})}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn" title="Manage categories">${h("settings",{title:"Manage categories"})}</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${e?"":"active"}" data-category="">All</button>
          ${a?`<button class="category-menu-item ${e==="__nsfw__"?"active":""}" data-category="__nsfw__" style="color: var(--error);">${h("shield-alert")} All 18+</button>`:""}
          ${s.map(n=>`
            <button class="category-menu-item ${e===n.name?"active":""}" data-category="${n.name}">
              ${n.name}${n.isNsfw?' <span style="color:var(--error);font-size:0.75em;">18+</span>':""}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    ${dr()}
      `}function dr(){const t=(Array.isArray(I.categories)?I.categories:[]).map(s=>typeof s=="object"?s:{name:s,isNsfw:!1});return`
    <div class="modal" id="manage-categories-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 450px;">
        <div class="modal-header">
          <h2>${h("settings")} Manage Categories</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="display: flex; gap: 8px; margin-bottom: 16px;">
            <input type="text" id="new-category-input" placeholder="New category name..." style="flex: 1;">
            <button class="btn btn-primary" id="add-category-btn">Add</button>
          </div>
          <div id="categories-list" style="max-height: 300px; overflow-y: auto;">
            ${t.length===0?'<p class="text-muted">No categories yet</p>':""}
            ${t.map(s=>`
              <div class="category-manage-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 4px; border-bottom: 1px solid var(--border-color);">
                <span style="flex: 1;">${s.name}</span>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.85em; color: ${s.isNsfw?"var(--error)":"var(--text-secondary)"}">
                    <input type="checkbox" class="nsfw-toggle" data-category="${s.name}" ${s.isNsfw?"checked":""} style="width: 16px; height: 16px;">
                    18+
                  </label>
                  <button class="btn-icon small danger delete-category-btn" data-category="${s.name}" title="Delete">${h("trash-2",{title:"Delete"})}</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="close-manage-categories-btn">Close</button>
        </div>
      </div>
    </div>
  `}function ur(){return`
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
      `}function pr(){return`
      <div class="modal" id="add-series-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create New Series</h2>
          <button class="modal-close" id="add-series-modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="series-title">Series Title</label>
            <input type="text" id="series-title" placeholder="e.g., Marvel Cinematic Universe" required>
          </div>
          <div class="form-group">
            <label for="series-alias">Alias (Optional)</label>
            <input type="text" id="series-alias" placeholder="e.g., MCU">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="add-series-modal-cancel">Cancel</button>
          <button class="btn btn-primary" id="add-series-modal-submit">Create</button>
        </div>
      </div>
    </div>
      `}function ts(){I.activeCategory=null,I.artistFilter=null,I.searchQuery="",I.searchAuthor=null,I.searchAuthorSource=null,I.filters={...Et},localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),localStorage.removeItem("library_filters"),ye()}function hr(){const e=document.getElementById("library-filter-btn"),t=document.getElementById("library-filter-menu");!e||!t||(e.addEventListener("click",s=>{s.stopPropagation();const a=t.classList.toggle("hidden")===!1;e.setAttribute("aria-expanded",String(a))}),t.addEventListener("click",s=>{s.stopPropagation();const a=s.target.closest(".filter-chip");if(a){I.filters[a.dataset.group]=a.dataset.value,tr(),zs();return}s.target.closest("#library-filter-reset")&&(I.filters={...Et},localStorage.removeItem("library_filters"),zs())}),De&&document.removeEventListener("click",De),De=s=>{!t.classList.contains("hidden")&&!s.target.closest("#library-filter")&&(t.classList.add("hidden"),e.setAttribute("aria-expanded","false"))},document.addEventListener("click",De))}async function ss(e){const t=e.target.closest(".manga-card");if(t){if(t.classList.contains("gallery-card")){const n=t.dataset.gallery;F.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=t.dataset.id,a=t.dataset.seriesId;if(a){F.go(`/series/${a}`);return}if(s){if(I.activeCategory==="Favorites"){const n=I.bookmarks.find(r=>r.id===s);if(n){let r=n.last_read_chapter;if(!r&&n.chapters&&n.chapters.length>0&&(r=[...n.chapters].sort((c,l)=>c.number-l.number)[0].number),r){F.go(`/read/${s}/${r}`);return}else p("No chapters available to read","warning")}}F.go(`/manga/${s}`)}}}function ba(){var V,H,J,X,E;const e=document.getElementById("app");e.removeEventListener("click",ss),e.addEventListener("click",ss),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",C=>{I.viewMode=C.detail.mode;const A=document.getElementById("app");A.innerHTML=xt(),ba(),_e()}));const t=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");t&&s&&(t.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",C=>{const A=C.target.closest(".category-menu-item");if(A){const T=A.dataset.category||null;mr(T),s.classList.add("hidden")}})),(V=document.getElementById("manage-categories-btn"))==null||V.addEventListener("click",C=>{C.stopPropagation();const A=document.getElementById("manage-categories-modal");A&&A.classList.add("open")}),(H=document.getElementById("close-manage-categories-btn"))==null||H.addEventListener("click",()=>{var C;(C=document.getElementById("manage-categories-modal"))==null||C.classList.remove("open")}),(J=document.querySelector("#manage-categories-modal .modal-overlay"))==null||J.addEventListener("click",()=>{var C;(C=document.getElementById("manage-categories-modal"))==null||C.classList.remove("open")}),(X=document.querySelector("#manage-categories-modal .modal-close"))==null||X.addEventListener("click",()=>{var C;(C=document.getElementById("manage-categories-modal"))==null||C.classList.remove("open")}),(E=document.getElementById("add-category-btn"))==null||E.addEventListener("click",async()=>{var T;const C=document.getElementById("new-category-input"),A=(T=C==null?void 0:C.value)==null?void 0:T.trim();if(A)try{await g.post("/categories",{name:A}),C.value="",p("Category added","success"),await Qe(!0),ye()}catch(R){p("Failed: "+R.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(C=>{C.addEventListener("change",async A=>{const T=C.dataset.category;try{await g.put(`/categories/${encodeURIComponent(T)}/nsfw`,{isNsfw:C.checked}),p(`${T} ${C.checked?"marked as 18+":"unmarked"}`,"success"),await Qe(!0),ye()}catch(R){p("Failed: "+R.message,"error"),C.checked=!C.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(C=>{C.addEventListener("click",async()=>{const A=C.dataset.category;if(confirm(`Delete category "${A}"?`))try{await g.delete(`/categories/${encodeURIComponent(A)}`),p("Category deleted","success"),I.activeCategory===A&&(I.activeCategory=null,localStorage.removeItem("library_active_category")),await Qe(!0),ye()}catch(T){p("Failed: "+T.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{I.artistFilter=null,localStorage.removeItem("library_artist_filter"),ye()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",C=>{var T;I.searchQuery=C.target.value,localStorage.setItem("library_search",C.target.value),I.searchAuthor=null,I.searchAuthorSource=null,localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source");const A=document.getElementById("library-grid");if(A){const R=qt();A.innerHTML=R.map(Rt).join("")||Dt();const _=document.getElementById("search-clear");!_&&I.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(T=document.getElementById("search-clear"))==null||T.addEventListener("click",()=>{I.searchQuery="",I.searchAuthor=null,I.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),n.value="",ye()})):_&&!I.searchQuery&&_.remove()}}),I.searchQuery&&n.focus());const r=document.getElementById("search-clear");r&&r.addEventListener("click",()=>{I.searchQuery="",I.searchAuthor=null,I.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),ye()});const i=document.getElementById("search-sources-card");i&&i.addEventListener("click",()=>{const C=I.searchAuthor||I.searchQuery,A=I.searchAuthorSource||"nhentai.net";C&&(window.location.hash=`#/scrapers?browse=${encodeURIComponent(A)}&q=${encodeURIComponent(C)}`)});const c=document.getElementById("library-sort");c&&c.addEventListener("change",C=>{I.sortBy=C.target.value,localStorage.setItem("library_sort",I.sortBy),ye()}),hr(),window.removeEventListener("clearFilters",ts),window.addEventListener("clearFilters",ts);const l=document.getElementById("add-manga-btn"),d=document.getElementById("mobile-add-btn"),u=document.getElementById("add-modal"),m=document.getElementById("add-modal-close"),f=document.getElementById("add-modal-cancel"),w=document.getElementById("add-modal-submit"),x=document.getElementById("mobile-menu"),v=()=>{x&&x.classList.add("hidden"),u&&u.classList.add("open")};l&&l.addEventListener("click",v),d&&d.addEventListener("click",v),m&&m.addEventListener("click",()=>u.classList.remove("open")),f&&f.addEventListener("click",()=>u.classList.remove("open")),w&&w.addEventListener("click",async()=>{const C=document.getElementById("manga-url"),A=C.value.trim();if(!A){p("Please enter a URL","error");return}try{w.disabled=!0,w.textContent="Adding...",await g.addBookmark(A),p("Manga added successfully!","success"),u.classList.remove("open"),C.value="",await Qe(),ye()}catch(T){p("Failed to add manga: "+T.message,"error")}finally{w.disabled=!1,w.textContent="Add"}});const L=document.getElementById("add-series-btn"),S=document.getElementById("mobile-add-series-btn"),B=document.getElementById("add-series-modal"),D=document.getElementById("add-series-modal-close"),k=document.getElementById("add-series-modal-cancel"),q=document.getElementById("add-series-modal-submit"),U=document.getElementById("mobile-menu");if((L||S)&&B){const C=()=>{U&&U.classList.add("hidden"),B.classList.add("open")};L&&L.addEventListener("click",C),S&&S.addEventListener("click",C)}D&&D.addEventListener("click",()=>B.classList.remove("open")),k&&k.addEventListener("click",()=>B.classList.remove("open")),q&&q.addEventListener("click",async()=>{const C=document.getElementById("series-title"),A=document.getElementById("series-alias"),T=C.value.trim(),R=A.value.trim();if(!T){p("Please enter a title","error");return}try{q.disabled=!0,q.textContent="Creating...",await g.createSeries(T,R),p("Series created successfully!","success"),B.classList.remove("open"),C.value="",A.value="",await Qe(!0),ye()}catch(_){p("Failed to create series: "+_.message,"error")}finally{q.disabled=!1,q.textContent="Create"}});const b=B==null?void 0:B.querySelector(".modal-overlay");b&&b.addEventListener("click",()=>B.classList.remove("open"));const $=document.getElementById("empty-add-btn");$&&u&&$.addEventListener("click",()=>u.classList.add("open"));const M=document.getElementById("empty-add-series-btn");M&&B&&M.addEventListener("click",()=>B.classList.add("open"));const N=u==null?void 0:u.querySelector(".modal-overlay");N&&N.addEventListener("click",()=>u.classList.remove("open")),_e()}function mr(e){I.activeCategory=e,e?localStorage.setItem("library_active_category",e):localStorage.removeItem("library_active_category"),ye()}async function Qe(e=!1){try{if(K.isDemo){const[r,i]=await Promise.all([me.loadBookmarks(e),me.loadSeries(e)]);I.bookmarks=r,I.categories=[],I.series=i,I.favorites={favorites:{},listOrder:[]},I.loading=!1;return}const[t,s,a,n]=await Promise.all([me.loadBookmarks(e),me.loadCategories(e),me.loadSeries(e),me.loadFavorites(e)]);I.bookmarks=t,I.categories=s,I.series=a,I.favorites=n,I.loading=!1}catch{p("Failed to load library","error"),I.loading=!1}}async function ye(){var t;const e=document.getElementById("app");if(K.isDemo)I.activeCategory=null,I.artistFilter=null,I.searchQuery="",I.searchAuthor=null,I.searchAuthorSource=null;else{const s=localStorage.getItem("library_active_category");I.activeCategory!==s&&(I.activeCategory=s);const a=localStorage.getItem("library_artist_filter")||null;I.artistFilter!==a&&(I.artistFilter=a);const n=localStorage.getItem("library_search")||"";I.searchQuery!==n&&(I.searchQuery=n),I.searchAuthor=localStorage.getItem("library_search_author")||null,I.searchAuthorSource=localStorage.getItem("library_search_author_source")||null}I.loading&&(e.innerHTML=xt()),I.bookmarks.length===0&&I.loading&&await Qe(),e.innerHTML=xt(),ba(),sessionStorage.getItem("open_add_modal")&&(sessionStorage.removeItem("open_add_modal"),(t=document.getElementById("add-modal"))==null||t.classList.add("open")),Ct.forEach(s=>s()),Ct=[me.subscribe("bookmarks",s=>{I.bookmarks=s;const a=document.getElementById("library-grid");if(a){const n=qt();a.innerHTML=n.map(Rt).join("")||Dt()}})]}function gr(){const e=document.getElementById("app");e&&e.removeEventListener("click",ss),window.removeEventListener("clearFilters",ts),De&&(document.removeEventListener("click",De),De=null),Ct.forEach(t=>t()),Ct=[]}const fr={mount:ye,unmount:gr,render:xt},vr="manga-offline",yr=1,Ue="images",de="chapters";let ht=null;function dt(){return new Promise((e,t)=>{if(ht)return e(ht);const s=indexedDB.open(vr,yr);s.onupgradeneeded=a=>{const n=a.target.result;n.objectStoreNames.contains(Ue)||n.createObjectStore(Ue),n.objectStoreNames.contains(de)||n.createObjectStore(de)},s.onsuccess=()=>{ht=s.result,e(ht)},s.onerror=()=>t(s.error)})}function Ve(e,t){return dt().then(s=>new Promise((a,n)=>{const c=s.transaction(e,"readonly").objectStore(e).get(t);c.onsuccess=()=>a(c.result),c.onerror=()=>n(c.error)}))}function as(e,t,s){return dt().then(a=>new Promise((n,r)=>{const l=a.transaction(e,"readwrite").objectStore(e).put(s,t);l.onsuccess=()=>n(),l.onerror=()=>r(l.error)}))}function ns(e,t){return dt().then(s=>new Promise((a,n)=>{const c=s.transaction(e,"readwrite").objectStore(e).delete(t);c.onsuccess=()=>a(),c.onerror=()=>n(c.error)}))}function Es(e){return dt().then(t=>new Promise((s,a)=>{const i=t.transaction(e,"readonly").objectStore(e).getAllKeys();i.onsuccess=()=>s(i.result),i.onerror=()=>a(i.error)}))}function Je(e,t){return`${e}:${t}`}function Cs(e,t,s){return`${e}:${t}:${s}`}function br(e){const t=e.split(":");return{mangaId:t[0],chapterNum:parseFloat(t[1])}}async function Ss(e,t,s=null){const a=await g.get(`/bookmarks/${e}/chapters/${t}/reader-images`);if(!a||!a.images||a.images.length===0)throw new Error("No images found for this chapter");const n=a.images,r=n.length;let i=0;const c=g.getToken();for(let d=0;d<n.length;d++){const u=typeof n[d]=="string"?n[d]:n[d].url,m=u.startsWith("http")?u:`${window.location.origin}${u}`;try{const f=await fetch(m,{headers:c?{Authorization:`Bearer ${c}`}:{}});if(!f.ok)throw new Error(`HTTP ${f.status}`);const w=await f.blob();await as(Ue,Cs(e,t,u),w),i++,s&&s(i,r)}catch(f){console.error(`[Offline] Failed to cache image ${d+1}/${r}:`,f)}}const l={mangaId:e,chapterNum:t,imageUrls:n.map(d=>typeof d=="string"?d:d.url),savedAt:Date.now(),imageCount:i};return await as(de,Je(e,t),l),{success:!0,imageCount:i}}async function wr(e,t){const s=await Ve(de,Je(e,t));if(!s)return null;const a=[];for(const n of s.imageUrls){const r=await Ve(Ue,Cs(e,t,n));if(r)a.push(URL.createObjectURL(r));else return a.forEach(i=>URL.revokeObjectURL(i)),null}return a}async function wa(e,t){const s=await Ve(de,Je(e,t));if(s&&s.imageUrls)for(const a of s.imageUrls)await ns(Ue,Cs(e,t,a));await ns(de,Je(e,t))}async function kr(e,t){if(!await Ve(de,Je(e,t)))return!1;await wa(e,t);try{return await Ss(e,t),!0}catch(a){return console.warn("[Offline] Could not re-save chapter after edit:",a),!1}}async function $r(e,t){return!!await Ve(de,Je(e,t))}async function Er(){const e=await Es(de),t=[];for(const s of e){if(s.startsWith("auto-offline-"))continue;const a=await Ve(de,s);a&&t.push(a)}return t}async function ka(e){const t=await Es(de),s=[];for(const a of t)if(!a.startsWith("auto-offline-")&&a.startsWith(`${e}:`)){const{chapterNum:n}=br(a);s.push(n)}return s}async function Cr(){if(navigator.storage&&navigator.storage.estimate){const e=await navigator.storage.estimate();return{used:e.usage||0,quota:e.quota||0,usedMB:((e.usage||0)/(1024*1024)).toFixed(1),quotaMB:((e.quota||0)/(1024*1024)).toFixed(0)}}return{used:0,quota:0,usedMB:"0",quotaMB:"Unknown"}}async function Sr(){const e=await dt();await new Promise((t,s)=>{const r=e.transaction(Ue,"readwrite").objectStore(Ue).clear();r.onsuccess=t,r.onerror=s}),await new Promise((t,s)=>{const r=e.transaction(de,"readwrite").objectStore(de).clear();r.onsuccess=t,r.onerror=s})}async function xr(e,t){t?await as(de,`auto-offline-${e}`,{enabled:!0,mangaId:e}):await ns(de,`auto-offline-${e}`)}async function Lr(e){const t=await Ve(de,`auto-offline-${e}`);return!!(t!=null&&t.enabled)}async function Ir(){return(await Es(de)).filter(t=>t.startsWith("auto-offline-")).map(t=>t.replace("auto-offline-",""))}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",async e=>{var t;if(((t=e.data)==null?void 0:t.type)==="sync-offline"){const s=e.data.mangaId;console.log(`[Offline] Auto-sync triggered for manga ${s}`);try{await $a(s)}catch(a){console.error("[Offline] Auto-sync failed:",a)}}});async function $a(e){try{const t=await g.getBookmark(e);if(!t)return;const s=t.downloadedChapters||[],a=await ka(e),n=s.filter(r=>!a.includes(r));console.log(`[Offline] ${n.length} new chapters to sync for ${t.alias||t.title}`);for(const r of n)await Ss(e,r),console.log(`[Offline] Auto-synced chapter ${r}`)}catch(t){console.error("[Offline] Sync error:",t)}}const Br={saveChapterOffline:Ss,getOfflineChapter:wr,deleteOfflineChapter:wa,refreshOfflineChapter:kr,isChapterOffline:$r,getOfflineChapters:Er,getOfflineChaptersForManga:ka,getStorageUsage:Cr,clearAllOfflineData:Sr,setAutoOffline:xr,isAutoOffline:Lr,getAutoOfflineManga:Ir,syncNewChaptersForManga:$a},Ar=e=>String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");let o={manga:null,chapter:null,versionUrl:null,images:[],trophyPages:{},mode:"manga",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!0,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null,isStreamingMode:!1,_streamAbortController:null,isVolumeMode:!1,volume:null};function xs(e,t=o.manga){if(!e||!t)return"";const s=(t.chapters||[]).find(n=>n.url===e),a=[];return s&&(s.releaseGroup?a.push(s.releaseGroup):s.title&&s.title!==`Chapter ${s.number}`&&a.push(s.title)),e.startsWith("local://")&&a.push("Local"),a.join(" · ")}function Ls(e){var s,a;const t=(a=(s=o.manga)==null?void 0:s.downloadedVersions)==null?void 0:a[e];return Array.isArray(t)?t:t?[t]:[]}function Mr(){var t;const e=Ls((t=o.chapter)==null?void 0:t.number);return e.length<2||!o.versionUrl?"":xs(o.versionUrl)||`Version ${e.indexOf(o.versionUrl)+1}`}function Ea(){if(!o.manga||!o.chapter||!o.allFavorites||!o.allFavorites.favorites)return!1;if(o.isCollectionMode)return!0;let t=[is()];if(o.mode==="manga"&&!o.singlePageMode){const n=oe()[o.currentPage];n&&Array.isArray(n)?t=n:n&&n.pages&&(t=n.pages)}const s=t.map(a=>{const n=lt(o.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in o.allFavorites.favorites){const n=o.allFavorites.favorites[a];if(Array.isArray(n)){for(const r of n)if(r.mangaId===o.manga.id&&r.chapterNum===o.chapter.number&&r.imagePaths)for(const i of r.imagePaths){const c=typeof i=="string"?i:(i==null?void 0:i.filename)||(i==null?void 0:i.path);for(const l of s)if(l&&l.filename===c)return!0}}}return!1}function rs(){const e=document.getElementById("favorites-btn");e&&(Ea()?e.classList.add("active"):e.classList.remove("active"))}function Ne(){var m,f;if(o.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!o.manga||!o.images.length&&!o.isStreamingMode)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const e=o.manga.alias||o.manga.title,t=(m=o.chapter)==null?void 0:m.number,s=o.isCollectionMode||o.isStreamingMode?"":Mr(),a=!o.isCollectionMode&&!o.isStreamingMode&&Ls(t).length>1,r=oe().length,i=o.images.length;let c,l;o.mode==="webtoon"?(c=i-1,l=`${i} pages`):o.singlePageMode?(c=i-1,l=`${o.currentPage+1} / ${i}`):(c=r-1,l=`${o.currentPage+1} / ${r}`);const d=Ea(),u=La();return`
    <div class="reader ${o.mode}-mode ${o.showControls?"":"controls-hidden"}">
      <!-- Unified Top Bar -->
      <div class="reader-bar">
        <button class="reader-bar-btn close-btn" id="reader-close-btn" title="Back">×</button>
        <div class="reader-title">
          <span class="manga-name">${e}</span>
          ${o.isStreamingMode?"":o.isVolumeMode?`<span class="chapter-name" title="Volume release">${Ar(((f=o.volume)==null?void 0:f.name)||"Volume")}</span>`:`<span class="chapter-name">Ch. ${t}${s?` · <span class="version-label" title="Version being read">${s}</span>`:""}</span>`}
        </div>
        ${o.isCollectionMode?"":`
        <div class="reader-bar-tools" id="reader-toolbar">
          ${o.isStreamingMode?`
          <button class="reader-bar-btn" id="stream-add-lib-btn" title="Add to Library">${h("download",{title:"Add to Library"})}</button>
          <span class="reader-bar-divider"></span>
          `:`
          ${o.isVolumeMode?"":`<button class="reader-bar-btn ${d?"active":""}" id="favorites-btn" title="Add to favorites">${h("star",{title:"Add to favorites"})}</button>`}

          <button class="reader-bar-btn" id="rotate-btn" title="Rotate 90° CW">${h("rotate-cw",{title:"Rotate 90 degrees clockwise"})}</button>
          ${o.mode==="manga"&&!o.singlePageMode?`
            <button class="reader-bar-btn" id="swap-btn" title="Swap pages in spread">${h("arrow-left-right",{title:"Swap pages in spread"})}</button>
          `:""}
          ${o.singlePageMode||o.mode==="webtoon"?`
            <button class="reader-bar-btn" id="split-btn" title="Split wide image into halves">${h("scissors",{title:"Split wide image into halves"})}</button>
          `:""}
          <span class="reader-bar-divider"></span>
          `}
          ${o.mode==="manga"?`
            <button class="reader-bar-btn ${o.singlePageMode?"active":""}" id="single-page-btn" title="${o.singlePageMode?"Switch to double page":"Switch to single page"}">
              ${o.singlePageMode?h("rectangle-vertical"):h("columns-2")}
            </button>
            ${o.isStreamingMode?"":`
            <button class="reader-bar-btn ${u?"active":""}" id="trophy-btn" title="${u?"Unmark trophy":"Mark as trophy"}">${h("trophy")}</button>
            `}
          `:""}
          ${a?`<button class="reader-bar-btn" id="version-btn" title="Switch version / keep only one">${h("list",{title:"Versions"})}</button>`:""}
          <button class="reader-bar-btn" id="fullscreen-btn" title="Toggle fullscreen">${h("maximize",{title:"Toggle fullscreen"})}</button>
          <button class="reader-bar-btn" id="reader-settings-btn" title="Settings">${h("settings",{title:"Settings"})}</button>
        </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${o.mode==="webtoon"?`zoom: ${o.zoom}%`:""}">
        ${o.isCollectionMode?Ca():o.mode==="webtoon"?Sa():xa()}
      </div>
      
      <!-- Footer -->
      <div class="reader-footer">
        ${o.isStreamingMode?"":`
        <button class="btn btn-secondary" id="prev-chapter-btn">← Prev</button>
        `}
        <div class="page-slider-container">
          ${o.mode!=="webtoon"?`
          <input type="range" class="page-slider" id="page-slider"
            min="0" max="${c}" value="${o.currentPage}"
          >
          `:""}
          <span class="page-indicator" id="page-indicator">${l}</span>
        </div>
        ${o.isStreamingMode?"":`
        <button class="btn btn-secondary" id="next-chapter-btn">Next →</button>
        `}
      </div>
      
      <!-- Settings panel -->
      <div class="reader-settings hidden" id="reader-settings">
        <div class="settings-panel">
          <h3>Reader Settings</h3>
          <div class="setting-row">
            <label>Mode</label>
            <div class="btn-group">
              <button class="btn ${o.mode==="webtoon"?"btn-primary":"btn-secondary"}" data-mode="webtoon">Webtoon</button>
              <button class="btn ${o.mode==="manga"?"btn-primary":"btn-secondary"}" data-mode="manga">Manga</button>
            </div>
          </div>
          ${o.mode==="webtoon"?`
          <div class="setting-row">
            <label>Zoom: ${o.zoom}%</label>
            <input type="range" min="50" max="200" value="${o.zoom}" id="zoom-slider">
          </div>
          `:`
          <div class="setting-row">
            <label>Direction</label>
            <div class="btn-group">
              <button class="btn ${o.direction==="rtl"?"btn-primary":"btn-secondary"}" data-direction="rtl">RTL ←</button>
              <button class="btn ${o.direction==="ltr"?"btn-primary":"btn-secondary"}" data-direction="ltr">→ LTR</button>
            </div>
          </div>
          <div class="settings-divider"></div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="first-page-single" ${o.firstPageSingle?"checked":""}> First Page Single
            </label>
            <span class="setting-hint">Show cover page alone</span>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="last-page-single" ${o.lastPageSingle?"checked":""}> 
                Link to Next Chapter
            </label>
            <span class="setting-hint">Pair last page with next chapter's first page</span>
          </div>
          `}
          <button class="btn btn-secondary settings-close-btn" id="close-settings-btn">Close</button>
        </div>
      </div>
    </div>
  `}function Ca(){const e=o.mode==="manga";if(e&&!o.singlePageMode){const t=o.images[o.currentPage];if(!t)return"";const s=t.urls||[t.url],a=t.displayMode||"single";return t.displaySide,a==="double"&&s.length>=2?`
            <div class="manga-spread collection-spread ${o.direction} double-page">
              <div class="manga-page"><img src="${s[0]}" alt="Page A"></div>
              <div class="manga-page"><img src="${s[1]}" alt="Page B"></div>
            </div>
            `:`
            <div class="manga-spread collection-spread single ${o.direction}">
              <div class="manga-page"><img src="${s[0]}" alt="Page"></div>
            </div>
            `}return`
    <div class="${e?"manga-spread single "+o.direction:"gallery-pages"}">
      ${(e?[o.images[o.currentPage]]:o.images).map((t,s)=>{if(!t)return"";const a=t.displayMode||"single",n=t.displaySide||"left",r=t.urls||[t.url];return a==="double"&&r.length>=2?`
            <div class="gallery-page double-page side-${n} ${e?"manga-page":""}" data-page="${s}">
              <img src="${r[0]}" alt="Page ${s+1}A" loading="lazy">
              <img src="${r[1]}" alt="Page ${s+1}B" loading="lazy">
            </div>
          `:`
            <div class="gallery-page single-page ${e?"manga-page":""}" data-page="${s}">
              <img src="${r[0]}" alt="Page ${s+1}" loading="lazy">
            </div>
          `}).join("")}
    </div>
  `}function Sa(){return`
    <div class="webtoon-pages">
      ${o.images.map((e,t)=>{const s=typeof e=="string"?e:e.url,a=o.trophyPages[t];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${t}">
          ${a?`<div class="trophy-indicator">${h("trophy")}</div>`:""}
          <img src="${s}" alt="Page ${t+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function xa(){if(o.singlePageMode)return Tr();const t=oe()[o.currentPage];if(!t)return"";if(t.type==="link"){const s=t.pages[0],a=o.images[s],n=typeof a=="string"?a:a.url,r=o.trophyPages[s];return`
        <div class="manga-spread ${o.direction}">
          <div class="manga-page ${r?"trophy-page":""}">
            ${r?`<div class="trophy-indicator">${h("trophy")}</div>`:""}
            <img src="${n}" alt="Page ${s+1}">
          </div>
          <div class="manga-page link-page" id="link-page">
            <div class="link-overlay">Ch. ${t.nextChapter} →</div>
            <img src="${t.nextImage}" alt="Next chapter preview">
          </div>
        </div>
      `}return`
    <div class="manga-spread ${o.direction}">
      ${t.map(s=>{const a=o.images[s],n=typeof a=="string"?a:a.url,r=o.trophyPages[s];return`
        <div class="manga-page ${r?"trophy-page":""}">
          ${r?`<div class="trophy-indicator">${h("trophy")}</div>`:""}
          <img src="${n}" alt="Page ${s+1}">
        </div>
      `}).join("")}
    </div>
  `}function Tr(){const e=o.currentPage,t=o.trophyPages[e];if(t&&!t.isSingle&&t.pages&&t.pages.length===2){const[r,i]=t.pages,c=o.images[r],l=o.images[i],d=typeof c=="string"?c:c==null?void 0:c.url,u=typeof l=="string"?l:l==null?void 0:l.url;if(d&&u)return`
            <div class="manga-spread ${o.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">${h("trophy")}</div><img src="${d}" alt="Page ${r+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">${h("trophy")}</div><img src="${u}" alt="Page ${i+1}"></div>
            </div>
            `}const s=o.images[e];if(!s)return"";const a=typeof s=="string"?s:s.url,n=o.trophyPages[e];return`
    <div class="manga-spread single ${o.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?`<div class="trophy-indicator">${h("trophy")}</div>`:""}
        <img src="${a}" alt="Page ${e+1}">
      </div>
    </div>
  `}function oe(){const e=[],t=o.images.length;let s=0;if(o.isCollectionMode){for(let n=0;n<t;n++)e.push([n]);return e}let a=!o.firstPageSingle;for(;s<t;){const n=o.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[r,i]=n.pages;e.push([r,i]),s=Math.max(r,i)+1}else e.push([s]),s++;continue}if(!a){a=!0,e.push([s]),s++;continue}if(o.lastPageSingle&&s===t-1){o.nextChapterImage?e.push({type:"link",pages:[s],nextImage:o.nextChapterImage,nextChapter:o.nextChapterNum}):e.push([s]),s++;break}s+1<t?o.trophyPages[s+1]?(e.push([s]),s++):o.lastPageSingle&&s+1===t-1?(e.push([s]),o.nextChapterImage?e.push({type:"link",pages:[s+1],nextImage:o.nextChapterImage,nextChapter:o.nextChapterNum}):e.push([s+1]),s+=2):(e.push([s,s+1]),s+=2):(e.push([s]),s++)}return e}function La(){if(o.singlePageMode)return!!o.trophyPages[o.currentPage];const t=oe()[o.currentPage];return t?(Array.isArray(t)?t:t.pages||[]).some(a=>!!o.trophyPages[a]):!1}function Is(){if(o.singlePageMode)return[o.currentPage];const t=oe()[o.currentPage];return t?Array.isArray(t)?t:t.pages||[]:[]}async function _r(){if(!o.manga||!o.chapter||o.isCollectionMode)return;const e=Is();if(e.length===0)return;if(e.some(s=>!!o.trophyPages[s])){const s=[...e];if(o.singlePageMode){const a=o.trophyPages[o.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete o.trophyPages[a]),p(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=e,a=o.singlePageMode||e.length===1;if(!o.singlePageMode&&e.length===2){const r=await _a(e,"Mark as trophy");if(!r)return;s=r.pages,a=r.pages.length===1}s.forEach(r=>{o.trophyPages[r]={isSingle:a,pages:[...s]}});const n=a?"single":"double";p(`Page${s.length>1?"s":""} marked as trophy (${n})`,"success")}try{await g.saveTrophyPages(o.manga.id,o.chapter.number,o.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}Me(),Ia()}function Ia(){const e=document.getElementById("trophy-btn");if(e){const t=La();e.classList.toggle("active",t),e.title=t?"Unmark trophy":"Mark as trophy"}}function Ba(){var a;if(!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode||!o.images.length)return null;const e=o.images.length;let t=1,s=!1;if(o.mode==="manga"){const n=Is();n.length>0&&(t=Math.min(...n)+1),s=n.includes(e-1)}else{const n=document.getElementById("reader-content");if(n){const r=[...n.querySelectorAll("img")],i=n.scrollTop;let c=0;r.forEach((u,m)=>{i>=c&&(t=m+1),c+=u.offsetHeight});const l=n.scrollHeight>n.clientHeight+10,d=r.length>0&&r.every(u=>u.complete&&u.naturalHeight>0);s=l?i+n.clientHeight>=n.scrollHeight-4:d}}return s&&(t=e),{mangaId:o.manga.id,chapterNumber:o.chapter.number,volumeId:o.isVolumeMode?(a=o.volume)==null?void 0:a.id:null,currentPage:t,totalPages:e}}async function He(e=Ba()){var t,s;if(!(!e||K.isDemo)){if(e.volumeId){try{if(await g.saveVolumeProgress(e.mangaId,e.volumeId,e.currentPage,e.totalPages),e.currentPage>=e.totalPages&&((t=o.manga)==null?void 0:t.id)===e.mangaId&&o.volume){const a=new Set(o.manga.readChapters||[]);for(const n of o.volume.chapters||[])a.add(n);o.manga.readChapters=[...a]}}catch(a){console.error("Failed to save volume progress:",a)}return}try{if(await g.updateReadingProgress(e.mangaId,e.chapterNumber,e.currentPage,e.totalPages),e.currentPage>=e.totalPages&&((s=o.manga)==null?void 0:s.id)===e.mangaId){const a=new Set(o.manga.readChapters||[]);a.add(e.chapterNumber),o.manga.readChapters=[...a]}}catch(a){console.error("Failed to save progress:",a)}}}let Fe=null;function Aa(){Fe&&clearTimeout(Fe),Fe=setTimeout(()=>{Fe=null,He()},1500)}function Lt(){var s,a,n,r,i,c,l,d,u,m,f,w,x,v,L,S,B,D,k,q,U;const e=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{o.isStreamingMode||(await He(),await qe()),o.isStreamingMode?F.go("/scrapers"):o.manga&&o.manga.id!=="gallery"?F.go(`/manga/${o.manga.id}`):F.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{F.go(o.isStreamingMode?"/scrapers":"/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var b;(b=document.getElementById("reader-settings"))==null||b.classList.toggle("hidden")}),(r=document.getElementById("close-settings-btn"))==null||r.addEventListener("click",()=>{var b;(b=document.getElementById("reader-settings"))==null||b.classList.add("hidden")}),(i=document.getElementById("single-page-btn"))==null||i.addEventListener("click",()=>{if(o.singlePageMode){const b=oe();let $=0;for(let M=0;M<b.length;M++)if(b[M].includes(o.currentPage)){$=M;break}o.singlePageMode=!1,o.currentPage=$}else{const $=oe()[o.currentPage];o.singlePageMode=!0,o.currentPage=$?$[0]:0}localStorage.setItem("reader_single_page",o.singlePageMode?"1":"0"),Ge()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{_r()}),e.querySelectorAll("[data-mode]").forEach(b=>{b.addEventListener("click",()=>{var N,V;const $=b.dataset.mode;let M=is();if(o.mode=$,localStorage.setItem("reader_mode",o.mode),$==="webtoon")o.currentPage=M;else if(o.singlePageMode)o.currentPage=M;else{const H=oe();let J=0;for(let X=0;X<H.length;X++)if(H[X].includes(M)){J=X;break}o.currentPage=J}(N=o.manga)!=null&&N.id&&((V=o.chapter)!=null&&V.number)&&qe(),Ge(),$==="webtoon"&&setTimeout(()=>{const H=document.getElementById("reader-content");if(H){const J=H.querySelectorAll("img");J[M]&&J[M].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),e.querySelectorAll("[data-direction]").forEach(b=>{b.addEventListener("click",async()=>{var $,M;o.direction=b.dataset.direction,localStorage.setItem("reader_direction",o.direction),($=o.manga)!=null&&$.id&&((M=o.chapter)!=null&&M.number)&&await qe(),Ge()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async b=>{o.firstPageSingle=b.target.checked,await qe(),Me()}),(d=document.getElementById("last-page-single"))==null||d.addEventListener("change",async b=>{var $,M;o.lastPageSingle=b.target.checked,await qe(),o.lastPageSingle&&(($=o.manga)!=null&&$.id)&&((M=o.chapter)!=null&&M.number)?await Ma():(o.nextChapterImage=null,o.nextChapterNum=null),Me()}),(u=document.getElementById("zoom-slider"))==null||u.addEventListener("input",b=>{o.zoom=parseInt(b.target.value);const $=document.getElementById("reader-content");$&&($.style.zoom=`${o.zoom}%`)});const t=document.getElementById("page-slider");if(t&&(t.addEventListener("input",b=>{const $=parseInt(b.target.value),M=document.getElementById("page-indicator");M&&(o.singlePageMode?M.textContent=`${$+1} / ${o.images.length}`:M.textContent=`${$+1} / ${oe().length}`)}),t.addEventListener("change",b=>{o.currentPage=parseInt(b.target.value),Me()})),o.mode==="manga"){const b=document.getElementById("reader-content");b==null||b.addEventListener("click",$=>{var H;if($.target.closest("button, a, .link-overlay"))return;const M=b.getBoundingClientRect(),V=($.clientX-M.left)/M.width;V<.3?ls():V>.7?yt():(o.showControls=!o.showControls,(H=document.querySelector(".reader"))==null||H.classList.toggle("controls-hidden",!o.showControls))})}document.addEventListener("keydown",Pa),(m=document.getElementById("prev-chapter-btn"))==null||m.addEventListener("click",()=>It(-1)),(f=document.getElementById("next-chapter-btn"))==null||f.addEventListener("click",()=>It(1)),o.mode==="webtoon"&&((w=document.getElementById("reader-content"))==null||w.addEventListener("click",()=>{var b;o.showControls=!o.showControls,(b=document.querySelector(".reader"))==null||b.classList.toggle("controls-hidden",!o.showControls)}),(x=document.getElementById("reader-content"))==null||x.addEventListener("scroll",Aa,{passive:!0})),(v=document.getElementById("rotate-btn"))==null||v.addEventListener("click",async()=>{const b=Wt();if(!(!b||!o.manga||!o.chapter))try{p("Rotating...","info");const $=await mt().rotate(b);$.images&&(await Gt($.images),p("Page rotated","success"))}catch($){p("Rotate failed: "+$.message,"error")}}),(L=document.getElementById("swap-btn"))==null||L.addEventListener("click",async()=>{const $=oe()[o.currentPage];if(!$||$.length!==2||!o.manga||!o.chapter){p("Select a spread with 2 pages to swap","info");return}const M=lt(o.images[$[0]]),N=lt(o.images[$[1]]);if(!(!M||!N))try{p("Swapping...","info");const V=await mt().swap(M,N);V.images&&(await Gt(V.images),p("Pages swapped","success"))}catch(V){p("Swap failed: "+V.message,"error")}}),(S=document.getElementById("split-btn"))==null||S.addEventListener("click",async()=>{const b=Wt();if(!b||!o.manga||!o.chapter||!confirm("Split this page into halves? This is permanent."))return;const $=document.getElementById("split-btn");try{p("Preparing to split...","info"),$&&($.disabled=!0),o.images=[],o.loading=!0,e.innerHTML=Ne(),await new Promise(N=>setTimeout(N,2e3)),p("Splitting page...","info");const M=await mt().split(b);$&&($.disabled=!1),await Pe(o.manga.id,Qs(),o.versionUrl),e.innerHTML=Ne(),Lt(),Me(),M.warning?p(M.warning,"warning"):p("Page split into halves","success")}catch(M){$&&($.disabled=!1),p("Split failed: "+M.message,"error"),await Pe(o.manga.id,Qs(),o.versionUrl),e.innerHTML=Ne(),Lt()}}),(B=document.getElementById("delete-page-btn"))==null||B.addEventListener("click",async()=>{const b=Wt();if(!(!b||!o.manga||!o.chapter)&&confirm(`Delete page "${b}" permanently? This cannot be undone.`))try{p("Deleting...","info");const $=await mt().remove(b);$.images&&(await Gt($.images),p("Page deleted","success"))}catch($){p("Delete failed: "+$.message,"error")}}),(D=document.getElementById("favorites-btn"))==null||D.addEventListener("click",async()=>{try{const M=await g.getFavorites();o.allFavorites=M,o.favoriteLists=Object.keys(M.favorites||M||{})}catch(M){console.error("Failed to load favorites",M),p("Failed to load favorites","error");return}let $=[is()];if(o.mode==="manga"&&!o.singlePageMode){const N=oe()[o.currentPage];N&&Array.isArray(N)?$=N:N&&N.pages&&($=N.pages)}if($.length>1){const M=await _a($,"Select Page for Favorites");if(!M)return;$=M.pages}Fr($)}),(k=document.getElementById("version-btn"))==null||k.addEventListener("click",()=>{Rr()}),(q=document.getElementById("fullscreen-btn"))==null||q.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{p("Fullscreen not supported","info")})}),(U=document.getElementById("stream-add-lib-btn"))==null||U.addEventListener("click",async()=>{var M;const b=document.getElementById("stream-add-lib-btn");if(!((M=o.manga)!=null&&M._streamUrl)){p("No URL to add","error");return}const $=b.innerHTML;b.innerHTML=h("loader",{spin:!0}),b.disabled=!0;try{const N=await g.addBookmark(o.manga._streamUrl);if(!N.jobId)throw new Error("No job ID returned");p("Adding to library...","info");const V=setInterval(async()=>{var H;try{const X=(await g.getQueueHistory(20)).find(E=>E.id===N.jobId);X&&(X.status==="completed"?(clearInterval(V),(H=X.result)!=null&&H.bookmark&&(p("Added to library!","success"),b.innerHTML=h("check"),b.title="Added! Click to view",b.disabled=!1,b.onclick=()=>{F.go(`/manga/${X.result.bookmark.id}`)})):X.status==="failed"&&(clearInterval(V),p("Failed to add: "+(X.error||"Unknown error"),"error"),b.innerHTML=$,b.disabled=!1))}catch{}},1500)}catch(N){p("Failed to add: "+N.message,"error"),b.innerHTML=$,b.disabled=!1}}),document.body.classList.add("reader-active")}function os(e){return-(1e3+(Number(e==null?void 0:e.number)||0))}async function Pr(e,t){const s=os(t.volume);try{let a=await g.getChapterSettings(e,s);!Bt(a)&&t.prev&&(a=await g.getChapterSettings(e,os(t.prev))),Bt(a)&&cs(a)}catch(a){console.warn("Failed to load volume settings",a)}try{o.trophyPages=await g.getTrophyPages(e,s)||{}}catch{o.trophyPages={}}}function mt(){const e=o.manga.id;if(o.isVolumeMode){const s=o.volume.id;return{rotate:a=>g.rotateVolumePage(e,s,a,90),swap:(a,n)=>g.swapVolumePages(e,s,a,n),split:a=>g.splitVolumePage(e,s,a),remove:a=>g.deleteVolumePage(e,s,a)}}const t=o.chapter.number;return{rotate:s=>g.rotatePage(e,t,s,90,o.versionUrl),swap:(s,a)=>g.swapPages(e,t,s,a,o.versionUrl),split:s=>g.splitPage(e,t,s,o.versionUrl),remove:s=>g.deletePage(e,t,s,o.versionUrl)}}function Qs(){return o.isVolumeMode?`volume:${o.volume.id}`:o.chapter.number}function lt(e){var n;const t=typeof e=="string"?e:(e==null?void 0:e.url)||((n=e==null?void 0:e.urls)==null?void 0:n[0]);if(!t)return null;const a=t.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function Wt(){const e=Is();return e.length===0?null:lt(o.images[e[0]])}async function Gt(e){var s,a;(s=o.manga)!=null&&s.id&&((a=o.chapter)!=null&&a.number)&&!o.isStreamingMode&&!o.isVolumeMode&&Br.refreshOfflineChapter(o.manga.id,o.chapter.number).then(n=>{n&&console.log("[Reader] Refreshed offline copy after page edit")}).catch(n=>console.warn("[Reader] Offline refresh failed:",n));const t=Date.now();if(o.images=e.map(n=>{const r=typeof n=="string"?n:n==null?void 0:n.url;if(!r)return n;const i=r+(r.includes("?")?"&":"?")+`_t=${t}`;return typeof n=="string"?i:{...n,url:i}}),o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.min(o.currentPage,o.images.length-1);else{const n=oe();o.currentPage=Math.min(o.currentPage,n.length-1)}o.currentPage=Math.max(0,o.currentPage),Me()}async function Ma(){var e,t;if(!(!((e=o.manga)!=null&&e.id)||!((t=o.chapter)!=null&&t.number)||o.isVolumeMode))try{const s=await g.getNextChapterPreview(o.manga.id,o.chapter.number);o.nextChapterImage=s.firstImage||null,o.nextChapterNum=s.nextChapter||null}catch{o.nextChapterImage=null,o.nextChapterNum=null}}async function qr(){var r,i;if(!((r=o.manga)!=null&&r.id)||!((i=o.chapter)!=null&&i.number)||o.isCollectionMode||o.isVolumeMode)return;const t=[...o.manga.downloadedChapters||[]].sort((c,l)=>c-l),s=t.indexOf(o.chapter.number);if(s<0||s>=t.length-1)return;const a=t[s+1],n=o.manga.id;if(!(o._preloadCache&&o._preloadCache.chapterNum===a&&o._preloadCache.mangaId===n))try{const l=(o.manga.downloadedVersions||{})[a]||[],d=Array.isArray(l)?l[0]:l,u=d?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(d)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,f=(await g.get(u)).images||[];if(f.length===0)return;const w=f.map(x=>{const v=new Image,L=typeof x=="string"?x:x.url;return L&&(v.src=L),v});o._preloadCache={chapterNum:a,mangaId:n,images:f,imageObjects:w,versionUrl:d},console.log(`[Reader] Preloaded ${f.length} images for chapter ${a}`)}catch(c){console.warn("[Reader] Failed to preload next chapter:",c)}}function Ta(e,t,s=o.manga,a=[],n={}){return new Promise(r=>{const i=document.createElement("div");i.className="version-modal-overlay",i.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${t} has ${e.length} versions</h3>
                <p>${n.allowKeep?"Switch version, or keep one and delete the rest:":"Select which version to read:"}</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const c=i.querySelector(".version-list");e.forEach((l,d)=>{const u=document.createElement("button");u.className="version-item";const m=n.current&&n.current===l;m&&u.classList.add("current");const f=(xs(l,s)||`Version ${d+1}`)+(m?" (reading)":""),w=a.find(S=>S.url===l),x=[];if(w!=null&&w.imageCount&&x.push(`${w.imageCount} pages`),w!=null&&w.folder&&x.push(w.folder),u.innerHTML=`<span class="version-item-title"></span>${x.length?'<span class="version-item-meta"></span>':""}`,u.querySelector(".version-item-title").textContent=f,x.length&&(u.querySelector(".version-item-meta").textContent=x.join(" · ")),u.title=l,u.addEventListener("click",()=>{i.remove(),r(l)}),!n.allowKeep){c.appendChild(u);return}const v=document.createElement("div");v.className="version-item-row",v.appendChild(u);const L=document.createElement("button");L.className="version-item-keep",L.textContent="Keep only",L.title="Delete every other downloaded version of this chapter",L.addEventListener("click",()=>{i.remove(),r({keep:l})}),v.appendChild(L),c.appendChild(v)}),i.querySelector(".version-cancel").addEventListener("click",()=>{i.remove(),r(null)}),i.addEventListener("click",l=>{l.target===i&&(i.remove(),r(null))}),document.body.appendChild(i)})}async function Rr(){if(!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode)return;const e=o.chapter.number,t=Ls(e);if(t.length<2)return;let s=[];try{s=(await g.getChapterVersions(o.manga.id,e)).versions||[]}catch{}const a=await Ta(t,e,o.manga,s,{current:o.versionUrl,allowKeep:!0});if(a){if(typeof a=="string"){a!==o.versionUrl&&(await He(),F.go(`/read/${o.manga.id}/${e}?version=${encodeURIComponent(a)}`));return}a.keep&&await Dr(e,a.keep,t)}}async function Dr(e,t,s){var c;const a=s.filter(l=>l!==t),n=xs(t)||"this version";if(!confirm(`Keep only "${n}" and delete the other ${a.length} downloaded version${a.length>1?"s":""} of chapter ${e}?`))return;const r=o.manga.id;let i=0;for(const l of a)try{await g.deleteChapterVersion(r,e,l)}catch(d){i++,p("Failed to delete a version: "+d.message,"error")}i===0&&p("Other versions deleted","success");try{const l=await g.getBookmark(r);((c=o.manga)==null?void 0:c.id)===r&&(o.manga=l)}catch{}t!==o.versionUrl?F.go(`/read/${r}/${e}?version=${encodeURIComponent(t)}`):Ge()}function Fr(e){if(!o.manga||!o.chapter)return;const t=e.map(l=>{const d=lt(o.images[l]);return d?{filename:d}:null}).filter(Boolean),s=l=>{if(!o.allFavorites||!o.allFavorites.favorites)return-1;const d=o.allFavorites.favorites[l];if(!Array.isArray(d))return-1;for(let u=0;u<d.length;u++){const m=d[u];if(m.mangaId===o.manga.id&&m.chapterNum===o.chapter.number&&m.imagePaths)for(const f of m.imagePaths){const w=typeof f=="string"?f:(f==null?void 0:f.filename)||(f==null?void 0:f.path);for(const x of t)if(x&&x.filename===w)return u}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";o.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',o.favoriteLists.forEach(l=>{const u=s(l)!==-1;n+=`
                <button class="page-picker-option list-option ${u?"active-list":""}" data-list="${l}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${l}</span>
                    <span style="font-size: 1.2em;">${h(u?"check":"plus")}</span>
                </button>
            `}),n+="</div>"),a.innerHTML=`
        <div class="page-picker-modal" style="width: 90%; max-width: 400px;">
            <h3>${h("star")} Favorites</h3>
            <p class="page-picker-subtitle" style="margin-bottom: 20px;">Manage favorite lists</p>
            ${n}
            <div style="display: flex; gap: 10px;">
                <button class="page-picker-cancel" style="flex: 1;">Close</button>
            </div>
        </div>
    `;const r=document.createElement("style");r.innerHTML=`
        .list-option.active-list {
            background: #2a3b2a;
            border-color: #4CAF50;
        }
        .list-option.active-list:hover {
            background: #384d38;
        }
    `,a.appendChild(r),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),rs()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),rs())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const d=l.dataset.list,u=s(d),m=u!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(m){await g.removeFavoriteItem(d,u);const f=await g.getFavorites();o.allFavorites=f,l.classList.remove("active-list"),l.querySelector("span:last-child").innerHTML=h("plus")}else{const f=e.length>1?"double":"single",w={mangaId:o.manga.id,chapterNum:o.chapter.number,title:`${o.manga.alias||o.manga.title} Ch.${o.chapter.number} p${e[0]+1}`,imagePaths:t,displayMode:f,displaySide:o.direction==="rtl"?"right":"left"};await g.addFavoriteItem(d,w);const x=await g.getFavorites();o.allFavorites=x,l.classList.add("active-list"),l.querySelector("span:last-child").innerHTML=h("check")}}catch(f){console.error(f)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function _a(e,t){return new Promise(s=>{const[a,n]=e,r=o.images[a],i=o.images[n],c=typeof r=="string"?r:r==null?void 0:r.url,l=typeof i=="string"?i:i==null?void 0:i.url,d=o.direction==="rtl",u=d?n:a,m=d?a:n,f=d?l:c,w=d?c:l,x=document.createElement("div");x.className="page-picker-overlay",x.innerHTML=`
            <div class="page-picker-modal">
                <h3>${t}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${u+1}">
                        <img src="${f}" alt="Page ${u+1}">
                        <span class="page-picker-label">Page ${u+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${m+1}">
                        <img src="${w}" alt="Page ${m+1}">
                        <span class="page-picker-label">Page ${m+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    ${h("columns-2")} Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const v=L=>{x.remove(),s(L)};x.querySelectorAll(".page-picker-option").forEach(L=>{L.addEventListener("click",()=>{const S=L.dataset.choice;S==="left"?v({pages:[u]}):S==="right"?v({pages:[m]}):S==="both"&&v({pages:e})})}),x.querySelector(".page-picker-cancel").addEventListener("click",()=>v(null)),x.addEventListener("click",L=>{L.target===x&&v(null)}),document.body.appendChild(x)})}function is(){if(o.mode==="webtoon"){const e=document.getElementById("reader-content");if(e){const t=e.querySelectorAll("img");if(t.length>0){const s=e.scrollTop;if(s>10){let a=0;for(let n=0;n<t.length;n++){const r=t[n].offsetHeight;if(a+r>s)return n;a+=r}}}}return 0}else{if(o.singlePageMode)return o.currentPage;{const t=oe()[o.currentPage];return t&&t.length>0?t[0]:0}}}function Pa(e){var t;if(!(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")){if(e.key==="Escape"){const s=(t=o.manga)==null?void 0:t.id;Promise.all([He(),qe()]).finally(()=>{s&&F.go(`/manga/${s}`)});return}if(o.mode==="manga")e.key==="ArrowLeft"?o.direction==="rtl"?yt():ls():e.key==="ArrowRight"?o.direction==="rtl"?ls():yt():e.key===" "&&(e.preventDefault(),yt());else if(o.mode==="webtoon"&&e.key===" "){e.preventDefault();const s=document.getElementById("reader-content");if(s){const a=s.clientHeight*.8;s.scrollBy({top:e.shiftKey?-a:a,behavior:"smooth"})}}}}function yt(){const e=oe(),t=o.singlePageMode?o.images.length-1:e.length-1;if(o.currentPage<t)o.currentPage++,Me();else{const s=e[o.currentPage],a=s&&s.type==="link";He(),a&&(o.navigationDirection="next-linked"),It(1)}}function ls(){o.currentPage>0?(o.currentPage--,Me()):It(-1)}function Me(){const e=document.getElementById("reader-content");if(e){e.innerHTML=o.isCollectionMode?Ca():o.mode==="webtoon"?Sa():xa();const t=document.getElementById("page-indicator");t&&(o.singlePageMode?t.textContent=`${o.currentPage+1} / ${o.images.length}`:t.textContent=`${o.currentPage+1} / ${oe().length}`);const s=document.getElementById("page-slider");s&&(s.value=o.currentPage,s.max=o.singlePageMode?o.images.length-1:oe().length-1),Ia(),rs(),o.mode==="manga"&&Aa()}}function Ge(){const e=document.getElementById("app");e&&(e.innerHTML=Ne(),Lt())}async function It(e){var r,i;if(console.log("[Nav] navigateChapter called with delta:",e),o.isStreamingMode)return;if(!o.manga||!o.chapter){console.log("[Nav] early return - no manga or chapter");return}if(await He(),await qe(),o.isVolumeMode){const c=e>0?(r=o.volume)==null?void 0:r.next:(i=o.volume)==null?void 0:i.prev;c?(o.navigationDirection=e<0?"prev":null,F.go(`/read/${o.manga.id}/volume/${c.id}`)):p(e>0?"Last volume":"First volume","info");return}const s=[...o.manga.downloadedChapters||[]].sort((c,l)=>c-l),a=s.indexOf(o.chapter.number),n=a+e;if(console.log("[Nav]",{delta:e,chapterNumber:o.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length){o.navigationDirection||(o.navigationDirection=e<0?"prev":null);const c=s[n],d=(o.manga.downloadedVersions||{})[c]||[],u=Array.isArray(d)?d[0]:d,m=u?`?version=${encodeURIComponent(u)}`:"";console.log("[Nav] Calling router.go with:",`/read/${o.manga.id}/${c}${m}`),F.go(`/read/${o.manga.id}/${c}${m}`)}else p(e>0?"Last chapter":"First chapter","info")}async function Pe(e,t,s){var a,n,r,i,c;console.log("[Reader] loadData called:",{mangaId:e,chapterNum:t,versionUrl:s});try{o.mode=localStorage.getItem("reader_mode")||"manga",o.direction=localStorage.getItem("reader_direction")||"rtl",o.singlePageMode=localStorage.getItem("reader_single_page")!=="0",o.firstPageSingle=!0,o.lastPageSingle=!1,o.versionUrl=null,o.isVolumeMode=!1,o.volume=null;let l=null;if(String(t).startsWith("volume:")){const d=String(t).slice(7);o.isVolumeMode=!0,o.isCollectionMode=!1,o.isGalleryMode=!1,o.isStreamingMode=!1;const u=await g.getBookmark(e);o.manga=u;const m=await g.getVolumePages(e,d);o.volume={...m.volume,prev:m.prev||null,next:m.next||null},o.chapter={number:os(m.volume),title:m.volume.name,volumeId:d},o.images=m.images||[],l=m.progress&&!m.progress.finished?m.progress:null,await Pr(e,m)}else if(e==="gallery"){const d=decodeURIComponent(t),m=((a=(await g.getFavorites()).favorites)==null?void 0:a[d])||[];o.images=[];for(const f of m){const w=f.imagePaths||[],x=[];for(const v of w){let L;typeof v=="string"?L=v:v&&typeof v=="object"&&(L=v.filename||v.path||v.name||v.url,L&&L.includes("/")&&(L=L.split("/").pop()),L&&L.includes("\\")&&(L=L.split("\\").pop())),L&&x.push(`/api/public/chapter-images/${f.mangaId}/${f.chapterNum}/${encodeURIComponent(L)}`)}x.length>0&&o.images.push({urls:x,displayMode:f.displayMode||"single",displaySide:f.displaySide||"left"})}o.manga={id:"gallery",title:d,alias:d},o.chapter={number:"Gallery"},o.isGalleryMode=!0,o.isCollectionMode=!0,o.images.length===0&&p("Gallery is empty","warning")}else if(e==="trophies"){const d=t;let u=[],m="Trophies";if(d.startsWith("series-")){const f=d.replace("series-",""),x=(await store.loadSeries()).find(S=>S.id===f);m=x?x.alias||x.title:"Series Trophies";const L=(await store.loadBookmarks()).filter(S=>S.seriesId===f);for(const S of L){const B=await g.getTrophyPagesAll(S.id);for(const D in B)if(!(parseFloat(D)<0))for(const k in B[D]){const q=B[D][k],b=(await g.getChapterImages(S.id,D)).images[k],$=typeof b=="string"?b.split("/").pop():(b==null?void 0:b.filename)||(b==null?void 0:b.path);u.push({mangaId:S.id,chapterNum:D,imagePaths:[{filename:$}],displayMode:q.isSingle?"single":"double",displaySide:"left"})}}}else{const f=await g.getBookmark(d);m=f?f.alias||f.title:"Manga Trophies";const w=await g.getTrophyPagesAll(d);for(const x in w)if(!(parseFloat(x)<0))for(const v in w[x]){const L=w[x][v],B=(await g.getChapterImages(d,x)).images[v],D=typeof B=="string"?B.split("/").pop():(B==null?void 0:B.filename)||(B==null?void 0:B.path);u.push({mangaId:d,chapterNum:x,imagePaths:[{filename:decodeURIComponent(D)}],displayMode:L.isSingle?"single":"double",displaySide:"left"})}}o.images=u.map(f=>{const w=f.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${f.mangaId}/${f.chapterNum}/${encodeURIComponent(w)}`],displayMode:f.displayMode,displaySide:f.displaySide}}),o.manga={id:"trophies",title:m,alias:m},o.chapter={number:"🏆"},o.isCollectionMode=!0,o.isGalleryMode=!1}else if(e==="stream"){o.isStreamingMode=!0,o.isCollectionMode=!1,o.isGalleryMode=!1,o.singlePageMode=!0;const d=sessionStorage.getItem("streamPreviewUrl"),u=sessionStorage.getItem("streamPreviewScraper"),m=sessionStorage.getItem("streamPreviewTitle")||"Preview";o.manga={id:"stream",title:m,alias:m,_streamUrl:d},o.chapter={number:1},o.images=[],d?Nr(d,u):p("No stream URL found","error")}else{o.isGalleryMode=!1;const d=await g.getBookmark(e);o.manga=d,console.log("[Reader] manga loaded, finding chapter..."),o.chapter=((n=d.chapters)==null?void 0:n.find(m=>m.number===parseFloat(t)))||{number:parseFloat(t)};const u=parseFloat(t);if(o._preloadCache&&o._preloadCache.mangaId===e&&o._preloadCache.chapterNum===u)console.log("[Reader] Using preloaded images for chapter",t),o.images=o._preloadCache.images||[],o.versionUrl=s||o._preloadCache.versionUrl||null,o._preloadCache=null;else{o.versionUrl=s||null;const m=s?`/bookmarks/${e}/chapters/${t}/reader-images?version=${encodeURIComponent(s)}`:`/bookmarks/${e}/chapters/${t}/reader-images`,f=await g.get(m);console.log("[Reader] images loaded, count:",(r=f.images)==null?void 0:r.length),o.images=f.images||[]}try{const m=await g.getChapterSettings(e,t);if(Bt(m))cs(m);else try{const w=[...o.manga.downloadedChapters||[]].sort((B,D)=>B-D),x=parseFloat(t),v=w.indexOf(x),L=[];if(v!==-1){for(let B=v-1;B>=0;B--)L.push(w[B]);for(let B=v+1;B<w.length;B++)L.push(w[B])}const S=12;for(const B of L.slice(0,S)){const D=await g.getChapterSettings(e,B);if(Bt(D)){cs(D),console.log("[Reader] Inherited settings from chapter",B);break}}}catch(f){console.warn("Failed to inherit chapter settings",f)}}catch(m){console.warn("Failed to load chapter settings",m)}try{const m=await g.getTrophyPages(e,t);o.trophyPages=m||{}}catch(m){console.warn("Failed to load trophy pages",m)}try{const m=await g.getFavorites();o.allFavorites=m,o.favoriteLists=Object.keys(m.favorites||m||{})}catch(m){console.warn("Failed to load favorites",m)}}if(o.isStreamingMode)o.currentPage=0;else{const d=parseFloat(t),u=o.isVolumeMode?l:(c=(i=o.manga)==null?void 0:i.readingProgress)==null?void 0:c[d];if(u&&u.page<u.totalPages)if(o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.max(0,u.page-1);else{const m=Math.max(0,u.page-1),f=oe();let w=0;for(let x=0;x<f.length;x++){const v=f[x],L=Array.isArray(v)?v:v.pages||[];if(L.includes(m)||L[0]>=m){w=x;break}w=x}o.currentPage=w}else o.currentPage=0,o._resumeScrollToPage=u.page-1;else o.currentPage=0}}catch(l){console.error("Error loading chapter:",l),p("Failed to load chapter","error")}if(!o.isStreamingMode){if(o.navigationDirection==="prev"&&o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.max(0,o.images.length-1);else{const l=oe();o.currentPage=Math.max(0,l.length-1)}else if(o.navigationDirection==="next-linked"&&o.mode==="manga"&&o.images.length>1)if(o.singlePageMode)o.currentPage=1;else{const l=oe();let d=0;for(let u=0;u<l.length;u++){const m=l[u];if((Array.isArray(m)?m:m.pages||[]).includes(1)){d=u;break}}o.currentPage=d}}o.navigationDirection=null,o.lastPageSingle&&!o.isStreamingMode&&await Ma(),o.loading=!1,Ge(),o.isStreamingMode||qr(),o.mode==="webtoon"&&o._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const d=l.querySelectorAll("img");d[o._resumeScrollToPage]&&d[o._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete o._resumeScrollToPage},300)}async function Nr(e,t){o._streamAbortController&&o._streamAbortController.abort(),o._streamAbortController=new AbortController;const{signal:s}=o._streamAbortController;try{let a="/api/scrapers/preview-images-stream?";t&&(a+=`scraper=${encodeURIComponent(t)}&`),a+=`url=${encodeURIComponent(e)}`;const n=localStorage.getItem("manga_auth_token"),r={};n&&(r.Authorization=`Bearer ${n}`),console.log("[Reader] Starting stream from:",a);const i=await fetch(a,{headers:r,signal:s});if(!i.ok)throw new Error(`Failed to start stream: ${i.statusText}`);const c=i.body.getReader(),l=new TextDecoder;let d="";for(;;){const{value:u,done:m}=await c.read();if(m||s.aborted)break;d+=l.decode(u,{stream:!0});const f=d.split(`

`);d=f.pop();let w=!1;for(const x of f)if(x.startsWith("data: ")){const v=x.substring(6);try{const L=JSON.parse(v);if(L.type==="metadata")o.manga.title=L.title,o.manga.alias=L.title,Ge();else if(L.type==="image"){const S=`/api/scrapers/proxy-cover?url=${encodeURIComponent(L.url)}`;o.images.push(S),w=!0}else if(L.type==="error")p("Stream error: "+L.message,"error");else if(L.type==="done")break}catch(L){console.error("Parse error for SSE data:",L)}}w&&Me()}}catch(a){a.name!=="AbortError"&&(console.error("Preview stream error:",a),p("Stream failed: "+a.message,"error"))}finally{o._streamAbortController&&o._streamAbortController.signal===s&&(o._streamAbortController=null)}}async function Or(e=[]){console.log("[Reader] mount called with params:",e);let[t,s]=e,a=null;if(s&&s.includes("?")){const[r,i]=s.split("?");s=r,a=new URLSearchParams(i).get("version")}else{const r=window.location.hash.split("?")[1];r&&(a=new URLSearchParams(r).get("version"))}if(console.log("[Reader] mangaId:",t,"chapterNum:",s,"urlVersion:",a),!t||!s){F.go("/");return}const n=document.getElementById("app");if(o.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),o.images=[],o.singlePageMode=!1,o._resumeScrollToPage=null,o.nextChapterImage=null,o.nextChapterNum=null,n.innerHTML=Ne(),s==="volume"&&e[2])await Pe(t,`volume:${e[2]}`);else if(a)await Pe(t,s,decodeURIComponent(a));else try{const r=await g.getBookmark(t),i=r.downloadedVersions||{},c=new Set(r.deletedChapterUrls||[]),l=i[parseFloat(s)];let d=[];if(Array.isArray(l)&&(d=l.filter(u=>!c.has(u))),d.length>1){let u=[];try{u=(await g.getChapterVersions(t,s)).versions||[]}catch{}const m=await Ta(d,s,r,u);if(m===null){F.go(`/manga/${t}`);return}await Pe(t,s,m)}else d.length===1?await Pe(t,s,d[0]):await Pe(t,s)}catch(r){console.log("[Reader] Error in version check, falling back:",r),await Pe(t,s)}if(n.innerHTML=Ne(),console.log("[Reader] render called, loading:",o.loading,"manga:",!!o.manga,"images:",o.images.length),Lt(),o.mode==="webtoon"&&o._resumeScrollToPage!=null){const r=o._resumeScrollToPage;o._resumeScrollToPage=null,setTimeout(()=>{const i=document.getElementById("reader-content");if(i){const c=i.querySelectorAll("img");c[r]&&c[r].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function Ur(){console.log("[Reader] unmount called"),o._streamAbortController&&(o._streamAbortController.abort(),o._streamAbortController=null),Fe&&(clearTimeout(Fe),Fe=null);const e=Ba(),t=qa();document.body.classList.remove("reader-active"),document.removeEventListener("keydown",Pa),o.manga=null,o.chapter=null,o.versionUrl=null,o.images=[],o.loading=!0,o.singlePageMode=!1,o.isStreamingMode=!1,o._resumeScrollToPage=null,o._preloadCache=null,await He(e),await qe(t)}function Bt(e){return!!e&&(e.mode!==void 0||e.direction!==void 0||e.firstPageSingle!==void 0||e.lastPageSingle!==void 0)}function cs(e){e&&(e.mode&&(o.mode=e.mode),e.direction&&(o.direction=e.direction),e.firstPageSingle!==void 0&&(o.firstPageSingle=e.firstPageSingle),e.lastPageSingle!==void 0&&(o.lastPageSingle=e.lastPageSingle))}function qa(){return!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode?null:{mangaId:o.manga.id,chapterNumber:o.chapter.number,settings:{mode:o.mode,direction:o.direction,firstPageSingle:o.firstPageSingle,lastPageSingle:o.lastPageSingle}}}async function qe(e=qa()){if(!(!e||K.isDemo))try{await g.updateChapterSettings(e.mangaId,e.chapterNumber,e.settings)}catch(t){console.error("Failed to save settings:",t)}}async function Ra(e){try{const t=await g.getBookmark(e),s=t.downloadedChapters||[],a=new Set(t.readChapters||[]),n=t.readingProgress||{},r=t.downloadedVersions||{},i=[...s].sort((l,d)=>l-d);let c=null;for(const l of i){const d=n[l];if(d&&d.page<d.totalPages&&!a.has(l)){c=l;break}}if(c===null){for(const l of i)if(!a.has(l)){c=l;break}}if(c===null&&i.length>0&&(c=i[0]),c!==null){const l=r[c]||[],d=Array.isArray(l)?l[0]:l,u=d?`?version=${encodeURIComponent(d)}`:"";F.go(`/read/${e}/${c}${u}`)}else p("No downloaded chapters to read","info")}catch(t){p("Failed to continue reading: "+t.message,"error")}}const Vr={mount:Or,unmount:Ur,render:Ne,continueReading:Ra},Da="torrent-search-modal",Hr=3e3;let Ws=0,bt=null;function Se(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ds(e){if(!e)return"";const t=["B","KB","MB","GB","TB"];let s=0,a=e;for(;a>=1024&&s<t.length-1;)a/=1024,s++;return`${a<10&&s>0?a.toFixed(1):Math.round(a)} ${t[s]}`}function jr(e){if(!e)return"";const t=Math.floor((Date.now()-new Date(e).getTime())/864e5);return t<1?"today":t<30?`${t}d`:t<365?`${Math.floor(t/30)}mo`:`${Math.floor(t/365)}y`}function zr(e){return e?e.volume!==null&&e.volume!==void 0?e.volumeEnd?`Vol. ${e.volume}–${e.volumeEnd}`:`Vol. ${e.volume}`:e.chapter!==null&&e.chapter!==void 0?e.chapterEnd?`Ch. ${e.chapter}–${e.chapterEnd}`:`Ch. ${e.chapter}`:"":""}function Qr(e){switch(e.status){case"grabbing":return{kind:"pending",text:"Fetching the release for qBittorrent…"};case"downloading":{const t=Math.round((e.progress||0)*100);return{kind:"ok",text:`Downloading in qBittorrent${t?` · ${t}%`:""} · progress on the Queue page`,done:!0}}case"completed":return{kind:"ok",text:"Downloaded, waiting for import",done:!0};case"importing":return{kind:"ok",text:"Importing into the library…",done:!0};case"imported":return{kind:"ok",text:"Imported",done:!0};case"failed":return{kind:"error",text:`Failed: ${e.error||"unknown error"}`,done:!0,retry:!0};case"removed":return{kind:"error",text:"Removed from qBittorrent",done:!0,retry:!0};default:return{kind:"pending",text:e.status}}}function wt(){var e;(e=document.getElementById(Da))==null||e.remove(),document.removeEventListener("keydown",Fa),bt&&(bt(),bt=null)}function Fa(e){e.key==="Escape"&&wt()}async function Na({query:e="",bookmarkId:t=null,bookmarkTitle:s="",library:a=null,onGrabbed:n}={}){const r=++Ws;wt();let i;try{i=await g.getTorrentStatus()}catch{i={prowlarr:!1,qbittorrent:!1}}if(r!==Ws)return;if(!i.prowlarr||!i.qbittorrent){p("Set up Prowlarr and qBittorrent under Settings > Torrents first","info");return}const c=document.createElement("div");c.id=Da,c.className="modal open torrent-modal";const l=t?`<div class="torrent-target">Releases go to <strong>${Se(s)}</strong> and are imported as volumes when they finish.</div>`:`<div class="torrent-target">
             <label>Add to
               <select id="torrent-target-select">
                 <option value="">New series (named after the release)</option>
                 ${(a||[]).map($=>`<option value="${Se($.id)}">${Se($.alias||$.title)}</option>`).join("")}
               </select>
             </label>
           </div>`;c.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${h("download")} Find volume releases</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body">
                <form class="torrent-search-form" id="torrent-search-form">
                    <input type="text" id="torrent-query" value="${Se(e)}" placeholder="Title to search the indexers for" autocomplete="off">
                    <button type="submit" class="btn btn-primary">Search</button>
                </form>
                ${l}
                <div class="torrent-results" id="torrent-results"><div class="torrent-hint">Searches every indexer enabled in Prowlarr. Volume releases show their volume number when the name says it.</div></div>
            </div>
        </div>
    `,document.body.appendChild(c),document.addEventListener("keydown",Fa),c.querySelector(".modal-overlay").addEventListener("click",wt),c.querySelector('[data-act="close"]').addEventListener("click",wt);const d=c.querySelector("#torrent-results"),u=c.querySelector("#torrent-query");let m=[];const f=new Map;let w=null;const x=($,M,N)=>{const V=d.querySelector(`.torrent-row-status[data-index="${$}"]`);V&&(V.className=`torrent-row-status ${M}`,V.textContent=N)},v=($,M,N,V)=>{const H=d.querySelector(`.torrent-grab[data-index="${$}"]`);H&&(H.textContent=M,H.disabled=!N,H.classList.toggle("btn-primary",V),H.classList.toggle("btn-secondary",!V))},L=$=>{if(Array.isArray($)){for(const[M,N]of f){let V=$.find(J=>J.hash===N.hash);if(V||(V=$.filter(J=>J.releaseTitle===N.title).sort((J,X)=>String(X.addedAt||"").localeCompare(String(J.addedAt||"")))[0]),!V)continue;N.hash=V.hash;const H=Qr(V);x(M,H.kind,H.text),H.retry?v(M,"Grab again",!0,!0):H.done&&v(M,"Grabbed",!1,!1),H.done&&(N.done=!0)}[...f.values()].some(M=>!M.done)||k()}},S=$=>L($==null?void 0:$.torrents),B=async()=>{try{const $=await g.getTorrentDownloads();L($.torrents)}catch{}},D=()=>{w||(w=setInterval(B,Hr))},k=()=>{w&&(clearInterval(w),w=null)};Z.on(ne.TORRENT_UPDATE,S),bt=()=>{Z.off(ne.TORRENT_UPDATE,S),k()};const q=$=>{if(m=$,f.clear(),k(),$.length===0){d.innerHTML='<div class="torrent-hint">No releases found. Try a shorter title.</div>';return}d.innerHTML=`
            <table class="torrent-table">
                <thead><tr><th>Release</th><th>Vol.</th><th>Size</th><th>Seeds</th><th>Indexer</th><th>Age</th><th></th></tr></thead>
                <tbody>
                ${$.map((M,N)=>{var V;return`
                    <tr>
                        <td class="torrent-title" title="${Se(M.title)}">
                            <div>${Se(M.title)}${(V=M.parsed)!=null&&V.digital?' <span class="badge badge-downloaded">Digital</span>':""}${M.infoUrl?` <a href="${Se(M.infoUrl)}" target="_blank" rel="noopener" class="torrent-info-link" title="Open on the indexer">${h("globe")}</a>`:""}</div>
                            <div class="torrent-row-status" data-index="${N}"></div>
                        </td>
                        <td>${Se(zr(M.parsed))}</td>
                        <td>${ds(M.size)}</td>
                        <td class="${(M.seeders??0)===0?"torrent-dead":""}">${M.seeders??"?"}</td>
                        <td>${Se(M.indexer)}</td>
                        <td>${jr(M.publishDate)}</td>
                        <td>${M.hasDownload===!1?'<span class="text-muted" title="The indexer gave no download link">No link</span>':`<button class="btn btn-sm btn-primary torrent-grab" data-index="${N}">Grab</button>`}</td>
                    </tr>`}).join("")}
                </tbody>
            </table>`,d.querySelectorAll(".torrent-grab").forEach(M=>M.addEventListener("click",()=>b(parseInt(M.dataset.index,10),M)))},U=async()=>{const $=u.value.trim();if($){d.innerHTML=`<div class="torrent-hint">${h("loader",{spin:!0})} Searching the indexers…</div>`;try{const M=await g.searchTorrents($);q(M.results||[])}catch(M){d.innerHTML=`<div class="torrent-hint error">${Se(M.message)}</div>`}}},b=async($,M)=>{var J,X;const N=m[$];if(!N)return;const V=c.querySelector("#torrent-target-select"),H=t||V&&V.value||null;M.disabled=!0,M.textContent="Sending…",x($,"pending","Sending to qBittorrent…");try{const E=await g.grabTorrent(N.id,{bookmarkId:H,newSeriesTitle:H?null:((J=N.parsed)==null?void 0:J.title)||null});f.set($,{hash:(X=E.torrent)==null?void 0:X.hash,title:N.title,done:!1}),v($,"Grabbed",!1,!1),E.torrent&&L([E.torrent]),D(),typeof n=="function"&&n(E.torrent)}catch(E){v($,"Grab again",!0,!0),x($,"error",`Failed: ${E.message}`)}};c.querySelector("#torrent-search-form").addEventListener("submit",$=>{$.preventDefault(),U()}),e?U():u.focus()}const it=50;let y={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1,mergeMode:!1,mergeSelection:new Set,mergeTargetTouched:!1,mergeTitleTouched:!1,offlineChapters:new Set,isAutoOffline:!1,volumesCollapsed:!1};const Oa=e=>`volumes_collapsed_${e}`;function Wr(e){var s;const t=localStorage.getItem(Oa(e==null?void 0:e.id));return t!==null?t==="1":(((s=e==null?void 0:e.volumes)==null?void 0:s.length)||0)>8}function Gr(e){if(!(e.autoCheck===!0))return`<button class="btn btn-secondary" id="schedule-btn">${h("alarm-clock")} Schedule</button>`;const s=e.checkSchedule==="weekly"?`${(e.checkDay||"monday").charAt(0).toUpperCase()+(e.checkDay||"monday").slice(1)} ${e.checkTime||"06:00"}`:e.checkSchedule==="daily"?`Daily ${e.checkTime||"06:00"}`:"Every 6h";return`<button class="btn btn-primary" id="schedule-btn">${h("alarm-clock")} ${s}</button>`}function Kr(e){const t=e.autoCheck===!0,s=e.checkSchedule||"daily",a=e.checkDay||"monday",n=e.checkTime||"06:00",r=e.autoDownload||!1;return`
    <div class="modal" id="schedule-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${h("alarm-clock")} Auto-Check Schedule</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="schedule-type">Frequency</label>
            <select id="schedule-type">
              <option value="daily" ${s==="daily"?"selected":""}>Daily</option>
              <option value="weekly" ${s==="weekly"?"selected":""}>Weekly</option>
            </select>
          </div>
          <div class="form-group" id="schedule-day-group" style="${s==="weekly"?"":"display:none"}">
            <label for="schedule-day">Day of Week</label>
            <select id="schedule-day">
              <option value="monday" ${a==="monday"?"selected":""}>Monday</option>
              <option value="tuesday" ${a==="tuesday"?"selected":""}>Tuesday</option>
              <option value="wednesday" ${a==="wednesday"?"selected":""}>Wednesday</option>
              <option value="thursday" ${a==="thursday"?"selected":""}>Thursday</option>
              <option value="friday" ${a==="friday"?"selected":""}>Friday</option>
              <option value="saturday" ${a==="saturday"?"selected":""}>Saturday</option>
              <option value="sunday" ${a==="sunday"?"selected":""}>Sunday</option>
            </select>
          </div>
          <div class="form-group">
            <label for="schedule-time">Time</label>
            <input type="time" id="schedule-time" value="${n}">
          </div>
          <div class="form-group">
            <label class="toggle-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="auto-download-toggle" ${r?"checked":""} style="width: 18px; height: 18px;">
              <span>Auto-download new chapters</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          ${t?'<button class="btn btn-danger" id="disable-schedule-btn" style="margin-right:auto;">Disable</button>':""}
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="save-schedule-btn">${t?"Save":"Enable & Save"}</button>
        </div>
      </div>
    </div>
  `}function us(){var U;if(y.loading)return`
      ${pe()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const e=y.manga;if(!e)return`
      ${pe()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const t=e.alias||e.title,s=e.chapters||[],a=new Set(e.downloadedChapters||[]),n=new Set(e.readChapters||[]),r=new Set(s.map(b=>b.number)).size,i=new Set(e.excludedChapters||[]),c=new Set(e.deletedChapterUrls||[]),l=e.volumes||[],d=new Set;l.forEach(b=>{(b.chapters||[]).forEach($=>d.add($))});let u;y.filter==="hidden"?u=s.filter(b=>i.has(b.number)||c.has(b.url)):u=s.filter(b=>!i.has(b.number)&&!c.has(b.url));const m=u.filter(b=>!d.has(b.number));let f=[];if(y.activeVolume){const b=new Set(y.activeVolume.chapters||[]);f=u.filter($=>b.has($.number))}else f=m;const w=new Map;f.forEach(b=>{w.has(b.number)||w.set(b.number,[]),w.get(b.number).push(b)});let x=Array.from(w.entries()).sort((b,$)=>b[0]-$[0]);y.filter==="downloaded"?x=x.filter(([b])=>a.has(b)):y.filter==="not-downloaded"?x=x.filter(([b])=>!a.has(b)):y.filter==="main"?x=x.filter(([b])=>Number.isInteger(b)):y.filter==="extra"&&(x=x.filter(([b])=>!Number.isInteger(b)));const v=Math.max(1,Math.ceil(x.length/it));y.currentPage>=v&&(y.currentPage=Math.max(0,v-1));const L=y.currentPage*it,B=[...x.slice(L,L+it)].reverse(),D=w.size,k=[...w.keys()].filter(b=>a.has(b)).length;n.size;let q="";if(y.activeVolume){const b=y.activeVolume;let $=null;b.local_cover?$=`/api/public/covers/${e.id}/${encodeURIComponent(b.local_cover.split(/[/\\]/).pop())}`:b.cover&&($=b.cover),q=`
      ${pe()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${$?`<img src="${$}" alt="${b.name}">`:fe("book")}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${e.id}" class="text-muted" style="text-decoration:none;">← ${t}</a>
              </div>
              <h1>${Oe(b.name)}</h1>
              <div class="manga-detail-meta">
                ${b.kind==="release"?`<span class="meta-item">${b.source==="torrent"?"Torrent":"Archive"} release · ${b.pageCount} pages</span>${b.releaseName?`<span class="meta-item text-muted" title="${Ke(b.releaseName)}">${Oe(b.releaseName)}</span>`:""}`:""}
                <span class="meta-item">${D} Chapters</span>
                ${k>0?`<span class="meta-item downloaded">${k} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 ${b.kind==="release"?`<button class="btn btn-primary" id="read-volume-btn" data-vol-id="${b.id}">${h("play")} Read volume</button>`:""}
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${e.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${y.manageChapters?"Done Managing":`${h("plus")} Add Chapters`}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${b.id}">${h("pencil")} Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const b=e.localCover?`/api/public/covers/${e.id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover;q=`
        ${pe()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${b?`<img src="${b}" alt="${t}">`:fe("book")}
              </div>
              <div class="manga-detail-info">
                <h1>${t}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${e.website||"Local"}</span>
                  <span class="meta-item" title="${r} distinct chapters across ${((U=e.chapters)==null?void 0:U.length)||0} version rows">${r} Chapters</span>
                  ${a.size>0?`<span class="meta-item downloaded">${a.size} Downloaded</span>`:""}
                  ${n.size>0?`<span class="meta-item">${n.size} Read</span>`:""}
                </div>
                ${(e.artists||[]).length>0||(e.categories||[]).length>0?`
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(e.artists||[]).length>0?`
                    <span class="meta-label">Author:</span>
                    ${e.artists.map($=>`<a href="#//" class="artist-link" data-artist="${$}">${$}</a>`).join(", ")}
                  `:""}
                  ${(e.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(e.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${e.categories.map($=>`<span class="tag">${$}</span>`).join("")}
                  `:""}
                </div>
                `:""}
                <div class="manga-detail-actions">
                  <button class="btn btn-primary" id="continue-btn">
                    ${h("play")} ${e.lastReadChapter?"Continue":"Start"} Reading
                  </button>
              <button class="btn btn-secondary" id="download-all-btn">
                ${h("download")} Download All
              </button>
              <button class="btn btn-secondary" id="refresh-btn">${h("refresh-cw")} Refresh</button>
              ${e.website!=="Local"?`<button class="btn btn-secondary" id="quick-check-btn">${h("zap")} Quick Check</button>`:""}
              ${e.website==="Local"?`<button class="btn btn-secondary" id="scan-folder-btn">${h("folder")} Scan Folder</button>`:""}
              <button class="btn btn-secondary " id="auto-offline-btn" title="Auto-save new chapters offline for reading without internet">
                ${h("wifi-off")} Auto-Offline
              </button>
              <button class="btn btn-secondary" id="edit-btn">${h("pencil")} Edit</button>
              ${K.canDownload?`<button class="btn btn-secondary" id="find-volumes-btn" title="Search the torrent indexers for volume releases of this title">${h("package")} Find volumes</button>`:""}
              <button class="btn btn-secondary" id="anilist-track-btn" style="display:none;">${h("link")} Track</button>
              ${(e.volumes||[]).length===0?'<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>':""}
              ${Gr(e)}
            </div>
            ${e.description?`<p class="manga-description">${e.description}</p>`:""}
            ${y.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">${h("package")} CBZ Files (${y.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${y.cbzFiles.map($=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${$.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${$.chapterNumber?`Chapter ${$.chapterNumber}`:"Unknown chapter"}
                        ${$.isExtracted?` | ${h("check")} Extracted`:""}
                      </div>
                    </div>
                    <button class="btn btn-small ${$.isExtracted?"btn-secondary":"btn-primary"}" 
                            data-cbz-path="${encodeURIComponent($.path)}" 
                            data-cbz-chapter="${$.chapterNumber||1}"
                            data-cbz-extracted="${$.isExtracted}">
                      ${$.isExtracted?"Re-Extract":"Extract"}
                    </button>
                  </div>
                `).join("")}
              </div>
            </div>
            `:""}
          </div>
        </div>
      `}return`
    ${q}
        
        ${y.activeVolume?y.manageChapters?no(e,m):"":ro(e,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${y.filter==="all"?"active":""}" data-filter="all">
                All (${w.size})
              </button>
              <button class="filter-btn ${y.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${k})
              </button>
              <button class="filter-btn ${y.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${y.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
              ${!y.activeVolume&&K.canEdit?`
              <button class="filter-btn merge-mode-btn ${y.mergeMode?"active":""}" id="merge-mode-btn" title="Combine downloaded chapters into one, e.g. 12.1 + 12.2 + 12.3 into chapter 12">
                ${h("link")} Combine
              </button>`:""}
            </div>
          </div>

          ${y.mergeMode?to(e):""}

          ${v>1?Gs(v):""}
          
          <div class="chapter-list">
            ${B.map(([b,$])=>so(b,$,a,n,e)).join("")}
          </div>
          
          ${v>1?Gs(v):""}
        </div>
      ${eo()}
    </div>
  `}function Yr(){const e=y.manga;if(!e)return"";const t=e.alias||e.title;return`
    <div class="modal" id="delete-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 420px;">
        <div class="modal-header">
          <h2>${h("trash-2")} Delete Manga</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>${t}</strong> from your library?</p>
          <p class="text-muted" style="font-size: 0.85em;">This cannot be undone.</p>
          <div class="form-group" style="margin-top: 12px;">
            <label class="toggle-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="delete-files-toggle" style="width: 18px; height: 18px;">
              <span>Also delete downloaded files from disk</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-danger" id="confirm-delete-manga-btn">Delete</button>
        </div>
      </div>
    </div>
  `}function Jr(){const e=y.manga;return e?`
    <div class="modal" id="migrate-source-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
          <h2>${h("refresh-cw")} Change Source</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Current source: <strong>${e.website||"Local"}</strong></p>
          <p class="text-muted" style="font-size: 0.85em; margin-bottom: 12px;">Search for the manga on a different source, or paste a URL directly.</p>
          
          <!-- Search Section -->
          <div class="form-group">
            <label>Search for Manga</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="migrate-search-input" placeholder="Search manga title..." value="${e.alias||e.title}" style="flex: 1;">
              <select id="migrate-search-scraper" style="width: 150px;">
                <option value="comix.to">comix.to</option>
              </select>
              <button class="btn btn-secondary" id="migrate-search-btn">${h("search")} Search</button>
            </div>
          </div>
          
          <!-- Search Results -->
          <div id="migrate-search-results" style="max-height: 300px; overflow-y: auto; margin-bottom: 12px; display: none;">
            <div id="migrate-results-grid" class="library-grid" style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px;"></div>
          </div>
          <div id="migrate-search-loading" style="display: none; text-align: center; padding: 20px;">
            <div class="loading-spinner"></div>
            <p class="text-muted" style="margin-top: 8px;">Searching...</p>
          </div>
          
          <hr style="border-color: var(--border-color); margin: 12px 0;">
          
          <!-- URL Input Section -->
          <div class="form-group">
            <label for="migrate-url-input">Manga URL</label>
            <input type="url" id="migrate-url-input" placeholder="https://..." style="width: 100%;">
          </div>
          <p class="text-muted" style="font-size: 0.8em;">Current URL: <a href="${e.url}" target="_blank" rel="noopener noreferrer" style="word-break:break-all; color: var(--accent-primary); text-decoration: underline;">${e.url}</a></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-migrate-btn">Migrate Source</button>
        </div>
      </div>
    </div>
  `:""}function Xr(){const e=y.manga;return e?`
    <div class="modal" id="anilist-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h2>${h("link")} AniList Tracking</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <!-- Tracked View (populated by renderAnilistModalView) -->
          <div id="anilist-tracked-view" style="display: none;"></div>

          <!-- Search View -->
          <div id="anilist-search-view">
            <p class="text-muted" style="font-size: 0.85em; margin-bottom: 12px;">Search AniList for this manga to sync reading progress.</p>

            <!-- Search Section -->
            <div class="form-group">
              <label>Search AniList</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="anilist-search-input" placeholder="Search AniList..." value="${e.alias||e.title}" style="flex: 1;">
                <button class="btn btn-secondary" id="anilist-search-btn">${h("search")} Search</button>
              </div>
            </div>

            <!-- Search Results -->
            <div id="anilist-search-results" style="max-height: 350px; overflow-y: auto; display: none;">
              <div id="anilist-results-list"></div>
            </div>
            <div id="anilist-search-loading" style="display: none; text-align: center; padding: 20px;">
              <div class="loading-spinner"></div>
              <p class="text-muted" style="margin-top: 8px;">Searching...</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Close</button>
        </div>
      </div>
    </div>
  `:""}async function At(){var s,a;const e=document.getElementById("anilist-track-btn"),t=y.manga;if(t)try{const n=await g.anilistStatus();if(!(n!=null&&n.configured)||!(n!=null&&n.connected)||((s=y.manga)==null?void 0:s.id)!==t.id){e&&(e.style.display="none");return}const{mapping:r}=await g.anilistGetMapping(t.id);if(((a=y.manga)==null?void 0:a.id)!==t.id)return;e&&(e.style.display="",e.style.borderColor=r?"var(--accent-primary)":"",e.innerHTML=r?`${h("check")} Tracked`:`${h("link")} Track`,e.title=r?`Linked to ${r.anilist_title}`:"Link this manga to AniList"),Zr(r,t)}catch(n){console.warn("Failed to load AniList state:",n),e&&(e.style.display="none")}}function Zr(e,t){var n,r,i;const s=document.getElementById("anilist-tracked-view"),a=document.getElementById("anilist-search-view");if(!(!s||!a)){if(!e){s.style.display="none",s.innerHTML="",a.style.display="";return}a.style.display="none",s.style.display="",s.innerHTML=`
    <div style="margin-bottom: 12px;">
      <strong>${e.anilist_title}</strong>
      <div class="text-muted" style="font-size: 0.85em;">
        ${[e.media_format,e.chapters_total!=null?`${e.chapters_total} chapters`:null].filter(Boolean).join(" • ")}
      </div>
      ${e.last_pushed_progress!=null?`<div class="text-muted" style="font-size: 0.8em;">Last synced: ch. ${e.last_pushed_progress}</div>`:""}
    </div>
    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 12px;">
      <input type="checkbox" id="anilist-sync-toggle" ${e.sync_enabled==1?"checked":""}> Sync progress
    </label>
    <div style="display: flex; gap: 8px;">
      <button class="btn btn-small btn-secondary" id="anilist-relink-btn">Change</button>
      <button class="btn btn-small btn-danger" id="anilist-unlink-btn">Unlink</button>
    </div>
  `,(n=document.getElementById("anilist-sync-toggle"))==null||n.addEventListener("change",async c=>{try{await g.anilistSetSyncEnabled(t.id,c.target.checked),p(c.target.checked?"AniList sync enabled":"AniList sync disabled","success")}catch(l){c.target.checked=!c.target.checked,p("Failed to update sync: "+l.message,"error")}}),(r=document.getElementById("anilist-relink-btn"))==null||r.addEventListener("click",()=>{s.style.display="none",a.style.display=""}),(i=document.getElementById("anilist-unlink-btn"))==null||i.addEventListener("click",async()=>{if(confirm(`Unlink "${e.anilist_title}" from AniList?`))try{await g.anilistUnmap(t.id),p("Unlinked from AniList","success"),At()}catch(c){p("Failed to unlink: "+c.message,"error")}})}}function eo(){var t,s;const e=y.manga;return`
    ${e?Kr(e):""}
    ${Ao()}
    ${Yr()}
    ${Jr()}
    ${Xr()}

    <!-- Edit Manga Modal -->
    <div class="modal" id="edit-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${h("pencil")} Edit Manga</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <datalist id="artist-list"></datalist>
          <datalist id="category-list"></datalist>
          <div class="form-group">
            <label for="edit-alias-input">Display Name (Alias)</label>
            <input type="text" id="edit-alias-input" placeholder="Custom display name..." value="${(e==null?void 0:e.alias)||""}">
          </div>
          <div class="form-group">
            <label for="edit-artist-input">Author/Artist</label>
            <input type="text" id="edit-artist-input" list="artist-list" placeholder="Author or artist name..." value="${((t=e==null?void 0:e.artists)==null?void 0:t.join(", "))||""}">
          </div>
          <div class="form-group">
            <label for="edit-categories-input">Tags/Categories (comma separated)</label>
            <input type="text" id="edit-categories-input" list="category-list" placeholder="tag1, tag2, tag3..." value="${((s=e==null?void 0:e.categories)==null?void 0:s.join(", "))||""}">
          </div>
          <div class="form-group">
            <label>Cover Image</label>
            <div id="cover-preview" style="width: 100px; height: 150px; background: var(--bg-secondary); border-radius: 4px; margin-bottom: 8px; overflow: hidden;">
              ${e!=null&&e.localCover?`<img src="/api/public/covers/${e.id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}" style="width: 100%; height: 100%; object-fit: cover;">`:""}
            </div>
            <button type="button" class="btn btn-small btn-secondary" id="change-cover-btn">Change Cover</button>
          </div>
          <p class="text-muted" style="font-size: 0.8em;">Original title: ${(e==null?void 0:e.title)||""}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger" id="delete-manga-btn" style="margin-right:auto;">${h("trash-2")} Delete</button>
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="save-manga-btn">Save</button>
        </div>
      </div>
    </div>

    <!-- Download All Modal -->
    <div class="modal" id="download-all-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Download Options</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom: 15px;">How would you like to download missing chapters?</p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px;">
              <input type="radio" name="download-version-mode" value="single" checked style="width: 16px; height: 16px;">
              <div>
                <strong style="display: block;">1 Version Per Chapter</strong>
                <span class="text-muted" style="font-size: 0.85em;">Only downloads the primary version for each chapter.</span>
              </div>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px;">
              <input type="radio" name="download-version-mode" value="all" style="width: 16px; height: 16px;">
              <div>
                <strong style="display: block;">All Versions</strong>
                <span class="text-muted" style="font-size: 0.85em;">Downloads every available translation/version for missing chapters.</span>
              </div>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-download-all-btn">Download</button>
        </div>
      </div>
    </div>

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
  `}function Ua(e,t){if(t.length===0)return"";const s=Math.min(...t),a=Math.floor(s);return!(e.chapters||[]).some(r=>r.number===a)||t.includes(a)?a:s}function to(e){const t=[...y.mergeSelection].sort((a,n)=>a-n),s=Ua(e,t);return`
    <div class="merge-bar" id="merge-bar">
      <div class="merge-bar-text">
        <strong>Combine chapters</strong>
        <span id="merge-picked">${t.length?`Picked in page order: ${t.map(a=>`Ch. ${a}`).join(", ")}`:"Tick the downloaded chapters to combine (pages follow chapter order)."}</span>
      </div>
      <div class="merge-bar-fields">
        <label>Into chapter <input type="number" step="any" min="0" id="merge-target" value="${s}"></label>
        <label>Title <input type="text" id="merge-title" value="${s!==""?`Chapter ${s}`:""}" placeholder="Chapter ${s||"N"}"></label>
        <label class="merge-check"><input type="checkbox" id="merge-delete-sources"> Remove the original folders</label>
        <button class="btn btn-primary btn-sm" id="merge-submit" ${t.length?"":"disabled"}>Combine</button>
        <button class="btn btn-secondary btn-sm" id="merge-cancel">Cancel</button>
      </div>
    </div>
  `}function so(e,t,s,a,n){var X,E,C,A,T,R;const r=s.has(e),i=a.has(e),c=!Number.isInteger(e),l=((X=n.mergedChapters)==null?void 0:X[e])||null,d=((E=n.downloadedVersions)==null?void 0:E[e])||[],u=new Set(n.deletedChapterUrls||[]),m=t.filter(_=>y.filter==="hidden"?!0:!u.has(_.url)),f=!!y.activeVolume,w=n.chapterSettings||{},x=f?!0:!!((C=w[e])!=null&&C.locked);let v=m;if(f||x){const _=m.filter(O=>Array.isArray(d)?d.includes(O.url):d===O.url);v=_.length>0?_:m}v.sort((_,O)=>{const ee=Array.isArray(d)?d.includes(_.url):d===_.url;return((Array.isArray(d)?d.includes(O.url):d===O.url)?1:0)-(ee?1:0)});const L=((A=n.chapterFolders)==null?void 0:A[e])||[],S=L.filter(_=>!_.url),B=L.reduce((_,O)=>Math.max(_,O.imageCount),0),D=_=>_.imageCount<3||B>=6&&_.imageCount<B/2,k=_=>L.find(O=>O.url===_)||null,q=L.filter(_=>_.url&&D(_)),U=v.length>1||S.length>0,b=(T=v[0])!=null&&T.url?encodeURIComponent(v[0].url):null,$=["chapter-item",r?"downloaded":"",i?"read":"",c?"extra":""].filter(Boolean).join(" "),M=Array.isArray(d)?d:d?[d]:[],N=M.length,V=U?`
    <div class="versions-dropdown hidden" id="versions-${e}">
      ${v.map(_=>{const O=encodeURIComponent(_.url),ee=M.includes(_.url),Q=_.url.startsWith("local://"),ae=_.title&&_.title!==`Chapter ${e}`?_.title:"",G=ae||_.releaseGroup||"Version",te=[ae&&_.releaseGroup?_.releaseGroup:"",ao(_.uploadedAt)].filter(Boolean).join(" · ");return`
          <div class="version-row ${ee?"downloaded":""}"
               data-version-url="${O}" data-num="${e}">
            <span class="version-title" style="cursor: pointer; flex: 1;" title="${Ke(_.url)}">${Oe(G)}${Q?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}${te?`<span class="version-meta">${Oe(te)}</span>`:""}${(()=>{const le=ee?k(_.url):null;if(!le)return"";const Be=D(le);return`<span class="version-meta version-pages ${Be?"warn":""}" title="${Ke(le.folder)}">${le.imageCount} pages${Be?" - incomplete?":""}</span>`})()}</span>
            <div class="version-actions">
              ${ee?`<button class="btn-icon small success" data-action="read-version" data-num="${e}" data-url="${O}">${h("play",{title:"Read"})}</button>
                   ${N>1?`<button class="btn-icon small" data-action="keep-version" data-num="${e}" data-url="${O}" title="Keep only this version (delete the other ${N-1})">${h("check",{title:"Keep only this version"})}</button>`:""}
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${e}" data-url="${O}">${h("trash-2",{title:"Delete version"})}</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${e}" data-url="${O}">${h("download",{title:"Download"})}</button>`}
              ${u.has(_.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${e}" data-url="${O}" title="Restore Version">${h("undo-2",{title:"Restore version"})}</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${e}" data-url="${O}" title="Hide Version">${h("eye-off",{title:"Hide version"})}</button>`}
            </div>
          </div>
        `}).join("")}
      ${S.map(_=>`
          <div class="version-row orphan" data-num="${e}">
            <span class="version-title" title="${Ke(_.folder)}">Leftover folder on disk<span class="version-meta">${Oe(_.folder)} · ${_.imageCount} pages</span></span>
            <div class="version-actions">
              <button class="btn-icon small danger" data-action="delete-folder" data-num="${e}" data-folder="${encodeURIComponent(_.folder)}">${h("trash-2",{title:"Delete this folder from disk"})}</button>
            </div>
          </div>`).join("")}
    </div>
  `:"",H=(n.excludedChapters||[]).includes(e),J=y.mergeMode&&r&&!H&&!l;return`
    <div class="chapter-group" data-chapter="${e}">
      <div class="${$}" data-num="${e}" style="${H?"opacity: 0.7":""}">
        ${y.mergeMode?`<input type="checkbox" class="merge-pick" data-num="${e}" ${y.mergeSelection.has(e)?"checked":""} ${J?"":"disabled"} title="${J?"Combine this chapter":l?"Already a combined chapter":"Only downloaded chapters can be combined"}">`:""}
        <span class="chapter-number">Ch. ${e}</span>
        <span class="chapter-title">
          ${v[0]?v[0].title!==`Chapter ${e}`?v[0].title:"":t[0].title}
          ${H?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
          ${q.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="A downloaded version of this chapter has only ${q[0].imageCount} pages">${q[0].imageCount} pages</span>`:""}
          ${S.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="${S.length} folder(s) on disk not linked to any downloaded version - open the versions list to delete">${S.length} leftover folder${S.length>1?"s":""}</span>`:""}
        </span>
        ${l?`<span class="chapter-tag merged" title="Combined from ${l.sources.map(_=>`Ch. ${_}`).join(", ")}">Combined</span>`:c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${l&&!H?`<button class="btn-icon small" data-action="split-chapter" data-num="${e}" title="Split back into ${l.sources.map(_=>`Ch. ${_}`).join(", ")}">${h("scissors",{title:"Split"})}</button>`:""}
          ${H?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${e}" title="Restore Chapter">${h("undo-2",{title:"Restore chapter"})}</button>`:f?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${y.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${e}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${x?"locked":""}"
                        data-action="lock" data-num="${e}"
                        title="${x?"Unlock":"Lock"}">
                  ${x?h("lock",{title:"Locked"}):h("lock-open",{title:"Unlocked"})}
                </button>`}
          ${!H&&b?u.has((R=v[0])==null?void 0:R.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${e}" data-url="${b}" title="Unhide Chapter">${h("undo-2",{title:"Unhide chapter"})}</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${e}" data-url="${b}" title="Hide Chapter">${h("eye-off",{title:"Hide chapter"})}</button>`:""}
          <button class="btn-icon small ${i?"success":"muted"}"
                  data-action="read" data-num="${e}"
                  title="${i?"Mark unread":"Mark read"}">
            ${i?h("eye",{title:"Read"}):h("circle",{title:"Unread"})}
          </button>
          ${r?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${e}" data-url="${b}" title="Delete Files">${h("trash-2",{title:"Delete files"})}</button>
         <button class="btn-icon small ${y.offlineChapters.has(e)?"success":""}" data-action="offline-save" data-num="${e}" title="${y.offlineChapters.has(e)?"Remove offline copy":"Save for offline reading"}">
           ${y.offlineChapters.has(e)?h("wifi-off",{title:"Available offline"}):h("hard-drive",{title:"Save offline"})}
         </button>`:`<button class="btn-icon small ${r?"success":""}"
              data-action="download" data-num="${e}"
              title="${r?"Downloaded":"Download"}">
          ${r?h("check",{title:"Downloaded"}):h("download",{title:"Download"})}
        </button>`}
          ${U?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${e}" title="${m.length} versions, ${N} downloaded">
              ${N>1?`${N}/`:""}${m.length} ${h("chevron-down")}
            </button>
          `:""}
        </div>
      </div>
      ${V}
    </div>
  `}function ao(e){if(!e)return"";const t=new Date(e);return isNaN(t.getTime())?String(e).slice(0,10):t.toISOString().slice(0,10)}function Oe(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ke(e){return Oe(e).replace(/"/g,"&quot;")}function Gs(e){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${y.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${y.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${y.currentPage+1} of ${e}</span>
      <button class="btn btn-icon" data-page="next" ${y.currentPage>=e-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${y.currentPage>=e-1?"disabled":""}>»</button>
    </div>
  `}function no(e,t){return t.length===0?`
      <div class="available-chapters-section">
        <div class="section-header">
          <h2>Available Chapters</h2>
        </div>
        <div class="empty-state-lite">All chapters are already assigned to volumes.</div>
      </div>
    `:`
    <div class="available-chapters-section">
      <div class="section-header">
        <h2>Available Chapters</h2>
        <p class="text-muted" style="font-size: 0.9em; margin-bottom: 12px;">These chapters are not assigned to any volume yet.</p>
      </div>
      <div class="available-chapters-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
        ${[...new Set(t.map(a=>a.number))].sort((a,n)=>a-n).map(a=>`
          <div class="available-chapter-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-sm);">
            <span style="font-weight: 500;">Ch. ${a}</span>
            <button class="btn btn-small btn-primary add-to-vol-btn" data-num="${a}">Add</button>
          </div>
        `).join("")}
      </div>
    </div>
  `}function ro(e,t){var i;const s=e.volumes||[];if(s.length===0)return"";const a=s.map(c=>{const l=c.chapters||[],d=l.filter(m=>t.has(m)).length,u=c.kind==="release";return`
      <div class="volume-card${u?" volume-release":""}" data-volume-id="${c.id}" title="${u?Ke(`Volume release · ${c.pageCount} pages${c.releaseName?` · ${c.releaseName}`:""}`):`${l.length} chapters`}">
        <div class="volume-cover">
          ${c.cover?`<img src="${c.cover}" alt="${Ke(c.name)}">`:fe("book")}
          <div class="volume-badges">
            ${u?`<span class="badge badge-release">${c.pageCount} pages</span>${l.length?`<span class="badge badge-chapters">${l.length} ch</span>`:""}`:`<span class="badge badge-chapters">${l.length} ch</span>${d>0?`<span class="badge badge-downloaded">${d}</span>`:""}`}
          </div>
          ${u?`<button class="volume-read-btn" data-read-volume="${c.id}" title="Read this volume">${h("play",{title:"Read"})}</button>`:""}
        </div>
        <div class="volume-info">
          <div class="volume-name">${Oe(c.name)}</div>
          <div class="volume-kind">${u?`${c.source==="torrent"?"Torrent":"Archive"} release`:"Chapter collection"}</div>
        </div>
      </div>
    `}).join(""),n=y.volumesCollapsed,r=s.reduce((c,l)=>c+(l.chapters||[]).filter(d=>t.has(d)).length,0);return`
    <div class="volumes-section${n?" collapsed":""}">
      <div class="volumes-header">
        <button class="volumes-toggle" id="volumes-toggle-btn"
                aria-expanded="${!n}" aria-controls="volumes-grid"
                title="${n?"Expand volumes":"Collapse volumes"}">
          ${h(n?"chevron-down":"chevron-up")}
          <h2>Volumes</h2>
          <span class="volumes-count">${s.length}</span>
          ${n&&r>0?`<span class="badge badge-downloaded">${r} downloaded</span>`:""}
        </button>
        <button class="btn btn-secondary btn-small" id="add-volume-btn">${h("plus")} Add Volume</button>
      </div>
      <div class="volumes-grid" id="volumes-grid">
        ${a||(((i=e.chapters)==null?void 0:i.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function oo(){var n,r,i,c,l,d,u,m,f,w,x,v,L,S,B,D,k,q,U,b,$,M,N,V,H,J,X;const e=document.getElementById("app"),t=y.manga;if(!t)return;(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>F.go("/")),(r=document.getElementById("back-library-btn"))==null||r.addEventListener("click",()=>F.go("/")),e.querySelectorAll(".artist-link").forEach(E=>{E.addEventListener("click",async C=>{C.preventDefault();const A=E.dataset.artist;if(!A)return;localStorage.setItem("library_search",A),localStorage.removeItem("library_artist_filter");let T=null;try{const R=t.website;if(R&&R!=="Local"){const O=(window._scrapersList||(window._scrapersList=(await g.get("/scrapers/list")).scrapers)||[]).find(ee=>ee.name===R);O&&O.supportsBrowse&&(T=R)}}catch{}T?(localStorage.setItem("library_search_author",A),localStorage.setItem("library_search_author_source",T)):(localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source")),F.go("/")})}),(i=document.getElementById("continue-btn"))==null||i.addEventListener("click",()=>{Ra(t.id)}),(c=document.getElementById("download-all-btn"))==null||c.addEventListener("click",()=>{const E=document.getElementById("download-all-modal");E&&E.classList.add("open")}),(l=document.getElementById("confirm-download-all-btn"))==null||l.addEventListener("click",async()=>{var E;try{p("Queueing downloads...","info");const C=document.getElementsByName("download-version-mode");let A="single";for(const R of C)R.checked&&(A=R.value);(E=document.getElementById("download-all-modal"))==null||E.classList.remove("open");const T=await g.post(`/bookmarks/${t.id}/download`,{all:!0,versionMode:A});T.chaptersCount>0?p(`Download queued: ${T.chaptersCount} versions`,"success"):p("Already have these chapters downloaded","info")}catch(C){p("Failed to download: "+C.message,"error")}}),(d=document.getElementById("check-updates-btn"))==null||d.addEventListener("click",async()=>{try{p("Checking for updates...","info"),await g.post(`/bookmarks/${t.id}/quick-check`),p("Check complete!","success")}catch(E){p("Check failed: "+E.message,"error")}}),(u=document.getElementById("schedule-btn"))==null||u.addEventListener("click",()=>{const E=document.getElementById("schedule-modal");E&&E.classList.add("open")}),(m=document.getElementById("schedule-type"))==null||m.addEventListener("change",E=>{const C=document.getElementById("schedule-day-group");C&&(C.style.display=E.target.value==="weekly"?"":"none")}),(f=document.getElementById("save-schedule-btn"))==null||f.addEventListener("click",async()=>{var E;try{const C=document.getElementById("schedule-type").value,A=document.getElementById("schedule-day").value,T=document.getElementById("schedule-time").value,R=document.getElementById("auto-download-toggle").checked;await g.updateAutoCheckSchedule(t.id,{enabled:!0,schedule:C,day:A,time:T,autoDownload:R}),y.manga.checkSchedule=C,y.manga.checkDay=A,y.manga.checkTime=T,y.manga.autoDownload=R,(E=document.getElementById("schedule-modal"))==null||E.classList.remove("open"),z([t.id]),p("Schedule updated","success")}catch(C){p("Failed to save schedule: "+C.message,"error")}}),(w=document.getElementById("disable-schedule-btn"))==null||w.addEventListener("click",async()=>{var E;try{await g.toggleAutoCheck(t.id,!1),y.manga.autoCheck=!1,y.manga.checkSchedule=null,y.manga.checkDay=null,y.manga.checkTime=null,y.manga.nextCheck=null,(E=document.getElementById("schedule-modal"))==null||E.classList.remove("open"),z([t.id]),p("Auto-check disabled","success")}catch(C){p("Failed to disable: "+C.message,"error")}}),(x=document.getElementById("refresh-btn"))==null||x.addEventListener("click",async()=>{const E=document.getElementById("refresh-btn");try{E.disabled=!0,E.innerHTML=`${h("loader",{spin:!0})} Checking...`,p("Checking for updates...","info"),await g.post(`/bookmarks/${t.id}/check`),await Y(t.id),z([t.id]),p("Check complete!","success")}catch(C){p("Check failed: "+C.message,"error"),E&&(E.disabled=!1,E.innerHTML=`${h("refresh-cw")} Refresh`)}}),(v=document.getElementById("scan-folder-btn"))==null||v.addEventListener("click",async()=>{var C,A;const E=document.getElementById("scan-folder-btn");try{E.disabled=!0,E.innerHTML=`${h("loader",{spin:!0})} Scanning...`,p("Scanning folder...","info");const T=await g.scanBookmark(t.id);await Y(t.id),z([t.id]);const R=((C=T.addedChapters)==null?void 0:C.length)||0,_=((A=T.removedChapters)==null?void 0:A.length)||0;R>0||_>0?p(`Scan complete: ${R} added, ${_} removed`,"success"):p("Scan complete: No changes","info")}catch(T){p("Scan failed: "+T.message,"error")}finally{E&&(E.disabled=!1,E.innerHTML=`${h("folder")} Scan Folder`)}}),document.querySelectorAll("[data-cbz-path]").forEach(E=>{E.addEventListener("click",async()=>{const C=decodeURIComponent(E.dataset.cbzPath),A=parseInt(E.dataset.cbzChapter)||1,T=E.dataset.cbzExtracted==="true",R=prompt("Enter chapter number for extraction:",String(A));if(!R)return;const _=parseFloat(R);if(isNaN(_)){p("Invalid chapter number","error");return}try{E.disabled=!0,E.textContent="Extracting...",p("Extracting CBZ...","info"),await g.extractCbz(t.id,C,_,{forceReExtract:T}),p("CBZ extracted successfully!","success"),await Y(t.id),z([t.id])}catch(O){p("Extract failed: "+O.message,"error")}finally{E.disabled=!1,E.textContent=T?"Re-Extract":"Extract"}})}),(L=document.getElementById("edit-btn"))==null||L.addEventListener("click",async()=>{const E=document.getElementById("edit-manga-modal");if(E){document.getElementById("edit-alias-input").value=t.alias||"",window._selectedCoverPath=null;try{const[C,A]=await Promise.all([g.getAllArtists(),g.getAllCategories()]),T=document.getElementById("artist-list"),R=document.getElementById("category-list");window._allArtists=C,window._allCategories=A,T&&(T.innerHTML=C.map(ee=>`<option value="${ee}">`).join("")),R&&(R.innerHTML=A.map(ee=>`<option value="${ee}">`).join(""));const _=document.getElementById("edit-artist-input"),O=document.getElementById("edit-categories-input");_==null||_.addEventListener("input",()=>{const ee=_.value.toLowerCase(),Q=_.value.lastIndexOf(","),ae=_.value.substring(Q+1).trim().toLowerCase();if(ae.length>0&&window._allArtists){const G=window._allArtists.filter(te=>te.toLowerCase().includes(ae));if(T&&G.length>0){const te=Q>=0?_.value.substring(0,Q+1)+" ":"";T.innerHTML=G.map(le=>`<option value="${te}${le}">`).join("")}}}),O==null||O.addEventListener("input",()=>{const ee=O.value.lastIndexOf(","),Q=O.value.substring(ee+1).trim().toLowerCase();if(Q.length>0&&window._allCategories){const ae=window._allCategories.filter(G=>G.toLowerCase().includes(Q));if(R&&ae.length>0){const G=ee>=0?O.value.substring(0,ee+1)+" ":"";R.innerHTML=ae.map(te=>`<option value="${G}${te}">`).join("")}}})}catch(C){console.error("Failed to load artists/categories:",C)}E.classList.add("open")}}),(S=document.getElementById("save-manga-btn"))==null||S.addEventListener("click",async()=>{var E;try{const C=document.getElementById("edit-alias-input").value.trim(),A=document.getElementById("edit-artist-input").value.trim(),T=document.getElementById("edit-categories-input").value.trim(),R=A?A.split(",").map(O=>O.trim()).filter(O=>O):[],_=T?T.split(",").map(O=>O.trim()).filter(O=>O):[];await g.updateBookmark(t.id,{alias:C||null}),await g.setBookmarkArtists(t.id,R),await g.setBookmarkCategories(t.id,_),window._selectedCoverPath&&await g.setBookmarkCoverFromImage(t.id,window._selectedCoverPath),y.manga.alias=C||null,y.manga.artists=R,y.manga.categories=_,(E=document.getElementById("edit-manga-modal"))==null||E.classList.remove("open"),z([t.id]),p("Manga updated","success")}catch(C){p("Failed to update: "+C.message,"error")}}),(B=document.getElementById("change-cover-btn"))==null||B.addEventListener("click",async()=>{try{p("Loading images...","info");const E=await g.getFolderImages(t.id);if(E.length===0){p("No images found in manga folder","warning");return}const C=document.createElement("div");C.id="cover-select-modal",C.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",C.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${E.slice(0,50).map(A=>`
              <div class="cover-option" data-path="${A.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(A.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${E.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${E.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(C),document.getElementById("close-cover-modal").addEventListener("click",()=>C.remove()),C.addEventListener("click",A=>{A.target===C&&C.remove()}),C.querySelectorAll(".cover-option").forEach(A=>{A.addEventListener("click",()=>{window._selectedCoverPath=A.dataset.path;const T=document.getElementById("cover-preview");T&&(T.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),C.remove(),p("Cover selected","success")})})}catch(E){p("Failed to load images: "+E.message,"error")}}),(D=document.getElementById("delete-manga-btn"))==null||D.addEventListener("click",()=>{const E=document.getElementById("delete-manga-modal");E&&E.classList.add("open")}),(k=document.getElementById("confirm-delete-manga-btn"))==null||k.addEventListener("click",async()=>{var C,A;const E=((C=document.getElementById("delete-files-toggle"))==null?void 0:C.checked)||!1;try{await g.deleteBookmark(t.id,E),(A=document.getElementById("delete-manga-modal"))==null||A.classList.remove("open"),p("Manga deleted","success"),F.go("/")}catch(T){p("Failed to delete: "+T.message,"error")}}),(q=document.getElementById("quick-check-btn"))==null||q.addEventListener("click",async()=>{const E=document.getElementById("quick-check-btn");try{E.disabled=!0,E.innerHTML=`${h("loader",{spin:!0})} Checking...`,p("Quick checking for updates...","info");const C=await g.post(`/bookmarks/${t.id}/quick-check`);await Y(t.id),z([t.id]),C.newChaptersCount>0?p(`Found ${C.newChaptersCount} new chapter(s)!`,"success"):p("No new chapters found","info")}catch(C){p("Quick check failed: "+C.message,"error")}finally{E&&(E.disabled=!1,E.innerHTML=`${h("zap")} Quick Check`)}}),(U=document.getElementById("source-label"))==null||U.addEventListener("click",async()=>{const E=document.getElementById("migrate-source-modal");if(E){E.classList.add("open");const C=document.getElementById("migrate-search-scraper");if(C&&C.options.length<=1)try{const A=await g.get("/scrapers/list");if(A.success){const T=A.scrapers.filter(R=>R.supportsSearch);C.innerHTML='<option value="all">All Sources</option>'+T.map(R=>`<option value="${R.name}">${R.name}</option>`).join(""),C.value="all"}}catch(A){console.warn("Failed to load scrapers:",A)}}});const s=async()=>{var _,O,ee;const E=(O=(_=document.getElementById("migrate-search-input"))==null?void 0:_.value)==null?void 0:O.trim(),C=(ee=document.getElementById("migrate-search-scraper"))==null?void 0:ee.value;if(!E)return;const A=document.getElementById("migrate-search-loading"),T=document.getElementById("migrate-search-results"),R=document.getElementById("migrate-results-grid");A.style.display="block",T.style.display="none";try{const ae=(await g.get(`/scrapers/search?q=${encodeURIComponent(E)}&scraper=${encodeURIComponent(C)}`)).results||[];ae.length===0?R.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(R.innerHTML=ae.map(G=>{var le;const te=(le=G.cover)!=null&&le.startsWith("/covers/")?G.cover:G.cover?`/api/scrapers/proxy-cover?url=${encodeURIComponent(G.cover)}`:"";return`
            <div class="manga-card migrate-result-card" data-url="${G.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${te?Te(te,"Cover",{kind:"series",self:!0}):fe("series")}
                ${G.chapterCount?`<div class="manga-card-badges"><span class="badge badge-chapters">${G.chapterCount} ch</span></div>`:""}
              </div>
              <div class="manga-card-title" title="${G.title}" style="font-size: 0.8rem; padding: 4px;">${G.title}</div>
            </div>
          `}).join(""),R.querySelectorAll(".migrate-result-card").forEach(G=>{G.addEventListener("click",()=>{var le;const te=G.dataset.url;document.getElementById("migrate-url-input").value=te,R.querySelectorAll(".migrate-result-card").forEach(Be=>Be.style.outline=""),G.style.outline="2px solid var(--color-primary)",p(`Selected: ${(le=G.querySelector(".manga-card-title"))==null?void 0:le.textContent}`,"info")})})),A.style.display="none",T.style.display="block"}catch(Q){A.style.display="none",p("Search failed: "+Q.message,"error")}};(b=document.getElementById("migrate-search-btn"))==null||b.addEventListener("click",s),($=document.getElementById("migrate-search-input"))==null||$.addEventListener("keydown",E=>{E.key==="Enter"&&s()}),(M=document.getElementById("confirm-migrate-btn"))==null||M.addEventListener("click",async()=>{var A,T,R;const E=(T=(A=document.getElementById("migrate-url-input"))==null?void 0:A.value)==null?void 0:T.trim();if(!E){p("Please enter a URL","warning");return}const C=document.getElementById("confirm-migrate-btn");try{C.disabled=!0,C.textContent="Migrating...",p("Migrating source...","info");const _=await g.migrateSource(t.id,E);p(`Migrated! ${_.migratedChapters} chapters preserved as local`,"success"),p("Running full check on new source...","info"),await g.post(`/bookmarks/${t.id}/check`),(R=document.getElementById("migrate-source-modal"))==null||R.classList.remove("open"),await Y(t.id),z([t.id]),p("Source migration complete!","success")}catch(_){p("Migration failed: "+_.message,"error")}finally{C&&(C.disabled=!1,C.textContent="Migrate Source")}}),(N=document.getElementById("anilist-track-btn"))==null||N.addEventListener("click",()=>{var E;(E=document.getElementById("anilist-modal"))==null||E.classList.add("open"),At()});const a=async()=>{var R,_;const E=(_=(R=document.getElementById("anilist-search-input"))==null?void 0:R.value)==null?void 0:_.trim();if(!E)return;const C=document.getElementById("anilist-search-loading"),A=document.getElementById("anilist-search-results"),T=document.getElementById("anilist-results-list");C.style.display="block",A.style.display="none";try{const ee=(await g.anilistSearch(E)).results||[];ee.length===0?T.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(T.innerHTML=ee.map(Q=>{var te,le,Be,_s,Ps,qs,Rs;const ae=((te=Q.title)==null?void 0:te.romaji)||((le=Q.title)==null?void 0:le.english)||((Be=Q.title)==null?void 0:Be.native)||"Unknown",G=(_s=Q.title)!=null&&_s.english&&Q.title.english!==ae?Q.title.english:(Ps=Q.title)!=null&&Ps.native&&Q.title.native!==ae?Q.title.native:"";return`
            <div style="display: flex; gap: 10px; align-items: center; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 8px;">
              ${(qs=Q.coverImage)!=null&&qs.medium?`<img src="${Q.coverImage.medium}" alt="" style="width: 48px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">`:""}
              <div style="flex: 1; min-width: 0;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${ae}"><strong>${ae}</strong></div>
                <div class="text-muted" style="font-size: 0.8em;">
                  ${[G,Q.format,(Rs=Q.startDate)==null?void 0:Rs.year,`${Q.chapters??"?"} ch`].filter(Boolean).join(" • ")}
                </div>
              </div>
              <button class="btn btn-small btn-primary anilist-link-result-btn" data-id="${Q.id}" data-title="${ae.replace(/"/g,"&quot;")}">Link</button>
            </div>
          `}).join(""),T.querySelectorAll(".anilist-link-result-btn").forEach(Q=>{Q.addEventListener("click",async()=>{var ae,G;try{Q.disabled=!0,Q.textContent="Linking...";const te=await g.anilistMap(t.id,Number(Q.dataset.id)),le=((ae=te.mapping)==null?void 0:ae.anilist_title)||Q.dataset.title,Be=(G=te.pull)!=null&&G.markedUpTo?` — pulled progress up to ch. ${te.pull.markedUpTo}`:"";p(`Linked to AniList: ${le}${Be}`,"success"),At()}catch(te){Q.disabled=!1,Q.textContent="Link",p("Failed to link: "+te.message,"error")}})})),C.style.display="none",A.style.display="block"}catch(O){C.style.display="none",p("AniList search failed: "+O.message,"error")}};(V=document.getElementById("anilist-search-btn"))==null||V.addEventListener("click",a),(H=document.getElementById("anilist-search-input"))==null||H.addEventListener("keydown",E=>{E.key==="Enter"&&a()}),e.querySelectorAll(".filter-btn[data-filter]").forEach(E=>{E.addEventListener("click",()=>{y.filter=E.dataset.filter,y.currentPage=0,z([t.id])})}),So(e,t),e.querySelectorAll("[data-page]").forEach(E=>{E.addEventListener("click",()=>{const C=E.dataset.page,A=Math.ceil(y.manga.chapters.length/it);switch(C){case"first":y.currentPage=0;break;case"prev":y.currentPage=Math.max(0,y.currentPage-1);break;case"next":y.currentPage=Math.min(A-1,y.currentPage+1);break;case"last":y.currentPage=A-1;break}z([t.id])})}),e.querySelectorAll(".chapter-item").forEach(E=>{E.addEventListener("click",C=>{var R;if(C.target.closest(".chapter-actions"))return;const A=parseFloat(E.dataset.num);if((t.downloadedChapters||[]).includes(A)){const _=((R=t.downloadedVersions)==null?void 0:R[A])||[],O=Array.isArray(_)?_[0]:_;O?F.go(`/read/${t.id}/${A}?version=${encodeURIComponent(O)}`):F.go(`/read/${t.id}/${A}`)}else p("Chapter not downloaded","info")})}),e.querySelectorAll("[data-action]").forEach(E=>{E.addEventListener("click",async C=>{C.stopPropagation();const A=E.dataset.action,T=parseFloat(E.dataset.num),R=E.dataset.url?decodeURIComponent(E.dataset.url):null;switch(A){case"lock":await io(T);break;case"read":await po(T);break;case"download":await ho(T);break;case"versions":mo(T);break;case"read-version":F.go(`/read/${t.id}/${T}?version=${encodeURIComponent(R)}`);break;case"download-version":await vo(T,R);break;case"delete-version":await yo(T,R);break;case"keep-version":await fo(T,R);break;case"delete-folder":await go(T,decodeURIComponent(E.dataset.folder||""));break;case"hide-version":await bo(T,R);break;case"restore-version":await wo(T,R);break;case"restore-chapter":await ko(T);break;case"delete-chapter":await $o(T,R);break;case"hide-chapter":await Eo(T,R);break;case"unhide-chapter":await Co(T,R);break;case"split-chapter":await Lo(T);break}})}),e.querySelectorAll('[data-action="read"], [data-action="hide-chapter"], [data-action="delete-chapter"]').forEach(E=>{co(E,()=>uo(E.dataset.action,parseFloat(E.dataset.num)))}),e.querySelectorAll(".version-row .version-title").forEach(E=>{E.addEventListener("click",C=>{C.stopPropagation();const A=E.closest(".version-row"),T=parseFloat(A.dataset.num),R=A.dataset.versionUrl?decodeURIComponent(A.dataset.versionUrl):null;A.classList.contains("downloaded")&&R?F.go(`/read/${t.id}/${T}?version=${encodeURIComponent(R)}`):p("Version not downloaded yet","info")})}),e.querySelectorAll(".volume-card").forEach(E=>{E.addEventListener("click",()=>{const C=E.dataset.volumeId;F.go(`/manga/${t.id}/volume/${C}`)})}),e.querySelectorAll("[data-read-volume]").forEach(E=>{E.addEventListener("click",C=>{C.stopPropagation(),F.go(`/read/${t.id}/volume/${E.dataset.readVolume}`)})}),(J=e.querySelector("#read-volume-btn"))==null||J.addEventListener("click",E=>{F.go(`/read/${t.id}/volume/${E.currentTarget.dataset.volId}`)}),(X=e.querySelector("#find-volumes-btn"))==null||X.addEventListener("click",()=>{Na({query:t.alias||t.title,bookmarkId:t.id,bookmarkTitle:t.alias||t.title})}),Mo(e),_e(),Z.subscribeToManga(t.id)}async function io(e){var n;const t=y.manga,s=((n=t.chapterSettings)==null?void 0:n[e])||{},a=!s.locked;try{a?await g.lockChapter(t.id,e):await g.unlockChapter(t.id,e),t.chapterSettings||(t.chapterSettings={}),t.chapterSettings[e]={...s,locked:a},p(a?"Chapter locked":"Chapter unlocked","success"),z([t.id])}catch(r){p("Failed: "+r.message,"error")}}const lo=550;function co(e,t){let s=null,a=!1;const n=()=>{clearTimeout(s),s=null,e.classList.remove("pressing")};e.addEventListener("pointerdown",r=>{r.button!==void 0&&r.button!==0||(a=!1,n(),e.classList.add("pressing"),s=setTimeout(()=>{a=!0,e.classList.remove("pressing"),t()},lo))}),e.addEventListener("pointerup",n),e.addEventListener("pointerleave",n),e.addEventListener("pointercancel",n),e.addEventListener("contextmenu",r=>r.preventDefault()),e.addEventListener("click",r=>{a&&(a=!1,r.preventDefault(),r.stopImmediatePropagation())},!0)}async function uo(e,t){const s=y.manga;if(!s||!Number.isFinite(t))return;const a=`chapter ${t}`,n=(r,i)=>`${r} ${i}${r===1?"":"s"}`;try{if(e==="read"){if(!confirm(`Mark every chapter up to ${a} as read?`))return;await g.markChaptersReadUpTo(s.id,t),p(`Marked read up to ${a}`,"success")}else if(e==="hide-chapter"){if(!confirm(`Hide every chapter up to ${a}? Their downloaded files are removed too. Locked chapters and chapters in a volume stay.`))return;const r=await g.bulkHideChapters(s.id,t);p(`Hid ${n(r.hidden,"chapter version")}${r.skipped?`, ${r.skipped} protected`:""}`,"success")}else if(e==="delete-chapter"){if(!confirm(`Delete the downloaded files of every chapter up to ${a}? Locked chapters stay.`))return;const r=confirm(`Also hide those chapters, up to ${a}?`),i=await g.bulkDeleteChapters(s.id,t,r);p(`Deleted ${n(i.deleted,"chapter")}${r?`, hid ${i.hidden}`:""}${i.skipped?`, ${i.skipped} skipped`:""}`,"success")}else return;await Y(s.id),z([s.id])}catch(r){p("Failed: "+r.message,"error")}}async function po(e){const t=y.manga,s=new Set(t.readChapters||[]),a=s.has(e);try{await g.post(`/bookmarks/${t.id}/chapters/${e}/read`,{isRead:!a}),a?s.delete(e):s.add(e),t.readChapters=[...s],p(a?"Marked unread":"Marked read","success"),z([t.id])}catch(n){p("Failed: "+n.message,"error")}}async function ho(e){const t=y.manga,s=new Set(t.deletedChapterUrls||[]),a=(t.chapters||[]).find(n=>n.number===e&&!s.has(n.url));try{p(`Downloading chapter ${e}...`,"info");let n;a?n=await g.post(`/bookmarks/${t.id}/download-version`,{chapterNumber:e,url:a.url}):n=await g.post(`/bookmarks/${t.id}/download`,{chapters:[e]}),p("Download queued!","success"),Va(n==null?void 0:n.taskId,`Chapter ${e}`)}catch(n){p("Failed: "+n.message,"error")}}function mo(e){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${e}`&&s.classList.add("hidden")});const t=document.getElementById(`versions-${e}`);t&&t.classList.toggle("hidden")}async function go(e,t){const s=y.manga;if(t&&confirm(`Delete the folder "${t}" from disk?`))try{await g.deleteChapterFolder(s.id,e,t),p("Folder deleted","success"),await Y(s.id),z([s.id])}catch(a){p("Failed: "+a.message,"error")}}function Va(e,t){var r;if(!e)return;const s=(r=y.manga)==null?void 0:r.id,a=Date.now(),n=async()=>{var u,m;if(Date.now()-a>30*60*1e3)return;let i;try{i=await g.getDownloadProgress(e)}catch{return}if(!i)return;if(!["complete","error","cancelled"].includes(i.status)){setTimeout(n,3e3);return}const l=i.errors||[],d=(i.completedChapters||[]).length>0&&i.status!=="error";i.status==="cancelled"?p(`${t}: download cancelled`,"info"):d?l.length?p(`${t} downloaded with problems: ${l[0].error}`,"warning"):p(`${t} downloaded${i.pages?` (${i.pages} pages)`:""}`,"success"):p(`${t} failed: ${((u=l[0])==null?void 0:u.error)||"unknown error"}`,"error"),((m=y.manga)==null?void 0:m.id)===s&&window.location.hash.startsWith(`#/manga/${s}`)&&(await Y(s),z([s]))};setTimeout(n,3e3)}async function fo(e,t){var c;const s=y.manga,a=((c=s.downloadedVersions)==null?void 0:c[e])||[],r=(Array.isArray(a)?a:[a]).filter(l=>l&&l!==t);if(r.length===0){p("This is the only downloaded version","info");return}if(!confirm(`Delete the other ${r.length} downloaded version${r.length>1?"s":""} of chapter ${e}?`))return;let i=0;for(const l of r)try{await g.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:l})})}catch(d){i++,p("Failed to delete a version: "+d.message,"error")}i===0&&p("Other versions deleted","success"),await Y(s.id),z([s.id])}async function vo(e,t){const s=y.manga;try{p("Downloading version...","info");const a=await g.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:e,url:t});p("Download queued!","success"),Va(a==null?void 0:a.taskId,`Chapter ${e}`)}catch(a){p("Failed: "+a.message,"error")}}async function yo(e,t){const s=y.manga;try{await g.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:t})}),p("Version deleted","success"),await Y(s.id),z([s.id])}catch(a){p("Failed: "+a.message,"error")}}async function bo(e,t){const s=y.manga;try{await g.hideVersion(s.id,e,t),p("Version hidden","success"),await Y(s.id),z([s.id])}catch(a){p("Failed: "+a.message,"error")}}async function wo(e,t){const s=y.manga;try{await g.unhideVersion(s.id,e,t),p("Version restored","success"),await Y(s.id),z([s.id])}catch(a){p("Failed to restore version: "+a.message,"error")}}async function ko(e){const t=y.manga;try{await g.unexcludeChapter(t.id,e),p("Chapter restored","success"),await Y(t.id),z([t.id])}catch(s){p("Failed to restore chapter: "+s.message,"error")}}async function $o(e,t){const s=y.manga;if(confirm("Delete this chapter's files from disk?"))try{await g.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:t})}),p("Chapter files deleted","success"),await Y(s.id),z([s.id])}catch(a){p("Failed to delete: "+a.message,"error")}}async function Eo(e,t){const s=y.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await g.hideVersion(s.id,e,t),p("Chapter hidden","success"),await Y(s.id),z([s.id])}catch(a){p("Failed to hide chapter: "+a.message,"error")}}async function Co(e,t){const s=y.manga;try{await g.unhideVersion(s.id,e,t),p("Chapter unhidden","success"),await Y(s.id),z([s.id])}catch(a){p("Failed to unhide chapter: "+a.message,"error")}}function So(e,t){var r,i;const s=e.querySelector("#merge-mode-btn");if(s&&s.addEventListener("click",()=>{y.mergeMode=!y.mergeMode,y.mergeSelection=new Set,y.mergeTargetTouched=!1,y.mergeTitleTouched=!1,z([t.id])}),!y.mergeMode)return;e.querySelectorAll(".merge-pick").forEach(c=>{c.addEventListener("click",l=>l.stopPropagation()),c.addEventListener("change",l=>{l.stopPropagation();const d=parseFloat(c.dataset.num);c.checked?y.mergeSelection.add(d):y.mergeSelection.delete(d),xo(t)})});const a=e.querySelector("#merge-target"),n=e.querySelector("#merge-title");a==null||a.addEventListener("input",()=>{y.mergeTargetTouched=!0,!y.mergeTitleTouched&&n&&(n.value=a.value!==""?`Chapter ${a.value}`:"")}),n==null||n.addEventListener("input",()=>{y.mergeTitleTouched=!0}),(r=e.querySelector("#merge-cancel"))==null||r.addEventListener("click",()=>{y.mergeMode=!1,y.mergeSelection=new Set,z([t.id])}),(i=e.querySelector("#merge-submit"))==null||i.addEventListener("click",async()=>{var f;const c=[...y.mergeSelection].sort((w,x)=>w-x),l=parseFloat(a==null?void 0:a.value);if(c.length===0)return p("Tick the chapters to combine first","info");if(!Number.isFinite(l))return p("Give the combined chapter a number","error");const d=(n==null?void 0:n.value.trim())||`Chapter ${l}`,u=!!((f=e.querySelector("#merge-delete-sources"))!=null&&f.checked);if(u&&!confirm(`Remove the original folders of ${c.map(w=>`Ch. ${w}`).join(", ")} after combining? Splitting later will need them downloaded again.`))return;const m=e.querySelector("#merge-submit");m.disabled=!0,m.textContent="Combining…";try{const w=await g.mergeChapters(t.id,{sources:c,target:l,title:d,deleteSources:u});p(`Chapter ${w.target}: ${w.pageCount} pages from ${c.length} chapter${c.length===1?"":"s"}`,"success"),y.mergeMode=!1,y.mergeSelection=new Set,await Y(t.id),z([t.id])}catch(w){p("Combine failed: "+w.message,"error"),m.disabled=!1,m.textContent="Combine"}})}function xo(e){const t=[...y.mergeSelection].sort((c,l)=>c-l),s=document.getElementById("merge-picked");s&&(s.textContent=t.length?`Picked in page order: ${t.map(c=>`Ch. ${c}`).join(", ")}`:"Tick the downloaded chapters to combine (pages follow chapter order).");const a=document.getElementById("merge-submit");a&&(a.disabled=t.length===0);const n=Ua(e,t),r=document.getElementById("merge-target"),i=document.getElementById("merge-title");r&&!y.mergeTargetTouched&&(r.value=n),i&&!y.mergeTitleTouched&&(i.value=n!==""?`Chapter ${n}`:"")}async function Lo(e){var r;const t=y.manga,s=(r=t==null?void 0:t.mergedChapters)==null?void 0:r[e];if(!s)return;const a=s.sources.map(i=>`Ch. ${i}`).join(", "),n=s.sources.includes(e)?` Chapter ${e}'s own pages were folded into the combined folder, so it will need downloading again.`:"";if(confirm(`Split chapter ${e} back into ${a}? The combined folder is deleted; the other originals come back as they are on disk.${n}`))try{await g.unmergeChapter(t.id,e),p(`Chapter ${e} split into ${a}`,"success"),await Y(t.id),z([t.id])}catch(i){p("Split failed: "+i.message,"error")}}async function Y(e){try{const[t,s]=await Promise.all([g.getBookmark(e),K.isDemo?Promise.resolve([]):me.loadCategories()]);if(y.manga=t,y.categories=s,y.loading=!1,y.volumesCollapsed=Wr(t),t.website==="Local")try{const r=await g.getCbzFiles(e);y.cbzFiles=r||[]}catch(r){console.error("Failed to load CBZ files:",r),y.cbzFiles=[]}else y.cbzFiles=[];const a=new Set((t.chapters||[]).map(r=>r.number)).size,n=Math.ceil(a/it);y.currentPage=Math.max(0,n-1),y.activeVolumeId?y.activeVolume=(t.volumes||[]).find(r=>r.id===y.activeVolumeId):y.activeVolume=null}catch{p("Failed to load manga","error"),y.loading=!1}}async function z(e=[]){const[t,s,a]=e;if(!t){F.go("/");return}y.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!y.manga||y.manga.id!==t?(y.loading=!0,y.manga=null,n.innerHTML=us(),await Y(t)):y.activeVolumeId?y.activeVolume=(y.manga.volumes||[]).find(r=>r.id===y.activeVolumeId):y.activeVolume=null,n.innerHTML=us(),oo(),At()}function Io(){y.manga&&Z.unsubscribeFromManga(y.manga.id),y.manga=null,y.loading=!0}const Bo={mount:z,unmount:Io,render:us};function Ao(){return`
    <div class="modal" id="add-volume-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${h("package")} Add New Volume</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="add-volume-name-input">Volume Name</label>
            <input type="text" id="add-volume-name-input" placeholder="e.g. Volume 1">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="add-volume-submit-btn">Create Volume</button>
        </div>
      </div>
    </div>
  `}function Mo(e){const t=y.manga;if(!t)return;const s=e.querySelector("#volumes-toggle-btn");s&&s.addEventListener("click",()=>{y.volumesCollapsed=!y.volumesCollapsed,localStorage.setItem(Oa(t.id),y.volumesCollapsed?"1":"0");const v=e.querySelector(".volumes-section");v==null||v.classList.toggle("collapsed",y.volumesCollapsed),s.setAttribute("aria-expanded",String(!y.volumesCollapsed)),s.title=y.volumesCollapsed?"Expand volumes":"Collapse volumes";const L=s.querySelector("svg");L&&(L.outerHTML=h(y.volumesCollapsed?"chevron-down":"chevron-up"))});const a=e.querySelector("#add-volume-btn"),n=e.querySelector("#add-volume-modal"),r=e.querySelector("#add-volume-submit-btn");a&&n&&a.addEventListener("click",()=>{n.classList.add("open"),e.querySelector("#add-volume-name-input").focus()}),n==null||n.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(v=>{v.addEventListener("click",()=>n.classList.remove("open"))}),r&&r.addEventListener("click",async()=>{const v=e.querySelector("#add-volume-name-input").value.trim();if(!v)return p("Please enter a volume name","error");try{r.disabled=!0,r.textContent="Creating...",await g.createVolume(t.id,v),p("Volume created successfully!","success"),n.classList.remove("open"),e.querySelector("#add-volume-name-input").value="",await Y(t.id),z([t.id])}catch(L){p("Failed to create volume: "+L.message,"error")}finally{r.disabled=!1,r.textContent="Create Volume"}});const i=e.querySelector("#manage-chapters-btn");i&&i.addEventListener("click",()=>{y.manageChapters=!y.manageChapters,z([t.id,"volume",y.activeVolumeId])}),e.querySelectorAll(".add-to-vol-btn").forEach(v=>{v.addEventListener("click",async()=>{const L=parseFloat(v.dataset.num),S=y.activeVolume;if(S)try{v.disabled=!0,v.textContent="...";const B=S.chapters||[];if(B.includes(L))return;const D=[...B,L].sort((k,q)=>k-q);await g.updateVolumeChapters(t.id,S.id,D),p(`Chapter ${L} added to volume`,"success"),await Y(t.id),z([t.id,"volume",S.id])}catch(B){p("Failed to add chapter: "+B.message,"error"),v.disabled=!1,v.textContent="Add"}})}),e.querySelectorAll(".remove-from-vol-btn").forEach(v=>{v.addEventListener("click",async L=>{L.stopPropagation();const S=parseFloat(v.dataset.num),B=y.activeVolume;if(B)try{v.disabled=!0,v.textContent="...";const k=(B.chapters||[]).filter(q=>q!==S);await g.updateVolumeChapters(t.id,B.id,k),p(`Chapter ${S} removed from volume`,"success"),await Y(t.id),z([t.id,"volume",B.id])}catch(D){p("Failed to remove chapter: "+D.message,"error"),v.disabled=!1,v.textContent="×"}})});const c=e.querySelector("#edit-vol-btn"),l=e.querySelector("#edit-volume-modal");c&&l&&c.addEventListener("click",()=>{const v=c.dataset.volId,L=t.volumes.find(S=>S.id===v);L&&(e.querySelector("#volume-name-input").value=L.name,l.dataset.editingVolId=v,l.classList.add("open"))});const d=e.querySelector("#save-volume-btn");d&&d.addEventListener("click",async()=>{const v=l.dataset.editingVolId,L=e.querySelector("#volume-name-input").value.trim();if(!L)return p("Volume name cannot be empty","error");try{await g.renameVolume(t.id,v,L),p("Volume renamed","success"),l.classList.remove("open"),await Y(t.id),z([t.id,"volume",v])}catch(S){p(S.message,"error")}});const u=e.querySelector("#delete-volume-btn");u&&u.addEventListener("click",async()=>{var B;const v=(((B=y.manga)==null?void 0:B.volumes)||[]).find(D=>D.id===l.dataset.editingVolId),L=(v==null?void 0:v.kind)==="release"?`Delete "${v.name}"? Its ${v.pageCount||""} pages are removed from disk. Chapters assigned to it stay in the library.`:"Are you sure you want to delete this volume? Chapters will remain in the library.";if(!confirm(L))return;const S=l.dataset.editingVolId;try{await g.deleteVolume(t.id,S),p("Volume deleted","success"),l.classList.remove("open"),window.location.hash=`#/manga/${t.id}`}catch(D){p(D.message,"error")}});const m=e.querySelector("#vol-cover-upload-btn");if(m){let v=document.getElementById("vol-cover-input-hidden");v||(v=document.createElement("input"),v.type="file",v.id="vol-cover-input-hidden",v.accept="image/*",v.style.display="none",document.body.appendChild(v),v.addEventListener("change",async L=>{const S=L.target.files[0];if(!S)return;const B=v.dataset.mangaId,D=v.dataset.volId,k=document.getElementById("vol-cover-upload-btn");if(v.value="",!(!B||!D))try{k&&(k.disabled=!0,k.textContent="Uploading..."),await g.uploadVolumeCover(B,D,S),p("Cover uploaded","success"),await Y(B),z([B,"volume",D])}catch(q){p("Upload failed: "+q.message,"error")}finally{k&&(k.disabled=!1,k.innerHTML=`${h("upload")} Upload Image`)}})),m.addEventListener("click",()=>{v.dataset.mangaId=t.id,v.dataset.volId=l.dataset.editingVolId||"",v.click()})}const f=e.querySelector("#vol-cover-selector-btn"),w=e.querySelector("#cover-selector-modal");f&&w&&f.addEventListener("click",async()=>{const v=w.querySelector("#cover-chapter-select");v.innerHTML='<option value="">Select a chapter...</option>';const L=e.querySelector("#edit-volume-modal"),S=L?L.dataset.editingVolId:null;let B=[...t.chapters||[]];if(S){const k=t.volumes.find(q=>q.id===S);if(k&&k.chapters){const q=new Set(k.chapters);B=B.filter(U=>q.has(U.number))}}B.sort((k,q)=>k.number-q.number);const D=new Set;B.forEach(k=>{if(!D.has(k.number)){D.add(k.number);const q=document.createElement("option");q.value=k.number,q.textContent=`Chapter ${k.number}`,v.appendChild(q)}}),B.length>0&&(v.value=B[0].number,Ks(t.id,B[0].number)),w.classList.add("open")});const x=e.querySelector("#cover-chapter-select");x&&x.addEventListener("change",v=>{v.target.value&&Ks(t.id,v.target.value)}),e.querySelectorAll(".modal-close, .modal-close-btn").forEach(v=>{v.addEventListener("click",()=>{v.closest(".modal").classList.remove("open")})}),e.querySelectorAll(".modal-overlay").forEach(v=>{v.addEventListener("click",()=>{v.closest(".modal").classList.remove("open")})})}async function Ks(e,t){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await g.getChapterImages(e,t)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(r=>{const i=document.createElement("div");i.className="cover-grid-item",i.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",i.innerHTML=`<img src="${r}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,i.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=r.split("/").pop();To(l,t,c)}),s.appendChild(i)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function To(e,t,s){const a=y.manga,n=document.getElementById("edit-volume-modal"),r=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const i=n.dataset.editingVolId;if(!i)throw new Error("No volume selected");await g.setVolumeCoverFromChapter(a.id,i,t,e),p("Volume cover updated","success"),r.classList.remove("open"),n.classList.remove("open"),await Y(a.id),z([a.id,"volume",i])}else{await g.setMangaCoverFromChapter(a.id,t,e),p("Series cover updated","success"),r.classList.remove("open"),await Y(a.id);const i=window.location.hash.replace("#","");y.activeVolumeId?z([a.id,"volume",y.activeVolumeId]):z([a.id])}}catch(i){p("Failed to set cover: "+i.message,"error")}}let ke={series:null,loading:!0};function Xe(){if(ke.loading)return`
      ${pe("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const e=ke.series;if(!e)return`
      ${pe("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const t=e.alias||e.title,s=e.entries||[],a=s.reduce((r,i)=>r+(i.chapter_count||0),0);let n=null;if(s.length>0){const r=s[0];r.local_cover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.local_cover.split(/[/\\]/).pop())}`:r.localCover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.localCover.split(/[/\\]/).pop())}`:r.cover&&(n=r.cover)}return`
    ${pe("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?Te(n,t,{kind:"series"}):fe("series")}
          </div>
          <div class="series-detail-info">
            <h1>${t}</h1>
            <div class="series-detail-meta">
              <span class="meta-item">${s.length} Entries</span>
              <span class="meta-item">${a} Total Chapters</span>
            </div>
            <div class="series-detail-actions">
              <button class="btn btn-secondary" id="add-entry-btn">+ Add Entry</button>
              <button class="btn btn-secondary" id="edit-series-btn">${h("pencil")} Edit</button>
              <button class="btn btn-secondary" id="back-library-btn">← Library</button>
            </div>
          </div>
        </div>
        
        <div class="series-entries-section">
          <h2>Entries</h2>
          <div class="series-entries-grid">
            ${s.map((r,i)=>_o(r,i,s.length)).join("")}
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Entry Modal -->
    <div class="modal" id="add-entry-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add Manga to Series</h2>
          <button class="btn-icon" onclick="document.getElementById('add-entry-modal').classList.remove('open')">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="available-bookmarks-input">Select Manga:</label>
            <input list="available-bookmarks-list" id="available-bookmarks-input" class="form-control" style="width: 100%; margin-bottom: 1rem;" placeholder="Loading..." autocomplete="off">
            <datalist id="available-bookmarks-list"></datalist>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('add-entry-modal').classList.remove('open')">Cancel</button>
          <button class="btn btn-primary" id="confirm-add-entry-btn">Add to Series</button>
        </div>
      </div>
    </div>
  `}function _o(e,t,s){var r;const a=e.alias||e.title;let n=null;return e.local_cover?n=`/api/public/covers/${e.bookmark_id}/${encodeURIComponent(e.local_cover.split(/[/\\]/).pop())}`:e.localCover?n=`/api/public/covers/${e.bookmark_id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover&&(n=e.cover),`
    <div class="series-entry-card" data-id="${e.bookmark_id}" data-order="${e.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${t+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${e.bookmark_id}" ${t===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${e.bookmark_id}" ${t===s-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?Te(n,a,{kind:"book"}):fe("book")}
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${e.chapter_count||0} ch</span>
          ${((r=e.downloadedChapters)==null?void 0:r.length)>0?`<span class="badge badge-downloaded">${e.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${e.bookmark_id}" data-entryid="${e.id}" title="Use as series cover">${h("image",{title:"Use as series cover"})}</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${a}</div>
      </div>
    </div>
  `}function Ft(){var l,d,u;const e=document.getElementById("app"),t=ke.series;(l=document.getElementById("back-btn"))==null||l.addEventListener("click",()=>F.go("/")),(d=document.getElementById("back-library-btn"))==null||d.addEventListener("click",()=>F.go("/")),e.querySelectorAll(".series-entry-card").forEach(m=>{m.addEventListener("click",f=>{if(f.target.closest("[data-action]"))return;const w=m.dataset.id;F.go(`/manga/${w}`)})}),e.querySelectorAll("[data-action]").forEach(m=>{m.addEventListener("click",async f=>{f.stopPropagation();const w=m.dataset.action,x=m.dataset.id;switch(w){case"move-up":await Ys(x,-1);break;case"move-down":await Ys(x,1);break;case"set-cover":const v=m.dataset.entryid;await Po(v);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),r=document.getElementById("available-bookmarks-list"),i=document.getElementById("confirm-add-entry-btn");let c=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),r&&(r.innerHTML=""),a.classList.add("open");const m=await g.getAvailableBookmarksForSeries();c=m,m.length===0?(n&&(n.placeholder="No available manga found"),i.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),r&&(r.innerHTML=m.map(f=>`<option value="${(f.alias||f.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),i.disabled=!1)}catch{p("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),i.addEventListener("click",async()=>{const m=n?n.value:"",f=c.find(x=>(x.alias||x.title||"")===m);if(!f){p("Please select a valid manga from the list","warning");return}const w=f.id;try{i.disabled=!0,i.textContent="Adding...",await g.addSeriesEntry(t.id,w),p("Manga added to series","success"),a.classList.remove("open"),await Nt(t.id),e.innerHTML=Xe(),Ft()}catch(x){p("Failed to add manga: "+x.message,"error")}finally{i.disabled=!1,i.textContent="Add to Series"}})),(u=document.getElementById("edit-series-btn"))==null||u.addEventListener("click",()=>{p("Edit series coming soon","info")})}async function Ys(e,t){const s=ke.series;if(!s)return;const a=s.entries||[],n=a.findIndex(c=>c.bookmark_id===e);if(n===-1)return;const r=n+t;if(r<0||r>=a.length)return;const i=a.map(c=>c.bookmark_id);[i[n],i[r]]=[i[r],i[n]];try{await g.post(`/series/${s.id}/reorder`,{order:i}),p("Order updated","success"),await Nt(s.id);const c=document.getElementById("app");c.innerHTML=Xe(),Ft()}catch(c){p("Failed to reorder: "+c.message,"error")}}async function Po(e){const t=ke.series;if(t)try{await g.setSeriesCover(t.id,e),p("Series cover updated","success"),await Nt(t.id);const s=document.getElementById("app");s.innerHTML=Xe(),Ft()}catch(s){p("Failed to set cover: "+s.message,"error")}}async function Nt(e){try{const t=await g.get(`/series/${e}`);ke.series=t,ke.loading=!1}catch{p("Failed to load series","error"),ke.loading=!1}}async function qo(e=[]){const[t]=e;if(!t){F.go("/");return}const s=document.getElementById("app");ke.loading=!0,ke.series=null,s.innerHTML=Xe(),await Nt(t),s.innerHTML=Xe(),Ft()}function Ro(){ke.series=null,ke.loading=!0}const Do={mount:qo,unmount:Ro,render:Xe},Fo={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};function ps(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function No(){return`
        <div class="settings-group" id="torrents-group">
            <h2>Torrents</h2>
            <p class="settings-hint">Search volume releases through Prowlarr and download them with qBittorrent. Finished downloads are imported as volumes with their own pages.</p>

            <h3 class="settings-subhead">Prowlarr</h3>
            <div class="form-group">
                <label for="tor-prowlarr-url">URL</label>
                <input type="url" id="tor-prowlarr-url" placeholder="http://truenas.local:9696" autocomplete="off">
            </div>
            <div class="form-group">
                <label for="tor-prowlarr-key">API key <span class="settings-hint-inline">(Prowlarr → Settings → General)</span></label>
                <input type="password" id="tor-prowlarr-key" autocomplete="new-password">
            </div>
            <div class="settings-actions torrents-actions">
                <button type="button" class="btn btn-secondary" id="tor-test-prowlarr">Test connection</button>
                <span class="torrents-test-result" id="tor-prowlarr-result"></span>
            </div>

            <h3 class="settings-subhead">qBittorrent</h3>
            <div class="form-group">
                <label for="tor-qbt-url">Web UI URL</label>
                <input type="url" id="tor-qbt-url" placeholder="http://truenas.local:8080" autocomplete="off">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="tor-qbt-user">Username</label>
                    <input type="text" id="tor-qbt-user" autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="tor-qbt-pass">Password</label>
                    <input type="password" id="tor-qbt-pass" autocomplete="new-password">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="tor-qbt-category">Category</label>
                    <input type="text" id="tor-qbt-category" placeholder="manga" autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="tor-qbt-savepath">Save path <span class="settings-hint-inline">(optional, as qBittorrent sees it)</span></label>
                    <input type="text" id="tor-qbt-savepath" placeholder="/downloads/manga" autocomplete="off">
                </div>
            </div>
            <div class="settings-actions torrents-actions">
                <button type="button" class="btn btn-secondary" id="tor-test-qbt">Test connection</button>
                <span class="torrents-test-result" id="tor-qbt-result"></span>
            </div>

            <h3 class="settings-subhead">Path mappings</h3>
            <p class="settings-hint">qBittorrent reports where it saved a download using its own paths. If this app sees that folder under a different path (a different container mount, or a network share), map the prefix here. Leave empty when both run on the same machine with the same paths.</p>
            <div id="tor-path-mappings"></div>
            <div class="settings-actions torrents-actions">
                <button type="button" class="btn btn-secondary btn-sm" id="tor-add-mapping">${h("plus")} Add mapping</button>
            </div>

            <div class="setting-item">
                <label for="tor-auto-import">Import finished downloads automatically</label>
                <input type="checkbox" id="tor-auto-import" checked>
            </div>

            <div class="settings-actions">
                <span class="torrents-test-result" id="tor-save-result"></span>
                <button type="button" class="btn btn-primary" id="tor-save">Save torrent settings</button>
            </div>
        </div>
    `}async function Oo(){const e=l=>document.getElementById(l),t=e("tor-path-mappings");if(!t)return;const s=l=>{t.innerHTML=l.length?l.map((d,u)=>`
                <div class="tor-mapping" data-index="${u}">
                    <input type="text" class="tor-map-from" value="${ps(d.from)}" placeholder="qBittorrent path, e.g. /downloads">
                    <span class="tor-map-arrow">→</span>
                    <input type="text" class="tor-map-to" value="${ps(d.to)}" placeholder="path this app sees, e.g. /app/torrents">
                    <button type="button" class="btn-icon small danger tor-map-remove" title="Remove">×</button>
                </div>`).join(""):'<p class="settings-hint">No mappings.</p>',t.querySelectorAll(".tor-map-remove").forEach(d=>d.addEventListener("click",()=>{d.closest(".tor-mapping").remove(),t.querySelector(".tor-mapping")||s([])}))},a=()=>[...t.querySelectorAll(".tor-mapping")].map(l=>({from:l.querySelector(".tor-map-from").value.trim(),to:l.querySelector(".tor-map-to").value.trim()})),n=()=>a().filter(l=>l.from&&l.to),r=()=>({prowlarr:{baseUrl:e("tor-prowlarr-url").value.trim(),apiKey:e("tor-prowlarr-key").value},qbittorrent:{baseUrl:e("tor-qbt-url").value.trim(),username:e("tor-qbt-user").value.trim(),password:e("tor-qbt-pass").value,category:e("tor-qbt-category").value.trim()||"manga",savePath:e("tor-qbt-savepath").value.trim()},pathMappings:n(),autoImport:e("tor-auto-import").checked}),i=(l,d,u)=>{l.textContent=u,l.className=`torrents-test-result ${d?"ok":"error"}`};try{const{settings:l}=await g.getTorrentSettings();e("tor-prowlarr-url").value=l.prowlarr.baseUrl||"",e("tor-prowlarr-key").value=l.prowlarr.apiKey||"",e("tor-qbt-url").value=l.qbittorrent.baseUrl||"",e("tor-qbt-user").value=l.qbittorrent.username||"",e("tor-qbt-pass").value=l.qbittorrent.password||"",e("tor-qbt-category").value=l.qbittorrent.category||"manga",e("tor-qbt-savepath").value=l.qbittorrent.savePath||"",e("tor-auto-import").checked=l.autoImport!==!1,s(l.pathMappings||[])}catch(l){s([]),i(e("tor-save-result"),!1,`Could not load torrent settings: ${l.message}`)}e("tor-add-mapping").addEventListener("click",()=>s([...a(),{from:"",to:""}]));const c=async(l,d,u)=>{d.disabled=!0,u.textContent="Testing…",u.className="torrents-test-result";try{const{result:m}=await g.testTorrentService(l,r()[l]);l==="prowlarr"?i(u,!0,`Connected: ${m.appName} ${m.version}${m.indexers!==null?`, ${m.indexers} indexer${m.indexers===1?"":"s"} enabled`:""}`):i(u,!0,`Connected: qBittorrent ${m.version}${m.savePath?`, default save path ${m.savePath}`:""}`)}catch(m){i(u,!1,m.message)}finally{d.disabled=!1}};e("tor-test-prowlarr").addEventListener("click",l=>c("prowlarr",l.currentTarget,e("tor-prowlarr-result"))),e("tor-test-qbt").addEventListener("click",l=>c("qbittorrent",l.currentTarget,e("tor-qbt-result"))),e("tor-save").addEventListener("click",async l=>{const d=l.currentTarget;d.disabled=!0;try{const{settings:u}=await g.saveTorrentSettings(r());e("tor-prowlarr-key").value=u.prowlarr.apiKey||"",e("tor-qbt-pass").value=u.qbittorrent.password||"",i(e("tor-save-result"),!0,"Saved"),p("Torrent settings saved","success")}catch(u){i(e("tor-save-result"),!1,u.message)}finally{d.disabled=!1}})}const Uo={mount:async e=>{const t=document.getElementById("app");t.innerHTML=`
            ${pe()}
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

                            <!-- Add more settings here as needed -->

                            <div class="settings-actions">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                            </div>
                        </div>
                    </form>

                    <div class="settings-group" id="anilist-group" style="display: none;">
                        <h2>AniList</h2>
                        <div id="anilist-status" class="setting-item">Loading…</div>
                        <div class="settings-actions">
                            <button id="anilist-connect" class="btn btn-primary" style="display: none;">Connect AniList</button>
                            <button id="anilist-sync" class="btn btn-secondary" style="display: none;">Sync from AniList</button>
                            <button id="anilist-disconnect" class="btn btn-secondary" style="display: none;">Disconnect</button>
                        </div>
                        <div id="anilist-sync-result"></div>
                    </div>

                    <div class="settings-group" id="slideshow-group">
                        <h2>Slideshow</h2>
                        <p class="settings-hint">Fullscreen slideshow of your volume covers. Pick which manga to include — only manga with volumes are listed.</p>
                        <div class="setting-item">
                            <label for="slideshow-interval">Slide duration</label>
                            <select id="slideshow-interval">
                                <option value="3000">3 seconds</option>
                                <option value="5000">5 seconds</option>
                                <option value="8000">8 seconds</option>
                                <option value="10000">10 seconds</option>
                                <option value="15000">15 seconds</option>
                                <option value="30000">30 seconds</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="slideshow-shuffle">Shuffle order</label>
                            <input type="checkbox" id="slideshow-shuffle">
                        </div>
                        <div class="setting-item">
                            <label for="slideshow-lists">Include gallery lists</label>
                            <input type="checkbox" id="slideshow-lists">
                        </div>
                        <div class="setting-item">
                            <label for="slideshow-trophies">Include trophy pages</label>
                            <input type="checkbox" id="slideshow-trophies">
                        </div>
                        <div id="slideshow-manga-list" class="slideshow-manga-list">
                            <div class="loader">Loading manga…</div>
                        </div>
                        <div class="settings-actions">
                            <button id="slideshow-start" class="btn btn-primary">${h("images")} Start Slideshow</button>
                        </div>
                    </div>

                    ${K.isAdmin?No():""}
                </div>
            </div>
        `;let s={};try{const S=await g.get("/settings")||{};s=S;const B=document.getElementById("settings-form"),D=document.getElementById("settings-loader");S.theme&&(document.getElementById("theme").value=S.theme),D.style.display="none",B.style.display="",B.addEventListener("submit",async k=>{k.preventDefault();const q=new FormData(B),U={};for(const[b,$]of q.entries())U[b]=$;try{await g.post("/settings/bulk",U),p("Settings saved successfully"),U.theme}catch(b){console.error(b),p("Failed to save settings","error")}})}catch(S){console.error(S),document.getElementById("settings-loader").textContent="Error loading settings"}window.location.hash.includes("anilist=connected")&&p("AniList connected");const a=document.getElementById("anilist-group"),n=document.getElementById("anilist-status"),r=document.getElementById("anilist-connect"),i=document.getElementById("anilist-sync"),c=document.getElementById("anilist-disconnect"),l=document.getElementById("anilist-sync-result"),d=async()=>{a.style.display="block";try{const S=await g.anilistStatus();S.configured?S.connected?(n.textContent=`Connected as ${S.anilistUsername||"AniList user"}.`,r.style.display="none",i.style.display="",c.style.display=""):(n.textContent="Not connected. Link your AniList account to sync reading progress.",r.style.display="",i.style.display="none",c.style.display="none"):(n.textContent="Not configured — set ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET in .env and restart the server.",r.style.display="none",i.style.display="none",c.style.display="none")}catch(S){console.error(S),n.textContent="Failed to load AniList status — is the server running the latest code?"}};r.addEventListener("click",async()=>{try{const{url:S}=await g.anilistAuthUrl();window.location.href=S}catch(S){p(S.message||"Failed to start AniList connection","error")}}),c.addEventListener("click",async()=>{try{await g.anilistDisconnect(),p("AniList disconnected"),d()}catch{p("Failed to disconnect","error")}}),i.addEventListener("click",async()=>{i.disabled=!0,n.textContent="Syncing from AniList…";try{const S=await g.anilistPull();S.updated.length===0?l.textContent="Everything already up to date.":l.innerHTML="<ul>"+S.updated.map(B=>`<li>${B.title} — marked read up to chapter ${B.markedUpTo}</li>`).join("")+"</ul>",p(`AniList sync: ${S.updated.length} manga updated`)}catch(S){l.textContent="",p(S.message||"AniList sync failed","error")}finally{i.disabled=!1,d()}}),d(),K.isAdmin&&Oo();const u={...Fo,...s.slideshow||{}};u.disabledMangaIds=[...u.disabledMangaIds||[]];const m=document.getElementById("slideshow-interval"),f=document.getElementById("slideshow-shuffle"),w=document.getElementById("slideshow-lists"),x=document.getElementById("slideshow-trophies"),v=document.getElementById("slideshow-manga-list");m.value=String(u.intervalMs),m.value||(m.value="8000"),f.checked=!!u.shuffle,w.checked=!!u.includeLists,x.checked=!!u.includeTrophies;const L=async()=>{if(!K.isDemo)try{await g.post("/settings",{key:"slideshow",value:u})}catch(S){console.error(S),p("Failed to save slideshow settings","error")}};m.addEventListener("change",()=>{u.intervalMs=parseInt(m.value,10)||8e3,L()}),f.addEventListener("change",()=>{u.shuffle=f.checked,L()}),w.addEventListener("change",()=>{u.includeLists=w.checked,L()}),x.addEventListener("change",()=>{u.includeTrophies=x.checked,L()}),document.getElementById("slideshow-start").addEventListener("click",()=>{var S,B;(B=(S=document.documentElement).requestFullscreen)==null||B.call(S).catch(()=>{}),F.go("/slideshow")});try{const S=await g.getAllVolumes();if(S.length===0)v.innerHTML=`<p class="settings-hint">No manga with volumes yet — create volumes from a manga's page first.</p>`;else{const B=new Set(u.disabledMangaIds);v.innerHTML=S.map(D=>{const k=ps(D.alias||D.title),q=D.volumes.filter($=>$.cover).length,U=D.localCover?`/api/public/covers/${D.id}/${encodeURIComponent(D.localCover.split(/[/\\]/).pop())}`:D.cover,b=q===0;return`
                        <label class="slideshow-manga-row${b?" no-covers":""}" title="${b?"No volume covers yet":k}">
                            <input type="checkbox" data-manga-id="${D.id}" ${!B.has(D.id)&&!b?"checked":""} ${b?"disabled":""}>
                            <span class="slideshow-manga-thumb">${U?Te(U,k,{kind:"book"}):fe("book")}</span>
                            <span class="slideshow-manga-info">
                                <span class="slideshow-manga-name">${k}</span>
                                <span class="slideshow-manga-meta">${D.volumes.length} volume${D.volumes.length===1?"":"s"} · ${q} cover${q===1?"":"s"}</span>
                            </span>
                        </label>
                    `}).join(""),v.addEventListener("change",D=>{const k=D.target.closest("input[data-manga-id]");if(!k)return;const q=k.dataset.mangaId;k.checked?u.disabledMangaIds=u.disabledMangaIds.filter(U=>U!==q):u.disabledMangaIds.includes(q)||u.disabledMangaIds.push(q),L()})}}catch(S){console.error(S),v.innerHTML='<p class="settings-hint">Failed to load manga list.</p>'}}},Vo={mount:async e=>{const t=document.getElementById("app");if(!K.isAdmin){t.innerHTML=`
                ${pe()}
                <div class="container"><div class="empty-state">Admin access required.</div></div>
            `;return}t.innerHTML=`
            <div class="admin-container">
                <header class="admin-header">
                    <h1>Admin</h1>
                    <nav class="admin-tabs">
                        <button class="admin-tab active" data-section="users">Users</button>
                        <button class="admin-tab" data-section="demo">Demo Content</button>
                        <button class="admin-tab" data-section="database">Database</button>
                    </nav>
                </header>
                <section id="admin-section-users" class="admin-section"></section>
                <section id="admin-section-demo" class="admin-section" style="display:none"></section>
                <section id="admin-section-database" class="admin-section" style="display:none">
                    <div class="admin-layout">
                        <aside class="admin-sidebar" id="admin-sidebar">
                            <div class="loader">Loading tables...</div>
                        </aside>
                        <main class="admin-main" id="admin-main">
                            <div class="empty-state">Select a table to view data</div>
                        </main>
                    </div>
                </section>
            </div>
        `,document.querySelectorAll(".admin-tab").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(a=>a.classList.remove("active")),s.classList.add("active"),document.querySelectorAll(".admin-section").forEach(a=>a.style.display="none"),document.getElementById(`admin-section-${s.dataset.section}`).style.display=""})}),await Promise.all([kt(),Ho(),jo()])}};async function kt(){const e=document.getElementById("admin-section-users");try{const t=await g.listUsers();e.innerHTML=`
            <h2>Users</h2>
            <div class="table-responsive">
                <table class="data-table admin-users-table">
                    <thead>
                        <tr>
                            <th>Username</th><th>Role</th><th>Download</th><th>Edit</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${t.map(s=>{var a;return`
                            <tr data-user-id="${s.id}">
                                <td>${hs(s.username)}${s.id===((a=K.user)==null?void 0:a.id)?' <span class="badge">you</span>':""}</td>
                                <td>
                                    <select class="user-role">
                                        <option value="user" ${s.role==="user"?"selected":""}>user</option>
                                        <option value="admin" ${s.role==="admin"?"selected":""}>admin</option>
                                    </select>
                                </td>
                                <td><input type="checkbox" class="user-can-download" ${s.canDownload?"checked":""}></td>
                                <td><input type="checkbox" class="user-can-edit" ${s.canEdit?"checked":""}></td>
                                <td class="admin-user-actions">
                                    <button class="btn btn-secondary user-reset-pw">Reset password</button>
                                    <button class="btn btn-secondary danger user-delete">Delete</button>
                                </td>
                            </tr>
                        `}).join("")}
                    </tbody>
                </table>
            </div>

            <h3>Add user</h3>
            <form id="add-user-form" class="admin-add-user">
                <input type="text" id="new-username" placeholder="Username" autocomplete="off" required>
                <input type="password" id="new-password" placeholder="Password" autocomplete="new-password" required>
                <select id="new-role">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
                <label><input type="checkbox" id="new-can-download" checked> Download</label>
                <label><input type="checkbox" id="new-can-edit" checked> Edit</label>
                <button type="submit" class="btn btn-primary">Add</button>
            </form>
        `,e.querySelectorAll("tr[data-user-id]").forEach(s=>{const a=Number(s.dataset.userId),n=async()=>{try{await g.updateUser(a,{role:s.querySelector(".user-role").value,canDownload:s.querySelector(".user-can-download").checked,canEdit:s.querySelector(".user-can-edit").checked}),p("User updated","success")}catch(r){p(r.message,"error"),kt()}};s.querySelector(".user-role").addEventListener("change",n),s.querySelector(".user-can-download").addEventListener("change",n),s.querySelector(".user-can-edit").addEventListener("change",n),s.querySelector(".user-reset-pw").addEventListener("click",async()=>{const r=prompt("New password for this user:");if(r)try{await g.updateUser(a,{password:r}),p("Password reset","success")}catch(i){p(i.message,"error")}}),s.querySelector(".user-delete").addEventListener("click",async()=>{if(confirm("Delete this user?"))try{await g.deleteUser(a),p("User deleted","success"),kt()}catch(r){p(r.message,"error")}})}),document.getElementById("add-user-form").addEventListener("submit",async s=>{s.preventDefault();try{await g.createUser({username:document.getElementById("new-username").value.trim(),password:document.getElementById("new-password").value,role:document.getElementById("new-role").value,canDownload:document.getElementById("new-can-download").checked,canEdit:document.getElementById("new-can-edit").checked}),p("User created","success"),kt()}catch(a){p(a.message,"error")}})}catch(t){console.error(t),e.innerHTML='<div class="error">Failed to load users</div>'}}async function Ho(){const e=document.getElementById("admin-section-demo");try{const t=await g.getBookmarks();e.innerHTML=`
            <h2>Demo Content</h2>
            <p class="admin-demo-warning">
                Checked series are visible to <strong>anyone</strong> on the public demo page
                (<code>/demo.html</code>) — no login needed, covers included. Only downloaded
                chapters are readable there. Be deliberate about adult titles.
            </p>
            <input type="search" id="demo-filter" placeholder="Filter series..." class="admin-demo-filter">
            <ul class="admin-demo-list">
                ${t.map(s=>`
                    <li data-title="${hs((s.alias||s.title||"").toLowerCase())}">
                        <label>
                            <input type="checkbox" class="demo-toggle" data-id="${s.id}" ${s.isDemo?"checked":""}>
                            <span>${hs(s.alias||s.title)}</span>
                            <span class="badge">${s.downloadedCount||0} downloaded</span>
                        </label>
                    </li>
                `).join("")}
            </ul>
        `,e.querySelectorAll(".demo-toggle").forEach(s=>{s.addEventListener("change",async()=>{try{await g.toggleDemo(s.dataset.id,s.checked),p(s.checked?"Added to demo":"Removed from demo","success")}catch(a){s.checked=!s.checked,p(a.message,"error")}})}),document.getElementById("demo-filter").addEventListener("input",s=>{const a=s.target.value.toLowerCase();e.querySelectorAll(".admin-demo-list li").forEach(n=>{n.style.display=n.dataset.title.includes(a)?"":"none"})})}catch(t){console.error(t),e.innerHTML='<div class="error">Failed to load bookmarks</div>'}}function hs(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function jo(){try{const e=await g.get("/admin/tables"),t=document.getElementById("admin-sidebar");t.innerHTML=`
            <h3>Tables</h3>
            <ul class="table-list">
                ${e.tables.map(s=>`
                    <li>
                        <a href="#/admin/tables/${s.name}" class="table-link" data-table="${s.name}">
                            ${s.name} <span class="badge">${s.rowCount}</span>
                        </a>
                    </li>
                `).join("")}
            </ul>
        `,t.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;ms(n),t.querySelectorAll(".table-link").forEach(r=>r.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(e){console.error(e),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function ms(e,t=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${e}...</div>`;try{const i=await g.get(`/admin/tables/${e}?page=${t}&limit=50`);if(!i.rows||i.rows.length===0){s.innerHTML=`
                <h2>${e}</h2>
                <div class="empty-state">No records found</div>
            `;return}const c=Object.keys(i.rows[0]);s.innerHTML=`
            <div class="table-header">
                <h2>${e}</h2>
                <div class="table-actions">
                    <span class="page-info">
                        Page ${i.pagination.page+1} of ${i.pagination.totalPages} 
                        (${i.pagination.total} records)
                    </span>
                    <div class="pagination">
                        <button ${t===0?"disabled":""} id="prev-page">Previous</button>
                        <button ${!i.pagination.hasMore&&t>=i.pagination.totalPages-1?"disabled":""} id="next-page">Next</button>
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
                        ${i.rows.map(l=>`
                            <tr>
                                ${c.map(d=>{const u=l[d];let m=u;return u===null?m='<span class="null">NULL</span>':typeof u=="object"?m=JSON.stringify(u):String(u).length>100&&(m=String(u).substring(0,100)+"..."),`<td>${m}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>ms(e,t-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>ms(e,t+1))}catch(r){console.error(r),s.innerHTML=`<div class="error">Failed to load data for ${e}</div>`}}let ie={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function zo(e,t){let s=null;if(t.length>0){const n=t[0];if(n.imagePaths&&n.imagePaths.length>0){const r=n.imagePaths[0];let i;typeof r=="string"?i=r:r&&typeof r=="object"&&(i=r.filename||r.path||r.name||r.url,i&&i.includes("/")&&(i=i.split("/").pop()),i&&i.includes("\\")&&(i=i.split("\\").pop())),i&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(i)}`)}}const a=t.reduce((n,r)=>{var i;return n+(((i=r.imagePaths)==null?void 0:i.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${e}">
      <div class="manga-card-cover">
        ${s?Te(s,e,{kind:"folder"}):fe("folder")}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Qo(e){const t=ie.bookmarks.find(s=>s.id===e);return t?t.alias||t.title:e}function Wo(e){const t=ie.bookmarks.find(s=>s.id===e);if(t&&t.seriesId){const s=ie.series.find(a=>a.id===t.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function Go(e,t,s,a=!1){return`
    <div class="manga-card trophy-gallery-card" data-trophy-id="${e}" data-is-series="${a}">
      <div class="manga-card-cover">
        <div class="placeholder trophy-placeholder" data-icon="trophy"></div>
        <div class="manga-card-badges">
            <span class="badge badge-trophy">${h("trophy")} ${s}</span>
            ${a?'<span class="badge badge-series">Series</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function Ko(){const e={};console.log("Building trophy groups from:",ie.trophyPages);for(const t of Object.keys(ie.trophyPages)){const s=ie.trophyPages[t];let a=0;for(const[r,i]of Object.entries(s))a+=Object.keys(i).length;if(console.log(`Manga ${t}: ${a} trophies`),a===0)continue;const n=Wo(t);if(n)e[n.id]||(e[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),e[n.id].count+=a,e[n.id].mangaIds.push(t);else{const r=Qo(t);console.log(`No series for ${t}, using name: ${r}`),e[t]={name:r,isSeries:!1,count:a,mangaIds:[t]}}}return console.log("Trophy groups result:",e),e}function Mt(){if(ie.loading)return`
      ${pe("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:e,listOrder:t}=ie.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${ie.activeTab==="galleries"?"active":""}" data-tab="galleries">
        ${h("folder")} Galleries
      </button>
      <button class="tab-btn ${ie.activeTab==="trophies"?"active":""}" data-tab="trophies">
        ${h("trophy")} Trophies
      </button>
    </div>
  `;let a="";if(ie.activeTab==="galleries")t.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${t.map(r=>{const i=e&&e[r]||[];return zo(r,i)}).join("")}
        </div>
      `;else{const n=Ko(),r=Object.keys(n);r.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${r.map(c=>{const l=n[c];return Go(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${pe("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function Ha(){_e();const e=document.getElementById("app");e.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{ie.activeTab=s.dataset.tab,e.innerHTML=Mt(),Ha()})}),e.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;F.go(`/read/gallery/${encodeURIComponent(a)}`)})}),e.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?F.go(`/read/trophies/series-${a}/🏆`):F.go(`/read/trophies/${a}/🏆`)})})}async function Yo(){try{const[e,t,s,a]=await Promise.all([me.loadFavorites(),g.get("/trophy-pages"),me.loadBookmarks(),me.loadSeries()]);ie.favorites=e||{favorites:{},listOrder:[]},ie.trophyPages=t||{},ie.bookmarks=s||[],ie.series=a||[],ie.loading=!1}catch(e){console.error("Failed to load favorites:",e),p("Failed to load favorites","error"),ie.loading=!1}}async function Jo(){console.log("[Favorites] mount called"),ie.loading=!0;const e=document.getElementById("app");e.innerHTML=Mt(),await Yo(),console.log("[Favorites] Data loaded, rendering..."),e.innerHTML=Mt(),console.log("[Favorites] Calling setupListeners..."),Ha(),console.log("[Favorites] setupListeners complete")}function Xo(){}const Zo={mount:Jo,unmount:Xo,render:Mt},ei="site-assist-modal",ti="/assist",si=1,ai=2,ni=4,ri=8,Js=["left","middle","right"];let Ye=null;function je(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function tt(e){return(e.altKey?si:0)|(e.ctrlKey?ai:0)|(e.metaKey?ni:0)|(e.shiftKey?ri:0)}function ze(){if(!Ye)return;const{socket:e,modal:t,site:s,onKey:a}=Ye;Ye=null,document.removeEventListener("keydown",a,!0),document.removeEventListener("keyup",a,!0);try{e.emit("assist:stop",{site:s})}catch{}try{e.disconnect()}catch{}t.remove()}function Ot({site:e,url:t,reason:s,onSolved:a}={}){if(!e)return;if(!K.isAdmin){p("Only an admin can solve a site check for the scraper","error");return}ze();const n=document.createElement("div");n.id=ei,n.className="modal open site-assist-modal",n.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Solve ${je(e)}'s check here</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="site-assist-body">
                <p class="site-assist-intro">
                    ${s==="expired"?`${je(e)}'s verification cookies ran out, so its work is on hold.`:`${je(e)} wants a person to pass its check before the scraper may continue.`}
                    Below is the scraper's own browser on the server. Complete the check in it, the way you would
                    in your browser (drag, click, type). When ${je(e)} accepts it, the scraper keeps the cookies and
                    every waiting download or check resumes by itself.
                </p>
                <div class="site-assist-status" id="site-assist-status" data-status="connecting">Connecting…</div>
                <div class="site-assist-stage" id="site-assist-stage">
                    <canvas id="site-assist-canvas" width="1024" height="720" tabindex="0" aria-label="${je(e)} in the scraper's browser"></canvas>
                    <div class="site-assist-overlay" id="site-assist-overlay">Waiting for the first picture…</div>
                </div>
                <div class="site-assist-hint">
                    Click the picture first so your keyboard goes to it. Escape closes this window.
                    Not working? <a href="#" data-act="paste">Paste cookies from your own browser</a> instead,
                    or <a href="#" data-act="open">open ${je(e)}</a> yourself.
                </div>
            </div>
            <div class="site-assist-footer">
                <button type="button" class="btn btn-secondary" data-act="close">Close</button>
            </div>
        </div>
    `,document.body.appendChild(n);const r=n.querySelector("#site-assist-canvas"),i=r.getContext("2d"),c=n.querySelector("#site-assist-status"),l=n.querySelector("#site-assist-overlay"),d=(k,q)=>{c.dataset.status=k,c.textContent=q||""},u=ot(ti,{auth:{token:g.getToken()},reconnection:!0,reconnectionAttempts:3,reconnectionDelay:1e3});let m=!1,f=!1;const w=new Image;let x=null;w.onload=()=>{if((r.width!==w.naturalWidth||r.height!==w.naturalHeight)&&(r.width=w.naturalWidth,r.height=w.naturalHeight),i.drawImage(w,0,0),x){const k=x;x=null,w.src=k}},w.onerror=()=>{x=null},u.on("connect",()=>{d("connecting",`Opening ${e} in the scraper's browser…`),u.emit("assist:start",{site:e},k=>{(!k||!k.ok)&&(d("error",(k==null?void 0:k.error)||"The check could not be opened"),l.textContent=(k==null?void 0:k.error)||"The check could not be opened",l.hidden=!1)})}),u.on("connect_error",k=>{d("error",`Not connected: ${k.message}`),l.textContent=`Not connected: ${k.message}`,l.hidden=!1}),u.on("assist:state",k=>{!k||k.site!==e||(k.status==="streaming"&&(m=!0,l.hidden=!0),d(k.status,k.message),k.status==="solved"?(m=!1,p(`${e}: check passed, waiting work resumes`,"success"),typeof a=="function"&&a(),setTimeout(ze,2500)):k.status==="ended"?(m=!1,f=!0,l.textContent=k.message||"The window was closed.",l.hidden=!1,k.reason!=="solved"&&d("ended",k.message)):k.status==="error"&&(l.textContent=k.message,l.hidden=!1))}),u.on("assist:frame",k=>{if(!k||k.site!==e||f)return;const q=`data:image/jpeg;base64,${k.data}`;w.complete&&!x?w.src=q:x=q,m||(m=!0,l.hidden=!0)});const v=k=>{const q=r.getBoundingClientRect(),U=(k.clientX-q.left)*(r.width/q.width),b=(k.clientY-q.top)*(r.height/q.height);return{x:Math.round(U),y:Math.round(b)}},L=k=>{m&&!f&&u.emit("assist:input",{site:e,...k})};let S=null;const B=()=>{S&&(L(S),S=null)};r.addEventListener("pointerdown",k=>{k.preventDefault(),r.focus(),r.setPointerCapture(k.pointerId);const{x:q,y:U}=v(k);L({type:"mousedown",x:q,y:U,button:Js[k.button]||"left",buttons:k.buttons,clickCount:1,modifiers:tt(k)})}),r.addEventListener("pointermove",k=>{const{x:q,y:U}=v(k),b=!S;S={type:"mousemove",x:q,y:U,button:k.buttons&1?"left":k.buttons&2?"right":"none",buttons:k.buttons,modifiers:tt(k)},b&&requestAnimationFrame(B)}),r.addEventListener("pointerup",k=>{k.preventDefault(),B();const{x:q,y:U}=v(k);L({type:"mouseup",x:q,y:U,button:Js[k.button]||"left",buttons:k.buttons,clickCount:1,modifiers:tt(k)});try{r.releasePointerCapture(k.pointerId)}catch{}}),r.addEventListener("pointercancel",k=>{const{x:q,y:U}=v(k);L({type:"mouseup",x:q,y:U,button:"left",buttons:0,clickCount:1})}),r.addEventListener("wheel",k=>{k.preventDefault();const{x:q,y:U}=v(k);L({type:"wheel",x:q,y:U,deltaX:k.deltaX,deltaY:k.deltaY,modifiers:tt(k)})},{passive:!1}),r.addEventListener("contextmenu",k=>k.preventDefault());const D=k=>{if(!Ye||Ye.modal!==n)return;if(k.key==="Escape"){k.type==="keydown"&&ze();return}if(document.activeElement!==r)return;k.preventDefault(),k.stopPropagation();const q=k.key.length===1&&!k.ctrlKey&&!k.metaKey;L({type:k.type,key:k.key,code:k.code,keyCode:k.keyCode,text:q?k.key:void 0,modifiers:tt(k)})};document.addEventListener("keydown",D,!0),document.addEventListener("keyup",D,!0),n.querySelector(".modal-overlay").addEventListener("click",ze),n.querySelectorAll('[data-act="close"]').forEach(k=>k.addEventListener("click",ze)),n.querySelector('[data-act="paste"]').addEventListener("click",k=>{k.preventDefault(),ze(),Vt({site:e,url:t,stale:s==="expired"||s==="rejected"})}),n.querySelector('[data-act="open"]').addEventListener("click",k=>{k.preventDefault(),Ut(e,t)}),Ye={site:e,socket:u,modal:n,onKey:D},r.focus()}const ja="site-cookie-modal",Bs=new Set;function ue(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ut(e,t){window.open(t||`https://${e}/`,"_blank","noopener")}function We(){const e=document.getElementById(ja);e&&e.remove(),document.removeEventListener("keydown",za)}function za(e){e.key==="Escape"&&We()}function oi(e,t){var n;const s=((n=t.session)==null?void 0:n.cookieCount)??0,a=t.probe;return a&&a.ok?{kind:"ok",html:`<strong>${ue(e)} accepted the cookies.</strong> ${s} saved; downloads and checks that were
                   waiting for this site resume by themselves (see the <a href="#/queue">Task Queue</a>).`}:a&&!a.ok&&a.error?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but the server could not load ${ue(e)} to test them.</strong>
                   ${ue(a.error)}. Retry a download to find out whether they work.`}:a&&!a.ok?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but ${ue(e)} still shows its check to the server.</strong>
                   Usually one of: the check was done on a different network than the server (the cookie can be tied to the
                   IP address), or in a different browser than the identity filled in above. Complete the check again from a
                   device on the server's network, export the cookies right away, make sure the identity is that browser's,
                   and paste again.${a.error?`<br><small>${ue(a.error)}</small>`:""}`}:{kind:"ok",html:`<strong>Saved ${s} cookie${s===1?"":"s"}.</strong> The site could not be tested right now; retry your download to find out.`}}function Vt({site:e,url:t,stale:s=!1,onImported:a}={}){if(!e)return;if(!K.isAdmin){p("Only an admin can hand site cookies to the scraper","error");return}We();const n=navigator.userAgent||"",r=document.createElement("div");r.id=ja,r.className="modal open site-cookie-modal",r.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Hand ${ue(e)}'s cookies to the scraper</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="site-cookie-body">
                <div class="site-cookie-alt">
                    Easier: <button type="button" class="btn btn-sm btn-primary" data-act="assist">Solve it here</button>
                    passes the check inside the scraper's own browser, so nothing needs copying and the cookies fit
                    the scraper's identity and network. Use the steps below when that does not work.
                </div>
                <ol class="site-cookie-steps">
                    <li><button type="button" class="btn btn-sm btn-secondary" data-act="open">Open ${ue(e)}</button>
                        and complete its "verify you're human" check.
                        ${s?`If no puzzle appears, that browser is still trusted: export its cookies anyway (the site
                        may have renewed them), or clear the site's cookies in that browser to get the puzzle back.`:""}</li>
                    <li>Copy the cookies ${ue(e)} gave that browser, right after the check. Easiest: the
                        <strong>Cookie-Editor</strong> extension (Chrome, Edge, Firefox): open it on the ${ue(e)} tab,
                        choose <em>Export</em>, then <em>JSON</em> or <em>Header String</em>. A Netscape <code>cookies.txt</code>
                        export works too. (The browser console's <code>document.cookie</code> does not: it hides the cookie that matters.)</li>
                    <li>Paste them here and save. The server then loads ${ue(e)} once to see whether it is trusted.</li>
                </ol>
                <div class="form-group">
                    <label for="site-cookie-input">Cookies for ${ue(e)}</label>
                    <textarea id="site-cookie-input" rows="5" spellcheck="false" autocomplete="off" autocapitalize="off"
                        placeholder='[{"name": "...", "value": "..."}]   or   name=value; name2=value2'></textarea>
                </div>
                <div class="form-group site-cookie-ua">
                    <label for="site-cookie-ua">Identity (user agent) of the browser that completed the check</label>
                    <input type="text" id="site-cookie-ua" value="${ue(n)}" spellcheck="false" autocomplete="off">
                    <small>Prefilled with this browser's. Did the check on another device? Paste that browser's user agent
                        instead (search "what is my user agent" on it). Empty keeps the scraper's own identity.</small>
                </div>
                <div class="site-cookie-result" id="site-cookie-result" hidden></div>
            </div>
            <div class="site-cookie-footer">
                <button type="button" class="btn btn-secondary" data-act="close">Cancel</button>
                <button type="button" class="btn btn-primary" data-act="save">Save &amp; test</button>
            </div>
        </div>
    `,document.body.appendChild(r),document.addEventListener("keydown",za);const i=r.querySelector("#site-cookie-input"),c=r.querySelector("#site-cookie-ua"),l=r.querySelector("#site-cookie-result"),d=r.querySelector('[data-act="save"]'),u=(f,w)=>{l.className=`site-cookie-result ${f}`,l.innerHTML=w,l.hidden=!1};r.querySelector(".modal-overlay").addEventListener("click",We),r.querySelectorAll('[data-act="close"]').forEach(f=>f.addEventListener("click",We)),r.querySelector('[data-act="open"]').addEventListener("click",()=>Ut(e,t)),r.querySelector('[data-act="assist"]').addEventListener("click",()=>{We(),Ot({site:e,url:t,reason:s?"rejected":"check",onSolved:a})});let m=!1;d.addEventListener("click",async()=>{var w;if(m)return;const f=i.value.trim();if(!f){u("error","Paste the cookies first."),i.focus();return}m=!0,d.disabled=!0,d.textContent="Saving & testing…",l.hidden=!0;try{const x=await g.importSiteSession(e,f,c.value.trim()),{kind:v,html:L}=oi(e,x),S=x.ignored||{},B=[];S.foreign&&B.push(`${S.foreign} for other sites`),S.expired&&B.push(`${S.expired} already expired`),S.invalid&&B.push(`${S.invalid} unreadable`),u(v,L+(B.length?`<br><small>Skipped: ${B.join(", ")}.</small>`:"")),i.value="",typeof a=="function"&&a(x),(w=x.probe)!=null&&w.ok&&(p(`${e}: cookies accepted, checks resume`,"success"),setTimeout(We,2500))}catch(x){u("error",ue(x.message||"Import failed"))}finally{m=!1,d.disabled=!1,d.textContent="Save & test"}}),i.focus()}const Xs="site-challenge-banners",Ht=new Map;function ii(e){const t=`<strong>${ue(e.site)}</strong>`,s=" Its downloads and update checks wait in the queue and resume by themselves once the check is passed.";return e.reason==="expired"?`${t}'s verification cookies expired.${s}`:e.sessionStale?`${t} no longer accepts the cookies handed over earlier.${s}`:`${t} is asking for a human verification check.${s}`}function li(e){var n,r,i;const t=K.isAdmin,s=document.createElement("div");s.className="site-challenge-banner",s.dataset.site=e.site;const a=e.waiting?` <span class="site-challenge-waiting">${e.waiting} task${e.waiting===1?"":"s"} waiting</span>`:"";return s.innerHTML=`
        <div class="site-challenge-text">${ii(e)}${t?"":" Ask an admin to pass it."}${a}</div>
        <div class="site-challenge-actions">
            ${t?'<button class="btn btn-primary btn-sm" data-act="assist">Solve it here</button>':""}
            ${t?'<button class="btn btn-secondary btn-sm" data-act="import" title="Complete the check in your own browser and paste its cookies">Paste cookies</button>':`<button class="btn btn-primary btn-sm" data-act="open">Open ${ue(e.site)}</button>`}
            <button class="btn btn-secondary btn-sm" data-act="retry" title="Resume without solving. Only works if the site stopped asking.">Retry anyway</button>
            <button class="site-challenge-close" data-act="close" title="Hide">×</button>
        </div>
    `,(n=s.querySelector('[data-act="assist"]'))==null||n.addEventListener("click",()=>{Ot({site:e.site,url:e.url,reason:e.reason||(e.sessionStale?"rejected":"check")})}),(r=s.querySelector('[data-act="open"]'))==null||r.addEventListener("click",()=>Ut(e.site,e.url)),(i=s.querySelector('[data-act="import"]'))==null||i.addEventListener("click",()=>{Vt({site:e.site,url:e.url,stale:!!e.sessionStale||e.reason==="expired"})}),s.querySelector('[data-act="retry"]').addEventListener("click",async()=>{try{await g.clearSiteChallenge(e.site),p(`${e.site}: waiting work resumes. If the puzzle comes back, solve it instead.`,"info")}catch(c){p("Failed: "+c.message,"error")}Ht.delete(e.site),Tt()}),s.querySelector('[data-act="close"]').addEventListener("click",()=>{Bs.add(e.site),Tt()}),s}function Tt(){let e=document.getElementById(Xs);const t=[...Ht.values()].filter(s=>!Bs.has(s.site));if(t.length===0){e&&e.remove();return}e||(e=document.createElement("div"),e.id=Xs,e.className="site-challenge-banners",document.body.appendChild(e)),e.replaceChildren(...t.map(li))}function Zs(e){!e||!e.site||(Ht.set(e.site,e),Tt())}function ci(e){Ht.delete(e),Tt()}async function Oi(){Z.on("site:challenge",e=>{Bs.delete(e.site),Zs(e)}),Z.on("site:challenge-cleared",({site:e})=>ci(e));try{const e=await g.getSiteStatus();for(const t of e.challenges||[])Zs(t)}catch{}}let j={downloads:{},torrents:[],queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,showEmptyChecks:!1,collapsed:{torrents:!1,active:!1,scheduled:!1,completed:!1,history:!0}},$t=null,ce={};function As(e){if(!e)return"Never";const t=Date.now()-new Date(e).getTime(),s=Math.floor(t/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function di(e){if(!e)return"Not scheduled";const t=new Date(e).getTime()-Date.now();if(t<=0)return"Running now...";const s=Math.floor(t/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const r=Math.floor(a/24),i=a%24;return`in ${r}d ${i}h`}function Qa(e){switch(e){case"download":return h("download");case"scrape":return h("search");case"scan":return h("folder");default:return h("settings")}}function Ms(e){switch(e){case"running":return"var(--color-success)";case"queued":case"pending":case"waiting":return"var(--color-warning)";case"paused":return"var(--color-info)";case"complete":return"var(--color-success)";case"error":case"failed":case"cancelled":return"var(--color-error)";default:return"var(--text-secondary)"}}function Ts(e){switch(e){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"waiting":return"⏳ Waiting for site";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return e}}function ui(e){return!e||e==="default"?"Default (6h)":e==="daily"?"Daily":e==="weekly"?"Weekly":e}function pi(){const e=j.autoCheck;return e?`
    <div class="queue-inline-header">
      <span class="text-muted">${e.enabledCount} monitored · Last: ${As(e.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">${h("play")} Run All Now</button>
    </div>
  `:""}function hi(e){const t=e.nextCheck?di(e.nextCheck):"Not set",s=e.nextCheck&&new Date(e.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${e.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${h("book-open")}</span>
          <div>
            <div class="task-title">${e.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${ui(e.schedule)}${e.schedule==="weekly"&&e.day?` · ${e.day.charAt(0).toUpperCase()+e.day.slice(1)}`:""}${(e.schedule==="daily"||e.schedule==="weekly")&&e.time?` · ${e.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?`${h("alarm-clock")} Due now`:t}</span>
        </div>
      </div>
    </div>
  `}function be(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function mi(e){const t=e.challenge||{},s=be(e.waitingFor||t.site||e.site||"the site"),a=be(t.url||`https://${e.waitingFor||t.site||e.site}/`),n=K.isAdmin,r=t.reason||(t.sessionStale?"rejected":"check");return`
    <div class="task-challenge task-waiting">
      <span>${r==="expired"?`${s}'s verification cookies expired. Solve its check again; this download continues where it stopped.`:t.sessionStale?`${s} no longer accepts the saved cookies. Solve its check again; this download continues where it stopped.`:`${s} wants a human verification check. Once it is passed, this download continues where it stopped.`}${n?"":" (An admin has to pass it.)"}</span>
      ${n?`<button class="btn btn-sm btn-primary" data-action="solve" data-site="${s}" data-url="${a}" data-reason="${r}">Solve it here</button>`:""}
      ${n?`<button class="btn btn-sm btn-secondary" data-action="import-cookies" data-site="${s}" data-url="${a}" data-stale="${t.sessionStale||r==="expired"?"1":""}">Paste cookies</button>`:`<button class="btn btn-sm btn-secondary" data-action="open-site" data-site="${s}" data-url="${a}">Open ${s}</button>`}
    </div>`}function ea(e,t){const s=t.total>0?Math.round(t.completed/t.total*100):0,a=t.status==="waiting",n=t.status==="running"||t.status==="queued"||a,r=t.status==="paused",i=(t.errors||[]).filter(d=>!d.waiting),c=i.length>0,l=!n&&!r&&c&&(t.chapterUrls||[]).length>0;return`
    <div class="queue-card task-card" data-task-id="${e}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${h("download")}</span>
          <div>
            <div class="task-title">${t.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${Ms(t.status)}">${Ts(t.status)}</div>
          </div>
        </div>
        <div class="task-actions">
          ${n&&!a?`<button class="btn btn-sm btn-icon" data-action="pause" data-task="${e}" title="Pause">${h("pause",{title:"Pause"})}</button>`:""}
          ${r?`<button class="btn btn-sm btn-icon" data-action="resume" data-task="${e}" title="Resume">${h("play",{title:"Resume"})}</button>`:""}
          ${n||r?`<button class="btn btn-sm btn-icon btn-danger" data-action="cancel" data-task="${e}" title="Cancel">✕</button>`:""}
        </div>
      </div>
      <div class="queue-card-body">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${s}%"></div>
          <span class="progress-text">${t.completed} / ${t.total} chapters (${s}%)</span>
        </div>
        ${t.current?`<div class="task-current">Currently: Chapter ${t.current}</div>`:""}
        ${c?`
          <div class="task-errors">${h("triangle-alert")} ${i.length} error(s)</div>
          <ul class="task-error-list">${i.slice(0,5).map(d=>`<li>${typeof d.chapter=="number"?`Ch. ${d.chapter}: `:""}${be(d.error)}</li>`).join("")}</ul>`:""}
        ${a?mi(t):l?`
          <div class="task-challenge">
            <button class="btn btn-sm btn-secondary" data-action="retry" data-task="${e}">Retry failed chapters</button>
          </div>`:""}
      </div>
    </div>
  `}function gi(e){switch(e.status){case"downloading":return/paused|stopped/i.test(e.state||"")?"Paused":/queued|metaDL|checking/i.test(e.state||"")?"Waiting":"Downloading";case"grabbing":return"Fetching the release for qBittorrent";case"completed":return e.autoImport?"Downloaded, importing soon":"Downloaded";case"importing":return"Importing";case"imported":return"Imported";case"failed":return"Failed";case"removed":return"Removed from qBittorrent";default:return e.status}}function fi(e){return e.status==="imported"?"var(--success)":e.status==="failed"||e.status==="removed"?"var(--error)":e.status==="importing"||e.status==="completed"||e.status==="grabbing"?"var(--warning)":"var(--text-secondary)"}function vi(e){return!e||e<=0||e>=864e4?"":e<60?`${e}s`:e<3600?`${Math.round(e/60)}m`:`${Math.floor(e/3600)}h ${Math.round(e%3600/60)}m`}function yi(e){var d,u,m,f;const t=Math.round((e.progress||0)*100),s=e.status==="downloading",a=s&&/paused|stopped/i.test(e.state||""),n=["completed","failed","imported"].includes(e.status)&&(e.progress||0)>=1,r=e.bookmarkId?`<a href="#/manga/${be(e.bookmarkId)}">open series</a>`:e.newSeriesTitle?`new series “${be(e.newSeriesTitle)}”`:"",i=e.importResult,c=i?[(d=i.volumes)!=null&&d.length?`${i.volumes.length} volume${i.volumes.length===1?"":"s"} (${i.volumes.map(w=>w.name).join(", ")})`:"",(u=i.chapters)!=null&&u.length?`${i.chapters.length} chapter${i.chapters.length===1?"":"s"}`:"",(m=i.skipped)!=null&&m.length?`${i.skipped.length} skipped`:""].filter(Boolean).join(" · "):"",l=[ds(e.size),s&&e.dlspeed?`${ds(e.dlspeed)}/s`:"",s?vi(e.eta):"",e.indexer||""].filter(Boolean).join(" · ");return`
    <div class="queue-card task-card torrent-card" data-hash="${be(e.hash)}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${h("download")}</span>
          <div>
            <div class="task-title" title="${be(e.releaseTitle||e.name)}">${be(e.name||e.releaseTitle)}</div>
            <div class="task-status" style="color: ${fi(e)}">${gi(e)}${r?` · ${r}`:""}</div>
          </div>
        </div>
        <div class="task-actions">
          ${s&&!a?`<button class="btn btn-sm btn-icon" data-taction="pause" title="Pause">${h("pause",{title:"Pause"})}</button>`:""}
          ${a?`<button class="btn btn-sm btn-icon" data-taction="resume" title="Resume">${h("play",{title:"Resume"})}</button>`:""}
          ${n?`<button class="btn btn-sm btn-secondary" data-taction="import" title="${e.status==="imported"?"Import the files again (replaces the volumes)":"Import into the library now"}">${e.status==="failed"?"Retry import":e.status==="imported"?"Import again":"Import now"}</button>`:""}
          <button class="btn btn-sm btn-icon btn-danger" data-taction="remove" title="${["imported","grabbing"].includes(e.status)?"Remove from this list":"Remove from qBittorrent and this list"}">✕</button>
        </div>
      </div>
      <div class="queue-card-body">
        ${["imported","grabbing"].includes(e.status)?`<div class="task-current">${l}</div>`:`
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${t}%"></div>
          <span class="progress-text">${t}%${l?` · ${l}`:""}</span>
        </div>`}
        ${c?`<div class="task-current">${h("check")} ${be(c)}</div>`:""}
        ${(f=i==null?void 0:i.skipped)!=null&&f.length?`<ul class="task-error-list">${i.skipped.slice(0,4).map(w=>`<li>${be(w)}</li>`).join("")}</ul>`:""}
        ${e.error?`<div class="task-errors">${h("triangle-alert")} ${be(e.error)}</div>`:""}
      </div>
    </div>
  `}function bi(e){const t=e.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Qa(e.type)}</span>
          <div>
            <div class="task-title">${t.description||t.mangaTitle||e.type}</div>
            <div class="task-status" style="color: ${Ms(e.status)}">${Ts(e.status)}</div>
          </div>
        </div>
      </div>
      ${e.status==="waiting"&&e.error?`<div class="queue-card-body"><div class="task-challenge task-waiting"><span>${be(e.error)}</span></div></div>`:e.started_at?`<div class="queue-card-body"><small>Started: ${As(e.started_at)}</small></div>`:""}
    </div>
  `}function wi(e){const t=e.data||{},s=e.result||{};let a="";if(e.type==="scrape")s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${e.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>');else if(e.type==="scan"||e.type==="scan-local")s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`);else if(e.type==="download"){if(e.status==="failed"&&e.error)a=`<div class="task-subtext" style="color: var(--color-error, #e05555);">${e.error}</div>`;else if(s.downloaded!==void 0){const n=[`${s.downloaded} chapter${s.downloaded===1?"":"s"} downloaded`];s.pages&&n.push(`${s.pages} pages`),s.failed&&n.push(`${s.failed} failed`);const r=(s.errors||[]).filter(i=>i.partial);r.length&&n.push(`${r.length} with missing pages`),a=`<div class="task-subtext" style="color: var(--text-secondary);">${n.join(" · ")}</div>`}}return`
    <div class="queue-card task-card history-card" data-history-id="${e.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Qa(e.type)}</span>
          <div>
            <div class="task-title">${t.description||t.mangaTitle||e.type}</div>
            <div class="task-status" style="color: ${Ms(e.status)}">${Ts(e.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${e.completed_at?`<div class="queue-card-body"><small>Completed: ${As(e.completed_at)}</small></div>`:""}
    </div>
  `}function ki(){var l;const e=Object.entries(j.downloads),t=e.filter(([,d])=>d.status!=="complete"),s=e.filter(([,d])=>d.status==="complete"),a=new Set(t.map(([,d])=>d.bookmarkId).filter(Boolean)),n=j.queueTasks.filter(d=>{var u;return!(d.type==="download"&&((u=d.data)!=null&&u.mangaId)&&a.has(d.data.mangaId))}),r=j.torrents.filter(d=>["downloading","completed","importing"].includes(d.status)),i=t.length+n.length+r.length,c=((l=j.autoCheck)==null?void 0:l.schedules)||[];return`
    ${pe("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>${h("list-checks")} Task Queue</h2>
        ${i>0?`<span class="queue-badge">${i} active</span>`:""}
      </div>

      ${j.torrents.length>0?`
        <div class="queue-section ${j.collapsed.torrents?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="torrents">
            <span class="collapse-icon">▼</span> Torrents (${r.length} active)
          </h3>
          <div class="queue-section-content">
            ${j.torrents.map(yi).join("")}
          </div>
        </div>
      `:""}

      ${t.length>0||n.length>0?`
        <div class="queue-section ${j.collapsed.active?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${t.map(([d,u])=>ea(d,u)).join("")}
            ${n.map(d=>bi(d)).join("")}
          </div>
        </div>
      `:""}

      ${c.length>0?`
        <div class="queue-section ${j.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${c.length})
            </h3>
            ${pi()}
          </div>
          <div class="queue-section-content">
            ${c.map(d=>hi(d)).join("")}
          </div>
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section ${j.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${s.map(([d,u])=>ea(d,u)).join("")}
          </div>
        </div>
      `:""}

      ${j.historyTasks&&j.historyTasks.length>0?(()=>{const d=f=>{if(f.type!=="scrape")return!1;const w=f.result||{};return(f.status==="complete"||f.status==="completed")&&(w.newChaptersCount===0||w.updated===!1)},u=j.historyTasks.filter(d).length,m=j.showEmptyChecks?j.historyTasks:j.historyTasks.filter(f=>!d(f));return`
        <div class="queue-section ${j.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${u>0?`
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${j.showEmptyChecks?"Hide":"Show"} checks with no new chapters">
                    ${j.showEmptyChecks?`${h("chevron-up")} Hide`:`${h("chevron-down")} Show`} empty checks (${u})
                  </button>
                `:""}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  ${h("trash-2")} Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${m.length>0?m.map(f=>wi(f)).join(""):`
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${u>0?`${u} empty check(s) hidden.`:""}</p>
                  </div>
                `}
            </div>
        </div>
      `})():""}

      ${t.length===0&&n.length===0&&s.length===0&&c.length===0&&(!j.historyTasks||j.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">${h("check")}</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function Ae(){try{const[e,t,s,a,n]=await Promise.all([g.getDownloads().catch(()=>({})),g.getQueueTasks().catch(()=>[]),g.getQueueHistory(50).catch(()=>[]),g.getAutoCheckStatus().catch(()=>null),g.getTorrentDownloads().catch(()=>({torrents:[]}))]);j.downloads=e||{},j.torrents=(n==null?void 0:n.torrents)||[],j.queueTasks=t||[],j.historyTasks=s||[],j.autoCheck=a,j.loading=!1}catch(e){console.error("[Queue] Failed to load data:",e),j.loading=!1}}function ge(){const e=document.getElementById("app");e&&(e.innerHTML=ki(),$i())}function $i(){_e(),document.querySelectorAll("[data-toggle]").forEach(a=>{a.addEventListener("click",n=>{const r=a.dataset.toggle;j.collapsed[r]=!j.collapsed[r],ge()})});const e=document.getElementById("run-autocheck-btn");e&&e.addEventListener("click",async()=>{e.disabled=!0,e.innerHTML=`${h("loader",{spin:!0})} Running...`;try{p("Auto-check started...","info");const a=await g.runAutoCheck();p(`Check complete: ${a.checked} checked, ${a.updated} updated`,"success"),await Ae(),ge()}catch(a){p("Auto-check failed: "+a.message,"error"),e.disabled=!1,e.innerHTML=`${h("play")} Run Now`}});const t=document.getElementById("clear-history-btn");t&&t.addEventListener("click",async a=>{if(a.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await g.clearQueueHistory(),p("History cleared","success"),await Ae(),ge()}catch(n){p(`Failed to clear history: ${n.message}`,"error")}});const s=document.getElementById("toggle-empty-checks-btn");s&&s.addEventListener("click",a=>{a.stopPropagation(),j.showEmptyChecks=!j.showEmptyChecks,ge()}),document.querySelectorAll(".scheduled-manga-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.mangaId;n&&(window.location.hash=`#/manga/${n}`)})}),document.querySelectorAll(".torrent-card [data-taction]").forEach(a=>{a.addEventListener("click",async n=>{var l,d,u,m;n.stopPropagation();const r=a.closest(".torrent-card").dataset.hash,i=j.torrents.find(f=>f.hash===r),c=a.dataset.taction;try{if(c==="pause")await g.pauseTorrent(r);else if(c==="resume")await g.resumeTorrent(r);else if(c==="import"){a.disabled=!0,a.textContent="Importing…";const f=await g.importTorrent(r),w=((d=(l=f.summary)==null?void 0:l.volumes)==null?void 0:d.length)||0,x=((m=(u=f.summary)==null?void 0:u.chapters)==null?void 0:m.length)||0;p(`Imported ${w} volume${w===1?"":"s"}${x?` and ${x} chapter${x===1?"":"s"}`:""}`,"success")}else if(c==="remove"){const f=i&&["imported","removed"].includes(i.status);if(!f&&!confirm(`Remove "${(i==null?void 0:i.name)||"this torrent"}" from qBittorrent and stop tracking it?`))return;const w=!f&&confirm("Also delete its downloaded files from disk?");await g.removeTorrent(r,{deleteFiles:w,fromClient:!f}),p("Torrent removed","info")}await Ae(),ge()}catch(f){p(`Action failed: ${f.message}`,"error"),await Ae(),ge()}})}),document.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const r=a.dataset.action,i=a.dataset.task;if(r==="open-site"){Ut(a.dataset.site,a.dataset.url);return}if(r==="import-cookies"){Vt({site:a.dataset.site,url:a.dataset.url,stale:a.dataset.stale==="1"});return}if(r==="solve"){Ot({site:a.dataset.site,url:a.dataset.url,reason:a.dataset.reason});return}try{if(r==="pause")await g.pauseDownload(i),p("Download paused","info");else if(r==="resume")await g.resumeDownload(i),p("Download resumed","info");else if(r==="cancel")confirm("Cancel this download?")&&(await g.cancelDownload(i),p("Download cancelled","info"));else if(r==="retry"){const c=await g.retryDownload(i);p(`Retrying ${c.chapters.length} chapter${c.chapters.length===1?"":"s"}`,"info")}await Ae(),ge()}catch(c){p(`Action failed: ${c.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.historyId,r=document.getElementById(`task-details-${n}`);r&&r.classList.toggle("hidden")})})}async function Ei(){j.loading=!0;const e=document.getElementById("app");e.innerHTML=`
    ${pe("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>${h("list-checks")} Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,_e(),await Ae(),ge(),$t=setInterval(async()=>{await Ae(),ge()},5e3),ce.downloadProgress=t=>{t.taskId&&j.downloads[t.taskId]&&(Object.assign(j.downloads[t.taskId],t),ge())},ce.downloadCompleted=t=>{Ae().then(ge)},ce.queueUpdated=t=>{Ae().then(ge)},ce.torrentUpdate=t=>{Array.isArray(t==null?void 0:t.torrents)&&(j.torrents=t.torrents,ge())},Z.on(ne.DOWNLOAD_PROGRESS,ce.downloadProgress),Z.on(ne.DOWNLOAD_COMPLETED,ce.downloadCompleted),Z.on(ne.QUEUE_UPDATED,ce.queueUpdated),Z.on(ne.TORRENT_UPDATE,ce.torrentUpdate)}function Ci(){$t&&(clearInterval($t),$t=null),ce.downloadProgress&&Z.off(ne.DOWNLOAD_PROGRESS,ce.downloadProgress),ce.downloadCompleted&&Z.off(ne.DOWNLOAD_COMPLETED,ce.downloadCompleted),ce.queueUpdated&&Z.off(ne.QUEUE_UPDATED,ce.queueUpdated),ce.torrentUpdate&&Z.off(ne.TORRENT_UPDATE,ce.torrentUpdate),ce={}}const Si={mount:Ei,unmount:Ci};function ve(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function xi(e){if(!e)return"";const t=Math.floor((Date.now()-new Date(e).getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t}m ago`;const s=Math.floor(t/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}class Li{constructor(){this.container=null,this.scrapers=[],this.siteStatus={challenges:[],sessions:[]},this.onSiteStatusChange=null,this.currentQuery="",this.currentTarget="all",this.isSearching=!1,this.results=[],this.viewMode="main",this.browseScraper=null,this.browseQuery="",this.browseSort="popular",this.browsePage=1,this.browseTotalPages=1,this.isBrowsing=!1,this.browseResults=[],this.previewInfo=null,this.previewImages=[],this.previewIndex=0,this.infoAbortController=null}async mount(t){this.container=document.getElementById("app"),document.body.className="scrapers-mode";const s=new URLSearchParams(window.location.hash.split("?")[1]||""),a=s.get("browse"),n=s.get("q");a&&(this.browseScraper=a,this.viewMode="browse",this.browseQuery=n||"",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1),this.updateView(),this.onSiteStatusChange=()=>this.loadSiteStatus(),Z.on(ne.SITE_SESSION,this.onSiteStatusChange),Z.on(ne.SITE_CHALLENGE,this.onSiteStatusChange),Z.on(ne.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),await this.loadScrapers(),this.viewMode==="browse"&&this.browseScraper?(a&&(this.startBrowse(a,{query:n||null}),this.updateView()),this.performBrowse()):n&&(this.currentQuery=n,this.updateView(),this.performSearch())}unmount(){this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.onSiteStatusChange&&(Z.off(ne.SITE_SESSION,this.onSiteStatusChange),Z.off(ne.SITE_CHALLENGE,this.onSiteStatusChange),Z.off(ne.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),this.onSiteStatusChange=null),this.container.innerHTML="",document.body.className=""}async loadScrapers(){try{const[t,s]=await Promise.all([g.get("/scrapers/list"),g.getSiteStatus().catch(()=>({challenges:[],sessions:[]}))]);this.siteStatus=s||{challenges:[],sessions:[]},t.success&&(this.scrapers=t.scrapers,this.updateView())}catch(t){console.error("Failed to load scrapers",t)}}async loadSiteStatus(){try{this.siteStatus=await g.getSiteStatus()}catch{return}document.getElementById("scraper-cards-list")&&(this.renderScraperList(),this.bindCardEvents())}sessionFor(t){return(this.siteStatus.sessions||[]).find(s=>s.site===t)||null}browseConfig(t=this.browseScraper){const s=this.scrapers.find(n=>n.name===t),a=s&&s.browseOptions;return{sorts:a&&a.sorts&&a.sorts.length?a.sorts:[{value:"popular",label:"Popular"}],defaultSort:a&&a.defaultSort||"popular",defaultQuery:a&&a.defaultQuery||"",queryLabel:a&&a.queryLabel||"Search",queryPlaceholder:a&&a.queryPlaceholder||"Optional: title to search for"}}startBrowse(t,{query:s=null,sort:a=null}={}){const n=this.browseConfig(t);this.browseScraper=t,this.viewMode="browse",this.browseQuery=s??n.defaultQuery,this.browseSort=a&&n.sorts.some(r=>r.value===a)?a:n.defaultSort,this.browsePage=1,this.browseResults=[],this.browseTotalPages=1}challengeFor(t){return(this.siteStatus.challenges||[]).find(s=>s.site===t)||null}renderSessionRow(t){if(!t.supportsSession)return"";const s=this.sessionFor(t.name),a=this.challengeFor(t.name);let n;if(s&&s.stale)n=`<span class="capability-pill capability-soon" title="${ve(s.staleReason||"The site showed its check again")}">${h("triangle-alert")} Rejected, solve again</span>`;else if(s&&s.cookieCount===0)n=`<span class="capability-pill capability-soon" title="Every saved cookie has expired">${h("triangle-alert")} Expired, solve again</span>`;else if(s){const r=xi(s.updatedAt||s.importedAt),i=K.isAdmin?`${(s.cookieNames||[]).join(", ")}${s.userAgent?`
${s.userAgent}`:""}`:"";n=`<span class="capability-pill capability-yes" title="${ve(i)}">✓ ${s.cookieCount} cookie${s.cookieCount===1?"":"s"}${r?` · ${r}`:""}</span>`}else a?n=`<span class="capability-pill capability-soon">${h("triangle-alert")} Check pending</span>`:n='<span class="capability-pill capability-no">None</span>';return`
      <div class="capability-row">
        <span class="capability-label" title="Cookies from a browser that completed the site's human check">${h("lock-open")} Session</span>
        <span class="scraper-session-cell">
          ${n}
          ${s&&K.isAdmin?`<button type="button" class="scraper-session-forget" data-scraper="${ve(t.name)}" title="Forget these cookies">Forget</button>`:""}
        </span>
      </div>`}bindCardEvents(){document.querySelectorAll(".scraper-search-card-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper;this.currentTarget=a;const n=document.getElementById("scraper-query");n&&(this.currentQuery=n.value.trim()),this.updateView();const r=document.getElementById("scraper-query");r&&(r.focus(),window.scrollTo({top:0,behavior:"smooth"}),this.currentQuery&&this.performSearch())})}),document.querySelectorAll(".scraper-browse-card-btn").forEach(t=>{t.addEventListener("click",s=>{this.startBrowse(s.currentTarget.dataset.scraper),this.updateView(),this.performBrowse()})}),document.querySelectorAll(".scraper-session-card-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper,n=this.challengeFor(a),r=this.sessionFor(a),i=!!r&&(r.stale||r.cookieCount===0);Vt({site:a,url:n==null?void 0:n.url,stale:i,onImported:()=>this.loadSiteStatus()})})}),document.querySelectorAll(".scraper-session-solve-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper,n=this.challengeFor(a),r=this.sessionFor(a),i=(n==null?void 0:n.reason)||(r&&(r.stale||r.cookieCount===0)?"rejected":"check");Ot({site:a,url:n==null?void 0:n.url,reason:i,onSolved:()=>this.loadSiteStatus()})})}),document.querySelectorAll(".scraper-session-forget").forEach(t=>{t.addEventListener("click",async s=>{const a=s.currentTarget.dataset.scraper;if(confirm(`Forget the saved ${a} cookies? The scraper goes back to its own identity.`))try{(await g.forgetSiteSession(a)).purged===null?p(`${a}: cookies forgotten, but they may stay in the scraper browser until it restarts`,"warning"):p(`${a}: saved cookies forgotten`,"info"),await this.loadSiteStatus()}catch(n){p(`Failed: ${n.message}`,"error")}})})}updateView(){this.render(),this.renderScraperList(),(this.results.length>0||this.isSearching)&&this.renderResults(),this.bindEvents()}render(){this.container.innerHTML=`
      ${pe()}
      <div class="view-container scrapers-container" style="${this.viewMode==="main"?"":"display: none;"}">
        <div class="view-header">
          <h1>${h("plug")} Scrapers</h1>
          <p class="subtitle">All available manga scrapers and their capabilities.</p>
        </div>

        <div class="scrapers-section scrapers-search-section">
          <div class="scraper-search-box">
            <form id="scraper-search-form" class="search-form">
              ${this.currentTarget!=="all"?`
                <div class="search-target-badge">
                  <span class="search-target-pill">
                    Searching: ${this.currentTarget}
                    <button type="button" id="clear-target-btn" class="search-target-clear">×</button>
                  </span>
                </div>
              `:""}
              <div class="search-row">
                <input type="text" id="scraper-query" placeholder="Enter manga title to search${this.currentTarget!=="all"?` in ${this.currentTarget}`:" all sites"}..." value="${this.currentQuery}" required>
                <button type="submit" class="btn btn-primary" id="scraper-search-btn">Search</button>
                ${K.canDownload?`<button type="button" class="btn btn-secondary" id="torrent-search-btn" title="Search the torrent indexers (Prowlarr) for volume releases">${h("package")} Volumes</button>`:""}
              </div>
            </form>
          </div>

          <div id="scraper-results-container" class="scraper-results${this.results.length>0||this.isSearching?"":" scraper-results--hidden"}">
             <div class="empty-state">
               <div class="empty-icon">${h("search-x")}</div>
               <p>Type a title above to search across available scrapers.</p>
             </div>
          </div>
        </div>

        <div id="scrapers-list-section" class="scrapers-section">
          <div class="scrapers-section-header">
            <h2>Available Scrapers</h2>
            <div class="scrapers-legend">
              <div class="legend-item">
                <span class="capability-pill capability-yes">✓</span>
                <span>Supported</span>
              </div>
              <div class="legend-item">
                <span class="capability-pill capability-no">✗</span>
                <span>Not available</span>
              </div>
              <div class="legend-item">
                <span class="capability-pill capability-soon">Soon</span>
                <span>Coming soon</span>
              </div>
            </div>
          </div>
          <div id="scraper-cards-list" class="scraper-cards-grid">
            <div class="loading-state"><div class="spinner"></div><p>Loading scrapers...</p></div>
          </div>
        </div>
      </div>

      <!-- BROWSE VIEW -->
      <div id="browse-container" class="view-container scrapers-container${this.viewMode==="browse"?"":" scraper-results--hidden"}">
        <div class="view-header browse-view-header">
          <button id="exit-browse-btn" class="btn btn-secondary browse-back-btn">← Back</button>
          <h1 class="browse-title">
             ${this.browseScraper?this.getDomainIcon(this.browseScraper):h("globe")} Browse: ${this.browseScraper}
          </h1>
        </div>

        <div class="browse-controls-box">
          <div class="browse-form-group" style="flex: 1; min-width: 200px;">
            <label>${ve(this.browseConfig().queryLabel)}</label>
            <input type="text" id="browse-query" class="browse-input" value="${ve(this.browseQuery)}" placeholder="${ve(this.browseConfig().queryPlaceholder)}">
          </div>
          <div class="browse-form-group" style="min-width: 150px;">
            <label>Sort By</label>
            <select id="browse-sort" class="browse-select">
              ${this.browseConfig().sorts.map(t=>`<option value="${ve(t.value)}" ${this.browseSort===t.value?"selected":""}>${ve(t.label)}</option>`).join("")}
            </select>
          </div>
          <div class="browse-actions" style="display: flex; gap: 8px;">
            <button id="browse-apply-btn" class="btn btn-primary">Apply Filters</button>
            <button id="browse-refresh-btn" class="btn btn-secondary" title="Bypass cache and reload fresh results">${h("refresh-cw")} Refresh</button>
          </div>
        </div>

        <div id="browse-results-container" class="library-grid browse-results-grid">
          <!-- Results will go here -->
        </div>

        <div id="browse-pagination" class="browse-pagination" style="display: none;">
          <button id="browse-load-more-btn" class="btn btn-secondary browse-load-more-btn">Load Next Page</button>
          <div id="browse-loading-indicator" class="browse-loading-indicator" style="display: none;">
             <div class="spinner"></div>
             <p>Loading page <span id="browse-loading-page"></span>...</p>
          </div>
        </div>
      </div>

      <!-- INFO MODAL -->
      <div id="preview-info-modal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center;">
        <div class="modal-content" style="background: var(--card-bg); max-width: 600px; width: 90%; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; max-height: 90vh;">
           <div id="preview-info-body" style="padding: 1.5rem; overflow-y: auto;">
              <!-- Info content -->
           </div>
           <div style="padding: 1rem 1.5rem; background: var(--bg-color); display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border-color);">
              <button id="preview-close-btn" class="btn btn-secondary">Close</button>
              <button id="preview-add-btn" class="btn btn-primary">Add to Library</button>
              <button id="preview-read-btn" class="btn btn-primary" style="background: var(--success);">${h("book-open")} Read Now</button>
           </div>
        </div>
      </div>

      <!-- TEMPORARY READER FULLSCREEN -->
      <div id="temp-reader-overlay" style="display: none; position: fixed; inset: 0; background: #000; z-index: 2000; flex-direction: column;">
        <div class="reader-toolbar" style="background: rgba(0,0,0,0.8); color: white; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333;">
           <div style="display: flex; align-items: center; gap: 1rem;">
             <button id="temp-reader-close" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0;">←</button>
             <h3 id="temp-reader-title" style="margin: 0; font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60vw;">Preview</h3>
           </div>
           <div id="temp-reader-counter" style="font-size: 0.9rem; color: #aaa;">0 / 0</div>
        </div>
        <div id="temp-reader-scroll" style="flex: 1; overflow-y: auto; text-align: center; padding: 20px 0; scroll-behavior: smooth;">
           <div id="temp-reader-images" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
             <!-- Images go here -->
           </div>
        </div>
      </div>
    `,_e()}renderScraperList(){const t=document.getElementById("scraper-cards-list");if(!t)return;if(this.scrapers.length===0){t.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">${h("plug")}</div>
          <p>No scrapers found.</p>
        </div>
      `;return}const a=this.scrapers.map(n=>({...n,canSearch:n.supportsSearch===!0,canAdd:!0,canBrowse:n.supportsBrowse===!0})).map(n=>`
        <div class="scraper-info-card">

          <div class="scraper-card-header">
            <div class="scraper-card-icon">${this.getDomainIcon(n.name)}</div>
            <div class="scraper-card-name">
              <h3>${n.name}</h3>
              <span class="scraper-card-patterns">${n.urlPatterns.join(", ")}</span>
            </div>
          </div>

          <div class="scraper-card-body">
            <div class="capability-row">
              <span class="capability-label">${h("search")} Search</span>
              ${n.canSearch?'<span class="capability-pill capability-yes">✓ Supported</span>':'<span class="capability-pill capability-no">✗ Not available</span>'}
            </div>
            <div class="capability-row">
              <span class="capability-label">${h("plus")} Adding</span>
              <span class="capability-pill capability-yes">✓ Supported</span>
            </div>
            <div class="capability-row">
              <span class="capability-label">${h("book-open")} Browsing</span>
              ${n.canBrowse?'<span class="capability-pill capability-yes">✓ Supported</span>':`<span class="capability-pill capability-soon">${h("traffic-cone")} Coming soon</span>`}
            </div>
            ${this.renderSessionRow(n)}
          </div>

          <div class="scraper-card-footer">
            <button
              class="btn btn-secondary scraper-search-card-btn"
              data-scraper="${n.name}"
              ${n.canSearch?"":"disabled"}
              title="${n.canSearch?`Search in ${n.name}`:"Search not supported"}"
            >${h("search")} Search</button>
            <button
              class="btn btn-secondary scraper-browse-card-btn"
              data-scraper="${n.name}"
              ${n.canBrowse?"":"disabled"}
              title="${n.canBrowse?`Browse ${n.name}`:"Browsing coming soon"}"
            >${h("book-open")} Browse</button>
            ${n.supportsSession&&K.isAdmin?`
            <button
              class="btn btn-secondary scraper-session-solve-btn"
              data-scraper="${ve(n.name)}"
              title="Pass ${ve(n.name)}'s human check inside the scraper's own browser"
            >${h("lock-open")} Solve check</button>
            <button
              class="btn btn-secondary scraper-session-card-btn"
              data-scraper="${ve(n.name)}"
              title="Hand over cookies from a browser that completed ${ve(n.name)}'s human check"
            >Cookies</button>`:""}
          </div>

        </div>
      `);t.innerHTML=a.join("")}getDomainIcon(t){const s=t.toLowerCase();return s.includes("comix")?h("library"):s.includes("mangahere")?h("book-open"):s.includes("nhentai")?h("shield-alert"):s.includes("chained")?h("link"):h("globe")}bindEvents(){const t=document.getElementById("scraper-search-form");t&&t.addEventListener("submit",w=>{w.preventDefault();const x=document.getElementById("scraper-query");x&&x.value.trim()&&(this.currentQuery=x.value.trim(),this.performSearch())});const s=document.getElementById("torrent-search-btn");s&&s.addEventListener("click",async()=>{var v;const w=(((v=document.getElementById("scraper-query"))==null?void 0:v.value)||"").trim();let x=[];try{const L=await g.getBookmarks();x=(Array.isArray(L)?L:L.bookmarks||[]).map(S=>({id:S.id,title:S.title,alias:S.alias})).sort((S,B)=>(S.alias||S.title).localeCompare(B.alias||B.title))}catch{}Na({query:w,library:x})});const a=document.getElementById("clear-target-btn");a&&a.addEventListener("click",()=>{this.currentTarget="all",this.updateView();const w=document.getElementById("scraper-query");w&&w.focus()}),this.bindCardEvents();const n=document.getElementById("exit-browse-btn");n&&n.addEventListener("click",()=>{this.viewMode="main",this.updateView()});const r=document.getElementById("browse-apply-btn");r&&r.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse()});const i=document.getElementById("browse-refresh-btn");i&&i.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse(!1,!0)});const c=document.getElementById("browse-query");c&&c.addEventListener("keypress",w=>{w.key==="Enter"&&r.click()});const l=document.getElementById("browse-load-more-btn");l&&l.addEventListener("click",()=>{!this.isBrowsing&&this.browsePage<this.browseTotalPages&&(this.browsePage++,this.performBrowse(!0))});const d=document.getElementById("preview-close-btn");d&&d.addEventListener("click",()=>{this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),document.getElementById("preview-info-modal").style.display="none"});const u=document.getElementById("preview-add-btn");u&&u.addEventListener("click",()=>{this.previewInfo&&this.previewInfo.url&&this.openAddModal(this.previewInfo.url,u)});const m=document.getElementById("preview-read-btn");m&&m.addEventListener("click",()=>{m.disabled||(this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.openTempReader())});const f=document.getElementById("temp-reader-close");f&&f.addEventListener("click",()=>{document.getElementById("temp-reader-overlay").style.display="none"})}async performSearch(){const t=document.getElementById("scraper-results-container"),s=document.getElementById("scraper-search-btn");if(!t||!s)return;this.isSearching=!0,t.style.display="block",s.textContent="Searching...",s.disabled=!0;const a=this.currentTarget==="all"?"all sites":this.currentTarget;t.innerHTML=`
      <div class="loading-state" style="margin-top: 2rem;">
        <div class="spinner"></div>
        <p>Searching ${a} for "${this.currentQuery}"...</p>
        <p class="subtitle">This may take a minute...</p>
      </div>
    `;try{const n=await g.get(`/scrapers/search?q=${encodeURIComponent(this.currentQuery)}&scraper=${encodeURIComponent(this.currentTarget)}`);if(n.success)this.results=n.results||[],this.renderResults();else throw new Error(n.error||"Failed to search scrapers")}catch(n){console.error("Search error",n),t.innerHTML=`<div class="error-state" style="margin-top: 2rem;">Failed to perform search: ${n.message}</div>`}finally{this.isSearching=!1,s.textContent="Search",s.disabled=!1}}renderResults(){const t=document.getElementById("scraper-results-container");if(!t)return;if(this.results.length===0){t.innerHTML=`
        <div class="empty-state" style="margin-top: 2rem;">
          <div class="empty-icon">${h("search-x")}</div>
          <p>No results found for "${this.currentQuery}".</p>
        </div>
      `;return}let s='<div class="library-grid" style="margin-top: 2rem;">';this.results.forEach(a=>{const n=a.cover||"";let r="";n.startsWith("/covers/")?r=n:n&&(r=`/api/scrapers/proxy-cover?url=${encodeURIComponent(n)}`);const i=r?Te(r,"Cover",{kind:"series",self:!0}):fe("series");s+=`
        <div class="manga-card scraper-result-card" data-url="${a.url}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${i}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${a.website}</span>
              ${a.chapterCount?`<span class="badge badge-chapters">${a.chapterCount} ch</span>`:""}
            </div>
          </div>
          <div class="manga-card-title" title="${a.title}">${a.title}</div>
          <div style="padding: 0 8px 8px;">
            <button class="btn btn-primary add-from-search-btn" data-url="${a.url}" style="width: 100%; font-size: 0.8rem;">+ Add to Library</button>
          </div>
        </div>
      `}),s+="</div>",t.innerHTML=s,setTimeout(()=>{document.querySelectorAll(".scraper-result-card").forEach(a=>{a.addEventListener("click",n=>{n.target.closest(".add-from-search-btn")||window.open(a.dataset.url,"_blank")})}),document.querySelectorAll(".add-from-search-btn").forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation();const r=n.target.dataset.url;this.openAddModal(r,n.target)})})},100)}async _addToLibraryAndWait(t){const s=await g.addBookmark(t);if(!s.jobId)throw new Error("No job ID returned");return new Promise((a,n)=>{const r=setInterval(async()=>{try{const c=(await g.getQueueHistory(20)).find(l=>l.id===s.jobId);c&&(c.status==="completed"?(clearInterval(r),c.result&&c.result.bookmark?a(c.result.bookmark):n(new Error("Job completed but returned no bookmark"))):c.status==="failed"&&(clearInterval(r),n(new Error(c.error))))}catch{}},1e3)})}async openAddModal(t,s){const a=s?s.textContent:"+ Add to Library";s&&(s.textContent="Adding...");try{const n=await this._addToLibraryAndWait(t);document.getElementById("preview-info-modal").style.display="none",window.location.hash=`#/manga/${n.id}`}catch(n){alert("Error adding manga: "+n.message)}finally{s&&(s.textContent=a)}}async performBrowse(t=!1,s=!1){const a=document.getElementById("browse-results-container"),n=document.getElementById("browse-load-more-btn"),r=document.getElementById("browse-loading-indicator"),i=document.getElementById("browse-pagination");if(a){this.isBrowsing=!0,t?(n.style.display="none",r.style.display="block",document.getElementById("browse-loading-page").textContent=this.browsePage):(a.innerHTML=`
        <div class="loading-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="spinner"></div>
          <p>Browsing ${this.browseScraper}...</p>
        </div>
      `,i.style.display="none");try{let c=`/scrapers/browse?scraper=${encodeURIComponent(this.browseScraper)}&q=${encodeURIComponent(this.browseQuery)}&sort=${encodeURIComponent(this.browseSort)}&page=${this.browsePage}`;s&&(c+="&refresh=true");const l=await g.get(c);if(l.success)t?this.browseResults=[...this.browseResults,...l.results||[]]:this.browseResults=l.results||[],this.browseTotalPages=l.totalPages||1,this.renderBrowseResults(t);else throw new Error(l.error||"Failed to browse")}catch(c){console.error("Browse error",c),t?alert("Failed to load more results: "+c.message):a.innerHTML=`<div class="error-state" style="grid-column: 1/-1; margin-top: 2rem;">Failed to load browse results: ${c.message}</div>`}finally{this.isBrowsing=!1,t&&(n.style.display="inline-block",r.style.display="none")}}}renderBrowseResults(t){const s=document.getElementById("browse-results-container"),a=document.getElementById("browse-pagination");if(this.browseResults.length===0){s.innerHTML=`
        <div class="empty-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="empty-icon">${h("search-x")}</div>
          <p>No results found.</p>
        </div>
      `,a.style.display="none";return}let n="";this.browseResults.forEach((r,i)=>{const c=r.cover||"";let l="";c.startsWith("/covers/")?l=c:c&&(l=`/api/scrapers/proxy-cover?url=${encodeURIComponent(c)}`);const d=l?Te(l,"Cover",{kind:"series",self:!0}):fe("series");n+=`
        <div class="manga-card browse-result-card" data-index="${i}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${d}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${r.website||this.browseScraper}</span>
            </div>
          </div>
          <div class="manga-card-title" title="${r.title}">${r.title}</div>
        </div>
      `}),s.innerHTML=n,this.browsePage<this.browseTotalPages?a.style.display="block":a.style.display="none",setTimeout(()=>{document.querySelectorAll(".browse-result-card").forEach(r=>{r.addEventListener("click",()=>{const i=parseInt(r.dataset.index),c=this.browseResults[i];c&&this.openInfoModal(c)})})},100)}async openInfoModal(t){var i;this.infoAbortController&&this.infoAbortController.abort(),this.infoAbortController=new AbortController;const s=this.infoAbortController.signal,a=document.getElementById("preview-info-modal"),n=document.getElementById("preview-info-body"),r=document.getElementById("preview-read-btn");this.previewInfo=t,a.style.display="flex",n.innerHTML=`
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
         <div style="flex: 0 0 200px; max-width: 100%;">
            <div class="manga-card-cover" style="height: 280px; border-radius: 8px;">
               ${t.cover?`<img src="${t.cover.startsWith("/covers/")?t.cover:"/api/scrapers/proxy-cover?url="+encodeURIComponent(t.cover)}" style="width: 100%; height: 100%; object-fit: cover;">`:fe("series")}
            </div>
         </div>
         <div style="flex: 1; min-width: 250px;">
            <h2 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.5rem;">${t.title}</h2>
            <p style="color: var(--text-muted); margin-bottom: 1rem;">${t.website||this.browseScraper}</p>
            <div id="preview-extended-info" class="loading-state" style="padding: 1rem 0; min-height: 100px; justify-content: flex-start; align-items: flex-start;">
               <div class="spinner" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></div>
               <p style="font-size: 0.9rem;">Fetching details...</p>
            </div>
         </div>
      </div>
    `,this._setReadBtnEnabled(r,!1);try{const c=await g.get(`/scrapers/info?url=${encodeURIComponent(t.url)}`,{signal:s});if(c.success&&c.info){this.previewInfo={...this.previewInfo,...c.info},Array.isArray(c.info.chapters)&&c.info.chapters.length>1&&((i=c.info.chapters[0])!=null&&i.url)&&(this.previewInfo.readUrl=c.info.chapters[0].url);let l="";c.info.tags&&c.info.tags.length>0&&(l=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Tags</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${c.info.tags.map(u=>`<span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); font-weight: normal; font-size: 0.75rem;">${u}</span>`).join("")}
                 </div>
               </div>
             `);let d="";c.info.artists&&c.info.artists.length>0&&(d=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Artists</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${c.info.artists.map(u=>`<span class="badge badge-chapters">${u}</span>`).join("")}
                 </div>
               </div>
             `),document.getElementById("preview-extended-info").innerHTML=`
             <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; background: var(--bg-color); padding: 1rem; border-radius: 8px;">
               <div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Pages / Ch</div>
                  <div style="font-weight: bold;">${c.info.pageCount||c.info.totalChapters||"?"}</div>
               </div>
               ${c.info.displayId?`
                 <div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Gallery ID</div>
                    <div style="font-weight: bold;">${c.info.displayId}</div>
                 </div>
               `:""}
             </div>
             ${d}
             ${l}
          `,this._setReadBtnEnabled(r,!0)}else document.getElementById("preview-extended-info").innerHTML='<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>',(this.previewInfo.galleryId||this.previewInfo.url)&&this._setReadBtnEnabled(r,!0)}catch(c){if(c.name==="AbortError"||s.aborted){console.log("Scraper details fetch aborted successfully.");return}console.error("Info error:",c),document.getElementById("preview-extended-info").innerHTML=`<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${c.message}</p>`,this._setReadBtnEnabled(r,!0)}}_setReadBtnEnabled(t,s){t&&(t.disabled=!s,t.style.opacity=s?"1":"0.5",t.style.cursor=s?"pointer":"not-allowed",t.style.pointerEvents=s?"auto":"none")}async openTempReader(){if(!this.previewInfo||!this.previewInfo.url&&!this.previewInfo.galleryId)return;const t=this.previewInfo.readUrl||this.previewInfo.url||`https://nhentai.net/g/${this.previewInfo.galleryId}/`,s=this.browseScraper||this.previewInfo.website;sessionStorage.setItem("streamPreviewUrl",t),sessionStorage.setItem("streamPreviewTitle",this.previewInfo.title||"Preview"),s?sessionStorage.setItem("streamPreviewScraper",s):sessionStorage.removeItem("streamPreviewScraper"),document.getElementById("preview-info-modal").style.display="none",window.location.hash="#/read/stream/preview"}}const Ii=new Li,ta={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};let P=null;function Bi(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function sa(e,t=0){for(let s=e.length-1;s>t;s--){const a=t+Math.floor(Math.random()*(s-t+1));[e[s],e[a]]=[e[a],e[s]]}}function Ai(e){let t;return typeof e=="string"?t=e:e&&typeof e=="object"&&(t=e.filename||e.path||e.name||e.url),t?(t.includes("/")&&(t=t.split("/").pop()),t.includes("\\")&&(t=t.split("\\").pop()),t):null}function Mi(e){return h(e==="gallery"?"folder":e==="trophy"?"trophy":"book-open")}function Ti(e,t){const s=[];for(const a of e){if(t.has(a.id))continue;const n=a.alias||a.title;for(const r of a.volumes)r.cover&&s.push({url:r.cover,title:n,subtitle:r.name,kind:"volume"})}return s}async function _i(){var a,n;const e=await g.getFavorites(),t=(a=e.listOrder)!=null&&a.length?e.listOrder:Object.keys(e.favorites||{}),s=[];for(const r of t)for(const i of((n=e.favorites)==null?void 0:n[r])||[])for(const c of i.imagePaths||[]){const l=Ai(c);l&&s.push({url:`/api/public/chapter-images/${i.mangaId}/${i.chapterNum}/${encodeURIComponent(l)}`,title:r,subtitle:i.mangaTitle?`${i.mangaTitle} · Ch. ${i.chapterNum}`:`Ch. ${i.chapterNum}`,kind:"gallery"})}return s}async function Pi(e){const t=await g.get("/trophy-pages"),s=await me.loadBookmarks().catch(()=>[]),a=r=>{const i=s.find(c=>c.id===r);return i?i.alias||i.title:"Trophies"},n=[];for(const[r,i]of Object.entries(t||{}))if(!e.has(r))for(const[c,l]of Object.entries(i||{})){const d=Object.keys(l||{});if(d.length===0)continue;let u;try{u=(await g.getChapterImages(r,c)).images||[]}catch{continue}for(const m of d){const f=u[m];if(!f)continue;let w=typeof f=="string"?f.split("/").pop():(f==null?void 0:f.filename)||(f==null?void 0:f.path);if(w){try{w=decodeURIComponent(w)}catch{}n.push({url:`/api/public/chapter-images/${r}/${c}/${encodeURIComponent(w)}`,title:a(r),subtitle:`Ch. ${c} · Trophy`,kind:"trophy"})}}}return n}function Wa(){P&&(clearTimeout(P.timer),P.playing&&P.slides.length>1&&(P.timer=setTimeout(()=>xe(P.index+1),P.config.intervalMs)))}function gs(){if(!P)return;const e=P.slides[P.index],t=document.getElementById("ss-counter"),s=document.getElementById("ss-title"),a=document.getElementById("ss-subtitle");t&&(t.textContent=P.slides.length?`${P.index+1} / ${P.slides.length}`:""),s&&e&&(s.innerHTML=`${Mi(e.kind)} ${Bi(e.title)}`),a&&e&&(a.textContent=e.subtitle||"")}function xe(e){if(!P||P.slides.length===0)return;const t=(e%P.slides.length+P.slides.length)%P.slides.length;P.index=t;const s=P.slides[t],a=++P.loadToken,n=1-P.activeLayer,r=P.layers[n],i=P.layers[P.activeLayer];r.onload=()=>{if(!(!P||a!==P.loadToken)&&(P.activeLayer=n,r.classList.add("active"),i.classList.remove("active"),gs(),Wa(),P.slides.length>1)){const c=P.slides[(t+1)%P.slides.length];c&&(new Image().src=c.url)}},r.onerror=()=>{if(!(!P||a!==P.loadToken)){if(P.slides.splice(t,1),P.slides.length===0){vs();return}xe(t)}},r.src=s.url,gs()}function aa(e){if(!P)return;P.playing=e;const t=document.getElementById("ss-play");t&&(t.innerHTML=h(e?"pause":"play")),Wa()}function $e(){if(!P)return;const e=document.getElementById("slideshow");e&&(e.classList.remove("controls-hidden"),clearTimeout(P.hideTimer),P.hideTimer=setTimeout(()=>{var t;(t=document.getElementById("slideshow"))==null||t.classList.add("controls-hidden")},3e3))}function fs(){F.go("/settings")}function vs(){var t;const e=document.getElementById("slideshow");e&&(e.innerHTML=`
        <div class="slideshow-empty">
            ${h("images",{size:48})}
            <p>Nothing to show yet — add covers to your volumes, or enable galleries and trophies in Settings.</p>
            <button id="ss-empty-back" class="btn btn-primary">Back to Settings</button>
        </div>
    `,(t=document.getElementById("ss-empty-back"))==null||t.addEventListener("click",fs))}const qi={mount:async()=>{const e=document.getElementById("app");e.innerHTML=`
            <div class="slideshow" id="slideshow">
                <div class="slideshow-stage" id="ss-stage">
                    <img class="slideshow-img" alt="">
                    <img class="slideshow-img" alt="">
                </div>
                <div class="slideshow-ui">
                    <div class="slideshow-topbar">
                        <button class="slideshow-btn" id="ss-exit" title="Exit slideshow">${h("x")}</button>
                        <div class="slideshow-counter" id="ss-counter"></div>
                        <button class="slideshow-btn" id="ss-fullscreen" title="Toggle fullscreen">${h("maximize")}</button>
                    </div>
                    <div class="slideshow-bottombar">
                        <div class="slideshow-caption">
                            <div class="slideshow-title" id="ss-title"></div>
                            <div class="slideshow-subtitle" id="ss-subtitle"></div>
                        </div>
                        <div class="slideshow-transport">
                            <button class="slideshow-btn" id="ss-prev" title="Previous">${h("chevron-left")}</button>
                            <button class="slideshow-btn" id="ss-play" title="Pause">${h("pause")}</button>
                            <button class="slideshow-btn" id="ss-next" title="Next">${h("chevron-right")}</button>
                        </div>
                    </div>
                </div>
                <div class="slideshow-loading" id="ss-loading">${h("loader",{spin:!0})} Loading covers…</div>
            </div>
        `;const t=document.getElementById("ss-stage");P={slides:[],index:0,playing:!0,timer:null,hideTimer:null,loadToken:0,activeLayer:0,layers:[...t.querySelectorAll(".slideshow-img")],config:{...ta},keyHandler:null,moveHandler:null},document.getElementById("ss-exit").addEventListener("click",fs),document.getElementById("ss-prev").addEventListener("click",()=>{xe(P.index-1),$e()}),document.getElementById("ss-next").addEventListener("click",()=>{xe(P.index+1),$e()}),document.getElementById("ss-play").addEventListener("click",()=>{aa(!P.playing),$e()}),document.getElementById("ss-fullscreen").addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>p("Fullscreen not supported","info"))}),t.addEventListener("click",l=>{const d=l.clientX/window.innerWidth;if(d<.3)xe(P.index-1),$e();else if(d>.7)xe(P.index+1),$e();else{const u=document.getElementById("slideshow");u.classList.contains("controls-hidden")?$e():(clearTimeout(P.hideTimer),u.classList.add("controls-hidden"))}}),P.keyHandler=l=>{if(P)switch(l.key){case"ArrowLeft":xe(P.index-1),$e();break;case"ArrowRight":xe(P.index+1),$e();break;case" ":l.preventDefault(),aa(!P.playing),$e();break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});break;case"Escape":document.fullscreenElement||fs();break}},document.addEventListener("keydown",P.keyHandler),P.moveHandler=()=>$e(),document.addEventListener("mousemove",P.moveHandler),$e();let s={};try{s=await g.get("/settings")||{}}catch{}P.config={...ta,...s.slideshow||{}};const a=new Set(P.config.disabledMangaIds||[]);let n=[];try{n=await g.getAllVolumes()}catch(l){console.error(l)}P.slides=Ti(n,a),P.config.shuffle&&sa(P.slides,-1);const r=document.getElementById("ss-loading");P.slides.length>0&&(r==null||r.remove(),xe(0));const i=l=>{var u;if(!P||l.length===0)return;const d=P.slides.length===0;P.slides.push(...l),P.config.shuffle&&sa(P.slides,d?-1:P.index),d?((u=document.getElementById("ss-loading"))==null||u.remove(),xe(0)):gs()},c=[];P.config.includeLists&&c.push(_i().then(i).catch(l=>console.warn("Slideshow: galleries unavailable",l))),P.config.includeTrophies&&c.push(Pi(a).then(i).catch(l=>console.warn("Slideshow: trophies unavailable",l))),P.slides.length===0&&(c.length===0?vs():Promise.allSettled(c).then(()=>{P&&P.slides.length===0&&vs()}))},unmount:()=>{P&&(clearTimeout(P.timer),clearTimeout(P.hideTimer),document.removeEventListener("keydown",P.keyHandler),document.removeEventListener("mousemove",P.moveHandler),document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),P=null)}};class Ri{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(t,s){this.routes.set(t,s)}async navigate(){console.log("[Router] navigate called");const s=(window.location.hash.slice(1)||"/").split("?")[0],[a,...n]=s.split("/").filter(Boolean),r=`/${a||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let i=this.routes.get(r);!i&&this.routes.has("/")&&(i=this.routes.get("/")),i&&(this.currentRoute=r,this.currentView=i,i.mount&&(console.log("[Router] calling mount on view module"),await i.mount(n)),_e())}go(t){window.location.hash=t}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),_e())}}const F=new Ri;F.register("/",fr);F.register("/manga",Bo);F.register("/read",Vr);F.register("/series",Do);F.register("/settings",Uo);F.register("/admin",Vo);F.register("/favorites",Zo);F.register("/queue",Si);F.register("/scrapers",Ii);F.register("/slideshow",qi);export{ne as S,Z as a,Oi as i,F as r,Ni as s};
