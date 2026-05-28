import{a as y}from"./api-Cnc-ETLm.js";const de=Object.create(null);de.open="0";de.close="1";de.ping="2";de.pong="3";de.message="4";de.upgrade="5";de.noop="6";const Re=Object.create(null);Object.keys(de).forEach(s=>{Re[de[s]]=s});const st={type:"error",data:"parser error"},qt=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Ft=typeof ArrayBuffer=="function",Ot=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s&&s.buffer instanceof ArrayBuffer,ft=({type:s,data:e},t,a)=>qt&&e instanceof Blob?t?a(e):It(e,a):Ft&&(e instanceof ArrayBuffer||Ot(e))?t?a(e):It(new Blob([e]),a):a(de[s]+(e||"")),It=(s,e)=>{const t=new FileReader;return t.onload=function(){const a=t.result.split(",")[1];e("b"+(a||""))},t.readAsDataURL(s)};function Lt(s){return s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new Uint8Array(s.buffer,s.byteOffset,s.byteLength)}let Je;function hs(s,e){if(qt&&s.data instanceof Blob)return s.data.arrayBuffer().then(Lt).then(e);if(Ft&&(s.data instanceof ArrayBuffer||Ot(s.data)))return e(Lt(s.data));ft(s,!1,t=>{Je||(Je=new TextEncoder),e(Je.encode(t))})}const Bt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",$e=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let s=0;s<Bt.length;s++)$e[Bt.charCodeAt(s)]=s;const ms=s=>{let e=s.length*.75,t=s.length,a,n=0,i,o,c,l;s[s.length-1]==="="&&(e--,s[s.length-2]==="="&&e--);const u=new ArrayBuffer(e),p=new Uint8Array(u);for(a=0;a<t;a+=4)i=$e[s.charCodeAt(a)],o=$e[s.charCodeAt(a+1)],c=$e[s.charCodeAt(a+2)],l=$e[s.charCodeAt(a+3)],p[n++]=i<<2|o>>4,p[n++]=(o&15)<<4|c>>2,p[n++]=(c&3)<<6|l&63;return u},gs=typeof ArrayBuffer=="function",vt=(s,e)=>{if(typeof s!="string")return{type:"message",data:Ut(s,e)};const t=s.charAt(0);return t==="b"?{type:"message",data:fs(s.substring(1),e)}:Re[t]?s.length>1?{type:Re[t],data:s.substring(1)}:{type:Re[t]}:st},fs=(s,e)=>{if(gs){const t=ms(s);return Ut(t,e)}else return{base64:!0,data:s}},Ut=(s,e)=>{switch(e){case"blob":return s instanceof Blob?s:new Blob([s]);case"arraybuffer":default:return s instanceof ArrayBuffer?s:s.buffer}},Vt="",vs=(s,e)=>{const t=s.length,a=new Array(t);let n=0;s.forEach((i,o)=>{ft(i,!1,c=>{a[o]=c,++n===t&&e(a.join(Vt))})})},ys=(s,e)=>{const t=s.split(Vt),a=[];for(let n=0;n<t.length;n++){const i=vt(t[n],e);if(a.push(i),i.type==="error")break}return a};function bs(){return new TransformStream({transform(s,e){hs(s,t=>{const a=t.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const i=new DataView(n.buffer);i.setUint8(0,126),i.setUint16(1,a)}else{n=new Uint8Array(9);const i=new DataView(n.buffer);i.setUint8(0,127),i.setBigUint64(1,BigInt(a))}s.data&&typeof s.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(t)})}})}let Xe;function Pe(s){return s.reduce((e,t)=>e+t.length,0)}function Te(s,e){if(s[0].length===e)return s.shift();const t=new Uint8Array(e);let a=0;for(let n=0;n<e;n++)t[n]=s[0][a++],a===s[0].length&&(s.shift(),a=0);return s.length&&a<s[0].length&&(s[0]=s[0].slice(a)),t}function ws(s,e){Xe||(Xe=new TextDecoder);const t=[];let a=0,n=-1,i=!1;return new TransformStream({transform(o,c){for(t.push(o);;){if(a===0){if(Pe(t)<1)break;const l=Te(t,1);i=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(Pe(t)<2)break;const l=Te(t,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(Pe(t)<8)break;const l=Te(t,8),u=new DataView(l.buffer,l.byteOffset,l.length),p=u.getUint32(0);if(p>Math.pow(2,21)-1){c.enqueue(st);break}n=p*Math.pow(2,32)+u.getUint32(4),a=3}else{if(Pe(t)<n)break;const l=Te(t,n);c.enqueue(vt(i?l:Xe.decode(l),e)),a=0}if(n===0||n>s){c.enqueue(st);break}}}})}const Ht=4;function K(s){if(s)return ks(s)}function ks(s){for(var e in K.prototype)s[e]=K.prototype[e];return s}K.prototype.on=K.prototype.addEventListener=function(s,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+s]=this._callbacks["$"+s]||[]).push(e),this};K.prototype.once=function(s,e){function t(){this.off(s,t),e.apply(this,arguments)}return t.fn=e,this.on(s,t),this};K.prototype.off=K.prototype.removeListener=K.prototype.removeAllListeners=K.prototype.removeEventListener=function(s,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+s];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+s],this;for(var a,n=0;n<t.length;n++)if(a=t[n],a===e||a.fn===e){t.splice(n,1);break}return t.length===0&&delete this._callbacks["$"+s],this};K.prototype.emit=function(s){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+s],a=1;a<arguments.length;a++)e[a-1]=arguments[a];if(t){t=t.slice(0);for(var a=0,n=t.length;a<n;++a)t[a].apply(this,e)}return this};K.prototype.emitReserved=K.prototype.emit;K.prototype.listeners=function(s){return this._callbacks=this._callbacks||{},this._callbacks["$"+s]||[]};K.prototype.hasListeners=function(s){return!!this.listeners(s).length};const We=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),ae=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Es="arraybuffer";function zt(s,...e){return e.reduce((t,a)=>(s.hasOwnProperty(a)&&(t[a]=s[a]),t),{})}const $s=ae.setTimeout,Cs=ae.clearTimeout;function Ge(s,e){e.useNativeTimers?(s.setTimeoutFn=$s.bind(ae),s.clearTimeoutFn=Cs.bind(ae)):(s.setTimeoutFn=ae.setTimeout.bind(ae),s.clearTimeoutFn=ae.clearTimeout.bind(ae))}const xs=1.33;function Ss(s){return typeof s=="string"?Is(s):Math.ceil((s.byteLength||s.size)*xs)}function Is(s){let e=0,t=0;for(let a=0,n=s.length;a<n;a++)e=s.charCodeAt(a),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(a++,t+=4);return t}function jt(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Ls(s){let e="";for(let t in s)s.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(s[t]));return e}function Bs(s){let e={},t=s.split("&");for(let a=0,n=t.length;a<n;a++){let i=t[a].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}class _s extends Error{constructor(e,t,a){super(e),this.description=t,this.context=a,this.type="TransportError"}}class yt extends K{constructor(e){super(),this.writable=!1,Ge(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,a){return super.emitReserved("error",new _s(e,t,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=vt(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Ls(e);return t.length?"?"+t:""}}class As extends yt{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||t()})),this.writable||(a++,this.once("drain",function(){--a||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};ys(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,vs(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=jt()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let Qt=!1;try{Qt=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Ps=Qt;function Ts(){}class Ms extends As{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let a=location.port;a||(a=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||a!==e.port}}doWrite(e,t){const a=this.request({method:"POST",data:e});a.on("success",t),a.on("error",(n,i)=>{this.onError("xhr post error",n,i)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,a)=>{this.onError("xhr poll error",t,a)}),this.pollXhr=e}}class ce extends K{constructor(e,t,a){super(),this.createRequest=e,Ge(this,a),this._opts=a,this._method=a.method||"GET",this._uri=t,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var e;const t=zt(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(t);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=ce.requestsCount++,ce.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Ts,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete ce.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}ce.requestsCount=0;ce.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",_t);else if(typeof addEventListener=="function"){const s="onpagehide"in ae?"pagehide":"unload";addEventListener(s,_t,!1)}}function _t(){for(let s in ce.requests)ce.requests.hasOwnProperty(s)&&ce.requests[s].abort()}const Rs=function(){const s=Wt({xdomain:!1});return s&&s.responseType!==null}();class Ns extends Ms{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Rs&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new ce(Wt,this.uri(),e)}}function Wt(s){const e=s.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Ps))return new XMLHttpRequest}catch{}if(!e)try{return new ae[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Gt=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Ds extends yt{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,a=Gt?{}:zt(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const a=e[t],n=t===e.length-1;ft(a,this.supportsBinary,i=>{try{this.doWrite(a,i)}catch{}n&&We(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=jt()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Ze=ae.WebSocket||ae.MozWebSocket;class qs extends Ds{createSocket(e,t,a){return Gt?new Ze(e,t,a):t?new Ze(e,t):new Ze(e)}doWrite(e,t){this.ws.send(t)}}class Fs extends yt{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=ws(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=e.readable.pipeThrough(t).getReader(),n=bs();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const i=()=>{a.read().then(({done:c,value:l})=>{c||(this.onPacket(l),i())}).catch(c=>{})};i();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const a=e[t],n=t===e.length-1;this._writer.write(a).then(()=>{n&&We(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Os={websocket:qs,webtransport:Fs,polling:Ns},Us=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Vs=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function at(s){if(s.length>8e3)throw"URI too long";const e=s,t=s.indexOf("["),a=s.indexOf("]");t!=-1&&a!=-1&&(s=s.substring(0,t)+s.substring(t,a).replace(/:/g,";")+s.substring(a,s.length));let n=Us.exec(s||""),i={},o=14;for(;o--;)i[Vs[o]]=n[o]||"";return t!=-1&&a!=-1&&(i.source=e,i.host=i.host.substring(1,i.host.length-1).replace(/;/g,":"),i.authority=i.authority.replace("[","").replace("]","").replace(/;/g,":"),i.ipv6uri=!0),i.pathNames=Hs(i,i.path),i.queryKey=zs(i,i.query),i}function Hs(s,e){const t=/\/{2,9}/g,a=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&a.splice(0,1),e.slice(-1)=="/"&&a.splice(a.length-1,1),a}function zs(s,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,i){n&&(t[n]=i)}),t}const nt=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ne=[];nt&&addEventListener("offline",()=>{Ne.forEach(s=>s())},!1);class he extends K{constructor(e,t){if(super(),this.binaryType=Es,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const a=at(e);t.hostname=a.host,t.secure=a.protocol==="https"||a.protocol==="wss",t.port=a.port,a.query&&(t.query=a.query)}else t.host&&(t.hostname=at(t.host).host);Ge(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Bs(this.opts.query)),nt&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ne.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=Ht,t.transport=e,this.id&&(t.sid=this.id);const a=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&he.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",he.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(t+=Ss(n)),a>0&&t>this._maxPayload)return this.writeBuffer.slice(0,a);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,We(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,a){return this._sendPacket("message",e,t,a),this}send(e,t,a){return this._sendPacket("message",e,t,a),this}_sendPacket(e,t,a,n){if(typeof t=="function"&&(n=t,t=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const i={type:e,data:t,options:a};this.emitReserved("packetCreate",i),this.writeBuffer.push(i),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},a=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():e()}):this.upgrading?a():e()),this}_onError(e){if(he.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),nt&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=Ne.indexOf(this._offlineEventListener);a!==-1&&Ne.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}he.protocol=Ht;class js extends he{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),a=!1;he.priorWebsocketSuccess=!1;const n=()=>{a||(t.send([{type:"ping",data:"probe"}]),t.once("packet",v=>{if(!a)if(v.type==="pong"&&v.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;he.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(p(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const g=new Error("probe error");g.transport=t.name,this.emitReserved("upgradeError",g)}}))};function i(){a||(a=!0,p(),t.close(),t=null)}const o=v=>{const g=new Error("probe error: "+v);g.transport=t.name,i(),this.emitReserved("upgradeError",g)};function c(){o("transport closed")}function l(){o("socket closed")}function u(v){t&&v.name!==t.name&&i()}const p=()=>{t.removeListener("open",n),t.removeListener("error",o),t.removeListener("close",c),this.off("close",l),this.off("upgrading",u)};t.once("open",n),t.once("error",o),t.once("close",c),this.once("close",l),this.once("upgrading",u),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{a||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let a=0;a<e.length;a++)~this.transports.indexOf(e[a])&&t.push(e[a]);return t}}let Qs=class extends js{constructor(e,t={}){const a=typeof e=="object"?e:t;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>Os[n]).filter(n=>!!n)),super(e,a)}};function Ws(s,e="",t){let a=s;t=t||typeof location<"u"&&location,s==null&&(s=t.protocol+"//"+t.host),typeof s=="string"&&(s.charAt(0)==="/"&&(s.charAt(1)==="/"?s=t.protocol+s:s=t.host+s),/^(https?|wss?):\/\//.test(s)||(typeof t<"u"?s=t.protocol+"//"+s:s="https://"+s),a=at(s)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const i=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+i+":"+a.port+e,a.href=a.protocol+"://"+i+(t&&t.port===a.port?"":":"+a.port),a}const Gs=typeof ArrayBuffer=="function",Ks=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s.buffer instanceof ArrayBuffer,Kt=Object.prototype.toString,Ys=typeof Blob=="function"||typeof Blob<"u"&&Kt.call(Blob)==="[object BlobConstructor]",Js=typeof File=="function"||typeof File<"u"&&Kt.call(File)==="[object FileConstructor]";function bt(s){return Gs&&(s instanceof ArrayBuffer||Ks(s))||Ys&&s instanceof Blob||Js&&s instanceof File}function De(s,e){if(!s||typeof s!="object")return!1;if(Array.isArray(s)){for(let t=0,a=s.length;t<a;t++)if(De(s[t]))return!0;return!1}if(bt(s))return!0;if(s.toJSON&&typeof s.toJSON=="function"&&arguments.length===1)return De(s.toJSON(),!0);for(const t in s)if(Object.prototype.hasOwnProperty.call(s,t)&&De(s[t]))return!0;return!1}function Xs(s){const e=[],t=s.data,a=s;return a.data=rt(t,e),a.attachments=e.length,{packet:a,buffers:e}}function rt(s,e){if(!s)return s;if(bt(s)){const t={_placeholder:!0,num:e.length};return e.push(s),t}else if(Array.isArray(s)){const t=new Array(s.length);for(let a=0;a<s.length;a++)t[a]=rt(s[a],e);return t}else if(typeof s=="object"&&!(s instanceof Date)){const t={};for(const a in s)Object.prototype.hasOwnProperty.call(s,a)&&(t[a]=rt(s[a],e));return t}return s}function Zs(s,e){return s.data=it(s.data,e),delete s.attachments,s}function it(s,e){if(!s)return s;if(s&&s._placeholder===!0){if(typeof s.num=="number"&&s.num>=0&&s.num<e.length)return e[s.num];throw new Error("illegal attachments")}else if(Array.isArray(s))for(let t=0;t<s.length;t++)s[t]=it(s[t],e);else if(typeof s=="object")for(const t in s)Object.prototype.hasOwnProperty.call(s,t)&&(s[t]=it(s[t],e));return s}const ea=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var N;(function(s){s[s.CONNECT=0]="CONNECT",s[s.DISCONNECT=1]="DISCONNECT",s[s.EVENT=2]="EVENT",s[s.ACK=3]="ACK",s[s.CONNECT_ERROR=4]="CONNECT_ERROR",s[s.BINARY_EVENT=5]="BINARY_EVENT",s[s.BINARY_ACK=6]="BINARY_ACK"})(N||(N={}));class ta{constructor(e){this.replacer=e}encode(e){return(e.type===N.EVENT||e.type===N.ACK)&&De(e)?this.encodeAsBinary({type:e.type===N.EVENT?N.BINARY_EVENT:N.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===N.BINARY_EVENT||e.type===N.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=Xs(e),a=this.encodeAsString(t.packet),n=t.buffers;return n.unshift(a),n}}class wt extends K{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const a=t.type===N.BINARY_EVENT;a||t.type===N.BINARY_ACK?(t.type=a?N.EVENT:N.ACK,this.reconstructor=new sa(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(bt(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const a={type:Number(e.charAt(0))};if(N[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===N.BINARY_EVENT||a.type===N.BINARY_ACK){const i=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(i,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");a.attachments=Number(o)}if(e.charAt(t+1)==="/"){const i=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););a.nsp=e.substring(i,t)}else a.nsp="/";const n=e.charAt(t+1);if(n!==""&&Number(n)==n){const i=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}a.id=Number(e.substring(i,t+1))}if(e.charAt(++t)){const i=this.tryParse(e.substr(t));if(wt.isPayloadValid(a.type,i))a.data=i;else throw new Error("invalid payload")}return a}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case N.CONNECT:return At(t);case N.DISCONNECT:return t===void 0;case N.CONNECT_ERROR:return typeof t=="string"||At(t);case N.EVENT:case N.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&ea.indexOf(t[0])===-1);case N.ACK:case N.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class sa{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Zs(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function At(s){return Object.prototype.toString.call(s)==="[object Object]"}const aa=Object.freeze(Object.defineProperty({__proto__:null,Decoder:wt,Encoder:ta,get PacketType(){return N}},Symbol.toStringTag,{value:"Module"}));function re(s,e,t){return s.on(e,t),function(){s.off(e,t)}}const na=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Yt extends K{constructor(e,t,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[re(e,"open",this.onopen.bind(this)),re(e,"packet",this.onpacket.bind(this)),re(e,"error",this.onerror.bind(this)),re(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var a,n,i;if(na.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const o={type:N.EVENT,data:t};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const p=this.ids++,v=t.pop();this._registerAckCallback(p,v),o.id=p}const c=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((i=this.io.engine)===null||i===void 0)&&i._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,t){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[e]=t;return}const i=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===e&&this.sendBuffer.splice(c,1);t.call(this,new Error("operation has timed out"))},n),o=(...c)=>{this.io.clearTimeoutFn(i),t.apply(this,c)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...t){return new Promise((a,n)=>{const i=(o,c)=>o?n(o):a(c);i.withError=!0,t.push(i),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...i)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(n)):(this._queue.shift(),t&&t(null,...i)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:N.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(a=>String(a.id)===e)){const a=this.acks[e];delete this.acks[e],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case N.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case N.EVENT:case N.BINARY_EVENT:this.onevent(e);break;case N.ACK:case N.BINARY_ACK:this.onack(e);break;case N.DISCONNECT:this.ondisconnect();break;case N.CONNECT_ERROR:this.destroy();const a=new Error(e.data.message);a.data=e.data.data,this.emitReserved("connect_error",a);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const a of t)a.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let a=!1;return function(...n){a||(a=!0,t.packet({type:N.ACK,id:e,data:n}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:N.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let a=0;a<t.length;a++)if(e===t[a])return t.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let a=0;a<t.length;a++)if(e===t[a])return t.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const a of t)a.apply(this,e.data)}}}function ke(s){s=s||{},this.ms=s.min||100,this.max=s.max||1e4,this.factor=s.factor||2,this.jitter=s.jitter>0&&s.jitter<=1?s.jitter:0,this.attempts=0}ke.prototype.duration=function(){var s=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*s);s=Math.floor(e*10)&1?s+t:s-t}return Math.min(s,this.max)|0};ke.prototype.reset=function(){this.attempts=0};ke.prototype.setMin=function(s){this.ms=s};ke.prototype.setMax=function(s){this.max=s};ke.prototype.setJitter=function(s){this.jitter=s};class ot extends K{constructor(e,t){var a;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,Ge(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((a=t.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new ke({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const n=t.parser||aa;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Qs(this.uri,this.opts);const t=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=re(t,"open",function(){a.onopen(),e&&e()}),i=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),e?e(c):this.maybeReconnectOnOpen()},o=re(t,"error",i);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{n(),i(new Error("timeout")),t.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(re(e,"ping",this.onping.bind(this)),re(e,"data",this.ondata.bind(this)),re(e,"error",this.onerror.bind(this)),re(e,"close",this.onclose.bind(this)),re(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){We(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let a=this.nsps[e];return a?this._autoConnect&&!a.active&&a.connect():(a=new Yt(this,e,t),this.nsps[e]=a),a}_destroy(e){const t=Object.keys(this.nsps);for(const a of t)if(this.nsps[a].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let a=0;a<t.length;a++)this.engine.write(t[a],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},t);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Ee={};function qe(s,e){typeof s=="object"&&(e=s,s=void 0),e=e||{};const t=Ws(s,e.path||"/socket.io"),a=t.source,n=t.id,i=t.path,o=Ee[n]&&i in Ee[n].nsps,c=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return c?l=new ot(a,e):(Ee[n]||(Ee[n]=new ot(a,e)),l=Ee[n]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(qe,{Manager:ot,Socket:Yt,io:qe,connect:qe});class ra{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=qe({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(t=>{this.socket.emit("subscribe:manga",t)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",t=>{console.log("[Socket] Disconnected:",t)}),this.socket.on("connect_error",t=>{console.error("[Socket] Connection error:",t.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var t;this.subscribedMangas.add(e),(t=this.socket)!=null&&t.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var t;this.subscribedMangas.delete(e),(t=this.socket)!=null&&t.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,t){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),this.socket&&this.socket.on(e,t)}off(e,t){this.listeners.has(e)&&this.listeners.get(e).delete(t),this.socket&&this.socket.off(e,t)}emit(e,t){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(e,t)}}const Y={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone"},j=new ra,Z={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},oe=new Set,Q=new Map,Ce=new Map;function ia(s){return Z[s]}function oa(s,e){Z[s]=e,oe.add(s),_e(s)}function la(s,e){return Ce.has(s)||Ce.set(s,new Set),Ce.get(s).add(e),()=>{var t;return(t=Ce.get(s))==null?void 0:t.delete(e)}}function _e(s){const e=Ce.get(s);e&&e.forEach(t=>t(Z[s]))}function xe(s){oe.delete(s),Q.delete(s)}function ca(s){return oe.has(s)}async function Se(s=!1){if(!s&&oe.has("bookmarks"))return Z.bookmarks;if(Q.has("bookmarks"))return Q.get("bookmarks");const e=y.getBookmarks().then(t=>(Z.bookmarks=t||[],oe.add("bookmarks"),Q.delete("bookmarks"),_e("bookmarks"),Z.bookmarks)).catch(t=>{throw Q.delete("bookmarks"),t});return Q.set("bookmarks",e),e}async function da(s=!1){if(!s&&oe.has("series"))return Z.series;if(Q.has("series"))return Q.get("series");const e=y.get("/series").then(t=>(Z.series=t||[],oe.add("series"),Q.delete("series"),_e("series"),Z.series)).catch(t=>{throw Q.delete("series"),t});return Q.set("series",e),e}async function ua(s=!1){if(!s&&oe.has("categories"))return Z.categories;if(Q.has("categories"))return Q.get("categories");const e=y.get("/categories").then(t=>(Z.categories=t.categories||[],oe.add("categories"),Q.delete("categories"),_e("categories"),Z.categories)).catch(t=>{throw Q.delete("categories"),t});return Q.set("categories",e),e}async function pa(s=!1){if(!s&&oe.has("favorites"))return Z.favorites;if(Q.has("favorites"))return Q.get("favorites");const e=y.getFavorites().then(t=>(Z.favorites=t||{favorites:{},listOrder:[]},oe.add("favorites"),Q.delete("favorites"),_e("favorites"),Z.favorites)).catch(t=>{throw Q.delete("favorites"),t});return Q.set("favorites",e),e}function ha(){j.on(Y.MANGA_UPDATED,()=>{xe("bookmarks"),Se(!0)}),j.on(Y.MANGA_ADDED,()=>{xe("bookmarks"),Se(!0)}),j.on(Y.MANGA_DELETED,()=>{xe("bookmarks"),Se(!0)}),j.on(Y.DOWNLOAD_COMPLETED,()=>{xe("bookmarks"),Se(!0)})}ha();const ie={get:ia,set:oa,subscribe:la,invalidate:xe,isLoaded:ca,loadBookmarks:Se,loadSeries:da,loadCategories:ua,loadFavorites:pa};function d(s,e="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=s,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}async function ma(s,e,t){try{s&&(s.disabled=!0,s.textContent="Scanning..."),e&&(e.textContent="Scanning..."),d("Scanning downloads folder...","info");const n=(await y.scanLibrary()).found||[];if(n.length===0){d("Scan complete: No new manga found","info"),t&&t();return}ga(n,t)}catch(a){d("Scan failed: "+a.message,"error")}finally{s&&(s.disabled=!1,s.textContent="📁 Scan Folder"),e&&(e.textContent="📁 Scan Folder")}}async function ga(s,e){const t=document.createElement("div");t.id="import-modal-overlay",t.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
    <h2 style="margin:0 0 16px 0;">Import Local Manga</h2>
    <p style="margin:0 0 16px 0;color:var(--text-secondary);">Found ${s.length} new folder(s). Select which to import:</p>
    <div id="import-folder-list" style="max-height:300px;overflow-y:auto;margin-bottom:16px;">
      ${s.map(n=>`
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
  `,t.appendChild(a),document.body.appendChild(t),document.getElementById("import-cancel-btn").addEventListener("click",()=>{t.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),i=Array.from(n).map(l=>l.dataset.folder);if(i.length===0){d("No folders selected","warning");return}const o=document.getElementById("import-all-btn");o.disabled=!0,o.textContent="Importing...";let c=0;for(const l of i)try{await y.importLocalManga(l),c++}catch(u){console.error("Failed to import",l,u)}t.remove(),d(`Imported ${c} manga`,"success"),e&&e()}),t.addEventListener("click",n=>{n.target===t&&t.remove()})}function te(s="manga"){return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">📚 Manga<span>Reader</span></a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${s==="manga"?"active":""}" data-view="manga" title="Manga view">📚</button>
            <button class="view-toggle-btn ${s==="series"?"active":""}" data-view="series" title="Series view">📖</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">⭐ Favorites</button>
          <a href="#/queue" class="btn btn-secondary" id="queue-nav-btn" title="Task Queue">📋 Queue</a>
          <button class="btn btn-secondary" id="scan-btn">📁 Scan Folder</button>
          ${s==="series"?'<button class="btn btn-primary" id="add-series-btn">+ Add Series</button>':'<button class="btn btn-primary" id="add-manga-btn">+ Add Manga</button>'}
          <button class="btn btn-secondary" id="logout-btn">🚪</button>
          <a href="#/scrapers" class="btn btn-secondary" title="Search Scrapers">🔍</a>
          <!-- <a href="#/admin" class="btn btn-secondary" title="Admin">🔧</a> -->
          <!-- <a href="#/settings" class="btn btn-secondary" title="Settings">⚙️</a> -->
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
        <a href="#/queue" class="mobile-menu-item">📋 Task Queue</a>
        <button class="mobile-menu-item" id="mobile-scan-btn">📁 Scan Folder</button>
        ${s==="series"?'<button class="mobile-menu-item primary" id="mobile-add-series-btn">+ Add Series</button>':'<button class="mobile-menu-item primary" id="mobile-add-btn">+ Add Manga</button>'}
        <button class="mobile-menu-item" id="mobile-logout-btn">🚪 Logout</button>
        <a href="#/scrapers" class="mobile-menu-item">🔍 Scrapers</a>
        <!-- <a href="#/admin" class="mobile-menu-item">🔧 Admin</a> -->
        <!-- <a href="#/settings" class="mobile-menu-item">⚙️ Settings</a> -->
      </div>
    </header>
  `}function pe(){const s=document.querySelector("header");if(s&&s.dataset.listenersBound)return;s&&(s.dataset.listenersBound="true");const e=document.getElementById("hamburger-btn"),t=document.getElementById("mobile-menu");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),i=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",i),n&&n.addEventListener("click",i),document.querySelectorAll("[data-view]").forEach(w=>{w.addEventListener("click",()=>{const h=w.dataset.view;localStorage.setItem("library_view_mode",h),document.querySelectorAll("[data-view]").forEach($=>{$.classList.toggle("active",$.dataset.view===h)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:h}}))})});const o=document.querySelector(".logo");o&&o.addEventListener("click",w=>{localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),ie.loadBookmarks(!0).catch(()=>{}),window.dispatchEvent(new CustomEvent("clearFilters"))});const c=document.getElementById("favorites-btn"),l=document.getElementById("mobile-favorites-btn"),u=w=>{w.preventDefault(),T.go("/favorites")};c&&c.addEventListener("click",u),l&&l.addEventListener("click",u);const p=document.getElementById("queue-nav-btn");p&&p.addEventListener("click",w=>{w.preventDefault(),T.go("/queue")});const v=document.getElementById("scan-btn"),g=document.getElementById("mobile-scan-btn");if(v||g){const w=()=>{ma(v,g,async()=>{await ie.loadBookmarks(!0),T.reload()})};v&&v.addEventListener("click",w),g&&g.addEventListener("click",w)}}let x={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0},Ue=[];function Pt(s){return String(s).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}function fa(s){return[...s].sort((e,t)=>{var a,n;switch(x.sortBy){case"az":return(e.alias||e.title).localeCompare(t.alias||t.title);case"za":return(t.alias||t.title).localeCompare(e.alias||e.title);case"lastread":return(t.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const i=((a=e.chapters)==null?void 0:a.length)||e.uniqueChapters||0;return(((n=t.chapters)==null?void 0:n.length)||t.uniqueChapters||0)-i}case"updated":default:return(t.updatedAt||"").localeCompare(e.updatedAt||"")}})}function kt(){let s=x.bookmarks;const e=(Array.isArray(x.categories)?x.categories:[]).filter(t=>typeof t=="object"?t.isNsfw:!1).map(t=>t.name);if(x.activeCategory==="__nsfw__"?s=s.filter(t=>(t.categories||[]).some(a=>e.includes(a))):x.activeCategory?s=s.filter(t=>(t.categories||[]).includes(x.activeCategory)):e.length>0&&(s=s.filter(t=>!(t.categories||[]).some(a=>e.includes(a)))),x.artistFilter&&(s=s.filter(t=>(t.artists||[]).includes(x.artistFilter))),x.searchQuery){const t=x.searchQuery.toLowerCase();s=s.filter(a=>(a.title||"").toLowerCase().includes(t)||(a.alias||"").toLowerCase().includes(t)||(a.artists||[]).some(n=>n.toLowerCase().includes(t)))}return fa(s)}function Et(s){var p,v,g;const e=s.alias||s.title,t=s.downloadedCount??((p=s.downloadedChapters)==null?void 0:p.length)??0,a=new Set(s.excludedChapters||[]),n=(s.chapters||[]).filter(w=>!a.has(w.number)),i=new Set(n.map(w=>w.number)).size||s.uniqueChapters||0,o=s.readCount??((v=s.readChapters)==null?void 0:v.length)??0,c=(s.updatedCount??((g=s.updatedChapters)==null?void 0:g.length)??0)>0,l=s.localCover?`/api/public/covers/${s.id}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover,u=s.source==="local";return`
    <div class="manga-card" data-id="${s.id}">
      <div class="manga-card-cover">
        ${l?`<img src="${l}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:`<div class="placeholder">${u?"💾":"📚"}</div>`}
        <div class="manga-card-badges">
          ${o>0?`<span class="badge badge-read" title="Read">${o}</span>`:""}
          <span class="badge badge-chapters" title="Total">${i}</span>
          ${t>0?`<span class="badge badge-downloaded" title="Downloaded">${t}</span>`:""}
          ${c?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${s.autoCheck?'<span class="badge badge-monitored" title="Auto-check enabled">⏰</span>':""}
          ${x.activeCategory==="Favorites"?'<span class="badge badge-play" title="Click to Read">▶</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function $t(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function va(s){var n;const e=s.alias||s.title,t=((n=s.entries)==null?void 0:n.length)||s.entry_count||0;let a=null;return s.localCover&&s.coverBookmarkId?a=`/api/public/covers/${s.coverBookmarkId}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover&&(a=s.cover),`
    <div class="manga-card series-card" data-series-id="${s.id}">
      <div class="manga-card-cover">
        ${a?`<img src="${a}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>'}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${t} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Ve(){const s=localStorage.getItem("library_view_mode");if(s&&s!==x.viewMode&&(x.viewMode=s),x.activeCategory==="Favorites")return T.go("/favorites"),"";let e="";if(x.viewMode==="series"){const t=x.series.map(va).join("");e=`
      <div class="library-grid" id="library-grid">
        ${x.loading?'<div class="loading-spinner"></div>':t||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const t=kt(),a=x.artistFilter?`
      <div class="manga-card search-sources-card" id="search-sources-card" title="Search online sources for ${Pt(x.artistFilter)}"
           style="display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed var(--border-color, #3a3a4a);background:transparent;min-height:220px;text-align:center;">
        <div style="padding:1rem;color:var(--text-muted, #9aa);">
          <div style="font-size:2.5rem;line-height:1;margin-bottom:.5rem;">＋</div>
          <div style="font-size:.85rem;">Search sources for<br><strong style="color:var(--text-color, #fff);">${Pt(x.artistFilter)}</strong></div>
        </div>
      </div>`:"",n=t.map(Et).join("")+a;e=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" id="library-search" placeholder="Search manga or author..." value="${x.searchQuery}" autocomplete="off">
          ${x.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${x.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${x.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${x.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${x.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${x.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
      </div>
      ${x.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">🎨</span>
          <span class="artist-filter-name">${x.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${x.loading?'<div class="loading-spinner"></div>':n||$t()}
      </div>
    `}return`
    ${te(x.viewMode)}
    <div class="container">
      ${e}
    </div>
    ${ya()}
    ${wa()}
    ${ka()}
  `}function ya(){const{activeCategory:s}=x,t=(Array.isArray(x.categories)?x.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=t.some(n=>n.isNsfw);return`
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${s?"has-filter":""}" id="category-fab-btn">
        ${s==="__nsfw__"?"🔞":s||"🏷️"}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn">⚙️</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${s?"":"active"}" data-category="">All</button>
          ${a?`<button class="category-menu-item ${s==="__nsfw__"?"active":""}" data-category="__nsfw__" style="color: #f44336;">🔞 All 18+</button>`:""}
          ${t.map(n=>`
            <button class="category-menu-item ${s===n.name?"active":""}" data-category="${n.name}">
              ${n.name}${n.isNsfw?' <span style="color:#f44336;font-size:0.75em;">18+</span>':""}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    ${ba()}
      `}function ba(){const e=(Array.isArray(x.categories)?x.categories:[]).map(t=>typeof t=="object"?t:{name:t,isNsfw:!1});return`
    <div class="modal" id="manage-categories-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 450px;">
        <div class="modal-header">
          <h2>⚙️ Manage Categories</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="display: flex; gap: 8px; margin-bottom: 16px;">
            <input type="text" id="new-category-input" placeholder="New category name..." style="flex: 1;">
            <button class="btn btn-primary" id="add-category-btn">Add</button>
          </div>
          <div id="categories-list" style="max-height: 300px; overflow-y: auto;">
            ${e.length===0?'<p class="text-muted">No categories yet</p>':""}
            ${e.map(t=>`
              <div class="category-manage-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 4px; border-bottom: 1px solid var(--border-color, #333);">
                <span style="flex: 1;">${t.name}</span>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.85em; color: ${t.isNsfw?"#f44336":"var(--text-secondary)"}">
                    <input type="checkbox" class="nsfw-toggle" data-category="${t.name}" ${t.isNsfw?"checked":""} style="width: 16px; height: 16px;">
                    18+
                  </label>
                  <button class="btn-icon small danger delete-category-btn" data-category="${t.name}" title="Delete">🗑️</button>
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
  `}function wa(){return`
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
      `}function ka(){return`
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
      `}function lt(){x.activeCategory=null,x.artistFilter=null,x.searchQuery="",localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),se()}async function ct(s){const e=s.target.closest(".manga-card");if(e){if(e.classList.contains("gallery-card")){const n=e.dataset.gallery;T.go(`/read/gallery/${encodeURIComponent(n)}`);return}const t=e.dataset.id,a=e.dataset.seriesId;if(a){T.go(`/series/${a}`);return}if(t){if(x.activeCategory==="Favorites"){const n=x.bookmarks.find(i=>i.id===t);if(n){let i=n.last_read_chapter;if(!i&&n.chapters&&n.chapters.length>0&&(i=[...n.chapters].sort((c,l)=>c.number-l.number)[0].number),i){T.go(`/read/${t}/${i}`);return}else d("No chapters available to read","warning")}}T.go(`/manga/${t}`)}}}function Jt(){var S,L,P,O,z;const s=document.getElementById("app");s.removeEventListener("click",ct),s.addEventListener("click",ct),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",_=>{x.viewMode=_.detail.mode;const D=document.getElementById("app");D.innerHTML=Ve(),Jt(),pe()}));const e=document.getElementById("category-fab-btn"),t=document.getElementById("category-fab-menu");e&&t&&(e.addEventListener("click",()=>{t.classList.toggle("hidden")}),t.addEventListener("click",_=>{const D=_.target.closest(".category-menu-item");if(D){const H=D.dataset.category||null;Ea(H),t.classList.add("hidden")}})),(S=document.getElementById("manage-categories-btn"))==null||S.addEventListener("click",_=>{_.stopPropagation();const D=document.getElementById("manage-categories-modal");D&&D.classList.add("open")}),(L=document.getElementById("close-manage-categories-btn"))==null||L.addEventListener("click",()=>{var _;(_=document.getElementById("manage-categories-modal"))==null||_.classList.remove("open")}),(P=document.querySelector("#manage-categories-modal .modal-overlay"))==null||P.addEventListener("click",()=>{var _;(_=document.getElementById("manage-categories-modal"))==null||_.classList.remove("open")}),(O=document.querySelector("#manage-categories-modal .modal-close"))==null||O.addEventListener("click",()=>{var _;(_=document.getElementById("manage-categories-modal"))==null||_.classList.remove("open")}),(z=document.getElementById("add-category-btn"))==null||z.addEventListener("click",async()=>{var H;const _=document.getElementById("new-category-input"),D=(H=_==null?void 0:_.value)==null?void 0:H.trim();if(D)try{await y.post("/categories",{name:D}),_.value="",d("Category added","success"),await be(!0),se()}catch(U){d("Failed: "+U.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(_=>{_.addEventListener("change",async D=>{const H=_.dataset.category;try{await y.put(`/categories/${encodeURIComponent(H)}/nsfw`,{isNsfw:_.checked}),d(`${H} ${_.checked?"marked as 18+":"unmarked"}`,"success"),await be(!0),se()}catch(U){d("Failed: "+U.message,"error"),_.checked=!_.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(_=>{_.addEventListener("click",async()=>{const D=_.dataset.category;if(confirm(`Delete category "${D}"?`))try{await y.delete(`/categories/${encodeURIComponent(D)}`),d("Category deleted","success"),x.activeCategory===D&&(x.activeCategory=null,localStorage.removeItem("library_active_category")),await be(!0),se()}catch(H){d("Failed: "+H.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{x.artistFilter=null,localStorage.removeItem("library_artist_filter"),se()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",_=>{var H;x.searchQuery=_.target.value,localStorage.setItem("library_search",_.target.value);const D=document.getElementById("library-grid");if(D){const U=kt();D.innerHTML=U.map(Et).join("")||$t();const X=document.getElementById("search-clear");!X&&x.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(H=document.getElementById("search-clear"))==null||H.addEventListener("click",()=>{x.searchQuery="",localStorage.removeItem("library_search"),n.value="",se()})):X&&!x.searchQuery&&X.remove()}}),x.searchQuery&&n.focus());const i=document.getElementById("search-clear");i&&i.addEventListener("click",()=>{x.searchQuery="",se()});const o=document.getElementById("search-sources-card");o&&o.addEventListener("click",()=>{const _=x.artistFilter;_&&(window.location.hash=`#/scrapers?q=${encodeURIComponent(_)}`)});const c=document.getElementById("library-sort");c&&c.addEventListener("change",_=>{x.sortBy=_.target.value,localStorage.setItem("library_sort",x.sortBy),se()}),window.removeEventListener("clearFilters",lt),window.addEventListener("clearFilters",lt);const l=document.getElementById("add-manga-btn"),u=document.getElementById("mobile-add-btn"),p=document.getElementById("add-modal"),v=document.getElementById("add-modal-close"),g=document.getElementById("add-modal-cancel"),w=document.getElementById("add-modal-submit"),h=document.getElementById("mobile-menu"),$=()=>{h&&h.classList.add("hidden"),p&&p.classList.add("open")};l&&l.addEventListener("click",$),u&&u.addEventListener("click",$),v&&v.addEventListener("click",()=>p.classList.remove("open")),g&&g.addEventListener("click",()=>p.classList.remove("open")),w&&w.addEventListener("click",async()=>{const _=document.getElementById("manga-url"),D=_.value.trim();if(!D){d("Please enter a URL","error");return}try{w.disabled=!0,w.textContent="Adding...",await y.addBookmark(D),d("Manga added successfully!","success"),p.classList.remove("open"),_.value="",await be(),se()}catch(H){d("Failed to add manga: "+H.message,"error")}finally{w.disabled=!1,w.textContent="Add"}});const I=document.getElementById("add-series-btn"),B=document.getElementById("mobile-add-series-btn"),A=document.getElementById("add-series-modal"),M=document.getElementById("add-series-modal-close"),q=document.getElementById("add-series-modal-cancel"),C=document.getElementById("add-series-modal-submit"),f=document.getElementById("mobile-menu");if((I||B)&&A){const _=()=>{f&&f.classList.add("hidden"),A.classList.add("open")};I&&I.addEventListener("click",_),B&&B.addEventListener("click",_)}M&&M.addEventListener("click",()=>A.classList.remove("open")),q&&q.addEventListener("click",()=>A.classList.remove("open")),C&&C.addEventListener("click",async()=>{const _=document.getElementById("series-title"),D=document.getElementById("series-alias"),H=_.value.trim(),U=D.value.trim();if(!H){d("Please enter a title","error");return}try{C.disabled=!0,C.textContent="Creating...",await y.createSeries(H,U),d("Series created successfully!","success"),A.classList.remove("open"),_.value="",D.value="",await be(!0),se()}catch(X){d("Failed to create series: "+X.message,"error")}finally{C.disabled=!1,C.textContent="Create"}});const E=A==null?void 0:A.querySelector(".modal-overlay");E&&E.addEventListener("click",()=>A.classList.remove("open"));const R=document.getElementById("empty-add-btn");R&&p&&R.addEventListener("click",()=>p.classList.add("open"));const m=document.getElementById("empty-add-series-btn");m&&A&&m.addEventListener("click",()=>A.classList.add("open"));const k=p==null?void 0:p.querySelector(".modal-overlay");k&&k.addEventListener("click",()=>p.classList.remove("open")),pe()}function Ea(s){x.activeCategory=s,s?localStorage.setItem("library_active_category",s):localStorage.removeItem("library_active_category"),se()}async function be(s=!1){try{const[e,t,a,n]=await Promise.all([ie.loadBookmarks(s),ie.loadCategories(s),ie.loadSeries(s),ie.loadFavorites(s)]);x.bookmarks=e,x.categories=t,x.series=a,x.favorites=n,x.loading=!1}catch{d("Failed to load library","error"),x.loading=!1}}async function se(){const s=document.getElementById("app"),e=localStorage.getItem("library_active_category");x.activeCategory!==e&&(x.activeCategory=e);const t=localStorage.getItem("library_artist_filter")||null;x.artistFilter!==t&&(x.artistFilter=t);const a=localStorage.getItem("library_search")||"";x.searchQuery!==a&&(x.searchQuery=a),x.loading&&(s.innerHTML=Ve()),x.bookmarks.length===0&&x.loading&&await be(),s.innerHTML=Ve(),Jt(),Ue.forEach(n=>n()),Ue=[ie.subscribe("bookmarks",n=>{x.bookmarks=n;const i=document.getElementById("library-grid");if(i){const o=kt();i.innerHTML=o.map(Et).join("")||$t()}})]}function $a(){const s=document.getElementById("app");s&&s.removeEventListener("click",ct),window.removeEventListener("clearFilters",lt),Ue.forEach(e=>e()),Ue=[]}const Ca={mount:se,unmount:$a,render:Ve};let r={manga:null,chapter:null,images:[],trophyPages:{},mode:"webtoon",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!1,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null,isStreamingMode:!1,_streamAbortController:null};function Xt(){if(!r.manga||!r.chapter||!r.allFavorites||!r.allFavorites.favorites)return!1;if(r.isCollectionMode)return!0;let e=[ut()];if(r.mode==="manga"&&!r.singlePageMode){const n=W()[r.currentPage];n&&Array.isArray(n)?e=n:n&&n.pages&&(e=n.pages)}const t=e.map(a=>{const n=Be(r.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in r.allFavorites.favorites){const n=r.allFavorites.favorites[a];if(Array.isArray(n)){for(const i of n)if(i.mangaId===r.manga.id&&i.chapterNum===r.chapter.number&&i.imagePaths)for(const o of i.imagePaths){const c=typeof o=="string"?o:(o==null?void 0:o.filename)||(o==null?void 0:o.path);for(const l of t)if(l&&l.filename===c)return!0}}}return!1}function dt(){const s=document.getElementById("favorites-btn");s&&(Xt()?s.classList.add("active"):s.classList.remove("active"))}function ye(){var u;if(r.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!r.manga||!r.images.length&&!r.isStreamingMode)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const s=r.manga.alias||r.manga.title,e=(u=r.chapter)==null?void 0:u.number,a=W().length,n=r.images.length;let i,o;r.mode==="webtoon"?(i=n-1,o=`${n} pages`):r.singlePageMode?(i=n-1,o=`${r.currentPage+1} / ${n}`):(i=a-1,o=`${r.currentPage+1} / ${a}`);const c=Xt(),l=ss();return`
    <div class="reader ${r.mode}-mode ${r.showControls?"":"controls-hidden"}">
      <!-- Unified Top Bar -->
      <div class="reader-bar">
        <button class="reader-bar-btn close-btn" id="reader-close-btn" title="Back">×</button>
        <div class="reader-title">
          <span class="manga-name">${s}</span>
          ${r.isStreamingMode?"":`<span class="chapter-name">Ch. ${e}</span>`}
        </div>
        ${r.isCollectionMode?"":`
        <div class="reader-bar-tools" id="reader-toolbar">
          ${r.isStreamingMode?`
          <button class="reader-bar-btn" id="stream-add-lib-btn" title="Add to Library">📥</button>
          <span class="reader-bar-divider"></span>
          `:`
          <button class="reader-bar-btn ${c?"active":""}" id="favorites-btn" title="Add to favorites">⭐</button>
          
          <button class="reader-bar-btn" id="rotate-btn" title="Rotate 90° CW">🔄</button>
          ${r.mode==="manga"&&!r.singlePageMode?`
            <button class="reader-bar-btn" id="swap-btn" title="Swap pages in spread">⇄</button>
          `:""}
          ${r.singlePageMode||r.mode==="webtoon"?`
            <button class="reader-bar-btn" id="split-btn" title="Split wide image into halves">✂️</button>
          `:""}
          <span class="reader-bar-divider"></span>
          `}
          ${r.mode==="manga"?`
            <button class="reader-bar-btn ${r.singlePageMode?"active":""}" id="single-page-btn" title="${r.singlePageMode?"Switch to double page":"Switch to single page"}">
              ${r.singlePageMode?"1️⃣":"2️⃣"}
            </button>
            ${r.isStreamingMode?"":`
            <button class="reader-bar-btn ${l?"active":""}" id="trophy-btn" title="${l?"Unmark trophy":"Mark as trophy"}">🏆</button>
            `}
          `:""}
          <button class="reader-bar-btn" id="fullscreen-btn" title="Toggle fullscreen">⛶</button>
          <button class="reader-bar-btn" id="reader-settings-btn" title="Settings">⚙️</button>
        </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${r.mode==="webtoon"?`zoom: ${r.zoom}%`:""}">
        ${r.isCollectionMode?Zt():r.mode==="webtoon"?es():ts()}
      </div>
      
      <!-- Footer -->
      <div class="reader-footer">
        ${r.isStreamingMode?"":`
        <button class="btn btn-secondary" id="prev-chapter-btn">← Prev</button>
        `}
        <div class="page-slider-container">
          ${r.mode!=="webtoon"?`
          <input type="range" class="page-slider" id="page-slider"
            min="0" max="${i}" value="${r.currentPage}"
          >
          `:""}
          <span class="page-indicator" id="page-indicator">${o}</span>
        </div>
        ${r.isStreamingMode?"":`
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
              <button class="btn ${r.mode==="webtoon"?"btn-primary":"btn-secondary"}" data-mode="webtoon">Webtoon</button>
              <button class="btn ${r.mode==="manga"?"btn-primary":"btn-secondary"}" data-mode="manga">Manga</button>
            </div>
          </div>
          ${r.mode==="webtoon"?`
          <div class="setting-row">
            <label>Zoom: ${r.zoom}%</label>
            <input type="range" min="50" max="200" value="${r.zoom}" id="zoom-slider">
          </div>
          `:`
          <div class="setting-row">
            <label>Direction</label>
            <div class="btn-group">
              <button class="btn ${r.direction==="rtl"?"btn-primary":"btn-secondary"}" data-direction="rtl">RTL ←</button>
              <button class="btn ${r.direction==="ltr"?"btn-primary":"btn-secondary"}" data-direction="ltr">→ LTR</button>
            </div>
          </div>
          <div class="settings-divider"></div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="first-page-single" ${r.firstPageSingle?"checked":""}> First Page Single
            </label>
            <span class="setting-hint">Show cover page alone</span>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="last-page-single" ${r.lastPageSingle?"checked":""}> 
                Link to Next Chapter
            </label>
            <span class="setting-hint">Pair last page with next chapter's first page</span>
          </div>
          `}
          <button class="btn btn-secondary settings-close-btn" id="close-settings-btn">Close</button>
        </div>
      </div>
    </div>
  `}function Zt(){const s=r.mode==="manga";if(s&&!r.singlePageMode){const e=r.images[r.currentPage];if(!e)return"";const t=e.urls||[e.url],a=e.displayMode||"single";return e.displaySide,a==="double"&&t.length>=2?`
            <div class="manga-spread collection-spread ${r.direction} double-page">
              <div class="manga-page"><img src="${t[0]}" alt="Page A"></div>
              <div class="manga-page"><img src="${t[1]}" alt="Page B"></div>
            </div>
            `:`
            <div class="manga-spread collection-spread single ${r.direction}">
              <div class="manga-page"><img src="${t[0]}" alt="Page"></div>
            </div>
            `}return`
    <div class="${s?"manga-spread single "+r.direction:"gallery-pages"}">
      ${(s?[r.images[r.currentPage]]:r.images).map((e,t)=>{if(!e)return"";const a=e.displayMode||"single",n=e.displaySide||"left",i=e.urls||[e.url];return a==="double"&&i.length>=2?`
            <div class="gallery-page double-page side-${n} ${s?"manga-page":""}" data-page="${t}">
              <img src="${i[0]}" alt="Page ${t+1}A" loading="lazy">
              <img src="${i[1]}" alt="Page ${t+1}B" loading="lazy">
            </div>
          `:`
            <div class="gallery-page single-page ${s?"manga-page":""}" data-page="${t}">
              <img src="${i[0]}" alt="Page ${t+1}" loading="lazy">
            </div>
          `}).join("")}
    </div>
  `}function es(){return`
    <div class="webtoon-pages">
      ${r.images.map((s,e)=>{const t=typeof s=="string"?s:s.url,a=r.trophyPages[e];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${e}">
          ${a?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${t}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function ts(){if(r.singlePageMode)return xa();const e=W()[r.currentPage];if(!e)return"";if(e.type==="link"){const t=e.pages[0],a=r.images[t],n=typeof a=="string"?a:a.url,i=r.trophyPages[t];return`
        <div class="manga-spread ${r.direction}">
          <div class="manga-page ${i?"trophy-page":""}">
            ${i?'<div class="trophy-indicator">🏆</div>':""}
            <img src="${n}" alt="Page ${t+1}">
          </div>
          <div class="manga-page link-page" id="link-page">
            <div class="link-overlay">Ch. ${e.nextChapter} →</div>
            <img src="${e.nextImage}" alt="Next chapter preview">
          </div>
        </div>
      `}return`
    <div class="manga-spread ${r.direction}">
      ${e.map(t=>{const a=r.images[t],n=typeof a=="string"?a:a.url,i=r.trophyPages[t];return`
        <div class="manga-page ${i?"trophy-page":""}">
          ${i?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${n}" alt="Page ${t+1}">
        </div>
      `}).join("")}
    </div>
  `}function xa(){const s=r.currentPage,e=r.trophyPages[s];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[i,o]=e.pages,c=r.images[i],l=r.images[o],u=typeof c=="string"?c:c==null?void 0:c.url,p=typeof l=="string"?l:l==null?void 0:l.url;if(u&&p)return`
            <div class="manga-spread ${r.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${u}" alt="Page ${i+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${p}" alt="Page ${o+1}"></div>
            </div>
            `}const t=r.images[s];if(!t)return"";const a=typeof t=="string"?t:t.url,n=r.trophyPages[s];return`
    <div class="manga-spread single ${r.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?'<div class="trophy-indicator">🏆</div>':""}
        <img src="${a}" alt="Page ${s+1}">
      </div>
    </div>
  `}function W(){const s=[],e=r.images.length;let t=0;if(r.isCollectionMode){for(let n=0;n<e;n++)s.push([n]);return s}let a=!r.firstPageSingle;for(;t<e;){const n=r.trophyPages[t];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[i,o]=n.pages;s.push([i,o]),t=Math.max(i,o)+1}else s.push([t]),t++;continue}if(!a){a=!0,s.push([t]),t++;continue}if(r.lastPageSingle&&t===e-1){r.nextChapterImage?s.push({type:"link",pages:[t],nextImage:r.nextChapterImage,nextChapter:r.nextChapterNum}):s.push([t]),t++;break}t+1<e?r.trophyPages[t+1]?(s.push([t]),t++):r.lastPageSingle&&t+1===e-1?(s.push([t]),r.nextChapterImage?s.push({type:"link",pages:[t+1],nextImage:r.nextChapterImage,nextChapter:r.nextChapterNum}):s.push([t+1]),t+=2):(s.push([t,t+1]),t+=2):(s.push([t]),t++)}return s}function ss(){if(r.singlePageMode)return!!r.trophyPages[r.currentPage];const e=W()[r.currentPage];return e?(Array.isArray(e)?e:e.pages||[]).some(a=>!!r.trophyPages[a]):!1}function as(){if(r.singlePageMode)return[r.currentPage];const e=W()[r.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function Sa(){if(!r.manga||!r.chapter||r.isCollectionMode)return;const s=as();if(s.length===0)return;if(s.some(t=>!!r.trophyPages[t])){const t=[...s];if(r.singlePageMode){const a=r.trophyPages[r.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(t.length=0,t.push(...a.pages))}t.forEach(a=>delete r.trophyPages[a]),d(`Page${t.length>1?"s":""} unmarked as trophy`,"info")}else{let t=s,a=r.singlePageMode||s.length===1;if(!r.singlePageMode&&s.length===2){const i=await is(s,"Mark as trophy 🏆");if(!i)return;t=i.pages,a=i.pages.length===1}t.forEach(i=>{r.trophyPages[i]={isSingle:a,pages:[...t]}});const n=a?"single":"double";d(`Page${t.length>1?"s":""} marked as trophy (${n}) 🏆`,"success")}try{await y.saveTrophyPages(r.manga.id,r.chapter.number,r.trophyPages)}catch(t){console.error("Failed to save trophy pages:",t)}ue(),ns()}function ns(){const s=document.getElementById("trophy-btn");if(s){const e=ss();s.classList.toggle("active",e),s.title=e?"Unmark trophy":"Mark as trophy"}}async function Ae(){if(!r.manga||!r.chapter||r.isCollectionMode||!r.images.length)return;let s=1;if(r.mode==="manga")if(r.singlePageMode)s=r.currentPage+1;else{const t=W()[r.currentPage];t&&t.length>0&&(s=t[0]+1)}else{const e=document.getElementById("reader-content");if(e){const t=e.querySelectorAll("img"),a=e.scrollTop;let n=0;t.forEach((i,o)=>{a>=n&&(s=o+1),n+=i.offsetHeight})}}try{await y.updateReadingProgress(r.manga.id,r.chapter.number,s,r.images.length)}catch(e){console.error("Failed to save progress:",e)}}function He(){var t,a,n,i,o,c,l,u,p,v,g,w,h,$,I,B,A,M,q;const s=document.getElementById("app");(t=document.getElementById("reader-close-btn"))==null||t.addEventListener("click",async()=>{r.isStreamingMode||(await Ae(),await fe()),r.isStreamingMode?T.go("/scrapers"):r.manga&&r.manga.id!=="gallery"?T.go(`/manga/${r.manga.id}`):T.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{T.go(r.isStreamingMode?"/scrapers":"/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var C;(C=document.getElementById("reader-settings"))==null||C.classList.toggle("hidden")}),(i=document.getElementById("close-settings-btn"))==null||i.addEventListener("click",()=>{var C;(C=document.getElementById("reader-settings"))==null||C.classList.add("hidden")}),(o=document.getElementById("single-page-btn"))==null||o.addEventListener("click",()=>{if(r.singlePageMode){const C=W();let f=0;for(let E=0;E<C.length;E++)if(C[E].includes(r.currentPage)){f=E;break}r.singlePageMode=!1,r.currentPage=f}else{const f=W()[r.currentPage];r.singlePageMode=!0,r.currentPage=f?f[0]:0}Ie()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{Sa()}),s.querySelectorAll("[data-mode]").forEach(C=>{C.addEventListener("click",()=>{var R,m;const f=C.dataset.mode;let E=ut();if(r.mode=f,localStorage.setItem("reader_mode",r.mode),f==="webtoon")r.currentPage=E;else if(r.singlePageMode)r.currentPage=E;else{const k=W();let S=0;for(let L=0;L<k.length;L++)if(k[L].includes(E)){S=L;break}r.currentPage=S}(R=r.manga)!=null&&R.id&&((m=r.chapter)!=null&&m.number)&&fe(),Ie(),f==="webtoon"&&setTimeout(()=>{const k=document.getElementById("reader-content");if(k){const S=k.querySelectorAll("img");S[E]&&S[E].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),s.querySelectorAll("[data-direction]").forEach(C=>{C.addEventListener("click",async()=>{var f,E;r.direction=C.dataset.direction,localStorage.setItem("reader_direction",r.direction),(f=r.manga)!=null&&f.id&&((E=r.chapter)!=null&&E.number)&&await fe(),Ie()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async C=>{r.firstPageSingle=C.target.checked,await fe(),ue()}),(u=document.getElementById("last-page-single"))==null||u.addEventListener("change",async C=>{var f,E;r.lastPageSingle=C.target.checked,await fe(),r.lastPageSingle&&((f=r.manga)!=null&&f.id)&&((E=r.chapter)!=null&&E.number)?await rs():(r.nextChapterImage=null,r.nextChapterNum=null),ue()}),(p=document.getElementById("zoom-slider"))==null||p.addEventListener("input",C=>{r.zoom=parseInt(C.target.value);const f=document.getElementById("reader-content");f&&(f.style.zoom=`${r.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",C=>{const f=parseInt(C.target.value),E=document.getElementById("page-indicator");E&&(r.singlePageMode?E.textContent=`${f+1} / ${r.images.length}`:E.textContent=`${f+1} / ${W().length}`)}),e.addEventListener("change",C=>{r.currentPage=parseInt(C.target.value),ue()})),r.mode==="manga"){const C=document.getElementById("reader-content");C==null||C.addEventListener("click",f=>{var k;if(f.target.closest("button, a, .link-overlay"))return;const E=C.getBoundingClientRect(),m=(f.clientX-E.left)/E.width;m<.3?pt():m>.7?Fe():(r.showControls=!r.showControls,(k=document.querySelector(".reader"))==null||k.classList.toggle("controls-hidden",!r.showControls))})}document.addEventListener("keydown",os),(v=document.getElementById("prev-chapter-btn"))==null||v.addEventListener("click",()=>ze(-1)),(g=document.getElementById("next-chapter-btn"))==null||g.addEventListener("click",()=>ze(1)),r.mode==="webtoon"&&((w=document.getElementById("reader-content"))==null||w.addEventListener("click",()=>{var C;r.showControls=!r.showControls,(C=document.querySelector(".reader"))==null||C.classList.toggle("controls-hidden",!r.showControls)})),(h=document.getElementById("rotate-btn"))==null||h.addEventListener("click",async()=>{const C=et();if(!(!C||!r.manga||!r.chapter))try{d("Rotating...","info");const f=await y.rotatePage(r.manga.id,r.chapter.number,C);f.images&&(await tt(f.images),d("Page rotated","success"))}catch(f){d("Rotate failed: "+f.message,"error")}}),($=document.getElementById("swap-btn"))==null||$.addEventListener("click",async()=>{const f=W()[r.currentPage];if(!f||f.length!==2||!r.manga||!r.chapter){d("Select a spread with 2 pages to swap","info");return}const E=Be(r.images[f[0]]),R=Be(r.images[f[1]]);if(!(!E||!R))try{d("Swapping...","info");const m=await y.swapPages(r.manga.id,r.chapter.number,E,R);m.images&&(await tt(m.images),d("Pages swapped","success"))}catch(m){d("Swap failed: "+m.message,"error")}}),(I=document.getElementById("split-btn"))==null||I.addEventListener("click",async()=>{const C=et();if(!C||!r.manga||!r.chapter||!confirm("Split this page into halves? This is permanent."))return;const f=document.getElementById("split-btn");try{d("Preparing to split...","info"),f&&(f.disabled=!0),r.images=[],r.loading=!0,s.innerHTML=ye(),await new Promise(R=>setTimeout(R,2e3)),d("Splitting page...","info");const E=await y.splitPage(r.manga.id,r.chapter.number,C);f&&(f.disabled=!1),await ge(r.manga.id,r.chapter.number,r.chapter.versionUrl),s.innerHTML=ye(),He(),ue(),E.warning?d(E.warning,"warning"):d("Page split into halves","success")}catch(E){f&&(f.disabled=!1),d("Split failed: "+E.message,"error"),await ge(r.manga.id,r.chapter.number,r.chapter.versionUrl),s.innerHTML=ye(),He()}}),(B=document.getElementById("delete-page-btn"))==null||B.addEventListener("click",async()=>{const C=et();if(!(!C||!r.manga||!r.chapter)&&confirm(`Delete page "${C}" permanently? This cannot be undone.`))try{d("Deleting...","info");const f=await y.deletePage(r.manga.id,r.chapter.number,C);f.images&&(await tt(f.images),d("Page deleted","success"))}catch(f){d("Delete failed: "+f.message,"error")}}),(A=document.getElementById("favorites-btn"))==null||A.addEventListener("click",async()=>{try{const E=await y.getFavorites();r.allFavorites=E,r.favoriteLists=Object.keys(E.favorites||E||{})}catch(E){console.error("Failed to load favorites",E),d("Failed to load favorites","error");return}let f=[ut()];if(r.mode==="manga"&&!r.singlePageMode){const R=W()[r.currentPage];R&&Array.isArray(R)?f=R:R&&R.pages&&(f=R.pages)}if(f.length>1){const E=await is(f,"Select Page for Favorites ⭐");if(!E)return;f=E.pages}Ba(f)}),(M=document.getElementById("fullscreen-btn"))==null||M.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{d("Fullscreen not supported","info")})}),(q=document.getElementById("stream-add-lib-btn"))==null||q.addEventListener("click",async()=>{var E;const C=document.getElementById("stream-add-lib-btn");if(!((E=r.manga)!=null&&E._streamUrl)){d("No URL to add","error");return}const f=C.textContent;C.textContent="⏳",C.disabled=!0;try{const R=await y.addBookmark(r.manga._streamUrl);if(!R.jobId)throw new Error("No job ID returned");d("Adding to library...","info");const m=setInterval(async()=>{var k;try{const L=(await y.getQueueHistory(20)).find(P=>P.id===R.jobId);L&&(L.status==="completed"?(clearInterval(m),(k=L.result)!=null&&k.bookmark&&(d("Added to library!","success"),C.textContent="✅",C.title="Added! Click to view",C.disabled=!1,C.onclick=()=>{T.go(`/manga/${L.result.bookmark.id}`)})):L.status==="failed"&&(clearInterval(m),d("Failed to add: "+(L.error||"Unknown error"),"error"),C.textContent=f,C.disabled=!1))}catch{}},1500)}catch(R){d("Failed to add: "+R.message,"error"),C.textContent=f,C.disabled=!1}}),document.body.classList.add("reader-active")}function Be(s){var n;const e=typeof s=="string"?s:(s==null?void 0:s.url)||((n=s==null?void 0:s.urls)==null?void 0:n[0]);if(!e)return null;const a=e.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function et(){const s=as();return s.length===0?null:Be(r.images[s[0]])}async function tt(s){const e=Date.now();if(r.images=s.map(t=>{const a=typeof t=="string"?t:t==null?void 0:t.url;if(!a)return t;const n=a+(a.includes("?")?"&":"?")+`_t=${e}`;return typeof t=="string"?n:{...t,url:n}}),r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.min(r.currentPage,r.images.length-1);else{const t=W();r.currentPage=Math.min(r.currentPage,t.length-1)}r.currentPage=Math.max(0,r.currentPage),ue()}async function rs(){var s,e;if(!(!((s=r.manga)!=null&&s.id)||!((e=r.chapter)!=null&&e.number)))try{const t=await y.getNextChapterPreview(r.manga.id,r.chapter.number);r.nextChapterImage=t.firstImage||null,r.nextChapterNum=t.nextChapter||null}catch{r.nextChapterImage=null,r.nextChapterNum=null}}async function Ia(){var i,o;if(!((i=r.manga)!=null&&i.id)||!((o=r.chapter)!=null&&o.number)||r.isCollectionMode)return;const e=[...r.manga.downloadedChapters||[]].sort((c,l)=>c-l),t=e.indexOf(r.chapter.number);if(t<0||t>=e.length-1)return;const a=e[t+1],n=r.manga.id;if(!(r._preloadCache&&r._preloadCache.chapterNum===a&&r._preloadCache.mangaId===n))try{const l=(r.manga.downloadedVersions||{})[a]||[],u=Array.isArray(l)?l[0]:l,p=u?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(u)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,g=(await y.get(p)).images||[];if(g.length===0)return;const w=g.map(h=>{const $=new Image,I=typeof h=="string"?h:h.url;return I&&($.src=I),$});r._preloadCache={chapterNum:a,mangaId:n,images:g,imageObjects:w,versionUrl:u},console.log(`[Reader] Preloaded ${g.length} images for chapter ${a}`)}catch(c){console.warn("[Reader] Failed to preload next chapter:",c)}}function La(s,e){return new Promise(t=>{const a=document.createElement("div");a.className="version-modal-overlay",a.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${s.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const n=a.querySelector(".version-list");s.forEach((i,o)=>{const c=document.createElement("button");c.className="version-item",c.textContent=`Version ${o+1}`,c.addEventListener("click",()=>{a.remove(),t(i)}),n.appendChild(c)}),a.querySelector(".version-cancel").addEventListener("click",()=>{a.remove(),t(null)}),a.addEventListener("click",i=>{i.target===a&&(a.remove(),t(null))}),document.body.appendChild(a)})}function Ba(s){if(!r.manga||!r.chapter)return;const e=s.map(l=>{const u=Be(r.images[l]);return u?{filename:u}:null}).filter(Boolean),t=l=>{if(!r.allFavorites||!r.allFavorites.favorites)return-1;const u=r.allFavorites.favorites[l];if(!Array.isArray(u))return-1;for(let p=0;p<u.length;p++){const v=u[p];if(v.mangaId===r.manga.id&&v.chapterNum===r.chapter.number&&v.imagePaths)for(const g of v.imagePaths){const w=typeof g=="string"?g:(g==null?void 0:g.filename)||(g==null?void 0:g.path);for(const h of e)if(h&&h.filename===w)return p}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";r.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',r.favoriteLists.forEach(l=>{const p=t(l)!==-1;n+=`
                <button class="page-picker-option list-option ${p?"active-list":""}" data-list="${l}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${l}</span>
                    <span style="font-size: 1.2em;">${p?"✅":"➕"}</span>
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
    `;const i=document.createElement("style");i.innerHTML=`
        .list-option.active-list {
            background: #2a3b2a;
            border-color: #4CAF50;
        }
        .list-option.active-list:hover {
            background: #384d38;
        }
    `,a.appendChild(i),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),dt()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),dt())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const u=l.dataset.list,p=t(u),v=p!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(v){await y.removeFavoriteItem(u,p);const g=await y.getFavorites();r.allFavorites=g,l.classList.remove("active-list"),l.querySelector("span:last-child").textContent="➕"}else{const g=s.length>1?"double":"single",w={mangaId:r.manga.id,chapterNum:r.chapter.number,title:`${r.manga.alias||r.manga.title} Ch.${r.chapter.number} p${s[0]+1}`,imagePaths:e,displayMode:g,displaySide:r.direction==="rtl"?"right":"left"};await y.addFavoriteItem(u,w);const h=await y.getFavorites();r.allFavorites=h,l.classList.add("active-list"),l.querySelector("span:last-child").textContent="✅"}}catch(g){console.error(g)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function is(s,e){return new Promise(t=>{const[a,n]=s,i=r.images[a],o=r.images[n],c=typeof i=="string"?i:i==null?void 0:i.url,l=typeof o=="string"?o:o==null?void 0:o.url,u=r.direction==="rtl",p=u?n:a,v=u?a:n,g=u?l:c,w=u?c:l,h=document.createElement("div");h.className="page-picker-overlay",h.innerHTML=`
            <div class="page-picker-modal">
                <h3>${e}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${p+1}">
                        <img src="${g}" alt="Page ${p+1}">
                        <span class="page-picker-label">Page ${p+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${v+1}">
                        <img src="${w}" alt="Page ${v+1}">
                        <span class="page-picker-label">Page ${v+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    📖 Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const $=I=>{h.remove(),t(I)};h.querySelectorAll(".page-picker-option").forEach(I=>{I.addEventListener("click",()=>{const B=I.dataset.choice;B==="left"?$({pages:[p]}):B==="right"?$({pages:[v]}):B==="both"&&$({pages:s})})}),h.querySelector(".page-picker-cancel").addEventListener("click",()=>$(null)),h.addEventListener("click",I=>{I.target===h&&$(null)}),document.body.appendChild(h)})}function ut(){if(r.mode==="webtoon"){const s=document.getElementById("reader-content");if(s){const e=s.querySelectorAll("img");if(e.length>0){const t=s.scrollTop;if(t>10){let a=0;for(let n=0;n<e.length;n++){const i=e[n].offsetHeight;if(a+i>t)return n;a+=i}}}}return 0}else{if(r.singlePageMode)return r.currentPage;{const e=W()[r.currentPage];return e&&e.length>0?e[0]:0}}}function os(s){if(!(s.target.tagName==="INPUT"||s.target.tagName==="TEXTAREA")){if(s.key==="Escape"){Ae(),r.manga&&T.go(`/manga/${r.manga.id}`);return}if(r.mode==="manga")s.key==="ArrowLeft"?r.direction==="rtl"?Fe():pt():s.key==="ArrowRight"?r.direction==="rtl"?pt():Fe():s.key===" "&&(s.preventDefault(),Fe());else if(r.mode==="webtoon"&&s.key===" "){s.preventDefault();const e=document.getElementById("reader-content");if(e){const t=e.clientHeight*.8;e.scrollBy({top:s.shiftKey?-t:t,behavior:"smooth"})}}}}function Fe(){const s=W(),e=r.singlePageMode?r.images.length-1:s.length-1;if(r.currentPage<e)r.currentPage++,ue();else{const t=s[r.currentPage],a=t&&t.type==="link";Ae(),a&&(r.navigationDirection="next-linked"),ze(1)}}function pt(){r.currentPage>0?(r.currentPage--,ue()):ze(-1)}function ue(){const s=document.getElementById("reader-content");if(s){s.innerHTML=r.isCollectionMode?Zt():r.mode==="webtoon"?es():ts();const e=document.getElementById("page-indicator");e&&(r.singlePageMode?e.textContent=`${r.currentPage+1} / ${r.images.length}`:e.textContent=`${r.currentPage+1} / ${W().length}`);const t=document.getElementById("page-slider");t&&(t.value=r.currentPage,t.max=r.singlePageMode?r.images.length-1:W().length-1),ns(),dt()}}function Ie(){const s=document.getElementById("app");s&&(s.innerHTML=ye(),He())}async function ze(s){if(console.log("[Nav] navigateChapter called with delta:",s),r.isStreamingMode)return;if(!r.manga||!r.chapter){console.log("[Nav] early return - no manga or chapter");return}await Ae(),await fe();const t=[...r.manga.downloadedChapters||[]].sort((i,o)=>i-o),a=t.indexOf(r.chapter.number),n=a+s;if(console.log("[Nav]",{delta:s,chapterNumber:r.chapter.number,sorted:t,currentIdx:a,newIdx:n}),n>=0&&n<t.length){r.navigationDirection||(r.navigationDirection=s<0?"prev":null);const i=t[n],c=(r.manga.downloadedVersions||{})[i]||[],l=Array.isArray(c)?c[0]:c,u=l?`?version=${encodeURIComponent(l)}`:"";console.log("[Nav] Calling router.go with:",`/read/${r.manga.id}/${i}${u}`),T.go(`/read/${r.manga.id}/${i}${u}`)}else d(s>0?"Last chapter":"First chapter","info")}async function ge(s,e,t){var a,n,i,o,c;console.log("[Reader] loadData called:",{mangaId:s,chapterNum:e,versionUrl:t});try{if(r.mode=localStorage.getItem("reader_mode")||"webtoon",r.direction=localStorage.getItem("reader_direction")||"rtl",s==="gallery"){const l=decodeURIComponent(e),p=((a=(await y.getFavorites()).favorites)==null?void 0:a[l])||[];r.images=[];for(const v of p){const g=v.imagePaths||[],w=[];for(const h of g){let $;typeof h=="string"?$=h:h&&typeof h=="object"&&($=h.filename||h.path||h.name||h.url,$&&$.includes("/")&&($=$.split("/").pop()),$&&$.includes("\\")&&($=$.split("\\").pop())),$&&w.push(`/api/public/chapter-images/${v.mangaId}/${v.chapterNum}/${encodeURIComponent($)}`)}w.length>0&&r.images.push({urls:w,displayMode:v.displayMode||"single",displaySide:v.displaySide||"left"})}r.manga={id:"gallery",title:l,alias:l},r.chapter={number:"Gallery"},r.isGalleryMode=!0,r.isCollectionMode=!0,r.images.length===0&&d("Gallery is empty","warning")}else if(s==="trophies"){const l=e;let u=[],p="Trophies";if(l.startsWith("series-")){const v=l.replace("series-",""),w=(await store.loadSeries()).find(I=>I.id===v);p=w?w.alias||w.title:"Series Trophies";const $=(await store.loadBookmarks()).filter(I=>I.seriesId===v);for(const I of $){const B=await y.getTrophyPagesAll(I.id);for(const A in B)for(const M in B[A]){const q=B[A][M],f=(await y.getChapterImages(I.id,A)).images[M],E=typeof f=="string"?f.split("/").pop():(f==null?void 0:f.filename)||(f==null?void 0:f.path);u.push({mangaId:I.id,chapterNum:A,imagePaths:[{filename:E}],displayMode:q.isSingle?"single":"double",displaySide:"left"})}}}else{const v=await y.getBookmark(l);p=v?v.alias||v.title:"Manga Trophies";const g=await y.getTrophyPagesAll(l);for(const w in g)for(const h in g[w]){const $=g[w][h],B=(await y.getChapterImages(l,w)).images[h],A=typeof B=="string"?B.split("/").pop():(B==null?void 0:B.filename)||(B==null?void 0:B.path);u.push({mangaId:l,chapterNum:w,imagePaths:[{filename:decodeURIComponent(A)}],displayMode:$.isSingle?"single":"double",displaySide:"left"})}}r.images=u.map(v=>{const g=v.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${v.mangaId}/${v.chapterNum}/${encodeURIComponent(g)}`],displayMode:v.displayMode,displaySide:v.displaySide}}),r.manga={id:"trophies",title:p,alias:p},r.chapter={number:"🏆"},r.isCollectionMode=!0,r.isGalleryMode=!1}else if(s==="stream"){r.isStreamingMode=!0,r.isCollectionMode=!1,r.isGalleryMode=!1;const l=sessionStorage.getItem("streamPreviewUrl"),u=sessionStorage.getItem("streamPreviewScraper"),p=sessionStorage.getItem("streamPreviewTitle")||"Preview";r.manga={id:"stream",title:p,alias:p,_streamUrl:l},r.chapter={number:1},r.images=[],l?_a(l,u):d("No stream URL found","error")}else{r.isGalleryMode=!1;const l=await y.getBookmark(s);r.manga=l,console.log("[Reader] manga loaded, finding chapter..."),r.chapter=((n=l.chapters)==null?void 0:n.find(p=>p.number===parseFloat(e)))||{number:parseFloat(e)};const u=parseFloat(e);if(r._preloadCache&&r._preloadCache.mangaId===s&&r._preloadCache.chapterNum===u)console.log("[Reader] Using preloaded images for chapter",e),r.images=r._preloadCache.images||[],r._preloadCache=null;else{const p=t?`/bookmarks/${s}/chapters/${e}/reader-images?version=${encodeURIComponent(t)}`:`/bookmarks/${s}/chapters/${e}/reader-images`,v=await y.get(p);console.log("[Reader] images loaded, count:",(i=v.images)==null?void 0:i.length),r.images=v.images||[]}try{const p=await y.getChapterSettings(s,e);if(p&&(p.mode||p.direction||p.firstPageSingle!==void 0||p.lastPageSingle!==void 0))p.mode&&(r.mode=p.mode),p.direction&&(r.direction=p.direction),p.firstPageSingle!==void 0&&(r.firstPageSingle=p.firstPageSingle),p.lastPageSingle!==void 0&&(r.lastPageSingle=p.lastPageSingle);else try{const w=[...r.manga.downloadedChapters||[]].sort((B,A)=>B-A),h=parseFloat(e),$=w.indexOf(h),I=[];$>0&&I.push(w[$-1]),$<w.length-1&&I.push(w[$+1]);for(const B of I){const A=await y.getChapterSettings(s,B);if(A&&(A.mode||A.direction||A.firstPageSingle!==void 0||A.lastPageSingle!==void 0)){A.mode&&(r.mode=A.mode),A.direction&&(r.direction=A.direction),A.firstPageSingle!==void 0&&(r.firstPageSingle=A.firstPageSingle),A.lastPageSingle!==void 0&&(r.lastPageSingle=A.lastPageSingle),console.log("[Reader] Inherited settings from chapter",B);break}}}catch(g){console.warn("Failed to inherit chapter settings",g)}}catch(p){console.warn("Failed to load chapter settings",p)}try{const p=await y.getTrophyPages(s,e);r.trophyPages=p||{}}catch(p){console.warn("Failed to load trophy pages",p)}try{const p=await y.getFavorites();r.allFavorites=p,r.favoriteLists=Object.keys(p.favorites||p||{})}catch(p){console.warn("Failed to load favorites",p)}}if(r.isStreamingMode)r.currentPage=0;else{const l=parseFloat(e),u=(c=(o=r.manga)==null?void 0:o.readingProgress)==null?void 0:c[l];if(u&&u.page<u.totalPages)if(r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.max(0,u.page-1);else{const p=Math.max(0,u.page-1),v=W();let g=0;for(let w=0;w<v.length;w++){const h=v[w],$=Array.isArray(h)?h:h.pages||[];if($.includes(p)||$[0]>=p){g=w;break}g=w}r.currentPage=g}else r.currentPage=0,r._resumeScrollToPage=u.page-1;else r.currentPage=0}}catch(l){console.error("Error loading chapter:",l),d("Failed to load chapter","error")}if(!r.isStreamingMode){if(r.navigationDirection==="prev"&&r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.max(0,r.images.length-1);else{const l=W();r.currentPage=Math.max(0,l.length-1)}else if(r.navigationDirection==="next-linked"&&r.mode==="manga"&&r.images.length>1)if(r.singlePageMode)r.currentPage=1;else{const l=W();let u=0;for(let p=0;p<l.length;p++){const v=l[p];if((Array.isArray(v)?v:v.pages||[]).includes(1)){u=p;break}}r.currentPage=u}}r.navigationDirection=null,r.lastPageSingle&&!r.isStreamingMode&&await rs(),r.loading=!1,Ie(),r.isStreamingMode||Ia(),r.mode==="webtoon"&&r._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const u=l.querySelectorAll("img");u[r._resumeScrollToPage]&&u[r._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete r._resumeScrollToPage},300)}async function _a(s,e){r._streamAbortController&&r._streamAbortController.abort(),r._streamAbortController=new AbortController;const{signal:t}=r._streamAbortController;try{let a="/api/scrapers/preview-images-stream?";e&&(a+=`scraper=${encodeURIComponent(e)}&`),a+=`url=${encodeURIComponent(s)}`;const n=localStorage.getItem("manga_auth_token"),i={};n&&(i.Authorization=`Bearer ${n}`),console.log("[Reader] Starting stream from:",a);const o=await fetch(a,{headers:i,signal:t});if(!o.ok)throw new Error(`Failed to start stream: ${o.statusText}`);const c=o.body.getReader(),l=new TextDecoder;let u="";for(;;){const{value:p,done:v}=await c.read();if(v||t.aborted)break;u+=l.decode(p,{stream:!0});const g=u.split(`

`);u=g.pop();let w=!1;for(const h of g)if(h.startsWith("data: ")){const $=h.substring(6);try{const I=JSON.parse($);if(I.type==="metadata")r.manga.title=I.title,r.manga.alias=I.title,Ie();else if(I.type==="image"){const B=`/api/scrapers/proxy-cover?url=${encodeURIComponent(I.url)}`;r.images.push(B),w=!0}else if(I.type==="error")d("Stream error: "+I.message,"error");else if(I.type==="done")break}catch(I){console.error("Parse error for SSE data:",I)}}w&&ue()}}catch(a){a.name!=="AbortError"&&(console.error("Preview stream error:",a),d("Stream failed: "+a.message,"error"))}finally{r._streamAbortController&&r._streamAbortController.signal===t&&(r._streamAbortController=null)}}async function Aa(s=[]){console.log("[Reader] mount called with params:",s);let[e,t]=s,a=null;if(t&&t.includes("?")){const[i,o]=t.split("?");t=i,a=new URLSearchParams(o).get("version")}if(console.log("[Reader] mangaId:",e,"chapterNum:",t,"urlVersion:",a),!e||!t){T.go("/");return}const n=document.getElementById("app");if(r.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),r.images=[],r.singlePageMode=!1,r._resumeScrollToPage=null,r.nextChapterImage=null,r.nextChapterNum=null,n.innerHTML=ye(),a)await ge(e,t,decodeURIComponent(a));else try{const i=await y.getBookmark(e),o=i.downloadedVersions||{},c=new Set(i.deletedChapterUrls||[]),l=o[parseFloat(t)];let u=[];if(Array.isArray(l)&&(u=l.filter(p=>!c.has(p))),u.length>1){const p=await La(u,t);if(p===null){T.go(`/manga/${e}`);return}await ge(e,t,p)}else u.length===1?await ge(e,t,u[0]):await ge(e,t)}catch(i){console.log("[Reader] Error in version check, falling back:",i),await ge(e,t)}if(n.innerHTML=ye(),console.log("[Reader] render called, loading:",r.loading,"manga:",!!r.manga,"images:",r.images.length),He(),r.mode==="webtoon"&&r._resumeScrollToPage!=null){const i=r._resumeScrollToPage;r._resumeScrollToPage=null,setTimeout(()=>{const o=document.getElementById("reader-content");if(o){const c=o.querySelectorAll("img");c[i]&&c[i].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function Pa(){console.log("[Reader] unmount called"),r._streamAbortController&&(r._streamAbortController.abort(),r._streamAbortController=null),r.isStreamingMode||(await Ae(),await fe()),document.body.classList.remove("reader-active"),document.removeEventListener("keydown",os),r.manga=null,r.chapter=null,r.images=[],r.loading=!0,r.singlePageMode=!1,r.isStreamingMode=!1,r._resumeScrollToPage=null,r._preloadCache=null}async function fe(){if(!(!r.manga||!r.chapter||r.manga.id==="gallery"||r.isStreamingMode))try{await y.updateChapterSettings(r.manga.id,r.chapter.number,{mode:r.mode,direction:r.direction,firstPageSingle:r.firstPageSingle,lastPageSingle:r.lastPageSingle})}catch(s){console.error("Failed to save settings:",s)}}async function ls(s){try{const e=await y.getBookmark(s),t=e.downloadedChapters||[],a=new Set(e.readChapters||[]),n=e.readingProgress||{},i=e.downloadedVersions||{},o=[...t].sort((l,u)=>l-u);let c=null;for(const l of o){const u=n[l];if(u&&u.page<u.totalPages&&!a.has(l)){c=l;break}}if(c===null){for(const l of o)if(!a.has(l)){c=l;break}}if(c===null&&o.length>0&&(c=o[0]),c!==null){const l=i[c]||[],u=Array.isArray(l)?l[0]:l,p=u?`?version=${encodeURIComponent(u)}`:"";T.go(`/read/${s}/${c}${p}`)}else d("No downloaded chapters to read","info")}catch(e){d("Failed to continue reading: "+e.message,"error")}}const Ta={mount:Aa,unmount:Pa,render:ye,continueReading:ls},Ma="manga-offline",Ra=1,ht="images",je="chapters";let Me=null;function cs(){return new Promise((s,e)=>{if(Me)return s(Me);const t=indexedDB.open(Ma,Ra);t.onupgradeneeded=a=>{const n=a.target.result;n.objectStoreNames.contains(ht)||n.createObjectStore(ht),n.objectStoreNames.contains(je)||n.createObjectStore(je)},t.onsuccess=()=>{Me=t.result,s(Me)},t.onerror=()=>e(t.error)})}function Tt(s,e,t){return cs().then(a=>new Promise((n,i)=>{const l=a.transaction(s,"readwrite").objectStore(s).put(t,e);l.onsuccess=()=>n(),l.onerror=()=>i(l.error)}))}function Na(s){return cs().then(e=>new Promise((t,a)=>{const o=e.transaction(s,"readonly").objectStore(s).getAllKeys();o.onsuccess=()=>t(o.result),o.onerror=()=>a(o.error)}))}function Da(s,e){return`${s}:${e}`}function qa(s,e,t){return`${s}:${e}:${t}`}function Fa(s){const e=s.split(":");return{mangaId:e[0],chapterNum:parseFloat(e[1])}}async function Oa(s,e,t=null){const a=await y.get(`/bookmarks/${s}/chapters/${e}/reader-images`);if(!a||!a.images||a.images.length===0)throw new Error("No images found for this chapter");const n=a.images,i=n.length;let o=0;const c=y.getToken();for(let u=0;u<n.length;u++){const p=typeof n[u]=="string"?n[u]:n[u].url,v=p.startsWith("http")?p:`${window.location.origin}${p}`;try{const g=await fetch(v,{headers:c?{Authorization:`Bearer ${c}`}:{}});if(!g.ok)throw new Error(`HTTP ${g.status}`);const w=await g.blob();await Tt(ht,qa(s,e,p),w),o++,t&&t(o,i)}catch(g){console.error(`[Offline] Failed to cache image ${u+1}/${i}:`,g)}}const l={mangaId:s,chapterNum:e,imageUrls:n.map(u=>typeof u=="string"?u:u.url),savedAt:Date.now(),imageCount:o};return await Tt(je,Da(s,e),l),{success:!0,imageCount:o}}async function Ua(s){const e=await Na(je),t=[];for(const a of e)if(!a.startsWith("auto-offline-")&&a.startsWith(`${s}:`)){const{chapterNum:n}=Fa(a);t.push(n)}return t}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",async s=>{var e;if(((e=s.data)==null?void 0:e.type)==="sync-offline"){const t=s.data.mangaId;console.log(`[Offline] Auto-sync triggered for manga ${t}`);try{await Va(t)}catch(a){console.error("[Offline] Auto-sync failed:",a)}}});async function Va(s){try{const e=await y.getBookmark(s);if(!e)return;const t=e.downloadedChapters||[],a=await Ua(s),n=t.filter(i=>!a.includes(i));console.log(`[Offline] ${n.length} new chapters to sync for ${e.alias||e.title}`);for(const i of n)await Oa(s,i),console.log(`[Offline] Auto-synced chapter ${i}`)}catch(e){console.error("[Offline] Sync error:",e)}}const Le=50;let b={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1,offlineChapters:new Set,isAutoOffline:!1};function Ha(s){return s.autoCheck===!0?`<button class="btn btn-primary" id="schedule-btn">⏰ ${s.checkSchedule==="weekly"?`${(s.checkDay||"monday").charAt(0).toUpperCase()+(s.checkDay||"monday").slice(1)} ${s.checkTime||"06:00"}`:s.checkSchedule==="daily"?`Daily ${s.checkTime||"06:00"}`:"Every 6h"}</button>`:'<button class="btn btn-secondary" id="schedule-btn">⏰ Schedule</button>'}function za(s){const e=s.autoCheck===!0,t=s.checkSchedule||"daily",a=s.checkDay||"monday",n=s.checkTime||"06:00",i=s.autoDownload||!1;return`
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
              <option value="daily" ${t==="daily"?"selected":""}>Daily</option>
              <option value="weekly" ${t==="weekly"?"selected":""}>Weekly</option>
            </select>
          </div>
          <div class="form-group" id="schedule-day-group" style="${t==="weekly"?"":"display:none"}">
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
              <input type="checkbox" id="auto-download-toggle" ${i?"checked":""} style="width: 18px; height: 18px;">
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
  `}function mt(){var C;if(b.loading)return`
      ${te()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const s=b.manga;if(!s)return`
      ${te()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=s.alias||s.title,t=s.chapters||[],a=new Set(s.downloadedChapters||[]),n=new Set(s.readChapters||[]),i=new Set(s.excludedChapters||[]),o=new Set(s.deletedChapterUrls||[]),c=s.volumes||[],l=new Set;c.forEach(f=>{(f.chapters||[]).forEach(E=>l.add(E))});let u;b.filter==="hidden"?u=t.filter(f=>i.has(f.number)||o.has(f.url)):u=t.filter(f=>!i.has(f.number)&&!o.has(f.url));const p=u.filter(f=>!l.has(f.number));let v=[];if(b.activeVolume){const f=new Set(b.activeVolume.chapters||[]);v=u.filter(E=>f.has(E.number))}else v=p;const g=new Map;v.forEach(f=>{g.has(f.number)||g.set(f.number,[]),g.get(f.number).push(f)});let w=Array.from(g.entries()).sort((f,E)=>f[0]-E[0]);b.filter==="downloaded"?w=w.filter(([f])=>a.has(f)):b.filter==="not-downloaded"?w=w.filter(([f])=>!a.has(f)):b.filter==="main"?w=w.filter(([f])=>Number.isInteger(f)):b.filter==="extra"&&(w=w.filter(([f])=>!Number.isInteger(f)));const h=Math.max(1,Math.ceil(w.length/Le));b.currentPage>=h&&(b.currentPage=Math.max(0,h-1));const $=b.currentPage*Le,B=[...w.slice($,$+Le)].reverse(),A=g.size,M=[...g.keys()].filter(f=>a.has(f)).length;n.size;let q="";if(b.activeVolume){const f=b.activeVolume;let E=null;f.local_cover?E=`/api/public/covers/${s.id}/${encodeURIComponent(f.local_cover.split(/[/\\]/).pop())}`:f.cover&&(E=f.cover),q=`
      ${te()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${E?`<img src="${E}" alt="${f.name}">`:'<div class="placeholder">📚</div>'}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${s.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${f.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${A} Chapters</span>
                ${M>0?`<span class="meta-item downloaded">${M} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${s.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${b.manageChapters?"Done Managing":"➕ Add Chapters"}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${f.id}">✏️ Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const f=s.localCover?`/api/public/covers/${s.id}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover;q=`
        ${te()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${f?`<img src="${f}" alt="${e}">`:'<div class="placeholder">📚</div>'}
              </div>
              <div class="manga-detail-info">
                <h1>${e}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${s.website||"Local"}</span>
                  <span class="meta-item">${((C=s.chapters)==null?void 0:C.length)||0} Total Chapters</span>
                  ${a.size>0?`<span class="meta-item downloaded">${a.size} Downloaded</span>`:""}
                  ${n.size>0?`<span class="meta-item">${n.size} Read</span>`:""}
                </div>
                ${(s.artists||[]).length>0||(s.categories||[]).length>0?`
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(s.artists||[]).length>0?`
                    <span class="meta-label">Author:</span>
                    ${s.artists.map(E=>`<a href="#//" class="artist-link" data-artist="${E}">${E}</a>`).join(", ")}
                  `:""}
                  ${(s.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(s.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${s.categories.map(E=>`<span class="tag">${E}</span>`).join("")}
                  `:""}
                </div>
                `:""}
                <div class="manga-detail-actions">
                  <button class="btn btn-primary" id="continue-btn">
                    ▶ ${s.lastReadChapter?"Continue":"Start"} Reading
                  </button>
              <button class="btn btn-secondary" id="download-all-btn">
                ↓ Download All
              </button>
              <button class="btn btn-secondary" id="refresh-btn">🔄 Refresh</button>
              ${s.website!=="Local"?'<button class="btn btn-secondary" id="quick-check-btn">⚡ Quick Check</button>':""}
              ${s.website==="Local"?'<button class="btn btn-secondary" id="scan-folder-btn">📁 Scan Folder</button>':""}
              <button class="btn btn-secondary " id="auto-offline-btn" title="Auto-save new chapters offline for reading without internet">
                📴 Auto-Offline
              </button>
              <button class="btn btn-secondary" id="edit-btn">✏️ Edit</button>
              ${(s.volumes||[]).length===0?'<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>':""}
              ${Ha(s)}
            </div>
            ${s.description?`<p class="manga-description">${s.description}</p>`:""}
            ${b.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">📦 CBZ Files (${b.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${b.cbzFiles.map(E=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${E.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${E.chapterNumber?`Chapter ${E.chapterNumber}`:"Unknown chapter"}
                        ${E.isExtracted?" | ✅ Extracted":""}
                      </div>
                    </div>
                    <button class="btn btn-small ${E.isExtracted?"btn-secondary":"btn-primary"}" 
                            data-cbz-path="${encodeURIComponent(E.path)}" 
                            data-cbz-chapter="${E.chapterNumber||1}"
                            data-cbz-extracted="${E.isExtracted}">
                      ${E.isExtracted?"Re-Extract":"Extract"}
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
        
        ${b.activeVolume?b.manageChapters?Ka(s,p):"":Ya(s,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${b.filter==="all"?"active":""}" data-filter="all">
                All (${g.size})
              </button>
              <button class="filter-btn ${b.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${M})
              </button>
              <button class="filter-btn ${b.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${b.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${h>1?Mt(h):""}
          
          <div class="chapter-list">
            ${B.map(([f,E])=>Ga(f,E,a,n,s)).join("")}
          </div>
          
          ${h>1?Mt(h):""}
        </div>
      ${Wa()}
    </div>
  `}function ja(){const s=b.manga;return s?`
    <div class="modal" id="delete-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 420px;">
        <div class="modal-header">
          <h2>🗑️ Delete Manga</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>${s.alias||s.title}</strong> from your library?</p>
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
  `:""}function Qa(){const s=b.manga;return s?`
    <div class="modal" id="migrate-source-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
          <h2>🔄 Change Source</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Current source: <strong>${s.website||"Local"}</strong></p>
          <p class="text-muted" style="font-size: 0.85em; margin-bottom: 12px;">Search for the manga on a different source, or paste a URL directly.</p>
          
          <!-- Search Section -->
          <div class="form-group">
            <label>Search for Manga</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="migrate-search-input" placeholder="Search manga title..." value="${s.alias||s.title}" style="flex: 1;">
              <select id="migrate-search-scraper" style="width: 150px;">
                <option value="comix.to">comix.to</option>
              </select>
              <button class="btn btn-secondary" id="migrate-search-btn">🔍 Search</button>
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
          <p class="text-muted" style="font-size: 0.8em;">Current URL: <a href="${s.url}" target="_blank" rel="noopener noreferrer" style="word-break:break-all; color: var(--primary-color, #a78bfa); text-decoration: underline;">${s.url}</a></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-migrate-btn">Migrate Source</button>
        </div>
      </div>
    </div>
  `:""}function Wa(){var e,t;const s=b.manga;return`
    ${s?za(s):""}
    ${hn()}
    ${ja()}
    ${Qa()}

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
            <input type="text" id="edit-alias-input" placeholder="Custom display name..." value="${(s==null?void 0:s.alias)||""}">
          </div>
          <div class="form-group">
            <label for="edit-artist-input">Author/Artist</label>
            <input type="text" id="edit-artist-input" list="artist-list" placeholder="Author or artist name..." value="${((e=s==null?void 0:s.artists)==null?void 0:e.join(", "))||""}">
          </div>
          <div class="form-group">
            <label for="edit-categories-input">Tags/Categories (comma separated)</label>
            <input type="text" id="edit-categories-input" list="category-list" placeholder="tag1, tag2, tag3..." value="${((t=s==null?void 0:s.categories)==null?void 0:t.join(", "))||""}">
          </div>
          <div class="form-group">
            <label>Cover Image</label>
            <div id="cover-preview" style="width: 100px; height: 150px; background: var(--bg-secondary); border-radius: 4px; margin-bottom: 8px; overflow: hidden;">
              ${s!=null&&s.localCover?`<img src="/api/public/covers/${s.id}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}" style="width: 100%; height: 100%; object-fit: cover;">`:""}
            </div>
            <button type="button" class="btn btn-small btn-secondary" id="change-cover-btn">Change Cover</button>
          </div>
          <p class="text-muted" style="font-size: 0.8em;">Original title: ${(s==null?void 0:s.title)||""}</p>
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
  `}function Ga(s,e,t,a,n){var q,C,f,E;const i=t.has(s),o=a.has(s),c=!Number.isInteger(s),l=((q=n.downloadedVersions)==null?void 0:q[s])||[],u=new Set(n.deletedChapterUrls||[]),p=e.filter(R=>b.filter==="hidden"?!0:!u.has(R.url)),v=!!b.activeVolume;let g=p;v&&(g=p.filter(R=>Array.isArray(l)?l.includes(R.url):l===R.url)),g.sort((R,m)=>{const k=Array.isArray(l)?l.includes(R.url):l===R.url;return((Array.isArray(l)?l.includes(m.url):l===m.url)?1:0)-(k?1:0)});const w=g.length>1,h=(C=g[0])!=null&&C.url?encodeURIComponent(g[0].url):null,$=n.chapterSettings||{},I=v?!0:(f=$[s])==null?void 0:f.locked,B=["chapter-item",i?"downloaded":"",o?"read":"",c?"extra":""].filter(Boolean).join(" "),A=w?`
    <div class="versions-dropdown hidden" id="versions-${s}">
      ${g.map(R=>{const m=encodeURIComponent(R.url),k=Array.isArray(l)?l.includes(R.url):l===R.url,S=R.url.startsWith("local://");return`
          <div class="version-row ${k?"downloaded":""}"
               data-version-url="${m}" data-num="${s}">
            <span class="version-title" style="cursor: pointer; flex: 1;">${R.title||R.releaseGroup||"Version"}${S?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}</span>
            <div class="version-actions">
              ${k?`<button class="btn-icon small success" data-action="read-version" data-num="${s}" data-url="${m}">▶</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${s}" data-url="${m}">🗑️</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${s}" data-url="${m}">↓</button>`}
              ${u.has(R.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${s}" data-url="${m}" title="Restore Version">↩️</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${s}" data-url="${m}" title="Hide Version">👁️‍🗨️</button>`}
            </div>
          </div>
        `}).join("")}
    </div>
  `:"",M=(n.excludedChapters||[]).includes(s);return`
    <div class="chapter-group" data-chapter="${s}">
      <div class="${B}" data-num="${s}" style="${M?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${s}</span>
        <span class="chapter-title">
          ${g[0]?g[0].title!==`Chapter ${s}`?g[0].title:"":e[0].title}
          ${M?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
        </span>
        ${c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${M?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${s}" title="Restore Chapter">↩️</button>`:v?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${b.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${s}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${I?"locked":""}"
                        data-action="lock" data-num="${s}"
                        title="${I?"Unlock":"Lock"}">
                  ${I?"🔒":"🔓"}
                </button>`}
          ${!M&&h?u.has((E=g[0])==null?void 0:E.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${s}" data-url="${h}" title="Unhide Chapter">↩️</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${s}" data-url="${h}" title="Hide Chapter">👁️‍🗨️</button>`:""}
          <button class="btn-icon small ${o?"success":"muted"}"
                  data-action="read" data-num="${s}"
                  title="${o?"Mark unread":"Mark read"}">
            ${o?"👁️":"○"}
          </button>
          ${i?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${s}" data-url="${h}" title="Delete Files">🗑️</button>
         <button class="btn-icon small ${b.offlineChapters.has(s)?"success":""}" data-action="offline-save" data-num="${s}" title="${b.offlineChapters.has(s)?"Remove offline copy":"Save for offline reading"}">
           ${b.offlineChapters.has(s)?"📴":"💾"}
         </button>`:`<button class="btn-icon small ${i?"success":""}"
              data-action="download" data-num="${s}"
              title="${i?"Downloaded":"Download"}">
          ${i?"✓":"↓"}
        </button>`}
          ${w?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${s}">
              ${p.length} ▼
            </button>
          `:""}
        </div>
      </div>
      ${A}
    </div>
  `}function Mt(s){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${b.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${b.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${b.currentPage+1} of ${s}</span>
      <button class="btn btn-icon" data-page="next" ${b.currentPage>=s-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${b.currentPage>=s-1?"disabled":""}>»</button>
    </div>
  `}function Ka(s,e){return e.length===0?`
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
  `}function Ya(s,e){var n;const t=s.volumes||[];return t.length===0?"":`
    <div class="volumes-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="margin: 0;">Volumes</h2>
        <button class="btn btn-secondary btn-small" id="add-volume-btn">+ Add Volume</button>
      </div>
      <div class="volumes-grid">
        ${t.map(i=>{const o=i.chapters||[],c=o.filter(l=>e.has(l)).length;return`
      <div class="volume-card" data-volume-id="${i.id}">
        <div class="volume-cover">
          ${i.cover?`<img src="${i.cover}" alt="${i.name}">`:'<div class="placeholder">📚</div>'}
          <div class="volume-badges">
            <span class="badge badge-chapters">${o.length} ch</span>
            ${c>0?`<span class="badge badge-downloaded">${c}</span>`:""}
          </div>
        </div>
        <div class="volume-info">
          <div class="volume-name">${i.name}</div>
        </div>
      </div>
    `}).join("")||(((n=s.chapters)==null?void 0:n.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function Ja(){var a,n,i,o,c,l,u,p,v,g,w,h,$,I,B,A,M,q,C,f,E,R;const s=document.getElementById("app"),e=b.manga;if(!e)return;(a=document.getElementById("back-btn"))==null||a.addEventListener("click",()=>T.go("/")),(n=document.getElementById("back-library-btn"))==null||n.addEventListener("click",()=>T.go("/")),s.querySelectorAll(".artist-link").forEach(m=>{m.addEventListener("click",k=>{k.preventDefault();const S=m.dataset.artist;S&&(localStorage.setItem("library_artist_filter",S),localStorage.removeItem("library_search"),T.go("/"))})}),(i=document.getElementById("continue-btn"))==null||i.addEventListener("click",()=>{ls(e.id)}),(o=document.getElementById("download-all-btn"))==null||o.addEventListener("click",()=>{const m=document.getElementById("download-all-modal");m&&m.classList.add("open")}),(c=document.getElementById("confirm-download-all-btn"))==null||c.addEventListener("click",async()=>{var m;try{d("Queueing downloads...","info");const k=document.getElementsByName("download-version-mode");let S="single";for(const P of k)P.checked&&(S=P.value);(m=document.getElementById("download-all-modal"))==null||m.classList.remove("open");const L=await y.post(`/bookmarks/${e.id}/download`,{all:!0,versionMode:S});L.chaptersCount>0?d(`Download queued: ${L.chaptersCount} versions`,"success"):d("Already have these chapters downloaded","info")}catch(k){d("Failed to download: "+k.message,"error")}}),(l=document.getElementById("check-updates-btn"))==null||l.addEventListener("click",async()=>{try{d("Checking for updates...","info"),await y.post(`/bookmarks/${e.id}/quick-check`),d("Check complete!","success")}catch(m){d("Check failed: "+m.message,"error")}}),(u=document.getElementById("schedule-btn"))==null||u.addEventListener("click",()=>{const m=document.getElementById("schedule-modal");m&&m.classList.add("open")}),(p=document.getElementById("schedule-type"))==null||p.addEventListener("change",m=>{const k=document.getElementById("schedule-day-group");k&&(k.style.display=m.target.value==="weekly"?"":"none")}),(v=document.getElementById("save-schedule-btn"))==null||v.addEventListener("click",async()=>{var m;try{const k=document.getElementById("schedule-type").value,S=document.getElementById("schedule-day").value,L=document.getElementById("schedule-time").value,P=document.getElementById("auto-download-toggle").checked;await y.updateAutoCheckSchedule(e.id,{enabled:!0,schedule:k,day:S,time:L,autoDownload:P}),b.manga.checkSchedule=k,b.manga.checkDay=S,b.manga.checkTime=L,b.manga.autoDownload=P,(m=document.getElementById("schedule-modal"))==null||m.classList.remove("open"),V([e.id]),d("Schedule updated","success")}catch(k){d("Failed to save schedule: "+k.message,"error")}}),(g=document.getElementById("disable-schedule-btn"))==null||g.addEventListener("click",async()=>{var m;try{await y.toggleAutoCheck(e.id,!1),b.manga.autoCheck=!1,b.manga.checkSchedule=null,b.manga.checkDay=null,b.manga.checkTime=null,b.manga.nextCheck=null,(m=document.getElementById("schedule-modal"))==null||m.classList.remove("open"),V([e.id]),d("Auto-check disabled","success")}catch(k){d("Failed to disable: "+k.message,"error")}}),(w=document.getElementById("refresh-btn"))==null||w.addEventListener("click",async()=>{const m=document.getElementById("refresh-btn");try{m.disabled=!0,m.textContent="⏳ Checking...",d("Checking for updates...","info"),await y.post(`/bookmarks/${e.id}/check`),await G(e.id),V([e.id]),d("Check complete!","success")}catch(k){d("Check failed: "+k.message,"error"),m&&(m.disabled=!1,m.textContent="🔄 Refresh")}}),(h=document.getElementById("scan-folder-btn"))==null||h.addEventListener("click",async()=>{var k,S;const m=document.getElementById("scan-folder-btn");try{m.disabled=!0,m.textContent="⏳ Scanning...",d("Scanning folder...","info");const L=await y.scanBookmark(e.id);await G(e.id),V([e.id]);const P=((k=L.addedChapters)==null?void 0:k.length)||0,O=((S=L.removedChapters)==null?void 0:S.length)||0;P>0||O>0?d(`Scan complete: ${P} added, ${O} removed`,"success"):d("Scan complete: No changes","info")}catch(L){d("Scan failed: "+L.message,"error")}finally{m&&(m.disabled=!1,m.textContent="📁 Scan Folder")}}),document.querySelectorAll("[data-cbz-path]").forEach(m=>{m.addEventListener("click",async()=>{const k=decodeURIComponent(m.dataset.cbzPath),S=parseInt(m.dataset.cbzChapter)||1,L=m.dataset.cbzExtracted==="true",P=prompt("Enter chapter number for extraction:",String(S));if(!P)return;const O=parseFloat(P);if(isNaN(O)){d("Invalid chapter number","error");return}try{m.disabled=!0,m.textContent="Extracting...",d("Extracting CBZ...","info"),await y.extractCbz(e.id,k,O,{forceReExtract:L}),d("CBZ extracted successfully!","success"),await G(e.id),V([e.id])}catch(z){d("Extract failed: "+z.message,"error")}finally{m.disabled=!1,m.textContent=L?"Re-Extract":"Extract"}})}),($=document.getElementById("edit-btn"))==null||$.addEventListener("click",async()=>{const m=document.getElementById("edit-manga-modal");if(m){document.getElementById("edit-alias-input").value=e.alias||"",window._selectedCoverPath=null;try{const[k,S]=await Promise.all([y.getAllArtists(),y.getAllCategories()]),L=document.getElementById("artist-list"),P=document.getElementById("category-list");window._allArtists=k,window._allCategories=S,L&&(L.innerHTML=k.map(_=>`<option value="${_}">`).join("")),P&&(P.innerHTML=S.map(_=>`<option value="${_}">`).join(""));const O=document.getElementById("edit-artist-input"),z=document.getElementById("edit-categories-input");O==null||O.addEventListener("input",()=>{const _=O.value.toLowerCase(),D=O.value.lastIndexOf(","),H=O.value.substring(D+1).trim().toLowerCase();if(H.length>0&&window._allArtists){const U=window._allArtists.filter(X=>X.toLowerCase().includes(H));if(L&&U.length>0){const X=D>=0?O.value.substring(0,D+1)+" ":"";L.innerHTML=U.map(me=>`<option value="${X}${me}">`).join("")}}}),z==null||z.addEventListener("input",()=>{const _=z.value.lastIndexOf(","),D=z.value.substring(_+1).trim().toLowerCase();if(D.length>0&&window._allCategories){const H=window._allCategories.filter(U=>U.toLowerCase().includes(D));if(P&&H.length>0){const U=_>=0?z.value.substring(0,_+1)+" ":"";P.innerHTML=H.map(X=>`<option value="${U}${X}">`).join("")}}})}catch(k){console.error("Failed to load artists/categories:",k)}m.classList.add("open")}}),(I=document.getElementById("save-manga-btn"))==null||I.addEventListener("click",async()=>{var m;try{const k=document.getElementById("edit-alias-input").value.trim(),S=document.getElementById("edit-artist-input").value.trim(),L=document.getElementById("edit-categories-input").value.trim(),P=S?S.split(",").map(z=>z.trim()).filter(z=>z):[],O=L?L.split(",").map(z=>z.trim()).filter(z=>z):[];await y.updateBookmark(e.id,{alias:k||null}),await y.setBookmarkArtists(e.id,P),await y.setBookmarkCategories(e.id,O),window._selectedCoverPath&&await y.setBookmarkCoverFromImage(e.id,window._selectedCoverPath),b.manga.alias=k||null,b.manga.artists=P,b.manga.categories=O,(m=document.getElementById("edit-manga-modal"))==null||m.classList.remove("open"),V([e.id]),d("Manga updated","success")}catch(k){d("Failed to update: "+k.message,"error")}}),(B=document.getElementById("change-cover-btn"))==null||B.addEventListener("click",async()=>{try{d("Loading images...","info");const m=await y.getFolderImages(e.id);if(m.length===0){d("No images found in manga folder","warning");return}const k=document.createElement("div");k.id="cover-select-modal",k.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",k.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${m.slice(0,50).map(S=>`
              <div class="cover-option" data-path="${S.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(S.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${m.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${m.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(k),document.getElementById("close-cover-modal").addEventListener("click",()=>k.remove()),k.addEventListener("click",S=>{S.target===k&&k.remove()}),k.querySelectorAll(".cover-option").forEach(S=>{S.addEventListener("click",()=>{window._selectedCoverPath=S.dataset.path;const L=document.getElementById("cover-preview");L&&(L.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),k.remove(),d("Cover selected","success")})})}catch(m){d("Failed to load images: "+m.message,"error")}}),(A=document.getElementById("delete-manga-btn"))==null||A.addEventListener("click",()=>{const m=document.getElementById("delete-manga-modal");m&&m.classList.add("open")}),(M=document.getElementById("confirm-delete-manga-btn"))==null||M.addEventListener("click",async()=>{var k,S;const m=((k=document.getElementById("delete-files-toggle"))==null?void 0:k.checked)||!1;try{await y.deleteBookmark(e.id,m),(S=document.getElementById("delete-manga-modal"))==null||S.classList.remove("open"),d("Manga deleted","success"),T.go("/")}catch(L){d("Failed to delete: "+L.message,"error")}}),(q=document.getElementById("quick-check-btn"))==null||q.addEventListener("click",async()=>{const m=document.getElementById("quick-check-btn");try{m.disabled=!0,m.textContent="⏳ Checking...",d("Quick checking for updates...","info");const k=await y.post(`/bookmarks/${e.id}/quick-check`);await G(e.id),V([e.id]),k.newChaptersCount>0?d(`Found ${k.newChaptersCount} new chapter(s)!`,"success"):d("No new chapters found","info")}catch(k){d("Quick check failed: "+k.message,"error")}finally{m&&(m.disabled=!1,m.textContent="⚡ Quick Check")}}),(C=document.getElementById("source-label"))==null||C.addEventListener("click",async()=>{const m=document.getElementById("migrate-source-modal");if(m){m.classList.add("open");const k=document.getElementById("migrate-search-scraper");if(k&&k.options.length<=1)try{const S=await y.get("/scrapers/list");if(S.success){const L=S.scrapers.filter(P=>P.supportsSearch);k.innerHTML='<option value="all">All Sources</option>'+L.map(P=>`<option value="${P.name}">${P.name}</option>`).join(""),k.value="all"}}catch(S){console.warn("Failed to load scrapers:",S)}}});const t=async()=>{var O,z,_;const m=(z=(O=document.getElementById("migrate-search-input"))==null?void 0:O.value)==null?void 0:z.trim(),k=(_=document.getElementById("migrate-search-scraper"))==null?void 0:_.value;if(!m)return;const S=document.getElementById("migrate-search-loading"),L=document.getElementById("migrate-search-results"),P=document.getElementById("migrate-results-grid");S.style.display="block",L.style.display="none";try{const H=(await y.get(`/scrapers/search?q=${encodeURIComponent(m)}&scraper=${encodeURIComponent(k)}`)).results||[];H.length===0?P.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(P.innerHTML=H.map(U=>{var me;const X=(me=U.cover)!=null&&me.startsWith("/covers/")?U.cover:U.cover?`/api/scrapers/proxy-cover?url=${encodeURIComponent(U.cover)}`:"";return`
            <div class="manga-card migrate-result-card" data-url="${U.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${X?`<img src="${X}" alt="Cover" loading="lazy" onerror="this.outerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>'}
                ${U.chapterCount?`<div class="manga-card-badges"><span class="badge badge-chapters">${U.chapterCount} ch</span></div>`:""}
              </div>
              <div class="manga-card-title" title="${U.title}" style="font-size: 0.8rem; padding: 4px;">${U.title}</div>
            </div>
          `}).join(""),P.querySelectorAll(".migrate-result-card").forEach(U=>{U.addEventListener("click",()=>{var me;const X=U.dataset.url;document.getElementById("migrate-url-input").value=X,P.querySelectorAll(".migrate-result-card").forEach(ps=>ps.style.outline=""),U.style.outline="2px solid var(--color-primary)",d(`Selected: ${(me=U.querySelector(".manga-card-title"))==null?void 0:me.textContent}`,"info")})})),S.style.display="none",L.style.display="block"}catch(D){S.style.display="none",d("Search failed: "+D.message,"error")}};(f=document.getElementById("migrate-search-btn"))==null||f.addEventListener("click",t),(E=document.getElementById("migrate-search-input"))==null||E.addEventListener("keydown",m=>{m.key==="Enter"&&t()}),(R=document.getElementById("confirm-migrate-btn"))==null||R.addEventListener("click",async()=>{var S,L,P;const m=(L=(S=document.getElementById("migrate-url-input"))==null?void 0:S.value)==null?void 0:L.trim();if(!m){d("Please enter a URL","warning");return}const k=document.getElementById("confirm-migrate-btn");try{k.disabled=!0,k.textContent="Migrating...",d("Migrating source...","info");const O=await y.migrateSource(e.id,m);d(`Migrated! ${O.migratedChapters} chapters preserved as local`,"success"),d("Running full check on new source...","info"),await y.post(`/bookmarks/${e.id}/check`),(P=document.getElementById("migrate-source-modal"))==null||P.classList.remove("open"),await G(e.id),V([e.id]),d("Source migration complete!","success")}catch(O){d("Migration failed: "+O.message,"error")}finally{k&&(k.disabled=!1,k.textContent="Migrate Source")}}),s.querySelectorAll(".filter-btn").forEach(m=>{m.addEventListener("click",()=>{b.filter=m.dataset.filter,b.currentPage=0,V([e.id])})}),s.querySelectorAll("[data-page]").forEach(m=>{m.addEventListener("click",()=>{const k=m.dataset.page,S=Math.ceil(b.manga.chapters.length/Le);switch(k){case"first":b.currentPage=0;break;case"prev":b.currentPage=Math.max(0,b.currentPage-1);break;case"next":b.currentPage=Math.min(S-1,b.currentPage+1);break;case"last":b.currentPage=S-1;break}V([e.id])})}),s.querySelectorAll(".chapter-item").forEach(m=>{m.addEventListener("click",k=>{var P;if(k.target.closest(".chapter-actions"))return;const S=parseFloat(m.dataset.num);if((e.downloadedChapters||[]).includes(S)){const O=((P=e.downloadedVersions)==null?void 0:P[S])||[],z=Array.isArray(O)?O[0]:O;z?T.go(`/read/${e.id}/${S}?version=${encodeURIComponent(z)}`):T.go(`/read/${e.id}/${S}`)}else d("Chapter not downloaded","info")})}),s.querySelectorAll("[data-action]").forEach(m=>{m.addEventListener("click",async k=>{k.stopPropagation();const S=m.dataset.action,L=parseFloat(m.dataset.num),P=m.dataset.url?decodeURIComponent(m.dataset.url):null;switch(S){case"lock":await Xa(L);break;case"read":await Za(L);break;case"download":await en(L);break;case"versions":tn(L);break;case"read-version":T.go(`/read/${e.id}/${L}?version=${encodeURIComponent(P)}`);break;case"download-version":await sn(L,P);break;case"delete-version":await an(L,P);break;case"hide-version":await nn(L,P);break;case"restore-version":await rn(L,P);break;case"restore-chapter":await on(L);break;case"delete-chapter":await ln(L,P);break;case"hide-chapter":await cn(L,P);break;case"unhide-chapter":await dn(L,P);break}})}),s.querySelectorAll(".version-row .version-title").forEach(m=>{m.addEventListener("click",k=>{k.stopPropagation();const S=m.closest(".version-row"),L=parseFloat(S.dataset.num),P=S.dataset.versionUrl?decodeURIComponent(S.dataset.versionUrl):null;S.classList.contains("downloaded")&&P?T.go(`/read/${e.id}/${L}?version=${encodeURIComponent(P)}`):d("Version not downloaded yet","info")})}),s.querySelectorAll(".volume-card").forEach(m=>{m.addEventListener("click",()=>{const k=m.dataset.volumeId;T.go(`/manga/${e.id}/volume/${k}`)})}),mn(s),pe(),j.subscribeToManga(e.id)}async function Xa(s){var n;const e=b.manga,t=((n=e.chapterSettings)==null?void 0:n[s])||{},a=!t.locked;try{a?await y.lockChapter(e.id,s):await y.unlockChapter(e.id,s),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[s]={...t,locked:a},d(a?"Chapter locked":"Chapter unlocked","success"),V([e.id])}catch(i){d("Failed: "+i.message,"error")}}async function Za(s){const e=b.manga,t=new Set(e.readChapters||[]),a=t.has(s);try{await y.post(`/bookmarks/${e.id}/chapters/${s}/read`,{read:!a}),a?t.delete(s):t.add(s),e.readChapters=[...t],d(a?"Marked unread":"Marked read","success"),V([e.id])}catch(n){d("Failed: "+n.message,"error")}}async function en(s){const e=b.manga,t=new Set(e.deletedChapterUrls||[]),a=(e.chapters||[]).find(n=>n.number===s&&!t.has(n.url));try{d(`Downloading chapter ${s}...`,"info"),a?await y.post(`/bookmarks/${e.id}/download-version`,{chapterNumber:s,url:a.url}):await y.post(`/bookmarks/${e.id}/download`,{chapters:[s]}),d("Download queued!","success")}catch(n){d("Failed: "+n.message,"error")}}function tn(s){document.querySelectorAll(".versions-dropdown").forEach(t=>{t.id!==`versions-${s}`&&t.classList.add("hidden")});const e=document.getElementById(`versions-${s}`);e&&e.classList.toggle("hidden")}async function sn(s,e){const t=b.manga;try{d("Downloading version...","info"),await y.post(`/bookmarks/${t.id}/download-version`,{chapterNumber:s,url:e}),d("Download queued!","success")}catch(a){d("Failed: "+a.message,"error")}}async function an(s,e){const t=b.manga;try{await y.request(`/bookmarks/${t.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:s,url:e})}),d("Version deleted","success"),await G(t.id),V([t.id])}catch(a){d("Failed: "+a.message,"error")}}async function nn(s,e){const t=b.manga;try{await y.hideVersion(t.id,s,e),d("Version hidden","success"),await G(t.id),V([t.id])}catch(a){d("Failed: "+a.message,"error")}}async function rn(s,e){const t=b.manga;try{await y.unhideVersion(t.id,s,e),d("Version restored","success"),await G(t.id),V([t.id])}catch(a){d("Failed to restore version: "+a.message,"error")}}async function on(s){const e=b.manga;try{await y.unexcludeChapter(e.id,s),d("Chapter restored","success"),await G(e.id),V([e.id])}catch(t){d("Failed to restore chapter: "+t.message,"error")}}async function ln(s,e){const t=b.manga;if(confirm("Delete this chapter's files from disk?"))try{await y.request(`/bookmarks/${t.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:s,url:e})}),d("Chapter files deleted","success"),await G(t.id),V([t.id])}catch(a){d("Failed to delete: "+a.message,"error")}}async function cn(s,e){const t=b.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await y.hideVersion(t.id,s,e),d("Chapter hidden","success"),await G(t.id),V([t.id])}catch(a){d("Failed to hide chapter: "+a.message,"error")}}async function dn(s,e){const t=b.manga;try{await y.unhideVersion(t.id,s,e),d("Chapter unhidden","success"),await G(t.id),V([t.id])}catch(a){d("Failed to unhide chapter: "+a.message,"error")}}async function G(s){try{const[e,t]=await Promise.all([y.getBookmark(s),ie.loadCategories()]);if(b.manga=e,b.categories=t,b.loading=!1,e.website==="Local")try{const i=await y.getCbzFiles(s);b.cbzFiles=i||[]}catch(i){console.error("Failed to load CBZ files:",i),b.cbzFiles=[]}else b.cbzFiles=[];const a=new Set((e.chapters||[]).map(i=>i.number)).size,n=Math.ceil(a/Le);b.currentPage=Math.max(0,n-1),b.activeVolumeId?b.activeVolume=(e.volumes||[]).find(i=>i.id===b.activeVolumeId):b.activeVolume=null}catch{d("Failed to load manga","error"),b.loading=!1}}async function V(s=[]){const[e,t,a]=s;if(!e){T.go("/");return}b.activeVolumeId=t==="volume"?a:null;const n=document.getElementById("app");!b.manga||b.manga.id!==e?(b.loading=!0,b.manga=null,n.innerHTML=mt(),await G(e)):b.activeVolumeId?b.activeVolume=(b.manga.volumes||[]).find(i=>i.id===b.activeVolumeId):b.activeVolume=null,n.innerHTML=mt(),Ja()}function un(){b.manga&&j.unsubscribeFromManga(b.manga.id),b.manga=null,b.loading=!0}const pn={mount:V,unmount:un,render:mt};function hn(){return`
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
  `}function mn(s){const e=b.manga;if(!e)return;const t=s.querySelector("#add-volume-btn"),a=s.querySelector("#add-volume-modal"),n=s.querySelector("#add-volume-submit-btn");t&&a&&t.addEventListener("click",()=>{a.classList.add("open"),s.querySelector("#add-volume-name-input").focus()}),a==null||a.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(h=>{h.addEventListener("click",()=>a.classList.remove("open"))}),n&&n.addEventListener("click",async()=>{const h=s.querySelector("#add-volume-name-input").value.trim();if(!h)return d("Please enter a volume name","error");try{n.disabled=!0,n.textContent="Creating...",await y.createVolume(e.id,h),d("Volume created successfully!","success"),a.classList.remove("open"),s.querySelector("#add-volume-name-input").value="",await G(e.id),V([e.id])}catch($){d("Failed to create volume: "+$.message,"error")}finally{n.disabled=!1,n.textContent="Create Volume"}});const i=s.querySelector("#manage-chapters-btn");i&&i.addEventListener("click",()=>{b.manageChapters=!b.manageChapters,V([e.id,"volume",b.activeVolumeId])}),s.querySelectorAll(".add-to-vol-btn").forEach(h=>{h.addEventListener("click",async()=>{const $=parseFloat(h.dataset.num),I=b.activeVolume;if(I)try{h.disabled=!0,h.textContent="...";const B=I.chapters||[];if(B.includes($))return;const A=[...B,$].sort((M,q)=>M-q);await y.updateVolumeChapters(e.id,I.id,A),d(`Chapter ${$} added to volume`,"success"),await G(e.id),V([e.id,"volume",I.id])}catch(B){d("Failed to add chapter: "+B.message,"error"),h.disabled=!1,h.textContent="Add"}})}),s.querySelectorAll(".remove-from-vol-btn").forEach(h=>{h.addEventListener("click",async $=>{$.stopPropagation();const I=parseFloat(h.dataset.num),B=b.activeVolume;if(B)try{h.disabled=!0,h.textContent="...";const M=(B.chapters||[]).filter(q=>q!==I);await y.updateVolumeChapters(e.id,B.id,M),d(`Chapter ${I} removed from volume`,"success"),await G(e.id),V([e.id,"volume",B.id])}catch(A){d("Failed to remove chapter: "+A.message,"error"),h.disabled=!1,h.textContent="×"}})});const o=s.querySelector("#edit-vol-btn"),c=s.querySelector("#edit-volume-modal");o&&c&&o.addEventListener("click",()=>{const h=o.dataset.volId,$=e.volumes.find(I=>I.id===h);$&&(s.querySelector("#volume-name-input").value=$.name,c.dataset.editingVolId=h,c.classList.add("open"))});const l=s.querySelector("#save-volume-btn");l&&l.addEventListener("click",async()=>{const h=c.dataset.editingVolId,$=s.querySelector("#volume-name-input").value.trim();if(!$)return d("Volume name cannot be empty","error");try{await y.renameVolume(e.id,h,$),d("Volume renamed","success"),c.classList.remove("open"),await G(e.id),V([e.id,"volume",h])}catch(I){d(I.message,"error")}});const u=s.querySelector("#delete-volume-btn");u&&u.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const h=c.dataset.editingVolId;try{await y.deleteVolume(e.id,h),d("Volume deleted","success"),c.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch($){d($.message,"error")}});const p=s.querySelector("#vol-cover-upload-btn");if(p){let h=document.getElementById("vol-cover-input-hidden");h||(h=document.createElement("input"),h.type="file",h.id="vol-cover-input-hidden",h.accept="image/*",h.style.display="none",document.body.appendChild(h),h.addEventListener("change",async $=>{const I=$.target.files[0];if(!I)return;const B=h.dataset.mangaId,A=h.dataset.volId,M=document.getElementById("vol-cover-upload-btn");if(h.value="",!(!B||!A))try{M&&(M.disabled=!0,M.textContent="Uploading..."),await y.uploadVolumeCover(B,A,I),d("Cover uploaded","success"),await G(B),V([B,"volume",A])}catch(q){d("Upload failed: "+q.message,"error")}finally{M&&(M.disabled=!1,M.innerHTML="📤 Upload Image")}})),p.addEventListener("click",()=>{h.dataset.mangaId=e.id,h.dataset.volId=c.dataset.editingVolId||"",h.click()})}const v=s.querySelector("#vol-cover-selector-btn"),g=s.querySelector("#cover-selector-modal");v&&g&&v.addEventListener("click",async()=>{const h=g.querySelector("#cover-chapter-select");h.innerHTML='<option value="">Select a chapter...</option>';const $=s.querySelector("#edit-volume-modal"),I=$?$.dataset.editingVolId:null;let B=[...e.chapters||[]];if(I){const M=e.volumes.find(q=>q.id===I);if(M&&M.chapters){const q=new Set(M.chapters);B=B.filter(C=>q.has(C.number))}}B.sort((M,q)=>M.number-q.number);const A=new Set;B.forEach(M=>{if(!A.has(M.number)){A.add(M.number);const q=document.createElement("option");q.value=M.number,q.textContent=`Chapter ${M.number}`,h.appendChild(q)}}),B.length>0&&(h.value=B[0].number,Rt(e.id,B[0].number)),g.classList.add("open")});const w=s.querySelector("#cover-chapter-select");w&&w.addEventListener("change",h=>{h.target.value&&Rt(e.id,h.target.value)}),s.querySelectorAll(".modal-close, .modal-close-btn").forEach(h=>{h.addEventListener("click",()=>{h.closest(".modal").classList.remove("open")})}),s.querySelectorAll(".modal-overlay").forEach(h=>{h.addEventListener("click",()=>{h.closest(".modal").classList.remove("open")})})}async function Rt(s,e){const t=document.getElementById("cover-images-grid");if(t){t.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await y.getChapterImages(s,e)).images||[];if(t.innerHTML="",n.length===0){t.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(i=>{const o=document.createElement("div");o.className="cover-grid-item",o.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",o.innerHTML=`<img src="${i}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,o.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=i.split("/").pop();gn(l,e,c)}),t.appendChild(o)})}catch(a){t.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function gn(s,e,t){const a=b.manga,n=document.getElementById("edit-volume-modal"),i=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${t} cover?`))try{if(t==="volume"){const o=n.dataset.editingVolId;if(!o)throw new Error("No volume selected");await y.setVolumeCoverFromChapter(a.id,o,e,s),d("Volume cover updated","success"),i.classList.remove("open"),n.classList.remove("open"),await G(a.id),V([a.id,"volume",o])}else{await y.setMangaCoverFromChapter(a.id,e,s),d("Series cover updated","success"),i.classList.remove("open"),await G(a.id);const o=window.location.hash.replace("#","");b.activeVolumeId?V([a.id,"volume",b.activeVolumeId]):V([a.id])}}catch(o){d("Failed to set cover: "+o.message,"error")}}let ne={series:null,loading:!0};function we(){if(ne.loading)return`
      ${te("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const s=ne.series;if(!s)return`
      ${te("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=s.alias||s.title,t=s.entries||[],a=t.reduce((i,o)=>i+(o.chapter_count||0),0);let n=null;if(t.length>0){const i=t[0];i.local_cover&&i.bookmark_id?n=`/api/public/covers/${i.bookmark_id}/${encodeURIComponent(i.local_cover.split(/[/\\]/).pop())}`:i.localCover&&i.bookmark_id?n=`/api/public/covers/${i.bookmark_id}/${encodeURIComponent(i.localCover.split(/[/\\]/).pop())}`:i.cover&&(n=i.cover)}return`
    ${te("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?`<img src="${n}" alt="${e}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>'}
          </div>
          <div class="series-detail-info">
            <h1>${e}</h1>
            <div class="series-detail-meta">
              <span class="meta-item">${t.length} Entries</span>
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
            ${t.map((i,o)=>fn(i,o,t.length)).join("")}
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
  `}function fn(s,e,t){var i;const a=s.alias||s.title;let n=null;return s.local_cover?n=`/api/public/covers/${s.bookmark_id}/${encodeURIComponent(s.local_cover.split(/[/\\]/).pop())}`:s.localCover?n=`/api/public/covers/${s.bookmark_id}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover&&(n=s.cover),`
    <div class="series-entry-card" data-id="${s.bookmark_id}" data-order="${s.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${e+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${s.bookmark_id}" ${e===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${s.bookmark_id}" ${e===t-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?`<img src="${n}" alt="${a}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:'<div class="placeholder">📚</div>'}
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${s.chapter_count||0} ch</span>
          ${((i=s.downloadedChapters)==null?void 0:i.length)>0?`<span class="badge badge-downloaded">${s.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${s.bookmark_id}" data-entryid="${s.id}" title="Use as series cover">🖼️</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${a}</div>
      </div>
    </div>
  `}function Ke(){var l,u,p;const s=document.getElementById("app"),e=ne.series;(l=document.getElementById("back-btn"))==null||l.addEventListener("click",()=>T.go("/")),(u=document.getElementById("back-library-btn"))==null||u.addEventListener("click",()=>T.go("/")),s.querySelectorAll(".series-entry-card").forEach(v=>{v.addEventListener("click",g=>{if(g.target.closest("[data-action]"))return;const w=v.dataset.id;T.go(`/manga/${w}`)})}),s.querySelectorAll("[data-action]").forEach(v=>{v.addEventListener("click",async g=>{g.stopPropagation();const w=v.dataset.action,h=v.dataset.id;switch(w){case"move-up":await Nt(h,-1);break;case"move-down":await Nt(h,1);break;case"set-cover":const $=v.dataset.entryid;await vn($);break}})});const t=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),i=document.getElementById("available-bookmarks-list"),o=document.getElementById("confirm-add-entry-btn");let c=[];t&&a&&(t.addEventListener("click",async()=>{try{t.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),i&&(i.innerHTML=""),a.classList.add("open");const v=await y.getAvailableBookmarksForSeries();c=v,v.length===0?(n&&(n.placeholder="No available manga found"),o.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),i&&(i.innerHTML=v.map(g=>`<option value="${(g.alias||g.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),o.disabled=!1)}catch{d("Failed to load available manga","error"),a.classList.remove("open")}finally{t.disabled=!1}}),o.addEventListener("click",async()=>{const v=n?n.value:"",g=c.find(h=>(h.alias||h.title||"")===v);if(!g){d("Please select a valid manga from the list","warning");return}const w=g.id;try{o.disabled=!0,o.textContent="Adding...",await y.addSeriesEntry(e.id,w),d("Manga added to series","success"),a.classList.remove("open"),await Ye(e.id),s.innerHTML=we(),Ke()}catch(h){d("Failed to add manga: "+h.message,"error")}finally{o.disabled=!1,o.textContent="Add to Series"}})),(p=document.getElementById("edit-series-btn"))==null||p.addEventListener("click",()=>{d("Edit series coming soon","info")})}async function Nt(s,e){const t=ne.series;if(!t)return;const a=t.entries||[],n=a.findIndex(c=>c.bookmark_id===s);if(n===-1)return;const i=n+e;if(i<0||i>=a.length)return;const o=a.map(c=>c.bookmark_id);[o[n],o[i]]=[o[i],o[n]];try{await y.post(`/series/${t.id}/reorder`,{order:o}),d("Order updated","success"),await Ye(t.id);const c=document.getElementById("app");c.innerHTML=we(),Ke()}catch(c){d("Failed to reorder: "+c.message,"error")}}async function vn(s){const e=ne.series;if(e)try{await y.setSeriesCover(e.id,s),d("Series cover updated","success"),await Ye(e.id);const t=document.getElementById("app");t.innerHTML=we(),Ke()}catch(t){d("Failed to set cover: "+t.message,"error")}}async function Ye(s){try{const e=await y.get(`/series/${s}`);ne.series=e,ne.loading=!1}catch{d("Failed to load series","error"),ne.loading=!1}}async function yn(s=[]){const[e]=s;if(!e){T.go("/");return}const t=document.getElementById("app");ne.loading=!0,ne.series=null,t.innerHTML=we(),await Ye(e),t.innerHTML=we(),Ke()}function bn(){ne.series=null,ne.loading=!0}const wn={mount:yn,unmount:bn,render:we},kn={mount:async s=>{const e=document.getElementById("app");e.innerHTML=`
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
        `;try{const t=await y.get("/settings")||{},a=document.getElementById("settings-form"),n=document.getElementById("settings-loader");t.theme&&(document.getElementById("theme").value=t.theme),n.style.display="none",a.style.display="block",a.addEventListener("submit",async i=>{i.preventDefault();const o=new FormData(a),c={};for(const[l,u]of o.entries())c[l]=u;try{await y.post("/settings/bulk",c),d("Settings saved successfully"),c.theme}catch(l){console.error(l),d("Failed to save settings","error")}})}catch(t){console.error(t),document.getElementById("settings-loader").textContent="Error loading settings"}}},En={mount:async s=>{const e=document.getElementById("app");e.innerHTML=`
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
        `,await $n()}};async function $n(){try{const s=await y.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
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
        `,e.querySelectorAll(".table-link").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;gt(n),e.querySelectorAll(".table-link").forEach(i=>i.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(s){console.error(s),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function gt(s,e=0){var a,n;const t=document.getElementById("admin-main");t.innerHTML=`<div class="loader">Loading ${s}...</div>`;try{const o=await y.get(`/admin/tables/${s}?page=${e}&limit=50`);if(!o.rows||o.rows.length===0){t.innerHTML=`
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
                                ${c.map(u=>{const p=l[u];let v=p;return p===null?v='<span class="null">NULL</span>':typeof p=="object"?v=JSON.stringify(p):String(p).length>100&&(v=String(p).substring(0,100)+"..."),`<td>${v}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>gt(s,e-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>gt(s,e+1))}catch(i){console.error(i),t.innerHTML=`<div class="error">Failed to load data for ${s}</div>`}}let J={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function Cn(s,e){let t=null;if(e.length>0){const n=e[0];if(n.imagePaths&&n.imagePaths.length>0){const i=n.imagePaths[0];let o;typeof i=="string"?o=i:i&&typeof i=="object"&&(o=i.filename||i.path||i.name||i.url,o&&o.includes("/")&&(o=o.split("/").pop()),o&&o.includes("\\")&&(o=o.split("\\").pop())),o&&(t=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(o)}`)}}const a=e.reduce((n,i)=>{var o;return n+(((o=i.imagePaths)==null?void 0:o.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${s}">
      <div class="manga-card-cover">
        ${t?`<img src="${t}" alt="${s}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📁</div>'">`:'<div class="placeholder">📁</div>'}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${s}</div>
    </div>
  `}function xn(s){const e=J.bookmarks.find(t=>t.id===s);return e?e.alias||e.title:s}function Sn(s){const e=J.bookmarks.find(t=>t.id===s);if(e&&e.seriesId){const t=J.series.find(a=>a.id===e.seriesId);if(t)return{id:t.id,name:t.alias||t.title}}return null}function In(s,e,t,a=!1){return`
    <div class="manga-card trophy-gallery-card" data-trophy-id="${s}" data-is-series="${a}">
      <div class="manga-card-cover">
        <div class="placeholder trophy-placeholder">🏆</div>
        <div class="manga-card-badges">
            <span class="badge badge-trophy">🏆 ${t}</span>
            ${a?'<span class="badge badge-series">Series</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Ln(){const s={};console.log("Building trophy groups from:",J.trophyPages);for(const e of Object.keys(J.trophyPages)){const t=J.trophyPages[e];let a=0;for(const[i,o]of Object.entries(t))a+=Object.keys(o).length;if(console.log(`Manga ${e}: ${a} trophies`),a===0)continue;const n=Sn(e);if(n)s[n.id]||(s[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),s[n.id].count+=a,s[n.id].mangaIds.push(e);else{const i=xn(e);console.log(`No series for ${e}, using name: ${i}`),s[e]={name:i,isSeries:!1,count:a,mangaIds:[e]}}}return console.log("Trophy groups result:",s),s}function Qe(){if(J.loading)return`
      ${te("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:s,listOrder:e}=J.favorites,t=`
    <div class="favorites-tabs">
      <button class="tab-btn ${J.activeTab==="galleries"?"active":""}" data-tab="galleries">
        📁 Galleries
      </button>
      <button class="tab-btn ${J.activeTab==="trophies"?"active":""}" data-tab="trophies">
        🏆 Trophies
      </button>
    </div>
  `;let a="";if(J.activeTab==="galleries")e.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${e.map(i=>{const o=s&&s[i]||[];return Cn(i,o)}).join("")}
        </div>
      `;else{const n=Ln(),i=Object.keys(n);i.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${i.map(c=>{const l=n[c];return In(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${te("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${t}
      ${a}
    </div>
  `}function ds(){pe();const s=document.getElementById("app");s.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",()=>{J.activeTab=t.dataset.tab,s.innerHTML=Qe(),ds()})}),s.querySelectorAll(".gallery-card").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.gallery;T.go(`/read/gallery/${encodeURIComponent(a)}`)})}),s.querySelectorAll(".trophy-gallery-card").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trophyId;t.dataset.isSeries==="true"?T.go(`/read/trophies/series-${a}/🏆`):T.go(`/read/trophies/${a}/🏆`)})})}async function Bn(){try{const[s,e,t,a]=await Promise.all([ie.loadFavorites(),y.get("/trophy-pages"),ie.loadBookmarks(),ie.loadSeries()]);J.favorites=s||{favorites:{},listOrder:[]},J.trophyPages=e||{},J.bookmarks=t||[],J.series=a||[],J.loading=!1}catch(s){console.error("Failed to load favorites:",s),d("Failed to load favorites","error"),J.loading=!1}}async function _n(){console.log("[Favorites] mount called"),J.loading=!0;const s=document.getElementById("app");s.innerHTML=Qe(),await Bn(),console.log("[Favorites] Data loaded, rendering..."),s.innerHTML=Qe(),console.log("[Favorites] Calling setupListeners..."),ds(),console.log("[Favorites] setupListeners complete")}function An(){}const Pn={mount:_n,unmount:An,render:Qe};let F={downloads:{},queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,showEmptyChecks:!1,collapsed:{active:!1,scheduled:!1,completed:!1,history:!0}},Oe=null,ee={};function Ct(s){if(!s)return"Never";const e=Date.now()-new Date(s).getTime(),t=Math.floor(e/6e4);if(t<1)return"Just now";if(t<60)return`${t}m ago`;const a=Math.floor(t/60);return a<24?`${a}h ${t%60}m ago`:`${Math.floor(a/24)}d ago`}function Tn(s){if(!s)return"Not scheduled";const e=new Date(s).getTime()-Date.now();if(e<=0)return"Running now...";const t=Math.floor(e/6e4);if(t<60)return`in ${t}m`;const a=Math.floor(t/60),n=t%60;if(a<24)return`in ${a}h ${n}m`;const i=Math.floor(a/24),o=a%24;return`in ${i}d ${o}h`}function us(s){switch(s){case"download":return"📥";case"scrape":return"🔍";case"scan":return"📁";default:return"⚙️"}}function xt(s){switch(s){case"running":return"var(--color-success, #4caf50)";case"queued":case"pending":return"var(--color-warning, #ff9800)";case"paused":return"var(--color-info, #2196f3)";case"complete":return"var(--color-success, #4caf50)";case"error":case"failed":case"cancelled":return"var(--color-error, #f44336)";default:return"var(--text-secondary, #999)"}}function St(s){switch(s){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return s}}function Mn(s){return!s||s==="default"?"Default (6h)":s==="daily"?"Daily":s==="weekly"?"Weekly":s}function Rn(){const s=F.autoCheck;return s?`
    <div class="queue-inline-header">
      <span class="text-muted">${s.enabledCount} monitored · Last: ${Ct(s.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">▶ Run All Now</button>
    </div>
  `:""}function Nn(s){const e=s.nextCheck?Tn(s.nextCheck):"Not set",t=s.nextCheck&&new Date(s.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${t?"due":""}" data-manga-id="${s.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📖</span>
          <div>
            <div class="task-title">${s.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${Mn(s.schedule)}${s.schedule==="weekly"&&s.day?` · ${s.day.charAt(0).toUpperCase()+s.day.slice(1)}`:""}${(s.schedule==="daily"||s.schedule==="weekly")&&s.time?` · ${s.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${t?"text-success":""}">${t?"⏳ Due now":e}</span>
        </div>
      </div>
    </div>
  `}function Dt(s,e){const t=e.total>0?Math.round(e.completed/e.total*100):0,a=e.status==="running"||e.status==="queued",n=e.status==="paused";return`
    <div class="queue-card task-card" data-task-id="${s}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📥</span>
          <div>
            <div class="task-title">${e.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${xt(e.status)}">${St(e.status)}</div>
          </div>
        </div>
        <div class="task-actions">
          ${a?`<button class="btn btn-sm btn-icon" data-action="pause" data-task="${s}" title="Pause">⏸</button>`:""}
          ${n?`<button class="btn btn-sm btn-icon" data-action="resume" data-task="${s}" title="Resume">▶</button>`:""}
          ${a||n?`<button class="btn btn-sm btn-icon btn-danger" data-action="cancel" data-task="${s}" title="Cancel">✕</button>`:""}
        </div>
      </div>
      <div class="queue-card-body">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${t}%"></div>
          <span class="progress-text">${e.completed} / ${e.total} chapters (${t}%)</span>
        </div>
        ${e.current?`<div class="task-current">Currently: Chapter ${e.current}</div>`:""}
        ${e.errors&&e.errors.length>0?`<div class="task-errors">⚠ ${e.errors.length} error(s)</div>`:""}
      </div>
    </div>
  `}function Dn(s){const e=s.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${us(s.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||s.type}</div>
            <div class="task-status" style="color: ${xt(s.status)}">${St(s.status)}</div>
          </div>
        </div>
      </div>
      ${s.started_at?`<div class="queue-card-body"><small>Started: ${Ct(s.started_at)}</small></div>`:""}
    </div>
  `}function qn(s){const e=s.data||{},t=s.result||{};let a="";return s.type==="scrape"?t.newChaptersCount!==void 0&&t.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${t.newChaptersCount} new chapters</div>`,t.newChapters&&Array.isArray(t.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${s.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${t.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(t.newChaptersCount===0||t.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>'):(s.type==="scan"||s.type==="scan-local")&&t.count!==void 0&&(a=`<div class="task-subtext">Scanned ${t.count} local chapters</div>`),`
    <div class="queue-card task-card history-card" data-history-id="${s.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${us(s.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||s.type}</div>
            <div class="task-status" style="color: ${xt(s.status)}">${St(s.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${s.completed_at?`<div class="queue-card-body"><small>Completed: ${Ct(s.completed_at)}</small></div>`:""}
    </div>
  `}function Fn(){var c;const s=Object.entries(F.downloads),e=s.filter(([,l])=>l.status!=="complete"),t=s.filter(([,l])=>l.status==="complete"),a=new Set(e.map(([,l])=>l.bookmarkId).filter(Boolean)),n=F.queueTasks.filter(l=>{var u;return!(l.type==="download"&&((u=l.data)!=null&&u.mangaId)&&a.has(l.data.mangaId))}),i=e.length+n.length,o=((c=F.autoCheck)==null?void 0:c.schedules)||[];return`
    ${te("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>📋 Task Queue</h2>
        ${i>0?`<span class="queue-badge">${i} active</span>`:""}
      </div>

      ${e.length>0||n.length>0?`
        <div class="queue-section ${F.collapsed.active?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${e.map(([l,u])=>Dt(l,u)).join("")}
            ${n.map(l=>Dn(l)).join("")}
          </div>
        </div>
      `:""}

      ${o.length>0?`
        <div class="queue-section ${F.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${o.length})
            </h3>
            ${Rn()}
          </div>
          <div class="queue-section-content">
            ${o.map(l=>Nn(l)).join("")}
          </div>
        </div>
      `:""}

      ${t.length>0?`
        <div class="queue-section ${F.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${t.map(([l,u])=>Dt(l,u)).join("")}
          </div>
        </div>
      `:""}

      ${F.historyTasks&&F.historyTasks.length>0?(()=>{const l=v=>{if(v.type!=="scrape")return!1;const g=v.result||{};return(v.status==="complete"||v.status==="completed")&&(g.newChaptersCount===0||g.updated===!1)},u=F.historyTasks.filter(l).length,p=F.showEmptyChecks?F.historyTasks:F.historyTasks.filter(v=>!l(v));return`
        <div class="queue-section ${F.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${u>0?`
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${F.showEmptyChecks?"Hide":"Show"} checks with no new chapters">
                    ${F.showEmptyChecks?"🔽 Hide":"🔼 Show"} empty checks (${u})
                  </button>
                `:""}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  🗑️ Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${p.length>0?p.map(v=>qn(v)).join(""):`
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${u>0?`${u} empty check(s) hidden.`:""}</p>
                  </div>
                `}
            </div>
        </div>
      `})():""}

      ${e.length===0&&n.length===0&&t.length===0&&o.length===0&&(!F.historyTasks||F.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">✨</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function ve(){try{const[s,e,t,a]=await Promise.all([y.getDownloads().catch(()=>({})),y.getQueueTasks().catch(()=>[]),y.getQueueHistory(50).catch(()=>[]),y.getAutoCheckStatus().catch(()=>null)]);F.downloads=s||{},F.queueTasks=e||[],F.historyTasks=t||[],F.autoCheck=a,F.loading=!1}catch(s){console.error("[Queue] Failed to load data:",s),F.loading=!1}}function le(){const s=document.getElementById("app");s&&(s.innerHTML=Fn(),On())}function On(){pe(),document.querySelectorAll("[data-toggle]").forEach(a=>{a.addEventListener("click",n=>{const i=a.dataset.toggle;F.collapsed[i]=!F.collapsed[i],le()})});const s=document.getElementById("run-autocheck-btn");s&&s.addEventListener("click",async()=>{s.disabled=!0,s.textContent="⏳ Running...";try{d("Auto-check started...","info");const a=await y.runAutoCheck();d(`Check complete: ${a.checked} checked, ${a.updated} updated`,"success"),await ve(),le()}catch(a){d("Auto-check failed: "+a.message,"error"),s.disabled=!1,s.textContent="▶ Run Now"}});const e=document.getElementById("clear-history-btn");e&&e.addEventListener("click",async a=>{if(a.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await y.clearQueueHistory(),d("History cleared","success"),await ve(),le()}catch(n){d(`Failed to clear history: ${n.message}`,"error")}});const t=document.getElementById("toggle-empty-checks-btn");t&&t.addEventListener("click",a=>{a.stopPropagation(),F.showEmptyChecks=!F.showEmptyChecks,le()}),document.querySelectorAll(".scheduled-manga-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.mangaId;n&&(window.location.hash=`#/manga/${n}`)})}),document.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const i=a.dataset.action,o=a.dataset.task;try{i==="pause"?(await y.pauseDownload(o),d("Download paused","info")):i==="resume"?(await y.resumeDownload(o),d("Download resumed","info")):i==="cancel"&&confirm("Cancel this download?")&&(await y.cancelDownload(o),d("Download cancelled","info")),await ve(),le()}catch(c){d(`Action failed: ${c.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.historyId,i=document.getElementById(`task-details-${n}`);i&&i.classList.toggle("hidden")})})}async function Un(){F.loading=!0;const s=document.getElementById("app");s.innerHTML=`
    ${te("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>📋 Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,pe(),await ve(),le(),Oe=setInterval(async()=>{await ve(),le()},5e3),ee.downloadProgress=e=>{e.taskId&&F.downloads[e.taskId]&&(Object.assign(F.downloads[e.taskId],e),le())},ee.downloadCompleted=e=>{ve().then(le)},ee.queueUpdated=e=>{ve().then(le)},j.on(Y.DOWNLOAD_PROGRESS,ee.downloadProgress),j.on(Y.DOWNLOAD_COMPLETED,ee.downloadCompleted),j.on(Y.QUEUE_UPDATED,ee.queueUpdated)}function Vn(){Oe&&(clearInterval(Oe),Oe=null),ee.downloadProgress&&j.off(Y.DOWNLOAD_PROGRESS,ee.downloadProgress),ee.downloadCompleted&&j.off(Y.DOWNLOAD_COMPLETED,ee.downloadCompleted),ee.queueUpdated&&j.off(Y.QUEUE_UPDATED,ee.queueUpdated),ee={}}const Hn={mount:Un,unmount:Vn};class zn{constructor(){this.container=null,this.scrapers=[],this.currentQuery="",this.currentTarget="all",this.isSearching=!1,this.results=[],this.viewMode="main",this.browseScraper=null,this.browseQuery="english",this.browseSort="popular-today",this.browsePage=1,this.browseTotalPages=1,this.isBrowsing=!1,this.browseResults=[],this.previewInfo=null,this.previewImages=[],this.previewIndex=0,this.infoAbortController=null}async mount(e){this.container=document.getElementById("app"),document.body.className="scrapers-mode",this.updateView(),await this.loadScrapers(),this.viewMode==="browse"&&this.browseScraper&&this.performBrowse();const t=window.location.hash.match(/\?q=([^&]*)/);t&&t[1]&&(this.currentQuery=decodeURIComponent(t[1]),this.updateView(),this.performSearch())}unmount(){this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.container.innerHTML="",document.body.className=""}async loadScrapers(){try{const e=await y.get("/scrapers/list");e.success&&(this.scrapers=e.scrapers,this.updateView())}catch(e){console.error("Failed to load scrapers",e)}}updateView(){this.render(),this.renderScraperList(),(this.results.length>0||this.isSearching)&&this.renderResults(),this.bindEvents()}render(){this.container.innerHTML=`
      ${te()}
      <div class="view-container scrapers-container" style="${this.viewMode==="main"?"":"display: none;"}">
        <div class="view-header">
          <h1>🔌 Scrapers</h1>
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
              </div>
            </form>
          </div>

          <div id="scraper-results-container" class="scraper-results${this.results.length>0||this.isSearching?"":" scraper-results--hidden"}">
             <div class="empty-state">
               <div class="empty-icon">🔎</div>
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
             ${this.browseScraper?this.getDomainIcon(this.browseScraper):"🌐"} Browse: ${this.browseScraper}
          </h1>
        </div>

        <div class="browse-controls-box">
          <div class="browse-form-group" style="flex: 1; min-width: 200px;">
            <label>Query / Filters</label>
            <input type="text" id="browse-query" class="browse-input" value="${this.browseQuery}" placeholder="e.g. english, parody, etc.">
          </div>
          <div class="browse-form-group" style="min-width: 150px;">
            <label>Sort By</label>
            <select id="browse-sort" class="browse-select">
              <option value="popular-today" ${this.browseSort==="popular-today"?"selected":""}>Popular Today</option>
              <option value="popular-week" ${this.browseSort==="popular-week"?"selected":""}>Popular This Week</option>
              <option value="popular" ${this.browseSort==="popular"?"selected":""}>Popular All Time</option>
              <option value="date" ${this.browseSort==="date"?"selected":""}>Latest</option>
            </select>
          </div>
          <div class="browse-actions" style="display: flex; gap: 8px;">
            <button id="browse-apply-btn" class="btn btn-primary">Apply Filters</button>
            <button id="browse-refresh-btn" class="btn btn-secondary" title="Bypass cache and reload fresh results">🔄 Refresh</button>
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
              <button id="preview-read-btn" class="btn btn-primary" style="background: var(--success-color);">📖 Read Now</button>
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
    `,pe()}renderScraperList(){const e=document.getElementById("scraper-cards-list");if(!e)return;if(this.scrapers.length===0){e.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">🔌</div>
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
              <span class="capability-label">🔍 Search</span>
              ${n.canSearch?'<span class="capability-pill capability-yes">✓ Supported</span>':'<span class="capability-pill capability-no">✗ Not available</span>'}
            </div>
            <div class="capability-row">
              <span class="capability-label">➕ Adding</span>
              <span class="capability-pill capability-yes">✓ Supported</span>
            </div>
            <div class="capability-row">
              <span class="capability-label">📖 Browsing</span>
              ${n.canBrowse?'<span class="capability-pill capability-yes">✓ Supported</span>':'<span class="capability-pill capability-soon">🚧 Coming soon</span>'}
            </div>
          </div>

          <div class="scraper-card-footer">
            <button
              class="btn btn-secondary scraper-search-card-btn"
              data-scraper="${n.name}"
              ${n.canSearch?"":"disabled"}
              title="${n.canSearch?`Search in ${n.name}`:"Search not supported"}"
            >🔍 Search</button>
            <button
              class="btn btn-secondary scraper-browse-card-btn"
              data-scraper="${n.name}"
              ${n.canBrowse?"":"disabled"}
              title="${n.canBrowse?`Browse ${n.name}`:"Browsing coming soon"}"
            >📖 Browse</button>
          </div>

        </div>
      `);e.innerHTML=a.join("")}getDomainIcon(e){const t=e.toLowerCase();return t.includes("comix")?"📚":t.includes("mangahere")?"📖":t.includes("nhentai")?"🔞":t.includes("chained")?"⛓️":"🌐"}bindEvents(){const e=document.getElementById("scraper-search-form");e&&e.addEventListener("submit",g=>{g.preventDefault();const w=document.getElementById("scraper-query");w&&w.value.trim()&&(this.currentQuery=w.value.trim(),this.performSearch())});const t=document.getElementById("clear-target-btn");t&&t.addEventListener("click",()=>{this.currentTarget="all",this.updateView();const g=document.getElementById("scraper-query");g&&g.focus()}),document.querySelectorAll(".scraper-search-card-btn").forEach(g=>{g.addEventListener("click",w=>{const h=w.target.dataset.scraper;this.currentTarget=h;const $=document.getElementById("scraper-query");$&&(this.currentQuery=$.value.trim()),this.updateView();const I=document.getElementById("scraper-query");I&&(I.focus(),window.scrollTo({top:0,behavior:"smooth"}),this.currentQuery&&this.performSearch())})}),document.querySelectorAll(".scraper-browse-card-btn").forEach(g=>{g.addEventListener("click",w=>{const h=w.target.dataset.scraper;this.browseScraper=h,this.viewMode="browse",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1,this.updateView(),this.performBrowse()})});const a=document.getElementById("exit-browse-btn");a&&a.addEventListener("click",()=>{this.viewMode="main",this.updateView()});const n=document.getElementById("browse-apply-btn");n&&n.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse()});const i=document.getElementById("browse-refresh-btn");i&&i.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse(!1,!0)});const o=document.getElementById("browse-query");o&&o.addEventListener("keypress",g=>{g.key==="Enter"&&n.click()});const c=document.getElementById("browse-load-more-btn");c&&c.addEventListener("click",()=>{!this.isBrowsing&&this.browsePage<this.browseTotalPages&&(this.browsePage++,this.performBrowse(!0))});const l=document.getElementById("preview-close-btn");l&&l.addEventListener("click",()=>{this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),document.getElementById("preview-info-modal").style.display="none"});const u=document.getElementById("preview-add-btn");u&&u.addEventListener("click",()=>{this.previewInfo&&this.previewInfo.url&&this.openAddModal(this.previewInfo.url,u)});const p=document.getElementById("preview-read-btn");p&&p.addEventListener("click",()=>{p.disabled||(this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.openTempReader())});const v=document.getElementById("temp-reader-close");v&&v.addEventListener("click",()=>{document.getElementById("temp-reader-overlay").style.display="none"})}async performSearch(){const e=document.getElementById("scraper-results-container"),t=document.getElementById("scraper-search-btn");if(!e||!t)return;this.isSearching=!0,e.style.display="block",t.textContent="Searching...",t.disabled=!0;const a=this.currentTarget==="all"?"all sites":this.currentTarget;e.innerHTML=`
      <div class="loading-state" style="margin-top: 2rem;">
        <div class="spinner"></div>
        <p>Searching ${a} for "${this.currentQuery}"...</p>
        <p class="subtitle">This may take a minute...</p>
      </div>
    `;try{const n=await y.get(`/scrapers/search?q=${encodeURIComponent(this.currentQuery)}&scraper=${encodeURIComponent(this.currentTarget)}`);if(n.success)this.results=n.results||[],this.renderResults();else throw new Error(n.error||"Failed to search scrapers")}catch(n){console.error("Search error",n),e.innerHTML=`<div class="error-state" style="margin-top: 2rem;">Failed to perform search: ${n.message}</div>`}finally{this.isSearching=!1,t.textContent="Search",t.disabled=!1}}renderResults(){const e=document.getElementById("scraper-results-container");if(!e)return;if(this.results.length===0){e.innerHTML=`
        <div class="empty-state" style="margin-top: 2rem;">
          <div class="empty-icon">🤷</div>
          <p>No results found for "${this.currentQuery}".</p>
        </div>
      `;return}let t='<div class="library-grid" style="margin-top: 2rem;">';this.results.forEach(a=>{const n=a.cover||"";let i="";n.startsWith("/covers/")?i=n:n&&(i=`/api/scrapers/proxy-cover?url=${encodeURIComponent(n)}`);const o=i?`<img src="${i}" alt="Cover" loading="lazy" onerror="this.outerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>';t+=`
        <div class="manga-card scraper-result-card" data-url="${a.url}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${o}
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
      `}),t+="</div>",e.innerHTML=t,setTimeout(()=>{document.querySelectorAll(".scraper-result-card").forEach(a=>{a.addEventListener("click",n=>{n.target.closest(".add-from-search-btn")||window.open(a.dataset.url,"_blank")})}),document.querySelectorAll(".add-from-search-btn").forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation();const i=n.target.dataset.url;this.openAddModal(i,n.target)})})},100)}async _addToLibraryAndWait(e){const t=await y.addBookmark(e);if(!t.jobId)throw new Error("No job ID returned");return new Promise((a,n)=>{const i=setInterval(async()=>{try{const c=(await y.getQueueHistory(20)).find(l=>l.id===t.jobId);c&&(c.status==="completed"?(clearInterval(i),c.result&&c.result.bookmark?a(c.result.bookmark):n(new Error("Job completed but returned no bookmark"))):c.status==="failed"&&(clearInterval(i),n(new Error(c.error))))}catch{}},1e3)})}async openAddModal(e,t){const a=t?t.textContent:"+ Add to Library";t&&(t.textContent="Adding...");try{const n=await this._addToLibraryAndWait(e);document.getElementById("preview-info-modal").style.display="none",window.location.hash=`#/manga/${n.id}`}catch(n){alert("Error adding manga: "+n.message)}finally{t&&(t.textContent=a)}}async performBrowse(e=!1,t=!1){const a=document.getElementById("browse-results-container"),n=document.getElementById("browse-load-more-btn"),i=document.getElementById("browse-loading-indicator"),o=document.getElementById("browse-pagination");if(a){this.isBrowsing=!0,e?(n.style.display="none",i.style.display="block",document.getElementById("browse-loading-page").textContent=this.browsePage):(a.innerHTML=`
        <div class="loading-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="spinner"></div>
          <p>Browsing ${this.browseScraper}...</p>
        </div>
      `,o.style.display="none");try{let c=`/scrapers/browse?scraper=${encodeURIComponent(this.browseScraper)}&q=${encodeURIComponent(this.browseQuery)}&sort=${encodeURIComponent(this.browseSort)}&page=${this.browsePage}`;t&&(c+="&refresh=true");const l=await y.get(c);if(l.success)e?this.browseResults=[...this.browseResults,...l.results||[]]:this.browseResults=l.results||[],this.browseTotalPages=l.totalPages||1,this.renderBrowseResults(e);else throw new Error(l.error||"Failed to browse")}catch(c){console.error("Browse error",c),e?alert("Failed to load more results: "+c.message):a.innerHTML=`<div class="error-state" style="grid-column: 1/-1; margin-top: 2rem;">Failed to load browse results: ${c.message}</div>`}finally{this.isBrowsing=!1,e&&(n.style.display="inline-block",i.style.display="none")}}}renderBrowseResults(e){const t=document.getElementById("browse-results-container"),a=document.getElementById("browse-pagination");if(this.browseResults.length===0){t.innerHTML=`
        <div class="empty-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="empty-icon">🤷</div>
          <p>No results found.</p>
        </div>
      `,a.style.display="none";return}let n="";this.browseResults.forEach((i,o)=>{const c=i.cover||"";let l="";c.startsWith("/covers/")?l=c:c&&(l=`/api/scrapers/proxy-cover?url=${encodeURIComponent(c)}`);const u=l?`<img src="${l}" alt="Cover" loading="lazy" onerror="this.outerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>';n+=`
        <div class="manga-card browse-result-card" data-index="${o}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${u}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${i.website||this.browseScraper}</span>
            </div>
          </div>
          <div class="manga-card-title" title="${i.title}">${i.title}</div>
        </div>
      `}),t.innerHTML=n,this.browsePage<this.browseTotalPages?a.style.display="block":a.style.display="none",setTimeout(()=>{document.querySelectorAll(".browse-result-card").forEach(i=>{i.addEventListener("click",()=>{const o=parseInt(i.dataset.index),c=this.browseResults[o];c&&this.openInfoModal(c)})})},100)}async openInfoModal(e){this.infoAbortController&&this.infoAbortController.abort(),this.infoAbortController=new AbortController;const t=this.infoAbortController.signal,a=document.getElementById("preview-info-modal"),n=document.getElementById("preview-info-body"),i=document.getElementById("preview-read-btn");this.previewInfo=e,a.style.display="flex",n.innerHTML=`
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
         <div style="flex: 0 0 200px; max-width: 100%;">
            <div class="manga-card-cover" style="height: 280px; border-radius: 8px;">
               ${e.cover?`<img src="${e.cover.startsWith("/covers/")?e.cover:"/api/scrapers/proxy-cover?url="+encodeURIComponent(e.cover)}" style="width: 100%; height: 100%; object-fit: cover;">`:'<div class="placeholder">📖</div>'}
            </div>
         </div>
         <div style="flex: 1; min-width: 250px;">
            <h2 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.5rem;">${e.title}</h2>
            <p style="color: var(--text-muted); margin-bottom: 1rem;">${e.website||this.browseScraper}</p>
            <div id="preview-extended-info" class="loading-state" style="padding: 1rem 0; min-height: 100px; justify-content: flex-start; align-items: flex-start;">
               <div class="spinner" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></div>
               <p style="font-size: 0.9rem;">Fetching details...</p>
            </div>
         </div>
      </div>
    `,this._setReadBtnEnabled(i,!1);try{const o=await y.get(`/scrapers/info?url=${encodeURIComponent(e.url)}`,{signal:t});if(o.success&&o.info){this.previewInfo={...this.previewInfo,...o.info};let c="";o.info.tags&&o.info.tags.length>0&&(c=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Tags</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${o.info.tags.map(u=>`<span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); font-weight: normal; font-size: 0.75rem;">${u}</span>`).join("")}
                 </div>
               </div>
             `);let l="";o.info.artists&&o.info.artists.length>0&&(l=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Artists</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${o.info.artists.map(u=>`<span class="badge badge-chapters">${u}</span>`).join("")}
                 </div>
               </div>
             `),document.getElementById("preview-extended-info").innerHTML=`
             <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; background: var(--bg-color); padding: 1rem; border-radius: 8px;">
               <div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Pages / Ch</div>
                  <div style="font-weight: bold;">${o.info.pageCount||o.info.totalChapters||"?"}</div>
               </div>
               ${o.info.displayId?`
                 <div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Gallery ID</div>
                    <div style="font-weight: bold;">${o.info.displayId}</div>
                 </div>
               `:""}
             </div>
             ${l}
             ${c}
          `,this._setReadBtnEnabled(i,!0)}else document.getElementById("preview-extended-info").innerHTML='<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>',(this.previewInfo.galleryId||this.previewInfo.url)&&this._setReadBtnEnabled(i,!0)}catch(o){if(o.name==="AbortError"||t.aborted){console.log("Scraper details fetch aborted successfully.");return}console.error("Info error:",o),document.getElementById("preview-extended-info").innerHTML=`<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${o.message}</p>`,this._setReadBtnEnabled(i,!0)}}_setReadBtnEnabled(e,t){e&&(e.disabled=!t,e.style.opacity=t?"1":"0.5",e.style.cursor=t?"pointer":"not-allowed",e.style.pointerEvents=t?"auto":"none")}async openTempReader(){if(!this.previewInfo||!this.previewInfo.url&&!this.previewInfo.galleryId)return;const e=this.previewInfo.url||`https://nhentai.net/g/${this.previewInfo.galleryId}/`,t=this.browseScraper||this.previewInfo.website;sessionStorage.setItem("streamPreviewUrl",e),sessionStorage.setItem("streamPreviewTitle",this.previewInfo.title||"Preview"),t?sessionStorage.setItem("streamPreviewScraper",t):sessionStorage.removeItem("streamPreviewScraper"),document.getElementById("preview-info-modal").style.display="none",window.location.hash="#/read/stream/preview"}}const jn=new zn;class Qn{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,t){this.routes.set(e,t)}async navigate(){console.log("[Router] navigate called");const t=(window.location.hash.slice(1)||"/").split("?")[0],[a,...n]=t.split("/").filter(Boolean),i=`/${a||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let o=this.routes.get(i);!o&&this.routes.has("/")&&(o=this.routes.get("/")),o&&(this.currentRoute=i,this.currentView=o,o.mount&&(console.log("[Router] calling mount on view module"),await o.mount(n)),pe())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),pe())}}const T=new Qn;T.register("/",Ca);T.register("/manga",pn);T.register("/read",Ta);T.register("/series",wn);T.register("/settings",kn);T.register("/admin",En);T.register("/favorites",Pn);T.register("/queue",Hn);T.register("/scrapers",jn);class Wn{constructor(){this.currentView=null,this.mangaCache=new Map}async init(){if(console.log("[App] Initializing..."),!y.isAuthenticated()){window.location.href="/login.html";return}j.connect(),this.setupSocketListeners(),T.init(),this.hideLoading(),console.log("[App] Ready")}setupSocketListeners(){j.on(Y.CHAPTER_DOWNLOADED,e=>{console.log("[Socket] Chapter downloaded:",e),this.onChapterUpdate(e)}),j.on(Y.CHAPTER_HIDDEN,e=>{console.log("[Socket] Chapter hidden:",e),this.onChapterUpdate(e)}),j.on(Y.CHAPTER_UNHIDDEN,e=>{console.log("[Socket] Chapter unhidden:",e),this.onChapterUpdate(e)}),j.on(Y.MANGA_UPDATED,e=>{console.log("[Socket] Manga updated:",e),this.onMangaUpdate(e)}),j.on(Y.DOWNLOAD_PROGRESS,e=>{this.onDownloadProgress(e)}),j.on(Y.DOWNLOAD_COMPLETED,e=>{console.log("[Socket] Download completed:",e),this.showToast(`Downloaded: ${e.chapterNumber}`,"success")}),j.on(Y.QUEUE_UPDATED,e=>{this.onQueueUpdate(e)}),j.on(Y.ACTION_RECORDED,e=>{console.log("[Socket] Action recorded:",e),this.updateUndoButton()}),j.on(Y.ACTION_UNDONE,e=>{console.log("[Socket] Action undone:",e),this.showToast("Action undone","info"),this.updateUndoButton()})}onChapterUpdate(e){window.dispatchEvent(new CustomEvent("chapter:update",{detail:e}))}onMangaUpdate(e){this.mangaCache.delete(e.mangaId),window.dispatchEvent(new CustomEvent("manga:update",{detail:e}))}onDownloadProgress(e){window.dispatchEvent(new CustomEvent("download:progress",{detail:e}))}onQueueUpdate(e){window.dispatchEvent(new CustomEvent("queue:update",{detail:e}))}async updateUndoButton(){try{const{undoableCount:e}=await y.getActions({limit:1}),t=document.getElementById("undo-btn");if(t){t.style.display=e>0?"flex":"none";const a=t.querySelector(".count");a&&(a.textContent=e)}}catch{}}showToast(e,t="info"){const a=document.createElement("div");a.className=`toast toast-${t}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}hideLoading(){const e=document.querySelector(".loading-screen");e&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),300))}}const Gn=new Wn;document.addEventListener("DOMContentLoaded",()=>Gn.init());
