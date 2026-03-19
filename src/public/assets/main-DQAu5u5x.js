import{a as v}from"./api-BPljbFn_.js";const ie=Object.create(null);ie.open="0";ie.close="1";ie.ping="2";ie.pong="3";ie.message="4";ie.upgrade="5";ie.noop="6";const Ae=Object.create(null);Object.keys(ie).forEach(t=>{Ae[ie[t]]=t});const Xe={type:"error",data:"parser error"},At=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Pt=typeof ArrayBuffer=="function",Tt=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,ut=({type:t,data:e},s,a)=>At&&e instanceof Blob?s?a(e):Et(e,a):Pt&&(e instanceof ArrayBuffer||Tt(e))?s?a(e):Et(new Blob([e]),a):a(ie[t]+(e||"")),Et=(t,e)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];e("b"+(a||""))},s.readAsDataURL(t)};function $t(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let We;function ns(t,e){if(At&&t.data instanceof Blob)return t.data.arrayBuffer().then($t).then(e);if(Pt&&(t.data instanceof ArrayBuffer||Tt(t.data)))return e($t(t.data));ut(t,!1,s=>{We||(We=new TextEncoder),e(We.encode(s))})}const Ct="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ke=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<Ct.length;t++)ke[Ct.charCodeAt(t)]=t;const is=t=>{let e=t.length*.75,s=t.length,a,n=0,o,r,u,c;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const p=new ArrayBuffer(e),y=new Uint8Array(p);for(a=0;a<s;a+=4)o=ke[t.charCodeAt(a)],r=ke[t.charCodeAt(a+1)],u=ke[t.charCodeAt(a+2)],c=ke[t.charCodeAt(a+3)],y[n++]=o<<2|r>>4,y[n++]=(r&15)<<4|u>>2,y[n++]=(u&3)<<6|c&63;return p},os=typeof ArrayBuffer=="function",ht=(t,e)=>{if(typeof t!="string")return{type:"message",data:Mt(t,e)};const s=t.charAt(0);return s==="b"?{type:"message",data:rs(t.substring(1),e)}:Ae[s]?t.length>1?{type:Ae[s],data:t.substring(1)}:{type:Ae[s]}:Xe},rs=(t,e)=>{if(os){const s=is(t);return Mt(s,e)}else return{base64:!0,data:t}},Mt=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},Rt="",ls=(t,e)=>{const s=t.length,a=new Array(s);let n=0;t.forEach((o,r)=>{ut(o,!1,u=>{a[r]=u,++n===s&&e(a.join(Rt))})})},cs=(t,e)=>{const s=t.split(Rt),a=[];for(let n=0;n<s.length;n++){const o=ht(s[n],e);if(a.push(o),o.type==="error")break}return a};function ds(){return new TransformStream({transform(t,e){ns(t,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const o=new DataView(n.buffer);o.setUint8(0,126),o.setUint16(1,a)}else{n=new Uint8Array(9);const o=new DataView(n.buffer);o.setUint8(0,127),o.setBigUint64(1,BigInt(a))}t.data&&typeof t.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(s)})}})}let Ge;function Ie(t){return t.reduce((e,s)=>e+s.length,0)}function Be(t,e){if(t[0].length===e)return t.shift();const s=new Uint8Array(e);let a=0;for(let n=0;n<e;n++)s[n]=t[0][a++],a===t[0].length&&(t.shift(),a=0);return t.length&&a<t[0].length&&(t[0]=t[0].slice(a)),s}function us(t,e){Ge||(Ge=new TextDecoder);const s=[];let a=0,n=-1,o=!1;return new TransformStream({transform(r,u){for(s.push(r);;){if(a===0){if(Ie(s)<1)break;const c=Be(s,1);o=(c[0]&128)===128,n=c[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(Ie(s)<2)break;const c=Be(s,2);n=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),a=3}else if(a===2){if(Ie(s)<8)break;const c=Be(s,8),p=new DataView(c.buffer,c.byteOffset,c.length),y=p.getUint32(0);if(y>Math.pow(2,21)-1){u.enqueue(Xe);break}n=y*Math.pow(2,32)+p.getUint32(4),a=3}else{if(Ie(s)<n)break;const c=Be(s,n);u.enqueue(ht(o?c:Ge.decode(c),e)),a=0}if(n===0||n>t){u.enqueue(Xe);break}}}})}const Dt=4;function j(t){if(t)return hs(t)}function hs(t){for(var e in j.prototype)t[e]=j.prototype[e];return t}j.prototype.on=j.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this};j.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this};j.prototype.off=j.prototype.removeListener=j.prototype.removeAllListeners=j.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+t];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===e||a.fn===e){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+t],this};j.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),s=this._callbacks["$"+t],a=1;a<arguments.length;a++)e[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,e)}return this};j.prototype.emitReserved=j.prototype.emit;j.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};j.prototype.hasListeners=function(t){return!!this.listeners(t).length};const He=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,s)=>s(e,0),J=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),ps="arraybuffer";function Nt(t,...e){return e.reduce((s,a)=>(t.hasOwnProperty(a)&&(s[a]=t[a]),s),{})}const ms=J.setTimeout,gs=J.clearTimeout;function ze(t,e){e.useNativeTimers?(t.setTimeoutFn=ms.bind(J),t.clearTimeoutFn=gs.bind(J)):(t.setTimeoutFn=J.setTimeout.bind(J),t.clearTimeoutFn=J.clearTimeout.bind(J))}const fs=1.33;function vs(t){return typeof t=="string"?ys(t):Math.ceil((t.byteLength||t.size)*fs)}function ys(t){let e=0,s=0;for(let a=0,n=t.length;a<n;a++)e=t.charCodeAt(a),e<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(a++,s+=4);return s}function qt(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function bs(t){let e="";for(let s in t)t.hasOwnProperty(s)&&(e.length&&(e+="&"),e+=encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e}function ws(t){let e={},s=t.split("&");for(let a=0,n=s.length;a<n;a++){let o=s[a].split("=");e[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}return e}class ks extends Error{constructor(e,s,a){super(e),this.description=s,this.context=a,this.type="TransportError"}}class pt extends j{constructor(e){super(),this.writable=!1,ze(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,s,a){return super.emitReserved("error",new ks(e,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const s=ht(e,this.socket.binaryType);this.onPacket(s)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,s={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const s=bs(e);return s.length?"?"+s:""}}class Es extends pt{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const s=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};cs(e,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,ls(e,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=qt()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(e,s)}}let Ft=!1;try{Ft=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const $s=Ft;function Cs(){}class xs extends Es{constructor(e){if(super(e),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||a!==e.port}}doWrite(e,s){const a=this.request({method:"POST",data:e});a.on("success",s),a.on("error",(n,o)=>{this.onError("xhr post error",n,o)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=e}}class ne extends j{constructor(e,s,a){super(),this.createRequest=e,ze(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var e;const s=Nt(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=ne.requestsCount++,ne.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Cs,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete ne.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}ne.requestsCount=0;ne.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",xt);else if(typeof addEventListener=="function"){const t="onpagehide"in J?"pagehide":"unload";addEventListener(t,xt,!1)}}function xt(){for(let t in ne.requests)ne.requests.hasOwnProperty(t)&&ne.requests[t].abort()}const Ss=function(){const t=Ot({xdomain:!1});return t&&t.responseType!==null}();class Ls extends xs{constructor(e){super(e);const s=e&&e.forceBase64;this.supportsBinary=Ss&&!s}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new ne(Ot,this.uri(),e)}}function Ot(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||$s))return new XMLHttpRequest}catch{}if(!e)try{return new J[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Vt=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class _s extends pt{get name(){return"websocket"}doOpen(){const e=this.uri(),s=this.opts.protocols,a=Vt?{}:Nt(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;ut(a,this.supportsBinary,o=>{try{this.doWrite(a,o)}catch{}n&&He(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=qt()),this.supportsBinary||(s.b64=1),this.createUri(e,s)}}const Ke=J.WebSocket||J.MozWebSocket;class Is extends _s{createSocket(e,s,a){return Vt?new Ke(e,s,a):s?new Ke(e,s):new Ke(e)}doWrite(e,s){this.ws.send(s)}}class Bs extends pt{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const s=us(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=e.readable.pipeThrough(s).getReader(),n=ds();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const o=()=>{a.read().then(({done:u,value:c})=>{u||(this.onPacket(c),o())}).catch(u=>{})};o();const r={type:"open"};this.query.sid&&(r.data=`{"sid":"${this.query.sid}"}`),this._writer.write(r).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;this._writer.write(a).then(()=>{n&&He(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const As={websocket:Is,webtransport:Bs,polling:Ls},Ps=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Ts=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Ze(t){if(t.length>8e3)throw"URI too long";const e=t,s=t.indexOf("["),a=t.indexOf("]");s!=-1&&a!=-1&&(t=t.substring(0,s)+t.substring(s,a).replace(/:/g,";")+t.substring(a,t.length));let n=Ps.exec(t||""),o={},r=14;for(;r--;)o[Ts[r]]=n[r]||"";return s!=-1&&a!=-1&&(o.source=e,o.host=o.host.substring(1,o.host.length-1).replace(/;/g,":"),o.authority=o.authority.replace("[","").replace("]","").replace(/;/g,":"),o.ipv6uri=!0),o.pathNames=Ms(o,o.path),o.queryKey=Rs(o,o.query),o}function Ms(t,e){const s=/\/{2,9}/g,a=e.replace(s,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&a.splice(0,1),e.slice(-1)=="/"&&a.splice(a.length-1,1),a}function Rs(t,e){const s={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,o){n&&(s[n]=o)}),s}const et=typeof addEventListener=="function"&&typeof removeEventListener=="function",Pe=[];et&&addEventListener("offline",()=>{Pe.forEach(t=>t())},!1);class de extends j{constructor(e,s){if(super(),this.binaryType=ps,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(s=e,e=null),e){const a=Ze(e);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=Ze(s.host).host);ze(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=ws(this.opts.query)),et&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Pe.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const s=Object.assign({},this.opts.query);s.EIO=Dt,s.transport=e,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&de.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(e);s.open(),this.setTransport(s)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",de.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=e.data,this._onError(s);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=vs(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,He(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,s,a){return this._sendPacket("message",e,s,a),this}send(e,s,a){return this._sendPacket("message",e,s,a),this}_sendPacket(e,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const o={type:e,data:s,options:a};this.emitReserved("packetCreate",o),this.writeBuffer.push(o),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),e()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():e()}):this.upgrading?a():e()),this}_onError(e){if(de.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),et&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=Pe.indexOf(this._offlineEventListener);a!==-1&&Pe.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,s),this.writeBuffer=[],this._prevBufferLen=0}}}de.protocol=Dt;class Ds extends de{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let s=this.createTransport(e),a=!1;de.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",E=>{if(!a)if(E.type==="pong"&&E.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;de.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(y(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const h=new Error("probe error");h.transport=s.name,this.emitReserved("upgradeError",h)}}))};function o(){a||(a=!0,y(),s.close(),s=null)}const r=E=>{const h=new Error("probe error: "+E);h.transport=s.name,o(),this.emitReserved("upgradeError",h)};function u(){r("transport closed")}function c(){r("socket closed")}function p(E){s&&E.name!==s.name&&o()}const y=()=>{s.removeListener("open",n),s.removeListener("error",r),s.removeListener("close",u),this.off("close",c),this.off("upgrading",p)};s.once("open",n),s.once("error",r),s.once("close",u),this.once("close",c),this.once("upgrading",p),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const s=[];for(let a=0;a<e.length;a++)~this.transports.indexOf(e[a])&&s.push(e[a]);return s}}let Ns=class extends Ds{constructor(e,s={}){const a=typeof e=="object"?e:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>As[n]).filter(n=>!!n)),super(e,a)}};function qs(t,e="",s){let a=t;s=s||typeof location<"u"&&location,t==null&&(t=s.protocol+"//"+s.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=s.protocol+t:t=s.host+t),/^(https?|wss?):\/\//.test(t)||(typeof s<"u"?t=s.protocol+"//"+t:t="https://"+t),a=Ze(t)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const o=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+o+":"+a.port+e,a.href=a.protocol+"://"+o+(s&&s.port===a.port?"":":"+a.port),a}const Fs=typeof ArrayBuffer=="function",Os=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Ut=Object.prototype.toString,Vs=typeof Blob=="function"||typeof Blob<"u"&&Ut.call(Blob)==="[object BlobConstructor]",Us=typeof File=="function"||typeof File<"u"&&Ut.call(File)==="[object FileConstructor]";function mt(t){return Fs&&(t instanceof ArrayBuffer||Os(t))||Vs&&t instanceof Blob||Us&&t instanceof File}function Te(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let s=0,a=t.length;s<a;s++)if(Te(t[s]))return!0;return!1}if(mt(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return Te(t.toJSON(),!0);for(const s in t)if(Object.prototype.hasOwnProperty.call(t,s)&&Te(t[s]))return!0;return!1}function Hs(t){const e=[],s=t.data,a=t;return a.data=tt(s,e),a.attachments=e.length,{packet:a,buffers:e}}function tt(t,e){if(!t)return t;if(mt(t)){const s={_placeholder:!0,num:e.length};return e.push(t),s}else if(Array.isArray(t)){const s=new Array(t.length);for(let a=0;a<t.length;a++)s[a]=tt(t[a],e);return s}else if(typeof t=="object"&&!(t instanceof Date)){const s={};for(const a in t)Object.prototype.hasOwnProperty.call(t,a)&&(s[a]=tt(t[a],e));return s}return t}function zs(t,e){return t.data=st(t.data,e),delete t.attachments,t}function st(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let s=0;s<t.length;s++)t[s]=st(t[s],e);else if(typeof t=="object")for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(t[s]=st(t[s],e));return t}const js=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var R;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(R||(R={}));class Qs{constructor(e){this.replacer=e}encode(e){return(e.type===R.EVENT||e.type===R.ACK)&&Te(e)?this.encodeAsBinary({type:e.type===R.EVENT?R.BINARY_EVENT:R.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let s=""+e.type;return(e.type===R.BINARY_EVENT||e.type===R.BINARY_ACK)&&(s+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(s+=e.nsp+","),e.id!=null&&(s+=e.id),e.data!=null&&(s+=JSON.stringify(e.data,this.replacer)),s}encodeAsBinary(e){const s=Hs(e),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class gt extends j{constructor(e){super(),this.reviver=e}add(e){let s;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(e);const a=s.type===R.BINARY_EVENT;a||s.type===R.BINARY_ACK?(s.type=a?R.EVENT:R.ACK,this.reconstructor=new Ws(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(mt(e)||e.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(e),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let s=0;const a={type:Number(e.charAt(0))};if(R[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===R.BINARY_EVENT||a.type===R.BINARY_ACK){const o=s+1;for(;e.charAt(++s)!=="-"&&s!=e.length;);const r=e.substring(o,s);if(r!=Number(r)||e.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(r)}if(e.charAt(s+1)==="/"){const o=s+1;for(;++s&&!(e.charAt(s)===","||s===e.length););a.nsp=e.substring(o,s)}else a.nsp="/";const n=e.charAt(s+1);if(n!==""&&Number(n)==n){const o=s+1;for(;++s;){const r=e.charAt(s);if(r==null||Number(r)!=r){--s;break}if(s===e.length)break}a.id=Number(e.substring(o,s+1))}if(e.charAt(++s)){const o=this.tryParse(e.substr(s));if(gt.isPayloadValid(a.type,o))a.data=o;else throw new Error("invalid payload")}return a}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,s){switch(e){case R.CONNECT:return St(s);case R.DISCONNECT:return s===void 0;case R.CONNECT_ERROR:return typeof s=="string"||St(s);case R.EVENT:case R.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&js.indexOf(s[0])===-1);case R.ACK:case R.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Ws{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const s=zs(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function St(t){return Object.prototype.toString.call(t)==="[object Object]"}const Gs=Object.freeze(Object.defineProperty({__proto__:null,Decoder:gt,Encoder:Qs,get PacketType(){return R}},Symbol.toStringTag,{value:"Module"}));function te(t,e,s){return t.on(e,s),function(){t.off(e,s)}}const Ks=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Ht extends j{constructor(e,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[te(e,"open",this.onopen.bind(this)),te(e,"packet",this.onpacket.bind(this)),te(e,"error",this.onerror.bind(this)),te(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...s){var a,n,o;if(Ks.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(s.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const r={type:R.EVENT,data:s};if(r.options={},r.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const y=this.ids++,E=s.pop();this._registerAckCallback(y,E),r.id=y}const u=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,c=this.connected&&!(!((o=this.io.engine)===null||o===void 0)&&o._hasPingExpired());return this.flags.volatile&&!u||(c?(this.notifyOutgoingListeners(r),this.packet(r)):this.sendBuffer.push(r)),this.flags={},this}_registerAckCallback(e,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[e]=s;return}const o=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let u=0;u<this.sendBuffer.length;u++)this.sendBuffer[u].id===e&&this.sendBuffer.splice(u,1);s.call(this,new Error("operation has timed out"))},n),r=(...u)=>{this.io.clearTimeoutFn(o),s.apply(this,u)};r.withError=!0,this.acks[e]=r}emitWithAck(e,...s){return new Promise((a,n)=>{const o=(r,u)=>r?n(r):a(u);o.withError=!0,s.push(o),this.emit(e,...s)})}_addToQueue(e){let s;typeof e[e.length-1]=="function"&&(s=e.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...o)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...o)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!e||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:R.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(a=>String(a.id)===e)){const a=this.acks[e];delete this.acks[e],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case R.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case R.EVENT:case R.BINARY_EVENT:this.onevent(e);break;case R.ACK:case R.BINARY_ACK:this.onack(e);break;case R.DISCONNECT:this.ondisconnect();break;case R.CONNECT_ERROR:this.destroy();const a=new Error(e.data.message);a.data=e.data.data,this.emitReserved("connect_error",a);break}}onevent(e){const s=e.data||[];e.id!=null&&s.push(this.ack(e.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:R.ACK,id:e,data:n}))}}onack(e){const s=this.acks[e.id];typeof s=="function"&&(delete this.acks[e.id],s.withError&&e.data.unshift(null),s.apply(this,e.data))}onconnect(e,s){this.id=e,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:R.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,e.data)}}}function ye(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}ye.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),s=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+s:t-s}return Math.min(t,this.max)|0};ye.prototype.reset=function(){this.attempts=0};ye.prototype.setMin=function(t){this.ms=t};ye.prototype.setMax=function(t){this.max=t};ye.prototype.setJitter=function(t){this.jitter=t};class at extends j{constructor(e,s){var a;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(s=e,e=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,ze(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new ye({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=e;const n=s.parser||Gs;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var s;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(s=this.backoff)===null||s===void 0||s.setMin(e),this)}randomizationFactor(e){var s;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(s=this.backoff)===null||s===void 0||s.setJitter(e),this)}reconnectionDelayMax(e){var s;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(s=this.backoff)===null||s===void 0||s.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Ns(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=te(s,"open",function(){a.onopen(),e&&e()}),o=u=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",u),e?e(u):this.maybeReconnectOnOpen()},r=te(s,"error",o);if(this._timeout!==!1){const u=this._timeout,c=this.setTimeoutFn(()=>{n(),o(new Error("timeout")),s.close()},u);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(n),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(te(e,"ping",this.onping.bind(this)),te(e,"data",this.ondata.bind(this)),te(e,"error",this.onerror.bind(this)),te(e,"close",this.onclose.bind(this)),te(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(s){this.onclose("parse error",s)}}ondecoded(e){He(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,s){let a=this.nsps[e];return a?this._autoConnect&&!a.active&&a.connect():(a=new Ht(this,e,s),this.nsps[e]=a),a}_destroy(e){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(e){const s=this.encoder.encode(e);for(let a=0;a<s.length;a++)this.engine.write(s[a],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const we={};function Me(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const s=qs(t,e.path||"/socket.io"),a=s.source,n=s.id,o=s.path,r=we[n]&&o in we[n].nsps,u=e.forceNew||e["force new connection"]||e.multiplex===!1||r;let c;return u?c=new at(a,e):(we[n]||(we[n]=new at(a,e)),c=we[n]),s.query&&!e.query&&(e.query=s.queryKey),c.socket(s.path,e)}Object.assign(Me,{Manager:at,Socket:Ht,io:Me,connect:Me});class Ys{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=Me({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var s;this.subscribedMangas.add(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var s;this.subscribedMangas.delete(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,s){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(s),this.socket&&this.socket.on(e,s)}off(e,s){this.listeners.has(e)&&this.listeners.get(e).delete(s),this.socket&&this.socket.off(e,s)}emit(e,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(e,s)}}const Q={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone"},V=new Ys,G={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},se=new Set,U=new Map,Ee=new Map;function Js(t){return G[t]}function Xs(t,e){G[t]=e,se.add(t),Le(t)}function Zs(t,e){return Ee.has(t)||Ee.set(t,new Set),Ee.get(t).add(e),()=>{var s;return(s=Ee.get(t))==null?void 0:s.delete(e)}}function Le(t){const e=Ee.get(t);e&&e.forEach(s=>s(G[t]))}function $e(t){se.delete(t),U.delete(t)}function ea(t){return se.has(t)}async function Ce(t=!1){if(!t&&se.has("bookmarks"))return G.bookmarks;if(U.has("bookmarks"))return U.get("bookmarks");const e=v.getBookmarks().then(s=>(G.bookmarks=s||[],se.add("bookmarks"),U.delete("bookmarks"),Le("bookmarks"),G.bookmarks)).catch(s=>{throw U.delete("bookmarks"),s});return U.set("bookmarks",e),e}async function ta(t=!1){if(!t&&se.has("series"))return G.series;if(U.has("series"))return U.get("series");const e=v.get("/series").then(s=>(G.series=s||[],se.add("series"),U.delete("series"),Le("series"),G.series)).catch(s=>{throw U.delete("series"),s});return U.set("series",e),e}async function sa(t=!1){if(!t&&se.has("categories"))return G.categories;if(U.has("categories"))return U.get("categories");const e=v.get("/categories").then(s=>(G.categories=s.categories||[],se.add("categories"),U.delete("categories"),Le("categories"),G.categories)).catch(s=>{throw U.delete("categories"),s});return U.set("categories",e),e}async function aa(t=!1){if(!t&&se.has("favorites"))return G.favorites;if(U.has("favorites"))return U.get("favorites");const e=v.getFavorites().then(s=>(G.favorites=s||{favorites:{},listOrder:[]},se.add("favorites"),U.delete("favorites"),Le("favorites"),G.favorites)).catch(s=>{throw U.delete("favorites"),s});return U.set("favorites",e),e}function na(){V.on(Q.MANGA_UPDATED,()=>{$e("bookmarks"),Ce(!0)}),V.on(Q.MANGA_ADDED,()=>{$e("bookmarks"),Ce(!0)}),V.on(Q.MANGA_DELETED,()=>{$e("bookmarks"),Ce(!0)}),V.on(Q.DOWNLOAD_COMPLETED,()=>{$e("bookmarks"),Ce(!0)})}na();const ae={get:Js,set:Xs,subscribe:Zs,invalidate:$e,isLoaded:ea,loadBookmarks:Ce,loadSeries:ta,loadCategories:sa,loadFavorites:aa};function d(t,e="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=t,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}async function ia(t,e,s){try{t&&(t.disabled=!0,t.textContent="Scanning..."),e&&(e.textContent="Scanning..."),d("Scanning downloads folder...","info");const n=(await v.scanLibrary()).found||[];if(n.length===0){d("Scan complete: No new manga found","info"),s&&s();return}oa(n,s)}catch(a){d("Scan failed: "+a.message,"error")}finally{t&&(t.disabled=!1,t.textContent="📁 Scan Folder"),e&&(e.textContent="📁 Scan Folder")}}async function oa(t,e){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),o=Array.from(n).map(c=>c.dataset.folder);if(o.length===0){d("No folders selected","warning");return}const r=document.getElementById("import-all-btn");r.disabled=!0,r.textContent="Importing...";let u=0;for(const c of o)try{await v.importLocalManga(c),u++}catch(p){console.error("Failed to import",c,p)}s.remove(),d(`Imported ${u} manga`,"success"),e&&e()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function X(t="manga"){return`
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
  `}function ue(){const t=document.querySelector("header");if(t&&t.dataset.listenersBound)return;t&&(t.dataset.listenersBound="true");const e=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");e&&s&&e.addEventListener("click",()=>{s.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),o=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",o),n&&n.addEventListener("click",o),document.querySelectorAll("[data-view]").forEach(k=>{k.addEventListener("click",()=>{const g=k.dataset.view;localStorage.setItem("library_view_mode",g),document.querySelectorAll("[data-view]").forEach($=>{$.classList.toggle("active",$.dataset.view===g)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:g}}))})});const r=document.querySelector(".logo");r&&r.addEventListener("click",k=>{localStorage.removeItem("library_active_category"),window.dispatchEvent(new CustomEvent("clearFilters"))});const u=document.getElementById("favorites-btn"),c=document.getElementById("mobile-favorites-btn"),p=k=>{k.preventDefault(),P.go("/favorites")};u&&u.addEventListener("click",p),c&&c.addEventListener("click",p);const y=document.getElementById("queue-nav-btn");y&&y.addEventListener("click",k=>{k.preventDefault(),P.go("/queue")});const E=document.getElementById("scan-btn"),h=document.getElementById("mobile-scan-btn");if(E||h){const k=()=>{ia(E,h,async()=>{await ae.loadBookmarks(!0),P.reload()})};E&&E.addEventListener("click",k),h&&h.addEventListener("click",k)}}let L={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0},qe=[];function ra(t){return[...t].sort((e,s)=>{var a,n;switch(L.sortBy){case"az":return(e.alias||e.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(e.alias||e.title);case"lastread":return(s.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const o=((a=e.chapters)==null?void 0:a.length)||e.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-o}case"updated":default:return(s.updatedAt||"").localeCompare(e.updatedAt||"")}})}function ft(){let t=L.bookmarks;const e=(Array.isArray(L.categories)?L.categories:[]).filter(s=>typeof s=="object"?s.isNsfw:!1).map(s=>s.name);if(L.activeCategory==="__nsfw__"?t=t.filter(s=>(s.categories||[]).some(a=>e.includes(a))):L.activeCategory?t=t.filter(s=>(s.categories||[]).includes(L.activeCategory)):e.length>0&&(t=t.filter(s=>!(s.categories||[]).some(a=>e.includes(a)))),L.artistFilter&&(t=t.filter(s=>(s.artists||[]).includes(L.artistFilter))),L.searchQuery){const s=L.searchQuery.toLowerCase();t=t.filter(a=>(a.title||"").toLowerCase().includes(s)||(a.alias||"").toLowerCase().includes(s)||(a.artists||[]).some(n=>n.toLowerCase().includes(s)))}return ra(t)}function vt(t){var y,E,h;const e=t.alias||t.title,s=t.downloadedCount??((y=t.downloadedChapters)==null?void 0:y.length)??0,a=new Set(t.excludedChapters||[]),n=(t.chapters||[]).filter(k=>!a.has(k.number)),o=new Set(n.map(k=>k.number)).size||t.uniqueChapters||0,r=t.readCount??((E=t.readChapters)==null?void 0:E.length)??0,u=(t.updatedCount??((h=t.updatedChapters)==null?void 0:h.length)??0)>0,c=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover,p=t.source==="local";return`
    <div class="manga-card" data-id="${t.id}">
      <div class="manga-card-cover">
        ${c?`<img src="${c}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:`<div class="placeholder">${p?"💾":"📚"}</div>`}
        <div class="manga-card-badges">
          ${r>0?`<span class="badge badge-read" title="Read">${r}</span>`:""}
          <span class="badge badge-chapters" title="Total">${o}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${u?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${t.autoCheck?'<span class="badge badge-monitored" title="Auto-check enabled">⏰</span>':""}
          ${L.activeCategory==="Favorites"?'<span class="badge badge-play" title="Click to Read">▶</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function yt(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function la(t){var n;const e=t.alias||t.title,s=((n=t.entries)==null?void 0:n.length)||t.entry_count||0;let a=null;return t.localCover&&t.coverBookmarkId?a=`/api/public/covers/${t.coverBookmarkId}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(a=t.cover),`
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
  `}function Fe(){const t=localStorage.getItem("library_view_mode");if(t&&t!==L.viewMode&&(L.viewMode=t),L.activeCategory==="Favorites")return P.go("/favorites"),"";let e="";if(L.viewMode==="series"){const s=L.series.map(la).join("");e=`
      <div class="library-grid" id="library-grid">
        ${L.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const a=ft().map(vt).join("");e=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" id="library-search" placeholder="Search manga or author..." value="${L.searchQuery}" autocomplete="off">
          ${L.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${L.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${L.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${L.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${L.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${L.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
      </div>
      ${L.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">🎨</span>
          <span class="artist-filter-name">${L.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${L.loading?'<div class="loading-spinner"></div>':a||yt()}
      </div>
    `}return`
    ${X(L.viewMode)}
    <div class="container">
      ${e}
    </div>
    ${ca()}
    ${ua()}
    ${ha()}
  `}function ca(){const{activeCategory:t}=L,s=(Array.isArray(L.categories)?L.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=s.some(n=>n.isNsfw);return`
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${t?"has-filter":""}" id="category-fab-btn">
        ${t==="__nsfw__"?"🔞":t||"🏷️"}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn">⚙️</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${t?"":"active"}" data-category="">All</button>
          ${a?`<button class="category-menu-item ${t==="__nsfw__"?"active":""}" data-category="__nsfw__" style="color: #f44336;">🔞 All 18+</button>`:""}
          ${s.map(n=>`
            <button class="category-menu-item ${t===n.name?"active":""}" data-category="${n.name}">
              ${n.name}${n.isNsfw?' <span style="color:#f44336;font-size:0.75em;">18+</span>':""}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    ${da()}
      `}function da(){const e=(Array.isArray(L.categories)?L.categories:[]).map(s=>typeof s=="object"?s:{name:s,isNsfw:!1});return`
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
            ${e.map(s=>`
              <div class="category-manage-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 4px; border-bottom: 1px solid var(--border-color, #333);">
                <span style="flex: 1;">${s.name}</span>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.85em; color: ${s.isNsfw?"#f44336":"var(--text-secondary)"}">
                    <input type="checkbox" class="nsfw-toggle" data-category="${s.name}" ${s.isNsfw?"checked":""} style="width: 16px; height: 16px;">
                    18+
                  </label>
                  <button class="btn-icon small danger delete-category-btn" data-category="${s.name}" title="Delete">🗑️</button>
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
  `}function ua(){return`
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
      `}function ha(){return`
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
      `}function nt(){L.activeCategory=null,L.artistFilter=null,L.searchQuery="",localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),Y()}async function it(t){const e=t.target.closest(".manga-card");if(e){if(e.classList.contains("gallery-card")){const n=e.dataset.gallery;P.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=e.dataset.id,a=e.dataset.seriesId;if(a){P.go(`/series/${a}`);return}if(s){if(L.activeCategory==="Favorites"){const n=L.bookmarks.find(o=>o.id===s);if(n){let o=n.last_read_chapter;if(!o&&n.chapters&&n.chapters.length>0&&(o=[...n.chapters].sort((u,c)=>u.number-c.number)[0].number),o){P.go(`/read/${s}/${o}`);return}else d("No chapters available to read","warning")}}P.go(`/manga/${s}`)}}}function zt(){var I,M,O,ee,oe;const t=document.getElementById("app");t.removeEventListener("click",it),t.addEventListener("click",it),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",A=>{L.viewMode=A.detail.mode;const D=document.getElementById("app");D.innerHTML=Fe(),zt(),ue()}));const e=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");e&&s&&(e.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",A=>{const D=A.target.closest(".category-menu-item");if(D){const F=D.dataset.category||null;pa(F),s.classList.add("hidden")}})),(I=document.getElementById("manage-categories-btn"))==null||I.addEventListener("click",A=>{A.stopPropagation();const D=document.getElementById("manage-categories-modal");D&&D.classList.add("open")}),(M=document.getElementById("close-manage-categories-btn"))==null||M.addEventListener("click",()=>{var A;(A=document.getElementById("manage-categories-modal"))==null||A.classList.remove("open")}),(O=document.querySelector("#manage-categories-modal .modal-overlay"))==null||O.addEventListener("click",()=>{var A;(A=document.getElementById("manage-categories-modal"))==null||A.classList.remove("open")}),(ee=document.querySelector("#manage-categories-modal .modal-close"))==null||ee.addEventListener("click",()=>{var A;(A=document.getElementById("manage-categories-modal"))==null||A.classList.remove("open")}),(oe=document.getElementById("add-category-btn"))==null||oe.addEventListener("click",async()=>{var F;const A=document.getElementById("new-category-input"),D=(F=A==null?void 0:A.value)==null?void 0:F.trim();if(D)try{await v.post("/categories",{name:D}),A.value="",d("Category added","success"),await fe(!0),Y()}catch(re){d("Failed: "+re.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(A=>{A.addEventListener("change",async D=>{const F=A.dataset.category;try{await v.put(`/categories/${encodeURIComponent(F)}/nsfw`,{isNsfw:A.checked}),d(`${F} ${A.checked?"marked as 18+":"unmarked"}`,"success"),await fe(!0),Y()}catch(re){d("Failed: "+re.message,"error"),A.checked=!A.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(A=>{A.addEventListener("click",async()=>{const D=A.dataset.category;if(confirm(`Delete category "${D}"?`))try{await v.delete(`/categories/${encodeURIComponent(D)}`),d("Category deleted","success"),L.activeCategory===D&&(L.activeCategory=null,localStorage.removeItem("library_active_category")),await fe(!0),Y()}catch(F){d("Failed: "+F.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{L.artistFilter=null,Y()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",A=>{var F;L.searchQuery=A.target.value,localStorage.setItem("library_search",A.target.value);const D=document.getElementById("library-grid");if(D){const re=ft();D.innerHTML=re.map(vt).join("")||yt();const be=document.getElementById("search-clear");!be&&L.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(F=document.getElementById("search-clear"))==null||F.addEventListener("click",()=>{L.searchQuery="",localStorage.removeItem("library_search"),n.value="",Y()})):be&&!L.searchQuery&&be.remove()}}),L.searchQuery&&n.focus());const o=document.getElementById("search-clear");o&&o.addEventListener("click",()=>{L.searchQuery="",Y()});const r=document.getElementById("library-sort");r&&r.addEventListener("change",A=>{L.sortBy=A.target.value,localStorage.setItem("library_sort",L.sortBy),Y()}),window.removeEventListener("clearFilters",nt),window.addEventListener("clearFilters",nt);const u=document.getElementById("add-manga-btn"),c=document.getElementById("mobile-add-btn"),p=document.getElementById("add-modal"),y=document.getElementById("add-modal-close"),E=document.getElementById("add-modal-cancel"),h=document.getElementById("add-modal-submit"),k=document.getElementById("mobile-menu"),g=()=>{k&&k.classList.add("hidden"),p&&p.classList.add("open")};u&&u.addEventListener("click",g),c&&c.addEventListener("click",g),y&&y.addEventListener("click",()=>p.classList.remove("open")),E&&E.addEventListener("click",()=>p.classList.remove("open")),h&&h.addEventListener("click",async()=>{const A=document.getElementById("manga-url"),D=A.value.trim();if(!D){d("Please enter a URL","error");return}try{h.disabled=!0,h.textContent="Adding...",await v.addBookmark(D),d("Manga added successfully!","success"),p.classList.remove("open"),A.value="",await fe(),Y()}catch(F){d("Failed to add manga: "+F.message,"error")}finally{h.disabled=!1,h.textContent="Add"}});const $=document.getElementById("add-series-btn"),_=document.getElementById("mobile-add-series-btn"),S=document.getElementById("add-series-modal"),T=document.getElementById("add-series-modal-close"),B=document.getElementById("add-series-modal-cancel"),b=document.getElementById("add-series-modal-submit"),C=document.getElementById("mobile-menu");if(($||_)&&S){const A=()=>{C&&C.classList.add("hidden"),S.classList.add("open")};$&&$.addEventListener("click",A),_&&_.addEventListener("click",A)}T&&T.addEventListener("click",()=>S.classList.remove("open")),B&&B.addEventListener("click",()=>S.classList.remove("open")),b&&b.addEventListener("click",async()=>{const A=document.getElementById("series-title"),D=document.getElementById("series-alias"),F=A.value.trim(),re=D.value.trim();if(!F){d("Please enter a title","error");return}try{b.disabled=!0,b.textContent="Creating...",await v.createSeries(F,re),d("Series created successfully!","success"),S.classList.remove("open"),A.value="",D.value="",await fe(!0),Y()}catch(be){d("Failed to create series: "+be.message,"error")}finally{b.disabled=!1,b.textContent="Create"}});const l=S==null?void 0:S.querySelector(".modal-overlay");l&&l.addEventListener("click",()=>S.classList.remove("open"));const m=document.getElementById("empty-add-btn");m&&p&&m.addEventListener("click",()=>p.classList.add("open"));const w=document.getElementById("empty-add-series-btn");w&&S&&w.addEventListener("click",()=>S.classList.add("open"));const x=p==null?void 0:p.querySelector(".modal-overlay");x&&x.addEventListener("click",()=>p.classList.remove("open")),ue()}function pa(t){L.activeCategory=t,t?localStorage.setItem("library_active_category",t):localStorage.removeItem("library_active_category"),Y()}async function fe(t=!1){try{const[e,s,a,n]=await Promise.all([ae.loadBookmarks(t),ae.loadCategories(t),ae.loadSeries(t),ae.loadFavorites(t)]);L.bookmarks=e,L.categories=s,L.series=a,L.favorites=n,L.loading=!1}catch{d("Failed to load library","error"),L.loading=!1}}async function Y(){const t=document.getElementById("app"),e=localStorage.getItem("library_active_category");L.activeCategory!==e&&(L.activeCategory=e);const s=localStorage.getItem("library_artist_filter");s&&L.artistFilter!==s&&(L.artistFilter=s);const a=localStorage.getItem("library_search")||"";L.searchQuery!==a&&(L.searchQuery=a),L.loading&&(t.innerHTML=Fe()),L.bookmarks.length===0&&L.loading&&await fe(),t.innerHTML=Fe(),zt(),qe.forEach(n=>n()),qe=[ae.subscribe("bookmarks",n=>{L.bookmarks=n;const o=document.getElementById("library-grid");if(o){const r=ft();o.innerHTML=r.map(vt).join("")||yt()}})]}function ma(){const t=document.getElementById("app");t&&t.removeEventListener("click",it),window.removeEventListener("clearFilters",nt),qe.forEach(e=>e()),qe=[]}const ga={mount:Y,unmount:ma,render:Fe};let i={manga:null,chapter:null,images:[],trophyPages:{},mode:"webtoon",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!1,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null};function jt(){if(!i.manga||!i.chapter||!i.allFavorites||!i.allFavorites.favorites)return!1;if(i.isCollectionMode)return!0;let e=[rt()];if(i.mode==="manga"&&!i.singlePageMode){const n=H()[i.currentPage];n&&Array.isArray(n)?e=n:n&&n.pages&&(e=n.pages)}const s=e.map(a=>{const n=Se(i.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in i.allFavorites.favorites){const n=i.allFavorites.favorites[a];if(Array.isArray(n)){for(const o of n)if(o.mangaId===i.manga.id&&o.chapterNum===i.chapter.number&&o.imagePaths)for(const r of o.imagePaths){const u=typeof r=="string"?r:(r==null?void 0:r.filename)||(r==null?void 0:r.path);for(const c of s)if(c&&c.filename===u)return!0}}}return!1}function ot(){const t=document.getElementById("favorites-btn");t&&(jt()?t.classList.add("active"):t.classList.remove("active"))}function ge(){var p;if(i.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!i.manga||!i.images.length)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const t=i.manga.alias||i.manga.title,e=(p=i.chapter)==null?void 0:p.number,a=H().length,n=i.images.length;let o,r;i.mode==="webtoon"?(o=n-1,r=`${n} pages`):i.singlePageMode?(o=n-1,r=`${i.currentPage+1} / ${n}`):(o=a-1,r=`${i.currentPage+1} / ${a}`);const u=jt(),c=Kt();return`
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
        ${i.isCollectionMode?Qt():i.mode==="webtoon"?Wt():Gt()}
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
  `}function Qt(){const t=i.mode==="manga";if(t&&!i.singlePageMode){const e=i.images[i.currentPage];if(!e)return"";const s=e.urls||[e.url],a=e.displayMode||"single";return e.displaySide,a==="double"&&s.length>=2?`
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
  `}function Wt(){return`
    <div class="webtoon-pages">
      ${i.images.map((t,e)=>{const s=typeof t=="string"?t:t.url,a=i.trophyPages[e];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${e}">
          ${a?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${s}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function Gt(){if(i.singlePageMode)return fa();const e=H()[i.currentPage];if(!e)return"";if(e.type==="link"){const s=e.pages[0],a=i.images[s],n=typeof a=="string"?a:a.url,o=i.trophyPages[s];return`
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
  `}function fa(){const t=i.currentPage,e=i.trophyPages[t];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[o,r]=e.pages,u=i.images[o],c=i.images[r],p=typeof u=="string"?u:u==null?void 0:u.url,y=typeof c=="string"?c:c==null?void 0:c.url;if(p&&y)return`
            <div class="manga-spread ${i.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${p}" alt="Page ${o+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${y}" alt="Page ${r+1}"></div>
            </div>
            `}const s=i.images[t];if(!s)return"";const a=typeof s=="string"?s:s.url,n=i.trophyPages[t];return`
    <div class="manga-spread single ${i.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?'<div class="trophy-indicator">🏆</div>':""}
        <img src="${a}" alt="Page ${t+1}">
      </div>
    </div>
  `}function H(){const t=[],e=i.images.length;let s=0;if(i.isCollectionMode){for(let n=0;n<e;n++)t.push([n]);return t}let a=!i.firstPageSingle;for(;s<e;){const n=i.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[o,r]=n.pages;t.push([o,r]),s=Math.max(o,r)+1}else t.push([s]),s++;continue}if(!a){a=!0,t.push([s]),s++;continue}if(i.lastPageSingle&&s===e-1){i.nextChapterImage?t.push({type:"link",pages:[s],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):t.push([s]),s++;break}s+1<e?i.trophyPages[s+1]?(t.push([s]),s++):i.lastPageSingle&&s+1===e-1?(t.push([s]),i.nextChapterImage?t.push({type:"link",pages:[s+1],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):t.push([s+1]),s+=2):(t.push([s,s+1]),s+=2):(t.push([s]),s++)}return t}function Kt(){if(i.singlePageMode)return!!i.trophyPages[i.currentPage];const e=H()[i.currentPage];return e?(Array.isArray(e)?e:e.pages||[]).some(a=>!!i.trophyPages[a]):!1}function Yt(){if(i.singlePageMode)return[i.currentPage];const e=H()[i.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function va(){if(!i.manga||!i.chapter||i.isCollectionMode)return;const t=Yt();if(t.length===0)return;if(t.some(s=>!!i.trophyPages[s])){const s=[...t];if(i.singlePageMode){const a=i.trophyPages[i.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete i.trophyPages[a]),d(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=t,a=i.singlePageMode||t.length===1;if(!i.singlePageMode&&t.length===2){const o=await Zt(t,"Mark as trophy 🏆");if(!o)return;s=o.pages,a=o.pages.length===1}s.forEach(o=>{i.trophyPages[o]={isSingle:a,pages:[...s]}});const n=a?"single":"double";d(`Page${s.length>1?"s":""} marked as trophy (${n}) 🏆`,"success")}try{await v.saveTrophyPages(i.manga.id,i.chapter.number,i.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}ce(),Jt()}function Jt(){const t=document.getElementById("trophy-btn");if(t){const e=Kt();t.classList.toggle("active",e),t.title=e?"Unmark trophy":"Mark as trophy"}}async function _e(){if(!i.manga||!i.chapter||i.isCollectionMode||!i.images.length)return;let t=1;if(i.mode==="manga")if(i.singlePageMode)t=i.currentPage+1;else{const s=H()[i.currentPage];s&&s.length>0&&(t=s[0]+1)}else{const e=document.getElementById("reader-content");if(e){const s=e.querySelectorAll("img"),a=e.scrollTop;let n=0;s.forEach((o,r)=>{a>=n&&(t=r+1),n+=o.offsetHeight})}}try{await v.updateReadingProgress(i.manga.id,i.chapter.number,t,i.images.length)}catch(e){console.error("Failed to save progress:",e)}}function Oe(){var s,a,n,o,r,u,c,p,y,E,h,k,g,$,_,S,T,B;const t=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{await _e(),await pe(),i.manga&&i.manga.id!=="gallery"?P.go(`/manga/${i.manga.id}`):P.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{P.go("/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var b;(b=document.getElementById("reader-settings"))==null||b.classList.toggle("hidden")}),(o=document.getElementById("close-settings-btn"))==null||o.addEventListener("click",()=>{var b;(b=document.getElementById("reader-settings"))==null||b.classList.add("hidden")}),(r=document.getElementById("single-page-btn"))==null||r.addEventListener("click",()=>{if(i.singlePageMode){const b=H();let C=0;for(let l=0;l<b.length;l++)if(b[l].includes(i.currentPage)){C=l;break}i.singlePageMode=!1,i.currentPage=C}else{const C=H()[i.currentPage];i.singlePageMode=!0,i.currentPage=C?C[0]:0}De()}),(u=document.getElementById("trophy-btn"))==null||u.addEventListener("click",()=>{va()}),t.querySelectorAll("[data-mode]").forEach(b=>{b.addEventListener("click",()=>{var m,w;const C=b.dataset.mode;let l=rt();if(i.mode=C,localStorage.setItem("reader_mode",i.mode),C==="webtoon")i.currentPage=l;else if(i.singlePageMode)i.currentPage=l;else{const x=H();let I=0;for(let M=0;M<x.length;M++)if(x[M].includes(l)){I=M;break}i.currentPage=I}(m=i.manga)!=null&&m.id&&((w=i.chapter)!=null&&w.number)&&pe(),De(),C==="webtoon"&&setTimeout(()=>{const x=document.getElementById("reader-content");if(x){const I=x.querySelectorAll("img");I[l]&&I[l].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),t.querySelectorAll("[data-direction]").forEach(b=>{b.addEventListener("click",async()=>{var C,l;i.direction=b.dataset.direction,localStorage.setItem("reader_direction",i.direction),(C=i.manga)!=null&&C.id&&((l=i.chapter)!=null&&l.number)&&await pe(),De()})}),(c=document.getElementById("first-page-single"))==null||c.addEventListener("change",async b=>{i.firstPageSingle=b.target.checked,await pe(),ce()}),(p=document.getElementById("last-page-single"))==null||p.addEventListener("change",async b=>{var C,l;i.lastPageSingle=b.target.checked,await pe(),i.lastPageSingle&&((C=i.manga)!=null&&C.id)&&((l=i.chapter)!=null&&l.number)?await Xt():(i.nextChapterImage=null,i.nextChapterNum=null),ce()}),(y=document.getElementById("zoom-slider"))==null||y.addEventListener("input",b=>{i.zoom=parseInt(b.target.value);const C=document.getElementById("reader-content");C&&(C.style.zoom=`${i.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",b=>{const C=parseInt(b.target.value),l=document.getElementById("page-indicator");l&&(i.singlePageMode?l.textContent=`${C+1} / ${i.images.length}`:l.textContent=`${C+1} / ${H().length}`)}),e.addEventListener("change",b=>{i.currentPage=parseInt(b.target.value),ce()})),i.mode==="manga"){const b=document.getElementById("reader-content");b==null||b.addEventListener("click",C=>{var x;if(C.target.closest("button, a, .link-overlay"))return;const l=b.getBoundingClientRect(),w=(C.clientX-l.left)/l.width;w<.3?lt():w>.7?Re():(i.showControls=!i.showControls,(x=document.querySelector(".reader"))==null||x.classList.toggle("controls-hidden",!i.showControls))})}document.addEventListener("keydown",es),(E=document.getElementById("prev-chapter-btn"))==null||E.addEventListener("click",()=>Ve(-1)),(h=document.getElementById("next-chapter-btn"))==null||h.addEventListener("click",()=>Ve(1)),i.mode==="webtoon"&&((k=document.getElementById("reader-content"))==null||k.addEventListener("click",()=>{var b;i.showControls=!i.showControls,(b=document.querySelector(".reader"))==null||b.classList.toggle("controls-hidden",!i.showControls)})),(g=document.getElementById("rotate-btn"))==null||g.addEventListener("click",async()=>{const b=Ye();if(!(!b||!i.manga||!i.chapter))try{d("Rotating...","info");const C=await v.rotatePage(i.manga.id,i.chapter.number,b);C.images&&(await Je(C.images),d("Page rotated","success"))}catch(C){d("Rotate failed: "+C.message,"error")}}),($=document.getElementById("swap-btn"))==null||$.addEventListener("click",async()=>{const C=H()[i.currentPage];if(!C||C.length!==2||!i.manga||!i.chapter){d("Select a spread with 2 pages to swap","info");return}const l=Se(i.images[C[0]]),m=Se(i.images[C[1]]);if(!(!l||!m))try{d("Swapping...","info");const w=await v.swapPages(i.manga.id,i.chapter.number,l,m);w.images&&(await Je(w.images),d("Pages swapped","success"))}catch(w){d("Swap failed: "+w.message,"error")}}),(_=document.getElementById("split-btn"))==null||_.addEventListener("click",async()=>{const b=Ye();if(!b||!i.manga||!i.chapter||!confirm("Split this page into halves? This is permanent."))return;const C=document.getElementById("split-btn");try{d("Preparing to split...","info"),C&&(C.disabled=!0),i.images=[],i.loading=!0,t.innerHTML=ge(),await new Promise(m=>setTimeout(m,2e3)),d("Splitting page...","info");const l=await v.splitPage(i.manga.id,i.chapter.number,b);C&&(C.disabled=!1),await he(i.manga.id,i.chapter.number,i.chapter.versionUrl),t.innerHTML=ge(),Oe(),ce(),l.warning?d(l.warning,"warning"):d("Page split into halves","success")}catch(l){C&&(C.disabled=!1),d("Split failed: "+l.message,"error"),await he(i.manga.id,i.chapter.number,i.chapter.versionUrl),t.innerHTML=ge(),Oe()}}),(S=document.getElementById("delete-page-btn"))==null||S.addEventListener("click",async()=>{const b=Ye();if(!(!b||!i.manga||!i.chapter)&&confirm(`Delete page "${b}" permanently? This cannot be undone.`))try{d("Deleting...","info");const C=await v.deletePage(i.manga.id,i.chapter.number,b);C.images&&(await Je(C.images),d("Page deleted","success"))}catch(C){d("Delete failed: "+C.message,"error")}}),(T=document.getElementById("favorites-btn"))==null||T.addEventListener("click",async()=>{try{const l=await v.getFavorites();i.allFavorites=l,i.favoriteLists=Object.keys(l.favorites||l||{})}catch(l){console.error("Failed to load favorites",l),d("Failed to load favorites","error");return}let C=[rt()];if(i.mode==="manga"&&!i.singlePageMode){const m=H()[i.currentPage];m&&Array.isArray(m)?C=m:m&&m.pages&&(C=m.pages)}if(C.length>1){const l=await Zt(C,"Select Page for Favorites ⭐");if(!l)return;C=l.pages}wa(C)}),(B=document.getElementById("fullscreen-btn"))==null||B.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{d("Fullscreen not supported","info")})}),document.body.classList.add("reader-active")}function Se(t){var n;const e=typeof t=="string"?t:(t==null?void 0:t.url)||((n=t==null?void 0:t.urls)==null?void 0:n[0]);if(!e)return null;const a=e.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function Ye(){const t=Yt();return t.length===0?null:Se(i.images[t[0]])}async function Je(t){const e=Date.now();if(i.images=t.map(s=>s+(s.includes("?")?"&":"?")+`_t=${e}`),i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.min(i.currentPage,i.images.length-1);else{const s=H();i.currentPage=Math.min(i.currentPage,s.length-1)}i.currentPage=Math.max(0,i.currentPage),ce()}async function Xt(){var t,e;if(!(!((t=i.manga)!=null&&t.id)||!((e=i.chapter)!=null&&e.number)))try{const s=await v.getNextChapterPreview(i.manga.id,i.chapter.number);i.nextChapterImage=s.firstImage||null,i.nextChapterNum=s.nextChapter||null}catch{i.nextChapterImage=null,i.nextChapterNum=null}}async function ya(){var o,r;if(!((o=i.manga)!=null&&o.id)||!((r=i.chapter)!=null&&r.number)||i.isCollectionMode)return;const e=[...i.manga.downloadedChapters||[]].sort((u,c)=>u-c),s=e.indexOf(i.chapter.number);if(s<0||s>=e.length-1)return;const a=e[s+1],n=i.manga.id;if(!(i._preloadCache&&i._preloadCache.chapterNum===a&&i._preloadCache.mangaId===n))try{const c=(i.manga.downloadedVersions||{})[a]||[],p=Array.isArray(c)?c[0]:c,y=p?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(p)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,h=(await v.get(y)).images||[];if(h.length===0)return;const k=h.map(g=>{const $=new Image,_=typeof g=="string"?g:g.url;return _&&($.src=_),$});i._preloadCache={chapterNum:a,mangaId:n,images:h,imageObjects:k,versionUrl:p},console.log(`[Reader] Preloaded ${h.length} images for chapter ${a}`)}catch(u){console.warn("[Reader] Failed to preload next chapter:",u)}}function ba(t,e){return new Promise(s=>{const a=document.createElement("div");a.className="version-modal-overlay",a.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${t.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const n=a.querySelector(".version-list");t.forEach((o,r)=>{const u=document.createElement("button");u.className="version-item",u.textContent=`Version ${r+1}`,u.addEventListener("click",()=>{a.remove(),s(o)}),n.appendChild(u)}),a.querySelector(".version-cancel").addEventListener("click",()=>{a.remove(),s(null)}),a.addEventListener("click",o=>{o.target===a&&(a.remove(),s(null))}),document.body.appendChild(a)})}function wa(t){if(!i.manga||!i.chapter)return;const e=t.map(c=>{const p=Se(i.images[c]);return p?{filename:p}:null}).filter(Boolean),s=c=>{if(!i.allFavorites||!i.allFavorites.favorites)return-1;const p=i.allFavorites.favorites[c];if(!Array.isArray(p))return-1;for(let y=0;y<p.length;y++){const E=p[y];if(E.mangaId===i.manga.id&&E.chapterNum===i.chapter.number&&E.imagePaths)for(const h of E.imagePaths){const k=typeof h=="string"?h:(h==null?void 0:h.filename)||(h==null?void 0:h.path);for(const g of e)if(g&&g.filename===k)return y}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";i.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',i.favoriteLists.forEach(c=>{const y=s(c)!==-1;n+=`
                <button class="page-picker-option list-option ${y?"active-list":""}" data-list="${c}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${c}</span>
                    <span style="font-size: 1.2em;">${y?"✅":"➕"}</span>
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
    `,a.appendChild(o),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),ot()}),a.addEventListener("click",c=>{c.target===a&&(a.remove(),ot())}),a.querySelectorAll(".list-option").forEach(c=>{c.addEventListener("click",async()=>{const p=c.dataset.list,y=s(p),E=y!==-1;c.style.opacity="0.5",c.style.pointerEvents="none";try{if(E){await v.removeFavoriteItem(p,y);const h=await v.getFavorites();i.allFavorites=h,c.classList.remove("active-list"),c.querySelector("span:last-child").textContent="➕"}else{const h=t.length>1?"double":"single",k={mangaId:i.manga.id,chapterNum:i.chapter.number,title:`${i.manga.alias||i.manga.title} Ch.${i.chapter.number} p${t[0]+1}`,imagePaths:e,displayMode:h,displaySide:i.direction==="rtl"?"right":"left"};await v.addFavoriteItem(p,k);const g=await v.getFavorites();i.allFavorites=g,c.classList.add("active-list"),c.querySelector("span:last-child").textContent="✅"}}catch(h){console.error(h)}finally{c.style.opacity="1",c.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function Zt(t,e){return new Promise(s=>{const[a,n]=t,o=i.images[a],r=i.images[n],u=typeof o=="string"?o:o==null?void 0:o.url,c=typeof r=="string"?r:r==null?void 0:r.url,p=i.direction==="rtl",y=p?n:a,E=p?a:n,h=p?c:u,k=p?u:c,g=document.createElement("div");g.className="page-picker-overlay",g.innerHTML=`
            <div class="page-picker-modal">
                <h3>${e}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${y+1}">
                        <img src="${h}" alt="Page ${y+1}">
                        <span class="page-picker-label">Page ${y+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${E+1}">
                        <img src="${k}" alt="Page ${E+1}">
                        <span class="page-picker-label">Page ${E+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    📖 Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const $=_=>{g.remove(),s(_)};g.querySelectorAll(".page-picker-option").forEach(_=>{_.addEventListener("click",()=>{const S=_.dataset.choice;S==="left"?$({pages:[y]}):S==="right"?$({pages:[E]}):S==="both"&&$({pages:t})})}),g.querySelector(".page-picker-cancel").addEventListener("click",()=>$(null)),g.addEventListener("click",_=>{_.target===g&&$(null)}),document.body.appendChild(g)})}function rt(){if(i.mode==="webtoon"){const t=document.getElementById("reader-content");if(t){const e=t.querySelectorAll("img");if(e.length>0){const s=t.scrollTop;if(s>10){let a=0;for(let n=0;n<e.length;n++){const o=e[n].offsetHeight;if(a+o>s)return n;a+=o}}}}return 0}else{if(i.singlePageMode)return i.currentPage;{const e=H()[i.currentPage];return e&&e.length>0?e[0]:0}}}function es(t){if(!(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA")){if(t.key==="Escape"){_e(),i.manga&&P.go(`/manga/${i.manga.id}`);return}if(i.mode==="manga")t.key==="ArrowLeft"?i.direction==="rtl"?Re():lt():t.key==="ArrowRight"?i.direction==="rtl"?lt():Re():t.key===" "&&(t.preventDefault(),Re());else if(i.mode==="webtoon"&&t.key===" "){t.preventDefault();const e=document.getElementById("reader-content");if(e){const s=e.clientHeight*.8;e.scrollBy({top:t.shiftKey?-s:s,behavior:"smooth"})}}}}function Re(){const t=H(),e=i.singlePageMode?i.images.length-1:t.length-1;if(i.currentPage<e)i.currentPage++,ce();else{const s=t[i.currentPage],a=s&&s.type==="link";_e(),a&&(i.navigationDirection="next-linked"),Ve(1)}}function lt(){i.currentPage>0?(i.currentPage--,ce()):Ve(-1)}function ce(){const t=document.getElementById("reader-content");if(t){t.innerHTML=i.isCollectionMode?Qt():i.mode==="webtoon"?Wt():Gt();const e=document.getElementById("page-indicator");e&&(i.singlePageMode?e.textContent=`${i.currentPage+1} / ${i.images.length}`:e.textContent=`${i.currentPage+1} / ${H().length}`);const s=document.getElementById("page-slider");s&&(s.value=i.currentPage,s.max=i.singlePageMode?i.images.length-1:H().length-1),Jt(),ot()}}function De(){const t=document.getElementById("app");t&&(t.innerHTML=ge(),Oe())}async function Ve(t){if(console.log("[Nav] navigateChapter called with delta:",t),!i.manga||!i.chapter){console.log("[Nav] early return - no manga or chapter");return}await _e(),await pe();const s=[...i.manga.downloadedChapters||[]].sort((o,r)=>o-r),a=s.indexOf(i.chapter.number),n=a+t;if(console.log("[Nav]",{delta:t,chapterNumber:i.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length){i.navigationDirection||(i.navigationDirection=t<0?"prev":null);const o=s[n],u=(i.manga.downloadedVersions||{})[o]||[],c=Array.isArray(u)?u[0]:u,p=c?`?version=${encodeURIComponent(c)}`:"";console.log("[Nav] Calling router.go with:",`/read/${i.manga.id}/${o}${p}`),P.go(`/read/${i.manga.id}/${o}${p}`)}else d(t>0?"Last chapter":"First chapter","info")}async function he(t,e,s){var a,n,o,r,u;console.log("[Reader] loadData called:",{mangaId:t,chapterNum:e,versionUrl:s});try{if(i.mode=localStorage.getItem("reader_mode")||"webtoon",i.direction=localStorage.getItem("reader_direction")||"rtl",t==="gallery"){const y=decodeURIComponent(e),h=((a=(await v.getFavorites()).favorites)==null?void 0:a[y])||[];i.images=[];for(const k of h){const g=k.imagePaths||[],$=[];for(const _ of g){let S;typeof _=="string"?S=_:_&&typeof _=="object"&&(S=_.filename||_.path||_.name||_.url,S&&S.includes("/")&&(S=S.split("/").pop()),S&&S.includes("\\")&&(S=S.split("\\").pop())),S&&$.push(`/api/public/chapter-images/${k.mangaId}/${k.chapterNum}/${encodeURIComponent(S)}`)}$.length>0&&i.images.push({urls:$,displayMode:k.displayMode||"single",displaySide:k.displaySide||"left"})}i.manga={id:"gallery",title:y,alias:y},i.chapter={number:"Gallery"},i.isGalleryMode=!0,i.isCollectionMode=!0,i.images.length===0&&d("Gallery is empty","warning")}else if(t==="trophies"){const y=e;let E=[],h="Trophies";if(y.startsWith("series-")){const k=y.replace("series-",""),$=(await store.loadSeries()).find(T=>T.id===k);h=$?$.alias||$.title:"Series Trophies";const S=(await store.loadBookmarks()).filter(T=>T.seriesId===k);for(const T of S){const B=await v.getTrophyPagesAll(T.id);for(const b in B)for(const C in B[b]){const l=B[b][C],w=(await v.getChapterImages(T.id,b)).images[C],x=typeof w=="string"?w.split("/").pop():(w==null?void 0:w.filename)||(w==null?void 0:w.path);E.push({mangaId:T.id,chapterNum:b,imagePaths:[{filename:x}],displayMode:l.isSingle?"single":"double",displaySide:"left"})}}}else{const k=await v.getBookmark(y);h=k?k.alias||k.title:"Manga Trophies";const g=await v.getTrophyPagesAll(y);for(const $ in g)for(const _ in g[$]){const S=g[$][_],B=(await v.getChapterImages(y,$)).images[_],b=typeof B=="string"?B.split("/").pop():(B==null?void 0:B.filename)||(B==null?void 0:B.path);E.push({mangaId:y,chapterNum:$,imagePaths:[{filename:decodeURIComponent(b)}],displayMode:S.isSingle?"single":"double",displaySide:"left"})}}i.images=E.map(k=>{const g=k.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${k.mangaId}/${k.chapterNum}/${encodeURIComponent(g)}`],displayMode:k.displayMode,displaySide:k.displaySide}}),i.manga={id:"trophies",title:h,alias:h},i.chapter={number:"🏆"},i.isCollectionMode=!0,i.isGalleryMode=!1}else{i.isGalleryMode=!1;const y=await v.getBookmark(t);i.manga=y,console.log("[Reader] manga loaded, finding chapter..."),i.chapter=((n=y.chapters)==null?void 0:n.find(h=>h.number===parseFloat(e)))||{number:parseFloat(e)};const E=parseFloat(e);if(i._preloadCache&&i._preloadCache.mangaId===t&&i._preloadCache.chapterNum===E)console.log("[Reader] Using preloaded images for chapter",e),i.images=i._preloadCache.images||[],i._preloadCache=null;else{const h=s?`/bookmarks/${t}/chapters/${e}/reader-images?version=${encodeURIComponent(s)}`:`/bookmarks/${t}/chapters/${e}/reader-images`,k=await v.get(h);console.log("[Reader] images loaded, count:",(o=k.images)==null?void 0:o.length),i.images=k.images||[]}try{const h=await v.getChapterSettings(t,e);if(h&&(h.mode||h.direction||h.firstPageSingle!==void 0||h.lastPageSingle!==void 0))h.mode&&(i.mode=h.mode),h.direction&&(i.direction=h.direction),h.firstPageSingle!==void 0&&(i.firstPageSingle=h.firstPageSingle),h.lastPageSingle!==void 0&&(i.lastPageSingle=h.lastPageSingle);else try{const $=[...i.manga.downloadedChapters||[]].sort((B,b)=>B-b),_=parseFloat(e),S=$.indexOf(_),T=[];S>0&&T.push($[S-1]),S<$.length-1&&T.push($[S+1]);for(const B of T){const b=await v.getChapterSettings(t,B);if(b&&(b.mode||b.direction||b.firstPageSingle!==void 0||b.lastPageSingle!==void 0)){b.mode&&(i.mode=b.mode),b.direction&&(i.direction=b.direction),b.firstPageSingle!==void 0&&(i.firstPageSingle=b.firstPageSingle),b.lastPageSingle!==void 0&&(i.lastPageSingle=b.lastPageSingle),console.log("[Reader] Inherited settings from chapter",B);break}}}catch(g){console.warn("Failed to inherit chapter settings",g)}}catch(h){console.warn("Failed to load chapter settings",h)}try{const h=await v.getTrophyPages(t,e);i.trophyPages=h||{}}catch(h){console.warn("Failed to load trophy pages",h)}try{const h=await v.getFavorites();i.allFavorites=h,i.favoriteLists=Object.keys(h.favorites||h||{})}catch(h){console.warn("Failed to load favorites",h)}}const c=parseFloat(e),p=(u=(r=i.manga)==null?void 0:r.readingProgress)==null?void 0:u[c];if(p&&p.page<p.totalPages)if(i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,p.page-1);else{const y=Math.max(0,p.page-1),E=H();let h=0;for(let k=0;k<E.length;k++){const g=E[k],$=Array.isArray(g)?g:g.pages||[];if($.includes(y)||$[0]>=y){h=k;break}h=k}i.currentPage=h}else i.currentPage=0,i._resumeScrollToPage=p.page-1;else i.currentPage=0}catch(c){console.error("Error loading chapter:",c),d("Failed to load chapter","error")}if(i.navigationDirection==="prev"&&i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,i.images.length-1);else{const c=H();i.currentPage=Math.max(0,c.length-1)}else if(i.navigationDirection==="next-linked"&&i.mode==="manga"&&i.images.length>1)if(i.singlePageMode)i.currentPage=1;else{const c=H();let p=0;for(let y=0;y<c.length;y++){const E=c[y];if((Array.isArray(E)?E:E.pages||[]).includes(1)){p=y;break}}i.currentPage=p}i.navigationDirection=null,i.lastPageSingle&&await Xt(),i.loading=!1,De(),ya(),i.mode==="webtoon"&&i._resumeScrollToPage&&setTimeout(()=>{const c=document.getElementById("reader-content");if(c){const p=c.querySelectorAll("img");p[i._resumeScrollToPage]&&p[i._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete i._resumeScrollToPage},300)}async function ka(t=[]){console.log("[Reader] mount called with params:",t);let[e,s]=t,a=null;if(s&&s.includes("?")){const[o,r]=s.split("?");s=o,a=new URLSearchParams(r).get("version")}if(console.log("[Reader] mangaId:",e,"chapterNum:",s,"urlVersion:",a),!e||!s){P.go("/");return}const n=document.getElementById("app");if(i.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),i.images=[],i.singlePageMode=!1,i._resumeScrollToPage=null,i.nextChapterImage=null,i.nextChapterNum=null,n.innerHTML=ge(),a)await he(e,s,decodeURIComponent(a));else try{const o=await v.getBookmark(e),r=o.downloadedVersions||{},u=new Set(o.deletedChapterUrls||[]),c=r[parseFloat(s)];let p=[];if(Array.isArray(c)&&(p=c.filter(y=>!u.has(y))),p.length>1){const y=await ba(p,s);if(y===null){P.go(`/manga/${e}`);return}await he(e,s,y)}else p.length===1?await he(e,s,p[0]):await he(e,s)}catch(o){console.log("[Reader] Error in version check, falling back:",o),await he(e,s)}if(n.innerHTML=ge(),console.log("[Reader] render called, loading:",i.loading,"manga:",!!i.manga,"images:",i.images.length),Oe(),i.mode==="webtoon"&&i._resumeScrollToPage!=null){const o=i._resumeScrollToPage;i._resumeScrollToPage=null,setTimeout(()=>{const r=document.getElementById("reader-content");if(r){const u=r.querySelectorAll("img");u[o]&&u[o].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function Ea(){console.log("[Reader] unmount called"),await _e(),await pe(),document.body.classList.remove("reader-active"),document.removeEventListener("keydown",es),i.manga=null,i.chapter=null,i.images=[],i.loading=!0,i.singlePageMode=!1,i._resumeScrollToPage=null,i._preloadCache=null}async function pe(){if(!(!i.manga||!i.chapter||i.manga.id==="gallery"))try{await v.updateChapterSettings(i.manga.id,i.chapter.number,{mode:i.mode,direction:i.direction,firstPageSingle:i.firstPageSingle,lastPageSingle:i.lastPageSingle})}catch(t){console.error("Failed to save settings:",t)}}async function ts(t){try{const e=await v.getBookmark(t),s=e.downloadedChapters||[],a=new Set(e.readChapters||[]),n=e.readingProgress||{},o=e.downloadedVersions||{},r=[...s].sort((c,p)=>c-p);let u=null;for(const c of r){const p=n[c];if(p&&p.page<p.totalPages&&!a.has(c)){u=c;break}}if(u===null){for(const c of r)if(!a.has(c)){u=c;break}}if(u===null&&r.length>0&&(u=r[0]),u!==null){const c=o[u]||[],p=Array.isArray(c)?c[0]:c,y=p?`?version=${encodeURIComponent(p)}`:"";P.go(`/read/${t}/${u}${y}`)}else d("No downloaded chapters to read","info")}catch(e){d("Failed to continue reading: "+e.message,"error")}}const $a={mount:ka,unmount:Ea,render:ge,continueReading:ts},xe=50;let f={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1};function Ca(t){return t.autoCheck===!0?`<button class="btn btn-primary" id="schedule-btn">⏰ ${t.checkSchedule==="weekly"?`${(t.checkDay||"monday").charAt(0).toUpperCase()+(t.checkDay||"monday").slice(1)} ${t.checkTime||"06:00"}`:t.checkSchedule==="daily"?`Daily ${t.checkTime||"06:00"}`:"Every 6h"}</button>`:'<button class="btn btn-secondary" id="schedule-btn">⏰ Schedule</button>'}function xa(t){const e=t.autoCheck===!0,s=t.checkSchedule||"daily",a=t.checkDay||"monday",n=t.checkTime||"06:00",o=t.autoDownload||!1;return`
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
  `}function ct(){var C;if(f.loading)return`
      ${X()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=f.manga;if(!t)return`
      ${X()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.chapters||[],a=new Set(t.downloadedChapters||[]),n=new Set(t.readChapters||[]),o=new Set(t.excludedChapters||[]),r=new Set(t.deletedChapterUrls||[]),u=t.volumes||[],c=new Set;u.forEach(l=>{(l.chapters||[]).forEach(m=>c.add(m))});let p;f.filter==="hidden"?p=s.filter(l=>o.has(l.number)||r.has(l.url)):p=s.filter(l=>!o.has(l.number)&&!r.has(l.url));const y=p.filter(l=>!c.has(l.number));let E=[];if(f.activeVolume){const l=new Set(f.activeVolume.chapters||[]);E=p.filter(m=>l.has(m.number))}else E=y;const h=new Map;E.forEach(l=>{h.has(l.number)||h.set(l.number,[]),h.get(l.number).push(l)});let k=Array.from(h.entries()).sort((l,m)=>l[0]-m[0]);f.filter==="downloaded"?k=k.filter(([l])=>a.has(l)):f.filter==="not-downloaded"?k=k.filter(([l])=>!a.has(l)):f.filter==="main"?k=k.filter(([l])=>Number.isInteger(l)):f.filter==="extra"&&(k=k.filter(([l])=>!Number.isInteger(l)));const g=Math.max(1,Math.ceil(k.length/xe));f.currentPage>=g&&(f.currentPage=Math.max(0,g-1));const $=f.currentPage*xe,S=[...k.slice($,$+xe)].reverse(),T=h.size,B=[...h.keys()].filter(l=>a.has(l)).length;n.size;let b="";if(f.activeVolume){const l=f.activeVolume;let m=null;l.local_cover?m=`/api/public/covers/${t.id}/${encodeURIComponent(l.local_cover.split(/[/\\]/).pop())}`:l.cover&&(m=l.cover),b=`
      ${X()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${m?`<img src="${m}" alt="${l.name}">`:'<div class="placeholder">📚</div>'}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${t.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${l.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${T} Chapters</span>
                ${B>0?`<span class="meta-item downloaded">${B} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${t.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${f.manageChapters?"Done Managing":"➕ Add Chapters"}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${l.id}">✏️ Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const l=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover;b=`
        ${X()}
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
                  <span class="meta-item">${((C=t.chapters)==null?void 0:C.length)||0} Total Chapters</span>
                  ${a.size>0?`<span class="meta-item downloaded">${a.size} Downloaded</span>`:""}
                  ${n.size>0?`<span class="meta-item">${n.size} Read</span>`:""}
                </div>
                ${(t.artists||[]).length>0||(t.categories||[]).length>0?`
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(t.artists||[]).length>0?`
                    <span class="meta-label">Author:</span>
                    ${t.artists.map(m=>`<a href="#//" class="artist-link" data-artist="${m}">${m}</a>`).join(", ")}
                  `:""}
                  ${(t.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(t.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${t.categories.map(m=>`<span class="tag">${m}</span>`).join("")}
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
              ${Ca(t)}
            </div>
            ${t.description?`<p class="manga-description">${t.description}</p>`:""}
            ${f.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">📦 CBZ Files (${f.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${f.cbzFiles.map(m=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${m.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${m.chapterNumber?`Chapter ${m.chapterNumber}`:"Unknown chapter"}
                        ${m.isExtracted?" | ✅ Extracted":""}
                      </div>
                    </div>
                    <button class="btn btn-small ${m.isExtracted?"btn-secondary":"btn-primary"}" 
                            data-cbz-path="${encodeURIComponent(m.path)}" 
                            data-cbz-chapter="${m.chapterNumber||1}"
                            data-cbz-extracted="${m.isExtracted}">
                      ${m.isExtracted?"Re-Extract":"Extract"}
                    </button>
                  </div>
                `).join("")}
              </div>
            </div>
            `:""}
          </div>
        </div>
      `}return`
    ${b}
        
        ${f.activeVolume?f.manageChapters?Ba(t,y):"":Aa(t,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${f.filter==="all"?"active":""}" data-filter="all">
                All (${h.size})
              </button>
              <button class="filter-btn ${f.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${B})
              </button>
              <button class="filter-btn ${f.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${f.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${g>1?Lt(g):""}
          
          <div class="chapter-list">
            ${S.map(([l,m])=>Ia(l,m,a,n,t)).join("")}
          </div>
          
          ${g>1?Lt(g):""}
        </div>
      ${_a()}
    </div>
  `}function Sa(){const t=f.manga;return t?`
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
  `:""}function La(){const t=f.manga;return t?`
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
  `:""}function _a(){var e,s;const t=f.manga;return`
    ${t?xa(t):""}
    ${Wa()}
    ${Sa()}
    ${La()}

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
  `}function Ia(t,e,s,a,n){var b,C,l,m;const o=s.has(t),r=a.has(t),u=!Number.isInteger(t),c=((b=n.downloadedVersions)==null?void 0:b[t])||[],p=new Set(n.deletedChapterUrls||[]),y=e.filter(w=>f.filter==="hidden"?!0:!p.has(w.url)),E=!!f.activeVolume;let h=y;E&&(h=y.filter(w=>Array.isArray(c)?c.includes(w.url):c===w.url)),h.sort((w,x)=>{const I=Array.isArray(c)?c.includes(w.url):c===w.url;return((Array.isArray(c)?c.includes(x.url):c===x.url)?1:0)-(I?1:0)});const k=h.length>1,g=(C=h[0])!=null&&C.url?encodeURIComponent(h[0].url):null,$=n.chapterSettings||{},_=E?!0:(l=$[t])==null?void 0:l.locked,S=["chapter-item",o?"downloaded":"",r?"read":"",u?"extra":""].filter(Boolean).join(" "),T=k?`
    <div class="versions-dropdown hidden" id="versions-${t}">
      ${h.map(w=>{const x=encodeURIComponent(w.url),I=Array.isArray(c)?c.includes(w.url):c===w.url,M=w.url.startsWith("local://");return`
          <div class="version-row ${I?"downloaded":""}"
               data-version-url="${x}" data-num="${t}">
            <span class="version-title" style="cursor: pointer; flex: 1;">${w.title||w.releaseGroup||"Version"}${M?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}</span>
            <div class="version-actions">
              ${I?`<button class="btn-icon small success" data-action="read-version" data-num="${t}" data-url="${x}">▶</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${t}" data-url="${x}">🗑️</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${t}" data-url="${x}">↓</button>`}
              ${p.has(w.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${t}" data-url="${x}" title="Restore Version">↩️</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${t}" data-url="${x}" title="Hide Version">👁️‍🗨️</button>`}
            </div>
          </div>
        `}).join("")}
    </div>
  `:"",B=(n.excludedChapters||[]).includes(t);return`
    <div class="chapter-group" data-chapter="${t}">
      <div class="${S}" data-num="${t}" style="${B?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${t}</span>
        <span class="chapter-title">
          ${h[0]?h[0].title!==`Chapter ${t}`?h[0].title:"":e[0].title}
          ${B?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
        </span>
        ${u?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${B?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${t}" title="Restore Chapter">↩️</button>`:E?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${f.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${t}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${_?"locked":""}"
                        data-action="lock" data-num="${t}"
                        title="${_?"Unlock":"Lock"}">
                  ${_?"🔒":"🔓"}
                </button>`}
          ${!B&&g?p.has((m=h[0])==null?void 0:m.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${t}" data-url="${g}" title="Unhide Chapter">↩️</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${t}" data-url="${g}" title="Hide Chapter">👁️‍🗨️</button>`:""}
          <button class="btn-icon small ${r?"success":"muted"}"
                  data-action="read" data-num="${t}"
                  title="${r?"Mark unread":"Mark read"}">
            ${r?"👁️":"○"}
          </button>
          ${o?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${t}" data-url="${g}" title="Delete Files">🗑️</button>`:`<button class="btn-icon small ${o?"success":""}"
              data-action="download" data-num="${t}"
              title="${o?"Downloaded":"Download"}">
          ${o?"✓":"↓"}
        </button>`}
          ${k?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${t}">
              ${y.length} ▼
            </button>
          `:""}
        </div>
      </div>
      ${T}
    </div>
  `}function Lt(t){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${f.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${f.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${f.currentPage+1} of ${t}</span>
      <button class="btn btn-icon" data-page="next" ${f.currentPage>=t-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${f.currentPage>=t-1?"disabled":""}>»</button>
    </div>
  `}function Ba(t,e){return e.length===0?`
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
  `}function Aa(t,e){var n;const s=t.volumes||[];return s.length===0?"":`
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
  `}function Pa(){var s,a,n,o,r,u,c,p,y,E,h,k,g,$,_,S,T,B,b,C;const t=document.getElementById("app"),e=f.manga;e&&((s=document.getElementById("back-btn"))==null||s.addEventListener("click",()=>P.go("/")),(a=document.getElementById("back-library-btn"))==null||a.addEventListener("click",()=>P.go("/")),t.querySelectorAll(".artist-link").forEach(l=>{l.addEventListener("click",m=>{m.preventDefault();const w=l.dataset.artist;w&&(localStorage.setItem("library_search",w),localStorage.removeItem("library_artist_filter"),P.go("/"))})}),(n=document.getElementById("continue-btn"))==null||n.addEventListener("click",()=>{ts(e.id)}),(o=document.getElementById("download-all-btn"))==null||o.addEventListener("click",()=>{const l=document.getElementById("download-all-modal");l&&l.classList.add("open")}),(r=document.getElementById("confirm-download-all-btn"))==null||r.addEventListener("click",async()=>{var l;try{d("Queueing downloads...","info");const m=document.getElementsByName("download-version-mode");let w="single";for(const I of m)I.checked&&(w=I.value);(l=document.getElementById("download-all-modal"))==null||l.classList.remove("open");const x=await v.post(`/bookmarks/${e.id}/download`,{all:!0,versionMode:w});x.chaptersCount>0?d(`Download queued: ${x.chaptersCount} versions`,"success"):d("Already have these chapters downloaded","info")}catch(m){d("Failed to download: "+m.message,"error")}}),(u=document.getElementById("check-updates-btn"))==null||u.addEventListener("click",async()=>{try{d("Checking for updates...","info"),await v.post(`/bookmarks/${e.id}/quick-check`),d("Check complete!","success")}catch(l){d("Check failed: "+l.message,"error")}}),(c=document.getElementById("schedule-btn"))==null||c.addEventListener("click",()=>{const l=document.getElementById("schedule-modal");l&&l.classList.add("open")}),(p=document.getElementById("schedule-type"))==null||p.addEventListener("change",l=>{const m=document.getElementById("schedule-day-group");m&&(m.style.display=l.target.value==="weekly"?"":"none")}),(y=document.getElementById("save-schedule-btn"))==null||y.addEventListener("click",async()=>{var l;try{const m=document.getElementById("schedule-type").value,w=document.getElementById("schedule-day").value,x=document.getElementById("schedule-time").value,I=document.getElementById("auto-download-toggle").checked;await v.updateAutoCheckSchedule(e.id,{enabled:!0,schedule:m,day:w,time:x,autoDownload:I}),f.manga.checkSchedule=m,f.manga.checkDay=w,f.manga.checkTime=x,f.manga.autoDownload=I,(l=document.getElementById("schedule-modal"))==null||l.classList.remove("open"),N([e.id]),d("Schedule updated","success")}catch(m){d("Failed to save schedule: "+m.message,"error")}}),(E=document.getElementById("disable-schedule-btn"))==null||E.addEventListener("click",async()=>{var l;try{await v.toggleAutoCheck(e.id,!1),f.manga.autoCheck=!1,f.manga.checkSchedule=null,f.manga.checkDay=null,f.manga.checkTime=null,f.manga.nextCheck=null,(l=document.getElementById("schedule-modal"))==null||l.classList.remove("open"),N([e.id]),d("Auto-check disabled","success")}catch(m){d("Failed to disable: "+m.message,"error")}}),(h=document.getElementById("refresh-btn"))==null||h.addEventListener("click",async()=>{const l=document.getElementById("refresh-btn");try{l.disabled=!0,l.textContent="⏳ Checking...",d("Checking for updates...","info"),await v.post(`/bookmarks/${e.id}/check`),await z(e.id),N([e.id]),d("Check complete!","success")}catch(m){d("Check failed: "+m.message,"error"),l&&(l.disabled=!1,l.textContent="🔄 Refresh")}}),(k=document.getElementById("scan-folder-btn"))==null||k.addEventListener("click",async()=>{var m,w;const l=document.getElementById("scan-folder-btn");try{l.disabled=!0,l.textContent="⏳ Scanning...",d("Scanning folder...","info");const x=await v.scanBookmark(e.id);await z(e.id),N([e.id]);const I=((m=x.addedChapters)==null?void 0:m.length)||0,M=((w=x.removedChapters)==null?void 0:w.length)||0;I>0||M>0?d(`Scan complete: ${I} added, ${M} removed`,"success"):d("Scan complete: No changes","info")}catch(x){d("Scan failed: "+x.message,"error")}finally{l&&(l.disabled=!1,l.textContent="📁 Scan Folder")}}),document.querySelectorAll("[data-cbz-path]").forEach(l=>{l.addEventListener("click",async()=>{const m=decodeURIComponent(l.dataset.cbzPath),w=parseInt(l.dataset.cbzChapter)||1,x=l.dataset.cbzExtracted==="true",I=prompt("Enter chapter number for extraction:",String(w));if(!I)return;const M=parseFloat(I);if(isNaN(M)){d("Invalid chapter number","error");return}try{l.disabled=!0,l.textContent="Extracting...",d("Extracting CBZ...","info"),await v.extractCbz(e.id,m,M,{forceReExtract:x}),d("CBZ extracted successfully!","success"),await z(e.id),N([e.id])}catch(O){d("Extract failed: "+O.message,"error")}finally{l.disabled=!1,l.textContent=x?"Re-Extract":"Extract"}})}),(g=document.getElementById("edit-btn"))==null||g.addEventListener("click",async()=>{const l=document.getElementById("edit-manga-modal");if(l){document.getElementById("edit-alias-input").value=e.alias||"",window._selectedCoverPath=null;try{const[m,w]=await Promise.all([v.getAllArtists(),v.getAllCategories()]),x=document.getElementById("artist-list"),I=document.getElementById("category-list");window._allArtists=m,window._allCategories=w,x&&(x.innerHTML=m.map(ee=>`<option value="${ee}">`).join("")),I&&(I.innerHTML=w.map(ee=>`<option value="${ee}">`).join(""));const M=document.getElementById("edit-artist-input"),O=document.getElementById("edit-categories-input");M==null||M.addEventListener("input",()=>{const ee=M.value.toLowerCase(),oe=M.value.lastIndexOf(","),A=M.value.substring(oe+1).trim().toLowerCase();if(A.length>0&&window._allArtists){const D=window._allArtists.filter(F=>F.toLowerCase().includes(A));if(x&&D.length>0){const F=oe>=0?M.value.substring(0,oe+1)+" ":"";x.innerHTML=D.map(re=>`<option value="${F}${re}">`).join("")}}}),O==null||O.addEventListener("input",()=>{const ee=O.value.lastIndexOf(","),oe=O.value.substring(ee+1).trim().toLowerCase();if(oe.length>0&&window._allCategories){const A=window._allCategories.filter(D=>D.toLowerCase().includes(oe));if(I&&A.length>0){const D=ee>=0?O.value.substring(0,ee+1)+" ":"";I.innerHTML=A.map(F=>`<option value="${D}${F}">`).join("")}}})}catch(m){console.error("Failed to load artists/categories:",m)}l.classList.add("open")}}),($=document.getElementById("save-manga-btn"))==null||$.addEventListener("click",async()=>{var l;try{const m=document.getElementById("edit-alias-input").value.trim(),w=document.getElementById("edit-artist-input").value.trim(),x=document.getElementById("edit-categories-input").value.trim(),I=w?w.split(",").map(O=>O.trim()).filter(O=>O):[],M=x?x.split(",").map(O=>O.trim()).filter(O=>O):[];await v.updateBookmark(e.id,{alias:m||null}),await v.setBookmarkArtists(e.id,I),await v.setBookmarkCategories(e.id,M),window._selectedCoverPath&&await v.setBookmarkCoverFromImage(e.id,window._selectedCoverPath),f.manga.alias=m||null,f.manga.artists=I,f.manga.categories=M,(l=document.getElementById("edit-manga-modal"))==null||l.classList.remove("open"),N([e.id]),d("Manga updated","success")}catch(m){d("Failed to update: "+m.message,"error")}}),(_=document.getElementById("change-cover-btn"))==null||_.addEventListener("click",async()=>{try{d("Loading images...","info");const l=await v.getFolderImages(e.id);if(l.length===0){d("No images found in manga folder","warning");return}const m=document.createElement("div");m.id="cover-select-modal",m.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",m.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${l.slice(0,50).map(w=>`
              <div class="cover-option" data-path="${w.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(w.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${l.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${l.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(m),document.getElementById("close-cover-modal").addEventListener("click",()=>m.remove()),m.addEventListener("click",w=>{w.target===m&&m.remove()}),m.querySelectorAll(".cover-option").forEach(w=>{w.addEventListener("click",()=>{window._selectedCoverPath=w.dataset.path;const x=document.getElementById("cover-preview");x&&(x.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),m.remove(),d("Cover selected","success")})})}catch(l){d("Failed to load images: "+l.message,"error")}}),(S=document.getElementById("delete-manga-btn"))==null||S.addEventListener("click",()=>{const l=document.getElementById("delete-manga-modal");l&&l.classList.add("open")}),(T=document.getElementById("confirm-delete-manga-btn"))==null||T.addEventListener("click",async()=>{var m,w;const l=((m=document.getElementById("delete-files-toggle"))==null?void 0:m.checked)||!1;try{await v.deleteBookmark(e.id,l),(w=document.getElementById("delete-manga-modal"))==null||w.classList.remove("open"),d("Manga deleted","success"),P.go("/")}catch(x){d("Failed to delete: "+x.message,"error")}}),(B=document.getElementById("quick-check-btn"))==null||B.addEventListener("click",async()=>{const l=document.getElementById("quick-check-btn");try{l.disabled=!0,l.textContent="⏳ Checking...",d("Quick checking for updates...","info");const m=await v.post(`/bookmarks/${e.id}/quick-check`);await z(e.id),N([e.id]),m.newChaptersCount>0?d(`Found ${m.newChaptersCount} new chapter(s)!`,"success"):d("No new chapters found","info")}catch(m){d("Quick check failed: "+m.message,"error")}finally{l&&(l.disabled=!1,l.textContent="⚡ Quick Check")}}),(b=document.getElementById("source-label"))==null||b.addEventListener("click",()=>{const l=document.getElementById("migrate-source-modal");l&&l.classList.add("open")}),(C=document.getElementById("confirm-migrate-btn"))==null||C.addEventListener("click",async()=>{var w,x,I;const l=(x=(w=document.getElementById("migrate-url-input"))==null?void 0:w.value)==null?void 0:x.trim();if(!l){d("Please enter a URL","warning");return}const m=document.getElementById("confirm-migrate-btn");try{m.disabled=!0,m.textContent="Migrating...",d("Migrating source...","info");const M=await v.migrateSource(e.id,l);d(`Migrated! ${M.migratedChapters} chapters preserved as local`,"success"),d("Running full check on new source...","info"),await v.post(`/bookmarks/${e.id}/check`),(I=document.getElementById("migrate-source-modal"))==null||I.classList.remove("open"),await z(e.id),N([e.id]),d("Source migration complete!","success")}catch(M){d("Migration failed: "+M.message,"error")}finally{m&&(m.disabled=!1,m.textContent="Migrate Source")}}),t.querySelectorAll(".filter-btn").forEach(l=>{l.addEventListener("click",()=>{f.filter=l.dataset.filter,f.currentPage=0,N([e.id])})}),t.querySelectorAll("[data-page]").forEach(l=>{l.addEventListener("click",()=>{const m=l.dataset.page,w=Math.ceil(f.manga.chapters.length/xe);switch(m){case"first":f.currentPage=0;break;case"prev":f.currentPage=Math.max(0,f.currentPage-1);break;case"next":f.currentPage=Math.min(w-1,f.currentPage+1);break;case"last":f.currentPage=w-1;break}N([e.id])})}),t.querySelectorAll(".chapter-item").forEach(l=>{l.addEventListener("click",m=>{var I;if(m.target.closest(".chapter-actions"))return;const w=parseFloat(l.dataset.num);if((e.downloadedChapters||[]).includes(w)){const M=((I=e.downloadedVersions)==null?void 0:I[w])||[],O=Array.isArray(M)?M[0]:M;O?P.go(`/read/${e.id}/${w}?version=${encodeURIComponent(O)}`):P.go(`/read/${e.id}/${w}`)}else d("Chapter not downloaded","info")})}),t.querySelectorAll("[data-action]").forEach(l=>{l.addEventListener("click",async m=>{m.stopPropagation();const w=l.dataset.action,x=parseFloat(l.dataset.num),I=l.dataset.url?decodeURIComponent(l.dataset.url):null;switch(w){case"lock":await Ta(x);break;case"read":await Ma(x);break;case"download":await Ra(x);break;case"versions":Da(x);break;case"read-version":P.go(`/read/${e.id}/${x}?version=${encodeURIComponent(I)}`);break;case"download-version":await Na(x,I);break;case"delete-version":await qa(x,I);break;case"hide-version":await Fa(x,I);break;case"restore-version":await Oa(x,I);break;case"restore-chapter":await Va(x);break;case"delete-chapter":await Ua(x,I);break;case"hide-chapter":await Ha(x,I);break;case"unhide-chapter":await za(x,I);break}})}),t.querySelectorAll(".version-row .version-title").forEach(l=>{l.addEventListener("click",m=>{m.stopPropagation();const w=l.closest(".version-row"),x=parseFloat(w.dataset.num),I=w.dataset.versionUrl?decodeURIComponent(w.dataset.versionUrl):null;w.classList.contains("downloaded")&&I?P.go(`/read/${e.id}/${x}?version=${encodeURIComponent(I)}`):d("Version not downloaded yet","info")})}),t.querySelectorAll(".volume-card").forEach(l=>{l.addEventListener("click",()=>{const m=l.dataset.volumeId;P.go(`/manga/${e.id}/volume/${m}`)})}),Ga(t),ue(),V.subscribeToManga(e.id))}async function Ta(t){var n;const e=f.manga,s=((n=e.chapterSettings)==null?void 0:n[t])||{},a=!s.locked;try{a?await v.lockChapter(e.id,t):await v.unlockChapter(e.id,t),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[t]={...s,locked:a},d(a?"Chapter locked":"Chapter unlocked","success"),N([e.id])}catch(o){d("Failed: "+o.message,"error")}}async function Ma(t){const e=f.manga,s=new Set(e.readChapters||[]),a=s.has(t);try{await v.post(`/bookmarks/${e.id}/chapters/${t}/read`,{read:!a}),a?s.delete(t):s.add(t),e.readChapters=[...s],d(a?"Marked unread":"Marked read","success"),N([e.id])}catch(n){d("Failed: "+n.message,"error")}}async function Ra(t){const e=f.manga,s=new Set(e.deletedChapterUrls||[]),a=(e.chapters||[]).find(n=>n.number===t&&!s.has(n.url));try{d(`Downloading chapter ${t}...`,"info"),a?await v.post(`/bookmarks/${e.id}/download-version`,{chapterNumber:t,url:a.url}):await v.post(`/bookmarks/${e.id}/download`,{chapters:[t]}),d("Download queued!","success")}catch(n){d("Failed: "+n.message,"error")}}function Da(t){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${t}`&&s.classList.add("hidden")});const e=document.getElementById(`versions-${t}`);e&&e.classList.toggle("hidden")}async function Na(t,e){const s=f.manga;try{d("Downloading version...","info"),await v.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:t,url:e}),d("Download queued!","success")}catch(a){d("Failed: "+a.message,"error")}}async function qa(t,e){const s=f.manga;try{await v.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),d("Version deleted","success"),await z(s.id),N([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function Fa(t,e){const s=f.manga;try{await v.hideVersion(s.id,t,e),d("Version hidden","success"),await z(s.id),N([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function Oa(t,e){const s=f.manga;try{await v.unhideVersion(s.id,t,e),d("Version restored","success"),await z(s.id),N([s.id])}catch(a){d("Failed to restore version: "+a.message,"error")}}async function Va(t){const e=f.manga;try{await v.unexcludeChapter(e.id,t),d("Chapter restored","success"),await z(e.id),N([e.id])}catch(s){d("Failed to restore chapter: "+s.message,"error")}}async function Ua(t,e){const s=f.manga;if(confirm("Delete this chapter's files from disk?"))try{await v.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),d("Chapter files deleted","success"),await z(s.id),N([s.id])}catch(a){d("Failed to delete: "+a.message,"error")}}async function Ha(t,e){const s=f.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await v.hideVersion(s.id,t,e),d("Chapter hidden","success"),await z(s.id),N([s.id])}catch(a){d("Failed to hide chapter: "+a.message,"error")}}async function za(t,e){const s=f.manga;try{await v.unhideVersion(s.id,t,e),d("Chapter unhidden","success"),await z(s.id),N([s.id])}catch(a){d("Failed to unhide chapter: "+a.message,"error")}}async function z(t){try{const[e,s]=await Promise.all([v.getBookmark(t),ae.loadCategories()]);if(f.manga=e,f.categories=s,f.loading=!1,e.website==="Local")try{const o=await v.getCbzFiles(t);f.cbzFiles=o||[]}catch(o){console.error("Failed to load CBZ files:",o),f.cbzFiles=[]}else f.cbzFiles=[];const a=new Set((e.chapters||[]).map(o=>o.number)).size,n=Math.ceil(a/xe);f.currentPage=Math.max(0,n-1),f.activeVolumeId?f.activeVolume=(e.volumes||[]).find(o=>o.id===f.activeVolumeId):f.activeVolume=null}catch{d("Failed to load manga","error"),f.loading=!1}}async function N(t=[]){const[e,s,a]=t;if(!e){P.go("/");return}f.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!f.manga||f.manga.id!==e?(f.loading=!0,f.manga=null,n.innerHTML=ct(),await z(e)):f.activeVolumeId?f.activeVolume=(f.manga.volumes||[]).find(o=>o.id===f.activeVolumeId):f.activeVolume=null,n.innerHTML=ct(),Pa()}function ja(){f.manga&&V.unsubscribeFromManga(f.manga.id),f.manga=null,f.loading=!0}const Qa={mount:N,unmount:ja,render:ct};function Wa(){return`
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
  `}function Ga(t){const e=f.manga;if(!e)return;const s=t.querySelector("#add-volume-btn"),a=t.querySelector("#add-volume-modal"),n=t.querySelector("#add-volume-submit-btn");s&&a&&s.addEventListener("click",()=>{a.classList.add("open"),t.querySelector("#add-volume-name-input").focus()}),a==null||a.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(g=>{g.addEventListener("click",()=>a.classList.remove("open"))}),n&&n.addEventListener("click",async()=>{const g=t.querySelector("#add-volume-name-input").value.trim();if(!g)return d("Please enter a volume name","error");try{n.disabled=!0,n.textContent="Creating...",await v.createVolume(e.id,g),d("Volume created successfully!","success"),a.classList.remove("open"),t.querySelector("#add-volume-name-input").value="",await z(e.id),N([e.id])}catch($){d("Failed to create volume: "+$.message,"error")}finally{n.disabled=!1,n.textContent="Create Volume"}});const o=t.querySelector("#manage-chapters-btn");o&&o.addEventListener("click",()=>{f.manageChapters=!f.manageChapters,N([e.id,"volume",f.activeVolumeId])}),t.querySelectorAll(".add-to-vol-btn").forEach(g=>{g.addEventListener("click",async()=>{const $=parseFloat(g.dataset.num),_=f.activeVolume;if(_)try{g.disabled=!0,g.textContent="...";const S=_.chapters||[];if(S.includes($))return;const T=[...S,$].sort((B,b)=>B-b);await v.updateVolumeChapters(e.id,_.id,T),d(`Chapter ${$} added to volume`,"success"),await z(e.id),N([e.id,"volume",_.id])}catch(S){d("Failed to add chapter: "+S.message,"error"),g.disabled=!1,g.textContent="Add"}})}),t.querySelectorAll(".remove-from-vol-btn").forEach(g=>{g.addEventListener("click",async $=>{$.stopPropagation();const _=parseFloat(g.dataset.num),S=f.activeVolume;if(S)try{g.disabled=!0,g.textContent="...";const B=(S.chapters||[]).filter(b=>b!==_);await v.updateVolumeChapters(e.id,S.id,B),d(`Chapter ${_} removed from volume`,"success"),await z(e.id),N([e.id,"volume",S.id])}catch(T){d("Failed to remove chapter: "+T.message,"error"),g.disabled=!1,g.textContent="×"}})});const r=t.querySelector("#edit-vol-btn"),u=t.querySelector("#edit-volume-modal");r&&u&&r.addEventListener("click",()=>{const g=r.dataset.volId,$=e.volumes.find(_=>_.id===g);$&&(t.querySelector("#volume-name-input").value=$.name,u.dataset.editingVolId=g,u.classList.add("open"))});const c=t.querySelector("#save-volume-btn");c&&c.addEventListener("click",async()=>{const g=u.dataset.editingVolId,$=t.querySelector("#volume-name-input").value.trim();if(!$)return d("Volume name cannot be empty","error");try{await v.renameVolume(e.id,g,$),d("Volume renamed","success"),u.classList.remove("open"),await z(e.id),N([e.id,"volume",g])}catch(_){d(_.message,"error")}});const p=t.querySelector("#delete-volume-btn");p&&p.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const g=u.dataset.editingVolId;try{await v.deleteVolume(e.id,g),d("Volume deleted","success"),u.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch($){d($.message,"error")}});const y=t.querySelector("#vol-cover-upload-btn");if(y){let g=document.getElementById("vol-cover-input-hidden");g||(g=document.createElement("input"),g.type="file",g.id="vol-cover-input-hidden",g.accept="image/*",g.style.display="none",document.body.appendChild(g),g.addEventListener("change",async $=>{const _=$.target.files[0];if(!_)return;const S=u.dataset.editingVolId;if(S)try{g.value="",y.disabled=!0,y.textContent="Uploading...",await v.uploadVolumeCover(e.id,S,_),d("Cover uploaded","success"),await z(e.id),N([e.id,"volume",S])}catch(T){d("Upload failed: "+T.message,"error")}finally{y.disabled=!1,y.innerHTML="📤 Upload Image"}})),y.addEventListener("click",()=>g.click())}const E=t.querySelector("#vol-cover-selector-btn"),h=t.querySelector("#cover-selector-modal");E&&h&&E.addEventListener("click",async()=>{const g=h.querySelector("#cover-chapter-select");g.innerHTML='<option value="">Select a chapter...</option>';const $=t.querySelector("#edit-volume-modal"),_=$?$.dataset.editingVolId:null;let S=[...e.chapters||[]];if(_){const B=e.volumes.find(b=>b.id===_);if(B&&B.chapters){const b=new Set(B.chapters);S=S.filter(C=>b.has(C.number))}}S.sort((B,b)=>B.number-b.number);const T=new Set;S.forEach(B=>{if(!T.has(B.number)){T.add(B.number);const b=document.createElement("option");b.value=B.number,b.textContent=`Chapter ${B.number}`,g.appendChild(b)}}),S.length>0&&(g.value=S[0].number,_t(e.id,S[0].number)),h.classList.add("open")});const k=t.querySelector("#cover-chapter-select");k&&k.addEventListener("change",g=>{g.target.value&&_t(e.id,g.target.value)}),t.querySelectorAll(".modal-close, .modal-close-btn").forEach(g=>{g.addEventListener("click",()=>{g.closest(".modal").classList.remove("open")})}),t.querySelectorAll(".modal-overlay").forEach(g=>{g.addEventListener("click",()=>{g.closest(".modal").classList.remove("open")})})}async function _t(t,e){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await v.getChapterImages(t,e)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(o=>{const r=document.createElement("div");r.className="cover-grid-item",r.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",r.innerHTML=`<img src="${o}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,r.addEventListener("click",()=>{const u=document.querySelector('input[name="cover-target"]:checked').value,c=o.split("/").pop();Ka(c,e,u)}),s.appendChild(r)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function Ka(t,e,s){const a=f.manga,n=document.getElementById("edit-volume-modal"),o=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const r=n.dataset.editingVolId;if(!r)throw new Error("No volume selected");await v.setVolumeCoverFromChapter(a.id,r,e,t),d("Volume cover updated","success"),o.classList.remove("open"),n.classList.remove("open"),await z(a.id),N([a.id,"volume",r])}else{await v.setMangaCoverFromChapter(a.id,e,t),d("Series cover updated","success"),o.classList.remove("open"),await z(a.id);const r=window.location.hash.replace("#","");f.activeVolumeId?N([a.id,"volume",f.activeVolumeId]):N([a.id])}}catch(r){d("Failed to set cover: "+r.message,"error")}}let Z={series:null,loading:!0};function ve(){if(Z.loading)return`
      ${X("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=Z.series;if(!t)return`
      ${X("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.entries||[],a=s.reduce((o,r)=>o+(r.chapter_count||0),0);let n=null;if(s.length>0){const o=s[0];o.local_cover&&o.bookmark_id?n=`/api/public/covers/${o.bookmark_id}/${encodeURIComponent(o.local_cover.split(/[/\\]/).pop())}`:o.localCover&&o.bookmark_id?n=`/api/public/covers/${o.bookmark_id}/${encodeURIComponent(o.localCover.split(/[/\\]/).pop())}`:o.cover&&(n=o.cover)}return`
    ${X("series")}
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
            ${s.map((o,r)=>Ya(o,r,s.length)).join("")}
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
  `}function Ya(t,e,s){var o;const a=t.alias||t.title;let n=null;return t.local_cover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.local_cover.split(/[/\\]/).pop())}`:t.localCover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(n=t.cover),`
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
  `}function je(){var c,p,y;const t=document.getElementById("app"),e=Z.series;(c=document.getElementById("back-btn"))==null||c.addEventListener("click",()=>P.go("/")),(p=document.getElementById("back-library-btn"))==null||p.addEventListener("click",()=>P.go("/")),t.querySelectorAll(".series-entry-card").forEach(E=>{E.addEventListener("click",h=>{if(h.target.closest("[data-action]"))return;const k=E.dataset.id;P.go(`/manga/${k}`)})}),t.querySelectorAll("[data-action]").forEach(E=>{E.addEventListener("click",async h=>{h.stopPropagation();const k=E.dataset.action,g=E.dataset.id;switch(k){case"move-up":await It(g,-1);break;case"move-down":await It(g,1);break;case"set-cover":const $=E.dataset.entryid;await Ja($);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),o=document.getElementById("available-bookmarks-list"),r=document.getElementById("confirm-add-entry-btn");let u=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),o&&(o.innerHTML=""),a.classList.add("open");const E=await v.getAvailableBookmarksForSeries();u=E,E.length===0?(n&&(n.placeholder="No available manga found"),r.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),o&&(o.innerHTML=E.map(h=>`<option value="${(h.alias||h.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),r.disabled=!1)}catch{d("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),r.addEventListener("click",async()=>{const E=n?n.value:"",h=u.find(g=>(g.alias||g.title||"")===E);if(!h){d("Please select a valid manga from the list","warning");return}const k=h.id;try{r.disabled=!0,r.textContent="Adding...",await v.addSeriesEntry(e.id,k),d("Manga added to series","success"),a.classList.remove("open"),await Qe(e.id),t.innerHTML=ve(),je()}catch(g){d("Failed to add manga: "+g.message,"error")}finally{r.disabled=!1,r.textContent="Add to Series"}})),(y=document.getElementById("edit-series-btn"))==null||y.addEventListener("click",()=>{d("Edit series coming soon","info")})}async function It(t,e){const s=Z.series;if(!s)return;const a=s.entries||[],n=a.findIndex(u=>u.bookmark_id===t);if(n===-1)return;const o=n+e;if(o<0||o>=a.length)return;const r=a.map(u=>u.bookmark_id);[r[n],r[o]]=[r[o],r[n]];try{await v.post(`/series/${s.id}/reorder`,{order:r}),d("Order updated","success"),await Qe(s.id);const u=document.getElementById("app");u.innerHTML=ve(),je()}catch(u){d("Failed to reorder: "+u.message,"error")}}async function Ja(t){const e=Z.series;if(e)try{await v.setSeriesCover(e.id,t),d("Series cover updated","success"),await Qe(e.id);const s=document.getElementById("app");s.innerHTML=ve(),je()}catch(s){d("Failed to set cover: "+s.message,"error")}}async function Qe(t){try{const e=await v.get(`/series/${t}`);Z.series=e,Z.loading=!1}catch{d("Failed to load series","error"),Z.loading=!1}}async function Xa(t=[]){const[e]=t;if(!e){P.go("/");return}const s=document.getElementById("app");Z.loading=!0,Z.series=null,s.innerHTML=ve(),await Qe(e),s.innerHTML=ve(),je()}function Za(){Z.series=null,Z.loading=!0}const en={mount:Xa,unmount:Za,render:ve},tn={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
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
        `;try{const s=await v.get("/settings")||{},a=document.getElementById("settings-form"),n=document.getElementById("settings-loader");s.theme&&(document.getElementById("theme").value=s.theme),n.style.display="none",a.style.display="block",a.addEventListener("submit",async o=>{o.preventDefault();const r=new FormData(a),u={};for(const[c,p]of r.entries())u[c]=p;try{await v.post("/settings/bulk",u),d("Settings saved successfully"),u.theme}catch(c){console.error(c),d("Failed to save settings","error")}})}catch(s){console.error(s),document.getElementById("settings-loader").textContent="Error loading settings"}}},sn={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
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
        `,await an()}};async function an(){try{const t=await v.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
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
        `,e.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;dt(n),e.querySelectorAll(".table-link").forEach(o=>o.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(t){console.error(t),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function dt(t,e=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${t}...</div>`;try{const r=await v.get(`/admin/tables/${t}?page=${e}&limit=50`);if(!r.rows||r.rows.length===0){s.innerHTML=`
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
                                ${u.map(p=>{const y=c[p];let E=y;return y===null?E='<span class="null">NULL</span>':typeof y=="object"?E=JSON.stringify(y):String(y).length>100&&(E=String(y).substring(0,100)+"..."),`<td>${E}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>dt(t,e-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>dt(t,e+1))}catch(o){console.error(o),s.innerHTML=`<div class="error">Failed to load data for ${t}</div>`}}let W={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function nn(t,e){let s=null;if(e.length>0){const n=e[0];if(n.imagePaths&&n.imagePaths.length>0){const o=n.imagePaths[0];let r;typeof o=="string"?r=o:o&&typeof o=="object"&&(r=o.filename||o.path||o.name||o.url,r&&r.includes("/")&&(r=r.split("/").pop()),r&&r.includes("\\")&&(r=r.split("\\").pop())),r&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(r)}`)}}const a=e.reduce((n,o)=>{var r;return n+(((r=o.imagePaths)==null?void 0:r.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${t}">
      <div class="manga-card-cover">
        ${s?`<img src="${s}" alt="${t}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📁</div>'">`:'<div class="placeholder">📁</div>'}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function on(t){const e=W.bookmarks.find(s=>s.id===t);return e?e.alias||e.title:t}function rn(t){const e=W.bookmarks.find(s=>s.id===t);if(e&&e.seriesId){const s=W.series.find(a=>a.id===e.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function ln(t,e,s,a=!1){return`
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
  `}function cn(){const t={};console.log("Building trophy groups from:",W.trophyPages);for(const e of Object.keys(W.trophyPages)){const s=W.trophyPages[e];let a=0;for(const[o,r]of Object.entries(s))a+=Object.keys(r).length;if(console.log(`Manga ${e}: ${a} trophies`),a===0)continue;const n=rn(e);if(n)t[n.id]||(t[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),t[n.id].count+=a,t[n.id].mangaIds.push(e);else{const o=on(e);console.log(`No series for ${e}, using name: ${o}`),t[e]={name:o,isSeries:!1,count:a,mangaIds:[e]}}}return console.log("Trophy groups result:",t),t}function Ue(){if(W.loading)return`
      ${X("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:t,listOrder:e}=W.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${W.activeTab==="galleries"?"active":""}" data-tab="galleries">
        📁 Galleries
      </button>
      <button class="tab-btn ${W.activeTab==="trophies"?"active":""}" data-tab="trophies">
        🏆 Trophies
      </button>
    </div>
  `;let a="";if(W.activeTab==="galleries")e.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${e.map(o=>{const r=t&&t[o]||[];return nn(o,r)}).join("")}
        </div>
      `;else{const n=cn(),o=Object.keys(n);o.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${o.map(u=>{const c=n[u];return ln(u,c.name,c.count,c.isSeries)}).join("")}
        </div>
      `}return`
    ${X("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function ss(){ue();const t=document.getElementById("app");t.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{W.activeTab=s.dataset.tab,t.innerHTML=Ue(),ss()})}),t.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;P.go(`/read/gallery/${encodeURIComponent(a)}`)})}),t.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?P.go(`/read/trophies/series-${a}/🏆`):P.go(`/read/trophies/${a}/🏆`)})})}async function dn(){try{const[t,e,s,a]=await Promise.all([ae.loadFavorites(),v.get("/trophy-pages"),ae.loadBookmarks(),ae.loadSeries()]);W.favorites=t||{favorites:{},listOrder:[]},W.trophyPages=e||{},W.bookmarks=s||[],W.series=a||[],W.loading=!1}catch(t){console.error("Failed to load favorites:",t),d("Failed to load favorites","error"),W.loading=!1}}async function un(){console.log("[Favorites] mount called"),W.loading=!0;const t=document.getElementById("app");t.innerHTML=Ue(),await dn(),console.log("[Favorites] Data loaded, rendering..."),t.innerHTML=Ue(),console.log("[Favorites] Calling setupListeners..."),ss(),console.log("[Favorites] setupListeners complete")}function hn(){}const pn={mount:un,unmount:hn,render:Ue};let q={downloads:{},queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,collapsed:{active:!1,scheduled:!1,completed:!1,history:!0}},Ne=null,K={};function bt(t){if(!t)return"Never";const e=Date.now()-new Date(t).getTime(),s=Math.floor(e/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function mn(t){if(!t)return"Not scheduled";const e=new Date(t).getTime()-Date.now();if(e<=0)return"Running now...";const s=Math.floor(e/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const o=Math.floor(a/24),r=a%24;return`in ${o}d ${r}h`}function as(t){switch(t){case"download":return"📥";case"scrape":return"🔍";case"scan":return"📁";default:return"⚙️"}}function wt(t){switch(t){case"running":return"var(--color-success, #4caf50)";case"queued":case"pending":return"var(--color-warning, #ff9800)";case"paused":return"var(--color-info, #2196f3)";case"complete":return"var(--color-success, #4caf50)";case"error":case"failed":case"cancelled":return"var(--color-error, #f44336)";default:return"var(--text-secondary, #999)"}}function kt(t){switch(t){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return t}}function gn(t){return!t||t==="default"?"Default (6h)":t==="daily"?"Daily":t==="weekly"?"Weekly":t}function fn(){const t=q.autoCheck;return t?`
    <div class="queue-inline-header">
      <span class="text-muted">${t.enabledCount} monitored · Last: ${bt(t.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">▶ Run All Now</button>
    </div>
  `:""}function vn(t){const e=t.nextCheck?mn(t.nextCheck):"Not set",s=t.nextCheck&&new Date(t.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${t.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📖</span>
          <div>
            <div class="task-title">${t.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${gn(t.schedule)}${t.schedule==="weekly"&&t.day?` · ${t.day.charAt(0).toUpperCase()+t.day.slice(1)}`:""}${(t.schedule==="daily"||t.schedule==="weekly")&&t.time?` · ${t.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?"⏳ Due now":e}</span>
        </div>
      </div>
    </div>
  `}function Bt(t,e){const s=e.total>0?Math.round(e.completed/e.total*100):0,a=e.status==="running"||e.status==="queued",n=e.status==="paused";return`
    <div class="queue-card task-card" data-task-id="${t}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📥</span>
          <div>
            <div class="task-title">${e.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${wt(e.status)}">${kt(e.status)}</div>
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
  `}function yn(t){const e=t.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${as(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${wt(t.status)}">${kt(t.status)}</div>
          </div>
        </div>
      </div>
      ${t.started_at?`<div class="queue-card-body"><small>Started: ${bt(t.started_at)}</small></div>`:""}
    </div>
  `}function bn(t){const e=t.data||{},s=t.result||{};let a="";return t.type==="scrape"?s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${t.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>'):(t.type==="scan"||t.type==="scan-local")&&s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`),`
    <div class="queue-card task-card history-card" data-history-id="${t.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${as(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${wt(t.status)}">${kt(t.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${t.completed_at?`<div class="queue-card-body"><small>Completed: ${bt(t.completed_at)}</small></div>`:""}
    </div>
  `}function wn(){var u;const t=Object.entries(q.downloads),e=t.filter(([,c])=>c.status!=="complete"),s=t.filter(([,c])=>c.status==="complete"),a=new Set(e.map(([,c])=>c.bookmarkId).filter(Boolean)),n=q.queueTasks.filter(c=>{var p;return!(c.type==="download"&&((p=c.data)!=null&&p.mangaId)&&a.has(c.data.mangaId))}),o=e.length+n.length,r=((u=q.autoCheck)==null?void 0:u.schedules)||[];return`
    ${X("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>📋 Task Queue</h2>
        ${o>0?`<span class="queue-badge">${o} active</span>`:""}
      </div>

      ${e.length>0||n.length>0?`
        <div class="queue-section ${q.collapsed.active?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${e.map(([c,p])=>Bt(c,p)).join("")}
            ${n.map(c=>yn(c)).join("")}
          </div>
        </div>
      `:""}

      ${r.length>0?`
        <div class="queue-section ${q.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${r.length})
            </h3>
            ${fn()}
          </div>
          <div class="queue-section-content">
            ${r.map(c=>vn(c)).join("")}
          </div>
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section ${q.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${s.map(([c,p])=>Bt(c,p)).join("")}
          </div>
        </div>
      `:""}

      ${q.historyTasks&&q.historyTasks.length>0?`
        <div class="queue-section ${q.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                🗑️ Clear History
              </button>
            </div>
            <div class="queue-section-content history-list">
                ${q.historyTasks.map(c=>bn(c)).join("")}
            </div>
        </div>
      `:""}

      ${e.length===0&&n.length===0&&s.length===0&&r.length===0&&(!q.historyTasks||q.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">✨</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function me(){try{const[t,e,s,a]=await Promise.all([v.getDownloads().catch(()=>({})),v.getQueueTasks().catch(()=>[]),v.getQueueHistory(50).catch(()=>[]),v.getAutoCheckStatus().catch(()=>null)]);q.downloads=t||{},q.queueTasks=e||[],q.historyTasks=s||[],q.autoCheck=a,q.loading=!1}catch(t){console.error("[Queue] Failed to load data:",t),q.loading=!1}}function le(){const t=document.getElementById("app");t&&(t.innerHTML=wn(),kn())}function kn(){ue(),document.querySelectorAll("[data-toggle]").forEach(s=>{s.addEventListener("click",a=>{const n=s.dataset.toggle;q.collapsed[n]=!q.collapsed[n],le()})});const t=document.getElementById("run-autocheck-btn");t&&t.addEventListener("click",async()=>{t.disabled=!0,t.textContent="⏳ Running...";try{d("Auto-check started...","info");const s=await v.runAutoCheck();d(`Check complete: ${s.checked} checked, ${s.updated} updated`,"success"),await me(),le()}catch(s){d("Auto-check failed: "+s.message,"error"),t.disabled=!1,t.textContent="▶ Run Now"}});const e=document.getElementById("clear-history-btn");e&&e.addEventListener("click",async s=>{if(s.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await v.clearQueueHistory(),d("History cleared","success"),await me(),le()}catch(a){d(`Failed to clear history: ${a.message}`,"error")}}),document.querySelectorAll(".scheduled-manga-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.mangaId;a&&(window.location.hash=`#/manga/${a}`)})}),document.querySelectorAll("[data-action]").forEach(s=>{s.addEventListener("click",async a=>{a.stopPropagation();const n=s.dataset.action,o=s.dataset.task;try{n==="pause"?(await v.pauseDownload(o),d("Download paused","info")):n==="resume"?(await v.resumeDownload(o),d("Download resumed","info")):n==="cancel"&&confirm("Cancel this download?")&&(await v.cancelDownload(o),d("Download cancelled","info")),await me(),le()}catch(r){d(`Action failed: ${r.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.historyId,n=document.getElementById(`task-details-${a}`);n&&n.classList.toggle("hidden")})})}async function En(){q.loading=!0;const t=document.getElementById("app");t.innerHTML=`
    ${X("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>📋 Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,ue(),await me(),le(),Ne=setInterval(async()=>{await me(),le()},5e3),K.downloadProgress=e=>{e.taskId&&q.downloads[e.taskId]&&(Object.assign(q.downloads[e.taskId],e),le())},K.downloadCompleted=e=>{me().then(le)},K.queueUpdated=e=>{me().then(le)},V.on(Q.DOWNLOAD_PROGRESS,K.downloadProgress),V.on(Q.DOWNLOAD_COMPLETED,K.downloadCompleted),V.on(Q.QUEUE_UPDATED,K.queueUpdated)}function $n(){Ne&&(clearInterval(Ne),Ne=null),K.downloadProgress&&V.off(Q.DOWNLOAD_PROGRESS,K.downloadProgress),K.downloadCompleted&&V.off(Q.DOWNLOAD_COMPLETED,K.downloadCompleted),K.queueUpdated&&V.off(Q.QUEUE_UPDATED,K.queueUpdated),K={}}const Cn={mount:En,unmount:$n};class xn{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,s){this.routes.set(e,s)}async navigate(){console.log("[Router] navigate called");const e=window.location.hash.slice(1)||"/",[s,...a]=e.split("/").filter(Boolean),n=`/${s||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let o=this.routes.get(n);!o&&this.routes.has("/")&&(o=this.routes.get("/")),o&&(this.currentRoute=n,this.currentView=o,o.mount&&(console.log("[Router] calling mount on view module"),await o.mount(a)),ue())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),ue())}}const P=new xn;P.register("/",ga);P.register("/manga",Qa);P.register("/read",$a);P.register("/series",en);P.register("/settings",tn);P.register("/admin",sn);P.register("/favorites",pn);P.register("/queue",Cn);class Sn{constructor(){this.currentView=null,this.mangaCache=new Map}async init(){if(console.log("[App] Initializing..."),!v.isAuthenticated()){window.location.href="/login.html";return}V.connect(),this.setupSocketListeners(),P.init(),this.hideLoading(),console.log("[App] Ready")}setupSocketListeners(){V.on(Q.CHAPTER_DOWNLOADED,e=>{console.log("[Socket] Chapter downloaded:",e),this.onChapterUpdate(e)}),V.on(Q.CHAPTER_HIDDEN,e=>{console.log("[Socket] Chapter hidden:",e),this.onChapterUpdate(e)}),V.on(Q.CHAPTER_UNHIDDEN,e=>{console.log("[Socket] Chapter unhidden:",e),this.onChapterUpdate(e)}),V.on(Q.MANGA_UPDATED,e=>{console.log("[Socket] Manga updated:",e),this.onMangaUpdate(e)}),V.on(Q.DOWNLOAD_PROGRESS,e=>{this.onDownloadProgress(e)}),V.on(Q.DOWNLOAD_COMPLETED,e=>{console.log("[Socket] Download completed:",e),this.showToast(`Downloaded: ${e.chapterNumber}`,"success")}),V.on(Q.QUEUE_UPDATED,e=>{this.onQueueUpdate(e)}),V.on(Q.ACTION_RECORDED,e=>{console.log("[Socket] Action recorded:",e),this.updateUndoButton()}),V.on(Q.ACTION_UNDONE,e=>{console.log("[Socket] Action undone:",e),this.showToast("Action undone","info"),this.updateUndoButton()})}onChapterUpdate(e){window.dispatchEvent(new CustomEvent("chapter:update",{detail:e}))}onMangaUpdate(e){this.mangaCache.delete(e.mangaId),window.dispatchEvent(new CustomEvent("manga:update",{detail:e}))}onDownloadProgress(e){window.dispatchEvent(new CustomEvent("download:progress",{detail:e}))}onQueueUpdate(e){window.dispatchEvent(new CustomEvent("queue:update",{detail:e}))}async updateUndoButton(){try{const{undoableCount:e}=await v.getActions({limit:1}),s=document.getElementById("undo-btn");if(s){s.style.display=e>0?"flex":"none";const a=s.querySelector(".count");a&&(a.textContent=e)}}catch{}}showToast(e,s="info"){const a=document.createElement("div");a.className=`toast toast-${s}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}hideLoading(){const e=document.querySelector(".loading-screen");e&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),300))}}const Ln=new Sn;document.addEventListener("DOMContentLoaded",()=>Ln.init());
