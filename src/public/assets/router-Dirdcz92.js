import{a as m}from"./api-CaxKfdtS.js";const Ce=Object.create(null);Ce.open="0";Ce.close="1";Ce.ping="2";Ce.pong="3";Ce.message="4";Ce.upgrade="5";Ce.noop="6";const rt=Object.create(null);Object.keys(Ce).forEach(t=>{rt[Ce[t]]=t});const qt={type:"error",data:"parser error"},Os=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Us=typeof ArrayBuffer=="function",Hs=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,ss=({type:t,data:e},s,a)=>Os&&e instanceof Blob?s?a(e):ks(e,a):Us&&(e instanceof ArrayBuffer||Hs(e))?s?a(e):ks(new Blob([e]),a):a(Ce[t]+(e||"")),ks=(t,e)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];e("b"+(a||""))},s.readAsDataURL(t)};function $s(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let Bt;function La(t,e){if(Os&&t.data instanceof Blob)return t.data.arrayBuffer().then($s).then(e);if(Us&&(t.data instanceof ArrayBuffer||Hs(t.data)))return e($s(t.data));ss(t,!1,s=>{Bt||(Bt=new TextEncoder),e(Bt.encode(s))})}const Es="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",We=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<Es.length;t++)We[Es.charCodeAt(t)]=t;const Ia=t=>{let e=t.length*.75,s=t.length,a,n=0,r,o,c,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const u=new ArrayBuffer(e),h=new Uint8Array(u);for(a=0;a<s;a+=4)r=We[t.charCodeAt(a)],o=We[t.charCodeAt(a+1)],c=We[t.charCodeAt(a+2)],l=We[t.charCodeAt(a+3)],h[n++]=r<<2|o>>4,h[n++]=(o&15)<<4|c>>2,h[n++]=(c&3)<<6|l&63;return u},Ba=typeof ArrayBuffer=="function",as=(t,e)=>{if(typeof t!="string")return{type:"message",data:Vs(t,e)};const s=t.charAt(0);return s==="b"?{type:"message",data:Aa(t.substring(1),e)}:rt[s]?t.length>1?{type:rt[s],data:t.substring(1)}:{type:rt[s]}:qt},Aa=(t,e)=>{if(Ba){const s=Ia(t);return Vs(s,e)}else return{base64:!0,data:t}},Vs=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},js="",_a=(t,e)=>{const s=t.length,a=new Array(s);let n=0;t.forEach((r,o)=>{ss(r,!1,c=>{a[o]=c,++n===s&&e(a.join(js))})})},Ma=(t,e)=>{const s=t.split(js),a=[];for(let n=0;n<s.length;n++){const r=as(s[n],e);if(a.push(r),r.type==="error")break}return a};function Ta(){return new TransformStream({transform(t,e){La(t,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const r=new DataView(n.buffer);r.setUint8(0,126),r.setUint16(1,a)}else{n=new Uint8Array(9);const r=new DataView(n.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(a))}t.data&&typeof t.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(s)})}})}let At;function st(t){return t.reduce((e,s)=>e+s.length,0)}function at(t,e){if(t[0].length===e)return t.shift();const s=new Uint8Array(e);let a=0;for(let n=0;n<e;n++)s[n]=t[0][a++],a===t[0].length&&(t.shift(),a=0);return t.length&&a<t[0].length&&(t[0]=t[0].slice(a)),s}function Pa(t,e){At||(At=new TextDecoder);const s=[];let a=0,n=-1,r=!1;return new TransformStream({transform(o,c){for(s.push(o);;){if(a===0){if(st(s)<1)break;const l=at(s,1);r=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(st(s)<2)break;const l=at(s,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(st(s)<8)break;const l=at(s,8),u=new DataView(l.buffer,l.byteOffset,l.length),h=u.getUint32(0);if(h>Math.pow(2,21)-1){c.enqueue(qt);break}n=h*Math.pow(2,32)+u.getUint32(4),a=3}else{if(st(s)<n)break;const l=at(s,n);c.enqueue(as(r?l:At.decode(l),e)),a=0}if(n===0||n>t){c.enqueue(qt);break}}}})}const zs=4;function se(t){if(t)return Ra(t)}function Ra(t){for(var e in se.prototype)t[e]=se.prototype[e];return t}se.prototype.on=se.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this};se.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this};se.prototype.off=se.prototype.removeListener=se.prototype.removeAllListeners=se.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+t];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===e||a.fn===e){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+t],this};se.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),s=this._callbacks["$"+t],a=1;a<arguments.length;a++)e[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,e)}return this};se.prototype.emitReserved=se.prototype.emit;se.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};se.prototype.hasListeners=function(t){return!!this.listeners(t).length};const $t=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,s)=>s(e,0),ge=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),qa="arraybuffer";function Qs(t,...e){return e.reduce((s,a)=>(t.hasOwnProperty(a)&&(s[a]=t[a]),s),{})}const Da=ge.setTimeout,Fa=ge.clearTimeout;function Et(t,e){e.useNativeTimers?(t.setTimeoutFn=Da.bind(ge),t.clearTimeoutFn=Fa.bind(ge)):(t.setTimeoutFn=ge.setTimeout.bind(ge),t.clearTimeoutFn=ge.clearTimeout.bind(ge))}const Na=1.33;function Oa(t){return typeof t=="string"?Ua(t):Math.ceil((t.byteLength||t.size)*Na)}function Ua(t){let e=0,s=0;for(let a=0,n=t.length;a<n;a++)e=t.charCodeAt(a),e<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(a++,s+=4);return s}function Ws(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Ha(t){let e="";for(let s in t)t.hasOwnProperty(s)&&(e.length&&(e+="&"),e+=encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e}function Va(t){let e={},s=t.split("&");for(let a=0,n=s.length;a<n;a++){let r=s[a].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class ja extends Error{constructor(e,s,a){super(e),this.description=s,this.context=a,this.type="TransportError"}}class ns extends se{constructor(e){super(),this.writable=!1,Et(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,s,a){return super.emitReserved("error",new ja(e,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const s=as(e,this.socket.binaryType);this.onPacket(s)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,s={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const s=Ha(e);return s.length?"?"+s:""}}class za extends ns{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const s=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};Ma(e,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,_a(e,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=Ws()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(e,s)}}let Gs=!1;try{Gs=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Qa=Gs;function Wa(){}class Ga extends za{constructor(e){if(super(e),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||a!==e.port}}doWrite(e,s){const a=this.request({method:"POST",data:e});a.on("success",s),a.on("error",(n,r)=>{this.onError("xhr post error",n,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=e}}class Ee extends se{constructor(e,s,a){super(),this.createRequest=e,Et(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var e;const s=Qs(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=Ee.requestsCount++,Ee.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Wa,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ee.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Ee.requestsCount=0;Ee.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Cs);else if(typeof addEventListener=="function"){const t="onpagehide"in ge?"pagehide":"unload";addEventListener(t,Cs,!1)}}function Cs(){for(let t in Ee.requests)Ee.requests.hasOwnProperty(t)&&Ee.requests[t].abort()}const Ka=function(){const t=Ks({xdomain:!1});return t&&t.responseType!==null}();class Ja extends Ga{constructor(e){super(e);const s=e&&e.forceBase64;this.supportsBinary=Ka&&!s}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Ee(Ks,this.uri(),e)}}function Ks(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Qa))return new XMLHttpRequest}catch{}if(!e)try{return new ge[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Js=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Ya extends ns{get name(){return"websocket"}doOpen(){const e=this.uri(),s=this.opts.protocols,a=Js?{}:Qs(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;ss(a,this.supportsBinary,r=>{try{this.doWrite(a,r)}catch{}n&&$t(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=Ws()),this.supportsBinary||(s.b64=1),this.createUri(e,s)}}const _t=ge.WebSocket||ge.MozWebSocket;class Xa extends Ya{createSocket(e,s,a){return Js?new _t(e,s,a):s?new _t(e,s):new _t(e)}doWrite(e,s){this.ws.send(s)}}class Za extends ns{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const s=Pa(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=e.readable.pipeThrough(s).getReader(),n=Ta();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const r=()=>{a.read().then(({done:c,value:l})=>{c||(this.onPacket(l),r())}).catch(c=>{})};r();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;this._writer.write(a).then(()=>{n&&$t(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const en={websocket:Xa,webtransport:Za,polling:Ja},tn=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,sn=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Dt(t){if(t.length>8e3)throw"URI too long";const e=t,s=t.indexOf("["),a=t.indexOf("]");s!=-1&&a!=-1&&(t=t.substring(0,s)+t.substring(s,a).replace(/:/g,";")+t.substring(a,t.length));let n=tn.exec(t||""),r={},o=14;for(;o--;)r[sn[o]]=n[o]||"";return s!=-1&&a!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=an(r,r.path),r.queryKey=nn(r,r.query),r}function an(t,e){const s=/\/{2,9}/g,a=e.replace(s,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&a.splice(0,1),e.slice(-1)=="/"&&a.splice(a.length-1,1),a}function nn(t,e){const s={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,r){n&&(s[n]=r)}),s}const Ft=typeof addEventListener=="function"&&typeof removeEventListener=="function",it=[];Ft&&addEventListener("offline",()=>{it.forEach(t=>t())},!1);class Ae extends se{constructor(e,s){if(super(),this.binaryType=qa,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(s=e,e=null),e){const a=Dt(e);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=Dt(s.host).host);Et(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Va(this.opts.query)),Ft&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},it.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const s=Object.assign({},this.opts.query);s.EIO=zs,s.transport=e,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Ae.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(e);s.open(),this.setTransport(s)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",Ae.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=e.data,this._onError(s);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=Oa(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,$t(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,s,a){return this._sendPacket("message",e,s,a),this}send(e,s,a){return this._sendPacket("message",e,s,a),this}_sendPacket(e,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const r={type:e,data:s,options:a};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),e()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():e()}):this.upgrading?a():e()),this}_onError(e){if(Ae.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Ft&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=it.indexOf(this._offlineEventListener);a!==-1&&it.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,s),this.writeBuffer=[],this._prevBufferLen=0}}}Ae.protocol=zs;class rn extends Ae{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let s=this.createTransport(e),a=!1;Ae.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",f=>{if(!a)if(f.type==="pong"&&f.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;Ae.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(h(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const y=new Error("probe error");y.transport=s.name,this.emitReserved("upgradeError",y)}}))};function r(){a||(a=!0,h(),s.close(),s=null)}const o=f=>{const y=new Error("probe error: "+f);y.transport=s.name,r(),this.emitReserved("upgradeError",y)};function c(){o("transport closed")}function l(){o("socket closed")}function u(f){s&&f.name!==s.name&&r()}const h=()=>{s.removeListener("open",n),s.removeListener("error",o),s.removeListener("close",c),this.off("close",l),this.off("upgrading",u)};s.once("open",n),s.once("error",o),s.once("close",c),this.once("close",l),this.once("upgrading",u),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const s=[];for(let a=0;a<e.length;a++)~this.transports.indexOf(e[a])&&s.push(e[a]);return s}}let on=class extends rn{constructor(e,s={}){const a=typeof e=="object"?e:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>en[n]).filter(n=>!!n)),super(e,a)}};function ln(t,e="",s){let a=t;s=s||typeof location<"u"&&location,t==null&&(t=s.protocol+"//"+s.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=s.protocol+t:t=s.host+t),/^(https?|wss?):\/\//.test(t)||(typeof s<"u"?t=s.protocol+"//"+t:t="https://"+t),a=Dt(t)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const r=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+r+":"+a.port+e,a.href=a.protocol+"://"+r+(s&&s.port===a.port?"":":"+a.port),a}const cn=typeof ArrayBuffer=="function",dn=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Ys=Object.prototype.toString,un=typeof Blob=="function"||typeof Blob<"u"&&Ys.call(Blob)==="[object BlobConstructor]",hn=typeof File=="function"||typeof File<"u"&&Ys.call(File)==="[object FileConstructor]";function rs(t){return cn&&(t instanceof ArrayBuffer||dn(t))||un&&t instanceof Blob||hn&&t instanceof File}function ot(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let s=0,a=t.length;s<a;s++)if(ot(t[s]))return!0;return!1}if(rs(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return ot(t.toJSON(),!0);for(const s in t)if(Object.prototype.hasOwnProperty.call(t,s)&&ot(t[s]))return!0;return!1}function pn(t){const e=[],s=t.data,a=t;return a.data=Nt(s,e),a.attachments=e.length,{packet:a,buffers:e}}function Nt(t,e){if(!t)return t;if(rs(t)){const s={_placeholder:!0,num:e.length};return e.push(t),s}else if(Array.isArray(t)){const s=new Array(t.length);for(let a=0;a<t.length;a++)s[a]=Nt(t[a],e);return s}else if(typeof t=="object"&&!(t instanceof Date)){const s={};for(const a in t)Object.prototype.hasOwnProperty.call(t,a)&&(s[a]=Nt(t[a],e));return s}return t}function mn(t,e){return t.data=Ot(t.data,e),delete t.attachments,t}function Ot(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let s=0;s<t.length;s++)t[s]=Ot(t[s],e);else if(typeof t=="object")for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(t[s]=Ot(t[s],e));return t}const gn=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var V;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(V||(V={}));class fn{constructor(e){this.replacer=e}encode(e){return(e.type===V.EVENT||e.type===V.ACK)&&ot(e)?this.encodeAsBinary({type:e.type===V.EVENT?V.BINARY_EVENT:V.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let s=""+e.type;return(e.type===V.BINARY_EVENT||e.type===V.BINARY_ACK)&&(s+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(s+=e.nsp+","),e.id!=null&&(s+=e.id),e.data!=null&&(s+=JSON.stringify(e.data,this.replacer)),s}encodeAsBinary(e){const s=pn(e),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class is extends se{constructor(e){super(),this.reviver=e}add(e){let s;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(e);const a=s.type===V.BINARY_EVENT;a||s.type===V.BINARY_ACK?(s.type=a?V.EVENT:V.ACK,this.reconstructor=new vn(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(rs(e)||e.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(e),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let s=0;const a={type:Number(e.charAt(0))};if(V[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===V.BINARY_EVENT||a.type===V.BINARY_ACK){const r=s+1;for(;e.charAt(++s)!=="-"&&s!=e.length;);const o=e.substring(r,s);if(o!=Number(o)||e.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(o)}if(e.charAt(s+1)==="/"){const r=s+1;for(;++s&&!(e.charAt(s)===","||s===e.length););a.nsp=e.substring(r,s)}else a.nsp="/";const n=e.charAt(s+1);if(n!==""&&Number(n)==n){const r=s+1;for(;++s;){const o=e.charAt(s);if(o==null||Number(o)!=o){--s;break}if(s===e.length)break}a.id=Number(e.substring(r,s+1))}if(e.charAt(++s)){const r=this.tryParse(e.substr(s));if(is.isPayloadValid(a.type,r))a.data=r;else throw new Error("invalid payload")}return a}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,s){switch(e){case V.CONNECT:return Ss(s);case V.DISCONNECT:return s===void 0;case V.CONNECT_ERROR:return typeof s=="string"||Ss(s);case V.EVENT:case V.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&gn.indexOf(s[0])===-1);case V.ACK:case V.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class vn{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const s=mn(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function Ss(t){return Object.prototype.toString.call(t)==="[object Object]"}const yn=Object.freeze(Object.defineProperty({__proto__:null,Decoder:is,Encoder:fn,get PacketType(){return V}},Symbol.toStringTag,{value:"Module"}));function ye(t,e,s){return t.on(e,s),function(){t.off(e,s)}}const bn=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Xs extends se{constructor(e,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[ye(e,"open",this.onopen.bind(this)),ye(e,"packet",this.onpacket.bind(this)),ye(e,"error",this.onerror.bind(this)),ye(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...s){var a,n,r;if(bn.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(s.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const o={type:V.EVENT,data:s};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const h=this.ids++,f=s.pop();this._registerAckCallback(h,f),o.id=h}const c=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[e]=s;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===e&&this.sendBuffer.splice(c,1);s.call(this,new Error("operation has timed out"))},n),o=(...c)=>{this.io.clearTimeoutFn(r),s.apply(this,c)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...s){return new Promise((a,n)=>{const r=(o,c)=>o?n(o):a(c);r.withError=!0,s.push(r),this.emit(e,...s)})}_addToQueue(e){let s;typeof e[e.length-1]=="function"&&(s=e.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...r)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...r)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!e||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:V.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(a=>String(a.id)===e)){const a=this.acks[e];delete this.acks[e],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case V.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case V.EVENT:case V.BINARY_EVENT:this.onevent(e);break;case V.ACK:case V.BINARY_ACK:this.onack(e);break;case V.DISCONNECT:this.ondisconnect();break;case V.CONNECT_ERROR:this.destroy();const a=new Error(e.data.message);a.data=e.data.data,this.emitReserved("connect_error",a);break}}onevent(e){const s=e.data||[];e.id!=null&&s.push(this.ack(e.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:V.ACK,id:e,data:n}))}}onack(e){const s=this.acks[e.id];typeof s=="function"&&(delete this.acks[e.id],s.withError&&e.data.unshift(null),s.apply(this,e.data))}onconnect(e,s){this.id=e,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:V.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,e.data)}}}function je(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}je.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),s=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+s:t-s}return Math.min(t,this.max)|0};je.prototype.reset=function(){this.attempts=0};je.prototype.setMin=function(t){this.ms=t};je.prototype.setMax=function(t){this.max=t};je.prototype.setJitter=function(t){this.jitter=t};class Ut extends se{constructor(e,s){var a;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(s=e,e=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,Et(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new je({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=e;const n=s.parser||yn;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var s;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(s=this.backoff)===null||s===void 0||s.setMin(e),this)}randomizationFactor(e){var s;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(s=this.backoff)===null||s===void 0||s.setJitter(e),this)}reconnectionDelayMax(e){var s;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(s=this.backoff)===null||s===void 0||s.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new on(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=ye(s,"open",function(){a.onopen(),e&&e()}),r=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),e?e(c):this.maybeReconnectOnOpen()},o=ye(s,"error",r);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{n(),r(new Error("timeout")),s.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(ye(e,"ping",this.onping.bind(this)),ye(e,"data",this.ondata.bind(this)),ye(e,"error",this.onerror.bind(this)),ye(e,"close",this.onclose.bind(this)),ye(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(s){this.onclose("parse error",s)}}ondecoded(e){$t(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,s){let a=this.nsps[e];return a?this._autoConnect&&!a.active&&a.connect():(a=new Xs(this,e,s),this.nsps[e]=a),a}_destroy(e){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(e){const s=this.encoder.encode(e);for(let a=0;a<s.length;a++)this.engine.write(s[a],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Qe={};function lt(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const s=ln(t,e.path||"/socket.io"),a=s.source,n=s.id,r=s.path,o=Qe[n]&&r in Qe[n].nsps,c=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return c?l=new Ut(a,e):(Qe[n]||(Qe[n]=new Ut(a,e)),l=Qe[n]),s.query&&!e.query&&(e.query=s.queryKey),l.socket(s.path,e)}Object.assign(lt,{Manager:Ut,Socket:Xs,io:lt,connect:lt});class wn{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=lt({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var s;this.subscribedMangas.add(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var s;this.subscribedMangas.delete(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,s){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(s),this.socket&&this.socket.on(e,s)}off(e,s){this.listeners.has(e)&&this.listeners.get(e).delete(s),this.socket&&this.socket.off(e,s)}emit(e,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(e,s)}}const oe={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone",SITE_CHALLENGE:"site:challenge",SITE_CHALLENGE_CLEARED:"site:challenge-cleared",SITE_SESSION:"site:session"},te=new wn,ce={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},be=new Set,ee=new Map,Ge=new Map;function kn(t){return ce[t]}function $n(t,e){ce[t]=e,be.add(t),et(t)}function En(t,e){return Ge.has(t)||Ge.set(t,new Set),Ge.get(t).add(e),()=>{var s;return(s=Ge.get(t))==null?void 0:s.delete(e)}}function et(t){const e=Ge.get(t);e&&e.forEach(s=>s(ce[t]))}function Ke(t){be.delete(t),ee.delete(t)}function Cn(t){return be.has(t)}async function Je(t=!1){if(!t&&be.has("bookmarks"))return ce.bookmarks;if(ee.has("bookmarks"))return ee.get("bookmarks");const e=m.getBookmarks().then(s=>(ce.bookmarks=s||[],be.add("bookmarks"),ee.delete("bookmarks"),et("bookmarks"),ce.bookmarks)).catch(s=>{throw ee.delete("bookmarks"),s});return ee.set("bookmarks",e),e}async function Sn(t=!1){if(!t&&be.has("series"))return ce.series;if(ee.has("series"))return ee.get("series");const e=m.get("/series").then(s=>(ce.series=s||[],be.add("series"),ee.delete("series"),et("series"),ce.series)).catch(s=>{throw ee.delete("series"),s});return ee.set("series",e),e}async function xn(t=!1){if(!t&&be.has("categories"))return ce.categories;if(ee.has("categories"))return ee.get("categories");const e=m.get("/categories").then(s=>(ce.categories=s.categories||[],be.add("categories"),ee.delete("categories"),et("categories"),ce.categories)).catch(s=>{throw ee.delete("categories"),s});return ee.set("categories",e),e}async function Ln(t=!1){if(!t&&be.has("favorites"))return ce.favorites;if(ee.has("favorites"))return ee.get("favorites");const e=m.getFavorites().then(s=>(ce.favorites=s||{favorites:{},listOrder:[]},be.add("favorites"),ee.delete("favorites"),et("favorites"),ce.favorites)).catch(s=>{throw ee.delete("favorites"),s});return ee.set("favorites",e),e}function In(){te.on(oe.MANGA_UPDATED,()=>{Ke("bookmarks"),Je(!0)}),te.on(oe.MANGA_ADDED,()=>{Ke("bookmarks"),Je(!0)}),te.on(oe.MANGA_DELETED,()=>{Ke("bookmarks"),Je(!0)}),te.on(oe.DOWNLOAD_COMPLETED,()=>{Ke("bookmarks"),Je(!0)})}In();const ue={get:kn,set:$n,subscribe:En,invalidate:Ke,isLoaded:Cn,loadBookmarks:Je,loadSeries:Sn,loadCategories:xn,loadFavorites:Ln};function d(t,e="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=t,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}const Bn={library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',"book-open":'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',"book-marked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',"layout-grid":'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',check:'<path d="M20 6 9 17l-5-5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',"trash-2":'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',"undo-2":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',scissors:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',play:'<polygon points="6 3 20 12 6 21 6 3"/>',pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',"hard-drive":'<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',package:'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"eye-off":'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',circle:'<circle cx="12" cy="12" r="10"/>',lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',"lock-open":'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',"triangle-alert":'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',"shield-alert":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',"circle-help":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',"traffic-cone":'<path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"/><path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"/><path d="M13.9 3.5a1.93 1.93 0 0 0-3.8 0L6.1 19.5a1.93 1.93 0 0 0 1.9 2.5h8a1.93 1.93 0 0 0 1.9-2.5z"/><path d="M2 21h20"/>',sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',"alarm-clock":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',loader:'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',"search-x":'<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',"list-checks":'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',"log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',sliders:'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',"chevron-up":'<path d="m18 15-6-6-6 6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"chevron-left":'<path d="m15 18-6-6 6-6"/>',"chevron-right":'<path d="m9 18 6-6-6-6"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',images:'<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>',"columns-2":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',"rectangle-vertical":'<rect width="12" height="20" x="6" y="2" rx="2"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',"arrow-left-right":'<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',"refresh-cw":'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>',"rotate-cw":'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"message-circle":'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'};function p(t,e={}){const s=Bn[t];if(!s)return console.warn("[icons] unknown icon:",t),"";const{size:a,cls:n="",title:r,spin:o=!1}=e,c=["icon",o?"icon-spin":"",n].filter(Boolean).join(" "),l=a?` width="${a}" height="${a}"`:"",u=r?` role="img" aria-label="${String(r).replace(/"/g,"&quot;")}"`:' aria-hidden="true"';return`<svg class="${c}"${l} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${u}>${s}</svg>`}function pe(t="book"){return`<div class="placeholder" data-icon="${t}"></div>`}function Le(t,e,s={}){const{kind:a="book",self:n=!1,attrs:r=""}=s,o=String(e??"").replace(/"/g,"&quot;"),c=`<div class=&quot;placeholder&quot; data-icon=&quot;${a}&quot;></div>`,l=n?"this.outerHTML":"this.parentElement.innerHTML";return`<img src="${t}" alt="${o}" loading="lazy"${r?" "+r:""} onerror="${l}='${c}'">`}const xs=`${p("folder")} Scan Folder`,Ls=`${p("loader",{spin:!0})} Scanning...`;async function An(t,e,s){try{t&&(t.disabled=!0,t.innerHTML=Ls),e&&(e.innerHTML=Ls),d("Scanning downloads folder...","info");const n=(await m.scanLibrary()).found||[];if(n.length===0){d("Scan complete: No new manga found","info"),s&&s();return}_n(n,s)}catch(a){d("Scan failed: "+a.message,"error")}finally{t&&(t.disabled=!1,t.innerHTML=xs),e&&(e.innerHTML=xs)}}async function _n(t,e){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),r=Array.from(n).map(l=>l.dataset.folder);if(r.length===0){d("No folders selected","warning");return}const o=document.getElementById("import-all-btn");o.disabled=!0,o.textContent="Importing...";let c=0;for(const l of r)try{await m.importLocalManga(l),c++}catch(u){console.error("Failed to import",l,u)}s.remove(),d(`Imported ${c} manga`,"success"),e&&e()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function Mn(t={}){const{size:e,stroke:s="currentColor",accent:a="var(--accent-primary, #E03A2F)",strokeWidth:n=2,cls:r=""}=t,o=e?` width="${e}" height="${e}"`:"";return`<svg class="${`logo-mark ${r}`.trim()}"${o} viewBox="0 0 24 24" fill="none" stroke="${s}" stroke-width="${n}" stroke-linejoin="round" aria-hidden="true"><polygon points="3,3 10.5,3 8.5,21 3,21"/><polygon points="13,3 21,3 21,10.5 12.17,10.5" fill="${a}" stroke="${a}"/><polygon points="11.89,13 21,13 21,21 11,21"/></svg>`}function Is(){return`${Mn()}<span class="logo-text">Manga<span>Reader</span></span>`}const Y={user:null,get isAdmin(){var t;return((t=this.user)==null?void 0:t.role)==="admin"},get isDemo(){var t;return((t=this.user)==null?void 0:t.role)==="demo"},get canDownload(){var t;return this.isAdmin||!this.isDemo&&!!((t=this.user)!=null&&t.canDownload)},get canEdit(){var t;return this.isAdmin||!this.isDemo&&!!((t=this.user)!=null&&t.canEdit)}};function Gi(t){Y.user=t||null}function le(t="manga"){if(Y.isDemo)return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${Is()}</a>
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
  `;const e=Y.isAdmin?`<a href="#/admin" class="btn btn-secondary" title="Admin">${p("wrench",{title:"Admin"})}</a>`:"",s=Y.isAdmin?`<a href="#/admin" class="mobile-menu-item">${p("wrench")} Admin</a>`:"",a=Y.canDownload?`<button class="btn btn-secondary" id="scan-btn">${p("folder")} Scan Folder</button>`:"",n=Y.canDownload?`<button class="mobile-menu-item" id="mobile-scan-btn">${p("folder")} Scan Folder</button>`:"",r=Y.canEdit?t==="series"?`<button class="btn btn-primary" id="add-series-btn">${p("plus")} Add Series</button>`:`<button class="btn btn-primary" id="add-manga-btn">${p("plus")} Add Manga</button>`:"",o=Y.canEdit?t==="series"?`<button class="mobile-menu-item primary" id="mobile-add-series-btn">${p("plus")} Add Series</button>`:`<button class="mobile-menu-item primary" id="mobile-add-btn">${p("plus")} Add Manga</button>`:"";return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${Is()}</a>
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
  `}function Ie(){const t=document.querySelector("header");if(t&&t.dataset.listenersBound)return;t&&(t.dataset.listenersBound="true");const e=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");e&&s&&e.addEventListener("click",()=>{s.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),r=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",r),n&&n.addEventListener("click",r);const o=document.getElementById("demo-exit-btn");o&&o.addEventListener("click",w=>{w.preventDefault(),localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"}),document.querySelectorAll("[data-view]").forEach(w=>{w.addEventListener("click",()=>{const A=w.dataset.view;localStorage.setItem("library_view_mode",A),document.querySelectorAll("[data-view]").forEach(N=>{N.classList.toggle("active",N.dataset.view===A)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:A}}))})});const c=document.querySelector(".logo");c&&c.addEventListener("click",w=>{localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),ue.loadBookmarks(!0).catch(()=>{}),window.dispatchEvent(new CustomEvent("clearFilters"))});const l=document.getElementById("favorites-btn"),u=document.getElementById("mobile-favorites-btn"),h=w=>{w.preventDefault(),D.go("/favorites")};l&&l.addEventListener("click",h),u&&u.addEventListener("click",h);const f=document.getElementById("queue-nav-btn");f&&f.addEventListener("click",w=>{w.preventDefault(),D.go("/queue")});const y=document.getElementById("add-manga-btn"),E=document.getElementById("mobile-add-btn"),S=()=>{document.getElementById("add-modal")||(sessionStorage.setItem("open_add_modal","1"),D.go("/"))};y&&y.addEventListener("click",S),E&&E.addEventListener("click",S);const v=document.getElementById("scan-btn"),I=document.getElementById("mobile-scan-btn");if(v||I){const w=()=>{An(v,I,async()=>{await ue.loadBookmarks(!0),D.reload()})};v&&v.addEventListener("click",w),I&&I.addEventListener("click",w)}}const pt={series:"any",downloads:"any",reading:"any",source:"any",monitor:"any"};function Tn(){try{const t=JSON.parse(localStorage.getItem("library_filters")||"{}");return{...pt,...t&&typeof t=="object"?t:{}}}catch{return{...pt}}}let C={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",searchAuthor:localStorage.getItem("library_search_author")||null,searchAuthorSource:localStorage.getItem("library_search_author_source")||null,sortBy:localStorage.getItem("library_sort")||"updated",filters:Tn(),viewMode:"manga",loading:!0},mt=[],Te=null;function Pn(){localStorage.setItem("library_filters",JSON.stringify(C.filters))}function Rn(t){var o,c,l;const e=new Set(t.excludedChapters||[]),s=new Set((t.chapters||[]).filter(u=>!e.has(u.number)).map(u=>u.number)).size||t.uniqueChapters||0,a=t.downloadedCount??((o=t.downloadedChapters)==null?void 0:o.length)??0,n=t.readCount??((c=t.readChapters)==null?void 0:c.length)??0,r=(t.updatedCount??((l=t.updatedChapters)==null?void 0:l.length)??0)>0;return{total:s,downloaded:a,read:n,updates:r}}const qn=[{key:"series",label:"Series",options:[{value:"none",label:"Not in a series",test:t=>!t.series},{value:"in",label:"In a series",test:t=>!!t.series}]},{key:"downloads",label:"Downloads",options:[{value:"none",label:"Nothing downloaded",test:(t,e)=>e.downloaded===0},{value:"partial",label:"Partly downloaded",test:(t,e)=>e.downloaded>0&&e.downloaded<e.total},{value:"complete",label:"Fully downloaded",test:(t,e)=>e.total>0&&e.downloaded>=e.total}]},{key:"reading",label:"Reading",options:[{value:"unread",label:"Not started",test:(t,e)=>e.read===0},{value:"progress",label:"In progress",test:(t,e)=>e.read>0&&e.read<e.total},{value:"finished",label:"Finished",test:(t,e)=>e.total>0&&e.read>=e.total},{value:"updates",label:"New chapters",test:(t,e)=>e.updates}]},{key:"source",label:"Source",options:[]},{key:"monitor",label:"Auto-check",options:[{value:"on",label:"On",test:t=>!!t.autoCheck},{value:"off",label:"Off",test:t=>!t.autoCheck}]}];function Dn(){const e=[...new Set(C.bookmarks.filter(s=>s.source!=="local"&&s.website).map(s=>s.website))].sort().map(s=>({value:`site:${s}`,label:s,test:a=>a.source!=="local"&&a.website===s}));return C.bookmarks.some(s=>s.source==="local")&&e.unshift({value:"local",label:"Local files",test:s=>s.source==="local"}),e}function Zs(){return qn.map(t=>t.key==="source"?{...t,options:Dn()}:t)}function ea(){return Object.values(C.filters).filter(t=>t&&t!=="any").length}function Fn(t){const s=Zs().map(a=>({g:a,option:a.options.find(n=>n.value===C.filters[a.key])})).filter(a=>a.option);return s.length===0?t:t.filter(a=>{const n=Rn(a);return s.every(({option:r})=>r.test(a,n))})}function gt(t){return String(t).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}function Nn(t){return[...t].sort((e,s)=>{var a,n;switch(C.sortBy){case"az":return(e.alias||e.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(e.alias||e.title);case"lastread":return(s.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const r=((a=e.chapters)==null?void 0:a.length)||e.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-r}case"updated":default:return(s.updatedAt||"").localeCompare(e.updatedAt||"")}})}function Ct(){let t=C.bookmarks;const e=(Array.isArray(C.categories)?C.categories:[]).filter(s=>typeof s=="object"?s.isNsfw:!1).map(s=>s.name);if(C.activeCategory==="__nsfw__"?t=t.filter(s=>(s.categories||[]).some(a=>e.includes(a))):C.activeCategory?t=t.filter(s=>(s.categories||[]).includes(C.activeCategory)):e.length>0&&(t=t.filter(s=>!(s.categories||[]).some(a=>e.includes(a)))),C.artistFilter&&(t=t.filter(s=>(s.artists||[]).includes(C.artistFilter))),C.searchQuery){const s=C.searchQuery.toLowerCase();t=t.filter(a=>(a.title||"").toLowerCase().includes(s)||(a.alias||"").toLowerCase().includes(s)||(a.artists||[]).some(n=>n.toLowerCase().includes(s)))}return t=Fn(t),Nn(t)}function On(t){const e=ea(),s=Zs().filter(a=>a.options.length>0);return`
    <div class="library-filter" id="library-filter">
      <button type="button" class="library-filter-btn ${e?"has-filter":""}" id="library-filter-btn" aria-haspopup="true" aria-expanded="false">
        ${p("sliders")} Filter${e?` · ${e}`:""}
      </button>
      <div class="library-filter-menu hidden" id="library-filter-menu" role="menu">
        <div class="library-filter-header">
          <span>Filter library</span>
          <button type="button" class="library-filter-reset" id="library-filter-reset" ${e?"":"hidden"}>Reset</button>
        </div>
        ${s.map(a=>`
          <div class="library-filter-group">
            <div class="library-filter-group-title">${a.label}</div>
            <div class="library-filter-options">
              <button type="button" class="filter-chip ${C.filters[a.key]==="any"||!C.filters[a.key]?"active":""}" data-group="${a.key}" data-value="any">Any</button>
              ${a.options.map(n=>`<button type="button" class="filter-chip ${C.filters[a.key]===n.value?"active":""}" data-group="${a.key}" data-value="${gt(n.value)}">${gt(n.label)}</button>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    <span class="library-count" id="library-count" title="Shown / in library">${t} / ${C.bookmarks.length}</span>
  `}function Bs(){const t=document.getElementById("library-grid");if(!t)return;const e=Ct();t.innerHTML=e.map(St).join("")||xt();const s=document.getElementById("library-count");s&&(s.textContent=`${e.length} / ${C.bookmarks.length}`);const a=ea(),n=document.getElementById("library-filter-btn");n&&(n.classList.toggle("has-filter",a>0),n.innerHTML=`${p("sliders")} Filter${a?` · ${a}`:""}`);const r=document.getElementById("library-filter-reset");r&&(r.hidden=a===0),document.querySelectorAll("#library-filter-menu .filter-chip").forEach(o=>{const c=C.filters[o.dataset.group]||"any";o.classList.toggle("active",o.dataset.value===c)})}function St(t){var h,f,y;const e=t.alias||t.title,s=t.downloadedCount??((h=t.downloadedChapters)==null?void 0:h.length)??0,a=new Set(t.excludedChapters||[]),n=(t.chapters||[]).filter(E=>!a.has(E.number)),r=new Set(n.map(E=>E.number)).size||t.uniqueChapters||0,o=t.readCount??((f=t.readChapters)==null?void 0:f.length)??0,c=(t.updatedCount??((y=t.updatedChapters)==null?void 0:y.length)??0)>0,l=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover,u=t.source==="local";return`
    <div class="manga-card" data-id="${t.id}">
      <div class="manga-card-cover">
        ${l?Le(l,e,{kind:u?"local":"book"}):pe(u?"local":"book")}
        <div class="manga-card-badges">
          ${o>0?`<span class="badge badge-read" title="Read">${o}</span>`:""}
          <span class="badge badge-chapters" title="Total">${r}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${c?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${t.autoCheck?`<span class="badge badge-monitored" title="Auto-check enabled">${p("alarm-clock",{title:"Auto-check enabled"})}</span>`:""}
          ${C.activeCategory==="Favorites"?`<span class="badge badge-play" title="Click to Read">${p("play",{title:"Click to Read"})}</span>`:""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function xt(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function Un(t){var n;const e=t.alias||t.title,s=((n=t.entries)==null?void 0:n.length)||t.entry_count||0;let a=null;return t.localCover&&t.coverBookmarkId?a=`/api/public/covers/${t.coverBookmarkId}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(a=t.cover),`
    <div class="manga-card series-card" data-series-id="${t.id}">
      <div class="manga-card-cover">
        ${a?Le(a,e,{kind:"series"}):pe("series")}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${s} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function ft(){const t=localStorage.getItem("library_view_mode");if(t&&t!==C.viewMode&&(C.viewMode=t),C.activeCategory==="Favorites")return D.go("/favorites"),"";let e="";if(C.viewMode==="series"){const s=C.series.map(Un).join("");e=`
      <div class="library-grid" id="library-grid">
        ${C.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const s=Ct(),n=C.searchAuthor&&C.searchQuery===C.searchAuthor?`
      <div class="manga-card search-sources-card" id="search-sources-card" title="Search online sources for ${gt(C.searchAuthor)}"
           style="display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed var(--border-color, #3a3a4a);background:transparent;min-height:220px;text-align:center;">
        <div style="padding:1rem;color:var(--text-muted, #9aa);">
          <div style="font-size:2.5rem;line-height:1;margin-bottom:.5rem;">＋</div>
          <div style="font-size:.85rem;">Search sources for<br><strong style="color:var(--text-color, #fff);">${gt(C.searchAuthor)}</strong></div>
        </div>
      </div>`:"",r=s.map(St).join("")+n;e=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">${p("search")}</span>
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
        ${On(s.length)}
      </div>
      ${C.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">${p("palette")}</span>
          <span class="artist-filter-name">${C.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${C.loading?'<div class="loading-spinner"></div>':r||xt()}
      </div>
    `}return`
    ${le(C.viewMode)}
    <div class="container">
      ${e}
    </div>
    ${Hn()}
    ${jn()}
    ${zn()}
  `}function Hn(){const{activeCategory:t}=C,s=(Array.isArray(C.categories)?C.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=s.some(n=>n.isNsfw);return`
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
    ${Vn()}
      `}function Vn(){const e=(Array.isArray(C.categories)?C.categories:[]).map(s=>typeof s=="object"?s:{name:s,isNsfw:!1});return`
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
  `}function jn(){return`
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
      `}function zn(){return`
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
      `}function Ht(){C.activeCategory=null,C.artistFilter=null,C.searchQuery="",C.searchAuthor=null,C.searchAuthorSource=null,C.filters={...pt},localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),localStorage.removeItem("library_filters"),me()}function Qn(){const t=document.getElementById("library-filter-btn"),e=document.getElementById("library-filter-menu");!t||!e||(t.addEventListener("click",s=>{s.stopPropagation();const a=e.classList.toggle("hidden")===!1;t.setAttribute("aria-expanded",String(a))}),e.addEventListener("click",s=>{s.stopPropagation();const a=s.target.closest(".filter-chip");if(a){C.filters[a.dataset.group]=a.dataset.value,Pn(),Bs();return}s.target.closest("#library-filter-reset")&&(C.filters={...pt},localStorage.removeItem("library_filters"),Bs())}),Te&&document.removeEventListener("click",Te),Te=s=>{!e.classList.contains("hidden")&&!s.target.closest("#library-filter")&&(e.classList.add("hidden"),t.setAttribute("aria-expanded","false"))},document.addEventListener("click",Te))}async function Vt(t){const e=t.target.closest(".manga-card");if(e){if(e.classList.contains("gallery-card")){const n=e.dataset.gallery;D.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=e.dataset.id,a=e.dataset.seriesId;if(a){D.go(`/series/${a}`);return}if(s){if(C.activeCategory==="Favorites"){const n=C.bookmarks.find(r=>r.id===s);if(n){let r=n.last_read_chapter;if(!r&&n.chapters&&n.chapters.length>0&&(r=[...n.chapters].sort((c,l)=>c.number-l.number)[0].number),r){D.go(`/read/${s}/${r}`);return}else d("No chapters available to read","warning")}}D.go(`/manga/${s}`)}}}function ta(){var Z,K,k,L,M;const t=document.getElementById("app");t.removeEventListener("click",Vt),t.addEventListener("click",Vt),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",$=>{C.viewMode=$.detail.mode;const B=document.getElementById("app");B.innerHTML=ft(),ta(),Ie()}));const e=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");e&&s&&(e.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",$=>{const B=$.target.closest(".category-menu-item");if(B){const R=B.dataset.category||null;Wn(R),s.classList.add("hidden")}})),(Z=document.getElementById("manage-categories-btn"))==null||Z.addEventListener("click",$=>{$.stopPropagation();const B=document.getElementById("manage-categories-modal");B&&B.classList.add("open")}),(K=document.getElementById("close-manage-categories-btn"))==null||K.addEventListener("click",()=>{var $;($=document.getElementById("manage-categories-modal"))==null||$.classList.remove("open")}),(k=document.querySelector("#manage-categories-modal .modal-overlay"))==null||k.addEventListener("click",()=>{var $;($=document.getElementById("manage-categories-modal"))==null||$.classList.remove("open")}),(L=document.querySelector("#manage-categories-modal .modal-close"))==null||L.addEventListener("click",()=>{var $;($=document.getElementById("manage-categories-modal"))==null||$.classList.remove("open")}),(M=document.getElementById("add-category-btn"))==null||M.addEventListener("click",async()=>{var R;const $=document.getElementById("new-category-input"),B=(R=$==null?void 0:$.value)==null?void 0:R.trim();if(B)try{await m.post("/categories",{name:B}),$.value="",d("Category added","success"),await Oe(!0),me()}catch(U){d("Failed: "+U.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach($=>{$.addEventListener("change",async B=>{const R=$.dataset.category;try{await m.put(`/categories/${encodeURIComponent(R)}/nsfw`,{isNsfw:$.checked}),d(`${R} ${$.checked?"marked as 18+":"unmarked"}`,"success"),await Oe(!0),me()}catch(U){d("Failed: "+U.message,"error"),$.checked=!$.checked}})}),document.querySelectorAll(".delete-category-btn").forEach($=>{$.addEventListener("click",async()=>{const B=$.dataset.category;if(confirm(`Delete category "${B}"?`))try{await m.delete(`/categories/${encodeURIComponent(B)}`),d("Category deleted","success"),C.activeCategory===B&&(C.activeCategory=null,localStorage.removeItem("library_active_category")),await Oe(!0),me()}catch(R){d("Failed: "+R.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{C.artistFilter=null,localStorage.removeItem("library_artist_filter"),me()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",$=>{var R;C.searchQuery=$.target.value,localStorage.setItem("library_search",$.target.value),C.searchAuthor=null,C.searchAuthorSource=null,localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source");const B=document.getElementById("library-grid");if(B){const U=Ct();B.innerHTML=U.map(St).join("")||xt();const T=document.getElementById("search-clear");!T&&C.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(R=document.getElementById("search-clear"))==null||R.addEventListener("click",()=>{C.searchQuery="",C.searchAuthor=null,C.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),n.value="",me()})):T&&!C.searchQuery&&T.remove()}}),C.searchQuery&&n.focus());const r=document.getElementById("search-clear");r&&r.addEventListener("click",()=>{C.searchQuery="",C.searchAuthor=null,C.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),me()});const o=document.getElementById("search-sources-card");o&&o.addEventListener("click",()=>{const $=C.searchAuthor||C.searchQuery,B=C.searchAuthorSource||"nhentai.net";$&&(window.location.hash=`#/scrapers?browse=${encodeURIComponent(B)}&q=${encodeURIComponent($)}`)});const c=document.getElementById("library-sort");c&&c.addEventListener("change",$=>{C.sortBy=$.target.value,localStorage.setItem("library_sort",C.sortBy),me()}),Qn(),window.removeEventListener("clearFilters",Ht),window.addEventListener("clearFilters",Ht);const l=document.getElementById("add-manga-btn"),u=document.getElementById("mobile-add-btn"),h=document.getElementById("add-modal"),f=document.getElementById("add-modal-close"),y=document.getElementById("add-modal-cancel"),E=document.getElementById("add-modal-submit"),S=document.getElementById("mobile-menu"),v=()=>{S&&S.classList.add("hidden"),h&&h.classList.add("open")};l&&l.addEventListener("click",v),u&&u.addEventListener("click",v),f&&f.addEventListener("click",()=>h.classList.remove("open")),y&&y.addEventListener("click",()=>h.classList.remove("open")),E&&E.addEventListener("click",async()=>{const $=document.getElementById("manga-url"),B=$.value.trim();if(!B){d("Please enter a URL","error");return}try{E.disabled=!0,E.textContent="Adding...",await m.addBookmark(B),d("Manga added successfully!","success"),h.classList.remove("open"),$.value="",await Oe(),me()}catch(R){d("Failed to add manga: "+R.message,"error")}finally{E.disabled=!1,E.textContent="Add"}});const I=document.getElementById("add-series-btn"),w=document.getElementById("mobile-add-series-btn"),A=document.getElementById("add-series-modal"),N=document.getElementById("add-series-modal-close"),F=document.getElementById("add-series-modal-cancel"),O=document.getElementById("add-series-modal-submit"),j=document.getElementById("mobile-menu");if((I||w)&&A){const $=()=>{j&&j.classList.add("hidden"),A.classList.add("open")};I&&I.addEventListener("click",$),w&&w.addEventListener("click",$)}N&&N.addEventListener("click",()=>A.classList.remove("open")),F&&F.addEventListener("click",()=>A.classList.remove("open")),O&&O.addEventListener("click",async()=>{const $=document.getElementById("series-title"),B=document.getElementById("series-alias"),R=$.value.trim(),U=B.value.trim();if(!R){d("Please enter a title","error");return}try{O.disabled=!0,O.textContent="Creating...",await m.createSeries(R,U),d("Series created successfully!","success"),A.classList.remove("open"),$.value="",B.value="",await Oe(!0),me()}catch(T){d("Failed to create series: "+T.message,"error")}finally{O.disabled=!1,O.textContent="Create"}});const b=A==null?void 0:A.querySelector(".modal-overlay");b&&b.addEventListener("click",()=>A.classList.remove("open"));const x=document.getElementById("empty-add-btn");x&&h&&x.addEventListener("click",()=>h.classList.add("open"));const P=document.getElementById("empty-add-series-btn");P&&A&&P.addEventListener("click",()=>A.classList.add("open"));const z=h==null?void 0:h.querySelector(".modal-overlay");z&&z.addEventListener("click",()=>h.classList.remove("open")),Ie()}function Wn(t){C.activeCategory=t,t?localStorage.setItem("library_active_category",t):localStorage.removeItem("library_active_category"),me()}async function Oe(t=!1){try{if(Y.isDemo){const[r,o]=await Promise.all([ue.loadBookmarks(t),ue.loadSeries(t)]);C.bookmarks=r,C.categories=[],C.series=o,C.favorites={favorites:{},listOrder:[]},C.loading=!1;return}const[e,s,a,n]=await Promise.all([ue.loadBookmarks(t),ue.loadCategories(t),ue.loadSeries(t),ue.loadFavorites(t)]);C.bookmarks=e,C.categories=s,C.series=a,C.favorites=n,C.loading=!1}catch{d("Failed to load library","error"),C.loading=!1}}async function me(){var e;const t=document.getElementById("app");if(Y.isDemo)C.activeCategory=null,C.artistFilter=null,C.searchQuery="",C.searchAuthor=null,C.searchAuthorSource=null;else{const s=localStorage.getItem("library_active_category");C.activeCategory!==s&&(C.activeCategory=s);const a=localStorage.getItem("library_artist_filter")||null;C.artistFilter!==a&&(C.artistFilter=a);const n=localStorage.getItem("library_search")||"";C.searchQuery!==n&&(C.searchQuery=n),C.searchAuthor=localStorage.getItem("library_search_author")||null,C.searchAuthorSource=localStorage.getItem("library_search_author_source")||null}C.loading&&(t.innerHTML=ft()),C.bookmarks.length===0&&C.loading&&await Oe(),t.innerHTML=ft(),ta(),sessionStorage.getItem("open_add_modal")&&(sessionStorage.removeItem("open_add_modal"),(e=document.getElementById("add-modal"))==null||e.classList.add("open")),mt.forEach(s=>s()),mt=[ue.subscribe("bookmarks",s=>{C.bookmarks=s;const a=document.getElementById("library-grid");if(a){const n=Ct();a.innerHTML=n.map(St).join("")||xt()}})]}function Gn(){const t=document.getElementById("app");t&&t.removeEventListener("click",Vt),window.removeEventListener("clearFilters",Ht),Te&&(document.removeEventListener("click",Te),Te=null),mt.forEach(e=>e()),mt=[]}const Kn={mount:me,unmount:Gn,render:ft},Jn="manga-offline",Yn=1,De="images",re="chapters";let nt=null;function tt(){return new Promise((t,e)=>{if(nt)return t(nt);const s=indexedDB.open(Jn,Yn);s.onupgradeneeded=a=>{const n=a.target.result;n.objectStoreNames.contains(De)||n.createObjectStore(De),n.objectStoreNames.contains(re)||n.createObjectStore(re)},s.onsuccess=()=>{nt=s.result,t(nt)},s.onerror=()=>e(s.error)})}function Fe(t,e){return tt().then(s=>new Promise((a,n)=>{const c=s.transaction(t,"readonly").objectStore(t).get(e);c.onsuccess=()=>a(c.result),c.onerror=()=>n(c.error)}))}function jt(t,e,s){return tt().then(a=>new Promise((n,r)=>{const l=a.transaction(t,"readwrite").objectStore(t).put(s,e);l.onsuccess=()=>n(),l.onerror=()=>r(l.error)}))}function zt(t,e){return tt().then(s=>new Promise((a,n)=>{const c=s.transaction(t,"readwrite").objectStore(t).delete(e);c.onsuccess=()=>a(),c.onerror=()=>n(c.error)}))}function os(t){return tt().then(e=>new Promise((s,a)=>{const o=e.transaction(t,"readonly").objectStore(t).getAllKeys();o.onsuccess=()=>s(o.result),o.onerror=()=>a(o.error)}))}function He(t,e){return`${t}:${e}`}function ls(t,e,s){return`${t}:${e}:${s}`}function Xn(t){const e=t.split(":");return{mangaId:e[0],chapterNum:parseFloat(e[1])}}async function cs(t,e,s=null){const a=await m.get(`/bookmarks/${t}/chapters/${e}/reader-images`);if(!a||!a.images||a.images.length===0)throw new Error("No images found for this chapter");const n=a.images,r=n.length;let o=0;const c=m.getToken();for(let u=0;u<n.length;u++){const h=typeof n[u]=="string"?n[u]:n[u].url,f=h.startsWith("http")?h:`${window.location.origin}${h}`;try{const y=await fetch(f,{headers:c?{Authorization:`Bearer ${c}`}:{}});if(!y.ok)throw new Error(`HTTP ${y.status}`);const E=await y.blob();await jt(De,ls(t,e,h),E),o++,s&&s(o,r)}catch(y){console.error(`[Offline] Failed to cache image ${u+1}/${r}:`,y)}}const l={mangaId:t,chapterNum:e,imageUrls:n.map(u=>typeof u=="string"?u:u.url),savedAt:Date.now(),imageCount:o};return await jt(re,He(t,e),l),{success:!0,imageCount:o}}async function Zn(t,e){const s=await Fe(re,He(t,e));if(!s)return null;const a=[];for(const n of s.imageUrls){const r=await Fe(De,ls(t,e,n));if(r)a.push(URL.createObjectURL(r));else return a.forEach(o=>URL.revokeObjectURL(o)),null}return a}async function sa(t,e){const s=await Fe(re,He(t,e));if(s&&s.imageUrls)for(const a of s.imageUrls)await zt(De,ls(t,e,a));await zt(re,He(t,e))}async function er(t,e){if(!await Fe(re,He(t,e)))return!1;await sa(t,e);try{return await cs(t,e),!0}catch(a){return console.warn("[Offline] Could not re-save chapter after edit:",a),!1}}async function tr(t,e){return!!await Fe(re,He(t,e))}async function sr(){const t=await os(re),e=[];for(const s of t){if(s.startsWith("auto-offline-"))continue;const a=await Fe(re,s);a&&e.push(a)}return e}async function aa(t){const e=await os(re),s=[];for(const a of e)if(!a.startsWith("auto-offline-")&&a.startsWith(`${t}:`)){const{chapterNum:n}=Xn(a);s.push(n)}return s}async function ar(){if(navigator.storage&&navigator.storage.estimate){const t=await navigator.storage.estimate();return{used:t.usage||0,quota:t.quota||0,usedMB:((t.usage||0)/(1024*1024)).toFixed(1),quotaMB:((t.quota||0)/(1024*1024)).toFixed(0)}}return{used:0,quota:0,usedMB:"0",quotaMB:"Unknown"}}async function nr(){const t=await tt();await new Promise((e,s)=>{const r=t.transaction(De,"readwrite").objectStore(De).clear();r.onsuccess=e,r.onerror=s}),await new Promise((e,s)=>{const r=t.transaction(re,"readwrite").objectStore(re).clear();r.onsuccess=e,r.onerror=s})}async function rr(t,e){e?await jt(re,`auto-offline-${t}`,{enabled:!0,mangaId:t}):await zt(re,`auto-offline-${t}`)}async function ir(t){const e=await Fe(re,`auto-offline-${t}`);return!!(e!=null&&e.enabled)}async function or(){return(await os(re)).filter(e=>e.startsWith("auto-offline-")).map(e=>e.replace("auto-offline-",""))}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",async t=>{var e;if(((e=t.data)==null?void 0:e.type)==="sync-offline"){const s=t.data.mangaId;console.log(`[Offline] Auto-sync triggered for manga ${s}`);try{await na(s)}catch(a){console.error("[Offline] Auto-sync failed:",a)}}});async function na(t){try{const e=await m.getBookmark(t);if(!e)return;const s=e.downloadedChapters||[],a=await aa(t),n=s.filter(r=>!a.includes(r));console.log(`[Offline] ${n.length} new chapters to sync for ${e.alias||e.title}`);for(const r of n)await cs(t,r),console.log(`[Offline] Auto-synced chapter ${r}`)}catch(e){console.error("[Offline] Sync error:",e)}}const lr={saveChapterOffline:cs,getOfflineChapter:Zn,deleteOfflineChapter:sa,refreshOfflineChapter:er,isChapterOffline:tr,getOfflineChapters:sr,getOfflineChaptersForManga:aa,getStorageUsage:ar,clearAllOfflineData:nr,setAutoOffline:rr,isAutoOffline:ir,getAutoOfflineManga:or,syncNewChaptersForManga:na};let i={manga:null,chapter:null,versionUrl:null,images:[],trophyPages:{},mode:"manga",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!0,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null,isStreamingMode:!1,_streamAbortController:null};function ds(t,e=i.manga){if(!t||!e)return"";const s=(e.chapters||[]).find(n=>n.url===t),a=[];return s&&(s.releaseGroup?a.push(s.releaseGroup):s.title&&s.title!==`Chapter ${s.number}`&&a.push(s.title)),t.startsWith("local://")&&a.push("Local"),a.join(" · ")}function us(t){var s,a;const e=(a=(s=i.manga)==null?void 0:s.downloadedVersions)==null?void 0:a[t];return Array.isArray(e)?e:e?[e]:[]}function cr(){var e;const t=us((e=i.chapter)==null?void 0:e.number);return t.length<2||!i.versionUrl?"":ds(i.versionUrl)||`Version ${t.indexOf(i.versionUrl)+1}`}function ra(){if(!i.manga||!i.chapter||!i.allFavorites||!i.allFavorites.favorites)return!1;if(i.isCollectionMode)return!0;let e=[Wt()];if(i.mode==="manga"&&!i.singlePageMode){const n=ae()[i.currentPage];n&&Array.isArray(n)?e=n:n&&n.pages&&(e=n.pages)}const s=e.map(a=>{const n=Ze(i.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in i.allFavorites.favorites){const n=i.allFavorites.favorites[a];if(Array.isArray(n)){for(const r of n)if(r.mangaId===i.manga.id&&r.chapterNum===i.chapter.number&&r.imagePaths)for(const o of r.imagePaths){const c=typeof o=="string"?o:(o==null?void 0:o.filename)||(o==null?void 0:o.path);for(const l of s)if(l&&l.filename===c)return!0}}}return!1}function Qt(){const t=document.getElementById("favorites-btn");t&&(ra()?t.classList.add("active"):t.classList.remove("active"))}function qe(){var f;if(i.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!i.manga||!i.images.length&&!i.isStreamingMode)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const t=i.manga.alias||i.manga.title,e=(f=i.chapter)==null?void 0:f.number,s=i.isCollectionMode||i.isStreamingMode?"":cr(),a=!i.isCollectionMode&&!i.isStreamingMode&&us(e).length>1,r=ae().length,o=i.images.length;let c,l;i.mode==="webtoon"?(c=o-1,l=`${o} pages`):i.singlePageMode?(c=o-1,l=`${i.currentPage+1} / ${o}`):(c=r-1,l=`${i.currentPage+1} / ${r}`);const u=ra(),h=ca();return`
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
          <button class="reader-bar-btn ${u?"active":""}" id="favorites-btn" title="Add to favorites">${p("star",{title:"Add to favorites"})}</button>

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
            <button class="reader-bar-btn ${h?"active":""}" id="trophy-btn" title="${h?"Unmark trophy":"Mark as trophy"}">${p("trophy")}</button>
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
        ${i.isCollectionMode?ia():i.mode==="webtoon"?oa():la()}
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
  `}function ia(){const t=i.mode==="manga";if(t&&!i.singlePageMode){const e=i.images[i.currentPage];if(!e)return"";const s=e.urls||[e.url],a=e.displayMode||"single";return e.displaySide,a==="double"&&s.length>=2?`
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
  `}function oa(){return`
    <div class="webtoon-pages">
      ${i.images.map((t,e)=>{const s=typeof t=="string"?t:t.url,a=i.trophyPages[e];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${e}">
          ${a?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
          <img src="${s}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function la(){if(i.singlePageMode)return dr();const e=ae()[i.currentPage];if(!e)return"";if(e.type==="link"){const s=e.pages[0],a=i.images[s],n=typeof a=="string"?a:a.url,r=i.trophyPages[s];return`
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
  `}function dr(){const t=i.currentPage,e=i.trophyPages[t];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[r,o]=e.pages,c=i.images[r],l=i.images[o],u=typeof c=="string"?c:c==null?void 0:c.url,h=typeof l=="string"?l:l==null?void 0:l.url;if(u&&h)return`
            <div class="manga-spread ${i.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">${p("trophy")}</div><img src="${u}" alt="Page ${r+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">${p("trophy")}</div><img src="${h}" alt="Page ${o+1}"></div>
            </div>
            `}const s=i.images[t];if(!s)return"";const a=typeof s=="string"?s:s.url,n=i.trophyPages[t];return`
    <div class="manga-spread single ${i.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
        <img src="${a}" alt="Page ${t+1}">
      </div>
    </div>
  `}function ae(){const t=[],e=i.images.length;let s=0;if(i.isCollectionMode){for(let n=0;n<e;n++)t.push([n]);return t}let a=!i.firstPageSingle;for(;s<e;){const n=i.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[r,o]=n.pages;t.push([r,o]),s=Math.max(r,o)+1}else t.push([s]),s++;continue}if(!a){a=!0,t.push([s]),s++;continue}if(i.lastPageSingle&&s===e-1){i.nextChapterImage?t.push({type:"link",pages:[s],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):t.push([s]),s++;break}s+1<e?i.trophyPages[s+1]?(t.push([s]),s++):i.lastPageSingle&&s+1===e-1?(t.push([s]),i.nextChapterImage?t.push({type:"link",pages:[s+1],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):t.push([s+1]),s+=2):(t.push([s,s+1]),s+=2):(t.push([s]),s++)}return t}function ca(){if(i.singlePageMode)return!!i.trophyPages[i.currentPage];const e=ae()[i.currentPage];return e?(Array.isArray(e)?e:e.pages||[]).some(a=>!!i.trophyPages[a]):!1}function hs(){if(i.singlePageMode)return[i.currentPage];const e=ae()[i.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function ur(){if(!i.manga||!i.chapter||i.isCollectionMode)return;const t=hs();if(t.length===0)return;if(t.some(s=>!!i.trophyPages[s])){const s=[...t];if(i.singlePageMode){const a=i.trophyPages[i.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete i.trophyPages[a]),d(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=t,a=i.singlePageMode||t.length===1;if(!i.singlePageMode&&t.length===2){const r=await ga(t,"Mark as trophy");if(!r)return;s=r.pages,a=r.pages.length===1}s.forEach(r=>{i.trophyPages[r]={isSingle:a,pages:[...s]}});const n=a?"single":"double";d(`Page${s.length>1?"s":""} marked as trophy (${n})`,"success")}try{await m.saveTrophyPages(i.manga.id,i.chapter.number,i.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}xe(),da()}function da(){const t=document.getElementById("trophy-btn");if(t){const e=ca();t.classList.toggle("active",e),t.title=e?"Unmark trophy":"Mark as trophy"}}function ua(){if(!i.manga||!i.chapter||i.isCollectionMode||i.isStreamingMode||!i.images.length)return null;const t=i.images.length;let e=1,s=!1;if(i.mode==="manga"){const a=hs();a.length>0&&(e=Math.min(...a)+1),s=a.includes(t-1)}else{const a=document.getElementById("reader-content");if(a){const n=[...a.querySelectorAll("img")],r=a.scrollTop;let o=0;n.forEach((u,h)=>{r>=o&&(e=h+1),o+=u.offsetHeight});const c=a.scrollHeight>a.clientHeight+10,l=n.length>0&&n.every(u=>u.complete&&u.naturalHeight>0);s=c?r+a.clientHeight>=a.scrollHeight-4:l}}return s&&(e=t),{mangaId:i.manga.id,chapterNumber:i.chapter.number,currentPage:e,totalPages:t}}async function Ne(t=ua()){var e;if(!(!t||Y.isDemo))try{if(await m.updateReadingProgress(t.mangaId,t.chapterNumber,t.currentPage,t.totalPages),t.currentPage>=t.totalPages&&((e=i.manga)==null?void 0:e.id)===t.mangaId){const s=new Set(i.manga.readChapters||[]);s.add(t.chapterNumber),i.manga.readChapters=[...s]}}catch(s){console.error("Failed to save progress:",s)}}let Pe=null;function ha(){Pe&&clearTimeout(Pe),Pe=setTimeout(()=>{Pe=null,Ne()},1500)}function vt(){var s,a,n,r,o,c,l,u,h,f,y,E,S,v,I,w,A,N,F,O,j;const t=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{i.isStreamingMode||(await Ne(),await Be()),i.isStreamingMode?D.go("/scrapers"):i.manga&&i.manga.id!=="gallery"?D.go(`/manga/${i.manga.id}`):D.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{D.go(i.isStreamingMode?"/scrapers":"/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var b;(b=document.getElementById("reader-settings"))==null||b.classList.toggle("hidden")}),(r=document.getElementById("close-settings-btn"))==null||r.addEventListener("click",()=>{var b;(b=document.getElementById("reader-settings"))==null||b.classList.add("hidden")}),(o=document.getElementById("single-page-btn"))==null||o.addEventListener("click",()=>{if(i.singlePageMode){const b=ae();let x=0;for(let P=0;P<b.length;P++)if(b[P].includes(i.currentPage)){x=P;break}i.singlePageMode=!1,i.currentPage=x}else{const x=ae()[i.currentPage];i.singlePageMode=!0,i.currentPage=x?x[0]:0}localStorage.setItem("reader_single_page",i.singlePageMode?"1":"0"),Ue()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{ur()}),t.querySelectorAll("[data-mode]").forEach(b=>{b.addEventListener("click",()=>{var z,Z;const x=b.dataset.mode;let P=Wt();if(i.mode=x,localStorage.setItem("reader_mode",i.mode),x==="webtoon")i.currentPage=P;else if(i.singlePageMode)i.currentPage=P;else{const K=ae();let k=0;for(let L=0;L<K.length;L++)if(K[L].includes(P)){k=L;break}i.currentPage=k}(z=i.manga)!=null&&z.id&&((Z=i.chapter)!=null&&Z.number)&&Be(),Ue(),x==="webtoon"&&setTimeout(()=>{const K=document.getElementById("reader-content");if(K){const k=K.querySelectorAll("img");k[P]&&k[P].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),t.querySelectorAll("[data-direction]").forEach(b=>{b.addEventListener("click",async()=>{var x,P;i.direction=b.dataset.direction,localStorage.setItem("reader_direction",i.direction),(x=i.manga)!=null&&x.id&&((P=i.chapter)!=null&&P.number)&&await Be(),Ue()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async b=>{i.firstPageSingle=b.target.checked,await Be(),xe()}),(u=document.getElementById("last-page-single"))==null||u.addEventListener("change",async b=>{var x,P;i.lastPageSingle=b.target.checked,await Be(),i.lastPageSingle&&((x=i.manga)!=null&&x.id)&&((P=i.chapter)!=null&&P.number)?await pa():(i.nextChapterImage=null,i.nextChapterNum=null),xe()}),(h=document.getElementById("zoom-slider"))==null||h.addEventListener("input",b=>{i.zoom=parseInt(b.target.value);const x=document.getElementById("reader-content");x&&(x.style.zoom=`${i.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",b=>{const x=parseInt(b.target.value),P=document.getElementById("page-indicator");P&&(i.singlePageMode?P.textContent=`${x+1} / ${i.images.length}`:P.textContent=`${x+1} / ${ae().length}`)}),e.addEventListener("change",b=>{i.currentPage=parseInt(b.target.value),xe()})),i.mode==="manga"){const b=document.getElementById("reader-content");b==null||b.addEventListener("click",x=>{var K;if(x.target.closest("button, a, .link-overlay"))return;const P=b.getBoundingClientRect(),Z=(x.clientX-P.left)/P.width;Z<.3?Gt():Z>.7?ct():(i.showControls=!i.showControls,(K=document.querySelector(".reader"))==null||K.classList.toggle("controls-hidden",!i.showControls))})}document.addEventListener("keydown",fa),(f=document.getElementById("prev-chapter-btn"))==null||f.addEventListener("click",()=>yt(-1)),(y=document.getElementById("next-chapter-btn"))==null||y.addEventListener("click",()=>yt(1)),i.mode==="webtoon"&&((E=document.getElementById("reader-content"))==null||E.addEventListener("click",()=>{var b;i.showControls=!i.showControls,(b=document.querySelector(".reader"))==null||b.classList.toggle("controls-hidden",!i.showControls)}),(S=document.getElementById("reader-content"))==null||S.addEventListener("scroll",ha,{passive:!0})),(v=document.getElementById("rotate-btn"))==null||v.addEventListener("click",async()=>{const b=Mt();if(!(!b||!i.manga||!i.chapter))try{d("Rotating...","info");const x=await m.rotatePage(i.manga.id,i.chapter.number,b,90,i.versionUrl);x.images&&(await Tt(x.images),d("Page rotated","success"))}catch(x){d("Rotate failed: "+x.message,"error")}}),(I=document.getElementById("swap-btn"))==null||I.addEventListener("click",async()=>{const x=ae()[i.currentPage];if(!x||x.length!==2||!i.manga||!i.chapter){d("Select a spread with 2 pages to swap","info");return}const P=Ze(i.images[x[0]]),z=Ze(i.images[x[1]]);if(!(!P||!z))try{d("Swapping...","info");const Z=await m.swapPages(i.manga.id,i.chapter.number,P,z,i.versionUrl);Z.images&&(await Tt(Z.images),d("Pages swapped","success"))}catch(Z){d("Swap failed: "+Z.message,"error")}}),(w=document.getElementById("split-btn"))==null||w.addEventListener("click",async()=>{const b=Mt();if(!b||!i.manga||!i.chapter||!confirm("Split this page into halves? This is permanent."))return;const x=document.getElementById("split-btn");try{d("Preparing to split...","info"),x&&(x.disabled=!0),i.images=[],i.loading=!0,t.innerHTML=qe(),await new Promise(z=>setTimeout(z,2e3)),d("Splitting page...","info");const P=await m.splitPage(i.manga.id,i.chapter.number,b,i.versionUrl);x&&(x.disabled=!1),await Me(i.manga.id,i.chapter.number,i.versionUrl),t.innerHTML=qe(),vt(),xe(),P.warning?d(P.warning,"warning"):d("Page split into halves","success")}catch(P){x&&(x.disabled=!1),d("Split failed: "+P.message,"error"),await Me(i.manga.id,i.chapter.number,i.versionUrl),t.innerHTML=qe(),vt()}}),(A=document.getElementById("delete-page-btn"))==null||A.addEventListener("click",async()=>{const b=Mt();if(!(!b||!i.manga||!i.chapter)&&confirm(`Delete page "${b}" permanently? This cannot be undone.`))try{d("Deleting...","info");const x=await m.deletePage(i.manga.id,i.chapter.number,b,i.versionUrl);x.images&&(await Tt(x.images),d("Page deleted","success"))}catch(x){d("Delete failed: "+x.message,"error")}}),(N=document.getElementById("favorites-btn"))==null||N.addEventListener("click",async()=>{try{const P=await m.getFavorites();i.allFavorites=P,i.favoriteLists=Object.keys(P.favorites||P||{})}catch(P){console.error("Failed to load favorites",P),d("Failed to load favorites","error");return}let x=[Wt()];if(i.mode==="manga"&&!i.singlePageMode){const z=ae()[i.currentPage];z&&Array.isArray(z)?x=z:z&&z.pages&&(x=z.pages)}if(x.length>1){const P=await ga(x,"Select Page for Favorites");if(!P)return;x=P.pages}gr(x)}),(F=document.getElementById("version-btn"))==null||F.addEventListener("click",()=>{pr()}),(O=document.getElementById("fullscreen-btn"))==null||O.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{d("Fullscreen not supported","info")})}),(j=document.getElementById("stream-add-lib-btn"))==null||j.addEventListener("click",async()=>{var P;const b=document.getElementById("stream-add-lib-btn");if(!((P=i.manga)!=null&&P._streamUrl)){d("No URL to add","error");return}const x=b.innerHTML;b.innerHTML=p("loader",{spin:!0}),b.disabled=!0;try{const z=await m.addBookmark(i.manga._streamUrl);if(!z.jobId)throw new Error("No job ID returned");d("Adding to library...","info");const Z=setInterval(async()=>{var K;try{const L=(await m.getQueueHistory(20)).find(M=>M.id===z.jobId);L&&(L.status==="completed"?(clearInterval(Z),(K=L.result)!=null&&K.bookmark&&(d("Added to library!","success"),b.innerHTML=p("check"),b.title="Added! Click to view",b.disabled=!1,b.onclick=()=>{D.go(`/manga/${L.result.bookmark.id}`)})):L.status==="failed"&&(clearInterval(Z),d("Failed to add: "+(L.error||"Unknown error"),"error"),b.innerHTML=x,b.disabled=!1))}catch{}},1500)}catch(z){d("Failed to add: "+z.message,"error"),b.innerHTML=x,b.disabled=!1}}),document.body.classList.add("reader-active")}function Ze(t){var n;const e=typeof t=="string"?t:(t==null?void 0:t.url)||((n=t==null?void 0:t.urls)==null?void 0:n[0]);if(!e)return null;const a=e.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function Mt(){const t=hs();return t.length===0?null:Ze(i.images[t[0]])}async function Tt(t){var s,a;(s=i.manga)!=null&&s.id&&((a=i.chapter)!=null&&a.number)&&!i.isStreamingMode&&lr.refreshOfflineChapter(i.manga.id,i.chapter.number).then(n=>{n&&console.log("[Reader] Refreshed offline copy after page edit")}).catch(n=>console.warn("[Reader] Offline refresh failed:",n));const e=Date.now();if(i.images=t.map(n=>{const r=typeof n=="string"?n:n==null?void 0:n.url;if(!r)return n;const o=r+(r.includes("?")?"&":"?")+`_t=${e}`;return typeof n=="string"?o:{...n,url:o}}),i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.min(i.currentPage,i.images.length-1);else{const n=ae();i.currentPage=Math.min(i.currentPage,n.length-1)}i.currentPage=Math.max(0,i.currentPage),xe()}async function pa(){var t,e;if(!(!((t=i.manga)!=null&&t.id)||!((e=i.chapter)!=null&&e.number)))try{const s=await m.getNextChapterPreview(i.manga.id,i.chapter.number);i.nextChapterImage=s.firstImage||null,i.nextChapterNum=s.nextChapter||null}catch{i.nextChapterImage=null,i.nextChapterNum=null}}async function hr(){var r,o;if(!((r=i.manga)!=null&&r.id)||!((o=i.chapter)!=null&&o.number)||i.isCollectionMode)return;const e=[...i.manga.downloadedChapters||[]].sort((c,l)=>c-l),s=e.indexOf(i.chapter.number);if(s<0||s>=e.length-1)return;const a=e[s+1],n=i.manga.id;if(!(i._preloadCache&&i._preloadCache.chapterNum===a&&i._preloadCache.mangaId===n))try{const l=(i.manga.downloadedVersions||{})[a]||[],u=Array.isArray(l)?l[0]:l,h=u?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(u)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,y=(await m.get(h)).images||[];if(y.length===0)return;const E=y.map(S=>{const v=new Image,I=typeof S=="string"?S:S.url;return I&&(v.src=I),v});i._preloadCache={chapterNum:a,mangaId:n,images:y,imageObjects:E,versionUrl:u},console.log(`[Reader] Preloaded ${y.length} images for chapter ${a}`)}catch(c){console.warn("[Reader] Failed to preload next chapter:",c)}}function ma(t,e,s=i.manga,a=[],n={}){return new Promise(r=>{const o=document.createElement("div");o.className="version-modal-overlay",o.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${t.length} versions</h3>
                <p>${n.allowKeep?"Switch version, or keep one and delete the rest:":"Select which version to read:"}</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const c=o.querySelector(".version-list");t.forEach((l,u)=>{const h=document.createElement("button");h.className="version-item";const f=n.current&&n.current===l;f&&h.classList.add("current");const y=(ds(l,s)||`Version ${u+1}`)+(f?" (reading)":""),E=a.find(w=>w.url===l),S=[];if(E!=null&&E.imageCount&&S.push(`${E.imageCount} pages`),E!=null&&E.folder&&S.push(E.folder),h.innerHTML=`<span class="version-item-title"></span>${S.length?'<span class="version-item-meta"></span>':""}`,h.querySelector(".version-item-title").textContent=y,S.length&&(h.querySelector(".version-item-meta").textContent=S.join(" · ")),h.title=l,h.addEventListener("click",()=>{o.remove(),r(l)}),!n.allowKeep){c.appendChild(h);return}const v=document.createElement("div");v.className="version-item-row",v.appendChild(h);const I=document.createElement("button");I.className="version-item-keep",I.textContent="Keep only",I.title="Delete every other downloaded version of this chapter",I.addEventListener("click",()=>{o.remove(),r({keep:l})}),v.appendChild(I),c.appendChild(v)}),o.querySelector(".version-cancel").addEventListener("click",()=>{o.remove(),r(null)}),o.addEventListener("click",l=>{l.target===o&&(o.remove(),r(null))}),document.body.appendChild(o)})}async function pr(){if(!i.manga||!i.chapter||i.isCollectionMode||i.isStreamingMode)return;const t=i.chapter.number,e=us(t);if(e.length<2)return;let s=[];try{s=(await m.getChapterVersions(i.manga.id,t)).versions||[]}catch{}const a=await ma(e,t,i.manga,s,{current:i.versionUrl,allowKeep:!0});if(a){if(typeof a=="string"){a!==i.versionUrl&&(await Ne(),D.go(`/read/${i.manga.id}/${t}?version=${encodeURIComponent(a)}`));return}a.keep&&await mr(t,a.keep,e)}}async function mr(t,e,s){var c;const a=s.filter(l=>l!==e),n=ds(e)||"this version";if(!confirm(`Keep only "${n}" and delete the other ${a.length} downloaded version${a.length>1?"s":""} of chapter ${t}?`))return;const r=i.manga.id;let o=0;for(const l of a)try{await m.deleteChapterVersion(r,t,l)}catch(u){o++,d("Failed to delete a version: "+u.message,"error")}o===0&&d("Other versions deleted","success");try{const l=await m.getBookmark(r);((c=i.manga)==null?void 0:c.id)===r&&(i.manga=l)}catch{}e!==i.versionUrl?D.go(`/read/${r}/${t}?version=${encodeURIComponent(e)}`):Ue()}function gr(t){if(!i.manga||!i.chapter)return;const e=t.map(l=>{const u=Ze(i.images[l]);return u?{filename:u}:null}).filter(Boolean),s=l=>{if(!i.allFavorites||!i.allFavorites.favorites)return-1;const u=i.allFavorites.favorites[l];if(!Array.isArray(u))return-1;for(let h=0;h<u.length;h++){const f=u[h];if(f.mangaId===i.manga.id&&f.chapterNum===i.chapter.number&&f.imagePaths)for(const y of f.imagePaths){const E=typeof y=="string"?y:(y==null?void 0:y.filename)||(y==null?void 0:y.path);for(const S of e)if(S&&S.filename===E)return h}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";i.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',i.favoriteLists.forEach(l=>{const h=s(l)!==-1;n+=`
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
    `;const r=document.createElement("style");r.innerHTML=`
        .list-option.active-list {
            background: #2a3b2a;
            border-color: #4CAF50;
        }
        .list-option.active-list:hover {
            background: #384d38;
        }
    `,a.appendChild(r),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),Qt()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),Qt())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const u=l.dataset.list,h=s(u),f=h!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(f){await m.removeFavoriteItem(u,h);const y=await m.getFavorites();i.allFavorites=y,l.classList.remove("active-list"),l.querySelector("span:last-child").innerHTML=p("plus")}else{const y=t.length>1?"double":"single",E={mangaId:i.manga.id,chapterNum:i.chapter.number,title:`${i.manga.alias||i.manga.title} Ch.${i.chapter.number} p${t[0]+1}`,imagePaths:e,displayMode:y,displaySide:i.direction==="rtl"?"right":"left"};await m.addFavoriteItem(u,E);const S=await m.getFavorites();i.allFavorites=S,l.classList.add("active-list"),l.querySelector("span:last-child").innerHTML=p("check")}}catch(y){console.error(y)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function ga(t,e){return new Promise(s=>{const[a,n]=t,r=i.images[a],o=i.images[n],c=typeof r=="string"?r:r==null?void 0:r.url,l=typeof o=="string"?o:o==null?void 0:o.url,u=i.direction==="rtl",h=u?n:a,f=u?a:n,y=u?l:c,E=u?c:l,S=document.createElement("div");S.className="page-picker-overlay",S.innerHTML=`
            <div class="page-picker-modal">
                <h3>${e}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${h+1}">
                        <img src="${y}" alt="Page ${h+1}">
                        <span class="page-picker-label">Page ${h+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${f+1}">
                        <img src="${E}" alt="Page ${f+1}">
                        <span class="page-picker-label">Page ${f+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    ${p("columns-2")} Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const v=I=>{S.remove(),s(I)};S.querySelectorAll(".page-picker-option").forEach(I=>{I.addEventListener("click",()=>{const w=I.dataset.choice;w==="left"?v({pages:[h]}):w==="right"?v({pages:[f]}):w==="both"&&v({pages:t})})}),S.querySelector(".page-picker-cancel").addEventListener("click",()=>v(null)),S.addEventListener("click",I=>{I.target===S&&v(null)}),document.body.appendChild(S)})}function Wt(){if(i.mode==="webtoon"){const t=document.getElementById("reader-content");if(t){const e=t.querySelectorAll("img");if(e.length>0){const s=t.scrollTop;if(s>10){let a=0;for(let n=0;n<e.length;n++){const r=e[n].offsetHeight;if(a+r>s)return n;a+=r}}}}return 0}else{if(i.singlePageMode)return i.currentPage;{const e=ae()[i.currentPage];return e&&e.length>0?e[0]:0}}}function fa(t){var e;if(!(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA")){if(t.key==="Escape"){const s=(e=i.manga)==null?void 0:e.id;Promise.all([Ne(),Be()]).finally(()=>{s&&D.go(`/manga/${s}`)});return}if(i.mode==="manga")t.key==="ArrowLeft"?i.direction==="rtl"?ct():Gt():t.key==="ArrowRight"?i.direction==="rtl"?Gt():ct():t.key===" "&&(t.preventDefault(),ct());else if(i.mode==="webtoon"&&t.key===" "){t.preventDefault();const s=document.getElementById("reader-content");if(s){const a=s.clientHeight*.8;s.scrollBy({top:t.shiftKey?-a:a,behavior:"smooth"})}}}}function ct(){const t=ae(),e=i.singlePageMode?i.images.length-1:t.length-1;if(i.currentPage<e)i.currentPage++,xe();else{const s=t[i.currentPage],a=s&&s.type==="link";Ne(),a&&(i.navigationDirection="next-linked"),yt(1)}}function Gt(){i.currentPage>0?(i.currentPage--,xe()):yt(-1)}function xe(){const t=document.getElementById("reader-content");if(t){t.innerHTML=i.isCollectionMode?ia():i.mode==="webtoon"?oa():la();const e=document.getElementById("page-indicator");e&&(i.singlePageMode?e.textContent=`${i.currentPage+1} / ${i.images.length}`:e.textContent=`${i.currentPage+1} / ${ae().length}`);const s=document.getElementById("page-slider");s&&(s.value=i.currentPage,s.max=i.singlePageMode?i.images.length-1:ae().length-1),da(),Qt(),i.mode==="manga"&&ha()}}function Ue(){const t=document.getElementById("app");t&&(t.innerHTML=qe(),vt())}async function yt(t){if(console.log("[Nav] navigateChapter called with delta:",t),i.isStreamingMode)return;if(!i.manga||!i.chapter){console.log("[Nav] early return - no manga or chapter");return}await Ne(),await Be();const s=[...i.manga.downloadedChapters||[]].sort((r,o)=>r-o),a=s.indexOf(i.chapter.number),n=a+t;if(console.log("[Nav]",{delta:t,chapterNumber:i.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length){i.navigationDirection||(i.navigationDirection=t<0?"prev":null);const r=s[n],c=(i.manga.downloadedVersions||{})[r]||[],l=Array.isArray(c)?c[0]:c,u=l?`?version=${encodeURIComponent(l)}`:"";console.log("[Nav] Calling router.go with:",`/read/${i.manga.id}/${r}${u}`),D.go(`/read/${i.manga.id}/${r}${u}`)}else d(t>0?"Last chapter":"First chapter","info")}async function Me(t,e,s){var a,n,r,o,c;console.log("[Reader] loadData called:",{mangaId:t,chapterNum:e,versionUrl:s});try{if(i.mode=localStorage.getItem("reader_mode")||"manga",i.direction=localStorage.getItem("reader_direction")||"rtl",i.singlePageMode=localStorage.getItem("reader_single_page")!=="0",i.firstPageSingle=!0,i.lastPageSingle=!1,i.versionUrl=null,t==="gallery"){const l=decodeURIComponent(e),h=((a=(await m.getFavorites()).favorites)==null?void 0:a[l])||[];i.images=[];for(const f of h){const y=f.imagePaths||[],E=[];for(const S of y){let v;typeof S=="string"?v=S:S&&typeof S=="object"&&(v=S.filename||S.path||S.name||S.url,v&&v.includes("/")&&(v=v.split("/").pop()),v&&v.includes("\\")&&(v=v.split("\\").pop())),v&&E.push(`/api/public/chapter-images/${f.mangaId}/${f.chapterNum}/${encodeURIComponent(v)}`)}E.length>0&&i.images.push({urls:E,displayMode:f.displayMode||"single",displaySide:f.displaySide||"left"})}i.manga={id:"gallery",title:l,alias:l},i.chapter={number:"Gallery"},i.isGalleryMode=!0,i.isCollectionMode=!0,i.images.length===0&&d("Gallery is empty","warning")}else if(t==="trophies"){const l=e;let u=[],h="Trophies";if(l.startsWith("series-")){const f=l.replace("series-",""),E=(await store.loadSeries()).find(I=>I.id===f);h=E?E.alias||E.title:"Series Trophies";const v=(await store.loadBookmarks()).filter(I=>I.seriesId===f);for(const I of v){const w=await m.getTrophyPagesAll(I.id);for(const A in w)for(const N in w[A]){const F=w[A][N],j=(await m.getChapterImages(I.id,A)).images[N],b=typeof j=="string"?j.split("/").pop():(j==null?void 0:j.filename)||(j==null?void 0:j.path);u.push({mangaId:I.id,chapterNum:A,imagePaths:[{filename:b}],displayMode:F.isSingle?"single":"double",displaySide:"left"})}}}else{const f=await m.getBookmark(l);h=f?f.alias||f.title:"Manga Trophies";const y=await m.getTrophyPagesAll(l);for(const E in y)for(const S in y[E]){const v=y[E][S],w=(await m.getChapterImages(l,E)).images[S],A=typeof w=="string"?w.split("/").pop():(w==null?void 0:w.filename)||(w==null?void 0:w.path);u.push({mangaId:l,chapterNum:E,imagePaths:[{filename:decodeURIComponent(A)}],displayMode:v.isSingle?"single":"double",displaySide:"left"})}}i.images=u.map(f=>{const y=f.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${f.mangaId}/${f.chapterNum}/${encodeURIComponent(y)}`],displayMode:f.displayMode,displaySide:f.displaySide}}),i.manga={id:"trophies",title:h,alias:h},i.chapter={number:"🏆"},i.isCollectionMode=!0,i.isGalleryMode=!1}else if(t==="stream"){i.isStreamingMode=!0,i.isCollectionMode=!1,i.isGalleryMode=!1,i.singlePageMode=!0;const l=sessionStorage.getItem("streamPreviewUrl"),u=sessionStorage.getItem("streamPreviewScraper"),h=sessionStorage.getItem("streamPreviewTitle")||"Preview";i.manga={id:"stream",title:h,alias:h,_streamUrl:l},i.chapter={number:1},i.images=[],l?fr(l,u):d("No stream URL found","error")}else{i.isGalleryMode=!1;const l=await m.getBookmark(t);i.manga=l,console.log("[Reader] manga loaded, finding chapter..."),i.chapter=((n=l.chapters)==null?void 0:n.find(h=>h.number===parseFloat(e)))||{number:parseFloat(e)};const u=parseFloat(e);if(i._preloadCache&&i._preloadCache.mangaId===t&&i._preloadCache.chapterNum===u)console.log("[Reader] Using preloaded images for chapter",e),i.images=i._preloadCache.images||[],i.versionUrl=s||i._preloadCache.versionUrl||null,i._preloadCache=null;else{i.versionUrl=s||null;const h=s?`/bookmarks/${t}/chapters/${e}/reader-images?version=${encodeURIComponent(s)}`:`/bookmarks/${t}/chapters/${e}/reader-images`,f=await m.get(h);console.log("[Reader] images loaded, count:",(r=f.images)==null?void 0:r.length),i.images=f.images||[]}try{const h=await m.getChapterSettings(t,e);if(As(h))_s(h);else try{const y=[...i.manga.downloadedChapters||[]].sort((w,A)=>w-A),E=parseFloat(e),S=y.indexOf(E),v=[];if(S!==-1){for(let w=S-1;w>=0;w--)v.push(y[w]);for(let w=S+1;w<y.length;w++)v.push(y[w])}const I=12;for(const w of v.slice(0,I)){const A=await m.getChapterSettings(t,w);if(As(A)){_s(A),console.log("[Reader] Inherited settings from chapter",w);break}}}catch(f){console.warn("Failed to inherit chapter settings",f)}}catch(h){console.warn("Failed to load chapter settings",h)}try{const h=await m.getTrophyPages(t,e);i.trophyPages=h||{}}catch(h){console.warn("Failed to load trophy pages",h)}try{const h=await m.getFavorites();i.allFavorites=h,i.favoriteLists=Object.keys(h.favorites||h||{})}catch(h){console.warn("Failed to load favorites",h)}}if(i.isStreamingMode)i.currentPage=0;else{const l=parseFloat(e),u=(c=(o=i.manga)==null?void 0:o.readingProgress)==null?void 0:c[l];if(u&&u.page<u.totalPages)if(i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,u.page-1);else{const h=Math.max(0,u.page-1),f=ae();let y=0;for(let E=0;E<f.length;E++){const S=f[E],v=Array.isArray(S)?S:S.pages||[];if(v.includes(h)||v[0]>=h){y=E;break}y=E}i.currentPage=y}else i.currentPage=0,i._resumeScrollToPage=u.page-1;else i.currentPage=0}}catch(l){console.error("Error loading chapter:",l),d("Failed to load chapter","error")}if(!i.isStreamingMode){if(i.navigationDirection==="prev"&&i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,i.images.length-1);else{const l=ae();i.currentPage=Math.max(0,l.length-1)}else if(i.navigationDirection==="next-linked"&&i.mode==="manga"&&i.images.length>1)if(i.singlePageMode)i.currentPage=1;else{const l=ae();let u=0;for(let h=0;h<l.length;h++){const f=l[h];if((Array.isArray(f)?f:f.pages||[]).includes(1)){u=h;break}}i.currentPage=u}}i.navigationDirection=null,i.lastPageSingle&&!i.isStreamingMode&&await pa(),i.loading=!1,Ue(),i.isStreamingMode||hr(),i.mode==="webtoon"&&i._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const u=l.querySelectorAll("img");u[i._resumeScrollToPage]&&u[i._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete i._resumeScrollToPage},300)}async function fr(t,e){i._streamAbortController&&i._streamAbortController.abort(),i._streamAbortController=new AbortController;const{signal:s}=i._streamAbortController;try{let a="/api/scrapers/preview-images-stream?";e&&(a+=`scraper=${encodeURIComponent(e)}&`),a+=`url=${encodeURIComponent(t)}`;const n=localStorage.getItem("manga_auth_token"),r={};n&&(r.Authorization=`Bearer ${n}`),console.log("[Reader] Starting stream from:",a);const o=await fetch(a,{headers:r,signal:s});if(!o.ok)throw new Error(`Failed to start stream: ${o.statusText}`);const c=o.body.getReader(),l=new TextDecoder;let u="";for(;;){const{value:h,done:f}=await c.read();if(f||s.aborted)break;u+=l.decode(h,{stream:!0});const y=u.split(`

`);u=y.pop();let E=!1;for(const S of y)if(S.startsWith("data: ")){const v=S.substring(6);try{const I=JSON.parse(v);if(I.type==="metadata")i.manga.title=I.title,i.manga.alias=I.title,Ue();else if(I.type==="image"){const w=`/api/scrapers/proxy-cover?url=${encodeURIComponent(I.url)}`;i.images.push(w),E=!0}else if(I.type==="error")d("Stream error: "+I.message,"error");else if(I.type==="done")break}catch(I){console.error("Parse error for SSE data:",I)}}E&&xe()}}catch(a){a.name!=="AbortError"&&(console.error("Preview stream error:",a),d("Stream failed: "+a.message,"error"))}finally{i._streamAbortController&&i._streamAbortController.signal===s&&(i._streamAbortController=null)}}async function vr(t=[]){console.log("[Reader] mount called with params:",t);let[e,s]=t,a=null;if(s&&s.includes("?")){const[r,o]=s.split("?");s=r,a=new URLSearchParams(o).get("version")}else{const r=window.location.hash.split("?")[1];r&&(a=new URLSearchParams(r).get("version"))}if(console.log("[Reader] mangaId:",e,"chapterNum:",s,"urlVersion:",a),!e||!s){D.go("/");return}const n=document.getElementById("app");if(i.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),i.images=[],i.singlePageMode=!1,i._resumeScrollToPage=null,i.nextChapterImage=null,i.nextChapterNum=null,n.innerHTML=qe(),a)await Me(e,s,decodeURIComponent(a));else try{const r=await m.getBookmark(e),o=r.downloadedVersions||{},c=new Set(r.deletedChapterUrls||[]),l=o[parseFloat(s)];let u=[];if(Array.isArray(l)&&(u=l.filter(h=>!c.has(h))),u.length>1){let h=[];try{h=(await m.getChapterVersions(e,s)).versions||[]}catch{}const f=await ma(u,s,r,h);if(f===null){D.go(`/manga/${e}`);return}await Me(e,s,f)}else u.length===1?await Me(e,s,u[0]):await Me(e,s)}catch(r){console.log("[Reader] Error in version check, falling back:",r),await Me(e,s)}if(n.innerHTML=qe(),console.log("[Reader] render called, loading:",i.loading,"manga:",!!i.manga,"images:",i.images.length),vt(),i.mode==="webtoon"&&i._resumeScrollToPage!=null){const r=i._resumeScrollToPage;i._resumeScrollToPage=null,setTimeout(()=>{const o=document.getElementById("reader-content");if(o){const c=o.querySelectorAll("img");c[r]&&c[r].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function yr(){console.log("[Reader] unmount called"),i._streamAbortController&&(i._streamAbortController.abort(),i._streamAbortController=null),Pe&&(clearTimeout(Pe),Pe=null);const t=ua(),e=va();document.body.classList.remove("reader-active"),document.removeEventListener("keydown",fa),i.manga=null,i.chapter=null,i.versionUrl=null,i.images=[],i.loading=!0,i.singlePageMode=!1,i.isStreamingMode=!1,i._resumeScrollToPage=null,i._preloadCache=null,await Ne(t),await Be(e)}function As(t){return!!t&&(t.mode!==void 0||t.direction!==void 0||t.firstPageSingle!==void 0||t.lastPageSingle!==void 0)}function _s(t){t&&(t.mode&&(i.mode=t.mode),t.direction&&(i.direction=t.direction),t.firstPageSingle!==void 0&&(i.firstPageSingle=t.firstPageSingle),t.lastPageSingle!==void 0&&(i.lastPageSingle=t.lastPageSingle))}function va(){return!i.manga||!i.chapter||i.isCollectionMode||i.isStreamingMode?null:{mangaId:i.manga.id,chapterNumber:i.chapter.number,settings:{mode:i.mode,direction:i.direction,firstPageSingle:i.firstPageSingle,lastPageSingle:i.lastPageSingle}}}async function Be(t=va()){if(!(!t||Y.isDemo))try{await m.updateChapterSettings(t.mangaId,t.chapterNumber,t.settings)}catch(e){console.error("Failed to save settings:",e)}}async function ya(t){try{const e=await m.getBookmark(t),s=e.downloadedChapters||[],a=new Set(e.readChapters||[]),n=e.readingProgress||{},r=e.downloadedVersions||{},o=[...s].sort((l,u)=>l-u);let c=null;for(const l of o){const u=n[l];if(u&&u.page<u.totalPages&&!a.has(l)){c=l;break}}if(c===null){for(const l of o)if(!a.has(l)){c=l;break}}if(c===null&&o.length>0&&(c=o[0]),c!==null){const l=r[c]||[],u=Array.isArray(l)?l[0]:l,h=u?`?version=${encodeURIComponent(u)}`:"";D.go(`/read/${t}/${c}${h}`)}else d("No downloaded chapters to read","info")}catch(e){d("Failed to continue reading: "+e.message,"error")}}const br={mount:vr,unmount:yr,render:qe,continueReading:ya},Xe=50;let g={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1,mergeMode:!1,mergeSelection:new Set,mergeTargetTouched:!1,mergeTitleTouched:!1,offlineChapters:new Set,isAutoOffline:!1,volumesCollapsed:!1};const ba=t=>`volumes_collapsed_${t}`;function wr(t){var s;const e=localStorage.getItem(ba(t==null?void 0:t.id));return e!==null?e==="1":(((s=t==null?void 0:t.volumes)==null?void 0:s.length)||0)>8}function kr(t){if(!(t.autoCheck===!0))return`<button class="btn btn-secondary" id="schedule-btn">${p("alarm-clock")} Schedule</button>`;const s=t.checkSchedule==="weekly"?`${(t.checkDay||"monday").charAt(0).toUpperCase()+(t.checkDay||"monday").slice(1)} ${t.checkTime||"06:00"}`:t.checkSchedule==="daily"?`Daily ${t.checkTime||"06:00"}`:"Every 6h";return`<button class="btn btn-primary" id="schedule-btn">${p("alarm-clock")} ${s}</button>`}function $r(t){const e=t.autoCheck===!0,s=t.checkSchedule||"daily",a=t.checkDay||"monday",n=t.checkTime||"06:00",r=t.autoDownload||!1;return`
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
  `}function Kt(){var j;if(g.loading)return`
      ${le()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=g.manga;if(!t)return`
      ${le()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.chapters||[],a=new Set(t.downloadedChapters||[]),n=new Set(t.readChapters||[]),r=new Set(s.map(b=>b.number)).size,o=new Set(t.excludedChapters||[]),c=new Set(t.deletedChapterUrls||[]),l=t.volumes||[],u=new Set;l.forEach(b=>{(b.chapters||[]).forEach(x=>u.add(x))});let h;g.filter==="hidden"?h=s.filter(b=>o.has(b.number)||c.has(b.url)):h=s.filter(b=>!o.has(b.number)&&!c.has(b.url));const f=h.filter(b=>!u.has(b.number));let y=[];if(g.activeVolume){const b=new Set(g.activeVolume.chapters||[]);y=h.filter(x=>b.has(x.number))}else y=f;const E=new Map;y.forEach(b=>{E.has(b.number)||E.set(b.number,[]),E.get(b.number).push(b)});let S=Array.from(E.entries()).sort((b,x)=>b[0]-x[0]);g.filter==="downloaded"?S=S.filter(([b])=>a.has(b)):g.filter==="not-downloaded"?S=S.filter(([b])=>!a.has(b)):g.filter==="main"?S=S.filter(([b])=>Number.isInteger(b)):g.filter==="extra"&&(S=S.filter(([b])=>!Number.isInteger(b)));const v=Math.max(1,Math.ceil(S.length/Xe));g.currentPage>=v&&(g.currentPage=Math.max(0,v-1));const I=g.currentPage*Xe,A=[...S.slice(I,I+Xe)].reverse(),N=E.size,F=[...E.keys()].filter(b=>a.has(b)).length;n.size;let O="";if(g.activeVolume){const b=g.activeVolume;let x=null;b.local_cover?x=`/api/public/covers/${t.id}/${encodeURIComponent(b.local_cover.split(/[/\\]/).pop())}`:b.cover&&(x=b.cover),O=`
      ${le()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${x?`<img src="${x}" alt="${b.name}">`:pe("book")}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${t.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${b.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${N} Chapters</span>
                ${F>0?`<span class="meta-item downloaded">${F} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${t.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${g.manageChapters?"Done Managing":`${p("plus")} Add Chapters`}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${b.id}">${p("pencil")} Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const b=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover;O=`
        ${le()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${b?`<img src="${b}" alt="${e}">`:pe("book")}
              </div>
              <div class="manga-detail-info">
                <h1>${e}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${t.website||"Local"}</span>
                  <span class="meta-item" title="${r} distinct chapters across ${((j=t.chapters)==null?void 0:j.length)||0} version rows">${r} Chapters</span>
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
              ${kr(t)}
            </div>
            ${t.description?`<p class="manga-description">${t.description}</p>`:""}
            ${g.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">${p("package")} CBZ Files (${g.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${g.cbzFiles.map(x=>`
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
    ${O}
        
        ${g.activeVolume?g.manageChapters?_r(t,f):"":Mr(t,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${g.filter==="all"?"active":""}" data-filter="all">
                All (${E.size})
              </button>
              <button class="filter-btn ${g.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${F})
              </button>
              <button class="filter-btn ${g.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${g.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
              ${!g.activeVolume&&Y.canEdit?`
              <button class="filter-btn merge-mode-btn ${g.mergeMode?"active":""}" id="merge-mode-btn" title="Combine downloaded chapters into one, e.g. 12.1 + 12.2 + 12.3 into chapter 12">
                ${p("link")} Combine
              </button>`:""}
            </div>
          </div>

          ${g.mergeMode?Ir(t):""}

          ${v>1?Ms(v):""}
          
          <div class="chapter-list">
            ${A.map(([b,x])=>Br(b,x,a,n,t)).join("")}
          </div>
          
          ${v>1?Ms(v):""}
        </div>
      ${Lr()}
    </div>
  `}function Er(){const t=g.manga;if(!t)return"";const e=t.alias||t.title;return`
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
  `}function Cr(){const t=g.manga;return t?`
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
  `:""}function Sr(){const t=g.manga;return t?`
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
  `:""}async function bt(){var s,a;const t=document.getElementById("anilist-track-btn"),e=g.manga;if(e)try{const n=await m.anilistStatus();if(!(n!=null&&n.configured)||!(n!=null&&n.connected)||((s=g.manga)==null?void 0:s.id)!==e.id){t&&(t.style.display="none");return}const{mapping:r}=await m.anilistGetMapping(e.id);if(((a=g.manga)==null?void 0:a.id)!==e.id)return;t&&(t.style.display="",t.style.borderColor=r?"var(--accent-primary)":"",t.innerHTML=r?`${p("check")} Tracked`:`${p("link")} Track`,t.title=r?`Linked to ${r.anilist_title}`:"Link this manga to AniList"),xr(r,e)}catch(n){console.warn("Failed to load AniList state:",n),t&&(t.style.display="none")}}function xr(t,e){var n,r,o;const s=document.getElementById("anilist-tracked-view"),a=document.getElementById("anilist-search-view");if(!(!s||!a)){if(!t){s.style.display="none",s.innerHTML="",a.style.display="";return}a.style.display="none",s.style.display="",s.innerHTML=`
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
  `,(n=document.getElementById("anilist-sync-toggle"))==null||n.addEventListener("change",async c=>{try{await m.anilistSetSyncEnabled(e.id,c.target.checked),d(c.target.checked?"AniList sync enabled":"AniList sync disabled","success")}catch(l){c.target.checked=!c.target.checked,d("Failed to update sync: "+l.message,"error")}}),(r=document.getElementById("anilist-relink-btn"))==null||r.addEventListener("click",()=>{s.style.display="none",a.style.display=""}),(o=document.getElementById("anilist-unlink-btn"))==null||o.addEventListener("click",async()=>{if(confirm(`Unlink "${t.anilist_title}" from AniList?`))try{await m.anilistUnmap(e.id),d("Unlinked from AniList","success"),bt()}catch(c){d("Failed to unlink: "+c.message,"error")}})}}function Lr(){var e,s;const t=g.manga;return`
    ${t?$r(t):""}
    ${Zr()}
    ${Er()}
    ${Cr()}
    ${Sr()}

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
  `}function wa(t,e){if(e.length===0)return"";const s=Math.min(...e),a=Math.floor(s);return!(t.chapters||[]).some(r=>r.number===a)||e.includes(a)?a:s}function Ir(t){const e=[...g.mergeSelection].sort((a,n)=>a-n),s=wa(t,e);return`
    <div class="merge-bar" id="merge-bar">
      <div class="merge-bar-text">
        <strong>Combine chapters</strong>
        <span id="merge-picked">${e.length?`Picked in page order: ${e.map(a=>`Ch. ${a}`).join(", ")}`:"Tick the downloaded chapters to combine (pages follow chapter order)."}</span>
      </div>
      <div class="merge-bar-fields">
        <label>Into chapter <input type="number" step="any" min="0" id="merge-target" value="${s}"></label>
        <label>Title <input type="text" id="merge-title" value="${s!==""?`Chapter ${s}`:""}" placeholder="Chapter ${s||"N"}"></label>
        <label class="merge-check"><input type="checkbox" id="merge-delete-sources"> Remove the original folders</label>
        <button class="btn btn-primary btn-sm" id="merge-submit" ${e.length?"":"disabled"}>Combine</button>
        <button class="btn btn-secondary btn-sm" id="merge-cancel">Cancel</button>
      </div>
    </div>
  `}function Br(t,e,s,a,n){var L,M,$,B,R,U;const r=s.has(t),o=a.has(t),c=!Number.isInteger(t),l=((L=n.mergedChapters)==null?void 0:L[t])||null,u=((M=n.downloadedVersions)==null?void 0:M[t])||[],h=new Set(n.deletedChapterUrls||[]),f=e.filter(T=>g.filter==="hidden"?!0:!h.has(T.url)),y=!!g.activeVolume,E=n.chapterSettings||{},S=y?!0:!!(($=E[t])!=null&&$.locked);let v=f;if(y||S){const T=f.filter(q=>Array.isArray(u)?u.includes(q.url):u===q.url);v=T.length>0?T:f}v.sort((T,q)=>{const J=Array.isArray(u)?u.includes(T.url):u===T.url;return((Array.isArray(u)?u.includes(q.url):u===q.url)?1:0)-(J?1:0)});const I=((B=n.chapterFolders)==null?void 0:B[t])||[],w=I.filter(T=>!T.url),A=I.reduce((T,q)=>Math.max(T,q.imageCount),0),N=T=>T.imageCount<3||A>=6&&T.imageCount<A/2,F=T=>I.find(q=>q.url===T)||null,O=I.filter(T=>T.url&&N(T)),j=v.length>1||w.length>0,b=(R=v[0])!=null&&R.url?encodeURIComponent(v[0].url):null,x=["chapter-item",r?"downloaded":"",o?"read":"",c?"extra":""].filter(Boolean).join(" "),P=Array.isArray(u)?u:u?[u]:[],z=P.length,Z=j?`
    <div class="versions-dropdown hidden" id="versions-${t}">
      ${v.map(T=>{const q=encodeURIComponent(T.url),J=P.includes(T.url),W=T.url.startsWith("local://"),X=T.title&&T.title!==`Chapter ${t}`?T.title:"",de=X||T.releaseGroup||"Version",Se=[X&&T.releaseGroup?T.releaseGroup:"",Ar(T.uploadedAt)].filter(Boolean).join(" · ");return`
          <div class="version-row ${J?"downloaded":""}"
               data-version-url="${q}" data-num="${t}">
            <span class="version-title" style="cursor: pointer; flex: 1;" title="${Pt(T.url)}">${dt(de)}${W?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}${Se?`<span class="version-meta">${dt(Se)}</span>`:""}${(()=>{const _e=J?F(T.url):null;if(!_e)return"";const ze=N(_e);return`<span class="version-meta version-pages ${ze?"warn":""}" title="${Pt(_e.folder)}">${_e.imageCount} pages${ze?" - incomplete?":""}</span>`})()}</span>
            <div class="version-actions">
              ${J?`<button class="btn-icon small success" data-action="read-version" data-num="${t}" data-url="${q}">${p("play",{title:"Read"})}</button>
                   ${z>1?`<button class="btn-icon small" data-action="keep-version" data-num="${t}" data-url="${q}" title="Keep only this version (delete the other ${z-1})">${p("check",{title:"Keep only this version"})}</button>`:""}
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${t}" data-url="${q}">${p("trash-2",{title:"Delete version"})}</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${t}" data-url="${q}">${p("download",{title:"Download"})}</button>`}
              ${h.has(T.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${t}" data-url="${q}" title="Restore Version">${p("undo-2",{title:"Restore version"})}</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${t}" data-url="${q}" title="Hide Version">${p("eye-off",{title:"Hide version"})}</button>`}
            </div>
          </div>
        `}).join("")}
      ${w.map(T=>`
          <div class="version-row orphan" data-num="${t}">
            <span class="version-title" title="${Pt(T.folder)}">Leftover folder on disk<span class="version-meta">${dt(T.folder)} · ${T.imageCount} pages</span></span>
            <div class="version-actions">
              <button class="btn-icon small danger" data-action="delete-folder" data-num="${t}" data-folder="${encodeURIComponent(T.folder)}">${p("trash-2",{title:"Delete this folder from disk"})}</button>
            </div>
          </div>`).join("")}
    </div>
  `:"",K=(n.excludedChapters||[]).includes(t),k=g.mergeMode&&r&&!K&&!l;return`
    <div class="chapter-group" data-chapter="${t}">
      <div class="${x}" data-num="${t}" style="${K?"opacity: 0.7":""}">
        ${g.mergeMode?`<input type="checkbox" class="merge-pick" data-num="${t}" ${g.mergeSelection.has(t)?"checked":""} ${k?"":"disabled"} title="${k?"Combine this chapter":l?"Already a combined chapter":"Only downloaded chapters can be combined"}">`:""}
        <span class="chapter-number">Ch. ${t}</span>
        <span class="chapter-title">
          ${v[0]?v[0].title!==`Chapter ${t}`?v[0].title:"":e[0].title}
          ${K?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
          ${O.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="A downloaded version of this chapter has only ${O[0].imageCount} pages">${O[0].imageCount} pages</span>`:""}
          ${w.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="${w.length} folder(s) on disk not linked to any downloaded version - open the versions list to delete">${w.length} leftover folder${w.length>1?"s":""}</span>`:""}
        </span>
        ${l?`<span class="chapter-tag merged" title="Combined from ${l.sources.map(T=>`Ch. ${T}`).join(", ")}">Combined</span>`:c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${l&&!K?`<button class="btn-icon small" data-action="split-chapter" data-num="${t}" title="Split back into ${l.sources.map(T=>`Ch. ${T}`).join(", ")}">${p("scissors",{title:"Split"})}</button>`:""}
          ${K?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${t}" title="Restore Chapter">${p("undo-2",{title:"Restore chapter"})}</button>`:y?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${g.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${t}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${S?"locked":""}"
                        data-action="lock" data-num="${t}"
                        title="${S?"Unlock":"Lock"}">
                  ${S?p("lock",{title:"Locked"}):p("lock-open",{title:"Unlocked"})}
                </button>`}
          ${!K&&b?h.has((U=v[0])==null?void 0:U.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${t}" data-url="${b}" title="Unhide Chapter">${p("undo-2",{title:"Unhide chapter"})}</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${t}" data-url="${b}" title="Hide Chapter">${p("eye-off",{title:"Hide chapter"})}</button>`:""}
          <button class="btn-icon small ${o?"success":"muted"}"
                  data-action="read" data-num="${t}"
                  title="${o?"Mark unread":"Mark read"}">
            ${o?p("eye",{title:"Read"}):p("circle",{title:"Unread"})}
          </button>
          ${r?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${t}" data-url="${b}" title="Delete Files">${p("trash-2",{title:"Delete files"})}</button>
         <button class="btn-icon small ${g.offlineChapters.has(t)?"success":""}" data-action="offline-save" data-num="${t}" title="${g.offlineChapters.has(t)?"Remove offline copy":"Save for offline reading"}">
           ${g.offlineChapters.has(t)?p("wifi-off",{title:"Available offline"}):p("hard-drive",{title:"Save offline"})}
         </button>`:`<button class="btn-icon small ${r?"success":""}"
              data-action="download" data-num="${t}"
              title="${r?"Downloaded":"Download"}">
          ${r?p("check",{title:"Downloaded"}):p("download",{title:"Download"})}
        </button>`}
          ${j?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${t}" title="${f.length} versions, ${z} downloaded">
              ${z>1?`${z}/`:""}${f.length} ${p("chevron-down")}
            </button>
          `:""}
        </div>
      </div>
      ${Z}
    </div>
  `}function Ar(t){if(!t)return"";const e=new Date(t);return isNaN(e.getTime())?String(t).slice(0,10):e.toISOString().slice(0,10)}function dt(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Pt(t){return dt(t).replace(/"/g,"&quot;")}function Ms(t){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${g.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${g.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${g.currentPage+1} of ${t}</span>
      <button class="btn btn-icon" data-page="next" ${g.currentPage>=t-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${g.currentPage>=t-1?"disabled":""}>»</button>
    </div>
  `}function _r(t,e){return e.length===0?`
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
  `}function Mr(t,e){var o;const s=t.volumes||[];if(s.length===0)return"";const a=s.map(c=>{const l=c.chapters||[],u=l.filter(h=>e.has(h)).length;return`
      <div class="volume-card" data-volume-id="${c.id}">
        <div class="volume-cover">
          ${c.cover?`<img src="${c.cover}" alt="${c.name}">`:pe("book")}
          <div class="volume-badges">
            <span class="badge badge-chapters">${l.length} ch</span>
            ${u>0?`<span class="badge badge-downloaded">${u}</span>`:""}
          </div>
        </div>
        <div class="volume-info">
          <div class="volume-name">${c.name}</div>
        </div>
      </div>
    `}).join(""),n=g.volumesCollapsed,r=s.reduce((c,l)=>c+(l.chapters||[]).filter(u=>e.has(u)).length,0);return`
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
  `}function Tr(){var n,r,o,c,l,u,h,f,y,E,S,v,I,w,A,N,F,O,j,b,x,P,z,Z,K;const t=document.getElementById("app"),e=g.manga;if(!e)return;(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>D.go("/")),(r=document.getElementById("back-library-btn"))==null||r.addEventListener("click",()=>D.go("/")),t.querySelectorAll(".artist-link").forEach(k=>{k.addEventListener("click",async L=>{L.preventDefault();const M=k.dataset.artist;if(!M)return;localStorage.setItem("library_search",M),localStorage.removeItem("library_artist_filter");let $=null;try{const B=e.website;if(B&&B!=="Local"){const U=(window._scrapersList||(window._scrapersList=(await m.get("/scrapers/list")).scrapers)||[]).find(T=>T.name===B);U&&U.supportsBrowse&&($=B)}}catch{}$?(localStorage.setItem("library_search_author",M),localStorage.setItem("library_search_author_source",$)):(localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source")),D.go("/")})}),(o=document.getElementById("continue-btn"))==null||o.addEventListener("click",()=>{ya(e.id)}),(c=document.getElementById("download-all-btn"))==null||c.addEventListener("click",()=>{const k=document.getElementById("download-all-modal");k&&k.classList.add("open")}),(l=document.getElementById("confirm-download-all-btn"))==null||l.addEventListener("click",async()=>{var k;try{d("Queueing downloads...","info");const L=document.getElementsByName("download-version-mode");let M="single";for(const B of L)B.checked&&(M=B.value);(k=document.getElementById("download-all-modal"))==null||k.classList.remove("open");const $=await m.post(`/bookmarks/${e.id}/download`,{all:!0,versionMode:M});$.chaptersCount>0?d(`Download queued: ${$.chaptersCount} versions`,"success"):d("Already have these chapters downloaded","info")}catch(L){d("Failed to download: "+L.message,"error")}}),(u=document.getElementById("check-updates-btn"))==null||u.addEventListener("click",async()=>{try{d("Checking for updates...","info"),await m.post(`/bookmarks/${e.id}/quick-check`),d("Check complete!","success")}catch(k){d("Check failed: "+k.message,"error")}}),(h=document.getElementById("schedule-btn"))==null||h.addEventListener("click",()=>{const k=document.getElementById("schedule-modal");k&&k.classList.add("open")}),(f=document.getElementById("schedule-type"))==null||f.addEventListener("change",k=>{const L=document.getElementById("schedule-day-group");L&&(L.style.display=k.target.value==="weekly"?"":"none")}),(y=document.getElementById("save-schedule-btn"))==null||y.addEventListener("click",async()=>{var k;try{const L=document.getElementById("schedule-type").value,M=document.getElementById("schedule-day").value,$=document.getElementById("schedule-time").value,B=document.getElementById("auto-download-toggle").checked;await m.updateAutoCheckSchedule(e.id,{enabled:!0,schedule:L,day:M,time:$,autoDownload:B}),g.manga.checkSchedule=L,g.manga.checkDay=M,g.manga.checkTime=$,g.manga.autoDownload=B,(k=document.getElementById("schedule-modal"))==null||k.classList.remove("open"),H([e.id]),d("Schedule updated","success")}catch(L){d("Failed to save schedule: "+L.message,"error")}}),(E=document.getElementById("disable-schedule-btn"))==null||E.addEventListener("click",async()=>{var k;try{await m.toggleAutoCheck(e.id,!1),g.manga.autoCheck=!1,g.manga.checkSchedule=null,g.manga.checkDay=null,g.manga.checkTime=null,g.manga.nextCheck=null,(k=document.getElementById("schedule-modal"))==null||k.classList.remove("open"),H([e.id]),d("Auto-check disabled","success")}catch(L){d("Failed to disable: "+L.message,"error")}}),(S=document.getElementById("refresh-btn"))==null||S.addEventListener("click",async()=>{const k=document.getElementById("refresh-btn");try{k.disabled=!0,k.innerHTML=`${p("loader",{spin:!0})} Checking...`,d("Checking for updates...","info"),await m.post(`/bookmarks/${e.id}/check`),await G(e.id),H([e.id]),d("Check complete!","success")}catch(L){d("Check failed: "+L.message,"error"),k&&(k.disabled=!1,k.innerHTML=`${p("refresh-cw")} Refresh`)}}),(v=document.getElementById("scan-folder-btn"))==null||v.addEventListener("click",async()=>{var L,M;const k=document.getElementById("scan-folder-btn");try{k.disabled=!0,k.innerHTML=`${p("loader",{spin:!0})} Scanning...`,d("Scanning folder...","info");const $=await m.scanBookmark(e.id);await G(e.id),H([e.id]);const B=((L=$.addedChapters)==null?void 0:L.length)||0,R=((M=$.removedChapters)==null?void 0:M.length)||0;B>0||R>0?d(`Scan complete: ${B} added, ${R} removed`,"success"):d("Scan complete: No changes","info")}catch($){d("Scan failed: "+$.message,"error")}finally{k&&(k.disabled=!1,k.innerHTML=`${p("folder")} Scan Folder`)}}),document.querySelectorAll("[data-cbz-path]").forEach(k=>{k.addEventListener("click",async()=>{const L=decodeURIComponent(k.dataset.cbzPath),M=parseInt(k.dataset.cbzChapter)||1,$=k.dataset.cbzExtracted==="true",B=prompt("Enter chapter number for extraction:",String(M));if(!B)return;const R=parseFloat(B);if(isNaN(R)){d("Invalid chapter number","error");return}try{k.disabled=!0,k.textContent="Extracting...",d("Extracting CBZ...","info"),await m.extractCbz(e.id,L,R,{forceReExtract:$}),d("CBZ extracted successfully!","success"),await G(e.id),H([e.id])}catch(U){d("Extract failed: "+U.message,"error")}finally{k.disabled=!1,k.textContent=$?"Re-Extract":"Extract"}})}),(I=document.getElementById("edit-btn"))==null||I.addEventListener("click",async()=>{const k=document.getElementById("edit-manga-modal");if(k){document.getElementById("edit-alias-input").value=e.alias||"",window._selectedCoverPath=null;try{const[L,M]=await Promise.all([m.getAllArtists(),m.getAllCategories()]),$=document.getElementById("artist-list"),B=document.getElementById("category-list");window._allArtists=L,window._allCategories=M,$&&($.innerHTML=L.map(T=>`<option value="${T}">`).join("")),B&&(B.innerHTML=M.map(T=>`<option value="${T}">`).join(""));const R=document.getElementById("edit-artist-input"),U=document.getElementById("edit-categories-input");R==null||R.addEventListener("input",()=>{const T=R.value.toLowerCase(),q=R.value.lastIndexOf(","),J=R.value.substring(q+1).trim().toLowerCase();if(J.length>0&&window._allArtists){const W=window._allArtists.filter(X=>X.toLowerCase().includes(J));if($&&W.length>0){const X=q>=0?R.value.substring(0,q+1)+" ":"";$.innerHTML=W.map(de=>`<option value="${X}${de}">`).join("")}}}),U==null||U.addEventListener("input",()=>{const T=U.value.lastIndexOf(","),q=U.value.substring(T+1).trim().toLowerCase();if(q.length>0&&window._allCategories){const J=window._allCategories.filter(W=>W.toLowerCase().includes(q));if(B&&J.length>0){const W=T>=0?U.value.substring(0,T+1)+" ":"";B.innerHTML=J.map(X=>`<option value="${W}${X}">`).join("")}}})}catch(L){console.error("Failed to load artists/categories:",L)}k.classList.add("open")}}),(w=document.getElementById("save-manga-btn"))==null||w.addEventListener("click",async()=>{var k;try{const L=document.getElementById("edit-alias-input").value.trim(),M=document.getElementById("edit-artist-input").value.trim(),$=document.getElementById("edit-categories-input").value.trim(),B=M?M.split(",").map(U=>U.trim()).filter(U=>U):[],R=$?$.split(",").map(U=>U.trim()).filter(U=>U):[];await m.updateBookmark(e.id,{alias:L||null}),await m.setBookmarkArtists(e.id,B),await m.setBookmarkCategories(e.id,R),window._selectedCoverPath&&await m.setBookmarkCoverFromImage(e.id,window._selectedCoverPath),g.manga.alias=L||null,g.manga.artists=B,g.manga.categories=R,(k=document.getElementById("edit-manga-modal"))==null||k.classList.remove("open"),H([e.id]),d("Manga updated","success")}catch(L){d("Failed to update: "+L.message,"error")}}),(A=document.getElementById("change-cover-btn"))==null||A.addEventListener("click",async()=>{try{d("Loading images...","info");const k=await m.getFolderImages(e.id);if(k.length===0){d("No images found in manga folder","warning");return}const L=document.createElement("div");L.id="cover-select-modal",L.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",L.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${k.slice(0,50).map(M=>`
              <div class="cover-option" data-path="${M.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(M.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${k.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${k.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(L),document.getElementById("close-cover-modal").addEventListener("click",()=>L.remove()),L.addEventListener("click",M=>{M.target===L&&L.remove()}),L.querySelectorAll(".cover-option").forEach(M=>{M.addEventListener("click",()=>{window._selectedCoverPath=M.dataset.path;const $=document.getElementById("cover-preview");$&&($.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),L.remove(),d("Cover selected","success")})})}catch(k){d("Failed to load images: "+k.message,"error")}}),(N=document.getElementById("delete-manga-btn"))==null||N.addEventListener("click",()=>{const k=document.getElementById("delete-manga-modal");k&&k.classList.add("open")}),(F=document.getElementById("confirm-delete-manga-btn"))==null||F.addEventListener("click",async()=>{var L,M;const k=((L=document.getElementById("delete-files-toggle"))==null?void 0:L.checked)||!1;try{await m.deleteBookmark(e.id,k),(M=document.getElementById("delete-manga-modal"))==null||M.classList.remove("open"),d("Manga deleted","success"),D.go("/")}catch($){d("Failed to delete: "+$.message,"error")}}),(O=document.getElementById("quick-check-btn"))==null||O.addEventListener("click",async()=>{const k=document.getElementById("quick-check-btn");try{k.disabled=!0,k.innerHTML=`${p("loader",{spin:!0})} Checking...`,d("Quick checking for updates...","info");const L=await m.post(`/bookmarks/${e.id}/quick-check`);await G(e.id),H([e.id]),L.newChaptersCount>0?d(`Found ${L.newChaptersCount} new chapter(s)!`,"success"):d("No new chapters found","info")}catch(L){d("Quick check failed: "+L.message,"error")}finally{k&&(k.disabled=!1,k.innerHTML=`${p("zap")} Quick Check`)}}),(j=document.getElementById("source-label"))==null||j.addEventListener("click",async()=>{const k=document.getElementById("migrate-source-modal");if(k){k.classList.add("open");const L=document.getElementById("migrate-search-scraper");if(L&&L.options.length<=1)try{const M=await m.get("/scrapers/list");if(M.success){const $=M.scrapers.filter(B=>B.supportsSearch);L.innerHTML='<option value="all">All Sources</option>'+$.map(B=>`<option value="${B.name}">${B.name}</option>`).join(""),L.value="all"}}catch(M){console.warn("Failed to load scrapers:",M)}}});const s=async()=>{var R,U,T;const k=(U=(R=document.getElementById("migrate-search-input"))==null?void 0:R.value)==null?void 0:U.trim(),L=(T=document.getElementById("migrate-search-scraper"))==null?void 0:T.value;if(!k)return;const M=document.getElementById("migrate-search-loading"),$=document.getElementById("migrate-search-results"),B=document.getElementById("migrate-results-grid");M.style.display="block",$.style.display="none";try{const J=(await m.get(`/scrapers/search?q=${encodeURIComponent(k)}&scraper=${encodeURIComponent(L)}`)).results||[];J.length===0?B.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(B.innerHTML=J.map(W=>{var de;const X=(de=W.cover)!=null&&de.startsWith("/covers/")?W.cover:W.cover?`/api/scrapers/proxy-cover?url=${encodeURIComponent(W.cover)}`:"";return`
            <div class="manga-card migrate-result-card" data-url="${W.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${X?Le(X,"Cover",{kind:"series",self:!0}):pe("series")}
                ${W.chapterCount?`<div class="manga-card-badges"><span class="badge badge-chapters">${W.chapterCount} ch</span></div>`:""}
              </div>
              <div class="manga-card-title" title="${W.title}" style="font-size: 0.8rem; padding: 4px;">${W.title}</div>
            </div>
          `}).join(""),B.querySelectorAll(".migrate-result-card").forEach(W=>{W.addEventListener("click",()=>{var de;const X=W.dataset.url;document.getElementById("migrate-url-input").value=X,B.querySelectorAll(".migrate-result-card").forEach(Se=>Se.style.outline=""),W.style.outline="2px solid var(--color-primary)",d(`Selected: ${(de=W.querySelector(".manga-card-title"))==null?void 0:de.textContent}`,"info")})})),M.style.display="none",$.style.display="block"}catch(q){M.style.display="none",d("Search failed: "+q.message,"error")}};(b=document.getElementById("migrate-search-btn"))==null||b.addEventListener("click",s),(x=document.getElementById("migrate-search-input"))==null||x.addEventListener("keydown",k=>{k.key==="Enter"&&s()}),(P=document.getElementById("confirm-migrate-btn"))==null||P.addEventListener("click",async()=>{var M,$,B;const k=($=(M=document.getElementById("migrate-url-input"))==null?void 0:M.value)==null?void 0:$.trim();if(!k){d("Please enter a URL","warning");return}const L=document.getElementById("confirm-migrate-btn");try{L.disabled=!0,L.textContent="Migrating...",d("Migrating source...","info");const R=await m.migrateSource(e.id,k);d(`Migrated! ${R.migratedChapters} chapters preserved as local`,"success"),d("Running full check on new source...","info"),await m.post(`/bookmarks/${e.id}/check`),(B=document.getElementById("migrate-source-modal"))==null||B.classList.remove("open"),await G(e.id),H([e.id]),d("Source migration complete!","success")}catch(R){d("Migration failed: "+R.message,"error")}finally{L&&(L.disabled=!1,L.textContent="Migrate Source")}}),(z=document.getElementById("anilist-track-btn"))==null||z.addEventListener("click",()=>{var k;(k=document.getElementById("anilist-modal"))==null||k.classList.add("open"),bt()});const a=async()=>{var B,R;const k=(R=(B=document.getElementById("anilist-search-input"))==null?void 0:B.value)==null?void 0:R.trim();if(!k)return;const L=document.getElementById("anilist-search-loading"),M=document.getElementById("anilist-search-results"),$=document.getElementById("anilist-results-list");L.style.display="block",M.style.display="none";try{const T=(await m.anilistSearch(k)).results||[];T.length===0?$.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':($.innerHTML=T.map(q=>{var X,de,Se,_e,ze,bs,ws;const J=((X=q.title)==null?void 0:X.romaji)||((de=q.title)==null?void 0:de.english)||((Se=q.title)==null?void 0:Se.native)||"Unknown",W=(_e=q.title)!=null&&_e.english&&q.title.english!==J?q.title.english:(ze=q.title)!=null&&ze.native&&q.title.native!==J?q.title.native:"";return`
            <div style="display: flex; gap: 10px; align-items: center; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 8px;">
              ${(bs=q.coverImage)!=null&&bs.medium?`<img src="${q.coverImage.medium}" alt="" style="width: 48px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">`:""}
              <div style="flex: 1; min-width: 0;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${J}"><strong>${J}</strong></div>
                <div class="text-muted" style="font-size: 0.8em;">
                  ${[W,q.format,(ws=q.startDate)==null?void 0:ws.year,`${q.chapters??"?"} ch`].filter(Boolean).join(" • ")}
                </div>
              </div>
              <button class="btn btn-small btn-primary anilist-link-result-btn" data-id="${q.id}" data-title="${J.replace(/"/g,"&quot;")}">Link</button>
            </div>
          `}).join(""),$.querySelectorAll(".anilist-link-result-btn").forEach(q=>{q.addEventListener("click",async()=>{var J,W;try{q.disabled=!0,q.textContent="Linking...";const X=await m.anilistMap(e.id,Number(q.dataset.id)),de=((J=X.mapping)==null?void 0:J.anilist_title)||q.dataset.title,Se=(W=X.pull)!=null&&W.markedUpTo?` — pulled progress up to ch. ${X.pull.markedUpTo}`:"";d(`Linked to AniList: ${de}${Se}`,"success"),bt()}catch(X){q.disabled=!1,q.textContent="Link",d("Failed to link: "+X.message,"error")}})})),L.style.display="none",M.style.display="block"}catch(U){L.style.display="none",d("AniList search failed: "+U.message,"error")}};(Z=document.getElementById("anilist-search-btn"))==null||Z.addEventListener("click",a),(K=document.getElementById("anilist-search-input"))==null||K.addEventListener("keydown",k=>{k.key==="Enter"&&a()}),t.querySelectorAll(".filter-btn[data-filter]").forEach(k=>{k.addEventListener("click",()=>{g.filter=k.dataset.filter,g.currentPage=0,H([e.id])})}),Gr(t,e),t.querySelectorAll("[data-page]").forEach(k=>{k.addEventListener("click",()=>{const L=k.dataset.page,M=Math.ceil(g.manga.chapters.length/Xe);switch(L){case"first":g.currentPage=0;break;case"prev":g.currentPage=Math.max(0,g.currentPage-1);break;case"next":g.currentPage=Math.min(M-1,g.currentPage+1);break;case"last":g.currentPage=M-1;break}H([e.id])})}),t.querySelectorAll(".chapter-item").forEach(k=>{k.addEventListener("click",L=>{var B;if(L.target.closest(".chapter-actions"))return;const M=parseFloat(k.dataset.num);if((e.downloadedChapters||[]).includes(M)){const R=((B=e.downloadedVersions)==null?void 0:B[M])||[],U=Array.isArray(R)?R[0]:R;U?D.go(`/read/${e.id}/${M}?version=${encodeURIComponent(U)}`):D.go(`/read/${e.id}/${M}`)}else d("Chapter not downloaded","info")})}),t.querySelectorAll("[data-action]").forEach(k=>{k.addEventListener("click",async L=>{L.stopPropagation();const M=k.dataset.action,$=parseFloat(k.dataset.num),B=k.dataset.url?decodeURIComponent(k.dataset.url):null;switch(M){case"lock":await Pr($);break;case"read":await Rr($);break;case"download":await qr($);break;case"versions":Dr($);break;case"read-version":D.go(`/read/${e.id}/${$}?version=${encodeURIComponent(B)}`);break;case"download-version":await Or($,B);break;case"delete-version":await Ur($,B);break;case"keep-version":await Nr($,B);break;case"delete-folder":await Fr($,decodeURIComponent(k.dataset.folder||""));break;case"hide-version":await Hr($,B);break;case"restore-version":await Vr($,B);break;case"restore-chapter":await jr($);break;case"delete-chapter":await zr($,B);break;case"hide-chapter":await Qr($,B);break;case"unhide-chapter":await Wr($,B);break;case"split-chapter":await Jr($);break}})}),t.querySelectorAll(".version-row .version-title").forEach(k=>{k.addEventListener("click",L=>{L.stopPropagation();const M=k.closest(".version-row"),$=parseFloat(M.dataset.num),B=M.dataset.versionUrl?decodeURIComponent(M.dataset.versionUrl):null;M.classList.contains("downloaded")&&B?D.go(`/read/${e.id}/${$}?version=${encodeURIComponent(B)}`):d("Version not downloaded yet","info")})}),t.querySelectorAll(".volume-card").forEach(k=>{k.addEventListener("click",()=>{const L=k.dataset.volumeId;D.go(`/manga/${e.id}/volume/${L}`)})}),ei(t),Ie(),te.subscribeToManga(e.id)}async function Pr(t){var n;const e=g.manga,s=((n=e.chapterSettings)==null?void 0:n[t])||{},a=!s.locked;try{a?await m.lockChapter(e.id,t):await m.unlockChapter(e.id,t),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[t]={...s,locked:a},d(a?"Chapter locked":"Chapter unlocked","success"),H([e.id])}catch(r){d("Failed: "+r.message,"error")}}async function Rr(t){const e=g.manga,s=new Set(e.readChapters||[]),a=s.has(t);try{await m.post(`/bookmarks/${e.id}/chapters/${t}/read`,{isRead:!a}),a?s.delete(t):s.add(t),e.readChapters=[...s],d(a?"Marked unread":"Marked read","success"),H([e.id])}catch(n){d("Failed: "+n.message,"error")}}async function qr(t){const e=g.manga,s=new Set(e.deletedChapterUrls||[]),a=(e.chapters||[]).find(n=>n.number===t&&!s.has(n.url));try{d(`Downloading chapter ${t}...`,"info");let n;a?n=await m.post(`/bookmarks/${e.id}/download-version`,{chapterNumber:t,url:a.url}):n=await m.post(`/bookmarks/${e.id}/download`,{chapters:[t]}),d("Download queued!","success"),ka(n==null?void 0:n.taskId,`Chapter ${t}`)}catch(n){d("Failed: "+n.message,"error")}}function Dr(t){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${t}`&&s.classList.add("hidden")});const e=document.getElementById(`versions-${t}`);e&&e.classList.toggle("hidden")}async function Fr(t,e){const s=g.manga;if(e&&confirm(`Delete the folder "${e}" from disk?`))try{await m.deleteChapterFolder(s.id,t,e),d("Folder deleted","success"),await G(s.id),H([s.id])}catch(a){d("Failed: "+a.message,"error")}}function ka(t,e){var r;if(!t)return;const s=(r=g.manga)==null?void 0:r.id,a=Date.now(),n=async()=>{var h,f;if(Date.now()-a>30*60*1e3)return;let o;try{o=await m.getDownloadProgress(t)}catch{return}if(!o)return;if(!["complete","error","cancelled"].includes(o.status)){setTimeout(n,3e3);return}const l=o.errors||[],u=(o.completedChapters||[]).length>0&&o.status!=="error";o.status==="cancelled"?d(`${e}: download cancelled`,"info"):u?l.length?d(`${e} downloaded with problems: ${l[0].error}`,"warning"):d(`${e} downloaded${o.pages?` (${o.pages} pages)`:""}`,"success"):d(`${e} failed: ${((h=l[0])==null?void 0:h.error)||"unknown error"}`,"error"),((f=g.manga)==null?void 0:f.id)===s&&window.location.hash.startsWith(`#/manga/${s}`)&&(await G(s),H([s]))};setTimeout(n,3e3)}async function Nr(t,e){var c;const s=g.manga,a=((c=s.downloadedVersions)==null?void 0:c[t])||[],r=(Array.isArray(a)?a:[a]).filter(l=>l&&l!==e);if(r.length===0){d("This is the only downloaded version","info");return}if(!confirm(`Delete the other ${r.length} downloaded version${r.length>1?"s":""} of chapter ${t}?`))return;let o=0;for(const l of r)try{await m.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:l})})}catch(u){o++,d("Failed to delete a version: "+u.message,"error")}o===0&&d("Other versions deleted","success"),await G(s.id),H([s.id])}async function Or(t,e){const s=g.manga;try{d("Downloading version...","info");const a=await m.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:t,url:e});d("Download queued!","success"),ka(a==null?void 0:a.taskId,`Chapter ${t}`)}catch(a){d("Failed: "+a.message,"error")}}async function Ur(t,e){const s=g.manga;try{await m.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),d("Version deleted","success"),await G(s.id),H([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function Hr(t,e){const s=g.manga;try{await m.hideVersion(s.id,t,e),d("Version hidden","success"),await G(s.id),H([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function Vr(t,e){const s=g.manga;try{await m.unhideVersion(s.id,t,e),d("Version restored","success"),await G(s.id),H([s.id])}catch(a){d("Failed to restore version: "+a.message,"error")}}async function jr(t){const e=g.manga;try{await m.unexcludeChapter(e.id,t),d("Chapter restored","success"),await G(e.id),H([e.id])}catch(s){d("Failed to restore chapter: "+s.message,"error")}}async function zr(t,e){const s=g.manga;if(confirm("Delete this chapter's files from disk?"))try{await m.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),d("Chapter files deleted","success"),await G(s.id),H([s.id])}catch(a){d("Failed to delete: "+a.message,"error")}}async function Qr(t,e){const s=g.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await m.hideVersion(s.id,t,e),d("Chapter hidden","success"),await G(s.id),H([s.id])}catch(a){d("Failed to hide chapter: "+a.message,"error")}}async function Wr(t,e){const s=g.manga;try{await m.unhideVersion(s.id,t,e),d("Chapter unhidden","success"),await G(s.id),H([s.id])}catch(a){d("Failed to unhide chapter: "+a.message,"error")}}function Gr(t,e){var r,o;const s=t.querySelector("#merge-mode-btn");if(s&&s.addEventListener("click",()=>{g.mergeMode=!g.mergeMode,g.mergeSelection=new Set,g.mergeTargetTouched=!1,g.mergeTitleTouched=!1,H([e.id])}),!g.mergeMode)return;t.querySelectorAll(".merge-pick").forEach(c=>{c.addEventListener("click",l=>l.stopPropagation()),c.addEventListener("change",l=>{l.stopPropagation();const u=parseFloat(c.dataset.num);c.checked?g.mergeSelection.add(u):g.mergeSelection.delete(u),Kr(e)})});const a=t.querySelector("#merge-target"),n=t.querySelector("#merge-title");a==null||a.addEventListener("input",()=>{g.mergeTargetTouched=!0,!g.mergeTitleTouched&&n&&(n.value=a.value!==""?`Chapter ${a.value}`:"")}),n==null||n.addEventListener("input",()=>{g.mergeTitleTouched=!0}),(r=t.querySelector("#merge-cancel"))==null||r.addEventListener("click",()=>{g.mergeMode=!1,g.mergeSelection=new Set,H([e.id])}),(o=t.querySelector("#merge-submit"))==null||o.addEventListener("click",async()=>{var y;const c=[...g.mergeSelection].sort((E,S)=>E-S),l=parseFloat(a==null?void 0:a.value);if(c.length===0)return d("Tick the chapters to combine first","info");if(!Number.isFinite(l))return d("Give the combined chapter a number","error");const u=(n==null?void 0:n.value.trim())||`Chapter ${l}`,h=!!((y=t.querySelector("#merge-delete-sources"))!=null&&y.checked);if(h&&!confirm(`Remove the original folders of ${c.map(E=>`Ch. ${E}`).join(", ")} after combining? Splitting later will need them downloaded again.`))return;const f=t.querySelector("#merge-submit");f.disabled=!0,f.textContent="Combining…";try{const E=await m.mergeChapters(e.id,{sources:c,target:l,title:u,deleteSources:h});d(`Chapter ${E.target}: ${E.pageCount} pages from ${c.length} chapter${c.length===1?"":"s"}`,"success"),g.mergeMode=!1,g.mergeSelection=new Set,await G(e.id),H([e.id])}catch(E){d("Combine failed: "+E.message,"error"),f.disabled=!1,f.textContent="Combine"}})}function Kr(t){const e=[...g.mergeSelection].sort((c,l)=>c-l),s=document.getElementById("merge-picked");s&&(s.textContent=e.length?`Picked in page order: ${e.map(c=>`Ch. ${c}`).join(", ")}`:"Tick the downloaded chapters to combine (pages follow chapter order).");const a=document.getElementById("merge-submit");a&&(a.disabled=e.length===0);const n=wa(t,e),r=document.getElementById("merge-target"),o=document.getElementById("merge-title");r&&!g.mergeTargetTouched&&(r.value=n),o&&!g.mergeTitleTouched&&(o.value=n!==""?`Chapter ${n}`:"")}async function Jr(t){var r;const e=g.manga,s=(r=e==null?void 0:e.mergedChapters)==null?void 0:r[t];if(!s)return;const a=s.sources.map(o=>`Ch. ${o}`).join(", "),n=s.sources.includes(t)?` Chapter ${t}'s own pages were folded into the combined folder, so it will need downloading again.`:"";if(confirm(`Split chapter ${t} back into ${a}? The combined folder is deleted; the other originals come back as they are on disk.${n}`))try{await m.unmergeChapter(e.id,t),d(`Chapter ${t} split into ${a}`,"success"),await G(e.id),H([e.id])}catch(o){d("Split failed: "+o.message,"error")}}async function G(t){try{const[e,s]=await Promise.all([m.getBookmark(t),Y.isDemo?Promise.resolve([]):ue.loadCategories()]);if(g.manga=e,g.categories=s,g.loading=!1,g.volumesCollapsed=wr(e),e.website==="Local")try{const r=await m.getCbzFiles(t);g.cbzFiles=r||[]}catch(r){console.error("Failed to load CBZ files:",r),g.cbzFiles=[]}else g.cbzFiles=[];const a=new Set((e.chapters||[]).map(r=>r.number)).size,n=Math.ceil(a/Xe);g.currentPage=Math.max(0,n-1),g.activeVolumeId?g.activeVolume=(e.volumes||[]).find(r=>r.id===g.activeVolumeId):g.activeVolume=null}catch{d("Failed to load manga","error"),g.loading=!1}}async function H(t=[]){const[e,s,a]=t;if(!e){D.go("/");return}g.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!g.manga||g.manga.id!==e?(g.loading=!0,g.manga=null,n.innerHTML=Kt(),await G(e)):g.activeVolumeId?g.activeVolume=(g.manga.volumes||[]).find(r=>r.id===g.activeVolumeId):g.activeVolume=null,n.innerHTML=Kt(),Tr(),bt()}function Yr(){g.manga&&te.unsubscribeFromManga(g.manga.id),g.manga=null,g.loading=!0}const Xr={mount:H,unmount:Yr,render:Kt};function Zr(){return`
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
  `}function ei(t){const e=g.manga;if(!e)return;const s=t.querySelector("#volumes-toggle-btn");s&&s.addEventListener("click",()=>{g.volumesCollapsed=!g.volumesCollapsed,localStorage.setItem(ba(e.id),g.volumesCollapsed?"1":"0");const v=t.querySelector(".volumes-section");v==null||v.classList.toggle("collapsed",g.volumesCollapsed),s.setAttribute("aria-expanded",String(!g.volumesCollapsed)),s.title=g.volumesCollapsed?"Expand volumes":"Collapse volumes";const I=s.querySelector("svg");I&&(I.outerHTML=p(g.volumesCollapsed?"chevron-down":"chevron-up"))});const a=t.querySelector("#add-volume-btn"),n=t.querySelector("#add-volume-modal"),r=t.querySelector("#add-volume-submit-btn");a&&n&&a.addEventListener("click",()=>{n.classList.add("open"),t.querySelector("#add-volume-name-input").focus()}),n==null||n.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(v=>{v.addEventListener("click",()=>n.classList.remove("open"))}),r&&r.addEventListener("click",async()=>{const v=t.querySelector("#add-volume-name-input").value.trim();if(!v)return d("Please enter a volume name","error");try{r.disabled=!0,r.textContent="Creating...",await m.createVolume(e.id,v),d("Volume created successfully!","success"),n.classList.remove("open"),t.querySelector("#add-volume-name-input").value="",await G(e.id),H([e.id])}catch(I){d("Failed to create volume: "+I.message,"error")}finally{r.disabled=!1,r.textContent="Create Volume"}});const o=t.querySelector("#manage-chapters-btn");o&&o.addEventListener("click",()=>{g.manageChapters=!g.manageChapters,H([e.id,"volume",g.activeVolumeId])}),t.querySelectorAll(".add-to-vol-btn").forEach(v=>{v.addEventListener("click",async()=>{const I=parseFloat(v.dataset.num),w=g.activeVolume;if(w)try{v.disabled=!0,v.textContent="...";const A=w.chapters||[];if(A.includes(I))return;const N=[...A,I].sort((F,O)=>F-O);await m.updateVolumeChapters(e.id,w.id,N),d(`Chapter ${I} added to volume`,"success"),await G(e.id),H([e.id,"volume",w.id])}catch(A){d("Failed to add chapter: "+A.message,"error"),v.disabled=!1,v.textContent="Add"}})}),t.querySelectorAll(".remove-from-vol-btn").forEach(v=>{v.addEventListener("click",async I=>{I.stopPropagation();const w=parseFloat(v.dataset.num),A=g.activeVolume;if(A)try{v.disabled=!0,v.textContent="...";const F=(A.chapters||[]).filter(O=>O!==w);await m.updateVolumeChapters(e.id,A.id,F),d(`Chapter ${w} removed from volume`,"success"),await G(e.id),H([e.id,"volume",A.id])}catch(N){d("Failed to remove chapter: "+N.message,"error"),v.disabled=!1,v.textContent="×"}})});const c=t.querySelector("#edit-vol-btn"),l=t.querySelector("#edit-volume-modal");c&&l&&c.addEventListener("click",()=>{const v=c.dataset.volId,I=e.volumes.find(w=>w.id===v);I&&(t.querySelector("#volume-name-input").value=I.name,l.dataset.editingVolId=v,l.classList.add("open"))});const u=t.querySelector("#save-volume-btn");u&&u.addEventListener("click",async()=>{const v=l.dataset.editingVolId,I=t.querySelector("#volume-name-input").value.trim();if(!I)return d("Volume name cannot be empty","error");try{await m.renameVolume(e.id,v,I),d("Volume renamed","success"),l.classList.remove("open"),await G(e.id),H([e.id,"volume",v])}catch(w){d(w.message,"error")}});const h=t.querySelector("#delete-volume-btn");h&&h.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const v=l.dataset.editingVolId;try{await m.deleteVolume(e.id,v),d("Volume deleted","success"),l.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch(I){d(I.message,"error")}});const f=t.querySelector("#vol-cover-upload-btn");if(f){let v=document.getElementById("vol-cover-input-hidden");v||(v=document.createElement("input"),v.type="file",v.id="vol-cover-input-hidden",v.accept="image/*",v.style.display="none",document.body.appendChild(v),v.addEventListener("change",async I=>{const w=I.target.files[0];if(!w)return;const A=v.dataset.mangaId,N=v.dataset.volId,F=document.getElementById("vol-cover-upload-btn");if(v.value="",!(!A||!N))try{F&&(F.disabled=!0,F.textContent="Uploading..."),await m.uploadVolumeCover(A,N,w),d("Cover uploaded","success"),await G(A),H([A,"volume",N])}catch(O){d("Upload failed: "+O.message,"error")}finally{F&&(F.disabled=!1,F.innerHTML=`${p("upload")} Upload Image`)}})),f.addEventListener("click",()=>{v.dataset.mangaId=e.id,v.dataset.volId=l.dataset.editingVolId||"",v.click()})}const y=t.querySelector("#vol-cover-selector-btn"),E=t.querySelector("#cover-selector-modal");y&&E&&y.addEventListener("click",async()=>{const v=E.querySelector("#cover-chapter-select");v.innerHTML='<option value="">Select a chapter...</option>';const I=t.querySelector("#edit-volume-modal"),w=I?I.dataset.editingVolId:null;let A=[...e.chapters||[]];if(w){const F=e.volumes.find(O=>O.id===w);if(F&&F.chapters){const O=new Set(F.chapters);A=A.filter(j=>O.has(j.number))}}A.sort((F,O)=>F.number-O.number);const N=new Set;A.forEach(F=>{if(!N.has(F.number)){N.add(F.number);const O=document.createElement("option");O.value=F.number,O.textContent=`Chapter ${F.number}`,v.appendChild(O)}}),A.length>0&&(v.value=A[0].number,Ts(e.id,A[0].number)),E.classList.add("open")});const S=t.querySelector("#cover-chapter-select");S&&S.addEventListener("change",v=>{v.target.value&&Ts(e.id,v.target.value)}),t.querySelectorAll(".modal-close, .modal-close-btn").forEach(v=>{v.addEventListener("click",()=>{v.closest(".modal").classList.remove("open")})}),t.querySelectorAll(".modal-overlay").forEach(v=>{v.addEventListener("click",()=>{v.closest(".modal").classList.remove("open")})})}async function Ts(t,e){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await m.getChapterImages(t,e)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(r=>{const o=document.createElement("div");o.className="cover-grid-item",o.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",o.innerHTML=`<img src="${r}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,o.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=r.split("/").pop();ti(l,e,c)}),s.appendChild(o)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function ti(t,e,s){const a=g.manga,n=document.getElementById("edit-volume-modal"),r=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const o=n.dataset.editingVolId;if(!o)throw new Error("No volume selected");await m.setVolumeCoverFromChapter(a.id,o,e,t),d("Volume cover updated","success"),r.classList.remove("open"),n.classList.remove("open"),await G(a.id),H([a.id,"volume",o])}else{await m.setMangaCoverFromChapter(a.id,e,t),d("Series cover updated","success"),r.classList.remove("open"),await G(a.id);const o=window.location.hash.replace("#","");g.activeVolumeId?H([a.id,"volume",g.activeVolumeId]):H([a.id])}}catch(o){d("Failed to set cover: "+o.message,"error")}}let fe={series:null,loading:!0};function Ve(){if(fe.loading)return`
      ${le("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=fe.series;if(!t)return`
      ${le("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.entries||[],a=s.reduce((r,o)=>r+(o.chapter_count||0),0);let n=null;if(s.length>0){const r=s[0];r.local_cover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.local_cover.split(/[/\\]/).pop())}`:r.localCover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.localCover.split(/[/\\]/).pop())}`:r.cover&&(n=r.cover)}return`
    ${le("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?Le(n,e,{kind:"series"}):pe("series")}
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
            ${s.map((r,o)=>si(r,o,s.length)).join("")}
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
  `}function si(t,e,s){var r;const a=t.alias||t.title;let n=null;return t.local_cover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.local_cover.split(/[/\\]/).pop())}`:t.localCover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(n=t.cover),`
    <div class="series-entry-card" data-id="${t.bookmark_id}" data-order="${t.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${e+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${t.bookmark_id}" ${e===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${t.bookmark_id}" ${e===s-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?Le(n,a,{kind:"book"}):pe("book")}
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
  `}function Lt(){var l,u,h;const t=document.getElementById("app"),e=fe.series;(l=document.getElementById("back-btn"))==null||l.addEventListener("click",()=>D.go("/")),(u=document.getElementById("back-library-btn"))==null||u.addEventListener("click",()=>D.go("/")),t.querySelectorAll(".series-entry-card").forEach(f=>{f.addEventListener("click",y=>{if(y.target.closest("[data-action]"))return;const E=f.dataset.id;D.go(`/manga/${E}`)})}),t.querySelectorAll("[data-action]").forEach(f=>{f.addEventListener("click",async y=>{y.stopPropagation();const E=f.dataset.action,S=f.dataset.id;switch(E){case"move-up":await Ps(S,-1);break;case"move-down":await Ps(S,1);break;case"set-cover":const v=f.dataset.entryid;await ai(v);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),r=document.getElementById("available-bookmarks-list"),o=document.getElementById("confirm-add-entry-btn");let c=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),r&&(r.innerHTML=""),a.classList.add("open");const f=await m.getAvailableBookmarksForSeries();c=f,f.length===0?(n&&(n.placeholder="No available manga found"),o.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),r&&(r.innerHTML=f.map(y=>`<option value="${(y.alias||y.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),o.disabled=!1)}catch{d("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),o.addEventListener("click",async()=>{const f=n?n.value:"",y=c.find(S=>(S.alias||S.title||"")===f);if(!y){d("Please select a valid manga from the list","warning");return}const E=y.id;try{o.disabled=!0,o.textContent="Adding...",await m.addSeriesEntry(e.id,E),d("Manga added to series","success"),a.classList.remove("open"),await It(e.id),t.innerHTML=Ve(),Lt()}catch(S){d("Failed to add manga: "+S.message,"error")}finally{o.disabled=!1,o.textContent="Add to Series"}})),(h=document.getElementById("edit-series-btn"))==null||h.addEventListener("click",()=>{d("Edit series coming soon","info")})}async function Ps(t,e){const s=fe.series;if(!s)return;const a=s.entries||[],n=a.findIndex(c=>c.bookmark_id===t);if(n===-1)return;const r=n+e;if(r<0||r>=a.length)return;const o=a.map(c=>c.bookmark_id);[o[n],o[r]]=[o[r],o[n]];try{await m.post(`/series/${s.id}/reorder`,{order:o}),d("Order updated","success"),await It(s.id);const c=document.getElementById("app");c.innerHTML=Ve(),Lt()}catch(c){d("Failed to reorder: "+c.message,"error")}}async function ai(t){const e=fe.series;if(e)try{await m.setSeriesCover(e.id,t),d("Series cover updated","success"),await It(e.id);const s=document.getElementById("app");s.innerHTML=Ve(),Lt()}catch(s){d("Failed to set cover: "+s.message,"error")}}async function It(t){try{const e=await m.get(`/series/${t}`);fe.series=e,fe.loading=!1}catch{d("Failed to load series","error"),fe.loading=!1}}async function ni(t=[]){const[e]=t;if(!e){D.go("/");return}const s=document.getElementById("app");fe.loading=!0,fe.series=null,s.innerHTML=Ve(),await It(e),s.innerHTML=Ve(),Lt()}function ri(){fe.series=null,fe.loading=!0}const ii={mount:ni,unmount:ri,render:Ve},oi={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};function li(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const ci={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
            ${le()}
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
        `;let s={};try{const w=await m.get("/settings")||{};s=w;const A=document.getElementById("settings-form"),N=document.getElementById("settings-loader");w.theme&&(document.getElementById("theme").value=w.theme),N.style.display="none",A.style.display="",A.addEventListener("submit",async F=>{F.preventDefault();const O=new FormData(A),j={};for(const[b,x]of O.entries())j[b]=x;try{await m.post("/settings/bulk",j),d("Settings saved successfully"),j.theme}catch(b){console.error(b),d("Failed to save settings","error")}})}catch(w){console.error(w),document.getElementById("settings-loader").textContent="Error loading settings"}window.location.hash.includes("anilist=connected")&&d("AniList connected");const a=document.getElementById("anilist-group"),n=document.getElementById("anilist-status"),r=document.getElementById("anilist-connect"),o=document.getElementById("anilist-sync"),c=document.getElementById("anilist-disconnect"),l=document.getElementById("anilist-sync-result"),u=async()=>{a.style.display="block";try{const w=await m.anilistStatus();w.configured?w.connected?(n.textContent=`Connected as ${w.anilistUsername||"AniList user"}.`,r.style.display="none",o.style.display="",c.style.display=""):(n.textContent="Not connected. Link your AniList account to sync reading progress.",r.style.display="",o.style.display="none",c.style.display="none"):(n.textContent="Not configured — set ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET in .env and restart the server.",r.style.display="none",o.style.display="none",c.style.display="none")}catch(w){console.error(w),n.textContent="Failed to load AniList status — is the server running the latest code?"}};r.addEventListener("click",async()=>{try{const{url:w}=await m.anilistAuthUrl();window.location.href=w}catch(w){d(w.message||"Failed to start AniList connection","error")}}),c.addEventListener("click",async()=>{try{await m.anilistDisconnect(),d("AniList disconnected"),u()}catch{d("Failed to disconnect","error")}}),o.addEventListener("click",async()=>{o.disabled=!0,n.textContent="Syncing from AniList…";try{const w=await m.anilistPull();w.updated.length===0?l.textContent="Everything already up to date.":l.innerHTML="<ul>"+w.updated.map(A=>`<li>${A.title} — marked read up to chapter ${A.markedUpTo}</li>`).join("")+"</ul>",d(`AniList sync: ${w.updated.length} manga updated`)}catch(w){l.textContent="",d(w.message||"AniList sync failed","error")}finally{o.disabled=!1,u()}}),u();const h={...oi,...s.slideshow||{}};h.disabledMangaIds=[...h.disabledMangaIds||[]];const f=document.getElementById("slideshow-interval"),y=document.getElementById("slideshow-shuffle"),E=document.getElementById("slideshow-lists"),S=document.getElementById("slideshow-trophies"),v=document.getElementById("slideshow-manga-list");f.value=String(h.intervalMs),f.value||(f.value="8000"),y.checked=!!h.shuffle,E.checked=!!h.includeLists,S.checked=!!h.includeTrophies;const I=async()=>{if(!Y.isDemo)try{await m.post("/settings",{key:"slideshow",value:h})}catch(w){console.error(w),d("Failed to save slideshow settings","error")}};f.addEventListener("change",()=>{h.intervalMs=parseInt(f.value,10)||8e3,I()}),y.addEventListener("change",()=>{h.shuffle=y.checked,I()}),E.addEventListener("change",()=>{h.includeLists=E.checked,I()}),S.addEventListener("change",()=>{h.includeTrophies=S.checked,I()}),document.getElementById("slideshow-start").addEventListener("click",()=>{var w,A;(A=(w=document.documentElement).requestFullscreen)==null||A.call(w).catch(()=>{}),D.go("/slideshow")});try{const w=await m.getAllVolumes();if(w.length===0)v.innerHTML=`<p class="settings-hint">No manga with volumes yet — create volumes from a manga's page first.</p>`;else{const A=new Set(h.disabledMangaIds);v.innerHTML=w.map(N=>{const F=li(N.alias||N.title),O=N.volumes.filter(x=>x.cover).length,j=N.localCover?`/api/public/covers/${N.id}/${encodeURIComponent(N.localCover.split(/[/\\]/).pop())}`:N.cover,b=O===0;return`
                        <label class="slideshow-manga-row${b?" no-covers":""}" title="${b?"No volume covers yet":F}">
                            <input type="checkbox" data-manga-id="${N.id}" ${!A.has(N.id)&&!b?"checked":""} ${b?"disabled":""}>
                            <span class="slideshow-manga-thumb">${j?Le(j,F,{kind:"book"}):pe("book")}</span>
                            <span class="slideshow-manga-info">
                                <span class="slideshow-manga-name">${F}</span>
                                <span class="slideshow-manga-meta">${N.volumes.length} volume${N.volumes.length===1?"":"s"} · ${O} cover${O===1?"":"s"}</span>
                            </span>
                        </label>
                    `}).join(""),v.addEventListener("change",N=>{const F=N.target.closest("input[data-manga-id]");if(!F)return;const O=F.dataset.mangaId;F.checked?h.disabledMangaIds=h.disabledMangaIds.filter(j=>j!==O):h.disabledMangaIds.includes(O)||h.disabledMangaIds.push(O),I()})}}catch(w){console.error(w),v.innerHTML='<p class="settings-hint">Failed to load manga list.</p>'}}},di={mount:async t=>{const e=document.getElementById("app");if(!Y.isAdmin){e.innerHTML=`
                ${le()}
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
        `,document.querySelectorAll(".admin-tab").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(a=>a.classList.remove("active")),s.classList.add("active"),document.querySelectorAll(".admin-section").forEach(a=>a.style.display="none"),document.getElementById(`admin-section-${s.dataset.section}`).style.display=""})}),await Promise.all([ut(),ui(),hi()])}};async function ut(){const t=document.getElementById("admin-section-users");try{const e=await m.listUsers();t.innerHTML=`
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
                                <td>${Jt(s.username)}${s.id===((a=Y.user)==null?void 0:a.id)?' <span class="badge">you</span>':""}</td>
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
        `,t.querySelectorAll("tr[data-user-id]").forEach(s=>{const a=Number(s.dataset.userId),n=async()=>{try{await m.updateUser(a,{role:s.querySelector(".user-role").value,canDownload:s.querySelector(".user-can-download").checked,canEdit:s.querySelector(".user-can-edit").checked}),d("User updated","success")}catch(r){d(r.message,"error"),ut()}};s.querySelector(".user-role").addEventListener("change",n),s.querySelector(".user-can-download").addEventListener("change",n),s.querySelector(".user-can-edit").addEventListener("change",n),s.querySelector(".user-reset-pw").addEventListener("click",async()=>{const r=prompt("New password for this user:");if(r)try{await m.updateUser(a,{password:r}),d("Password reset","success")}catch(o){d(o.message,"error")}}),s.querySelector(".user-delete").addEventListener("click",async()=>{if(confirm("Delete this user?"))try{await m.deleteUser(a),d("User deleted","success"),ut()}catch(r){d(r.message,"error")}})}),document.getElementById("add-user-form").addEventListener("submit",async s=>{s.preventDefault();try{await m.createUser({username:document.getElementById("new-username").value.trim(),password:document.getElementById("new-password").value,role:document.getElementById("new-role").value,canDownload:document.getElementById("new-can-download").checked,canEdit:document.getElementById("new-can-edit").checked}),d("User created","success"),ut()}catch(a){d(a.message,"error")}})}catch(e){console.error(e),t.innerHTML='<div class="error">Failed to load users</div>'}}async function ui(){const t=document.getElementById("admin-section-demo");try{const e=await m.getBookmarks();t.innerHTML=`
            <h2>Demo Content</h2>
            <p class="admin-demo-warning">
                Checked series are visible to <strong>anyone</strong> on the public demo page
                (<code>/demo.html</code>) — no login needed, covers included. Only downloaded
                chapters are readable there. Be deliberate about adult titles.
            </p>
            <input type="search" id="demo-filter" placeholder="Filter series..." class="admin-demo-filter">
            <ul class="admin-demo-list">
                ${e.map(s=>`
                    <li data-title="${Jt((s.alias||s.title||"").toLowerCase())}">
                        <label>
                            <input type="checkbox" class="demo-toggle" data-id="${s.id}" ${s.isDemo?"checked":""}>
                            <span>${Jt(s.alias||s.title)}</span>
                            <span class="badge">${s.downloadedCount||0} downloaded</span>
                        </label>
                    </li>
                `).join("")}
            </ul>
        `,t.querySelectorAll(".demo-toggle").forEach(s=>{s.addEventListener("change",async()=>{try{await m.toggleDemo(s.dataset.id,s.checked),d(s.checked?"Added to demo":"Removed from demo","success")}catch(a){s.checked=!s.checked,d(a.message,"error")}})}),document.getElementById("demo-filter").addEventListener("input",s=>{const a=s.target.value.toLowerCase();t.querySelectorAll(".admin-demo-list li").forEach(n=>{n.style.display=n.dataset.title.includes(a)?"":"none"})})}catch(e){console.error(e),t.innerHTML='<div class="error">Failed to load bookmarks</div>'}}function Jt(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}async function hi(){try{const t=await m.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
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
        `,e.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;Yt(n),e.querySelectorAll(".table-link").forEach(r=>r.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(t){console.error(t),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function Yt(t,e=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${t}...</div>`;try{const o=await m.get(`/admin/tables/${t}?page=${e}&limit=50`);if(!o.rows||o.rows.length===0){s.innerHTML=`
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
                                ${c.map(u=>{const h=l[u];let f=h;return h===null?f='<span class="null">NULL</span>':typeof h=="object"?f=JSON.stringify(h):String(h).length>100&&(f=String(h).substring(0,100)+"..."),`<td>${f}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>Yt(t,e-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>Yt(t,e+1))}catch(r){console.error(r),s.innerHTML=`<div class="error">Failed to load data for ${t}</div>`}}let ne={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function pi(t,e){let s=null;if(e.length>0){const n=e[0];if(n.imagePaths&&n.imagePaths.length>0){const r=n.imagePaths[0];let o;typeof r=="string"?o=r:r&&typeof r=="object"&&(o=r.filename||r.path||r.name||r.url,o&&o.includes("/")&&(o=o.split("/").pop()),o&&o.includes("\\")&&(o=o.split("\\").pop())),o&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(o)}`)}}const a=e.reduce((n,r)=>{var o;return n+(((o=r.imagePaths)==null?void 0:o.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${t}">
      <div class="manga-card-cover">
        ${s?Le(s,t,{kind:"folder"}):pe("folder")}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function mi(t){const e=ne.bookmarks.find(s=>s.id===t);return e?e.alias||e.title:t}function gi(t){const e=ne.bookmarks.find(s=>s.id===t);if(e&&e.seriesId){const s=ne.series.find(a=>a.id===e.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function fi(t,e,s,a=!1){return`
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
  `}function vi(){const t={};console.log("Building trophy groups from:",ne.trophyPages);for(const e of Object.keys(ne.trophyPages)){const s=ne.trophyPages[e];let a=0;for(const[r,o]of Object.entries(s))a+=Object.keys(o).length;if(console.log(`Manga ${e}: ${a} trophies`),a===0)continue;const n=gi(e);if(n)t[n.id]||(t[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),t[n.id].count+=a,t[n.id].mangaIds.push(e);else{const r=mi(e);console.log(`No series for ${e}, using name: ${r}`),t[e]={name:r,isSeries:!1,count:a,mangaIds:[e]}}}return console.log("Trophy groups result:",t),t}function wt(){if(ne.loading)return`
      ${le("manga")}
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
          ${e.map(r=>{const o=t&&t[r]||[];return pi(r,o)}).join("")}
        </div>
      `;else{const n=vi(),r=Object.keys(n);r.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${r.map(c=>{const l=n[c];return fi(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${le("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function $a(){Ie();const t=document.getElementById("app");t.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{ne.activeTab=s.dataset.tab,t.innerHTML=wt(),$a()})}),t.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;D.go(`/read/gallery/${encodeURIComponent(a)}`)})}),t.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?D.go(`/read/trophies/series-${a}/🏆`):D.go(`/read/trophies/${a}/🏆`)})})}async function yi(){try{const[t,e,s,a]=await Promise.all([ue.loadFavorites(),m.get("/trophy-pages"),ue.loadBookmarks(),ue.loadSeries()]);ne.favorites=t||{favorites:{},listOrder:[]},ne.trophyPages=e||{},ne.bookmarks=s||[],ne.series=a||[],ne.loading=!1}catch(t){console.error("Failed to load favorites:",t),d("Failed to load favorites","error"),ne.loading=!1}}async function bi(){console.log("[Favorites] mount called"),ne.loading=!0;const t=document.getElementById("app");t.innerHTML=wt(),await yi(),console.log("[Favorites] Data loaded, rendering..."),t.innerHTML=wt(),console.log("[Favorites] Calling setupListeners..."),$a(),console.log("[Favorites] setupListeners complete")}function wi(){}const ki={mount:bi,unmount:wi,render:wt},kt="site-challenge-banner",Ea="site-cookie-modal",ps=new Set;function ie(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ms(t,e){window.open(e||`https://${t}/`,"_blank","noopener")}function Ye(){const t=document.getElementById(Ea);t&&t.remove(),document.removeEventListener("keydown",Ca)}function Ca(t){t.key==="Escape"&&Ye()}function $i(t,e){var n;const s=((n=e.session)==null?void 0:n.cookieCount)??0,a=e.probe;return a&&a.ok?{kind:"ok",html:`<strong>${ie(t)} accepted the cookies.</strong> ${s} saved; update checks for this site resume.
                   Downloads that stopped on the check can be retried from the <a href="#/queue">Task Queue</a>.`}:a&&!a.ok&&a.error?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but the server could not load ${ie(t)} to test them.</strong>
                   ${ie(a.error)}. Retry a download to find out whether they work.`}:a&&!a.ok?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but ${ie(t)} still shows its check to the server.</strong>
                   Usually one of: the check was done on a different network than the server (the cookie can be tied to the
                   IP address), or in a different browser than the identity filled in above. Complete the check again from a
                   device on the server's network, export the cookies right away, make sure the identity is that browser's,
                   and paste again.${a.error?`<br><small>${ie(a.error)}</small>`:""}`}:{kind:"ok",html:`<strong>Saved ${s} cookie${s===1?"":"s"}.</strong> The site could not be tested right now; retry your download to find out.`}}function gs({site:t,url:e,stale:s=!1,onImported:a}={}){if(!t)return;if(!Y.isAdmin){d("Only an admin can hand site cookies to the scraper","error");return}Ye();const n=navigator.userAgent||"",r=document.createElement("div");r.id=Ea,r.className="modal open site-cookie-modal",r.innerHTML=`
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
    `,document.body.appendChild(r),document.addEventListener("keydown",Ca);const o=r.querySelector("#site-cookie-input"),c=r.querySelector("#site-cookie-ua"),l=r.querySelector("#site-cookie-result"),u=r.querySelector('[data-act="save"]'),h=(y,E)=>{l.className=`site-cookie-result ${y}`,l.innerHTML=E,l.hidden=!1};r.querySelector(".modal-overlay").addEventListener("click",Ye),r.querySelectorAll('[data-act="close"]').forEach(y=>y.addEventListener("click",Ye)),r.querySelector('[data-act="open"]').addEventListener("click",()=>ms(t,e));let f=!1;u.addEventListener("click",async()=>{var E;if(f)return;const y=o.value.trim();if(!y){h("error","Paste the cookies first."),o.focus();return}f=!0,u.disabled=!0,u.textContent="Saving & testing…",l.hidden=!0;try{const S=await m.importSiteSession(t,y,c.value.trim()),{kind:v,html:I}=$i(t,S),w=S.ignored||{},A=[];w.foreign&&A.push(`${w.foreign} for other sites`),w.expired&&A.push(`${w.expired} already expired`),w.invalid&&A.push(`${w.invalid} unreadable`),h(v,I+(A.length?`<br><small>Skipped: ${A.join(", ")}.</small>`:"")),o.value="",typeof a=="function"&&a(S),(E=S.probe)!=null&&E.ok&&(d(`${t}: cookies accepted, checks resume`,"success"),setTimeout(Ye,2500))}catch(S){h("error",ie(S.message||"Import failed"))}finally{f=!1,u.disabled=!1,u.textContent="Save & test"}}),o.focus()}function Ei(t){var n;let e=document.getElementById(kt);e||(e=document.createElement("div"),e.id=kt,e.className="site-challenge-banner",document.body.appendChild(e)),e.dataset.site=t.site;const s=Y.isAdmin;let a=t.sessionStale?`<strong>${ie(t.site)}</strong> no longer accepts the cookies handed over earlier. Complete its verification check again and paste fresh ones.`:`<strong>${ie(t.site)}</strong> is asking for a human verification check. Automatic update checks for this site are paused and downloads stop at the first blocked chapter until someone completes it and hands over its cookies.`;s||(a+=" Ask an admin to do that."),e.innerHTML=`
        <div class="site-challenge-text">${a}</div>
        <div class="site-challenge-actions">
            <button class="btn btn-primary btn-sm" data-act="open">${s?"1. ":""}Open ${ie(t.site)}</button>
            ${s?'<button class="btn btn-primary btn-sm" data-act="import">2. Paste cookies</button>':""}
            <button class="btn btn-secondary btn-sm" data-act="retry" title="Resume without handing over cookies. Only works if the site stopped asking.">Retry anyway</button>
            <button class="site-challenge-close" data-act="close" title="Hide">×</button>
        </div>
    `,e.querySelector('[data-act="open"]').addEventListener("click",()=>ms(t.site,t.url)),(n=e.querySelector('[data-act="import"]'))==null||n.addEventListener("click",()=>{gs({site:t.site,url:t.url,stale:!!t.sessionStale})}),e.querySelector('[data-act="retry"]').addEventListener("click",async()=>{try{await m.clearSiteChallenge(t.site),d(`${t.site}: checks resumed. If the puzzle comes back, hand over its cookies instead.`,"info")}catch(r){d("Failed: "+r.message,"error")}Xt()}),e.querySelector('[data-act="close"]').addEventListener("click",()=>{ps.add(t.site),Xt()}),e.classList.add("show")}function Xt(){const t=document.getElementById(kt);t&&t.remove()}function Rs(t){!t||ps.has(t.site)||Ei(t)}async function Ki(){te.on("site:challenge",t=>{ps.delete(t.site),Rs(t)}),te.on("site:challenge-cleared",({site:t})=>{const e=document.getElementById(kt);e&&e.dataset.site===t&&Xt()});try{const e=((await m.getSiteStatus()).challenges||[])[0];e&&Rs(e)}catch{}}let Q={downloads:{},queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,showEmptyChecks:!1,collapsed:{active:!1,scheduled:!1,completed:!1,history:!0}},ht=null,he={};function fs(t){if(!t)return"Never";const e=Date.now()-new Date(t).getTime(),s=Math.floor(e/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function Ci(t){if(!t)return"Not scheduled";const e=new Date(t).getTime()-Date.now();if(e<=0)return"Running now...";const s=Math.floor(e/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const r=Math.floor(a/24),o=a%24;return`in ${r}d ${o}h`}function Sa(t){switch(t){case"download":return p("download");case"scrape":return p("search");case"scan":return p("folder");default:return p("settings")}}function vs(t){switch(t){case"running":return"var(--color-success)";case"queued":case"pending":return"var(--color-warning)";case"paused":return"var(--color-info)";case"complete":return"var(--color-success)";case"error":case"failed":case"cancelled":return"var(--color-error)";default:return"var(--text-secondary)"}}function ys(t){switch(t){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return t}}function Si(t){return!t||t==="default"?"Default (6h)":t==="daily"?"Daily":t==="weekly"?"Weekly":t}function xi(){const t=Q.autoCheck;return t?`
    <div class="queue-inline-header">
      <span class="text-muted">${t.enabledCount} monitored · Last: ${fs(t.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">${p("play")} Run All Now</button>
    </div>
  `:""}function Li(t){const e=t.nextCheck?Ci(t.nextCheck):"Not set",s=t.nextCheck&&new Date(t.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${t.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${p("book-open")}</span>
          <div>
            <div class="task-title">${t.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${Si(t.schedule)}${t.schedule==="weekly"&&t.day?` · ${t.day.charAt(0).toUpperCase()+t.day.slice(1)}`:""}${(t.schedule==="daily"||t.schedule==="weekly")&&t.time?` · ${t.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?`${p("alarm-clock")} Due now`:e}</span>
        </div>
      </div>
    </div>
  `}function Rt(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function qs(t,e){const s=e.total>0?Math.round(e.completed/e.total*100):0,a=e.status==="running"||e.status==="queued",n=e.status==="paused",r=e.errors&&e.errors.length>0,o=!a&&!n&&r&&(e.chapterUrls||[]).length>0;return`
    <div class="queue-card task-card" data-task-id="${t}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${p("download")}</span>
          <div>
            <div class="task-title">${e.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${vs(e.status)}">${ys(e.status)}</div>
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
          <ul class="task-error-list">${e.errors.slice(0,5).map(c=>`<li>${typeof c.chapter=="number"?`Ch. ${c.chapter}: `:""}${Rt(c.error)}</li>`).join("")}</ul>`:""}
        ${e.challenge?(()=>{const c=Rt(e.challenge.site),l=Rt(e.challenge.url||`https://${e.challenge.site}/`),u=Y.isAdmin;return`
          <div class="task-challenge">
            <span>${e.challenge.sessionStale?`${c} no longer accepts the cookies handed over earlier. Complete its check again, paste fresh cookies, then retry.`:`${c} wants a human verification check. Complete it in your browser, hand over its cookies, then retry here.`}${u?"":" (An admin has to hand the cookies over.)"}</span>
            <button class="btn btn-sm btn-primary" data-action="open-site" data-site="${c}" data-url="${l}">${u?"1. ":""}Open ${c}</button>
            ${u?`<button class="btn btn-sm btn-primary" data-action="import-cookies" data-site="${c}" data-url="${l}" data-stale="${e.challenge.sessionStale?"1":""}">2. Paste cookies</button>`:""}
            <button class="btn btn-sm btn-secondary" data-action="retry" data-task="${t}">${u?"3. ":""}Retry download</button>
          </div>`})():o?`
          <div class="task-challenge">
            <button class="btn btn-sm btn-secondary" data-action="retry" data-task="${t}">Retry failed chapters</button>
          </div>`:""}
      </div>
    </div>
  `}function Ii(t){const e=t.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Sa(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${vs(t.status)}">${ys(t.status)}</div>
          </div>
        </div>
      </div>
      ${t.started_at?`<div class="queue-card-body"><small>Started: ${fs(t.started_at)}</small></div>`:""}
    </div>
  `}function Bi(t){const e=t.data||{},s=t.result||{};let a="";if(t.type==="scrape")s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${t.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>');else if(t.type==="scan"||t.type==="scan-local")s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`);else if(t.type==="download"){if(t.status==="failed"&&t.error)a=`<div class="task-subtext" style="color: var(--color-error, #e05555);">${t.error}</div>`;else if(s.downloaded!==void 0){const n=[`${s.downloaded} chapter${s.downloaded===1?"":"s"} downloaded`];s.pages&&n.push(`${s.pages} pages`),s.failed&&n.push(`${s.failed} failed`);const r=(s.errors||[]).filter(o=>o.partial);r.length&&n.push(`${r.length} with missing pages`),a=`<div class="task-subtext" style="color: var(--text-secondary);">${n.join(" · ")}</div>`}}return`
    <div class="queue-card task-card history-card" data-history-id="${t.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Sa(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${vs(t.status)}">${ys(t.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${t.completed_at?`<div class="queue-card-body"><small>Completed: ${fs(t.completed_at)}</small></div>`:""}
    </div>
  `}function Ai(){var c;const t=Object.entries(Q.downloads),e=t.filter(([,l])=>l.status!=="complete"),s=t.filter(([,l])=>l.status==="complete"),a=new Set(e.map(([,l])=>l.bookmarkId).filter(Boolean)),n=Q.queueTasks.filter(l=>{var u;return!(l.type==="download"&&((u=l.data)!=null&&u.mangaId)&&a.has(l.data.mangaId))}),r=e.length+n.length,o=((c=Q.autoCheck)==null?void 0:c.schedules)||[];return`
    ${le("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>${p("list-checks")} Task Queue</h2>
        ${r>0?`<span class="queue-badge">${r} active</span>`:""}
      </div>

      ${e.length>0||n.length>0?`
        <div class="queue-section ${Q.collapsed.active?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${e.map(([l,u])=>qs(l,u)).join("")}
            ${n.map(l=>Ii(l)).join("")}
          </div>
        </div>
      `:""}

      ${o.length>0?`
        <div class="queue-section ${Q.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${o.length})
            </h3>
            ${xi()}
          </div>
          <div class="queue-section-content">
            ${o.map(l=>Li(l)).join("")}
          </div>
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section ${Q.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${s.map(([l,u])=>qs(l,u)).join("")}
          </div>
        </div>
      `:""}

      ${Q.historyTasks&&Q.historyTasks.length>0?(()=>{const l=f=>{if(f.type!=="scrape")return!1;const y=f.result||{};return(f.status==="complete"||f.status==="completed")&&(y.newChaptersCount===0||y.updated===!1)},u=Q.historyTasks.filter(l).length,h=Q.showEmptyChecks?Q.historyTasks:Q.historyTasks.filter(f=>!l(f));return`
        <div class="queue-section ${Q.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${u>0?`
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${Q.showEmptyChecks?"Hide":"Show"} checks with no new chapters">
                    ${Q.showEmptyChecks?`${p("chevron-up")} Hide`:`${p("chevron-down")} Show`} empty checks (${u})
                  </button>
                `:""}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  ${p("trash-2")} Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${h.length>0?h.map(f=>Bi(f)).join(""):`
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${u>0?`${u} empty check(s) hidden.`:""}</p>
                  </div>
                `}
            </div>
        </div>
      `})():""}

      ${e.length===0&&n.length===0&&s.length===0&&o.length===0&&(!Q.historyTasks||Q.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">${p("check")}</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function Re(){try{const[t,e,s,a]=await Promise.all([m.getDownloads().catch(()=>({})),m.getQueueTasks().catch(()=>[]),m.getQueueHistory(50).catch(()=>[]),m.getAutoCheckStatus().catch(()=>null)]);Q.downloads=t||{},Q.queueTasks=e||[],Q.historyTasks=s||[],Q.autoCheck=a,Q.loading=!1}catch(t){console.error("[Queue] Failed to load data:",t),Q.loading=!1}}function $e(){const t=document.getElementById("app");t&&(t.innerHTML=Ai(),_i())}function _i(){Ie(),document.querySelectorAll("[data-toggle]").forEach(a=>{a.addEventListener("click",n=>{const r=a.dataset.toggle;Q.collapsed[r]=!Q.collapsed[r],$e()})});const t=document.getElementById("run-autocheck-btn");t&&t.addEventListener("click",async()=>{t.disabled=!0,t.innerHTML=`${p("loader",{spin:!0})} Running...`;try{d("Auto-check started...","info");const a=await m.runAutoCheck();d(`Check complete: ${a.checked} checked, ${a.updated} updated`,"success"),await Re(),$e()}catch(a){d("Auto-check failed: "+a.message,"error"),t.disabled=!1,t.innerHTML=`${p("play")} Run Now`}});const e=document.getElementById("clear-history-btn");e&&e.addEventListener("click",async a=>{if(a.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await m.clearQueueHistory(),d("History cleared","success"),await Re(),$e()}catch(n){d(`Failed to clear history: ${n.message}`,"error")}});const s=document.getElementById("toggle-empty-checks-btn");s&&s.addEventListener("click",a=>{a.stopPropagation(),Q.showEmptyChecks=!Q.showEmptyChecks,$e()}),document.querySelectorAll(".scheduled-manga-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.mangaId;n&&(window.location.hash=`#/manga/${n}`)})}),document.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const r=a.dataset.action,o=a.dataset.task;if(r==="open-site"){ms(a.dataset.site,a.dataset.url);return}if(r==="import-cookies"){gs({site:a.dataset.site,url:a.dataset.url,stale:a.dataset.stale==="1"});return}try{if(r==="pause")await m.pauseDownload(o),d("Download paused","info");else if(r==="resume")await m.resumeDownload(o),d("Download resumed","info");else if(r==="cancel")confirm("Cancel this download?")&&(await m.cancelDownload(o),d("Download cancelled","info"));else if(r==="retry"){const c=await m.retryDownload(o);d(`Retrying ${c.chapters.length} chapter${c.chapters.length===1?"":"s"}`,"info")}await Re(),$e()}catch(c){d(`Action failed: ${c.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.historyId,r=document.getElementById(`task-details-${n}`);r&&r.classList.toggle("hidden")})})}async function Mi(){Q.loading=!0;const t=document.getElementById("app");t.innerHTML=`
    ${le("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>${p("list-checks")} Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,Ie(),await Re(),$e(),ht=setInterval(async()=>{await Re(),$e()},5e3),he.downloadProgress=e=>{e.taskId&&Q.downloads[e.taskId]&&(Object.assign(Q.downloads[e.taskId],e),$e())},he.downloadCompleted=e=>{Re().then($e)},he.queueUpdated=e=>{Re().then($e)},te.on(oe.DOWNLOAD_PROGRESS,he.downloadProgress),te.on(oe.DOWNLOAD_COMPLETED,he.downloadCompleted),te.on(oe.QUEUE_UPDATED,he.queueUpdated)}function Ti(){ht&&(clearInterval(ht),ht=null),he.downloadProgress&&te.off(oe.DOWNLOAD_PROGRESS,he.downloadProgress),he.downloadCompleted&&te.off(oe.DOWNLOAD_COMPLETED,he.downloadCompleted),he.queueUpdated&&te.off(oe.QUEUE_UPDATED,he.queueUpdated),he={}}const Pi={mount:Mi,unmount:Ti};function we(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ri(t){if(!t)return"";const e=Math.floor((Date.now()-new Date(t).getTime())/6e4);if(e<1)return"just now";if(e<60)return`${e}m ago`;const s=Math.floor(e/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}class qi{constructor(){this.container=null,this.scrapers=[],this.siteStatus={challenges:[],sessions:[]},this.onSiteStatusChange=null,this.currentQuery="",this.currentTarget="all",this.isSearching=!1,this.results=[],this.viewMode="main",this.browseScraper=null,this.browseQuery="",this.browseSort="popular",this.browsePage=1,this.browseTotalPages=1,this.isBrowsing=!1,this.browseResults=[],this.previewInfo=null,this.previewImages=[],this.previewIndex=0,this.infoAbortController=null}async mount(e){this.container=document.getElementById("app"),document.body.className="scrapers-mode";const s=new URLSearchParams(window.location.hash.split("?")[1]||""),a=s.get("browse"),n=s.get("q");a&&(this.browseScraper=a,this.viewMode="browse",this.browseQuery=n||"",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1),this.updateView(),this.onSiteStatusChange=()=>this.loadSiteStatus(),te.on(oe.SITE_SESSION,this.onSiteStatusChange),te.on(oe.SITE_CHALLENGE,this.onSiteStatusChange),te.on(oe.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),await this.loadScrapers(),this.viewMode==="browse"&&this.browseScraper?(a&&(this.startBrowse(a,{query:n||null}),this.updateView()),this.performBrowse()):n&&(this.currentQuery=n,this.updateView(),this.performSearch())}unmount(){this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.onSiteStatusChange&&(te.off(oe.SITE_SESSION,this.onSiteStatusChange),te.off(oe.SITE_CHALLENGE,this.onSiteStatusChange),te.off(oe.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),this.onSiteStatusChange=null),this.container.innerHTML="",document.body.className=""}async loadScrapers(){try{const[e,s]=await Promise.all([m.get("/scrapers/list"),m.getSiteStatus().catch(()=>({challenges:[],sessions:[]}))]);this.siteStatus=s||{challenges:[],sessions:[]},e.success&&(this.scrapers=e.scrapers,this.updateView())}catch(e){console.error("Failed to load scrapers",e)}}async loadSiteStatus(){try{this.siteStatus=await m.getSiteStatus()}catch{return}document.getElementById("scraper-cards-list")&&(this.renderScraperList(),this.bindCardEvents())}sessionFor(e){return(this.siteStatus.sessions||[]).find(s=>s.site===e)||null}browseConfig(e=this.browseScraper){const s=this.scrapers.find(n=>n.name===e),a=s&&s.browseOptions;return{sorts:a&&a.sorts&&a.sorts.length?a.sorts:[{value:"popular",label:"Popular"}],defaultSort:a&&a.defaultSort||"popular",defaultQuery:a&&a.defaultQuery||"",queryLabel:a&&a.queryLabel||"Search",queryPlaceholder:a&&a.queryPlaceholder||"Optional: title to search for"}}startBrowse(e,{query:s=null,sort:a=null}={}){const n=this.browseConfig(e);this.browseScraper=e,this.viewMode="browse",this.browseQuery=s??n.defaultQuery,this.browseSort=a&&n.sorts.some(r=>r.value===a)?a:n.defaultSort,this.browsePage=1,this.browseResults=[],this.browseTotalPages=1}challengeFor(e){return(this.siteStatus.challenges||[]).find(s=>s.site===e)||null}renderSessionRow(e){if(!e.supportsSession)return"";const s=this.sessionFor(e.name),a=this.challengeFor(e.name);let n;if(s&&s.stale)n=`<span class="capability-pill capability-soon" title="${we(s.staleReason||"The site showed its check again")}">${p("triangle-alert")} Rejected, paste fresh</span>`;else if(s&&s.cookieCount===0)n=`<span class="capability-pill capability-soon" title="Every saved cookie has expired">${p("triangle-alert")} Expired, paste fresh</span>`;else if(s){const r=Ri(s.updatedAt||s.importedAt),o=Y.isAdmin?`${(s.cookieNames||[]).join(", ")}${s.userAgent?`
${s.userAgent}`:""}`:"";n=`<span class="capability-pill capability-yes" title="${we(o)}">✓ ${s.cookieCount} cookie${s.cookieCount===1?"":"s"}${r?` · ${r}`:""}</span>`}else a?n=`<span class="capability-pill capability-soon">${p("triangle-alert")} Check pending</span>`:n='<span class="capability-pill capability-no">None</span>';return`
      <div class="capability-row">
        <span class="capability-label" title="Cookies from a browser that completed the site's human check">${p("lock-open")} Session</span>
        <span class="scraper-session-cell">
          ${n}
          ${s&&Y.isAdmin?`<button type="button" class="scraper-session-forget" data-scraper="${we(e.name)}" title="Forget these cookies">Forget</button>`:""}
        </span>
      </div>`}bindCardEvents(){document.querySelectorAll(".scraper-search-card-btn").forEach(e=>{e.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper;this.currentTarget=a;const n=document.getElementById("scraper-query");n&&(this.currentQuery=n.value.trim()),this.updateView();const r=document.getElementById("scraper-query");r&&(r.focus(),window.scrollTo({top:0,behavior:"smooth"}),this.currentQuery&&this.performSearch())})}),document.querySelectorAll(".scraper-browse-card-btn").forEach(e=>{e.addEventListener("click",s=>{this.startBrowse(s.currentTarget.dataset.scraper),this.updateView(),this.performBrowse()})}),document.querySelectorAll(".scraper-session-card-btn").forEach(e=>{e.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper,n=this.challengeFor(a),r=this.sessionFor(a),o=!!r&&(r.stale||r.cookieCount===0);gs({site:a,url:n==null?void 0:n.url,stale:o,onImported:()=>this.loadSiteStatus()})})}),document.querySelectorAll(".scraper-session-forget").forEach(e=>{e.addEventListener("click",async s=>{const a=s.currentTarget.dataset.scraper;if(confirm(`Forget the saved ${a} cookies? The scraper goes back to its own identity.`))try{(await m.forgetSiteSession(a)).purged===null?d(`${a}: cookies forgotten, but they may stay in the scraper browser until it restarts`,"warning"):d(`${a}: saved cookies forgotten`,"info"),await this.loadSiteStatus()}catch(n){d(`Failed: ${n.message}`,"error")}})})}updateView(){this.render(),this.renderScraperList(),(this.results.length>0||this.isSearching)&&this.renderResults(),this.bindEvents()}render(){this.container.innerHTML=`
      ${le()}
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
            ${n.supportsSession&&Y.isAdmin?`
            <button
              class="btn btn-secondary scraper-session-card-btn"
              data-scraper="${we(n.name)}"
              title="Hand over cookies from a browser that completed ${we(n.name)}'s human check"
            >${p("lock-open")} Cookies</button>`:""}
          </div>

        </div>
      `);e.innerHTML=a.join("")}getDomainIcon(e){const s=e.toLowerCase();return s.includes("comix")?p("library"):s.includes("mangahere")?p("book-open"):s.includes("nhentai")?p("shield-alert"):s.includes("chained")?p("link"):p("globe")}bindEvents(){const e=document.getElementById("scraper-search-form");e&&e.addEventListener("submit",y=>{y.preventDefault();const E=document.getElementById("scraper-query");E&&E.value.trim()&&(this.currentQuery=E.value.trim(),this.performSearch())});const s=document.getElementById("clear-target-btn");s&&s.addEventListener("click",()=>{this.currentTarget="all",this.updateView();const y=document.getElementById("scraper-query");y&&y.focus()}),this.bindCardEvents();const a=document.getElementById("exit-browse-btn");a&&a.addEventListener("click",()=>{this.viewMode="main",this.updateView()});const n=document.getElementById("browse-apply-btn");n&&n.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse()});const r=document.getElementById("browse-refresh-btn");r&&r.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse(!1,!0)});const o=document.getElementById("browse-query");o&&o.addEventListener("keypress",y=>{y.key==="Enter"&&n.click()});const c=document.getElementById("browse-load-more-btn");c&&c.addEventListener("click",()=>{!this.isBrowsing&&this.browsePage<this.browseTotalPages&&(this.browsePage++,this.performBrowse(!0))});const l=document.getElementById("preview-close-btn");l&&l.addEventListener("click",()=>{this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),document.getElementById("preview-info-modal").style.display="none"});const u=document.getElementById("preview-add-btn");u&&u.addEventListener("click",()=>{this.previewInfo&&this.previewInfo.url&&this.openAddModal(this.previewInfo.url,u)});const h=document.getElementById("preview-read-btn");h&&h.addEventListener("click",()=>{h.disabled||(this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.openTempReader())});const f=document.getElementById("temp-reader-close");f&&f.addEventListener("click",()=>{document.getElementById("temp-reader-overlay").style.display="none"})}async performSearch(){const e=document.getElementById("scraper-results-container"),s=document.getElementById("scraper-search-btn");if(!e||!s)return;this.isSearching=!0,e.style.display="block",s.textContent="Searching...",s.disabled=!0;const a=this.currentTarget==="all"?"all sites":this.currentTarget;e.innerHTML=`
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
      `;return}let s='<div class="library-grid" style="margin-top: 2rem;">';this.results.forEach(a=>{const n=a.cover||"";let r="";n.startsWith("/covers/")?r=n:n&&(r=`/api/scrapers/proxy-cover?url=${encodeURIComponent(n)}`);const o=r?Le(r,"Cover",{kind:"series",self:!0}):pe("series");s+=`
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
      `,a.style.display="none";return}let n="";this.browseResults.forEach((r,o)=>{const c=r.cover||"";let l="";c.startsWith("/covers/")?l=c:c&&(l=`/api/scrapers/proxy-cover?url=${encodeURIComponent(c)}`);const u=l?Le(l,"Cover",{kind:"series",self:!0}):pe("series");n+=`
        <div class="manga-card browse-result-card" data-index="${o}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${u}
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
                    ${c.info.tags.map(h=>`<span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); font-weight: normal; font-size: 0.75rem;">${h}</span>`).join("")}
                 </div>
               </div>
             `);let u="";c.info.artists&&c.info.artists.length>0&&(u=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Artists</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${c.info.artists.map(h=>`<span class="badge badge-chapters">${h}</span>`).join("")}
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
             ${u}
             ${l}
          `,this._setReadBtnEnabled(r,!0)}else document.getElementById("preview-extended-info").innerHTML='<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>',(this.previewInfo.galleryId||this.previewInfo.url)&&this._setReadBtnEnabled(r,!0)}catch(c){if(c.name==="AbortError"||s.aborted){console.log("Scraper details fetch aborted successfully.");return}console.error("Info error:",c),document.getElementById("preview-extended-info").innerHTML=`<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${c.message}</p>`,this._setReadBtnEnabled(r,!0)}}_setReadBtnEnabled(e,s){e&&(e.disabled=!s,e.style.opacity=s?"1":"0.5",e.style.cursor=s?"pointer":"not-allowed",e.style.pointerEvents=s?"auto":"none")}async openTempReader(){if(!this.previewInfo||!this.previewInfo.url&&!this.previewInfo.galleryId)return;const e=this.previewInfo.readUrl||this.previewInfo.url||`https://nhentai.net/g/${this.previewInfo.galleryId}/`,s=this.browseScraper||this.previewInfo.website;sessionStorage.setItem("streamPreviewUrl",e),sessionStorage.setItem("streamPreviewTitle",this.previewInfo.title||"Preview"),s?sessionStorage.setItem("streamPreviewScraper",s):sessionStorage.removeItem("streamPreviewScraper"),document.getElementById("preview-info-modal").style.display="none",window.location.hash="#/read/stream/preview"}}const Di=new qi,Ds={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};let _=null;function Fi(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Fs(t,e=0){for(let s=t.length-1;s>e;s--){const a=e+Math.floor(Math.random()*(s-e+1));[t[s],t[a]]=[t[a],t[s]]}}function Ni(t){let e;return typeof t=="string"?e=t:t&&typeof t=="object"&&(e=t.filename||t.path||t.name||t.url),e?(e.includes("/")&&(e=e.split("/").pop()),e.includes("\\")&&(e=e.split("\\").pop()),e):null}function Oi(t){return p(t==="gallery"?"folder":t==="trophy"?"trophy":"book-open")}function Ui(t,e){const s=[];for(const a of t){if(e.has(a.id))continue;const n=a.alias||a.title;for(const r of a.volumes)r.cover&&s.push({url:r.cover,title:n,subtitle:r.name,kind:"volume"})}return s}async function Hi(){var a,n;const t=await m.getFavorites(),e=(a=t.listOrder)!=null&&a.length?t.listOrder:Object.keys(t.favorites||{}),s=[];for(const r of e)for(const o of((n=t.favorites)==null?void 0:n[r])||[])for(const c of o.imagePaths||[]){const l=Ni(c);l&&s.push({url:`/api/public/chapter-images/${o.mangaId}/${o.chapterNum}/${encodeURIComponent(l)}`,title:r,subtitle:o.mangaTitle?`${o.mangaTitle} · Ch. ${o.chapterNum}`:`Ch. ${o.chapterNum}`,kind:"gallery"})}return s}async function Vi(t){const e=await m.get("/trophy-pages"),s=await ue.loadBookmarks().catch(()=>[]),a=r=>{const o=s.find(c=>c.id===r);return o?o.alias||o.title:"Trophies"},n=[];for(const[r,o]of Object.entries(e||{}))if(!t.has(r))for(const[c,l]of Object.entries(o||{})){const u=Object.keys(l||{});if(u.length===0)continue;let h;try{h=(await m.getChapterImages(r,c)).images||[]}catch{continue}for(const f of u){const y=h[f];if(!y)continue;let E=typeof y=="string"?y.split("/").pop():(y==null?void 0:y.filename)||(y==null?void 0:y.path);if(E){try{E=decodeURIComponent(E)}catch{}n.push({url:`/api/public/chapter-images/${r}/${c}/${encodeURIComponent(E)}`,title:a(r),subtitle:`Ch. ${c} · Trophy`,kind:"trophy"})}}}return n}function xa(){_&&(clearTimeout(_.timer),_.playing&&_.slides.length>1&&(_.timer=setTimeout(()=>ke(_.index+1),_.config.intervalMs)))}function Zt(){if(!_)return;const t=_.slides[_.index],e=document.getElementById("ss-counter"),s=document.getElementById("ss-title"),a=document.getElementById("ss-subtitle");e&&(e.textContent=_.slides.length?`${_.index+1} / ${_.slides.length}`:""),s&&t&&(s.innerHTML=`${Oi(t.kind)} ${Fi(t.title)}`),a&&t&&(a.textContent=t.subtitle||"")}function ke(t){if(!_||_.slides.length===0)return;const e=(t%_.slides.length+_.slides.length)%_.slides.length;_.index=e;const s=_.slides[e],a=++_.loadToken,n=1-_.activeLayer,r=_.layers[n],o=_.layers[_.activeLayer];r.onload=()=>{if(!(!_||a!==_.loadToken)&&(_.activeLayer=n,r.classList.add("active"),o.classList.remove("active"),Zt(),xa(),_.slides.length>1)){const c=_.slides[(e+1)%_.slides.length];c&&(new Image().src=c.url)}},r.onerror=()=>{if(!(!_||a!==_.loadToken)){if(_.slides.splice(e,1),_.slides.length===0){ts();return}ke(e)}},r.src=s.url,Zt()}function Ns(t){if(!_)return;_.playing=t;const e=document.getElementById("ss-play");e&&(e.innerHTML=p(t?"pause":"play")),xa()}function ve(){if(!_)return;const t=document.getElementById("slideshow");t&&(t.classList.remove("controls-hidden"),clearTimeout(_.hideTimer),_.hideTimer=setTimeout(()=>{var e;(e=document.getElementById("slideshow"))==null||e.classList.add("controls-hidden")},3e3))}function es(){D.go("/settings")}function ts(){var e;const t=document.getElementById("slideshow");t&&(t.innerHTML=`
        <div class="slideshow-empty">
            ${p("images",{size:48})}
            <p>Nothing to show yet — add covers to your volumes, or enable galleries and trophies in Settings.</p>
            <button id="ss-empty-back" class="btn btn-primary">Back to Settings</button>
        </div>
    `,(e=document.getElementById("ss-empty-back"))==null||e.addEventListener("click",es))}const ji={mount:async()=>{const t=document.getElementById("app");t.innerHTML=`
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
        `;const e=document.getElementById("ss-stage");_={slides:[],index:0,playing:!0,timer:null,hideTimer:null,loadToken:0,activeLayer:0,layers:[...e.querySelectorAll(".slideshow-img")],config:{...Ds},keyHandler:null,moveHandler:null},document.getElementById("ss-exit").addEventListener("click",es),document.getElementById("ss-prev").addEventListener("click",()=>{ke(_.index-1),ve()}),document.getElementById("ss-next").addEventListener("click",()=>{ke(_.index+1),ve()}),document.getElementById("ss-play").addEventListener("click",()=>{Ns(!_.playing),ve()}),document.getElementById("ss-fullscreen").addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>d("Fullscreen not supported","info"))}),e.addEventListener("click",l=>{const u=l.clientX/window.innerWidth;if(u<.3)ke(_.index-1),ve();else if(u>.7)ke(_.index+1),ve();else{const h=document.getElementById("slideshow");h.classList.contains("controls-hidden")?ve():(clearTimeout(_.hideTimer),h.classList.add("controls-hidden"))}}),_.keyHandler=l=>{if(_)switch(l.key){case"ArrowLeft":ke(_.index-1),ve();break;case"ArrowRight":ke(_.index+1),ve();break;case" ":l.preventDefault(),Ns(!_.playing),ve();break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});break;case"Escape":document.fullscreenElement||es();break}},document.addEventListener("keydown",_.keyHandler),_.moveHandler=()=>ve(),document.addEventListener("mousemove",_.moveHandler),ve();let s={};try{s=await m.get("/settings")||{}}catch{}_.config={...Ds,...s.slideshow||{}};const a=new Set(_.config.disabledMangaIds||[]);let n=[];try{n=await m.getAllVolumes()}catch(l){console.error(l)}_.slides=Ui(n,a),_.config.shuffle&&Fs(_.slides,-1);const r=document.getElementById("ss-loading");_.slides.length>0&&(r==null||r.remove(),ke(0));const o=l=>{var h;if(!_||l.length===0)return;const u=_.slides.length===0;_.slides.push(...l),_.config.shuffle&&Fs(_.slides,u?-1:_.index),u?((h=document.getElementById("ss-loading"))==null||h.remove(),ke(0)):Zt()},c=[];_.config.includeLists&&c.push(Hi().then(o).catch(l=>console.warn("Slideshow: galleries unavailable",l))),_.config.includeTrophies&&c.push(Vi(a).then(o).catch(l=>console.warn("Slideshow: trophies unavailable",l))),_.slides.length===0&&(c.length===0?ts():Promise.allSettled(c).then(()=>{_&&_.slides.length===0&&ts()}))},unmount:()=>{_&&(clearTimeout(_.timer),clearTimeout(_.hideTimer),document.removeEventListener("keydown",_.keyHandler),document.removeEventListener("mousemove",_.moveHandler),document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),_=null)}};class zi{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,s){this.routes.set(e,s)}async navigate(){console.log("[Router] navigate called");const s=(window.location.hash.slice(1)||"/").split("?")[0],[a,...n]=s.split("/").filter(Boolean),r=`/${a||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let o=this.routes.get(r);!o&&this.routes.has("/")&&(o=this.routes.get("/")),o&&(this.currentRoute=r,this.currentView=o,o.mount&&(console.log("[Router] calling mount on view module"),await o.mount(n)),Ie())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),Ie())}}const D=new zi;D.register("/",Kn);D.register("/manga",Xr);D.register("/read",br);D.register("/series",ii);D.register("/settings",ci);D.register("/admin",di);D.register("/favorites",ki);D.register("/queue",Pi);D.register("/scrapers",Di);D.register("/slideshow",ji);export{oe as S,te as a,Ki as i,D as r,Gi as s};
