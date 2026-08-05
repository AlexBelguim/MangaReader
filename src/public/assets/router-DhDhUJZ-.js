import{a as m}from"./api-C0riDQi_.js";const ye=Object.create(null);ye.open="0";ye.close="1";ye.ping="2";ye.pong="3";ye.message="4";ye.upgrade="5";ye.noop="6";const Ge=Object.create(null);Object.keys(ye).forEach(t=>{Ge[ye[t]]=t});const gt={type:"error",data:"parser error"},us=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",ps=typeof ArrayBuffer=="function",hs=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,At=({type:t,data:e},s,a)=>us&&e instanceof Blob?s?a(e):Yt(e,a):ps&&(e instanceof ArrayBuffer||hs(e))?s?a(e):Yt(new Blob([e]),a):a(ye[t]+(e||"")),Yt=(t,e)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];e("b"+(a||""))},s.readAsDataURL(t)};function Jt(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let dt;function Vs(t,e){if(us&&t.data instanceof Blob)return t.data.arrayBuffer().then(Jt).then(e);if(ps&&(t.data instanceof ArrayBuffer||hs(t.data)))return e(Jt(t.data));At(t,!1,s=>{dt||(dt=new TextEncoder),e(dt.encode(s))})}const Xt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Pe=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<Xt.length;t++)Pe[Xt.charCodeAt(t)]=t;const Hs=t=>{let e=t.length*.75,s=t.length,a,n=0,i,o,c,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const d=new ArrayBuffer(e),h=new Uint8Array(d);for(a=0;a<s;a+=4)i=Pe[t.charCodeAt(a)],o=Pe[t.charCodeAt(a+1)],c=Pe[t.charCodeAt(a+2)],l=Pe[t.charCodeAt(a+3)],h[n++]=i<<2|o>>4,h[n++]=(o&15)<<4|c>>2,h[n++]=(c&3)<<6|l&63;return d},zs=typeof ArrayBuffer=="function",Mt=(t,e)=>{if(typeof t!="string")return{type:"message",data:ms(t,e)};const s=t.charAt(0);return s==="b"?{type:"message",data:js(t.substring(1),e)}:Ge[s]?t.length>1?{type:Ge[s],data:t.substring(1)}:{type:Ge[s]}:gt},js=(t,e)=>{if(zs){const s=Hs(t);return ms(s,e)}else return{base64:!0,data:t}},ms=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},gs="",Qs=(t,e)=>{const s=t.length,a=new Array(s);let n=0;t.forEach((i,o)=>{At(i,!1,c=>{a[o]=c,++n===s&&e(a.join(gs))})})},Ws=(t,e)=>{const s=t.split(gs),a=[];for(let n=0;n<s.length;n++){const i=Mt(s[n],e);if(a.push(i),i.type==="error")break}return a};function Gs(){return new TransformStream({transform(t,e){Vs(t,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const i=new DataView(n.buffer);i.setUint8(0,126),i.setUint16(1,a)}else{n=new Uint8Array(9);const i=new DataView(n.buffer);i.setUint8(0,127),i.setBigUint64(1,BigInt(a))}t.data&&typeof t.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(s)})}})}let ut;function je(t){return t.reduce((e,s)=>e+s.length,0)}function Qe(t,e){if(t[0].length===e)return t.shift();const s=new Uint8Array(e);let a=0;for(let n=0;n<e;n++)s[n]=t[0][a++],a===t[0].length&&(t.shift(),a=0);return t.length&&a<t[0].length&&(t[0]=t[0].slice(a)),s}function Ks(t,e){ut||(ut=new TextDecoder);const s=[];let a=0,n=-1,i=!1;return new TransformStream({transform(o,c){for(s.push(o);;){if(a===0){if(je(s)<1)break;const l=Qe(s,1);i=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(je(s)<2)break;const l=Qe(s,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(je(s)<8)break;const l=Qe(s,8),d=new DataView(l.buffer,l.byteOffset,l.length),h=d.getUint32(0);if(h>Math.pow(2,21)-1){c.enqueue(gt);break}n=h*Math.pow(2,32)+d.getUint32(4),a=3}else{if(je(s)<n)break;const l=Qe(s,n);c.enqueue(Mt(i?l:ut.decode(l),e)),a=0}if(n===0||n>t){c.enqueue(gt);break}}}})}const fs=4;function Y(t){if(t)return Ys(t)}function Ys(t){for(var e in Y.prototype)t[e]=Y.prototype[e];return t}Y.prototype.on=Y.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this};Y.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this};Y.prototype.off=Y.prototype.removeListener=Y.prototype.removeAllListeners=Y.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+t];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===e||a.fn===e){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+t],this};Y.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),s=this._callbacks["$"+t],a=1;a<arguments.length;a++)e[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,e)}return this};Y.prototype.emitReserved=Y.prototype.emit;Y.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};Y.prototype.hasListeners=function(t){return!!this.listeners(t).length};const it=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,s)=>s(e,0),ce=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Js="arraybuffer";function vs(t,...e){return e.reduce((s,a)=>(t.hasOwnProperty(a)&&(s[a]=t[a]),s),{})}const Xs=ce.setTimeout,Zs=ce.clearTimeout;function ot(t,e){e.useNativeTimers?(t.setTimeoutFn=Xs.bind(ce),t.clearTimeoutFn=Zs.bind(ce)):(t.setTimeoutFn=ce.setTimeout.bind(ce),t.clearTimeoutFn=ce.clearTimeout.bind(ce))}const ea=1.33;function ta(t){return typeof t=="string"?sa(t):Math.ceil((t.byteLength||t.size)*ea)}function sa(t){let e=0,s=0;for(let a=0,n=t.length;a<n;a++)e=t.charCodeAt(a),e<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(a++,s+=4);return s}function ys(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function aa(t){let e="";for(let s in t)t.hasOwnProperty(s)&&(e.length&&(e+="&"),e+=encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e}function na(t){let e={},s=t.split("&");for(let a=0,n=s.length;a<n;a++){let i=s[a].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}class ra extends Error{constructor(e,s,a){super(e),this.description=s,this.context=a,this.type="TransportError"}}class Tt extends Y{constructor(e){super(),this.writable=!1,ot(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,s,a){return super.emitReserved("error",new ra(e,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const s=Mt(e,this.socket.binaryType);this.onPacket(s)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,s={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const s=aa(e);return s.length?"?"+s:""}}class ia extends Tt{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const s=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};Ws(e,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Qs(e,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=ys()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(e,s)}}let bs=!1;try{bs=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const oa=bs;function la(){}class ca extends ia{constructor(e){if(super(e),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||a!==e.port}}doWrite(e,s){const a=this.request({method:"POST",data:e});a.on("success",s),a.on("error",(n,i)=>{this.onError("xhr post error",n,i)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=e}}class ve extends Y{constructor(e,s,a){super(),this.createRequest=e,ot(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var e;const s=vs(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=ve.requestsCount++,ve.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=la,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete ve.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}ve.requestsCount=0;ve.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Zt);else if(typeof addEventListener=="function"){const t="onpagehide"in ce?"pagehide":"unload";addEventListener(t,Zt,!1)}}function Zt(){for(let t in ve.requests)ve.requests.hasOwnProperty(t)&&ve.requests[t].abort()}const da=function(){const t=ws({xdomain:!1});return t&&t.responseType!==null}();class ua extends ca{constructor(e){super(e);const s=e&&e.forceBase64;this.supportsBinary=da&&!s}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new ve(ws,this.uri(),e)}}function ws(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||oa))return new XMLHttpRequest}catch{}if(!e)try{return new ce[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const ks=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class pa extends Tt{get name(){return"websocket"}doOpen(){const e=this.uri(),s=this.opts.protocols,a=ks?{}:vs(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;At(a,this.supportsBinary,i=>{try{this.doWrite(a,i)}catch{}n&&it(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=ys()),this.supportsBinary||(s.b64=1),this.createUri(e,s)}}const pt=ce.WebSocket||ce.MozWebSocket;class ha extends pa{createSocket(e,s,a){return ks?new pt(e,s,a):s?new pt(e,s):new pt(e)}doWrite(e,s){this.ws.send(s)}}class ma extends Tt{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const s=Ks(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=e.readable.pipeThrough(s).getReader(),n=Gs();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const i=()=>{a.read().then(({done:c,value:l})=>{c||(this.onPacket(l),i())}).catch(c=>{})};i();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;this._writer.write(a).then(()=>{n&&it(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const ga={websocket:ha,webtransport:ma,polling:ua},fa=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,va=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function ft(t){if(t.length>8e3)throw"URI too long";const e=t,s=t.indexOf("["),a=t.indexOf("]");s!=-1&&a!=-1&&(t=t.substring(0,s)+t.substring(s,a).replace(/:/g,";")+t.substring(a,t.length));let n=fa.exec(t||""),i={},o=14;for(;o--;)i[va[o]]=n[o]||"";return s!=-1&&a!=-1&&(i.source=e,i.host=i.host.substring(1,i.host.length-1).replace(/;/g,":"),i.authority=i.authority.replace("[","").replace("]","").replace(/;/g,":"),i.ipv6uri=!0),i.pathNames=ya(i,i.path),i.queryKey=ba(i,i.query),i}function ya(t,e){const s=/\/{2,9}/g,a=e.replace(s,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&a.splice(0,1),e.slice(-1)=="/"&&a.splice(a.length-1,1),a}function ba(t,e){const s={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,i){n&&(s[n]=i)}),s}const vt=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ke=[];vt&&addEventListener("offline",()=>{Ke.forEach(t=>t())},!1);class $e extends Y{constructor(e,s){if(super(),this.binaryType=Js,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(s=e,e=null),e){const a=ft(e);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=ft(s.host).host);ot(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=na(this.opts.query)),vt&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ke.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const s=Object.assign({},this.opts.query);s.EIO=fs,s.transport=e,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&$e.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(e);s.open(),this.setTransport(s)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",$e.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=e.data,this._onError(s);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=ta(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,it(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,s,a){return this._sendPacket("message",e,s,a),this}send(e,s,a){return this._sendPacket("message",e,s,a),this}_sendPacket(e,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const i={type:e,data:s,options:a};this.emitReserved("packetCreate",i),this.writeBuffer.push(i),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),e()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():e()}):this.upgrading?a():e()),this}_onError(e){if($e.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),vt&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=Ke.indexOf(this._offlineEventListener);a!==-1&&Ke.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,s),this.writeBuffer=[],this._prevBufferLen=0}}}$e.protocol=fs;class wa extends $e{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let s=this.createTransport(e),a=!1;$e.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",y=>{if(!a)if(y.type==="pong"&&y.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;$e.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(h(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const b=new Error("probe error");b.transport=s.name,this.emitReserved("upgradeError",b)}}))};function i(){a||(a=!0,h(),s.close(),s=null)}const o=y=>{const b=new Error("probe error: "+y);b.transport=s.name,i(),this.emitReserved("upgradeError",b)};function c(){o("transport closed")}function l(){o("socket closed")}function d(y){s&&y.name!==s.name&&i()}const h=()=>{s.removeListener("open",n),s.removeListener("error",o),s.removeListener("close",c),this.off("close",l),this.off("upgrading",d)};s.once("open",n),s.once("error",o),s.once("close",c),this.once("close",l),this.once("upgrading",d),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const s=[];for(let a=0;a<e.length;a++)~this.transports.indexOf(e[a])&&s.push(e[a]);return s}}let ka=class extends wa{constructor(e,s={}){const a=typeof e=="object"?e:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>ga[n]).filter(n=>!!n)),super(e,a)}};function $a(t,e="",s){let a=t;s=s||typeof location<"u"&&location,t==null&&(t=s.protocol+"//"+s.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=s.protocol+t:t=s.host+t),/^(https?|wss?):\/\//.test(t)||(typeof s<"u"?t=s.protocol+"//"+t:t="https://"+t),a=ft(t)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const i=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+i+":"+a.port+e,a.href=a.protocol+"://"+i+(s&&s.port===a.port?"":":"+a.port),a}const Ea=typeof ArrayBuffer=="function",Ca=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,$s=Object.prototype.toString,xa=typeof Blob=="function"||typeof Blob<"u"&&$s.call(Blob)==="[object BlobConstructor]",Sa=typeof File=="function"||typeof File<"u"&&$s.call(File)==="[object FileConstructor]";function Pt(t){return Ea&&(t instanceof ArrayBuffer||Ca(t))||xa&&t instanceof Blob||Sa&&t instanceof File}function Ye(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let s=0,a=t.length;s<a;s++)if(Ye(t[s]))return!0;return!1}if(Pt(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return Ye(t.toJSON(),!0);for(const s in t)if(Object.prototype.hasOwnProperty.call(t,s)&&Ye(t[s]))return!0;return!1}function La(t){const e=[],s=t.data,a=t;return a.data=yt(s,e),a.attachments=e.length,{packet:a,buffers:e}}function yt(t,e){if(!t)return t;if(Pt(t)){const s={_placeholder:!0,num:e.length};return e.push(t),s}else if(Array.isArray(t)){const s=new Array(t.length);for(let a=0;a<t.length;a++)s[a]=yt(t[a],e);return s}else if(typeof t=="object"&&!(t instanceof Date)){const s={};for(const a in t)Object.prototype.hasOwnProperty.call(t,a)&&(s[a]=yt(t[a],e));return s}return t}function Ia(t,e){return t.data=bt(t.data,e),delete t.attachments,t}function bt(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let s=0;s<t.length;s++)t[s]=bt(t[s],e);else if(typeof t=="object")for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(t[s]=bt(t[s],e));return t}const _a=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var U;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(U||(U={}));class Ba{constructor(e){this.replacer=e}encode(e){return(e.type===U.EVENT||e.type===U.ACK)&&Ye(e)?this.encodeAsBinary({type:e.type===U.EVENT?U.BINARY_EVENT:U.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let s=""+e.type;return(e.type===U.BINARY_EVENT||e.type===U.BINARY_ACK)&&(s+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(s+=e.nsp+","),e.id!=null&&(s+=e.id),e.data!=null&&(s+=JSON.stringify(e.data,this.replacer)),s}encodeAsBinary(e){const s=La(e),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class Rt extends Y{constructor(e){super(),this.reviver=e}add(e){let s;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(e);const a=s.type===U.BINARY_EVENT;a||s.type===U.BINARY_ACK?(s.type=a?U.EVENT:U.ACK,this.reconstructor=new Aa(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(Pt(e)||e.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(e),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let s=0;const a={type:Number(e.charAt(0))};if(U[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===U.BINARY_EVENT||a.type===U.BINARY_ACK){const i=s+1;for(;e.charAt(++s)!=="-"&&s!=e.length;);const o=e.substring(i,s);if(o!=Number(o)||e.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(o)}if(e.charAt(s+1)==="/"){const i=s+1;for(;++s&&!(e.charAt(s)===","||s===e.length););a.nsp=e.substring(i,s)}else a.nsp="/";const n=e.charAt(s+1);if(n!==""&&Number(n)==n){const i=s+1;for(;++s;){const o=e.charAt(s);if(o==null||Number(o)!=o){--s;break}if(s===e.length)break}a.id=Number(e.substring(i,s+1))}if(e.charAt(++s)){const i=this.tryParse(e.substr(s));if(Rt.isPayloadValid(a.type,i))a.data=i;else throw new Error("invalid payload")}return a}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,s){switch(e){case U.CONNECT:return es(s);case U.DISCONNECT:return s===void 0;case U.CONNECT_ERROR:return typeof s=="string"||es(s);case U.EVENT:case U.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&_a.indexOf(s[0])===-1);case U.ACK:case U.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Aa{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const s=Ia(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function es(t){return Object.prototype.toString.call(t)==="[object Object]"}const Ma=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Rt,Encoder:Ba,get PacketType(){return U}},Symbol.toStringTag,{value:"Module"}));function he(t,e,s){return t.on(e,s),function(){t.off(e,s)}}const Ta=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Es extends Y{constructor(e,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[he(e,"open",this.onopen.bind(this)),he(e,"packet",this.onpacket.bind(this)),he(e,"error",this.onerror.bind(this)),he(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...s){var a,n,i;if(Ta.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(s.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const o={type:U.EVENT,data:s};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const h=this.ids++,y=s.pop();this._registerAckCallback(h,y),o.id=h}const c=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((i=this.io.engine)===null||i===void 0)&&i._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[e]=s;return}const i=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===e&&this.sendBuffer.splice(c,1);s.call(this,new Error("operation has timed out"))},n),o=(...c)=>{this.io.clearTimeoutFn(i),s.apply(this,c)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...s){return new Promise((a,n)=>{const i=(o,c)=>o?n(o):a(c);i.withError=!0,s.push(i),this.emit(e,...s)})}_addToQueue(e){let s;typeof e[e.length-1]=="function"&&(s=e.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...i)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...i)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!e||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:U.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(a=>String(a.id)===e)){const a=this.acks[e];delete this.acks[e],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case U.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case U.EVENT:case U.BINARY_EVENT:this.onevent(e);break;case U.ACK:case U.BINARY_ACK:this.onack(e);break;case U.DISCONNECT:this.ondisconnect();break;case U.CONNECT_ERROR:this.destroy();const a=new Error(e.data.message);a.data=e.data.data,this.emitReserved("connect_error",a);break}}onevent(e){const s=e.data||[];e.id!=null&&s.push(this.ack(e.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:U.ACK,id:e,data:n}))}}onack(e){const s=this.acks[e.id];typeof s=="function"&&(delete this.acks[e.id],s.withError&&e.data.unshift(null),s.apply(this,e.data))}onconnect(e,s){this.id=e,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:U.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,e.data)}}}function Me(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}Me.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),s=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+s:t-s}return Math.min(t,this.max)|0};Me.prototype.reset=function(){this.attempts=0};Me.prototype.setMin=function(t){this.ms=t};Me.prototype.setMax=function(t){this.max=t};Me.prototype.setJitter=function(t){this.jitter=t};class wt extends Y{constructor(e,s){var a;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(s=e,e=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,ot(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new Me({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=e;const n=s.parser||Ma;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var s;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(s=this.backoff)===null||s===void 0||s.setMin(e),this)}randomizationFactor(e){var s;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(s=this.backoff)===null||s===void 0||s.setJitter(e),this)}reconnectionDelayMax(e){var s;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(s=this.backoff)===null||s===void 0||s.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new ka(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=he(s,"open",function(){a.onopen(),e&&e()}),i=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),e?e(c):this.maybeReconnectOnOpen()},o=he(s,"error",i);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{n(),i(new Error("timeout")),s.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(he(e,"ping",this.onping.bind(this)),he(e,"data",this.ondata.bind(this)),he(e,"error",this.onerror.bind(this)),he(e,"close",this.onclose.bind(this)),he(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(s){this.onclose("parse error",s)}}ondecoded(e){it(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,s){let a=this.nsps[e];return a?this._autoConnect&&!a.active&&a.connect():(a=new Es(this,e,s),this.nsps[e]=a),a}_destroy(e){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(e){const s=this.encoder.encode(e);for(let a=0;a<s.length;a++)this.engine.write(s[a],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Te={};function Je(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const s=$a(t,e.path||"/socket.io"),a=s.source,n=s.id,i=s.path,o=Te[n]&&i in Te[n].nsps,c=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return c?l=new wt(a,e):(Te[n]||(Te[n]=new wt(a,e)),l=Te[n]),s.query&&!e.query&&(e.query=s.queryKey),l.socket(s.path,e)}Object.assign(Je,{Manager:wt,Socket:Es,io:Je,connect:Je});class Pa{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=Je({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var s;this.subscribedMangas.add(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var s;this.subscribedMangas.delete(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,s){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(s),this.socket&&this.socket.on(e,s)}off(e,s){this.listeners.has(e)&&this.listeners.get(e).delete(s),this.socket&&this.socket.off(e,s)}emit(e,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(e,s)}}const fe={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone"},de=new Pa,ne={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},me=new Set,W=new Map,Re=new Map;function Ra(t){return ne[t]}function qa(t,e){ne[t]=e,me.add(t),Oe(t)}function Da(t,e){return Re.has(t)||Re.set(t,new Set),Re.get(t).add(e),()=>{var s;return(s=Re.get(t))==null?void 0:s.delete(e)}}function Oe(t){const e=Re.get(t);e&&e.forEach(s=>s(ne[t]))}function qe(t){me.delete(t),W.delete(t)}function Na(t){return me.has(t)}async function De(t=!1){if(!t&&me.has("bookmarks"))return ne.bookmarks;if(W.has("bookmarks"))return W.get("bookmarks");const e=m.getBookmarks().then(s=>(ne.bookmarks=s||[],me.add("bookmarks"),W.delete("bookmarks"),Oe("bookmarks"),ne.bookmarks)).catch(s=>{throw W.delete("bookmarks"),s});return W.set("bookmarks",e),e}async function Fa(t=!1){if(!t&&me.has("series"))return ne.series;if(W.has("series"))return W.get("series");const e=m.get("/series").then(s=>(ne.series=s||[],me.add("series"),W.delete("series"),Oe("series"),ne.series)).catch(s=>{throw W.delete("series"),s});return W.set("series",e),e}async function Ua(t=!1){if(!t&&me.has("categories"))return ne.categories;if(W.has("categories"))return W.get("categories");const e=m.get("/categories").then(s=>(ne.categories=s.categories||[],me.add("categories"),W.delete("categories"),Oe("categories"),ne.categories)).catch(s=>{throw W.delete("categories"),s});return W.set("categories",e),e}async function Oa(t=!1){if(!t&&me.has("favorites"))return ne.favorites;if(W.has("favorites"))return W.get("favorites");const e=m.getFavorites().then(s=>(ne.favorites=s||{favorites:{},listOrder:[]},me.add("favorites"),W.delete("favorites"),Oe("favorites"),ne.favorites)).catch(s=>{throw W.delete("favorites"),s});return W.set("favorites",e),e}function Va(){de.on(fe.MANGA_UPDATED,()=>{qe("bookmarks"),De(!0)}),de.on(fe.MANGA_ADDED,()=>{qe("bookmarks"),De(!0)}),de.on(fe.MANGA_DELETED,()=>{qe("bookmarks"),De(!0)}),de.on(fe.DOWNLOAD_COMPLETED,()=>{qe("bookmarks"),De(!0)})}Va();const ie={get:Ra,set:qa,subscribe:Da,invalidate:qe,isLoaded:Na,loadBookmarks:De,loadSeries:Fa,loadCategories:Ua,loadFavorites:Oa};function u(t,e="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=t,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}const Ha={library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',"book-open":'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',"book-marked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',"layout-grid":'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',check:'<path d="M20 6 9 17l-5-5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',"trash-2":'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',"undo-2":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',scissors:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',play:'<polygon points="6 3 20 12 6 21 6 3"/>',pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',"hard-drive":'<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',package:'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"eye-off":'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',circle:'<circle cx="12" cy="12" r="10"/>',lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',"lock-open":'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',"triangle-alert":'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',"shield-alert":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',"circle-help":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',"traffic-cone":'<path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"/><path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"/><path d="M13.9 3.5a1.93 1.93 0 0 0-3.8 0L6.1 19.5a1.93 1.93 0 0 0 1.9 2.5h8a1.93 1.93 0 0 0 1.9-2.5z"/><path d="M2 21h20"/>',sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',"alarm-clock":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',loader:'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',"search-x":'<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',"list-checks":'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',"log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',sliders:'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',"chevron-up":'<path d="m18 15-6-6-6 6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"columns-2":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',"rectangle-vertical":'<rect width="12" height="20" x="6" y="2" rx="2"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',"arrow-left-right":'<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',"refresh-cw":'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>',"rotate-cw":'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"message-circle":'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'};function p(t,e={}){const s=Ha[t];if(!s)return console.warn("[icons] unknown icon:",t),"";const{size:a,cls:n="",title:i,spin:o=!1}=e,c=["icon",o?"icon-spin":"",n].filter(Boolean).join(" "),l=a?` width="${a}" height="${a}"`:"",d=i?` role="img" aria-label="${String(i).replace(/"/g,"&quot;")}"`:' aria-hidden="true"';return`<svg class="${c}"${l} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${d}>${s}</svg>`}function ue(t="book"){return`<div class="placeholder" data-icon="${t}"></div>`}function Ee(t,e,s={}){const{kind:a="book",self:n=!1,attrs:i=""}=s,o=String(e??"").replace(/"/g,"&quot;"),c=`<div class=&quot;placeholder&quot; data-icon=&quot;${a}&quot;></div>`,l=n?"this.outerHTML":"this.parentElement.innerHTML";return`<img src="${t}" alt="${o}" loading="lazy"${i?" "+i:""} onerror="${l}='${c}'">`}const ts=`${p("folder")} Scan Folder`,ss=`${p("loader",{spin:!0})} Scanning...`;async function za(t,e,s){try{t&&(t.disabled=!0,t.innerHTML=ss),e&&(e.innerHTML=ss),u("Scanning downloads folder...","info");const n=(await m.scanLibrary()).found||[];if(n.length===0){u("Scan complete: No new manga found","info"),s&&s();return}ja(n,s)}catch(a){u("Scan failed: "+a.message,"error")}finally{t&&(t.disabled=!1,t.innerHTML=ts),e&&(e.innerHTML=ts)}}async function ja(t,e){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),i=Array.from(n).map(l=>l.dataset.folder);if(i.length===0){u("No folders selected","warning");return}const o=document.getElementById("import-all-btn");o.disabled=!0,o.textContent="Importing...";let c=0;for(const l of i)try{await m.importLocalManga(l),c++}catch(d){console.error("Failed to import",l,d)}s.remove(),u(`Imported ${c} manga`,"success"),e&&e()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function Qa(t={}){const{size:e,stroke:s="currentColor",accent:a="var(--accent-primary, #E03A2F)",strokeWidth:n=2,cls:i=""}=t,o=e?` width="${e}" height="${e}"`:"";return`<svg class="${`logo-mark ${i}`.trim()}"${o} viewBox="0 0 24 24" fill="none" stroke="${s}" stroke-width="${n}" stroke-linejoin="round" aria-hidden="true"><polygon points="3,3 10.5,3 8.5,21 3,21"/><polygon points="13,3 21,3 21,10.5 12.17,10.5" fill="${a}" stroke="${a}"/><polygon points="11.89,13 21,13 21,21 11,21"/></svg>`}function as(){return`${Qa()}<span class="logo-text">Manga<span>Reader</span></span>`}const se={user:null,get isAdmin(){var t;return((t=this.user)==null?void 0:t.role)==="admin"},get isDemo(){var t;return((t=this.user)==null?void 0:t.role)==="demo"},get canDownload(){var t;return this.isAdmin||!this.isDemo&&!!((t=this.user)!=null&&t.canDownload)},get canEdit(){var t;return this.isAdmin||!this.isDemo&&!!((t=this.user)!=null&&t.canEdit)}};function Tr(t){se.user=t||null}function ae(t="manga"){if(se.isDemo)return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${as()}</a>
        <div class="header-actions">
          <div class="view-toggle">
            <button class="view-toggle-btn ${t==="manga"?"active":""}" data-view="manga" title="Manga view">${p("library",{title:"Manga view"})}</button>
            <button class="view-toggle-btn ${t==="series"?"active":""}" data-view="series" title="Series view">${p("book-open",{title:"Series view"})}</button>
          </div>
          <span class="demo-badge">Demo</span>
          <a href="/login.html" class="btn btn-secondary" id="demo-exit-btn" title="Exit the demo">${p("log-out",{title:"Exit the demo"})} Exit</a>
        </div>
      </div>
    </header>
  `;const e=se.isAdmin?`<a href="#/admin" class="btn btn-secondary" title="Admin">${p("wrench",{title:"Admin"})}</a>`:"",s=se.isAdmin?`<a href="#/admin" class="mobile-menu-item">${p("wrench")} Admin</a>`:"",a=se.canDownload?`<button class="btn btn-secondary" id="scan-btn">${p("folder")} Scan Folder</button>`:"",n=se.canDownload?`<button class="mobile-menu-item" id="mobile-scan-btn">${p("folder")} Scan Folder</button>`:"",i=se.canEdit?t==="series"?`<button class="btn btn-primary" id="add-series-btn">${p("plus")} Add Series</button>`:`<button class="btn btn-primary" id="add-manga-btn">${p("plus")} Add Manga</button>`:"",o=se.canEdit?t==="series"?`<button class="mobile-menu-item primary" id="mobile-add-series-btn">${p("plus")} Add Series</button>`:`<button class="mobile-menu-item primary" id="mobile-add-btn">${p("plus")} Add Manga</button>`:"";return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${as()}</a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${t==="manga"?"active":""}" data-view="manga" title="Manga view">${p("library",{title:"Manga view"})}</button>
            <button class="view-toggle-btn ${t==="series"?"active":""}" data-view="series" title="Series view">${p("book-open",{title:"Series view"})}</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">${p("star")} Favorites</button>
          <a href="#/queue" class="btn btn-secondary" id="queue-nav-btn" title="Task Queue">${p("list-checks")} Queue</a>
          ${a}
          ${i}
          <button class="btn btn-secondary" id="logout-btn" title="Log out">${p("log-out",{title:"Log out"})}</button>
          <a href="#/scrapers" class="btn btn-secondary" title="Search Scrapers">${p("search",{title:"Search Scrapers"})}</a>
          ${e}
          <a href="#/settings" class="btn btn-secondary" title="Settings">${p("settings",{title:"Settings"})}</a>
        </div>
        <button class="hamburger-btn mobile-only" id="hamburger-btn">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu hidden" id="mobile-menu">
        <div class="mobile-view-toggle">
          <button class="view-toggle-btn ${t==="manga"?"active":""}" data-view="manga">${p("library")} Manga</button>
          <button class="view-toggle-btn ${t==="series"?"active":""}" data-view="series">${p("book-open")} Series</button>
        </div>
        <button class="mobile-menu-item" id="mobile-favorites-btn">${p("star")} Favorites</button>
        <a href="#/queue" class="mobile-menu-item">${p("list-checks")} Task Queue</a>
        ${n}
        ${o}
        <button class="mobile-menu-item" id="mobile-logout-btn">${p("log-out")} Logout</button>
        <a href="#/scrapers" class="mobile-menu-item">${p("search")} Scrapers</a>
        ${s}
        <a href="#/settings" class="mobile-menu-item">${p("settings")} Settings</a>
      </div>
    </header>
  `}function we(){const t=document.querySelector("header");if(t&&t.dataset.listenersBound)return;t&&(t.dataset.listenersBound="true");const e=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");e&&s&&e.addEventListener("click",()=>{s.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),i=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",i),n&&n.addEventListener("click",i);const o=document.getElementById("demo-exit-btn");o&&o.addEventListener("click",B=>{B.preventDefault(),localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"}),document.querySelectorAll("[data-view]").forEach(B=>{B.addEventListener("click",()=>{const T=B.dataset.view;localStorage.setItem("library_view_mode",T),document.querySelectorAll("[data-view]").forEach(O=>{O.classList.toggle("active",O.dataset.view===T)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:T}}))})});const c=document.querySelector(".logo");c&&c.addEventListener("click",B=>{localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),ie.loadBookmarks(!0).catch(()=>{}),window.dispatchEvent(new CustomEvent("clearFilters"))});const l=document.getElementById("favorites-btn"),d=document.getElementById("mobile-favorites-btn"),h=B=>{B.preventDefault(),q.go("/favorites")};l&&l.addEventListener("click",h),d&&d.addEventListener("click",h);const y=document.getElementById("queue-nav-btn");y&&y.addEventListener("click",B=>{B.preventDefault(),q.go("/queue")});const b=document.getElementById("add-manga-btn"),x=document.getElementById("mobile-add-btn"),E=()=>{document.getElementById("add-modal")||(sessionStorage.setItem("open_add_modal","1"),q.go("/"))};b&&b.addEventListener("click",E),x&&x.addEventListener("click",E);const g=document.getElementById("scan-btn"),S=document.getElementById("mobile-scan-btn");if(g||S){const B=()=>{za(g,S,async()=>{await ie.loadBookmarks(!0),q.reload()})};g&&g.addEventListener("click",B),S&&S.addEventListener("click",B)}}let $={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",searchAuthor:localStorage.getItem("library_search_author")||null,searchAuthorSource:localStorage.getItem("library_search_author_source")||null,sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0},tt=[];function ns(t){return String(t).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}function Wa(t){return[...t].sort((e,s)=>{var a,n;switch($.sortBy){case"az":return(e.alias||e.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(e.alias||e.title);case"lastread":return(s.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const i=((a=e.chapters)==null?void 0:a.length)||e.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-i}case"updated":default:return(s.updatedAt||"").localeCompare(e.updatedAt||"")}})}function qt(){let t=$.bookmarks;const e=(Array.isArray($.categories)?$.categories:[]).filter(s=>typeof s=="object"?s.isNsfw:!1).map(s=>s.name);if($.activeCategory==="__nsfw__"?t=t.filter(s=>(s.categories||[]).some(a=>e.includes(a))):$.activeCategory?t=t.filter(s=>(s.categories||[]).includes($.activeCategory)):e.length>0&&(t=t.filter(s=>!(s.categories||[]).some(a=>e.includes(a)))),$.artistFilter&&(t=t.filter(s=>(s.artists||[]).includes($.artistFilter))),$.searchQuery){const s=$.searchQuery.toLowerCase();t=t.filter(a=>(a.title||"").toLowerCase().includes(s)||(a.alias||"").toLowerCase().includes(s)||(a.artists||[]).some(n=>n.toLowerCase().includes(s)))}return Wa(t)}function Dt(t){var h,y,b;const e=t.alias||t.title,s=t.downloadedCount??((h=t.downloadedChapters)==null?void 0:h.length)??0,a=new Set(t.excludedChapters||[]),n=(t.chapters||[]).filter(x=>!a.has(x.number)),i=new Set(n.map(x=>x.number)).size||t.uniqueChapters||0,o=t.readCount??((y=t.readChapters)==null?void 0:y.length)??0,c=(t.updatedCount??((b=t.updatedChapters)==null?void 0:b.length)??0)>0,l=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover,d=t.source==="local";return`
    <div class="manga-card" data-id="${t.id}">
      <div class="manga-card-cover">
        ${l?Ee(l,e,{kind:d?"local":"book"}):ue(d?"local":"book")}
        <div class="manga-card-badges">
          ${o>0?`<span class="badge badge-read" title="Read">${o}</span>`:""}
          <span class="badge badge-chapters" title="Total">${i}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${c?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${t.autoCheck?`<span class="badge badge-monitored" title="Auto-check enabled">${p("alarm-clock",{title:"Auto-check enabled"})}</span>`:""}
          ${$.activeCategory==="Favorites"?`<span class="badge badge-play" title="Click to Read">${p("play",{title:"Click to Read"})}</span>`:""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Nt(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function Ga(t){var n;const e=t.alias||t.title,s=((n=t.entries)==null?void 0:n.length)||t.entry_count||0;let a=null;return t.localCover&&t.coverBookmarkId?a=`/api/public/covers/${t.coverBookmarkId}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(a=t.cover),`
    <div class="manga-card series-card" data-series-id="${t.id}">
      <div class="manga-card-cover">
        ${a?Ee(a,e,{kind:"series"}):ue("series")}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${s} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function st(){const t=localStorage.getItem("library_view_mode");if(t&&t!==$.viewMode&&($.viewMode=t),$.activeCategory==="Favorites")return q.go("/favorites"),"";let e="";if($.viewMode==="series"){const s=$.series.map(Ga).join("");e=`
      <div class="library-grid" id="library-grid">
        ${$.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const s=qt(),n=$.searchAuthor&&$.searchQuery===$.searchAuthor?`
      <div class="manga-card search-sources-card" id="search-sources-card" title="Search online sources for ${ns($.searchAuthor)}"
           style="display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed var(--border-color, #3a3a4a);background:transparent;min-height:220px;text-align:center;">
        <div style="padding:1rem;color:var(--text-muted, #9aa);">
          <div style="font-size:2.5rem;line-height:1;margin-bottom:.5rem;">＋</div>
          <div style="font-size:.85rem;">Search sources for<br><strong style="color:var(--text-color, #fff);">${ns($.searchAuthor)}</strong></div>
        </div>
      </div>`:"",i=s.map(Dt).join("")+n;e=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">${p("search")}</span>
          <input type="text" id="library-search" placeholder="Search manga or author..." value="${$.searchQuery}" autocomplete="off">
          ${$.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${$.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${$.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${$.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${$.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${$.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
      </div>
      ${$.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">${p("palette")}</span>
          <span class="artist-filter-name">${$.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${$.loading?'<div class="loading-spinner"></div>':i||Nt()}
      </div>
    `}return`
    ${ae($.viewMode)}
    <div class="container">
      ${e}
    </div>
    ${Ka()}
    ${Ja()}
    ${Xa()}
  `}function Ka(){const{activeCategory:t}=$,s=(Array.isArray($.categories)?$.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=s.some(n=>n.isNsfw);return`
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${t?"has-filter":""}" id="category-fab-btn">
        ${t==="__nsfw__"?p("shield-alert",{title:"18+"}):t||p("tag",{title:"Filter by category"})}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn" title="Manage categories">${p("settings",{title:"Manage categories"})}</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${t?"":"active"}" data-category="">All</button>
          ${a?`<button class="category-menu-item ${t==="__nsfw__"?"active":""}" data-category="__nsfw__" style="color: var(--error);">${p("shield-alert")} All 18+</button>`:""}
          ${s.map(n=>`
            <button class="category-menu-item ${t===n.name?"active":""}" data-category="${n.name}">
              ${n.name}${n.isNsfw?' <span style="color:var(--error);font-size:0.75em;">18+</span>':""}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    ${Ya()}
      `}function Ya(){const e=(Array.isArray($.categories)?$.categories:[]).map(s=>typeof s=="object"?s:{name:s,isNsfw:!1});return`
    <div class="modal" id="manage-categories-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 450px;">
        <div class="modal-header">
          <h2>${p("settings")} Manage Categories</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="display: flex; gap: 8px; margin-bottom: 16px;">
            <input type="text" id="new-category-input" placeholder="New category name..." style="flex: 1;">
            <button class="btn btn-primary" id="add-category-btn">Add</button>
          </div>
          <div id="categories-list" style="max-height: 300px; overflow-y: auto;">
            ${e.length===0?'<p class="text-muted">No categories yet</p>':""}
            ${e.map(s=>`
              <div class="category-manage-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 4px; border-bottom: 1px solid var(--border-color);">
                <span style="flex: 1;">${s.name}</span>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.85em; color: ${s.isNsfw?"var(--error)":"var(--text-secondary)"}">
                    <input type="checkbox" class="nsfw-toggle" data-category="${s.name}" ${s.isNsfw?"checked":""} style="width: 16px; height: 16px;">
                    18+
                  </label>
                  <button class="btn-icon small danger delete-category-btn" data-category="${s.name}" title="Delete">${p("trash-2",{title:"Delete"})}</button>
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
  `}function Ja(){return`
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
      `}function Xa(){return`
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
      `}function kt(){$.activeCategory=null,$.artistFilter=null,$.searchQuery="",$.searchAuthor=null,$.searchAuthorSource=null,localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),le()}async function $t(t){const e=t.target.closest(".manga-card");if(e){if(e.classList.contains("gallery-card")){const n=e.dataset.gallery;q.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=e.dataset.id,a=e.dataset.seriesId;if(a){q.go(`/series/${a}`);return}if(s){if($.activeCategory==="Favorites"){const n=$.bookmarks.find(i=>i.id===s);if(n){let i=n.last_read_chapter;if(!i&&n.chapters&&n.chapters.length>0&&(i=[...n.chapters].sort((c,l)=>c.number-l.number)[0].number),i){q.go(`/read/${s}/${i}`);return}else u("No chapters available to read","warning")}}q.go(`/manga/${s}`)}}}function Cs(){var ee,v,L,A,M;const t=document.getElementById("app");t.removeEventListener("click",$t),t.addEventListener("click",$t),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",w=>{$.viewMode=w.detail.mode;const P=document.getElementById("app");P.innerHTML=st(),Cs(),we()}));const e=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");e&&s&&(e.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",w=>{const P=w.target.closest(".category-menu-item");if(P){const R=P.dataset.category||null;Za(R),s.classList.add("hidden")}})),(ee=document.getElementById("manage-categories-btn"))==null||ee.addEventListener("click",w=>{w.stopPropagation();const P=document.getElementById("manage-categories-modal");P&&P.classList.add("open")}),(v=document.getElementById("close-manage-categories-btn"))==null||v.addEventListener("click",()=>{var w;(w=document.getElementById("manage-categories-modal"))==null||w.classList.remove("open")}),(L=document.querySelector("#manage-categories-modal .modal-overlay"))==null||L.addEventListener("click",()=>{var w;(w=document.getElementById("manage-categories-modal"))==null||w.classList.remove("open")}),(A=document.querySelector("#manage-categories-modal .modal-close"))==null||A.addEventListener("click",()=>{var w;(w=document.getElementById("manage-categories-modal"))==null||w.classList.remove("open")}),(M=document.getElementById("add-category-btn"))==null||M.addEventListener("click",async()=>{var R;const w=document.getElementById("new-category-input"),P=(R=w==null?void 0:w.value)==null?void 0:R.trim();if(P)try{await m.post("/categories",{name:P}),w.value="",u("Category added","success"),await _e(!0),le()}catch(j){u("Failed: "+j.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(w=>{w.addEventListener("change",async P=>{const R=w.dataset.category;try{await m.put(`/categories/${encodeURIComponent(R)}/nsfw`,{isNsfw:w.checked}),u(`${R} ${w.checked?"marked as 18+":"unmarked"}`,"success"),await _e(!0),le()}catch(j){u("Failed: "+j.message,"error"),w.checked=!w.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(w=>{w.addEventListener("click",async()=>{const P=w.dataset.category;if(confirm(`Delete category "${P}"?`))try{await m.delete(`/categories/${encodeURIComponent(P)}`),u("Category deleted","success"),$.activeCategory===P&&($.activeCategory=null,localStorage.removeItem("library_active_category")),await _e(!0),le()}catch(R){u("Failed: "+R.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{$.artistFilter=null,localStorage.removeItem("library_artist_filter"),le()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",w=>{var R;$.searchQuery=w.target.value,localStorage.setItem("library_search",w.target.value),$.searchAuthor=null,$.searchAuthorSource=null,localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source");const P=document.getElementById("library-grid");if(P){const j=qt();P.innerHTML=j.map(Dt).join("")||Nt();const N=document.getElementById("search-clear");!N&&$.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(R=document.getElementById("search-clear"))==null||R.addEventListener("click",()=>{$.searchQuery="",$.searchAuthor=null,$.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),n.value="",le()})):N&&!$.searchQuery&&N.remove()}}),$.searchQuery&&n.focus());const i=document.getElementById("search-clear");i&&i.addEventListener("click",()=>{$.searchQuery="",$.searchAuthor=null,$.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),le()});const o=document.getElementById("search-sources-card");o&&o.addEventListener("click",()=>{const w=$.searchAuthor||$.searchQuery,P=$.searchAuthorSource||"nhentai.net";w&&(window.location.hash=`#/scrapers?browse=${encodeURIComponent(P)}&q=${encodeURIComponent(w)}`)});const c=document.getElementById("library-sort");c&&c.addEventListener("change",w=>{$.sortBy=w.target.value,localStorage.setItem("library_sort",$.sortBy),le()}),window.removeEventListener("clearFilters",kt),window.addEventListener("clearFilters",kt);const l=document.getElementById("add-manga-btn"),d=document.getElementById("mobile-add-btn"),h=document.getElementById("add-modal"),y=document.getElementById("add-modal-close"),b=document.getElementById("add-modal-cancel"),x=document.getElementById("add-modal-submit"),E=document.getElementById("mobile-menu"),g=()=>{E&&E.classList.add("hidden"),h&&h.classList.add("open")};l&&l.addEventListener("click",g),d&&d.addEventListener("click",g),y&&y.addEventListener("click",()=>h.classList.remove("open")),b&&b.addEventListener("click",()=>h.classList.remove("open")),x&&x.addEventListener("click",async()=>{const w=document.getElementById("manga-url"),P=w.value.trim();if(!P){u("Please enter a URL","error");return}try{x.disabled=!0,x.textContent="Adding...",await m.addBookmark(P),u("Manga added successfully!","success"),h.classList.remove("open"),w.value="",await _e(),le()}catch(R){u("Failed to add manga: "+R.message,"error")}finally{x.disabled=!1,x.textContent="Add"}});const S=document.getElementById("add-series-btn"),B=document.getElementById("mobile-add-series-btn"),T=document.getElementById("add-series-modal"),O=document.getElementById("add-series-modal-close"),D=document.getElementById("add-series-modal-cancel"),C=document.getElementById("add-series-modal-submit"),I=document.getElementById("mobile-menu");if((S||B)&&T){const w=()=>{I&&I.classList.add("hidden"),T.classList.add("open")};S&&S.addEventListener("click",w),B&&B.addEventListener("click",w)}O&&O.addEventListener("click",()=>T.classList.remove("open")),D&&D.addEventListener("click",()=>T.classList.remove("open")),C&&C.addEventListener("click",async()=>{const w=document.getElementById("series-title"),P=document.getElementById("series-alias"),R=w.value.trim(),j=P.value.trim();if(!R){u("Please enter a title","error");return}try{C.disabled=!0,C.textContent="Creating...",await m.createSeries(R,j),u("Series created successfully!","success"),T.classList.remove("open"),w.value="",P.value="",await _e(!0),le()}catch(N){u("Failed to create series: "+N.message,"error")}finally{C.disabled=!1,C.textContent="Create"}});const k=T==null?void 0:T.querySelector(".modal-overlay");k&&k.addEventListener("click",()=>T.classList.remove("open"));const _=document.getElementById("empty-add-btn");_&&h&&_.addEventListener("click",()=>h.classList.add("open"));const F=document.getElementById("empty-add-series-btn");F&&T&&F.addEventListener("click",()=>T.classList.add("open"));const Q=h==null?void 0:h.querySelector(".modal-overlay");Q&&Q.addEventListener("click",()=>h.classList.remove("open")),we()}function Za(t){$.activeCategory=t,t?localStorage.setItem("library_active_category",t):localStorage.removeItem("library_active_category"),le()}async function _e(t=!1){try{if(se.isDemo){const[i,o]=await Promise.all([ie.loadBookmarks(t),ie.loadSeries(t)]);$.bookmarks=i,$.categories=[],$.series=o,$.favorites={favorites:{},listOrder:[]},$.loading=!1;return}const[e,s,a,n]=await Promise.all([ie.loadBookmarks(t),ie.loadCategories(t),ie.loadSeries(t),ie.loadFavorites(t)]);$.bookmarks=e,$.categories=s,$.series=a,$.favorites=n,$.loading=!1}catch{u("Failed to load library","error"),$.loading=!1}}async function le(){var e;const t=document.getElementById("app");if(se.isDemo)$.activeCategory=null,$.artistFilter=null,$.searchQuery="",$.searchAuthor=null,$.searchAuthorSource=null;else{const s=localStorage.getItem("library_active_category");$.activeCategory!==s&&($.activeCategory=s);const a=localStorage.getItem("library_artist_filter")||null;$.artistFilter!==a&&($.artistFilter=a);const n=localStorage.getItem("library_search")||"";$.searchQuery!==n&&($.searchQuery=n),$.searchAuthor=localStorage.getItem("library_search_author")||null,$.searchAuthorSource=localStorage.getItem("library_search_author_source")||null}$.loading&&(t.innerHTML=st()),$.bookmarks.length===0&&$.loading&&await _e(),t.innerHTML=st(),Cs(),sessionStorage.getItem("open_add_modal")&&(sessionStorage.removeItem("open_add_modal"),(e=document.getElementById("add-modal"))==null||e.classList.add("open")),tt.forEach(s=>s()),tt=[ie.subscribe("bookmarks",s=>{$.bookmarks=s;const a=document.getElementById("library-grid");if(a){const n=qt();a.innerHTML=n.map(Dt).join("")||Nt()}})]}function en(){const t=document.getElementById("app");t&&t.removeEventListener("click",$t),window.removeEventListener("clearFilters",kt),tt.forEach(e=>e()),tt=[]}const tn={mount:le,unmount:en,render:st},sn="manga-offline",an=1,Le="images",Z="chapters";let We=null;function Ve(){return new Promise((t,e)=>{if(We)return t(We);const s=indexedDB.open(sn,an);s.onupgradeneeded=a=>{const n=a.target.result;n.objectStoreNames.contains(Le)||n.createObjectStore(Le),n.objectStoreNames.contains(Z)||n.createObjectStore(Z)},s.onsuccess=()=>{We=s.result,t(We)},s.onerror=()=>e(s.error)})}function Ie(t,e){return Ve().then(s=>new Promise((a,n)=>{const c=s.transaction(t,"readonly").objectStore(t).get(e);c.onsuccess=()=>a(c.result),c.onerror=()=>n(c.error)}))}function Et(t,e,s){return Ve().then(a=>new Promise((n,i)=>{const l=a.transaction(t,"readwrite").objectStore(t).put(s,e);l.onsuccess=()=>n(),l.onerror=()=>i(l.error)}))}function Ct(t,e){return Ve().then(s=>new Promise((a,n)=>{const c=s.transaction(t,"readwrite").objectStore(t).delete(e);c.onsuccess=()=>a(),c.onerror=()=>n(c.error)}))}function Ft(t){return Ve().then(e=>new Promise((s,a)=>{const o=e.transaction(t,"readonly").objectStore(t).getAllKeys();o.onsuccess=()=>s(o.result),o.onerror=()=>a(o.error)}))}function Be(t,e){return`${t}:${e}`}function Ut(t,e,s){return`${t}:${e}:${s}`}function nn(t){const e=t.split(":");return{mangaId:e[0],chapterNum:parseFloat(e[1])}}async function Ot(t,e,s=null){const a=await m.get(`/bookmarks/${t}/chapters/${e}/reader-images`);if(!a||!a.images||a.images.length===0)throw new Error("No images found for this chapter");const n=a.images,i=n.length;let o=0;const c=m.getToken();for(let d=0;d<n.length;d++){const h=typeof n[d]=="string"?n[d]:n[d].url,y=h.startsWith("http")?h:`${window.location.origin}${h}`;try{const b=await fetch(y,{headers:c?{Authorization:`Bearer ${c}`}:{}});if(!b.ok)throw new Error(`HTTP ${b.status}`);const x=await b.blob();await Et(Le,Ut(t,e,h),x),o++,s&&s(o,i)}catch(b){console.error(`[Offline] Failed to cache image ${d+1}/${i}:`,b)}}const l={mangaId:t,chapterNum:e,imageUrls:n.map(d=>typeof d=="string"?d:d.url),savedAt:Date.now(),imageCount:o};return await Et(Z,Be(t,e),l),{success:!0,imageCount:o}}async function rn(t,e){const s=await Ie(Z,Be(t,e));if(!s)return null;const a=[];for(const n of s.imageUrls){const i=await Ie(Le,Ut(t,e,n));if(i)a.push(URL.createObjectURL(i));else return a.forEach(o=>URL.revokeObjectURL(o)),null}return a}async function xs(t,e){const s=await Ie(Z,Be(t,e));if(s&&s.imageUrls)for(const a of s.imageUrls)await Ct(Le,Ut(t,e,a));await Ct(Z,Be(t,e))}async function on(t,e){if(!await Ie(Z,Be(t,e)))return!1;await xs(t,e);try{return await Ot(t,e),!0}catch(a){return console.warn("[Offline] Could not re-save chapter after edit:",a),!1}}async function ln(t,e){return!!await Ie(Z,Be(t,e))}async function cn(){const t=await Ft(Z),e=[];for(const s of t){if(s.startsWith("auto-offline-"))continue;const a=await Ie(Z,s);a&&e.push(a)}return e}async function Ss(t){const e=await Ft(Z),s=[];for(const a of e)if(!a.startsWith("auto-offline-")&&a.startsWith(`${t}:`)){const{chapterNum:n}=nn(a);s.push(n)}return s}async function dn(){if(navigator.storage&&navigator.storage.estimate){const t=await navigator.storage.estimate();return{used:t.usage||0,quota:t.quota||0,usedMB:((t.usage||0)/(1024*1024)).toFixed(1),quotaMB:((t.quota||0)/(1024*1024)).toFixed(0)}}return{used:0,quota:0,usedMB:"0",quotaMB:"Unknown"}}async function un(){const t=await Ve();await new Promise((e,s)=>{const i=t.transaction(Le,"readwrite").objectStore(Le).clear();i.onsuccess=e,i.onerror=s}),await new Promise((e,s)=>{const i=t.transaction(Z,"readwrite").objectStore(Z).clear();i.onsuccess=e,i.onerror=s})}async function pn(t,e){e?await Et(Z,`auto-offline-${t}`,{enabled:!0,mangaId:t}):await Ct(Z,`auto-offline-${t}`)}async function hn(t){const e=await Ie(Z,`auto-offline-${t}`);return!!(e!=null&&e.enabled)}async function mn(){return(await Ft(Z)).filter(e=>e.startsWith("auto-offline-")).map(e=>e.replace("auto-offline-",""))}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",async t=>{var e;if(((e=t.data)==null?void 0:e.type)==="sync-offline"){const s=t.data.mangaId;console.log(`[Offline] Auto-sync triggered for manga ${s}`);try{await Ls(s)}catch(a){console.error("[Offline] Auto-sync failed:",a)}}});async function Ls(t){try{const e=await m.getBookmark(t);if(!e)return;const s=e.downloadedChapters||[],a=await Ss(t),n=s.filter(i=>!a.includes(i));console.log(`[Offline] ${n.length} new chapters to sync for ${e.alias||e.title}`);for(const i of n)await Ot(t,i),console.log(`[Offline] Auto-synced chapter ${i}`)}catch(e){console.error("[Offline] Sync error:",e)}}const gn={saveChapterOffline:Ot,getOfflineChapter:rn,deleteOfflineChapter:xs,refreshOfflineChapter:on,isChapterOffline:ln,getOfflineChapters:cn,getOfflineChaptersForManga:Ss,getStorageUsage:dn,clearAllOfflineData:un,setAutoOffline:pn,isAutoOffline:hn,getAutoOfflineManga:mn,syncNewChaptersForManga:Ls};let r={manga:null,chapter:null,images:[],trophyPages:{},mode:"manga",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!0,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null,isStreamingMode:!1,_streamAbortController:null};function Is(){if(!r.manga||!r.chapter||!r.allFavorites||!r.allFavorites.favorites)return!1;if(r.isCollectionMode)return!0;let e=[St()];if(r.mode==="manga"&&!r.singlePageMode){const n=G()[r.currentPage];n&&Array.isArray(n)?e=n:n&&n.pages&&(e=n.pages)}const s=e.map(a=>{const n=Ue(r.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in r.allFavorites.favorites){const n=r.allFavorites.favorites[a];if(Array.isArray(n)){for(const i of n)if(i.mangaId===r.manga.id&&i.chapterNum===r.chapter.number&&i.imagePaths)for(const o of i.imagePaths){const c=typeof o=="string"?o:(o==null?void 0:o.filename)||(o==null?void 0:o.path);for(const l of s)if(l&&l.filename===c)return!0}}}return!1}function xt(){const t=document.getElementById("favorites-btn");t&&(Is()?t.classList.add("active"):t.classList.remove("active"))}function Se(){var d;if(r.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!r.manga||!r.images.length&&!r.isStreamingMode)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const t=r.manga.alias||r.manga.title,e=(d=r.chapter)==null?void 0:d.number,a=G().length,n=r.images.length;let i,o;r.mode==="webtoon"?(i=n-1,o=`${n} pages`):r.singlePageMode?(i=n-1,o=`${r.currentPage+1} / ${n}`):(i=a-1,o=`${r.currentPage+1} / ${a}`);const c=Is(),l=Ms();return`
    <div class="reader ${r.mode}-mode ${r.showControls?"":"controls-hidden"}">
      <!-- Unified Top Bar -->
      <div class="reader-bar">
        <button class="reader-bar-btn close-btn" id="reader-close-btn" title="Back">×</button>
        <div class="reader-title">
          <span class="manga-name">${t}</span>
          ${r.isStreamingMode?"":`<span class="chapter-name">Ch. ${e}</span>`}
        </div>
        ${r.isCollectionMode?"":`
        <div class="reader-bar-tools" id="reader-toolbar">
          ${r.isStreamingMode?`
          <button class="reader-bar-btn" id="stream-add-lib-btn" title="Add to Library">${p("download",{title:"Add to Library"})}</button>
          <span class="reader-bar-divider"></span>
          `:`
          <button class="reader-bar-btn ${c?"active":""}" id="favorites-btn" title="Add to favorites">${p("star",{title:"Add to favorites"})}</button>

          <button class="reader-bar-btn" id="rotate-btn" title="Rotate 90° CW">${p("rotate-cw",{title:"Rotate 90 degrees clockwise"})}</button>
          ${r.mode==="manga"&&!r.singlePageMode?`
            <button class="reader-bar-btn" id="swap-btn" title="Swap pages in spread">${p("arrow-left-right",{title:"Swap pages in spread"})}</button>
          `:""}
          ${r.singlePageMode||r.mode==="webtoon"?`
            <button class="reader-bar-btn" id="split-btn" title="Split wide image into halves">${p("scissors",{title:"Split wide image into halves"})}</button>
          `:""}
          <span class="reader-bar-divider"></span>
          `}
          ${r.mode==="manga"?`
            <button class="reader-bar-btn ${r.singlePageMode?"active":""}" id="single-page-btn" title="${r.singlePageMode?"Switch to double page":"Switch to single page"}">
              ${r.singlePageMode?p("rectangle-vertical"):p("columns-2")}
            </button>
            ${r.isStreamingMode?"":`
            <button class="reader-bar-btn ${l?"active":""}" id="trophy-btn" title="${l?"Unmark trophy":"Mark as trophy"}">${p("trophy")}</button>
            `}
          `:""}
          <button class="reader-bar-btn" id="fullscreen-btn" title="Toggle fullscreen">${p("maximize",{title:"Toggle fullscreen"})}</button>
          <button class="reader-bar-btn" id="reader-settings-btn" title="Settings">${p("settings",{title:"Settings"})}</button>
        </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${r.mode==="webtoon"?`zoom: ${r.zoom}%`:""}">
        ${r.isCollectionMode?_s():r.mode==="webtoon"?Bs():As()}
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
  `}function _s(){const t=r.mode==="manga";if(t&&!r.singlePageMode){const e=r.images[r.currentPage];if(!e)return"";const s=e.urls||[e.url],a=e.displayMode||"single";return e.displaySide,a==="double"&&s.length>=2?`
            <div class="manga-spread collection-spread ${r.direction} double-page">
              <div class="manga-page"><img src="${s[0]}" alt="Page A"></div>
              <div class="manga-page"><img src="${s[1]}" alt="Page B"></div>
            </div>
            `:`
            <div class="manga-spread collection-spread single ${r.direction}">
              <div class="manga-page"><img src="${s[0]}" alt="Page"></div>
            </div>
            `}return`
    <div class="${t?"manga-spread single "+r.direction:"gallery-pages"}">
      ${(t?[r.images[r.currentPage]]:r.images).map((e,s)=>{if(!e)return"";const a=e.displayMode||"single",n=e.displaySide||"left",i=e.urls||[e.url];return a==="double"&&i.length>=2?`
            <div class="gallery-page double-page side-${n} ${t?"manga-page":""}" data-page="${s}">
              <img src="${i[0]}" alt="Page ${s+1}A" loading="lazy">
              <img src="${i[1]}" alt="Page ${s+1}B" loading="lazy">
            </div>
          `:`
            <div class="gallery-page single-page ${t?"manga-page":""}" data-page="${s}">
              <img src="${i[0]}" alt="Page ${s+1}" loading="lazy">
            </div>
          `}).join("")}
    </div>
  `}function Bs(){return`
    <div class="webtoon-pages">
      ${r.images.map((t,e)=>{const s=typeof t=="string"?t:t.url,a=r.trophyPages[e];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${e}">
          ${a?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
          <img src="${s}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function As(){if(r.singlePageMode)return fn();const e=G()[r.currentPage];if(!e)return"";if(e.type==="link"){const s=e.pages[0],a=r.images[s],n=typeof a=="string"?a:a.url,i=r.trophyPages[s];return`
        <div class="manga-spread ${r.direction}">
          <div class="manga-page ${i?"trophy-page":""}">
            ${i?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
            <img src="${n}" alt="Page ${s+1}">
          </div>
          <div class="manga-page link-page" id="link-page">
            <div class="link-overlay">Ch. ${e.nextChapter} →</div>
            <img src="${e.nextImage}" alt="Next chapter preview">
          </div>
        </div>
      `}return`
    <div class="manga-spread ${r.direction}">
      ${e.map(s=>{const a=r.images[s],n=typeof a=="string"?a:a.url,i=r.trophyPages[s];return`
        <div class="manga-page ${i?"trophy-page":""}">
          ${i?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
          <img src="${n}" alt="Page ${s+1}">
        </div>
      `}).join("")}
    </div>
  `}function fn(){const t=r.currentPage,e=r.trophyPages[t];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[i,o]=e.pages,c=r.images[i],l=r.images[o],d=typeof c=="string"?c:c==null?void 0:c.url,h=typeof l=="string"?l:l==null?void 0:l.url;if(d&&h)return`
            <div class="manga-spread ${r.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">${p("trophy")}</div><img src="${d}" alt="Page ${i+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">${p("trophy")}</div><img src="${h}" alt="Page ${o+1}"></div>
            </div>
            `}const s=r.images[t];if(!s)return"";const a=typeof s=="string"?s:s.url,n=r.trophyPages[t];return`
    <div class="manga-spread single ${r.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
        <img src="${a}" alt="Page ${t+1}">
      </div>
    </div>
  `}function G(){const t=[],e=r.images.length;let s=0;if(r.isCollectionMode){for(let n=0;n<e;n++)t.push([n]);return t}let a=!r.firstPageSingle;for(;s<e;){const n=r.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[i,o]=n.pages;t.push([i,o]),s=Math.max(i,o)+1}else t.push([s]),s++;continue}if(!a){a=!0,t.push([s]),s++;continue}if(r.lastPageSingle&&s===e-1){r.nextChapterImage?t.push({type:"link",pages:[s],nextImage:r.nextChapterImage,nextChapter:r.nextChapterNum}):t.push([s]),s++;break}s+1<e?r.trophyPages[s+1]?(t.push([s]),s++):r.lastPageSingle&&s+1===e-1?(t.push([s]),r.nextChapterImage?t.push({type:"link",pages:[s+1],nextImage:r.nextChapterImage,nextChapter:r.nextChapterNum}):t.push([s+1]),s+=2):(t.push([s,s+1]),s+=2):(t.push([s]),s++)}return t}function Ms(){if(r.singlePageMode)return!!r.trophyPages[r.currentPage];const e=G()[r.currentPage];return e?(Array.isArray(e)?e:e.pages||[]).some(a=>!!r.trophyPages[a]):!1}function Ts(){if(r.singlePageMode)return[r.currentPage];const e=G()[r.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function vn(){if(!r.manga||!r.chapter||r.isCollectionMode)return;const t=Ts();if(t.length===0)return;if(t.some(s=>!!r.trophyPages[s])){const s=[...t];if(r.singlePageMode){const a=r.trophyPages[r.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete r.trophyPages[a]),u(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=t,a=r.singlePageMode||t.length===1;if(!r.singlePageMode&&t.length===2){const i=await qs(t,"Mark as trophy");if(!i)return;s=i.pages,a=i.pages.length===1}s.forEach(i=>{r.trophyPages[i]={isSingle:a,pages:[...s]}});const n=a?"single":"double";u(`Page${s.length>1?"s":""} marked as trophy (${n})`,"success")}try{await m.saveTrophyPages(r.manga.id,r.chapter.number,r.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}be(),Ps()}function Ps(){const t=document.getElementById("trophy-btn");if(t){const e=Ms();t.classList.toggle("active",e),t.title=e?"Unmark trophy":"Mark as trophy"}}async function He(){if(!r.manga||!r.chapter||r.isCollectionMode||!r.images.length)return;let t=1;if(r.mode==="manga")if(r.singlePageMode)t=r.currentPage+1;else{const s=G()[r.currentPage];s&&s.length>0&&(t=s[0]+1)}else{const e=document.getElementById("reader-content");if(e){const s=e.querySelectorAll("img"),a=e.scrollTop;let n=0;s.forEach((i,o)=>{a>=n&&(t=o+1),n+=i.offsetHeight})}}try{if(se.isDemo)return;await m.updateReadingProgress(r.manga.id,r.chapter.number,t,r.images.length)}catch(e){console.error("Failed to save progress:",e)}}function at(){var s,a,n,i,o,c,l,d,h,y,b,x,E,g,S,B,T,O,D;const t=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{r.isStreamingMode||(await He(),await ke()),r.isStreamingMode?q.go("/scrapers"):r.manga&&r.manga.id!=="gallery"?q.go(`/manga/${r.manga.id}`):q.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{q.go(r.isStreamingMode?"/scrapers":"/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var C;(C=document.getElementById("reader-settings"))==null||C.classList.toggle("hidden")}),(i=document.getElementById("close-settings-btn"))==null||i.addEventListener("click",()=>{var C;(C=document.getElementById("reader-settings"))==null||C.classList.add("hidden")}),(o=document.getElementById("single-page-btn"))==null||o.addEventListener("click",()=>{var C,I;if(r.singlePageMode){const k=G();let _=0;for(let F=0;F<k.length;F++)if(k[F].includes(r.currentPage)){_=F;break}r.singlePageMode=!1,r.currentPage=_}else{const _=G()[r.currentPage];r.singlePageMode=!0,r.currentPage=_?_[0]:0}localStorage.setItem("reader_single_page",r.singlePageMode?"1":"0"),(C=r.manga)!=null&&C.id&&((I=r.chapter)!=null&&I.number)&&ke(),Ne()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{vn()}),t.querySelectorAll("[data-mode]").forEach(C=>{C.addEventListener("click",()=>{var _,F;const I=C.dataset.mode;let k=St();if(r.mode=I,localStorage.setItem("reader_mode",r.mode),I==="webtoon")r.currentPage=k;else if(r.singlePageMode)r.currentPage=k;else{const Q=G();let ee=0;for(let v=0;v<Q.length;v++)if(Q[v].includes(k)){ee=v;break}r.currentPage=ee}(_=r.manga)!=null&&_.id&&((F=r.chapter)!=null&&F.number)&&ke(),Ne(),I==="webtoon"&&setTimeout(()=>{const Q=document.getElementById("reader-content");if(Q){const ee=Q.querySelectorAll("img");ee[k]&&ee[k].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),t.querySelectorAll("[data-direction]").forEach(C=>{C.addEventListener("click",async()=>{var I,k;r.direction=C.dataset.direction,localStorage.setItem("reader_direction",r.direction),(I=r.manga)!=null&&I.id&&((k=r.chapter)!=null&&k.number)&&await ke(),Ne()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async C=>{r.firstPageSingle=C.target.checked,await ke(),be()}),(d=document.getElementById("last-page-single"))==null||d.addEventListener("change",async C=>{var I,k;r.lastPageSingle=C.target.checked,await ke(),r.lastPageSingle&&((I=r.manga)!=null&&I.id)&&((k=r.chapter)!=null&&k.number)?await Rs():(r.nextChapterImage=null,r.nextChapterNum=null),be()}),(h=document.getElementById("zoom-slider"))==null||h.addEventListener("input",C=>{r.zoom=parseInt(C.target.value);const I=document.getElementById("reader-content");I&&(I.style.zoom=`${r.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",C=>{const I=parseInt(C.target.value),k=document.getElementById("page-indicator");k&&(r.singlePageMode?k.textContent=`${I+1} / ${r.images.length}`:k.textContent=`${I+1} / ${G().length}`)}),e.addEventListener("change",C=>{r.currentPage=parseInt(C.target.value),be()})),r.mode==="manga"){const C=document.getElementById("reader-content");C==null||C.addEventListener("click",I=>{var Q;if(I.target.closest("button, a, .link-overlay"))return;const k=C.getBoundingClientRect(),F=(I.clientX-k.left)/k.width;F<.3?Lt():F>.7?Xe():(r.showControls=!r.showControls,(Q=document.querySelector(".reader"))==null||Q.classList.toggle("controls-hidden",!r.showControls))})}document.addEventListener("keydown",Ds),(y=document.getElementById("prev-chapter-btn"))==null||y.addEventListener("click",()=>nt(-1)),(b=document.getElementById("next-chapter-btn"))==null||b.addEventListener("click",()=>nt(1)),r.mode==="webtoon"&&((x=document.getElementById("reader-content"))==null||x.addEventListener("click",()=>{var C;r.showControls=!r.showControls,(C=document.querySelector(".reader"))==null||C.classList.toggle("controls-hidden",!r.showControls)})),(E=document.getElementById("rotate-btn"))==null||E.addEventListener("click",async()=>{const C=ht();if(!(!C||!r.manga||!r.chapter))try{u("Rotating...","info");const I=await m.rotatePage(r.manga.id,r.chapter.number,C);I.images&&(await mt(I.images),u("Page rotated","success"))}catch(I){u("Rotate failed: "+I.message,"error")}}),(g=document.getElementById("swap-btn"))==null||g.addEventListener("click",async()=>{const I=G()[r.currentPage];if(!I||I.length!==2||!r.manga||!r.chapter){u("Select a spread with 2 pages to swap","info");return}const k=Ue(r.images[I[0]]),_=Ue(r.images[I[1]]);if(!(!k||!_))try{u("Swapping...","info");const F=await m.swapPages(r.manga.id,r.chapter.number,k,_);F.images&&(await mt(F.images),u("Pages swapped","success"))}catch(F){u("Swap failed: "+F.message,"error")}}),(S=document.getElementById("split-btn"))==null||S.addEventListener("click",async()=>{const C=ht();if(!C||!r.manga||!r.chapter||!confirm("Split this page into halves? This is permanent."))return;const I=document.getElementById("split-btn");try{u("Preparing to split...","info"),I&&(I.disabled=!0),r.images=[],r.loading=!0,t.innerHTML=Se(),await new Promise(_=>setTimeout(_,2e3)),u("Splitting page...","info");const k=await m.splitPage(r.manga.id,r.chapter.number,C);I&&(I.disabled=!1),await Ce(r.manga.id,r.chapter.number,r.chapter.versionUrl),t.innerHTML=Se(),at(),be(),k.warning?u(k.warning,"warning"):u("Page split into halves","success")}catch(k){I&&(I.disabled=!1),u("Split failed: "+k.message,"error"),await Ce(r.manga.id,r.chapter.number,r.chapter.versionUrl),t.innerHTML=Se(),at()}}),(B=document.getElementById("delete-page-btn"))==null||B.addEventListener("click",async()=>{const C=ht();if(!(!C||!r.manga||!r.chapter)&&confirm(`Delete page "${C}" permanently? This cannot be undone.`))try{u("Deleting...","info");const I=await m.deletePage(r.manga.id,r.chapter.number,C);I.images&&(await mt(I.images),u("Page deleted","success"))}catch(I){u("Delete failed: "+I.message,"error")}}),(T=document.getElementById("favorites-btn"))==null||T.addEventListener("click",async()=>{try{const k=await m.getFavorites();r.allFavorites=k,r.favoriteLists=Object.keys(k.favorites||k||{})}catch(k){console.error("Failed to load favorites",k),u("Failed to load favorites","error");return}let I=[St()];if(r.mode==="manga"&&!r.singlePageMode){const _=G()[r.currentPage];_&&Array.isArray(_)?I=_:_&&_.pages&&(I=_.pages)}if(I.length>1){const k=await qs(I,"Select Page for Favorites");if(!k)return;I=k.pages}wn(I)}),(O=document.getElementById("fullscreen-btn"))==null||O.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{u("Fullscreen not supported","info")})}),(D=document.getElementById("stream-add-lib-btn"))==null||D.addEventListener("click",async()=>{var k;const C=document.getElementById("stream-add-lib-btn");if(!((k=r.manga)!=null&&k._streamUrl)){u("No URL to add","error");return}const I=C.innerHTML;C.innerHTML=p("loader",{spin:!0}),C.disabled=!0;try{const _=await m.addBookmark(r.manga._streamUrl);if(!_.jobId)throw new Error("No job ID returned");u("Adding to library...","info");const F=setInterval(async()=>{var Q;try{const v=(await m.getQueueHistory(20)).find(L=>L.id===_.jobId);v&&(v.status==="completed"?(clearInterval(F),(Q=v.result)!=null&&Q.bookmark&&(u("Added to library!","success"),C.innerHTML=p("check"),C.title="Added! Click to view",C.disabled=!1,C.onclick=()=>{q.go(`/manga/${v.result.bookmark.id}`)})):v.status==="failed"&&(clearInterval(F),u("Failed to add: "+(v.error||"Unknown error"),"error"),C.innerHTML=I,C.disabled=!1))}catch{}},1500)}catch(_){u("Failed to add: "+_.message,"error"),C.innerHTML=I,C.disabled=!1}}),document.body.classList.add("reader-active")}function Ue(t){var n;const e=typeof t=="string"?t:(t==null?void 0:t.url)||((n=t==null?void 0:t.urls)==null?void 0:n[0]);if(!e)return null;const a=e.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function ht(){const t=Ts();return t.length===0?null:Ue(r.images[t[0]])}async function mt(t){var s,a;(s=r.manga)!=null&&s.id&&((a=r.chapter)!=null&&a.number)&&!r.isStreamingMode&&gn.refreshOfflineChapter(r.manga.id,r.chapter.number).then(n=>{n&&console.log("[Reader] Refreshed offline copy after page edit")}).catch(n=>console.warn("[Reader] Offline refresh failed:",n));const e=Date.now();if(r.images=t.map(n=>{const i=typeof n=="string"?n:n==null?void 0:n.url;if(!i)return n;const o=i+(i.includes("?")?"&":"?")+`_t=${e}`;return typeof n=="string"?o:{...n,url:o}}),r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.min(r.currentPage,r.images.length-1);else{const n=G();r.currentPage=Math.min(r.currentPage,n.length-1)}r.currentPage=Math.max(0,r.currentPage),be()}async function Rs(){var t,e;if(!(!((t=r.manga)!=null&&t.id)||!((e=r.chapter)!=null&&e.number)))try{const s=await m.getNextChapterPreview(r.manga.id,r.chapter.number);r.nextChapterImage=s.firstImage||null,r.nextChapterNum=s.nextChapter||null}catch{r.nextChapterImage=null,r.nextChapterNum=null}}async function yn(){var i,o;if(!((i=r.manga)!=null&&i.id)||!((o=r.chapter)!=null&&o.number)||r.isCollectionMode)return;const e=[...r.manga.downloadedChapters||[]].sort((c,l)=>c-l),s=e.indexOf(r.chapter.number);if(s<0||s>=e.length-1)return;const a=e[s+1],n=r.manga.id;if(!(r._preloadCache&&r._preloadCache.chapterNum===a&&r._preloadCache.mangaId===n))try{const l=(r.manga.downloadedVersions||{})[a]||[],d=Array.isArray(l)?l[0]:l,h=d?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(d)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,b=(await m.get(h)).images||[];if(b.length===0)return;const x=b.map(E=>{const g=new Image,S=typeof E=="string"?E:E.url;return S&&(g.src=S),g});r._preloadCache={chapterNum:a,mangaId:n,images:b,imageObjects:x,versionUrl:d},console.log(`[Reader] Preloaded ${b.length} images for chapter ${a}`)}catch(c){console.warn("[Reader] Failed to preload next chapter:",c)}}function bn(t,e){return new Promise(s=>{const a=document.createElement("div");a.className="version-modal-overlay",a.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${t.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const n=a.querySelector(".version-list");t.forEach((i,o)=>{const c=document.createElement("button");c.className="version-item",c.textContent=`Version ${o+1}`,c.addEventListener("click",()=>{a.remove(),s(i)}),n.appendChild(c)}),a.querySelector(".version-cancel").addEventListener("click",()=>{a.remove(),s(null)}),a.addEventListener("click",i=>{i.target===a&&(a.remove(),s(null))}),document.body.appendChild(a)})}function wn(t){if(!r.manga||!r.chapter)return;const e=t.map(l=>{const d=Ue(r.images[l]);return d?{filename:d}:null}).filter(Boolean),s=l=>{if(!r.allFavorites||!r.allFavorites.favorites)return-1;const d=r.allFavorites.favorites[l];if(!Array.isArray(d))return-1;for(let h=0;h<d.length;h++){const y=d[h];if(y.mangaId===r.manga.id&&y.chapterNum===r.chapter.number&&y.imagePaths)for(const b of y.imagePaths){const x=typeof b=="string"?b:(b==null?void 0:b.filename)||(b==null?void 0:b.path);for(const E of e)if(E&&E.filename===x)return h}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";r.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',r.favoriteLists.forEach(l=>{const h=s(l)!==-1;n+=`
                <button class="page-picker-option list-option ${h?"active-list":""}" data-list="${l}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${l}</span>
                    <span style="font-size: 1.2em;">${p(h?"check":"plus")}</span>
                </button>
            `}),n+="</div>"),a.innerHTML=`
        <div class="page-picker-modal" style="width: 90%; max-width: 400px;">
            <h3>${p("star")} Favorites</h3>
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
    `,a.appendChild(i),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),xt()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),xt())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const d=l.dataset.list,h=s(d),y=h!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(y){await m.removeFavoriteItem(d,h);const b=await m.getFavorites();r.allFavorites=b,l.classList.remove("active-list"),l.querySelector("span:last-child").innerHTML=p("plus")}else{const b=t.length>1?"double":"single",x={mangaId:r.manga.id,chapterNum:r.chapter.number,title:`${r.manga.alias||r.manga.title} Ch.${r.chapter.number} p${t[0]+1}`,imagePaths:e,displayMode:b,displaySide:r.direction==="rtl"?"right":"left"};await m.addFavoriteItem(d,x);const E=await m.getFavorites();r.allFavorites=E,l.classList.add("active-list"),l.querySelector("span:last-child").innerHTML=p("check")}}catch(b){console.error(b)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function qs(t,e){return new Promise(s=>{const[a,n]=t,i=r.images[a],o=r.images[n],c=typeof i=="string"?i:i==null?void 0:i.url,l=typeof o=="string"?o:o==null?void 0:o.url,d=r.direction==="rtl",h=d?n:a,y=d?a:n,b=d?l:c,x=d?c:l,E=document.createElement("div");E.className="page-picker-overlay",E.innerHTML=`
            <div class="page-picker-modal">
                <h3>${e}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${h+1}">
                        <img src="${b}" alt="Page ${h+1}">
                        <span class="page-picker-label">Page ${h+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${y+1}">
                        <img src="${x}" alt="Page ${y+1}">
                        <span class="page-picker-label">Page ${y+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    ${p("columns-2")} Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const g=S=>{E.remove(),s(S)};E.querySelectorAll(".page-picker-option").forEach(S=>{S.addEventListener("click",()=>{const B=S.dataset.choice;B==="left"?g({pages:[h]}):B==="right"?g({pages:[y]}):B==="both"&&g({pages:t})})}),E.querySelector(".page-picker-cancel").addEventListener("click",()=>g(null)),E.addEventListener("click",S=>{S.target===E&&g(null)}),document.body.appendChild(E)})}function St(){if(r.mode==="webtoon"){const t=document.getElementById("reader-content");if(t){const e=t.querySelectorAll("img");if(e.length>0){const s=t.scrollTop;if(s>10){let a=0;for(let n=0;n<e.length;n++){const i=e[n].offsetHeight;if(a+i>s)return n;a+=i}}}}return 0}else{if(r.singlePageMode)return r.currentPage;{const e=G()[r.currentPage];return e&&e.length>0?e[0]:0}}}function Ds(t){if(!(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA")){if(t.key==="Escape"){He(),r.manga&&q.go(`/manga/${r.manga.id}`);return}if(r.mode==="manga")t.key==="ArrowLeft"?r.direction==="rtl"?Xe():Lt():t.key==="ArrowRight"?r.direction==="rtl"?Lt():Xe():t.key===" "&&(t.preventDefault(),Xe());else if(r.mode==="webtoon"&&t.key===" "){t.preventDefault();const e=document.getElementById("reader-content");if(e){const s=e.clientHeight*.8;e.scrollBy({top:t.shiftKey?-s:s,behavior:"smooth"})}}}}function Xe(){const t=G(),e=r.singlePageMode?r.images.length-1:t.length-1;if(r.currentPage<e)r.currentPage++,be();else{const s=t[r.currentPage],a=s&&s.type==="link";He(),a&&(r.navigationDirection="next-linked"),nt(1)}}function Lt(){r.currentPage>0?(r.currentPage--,be()):nt(-1)}function be(){const t=document.getElementById("reader-content");if(t){t.innerHTML=r.isCollectionMode?_s():r.mode==="webtoon"?Bs():As();const e=document.getElementById("page-indicator");e&&(r.singlePageMode?e.textContent=`${r.currentPage+1} / ${r.images.length}`:e.textContent=`${r.currentPage+1} / ${G().length}`);const s=document.getElementById("page-slider");s&&(s.value=r.currentPage,s.max=r.singlePageMode?r.images.length-1:G().length-1),Ps(),xt()}}function Ne(){const t=document.getElementById("app");t&&(t.innerHTML=Se(),at())}async function nt(t){if(console.log("[Nav] navigateChapter called with delta:",t),r.isStreamingMode)return;if(!r.manga||!r.chapter){console.log("[Nav] early return - no manga or chapter");return}await He(),await ke();const s=[...r.manga.downloadedChapters||[]].sort((i,o)=>i-o),a=s.indexOf(r.chapter.number),n=a+t;if(console.log("[Nav]",{delta:t,chapterNumber:r.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length){r.navigationDirection||(r.navigationDirection=t<0?"prev":null);const i=s[n],c=(r.manga.downloadedVersions||{})[i]||[],l=Array.isArray(c)?c[0]:c,d=l?`?version=${encodeURIComponent(l)}`:"";console.log("[Nav] Calling router.go with:",`/read/${r.manga.id}/${i}${d}`),q.go(`/read/${r.manga.id}/${i}${d}`)}else u(t>0?"Last chapter":"First chapter","info")}async function Ce(t,e,s){var a,n,i,o,c;console.log("[Reader] loadData called:",{mangaId:t,chapterNum:e,versionUrl:s});try{if(r.mode=localStorage.getItem("reader_mode")||"manga",r.direction=localStorage.getItem("reader_direction")||"rtl",r.singlePageMode=localStorage.getItem("reader_single_page")!=="0",t==="gallery"){const l=decodeURIComponent(e),h=((a=(await m.getFavorites()).favorites)==null?void 0:a[l])||[];r.images=[];for(const y of h){const b=y.imagePaths||[],x=[];for(const E of b){let g;typeof E=="string"?g=E:E&&typeof E=="object"&&(g=E.filename||E.path||E.name||E.url,g&&g.includes("/")&&(g=g.split("/").pop()),g&&g.includes("\\")&&(g=g.split("\\").pop())),g&&x.push(`/api/public/chapter-images/${y.mangaId}/${y.chapterNum}/${encodeURIComponent(g)}`)}x.length>0&&r.images.push({urls:x,displayMode:y.displayMode||"single",displaySide:y.displaySide||"left"})}r.manga={id:"gallery",title:l,alias:l},r.chapter={number:"Gallery"},r.isGalleryMode=!0,r.isCollectionMode=!0,r.images.length===0&&u("Gallery is empty","warning")}else if(t==="trophies"){const l=e;let d=[],h="Trophies";if(l.startsWith("series-")){const y=l.replace("series-",""),x=(await store.loadSeries()).find(S=>S.id===y);h=x?x.alias||x.title:"Series Trophies";const g=(await store.loadBookmarks()).filter(S=>S.seriesId===y);for(const S of g){const B=await m.getTrophyPagesAll(S.id);for(const T in B)for(const O in B[T]){const D=B[T][O],I=(await m.getChapterImages(S.id,T)).images[O],k=typeof I=="string"?I.split("/").pop():(I==null?void 0:I.filename)||(I==null?void 0:I.path);d.push({mangaId:S.id,chapterNum:T,imagePaths:[{filename:k}],displayMode:D.isSingle?"single":"double",displaySide:"left"})}}}else{const y=await m.getBookmark(l);h=y?y.alias||y.title:"Manga Trophies";const b=await m.getTrophyPagesAll(l);for(const x in b)for(const E in b[x]){const g=b[x][E],B=(await m.getChapterImages(l,x)).images[E],T=typeof B=="string"?B.split("/").pop():(B==null?void 0:B.filename)||(B==null?void 0:B.path);d.push({mangaId:l,chapterNum:x,imagePaths:[{filename:decodeURIComponent(T)}],displayMode:g.isSingle?"single":"double",displaySide:"left"})}}r.images=d.map(y=>{const b=y.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${y.mangaId}/${y.chapterNum}/${encodeURIComponent(b)}`],displayMode:y.displayMode,displaySide:y.displaySide}}),r.manga={id:"trophies",title:h,alias:h},r.chapter={number:"🏆"},r.isCollectionMode=!0,r.isGalleryMode=!1}else if(t==="stream"){r.isStreamingMode=!0,r.isCollectionMode=!1,r.isGalleryMode=!1,r.singlePageMode=!0;const l=sessionStorage.getItem("streamPreviewUrl"),d=sessionStorage.getItem("streamPreviewScraper"),h=sessionStorage.getItem("streamPreviewTitle")||"Preview";r.manga={id:"stream",title:h,alias:h,_streamUrl:l},r.chapter={number:1},r.images=[],l?kn(l,d):u("No stream URL found","error")}else{r.isGalleryMode=!1;const l=await m.getBookmark(t);r.manga=l,console.log("[Reader] manga loaded, finding chapter..."),r.chapter=((n=l.chapters)==null?void 0:n.find(h=>h.number===parseFloat(e)))||{number:parseFloat(e)};const d=parseFloat(e);if(r._preloadCache&&r._preloadCache.mangaId===t&&r._preloadCache.chapterNum===d)console.log("[Reader] Using preloaded images for chapter",e),r.images=r._preloadCache.images||[],r._preloadCache=null;else{const h=s?`/bookmarks/${t}/chapters/${e}/reader-images?version=${encodeURIComponent(s)}`:`/bookmarks/${t}/chapters/${e}/reader-images`,y=await m.get(h);console.log("[Reader] images loaded, count:",(i=y.images)==null?void 0:i.length),r.images=y.images||[]}try{const h=await m.getChapterSettings(t,e);if(rs(h))is(h);else try{const b=[...r.manga.downloadedChapters||[]].sort((B,T)=>B-T),x=parseFloat(e),E=b.indexOf(x),g=[];if(E!==-1){for(let B=E-1;B>=0;B--)g.push(b[B]);for(let B=E+1;B<b.length;B++)g.push(b[B])}const S=12;for(const B of g.slice(0,S)){const T=await m.getChapterSettings(t,B);if(rs(T)){is(T),console.log("[Reader] Inherited settings from chapter",B);break}}}catch(y){console.warn("Failed to inherit chapter settings",y)}}catch(h){console.warn("Failed to load chapter settings",h)}try{const h=await m.getTrophyPages(t,e);r.trophyPages=h||{}}catch(h){console.warn("Failed to load trophy pages",h)}try{const h=await m.getFavorites();r.allFavorites=h,r.favoriteLists=Object.keys(h.favorites||h||{})}catch(h){console.warn("Failed to load favorites",h)}}if(r.isStreamingMode)r.currentPage=0;else{const l=parseFloat(e),d=(c=(o=r.manga)==null?void 0:o.readingProgress)==null?void 0:c[l];if(d&&d.page<d.totalPages)if(r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.max(0,d.page-1);else{const h=Math.max(0,d.page-1),y=G();let b=0;for(let x=0;x<y.length;x++){const E=y[x],g=Array.isArray(E)?E:E.pages||[];if(g.includes(h)||g[0]>=h){b=x;break}b=x}r.currentPage=b}else r.currentPage=0,r._resumeScrollToPage=d.page-1;else r.currentPage=0}}catch(l){console.error("Error loading chapter:",l),u("Failed to load chapter","error")}if(!r.isStreamingMode){if(r.navigationDirection==="prev"&&r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.max(0,r.images.length-1);else{const l=G();r.currentPage=Math.max(0,l.length-1)}else if(r.navigationDirection==="next-linked"&&r.mode==="manga"&&r.images.length>1)if(r.singlePageMode)r.currentPage=1;else{const l=G();let d=0;for(let h=0;h<l.length;h++){const y=l[h];if((Array.isArray(y)?y:y.pages||[]).includes(1)){d=h;break}}r.currentPage=d}}r.navigationDirection=null,r.lastPageSingle&&!r.isStreamingMode&&await Rs(),r.loading=!1,Ne(),r.isStreamingMode||yn(),r.mode==="webtoon"&&r._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const d=l.querySelectorAll("img");d[r._resumeScrollToPage]&&d[r._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete r._resumeScrollToPage},300)}async function kn(t,e){r._streamAbortController&&r._streamAbortController.abort(),r._streamAbortController=new AbortController;const{signal:s}=r._streamAbortController;try{let a="/api/scrapers/preview-images-stream?";e&&(a+=`scraper=${encodeURIComponent(e)}&`),a+=`url=${encodeURIComponent(t)}`;const n=localStorage.getItem("manga_auth_token"),i={};n&&(i.Authorization=`Bearer ${n}`),console.log("[Reader] Starting stream from:",a);const o=await fetch(a,{headers:i,signal:s});if(!o.ok)throw new Error(`Failed to start stream: ${o.statusText}`);const c=o.body.getReader(),l=new TextDecoder;let d="";for(;;){const{value:h,done:y}=await c.read();if(y||s.aborted)break;d+=l.decode(h,{stream:!0});const b=d.split(`

`);d=b.pop();let x=!1;for(const E of b)if(E.startsWith("data: ")){const g=E.substring(6);try{const S=JSON.parse(g);if(S.type==="metadata")r.manga.title=S.title,r.manga.alias=S.title,Ne();else if(S.type==="image"){const B=`/api/scrapers/proxy-cover?url=${encodeURIComponent(S.url)}`;r.images.push(B),x=!0}else if(S.type==="error")u("Stream error: "+S.message,"error");else if(S.type==="done")break}catch(S){console.error("Parse error for SSE data:",S)}}x&&be()}}catch(a){a.name!=="AbortError"&&(console.error("Preview stream error:",a),u("Stream failed: "+a.message,"error"))}finally{r._streamAbortController&&r._streamAbortController.signal===s&&(r._streamAbortController=null)}}async function $n(t=[]){console.log("[Reader] mount called with params:",t);let[e,s]=t,a=null;if(s&&s.includes("?")){const[i,o]=s.split("?");s=i,a=new URLSearchParams(o).get("version")}if(console.log("[Reader] mangaId:",e,"chapterNum:",s,"urlVersion:",a),!e||!s){q.go("/");return}const n=document.getElementById("app");if(r.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),r.images=[],r.singlePageMode=!1,r._resumeScrollToPage=null,r.nextChapterImage=null,r.nextChapterNum=null,n.innerHTML=Se(),a)await Ce(e,s,decodeURIComponent(a));else try{const i=await m.getBookmark(e),o=i.downloadedVersions||{},c=new Set(i.deletedChapterUrls||[]),l=o[parseFloat(s)];let d=[];if(Array.isArray(l)&&(d=l.filter(h=>!c.has(h))),d.length>1){const h=await bn(d,s);if(h===null){q.go(`/manga/${e}`);return}await Ce(e,s,h)}else d.length===1?await Ce(e,s,d[0]):await Ce(e,s)}catch(i){console.log("[Reader] Error in version check, falling back:",i),await Ce(e,s)}if(n.innerHTML=Se(),console.log("[Reader] render called, loading:",r.loading,"manga:",!!r.manga,"images:",r.images.length),at(),r.mode==="webtoon"&&r._resumeScrollToPage!=null){const i=r._resumeScrollToPage;r._resumeScrollToPage=null,setTimeout(()=>{const o=document.getElementById("reader-content");if(o){const c=o.querySelectorAll("img");c[i]&&c[i].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function En(){console.log("[Reader] unmount called"),r._streamAbortController&&(r._streamAbortController.abort(),r._streamAbortController=null),r.isStreamingMode||(await He(),await ke()),document.body.classList.remove("reader-active"),document.removeEventListener("keydown",Ds),r.manga=null,r.chapter=null,r.images=[],r.loading=!0,r.singlePageMode=!1,r.isStreamingMode=!1,r._resumeScrollToPage=null,r._preloadCache=null}function rs(t){return!!t&&(t.mode!==void 0||t.direction!==void 0||t.firstPageSingle!==void 0||t.lastPageSingle!==void 0||t.singlePageMode!==void 0)}function is(t){t&&(t.mode&&(r.mode=t.mode),t.direction&&(r.direction=t.direction),t.firstPageSingle!==void 0&&(r.firstPageSingle=t.firstPageSingle),t.lastPageSingle!==void 0&&(r.lastPageSingle=t.lastPageSingle),t.singlePageMode!==void 0&&(r.singlePageMode=t.singlePageMode))}async function ke(){if(!(!r.manga||!r.chapter||r.manga.id==="gallery"||r.isStreamingMode)&&!se.isDemo)try{await m.updateChapterSettings(r.manga.id,r.chapter.number,{mode:r.mode,direction:r.direction,firstPageSingle:r.firstPageSingle,lastPageSingle:r.lastPageSingle,singlePageMode:r.singlePageMode})}catch(t){console.error("Failed to save settings:",t)}}async function Ns(t){try{const e=await m.getBookmark(t),s=e.downloadedChapters||[],a=new Set(e.readChapters||[]),n=e.readingProgress||{},i=e.downloadedVersions||{},o=[...s].sort((l,d)=>l-d);let c=null;for(const l of o){const d=n[l];if(d&&d.page<d.totalPages&&!a.has(l)){c=l;break}}if(c===null){for(const l of o)if(!a.has(l)){c=l;break}}if(c===null&&o.length>0&&(c=o[0]),c!==null){const l=i[c]||[],d=Array.isArray(l)?l[0]:l,h=d?`?version=${encodeURIComponent(d)}`:"";q.go(`/read/${t}/${c}${h}`)}else u("No downloaded chapters to read","info")}catch(e){u("Failed to continue reading: "+e.message,"error")}}const Cn={mount:$n,unmount:En,render:Se,continueReading:Ns},Fe=50;let f={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1,offlineChapters:new Set,isAutoOffline:!1,volumesCollapsed:!1};const Fs=t=>`volumes_collapsed_${t}`;function xn(t){var s;const e=localStorage.getItem(Fs(t==null?void 0:t.id));return e!==null?e==="1":(((s=t==null?void 0:t.volumes)==null?void 0:s.length)||0)>8}function Sn(t){if(!(t.autoCheck===!0))return`<button class="btn btn-secondary" id="schedule-btn">${p("alarm-clock")} Schedule</button>`;const s=t.checkSchedule==="weekly"?`${(t.checkDay||"monday").charAt(0).toUpperCase()+(t.checkDay||"monday").slice(1)} ${t.checkTime||"06:00"}`:t.checkSchedule==="daily"?`Daily ${t.checkTime||"06:00"}`:"Every 6h";return`<button class="btn btn-primary" id="schedule-btn">${p("alarm-clock")} ${s}</button>`}function Ln(t){const e=t.autoCheck===!0,s=t.checkSchedule||"daily",a=t.checkDay||"monday",n=t.checkTime||"06:00",i=t.autoDownload||!1;return`
    <div class="modal" id="schedule-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${p("alarm-clock")} Auto-Check Schedule</h2>
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
  `}function It(){var I;if(f.loading)return`
      ${ae()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=f.manga;if(!t)return`
      ${ae()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.chapters||[],a=new Set(t.downloadedChapters||[]),n=new Set(t.readChapters||[]),i=new Set(s.map(k=>k.number)).size,o=new Set(t.excludedChapters||[]),c=new Set(t.deletedChapterUrls||[]),l=t.volumes||[],d=new Set;l.forEach(k=>{(k.chapters||[]).forEach(_=>d.add(_))});let h;f.filter==="hidden"?h=s.filter(k=>o.has(k.number)||c.has(k.url)):h=s.filter(k=>!o.has(k.number)&&!c.has(k.url));const y=h.filter(k=>!d.has(k.number));let b=[];if(f.activeVolume){const k=new Set(f.activeVolume.chapters||[]);b=h.filter(_=>k.has(_.number))}else b=y;const x=new Map;b.forEach(k=>{x.has(k.number)||x.set(k.number,[]),x.get(k.number).push(k)});let E=Array.from(x.entries()).sort((k,_)=>k[0]-_[0]);f.filter==="downloaded"?E=E.filter(([k])=>a.has(k)):f.filter==="not-downloaded"?E=E.filter(([k])=>!a.has(k)):f.filter==="main"?E=E.filter(([k])=>Number.isInteger(k)):f.filter==="extra"&&(E=E.filter(([k])=>!Number.isInteger(k)));const g=Math.max(1,Math.ceil(E.length/Fe));f.currentPage>=g&&(f.currentPage=Math.max(0,g-1));const S=f.currentPage*Fe,T=[...E.slice(S,S+Fe)].reverse(),O=x.size,D=[...x.keys()].filter(k=>a.has(k)).length;n.size;let C="";if(f.activeVolume){const k=f.activeVolume;let _=null;k.local_cover?_=`/api/public/covers/${t.id}/${encodeURIComponent(k.local_cover.split(/[/\\]/).pop())}`:k.cover&&(_=k.cover),C=`
      ${ae()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${_?`<img src="${_}" alt="${k.name}">`:ue("book")}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${t.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${k.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${O} Chapters</span>
                ${D>0?`<span class="meta-item downloaded">${D} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${t.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${f.manageChapters?"Done Managing":`${p("plus")} Add Chapters`}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${k.id}">${p("pencil")} Edit Volume</button>
               </div>
               <div id="anilist-row" style="margin-top: 12px; font-size: 0.9em;"></div>
            </div>
          </div>
      `}else{const k=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover;C=`
        ${ae()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${k?`<img src="${k}" alt="${e}">`:ue("book")}
              </div>
              <div class="manga-detail-info">
                <h1>${e}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${t.website||"Local"}</span>
                  <span class="meta-item" title="${i} distinct chapters across ${((I=t.chapters)==null?void 0:I.length)||0} version rows">${i} Chapters</span>
                  ${a.size>0?`<span class="meta-item downloaded">${a.size} Downloaded</span>`:""}
                  ${n.size>0?`<span class="meta-item">${n.size} Read</span>`:""}
                </div>
                ${(t.artists||[]).length>0||(t.categories||[]).length>0?`
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(t.artists||[]).length>0?`
                    <span class="meta-label">Author:</span>
                    ${t.artists.map(_=>`<a href="#//" class="artist-link" data-artist="${_}">${_}</a>`).join(", ")}
                  `:""}
                  ${(t.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(t.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${t.categories.map(_=>`<span class="tag">${_}</span>`).join("")}
                  `:""}
                </div>
                `:""}
                <div class="manga-detail-actions">
                  <button class="btn btn-primary" id="continue-btn">
                    ${p("play")} ${t.lastReadChapter?"Continue":"Start"} Reading
                  </button>
              <button class="btn btn-secondary" id="download-all-btn">
                ${p("download")} Download All
              </button>
              <button class="btn btn-secondary" id="refresh-btn">${p("refresh-cw")} Refresh</button>
              ${t.website!=="Local"?`<button class="btn btn-secondary" id="quick-check-btn">${p("zap")} Quick Check</button>`:""}
              ${t.website==="Local"?`<button class="btn btn-secondary" id="scan-folder-btn">${p("folder")} Scan Folder</button>`:""}
              <button class="btn btn-secondary " id="auto-offline-btn" title="Auto-save new chapters offline for reading without internet">
                ${p("wifi-off")} Auto-Offline
              </button>
              <button class="btn btn-secondary" id="edit-btn">${p("pencil")} Edit</button>
              ${(t.volumes||[]).length===0?'<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>':""}
              ${Sn(t)}
            </div>
            <div id="anilist-row" style="margin-top: 12px; font-size: 0.9em;"></div>
            ${t.description?`<p class="manga-description">${t.description}</p>`:""}
            ${f.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">${p("package")} CBZ Files (${f.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${f.cbzFiles.map(_=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${_.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${_.chapterNumber?`Chapter ${_.chapterNumber}`:"Unknown chapter"}
                        ${_.isExtracted?` | ${p("check")} Extracted`:""}
                      </div>
                    </div>
                    <button class="btn btn-small ${_.isExtracted?"btn-secondary":"btn-primary"}" 
                            data-cbz-path="${encodeURIComponent(_.path)}" 
                            data-cbz-chapter="${_.chapterNumber||1}"
                            data-cbz-extracted="${_.isExtracted}">
                      ${_.isExtracted?"Re-Extract":"Extract"}
                    </button>
                  </div>
                `).join("")}
              </div>
            </div>
            `:""}
          </div>
        </div>
      `}return`
    ${C}
        
        ${f.activeVolume?f.manageChapters?Tn(t,y):"":Pn(t,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${f.filter==="all"?"active":""}" data-filter="all">
                All (${x.size})
              </button>
              <button class="filter-btn ${f.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${D})
              </button>
              <button class="filter-btn ${f.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${f.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${g>1?os(g):""}
          
          <div class="chapter-list">
            ${T.map(([k,_])=>Mn(k,_,a,n,t)).join("")}
          </div>
          
          ${g>1?os(g):""}
        </div>
      ${An()}
    </div>
  `}function In(){const t=f.manga;if(!t)return"";const e=t.alias||t.title;return`
    <div class="modal" id="delete-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 420px;">
        <div class="modal-header">
          <h2>${p("trash-2")} Delete Manga</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>${e}</strong> from your library?</p>
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
  `}function _n(){const t=f.manga;return t?`
    <div class="modal" id="migrate-source-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
          <h2>${p("refresh-cw")} Change Source</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Current source: <strong>${t.website||"Local"}</strong></p>
          <p class="text-muted" style="font-size: 0.85em; margin-bottom: 12px;">Search for the manga on a different source, or paste a URL directly.</p>
          
          <!-- Search Section -->
          <div class="form-group">
            <label>Search for Manga</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="migrate-search-input" placeholder="Search manga title..." value="${t.alias||t.title}" style="flex: 1;">
              <select id="migrate-search-scraper" style="width: 150px;">
                <option value="comix.to">comix.to</option>
              </select>
              <button class="btn btn-secondary" id="migrate-search-btn">${p("search")} Search</button>
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
          <p class="text-muted" style="font-size: 0.8em;">Current URL: <a href="${t.url}" target="_blank" rel="noopener noreferrer" style="word-break:break-all; color: var(--accent-primary); text-decoration: underline;">${t.url}</a></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-migrate-btn">Migrate Source</button>
        </div>
      </div>
    </div>
  `:""}function Bn(){const t=f.manga;return t?`
    <div class="modal" id="anilist-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h2>${p("link")} Link to AniList</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p class="text-muted" style="font-size: 0.85em; margin-bottom: 12px;">Search AniList for this manga to sync reading progress.</p>

          <!-- Search Section -->
          <div class="form-group">
            <label>Search AniList</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="anilist-search-input" placeholder="Search AniList..." value="${t.alias||t.title}" style="flex: 1;">
              <button class="btn btn-secondary" id="anilist-search-btn">${p("search")} Search</button>
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
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
        </div>
      </div>
    </div>
  `:""}async function Vt(){var s,a,n,i,o;const t=document.getElementById("anilist-row"),e=f.manga;if(!(!t||!e))try{const c=await m.anilistStatus();if(!(c!=null&&c.configured)||!(c!=null&&c.connected)||((s=f.manga)==null?void 0:s.id)!==e.id){t.style.display="none",t.innerHTML="";return}const{mapping:l}=await m.anilistGetMapping(e.id);if(((a=f.manga)==null?void 0:a.id)!==e.id)return;t.style.display="",l?(t.innerHTML=`
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          ${p("link")}
          <span><strong>${l.anilist_title}</strong>${l.media_format?` <span class="text-muted">(${l.media_format})</span>`:""}</span>
          <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.85em;">
            <input type="checkbox" id="anilist-sync-toggle" ${l.sync_enabled==1?"checked":""}> Sync progress
          </label>
          <button class="btn btn-small btn-secondary" id="anilist-unlink-btn">Unlink</button>
        </div>
      `,(i=document.getElementById("anilist-sync-toggle"))==null||i.addEventListener("change",async d=>{try{await m.anilistSetSyncEnabled(e.id,d.target.checked),u(d.target.checked?"AniList sync enabled":"AniList sync disabled","success")}catch(h){d.target.checked=!d.target.checked,u("Failed to update sync: "+h.message,"error")}}),(o=document.getElementById("anilist-unlink-btn"))==null||o.addEventListener("click",async()=>{if(confirm(`Unlink "${l.anilist_title}" from AniList?`))try{await m.anilistUnmap(e.id),u("Unlinked from AniList","success"),Vt()}catch(d){u("Failed to unlink: "+d.message,"error")}})):(t.innerHTML=`
        <div style="display: flex; align-items: center; gap: 8px;">
          ${p("link")}
          <button class="btn btn-small btn-secondary" id="anilist-link-btn">Link to AniList</button>
        </div>
      `,(n=document.getElementById("anilist-link-btn"))==null||n.addEventListener("click",()=>{var d;(d=document.getElementById("anilist-modal"))==null||d.classList.add("open")}))}catch(c){console.warn("Failed to load AniList row:",c),t.style.display="none",t.innerHTML=""}}function An(){var e,s;const t=f.manga;return`
    ${t?Ln(t):""}
    ${Yn()}
    ${In()}
    ${_n()}
    ${Bn()}

    <!-- Edit Manga Modal -->
    <div class="modal" id="edit-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${p("pencil")} Edit Manga</h2>
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
          <button class="btn btn-danger" id="delete-manga-btn" style="margin-right:auto;">${p("trash-2")} Delete</button>
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
  `}function Mn(t,e,s,a,n){var D,C,I,k;const i=s.has(t),o=a.has(t),c=!Number.isInteger(t),l=((D=n.downloadedVersions)==null?void 0:D[t])||[],d=new Set(n.deletedChapterUrls||[]),h=e.filter(_=>f.filter==="hidden"?!0:!d.has(_.url)),y=!!f.activeVolume,b=n.chapterSettings||{},x=y?!0:!!((C=b[t])!=null&&C.locked);let E=h;if(y||x){const _=h.filter(F=>Array.isArray(l)?l.includes(F.url):l===F.url);E=_.length>0?_:h}E.sort((_,F)=>{const Q=Array.isArray(l)?l.includes(_.url):l===_.url;return((Array.isArray(l)?l.includes(F.url):l===F.url)?1:0)-(Q?1:0)});const g=E.length>1,S=(I=E[0])!=null&&I.url?encodeURIComponent(E[0].url):null,B=["chapter-item",i?"downloaded":"",o?"read":"",c?"extra":""].filter(Boolean).join(" "),T=g?`
    <div class="versions-dropdown hidden" id="versions-${t}">
      ${E.map(_=>{const F=encodeURIComponent(_.url),Q=Array.isArray(l)?l.includes(_.url):l===_.url,ee=_.url.startsWith("local://");return`
          <div class="version-row ${Q?"downloaded":""}"
               data-version-url="${F}" data-num="${t}">
            <span class="version-title" style="cursor: pointer; flex: 1;">${_.title||_.releaseGroup||"Version"}${ee?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}</span>
            <div class="version-actions">
              ${Q?`<button class="btn-icon small success" data-action="read-version" data-num="${t}" data-url="${F}">${p("play",{title:"Read"})}</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${t}" data-url="${F}">${p("trash-2",{title:"Delete version"})}</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${t}" data-url="${F}">${p("download",{title:"Download"})}</button>`}
              ${d.has(_.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${t}" data-url="${F}" title="Restore Version">${p("undo-2",{title:"Restore version"})}</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${t}" data-url="${F}" title="Hide Version">${p("eye-off",{title:"Hide version"})}</button>`}
            </div>
          </div>
        `}).join("")}
    </div>
  `:"",O=(n.excludedChapters||[]).includes(t);return`
    <div class="chapter-group" data-chapter="${t}">
      <div class="${B}" data-num="${t}" style="${O?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${t}</span>
        <span class="chapter-title">
          ${E[0]?E[0].title!==`Chapter ${t}`?E[0].title:"":e[0].title}
          ${O?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
        </span>
        ${c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${O?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${t}" title="Restore Chapter">${p("undo-2",{title:"Restore chapter"})}</button>`:y?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${f.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${t}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${x?"locked":""}"
                        data-action="lock" data-num="${t}"
                        title="${x?"Unlock":"Lock"}">
                  ${x?p("lock",{title:"Locked"}):p("lock-open",{title:"Unlocked"})}
                </button>`}
          ${!O&&S?d.has((k=E[0])==null?void 0:k.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${t}" data-url="${S}" title="Unhide Chapter">${p("undo-2",{title:"Unhide chapter"})}</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${t}" data-url="${S}" title="Hide Chapter">${p("eye-off",{title:"Hide chapter"})}</button>`:""}
          <button class="btn-icon small ${o?"success":"muted"}"
                  data-action="read" data-num="${t}"
                  title="${o?"Mark unread":"Mark read"}">
            ${o?p("eye",{title:"Read"}):p("circle",{title:"Unread"})}
          </button>
          ${i?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${t}" data-url="${S}" title="Delete Files">${p("trash-2",{title:"Delete files"})}</button>
         <button class="btn-icon small ${f.offlineChapters.has(t)?"success":""}" data-action="offline-save" data-num="${t}" title="${f.offlineChapters.has(t)?"Remove offline copy":"Save for offline reading"}">
           ${f.offlineChapters.has(t)?p("wifi-off",{title:"Available offline"}):p("hard-drive",{title:"Save offline"})}
         </button>`:`<button class="btn-icon small ${i?"success":""}"
              data-action="download" data-num="${t}"
              title="${i?"Downloaded":"Download"}">
          ${i?p("check",{title:"Downloaded"}):p("download",{title:"Download"})}
        </button>`}
          ${g?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${t}">
              ${h.length} ${p("chevron-down")}
            </button>
          `:""}
        </div>
      </div>
      ${T}
    </div>
  `}function os(t){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${f.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${f.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${f.currentPage+1} of ${t}</span>
      <button class="btn btn-icon" data-page="next" ${f.currentPage>=t-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${f.currentPage>=t-1?"disabled":""}>»</button>
    </div>
  `}function Tn(t,e){return e.length===0?`
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
  `}function Pn(t,e){var o;const s=t.volumes||[];if(s.length===0)return"";const a=s.map(c=>{const l=c.chapters||[],d=l.filter(h=>e.has(h)).length;return`
      <div class="volume-card" data-volume-id="${c.id}">
        <div class="volume-cover">
          ${c.cover?`<img src="${c.cover}" alt="${c.name}">`:ue("book")}
          <div class="volume-badges">
            <span class="badge badge-chapters">${l.length} ch</span>
            ${d>0?`<span class="badge badge-downloaded">${d}</span>`:""}
          </div>
        </div>
        <div class="volume-info">
          <div class="volume-name">${c.name}</div>
        </div>
      </div>
    `}).join(""),n=f.volumesCollapsed,i=s.reduce((c,l)=>c+(l.chapters||[]).filter(d=>e.has(d)).length,0);return`
    <div class="volumes-section${n?" collapsed":""}">
      <div class="volumes-header">
        <button class="volumes-toggle" id="volumes-toggle-btn"
                aria-expanded="${!n}" aria-controls="volumes-grid"
                title="${n?"Expand volumes":"Collapse volumes"}">
          ${p(n?"chevron-down":"chevron-up")}
          <h2>Volumes</h2>
          <span class="volumes-count">${s.length}</span>
          ${n&&i>0?`<span class="badge badge-downloaded">${i} downloaded</span>`:""}
        </button>
        <button class="btn btn-secondary btn-small" id="add-volume-btn">${p("plus")} Add Volume</button>
      </div>
      <div class="volumes-grid" id="volumes-grid">
        ${a||(((o=t.chapters)==null?void 0:o.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function Rn(){var n,i,o,c,l,d,h,y,b,x,E,g,S,B,T,O,D,C,I,k,_,F,Q,ee;const t=document.getElementById("app"),e=f.manga;if(!e)return;(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>q.go("/")),(i=document.getElementById("back-library-btn"))==null||i.addEventListener("click",()=>q.go("/")),t.querySelectorAll(".artist-link").forEach(v=>{v.addEventListener("click",async L=>{L.preventDefault();const A=v.dataset.artist;if(!A)return;localStorage.setItem("library_search",A),localStorage.removeItem("library_artist_filter");let M=null;try{const w=e.website;if(w&&w!=="Local"){const R=(window._scrapersList||(window._scrapersList=(await m.get("/scrapers/list")).scrapers)||[]).find(j=>j.name===w);R&&R.supportsBrowse&&(M=w)}}catch{}M?(localStorage.setItem("library_search_author",A),localStorage.setItem("library_search_author_source",M)):(localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source")),q.go("/")})}),(o=document.getElementById("continue-btn"))==null||o.addEventListener("click",()=>{Ns(e.id)}),(c=document.getElementById("download-all-btn"))==null||c.addEventListener("click",()=>{const v=document.getElementById("download-all-modal");v&&v.classList.add("open")}),(l=document.getElementById("confirm-download-all-btn"))==null||l.addEventListener("click",async()=>{var v;try{u("Queueing downloads...","info");const L=document.getElementsByName("download-version-mode");let A="single";for(const w of L)w.checked&&(A=w.value);(v=document.getElementById("download-all-modal"))==null||v.classList.remove("open");const M=await m.post(`/bookmarks/${e.id}/download`,{all:!0,versionMode:A});M.chaptersCount>0?u(`Download queued: ${M.chaptersCount} versions`,"success"):u("Already have these chapters downloaded","info")}catch(L){u("Failed to download: "+L.message,"error")}}),(d=document.getElementById("check-updates-btn"))==null||d.addEventListener("click",async()=>{try{u("Checking for updates...","info"),await m.post(`/bookmarks/${e.id}/quick-check`),u("Check complete!","success")}catch(v){u("Check failed: "+v.message,"error")}}),(h=document.getElementById("schedule-btn"))==null||h.addEventListener("click",()=>{const v=document.getElementById("schedule-modal");v&&v.classList.add("open")}),(y=document.getElementById("schedule-type"))==null||y.addEventListener("change",v=>{const L=document.getElementById("schedule-day-group");L&&(L.style.display=v.target.value==="weekly"?"":"none")}),(b=document.getElementById("save-schedule-btn"))==null||b.addEventListener("click",async()=>{var v;try{const L=document.getElementById("schedule-type").value,A=document.getElementById("schedule-day").value,M=document.getElementById("schedule-time").value,w=document.getElementById("auto-download-toggle").checked;await m.updateAutoCheckSchedule(e.id,{enabled:!0,schedule:L,day:A,time:M,autoDownload:w}),f.manga.checkSchedule=L,f.manga.checkDay=A,f.manga.checkTime=M,f.manga.autoDownload=w,(v=document.getElementById("schedule-modal"))==null||v.classList.remove("open"),H([e.id]),u("Schedule updated","success")}catch(L){u("Failed to save schedule: "+L.message,"error")}}),(x=document.getElementById("disable-schedule-btn"))==null||x.addEventListener("click",async()=>{var v;try{await m.toggleAutoCheck(e.id,!1),f.manga.autoCheck=!1,f.manga.checkSchedule=null,f.manga.checkDay=null,f.manga.checkTime=null,f.manga.nextCheck=null,(v=document.getElementById("schedule-modal"))==null||v.classList.remove("open"),H([e.id]),u("Auto-check disabled","success")}catch(L){u("Failed to disable: "+L.message,"error")}}),(E=document.getElementById("refresh-btn"))==null||E.addEventListener("click",async()=>{const v=document.getElementById("refresh-btn");try{v.disabled=!0,v.innerHTML=`${p("loader",{spin:!0})} Checking...`,u("Checking for updates...","info"),await m.post(`/bookmarks/${e.id}/check`),await K(e.id),H([e.id]),u("Check complete!","success")}catch(L){u("Check failed: "+L.message,"error"),v&&(v.disabled=!1,v.innerHTML=`${p("refresh-cw")} Refresh`)}}),(g=document.getElementById("scan-folder-btn"))==null||g.addEventListener("click",async()=>{var L,A;const v=document.getElementById("scan-folder-btn");try{v.disabled=!0,v.innerHTML=`${p("loader",{spin:!0})} Scanning...`,u("Scanning folder...","info");const M=await m.scanBookmark(e.id);await K(e.id),H([e.id]);const w=((L=M.addedChapters)==null?void 0:L.length)||0,P=((A=M.removedChapters)==null?void 0:A.length)||0;w>0||P>0?u(`Scan complete: ${w} added, ${P} removed`,"success"):u("Scan complete: No changes","info")}catch(M){u("Scan failed: "+M.message,"error")}finally{v&&(v.disabled=!1,v.innerHTML=`${p("folder")} Scan Folder`)}}),document.querySelectorAll("[data-cbz-path]").forEach(v=>{v.addEventListener("click",async()=>{const L=decodeURIComponent(v.dataset.cbzPath),A=parseInt(v.dataset.cbzChapter)||1,M=v.dataset.cbzExtracted==="true",w=prompt("Enter chapter number for extraction:",String(A));if(!w)return;const P=parseFloat(w);if(isNaN(P)){u("Invalid chapter number","error");return}try{v.disabled=!0,v.textContent="Extracting...",u("Extracting CBZ...","info"),await m.extractCbz(e.id,L,P,{forceReExtract:M}),u("CBZ extracted successfully!","success"),await K(e.id),H([e.id])}catch(R){u("Extract failed: "+R.message,"error")}finally{v.disabled=!1,v.textContent=M?"Re-Extract":"Extract"}})}),(S=document.getElementById("edit-btn"))==null||S.addEventListener("click",async()=>{const v=document.getElementById("edit-manga-modal");if(v){document.getElementById("edit-alias-input").value=e.alias||"",window._selectedCoverPath=null;try{const[L,A]=await Promise.all([m.getAllArtists(),m.getAllCategories()]),M=document.getElementById("artist-list"),w=document.getElementById("category-list");window._allArtists=L,window._allCategories=A,M&&(M.innerHTML=L.map(j=>`<option value="${j}">`).join("")),w&&(w.innerHTML=A.map(j=>`<option value="${j}">`).join(""));const P=document.getElementById("edit-artist-input"),R=document.getElementById("edit-categories-input");P==null||P.addEventListener("input",()=>{const j=P.value.toLowerCase(),N=P.value.lastIndexOf(","),X=P.value.substring(N+1).trim().toLowerCase();if(X.length>0&&window._allArtists){const z=window._allArtists.filter(te=>te.toLowerCase().includes(X));if(M&&z.length>0){const te=N>=0?P.value.substring(0,N+1)+" ":"";M.innerHTML=z.map(oe=>`<option value="${te}${oe}">`).join("")}}}),R==null||R.addEventListener("input",()=>{const j=R.value.lastIndexOf(","),N=R.value.substring(j+1).trim().toLowerCase();if(N.length>0&&window._allCategories){const X=window._allCategories.filter(z=>z.toLowerCase().includes(N));if(w&&X.length>0){const z=j>=0?R.value.substring(0,j+1)+" ":"";w.innerHTML=X.map(te=>`<option value="${z}${te}">`).join("")}}})}catch(L){console.error("Failed to load artists/categories:",L)}v.classList.add("open")}}),(B=document.getElementById("save-manga-btn"))==null||B.addEventListener("click",async()=>{var v;try{const L=document.getElementById("edit-alias-input").value.trim(),A=document.getElementById("edit-artist-input").value.trim(),M=document.getElementById("edit-categories-input").value.trim(),w=A?A.split(",").map(R=>R.trim()).filter(R=>R):[],P=M?M.split(",").map(R=>R.trim()).filter(R=>R):[];await m.updateBookmark(e.id,{alias:L||null}),await m.setBookmarkArtists(e.id,w),await m.setBookmarkCategories(e.id,P),window._selectedCoverPath&&await m.setBookmarkCoverFromImage(e.id,window._selectedCoverPath),f.manga.alias=L||null,f.manga.artists=w,f.manga.categories=P,(v=document.getElementById("edit-manga-modal"))==null||v.classList.remove("open"),H([e.id]),u("Manga updated","success")}catch(L){u("Failed to update: "+L.message,"error")}}),(T=document.getElementById("change-cover-btn"))==null||T.addEventListener("click",async()=>{try{u("Loading images...","info");const v=await m.getFolderImages(e.id);if(v.length===0){u("No images found in manga folder","warning");return}const L=document.createElement("div");L.id="cover-select-modal",L.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",L.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${v.slice(0,50).map(A=>`
              <div class="cover-option" data-path="${A.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(A.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${v.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${v.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(L),document.getElementById("close-cover-modal").addEventListener("click",()=>L.remove()),L.addEventListener("click",A=>{A.target===L&&L.remove()}),L.querySelectorAll(".cover-option").forEach(A=>{A.addEventListener("click",()=>{window._selectedCoverPath=A.dataset.path;const M=document.getElementById("cover-preview");M&&(M.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),L.remove(),u("Cover selected","success")})})}catch(v){u("Failed to load images: "+v.message,"error")}}),(O=document.getElementById("delete-manga-btn"))==null||O.addEventListener("click",()=>{const v=document.getElementById("delete-manga-modal");v&&v.classList.add("open")}),(D=document.getElementById("confirm-delete-manga-btn"))==null||D.addEventListener("click",async()=>{var L,A;const v=((L=document.getElementById("delete-files-toggle"))==null?void 0:L.checked)||!1;try{await m.deleteBookmark(e.id,v),(A=document.getElementById("delete-manga-modal"))==null||A.classList.remove("open"),u("Manga deleted","success"),q.go("/")}catch(M){u("Failed to delete: "+M.message,"error")}}),(C=document.getElementById("quick-check-btn"))==null||C.addEventListener("click",async()=>{const v=document.getElementById("quick-check-btn");try{v.disabled=!0,v.innerHTML=`${p("loader",{spin:!0})} Checking...`,u("Quick checking for updates...","info");const L=await m.post(`/bookmarks/${e.id}/quick-check`);await K(e.id),H([e.id]),L.newChaptersCount>0?u(`Found ${L.newChaptersCount} new chapter(s)!`,"success"):u("No new chapters found","info")}catch(L){u("Quick check failed: "+L.message,"error")}finally{v&&(v.disabled=!1,v.innerHTML=`${p("zap")} Quick Check`)}}),(I=document.getElementById("source-label"))==null||I.addEventListener("click",async()=>{const v=document.getElementById("migrate-source-modal");if(v){v.classList.add("open");const L=document.getElementById("migrate-search-scraper");if(L&&L.options.length<=1)try{const A=await m.get("/scrapers/list");if(A.success){const M=A.scrapers.filter(w=>w.supportsSearch);L.innerHTML='<option value="all">All Sources</option>'+M.map(w=>`<option value="${w.name}">${w.name}</option>`).join(""),L.value="all"}}catch(A){console.warn("Failed to load scrapers:",A)}}});const s=async()=>{var P,R,j;const v=(R=(P=document.getElementById("migrate-search-input"))==null?void 0:P.value)==null?void 0:R.trim(),L=(j=document.getElementById("migrate-search-scraper"))==null?void 0:j.value;if(!v)return;const A=document.getElementById("migrate-search-loading"),M=document.getElementById("migrate-search-results"),w=document.getElementById("migrate-results-grid");A.style.display="block",M.style.display="none";try{const X=(await m.get(`/scrapers/search?q=${encodeURIComponent(v)}&scraper=${encodeURIComponent(L)}`)).results||[];X.length===0?w.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(w.innerHTML=X.map(z=>{var oe;const te=(oe=z.cover)!=null&&oe.startsWith("/covers/")?z.cover:z.cover?`/api/scrapers/proxy-cover?url=${encodeURIComponent(z.cover)}`:"";return`
            <div class="manga-card migrate-result-card" data-url="${z.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${te?Ee(te,"Cover",{kind:"series",self:!0}):ue("series")}
                ${z.chapterCount?`<div class="manga-card-badges"><span class="badge badge-chapters">${z.chapterCount} ch</span></div>`:""}
              </div>
              <div class="manga-card-title" title="${z.title}" style="font-size: 0.8rem; padding: 4px;">${z.title}</div>
            </div>
          `}).join(""),w.querySelectorAll(".migrate-result-card").forEach(z=>{z.addEventListener("click",()=>{var oe;const te=z.dataset.url;document.getElementById("migrate-url-input").value=te,w.querySelectorAll(".migrate-result-card").forEach(ze=>ze.style.outline=""),z.style.outline="2px solid var(--color-primary)",u(`Selected: ${(oe=z.querySelector(".manga-card-title"))==null?void 0:oe.textContent}`,"info")})})),A.style.display="none",M.style.display="block"}catch(N){A.style.display="none",u("Search failed: "+N.message,"error")}};(k=document.getElementById("migrate-search-btn"))==null||k.addEventListener("click",s),(_=document.getElementById("migrate-search-input"))==null||_.addEventListener("keydown",v=>{v.key==="Enter"&&s()}),(F=document.getElementById("confirm-migrate-btn"))==null||F.addEventListener("click",async()=>{var A,M,w;const v=(M=(A=document.getElementById("migrate-url-input"))==null?void 0:A.value)==null?void 0:M.trim();if(!v){u("Please enter a URL","warning");return}const L=document.getElementById("confirm-migrate-btn");try{L.disabled=!0,L.textContent="Migrating...",u("Migrating source...","info");const P=await m.migrateSource(e.id,v);u(`Migrated! ${P.migratedChapters} chapters preserved as local`,"success"),u("Running full check on new source...","info"),await m.post(`/bookmarks/${e.id}/check`),(w=document.getElementById("migrate-source-modal"))==null||w.classList.remove("open"),await K(e.id),H([e.id]),u("Source migration complete!","success")}catch(P){u("Migration failed: "+P.message,"error")}finally{L&&(L.disabled=!1,L.textContent="Migrate Source")}});const a=async()=>{var w,P;const v=(P=(w=document.getElementById("anilist-search-input"))==null?void 0:w.value)==null?void 0:P.trim();if(!v)return;const L=document.getElementById("anilist-search-loading"),A=document.getElementById("anilist-search-results"),M=document.getElementById("anilist-results-list");L.style.display="block",A.style.display="none";try{const j=(await m.anilistSearch(v)).results||[];j.length===0?M.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(M.innerHTML=j.map(N=>{var te,oe,ze,Qt,Wt,Gt,Kt;const X=((te=N.title)==null?void 0:te.romaji)||((oe=N.title)==null?void 0:oe.english)||((ze=N.title)==null?void 0:ze.native)||"Unknown",z=(Qt=N.title)!=null&&Qt.english&&N.title.english!==X?N.title.english:(Wt=N.title)!=null&&Wt.native&&N.title.native!==X?N.title.native:"";return`
            <div style="display: flex; gap: 10px; align-items: center; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 8px;">
              ${(Gt=N.coverImage)!=null&&Gt.medium?`<img src="${N.coverImage.medium}" alt="" style="width: 48px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">`:""}
              <div style="flex: 1; min-width: 0;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${X}"><strong>${X}</strong></div>
                <div class="text-muted" style="font-size: 0.8em;">
                  ${[z,N.format,(Kt=N.startDate)==null?void 0:Kt.year,`${N.chapters??"?"} ch`].filter(Boolean).join(" • ")}
                </div>
              </div>
              <button class="btn btn-small btn-primary anilist-link-result-btn" data-id="${N.id}" data-title="${X.replace(/"/g,"&quot;")}">Link</button>
            </div>
          `}).join(""),M.querySelectorAll(".anilist-link-result-btn").forEach(N=>{N.addEventListener("click",async()=>{var X,z;try{N.disabled=!0,N.textContent="Linking...";const oe=((X=(await m.anilistMap(e.id,Number(N.dataset.id))).mapping)==null?void 0:X.anilist_title)||N.dataset.title;u(`Linked to AniList: ${oe}`,"success"),(z=document.getElementById("anilist-modal"))==null||z.classList.remove("open"),Vt()}catch(te){N.disabled=!1,N.textContent="Link",u("Failed to link: "+te.message,"error")}})})),L.style.display="none",A.style.display="block"}catch(R){L.style.display="none",u("AniList search failed: "+R.message,"error")}};(Q=document.getElementById("anilist-search-btn"))==null||Q.addEventListener("click",a),(ee=document.getElementById("anilist-search-input"))==null||ee.addEventListener("keydown",v=>{v.key==="Enter"&&a()}),t.querySelectorAll(".filter-btn").forEach(v=>{v.addEventListener("click",()=>{f.filter=v.dataset.filter,f.currentPage=0,H([e.id])})}),t.querySelectorAll("[data-page]").forEach(v=>{v.addEventListener("click",()=>{const L=v.dataset.page,A=Math.ceil(f.manga.chapters.length/Fe);switch(L){case"first":f.currentPage=0;break;case"prev":f.currentPage=Math.max(0,f.currentPage-1);break;case"next":f.currentPage=Math.min(A-1,f.currentPage+1);break;case"last":f.currentPage=A-1;break}H([e.id])})}),t.querySelectorAll(".chapter-item").forEach(v=>{v.addEventListener("click",L=>{var w;if(L.target.closest(".chapter-actions"))return;const A=parseFloat(v.dataset.num);if((e.downloadedChapters||[]).includes(A)){const P=((w=e.downloadedVersions)==null?void 0:w[A])||[],R=Array.isArray(P)?P[0]:P;R?q.go(`/read/${e.id}/${A}?version=${encodeURIComponent(R)}`):q.go(`/read/${e.id}/${A}`)}else u("Chapter not downloaded","info")})}),t.querySelectorAll("[data-action]").forEach(v=>{v.addEventListener("click",async L=>{L.stopPropagation();const A=v.dataset.action,M=parseFloat(v.dataset.num),w=v.dataset.url?decodeURIComponent(v.dataset.url):null;switch(A){case"lock":await qn(M);break;case"read":await Dn(M);break;case"download":await Nn(M);break;case"versions":Fn(M);break;case"read-version":q.go(`/read/${e.id}/${M}?version=${encodeURIComponent(w)}`);break;case"download-version":await Un(M,w);break;case"delete-version":await On(M,w);break;case"hide-version":await Vn(M,w);break;case"restore-version":await Hn(M,w);break;case"restore-chapter":await zn(M);break;case"delete-chapter":await jn(M,w);break;case"hide-chapter":await Qn(M,w);break;case"unhide-chapter":await Wn(M,w);break}})}),t.querySelectorAll(".version-row .version-title").forEach(v=>{v.addEventListener("click",L=>{L.stopPropagation();const A=v.closest(".version-row"),M=parseFloat(A.dataset.num),w=A.dataset.versionUrl?decodeURIComponent(A.dataset.versionUrl):null;A.classList.contains("downloaded")&&w?q.go(`/read/${e.id}/${M}?version=${encodeURIComponent(w)}`):u("Version not downloaded yet","info")})}),t.querySelectorAll(".volume-card").forEach(v=>{v.addEventListener("click",()=>{const L=v.dataset.volumeId;q.go(`/manga/${e.id}/volume/${L}`)})}),Jn(t),we(),de.subscribeToManga(e.id)}async function qn(t){var n;const e=f.manga,s=((n=e.chapterSettings)==null?void 0:n[t])||{},a=!s.locked;try{a?await m.lockChapter(e.id,t):await m.unlockChapter(e.id,t),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[t]={...s,locked:a},u(a?"Chapter locked":"Chapter unlocked","success"),H([e.id])}catch(i){u("Failed: "+i.message,"error")}}async function Dn(t){const e=f.manga,s=new Set(e.readChapters||[]),a=s.has(t);try{await m.post(`/bookmarks/${e.id}/chapters/${t}/read`,{isRead:!a}),a?s.delete(t):s.add(t),e.readChapters=[...s],u(a?"Marked unread":"Marked read","success"),H([e.id])}catch(n){u("Failed: "+n.message,"error")}}async function Nn(t){const e=f.manga,s=new Set(e.deletedChapterUrls||[]),a=(e.chapters||[]).find(n=>n.number===t&&!s.has(n.url));try{u(`Downloading chapter ${t}...`,"info"),a?await m.post(`/bookmarks/${e.id}/download-version`,{chapterNumber:t,url:a.url}):await m.post(`/bookmarks/${e.id}/download`,{chapters:[t]}),u("Download queued!","success")}catch(n){u("Failed: "+n.message,"error")}}function Fn(t){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${t}`&&s.classList.add("hidden")});const e=document.getElementById(`versions-${t}`);e&&e.classList.toggle("hidden")}async function Un(t,e){const s=f.manga;try{u("Downloading version...","info"),await m.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:t,url:e}),u("Download queued!","success")}catch(a){u("Failed: "+a.message,"error")}}async function On(t,e){const s=f.manga;try{await m.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),u("Version deleted","success"),await K(s.id),H([s.id])}catch(a){u("Failed: "+a.message,"error")}}async function Vn(t,e){const s=f.manga;try{await m.hideVersion(s.id,t,e),u("Version hidden","success"),await K(s.id),H([s.id])}catch(a){u("Failed: "+a.message,"error")}}async function Hn(t,e){const s=f.manga;try{await m.unhideVersion(s.id,t,e),u("Version restored","success"),await K(s.id),H([s.id])}catch(a){u("Failed to restore version: "+a.message,"error")}}async function zn(t){const e=f.manga;try{await m.unexcludeChapter(e.id,t),u("Chapter restored","success"),await K(e.id),H([e.id])}catch(s){u("Failed to restore chapter: "+s.message,"error")}}async function jn(t,e){const s=f.manga;if(confirm("Delete this chapter's files from disk?"))try{await m.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),u("Chapter files deleted","success"),await K(s.id),H([s.id])}catch(a){u("Failed to delete: "+a.message,"error")}}async function Qn(t,e){const s=f.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await m.hideVersion(s.id,t,e),u("Chapter hidden","success"),await K(s.id),H([s.id])}catch(a){u("Failed to hide chapter: "+a.message,"error")}}async function Wn(t,e){const s=f.manga;try{await m.unhideVersion(s.id,t,e),u("Chapter unhidden","success"),await K(s.id),H([s.id])}catch(a){u("Failed to unhide chapter: "+a.message,"error")}}async function K(t){try{const[e,s]=await Promise.all([m.getBookmark(t),se.isDemo?Promise.resolve([]):ie.loadCategories()]);if(f.manga=e,f.categories=s,f.loading=!1,f.volumesCollapsed=xn(e),e.website==="Local")try{const i=await m.getCbzFiles(t);f.cbzFiles=i||[]}catch(i){console.error("Failed to load CBZ files:",i),f.cbzFiles=[]}else f.cbzFiles=[];const a=new Set((e.chapters||[]).map(i=>i.number)).size,n=Math.ceil(a/Fe);f.currentPage=Math.max(0,n-1),f.activeVolumeId?f.activeVolume=(e.volumes||[]).find(i=>i.id===f.activeVolumeId):f.activeVolume=null}catch{u("Failed to load manga","error"),f.loading=!1}}async function H(t=[]){const[e,s,a]=t;if(!e){q.go("/");return}f.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!f.manga||f.manga.id!==e?(f.loading=!0,f.manga=null,n.innerHTML=It(),await K(e)):f.activeVolumeId?f.activeVolume=(f.manga.volumes||[]).find(i=>i.id===f.activeVolumeId):f.activeVolume=null,n.innerHTML=It(),Rn(),Vt()}function Gn(){f.manga&&de.unsubscribeFromManga(f.manga.id),f.manga=null,f.loading=!0}const Kn={mount:H,unmount:Gn,render:It};function Yn(){return`
    <div class="modal" id="add-volume-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${p("package")} Add New Volume</h2>
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
  `}function Jn(t){const e=f.manga;if(!e)return;const s=t.querySelector("#volumes-toggle-btn");s&&s.addEventListener("click",()=>{f.volumesCollapsed=!f.volumesCollapsed,localStorage.setItem(Fs(e.id),f.volumesCollapsed?"1":"0");const g=t.querySelector(".volumes-section");g==null||g.classList.toggle("collapsed",f.volumesCollapsed),s.setAttribute("aria-expanded",String(!f.volumesCollapsed)),s.title=f.volumesCollapsed?"Expand volumes":"Collapse volumes";const S=s.querySelector("svg");S&&(S.outerHTML=p(f.volumesCollapsed?"chevron-down":"chevron-up"))});const a=t.querySelector("#add-volume-btn"),n=t.querySelector("#add-volume-modal"),i=t.querySelector("#add-volume-submit-btn");a&&n&&a.addEventListener("click",()=>{n.classList.add("open"),t.querySelector("#add-volume-name-input").focus()}),n==null||n.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(g=>{g.addEventListener("click",()=>n.classList.remove("open"))}),i&&i.addEventListener("click",async()=>{const g=t.querySelector("#add-volume-name-input").value.trim();if(!g)return u("Please enter a volume name","error");try{i.disabled=!0,i.textContent="Creating...",await m.createVolume(e.id,g),u("Volume created successfully!","success"),n.classList.remove("open"),t.querySelector("#add-volume-name-input").value="",await K(e.id),H([e.id])}catch(S){u("Failed to create volume: "+S.message,"error")}finally{i.disabled=!1,i.textContent="Create Volume"}});const o=t.querySelector("#manage-chapters-btn");o&&o.addEventListener("click",()=>{f.manageChapters=!f.manageChapters,H([e.id,"volume",f.activeVolumeId])}),t.querySelectorAll(".add-to-vol-btn").forEach(g=>{g.addEventListener("click",async()=>{const S=parseFloat(g.dataset.num),B=f.activeVolume;if(B)try{g.disabled=!0,g.textContent="...";const T=B.chapters||[];if(T.includes(S))return;const O=[...T,S].sort((D,C)=>D-C);await m.updateVolumeChapters(e.id,B.id,O),u(`Chapter ${S} added to volume`,"success"),await K(e.id),H([e.id,"volume",B.id])}catch(T){u("Failed to add chapter: "+T.message,"error"),g.disabled=!1,g.textContent="Add"}})}),t.querySelectorAll(".remove-from-vol-btn").forEach(g=>{g.addEventListener("click",async S=>{S.stopPropagation();const B=parseFloat(g.dataset.num),T=f.activeVolume;if(T)try{g.disabled=!0,g.textContent="...";const D=(T.chapters||[]).filter(C=>C!==B);await m.updateVolumeChapters(e.id,T.id,D),u(`Chapter ${B} removed from volume`,"success"),await K(e.id),H([e.id,"volume",T.id])}catch(O){u("Failed to remove chapter: "+O.message,"error"),g.disabled=!1,g.textContent="×"}})});const c=t.querySelector("#edit-vol-btn"),l=t.querySelector("#edit-volume-modal");c&&l&&c.addEventListener("click",()=>{const g=c.dataset.volId,S=e.volumes.find(B=>B.id===g);S&&(t.querySelector("#volume-name-input").value=S.name,l.dataset.editingVolId=g,l.classList.add("open"))});const d=t.querySelector("#save-volume-btn");d&&d.addEventListener("click",async()=>{const g=l.dataset.editingVolId,S=t.querySelector("#volume-name-input").value.trim();if(!S)return u("Volume name cannot be empty","error");try{await m.renameVolume(e.id,g,S),u("Volume renamed","success"),l.classList.remove("open"),await K(e.id),H([e.id,"volume",g])}catch(B){u(B.message,"error")}});const h=t.querySelector("#delete-volume-btn");h&&h.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const g=l.dataset.editingVolId;try{await m.deleteVolume(e.id,g),u("Volume deleted","success"),l.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch(S){u(S.message,"error")}});const y=t.querySelector("#vol-cover-upload-btn");if(y){let g=document.getElementById("vol-cover-input-hidden");g||(g=document.createElement("input"),g.type="file",g.id="vol-cover-input-hidden",g.accept="image/*",g.style.display="none",document.body.appendChild(g),g.addEventListener("change",async S=>{const B=S.target.files[0];if(!B)return;const T=g.dataset.mangaId,O=g.dataset.volId,D=document.getElementById("vol-cover-upload-btn");if(g.value="",!(!T||!O))try{D&&(D.disabled=!0,D.textContent="Uploading..."),await m.uploadVolumeCover(T,O,B),u("Cover uploaded","success"),await K(T),H([T,"volume",O])}catch(C){u("Upload failed: "+C.message,"error")}finally{D&&(D.disabled=!1,D.innerHTML=`${p("upload")} Upload Image`)}})),y.addEventListener("click",()=>{g.dataset.mangaId=e.id,g.dataset.volId=l.dataset.editingVolId||"",g.click()})}const b=t.querySelector("#vol-cover-selector-btn"),x=t.querySelector("#cover-selector-modal");b&&x&&b.addEventListener("click",async()=>{const g=x.querySelector("#cover-chapter-select");g.innerHTML='<option value="">Select a chapter...</option>';const S=t.querySelector("#edit-volume-modal"),B=S?S.dataset.editingVolId:null;let T=[...e.chapters||[]];if(B){const D=e.volumes.find(C=>C.id===B);if(D&&D.chapters){const C=new Set(D.chapters);T=T.filter(I=>C.has(I.number))}}T.sort((D,C)=>D.number-C.number);const O=new Set;T.forEach(D=>{if(!O.has(D.number)){O.add(D.number);const C=document.createElement("option");C.value=D.number,C.textContent=`Chapter ${D.number}`,g.appendChild(C)}}),T.length>0&&(g.value=T[0].number,ls(e.id,T[0].number)),x.classList.add("open")});const E=t.querySelector("#cover-chapter-select");E&&E.addEventListener("change",g=>{g.target.value&&ls(e.id,g.target.value)}),t.querySelectorAll(".modal-close, .modal-close-btn").forEach(g=>{g.addEventListener("click",()=>{g.closest(".modal").classList.remove("open")})}),t.querySelectorAll(".modal-overlay").forEach(g=>{g.addEventListener("click",()=>{g.closest(".modal").classList.remove("open")})})}async function ls(t,e){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await m.getChapterImages(t,e)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(i=>{const o=document.createElement("div");o.className="cover-grid-item",o.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",o.innerHTML=`<img src="${i}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,o.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=i.split("/").pop();Xn(l,e,c)}),s.appendChild(o)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function Xn(t,e,s){const a=f.manga,n=document.getElementById("edit-volume-modal"),i=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const o=n.dataset.editingVolId;if(!o)throw new Error("No volume selected");await m.setVolumeCoverFromChapter(a.id,o,e,t),u("Volume cover updated","success"),i.classList.remove("open"),n.classList.remove("open"),await K(a.id),H([a.id,"volume",o])}else{await m.setMangaCoverFromChapter(a.id,e,t),u("Series cover updated","success"),i.classList.remove("open"),await K(a.id);const o=window.location.hash.replace("#","");f.activeVolumeId?H([a.id,"volume",f.activeVolumeId]):H([a.id])}}catch(o){u("Failed to set cover: "+o.message,"error")}}let pe={series:null,loading:!0};function Ae(){if(pe.loading)return`
      ${ae("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=pe.series;if(!t)return`
      ${ae("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.entries||[],a=s.reduce((i,o)=>i+(o.chapter_count||0),0);let n=null;if(s.length>0){const i=s[0];i.local_cover&&i.bookmark_id?n=`/api/public/covers/${i.bookmark_id}/${encodeURIComponent(i.local_cover.split(/[/\\]/).pop())}`:i.localCover&&i.bookmark_id?n=`/api/public/covers/${i.bookmark_id}/${encodeURIComponent(i.localCover.split(/[/\\]/).pop())}`:i.cover&&(n=i.cover)}return`
    ${ae("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?Ee(n,e,{kind:"series"}):ue("series")}
          </div>
          <div class="series-detail-info">
            <h1>${e}</h1>
            <div class="series-detail-meta">
              <span class="meta-item">${s.length} Entries</span>
              <span class="meta-item">${a} Total Chapters</span>
            </div>
            <div class="series-detail-actions">
              <button class="btn btn-secondary" id="add-entry-btn">+ Add Entry</button>
              <button class="btn btn-secondary" id="edit-series-btn">${p("pencil")} Edit</button>
              <button class="btn btn-secondary" id="back-library-btn">← Library</button>
            </div>
          </div>
        </div>
        
        <div class="series-entries-section">
          <h2>Entries</h2>
          <div class="series-entries-grid">
            ${s.map((i,o)=>Zn(i,o,s.length)).join("")}
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
  `}function Zn(t,e,s){var i;const a=t.alias||t.title;let n=null;return t.local_cover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.local_cover.split(/[/\\]/).pop())}`:t.localCover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(n=t.cover),`
    <div class="series-entry-card" data-id="${t.bookmark_id}" data-order="${t.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${e+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${t.bookmark_id}" ${e===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${t.bookmark_id}" ${e===s-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?Ee(n,a,{kind:"book"}):ue("book")}
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${t.chapter_count||0} ch</span>
          ${((i=t.downloadedChapters)==null?void 0:i.length)>0?`<span class="badge badge-downloaded">${t.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${t.bookmark_id}" data-entryid="${t.id}" title="Use as series cover">${p("image",{title:"Use as series cover"})}</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${a}</div>
      </div>
    </div>
  `}function lt(){var l,d,h;const t=document.getElementById("app"),e=pe.series;(l=document.getElementById("back-btn"))==null||l.addEventListener("click",()=>q.go("/")),(d=document.getElementById("back-library-btn"))==null||d.addEventListener("click",()=>q.go("/")),t.querySelectorAll(".series-entry-card").forEach(y=>{y.addEventListener("click",b=>{if(b.target.closest("[data-action]"))return;const x=y.dataset.id;q.go(`/manga/${x}`)})}),t.querySelectorAll("[data-action]").forEach(y=>{y.addEventListener("click",async b=>{b.stopPropagation();const x=y.dataset.action,E=y.dataset.id;switch(x){case"move-up":await cs(E,-1);break;case"move-down":await cs(E,1);break;case"set-cover":const g=y.dataset.entryid;await er(g);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),i=document.getElementById("available-bookmarks-list"),o=document.getElementById("confirm-add-entry-btn");let c=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),i&&(i.innerHTML=""),a.classList.add("open");const y=await m.getAvailableBookmarksForSeries();c=y,y.length===0?(n&&(n.placeholder="No available manga found"),o.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),i&&(i.innerHTML=y.map(b=>`<option value="${(b.alias||b.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),o.disabled=!1)}catch{u("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),o.addEventListener("click",async()=>{const y=n?n.value:"",b=c.find(E=>(E.alias||E.title||"")===y);if(!b){u("Please select a valid manga from the list","warning");return}const x=b.id;try{o.disabled=!0,o.textContent="Adding...",await m.addSeriesEntry(e.id,x),u("Manga added to series","success"),a.classList.remove("open"),await ct(e.id),t.innerHTML=Ae(),lt()}catch(E){u("Failed to add manga: "+E.message,"error")}finally{o.disabled=!1,o.textContent="Add to Series"}})),(h=document.getElementById("edit-series-btn"))==null||h.addEventListener("click",()=>{u("Edit series coming soon","info")})}async function cs(t,e){const s=pe.series;if(!s)return;const a=s.entries||[],n=a.findIndex(c=>c.bookmark_id===t);if(n===-1)return;const i=n+e;if(i<0||i>=a.length)return;const o=a.map(c=>c.bookmark_id);[o[n],o[i]]=[o[i],o[n]];try{await m.post(`/series/${s.id}/reorder`,{order:o}),u("Order updated","success"),await ct(s.id);const c=document.getElementById("app");c.innerHTML=Ae(),lt()}catch(c){u("Failed to reorder: "+c.message,"error")}}async function er(t){const e=pe.series;if(e)try{await m.setSeriesCover(e.id,t),u("Series cover updated","success"),await ct(e.id);const s=document.getElementById("app");s.innerHTML=Ae(),lt()}catch(s){u("Failed to set cover: "+s.message,"error")}}async function ct(t){try{const e=await m.get(`/series/${t}`);pe.series=e,pe.loading=!1}catch{u("Failed to load series","error"),pe.loading=!1}}async function tr(t=[]){const[e]=t;if(!e){q.go("/");return}const s=document.getElementById("app");pe.loading=!0,pe.series=null,s.innerHTML=Ae(),await ct(e),s.innerHTML=Ae(),lt()}function sr(){pe.series=null,pe.loading=!0}const ar={mount:tr,unmount:sr,render:Ae},nr={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
            ${ae()}
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
                </div>
            </div>
        `;try{const d=await m.get("/settings")||{},h=document.getElementById("settings-form"),y=document.getElementById("settings-loader");d.theme&&(document.getElementById("theme").value=d.theme),y.style.display="none",h.style.display="",h.addEventListener("submit",async b=>{b.preventDefault();const x=new FormData(h),E={};for(const[g,S]of x.entries())E[g]=S;try{await m.post("/settings/bulk",E),u("Settings saved successfully"),E.theme}catch(g){console.error(g),u("Failed to save settings","error")}})}catch(d){console.error(d),document.getElementById("settings-loader").textContent="Error loading settings"}window.location.hash.includes("anilist=connected")&&u("AniList connected");const s=document.getElementById("anilist-group"),a=document.getElementById("anilist-status"),n=document.getElementById("anilist-connect"),i=document.getElementById("anilist-sync"),o=document.getElementById("anilist-disconnect"),c=document.getElementById("anilist-sync-result"),l=async()=>{s.style.display="block";try{const d=await m.anilistStatus();d.configured?d.connected?(a.textContent=`Connected as ${d.anilistUsername||"AniList user"}.`,n.style.display="none",i.style.display="",o.style.display=""):(a.textContent="Not connected. Link your AniList account to sync reading progress.",n.style.display="",i.style.display="none",o.style.display="none"):(a.textContent="Not configured — set ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET in .env and restart the server.",n.style.display="none",i.style.display="none",o.style.display="none")}catch(d){console.error(d),a.textContent="Failed to load AniList status — is the server running the latest code?"}};n.addEventListener("click",async()=>{try{const{url:d}=await m.anilistAuthUrl();window.location.href=d}catch(d){u(d.message||"Failed to start AniList connection","error")}}),o.addEventListener("click",async()=>{try{await m.anilistDisconnect(),u("AniList disconnected"),l()}catch{u("Failed to disconnect","error")}}),i.addEventListener("click",async()=>{i.disabled=!0,a.textContent="Syncing from AniList…";try{const d=await m.anilistPull();d.updated.length===0?c.textContent="Everything already up to date.":c.innerHTML="<ul>"+d.updated.map(h=>`<li>${h.title} — marked read up to chapter ${h.markedUpTo}</li>`).join("")+"</ul>",u(`AniList sync: ${d.updated.length} manga updated`)}catch(d){c.textContent="",u(d.message||"AniList sync failed","error")}finally{i.disabled=!1,l()}}),l()}},rr={mount:async t=>{const e=document.getElementById("app");if(!se.isAdmin){e.innerHTML=`
                ${ae()}
                <div class="container"><div class="empty-state">Admin access required.</div></div>
            `;return}e.innerHTML=`
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
        `,document.querySelectorAll(".admin-tab").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(a=>a.classList.remove("active")),s.classList.add("active"),document.querySelectorAll(".admin-section").forEach(a=>a.style.display="none"),document.getElementById(`admin-section-${s.dataset.section}`).style.display=""})}),await Promise.all([Ze(),ir(),or()])}};async function Ze(){const t=document.getElementById("admin-section-users");try{const e=await m.listUsers();t.innerHTML=`
            <h2>Users</h2>
            <div class="table-responsive">
                <table class="data-table admin-users-table">
                    <thead>
                        <tr>
                            <th>Username</th><th>Role</th><th>Download</th><th>Edit</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${e.map(s=>{var a;return`
                            <tr data-user-id="${s.id}">
                                <td>${_t(s.username)}${s.id===((a=se.user)==null?void 0:a.id)?' <span class="badge">you</span>':""}</td>
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
        `,t.querySelectorAll("tr[data-user-id]").forEach(s=>{const a=Number(s.dataset.userId),n=async()=>{try{await m.updateUser(a,{role:s.querySelector(".user-role").value,canDownload:s.querySelector(".user-can-download").checked,canEdit:s.querySelector(".user-can-edit").checked}),u("User updated","success")}catch(i){u(i.message,"error"),Ze()}};s.querySelector(".user-role").addEventListener("change",n),s.querySelector(".user-can-download").addEventListener("change",n),s.querySelector(".user-can-edit").addEventListener("change",n),s.querySelector(".user-reset-pw").addEventListener("click",async()=>{const i=prompt("New password for this user:");if(i)try{await m.updateUser(a,{password:i}),u("Password reset","success")}catch(o){u(o.message,"error")}}),s.querySelector(".user-delete").addEventListener("click",async()=>{if(confirm("Delete this user?"))try{await m.deleteUser(a),u("User deleted","success"),Ze()}catch(i){u(i.message,"error")}})}),document.getElementById("add-user-form").addEventListener("submit",async s=>{s.preventDefault();try{await m.createUser({username:document.getElementById("new-username").value.trim(),password:document.getElementById("new-password").value,role:document.getElementById("new-role").value,canDownload:document.getElementById("new-can-download").checked,canEdit:document.getElementById("new-can-edit").checked}),u("User created","success"),Ze()}catch(a){u(a.message,"error")}})}catch(e){console.error(e),t.innerHTML='<div class="error">Failed to load users</div>'}}async function ir(){const t=document.getElementById("admin-section-demo");try{const e=await m.getBookmarks();t.innerHTML=`
            <h2>Demo Content</h2>
            <p class="admin-demo-warning">
                Checked series are visible to <strong>anyone</strong> on the public demo page
                (<code>/demo.html</code>) — no login needed, covers included. Only downloaded
                chapters are readable there. Be deliberate about adult titles.
            </p>
            <input type="search" id="demo-filter" placeholder="Filter series..." class="admin-demo-filter">
            <ul class="admin-demo-list">
                ${e.map(s=>`
                    <li data-title="${_t((s.alias||s.title||"").toLowerCase())}">
                        <label>
                            <input type="checkbox" class="demo-toggle" data-id="${s.id}" ${s.isDemo?"checked":""}>
                            <span>${_t(s.alias||s.title)}</span>
                            <span class="badge">${s.downloadedCount||0} downloaded</span>
                        </label>
                    </li>
                `).join("")}
            </ul>
        `,t.querySelectorAll(".demo-toggle").forEach(s=>{s.addEventListener("change",async()=>{try{await m.toggleDemo(s.dataset.id,s.checked),u(s.checked?"Added to demo":"Removed from demo","success")}catch(a){s.checked=!s.checked,u(a.message,"error")}})}),document.getElementById("demo-filter").addEventListener("input",s=>{const a=s.target.value.toLowerCase();t.querySelectorAll(".admin-demo-list li").forEach(n=>{n.style.display=n.dataset.title.includes(a)?"":"none"})})}catch(e){console.error(e),t.innerHTML='<div class="error">Failed to load bookmarks</div>'}}function _t(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}async function or(){try{const t=await m.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
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
        `,e.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;Bt(n),e.querySelectorAll(".table-link").forEach(i=>i.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(t){console.error(t),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function Bt(t,e=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${t}...</div>`;try{const o=await m.get(`/admin/tables/${t}?page=${e}&limit=50`);if(!o.rows||o.rows.length===0){s.innerHTML=`
                <h2>${t}</h2>
                <div class="empty-state">No records found</div>
            `;return}const c=Object.keys(o.rows[0]);s.innerHTML=`
            <div class="table-header">
                <h2>${t}</h2>
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
                                ${c.map(d=>{const h=l[d];let y=h;return h===null?y='<span class="null">NULL</span>':typeof h=="object"?y=JSON.stringify(h):String(h).length>100&&(y=String(h).substring(0,100)+"..."),`<td>${y}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>Bt(t,e-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>Bt(t,e+1))}catch(i){console.error(i),s.innerHTML=`<div class="error">Failed to load data for ${t}</div>`}}let J={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function lr(t,e){let s=null;if(e.length>0){const n=e[0];if(n.imagePaths&&n.imagePaths.length>0){const i=n.imagePaths[0];let o;typeof i=="string"?o=i:i&&typeof i=="object"&&(o=i.filename||i.path||i.name||i.url,o&&o.includes("/")&&(o=o.split("/").pop()),o&&o.includes("\\")&&(o=o.split("\\").pop())),o&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(o)}`)}}const a=e.reduce((n,i)=>{var o;return n+(((o=i.imagePaths)==null?void 0:o.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${t}">
      <div class="manga-card-cover">
        ${s?Ee(s,t,{kind:"folder"}):ue("folder")}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function cr(t){const e=J.bookmarks.find(s=>s.id===t);return e?e.alias||e.title:t}function dr(t){const e=J.bookmarks.find(s=>s.id===t);if(e&&e.seriesId){const s=J.series.find(a=>a.id===e.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function ur(t,e,s,a=!1){return`
    <div class="manga-card trophy-gallery-card" data-trophy-id="${t}" data-is-series="${a}">
      <div class="manga-card-cover">
        <div class="placeholder trophy-placeholder" data-icon="trophy"></div>
        <div class="manga-card-badges">
            <span class="badge badge-trophy">${p("trophy")} ${s}</span>
            ${a?'<span class="badge badge-series">Series</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function pr(){const t={};console.log("Building trophy groups from:",J.trophyPages);for(const e of Object.keys(J.trophyPages)){const s=J.trophyPages[e];let a=0;for(const[i,o]of Object.entries(s))a+=Object.keys(o).length;if(console.log(`Manga ${e}: ${a} trophies`),a===0)continue;const n=dr(e);if(n)t[n.id]||(t[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),t[n.id].count+=a,t[n.id].mangaIds.push(e);else{const i=cr(e);console.log(`No series for ${e}, using name: ${i}`),t[e]={name:i,isSeries:!1,count:a,mangaIds:[e]}}}return console.log("Trophy groups result:",t),t}function rt(){if(J.loading)return`
      ${ae("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:t,listOrder:e}=J.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${J.activeTab==="galleries"?"active":""}" data-tab="galleries">
        ${p("folder")} Galleries
      </button>
      <button class="tab-btn ${J.activeTab==="trophies"?"active":""}" data-tab="trophies">
        ${p("trophy")} Trophies
      </button>
    </div>
  `;let a="";if(J.activeTab==="galleries")e.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${e.map(i=>{const o=t&&t[i]||[];return lr(i,o)}).join("")}
        </div>
      `;else{const n=pr(),i=Object.keys(n);i.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${i.map(c=>{const l=n[c];return ur(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${ae("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function Us(){we();const t=document.getElementById("app");t.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{J.activeTab=s.dataset.tab,t.innerHTML=rt(),Us()})}),t.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;q.go(`/read/gallery/${encodeURIComponent(a)}`)})}),t.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?q.go(`/read/trophies/series-${a}/🏆`):q.go(`/read/trophies/${a}/🏆`)})})}async function hr(){try{const[t,e,s,a]=await Promise.all([ie.loadFavorites(),m.get("/trophy-pages"),ie.loadBookmarks(),ie.loadSeries()]);J.favorites=t||{favorites:{},listOrder:[]},J.trophyPages=e||{},J.bookmarks=s||[],J.series=a||[],J.loading=!1}catch(t){console.error("Failed to load favorites:",t),u("Failed to load favorites","error"),J.loading=!1}}async function mr(){console.log("[Favorites] mount called"),J.loading=!0;const t=document.getElementById("app");t.innerHTML=rt(),await hr(),console.log("[Favorites] Data loaded, rendering..."),t.innerHTML=rt(),console.log("[Favorites] Calling setupListeners..."),Us(),console.log("[Favorites] setupListeners complete")}function gr(){}const fr={mount:mr,unmount:gr,render:rt};let V={downloads:{},queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,showEmptyChecks:!1,collapsed:{active:!1,scheduled:!1,completed:!1,history:!0}},et=null,re={};function Ht(t){if(!t)return"Never";const e=Date.now()-new Date(t).getTime(),s=Math.floor(e/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function vr(t){if(!t)return"Not scheduled";const e=new Date(t).getTime()-Date.now();if(e<=0)return"Running now...";const s=Math.floor(e/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const i=Math.floor(a/24),o=a%24;return`in ${i}d ${o}h`}function Os(t){switch(t){case"download":return p("download");case"scrape":return p("search");case"scan":return p("folder");default:return p("settings")}}function zt(t){switch(t){case"running":return"var(--color-success)";case"queued":case"pending":return"var(--color-warning)";case"paused":return"var(--color-info)";case"complete":return"var(--color-success)";case"error":case"failed":case"cancelled":return"var(--color-error)";default:return"var(--text-secondary)"}}function jt(t){switch(t){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return t}}function yr(t){return!t||t==="default"?"Default (6h)":t==="daily"?"Daily":t==="weekly"?"Weekly":t}function br(){const t=V.autoCheck;return t?`
    <div class="queue-inline-header">
      <span class="text-muted">${t.enabledCount} monitored · Last: ${Ht(t.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">${p("play")} Run All Now</button>
    </div>
  `:""}function wr(t){const e=t.nextCheck?vr(t.nextCheck):"Not set",s=t.nextCheck&&new Date(t.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${t.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${p("book-open")}</span>
          <div>
            <div class="task-title">${t.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${yr(t.schedule)}${t.schedule==="weekly"&&t.day?` · ${t.day.charAt(0).toUpperCase()+t.day.slice(1)}`:""}${(t.schedule==="daily"||t.schedule==="weekly")&&t.time?` · ${t.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?`${p("alarm-clock")} Due now`:e}</span>
        </div>
      </div>
    </div>
  `}function ds(t,e){const s=e.total>0?Math.round(e.completed/e.total*100):0,a=e.status==="running"||e.status==="queued",n=e.status==="paused";return`
    <div class="queue-card task-card" data-task-id="${t}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${p("download")}</span>
          <div>
            <div class="task-title">${e.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${zt(e.status)}">${jt(e.status)}</div>
          </div>
        </div>
        <div class="task-actions">
          ${a?`<button class="btn btn-sm btn-icon" data-action="pause" data-task="${t}" title="Pause">${p("pause",{title:"Pause"})}</button>`:""}
          ${n?`<button class="btn btn-sm btn-icon" data-action="resume" data-task="${t}" title="Resume">${p("play",{title:"Resume"})}</button>`:""}
          ${a||n?`<button class="btn btn-sm btn-icon btn-danger" data-action="cancel" data-task="${t}" title="Cancel">✕</button>`:""}
        </div>
      </div>
      <div class="queue-card-body">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${s}%"></div>
          <span class="progress-text">${e.completed} / ${e.total} chapters (${s}%)</span>
        </div>
        ${e.current?`<div class="task-current">Currently: Chapter ${e.current}</div>`:""}
        ${e.errors&&e.errors.length>0?`<div class="task-errors">${p("triangle-alert")} ${e.errors.length} error(s)</div>`:""}
      </div>
    </div>
  `}function kr(t){const e=t.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Os(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${zt(t.status)}">${jt(t.status)}</div>
          </div>
        </div>
      </div>
      ${t.started_at?`<div class="queue-card-body"><small>Started: ${Ht(t.started_at)}</small></div>`:""}
    </div>
  `}function $r(t){const e=t.data||{},s=t.result||{};let a="";return t.type==="scrape"?s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${t.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>'):(t.type==="scan"||t.type==="scan-local")&&s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`),`
    <div class="queue-card task-card history-card" data-history-id="${t.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Os(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${zt(t.status)}">${jt(t.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${t.completed_at?`<div class="queue-card-body"><small>Completed: ${Ht(t.completed_at)}</small></div>`:""}
    </div>
  `}function Er(){var c;const t=Object.entries(V.downloads),e=t.filter(([,l])=>l.status!=="complete"),s=t.filter(([,l])=>l.status==="complete"),a=new Set(e.map(([,l])=>l.bookmarkId).filter(Boolean)),n=V.queueTasks.filter(l=>{var d;return!(l.type==="download"&&((d=l.data)!=null&&d.mangaId)&&a.has(l.data.mangaId))}),i=e.length+n.length,o=((c=V.autoCheck)==null?void 0:c.schedules)||[];return`
    ${ae("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>${p("list-checks")} Task Queue</h2>
        ${i>0?`<span class="queue-badge">${i} active</span>`:""}
      </div>

      ${e.length>0||n.length>0?`
        <div class="queue-section ${V.collapsed.active?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${e.map(([l,d])=>ds(l,d)).join("")}
            ${n.map(l=>kr(l)).join("")}
          </div>
        </div>
      `:""}

      ${o.length>0?`
        <div class="queue-section ${V.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${o.length})
            </h3>
            ${br()}
          </div>
          <div class="queue-section-content">
            ${o.map(l=>wr(l)).join("")}
          </div>
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section ${V.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${s.map(([l,d])=>ds(l,d)).join("")}
          </div>
        </div>
      `:""}

      ${V.historyTasks&&V.historyTasks.length>0?(()=>{const l=y=>{if(y.type!=="scrape")return!1;const b=y.result||{};return(y.status==="complete"||y.status==="completed")&&(b.newChaptersCount===0||b.updated===!1)},d=V.historyTasks.filter(l).length,h=V.showEmptyChecks?V.historyTasks:V.historyTasks.filter(y=>!l(y));return`
        <div class="queue-section ${V.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${d>0?`
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${V.showEmptyChecks?"Hide":"Show"} checks with no new chapters">
                    ${V.showEmptyChecks?`${p("chevron-up")} Hide`:`${p("chevron-down")} Show`} empty checks (${d})
                  </button>
                `:""}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  ${p("trash-2")} Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${h.length>0?h.map(y=>$r(y)).join(""):`
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${d>0?`${d} empty check(s) hidden.`:""}</p>
                  </div>
                `}
            </div>
        </div>
      `})():""}

      ${e.length===0&&n.length===0&&s.length===0&&o.length===0&&(!V.historyTasks||V.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">${p("check")}</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function xe(){try{const[t,e,s,a]=await Promise.all([m.getDownloads().catch(()=>({})),m.getQueueTasks().catch(()=>[]),m.getQueueHistory(50).catch(()=>[]),m.getAutoCheckStatus().catch(()=>null)]);V.downloads=t||{},V.queueTasks=e||[],V.historyTasks=s||[],V.autoCheck=a,V.loading=!1}catch(t){console.error("[Queue] Failed to load data:",t),V.loading=!1}}function ge(){const t=document.getElementById("app");t&&(t.innerHTML=Er(),Cr())}function Cr(){we(),document.querySelectorAll("[data-toggle]").forEach(a=>{a.addEventListener("click",n=>{const i=a.dataset.toggle;V.collapsed[i]=!V.collapsed[i],ge()})});const t=document.getElementById("run-autocheck-btn");t&&t.addEventListener("click",async()=>{t.disabled=!0,t.innerHTML=`${p("loader",{spin:!0})} Running...`;try{u("Auto-check started...","info");const a=await m.runAutoCheck();u(`Check complete: ${a.checked} checked, ${a.updated} updated`,"success"),await xe(),ge()}catch(a){u("Auto-check failed: "+a.message,"error"),t.disabled=!1,t.innerHTML=`${p("play")} Run Now`}});const e=document.getElementById("clear-history-btn");e&&e.addEventListener("click",async a=>{if(a.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await m.clearQueueHistory(),u("History cleared","success"),await xe(),ge()}catch(n){u(`Failed to clear history: ${n.message}`,"error")}});const s=document.getElementById("toggle-empty-checks-btn");s&&s.addEventListener("click",a=>{a.stopPropagation(),V.showEmptyChecks=!V.showEmptyChecks,ge()}),document.querySelectorAll(".scheduled-manga-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.mangaId;n&&(window.location.hash=`#/manga/${n}`)})}),document.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const i=a.dataset.action,o=a.dataset.task;try{i==="pause"?(await m.pauseDownload(o),u("Download paused","info")):i==="resume"?(await m.resumeDownload(o),u("Download resumed","info")):i==="cancel"&&confirm("Cancel this download?")&&(await m.cancelDownload(o),u("Download cancelled","info")),await xe(),ge()}catch(c){u(`Action failed: ${c.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.historyId,i=document.getElementById(`task-details-${n}`);i&&i.classList.toggle("hidden")})})}async function xr(){V.loading=!0;const t=document.getElementById("app");t.innerHTML=`
    ${ae("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>${p("list-checks")} Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,we(),await xe(),ge(),et=setInterval(async()=>{await xe(),ge()},5e3),re.downloadProgress=e=>{e.taskId&&V.downloads[e.taskId]&&(Object.assign(V.downloads[e.taskId],e),ge())},re.downloadCompleted=e=>{xe().then(ge)},re.queueUpdated=e=>{xe().then(ge)},de.on(fe.DOWNLOAD_PROGRESS,re.downloadProgress),de.on(fe.DOWNLOAD_COMPLETED,re.downloadCompleted),de.on(fe.QUEUE_UPDATED,re.queueUpdated)}function Sr(){et&&(clearInterval(et),et=null),re.downloadProgress&&de.off(fe.DOWNLOAD_PROGRESS,re.downloadProgress),re.downloadCompleted&&de.off(fe.DOWNLOAD_COMPLETED,re.downloadCompleted),re.queueUpdated&&de.off(fe.QUEUE_UPDATED,re.queueUpdated),re={}}const Lr={mount:xr,unmount:Sr};class Ir{constructor(){this.container=null,this.scrapers=[],this.currentQuery="",this.currentTarget="all",this.isSearching=!1,this.results=[],this.viewMode="main",this.browseScraper=null,this.browseQuery="english",this.browseSort="popular-today",this.browsePage=1,this.browseTotalPages=1,this.isBrowsing=!1,this.browseResults=[],this.previewInfo=null,this.previewImages=[],this.previewIndex=0,this.infoAbortController=null}async mount(e){this.container=document.getElementById("app"),document.body.className="scrapers-mode";const s=new URLSearchParams(window.location.hash.split("?")[1]||""),a=s.get("browse"),n=s.get("q");a&&(this.browseScraper=a,this.viewMode="browse",this.browseQuery=n||this.browseQuery,this.browseSort="popular",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1),this.updateView(),await this.loadScrapers(),this.viewMode==="browse"&&this.browseScraper?this.performBrowse():n&&(this.currentQuery=n,this.updateView(),this.performSearch())}unmount(){this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.container.innerHTML="",document.body.className=""}async loadScrapers(){try{const e=await m.get("/scrapers/list");e.success&&(this.scrapers=e.scrapers,this.updateView())}catch(e){console.error("Failed to load scrapers",e)}}updateView(){this.render(),this.renderScraperList(),(this.results.length>0||this.isSearching)&&this.renderResults(),this.bindEvents()}render(){this.container.innerHTML=`
      ${ae()}
      <div class="view-container scrapers-container" style="${this.viewMode==="main"?"":"display: none;"}">
        <div class="view-header">
          <h1>${p("plug")} Scrapers</h1>
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
               <div class="empty-icon">${p("search-x")}</div>
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
             ${this.browseScraper?this.getDomainIcon(this.browseScraper):p("globe")} Browse: ${this.browseScraper}
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
            <button id="browse-refresh-btn" class="btn btn-secondary" title="Bypass cache and reload fresh results">${p("refresh-cw")} Refresh</button>
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
              <button id="preview-read-btn" class="btn btn-primary" style="background: var(--success);">${p("book-open")} Read Now</button>
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
    `,we()}renderScraperList(){const e=document.getElementById("scraper-cards-list");if(!e)return;if(this.scrapers.length===0){e.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">${p("plug")}</div>
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
              <span class="capability-label">${p("search")} Search</span>
              ${n.canSearch?'<span class="capability-pill capability-yes">✓ Supported</span>':'<span class="capability-pill capability-no">✗ Not available</span>'}
            </div>
            <div class="capability-row">
              <span class="capability-label">${p("plus")} Adding</span>
              <span class="capability-pill capability-yes">✓ Supported</span>
            </div>
            <div class="capability-row">
              <span class="capability-label">${p("book-open")} Browsing</span>
              ${n.canBrowse?'<span class="capability-pill capability-yes">✓ Supported</span>':`<span class="capability-pill capability-soon">${p("traffic-cone")} Coming soon</span>`}
            </div>
          </div>

          <div class="scraper-card-footer">
            <button
              class="btn btn-secondary scraper-search-card-btn"
              data-scraper="${n.name}"
              ${n.canSearch?"":"disabled"}
              title="${n.canSearch?`Search in ${n.name}`:"Search not supported"}"
            >${p("search")} Search</button>
            <button
              class="btn btn-secondary scraper-browse-card-btn"
              data-scraper="${n.name}"
              ${n.canBrowse?"":"disabled"}
              title="${n.canBrowse?`Browse ${n.name}`:"Browsing coming soon"}"
            >${p("book-open")} Browse</button>
          </div>

        </div>
      `);e.innerHTML=a.join("")}getDomainIcon(e){const s=e.toLowerCase();return s.includes("comix")?p("library"):s.includes("mangahere")?p("book-open"):s.includes("nhentai")?p("shield-alert"):s.includes("chained")?p("link"):p("globe")}bindEvents(){const e=document.getElementById("scraper-search-form");e&&e.addEventListener("submit",b=>{b.preventDefault();const x=document.getElementById("scraper-query");x&&x.value.trim()&&(this.currentQuery=x.value.trim(),this.performSearch())});const s=document.getElementById("clear-target-btn");s&&s.addEventListener("click",()=>{this.currentTarget="all",this.updateView();const b=document.getElementById("scraper-query");b&&b.focus()}),document.querySelectorAll(".scraper-search-card-btn").forEach(b=>{b.addEventListener("click",x=>{const E=x.target.dataset.scraper;this.currentTarget=E;const g=document.getElementById("scraper-query");g&&(this.currentQuery=g.value.trim()),this.updateView();const S=document.getElementById("scraper-query");S&&(S.focus(),window.scrollTo({top:0,behavior:"smooth"}),this.currentQuery&&this.performSearch())})}),document.querySelectorAll(".scraper-browse-card-btn").forEach(b=>{b.addEventListener("click",x=>{const E=x.target.dataset.scraper;this.browseScraper=E,this.viewMode="browse",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1,this.updateView(),this.performBrowse()})});const a=document.getElementById("exit-browse-btn");a&&a.addEventListener("click",()=>{this.viewMode="main",this.updateView()});const n=document.getElementById("browse-apply-btn");n&&n.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse()});const i=document.getElementById("browse-refresh-btn");i&&i.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse(!1,!0)});const o=document.getElementById("browse-query");o&&o.addEventListener("keypress",b=>{b.key==="Enter"&&n.click()});const c=document.getElementById("browse-load-more-btn");c&&c.addEventListener("click",()=>{!this.isBrowsing&&this.browsePage<this.browseTotalPages&&(this.browsePage++,this.performBrowse(!0))});const l=document.getElementById("preview-close-btn");l&&l.addEventListener("click",()=>{this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),document.getElementById("preview-info-modal").style.display="none"});const d=document.getElementById("preview-add-btn");d&&d.addEventListener("click",()=>{this.previewInfo&&this.previewInfo.url&&this.openAddModal(this.previewInfo.url,d)});const h=document.getElementById("preview-read-btn");h&&h.addEventListener("click",()=>{h.disabled||(this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.openTempReader())});const y=document.getElementById("temp-reader-close");y&&y.addEventListener("click",()=>{document.getElementById("temp-reader-overlay").style.display="none"})}async performSearch(){const e=document.getElementById("scraper-results-container"),s=document.getElementById("scraper-search-btn");if(!e||!s)return;this.isSearching=!0,e.style.display="block",s.textContent="Searching...",s.disabled=!0;const a=this.currentTarget==="all"?"all sites":this.currentTarget;e.innerHTML=`
      <div class="loading-state" style="margin-top: 2rem;">
        <div class="spinner"></div>
        <p>Searching ${a} for "${this.currentQuery}"...</p>
        <p class="subtitle">This may take a minute...</p>
      </div>
    `;try{const n=await m.get(`/scrapers/search?q=${encodeURIComponent(this.currentQuery)}&scraper=${encodeURIComponent(this.currentTarget)}`);if(n.success)this.results=n.results||[],this.renderResults();else throw new Error(n.error||"Failed to search scrapers")}catch(n){console.error("Search error",n),e.innerHTML=`<div class="error-state" style="margin-top: 2rem;">Failed to perform search: ${n.message}</div>`}finally{this.isSearching=!1,s.textContent="Search",s.disabled=!1}}renderResults(){const e=document.getElementById("scraper-results-container");if(!e)return;if(this.results.length===0){e.innerHTML=`
        <div class="empty-state" style="margin-top: 2rem;">
          <div class="empty-icon">${p("search-x")}</div>
          <p>No results found for "${this.currentQuery}".</p>
        </div>
      `;return}let s='<div class="library-grid" style="margin-top: 2rem;">';this.results.forEach(a=>{const n=a.cover||"";let i="";n.startsWith("/covers/")?i=n:n&&(i=`/api/scrapers/proxy-cover?url=${encodeURIComponent(n)}`);const o=i?Ee(i,"Cover",{kind:"series",self:!0}):ue("series");s+=`
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
      `}),s+="</div>",e.innerHTML=s,setTimeout(()=>{document.querySelectorAll(".scraper-result-card").forEach(a=>{a.addEventListener("click",n=>{n.target.closest(".add-from-search-btn")||window.open(a.dataset.url,"_blank")})}),document.querySelectorAll(".add-from-search-btn").forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation();const i=n.target.dataset.url;this.openAddModal(i,n.target)})})},100)}async _addToLibraryAndWait(e){const s=await m.addBookmark(e);if(!s.jobId)throw new Error("No job ID returned");return new Promise((a,n)=>{const i=setInterval(async()=>{try{const c=(await m.getQueueHistory(20)).find(l=>l.id===s.jobId);c&&(c.status==="completed"?(clearInterval(i),c.result&&c.result.bookmark?a(c.result.bookmark):n(new Error("Job completed but returned no bookmark"))):c.status==="failed"&&(clearInterval(i),n(new Error(c.error))))}catch{}},1e3)})}async openAddModal(e,s){const a=s?s.textContent:"+ Add to Library";s&&(s.textContent="Adding...");try{const n=await this._addToLibraryAndWait(e);document.getElementById("preview-info-modal").style.display="none",window.location.hash=`#/manga/${n.id}`}catch(n){alert("Error adding manga: "+n.message)}finally{s&&(s.textContent=a)}}async performBrowse(e=!1,s=!1){const a=document.getElementById("browse-results-container"),n=document.getElementById("browse-load-more-btn"),i=document.getElementById("browse-loading-indicator"),o=document.getElementById("browse-pagination");if(a){this.isBrowsing=!0,e?(n.style.display="none",i.style.display="block",document.getElementById("browse-loading-page").textContent=this.browsePage):(a.innerHTML=`
        <div class="loading-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="spinner"></div>
          <p>Browsing ${this.browseScraper}...</p>
        </div>
      `,o.style.display="none");try{let c=`/scrapers/browse?scraper=${encodeURIComponent(this.browseScraper)}&q=${encodeURIComponent(this.browseQuery)}&sort=${encodeURIComponent(this.browseSort)}&page=${this.browsePage}`;s&&(c+="&refresh=true");const l=await m.get(c);if(l.success)e?this.browseResults=[...this.browseResults,...l.results||[]]:this.browseResults=l.results||[],this.browseTotalPages=l.totalPages||1,this.renderBrowseResults(e);else throw new Error(l.error||"Failed to browse")}catch(c){console.error("Browse error",c),e?alert("Failed to load more results: "+c.message):a.innerHTML=`<div class="error-state" style="grid-column: 1/-1; margin-top: 2rem;">Failed to load browse results: ${c.message}</div>`}finally{this.isBrowsing=!1,e&&(n.style.display="inline-block",i.style.display="none")}}}renderBrowseResults(e){const s=document.getElementById("browse-results-container"),a=document.getElementById("browse-pagination");if(this.browseResults.length===0){s.innerHTML=`
        <div class="empty-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="empty-icon">${p("search-x")}</div>
          <p>No results found.</p>
        </div>
      `,a.style.display="none";return}let n="";this.browseResults.forEach((i,o)=>{const c=i.cover||"";let l="";c.startsWith("/covers/")?l=c:c&&(l=`/api/scrapers/proxy-cover?url=${encodeURIComponent(c)}`);const d=l?Ee(l,"Cover",{kind:"series",self:!0}):ue("series");n+=`
        <div class="manga-card browse-result-card" data-index="${o}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${d}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${i.website||this.browseScraper}</span>
            </div>
          </div>
          <div class="manga-card-title" title="${i.title}">${i.title}</div>
        </div>
      `}),s.innerHTML=n,this.browsePage<this.browseTotalPages?a.style.display="block":a.style.display="none",setTimeout(()=>{document.querySelectorAll(".browse-result-card").forEach(i=>{i.addEventListener("click",()=>{const o=parseInt(i.dataset.index),c=this.browseResults[o];c&&this.openInfoModal(c)})})},100)}async openInfoModal(e){this.infoAbortController&&this.infoAbortController.abort(),this.infoAbortController=new AbortController;const s=this.infoAbortController.signal,a=document.getElementById("preview-info-modal"),n=document.getElementById("preview-info-body"),i=document.getElementById("preview-read-btn");this.previewInfo=e,a.style.display="flex",n.innerHTML=`
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
         <div style="flex: 0 0 200px; max-width: 100%;">
            <div class="manga-card-cover" style="height: 280px; border-radius: 8px;">
               ${e.cover?`<img src="${e.cover.startsWith("/covers/")?e.cover:"/api/scrapers/proxy-cover?url="+encodeURIComponent(e.cover)}" style="width: 100%; height: 100%; object-fit: cover;">`:ue("series")}
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
    `,this._setReadBtnEnabled(i,!1);try{const o=await m.get(`/scrapers/info?url=${encodeURIComponent(e.url)}`,{signal:s});if(o.success&&o.info){this.previewInfo={...this.previewInfo,...o.info};let c="";o.info.tags&&o.info.tags.length>0&&(c=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Tags</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${o.info.tags.map(d=>`<span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); font-weight: normal; font-size: 0.75rem;">${d}</span>`).join("")}
                 </div>
               </div>
             `);let l="";o.info.artists&&o.info.artists.length>0&&(l=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Artists</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${o.info.artists.map(d=>`<span class="badge badge-chapters">${d}</span>`).join("")}
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
          `,this._setReadBtnEnabled(i,!0)}else document.getElementById("preview-extended-info").innerHTML='<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>',(this.previewInfo.galleryId||this.previewInfo.url)&&this._setReadBtnEnabled(i,!0)}catch(o){if(o.name==="AbortError"||s.aborted){console.log("Scraper details fetch aborted successfully.");return}console.error("Info error:",o),document.getElementById("preview-extended-info").innerHTML=`<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${o.message}</p>`,this._setReadBtnEnabled(i,!0)}}_setReadBtnEnabled(e,s){e&&(e.disabled=!s,e.style.opacity=s?"1":"0.5",e.style.cursor=s?"pointer":"not-allowed",e.style.pointerEvents=s?"auto":"none")}async openTempReader(){if(!this.previewInfo||!this.previewInfo.url&&!this.previewInfo.galleryId)return;const e=this.previewInfo.url||`https://nhentai.net/g/${this.previewInfo.galleryId}/`,s=this.browseScraper||this.previewInfo.website;sessionStorage.setItem("streamPreviewUrl",e),sessionStorage.setItem("streamPreviewTitle",this.previewInfo.title||"Preview"),s?sessionStorage.setItem("streamPreviewScraper",s):sessionStorage.removeItem("streamPreviewScraper"),document.getElementById("preview-info-modal").style.display="none",window.location.hash="#/read/stream/preview"}}const _r=new Ir;class Br{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,s){this.routes.set(e,s)}async navigate(){console.log("[Router] navigate called");const s=(window.location.hash.slice(1)||"/").split("?")[0],[a,...n]=s.split("/").filter(Boolean),i=`/${a||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let o=this.routes.get(i);!o&&this.routes.has("/")&&(o=this.routes.get("/")),o&&(this.currentRoute=i,this.currentView=o,o.mount&&(console.log("[Router] calling mount on view module"),await o.mount(n)),we())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),we())}}const q=new Br;q.register("/",tn);q.register("/manga",Kn);q.register("/read",Cn);q.register("/series",ar);q.register("/settings",nr);q.register("/admin",rr);q.register("/favorites",fr);q.register("/queue",Lr);q.register("/scrapers",_r);export{fe as S,de as a,q as r,Tr as s};
