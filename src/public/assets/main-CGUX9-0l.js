import{a as k}from"./api-KJmMrn3G.js";const Z=Object.create(null);Z.open="0";Z.close="1";Z.ping="2";Z.pong="3";Z.message="4";Z.upgrade="5";Z.noop="6";const Ce=Object.create(null);Object.keys(Z).forEach(t=>{Ce[Z[t]]=t});const je={type:"error",data:"parser error"},St=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Lt=typeof ArrayBuffer=="function",xt=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,it=({type:t,data:e},s,a)=>St&&e instanceof Blob?s?a(e):ft(e,a):Lt&&(e instanceof ArrayBuffer||xt(e))?s?a(e):ft(new Blob([e]),a):a(Z[t]+(e||"")),ft=(t,e)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];e("b"+(a||""))},s.readAsDataURL(t)};function vt(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let Oe;function Zt(t,e){if(St&&t.data instanceof Blob)return t.data.arrayBuffer().then(vt).then(e);if(Lt&&(t.data instanceof ArrayBuffer||xt(t.data)))return e(vt(t.data));it(t,!1,s=>{Oe||(Oe=new TextEncoder),e(Oe.encode(s))})}const yt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",he=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<yt.length;t++)he[yt.charCodeAt(t)]=t;const es=t=>{let e=t.length*.75,s=t.length,a,n=0,o,r,d,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const $=new ArrayBuffer(e),b=new Uint8Array($);for(a=0;a<s;a+=4)o=he[t.charCodeAt(a)],r=he[t.charCodeAt(a+1)],d=he[t.charCodeAt(a+2)],l=he[t.charCodeAt(a+3)],b[n++]=o<<2|r>>4,b[n++]=(r&15)<<4|d>>2,b[n++]=(d&3)<<6|l&63;return $},ts=typeof ArrayBuffer=="function",ot=(t,e)=>{if(typeof t!="string")return{type:"message",data:_t(t,e)};const s=t.charAt(0);return s==="b"?{type:"message",data:ss(t.substring(1),e)}:Ce[s]?t.length>1?{type:Ce[s],data:t.substring(1)}:{type:Ce[s]}:je},ss=(t,e)=>{if(ts){const s=es(t);return _t(s,e)}else return{base64:!0,data:t}},_t=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},It="",as=(t,e)=>{const s=t.length,a=new Array(s);let n=0;t.forEach((o,r)=>{it(o,!1,d=>{a[r]=d,++n===s&&e(a.join(It))})})},ns=(t,e)=>{const s=t.split(It),a=[];for(let n=0;n<s.length;n++){const o=ot(s[n],e);if(a.push(o),o.type==="error")break}return a};function is(){return new TransformStream({transform(t,e){Zt(t,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const o=new DataView(n.buffer);o.setUint8(0,126),o.setUint16(1,a)}else{n=new Uint8Array(9);const o=new DataView(n.buffer);o.setUint8(0,127),o.setBigUint64(1,BigInt(a))}t.data&&typeof t.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(s)})}})}let Ve;function ke(t){return t.reduce((e,s)=>e+s.length,0)}function Ee(t,e){if(t[0].length===e)return t.shift();const s=new Uint8Array(e);let a=0;for(let n=0;n<e;n++)s[n]=t[0][a++],a===t[0].length&&(t.shift(),a=0);return t.length&&a<t[0].length&&(t[0]=t[0].slice(a)),s}function os(t,e){Ve||(Ve=new TextDecoder);const s=[];let a=0,n=-1,o=!1;return new TransformStream({transform(r,d){for(s.push(r);;){if(a===0){if(ke(s)<1)break;const l=Ee(s,1);o=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(ke(s)<2)break;const l=Ee(s,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(ke(s)<8)break;const l=Ee(s,8),$=new DataView(l.buffer,l.byteOffset,l.length),b=$.getUint32(0);if(b>Math.pow(2,21)-1){d.enqueue(je);break}n=b*Math.pow(2,32)+$.getUint32(4),a=3}else{if(ke(s)<n)break;const l=Ee(s,n);d.enqueue(ot(o?l:Ve.decode(l),e)),a=0}if(n===0||n>t){d.enqueue(je);break}}}})}const Bt=4;function F(t){if(t)return rs(t)}function rs(t){for(var e in F.prototype)t[e]=F.prototype[e];return t}F.prototype.on=F.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this};F.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this};F.prototype.off=F.prototype.removeListener=F.prototype.removeAllListeners=F.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+t];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===e||a.fn===e){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+t],this};F.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),s=this._callbacks["$"+t],a=1;a<arguments.length;a++)e[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,e)}return this};F.prototype.emitReserved=F.prototype.emit;F.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};F.prototype.hasListeners=function(t){return!!this.listeners(t).length};const De=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,s)=>s(e,0),Q=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),ls="arraybuffer";function Pt(t,...e){return e.reduce((s,a)=>(t.hasOwnProperty(a)&&(s[a]=t[a]),s),{})}const cs=Q.setTimeout,ds=Q.clearTimeout;function Ne(t,e){e.useNativeTimers?(t.setTimeoutFn=cs.bind(Q),t.clearTimeoutFn=ds.bind(Q)):(t.setTimeoutFn=Q.setTimeout.bind(Q),t.clearTimeoutFn=Q.clearTimeout.bind(Q))}const us=1.33;function hs(t){return typeof t=="string"?ps(t):Math.ceil((t.byteLength||t.size)*us)}function ps(t){let e=0,s=0;for(let a=0,n=t.length;a<n;a++)e=t.charCodeAt(a),e<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(a++,s+=4);return s}function At(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function ms(t){let e="";for(let s in t)t.hasOwnProperty(s)&&(e.length&&(e+="&"),e+=encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e}function gs(t){let e={},s=t.split("&");for(let a=0,n=s.length;a<n;a++){let o=s[a].split("=");e[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}return e}class fs extends Error{constructor(e,s,a){super(e),this.description=s,this.context=a,this.type="TransportError"}}class rt extends F{constructor(e){super(),this.writable=!1,Ne(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,s,a){return super.emitReserved("error",new fs(e,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const s=ot(e,this.socket.binaryType);this.onPacket(s)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,s={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const s=ms(e);return s.length?"?"+s:""}}class vs extends rt{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const s=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};ns(e,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,as(e,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=At()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(e,s)}}let Tt=!1;try{Tt=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const ys=Tt;function bs(){}class ws extends vs{constructor(e){if(super(e),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||a!==e.port}}doWrite(e,s){const a=this.request({method:"POST",data:e});a.on("success",s),a.on("error",(n,o)=>{this.onError("xhr post error",n,o)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=e}}class X extends F{constructor(e,s,a){super(),this.createRequest=e,Ne(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var e;const s=Pt(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=X.requestsCount++,X.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=bs,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete X.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}X.requestsCount=0;X.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",bt);else if(typeof addEventListener=="function"){const t="onpagehide"in Q?"pagehide":"unload";addEventListener(t,bt,!1)}}function bt(){for(let t in X.requests)X.requests.hasOwnProperty(t)&&X.requests[t].abort()}const ks=function(){const t=Mt({xdomain:!1});return t&&t.responseType!==null}();class Es extends ws{constructor(e){super(e);const s=e&&e.forceBase64;this.supportsBinary=ks&&!s}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new X(Mt,this.uri(),e)}}function Mt(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||ys))return new XMLHttpRequest}catch{}if(!e)try{return new Q[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Rt=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class $s extends rt{get name(){return"websocket"}doOpen(){const e=this.uri(),s=this.opts.protocols,a=Rt?{}:Pt(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;it(a,this.supportsBinary,o=>{try{this.doWrite(a,o)}catch{}n&&De(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=At()),this.supportsBinary||(s.b64=1),this.createUri(e,s)}}const Ue=Q.WebSocket||Q.MozWebSocket;class Cs extends $s{createSocket(e,s,a){return Rt?new Ue(e,s,a):s?new Ue(e,s):new Ue(e)}doWrite(e,s){this.ws.send(s)}}class Ss extends rt{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const s=os(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=e.readable.pipeThrough(s).getReader(),n=is();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const o=()=>{a.read().then(({done:d,value:l})=>{d||(this.onPacket(l),o())}).catch(d=>{})};o();const r={type:"open"};this.query.sid&&(r.data=`{"sid":"${this.query.sid}"}`),this._writer.write(r).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;this._writer.write(a).then(()=>{n&&De(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Ls={websocket:Cs,webtransport:Ss,polling:Es},xs=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,_s=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Qe(t){if(t.length>8e3)throw"URI too long";const e=t,s=t.indexOf("["),a=t.indexOf("]");s!=-1&&a!=-1&&(t=t.substring(0,s)+t.substring(s,a).replace(/:/g,";")+t.substring(a,t.length));let n=xs.exec(t||""),o={},r=14;for(;r--;)o[_s[r]]=n[r]||"";return s!=-1&&a!=-1&&(o.source=e,o.host=o.host.substring(1,o.host.length-1).replace(/;/g,":"),o.authority=o.authority.replace("[","").replace("]","").replace(/;/g,":"),o.ipv6uri=!0),o.pathNames=Is(o,o.path),o.queryKey=Bs(o,o.query),o}function Is(t,e){const s=/\/{2,9}/g,a=e.replace(s,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&a.splice(0,1),e.slice(-1)=="/"&&a.splice(a.length-1,1),a}function Bs(t,e){const s={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,o){n&&(s[n]=o)}),s}const We=typeof addEventListener=="function"&&typeof removeEventListener=="function",Se=[];We&&addEventListener("offline",()=>{Se.forEach(t=>t())},!1);class ae extends F{constructor(e,s){if(super(),this.binaryType=ls,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(s=e,e=null),e){const a=Qe(e);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=Qe(s.host).host);Ne(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=gs(this.opts.query)),We&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Se.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const s=Object.assign({},this.opts.query);s.EIO=Bt,s.transport=e,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&ae.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(e);s.open(),this.setTransport(s)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",ae.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=e.data,this._onError(s);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=hs(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,De(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,s,a){return this._sendPacket("message",e,s,a),this}send(e,s,a){return this._sendPacket("message",e,s,a),this}_sendPacket(e,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const o={type:e,data:s,options:a};this.emitReserved("packetCreate",o),this.writeBuffer.push(o),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),e()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():e()}):this.upgrading?a():e()),this}_onError(e){if(ae.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),We&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=Se.indexOf(this._offlineEventListener);a!==-1&&Se.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,s),this.writeBuffer=[],this._prevBufferLen=0}}}ae.protocol=Bt;class Ps extends ae{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let s=this.createTransport(e),a=!1;ae.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",E=>{if(!a)if(E.type==="pong"&&E.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;ae.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(b(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const w=new Error("probe error");w.transport=s.name,this.emitReserved("upgradeError",w)}}))};function o(){a||(a=!0,b(),s.close(),s=null)}const r=E=>{const w=new Error("probe error: "+E);w.transport=s.name,o(),this.emitReserved("upgradeError",w)};function d(){r("transport closed")}function l(){r("socket closed")}function $(E){s&&E.name!==s.name&&o()}const b=()=>{s.removeListener("open",n),s.removeListener("error",r),s.removeListener("close",d),this.off("close",l),this.off("upgrading",$)};s.once("open",n),s.once("error",r),s.once("close",d),this.once("close",l),this.once("upgrading",$),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const s=[];for(let a=0;a<e.length;a++)~this.transports.indexOf(e[a])&&s.push(e[a]);return s}}let As=class extends Ps{constructor(e,s={}){const a=typeof e=="object"?e:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>Ls[n]).filter(n=>!!n)),super(e,a)}};function Ts(t,e="",s){let a=t;s=s||typeof location<"u"&&location,t==null&&(t=s.protocol+"//"+s.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=s.protocol+t:t=s.host+t),/^(https?|wss?):\/\//.test(t)||(typeof s<"u"?t=s.protocol+"//"+t:t="https://"+t),a=Qe(t)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const o=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+o+":"+a.port+e,a.href=a.protocol+"://"+o+(s&&s.port===a.port?"":":"+a.port),a}const Ms=typeof ArrayBuffer=="function",Rs=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Dt=Object.prototype.toString,Ds=typeof Blob=="function"||typeof Blob<"u"&&Dt.call(Blob)==="[object BlobConstructor]",Ns=typeof File=="function"||typeof File<"u"&&Dt.call(File)==="[object FileConstructor]";function lt(t){return Ms&&(t instanceof ArrayBuffer||Rs(t))||Ds&&t instanceof Blob||Ns&&t instanceof File}function Le(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let s=0,a=t.length;s<a;s++)if(Le(t[s]))return!0;return!1}if(lt(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return Le(t.toJSON(),!0);for(const s in t)if(Object.prototype.hasOwnProperty.call(t,s)&&Le(t[s]))return!0;return!1}function qs(t){const e=[],s=t.data,a=t;return a.data=Ge(s,e),a.attachments=e.length,{packet:a,buffers:e}}function Ge(t,e){if(!t)return t;if(lt(t)){const s={_placeholder:!0,num:e.length};return e.push(t),s}else if(Array.isArray(t)){const s=new Array(t.length);for(let a=0;a<t.length;a++)s[a]=Ge(t[a],e);return s}else if(typeof t=="object"&&!(t instanceof Date)){const s={};for(const a in t)Object.prototype.hasOwnProperty.call(t,a)&&(s[a]=Ge(t[a],e));return s}return t}function Fs(t,e){return t.data=Ke(t.data,e),delete t.attachments,t}function Ke(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let s=0;s<t.length;s++)t[s]=Ke(t[s],e);else if(typeof t=="object")for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(t[s]=Ke(t[s],e));return t}const Os=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var A;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(A||(A={}));class Vs{constructor(e){this.replacer=e}encode(e){return(e.type===A.EVENT||e.type===A.ACK)&&Le(e)?this.encodeAsBinary({type:e.type===A.EVENT?A.BINARY_EVENT:A.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let s=""+e.type;return(e.type===A.BINARY_EVENT||e.type===A.BINARY_ACK)&&(s+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(s+=e.nsp+","),e.id!=null&&(s+=e.id),e.data!=null&&(s+=JSON.stringify(e.data,this.replacer)),s}encodeAsBinary(e){const s=qs(e),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class ct extends F{constructor(e){super(),this.reviver=e}add(e){let s;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(e);const a=s.type===A.BINARY_EVENT;a||s.type===A.BINARY_ACK?(s.type=a?A.EVENT:A.ACK,this.reconstructor=new Us(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(lt(e)||e.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(e),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let s=0;const a={type:Number(e.charAt(0))};if(A[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===A.BINARY_EVENT||a.type===A.BINARY_ACK){const o=s+1;for(;e.charAt(++s)!=="-"&&s!=e.length;);const r=e.substring(o,s);if(r!=Number(r)||e.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(r)}if(e.charAt(s+1)==="/"){const o=s+1;for(;++s&&!(e.charAt(s)===","||s===e.length););a.nsp=e.substring(o,s)}else a.nsp="/";const n=e.charAt(s+1);if(n!==""&&Number(n)==n){const o=s+1;for(;++s;){const r=e.charAt(s);if(r==null||Number(r)!=r){--s;break}if(s===e.length)break}a.id=Number(e.substring(o,s+1))}if(e.charAt(++s)){const o=this.tryParse(e.substr(s));if(ct.isPayloadValid(a.type,o))a.data=o;else throw new Error("invalid payload")}return a}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,s){switch(e){case A.CONNECT:return wt(s);case A.DISCONNECT:return s===void 0;case A.CONNECT_ERROR:return typeof s=="string"||wt(s);case A.EVENT:case A.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&Os.indexOf(s[0])===-1);case A.ACK:case A.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Us{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const s=Fs(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function wt(t){return Object.prototype.toString.call(t)==="[object Object]"}const Hs=Object.freeze(Object.defineProperty({__proto__:null,Decoder:ct,Encoder:Vs,get PacketType(){return A}},Symbol.toStringTag,{value:"Module"}));function K(t,e,s){return t.on(e,s),function(){t.off(e,s)}}const zs=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Nt extends F{constructor(e,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[K(e,"open",this.onopen.bind(this)),K(e,"packet",this.onpacket.bind(this)),K(e,"error",this.onerror.bind(this)),K(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...s){var a,n,o;if(zs.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(s.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const r={type:A.EVENT,data:s};if(r.options={},r.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const b=this.ids++,E=s.pop();this._registerAckCallback(b,E),r.id=b}const d=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((o=this.io.engine)===null||o===void 0)&&o._hasPingExpired());return this.flags.volatile&&!d||(l?(this.notifyOutgoingListeners(r),this.packet(r)):this.sendBuffer.push(r)),this.flags={},this}_registerAckCallback(e,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[e]=s;return}const o=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let d=0;d<this.sendBuffer.length;d++)this.sendBuffer[d].id===e&&this.sendBuffer.splice(d,1);s.call(this,new Error("operation has timed out"))},n),r=(...d)=>{this.io.clearTimeoutFn(o),s.apply(this,d)};r.withError=!0,this.acks[e]=r}emitWithAck(e,...s){return new Promise((a,n)=>{const o=(r,d)=>r?n(r):a(d);o.withError=!0,s.push(o),this.emit(e,...s)})}_addToQueue(e){let s;typeof e[e.length-1]=="function"&&(s=e.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...o)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...o)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!e||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:A.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(a=>String(a.id)===e)){const a=this.acks[e];delete this.acks[e],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case A.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case A.EVENT:case A.BINARY_EVENT:this.onevent(e);break;case A.ACK:case A.BINARY_ACK:this.onack(e);break;case A.DISCONNECT:this.ondisconnect();break;case A.CONNECT_ERROR:this.destroy();const a=new Error(e.data.message);a.data=e.data.data,this.emitReserved("connect_error",a);break}}onevent(e){const s=e.data||[];e.id!=null&&s.push(this.ack(e.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:A.ACK,id:e,data:n}))}}onack(e){const s=this.acks[e.id];typeof s=="function"&&(delete this.acks[e.id],s.withError&&e.data.unshift(null),s.apply(this,e.data))}onconnect(e,s){this.id=e,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:A.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,e.data)}}}function ce(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}ce.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),s=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+s:t-s}return Math.min(t,this.max)|0};ce.prototype.reset=function(){this.attempts=0};ce.prototype.setMin=function(t){this.ms=t};ce.prototype.setMax=function(t){this.max=t};ce.prototype.setJitter=function(t){this.jitter=t};class Ye extends F{constructor(e,s){var a;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(s=e,e=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,Ne(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new ce({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=e;const n=s.parser||Hs;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var s;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(s=this.backoff)===null||s===void 0||s.setMin(e),this)}randomizationFactor(e){var s;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(s=this.backoff)===null||s===void 0||s.setJitter(e),this)}reconnectionDelayMax(e){var s;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(s=this.backoff)===null||s===void 0||s.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new As(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=K(s,"open",function(){a.onopen(),e&&e()}),o=d=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",d),e?e(d):this.maybeReconnectOnOpen()},r=K(s,"error",o);if(this._timeout!==!1){const d=this._timeout,l=this.setTimeoutFn(()=>{n(),o(new Error("timeout")),s.close()},d);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(K(e,"ping",this.onping.bind(this)),K(e,"data",this.ondata.bind(this)),K(e,"error",this.onerror.bind(this)),K(e,"close",this.onclose.bind(this)),K(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(s){this.onclose("parse error",s)}}ondecoded(e){De(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,s){let a=this.nsps[e];return a?this._autoConnect&&!a.active&&a.connect():(a=new Nt(this,e,s),this.nsps[e]=a),a}_destroy(e){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(e){const s=this.encoder.encode(e);for(let a=0;a<s.length;a++)this.engine.write(s[a],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const ue={};function xe(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const s=Ts(t,e.path||"/socket.io"),a=s.source,n=s.id,o=s.path,r=ue[n]&&o in ue[n].nsps,d=e.forceNew||e["force new connection"]||e.multiplex===!1||r;let l;return d?l=new Ye(a,e):(ue[n]||(ue[n]=new Ye(a,e)),l=ue[n]),s.query&&!e.query&&(e.query=s.queryKey),l.socket(s.path,e)}Object.assign(xe,{Manager:Ye,Socket:Nt,io:xe,connect:xe});class js{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=xe({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var s;this.subscribedMangas.add(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var s;this.subscribedMangas.delete(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,s){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(s),this.socket&&this.socket.on(e,s)}off(e,s){this.listeners.has(e)&&this.listeners.get(e).delete(s),this.socket&&this.socket.off(e,s)}emit(e,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(e,s)}}const O={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone"},M=new js,z={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},Y=new Set,N=new Map,pe=new Map;function Qs(t){return z[t]}function Ws(t,e){z[t]=e,Y.add(t),be(t)}function Gs(t,e){return pe.has(t)||pe.set(t,new Set),pe.get(t).add(e),()=>{var s;return(s=pe.get(t))==null?void 0:s.delete(e)}}function be(t){const e=pe.get(t);e&&e.forEach(s=>s(z[t]))}function me(t){Y.delete(t),N.delete(t)}function Ks(t){return Y.has(t)}async function ge(t=!1){if(!t&&Y.has("bookmarks"))return z.bookmarks;if(N.has("bookmarks"))return N.get("bookmarks");const e=k.getBookmarks().then(s=>(z.bookmarks=s||[],Y.add("bookmarks"),N.delete("bookmarks"),be("bookmarks"),z.bookmarks)).catch(s=>{throw N.delete("bookmarks"),s});return N.set("bookmarks",e),e}async function Ys(t=!1){if(!t&&Y.has("series"))return z.series;if(N.has("series"))return N.get("series");const e=k.get("/series").then(s=>(z.series=s||[],Y.add("series"),N.delete("series"),be("series"),z.series)).catch(s=>{throw N.delete("series"),s});return N.set("series",e),e}async function Js(t=!1){if(!t&&Y.has("categories"))return z.categories;if(N.has("categories"))return N.get("categories");const e=k.get("/categories").then(s=>(z.categories=s.categories||[],Y.add("categories"),N.delete("categories"),be("categories"),z.categories)).catch(s=>{throw N.delete("categories"),s});return N.set("categories",e),e}async function Xs(t=!1){if(!t&&Y.has("favorites"))return z.favorites;if(N.has("favorites"))return N.get("favorites");const e=k.getFavorites().then(s=>(z.favorites=s||{favorites:{},listOrder:[]},Y.add("favorites"),N.delete("favorites"),be("favorites"),z.favorites)).catch(s=>{throw N.delete("favorites"),s});return N.set("favorites",e),e}function Zs(){M.on(O.MANGA_UPDATED,()=>{me("bookmarks"),ge(!0)}),M.on(O.MANGA_ADDED,()=>{me("bookmarks"),ge(!0)}),M.on(O.MANGA_DELETED,()=>{me("bookmarks"),ge(!0)}),M.on(O.DOWNLOAD_COMPLETED,()=>{me("bookmarks"),ge(!0)})}Zs();const J={get:Qs,set:Ws,subscribe:Gs,invalidate:me,isLoaded:Ks,loadBookmarks:ge,loadSeries:Ys,loadCategories:Js,loadFavorites:Xs};function u(t,e="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=t,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}async function ea(t,e,s){try{t&&(t.disabled=!0,t.textContent="Scanning..."),e&&(e.textContent="Scanning..."),u("Scanning downloads folder...","info");const n=(await k.scanLibrary()).found||[];if(n.length===0){u("Scan complete: No new manga found","info"),s&&s();return}ta(n,s)}catch(a){u("Scan failed: "+a.message,"error")}finally{t&&(t.disabled=!1,t.textContent="📁 Scan Folder"),e&&(e.textContent="📁 Scan Folder")}}async function ta(t,e){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),o=Array.from(n).map(l=>l.dataset.folder);if(o.length===0){u("No folders selected","warning");return}const r=document.getElementById("import-all-btn");r.disabled=!0,r.textContent="Importing...";let d=0;for(const l of o)try{await k.importLocalManga(l),d++}catch($){console.error("Failed to import",l,$)}s.remove(),u(`Imported ${d} manga`,"success"),e&&e()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function W(t="manga"){return`
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
  `}function ne(){const t=document.getElementById("hamburger-btn"),e=document.getElementById("mobile-menu");t&&e&&t.addEventListener("click",()=>{e.classList.toggle("hidden")});const s=document.getElementById("logout-btn"),a=document.getElementById("mobile-logout-btn"),n=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};s&&s.addEventListener("click",n),a&&a.addEventListener("click",n),document.querySelectorAll("[data-view]").forEach(w=>{w.addEventListener("click",()=>{const v=w.dataset.view;localStorage.setItem("library_view_mode",v),document.querySelectorAll("[data-view]").forEach(h=>{h.classList.toggle("active",h.dataset.view===v)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:v}}))})});const o=document.querySelector(".logo");o&&o.addEventListener("click",w=>{localStorage.removeItem("library_active_category"),window.dispatchEvent(new CustomEvent("clearFilters"))});const r=document.getElementById("favorites-btn"),d=document.getElementById("mobile-favorites-btn"),l=w=>{w.preventDefault(),B.go("/favorites")};r&&r.addEventListener("click",l),d&&d.addEventListener("click",l);const $=document.getElementById("queue-nav-btn");$&&$.addEventListener("click",w=>{w.preventDefault(),B.go("/queue")});const b=document.getElementById("scan-btn"),E=document.getElementById("mobile-scan-btn");if(b||E){const w=()=>{ea(b,E,async()=>{await J.loadBookmarks(!0),B.reload()})};b&&b.addEventListener("click",w),E&&E.addEventListener("click",w)}}let S={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0},Pe=[];function dt(t){return[...t].sort((e,s)=>{var a,n;switch(S.sortBy){case"az":return(e.alias||e.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(e.alias||e.title);case"lastread":return(s.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const o=((a=e.chapters)==null?void 0:a.length)||e.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-o}case"updated":default:return(s.updatedAt||"").localeCompare(e.updatedAt||"")}})}function ut(t){var b,E,w;const e=t.alias||t.title,s=t.downloadedCount??((b=t.downloadedChapters)==null?void 0:b.length)??0,a=new Set(t.excludedChapters||[]),n=(t.chapters||[]).filter(v=>!a.has(v.number)),o=new Set(n.map(v=>v.number)).size||t.uniqueChapters||0,r=t.readCount??((E=t.readChapters)==null?void 0:E.length)??0,d=(t.updatedCount??((w=t.updatedChapters)==null?void 0:w.length)??0)>0,l=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover,$=t.source==="local";return`
    <div class="manga-card" data-id="${t.id}">
      <div class="manga-card-cover">
        ${l?`<img src="${l}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:`<div class="placeholder">${$?"💾":"📚"}</div>`}
        <div class="manga-card-badges">
          ${r>0?`<span class="badge badge-read" title="Read">${r}</span>`:""}
          <span class="badge badge-chapters" title="Total">${o}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${d?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${t.autoCheck?'<span class="badge badge-monitored" title="Auto-check enabled">⏰</span>':""}
          ${S.activeCategory==="Favorites"?'<span class="badge badge-play" title="Click to Read">▶</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function ht(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function sa(t){var n;const e=t.alias||t.title,s=((n=t.entries)==null?void 0:n.length)||t.entry_count||0;let a=null;return t.localCover&&t.coverBookmarkId?a=`/api/public/covers/${t.coverBookmarkId}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(a=t.cover),`
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
  `}function Ae(){const t=localStorage.getItem("library_view_mode");if(t&&t!==S.viewMode&&(S.viewMode=t),S.activeCategory==="Favorites")return B.go("/favorites"),"";let e="";if(S.viewMode==="series"){const s=S.series.map(sa).join("");e=`
      <div class="library-grid" id="library-grid">
        ${S.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{let s=S.activeCategory?S.bookmarks.filter(n=>(n.categories||[]).includes(S.activeCategory)):S.bookmarks;if(S.artistFilter&&(s=s.filter(n=>(n.artists||[]).includes(S.artistFilter))),S.searchQuery){const n=S.searchQuery.toLowerCase();s=s.filter(o=>(o.title||"").toLowerCase().includes(n)||(o.alias||"").toLowerCase().includes(n)||(o.artists||[]).some(r=>r.toLowerCase().includes(n)))}s=dt(s);const a=s.map(ut).join("");e=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" id="library-search" placeholder="Search manga or author..." value="${S.searchQuery}" autocomplete="off">
          ${S.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${S.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${S.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${S.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${S.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${S.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
      </div>
      ${S.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">🎨</span>
          <span class="artist-filter-name">${S.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${S.loading?'<div class="loading-spinner"></div>':a||ht()}
      </div>
    `}return`
    ${W(S.viewMode)}
    <div class="container">
      ${e}
    </div>
    ${aa()}
    ${na()}
    ${ia()}
  `}function aa(){const{activeCategory:t}=S,e=Array.isArray(S.categories)?S.categories:[];return`
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
      `}function na(){return`
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
      `}function ia(){return`
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
      `}function Je(){S.activeCategory=null,S.artistFilter=null,S.searchQuery="",localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),te()}async function Xe(t){const e=t.target.closest(".manga-card");if(e){if(e.classList.contains("gallery-card")){const n=e.dataset.gallery;B.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=e.dataset.id,a=e.dataset.seriesId;if(a){B.go(`/series/${a}`);return}if(s){if(S.activeCategory==="Favorites"){const n=S.bookmarks.find(o=>o.id===s);if(n){let o=n.last_read_chapter;if(!o&&n.chapters&&n.chapters.length>0&&(o=[...n.chapters].sort((d,l)=>d.number-l.number)[0].number),o){B.go(`/read/${s}/${o}`);return}else u("No chapters available to read","warning")}}B.go(`/manga/${s}`)}}}function qt(){const t=document.getElementById("app");t.removeEventListener("click",Xe),t.addEventListener("click",Xe),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",c=>{S.viewMode=c.detail.mode;const C=document.getElementById("app");C.innerHTML=Ae(),qt(),ne()}));const e=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");e&&s&&(e.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",c=>{const C=c.target.closest(".category-menu-item");if(C){const _=C.dataset.category||null;oa(_),s.classList.add("hidden")}}));const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{S.artistFilter=null,te()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",c=>{var _;S.searchQuery=c.target.value,localStorage.setItem("library_search",c.target.value);const C=document.getElementById("library-grid");if(C){let P=S.activeCategory?S.bookmarks.filter(H=>(H.categories||[]).includes(S.activeCategory)):S.bookmarks;if(S.artistFilter&&(P=P.filter(H=>(H.artists||[]).includes(S.artistFilter))),S.searchQuery){const H=S.searchQuery.toLowerCase();P=P.filter(ee=>(ee.title||"").toLowerCase().includes(H)||(ee.alias||"").toLowerCase().includes(H))}P=dt(P),C.innerHTML=P.map(ut).join("")||ht();const R=document.getElementById("search-clear");!R&&S.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(_=document.getElementById("search-clear"))==null||_.addEventListener("click",()=>{S.searchQuery="",localStorage.removeItem("library_search"),n.value="",te()})):R&&!S.searchQuery&&R.remove()}}),S.searchQuery&&n.focus());const o=document.getElementById("search-clear");o&&o.addEventListener("click",()=>{S.searchQuery="",te()});const r=document.getElementById("library-sort");r&&r.addEventListener("change",c=>{S.sortBy=c.target.value,localStorage.setItem("library_sort",S.sortBy),te()}),window.removeEventListener("clearFilters",Je),window.addEventListener("clearFilters",Je);const d=document.getElementById("add-manga-btn"),l=document.getElementById("add-modal"),$=document.getElementById("add-modal-close"),b=document.getElementById("add-modal-cancel"),E=document.getElementById("add-modal-submit");d&&l&&d.addEventListener("click",()=>l.classList.add("open")),$&&$.addEventListener("click",()=>l.classList.remove("open")),b&&b.addEventListener("click",()=>l.classList.remove("open")),E&&E.addEventListener("click",async()=>{const c=document.getElementById("manga-url"),C=c.value.trim();if(!C){u("Please enter a URL","error");return}try{E.disabled=!0,E.textContent="Adding...",await k.addBookmark(C),u("Manga added successfully!","success"),l.classList.remove("open"),c.value="",await Ze(),te()}catch(_){u("Failed to add manga: "+_.message,"error")}finally{E.disabled=!1,E.textContent="Add"}});const w=document.getElementById("add-series-btn"),v=document.getElementById("mobile-add-series-btn"),h=document.getElementById("add-series-modal"),L=document.getElementById("add-series-modal-close"),I=document.getElementById("add-series-modal-cancel"),x=document.getElementById("add-series-modal-submit");if((w||v)&&h){const c=()=>h.classList.add("open");w&&w.addEventListener("click",c),v&&v.addEventListener("click",c)}L&&L.addEventListener("click",()=>h.classList.remove("open")),I&&I.addEventListener("click",()=>h.classList.remove("open")),x&&x.addEventListener("click",async()=>{const c=document.getElementById("series-title"),C=document.getElementById("series-alias"),_=c.value.trim(),P=C.value.trim();if(!_){u("Please enter a title","error");return}try{x.disabled=!0,x.textContent="Creating...",await k.createSeries(_,P),u("Series created successfully!","success"),h.classList.remove("open"),c.value="",C.value="",await Ze(!0),te()}catch(R){u("Failed to create series: "+R.message,"error")}finally{x.disabled=!1,x.textContent="Create"}});const g=h==null?void 0:h.querySelector(".modal-overlay");g&&g.addEventListener("click",()=>h.classList.remove("open"));const y=document.getElementById("empty-add-btn");y&&l&&y.addEventListener("click",()=>l.classList.add("open"));const p=document.getElementById("empty-add-series-btn");p&&h&&p.addEventListener("click",()=>h.classList.add("open"));const m=l==null?void 0:l.querySelector(".modal-overlay");m&&m.addEventListener("click",()=>l.classList.remove("open")),ne()}function oa(t){S.activeCategory=t,t?localStorage.setItem("library_active_category",t):localStorage.removeItem("library_active_category"),te()}async function Ze(t=!1){try{const[e,s,a,n]=await Promise.all([J.loadBookmarks(t),J.loadCategories(t),J.loadSeries(t),J.loadFavorites(t)]);S.bookmarks=e,S.categories=s,S.series=a,S.favorites=n,S.loading=!1}catch{u("Failed to load library","error"),S.loading=!1}}async function te(){const t=document.getElementById("app"),e=localStorage.getItem("library_active_category");S.activeCategory!==e&&(S.activeCategory=e);const s=localStorage.getItem("library_artist_filter");s&&S.artistFilter!==s&&(S.artistFilter=s),S.loading&&(t.innerHTML=Ae()),S.bookmarks.length===0&&S.loading&&await Ze(),t.innerHTML=Ae(),qt(),Pe.forEach(a=>a()),Pe=[J.subscribe("bookmarks",a=>{S.bookmarks=a;const n=document.getElementById("library-grid");if(n){let o=S.activeCategory?S.bookmarks.filter(r=>(r.categories||[]).includes(S.activeCategory)):S.bookmarks;if(S.artistFilter&&(o=o.filter(r=>(r.artists||[]).includes(S.artistFilter))),S.searchQuery){const r=S.searchQuery.toLowerCase();o=o.filter(d=>(d.title||"").toLowerCase().includes(r)||(d.alias||"").toLowerCase().includes(r))}o=dt(o),n.innerHTML=o.map(ut).join("")||ht()}})]}function ra(){const t=document.getElementById("app");t&&t.removeEventListener("click",Xe),window.removeEventListener("clearFilters",Je),Pe.forEach(e=>e()),Pe=[]}const la={mount:te,unmount:ra,render:Ae};let i={manga:null,chapter:null,images:[],trophyPages:{},mode:"webtoon",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!1,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null};function Ft(){if(!i.manga||!i.chapter||!i.allFavorites||!i.allFavorites.favorites)return!1;if(i.isCollectionMode)return!0;let e=[tt()];if(i.mode==="manga"&&!i.singlePageMode){const n=q()[i.currentPage];n&&Array.isArray(n)?e=n:n&&n.pages&&(e=n.pages)}const s=e.map(a=>{const n=ye(i.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in i.allFavorites.favorites){const n=i.allFavorites.favorites[a];if(Array.isArray(n)){for(const o of n)if(o.mangaId===i.manga.id&&o.chapterNum===i.chapter.number&&o.imagePaths)for(const r of o.imagePaths){const d=typeof r=="string"?r:(r==null?void 0:r.filename)||(r==null?void 0:r.path);for(const l of s)if(l&&l.filename===d)return!0}}}return!1}function et(){const t=document.getElementById("favorites-btn");t&&(Ft()?t.classList.add("active"):t.classList.remove("active"))}function oe(){var $;if(i.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!i.manga||!i.images.length)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const t=i.manga.alias||i.manga.title,e=($=i.chapter)==null?void 0:$.number,a=q().length,n=i.images.length;let o,r;i.mode==="webtoon"?(o=n-1,r=`${n} pages`):i.singlePageMode?(o=n-1,r=`${i.currentPage+1} / ${n}`):(o=a-1,r=`${i.currentPage+1} / ${a}`);const d=Ft(),l=Ht();return`
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
          <button class="reader-bar-btn ${d?"active":""}" id="favorites-btn" title="Add to favorites">⭐</button>
          
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
            <button class="reader-bar-btn ${l?"active":""}" id="trophy-btn" title="${l?"Unmark trophy":"Mark as trophy"}">🏆</button>
          `:""}
          <button class="reader-bar-btn" id="fullscreen-btn" title="Toggle fullscreen">⛶</button>
          <button class="reader-bar-btn" id="reader-settings-btn" title="Settings">⚙️</button>
        </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${i.mode==="webtoon"?`zoom: ${i.zoom}%`:""}">
        ${i.isCollectionMode?Ot():i.mode==="webtoon"?Vt():Ut()}
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
  `}function Ot(){const t=i.mode==="manga";if(t&&!i.singlePageMode){const e=i.images[i.currentPage];if(!e)return"";const s=e.urls||[e.url],a=e.displayMode||"single";return e.displaySide,a==="double"&&s.length>=2?`
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
  `}function Vt(){return`
    <div class="webtoon-pages">
      ${i.images.map((t,e)=>{const s=typeof t=="string"?t:t.url,a=i.trophyPages[e];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${e}">
          ${a?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${s}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function Ut(){if(i.singlePageMode)return ca();const e=q()[i.currentPage];if(!e)return"";if(e.type==="link"){const s=e.pages[0],a=i.images[s],n=typeof a=="string"?a:a.url,o=i.trophyPages[s];return`
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
  `}function ca(){const t=i.currentPage,e=i.trophyPages[t];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[o,r]=e.pages,d=i.images[o],l=i.images[r],$=typeof d=="string"?d:d==null?void 0:d.url,b=typeof l=="string"?l:l==null?void 0:l.url;if($&&b)return`
            <div class="manga-spread ${i.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${$}" alt="Page ${o+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${b}" alt="Page ${r+1}"></div>
            </div>
            `}const s=i.images[t];if(!s)return"";const a=typeof s=="string"?s:s.url,n=i.trophyPages[t];return`
    <div class="manga-spread single ${i.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?'<div class="trophy-indicator">🏆</div>':""}
        <img src="${a}" alt="Page ${t+1}">
      </div>
    </div>
  `}function q(){const t=[],e=i.images.length;let s=0;if(i.isCollectionMode){for(let n=0;n<e;n++)t.push([n]);return t}let a=!i.firstPageSingle;for(;s<e;){const n=i.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[o,r]=n.pages;t.push([o,r]),s=Math.max(o,r)+1}else t.push([s]),s++;continue}if(!a){a=!0,t.push([s]),s++;continue}if(i.lastPageSingle&&s===e-1){i.nextChapterImage?t.push({type:"link",pages:[s],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):t.push([s]),s++;break}s+1<e?i.trophyPages[s+1]?(t.push([s]),s++):i.lastPageSingle&&s+1===e-1?(t.push([s]),i.nextChapterImage?t.push({type:"link",pages:[s+1],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):t.push([s+1]),s+=2):(t.push([s,s+1]),s+=2):(t.push([s]),s++)}return t}function Ht(){if(i.singlePageMode)return!!i.trophyPages[i.currentPage];const e=q()[i.currentPage];return e?(Array.isArray(e)?e:e.pages||[]).some(a=>!!i.trophyPages[a]):!1}function zt(){if(i.singlePageMode)return[i.currentPage];const e=q()[i.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function da(){if(!i.manga||!i.chapter||i.isCollectionMode)return;const t=zt();if(t.length===0)return;if(t.some(s=>!!i.trophyPages[s])){const s=[...t];if(i.singlePageMode){const a=i.trophyPages[i.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete i.trophyPages[a]),u(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=t,a=i.singlePageMode||t.length===1;if(!i.singlePageMode&&t.length===2){const o=await Wt(t,"Mark as trophy 🏆");if(!o)return;s=o.pages,a=o.pages.length===1}s.forEach(o=>{i.trophyPages[o]={isSingle:a,pages:[...s]}});const n=a?"single":"double";u(`Page${s.length>1?"s":""} marked as trophy (${n}) 🏆`,"success")}try{await k.saveTrophyPages(i.manga.id,i.chapter.number,i.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}se(),jt()}function jt(){const t=document.getElementById("trophy-btn");if(t){const e=Ht();t.classList.toggle("active",e),t.title=e?"Unmark trophy":"Mark as trophy"}}async function we(){if(!i.manga||!i.chapter||i.isCollectionMode||!i.images.length)return;let t=1;if(i.mode==="manga")if(i.singlePageMode)t=i.currentPage+1;else{const s=q()[i.currentPage];s&&s.length>0&&(t=s[0]+1)}else{const e=document.getElementById("reader-content");if(e){const s=e.querySelectorAll("img"),a=e.scrollTop;let n=0;s.forEach((o,r)=>{a>=n&&(t=r+1),n+=o.offsetHeight})}}try{await k.updateReadingProgress(i.manga.id,i.chapter.number,t,i.images.length)}catch(e){console.error("Failed to save progress:",e)}}function Te(){var s,a,n,o,r,d,l,$,b,E,w,v,h,L,I,x,g,y;const t=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{await we(),i.manga&&i.manga.id!=="gallery"?B.go(`/manga/${i.manga.id}`):B.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{B.go("/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var p;(p=document.getElementById("reader-settings"))==null||p.classList.toggle("hidden")}),(o=document.getElementById("close-settings-btn"))==null||o.addEventListener("click",()=>{var p;(p=document.getElementById("reader-settings"))==null||p.classList.add("hidden")}),(r=document.getElementById("single-page-btn"))==null||r.addEventListener("click",()=>{if(i.singlePageMode){const p=q();let m=0;for(let c=0;c<p.length;c++)if(p[c].includes(i.currentPage)){m=c;break}i.singlePageMode=!1,i.currentPage=m}else{const m=q()[i.currentPage];i.singlePageMode=!0,i.currentPage=m?m[0]:0}Ie()}),(d=document.getElementById("trophy-btn"))==null||d.addEventListener("click",()=>{da()}),t.querySelectorAll("[data-mode]").forEach(p=>{p.addEventListener("click",()=>{var C,_;const m=p.dataset.mode;let c=tt();if(i.mode=m,localStorage.setItem("reader_mode",i.mode),m==="webtoon")i.currentPage=c;else if(i.singlePageMode)i.currentPage=c;else{const P=q();let R=0;for(let H=0;H<P.length;H++)if(P[H].includes(c)){R=H;break}i.currentPage=R}(C=i.manga)!=null&&C.id&&((_=i.chapter)!=null&&_.number)&&$e(),Ie(),m==="webtoon"&&setTimeout(()=>{const P=document.getElementById("reader-content");if(P){const R=P.querySelectorAll("img");R[c]&&R[c].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),t.querySelectorAll("[data-direction]").forEach(p=>{p.addEventListener("click",async()=>{var m,c;i.direction=p.dataset.direction,localStorage.setItem("reader_direction",i.direction),(m=i.manga)!=null&&m.id&&((c=i.chapter)!=null&&c.number)&&await $e(),Ie()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async p=>{i.firstPageSingle=p.target.checked,await $e(),se()}),($=document.getElementById("last-page-single"))==null||$.addEventListener("change",async p=>{var m,c;i.lastPageSingle=p.target.checked,await $e(),i.lastPageSingle&&((m=i.manga)!=null&&m.id)&&((c=i.chapter)!=null&&c.number)?await Qt():(i.nextChapterImage=null,i.nextChapterNum=null),se()}),(b=document.getElementById("zoom-slider"))==null||b.addEventListener("input",p=>{i.zoom=parseInt(p.target.value);const m=document.getElementById("reader-content");m&&(m.style.zoom=`${i.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",p=>{const m=parseInt(p.target.value),c=document.getElementById("page-indicator");c&&(i.singlePageMode?c.textContent=`${m+1} / ${i.images.length}`:c.textContent=`${m+1} / ${q().length}`)}),e.addEventListener("change",p=>{i.currentPage=parseInt(p.target.value),se()})),i.mode==="manga"){const p=document.getElementById("reader-content");p==null||p.addEventListener("click",m=>{var P;if(m.target.closest("button, a, .link-overlay"))return;const c=p.getBoundingClientRect(),_=(m.clientX-c.left)/c.width;_<.3?st():_>.7?_e():(i.showControls=!i.showControls,(P=document.querySelector(".reader"))==null||P.classList.toggle("controls-hidden",!i.showControls))})}document.addEventListener("keydown",Gt),(E=document.getElementById("prev-chapter-btn"))==null||E.addEventListener("click",()=>Me(-1)),(w=document.getElementById("next-chapter-btn"))==null||w.addEventListener("click",()=>Me(1)),i.mode==="webtoon"&&((v=document.getElementById("reader-content"))==null||v.addEventListener("click",()=>{var p;i.showControls=!i.showControls,(p=document.querySelector(".reader"))==null||p.classList.toggle("controls-hidden",!i.showControls)})),(h=document.getElementById("rotate-btn"))==null||h.addEventListener("click",async()=>{const p=He();if(!(!p||!i.manga||!i.chapter))try{u("Rotating...","info");const m=await k.rotatePage(i.manga.id,i.chapter.number,p);m.images&&(await ze(m.images),u("Page rotated","success"))}catch(m){u("Rotate failed: "+m.message,"error")}}),(L=document.getElementById("swap-btn"))==null||L.addEventListener("click",async()=>{const m=q()[i.currentPage];if(!m||m.length!==2||!i.manga||!i.chapter){u("Select a spread with 2 pages to swap","info");return}const c=ye(i.images[m[0]]),C=ye(i.images[m[1]]);if(!(!c||!C))try{u("Swapping...","info");const _=await k.swapPages(i.manga.id,i.chapter.number,c,C);_.images&&(await ze(_.images),u("Pages swapped","success"))}catch(_){u("Swap failed: "+_.message,"error")}}),(I=document.getElementById("split-btn"))==null||I.addEventListener("click",async()=>{const p=He();if(!p||!i.manga||!i.chapter||!confirm("Split this page into halves? This is permanent."))return;const m=document.getElementById("split-btn");try{u("Preparing to split...","info"),m&&(m.disabled=!0),i.images=[],i.loading=!0,t.innerHTML=oe(),await new Promise(C=>setTimeout(C,2e3)),u("Splitting page...","info");const c=await k.splitPage(i.manga.id,i.chapter.number,p);m&&(m.disabled=!1),await fe(i.manga.id,i.chapter.number,i.chapter.versionUrl),t.innerHTML=oe(),Te(),se(),c.warning?u(c.warning,"warning"):u("Page split into halves","success")}catch(c){m&&(m.disabled=!1),u("Split failed: "+c.message,"error"),await fe(i.manga.id,i.chapter.number,i.chapter.versionUrl),t.innerHTML=oe(),Te()}}),(x=document.getElementById("delete-page-btn"))==null||x.addEventListener("click",async()=>{const p=He();if(!(!p||!i.manga||!i.chapter)&&confirm(`Delete page "${p}" permanently? This cannot be undone.`))try{u("Deleting...","info");const m=await k.deletePage(i.manga.id,i.chapter.number,p);m.images&&(await ze(m.images),u("Page deleted","success"))}catch(m){u("Delete failed: "+m.message,"error")}}),(g=document.getElementById("favorites-btn"))==null||g.addEventListener("click",async()=>{try{const c=await k.getFavorites();i.allFavorites=c,i.favoriteLists=Object.keys(c.favorites||c||{})}catch(c){console.error("Failed to load favorites",c),u("Failed to load favorites","error");return}let m=[tt()];if(i.mode==="manga"&&!i.singlePageMode){const C=q()[i.currentPage];C&&Array.isArray(C)?m=C:C&&C.pages&&(m=C.pages)}if(m.length>1){const c=await Wt(m,"Select Page for Favorites ⭐");if(!c)return;m=c.pages}ha(m)}),(y=document.getElementById("fullscreen-btn"))==null||y.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{u("Fullscreen not supported","info")})}),document.body.classList.add("reader-active")}function ye(t){var n;const e=typeof t=="string"?t:(t==null?void 0:t.url)||((n=t==null?void 0:t.urls)==null?void 0:n[0]);if(!e)return null;const a=e.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function He(){const t=zt();return t.length===0?null:ye(i.images[t[0]])}async function ze(t){const e=Date.now();if(i.images=t.map(s=>s+(s.includes("?")?"&":"?")+`_t=${e}`),i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.min(i.currentPage,i.images.length-1);else{const s=q();i.currentPage=Math.min(i.currentPage,s.length-1)}i.currentPage=Math.max(0,i.currentPage),se()}async function Qt(){var t,e;if(!(!((t=i.manga)!=null&&t.id)||!((e=i.chapter)!=null&&e.number)))try{const s=await k.getNextChapterPreview(i.manga.id,i.chapter.number);i.nextChapterImage=s.firstImage||null,i.nextChapterNum=s.nextChapter||null}catch{i.nextChapterImage=null,i.nextChapterNum=null}}function ua(t,e){return new Promise(s=>{const a=document.createElement("div");a.className="version-modal-overlay",a.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${t.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const n=a.querySelector(".version-list");t.forEach((o,r)=>{const d=document.createElement("button");d.className="version-item",d.textContent=`Version ${r+1}`,d.addEventListener("click",()=>{a.remove(),s(o)}),n.appendChild(d)}),a.querySelector(".version-cancel").addEventListener("click",()=>{a.remove(),s(null)}),a.addEventListener("click",o=>{o.target===a&&(a.remove(),s(null))}),document.body.appendChild(a)})}function ha(t){if(!i.manga||!i.chapter)return;const e=t.map(l=>{const $=ye(i.images[l]);return $?{filename:$}:null}).filter(Boolean),s=l=>{if(!i.allFavorites||!i.allFavorites.favorites)return-1;const $=i.allFavorites.favorites[l];if(!Array.isArray($))return-1;for(let b=0;b<$.length;b++){const E=$[b];if(E.mangaId===i.manga.id&&E.chapterNum===i.chapter.number&&E.imagePaths)for(const w of E.imagePaths){const v=typeof w=="string"?w:(w==null?void 0:w.filename)||(w==null?void 0:w.path);for(const h of e)if(h&&h.filename===v)return b}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";i.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',i.favoriteLists.forEach(l=>{const b=s(l)!==-1;n+=`
                <button class="page-picker-option list-option ${b?"active-list":""}" data-list="${l}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${l}</span>
                    <span style="font-size: 1.2em;">${b?"✅":"➕"}</span>
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
    `,a.appendChild(o),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),et()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),et())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const $=l.dataset.list,b=s($),E=b!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(E){await k.removeFavoriteItem($,b);const w=await k.getFavorites();i.allFavorites=w,l.classList.remove("active-list"),l.querySelector("span:last-child").textContent="➕"}else{const w=t.length>1?"double":"single",v={mangaId:i.manga.id,chapterNum:i.chapter.number,title:`${i.manga.alias||i.manga.title} Ch.${i.chapter.number} p${t[0]+1}`,imagePaths:e,displayMode:w,displaySide:i.direction==="rtl"?"right":"left"};await k.addFavoriteItem($,v);const h=await k.getFavorites();i.allFavorites=h,l.classList.add("active-list"),l.querySelector("span:last-child").textContent="✅"}}catch(w){console.error(w)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function Wt(t,e){return new Promise(s=>{const[a,n]=t,o=i.images[a],r=i.images[n],d=typeof o=="string"?o:o==null?void 0:o.url,l=typeof r=="string"?r:r==null?void 0:r.url,$=i.direction==="rtl",b=$?n:a,E=$?a:n,w=$?l:d,v=$?d:l,h=document.createElement("div");h.className="page-picker-overlay",h.innerHTML=`
            <div class="page-picker-modal">
                <h3>${e}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${b+1}">
                        <img src="${w}" alt="Page ${b+1}">
                        <span class="page-picker-label">Page ${b+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${E+1}">
                        <img src="${v}" alt="Page ${E+1}">
                        <span class="page-picker-label">Page ${E+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    📖 Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const L=I=>{h.remove(),s(I)};h.querySelectorAll(".page-picker-option").forEach(I=>{I.addEventListener("click",()=>{const x=I.dataset.choice;x==="left"?L({pages:[b]}):x==="right"?L({pages:[E]}):x==="both"&&L({pages:t})})}),h.querySelector(".page-picker-cancel").addEventListener("click",()=>L(null)),h.addEventListener("click",I=>{I.target===h&&L(null)}),document.body.appendChild(h)})}function tt(){if(i.mode==="webtoon"){const t=document.getElementById("reader-content");if(t){const e=t.querySelectorAll("img");if(e.length>0){const s=t.scrollTop;if(s>10){let a=0;for(let n=0;n<e.length;n++){const o=e[n].offsetHeight;if(a+o>s)return n;a+=o}}}}return 0}else{if(i.singlePageMode)return i.currentPage;{const e=q()[i.currentPage];return e&&e.length>0?e[0]:0}}}function Gt(t){if(!(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA")){if(t.key==="Escape"){we(),i.manga&&B.go(`/manga/${i.manga.id}`);return}if(i.mode==="manga")t.key==="ArrowLeft"?i.direction==="rtl"?_e():st():t.key==="ArrowRight"?i.direction==="rtl"?st():_e():t.key===" "&&(t.preventDefault(),_e());else if(i.mode==="webtoon"&&t.key===" "){t.preventDefault();const e=document.getElementById("reader-content");if(e){const s=e.clientHeight*.8;e.scrollBy({top:t.shiftKey?-s:s,behavior:"smooth"})}}}}function _e(){const t=q(),e=i.singlePageMode?i.images.length-1:t.length-1;if(i.currentPage<e)i.currentPage++,se();else{const s=t[i.currentPage],a=s&&s.type==="link";we(),a&&(i.navigationDirection="next-linked"),Me(1)}}function st(){i.currentPage>0?(i.currentPage--,se()):Me(-1)}function se(){const t=document.getElementById("reader-content");if(t){t.innerHTML=i.isCollectionMode?Ot():i.mode==="webtoon"?Vt():Ut();const e=document.getElementById("page-indicator");e&&(i.singlePageMode?e.textContent=`${i.currentPage+1} / ${i.images.length}`:e.textContent=`${i.currentPage+1} / ${q().length}`);const s=document.getElementById("page-slider");s&&(s.value=i.currentPage,s.max=i.singlePageMode?i.images.length-1:q().length-1),jt(),et()}}function Ie(){const t=document.getElementById("app");t&&(t.innerHTML=oe(),Te())}async function Me(t){if(console.log("[Nav] navigateChapter called with delta:",t),!i.manga||!i.chapter){console.log("[Nav] early return - no manga or chapter");return}await we();const s=[...i.manga.downloadedChapters||[]].sort((o,r)=>o-r),a=s.indexOf(i.chapter.number),n=a+t;console.log("[Nav]",{delta:t,chapterNumber:i.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length?(i.navigationDirection||(i.navigationDirection=t<0?"prev":null),console.log("[Nav] Calling router.go with:",`/read/${i.manga.id}/${s[n]}`),B.go(`/read/${i.manga.id}/${s[n]}`)):u(t>0?"Last chapter":"First chapter","info")}async function fe(t,e,s){var a,n,o,r,d;console.log("[Reader] loadData called:",{mangaId:t,chapterNum:e,versionUrl:s});try{if(i.mode=localStorage.getItem("reader_mode")||"webtoon",i.direction=localStorage.getItem("reader_direction")||"rtl",t==="gallery"){const b=decodeURIComponent(e),w=((a=(await k.getFavorites()).favorites)==null?void 0:a[b])||[];i.images=[];for(const v of w){const h=v.imagePaths||[],L=[];for(const I of h){let x;typeof I=="string"?x=I:I&&typeof I=="object"&&(x=I.filename||I.path||I.name||I.url,x&&x.includes("/")&&(x=x.split("/").pop()),x&&x.includes("\\")&&(x=x.split("\\").pop())),x&&L.push(`/api/public/chapter-images/${v.mangaId}/${v.chapterNum}/${encodeURIComponent(x)}`)}L.length>0&&i.images.push({urls:L,displayMode:v.displayMode||"single",displaySide:v.displaySide||"left"})}i.manga={id:"gallery",title:b,alias:b},i.chapter={number:"Gallery"},i.isGalleryMode=!0,i.isCollectionMode=!0,i.images.length===0&&u("Gallery is empty","warning")}else if(t==="trophies"){const b=e;let E=[],w="Trophies";if(b.startsWith("series-")){const v=b.replace("series-",""),L=(await store.loadSeries()).find(g=>g.id===v);w=L?L.alias||L.title:"Series Trophies";const x=(await store.loadBookmarks()).filter(g=>g.seriesId===v);for(const g of x){const y=await k.getTrophyPagesAll(g.id);for(const p in y)for(const m in y[p]){const c=y[p][m],_=(await k.getChapterImages(g.id,p)).images[m],P=typeof _=="string"?_.split("/").pop():(_==null?void 0:_.filename)||(_==null?void 0:_.path);E.push({mangaId:g.id,chapterNum:p,imagePaths:[{filename:P}],displayMode:c.isSingle?"single":"double",displaySide:"left"})}}}else{const v=await k.getBookmark(b);w=v?v.alias||v.title:"Manga Trophies";const h=await k.getTrophyPagesAll(b);for(const L in h)for(const I in h[L]){const x=h[L][I],y=(await k.getChapterImages(b,L)).images[I],p=typeof y=="string"?y.split("/").pop():(y==null?void 0:y.filename)||(y==null?void 0:y.path);E.push({mangaId:b,chapterNum:L,imagePaths:[{filename:decodeURIComponent(p)}],displayMode:x.isSingle?"single":"double",displaySide:"left"})}}i.images=E.map(v=>{const h=v.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${v.mangaId}/${v.chapterNum}/${encodeURIComponent(h)}`],displayMode:v.displayMode,displaySide:v.displaySide}}),i.manga={id:"trophies",title:w,alias:w},i.chapter={number:"🏆"},i.isCollectionMode=!0,i.isGalleryMode=!1}else{i.isGalleryMode=!1;const b=await k.getBookmark(t);i.manga=b,console.log("[Reader] manga loaded, finding chapter..."),i.chapter=((n=b.chapters)==null?void 0:n.find(v=>v.number===parseFloat(e)))||{number:parseFloat(e)};const E=s?`/bookmarks/${t}/chapters/${e}/images?versionUrl=${encodeURIComponent(s)}`:`/bookmarks/${t}/chapters/${e}/images`,w=await k.get(E);console.log("[Reader] images loaded, count:",(o=w.images)==null?void 0:o.length),i.images=w.images||[];try{const v=await k.getChapterSettings(t,e);v&&(v.mode&&(i.mode=v.mode),v.direction&&(i.direction=v.direction),v.firstPageSingle!==void 0&&(i.firstPageSingle=v.firstPageSingle),v.lastPageSingle!==void 0&&(i.lastPageSingle=v.lastPageSingle))}catch(v){console.warn("Failed to load chapter settings",v)}try{const v=await k.getTrophyPages(t,e);i.trophyPages=v||{}}catch(v){console.warn("Failed to load trophy pages",v)}try{const v=await k.getFavorites();i.allFavorites=v,i.favoriteLists=Object.keys(v.favorites||v||{})}catch(v){console.warn("Failed to load favorites",v)}}const l=parseFloat(e),$=(d=(r=i.manga)==null?void 0:r.readingProgress)==null?void 0:d[l];if($&&$.page<$.totalPages)if(i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,$.page-1);else{const b=Math.max(0,$.page-1),E=q();let w=0;for(let v=0;v<E.length;v++){const h=E[v],L=Array.isArray(h)?h:h.pages||[];if(L.includes(b)||L[0]>=b){w=v;break}w=v}i.currentPage=w}else i.currentPage=0,i._resumeScrollToPage=$.page-1;else i.currentPage=0}catch(l){console.error("Error loading chapter:",l),u("Failed to load chapter","error")}if(i.navigationDirection==="prev"&&i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,i.images.length-1);else{const l=q();i.currentPage=Math.max(0,l.length-1)}else if(i.navigationDirection==="next-linked"&&i.mode==="manga"&&i.images.length>1)if(i.singlePageMode)i.currentPage=1;else{const l=q();let $=0;for(let b=0;b<l.length;b++){const E=l[b];if((Array.isArray(E)?E:E.pages||[]).includes(1)){$=b;break}}i.currentPage=$}i.navigationDirection=null,i.lastPageSingle&&await Qt(),i.loading=!1,Ie(),i.mode==="webtoon"&&i._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const $=l.querySelectorAll("img");$[i._resumeScrollToPage]&&$[i._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete i._resumeScrollToPage},300)}async function pa(t=[]){console.log("[Reader] mount called with params:",t);const[e,s]=t;if(console.log("[Reader] mangaId:",e,"chapterNum:",s),!e||!s){B.go("/");return}const a=document.getElementById("app");i.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),i.images=[],i.singlePageMode=!1,i._resumeScrollToPage=null,i.nextChapterImage=null,i.nextChapterNum=null,a.innerHTML=oe();try{const n=await k.getBookmark(e),o=n.downloadedVersions||{},r=new Set(n.deletedChapterUrls||[]),d=o[parseFloat(s)];let l=[];if(Array.isArray(d)&&(l=d.filter($=>!r.has($))),l.length>1){const $=await ua(l,s);if($===null){B.go(`/manga/${e}`);return}await fe(e,s,$)}else await fe(e,s)}catch(n){console.log("[Reader] Error in version check, falling back:",n),await fe(e,s)}if(a.innerHTML=oe(),console.log("[Reader] render called, loading:",i.loading,"manga:",!!i.manga,"images:",i.images.length),Te(),i.mode==="webtoon"&&i._resumeScrollToPage!=null){const n=i._resumeScrollToPage;i._resumeScrollToPage=null,setTimeout(()=>{const o=document.getElementById("reader-content");if(o){const r=o.querySelectorAll("img");r[n]&&r[n].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function ma(){console.log("[Reader] unmount called"),await we(),document.body.classList.remove("reader-active"),document.removeEventListener("keydown",Gt),i.manga=null,i.chapter=null,i.images=[],i.loading=!0,i.singlePageMode=!1,i._resumeScrollToPage=null}async function $e(){if(!(!i.manga||!i.chapter||i.manga.id==="gallery"))try{await k.updateChapterSettings(i.manga.id,i.chapter.number,{mode:i.mode,direction:i.direction,firstPageSingle:i.firstPageSingle,lastPageSingle:i.lastPageSingle})}catch(t){console.error("Failed to save settings:",t)}}async function Kt(t){try{const e=await k.getBookmark(t),s=e.downloadedChapters||[],a=new Set(e.readChapters||[]),n=e.readingProgress||{},o=[...s].sort((d,l)=>d-l);let r=null;for(const d of o){const l=n[d];if(l&&l.page<l.totalPages&&!a.has(d)){r=d;break}}if(r===null){for(const d of o)if(!a.has(d)){r=d;break}}r===null&&o.length>0&&(r=o[0]),r!==null?B.go(`/read/${t}/${r}`):u("No downloaded chapters to read","info")}catch(e){u("Failed to continue reading: "+e.message,"error")}}const ga={mount:pa,unmount:ma,render:oe,continueReading:Kt},ve=50;let f={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1};function fa(t){return t.autoCheck===!0?`<button class="btn btn-primary" id="schedule-btn">⏰ ${t.checkSchedule==="weekly"?`${(t.checkDay||"monday").charAt(0).toUpperCase()+(t.checkDay||"monday").slice(1)} ${t.checkTime||"06:00"}`:t.checkSchedule==="daily"?`Daily ${t.checkTime||"06:00"}`:"Every 6h"}</button>`:'<button class="btn btn-secondary" id="schedule-btn">⏰ Schedule</button>'}function va(t){const e=t.autoCheck===!0,s=t.checkSchedule||"daily",a=t.checkDay||"monday",n=t.checkTime||"06:00",o=t.autoDownload||!1;return`
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
  `}function at(){var m;if(f.loading)return`
      ${W()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=f.manga;if(!t)return`
      ${W()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.chapters||[],a=new Set(t.downloadedChapters||[]),n=new Set(t.readChapters||[]),o=new Set(t.excludedChapters||[]),r=new Set(t.deletedChapterUrls||[]),d=t.volumes||[],l=new Set;d.forEach(c=>{(c.chapters||[]).forEach(C=>l.add(C))});let $;f.filter==="hidden"?$=s.filter(c=>o.has(c.number)||r.has(c.url)):$=s.filter(c=>!o.has(c.number)&&!r.has(c.url));const b=$.filter(c=>!l.has(c.number));let E=[];if(f.activeVolume){const c=new Set(f.activeVolume.chapters||[]);E=$.filter(C=>c.has(C.number))}else E=b;const w=new Map;E.forEach(c=>{w.has(c.number)||w.set(c.number,[]),w.get(c.number).push(c)});let v=Array.from(w.entries()).sort((c,C)=>c[0]-C[0]);f.filter==="downloaded"?v=v.filter(([c])=>a.has(c)):f.filter==="not-downloaded"?v=v.filter(([c])=>!a.has(c)):f.filter==="main"?v=v.filter(([c])=>Number.isInteger(c)):f.filter==="extra"&&(v=v.filter(([c])=>!Number.isInteger(c)));const h=Math.max(1,Math.ceil(v.length/ve));f.currentPage>=h&&(f.currentPage=Math.max(0,h-1));const L=f.currentPage*ve,x=[...v.slice(L,L+ve)].reverse(),g=w.size,y=[...w.keys()].filter(c=>a.has(c)).length;n.size;let p="";if(f.activeVolume){const c=f.activeVolume;let C=null;c.local_cover?C=`/api/public/covers/${t.id}/${encodeURIComponent(c.local_cover.split(/[/\\]/).pop())}`:c.cover&&(C=c.cover),p=`
      ${W()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${C?`<img src="${C}" alt="${c.name}">`:'<div class="placeholder">📚</div>'}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${t.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${c.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${g} Chapters</span>
                ${y>0?`<span class="meta-item downloaded">${y} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${t.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${f.manageChapters?"Done Managing":"➕ Add Chapters"}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${c.id}">✏️ Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const c=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover;p=`
        ${W()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${c?`<img src="${c}" alt="${e}">`:'<div class="placeholder">📚</div>'}
              </div>
              <div class="manga-detail-info">
                <h1>${e}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent">${t.website||"Local"}</span>
                  <span class="meta-item">${((m=t.chapters)==null?void 0:m.length)||0} Total Chapters</span>
                  ${a.size>0?`<span class="meta-item downloaded">${a.size} Downloaded</span>`:""}
                  ${n.size>0?`<span class="meta-item">${n.size} Read</span>`:""}
                </div>
                ${(t.artists||[]).length>0||(t.categories||[]).length>0?`
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(t.artists||[]).length>0?`
                    <span class="meta-label">Author:</span>
                    ${t.artists.map(C=>`<a href="#//" class="artist-link" data-artist="${C}">${C}</a>`).join(", ")}
                  `:""}
                  ${(t.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(t.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${t.categories.map(C=>`<span class="tag">${C}</span>`).join("")}
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
              ${t.website==="Local"?'<button class="btn btn-secondary" id="scan-folder-btn">📁 Scan Folder</button>':""}
              <button class="btn btn-secondary" id="edit-btn">✏️ Edit</button>
              ${(t.volumes||[]).length===0?'<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>':""}
              ${fa(t)}
            </div>
            ${t.description?`<p class="manga-description">${t.description}</p>`:""}
            ${f.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">📦 CBZ Files (${f.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${f.cbzFiles.map(C=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${C.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${C.chapterNumber?`Chapter ${C.chapterNumber}`:"Unknown chapter"}
                        ${C.isExtracted?" | ✅ Extracted":""}
                      </div>
                    </div>
                    <button class="btn btn-small ${C.isExtracted?"btn-secondary":"btn-primary"}" 
                            data-cbz-path="${encodeURIComponent(C.path)}" 
                            data-cbz-chapter="${C.chapterNumber||1}"
                            data-cbz-extracted="${C.isExtracted}">
                      ${C.isExtracted?"Re-Extract":"Extract"}
                    </button>
                  </div>
                `).join("")}
              </div>
            </div>
            `:""}
          </div>
        </div>
      `}return`
    ${p}
        
        ${f.activeVolume?f.manageChapters?wa(t,b):"":ka(t,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${f.filter==="all"?"active":""}" data-filter="all">
                All (${w.size})
              </button>
              <button class="filter-btn ${f.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${y})
              </button>
              <button class="filter-btn ${f.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${f.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${h>1?kt(h):""}
          
          <div class="chapter-list">
            ${x.map(([c,C])=>ba(c,C,a,n,t)).join("")}
          </div>
          
          ${h>1?kt(h):""}
        </div>
      ${ya()}
    </div>
  `}function ya(){var e,s;const t=f.manga;return`
    ${t?va(t):""}
    ${Na()}

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
  `}function ba(t,e,s,a,n){var p,m,c,C;const o=s.has(t),r=a.has(t),d=!Number.isInteger(t),l=((p=n.downloadedVersions)==null?void 0:p[t])||[],$=new Set(n.deletedChapterUrls||[]),b=e.filter(_=>f.filter==="hidden"?!0:!$.has(_.url)),E=!!f.activeVolume;let w=b;E&&(w=b.filter(_=>Array.isArray(l)?l.includes(_.url):l===_.url));const v=w.length>1,h=(m=w[0])!=null&&m.url?encodeURIComponent(w[0].url):null,L=n.chapterSettings||{},I=E?!0:(c=L[t])==null?void 0:c.locked,x=["chapter-item",o?"downloaded":"",r?"read":"",d?"extra":""].filter(Boolean).join(" "),g=v?`
    <div class="versions-dropdown hidden" id="versions-${t}">
      ${w.map(_=>{const P=encodeURIComponent(_.url),R=Array.isArray(l)?l.includes(_.url):l===_.url;return`
          <div class="version-row ${R?"downloaded":""}"
               data-version-url="${P}" data-num="${t}">
            <span class="version-title">${_.title||_.releaseGroup||"Version"}</span>
            <div class="version-actions">
              ${R?`<button class="btn-icon small success" data-action="read-version" data-num="${t}" data-url="${P}">▶</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${t}" data-url="${P}">🗑️</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${t}" data-url="${P}">↓</button>`}
              ${$.has(_.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${t}" data-url="${P}" title="Restore Version">↩️</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${t}" data-url="${P}" title="Hide Version">👁️‍🗨️</button>`}
            </div>
          </div>
        `}).join("")}
    </div>
  `:"",y=(n.excludedChapters||[]).includes(t);return`
    <div class="chapter-group" data-chapter="${t}">
      <div class="${x}" data-num="${t}" style="${y?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${t}</span>
        <span class="chapter-title">
          ${w[0]?w[0].title!==`Chapter ${t}`?w[0].title:"":e[0].title}
          ${y?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
        </span>
        ${d?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${y?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${t}" title="Restore Chapter">↩️</button>`:E?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${f.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${t}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${I?"locked":""}"
                        data-action="lock" data-num="${t}"
                        title="${I?"Unlock":"Lock"}">
                  ${I?"🔒":"🔓"}
                </button>`}
          ${!y&&h?$.has((C=w[0])==null?void 0:C.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${t}" data-url="${h}" title="Unhide Chapter">↩️</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${t}" data-url="${h}" title="Hide Chapter">👁️‍🗨️</button>`:""}
          <button class="btn-icon small ${r?"success":"muted"}"
                  data-action="read" data-num="${t}"
                  title="${r?"Mark unread":"Mark read"}">
            ${r?"👁️":"○"}
          </button>
          ${o?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${t}" data-url="${h}" title="Delete Files">🗑️</button>`:`<button class="btn-icon small ${o?"success":""}"
              data-action="download" data-num="${t}"
              title="${o?"Downloaded":"Download"}">
          ${o?"✓":"↓"}
        </button>`}
          ${v?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${t}">
              ${b.length} ▼
            </button>
          `:""}
        </div>
      </div>
      ${g}
    </div>
  `}function kt(t){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${f.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${f.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${f.currentPage+1} of ${t}</span>
      <button class="btn btn-icon" data-page="next" ${f.currentPage>=t-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${f.currentPage>=t-1?"disabled":""}>»</button>
    </div>
  `}function wa(t,e){return e.length===0?`
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
  `}function ka(t,e){var n;const s=t.volumes||[];return s.length===0?"":`
    <div class="volumes-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="margin: 0;">Volumes</h2>
        <button class="btn btn-secondary btn-small" id="add-volume-btn">+ Add Volume</button>
      </div>
      <div class="volumes-grid">
        ${s.map(o=>{const r=o.chapters||[],d=r.filter(l=>e.has(l)).length;return`
      <div class="volume-card" data-volume-id="${o.id}">
        <div class="volume-cover">
          ${o.cover?`<img src="${o.cover}" alt="${o.name}">`:'<div class="placeholder">📚</div>'}
          <div class="volume-badges">
            <span class="badge badge-chapters">${r.length} ch</span>
            ${d>0?`<span class="badge badge-downloaded">${d}</span>`:""}
          </div>
        </div>
        <div class="volume-info">
          <div class="volume-name">${o.name}</div>
        </div>
      </div>
    `}).join("")||(((n=t.chapters)==null?void 0:n.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function Ea(){var s,a,n,o,r,d,l,$,b,E,w,v,h,L,I,x;const t=document.getElementById("app"),e=f.manga;e&&((s=document.getElementById("back-btn"))==null||s.addEventListener("click",()=>B.go("/")),(a=document.getElementById("back-library-btn"))==null||a.addEventListener("click",()=>B.go("/")),t.querySelectorAll(".artist-link").forEach(g=>{g.addEventListener("click",y=>{y.preventDefault();const p=g.dataset.artist;p&&(localStorage.setItem("library_search",p),localStorage.removeItem("library_artist_filter"),B.go("/"))})}),(n=document.getElementById("continue-btn"))==null||n.addEventListener("click",()=>{Kt(e.id)}),(o=document.getElementById("download-all-btn"))==null||o.addEventListener("click",()=>{const g=document.getElementById("download-all-modal");g&&g.classList.add("open")}),(r=document.getElementById("confirm-download-all-btn"))==null||r.addEventListener("click",async()=>{var g;try{u("Queueing downloads...","info");const y=document.getElementsByName("download-version-mode");let p="single";for(const c of y)c.checked&&(p=c.value);(g=document.getElementById("download-all-modal"))==null||g.classList.remove("open");const m=await k.post(`/bookmarks/${e.id}/download`,{all:!0,versionMode:p});m.chaptersCount>0?u(`Download queued: ${m.chaptersCount} versions`,"success"):u("Already have these chapters downloaded","info")}catch(y){u("Failed to download: "+y.message,"error")}}),(d=document.getElementById("check-updates-btn"))==null||d.addEventListener("click",async()=>{try{u("Checking for updates...","info"),await k.post(`/bookmarks/${e.id}/quick-check`),u("Check complete!","success")}catch(g){u("Check failed: "+g.message,"error")}}),(l=document.getElementById("schedule-btn"))==null||l.addEventListener("click",()=>{const g=document.getElementById("schedule-modal");g&&g.classList.add("open")}),($=document.getElementById("schedule-type"))==null||$.addEventListener("change",g=>{const y=document.getElementById("schedule-day-group");y&&(y.style.display=g.target.value==="weekly"?"":"none")}),(b=document.getElementById("save-schedule-btn"))==null||b.addEventListener("click",async()=>{var g;try{const y=document.getElementById("schedule-type").value,p=document.getElementById("schedule-day").value,m=document.getElementById("schedule-time").value,c=document.getElementById("auto-download-toggle").checked;await k.updateAutoCheckSchedule(e.id,{enabled:!0,schedule:y,day:p,time:m,autoDownload:c}),f.manga.checkSchedule=y,f.manga.checkDay=p,f.manga.checkTime=m,f.manga.autoDownload=c,(g=document.getElementById("schedule-modal"))==null||g.classList.remove("open"),T([e.id]),u("Schedule updated","success")}catch(y){u("Failed to save schedule: "+y.message,"error")}}),(E=document.getElementById("disable-schedule-btn"))==null||E.addEventListener("click",async()=>{var g;try{await k.toggleAutoCheck(e.id,!1),f.manga.autoCheck=!1,f.manga.checkSchedule=null,f.manga.checkDay=null,f.manga.checkTime=null,f.manga.nextCheck=null,(g=document.getElementById("schedule-modal"))==null||g.classList.remove("open"),T([e.id]),u("Auto-check disabled","success")}catch(y){u("Failed to disable: "+y.message,"error")}}),(w=document.getElementById("refresh-btn"))==null||w.addEventListener("click",async()=>{const g=document.getElementById("refresh-btn");try{g.disabled=!0,g.textContent="⏳ Checking...",u("Checking for updates...","info"),await k.post(`/bookmarks/${e.id}/check`),await U(e.id),T([e.id]),u("Check complete!","success")}catch(y){u("Check failed: "+y.message,"error"),g&&(g.disabled=!1,g.textContent="🔄 Refresh")}}),(v=document.getElementById("scan-folder-btn"))==null||v.addEventListener("click",async()=>{var y,p;const g=document.getElementById("scan-folder-btn");try{g.disabled=!0,g.textContent="⏳ Scanning...",u("Scanning folder...","info");const m=await k.scanBookmark(e.id);await U(e.id),T([e.id]);const c=((y=m.addedChapters)==null?void 0:y.length)||0,C=((p=m.removedChapters)==null?void 0:p.length)||0;c>0||C>0?u(`Scan complete: ${c} added, ${C} removed`,"success"):u("Scan complete: No changes","info")}catch(m){u("Scan failed: "+m.message,"error")}finally{g&&(g.disabled=!1,g.textContent="📁 Scan Folder")}}),document.querySelectorAll("[data-cbz-path]").forEach(g=>{g.addEventListener("click",async()=>{const y=decodeURIComponent(g.dataset.cbzPath),p=parseInt(g.dataset.cbzChapter)||1,m=g.dataset.cbzExtracted==="true",c=prompt("Enter chapter number for extraction:",String(p));if(!c)return;const C=parseFloat(c);if(isNaN(C)){u("Invalid chapter number","error");return}try{g.disabled=!0,g.textContent="Extracting...",u("Extracting CBZ...","info"),await k.extractCbz(e.id,y,C,{forceReExtract:m}),u("CBZ extracted successfully!","success"),await U(e.id),T([e.id])}catch(_){u("Extract failed: "+_.message,"error")}finally{g.disabled=!1,g.textContent=m?"Re-Extract":"Extract"}})}),(h=document.getElementById("edit-btn"))==null||h.addEventListener("click",async()=>{const g=document.getElementById("edit-manga-modal");if(g){document.getElementById("edit-alias-input").value=e.alias||"",window._selectedCoverPath=null;try{const[y,p]=await Promise.all([k.getAllArtists(),k.getAllCategories()]),m=document.getElementById("artist-list"),c=document.getElementById("category-list");window._allArtists=y,window._allCategories=p,m&&(m.innerHTML=y.map(P=>`<option value="${P}">`).join("")),c&&(c.innerHTML=p.map(P=>`<option value="${P}">`).join(""));const C=document.getElementById("edit-artist-input"),_=document.getElementById("edit-categories-input");C==null||C.addEventListener("input",()=>{const P=C.value.toLowerCase(),R=C.value.lastIndexOf(","),H=C.value.substring(R+1).trim().toLowerCase();if(H.length>0&&window._allArtists){const ee=window._allArtists.filter(de=>de.toLowerCase().includes(H));if(m&&ee.length>0){const de=R>=0?C.value.substring(0,R+1)+" ":"";m.innerHTML=ee.map(Xt=>`<option value="${de}${Xt}">`).join("")}}}),_==null||_.addEventListener("input",()=>{const P=_.value.lastIndexOf(","),R=_.value.substring(P+1).trim().toLowerCase();if(R.length>0&&window._allCategories){const H=window._allCategories.filter(ee=>ee.toLowerCase().includes(R));if(c&&H.length>0){const ee=P>=0?_.value.substring(0,P+1)+" ":"";c.innerHTML=H.map(de=>`<option value="${ee}${de}">`).join("")}}})}catch(y){console.error("Failed to load artists/categories:",y)}g.classList.add("open")}}),(L=document.getElementById("save-manga-btn"))==null||L.addEventListener("click",async()=>{var g;try{const y=document.getElementById("edit-alias-input").value.trim(),p=document.getElementById("edit-artist-input").value.trim(),m=document.getElementById("edit-categories-input").value.trim(),c=p?p.split(",").map(_=>_.trim()).filter(_=>_):[],C=m?m.split(",").map(_=>_.trim()).filter(_=>_):[];await k.updateBookmark(e.id,{alias:y||null}),await k.setBookmarkArtists(e.id,c),await k.setBookmarkCategories(e.id,C),window._selectedCoverPath&&await k.setBookmarkCoverFromImage(e.id,window._selectedCoverPath),f.manga.alias=y||null,f.manga.artists=c,f.manga.categories=C,(g=document.getElementById("edit-manga-modal"))==null||g.classList.remove("open"),T([e.id]),u("Manga updated","success")}catch(y){u("Failed to update: "+y.message,"error")}}),(I=document.getElementById("change-cover-btn"))==null||I.addEventListener("click",async()=>{try{u("Loading images...","info");const g=await k.getFolderImages(e.id);if(g.length===0){u("No images found in manga folder","warning");return}const y=document.createElement("div");y.id="cover-select-modal",y.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",y.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${g.slice(0,50).map(p=>`
              <div class="cover-option" data-path="${p.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(p.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${g.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${g.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(y),document.getElementById("close-cover-modal").addEventListener("click",()=>y.remove()),y.addEventListener("click",p=>{p.target===y&&y.remove()}),y.querySelectorAll(".cover-option").forEach(p=>{p.addEventListener("click",()=>{window._selectedCoverPath=p.dataset.path;const m=document.getElementById("cover-preview");m&&(m.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),y.remove(),u("Cover selected","success")})})}catch(g){u("Failed to load images: "+g.message,"error")}}),(x=document.getElementById("delete-manga-btn"))==null||x.addEventListener("click",async()=>{const g=confirm("Also delete downloaded files?");if(confirm("Are you sure you want to delete this manga from your library?"))try{await k.deleteBookmark(e.id,g),u("Manga deleted","success"),B.go("/")}catch(y){u("Failed to delete: "+y.message,"error")}}),t.querySelectorAll(".filter-btn").forEach(g=>{g.addEventListener("click",()=>{f.filter=g.dataset.filter,f.currentPage=0,T([e.id])})}),t.querySelectorAll("[data-page]").forEach(g=>{g.addEventListener("click",()=>{const y=g.dataset.page,p=Math.ceil(f.manga.chapters.length/ve);switch(y){case"first":f.currentPage=0;break;case"prev":f.currentPage=Math.max(0,f.currentPage-1);break;case"next":f.currentPage=Math.min(p-1,f.currentPage+1);break;case"last":f.currentPage=p-1;break}T([e.id])})}),t.querySelectorAll(".chapter-item").forEach(g=>{g.addEventListener("click",y=>{if(y.target.closest(".chapter-actions"))return;const p=parseFloat(g.dataset.num);(e.downloadedChapters||[]).includes(p)?B.go(`/read/${e.id}/${p}`):u("Chapter not downloaded","info")})}),t.querySelectorAll("[data-action]").forEach(g=>{g.addEventListener("click",async y=>{y.stopPropagation();const p=g.dataset.action,m=parseFloat(g.dataset.num),c=g.dataset.url?decodeURIComponent(g.dataset.url):null;switch(p){case"lock":await $a(m);break;case"read":await Ca(m);break;case"download":await Sa(m);break;case"versions":La(m);break;case"read-version":B.go(`/read/${e.id}/${m}?version=${encodeURIComponent(c)}`);break;case"download-version":await xa(m,c);break;case"delete-version":await _a(m,c);break;case"hide-version":await Ia(m,c);break;case"restore-version":await Ba(m,c);break;case"restore-chapter":await Pa(m);break;case"delete-chapter":await Aa(m,c);break;case"hide-chapter":await Ta(m,c);break;case"unhide-chapter":await Ma(m,c);break}})}),t.querySelectorAll(".volume-card").forEach(g=>{g.addEventListener("click",()=>{const y=g.dataset.volumeId;B.go(`/manga/${e.id}/volume/${y}`)})}),qa(t),ne(),M.subscribeToManga(e.id))}async function $a(t){var n;const e=f.manga,s=((n=e.chapterSettings)==null?void 0:n[t])||{},a=!s.locked;try{a?await k.lockChapter(e.id,t):await k.unlockChapter(e.id,t),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[t]={...s,locked:a},u(a?"Chapter locked":"Chapter unlocked","success"),T([e.id])}catch(o){u("Failed: "+o.message,"error")}}async function Ca(t){const e=f.manga,s=new Set(e.readChapters||[]),a=s.has(t);try{await k.post(`/bookmarks/${e.id}/chapters/${t}/read`,{read:!a}),a?s.delete(t):s.add(t),e.readChapters=[...s],u(a?"Marked unread":"Marked read","success"),T([e.id])}catch(n){u("Failed: "+n.message,"error")}}async function Sa(t){const e=f.manga;try{u(`Downloading chapter ${t}...`,"info"),await k.post(`/bookmarks/${e.id}/download`,{chapters:[t]}),u("Download queued!","success")}catch(s){u("Failed: "+s.message,"error")}}function La(t){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${t}`&&s.classList.add("hidden")});const e=document.getElementById(`versions-${t}`);e&&e.classList.toggle("hidden")}async function xa(t,e){const s=f.manga;try{u("Downloading version...","info"),await k.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:t,url:e}),u("Download queued!","success")}catch(a){u("Failed: "+a.message,"error")}}async function _a(t,e){const s=f.manga;if(confirm("Delete this version from disk?"))try{await k.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:decodeURIComponent(e)})}),u("Version deleted","success"),await U(s.id),T([s.id])}catch(a){u("Failed: "+a.message,"error")}}async function Ia(t,e){const s=f.manga;try{await k.hideVersion(s.id,t,decodeURIComponent(e)),u("Version hidden","success"),await U(s.id),T([s.id])}catch(a){u("Failed: "+a.message,"error")}}async function Ba(t,e){const s=f.manga;try{await k.unhideVersion(s.id,t,decodeURIComponent(e)),u("Version restored","success"),await U(s.id),T([s.id])}catch(a){u("Failed to restore version: "+a.message,"error")}}async function Pa(t){const e=f.manga;try{await k.unexcludeChapter(e.id,t),u("Chapter restored","success"),await U(e.id),T([e.id])}catch(s){u("Failed to restore chapter: "+s.message,"error")}}async function Aa(t,e){const s=f.manga;if(confirm("Delete this chapter's files from disk?"))try{await k.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:decodeURIComponent(e)})}),u("Chapter files deleted","success"),await U(s.id),T([s.id])}catch(a){u("Failed to delete: "+a.message,"error")}}async function Ta(t,e){const s=f.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await k.hideVersion(s.id,t,decodeURIComponent(e)),u("Chapter hidden","success"),await U(s.id),T([s.id])}catch(a){u("Failed to hide chapter: "+a.message,"error")}}async function Ma(t,e){const s=f.manga;try{await k.unhideVersion(s.id,t,decodeURIComponent(e)),u("Chapter unhidden","success"),await U(s.id),T([s.id])}catch(a){u("Failed to unhide chapter: "+a.message,"error")}}async function U(t){try{const[e,s]=await Promise.all([k.getBookmark(t),J.loadCategories()]);if(f.manga=e,f.categories=s,f.loading=!1,e.website==="Local")try{const o=await k.getCbzFiles(t);f.cbzFiles=o||[]}catch(o){console.error("Failed to load CBZ files:",o),f.cbzFiles=[]}else f.cbzFiles=[];const a=new Set((e.chapters||[]).map(o=>o.number)).size,n=Math.ceil(a/ve);f.currentPage=Math.max(0,n-1),f.activeVolumeId?f.activeVolume=(e.volumes||[]).find(o=>o.id===f.activeVolumeId):f.activeVolume=null}catch{u("Failed to load manga","error"),f.loading=!1}}async function T(t=[]){const[e,s,a]=t;if(!e){B.go("/");return}f.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!f.manga||f.manga.id!==e?(f.loading=!0,f.manga=null,n.innerHTML=at(),await U(e)):f.activeVolumeId?f.activeVolume=(f.manga.volumes||[]).find(o=>o.id===f.activeVolumeId):f.activeVolume=null,n.innerHTML=at(),Ea()}function Ra(){f.manga&&M.unsubscribeFromManga(f.manga.id),f.manga=null,f.loading=!0}const Da={mount:T,unmount:Ra,render:at};function Na(){return`
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
  `}function qa(t){const e=f.manga;if(!e)return;const s=t.querySelector("#add-volume-btn"),a=t.querySelector("#add-volume-modal"),n=t.querySelector("#add-volume-submit-btn");s&&a&&s.addEventListener("click",()=>{a.classList.add("open"),t.querySelector("#add-volume-name-input").focus()}),a==null||a.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(h=>{h.addEventListener("click",()=>a.classList.remove("open"))}),n&&n.addEventListener("click",async()=>{const h=t.querySelector("#add-volume-name-input").value.trim();if(!h)return u("Please enter a volume name","error");try{n.disabled=!0,n.textContent="Creating...",await k.createVolume(e.id,h),u("Volume created successfully!","success"),a.classList.remove("open"),t.querySelector("#add-volume-name-input").value="",await U(e.id),T([e.id])}catch(L){u("Failed to create volume: "+L.message,"error")}finally{n.disabled=!1,n.textContent="Create Volume"}});const o=t.querySelector("#manage-chapters-btn");o&&o.addEventListener("click",()=>{f.manageChapters=!f.manageChapters,T([e.id,"volume",f.activeVolumeId])}),t.querySelectorAll(".add-to-vol-btn").forEach(h=>{h.addEventListener("click",async()=>{const L=parseFloat(h.dataset.num),I=f.activeVolume;if(I)try{h.disabled=!0,h.textContent="...";const x=I.chapters||[];if(x.includes(L))return;const g=[...x,L].sort((y,p)=>y-p);await k.updateVolumeChapters(e.id,I.id,g),u(`Chapter ${L} added to volume`,"success"),await U(e.id),T([e.id,"volume",I.id])}catch(x){u("Failed to add chapter: "+x.message,"error"),h.disabled=!1,h.textContent="Add"}})}),t.querySelectorAll(".remove-from-vol-btn").forEach(h=>{h.addEventListener("click",async L=>{L.stopPropagation();const I=parseFloat(h.dataset.num),x=f.activeVolume;if(x)try{h.disabled=!0,h.textContent="...";const y=(x.chapters||[]).filter(p=>p!==I);await k.updateVolumeChapters(e.id,x.id,y),u(`Chapter ${I} removed from volume`,"success"),await U(e.id),T([e.id,"volume",x.id])}catch(g){u("Failed to remove chapter: "+g.message,"error"),h.disabled=!1,h.textContent="×"}})});const r=t.querySelector("#edit-vol-btn"),d=t.querySelector("#edit-volume-modal");r&&d&&r.addEventListener("click",()=>{const h=r.dataset.volId,L=e.volumes.find(I=>I.id===h);L&&(t.querySelector("#volume-name-input").value=L.name,d.dataset.editingVolId=h,d.classList.add("open"))});const l=t.querySelector("#save-volume-btn");l&&l.addEventListener("click",async()=>{const h=d.dataset.editingVolId,L=t.querySelector("#volume-name-input").value.trim();if(!L)return u("Volume name cannot be empty","error");try{await k.renameVolume(e.id,h,L),u("Volume renamed","success"),d.classList.remove("open"),await U(e.id),T([e.id,"volume",h])}catch(I){u(I.message,"error")}});const $=t.querySelector("#delete-volume-btn");$&&$.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const h=d.dataset.editingVolId;try{await k.deleteVolume(e.id,h),u("Volume deleted","success"),d.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch(L){u(L.message,"error")}});const b=t.querySelector("#vol-cover-upload-btn");if(b){let h=document.getElementById("vol-cover-input-hidden");h||(h=document.createElement("input"),h.type="file",h.id="vol-cover-input-hidden",h.accept="image/*",h.style.display="none",document.body.appendChild(h),h.addEventListener("change",async L=>{const I=L.target.files[0];if(!I)return;const x=d.dataset.editingVolId;if(x)try{h.value="",b.disabled=!0,b.textContent="Uploading...",await k.uploadVolumeCover(e.id,x,I),u("Cover uploaded","success"),await U(e.id),T([e.id,"volume",x])}catch(g){u("Upload failed: "+g.message,"error")}finally{b.disabled=!1,b.innerHTML="📤 Upload Image"}})),b.addEventListener("click",()=>h.click())}const E=t.querySelector("#vol-cover-selector-btn"),w=t.querySelector("#cover-selector-modal");E&&w&&E.addEventListener("click",async()=>{const h=w.querySelector("#cover-chapter-select");h.innerHTML='<option value="">Select a chapter...</option>';const L=t.querySelector("#edit-volume-modal"),I=L?L.dataset.editingVolId:null;let x=[...e.chapters||[]];if(I){const y=e.volumes.find(p=>p.id===I);if(y&&y.chapters){const p=new Set(y.chapters);x=x.filter(m=>p.has(m.number))}}x.sort((y,p)=>y.number-p.number);const g=new Set;x.forEach(y=>{if(!g.has(y.number)){g.add(y.number);const p=document.createElement("option");p.value=y.number,p.textContent=`Chapter ${y.number}`,h.appendChild(p)}}),x.length>0&&(h.value=x[0].number,Et(e.id,x[0].number)),w.classList.add("open")});const v=t.querySelector("#cover-chapter-select");v&&v.addEventListener("change",h=>{h.target.value&&Et(e.id,h.target.value)}),t.querySelectorAll(".modal-close, .modal-close-btn").forEach(h=>{h.addEventListener("click",()=>{h.closest(".modal").classList.remove("open")})}),t.querySelectorAll(".modal-overlay").forEach(h=>{h.addEventListener("click",()=>{h.closest(".modal").classList.remove("open")})})}async function Et(t,e){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await k.getChapterImages(t,e)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(o=>{const r=document.createElement("div");r.className="cover-grid-item",r.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",r.innerHTML=`<img src="${o}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,r.addEventListener("click",()=>{const d=document.querySelector('input[name="cover-target"]:checked').value,l=o.split("/").pop();Fa(l,e,d)}),s.appendChild(r)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function Fa(t,e,s){const a=f.manga,n=document.getElementById("edit-volume-modal"),o=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const r=n.dataset.editingVolId;if(!r)throw new Error("No volume selected");await k.setVolumeCoverFromChapter(a.id,r,e,t),u("Volume cover updated","success"),o.classList.remove("open"),n.classList.remove("open"),await U(a.id),T([a.id,"volume",r])}else{await k.setMangaCoverFromChapter(a.id,e,t),u("Series cover updated","success"),o.classList.remove("open"),await U(a.id);const r=window.location.hash.replace("#","");f.activeVolumeId?T([a.id,"volume",f.activeVolumeId]):T([a.id])}}catch(r){u("Failed to set cover: "+r.message,"error")}}let G={series:null,loading:!0};function le(){if(G.loading)return`
      ${W("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=G.series;if(!t)return`
      ${W("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.entries||[],a=s.reduce((o,r)=>o+(r.chapter_count||0),0);let n=null;if(s.length>0){const o=s[0];o.local_cover&&o.bookmark_id?n=`/api/public/covers/${o.bookmark_id}/${encodeURIComponent(o.local_cover.split(/[/\\]/).pop())}`:o.localCover&&o.bookmark_id?n=`/api/public/covers/${o.bookmark_id}/${encodeURIComponent(o.localCover.split(/[/\\]/).pop())}`:o.cover&&(n=o.cover)}return`
    ${W("series")}
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
            ${s.map((o,r)=>Oa(o,r,s.length)).join("")}
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
  `}function Oa(t,e,s){var o;const a=t.alias||t.title;let n=null;return t.local_cover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.local_cover.split(/[/\\]/).pop())}`:t.localCover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(n=t.cover),`
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
  `}function qe(){var l,$,b;const t=document.getElementById("app"),e=G.series;(l=document.getElementById("back-btn"))==null||l.addEventListener("click",()=>B.go("/")),($=document.getElementById("back-library-btn"))==null||$.addEventListener("click",()=>B.go("/")),t.querySelectorAll(".series-entry-card").forEach(E=>{E.addEventListener("click",w=>{if(w.target.closest("[data-action]"))return;const v=E.dataset.id;B.go(`/manga/${v}`)})}),t.querySelectorAll("[data-action]").forEach(E=>{E.addEventListener("click",async w=>{w.stopPropagation();const v=E.dataset.action,h=E.dataset.id;switch(v){case"move-up":await $t(h,-1);break;case"move-down":await $t(h,1);break;case"set-cover":const L=E.dataset.entryid;await Va(L);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),o=document.getElementById("available-bookmarks-list"),r=document.getElementById("confirm-add-entry-btn");let d=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),o&&(o.innerHTML=""),a.classList.add("open");const E=await k.getAvailableBookmarksForSeries();d=E,E.length===0?(n&&(n.placeholder="No available manga found"),r.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),o&&(o.innerHTML=E.map(w=>`<option value="${(w.alias||w.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),r.disabled=!1)}catch{u("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),r.addEventListener("click",async()=>{const E=n?n.value:"",w=d.find(h=>(h.alias||h.title||"")===E);if(!w){u("Please select a valid manga from the list","warning");return}const v=w.id;try{r.disabled=!0,r.textContent="Adding...",await k.addSeriesEntry(e.id,v),u("Manga added to series","success"),a.classList.remove("open"),await Fe(e.id),t.innerHTML=le(),qe()}catch(h){u("Failed to add manga: "+h.message,"error")}finally{r.disabled=!1,r.textContent="Add to Series"}})),(b=document.getElementById("edit-series-btn"))==null||b.addEventListener("click",()=>{u("Edit series coming soon","info")})}async function $t(t,e){const s=G.series;if(!s)return;const a=s.entries||[],n=a.findIndex(d=>d.bookmark_id===t);if(n===-1)return;const o=n+e;if(o<0||o>=a.length)return;const r=a.map(d=>d.bookmark_id);[r[n],r[o]]=[r[o],r[n]];try{await k.post(`/series/${s.id}/reorder`,{order:r}),u("Order updated","success"),await Fe(s.id);const d=document.getElementById("app");d.innerHTML=le(),qe()}catch(d){u("Failed to reorder: "+d.message,"error")}}async function Va(t){const e=G.series;if(e)try{await k.setSeriesCover(e.id,t),u("Series cover updated","success"),await Fe(e.id);const s=document.getElementById("app");s.innerHTML=le(),qe()}catch(s){u("Failed to set cover: "+s.message,"error")}}async function Fe(t){try{const e=await k.get(`/series/${t}`);G.series=e,G.loading=!1}catch{u("Failed to load series","error"),G.loading=!1}}async function Ua(t=[]){const[e]=t;if(!e){B.go("/");return}const s=document.getElementById("app");G.loading=!0,G.series=null,s.innerHTML=le(),await Fe(e),s.innerHTML=le(),qe()}function Ha(){G.series=null,G.loading=!0}const za={mount:Ua,unmount:Ha,render:le},ja={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
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
        `;try{const s=await k.get("/settings")||{},a=document.getElementById("settings-form"),n=document.getElementById("settings-loader");s.theme&&(document.getElementById("theme").value=s.theme),n.style.display="none",a.style.display="block",a.addEventListener("submit",async o=>{o.preventDefault();const r=new FormData(a),d={};for(const[l,$]of r.entries())d[l]=$;try{await k.post("/settings/bulk",d),u("Settings saved successfully"),d.theme}catch(l){console.error(l),u("Failed to save settings","error")}})}catch(s){console.error(s),document.getElementById("settings-loader").textContent="Error loading settings"}}},Qa={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
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
        `,await Wa()}};async function Wa(){try{const t=await k.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
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
        `,e.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;nt(n),e.querySelectorAll(".table-link").forEach(o=>o.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(t){console.error(t),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function nt(t,e=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${t}...</div>`;try{const r=await k.get(`/admin/tables/${t}?page=${e}&limit=50`);if(!r.rows||r.rows.length===0){s.innerHTML=`
                <h2>${t}</h2>
                <div class="empty-state">No records found</div>
            `;return}const d=Object.keys(r.rows[0]);s.innerHTML=`
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
                            ${d.map(l=>`<th>${l}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${r.rows.map(l=>`
                            <tr>
                                ${d.map($=>{const b=l[$];let E=b;return b===null?E='<span class="null">NULL</span>':typeof b=="object"?E=JSON.stringify(b):String(b).length>100&&(E=String(b).substring(0,100)+"..."),`<td>${E}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>nt(t,e-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>nt(t,e+1))}catch(o){console.error(o),s.innerHTML=`<div class="error">Failed to load data for ${t}</div>`}}let V={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function Ga(t,e){let s=null;if(e.length>0){const n=e[0];if(n.imagePaths&&n.imagePaths.length>0){const o=n.imagePaths[0];let r;typeof o=="string"?r=o:o&&typeof o=="object"&&(r=o.filename||o.path||o.name||o.url,r&&r.includes("/")&&(r=r.split("/").pop()),r&&r.includes("\\")&&(r=r.split("\\").pop())),r&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(r)}`)}}const a=e.reduce((n,o)=>{var r;return n+(((r=o.imagePaths)==null?void 0:r.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${t}">
      <div class="manga-card-cover">
        ${s?`<img src="${s}" alt="${t}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📁</div>'">`:'<div class="placeholder">📁</div>'}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function Ka(t){const e=V.bookmarks.find(s=>s.id===t);return e?e.alias||e.title:t}function Ya(t){const e=V.bookmarks.find(s=>s.id===t);if(e&&e.seriesId){const s=V.series.find(a=>a.id===e.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function Ja(t,e,s,a=!1){return`
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
  `}function Xa(){const t={};console.log("Building trophy groups from:",V.trophyPages);for(const e of Object.keys(V.trophyPages)){const s=V.trophyPages[e];let a=0;for(const[o,r]of Object.entries(s))a+=Object.keys(r).length;if(console.log(`Manga ${e}: ${a} trophies`),a===0)continue;const n=Ya(e);if(n)t[n.id]||(t[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),t[n.id].count+=a,t[n.id].mangaIds.push(e);else{const o=Ka(e);console.log(`No series for ${e}, using name: ${o}`),t[e]={name:o,isSeries:!1,count:a,mangaIds:[e]}}}return console.log("Trophy groups result:",t),t}function Re(){if(V.loading)return`
      ${W("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:t,listOrder:e}=V.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${V.activeTab==="galleries"?"active":""}" data-tab="galleries">
        📁 Galleries
      </button>
      <button class="tab-btn ${V.activeTab==="trophies"?"active":""}" data-tab="trophies">
        🏆 Trophies
      </button>
    </div>
  `;let a="";if(V.activeTab==="galleries")e.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${e.map(o=>{const r=t&&t[o]||[];return Ga(o,r)}).join("")}
        </div>
      `;else{const n=Xa(),o=Object.keys(n);o.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${o.map(d=>{const l=n[d];return Ja(d,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${W("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function Yt(){ne();const t=document.getElementById("app");t.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{V.activeTab=s.dataset.tab,t.innerHTML=Re(),Yt()})}),t.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;B.go(`/read/gallery/${encodeURIComponent(a)}`)})}),t.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?B.go(`/read/trophies/series-${a}/🏆`):B.go(`/read/trophies/${a}/🏆`)})})}async function Za(){try{const[t,e,s,a]=await Promise.all([J.loadFavorites(),k.get("/trophy-pages"),J.loadBookmarks(),J.loadSeries()]);V.favorites=t||{favorites:{},listOrder:[]},V.trophyPages=e||{},V.bookmarks=s||[],V.series=a||[],V.loading=!1}catch(t){console.error("Failed to load favorites:",t),u("Failed to load favorites","error"),V.loading=!1}}async function en(){console.log("[Favorites] mount called"),V.loading=!0;const t=document.getElementById("app");t.innerHTML=Re(),await Za(),console.log("[Favorites] Data loaded, rendering..."),t.innerHTML=Re(),console.log("[Favorites] Calling setupListeners..."),Yt(),console.log("[Favorites] setupListeners complete")}function tn(){}const sn={mount:en,unmount:tn,render:Re};let D={downloads:{},queueTasks:[],historyTasks:[],autoCheck:null,loading:!0},Be=null,j={};function pt(t){if(!t)return"Never";const e=Date.now()-new Date(t).getTime(),s=Math.floor(e/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function an(t){if(!t)return"Not scheduled";const e=new Date(t).getTime()-Date.now();if(e<=0)return"Running now...";const s=Math.floor(e/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const o=Math.floor(a/24),r=a%24;return`in ${o}d ${r}h`}function Jt(t){switch(t){case"download":return"📥";case"scrape":return"🔍";case"scan":return"📁";default:return"⚙️"}}function mt(t){switch(t){case"running":return"var(--color-success, #4caf50)";case"queued":case"pending":return"var(--color-warning, #ff9800)";case"paused":return"var(--color-info, #2196f3)";case"complete":return"var(--color-success, #4caf50)";case"error":case"failed":case"cancelled":return"var(--color-error, #f44336)";default:return"var(--text-secondary, #999)"}}function gt(t){switch(t){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return t}}function nn(t){return!t||t==="default"?"Default (6h)":t==="daily"?"Daily":t==="weekly"?"Weekly":t}function on(){const t=D.autoCheck;return t?`
    <div class="queue-inline-header">
      <span class="text-muted">${t.enabledCount} monitored · Last: ${pt(t.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">▶ Run All Now</button>
    </div>
  `:""}function rn(t){const e=t.nextCheck?an(t.nextCheck):"Not set",s=t.nextCheck&&new Date(t.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${t.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📖</span>
          <div>
            <div class="task-title">${t.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${nn(t.schedule)}${t.day?` · ${t.day.charAt(0).toUpperCase()+t.day.slice(1)}`:""}${t.time?` · ${t.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?"⏳ Due now":e}</span>
        </div>
      </div>
    </div>
  `}function Ct(t,e){const s=e.total>0?Math.round(e.completed/e.total*100):0,a=e.status==="running"||e.status==="queued",n=e.status==="paused";return`
    <div class="queue-card task-card" data-task-id="${t}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📥</span>
          <div>
            <div class="task-title">${e.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${mt(e.status)}">${gt(e.status)}</div>
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
  `}function ln(t){const e=t.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Jt(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${mt(t.status)}">${gt(t.status)}</div>
          </div>
        </div>
      </div>
      ${t.started_at?`<div class="queue-card-body"><small>Started: ${pt(t.started_at)}</small></div>`:""}
    </div>
  `}function cn(t){const e=t.data||{},s=t.result||{};let a="";return t.type==="scrape"?s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${t.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>'):(t.type==="scan"||t.type==="scan-local")&&s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`),`
    <div class="queue-card task-card history-card" data-history-id="${t.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Jt(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${mt(t.status)}">${gt(t.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${t.completed_at?`<div class="queue-card-body"><small>Completed: ${pt(t.completed_at)}</small></div>`:""}
    </div>
  `}function dn(){var o;const t=Object.entries(D.downloads),e=t.filter(([,r])=>r.status!=="complete"),s=t.filter(([,r])=>r.status==="complete"),a=e.length+D.queueTasks.length,n=((o=D.autoCheck)==null?void 0:o.schedules)||[];return`
    ${W("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>📋 Task Queue</h2>
        ${a>0?`<span class="queue-badge">${a} active</span>`:""}
      </div>

      ${e.length>0||D.queueTasks.length>0?`
        <div class="queue-section">
          <h3 class="queue-section-title">Active Tasks</h3>
          ${e.map(([r,d])=>Ct(r,d)).join("")}
          ${D.queueTasks.map(r=>ln(r)).join("")}
        </div>
      `:""}

      ${n.length>0?`
        <div class="queue-section">
          <div class="queue-section-header">
            <h3 class="queue-section-title">Scheduled Checks (${n.length})</h3>
            ${on()}
          </div>
          ${n.map(r=>rn(r)).join("")}
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section">
          <h3 class="queue-section-title">Recently Completed Downloads</h3>
          ${s.map(([r,d])=>Ct(r,d)).join("")}
        </div>
      `:""}

      ${D.historyTasks&&D.historyTasks.length>0?`
        <div class="queue-section">
            <h3 class="queue-section-title">Task History</h3>
            <div class="history-list">
                ${D.historyTasks.map(r=>cn(r)).join("")}
            </div>
        </div>
      `:""}

      ${e.length===0&&D.queueTasks.length===0&&s.length===0&&n.length===0&&(!D.historyTasks||D.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">✨</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function re(){try{const[t,e,s,a]=await Promise.all([k.getDownloads().catch(()=>({})),k.getQueueTasks().catch(()=>[]),k.getQueueHistory(50).catch(()=>[]),k.getAutoCheckStatus().catch(()=>null)]);D.downloads=t||{},D.queueTasks=e||[],D.historyTasks=s||[],D.autoCheck=a,D.loading=!1}catch(t){console.error("[Queue] Failed to load data:",t),D.loading=!1}}function ie(){const t=document.getElementById("app");t&&(t.innerHTML=dn(),un())}function un(){ne();const t=document.getElementById("run-autocheck-btn");t&&t.addEventListener("click",async()=>{t.disabled=!0,t.textContent="⏳ Running...";try{u("Auto-check started...","info");const e=await k.runAutoCheck();u(`Check complete: ${e.checked} checked, ${e.updated} updated`,"success"),await re(),ie()}catch(e){u("Auto-check failed: "+e.message,"error"),t.disabled=!1,t.textContent="▶ Run Now"}}),document.querySelectorAll(".scheduled-manga-card").forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.mangaId;s&&(window.location.hash=`#/manga/${s}`)})}),document.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",async s=>{s.stopPropagation();const a=e.dataset.action,n=e.dataset.task;try{a==="pause"?(await k.pauseDownload(n),u("Download paused","info")):a==="resume"?(await k.resumeDownload(n),u("Download resumed","info")):a==="cancel"&&confirm("Cancel this download?")&&(await k.cancelDownload(n),u("Download cancelled","info")),await re(),ie()}catch(o){u(`Action failed: ${o.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.historyId,a=document.getElementById(`task-details-${s}`);a&&a.classList.toggle("hidden")})})}async function hn(){D.loading=!0;const t=document.getElementById("app");t.innerHTML=`
    ${W("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>📋 Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,ne(),await re(),ie(),Be=setInterval(async()=>{await re(),ie()},5e3),j.downloadProgress=e=>{e.taskId&&D.downloads[e.taskId]&&(Object.assign(D.downloads[e.taskId],e),ie())},j.downloadCompleted=e=>{re().then(ie)},j.queueUpdated=e=>{re().then(ie)},M.on(O.DOWNLOAD_PROGRESS,j.downloadProgress),M.on(O.DOWNLOAD_COMPLETED,j.downloadCompleted),M.on(O.QUEUE_UPDATED,j.queueUpdated)}function pn(){Be&&(clearInterval(Be),Be=null),j.downloadProgress&&M.off(O.DOWNLOAD_PROGRESS,j.downloadProgress),j.downloadCompleted&&M.off(O.DOWNLOAD_COMPLETED,j.downloadCompleted),j.queueUpdated&&M.off(O.QUEUE_UPDATED,j.queueUpdated),j={}}const mn={mount:hn,unmount:pn};class gn{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,s){this.routes.set(e,s)}async navigate(){console.log("[Router] navigate called");const e=window.location.hash.slice(1)||"/",[s,...a]=e.split("/").filter(Boolean),n=`/${s||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let o=this.routes.get(n);!o&&this.routes.has("/")&&(o=this.routes.get("/")),o&&(this.currentRoute=n,this.currentView=o,o.mount&&(console.log("[Router] calling mount on view module"),await o.mount(a)),ne())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),ne())}}const B=new gn;B.register("/",la);B.register("/manga",Da);B.register("/read",ga);B.register("/series",za);B.register("/settings",ja);B.register("/admin",Qa);B.register("/favorites",sn);B.register("/queue",mn);class fn{constructor(){this.currentView=null,this.mangaCache=new Map}async init(){if(console.log("[App] Initializing..."),!k.isAuthenticated()){window.location.href="/login.html";return}M.connect(),this.setupSocketListeners(),B.init(),this.hideLoading(),console.log("[App] Ready")}setupSocketListeners(){M.on(O.CHAPTER_DOWNLOADED,e=>{console.log("[Socket] Chapter downloaded:",e),this.onChapterUpdate(e)}),M.on(O.CHAPTER_HIDDEN,e=>{console.log("[Socket] Chapter hidden:",e),this.onChapterUpdate(e)}),M.on(O.CHAPTER_UNHIDDEN,e=>{console.log("[Socket] Chapter unhidden:",e),this.onChapterUpdate(e)}),M.on(O.MANGA_UPDATED,e=>{console.log("[Socket] Manga updated:",e),this.onMangaUpdate(e)}),M.on(O.DOWNLOAD_PROGRESS,e=>{this.onDownloadProgress(e)}),M.on(O.DOWNLOAD_COMPLETED,e=>{console.log("[Socket] Download completed:",e),this.showToast(`Downloaded: ${e.chapterNumber}`,"success")}),M.on(O.QUEUE_UPDATED,e=>{this.onQueueUpdate(e)}),M.on(O.ACTION_RECORDED,e=>{console.log("[Socket] Action recorded:",e),this.updateUndoButton()}),M.on(O.ACTION_UNDONE,e=>{console.log("[Socket] Action undone:",e),this.showToast("Action undone","info"),this.updateUndoButton()})}onChapterUpdate(e){window.dispatchEvent(new CustomEvent("chapter:update",{detail:e}))}onMangaUpdate(e){this.mangaCache.delete(e.mangaId),window.dispatchEvent(new CustomEvent("manga:update",{detail:e}))}onDownloadProgress(e){window.dispatchEvent(new CustomEvent("download:progress",{detail:e}))}onQueueUpdate(e){window.dispatchEvent(new CustomEvent("queue:update",{detail:e}))}async updateUndoButton(){try{const{undoableCount:e}=await k.getActions({limit:1}),s=document.getElementById("undo-btn");if(s){s.style.display=e>0?"flex":"none";const a=s.querySelector(".count");a&&(a.textContent=e)}}catch{}}showToast(e,s="info"){const a=document.createElement("div");a.className=`toast toast-${s}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}hideLoading(){const e=document.querySelector(".loading-screen");e&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),300))}}const vn=new fn;document.addEventListener("DOMContentLoaded",()=>vn.init());
