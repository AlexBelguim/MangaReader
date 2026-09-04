import{a as m}from"./api-F98aUZb6.js";const Ce=Object.create(null);Ce.open="0";Ce.close="1";Ce.ping="2";Ce.pong="3";Ce.message="4";Ce.upgrade="5";Ce.noop="6";const st=Object.create(null);Object.keys(Ce).forEach(t=>{st[Ce[t]]=t});const Lt={type:"error",data:"parser error"},Ds=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Ns=typeof ArrayBuffer=="function",Fs=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,Gt=({type:t,data:e},s,a)=>Ds&&e instanceof Blob?s?a(e):ys(e,a):Ns&&(e instanceof ArrayBuffer||Fs(e))?s?a(e):ys(new Blob([e]),a):a(Ce[t]+(e||"")),ys=(t,e)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];e("b"+(a||""))},s.readAsDataURL(t)};function bs(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let kt;function ka(t,e){if(Ds&&t.data instanceof Blob)return t.data.arrayBuffer().then(bs).then(e);if(Ns&&(t.data instanceof ArrayBuffer||Fs(t.data)))return e(bs(t.data));Gt(t,!1,s=>{kt||(kt=new TextEncoder),e(kt.encode(s))})}const ws="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ze=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<ws.length;t++)ze[ws.charCodeAt(t)]=t;const $a=t=>{let e=t.length*.75,s=t.length,a,n=0,r,o,c,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const h=new ArrayBuffer(e),u=new Uint8Array(h);for(a=0;a<s;a+=4)r=ze[t.charCodeAt(a)],o=ze[t.charCodeAt(a+1)],c=ze[t.charCodeAt(a+2)],l=ze[t.charCodeAt(a+3)],u[n++]=r<<2|o>>4,u[n++]=(o&15)<<4|c>>2,u[n++]=(c&3)<<6|l&63;return h},Ea=typeof ArrayBuffer=="function",Kt=(t,e)=>{if(typeof t!="string")return{type:"message",data:Os(t,e)};const s=t.charAt(0);return s==="b"?{type:"message",data:Ca(t.substring(1),e)}:st[s]?t.length>1?{type:st[s],data:t.substring(1)}:{type:st[s]}:Lt},Ca=(t,e)=>{if(Ea){const s=$a(t);return Os(s,e)}else return{base64:!0,data:t}},Os=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},Us="",Sa=(t,e)=>{const s=t.length,a=new Array(s);let n=0;t.forEach((r,o)=>{Gt(r,!1,c=>{a[o]=c,++n===s&&e(a.join(Us))})})},xa=(t,e)=>{const s=t.split(Us),a=[];for(let n=0;n<s.length;n++){const r=Kt(s[n],e);if(a.push(r),r.type==="error")break}return a};function Ia(){return new TransformStream({transform(t,e){ka(t,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const r=new DataView(n.buffer);r.setUint8(0,126),r.setUint16(1,a)}else{n=new Uint8Array(9);const r=new DataView(n.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(a))}t.data&&typeof t.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(s)})}})}let $t;function Ze(t){return t.reduce((e,s)=>e+s.length,0)}function et(t,e){if(t[0].length===e)return t.shift();const s=new Uint8Array(e);let a=0;for(let n=0;n<e;n++)s[n]=t[0][a++],a===t[0].length&&(t.shift(),a=0);return t.length&&a<t[0].length&&(t[0]=t[0].slice(a)),s}function La(t,e){$t||($t=new TextDecoder);const s=[];let a=0,n=-1,r=!1;return new TransformStream({transform(o,c){for(s.push(o);;){if(a===0){if(Ze(s)<1)break;const l=et(s,1);r=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(Ze(s)<2)break;const l=et(s,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(Ze(s)<8)break;const l=et(s,8),h=new DataView(l.buffer,l.byteOffset,l.length),u=h.getUint32(0);if(u>Math.pow(2,21)-1){c.enqueue(Lt);break}n=u*Math.pow(2,32)+h.getUint32(4),a=3}else{if(Ze(s)<n)break;const l=et(s,n);c.enqueue(Kt(r?l:$t.decode(l),e)),a=0}if(n===0||n>t){c.enqueue(Lt);break}}}})}const Hs=4;function te(t){if(t)return Ba(t)}function Ba(t){for(var e in te.prototype)t[e]=te.prototype[e];return t}te.prototype.on=te.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this};te.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this};te.prototype.off=te.prototype.removeListener=te.prototype.removeAllListeners=te.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+t];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===e||a.fn===e){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+t],this};te.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),s=this._callbacks["$"+t],a=1;a<arguments.length;a++)e[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,e)}return this};te.prototype.emitReserved=te.prototype.emit;te.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};te.prototype.hasListeners=function(t){return!!this.listeners(t).length};const vt=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,s)=>s(e,0),ge=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Aa="arraybuffer";function Vs(t,...e){return e.reduce((s,a)=>(t.hasOwnProperty(a)&&(s[a]=t[a]),s),{})}const _a=ge.setTimeout,Ma=ge.clearTimeout;function yt(t,e){e.useNativeTimers?(t.setTimeoutFn=_a.bind(ge),t.clearTimeoutFn=Ma.bind(ge)):(t.setTimeoutFn=ge.setTimeout.bind(ge),t.clearTimeoutFn=ge.clearTimeout.bind(ge))}const Ta=1.33;function Pa(t){return typeof t=="string"?Ra(t):Math.ceil((t.byteLength||t.size)*Ta)}function Ra(t){let e=0,s=0;for(let a=0,n=t.length;a<n;a++)e=t.charCodeAt(a),e<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(a++,s+=4);return s}function zs(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function qa(t){let e="";for(let s in t)t.hasOwnProperty(s)&&(e.length&&(e+="&"),e+=encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e}function Da(t){let e={},s=t.split("&");for(let a=0,n=s.length;a<n;a++){let r=s[a].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class Na extends Error{constructor(e,s,a){super(e),this.description=s,this.context=a,this.type="TransportError"}}class Yt extends te{constructor(e){super(),this.writable=!1,yt(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,s,a){return super.emitReserved("error",new Na(e,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const s=Kt(e,this.socket.binaryType);this.onPacket(s)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,s={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const s=qa(e);return s.length?"?"+s:""}}class Fa extends Yt{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const s=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};xa(e,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Sa(e,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=zs()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(e,s)}}let js=!1;try{js=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Oa=js;function Ua(){}class Ha extends Fa{constructor(e){if(super(e),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||a!==e.port}}doWrite(e,s){const a=this.request({method:"POST",data:e});a.on("success",s),a.on("error",(n,r)=>{this.onError("xhr post error",n,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=e}}class Ee extends te{constructor(e,s,a){super(),this.createRequest=e,yt(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var e;const s=Vs(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=Ee.requestsCount++,Ee.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Ua,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ee.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Ee.requestsCount=0;Ee.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",ks);else if(typeof addEventListener=="function"){const t="onpagehide"in ge?"pagehide":"unload";addEventListener(t,ks,!1)}}function ks(){for(let t in Ee.requests)Ee.requests.hasOwnProperty(t)&&Ee.requests[t].abort()}const Va=function(){const t=Qs({xdomain:!1});return t&&t.responseType!==null}();class za extends Ha{constructor(e){super(e);const s=e&&e.forceBase64;this.supportsBinary=Va&&!s}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Ee(Qs,this.uri(),e)}}function Qs(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Oa))return new XMLHttpRequest}catch{}if(!e)try{return new ge[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Ws=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class ja extends Yt{get name(){return"websocket"}doOpen(){const e=this.uri(),s=this.opts.protocols,a=Ws?{}:Vs(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;Gt(a,this.supportsBinary,r=>{try{this.doWrite(a,r)}catch{}n&&vt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=zs()),this.supportsBinary||(s.b64=1),this.createUri(e,s)}}const Et=ge.WebSocket||ge.MozWebSocket;class Qa extends ja{createSocket(e,s,a){return Ws?new Et(e,s,a):s?new Et(e,s):new Et(e)}doWrite(e,s){this.ws.send(s)}}class Wa extends Yt{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const s=La(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=e.readable.pipeThrough(s).getReader(),n=Ia();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const r=()=>{a.read().then(({done:c,value:l})=>{c||(this.onPacket(l),r())}).catch(c=>{})};r();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;this._writer.write(a).then(()=>{n&&vt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Ga={websocket:Qa,webtransport:Wa,polling:za},Ka=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Ya=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Bt(t){if(t.length>8e3)throw"URI too long";const e=t,s=t.indexOf("["),a=t.indexOf("]");s!=-1&&a!=-1&&(t=t.substring(0,s)+t.substring(s,a).replace(/:/g,";")+t.substring(a,t.length));let n=Ka.exec(t||""),r={},o=14;for(;o--;)r[Ya[o]]=n[o]||"";return s!=-1&&a!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=Ja(r,r.path),r.queryKey=Xa(r,r.query),r}function Ja(t,e){const s=/\/{2,9}/g,a=e.replace(s,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&a.splice(0,1),e.slice(-1)=="/"&&a.splice(a.length-1,1),a}function Xa(t,e){const s={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,r){n&&(s[n]=r)}),s}const At=typeof addEventListener=="function"&&typeof removeEventListener=="function",at=[];At&&addEventListener("offline",()=>{at.forEach(t=>t())},!1);class Be extends te{constructor(e,s){if(super(),this.binaryType=Aa,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(s=e,e=null),e){const a=Bt(e);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=Bt(s.host).host);yt(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Da(this.opts.query)),At&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},at.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const s=Object.assign({},this.opts.query);s.EIO=Hs,s.transport=e,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Be.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(e);s.open(),this.setTransport(s)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",Be.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=e.data,this._onError(s);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=Pa(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,vt(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,s,a){return this._sendPacket("message",e,s,a),this}send(e,s,a){return this._sendPacket("message",e,s,a),this}_sendPacket(e,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const r={type:e,data:s,options:a};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),e()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():e()}):this.upgrading?a():e()),this}_onError(e){if(Be.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),At&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=at.indexOf(this._offlineEventListener);a!==-1&&at.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,s),this.writeBuffer=[],this._prevBufferLen=0}}}Be.protocol=Hs;class Za extends Be{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let s=this.createTransport(e),a=!1;Be.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",g=>{if(!a)if(g.type==="pong"&&g.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;Be.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(u(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const v=new Error("probe error");v.transport=s.name,this.emitReserved("upgradeError",v)}}))};function r(){a||(a=!0,u(),s.close(),s=null)}const o=g=>{const v=new Error("probe error: "+g);v.transport=s.name,r(),this.emitReserved("upgradeError",v)};function c(){o("transport closed")}function l(){o("socket closed")}function h(g){s&&g.name!==s.name&&r()}const u=()=>{s.removeListener("open",n),s.removeListener("error",o),s.removeListener("close",c),this.off("close",l),this.off("upgrading",h)};s.once("open",n),s.once("error",o),s.once("close",c),this.once("close",l),this.once("upgrading",h),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const s=[];for(let a=0;a<e.length;a++)~this.transports.indexOf(e[a])&&s.push(e[a]);return s}}let en=class extends Za{constructor(e,s={}){const a=typeof e=="object"?e:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>Ga[n]).filter(n=>!!n)),super(e,a)}};function tn(t,e="",s){let a=t;s=s||typeof location<"u"&&location,t==null&&(t=s.protocol+"//"+s.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=s.protocol+t:t=s.host+t),/^(https?|wss?):\/\//.test(t)||(typeof s<"u"?t=s.protocol+"//"+t:t="https://"+t),a=Bt(t)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const r=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+r+":"+a.port+e,a.href=a.protocol+"://"+r+(s&&s.port===a.port?"":":"+a.port),a}const sn=typeof ArrayBuffer=="function",an=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Gs=Object.prototype.toString,nn=typeof Blob=="function"||typeof Blob<"u"&&Gs.call(Blob)==="[object BlobConstructor]",rn=typeof File=="function"||typeof File<"u"&&Gs.call(File)==="[object FileConstructor]";function Jt(t){return sn&&(t instanceof ArrayBuffer||an(t))||nn&&t instanceof Blob||rn&&t instanceof File}function nt(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let s=0,a=t.length;s<a;s++)if(nt(t[s]))return!0;return!1}if(Jt(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return nt(t.toJSON(),!0);for(const s in t)if(Object.prototype.hasOwnProperty.call(t,s)&&nt(t[s]))return!0;return!1}function on(t){const e=[],s=t.data,a=t;return a.data=_t(s,e),a.attachments=e.length,{packet:a,buffers:e}}function _t(t,e){if(!t)return t;if(Jt(t)){const s={_placeholder:!0,num:e.length};return e.push(t),s}else if(Array.isArray(t)){const s=new Array(t.length);for(let a=0;a<t.length;a++)s[a]=_t(t[a],e);return s}else if(typeof t=="object"&&!(t instanceof Date)){const s={};for(const a in t)Object.prototype.hasOwnProperty.call(t,a)&&(s[a]=_t(t[a],e));return s}return t}function ln(t,e){return t.data=Mt(t.data,e),delete t.attachments,t}function Mt(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let s=0;s<t.length;s++)t[s]=Mt(t[s],e);else if(typeof t=="object")for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(t[s]=Mt(t[s],e));return t}const cn=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var H;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(H||(H={}));class dn{constructor(e){this.replacer=e}encode(e){return(e.type===H.EVENT||e.type===H.ACK)&&nt(e)?this.encodeAsBinary({type:e.type===H.EVENT?H.BINARY_EVENT:H.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let s=""+e.type;return(e.type===H.BINARY_EVENT||e.type===H.BINARY_ACK)&&(s+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(s+=e.nsp+","),e.id!=null&&(s+=e.id),e.data!=null&&(s+=JSON.stringify(e.data,this.replacer)),s}encodeAsBinary(e){const s=on(e),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class Xt extends te{constructor(e){super(),this.reviver=e}add(e){let s;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(e);const a=s.type===H.BINARY_EVENT;a||s.type===H.BINARY_ACK?(s.type=a?H.EVENT:H.ACK,this.reconstructor=new un(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(Jt(e)||e.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(e),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let s=0;const a={type:Number(e.charAt(0))};if(H[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===H.BINARY_EVENT||a.type===H.BINARY_ACK){const r=s+1;for(;e.charAt(++s)!=="-"&&s!=e.length;);const o=e.substring(r,s);if(o!=Number(o)||e.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(o)}if(e.charAt(s+1)==="/"){const r=s+1;for(;++s&&!(e.charAt(s)===","||s===e.length););a.nsp=e.substring(r,s)}else a.nsp="/";const n=e.charAt(s+1);if(n!==""&&Number(n)==n){const r=s+1;for(;++s;){const o=e.charAt(s);if(o==null||Number(o)!=o){--s;break}if(s===e.length)break}a.id=Number(e.substring(r,s+1))}if(e.charAt(++s)){const r=this.tryParse(e.substr(s));if(Xt.isPayloadValid(a.type,r))a.data=r;else throw new Error("invalid payload")}return a}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,s){switch(e){case H.CONNECT:return $s(s);case H.DISCONNECT:return s===void 0;case H.CONNECT_ERROR:return typeof s=="string"||$s(s);case H.EVENT:case H.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&cn.indexOf(s[0])===-1);case H.ACK:case H.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class un{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const s=ln(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function $s(t){return Object.prototype.toString.call(t)==="[object Object]"}const hn=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Xt,Encoder:dn,get PacketType(){return H}},Symbol.toStringTag,{value:"Module"}));function ye(t,e,s){return t.on(e,s),function(){t.off(e,s)}}const pn=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Ks extends te{constructor(e,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[ye(e,"open",this.onopen.bind(this)),ye(e,"packet",this.onpacket.bind(this)),ye(e,"error",this.onerror.bind(this)),ye(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...s){var a,n,r;if(pn.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(s.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const o={type:H.EVENT,data:s};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const u=this.ids++,g=s.pop();this._registerAckCallback(u,g),o.id=u}const c=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[e]=s;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===e&&this.sendBuffer.splice(c,1);s.call(this,new Error("operation has timed out"))},n),o=(...c)=>{this.io.clearTimeoutFn(r),s.apply(this,c)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...s){return new Promise((a,n)=>{const r=(o,c)=>o?n(o):a(c);r.withError=!0,s.push(r),this.emit(e,...s)})}_addToQueue(e){let s;typeof e[e.length-1]=="function"&&(s=e.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...r)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...r)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!e||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:H.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(a=>String(a.id)===e)){const a=this.acks[e];delete this.acks[e],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case H.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case H.EVENT:case H.BINARY_EVENT:this.onevent(e);break;case H.ACK:case H.BINARY_ACK:this.onack(e);break;case H.DISCONNECT:this.ondisconnect();break;case H.CONNECT_ERROR:this.destroy();const a=new Error(e.data.message);a.data=e.data.data,this.emitReserved("connect_error",a);break}}onevent(e){const s=e.data||[];e.id!=null&&s.push(this.ack(e.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:H.ACK,id:e,data:n}))}}onack(e){const s=this.acks[e.id];typeof s=="function"&&(delete this.acks[e.id],s.withError&&e.data.unshift(null),s.apply(this,e.data))}onconnect(e,s){this.id=e,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:H.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,e.data)}}}function He(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}He.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),s=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+s:t-s}return Math.min(t,this.max)|0};He.prototype.reset=function(){this.attempts=0};He.prototype.setMin=function(t){this.ms=t};He.prototype.setMax=function(t){this.max=t};He.prototype.setJitter=function(t){this.jitter=t};class Tt extends te{constructor(e,s){var a;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(s=e,e=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,yt(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new He({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=e;const n=s.parser||hn;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var s;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(s=this.backoff)===null||s===void 0||s.setMin(e),this)}randomizationFactor(e){var s;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(s=this.backoff)===null||s===void 0||s.setJitter(e),this)}reconnectionDelayMax(e){var s;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(s=this.backoff)===null||s===void 0||s.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new en(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=ye(s,"open",function(){a.onopen(),e&&e()}),r=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),e?e(c):this.maybeReconnectOnOpen()},o=ye(s,"error",r);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{n(),r(new Error("timeout")),s.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(ye(e,"ping",this.onping.bind(this)),ye(e,"data",this.ondata.bind(this)),ye(e,"error",this.onerror.bind(this)),ye(e,"close",this.onclose.bind(this)),ye(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(s){this.onclose("parse error",s)}}ondecoded(e){vt(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,s){let a=this.nsps[e];return a?this._autoConnect&&!a.active&&a.connect():(a=new Ks(this,e,s),this.nsps[e]=a),a}_destroy(e){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(e){const s=this.encoder.encode(e);for(let a=0;a<s.length;a++)this.engine.write(s[a],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Ve={};function rt(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const s=tn(t,e.path||"/socket.io"),a=s.source,n=s.id,r=s.path,o=Ve[n]&&r in Ve[n].nsps,c=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return c?l=new Tt(a,e):(Ve[n]||(Ve[n]=new Tt(a,e)),l=Ve[n]),s.query&&!e.query&&(e.query=s.queryKey),l.socket(s.path,e)}Object.assign(rt,{Manager:Tt,Socket:Ks,io:rt,connect:rt});class mn{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=rt({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var s;this.subscribedMangas.add(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var s;this.subscribedMangas.delete(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,s){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(s),this.socket&&this.socket.on(e,s)}off(e,s){this.listeners.has(e)&&this.listeners.get(e).delete(s),this.socket&&this.socket.off(e,s)}emit(e,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(e,s)}}const oe={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone",SITE_CHALLENGE:"site:challenge",SITE_CHALLENGE_CLEARED:"site:challenge-cleared",SITE_SESSION:"site:session"},ee=new mn,de={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},be=new Set,X=new Map,je=new Map;function gn(t){return de[t]}function fn(t,e){de[t]=e,be.add(t),Je(t)}function vn(t,e){return je.has(t)||je.set(t,new Set),je.get(t).add(e),()=>{var s;return(s=je.get(t))==null?void 0:s.delete(e)}}function Je(t){const e=je.get(t);e&&e.forEach(s=>s(de[t]))}function Qe(t){be.delete(t),X.delete(t)}function yn(t){return be.has(t)}async function We(t=!1){if(!t&&be.has("bookmarks"))return de.bookmarks;if(X.has("bookmarks"))return X.get("bookmarks");const e=m.getBookmarks().then(s=>(de.bookmarks=s||[],be.add("bookmarks"),X.delete("bookmarks"),Je("bookmarks"),de.bookmarks)).catch(s=>{throw X.delete("bookmarks"),s});return X.set("bookmarks",e),e}async function bn(t=!1){if(!t&&be.has("series"))return de.series;if(X.has("series"))return X.get("series");const e=m.get("/series").then(s=>(de.series=s||[],be.add("series"),X.delete("series"),Je("series"),de.series)).catch(s=>{throw X.delete("series"),s});return X.set("series",e),e}async function wn(t=!1){if(!t&&be.has("categories"))return de.categories;if(X.has("categories"))return X.get("categories");const e=m.get("/categories").then(s=>(de.categories=s.categories||[],be.add("categories"),X.delete("categories"),Je("categories"),de.categories)).catch(s=>{throw X.delete("categories"),s});return X.set("categories",e),e}async function kn(t=!1){if(!t&&be.has("favorites"))return de.favorites;if(X.has("favorites"))return X.get("favorites");const e=m.getFavorites().then(s=>(de.favorites=s||{favorites:{},listOrder:[]},be.add("favorites"),X.delete("favorites"),Je("favorites"),de.favorites)).catch(s=>{throw X.delete("favorites"),s});return X.set("favorites",e),e}function $n(){ee.on(oe.MANGA_UPDATED,()=>{Qe("bookmarks"),We(!0)}),ee.on(oe.MANGA_ADDED,()=>{Qe("bookmarks"),We(!0)}),ee.on(oe.MANGA_DELETED,()=>{Qe("bookmarks"),We(!0)}),ee.on(oe.DOWNLOAD_COMPLETED,()=>{Qe("bookmarks"),We(!0)})}$n();const ue={get:gn,set:fn,subscribe:vn,invalidate:Qe,isLoaded:yn,loadBookmarks:We,loadSeries:bn,loadCategories:wn,loadFavorites:kn};function d(t,e="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=t,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}const En={library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',"book-open":'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',"book-marked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',"layout-grid":'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',check:'<path d="M20 6 9 17l-5-5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',"trash-2":'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',"undo-2":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',scissors:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',play:'<polygon points="6 3 20 12 6 21 6 3"/>',pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',"hard-drive":'<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',package:'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"eye-off":'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',circle:'<circle cx="12" cy="12" r="10"/>',lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',"lock-open":'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',"triangle-alert":'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',"shield-alert":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',"circle-help":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',"traffic-cone":'<path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"/><path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"/><path d="M13.9 3.5a1.93 1.93 0 0 0-3.8 0L6.1 19.5a1.93 1.93 0 0 0 1.9 2.5h8a1.93 1.93 0 0 0 1.9-2.5z"/><path d="M2 21h20"/>',sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',"alarm-clock":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',loader:'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',"search-x":'<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',"list-checks":'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',"log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',sliders:'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',"chevron-up":'<path d="m18 15-6-6-6 6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"chevron-left":'<path d="m15 18-6-6 6-6"/>',"chevron-right":'<path d="m9 18 6-6-6-6"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',images:'<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>',"columns-2":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',"rectangle-vertical":'<rect width="12" height="20" x="6" y="2" rx="2"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',"arrow-left-right":'<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',"refresh-cw":'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>',"rotate-cw":'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"message-circle":'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'};function p(t,e={}){const s=En[t];if(!s)return console.warn("[icons] unknown icon:",t),"";const{size:a,cls:n="",title:r,spin:o=!1}=e,c=["icon",o?"icon-spin":"",n].filter(Boolean).join(" "),l=a?` width="${a}" height="${a}"`:"",h=r?` role="img" aria-label="${String(r).replace(/"/g,"&quot;")}"`:' aria-hidden="true"';return`<svg class="${c}"${l} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${h}>${s}</svg>`}function pe(t="book"){return`<div class="placeholder" data-icon="${t}"></div>`}function xe(t,e,s={}){const{kind:a="book",self:n=!1,attrs:r=""}=s,o=String(e??"").replace(/"/g,"&quot;"),c=`<div class=&quot;placeholder&quot; data-icon=&quot;${a}&quot;></div>`,l=n?"this.outerHTML":"this.parentElement.innerHTML";return`<img src="${t}" alt="${o}" loading="lazy"${r?" "+r:""} onerror="${l}='${c}'">`}const Es=`${p("folder")} Scan Folder`,Cs=`${p("loader",{spin:!0})} Scanning...`;async function Cn(t,e,s){try{t&&(t.disabled=!0,t.innerHTML=Cs),e&&(e.innerHTML=Cs),d("Scanning downloads folder...","info");const n=(await m.scanLibrary()).found||[];if(n.length===0){d("Scan complete: No new manga found","info"),s&&s();return}Sn(n,s)}catch(a){d("Scan failed: "+a.message,"error")}finally{t&&(t.disabled=!1,t.innerHTML=Es),e&&(e.innerHTML=Es)}}async function Sn(t,e){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),r=Array.from(n).map(l=>l.dataset.folder);if(r.length===0){d("No folders selected","warning");return}const o=document.getElementById("import-all-btn");o.disabled=!0,o.textContent="Importing...";let c=0;for(const l of r)try{await m.importLocalManga(l),c++}catch(h){console.error("Failed to import",l,h)}s.remove(),d(`Imported ${c} manga`,"success"),e&&e()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function xn(t={}){const{size:e,stroke:s="currentColor",accent:a="var(--accent-primary, #E03A2F)",strokeWidth:n=2,cls:r=""}=t,o=e?` width="${e}" height="${e}"`:"";return`<svg class="${`logo-mark ${r}`.trim()}"${o} viewBox="0 0 24 24" fill="none" stroke="${s}" stroke-width="${n}" stroke-linejoin="round" aria-hidden="true"><polygon points="3,3 10.5,3 8.5,21 3,21"/><polygon points="13,3 21,3 21,10.5 12.17,10.5" fill="${a}" stroke="${a}"/><polygon points="11.89,13 21,13 21,21 11,21"/></svg>`}function Ss(){return`${xn()}<span class="logo-text">Manga<span>Reader</span></span>`}const J={user:null,get isAdmin(){var t;return((t=this.user)==null?void 0:t.role)==="admin"},get isDemo(){var t;return((t=this.user)==null?void 0:t.role)==="demo"},get canDownload(){var t;return this.isAdmin||!this.isDemo&&!!((t=this.user)!=null&&t.canDownload)},get canEdit(){var t;return this.isAdmin||!this.isDemo&&!!((t=this.user)!=null&&t.canEdit)}};function Ai(t){J.user=t||null}function ce(t="manga"){if(J.isDemo)return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${Ss()}</a>
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
  `;const e=J.isAdmin?`<a href="#/admin" class="btn btn-secondary" title="Admin">${p("wrench",{title:"Admin"})}</a>`:"",s=J.isAdmin?`<a href="#/admin" class="mobile-menu-item">${p("wrench")} Admin</a>`:"",a=J.canDownload?`<button class="btn btn-secondary" id="scan-btn">${p("folder")} Scan Folder</button>`:"",n=J.canDownload?`<button class="mobile-menu-item" id="mobile-scan-btn">${p("folder")} Scan Folder</button>`:"",r=J.canEdit?t==="series"?`<button class="btn btn-primary" id="add-series-btn">${p("plus")} Add Series</button>`:`<button class="btn btn-primary" id="add-manga-btn">${p("plus")} Add Manga</button>`:"",o=J.canEdit?t==="series"?`<button class="mobile-menu-item primary" id="mobile-add-series-btn">${p("plus")} Add Series</button>`:`<button class="mobile-menu-item primary" id="mobile-add-btn">${p("plus")} Add Manga</button>`:"";return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${Ss()}</a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${t==="manga"?"active":""}" data-view="manga" title="Manga view">${p("library",{title:"Manga view"})}</button>
            <button class="view-toggle-btn ${t==="series"?"active":""}" data-view="series" title="Series view">${p("book-open",{title:"Series view"})}</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">${p("star")} Favorites</button>
          <a href="#/queue" class="btn btn-secondary" id="queue-nav-btn" title="Task Queue">${p("list-checks")} Queue</a>
          ${a}
          ${r}
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
  `}function Ie(){const t=document.querySelector("header");if(t&&t.dataset.listenersBound)return;t&&(t.dataset.listenersBound="true");const e=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");e&&s&&e.addEventListener("click",()=>{s.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),r=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",r),n&&n.addEventListener("click",r);const o=document.getElementById("demo-exit-btn");o&&o.addEventListener("click",$=>{$.preventDefault(),localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"}),document.querySelectorAll("[data-view]").forEach($=>{$.addEventListener("click",()=>{const A=$.dataset.view;localStorage.setItem("library_view_mode",A),document.querySelectorAll("[data-view]").forEach(D=>{D.classList.toggle("active",D.dataset.view===A)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:A}}))})});const c=document.querySelector(".logo");c&&c.addEventListener("click",$=>{localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),ue.loadBookmarks(!0).catch(()=>{}),window.dispatchEvent(new CustomEvent("clearFilters"))});const l=document.getElementById("favorites-btn"),h=document.getElementById("mobile-favorites-btn"),u=$=>{$.preventDefault(),q.go("/favorites")};l&&l.addEventListener("click",u),h&&h.addEventListener("click",u);const g=document.getElementById("queue-nav-btn");g&&g.addEventListener("click",$=>{$.preventDefault(),q.go("/queue")});const v=document.getElementById("add-manga-btn"),C=document.getElementById("mobile-add-btn"),S=()=>{document.getElementById("add-modal")||(sessionStorage.setItem("open_add_modal","1"),q.go("/"))};v&&v.addEventListener("click",S),C&&C.addEventListener("click",S);const f=document.getElementById("scan-btn"),I=document.getElementById("mobile-scan-btn");if(f||I){const $=()=>{Cn(f,I,async()=>{await ue.loadBookmarks(!0),q.reload()})};f&&f.addEventListener("click",$),I&&I.addEventListener("click",$)}}let B={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",searchAuthor:localStorage.getItem("library_search_author")||null,searchAuthorSource:localStorage.getItem("library_search_author_source")||null,sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0},dt=[];function xs(t){return String(t).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}function In(t){return[...t].sort((e,s)=>{var a,n;switch(B.sortBy){case"az":return(e.alias||e.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(e.alias||e.title);case"lastread":return(s.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const r=((a=e.chapters)==null?void 0:a.length)||e.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-r}case"updated":default:return(s.updatedAt||"").localeCompare(e.updatedAt||"")}})}function Zt(){let t=B.bookmarks;const e=(Array.isArray(B.categories)?B.categories:[]).filter(s=>typeof s=="object"?s.isNsfw:!1).map(s=>s.name);if(B.activeCategory==="__nsfw__"?t=t.filter(s=>(s.categories||[]).some(a=>e.includes(a))):B.activeCategory?t=t.filter(s=>(s.categories||[]).includes(B.activeCategory)):e.length>0&&(t=t.filter(s=>!(s.categories||[]).some(a=>e.includes(a)))),B.artistFilter&&(t=t.filter(s=>(s.artists||[]).includes(B.artistFilter))),B.searchQuery){const s=B.searchQuery.toLowerCase();t=t.filter(a=>(a.title||"").toLowerCase().includes(s)||(a.alias||"").toLowerCase().includes(s)||(a.artists||[]).some(n=>n.toLowerCase().includes(s)))}return In(t)}function es(t){var u,g,v;const e=t.alias||t.title,s=t.downloadedCount??((u=t.downloadedChapters)==null?void 0:u.length)??0,a=new Set(t.excludedChapters||[]),n=(t.chapters||[]).filter(C=>!a.has(C.number)),r=new Set(n.map(C=>C.number)).size||t.uniqueChapters||0,o=t.readCount??((g=t.readChapters)==null?void 0:g.length)??0,c=(t.updatedCount??((v=t.updatedChapters)==null?void 0:v.length)??0)>0,l=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover,h=t.source==="local";return`
    <div class="manga-card" data-id="${t.id}">
      <div class="manga-card-cover">
        ${l?xe(l,e,{kind:h?"local":"book"}):pe(h?"local":"book")}
        <div class="manga-card-badges">
          ${o>0?`<span class="badge badge-read" title="Read">${o}</span>`:""}
          <span class="badge badge-chapters" title="Total">${r}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${c?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${t.autoCheck?`<span class="badge badge-monitored" title="Auto-check enabled">${p("alarm-clock",{title:"Auto-check enabled"})}</span>`:""}
          ${B.activeCategory==="Favorites"?`<span class="badge badge-play" title="Click to Read">${p("play",{title:"Click to Read"})}</span>`:""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function ts(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function Ln(t){var n;const e=t.alias||t.title,s=((n=t.entries)==null?void 0:n.length)||t.entry_count||0;let a=null;return t.localCover&&t.coverBookmarkId?a=`/api/public/covers/${t.coverBookmarkId}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(a=t.cover),`
    <div class="manga-card series-card" data-series-id="${t.id}">
      <div class="manga-card-cover">
        ${a?xe(a,e,{kind:"series"}):pe("series")}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${s} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function ut(){const t=localStorage.getItem("library_view_mode");if(t&&t!==B.viewMode&&(B.viewMode=t),B.activeCategory==="Favorites")return q.go("/favorites"),"";let e="";if(B.viewMode==="series"){const s=B.series.map(Ln).join("");e=`
      <div class="library-grid" id="library-grid">
        ${B.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const s=Zt(),n=B.searchAuthor&&B.searchQuery===B.searchAuthor?`
      <div class="manga-card search-sources-card" id="search-sources-card" title="Search online sources for ${xs(B.searchAuthor)}"
           style="display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed var(--border-color, #3a3a4a);background:transparent;min-height:220px;text-align:center;">
        <div style="padding:1rem;color:var(--text-muted, #9aa);">
          <div style="font-size:2.5rem;line-height:1;margin-bottom:.5rem;">＋</div>
          <div style="font-size:.85rem;">Search sources for<br><strong style="color:var(--text-color, #fff);">${xs(B.searchAuthor)}</strong></div>
        </div>
      </div>`:"",r=s.map(es).join("")+n;e=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">${p("search")}</span>
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
      </div>
      ${B.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">${p("palette")}</span>
          <span class="artist-filter-name">${B.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${B.loading?'<div class="loading-spinner"></div>':r||ts()}
      </div>
    `}return`
    ${ce(B.viewMode)}
    <div class="container">
      ${e}
    </div>
    ${Bn()}
    ${_n()}
    ${Mn()}
  `}function Bn(){const{activeCategory:t}=B,s=(Array.isArray(B.categories)?B.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=s.some(n=>n.isNsfw);return`
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
    ${An()}
      `}function An(){const e=(Array.isArray(B.categories)?B.categories:[]).map(s=>typeof s=="object"?s:{name:s,isNsfw:!1});return`
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
  `}function _n(){return`
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
      `}function Mn(){return`
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
      `}function Pt(){B.activeCategory=null,B.artistFilter=null,B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),me()}async function Rt(t){const e=t.target.closest(".manga-card");if(e){if(e.classList.contains("gallery-card")){const n=e.dataset.gallery;q.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=e.dataset.id,a=e.dataset.seriesId;if(a){q.go(`/series/${a}`);return}if(s){if(B.activeCategory==="Favorites"){const n=B.bookmarks.find(r=>r.id===s);if(n){let r=n.last_read_chapter;if(!r&&n.chapters&&n.chapters.length>0&&(r=[...n.chapters].sort((c,l)=>c.number-l.number)[0].number),r){q.go(`/read/${s}/${r}`);return}else d("No chapters available to read","warning")}}q.go(`/manga/${s}`)}}}function Ys(){var G,Z,w,L,M;const t=document.getElementById("app");t.removeEventListener("click",Rt),t.addEventListener("click",Rt),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",E=>{B.viewMode=E.detail.mode;const y=document.getElementById("app");y.innerHTML=ut(),Ys(),Ie()}));const e=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");e&&s&&(e.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",E=>{const y=E.target.closest(".category-menu-item");if(y){const T=y.dataset.category||null;Tn(T),s.classList.add("hidden")}})),(G=document.getElementById("manage-categories-btn"))==null||G.addEventListener("click",E=>{E.stopPropagation();const y=document.getElementById("manage-categories-modal");y&&y.classList.add("open")}),(Z=document.getElementById("close-manage-categories-btn"))==null||Z.addEventListener("click",()=>{var E;(E=document.getElementById("manage-categories-modal"))==null||E.classList.remove("open")}),(w=document.querySelector("#manage-categories-modal .modal-overlay"))==null||w.addEventListener("click",()=>{var E;(E=document.getElementById("manage-categories-modal"))==null||E.classList.remove("open")}),(L=document.querySelector("#manage-categories-modal .modal-close"))==null||L.addEventListener("click",()=>{var E;(E=document.getElementById("manage-categories-modal"))==null||E.classList.remove("open")}),(M=document.getElementById("add-category-btn"))==null||M.addEventListener("click",async()=>{var T;const E=document.getElementById("new-category-input"),y=(T=E==null?void 0:E.value)==null?void 0:T.trim();if(y)try{await m.post("/categories",{name:y}),E.value="",d("Category added","success"),await Ne(!0),me()}catch(F){d("Failed: "+F.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(E=>{E.addEventListener("change",async y=>{const T=E.dataset.category;try{await m.put(`/categories/${encodeURIComponent(T)}/nsfw`,{isNsfw:E.checked}),d(`${T} ${E.checked?"marked as 18+":"unmarked"}`,"success"),await Ne(!0),me()}catch(F){d("Failed: "+F.message,"error"),E.checked=!E.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(E=>{E.addEventListener("click",async()=>{const y=E.dataset.category;if(confirm(`Delete category "${y}"?`))try{await m.delete(`/categories/${encodeURIComponent(y)}`),d("Category deleted","success"),B.activeCategory===y&&(B.activeCategory=null,localStorage.removeItem("library_active_category")),await Ne(!0),me()}catch(T){d("Failed: "+T.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{B.artistFilter=null,localStorage.removeItem("library_artist_filter"),me()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",E=>{var T;B.searchQuery=E.target.value,localStorage.setItem("library_search",E.target.value),B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source");const y=document.getElementById("library-grid");if(y){const F=Zt();y.innerHTML=F.map(es).join("")||ts();const W=document.getElementById("search-clear");!W&&B.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(T=document.getElementById("search-clear"))==null||T.addEventListener("click",()=>{B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),n.value="",me()})):W&&!B.searchQuery&&W.remove()}}),B.searchQuery&&n.focus());const r=document.getElementById("search-clear");r&&r.addEventListener("click",()=>{B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),me()});const o=document.getElementById("search-sources-card");o&&o.addEventListener("click",()=>{const E=B.searchAuthor||B.searchQuery,y=B.searchAuthorSource||"nhentai.net";E&&(window.location.hash=`#/scrapers?browse=${encodeURIComponent(y)}&q=${encodeURIComponent(E)}`)});const c=document.getElementById("library-sort");c&&c.addEventListener("change",E=>{B.sortBy=E.target.value,localStorage.setItem("library_sort",B.sortBy),me()}),window.removeEventListener("clearFilters",Pt),window.addEventListener("clearFilters",Pt);const l=document.getElementById("add-manga-btn"),h=document.getElementById("mobile-add-btn"),u=document.getElementById("add-modal"),g=document.getElementById("add-modal-close"),v=document.getElementById("add-modal-cancel"),C=document.getElementById("add-modal-submit"),S=document.getElementById("mobile-menu"),f=()=>{S&&S.classList.add("hidden"),u&&u.classList.add("open")};l&&l.addEventListener("click",f),h&&h.addEventListener("click",f),g&&g.addEventListener("click",()=>u.classList.remove("open")),v&&v.addEventListener("click",()=>u.classList.remove("open")),C&&C.addEventListener("click",async()=>{const E=document.getElementById("manga-url"),y=E.value.trim();if(!y){d("Please enter a URL","error");return}try{C.disabled=!0,C.textContent="Adding...",await m.addBookmark(y),d("Manga added successfully!","success"),u.classList.remove("open"),E.value="",await Ne(),me()}catch(T){d("Failed to add manga: "+T.message,"error")}finally{C.disabled=!1,C.textContent="Add"}});const I=document.getElementById("add-series-btn"),$=document.getElementById("mobile-add-series-btn"),A=document.getElementById("add-series-modal"),D=document.getElementById("add-series-modal-close"),R=document.getElementById("add-series-modal-cancel"),N=document.getElementById("add-series-modal-submit"),O=document.getElementById("mobile-menu");if((I||$)&&A){const E=()=>{O&&O.classList.add("hidden"),A.classList.add("open")};I&&I.addEventListener("click",E),$&&$.addEventListener("click",E)}D&&D.addEventListener("click",()=>A.classList.remove("open")),R&&R.addEventListener("click",()=>A.classList.remove("open")),N&&N.addEventListener("click",async()=>{const E=document.getElementById("series-title"),y=document.getElementById("series-alias"),T=E.value.trim(),F=y.value.trim();if(!T){d("Please enter a title","error");return}try{N.disabled=!0,N.textContent="Creating...",await m.createSeries(T,F),d("Series created successfully!","success"),A.classList.remove("open"),E.value="",y.value="",await Ne(!0),me()}catch(W){d("Failed to create series: "+W.message,"error")}finally{N.disabled=!1,N.textContent="Create"}});const k=A==null?void 0:A.querySelector(".modal-overlay");k&&k.addEventListener("click",()=>A.classList.remove("open"));const x=document.getElementById("empty-add-btn");x&&u&&x.addEventListener("click",()=>u.classList.add("open"));const P=document.getElementById("empty-add-series-btn");P&&A&&P.addEventListener("click",()=>A.classList.add("open"));const Q=u==null?void 0:u.querySelector(".modal-overlay");Q&&Q.addEventListener("click",()=>u.classList.remove("open")),Ie()}function Tn(t){B.activeCategory=t,t?localStorage.setItem("library_active_category",t):localStorage.removeItem("library_active_category"),me()}async function Ne(t=!1){try{if(J.isDemo){const[r,o]=await Promise.all([ue.loadBookmarks(t),ue.loadSeries(t)]);B.bookmarks=r,B.categories=[],B.series=o,B.favorites={favorites:{},listOrder:[]},B.loading=!1;return}const[e,s,a,n]=await Promise.all([ue.loadBookmarks(t),ue.loadCategories(t),ue.loadSeries(t),ue.loadFavorites(t)]);B.bookmarks=e,B.categories=s,B.series=a,B.favorites=n,B.loading=!1}catch{d("Failed to load library","error"),B.loading=!1}}async function me(){var e;const t=document.getElementById("app");if(J.isDemo)B.activeCategory=null,B.artistFilter=null,B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null;else{const s=localStorage.getItem("library_active_category");B.activeCategory!==s&&(B.activeCategory=s);const a=localStorage.getItem("library_artist_filter")||null;B.artistFilter!==a&&(B.artistFilter=a);const n=localStorage.getItem("library_search")||"";B.searchQuery!==n&&(B.searchQuery=n),B.searchAuthor=localStorage.getItem("library_search_author")||null,B.searchAuthorSource=localStorage.getItem("library_search_author_source")||null}B.loading&&(t.innerHTML=ut()),B.bookmarks.length===0&&B.loading&&await Ne(),t.innerHTML=ut(),Ys(),sessionStorage.getItem("open_add_modal")&&(sessionStorage.removeItem("open_add_modal"),(e=document.getElementById("add-modal"))==null||e.classList.add("open")),dt.forEach(s=>s()),dt=[ue.subscribe("bookmarks",s=>{B.bookmarks=s;const a=document.getElementById("library-grid");if(a){const n=Zt();a.innerHTML=n.map(es).join("")||ts()}})]}function Pn(){const t=document.getElementById("app");t&&t.removeEventListener("click",Rt),window.removeEventListener("clearFilters",Pt),dt.forEach(e=>e()),dt=[]}const Rn={mount:me,unmount:Pn,render:ut},qn="manga-offline",Dn=1,Pe="images",re="chapters";let tt=null;function Xe(){return new Promise((t,e)=>{if(tt)return t(tt);const s=indexedDB.open(qn,Dn);s.onupgradeneeded=a=>{const n=a.target.result;n.objectStoreNames.contains(Pe)||n.createObjectStore(Pe),n.objectStoreNames.contains(re)||n.createObjectStore(re)},s.onsuccess=()=>{tt=s.result,t(tt)},s.onerror=()=>e(s.error)})}function Re(t,e){return Xe().then(s=>new Promise((a,n)=>{const c=s.transaction(t,"readonly").objectStore(t).get(e);c.onsuccess=()=>a(c.result),c.onerror=()=>n(c.error)}))}function qt(t,e,s){return Xe().then(a=>new Promise((n,r)=>{const l=a.transaction(t,"readwrite").objectStore(t).put(s,e);l.onsuccess=()=>n(),l.onerror=()=>r(l.error)}))}function Dt(t,e){return Xe().then(s=>new Promise((a,n)=>{const c=s.transaction(t,"readwrite").objectStore(t).delete(e);c.onsuccess=()=>a(),c.onerror=()=>n(c.error)}))}function ss(t){return Xe().then(e=>new Promise((s,a)=>{const o=e.transaction(t,"readonly").objectStore(t).getAllKeys();o.onsuccess=()=>s(o.result),o.onerror=()=>a(o.error)}))}function Oe(t,e){return`${t}:${e}`}function as(t,e,s){return`${t}:${e}:${s}`}function Nn(t){const e=t.split(":");return{mangaId:e[0],chapterNum:parseFloat(e[1])}}async function ns(t,e,s=null){const a=await m.get(`/bookmarks/${t}/chapters/${e}/reader-images`);if(!a||!a.images||a.images.length===0)throw new Error("No images found for this chapter");const n=a.images,r=n.length;let o=0;const c=m.getToken();for(let h=0;h<n.length;h++){const u=typeof n[h]=="string"?n[h]:n[h].url,g=u.startsWith("http")?u:`${window.location.origin}${u}`;try{const v=await fetch(g,{headers:c?{Authorization:`Bearer ${c}`}:{}});if(!v.ok)throw new Error(`HTTP ${v.status}`);const C=await v.blob();await qt(Pe,as(t,e,u),C),o++,s&&s(o,r)}catch(v){console.error(`[Offline] Failed to cache image ${h+1}/${r}:`,v)}}const l={mangaId:t,chapterNum:e,imageUrls:n.map(h=>typeof h=="string"?h:h.url),savedAt:Date.now(),imageCount:o};return await qt(re,Oe(t,e),l),{success:!0,imageCount:o}}async function Fn(t,e){const s=await Re(re,Oe(t,e));if(!s)return null;const a=[];for(const n of s.imageUrls){const r=await Re(Pe,as(t,e,n));if(r)a.push(URL.createObjectURL(r));else return a.forEach(o=>URL.revokeObjectURL(o)),null}return a}async function Js(t,e){const s=await Re(re,Oe(t,e));if(s&&s.imageUrls)for(const a of s.imageUrls)await Dt(Pe,as(t,e,a));await Dt(re,Oe(t,e))}async function On(t,e){if(!await Re(re,Oe(t,e)))return!1;await Js(t,e);try{return await ns(t,e),!0}catch(a){return console.warn("[Offline] Could not re-save chapter after edit:",a),!1}}async function Un(t,e){return!!await Re(re,Oe(t,e))}async function Hn(){const t=await ss(re),e=[];for(const s of t){if(s.startsWith("auto-offline-"))continue;const a=await Re(re,s);a&&e.push(a)}return e}async function Xs(t){const e=await ss(re),s=[];for(const a of e)if(!a.startsWith("auto-offline-")&&a.startsWith(`${t}:`)){const{chapterNum:n}=Nn(a);s.push(n)}return s}async function Vn(){if(navigator.storage&&navigator.storage.estimate){const t=await navigator.storage.estimate();return{used:t.usage||0,quota:t.quota||0,usedMB:((t.usage||0)/(1024*1024)).toFixed(1),quotaMB:((t.quota||0)/(1024*1024)).toFixed(0)}}return{used:0,quota:0,usedMB:"0",quotaMB:"Unknown"}}async function zn(){const t=await Xe();await new Promise((e,s)=>{const r=t.transaction(Pe,"readwrite").objectStore(Pe).clear();r.onsuccess=e,r.onerror=s}),await new Promise((e,s)=>{const r=t.transaction(re,"readwrite").objectStore(re).clear();r.onsuccess=e,r.onerror=s})}async function jn(t,e){e?await qt(re,`auto-offline-${t}`,{enabled:!0,mangaId:t}):await Dt(re,`auto-offline-${t}`)}async function Qn(t){const e=await Re(re,`auto-offline-${t}`);return!!(e!=null&&e.enabled)}async function Wn(){return(await ss(re)).filter(e=>e.startsWith("auto-offline-")).map(e=>e.replace("auto-offline-",""))}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",async t=>{var e;if(((e=t.data)==null?void 0:e.type)==="sync-offline"){const s=t.data.mangaId;console.log(`[Offline] Auto-sync triggered for manga ${s}`);try{await Zs(s)}catch(a){console.error("[Offline] Auto-sync failed:",a)}}});async function Zs(t){try{const e=await m.getBookmark(t);if(!e)return;const s=e.downloadedChapters||[],a=await Xs(t),n=s.filter(r=>!a.includes(r));console.log(`[Offline] ${n.length} new chapters to sync for ${e.alias||e.title}`);for(const r of n)await ns(t,r),console.log(`[Offline] Auto-synced chapter ${r}`)}catch(e){console.error("[Offline] Sync error:",e)}}const Gn={saveChapterOffline:ns,getOfflineChapter:Fn,deleteOfflineChapter:Js,refreshOfflineChapter:On,isChapterOffline:Un,getOfflineChapters:Hn,getOfflineChaptersForManga:Xs,getStorageUsage:Vn,clearAllOfflineData:zn,setAutoOffline:jn,isAutoOffline:Qn,getAutoOfflineManga:Wn,syncNewChaptersForManga:Zs};let i={manga:null,chapter:null,versionUrl:null,images:[],trophyPages:{},mode:"manga",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!0,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null,isStreamingMode:!1,_streamAbortController:null};function rs(t,e=i.manga){if(!t||!e)return"";const s=(e.chapters||[]).find(n=>n.url===t),a=[];return s&&(s.releaseGroup?a.push(s.releaseGroup):s.title&&s.title!==`Chapter ${s.number}`&&a.push(s.title)),t.startsWith("local://")&&a.push("Local"),a.join(" · ")}function is(t){var s,a;const e=(a=(s=i.manga)==null?void 0:s.downloadedVersions)==null?void 0:a[t];return Array.isArray(e)?e:e?[e]:[]}function Kn(){var e;const t=is((e=i.chapter)==null?void 0:e.number);return t.length<2||!i.versionUrl?"":rs(i.versionUrl)||`Version ${t.indexOf(i.versionUrl)+1}`}function ea(){if(!i.manga||!i.chapter||!i.allFavorites||!i.allFavorites.favorites)return!1;if(i.isCollectionMode)return!0;let e=[Ft()];if(i.mode==="manga"&&!i.singlePageMode){const n=ae()[i.currentPage];n&&Array.isArray(n)?e=n:n&&n.pages&&(e=n.pages)}const s=e.map(a=>{const n=Ye(i.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in i.allFavorites.favorites){const n=i.allFavorites.favorites[a];if(Array.isArray(n)){for(const r of n)if(r.mangaId===i.manga.id&&r.chapterNum===i.chapter.number&&r.imagePaths)for(const o of r.imagePaths){const c=typeof o=="string"?o:(o==null?void 0:o.filename)||(o==null?void 0:o.path);for(const l of s)if(l&&l.filename===c)return!0}}}return!1}function Nt(){const t=document.getElementById("favorites-btn");t&&(ea()?t.classList.add("active"):t.classList.remove("active"))}function Te(){var g;if(i.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!i.manga||!i.images.length&&!i.isStreamingMode)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const t=i.manga.alias||i.manga.title,e=(g=i.chapter)==null?void 0:g.number,s=i.isCollectionMode||i.isStreamingMode?"":Kn(),a=!i.isCollectionMode&&!i.isStreamingMode&&is(e).length>1,r=ae().length,o=i.images.length;let c,l;i.mode==="webtoon"?(c=o-1,l=`${o} pages`):i.singlePageMode?(c=o-1,l=`${i.currentPage+1} / ${o}`):(c=r-1,l=`${i.currentPage+1} / ${r}`);const h=ea(),u=na();return`
    <div class="reader ${i.mode}-mode ${i.showControls?"":"controls-hidden"}">
      <!-- Unified Top Bar -->
      <div class="reader-bar">
        <button class="reader-bar-btn close-btn" id="reader-close-btn" title="Back">×</button>
        <div class="reader-title">
          <span class="manga-name">${t}</span>
          ${i.isStreamingMode?"":`<span class="chapter-name">Ch. ${e}${s?` · <span class="version-label" title="Version being read">${s}</span>`:""}</span>`}
        </div>
        ${i.isCollectionMode?"":`
        <div class="reader-bar-tools" id="reader-toolbar">
          ${i.isStreamingMode?`
          <button class="reader-bar-btn" id="stream-add-lib-btn" title="Add to Library">${p("download",{title:"Add to Library"})}</button>
          <span class="reader-bar-divider"></span>
          `:`
          <button class="reader-bar-btn ${h?"active":""}" id="favorites-btn" title="Add to favorites">${p("star",{title:"Add to favorites"})}</button>

          <button class="reader-bar-btn" id="rotate-btn" title="Rotate 90° CW">${p("rotate-cw",{title:"Rotate 90 degrees clockwise"})}</button>
          ${i.mode==="manga"&&!i.singlePageMode?`
            <button class="reader-bar-btn" id="swap-btn" title="Swap pages in spread">${p("arrow-left-right",{title:"Swap pages in spread"})}</button>
          `:""}
          ${i.singlePageMode||i.mode==="webtoon"?`
            <button class="reader-bar-btn" id="split-btn" title="Split wide image into halves">${p("scissors",{title:"Split wide image into halves"})}</button>
          `:""}
          <span class="reader-bar-divider"></span>
          `}
          ${i.mode==="manga"?`
            <button class="reader-bar-btn ${i.singlePageMode?"active":""}" id="single-page-btn" title="${i.singlePageMode?"Switch to double page":"Switch to single page"}">
              ${i.singlePageMode?p("rectangle-vertical"):p("columns-2")}
            </button>
            ${i.isStreamingMode?"":`
            <button class="reader-bar-btn ${u?"active":""}" id="trophy-btn" title="${u?"Unmark trophy":"Mark as trophy"}">${p("trophy")}</button>
            `}
          `:""}
          ${a?`<button class="reader-bar-btn" id="version-btn" title="Switch version / keep only one">${p("list",{title:"Versions"})}</button>`:""}
          <button class="reader-bar-btn" id="fullscreen-btn" title="Toggle fullscreen">${p("maximize",{title:"Toggle fullscreen"})}</button>
          <button class="reader-bar-btn" id="reader-settings-btn" title="Settings">${p("settings",{title:"Settings"})}</button>
        </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${i.mode==="webtoon"?`zoom: ${i.zoom}%`:""}">
        ${i.isCollectionMode?ta():i.mode==="webtoon"?sa():aa()}
      </div>
      
      <!-- Footer -->
      <div class="reader-footer">
        ${i.isStreamingMode?"":`
        <button class="btn btn-secondary" id="prev-chapter-btn">← Prev</button>
        `}
        <div class="page-slider-container">
          ${i.mode!=="webtoon"?`
          <input type="range" class="page-slider" id="page-slider"
            min="0" max="${c}" value="${i.currentPage}"
          >
          `:""}
          <span class="page-indicator" id="page-indicator">${l}</span>
        </div>
        ${i.isStreamingMode?"":`
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
  `}function ta(){const t=i.mode==="manga";if(t&&!i.singlePageMode){const e=i.images[i.currentPage];if(!e)return"";const s=e.urls||[e.url],a=e.displayMode||"single";return e.displaySide,a==="double"&&s.length>=2?`
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
      ${(t?[i.images[i.currentPage]]:i.images).map((e,s)=>{if(!e)return"";const a=e.displayMode||"single",n=e.displaySide||"left",r=e.urls||[e.url];return a==="double"&&r.length>=2?`
            <div class="gallery-page double-page side-${n} ${t?"manga-page":""}" data-page="${s}">
              <img src="${r[0]}" alt="Page ${s+1}A" loading="lazy">
              <img src="${r[1]}" alt="Page ${s+1}B" loading="lazy">
            </div>
          `:`
            <div class="gallery-page single-page ${t?"manga-page":""}" data-page="${s}">
              <img src="${r[0]}" alt="Page ${s+1}" loading="lazy">
            </div>
          `}).join("")}
    </div>
  `}function sa(){return`
    <div class="webtoon-pages">
      ${i.images.map((t,e)=>{const s=typeof t=="string"?t:t.url,a=i.trophyPages[e];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${e}">
          ${a?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
          <img src="${s}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function aa(){if(i.singlePageMode)return Yn();const e=ae()[i.currentPage];if(!e)return"";if(e.type==="link"){const s=e.pages[0],a=i.images[s],n=typeof a=="string"?a:a.url,r=i.trophyPages[s];return`
        <div class="manga-spread ${i.direction}">
          <div class="manga-page ${r?"trophy-page":""}">
            ${r?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
            <img src="${n}" alt="Page ${s+1}">
          </div>
          <div class="manga-page link-page" id="link-page">
            <div class="link-overlay">Ch. ${e.nextChapter} →</div>
            <img src="${e.nextImage}" alt="Next chapter preview">
          </div>
        </div>
      `}return`
    <div class="manga-spread ${i.direction}">
      ${e.map(s=>{const a=i.images[s],n=typeof a=="string"?a:a.url,r=i.trophyPages[s];return`
        <div class="manga-page ${r?"trophy-page":""}">
          ${r?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
          <img src="${n}" alt="Page ${s+1}">
        </div>
      `}).join("")}
    </div>
  `}function Yn(){const t=i.currentPage,e=i.trophyPages[t];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[r,o]=e.pages,c=i.images[r],l=i.images[o],h=typeof c=="string"?c:c==null?void 0:c.url,u=typeof l=="string"?l:l==null?void 0:l.url;if(h&&u)return`
            <div class="manga-spread ${i.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">${p("trophy")}</div><img src="${h}" alt="Page ${r+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">${p("trophy")}</div><img src="${u}" alt="Page ${o+1}"></div>
            </div>
            `}const s=i.images[t];if(!s)return"";const a=typeof s=="string"?s:s.url,n=i.trophyPages[t];return`
    <div class="manga-spread single ${i.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
        <img src="${a}" alt="Page ${t+1}">
      </div>
    </div>
  `}function ae(){const t=[],e=i.images.length;let s=0;if(i.isCollectionMode){for(let n=0;n<e;n++)t.push([n]);return t}let a=!i.firstPageSingle;for(;s<e;){const n=i.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[r,o]=n.pages;t.push([r,o]),s=Math.max(r,o)+1}else t.push([s]),s++;continue}if(!a){a=!0,t.push([s]),s++;continue}if(i.lastPageSingle&&s===e-1){i.nextChapterImage?t.push({type:"link",pages:[s],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):t.push([s]),s++;break}s+1<e?i.trophyPages[s+1]?(t.push([s]),s++):i.lastPageSingle&&s+1===e-1?(t.push([s]),i.nextChapterImage?t.push({type:"link",pages:[s+1],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):t.push([s+1]),s+=2):(t.push([s,s+1]),s+=2):(t.push([s]),s++)}return t}function na(){if(i.singlePageMode)return!!i.trophyPages[i.currentPage];const e=ae()[i.currentPage];return e?(Array.isArray(e)?e:e.pages||[]).some(a=>!!i.trophyPages[a]):!1}function os(){if(i.singlePageMode)return[i.currentPage];const e=ae()[i.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function Jn(){if(!i.manga||!i.chapter||i.isCollectionMode)return;const t=os();if(t.length===0)return;if(t.some(s=>!!i.trophyPages[s])){const s=[...t];if(i.singlePageMode){const a=i.trophyPages[i.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete i.trophyPages[a]),d(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=t,a=i.singlePageMode||t.length===1;if(!i.singlePageMode&&t.length===2){const r=await da(t,"Mark as trophy");if(!r)return;s=r.pages,a=r.pages.length===1}s.forEach(r=>{i.trophyPages[r]={isSingle:a,pages:[...s]}});const n=a?"single":"double";d(`Page${s.length>1?"s":""} marked as trophy (${n})`,"success")}try{await m.saveTrophyPages(i.manga.id,i.chapter.number,i.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}Se(),ra()}function ra(){const t=document.getElementById("trophy-btn");if(t){const e=na();t.classList.toggle("active",e),t.title=e?"Unmark trophy":"Mark as trophy"}}function ia(){if(!i.manga||!i.chapter||i.isCollectionMode||i.isStreamingMode||!i.images.length)return null;const t=i.images.length;let e=1,s=!1;if(i.mode==="manga"){const a=os();a.length>0&&(e=Math.min(...a)+1),s=a.includes(t-1)}else{const a=document.getElementById("reader-content");if(a){const n=[...a.querySelectorAll("img")],r=a.scrollTop;let o=0;n.forEach((h,u)=>{r>=o&&(e=u+1),o+=h.offsetHeight});const c=a.scrollHeight>a.clientHeight+10,l=n.length>0&&n.every(h=>h.complete&&h.naturalHeight>0);s=c?r+a.clientHeight>=a.scrollHeight-4:l}}return s&&(e=t),{mangaId:i.manga.id,chapterNumber:i.chapter.number,currentPage:e,totalPages:t}}async function qe(t=ia()){var e;if(!(!t||J.isDemo))try{if(await m.updateReadingProgress(t.mangaId,t.chapterNumber,t.currentPage,t.totalPages),t.currentPage>=t.totalPages&&((e=i.manga)==null?void 0:e.id)===t.mangaId){const s=new Set(i.manga.readChapters||[]);s.add(t.chapterNumber),i.manga.readChapters=[...s]}}catch(s){console.error("Failed to save progress:",s)}}let _e=null;function oa(){_e&&clearTimeout(_e),_e=setTimeout(()=>{_e=null,qe()},1500)}function ht(){var s,a,n,r,o,c,l,h,u,g,v,C,S,f,I,$,A,D,R,N,O;const t=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{i.isStreamingMode||(await qe(),await Le()),i.isStreamingMode?q.go("/scrapers"):i.manga&&i.manga.id!=="gallery"?q.go(`/manga/${i.manga.id}`):q.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{q.go(i.isStreamingMode?"/scrapers":"/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var k;(k=document.getElementById("reader-settings"))==null||k.classList.toggle("hidden")}),(r=document.getElementById("close-settings-btn"))==null||r.addEventListener("click",()=>{var k;(k=document.getElementById("reader-settings"))==null||k.classList.add("hidden")}),(o=document.getElementById("single-page-btn"))==null||o.addEventListener("click",()=>{if(i.singlePageMode){const k=ae();let x=0;for(let P=0;P<k.length;P++)if(k[P].includes(i.currentPage)){x=P;break}i.singlePageMode=!1,i.currentPage=x}else{const x=ae()[i.currentPage];i.singlePageMode=!0,i.currentPage=x?x[0]:0}localStorage.setItem("reader_single_page",i.singlePageMode?"1":"0"),Fe()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{Jn()}),t.querySelectorAll("[data-mode]").forEach(k=>{k.addEventListener("click",()=>{var Q,G;const x=k.dataset.mode;let P=Ft();if(i.mode=x,localStorage.setItem("reader_mode",i.mode),x==="webtoon")i.currentPage=P;else if(i.singlePageMode)i.currentPage=P;else{const Z=ae();let w=0;for(let L=0;L<Z.length;L++)if(Z[L].includes(P)){w=L;break}i.currentPage=w}(Q=i.manga)!=null&&Q.id&&((G=i.chapter)!=null&&G.number)&&Le(),Fe(),x==="webtoon"&&setTimeout(()=>{const Z=document.getElementById("reader-content");if(Z){const w=Z.querySelectorAll("img");w[P]&&w[P].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),t.querySelectorAll("[data-direction]").forEach(k=>{k.addEventListener("click",async()=>{var x,P;i.direction=k.dataset.direction,localStorage.setItem("reader_direction",i.direction),(x=i.manga)!=null&&x.id&&((P=i.chapter)!=null&&P.number)&&await Le(),Fe()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async k=>{i.firstPageSingle=k.target.checked,await Le(),Se()}),(h=document.getElementById("last-page-single"))==null||h.addEventListener("change",async k=>{var x,P;i.lastPageSingle=k.target.checked,await Le(),i.lastPageSingle&&((x=i.manga)!=null&&x.id)&&((P=i.chapter)!=null&&P.number)?await la():(i.nextChapterImage=null,i.nextChapterNum=null),Se()}),(u=document.getElementById("zoom-slider"))==null||u.addEventListener("input",k=>{i.zoom=parseInt(k.target.value);const x=document.getElementById("reader-content");x&&(x.style.zoom=`${i.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",k=>{const x=parseInt(k.target.value),P=document.getElementById("page-indicator");P&&(i.singlePageMode?P.textContent=`${x+1} / ${i.images.length}`:P.textContent=`${x+1} / ${ae().length}`)}),e.addEventListener("change",k=>{i.currentPage=parseInt(k.target.value),Se()})),i.mode==="manga"){const k=document.getElementById("reader-content");k==null||k.addEventListener("click",x=>{var Z;if(x.target.closest("button, a, .link-overlay"))return;const P=k.getBoundingClientRect(),G=(x.clientX-P.left)/P.width;G<.3?Ot():G>.7?it():(i.showControls=!i.showControls,(Z=document.querySelector(".reader"))==null||Z.classList.toggle("controls-hidden",!i.showControls))})}document.addEventListener("keydown",ua),(g=document.getElementById("prev-chapter-btn"))==null||g.addEventListener("click",()=>pt(-1)),(v=document.getElementById("next-chapter-btn"))==null||v.addEventListener("click",()=>pt(1)),i.mode==="webtoon"&&((C=document.getElementById("reader-content"))==null||C.addEventListener("click",()=>{var k;i.showControls=!i.showControls,(k=document.querySelector(".reader"))==null||k.classList.toggle("controls-hidden",!i.showControls)}),(S=document.getElementById("reader-content"))==null||S.addEventListener("scroll",oa,{passive:!0})),(f=document.getElementById("rotate-btn"))==null||f.addEventListener("click",async()=>{const k=Ct();if(!(!k||!i.manga||!i.chapter))try{d("Rotating...","info");const x=await m.rotatePage(i.manga.id,i.chapter.number,k,90,i.versionUrl);x.images&&(await St(x.images),d("Page rotated","success"))}catch(x){d("Rotate failed: "+x.message,"error")}}),(I=document.getElementById("swap-btn"))==null||I.addEventListener("click",async()=>{const x=ae()[i.currentPage];if(!x||x.length!==2||!i.manga||!i.chapter){d("Select a spread with 2 pages to swap","info");return}const P=Ye(i.images[x[0]]),Q=Ye(i.images[x[1]]);if(!(!P||!Q))try{d("Swapping...","info");const G=await m.swapPages(i.manga.id,i.chapter.number,P,Q,i.versionUrl);G.images&&(await St(G.images),d("Pages swapped","success"))}catch(G){d("Swap failed: "+G.message,"error")}}),($=document.getElementById("split-btn"))==null||$.addEventListener("click",async()=>{const k=Ct();if(!k||!i.manga||!i.chapter||!confirm("Split this page into halves? This is permanent."))return;const x=document.getElementById("split-btn");try{d("Preparing to split...","info"),x&&(x.disabled=!0),i.images=[],i.loading=!0,t.innerHTML=Te(),await new Promise(Q=>setTimeout(Q,2e3)),d("Splitting page...","info");const P=await m.splitPage(i.manga.id,i.chapter.number,k,i.versionUrl);x&&(x.disabled=!1),await Ae(i.manga.id,i.chapter.number,i.versionUrl),t.innerHTML=Te(),ht(),Se(),P.warning?d(P.warning,"warning"):d("Page split into halves","success")}catch(P){x&&(x.disabled=!1),d("Split failed: "+P.message,"error"),await Ae(i.manga.id,i.chapter.number,i.versionUrl),t.innerHTML=Te(),ht()}}),(A=document.getElementById("delete-page-btn"))==null||A.addEventListener("click",async()=>{const k=Ct();if(!(!k||!i.manga||!i.chapter)&&confirm(`Delete page "${k}" permanently? This cannot be undone.`))try{d("Deleting...","info");const x=await m.deletePage(i.manga.id,i.chapter.number,k,i.versionUrl);x.images&&(await St(x.images),d("Page deleted","success"))}catch(x){d("Delete failed: "+x.message,"error")}}),(D=document.getElementById("favorites-btn"))==null||D.addEventListener("click",async()=>{try{const P=await m.getFavorites();i.allFavorites=P,i.favoriteLists=Object.keys(P.favorites||P||{})}catch(P){console.error("Failed to load favorites",P),d("Failed to load favorites","error");return}let x=[Ft()];if(i.mode==="manga"&&!i.singlePageMode){const Q=ae()[i.currentPage];Q&&Array.isArray(Q)?x=Q:Q&&Q.pages&&(x=Q.pages)}if(x.length>1){const P=await da(x,"Select Page for Favorites");if(!P)return;x=P.pages}tr(x)}),(R=document.getElementById("version-btn"))==null||R.addEventListener("click",()=>{Zn()}),(N=document.getElementById("fullscreen-btn"))==null||N.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{d("Fullscreen not supported","info")})}),(O=document.getElementById("stream-add-lib-btn"))==null||O.addEventListener("click",async()=>{var P;const k=document.getElementById("stream-add-lib-btn");if(!((P=i.manga)!=null&&P._streamUrl)){d("No URL to add","error");return}const x=k.innerHTML;k.innerHTML=p("loader",{spin:!0}),k.disabled=!0;try{const Q=await m.addBookmark(i.manga._streamUrl);if(!Q.jobId)throw new Error("No job ID returned");d("Adding to library...","info");const G=setInterval(async()=>{var Z;try{const L=(await m.getQueueHistory(20)).find(M=>M.id===Q.jobId);L&&(L.status==="completed"?(clearInterval(G),(Z=L.result)!=null&&Z.bookmark&&(d("Added to library!","success"),k.innerHTML=p("check"),k.title="Added! Click to view",k.disabled=!1,k.onclick=()=>{q.go(`/manga/${L.result.bookmark.id}`)})):L.status==="failed"&&(clearInterval(G),d("Failed to add: "+(L.error||"Unknown error"),"error"),k.innerHTML=x,k.disabled=!1))}catch{}},1500)}catch(Q){d("Failed to add: "+Q.message,"error"),k.innerHTML=x,k.disabled=!1}}),document.body.classList.add("reader-active")}function Ye(t){var n;const e=typeof t=="string"?t:(t==null?void 0:t.url)||((n=t==null?void 0:t.urls)==null?void 0:n[0]);if(!e)return null;const a=e.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function Ct(){const t=os();return t.length===0?null:Ye(i.images[t[0]])}async function St(t){var s,a;(s=i.manga)!=null&&s.id&&((a=i.chapter)!=null&&a.number)&&!i.isStreamingMode&&Gn.refreshOfflineChapter(i.manga.id,i.chapter.number).then(n=>{n&&console.log("[Reader] Refreshed offline copy after page edit")}).catch(n=>console.warn("[Reader] Offline refresh failed:",n));const e=Date.now();if(i.images=t.map(n=>{const r=typeof n=="string"?n:n==null?void 0:n.url;if(!r)return n;const o=r+(r.includes("?")?"&":"?")+`_t=${e}`;return typeof n=="string"?o:{...n,url:o}}),i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.min(i.currentPage,i.images.length-1);else{const n=ae();i.currentPage=Math.min(i.currentPage,n.length-1)}i.currentPage=Math.max(0,i.currentPage),Se()}async function la(){var t,e;if(!(!((t=i.manga)!=null&&t.id)||!((e=i.chapter)!=null&&e.number)))try{const s=await m.getNextChapterPreview(i.manga.id,i.chapter.number);i.nextChapterImage=s.firstImage||null,i.nextChapterNum=s.nextChapter||null}catch{i.nextChapterImage=null,i.nextChapterNum=null}}async function Xn(){var r,o;if(!((r=i.manga)!=null&&r.id)||!((o=i.chapter)!=null&&o.number)||i.isCollectionMode)return;const e=[...i.manga.downloadedChapters||[]].sort((c,l)=>c-l),s=e.indexOf(i.chapter.number);if(s<0||s>=e.length-1)return;const a=e[s+1],n=i.manga.id;if(!(i._preloadCache&&i._preloadCache.chapterNum===a&&i._preloadCache.mangaId===n))try{const l=(i.manga.downloadedVersions||{})[a]||[],h=Array.isArray(l)?l[0]:l,u=h?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(h)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,v=(await m.get(u)).images||[];if(v.length===0)return;const C=v.map(S=>{const f=new Image,I=typeof S=="string"?S:S.url;return I&&(f.src=I),f});i._preloadCache={chapterNum:a,mangaId:n,images:v,imageObjects:C,versionUrl:h},console.log(`[Reader] Preloaded ${v.length} images for chapter ${a}`)}catch(c){console.warn("[Reader] Failed to preload next chapter:",c)}}function ca(t,e,s=i.manga,a=[],n={}){return new Promise(r=>{const o=document.createElement("div");o.className="version-modal-overlay",o.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${t.length} versions</h3>
                <p>${n.allowKeep?"Switch version, or keep one and delete the rest:":"Select which version to read:"}</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const c=o.querySelector(".version-list");t.forEach((l,h)=>{const u=document.createElement("button");u.className="version-item";const g=n.current&&n.current===l;g&&u.classList.add("current");const v=(rs(l,s)||`Version ${h+1}`)+(g?" (reading)":""),C=a.find($=>$.url===l),S=[];if(C!=null&&C.imageCount&&S.push(`${C.imageCount} pages`),C!=null&&C.folder&&S.push(C.folder),u.innerHTML=`<span class="version-item-title"></span>${S.length?'<span class="version-item-meta"></span>':""}`,u.querySelector(".version-item-title").textContent=v,S.length&&(u.querySelector(".version-item-meta").textContent=S.join(" · ")),u.title=l,u.addEventListener("click",()=>{o.remove(),r(l)}),!n.allowKeep){c.appendChild(u);return}const f=document.createElement("div");f.className="version-item-row",f.appendChild(u);const I=document.createElement("button");I.className="version-item-keep",I.textContent="Keep only",I.title="Delete every other downloaded version of this chapter",I.addEventListener("click",()=>{o.remove(),r({keep:l})}),f.appendChild(I),c.appendChild(f)}),o.querySelector(".version-cancel").addEventListener("click",()=>{o.remove(),r(null)}),o.addEventListener("click",l=>{l.target===o&&(o.remove(),r(null))}),document.body.appendChild(o)})}async function Zn(){if(!i.manga||!i.chapter||i.isCollectionMode||i.isStreamingMode)return;const t=i.chapter.number,e=is(t);if(e.length<2)return;let s=[];try{s=(await m.getChapterVersions(i.manga.id,t)).versions||[]}catch{}const a=await ca(e,t,i.manga,s,{current:i.versionUrl,allowKeep:!0});if(a){if(typeof a=="string"){a!==i.versionUrl&&(await qe(),q.go(`/read/${i.manga.id}/${t}?version=${encodeURIComponent(a)}`));return}a.keep&&await er(t,a.keep,e)}}async function er(t,e,s){var c;const a=s.filter(l=>l!==e),n=rs(e)||"this version";if(!confirm(`Keep only "${n}" and delete the other ${a.length} downloaded version${a.length>1?"s":""} of chapter ${t}?`))return;const r=i.manga.id;let o=0;for(const l of a)try{await m.deleteChapterVersion(r,t,l)}catch(h){o++,d("Failed to delete a version: "+h.message,"error")}o===0&&d("Other versions deleted","success");try{const l=await m.getBookmark(r);((c=i.manga)==null?void 0:c.id)===r&&(i.manga=l)}catch{}e!==i.versionUrl?q.go(`/read/${r}/${t}?version=${encodeURIComponent(e)}`):Fe()}function tr(t){if(!i.manga||!i.chapter)return;const e=t.map(l=>{const h=Ye(i.images[l]);return h?{filename:h}:null}).filter(Boolean),s=l=>{if(!i.allFavorites||!i.allFavorites.favorites)return-1;const h=i.allFavorites.favorites[l];if(!Array.isArray(h))return-1;for(let u=0;u<h.length;u++){const g=h[u];if(g.mangaId===i.manga.id&&g.chapterNum===i.chapter.number&&g.imagePaths)for(const v of g.imagePaths){const C=typeof v=="string"?v:(v==null?void 0:v.filename)||(v==null?void 0:v.path);for(const S of e)if(S&&S.filename===C)return u}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";i.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',i.favoriteLists.forEach(l=>{const u=s(l)!==-1;n+=`
                <button class="page-picker-option list-option ${u?"active-list":""}" data-list="${l}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${l}</span>
                    <span style="font-size: 1.2em;">${p(u?"check":"plus")}</span>
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
    `;const r=document.createElement("style");r.innerHTML=`
        .list-option.active-list {
            background: #2a3b2a;
            border-color: #4CAF50;
        }
        .list-option.active-list:hover {
            background: #384d38;
        }
    `,a.appendChild(r),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),Nt()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),Nt())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const h=l.dataset.list,u=s(h),g=u!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(g){await m.removeFavoriteItem(h,u);const v=await m.getFavorites();i.allFavorites=v,l.classList.remove("active-list"),l.querySelector("span:last-child").innerHTML=p("plus")}else{const v=t.length>1?"double":"single",C={mangaId:i.manga.id,chapterNum:i.chapter.number,title:`${i.manga.alias||i.manga.title} Ch.${i.chapter.number} p${t[0]+1}`,imagePaths:e,displayMode:v,displaySide:i.direction==="rtl"?"right":"left"};await m.addFavoriteItem(h,C);const S=await m.getFavorites();i.allFavorites=S,l.classList.add("active-list"),l.querySelector("span:last-child").innerHTML=p("check")}}catch(v){console.error(v)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function da(t,e){return new Promise(s=>{const[a,n]=t,r=i.images[a],o=i.images[n],c=typeof r=="string"?r:r==null?void 0:r.url,l=typeof o=="string"?o:o==null?void 0:o.url,h=i.direction==="rtl",u=h?n:a,g=h?a:n,v=h?l:c,C=h?c:l,S=document.createElement("div");S.className="page-picker-overlay",S.innerHTML=`
            <div class="page-picker-modal">
                <h3>${e}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${u+1}">
                        <img src="${v}" alt="Page ${u+1}">
                        <span class="page-picker-label">Page ${u+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${g+1}">
                        <img src="${C}" alt="Page ${g+1}">
                        <span class="page-picker-label">Page ${g+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    ${p("columns-2")} Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const f=I=>{S.remove(),s(I)};S.querySelectorAll(".page-picker-option").forEach(I=>{I.addEventListener("click",()=>{const $=I.dataset.choice;$==="left"?f({pages:[u]}):$==="right"?f({pages:[g]}):$==="both"&&f({pages:t})})}),S.querySelector(".page-picker-cancel").addEventListener("click",()=>f(null)),S.addEventListener("click",I=>{I.target===S&&f(null)}),document.body.appendChild(S)})}function Ft(){if(i.mode==="webtoon"){const t=document.getElementById("reader-content");if(t){const e=t.querySelectorAll("img");if(e.length>0){const s=t.scrollTop;if(s>10){let a=0;for(let n=0;n<e.length;n++){const r=e[n].offsetHeight;if(a+r>s)return n;a+=r}}}}return 0}else{if(i.singlePageMode)return i.currentPage;{const e=ae()[i.currentPage];return e&&e.length>0?e[0]:0}}}function ua(t){var e;if(!(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA")){if(t.key==="Escape"){const s=(e=i.manga)==null?void 0:e.id;Promise.all([qe(),Le()]).finally(()=>{s&&q.go(`/manga/${s}`)});return}if(i.mode==="manga")t.key==="ArrowLeft"?i.direction==="rtl"?it():Ot():t.key==="ArrowRight"?i.direction==="rtl"?Ot():it():t.key===" "&&(t.preventDefault(),it());else if(i.mode==="webtoon"&&t.key===" "){t.preventDefault();const s=document.getElementById("reader-content");if(s){const a=s.clientHeight*.8;s.scrollBy({top:t.shiftKey?-a:a,behavior:"smooth"})}}}}function it(){const t=ae(),e=i.singlePageMode?i.images.length-1:t.length-1;if(i.currentPage<e)i.currentPage++,Se();else{const s=t[i.currentPage],a=s&&s.type==="link";qe(),a&&(i.navigationDirection="next-linked"),pt(1)}}function Ot(){i.currentPage>0?(i.currentPage--,Se()):pt(-1)}function Se(){const t=document.getElementById("reader-content");if(t){t.innerHTML=i.isCollectionMode?ta():i.mode==="webtoon"?sa():aa();const e=document.getElementById("page-indicator");e&&(i.singlePageMode?e.textContent=`${i.currentPage+1} / ${i.images.length}`:e.textContent=`${i.currentPage+1} / ${ae().length}`);const s=document.getElementById("page-slider");s&&(s.value=i.currentPage,s.max=i.singlePageMode?i.images.length-1:ae().length-1),ra(),Nt(),i.mode==="manga"&&oa()}}function Fe(){const t=document.getElementById("app");t&&(t.innerHTML=Te(),ht())}async function pt(t){if(console.log("[Nav] navigateChapter called with delta:",t),i.isStreamingMode)return;if(!i.manga||!i.chapter){console.log("[Nav] early return - no manga or chapter");return}await qe(),await Le();const s=[...i.manga.downloadedChapters||[]].sort((r,o)=>r-o),a=s.indexOf(i.chapter.number),n=a+t;if(console.log("[Nav]",{delta:t,chapterNumber:i.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length){i.navigationDirection||(i.navigationDirection=t<0?"prev":null);const r=s[n],c=(i.manga.downloadedVersions||{})[r]||[],l=Array.isArray(c)?c[0]:c,h=l?`?version=${encodeURIComponent(l)}`:"";console.log("[Nav] Calling router.go with:",`/read/${i.manga.id}/${r}${h}`),q.go(`/read/${i.manga.id}/${r}${h}`)}else d(t>0?"Last chapter":"First chapter","info")}async function Ae(t,e,s){var a,n,r,o,c;console.log("[Reader] loadData called:",{mangaId:t,chapterNum:e,versionUrl:s});try{if(i.mode=localStorage.getItem("reader_mode")||"manga",i.direction=localStorage.getItem("reader_direction")||"rtl",i.singlePageMode=localStorage.getItem("reader_single_page")!=="0",i.firstPageSingle=!0,i.lastPageSingle=!1,i.versionUrl=null,t==="gallery"){const l=decodeURIComponent(e),u=((a=(await m.getFavorites()).favorites)==null?void 0:a[l])||[];i.images=[];for(const g of u){const v=g.imagePaths||[],C=[];for(const S of v){let f;typeof S=="string"?f=S:S&&typeof S=="object"&&(f=S.filename||S.path||S.name||S.url,f&&f.includes("/")&&(f=f.split("/").pop()),f&&f.includes("\\")&&(f=f.split("\\").pop())),f&&C.push(`/api/public/chapter-images/${g.mangaId}/${g.chapterNum}/${encodeURIComponent(f)}`)}C.length>0&&i.images.push({urls:C,displayMode:g.displayMode||"single",displaySide:g.displaySide||"left"})}i.manga={id:"gallery",title:l,alias:l},i.chapter={number:"Gallery"},i.isGalleryMode=!0,i.isCollectionMode=!0,i.images.length===0&&d("Gallery is empty","warning")}else if(t==="trophies"){const l=e;let h=[],u="Trophies";if(l.startsWith("series-")){const g=l.replace("series-",""),C=(await store.loadSeries()).find(I=>I.id===g);u=C?C.alias||C.title:"Series Trophies";const f=(await store.loadBookmarks()).filter(I=>I.seriesId===g);for(const I of f){const $=await m.getTrophyPagesAll(I.id);for(const A in $)for(const D in $[A]){const R=$[A][D],O=(await m.getChapterImages(I.id,A)).images[D],k=typeof O=="string"?O.split("/").pop():(O==null?void 0:O.filename)||(O==null?void 0:O.path);h.push({mangaId:I.id,chapterNum:A,imagePaths:[{filename:k}],displayMode:R.isSingle?"single":"double",displaySide:"left"})}}}else{const g=await m.getBookmark(l);u=g?g.alias||g.title:"Manga Trophies";const v=await m.getTrophyPagesAll(l);for(const C in v)for(const S in v[C]){const f=v[C][S],$=(await m.getChapterImages(l,C)).images[S],A=typeof $=="string"?$.split("/").pop():($==null?void 0:$.filename)||($==null?void 0:$.path);h.push({mangaId:l,chapterNum:C,imagePaths:[{filename:decodeURIComponent(A)}],displayMode:f.isSingle?"single":"double",displaySide:"left"})}}i.images=h.map(g=>{const v=g.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${g.mangaId}/${g.chapterNum}/${encodeURIComponent(v)}`],displayMode:g.displayMode,displaySide:g.displaySide}}),i.manga={id:"trophies",title:u,alias:u},i.chapter={number:"🏆"},i.isCollectionMode=!0,i.isGalleryMode=!1}else if(t==="stream"){i.isStreamingMode=!0,i.isCollectionMode=!1,i.isGalleryMode=!1,i.singlePageMode=!0;const l=sessionStorage.getItem("streamPreviewUrl"),h=sessionStorage.getItem("streamPreviewScraper"),u=sessionStorage.getItem("streamPreviewTitle")||"Preview";i.manga={id:"stream",title:u,alias:u,_streamUrl:l},i.chapter={number:1},i.images=[],l?sr(l,h):d("No stream URL found","error")}else{i.isGalleryMode=!1;const l=await m.getBookmark(t);i.manga=l,console.log("[Reader] manga loaded, finding chapter..."),i.chapter=((n=l.chapters)==null?void 0:n.find(u=>u.number===parseFloat(e)))||{number:parseFloat(e)};const h=parseFloat(e);if(i._preloadCache&&i._preloadCache.mangaId===t&&i._preloadCache.chapterNum===h)console.log("[Reader] Using preloaded images for chapter",e),i.images=i._preloadCache.images||[],i.versionUrl=s||i._preloadCache.versionUrl||null,i._preloadCache=null;else{i.versionUrl=s||null;const u=s?`/bookmarks/${t}/chapters/${e}/reader-images?version=${encodeURIComponent(s)}`:`/bookmarks/${t}/chapters/${e}/reader-images`,g=await m.get(u);console.log("[Reader] images loaded, count:",(r=g.images)==null?void 0:r.length),i.images=g.images||[]}try{const u=await m.getChapterSettings(t,e);if(Is(u))Ls(u);else try{const v=[...i.manga.downloadedChapters||[]].sort(($,A)=>$-A),C=parseFloat(e),S=v.indexOf(C),f=[];if(S!==-1){for(let $=S-1;$>=0;$--)f.push(v[$]);for(let $=S+1;$<v.length;$++)f.push(v[$])}const I=12;for(const $ of f.slice(0,I)){const A=await m.getChapterSettings(t,$);if(Is(A)){Ls(A),console.log("[Reader] Inherited settings from chapter",$);break}}}catch(g){console.warn("Failed to inherit chapter settings",g)}}catch(u){console.warn("Failed to load chapter settings",u)}try{const u=await m.getTrophyPages(t,e);i.trophyPages=u||{}}catch(u){console.warn("Failed to load trophy pages",u)}try{const u=await m.getFavorites();i.allFavorites=u,i.favoriteLists=Object.keys(u.favorites||u||{})}catch(u){console.warn("Failed to load favorites",u)}}if(i.isStreamingMode)i.currentPage=0;else{const l=parseFloat(e),h=(c=(o=i.manga)==null?void 0:o.readingProgress)==null?void 0:c[l];if(h&&h.page<h.totalPages)if(i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,h.page-1);else{const u=Math.max(0,h.page-1),g=ae();let v=0;for(let C=0;C<g.length;C++){const S=g[C],f=Array.isArray(S)?S:S.pages||[];if(f.includes(u)||f[0]>=u){v=C;break}v=C}i.currentPage=v}else i.currentPage=0,i._resumeScrollToPage=h.page-1;else i.currentPage=0}}catch(l){console.error("Error loading chapter:",l),d("Failed to load chapter","error")}if(!i.isStreamingMode){if(i.navigationDirection==="prev"&&i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,i.images.length-1);else{const l=ae();i.currentPage=Math.max(0,l.length-1)}else if(i.navigationDirection==="next-linked"&&i.mode==="manga"&&i.images.length>1)if(i.singlePageMode)i.currentPage=1;else{const l=ae();let h=0;for(let u=0;u<l.length;u++){const g=l[u];if((Array.isArray(g)?g:g.pages||[]).includes(1)){h=u;break}}i.currentPage=h}}i.navigationDirection=null,i.lastPageSingle&&!i.isStreamingMode&&await la(),i.loading=!1,Fe(),i.isStreamingMode||Xn(),i.mode==="webtoon"&&i._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const h=l.querySelectorAll("img");h[i._resumeScrollToPage]&&h[i._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete i._resumeScrollToPage},300)}async function sr(t,e){i._streamAbortController&&i._streamAbortController.abort(),i._streamAbortController=new AbortController;const{signal:s}=i._streamAbortController;try{let a="/api/scrapers/preview-images-stream?";e&&(a+=`scraper=${encodeURIComponent(e)}&`),a+=`url=${encodeURIComponent(t)}`;const n=localStorage.getItem("manga_auth_token"),r={};n&&(r.Authorization=`Bearer ${n}`),console.log("[Reader] Starting stream from:",a);const o=await fetch(a,{headers:r,signal:s});if(!o.ok)throw new Error(`Failed to start stream: ${o.statusText}`);const c=o.body.getReader(),l=new TextDecoder;let h="";for(;;){const{value:u,done:g}=await c.read();if(g||s.aborted)break;h+=l.decode(u,{stream:!0});const v=h.split(`

`);h=v.pop();let C=!1;for(const S of v)if(S.startsWith("data: ")){const f=S.substring(6);try{const I=JSON.parse(f);if(I.type==="metadata")i.manga.title=I.title,i.manga.alias=I.title,Fe();else if(I.type==="image"){const $=`/api/scrapers/proxy-cover?url=${encodeURIComponent(I.url)}`;i.images.push($),C=!0}else if(I.type==="error")d("Stream error: "+I.message,"error");else if(I.type==="done")break}catch(I){console.error("Parse error for SSE data:",I)}}C&&Se()}}catch(a){a.name!=="AbortError"&&(console.error("Preview stream error:",a),d("Stream failed: "+a.message,"error"))}finally{i._streamAbortController&&i._streamAbortController.signal===s&&(i._streamAbortController=null)}}async function ar(t=[]){console.log("[Reader] mount called with params:",t);let[e,s]=t,a=null;if(s&&s.includes("?")){const[r,o]=s.split("?");s=r,a=new URLSearchParams(o).get("version")}else{const r=window.location.hash.split("?")[1];r&&(a=new URLSearchParams(r).get("version"))}if(console.log("[Reader] mangaId:",e,"chapterNum:",s,"urlVersion:",a),!e||!s){q.go("/");return}const n=document.getElementById("app");if(i.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),i.images=[],i.singlePageMode=!1,i._resumeScrollToPage=null,i.nextChapterImage=null,i.nextChapterNum=null,n.innerHTML=Te(),a)await Ae(e,s,decodeURIComponent(a));else try{const r=await m.getBookmark(e),o=r.downloadedVersions||{},c=new Set(r.deletedChapterUrls||[]),l=o[parseFloat(s)];let h=[];if(Array.isArray(l)&&(h=l.filter(u=>!c.has(u))),h.length>1){let u=[];try{u=(await m.getChapterVersions(e,s)).versions||[]}catch{}const g=await ca(h,s,r,u);if(g===null){q.go(`/manga/${e}`);return}await Ae(e,s,g)}else h.length===1?await Ae(e,s,h[0]):await Ae(e,s)}catch(r){console.log("[Reader] Error in version check, falling back:",r),await Ae(e,s)}if(n.innerHTML=Te(),console.log("[Reader] render called, loading:",i.loading,"manga:",!!i.manga,"images:",i.images.length),ht(),i.mode==="webtoon"&&i._resumeScrollToPage!=null){const r=i._resumeScrollToPage;i._resumeScrollToPage=null,setTimeout(()=>{const o=document.getElementById("reader-content");if(o){const c=o.querySelectorAll("img");c[r]&&c[r].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function nr(){console.log("[Reader] unmount called"),i._streamAbortController&&(i._streamAbortController.abort(),i._streamAbortController=null),_e&&(clearTimeout(_e),_e=null);const t=ia(),e=ha();document.body.classList.remove("reader-active"),document.removeEventListener("keydown",ua),i.manga=null,i.chapter=null,i.versionUrl=null,i.images=[],i.loading=!0,i.singlePageMode=!1,i.isStreamingMode=!1,i._resumeScrollToPage=null,i._preloadCache=null,await qe(t),await Le(e)}function Is(t){return!!t&&(t.mode!==void 0||t.direction!==void 0||t.firstPageSingle!==void 0||t.lastPageSingle!==void 0)}function Ls(t){t&&(t.mode&&(i.mode=t.mode),t.direction&&(i.direction=t.direction),t.firstPageSingle!==void 0&&(i.firstPageSingle=t.firstPageSingle),t.lastPageSingle!==void 0&&(i.lastPageSingle=t.lastPageSingle))}function ha(){return!i.manga||!i.chapter||i.isCollectionMode||i.isStreamingMode?null:{mangaId:i.manga.id,chapterNumber:i.chapter.number,settings:{mode:i.mode,direction:i.direction,firstPageSingle:i.firstPageSingle,lastPageSingle:i.lastPageSingle}}}async function Le(t=ha()){if(!(!t||J.isDemo))try{await m.updateChapterSettings(t.mangaId,t.chapterNumber,t.settings)}catch(e){console.error("Failed to save settings:",e)}}async function pa(t){try{const e=await m.getBookmark(t),s=e.downloadedChapters||[],a=new Set(e.readChapters||[]),n=e.readingProgress||{},r=e.downloadedVersions||{},o=[...s].sort((l,h)=>l-h);let c=null;for(const l of o){const h=n[l];if(h&&h.page<h.totalPages&&!a.has(l)){c=l;break}}if(c===null){for(const l of o)if(!a.has(l)){c=l;break}}if(c===null&&o.length>0&&(c=o[0]),c!==null){const l=r[c]||[],h=Array.isArray(l)?l[0]:l,u=h?`?version=${encodeURIComponent(h)}`:"";q.go(`/read/${t}/${c}${u}`)}else d("No downloaded chapters to read","info")}catch(e){d("Failed to continue reading: "+e.message,"error")}}const rr={mount:ar,unmount:nr,render:Te,continueReading:pa},Ke=50;let b={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1,offlineChapters:new Set,isAutoOffline:!1,volumesCollapsed:!1};const ma=t=>`volumes_collapsed_${t}`;function ir(t){var s;const e=localStorage.getItem(ma(t==null?void 0:t.id));return e!==null?e==="1":(((s=t==null?void 0:t.volumes)==null?void 0:s.length)||0)>8}function or(t){if(!(t.autoCheck===!0))return`<button class="btn btn-secondary" id="schedule-btn">${p("alarm-clock")} Schedule</button>`;const s=t.checkSchedule==="weekly"?`${(t.checkDay||"monday").charAt(0).toUpperCase()+(t.checkDay||"monday").slice(1)} ${t.checkTime||"06:00"}`:t.checkSchedule==="daily"?`Daily ${t.checkTime||"06:00"}`:"Every 6h";return`<button class="btn btn-primary" id="schedule-btn">${p("alarm-clock")} ${s}</button>`}function lr(t){const e=t.autoCheck===!0,s=t.checkSchedule||"daily",a=t.checkDay||"monday",n=t.checkTime||"06:00",r=t.autoDownload||!1;return`
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
              <input type="checkbox" id="auto-download-toggle" ${r?"checked":""} style="width: 18px; height: 18px;">
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
  `}function Ut(){var O;if(b.loading)return`
      ${ce()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=b.manga;if(!t)return`
      ${ce()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.chapters||[],a=new Set(t.downloadedChapters||[]),n=new Set(t.readChapters||[]),r=new Set(s.map(k=>k.number)).size,o=new Set(t.excludedChapters||[]),c=new Set(t.deletedChapterUrls||[]),l=t.volumes||[],h=new Set;l.forEach(k=>{(k.chapters||[]).forEach(x=>h.add(x))});let u;b.filter==="hidden"?u=s.filter(k=>o.has(k.number)||c.has(k.url)):u=s.filter(k=>!o.has(k.number)&&!c.has(k.url));const g=u.filter(k=>!h.has(k.number));let v=[];if(b.activeVolume){const k=new Set(b.activeVolume.chapters||[]);v=u.filter(x=>k.has(x.number))}else v=g;const C=new Map;v.forEach(k=>{C.has(k.number)||C.set(k.number,[]),C.get(k.number).push(k)});let S=Array.from(C.entries()).sort((k,x)=>k[0]-x[0]);b.filter==="downloaded"?S=S.filter(([k])=>a.has(k)):b.filter==="not-downloaded"?S=S.filter(([k])=>!a.has(k)):b.filter==="main"?S=S.filter(([k])=>Number.isInteger(k)):b.filter==="extra"&&(S=S.filter(([k])=>!Number.isInteger(k)));const f=Math.max(1,Math.ceil(S.length/Ke));b.currentPage>=f&&(b.currentPage=Math.max(0,f-1));const I=b.currentPage*Ke,A=[...S.slice(I,I+Ke)].reverse(),D=C.size,R=[...C.keys()].filter(k=>a.has(k)).length;n.size;let N="";if(b.activeVolume){const k=b.activeVolume;let x=null;k.local_cover?x=`/api/public/covers/${t.id}/${encodeURIComponent(k.local_cover.split(/[/\\]/).pop())}`:k.cover&&(x=k.cover),N=`
      ${ce()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${x?`<img src="${x}" alt="${k.name}">`:pe("book")}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${t.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${k.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${D} Chapters</span>
                ${R>0?`<span class="meta-item downloaded">${R} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${t.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${b.manageChapters?"Done Managing":`${p("plus")} Add Chapters`}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${k.id}">${p("pencil")} Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const k=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover;N=`
        ${ce()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${k?`<img src="${k}" alt="${e}">`:pe("book")}
              </div>
              <div class="manga-detail-info">
                <h1>${e}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${t.website||"Local"}</span>
                  <span class="meta-item" title="${r} distinct chapters across ${((O=t.chapters)==null?void 0:O.length)||0} version rows">${r} Chapters</span>
                  ${a.size>0?`<span class="meta-item downloaded">${a.size} Downloaded</span>`:""}
                  ${n.size>0?`<span class="meta-item">${n.size} Read</span>`:""}
                </div>
                ${(t.artists||[]).length>0||(t.categories||[]).length>0?`
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(t.artists||[]).length>0?`
                    <span class="meta-label">Author:</span>
                    ${t.artists.map(x=>`<a href="#//" class="artist-link" data-artist="${x}">${x}</a>`).join(", ")}
                  `:""}
                  ${(t.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(t.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${t.categories.map(x=>`<span class="tag">${x}</span>`).join("")}
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
              <button class="btn btn-secondary" id="anilist-track-btn" style="display:none;">${p("link")} Track</button>
              ${(t.volumes||[]).length===0?'<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>':""}
              ${or(t)}
            </div>
            ${t.description?`<p class="manga-description">${t.description}</p>`:""}
            ${b.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">${p("package")} CBZ Files (${b.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${b.cbzFiles.map(x=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${x.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${x.chapterNumber?`Chapter ${x.chapterNumber}`:"Unknown chapter"}
                        ${x.isExtracted?` | ${p("check")} Extracted`:""}
                      </div>
                    </div>
                    <button class="btn btn-small ${x.isExtracted?"btn-secondary":"btn-primary"}" 
                            data-cbz-path="${encodeURIComponent(x.path)}" 
                            data-cbz-chapter="${x.chapterNumber||1}"
                            data-cbz-extracted="${x.isExtracted}">
                      ${x.isExtracted?"Re-Extract":"Extract"}
                    </button>
                  </div>
                `).join("")}
              </div>
            </div>
            `:""}
          </div>
        </div>
      `}return`
    ${N}
        
        ${b.activeVolume?b.manageChapters?fr(t,g):"":vr(t,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${b.filter==="all"?"active":""}" data-filter="all">
                All (${C.size})
              </button>
              <button class="filter-btn ${b.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${R})
              </button>
              <button class="filter-btn ${b.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${b.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${f>1?Bs(f):""}
          
          <div class="chapter-list">
            ${A.map(([k,x])=>mr(k,x,a,n,t)).join("")}
          </div>
          
          ${f>1?Bs(f):""}
        </div>
      ${pr()}
    </div>
  `}function cr(){const t=b.manga;if(!t)return"";const e=t.alias||t.title;return`
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
  `}function dr(){const t=b.manga;return t?`
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
  `:""}function ur(){const t=b.manga;return t?`
    <div class="modal" id="anilist-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h2>${p("link")} AniList Tracking</h2>
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
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Close</button>
        </div>
      </div>
    </div>
  `:""}async function mt(){var s,a;const t=document.getElementById("anilist-track-btn"),e=b.manga;if(e)try{const n=await m.anilistStatus();if(!(n!=null&&n.configured)||!(n!=null&&n.connected)||((s=b.manga)==null?void 0:s.id)!==e.id){t&&(t.style.display="none");return}const{mapping:r}=await m.anilistGetMapping(e.id);if(((a=b.manga)==null?void 0:a.id)!==e.id)return;t&&(t.style.display="",t.style.borderColor=r?"var(--accent-primary)":"",t.innerHTML=r?`${p("check")} Tracked`:`${p("link")} Track`,t.title=r?`Linked to ${r.anilist_title}`:"Link this manga to AniList"),hr(r,e)}catch(n){console.warn("Failed to load AniList state:",n),t&&(t.style.display="none")}}function hr(t,e){var n,r,o;const s=document.getElementById("anilist-tracked-view"),a=document.getElementById("anilist-search-view");if(!(!s||!a)){if(!t){s.style.display="none",s.innerHTML="",a.style.display="";return}a.style.display="none",s.style.display="",s.innerHTML=`
    <div style="margin-bottom: 12px;">
      <strong>${t.anilist_title}</strong>
      <div class="text-muted" style="font-size: 0.85em;">
        ${[t.media_format,t.chapters_total!=null?`${t.chapters_total} chapters`:null].filter(Boolean).join(" • ")}
      </div>
      ${t.last_pushed_progress!=null?`<div class="text-muted" style="font-size: 0.8em;">Last synced: ch. ${t.last_pushed_progress}</div>`:""}
    </div>
    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 12px;">
      <input type="checkbox" id="anilist-sync-toggle" ${t.sync_enabled==1?"checked":""}> Sync progress
    </label>
    <div style="display: flex; gap: 8px;">
      <button class="btn btn-small btn-secondary" id="anilist-relink-btn">Change</button>
      <button class="btn btn-small btn-danger" id="anilist-unlink-btn">Unlink</button>
    </div>
  `,(n=document.getElementById("anilist-sync-toggle"))==null||n.addEventListener("change",async c=>{try{await m.anilistSetSyncEnabled(e.id,c.target.checked),d(c.target.checked?"AniList sync enabled":"AniList sync disabled","success")}catch(l){c.target.checked=!c.target.checked,d("Failed to update sync: "+l.message,"error")}}),(r=document.getElementById("anilist-relink-btn"))==null||r.addEventListener("click",()=>{s.style.display="none",a.style.display=""}),(o=document.getElementById("anilist-unlink-btn"))==null||o.addEventListener("click",async()=>{if(confirm(`Unlink "${t.anilist_title}" from AniList?`))try{await m.anilistUnmap(e.id),d("Unlinked from AniList","success"),mt()}catch(c){d("Failed to unlink: "+c.message,"error")}})}}function pr(){var e,s;const t=b.manga;return`
    ${t?lr(t):""}
    ${Rr()}
    ${cr()}
    ${dr()}
    ${ur()}

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
  `}function mr(t,e,s,a,n){var Z,w,L,M,E;const r=s.has(t),o=a.has(t),c=!Number.isInteger(t),l=((Z=n.downloadedVersions)==null?void 0:Z[t])||[],h=new Set(n.deletedChapterUrls||[]),u=e.filter(y=>b.filter==="hidden"?!0:!h.has(y.url)),g=!!b.activeVolume,v=n.chapterSettings||{},C=g?!0:!!((w=v[t])!=null&&w.locked);let S=u;if(g||C){const y=u.filter(T=>Array.isArray(l)?l.includes(T.url):l===T.url);S=y.length>0?y:u}S.sort((y,T)=>{const F=Array.isArray(l)?l.includes(y.url):l===y.url;return((Array.isArray(l)?l.includes(T.url):l===T.url)?1:0)-(F?1:0)});const f=((L=n.chapterFolders)==null?void 0:L[t])||[],I=f.filter(y=>!y.url),$=f.reduce((y,T)=>Math.max(y,T.imageCount),0),A=y=>y.imageCount<3||$>=6&&y.imageCount<$/2,D=y=>f.find(T=>T.url===y)||null,R=f.filter(y=>y.url&&A(y)),N=S.length>1||I.length>0,O=(M=S[0])!=null&&M.url?encodeURIComponent(S[0].url):null,k=["chapter-item",r?"downloaded":"",o?"read":"",c?"extra":""].filter(Boolean).join(" "),x=Array.isArray(l)?l:l?[l]:[],P=x.length,Q=N?`
    <div class="versions-dropdown hidden" id="versions-${t}">
      ${S.map(y=>{const T=encodeURIComponent(y.url),F=x.includes(y.url),W=y.url.startsWith("local://"),U=y.title&&y.title!==`Chapter ${t}`?y.title:"",se=U||y.releaseGroup||"Version",j=[U&&y.releaseGroup?y.releaseGroup:"",gr(y.uploadedAt)].filter(Boolean).join(" · ");return`
          <div class="version-row ${F?"downloaded":""}"
               data-version-url="${T}" data-num="${t}">
            <span class="version-title" style="cursor: pointer; flex: 1;" title="${xt(y.url)}">${ot(se)}${W?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}${j?`<span class="version-meta">${ot(j)}</span>`:""}${(()=>{const K=F?D(y.url):null;if(!K)return"";const le=A(K);return`<span class="version-meta version-pages ${le?"warn":""}" title="${xt(K.folder)}">${K.imageCount} pages${le?" - incomplete?":""}</span>`})()}</span>
            <div class="version-actions">
              ${F?`<button class="btn-icon small success" data-action="read-version" data-num="${t}" data-url="${T}">${p("play",{title:"Read"})}</button>
                   ${P>1?`<button class="btn-icon small" data-action="keep-version" data-num="${t}" data-url="${T}" title="Keep only this version (delete the other ${P-1})">${p("check",{title:"Keep only this version"})}</button>`:""}
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${t}" data-url="${T}">${p("trash-2",{title:"Delete version"})}</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${t}" data-url="${T}">${p("download",{title:"Download"})}</button>`}
              ${h.has(y.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${t}" data-url="${T}" title="Restore Version">${p("undo-2",{title:"Restore version"})}</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${t}" data-url="${T}" title="Hide Version">${p("eye-off",{title:"Hide version"})}</button>`}
            </div>
          </div>
        `}).join("")}
      ${I.map(y=>`
          <div class="version-row orphan" data-num="${t}">
            <span class="version-title" title="${xt(y.folder)}">Leftover folder on disk<span class="version-meta">${ot(y.folder)} · ${y.imageCount} pages</span></span>
            <div class="version-actions">
              <button class="btn-icon small danger" data-action="delete-folder" data-num="${t}" data-folder="${encodeURIComponent(y.folder)}">${p("trash-2",{title:"Delete this folder from disk"})}</button>
            </div>
          </div>`).join("")}
    </div>
  `:"",G=(n.excludedChapters||[]).includes(t);return`
    <div class="chapter-group" data-chapter="${t}">
      <div class="${k}" data-num="${t}" style="${G?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${t}</span>
        <span class="chapter-title">
          ${S[0]?S[0].title!==`Chapter ${t}`?S[0].title:"":e[0].title}
          ${G?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
          ${R.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="A downloaded version of this chapter has only ${R[0].imageCount} pages">${R[0].imageCount} pages</span>`:""}
          ${I.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="${I.length} folder(s) on disk not linked to any downloaded version - open the versions list to delete">${I.length} leftover folder${I.length>1?"s":""}</span>`:""}
        </span>
        ${c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${G?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${t}" title="Restore Chapter">${p("undo-2",{title:"Restore chapter"})}</button>`:g?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${b.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${t}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${C?"locked":""}"
                        data-action="lock" data-num="${t}"
                        title="${C?"Unlock":"Lock"}">
                  ${C?p("lock",{title:"Locked"}):p("lock-open",{title:"Unlocked"})}
                </button>`}
          ${!G&&O?h.has((E=S[0])==null?void 0:E.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${t}" data-url="${O}" title="Unhide Chapter">${p("undo-2",{title:"Unhide chapter"})}</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${t}" data-url="${O}" title="Hide Chapter">${p("eye-off",{title:"Hide chapter"})}</button>`:""}
          <button class="btn-icon small ${o?"success":"muted"}"
                  data-action="read" data-num="${t}"
                  title="${o?"Mark unread":"Mark read"}">
            ${o?p("eye",{title:"Read"}):p("circle",{title:"Unread"})}
          </button>
          ${r?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${t}" data-url="${O}" title="Delete Files">${p("trash-2",{title:"Delete files"})}</button>
         <button class="btn-icon small ${b.offlineChapters.has(t)?"success":""}" data-action="offline-save" data-num="${t}" title="${b.offlineChapters.has(t)?"Remove offline copy":"Save for offline reading"}">
           ${b.offlineChapters.has(t)?p("wifi-off",{title:"Available offline"}):p("hard-drive",{title:"Save offline"})}
         </button>`:`<button class="btn-icon small ${r?"success":""}"
              data-action="download" data-num="${t}"
              title="${r?"Downloaded":"Download"}">
          ${r?p("check",{title:"Downloaded"}):p("download",{title:"Download"})}
        </button>`}
          ${N?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${t}" title="${u.length} versions, ${P} downloaded">
              ${P>1?`${P}/`:""}${u.length} ${p("chevron-down")}
            </button>
          `:""}
        </div>
      </div>
      ${Q}
    </div>
  `}function gr(t){if(!t)return"";const e=new Date(t);return isNaN(e.getTime())?String(t).slice(0,10):e.toISOString().slice(0,10)}function ot(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function xt(t){return ot(t).replace(/"/g,"&quot;")}function Bs(t){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${b.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${b.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${b.currentPage+1} of ${t}</span>
      <button class="btn btn-icon" data-page="next" ${b.currentPage>=t-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${b.currentPage>=t-1?"disabled":""}>»</button>
    </div>
  `}function fr(t,e){return e.length===0?`
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
  `}function vr(t,e){var o;const s=t.volumes||[];if(s.length===0)return"";const a=s.map(c=>{const l=c.chapters||[],h=l.filter(u=>e.has(u)).length;return`
      <div class="volume-card" data-volume-id="${c.id}">
        <div class="volume-cover">
          ${c.cover?`<img src="${c.cover}" alt="${c.name}">`:pe("book")}
          <div class="volume-badges">
            <span class="badge badge-chapters">${l.length} ch</span>
            ${h>0?`<span class="badge badge-downloaded">${h}</span>`:""}
          </div>
        </div>
        <div class="volume-info">
          <div class="volume-name">${c.name}</div>
        </div>
      </div>
    `}).join(""),n=b.volumesCollapsed,r=s.reduce((c,l)=>c+(l.chapters||[]).filter(h=>e.has(h)).length,0);return`
    <div class="volumes-section${n?" collapsed":""}">
      <div class="volumes-header">
        <button class="volumes-toggle" id="volumes-toggle-btn"
                aria-expanded="${!n}" aria-controls="volumes-grid"
                title="${n?"Expand volumes":"Collapse volumes"}">
          ${p(n?"chevron-down":"chevron-up")}
          <h2>Volumes</h2>
          <span class="volumes-count">${s.length}</span>
          ${n&&r>0?`<span class="badge badge-downloaded">${r} downloaded</span>`:""}
        </button>
        <button class="btn btn-secondary btn-small" id="add-volume-btn">${p("plus")} Add Volume</button>
      </div>
      <div class="volumes-grid" id="volumes-grid">
        ${a||(((o=t.chapters)==null?void 0:o.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function yr(){var n,r,o,c,l,h,u,g,v,C,S,f,I,$,A,D,R,N,O,k,x,P,Q,G,Z;const t=document.getElementById("app"),e=b.manga;if(!e)return;(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>q.go("/")),(r=document.getElementById("back-library-btn"))==null||r.addEventListener("click",()=>q.go("/")),t.querySelectorAll(".artist-link").forEach(w=>{w.addEventListener("click",async L=>{L.preventDefault();const M=w.dataset.artist;if(!M)return;localStorage.setItem("library_search",M),localStorage.removeItem("library_artist_filter");let E=null;try{const y=e.website;if(y&&y!=="Local"){const F=(window._scrapersList||(window._scrapersList=(await m.get("/scrapers/list")).scrapers)||[]).find(W=>W.name===y);F&&F.supportsBrowse&&(E=y)}}catch{}E?(localStorage.setItem("library_search_author",M),localStorage.setItem("library_search_author_source",E)):(localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source")),q.go("/")})}),(o=document.getElementById("continue-btn"))==null||o.addEventListener("click",()=>{pa(e.id)}),(c=document.getElementById("download-all-btn"))==null||c.addEventListener("click",()=>{const w=document.getElementById("download-all-modal");w&&w.classList.add("open")}),(l=document.getElementById("confirm-download-all-btn"))==null||l.addEventListener("click",async()=>{var w;try{d("Queueing downloads...","info");const L=document.getElementsByName("download-version-mode");let M="single";for(const y of L)y.checked&&(M=y.value);(w=document.getElementById("download-all-modal"))==null||w.classList.remove("open");const E=await m.post(`/bookmarks/${e.id}/download`,{all:!0,versionMode:M});E.chaptersCount>0?d(`Download queued: ${E.chaptersCount} versions`,"success"):d("Already have these chapters downloaded","info")}catch(L){d("Failed to download: "+L.message,"error")}}),(h=document.getElementById("check-updates-btn"))==null||h.addEventListener("click",async()=>{try{d("Checking for updates...","info"),await m.post(`/bookmarks/${e.id}/quick-check`),d("Check complete!","success")}catch(w){d("Check failed: "+w.message,"error")}}),(u=document.getElementById("schedule-btn"))==null||u.addEventListener("click",()=>{const w=document.getElementById("schedule-modal");w&&w.classList.add("open")}),(g=document.getElementById("schedule-type"))==null||g.addEventListener("change",w=>{const L=document.getElementById("schedule-day-group");L&&(L.style.display=w.target.value==="weekly"?"":"none")}),(v=document.getElementById("save-schedule-btn"))==null||v.addEventListener("click",async()=>{var w;try{const L=document.getElementById("schedule-type").value,M=document.getElementById("schedule-day").value,E=document.getElementById("schedule-time").value,y=document.getElementById("auto-download-toggle").checked;await m.updateAutoCheckSchedule(e.id,{enabled:!0,schedule:L,day:M,time:E,autoDownload:y}),b.manga.checkSchedule=L,b.manga.checkDay=M,b.manga.checkTime=E,b.manga.autoDownload=y,(w=document.getElementById("schedule-modal"))==null||w.classList.remove("open"),V([e.id]),d("Schedule updated","success")}catch(L){d("Failed to save schedule: "+L.message,"error")}}),(C=document.getElementById("disable-schedule-btn"))==null||C.addEventListener("click",async()=>{var w;try{await m.toggleAutoCheck(e.id,!1),b.manga.autoCheck=!1,b.manga.checkSchedule=null,b.manga.checkDay=null,b.manga.checkTime=null,b.manga.nextCheck=null,(w=document.getElementById("schedule-modal"))==null||w.classList.remove("open"),V([e.id]),d("Auto-check disabled","success")}catch(L){d("Failed to disable: "+L.message,"error")}}),(S=document.getElementById("refresh-btn"))==null||S.addEventListener("click",async()=>{const w=document.getElementById("refresh-btn");try{w.disabled=!0,w.innerHTML=`${p("loader",{spin:!0})} Checking...`,d("Checking for updates...","info"),await m.post(`/bookmarks/${e.id}/check`),await Y(e.id),V([e.id]),d("Check complete!","success")}catch(L){d("Check failed: "+L.message,"error"),w&&(w.disabled=!1,w.innerHTML=`${p("refresh-cw")} Refresh`)}}),(f=document.getElementById("scan-folder-btn"))==null||f.addEventListener("click",async()=>{var L,M;const w=document.getElementById("scan-folder-btn");try{w.disabled=!0,w.innerHTML=`${p("loader",{spin:!0})} Scanning...`,d("Scanning folder...","info");const E=await m.scanBookmark(e.id);await Y(e.id),V([e.id]);const y=((L=E.addedChapters)==null?void 0:L.length)||0,T=((M=E.removedChapters)==null?void 0:M.length)||0;y>0||T>0?d(`Scan complete: ${y} added, ${T} removed`,"success"):d("Scan complete: No changes","info")}catch(E){d("Scan failed: "+E.message,"error")}finally{w&&(w.disabled=!1,w.innerHTML=`${p("folder")} Scan Folder`)}}),document.querySelectorAll("[data-cbz-path]").forEach(w=>{w.addEventListener("click",async()=>{const L=decodeURIComponent(w.dataset.cbzPath),M=parseInt(w.dataset.cbzChapter)||1,E=w.dataset.cbzExtracted==="true",y=prompt("Enter chapter number for extraction:",String(M));if(!y)return;const T=parseFloat(y);if(isNaN(T)){d("Invalid chapter number","error");return}try{w.disabled=!0,w.textContent="Extracting...",d("Extracting CBZ...","info"),await m.extractCbz(e.id,L,T,{forceReExtract:E}),d("CBZ extracted successfully!","success"),await Y(e.id),V([e.id])}catch(F){d("Extract failed: "+F.message,"error")}finally{w.disabled=!1,w.textContent=E?"Re-Extract":"Extract"}})}),(I=document.getElementById("edit-btn"))==null||I.addEventListener("click",async()=>{const w=document.getElementById("edit-manga-modal");if(w){document.getElementById("edit-alias-input").value=e.alias||"",window._selectedCoverPath=null;try{const[L,M]=await Promise.all([m.getAllArtists(),m.getAllCategories()]),E=document.getElementById("artist-list"),y=document.getElementById("category-list");window._allArtists=L,window._allCategories=M,E&&(E.innerHTML=L.map(W=>`<option value="${W}">`).join("")),y&&(y.innerHTML=M.map(W=>`<option value="${W}">`).join(""));const T=document.getElementById("edit-artist-input"),F=document.getElementById("edit-categories-input");T==null||T.addEventListener("input",()=>{const W=T.value.toLowerCase(),U=T.value.lastIndexOf(","),se=T.value.substring(U+1).trim().toLowerCase();if(se.length>0&&window._allArtists){const j=window._allArtists.filter(K=>K.toLowerCase().includes(se));if(E&&j.length>0){const K=U>=0?T.value.substring(0,U+1)+" ":"";E.innerHTML=j.map(le=>`<option value="${K}${le}">`).join("")}}}),F==null||F.addEventListener("input",()=>{const W=F.value.lastIndexOf(","),U=F.value.substring(W+1).trim().toLowerCase();if(U.length>0&&window._allCategories){const se=window._allCategories.filter(j=>j.toLowerCase().includes(U));if(y&&se.length>0){const j=W>=0?F.value.substring(0,W+1)+" ":"";y.innerHTML=se.map(K=>`<option value="${j}${K}">`).join("")}}})}catch(L){console.error("Failed to load artists/categories:",L)}w.classList.add("open")}}),($=document.getElementById("save-manga-btn"))==null||$.addEventListener("click",async()=>{var w;try{const L=document.getElementById("edit-alias-input").value.trim(),M=document.getElementById("edit-artist-input").value.trim(),E=document.getElementById("edit-categories-input").value.trim(),y=M?M.split(",").map(F=>F.trim()).filter(F=>F):[],T=E?E.split(",").map(F=>F.trim()).filter(F=>F):[];await m.updateBookmark(e.id,{alias:L||null}),await m.setBookmarkArtists(e.id,y),await m.setBookmarkCategories(e.id,T),window._selectedCoverPath&&await m.setBookmarkCoverFromImage(e.id,window._selectedCoverPath),b.manga.alias=L||null,b.manga.artists=y,b.manga.categories=T,(w=document.getElementById("edit-manga-modal"))==null||w.classList.remove("open"),V([e.id]),d("Manga updated","success")}catch(L){d("Failed to update: "+L.message,"error")}}),(A=document.getElementById("change-cover-btn"))==null||A.addEventListener("click",async()=>{try{d("Loading images...","info");const w=await m.getFolderImages(e.id);if(w.length===0){d("No images found in manga folder","warning");return}const L=document.createElement("div");L.id="cover-select-modal",L.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",L.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${w.slice(0,50).map(M=>`
              <div class="cover-option" data-path="${M.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(M.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${w.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${w.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(L),document.getElementById("close-cover-modal").addEventListener("click",()=>L.remove()),L.addEventListener("click",M=>{M.target===L&&L.remove()}),L.querySelectorAll(".cover-option").forEach(M=>{M.addEventListener("click",()=>{window._selectedCoverPath=M.dataset.path;const E=document.getElementById("cover-preview");E&&(E.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),L.remove(),d("Cover selected","success")})})}catch(w){d("Failed to load images: "+w.message,"error")}}),(D=document.getElementById("delete-manga-btn"))==null||D.addEventListener("click",()=>{const w=document.getElementById("delete-manga-modal");w&&w.classList.add("open")}),(R=document.getElementById("confirm-delete-manga-btn"))==null||R.addEventListener("click",async()=>{var L,M;const w=((L=document.getElementById("delete-files-toggle"))==null?void 0:L.checked)||!1;try{await m.deleteBookmark(e.id,w),(M=document.getElementById("delete-manga-modal"))==null||M.classList.remove("open"),d("Manga deleted","success"),q.go("/")}catch(E){d("Failed to delete: "+E.message,"error")}}),(N=document.getElementById("quick-check-btn"))==null||N.addEventListener("click",async()=>{const w=document.getElementById("quick-check-btn");try{w.disabled=!0,w.innerHTML=`${p("loader",{spin:!0})} Checking...`,d("Quick checking for updates...","info");const L=await m.post(`/bookmarks/${e.id}/quick-check`);await Y(e.id),V([e.id]),L.newChaptersCount>0?d(`Found ${L.newChaptersCount} new chapter(s)!`,"success"):d("No new chapters found","info")}catch(L){d("Quick check failed: "+L.message,"error")}finally{w&&(w.disabled=!1,w.innerHTML=`${p("zap")} Quick Check`)}}),(O=document.getElementById("source-label"))==null||O.addEventListener("click",async()=>{const w=document.getElementById("migrate-source-modal");if(w){w.classList.add("open");const L=document.getElementById("migrate-search-scraper");if(L&&L.options.length<=1)try{const M=await m.get("/scrapers/list");if(M.success){const E=M.scrapers.filter(y=>y.supportsSearch);L.innerHTML='<option value="all">All Sources</option>'+E.map(y=>`<option value="${y.name}">${y.name}</option>`).join(""),L.value="all"}}catch(M){console.warn("Failed to load scrapers:",M)}}});const s=async()=>{var T,F,W;const w=(F=(T=document.getElementById("migrate-search-input"))==null?void 0:T.value)==null?void 0:F.trim(),L=(W=document.getElementById("migrate-search-scraper"))==null?void 0:W.value;if(!w)return;const M=document.getElementById("migrate-search-loading"),E=document.getElementById("migrate-search-results"),y=document.getElementById("migrate-results-grid");M.style.display="block",E.style.display="none";try{const se=(await m.get(`/scrapers/search?q=${encodeURIComponent(w)}&scraper=${encodeURIComponent(L)}`)).results||[];se.length===0?y.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(y.innerHTML=se.map(j=>{var le;const K=(le=j.cover)!=null&&le.startsWith("/covers/")?j.cover:j.cover?`/api/scrapers/proxy-cover?url=${encodeURIComponent(j.cover)}`:"";return`
            <div class="manga-card migrate-result-card" data-url="${j.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${K?xe(K,"Cover",{kind:"series",self:!0}):pe("series")}
                ${j.chapterCount?`<div class="manga-card-badges"><span class="badge badge-chapters">${j.chapterCount} ch</span></div>`:""}
              </div>
              <div class="manga-card-title" title="${j.title}" style="font-size: 0.8rem; padding: 4px;">${j.title}</div>
            </div>
          `}).join(""),y.querySelectorAll(".migrate-result-card").forEach(j=>{j.addEventListener("click",()=>{var le;const K=j.dataset.url;document.getElementById("migrate-url-input").value=K,y.querySelectorAll(".migrate-result-card").forEach(De=>De.style.outline=""),j.style.outline="2px solid var(--color-primary)",d(`Selected: ${(le=j.querySelector(".manga-card-title"))==null?void 0:le.textContent}`,"info")})})),M.style.display="none",E.style.display="block"}catch(U){M.style.display="none",d("Search failed: "+U.message,"error")}};(k=document.getElementById("migrate-search-btn"))==null||k.addEventListener("click",s),(x=document.getElementById("migrate-search-input"))==null||x.addEventListener("keydown",w=>{w.key==="Enter"&&s()}),(P=document.getElementById("confirm-migrate-btn"))==null||P.addEventListener("click",async()=>{var M,E,y;const w=(E=(M=document.getElementById("migrate-url-input"))==null?void 0:M.value)==null?void 0:E.trim();if(!w){d("Please enter a URL","warning");return}const L=document.getElementById("confirm-migrate-btn");try{L.disabled=!0,L.textContent="Migrating...",d("Migrating source...","info");const T=await m.migrateSource(e.id,w);d(`Migrated! ${T.migratedChapters} chapters preserved as local`,"success"),d("Running full check on new source...","info"),await m.post(`/bookmarks/${e.id}/check`),(y=document.getElementById("migrate-source-modal"))==null||y.classList.remove("open"),await Y(e.id),V([e.id]),d("Source migration complete!","success")}catch(T){d("Migration failed: "+T.message,"error")}finally{L&&(L.disabled=!1,L.textContent="Migrate Source")}}),(Q=document.getElementById("anilist-track-btn"))==null||Q.addEventListener("click",()=>{var w;(w=document.getElementById("anilist-modal"))==null||w.classList.add("open"),mt()});const a=async()=>{var y,T;const w=(T=(y=document.getElementById("anilist-search-input"))==null?void 0:y.value)==null?void 0:T.trim();if(!w)return;const L=document.getElementById("anilist-search-loading"),M=document.getElementById("anilist-search-results"),E=document.getElementById("anilist-results-list");L.style.display="block",M.style.display="none";try{const W=(await m.anilistSearch(w)).results||[];W.length===0?E.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(E.innerHTML=W.map(U=>{var K,le,De,ms,gs,fs,vs;const se=((K=U.title)==null?void 0:K.romaji)||((le=U.title)==null?void 0:le.english)||((De=U.title)==null?void 0:De.native)||"Unknown",j=(ms=U.title)!=null&&ms.english&&U.title.english!==se?U.title.english:(gs=U.title)!=null&&gs.native&&U.title.native!==se?U.title.native:"";return`
            <div style="display: flex; gap: 10px; align-items: center; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 8px;">
              ${(fs=U.coverImage)!=null&&fs.medium?`<img src="${U.coverImage.medium}" alt="" style="width: 48px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">`:""}
              <div style="flex: 1; min-width: 0;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${se}"><strong>${se}</strong></div>
                <div class="text-muted" style="font-size: 0.8em;">
                  ${[j,U.format,(vs=U.startDate)==null?void 0:vs.year,`${U.chapters??"?"} ch`].filter(Boolean).join(" • ")}
                </div>
              </div>
              <button class="btn btn-small btn-primary anilist-link-result-btn" data-id="${U.id}" data-title="${se.replace(/"/g,"&quot;")}">Link</button>
            </div>
          `}).join(""),E.querySelectorAll(".anilist-link-result-btn").forEach(U=>{U.addEventListener("click",async()=>{var se,j;try{U.disabled=!0,U.textContent="Linking...";const K=await m.anilistMap(e.id,Number(U.dataset.id)),le=((se=K.mapping)==null?void 0:se.anilist_title)||U.dataset.title,De=(j=K.pull)!=null&&j.markedUpTo?` — pulled progress up to ch. ${K.pull.markedUpTo}`:"";d(`Linked to AniList: ${le}${De}`,"success"),mt()}catch(K){U.disabled=!1,U.textContent="Link",d("Failed to link: "+K.message,"error")}})})),L.style.display="none",M.style.display="block"}catch(F){L.style.display="none",d("AniList search failed: "+F.message,"error")}};(G=document.getElementById("anilist-search-btn"))==null||G.addEventListener("click",a),(Z=document.getElementById("anilist-search-input"))==null||Z.addEventListener("keydown",w=>{w.key==="Enter"&&a()}),t.querySelectorAll(".filter-btn").forEach(w=>{w.addEventListener("click",()=>{b.filter=w.dataset.filter,b.currentPage=0,V([e.id])})}),t.querySelectorAll("[data-page]").forEach(w=>{w.addEventListener("click",()=>{const L=w.dataset.page,M=Math.ceil(b.manga.chapters.length/Ke);switch(L){case"first":b.currentPage=0;break;case"prev":b.currentPage=Math.max(0,b.currentPage-1);break;case"next":b.currentPage=Math.min(M-1,b.currentPage+1);break;case"last":b.currentPage=M-1;break}V([e.id])})}),t.querySelectorAll(".chapter-item").forEach(w=>{w.addEventListener("click",L=>{var y;if(L.target.closest(".chapter-actions"))return;const M=parseFloat(w.dataset.num);if((e.downloadedChapters||[]).includes(M)){const T=((y=e.downloadedVersions)==null?void 0:y[M])||[],F=Array.isArray(T)?T[0]:T;F?q.go(`/read/${e.id}/${M}?version=${encodeURIComponent(F)}`):q.go(`/read/${e.id}/${M}`)}else d("Chapter not downloaded","info")})}),t.querySelectorAll("[data-action]").forEach(w=>{w.addEventListener("click",async L=>{L.stopPropagation();const M=w.dataset.action,E=parseFloat(w.dataset.num),y=w.dataset.url?decodeURIComponent(w.dataset.url):null;switch(M){case"lock":await br(E);break;case"read":await wr(E);break;case"download":await kr(E);break;case"versions":$r(E);break;case"read-version":q.go(`/read/${e.id}/${E}?version=${encodeURIComponent(y)}`);break;case"download-version":await Sr(E,y);break;case"delete-version":await xr(E,y);break;case"keep-version":await Cr(E,y);break;case"delete-folder":await Er(E,decodeURIComponent(w.dataset.folder||""));break;case"hide-version":await Ir(E,y);break;case"restore-version":await Lr(E,y);break;case"restore-chapter":await Br(E);break;case"delete-chapter":await Ar(E,y);break;case"hide-chapter":await _r(E,y);break;case"unhide-chapter":await Mr(E,y);break}})}),t.querySelectorAll(".version-row .version-title").forEach(w=>{w.addEventListener("click",L=>{L.stopPropagation();const M=w.closest(".version-row"),E=parseFloat(M.dataset.num),y=M.dataset.versionUrl?decodeURIComponent(M.dataset.versionUrl):null;M.classList.contains("downloaded")&&y?q.go(`/read/${e.id}/${E}?version=${encodeURIComponent(y)}`):d("Version not downloaded yet","info")})}),t.querySelectorAll(".volume-card").forEach(w=>{w.addEventListener("click",()=>{const L=w.dataset.volumeId;q.go(`/manga/${e.id}/volume/${L}`)})}),qr(t),Ie(),ee.subscribeToManga(e.id)}async function br(t){var n;const e=b.manga,s=((n=e.chapterSettings)==null?void 0:n[t])||{},a=!s.locked;try{a?await m.lockChapter(e.id,t):await m.unlockChapter(e.id,t),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[t]={...s,locked:a},d(a?"Chapter locked":"Chapter unlocked","success"),V([e.id])}catch(r){d("Failed: "+r.message,"error")}}async function wr(t){const e=b.manga,s=new Set(e.readChapters||[]),a=s.has(t);try{await m.post(`/bookmarks/${e.id}/chapters/${t}/read`,{isRead:!a}),a?s.delete(t):s.add(t),e.readChapters=[...s],d(a?"Marked unread":"Marked read","success"),V([e.id])}catch(n){d("Failed: "+n.message,"error")}}async function kr(t){const e=b.manga,s=new Set(e.deletedChapterUrls||[]),a=(e.chapters||[]).find(n=>n.number===t&&!s.has(n.url));try{d(`Downloading chapter ${t}...`,"info");let n;a?n=await m.post(`/bookmarks/${e.id}/download-version`,{chapterNumber:t,url:a.url}):n=await m.post(`/bookmarks/${e.id}/download`,{chapters:[t]}),d("Download queued!","success"),ga(n==null?void 0:n.taskId,`Chapter ${t}`)}catch(n){d("Failed: "+n.message,"error")}}function $r(t){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${t}`&&s.classList.add("hidden")});const e=document.getElementById(`versions-${t}`);e&&e.classList.toggle("hidden")}async function Er(t,e){const s=b.manga;if(e&&confirm(`Delete the folder "${e}" from disk?`))try{await m.deleteChapterFolder(s.id,t,e),d("Folder deleted","success"),await Y(s.id),V([s.id])}catch(a){d("Failed: "+a.message,"error")}}function ga(t,e){var r;if(!t)return;const s=(r=b.manga)==null?void 0:r.id,a=Date.now(),n=async()=>{var u,g;if(Date.now()-a>30*60*1e3)return;let o;try{o=await m.getDownloadProgress(t)}catch{return}if(!o)return;if(!["complete","error","cancelled"].includes(o.status)){setTimeout(n,3e3);return}const l=o.errors||[],h=(o.completedChapters||[]).length>0&&o.status!=="error";o.status==="cancelled"?d(`${e}: download cancelled`,"info"):h?l.length?d(`${e} downloaded with problems: ${l[0].error}`,"warning"):d(`${e} downloaded${o.pages?` (${o.pages} pages)`:""}`,"success"):d(`${e} failed: ${((u=l[0])==null?void 0:u.error)||"unknown error"}`,"error"),((g=b.manga)==null?void 0:g.id)===s&&window.location.hash.startsWith(`#/manga/${s}`)&&(await Y(s),V([s]))};setTimeout(n,3e3)}async function Cr(t,e){var c;const s=b.manga,a=((c=s.downloadedVersions)==null?void 0:c[t])||[],r=(Array.isArray(a)?a:[a]).filter(l=>l&&l!==e);if(r.length===0){d("This is the only downloaded version","info");return}if(!confirm(`Delete the other ${r.length} downloaded version${r.length>1?"s":""} of chapter ${t}?`))return;let o=0;for(const l of r)try{await m.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:l})})}catch(h){o++,d("Failed to delete a version: "+h.message,"error")}o===0&&d("Other versions deleted","success"),await Y(s.id),V([s.id])}async function Sr(t,e){const s=b.manga;try{d("Downloading version...","info");const a=await m.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:t,url:e});d("Download queued!","success"),ga(a==null?void 0:a.taskId,`Chapter ${t}`)}catch(a){d("Failed: "+a.message,"error")}}async function xr(t,e){const s=b.manga;try{await m.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),d("Version deleted","success"),await Y(s.id),V([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function Ir(t,e){const s=b.manga;try{await m.hideVersion(s.id,t,e),d("Version hidden","success"),await Y(s.id),V([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function Lr(t,e){const s=b.manga;try{await m.unhideVersion(s.id,t,e),d("Version restored","success"),await Y(s.id),V([s.id])}catch(a){d("Failed to restore version: "+a.message,"error")}}async function Br(t){const e=b.manga;try{await m.unexcludeChapter(e.id,t),d("Chapter restored","success"),await Y(e.id),V([e.id])}catch(s){d("Failed to restore chapter: "+s.message,"error")}}async function Ar(t,e){const s=b.manga;if(confirm("Delete this chapter's files from disk?"))try{await m.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),d("Chapter files deleted","success"),await Y(s.id),V([s.id])}catch(a){d("Failed to delete: "+a.message,"error")}}async function _r(t,e){const s=b.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await m.hideVersion(s.id,t,e),d("Chapter hidden","success"),await Y(s.id),V([s.id])}catch(a){d("Failed to hide chapter: "+a.message,"error")}}async function Mr(t,e){const s=b.manga;try{await m.unhideVersion(s.id,t,e),d("Chapter unhidden","success"),await Y(s.id),V([s.id])}catch(a){d("Failed to unhide chapter: "+a.message,"error")}}async function Y(t){try{const[e,s]=await Promise.all([m.getBookmark(t),J.isDemo?Promise.resolve([]):ue.loadCategories()]);if(b.manga=e,b.categories=s,b.loading=!1,b.volumesCollapsed=ir(e),e.website==="Local")try{const r=await m.getCbzFiles(t);b.cbzFiles=r||[]}catch(r){console.error("Failed to load CBZ files:",r),b.cbzFiles=[]}else b.cbzFiles=[];const a=new Set((e.chapters||[]).map(r=>r.number)).size,n=Math.ceil(a/Ke);b.currentPage=Math.max(0,n-1),b.activeVolumeId?b.activeVolume=(e.volumes||[]).find(r=>r.id===b.activeVolumeId):b.activeVolume=null}catch{d("Failed to load manga","error"),b.loading=!1}}async function V(t=[]){const[e,s,a]=t;if(!e){q.go("/");return}b.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!b.manga||b.manga.id!==e?(b.loading=!0,b.manga=null,n.innerHTML=Ut(),await Y(e)):b.activeVolumeId?b.activeVolume=(b.manga.volumes||[]).find(r=>r.id===b.activeVolumeId):b.activeVolume=null,n.innerHTML=Ut(),yr(),mt()}function Tr(){b.manga&&ee.unsubscribeFromManga(b.manga.id),b.manga=null,b.loading=!0}const Pr={mount:V,unmount:Tr,render:Ut};function Rr(){return`
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
  `}function qr(t){const e=b.manga;if(!e)return;const s=t.querySelector("#volumes-toggle-btn");s&&s.addEventListener("click",()=>{b.volumesCollapsed=!b.volumesCollapsed,localStorage.setItem(ma(e.id),b.volumesCollapsed?"1":"0");const f=t.querySelector(".volumes-section");f==null||f.classList.toggle("collapsed",b.volumesCollapsed),s.setAttribute("aria-expanded",String(!b.volumesCollapsed)),s.title=b.volumesCollapsed?"Expand volumes":"Collapse volumes";const I=s.querySelector("svg");I&&(I.outerHTML=p(b.volumesCollapsed?"chevron-down":"chevron-up"))});const a=t.querySelector("#add-volume-btn"),n=t.querySelector("#add-volume-modal"),r=t.querySelector("#add-volume-submit-btn");a&&n&&a.addEventListener("click",()=>{n.classList.add("open"),t.querySelector("#add-volume-name-input").focus()}),n==null||n.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(f=>{f.addEventListener("click",()=>n.classList.remove("open"))}),r&&r.addEventListener("click",async()=>{const f=t.querySelector("#add-volume-name-input").value.trim();if(!f)return d("Please enter a volume name","error");try{r.disabled=!0,r.textContent="Creating...",await m.createVolume(e.id,f),d("Volume created successfully!","success"),n.classList.remove("open"),t.querySelector("#add-volume-name-input").value="",await Y(e.id),V([e.id])}catch(I){d("Failed to create volume: "+I.message,"error")}finally{r.disabled=!1,r.textContent="Create Volume"}});const o=t.querySelector("#manage-chapters-btn");o&&o.addEventListener("click",()=>{b.manageChapters=!b.manageChapters,V([e.id,"volume",b.activeVolumeId])}),t.querySelectorAll(".add-to-vol-btn").forEach(f=>{f.addEventListener("click",async()=>{const I=parseFloat(f.dataset.num),$=b.activeVolume;if($)try{f.disabled=!0,f.textContent="...";const A=$.chapters||[];if(A.includes(I))return;const D=[...A,I].sort((R,N)=>R-N);await m.updateVolumeChapters(e.id,$.id,D),d(`Chapter ${I} added to volume`,"success"),await Y(e.id),V([e.id,"volume",$.id])}catch(A){d("Failed to add chapter: "+A.message,"error"),f.disabled=!1,f.textContent="Add"}})}),t.querySelectorAll(".remove-from-vol-btn").forEach(f=>{f.addEventListener("click",async I=>{I.stopPropagation();const $=parseFloat(f.dataset.num),A=b.activeVolume;if(A)try{f.disabled=!0,f.textContent="...";const R=(A.chapters||[]).filter(N=>N!==$);await m.updateVolumeChapters(e.id,A.id,R),d(`Chapter ${$} removed from volume`,"success"),await Y(e.id),V([e.id,"volume",A.id])}catch(D){d("Failed to remove chapter: "+D.message,"error"),f.disabled=!1,f.textContent="×"}})});const c=t.querySelector("#edit-vol-btn"),l=t.querySelector("#edit-volume-modal");c&&l&&c.addEventListener("click",()=>{const f=c.dataset.volId,I=e.volumes.find($=>$.id===f);I&&(t.querySelector("#volume-name-input").value=I.name,l.dataset.editingVolId=f,l.classList.add("open"))});const h=t.querySelector("#save-volume-btn");h&&h.addEventListener("click",async()=>{const f=l.dataset.editingVolId,I=t.querySelector("#volume-name-input").value.trim();if(!I)return d("Volume name cannot be empty","error");try{await m.renameVolume(e.id,f,I),d("Volume renamed","success"),l.classList.remove("open"),await Y(e.id),V([e.id,"volume",f])}catch($){d($.message,"error")}});const u=t.querySelector("#delete-volume-btn");u&&u.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const f=l.dataset.editingVolId;try{await m.deleteVolume(e.id,f),d("Volume deleted","success"),l.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch(I){d(I.message,"error")}});const g=t.querySelector("#vol-cover-upload-btn");if(g){let f=document.getElementById("vol-cover-input-hidden");f||(f=document.createElement("input"),f.type="file",f.id="vol-cover-input-hidden",f.accept="image/*",f.style.display="none",document.body.appendChild(f),f.addEventListener("change",async I=>{const $=I.target.files[0];if(!$)return;const A=f.dataset.mangaId,D=f.dataset.volId,R=document.getElementById("vol-cover-upload-btn");if(f.value="",!(!A||!D))try{R&&(R.disabled=!0,R.textContent="Uploading..."),await m.uploadVolumeCover(A,D,$),d("Cover uploaded","success"),await Y(A),V([A,"volume",D])}catch(N){d("Upload failed: "+N.message,"error")}finally{R&&(R.disabled=!1,R.innerHTML=`${p("upload")} Upload Image`)}})),g.addEventListener("click",()=>{f.dataset.mangaId=e.id,f.dataset.volId=l.dataset.editingVolId||"",f.click()})}const v=t.querySelector("#vol-cover-selector-btn"),C=t.querySelector("#cover-selector-modal");v&&C&&v.addEventListener("click",async()=>{const f=C.querySelector("#cover-chapter-select");f.innerHTML='<option value="">Select a chapter...</option>';const I=t.querySelector("#edit-volume-modal"),$=I?I.dataset.editingVolId:null;let A=[...e.chapters||[]];if($){const R=e.volumes.find(N=>N.id===$);if(R&&R.chapters){const N=new Set(R.chapters);A=A.filter(O=>N.has(O.number))}}A.sort((R,N)=>R.number-N.number);const D=new Set;A.forEach(R=>{if(!D.has(R.number)){D.add(R.number);const N=document.createElement("option");N.value=R.number,N.textContent=`Chapter ${R.number}`,f.appendChild(N)}}),A.length>0&&(f.value=A[0].number,As(e.id,A[0].number)),C.classList.add("open")});const S=t.querySelector("#cover-chapter-select");S&&S.addEventListener("change",f=>{f.target.value&&As(e.id,f.target.value)}),t.querySelectorAll(".modal-close, .modal-close-btn").forEach(f=>{f.addEventListener("click",()=>{f.closest(".modal").classList.remove("open")})}),t.querySelectorAll(".modal-overlay").forEach(f=>{f.addEventListener("click",()=>{f.closest(".modal").classList.remove("open")})})}async function As(t,e){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await m.getChapterImages(t,e)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(r=>{const o=document.createElement("div");o.className="cover-grid-item",o.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",o.innerHTML=`<img src="${r}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,o.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=r.split("/").pop();Dr(l,e,c)}),s.appendChild(o)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function Dr(t,e,s){const a=b.manga,n=document.getElementById("edit-volume-modal"),r=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const o=n.dataset.editingVolId;if(!o)throw new Error("No volume selected");await m.setVolumeCoverFromChapter(a.id,o,e,t),d("Volume cover updated","success"),r.classList.remove("open"),n.classList.remove("open"),await Y(a.id),V([a.id,"volume",o])}else{await m.setMangaCoverFromChapter(a.id,e,t),d("Series cover updated","success"),r.classList.remove("open"),await Y(a.id);const o=window.location.hash.replace("#","");b.activeVolumeId?V([a.id,"volume",b.activeVolumeId]):V([a.id])}}catch(o){d("Failed to set cover: "+o.message,"error")}}let fe={series:null,loading:!0};function Ue(){if(fe.loading)return`
      ${ce("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=fe.series;if(!t)return`
      ${ce("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.entries||[],a=s.reduce((r,o)=>r+(o.chapter_count||0),0);let n=null;if(s.length>0){const r=s[0];r.local_cover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.local_cover.split(/[/\\]/).pop())}`:r.localCover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.localCover.split(/[/\\]/).pop())}`:r.cover&&(n=r.cover)}return`
    ${ce("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?xe(n,e,{kind:"series"}):pe("series")}
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
            ${s.map((r,o)=>Nr(r,o,s.length)).join("")}
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
  `}function Nr(t,e,s){var r;const a=t.alias||t.title;let n=null;return t.local_cover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.local_cover.split(/[/\\]/).pop())}`:t.localCover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(n=t.cover),`
    <div class="series-entry-card" data-id="${t.bookmark_id}" data-order="${t.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${e+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${t.bookmark_id}" ${e===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${t.bookmark_id}" ${e===s-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?xe(n,a,{kind:"book"}):pe("book")}
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${t.chapter_count||0} ch</span>
          ${((r=t.downloadedChapters)==null?void 0:r.length)>0?`<span class="badge badge-downloaded">${t.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${t.bookmark_id}" data-entryid="${t.id}" title="Use as series cover">${p("image",{title:"Use as series cover"})}</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${a}</div>
      </div>
    </div>
  `}function bt(){var l,h,u;const t=document.getElementById("app"),e=fe.series;(l=document.getElementById("back-btn"))==null||l.addEventListener("click",()=>q.go("/")),(h=document.getElementById("back-library-btn"))==null||h.addEventListener("click",()=>q.go("/")),t.querySelectorAll(".series-entry-card").forEach(g=>{g.addEventListener("click",v=>{if(v.target.closest("[data-action]"))return;const C=g.dataset.id;q.go(`/manga/${C}`)})}),t.querySelectorAll("[data-action]").forEach(g=>{g.addEventListener("click",async v=>{v.stopPropagation();const C=g.dataset.action,S=g.dataset.id;switch(C){case"move-up":await _s(S,-1);break;case"move-down":await _s(S,1);break;case"set-cover":const f=g.dataset.entryid;await Fr(f);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),r=document.getElementById("available-bookmarks-list"),o=document.getElementById("confirm-add-entry-btn");let c=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),r&&(r.innerHTML=""),a.classList.add("open");const g=await m.getAvailableBookmarksForSeries();c=g,g.length===0?(n&&(n.placeholder="No available manga found"),o.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),r&&(r.innerHTML=g.map(v=>`<option value="${(v.alias||v.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),o.disabled=!1)}catch{d("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),o.addEventListener("click",async()=>{const g=n?n.value:"",v=c.find(S=>(S.alias||S.title||"")===g);if(!v){d("Please select a valid manga from the list","warning");return}const C=v.id;try{o.disabled=!0,o.textContent="Adding...",await m.addSeriesEntry(e.id,C),d("Manga added to series","success"),a.classList.remove("open"),await wt(e.id),t.innerHTML=Ue(),bt()}catch(S){d("Failed to add manga: "+S.message,"error")}finally{o.disabled=!1,o.textContent="Add to Series"}})),(u=document.getElementById("edit-series-btn"))==null||u.addEventListener("click",()=>{d("Edit series coming soon","info")})}async function _s(t,e){const s=fe.series;if(!s)return;const a=s.entries||[],n=a.findIndex(c=>c.bookmark_id===t);if(n===-1)return;const r=n+e;if(r<0||r>=a.length)return;const o=a.map(c=>c.bookmark_id);[o[n],o[r]]=[o[r],o[n]];try{await m.post(`/series/${s.id}/reorder`,{order:o}),d("Order updated","success"),await wt(s.id);const c=document.getElementById("app");c.innerHTML=Ue(),bt()}catch(c){d("Failed to reorder: "+c.message,"error")}}async function Fr(t){const e=fe.series;if(e)try{await m.setSeriesCover(e.id,t),d("Series cover updated","success"),await wt(e.id);const s=document.getElementById("app");s.innerHTML=Ue(),bt()}catch(s){d("Failed to set cover: "+s.message,"error")}}async function wt(t){try{const e=await m.get(`/series/${t}`);fe.series=e,fe.loading=!1}catch{d("Failed to load series","error"),fe.loading=!1}}async function Or(t=[]){const[e]=t;if(!e){q.go("/");return}const s=document.getElementById("app");fe.loading=!0,fe.series=null,s.innerHTML=Ue(),await wt(e),s.innerHTML=Ue(),bt()}function Ur(){fe.series=null,fe.loading=!0}const Hr={mount:Or,unmount:Ur,render:Ue},Vr={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};function zr(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const jr={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
            ${ce()}
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
                            <button id="slideshow-start" class="btn btn-primary">${p("images")} Start Slideshow</button>
                        </div>
                    </div>
                </div>
            </div>
        `;let s={};try{const $=await m.get("/settings")||{};s=$;const A=document.getElementById("settings-form"),D=document.getElementById("settings-loader");$.theme&&(document.getElementById("theme").value=$.theme),D.style.display="none",A.style.display="",A.addEventListener("submit",async R=>{R.preventDefault();const N=new FormData(A),O={};for(const[k,x]of N.entries())O[k]=x;try{await m.post("/settings/bulk",O),d("Settings saved successfully"),O.theme}catch(k){console.error(k),d("Failed to save settings","error")}})}catch($){console.error($),document.getElementById("settings-loader").textContent="Error loading settings"}window.location.hash.includes("anilist=connected")&&d("AniList connected");const a=document.getElementById("anilist-group"),n=document.getElementById("anilist-status"),r=document.getElementById("anilist-connect"),o=document.getElementById("anilist-sync"),c=document.getElementById("anilist-disconnect"),l=document.getElementById("anilist-sync-result"),h=async()=>{a.style.display="block";try{const $=await m.anilistStatus();$.configured?$.connected?(n.textContent=`Connected as ${$.anilistUsername||"AniList user"}.`,r.style.display="none",o.style.display="",c.style.display=""):(n.textContent="Not connected. Link your AniList account to sync reading progress.",r.style.display="",o.style.display="none",c.style.display="none"):(n.textContent="Not configured — set ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET in .env and restart the server.",r.style.display="none",o.style.display="none",c.style.display="none")}catch($){console.error($),n.textContent="Failed to load AniList status — is the server running the latest code?"}};r.addEventListener("click",async()=>{try{const{url:$}=await m.anilistAuthUrl();window.location.href=$}catch($){d($.message||"Failed to start AniList connection","error")}}),c.addEventListener("click",async()=>{try{await m.anilistDisconnect(),d("AniList disconnected"),h()}catch{d("Failed to disconnect","error")}}),o.addEventListener("click",async()=>{o.disabled=!0,n.textContent="Syncing from AniList…";try{const $=await m.anilistPull();$.updated.length===0?l.textContent="Everything already up to date.":l.innerHTML="<ul>"+$.updated.map(A=>`<li>${A.title} — marked read up to chapter ${A.markedUpTo}</li>`).join("")+"</ul>",d(`AniList sync: ${$.updated.length} manga updated`)}catch($){l.textContent="",d($.message||"AniList sync failed","error")}finally{o.disabled=!1,h()}}),h();const u={...Vr,...s.slideshow||{}};u.disabledMangaIds=[...u.disabledMangaIds||[]];const g=document.getElementById("slideshow-interval"),v=document.getElementById("slideshow-shuffle"),C=document.getElementById("slideshow-lists"),S=document.getElementById("slideshow-trophies"),f=document.getElementById("slideshow-manga-list");g.value=String(u.intervalMs),g.value||(g.value="8000"),v.checked=!!u.shuffle,C.checked=!!u.includeLists,S.checked=!!u.includeTrophies;const I=async()=>{if(!J.isDemo)try{await m.post("/settings",{key:"slideshow",value:u})}catch($){console.error($),d("Failed to save slideshow settings","error")}};g.addEventListener("change",()=>{u.intervalMs=parseInt(g.value,10)||8e3,I()}),v.addEventListener("change",()=>{u.shuffle=v.checked,I()}),C.addEventListener("change",()=>{u.includeLists=C.checked,I()}),S.addEventListener("change",()=>{u.includeTrophies=S.checked,I()}),document.getElementById("slideshow-start").addEventListener("click",()=>{var $,A;(A=($=document.documentElement).requestFullscreen)==null||A.call($).catch(()=>{}),q.go("/slideshow")});try{const $=await m.getAllVolumes();if($.length===0)f.innerHTML=`<p class="settings-hint">No manga with volumes yet — create volumes from a manga's page first.</p>`;else{const A=new Set(u.disabledMangaIds);f.innerHTML=$.map(D=>{const R=zr(D.alias||D.title),N=D.volumes.filter(x=>x.cover).length,O=D.localCover?`/api/public/covers/${D.id}/${encodeURIComponent(D.localCover.split(/[/\\]/).pop())}`:D.cover,k=N===0;return`
                        <label class="slideshow-manga-row${k?" no-covers":""}" title="${k?"No volume covers yet":R}">
                            <input type="checkbox" data-manga-id="${D.id}" ${!A.has(D.id)&&!k?"checked":""} ${k?"disabled":""}>
                            <span class="slideshow-manga-thumb">${O?xe(O,R,{kind:"book"}):pe("book")}</span>
                            <span class="slideshow-manga-info">
                                <span class="slideshow-manga-name">${R}</span>
                                <span class="slideshow-manga-meta">${D.volumes.length} volume${D.volumes.length===1?"":"s"} · ${N} cover${N===1?"":"s"}</span>
                            </span>
                        </label>
                    `}).join(""),f.addEventListener("change",D=>{const R=D.target.closest("input[data-manga-id]");if(!R)return;const N=R.dataset.mangaId;R.checked?u.disabledMangaIds=u.disabledMangaIds.filter(O=>O!==N):u.disabledMangaIds.includes(N)||u.disabledMangaIds.push(N),I()})}}catch($){console.error($),f.innerHTML='<p class="settings-hint">Failed to load manga list.</p>'}}},Qr={mount:async t=>{const e=document.getElementById("app");if(!J.isAdmin){e.innerHTML=`
                ${ce()}
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
        `,document.querySelectorAll(".admin-tab").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(a=>a.classList.remove("active")),s.classList.add("active"),document.querySelectorAll(".admin-section").forEach(a=>a.style.display="none"),document.getElementById(`admin-section-${s.dataset.section}`).style.display=""})}),await Promise.all([lt(),Wr(),Gr()])}};async function lt(){const t=document.getElementById("admin-section-users");try{const e=await m.listUsers();t.innerHTML=`
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
                                <td>${Ht(s.username)}${s.id===((a=J.user)==null?void 0:a.id)?' <span class="badge">you</span>':""}</td>
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
        `,t.querySelectorAll("tr[data-user-id]").forEach(s=>{const a=Number(s.dataset.userId),n=async()=>{try{await m.updateUser(a,{role:s.querySelector(".user-role").value,canDownload:s.querySelector(".user-can-download").checked,canEdit:s.querySelector(".user-can-edit").checked}),d("User updated","success")}catch(r){d(r.message,"error"),lt()}};s.querySelector(".user-role").addEventListener("change",n),s.querySelector(".user-can-download").addEventListener("change",n),s.querySelector(".user-can-edit").addEventListener("change",n),s.querySelector(".user-reset-pw").addEventListener("click",async()=>{const r=prompt("New password for this user:");if(r)try{await m.updateUser(a,{password:r}),d("Password reset","success")}catch(o){d(o.message,"error")}}),s.querySelector(".user-delete").addEventListener("click",async()=>{if(confirm("Delete this user?"))try{await m.deleteUser(a),d("User deleted","success"),lt()}catch(r){d(r.message,"error")}})}),document.getElementById("add-user-form").addEventListener("submit",async s=>{s.preventDefault();try{await m.createUser({username:document.getElementById("new-username").value.trim(),password:document.getElementById("new-password").value,role:document.getElementById("new-role").value,canDownload:document.getElementById("new-can-download").checked,canEdit:document.getElementById("new-can-edit").checked}),d("User created","success"),lt()}catch(a){d(a.message,"error")}})}catch(e){console.error(e),t.innerHTML='<div class="error">Failed to load users</div>'}}async function Wr(){const t=document.getElementById("admin-section-demo");try{const e=await m.getBookmarks();t.innerHTML=`
            <h2>Demo Content</h2>
            <p class="admin-demo-warning">
                Checked series are visible to <strong>anyone</strong> on the public demo page
                (<code>/demo.html</code>) — no login needed, covers included. Only downloaded
                chapters are readable there. Be deliberate about adult titles.
            </p>
            <input type="search" id="demo-filter" placeholder="Filter series..." class="admin-demo-filter">
            <ul class="admin-demo-list">
                ${e.map(s=>`
                    <li data-title="${Ht((s.alias||s.title||"").toLowerCase())}">
                        <label>
                            <input type="checkbox" class="demo-toggle" data-id="${s.id}" ${s.isDemo?"checked":""}>
                            <span>${Ht(s.alias||s.title)}</span>
                            <span class="badge">${s.downloadedCount||0} downloaded</span>
                        </label>
                    </li>
                `).join("")}
            </ul>
        `,t.querySelectorAll(".demo-toggle").forEach(s=>{s.addEventListener("change",async()=>{try{await m.toggleDemo(s.dataset.id,s.checked),d(s.checked?"Added to demo":"Removed from demo","success")}catch(a){s.checked=!s.checked,d(a.message,"error")}})}),document.getElementById("demo-filter").addEventListener("input",s=>{const a=s.target.value.toLowerCase();t.querySelectorAll(".admin-demo-list li").forEach(n=>{n.style.display=n.dataset.title.includes(a)?"":"none"})})}catch(e){console.error(e),t.innerHTML='<div class="error">Failed to load bookmarks</div>'}}function Ht(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}async function Gr(){try{const t=await m.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
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
        `,e.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;Vt(n),e.querySelectorAll(".table-link").forEach(r=>r.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(t){console.error(t),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function Vt(t,e=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${t}...</div>`;try{const o=await m.get(`/admin/tables/${t}?page=${e}&limit=50`);if(!o.rows||o.rows.length===0){s.innerHTML=`
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
                                ${c.map(h=>{const u=l[h];let g=u;return u===null?g='<span class="null">NULL</span>':typeof u=="object"?g=JSON.stringify(u):String(u).length>100&&(g=String(u).substring(0,100)+"..."),`<td>${g}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>Vt(t,e-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>Vt(t,e+1))}catch(r){console.error(r),s.innerHTML=`<div class="error">Failed to load data for ${t}</div>`}}let ne={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function Kr(t,e){let s=null;if(e.length>0){const n=e[0];if(n.imagePaths&&n.imagePaths.length>0){const r=n.imagePaths[0];let o;typeof r=="string"?o=r:r&&typeof r=="object"&&(o=r.filename||r.path||r.name||r.url,o&&o.includes("/")&&(o=o.split("/").pop()),o&&o.includes("\\")&&(o=o.split("\\").pop())),o&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(o)}`)}}const a=e.reduce((n,r)=>{var o;return n+(((o=r.imagePaths)==null?void 0:o.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${t}">
      <div class="manga-card-cover">
        ${s?xe(s,t,{kind:"folder"}):pe("folder")}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function Yr(t){const e=ne.bookmarks.find(s=>s.id===t);return e?e.alias||e.title:t}function Jr(t){const e=ne.bookmarks.find(s=>s.id===t);if(e&&e.seriesId){const s=ne.series.find(a=>a.id===e.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function Xr(t,e,s,a=!1){return`
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
  `}function Zr(){const t={};console.log("Building trophy groups from:",ne.trophyPages);for(const e of Object.keys(ne.trophyPages)){const s=ne.trophyPages[e];let a=0;for(const[r,o]of Object.entries(s))a+=Object.keys(o).length;if(console.log(`Manga ${e}: ${a} trophies`),a===0)continue;const n=Jr(e);if(n)t[n.id]||(t[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),t[n.id].count+=a,t[n.id].mangaIds.push(e);else{const r=Yr(e);console.log(`No series for ${e}, using name: ${r}`),t[e]={name:r,isSeries:!1,count:a,mangaIds:[e]}}}return console.log("Trophy groups result:",t),t}function gt(){if(ne.loading)return`
      ${ce("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:t,listOrder:e}=ne.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${ne.activeTab==="galleries"?"active":""}" data-tab="galleries">
        ${p("folder")} Galleries
      </button>
      <button class="tab-btn ${ne.activeTab==="trophies"?"active":""}" data-tab="trophies">
        ${p("trophy")} Trophies
      </button>
    </div>
  `;let a="";if(ne.activeTab==="galleries")e.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${e.map(r=>{const o=t&&t[r]||[];return Kr(r,o)}).join("")}
        </div>
      `;else{const n=Zr(),r=Object.keys(n);r.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${r.map(c=>{const l=n[c];return Xr(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${ce("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function fa(){Ie();const t=document.getElementById("app");t.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{ne.activeTab=s.dataset.tab,t.innerHTML=gt(),fa()})}),t.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;q.go(`/read/gallery/${encodeURIComponent(a)}`)})}),t.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?q.go(`/read/trophies/series-${a}/🏆`):q.go(`/read/trophies/${a}/🏆`)})})}async function ei(){try{const[t,e,s,a]=await Promise.all([ue.loadFavorites(),m.get("/trophy-pages"),ue.loadBookmarks(),ue.loadSeries()]);ne.favorites=t||{favorites:{},listOrder:[]},ne.trophyPages=e||{},ne.bookmarks=s||[],ne.series=a||[],ne.loading=!1}catch(t){console.error("Failed to load favorites:",t),d("Failed to load favorites","error"),ne.loading=!1}}async function ti(){console.log("[Favorites] mount called"),ne.loading=!0;const t=document.getElementById("app");t.innerHTML=gt(),await ei(),console.log("[Favorites] Data loaded, rendering..."),t.innerHTML=gt(),console.log("[Favorites] Calling setupListeners..."),fa(),console.log("[Favorites] setupListeners complete")}function si(){}const ai={mount:ti,unmount:si,render:gt},ft="site-challenge-banner",va="site-cookie-modal",ls=new Set;function ie(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function cs(t,e){window.open(e||`https://${t}/`,"_blank","noopener")}function Ge(){const t=document.getElementById(va);t&&t.remove(),document.removeEventListener("keydown",ya)}function ya(t){t.key==="Escape"&&Ge()}function ni(t,e){var n;const s=((n=e.session)==null?void 0:n.cookieCount)??0,a=e.probe;return a&&a.ok?{kind:"ok",html:`<strong>${ie(t)} accepted the cookies.</strong> ${s} saved; update checks for this site resume.
                   Downloads that stopped on the check can be retried from the <a href="#/queue">Task Queue</a>.`}:a&&!a.ok&&a.error?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but the server could not load ${ie(t)} to test them.</strong>
                   ${ie(a.error)}. Retry a download to find out whether they work.`}:a&&!a.ok?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but ${ie(t)} still shows its check to the server.</strong>
                   Usually one of: the check was done on a different network than the server (the cookie can be tied to the
                   IP address), or in a different browser than the identity filled in above. Complete the check again from a
                   device on the server's network, export the cookies right away, make sure the identity is that browser's,
                   and paste again.${a.error?`<br><small>${ie(a.error)}</small>`:""}`}:{kind:"ok",html:`<strong>Saved ${s} cookie${s===1?"":"s"}.</strong> The site could not be tested right now; retry your download to find out.`}}function ds({site:t,url:e,stale:s=!1,onImported:a}={}){if(!t)return;if(!J.isAdmin){d("Only an admin can hand site cookies to the scraper","error");return}Ge();const n=navigator.userAgent||"",r=document.createElement("div");r.id=va,r.className="modal open site-cookie-modal",r.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Hand ${ie(t)}'s cookies to the scraper</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="site-cookie-body">
                <ol class="site-cookie-steps">
                    <li><button type="button" class="btn btn-sm btn-secondary" data-act="open">Open ${ie(t)}</button>
                        and complete its "verify you're human" check.
                        ${s?`If no puzzle appears, that browser is still trusted: export its cookies anyway (the site
                        may have renewed them), or clear the site's cookies in that browser to get the puzzle back.`:""}</li>
                    <li>Copy the cookies ${ie(t)} gave that browser, right after the check. Easiest: the
                        <strong>Cookie-Editor</strong> extension (Chrome, Edge, Firefox): open it on the ${ie(t)} tab,
                        choose <em>Export</em>, then <em>JSON</em> or <em>Header String</em>. A Netscape <code>cookies.txt</code>
                        export works too. (The browser console's <code>document.cookie</code> does not: it hides the cookie that matters.)</li>
                    <li>Paste them here and save. The server then loads ${ie(t)} once to see whether it is trusted.</li>
                </ol>
                <div class="form-group">
                    <label for="site-cookie-input">Cookies for ${ie(t)}</label>
                    <textarea id="site-cookie-input" rows="5" spellcheck="false" autocomplete="off" autocapitalize="off"
                        placeholder='[{"name": "...", "value": "..."}]   or   name=value; name2=value2'></textarea>
                </div>
                <div class="form-group site-cookie-ua">
                    <label for="site-cookie-ua">Identity (user agent) of the browser that completed the check</label>
                    <input type="text" id="site-cookie-ua" value="${ie(n)}" spellcheck="false" autocomplete="off">
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
    `,document.body.appendChild(r),document.addEventListener("keydown",ya);const o=r.querySelector("#site-cookie-input"),c=r.querySelector("#site-cookie-ua"),l=r.querySelector("#site-cookie-result"),h=r.querySelector('[data-act="save"]'),u=(v,C)=>{l.className=`site-cookie-result ${v}`,l.innerHTML=C,l.hidden=!1};r.querySelector(".modal-overlay").addEventListener("click",Ge),r.querySelectorAll('[data-act="close"]').forEach(v=>v.addEventListener("click",Ge)),r.querySelector('[data-act="open"]').addEventListener("click",()=>cs(t,e));let g=!1;h.addEventListener("click",async()=>{var C;if(g)return;const v=o.value.trim();if(!v){u("error","Paste the cookies first."),o.focus();return}g=!0,h.disabled=!0,h.textContent="Saving & testing…",l.hidden=!0;try{const S=await m.importSiteSession(t,v,c.value.trim()),{kind:f,html:I}=ni(t,S),$=S.ignored||{},A=[];$.foreign&&A.push(`${$.foreign} for other sites`),$.expired&&A.push(`${$.expired} already expired`),$.invalid&&A.push(`${$.invalid} unreadable`),u(f,I+(A.length?`<br><small>Skipped: ${A.join(", ")}.</small>`:"")),o.value="",typeof a=="function"&&a(S),(C=S.probe)!=null&&C.ok&&(d(`${t}: cookies accepted, checks resume`,"success"),setTimeout(Ge,2500))}catch(S){u("error",ie(S.message||"Import failed"))}finally{g=!1,h.disabled=!1,h.textContent="Save & test"}}),o.focus()}function ri(t){var n;let e=document.getElementById(ft);e||(e=document.createElement("div"),e.id=ft,e.className="site-challenge-banner",document.body.appendChild(e)),e.dataset.site=t.site;const s=J.isAdmin;let a=t.sessionStale?`<strong>${ie(t.site)}</strong> no longer accepts the cookies handed over earlier. Complete its verification check again and paste fresh ones.`:`<strong>${ie(t.site)}</strong> is asking for a human verification check. Automatic update checks for this site are paused and downloads stop at the first blocked chapter until someone completes it and hands over its cookies.`;s||(a+=" Ask an admin to do that."),e.innerHTML=`
        <div class="site-challenge-text">${a}</div>
        <div class="site-challenge-actions">
            <button class="btn btn-primary btn-sm" data-act="open">${s?"1. ":""}Open ${ie(t.site)}</button>
            ${s?'<button class="btn btn-primary btn-sm" data-act="import">2. Paste cookies</button>':""}
            <button class="btn btn-secondary btn-sm" data-act="retry" title="Resume without handing over cookies. Only works if the site stopped asking.">Retry anyway</button>
            <button class="site-challenge-close" data-act="close" title="Hide">×</button>
        </div>
    `,e.querySelector('[data-act="open"]').addEventListener("click",()=>cs(t.site,t.url)),(n=e.querySelector('[data-act="import"]'))==null||n.addEventListener("click",()=>{ds({site:t.site,url:t.url,stale:!!t.sessionStale})}),e.querySelector('[data-act="retry"]').addEventListener("click",async()=>{try{await m.clearSiteChallenge(t.site),d(`${t.site}: checks resumed. If the puzzle comes back, hand over its cookies instead.`,"info")}catch(r){d("Failed: "+r.message,"error")}zt()}),e.querySelector('[data-act="close"]').addEventListener("click",()=>{ls.add(t.site),zt()}),e.classList.add("show")}function zt(){const t=document.getElementById(ft);t&&t.remove()}function Ms(t){!t||ls.has(t.site)||ri(t)}async function _i(){ee.on("site:challenge",t=>{ls.delete(t.site),Ms(t)}),ee.on("site:challenge-cleared",({site:t})=>{const e=document.getElementById(ft);e&&e.dataset.site===t&&zt()});try{const e=((await m.getSiteStatus()).challenges||[])[0];e&&Ms(e)}catch{}}let z={downloads:{},queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,showEmptyChecks:!1,collapsed:{active:!1,scheduled:!1,completed:!1,history:!0}},ct=null,he={};function us(t){if(!t)return"Never";const e=Date.now()-new Date(t).getTime(),s=Math.floor(e/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function ii(t){if(!t)return"Not scheduled";const e=new Date(t).getTime()-Date.now();if(e<=0)return"Running now...";const s=Math.floor(e/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const r=Math.floor(a/24),o=a%24;return`in ${r}d ${o}h`}function ba(t){switch(t){case"download":return p("download");case"scrape":return p("search");case"scan":return p("folder");default:return p("settings")}}function hs(t){switch(t){case"running":return"var(--color-success)";case"queued":case"pending":return"var(--color-warning)";case"paused":return"var(--color-info)";case"complete":return"var(--color-success)";case"error":case"failed":case"cancelled":return"var(--color-error)";default:return"var(--text-secondary)"}}function ps(t){switch(t){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return t}}function oi(t){return!t||t==="default"?"Default (6h)":t==="daily"?"Daily":t==="weekly"?"Weekly":t}function li(){const t=z.autoCheck;return t?`
    <div class="queue-inline-header">
      <span class="text-muted">${t.enabledCount} monitored · Last: ${us(t.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">${p("play")} Run All Now</button>
    </div>
  `:""}function ci(t){const e=t.nextCheck?ii(t.nextCheck):"Not set",s=t.nextCheck&&new Date(t.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${t.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${p("book-open")}</span>
          <div>
            <div class="task-title">${t.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${oi(t.schedule)}${t.schedule==="weekly"&&t.day?` · ${t.day.charAt(0).toUpperCase()+t.day.slice(1)}`:""}${(t.schedule==="daily"||t.schedule==="weekly")&&t.time?` · ${t.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?`${p("alarm-clock")} Due now`:e}</span>
        </div>
      </div>
    </div>
  `}function It(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ts(t,e){const s=e.total>0?Math.round(e.completed/e.total*100):0,a=e.status==="running"||e.status==="queued",n=e.status==="paused",r=e.errors&&e.errors.length>0,o=!a&&!n&&r&&(e.chapterUrls||[]).length>0;return`
    <div class="queue-card task-card" data-task-id="${t}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${p("download")}</span>
          <div>
            <div class="task-title">${e.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${hs(e.status)}">${ps(e.status)}</div>
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
        ${e.errors&&e.errors.length>0?`
          <div class="task-errors">${p("triangle-alert")} ${e.errors.length} error(s)</div>
          <ul class="task-error-list">${e.errors.slice(0,5).map(c=>`<li>${typeof c.chapter=="number"?`Ch. ${c.chapter}: `:""}${It(c.error)}</li>`).join("")}</ul>`:""}
        ${e.challenge?(()=>{const c=It(e.challenge.site),l=It(e.challenge.url||`https://${e.challenge.site}/`),h=J.isAdmin;return`
          <div class="task-challenge">
            <span>${e.challenge.sessionStale?`${c} no longer accepts the cookies handed over earlier. Complete its check again, paste fresh cookies, then retry.`:`${c} wants a human verification check. Complete it in your browser, hand over its cookies, then retry here.`}${h?"":" (An admin has to hand the cookies over.)"}</span>
            <button class="btn btn-sm btn-primary" data-action="open-site" data-site="${c}" data-url="${l}">${h?"1. ":""}Open ${c}</button>
            ${h?`<button class="btn btn-sm btn-primary" data-action="import-cookies" data-site="${c}" data-url="${l}" data-stale="${e.challenge.sessionStale?"1":""}">2. Paste cookies</button>`:""}
            <button class="btn btn-sm btn-secondary" data-action="retry" data-task="${t}">${h?"3. ":""}Retry download</button>
          </div>`})():o?`
          <div class="task-challenge">
            <button class="btn btn-sm btn-secondary" data-action="retry" data-task="${t}">Retry failed chapters</button>
          </div>`:""}
      </div>
    </div>
  `}function di(t){const e=t.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${ba(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${hs(t.status)}">${ps(t.status)}</div>
          </div>
        </div>
      </div>
      ${t.started_at?`<div class="queue-card-body"><small>Started: ${us(t.started_at)}</small></div>`:""}
    </div>
  `}function ui(t){const e=t.data||{},s=t.result||{};let a="";if(t.type==="scrape")s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${t.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>');else if(t.type==="scan"||t.type==="scan-local")s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`);else if(t.type==="download"){if(t.status==="failed"&&t.error)a=`<div class="task-subtext" style="color: var(--color-error, #e05555);">${t.error}</div>`;else if(s.downloaded!==void 0){const n=[`${s.downloaded} chapter${s.downloaded===1?"":"s"} downloaded`];s.pages&&n.push(`${s.pages} pages`),s.failed&&n.push(`${s.failed} failed`);const r=(s.errors||[]).filter(o=>o.partial);r.length&&n.push(`${r.length} with missing pages`),a=`<div class="task-subtext" style="color: var(--text-secondary);">${n.join(" · ")}</div>`}}return`
    <div class="queue-card task-card history-card" data-history-id="${t.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${ba(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${hs(t.status)}">${ps(t.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${t.completed_at?`<div class="queue-card-body"><small>Completed: ${us(t.completed_at)}</small></div>`:""}
    </div>
  `}function hi(){var c;const t=Object.entries(z.downloads),e=t.filter(([,l])=>l.status!=="complete"),s=t.filter(([,l])=>l.status==="complete"),a=new Set(e.map(([,l])=>l.bookmarkId).filter(Boolean)),n=z.queueTasks.filter(l=>{var h;return!(l.type==="download"&&((h=l.data)!=null&&h.mangaId)&&a.has(l.data.mangaId))}),r=e.length+n.length,o=((c=z.autoCheck)==null?void 0:c.schedules)||[];return`
    ${ce("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>${p("list-checks")} Task Queue</h2>
        ${r>0?`<span class="queue-badge">${r} active</span>`:""}
      </div>

      ${e.length>0||n.length>0?`
        <div class="queue-section ${z.collapsed.active?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${e.map(([l,h])=>Ts(l,h)).join("")}
            ${n.map(l=>di(l)).join("")}
          </div>
        </div>
      `:""}

      ${o.length>0?`
        <div class="queue-section ${z.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${o.length})
            </h3>
            ${li()}
          </div>
          <div class="queue-section-content">
            ${o.map(l=>ci(l)).join("")}
          </div>
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section ${z.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${s.map(([l,h])=>Ts(l,h)).join("")}
          </div>
        </div>
      `:""}

      ${z.historyTasks&&z.historyTasks.length>0?(()=>{const l=g=>{if(g.type!=="scrape")return!1;const v=g.result||{};return(g.status==="complete"||g.status==="completed")&&(v.newChaptersCount===0||v.updated===!1)},h=z.historyTasks.filter(l).length,u=z.showEmptyChecks?z.historyTasks:z.historyTasks.filter(g=>!l(g));return`
        <div class="queue-section ${z.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${h>0?`
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${z.showEmptyChecks?"Hide":"Show"} checks with no new chapters">
                    ${z.showEmptyChecks?`${p("chevron-up")} Hide`:`${p("chevron-down")} Show`} empty checks (${h})
                  </button>
                `:""}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  ${p("trash-2")} Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${u.length>0?u.map(g=>ui(g)).join(""):`
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${h>0?`${h} empty check(s) hidden.`:""}</p>
                  </div>
                `}
            </div>
        </div>
      `})():""}

      ${e.length===0&&n.length===0&&s.length===0&&o.length===0&&(!z.historyTasks||z.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">${p("check")}</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function Me(){try{const[t,e,s,a]=await Promise.all([m.getDownloads().catch(()=>({})),m.getQueueTasks().catch(()=>[]),m.getQueueHistory(50).catch(()=>[]),m.getAutoCheckStatus().catch(()=>null)]);z.downloads=t||{},z.queueTasks=e||[],z.historyTasks=s||[],z.autoCheck=a,z.loading=!1}catch(t){console.error("[Queue] Failed to load data:",t),z.loading=!1}}function $e(){const t=document.getElementById("app");t&&(t.innerHTML=hi(),pi())}function pi(){Ie(),document.querySelectorAll("[data-toggle]").forEach(a=>{a.addEventListener("click",n=>{const r=a.dataset.toggle;z.collapsed[r]=!z.collapsed[r],$e()})});const t=document.getElementById("run-autocheck-btn");t&&t.addEventListener("click",async()=>{t.disabled=!0,t.innerHTML=`${p("loader",{spin:!0})} Running...`;try{d("Auto-check started...","info");const a=await m.runAutoCheck();d(`Check complete: ${a.checked} checked, ${a.updated} updated`,"success"),await Me(),$e()}catch(a){d("Auto-check failed: "+a.message,"error"),t.disabled=!1,t.innerHTML=`${p("play")} Run Now`}});const e=document.getElementById("clear-history-btn");e&&e.addEventListener("click",async a=>{if(a.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await m.clearQueueHistory(),d("History cleared","success"),await Me(),$e()}catch(n){d(`Failed to clear history: ${n.message}`,"error")}});const s=document.getElementById("toggle-empty-checks-btn");s&&s.addEventListener("click",a=>{a.stopPropagation(),z.showEmptyChecks=!z.showEmptyChecks,$e()}),document.querySelectorAll(".scheduled-manga-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.mangaId;n&&(window.location.hash=`#/manga/${n}`)})}),document.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const r=a.dataset.action,o=a.dataset.task;if(r==="open-site"){cs(a.dataset.site,a.dataset.url);return}if(r==="import-cookies"){ds({site:a.dataset.site,url:a.dataset.url,stale:a.dataset.stale==="1"});return}try{if(r==="pause")await m.pauseDownload(o),d("Download paused","info");else if(r==="resume")await m.resumeDownload(o),d("Download resumed","info");else if(r==="cancel")confirm("Cancel this download?")&&(await m.cancelDownload(o),d("Download cancelled","info"));else if(r==="retry"){const c=await m.retryDownload(o);d(`Retrying ${c.chapters.length} chapter${c.chapters.length===1?"":"s"}`,"info")}await Me(),$e()}catch(c){d(`Action failed: ${c.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.historyId,r=document.getElementById(`task-details-${n}`);r&&r.classList.toggle("hidden")})})}async function mi(){z.loading=!0;const t=document.getElementById("app");t.innerHTML=`
    ${ce("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>${p("list-checks")} Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,Ie(),await Me(),$e(),ct=setInterval(async()=>{await Me(),$e()},5e3),he.downloadProgress=e=>{e.taskId&&z.downloads[e.taskId]&&(Object.assign(z.downloads[e.taskId],e),$e())},he.downloadCompleted=e=>{Me().then($e)},he.queueUpdated=e=>{Me().then($e)},ee.on(oe.DOWNLOAD_PROGRESS,he.downloadProgress),ee.on(oe.DOWNLOAD_COMPLETED,he.downloadCompleted),ee.on(oe.QUEUE_UPDATED,he.queueUpdated)}function gi(){ct&&(clearInterval(ct),ct=null),he.downloadProgress&&ee.off(oe.DOWNLOAD_PROGRESS,he.downloadProgress),he.downloadCompleted&&ee.off(oe.DOWNLOAD_COMPLETED,he.downloadCompleted),he.queueUpdated&&ee.off(oe.QUEUE_UPDATED,he.queueUpdated),he={}}const fi={mount:mi,unmount:gi};function we(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function vi(t){if(!t)return"";const e=Math.floor((Date.now()-new Date(t).getTime())/6e4);if(e<1)return"just now";if(e<60)return`${e}m ago`;const s=Math.floor(e/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}class yi{constructor(){this.container=null,this.scrapers=[],this.siteStatus={challenges:[],sessions:[]},this.onSiteStatusChange=null,this.currentQuery="",this.currentTarget="all",this.isSearching=!1,this.results=[],this.viewMode="main",this.browseScraper=null,this.browseQuery="",this.browseSort="popular",this.browsePage=1,this.browseTotalPages=1,this.isBrowsing=!1,this.browseResults=[],this.previewInfo=null,this.previewImages=[],this.previewIndex=0,this.infoAbortController=null}async mount(e){this.container=document.getElementById("app"),document.body.className="scrapers-mode";const s=new URLSearchParams(window.location.hash.split("?")[1]||""),a=s.get("browse"),n=s.get("q");a&&(this.browseScraper=a,this.viewMode="browse",this.browseQuery=n||"",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1),this.updateView(),this.onSiteStatusChange=()=>this.loadSiteStatus(),ee.on(oe.SITE_SESSION,this.onSiteStatusChange),ee.on(oe.SITE_CHALLENGE,this.onSiteStatusChange),ee.on(oe.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),await this.loadScrapers(),this.viewMode==="browse"&&this.browseScraper?(a&&(this.startBrowse(a,{query:n||null}),this.updateView()),this.performBrowse()):n&&(this.currentQuery=n,this.updateView(),this.performSearch())}unmount(){this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.onSiteStatusChange&&(ee.off(oe.SITE_SESSION,this.onSiteStatusChange),ee.off(oe.SITE_CHALLENGE,this.onSiteStatusChange),ee.off(oe.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),this.onSiteStatusChange=null),this.container.innerHTML="",document.body.className=""}async loadScrapers(){try{const[e,s]=await Promise.all([m.get("/scrapers/list"),m.getSiteStatus().catch(()=>({challenges:[],sessions:[]}))]);this.siteStatus=s||{challenges:[],sessions:[]},e.success&&(this.scrapers=e.scrapers,this.updateView())}catch(e){console.error("Failed to load scrapers",e)}}async loadSiteStatus(){try{this.siteStatus=await m.getSiteStatus()}catch{return}document.getElementById("scraper-cards-list")&&(this.renderScraperList(),this.bindCardEvents())}sessionFor(e){return(this.siteStatus.sessions||[]).find(s=>s.site===e)||null}browseConfig(e=this.browseScraper){const s=this.scrapers.find(n=>n.name===e),a=s&&s.browseOptions;return{sorts:a&&a.sorts&&a.sorts.length?a.sorts:[{value:"popular",label:"Popular"}],defaultSort:a&&a.defaultSort||"popular",defaultQuery:a&&a.defaultQuery||"",queryLabel:a&&a.queryLabel||"Search",queryPlaceholder:a&&a.queryPlaceholder||"Optional: title to search for"}}startBrowse(e,{query:s=null,sort:a=null}={}){const n=this.browseConfig(e);this.browseScraper=e,this.viewMode="browse",this.browseQuery=s??n.defaultQuery,this.browseSort=a&&n.sorts.some(r=>r.value===a)?a:n.defaultSort,this.browsePage=1,this.browseResults=[],this.browseTotalPages=1}challengeFor(e){return(this.siteStatus.challenges||[]).find(s=>s.site===e)||null}renderSessionRow(e){if(!e.supportsSession)return"";const s=this.sessionFor(e.name),a=this.challengeFor(e.name);let n;if(s&&s.stale)n=`<span class="capability-pill capability-soon" title="${we(s.staleReason||"The site showed its check again")}">${p("triangle-alert")} Rejected, paste fresh</span>`;else if(s&&s.cookieCount===0)n=`<span class="capability-pill capability-soon" title="Every saved cookie has expired">${p("triangle-alert")} Expired, paste fresh</span>`;else if(s){const r=vi(s.updatedAt||s.importedAt),o=J.isAdmin?`${(s.cookieNames||[]).join(", ")}${s.userAgent?`
${s.userAgent}`:""}`:"";n=`<span class="capability-pill capability-yes" title="${we(o)}">✓ ${s.cookieCount} cookie${s.cookieCount===1?"":"s"}${r?` · ${r}`:""}</span>`}else a?n=`<span class="capability-pill capability-soon">${p("triangle-alert")} Check pending</span>`:n='<span class="capability-pill capability-no">None</span>';return`
      <div class="capability-row">
        <span class="capability-label" title="Cookies from a browser that completed the site's human check">${p("lock-open")} Session</span>
        <span class="scraper-session-cell">
          ${n}
          ${s&&J.isAdmin?`<button type="button" class="scraper-session-forget" data-scraper="${we(e.name)}" title="Forget these cookies">Forget</button>`:""}
        </span>
      </div>`}bindCardEvents(){document.querySelectorAll(".scraper-search-card-btn").forEach(e=>{e.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper;this.currentTarget=a;const n=document.getElementById("scraper-query");n&&(this.currentQuery=n.value.trim()),this.updateView();const r=document.getElementById("scraper-query");r&&(r.focus(),window.scrollTo({top:0,behavior:"smooth"}),this.currentQuery&&this.performSearch())})}),document.querySelectorAll(".scraper-browse-card-btn").forEach(e=>{e.addEventListener("click",s=>{this.startBrowse(s.currentTarget.dataset.scraper),this.updateView(),this.performBrowse()})}),document.querySelectorAll(".scraper-session-card-btn").forEach(e=>{e.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper,n=this.challengeFor(a),r=this.sessionFor(a),o=!!r&&(r.stale||r.cookieCount===0);ds({site:a,url:n==null?void 0:n.url,stale:o,onImported:()=>this.loadSiteStatus()})})}),document.querySelectorAll(".scraper-session-forget").forEach(e=>{e.addEventListener("click",async s=>{const a=s.currentTarget.dataset.scraper;if(confirm(`Forget the saved ${a} cookies? The scraper goes back to its own identity.`))try{(await m.forgetSiteSession(a)).purged===null?d(`${a}: cookies forgotten, but they may stay in the scraper browser until it restarts`,"warning"):d(`${a}: saved cookies forgotten`,"info"),await this.loadSiteStatus()}catch(n){d(`Failed: ${n.message}`,"error")}})})}updateView(){this.render(),this.renderScraperList(),(this.results.length>0||this.isSearching)&&this.renderResults(),this.bindEvents()}render(){this.container.innerHTML=`
      ${ce()}
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
            <label>${we(this.browseConfig().queryLabel)}</label>
            <input type="text" id="browse-query" class="browse-input" value="${we(this.browseQuery)}" placeholder="${we(this.browseConfig().queryPlaceholder)}">
          </div>
          <div class="browse-form-group" style="min-width: 150px;">
            <label>Sort By</label>
            <select id="browse-sort" class="browse-select">
              ${this.browseConfig().sorts.map(e=>`<option value="${we(e.value)}" ${this.browseSort===e.value?"selected":""}>${we(e.label)}</option>`).join("")}
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
    `,Ie()}renderScraperList(){const e=document.getElementById("scraper-cards-list");if(!e)return;if(this.scrapers.length===0){e.innerHTML=`
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
            ${this.renderSessionRow(n)}
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
            ${n.supportsSession&&J.isAdmin?`
            <button
              class="btn btn-secondary scraper-session-card-btn"
              data-scraper="${we(n.name)}"
              title="Hand over cookies from a browser that completed ${we(n.name)}'s human check"
            >${p("lock-open")} Cookies</button>`:""}
          </div>

        </div>
      `);e.innerHTML=a.join("")}getDomainIcon(e){const s=e.toLowerCase();return s.includes("comix")?p("library"):s.includes("mangahere")?p("book-open"):s.includes("nhentai")?p("shield-alert"):s.includes("chained")?p("link"):p("globe")}bindEvents(){const e=document.getElementById("scraper-search-form");e&&e.addEventListener("submit",v=>{v.preventDefault();const C=document.getElementById("scraper-query");C&&C.value.trim()&&(this.currentQuery=C.value.trim(),this.performSearch())});const s=document.getElementById("clear-target-btn");s&&s.addEventListener("click",()=>{this.currentTarget="all",this.updateView();const v=document.getElementById("scraper-query");v&&v.focus()}),this.bindCardEvents();const a=document.getElementById("exit-browse-btn");a&&a.addEventListener("click",()=>{this.viewMode="main",this.updateView()});const n=document.getElementById("browse-apply-btn");n&&n.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse()});const r=document.getElementById("browse-refresh-btn");r&&r.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse(!1,!0)});const o=document.getElementById("browse-query");o&&o.addEventListener("keypress",v=>{v.key==="Enter"&&n.click()});const c=document.getElementById("browse-load-more-btn");c&&c.addEventListener("click",()=>{!this.isBrowsing&&this.browsePage<this.browseTotalPages&&(this.browsePage++,this.performBrowse(!0))});const l=document.getElementById("preview-close-btn");l&&l.addEventListener("click",()=>{this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),document.getElementById("preview-info-modal").style.display="none"});const h=document.getElementById("preview-add-btn");h&&h.addEventListener("click",()=>{this.previewInfo&&this.previewInfo.url&&this.openAddModal(this.previewInfo.url,h)});const u=document.getElementById("preview-read-btn");u&&u.addEventListener("click",()=>{u.disabled||(this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.openTempReader())});const g=document.getElementById("temp-reader-close");g&&g.addEventListener("click",()=>{document.getElementById("temp-reader-overlay").style.display="none"})}async performSearch(){const e=document.getElementById("scraper-results-container"),s=document.getElementById("scraper-search-btn");if(!e||!s)return;this.isSearching=!0,e.style.display="block",s.textContent="Searching...",s.disabled=!0;const a=this.currentTarget==="all"?"all sites":this.currentTarget;e.innerHTML=`
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
      `;return}let s='<div class="library-grid" style="margin-top: 2rem;">';this.results.forEach(a=>{const n=a.cover||"";let r="";n.startsWith("/covers/")?r=n:n&&(r=`/api/scrapers/proxy-cover?url=${encodeURIComponent(n)}`);const o=r?xe(r,"Cover",{kind:"series",self:!0}):pe("series");s+=`
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
      `}),s+="</div>",e.innerHTML=s,setTimeout(()=>{document.querySelectorAll(".scraper-result-card").forEach(a=>{a.addEventListener("click",n=>{n.target.closest(".add-from-search-btn")||window.open(a.dataset.url,"_blank")})}),document.querySelectorAll(".add-from-search-btn").forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation();const r=n.target.dataset.url;this.openAddModal(r,n.target)})})},100)}async _addToLibraryAndWait(e){const s=await m.addBookmark(e);if(!s.jobId)throw new Error("No job ID returned");return new Promise((a,n)=>{const r=setInterval(async()=>{try{const c=(await m.getQueueHistory(20)).find(l=>l.id===s.jobId);c&&(c.status==="completed"?(clearInterval(r),c.result&&c.result.bookmark?a(c.result.bookmark):n(new Error("Job completed but returned no bookmark"))):c.status==="failed"&&(clearInterval(r),n(new Error(c.error))))}catch{}},1e3)})}async openAddModal(e,s){const a=s?s.textContent:"+ Add to Library";s&&(s.textContent="Adding...");try{const n=await this._addToLibraryAndWait(e);document.getElementById("preview-info-modal").style.display="none",window.location.hash=`#/manga/${n.id}`}catch(n){alert("Error adding manga: "+n.message)}finally{s&&(s.textContent=a)}}async performBrowse(e=!1,s=!1){const a=document.getElementById("browse-results-container"),n=document.getElementById("browse-load-more-btn"),r=document.getElementById("browse-loading-indicator"),o=document.getElementById("browse-pagination");if(a){this.isBrowsing=!0,e?(n.style.display="none",r.style.display="block",document.getElementById("browse-loading-page").textContent=this.browsePage):(a.innerHTML=`
        <div class="loading-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="spinner"></div>
          <p>Browsing ${this.browseScraper}...</p>
        </div>
      `,o.style.display="none");try{let c=`/scrapers/browse?scraper=${encodeURIComponent(this.browseScraper)}&q=${encodeURIComponent(this.browseQuery)}&sort=${encodeURIComponent(this.browseSort)}&page=${this.browsePage}`;s&&(c+="&refresh=true");const l=await m.get(c);if(l.success)e?this.browseResults=[...this.browseResults,...l.results||[]]:this.browseResults=l.results||[],this.browseTotalPages=l.totalPages||1,this.renderBrowseResults(e);else throw new Error(l.error||"Failed to browse")}catch(c){console.error("Browse error",c),e?alert("Failed to load more results: "+c.message):a.innerHTML=`<div class="error-state" style="grid-column: 1/-1; margin-top: 2rem;">Failed to load browse results: ${c.message}</div>`}finally{this.isBrowsing=!1,e&&(n.style.display="inline-block",r.style.display="none")}}}renderBrowseResults(e){const s=document.getElementById("browse-results-container"),a=document.getElementById("browse-pagination");if(this.browseResults.length===0){s.innerHTML=`
        <div class="empty-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="empty-icon">${p("search-x")}</div>
          <p>No results found.</p>
        </div>
      `,a.style.display="none";return}let n="";this.browseResults.forEach((r,o)=>{const c=r.cover||"";let l="";c.startsWith("/covers/")?l=c:c&&(l=`/api/scrapers/proxy-cover?url=${encodeURIComponent(c)}`);const h=l?xe(l,"Cover",{kind:"series",self:!0}):pe("series");n+=`
        <div class="manga-card browse-result-card" data-index="${o}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${h}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${r.website||this.browseScraper}</span>
            </div>
          </div>
          <div class="manga-card-title" title="${r.title}">${r.title}</div>
        </div>
      `}),s.innerHTML=n,this.browsePage<this.browseTotalPages?a.style.display="block":a.style.display="none",setTimeout(()=>{document.querySelectorAll(".browse-result-card").forEach(r=>{r.addEventListener("click",()=>{const o=parseInt(r.dataset.index),c=this.browseResults[o];c&&this.openInfoModal(c)})})},100)}async openInfoModal(e){var o;this.infoAbortController&&this.infoAbortController.abort(),this.infoAbortController=new AbortController;const s=this.infoAbortController.signal,a=document.getElementById("preview-info-modal"),n=document.getElementById("preview-info-body"),r=document.getElementById("preview-read-btn");this.previewInfo=e,a.style.display="flex",n.innerHTML=`
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
         <div style="flex: 0 0 200px; max-width: 100%;">
            <div class="manga-card-cover" style="height: 280px; border-radius: 8px;">
               ${e.cover?`<img src="${e.cover.startsWith("/covers/")?e.cover:"/api/scrapers/proxy-cover?url="+encodeURIComponent(e.cover)}" style="width: 100%; height: 100%; object-fit: cover;">`:pe("series")}
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
    `,this._setReadBtnEnabled(r,!1);try{const c=await m.get(`/scrapers/info?url=${encodeURIComponent(e.url)}`,{signal:s});if(c.success&&c.info){this.previewInfo={...this.previewInfo,...c.info},Array.isArray(c.info.chapters)&&c.info.chapters.length>1&&((o=c.info.chapters[0])!=null&&o.url)&&(this.previewInfo.readUrl=c.info.chapters[0].url);let l="";c.info.tags&&c.info.tags.length>0&&(l=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Tags</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${c.info.tags.map(u=>`<span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); font-weight: normal; font-size: 0.75rem;">${u}</span>`).join("")}
                 </div>
               </div>
             `);let h="";c.info.artists&&c.info.artists.length>0&&(h=`
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
             ${h}
             ${l}
          `,this._setReadBtnEnabled(r,!0)}else document.getElementById("preview-extended-info").innerHTML='<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>',(this.previewInfo.galleryId||this.previewInfo.url)&&this._setReadBtnEnabled(r,!0)}catch(c){if(c.name==="AbortError"||s.aborted){console.log("Scraper details fetch aborted successfully.");return}console.error("Info error:",c),document.getElementById("preview-extended-info").innerHTML=`<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${c.message}</p>`,this._setReadBtnEnabled(r,!0)}}_setReadBtnEnabled(e,s){e&&(e.disabled=!s,e.style.opacity=s?"1":"0.5",e.style.cursor=s?"pointer":"not-allowed",e.style.pointerEvents=s?"auto":"none")}async openTempReader(){if(!this.previewInfo||!this.previewInfo.url&&!this.previewInfo.galleryId)return;const e=this.previewInfo.readUrl||this.previewInfo.url||`https://nhentai.net/g/${this.previewInfo.galleryId}/`,s=this.browseScraper||this.previewInfo.website;sessionStorage.setItem("streamPreviewUrl",e),sessionStorage.setItem("streamPreviewTitle",this.previewInfo.title||"Preview"),s?sessionStorage.setItem("streamPreviewScraper",s):sessionStorage.removeItem("streamPreviewScraper"),document.getElementById("preview-info-modal").style.display="none",window.location.hash="#/read/stream/preview"}}const bi=new yi,Ps={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};let _=null;function wi(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Rs(t,e=0){for(let s=t.length-1;s>e;s--){const a=e+Math.floor(Math.random()*(s-e+1));[t[s],t[a]]=[t[a],t[s]]}}function ki(t){let e;return typeof t=="string"?e=t:t&&typeof t=="object"&&(e=t.filename||t.path||t.name||t.url),e?(e.includes("/")&&(e=e.split("/").pop()),e.includes("\\")&&(e=e.split("\\").pop()),e):null}function $i(t){return p(t==="gallery"?"folder":t==="trophy"?"trophy":"book-open")}function Ei(t,e){const s=[];for(const a of t){if(e.has(a.id))continue;const n=a.alias||a.title;for(const r of a.volumes)r.cover&&s.push({url:r.cover,title:n,subtitle:r.name,kind:"volume"})}return s}async function Ci(){var a,n;const t=await m.getFavorites(),e=(a=t.listOrder)!=null&&a.length?t.listOrder:Object.keys(t.favorites||{}),s=[];for(const r of e)for(const o of((n=t.favorites)==null?void 0:n[r])||[])for(const c of o.imagePaths||[]){const l=ki(c);l&&s.push({url:`/api/public/chapter-images/${o.mangaId}/${o.chapterNum}/${encodeURIComponent(l)}`,title:r,subtitle:o.mangaTitle?`${o.mangaTitle} · Ch. ${o.chapterNum}`:`Ch. ${o.chapterNum}`,kind:"gallery"})}return s}async function Si(t){const e=await m.get("/trophy-pages"),s=await ue.loadBookmarks().catch(()=>[]),a=r=>{const o=s.find(c=>c.id===r);return o?o.alias||o.title:"Trophies"},n=[];for(const[r,o]of Object.entries(e||{}))if(!t.has(r))for(const[c,l]of Object.entries(o||{})){const h=Object.keys(l||{});if(h.length===0)continue;let u;try{u=(await m.getChapterImages(r,c)).images||[]}catch{continue}for(const g of h){const v=u[g];if(!v)continue;let C=typeof v=="string"?v.split("/").pop():(v==null?void 0:v.filename)||(v==null?void 0:v.path);if(C){try{C=decodeURIComponent(C)}catch{}n.push({url:`/api/public/chapter-images/${r}/${c}/${encodeURIComponent(C)}`,title:a(r),subtitle:`Ch. ${c} · Trophy`,kind:"trophy"})}}}return n}function wa(){_&&(clearTimeout(_.timer),_.playing&&_.slides.length>1&&(_.timer=setTimeout(()=>ke(_.index+1),_.config.intervalMs)))}function jt(){if(!_)return;const t=_.slides[_.index],e=document.getElementById("ss-counter"),s=document.getElementById("ss-title"),a=document.getElementById("ss-subtitle");e&&(e.textContent=_.slides.length?`${_.index+1} / ${_.slides.length}`:""),s&&t&&(s.innerHTML=`${$i(t.kind)} ${wi(t.title)}`),a&&t&&(a.textContent=t.subtitle||"")}function ke(t){if(!_||_.slides.length===0)return;const e=(t%_.slides.length+_.slides.length)%_.slides.length;_.index=e;const s=_.slides[e],a=++_.loadToken,n=1-_.activeLayer,r=_.layers[n],o=_.layers[_.activeLayer];r.onload=()=>{if(!(!_||a!==_.loadToken)&&(_.activeLayer=n,r.classList.add("active"),o.classList.remove("active"),jt(),wa(),_.slides.length>1)){const c=_.slides[(e+1)%_.slides.length];c&&(new Image().src=c.url)}},r.onerror=()=>{if(!(!_||a!==_.loadToken)){if(_.slides.splice(e,1),_.slides.length===0){Wt();return}ke(e)}},r.src=s.url,jt()}function qs(t){if(!_)return;_.playing=t;const e=document.getElementById("ss-play");e&&(e.innerHTML=p(t?"pause":"play")),wa()}function ve(){if(!_)return;const t=document.getElementById("slideshow");t&&(t.classList.remove("controls-hidden"),clearTimeout(_.hideTimer),_.hideTimer=setTimeout(()=>{var e;(e=document.getElementById("slideshow"))==null||e.classList.add("controls-hidden")},3e3))}function Qt(){q.go("/settings")}function Wt(){var e;const t=document.getElementById("slideshow");t&&(t.innerHTML=`
        <div class="slideshow-empty">
            ${p("images",{size:48})}
            <p>Nothing to show yet — add covers to your volumes, or enable galleries and trophies in Settings.</p>
            <button id="ss-empty-back" class="btn btn-primary">Back to Settings</button>
        </div>
    `,(e=document.getElementById("ss-empty-back"))==null||e.addEventListener("click",Qt))}const xi={mount:async()=>{const t=document.getElementById("app");t.innerHTML=`
            <div class="slideshow" id="slideshow">
                <div class="slideshow-stage" id="ss-stage">
                    <img class="slideshow-img" alt="">
                    <img class="slideshow-img" alt="">
                </div>
                <div class="slideshow-ui">
                    <div class="slideshow-topbar">
                        <button class="slideshow-btn" id="ss-exit" title="Exit slideshow">${p("x")}</button>
                        <div class="slideshow-counter" id="ss-counter"></div>
                        <button class="slideshow-btn" id="ss-fullscreen" title="Toggle fullscreen">${p("maximize")}</button>
                    </div>
                    <div class="slideshow-bottombar">
                        <div class="slideshow-caption">
                            <div class="slideshow-title" id="ss-title"></div>
                            <div class="slideshow-subtitle" id="ss-subtitle"></div>
                        </div>
                        <div class="slideshow-transport">
                            <button class="slideshow-btn" id="ss-prev" title="Previous">${p("chevron-left")}</button>
                            <button class="slideshow-btn" id="ss-play" title="Pause">${p("pause")}</button>
                            <button class="slideshow-btn" id="ss-next" title="Next">${p("chevron-right")}</button>
                        </div>
                    </div>
                </div>
                <div class="slideshow-loading" id="ss-loading">${p("loader",{spin:!0})} Loading covers…</div>
            </div>
        `;const e=document.getElementById("ss-stage");_={slides:[],index:0,playing:!0,timer:null,hideTimer:null,loadToken:0,activeLayer:0,layers:[...e.querySelectorAll(".slideshow-img")],config:{...Ps},keyHandler:null,moveHandler:null},document.getElementById("ss-exit").addEventListener("click",Qt),document.getElementById("ss-prev").addEventListener("click",()=>{ke(_.index-1),ve()}),document.getElementById("ss-next").addEventListener("click",()=>{ke(_.index+1),ve()}),document.getElementById("ss-play").addEventListener("click",()=>{qs(!_.playing),ve()}),document.getElementById("ss-fullscreen").addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>d("Fullscreen not supported","info"))}),e.addEventListener("click",l=>{const h=l.clientX/window.innerWidth;if(h<.3)ke(_.index-1),ve();else if(h>.7)ke(_.index+1),ve();else{const u=document.getElementById("slideshow");u.classList.contains("controls-hidden")?ve():(clearTimeout(_.hideTimer),u.classList.add("controls-hidden"))}}),_.keyHandler=l=>{if(_)switch(l.key){case"ArrowLeft":ke(_.index-1),ve();break;case"ArrowRight":ke(_.index+1),ve();break;case" ":l.preventDefault(),qs(!_.playing),ve();break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});break;case"Escape":document.fullscreenElement||Qt();break}},document.addEventListener("keydown",_.keyHandler),_.moveHandler=()=>ve(),document.addEventListener("mousemove",_.moveHandler),ve();let s={};try{s=await m.get("/settings")||{}}catch{}_.config={...Ps,...s.slideshow||{}};const a=new Set(_.config.disabledMangaIds||[]);let n=[];try{n=await m.getAllVolumes()}catch(l){console.error(l)}_.slides=Ei(n,a),_.config.shuffle&&Rs(_.slides,-1);const r=document.getElementById("ss-loading");_.slides.length>0&&(r==null||r.remove(),ke(0));const o=l=>{var u;if(!_||l.length===0)return;const h=_.slides.length===0;_.slides.push(...l),_.config.shuffle&&Rs(_.slides,h?-1:_.index),h?((u=document.getElementById("ss-loading"))==null||u.remove(),ke(0)):jt()},c=[];_.config.includeLists&&c.push(Ci().then(o).catch(l=>console.warn("Slideshow: galleries unavailable",l))),_.config.includeTrophies&&c.push(Si(a).then(o).catch(l=>console.warn("Slideshow: trophies unavailable",l))),_.slides.length===0&&(c.length===0?Wt():Promise.allSettled(c).then(()=>{_&&_.slides.length===0&&Wt()}))},unmount:()=>{_&&(clearTimeout(_.timer),clearTimeout(_.hideTimer),document.removeEventListener("keydown",_.keyHandler),document.removeEventListener("mousemove",_.moveHandler),document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),_=null)}};class Ii{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,s){this.routes.set(e,s)}async navigate(){console.log("[Router] navigate called");const s=(window.location.hash.slice(1)||"/").split("?")[0],[a,...n]=s.split("/").filter(Boolean),r=`/${a||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let o=this.routes.get(r);!o&&this.routes.has("/")&&(o=this.routes.get("/")),o&&(this.currentRoute=r,this.currentView=o,o.mount&&(console.log("[Router] calling mount on view module"),await o.mount(n)),Ie())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),Ie())}}const q=new Ii;q.register("/",Rn);q.register("/manga",Pr);q.register("/read",rr);q.register("/series",Hr);q.register("/settings",jr);q.register("/admin",Qr);q.register("/favorites",ai);q.register("/queue",fi);q.register("/scrapers",bi);q.register("/slideshow",xi);export{oe as S,ee as a,_i as i,q as r,Ai as s};
