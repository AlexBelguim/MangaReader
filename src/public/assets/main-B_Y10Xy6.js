import{a as f}from"./api-DnVV6SjD.js";const ee=Object.create(null);ee.open="0";ee.close="1";ee.ping="2";ee.pong="3";ee.message="4";ee.upgrade="5";ee.noop="6";const _e=Object.create(null);Object.keys(ee).forEach(t=>{_e[ee[t]]=t});const Ke={type:"error",data:"parser error"},It=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Bt=typeof ArrayBuffer=="function",Pt=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,ct=({type:t,data:e},s,a)=>It&&e instanceof Blob?s?a(e):wt(e,a):Bt&&(e instanceof ArrayBuffer||Pt(e))?s?a(e):wt(new Blob([e]),a):a(ee[t]+(e||"")),wt=(t,e)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];e("b"+(a||""))},s.readAsDataURL(t)};function kt(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let ze;function as(t,e){if(It&&t.data instanceof Blob)return t.data.arrayBuffer().then(kt).then(e);if(Bt&&(t.data instanceof ArrayBuffer||Pt(t.data)))return e(kt(t.data));ct(t,!1,s=>{ze||(ze=new TextEncoder),e(ze.encode(s))})}const Et="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fe=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<Et.length;t++)fe[Et.charCodeAt(t)]=t;const ns=t=>{let e=t.length*.75,s=t.length,a,n=0,o,r,u,c;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const b=new ArrayBuffer(e),v=new Uint8Array(b);for(a=0;a<s;a+=4)o=fe[t.charCodeAt(a)],r=fe[t.charCodeAt(a+1)],u=fe[t.charCodeAt(a+2)],c=fe[t.charCodeAt(a+3)],v[n++]=o<<2|r>>4,v[n++]=(r&15)<<4|u>>2,v[n++]=(u&3)<<6|c&63;return b},is=typeof ArrayBuffer=="function",dt=(t,e)=>{if(typeof t!="string")return{type:"message",data:At(t,e)};const s=t.charAt(0);return s==="b"?{type:"message",data:os(t.substring(1),e)}:_e[s]?t.length>1?{type:_e[s],data:t.substring(1)}:{type:_e[s]}:Ke},os=(t,e)=>{if(is){const s=ns(t);return At(s,e)}else return{base64:!0,data:t}},At=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},Tt="",rs=(t,e)=>{const s=t.length,a=new Array(s);let n=0;t.forEach((o,r)=>{ct(o,!1,u=>{a[r]=u,++n===s&&e(a.join(Tt))})})},ls=(t,e)=>{const s=t.split(Tt),a=[];for(let n=0;n<s.length;n++){const o=dt(s[n],e);if(a.push(o),o.type==="error")break}return a};function cs(){return new TransformStream({transform(t,e){as(t,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const o=new DataView(n.buffer);o.setUint8(0,126),o.setUint16(1,a)}else{n=new Uint8Array(9);const o=new DataView(n.buffer);o.setUint8(0,127),o.setBigUint64(1,BigInt(a))}t.data&&typeof t.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(s)})}})}let je;function Se(t){return t.reduce((e,s)=>e+s.length,0)}function Le(t,e){if(t[0].length===e)return t.shift();const s=new Uint8Array(e);let a=0;for(let n=0;n<e;n++)s[n]=t[0][a++],a===t[0].length&&(t.shift(),a=0);return t.length&&a<t[0].length&&(t[0]=t[0].slice(a)),s}function ds(t,e){je||(je=new TextDecoder);const s=[];let a=0,n=-1,o=!1;return new TransformStream({transform(r,u){for(s.push(r);;){if(a===0){if(Se(s)<1)break;const c=Le(s,1);o=(c[0]&128)===128,n=c[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(Se(s)<2)break;const c=Le(s,2);n=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),a=3}else if(a===2){if(Se(s)<8)break;const c=Le(s,8),b=new DataView(c.buffer,c.byteOffset,c.length),v=b.getUint32(0);if(v>Math.pow(2,21)-1){u.enqueue(Ke);break}n=v*Math.pow(2,32)+b.getUint32(4),a=3}else{if(Se(s)<n)break;const c=Le(s,n);u.enqueue(dt(o?c:je.decode(c),e)),a=0}if(n===0||n>t){u.enqueue(Ke);break}}}})}const Mt=4;function O(t){if(t)return us(t)}function us(t){for(var e in O.prototype)t[e]=O.prototype[e];return t}O.prototype.on=O.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this};O.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this};O.prototype.off=O.prototype.removeListener=O.prototype.removeAllListeners=O.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+t];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===e||a.fn===e){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+t],this};O.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),s=this._callbacks["$"+t],a=1;a<arguments.length;a++)e[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,e)}return this};O.prototype.emitReserved=O.prototype.emit;O.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};O.prototype.hasListeners=function(t){return!!this.listeners(t).length};const Oe=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,s)=>s(e,0),W=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),hs="arraybuffer";function Rt(t,...e){return e.reduce((s,a)=>(t.hasOwnProperty(a)&&(s[a]=t[a]),s),{})}const ps=W.setTimeout,ms=W.clearTimeout;function Ue(t,e){e.useNativeTimers?(t.setTimeoutFn=ps.bind(W),t.clearTimeoutFn=ms.bind(W)):(t.setTimeoutFn=W.setTimeout.bind(W),t.clearTimeoutFn=W.clearTimeout.bind(W))}const gs=1.33;function fs(t){return typeof t=="string"?vs(t):Math.ceil((t.byteLength||t.size)*gs)}function vs(t){let e=0,s=0;for(let a=0,n=t.length;a<n;a++)e=t.charCodeAt(a),e<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(a++,s+=4);return s}function Dt(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function ys(t){let e="";for(let s in t)t.hasOwnProperty(s)&&(e.length&&(e+="&"),e+=encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e}function bs(t){let e={},s=t.split("&");for(let a=0,n=s.length;a<n;a++){let o=s[a].split("=");e[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}return e}class ws extends Error{constructor(e,s,a){super(e),this.description=s,this.context=a,this.type="TransportError"}}class ut extends O{constructor(e){super(),this.writable=!1,Ue(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,s,a){return super.emitReserved("error",new ws(e,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const s=dt(e,this.socket.binaryType);this.onPacket(s)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,s={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const s=ys(e);return s.length?"?"+s:""}}class ks extends ut{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const s=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};ls(e,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,rs(e,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=Dt()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(e,s)}}let Nt=!1;try{Nt=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Es=Nt;function Cs(){}class $s extends ks{constructor(e){if(super(e),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||a!==e.port}}doWrite(e,s){const a=this.request({method:"POST",data:e});a.on("success",s),a.on("error",(n,o)=>{this.onError("xhr post error",n,o)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=e}}class Z extends O{constructor(e,s,a){super(),this.createRequest=e,Ue(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var e;const s=Rt(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=Z.requestsCount++,Z.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Cs,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Z.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Z.requestsCount=0;Z.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Ct);else if(typeof addEventListener=="function"){const t="onpagehide"in W?"pagehide":"unload";addEventListener(t,Ct,!1)}}function Ct(){for(let t in Z.requests)Z.requests.hasOwnProperty(t)&&Z.requests[t].abort()}const Ss=function(){const t=qt({xdomain:!1});return t&&t.responseType!==null}();class Ls extends $s{constructor(e){super(e);const s=e&&e.forceBase64;this.supportsBinary=Ss&&!s}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Z(qt,this.uri(),e)}}function qt(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Es))return new XMLHttpRequest}catch{}if(!e)try{return new W[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Ft=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class xs extends ut{get name(){return"websocket"}doOpen(){const e=this.uri(),s=this.opts.protocols,a=Ft?{}:Rt(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;ct(a,this.supportsBinary,o=>{try{this.doWrite(a,o)}catch{}n&&Oe(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=Dt()),this.supportsBinary||(s.b64=1),this.createUri(e,s)}}const Qe=W.WebSocket||W.MozWebSocket;class _s extends xs{createSocket(e,s,a){return Ft?new Qe(e,s,a):s?new Qe(e,s):new Qe(e)}doWrite(e,s){this.ws.send(s)}}class Is extends ut{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const s=ds(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=e.readable.pipeThrough(s).getReader(),n=cs();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const o=()=>{a.read().then(({done:u,value:c})=>{u||(this.onPacket(c),o())}).catch(u=>{})};o();const r={type:"open"};this.query.sid&&(r.data=`{"sid":"${this.query.sid}"}`),this._writer.write(r).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;this._writer.write(a).then(()=>{n&&Oe(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Bs={websocket:_s,webtransport:Is,polling:Ls},Ps=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,As=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Ye(t){if(t.length>8e3)throw"URI too long";const e=t,s=t.indexOf("["),a=t.indexOf("]");s!=-1&&a!=-1&&(t=t.substring(0,s)+t.substring(s,a).replace(/:/g,";")+t.substring(a,t.length));let n=Ps.exec(t||""),o={},r=14;for(;r--;)o[As[r]]=n[r]||"";return s!=-1&&a!=-1&&(o.source=e,o.host=o.host.substring(1,o.host.length-1).replace(/;/g,":"),o.authority=o.authority.replace("[","").replace("]","").replace(/;/g,":"),o.ipv6uri=!0),o.pathNames=Ts(o,o.path),o.queryKey=Ms(o,o.query),o}function Ts(t,e){const s=/\/{2,9}/g,a=e.replace(s,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&a.splice(0,1),e.slice(-1)=="/"&&a.splice(a.length-1,1),a}function Ms(t,e){const s={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,o){n&&(s[n]=o)}),s}const Je=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ie=[];Je&&addEventListener("offline",()=>{Ie.forEach(t=>t())},!1);class ne extends O{constructor(e,s){if(super(),this.binaryType=hs,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(s=e,e=null),e){const a=Ye(e);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=Ye(s.host).host);Ue(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=bs(this.opts.query)),Je&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ie.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const s=Object.assign({},this.opts.query);s.EIO=Mt,s.transport=e,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&ne.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(e);s.open(),this.setTransport(s)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",ne.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=e.data,this._onError(s);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=fs(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Oe(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,s,a){return this._sendPacket("message",e,s,a),this}send(e,s,a){return this._sendPacket("message",e,s,a),this}_sendPacket(e,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const o={type:e,data:s,options:a};this.emitReserved("packetCreate",o),this.writeBuffer.push(o),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),e()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():e()}):this.upgrading?a():e()),this}_onError(e){if(ne.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Je&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=Ie.indexOf(this._offlineEventListener);a!==-1&&Ie.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,s),this.writeBuffer=[],this._prevBufferLen=0}}}ne.protocol=Mt;class Rs extends ne{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let s=this.createTransport(e),a=!1;ne.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",w=>{if(!a)if(w.type==="pong"&&w.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;ne.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(v(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const y=new Error("probe error");y.transport=s.name,this.emitReserved("upgradeError",y)}}))};function o(){a||(a=!0,v(),s.close(),s=null)}const r=w=>{const y=new Error("probe error: "+w);y.transport=s.name,o(),this.emitReserved("upgradeError",y)};function u(){r("transport closed")}function c(){r("socket closed")}function b(w){s&&w.name!==s.name&&o()}const v=()=>{s.removeListener("open",n),s.removeListener("error",r),s.removeListener("close",u),this.off("close",c),this.off("upgrading",b)};s.once("open",n),s.once("error",r),s.once("close",u),this.once("close",c),this.once("upgrading",b),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const s=[];for(let a=0;a<e.length;a++)~this.transports.indexOf(e[a])&&s.push(e[a]);return s}}let Ds=class extends Rs{constructor(e,s={}){const a=typeof e=="object"?e:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>Bs[n]).filter(n=>!!n)),super(e,a)}};function Ns(t,e="",s){let a=t;s=s||typeof location<"u"&&location,t==null&&(t=s.protocol+"//"+s.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=s.protocol+t:t=s.host+t),/^(https?|wss?):\/\//.test(t)||(typeof s<"u"?t=s.protocol+"//"+t:t="https://"+t),a=Ye(t)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const o=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+o+":"+a.port+e,a.href=a.protocol+"://"+o+(s&&s.port===a.port?"":":"+a.port),a}const qs=typeof ArrayBuffer=="function",Fs=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Ot=Object.prototype.toString,Os=typeof Blob=="function"||typeof Blob<"u"&&Ot.call(Blob)==="[object BlobConstructor]",Us=typeof File=="function"||typeof File<"u"&&Ot.call(File)==="[object FileConstructor]";function ht(t){return qs&&(t instanceof ArrayBuffer||Fs(t))||Os&&t instanceof Blob||Us&&t instanceof File}function Be(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let s=0,a=t.length;s<a;s++)if(Be(t[s]))return!0;return!1}if(ht(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return Be(t.toJSON(),!0);for(const s in t)if(Object.prototype.hasOwnProperty.call(t,s)&&Be(t[s]))return!0;return!1}function Vs(t){const e=[],s=t.data,a=t;return a.data=Xe(s,e),a.attachments=e.length,{packet:a,buffers:e}}function Xe(t,e){if(!t)return t;if(ht(t)){const s={_placeholder:!0,num:e.length};return e.push(t),s}else if(Array.isArray(t)){const s=new Array(t.length);for(let a=0;a<t.length;a++)s[a]=Xe(t[a],e);return s}else if(typeof t=="object"&&!(t instanceof Date)){const s={};for(const a in t)Object.prototype.hasOwnProperty.call(t,a)&&(s[a]=Xe(t[a],e));return s}return t}function Hs(t,e){return t.data=Ze(t.data,e),delete t.attachments,t}function Ze(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let s=0;s<t.length;s++)t[s]=Ze(t[s],e);else if(typeof t=="object")for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(t[s]=Ze(t[s],e));return t}const zs=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var A;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(A||(A={}));class js{constructor(e){this.replacer=e}encode(e){return(e.type===A.EVENT||e.type===A.ACK)&&Be(e)?this.encodeAsBinary({type:e.type===A.EVENT?A.BINARY_EVENT:A.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let s=""+e.type;return(e.type===A.BINARY_EVENT||e.type===A.BINARY_ACK)&&(s+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(s+=e.nsp+","),e.id!=null&&(s+=e.id),e.data!=null&&(s+=JSON.stringify(e.data,this.replacer)),s}encodeAsBinary(e){const s=Vs(e),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class pt extends O{constructor(e){super(),this.reviver=e}add(e){let s;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(e);const a=s.type===A.BINARY_EVENT;a||s.type===A.BINARY_ACK?(s.type=a?A.EVENT:A.ACK,this.reconstructor=new Qs(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(ht(e)||e.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(e),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let s=0;const a={type:Number(e.charAt(0))};if(A[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===A.BINARY_EVENT||a.type===A.BINARY_ACK){const o=s+1;for(;e.charAt(++s)!=="-"&&s!=e.length;);const r=e.substring(o,s);if(r!=Number(r)||e.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(r)}if(e.charAt(s+1)==="/"){const o=s+1;for(;++s&&!(e.charAt(s)===","||s===e.length););a.nsp=e.substring(o,s)}else a.nsp="/";const n=e.charAt(s+1);if(n!==""&&Number(n)==n){const o=s+1;for(;++s;){const r=e.charAt(s);if(r==null||Number(r)!=r){--s;break}if(s===e.length)break}a.id=Number(e.substring(o,s+1))}if(e.charAt(++s)){const o=this.tryParse(e.substr(s));if(pt.isPayloadValid(a.type,o))a.data=o;else throw new Error("invalid payload")}return a}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,s){switch(e){case A.CONNECT:return $t(s);case A.DISCONNECT:return s===void 0;case A.CONNECT_ERROR:return typeof s=="string"||$t(s);case A.EVENT:case A.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&zs.indexOf(s[0])===-1);case A.ACK:case A.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Qs{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const s=Hs(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function $t(t){return Object.prototype.toString.call(t)==="[object Object]"}const Ws=Object.freeze(Object.defineProperty({__proto__:null,Decoder:pt,Encoder:js,get PacketType(){return A}},Symbol.toStringTag,{value:"Module"}));function Y(t,e,s){return t.on(e,s),function(){t.off(e,s)}}const Gs=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Ut extends O{constructor(e,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[Y(e,"open",this.onopen.bind(this)),Y(e,"packet",this.onpacket.bind(this)),Y(e,"error",this.onerror.bind(this)),Y(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...s){var a,n,o;if(Gs.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(s.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const r={type:A.EVENT,data:s};if(r.options={},r.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const v=this.ids++,w=s.pop();this._registerAckCallback(v,w),r.id=v}const u=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,c=this.connected&&!(!((o=this.io.engine)===null||o===void 0)&&o._hasPingExpired());return this.flags.volatile&&!u||(c?(this.notifyOutgoingListeners(r),this.packet(r)):this.sendBuffer.push(r)),this.flags={},this}_registerAckCallback(e,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[e]=s;return}const o=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let u=0;u<this.sendBuffer.length;u++)this.sendBuffer[u].id===e&&this.sendBuffer.splice(u,1);s.call(this,new Error("operation has timed out"))},n),r=(...u)=>{this.io.clearTimeoutFn(o),s.apply(this,u)};r.withError=!0,this.acks[e]=r}emitWithAck(e,...s){return new Promise((a,n)=>{const o=(r,u)=>r?n(r):a(u);o.withError=!0,s.push(o),this.emit(e,...s)})}_addToQueue(e){let s;typeof e[e.length-1]=="function"&&(s=e.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...o)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...o)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!e||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:A.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(a=>String(a.id)===e)){const a=this.acks[e];delete this.acks[e],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case A.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case A.EVENT:case A.BINARY_EVENT:this.onevent(e);break;case A.ACK:case A.BINARY_ACK:this.onack(e);break;case A.DISCONNECT:this.ondisconnect();break;case A.CONNECT_ERROR:this.destroy();const a=new Error(e.data.message);a.data=e.data.data,this.emitReserved("connect_error",a);break}}onevent(e){const s=e.data||[];e.id!=null&&s.push(this.ack(e.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:A.ACK,id:e,data:n}))}}onack(e){const s=this.acks[e.id];typeof s=="function"&&(delete this.acks[e.id],s.withError&&e.data.unshift(null),s.apply(this,e.data))}onconnect(e,s){this.id=e,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:A.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,e.data)}}}function he(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}he.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),s=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+s:t-s}return Math.min(t,this.max)|0};he.prototype.reset=function(){this.attempts=0};he.prototype.setMin=function(t){this.ms=t};he.prototype.setMax=function(t){this.max=t};he.prototype.setJitter=function(t){this.jitter=t};class et extends O{constructor(e,s){var a;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(s=e,e=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,Ue(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new he({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=e;const n=s.parser||Ws;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var s;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(s=this.backoff)===null||s===void 0||s.setMin(e),this)}randomizationFactor(e){var s;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(s=this.backoff)===null||s===void 0||s.setJitter(e),this)}reconnectionDelayMax(e){var s;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(s=this.backoff)===null||s===void 0||s.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Ds(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=Y(s,"open",function(){a.onopen(),e&&e()}),o=u=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",u),e?e(u):this.maybeReconnectOnOpen()},r=Y(s,"error",o);if(this._timeout!==!1){const u=this._timeout,c=this.setTimeoutFn(()=>{n(),o(new Error("timeout")),s.close()},u);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(n),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(Y(e,"ping",this.onping.bind(this)),Y(e,"data",this.ondata.bind(this)),Y(e,"error",this.onerror.bind(this)),Y(e,"close",this.onclose.bind(this)),Y(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(s){this.onclose("parse error",s)}}ondecoded(e){Oe(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,s){let a=this.nsps[e];return a?this._autoConnect&&!a.active&&a.connect():(a=new Ut(this,e,s),this.nsps[e]=a),a}_destroy(e){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(e){const s=this.encoder.encode(e);for(let a=0;a<s.length;a++)this.engine.write(s[a],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const ge={};function Pe(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const s=Ns(t,e.path||"/socket.io"),a=s.source,n=s.id,o=s.path,r=ge[n]&&o in ge[n].nsps,u=e.forceNew||e["force new connection"]||e.multiplex===!1||r;let c;return u?c=new et(a,e):(ge[n]||(ge[n]=new et(a,e)),c=ge[n]),s.query&&!e.query&&(e.query=s.queryKey),c.socket(s.path,e)}Object.assign(Pe,{Manager:et,Socket:Ut,io:Pe,connect:Pe});class Ks{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=Pe({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var s;this.subscribedMangas.add(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var s;this.subscribedMangas.delete(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,s){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(s),this.socket&&this.socket.on(e,s)}off(e,s){this.listeners.has(e)&&this.listeners.get(e).delete(s),this.socket&&this.socket.off(e,s)}emit(e,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(e,s)}}const V={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone"},D=new Ks,j={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},J=new Set,N=new Map,ve=new Map;function Ys(t){return j[t]}function Js(t,e){j[t]=e,J.add(t),Ce(t)}function Xs(t,e){return ve.has(t)||ve.set(t,new Set),ve.get(t).add(e),()=>{var s;return(s=ve.get(t))==null?void 0:s.delete(e)}}function Ce(t){const e=ve.get(t);e&&e.forEach(s=>s(j[t]))}function ye(t){J.delete(t),N.delete(t)}function Zs(t){return J.has(t)}async function be(t=!1){if(!t&&J.has("bookmarks"))return j.bookmarks;if(N.has("bookmarks"))return N.get("bookmarks");const e=f.getBookmarks().then(s=>(j.bookmarks=s||[],J.add("bookmarks"),N.delete("bookmarks"),Ce("bookmarks"),j.bookmarks)).catch(s=>{throw N.delete("bookmarks"),s});return N.set("bookmarks",e),e}async function ea(t=!1){if(!t&&J.has("series"))return j.series;if(N.has("series"))return N.get("series");const e=f.get("/series").then(s=>(j.series=s||[],J.add("series"),N.delete("series"),Ce("series"),j.series)).catch(s=>{throw N.delete("series"),s});return N.set("series",e),e}async function ta(t=!1){if(!t&&J.has("categories"))return j.categories;if(N.has("categories"))return N.get("categories");const e=f.get("/categories").then(s=>(j.categories=s.categories||[],J.add("categories"),N.delete("categories"),Ce("categories"),j.categories)).catch(s=>{throw N.delete("categories"),s});return N.set("categories",e),e}async function sa(t=!1){if(!t&&J.has("favorites"))return j.favorites;if(N.has("favorites"))return N.get("favorites");const e=f.getFavorites().then(s=>(j.favorites=s||{favorites:{},listOrder:[]},J.add("favorites"),N.delete("favorites"),Ce("favorites"),j.favorites)).catch(s=>{throw N.delete("favorites"),s});return N.set("favorites",e),e}function aa(){D.on(V.MANGA_UPDATED,()=>{ye("bookmarks"),be(!0)}),D.on(V.MANGA_ADDED,()=>{ye("bookmarks"),be(!0)}),D.on(V.MANGA_DELETED,()=>{ye("bookmarks"),be(!0)}),D.on(V.DOWNLOAD_COMPLETED,()=>{ye("bookmarks"),be(!0)})}aa();const X={get:Ys,set:Js,subscribe:Xs,invalidate:ye,isLoaded:Zs,loadBookmarks:be,loadSeries:ea,loadCategories:ta,loadFavorites:sa};function d(t,e="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=t,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}async function na(t,e,s){try{t&&(t.disabled=!0,t.textContent="Scanning..."),e&&(e.textContent="Scanning..."),d("Scanning downloads folder...","info");const n=(await f.scanLibrary()).found||[];if(n.length===0){d("Scan complete: No new manga found","info"),s&&s();return}ia(n,s)}catch(a){d("Scan failed: "+a.message,"error")}finally{t&&(t.disabled=!1,t.textContent="📁 Scan Folder"),e&&(e.textContent="📁 Scan Folder")}}async function ia(t,e){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
    <h2 style="margin:0 0 16px 0;">Import Local Manga</h2>
    <p style="margin:0 0 16px 0;color:var(--text-secondary);">Found ${t.length} new folder(s). Select which to import:</p>
    <div id="import-folder-list" style="max-height:300px;overflow-y:auto;margin-bottom:16px;">
      ${t.map(n=>`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),o=Array.from(n).map(c=>c.dataset.folder);if(o.length===0){d("No folders selected","warning");return}const r=document.getElementById("import-all-btn");r.disabled=!0,r.textContent="Importing...";let u=0;for(const c of o)try{await f.importLocalManga(c),u++}catch(b){console.error("Failed to import",c,b)}s.remove(),d(`Imported ${u} manga`,"success"),e&&e()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function G(t="manga"){return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">📚 Manga<span>Reader</span></a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${t==="manga"?"active":""}" data-view="manga" title="Manga view">📚</button>
            <button class="view-toggle-btn ${t==="series"?"active":""}" data-view="series" title="Series view">📖</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">⭐ Favorites</button>
          <a href="#/queue" class="btn btn-secondary" id="queue-nav-btn" title="Task Queue">📋 Queue</a>
          <button class="btn btn-secondary" id="scan-btn">📁 Scan Folder</button>
          ${t==="series"?'<button class="btn btn-primary" id="add-series-btn">+ Add Series</button>':'<button class="btn btn-primary" id="add-manga-btn">+ Add Manga</button>'}
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
          <button class="view-toggle-btn ${t==="manga"?"active":""}" data-view="manga">📚 Manga</button>
          <button class="view-toggle-btn ${t==="series"?"active":""}" data-view="series">📖 Series</button>
        </div>
        <button class="mobile-menu-item" id="mobile-favorites-btn">⭐ Favorites</button>
        <a href="#/queue" class="mobile-menu-item">📋 Task Queue</a>
        <button class="mobile-menu-item" id="mobile-scan-btn">📁 Scan Folder</button>
        ${t==="series"?'<button class="mobile-menu-item primary" id="mobile-add-series-btn">+ Add Series</button>':'<button class="mobile-menu-item primary" id="mobile-add-btn">+ Add Manga</button>'}
        <button class="mobile-menu-item" id="mobile-logout-btn">🚪 Logout</button>
        <a href="#/admin" class="mobile-menu-item">🔧 Admin</a>
        <a href="#/settings" class="mobile-menu-item">⚙️ Settings</a>
      </div>
    </header>
  `}function ie(){const t=document.getElementById("hamburger-btn"),e=document.getElementById("mobile-menu");t&&e&&t.addEventListener("click",()=>{e.classList.toggle("hidden")});const s=document.getElementById("logout-btn"),a=document.getElementById("mobile-logout-btn"),n=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};s&&s.addEventListener("click",n),a&&a.addEventListener("click",n),document.querySelectorAll("[data-view]").forEach(y=>{y.addEventListener("click",()=>{const g=y.dataset.view;localStorage.setItem("library_view_mode",g),document.querySelectorAll("[data-view]").forEach(p=>{p.classList.toggle("active",p.dataset.view===g)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:g}}))})});const o=document.querySelector(".logo");o&&o.addEventListener("click",y=>{localStorage.removeItem("library_active_category"),window.dispatchEvent(new CustomEvent("clearFilters"))});const r=document.getElementById("favorites-btn"),u=document.getElementById("mobile-favorites-btn"),c=y=>{y.preventDefault(),P.go("/favorites")};r&&r.addEventListener("click",c),u&&u.addEventListener("click",c);const b=document.getElementById("queue-nav-btn");b&&b.addEventListener("click",y=>{y.preventDefault(),P.go("/queue")});const v=document.getElementById("scan-btn"),w=document.getElementById("mobile-scan-btn");if(v||w){const y=()=>{na(v,w,async()=>{await X.loadBookmarks(!0),P.reload()})};v&&v.addEventListener("click",y),w&&w.addEventListener("click",y)}}let C={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0},Re=[];function mt(t){return[...t].sort((e,s)=>{var a,n;switch(C.sortBy){case"az":return(e.alias||e.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(e.alias||e.title);case"lastread":return(s.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const o=((a=e.chapters)==null?void 0:a.length)||e.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-o}case"updated":default:return(s.updatedAt||"").localeCompare(e.updatedAt||"")}})}function gt(t){var v,w,y;const e=t.alias||t.title,s=t.downloadedCount??((v=t.downloadedChapters)==null?void 0:v.length)??0,a=new Set(t.excludedChapters||[]),n=(t.chapters||[]).filter(g=>!a.has(g.number)),o=new Set(n.map(g=>g.number)).size||t.uniqueChapters||0,r=t.readCount??((w=t.readChapters)==null?void 0:w.length)??0,u=(t.updatedCount??((y=t.updatedChapters)==null?void 0:y.length)??0)>0,c=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover,b=t.source==="local";return`
    <div class="manga-card" data-id="${t.id}">
      <div class="manga-card-cover">
        ${c?`<img src="${c}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:`<div class="placeholder">${b?"💾":"📚"}</div>`}
        <div class="manga-card-badges">
          ${r>0?`<span class="badge badge-read" title="Read">${r}</span>`:""}
          <span class="badge badge-chapters" title="Total">${o}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${u?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${t.autoCheck?'<span class="badge badge-monitored" title="Auto-check enabled">⏰</span>':""}
          ${C.activeCategory==="Favorites"?'<span class="badge badge-play" title="Click to Read">▶</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function ft(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function oa(t){var n;const e=t.alias||t.title,s=((n=t.entries)==null?void 0:n.length)||t.entry_count||0;let a=null;return t.localCover&&t.coverBookmarkId?a=`/api/public/covers/${t.coverBookmarkId}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(a=t.cover),`
    <div class="manga-card series-card" data-series-id="${t.id}">
      <div class="manga-card-cover">
        ${a?`<img src="${a}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>'}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${s} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function De(){const t=localStorage.getItem("library_view_mode");if(t&&t!==C.viewMode&&(C.viewMode=t),C.activeCategory==="Favorites")return P.go("/favorites"),"";let e="";if(C.viewMode==="series"){const s=C.series.map(oa).join("");e=`
      <div class="library-grid" id="library-grid">
        ${C.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{let s=C.activeCategory?C.bookmarks.filter(n=>(n.categories||[]).includes(C.activeCategory)):C.bookmarks;if(C.artistFilter&&(s=s.filter(n=>(n.artists||[]).includes(C.artistFilter))),C.searchQuery){const n=C.searchQuery.toLowerCase();s=s.filter(o=>(o.title||"").toLowerCase().includes(n)||(o.alias||"").toLowerCase().includes(n)||(o.artists||[]).some(r=>r.toLowerCase().includes(n)))}s=mt(s);const a=s.map(gt).join("");e=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" id="library-search" placeholder="Search manga or author..." value="${C.searchQuery}" autocomplete="off">
          ${C.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${C.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${C.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${C.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${C.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${C.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
      </div>
      ${C.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">🎨</span>
          <span class="artist-filter-name">${C.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${C.loading?'<div class="loading-spinner"></div>':a||ft()}
      </div>
    `}return`
    ${G(C.viewMode)}
    <div class="container">
      ${e}
    </div>
    ${ra()}
    ${la()}
    ${ca()}
  `}function ra(){const{activeCategory:t}=C,e=Array.isArray(C.categories)?C.categories:[];return`
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${t?"has-filter":""}" id="category-fab-btn">
        ${t||"🏷️"}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn">⚙️</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${t?"":"active"}" data-category="">All</button>
          ${e.map(s=>`
            <button class="category-menu-item ${t===s?"active":""}" data-category="${s}">
              ${s}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
      `}function la(){return`
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
      `}function ca(){return`
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
      `}function tt(){C.activeCategory=null,C.artistFilter=null,C.searchQuery="",localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),te()}async function st(t){const e=t.target.closest(".manga-card");if(e){if(e.classList.contains("gallery-card")){const n=e.dataset.gallery;P.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=e.dataset.id,a=e.dataset.seriesId;if(a){P.go(`/series/${a}`);return}if(s){if(C.activeCategory==="Favorites"){const n=C.bookmarks.find(o=>o.id===s);if(n){let o=n.last_read_chapter;if(!o&&n.chapters&&n.chapters.length>0&&(o=[...n.chapters].sort((u,c)=>u.number-c.number)[0].number),o){P.go(`/read/${s}/${o}`);return}else d("No chapters available to read","warning")}}P.go(`/manga/${s}`)}}}function Vt(){const t=document.getElementById("app");t.removeEventListener("click",st),t.addEventListener("click",st),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",l=>{C.viewMode=l.detail.mode;const h=document.getElementById("app");h.innerHTML=De(),Vt(),ie()}));const e=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");e&&s&&(e.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",l=>{const h=l.target.closest(".category-menu-item");if(h){const k=h.dataset.category||null;da(k),s.classList.add("hidden")}}));const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{C.artistFilter=null,te()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",l=>{var k;C.searchQuery=l.target.value,localStorage.setItem("library_search",l.target.value);const h=document.getElementById("library-grid");if(h){let $=C.activeCategory?C.bookmarks.filter(T=>(T.categories||[]).includes(C.activeCategory)):C.bookmarks;if(C.artistFilter&&($=$.filter(T=>(T.artists||[]).includes(C.artistFilter))),C.searchQuery){const T=C.searchQuery.toLowerCase();$=$.filter(U=>(U.title||"").toLowerCase().includes(T)||(U.alias||"").toLowerCase().includes(T))}$=mt($),h.innerHTML=$.map(gt).join("")||ft();const I=document.getElementById("search-clear");!I&&C.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(k=document.getElementById("search-clear"))==null||k.addEventListener("click",()=>{C.searchQuery="",localStorage.removeItem("library_search"),n.value="",te()})):I&&!C.searchQuery&&I.remove()}}),C.searchQuery&&n.focus());const o=document.getElementById("search-clear");o&&o.addEventListener("click",()=>{C.searchQuery="",te()});const r=document.getElementById("library-sort");r&&r.addEventListener("change",l=>{C.sortBy=l.target.value,localStorage.setItem("library_sort",C.sortBy),te()}),window.removeEventListener("clearFilters",tt),window.addEventListener("clearFilters",tt);const u=document.getElementById("add-manga-btn"),c=document.getElementById("add-modal"),b=document.getElementById("add-modal-close"),v=document.getElementById("add-modal-cancel"),w=document.getElementById("add-modal-submit");u&&c&&u.addEventListener("click",()=>c.classList.add("open")),b&&b.addEventListener("click",()=>c.classList.remove("open")),v&&v.addEventListener("click",()=>c.classList.remove("open")),w&&w.addEventListener("click",async()=>{const l=document.getElementById("manga-url"),h=l.value.trim();if(!h){d("Please enter a URL","error");return}try{w.disabled=!0,w.textContent="Adding...",await f.addBookmark(h),d("Manga added successfully!","success"),c.classList.remove("open"),l.value="",await at(),te()}catch(k){d("Failed to add manga: "+k.message,"error")}finally{w.disabled=!1,w.textContent="Add"}});const y=document.getElementById("add-series-btn"),g=document.getElementById("mobile-add-series-btn"),p=document.getElementById("add-series-modal"),L=document.getElementById("add-series-modal-close"),_=document.getElementById("add-series-modal-cancel"),x=document.getElementById("add-series-modal-submit");if((y||g)&&p){const l=()=>p.classList.add("open");y&&y.addEventListener("click",l),g&&g.addEventListener("click",l)}L&&L.addEventListener("click",()=>p.classList.remove("open")),_&&_.addEventListener("click",()=>p.classList.remove("open")),x&&x.addEventListener("click",async()=>{const l=document.getElementById("series-title"),h=document.getElementById("series-alias"),k=l.value.trim(),$=h.value.trim();if(!k){d("Please enter a title","error");return}try{x.disabled=!0,x.textContent="Creating...",await f.createSeries(k,$),d("Series created successfully!","success"),p.classList.remove("open"),l.value="",h.value="",await at(!0),te()}catch(I){d("Failed to create series: "+I.message,"error")}finally{x.disabled=!1,x.textContent="Create"}});const M=p==null?void 0:p.querySelector(".modal-overlay");M&&M.addEventListener("click",()=>p.classList.remove("open"));const B=document.getElementById("empty-add-btn");B&&c&&B.addEventListener("click",()=>c.classList.add("open"));const E=document.getElementById("empty-add-series-btn");E&&p&&E.addEventListener("click",()=>p.classList.add("open"));const S=c==null?void 0:c.querySelector(".modal-overlay");S&&S.addEventListener("click",()=>c.classList.remove("open")),ie()}function da(t){C.activeCategory=t,t?localStorage.setItem("library_active_category",t):localStorage.removeItem("library_active_category"),te()}async function at(t=!1){try{const[e,s,a,n]=await Promise.all([X.loadBookmarks(t),X.loadCategories(t),X.loadSeries(t),X.loadFavorites(t)]);C.bookmarks=e,C.categories=s,C.series=a,C.favorites=n,C.loading=!1}catch{d("Failed to load library","error"),C.loading=!1}}async function te(){const t=document.getElementById("app"),e=localStorage.getItem("library_active_category");C.activeCategory!==e&&(C.activeCategory=e);const s=localStorage.getItem("library_artist_filter");s&&C.artistFilter!==s&&(C.artistFilter=s),C.loading&&(t.innerHTML=De()),C.bookmarks.length===0&&C.loading&&await at(),t.innerHTML=De(),Vt(),Re.forEach(a=>a()),Re=[X.subscribe("bookmarks",a=>{C.bookmarks=a;const n=document.getElementById("library-grid");if(n){let o=C.activeCategory?C.bookmarks.filter(r=>(r.categories||[]).includes(C.activeCategory)):C.bookmarks;if(C.artistFilter&&(o=o.filter(r=>(r.artists||[]).includes(C.artistFilter))),C.searchQuery){const r=C.searchQuery.toLowerCase();o=o.filter(u=>(u.title||"").toLowerCase().includes(r)||(u.alias||"").toLowerCase().includes(r))}o=mt(o),n.innerHTML=o.map(gt).join("")||ft()}})]}function ua(){const t=document.getElementById("app");t&&t.removeEventListener("click",st),window.removeEventListener("clearFilters",tt),Re.forEach(e=>e()),Re=[]}const ha={mount:te,unmount:ua,render:De};let i={manga:null,chapter:null,images:[],trophyPages:{},mode:"webtoon",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!1,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null};function Ht(){if(!i.manga||!i.chapter||!i.allFavorites||!i.allFavorites.favorites)return!1;if(i.isCollectionMode)return!0;let e=[it()];if(i.mode==="manga"&&!i.singlePageMode){const n=q()[i.currentPage];n&&Array.isArray(n)?e=n:n&&n.pages&&(e=n.pages)}const s=e.map(a=>{const n=Ee(i.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in i.allFavorites.favorites){const n=i.allFavorites.favorites[a];if(Array.isArray(n)){for(const o of n)if(o.mangaId===i.manga.id&&o.chapterNum===i.chapter.number&&o.imagePaths)for(const r of o.imagePaths){const u=typeof r=="string"?r:(r==null?void 0:r.filename)||(r==null?void 0:r.path);for(const c of s)if(c&&c.filename===u)return!0}}}return!1}function nt(){const t=document.getElementById("favorites-btn");t&&(Ht()?t.classList.add("active"):t.classList.remove("active"))}function re(){var b;if(i.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!i.manga||!i.images.length)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const t=i.manga.alias||i.manga.title,e=(b=i.chapter)==null?void 0:b.number,a=q().length,n=i.images.length;let o,r;i.mode==="webtoon"?(o=n-1,r=`${n} pages`):i.singlePageMode?(o=n-1,r=`${i.currentPage+1} / ${n}`):(o=a-1,r=`${i.currentPage+1} / ${a}`);const u=Ht(),c=Wt();return`
    <div class="reader ${i.mode}-mode ${i.showControls?"":"controls-hidden"}">
      <!-- Unified Top Bar -->
      <div class="reader-bar">
        <button class="reader-bar-btn close-btn" id="reader-close-btn" title="Back">×</button>
        <div class="reader-title">
          <span class="manga-name">${t}</span>
          <span class="chapter-name">Ch. ${e}</span>
        </div>
        ${i.isCollectionMode?"":`
        <div class="reader-bar-tools" id="reader-toolbar">
          <button class="reader-bar-btn ${u?"active":""}" id="favorites-btn" title="Add to favorites">⭐</button>
          
          <button class="reader-bar-btn" id="rotate-btn" title="Rotate 90° CW">🔄</button>
          ${i.mode==="manga"&&!i.singlePageMode?`
            <button class="reader-bar-btn" id="swap-btn" title="Swap pages in spread">⇄</button>
          `:""}
          ${i.singlePageMode||i.mode==="webtoon"?`
            <button class="reader-bar-btn" id="split-btn" title="Split wide image into halves">✂️</button>
          `:""}
          <span class="reader-bar-divider"></span>
          ${i.mode==="manga"?`
            <button class="reader-bar-btn ${i.singlePageMode?"active":""}" id="single-page-btn" title="${i.singlePageMode?"Switch to double page":"Switch to single page"}">
              ${i.singlePageMode?"1️⃣":"2️⃣"}
            </button>
            <button class="reader-bar-btn ${c?"active":""}" id="trophy-btn" title="${c?"Unmark trophy":"Mark as trophy"}">🏆</button>
          `:""}
          <button class="reader-bar-btn" id="fullscreen-btn" title="Toggle fullscreen">⛶</button>
          <button class="reader-bar-btn" id="reader-settings-btn" title="Settings">⚙️</button>
        </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${i.mode==="webtoon"?`zoom: ${i.zoom}%`:""}">
        ${i.isCollectionMode?zt():i.mode==="webtoon"?jt():Qt()}
      </div>
      
      <!-- Footer -->
      <div class="reader-footer">
        <button class="btn btn-secondary" id="prev-chapter-btn">← Prev</button>
        <div class="page-slider-container">
          ${i.mode!=="webtoon"?`
          <input type="range" class="page-slider" id="page-slider"
            min="0" max="${o}" value="${i.currentPage}"
          >
          `:""}
          <span class="page-indicator" id="page-indicator">${r}</span>
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
              <button class="btn ${i.mode==="webtoon"?"btn-primary":"btn-secondary"}" data-mode="webtoon">Webtoon</button>
              <button class="btn ${i.mode==="manga"?"btn-primary":"btn-secondary"}" data-mode="manga">Manga</button>
            </div>
          </div>
          ${i.mode==="webtoon"?`
          <div class="setting-row">
            <label>Zoom: ${i.zoom}%</label>
            <input type="range" min="50" max="200" value="${i.zoom}" id="zoom-slider">
          </div>
          `:`
          <div class="setting-row">
            <label>Direction</label>
            <div class="btn-group">
              <button class="btn ${i.direction==="rtl"?"btn-primary":"btn-secondary"}" data-direction="rtl">RTL ←</button>
              <button class="btn ${i.direction==="ltr"?"btn-primary":"btn-secondary"}" data-direction="ltr">→ LTR</button>
            </div>
          </div>
          <div class="settings-divider"></div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="first-page-single" ${i.firstPageSingle?"checked":""}> First Page Single
            </label>
            <span class="setting-hint">Show cover page alone</span>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="last-page-single" ${i.lastPageSingle?"checked":""}> 
                Link to Next Chapter
            </label>
            <span class="setting-hint">Pair last page with next chapter's first page</span>
          </div>
          `}
          <button class="btn btn-secondary settings-close-btn" id="close-settings-btn">Close</button>
        </div>
      </div>
    </div>
  `}function zt(){const t=i.mode==="manga";if(t&&!i.singlePageMode){const e=i.images[i.currentPage];if(!e)return"";const s=e.urls||[e.url],a=e.displayMode||"single";return e.displaySide,a==="double"&&s.length>=2?`
            <div class="manga-spread collection-spread ${i.direction} double-page">
              <div class="manga-page"><img src="${s[0]}" alt="Page A"></div>
              <div class="manga-page"><img src="${s[1]}" alt="Page B"></div>
            </div>
            `:`
            <div class="manga-spread collection-spread single ${i.direction}">
              <div class="manga-page"><img src="${s[0]}" alt="Page"></div>
            </div>
            `}return`
    <div class="${t?"manga-spread single "+i.direction:"gallery-pages"}">
      ${(t?[i.images[i.currentPage]]:i.images).map((e,s)=>{if(!e)return"";const a=e.displayMode||"single",n=e.displaySide||"left",o=e.urls||[e.url];return a==="double"&&o.length>=2?`
            <div class="gallery-page double-page side-${n} ${t?"manga-page":""}" data-page="${s}">
              <img src="${o[0]}" alt="Page ${s+1}A" loading="lazy">
              <img src="${o[1]}" alt="Page ${s+1}B" loading="lazy">
            </div>
          `:`
            <div class="gallery-page single-page ${t?"manga-page":""}" data-page="${s}">
              <img src="${o[0]}" alt="Page ${s+1}" loading="lazy">
            </div>
          `}).join("")}
    </div>
  `}function jt(){return`
    <div class="webtoon-pages">
      ${i.images.map((t,e)=>{const s=typeof t=="string"?t:t.url,a=i.trophyPages[e];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${e}">
          ${a?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${s}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function Qt(){if(i.singlePageMode)return pa();const e=q()[i.currentPage];if(!e)return"";if(e.type==="link"){const s=e.pages[0],a=i.images[s],n=typeof a=="string"?a:a.url,o=i.trophyPages[s];return`
        <div class="manga-spread ${i.direction}">
          <div class="manga-page ${o?"trophy-page":""}">
            ${o?'<div class="trophy-indicator">🏆</div>':""}
            <img src="${n}" alt="Page ${s+1}">
          </div>
          <div class="manga-page link-page" id="link-page">
            <div class="link-overlay">Ch. ${e.nextChapter} →</div>
            <img src="${e.nextImage}" alt="Next chapter preview">
          </div>
        </div>
      `}return`
    <div class="manga-spread ${i.direction}">
      ${e.map(s=>{const a=i.images[s],n=typeof a=="string"?a:a.url,o=i.trophyPages[s];return`
        <div class="manga-page ${o?"trophy-page":""}">
          ${o?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${n}" alt="Page ${s+1}">
        </div>
      `}).join("")}
    </div>
  `}function pa(){const t=i.currentPage,e=i.trophyPages[t];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[o,r]=e.pages,u=i.images[o],c=i.images[r],b=typeof u=="string"?u:u==null?void 0:u.url,v=typeof c=="string"?c:c==null?void 0:c.url;if(b&&v)return`
            <div class="manga-spread ${i.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${b}" alt="Page ${o+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${v}" alt="Page ${r+1}"></div>
            </div>
            `}const s=i.images[t];if(!s)return"";const a=typeof s=="string"?s:s.url,n=i.trophyPages[t];return`
    <div class="manga-spread single ${i.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?'<div class="trophy-indicator">🏆</div>':""}
        <img src="${a}" alt="Page ${t+1}">
      </div>
    </div>
  `}function q(){const t=[],e=i.images.length;let s=0;if(i.isCollectionMode){for(let n=0;n<e;n++)t.push([n]);return t}let a=!i.firstPageSingle;for(;s<e;){const n=i.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[o,r]=n.pages;t.push([o,r]),s=Math.max(o,r)+1}else t.push([s]),s++;continue}if(!a){a=!0,t.push([s]),s++;continue}if(i.lastPageSingle&&s===e-1){i.nextChapterImage?t.push({type:"link",pages:[s],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):t.push([s]),s++;break}s+1<e?i.trophyPages[s+1]?(t.push([s]),s++):i.lastPageSingle&&s+1===e-1?(t.push([s]),i.nextChapterImage?t.push({type:"link",pages:[s+1],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):t.push([s+1]),s+=2):(t.push([s,s+1]),s+=2):(t.push([s]),s++)}return t}function Wt(){if(i.singlePageMode)return!!i.trophyPages[i.currentPage];const e=q()[i.currentPage];return e?(Array.isArray(e)?e:e.pages||[]).some(a=>!!i.trophyPages[a]):!1}function Gt(){if(i.singlePageMode)return[i.currentPage];const e=q()[i.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function ma(){if(!i.manga||!i.chapter||i.isCollectionMode)return;const t=Gt();if(t.length===0)return;if(t.some(s=>!!i.trophyPages[s])){const s=[...t];if(i.singlePageMode){const a=i.trophyPages[i.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete i.trophyPages[a]),d(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=t,a=i.singlePageMode||t.length===1;if(!i.singlePageMode&&t.length===2){const o=await Jt(t,"Mark as trophy 🏆");if(!o)return;s=o.pages,a=o.pages.length===1}s.forEach(o=>{i.trophyPages[o]={isSingle:a,pages:[...s]}});const n=a?"single":"double";d(`Page${s.length>1?"s":""} marked as trophy (${n}) 🏆`,"success")}try{await f.saveTrophyPages(i.manga.id,i.chapter.number,i.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}ae(),Kt()}function Kt(){const t=document.getElementById("trophy-btn");if(t){const e=Wt();t.classList.toggle("active",e),t.title=e?"Unmark trophy":"Mark as trophy"}}async function $e(){if(!i.manga||!i.chapter||i.isCollectionMode||!i.images.length)return;let t=1;if(i.mode==="manga")if(i.singlePageMode)t=i.currentPage+1;else{const s=q()[i.currentPage];s&&s.length>0&&(t=s[0]+1)}else{const e=document.getElementById("reader-content");if(e){const s=e.querySelectorAll("img"),a=e.scrollTop;let n=0;s.forEach((o,r)=>{a>=n&&(t=r+1),n+=o.offsetHeight})}}try{await f.updateReadingProgress(i.manga.id,i.chapter.number,t,i.images.length)}catch(e){console.error("Failed to save progress:",e)}}function Ne(){var s,a,n,o,r,u,c,b,v,w,y,g,p,L,_,x,M,B;const t=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{await $e(),i.manga&&i.manga.id!=="gallery"?P.go(`/manga/${i.manga.id}`):P.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{P.go("/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var E;(E=document.getElementById("reader-settings"))==null||E.classList.toggle("hidden")}),(o=document.getElementById("close-settings-btn"))==null||o.addEventListener("click",()=>{var E;(E=document.getElementById("reader-settings"))==null||E.classList.add("hidden")}),(r=document.getElementById("single-page-btn"))==null||r.addEventListener("click",()=>{if(i.singlePageMode){const E=q();let S=0;for(let l=0;l<E.length;l++)if(E[l].includes(i.currentPage)){S=l;break}i.singlePageMode=!1,i.currentPage=S}else{const S=q()[i.currentPage];i.singlePageMode=!0,i.currentPage=S?S[0]:0}Te()}),(u=document.getElementById("trophy-btn"))==null||u.addEventListener("click",()=>{ma()}),t.querySelectorAll("[data-mode]").forEach(E=>{E.addEventListener("click",()=>{var h,k;const S=E.dataset.mode;let l=it();if(i.mode=S,localStorage.setItem("reader_mode",i.mode),S==="webtoon")i.currentPage=l;else if(i.singlePageMode)i.currentPage=l;else{const $=q();let I=0;for(let T=0;T<$.length;T++)if($[T].includes(l)){I=T;break}i.currentPage=I}(h=i.manga)!=null&&h.id&&((k=i.chapter)!=null&&k.number)&&xe(),Te(),S==="webtoon"&&setTimeout(()=>{const $=document.getElementById("reader-content");if($){const I=$.querySelectorAll("img");I[l]&&I[l].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),t.querySelectorAll("[data-direction]").forEach(E=>{E.addEventListener("click",async()=>{var S,l;i.direction=E.dataset.direction,localStorage.setItem("reader_direction",i.direction),(S=i.manga)!=null&&S.id&&((l=i.chapter)!=null&&l.number)&&await xe(),Te()})}),(c=document.getElementById("first-page-single"))==null||c.addEventListener("change",async E=>{i.firstPageSingle=E.target.checked,await xe(),ae()}),(b=document.getElementById("last-page-single"))==null||b.addEventListener("change",async E=>{var S,l;i.lastPageSingle=E.target.checked,await xe(),i.lastPageSingle&&((S=i.manga)!=null&&S.id)&&((l=i.chapter)!=null&&l.number)?await Yt():(i.nextChapterImage=null,i.nextChapterNum=null),ae()}),(v=document.getElementById("zoom-slider"))==null||v.addEventListener("input",E=>{i.zoom=parseInt(E.target.value);const S=document.getElementById("reader-content");S&&(S.style.zoom=`${i.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",E=>{const S=parseInt(E.target.value),l=document.getElementById("page-indicator");l&&(i.singlePageMode?l.textContent=`${S+1} / ${i.images.length}`:l.textContent=`${S+1} / ${q().length}`)}),e.addEventListener("change",E=>{i.currentPage=parseInt(E.target.value),ae()})),i.mode==="manga"){const E=document.getElementById("reader-content");E==null||E.addEventListener("click",S=>{var $;if(S.target.closest("button, a, .link-overlay"))return;const l=E.getBoundingClientRect(),k=(S.clientX-l.left)/l.width;k<.3?ot():k>.7?Ae():(i.showControls=!i.showControls,($=document.querySelector(".reader"))==null||$.classList.toggle("controls-hidden",!i.showControls))})}document.addEventListener("keydown",Xt),(w=document.getElementById("prev-chapter-btn"))==null||w.addEventListener("click",()=>qe(-1)),(y=document.getElementById("next-chapter-btn"))==null||y.addEventListener("click",()=>qe(1)),i.mode==="webtoon"&&((g=document.getElementById("reader-content"))==null||g.addEventListener("click",()=>{var E;i.showControls=!i.showControls,(E=document.querySelector(".reader"))==null||E.classList.toggle("controls-hidden",!i.showControls)})),(p=document.getElementById("rotate-btn"))==null||p.addEventListener("click",async()=>{const E=We();if(!(!E||!i.manga||!i.chapter))try{d("Rotating...","info");const S=await f.rotatePage(i.manga.id,i.chapter.number,E);S.images&&(await Ge(S.images),d("Page rotated","success"))}catch(S){d("Rotate failed: "+S.message,"error")}}),(L=document.getElementById("swap-btn"))==null||L.addEventListener("click",async()=>{const S=q()[i.currentPage];if(!S||S.length!==2||!i.manga||!i.chapter){d("Select a spread with 2 pages to swap","info");return}const l=Ee(i.images[S[0]]),h=Ee(i.images[S[1]]);if(!(!l||!h))try{d("Swapping...","info");const k=await f.swapPages(i.manga.id,i.chapter.number,l,h);k.images&&(await Ge(k.images),d("Pages swapped","success"))}catch(k){d("Swap failed: "+k.message,"error")}}),(_=document.getElementById("split-btn"))==null||_.addEventListener("click",async()=>{const E=We();if(!E||!i.manga||!i.chapter||!confirm("Split this page into halves? This is permanent."))return;const S=document.getElementById("split-btn");try{d("Preparing to split...","info"),S&&(S.disabled=!0),i.images=[],i.loading=!0,t.innerHTML=re(),await new Promise(h=>setTimeout(h,2e3)),d("Splitting page...","info");const l=await f.splitPage(i.manga.id,i.chapter.number,E);S&&(S.disabled=!1),await we(i.manga.id,i.chapter.number,i.chapter.versionUrl),t.innerHTML=re(),Ne(),ae(),l.warning?d(l.warning,"warning"):d("Page split into halves","success")}catch(l){S&&(S.disabled=!1),d("Split failed: "+l.message,"error"),await we(i.manga.id,i.chapter.number,i.chapter.versionUrl),t.innerHTML=re(),Ne()}}),(x=document.getElementById("delete-page-btn"))==null||x.addEventListener("click",async()=>{const E=We();if(!(!E||!i.manga||!i.chapter)&&confirm(`Delete page "${E}" permanently? This cannot be undone.`))try{d("Deleting...","info");const S=await f.deletePage(i.manga.id,i.chapter.number,E);S.images&&(await Ge(S.images),d("Page deleted","success"))}catch(S){d("Delete failed: "+S.message,"error")}}),(M=document.getElementById("favorites-btn"))==null||M.addEventListener("click",async()=>{try{const l=await f.getFavorites();i.allFavorites=l,i.favoriteLists=Object.keys(l.favorites||l||{})}catch(l){console.error("Failed to load favorites",l),d("Failed to load favorites","error");return}let S=[it()];if(i.mode==="manga"&&!i.singlePageMode){const h=q()[i.currentPage];h&&Array.isArray(h)?S=h:h&&h.pages&&(S=h.pages)}if(S.length>1){const l=await Jt(S,"Select Page for Favorites ⭐");if(!l)return;S=l.pages}fa(S)}),(B=document.getElementById("fullscreen-btn"))==null||B.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{d("Fullscreen not supported","info")})}),document.body.classList.add("reader-active")}function Ee(t){var n;const e=typeof t=="string"?t:(t==null?void 0:t.url)||((n=t==null?void 0:t.urls)==null?void 0:n[0]);if(!e)return null;const a=e.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function We(){const t=Gt();return t.length===0?null:Ee(i.images[t[0]])}async function Ge(t){const e=Date.now();if(i.images=t.map(s=>s+(s.includes("?")?"&":"?")+`_t=${e}`),i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.min(i.currentPage,i.images.length-1);else{const s=q();i.currentPage=Math.min(i.currentPage,s.length-1)}i.currentPage=Math.max(0,i.currentPage),ae()}async function Yt(){var t,e;if(!(!((t=i.manga)!=null&&t.id)||!((e=i.chapter)!=null&&e.number)))try{const s=await f.getNextChapterPreview(i.manga.id,i.chapter.number);i.nextChapterImage=s.firstImage||null,i.nextChapterNum=s.nextChapter||null}catch{i.nextChapterImage=null,i.nextChapterNum=null}}function ga(t,e){return new Promise(s=>{const a=document.createElement("div");a.className="version-modal-overlay",a.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${t.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const n=a.querySelector(".version-list");t.forEach((o,r)=>{const u=document.createElement("button");u.className="version-item",u.textContent=`Version ${r+1}`,u.addEventListener("click",()=>{a.remove(),s(o)}),n.appendChild(u)}),a.querySelector(".version-cancel").addEventListener("click",()=>{a.remove(),s(null)}),a.addEventListener("click",o=>{o.target===a&&(a.remove(),s(null))}),document.body.appendChild(a)})}function fa(t){if(!i.manga||!i.chapter)return;const e=t.map(c=>{const b=Ee(i.images[c]);return b?{filename:b}:null}).filter(Boolean),s=c=>{if(!i.allFavorites||!i.allFavorites.favorites)return-1;const b=i.allFavorites.favorites[c];if(!Array.isArray(b))return-1;for(let v=0;v<b.length;v++){const w=b[v];if(w.mangaId===i.manga.id&&w.chapterNum===i.chapter.number&&w.imagePaths)for(const y of w.imagePaths){const g=typeof y=="string"?y:(y==null?void 0:y.filename)||(y==null?void 0:y.path);for(const p of e)if(p&&p.filename===g)return v}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";i.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',i.favoriteLists.forEach(c=>{const v=s(c)!==-1;n+=`
                <button class="page-picker-option list-option ${v?"active-list":""}" data-list="${c}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${c}</span>
                    <span style="font-size: 1.2em;">${v?"✅":"➕"}</span>
                </button>
            `}),n+="</div>"),a.innerHTML=`
        <div class="page-picker-modal" style="width: 90%; max-width: 400px;">
            <h3>Favorites ⭐</h3>
            <p class="page-picker-subtitle" style="margin-bottom: 20px;">Manage favorite lists</p>
            ${n}
            <div style="display: flex; gap: 10px;">
                <button class="page-picker-cancel" style="flex: 1;">Close</button>
            </div>
        </div>
    `;const o=document.createElement("style");o.innerHTML=`
        .list-option.active-list {
            background: #2a3b2a;
            border-color: #4CAF50;
        }
        .list-option.active-list:hover {
            background: #384d38;
        }
    `,a.appendChild(o),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),nt()}),a.addEventListener("click",c=>{c.target===a&&(a.remove(),nt())}),a.querySelectorAll(".list-option").forEach(c=>{c.addEventListener("click",async()=>{const b=c.dataset.list,v=s(b),w=v!==-1;c.style.opacity="0.5",c.style.pointerEvents="none";try{if(w){await f.removeFavoriteItem(b,v);const y=await f.getFavorites();i.allFavorites=y,c.classList.remove("active-list"),c.querySelector("span:last-child").textContent="➕"}else{const y=t.length>1?"double":"single",g={mangaId:i.manga.id,chapterNum:i.chapter.number,title:`${i.manga.alias||i.manga.title} Ch.${i.chapter.number} p${t[0]+1}`,imagePaths:e,displayMode:y,displaySide:i.direction==="rtl"?"right":"left"};await f.addFavoriteItem(b,g);const p=await f.getFavorites();i.allFavorites=p,c.classList.add("active-list"),c.querySelector("span:last-child").textContent="✅"}}catch(y){console.error(y)}finally{c.style.opacity="1",c.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function Jt(t,e){return new Promise(s=>{const[a,n]=t,o=i.images[a],r=i.images[n],u=typeof o=="string"?o:o==null?void 0:o.url,c=typeof r=="string"?r:r==null?void 0:r.url,b=i.direction==="rtl",v=b?n:a,w=b?a:n,y=b?c:u,g=b?u:c,p=document.createElement("div");p.className="page-picker-overlay",p.innerHTML=`
            <div class="page-picker-modal">
                <h3>${e}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${v+1}">
                        <img src="${y}" alt="Page ${v+1}">
                        <span class="page-picker-label">Page ${v+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${w+1}">
                        <img src="${g}" alt="Page ${w+1}">
                        <span class="page-picker-label">Page ${w+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    📖 Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const L=_=>{p.remove(),s(_)};p.querySelectorAll(".page-picker-option").forEach(_=>{_.addEventListener("click",()=>{const x=_.dataset.choice;x==="left"?L({pages:[v]}):x==="right"?L({pages:[w]}):x==="both"&&L({pages:t})})}),p.querySelector(".page-picker-cancel").addEventListener("click",()=>L(null)),p.addEventListener("click",_=>{_.target===p&&L(null)}),document.body.appendChild(p)})}function it(){if(i.mode==="webtoon"){const t=document.getElementById("reader-content");if(t){const e=t.querySelectorAll("img");if(e.length>0){const s=t.scrollTop;if(s>10){let a=0;for(let n=0;n<e.length;n++){const o=e[n].offsetHeight;if(a+o>s)return n;a+=o}}}}return 0}else{if(i.singlePageMode)return i.currentPage;{const e=q()[i.currentPage];return e&&e.length>0?e[0]:0}}}function Xt(t){if(!(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA")){if(t.key==="Escape"){$e(),i.manga&&P.go(`/manga/${i.manga.id}`);return}if(i.mode==="manga")t.key==="ArrowLeft"?i.direction==="rtl"?Ae():ot():t.key==="ArrowRight"?i.direction==="rtl"?ot():Ae():t.key===" "&&(t.preventDefault(),Ae());else if(i.mode==="webtoon"&&t.key===" "){t.preventDefault();const e=document.getElementById("reader-content");if(e){const s=e.clientHeight*.8;e.scrollBy({top:t.shiftKey?-s:s,behavior:"smooth"})}}}}function Ae(){const t=q(),e=i.singlePageMode?i.images.length-1:t.length-1;if(i.currentPage<e)i.currentPage++,ae();else{const s=t[i.currentPage],a=s&&s.type==="link";$e(),a&&(i.navigationDirection="next-linked"),qe(1)}}function ot(){i.currentPage>0?(i.currentPage--,ae()):qe(-1)}function ae(){const t=document.getElementById("reader-content");if(t){t.innerHTML=i.isCollectionMode?zt():i.mode==="webtoon"?jt():Qt();const e=document.getElementById("page-indicator");e&&(i.singlePageMode?e.textContent=`${i.currentPage+1} / ${i.images.length}`:e.textContent=`${i.currentPage+1} / ${q().length}`);const s=document.getElementById("page-slider");s&&(s.value=i.currentPage,s.max=i.singlePageMode?i.images.length-1:q().length-1),Kt(),nt()}}function Te(){const t=document.getElementById("app");t&&(t.innerHTML=re(),Ne())}async function qe(t){if(console.log("[Nav] navigateChapter called with delta:",t),!i.manga||!i.chapter){console.log("[Nav] early return - no manga or chapter");return}await $e();const s=[...i.manga.downloadedChapters||[]].sort((o,r)=>o-r),a=s.indexOf(i.chapter.number),n=a+t;console.log("[Nav]",{delta:t,chapterNumber:i.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length?(i.navigationDirection||(i.navigationDirection=t<0?"prev":null),console.log("[Nav] Calling router.go with:",`/read/${i.manga.id}/${s[n]}`),P.go(`/read/${i.manga.id}/${s[n]}`)):d(t>0?"Last chapter":"First chapter","info")}async function we(t,e,s){var a,n,o,r,u;console.log("[Reader] loadData called:",{mangaId:t,chapterNum:e,versionUrl:s});try{if(i.mode=localStorage.getItem("reader_mode")||"webtoon",i.direction=localStorage.getItem("reader_direction")||"rtl",t==="gallery"){const v=decodeURIComponent(e),y=((a=(await f.getFavorites()).favorites)==null?void 0:a[v])||[];i.images=[];for(const g of y){const p=g.imagePaths||[],L=[];for(const _ of p){let x;typeof _=="string"?x=_:_&&typeof _=="object"&&(x=_.filename||_.path||_.name||_.url,x&&x.includes("/")&&(x=x.split("/").pop()),x&&x.includes("\\")&&(x=x.split("\\").pop())),x&&L.push(`/api/public/chapter-images/${g.mangaId}/${g.chapterNum}/${encodeURIComponent(x)}`)}L.length>0&&i.images.push({urls:L,displayMode:g.displayMode||"single",displaySide:g.displaySide||"left"})}i.manga={id:"gallery",title:v,alias:v},i.chapter={number:"Gallery"},i.isGalleryMode=!0,i.isCollectionMode=!0,i.images.length===0&&d("Gallery is empty","warning")}else if(t==="trophies"){const v=e;let w=[],y="Trophies";if(v.startsWith("series-")){const g=v.replace("series-",""),L=(await store.loadSeries()).find(M=>M.id===g);y=L?L.alias||L.title:"Series Trophies";const x=(await store.loadBookmarks()).filter(M=>M.seriesId===g);for(const M of x){const B=await f.getTrophyPagesAll(M.id);for(const E in B)for(const S in B[E]){const l=B[E][S],k=(await f.getChapterImages(M.id,E)).images[S],$=typeof k=="string"?k.split("/").pop():(k==null?void 0:k.filename)||(k==null?void 0:k.path);w.push({mangaId:M.id,chapterNum:E,imagePaths:[{filename:$}],displayMode:l.isSingle?"single":"double",displaySide:"left"})}}}else{const g=await f.getBookmark(v);y=g?g.alias||g.title:"Manga Trophies";const p=await f.getTrophyPagesAll(v);for(const L in p)for(const _ in p[L]){const x=p[L][_],B=(await f.getChapterImages(v,L)).images[_],E=typeof B=="string"?B.split("/").pop():(B==null?void 0:B.filename)||(B==null?void 0:B.path);w.push({mangaId:v,chapterNum:L,imagePaths:[{filename:decodeURIComponent(E)}],displayMode:x.isSingle?"single":"double",displaySide:"left"})}}i.images=w.map(g=>{const p=g.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${g.mangaId}/${g.chapterNum}/${encodeURIComponent(p)}`],displayMode:g.displayMode,displaySide:g.displaySide}}),i.manga={id:"trophies",title:y,alias:y},i.chapter={number:"🏆"},i.isCollectionMode=!0,i.isGalleryMode=!1}else{i.isGalleryMode=!1;const v=await f.getBookmark(t);i.manga=v,console.log("[Reader] manga loaded, finding chapter..."),i.chapter=((n=v.chapters)==null?void 0:n.find(g=>g.number===parseFloat(e)))||{number:parseFloat(e)};const w=s?`/bookmarks/${t}/chapters/${e}/images?versionUrl=${encodeURIComponent(s)}`:`/bookmarks/${t}/chapters/${e}/images`,y=await f.get(w);console.log("[Reader] images loaded, count:",(o=y.images)==null?void 0:o.length),i.images=y.images||[];try{const g=await f.getChapterSettings(t,e);g&&(g.mode&&(i.mode=g.mode),g.direction&&(i.direction=g.direction),g.firstPageSingle!==void 0&&(i.firstPageSingle=g.firstPageSingle),g.lastPageSingle!==void 0&&(i.lastPageSingle=g.lastPageSingle))}catch(g){console.warn("Failed to load chapter settings",g)}try{const g=await f.getTrophyPages(t,e);i.trophyPages=g||{}}catch(g){console.warn("Failed to load trophy pages",g)}try{const g=await f.getFavorites();i.allFavorites=g,i.favoriteLists=Object.keys(g.favorites||g||{})}catch(g){console.warn("Failed to load favorites",g)}}const c=parseFloat(e),b=(u=(r=i.manga)==null?void 0:r.readingProgress)==null?void 0:u[c];if(b&&b.page<b.totalPages)if(i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,b.page-1);else{const v=Math.max(0,b.page-1),w=q();let y=0;for(let g=0;g<w.length;g++){const p=w[g],L=Array.isArray(p)?p:p.pages||[];if(L.includes(v)||L[0]>=v){y=g;break}y=g}i.currentPage=y}else i.currentPage=0,i._resumeScrollToPage=b.page-1;else i.currentPage=0}catch(c){console.error("Error loading chapter:",c),d("Failed to load chapter","error")}if(i.navigationDirection==="prev"&&i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,i.images.length-1);else{const c=q();i.currentPage=Math.max(0,c.length-1)}else if(i.navigationDirection==="next-linked"&&i.mode==="manga"&&i.images.length>1)if(i.singlePageMode)i.currentPage=1;else{const c=q();let b=0;for(let v=0;v<c.length;v++){const w=c[v];if((Array.isArray(w)?w:w.pages||[]).includes(1)){b=v;break}}i.currentPage=b}i.navigationDirection=null,i.lastPageSingle&&await Yt(),i.loading=!1,Te(),i.mode==="webtoon"&&i._resumeScrollToPage&&setTimeout(()=>{const c=document.getElementById("reader-content");if(c){const b=c.querySelectorAll("img");b[i._resumeScrollToPage]&&b[i._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete i._resumeScrollToPage},300)}async function va(t=[]){console.log("[Reader] mount called with params:",t);const[e,s]=t;if(console.log("[Reader] mangaId:",e,"chapterNum:",s),!e||!s){P.go("/");return}const a=document.getElementById("app");i.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),i.images=[],i.singlePageMode=!1,i._resumeScrollToPage=null,i.nextChapterImage=null,i.nextChapterNum=null,a.innerHTML=re();try{const n=await f.getBookmark(e),o=n.downloadedVersions||{},r=new Set(n.deletedChapterUrls||[]),u=o[parseFloat(s)];let c=[];if(Array.isArray(u)&&(c=u.filter(b=>!r.has(b))),c.length>1){const b=await ga(c,s);if(b===null){P.go(`/manga/${e}`);return}await we(e,s,b)}else await we(e,s)}catch(n){console.log("[Reader] Error in version check, falling back:",n),await we(e,s)}if(a.innerHTML=re(),console.log("[Reader] render called, loading:",i.loading,"manga:",!!i.manga,"images:",i.images.length),Ne(),i.mode==="webtoon"&&i._resumeScrollToPage!=null){const n=i._resumeScrollToPage;i._resumeScrollToPage=null,setTimeout(()=>{const o=document.getElementById("reader-content");if(o){const r=o.querySelectorAll("img");r[n]&&r[n].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function ya(){console.log("[Reader] unmount called"),await $e(),document.body.classList.remove("reader-active"),document.removeEventListener("keydown",Xt),i.manga=null,i.chapter=null,i.images=[],i.loading=!0,i.singlePageMode=!1,i._resumeScrollToPage=null}async function xe(){if(!(!i.manga||!i.chapter||i.manga.id==="gallery"))try{await f.updateChapterSettings(i.manga.id,i.chapter.number,{mode:i.mode,direction:i.direction,firstPageSingle:i.firstPageSingle,lastPageSingle:i.lastPageSingle})}catch(t){console.error("Failed to save settings:",t)}}async function Zt(t){try{const e=await f.getBookmark(t),s=e.downloadedChapters||[],a=new Set(e.readChapters||[]),n=e.readingProgress||{},o=[...s].sort((u,c)=>u-c);let r=null;for(const u of o){const c=n[u];if(c&&c.page<c.totalPages&&!a.has(u)){r=u;break}}if(r===null){for(const u of o)if(!a.has(u)){r=u;break}}r===null&&o.length>0&&(r=o[0]),r!==null?P.go(`/read/${t}/${r}`):d("No downloaded chapters to read","info")}catch(e){d("Failed to continue reading: "+e.message,"error")}}const ba={mount:va,unmount:ya,render:re,continueReading:Zt},ke=50;let m={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1};function wa(t){return t.autoCheck===!0?`<button class="btn btn-primary" id="schedule-btn">⏰ ${t.checkSchedule==="weekly"?`${(t.checkDay||"monday").charAt(0).toUpperCase()+(t.checkDay||"monday").slice(1)} ${t.checkTime||"06:00"}`:t.checkSchedule==="daily"?`Daily ${t.checkTime||"06:00"}`:"Every 6h"}</button>`:'<button class="btn btn-secondary" id="schedule-btn">⏰ Schedule</button>'}function ka(t){const e=t.autoCheck===!0,s=t.checkSchedule||"daily",a=t.checkDay||"monday",n=t.checkTime||"06:00",o=t.autoDownload||!1;return`
    <div class="modal" id="schedule-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>⏰ Auto-Check Schedule</h2>
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
              <input type="checkbox" id="auto-download-toggle" ${o?"checked":""} style="width: 18px; height: 18px;">
              <span>Auto-download new chapters</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          ${e?'<button class="btn btn-danger" id="disable-schedule-btn" style="margin-right:auto;">Disable</button>':""}
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="save-schedule-btn">${e?"Save":"Enable & Save"}</button>
        </div>
      </div>
    </div>
  `}function rt(){var S;if(m.loading)return`
      ${G()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=m.manga;if(!t)return`
      ${G()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.chapters||[],a=new Set(t.downloadedChapters||[]),n=new Set(t.readChapters||[]),o=new Set(t.excludedChapters||[]),r=new Set(t.deletedChapterUrls||[]),u=t.volumes||[],c=new Set;u.forEach(l=>{(l.chapters||[]).forEach(h=>c.add(h))});let b;m.filter==="hidden"?b=s.filter(l=>o.has(l.number)||r.has(l.url)):b=s.filter(l=>!o.has(l.number)&&!r.has(l.url));const v=b.filter(l=>!c.has(l.number));let w=[];if(m.activeVolume){const l=new Set(m.activeVolume.chapters||[]);w=b.filter(h=>l.has(h.number))}else w=v;const y=new Map;w.forEach(l=>{y.has(l.number)||y.set(l.number,[]),y.get(l.number).push(l)});let g=Array.from(y.entries()).sort((l,h)=>l[0]-h[0]);m.filter==="downloaded"?g=g.filter(([l])=>a.has(l)):m.filter==="not-downloaded"?g=g.filter(([l])=>!a.has(l)):m.filter==="main"?g=g.filter(([l])=>Number.isInteger(l)):m.filter==="extra"&&(g=g.filter(([l])=>!Number.isInteger(l)));const p=Math.max(1,Math.ceil(g.length/ke));m.currentPage>=p&&(m.currentPage=Math.max(0,p-1));const L=m.currentPage*ke,x=[...g.slice(L,L+ke)].reverse(),M=y.size,B=[...y.keys()].filter(l=>a.has(l)).length;n.size;let E="";if(m.activeVolume){const l=m.activeVolume;let h=null;l.local_cover?h=`/api/public/covers/${t.id}/${encodeURIComponent(l.local_cover.split(/[/\\]/).pop())}`:l.cover&&(h=l.cover),E=`
      ${G()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${h?`<img src="${h}" alt="${l.name}">`:'<div class="placeholder">📚</div>'}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${t.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${l.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${M} Chapters</span>
                ${B>0?`<span class="meta-item downloaded">${B} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${t.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${m.manageChapters?"Done Managing":"➕ Add Chapters"}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${l.id}">✏️ Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const l=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover;E=`
        ${G()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${l?`<img src="${l}" alt="${e}">`:'<div class="placeholder">📚</div>'}
              </div>
              <div class="manga-detail-info">
                <h1>${e}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${t.website||"Local"}</span>
                  <span class="meta-item">${((S=t.chapters)==null?void 0:S.length)||0} Total Chapters</span>
                  ${a.size>0?`<span class="meta-item downloaded">${a.size} Downloaded</span>`:""}
                  ${n.size>0?`<span class="meta-item">${n.size} Read</span>`:""}
                </div>
                ${(t.artists||[]).length>0||(t.categories||[]).length>0?`
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(t.artists||[]).length>0?`
                    <span class="meta-label">Author:</span>
                    ${t.artists.map(h=>`<a href="#//" class="artist-link" data-artist="${h}">${h}</a>`).join(", ")}
                  `:""}
                  ${(t.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(t.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${t.categories.map(h=>`<span class="tag">${h}</span>`).join("")}
                  `:""}
                </div>
                `:""}
                <div class="manga-detail-actions">
                  <button class="btn btn-primary" id="continue-btn">
                    ▶ ${t.lastReadChapter?"Continue":"Start"} Reading
                  </button>
              <button class="btn btn-secondary" id="download-all-btn">
                ↓ Download All
              </button>
              <button class="btn btn-secondary" id="refresh-btn">🔄 Refresh</button>
              ${t.website!=="Local"?'<button class="btn btn-secondary" id="quick-check-btn">⚡ Quick Check</button>':""}
              ${t.website==="Local"?'<button class="btn btn-secondary" id="scan-folder-btn">📁 Scan Folder</button>':""}
              <button class="btn btn-secondary" id="edit-btn">✏️ Edit</button>
              ${(t.volumes||[]).length===0?'<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>':""}
              ${wa(t)}
            </div>
            ${t.description?`<p class="manga-description">${t.description}</p>`:""}
            ${m.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">📦 CBZ Files (${m.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${m.cbzFiles.map(h=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${h.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${h.chapterNumber?`Chapter ${h.chapterNumber}`:"Unknown chapter"}
                        ${h.isExtracted?" | ✅ Extracted":""}
                      </div>
                    </div>
                    <button class="btn btn-small ${h.isExtracted?"btn-secondary":"btn-primary"}" 
                            data-cbz-path="${encodeURIComponent(h.path)}" 
                            data-cbz-chapter="${h.chapterNumber||1}"
                            data-cbz-extracted="${h.isExtracted}">
                      ${h.isExtracted?"Re-Extract":"Extract"}
                    </button>
                  </div>
                `).join("")}
              </div>
            </div>
            `:""}
          </div>
        </div>
      `}return`
    ${E}
        
        ${m.activeVolume?m.manageChapters?La(t,v):"":xa(t,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${m.filter==="all"?"active":""}" data-filter="all">
                All (${y.size})
              </button>
              <button class="filter-btn ${m.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${B})
              </button>
              <button class="filter-btn ${m.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${m.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${p>1?St(p):""}
          
          <div class="chapter-list">
            ${x.map(([l,h])=>Sa(l,h,a,n,t)).join("")}
          </div>
          
          ${p>1?St(p):""}
        </div>
      ${$a()}
    </div>
  `}function Ea(){const t=m.manga;return t?`
    <div class="modal" id="delete-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 420px;">
        <div class="modal-header">
          <h2>🗑️ Delete Manga</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>${t.alias||t.title}</strong> from your library?</p>
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
  `:""}function Ca(){const t=m.manga;return t?`
    <div class="modal" id="migrate-source-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h2>🔄 Change Source</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Current source: <strong>${t.website||"Local"}</strong></p>
          <p class="text-muted" style="font-size: 0.85em; margin-bottom: 12px;">Enter the new URL for this manga. Downloaded chapters will be preserved as local versions.</p>
          <div class="form-group">
            <label for="migrate-url-input">New Manga URL</label>
            <input type="url" id="migrate-url-input" placeholder="https://..." style="width: 100%;">
          </div>
          <p class="text-muted" style="font-size: 0.8em;">Current URL: <code style="word-break:break-all;">${t.url}</code></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-migrate-btn">Migrate Source</button>
        </div>
      </div>
    </div>
  `:""}function $a(){var e,s;const t=m.manga;return`
    ${t?ka(t):""}
    ${Ha()}
    ${Ea()}
    ${Ca()}

    <!-- Edit Manga Modal -->
    <div class="modal" id="edit-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>✏️ Edit Manga</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <datalist id="artist-list"></datalist>
          <datalist id="category-list"></datalist>
          <div class="form-group">
            <label for="edit-alias-input">Display Name (Alias)</label>
            <input type="text" id="edit-alias-input" placeholder="Custom display name..." value="${(t==null?void 0:t.alias)||""}">
          </div>
          <div class="form-group">
            <label for="edit-artist-input">Author/Artist</label>
            <input type="text" id="edit-artist-input" list="artist-list" placeholder="Author or artist name..." value="${((e=t==null?void 0:t.artists)==null?void 0:e.join(", "))||""}">
          </div>
          <div class="form-group">
            <label for="edit-categories-input">Tags/Categories (comma separated)</label>
            <input type="text" id="edit-categories-input" list="category-list" placeholder="tag1, tag2, tag3..." value="${((s=t==null?void 0:t.categories)==null?void 0:s.join(", "))||""}">
          </div>
          <div class="form-group">
            <label>Cover Image</label>
            <div id="cover-preview" style="width: 100px; height: 150px; background: var(--bg-secondary); border-radius: 4px; margin-bottom: 8px; overflow: hidden;">
              ${t!=null&&t.localCover?`<img src="/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}" style="width: 100%; height: 100%; object-fit: cover;">`:""}
            </div>
            <button type="button" class="btn btn-small btn-secondary" id="change-cover-btn">Change Cover</button>
          </div>
          <p class="text-muted" style="font-size: 0.8em;">Original title: ${(t==null?void 0:t.title)||""}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger" id="delete-manga-btn" style="margin-right:auto;">🗑️ Delete</button>
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
  `}function Sa(t,e,s,a,n){var E,S,l,h;const o=s.has(t),r=a.has(t),u=!Number.isInteger(t),c=((E=n.downloadedVersions)==null?void 0:E[t])||[],b=new Set(n.deletedChapterUrls||[]),v=e.filter(k=>m.filter==="hidden"?!0:!b.has(k.url)),w=!!m.activeVolume;let y=v;w&&(y=v.filter(k=>Array.isArray(c)?c.includes(k.url):c===k.url));const g=y.length>1,p=(S=y[0])!=null&&S.url?encodeURIComponent(y[0].url):null,L=n.chapterSettings||{},_=w?!0:(l=L[t])==null?void 0:l.locked,x=["chapter-item",o?"downloaded":"",r?"read":"",u?"extra":""].filter(Boolean).join(" "),M=g?`
    <div class="versions-dropdown hidden" id="versions-${t}">
      ${y.map(k=>{const $=encodeURIComponent(k.url),I=Array.isArray(c)?c.includes(k.url):c===k.url,T=k.url.startsWith("local://");return`
          <div class="version-row ${I?"downloaded":""}"
               data-version-url="${$}" data-num="${t}">
            <span class="version-title">${k.title||k.releaseGroup||"Version"}${T?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}</span>
            <div class="version-actions">
              ${I?`<button class="btn-icon small success" data-action="read-version" data-num="${t}" data-url="${$}">▶</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${t}" data-url="${$}">🗑️</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${t}" data-url="${$}">↓</button>`}
              ${b.has(k.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${t}" data-url="${$}" title="Restore Version">↩️</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${t}" data-url="${$}" title="Hide Version">👁️‍🗨️</button>`}
            </div>
          </div>
        `}).join("")}
    </div>
  `:"",B=(n.excludedChapters||[]).includes(t);return`
    <div class="chapter-group" data-chapter="${t}">
      <div class="${x}" data-num="${t}" style="${B?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${t}</span>
        <span class="chapter-title">
          ${y[0]?y[0].title!==`Chapter ${t}`?y[0].title:"":e[0].title}
          ${B?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
        </span>
        ${u?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${B?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${t}" title="Restore Chapter">↩️</button>`:w?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${m.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${t}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${_?"locked":""}"
                        data-action="lock" data-num="${t}"
                        title="${_?"Unlock":"Lock"}">
                  ${_?"🔒":"🔓"}
                </button>`}
          ${!B&&p?b.has((h=y[0])==null?void 0:h.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${t}" data-url="${p}" title="Unhide Chapter">↩️</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${t}" data-url="${p}" title="Hide Chapter">👁️‍🗨️</button>`:""}
          <button class="btn-icon small ${r?"success":"muted"}"
                  data-action="read" data-num="${t}"
                  title="${r?"Mark unread":"Mark read"}">
            ${r?"👁️":"○"}
          </button>
          ${o?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${t}" data-url="${p}" title="Delete Files">🗑️</button>`:`<button class="btn-icon small ${o?"success":""}"
              data-action="download" data-num="${t}"
              title="${o?"Downloaded":"Download"}">
          ${o?"✓":"↓"}
        </button>`}
          ${g?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${t}">
              ${v.length} ▼
            </button>
          `:""}
        </div>
      </div>
      ${M}
    </div>
  `}function St(t){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${m.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${m.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${m.currentPage+1} of ${t}</span>
      <button class="btn btn-icon" data-page="next" ${m.currentPage>=t-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${m.currentPage>=t-1?"disabled":""}>»</button>
    </div>
  `}function La(t,e){return e.length===0?`
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
        ${[...new Set(e.map(a=>a.number))].sort((a,n)=>a-n).map(a=>`
          <div class="available-chapter-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-sm);">
            <span style="font-weight: 500;">Ch. ${a}</span>
            <button class="btn btn-small btn-primary add-to-vol-btn" data-num="${a}">Add</button>
          </div>
        `).join("")}
      </div>
    </div>
  `}function xa(t,e){var n;const s=t.volumes||[];return s.length===0?"":`
    <div class="volumes-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="margin: 0;">Volumes</h2>
        <button class="btn btn-secondary btn-small" id="add-volume-btn">+ Add Volume</button>
      </div>
      <div class="volumes-grid">
        ${s.map(o=>{const r=o.chapters||[],u=r.filter(c=>e.has(c)).length;return`
      <div class="volume-card" data-volume-id="${o.id}">
        <div class="volume-cover">
          ${o.cover?`<img src="${o.cover}" alt="${o.name}">`:'<div class="placeholder">📚</div>'}
          <div class="volume-badges">
            <span class="badge badge-chapters">${r.length} ch</span>
            ${u>0?`<span class="badge badge-downloaded">${u}</span>`:""}
          </div>
        </div>
        <div class="volume-info">
          <div class="volume-name">${o.name}</div>
        </div>
      </div>
    `}).join("")||(((n=t.chapters)==null?void 0:n.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function _a(){var s,a,n,o,r,u,c,b,v,w,y,g,p,L,_,x,M,B,E,S;const t=document.getElementById("app"),e=m.manga;e&&((s=document.getElementById("back-btn"))==null||s.addEventListener("click",()=>P.go("/")),(a=document.getElementById("back-library-btn"))==null||a.addEventListener("click",()=>P.go("/")),t.querySelectorAll(".artist-link").forEach(l=>{l.addEventListener("click",h=>{h.preventDefault();const k=l.dataset.artist;k&&(localStorage.setItem("library_search",k),localStorage.removeItem("library_artist_filter"),P.go("/"))})}),(n=document.getElementById("continue-btn"))==null||n.addEventListener("click",()=>{Zt(e.id)}),(o=document.getElementById("download-all-btn"))==null||o.addEventListener("click",()=>{const l=document.getElementById("download-all-modal");l&&l.classList.add("open")}),(r=document.getElementById("confirm-download-all-btn"))==null||r.addEventListener("click",async()=>{var l;try{d("Queueing downloads...","info");const h=document.getElementsByName("download-version-mode");let k="single";for(const I of h)I.checked&&(k=I.value);(l=document.getElementById("download-all-modal"))==null||l.classList.remove("open");const $=await f.post(`/bookmarks/${e.id}/download`,{all:!0,versionMode:k});$.chaptersCount>0?d(`Download queued: ${$.chaptersCount} versions`,"success"):d("Already have these chapters downloaded","info")}catch(h){d("Failed to download: "+h.message,"error")}}),(u=document.getElementById("check-updates-btn"))==null||u.addEventListener("click",async()=>{try{d("Checking for updates...","info"),await f.post(`/bookmarks/${e.id}/quick-check`),d("Check complete!","success")}catch(l){d("Check failed: "+l.message,"error")}}),(c=document.getElementById("schedule-btn"))==null||c.addEventListener("click",()=>{const l=document.getElementById("schedule-modal");l&&l.classList.add("open")}),(b=document.getElementById("schedule-type"))==null||b.addEventListener("change",l=>{const h=document.getElementById("schedule-day-group");h&&(h.style.display=l.target.value==="weekly"?"":"none")}),(v=document.getElementById("save-schedule-btn"))==null||v.addEventListener("click",async()=>{var l;try{const h=document.getElementById("schedule-type").value,k=document.getElementById("schedule-day").value,$=document.getElementById("schedule-time").value,I=document.getElementById("auto-download-toggle").checked;await f.updateAutoCheckSchedule(e.id,{enabled:!0,schedule:h,day:k,time:$,autoDownload:I}),m.manga.checkSchedule=h,m.manga.checkDay=k,m.manga.checkTime=$,m.manga.autoDownload=I,(l=document.getElementById("schedule-modal"))==null||l.classList.remove("open"),R([e.id]),d("Schedule updated","success")}catch(h){d("Failed to save schedule: "+h.message,"error")}}),(w=document.getElementById("disable-schedule-btn"))==null||w.addEventListener("click",async()=>{var l;try{await f.toggleAutoCheck(e.id,!1),m.manga.autoCheck=!1,m.manga.checkSchedule=null,m.manga.checkDay=null,m.manga.checkTime=null,m.manga.nextCheck=null,(l=document.getElementById("schedule-modal"))==null||l.classList.remove("open"),R([e.id]),d("Auto-check disabled","success")}catch(h){d("Failed to disable: "+h.message,"error")}}),(y=document.getElementById("refresh-btn"))==null||y.addEventListener("click",async()=>{const l=document.getElementById("refresh-btn");try{l.disabled=!0,l.textContent="⏳ Checking...",d("Checking for updates...","info"),await f.post(`/bookmarks/${e.id}/check`),await F(e.id),R([e.id]),d("Check complete!","success")}catch(h){d("Check failed: "+h.message,"error"),l&&(l.disabled=!1,l.textContent="🔄 Refresh")}}),(g=document.getElementById("scan-folder-btn"))==null||g.addEventListener("click",async()=>{var h,k;const l=document.getElementById("scan-folder-btn");try{l.disabled=!0,l.textContent="⏳ Scanning...",d("Scanning folder...","info");const $=await f.scanBookmark(e.id);await F(e.id),R([e.id]);const I=((h=$.addedChapters)==null?void 0:h.length)||0,T=((k=$.removedChapters)==null?void 0:k.length)||0;I>0||T>0?d(`Scan complete: ${I} added, ${T} removed`,"success"):d("Scan complete: No changes","info")}catch($){d("Scan failed: "+$.message,"error")}finally{l&&(l.disabled=!1,l.textContent="📁 Scan Folder")}}),document.querySelectorAll("[data-cbz-path]").forEach(l=>{l.addEventListener("click",async()=>{const h=decodeURIComponent(l.dataset.cbzPath),k=parseInt(l.dataset.cbzChapter)||1,$=l.dataset.cbzExtracted==="true",I=prompt("Enter chapter number for extraction:",String(k));if(!I)return;const T=parseFloat(I);if(isNaN(T)){d("Invalid chapter number","error");return}try{l.disabled=!0,l.textContent="Extracting...",d("Extracting CBZ...","info"),await f.extractCbz(e.id,h,T,{forceReExtract:$}),d("CBZ extracted successfully!","success"),await F(e.id),R([e.id])}catch(U){d("Extract failed: "+U.message,"error")}finally{l.disabled=!1,l.textContent=$?"Re-Extract":"Extract"}})}),(p=document.getElementById("edit-btn"))==null||p.addEventListener("click",async()=>{const l=document.getElementById("edit-manga-modal");if(l){document.getElementById("edit-alias-input").value=e.alias||"",window._selectedCoverPath=null;try{const[h,k]=await Promise.all([f.getAllArtists(),f.getAllCategories()]),$=document.getElementById("artist-list"),I=document.getElementById("category-list");window._allArtists=h,window._allCategories=k,$&&($.innerHTML=h.map(se=>`<option value="${se}">`).join("")),I&&(I.innerHTML=k.map(se=>`<option value="${se}">`).join(""));const T=document.getElementById("edit-artist-input"),U=document.getElementById("edit-categories-input");T==null||T.addEventListener("input",()=>{const se=T.value.toLowerCase(),le=T.value.lastIndexOf(","),pe=T.value.substring(le+1).trim().toLowerCase();if(pe.length>0&&window._allArtists){const ce=window._allArtists.filter(me=>me.toLowerCase().includes(pe));if($&&ce.length>0){const me=le>=0?T.value.substring(0,le+1)+" ":"";$.innerHTML=ce.map(ss=>`<option value="${me}${ss}">`).join("")}}}),U==null||U.addEventListener("input",()=>{const se=U.value.lastIndexOf(","),le=U.value.substring(se+1).trim().toLowerCase();if(le.length>0&&window._allCategories){const pe=window._allCategories.filter(ce=>ce.toLowerCase().includes(le));if(I&&pe.length>0){const ce=se>=0?U.value.substring(0,se+1)+" ":"";I.innerHTML=pe.map(me=>`<option value="${ce}${me}">`).join("")}}})}catch(h){console.error("Failed to load artists/categories:",h)}l.classList.add("open")}}),(L=document.getElementById("save-manga-btn"))==null||L.addEventListener("click",async()=>{var l;try{const h=document.getElementById("edit-alias-input").value.trim(),k=document.getElementById("edit-artist-input").value.trim(),$=document.getElementById("edit-categories-input").value.trim(),I=k?k.split(",").map(U=>U.trim()).filter(U=>U):[],T=$?$.split(",").map(U=>U.trim()).filter(U=>U):[];await f.updateBookmark(e.id,{alias:h||null}),await f.setBookmarkArtists(e.id,I),await f.setBookmarkCategories(e.id,T),window._selectedCoverPath&&await f.setBookmarkCoverFromImage(e.id,window._selectedCoverPath),m.manga.alias=h||null,m.manga.artists=I,m.manga.categories=T,(l=document.getElementById("edit-manga-modal"))==null||l.classList.remove("open"),R([e.id]),d("Manga updated","success")}catch(h){d("Failed to update: "+h.message,"error")}}),(_=document.getElementById("change-cover-btn"))==null||_.addEventListener("click",async()=>{try{d("Loading images...","info");const l=await f.getFolderImages(e.id);if(l.length===0){d("No images found in manga folder","warning");return}const h=document.createElement("div");h.id="cover-select-modal",h.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",h.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${l.slice(0,50).map(k=>`
              <div class="cover-option" data-path="${k.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(k.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${l.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${l.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(h),document.getElementById("close-cover-modal").addEventListener("click",()=>h.remove()),h.addEventListener("click",k=>{k.target===h&&h.remove()}),h.querySelectorAll(".cover-option").forEach(k=>{k.addEventListener("click",()=>{window._selectedCoverPath=k.dataset.path;const $=document.getElementById("cover-preview");$&&($.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),h.remove(),d("Cover selected","success")})})}catch(l){d("Failed to load images: "+l.message,"error")}}),(x=document.getElementById("delete-manga-btn"))==null||x.addEventListener("click",()=>{const l=document.getElementById("delete-manga-modal");l&&l.classList.add("open")}),(M=document.getElementById("confirm-delete-manga-btn"))==null||M.addEventListener("click",async()=>{var h,k;const l=((h=document.getElementById("delete-files-toggle"))==null?void 0:h.checked)||!1;try{await f.deleteBookmark(e.id,l),(k=document.getElementById("delete-manga-modal"))==null||k.classList.remove("open"),d("Manga deleted","success"),P.go("/")}catch($){d("Failed to delete: "+$.message,"error")}}),(B=document.getElementById("quick-check-btn"))==null||B.addEventListener("click",async()=>{const l=document.getElementById("quick-check-btn");try{l.disabled=!0,l.textContent="⏳ Checking...",d("Quick checking for updates...","info");const h=await f.post(`/bookmarks/${e.id}/quick-check`);await F(e.id),R([e.id]),h.newChaptersCount>0?d(`Found ${h.newChaptersCount} new chapter(s)!`,"success"):d("No new chapters found","info")}catch(h){d("Quick check failed: "+h.message,"error")}finally{l&&(l.disabled=!1,l.textContent="⚡ Quick Check")}}),(E=document.getElementById("source-label"))==null||E.addEventListener("click",()=>{const l=document.getElementById("migrate-source-modal");l&&l.classList.add("open")}),(S=document.getElementById("confirm-migrate-btn"))==null||S.addEventListener("click",async()=>{var k,$,I;const l=($=(k=document.getElementById("migrate-url-input"))==null?void 0:k.value)==null?void 0:$.trim();if(!l){d("Please enter a URL","warning");return}const h=document.getElementById("confirm-migrate-btn");try{h.disabled=!0,h.textContent="Migrating...",d("Migrating source...","info");const T=await f.migrateSource(e.id,l);d(`Migrated! ${T.migratedChapters} chapters preserved as local`,"success"),d("Running full check on new source...","info"),await f.post(`/bookmarks/${e.id}/check`),(I=document.getElementById("migrate-source-modal"))==null||I.classList.remove("open"),await F(e.id),R([e.id]),d("Source migration complete!","success")}catch(T){d("Migration failed: "+T.message,"error")}finally{h&&(h.disabled=!1,h.textContent="Migrate Source")}}),t.querySelectorAll(".filter-btn").forEach(l=>{l.addEventListener("click",()=>{m.filter=l.dataset.filter,m.currentPage=0,R([e.id])})}),t.querySelectorAll("[data-page]").forEach(l=>{l.addEventListener("click",()=>{const h=l.dataset.page,k=Math.ceil(m.manga.chapters.length/ke);switch(h){case"first":m.currentPage=0;break;case"prev":m.currentPage=Math.max(0,m.currentPage-1);break;case"next":m.currentPage=Math.min(k-1,m.currentPage+1);break;case"last":m.currentPage=k-1;break}R([e.id])})}),t.querySelectorAll(".chapter-item").forEach(l=>{l.addEventListener("click",h=>{if(h.target.closest(".chapter-actions"))return;const k=parseFloat(l.dataset.num);(e.downloadedChapters||[]).includes(k)?P.go(`/read/${e.id}/${k}`):d("Chapter not downloaded","info")})}),t.querySelectorAll("[data-action]").forEach(l=>{l.addEventListener("click",async h=>{h.stopPropagation();const k=l.dataset.action,$=parseFloat(l.dataset.num),I=l.dataset.url?decodeURIComponent(l.dataset.url):null;switch(k){case"lock":await Ia($);break;case"read":await Ba($);break;case"download":await Pa($);break;case"versions":Aa($);break;case"read-version":P.go(`/read/${e.id}/${$}?version=${encodeURIComponent(I)}`);break;case"download-version":await Ta($,I);break;case"delete-version":await Ma($,I);break;case"hide-version":await Ra($,I);break;case"restore-version":await Da($,I);break;case"restore-chapter":await Na($);break;case"delete-chapter":await qa($,I);break;case"hide-chapter":await Fa($,I);break;case"unhide-chapter":await Oa($,I);break}})}),t.querySelectorAll(".volume-card").forEach(l=>{l.addEventListener("click",()=>{const h=l.dataset.volumeId;P.go(`/manga/${e.id}/volume/${h}`)})}),za(t),ie(),D.subscribeToManga(e.id))}async function Ia(t){var n;const e=m.manga,s=((n=e.chapterSettings)==null?void 0:n[t])||{},a=!s.locked;try{a?await f.lockChapter(e.id,t):await f.unlockChapter(e.id,t),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[t]={...s,locked:a},d(a?"Chapter locked":"Chapter unlocked","success"),R([e.id])}catch(o){d("Failed: "+o.message,"error")}}async function Ba(t){const e=m.manga,s=new Set(e.readChapters||[]),a=s.has(t);try{await f.post(`/bookmarks/${e.id}/chapters/${t}/read`,{read:!a}),a?s.delete(t):s.add(t),e.readChapters=[...s],d(a?"Marked unread":"Marked read","success"),R([e.id])}catch(n){d("Failed: "+n.message,"error")}}async function Pa(t){const e=m.manga;try{d(`Downloading chapter ${t}...`,"info"),await f.post(`/bookmarks/${e.id}/download`,{chapters:[t]}),d("Download queued!","success")}catch(s){d("Failed: "+s.message,"error")}}function Aa(t){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${t}`&&s.classList.add("hidden")});const e=document.getElementById(`versions-${t}`);e&&e.classList.toggle("hidden")}async function Ta(t,e){const s=m.manga;try{d("Downloading version...","info"),await f.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:t,url:e}),d("Download queued!","success")}catch(a){d("Failed: "+a.message,"error")}}async function Ma(t,e){const s=m.manga;if(confirm("Delete this version from disk?"))try{await f.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:decodeURIComponent(e)})}),d("Version deleted","success"),await F(s.id),R([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function Ra(t,e){const s=m.manga;try{await f.hideVersion(s.id,t,decodeURIComponent(e)),d("Version hidden","success"),await F(s.id),R([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function Da(t,e){const s=m.manga;try{await f.unhideVersion(s.id,t,decodeURIComponent(e)),d("Version restored","success"),await F(s.id),R([s.id])}catch(a){d("Failed to restore version: "+a.message,"error")}}async function Na(t){const e=m.manga;try{await f.unexcludeChapter(e.id,t),d("Chapter restored","success"),await F(e.id),R([e.id])}catch(s){d("Failed to restore chapter: "+s.message,"error")}}async function qa(t,e){const s=m.manga;if(confirm("Delete this chapter's files from disk?"))try{await f.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:decodeURIComponent(e)})}),d("Chapter files deleted","success"),await F(s.id),R([s.id])}catch(a){d("Failed to delete: "+a.message,"error")}}async function Fa(t,e){const s=m.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await f.hideVersion(s.id,t,decodeURIComponent(e)),d("Chapter hidden","success"),await F(s.id),R([s.id])}catch(a){d("Failed to hide chapter: "+a.message,"error")}}async function Oa(t,e){const s=m.manga;try{await f.unhideVersion(s.id,t,decodeURIComponent(e)),d("Chapter unhidden","success"),await F(s.id),R([s.id])}catch(a){d("Failed to unhide chapter: "+a.message,"error")}}async function F(t){try{const[e,s]=await Promise.all([f.getBookmark(t),X.loadCategories()]);if(m.manga=e,m.categories=s,m.loading=!1,e.website==="Local")try{const o=await f.getCbzFiles(t);m.cbzFiles=o||[]}catch(o){console.error("Failed to load CBZ files:",o),m.cbzFiles=[]}else m.cbzFiles=[];const a=new Set((e.chapters||[]).map(o=>o.number)).size,n=Math.ceil(a/ke);m.currentPage=Math.max(0,n-1),m.activeVolumeId?m.activeVolume=(e.volumes||[]).find(o=>o.id===m.activeVolumeId):m.activeVolume=null}catch{d("Failed to load manga","error"),m.loading=!1}}async function R(t=[]){const[e,s,a]=t;if(!e){P.go("/");return}m.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!m.manga||m.manga.id!==e?(m.loading=!0,m.manga=null,n.innerHTML=rt(),await F(e)):m.activeVolumeId?m.activeVolume=(m.manga.volumes||[]).find(o=>o.id===m.activeVolumeId):m.activeVolume=null,n.innerHTML=rt(),_a()}function Ua(){m.manga&&D.unsubscribeFromManga(m.manga.id),m.manga=null,m.loading=!0}const Va={mount:R,unmount:Ua,render:rt};function Ha(){return`
    <div class="modal" id="add-volume-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>📦 Add New Volume</h2>
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
  `}function za(t){const e=m.manga;if(!e)return;const s=t.querySelector("#add-volume-btn"),a=t.querySelector("#add-volume-modal"),n=t.querySelector("#add-volume-submit-btn");s&&a&&s.addEventListener("click",()=>{a.classList.add("open"),t.querySelector("#add-volume-name-input").focus()}),a==null||a.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(p=>{p.addEventListener("click",()=>a.classList.remove("open"))}),n&&n.addEventListener("click",async()=>{const p=t.querySelector("#add-volume-name-input").value.trim();if(!p)return d("Please enter a volume name","error");try{n.disabled=!0,n.textContent="Creating...",await f.createVolume(e.id,p),d("Volume created successfully!","success"),a.classList.remove("open"),t.querySelector("#add-volume-name-input").value="",await F(e.id),R([e.id])}catch(L){d("Failed to create volume: "+L.message,"error")}finally{n.disabled=!1,n.textContent="Create Volume"}});const o=t.querySelector("#manage-chapters-btn");o&&o.addEventListener("click",()=>{m.manageChapters=!m.manageChapters,R([e.id,"volume",m.activeVolumeId])}),t.querySelectorAll(".add-to-vol-btn").forEach(p=>{p.addEventListener("click",async()=>{const L=parseFloat(p.dataset.num),_=m.activeVolume;if(_)try{p.disabled=!0,p.textContent="...";const x=_.chapters||[];if(x.includes(L))return;const M=[...x,L].sort((B,E)=>B-E);await f.updateVolumeChapters(e.id,_.id,M),d(`Chapter ${L} added to volume`,"success"),await F(e.id),R([e.id,"volume",_.id])}catch(x){d("Failed to add chapter: "+x.message,"error"),p.disabled=!1,p.textContent="Add"}})}),t.querySelectorAll(".remove-from-vol-btn").forEach(p=>{p.addEventListener("click",async L=>{L.stopPropagation();const _=parseFloat(p.dataset.num),x=m.activeVolume;if(x)try{p.disabled=!0,p.textContent="...";const B=(x.chapters||[]).filter(E=>E!==_);await f.updateVolumeChapters(e.id,x.id,B),d(`Chapter ${_} removed from volume`,"success"),await F(e.id),R([e.id,"volume",x.id])}catch(M){d("Failed to remove chapter: "+M.message,"error"),p.disabled=!1,p.textContent="×"}})});const r=t.querySelector("#edit-vol-btn"),u=t.querySelector("#edit-volume-modal");r&&u&&r.addEventListener("click",()=>{const p=r.dataset.volId,L=e.volumes.find(_=>_.id===p);L&&(t.querySelector("#volume-name-input").value=L.name,u.dataset.editingVolId=p,u.classList.add("open"))});const c=t.querySelector("#save-volume-btn");c&&c.addEventListener("click",async()=>{const p=u.dataset.editingVolId,L=t.querySelector("#volume-name-input").value.trim();if(!L)return d("Volume name cannot be empty","error");try{await f.renameVolume(e.id,p,L),d("Volume renamed","success"),u.classList.remove("open"),await F(e.id),R([e.id,"volume",p])}catch(_){d(_.message,"error")}});const b=t.querySelector("#delete-volume-btn");b&&b.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const p=u.dataset.editingVolId;try{await f.deleteVolume(e.id,p),d("Volume deleted","success"),u.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch(L){d(L.message,"error")}});const v=t.querySelector("#vol-cover-upload-btn");if(v){let p=document.getElementById("vol-cover-input-hidden");p||(p=document.createElement("input"),p.type="file",p.id="vol-cover-input-hidden",p.accept="image/*",p.style.display="none",document.body.appendChild(p),p.addEventListener("change",async L=>{const _=L.target.files[0];if(!_)return;const x=u.dataset.editingVolId;if(x)try{p.value="",v.disabled=!0,v.textContent="Uploading...",await f.uploadVolumeCover(e.id,x,_),d("Cover uploaded","success"),await F(e.id),R([e.id,"volume",x])}catch(M){d("Upload failed: "+M.message,"error")}finally{v.disabled=!1,v.innerHTML="📤 Upload Image"}})),v.addEventListener("click",()=>p.click())}const w=t.querySelector("#vol-cover-selector-btn"),y=t.querySelector("#cover-selector-modal");w&&y&&w.addEventListener("click",async()=>{const p=y.querySelector("#cover-chapter-select");p.innerHTML='<option value="">Select a chapter...</option>';const L=t.querySelector("#edit-volume-modal"),_=L?L.dataset.editingVolId:null;let x=[...e.chapters||[]];if(_){const B=e.volumes.find(E=>E.id===_);if(B&&B.chapters){const E=new Set(B.chapters);x=x.filter(S=>E.has(S.number))}}x.sort((B,E)=>B.number-E.number);const M=new Set;x.forEach(B=>{if(!M.has(B.number)){M.add(B.number);const E=document.createElement("option");E.value=B.number,E.textContent=`Chapter ${B.number}`,p.appendChild(E)}}),x.length>0&&(p.value=x[0].number,Lt(e.id,x[0].number)),y.classList.add("open")});const g=t.querySelector("#cover-chapter-select");g&&g.addEventListener("change",p=>{p.target.value&&Lt(e.id,p.target.value)}),t.querySelectorAll(".modal-close, .modal-close-btn").forEach(p=>{p.addEventListener("click",()=>{p.closest(".modal").classList.remove("open")})}),t.querySelectorAll(".modal-overlay").forEach(p=>{p.addEventListener("click",()=>{p.closest(".modal").classList.remove("open")})})}async function Lt(t,e){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await f.getChapterImages(t,e)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(o=>{const r=document.createElement("div");r.className="cover-grid-item",r.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",r.innerHTML=`<img src="${o}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,r.addEventListener("click",()=>{const u=document.querySelector('input[name="cover-target"]:checked').value,c=o.split("/").pop();ja(c,e,u)}),s.appendChild(r)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function ja(t,e,s){const a=m.manga,n=document.getElementById("edit-volume-modal"),o=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const r=n.dataset.editingVolId;if(!r)throw new Error("No volume selected");await f.setVolumeCoverFromChapter(a.id,r,e,t),d("Volume cover updated","success"),o.classList.remove("open"),n.classList.remove("open"),await F(a.id),R([a.id,"volume",r])}else{await f.setMangaCoverFromChapter(a.id,e,t),d("Series cover updated","success"),o.classList.remove("open"),await F(a.id);const r=window.location.hash.replace("#","");m.activeVolumeId?R([a.id,"volume",m.activeVolumeId]):R([a.id])}}catch(r){d("Failed to set cover: "+r.message,"error")}}let K={series:null,loading:!0};function ue(){if(K.loading)return`
      ${G("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=K.series;if(!t)return`
      ${G("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.entries||[],a=s.reduce((o,r)=>o+(r.chapter_count||0),0);let n=null;if(s.length>0){const o=s[0];o.local_cover&&o.bookmark_id?n=`/api/public/covers/${o.bookmark_id}/${encodeURIComponent(o.local_cover.split(/[/\\]/).pop())}`:o.localCover&&o.bookmark_id?n=`/api/public/covers/${o.bookmark_id}/${encodeURIComponent(o.localCover.split(/[/\\]/).pop())}`:o.cover&&(n=o.cover)}return`
    ${G("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?`<img src="${n}" alt="${e}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>'}
          </div>
          <div class="series-detail-info">
            <h1>${e}</h1>
            <div class="series-detail-meta">
              <span class="meta-item">${s.length} Entries</span>
              <span class="meta-item">${a} Total Chapters</span>
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
            ${s.map((o,r)=>Qa(o,r,s.length)).join("")}
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
  `}function Qa(t,e,s){var o;const a=t.alias||t.title;let n=null;return t.local_cover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.local_cover.split(/[/\\]/).pop())}`:t.localCover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(n=t.cover),`
    <div class="series-entry-card" data-id="${t.bookmark_id}" data-order="${t.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${e+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${t.bookmark_id}" ${e===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${t.bookmark_id}" ${e===s-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?`<img src="${n}" alt="${a}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:'<div class="placeholder">📚</div>'}
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${t.chapter_count||0} ch</span>
          ${((o=t.downloadedChapters)==null?void 0:o.length)>0?`<span class="badge badge-downloaded">${t.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${t.bookmark_id}" data-entryid="${t.id}" title="Use as series cover">🖼️</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${a}</div>
      </div>
    </div>
  `}function Ve(){var c,b,v;const t=document.getElementById("app"),e=K.series;(c=document.getElementById("back-btn"))==null||c.addEventListener("click",()=>P.go("/")),(b=document.getElementById("back-library-btn"))==null||b.addEventListener("click",()=>P.go("/")),t.querySelectorAll(".series-entry-card").forEach(w=>{w.addEventListener("click",y=>{if(y.target.closest("[data-action]"))return;const g=w.dataset.id;P.go(`/manga/${g}`)})}),t.querySelectorAll("[data-action]").forEach(w=>{w.addEventListener("click",async y=>{y.stopPropagation();const g=w.dataset.action,p=w.dataset.id;switch(g){case"move-up":await xt(p,-1);break;case"move-down":await xt(p,1);break;case"set-cover":const L=w.dataset.entryid;await Wa(L);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),o=document.getElementById("available-bookmarks-list"),r=document.getElementById("confirm-add-entry-btn");let u=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),o&&(o.innerHTML=""),a.classList.add("open");const w=await f.getAvailableBookmarksForSeries();u=w,w.length===0?(n&&(n.placeholder="No available manga found"),r.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),o&&(o.innerHTML=w.map(y=>`<option value="${(y.alias||y.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),r.disabled=!1)}catch{d("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),r.addEventListener("click",async()=>{const w=n?n.value:"",y=u.find(p=>(p.alias||p.title||"")===w);if(!y){d("Please select a valid manga from the list","warning");return}const g=y.id;try{r.disabled=!0,r.textContent="Adding...",await f.addSeriesEntry(e.id,g),d("Manga added to series","success"),a.classList.remove("open"),await He(e.id),t.innerHTML=ue(),Ve()}catch(p){d("Failed to add manga: "+p.message,"error")}finally{r.disabled=!1,r.textContent="Add to Series"}})),(v=document.getElementById("edit-series-btn"))==null||v.addEventListener("click",()=>{d("Edit series coming soon","info")})}async function xt(t,e){const s=K.series;if(!s)return;const a=s.entries||[],n=a.findIndex(u=>u.bookmark_id===t);if(n===-1)return;const o=n+e;if(o<0||o>=a.length)return;const r=a.map(u=>u.bookmark_id);[r[n],r[o]]=[r[o],r[n]];try{await f.post(`/series/${s.id}/reorder`,{order:r}),d("Order updated","success"),await He(s.id);const u=document.getElementById("app");u.innerHTML=ue(),Ve()}catch(u){d("Failed to reorder: "+u.message,"error")}}async function Wa(t){const e=K.series;if(e)try{await f.setSeriesCover(e.id,t),d("Series cover updated","success"),await He(e.id);const s=document.getElementById("app");s.innerHTML=ue(),Ve()}catch(s){d("Failed to set cover: "+s.message,"error")}}async function He(t){try{const e=await f.get(`/series/${t}`);K.series=e,K.loading=!1}catch{d("Failed to load series","error"),K.loading=!1}}async function Ga(t=[]){const[e]=t;if(!e){P.go("/");return}const s=document.getElementById("app");K.loading=!0,K.series=null,s.innerHTML=ue(),await He(e),s.innerHTML=ue(),Ve()}function Ka(){K.series=null,K.loading=!0}const Ya={mount:Ga,unmount:Ka,render:ue},Ja={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
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
        `;try{const s=await f.get("/settings")||{},a=document.getElementById("settings-form"),n=document.getElementById("settings-loader");s.theme&&(document.getElementById("theme").value=s.theme),n.style.display="none",a.style.display="block",a.addEventListener("submit",async o=>{o.preventDefault();const r=new FormData(a),u={};for(const[c,b]of r.entries())u[c]=b;try{await f.post("/settings/bulk",u),d("Settings saved successfully"),u.theme}catch(c){console.error(c),d("Failed to save settings","error")}})}catch(s){console.error(s),document.getElementById("settings-loader").textContent="Error loading settings"}}},Xa={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
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
        `,await Za()}};async function Za(){try{const t=await f.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
            <h3>Tables</h3>
            <ul class="table-list">
                ${t.tables.map(s=>`
                    <li>
                        <a href="#/admin/tables/${s.name}" class="table-link" data-table="${s.name}">
                            ${s.name} <span class="badge">${s.rowCount}</span>
                        </a>
                    </li>
                `).join("")}
            </ul>
        `,e.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;lt(n),e.querySelectorAll(".table-link").forEach(o=>o.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(t){console.error(t),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function lt(t,e=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${t}...</div>`;try{const r=await f.get(`/admin/tables/${t}?page=${e}&limit=50`);if(!r.rows||r.rows.length===0){s.innerHTML=`
                <h2>${t}</h2>
                <div class="empty-state">No records found</div>
            `;return}const u=Object.keys(r.rows[0]);s.innerHTML=`
            <div class="table-header">
                <h2>${t}</h2>
                <div class="table-actions">
                    <span class="page-info">
                        Page ${r.pagination.page+1} of ${r.pagination.totalPages} 
                        (${r.pagination.total} records)
                    </span>
                    <div class="pagination">
                        <button ${e===0?"disabled":""} id="prev-page">Previous</button>
                        <button ${!r.pagination.hasMore&&e>=r.pagination.totalPages-1?"disabled":""} id="next-page">Next</button>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${u.map(c=>`<th>${c}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${r.rows.map(c=>`
                            <tr>
                                ${u.map(b=>{const v=c[b];let w=v;return v===null?w='<span class="null">NULL</span>':typeof v=="object"?w=JSON.stringify(v):String(v).length>100&&(w=String(v).substring(0,100)+"..."),`<td>${w}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>lt(t,e-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>lt(t,e+1))}catch(o){console.error(o),s.innerHTML=`<div class="error">Failed to load data for ${t}</div>`}}let H={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function en(t,e){let s=null;if(e.length>0){const n=e[0];if(n.imagePaths&&n.imagePaths.length>0){const o=n.imagePaths[0];let r;typeof o=="string"?r=o:o&&typeof o=="object"&&(r=o.filename||o.path||o.name||o.url,r&&r.includes("/")&&(r=r.split("/").pop()),r&&r.includes("\\")&&(r=r.split("\\").pop())),r&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(r)}`)}}const a=e.reduce((n,o)=>{var r;return n+(((r=o.imagePaths)==null?void 0:r.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${t}">
      <div class="manga-card-cover">
        ${s?`<img src="${s}" alt="${t}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📁</div>'">`:'<div class="placeholder">📁</div>'}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function tn(t){const e=H.bookmarks.find(s=>s.id===t);return e?e.alias||e.title:t}function sn(t){const e=H.bookmarks.find(s=>s.id===t);if(e&&e.seriesId){const s=H.series.find(a=>a.id===e.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function an(t,e,s,a=!1){return`
    <div class="manga-card trophy-gallery-card" data-trophy-id="${t}" data-is-series="${a}">
      <div class="manga-card-cover">
        <div class="placeholder trophy-placeholder">🏆</div>
        <div class="manga-card-badges">
            <span class="badge badge-trophy">🏆 ${s}</span>
            ${a?'<span class="badge badge-series">Series</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function nn(){const t={};console.log("Building trophy groups from:",H.trophyPages);for(const e of Object.keys(H.trophyPages)){const s=H.trophyPages[e];let a=0;for(const[o,r]of Object.entries(s))a+=Object.keys(r).length;if(console.log(`Manga ${e}: ${a} trophies`),a===0)continue;const n=sn(e);if(n)t[n.id]||(t[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),t[n.id].count+=a,t[n.id].mangaIds.push(e);else{const o=tn(e);console.log(`No series for ${e}, using name: ${o}`),t[e]={name:o,isSeries:!1,count:a,mangaIds:[e]}}}return console.log("Trophy groups result:",t),t}function Fe(){if(H.loading)return`
      ${G("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:t,listOrder:e}=H.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${H.activeTab==="galleries"?"active":""}" data-tab="galleries">
        📁 Galleries
      </button>
      <button class="tab-btn ${H.activeTab==="trophies"?"active":""}" data-tab="trophies">
        🏆 Trophies
      </button>
    </div>
  `;let a="";if(H.activeTab==="galleries")e.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${e.map(o=>{const r=t&&t[o]||[];return en(o,r)}).join("")}
        </div>
      `;else{const n=nn(),o=Object.keys(n);o.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${o.map(u=>{const c=n[u];return an(u,c.name,c.count,c.isSeries)}).join("")}
        </div>
      `}return`
    ${G("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function es(){ie();const t=document.getElementById("app");t.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{H.activeTab=s.dataset.tab,t.innerHTML=Fe(),es()})}),t.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;P.go(`/read/gallery/${encodeURIComponent(a)}`)})}),t.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?P.go(`/read/trophies/series-${a}/🏆`):P.go(`/read/trophies/${a}/🏆`)})})}async function on(){try{const[t,e,s,a]=await Promise.all([X.loadFavorites(),f.get("/trophy-pages"),X.loadBookmarks(),X.loadSeries()]);H.favorites=t||{favorites:{},listOrder:[]},H.trophyPages=e||{},H.bookmarks=s||[],H.series=a||[],H.loading=!1}catch(t){console.error("Failed to load favorites:",t),d("Failed to load favorites","error"),H.loading=!1}}async function rn(){console.log("[Favorites] mount called"),H.loading=!0;const t=document.getElementById("app");t.innerHTML=Fe(),await on(),console.log("[Favorites] Data loaded, rendering..."),t.innerHTML=Fe(),console.log("[Favorites] Calling setupListeners..."),es(),console.log("[Favorites] setupListeners complete")}function ln(){}const cn={mount:rn,unmount:ln,render:Fe};let z={downloads:{},queueTasks:[],historyTasks:[],autoCheck:null,loading:!0},Me=null,Q={};function vt(t){if(!t)return"Never";const e=Date.now()-new Date(t).getTime(),s=Math.floor(e/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function dn(t){if(!t)return"Not scheduled";const e=new Date(t).getTime()-Date.now();if(e<=0)return"Running now...";const s=Math.floor(e/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const o=Math.floor(a/24),r=a%24;return`in ${o}d ${r}h`}function ts(t){switch(t){case"download":return"📥";case"scrape":return"🔍";case"scan":return"📁";default:return"⚙️"}}function yt(t){switch(t){case"running":return"var(--color-success, #4caf50)";case"queued":case"pending":return"var(--color-warning, #ff9800)";case"paused":return"var(--color-info, #2196f3)";case"complete":return"var(--color-success, #4caf50)";case"error":case"failed":case"cancelled":return"var(--color-error, #f44336)";default:return"var(--text-secondary, #999)"}}function bt(t){switch(t){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return t}}function un(t){return!t||t==="default"?"Default (6h)":t==="daily"?"Daily":t==="weekly"?"Weekly":t}function hn(){const t=z.autoCheck;return t?`
    <div class="queue-inline-header">
      <span class="text-muted">${t.enabledCount} monitored · Last: ${vt(t.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">▶ Run All Now</button>
    </div>
  `:""}function pn(t){const e=t.nextCheck?dn(t.nextCheck):"Not set",s=t.nextCheck&&new Date(t.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${t.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📖</span>
          <div>
            <div class="task-title">${t.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${un(t.schedule)}${t.day?` · ${t.day.charAt(0).toUpperCase()+t.day.slice(1)}`:""}${t.time?` · ${t.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?"⏳ Due now":e}</span>
        </div>
      </div>
    </div>
  `}function _t(t,e){const s=e.total>0?Math.round(e.completed/e.total*100):0,a=e.status==="running"||e.status==="queued",n=e.status==="paused";return`
    <div class="queue-card task-card" data-task-id="${t}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📥</span>
          <div>
            <div class="task-title">${e.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${yt(e.status)}">${bt(e.status)}</div>
          </div>
        </div>
        <div class="task-actions">
          ${a?`<button class="btn btn-sm btn-icon" data-action="pause" data-task="${t}" title="Pause">⏸</button>`:""}
          ${n?`<button class="btn btn-sm btn-icon" data-action="resume" data-task="${t}" title="Resume">▶</button>`:""}
          ${a||n?`<button class="btn btn-sm btn-icon btn-danger" data-action="cancel" data-task="${t}" title="Cancel">✕</button>`:""}
        </div>
      </div>
      <div class="queue-card-body">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${s}%"></div>
          <span class="progress-text">${e.completed} / ${e.total} chapters (${s}%)</span>
        </div>
        ${e.current?`<div class="task-current">Currently: Chapter ${e.current}</div>`:""}
        ${e.errors&&e.errors.length>0?`<div class="task-errors">⚠ ${e.errors.length} error(s)</div>`:""}
      </div>
    </div>
  `}function mn(t){const e=t.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${ts(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${yt(t.status)}">${bt(t.status)}</div>
          </div>
        </div>
      </div>
      ${t.started_at?`<div class="queue-card-body"><small>Started: ${vt(t.started_at)}</small></div>`:""}
    </div>
  `}function gn(t){const e=t.data||{},s=t.result||{};let a="";return t.type==="scrape"?s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${t.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>'):(t.type==="scan"||t.type==="scan-local")&&s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`),`
    <div class="queue-card task-card history-card" data-history-id="${t.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${ts(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${yt(t.status)}">${bt(t.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${t.completed_at?`<div class="queue-card-body"><small>Completed: ${vt(t.completed_at)}</small></div>`:""}
    </div>
  `}function fn(){var u;const t=Object.entries(z.downloads),e=t.filter(([,c])=>c.status!=="complete"),s=t.filter(([,c])=>c.status==="complete"),a=new Set(e.map(([,c])=>c.bookmarkId).filter(Boolean)),n=z.queueTasks.filter(c=>{var b;return!(c.type==="download"&&((b=c.data)!=null&&b.mangaId)&&a.has(c.data.mangaId))}),o=e.length+n.length,r=((u=z.autoCheck)==null?void 0:u.schedules)||[];return`
    ${G("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>📋 Task Queue</h2>
        ${o>0?`<span class="queue-badge">${o} active</span>`:""}
      </div>

      ${e.length>0||n.length>0?`
        <div class="queue-section">
          <h3 class="queue-section-title">Active Tasks</h3>
          ${e.map(([c,b])=>_t(c,b)).join("")}
          ${n.map(c=>mn(c)).join("")}
        </div>
      `:""}

      ${r.length>0?`
        <div class="queue-section">
          <div class="queue-section-header">
            <h3 class="queue-section-title">Scheduled Checks (${r.length})</h3>
            ${hn()}
          </div>
          ${r.map(c=>pn(c)).join("")}
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section">
          <h3 class="queue-section-title">Recently Completed Downloads</h3>
          ${s.map(([c,b])=>_t(c,b)).join("")}
        </div>
      `:""}

      ${z.historyTasks&&z.historyTasks.length>0?`
        <div class="queue-section">
            <h3 class="queue-section-title">Task History</h3>
            <div class="history-list">
                ${z.historyTasks.map(c=>gn(c)).join("")}
            </div>
        </div>
      `:""}

      ${e.length===0&&n.length===0&&s.length===0&&r.length===0&&(!z.historyTasks||z.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">✨</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function de(){try{const[t,e,s,a]=await Promise.all([f.getDownloads().catch(()=>({})),f.getQueueTasks().catch(()=>[]),f.getQueueHistory(50).catch(()=>[]),f.getAutoCheckStatus().catch(()=>null)]);z.downloads=t||{},z.queueTasks=e||[],z.historyTasks=s||[],z.autoCheck=a,z.loading=!1}catch(t){console.error("[Queue] Failed to load data:",t),z.loading=!1}}function oe(){const t=document.getElementById("app");t&&(t.innerHTML=fn(),vn())}function vn(){ie();const t=document.getElementById("run-autocheck-btn");t&&t.addEventListener("click",async()=>{t.disabled=!0,t.textContent="⏳ Running...";try{d("Auto-check started...","info");const e=await f.runAutoCheck();d(`Check complete: ${e.checked} checked, ${e.updated} updated`,"success"),await de(),oe()}catch(e){d("Auto-check failed: "+e.message,"error"),t.disabled=!1,t.textContent="▶ Run Now"}}),document.querySelectorAll(".scheduled-manga-card").forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.mangaId;s&&(window.location.hash=`#/manga/${s}`)})}),document.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",async s=>{s.stopPropagation();const a=e.dataset.action,n=e.dataset.task;try{a==="pause"?(await f.pauseDownload(n),d("Download paused","info")):a==="resume"?(await f.resumeDownload(n),d("Download resumed","info")):a==="cancel"&&confirm("Cancel this download?")&&(await f.cancelDownload(n),d("Download cancelled","info")),await de(),oe()}catch(o){d(`Action failed: ${o.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.historyId,a=document.getElementById(`task-details-${s}`);a&&a.classList.toggle("hidden")})})}async function yn(){z.loading=!0;const t=document.getElementById("app");t.innerHTML=`
    ${G("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>📋 Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,ie(),await de(),oe(),Me=setInterval(async()=>{await de(),oe()},5e3),Q.downloadProgress=e=>{e.taskId&&z.downloads[e.taskId]&&(Object.assign(z.downloads[e.taskId],e),oe())},Q.downloadCompleted=e=>{de().then(oe)},Q.queueUpdated=e=>{de().then(oe)},D.on(V.DOWNLOAD_PROGRESS,Q.downloadProgress),D.on(V.DOWNLOAD_COMPLETED,Q.downloadCompleted),D.on(V.QUEUE_UPDATED,Q.queueUpdated)}function bn(){Me&&(clearInterval(Me),Me=null),Q.downloadProgress&&D.off(V.DOWNLOAD_PROGRESS,Q.downloadProgress),Q.downloadCompleted&&D.off(V.DOWNLOAD_COMPLETED,Q.downloadCompleted),Q.queueUpdated&&D.off(V.QUEUE_UPDATED,Q.queueUpdated),Q={}}const wn={mount:yn,unmount:bn};class kn{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,s){this.routes.set(e,s)}async navigate(){console.log("[Router] navigate called");const e=window.location.hash.slice(1)||"/",[s,...a]=e.split("/").filter(Boolean),n=`/${s||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let o=this.routes.get(n);!o&&this.routes.has("/")&&(o=this.routes.get("/")),o&&(this.currentRoute=n,this.currentView=o,o.mount&&(console.log("[Router] calling mount on view module"),await o.mount(a)),ie())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),ie())}}const P=new kn;P.register("/",ha);P.register("/manga",Va);P.register("/read",ba);P.register("/series",Ya);P.register("/settings",Ja);P.register("/admin",Xa);P.register("/favorites",cn);P.register("/queue",wn);class En{constructor(){this.currentView=null,this.mangaCache=new Map}async init(){if(console.log("[App] Initializing..."),!f.isAuthenticated()){window.location.href="/login.html";return}D.connect(),this.setupSocketListeners(),P.init(),this.hideLoading(),console.log("[App] Ready")}setupSocketListeners(){D.on(V.CHAPTER_DOWNLOADED,e=>{console.log("[Socket] Chapter downloaded:",e),this.onChapterUpdate(e)}),D.on(V.CHAPTER_HIDDEN,e=>{console.log("[Socket] Chapter hidden:",e),this.onChapterUpdate(e)}),D.on(V.CHAPTER_UNHIDDEN,e=>{console.log("[Socket] Chapter unhidden:",e),this.onChapterUpdate(e)}),D.on(V.MANGA_UPDATED,e=>{console.log("[Socket] Manga updated:",e),this.onMangaUpdate(e)}),D.on(V.DOWNLOAD_PROGRESS,e=>{this.onDownloadProgress(e)}),D.on(V.DOWNLOAD_COMPLETED,e=>{console.log("[Socket] Download completed:",e),this.showToast(`Downloaded: ${e.chapterNumber}`,"success")}),D.on(V.QUEUE_UPDATED,e=>{this.onQueueUpdate(e)}),D.on(V.ACTION_RECORDED,e=>{console.log("[Socket] Action recorded:",e),this.updateUndoButton()}),D.on(V.ACTION_UNDONE,e=>{console.log("[Socket] Action undone:",e),this.showToast("Action undone","info"),this.updateUndoButton()})}onChapterUpdate(e){window.dispatchEvent(new CustomEvent("chapter:update",{detail:e}))}onMangaUpdate(e){this.mangaCache.delete(e.mangaId),window.dispatchEvent(new CustomEvent("manga:update",{detail:e}))}onDownloadProgress(e){window.dispatchEvent(new CustomEvent("download:progress",{detail:e}))}onQueueUpdate(e){window.dispatchEvent(new CustomEvent("queue:update",{detail:e}))}async updateUndoButton(){try{const{undoableCount:e}=await f.getActions({limit:1}),s=document.getElementById("undo-btn");if(s){s.style.display=e>0?"flex":"none";const a=s.querySelector(".count");a&&(a.textContent=e)}}catch{}}showToast(e,s="info"){const a=document.createElement("div");a.className=`toast toast-${s}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}hideLoading(){const e=document.querySelector(".loading-screen");e&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),300))}}const Cn=new En;document.addEventListener("DOMContentLoaded",()=>Cn.init());
