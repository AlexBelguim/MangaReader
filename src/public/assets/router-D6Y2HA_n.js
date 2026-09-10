import{a as v}from"./api-5OsgPoPa.js";const De=Object.create(null);De.open="0";De.close="1";De.ping="2";De.pong="3";De.message="4";De.upgrade="5";De.noop="6";const Dt=Object.create(null);Object.keys(De).forEach(e=>{Dt[De[e]]=e});const ys={type:"error",data:"parser error"},Ia=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Ta=typeof ArrayBuffer=="function",Ma=e=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(e):e&&e.buffer instanceof ArrayBuffer,Hs=({type:e,data:t},s,a)=>Ia&&t instanceof Blob?s?a(t):ra(t,a):Ta&&(t instanceof ArrayBuffer||Ma(t))?s?a(t):ra(new Blob([t]),a):a(De[e]+(t||"")),ra=(e,t)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];t("b"+(a||""))},s.readAsDataURL(e)};function oa(e){return e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}let hs;function Mn(e,t){if(Ia&&e.data instanceof Blob)return e.data.arrayBuffer().then(oa).then(t);if(Ta&&(e.data instanceof ArrayBuffer||Ma(e.data)))return t(oa(e.data));Hs(e,!1,s=>{hs||(hs=new TextEncoder),t(hs.encode(s))})}const ia="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",yt=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let e=0;e<ia.length;e++)yt[ia.charCodeAt(e)]=e;const An=e=>{let t=e.length*.75,s=e.length,a,n=0,r,i,c,l;e[e.length-1]==="="&&(t--,e[e.length-2]==="="&&t--);const d=new ArrayBuffer(t),u=new Uint8Array(d);for(a=0;a<s;a+=4)r=yt[e.charCodeAt(a)],i=yt[e.charCodeAt(a+1)],c=yt[e.charCodeAt(a+2)],l=yt[e.charCodeAt(a+3)],u[n++]=r<<2|i>>4,u[n++]=(i&15)<<4|c>>2,u[n++]=(c&3)<<6|l&63;return d},Bn=typeof ArrayBuffer=="function",Vs=(e,t)=>{if(typeof e!="string")return{type:"message",data:Aa(e,t)};const s=e.charAt(0);return s==="b"?{type:"message",data:_n(e.substring(1),t)}:Dt[s]?e.length>1?{type:Dt[s],data:e.substring(1)}:{type:Dt[s]}:ys},_n=(e,t)=>{if(Bn){const s=An(e);return Aa(s,t)}else return{base64:!0,data:e}},Aa=(e,t)=>{switch(t){case"blob":return e instanceof Blob?e:new Blob([e]);case"arraybuffer":default:return e instanceof ArrayBuffer?e:e.buffer}},Ba="",qn=(e,t)=>{const s=e.length,a=new Array(s);let n=0;e.forEach((r,i)=>{Hs(r,!1,c=>{a[i]=c,++n===s&&t(a.join(Ba))})})},Pn=(e,t)=>{const s=e.split(Ba),a=[];for(let n=0;n<s.length;n++){const r=Vs(s[n],t);if(a.push(r),r.type==="error")break}return a};function Rn(){return new TransformStream({transform(e,t){Mn(e,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const r=new DataView(n.buffer);r.setUint8(0,126),r.setUint16(1,a)}else{n=new Uint8Array(9);const r=new DataView(n.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(a))}e.data&&typeof e.data!="string"&&(n[0]|=128),t.enqueue(n),t.enqueue(s)})}})}let ms;function Bt(e){return e.reduce((t,s)=>t+s.length,0)}function _t(e,t){if(e[0].length===t)return e.shift();const s=new Uint8Array(t);let a=0;for(let n=0;n<t;n++)s[n]=e[0][a++],a===e[0].length&&(e.shift(),a=0);return e.length&&a<e[0].length&&(e[0]=e[0].slice(a)),s}function Dn(e,t){ms||(ms=new TextDecoder);const s=[];let a=0,n=-1,r=!1;return new TransformStream({transform(i,c){for(s.push(i);;){if(a===0){if(Bt(s)<1)break;const l=_t(s,1);r=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(Bt(s)<2)break;const l=_t(s,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(Bt(s)<8)break;const l=_t(s,8),d=new DataView(l.buffer,l.byteOffset,l.length),u=d.getUint32(0);if(u>Math.pow(2,21)-1){c.enqueue(ys);break}n=u*Math.pow(2,32)+d.getUint32(4),a=3}else{if(Bt(s)<n)break;const l=_t(s,n);c.enqueue(Vs(r?l:ms.decode(l),t)),a=0}if(n===0||n>e){c.enqueue(ys);break}}}})}const _a=4;function de(e){if(e)return Nn(e)}function Nn(e){for(var t in de.prototype)e[t]=de.prototype[t];return e}de.prototype.on=de.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+e]=this._callbacks["$"+e]||[]).push(t),this};de.prototype.once=function(e,t){function s(){this.off(e,s),t.apply(this,arguments)}return s.fn=t,this.on(e,s),this};de.prototype.off=de.prototype.removeListener=de.prototype.removeAllListeners=de.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+e];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+e],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===t||a.fn===t){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+e],this};de.prototype.emit=function(e){this._callbacks=this._callbacks||{};for(var t=new Array(arguments.length-1),s=this._callbacks["$"+e],a=1;a<arguments.length;a++)t[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,t)}return this};de.prototype.emitReserved=de.prototype.emit;de.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks["$"+e]||[]};de.prototype.hasListeners=function(e){return!!this.listeners(e).length};const ns=typeof Promise=="function"&&typeof Promise.resolve=="function"?t=>Promise.resolve().then(t):(t,s)=>s(t,0),Se=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Fn="arraybuffer";function qa(e,...t){return t.reduce((s,a)=>(e.hasOwnProperty(a)&&(s[a]=e[a]),s),{})}const On=Se.setTimeout,Un=Se.clearTimeout;function rs(e,t){t.useNativeTimers?(e.setTimeoutFn=On.bind(Se),e.clearTimeoutFn=Un.bind(Se)):(e.setTimeoutFn=Se.setTimeout.bind(Se),e.clearTimeoutFn=Se.clearTimeout.bind(Se))}const Hn=1.33;function Vn(e){return typeof e=="string"?jn(e):Math.ceil((e.byteLength||e.size)*Hn)}function jn(e){let t=0,s=0;for(let a=0,n=e.length;a<n;a++)t=e.charCodeAt(a),t<128?s+=1:t<2048?s+=2:t<55296||t>=57344?s+=3:(a++,s+=4);return s}function Pa(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function zn(e){let t="";for(let s in e)e.hasOwnProperty(s)&&(t.length&&(t+="&"),t+=encodeURIComponent(s)+"="+encodeURIComponent(e[s]));return t}function Qn(e){let t={},s=e.split("&");for(let a=0,n=s.length;a<n;a++){let r=s[a].split("=");t[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return t}class Wn extends Error{constructor(t,s,a){super(t),this.description=s,this.context=a,this.type="TransportError"}}class js extends de{constructor(t){super(),this.writable=!1,rs(this,t),this.opts=t,this.query=t.query,this.socket=t.socket,this.supportsBinary=!t.forceBase64}onError(t,s,a){return super.emitReserved("error",new Wn(t,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(t){this.readyState==="open"&&this.write(t)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(t){const s=Vs(t,this.socket.binaryType);this.onPacket(s)}onPacket(t){super.emitReserved("packet",t)}onClose(t){this.readyState="closed",super.emitReserved("close",t)}pause(t){}createUri(t,s={}){return t+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const t=this.opts.hostname;return t.indexOf(":")===-1?t:"["+t+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(t){const s=zn(t);return s.length?"?"+s:""}}class Gn extends js{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(t){this.readyState="pausing";const s=()=>{this.readyState="paused",t()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(t){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};Pn(t,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const t=()=>{this.write([{type:"close"}])};this.readyState==="open"?t():this.once("open",t)}write(t){this.writable=!1,qn(t,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const t=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=Pa()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(t,s)}}let Ra=!1;try{Ra=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Kn=Ra;function Yn(){}class Jn extends Gn{constructor(t){if(super(t),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&t.hostname!==location.hostname||a!==t.port}}doWrite(t,s){const a=this.request({method:"POST",data:t});a.on("success",s),a.on("error",(n,r)=>{this.onError("xhr post error",n,r)})}doPoll(){const t=this.request();t.on("data",this.onData.bind(this)),t.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=t}}class Re extends de{constructor(t,s,a){super(),this.createRequest=t,rs(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var t;const s=qa(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(t=this._opts.cookieJar)===null||t===void 0||t.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=Re.requestsCount++,Re.requests[this._index]=this)}_onError(t){this.emitReserved("error",t,this._xhr),this._cleanup(!0)}_cleanup(t){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Yn,t)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Re.requests[this._index],this._xhr=null}}_onLoad(){const t=this._xhr.responseText;t!==null&&(this.emitReserved("data",t),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Re.requestsCount=0;Re.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",la);else if(typeof addEventListener=="function"){const e="onpagehide"in Se?"pagehide":"unload";addEventListener(e,la,!1)}}function la(){for(let e in Re.requests)Re.requests.hasOwnProperty(e)&&Re.requests[e].abort()}const Xn=function(){const e=Da({xdomain:!1});return e&&e.responseType!==null}();class Zn extends Jn{constructor(t){super(t);const s=t&&t.forceBase64;this.supportsBinary=Xn&&!s}request(t={}){return Object.assign(t,{xd:this.xd},this.opts),new Re(Da,this.uri(),t)}}function Da(e){const t=e.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!t||Kn))return new XMLHttpRequest}catch{}if(!t)try{return new Se[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Na=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class er extends js{get name(){return"websocket"}doOpen(){const t=this.uri(),s=this.opts.protocols,a=Na?{}:qa(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(t,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=t=>this.onClose({description:"websocket connection closed",context:t}),this.ws.onmessage=t=>this.onData(t.data),this.ws.onerror=t=>this.onError("websocket error",t)}write(t){this.writable=!1;for(let s=0;s<t.length;s++){const a=t[s],n=s===t.length-1;Hs(a,this.supportsBinary,r=>{try{this.doWrite(a,r)}catch{}n&&ns(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const t=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=Pa()),this.supportsBinary||(s.b64=1),this.createUri(t,s)}}const gs=Se.WebSocket||Se.MozWebSocket;class tr extends er{createSocket(t,s,a){return Na?new gs(t,s,a):s?new gs(t,s):new gs(t)}doWrite(t,s){this.ws.send(s)}}class sr extends js{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(t){return this.emitReserved("error",t)}this._transport.closed.then(()=>{this.onClose()}).catch(t=>{this.onError("webtransport error",t)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(t=>{const s=Dn(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=t.readable.pipeThrough(s).getReader(),n=Rn();n.readable.pipeTo(t.writable),this._writer=n.writable.getWriter();const r=()=>{a.read().then(({done:c,value:l})=>{c||(this.onPacket(l),r())}).catch(c=>{})};r();const i={type:"open"};this.query.sid&&(i.data=`{"sid":"${this.query.sid}"}`),this._writer.write(i).then(()=>this.onOpen())})})}write(t){this.writable=!1;for(let s=0;s<t.length;s++){const a=t[s],n=s===t.length-1;this._writer.write(a).then(()=>{n&&ns(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var t;(t=this._transport)===null||t===void 0||t.close()}}const ar={websocket:tr,webtransport:sr,polling:Zn},nr=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,rr=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function bs(e){if(e.length>8e3)throw"URI too long";const t=e,s=e.indexOf("["),a=e.indexOf("]");s!=-1&&a!=-1&&(e=e.substring(0,s)+e.substring(s,a).replace(/:/g,";")+e.substring(a,e.length));let n=nr.exec(e||""),r={},i=14;for(;i--;)r[rr[i]]=n[i]||"";return s!=-1&&a!=-1&&(r.source=t,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=or(r,r.path),r.queryKey=ir(r,r.query),r}function or(e,t){const s=/\/{2,9}/g,a=t.replace(s,"/").split("/");return(t.slice(0,1)=="/"||t.length===0)&&a.splice(0,1),t.slice(-1)=="/"&&a.splice(a.length-1,1),a}function ir(e,t){const s={};return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,r){n&&(s[n]=r)}),s}const ws=typeof addEventListener=="function"&&typeof removeEventListener=="function",Nt=[];ws&&addEventListener("offline",()=>{Nt.forEach(e=>e())},!1);class Qe extends de{constructor(t,s){if(super(),this.binaryType=Fn,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,t&&typeof t=="object"&&(s=t,t=null),t){const a=bs(t);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=bs(s.host).host);rs(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Qn(this.opts.query)),ws&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Nt.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(t){const s=Object.assign({},this.opts.query);s.EIO=_a,s.transport=t,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[t]);return new this._transportsByName[t](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const t=this.opts.rememberUpgrade&&Qe.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(t);s.open(),this.setTransport(s)}setTransport(t){this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",Qe.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",t),this.emitReserved("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=t.data,this._onError(s);break;case"message":this.emitReserved("data",t.data),this.emitReserved("message",t.data);break}}onHandshake(t){this.emitReserved("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this._pingInterval=t.pingInterval,this._pingTimeout=t.pingTimeout,this._maxPayload=t.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const t=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+t,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},t),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const t=this._getWritablePackets();this.transport.send(t),this._prevBufferLen=t.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=Vn(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const t=Date.now()>this._pingTimeoutTime;return t&&(this._pingTimeoutTime=0,ns(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),t}write(t,s,a){return this._sendPacket("message",t,s,a),this}send(t,s,a){return this._sendPacket("message",t,s,a),this}_sendPacket(t,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const r={type:t,data:s,options:a};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),n&&this.once("flush",n),this.flush()}close(){const t=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),t()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():t()}):this.upgrading?a():t()),this}_onError(t){if(Qe.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",t),this._onClose("transport error",t)}_onClose(t,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ws&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=Nt.indexOf(this._offlineEventListener);a!==-1&&Nt.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",t,s),this.writeBuffer=[],this._prevBufferLen=0}}}Qe.protocol=_a;class lr extends Qe{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let t=0;t<this._upgrades.length;t++)this._probe(this._upgrades[t])}_probe(t){let s=this.createTransport(t),a=!1;Qe.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",p=>{if(!a)if(p.type==="pong"&&p.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;Qe.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(u(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const m=new Error("probe error");m.transport=s.name,this.emitReserved("upgradeError",m)}}))};function r(){a||(a=!0,u(),s.close(),s=null)}const i=p=>{const m=new Error("probe error: "+p);m.transport=s.name,r(),this.emitReserved("upgradeError",m)};function c(){i("transport closed")}function l(){i("socket closed")}function d(p){s&&p.name!==s.name&&r()}const u=()=>{s.removeListener("open",n),s.removeListener("error",i),s.removeListener("close",c),this.off("close",l),this.off("upgrading",d)};s.once("open",n),s.once("error",i),s.once("close",c),this.once("close",l),this.once("upgrading",d),this._upgrades.indexOf("webtransport")!==-1&&t!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(t){this._upgrades=this._filterUpgrades(t.upgrades),super.onHandshake(t)}_filterUpgrades(t){const s=[];for(let a=0;a<t.length;a++)~this.transports.indexOf(t[a])&&s.push(t[a]);return s}}let cr=class extends lr{constructor(t,s={}){const a=typeof t=="object"?t:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>ar[n]).filter(n=>!!n)),super(t,a)}};function dr(e,t="",s){let a=e;s=s||typeof location<"u"&&location,e==null&&(e=s.protocol+"//"+s.host),typeof e=="string"&&(e.charAt(0)==="/"&&(e.charAt(1)==="/"?e=s.protocol+e:e=s.host+e),/^(https?|wss?):\/\//.test(e)||(typeof s<"u"?e=s.protocol+"//"+e:e="https://"+e),a=bs(e)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const r=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+r+":"+a.port+t,a.href=a.protocol+"://"+r+(s&&s.port===a.port?"":":"+a.port),a}const ur=typeof ArrayBuffer=="function",pr=e=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(e):e.buffer instanceof ArrayBuffer,Fa=Object.prototype.toString,hr=typeof Blob=="function"||typeof Blob<"u"&&Fa.call(Blob)==="[object BlobConstructor]",mr=typeof File=="function"||typeof File<"u"&&Fa.call(File)==="[object FileConstructor]";function zs(e){return ur&&(e instanceof ArrayBuffer||pr(e))||hr&&e instanceof Blob||mr&&e instanceof File}function Ft(e,t){if(!e||typeof e!="object")return!1;if(Array.isArray(e)){for(let s=0,a=e.length;s<a;s++)if(Ft(e[s]))return!0;return!1}if(zs(e))return!0;if(e.toJSON&&typeof e.toJSON=="function"&&arguments.length===1)return Ft(e.toJSON(),!0);for(const s in e)if(Object.prototype.hasOwnProperty.call(e,s)&&Ft(e[s]))return!0;return!1}function gr(e){const t=[],s=e.data,a=e;return a.data=$s(s,t),a.attachments=t.length,{packet:a,buffers:t}}function $s(e,t){if(!e)return e;if(zs(e)){const s={_placeholder:!0,num:t.length};return t.push(e),s}else if(Array.isArray(e)){const s=new Array(e.length);for(let a=0;a<e.length;a++)s[a]=$s(e[a],t);return s}else if(typeof e=="object"&&!(e instanceof Date)){const s={};for(const a in e)Object.prototype.hasOwnProperty.call(e,a)&&(s[a]=$s(e[a],t));return s}return e}function fr(e,t){return e.data=ks(e.data,t),delete e.attachments,e}function ks(e,t){if(!e)return e;if(e&&e._placeholder===!0){if(typeof e.num=="number"&&e.num>=0&&e.num<t.length)return t[e.num];throw new Error("illegal attachments")}else if(Array.isArray(e))for(let s=0;s<e.length;s++)e[s]=ks(e[s],t);else if(typeof e=="object")for(const s in e)Object.prototype.hasOwnProperty.call(e,s)&&(e[s]=ks(e[s],t));return e}const vr=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var K;(function(e){e[e.CONNECT=0]="CONNECT",e[e.DISCONNECT=1]="DISCONNECT",e[e.EVENT=2]="EVENT",e[e.ACK=3]="ACK",e[e.CONNECT_ERROR=4]="CONNECT_ERROR",e[e.BINARY_EVENT=5]="BINARY_EVENT",e[e.BINARY_ACK=6]="BINARY_ACK"})(K||(K={}));class yr{constructor(t){this.replacer=t}encode(t){return(t.type===K.EVENT||t.type===K.ACK)&&Ft(t)?this.encodeAsBinary({type:t.type===K.EVENT?K.BINARY_EVENT:K.BINARY_ACK,nsp:t.nsp,data:t.data,id:t.id}):[this.encodeAsString(t)]}encodeAsString(t){let s=""+t.type;return(t.type===K.BINARY_EVENT||t.type===K.BINARY_ACK)&&(s+=t.attachments+"-"),t.nsp&&t.nsp!=="/"&&(s+=t.nsp+","),t.id!=null&&(s+=t.id),t.data!=null&&(s+=JSON.stringify(t.data,this.replacer)),s}encodeAsBinary(t){const s=gr(t),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class Qs extends de{constructor(t){super(),this.reviver=t}add(t){let s;if(typeof t=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(t);const a=s.type===K.BINARY_EVENT;a||s.type===K.BINARY_ACK?(s.type=a?K.EVENT:K.ACK,this.reconstructor=new br(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(zs(t)||t.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(t),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+t)}decodeString(t){let s=0;const a={type:Number(t.charAt(0))};if(K[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===K.BINARY_EVENT||a.type===K.BINARY_ACK){const r=s+1;for(;t.charAt(++s)!=="-"&&s!=t.length;);const i=t.substring(r,s);if(i!=Number(i)||t.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(i)}if(t.charAt(s+1)==="/"){const r=s+1;for(;++s&&!(t.charAt(s)===","||s===t.length););a.nsp=t.substring(r,s)}else a.nsp="/";const n=t.charAt(s+1);if(n!==""&&Number(n)==n){const r=s+1;for(;++s;){const i=t.charAt(s);if(i==null||Number(i)!=i){--s;break}if(s===t.length)break}a.id=Number(t.substring(r,s+1))}if(t.charAt(++s)){const r=this.tryParse(t.substr(s));if(Qs.isPayloadValid(a.type,r))a.data=r;else throw new Error("invalid payload")}return a}tryParse(t){try{return JSON.parse(t,this.reviver)}catch{return!1}}static isPayloadValid(t,s){switch(t){case K.CONNECT:return ca(s);case K.DISCONNECT:return s===void 0;case K.CONNECT_ERROR:return typeof s=="string"||ca(s);case K.EVENT:case K.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&vr.indexOf(s[0])===-1);case K.ACK:case K.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class br{constructor(t){this.packet=t,this.buffers=[],this.reconPack=t}takeBinaryData(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){const s=fr(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function ca(e){return Object.prototype.toString.call(e)==="[object Object]"}const wr=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Qs,Encoder:yr,get PacketType(){return K}},Symbol.toStringTag,{value:"Module"}));function Ie(e,t,s){return e.on(t,s),function(){e.off(t,s)}}const $r=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Oa extends de{constructor(t,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=t,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const t=this.io;this.subs=[Ie(t,"open",this.onopen.bind(this)),Ie(t,"packet",this.onpacket.bind(this)),Ie(t,"error",this.onerror.bind(this)),Ie(t,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...t){return t.unshift("message"),this.emit.apply(this,t),this}emit(t,...s){var a,n,r;if($r.hasOwnProperty(t))throw new Error('"'+t.toString()+'" is a reserved event name');if(s.unshift(t),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const i={type:K.EVENT,data:s};if(i.options={},i.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const u=this.ids++,p=s.pop();this._registerAckCallback(u,p),i.id=u}const c=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(i),this.packet(i)):this.sendBuffer.push(i)),this.flags={},this}_registerAckCallback(t,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[t]=s;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[t];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===t&&this.sendBuffer.splice(c,1);s.call(this,new Error("operation has timed out"))},n),i=(...c)=>{this.io.clearTimeoutFn(r),s.apply(this,c)};i.withError=!0,this.acks[t]=i}emitWithAck(t,...s){return new Promise((a,n)=>{const r=(i,c)=>i?n(i):a(c);r.withError=!0,s.push(r),this.emit(t,...s)})}_addToQueue(t){let s;typeof t[t.length-1]=="function"&&(s=t.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:t,flags:Object.assign({fromQueue:!0},this.flags)};t.push((n,...r)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...r)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(t=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!t||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(t){t.nsp=this.nsp,this.io._packet(t)}onopen(){typeof this.auth=="function"?this.auth(t=>{this._sendConnectPacket(t)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(t){this.packet({type:K.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},t):t})}onerror(t){this.connected||this.emitReserved("connect_error",t)}onclose(t,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",t,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(t=>{if(!this.sendBuffer.some(a=>String(a.id)===t)){const a=this.acks[t];delete this.acks[t],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(t){if(t.nsp===this.nsp)switch(t.type){case K.CONNECT:t.data&&t.data.sid?this.onconnect(t.data.sid,t.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case K.EVENT:case K.BINARY_EVENT:this.onevent(t);break;case K.ACK:case K.BINARY_ACK:this.onack(t);break;case K.DISCONNECT:this.ondisconnect();break;case K.CONNECT_ERROR:this.destroy();const a=new Error(t.data.message);a.data=t.data.data,this.emitReserved("connect_error",a);break}}onevent(t){const s=t.data||[];t.id!=null&&s.push(this.ack(t.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(t){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,t)}super.emit.apply(this,t),this._pid&&t.length&&typeof t[t.length-1]=="string"&&(this._lastOffset=t[t.length-1])}ack(t){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:K.ACK,id:t,data:n}))}}onack(t){const s=this.acks[t.id];typeof s=="function"&&(delete this.acks[t.id],s.withError&&t.data.unshift(null),s.apply(this,t.data))}onconnect(t,s){this.id=t,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(t=>this.emitEvent(t)),this.receiveBuffer=[],this.sendBuffer.forEach(t=>{this.notifyOutgoingListeners(t),this.packet(t)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(t=>t()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:K.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(t){return this.flags.compress=t,this}get volatile(){return this.flags.volatile=!0,this}timeout(t){return this.flags.timeout=t,this}onAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(t),this}prependAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(t),this}offAny(t){if(!this._anyListeners)return this;if(t){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(t===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(t),this}prependAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(t),this}offAnyOutgoing(t){if(!this._anyOutgoingListeners)return this;if(t){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(t===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(t){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,t.data)}}}function pt(e){e=e||{},this.ms=e.min||100,this.max=e.max||1e4,this.factor=e.factor||2,this.jitter=e.jitter>0&&e.jitter<=1?e.jitter:0,this.attempts=0}pt.prototype.duration=function(){var e=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var t=Math.random(),s=Math.floor(t*this.jitter*e);e=Math.floor(t*10)&1?e+s:e-s}return Math.min(e,this.max)|0};pt.prototype.reset=function(){this.attempts=0};pt.prototype.setMin=function(e){this.ms=e};pt.prototype.setMax=function(e){this.max=e};pt.prototype.setJitter=function(e){this.jitter=e};class Es extends de{constructor(t,s){var a;super(),this.nsps={},this.subs=[],t&&typeof t=="object"&&(s=t,t=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,rs(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new pt({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=t;const n=s.parser||wr;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(t){return arguments.length?(this._reconnection=!!t,t||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(t){return t===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=t,this)}reconnectionDelay(t){var s;return t===void 0?this._reconnectionDelay:(this._reconnectionDelay=t,(s=this.backoff)===null||s===void 0||s.setMin(t),this)}randomizationFactor(t){var s;return t===void 0?this._randomizationFactor:(this._randomizationFactor=t,(s=this.backoff)===null||s===void 0||s.setJitter(t),this)}reconnectionDelayMax(t){var s;return t===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=t,(s=this.backoff)===null||s===void 0||s.setMax(t),this)}timeout(t){return arguments.length?(this._timeout=t,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(t){if(~this._readyState.indexOf("open"))return this;this.engine=new cr(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=Ie(s,"open",function(){a.onopen(),t&&t()}),r=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),t?t(c):this.maybeReconnectOnOpen()},i=Ie(s,"error",r);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{n(),r(new Error("timeout")),s.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(i),this}connect(t){return this.open(t)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const t=this.engine;this.subs.push(Ie(t,"ping",this.onping.bind(this)),Ie(t,"data",this.ondata.bind(this)),Ie(t,"error",this.onerror.bind(this)),Ie(t,"close",this.onclose.bind(this)),Ie(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(t){try{this.decoder.add(t)}catch(s){this.onclose("parse error",s)}}ondecoded(t){ns(()=>{this.emitReserved("packet",t)},this.setTimeoutFn)}onerror(t){this.emitReserved("error",t)}socket(t,s){let a=this.nsps[t];return a?this._autoConnect&&!a.active&&a.connect():(a=new Oa(this,t,s),this.nsps[t]=a),a}_destroy(t){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(t){const s=this.encoder.encode(t);for(let a=0;a<s.length;a++)this.engine.write(s[a],t.options)}cleanup(){this.subs.forEach(t=>t()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(t,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",t,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{t.skipReconnect||(this.emitReserved("reconnect_attempt",t.backoff.attempts),!t.skipReconnect&&t.open(n=>{n?(t._reconnecting=!1,t.reconnect(),this.emitReserved("reconnect_error",n)):t.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const t=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",t)}}const gt={};function Ct(e,t){typeof e=="object"&&(t=e,e=void 0),t=t||{};const s=dr(e,t.path||"/socket.io"),a=s.source,n=s.id,r=s.path,i=gt[n]&&r in gt[n].nsps,c=t.forceNew||t["force new connection"]||t.multiplex===!1||i;let l;return c?l=new Es(a,t):(gt[n]||(gt[n]=new Es(a,t)),l=gt[n]),s.query&&!t.query&&(t.query=s.queryKey),l.socket(s.path,t)}Object.assign(Ct,{Manager:Es,Socket:Oa,io:Ct,connect:Ct});class kr{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var t;(t=this.socket)!=null&&t.connected||(this.socket=Ct({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(t){var s;this.subscribedMangas.add(t),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",t)}unsubscribeFromManga(t){var s;this.subscribedMangas.delete(t),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",t)}on(t,s){this.listeners.has(t)||this.listeners.set(t,new Set),this.listeners.get(t).add(s),this.socket&&this.socket.on(t,s)}off(t,s){this.listeners.has(t)&&this.listeners.get(t).delete(s),this.socket&&this.socket.off(t,s)}emit(t,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(t,s)}}const ie={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone",SITE_CHALLENGE:"site:challenge",SITE_CHALLENGE_CLEARED:"site:challenge-cleared",SITE_SESSION:"site:session",TORRENT_UPDATE:"torrent:update",IMPORT_PROGRESS:"import:progress"},se=new kr,ye={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},Te=new Set,ce=new Map,bt=new Map;function Er(e){return ye[e]}function Sr(e,t){ye[e]=t,Te.add(e),Mt(e)}function Cr(e,t){return bt.has(e)||bt.set(e,new Set),bt.get(e).add(t),()=>{var s;return(s=bt.get(e))==null?void 0:s.delete(t)}}function Mt(e){const t=bt.get(e);t&&t.forEach(s=>s(ye[e]))}function wt(e){Te.delete(e),ce.delete(e)}function xr(e){return Te.has(e)}async function $t(e=!1){if(!e&&Te.has("bookmarks"))return ye.bookmarks;if(ce.has("bookmarks"))return ce.get("bookmarks");const t=v.getBookmarks().then(s=>(ye.bookmarks=s||[],Te.add("bookmarks"),ce.delete("bookmarks"),Mt("bookmarks"),ye.bookmarks)).catch(s=>{throw ce.delete("bookmarks"),s});return ce.set("bookmarks",t),t}async function Lr(e=!1){if(!e&&Te.has("series"))return ye.series;if(ce.has("series"))return ce.get("series");const t=v.get("/series").then(s=>(ye.series=s||[],Te.add("series"),ce.delete("series"),Mt("series"),ye.series)).catch(s=>{throw ce.delete("series"),s});return ce.set("series",t),t}async function Ir(e=!1){if(!e&&Te.has("categories"))return ye.categories;if(ce.has("categories"))return ce.get("categories");const t=v.get("/categories").then(s=>(ye.categories=s.categories||[],Te.add("categories"),ce.delete("categories"),Mt("categories"),ye.categories)).catch(s=>{throw ce.delete("categories"),s});return ce.set("categories",t),t}async function Tr(e=!1){if(!e&&Te.has("favorites"))return ye.favorites;if(ce.has("favorites"))return ce.get("favorites");const t=v.getFavorites().then(s=>(ye.favorites=s||{favorites:{},listOrder:[]},Te.add("favorites"),ce.delete("favorites"),Mt("favorites"),ye.favorites)).catch(s=>{throw ce.delete("favorites"),s});return ce.set("favorites",t),t}function Mr(){se.on(ie.MANGA_UPDATED,()=>{wt("bookmarks"),$t(!0)}),se.on(ie.MANGA_ADDED,()=>{wt("bookmarks"),$t(!0)}),se.on(ie.MANGA_DELETED,()=>{wt("bookmarks"),$t(!0)}),se.on(ie.DOWNLOAD_COMPLETED,()=>{wt("bookmarks"),$t(!0)})}Mr();const $e={get:Er,set:Sr,subscribe:Cr,invalidate:wt,isLoaded:xr,loadBookmarks:$t,loadSeries:Lr,loadCategories:Ir,loadFavorites:Tr};function h(e,t="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${t}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}const Ar={library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',"book-open":'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',"book-marked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',"layout-grid":'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',"circle-plus":'<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',check:'<path d="M20 6 9 17l-5-5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',"trash-2":'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',"undo-2":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',scissors:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',play:'<polygon points="6 3 20 12 6 21 6 3"/>',pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',"hard-drive":'<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',package:'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"eye-off":'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',circle:'<circle cx="12" cy="12" r="10"/>',lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',"lock-open":'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',"triangle-alert":'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',"shield-alert":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',"circle-help":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',"traffic-cone":'<path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"/><path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"/><path d="M13.9 3.5a1.93 1.93 0 0 0-3.8 0L6.1 19.5a1.93 1.93 0 0 0 1.9 2.5h8a1.93 1.93 0 0 0 1.9-2.5z"/><path d="M2 21h20"/>',sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',"alarm-clock":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',loader:'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',"search-x":'<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',"list-checks":'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',"log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',sliders:'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',"chevron-up":'<path d="m18 15-6-6-6 6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"chevron-left":'<path d="m15 18-6-6 6-6"/>',"chevron-right":'<path d="m9 18 6-6-6-6"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',images:'<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>',"columns-2":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',"rectangle-vertical":'<rect width="12" height="20" x="6" y="2" rx="2"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',"arrow-left-right":'<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',"refresh-cw":'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>',"rotate-cw":'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"message-circle":'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'};function g(e,t={}){const s=Ar[e];if(!s)return console.warn("[icons] unknown icon:",e),"";const{size:a,cls:n="",title:r,spin:i=!1}=t,c=["icon",i?"icon-spin":"",n].filter(Boolean).join(" "),l=a?` width="${a}" height="${a}"`:"",d=r?` role="img" aria-label="${String(r).replace(/"/g,"&quot;")}"`:' aria-hidden="true"';return`<svg class="${c}"${l} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${d}>${s}</svg>`}function be(e="book"){return`<div class="placeholder" data-icon="${e}"></div>`}function Me(e,t,s={}){const{kind:a="book",self:n=!1,attrs:r=""}=s,i=String(t??"").replace(/"/g,"&quot;"),c=`<div class=&quot;placeholder&quot; data-icon=&quot;${a}&quot;></div>`,l=n?"this.outerHTML":"this.parentElement.innerHTML";return`<img src="${e}" alt="${i}" loading="lazy"${r?" "+r:""} onerror="${l}='${c}'">`}const da=`${g("folder")} Scan Folder`,ua=`${g("loader",{spin:!0})} Scanning...`;async function Br(e,t,s){try{e&&(e.disabled=!0,e.innerHTML=ua),t&&(t.innerHTML=ua),h("Scanning downloads folder...","info");const n=(await v.scanLibrary()).found||[];if(n.length===0){h("Scan complete: No new manga found","info"),s&&s();return}_r(n,s)}catch(a){h("Scan failed: "+a.message,"error")}finally{e&&(e.disabled=!1,e.innerHTML=da),t&&(t.innerHTML=da)}}async function _r(e,t){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),r=Array.from(n).map(l=>l.dataset.folder);if(r.length===0){h("No folders selected","warning");return}const i=document.getElementById("import-all-btn");i.disabled=!0,i.textContent="Importing...";let c=0;for(const l of r)try{await v.importLocalManga(l),c++}catch(d){console.error("Failed to import",l,d)}s.remove(),h(`Imported ${c} manga`,"success"),t&&t()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function qr(e={}){const{size:t,stroke:s="currentColor",accent:a="var(--accent-primary, #E03A2F)",strokeWidth:n=2,cls:r=""}=e,i=t?` width="${t}" height="${t}"`:"";return`<svg class="${`logo-mark ${r}`.trim()}"${i} viewBox="0 0 24 24" fill="none" stroke="${s}" stroke-width="${n}" stroke-linejoin="round" aria-hidden="true"><polygon points="3,3 10.5,3 8.5,21 3,21"/><polygon points="13,3 21,3 21,10.5 12.17,10.5" fill="${a}" stroke="${a}"/><polygon points="11.89,13 21,13 21,21 11,21"/></svg>`}function pa(){return`${qr()}<span class="logo-text">Manga<span>Reader</span></span>`}const Z={user:null,get isAdmin(){var e;return((e=this.user)==null?void 0:e.role)==="admin"},get isDemo(){var e;return((e=this.user)==null?void 0:e.role)==="demo"},get canDownload(){var e;return this.isAdmin||!this.isDemo&&!!((e=this.user)!=null&&e.canDownload)},get canEdit(){var e;return this.isAdmin||!this.isDemo&&!!((e=this.user)!=null&&e.canEdit)}};function ql(e){Z.user=e||null}function ve(e="manga"){if(Z.isDemo)return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${pa()}</a>
        <div class="header-actions">
          <div class="view-toggle">
            <button class="view-toggle-btn ${e==="manga"?"active":""}" data-view="manga" title="Manga view">${g("library",{title:"Manga view"})}</button>
            <button class="view-toggle-btn ${e==="series"?"active":""}" data-view="series" title="Series view">${g("book-open",{title:"Series view"})}</button>
          </div>
          <span class="demo-badge">Demo</span>
          <a href="/login.html" class="btn btn-secondary" id="demo-exit-btn" title="Exit the demo">${g("log-out",{title:"Exit the demo"})} Exit</a>
        </div>
      </div>
    </header>
  `;const t=Z.isAdmin?`<a href="#/admin" class="btn btn-secondary" title="Admin">${g("wrench",{title:"Admin"})}</a>`:"",s=Z.isAdmin?`<a href="#/admin" class="mobile-menu-item">${g("wrench")} Admin</a>`:"",a=Z.canDownload?`<button class="btn btn-secondary" id="scan-btn">${g("folder")} Scan Folder</button>`:"",n=Z.canDownload?`<button class="mobile-menu-item" id="mobile-scan-btn">${g("folder")} Scan Folder</button>`:"",r=Z.canEdit?e==="series"?`<button class="btn btn-primary" id="add-series-btn">${g("plus")} Add Series</button>`:`<button class="btn btn-primary" id="add-manga-btn">${g("plus")} Add Manga</button>`:"",i=Z.canEdit?e==="series"?`<button class="mobile-menu-item primary" id="mobile-add-series-btn">${g("plus")} Add Series</button>`:`<button class="mobile-menu-item primary" id="mobile-add-btn">${g("plus")} Add Manga</button>`:"";return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${pa()}</a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${e==="manga"?"active":""}" data-view="manga" title="Manga view">${g("library",{title:"Manga view"})}</button>
            <button class="view-toggle-btn ${e==="series"?"active":""}" data-view="series" title="Series view">${g("book-open",{title:"Series view"})}</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">${g("star")} Favorites</button>
          <a href="#/queue" class="btn btn-secondary" id="queue-nav-btn" title="Task Queue">${g("list-checks")} Queue</a>
          ${a}
          ${r}
          <button class="btn btn-secondary" id="logout-btn" title="Log out">${g("log-out",{title:"Log out"})}</button>
          <a href="#/scrapers" class="btn btn-secondary" title="Search Scrapers">${g("search",{title:"Search Scrapers"})}</a>
          ${t}
          <a href="#/settings" class="btn btn-secondary" title="Settings">${g("settings",{title:"Settings"})}</a>
        </div>
        <button class="hamburger-btn mobile-only" id="hamburger-btn">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu hidden" id="mobile-menu">
        <div class="mobile-view-toggle">
          <button class="view-toggle-btn ${e==="manga"?"active":""}" data-view="manga">${g("library")} Manga</button>
          <button class="view-toggle-btn ${e==="series"?"active":""}" data-view="series">${g("book-open")} Series</button>
        </div>
        <button class="mobile-menu-item" id="mobile-favorites-btn">${g("star")} Favorites</button>
        <a href="#/queue" class="mobile-menu-item">${g("list-checks")} Task Queue</a>
        ${n}
        ${i}
        <button class="mobile-menu-item" id="mobile-logout-btn">${g("log-out")} Logout</button>
        <a href="#/scrapers" class="mobile-menu-item">${g("search")} Scrapers</a>
        ${s}
        <a href="#/settings" class="mobile-menu-item">${g("settings")} Settings</a>
      </div>
    </header>
  `}function Ue(){const e=document.querySelector("header");if(e&&e.dataset.listenersBound)return;e&&(e.dataset.listenersBound="true");const t=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");t&&s&&t.addEventListener("click",()=>{s.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),r=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",r),n&&n.addEventListener("click",r);const i=document.getElementById("demo-exit-btn");i&&i.addEventListener("click",w=>{w.preventDefault(),localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"}),document.querySelectorAll("[data-view]").forEach(w=>{w.addEventListener("click",()=>{const L=w.dataset.view;localStorage.setItem("library_view_mode",L),document.querySelectorAll("[data-view]").forEach(T=>{T.classList.toggle("active",T.dataset.view===L)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:L}}))})});const c=document.querySelector(".logo");c&&c.addEventListener("click",w=>{localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),$e.loadBookmarks(!0).catch(()=>{}),window.dispatchEvent(new CustomEvent("clearFilters"))});const l=document.getElementById("favorites-btn"),d=document.getElementById("mobile-favorites-btn"),u=w=>{w.preventDefault(),H.go("/favorites")};l&&l.addEventListener("click",u),d&&d.addEventListener("click",u);const p=document.getElementById("queue-nav-btn");p&&p.addEventListener("click",w=>{w.preventDefault(),H.go("/queue")});const m=document.getElementById("add-manga-btn"),y=document.getElementById("mobile-add-btn"),f=()=>{document.getElementById("add-modal")||(sessionStorage.setItem("open_add_modal","1"),H.go("/"))};m&&m.addEventListener("click",f),y&&y.addEventListener("click",f);const b=document.getElementById("scan-btn"),C=document.getElementById("mobile-scan-btn");if(b||C){const w=()=>{Br(b,C,async()=>{await $e.loadBookmarks(!0),H.reload()})};b&&b.addEventListener("click",w),C&&C.addEventListener("click",w)}}const Ua="app-dialog-modal";function Fe(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ws(){var e;(e=document.getElementById(Ua))==null||e.remove()}function Ha({title:e,message:t,body:s="",confirmText:a="OK",cancelText:n="Cancel",danger:r=!1}){Ws();const i=document.createElement("div");return i.id=Ua,i.className="modal open app-dialog",i.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content app-dialog-content" role="dialog" aria-modal="true" ${e?`aria-label="${Fe(e)}"`:""}>
            ${e?`<div class="modal-header"><h2>${Fe(e)}</h2></div>`:""}
            <div class="app-dialog-body">
                ${t?`<p class="app-dialog-message">${Fe(t)}</p>`:""}
                ${s}
            </div>
            <div class="app-dialog-footer">
                <button type="button" class="btn btn-secondary" data-act="cancel">${Fe(n)}</button>
                <button type="button" class="btn ${r?"btn-danger":"btn-primary"}" data-act="ok">${Fe(a)}</button>
            </div>
        </div>
    `,document.body.appendChild(i),i}function ne(e,t={}){const{option:s=null,...a}=t,n=s?`<label class="app-dialog-option"><input type="checkbox" id="app-dialog-option"> ${Fe(s)}</label>`:"";return new Promise(r=>{const i=Ha({message:e,body:n,confirmText:a.confirmText||(a.danger?"Delete":"OK"),...a}),c=d=>{var p;const u=s?!!((p=i.querySelector("#app-dialog-option"))!=null&&p.checked):void 0;document.removeEventListener("keydown",l,!0),Ws(),r(s?{ok:d,option:u}:d)},l=d=>{var u;d.key==="Escape"?(d.stopImmediatePropagation(),d.preventDefault(),c(!1)):d.key==="Enter"&&((u=document.activeElement)==null?void 0:u.tagName)!=="BUTTON"&&(d.stopImmediatePropagation(),d.preventDefault(),c(!0))};document.addEventListener("keydown",l,!0),i.querySelector(".modal-overlay").addEventListener("click",()=>c(!1)),i.querySelector('[data-act="cancel"]').addEventListener("click",()=>c(!1)),i.querySelector('[data-act="ok"]').addEventListener("click",()=>c(!0)),i.querySelector('[data-act="ok"]').focus()})}function Va(e,t={}){const{value:s="",placeholder:a="",type:n="text",...r}=t,i=`<input class="app-dialog-input" id="app-dialog-input" type="${Fe(n)}" value="${Fe(s)}" placeholder="${Fe(a)}" autocomplete="off">`;return new Promise(c=>{const l=Ha({message:e,body:i,confirmText:r.confirmText||"OK",...r}),d=l.querySelector("#app-dialog-input"),u=m=>{const y=d.value;document.removeEventListener("keydown",p,!0),Ws(),c(m?y:null)},p=m=>{m.key==="Escape"?(m.stopImmediatePropagation(),m.preventDefault(),u(!1)):m.key==="Enter"&&(m.stopImmediatePropagation(),m.preventDefault(),u(!0))};document.addEventListener("keydown",p,!0),l.querySelector(".modal-overlay").addEventListener("click",()=>u(!1)),l.querySelector('[data-act="cancel"]').addEventListener("click",()=>u(!1)),l.querySelector('[data-act="ok"]').addEventListener("click",()=>u(!0)),d.focus(),d.select()})}const Wt={series:"any",downloads:"any",reading:"any",source:"any",monitor:"any"};function Pr(){try{const e=JSON.parse(localStorage.getItem("library_filters")||"{}");return{...Wt,...e&&typeof e=="object"?e:{}}}catch{return{...Wt}}}let B={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",searchAuthor:localStorage.getItem("library_search_author")||null,searchAuthorSource:localStorage.getItem("library_search_author_source")||null,sortBy:localStorage.getItem("library_sort")||"updated",filters:Pr(),viewMode:"manga",loading:!0},Gt=[],Ke=null;function Rr(){localStorage.setItem("library_filters",JSON.stringify(B.filters))}function Dr(e){var i,c,l;const t=new Set(e.excludedChapters||[]),s=new Set((e.chapters||[]).filter(d=>!t.has(d.number)).map(d=>d.number)).size||e.uniqueChapters||0,a=e.downloadedCount??((i=e.downloadedChapters)==null?void 0:i.length)??0,n=e.readCount??((c=e.readChapters)==null?void 0:c.length)??0,r=(e.updatedCount??((l=e.updatedChapters)==null?void 0:l.length)??0)>0;return{total:s,downloaded:a,read:n,updates:r}}const Nr=[{key:"series",label:"Series",options:[{value:"none",label:"Not in a series",test:e=>!e.series},{value:"in",label:"In a series",test:e=>!!e.series}]},{key:"downloads",label:"Downloads",options:[{value:"none",label:"Nothing downloaded",test:(e,t)=>t.downloaded===0},{value:"partial",label:"Partly downloaded",test:(e,t)=>t.downloaded>0&&t.downloaded<t.total},{value:"complete",label:"Fully downloaded",test:(e,t)=>t.total>0&&t.downloaded>=t.total}]},{key:"reading",label:"Reading",options:[{value:"unread",label:"Not started",test:(e,t)=>t.read===0},{value:"progress",label:"In progress",test:(e,t)=>t.read>0&&t.read<t.total},{value:"finished",label:"Finished",test:(e,t)=>t.total>0&&t.read>=t.total},{value:"updates",label:"New chapters",test:(e,t)=>t.updates}]},{key:"source",label:"Source",options:[]},{key:"monitor",label:"Auto-check",options:[{value:"on",label:"On",test:e=>!!e.autoCheck},{value:"off",label:"Off",test:e=>!e.autoCheck}]}];function Fr(){const t=[...new Set(B.bookmarks.filter(s=>s.source!=="local"&&s.website).map(s=>s.website))].sort().map(s=>({value:`site:${s}`,label:s,test:a=>a.source!=="local"&&a.website===s}));return B.bookmarks.some(s=>s.source==="local")&&t.unshift({value:"local",label:"Local files",test:s=>s.source==="local"}),t}function ja(){return Nr.map(e=>e.key==="source"?{...e,options:Fr()}:e)}function za(){return Object.values(B.filters).filter(e=>e&&e!=="any").length}function Or(e){const s=ja().map(a=>({g:a,option:a.options.find(n=>n.value===B.filters[a.key])})).filter(a=>a.option);return s.length===0?e:e.filter(a=>{const n=Dr(a);return s.every(({option:r})=>r.test(a,n))})}function Kt(e){return String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}function Ur(e){return[...e].sort((t,s)=>{var a,n;switch(B.sortBy){case"az":return(t.alias||t.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(t.alias||t.title);case"lastread":return(s.lastReadAt||"").localeCompare(t.lastReadAt||"");case"chapters":{const r=((a=t.chapters)==null?void 0:a.length)||t.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-r}case"updated":default:return(s.updatedAt||"").localeCompare(t.updatedAt||"")}})}function os(){let e=B.bookmarks;const t=(Array.isArray(B.categories)?B.categories:[]).filter(s=>typeof s=="object"?s.isNsfw:!1).map(s=>s.name);if(B.activeCategory==="__nsfw__"?e=e.filter(s=>(s.categories||[]).some(a=>t.includes(a))):B.activeCategory?e=e.filter(s=>(s.categories||[]).includes(B.activeCategory)):t.length>0&&(e=e.filter(s=>!(s.categories||[]).some(a=>t.includes(a)))),B.artistFilter&&(e=e.filter(s=>(s.artists||[]).includes(B.artistFilter))),B.searchQuery){const s=B.searchQuery.toLowerCase();e=e.filter(a=>(a.title||"").toLowerCase().includes(s)||(a.alias||"").toLowerCase().includes(s)||(a.artists||[]).some(n=>n.toLowerCase().includes(s)))}return e=Or(e),Ur(e)}function Hr(e){const t=za(),s=ja().filter(a=>a.options.length>0);return`
    <div class="library-filter" id="library-filter">
      <button type="button" class="library-filter-btn ${t?"has-filter":""}" id="library-filter-btn" aria-haspopup="true" aria-expanded="false">
        ${g("sliders")} Filter${t?` · ${t}`:""}
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
              <button type="button" class="filter-chip ${B.filters[a.key]==="any"||!B.filters[a.key]?"active":""}" data-group="${a.key}" data-value="any">Any</button>
              ${a.options.map(n=>`<button type="button" class="filter-chip ${B.filters[a.key]===n.value?"active":""}" data-group="${a.key}" data-value="${Kt(n.value)}">${Kt(n.label)}</button>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    <span class="library-count" id="library-count" title="Shown / in library">${e} / ${B.bookmarks.length}</span>
  `}function ha(){const e=document.getElementById("library-grid");if(!e)return;const t=os();e.innerHTML=t.map(is).join("")||ls();const s=document.getElementById("library-count");s&&(s.textContent=`${t.length} / ${B.bookmarks.length}`);const a=za(),n=document.getElementById("library-filter-btn");n&&(n.classList.toggle("has-filter",a>0),n.innerHTML=`${g("sliders")} Filter${a?` · ${a}`:""}`);const r=document.getElementById("library-filter-reset");r&&(r.hidden=a===0),document.querySelectorAll("#library-filter-menu .filter-chip").forEach(i=>{const c=B.filters[i.dataset.group]||"any";i.classList.toggle("active",i.dataset.value===c)})}function is(e){var u,p,m;const t=e.alias||e.title,s=e.downloadedCount??((u=e.downloadedChapters)==null?void 0:u.length)??0,a=new Set(e.excludedChapters||[]),n=(e.chapters||[]).filter(y=>!a.has(y.number)),r=new Set(n.map(y=>y.number)).size||e.uniqueChapters||0,i=e.readCount??((p=e.readChapters)==null?void 0:p.length)??0,c=(e.updatedCount??((m=e.updatedChapters)==null?void 0:m.length)??0)>0,l=e.localCover?`/api/public/covers/${e.id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover,d=e.source==="local";return`
    <div class="manga-card" data-id="${e.id}">
      <div class="manga-card-cover">
        ${l?Me(l,t,{kind:d?"local":"book"}):be(d?"local":"book")}
        <div class="manga-card-badges">
          ${i>0?`<span class="badge badge-read" title="Read">${i}</span>`:""}
          <span class="badge badge-chapters" title="Total">${r}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${c?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${e.autoCheck?`<span class="badge badge-monitored" title="Auto-check enabled">${g("alarm-clock",{title:"Auto-check enabled"})}</span>`:""}
          ${B.activeCategory==="Favorites"?`<span class="badge badge-play" title="Click to Read">${g("play",{title:"Click to Read"})}</span>`:""}
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function ls(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function Vr(e){var n;const t=e.alias||e.title,s=((n=e.entries)==null?void 0:n.length)||e.entry_count||0;let a=null;return e.localCover&&e.coverBookmarkId?a=`/api/public/covers/${e.coverBookmarkId}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover&&(a=e.cover),`
    <div class="manga-card series-card" data-series-id="${e.id}">
      <div class="manga-card-cover">
        ${a?Me(a,t,{kind:"series"}):be("series")}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${s} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function Yt(){const e=localStorage.getItem("library_view_mode");if(e&&e!==B.viewMode&&(B.viewMode=e),B.activeCategory==="Favorites")return H.go("/favorites"),"";let t="";if(B.viewMode==="series"){const s=B.series.map(Vr).join("");t=`
      <div class="library-grid" id="library-grid">
        ${B.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const s=os(),n=B.searchAuthor&&B.searchQuery===B.searchAuthor?`
      <div class="manga-card search-sources-card" id="search-sources-card" title="Search online sources for ${Kt(B.searchAuthor)}"
           style="display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed var(--border-color, #3a3a4a);background:transparent;min-height:220px;text-align:center;">
        <div style="padding:1rem;color:var(--text-muted, #9aa);">
          <div style="font-size:2.5rem;line-height:1;margin-bottom:.5rem;">＋</div>
          <div style="font-size:.85rem;">Search sources for<br><strong style="color:var(--text-color, #fff);">${Kt(B.searchAuthor)}</strong></div>
        </div>
      </div>`:"",r=s.map(is).join("")+n;t=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">${g("search")}</span>
          <input type="text" id="library-search" placeholder="Search manga or author..." value="${B.searchQuery}" autocomplete="off">
          ${B.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${B.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${B.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${B.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${B.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${B.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
        ${Hr(s.length)}
      </div>
      ${B.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">${g("palette")}</span>
          <span class="artist-filter-name">${B.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${B.loading?'<div class="loading-spinner"></div>':r||ls()}
      </div>
    `}return`
    ${ve(B.viewMode)}
    <div class="container">
      ${t}
    </div>
    ${jr()}
    ${Qr()}
    ${Wr()}
  `}function jr(){const{activeCategory:e}=B,s=(Array.isArray(B.categories)?B.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=s.some(n=>n.isNsfw);return`
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${e?"has-filter":""}" id="category-fab-btn">
        ${e==="__nsfw__"?g("shield-alert",{title:"18+"}):e||g("tag",{title:"Filter by category"})}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn" title="Manage categories">${g("settings",{title:"Manage categories"})}</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${e?"":"active"}" data-category="">All</button>
          ${a?`<button class="category-menu-item ${e==="__nsfw__"?"active":""}" data-category="__nsfw__" style="color: var(--error);">${g("shield-alert")} All 18+</button>`:""}
          ${s.map(n=>`
            <button class="category-menu-item ${e===n.name?"active":""}" data-category="${n.name}">
              ${n.name}${n.isNsfw?' <span style="color:var(--error);font-size:0.75em;">18+</span>':""}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    ${zr()}
      `}function zr(){const t=(Array.isArray(B.categories)?B.categories:[]).map(s=>typeof s=="object"?s:{name:s,isNsfw:!1});return`
    <div class="modal" id="manage-categories-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 450px;">
        <div class="modal-header">
          <h2>${g("settings")} Manage Categories</h2>
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
                  <button class="btn-icon small danger delete-category-btn" data-category="${s.name}" title="Delete">${g("trash-2",{title:"Delete"})}</button>
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
  `}function Qr(){return`
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
      `}function Wr(){return`
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
      `}function Ss(){B.activeCategory=null,B.artistFilter=null,B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,B.filters={...Wt},localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),localStorage.removeItem("library_filters"),Ee()}function Gr(){const e=document.getElementById("library-filter-btn"),t=document.getElementById("library-filter-menu");!e||!t||(e.addEventListener("click",s=>{s.stopPropagation();const a=t.classList.toggle("hidden")===!1;e.setAttribute("aria-expanded",String(a))}),t.addEventListener("click",s=>{s.stopPropagation();const a=s.target.closest(".filter-chip");if(a){B.filters[a.dataset.group]=a.dataset.value,Rr(),ha();return}s.target.closest("#library-filter-reset")&&(B.filters={...Wt},localStorage.removeItem("library_filters"),ha())}),Ke&&document.removeEventListener("click",Ke),Ke=s=>{!t.classList.contains("hidden")&&!s.target.closest("#library-filter")&&(t.classList.add("hidden"),e.setAttribute("aria-expanded","false"))},document.addEventListener("click",Ke))}async function Cs(e){const t=e.target.closest(".manga-card");if(t){if(t.classList.contains("gallery-card")){const n=t.dataset.gallery;H.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=t.dataset.id,a=t.dataset.seriesId;if(a){H.go(`/series/${a}`);return}if(s){if(B.activeCategory==="Favorites"){const n=B.bookmarks.find(r=>r.id===s);if(n){let r=n.last_read_chapter;if(!r&&n.chapters&&n.chapters.length>0&&(r=[...n.chapters].sort((c,l)=>c.number-l.number)[0].number),r){H.go(`/read/${s}/${r}`);return}else h("No chapters available to read","warning")}}H.go(`/manga/${s}`)}}}function Qa(){var F,V,X,z,te;const e=document.getElementById("app");e.removeEventListener("click",Cs),e.addEventListener("click",Cs),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",O=>{B.viewMode=O.detail.mode;const S=document.getElementById("app");S.innerHTML=Yt(),Qa(),Ue()}));const t=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");t&&s&&(t.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",O=>{const S=O.target.closest(".category-menu-item");if(S){const A=S.dataset.category||null;Kr(A),s.classList.add("hidden")}})),(F=document.getElementById("manage-categories-btn"))==null||F.addEventListener("click",O=>{O.stopPropagation();const S=document.getElementById("manage-categories-modal");S&&S.classList.add("open")}),(V=document.getElementById("close-manage-categories-btn"))==null||V.addEventListener("click",()=>{var O;(O=document.getElementById("manage-categories-modal"))==null||O.classList.remove("open")}),(X=document.querySelector("#manage-categories-modal .modal-overlay"))==null||X.addEventListener("click",()=>{var O;(O=document.getElementById("manage-categories-modal"))==null||O.classList.remove("open")}),(z=document.querySelector("#manage-categories-modal .modal-close"))==null||z.addEventListener("click",()=>{var O;(O=document.getElementById("manage-categories-modal"))==null||O.classList.remove("open")}),(te=document.getElementById("add-category-btn"))==null||te.addEventListener("click",async()=>{var A;const O=document.getElementById("new-category-input"),S=(A=O==null?void 0:O.value)==null?void 0:A.trim();if(S)try{await v.post("/categories",{name:S}),O.value="",h("Category added","success"),await nt(!0),Ee()}catch(R){h("Failed: "+R.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(O=>{O.addEventListener("change",async S=>{const A=O.dataset.category;try{await v.put(`/categories/${encodeURIComponent(A)}/nsfw`,{isNsfw:O.checked}),h(`${A} ${O.checked?"marked as 18+":"unmarked"}`,"success"),await nt(!0),Ee()}catch(R){h("Failed: "+R.message,"error"),O.checked=!O.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(O=>{O.addEventListener("click",async()=>{const S=O.dataset.category;if(await ne(`Delete category "${S}"?`,{danger:!0}))try{await v.delete(`/categories/${encodeURIComponent(S)}`),h("Category deleted","success"),B.activeCategory===S&&(B.activeCategory=null,localStorage.removeItem("library_active_category")),await nt(!0),Ee()}catch(A){h("Failed: "+A.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{B.artistFilter=null,localStorage.removeItem("library_artist_filter"),Ee()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",O=>{var A;B.searchQuery=O.target.value,localStorage.setItem("library_search",O.target.value),B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source");const S=document.getElementById("library-grid");if(S){const R=os();S.innerHTML=R.map(is).join("")||ls();const D=document.getElementById("search-clear");!D&&B.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(A=document.getElementById("search-clear"))==null||A.addEventListener("click",()=>{B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),n.value="",Ee()})):D&&!B.searchQuery&&D.remove()}}),B.searchQuery&&n.focus());const r=document.getElementById("search-clear");r&&r.addEventListener("click",()=>{B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),Ee()});const i=document.getElementById("search-sources-card");i&&i.addEventListener("click",()=>{const O=B.searchAuthor||B.searchQuery,S=B.searchAuthorSource||"nhentai.net";O&&(window.location.hash=`#/scrapers?browse=${encodeURIComponent(S)}&q=${encodeURIComponent(O)}`)});const c=document.getElementById("library-sort");c&&c.addEventListener("change",O=>{B.sortBy=O.target.value,localStorage.setItem("library_sort",B.sortBy),Ee()}),Gr(),window.removeEventListener("clearFilters",Ss),window.addEventListener("clearFilters",Ss);const l=document.getElementById("add-manga-btn"),d=document.getElementById("mobile-add-btn"),u=document.getElementById("add-modal"),p=document.getElementById("add-modal-close"),m=document.getElementById("add-modal-cancel"),y=document.getElementById("add-modal-submit"),f=document.getElementById("mobile-menu"),b=()=>{f&&f.classList.add("hidden"),u&&u.classList.add("open")};l&&l.addEventListener("click",b),d&&d.addEventListener("click",b),p&&p.addEventListener("click",()=>u.classList.remove("open")),m&&m.addEventListener("click",()=>u.classList.remove("open")),y&&y.addEventListener("click",async()=>{const O=document.getElementById("manga-url"),S=O.value.trim();if(!S){h("Please enter a URL","error");return}try{y.disabled=!0,y.textContent="Adding...",await v.addBookmark(S),h("Manga added successfully!","success"),u.classList.remove("open"),O.value="",await nt(),Ee()}catch(A){h("Failed to add manga: "+A.message,"error")}finally{y.disabled=!1,y.textContent="Add"}});const C=document.getElementById("add-series-btn"),w=document.getElementById("mobile-add-series-btn"),L=document.getElementById("add-series-modal"),T=document.getElementById("add-series-modal-close"),k=document.getElementById("add-series-modal-cancel"),I=document.getElementById("add-series-modal-submit"),N=document.getElementById("mobile-menu");if((C||w)&&L){const O=()=>{N&&N.classList.add("hidden"),L.classList.add("open")};C&&C.addEventListener("click",O),w&&w.addEventListener("click",O)}T&&T.addEventListener("click",()=>L.classList.remove("open")),k&&k.addEventListener("click",()=>L.classList.remove("open")),I&&I.addEventListener("click",async()=>{const O=document.getElementById("series-title"),S=document.getElementById("series-alias"),A=O.value.trim(),R=S.value.trim();if(!A){h("Please enter a title","error");return}try{I.disabled=!0,I.textContent="Creating...",await v.createSeries(A,R),h("Series created successfully!","success"),L.classList.remove("open"),O.value="",S.value="",await nt(!0),Ee()}catch(D){h("Failed to create series: "+D.message,"error")}finally{I.disabled=!1,I.textContent="Create"}});const E=L==null?void 0:L.querySelector(".modal-overlay");E&&E.addEventListener("click",()=>L.classList.remove("open"));const $=document.getElementById("empty-add-btn");$&&u&&$.addEventListener("click",()=>u.classList.add("open"));const M=document.getElementById("empty-add-series-btn");M&&L&&M.addEventListener("click",()=>L.classList.add("open"));const _=u==null?void 0:u.querySelector(".modal-overlay");_&&_.addEventListener("click",()=>u.classList.remove("open")),Ue()}function Kr(e){B.activeCategory=e,e?localStorage.setItem("library_active_category",e):localStorage.removeItem("library_active_category"),Ee()}async function nt(e=!1){try{if(Z.isDemo){const[r,i]=await Promise.all([$e.loadBookmarks(e),$e.loadSeries(e)]);B.bookmarks=r,B.categories=[],B.series=i,B.favorites={favorites:{},listOrder:[]},B.loading=!1;return}const[t,s,a,n]=await Promise.all([$e.loadBookmarks(e),$e.loadCategories(e),$e.loadSeries(e),$e.loadFavorites(e)]);B.bookmarks=t,B.categories=s,B.series=a,B.favorites=n,B.loading=!1}catch{h("Failed to load library","error"),B.loading=!1}}async function Ee(){var t;const e=document.getElementById("app");if(Z.isDemo)B.activeCategory=null,B.artistFilter=null,B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null;else{const s=localStorage.getItem("library_active_category");B.activeCategory!==s&&(B.activeCategory=s);const a=localStorage.getItem("library_artist_filter")||null;B.artistFilter!==a&&(B.artistFilter=a);const n=localStorage.getItem("library_search")||"";B.searchQuery!==n&&(B.searchQuery=n),B.searchAuthor=localStorage.getItem("library_search_author")||null,B.searchAuthorSource=localStorage.getItem("library_search_author_source")||null}B.loading&&(e.innerHTML=Yt()),B.bookmarks.length===0&&B.loading&&await nt(),e.innerHTML=Yt(),Qa(),sessionStorage.getItem("open_add_modal")&&(sessionStorage.removeItem("open_add_modal"),(t=document.getElementById("add-modal"))==null||t.classList.add("open")),Gt.forEach(s=>s()),Gt=[$e.subscribe("bookmarks",s=>{B.bookmarks=s;const a=document.getElementById("library-grid");if(a){const n=os();a.innerHTML=n.map(is).join("")||ls()}})]}function Yr(){const e=document.getElementById("app");e&&e.removeEventListener("click",Cs),window.removeEventListener("clearFilters",Ss),Ke&&(document.removeEventListener("click",Ke),Ke=null),Gt.forEach(t=>t()),Gt=[]}const Jr={mount:Ee,unmount:Yr,render:Yt},Xr="manga-offline",Zr=1,Ze="images",he="chapters";let qt=null;function At(){return new Promise((e,t)=>{if(qt)return e(qt);const s=indexedDB.open(Xr,Zr);s.onupgradeneeded=a=>{const n=a.target.result;n.objectStoreNames.contains(Ze)||n.createObjectStore(Ze),n.objectStoreNames.contains(he)||n.createObjectStore(he)},s.onsuccess=()=>{qt=s.result,e(qt)},s.onerror=()=>t(s.error)})}function et(e,t){return At().then(s=>new Promise((a,n)=>{const c=s.transaction(e,"readonly").objectStore(e).get(t);c.onsuccess=()=>a(c.result),c.onerror=()=>n(c.error)}))}function xs(e,t,s){return At().then(a=>new Promise((n,r)=>{const l=a.transaction(e,"readwrite").objectStore(e).put(s,t);l.onsuccess=()=>n(),l.onerror=()=>r(l.error)}))}function Ls(e,t){return At().then(s=>new Promise((a,n)=>{const c=s.transaction(e,"readwrite").objectStore(e).delete(t);c.onsuccess=()=>a(),c.onerror=()=>n(c.error)}))}function Gs(e){return At().then(t=>new Promise((s,a)=>{const i=t.transaction(e,"readonly").objectStore(e).getAllKeys();i.onsuccess=()=>s(i.result),i.onerror=()=>a(i.error)}))}function ct(e,t){return`${e}:${t}`}function Ks(e,t,s){return`${e}:${t}:${s}`}function eo(e){const t=e.split(":");return{mangaId:t[0],chapterNum:parseFloat(t[1])}}async function Ys(e,t,s=null){const a=await v.get(`/bookmarks/${e}/chapters/${t}/reader-images`);if(!a||!a.images||a.images.length===0)throw new Error("No images found for this chapter");const n=a.images,r=n.length;let i=0;const c=v.getToken();for(let d=0;d<n.length;d++){const u=typeof n[d]=="string"?n[d]:n[d].url,p=u.startsWith("http")?u:`${window.location.origin}${u}`;try{const m=await fetch(p,{headers:c?{Authorization:`Bearer ${c}`}:{}});if(!m.ok)throw new Error(`HTTP ${m.status}`);const y=await m.blob();await xs(Ze,Ks(e,t,u),y),i++,s&&s(i,r)}catch(m){console.error(`[Offline] Failed to cache image ${d+1}/${r}:`,m)}}const l={mangaId:e,chapterNum:t,imageUrls:n.map(d=>typeof d=="string"?d:d.url),savedAt:Date.now(),imageCount:i};return await xs(he,ct(e,t),l),{success:!0,imageCount:i}}async function to(e,t){const s=await et(he,ct(e,t));if(!s)return null;const a=[];for(const n of s.imageUrls){const r=await et(Ze,Ks(e,t,n));if(r)a.push(URL.createObjectURL(r));else return a.forEach(i=>URL.revokeObjectURL(i)),null}return a}async function Wa(e,t){const s=await et(he,ct(e,t));if(s&&s.imageUrls)for(const a of s.imageUrls)await Ls(Ze,Ks(e,t,a));await Ls(he,ct(e,t))}async function so(e,t){if(!await et(he,ct(e,t)))return!1;await Wa(e,t);try{return await Ys(e,t),!0}catch(a){return console.warn("[Offline] Could not re-save chapter after edit:",a),!1}}async function ao(e,t){return!!await et(he,ct(e,t))}async function no(){const e=await Gs(he),t=[];for(const s of e){if(s.startsWith("auto-offline-"))continue;const a=await et(he,s);a&&t.push(a)}return t}async function Ga(e){const t=await Gs(he),s=[];for(const a of t)if(!a.startsWith("auto-offline-")&&a.startsWith(`${e}:`)){const{chapterNum:n}=eo(a);s.push(n)}return s}async function ro(){if(navigator.storage&&navigator.storage.estimate){const e=await navigator.storage.estimate();return{used:e.usage||0,quota:e.quota||0,usedMB:((e.usage||0)/(1024*1024)).toFixed(1),quotaMB:((e.quota||0)/(1024*1024)).toFixed(0)}}return{used:0,quota:0,usedMB:"0",quotaMB:"Unknown"}}async function oo(){const e=await At();await new Promise((t,s)=>{const r=e.transaction(Ze,"readwrite").objectStore(Ze).clear();r.onsuccess=t,r.onerror=s}),await new Promise((t,s)=>{const r=e.transaction(he,"readwrite").objectStore(he).clear();r.onsuccess=t,r.onerror=s})}async function io(e,t){t?await xs(he,`auto-offline-${e}`,{enabled:!0,mangaId:e}):await Ls(he,`auto-offline-${e}`)}async function lo(e){const t=await et(he,`auto-offline-${e}`);return!!(t!=null&&t.enabled)}async function co(){return(await Gs(he)).filter(t=>t.startsWith("auto-offline-")).map(t=>t.replace("auto-offline-",""))}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",async e=>{var t;if(((t=e.data)==null?void 0:t.type)==="sync-offline"){const s=e.data.mangaId;console.log(`[Offline] Auto-sync triggered for manga ${s}`);try{await Ka(s)}catch(a){console.error("[Offline] Auto-sync failed:",a)}}});async function Ka(e){try{const t=await v.getBookmark(e);if(!t)return;const s=t.downloadedChapters||[],a=await Ga(e),n=s.filter(r=>!a.includes(r));console.log(`[Offline] ${n.length} new chapters to sync for ${t.alias||t.title}`);for(const r of n)await Ys(e,r),console.log(`[Offline] Auto-synced chapter ${r}`)}catch(t){console.error("[Offline] Sync error:",t)}}const uo={saveChapterOffline:Ys,getOfflineChapter:to,deleteOfflineChapter:Wa,refreshOfflineChapter:so,isChapterOffline:ao,getOfflineChapters:no,getOfflineChaptersForManga:Ga,getStorageUsage:ro,clearAllOfflineData:oo,setAutoOffline:io,isAutoOffline:lo,getAutoOfflineManga:co,syncNewChaptersForManga:Ka},po=e=>String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");let o={manga:null,chapter:null,versionUrl:null,images:[],trophyPages:{},mode:"manga",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!0,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null,isStreamingMode:!1,_streamAbortController:null,isVolumeMode:!1,volume:null};function Js(e,t=o.manga){if(!e||!t)return"";const s=(t.chapters||[]).find(n=>n.url===e),a=[];return s&&(s.releaseGroup?a.push(s.releaseGroup):s.title&&s.title!==`Chapter ${s.number}`&&a.push(s.title)),e.startsWith("local://")&&a.push("Local"),a.join(" · ")}function Xs(e){var s,a;const t=(a=(s=o.manga)==null?void 0:s.downloadedVersions)==null?void 0:a[e];return Array.isArray(t)?t:t?[t]:[]}function ho(){var t;const e=Xs((t=o.chapter)==null?void 0:t.number);return e.length<2||!o.versionUrl?"":Js(o.versionUrl)||`Version ${e.indexOf(o.versionUrl)+1}`}function Ya(){if(!o.manga||!o.chapter||!o.allFavorites||!o.allFavorites.favorites)return!1;if(o.isCollectionMode)return!0;let t=[Ms()];if(o.mode==="manga"&&!o.singlePageMode){const n=ue()[o.currentPage];n&&Array.isArray(n)?t=n:n&&n.pages&&(t=n.pages)}const s=t.map(a=>{const n=It(o.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in o.allFavorites.favorites){const n=o.allFavorites.favorites[a];if(Array.isArray(n)){for(const r of n)if(r.mangaId===o.manga.id&&r.chapterNum===o.chapter.number&&r.imagePaths)for(const i of r.imagePaths){const c=typeof i=="string"?i:(i==null?void 0:i.filename)||(i==null?void 0:i.path);for(const l of s)if(l&&l.filename===c)return!0}}}return!1}function Is(){const e=document.getElementById("favorites-btn");e&&(Ya()?e.classList.add("active"):e.classList.remove("active"))}function Je(){var p,m;if(o.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!o.manga||!o.images.length&&!o.isStreamingMode)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const e=o.manga.alias||o.manga.title,t=(p=o.chapter)==null?void 0:p.number,s=o.isCollectionMode||o.isStreamingMode?"":ho(),a=!o.isCollectionMode&&!o.isStreamingMode&&Xs(t).length>1,r=ue().length,i=o.images.length;let c,l;o.mode==="webtoon"?(c=i-1,l=`${i} pages`):o.singlePageMode?(c=i-1,l=`${o.currentPage+1} / ${i}`):(c=r-1,l=`${o.currentPage+1} / ${r}`);const d=Ya(),u=en();return`
    <div class="reader ${o.mode}-mode ${o.showControls?"":"controls-hidden"}">
      <!-- Unified Top Bar -->
      <div class="reader-bar">
        <button class="reader-bar-btn close-btn" id="reader-close-btn" title="Back">×</button>
        <div class="reader-title">
          <span class="manga-name">${e}</span>
          ${o.isStreamingMode?"":o.isVolumeMode?`<span class="chapter-name" title="Volume release">${po(((m=o.volume)==null?void 0:m.name)||"Volume")}</span>`:`<span class="chapter-name">Ch. ${t}${s?` · <span class="version-label" title="Version being read">${s}</span>`:""}</span>`}
        </div>
        ${o.isCollectionMode?"":`
        <div class="reader-bar-tools" id="reader-toolbar">
          ${o.isStreamingMode?`
          <button class="reader-bar-btn" id="stream-add-lib-btn" title="Add to Library">${g("download",{title:"Add to Library"})}</button>
          <span class="reader-bar-divider"></span>
          `:`
          ${o.isVolumeMode?"":`<button class="reader-bar-btn ${d?"active":""}" id="favorites-btn" title="Add to favorites">${g("star",{title:"Add to favorites"})}</button>`}

          <button class="reader-bar-btn" id="rotate-btn" title="Rotate 90° CW">${g("rotate-cw",{title:"Rotate 90 degrees clockwise"})}</button>
          ${o.mode==="manga"&&!o.singlePageMode?`
            <button class="reader-bar-btn" id="swap-btn" title="Swap pages in spread">${g("arrow-left-right",{title:"Swap pages in spread"})}</button>
          `:""}
          ${o.singlePageMode||o.mode==="webtoon"?`
            <button class="reader-bar-btn" id="split-btn" title="Split wide image into halves">${g("scissors",{title:"Split wide image into halves"})}</button>
          `:""}
          <span class="reader-bar-divider"></span>
          `}
          ${o.mode==="manga"?`
            <button class="reader-bar-btn ${o.singlePageMode?"active":""}" id="single-page-btn" title="${o.singlePageMode?"Switch to double page":"Switch to single page"}">
              ${o.singlePageMode?g("rectangle-vertical"):g("columns-2")}
            </button>
            ${o.isStreamingMode?"":`
            <button class="reader-bar-btn ${u?"active":""}" id="trophy-btn" title="${u?"Unmark trophy":"Mark as trophy"}">${g("trophy")}</button>
            `}
          `:""}
          ${a?`<button class="reader-bar-btn" id="version-btn" title="Switch version / keep only one">${g("list",{title:"Versions"})}</button>`:""}
          <button class="reader-bar-btn" id="fullscreen-btn" title="Toggle fullscreen">${g("maximize",{title:"Toggle fullscreen"})}</button>
          <button class="reader-bar-btn" id="reader-settings-btn" title="Settings">${g("settings",{title:"Settings"})}</button>
        </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${o.mode==="webtoon"?`zoom: ${o.zoom}%`:""}">
        ${o.isCollectionMode?Ja():o.mode==="webtoon"?Xa():Za()}
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
  `}function Ja(){const e=o.mode==="manga";if(e&&!o.singlePageMode){const t=o.images[o.currentPage];if(!t)return"";const s=t.urls||[t.url],a=t.displayMode||"single";return t.displaySide,a==="double"&&s.length>=2?`
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
  `}function Xa(){return`
    <div class="webtoon-pages">
      ${o.images.map((e,t)=>{const s=typeof e=="string"?e:e.url,a=o.trophyPages[t];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${t}">
          ${a?`<div class="trophy-indicator">${g("trophy")}</div>`:""}
          <img src="${s}" alt="Page ${t+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function Za(){if(o.singlePageMode)return mo();const t=ue()[o.currentPage];if(!t)return"";if(t.type==="link"){const s=t.pages[0],a=o.images[s],n=typeof a=="string"?a:a.url,r=o.trophyPages[s];return`
        <div class="manga-spread ${o.direction}">
          <div class="manga-page ${r?"trophy-page":""}">
            ${r?`<div class="trophy-indicator">${g("trophy")}</div>`:""}
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
          ${r?`<div class="trophy-indicator">${g("trophy")}</div>`:""}
          <img src="${n}" alt="Page ${s+1}">
        </div>
      `}).join("")}
    </div>
  `}function mo(){const e=o.currentPage,t=o.trophyPages[e];if(t&&!t.isSingle&&t.pages&&t.pages.length===2){const[r,i]=t.pages,c=o.images[r],l=o.images[i],d=typeof c=="string"?c:c==null?void 0:c.url,u=typeof l=="string"?l:l==null?void 0:l.url;if(d&&u)return`
            <div class="manga-spread ${o.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">${g("trophy")}</div><img src="${d}" alt="Page ${r+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">${g("trophy")}</div><img src="${u}" alt="Page ${i+1}"></div>
            </div>
            `}const s=o.images[e];if(!s)return"";const a=typeof s=="string"?s:s.url,n=o.trophyPages[e];return`
    <div class="manga-spread single ${o.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?`<div class="trophy-indicator">${g("trophy")}</div>`:""}
        <img src="${a}" alt="Page ${e+1}">
      </div>
    </div>
  `}function ue(){const e=[],t=o.images.length;let s=0;if(o.isCollectionMode){for(let n=0;n<t;n++)e.push([n]);return e}let a=!o.firstPageSingle;for(;s<t;){const n=o.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[r,i]=n.pages;e.push([r,i]),s=Math.max(r,i)+1}else e.push([s]),s++;continue}if(!a){a=!0,e.push([s]),s++;continue}if(o.lastPageSingle&&s===t-1){o.nextChapterImage?e.push({type:"link",pages:[s],nextImage:o.nextChapterImage,nextChapter:o.nextChapterNum}):e.push([s]),s++;break}s+1<t?o.trophyPages[s+1]?(e.push([s]),s++):o.lastPageSingle&&s+1===t-1?(e.push([s]),o.nextChapterImage?e.push({type:"link",pages:[s+1],nextImage:o.nextChapterImage,nextChapter:o.nextChapterNum}):e.push([s+1]),s+=2):(e.push([s,s+1]),s+=2):(e.push([s]),s++)}return e}function en(){if(o.singlePageMode)return!!o.trophyPages[o.currentPage];const t=ue()[o.currentPage];return t?(Array.isArray(t)?t:t.pages||[]).some(a=>!!o.trophyPages[a]):!1}function Zs(){if(o.singlePageMode)return[o.currentPage];const t=ue()[o.currentPage];return t?Array.isArray(t)?t:t.pages||[]:[]}async function go(){if(!o.manga||!o.chapter||o.isCollectionMode)return;const e=Zs();if(e.length===0)return;if(e.some(s=>!!o.trophyPages[s])){const s=[...e];if(o.singlePageMode){const a=o.trophyPages[o.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete o.trophyPages[a]),h(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=e,a=o.singlePageMode||e.length===1;if(!o.singlePageMode&&e.length===2){const r=await on(e,"Mark as trophy");if(!r)return;s=r.pages,a=r.pages.length===1}s.forEach(r=>{o.trophyPages[r]={isSingle:a,pages:[...s]}});const n=a?"single":"double";h(`Page${s.length>1?"s":""} marked as trophy (${n})`,"success")}try{await v.saveTrophyPages(o.manga.id,o.chapter.number,o.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}Oe(),tn()}function tn(){const e=document.getElementById("trophy-btn");if(e){const t=en();e.classList.toggle("active",t),e.title=t?"Unmark trophy":"Mark as trophy"}}function sn(){var a;if(!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode||!o.images.length)return null;const e=o.images.length;let t=1,s=!1;if(o.mode==="manga"){const n=Zs();n.length>0&&(t=Math.min(...n)+1),s=n.includes(e-1)}else{const n=document.getElementById("reader-content");if(n){const r=[...n.querySelectorAll("img")],i=n.scrollTop;let c=0;r.forEach((u,p)=>{i>=c&&(t=p+1),c+=u.offsetHeight});const l=n.scrollHeight>n.clientHeight+10,d=r.length>0&&r.every(u=>u.complete&&u.naturalHeight>0);s=l?i+n.clientHeight>=n.scrollHeight-4:d}}return s&&(t=e),{mangaId:o.manga.id,chapterNumber:o.chapter.number,volumeId:o.isVolumeMode?(a=o.volume)==null?void 0:a.id:null,currentPage:t,totalPages:e}}async function tt(e=sn()){var t,s;if(!(!e||Z.isDemo)){if(e.volumeId){try{if(await v.saveVolumeProgress(e.mangaId,e.volumeId,e.currentPage,e.totalPages),e.currentPage>=e.totalPages&&((t=o.manga)==null?void 0:t.id)===e.mangaId&&o.volume){const a=new Set(o.manga.readChapters||[]);for(const n of o.volume.chapters||[])a.add(n);o.manga.readChapters=[...a]}}catch(a){console.error("Failed to save volume progress:",a)}return}try{if(await v.updateReadingProgress(e.mangaId,e.chapterNumber,e.currentPage,e.totalPages),e.currentPage>=e.totalPages&&((s=o.manga)==null?void 0:s.id)===e.mangaId){const a=new Set(o.manga.readChapters||[]);a.add(e.chapterNumber),o.manga.readChapters=[...a]}}catch(a){console.error("Failed to save progress:",a)}}}let Ye=null;function an(){Ye&&clearTimeout(Ye),Ye=setTimeout(()=>{Ye=null,tt()},1500)}function Jt(){var s,a,n,r,i,c,l,d,u,p,m,y,f,b,C,w,L,T,k,I,N;const e=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{o.isStreamingMode||(await tt(),await ze()),o.isStreamingMode?H.go("/scrapers"):o.manga&&o.manga.id!=="gallery"?H.go(`/manga/${o.manga.id}`):H.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{H.go(o.isStreamingMode?"/scrapers":"/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var E;(E=document.getElementById("reader-settings"))==null||E.classList.toggle("hidden")}),(r=document.getElementById("close-settings-btn"))==null||r.addEventListener("click",()=>{var E;(E=document.getElementById("reader-settings"))==null||E.classList.add("hidden")}),(i=document.getElementById("single-page-btn"))==null||i.addEventListener("click",()=>{if(o.singlePageMode){const E=ue();let $=0;for(let M=0;M<E.length;M++)if(E[M].includes(o.currentPage)){$=M;break}o.singlePageMode=!1,o.currentPage=$}else{const $=ue()[o.currentPage];o.singlePageMode=!0,o.currentPage=$?$[0]:0}localStorage.setItem("reader_single_page",o.singlePageMode?"1":"0"),ot()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{go()}),e.querySelectorAll("[data-mode]").forEach(E=>{E.addEventListener("click",()=>{var _,F;const $=E.dataset.mode;let M=Ms();if(o.mode=$,localStorage.setItem("reader_mode",o.mode),$==="webtoon")o.currentPage=M;else if(o.singlePageMode)o.currentPage=M;else{const V=ue();let X=0;for(let z=0;z<V.length;z++)if(V[z].includes(M)){X=z;break}o.currentPage=X}(_=o.manga)!=null&&_.id&&((F=o.chapter)!=null&&F.number)&&ze(),ot(),$==="webtoon"&&setTimeout(()=>{const V=document.getElementById("reader-content");if(V){const X=V.querySelectorAll("img");X[M]&&X[M].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),e.querySelectorAll("[data-direction]").forEach(E=>{E.addEventListener("click",async()=>{var $,M;o.direction=E.dataset.direction,localStorage.setItem("reader_direction",o.direction),($=o.manga)!=null&&$.id&&((M=o.chapter)!=null&&M.number)&&await ze(),ot()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async E=>{o.firstPageSingle=E.target.checked,await ze(),Oe()}),(d=document.getElementById("last-page-single"))==null||d.addEventListener("change",async E=>{var $,M;o.lastPageSingle=E.target.checked,await ze(),o.lastPageSingle&&(($=o.manga)!=null&&$.id)&&((M=o.chapter)!=null&&M.number)?await nn():(o.nextChapterImage=null,o.nextChapterNum=null),Oe()}),(u=document.getElementById("zoom-slider"))==null||u.addEventListener("input",E=>{o.zoom=parseInt(E.target.value);const $=document.getElementById("reader-content");$&&($.style.zoom=`${o.zoom}%`)});const t=document.getElementById("page-slider");if(t&&(t.addEventListener("input",E=>{const $=parseInt(E.target.value),M=document.getElementById("page-indicator");M&&(o.singlePageMode?M.textContent=`${$+1} / ${o.images.length}`:M.textContent=`${$+1} / ${ue().length}`)}),t.addEventListener("change",E=>{o.currentPage=parseInt(E.target.value),Oe()})),o.mode==="manga"){const E=document.getElementById("reader-content");E==null||E.addEventListener("click",$=>{var V;if($.target.closest("button, a, .link-overlay"))return;const M=E.getBoundingClientRect(),F=($.clientX-M.left)/M.width;F<.3?As():F>.7?Ot():(o.showControls=!o.showControls,(V=document.querySelector(".reader"))==null||V.classList.toggle("controls-hidden",!o.showControls))})}document.addEventListener("keydown",ln),(p=document.getElementById("prev-chapter-btn"))==null||p.addEventListener("click",()=>Xt(-1)),(m=document.getElementById("next-chapter-btn"))==null||m.addEventListener("click",()=>Xt(1)),o.mode==="webtoon"&&((y=document.getElementById("reader-content"))==null||y.addEventListener("click",()=>{var E;o.showControls=!o.showControls,(E=document.querySelector(".reader"))==null||E.classList.toggle("controls-hidden",!o.showControls)}),(f=document.getElementById("reader-content"))==null||f.addEventListener("scroll",an,{passive:!0})),(b=document.getElementById("rotate-btn"))==null||b.addEventListener("click",async()=>{const E=fs();if(!(!E||!o.manga||!o.chapter))try{h("Rotating...","info");const $=await Pt().rotate(E);$.images&&(await vs($.images),h("Page rotated","success"))}catch($){h("Rotate failed: "+$.message,"error")}}),(C=document.getElementById("swap-btn"))==null||C.addEventListener("click",async()=>{const $=ue()[o.currentPage];if(!$||$.length!==2||!o.manga||!o.chapter){h("Select a spread with 2 pages to swap","info");return}const M=It(o.images[$[0]]),_=It(o.images[$[1]]);if(!(!M||!_))try{h("Swapping...","info");const F=await Pt().swap(M,_);F.images&&(await vs(F.images),h("Pages swapped","success"))}catch(F){h("Swap failed: "+F.message,"error")}}),(w=document.getElementById("split-btn"))==null||w.addEventListener("click",async()=>{const E=fs();if(!E||!o.manga||!o.chapter||!await ne("Split this page into halves? This is permanent.",{danger:!0}))return;const $=document.getElementById("split-btn");try{h("Preparing to split...","info"),$&&($.disabled=!0),o.images=[],o.loading=!0,e.innerHTML=Je(),await new Promise(_=>setTimeout(_,2e3)),h("Splitting page...","info");const M=await Pt().split(E);$&&($.disabled=!1),await je(o.manga.id,ma(),o.versionUrl),e.innerHTML=Je(),Jt(),Oe(),M.warning?h(M.warning,"warning"):h("Page split into halves","success")}catch(M){$&&($.disabled=!1),h("Split failed: "+M.message,"error"),await je(o.manga.id,ma(),o.versionUrl),e.innerHTML=Je(),Jt()}}),(L=document.getElementById("delete-page-btn"))==null||L.addEventListener("click",async()=>{const E=fs();if(!(!E||!o.manga||!o.chapter)&&await ne(`Delete page "${E}" permanently? This cannot be undone.`,{danger:!0}))try{h("Deleting...","info");const $=await Pt().remove(E);$.images&&(await vs($.images),h("Page deleted","success"))}catch($){h("Delete failed: "+$.message,"error")}}),(T=document.getElementById("favorites-btn"))==null||T.addEventListener("click",async()=>{try{const M=await v.getFavorites();o.allFavorites=M,o.favoriteLists=Object.keys(M.favorites||M||{})}catch(M){console.error("Failed to load favorites",M),h("Failed to load favorites","error");return}let $=[Ms()];if(o.mode==="manga"&&!o.singlePageMode){const _=ue()[o.currentPage];_&&Array.isArray(_)?$=_:_&&_.pages&&($=_.pages)}if($.length>1){const M=await on($,"Select Page for Favorites");if(!M)return;$=M.pages}wo($)}),(k=document.getElementById("version-btn"))==null||k.addEventListener("click",()=>{yo()}),(I=document.getElementById("fullscreen-btn"))==null||I.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{h("Fullscreen not supported","info")})}),(N=document.getElementById("stream-add-lib-btn"))==null||N.addEventListener("click",async()=>{var M;const E=document.getElementById("stream-add-lib-btn");if(!((M=o.manga)!=null&&M._streamUrl)){h("No URL to add","error");return}const $=E.innerHTML;E.innerHTML=g("loader",{spin:!0}),E.disabled=!0;try{const _=await v.addBookmark(o.manga._streamUrl);if(!_.jobId)throw new Error("No job ID returned");h("Adding to library...","info");const F=setInterval(async()=>{var V;try{const z=(await v.getQueueHistory(20)).find(te=>te.id===_.jobId);z&&(z.status==="completed"?(clearInterval(F),(V=z.result)!=null&&V.bookmark&&(h("Added to library!","success"),E.innerHTML=g("check"),E.title="Added! Click to view",E.disabled=!1,E.onclick=()=>{H.go(`/manga/${z.result.bookmark.id}`)})):z.status==="failed"&&(clearInterval(F),h("Failed to add: "+(z.error||"Unknown error"),"error"),E.innerHTML=$,E.disabled=!1))}catch{}},1500)}catch(_){h("Failed to add: "+_.message,"error"),E.innerHTML=$,E.disabled=!1}}),document.body.classList.add("reader-active")}function Ts(e){return-(1e3+(Number(e==null?void 0:e.number)||0))}async function fo(e,t){const s=Ts(t.volume);try{let a=await v.getChapterSettings(e,s);!Zt(a)&&t.prev&&(a=await v.getChapterSettings(e,Ts(t.prev))),Zt(a)&&Bs(a)}catch(a){console.warn("Failed to load volume settings",a)}try{o.trophyPages=await v.getTrophyPages(e,s)||{}}catch{o.trophyPages={}}}function Pt(){const e=o.manga.id;if(o.isVolumeMode){const s=o.volume.id;return{rotate:a=>v.rotateVolumePage(e,s,a,90),swap:(a,n)=>v.swapVolumePages(e,s,a,n),split:a=>v.splitVolumePage(e,s,a),remove:a=>v.deleteVolumePage(e,s,a)}}const t=o.chapter.number;return{rotate:s=>v.rotatePage(e,t,s,90,o.versionUrl),swap:(s,a)=>v.swapPages(e,t,s,a,o.versionUrl),split:s=>v.splitPage(e,t,s,o.versionUrl),remove:s=>v.deletePage(e,t,s,o.versionUrl)}}function ma(){return o.isVolumeMode?`volume:${o.volume.id}`:o.chapter.number}function It(e){var n;const t=typeof e=="string"?e:(e==null?void 0:e.url)||((n=e==null?void 0:e.urls)==null?void 0:n[0]);if(!t)return null;const a=t.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function fs(){const e=Zs();return e.length===0?null:It(o.images[e[0]])}async function vs(e){var s,a;(s=o.manga)!=null&&s.id&&((a=o.chapter)!=null&&a.number)&&!o.isStreamingMode&&!o.isVolumeMode&&uo.refreshOfflineChapter(o.manga.id,o.chapter.number).then(n=>{n&&console.log("[Reader] Refreshed offline copy after page edit")}).catch(n=>console.warn("[Reader] Offline refresh failed:",n));const t=Date.now();if(o.images=e.map(n=>{const r=typeof n=="string"?n:n==null?void 0:n.url;if(!r)return n;const i=r+(r.includes("?")?"&":"?")+`_t=${t}`;return typeof n=="string"?i:{...n,url:i}}),o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.min(o.currentPage,o.images.length-1);else{const n=ue();o.currentPage=Math.min(o.currentPage,n.length-1)}o.currentPage=Math.max(0,o.currentPage),Oe()}async function nn(){var e,t;if(!(!((e=o.manga)!=null&&e.id)||!((t=o.chapter)!=null&&t.number)||o.isVolumeMode))try{const s=await v.getNextChapterPreview(o.manga.id,o.chapter.number);o.nextChapterImage=s.firstImage||null,o.nextChapterNum=s.nextChapter||null}catch{o.nextChapterImage=null,o.nextChapterNum=null}}async function vo(){var r,i;if(!((r=o.manga)!=null&&r.id)||!((i=o.chapter)!=null&&i.number)||o.isCollectionMode||o.isVolumeMode)return;const t=[...o.manga.downloadedChapters||[]].sort((c,l)=>c-l),s=t.indexOf(o.chapter.number);if(s<0||s>=t.length-1)return;const a=t[s+1],n=o.manga.id;if(!(o._preloadCache&&o._preloadCache.chapterNum===a&&o._preloadCache.mangaId===n))try{const l=(o.manga.downloadedVersions||{})[a]||[],d=Array.isArray(l)?l[0]:l,u=d?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(d)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,m=(await v.get(u)).images||[];if(m.length===0)return;const y=m.map(f=>{const b=new Image,C=typeof f=="string"?f:f.url;return C&&(b.src=C),b});o._preloadCache={chapterNum:a,mangaId:n,images:m,imageObjects:y,versionUrl:d},console.log(`[Reader] Preloaded ${m.length} images for chapter ${a}`)}catch(c){console.warn("[Reader] Failed to preload next chapter:",c)}}function rn(e,t,s=o.manga,a=[],n={}){return new Promise(r=>{const i=document.createElement("div");i.className="version-modal-overlay",i.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${t} has ${e.length} versions</h3>
                <p>${n.allowKeep?"Switch version, or keep one and delete the rest:":"Select which version to read:"}</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const c=i.querySelector(".version-list");e.forEach((l,d)=>{const u=document.createElement("button");u.className="version-item";const p=n.current&&n.current===l;p&&u.classList.add("current");const m=(Js(l,s)||`Version ${d+1}`)+(p?" (reading)":""),y=a.find(w=>w.url===l),f=[];if(y!=null&&y.imageCount&&f.push(`${y.imageCount} pages`),y!=null&&y.folder&&f.push(y.folder),u.innerHTML=`<span class="version-item-title"></span>${f.length?'<span class="version-item-meta"></span>':""}`,u.querySelector(".version-item-title").textContent=m,f.length&&(u.querySelector(".version-item-meta").textContent=f.join(" · ")),u.title=l,u.addEventListener("click",()=>{i.remove(),r(l)}),!n.allowKeep){c.appendChild(u);return}const b=document.createElement("div");b.className="version-item-row",b.appendChild(u);const C=document.createElement("button");C.className="version-item-keep",C.textContent="Keep only",C.title="Delete every other downloaded version of this chapter",C.addEventListener("click",()=>{i.remove(),r({keep:l})}),b.appendChild(C),c.appendChild(b)}),i.querySelector(".version-cancel").addEventListener("click",()=>{i.remove(),r(null)}),i.addEventListener("click",l=>{l.target===i&&(i.remove(),r(null))}),document.body.appendChild(i)})}async function yo(){if(!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode)return;const e=o.chapter.number,t=Xs(e);if(t.length<2)return;let s=[];try{s=(await v.getChapterVersions(o.manga.id,e)).versions||[]}catch{}const a=await rn(t,e,o.manga,s,{current:o.versionUrl,allowKeep:!0});if(a){if(typeof a=="string"){a!==o.versionUrl&&(await tt(),H.go(`/read/${o.manga.id}/${e}?version=${encodeURIComponent(a)}`));return}a.keep&&await bo(e,a.keep,t)}}async function bo(e,t,s){var c;const a=s.filter(l=>l!==t),n=Js(t)||"this version";if(!await ne(`Keep only "${n}" and delete the other ${a.length} downloaded version${a.length>1?"s":""} of chapter ${e}?`,{danger:!0}))return;const r=o.manga.id;let i=0;for(const l of a)try{await v.deleteChapterVersion(r,e,l)}catch(d){i++,h("Failed to delete a version: "+d.message,"error")}i===0&&h("Other versions deleted","success");try{const l=await v.getBookmark(r);((c=o.manga)==null?void 0:c.id)===r&&(o.manga=l)}catch{}t!==o.versionUrl?H.go(`/read/${r}/${e}?version=${encodeURIComponent(t)}`):ot()}function wo(e){if(!o.manga||!o.chapter)return;const t=e.map(l=>{const d=It(o.images[l]);return d?{filename:d}:null}).filter(Boolean),s=l=>{if(!o.allFavorites||!o.allFavorites.favorites)return-1;const d=o.allFavorites.favorites[l];if(!Array.isArray(d))return-1;for(let u=0;u<d.length;u++){const p=d[u];if(p.mangaId===o.manga.id&&p.chapterNum===o.chapter.number&&p.imagePaths)for(const m of p.imagePaths){const y=typeof m=="string"?m:(m==null?void 0:m.filename)||(m==null?void 0:m.path);for(const f of t)if(f&&f.filename===y)return u}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";o.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',o.favoriteLists.forEach(l=>{const u=s(l)!==-1;n+=`
                <button class="page-picker-option list-option ${u?"active-list":""}" data-list="${l}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${l}</span>
                    <span style="font-size: 1.2em;">${g(u?"check":"plus")}</span>
                </button>
            `}),n+="</div>"),a.innerHTML=`
        <div class="page-picker-modal" style="width: 90%; max-width: 400px;">
            <h3>${g("star")} Favorites</h3>
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
    `,a.appendChild(r),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),Is()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),Is())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const d=l.dataset.list,u=s(d),p=u!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(p){await v.removeFavoriteItem(d,u);const m=await v.getFavorites();o.allFavorites=m,l.classList.remove("active-list"),l.querySelector("span:last-child").innerHTML=g("plus")}else{const m=e.length>1?"double":"single",y={mangaId:o.manga.id,chapterNum:o.chapter.number,title:`${o.manga.alias||o.manga.title} Ch.${o.chapter.number} p${e[0]+1}`,imagePaths:t,displayMode:m,displaySide:o.direction==="rtl"?"right":"left"};await v.addFavoriteItem(d,y);const f=await v.getFavorites();o.allFavorites=f,l.classList.add("active-list"),l.querySelector("span:last-child").innerHTML=g("check")}}catch(m){console.error(m)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function on(e,t){return new Promise(s=>{const[a,n]=e,r=o.images[a],i=o.images[n],c=typeof r=="string"?r:r==null?void 0:r.url,l=typeof i=="string"?i:i==null?void 0:i.url,d=o.direction==="rtl",u=d?n:a,p=d?a:n,m=d?l:c,y=d?c:l,f=document.createElement("div");f.className="page-picker-overlay",f.innerHTML=`
            <div class="page-picker-modal">
                <h3>${t}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${u+1}">
                        <img src="${m}" alt="Page ${u+1}">
                        <span class="page-picker-label">Page ${u+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${p+1}">
                        <img src="${y}" alt="Page ${p+1}">
                        <span class="page-picker-label">Page ${p+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    ${g("columns-2")} Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const b=C=>{f.remove(),s(C)};f.querySelectorAll(".page-picker-option").forEach(C=>{C.addEventListener("click",()=>{const w=C.dataset.choice;w==="left"?b({pages:[u]}):w==="right"?b({pages:[p]}):w==="both"&&b({pages:e})})}),f.querySelector(".page-picker-cancel").addEventListener("click",()=>b(null)),f.addEventListener("click",C=>{C.target===f&&b(null)}),document.body.appendChild(f)})}function Ms(){if(o.mode==="webtoon"){const e=document.getElementById("reader-content");if(e){const t=e.querySelectorAll("img");if(t.length>0){const s=e.scrollTop;if(s>10){let a=0;for(let n=0;n<t.length;n++){const r=t[n].offsetHeight;if(a+r>s)return n;a+=r}}}}return 0}else{if(o.singlePageMode)return o.currentPage;{const t=ue()[o.currentPage];return t&&t.length>0?t[0]:0}}}function ln(e){var t;if(!(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")){if(e.key==="Escape"){const s=(t=o.manga)==null?void 0:t.id;Promise.all([tt(),ze()]).finally(()=>{s&&H.go(`/manga/${s}`)});return}if(o.mode==="manga")e.key==="ArrowLeft"?o.direction==="rtl"?Ot():As():e.key==="ArrowRight"?o.direction==="rtl"?As():Ot():e.key===" "&&(e.preventDefault(),Ot());else if(o.mode==="webtoon"&&e.key===" "){e.preventDefault();const s=document.getElementById("reader-content");if(s){const a=s.clientHeight*.8;s.scrollBy({top:e.shiftKey?-a:a,behavior:"smooth"})}}}}function Ot(){const e=ue(),t=o.singlePageMode?o.images.length-1:e.length-1;if(o.currentPage<t)o.currentPage++,Oe();else{const s=e[o.currentPage],a=s&&s.type==="link";tt(),a&&(o.navigationDirection="next-linked"),Xt(1)}}function As(){o.currentPage>0?(o.currentPage--,Oe()):Xt(-1)}function Oe(){const e=document.getElementById("reader-content");if(e){e.innerHTML=o.isCollectionMode?Ja():o.mode==="webtoon"?Xa():Za();const t=document.getElementById("page-indicator");t&&(o.singlePageMode?t.textContent=`${o.currentPage+1} / ${o.images.length}`:t.textContent=`${o.currentPage+1} / ${ue().length}`);const s=document.getElementById("page-slider");s&&(s.value=o.currentPage,s.max=o.singlePageMode?o.images.length-1:ue().length-1),tn(),Is(),o.mode==="manga"&&an()}}function ot(){const e=document.getElementById("app");e&&(e.innerHTML=Je(),Jt())}async function Xt(e){var r,i;if(console.log("[Nav] navigateChapter called with delta:",e),o.isStreamingMode)return;if(!o.manga||!o.chapter){console.log("[Nav] early return - no manga or chapter");return}if(await tt(),await ze(),o.isVolumeMode){const c=e>0?(r=o.volume)==null?void 0:r.next:(i=o.volume)==null?void 0:i.prev;c?(o.navigationDirection=e<0?"prev":null,H.go(`/read/${o.manga.id}/volume/${c.id}`)):h(e>0?"Last volume":"First volume","info");return}const s=[...o.manga.downloadedChapters||[]].sort((c,l)=>c-l),a=s.indexOf(o.chapter.number),n=a+e;if(console.log("[Nav]",{delta:e,chapterNumber:o.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length){o.navigationDirection||(o.navigationDirection=e<0?"prev":null);const c=s[n],d=(o.manga.downloadedVersions||{})[c]||[],u=Array.isArray(d)?d[0]:d,p=u?`?version=${encodeURIComponent(u)}`:"";console.log("[Nav] Calling router.go with:",`/read/${o.manga.id}/${c}${p}`),H.go(`/read/${o.manga.id}/${c}${p}`)}else h(e>0?"Last chapter":"First chapter","info")}async function je(e,t,s){var a,n,r,i,c;console.log("[Reader] loadData called:",{mangaId:e,chapterNum:t,versionUrl:s});try{o.mode=localStorage.getItem("reader_mode")||"manga",o.direction=localStorage.getItem("reader_direction")||"rtl",o.singlePageMode=localStorage.getItem("reader_single_page")!=="0",o.firstPageSingle=!0,o.lastPageSingle=!1,o.versionUrl=null,o.isVolumeMode=!1,o.volume=null;let l=null;if(String(t).startsWith("volume:")){const d=String(t).slice(7);o.isVolumeMode=!0,o.isCollectionMode=!1,o.isGalleryMode=!1,o.isStreamingMode=!1;const u=await v.getBookmark(e);o.manga=u;const p=await v.getVolumePages(e,d);o.volume={...p.volume,prev:p.prev||null,next:p.next||null},o.chapter={number:Ts(p.volume),title:p.volume.name,volumeId:d},o.images=p.images||[],l=p.progress&&!p.progress.finished?p.progress:null,await fo(e,p)}else if(e==="gallery"){const d=decodeURIComponent(t),p=((a=(await v.getFavorites()).favorites)==null?void 0:a[d])||[];o.images=[];for(const m of p){const y=m.imagePaths||[],f=[];for(const b of y){let C;typeof b=="string"?C=b:b&&typeof b=="object"&&(C=b.filename||b.path||b.name||b.url,C&&C.includes("/")&&(C=C.split("/").pop()),C&&C.includes("\\")&&(C=C.split("\\").pop())),C&&f.push(`/api/public/chapter-images/${m.mangaId}/${m.chapterNum}/${encodeURIComponent(C)}`)}f.length>0&&o.images.push({urls:f,displayMode:m.displayMode||"single",displaySide:m.displaySide||"left"})}o.manga={id:"gallery",title:d,alias:d},o.chapter={number:"Gallery"},o.isGalleryMode=!0,o.isCollectionMode=!0,o.images.length===0&&h("Gallery is empty","warning")}else if(e==="trophies"){const d=t;let u=[],p="Trophies";if(d.startsWith("series-")){const m=d.replace("series-",""),f=(await store.loadSeries()).find(w=>w.id===m);p=f?f.alias||f.title:"Series Trophies";const C=(await store.loadBookmarks()).filter(w=>w.seriesId===m);for(const w of C){const L=await v.getTrophyPagesAll(w.id);for(const T in L)if(!(parseFloat(T)<0))for(const k in L[T]){const I=L[T][k],E=(await v.getChapterImages(w.id,T)).images[k],$=typeof E=="string"?E.split("/").pop():(E==null?void 0:E.filename)||(E==null?void 0:E.path);u.push({mangaId:w.id,chapterNum:T,imagePaths:[{filename:$}],displayMode:I.isSingle?"single":"double",displaySide:"left"})}}}else{const m=await v.getBookmark(d);p=m?m.alias||m.title:"Manga Trophies";const y=await v.getTrophyPagesAll(d);for(const f in y)if(!(parseFloat(f)<0))for(const b in y[f]){const C=y[f][b],L=(await v.getChapterImages(d,f)).images[b],T=typeof L=="string"?L.split("/").pop():(L==null?void 0:L.filename)||(L==null?void 0:L.path);u.push({mangaId:d,chapterNum:f,imagePaths:[{filename:decodeURIComponent(T)}],displayMode:C.isSingle?"single":"double",displaySide:"left"})}}o.images=u.map(m=>{const y=m.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${m.mangaId}/${m.chapterNum}/${encodeURIComponent(y)}`],displayMode:m.displayMode,displaySide:m.displaySide}}),o.manga={id:"trophies",title:p,alias:p},o.chapter={number:"🏆"},o.isCollectionMode=!0,o.isGalleryMode=!1}else if(e==="stream"){o.isStreamingMode=!0,o.isCollectionMode=!1,o.isGalleryMode=!1,o.singlePageMode=!0;const d=sessionStorage.getItem("streamPreviewUrl"),u=sessionStorage.getItem("streamPreviewScraper"),p=sessionStorage.getItem("streamPreviewTitle")||"Preview";o.manga={id:"stream",title:p,alias:p,_streamUrl:d},o.chapter={number:1},o.images=[],d?$o(d,u):h("No stream URL found","error")}else{o.isGalleryMode=!1;const d=await v.getBookmark(e);o.manga=d,console.log("[Reader] manga loaded, finding chapter..."),o.chapter=((n=d.chapters)==null?void 0:n.find(p=>p.number===parseFloat(t)))||{number:parseFloat(t)};const u=parseFloat(t);if(o._preloadCache&&o._preloadCache.mangaId===e&&o._preloadCache.chapterNum===u)console.log("[Reader] Using preloaded images for chapter",t),o.images=o._preloadCache.images||[],o.versionUrl=s||o._preloadCache.versionUrl||null,o._preloadCache=null;else{o.versionUrl=s||null;const p=s?`/bookmarks/${e}/chapters/${t}/reader-images?version=${encodeURIComponent(s)}`:`/bookmarks/${e}/chapters/${t}/reader-images`,m=await v.get(p);console.log("[Reader] images loaded, count:",(r=m.images)==null?void 0:r.length),o.images=m.images||[]}try{const p=await v.getChapterSettings(e,t);if(Zt(p))Bs(p);else try{const y=[...o.manga.downloadedChapters||[]].sort((L,T)=>L-T),f=parseFloat(t),b=y.indexOf(f),C=[];if(b!==-1){for(let L=b-1;L>=0;L--)C.push(y[L]);for(let L=b+1;L<y.length;L++)C.push(y[L])}const w=12;for(const L of C.slice(0,w)){const T=await v.getChapterSettings(e,L);if(Zt(T)){Bs(T),console.log("[Reader] Inherited settings from chapter",L);break}}}catch(m){console.warn("Failed to inherit chapter settings",m)}}catch(p){console.warn("Failed to load chapter settings",p)}try{const p=await v.getTrophyPages(e,t);o.trophyPages=p||{}}catch(p){console.warn("Failed to load trophy pages",p)}try{const p=await v.getFavorites();o.allFavorites=p,o.favoriteLists=Object.keys(p.favorites||p||{})}catch(p){console.warn("Failed to load favorites",p)}}if(o.isStreamingMode)o.currentPage=0;else{const d=parseFloat(t),u=o.isVolumeMode?l:(c=(i=o.manga)==null?void 0:i.readingProgress)==null?void 0:c[d];if(u&&u.page<u.totalPages)if(o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.max(0,u.page-1);else{const p=Math.max(0,u.page-1),m=ue();let y=0;for(let f=0;f<m.length;f++){const b=m[f],C=Array.isArray(b)?b:b.pages||[];if(C.includes(p)||C[0]>=p){y=f;break}y=f}o.currentPage=y}else o.currentPage=0,o._resumeScrollToPage=u.page-1;else o.currentPage=0}}catch(l){console.error("Error loading chapter:",l),h("Failed to load chapter","error")}if(!o.isStreamingMode){if(o.navigationDirection==="prev"&&o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.max(0,o.images.length-1);else{const l=ue();o.currentPage=Math.max(0,l.length-1)}else if(o.navigationDirection==="next-linked"&&o.mode==="manga"&&o.images.length>1)if(o.singlePageMode)o.currentPage=1;else{const l=ue();let d=0;for(let u=0;u<l.length;u++){const p=l[u];if((Array.isArray(p)?p:p.pages||[]).includes(1)){d=u;break}}o.currentPage=d}}o.navigationDirection=null,o.lastPageSingle&&!o.isStreamingMode&&await nn(),o.loading=!1,ot(),o.isStreamingMode||vo(),o.mode==="webtoon"&&o._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const d=l.querySelectorAll("img");d[o._resumeScrollToPage]&&d[o._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete o._resumeScrollToPage},300)}async function $o(e,t){o._streamAbortController&&o._streamAbortController.abort(),o._streamAbortController=new AbortController;const{signal:s}=o._streamAbortController;try{let a="/api/scrapers/preview-images-stream?";t&&(a+=`scraper=${encodeURIComponent(t)}&`),a+=`url=${encodeURIComponent(e)}`;const n=localStorage.getItem("manga_auth_token"),r={};n&&(r.Authorization=`Bearer ${n}`),console.log("[Reader] Starting stream from:",a);const i=await fetch(a,{headers:r,signal:s});if(!i.ok)throw new Error(`Failed to start stream: ${i.statusText}`);const c=i.body.getReader(),l=new TextDecoder;let d="";for(;;){const{value:u,done:p}=await c.read();if(p||s.aborted)break;d+=l.decode(u,{stream:!0});const m=d.split(`

`);d=m.pop();let y=!1;for(const f of m)if(f.startsWith("data: ")){const b=f.substring(6);try{const C=JSON.parse(b);if(C.type==="metadata")o.manga.title=C.title,o.manga.alias=C.title,ot();else if(C.type==="image"){const w=`/api/scrapers/proxy-cover?url=${encodeURIComponent(C.url)}`;o.images.push(w),y=!0}else if(C.type==="error")h("Stream error: "+C.message,"error");else if(C.type==="done")break}catch(C){console.error("Parse error for SSE data:",C)}}y&&Oe()}}catch(a){a.name!=="AbortError"&&(console.error("Preview stream error:",a),h("Stream failed: "+a.message,"error"))}finally{o._streamAbortController&&o._streamAbortController.signal===s&&(o._streamAbortController=null)}}async function ko(e=[]){console.log("[Reader] mount called with params:",e);let[t,s]=e,a=null;if(s&&s.includes("?")){const[r,i]=s.split("?");s=r,a=new URLSearchParams(i).get("version")}else{const r=window.location.hash.split("?")[1];r&&(a=new URLSearchParams(r).get("version"))}if(console.log("[Reader] mangaId:",t,"chapterNum:",s,"urlVersion:",a),!t||!s){H.go("/");return}const n=document.getElementById("app");if(o.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),o.images=[],o.singlePageMode=!1,o._resumeScrollToPage=null,o.nextChapterImage=null,o.nextChapterNum=null,n.innerHTML=Je(),s==="volume"&&e[2])await je(t,`volume:${e[2]}`);else if(a)await je(t,s,decodeURIComponent(a));else try{const r=await v.getBookmark(t),i=r.downloadedVersions||{},c=new Set(r.deletedChapterUrls||[]),l=i[parseFloat(s)];let d=[];if(Array.isArray(l)&&(d=l.filter(u=>!c.has(u))),d.length>1){let u=[];try{u=(await v.getChapterVersions(t,s)).versions||[]}catch{}const p=await rn(d,s,r,u);if(p===null){H.go(`/manga/${t}`);return}await je(t,s,p)}else d.length===1?await je(t,s,d[0]):await je(t,s)}catch(r){console.log("[Reader] Error in version check, falling back:",r),await je(t,s)}if(n.innerHTML=Je(),console.log("[Reader] render called, loading:",o.loading,"manga:",!!o.manga,"images:",o.images.length),Jt(),o.mode==="webtoon"&&o._resumeScrollToPage!=null){const r=o._resumeScrollToPage;o._resumeScrollToPage=null,setTimeout(()=>{const i=document.getElementById("reader-content");if(i){const c=i.querySelectorAll("img");c[r]&&c[r].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function Eo(){console.log("[Reader] unmount called"),o._streamAbortController&&(o._streamAbortController.abort(),o._streamAbortController=null),Ye&&(clearTimeout(Ye),Ye=null);const e=sn(),t=cn();document.body.classList.remove("reader-active"),document.removeEventListener("keydown",ln),o.manga=null,o.chapter=null,o.versionUrl=null,o.images=[],o.loading=!0,o.singlePageMode=!1,o.isStreamingMode=!1,o._resumeScrollToPage=null,o._preloadCache=null,await tt(e),await ze(t)}function Zt(e){return!!e&&(e.mode!==void 0||e.direction!==void 0||e.firstPageSingle!==void 0||e.lastPageSingle!==void 0)}function Bs(e){e&&(e.mode&&(o.mode=e.mode),e.direction&&(o.direction=e.direction),e.firstPageSingle!==void 0&&(o.firstPageSingle=e.firstPageSingle),e.lastPageSingle!==void 0&&(o.lastPageSingle=e.lastPageSingle))}function cn(){return!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode?null:{mangaId:o.manga.id,chapterNumber:o.chapter.number,settings:{mode:o.mode,direction:o.direction,firstPageSingle:o.firstPageSingle,lastPageSingle:o.lastPageSingle}}}async function ze(e=cn()){if(!(!e||Z.isDemo))try{await v.updateChapterSettings(e.mangaId,e.chapterNumber,e.settings)}catch(t){console.error("Failed to save settings:",t)}}async function dn(e){try{const t=await v.getBookmark(e),s=t.downloadedChapters||[],a=new Set(t.readChapters||[]),n=t.readingProgress||{},r=t.downloadedVersions||{},i=[...s].sort((l,d)=>l-d);let c=null;for(const l of i){const d=n[l];if(d&&d.page<d.totalPages&&!a.has(l)){c=l;break}}if(c===null){for(const l of i)if(!a.has(l)){c=l;break}}if(c===null&&i.length>0&&(c=i[0]),c!==null){const l=r[c]||[],d=Array.isArray(l)?l[0]:l,u=d?`?version=${encodeURIComponent(d)}`:"";H.go(`/read/${e}/${c}${u}`)}else h("No downloaded chapters to read","info")}catch(t){h("Failed to continue reading: "+t.message,"error")}}const So={mount:ko,unmount:Eo,render:Je,continueReading:dn},un="torrent-search-modal",Co=3e3;let ga=0,Ut=null;function Ae(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Tt(e){if(!e)return"";const t=["B","KB","MB","GB","TB"];let s=0,a=e;for(;a>=1024&&s<t.length-1;)a/=1024,s++;return`${a<10&&s>0?a.toFixed(1):Math.round(a)} ${t[s]}`}function xo(e){if(!e)return"";const t=Math.floor((Date.now()-new Date(e).getTime())/864e5);return t<1?"today":t<30?`${t}d`:t<365?`${Math.floor(t/30)}mo`:`${Math.floor(t/365)}y`}function Lo(e){return e?e.volume!==null&&e.volume!==void 0?e.volumeEnd?`Vol. ${e.volume}–${e.volumeEnd}`:`Vol. ${e.volume}`:e.chapter!==null&&e.chapter!==void 0?e.chapterEnd?`Ch. ${e.chapter}–${e.chapterEnd}`:`Ch. ${e.chapter}`:"":""}function Io(e){switch(e.status){case"grabbing":return{kind:"pending",text:"Fetching the release for qBittorrent…"};case"downloading":{const t=Math.round((e.progress||0)*100);return{kind:"ok",text:`Downloading in qBittorrent${t?` · ${t}%`:""} · progress on the Queue page`,done:!0}}case"completed":return{kind:"ok",text:"Downloaded, waiting for import",done:!0};case"importing":return{kind:"ok",text:"Importing into the library…",done:!0};case"imported":return{kind:"ok",text:"Imported",done:!0};case"failed":return{kind:"error",text:`Failed: ${e.error||"unknown error"}`,done:!0,retry:!0};case"removed":return{kind:"error",text:"Removed from qBittorrent",done:!0,retry:!0};default:return{kind:"pending",text:e.status}}}function Ht(){var e;(e=document.getElementById(un))==null||e.remove(),document.removeEventListener("keydown",pn),Ut&&(Ut(),Ut=null)}function pn(e){e.key==="Escape"&&Ht()}async function hn({query:e="",bookmarkId:t=null,bookmarkTitle:s="",library:a=null,onGrabbed:n}={}){const r=++ga;Ht();let i;try{i=await v.getTorrentStatus()}catch{i={prowlarr:!1,qbittorrent:!1}}if(r!==ga)return;if(!i.prowlarr||!i.qbittorrent){h("Set up Prowlarr and qBittorrent under Settings > Torrents first","info");return}const c=document.createElement("div");c.id=un,c.className="modal open torrent-modal";const l=t?`<div class="torrent-target">Releases go to <strong>${Ae(s)}</strong> and are imported as volumes when they finish.</div>`:`<div class="torrent-target">
             <label>Add to
               <select id="torrent-target-select">
                 <option value="">New series (named after the release)</option>
                 ${(a||[]).map($=>`<option value="${Ae($.id)}">${Ae($.alias||$.title)}</option>`).join("")}
               </select>
             </label>
           </div>`;c.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${g("download")} Find volume releases</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body">
                <form class="torrent-search-form" id="torrent-search-form">
                    <input type="text" id="torrent-query" value="${Ae(e)}" placeholder="Title to search the indexers for" autocomplete="off">
                    <button type="submit" class="btn btn-primary">Search</button>
                </form>
                ${l}
                <label class="torrent-option">
                    <input type="checkbox" id="torrent-auto-import" ${i.autoImport===!1?"":"checked"}>
                    Import automatically when a download finishes. Untick to review what it contains first (Queue page).
                </label>
                <form class="torrent-magnet-form" id="torrent-magnet-form">
                    <input type="text" id="torrent-magnet" placeholder="Or paste a magnet link / .torrent URL from elsewhere" autocomplete="off" spellcheck="false">
                    <button type="submit" class="btn btn-secondary">Add</button>
                </form>
                <div class="torrent-hint" id="torrent-magnet-result" hidden></div>
                <div class="torrent-results" id="torrent-results"><div class="torrent-hint">Searches every indexer enabled in Prowlarr. Volume releases show their volume number when the name says it.</div></div>
            </div>
        </div>
    `,document.body.appendChild(c),document.addEventListener("keydown",pn),c.querySelector(".modal-overlay").addEventListener("click",Ht),c.querySelector('[data-act="close"]').addEventListener("click",Ht);const d=c.querySelector("#torrent-results"),u=c.querySelector("#torrent-query");let p=[];const m=new Map;let y=null;const f=($,M,_)=>{const F=d.querySelector(`.torrent-row-status[data-index="${$}"]`);F&&(F.className=`torrent-row-status ${M}`,F.textContent=_)},b=($,M,_,F)=>{const V=d.querySelector(`.torrent-grab[data-index="${$}"]`);V&&(V.textContent=M,V.disabled=!_,V.classList.toggle("btn-primary",F),V.classList.toggle("btn-secondary",!F))},C=$=>{if(Array.isArray($)){for(const[M,_]of m){let F=$.find(X=>X.hash===_.hash);if(F||(F=$.filter(X=>X.releaseTitle===_.title).sort((X,z)=>String(z.addedAt||"").localeCompare(String(X.addedAt||"")))[0]),!F)continue;_.hash=F.hash;const V=Io(F);f(M,V.kind,V.text),V.retry?b(M,"Grab again",!0,!0):V.done&&b(M,"Grabbed",!1,!1),V.done&&(_.done=!0)}[...m.values()].some(M=>!M.done)||k()}},w=$=>C($==null?void 0:$.torrents),L=async()=>{try{const $=await v.getTorrentDownloads();C($.torrents)}catch{}},T=()=>{y||(y=setInterval(L,Co))},k=()=>{y&&(clearInterval(y),y=null)};se.on(ie.TORRENT_UPDATE,w),Ut=()=>{se.off(ie.TORRENT_UPDATE,w),k()};const I=$=>{if(p=$,m.clear(),k(),$.length===0){d.innerHTML='<div class="torrent-hint">No releases found. Try a shorter title.</div>';return}d.innerHTML=`
            <table class="torrent-table">
                <thead><tr><th>Release</th><th>Vol.</th><th>Size</th><th>Seeds</th><th>Indexer</th><th>Age</th><th></th></tr></thead>
                <tbody>
                ${$.map((M,_)=>{var F;return`
                    <tr>
                        <td class="torrent-title" title="${Ae(M.title)}">
                            <div>${Ae(M.title)}${(F=M.parsed)!=null&&F.digital?' <span class="badge badge-downloaded">Digital</span>':""}${M.infoUrl?` <a href="${Ae(M.infoUrl)}" target="_blank" rel="noopener" class="torrent-info-link" title="Open on the indexer">${g("globe")}</a>`:""}</div>
                            <div class="torrent-row-status" data-index="${_}"></div>
                        </td>
                        <td>${Ae(Lo(M.parsed))}</td>
                        <td>${Tt(M.size)}</td>
                        <td class="${(M.seeders??0)===0?"torrent-dead":""}">${M.seeders??"?"}</td>
                        <td>${Ae(M.indexer)}</td>
                        <td>${xo(M.publishDate)}</td>
                        <td>${M.hasDownload===!1?'<span class="text-muted" title="The indexer gave no download link">No link</span>':`<button class="btn btn-sm btn-primary torrent-grab" data-index="${_}">Grab</button>`}</td>
                    </tr>`}).join("")}
                </tbody>
            </table>`,d.querySelectorAll(".torrent-grab").forEach(M=>M.addEventListener("click",()=>E(parseInt(M.dataset.index,10),M)))},N=async()=>{const $=u.value.trim();if($){d.innerHTML=`<div class="torrent-hint">${g("loader",{spin:!0})} Searching the indexers…</div>`;try{const M=await v.searchTorrents($);I(M.results||[])}catch(M){d.innerHTML=`<div class="torrent-hint error">${Ae(M.message)}</div>`}}},E=async($,M)=>{var X,z,te;const _=p[$];if(!_)return;const F=c.querySelector("#torrent-target-select"),V=t||F&&F.value||null;M.disabled=!0,M.textContent="Sending…",f($,"pending","Sending to qBittorrent…");try{const O=((X=c.querySelector("#torrent-auto-import"))==null?void 0:X.checked)??null,S=await v.grabTorrent(_.id,{bookmarkId:V,newSeriesTitle:V?null:((z=_.parsed)==null?void 0:z.title)||null,autoImport:O});m.set($,{hash:(te=S.torrent)==null?void 0:te.hash,title:_.title,done:!1}),b($,"Grabbed",!1,!1),S.torrent&&C([S.torrent]),T(),typeof n=="function"&&n(S.torrent)}catch(O){b($,"Grab again",!0,!0),f($,"error",`Failed: ${O.message}`)}};c.querySelector("#torrent-magnet-form").addEventListener("submit",async $=>{var O,S;$.preventDefault();const M=c.querySelector("#torrent-magnet"),_=c.querySelector("#torrent-magnet-result"),F=M.value.trim();if(!F){M.focus();return}const V=c.querySelector("#torrent-target-select"),X=t||V&&V.value||null,z=((O=c.querySelector("#torrent-auto-import"))==null?void 0:O.checked)??null,te=$.currentTarget.querySelector("button");te.disabled=!0,_.hidden=!1,_.className="torrent-hint",_.textContent="Sending to qBittorrent…";try{const A=await v.addMagnet(F,{bookmarkId:X,autoImport:z});M.value="",_.textContent=`Added "${((S=A.torrent)==null?void 0:S.name)||"link"}"${X?"":" as a new series"}; follow it on the Queue page.`,A.torrent&&C([A.torrent]),T(),h("Magnet link added","success"),typeof n=="function"&&n(A.torrent)}catch(A){_.className="torrent-hint error",_.textContent=A.message}finally{te.disabled=!1}}),c.querySelector("#torrent-search-form").addEventListener("submit",$=>{$.preventDefault(),N()}),e?N():u.focus()}const _s="chapter-pages-modal";function Ve(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function To(e){try{const t=String(e).split("?")[0];return decodeURIComponent(t.slice(t.lastIndexOf("/")+1))}catch{return String(e).slice(String(e).lastIndexOf("/")+1)}}function kt(){var e;(e=document.getElementById(_s))==null||e.remove(),document.removeEventListener("keydown",mn)}function mn(e){e.key==="Escape"&&kt()}function Mo({mangaId:e,num:t,title:s="",versions:a=[],versionUrl:n=null,onChanged:r}={}){var k,I,N,E;kt();const i=a.filter($=>$.url);let c=n&&i.some($=>$.url===n)?n:((k=i[0])==null?void 0:k.url)??null;const l=document.createElement("div");l.id=_s,l.className="modal open chapter-pages-modal",l.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${g("images")} Chapter ${Ve(t)}${s?` · ${Ve(s)}`:""}</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="chapter-pages-toolbar">
                ${i.length>1?`<label class="chapter-pages-version">Version
                    <select id="cp-version">${i.map($=>`<option value="${Ve($.url)}" ${$.url===c?"selected":""}>${Ve($.label||$.folder)} · ${$.imageCount} pages</option>`).join("")}</select>
                </label>`:`<span class="torrent-hint" id="cp-folder">${Ve(((I=i[0])==null?void 0:I.folder)||((N=a[0])==null?void 0:N.folder)||"")}</span>`}
                <span class="spacer"></span>
                <span class="torrent-hint" id="cp-count"></span>
                <button type="button" class="btn btn-sm btn-secondary" id="cp-read" title="Open in the reader">${g("play")} Read</button>
            </div>
            <div class="chapter-pages-hint">Rotate, cut a double page in two, swap two pages (pick one, then the other) or delete. Changes are made to the files on disk right away.</div>
            <div class="chapter-pages-body" id="cp-body"><div class="torrent-hint">${g("loader",{spin:!0})} Loading pages…</div></div>
        </div>
    `,document.body.appendChild(l),document.addEventListener("keydown",mn),l.querySelector(".modal-overlay").addEventListener("click",kt),l.querySelector('[data-act="close"]').addEventListener("click",kt);const d=l.querySelector("#cp-body"),u=l.querySelector("#cp-count");let p=[],m=null,y=!1,f=!1;const b=$=>{p=($||[]).map(M=>typeof M=="string"?M:M==null?void 0:M.url).filter(Boolean)},C=()=>{if(u.textContent=`${p.length} page${p.length===1?"":"s"}`,p.length===0){d.innerHTML='<div class="torrent-hint">No pages on disk for this version.</div>';return}d.innerHTML=`<div class="chapter-pages-grid">${p.map(($,M)=>{const _=To($),F=m===_;return`
            <figure class="chapter-page ${F?"picked":""}" data-name="${Ve(_)}">
                <img src="${Ve($)}${$.includes("?")?"&":"?"}t=${Date.now()}" alt="Page ${M+1}" loading="lazy" decoding="async">
                <figcaption>
                    <span class="chapter-page-num">${M+1}</span>
                    <span class="chapter-page-tools">
                        <button type="button" class="btn-icon small" data-tool="rotate" title="Rotate 90°">${g("rotate-cw")}</button>
                        <button type="button" class="btn-icon small" data-tool="split" title="Cut this page in two">${g("columns-2")}</button>
                        <button type="button" class="btn-icon small ${F?"success":""}" data-tool="swap" title="${F?"Cancel swap":m?"Swap with the picked page":"Swap: pick this page, then another"}">${g("arrow-left-right")}</button>
                        <button type="button" class="btn-icon small danger" data-tool="delete" title="Delete this page">${g("trash-2")}</button>
                    </span>
                </figcaption>
            </figure>`}).join("")}</div>`},w=async()=>{if(!c){d.innerHTML=`<div class="torrent-hint">${a.length?"This folder is not linked to a downloaded version, so its pages cannot be edited here. Use the versions list on the chapter row to delete it.":"This chapter has no pages on disk."}</div>`,u.textContent="";return}try{const $=await v.getReaderImages(e,t,c);b($.images),C()}catch($){d.innerHTML=`<div class="torrent-hint error">${Ve($.message)}</div>`}},L=async($,M)=>{if(!y){y=!0,d.classList.add("busy");try{const _=await M();f=!0,_&&Array.isArray(_.images)?(b(_.images),C()):await w()}catch(_){h(`${$} failed: ${_.message}`,"error")}finally{y=!1,d.classList.remove("busy")}}};d.addEventListener("click",async $=>{var V;const M=$.target.closest("[data-tool]");if(!M)return;const _=(V=M.closest(".chapter-page"))==null?void 0:V.dataset.name;if(!_)return;const F=M.dataset.tool;if(F==="rotate")return L("Rotate",()=>v.rotatePage(e,t,_,90,c));if(F==="split")return L("Split",()=>v.splitPage(e,t,_,c));if(F==="delete")return await ne(`Delete page "${_}" from disk?`,{danger:!0})?L("Delete",()=>v.deletePage(e,t,_,c)):void 0;if(F==="swap"){if(m===_){m=null,C();return}if(!m){m=_,C();return}const X=m;return m=null,L("Swap",()=>v.swapPages(e,t,X,_,c))}}),(E=l.querySelector("#cp-version"))==null||E.addEventListener("change",$=>{c=$.target.value,m=null,w()}),l.querySelector("#cp-read").addEventListener("click",()=>{kt(),window.location.hash=`#/read/${e}/${t}${c?`?version=${encodeURIComponent(c)}`:""}`});const T=new MutationObserver(()=>{document.getElementById(_s)||(T.disconnect(),f&&typeof r=="function"&&r())});T.observe(document.body,{childList:!0}),w()}const es="import-review-modal";function we(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ao(e){const t=e.parsed||{};return t.volume!==null&&t.volume!==void 0?t.volumeEnd?`name says volumes ${t.volume}–${t.volumeEnd}`:`name says volume ${t.volume}`:t.chapter!==null&&t.chapter!==void 0?t.chapterEnd?`name says chapters ${t.chapter}–${t.chapterEnd}`:`name says chapter ${t.chapter}`:"no number in the name"}const fa=e=>new Promise(t=>setTimeout(t,e));async function Bo(e,t){if(!e.importId)return e;for(;;){if(!document.getElementById(es))return null;let s;try{s=await v.getImport(e.importId)}catch{await fa(2e3);continue}if(s.status==="done")return{bookmarkId:s.bookmarkId,summary:s.summary};if(s.status==="failed")throw new Error(s.error||"Import failed");const a=s.status==="queued"?"Queued behind other tasks…":`Importing ${Math.min(s.done+1,s.total||s.done+1)} of ${s.total||"?"}${s.current?`: ${we(s.current)}`:""}`;t.innerHTML=`
            <div class="torrent-row-status">${g("loader",{spin:!0})} ${a}</div>
            <div class="torrent-hint">You can close this dialog; the import carries on and shows on the <a href="#/queue">Queue</a> page.</div>`,await fa(1500)}}function Et(){var e;(e=document.getElementById(es))==null||e.remove(),document.removeEventListener("keydown",gn)}function gn(e){e.key==="Escape"&&Et()}async function fn(e,{onImported:t}={}){var b,C,w,L,T,k;const s=e,a=!e.hash;Et();const n=document.createElement("div");n.id=es,n.className="modal open torrent-modal",n.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${g("list-checks")} Review import</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body" id="review-body"><div class="torrent-hint">${g("loader",{spin:!0})} Reading the download…</div></div>
            <div class="modal-footer" id="review-footer" hidden></div>
        </div>
    `,document.body.appendChild(n),document.addEventListener("keydown",gn),n.querySelector(".modal-overlay").addEventListener("click",Et),n.querySelector('[data-act="close"]').addEventListener("click",Et);const r=n.querySelector("#review-body"),i=n.querySelector("#review-footer");let c;try{c=a?await v.getFolderContents(e.path,e.bookmarkId||null):await v.getTorrentContents(s.hash)}catch(I){r.innerHTML=`<div class="torrent-hint error">${we(I.message)}</div>`;return}if(!document.getElementById(es))return;let l=[];if(!c.bookmarkId)try{const I=await v.getBookmarks();l=(I.bookmarks||I||[]).map(N=>({id:N.id,title:N.alias||N.title})).sort((N,E)=>N.title.localeCompare(E.title))}catch{}const d=c.items||[],u=new Map((((b=c.existing)==null?void 0:b.volumes)||[]).map(I=>[Number(I.number),I.name])),p=new Set((((C=c.existing)==null?void 0:C.chapters)||[]).map(Number));r.innerHTML=`
        <div class="torrent-target">
            <strong>${we(c.releaseName||s.name)}</strong> · ${d.length} item${d.length===1?"":"s"}
            ${c.bookmarkId?` · into <strong>${we(c.bookmarkTitle)}</strong>`:` · into <label>
                    <select id="review-target">
                        <option value="">New series “${we(c.newSeriesTitle||s.name)}”</option>
                        ${l.map(I=>`<option value="${we(I.id)}">${we(I.title)}</option>`).join("")}
                    </select></label>`}
        </div>
        ${d.length===0?'<div class="torrent-hint">Nothing importable in this download: no .cbz/.zip archives or image folders.</div>':`
        <div class="review-tools">
            <button type="button" class="btn btn-sm btn-secondary" id="review-all">Select all</button>
            <button type="button" class="btn btn-sm btn-secondary" id="review-none">Select none</button>
            <span class="torrent-hint">Untick what you don't want. Change Volume/Chapter and the number where the name was read wrongly.</span>
        </div>
        <table class="torrent-table review-table">
            <thead><tr><th></th><th>File</th><th>Size</th><th>Import as</th><th>Number</th><th></th></tr></thead>
            <tbody>
            ${d.map((I,N)=>`
                <tr data-index="${N}">
                    <td><input type="checkbox" class="rv-pick" checked></td>
                    <td class="torrent-title">
                        <div>${I.kind==="dir"?g("folder"):g("package")} ${we(I.name)}</div>
                        <div class="torrent-row-status">${we(Ao(I))}</div>
                    </td>
                    <td>${I.kind==="dir"?`${I.pages??"?"} pages`:Tt(I.size)}</td>
                    <td>
                        <select class="rv-as">
                            <option value="volume" ${I.as==="volume"?"selected":""}>Volume</option>
                            <option value="chapter" ${I.as==="chapter"?"selected":""} ${I.kind==="dir"?"disabled":""}>Chapter</option>
                        </select>
                    </td>
                    <td><input type="number" step="any" min="0" class="rv-num" value="${I.number??""}"></td>
                    <td class="rv-warn"></td>
                </tr>`).join("")}
            </tbody>
        </table>`}
        ${(w=c.unsupported)!=null&&w.length?`<div class="torrent-hint">Cannot import: ${c.unsupported.map(we).join(", ")} (only .cbz/.zip and image folders).</div>`:""}
        <div id="review-result"></div>
    `;const m=()=>[...r.querySelectorAll("tr[data-index]")],y=I=>({index:parseInt(I.dataset.index,10),picked:I.querySelector(".rv-pick").checked,as:I.querySelector(".rv-as").value,number:parseFloat(I.querySelector(".rv-num").value)}),f=()=>{const I=m().map(y),N=new Map;for(const M of I){if(!M.picked||!Number.isFinite(M.number))continue;const _=`${M.as}:${M.number}`;N.set(_,(N.get(_)||0)+1)}let E=0;for(const M of m()){const _=y(M),F=M.querySelector(".rv-warn"),V=[];_.picked&&(E++,Number.isFinite(_.number)?(N.get(`${_.as}:${_.number}`)>1&&V.push(`same ${_.as} number as another file`),_.as==="volume"&&u.has(_.number)&&V.push(`replaces ${u.get(_.number)}`),_.as==="chapter"&&p.has(_.number)&&V.push(`replaces downloaded chapter ${_.number}`)):V.push("needs a number")),F.textContent=V.join(" · "),M.classList.toggle("rv-skipped",!_.picked)}const $=i.querySelector("#review-import");$&&($.disabled=E===0,$.textContent=`Import ${E} selected`)};r.addEventListener("change",f),r.addEventListener("input",f),(L=r.querySelector("#review-all"))==null||L.addEventListener("click",()=>{m().forEach(I=>{I.querySelector(".rv-pick").checked=!0}),f()}),(T=r.querySelector("#review-none"))==null||T.addEventListener("click",()=>{m().forEach(I=>{I.querySelector(".rv-pick").checked=!1}),f()}),i.hidden=!1,i.innerHTML=`
        <span class="torrent-hint">Existing volumes with the same number are replaced.</span>
        <span class="spacer"></span>
        <button type="button" class="btn btn-secondary" data-act="close">Cancel</button>
        ${d.length?'<button type="button" class="btn btn-primary" id="review-import">Import</button>':""}
    `,i.querySelector('[data-act="close"]').addEventListener("click",Et),f(),(k=i.querySelector("#review-import"))==null||k.addEventListener("click",async()=>{var _,F,V,X;const I=i.querySelector("#review-import"),N=m().map(y),E=N.map(z=>({path:d[z.index].path,as:z.picked?z.as:"skip",number:z.number})),$=N.filter(z=>z.picked);if($.length===0)return;if($.some(z=>!Number.isFinite(z.number))){h("Every selected item needs a number","error");return}const M=c.bookmarkId||((_=r.querySelector("#review-target"))==null?void 0:_.value)||null;I.disabled=!0,I.textContent="Importing…",r.querySelectorAll("input, select, button").forEach(z=>{z.disabled=!0});try{const z=a?await v.importFolder({path:e.path,bookmarkId:M,newSeriesTitle:c.newSeriesTitle||e.name,selection:E}):await v.importTorrent(s.hash,M,E);I.textContent="Importing…",i.querySelector('[data-act="close"]').textContent="Close";const te=await Bo(z,r.querySelector("#review-result"));if(!te)return;const O=((F=te.summary)==null?void 0:F.volumes)||[],S=((V=te.summary)==null?void 0:V.chapters)||[],A=((X=te.summary)==null?void 0:X.skipped)||[];r.querySelector("#review-result").innerHTML=`
                <div class="torrent-row-status ok">${g("check")} Imported ${O.length} volume${O.length===1?"":"s"}${O.length?` (${O.map(R=>we(R.name)).join(", ")})`:""}${S.length?` and ${S.length} chapter${S.length===1?"":"s"}`:""}.</div>
                ${A.length?`<ul class="task-error-list">${A.map(R=>`<li>${we(R)}</li>`).join("")}</ul>`:""}
                <a href="#/manga/${we(te.bookmarkId)}" class="btn btn-sm btn-secondary">Open the series</a>
            `,I.textContent="Done",i.querySelector('[data-act="close"]').textContent="Close",typeof t=="function"&&t(te)}catch(z){r.querySelectorAll("input, select, button").forEach(te=>{te.disabled=!1}),r.querySelector("#review-result").innerHTML=`<div class="torrent-row-status error">Import failed: ${we(z.message)}</div>`,I.disabled=!1,f()}})}const vn="folder-import-modal";function Ne(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function St(){var e;(e=document.getElementById(vn))==null||e.remove(),document.removeEventListener("keydown",yn)}function yn(e){e.key==="Escape"&&St()}function _o({bookmarkId:e=null,bookmarkTitle:t="",onImported:s}={}){St();const a=document.createElement("div");a.id=vn,a.className="modal open torrent-modal folder-import-modal",a.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${g("folder")} Import from folder${t?` into ${Ne(t)}`:""}</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body">
                <p class="torrent-hint">Pick a release folder (or a single .cbz/.zip) that is already on disk. Only the torrent save path and the path mappings from Settings can be browsed. Nothing is downloaded and the source files are left as they are.</p>
                <div class="folder-crumbs" id="fi-crumbs"></div>
                <div class="folder-list" id="fi-list"><div class="torrent-hint">${g("loader",{spin:!0})} Loading…</div></div>
            </div>
            <div class="modal-footer">
                <span class="torrent-hint" id="fi-current"></span>
                <span class="spacer"></span>
                <button type="button" class="btn btn-secondary" data-act="close">Cancel</button>
                <button type="button" class="btn btn-primary" id="fi-import" disabled>Import this folder</button>
            </div>
        </div>
    `,document.body.appendChild(a),document.addEventListener("keydown",yn),a.querySelector(".modal-overlay").addEventListener("click",St),a.querySelectorAll('[data-act="close"]').forEach(p=>p.addEventListener("click",St));const n=a.querySelector("#fi-crumbs"),r=a.querySelector("#fi-list"),i=a.querySelector("#fi-current"),c=a.querySelector("#fi-import");let l=null;const d=p=>{l=p,c.disabled=!p,c.textContent=(p==null?void 0:p.kind)==="archive"?"Import this archive":"Import this folder",i.textContent=p?p.path:"",r.querySelectorAll(".folder-entry").forEach(m=>m.classList.toggle("picked",!!p&&m.dataset.path===p.path))},u=async p=>{r.innerHTML=`<div class="torrent-hint">${g("loader",{spin:!0})} Loading…</div>`;let m;try{m=await v.browseImportFolders(p)}catch(f){r.innerHTML=`<div class="torrent-hint error">${Ne(f.message)}</div>`,n.innerHTML="",d(null);return}m.path,n.innerHTML=m.path?`<button type="button" class="btn btn-sm btn-secondary" data-go="">${g("hard-drive")} Roots</button>
               ${m.parent?`<button type="button" class="btn btn-sm btn-secondary" data-go="${Ne(m.parent)}">${g("chevron-left")} Up</button>`:""}
               <span class="folder-path" title="${Ne(m.path)}">${Ne(m.path)}</span>`:'<span class="folder-path">Folders this app may import from</span>',n.querySelectorAll("[data-go]").forEach(f=>f.addEventListener("click",()=>u(f.dataset.go||null)));const y=m.entries||[];r.innerHTML=y.length?y.map(f=>`
                <div class="folder-entry ${f.exists===!1?"missing":""}" data-path="${Ne(f.path)}" data-kind="${f.kind}" data-name="${Ne(f.name)}">
                    <span class="folder-entry-icon">${f.kind==="dir"?g("folder"):g("package")}</span>
                    <span class="folder-entry-name">${Ne(f.name)}${f.exists===!1?" <small>(not found on this machine)</small>":""}</span>
                    <span class="folder-entry-meta">${f.kind==="archive"?Tt(f.size):""}</span>
                    ${f.kind==="dir"&&f.exists!==!1?`<button type="button" class="btn btn-sm btn-secondary" data-open="${Ne(f.path)}">Open</button>`:""}
                </div>`).join(""):'<div class="torrent-hint">Empty: no sub-folders and no .cbz/.zip files here.</div>',r.querySelectorAll("[data-open]").forEach(f=>f.addEventListener("click",b=>{b.stopPropagation(),u(f.dataset.open)})),r.querySelectorAll(".folder-entry").forEach(f=>{f.addEventListener("click",()=>{f.classList.contains("missing")||d({path:f.dataset.path,name:f.dataset.name,kind:f.dataset.kind})}),f.addEventListener("dblclick",()=>{f.dataset.kind==="dir"&&!f.classList.contains("missing")&&u(f.dataset.path)})}),d(m.path&&!m.roots.includes(m.path)?{path:m.path,name:m.path.split(/[\\/]/).pop(),kind:"dir"}:null)};c.addEventListener("click",()=>{if(!l)return;const p={path:l.path,name:l.name,bookmarkId:e,bookmarkTitle:t};St(),fn(p,{onImported:s})}),u(null)}const bn="volume-manager-modal";function ft(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function qs(){var e;(e=document.getElementById(bn))==null||e.remove(),document.removeEventListener("keydown",wn)}function wn(e){e.key==="Escape"&&qs()}function qo(e){if(e.kind==="release")return`${e.source==="torrent"?"Torrent":"Archive"} release · ${e.pageCount||0} pages`;const t=(e.chapters||[]).length;return`Chapter collection · ${t} chapter${t===1?"":"s"}`}function Po(e,{onChanged:t}={}){qs();let s=[...e.volumes||[]],a=!1;const n=document.createElement("div");n.id=bn,n.className="modal open torrent-modal",n.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${g("settings")} Manage volumes</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body" id="vm-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-danger" id="vm-delete" disabled>Delete selected</button>
                <span class="spacer"></span>
                <button type="button" class="btn btn-secondary" data-act="close">Close</button>
                <button type="button" class="btn btn-primary" id="vm-save" disabled>Save changes</button>
            </div>
        </div>
    `,document.body.appendChild(n),document.addEventListener("keydown",wn);const r=n.querySelector("#vm-body"),i=n.querySelector("#vm-delete"),c=n.querySelector("#vm-save"),l=()=>{qs(),a&&typeof t=="function"&&t()};n.querySelector(".modal-overlay").addEventListener("click",l),n.querySelectorAll('[data-act="close"]').forEach(w=>w.addEventListener("click",l));const d=()=>{var w,L;r.innerHTML=s.length===0?'<div class="torrent-hint">No volumes left.</div>':`
            <div class="review-tools">
                <button type="button" class="btn btn-sm btn-secondary" id="vm-all">Select all</button>
                <button type="button" class="btn btn-sm btn-secondary" id="vm-none">Select none</button>
                <span class="torrent-hint">Edit a name or number and press Save. Deleting a release volume removes its pages from disk.</span>
            </div>
            <table class="torrent-table volume-manager-table">
                <thead><tr><th></th><th></th><th>No.</th><th>Name</th><th>Kind</th><th>Order</th><th></th></tr></thead>
                <tbody>
                ${s.map((T,k)=>`
                    <tr data-id="${ft(T.id)}">
                        <td><input type="checkbox" class="vm-pick"></td>
                        <td>${T.cover?`<img class="vm-cover" src="${ft(T.cover)}" alt="">`:`<span class="vm-cover vm-cover-empty">${g("book")}</span>`}</td>
                        <td><input type="number" step="any" min="0" class="vm-number" value="${T.number??""}" placeholder="–"></td>
                        <td><input type="text" class="vm-name" value="${ft(T.name)}"></td>
                        <td class="vm-kind">${ft(qo(T))}</td>
                        <td class="vm-order">
                            <button type="button" class="btn-icon small vm-move" data-dir="up" title="Move up" ${k===0?"disabled":""}>${g("chevron-up")}</button>
                            <button type="button" class="btn-icon small vm-move" data-dir="down" title="Move down" ${k===s.length-1?"disabled":""}>${g("chevron-down")}</button>
                        </td>
                        <td><button type="button" class="btn-icon small danger vm-delete-one" title="Delete this volume">${g("trash-2")}</button></td>
                    </tr>`).join("")}
                </tbody>
            </table>
            <div id="vm-result"></div>`,(w=r.querySelector("#vm-all"))==null||w.addEventListener("click",()=>{r.querySelectorAll(".vm-pick").forEach(T=>{T.checked=!0}),y()}),(L=r.querySelector("#vm-none"))==null||L.addEventListener("click",()=>{r.querySelectorAll(".vm-pick").forEach(T=>{T.checked=!1}),y()}),r.querySelectorAll(".vm-move").forEach(T=>T.addEventListener("click",()=>b(T.closest("tr").dataset.id,T.dataset.dir))),r.querySelectorAll(".vm-delete-one").forEach(T=>T.addEventListener("click",()=>C([T.closest("tr").dataset.id]))),y()},u=()=>[...r.querySelectorAll("tr[data-id]")],p=()=>u().map(w=>{const L=s.find(E=>E.id===w.dataset.id),T=w.querySelector(".vm-name").value.trim(),k=w.querySelector(".vm-number").value,I=k===""?null:parseFloat(k),N={};return T&&T!==L.name&&(N.name=T),I!==null&&Number.isFinite(I)&&I!==L.number&&(N.number=I),{id:L.id,patch:N,tr:w}}).filter(w=>Object.keys(w.patch).length>0),m=()=>u().filter(w=>w.querySelector(".vm-pick").checked).map(w=>w.dataset.id),y=()=>{const w=m().length;i.disabled=w===0,i.textContent=w?`Delete ${w} selected`:"Delete selected";const L=p().length;c.disabled=L===0,c.textContent=L?`Save ${L} change${L===1?"":"s"}`:"Save changes"};r.addEventListener("input",y),r.addEventListener("change",y);const f=async()=>{const w=await v.getBookmark(e.id);s=[...(w.bookmark||w).volumes||[]],d()},b=async(w,L)=>{try{await v.reorderVolume(e.id,w,L),a=!0,await f()}catch(T){h(`Could not move: ${T.message}`,"error")}},C=async w=>{const L=s.filter(N=>w.includes(N.id));if(L.length===0)return;const T=L.filter(N=>N.kind==="release").length,k=L.length===1?`“${L[0].name}”`:`${L.length} volumes`,I=T?` ${T===L.length?L.length===1?"Its":"Their":`${T} of them are releases; their`} pages are removed from disk.`:"";if(await ne(`Delete ${k}?${I}`,{danger:!0}))try{const N=await v.bulkDeleteVolumes(e.id,w);a=!0,h(`Deleted ${N.deleted} volume${N.deleted===1?"":"s"}`,"success"),await f()}catch(N){h(`Delete failed: ${N.message}`,"error")}};i.addEventListener("click",()=>C(m())),c.addEventListener("click",async()=>{const w=p();if(w.length===0)return;c.disabled=!0,c.textContent="Saving…";const L=[];for(const T of w)try{await v.updateVolume(e.id,T.id,T.patch),a=!0}catch(k){const I=s.find(N=>N.id===T.id);L.push(`${(I==null?void 0:I.name)||T.id}: ${k.message}`)}if(L.length?h(L.join(" · "),"error"):h(`Saved ${w.length} change${w.length===1?"":"s"}`,"success"),await f(),L.length){const T=r.querySelector("#vm-result");T&&(T.innerHTML=`<ul class="task-error-list">${L.map(ft).map(k=>`<li>${k}</li>`).join("")}</ul>`)}}),d()}const xt=50;let x={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1,mergeMode:!1,mergeSelection:new Set,mergeTargetTouched:!1,mergeTitleTouched:!1,offlineChapters:new Set,isAutoOffline:!1,volumesCollapsed:!1};const $n=e=>`volumes_collapsed_${e}`;function Ro(e){var s;const t=localStorage.getItem($n(e==null?void 0:e.id));return t!==null?t==="1":(((s=e==null?void 0:e.volumes)==null?void 0:s.length)||0)>8}function Do(e){if(!(e.autoCheck===!0))return`<button class="btn btn-secondary" id="schedule-btn">${g("alarm-clock")} Schedule</button>`;const s=e.checkSchedule==="weekly"?`${(e.checkDay||"monday").charAt(0).toUpperCase()+(e.checkDay||"monday").slice(1)} ${e.checkTime||"06:00"}`:e.checkSchedule==="daily"?`Daily ${e.checkTime||"06:00"}`:"Every 6h";return`<button class="btn btn-primary" id="schedule-btn">${g("alarm-clock")} ${s}</button>`}function No(e){const t=e.autoCheck===!0,s=e.checkSchedule||"daily",a=e.checkDay||"monday",n=e.checkTime||"06:00",r=e.autoDownload||!1;return`
    <div class="modal" id="schedule-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${g("alarm-clock")} Auto-Check Schedule</h2>
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
  `}function Ps(){var N;if(x.loading)return`
      ${ve()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const e=x.manga;if(!e)return`
      ${ve()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const t=e.alias||e.title,s=e.chapters||[],a=new Set(e.downloadedChapters||[]),n=new Set(e.readChapters||[]),r=new Set(s.map(E=>E.number)).size,i=new Set(e.excludedChapters||[]),c=new Set(e.deletedChapterUrls||[]),l=e.volumes||[],d=new Set;l.forEach(E=>{(E.chapters||[]).forEach($=>d.add($))});let u;x.filter==="hidden"?u=s.filter(E=>i.has(E.number)||c.has(E.url)):u=s.filter(E=>!i.has(E.number)&&!c.has(E.url));const p=u.filter(E=>!d.has(E.number));let m=[];if(x.activeVolume){const E=new Set(x.activeVolume.chapters||[]);m=u.filter($=>E.has($.number))}else m=p;const y=new Map;m.forEach(E=>{y.has(E.number)||y.set(E.number,[]),y.get(E.number).push(E)});let f=Array.from(y.entries()).sort((E,$)=>E[0]-$[0]);x.filter==="downloaded"?f=f.filter(([E])=>a.has(E)):x.filter==="not-downloaded"?f=f.filter(([E])=>!a.has(E)):x.filter==="main"?f=f.filter(([E])=>Number.isInteger(E)):x.filter==="extra"&&(f=f.filter(([E])=>!Number.isInteger(E)));const b=Math.max(1,Math.ceil(f.length/xt));x.currentPage>=b&&(x.currentPage=Math.max(0,b-1));const C=x.currentPage*xt,L=[...f.slice(C,C+xt)].reverse(),T=y.size,k=[...y.keys()].filter(E=>a.has(E)).length;n.size;let I="";if(x.activeVolume){const E=x.activeVolume;let $=null;E.local_cover?$=`/api/public/covers/${e.id}/${encodeURIComponent(E.local_cover.split(/[/\\]/).pop())}`:E.cover&&($=E.cover),I=`
      ${ve()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${$?`<img src="${$}" alt="${E.name}">`:be("book")}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${e.id}" class="text-muted" style="text-decoration:none;">← ${t}</a>
              </div>
              <h1>${Xe(E.name)}</h1>
              <div class="manga-detail-meta">
                ${E.kind==="release"?`<span class="meta-item">${E.source==="torrent"?"Torrent":"Archive"} release · ${E.pageCount} pages</span>${E.releaseName?`<span class="meta-item text-muted" title="${it(E.releaseName)}">${Xe(E.releaseName)}</span>`:""}`:""}
                <span class="meta-item">${T} Chapters</span>
                ${k>0?`<span class="meta-item downloaded">${k} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 ${E.kind==="release"?`<button class="btn btn-primary" id="read-volume-btn" data-vol-id="${E.id}">${g("play")} Read volume</button>`:""}
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${e.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${x.manageChapters?"Done Managing":`${g("plus")} Add Chapters`}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${E.id}">${g("pencil")} Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const E=e.localCover?`/api/public/covers/${e.id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover;I=`
        ${ve()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${E?`<img src="${E}" alt="${t}">`:be("book")}
              </div>
              <div class="manga-detail-info">
                <h1>${t}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${e.website||"Local"}</span>
                  <span class="meta-item" title="${r} distinct chapters across ${((N=e.chapters)==null?void 0:N.length)||0} version rows">${r} Chapters</span>
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
                    ${g("play")} ${e.lastReadChapter?"Continue":"Start"} Reading
                  </button>
              <button class="btn btn-secondary" id="download-all-btn">
                ${g("download")} Download All
              </button>
              <button class="btn btn-secondary" id="refresh-btn">${g("refresh-cw")} Refresh</button>
              ${e.website!=="Local"?`<button class="btn btn-secondary" id="quick-check-btn">${g("zap")} Quick Check</button>`:""}
              ${e.website==="Local"?`<button class="btn btn-secondary" id="scan-folder-btn">${g("folder")} Scan Folder</button>`:""}
              <button class="btn btn-secondary " id="auto-offline-btn" title="Auto-save new chapters offline for reading without internet">
                ${g("wifi-off")} Auto-Offline
              </button>
              <button class="btn btn-secondary" id="edit-btn">${g("pencil")} Edit</button>
              ${Z.canDownload?`<button class="btn btn-secondary" id="find-volumes-btn" title="Search the torrent indexers for volume releases of this title">${g("package")} Find volumes</button>`:""}
              ${Z.canDownload?`<button class="btn btn-secondary" id="import-folder-btn" title="Import a release that is already on disk (torrent folder), without downloading it again">${g("folder")} Import from folder</button>`:""}
              <button class="btn btn-secondary" id="anilist-track-btn" style="display:none;">${g("link")} Track</button>
              ${(e.volumes||[]).length===0?'<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>':""}
              ${Do(e)}
            </div>
            ${e.description?`<p class="manga-description">${e.description}</p>`:""}
            ${x.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">${g("package")} CBZ Files (${x.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${x.cbzFiles.map($=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${$.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${$.chapterNumber?`Chapter ${$.chapterNumber}`:"Unknown chapter"}
                        ${$.isExtracted?` | ${g("check")} Extracted`:""}
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
    ${I}
        
        ${x.activeVolume?x.manageChapters?Wo(e,p):"":Go(e,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${x.filter==="all"?"active":""}" data-filter="all">
                All (${y.size})
              </button>
              <button class="filter-btn ${x.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${k})
              </button>
              <button class="filter-btn ${x.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${x.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
              ${!x.activeVolume&&Z.canEdit?`
              <button class="filter-btn merge-mode-btn ${x.mergeMode?"active":""}" id="merge-mode-btn" title="Combine downloaded chapters into one, e.g. 12.1 + 12.2 + 12.3 into chapter 12">
                ${g("link")} Combine
              </button>`:""}
            </div>
          </div>

          ${x.mergeMode?jo(e):""}

          ${b>1?va(b):""}
          
          <div class="chapter-list">
            ${L.map(([E,$])=>zo(E,$,a,n,e)).join("")}
          </div>
          
          ${b>1?va(b):""}
        </div>
      ${Vo()}
    </div>
  `}function Fo(){const e=x.manga;if(!e)return"";const t=e.alias||e.title;return`
    <div class="modal" id="delete-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 420px;">
        <div class="modal-header">
          <h2>${g("trash-2")} Delete Manga</h2>
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
  `}function Oo(){const e=x.manga;return e?`
    <div class="modal" id="migrate-source-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
          <h2>${g("refresh-cw")} Change Source</h2>
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
              <button class="btn btn-secondary" id="migrate-search-btn">${g("search")} Search</button>
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
  `:""}function Uo(){const e=x.manga;return e?`
    <div class="modal" id="anilist-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h2>${g("link")} AniList Tracking</h2>
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
                <button class="btn btn-secondary" id="anilist-search-btn">${g("search")} Search</button>
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
  `:""}async function ts(){var s,a;const e=document.getElementById("anilist-track-btn"),t=x.manga;if(t)try{const n=await v.anilistStatus();if(!(n!=null&&n.configured)||!(n!=null&&n.connected)||((s=x.manga)==null?void 0:s.id)!==t.id){e&&(e.style.display="none");return}const{mapping:r}=await v.anilistGetMapping(t.id);if(((a=x.manga)==null?void 0:a.id)!==t.id)return;e&&(e.style.display="",e.style.borderColor=r?"var(--accent-primary)":"",e.innerHTML=r?`${g("check")} Tracked`:`${g("link")} Track`,e.title=r?`Linked to ${r.anilist_title}`:"Link this manga to AniList"),Ho(r,t)}catch(n){console.warn("Failed to load AniList state:",n),e&&(e.style.display="none")}}function Ho(e,t){var c,l,d,u;const s=document.getElementById("anilist-tracked-view"),a=document.getElementById("anilist-search-view");if(!s||!a)return;if(!e){s.style.display="none",s.innerHTML="",a.style.display="";return}a.style.display="none",s.style.display="",s.innerHTML=`
    <div style="margin-bottom: 12px;">
      <strong>${e.anilist_title}</strong>
      <div class="text-muted" style="font-size: 0.85em;">
        ${[e.media_format,e.chapters_total!=null?`${e.chapters_total} chapters`:null].filter(Boolean).join(" • ")}
      </div>
      ${e.last_pushed_progress!=null?`<div class="text-muted" style="font-size: 0.8em;">Last synced: ch. ${e.last_pushed_progress}</div>`:""}
    </div>
    <div class="anilist-progress" id="anilist-progress">
      <div class="text-muted" style="font-size: 0.85em;" id="anilist-progress-info">Loading progress…</div>
      <form class="anilist-progress-form" id="anilist-progress-form">
        <label for="anilist-progress-input">Set chapter</label>
        <input type="number" id="anilist-progress-input" min="0" step="1" placeholder="e.g. 120">
        <button type="submit" class="btn btn-small btn-primary">Save to AniList</button>
      </form>
      <div class="text-muted" style="font-size: 0.8em;">Read volumes or elsewhere? Set the chapter you are at; reading chapters here keeps syncing from there.</div>
    </div>
    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 12px;">
      <input type="checkbox" id="anilist-sync-toggle" ${e.sync_enabled==1?"checked":""}> Sync progress
    </label>
    <div style="display: flex; gap: 8px;">
      <button class="btn btn-small btn-secondary" id="anilist-relink-btn">Change</button>
      <button class="btn btn-small btn-danger" id="anilist-unlink-btn">Unlink</button>
    </div>
  `;const n=document.getElementById("anilist-progress-info"),r=document.getElementById("anilist-progress-input"),i=async()=>{try{const p=await v.anilistGetProgress(t.id),m=[`AniList: ${p.anilist!=null?`ch. ${p.anilist}`:"not on your list yet"}`,`read here: ${p.local?`ch. ${p.local}`:"nothing"}`,p.chaptersTotal?`of ${p.chaptersTotal}`:""].filter(Boolean);n.textContent=m.join(" · "),r&&!r.value&&(r.value=p.anilist??p.local??"")}catch(p){n.textContent=`Could not read progress: ${p.message}`}};i(),(c=document.getElementById("anilist-progress-form"))==null||c.addEventListener("submit",async p=>{p.preventDefault();const m=parseInt(r.value,10);if(!Number.isFinite(m)||m<0){h("Enter a chapter number","error");return}const y=p.currentTarget.querySelector("button");y.disabled=!0;try{const f=await v.anilistSetProgress(t.id,m);h(`AniList set to chapter ${f.progress}${f.markedReadUpTo?`; chapters up to ${f.markedReadUpTo} marked read here`:""}`,"success"),await i(),f.markedReadUpTo&&(await ee(t.id),W([t.id]))}catch(f){h("Failed to set progress: "+f.message,"error")}finally{y.disabled=!1}}),(l=document.getElementById("anilist-sync-toggle"))==null||l.addEventListener("change",async p=>{try{await v.anilistSetSyncEnabled(t.id,p.target.checked),h(p.target.checked?"AniList sync enabled":"AniList sync disabled","success")}catch(m){p.target.checked=!p.target.checked,h("Failed to update sync: "+m.message,"error")}}),(d=document.getElementById("anilist-relink-btn"))==null||d.addEventListener("click",()=>{s.style.display="none",a.style.display=""}),(u=document.getElementById("anilist-unlink-btn"))==null||u.addEventListener("click",async()=>{if(await ne(`Unlink "${e.anilist_title}" from AniList?`))try{await v.anilistUnmap(t.id),h("Unlinked from AniList","success"),ts()}catch(p){h("Failed to unlink: "+p.message,"error")}})}function Vo(){var t,s;const e=x.manga;return`
    ${e?No(e):""}
    ${yi()}
    ${Fo()}
    ${Oo()}
    ${Uo()}

    <!-- Edit Manga Modal -->
    <div class="modal" id="edit-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${g("pencil")} Edit Manga</h2>
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
          <button class="btn btn-danger" id="delete-manga-btn" style="margin-right:auto;">${g("trash-2")} Delete</button>
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
  `}function kn(e,t){if(t.length===0)return"";const s=Math.min(...t),a=Math.floor(s);return!(e.chapters||[]).some(r=>r.number===a)||t.includes(a)?a:s}function jo(e){const t=[...x.mergeSelection].sort((a,n)=>a-n),s=kn(e,t);return`
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
  `}function zo(e,t,s,a,n){var S,A,R,D,U,G,Y,re;const r=s.has(e),i=a.has(e),c=!Number.isInteger(e),l=((S=n.mergedChapters)==null?void 0:S[e])||null,d=((A=n.downloadedVersions)==null?void 0:A[e])||[],u=new Set(n.deletedChapterUrls||[]),p=t.filter(q=>x.filter==="hidden"?!0:!u.has(q.url)),m=!!x.activeVolume,y=n.chapterSettings||{},f=m?!0:!!((R=y[e])!=null&&R.locked);let b=p;if(m||f){const q=p.filter(Q=>Array.isArray(d)?d.includes(Q.url):d===Q.url);b=q.length>0?q:p}b.sort((q,Q)=>{const J=Array.isArray(d)?d.includes(q.url):d===q.url;return((Array.isArray(d)?d.includes(Q.url):d===Q.url)?1:0)-(J?1:0)});const C=((D=n.chapterFolders)==null?void 0:D[e])||[],w=C.filter(q=>!q.url),L=C.reduce((q,Q)=>Math.max(q,Q.imageCount),0),T=q=>q.imageCount<3||L>=6&&q.imageCount<L/2,k=q=>C.find(Q=>Q.url===q)||null,I=C.filter(q=>q.url&&T(q)),N=b.length>1||w.length>0,E=(U=b[0])!=null&&U.url?encodeURIComponent(b[0].url):null,$=["chapter-item",r?"downloaded":"",i?"read":"",c?"extra":""].filter(Boolean).join(" "),M=Array.isArray(d)?d:d?[d]:[],_=M.length,F=k((G=b[0])==null?void 0:G.url)||C.find(q=>q.url)||C[0]||null,V=F?F.imageCount:((Y=n.downloadedPageCounts)==null?void 0:Y[e])??null,X=r&&V!==null?`<button class="chapter-pages-pill ${F&&T(F)?"warn":""}" data-action="pages" data-num="${e}" ${F!=null&&F.url?`data-url="${encodeURIComponent(F.url)}"`:""} title="${V} pages - view and edit them">${g("images")} ${V}</button>`:"",z=N?`
    <div class="versions-dropdown hidden" id="versions-${e}">
      ${b.map(q=>{const Q=encodeURIComponent(q.url),J=M.includes(q.url),ae=q.url.startsWith("local://"),me=q.title&&q.title!==`Chapter ${e}`?q.title:"",He=me||q.releaseGroup||"Version",ht=[me&&q.releaseGroup?q.releaseGroup:"",Qo(q.uploadedAt)].filter(Boolean).join(" · ");return`
          <div class="version-row ${J?"downloaded":""}"
               data-version-url="${Q}" data-num="${e}">
            <span class="version-title" style="cursor: pointer; flex: 1;" title="${it(q.url)}">${Xe(He)}${ae?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}${ht?`<span class="version-meta">${Xe(ht)}</span>`:""}${(()=>{const Ge=J?k(q.url):null;if(!Ge)return"";const mt=T(Ge);return`<span class="version-meta version-pages ${mt?"warn":""}" title="${it(Ge.folder)}">${Ge.imageCount} pages${mt?" - incomplete?":""}</span>`})()}</span>
            <div class="version-actions">
              ${J?`<button class="btn-icon small success" data-action="read-version" data-num="${e}" data-url="${Q}">${g("play",{title:"Read"})}</button>
                   ${_>1?`<button class="btn-icon small" data-action="keep-version" data-num="${e}" data-url="${Q}" title="Keep only this version (delete the other ${_-1})">${g("check",{title:"Keep only this version"})}</button>`:""}
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${e}" data-url="${Q}">${g("trash-2",{title:"Delete version"})}</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${e}" data-url="${Q}">${g("download",{title:"Download"})}</button>`}
              ${u.has(q.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${e}" data-url="${Q}" title="Restore Version">${g("undo-2",{title:"Restore version"})}</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${e}" data-url="${Q}" title="Hide Version">${g("eye-off",{title:"Hide version"})}</button>`}
            </div>
          </div>
        `}).join("")}
      ${w.map(q=>`
          <div class="version-row orphan" data-num="${e}">
            <span class="version-title" title="${it(q.folder)}">Leftover folder on disk<span class="version-meta">${Xe(q.folder)} · ${q.imageCount} pages</span></span>
            <div class="version-actions">
              <button class="btn-icon small danger" data-action="delete-folder" data-num="${e}" data-folder="${encodeURIComponent(q.folder)}">${g("trash-2",{title:"Delete this folder from disk"})}</button>
            </div>
          </div>`).join("")}
    </div>
  `:"",te=(n.excludedChapters||[]).includes(e),O=x.mergeMode&&r&&!te&&!l;return`
    <div class="chapter-group" data-chapter="${e}">
      <div class="${$}" data-num="${e}" style="${te?"opacity: 0.7":""}">
        ${x.mergeMode?`<input type="checkbox" class="merge-pick" data-num="${e}" ${x.mergeSelection.has(e)?"checked":""} ${O?"":"disabled"} title="${O?"Combine this chapter":l?"Already a combined chapter":"Only downloaded chapters can be combined"}">`:""}
        <span class="chapter-number">Ch. ${e}</span>
        <span class="chapter-title">
          ${b[0]?b[0].title!==`Chapter ${e}`?b[0].title:"":t[0].title}
          ${te?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
          ${I.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="A downloaded version of this chapter has only ${I[0].imageCount} pages">${I[0].imageCount} pages</span>`:""}
          ${w.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="${w.length} folder(s) on disk not linked to any downloaded version - open the versions list to delete">${w.length} leftover folder${w.length>1?"s":""}</span>`:""}
        </span>
        ${l?`<span class="chapter-tag merged" title="Combined from ${l.sources.map(q=>`Ch. ${q}`).join(", ")}">Combined</span>`:c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${X}
          ${l&&!te?`<button class="btn-icon small" data-action="split-chapter" data-num="${e}" title="Split back into ${l.sources.map(q=>`Ch. ${q}`).join(", ")}">${g("scissors",{title:"Split"})}</button>`:""}
          ${te?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${e}" title="Restore Chapter">${g("undo-2",{title:"Restore chapter"})}</button>`:m?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${x.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${e}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${f?"locked":""}"
                        data-action="lock" data-num="${e}"
                        title="${f?"Unlock":"Lock"}">
                  ${f?g("lock",{title:"Locked"}):g("lock-open",{title:"Unlocked"})}
                </button>`}
          ${!te&&E?u.has((re=b[0])==null?void 0:re.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${e}" data-url="${E}" title="Unhide Chapter">${g("undo-2",{title:"Unhide chapter"})}</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${e}" data-url="${E}" title="Hide Chapter">${g("eye-off",{title:"Hide chapter"})}</button>`:""}
          <button class="btn-icon small ${i?"success":"muted"}"
                  data-action="read" data-num="${e}"
                  title="${i?"Mark unread":"Mark read"}">
            ${i?g("eye",{title:"Read"}):g("circle",{title:"Unread"})}
          </button>
          ${r?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${e}" data-url="${E}" title="Delete Files">${g("trash-2",{title:"Delete files"})}</button>
         <button class="btn-icon small ${x.offlineChapters.has(e)?"success":""}" data-action="offline-save" data-num="${e}" title="${x.offlineChapters.has(e)?"Remove offline copy":"Save for offline reading"}">
           ${x.offlineChapters.has(e)?g("wifi-off",{title:"Available offline"}):g("hard-drive",{title:"Save offline"})}
         </button>`:`<button class="btn-icon small ${r?"success":""}"
              data-action="download" data-num="${e}"
              title="${r?"Downloaded":"Download"}">
          ${r?g("check",{title:"Downloaded"}):g("download",{title:"Download"})}
        </button>`}
          ${N?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${e}" title="${p.length} versions, ${_} downloaded">
              ${_>1?`${_}/`:""}${p.length} ${g("chevron-down")}
            </button>
          `:""}
        </div>
      </div>
      ${z}
    </div>
  `}function Qo(e){if(!e)return"";const t=new Date(e);return isNaN(t.getTime())?String(e).slice(0,10):t.toISOString().slice(0,10)}function Xe(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function it(e){return Xe(e).replace(/"/g,"&quot;")}function va(e){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${x.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${x.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${x.currentPage+1} of ${e}</span>
      <button class="btn btn-icon" data-page="next" ${x.currentPage>=e-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${x.currentPage>=e-1?"disabled":""}>»</button>
    </div>
  `}function Wo(e,t){return t.length===0?`
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
  `}function Go(e,t){var i;const s=e.volumes||[];if(s.length===0)return"";const a=s.map(c=>{const l=c.chapters||[],d=l.filter(p=>t.has(p)).length,u=c.kind==="release";return`
      <div class="volume-card${u?" volume-release":""}" data-volume-id="${c.id}" title="${u?it(`Volume release · ${c.pageCount} pages${c.releaseName?` · ${c.releaseName}`:""}`):`${l.length} chapters`}">
        <div class="volume-cover">
          ${c.cover?`<img src="${c.cover}" alt="${it(c.name)}">`:be("book")}
          <div class="volume-badges">
            ${u?`<span class="badge badge-release">${c.pageCount} pages</span>${l.length?`<span class="badge badge-chapters">${l.length} ch</span>`:""}`:`<span class="badge badge-chapters">${l.length} ch</span>${d>0?`<span class="badge badge-downloaded">${d}</span>`:""}`}
          </div>
          ${u?`<button class="volume-read-btn" data-read-volume="${c.id}" title="Read this volume">${g("play",{title:"Read"})}</button>`:""}
        </div>
        <div class="volume-info">
          <div class="volume-name">${Xe(c.name)}</div>
          <div class="volume-kind">${u?`${c.source==="torrent"?"Torrent":"Archive"} release`:"Chapter collection"}</div>
        </div>
      </div>
    `}).join(""),n=x.volumesCollapsed,r=s.reduce((c,l)=>c+(l.chapters||[]).filter(d=>t.has(d)).length,0);return`
    <div class="volumes-section${n?" collapsed":""}">
      <div class="volumes-header">
        <button class="volumes-toggle" id="volumes-toggle-btn"
                aria-expanded="${!n}" aria-controls="volumes-grid"
                title="${n?"Expand volumes":"Collapse volumes"}">
          ${g(n?"chevron-down":"chevron-up")}
          <h2>Volumes</h2>
          <span class="volumes-count">${s.length}</span>
          ${n&&r>0?`<span class="badge badge-downloaded">${r} downloaded</span>`:""}
        </button>
        <div class="volumes-actions">
          <button class="btn btn-secondary btn-icon volumes-action-btn" id="manage-volumes-btn"
                  title="Manage volumes: rename, renumber, reorder or delete" aria-label="Manage volumes">${g("settings")}</button>
          <button class="btn btn-secondary btn-icon volumes-action-btn volumes-add-btn" id="add-volume-btn"
                  title="Add a volume" aria-label="Add volume">${g("circle-plus")}</button>
        </div>
      </div>
      <div class="volumes-grid" id="volumes-grid">
        ${a||(((i=e.chapters)==null?void 0:i.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function Ko(){var n,r,i,c,l,d,u,p,m,y,f,b,C,w,L,T,k,I,N,E,$,M,_,F,V,X,z,te,O;const e=document.getElementById("app"),t=x.manga;if(!t)return;(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>H.go("/")),(r=document.getElementById("back-library-btn"))==null||r.addEventListener("click",()=>H.go("/")),e.querySelectorAll(".artist-link").forEach(S=>{S.addEventListener("click",async A=>{A.preventDefault();const R=S.dataset.artist;if(!R)return;localStorage.setItem("library_search",R),localStorage.removeItem("library_artist_filter");let D=null;try{const U=t.website;if(U&&U!=="Local"){const Y=(window._scrapersList||(window._scrapersList=(await v.get("/scrapers/list")).scrapers)||[]).find(re=>re.name===U);Y&&Y.supportsBrowse&&(D=U)}}catch{}D?(localStorage.setItem("library_search_author",R),localStorage.setItem("library_search_author_source",D)):(localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source")),H.go("/")})}),(i=document.getElementById("continue-btn"))==null||i.addEventListener("click",()=>{dn(t.id)}),(c=document.getElementById("download-all-btn"))==null||c.addEventListener("click",()=>{const S=document.getElementById("download-all-modal");S&&S.classList.add("open")}),(l=document.getElementById("confirm-download-all-btn"))==null||l.addEventListener("click",async()=>{var S;try{h("Queueing downloads...","info");const A=document.getElementsByName("download-version-mode");let R="single";for(const U of A)U.checked&&(R=U.value);(S=document.getElementById("download-all-modal"))==null||S.classList.remove("open");const D=await v.post(`/bookmarks/${t.id}/download`,{all:!0,versionMode:R});D.chaptersCount>0?h(`Download queued: ${D.chaptersCount} versions`,"success"):h("Already have these chapters downloaded","info")}catch(A){h("Failed to download: "+A.message,"error")}}),(d=document.getElementById("check-updates-btn"))==null||d.addEventListener("click",async()=>{try{h("Checking for updates...","info"),await v.post(`/bookmarks/${t.id}/quick-check`),h("Check complete!","success")}catch(S){h("Check failed: "+S.message,"error")}}),(u=document.getElementById("schedule-btn"))==null||u.addEventListener("click",()=>{const S=document.getElementById("schedule-modal");S&&S.classList.add("open")}),(p=document.getElementById("schedule-type"))==null||p.addEventListener("change",S=>{const A=document.getElementById("schedule-day-group");A&&(A.style.display=S.target.value==="weekly"?"":"none")}),(m=document.getElementById("save-schedule-btn"))==null||m.addEventListener("click",async()=>{var S;try{const A=document.getElementById("schedule-type").value,R=document.getElementById("schedule-day").value,D=document.getElementById("schedule-time").value,U=document.getElementById("auto-download-toggle").checked;await v.updateAutoCheckSchedule(t.id,{enabled:!0,schedule:A,day:R,time:D,autoDownload:U}),x.manga.checkSchedule=A,x.manga.checkDay=R,x.manga.checkTime=D,x.manga.autoDownload=U,(S=document.getElementById("schedule-modal"))==null||S.classList.remove("open"),W([t.id]),h("Schedule updated","success")}catch(A){h("Failed to save schedule: "+A.message,"error")}}),(y=document.getElementById("disable-schedule-btn"))==null||y.addEventListener("click",async()=>{var S;try{await v.toggleAutoCheck(t.id,!1),x.manga.autoCheck=!1,x.manga.checkSchedule=null,x.manga.checkDay=null,x.manga.checkTime=null,x.manga.nextCheck=null,(S=document.getElementById("schedule-modal"))==null||S.classList.remove("open"),W([t.id]),h("Auto-check disabled","success")}catch(A){h("Failed to disable: "+A.message,"error")}}),(f=document.getElementById("refresh-btn"))==null||f.addEventListener("click",async()=>{const S=document.getElementById("refresh-btn");try{S.disabled=!0,S.innerHTML=`${g("loader",{spin:!0})} Checking...`,h("Checking for updates...","info"),await v.post(`/bookmarks/${t.id}/check`),await ee(t.id),W([t.id]),h("Check complete!","success")}catch(A){h("Check failed: "+A.message,"error"),S&&(S.disabled=!1,S.innerHTML=`${g("refresh-cw")} Refresh`)}}),(b=document.getElementById("scan-folder-btn"))==null||b.addEventListener("click",async()=>{var A,R;const S=document.getElementById("scan-folder-btn");try{S.disabled=!0,S.innerHTML=`${g("loader",{spin:!0})} Scanning...`,h("Scanning folder...","info");const D=await v.scanBookmark(t.id);await ee(t.id),W([t.id]);const U=((A=D.addedChapters)==null?void 0:A.length)||0,G=((R=D.removedChapters)==null?void 0:R.length)||0;U>0||G>0?h(`Scan complete: ${U} added, ${G} removed`,"success"):h("Scan complete: No changes","info")}catch(D){h("Scan failed: "+D.message,"error")}finally{S&&(S.disabled=!1,S.innerHTML=`${g("folder")} Scan Folder`)}}),document.querySelectorAll("[data-cbz-path]").forEach(S=>{S.addEventListener("click",async()=>{const A=decodeURIComponent(S.dataset.cbzPath),R=parseInt(S.dataset.cbzChapter)||1,D=S.dataset.cbzExtracted==="true",U=await Va("Chapter number for the extracted pages",{value:String(R),type:"number"});if(!U)return;const G=parseFloat(U);if(isNaN(G)){h("Invalid chapter number","error");return}try{S.disabled=!0,S.textContent="Extracting...",h("Extracting CBZ...","info"),await v.extractCbz(t.id,A,G,{forceReExtract:D}),h("CBZ extracted successfully!","success"),await ee(t.id),W([t.id])}catch(Y){h("Extract failed: "+Y.message,"error")}finally{S.disabled=!1,S.textContent=D?"Re-Extract":"Extract"}})}),(C=document.getElementById("edit-btn"))==null||C.addEventListener("click",async()=>{const S=document.getElementById("edit-manga-modal");if(S){document.getElementById("edit-alias-input").value=t.alias||"",window._selectedCoverPath=null;try{const[A,R]=await Promise.all([v.getAllArtists(),v.getAllCategories()]),D=document.getElementById("artist-list"),U=document.getElementById("category-list");window._allArtists=A,window._allCategories=R,D&&(D.innerHTML=A.map(re=>`<option value="${re}">`).join("")),U&&(U.innerHTML=R.map(re=>`<option value="${re}">`).join(""));const G=document.getElementById("edit-artist-input"),Y=document.getElementById("edit-categories-input");G==null||G.addEventListener("input",()=>{const re=G.value.toLowerCase(),q=G.value.lastIndexOf(","),Q=G.value.substring(q+1).trim().toLowerCase();if(Q.length>0&&window._allArtists){const J=window._allArtists.filter(ae=>ae.toLowerCase().includes(Q));if(D&&J.length>0){const ae=q>=0?G.value.substring(0,q+1)+" ":"";D.innerHTML=J.map(me=>`<option value="${ae}${me}">`).join("")}}}),Y==null||Y.addEventListener("input",()=>{const re=Y.value.lastIndexOf(","),q=Y.value.substring(re+1).trim().toLowerCase();if(q.length>0&&window._allCategories){const Q=window._allCategories.filter(J=>J.toLowerCase().includes(q));if(U&&Q.length>0){const J=re>=0?Y.value.substring(0,re+1)+" ":"";U.innerHTML=Q.map(ae=>`<option value="${J}${ae}">`).join("")}}})}catch(A){console.error("Failed to load artists/categories:",A)}S.classList.add("open")}}),(w=document.getElementById("save-manga-btn"))==null||w.addEventListener("click",async()=>{var S;try{const A=document.getElementById("edit-alias-input").value.trim(),R=document.getElementById("edit-artist-input").value.trim(),D=document.getElementById("edit-categories-input").value.trim(),U=R?R.split(",").map(Y=>Y.trim()).filter(Y=>Y):[],G=D?D.split(",").map(Y=>Y.trim()).filter(Y=>Y):[];await v.updateBookmark(t.id,{alias:A||null}),await v.setBookmarkArtists(t.id,U),await v.setBookmarkCategories(t.id,G),window._selectedCoverPath&&await v.setBookmarkCoverFromImage(t.id,window._selectedCoverPath),x.manga.alias=A||null,x.manga.artists=U,x.manga.categories=G,(S=document.getElementById("edit-manga-modal"))==null||S.classList.remove("open"),W([t.id]),h("Manga updated","success")}catch(A){h("Failed to update: "+A.message,"error")}}),(L=document.getElementById("change-cover-btn"))==null||L.addEventListener("click",async()=>{try{h("Loading images...","info");const S=await v.getFolderImages(t.id);if(S.length===0){h("No images found in manga folder","warning");return}const A=document.createElement("div");A.id="cover-select-modal",A.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",A.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${S.slice(0,50).map(R=>`
              <div class="cover-option" data-path="${R.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(R.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${S.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${S.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(A),document.getElementById("close-cover-modal").addEventListener("click",()=>A.remove()),A.addEventListener("click",R=>{R.target===A&&A.remove()}),A.querySelectorAll(".cover-option").forEach(R=>{R.addEventListener("click",()=>{window._selectedCoverPath=R.dataset.path;const D=document.getElementById("cover-preview");D&&(D.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),A.remove(),h("Cover selected","success")})})}catch(S){h("Failed to load images: "+S.message,"error")}}),(T=document.getElementById("delete-manga-btn"))==null||T.addEventListener("click",()=>{const S=document.getElementById("delete-manga-modal");S&&S.classList.add("open")}),(k=document.getElementById("confirm-delete-manga-btn"))==null||k.addEventListener("click",async()=>{var A,R;const S=((A=document.getElementById("delete-files-toggle"))==null?void 0:A.checked)||!1;try{await v.deleteBookmark(t.id,S),(R=document.getElementById("delete-manga-modal"))==null||R.classList.remove("open"),h("Manga deleted","success"),H.go("/")}catch(D){h("Failed to delete: "+D.message,"error")}}),(I=document.getElementById("quick-check-btn"))==null||I.addEventListener("click",async()=>{const S=document.getElementById("quick-check-btn");try{S.disabled=!0,S.innerHTML=`${g("loader",{spin:!0})} Checking...`,h("Quick checking for updates...","info");const A=await v.post(`/bookmarks/${t.id}/quick-check`);await ee(t.id),W([t.id]),A.newChaptersCount>0?h(`Found ${A.newChaptersCount} new chapter(s)!`,"success"):h("No new chapters found","info")}catch(A){h("Quick check failed: "+A.message,"error")}finally{S&&(S.disabled=!1,S.innerHTML=`${g("zap")} Quick Check`)}}),(N=document.getElementById("source-label"))==null||N.addEventListener("click",async()=>{const S=document.getElementById("migrate-source-modal");if(S){S.classList.add("open");const A=document.getElementById("migrate-search-scraper");if(A&&A.options.length<=1)try{const R=await v.get("/scrapers/list");if(R.success){const D=R.scrapers.filter(U=>U.supportsSearch);A.innerHTML='<option value="all">All Sources</option>'+D.map(U=>`<option value="${U.name}">${U.name}</option>`).join(""),A.value="all"}}catch(R){console.warn("Failed to load scrapers:",R)}}});const s=async()=>{var G,Y,re;const S=(Y=(G=document.getElementById("migrate-search-input"))==null?void 0:G.value)==null?void 0:Y.trim(),A=(re=document.getElementById("migrate-search-scraper"))==null?void 0:re.value;if(!S)return;const R=document.getElementById("migrate-search-loading"),D=document.getElementById("migrate-search-results"),U=document.getElementById("migrate-results-grid");R.style.display="block",D.style.display="none";try{const Q=(await v.get(`/scrapers/search?q=${encodeURIComponent(S)}&scraper=${encodeURIComponent(A)}`)).results||[];Q.length===0?U.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(U.innerHTML=Q.map(J=>{var me;const ae=(me=J.cover)!=null&&me.startsWith("/covers/")?J.cover:J.cover?`/api/scrapers/proxy-cover?url=${encodeURIComponent(J.cover)}`:"";return`
            <div class="manga-card migrate-result-card" data-url="${J.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${ae?Me(ae,"Cover",{kind:"series",self:!0}):be("series")}
                ${J.chapterCount?`<div class="manga-card-badges"><span class="badge badge-chapters">${J.chapterCount} ch</span></div>`:""}
              </div>
              <div class="manga-card-title" title="${J.title}" style="font-size: 0.8rem; padding: 4px;">${J.title}</div>
            </div>
          `}).join(""),U.querySelectorAll(".migrate-result-card").forEach(J=>{J.addEventListener("click",()=>{var me;const ae=J.dataset.url;document.getElementById("migrate-url-input").value=ae,U.querySelectorAll(".migrate-result-card").forEach(He=>He.style.outline=""),J.style.outline="2px solid var(--color-primary)",h(`Selected: ${(me=J.querySelector(".manga-card-title"))==null?void 0:me.textContent}`,"info")})})),R.style.display="none",D.style.display="block"}catch(q){R.style.display="none",h("Search failed: "+q.message,"error")}};(E=document.getElementById("migrate-search-btn"))==null||E.addEventListener("click",s),($=document.getElementById("migrate-search-input"))==null||$.addEventListener("keydown",S=>{S.key==="Enter"&&s()}),(M=document.getElementById("confirm-migrate-btn"))==null||M.addEventListener("click",async()=>{var R,D,U;const S=(D=(R=document.getElementById("migrate-url-input"))==null?void 0:R.value)==null?void 0:D.trim();if(!S){h("Please enter a URL","warning");return}const A=document.getElementById("confirm-migrate-btn");try{A.disabled=!0,A.textContent="Migrating...",h("Migrating source...","info");const G=await v.migrateSource(t.id,S);h(`Migrated! ${G.migratedChapters} chapters preserved as local`,"success"),h("Running full check on new source...","info"),await v.post(`/bookmarks/${t.id}/check`),(U=document.getElementById("migrate-source-modal"))==null||U.classList.remove("open"),await ee(t.id),W([t.id]),h("Source migration complete!","success")}catch(G){h("Migration failed: "+G.message,"error")}finally{A&&(A.disabled=!1,A.textContent="Migrate Source")}}),(_=document.getElementById("anilist-track-btn"))==null||_.addEventListener("click",()=>{var S;(S=document.getElementById("anilist-modal"))==null||S.classList.add("open"),ts()});const a=async()=>{var U,G;const S=(G=(U=document.getElementById("anilist-search-input"))==null?void 0:U.value)==null?void 0:G.trim();if(!S)return;const A=document.getElementById("anilist-search-loading"),R=document.getElementById("anilist-search-results"),D=document.getElementById("anilist-results-list");A.style.display="block",R.style.display="none";try{const re=(await v.anilistSearch(S)).results||[];re.length===0?D.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(D.innerHTML=re.map(q=>{var ae,me,He,ht,Ge,mt,na;const Q=((ae=q.title)==null?void 0:ae.romaji)||((me=q.title)==null?void 0:me.english)||((He=q.title)==null?void 0:He.native)||"Unknown",J=(ht=q.title)!=null&&ht.english&&q.title.english!==Q?q.title.english:(Ge=q.title)!=null&&Ge.native&&q.title.native!==Q?q.title.native:"";return`
            <div style="display: flex; gap: 10px; align-items: center; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 8px;">
              ${(mt=q.coverImage)!=null&&mt.medium?`<img src="${q.coverImage.medium}" alt="" style="width: 48px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">`:""}
              <div style="flex: 1; min-width: 0;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${Q}"><strong>${Q}</strong></div>
                <div class="text-muted" style="font-size: 0.8em;">
                  ${[J,q.format,(na=q.startDate)==null?void 0:na.year,`${q.chapters??"?"} ch`].filter(Boolean).join(" • ")}
                </div>
              </div>
              <button class="btn btn-small btn-primary anilist-link-result-btn" data-id="${q.id}" data-title="${Q.replace(/"/g,"&quot;")}">Link</button>
            </div>
          `}).join(""),D.querySelectorAll(".anilist-link-result-btn").forEach(q=>{q.addEventListener("click",async()=>{var Q,J;try{q.disabled=!0,q.textContent="Linking...";const ae=await v.anilistMap(t.id,Number(q.dataset.id)),me=((Q=ae.mapping)==null?void 0:Q.anilist_title)||q.dataset.title,He=(J=ae.pull)!=null&&J.markedUpTo?` — pulled progress up to ch. ${ae.pull.markedUpTo}`:"";h(`Linked to AniList: ${me}${He}`,"success"),ts()}catch(ae){q.disabled=!1,q.textContent="Link",h("Failed to link: "+ae.message,"error")}})})),A.style.display="none",R.style.display="block"}catch(Y){A.style.display="none",h("AniList search failed: "+Y.message,"error")}};(F=document.getElementById("anilist-search-btn"))==null||F.addEventListener("click",a),(V=document.getElementById("anilist-search-input"))==null||V.addEventListener("keydown",S=>{S.key==="Enter"&&a()}),e.querySelectorAll(".filter-btn[data-filter]").forEach(S=>{S.addEventListener("click",()=>{x.filter=S.dataset.filter,x.currentPage=0,W([t.id])})}),hi(e,t),e.querySelectorAll("[data-page]").forEach(S=>{S.addEventListener("click",()=>{const A=S.dataset.page,R=Math.ceil(x.manga.chapters.length/xt);switch(A){case"first":x.currentPage=0;break;case"prev":x.currentPage=Math.max(0,x.currentPage-1);break;case"next":x.currentPage=Math.min(R-1,x.currentPage+1);break;case"last":x.currentPage=R-1;break}W([t.id])})}),e.querySelectorAll(".chapter-item").forEach(S=>{S.addEventListener("click",A=>{var U;if(A.target.closest(".chapter-actions"))return;const R=parseFloat(S.dataset.num);if((t.downloadedChapters||[]).includes(R)){const G=((U=t.downloadedVersions)==null?void 0:U[R])||[],Y=Array.isArray(G)?G[0]:G;Y?H.go(`/read/${t.id}/${R}?version=${encodeURIComponent(Y)}`):H.go(`/read/${t.id}/${R}`)}else h("Chapter not downloaded","info")})}),e.querySelectorAll("[data-action]").forEach(S=>{S.addEventListener("click",async A=>{var G;A.stopPropagation();const R=S.dataset.action,D=parseFloat(S.dataset.num),U=S.dataset.url?decodeURIComponent(S.dataset.url):null;switch(R){case"lock":await Yo(D);break;case"read":await ei(D);break;case"download":await ti(D);break;case"versions":si(D);break;case"pages":{const Y=t.chapters.filter(q=>q.number===D),re=q=>{const Q=Y.find(ae=>ae.url===q);return Q&&((Q.title&&Q.title!==`Chapter ${D}`?Q.title:"")||Q.releaseGroup)||null};Mo({mangaId:t.id,num:D,title:re(U)||"",versions:(((G=t.chapterFolders)==null?void 0:G[D])||[]).map(q=>({...q,label:re(q.url)})),versionUrl:U,onChanged:async()=>{await ee(t.id),W([t.id])}});break}case"read-version":H.go(`/read/${t.id}/${D}?version=${encodeURIComponent(U)}`);break;case"download-version":await ri(D,U);break;case"delete-version":await oi(D,U);break;case"keep-version":await ni(D,U);break;case"delete-folder":await ai(D,decodeURIComponent(S.dataset.folder||""));break;case"hide-version":await ii(D,U);break;case"restore-version":await li(D,U);break;case"restore-chapter":await ci(D);break;case"delete-chapter":await di(D,U);break;case"hide-chapter":await ui(D,U);break;case"unhide-chapter":await pi(D,U);break;case"split-chapter":await gi(D);break}})}),e.querySelectorAll('[data-action="read"], [data-action="hide-chapter"], [data-action="delete-chapter"]').forEach(S=>{Xo(S,()=>Zo(S.dataset.action,parseFloat(S.dataset.num)))}),e.querySelectorAll(".version-row .version-title").forEach(S=>{S.addEventListener("click",A=>{A.stopPropagation();const R=S.closest(".version-row"),D=parseFloat(R.dataset.num),U=R.dataset.versionUrl?decodeURIComponent(R.dataset.versionUrl):null;R.classList.contains("downloaded")&&U?H.go(`/read/${t.id}/${D}?version=${encodeURIComponent(U)}`):h("Version not downloaded yet","info")})}),e.querySelectorAll(".volume-card").forEach(S=>{S.addEventListener("click",()=>{const A=S.dataset.volumeId;H.go(`/manga/${t.id}/volume/${A}`)})}),e.querySelectorAll("[data-read-volume]").forEach(S=>{S.addEventListener("click",A=>{A.stopPropagation(),H.go(`/read/${t.id}/volume/${S.dataset.readVolume}`)})}),(X=e.querySelector("#read-volume-btn"))==null||X.addEventListener("click",S=>{H.go(`/read/${t.id}/volume/${S.currentTarget.dataset.volId}`)}),(z=e.querySelector("#import-folder-btn"))==null||z.addEventListener("click",()=>{_o({bookmarkId:t.id,bookmarkTitle:t.alias||t.title,onImported:async()=>{await ee(t.id),W([t.id])}})}),(te=e.querySelector("#find-volumes-btn"))==null||te.addEventListener("click",()=>{hn({query:t.alias||t.title,bookmarkId:t.id,bookmarkTitle:t.alias||t.title})}),(O=e.querySelector("#manage-volumes-btn"))==null||O.addEventListener("click",()=>{Po(t,{onChanged:async()=>{await ee(t.id),W([t.id])}})}),bi(e),Ue(),se.subscribeToManga(t.id)}async function Yo(e){var n;const t=x.manga,s=((n=t.chapterSettings)==null?void 0:n[e])||{},a=!s.locked;try{a?await v.lockChapter(t.id,e):await v.unlockChapter(t.id,e),t.chapterSettings||(t.chapterSettings={}),t.chapterSettings[e]={...s,locked:a},h(a?"Chapter locked":"Chapter unlocked","success"),W([t.id])}catch(r){h("Failed: "+r.message,"error")}}const Jo=550;function Xo(e,t){let s=null,a=!1;const n=()=>{clearTimeout(s),s=null,e.classList.remove("pressing")};e.addEventListener("pointerdown",r=>{r.button!==void 0&&r.button!==0||(a=!1,n(),e.classList.add("pressing"),s=setTimeout(()=>{a=!0,e.classList.remove("pressing"),t()},Jo))}),e.addEventListener("pointerup",n),e.addEventListener("pointerleave",n),e.addEventListener("pointercancel",n),e.addEventListener("contextmenu",r=>r.preventDefault()),e.addEventListener("click",r=>{a&&(a=!1,r.preventDefault(),r.stopImmediatePropagation())},!0)}async function Zo(e,t){const s=x.manga;if(!s||!Number.isFinite(t))return;const a=`chapter ${t}`,n=(r,i)=>`${r} ${i}${r===1?"":"s"}`;try{if(e==="read"){if(!await ne(`Mark every chapter up to ${a} as read?`))return;await v.markChaptersReadUpTo(s.id,t),h(`Marked read up to ${a}`,"success")}else if(e==="hide-chapter"){if(!await ne(`Hide every chapter up to ${a}? Their downloaded files are removed too. Locked chapters and chapters in a volume stay.`,{danger:!0}))return;const r=await v.bulkHideChapters(s.id,t);h(`Hid ${n(r.hidden,"chapter version")}${r.skipped?`, ${r.skipped} protected`:""}`,"success")}else if(e==="delete-chapter"){const r=await ne(`Delete the downloaded files of every chapter up to ${a}? Locked chapters stay.`,{danger:!0,option:`Also hide those chapters, up to ${a}`});if(!r.ok)return;const i=r.option,c=await v.bulkDeleteChapters(s.id,t,i);h(`Deleted ${n(c.deleted,"chapter")}${i?`, hid ${c.hidden}`:""}${c.skipped?`, ${c.skipped} skipped`:""}`,"success")}else return;await ee(s.id),W([s.id])}catch(r){h("Failed: "+r.message,"error")}}async function ei(e){const t=x.manga,s=new Set(t.readChapters||[]),a=s.has(e);try{await v.post(`/bookmarks/${t.id}/chapters/${e}/read`,{isRead:!a}),a?s.delete(e):s.add(e),t.readChapters=[...s],h(a?"Marked unread":"Marked read","success"),W([t.id])}catch(n){h("Failed: "+n.message,"error")}}async function ti(e){const t=x.manga,s=new Set(t.deletedChapterUrls||[]),a=(t.chapters||[]).find(n=>n.number===e&&!s.has(n.url));try{h(`Downloading chapter ${e}...`,"info");let n;a?n=await v.post(`/bookmarks/${t.id}/download-version`,{chapterNumber:e,url:a.url}):n=await v.post(`/bookmarks/${t.id}/download`,{chapters:[e]}),h("Download queued!","success"),En(n==null?void 0:n.taskId,`Chapter ${e}`)}catch(n){h("Failed: "+n.message,"error")}}function si(e){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${e}`&&s.classList.add("hidden")});const t=document.getElementById(`versions-${e}`);t&&t.classList.toggle("hidden")}async function ai(e,t){const s=x.manga;if(t&&await ne(`Delete the folder "${t}" from disk?`,{danger:!0}))try{await v.deleteChapterFolder(s.id,e,t),h("Folder deleted","success"),await ee(s.id),W([s.id])}catch(a){h("Failed: "+a.message,"error")}}function En(e,t){var r;if(!e)return;const s=(r=x.manga)==null?void 0:r.id,a=Date.now(),n=async()=>{var u,p;if(Date.now()-a>30*60*1e3)return;let i;try{i=await v.getDownloadProgress(e)}catch{return}if(!i)return;if(!["complete","error","cancelled"].includes(i.status)){setTimeout(n,3e3);return}const l=i.errors||[],d=(i.completedChapters||[]).length>0&&i.status!=="error";i.status==="cancelled"?h(`${t}: download cancelled`,"info"):d?l.length?h(`${t} downloaded with problems: ${l[0].error}`,"warning"):h(`${t} downloaded${i.pages?` (${i.pages} pages)`:""}`,"success"):h(`${t} failed: ${((u=l[0])==null?void 0:u.error)||"unknown error"}`,"error"),((p=x.manga)==null?void 0:p.id)===s&&window.location.hash.startsWith(`#/manga/${s}`)&&(await ee(s),W([s]))};setTimeout(n,3e3)}async function ni(e,t){var c;const s=x.manga,a=((c=s.downloadedVersions)==null?void 0:c[e])||[],r=(Array.isArray(a)?a:[a]).filter(l=>l&&l!==t);if(r.length===0){h("This is the only downloaded version","info");return}if(!await ne(`Delete the other ${r.length} downloaded version${r.length>1?"s":""} of chapter ${e}?`,{danger:!0}))return;let i=0;for(const l of r)try{await v.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:l})})}catch(d){i++,h("Failed to delete a version: "+d.message,"error")}i===0&&h("Other versions deleted","success"),await ee(s.id),W([s.id])}async function ri(e,t){const s=x.manga;try{h("Downloading version...","info");const a=await v.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:e,url:t});h("Download queued!","success"),En(a==null?void 0:a.taskId,`Chapter ${e}`)}catch(a){h("Failed: "+a.message,"error")}}async function oi(e,t){const s=x.manga;try{await v.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:t})}),h("Version deleted","success"),await ee(s.id),W([s.id])}catch(a){h("Failed: "+a.message,"error")}}async function ii(e,t){const s=x.manga;try{await v.hideVersion(s.id,e,t),h("Version hidden","success"),await ee(s.id),W([s.id])}catch(a){h("Failed: "+a.message,"error")}}async function li(e,t){const s=x.manga;try{await v.unhideVersion(s.id,e,t),h("Version restored","success"),await ee(s.id),W([s.id])}catch(a){h("Failed to restore version: "+a.message,"error")}}async function ci(e){const t=x.manga;try{await v.unexcludeChapter(t.id,e),h("Chapter restored","success"),await ee(t.id),W([t.id])}catch(s){h("Failed to restore chapter: "+s.message,"error")}}async function di(e,t){const s=x.manga;if(await ne("Delete this chapter's files from disk?",{danger:!0}))try{await v.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:t})}),h("Chapter files deleted","success"),await ee(s.id),W([s.id])}catch(a){h("Failed to delete: "+a.message,"error")}}async function ui(e,t){const s=x.manga;if(await ne("Hide this chapter? It will be moved to the Hidden filter."))try{await v.hideVersion(s.id,e,t),h("Chapter hidden","success"),await ee(s.id),W([s.id])}catch(a){h("Failed to hide chapter: "+a.message,"error")}}async function pi(e,t){const s=x.manga;try{await v.unhideVersion(s.id,e,t),h("Chapter unhidden","success"),await ee(s.id),W([s.id])}catch(a){h("Failed to unhide chapter: "+a.message,"error")}}function hi(e,t){var r,i;const s=e.querySelector("#merge-mode-btn");if(s&&s.addEventListener("click",()=>{x.mergeMode=!x.mergeMode,x.mergeSelection=new Set,x.mergeTargetTouched=!1,x.mergeTitleTouched=!1,W([t.id])}),!x.mergeMode)return;e.querySelectorAll(".merge-pick").forEach(c=>{c.addEventListener("click",l=>l.stopPropagation()),c.addEventListener("change",l=>{l.stopPropagation();const d=parseFloat(c.dataset.num);c.checked?x.mergeSelection.add(d):x.mergeSelection.delete(d),mi(t)})});const a=e.querySelector("#merge-target"),n=e.querySelector("#merge-title");a==null||a.addEventListener("input",()=>{x.mergeTargetTouched=!0,!x.mergeTitleTouched&&n&&(n.value=a.value!==""?`Chapter ${a.value}`:"")}),n==null||n.addEventListener("input",()=>{x.mergeTitleTouched=!0}),(r=e.querySelector("#merge-cancel"))==null||r.addEventListener("click",()=>{x.mergeMode=!1,x.mergeSelection=new Set,W([t.id])}),(i=e.querySelector("#merge-submit"))==null||i.addEventListener("click",async()=>{var m;const c=[...x.mergeSelection].sort((y,f)=>y-f),l=parseFloat(a==null?void 0:a.value);if(c.length===0)return h("Tick the chapters to combine first","info");if(!Number.isFinite(l))return h("Give the combined chapter a number","error");const d=(n==null?void 0:n.value.trim())||`Chapter ${l}`,u=!!((m=e.querySelector("#merge-delete-sources"))!=null&&m.checked);if(u&&!await ne(`Remove the original folders of ${c.map(y=>`Ch. ${y}`).join(", ")} after combining? Splitting later will need them downloaded again.`,{danger:!0}))return;const p=e.querySelector("#merge-submit");p.disabled=!0,p.textContent="Combining…";try{const y=await v.mergeChapters(t.id,{sources:c,target:l,title:d,deleteSources:u});h(`Chapter ${y.target}: ${y.pageCount} pages from ${c.length} chapter${c.length===1?"":"s"}`,"success"),x.mergeMode=!1,x.mergeSelection=new Set,await ee(t.id),W([t.id])}catch(y){h("Combine failed: "+y.message,"error"),p.disabled=!1,p.textContent="Combine"}})}function mi(e){const t=[...x.mergeSelection].sort((c,l)=>c-l),s=document.getElementById("merge-picked");s&&(s.textContent=t.length?`Picked in page order: ${t.map(c=>`Ch. ${c}`).join(", ")}`:"Tick the downloaded chapters to combine (pages follow chapter order).");const a=document.getElementById("merge-submit");a&&(a.disabled=t.length===0);const n=kn(e,t),r=document.getElementById("merge-target"),i=document.getElementById("merge-title");r&&!x.mergeTargetTouched&&(r.value=n),i&&!x.mergeTitleTouched&&(i.value=n!==""?`Chapter ${n}`:"")}async function gi(e){var r;const t=x.manga,s=(r=t==null?void 0:t.mergedChapters)==null?void 0:r[e];if(!s)return;const a=s.sources.map(i=>`Ch. ${i}`).join(", "),n=s.sources.includes(e)?` Chapter ${e}'s own pages were folded into the combined folder, so it will need downloading again.`:"";if(await ne(`Split chapter ${e} back into ${a}? The combined folder is deleted; the other originals come back as they are on disk.${n}`,{danger:!0}))try{await v.unmergeChapter(t.id,e),h(`Chapter ${e} split into ${a}`,"success"),await ee(t.id),W([t.id])}catch(i){h("Split failed: "+i.message,"error")}}async function ee(e){try{const[t,s]=await Promise.all([v.getBookmark(e),Z.isDemo?Promise.resolve([]):$e.loadCategories()]);if(x.manga=t,x.categories=s,x.loading=!1,x.volumesCollapsed=Ro(t),t.website==="Local")try{const r=await v.getCbzFiles(e);x.cbzFiles=r||[]}catch(r){console.error("Failed to load CBZ files:",r),x.cbzFiles=[]}else x.cbzFiles=[];const a=new Set((t.chapters||[]).map(r=>r.number)).size,n=Math.ceil(a/xt);x.currentPage=Math.max(0,n-1),x.activeVolumeId?x.activeVolume=(t.volumes||[]).find(r=>r.id===x.activeVolumeId):x.activeVolume=null}catch{h("Failed to load manga","error"),x.loading=!1}}async function W(e=[]){const[t,s,a]=e;if(!t){H.go("/");return}x.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!x.manga||x.manga.id!==t?(x.loading=!0,x.manga=null,n.innerHTML=Ps(),await ee(t)):x.activeVolumeId?x.activeVolume=(x.manga.volumes||[]).find(r=>r.id===x.activeVolumeId):x.activeVolume=null,n.innerHTML=Ps(),Ko(),ts()}function fi(){x.manga&&se.unsubscribeFromManga(x.manga.id),x.manga=null,x.loading=!0}const vi={mount:W,unmount:fi,render:Ps};function yi(){return`
    <div class="modal" id="add-volume-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${g("package")} Add New Volume</h2>
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
  `}function bi(e){const t=x.manga;if(!t)return;const s=e.querySelector("#volumes-toggle-btn");s&&s.addEventListener("click",()=>{x.volumesCollapsed=!x.volumesCollapsed,localStorage.setItem($n(t.id),x.volumesCollapsed?"1":"0");const b=e.querySelector(".volumes-section");b==null||b.classList.toggle("collapsed",x.volumesCollapsed),s.setAttribute("aria-expanded",String(!x.volumesCollapsed)),s.title=x.volumesCollapsed?"Expand volumes":"Collapse volumes";const C=s.querySelector("svg");C&&(C.outerHTML=g(x.volumesCollapsed?"chevron-down":"chevron-up"))});const a=e.querySelector("#add-volume-btn"),n=e.querySelector("#add-volume-modal"),r=e.querySelector("#add-volume-submit-btn");a&&n&&a.addEventListener("click",()=>{n.classList.add("open"),e.querySelector("#add-volume-name-input").focus()}),n==null||n.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(b=>{b.addEventListener("click",()=>n.classList.remove("open"))}),r&&r.addEventListener("click",async()=>{const b=e.querySelector("#add-volume-name-input").value.trim();if(!b)return h("Please enter a volume name","error");try{r.disabled=!0,r.textContent="Creating...",await v.createVolume(t.id,b),h("Volume created successfully!","success"),n.classList.remove("open"),e.querySelector("#add-volume-name-input").value="",await ee(t.id),W([t.id])}catch(C){h("Failed to create volume: "+C.message,"error")}finally{r.disabled=!1,r.textContent="Create Volume"}});const i=e.querySelector("#manage-chapters-btn");i&&i.addEventListener("click",()=>{x.manageChapters=!x.manageChapters,W([t.id,"volume",x.activeVolumeId])}),e.querySelectorAll(".add-to-vol-btn").forEach(b=>{b.addEventListener("click",async()=>{const C=parseFloat(b.dataset.num),w=x.activeVolume;if(w)try{b.disabled=!0,b.textContent="...";const L=w.chapters||[];if(L.includes(C))return;const T=[...L,C].sort((k,I)=>k-I);await v.updateVolumeChapters(t.id,w.id,T),h(`Chapter ${C} added to volume`,"success"),await ee(t.id),W([t.id,"volume",w.id])}catch(L){h("Failed to add chapter: "+L.message,"error"),b.disabled=!1,b.textContent="Add"}})}),e.querySelectorAll(".remove-from-vol-btn").forEach(b=>{b.addEventListener("click",async C=>{C.stopPropagation();const w=parseFloat(b.dataset.num),L=x.activeVolume;if(L)try{b.disabled=!0,b.textContent="...";const k=(L.chapters||[]).filter(I=>I!==w);await v.updateVolumeChapters(t.id,L.id,k),h(`Chapter ${w} removed from volume`,"success"),await ee(t.id),W([t.id,"volume",L.id])}catch(T){h("Failed to remove chapter: "+T.message,"error"),b.disabled=!1,b.textContent="×"}})});const c=e.querySelector("#edit-vol-btn"),l=e.querySelector("#edit-volume-modal");c&&l&&c.addEventListener("click",()=>{const b=c.dataset.volId,C=t.volumes.find(w=>w.id===b);C&&(e.querySelector("#volume-name-input").value=C.name,l.dataset.editingVolId=b,l.classList.add("open"))});const d=e.querySelector("#save-volume-btn");d&&d.addEventListener("click",async()=>{const b=l.dataset.editingVolId,C=e.querySelector("#volume-name-input").value.trim();if(!C)return h("Volume name cannot be empty","error");try{await v.renameVolume(t.id,b,C),h("Volume renamed","success"),l.classList.remove("open"),await ee(t.id),W([t.id,"volume",b])}catch(w){h(w.message,"error")}});const u=e.querySelector("#delete-volume-btn");u&&u.addEventListener("click",async()=>{var L;const b=(((L=x.manga)==null?void 0:L.volumes)||[]).find(T=>T.id===l.dataset.editingVolId),C=(b==null?void 0:b.kind)==="release"?`Delete "${b.name}"? Its ${b.pageCount||""} pages are removed from disk. Chapters assigned to it stay in the library.`:"Are you sure you want to delete this volume? Chapters will remain in the library.";if(!await ne(C))return;const w=l.dataset.editingVolId;try{await v.deleteVolume(t.id,w),h("Volume deleted","success"),l.classList.remove("open"),window.location.hash=`#/manga/${t.id}`}catch(T){h(T.message,"error")}});const p=e.querySelector("#vol-cover-upload-btn");if(p){let b=document.getElementById("vol-cover-input-hidden");b||(b=document.createElement("input"),b.type="file",b.id="vol-cover-input-hidden",b.accept="image/*",b.style.display="none",document.body.appendChild(b),b.addEventListener("change",async C=>{const w=C.target.files[0];if(!w)return;const L=b.dataset.mangaId,T=b.dataset.volId,k=document.getElementById("vol-cover-upload-btn");if(b.value="",!(!L||!T))try{k&&(k.disabled=!0,k.textContent="Uploading..."),await v.uploadVolumeCover(L,T,w),h("Cover uploaded","success"),await ee(L),W([L,"volume",T])}catch(I){h("Upload failed: "+I.message,"error")}finally{k&&(k.disabled=!1,k.innerHTML=`${g("upload")} Upload Image`)}})),p.addEventListener("click",()=>{b.dataset.mangaId=t.id,b.dataset.volId=l.dataset.editingVolId||"",b.click()})}const m=e.querySelector("#vol-cover-selector-btn"),y=e.querySelector("#cover-selector-modal");m&&y&&m.addEventListener("click",async()=>{const b=y.querySelector("#cover-chapter-select");b.innerHTML='<option value="">Select a chapter...</option>';const C=e.querySelector("#edit-volume-modal"),w=C?C.dataset.editingVolId:null;let L=[...t.chapters||[]];if(w){const k=t.volumes.find(I=>I.id===w);if(k&&k.chapters){const I=new Set(k.chapters);L=L.filter(N=>I.has(N.number))}}L.sort((k,I)=>k.number-I.number);const T=new Set;L.forEach(k=>{if(!T.has(k.number)){T.add(k.number);const I=document.createElement("option");I.value=k.number,I.textContent=`Chapter ${k.number}`,b.appendChild(I)}}),L.length>0&&(b.value=L[0].number,ya(t.id,L[0].number)),y.classList.add("open")});const f=e.querySelector("#cover-chapter-select");f&&f.addEventListener("change",b=>{b.target.value&&ya(t.id,b.target.value)}),e.querySelectorAll(".modal-close, .modal-close-btn").forEach(b=>{b.addEventListener("click",()=>{b.closest(".modal").classList.remove("open")})}),e.querySelectorAll(".modal-overlay").forEach(b=>{b.addEventListener("click",()=>{b.closest(".modal").classList.remove("open")})})}async function ya(e,t){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await v.getChapterImages(e,t)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(r=>{const i=document.createElement("div");i.className="cover-grid-item",i.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",i.innerHTML=`<img src="${r}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,i.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=r.split("/").pop();wi(l,t,c)}),s.appendChild(i)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function wi(e,t,s){const a=x.manga,n=document.getElementById("edit-volume-modal"),r=document.getElementById("cover-selector-modal");if(await ne(`Set this image as ${s} cover?`))try{if(s==="volume"){const i=n.dataset.editingVolId;if(!i)throw new Error("No volume selected");await v.setVolumeCoverFromChapter(a.id,i,t,e),h("Volume cover updated","success"),r.classList.remove("open"),n.classList.remove("open"),await ee(a.id),W([a.id,"volume",i])}else{await v.setMangaCoverFromChapter(a.id,t,e),h("Series cover updated","success"),r.classList.remove("open"),await ee(a.id);const i=window.location.hash.replace("#","");x.activeVolumeId?W([a.id,"volume",x.activeVolumeId]):W([a.id])}}catch(i){h("Failed to set cover: "+i.message,"error")}}const Vt="scraper-info-modal";function xe(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ba(e){return e?e.startsWith("/covers/")?e:`/api/scrapers/proxy-cover?url=${encodeURIComponent(e)}`:""}let Lt=null;function Rt(){const e=document.getElementById(Vt);e!=null&&e._abort&&e._abort.abort(),e==null||e.remove(),Lt&&document.removeEventListener("keydown",Lt,!0),Lt=null}function $i({result:e,action:t=null}={}){if(!(e!=null&&e.url))return;Rt();const s=document.createElement("div");s.id=Vt,s.className="modal open scraper-info-modal";const a=ba(e.cover);s.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${xe(e.title)}</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="scraper-info-body">
                <div class="scraper-info-top">
                    <div class="scraper-info-cover">
                        ${a?Me(a,xe(e.title),{kind:"series",self:!0}):be("series")}
                    </div>
                    <div class="scraper-info-main">
                        <div class="scraper-info-meta">
                            <span class="badge badge-scraper">${xe(e.website||"")}</span>
                            ${e.chapterCount?`<span class="badge badge-chapters">${e.chapterCount} ch</span>`:""}
                        </div>
                        <div id="scraper-info-details" class="scraper-info-details">
                            <div class="torrent-hint">${g("loader",{spin:!0})} Reading the title page…</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="scraper-info-footer">
                <a class="btn btn-secondary" href="${xe(e.url)}" target="_blank" rel="noopener">${g("globe")} Open on the site</a>
                <span class="spacer"></span>
                <button type="button" class="btn btn-secondary" data-act="close">Close</button>
                ${t?`<button type="button" class="btn btn-primary" data-act="action">${xe(t.label)}</button>`:""}
            </div>
        </div>
    `,document.body.appendChild(s),Lt=l=>{l.key==="Escape"&&(l.stopImmediatePropagation(),l.preventDefault(),Rt())},document.addEventListener("keydown",Lt,!0),s.querySelector(".modal-overlay").addEventListener("click",Rt),s.querySelectorAll('[data-act="close"]').forEach(l=>l.addEventListener("click",Rt));const n=s.querySelector('[data-act="action"]');n&&t&&n.addEventListener("click",async()=>{n.disabled=!0;try{await t.onClick(e),n.textContent=t.done||"Added"}catch{n.disabled=!1}});const r=s.querySelector("#scraper-info-details"),i=new AbortController;s._abort=i;const c=(l,d)=>d!=null&&d.length?`<div class="scraper-info-group">
             <h4>${xe(l)}</h4>
             <div class="scraper-info-chips">${d.map(u=>`<span class="badge badge-chapters">${xe(u)}</span>`).join("")}</div>
           </div>`:"";v.get(`/scrapers/info?url=${encodeURIComponent(e.url)}&brief=1`,{signal:i.signal}).then(l=>{var f;if(!document.getElementById(Vt))return;const d=l==null?void 0:l.info;if(!(l!=null&&l.success)||!d){r.innerHTML='<div class="torrent-hint error">The site did not return any details.</div>';return}const u=d.totalChapters||((f=d.chapters)==null?void 0:f.length)||e.chapterCount||null,p=[u?{label:"Chapters",value:u}:null,d.uniqueChapters&&d.uniqueChapters!==u?{label:"Unique",value:d.uniqueChapters}:null,d.pageCount?{label:"Pages",value:d.pageCount}:null,d.displayId?{label:"Gallery",value:d.displayId}:null].filter(Boolean);r.innerHTML=`
                ${p.length?`<div class="scraper-info-facts">${p.map(b=>`
                    <div><div class="scraper-info-fact-label">${xe(b.label)}</div><div class="scraper-info-fact-value">${xe(b.value)}</div></div>`).join("")}</div>`:""}
                ${d.description?`<p class="scraper-info-description">${xe(d.description)}</p>`:""}
                ${c("Artists",d.artists)}
                ${c("Tags",d.tags)}
            `;const m=ba(d.cover),y=s.querySelector(".scraper-info-cover img");m&&y&&!e.cover&&(y.src=m)}).catch(l=>{i.signal.aborted||l.name==="AbortError"||document.getElementById(Vt)&&(r.innerHTML=`<div class="torrent-hint error">${xe(l.message)}</div>`)})}let Ce={series:null,loading:!0};function We(){if(Ce.loading)return`
      ${ve("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const e=Ce.series;if(!e)return`
      ${ve("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const t=e.alias||e.title,s=e.entries||[],a=s.reduce((r,i)=>r+(i.chapter_count||0),0);let n=null;if(s.length>0){const r=s[0];r.local_cover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.local_cover.split(/[/\\]/).pop())}`:r.localCover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.localCover.split(/[/\\]/).pop())}`:r.cover&&(n=r.cover)}return`
    ${ve("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?Me(n,t,{kind:"series"}):be("series")}
          </div>
          <div class="series-detail-info">
            <h1>${t}</h1>
            <div class="series-detail-meta">
              <span class="meta-item">${s.length} Entries</span>
              <span class="meta-item">${a} Total Chapters</span>
            </div>
            <div class="series-detail-actions">
              <button class="btn btn-secondary" id="add-entry-btn">+ Add Entry</button>
              <button class="btn btn-secondary" id="find-more-btn" title="Search the site of this series' manga for more titles and add them here">${g("search")} Find more like this</button>
              <button class="btn btn-secondary" id="edit-series-btn">${g("pencil")} Edit</button>
              <button class="btn btn-secondary" id="back-library-btn">← Library</button>
            </div>
          </div>
        </div>
        
        <div class="series-entries-section">
          <h2>Entries</h2>
          <div class="series-entries-grid">
            ${s.map((r,i)=>Ei(r,i,s.length)).join("")}
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
  `}const Rs="find-more-modal";function Be(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function jt(){var e;(e=document.getElementById(Rs))==null||e.remove(),document.removeEventListener("keydown",Sn)}function Sn(e){e.key==="Escape"&&jt()}async function ki(e){jt();const t=e.entries||[],s=[...new Set(t.map(y=>y.website).filter(y=>y&&y!=="Local"))],a=t[0]||null,n=document.createElement("div");n.id=Rs,n.className="modal open torrent-modal find-more-modal",n.innerHTML=`
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>${g("search")} Find more for ${Be(e.alias||e.title)}</h2>
        <button class="modal-close" data-act="close" title="Close">×</button>
      </div>
      <div class="torrent-body">
        <form class="torrent-search-form" id="find-more-form">
          <select id="find-more-site" title="Site to search">
            ${s.map(y=>`<option value="${Be(y)}">${Be(y)}</option>`).join("")}
            <option value="all">All sites</option>
          </select>
          <input type="text" id="find-more-query" value="${Be(e.alias||e.title)}" placeholder="Title to search for" autocomplete="off">
          <button type="submit" class="btn btn-primary">Search</button>
        </form>
        <div class="torrent-hint">Click a result for its details. Adding one scrapes it and files it in this series${a?`, with the tags and check settings of <strong>${Be(a.alias||a.title)}</strong>`:""}. Titles already in your library are linked as they are.</div>
        <div id="find-more-results"></div>
      </div>
    </div>
  `,document.body.appendChild(n),document.addEventListener("keydown",Sn),n.querySelector(".modal-overlay").addEventListener("click",jt),n.querySelector('[data-act="close"]').addEventListener("click",jt);const r=n.querySelector("#find-more-results"),i=new Set(t.map(y=>y.bookmark_id));let c=new Map;try{const y=await v.getBookmarks(),f=Array.isArray(y)?y:y.bookmarks||[];c=new Map(f.map(b=>[b.url,b]))}catch{}const l=y=>{if(!y.length){r.innerHTML='<div class="torrent-hint">No results. Try a shorter title.</div>';return}r.innerHTML=`<div class="library-grid find-more-grid">${y.map((f,b)=>{const C=f.cover?f.cover.startsWith("/covers/")?f.cover:`/api/scrapers/proxy-cover?url=${encodeURIComponent(f.cover)}`:"",w=c.get(f.url),L=w&&i.has(w.id);return`
        <div class="manga-card scraper-result-card find-more-card" data-index="${b}" title="Click for details">
          <div class="manga-card-cover">
            ${C?Me(C,"Cover",{kind:"series",self:!0}):be("series")}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${Be(f.website)}</span>
              ${f.chapterCount?`<span class="badge badge-chapters">${f.chapterCount} ch</span>`:""}
            </div>
          </div>
          <div class="manga-card-title" title="${Be(f.title)}">${Be(f.title)}</div>
          <div class="find-more-actions">
            ${L?'<span class="torrent-hint">Already in this series</span>':`<button class="btn btn-primary find-more-add" data-index="${b}" style="width: 100%; font-size: 0.8rem;">${w?"Add to series":"+ Add and scrape"}</button>`}
          </div>
        </div>`}).join("")}</div>`};let d=[];const u=async()=>{const y=n.querySelector("#find-more-query").value.trim(),f=n.querySelector("#find-more-site").value||"all";if(y){r.innerHTML=`<div class="torrent-hint">${g("loader",{spin:!0})} Searching ${Be(f==="all"?"every site":f)}…</div>`;try{d=(await v.get(`/scrapers/search?q=${encodeURIComponent(y)}&scraper=${encodeURIComponent(f)}`)).results||[],l(d)}catch(b){r.innerHTML=`<div class="torrent-hint error">${Be(b.message)}</div>`}}};n.querySelector("#find-more-form").addEventListener("submit",y=>{y.preventDefault(),u()});const p=async(y,f)=>{for(let b=0;b<120;b++){if(await new Promise(w=>setTimeout(w,3e3)),!document.getElementById(Rs))return;let C=null;try{C=(await v.getQueueHistory(30)).find(L=>L.id===y)||null}catch{}if(C){if(C.status==="completed"){f.textContent="Added",h("Added to the series","success"),await ut(e.id),document.getElementById("app").innerHTML=We(),dt();return}if(C.status==="failed"){f.disabled=!1,f.textContent="Retry",h(`Adding failed: ${C.error||"unknown error"}`,"error");return}f.textContent=C.status==="waiting"?"Waiting for site…":"Scraping…"}}},m=async(y,f)=>{const b=c.get(y.url);if(b){await v.post(`/series/${e.id}/entries`,{bookmarkId:b.id}),i.add(b.id),h("Added to the series","success"),await ut(e.id),document.getElementById("app").innerHTML=We(),dt();return}const C=await v.addBookmarkToSeries(y.url,{seriesId:e.id,copyFromBookmarkId:(a==null?void 0:a.bookmark_id)||null});h("Queued: it is scraped and then filed in this series","info"),f&&p(C.jobId,f)};r.addEventListener("click",async y=>{const f=y.target.closest(".find-more-add");if(f){const T=d[parseInt(f.dataset.index,10)];if(!T)return;f.disabled=!0,f.textContent=c.get(T.url)?"Adding…":"Queued…";try{await m(T,f),c.get(T.url)&&(f.textContent="Added")}catch(k){f.disabled=!1,h(`Failed: ${k.message}`,"error")}return}const b=y.target.closest(".find-more-card");if(!b)return;const C=d[parseInt(b.dataset.index,10)];if(!C)return;const w=c.get(C.url),L=w&&i.has(w.id);$i({result:C,action:L?null:{label:w?"Add to series":"Add and scrape",done:w?"Added":"Queued",onClick:async()=>{const T=r.querySelector(`.find-more-add[data-index="${b.dataset.index}"]`);await m(C,T),T&&(T.disabled=!0,T.textContent=w?"Added":"Queued…")}}})}),u()}function Ei(e,t,s){var r;const a=e.alias||e.title;let n=null;return e.local_cover?n=`/api/public/covers/${e.bookmark_id}/${encodeURIComponent(e.local_cover.split(/[/\\]/).pop())}`:e.localCover?n=`/api/public/covers/${e.bookmark_id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover&&(n=e.cover),`
    <div class="series-entry-card" data-id="${e.bookmark_id}" data-order="${e.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${t+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${e.bookmark_id}" ${t===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${e.bookmark_id}" ${t===s-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?Me(n,a,{kind:"book"}):be("book")}
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${e.chapter_count||0} ch</span>
          ${((r=e.downloadedChapters)==null?void 0:r.length)>0?`<span class="badge badge-downloaded">${e.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${e.bookmark_id}" data-entryid="${e.id}" title="Use as series cover">${g("image",{title:"Use as series cover"})}</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${a}</div>
      </div>
    </div>
  `}function dt(){var l,d,u,p;const e=document.getElementById("app"),t=Ce.series;(l=document.getElementById("find-more-btn"))==null||l.addEventListener("click",()=>ki(t)),(d=document.getElementById("back-btn"))==null||d.addEventListener("click",()=>H.go("/")),(u=document.getElementById("back-library-btn"))==null||u.addEventListener("click",()=>H.go("/")),e.querySelectorAll(".series-entry-card").forEach(m=>{m.addEventListener("click",y=>{if(y.target.closest("[data-action]"))return;const f=m.dataset.id;H.go(`/manga/${f}`)})}),e.querySelectorAll("[data-action]").forEach(m=>{m.addEventListener("click",async y=>{y.stopPropagation();const f=m.dataset.action,b=m.dataset.id;switch(f){case"move-up":await wa(b,-1);break;case"move-down":await wa(b,1);break;case"set-cover":const C=m.dataset.entryid;await Si(C);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),r=document.getElementById("available-bookmarks-list"),i=document.getElementById("confirm-add-entry-btn");let c=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),r&&(r.innerHTML=""),a.classList.add("open");const m=await v.getAvailableBookmarksForSeries();c=m,m.length===0?(n&&(n.placeholder="No available manga found"),i.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),r&&(r.innerHTML=m.map(y=>`<option value="${(y.alias||y.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),i.disabled=!1)}catch{h("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),i.addEventListener("click",async()=>{const m=n?n.value:"",y=c.find(b=>(b.alias||b.title||"")===m);if(!y){h("Please select a valid manga from the list","warning");return}const f=y.id;try{i.disabled=!0,i.textContent="Adding...",await v.addSeriesEntry(t.id,f),h("Manga added to series","success"),a.classList.remove("open"),await ut(t.id),e.innerHTML=We(),dt()}catch(b){h("Failed to add manga: "+b.message,"error")}finally{i.disabled=!1,i.textContent="Add to Series"}})),(p=document.getElementById("edit-series-btn"))==null||p.addEventListener("click",()=>{h("Edit series coming soon","info")})}async function wa(e,t){const s=Ce.series;if(!s)return;const a=s.entries||[],n=a.findIndex(c=>c.bookmark_id===e);if(n===-1)return;const r=n+t;if(r<0||r>=a.length)return;const i=a.map(c=>c.bookmark_id);[i[n],i[r]]=[i[r],i[n]];try{await v.post(`/series/${s.id}/reorder`,{order:i}),h("Order updated","success"),await ut(s.id);const c=document.getElementById("app");c.innerHTML=We(),dt()}catch(c){h("Failed to reorder: "+c.message,"error")}}async function Si(e){const t=Ce.series;if(t)try{await v.setSeriesCover(t.id,e),h("Series cover updated","success"),await ut(t.id);const s=document.getElementById("app");s.innerHTML=We(),dt()}catch(s){h("Failed to set cover: "+s.message,"error")}}async function ut(e){try{const t=await v.get(`/series/${e}`);Ce.series=t,Ce.loading=!1}catch{h("Failed to load series","error"),Ce.loading=!1}}async function Ci(e=[]){const[t]=e;if(!t){H.go("/");return}const s=document.getElementById("app");Ce.loading=!0,Ce.series=null,s.innerHTML=We(),await ut(t),s.innerHTML=We(),dt()}function xi(){Ce.series=null,Ce.loading=!0}const Li={mount:Ci,unmount:xi,render:We},Ii={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};function qe(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ti(){return`
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
                <button type="button" class="btn btn-secondary btn-sm" id="tor-add-mapping">${g("plus")} Add mapping</button>
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
    `}function Mi(){return`
        <div class="settings-group" id="cleanup-group">
            <h2>Downloads folder</h2>
            <p class="settings-hint">Find folders on disk that nothing in the library refers to any more: chapter versions whose download was removed, volumes that were deleted, series folders left behind by a renamed alias, and unfinished imports. Scanning changes nothing; you choose what to delete.</p>
            <div class="settings-actions torrents-actions">
                <button type="button" class="btn btn-secondary" id="cleanup-scan">${g("search")} Scan for leftovers</button>
                <span class="torrents-test-result" id="cleanup-summary"></span>
            </div>
            <div id="cleanup-results"></div>
        </div>
    `}async function Ai(){const e=u=>document.getElementById(u),t=e("cleanup-scan"),s=e("cleanup-summary"),a=e("cleanup-results");if(!t)return;const n=u=>{if(!u)return"0 B";const p=["B","KB","MB","GB","TB"];let m=0,y=u;for(;y>=1024&&m<p.length-1;)y/=1024,m++;return`${y.toFixed(y>=100||m===0?0:1)} ${p[m]}`},r={series:"Series folder",chapter:"Chapter folder",volume:"Volume folder",temp:"Unfinished import"},i=()=>[...a.querySelectorAll(".cl-pick:checked")].map(u=>u.value),c=()=>{const u=a.querySelector("#cleanup-delete");if(!u)return;const p=i().length;u.disabled=p===0,u.textContent=p?`Delete ${p} selected`:"Delete selected"},l=u=>{if(!u.groups.length){a.innerHTML='<p class="settings-hint">Nothing left over. Every folder on disk is in use.</p>';return}a.innerHTML=`
            <div class="review-tools">
                <button type="button" class="btn btn-sm btn-secondary" id="cleanup-all">Select all</button>
                <button type="button" class="btn btn-sm btn-secondary" id="cleanup-none">Select none</button>
                <span class="spacer"></span>
                <button type="button" class="btn btn-sm btn-danger" id="cleanup-delete" disabled>Delete selected</button>
            </div>
            ${u.groups.map(p=>`
                <div class="cleanup-group">
                    <div class="cleanup-series">${g("book-open")} ${qe(p.series)}${p.bookmarkIds.length?"":" <small>(no series in the library)</small>"}</div>
                    ${p.items.map(m=>`
                        <label class="cleanup-item">
                            <input type="checkbox" class="cl-pick" value="${qe(m.path)}">
                            <span class="cleanup-kind">${r[m.kind]||m.kind}</span>
                            <span class="cleanup-name" title="${qe(m.path)}">${qe(m.name)}</span>
                            <span class="cleanup-note">${qe(m.note)}</span>
                            <span class="cleanup-size">${n(m.size)}</span>
                        </label>`).join("")}
                </div>`).join("")}
            <div id="cleanup-result"></div>
        `,a.querySelector("#cleanup-all").addEventListener("click",()=>{a.querySelectorAll(".cl-pick").forEach(p=>{p.checked=!0}),c()}),a.querySelector("#cleanup-none").addEventListener("click",()=>{a.querySelectorAll(".cl-pick").forEach(p=>{p.checked=!1}),c()}),a.addEventListener("change",c),a.querySelector("#cleanup-delete").addEventListener("click",async()=>{const p=i();if(!p.length)return;const m=u.groups.flatMap(f=>f.items).filter(f=>p.includes(f.path)).reduce((f,b)=>f+b.size,0);if(!await ne(`Delete ${p.length} folder${p.length===1?"":"s"} from disk (${n(m)})? This cannot be undone.`,{danger:!0}))return;const y=a.querySelector("#cleanup-delete");y.disabled=!0,y.textContent="Deleting…";try{const f=await v.removeDownloadLeftovers(p);h(`Deleted ${f.removed.length} folder${f.removed.length===1?"":"s"}, freed ${n(f.freed)}`,"success"),f.skipped.length&&(a.querySelector("#cleanup-result").innerHTML=`<ul class="task-error-list">${f.skipped.map(b=>`<li>${qe(b.path)}: ${qe(b.reason)}</li>`).join("")}</ul>`),await d()}catch(f){h(`Delete failed: ${f.message}`,"error"),c()}})},d=async()=>{t.disabled=!0,s.textContent="Scanning…";try{const u=await v.getDownloadLeftovers();s.textContent=u.totalItems?`${u.totalItems} leftover${u.totalItems===1?"":"s"}, ${n(u.totalSize)}`:"Nothing left over",l(u)}catch(u){s.textContent=`Scan failed: ${u.message}`}finally{t.disabled=!1}};t.addEventListener("click",d)}async function Bi(){const e=l=>document.getElementById(l),t=e("tor-path-mappings");if(!t)return;const s=l=>{t.innerHTML=l.length?l.map((d,u)=>`
                <div class="tor-mapping" data-index="${u}">
                    <input type="text" class="tor-map-from" value="${qe(d.from)}" placeholder="qBittorrent path, e.g. /downloads">
                    <span class="tor-map-arrow">→</span>
                    <input type="text" class="tor-map-to" value="${qe(d.to)}" placeholder="path this app sees, e.g. /app/torrents">
                    <button type="button" class="btn-icon small danger tor-map-remove" title="Remove">×</button>
                </div>`).join(""):'<p class="settings-hint">No mappings.</p>',t.querySelectorAll(".tor-map-remove").forEach(d=>d.addEventListener("click",()=>{d.closest(".tor-mapping").remove(),t.querySelector(".tor-mapping")||s([])}))},a=()=>[...t.querySelectorAll(".tor-mapping")].map(l=>({from:l.querySelector(".tor-map-from").value.trim(),to:l.querySelector(".tor-map-to").value.trim()})),n=()=>a().filter(l=>l.from&&l.to),r=()=>({prowlarr:{baseUrl:e("tor-prowlarr-url").value.trim(),apiKey:e("tor-prowlarr-key").value},qbittorrent:{baseUrl:e("tor-qbt-url").value.trim(),username:e("tor-qbt-user").value.trim(),password:e("tor-qbt-pass").value,category:e("tor-qbt-category").value.trim()||"manga",savePath:e("tor-qbt-savepath").value.trim()},pathMappings:n(),autoImport:e("tor-auto-import").checked}),i=(l,d,u)=>{l.textContent=u,l.className=`torrents-test-result ${d?"ok":"error"}`};try{const{settings:l}=await v.getTorrentSettings();e("tor-prowlarr-url").value=l.prowlarr.baseUrl||"",e("tor-prowlarr-key").value=l.prowlarr.apiKey||"",e("tor-qbt-url").value=l.qbittorrent.baseUrl||"",e("tor-qbt-user").value=l.qbittorrent.username||"",e("tor-qbt-pass").value=l.qbittorrent.password||"",e("tor-qbt-category").value=l.qbittorrent.category||"manga",e("tor-qbt-savepath").value=l.qbittorrent.savePath||"",e("tor-auto-import").checked=l.autoImport!==!1,s(l.pathMappings||[])}catch(l){s([]),i(e("tor-save-result"),!1,`Could not load torrent settings: ${l.message}`)}e("tor-add-mapping").addEventListener("click",()=>s([...a(),{from:"",to:""}]));const c=async(l,d,u)=>{d.disabled=!0,u.textContent="Testing…",u.className="torrents-test-result";try{const{result:p}=await v.testTorrentService(l,r()[l]);l==="prowlarr"?i(u,!0,`Connected: ${p.appName} ${p.version}${p.indexers!==null?`, ${p.indexers} indexer${p.indexers===1?"":"s"} enabled`:""}`):i(u,!0,`Connected: qBittorrent ${p.version}${p.savePath?`, default save path ${p.savePath}`:""}`)}catch(p){i(u,!1,p.message)}finally{d.disabled=!1}};e("tor-test-prowlarr").addEventListener("click",l=>c("prowlarr",l.currentTarget,e("tor-prowlarr-result"))),e("tor-test-qbt").addEventListener("click",l=>c("qbittorrent",l.currentTarget,e("tor-qbt-result"))),e("tor-save").addEventListener("click",async l=>{const d=l.currentTarget;d.disabled=!0;try{const{settings:u}=await v.saveTorrentSettings(r());e("tor-prowlarr-key").value=u.prowlarr.apiKey||"",e("tor-qbt-pass").value=u.qbittorrent.password||"",i(e("tor-save-result"),!0,"Saved"),h("Torrent settings saved","success")}catch(u){i(e("tor-save-result"),!1,u.message)}finally{d.disabled=!1}})}const _i={mount:async e=>{const t=document.getElementById("app");t.innerHTML=`
            ${ve()}
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
                            <button id="slideshow-start" class="btn btn-primary">${g("images")} Start Slideshow</button>
                        </div>
                    </div>

                    ${Z.isAdmin?Ti():""}
                    ${Z.isAdmin?Mi():""}
                </div>
            </div>
        `;let s={};try{const w=await v.get("/settings")||{};s=w;const L=document.getElementById("settings-form"),T=document.getElementById("settings-loader");w.theme&&(document.getElementById("theme").value=w.theme),T.style.display="none",L.style.display="",L.addEventListener("submit",async k=>{k.preventDefault();const I=new FormData(L),N={};for(const[E,$]of I.entries())N[E]=$;try{await v.post("/settings/bulk",N),h("Settings saved successfully"),N.theme}catch(E){console.error(E),h("Failed to save settings","error")}})}catch(w){console.error(w),document.getElementById("settings-loader").textContent="Error loading settings"}window.location.hash.includes("anilist=connected")&&h("AniList connected");const a=document.getElementById("anilist-group"),n=document.getElementById("anilist-status"),r=document.getElementById("anilist-connect"),i=document.getElementById("anilist-sync"),c=document.getElementById("anilist-disconnect"),l=document.getElementById("anilist-sync-result"),d=async()=>{a.style.display="block";try{const w=await v.anilistStatus();w.configured?w.connected?(n.textContent=`Connected as ${w.anilistUsername||"AniList user"}.`,r.style.display="none",i.style.display="",c.style.display=""):(n.textContent="Not connected. Link your AniList account to sync reading progress.",r.style.display="",i.style.display="none",c.style.display="none"):(n.textContent="Not configured — set ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET in .env and restart the server.",r.style.display="none",i.style.display="none",c.style.display="none")}catch(w){console.error(w),n.textContent="Failed to load AniList status — is the server running the latest code?"}};r.addEventListener("click",async()=>{try{const{url:w}=await v.anilistAuthUrl();window.location.href=w}catch(w){h(w.message||"Failed to start AniList connection","error")}}),c.addEventListener("click",async()=>{try{await v.anilistDisconnect(),h("AniList disconnected"),d()}catch{h("Failed to disconnect","error")}}),i.addEventListener("click",async()=>{i.disabled=!0,n.textContent="Syncing from AniList…";try{const w=await v.anilistPull();w.updated.length===0?l.textContent="Everything already up to date.":l.innerHTML="<ul>"+w.updated.map(L=>`<li>${L.title} — marked read up to chapter ${L.markedUpTo}</li>`).join("")+"</ul>",h(`AniList sync: ${w.updated.length} manga updated`)}catch(w){l.textContent="",h(w.message||"AniList sync failed","error")}finally{i.disabled=!1,d()}}),d(),Z.isAdmin&&Bi(),Z.isAdmin&&Ai();const u={...Ii,...s.slideshow||{}};u.disabledMangaIds=[...u.disabledMangaIds||[]];const p=document.getElementById("slideshow-interval"),m=document.getElementById("slideshow-shuffle"),y=document.getElementById("slideshow-lists"),f=document.getElementById("slideshow-trophies"),b=document.getElementById("slideshow-manga-list");p.value=String(u.intervalMs),p.value||(p.value="8000"),m.checked=!!u.shuffle,y.checked=!!u.includeLists,f.checked=!!u.includeTrophies;const C=async()=>{if(!Z.isDemo)try{await v.post("/settings",{key:"slideshow",value:u})}catch(w){console.error(w),h("Failed to save slideshow settings","error")}};p.addEventListener("change",()=>{u.intervalMs=parseInt(p.value,10)||8e3,C()}),m.addEventListener("change",()=>{u.shuffle=m.checked,C()}),y.addEventListener("change",()=>{u.includeLists=y.checked,C()}),f.addEventListener("change",()=>{u.includeTrophies=f.checked,C()}),document.getElementById("slideshow-start").addEventListener("click",()=>{var w,L;(L=(w=document.documentElement).requestFullscreen)==null||L.call(w).catch(()=>{}),H.go("/slideshow")});try{const w=await v.getAllVolumes();if(w.length===0)b.innerHTML=`<p class="settings-hint">No manga with volumes yet — create volumes from a manga's page first.</p>`;else{const L=new Set(u.disabledMangaIds);b.innerHTML=w.map(T=>{const k=qe(T.alias||T.title),I=T.volumes.filter($=>$.cover).length,N=T.localCover?`/api/public/covers/${T.id}/${encodeURIComponent(T.localCover.split(/[/\\]/).pop())}`:T.cover,E=I===0;return`
                        <label class="slideshow-manga-row${E?" no-covers":""}" title="${E?"No volume covers yet":k}">
                            <input type="checkbox" data-manga-id="${T.id}" ${!L.has(T.id)&&!E?"checked":""} ${E?"disabled":""}>
                            <span class="slideshow-manga-thumb">${N?Me(N,k,{kind:"book"}):be("book")}</span>
                            <span class="slideshow-manga-info">
                                <span class="slideshow-manga-name">${k}</span>
                                <span class="slideshow-manga-meta">${T.volumes.length} volume${T.volumes.length===1?"":"s"} · ${I} cover${I===1?"":"s"}</span>
                            </span>
                        </label>
                    `}).join(""),b.addEventListener("change",T=>{const k=T.target.closest("input[data-manga-id]");if(!k)return;const I=k.dataset.mangaId;k.checked?u.disabledMangaIds=u.disabledMangaIds.filter(N=>N!==I):u.disabledMangaIds.includes(I)||u.disabledMangaIds.push(I),C()})}}catch(w){console.error(w),b.innerHTML='<p class="settings-hint">Failed to load manga list.</p>'}}},qi={mount:async e=>{const t=document.getElementById("app");if(!Z.isAdmin){t.innerHTML=`
                ${ve()}
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
        `,document.querySelectorAll(".admin-tab").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(a=>a.classList.remove("active")),s.classList.add("active"),document.querySelectorAll(".admin-section").forEach(a=>a.style.display="none"),document.getElementById(`admin-section-${s.dataset.section}`).style.display=""})}),await Promise.all([zt(),Pi(),Ri()])}};async function zt(){const e=document.getElementById("admin-section-users");try{const t=await v.listUsers();e.innerHTML=`
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
                                <td>${Ds(s.username)}${s.id===((a=Z.user)==null?void 0:a.id)?' <span class="badge">you</span>':""}</td>
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
        `,e.querySelectorAll("tr[data-user-id]").forEach(s=>{const a=Number(s.dataset.userId),n=async()=>{try{await v.updateUser(a,{role:s.querySelector(".user-role").value,canDownload:s.querySelector(".user-can-download").checked,canEdit:s.querySelector(".user-can-edit").checked}),h("User updated","success")}catch(r){h(r.message,"error"),zt()}};s.querySelector(".user-role").addEventListener("change",n),s.querySelector(".user-can-download").addEventListener("change",n),s.querySelector(".user-can-edit").addEventListener("change",n),s.querySelector(".user-reset-pw").addEventListener("click",async()=>{const r=await Va("New password for this user",{type:"password",confirmText:"Set password"});if(r)try{await v.updateUser(a,{password:r}),h("Password reset","success")}catch(i){h(i.message,"error")}}),s.querySelector(".user-delete").addEventListener("click",async()=>{if(await ne("Delete this user?",{danger:!0}))try{await v.deleteUser(a),h("User deleted","success"),zt()}catch(r){h(r.message,"error")}})}),document.getElementById("add-user-form").addEventListener("submit",async s=>{s.preventDefault();try{await v.createUser({username:document.getElementById("new-username").value.trim(),password:document.getElementById("new-password").value,role:document.getElementById("new-role").value,canDownload:document.getElementById("new-can-download").checked,canEdit:document.getElementById("new-can-edit").checked}),h("User created","success"),zt()}catch(a){h(a.message,"error")}})}catch(t){console.error(t),e.innerHTML='<div class="error">Failed to load users</div>'}}async function Pi(){const e=document.getElementById("admin-section-demo");try{const t=await v.getBookmarks();e.innerHTML=`
            <h2>Demo Content</h2>
            <p class="admin-demo-warning">
                Checked series are visible to <strong>anyone</strong> on the public demo page
                (<code>/demo.html</code>) — no login needed, covers included. Only downloaded
                chapters are readable there. Be deliberate about adult titles.
            </p>
            <input type="search" id="demo-filter" placeholder="Filter series..." class="admin-demo-filter">
            <ul class="admin-demo-list">
                ${t.map(s=>`
                    <li data-title="${Ds((s.alias||s.title||"").toLowerCase())}">
                        <label>
                            <input type="checkbox" class="demo-toggle" data-id="${s.id}" ${s.isDemo?"checked":""}>
                            <span>${Ds(s.alias||s.title)}</span>
                            <span class="badge">${s.downloadedCount||0} downloaded</span>
                        </label>
                    </li>
                `).join("")}
            </ul>
        `,e.querySelectorAll(".demo-toggle").forEach(s=>{s.addEventListener("change",async()=>{try{await v.toggleDemo(s.dataset.id,s.checked),h(s.checked?"Added to demo":"Removed from demo","success")}catch(a){s.checked=!s.checked,h(a.message,"error")}})}),document.getElementById("demo-filter").addEventListener("input",s=>{const a=s.target.value.toLowerCase();e.querySelectorAll(".admin-demo-list li").forEach(n=>{n.style.display=n.dataset.title.includes(a)?"":"none"})})}catch(t){console.error(t),e.innerHTML='<div class="error">Failed to load bookmarks</div>'}}function Ds(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Ri(){try{const e=await v.get("/admin/tables"),t=document.getElementById("admin-sidebar");t.innerHTML=`
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
        `,t.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;Ns(n),t.querySelectorAll(".table-link").forEach(r=>r.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(e){console.error(e),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function Ns(e,t=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${e}...</div>`;try{const i=await v.get(`/admin/tables/${e}?page=${t}&limit=50`);if(!i.rows||i.rows.length===0){s.innerHTML=`
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
                                ${c.map(d=>{const u=l[d];let p=u;return u===null?p='<span class="null">NULL</span>':typeof u=="object"?p=JSON.stringify(u):String(u).length>100&&(p=String(u).substring(0,100)+"..."),`<td>${p}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>Ns(e,t-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>Ns(e,t+1))}catch(r){console.error(r),s.innerHTML=`<div class="error">Failed to load data for ${e}</div>`}}let pe={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function Di(e,t){let s=null;if(t.length>0){const n=t[0];if(n.imagePaths&&n.imagePaths.length>0){const r=n.imagePaths[0];let i;typeof r=="string"?i=r:r&&typeof r=="object"&&(i=r.filename||r.path||r.name||r.url,i&&i.includes("/")&&(i=i.split("/").pop()),i&&i.includes("\\")&&(i=i.split("\\").pop())),i&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(i)}`)}}const a=t.reduce((n,r)=>{var i;return n+(((i=r.imagePaths)==null?void 0:i.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${e}">
      <div class="manga-card-cover">
        ${s?Me(s,e,{kind:"folder"}):be("folder")}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Ni(e){const t=pe.bookmarks.find(s=>s.id===e);return t?t.alias||t.title:e}function Fi(e){const t=pe.bookmarks.find(s=>s.id===e);if(t&&t.seriesId){const s=pe.series.find(a=>a.id===t.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function Oi(e,t,s,a=!1){return`
    <div class="manga-card trophy-gallery-card" data-trophy-id="${e}" data-is-series="${a}">
      <div class="manga-card-cover">
        <div class="placeholder trophy-placeholder" data-icon="trophy"></div>
        <div class="manga-card-badges">
            <span class="badge badge-trophy">${g("trophy")} ${s}</span>
            ${a?'<span class="badge badge-series">Series</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function Ui(){const e={};console.log("Building trophy groups from:",pe.trophyPages);for(const t of Object.keys(pe.trophyPages)){const s=pe.trophyPages[t];let a=0;for(const[r,i]of Object.entries(s))a+=Object.keys(i).length;if(console.log(`Manga ${t}: ${a} trophies`),a===0)continue;const n=Fi(t);if(n)e[n.id]||(e[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),e[n.id].count+=a,e[n.id].mangaIds.push(t);else{const r=Ni(t);console.log(`No series for ${t}, using name: ${r}`),e[t]={name:r,isSeries:!1,count:a,mangaIds:[t]}}}return console.log("Trophy groups result:",e),e}function ss(){if(pe.loading)return`
      ${ve("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:e,listOrder:t}=pe.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${pe.activeTab==="galleries"?"active":""}" data-tab="galleries">
        ${g("folder")} Galleries
      </button>
      <button class="tab-btn ${pe.activeTab==="trophies"?"active":""}" data-tab="trophies">
        ${g("trophy")} Trophies
      </button>
    </div>
  `;let a="";if(pe.activeTab==="galleries")t.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${t.map(r=>{const i=e&&e[r]||[];return Di(r,i)}).join("")}
        </div>
      `;else{const n=Ui(),r=Object.keys(n);r.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${r.map(c=>{const l=n[c];return Oi(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${ve("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function Cn(){Ue();const e=document.getElementById("app");e.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{pe.activeTab=s.dataset.tab,e.innerHTML=ss(),Cn()})}),e.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;H.go(`/read/gallery/${encodeURIComponent(a)}`)})}),e.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?H.go(`/read/trophies/series-${a}/🏆`):H.go(`/read/trophies/${a}/🏆`)})})}async function Hi(){try{const[e,t,s,a]=await Promise.all([$e.loadFavorites(),v.get("/trophy-pages"),$e.loadBookmarks(),$e.loadSeries()]);pe.favorites=e||{favorites:{},listOrder:[]},pe.trophyPages=t||{},pe.bookmarks=s||[],pe.series=a||[],pe.loading=!1}catch(e){console.error("Failed to load favorites:",e),h("Failed to load favorites","error"),pe.loading=!1}}async function Vi(){console.log("[Favorites] mount called"),pe.loading=!0;const e=document.getElementById("app");e.innerHTML=ss(),await Hi(),console.log("[Favorites] Data loaded, rendering..."),e.innerHTML=ss(),console.log("[Favorites] Calling setupListeners..."),Cn(),console.log("[Favorites] setupListeners complete")}function ji(){}const zi={mount:Vi,unmount:ji,render:ss},Qi="site-assist-modal",Wi="/assist",Gi=1,Ki=2,Yi=4,Ji=8,$a=["left","middle","right"];let lt=null;function st(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function vt(e){return(e.altKey?Gi:0)|(e.ctrlKey?Ki:0)|(e.metaKey?Yi:0)|(e.shiftKey?Ji:0)}function at(){if(!lt)return;const{socket:e,modal:t,site:s,onKey:a}=lt;lt=null,document.removeEventListener("keydown",a,!0),document.removeEventListener("keyup",a,!0);try{e.emit("assist:stop",{site:s})}catch{}try{e.disconnect()}catch{}t.remove()}function cs({site:e,url:t,reason:s,onSolved:a}={}){if(!e)return;if(!Z.isAdmin){h("Only an admin can solve a site check for the scraper","error");return}at();const n=document.createElement("div");n.id=Qi,n.className="modal open site-assist-modal",n.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Solve ${st(e)}'s check here</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="site-assist-body">
                <p class="site-assist-intro">
                    ${s==="expired"?`${st(e)}'s verification cookies ran out, so its work is on hold.`:`${st(e)} wants a person to pass its check before the scraper may continue.`}
                    Below is the scraper's own browser on the server. Complete the check in it, the way you would
                    in your browser (drag, click, type). When ${st(e)} accepts it, the scraper keeps the cookies and
                    every waiting download or check resumes by itself.
                </p>
                <div class="site-assist-status" id="site-assist-status" data-status="connecting">Connecting…</div>
                <div class="site-assist-stage" id="site-assist-stage">
                    <canvas id="site-assist-canvas" width="1024" height="720" tabindex="0" aria-label="${st(e)} in the scraper's browser"></canvas>
                    <div class="site-assist-overlay" id="site-assist-overlay">Waiting for the first picture…</div>
                </div>
                <div class="site-assist-hint">
                    Click the picture first so your keyboard goes to it. Escape closes this window.
                    Not working? <a href="#" data-act="paste">Paste cookies from your own browser</a> instead,
                    or <a href="#" data-act="open">open ${st(e)}</a> yourself.
                </div>
            </div>
            <div class="site-assist-footer">
                <button type="button" class="btn btn-secondary" data-act="close">Close</button>
            </div>
        </div>
    `,document.body.appendChild(n);const r=n.querySelector("#site-assist-canvas"),i=r.getContext("2d"),c=n.querySelector("#site-assist-status"),l=n.querySelector("#site-assist-overlay"),d=(k,I)=>{c.dataset.status=k,c.textContent=I||""},u=Ct(Wi,{auth:{token:v.getToken()},reconnection:!0,reconnectionAttempts:3,reconnectionDelay:1e3});let p=!1,m=!1;const y=new Image;let f=null;y.onload=()=>{if((r.width!==y.naturalWidth||r.height!==y.naturalHeight)&&(r.width=y.naturalWidth,r.height=y.naturalHeight),i.drawImage(y,0,0),f){const k=f;f=null,y.src=k}},y.onerror=()=>{f=null},u.on("connect",()=>{d("connecting",`Opening ${e} in the scraper's browser…`),u.emit("assist:start",{site:e},k=>{(!k||!k.ok)&&(d("error",(k==null?void 0:k.error)||"The check could not be opened"),l.textContent=(k==null?void 0:k.error)||"The check could not be opened",l.hidden=!1)})}),u.on("connect_error",k=>{d("error",`Not connected: ${k.message}`),l.textContent=`Not connected: ${k.message}`,l.hidden=!1}),u.on("assist:state",k=>{!k||k.site!==e||(k.status==="streaming"&&(p=!0,l.hidden=!0),d(k.status,k.message),k.status==="solved"?(p=!1,h(`${e}: check passed, waiting work resumes`,"success"),typeof a=="function"&&a(),setTimeout(at,2500)):k.status==="ended"?(p=!1,m=!0,l.textContent=k.message||"The window was closed.",l.hidden=!1,k.reason!=="solved"&&d("ended",k.message)):k.status==="error"&&(l.textContent=k.message,l.hidden=!1))}),u.on("assist:frame",k=>{if(!k||k.site!==e||m)return;const I=`data:image/jpeg;base64,${k.data}`;y.complete&&!f?y.src=I:f=I,p||(p=!0,l.hidden=!0)});const b=k=>{const I=r.getBoundingClientRect(),N=(k.clientX-I.left)*(r.width/I.width),E=(k.clientY-I.top)*(r.height/I.height);return{x:Math.round(N),y:Math.round(E)}},C=k=>{p&&!m&&u.emit("assist:input",{site:e,...k})};let w=null;const L=()=>{w&&(C(w),w=null)};r.addEventListener("pointerdown",k=>{k.preventDefault(),r.focus(),r.setPointerCapture(k.pointerId);const{x:I,y:N}=b(k);C({type:"mousedown",x:I,y:N,button:$a[k.button]||"left",buttons:k.buttons,clickCount:1,modifiers:vt(k)})}),r.addEventListener("pointermove",k=>{const{x:I,y:N}=b(k),E=!w;w={type:"mousemove",x:I,y:N,button:k.buttons&1?"left":k.buttons&2?"right":"none",buttons:k.buttons,modifiers:vt(k)},E&&requestAnimationFrame(L)}),r.addEventListener("pointerup",k=>{k.preventDefault(),L();const{x:I,y:N}=b(k);C({type:"mouseup",x:I,y:N,button:$a[k.button]||"left",buttons:k.buttons,clickCount:1,modifiers:vt(k)});try{r.releasePointerCapture(k.pointerId)}catch{}}),r.addEventListener("pointercancel",k=>{const{x:I,y:N}=b(k);C({type:"mouseup",x:I,y:N,button:"left",buttons:0,clickCount:1})}),r.addEventListener("wheel",k=>{k.preventDefault();const{x:I,y:N}=b(k);C({type:"wheel",x:I,y:N,deltaX:k.deltaX,deltaY:k.deltaY,modifiers:vt(k)})},{passive:!1}),r.addEventListener("contextmenu",k=>k.preventDefault());const T=k=>{if(!lt||lt.modal!==n)return;if(k.key==="Escape"){k.type==="keydown"&&at();return}if(document.activeElement!==r)return;k.preventDefault(),k.stopPropagation();const I=k.key.length===1&&!k.ctrlKey&&!k.metaKey;C({type:k.type,key:k.key,code:k.code,keyCode:k.keyCode,text:I?k.key:void 0,modifiers:vt(k)})};document.addEventListener("keydown",T,!0),document.addEventListener("keyup",T,!0),n.querySelector(".modal-overlay").addEventListener("click",at),n.querySelectorAll('[data-act="close"]').forEach(k=>k.addEventListener("click",at)),n.querySelector('[data-act="paste"]').addEventListener("click",k=>{k.preventDefault(),at(),us({site:e,url:t,stale:s==="expired"||s==="rejected"})}),n.querySelector('[data-act="open"]').addEventListener("click",k=>{k.preventDefault(),ds(e,t)}),lt={site:e,socket:u,modal:n,onKey:T},r.focus()}const xn="site-cookie-modal",ea=new Set;function ge(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ds(e,t){window.open(t||`https://${e}/`,"_blank","noopener")}function rt(){const e=document.getElementById(xn);e&&e.remove(),document.removeEventListener("keydown",Ln)}function Ln(e){e.key==="Escape"&&rt()}function Xi(e,t){var n;const s=((n=t.session)==null?void 0:n.cookieCount)??0,a=t.probe;return a&&a.ok?{kind:"ok",html:`<strong>${ge(e)} accepted the cookies.</strong> ${s} saved; downloads and checks that were
                   waiting for this site resume by themselves (see the <a href="#/queue">Task Queue</a>).`}:a&&!a.ok&&a.error?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but the server could not load ${ge(e)} to test them.</strong>
                   ${ge(a.error)}. Retry a download to find out whether they work.`}:a&&!a.ok?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but ${ge(e)} still shows its check to the server.</strong>
                   Usually one of: the check was done on a different network than the server (the cookie can be tied to the
                   IP address), or in a different browser than the identity filled in above. Complete the check again from a
                   device on the server's network, export the cookies right away, make sure the identity is that browser's,
                   and paste again.${a.error?`<br><small>${ge(a.error)}</small>`:""}`}:{kind:"ok",html:`<strong>Saved ${s} cookie${s===1?"":"s"}.</strong> The site could not be tested right now; retry your download to find out.`}}function us({site:e,url:t,stale:s=!1,onImported:a}={}){if(!e)return;if(!Z.isAdmin){h("Only an admin can hand site cookies to the scraper","error");return}rt();const n=navigator.userAgent||"",r=document.createElement("div");r.id=xn,r.className="modal open site-cookie-modal",r.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Hand ${ge(e)}'s cookies to the scraper</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="site-cookie-body">
                <div class="site-cookie-alt">
                    Easier: <button type="button" class="btn btn-sm btn-primary" data-act="assist">Solve it here</button>
                    passes the check inside the scraper's own browser, so nothing needs copying and the cookies fit
                    the scraper's identity and network. Use the steps below when that does not work.
                </div>
                <ol class="site-cookie-steps">
                    <li><button type="button" class="btn btn-sm btn-secondary" data-act="open">Open ${ge(e)}</button>
                        and complete its "verify you're human" check.
                        ${s?`If no puzzle appears, that browser is still trusted: export its cookies anyway (the site
                        may have renewed them), or clear the site's cookies in that browser to get the puzzle back.`:""}</li>
                    <li>Copy the cookies ${ge(e)} gave that browser, right after the check. Easiest: the
                        <strong>Cookie-Editor</strong> extension (Chrome, Edge, Firefox): open it on the ${ge(e)} tab,
                        choose <em>Export</em>, then <em>JSON</em> or <em>Header String</em>. A Netscape <code>cookies.txt</code>
                        export works too. (The browser console's <code>document.cookie</code> does not: it hides the cookie that matters.)</li>
                    <li>Paste them here and save. The server then loads ${ge(e)} once to see whether it is trusted.</li>
                </ol>
                <div class="form-group">
                    <label for="site-cookie-input">Cookies for ${ge(e)}</label>
                    <textarea id="site-cookie-input" rows="5" spellcheck="false" autocomplete="off" autocapitalize="off"
                        placeholder='[{"name": "...", "value": "..."}]   or   name=value; name2=value2'></textarea>
                </div>
                <div class="form-group site-cookie-ua">
                    <label for="site-cookie-ua">Identity (user agent) of the browser that completed the check</label>
                    <input type="text" id="site-cookie-ua" value="${ge(n)}" spellcheck="false" autocomplete="off">
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
    `,document.body.appendChild(r),document.addEventListener("keydown",Ln);const i=r.querySelector("#site-cookie-input"),c=r.querySelector("#site-cookie-ua"),l=r.querySelector("#site-cookie-result"),d=r.querySelector('[data-act="save"]'),u=(m,y)=>{l.className=`site-cookie-result ${m}`,l.innerHTML=y,l.hidden=!1};r.querySelector(".modal-overlay").addEventListener("click",rt),r.querySelectorAll('[data-act="close"]').forEach(m=>m.addEventListener("click",rt)),r.querySelector('[data-act="open"]').addEventListener("click",()=>ds(e,t)),r.querySelector('[data-act="assist"]').addEventListener("click",()=>{rt(),cs({site:e,url:t,reason:s?"rejected":"check",onSolved:a})});let p=!1;d.addEventListener("click",async()=>{var y;if(p)return;const m=i.value.trim();if(!m){u("error","Paste the cookies first."),i.focus();return}p=!0,d.disabled=!0,d.textContent="Saving & testing…",l.hidden=!0;try{const f=await v.importSiteSession(e,m,c.value.trim()),{kind:b,html:C}=Xi(e,f),w=f.ignored||{},L=[];w.foreign&&L.push(`${w.foreign} for other sites`),w.expired&&L.push(`${w.expired} already expired`),w.invalid&&L.push(`${w.invalid} unreadable`),u(b,C+(L.length?`<br><small>Skipped: ${L.join(", ")}.</small>`:"")),i.value="",typeof a=="function"&&a(f),(y=f.probe)!=null&&y.ok&&(h(`${e}: cookies accepted, checks resume`,"success"),setTimeout(rt,2500))}catch(f){u("error",ge(f.message||"Import failed"))}finally{p=!1,d.disabled=!1,d.textContent="Save & test"}}),i.focus()}const ka="site-challenge-banners",ps=new Map;function Zi(e){const t=`<strong>${ge(e.site)}</strong>`,s=" Its downloads and update checks wait in the queue and resume by themselves once the check is passed.";return e.reason==="expired"?`${t}'s verification cookies expired.${s}`:e.sessionStale?`${t} no longer accepts the cookies handed over earlier.${s}`:`${t} is asking for a human verification check.${s}`}function el(e){var n,r,i;const t=Z.isAdmin,s=document.createElement("div");s.className="site-challenge-banner",s.dataset.site=e.site;const a=e.waiting?` <span class="site-challenge-waiting">${e.waiting} task${e.waiting===1?"":"s"} waiting</span>`:"";return s.innerHTML=`
        <div class="site-challenge-text">${Zi(e)}${t?"":" Ask an admin to pass it."}${a}</div>
        <div class="site-challenge-actions">
            ${t?'<button class="btn btn-primary btn-sm" data-act="assist">Solve it here</button>':""}
            ${t?'<button class="btn btn-secondary btn-sm" data-act="import" title="Complete the check in your own browser and paste its cookies">Paste cookies</button>':`<button class="btn btn-primary btn-sm" data-act="open">Open ${ge(e.site)}</button>`}
            <button class="btn btn-secondary btn-sm" data-act="retry" title="Resume without solving. Only works if the site stopped asking.">Retry anyway</button>
            <button class="site-challenge-close" data-act="close" title="Hide">×</button>
        </div>
    `,(n=s.querySelector('[data-act="assist"]'))==null||n.addEventListener("click",()=>{cs({site:e.site,url:e.url,reason:e.reason||(e.sessionStale?"rejected":"check")})}),(r=s.querySelector('[data-act="open"]'))==null||r.addEventListener("click",()=>ds(e.site,e.url)),(i=s.querySelector('[data-act="import"]'))==null||i.addEventListener("click",()=>{us({site:e.site,url:e.url,stale:!!e.sessionStale||e.reason==="expired"})}),s.querySelector('[data-act="retry"]').addEventListener("click",async()=>{try{await v.clearSiteChallenge(e.site),h(`${e.site}: waiting work resumes. If the puzzle comes back, solve it instead.`,"info")}catch(c){h("Failed: "+c.message,"error")}ps.delete(e.site),as()}),s.querySelector('[data-act="close"]').addEventListener("click",()=>{ea.add(e.site),as()}),s}function as(){let e=document.getElementById(ka);const t=[...ps.values()].filter(s=>!ea.has(s.site));if(t.length===0){e&&e.remove();return}e||(e=document.createElement("div"),e.id=ka,e.className="site-challenge-banners",document.body.appendChild(e)),e.replaceChildren(...t.map(el))}function Ea(e){!e||!e.site||(ps.set(e.site,e),as())}function tl(e){ps.delete(e),as()}async function Pl(){se.on("site:challenge",e=>{ea.delete(e.site),Ea(e)}),se.on("site:challenge-cleared",({site:e})=>tl(e));try{const e=await v.getSiteStatus();for(const t of e.challenges||[])Ea(t)}catch{}}let j={downloads:{},torrents:[],imports:[],queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,showEmptyChecks:!1,collapsed:{torrents:!1,imports:!1,active:!1,scheduled:!1,completed:!1,history:!0}},Qt=null,le={};function ta(e){if(!e)return"Never";const t=Date.now()-new Date(e).getTime(),s=Math.floor(t/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function sl(e){if(!e)return"Not scheduled";const t=new Date(e).getTime()-Date.now();if(t<=0)return"Running now...";const s=Math.floor(t/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const r=Math.floor(a/24),i=a%24;return`in ${r}d ${i}h`}function In(e){switch(e){case"download":return g("download");case"scrape":return g("search");case"scan":return g("folder");default:return g("settings")}}function sa(e){switch(e){case"running":return"var(--color-success)";case"queued":case"pending":case"waiting":return"var(--color-warning)";case"paused":return"var(--color-info)";case"complete":return"var(--color-success)";case"error":case"failed":case"cancelled":return"var(--color-error)";default:return"var(--text-secondary)"}}function aa(e){switch(e){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"waiting":return"⏳ Waiting for site";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return e}}function al(e){return!e||e==="default"?"Default (6h)":e==="daily"?"Daily":e==="weekly"?"Weekly":e}function nl(){const e=j.autoCheck;return e?`
    <div class="queue-inline-header">
      <span class="text-muted">${e.enabledCount} monitored · Last: ${ta(e.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">${g("play")} Run All Now</button>
    </div>
  `:""}function rl(e){const t=e.nextCheck?sl(e.nextCheck):"Not set",s=e.nextCheck&&new Date(e.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${e.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${g("book-open")}</span>
          <div>
            <div class="task-title">${e.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${al(e.schedule)}${e.schedule==="weekly"&&e.day?` · ${e.day.charAt(0).toUpperCase()+e.day.slice(1)}`:""}${(e.schedule==="daily"||e.schedule==="weekly")&&e.time?` · ${e.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?`${g("alarm-clock")} Due now`:t}</span>
        </div>
      </div>
    </div>
  `}function oe(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ol(e){const t=e.challenge||{},s=oe(e.waitingFor||t.site||e.site||"the site"),a=oe(t.url||`https://${e.waitingFor||t.site||e.site}/`),n=Z.isAdmin,r=t.reason||(t.sessionStale?"rejected":"check");return`
    <div class="task-challenge task-waiting">
      <span>${r==="expired"?`${s}'s verification cookies expired. Solve its check again; this download continues where it stopped.`:t.sessionStale?`${s} no longer accepts the saved cookies. Solve its check again; this download continues where it stopped.`:`${s} wants a human verification check. Once it is passed, this download continues where it stopped.`}${n?"":" (An admin has to pass it.)"}</span>
      ${n?`<button class="btn btn-sm btn-primary" data-action="solve" data-site="${s}" data-url="${a}" data-reason="${r}">Solve it here</button>`:""}
      ${n?`<button class="btn btn-sm btn-secondary" data-action="import-cookies" data-site="${s}" data-url="${a}" data-stale="${t.sessionStale||r==="expired"?"1":""}">Paste cookies</button>`:`<button class="btn btn-sm btn-secondary" data-action="open-site" data-site="${s}" data-url="${a}">Open ${s}</button>`}
    </div>`}function Sa(e,t){const s=t.total>0?Math.round(t.completed/t.total*100):0,a=t.status==="waiting",n=t.status==="running"||t.status==="queued"||a,r=t.status==="paused",i=(t.errors||[]).filter(d=>!d.waiting),c=i.length>0,l=!n&&!r&&c&&(t.chapterUrls||[]).length>0;return`
    <div class="queue-card task-card" data-task-id="${e}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${g("download")}</span>
          <div>
            <div class="task-title">${t.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${sa(t.status)}">${aa(t.status)}</div>
          </div>
        </div>
        <div class="task-actions">
          ${n&&!a?`<button class="btn btn-sm btn-icon" data-action="pause" data-task="${e}" title="Pause">${g("pause",{title:"Pause"})}</button>`:""}
          ${r?`<button class="btn btn-sm btn-icon" data-action="resume" data-task="${e}" title="Resume">${g("play",{title:"Resume"})}</button>`:""}
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
          <div class="task-errors">${g("triangle-alert")} ${i.length} error(s)</div>
          <ul class="task-error-list">${i.slice(0,5).map(d=>`<li>${typeof d.chapter=="number"?`Ch. ${d.chapter}: `:""}${oe(d.error)}</li>`).join("")}</ul>`:""}
        ${a?ol(t):l?`
          <div class="task-challenge">
            <button class="btn btn-sm btn-secondary" data-action="retry" data-task="${e}">Retry failed chapters</button>
          </div>`:""}
      </div>
    </div>
  `}function il(e){switch(e.status){case"downloading":return/paused|stopped/i.test(e.state||"")?"Paused":/queued|metaDL|checking/i.test(e.state||"")?"Waiting":"Downloading";case"grabbing":return"Fetching the release for qBittorrent";case"completed":return e.autoImport?"Downloaded, importing soon":"Downloaded";case"importing":return"Importing";case"imported":return"Imported";case"failed":return"Failed";case"removed":return"Removed from qBittorrent";default:return e.status}}function ll(e){return e.status==="imported"?"var(--success)":e.status==="failed"||e.status==="removed"?"var(--error)":e.status==="importing"||e.status==="completed"||e.status==="grabbing"?"var(--warning)":"var(--text-secondary)"}function cl(e){return!e||e<=0||e>=864e4?"":e<60?`${e}s`:e<3600?`${Math.round(e/60)}m`:`${Math.floor(e/3600)}h ${Math.round(e%3600/60)}m`}function dl(e){var d,u,p,m;const t=Math.round((e.progress||0)*100),s=e.status==="downloading",a=s&&/paused|stopped/i.test(e.state||""),n=["completed","failed","imported"].includes(e.status)&&(e.progress||0)>=1,r=e.bookmarkId?`<a href="#/manga/${oe(e.bookmarkId)}">open series</a>`:e.newSeriesTitle?`new series “${oe(e.newSeriesTitle)}”`:"",i=e.importResult,c=i?[(d=i.volumes)!=null&&d.length?`${i.volumes.length} volume${i.volumes.length===1?"":"s"} (${i.volumes.map(y=>y.name).join(", ")})`:"",(u=i.chapters)!=null&&u.length?`${i.chapters.length} chapter${i.chapters.length===1?"":"s"}`:"",(p=i.skipped)!=null&&p.length?`${i.skipped.length} skipped`:""].filter(Boolean).join(" · "):"",l=[Tt(e.size),s&&e.dlspeed?`${Tt(e.dlspeed)}/s`:"",s?cl(e.eta):"",e.indexer||""].filter(Boolean).join(" · ");return`
    <div class="queue-card task-card torrent-card" data-hash="${oe(e.hash)}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${g("download")}</span>
          <div>
            <div class="task-title" title="${oe(e.releaseTitle||e.name)}">${oe(e.name||e.releaseTitle)}</div>
            <div class="task-status" style="color: ${ll(e)}">${il(e)}${r?` · ${r}`:""}</div>
          </div>
        </div>
        <div class="task-actions">
          ${s&&!a?`<button class="btn btn-sm btn-icon" data-taction="pause" title="Pause">${g("pause",{title:"Pause"})}</button>`:""}
          ${a?`<button class="btn btn-sm btn-icon" data-taction="resume" title="Resume">${g("play",{title:"Resume"})}</button>`:""}
          ${n?`<button class="btn btn-sm btn-secondary" data-taction="review" title="Choose what to import, and as what">${e.status==="imported"?"Import again":"Review import"}</button>${e.status==="imported"?"":`<button class="btn btn-sm btn-secondary" data-taction="import" title="Import everything at the detected numbers">${e.status==="failed"?"Retry import":"Import all"}</button>`}`:""}
          <button class="btn btn-sm btn-icon btn-danger" data-taction="remove" title="${["imported","grabbing"].includes(e.status)?"Remove from this list":"Remove from qBittorrent and this list"}">✕</button>
        </div>
      </div>
      <div class="queue-card-body">
        ${["imported","grabbing"].includes(e.status)?`<div class="task-current">${l}</div>`:`
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${t}%"></div>
          <span class="progress-text">${t}%${l?` · ${l}`:""}</span>
        </div>`}
        ${c?`<div class="task-current">${g("check")} ${oe(c)}</div>`:""}
        ${(m=i==null?void 0:i.skipped)!=null&&m.length?`<ul class="task-error-list">${i.skipped.slice(0,4).map(y=>`<li>${oe(y)}</li>`).join("")}</ul>`:""}
        ${e.error?`<div class="task-errors">${g("triangle-alert")} ${oe(e.error)}</div>`:""}
      </div>
    </div>
  `}function ul(e){switch(e.status){case"queued":return"◌ Queued";case"running":return"● Importing";case"done":return"✓ Imported";case"failed":return"✗ Failed";default:return e.status}}function pl(e){return e.status==="done"?"var(--color-success)":e.status==="failed"?"var(--color-error)":"var(--color-warning)"}function hl(e){var c,l,d,u;const t=e.total||0,s=e.status==="done"?t:e.done||0,a=t>0?Math.round(s/t*100):e.status==="done"?100:0,n=e.summary,r=n?[(c=n.volumes)!=null&&c.length?`${n.volumes.length} volume${n.volumes.length===1?"":"s"} (${n.volumes.map(p=>p.name).join(", ")})`:"",(l=n.chapters)!=null&&l.length?`${n.chapters.length} chapter${n.chapters.length===1?"":"s"}`:"",(d=n.skipped)!=null&&d.length?`${n.skipped.length} skipped`:""].filter(Boolean).join(" · "):"",i=e.bookmarkId?`<a href="#/manga/${oe(e.bookmarkId)}">${oe(e.bookmarkTitle||"open series")}</a>`:e.bookmarkTitle?`new series “${oe(e.bookmarkTitle)}”`:"";return`
    <div class="queue-card task-card import-card" data-import-id="${oe(e.id)}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${g(e.path?"folder":"package")}</span>
          <div>
            <div class="task-title" title="${oe(e.path||e.title)}">${oe(e.title)}</div>
            <div class="task-status" style="color: ${pl(e)}">${ul(e)}${i?` · into ${i}`:""}</div>
          </div>
        </div>
      </div>
      <div class="queue-card-body">
        ${e.status==="running"||e.status==="queued"?`
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${a}%"></div>
            <span class="progress-text">${t?`${s} / ${t} items (${a}%)`:"Starting…"}</span>
          </div>
          ${e.current?`<div class="task-current">Currently: ${oe(e.current)}</div>`:""}`:""}
        ${e.status==="done"&&r?`<div class="task-current">${oe(r)}</div>`:""}
        ${e.status==="done"&&((u=n==null?void 0:n.skipped)!=null&&u.length)?`<ul class="task-error-list">${n.skipped.slice(0,5).map(p=>`<li>${oe(p)}</li>`).join("")}</ul>`:""}
        ${e.status==="failed"?`<div class="task-errors">${g("triangle-alert")} ${oe(e.error||"Import failed")}</div>`:""}
      </div>
    </div>
  `}function ml(e){const t=e.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${In(e.type)}</span>
          <div>
            <div class="task-title">${t.description||t.mangaTitle||e.type}</div>
            <div class="task-status" style="color: ${sa(e.status)}">${aa(e.status)}</div>
          </div>
        </div>
      </div>
      ${e.status==="waiting"&&e.error?`<div class="queue-card-body"><div class="task-challenge task-waiting"><span>${oe(e.error)}</span></div></div>`:e.started_at?`<div class="queue-card-body"><small>Started: ${ta(e.started_at)}</small></div>`:""}
    </div>
  `}function gl(e){const t=e.data||{},s=e.result||{};let a="";if(e.type==="scrape")s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${e.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>');else if(e.type==="scan"||e.type==="scan-local")s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`);else if(e.type==="download"){if(e.status==="failed"&&e.error)a=`<div class="task-subtext" style="color: var(--color-error, #e05555);">${e.error}</div>`;else if(s.downloaded!==void 0){const n=[`${s.downloaded} chapter${s.downloaded===1?"":"s"} downloaded`];s.pages&&n.push(`${s.pages} pages`),s.failed&&n.push(`${s.failed} failed`);const r=(s.errors||[]).filter(i=>i.partial);r.length&&n.push(`${r.length} with missing pages`),a=`<div class="task-subtext" style="color: var(--text-secondary);">${n.join(" · ")}</div>`}}return`
    <div class="queue-card task-card history-card" data-history-id="${e.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${In(e.type)}</span>
          <div>
            <div class="task-title">${t.description||t.mangaTitle||e.type}</div>
            <div class="task-status" style="color: ${sa(e.status)}">${aa(e.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${e.completed_at?`<div class="queue-card-body"><small>Completed: ${ta(e.completed_at)}</small></div>`:""}
    </div>
  `}function fl(){var u;const e=Object.entries(j.downloads),t=e.filter(([,p])=>p.status!=="complete"),s=e.filter(([,p])=>p.status==="complete"),a=new Set(t.map(([,p])=>p.bookmarkId).filter(Boolean)),n=j.queueTasks.filter(p=>{var m;return!(p.type==="download"&&((m=p.data)!=null&&m.mangaId)&&a.has(p.data.mangaId))}),r=j.torrents.filter(p=>["downloading","completed","importing"].includes(p.status)),i=j.imports.filter(p=>p.status==="running"||p.status==="queued"),c=n.filter(p=>p.type!=="import"),l=t.length+c.length+r.length+i.length,d=((u=j.autoCheck)==null?void 0:u.schedules)||[];return`
    ${ve("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>${g("list-checks")} Task Queue</h2>
        ${l>0?`<span class="queue-badge">${l} active</span>`:""}
      </div>

      ${j.torrents.length>0?`
        <div class="queue-section ${j.collapsed.torrents?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="torrents">
            <span class="collapse-icon">▼</span> Torrents (${r.length} active)
          </h3>
          <div class="queue-section-content">
            ${j.torrents.map(dl).join("")}
          </div>
        </div>
      `:""}

      ${j.imports.length>0?`
        <div class="queue-section ${j.collapsed.imports?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="imports">
            <span class="collapse-icon">▼</span> Imports (${i.length} active)
          </h3>
          <div class="queue-section-content">
            ${j.imports.map(hl).join("")}
          </div>
        </div>
      `:""}

      ${t.length>0||c.length>0?`
        <div class="queue-section ${j.collapsed.active?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${t.map(([p,m])=>Sa(p,m)).join("")}
            ${c.map(p=>ml(p)).join("")}
          </div>
        </div>
      `:""}

      ${d.length>0?`
        <div class="queue-section ${j.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${d.length})
            </h3>
            ${nl()}
          </div>
          <div class="queue-section-content">
            ${d.map(p=>rl(p)).join("")}
          </div>
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section ${j.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${s.map(([p,m])=>Sa(p,m)).join("")}
          </div>
        </div>
      `:""}

      ${j.historyTasks&&j.historyTasks.length>0?(()=>{const p=f=>{if(f.type!=="scrape")return!1;const b=f.result||{};return(f.status==="complete"||f.status==="completed")&&(b.newChaptersCount===0||b.updated===!1)},m=j.historyTasks.filter(p).length,y=j.showEmptyChecks?j.historyTasks:j.historyTasks.filter(f=>!p(f));return`
        <div class="queue-section ${j.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${m>0?`
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${j.showEmptyChecks?"Hide":"Show"} checks with no new chapters">
                    ${j.showEmptyChecks?`${g("chevron-up")} Hide`:`${g("chevron-down")} Show`} empty checks (${m})
                  </button>
                `:""}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  ${g("trash-2")} Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${y.length>0?y.map(f=>gl(f)).join(""):`
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${m>0?`${m} empty check(s) hidden.`:""}</p>
                  </div>
                `}
            </div>
        </div>
      `})():""}

      ${t.length===0&&n.length===0&&s.length===0&&d.length===0&&(!j.historyTasks||j.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">${g("check")}</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function Pe(){try{const[e,t,s,a,n,r]=await Promise.all([v.getDownloads().catch(()=>({})),v.getQueueTasks().catch(()=>[]),v.getQueueHistory(50).catch(()=>[]),v.getAutoCheckStatus().catch(()=>null),v.getTorrentDownloads().catch(()=>({torrents:[]})),v.getImports().catch(()=>({imports:[]}))]);j.downloads=e||{},j.torrents=(n==null?void 0:n.torrents)||[],j.imports=(r==null?void 0:r.imports)||[],j.queueTasks=t||[],j.historyTasks=s||[],j.autoCheck=a,j.loading=!1}catch(e){console.error("[Queue] Failed to load data:",e),j.loading=!1}}function fe(){const e=document.getElementById("app");e&&(e.innerHTML=fl(),vl())}function vl(){Ue(),document.querySelectorAll("[data-toggle]").forEach(a=>{a.addEventListener("click",n=>{const r=a.dataset.toggle;j.collapsed[r]=!j.collapsed[r],fe()})});const e=document.getElementById("run-autocheck-btn");e&&e.addEventListener("click",async()=>{e.disabled=!0,e.innerHTML=`${g("loader",{spin:!0})} Running...`;try{h("Auto-check started...","info");const a=await v.runAutoCheck();h(`Check complete: ${a.checked} checked, ${a.updated} updated`,"success"),await Pe(),fe()}catch(a){h("Auto-check failed: "+a.message,"error"),e.disabled=!1,e.innerHTML=`${g("play")} Run Now`}});const t=document.getElementById("clear-history-btn");t&&t.addEventListener("click",async a=>{if(a.stopPropagation(),await ne("Are you sure you want to clear the task history?",{danger:!0}))try{await v.clearQueueHistory(),h("History cleared","success"),await Pe(),fe()}catch(n){h(`Failed to clear history: ${n.message}`,"error")}});const s=document.getElementById("toggle-empty-checks-btn");s&&s.addEventListener("click",a=>{a.stopPropagation(),j.showEmptyChecks=!j.showEmptyChecks,fe()}),document.querySelectorAll(".scheduled-manga-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.mangaId;n&&(window.location.hash=`#/manga/${n}`)})}),document.querySelectorAll(".torrent-card [data-taction]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const r=a.closest(".torrent-card").dataset.hash,i=j.torrents.find(l=>l.hash===r),c=a.dataset.taction;try{if(c==="pause")await v.pauseTorrent(r);else if(c==="resume")await v.resumeTorrent(r);else if(c==="review"){fn(i,{onImported:async()=>{await Pe(),fe()}});return}else if(c==="import")a.disabled=!0,a.textContent="Queued…",await v.importTorrent(r),h("Import queued; its progress shows under Imports","info");else if(c==="remove"){const l=i&&["imported","removed"].includes(i.status);let d=!1;if(!l){const u=await ne(`Remove "${(i==null?void 0:i.name)||"this torrent"}" from qBittorrent and stop tracking it?`,{danger:!0,confirmText:"Remove",option:"Also delete its downloaded files from disk"});if(!u.ok)return;d=u.option}await v.removeTorrent(r,{deleteFiles:d,fromClient:!l}),h("Torrent removed","info")}await Pe(),fe()}catch(l){h(`Action failed: ${l.message}`,"error"),await Pe(),fe()}})}),document.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const r=a.dataset.action,i=a.dataset.task;if(r==="open-site"){ds(a.dataset.site,a.dataset.url);return}if(r==="import-cookies"){us({site:a.dataset.site,url:a.dataset.url,stale:a.dataset.stale==="1"});return}if(r==="solve"){cs({site:a.dataset.site,url:a.dataset.url,reason:a.dataset.reason});return}try{if(r==="pause")await v.pauseDownload(i),h("Download paused","info");else if(r==="resume")await v.resumeDownload(i),h("Download resumed","info");else if(r==="cancel")await ne("Cancel this download?")&&(await v.cancelDownload(i),h("Download cancelled","info"));else if(r==="retry"){const c=await v.retryDownload(i);h(`Retrying ${c.chapters.length} chapter${c.chapters.length===1?"":"s"}`,"info")}await Pe(),fe()}catch(c){h(`Action failed: ${c.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.historyId,r=document.getElementById(`task-details-${n}`);r&&r.classList.toggle("hidden")})})}async function yl(){j.loading=!0;const e=document.getElementById("app");e.innerHTML=`
    ${ve("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>${g("list-checks")} Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,Ue(),await Pe(),fe(),Qt=setInterval(async()=>{await Pe(),fe()},5e3),le.downloadProgress=t=>{t.taskId&&j.downloads[t.taskId]&&(Object.assign(j.downloads[t.taskId],t),fe())},le.downloadCompleted=t=>{Pe().then(fe)},le.queueUpdated=t=>{Pe().then(fe)},le.torrentUpdate=t=>{Array.isArray(t==null?void 0:t.torrents)&&(j.torrents=t.torrents,fe())},le.importProgress=t=>{if(!(t!=null&&t.id))return;const s=j.imports.findIndex(a=>a.id===t.id);s>=0?j.imports[s]=t:j.imports.unshift(t),fe()},se.on(ie.IMPORT_PROGRESS,le.importProgress),se.on(ie.DOWNLOAD_PROGRESS,le.downloadProgress),se.on(ie.DOWNLOAD_COMPLETED,le.downloadCompleted),se.on(ie.QUEUE_UPDATED,le.queueUpdated),se.on(ie.TORRENT_UPDATE,le.torrentUpdate)}function bl(){Qt&&(clearInterval(Qt),Qt=null),le.downloadProgress&&se.off(ie.DOWNLOAD_PROGRESS,le.downloadProgress),le.downloadCompleted&&se.off(ie.DOWNLOAD_COMPLETED,le.downloadCompleted),le.queueUpdated&&se.off(ie.QUEUE_UPDATED,le.queueUpdated),le.torrentUpdate&&se.off(ie.TORRENT_UPDATE,le.torrentUpdate),le.importProgress&&se.off(ie.IMPORT_PROGRESS,le.importProgress),le={}}const wl={mount:yl,unmount:bl};function ke(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function $l(e){if(!e)return"";const t=Math.floor((Date.now()-new Date(e).getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t}m ago`;const s=Math.floor(t/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}class kl{constructor(){this.container=null,this.scrapers=[],this.siteStatus={challenges:[],sessions:[]},this.onSiteStatusChange=null,this.currentQuery="",this.currentTarget="all",this.isSearching=!1,this.results=[],this.viewMode="main",this.browseScraper=null,this.browseQuery="",this.browseSort="popular",this.browsePage=1,this.browseTotalPages=1,this.isBrowsing=!1,this.browseResults=[],this.previewInfo=null,this.previewImages=[],this.previewIndex=0,this.infoAbortController=null}async mount(t){this.container=document.getElementById("app"),document.body.className="scrapers-mode";const s=new URLSearchParams(window.location.hash.split("?")[1]||""),a=s.get("browse"),n=s.get("q");a&&(this.browseScraper=a,this.viewMode="browse",this.browseQuery=n||"",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1),this.updateView(),this.onSiteStatusChange=()=>this.loadSiteStatus(),se.on(ie.SITE_SESSION,this.onSiteStatusChange),se.on(ie.SITE_CHALLENGE,this.onSiteStatusChange),se.on(ie.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),await this.loadScrapers(),this.viewMode==="browse"&&this.browseScraper?(a&&(this.startBrowse(a,{query:n||null}),this.updateView()),this.performBrowse()):n&&(this.currentQuery=n,this.updateView(),this.performSearch())}unmount(){this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.onSiteStatusChange&&(se.off(ie.SITE_SESSION,this.onSiteStatusChange),se.off(ie.SITE_CHALLENGE,this.onSiteStatusChange),se.off(ie.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),this.onSiteStatusChange=null),this.container.innerHTML="",document.body.className=""}async loadScrapers(){try{const[t,s]=await Promise.all([v.get("/scrapers/list"),v.getSiteStatus().catch(()=>({challenges:[],sessions:[]}))]);this.siteStatus=s||{challenges:[],sessions:[]},t.success&&(this.scrapers=t.scrapers,this.updateView())}catch(t){console.error("Failed to load scrapers",t)}}async loadSiteStatus(){try{this.siteStatus=await v.getSiteStatus()}catch{return}document.getElementById("scraper-cards-list")&&(this.renderScraperList(),this.bindCardEvents())}sessionFor(t){return(this.siteStatus.sessions||[]).find(s=>s.site===t)||null}browseConfig(t=this.browseScraper){const s=this.scrapers.find(n=>n.name===t),a=s&&s.browseOptions;return{sorts:a&&a.sorts&&a.sorts.length?a.sorts:[{value:"popular",label:"Popular"}],defaultSort:a&&a.defaultSort||"popular",defaultQuery:a&&a.defaultQuery||"",queryLabel:a&&a.queryLabel||"Search",queryPlaceholder:a&&a.queryPlaceholder||"Optional: title to search for"}}startBrowse(t,{query:s=null,sort:a=null}={}){const n=this.browseConfig(t);this.browseScraper=t,this.viewMode="browse",this.browseQuery=s??n.defaultQuery,this.browseSort=a&&n.sorts.some(r=>r.value===a)?a:n.defaultSort,this.browsePage=1,this.browseResults=[],this.browseTotalPages=1}challengeFor(t){return(this.siteStatus.challenges||[]).find(s=>s.site===t)||null}renderSessionRow(t){if(!t.supportsSession)return"";const s=this.sessionFor(t.name),a=this.challengeFor(t.name);let n;if(s&&s.stale)n=`<span class="capability-pill capability-soon" title="${ke(s.staleReason||"The site showed its check again")}">${g("triangle-alert")} Rejected, solve again</span>`;else if(s&&s.cookieCount===0)n=`<span class="capability-pill capability-soon" title="Every saved cookie has expired">${g("triangle-alert")} Expired, solve again</span>`;else if(s){const r=$l(s.updatedAt||s.importedAt),i=Z.isAdmin?`${(s.cookieNames||[]).join(", ")}${s.userAgent?`
${s.userAgent}`:""}`:"";n=`<span class="capability-pill capability-yes" title="${ke(i)}">✓ ${s.cookieCount} cookie${s.cookieCount===1?"":"s"}${r?` · ${r}`:""}</span>`}else a?n=`<span class="capability-pill capability-soon">${g("triangle-alert")} Check pending</span>`:n='<span class="capability-pill capability-no">None</span>';return`
      <div class="capability-row">
        <span class="capability-label" title="Cookies from a browser that completed the site's human check">${g("lock-open")} Session</span>
        <span class="scraper-session-cell">
          ${n}
          ${s&&Z.isAdmin?`<button type="button" class="scraper-session-forget" data-scraper="${ke(t.name)}" title="Forget these cookies">Forget</button>`:""}
        </span>
      </div>`}bindCardEvents(){document.querySelectorAll(".scraper-search-card-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper;this.currentTarget=a;const n=document.getElementById("scraper-query");n&&(this.currentQuery=n.value.trim()),this.updateView();const r=document.getElementById("scraper-query");r&&(r.focus(),window.scrollTo({top:0,behavior:"smooth"}),this.currentQuery&&this.performSearch())})}),document.querySelectorAll(".scraper-browse-card-btn").forEach(t=>{t.addEventListener("click",s=>{this.startBrowse(s.currentTarget.dataset.scraper),this.updateView(),this.performBrowse()})}),document.querySelectorAll(".scraper-session-card-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper,n=this.challengeFor(a),r=this.sessionFor(a),i=!!r&&(r.stale||r.cookieCount===0);us({site:a,url:n==null?void 0:n.url,stale:i,onImported:()=>this.loadSiteStatus()})})}),document.querySelectorAll(".scraper-session-solve-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper,n=this.challengeFor(a),r=this.sessionFor(a),i=(n==null?void 0:n.reason)||(r&&(r.stale||r.cookieCount===0)?"rejected":"check");cs({site:a,url:n==null?void 0:n.url,reason:i,onSolved:()=>this.loadSiteStatus()})})}),document.querySelectorAll(".scraper-session-forget").forEach(t=>{t.addEventListener("click",async s=>{const a=s.currentTarget.dataset.scraper;if(await ne(`Forget the saved ${a} cookies? The scraper goes back to its own identity.`,{danger:!0}))try{(await v.forgetSiteSession(a)).purged===null?h(`${a}: cookies forgotten, but they may stay in the scraper browser until it restarts`,"warning"):h(`${a}: saved cookies forgotten`,"info"),await this.loadSiteStatus()}catch(n){h(`Failed: ${n.message}`,"error")}})})}updateView(){this.render(),this.renderScraperList(),(this.results.length>0||this.isSearching)&&this.renderResults(),this.bindEvents()}render(){this.container.innerHTML=`
      ${ve()}
      <div class="view-container scrapers-container" style="${this.viewMode==="main"?"":"display: none;"}">
        <div class="view-header">
          <h1>${g("plug")} Scrapers</h1>
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
                ${Z.canDownload?`<button type="button" class="btn btn-secondary" id="torrent-search-btn" title="Search the torrent indexers (Prowlarr) for volume releases">${g("package")} Volumes</button>`:""}
              </div>
            </form>
          </div>

          <div id="scraper-results-container" class="scraper-results${this.results.length>0||this.isSearching?"":" scraper-results--hidden"}">
             <div class="empty-state">
               <div class="empty-icon">${g("search-x")}</div>
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
             ${this.browseScraper?this.getDomainIcon(this.browseScraper):g("globe")} Browse: ${this.browseScraper}
          </h1>
        </div>

        <div class="browse-controls-box">
          <div class="browse-form-group" style="flex: 1; min-width: 200px;">
            <label>${ke(this.browseConfig().queryLabel)}</label>
            <input type="text" id="browse-query" class="browse-input" value="${ke(this.browseQuery)}" placeholder="${ke(this.browseConfig().queryPlaceholder)}">
          </div>
          <div class="browse-form-group" style="min-width: 150px;">
            <label>Sort By</label>
            <select id="browse-sort" class="browse-select">
              ${this.browseConfig().sorts.map(t=>`<option value="${ke(t.value)}" ${this.browseSort===t.value?"selected":""}>${ke(t.label)}</option>`).join("")}
            </select>
          </div>
          <div class="browse-actions" style="display: flex; gap: 8px;">
            <button id="browse-apply-btn" class="btn btn-primary">Apply Filters</button>
            <button id="browse-refresh-btn" class="btn btn-secondary" title="Bypass cache and reload fresh results">${g("refresh-cw")} Refresh</button>
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
              <button id="preview-read-btn" class="btn btn-primary" style="background: var(--success);">${g("book-open")} Read Now</button>
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
    `,Ue()}renderScraperList(){const t=document.getElementById("scraper-cards-list");if(!t)return;if(this.scrapers.length===0){t.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">${g("plug")}</div>
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
              <span class="capability-label">${g("search")} Search</span>
              ${n.canSearch?'<span class="capability-pill capability-yes">✓ Supported</span>':'<span class="capability-pill capability-no">✗ Not available</span>'}
            </div>
            <div class="capability-row">
              <span class="capability-label">${g("plus")} Adding</span>
              <span class="capability-pill capability-yes">✓ Supported</span>
            </div>
            <div class="capability-row">
              <span class="capability-label">${g("book-open")} Browsing</span>
              ${n.canBrowse?'<span class="capability-pill capability-yes">✓ Supported</span>':`<span class="capability-pill capability-soon">${g("traffic-cone")} Coming soon</span>`}
            </div>
            ${this.renderSessionRow(n)}
          </div>

          <div class="scraper-card-footer">
            <button
              class="btn btn-secondary scraper-search-card-btn"
              data-scraper="${n.name}"
              ${n.canSearch?"":"disabled"}
              title="${n.canSearch?`Search in ${n.name}`:"Search not supported"}"
            >${g("search")} Search</button>
            <button
              class="btn btn-secondary scraper-browse-card-btn"
              data-scraper="${n.name}"
              ${n.canBrowse?"":"disabled"}
              title="${n.canBrowse?`Browse ${n.name}`:"Browsing coming soon"}"
            >${g("book-open")} Browse</button>
            ${n.supportsSession&&Z.isAdmin?`
            <button
              class="btn btn-secondary scraper-session-solve-btn"
              data-scraper="${ke(n.name)}"
              title="Pass ${ke(n.name)}'s human check inside the scraper's own browser"
            >${g("lock-open")} Solve check</button>
            <button
              class="btn btn-secondary scraper-session-card-btn"
              data-scraper="${ke(n.name)}"
              title="Hand over cookies from a browser that completed ${ke(n.name)}'s human check"
            >Cookies</button>`:""}
          </div>

        </div>
      `);t.innerHTML=a.join("")}getDomainIcon(t){const s=t.toLowerCase();return s.includes("comix")?g("library"):s.includes("mangahere")?g("book-open"):s.includes("nhentai")?g("shield-alert"):s.includes("chained")?g("link"):g("globe")}bindEvents(){const t=document.getElementById("scraper-search-form");t&&t.addEventListener("submit",y=>{y.preventDefault();const f=document.getElementById("scraper-query");f&&f.value.trim()&&(this.currentQuery=f.value.trim(),this.performSearch())});const s=document.getElementById("torrent-search-btn");s&&s.addEventListener("click",async()=>{var b;const y=(((b=document.getElementById("scraper-query"))==null?void 0:b.value)||"").trim();let f=[];try{const C=await v.getBookmarks();f=(Array.isArray(C)?C:C.bookmarks||[]).map(w=>({id:w.id,title:w.title,alias:w.alias})).sort((w,L)=>(w.alias||w.title).localeCompare(L.alias||L.title))}catch{}hn({query:y,library:f})});const a=document.getElementById("clear-target-btn");a&&a.addEventListener("click",()=>{this.currentTarget="all",this.updateView();const y=document.getElementById("scraper-query");y&&y.focus()}),this.bindCardEvents();const n=document.getElementById("exit-browse-btn");n&&n.addEventListener("click",()=>{this.viewMode="main",this.updateView()});const r=document.getElementById("browse-apply-btn");r&&r.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse()});const i=document.getElementById("browse-refresh-btn");i&&i.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse(!1,!0)});const c=document.getElementById("browse-query");c&&c.addEventListener("keypress",y=>{y.key==="Enter"&&r.click()});const l=document.getElementById("browse-load-more-btn");l&&l.addEventListener("click",()=>{!this.isBrowsing&&this.browsePage<this.browseTotalPages&&(this.browsePage++,this.performBrowse(!0))});const d=document.getElementById("preview-close-btn");d&&d.addEventListener("click",()=>{this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),document.getElementById("preview-info-modal").style.display="none"});const u=document.getElementById("preview-add-btn");u&&u.addEventListener("click",()=>{this.previewInfo&&this.previewInfo.url&&this.openAddModal(this.previewInfo.url,u)});const p=document.getElementById("preview-read-btn");p&&p.addEventListener("click",()=>{p.disabled||(this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.openTempReader())});const m=document.getElementById("temp-reader-close");m&&m.addEventListener("click",()=>{document.getElementById("temp-reader-overlay").style.display="none"})}async performSearch(){const t=document.getElementById("scraper-results-container"),s=document.getElementById("scraper-search-btn");if(!t||!s)return;this.isSearching=!0,t.style.display="block",s.textContent="Searching...",s.disabled=!0;const a=this.currentTarget==="all"?"all sites":this.currentTarget;t.innerHTML=`
      <div class="loading-state" style="margin-top: 2rem;">
        <div class="spinner"></div>
        <p>Searching ${a} for "${this.currentQuery}"...</p>
        <p class="subtitle">This may take a minute...</p>
      </div>
    `;try{const n=await v.get(`/scrapers/search?q=${encodeURIComponent(this.currentQuery)}&scraper=${encodeURIComponent(this.currentTarget)}`);if(n.success)this.results=n.results||[],this.renderResults();else throw new Error(n.error||"Failed to search scrapers")}catch(n){console.error("Search error",n),t.innerHTML=`<div class="error-state" style="margin-top: 2rem;">Failed to perform search: ${n.message}</div>`}finally{this.isSearching=!1,s.textContent="Search",s.disabled=!1}}renderResults(){const t=document.getElementById("scraper-results-container");if(!t)return;if(this.results.length===0){t.innerHTML=`
        <div class="empty-state" style="margin-top: 2rem;">
          <div class="empty-icon">${g("search-x")}</div>
          <p>No results found for "${this.currentQuery}".</p>
        </div>
      `;return}let s='<div class="library-grid" style="margin-top: 2rem;">';this.results.forEach(a=>{const n=a.cover||"";let r="";n.startsWith("/covers/")?r=n:n&&(r=`/api/scrapers/proxy-cover?url=${encodeURIComponent(n)}`);const i=r?Me(r,"Cover",{kind:"series",self:!0}):be("series");s+=`
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
      `}),s+="</div>",t.innerHTML=s,setTimeout(()=>{document.querySelectorAll(".scraper-result-card").forEach(a=>{a.addEventListener("click",n=>{n.target.closest(".add-from-search-btn")||window.open(a.dataset.url,"_blank")})}),document.querySelectorAll(".add-from-search-btn").forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation();const r=n.target.dataset.url;this.openAddModal(r,n.target)})})},100)}async _addToLibraryAndWait(t){const s=await v.addBookmark(t);if(!s.jobId)throw new Error("No job ID returned");return new Promise((a,n)=>{const r=setInterval(async()=>{try{const c=(await v.getQueueHistory(20)).find(l=>l.id===s.jobId);c&&(c.status==="completed"?(clearInterval(r),c.result&&c.result.bookmark?a(c.result.bookmark):n(new Error("Job completed but returned no bookmark"))):c.status==="failed"&&(clearInterval(r),n(new Error(c.error))))}catch{}},1e3)})}async openAddModal(t,s){const a=s?s.textContent:"+ Add to Library";s&&(s.textContent="Adding...");try{const n=await this._addToLibraryAndWait(t);document.getElementById("preview-info-modal").style.display="none",window.location.hash=`#/manga/${n.id}`}catch(n){h("Error adding manga: "+n.message,"error")}finally{s&&(s.textContent=a)}}async performBrowse(t=!1,s=!1){const a=document.getElementById("browse-results-container"),n=document.getElementById("browse-load-more-btn"),r=document.getElementById("browse-loading-indicator"),i=document.getElementById("browse-pagination");if(a){this.isBrowsing=!0,t?(n.style.display="none",r.style.display="block",document.getElementById("browse-loading-page").textContent=this.browsePage):(a.innerHTML=`
        <div class="loading-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="spinner"></div>
          <p>Browsing ${this.browseScraper}...</p>
        </div>
      `,i.style.display="none");try{let c=`/scrapers/browse?scraper=${encodeURIComponent(this.browseScraper)}&q=${encodeURIComponent(this.browseQuery)}&sort=${encodeURIComponent(this.browseSort)}&page=${this.browsePage}`;s&&(c+="&refresh=true");const l=await v.get(c);if(l.success)t?this.browseResults=[...this.browseResults,...l.results||[]]:this.browseResults=l.results||[],this.browseTotalPages=l.totalPages||1,this.renderBrowseResults(t);else throw new Error(l.error||"Failed to browse")}catch(c){console.error("Browse error",c),t?h("Failed to load more results: "+c.message,"error"):a.innerHTML=`<div class="error-state" style="grid-column: 1/-1; margin-top: 2rem;">Failed to load browse results: ${c.message}</div>`}finally{this.isBrowsing=!1,t&&(n.style.display="inline-block",r.style.display="none")}}}renderBrowseResults(t){const s=document.getElementById("browse-results-container"),a=document.getElementById("browse-pagination");if(this.browseResults.length===0){s.innerHTML=`
        <div class="empty-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="empty-icon">${g("search-x")}</div>
          <p>No results found.</p>
        </div>
      `,a.style.display="none";return}let n="";this.browseResults.forEach((r,i)=>{const c=r.cover||"";let l="";c.startsWith("/covers/")?l=c:c&&(l=`/api/scrapers/proxy-cover?url=${encodeURIComponent(c)}`);const d=l?Me(l,"Cover",{kind:"series",self:!0}):be("series");n+=`
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
               ${t.cover?`<img src="${t.cover.startsWith("/covers/")?t.cover:"/api/scrapers/proxy-cover?url="+encodeURIComponent(t.cover)}" style="width: 100%; height: 100%; object-fit: cover;">`:be("series")}
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
    `,this._setReadBtnEnabled(r,!1);try{const c=await v.get(`/scrapers/info?url=${encodeURIComponent(t.url)}`,{signal:s});if(c.success&&c.info){this.previewInfo={...this.previewInfo,...c.info},Array.isArray(c.info.chapters)&&c.info.chapters.length>1&&((i=c.info.chapters[0])!=null&&i.url)&&(this.previewInfo.readUrl=c.info.chapters[0].url);let l="";c.info.tags&&c.info.tags.length>0&&(l=`
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
          `,this._setReadBtnEnabled(r,!0)}else document.getElementById("preview-extended-info").innerHTML='<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>',(this.previewInfo.galleryId||this.previewInfo.url)&&this._setReadBtnEnabled(r,!0)}catch(c){if(c.name==="AbortError"||s.aborted){console.log("Scraper details fetch aborted successfully.");return}console.error("Info error:",c),document.getElementById("preview-extended-info").innerHTML=`<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${c.message}</p>`,this._setReadBtnEnabled(r,!0)}}_setReadBtnEnabled(t,s){t&&(t.disabled=!s,t.style.opacity=s?"1":"0.5",t.style.cursor=s?"pointer":"not-allowed",t.style.pointerEvents=s?"auto":"none")}async openTempReader(){if(!this.previewInfo||!this.previewInfo.url&&!this.previewInfo.galleryId)return;const t=this.previewInfo.readUrl||this.previewInfo.url||`https://nhentai.net/g/${this.previewInfo.galleryId}/`,s=this.browseScraper||this.previewInfo.website;sessionStorage.setItem("streamPreviewUrl",t),sessionStorage.setItem("streamPreviewTitle",this.previewInfo.title||"Preview"),s?sessionStorage.setItem("streamPreviewScraper",s):sessionStorage.removeItem("streamPreviewScraper"),document.getElementById("preview-info-modal").style.display="none",window.location.hash="#/read/stream/preview"}}const El=new kl,Ca={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};let P=null;function Sl(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function xa(e,t=0){for(let s=e.length-1;s>t;s--){const a=t+Math.floor(Math.random()*(s-t+1));[e[s],e[a]]=[e[a],e[s]]}}function Cl(e){let t;return typeof e=="string"?t=e:e&&typeof e=="object"&&(t=e.filename||e.path||e.name||e.url),t?(t.includes("/")&&(t=t.split("/").pop()),t.includes("\\")&&(t=t.split("\\").pop()),t):null}function xl(e){return g(e==="gallery"?"folder":e==="trophy"?"trophy":"book-open")}function Ll(e,t){const s=[];for(const a of e){if(t.has(a.id))continue;const n=a.alias||a.title;for(const r of a.volumes)r.cover&&s.push({url:r.cover,title:n,subtitle:r.name,kind:"volume"})}return s}async function Il(){var a,n;const e=await v.getFavorites(),t=(a=e.listOrder)!=null&&a.length?e.listOrder:Object.keys(e.favorites||{}),s=[];for(const r of t)for(const i of((n=e.favorites)==null?void 0:n[r])||[])for(const c of i.imagePaths||[]){const l=Cl(c);l&&s.push({url:`/api/public/chapter-images/${i.mangaId}/${i.chapterNum}/${encodeURIComponent(l)}`,title:r,subtitle:i.mangaTitle?`${i.mangaTitle} · Ch. ${i.chapterNum}`:`Ch. ${i.chapterNum}`,kind:"gallery"})}return s}async function Tl(e){const t=await v.get("/trophy-pages"),s=await $e.loadBookmarks().catch(()=>[]),a=r=>{const i=s.find(c=>c.id===r);return i?i.alias||i.title:"Trophies"},n=[];for(const[r,i]of Object.entries(t||{}))if(!e.has(r))for(const[c,l]of Object.entries(i||{})){const d=Object.keys(l||{});if(d.length===0)continue;let u;try{u=(await v.getChapterImages(r,c)).images||[]}catch{continue}for(const p of d){const m=u[p];if(!m)continue;let y=typeof m=="string"?m.split("/").pop():(m==null?void 0:m.filename)||(m==null?void 0:m.path);if(y){try{y=decodeURIComponent(y)}catch{}n.push({url:`/api/public/chapter-images/${r}/${c}/${encodeURIComponent(y)}`,title:a(r),subtitle:`Ch. ${c} · Trophy`,kind:"trophy"})}}}return n}function Tn(){P&&(clearTimeout(P.timer),P.playing&&P.slides.length>1&&(P.timer=setTimeout(()=>_e(P.index+1),P.config.intervalMs)))}function Fs(){if(!P)return;const e=P.slides[P.index],t=document.getElementById("ss-counter"),s=document.getElementById("ss-title"),a=document.getElementById("ss-subtitle");t&&(t.textContent=P.slides.length?`${P.index+1} / ${P.slides.length}`:""),s&&e&&(s.innerHTML=`${xl(e.kind)} ${Sl(e.title)}`),a&&e&&(a.textContent=e.subtitle||"")}function _e(e){if(!P||P.slides.length===0)return;const t=(e%P.slides.length+P.slides.length)%P.slides.length;P.index=t;const s=P.slides[t],a=++P.loadToken,n=1-P.activeLayer,r=P.layers[n],i=P.layers[P.activeLayer];r.onload=()=>{if(!(!P||a!==P.loadToken)&&(P.activeLayer=n,r.classList.add("active"),i.classList.remove("active"),Fs(),Tn(),P.slides.length>1)){const c=P.slides[(t+1)%P.slides.length];c&&(new Image().src=c.url)}},r.onerror=()=>{if(!(!P||a!==P.loadToken)){if(P.slides.splice(t,1),P.slides.length===0){Us();return}_e(t)}},r.src=s.url,Fs()}function La(e){if(!P)return;P.playing=e;const t=document.getElementById("ss-play");t&&(t.innerHTML=g(e?"pause":"play")),Tn()}function Le(){if(!P)return;const e=document.getElementById("slideshow");e&&(e.classList.remove("controls-hidden"),clearTimeout(P.hideTimer),P.hideTimer=setTimeout(()=>{var t;(t=document.getElementById("slideshow"))==null||t.classList.add("controls-hidden")},3e3))}function Os(){H.go("/settings")}function Us(){var t;const e=document.getElementById("slideshow");e&&(e.innerHTML=`
        <div class="slideshow-empty">
            ${g("images",{size:48})}
            <p>Nothing to show yet — add covers to your volumes, or enable galleries and trophies in Settings.</p>
            <button id="ss-empty-back" class="btn btn-primary">Back to Settings</button>
        </div>
    `,(t=document.getElementById("ss-empty-back"))==null||t.addEventListener("click",Os))}const Ml={mount:async()=>{const e=document.getElementById("app");e.innerHTML=`
            <div class="slideshow" id="slideshow">
                <div class="slideshow-stage" id="ss-stage">
                    <img class="slideshow-img" alt="">
                    <img class="slideshow-img" alt="">
                </div>
                <div class="slideshow-ui">
                    <div class="slideshow-topbar">
                        <button class="slideshow-btn" id="ss-exit" title="Exit slideshow">${g("x")}</button>
                        <div class="slideshow-counter" id="ss-counter"></div>
                        <button class="slideshow-btn" id="ss-fullscreen" title="Toggle fullscreen">${g("maximize")}</button>
                    </div>
                    <div class="slideshow-bottombar">
                        <div class="slideshow-caption">
                            <div class="slideshow-title" id="ss-title"></div>
                            <div class="slideshow-subtitle" id="ss-subtitle"></div>
                        </div>
                        <div class="slideshow-transport">
                            <button class="slideshow-btn" id="ss-prev" title="Previous">${g("chevron-left")}</button>
                            <button class="slideshow-btn" id="ss-play" title="Pause">${g("pause")}</button>
                            <button class="slideshow-btn" id="ss-next" title="Next">${g("chevron-right")}</button>
                        </div>
                    </div>
                </div>
                <div class="slideshow-loading" id="ss-loading">${g("loader",{spin:!0})} Loading covers…</div>
            </div>
        `;const t=document.getElementById("ss-stage");P={slides:[],index:0,playing:!0,timer:null,hideTimer:null,loadToken:0,activeLayer:0,layers:[...t.querySelectorAll(".slideshow-img")],config:{...Ca},keyHandler:null,moveHandler:null},document.getElementById("ss-exit").addEventListener("click",Os),document.getElementById("ss-prev").addEventListener("click",()=>{_e(P.index-1),Le()}),document.getElementById("ss-next").addEventListener("click",()=>{_e(P.index+1),Le()}),document.getElementById("ss-play").addEventListener("click",()=>{La(!P.playing),Le()}),document.getElementById("ss-fullscreen").addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>h("Fullscreen not supported","info"))}),t.addEventListener("click",l=>{const d=l.clientX/window.innerWidth;if(d<.3)_e(P.index-1),Le();else if(d>.7)_e(P.index+1),Le();else{const u=document.getElementById("slideshow");u.classList.contains("controls-hidden")?Le():(clearTimeout(P.hideTimer),u.classList.add("controls-hidden"))}}),P.keyHandler=l=>{if(P)switch(l.key){case"ArrowLeft":_e(P.index-1),Le();break;case"ArrowRight":_e(P.index+1),Le();break;case" ":l.preventDefault(),La(!P.playing),Le();break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});break;case"Escape":document.fullscreenElement||Os();break}},document.addEventListener("keydown",P.keyHandler),P.moveHandler=()=>Le(),document.addEventListener("mousemove",P.moveHandler),Le();let s={};try{s=await v.get("/settings")||{}}catch{}P.config={...Ca,...s.slideshow||{}};const a=new Set(P.config.disabledMangaIds||[]);let n=[];try{n=await v.getAllVolumes()}catch(l){console.error(l)}P.slides=Ll(n,a),P.config.shuffle&&xa(P.slides,-1);const r=document.getElementById("ss-loading");P.slides.length>0&&(r==null||r.remove(),_e(0));const i=l=>{var u;if(!P||l.length===0)return;const d=P.slides.length===0;P.slides.push(...l),P.config.shuffle&&xa(P.slides,d?-1:P.index),d?((u=document.getElementById("ss-loading"))==null||u.remove(),_e(0)):Fs()},c=[];P.config.includeLists&&c.push(Il().then(i).catch(l=>console.warn("Slideshow: galleries unavailable",l))),P.config.includeTrophies&&c.push(Tl(a).then(i).catch(l=>console.warn("Slideshow: trophies unavailable",l))),P.slides.length===0&&(c.length===0?Us():Promise.allSettled(c).then(()=>{P&&P.slides.length===0&&Us()}))},unmount:()=>{P&&(clearTimeout(P.timer),clearTimeout(P.hideTimer),document.removeEventListener("keydown",P.keyHandler),document.removeEventListener("mousemove",P.moveHandler),document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),P=null)}};class Al{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(t,s){this.routes.set(t,s)}async navigate(){console.log("[Router] navigate called");const s=(window.location.hash.slice(1)||"/").split("?")[0],[a,...n]=s.split("/").filter(Boolean),r=`/${a||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let i=this.routes.get(r);!i&&this.routes.has("/")&&(i=this.routes.get("/")),i&&(this.currentRoute=r,this.currentView=i,i.mount&&(console.log("[Router] calling mount on view module"),await i.mount(n)),Ue())}go(t){window.location.hash=t}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),Ue())}}const H=new Al;H.register("/",Jr);H.register("/manga",vi);H.register("/read",So);H.register("/series",Li);H.register("/settings",_i);H.register("/admin",qi);H.register("/favorites",zi);H.register("/queue",wl);H.register("/scrapers",El);H.register("/slideshow",Ml);export{ie as S,se as a,Pl as i,H as r,ql as s};
