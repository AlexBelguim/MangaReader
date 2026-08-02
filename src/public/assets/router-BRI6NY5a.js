import{a as f}from"./api-BzEASrxS.js";const me=Object.create(null);me.open="0";me.close="1";me.ping="2";me.pong="3";me.message="4";me.upgrade="5";me.noop="6";const ze=Object.create(null);Object.keys(me).forEach(t=>{ze[me[t]]=t});const ut={type:"error",data:"parser error"},ss=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",as=typeof ArrayBuffer=="function",ns=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,It=({type:t,data:e},s,a)=>ss&&e instanceof Blob?s?a(e):Ut(e,a):as&&(e instanceof ArrayBuffer||ns(e))?s?a(e):Ut(new Blob([e]),a):a(me[t]+(e||"")),Ut=(t,e)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];e("b"+(a||""))},s.readAsDataURL(t)};function Vt(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let ot;function Ts(t,e){if(ss&&t.data instanceof Blob)return t.data.arrayBuffer().then(Vt).then(e);if(as&&(t.data instanceof ArrayBuffer||ns(t.data)))return e(Vt(t.data));It(t,!1,s=>{ot||(ot=new TextEncoder),e(ot.encode(s))})}const Ht="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ae=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<Ht.length;t++)Ae[Ht.charCodeAt(t)]=t;const Rs=t=>{let e=t.length*.75,s=t.length,a,n=0,o,i,c,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const u=new ArrayBuffer(e),h=new Uint8Array(u);for(a=0;a<s;a+=4)o=Ae[t.charCodeAt(a)],i=Ae[t.charCodeAt(a+1)],c=Ae[t.charCodeAt(a+2)],l=Ae[t.charCodeAt(a+3)],h[n++]=o<<2|i>>4,h[n++]=(i&15)<<4|c>>2,h[n++]=(c&3)<<6|l&63;return u},qs=typeof ArrayBuffer=="function",Lt=(t,e)=>{if(typeof t!="string")return{type:"message",data:rs(t,e)};const s=t.charAt(0);return s==="b"?{type:"message",data:Ds(t.substring(1),e)}:ze[s]?t.length>1?{type:ze[s],data:t.substring(1)}:{type:ze[s]}:ut},Ds=(t,e)=>{if(qs){const s=Rs(t);return rs(s,e)}else return{base64:!0,data:t}},rs=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},os="",Ns=(t,e)=>{const s=t.length,a=new Array(s);let n=0;t.forEach((o,i)=>{It(o,!1,c=>{a[i]=c,++n===s&&e(a.join(os))})})},Fs=(t,e)=>{const s=t.split(os),a=[];for(let n=0;n<s.length;n++){const o=Lt(s[n],e);if(a.push(o),o.type==="error")break}return a};function Os(){return new TransformStream({transform(t,e){Ts(t,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const o=new DataView(n.buffer);o.setUint8(0,126),o.setUint16(1,a)}else{n=new Uint8Array(9);const o=new DataView(n.buffer);o.setUint8(0,127),o.setBigUint64(1,BigInt(a))}t.data&&typeof t.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(s)})}})}let it;function Ue(t){return t.reduce((e,s)=>e+s.length,0)}function Ve(t,e){if(t[0].length===e)return t.shift();const s=new Uint8Array(e);let a=0;for(let n=0;n<e;n++)s[n]=t[0][a++],a===t[0].length&&(t.shift(),a=0);return t.length&&a<t[0].length&&(t[0]=t[0].slice(a)),s}function Us(t,e){it||(it=new TextDecoder);const s=[];let a=0,n=-1,o=!1;return new TransformStream({transform(i,c){for(s.push(i);;){if(a===0){if(Ue(s)<1)break;const l=Ve(s,1);o=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(Ue(s)<2)break;const l=Ve(s,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(Ue(s)<8)break;const l=Ve(s,8),u=new DataView(l.buffer,l.byteOffset,l.length),h=u.getUint32(0);if(h>Math.pow(2,21)-1){c.enqueue(ut);break}n=h*Math.pow(2,32)+u.getUint32(4),a=3}else{if(Ue(s)<n)break;const l=Ve(s,n);c.enqueue(Lt(o?l:it.decode(l),e)),a=0}if(n===0||n>t){c.enqueue(ut);break}}}})}const is=4;function K(t){if(t)return Vs(t)}function Vs(t){for(var e in K.prototype)t[e]=K.prototype[e];return t}K.prototype.on=K.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this};K.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this};K.prototype.off=K.prototype.removeListener=K.prototype.removeAllListeners=K.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+t];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===e||a.fn===e){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+t],this};K.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),s=this._callbacks["$"+t],a=1;a<arguments.length;a++)e[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,e)}return this};K.prototype.emitReserved=K.prototype.emit;K.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};K.prototype.hasListeners=function(t){return!!this.listeners(t).length};const st=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,s)=>s(e,0),re=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Hs="arraybuffer";function ls(t,...e){return e.reduce((s,a)=>(t.hasOwnProperty(a)&&(s[a]=t[a]),s),{})}const zs=re.setTimeout,js=re.clearTimeout;function at(t,e){e.useNativeTimers?(t.setTimeoutFn=zs.bind(re),t.clearTimeoutFn=js.bind(re)):(t.setTimeoutFn=re.setTimeout.bind(re),t.clearTimeoutFn=re.clearTimeout.bind(re))}const Qs=1.33;function Ws(t){return typeof t=="string"?Gs(t):Math.ceil((t.byteLength||t.size)*Qs)}function Gs(t){let e=0,s=0;for(let a=0,n=t.length;a<n;a++)e=t.charCodeAt(a),e<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(a++,s+=4);return s}function cs(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Ks(t){let e="";for(let s in t)t.hasOwnProperty(s)&&(e.length&&(e+="&"),e+=encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e}function Ys(t){let e={},s=t.split("&");for(let a=0,n=s.length;a<n;a++){let o=s[a].split("=");e[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}return e}class Js extends Error{constructor(e,s,a){super(e),this.description=s,this.context=a,this.type="TransportError"}}class _t extends K{constructor(e){super(),this.writable=!1,at(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,s,a){return super.emitReserved("error",new Js(e,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const s=Lt(e,this.socket.binaryType);this.onPacket(s)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,s={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const s=Ks(e);return s.length?"?"+s:""}}class Xs extends _t{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const s=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};Fs(e,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Ns(e,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=cs()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(e,s)}}let ds=!1;try{ds=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Zs=ds;function ea(){}class ta extends Xs{constructor(e){if(super(e),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||a!==e.port}}doWrite(e,s){const a=this.request({method:"POST",data:e});a.on("success",s),a.on("error",(n,o)=>{this.onError("xhr post error",n,o)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=e}}class he extends K{constructor(e,s,a){super(),this.createRequest=e,at(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var e;const s=ls(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=he.requestsCount++,he.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=ea,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete he.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}he.requestsCount=0;he.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",zt);else if(typeof addEventListener=="function"){const t="onpagehide"in re?"pagehide":"unload";addEventListener(t,zt,!1)}}function zt(){for(let t in he.requests)he.requests.hasOwnProperty(t)&&he.requests[t].abort()}const sa=function(){const t=us({xdomain:!1});return t&&t.responseType!==null}();class aa extends ta{constructor(e){super(e);const s=e&&e.forceBase64;this.supportsBinary=sa&&!s}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new he(us,this.uri(),e)}}function us(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Zs))return new XMLHttpRequest}catch{}if(!e)try{return new re[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const ps=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class na extends _t{get name(){return"websocket"}doOpen(){const e=this.uri(),s=this.opts.protocols,a=ps?{}:ls(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;It(a,this.supportsBinary,o=>{try{this.doWrite(a,o)}catch{}n&&st(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=cs()),this.supportsBinary||(s.b64=1),this.createUri(e,s)}}const lt=re.WebSocket||re.MozWebSocket;class ra extends na{createSocket(e,s,a){return ps?new lt(e,s,a):s?new lt(e,s):new lt(e)}doWrite(e,s){this.ws.send(s)}}class oa extends _t{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const s=Us(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=e.readable.pipeThrough(s).getReader(),n=Os();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const o=()=>{a.read().then(({done:c,value:l})=>{c||(this.onPacket(l),o())}).catch(c=>{})};o();const i={type:"open"};this.query.sid&&(i.data=`{"sid":"${this.query.sid}"}`),this._writer.write(i).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;this._writer.write(a).then(()=>{n&&st(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const ia={websocket:ra,webtransport:oa,polling:aa},la=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,ca=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function pt(t){if(t.length>8e3)throw"URI too long";const e=t,s=t.indexOf("["),a=t.indexOf("]");s!=-1&&a!=-1&&(t=t.substring(0,s)+t.substring(s,a).replace(/:/g,";")+t.substring(a,t.length));let n=la.exec(t||""),o={},i=14;for(;i--;)o[ca[i]]=n[i]||"";return s!=-1&&a!=-1&&(o.source=e,o.host=o.host.substring(1,o.host.length-1).replace(/;/g,":"),o.authority=o.authority.replace("[","").replace("]","").replace(/;/g,":"),o.ipv6uri=!0),o.pathNames=da(o,o.path),o.queryKey=ua(o,o.query),o}function da(t,e){const s=/\/{2,9}/g,a=e.replace(s,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&a.splice(0,1),e.slice(-1)=="/"&&a.splice(a.length-1,1),a}function ua(t,e){const s={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,o){n&&(s[n]=o)}),s}const ht=typeof addEventListener=="function"&&typeof removeEventListener=="function",je=[];ht&&addEventListener("offline",()=>{je.forEach(t=>t())},!1);class ye extends K{constructor(e,s){if(super(),this.binaryType=Hs,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(s=e,e=null),e){const a=pt(e);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=pt(s.host).host);at(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Ys(this.opts.query)),ht&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},je.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const s=Object.assign({},this.opts.query);s.EIO=is,s.transport=e,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&ye.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(e);s.open(),this.setTransport(s)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",ye.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=e.data,this._onError(s);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=Ws(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,st(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,s,a){return this._sendPacket("message",e,s,a),this}send(e,s,a){return this._sendPacket("message",e,s,a),this}_sendPacket(e,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const o={type:e,data:s,options:a};this.emitReserved("packetCreate",o),this.writeBuffer.push(o),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),e()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():e()}):this.upgrading?a():e()),this}_onError(e){if(ye.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ht&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=je.indexOf(this._offlineEventListener);a!==-1&&je.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,s),this.writeBuffer=[],this._prevBufferLen=0}}}ye.protocol=is;class pa extends ye{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let s=this.createTransport(e),a=!1;ye.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",y=>{if(!a)if(y.type==="pong"&&y.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;ye.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(h(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const b=new Error("probe error");b.transport=s.name,this.emitReserved("upgradeError",b)}}))};function o(){a||(a=!0,h(),s.close(),s=null)}const i=y=>{const b=new Error("probe error: "+y);b.transport=s.name,o(),this.emitReserved("upgradeError",b)};function c(){i("transport closed")}function l(){i("socket closed")}function u(y){s&&y.name!==s.name&&o()}const h=()=>{s.removeListener("open",n),s.removeListener("error",i),s.removeListener("close",c),this.off("close",l),this.off("upgrading",u)};s.once("open",n),s.once("error",i),s.once("close",c),this.once("close",l),this.once("upgrading",u),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const s=[];for(let a=0;a<e.length;a++)~this.transports.indexOf(e[a])&&s.push(e[a]);return s}}let ha=class extends pa{constructor(e,s={}){const a=typeof e=="object"?e:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>ia[n]).filter(n=>!!n)),super(e,a)}};function ma(t,e="",s){let a=t;s=s||typeof location<"u"&&location,t==null&&(t=s.protocol+"//"+s.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=s.protocol+t:t=s.host+t),/^(https?|wss?):\/\//.test(t)||(typeof s<"u"?t=s.protocol+"//"+t:t="https://"+t),a=pt(t)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const o=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+o+":"+a.port+e,a.href=a.protocol+"://"+o+(s&&s.port===a.port?"":":"+a.port),a}const ga=typeof ArrayBuffer=="function",fa=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,hs=Object.prototype.toString,va=typeof Blob=="function"||typeof Blob<"u"&&hs.call(Blob)==="[object BlobConstructor]",ya=typeof File=="function"||typeof File<"u"&&hs.call(File)==="[object FileConstructor]";function Bt(t){return ga&&(t instanceof ArrayBuffer||fa(t))||va&&t instanceof Blob||ya&&t instanceof File}function Qe(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let s=0,a=t.length;s<a;s++)if(Qe(t[s]))return!0;return!1}if(Bt(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return Qe(t.toJSON(),!0);for(const s in t)if(Object.prototype.hasOwnProperty.call(t,s)&&Qe(t[s]))return!0;return!1}function ba(t){const e=[],s=t.data,a=t;return a.data=mt(s,e),a.attachments=e.length,{packet:a,buffers:e}}function mt(t,e){if(!t)return t;if(Bt(t)){const s={_placeholder:!0,num:e.length};return e.push(t),s}else if(Array.isArray(t)){const s=new Array(t.length);for(let a=0;a<t.length;a++)s[a]=mt(t[a],e);return s}else if(typeof t=="object"&&!(t instanceof Date)){const s={};for(const a in t)Object.prototype.hasOwnProperty.call(t,a)&&(s[a]=mt(t[a],e));return s}return t}function wa(t,e){return t.data=gt(t.data,e),delete t.attachments,t}function gt(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let s=0;s<t.length;s++)t[s]=gt(t[s],e);else if(typeof t=="object")for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(t[s]=gt(t[s],e));return t}const ka=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var N;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(N||(N={}));class $a{constructor(e){this.replacer=e}encode(e){return(e.type===N.EVENT||e.type===N.ACK)&&Qe(e)?this.encodeAsBinary({type:e.type===N.EVENT?N.BINARY_EVENT:N.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let s=""+e.type;return(e.type===N.BINARY_EVENT||e.type===N.BINARY_ACK)&&(s+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(s+=e.nsp+","),e.id!=null&&(s+=e.id),e.data!=null&&(s+=JSON.stringify(e.data,this.replacer)),s}encodeAsBinary(e){const s=ba(e),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class At extends K{constructor(e){super(),this.reviver=e}add(e){let s;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(e);const a=s.type===N.BINARY_EVENT;a||s.type===N.BINARY_ACK?(s.type=a?N.EVENT:N.ACK,this.reconstructor=new Ea(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(Bt(e)||e.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(e),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let s=0;const a={type:Number(e.charAt(0))};if(N[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===N.BINARY_EVENT||a.type===N.BINARY_ACK){const o=s+1;for(;e.charAt(++s)!=="-"&&s!=e.length;);const i=e.substring(o,s);if(i!=Number(i)||e.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(i)}if(e.charAt(s+1)==="/"){const o=s+1;for(;++s&&!(e.charAt(s)===","||s===e.length););a.nsp=e.substring(o,s)}else a.nsp="/";const n=e.charAt(s+1);if(n!==""&&Number(n)==n){const o=s+1;for(;++s;){const i=e.charAt(s);if(i==null||Number(i)!=i){--s;break}if(s===e.length)break}a.id=Number(e.substring(o,s+1))}if(e.charAt(++s)){const o=this.tryParse(e.substr(s));if(At.isPayloadValid(a.type,o))a.data=o;else throw new Error("invalid payload")}return a}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,s){switch(e){case N.CONNECT:return jt(s);case N.DISCONNECT:return s===void 0;case N.CONNECT_ERROR:return typeof s=="string"||jt(s);case N.EVENT:case N.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&ka.indexOf(s[0])===-1);case N.ACK:case N.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Ea{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const s=wa(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function jt(t){return Object.prototype.toString.call(t)==="[object Object]"}const Ca=Object.freeze(Object.defineProperty({__proto__:null,Decoder:At,Encoder:$a,get PacketType(){return N}},Symbol.toStringTag,{value:"Module"}));function ce(t,e,s){return t.on(e,s),function(){t.off(e,s)}}const xa=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class ms extends K{constructor(e,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[ce(e,"open",this.onopen.bind(this)),ce(e,"packet",this.onpacket.bind(this)),ce(e,"error",this.onerror.bind(this)),ce(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...s){var a,n,o;if(xa.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(s.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const i={type:N.EVENT,data:s};if(i.options={},i.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const h=this.ids++,y=s.pop();this._registerAckCallback(h,y),i.id=h}const c=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((o=this.io.engine)===null||o===void 0)&&o._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(i),this.packet(i)):this.sendBuffer.push(i)),this.flags={},this}_registerAckCallback(e,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[e]=s;return}const o=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===e&&this.sendBuffer.splice(c,1);s.call(this,new Error("operation has timed out"))},n),i=(...c)=>{this.io.clearTimeoutFn(o),s.apply(this,c)};i.withError=!0,this.acks[e]=i}emitWithAck(e,...s){return new Promise((a,n)=>{const o=(i,c)=>i?n(i):a(c);o.withError=!0,s.push(o),this.emit(e,...s)})}_addToQueue(e){let s;typeof e[e.length-1]=="function"&&(s=e.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...o)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...o)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!e||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:N.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(a=>String(a.id)===e)){const a=this.acks[e];delete this.acks[e],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case N.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case N.EVENT:case N.BINARY_EVENT:this.onevent(e);break;case N.ACK:case N.BINARY_ACK:this.onack(e);break;case N.DISCONNECT:this.ondisconnect();break;case N.CONNECT_ERROR:this.destroy();const a=new Error(e.data.message);a.data=e.data.data,this.emitReserved("connect_error",a);break}}onevent(e){const s=e.data||[];e.id!=null&&s.push(this.ack(e.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:N.ACK,id:e,data:n}))}}onack(e){const s=this.acks[e.id];typeof s=="function"&&(delete this.acks[e.id],s.withError&&e.data.unshift(null),s.apply(this,e.data))}onconnect(e,s){this.id=e,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:N.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,e.data)}}}function _e(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}_e.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),s=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+s:t-s}return Math.min(t,this.max)|0};_e.prototype.reset=function(){this.attempts=0};_e.prototype.setMin=function(t){this.ms=t};_e.prototype.setMax=function(t){this.max=t};_e.prototype.setJitter=function(t){this.jitter=t};class ft extends K{constructor(e,s){var a;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(s=e,e=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,at(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new _e({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=e;const n=s.parser||Ca;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var s;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(s=this.backoff)===null||s===void 0||s.setMin(e),this)}randomizationFactor(e){var s;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(s=this.backoff)===null||s===void 0||s.setJitter(e),this)}reconnectionDelayMax(e){var s;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(s=this.backoff)===null||s===void 0||s.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new ha(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=ce(s,"open",function(){a.onopen(),e&&e()}),o=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),e?e(c):this.maybeReconnectOnOpen()},i=ce(s,"error",o);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{n(),o(new Error("timeout")),s.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(i),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(ce(e,"ping",this.onping.bind(this)),ce(e,"data",this.ondata.bind(this)),ce(e,"error",this.onerror.bind(this)),ce(e,"close",this.onclose.bind(this)),ce(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(s){this.onclose("parse error",s)}}ondecoded(e){st(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,s){let a=this.nsps[e];return a?this._autoConnect&&!a.active&&a.connect():(a=new ms(this,e,s),this.nsps[e]=a),a}_destroy(e){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(e){const s=this.encoder.encode(e);for(let a=0;a<s.length;a++)this.engine.write(s[a],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Be={};function We(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const s=ma(t,e.path||"/socket.io"),a=s.source,n=s.id,o=s.path,i=Be[n]&&o in Be[n].nsps,c=e.forceNew||e["force new connection"]||e.multiplex===!1||i;let l;return c?l=new ft(a,e):(Be[n]||(Be[n]=new ft(a,e)),l=Be[n]),s.query&&!e.query&&(e.query=s.queryKey),l.socket(s.path,e)}Object.assign(We,{Manager:ft,Socket:ms,io:We,connect:We});class Sa{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=We({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var s;this.subscribedMangas.add(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var s;this.subscribedMangas.delete(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,s){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(s),this.socket&&this.socket.on(e,s)}off(e,s){this.listeners.has(e)&&this.listeners.get(e).delete(s),this.socket&&this.socket.off(e,s)}emit(e,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(e,s)}}const pe={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone"},oe=new Sa,ee={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},de=new Set,Q=new Map,Me=new Map;function Ia(t){return ee[t]}function La(t,e){ee[t]=e,de.add(t),Ne(t)}function _a(t,e){return Me.has(t)||Me.set(t,new Set),Me.get(t).add(e),()=>{var s;return(s=Me.get(t))==null?void 0:s.delete(e)}}function Ne(t){const e=Me.get(t);e&&e.forEach(s=>s(ee[t]))}function Pe(t){de.delete(t),Q.delete(t)}function Ba(t){return de.has(t)}async function Te(t=!1){if(!t&&de.has("bookmarks"))return ee.bookmarks;if(Q.has("bookmarks"))return Q.get("bookmarks");const e=f.getBookmarks().then(s=>(ee.bookmarks=s||[],de.add("bookmarks"),Q.delete("bookmarks"),Ne("bookmarks"),ee.bookmarks)).catch(s=>{throw Q.delete("bookmarks"),s});return Q.set("bookmarks",e),e}async function Aa(t=!1){if(!t&&de.has("series"))return ee.series;if(Q.has("series"))return Q.get("series");const e=f.get("/series").then(s=>(ee.series=s||[],de.add("series"),Q.delete("series"),Ne("series"),ee.series)).catch(s=>{throw Q.delete("series"),s});return Q.set("series",e),e}async function Ma(t=!1){if(!t&&de.has("categories"))return ee.categories;if(Q.has("categories"))return Q.get("categories");const e=f.get("/categories").then(s=>(ee.categories=s.categories||[],de.add("categories"),Q.delete("categories"),Ne("categories"),ee.categories)).catch(s=>{throw Q.delete("categories"),s});return Q.set("categories",e),e}async function Pa(t=!1){if(!t&&de.has("favorites"))return ee.favorites;if(Q.has("favorites"))return Q.get("favorites");const e=f.getFavorites().then(s=>(ee.favorites=s||{favorites:{},listOrder:[]},de.add("favorites"),Q.delete("favorites"),Ne("favorites"),ee.favorites)).catch(s=>{throw Q.delete("favorites"),s});return Q.set("favorites",e),e}function Ta(){oe.on(pe.MANGA_UPDATED,()=>{Pe("bookmarks"),Te(!0)}),oe.on(pe.MANGA_ADDED,()=>{Pe("bookmarks"),Te(!0)}),oe.on(pe.MANGA_DELETED,()=>{Pe("bookmarks"),Te(!0)}),oe.on(pe.DOWNLOAD_COMPLETED,()=>{Pe("bookmarks"),Te(!0)})}Ta();const ae={get:Ia,set:La,subscribe:_a,invalidate:Pe,isLoaded:Ba,loadBookmarks:Te,loadSeries:Aa,loadCategories:Ma,loadFavorites:Pa};function d(t,e="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=t,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}const Ra={library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',"book-open":'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',"book-marked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',"layout-grid":'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',check:'<path d="M20 6 9 17l-5-5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',"trash-2":'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',"undo-2":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',scissors:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',play:'<polygon points="6 3 20 12 6 21 6 3"/>',pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',"hard-drive":'<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',package:'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"eye-off":'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',circle:'<circle cx="12" cy="12" r="10"/>',lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',"lock-open":'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',"triangle-alert":'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',"shield-alert":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',"circle-help":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',"traffic-cone":'<path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"/><path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"/><path d="M13.9 3.5a1.93 1.93 0 0 0-3.8 0L6.1 19.5a1.93 1.93 0 0 0 1.9 2.5h8a1.93 1.93 0 0 0 1.9-2.5z"/><path d="M2 21h20"/>',sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',"alarm-clock":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',loader:'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',"search-x":'<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',"list-checks":'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',"log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',sliders:'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',"chevron-up":'<path d="m18 15-6-6-6 6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"columns-2":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',"rectangle-vertical":'<rect width="12" height="20" x="6" y="2" rx="2"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',"arrow-left-right":'<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',"refresh-cw":'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>',"rotate-cw":'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"message-circle":'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'};function p(t,e={}){const s=Ra[t];if(!s)return console.warn("[icons] unknown icon:",t),"";const{size:a,cls:n="",title:o,spin:i=!1}=e,c=["icon",i?"icon-spin":"",n].filter(Boolean).join(" "),l=a?` width="${a}" height="${a}"`:"",u=o?` role="img" aria-label="${String(o).replace(/"/g,"&quot;")}"`:' aria-hidden="true"';return`<svg class="${c}"${l} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${u}>${s}</svg>`}function ie(t="book"){return`<div class="placeholder" data-icon="${t}"></div>`}function be(t,e,s={}){const{kind:a="book",self:n=!1,attrs:o=""}=s,i=String(e??"").replace(/"/g,"&quot;"),c=`<div class=&quot;placeholder&quot; data-icon=&quot;${a}&quot;></div>`,l=n?"this.outerHTML":"this.parentElement.innerHTML";return`<img src="${t}" alt="${i}" loading="lazy"${o?" "+o:""} onerror="${l}='${c}'">`}const Qt=`${p("folder")} Scan Folder`,Wt=`${p("loader",{spin:!0})} Scanning...`;async function qa(t,e,s){try{t&&(t.disabled=!0,t.innerHTML=Wt),e&&(e.innerHTML=Wt),d("Scanning downloads folder...","info");const n=(await f.scanLibrary()).found||[];if(n.length===0){d("Scan complete: No new manga found","info"),s&&s();return}Da(n,s)}catch(a){d("Scan failed: "+a.message,"error")}finally{t&&(t.disabled=!1,t.innerHTML=Qt),e&&(e.innerHTML=Qt)}}async function Da(t,e){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),o=Array.from(n).map(l=>l.dataset.folder);if(o.length===0){d("No folders selected","warning");return}const i=document.getElementById("import-all-btn");i.disabled=!0,i.textContent="Importing...";let c=0;for(const l of o)try{await f.importLocalManga(l),c++}catch(u){console.error("Failed to import",l,u)}s.remove(),d(`Imported ${c} manga`,"success"),e&&e()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function Na(t={}){const{size:e,stroke:s="currentColor",accent:a="var(--accent-primary, #E03A2F)",strokeWidth:n=2,cls:o=""}=t,i=e?` width="${e}" height="${e}"`:"";return`<svg class="${`logo-mark ${o}`.trim()}"${i} viewBox="0 0 24 24" fill="none" stroke="${s}" stroke-width="${n}" stroke-linejoin="round" aria-hidden="true"><polygon points="3,3 10.5,3 8.5,21 3,21"/><polygon points="13,3 21,3 21,10.5 12.17,10.5" fill="${a}" stroke="${a}"/><polygon points="11.89,13 21,13 21,21 11,21"/></svg>`}function Gt(){return`${Na()}<span class="logo-text">Manga<span>Reader</span></span>`}const Z={user:null,get isAdmin(){var t;return((t=this.user)==null?void 0:t.role)==="admin"},get isDemo(){var t;return((t=this.user)==null?void 0:t.role)==="demo"},get canDownload(){var t;return this.isAdmin||!this.isDemo&&!!((t=this.user)!=null&&t.canDownload)},get canEdit(){var t;return this.isAdmin||!this.isDemo&&!!((t=this.user)!=null&&t.canEdit)}};function Cr(t){Z.user=t||null}function te(t="manga"){if(Z.isDemo)return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${Gt()}</a>
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
  `;const e=Z.isAdmin?`<a href="#/admin" class="btn btn-secondary" title="Admin">${p("wrench",{title:"Admin"})}</a>`:"",s=Z.isAdmin?`<a href="#/admin" class="mobile-menu-item">${p("wrench")} Admin</a>`:"",a=Z.canDownload?`<button class="btn btn-secondary" id="scan-btn">${p("folder")} Scan Folder</button>`:"",n=Z.canDownload?`<button class="mobile-menu-item" id="mobile-scan-btn">${p("folder")} Scan Folder</button>`:"",o=Z.canEdit?t==="series"?`<button class="btn btn-primary" id="add-series-btn">${p("plus")} Add Series</button>`:`<button class="btn btn-primary" id="add-manga-btn">${p("plus")} Add Manga</button>`:"",i=Z.canEdit?t==="series"?`<button class="mobile-menu-item primary" id="mobile-add-series-btn">${p("plus")} Add Series</button>`:`<button class="mobile-menu-item primary" id="mobile-add-btn">${p("plus")} Add Manga</button>`:"";return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${Gt()}</a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${t==="manga"?"active":""}" data-view="manga" title="Manga view">${p("library",{title:"Manga view"})}</button>
            <button class="view-toggle-btn ${t==="series"?"active":""}" data-view="series" title="Series view">${p("book-open",{title:"Series view"})}</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">${p("star")} Favorites</button>
          <a href="#/queue" class="btn btn-secondary" id="queue-nav-btn" title="Task Queue">${p("list-checks")} Queue</a>
          ${a}
          ${o}
          <button class="btn btn-secondary" id="logout-btn" title="Log out">${p("log-out",{title:"Log out"})}</button>
          <a href="#/scrapers" class="btn btn-secondary" title="Search Scrapers">${p("search",{title:"Search Scrapers"})}</a>
          ${e}
          <!-- <a href="#/settings" class="btn btn-secondary" title="Settings">${p("settings")}</a> -->
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
        ${i}
        <button class="mobile-menu-item" id="mobile-logout-btn">${p("log-out")} Logout</button>
        <a href="#/scrapers" class="mobile-menu-item">${p("search")} Scrapers</a>
        ${s}
        <!-- <a href="#/settings" class="mobile-menu-item">${p("settings")} Settings</a> -->
      </div>
    </header>
  `}function fe(){const t=document.querySelector("header");if(t&&t.dataset.listenersBound)return;t&&(t.dataset.listenersBound="true");const e=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");e&&s&&e.addEventListener("click",()=>{s.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),o=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",o),n&&n.addEventListener("click",o);const i=document.getElementById("demo-exit-btn");i&&i.addEventListener("click",_=>{_.preventDefault(),localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"}),document.querySelectorAll("[data-view]").forEach(_=>{_.addEventListener("click",()=>{const M=_.dataset.view;localStorage.setItem("library_view_mode",M),document.querySelectorAll("[data-view]").forEach(F=>{F.classList.toggle("active",F.dataset.view===M)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:M}}))})});const c=document.querySelector(".logo");c&&c.addEventListener("click",_=>{localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),ae.loadBookmarks(!0).catch(()=>{}),window.dispatchEvent(new CustomEvent("clearFilters"))});const l=document.getElementById("favorites-btn"),u=document.getElementById("mobile-favorites-btn"),h=_=>{_.preventDefault(),R.go("/favorites")};l&&l.addEventListener("click",h),u&&u.addEventListener("click",h);const y=document.getElementById("queue-nav-btn");y&&y.addEventListener("click",_=>{_.preventDefault(),R.go("/queue")});const b=document.getElementById("add-manga-btn"),x=document.getElementById("mobile-add-btn"),E=()=>{document.getElementById("add-modal")||(sessionStorage.setItem("open_add_modal","1"),R.go("/"))};b&&b.addEventListener("click",E),x&&x.addEventListener("click",E);const g=document.getElementById("scan-btn"),S=document.getElementById("mobile-scan-btn");if(g||S){const _=()=>{qa(g,S,async()=>{await ae.loadBookmarks(!0),R.reload()})};g&&g.addEventListener("click",_),S&&S.addEventListener("click",_)}}let k={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",searchAuthor:localStorage.getItem("library_search_author")||null,searchAuthorSource:localStorage.getItem("library_search_author_source")||null,sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0},Je=[];function Kt(t){return String(t).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}function Fa(t){return[...t].sort((e,s)=>{var a,n;switch(k.sortBy){case"az":return(e.alias||e.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(e.alias||e.title);case"lastread":return(s.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const o=((a=e.chapters)==null?void 0:a.length)||e.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-o}case"updated":default:return(s.updatedAt||"").localeCompare(e.updatedAt||"")}})}function Mt(){let t=k.bookmarks;const e=(Array.isArray(k.categories)?k.categories:[]).filter(s=>typeof s=="object"?s.isNsfw:!1).map(s=>s.name);if(k.activeCategory==="__nsfw__"?t=t.filter(s=>(s.categories||[]).some(a=>e.includes(a))):k.activeCategory?t=t.filter(s=>(s.categories||[]).includes(k.activeCategory)):e.length>0&&(t=t.filter(s=>!(s.categories||[]).some(a=>e.includes(a)))),k.artistFilter&&(t=t.filter(s=>(s.artists||[]).includes(k.artistFilter))),k.searchQuery){const s=k.searchQuery.toLowerCase();t=t.filter(a=>(a.title||"").toLowerCase().includes(s)||(a.alias||"").toLowerCase().includes(s)||(a.artists||[]).some(n=>n.toLowerCase().includes(s)))}return Fa(t)}function Pt(t){var h,y,b;const e=t.alias||t.title,s=t.downloadedCount??((h=t.downloadedChapters)==null?void 0:h.length)??0,a=new Set(t.excludedChapters||[]),n=(t.chapters||[]).filter(x=>!a.has(x.number)),o=new Set(n.map(x=>x.number)).size||t.uniqueChapters||0,i=t.readCount??((y=t.readChapters)==null?void 0:y.length)??0,c=(t.updatedCount??((b=t.updatedChapters)==null?void 0:b.length)??0)>0,l=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover,u=t.source==="local";return`
    <div class="manga-card" data-id="${t.id}">
      <div class="manga-card-cover">
        ${l?be(l,e,{kind:u?"local":"book"}):ie(u?"local":"book")}
        <div class="manga-card-badges">
          ${i>0?`<span class="badge badge-read" title="Read">${i}</span>`:""}
          <span class="badge badge-chapters" title="Total">${o}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${c?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${t.autoCheck?`<span class="badge badge-monitored" title="Auto-check enabled">${p("alarm-clock",{title:"Auto-check enabled"})}</span>`:""}
          ${k.activeCategory==="Favorites"?`<span class="badge badge-play" title="Click to Read">${p("play",{title:"Click to Read"})}</span>`:""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Tt(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function Oa(t){var n;const e=t.alias||t.title,s=((n=t.entries)==null?void 0:n.length)||t.entry_count||0;let a=null;return t.localCover&&t.coverBookmarkId?a=`/api/public/covers/${t.coverBookmarkId}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(a=t.cover),`
    <div class="manga-card series-card" data-series-id="${t.id}">
      <div class="manga-card-cover">
        ${a?be(a,e,{kind:"series"}):ie("series")}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${s} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Xe(){const t=localStorage.getItem("library_view_mode");if(t&&t!==k.viewMode&&(k.viewMode=t),k.activeCategory==="Favorites")return R.go("/favorites"),"";let e="";if(k.viewMode==="series"){const s=k.series.map(Oa).join("");e=`
      <div class="library-grid" id="library-grid">
        ${k.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const s=Mt(),n=k.searchAuthor&&k.searchQuery===k.searchAuthor?`
      <div class="manga-card search-sources-card" id="search-sources-card" title="Search online sources for ${Kt(k.searchAuthor)}"
           style="display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed var(--border-color, #3a3a4a);background:transparent;min-height:220px;text-align:center;">
        <div style="padding:1rem;color:var(--text-muted, #9aa);">
          <div style="font-size:2.5rem;line-height:1;margin-bottom:.5rem;">＋</div>
          <div style="font-size:.85rem;">Search sources for<br><strong style="color:var(--text-color, #fff);">${Kt(k.searchAuthor)}</strong></div>
        </div>
      </div>`:"",o=s.map(Pt).join("")+n;e=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">${p("search")}</span>
          <input type="text" id="library-search" placeholder="Search manga or author..." value="${k.searchQuery}" autocomplete="off">
          ${k.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${k.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${k.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${k.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${k.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${k.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
      </div>
      ${k.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">${p("palette")}</span>
          <span class="artist-filter-name">${k.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${k.loading?'<div class="loading-spinner"></div>':o||Tt()}
      </div>
    `}return`
    ${te(k.viewMode)}
    <div class="container">
      ${e}
    </div>
    ${Ua()}
    ${Ha()}
    ${za()}
  `}function Ua(){const{activeCategory:t}=k,s=(Array.isArray(k.categories)?k.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=s.some(n=>n.isNsfw);return`
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
    ${Va()}
      `}function Va(){const e=(Array.isArray(k.categories)?k.categories:[]).map(s=>typeof s=="object"?s:{name:s,isNsfw:!1});return`
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
  `}function Ha(){return`
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
      `}function za(){return`
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
      `}function vt(){k.activeCategory=null,k.artistFilter=null,k.searchQuery="",k.searchAuthor=null,k.searchAuthorSource=null,localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),ne()}async function yt(t){const e=t.target.closest(".manga-card");if(e){if(e.classList.contains("gallery-card")){const n=e.dataset.gallery;R.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=e.dataset.id,a=e.dataset.seriesId;if(a){R.go(`/series/${a}`);return}if(s){if(k.activeCategory==="Favorites"){const n=k.bookmarks.find(o=>o.id===s);if(n){let o=n.last_read_chapter;if(!o&&n.chapters&&n.chapters.length>0&&(o=[...n.chapters].sort((c,l)=>c.number-l.number)[0].number),o){R.go(`/read/${s}/${o}`);return}else d("No chapters available to read","warning")}}R.go(`/manga/${s}`)}}}function gs(){var B,A,T,O,z;const t=document.getElementById("app");t.removeEventListener("click",yt),t.addEventListener("click",yt),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",P=>{k.viewMode=P.detail.mode;const D=document.getElementById("app");D.innerHTML=Xe(),gs(),fe()}));const e=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");e&&s&&(e.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",P=>{const D=P.target.closest(".category-menu-item");if(D){const j=D.dataset.category||null;ja(j),s.classList.add("hidden")}})),(B=document.getElementById("manage-categories-btn"))==null||B.addEventListener("click",P=>{P.stopPropagation();const D=document.getElementById("manage-categories-modal");D&&D.classList.add("open")}),(A=document.getElementById("close-manage-categories-btn"))==null||A.addEventListener("click",()=>{var P;(P=document.getElementById("manage-categories-modal"))==null||P.classList.remove("open")}),(T=document.querySelector("#manage-categories-modal .modal-overlay"))==null||T.addEventListener("click",()=>{var P;(P=document.getElementById("manage-categories-modal"))==null||P.classList.remove("open")}),(O=document.querySelector("#manage-categories-modal .modal-close"))==null||O.addEventListener("click",()=>{var P;(P=document.getElementById("manage-categories-modal"))==null||P.classList.remove("open")}),(z=document.getElementById("add-category-btn"))==null||z.addEventListener("click",async()=>{var j;const P=document.getElementById("new-category-input"),D=(j=P==null?void 0:P.value)==null?void 0:j.trim();if(D)try{await f.post("/categories",{name:D}),P.value="",d("Category added","success"),await Se(!0),ne()}catch(V){d("Failed: "+V.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(P=>{P.addEventListener("change",async D=>{const j=P.dataset.category;try{await f.put(`/categories/${encodeURIComponent(j)}/nsfw`,{isNsfw:P.checked}),d(`${j} ${P.checked?"marked as 18+":"unmarked"}`,"success"),await Se(!0),ne()}catch(V){d("Failed: "+V.message,"error"),P.checked=!P.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(P=>{P.addEventListener("click",async()=>{const D=P.dataset.category;if(confirm(`Delete category "${D}"?`))try{await f.delete(`/categories/${encodeURIComponent(D)}`),d("Category deleted","success"),k.activeCategory===D&&(k.activeCategory=null,localStorage.removeItem("library_active_category")),await Se(!0),ne()}catch(j){d("Failed: "+j.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{k.artistFilter=null,localStorage.removeItem("library_artist_filter"),ne()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",P=>{var j;k.searchQuery=P.target.value,localStorage.setItem("library_search",P.target.value),k.searchAuthor=null,k.searchAuthorSource=null,localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source");const D=document.getElementById("library-grid");if(D){const V=Mt();D.innerHTML=V.map(Pt).join("")||Tt();const X=document.getElementById("search-clear");!X&&k.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(j=document.getElementById("search-clear"))==null||j.addEventListener("click",()=>{k.searchQuery="",k.searchAuthor=null,k.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),n.value="",ne()})):X&&!k.searchQuery&&X.remove()}}),k.searchQuery&&n.focus());const o=document.getElementById("search-clear");o&&o.addEventListener("click",()=>{k.searchQuery="",k.searchAuthor=null,k.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),ne()});const i=document.getElementById("search-sources-card");i&&i.addEventListener("click",()=>{const P=k.searchAuthor||k.searchQuery,D=k.searchAuthorSource||"nhentai.net";P&&(window.location.hash=`#/scrapers?browse=${encodeURIComponent(D)}&q=${encodeURIComponent(P)}`)});const c=document.getElementById("library-sort");c&&c.addEventListener("change",P=>{k.sortBy=P.target.value,localStorage.setItem("library_sort",k.sortBy),ne()}),window.removeEventListener("clearFilters",vt),window.addEventListener("clearFilters",vt);const l=document.getElementById("add-manga-btn"),u=document.getElementById("mobile-add-btn"),h=document.getElementById("add-modal"),y=document.getElementById("add-modal-close"),b=document.getElementById("add-modal-cancel"),x=document.getElementById("add-modal-submit"),E=document.getElementById("mobile-menu"),g=()=>{E&&E.classList.add("hidden"),h&&h.classList.add("open")};l&&l.addEventListener("click",g),u&&u.addEventListener("click",g),y&&y.addEventListener("click",()=>h.classList.remove("open")),b&&b.addEventListener("click",()=>h.classList.remove("open")),x&&x.addEventListener("click",async()=>{const P=document.getElementById("manga-url"),D=P.value.trim();if(!D){d("Please enter a URL","error");return}try{x.disabled=!0,x.textContent="Adding...",await f.addBookmark(D),d("Manga added successfully!","success"),h.classList.remove("open"),P.value="",await Se(),ne()}catch(j){d("Failed to add manga: "+j.message,"error")}finally{x.disabled=!1,x.textContent="Add"}});const S=document.getElementById("add-series-btn"),_=document.getElementById("mobile-add-series-btn"),M=document.getElementById("add-series-modal"),F=document.getElementById("add-series-modal-close"),q=document.getElementById("add-series-modal-cancel"),C=document.getElementById("add-series-modal-submit"),I=document.getElementById("mobile-menu");if((S||_)&&M){const P=()=>{I&&I.classList.add("hidden"),M.classList.add("open")};S&&S.addEventListener("click",P),_&&_.addEventListener("click",P)}F&&F.addEventListener("click",()=>M.classList.remove("open")),q&&q.addEventListener("click",()=>M.classList.remove("open")),C&&C.addEventListener("click",async()=>{const P=document.getElementById("series-title"),D=document.getElementById("series-alias"),j=P.value.trim(),V=D.value.trim();if(!j){d("Please enter a title","error");return}try{C.disabled=!0,C.textContent="Creating...",await f.createSeries(j,V),d("Series created successfully!","success"),M.classList.remove("open"),P.value="",D.value="",await Se(!0),ne()}catch(X){d("Failed to create series: "+X.message,"error")}finally{C.disabled=!1,C.textContent="Create"}});const w=M==null?void 0:M.querySelector(".modal-overlay");w&&w.addEventListener("click",()=>M.classList.remove("open"));const L=document.getElementById("empty-add-btn");L&&h&&L.addEventListener("click",()=>h.classList.add("open"));const m=document.getElementById("empty-add-series-btn");m&&M&&m.addEventListener("click",()=>M.classList.add("open"));const $=h==null?void 0:h.querySelector(".modal-overlay");$&&$.addEventListener("click",()=>h.classList.remove("open")),fe()}function ja(t){k.activeCategory=t,t?localStorage.setItem("library_active_category",t):localStorage.removeItem("library_active_category"),ne()}async function Se(t=!1){try{if(Z.isDemo){const[o,i]=await Promise.all([ae.loadBookmarks(t),ae.loadSeries(t)]);k.bookmarks=o,k.categories=[],k.series=i,k.favorites={favorites:{},listOrder:[]},k.loading=!1;return}const[e,s,a,n]=await Promise.all([ae.loadBookmarks(t),ae.loadCategories(t),ae.loadSeries(t),ae.loadFavorites(t)]);k.bookmarks=e,k.categories=s,k.series=a,k.favorites=n,k.loading=!1}catch{d("Failed to load library","error"),k.loading=!1}}async function ne(){var e;const t=document.getElementById("app");if(Z.isDemo)k.activeCategory=null,k.artistFilter=null,k.searchQuery="",k.searchAuthor=null,k.searchAuthorSource=null;else{const s=localStorage.getItem("library_active_category");k.activeCategory!==s&&(k.activeCategory=s);const a=localStorage.getItem("library_artist_filter")||null;k.artistFilter!==a&&(k.artistFilter=a);const n=localStorage.getItem("library_search")||"";k.searchQuery!==n&&(k.searchQuery=n),k.searchAuthor=localStorage.getItem("library_search_author")||null,k.searchAuthorSource=localStorage.getItem("library_search_author_source")||null}k.loading&&(t.innerHTML=Xe()),k.bookmarks.length===0&&k.loading&&await Se(),t.innerHTML=Xe(),gs(),sessionStorage.getItem("open_add_modal")&&(sessionStorage.removeItem("open_add_modal"),(e=document.getElementById("add-modal"))==null||e.classList.add("open")),Je.forEach(s=>s()),Je=[ae.subscribe("bookmarks",s=>{k.bookmarks=s;const a=document.getElementById("library-grid");if(a){const n=Mt();a.innerHTML=n.map(Pt).join("")||Tt()}})]}function Qa(){const t=document.getElementById("app");t&&t.removeEventListener("click",yt),window.removeEventListener("clearFilters",vt),Je.forEach(e=>e()),Je=[]}const Wa={mount:ne,unmount:Qa,render:Xe},Ga="manga-offline",Ka=1,Ce="images",J="chapters";let He=null;function Fe(){return new Promise((t,e)=>{if(He)return t(He);const s=indexedDB.open(Ga,Ka);s.onupgradeneeded=a=>{const n=a.target.result;n.objectStoreNames.contains(Ce)||n.createObjectStore(Ce),n.objectStoreNames.contains(J)||n.createObjectStore(J)},s.onsuccess=()=>{He=s.result,t(He)},s.onerror=()=>e(s.error)})}function xe(t,e){return Fe().then(s=>new Promise((a,n)=>{const c=s.transaction(t,"readonly").objectStore(t).get(e);c.onsuccess=()=>a(c.result),c.onerror=()=>n(c.error)}))}function bt(t,e,s){return Fe().then(a=>new Promise((n,o)=>{const l=a.transaction(t,"readwrite").objectStore(t).put(s,e);l.onsuccess=()=>n(),l.onerror=()=>o(l.error)}))}function wt(t,e){return Fe().then(s=>new Promise((a,n)=>{const c=s.transaction(t,"readwrite").objectStore(t).delete(e);c.onsuccess=()=>a(),c.onerror=()=>n(c.error)}))}function Rt(t){return Fe().then(e=>new Promise((s,a)=>{const i=e.transaction(t,"readonly").objectStore(t).getAllKeys();i.onsuccess=()=>s(i.result),i.onerror=()=>a(i.error)}))}function Ie(t,e){return`${t}:${e}`}function qt(t,e,s){return`${t}:${e}:${s}`}function Ya(t){const e=t.split(":");return{mangaId:e[0],chapterNum:parseFloat(e[1])}}async function Dt(t,e,s=null){const a=await f.get(`/bookmarks/${t}/chapters/${e}/reader-images`);if(!a||!a.images||a.images.length===0)throw new Error("No images found for this chapter");const n=a.images,o=n.length;let i=0;const c=f.getToken();for(let u=0;u<n.length;u++){const h=typeof n[u]=="string"?n[u]:n[u].url,y=h.startsWith("http")?h:`${window.location.origin}${h}`;try{const b=await fetch(y,{headers:c?{Authorization:`Bearer ${c}`}:{}});if(!b.ok)throw new Error(`HTTP ${b.status}`);const x=await b.blob();await bt(Ce,qt(t,e,h),x),i++,s&&s(i,o)}catch(b){console.error(`[Offline] Failed to cache image ${u+1}/${o}:`,b)}}const l={mangaId:t,chapterNum:e,imageUrls:n.map(u=>typeof u=="string"?u:u.url),savedAt:Date.now(),imageCount:i};return await bt(J,Ie(t,e),l),{success:!0,imageCount:i}}async function Ja(t,e){const s=await xe(J,Ie(t,e));if(!s)return null;const a=[];for(const n of s.imageUrls){const o=await xe(Ce,qt(t,e,n));if(o)a.push(URL.createObjectURL(o));else return a.forEach(i=>URL.revokeObjectURL(i)),null}return a}async function fs(t,e){const s=await xe(J,Ie(t,e));if(s&&s.imageUrls)for(const a of s.imageUrls)await wt(Ce,qt(t,e,a));await wt(J,Ie(t,e))}async function Xa(t,e){if(!await xe(J,Ie(t,e)))return!1;await fs(t,e);try{return await Dt(t,e),!0}catch(a){return console.warn("[Offline] Could not re-save chapter after edit:",a),!1}}async function Za(t,e){return!!await xe(J,Ie(t,e))}async function en(){const t=await Rt(J),e=[];for(const s of t){if(s.startsWith("auto-offline-"))continue;const a=await xe(J,s);a&&e.push(a)}return e}async function vs(t){const e=await Rt(J),s=[];for(const a of e)if(!a.startsWith("auto-offline-")&&a.startsWith(`${t}:`)){const{chapterNum:n}=Ya(a);s.push(n)}return s}async function tn(){if(navigator.storage&&navigator.storage.estimate){const t=await navigator.storage.estimate();return{used:t.usage||0,quota:t.quota||0,usedMB:((t.usage||0)/(1024*1024)).toFixed(1),quotaMB:((t.quota||0)/(1024*1024)).toFixed(0)}}return{used:0,quota:0,usedMB:"0",quotaMB:"Unknown"}}async function sn(){const t=await Fe();await new Promise((e,s)=>{const o=t.transaction(Ce,"readwrite").objectStore(Ce).clear();o.onsuccess=e,o.onerror=s}),await new Promise((e,s)=>{const o=t.transaction(J,"readwrite").objectStore(J).clear();o.onsuccess=e,o.onerror=s})}async function an(t,e){e?await bt(J,`auto-offline-${t}`,{enabled:!0,mangaId:t}):await wt(J,`auto-offline-${t}`)}async function nn(t){const e=await xe(J,`auto-offline-${t}`);return!!(e!=null&&e.enabled)}async function rn(){return(await Rt(J)).filter(e=>e.startsWith("auto-offline-")).map(e=>e.replace("auto-offline-",""))}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",async t=>{var e;if(((e=t.data)==null?void 0:e.type)==="sync-offline"){const s=t.data.mangaId;console.log(`[Offline] Auto-sync triggered for manga ${s}`);try{await ys(s)}catch(a){console.error("[Offline] Auto-sync failed:",a)}}});async function ys(t){try{const e=await f.getBookmark(t);if(!e)return;const s=e.downloadedChapters||[],a=await vs(t),n=s.filter(o=>!a.includes(o));console.log(`[Offline] ${n.length} new chapters to sync for ${e.alias||e.title}`);for(const o of n)await Dt(t,o),console.log(`[Offline] Auto-synced chapter ${o}`)}catch(e){console.error("[Offline] Sync error:",e)}}const on={saveChapterOffline:Dt,getOfflineChapter:Ja,deleteOfflineChapter:fs,refreshOfflineChapter:Xa,isChapterOffline:Za,getOfflineChapters:en,getOfflineChaptersForManga:vs,getStorageUsage:tn,clearAllOfflineData:sn,setAutoOffline:an,isAutoOffline:nn,getAutoOfflineManga:rn,syncNewChaptersForManga:ys};let r={manga:null,chapter:null,images:[],trophyPages:{},mode:"webtoon",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!1,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null,isStreamingMode:!1,_streamAbortController:null};function bs(){if(!r.manga||!r.chapter||!r.allFavorites||!r.allFavorites.favorites)return!1;if(r.isCollectionMode)return!0;let e=[$t()];if(r.mode==="manga"&&!r.singlePageMode){const n=W()[r.currentPage];n&&Array.isArray(n)?e=n:n&&n.pages&&(e=n.pages)}const s=e.map(a=>{const n=De(r.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in r.allFavorites.favorites){const n=r.allFavorites.favorites[a];if(Array.isArray(n)){for(const o of n)if(o.mangaId===r.manga.id&&o.chapterNum===r.chapter.number&&o.imagePaths)for(const i of o.imagePaths){const c=typeof i=="string"?i:(i==null?void 0:i.filename)||(i==null?void 0:i.path);for(const l of s)if(l&&l.filename===c)return!0}}}return!1}function kt(){const t=document.getElementById("favorites-btn");t&&(bs()?t.classList.add("active"):t.classList.remove("active"))}function Ee(){var u;if(r.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!r.manga||!r.images.length&&!r.isStreamingMode)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const t=r.manga.alias||r.manga.title,e=(u=r.chapter)==null?void 0:u.number,a=W().length,n=r.images.length;let o,i;r.mode==="webtoon"?(o=n-1,i=`${n} pages`):r.singlePageMode?(o=n-1,i=`${r.currentPage+1} / ${n}`):(o=a-1,i=`${r.currentPage+1} / ${a}`);const c=bs(),l=Es();return`
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
        ${r.isCollectionMode?ws():r.mode==="webtoon"?ks():$s()}
      </div>
      
      <!-- Footer -->
      <div class="reader-footer">
        ${r.isStreamingMode?"":`
        <button class="btn btn-secondary" id="prev-chapter-btn">← Prev</button>
        `}
        <div class="page-slider-container">
          ${r.mode!=="webtoon"?`
          <input type="range" class="page-slider" id="page-slider"
            min="0" max="${o}" value="${r.currentPage}"
          >
          `:""}
          <span class="page-indicator" id="page-indicator">${i}</span>
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
  `}function ws(){const t=r.mode==="manga";if(t&&!r.singlePageMode){const e=r.images[r.currentPage];if(!e)return"";const s=e.urls||[e.url],a=e.displayMode||"single";return e.displaySide,a==="double"&&s.length>=2?`
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
      ${(t?[r.images[r.currentPage]]:r.images).map((e,s)=>{if(!e)return"";const a=e.displayMode||"single",n=e.displaySide||"left",o=e.urls||[e.url];return a==="double"&&o.length>=2?`
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
  `}function ks(){return`
    <div class="webtoon-pages">
      ${r.images.map((t,e)=>{const s=typeof t=="string"?t:t.url,a=r.trophyPages[e];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${e}">
          ${a?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
          <img src="${s}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function $s(){if(r.singlePageMode)return ln();const e=W()[r.currentPage];if(!e)return"";if(e.type==="link"){const s=e.pages[0],a=r.images[s],n=typeof a=="string"?a:a.url,o=r.trophyPages[s];return`
        <div class="manga-spread ${r.direction}">
          <div class="manga-page ${o?"trophy-page":""}">
            ${o?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
            <img src="${n}" alt="Page ${s+1}">
          </div>
          <div class="manga-page link-page" id="link-page">
            <div class="link-overlay">Ch. ${e.nextChapter} →</div>
            <img src="${e.nextImage}" alt="Next chapter preview">
          </div>
        </div>
      `}return`
    <div class="manga-spread ${r.direction}">
      ${e.map(s=>{const a=r.images[s],n=typeof a=="string"?a:a.url,o=r.trophyPages[s];return`
        <div class="manga-page ${o?"trophy-page":""}">
          ${o?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
          <img src="${n}" alt="Page ${s+1}">
        </div>
      `}).join("")}
    </div>
  `}function ln(){const t=r.currentPage,e=r.trophyPages[t];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[o,i]=e.pages,c=r.images[o],l=r.images[i],u=typeof c=="string"?c:c==null?void 0:c.url,h=typeof l=="string"?l:l==null?void 0:l.url;if(u&&h)return`
            <div class="manga-spread ${r.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">${p("trophy")}</div><img src="${u}" alt="Page ${o+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">${p("trophy")}</div><img src="${h}" alt="Page ${i+1}"></div>
            </div>
            `}const s=r.images[t];if(!s)return"";const a=typeof s=="string"?s:s.url,n=r.trophyPages[t];return`
    <div class="manga-spread single ${r.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
        <img src="${a}" alt="Page ${t+1}">
      </div>
    </div>
  `}function W(){const t=[],e=r.images.length;let s=0;if(r.isCollectionMode){for(let n=0;n<e;n++)t.push([n]);return t}let a=!r.firstPageSingle;for(;s<e;){const n=r.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[o,i]=n.pages;t.push([o,i]),s=Math.max(o,i)+1}else t.push([s]),s++;continue}if(!a){a=!0,t.push([s]),s++;continue}if(r.lastPageSingle&&s===e-1){r.nextChapterImage?t.push({type:"link",pages:[s],nextImage:r.nextChapterImage,nextChapter:r.nextChapterNum}):t.push([s]),s++;break}s+1<e?r.trophyPages[s+1]?(t.push([s]),s++):r.lastPageSingle&&s+1===e-1?(t.push([s]),r.nextChapterImage?t.push({type:"link",pages:[s+1],nextImage:r.nextChapterImage,nextChapter:r.nextChapterNum}):t.push([s+1]),s+=2):(t.push([s,s+1]),s+=2):(t.push([s]),s++)}return t}function Es(){if(r.singlePageMode)return!!r.trophyPages[r.currentPage];const e=W()[r.currentPage];return e?(Array.isArray(e)?e:e.pages||[]).some(a=>!!r.trophyPages[a]):!1}function Cs(){if(r.singlePageMode)return[r.currentPage];const e=W()[r.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function cn(){if(!r.manga||!r.chapter||r.isCollectionMode)return;const t=Cs();if(t.length===0)return;if(t.some(s=>!!r.trophyPages[s])){const s=[...t];if(r.singlePageMode){const a=r.trophyPages[r.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete r.trophyPages[a]),d(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=t,a=r.singlePageMode||t.length===1;if(!r.singlePageMode&&t.length===2){const o=await Is(t,"Mark as trophy");if(!o)return;s=o.pages,a=o.pages.length===1}s.forEach(o=>{r.trophyPages[o]={isSingle:a,pages:[...s]}});const n=a?"single":"double";d(`Page${s.length>1?"s":""} marked as trophy (${n})`,"success")}try{await f.saveTrophyPages(r.manga.id,r.chapter.number,r.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}ge(),xs()}function xs(){const t=document.getElementById("trophy-btn");if(t){const e=Es();t.classList.toggle("active",e),t.title=e?"Unmark trophy":"Mark as trophy"}}async function Oe(){if(!r.manga||!r.chapter||r.isCollectionMode||!r.images.length)return;let t=1;if(r.mode==="manga")if(r.singlePageMode)t=r.currentPage+1;else{const s=W()[r.currentPage];s&&s.length>0&&(t=s[0]+1)}else{const e=document.getElementById("reader-content");if(e){const s=e.querySelectorAll("img"),a=e.scrollTop;let n=0;s.forEach((o,i)=>{a>=n&&(t=i+1),n+=o.offsetHeight})}}try{if(Z.isDemo)return;await f.updateReadingProgress(r.manga.id,r.chapter.number,t,r.images.length)}catch(e){console.error("Failed to save progress:",e)}}function Ze(){var s,a,n,o,i,c,l,u,h,y,b,x,E,g,S,_,M,F,q;const t=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{r.isStreamingMode||(await Oe(),await ve()),r.isStreamingMode?R.go("/scrapers"):r.manga&&r.manga.id!=="gallery"?R.go(`/manga/${r.manga.id}`):R.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{R.go(r.isStreamingMode?"/scrapers":"/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var C;(C=document.getElementById("reader-settings"))==null||C.classList.toggle("hidden")}),(o=document.getElementById("close-settings-btn"))==null||o.addEventListener("click",()=>{var C;(C=document.getElementById("reader-settings"))==null||C.classList.add("hidden")}),(i=document.getElementById("single-page-btn"))==null||i.addEventListener("click",()=>{var C,I;if(r.singlePageMode){const w=W();let L=0;for(let m=0;m<w.length;m++)if(w[m].includes(r.currentPage)){L=m;break}r.singlePageMode=!1,r.currentPage=L}else{const L=W()[r.currentPage];r.singlePageMode=!0,r.currentPage=L?L[0]:0}localStorage.setItem("reader_single_page",r.singlePageMode?"1":"0"),(C=r.manga)!=null&&C.id&&((I=r.chapter)!=null&&I.number)&&ve(),Re()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{cn()}),t.querySelectorAll("[data-mode]").forEach(C=>{C.addEventListener("click",()=>{var L,m;const I=C.dataset.mode;let w=$t();if(r.mode=I,localStorage.setItem("reader_mode",r.mode),I==="webtoon")r.currentPage=w;else if(r.singlePageMode)r.currentPage=w;else{const $=W();let B=0;for(let A=0;A<$.length;A++)if($[A].includes(w)){B=A;break}r.currentPage=B}(L=r.manga)!=null&&L.id&&((m=r.chapter)!=null&&m.number)&&ve(),Re(),I==="webtoon"&&setTimeout(()=>{const $=document.getElementById("reader-content");if($){const B=$.querySelectorAll("img");B[w]&&B[w].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),t.querySelectorAll("[data-direction]").forEach(C=>{C.addEventListener("click",async()=>{var I,w;r.direction=C.dataset.direction,localStorage.setItem("reader_direction",r.direction),(I=r.manga)!=null&&I.id&&((w=r.chapter)!=null&&w.number)&&await ve(),Re()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async C=>{r.firstPageSingle=C.target.checked,await ve(),ge()}),(u=document.getElementById("last-page-single"))==null||u.addEventListener("change",async C=>{var I,w;r.lastPageSingle=C.target.checked,await ve(),r.lastPageSingle&&((I=r.manga)!=null&&I.id)&&((w=r.chapter)!=null&&w.number)?await Ss():(r.nextChapterImage=null,r.nextChapterNum=null),ge()}),(h=document.getElementById("zoom-slider"))==null||h.addEventListener("input",C=>{r.zoom=parseInt(C.target.value);const I=document.getElementById("reader-content");I&&(I.style.zoom=`${r.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",C=>{const I=parseInt(C.target.value),w=document.getElementById("page-indicator");w&&(r.singlePageMode?w.textContent=`${I+1} / ${r.images.length}`:w.textContent=`${I+1} / ${W().length}`)}),e.addEventListener("change",C=>{r.currentPage=parseInt(C.target.value),ge()})),r.mode==="manga"){const C=document.getElementById("reader-content");C==null||C.addEventListener("click",I=>{var $;if(I.target.closest("button, a, .link-overlay"))return;const w=C.getBoundingClientRect(),m=(I.clientX-w.left)/w.width;m<.3?Et():m>.7?Ge():(r.showControls=!r.showControls,($=document.querySelector(".reader"))==null||$.classList.toggle("controls-hidden",!r.showControls))})}document.addEventListener("keydown",Ls),(y=document.getElementById("prev-chapter-btn"))==null||y.addEventListener("click",()=>et(-1)),(b=document.getElementById("next-chapter-btn"))==null||b.addEventListener("click",()=>et(1)),r.mode==="webtoon"&&((x=document.getElementById("reader-content"))==null||x.addEventListener("click",()=>{var C;r.showControls=!r.showControls,(C=document.querySelector(".reader"))==null||C.classList.toggle("controls-hidden",!r.showControls)})),(E=document.getElementById("rotate-btn"))==null||E.addEventListener("click",async()=>{const C=ct();if(!(!C||!r.manga||!r.chapter))try{d("Rotating...","info");const I=await f.rotatePage(r.manga.id,r.chapter.number,C);I.images&&(await dt(I.images),d("Page rotated","success"))}catch(I){d("Rotate failed: "+I.message,"error")}}),(g=document.getElementById("swap-btn"))==null||g.addEventListener("click",async()=>{const I=W()[r.currentPage];if(!I||I.length!==2||!r.manga||!r.chapter){d("Select a spread with 2 pages to swap","info");return}const w=De(r.images[I[0]]),L=De(r.images[I[1]]);if(!(!w||!L))try{d("Swapping...","info");const m=await f.swapPages(r.manga.id,r.chapter.number,w,L);m.images&&(await dt(m.images),d("Pages swapped","success"))}catch(m){d("Swap failed: "+m.message,"error")}}),(S=document.getElementById("split-btn"))==null||S.addEventListener("click",async()=>{const C=ct();if(!C||!r.manga||!r.chapter||!confirm("Split this page into halves? This is permanent."))return;const I=document.getElementById("split-btn");try{d("Preparing to split...","info"),I&&(I.disabled=!0),r.images=[],r.loading=!0,t.innerHTML=Ee(),await new Promise(L=>setTimeout(L,2e3)),d("Splitting page...","info");const w=await f.splitPage(r.manga.id,r.chapter.number,C);I&&(I.disabled=!1),await ke(r.manga.id,r.chapter.number,r.chapter.versionUrl),t.innerHTML=Ee(),Ze(),ge(),w.warning?d(w.warning,"warning"):d("Page split into halves","success")}catch(w){I&&(I.disabled=!1),d("Split failed: "+w.message,"error"),await ke(r.manga.id,r.chapter.number,r.chapter.versionUrl),t.innerHTML=Ee(),Ze()}}),(_=document.getElementById("delete-page-btn"))==null||_.addEventListener("click",async()=>{const C=ct();if(!(!C||!r.manga||!r.chapter)&&confirm(`Delete page "${C}" permanently? This cannot be undone.`))try{d("Deleting...","info");const I=await f.deletePage(r.manga.id,r.chapter.number,C);I.images&&(await dt(I.images),d("Page deleted","success"))}catch(I){d("Delete failed: "+I.message,"error")}}),(M=document.getElementById("favorites-btn"))==null||M.addEventListener("click",async()=>{try{const w=await f.getFavorites();r.allFavorites=w,r.favoriteLists=Object.keys(w.favorites||w||{})}catch(w){console.error("Failed to load favorites",w),d("Failed to load favorites","error");return}let I=[$t()];if(r.mode==="manga"&&!r.singlePageMode){const L=W()[r.currentPage];L&&Array.isArray(L)?I=L:L&&L.pages&&(I=L.pages)}if(I.length>1){const w=await Is(I,"Select Page for Favorites");if(!w)return;I=w.pages}pn(I)}),(F=document.getElementById("fullscreen-btn"))==null||F.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{d("Fullscreen not supported","info")})}),(q=document.getElementById("stream-add-lib-btn"))==null||q.addEventListener("click",async()=>{var w;const C=document.getElementById("stream-add-lib-btn");if(!((w=r.manga)!=null&&w._streamUrl)){d("No URL to add","error");return}const I=C.innerHTML;C.innerHTML=p("loader",{spin:!0}),C.disabled=!0;try{const L=await f.addBookmark(r.manga._streamUrl);if(!L.jobId)throw new Error("No job ID returned");d("Adding to library...","info");const m=setInterval(async()=>{var $;try{const A=(await f.getQueueHistory(20)).find(T=>T.id===L.jobId);A&&(A.status==="completed"?(clearInterval(m),($=A.result)!=null&&$.bookmark&&(d("Added to library!","success"),C.innerHTML=p("check"),C.title="Added! Click to view",C.disabled=!1,C.onclick=()=>{R.go(`/manga/${A.result.bookmark.id}`)})):A.status==="failed"&&(clearInterval(m),d("Failed to add: "+(A.error||"Unknown error"),"error"),C.innerHTML=I,C.disabled=!1))}catch{}},1500)}catch(L){d("Failed to add: "+L.message,"error"),C.innerHTML=I,C.disabled=!1}}),document.body.classList.add("reader-active")}function De(t){var n;const e=typeof t=="string"?t:(t==null?void 0:t.url)||((n=t==null?void 0:t.urls)==null?void 0:n[0]);if(!e)return null;const a=e.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function ct(){const t=Cs();return t.length===0?null:De(r.images[t[0]])}async function dt(t){var s,a;(s=r.manga)!=null&&s.id&&((a=r.chapter)!=null&&a.number)&&!r.isStreamingMode&&on.refreshOfflineChapter(r.manga.id,r.chapter.number).then(n=>{n&&console.log("[Reader] Refreshed offline copy after page edit")}).catch(n=>console.warn("[Reader] Offline refresh failed:",n));const e=Date.now();if(r.images=t.map(n=>{const o=typeof n=="string"?n:n==null?void 0:n.url;if(!o)return n;const i=o+(o.includes("?")?"&":"?")+`_t=${e}`;return typeof n=="string"?i:{...n,url:i}}),r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.min(r.currentPage,r.images.length-1);else{const n=W();r.currentPage=Math.min(r.currentPage,n.length-1)}r.currentPage=Math.max(0,r.currentPage),ge()}async function Ss(){var t,e;if(!(!((t=r.manga)!=null&&t.id)||!((e=r.chapter)!=null&&e.number)))try{const s=await f.getNextChapterPreview(r.manga.id,r.chapter.number);r.nextChapterImage=s.firstImage||null,r.nextChapterNum=s.nextChapter||null}catch{r.nextChapterImage=null,r.nextChapterNum=null}}async function dn(){var o,i;if(!((o=r.manga)!=null&&o.id)||!((i=r.chapter)!=null&&i.number)||r.isCollectionMode)return;const e=[...r.manga.downloadedChapters||[]].sort((c,l)=>c-l),s=e.indexOf(r.chapter.number);if(s<0||s>=e.length-1)return;const a=e[s+1],n=r.manga.id;if(!(r._preloadCache&&r._preloadCache.chapterNum===a&&r._preloadCache.mangaId===n))try{const l=(r.manga.downloadedVersions||{})[a]||[],u=Array.isArray(l)?l[0]:l,h=u?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(u)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,b=(await f.get(h)).images||[];if(b.length===0)return;const x=b.map(E=>{const g=new Image,S=typeof E=="string"?E:E.url;return S&&(g.src=S),g});r._preloadCache={chapterNum:a,mangaId:n,images:b,imageObjects:x,versionUrl:u},console.log(`[Reader] Preloaded ${b.length} images for chapter ${a}`)}catch(c){console.warn("[Reader] Failed to preload next chapter:",c)}}function un(t,e){return new Promise(s=>{const a=document.createElement("div");a.className="version-modal-overlay",a.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${t.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const n=a.querySelector(".version-list");t.forEach((o,i)=>{const c=document.createElement("button");c.className="version-item",c.textContent=`Version ${i+1}`,c.addEventListener("click",()=>{a.remove(),s(o)}),n.appendChild(c)}),a.querySelector(".version-cancel").addEventListener("click",()=>{a.remove(),s(null)}),a.addEventListener("click",o=>{o.target===a&&(a.remove(),s(null))}),document.body.appendChild(a)})}function pn(t){if(!r.manga||!r.chapter)return;const e=t.map(l=>{const u=De(r.images[l]);return u?{filename:u}:null}).filter(Boolean),s=l=>{if(!r.allFavorites||!r.allFavorites.favorites)return-1;const u=r.allFavorites.favorites[l];if(!Array.isArray(u))return-1;for(let h=0;h<u.length;h++){const y=u[h];if(y.mangaId===r.manga.id&&y.chapterNum===r.chapter.number&&y.imagePaths)for(const b of y.imagePaths){const x=typeof b=="string"?b:(b==null?void 0:b.filename)||(b==null?void 0:b.path);for(const E of e)if(E&&E.filename===x)return h}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";r.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',r.favoriteLists.forEach(l=>{const h=s(l)!==-1;n+=`
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
    `;const o=document.createElement("style");o.innerHTML=`
        .list-option.active-list {
            background: #2a3b2a;
            border-color: #4CAF50;
        }
        .list-option.active-list:hover {
            background: #384d38;
        }
    `,a.appendChild(o),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),kt()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),kt())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const u=l.dataset.list,h=s(u),y=h!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(y){await f.removeFavoriteItem(u,h);const b=await f.getFavorites();r.allFavorites=b,l.classList.remove("active-list"),l.querySelector("span:last-child").innerHTML=p("plus")}else{const b=t.length>1?"double":"single",x={mangaId:r.manga.id,chapterNum:r.chapter.number,title:`${r.manga.alias||r.manga.title} Ch.${r.chapter.number} p${t[0]+1}`,imagePaths:e,displayMode:b,displaySide:r.direction==="rtl"?"right":"left"};await f.addFavoriteItem(u,x);const E=await f.getFavorites();r.allFavorites=E,l.classList.add("active-list"),l.querySelector("span:last-child").innerHTML=p("check")}}catch(b){console.error(b)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function Is(t,e){return new Promise(s=>{const[a,n]=t,o=r.images[a],i=r.images[n],c=typeof o=="string"?o:o==null?void 0:o.url,l=typeof i=="string"?i:i==null?void 0:i.url,u=r.direction==="rtl",h=u?n:a,y=u?a:n,b=u?l:c,x=u?c:l,E=document.createElement("div");E.className="page-picker-overlay",E.innerHTML=`
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
        `;const g=S=>{E.remove(),s(S)};E.querySelectorAll(".page-picker-option").forEach(S=>{S.addEventListener("click",()=>{const _=S.dataset.choice;_==="left"?g({pages:[h]}):_==="right"?g({pages:[y]}):_==="both"&&g({pages:t})})}),E.querySelector(".page-picker-cancel").addEventListener("click",()=>g(null)),E.addEventListener("click",S=>{S.target===E&&g(null)}),document.body.appendChild(E)})}function $t(){if(r.mode==="webtoon"){const t=document.getElementById("reader-content");if(t){const e=t.querySelectorAll("img");if(e.length>0){const s=t.scrollTop;if(s>10){let a=0;for(let n=0;n<e.length;n++){const o=e[n].offsetHeight;if(a+o>s)return n;a+=o}}}}return 0}else{if(r.singlePageMode)return r.currentPage;{const e=W()[r.currentPage];return e&&e.length>0?e[0]:0}}}function Ls(t){if(!(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA")){if(t.key==="Escape"){Oe(),r.manga&&R.go(`/manga/${r.manga.id}`);return}if(r.mode==="manga")t.key==="ArrowLeft"?r.direction==="rtl"?Ge():Et():t.key==="ArrowRight"?r.direction==="rtl"?Et():Ge():t.key===" "&&(t.preventDefault(),Ge());else if(r.mode==="webtoon"&&t.key===" "){t.preventDefault();const e=document.getElementById("reader-content");if(e){const s=e.clientHeight*.8;e.scrollBy({top:t.shiftKey?-s:s,behavior:"smooth"})}}}}function Ge(){const t=W(),e=r.singlePageMode?r.images.length-1:t.length-1;if(r.currentPage<e)r.currentPage++,ge();else{const s=t[r.currentPage],a=s&&s.type==="link";Oe(),a&&(r.navigationDirection="next-linked"),et(1)}}function Et(){r.currentPage>0?(r.currentPage--,ge()):et(-1)}function ge(){const t=document.getElementById("reader-content");if(t){t.innerHTML=r.isCollectionMode?ws():r.mode==="webtoon"?ks():$s();const e=document.getElementById("page-indicator");e&&(r.singlePageMode?e.textContent=`${r.currentPage+1} / ${r.images.length}`:e.textContent=`${r.currentPage+1} / ${W().length}`);const s=document.getElementById("page-slider");s&&(s.value=r.currentPage,s.max=r.singlePageMode?r.images.length-1:W().length-1),xs(),kt()}}function Re(){const t=document.getElementById("app");t&&(t.innerHTML=Ee(),Ze())}async function et(t){if(console.log("[Nav] navigateChapter called with delta:",t),r.isStreamingMode)return;if(!r.manga||!r.chapter){console.log("[Nav] early return - no manga or chapter");return}await Oe(),await ve();const s=[...r.manga.downloadedChapters||[]].sort((o,i)=>o-i),a=s.indexOf(r.chapter.number),n=a+t;if(console.log("[Nav]",{delta:t,chapterNumber:r.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length){r.navigationDirection||(r.navigationDirection=t<0?"prev":null);const o=s[n],c=(r.manga.downloadedVersions||{})[o]||[],l=Array.isArray(c)?c[0]:c,u=l?`?version=${encodeURIComponent(l)}`:"";console.log("[Nav] Calling router.go with:",`/read/${r.manga.id}/${o}${u}`),R.go(`/read/${r.manga.id}/${o}${u}`)}else d(t>0?"Last chapter":"First chapter","info")}async function ke(t,e,s){var a,n,o,i,c;console.log("[Reader] loadData called:",{mangaId:t,chapterNum:e,versionUrl:s});try{if(r.mode=localStorage.getItem("reader_mode")||"webtoon",r.direction=localStorage.getItem("reader_direction")||"rtl",r.singlePageMode=localStorage.getItem("reader_single_page")==="1",t==="gallery"){const l=decodeURIComponent(e),h=((a=(await f.getFavorites()).favorites)==null?void 0:a[l])||[];r.images=[];for(const y of h){const b=y.imagePaths||[],x=[];for(const E of b){let g;typeof E=="string"?g=E:E&&typeof E=="object"&&(g=E.filename||E.path||E.name||E.url,g&&g.includes("/")&&(g=g.split("/").pop()),g&&g.includes("\\")&&(g=g.split("\\").pop())),g&&x.push(`/api/public/chapter-images/${y.mangaId}/${y.chapterNum}/${encodeURIComponent(g)}`)}x.length>0&&r.images.push({urls:x,displayMode:y.displayMode||"single",displaySide:y.displaySide||"left"})}r.manga={id:"gallery",title:l,alias:l},r.chapter={number:"Gallery"},r.isGalleryMode=!0,r.isCollectionMode=!0,r.images.length===0&&d("Gallery is empty","warning")}else if(t==="trophies"){const l=e;let u=[],h="Trophies";if(l.startsWith("series-")){const y=l.replace("series-",""),x=(await store.loadSeries()).find(S=>S.id===y);h=x?x.alias||x.title:"Series Trophies";const g=(await store.loadBookmarks()).filter(S=>S.seriesId===y);for(const S of g){const _=await f.getTrophyPagesAll(S.id);for(const M in _)for(const F in _[M]){const q=_[M][F],I=(await f.getChapterImages(S.id,M)).images[F],w=typeof I=="string"?I.split("/").pop():(I==null?void 0:I.filename)||(I==null?void 0:I.path);u.push({mangaId:S.id,chapterNum:M,imagePaths:[{filename:w}],displayMode:q.isSingle?"single":"double",displaySide:"left"})}}}else{const y=await f.getBookmark(l);h=y?y.alias||y.title:"Manga Trophies";const b=await f.getTrophyPagesAll(l);for(const x in b)for(const E in b[x]){const g=b[x][E],_=(await f.getChapterImages(l,x)).images[E],M=typeof _=="string"?_.split("/").pop():(_==null?void 0:_.filename)||(_==null?void 0:_.path);u.push({mangaId:l,chapterNum:x,imagePaths:[{filename:decodeURIComponent(M)}],displayMode:g.isSingle?"single":"double",displaySide:"left"})}}r.images=u.map(y=>{const b=y.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${y.mangaId}/${y.chapterNum}/${encodeURIComponent(b)}`],displayMode:y.displayMode,displaySide:y.displaySide}}),r.manga={id:"trophies",title:h,alias:h},r.chapter={number:"🏆"},r.isCollectionMode=!0,r.isGalleryMode=!1}else if(t==="stream"){r.isStreamingMode=!0,r.isCollectionMode=!1,r.isGalleryMode=!1,r.singlePageMode=!0;const l=sessionStorage.getItem("streamPreviewUrl"),u=sessionStorage.getItem("streamPreviewScraper"),h=sessionStorage.getItem("streamPreviewTitle")||"Preview";r.manga={id:"stream",title:h,alias:h,_streamUrl:l},r.chapter={number:1},r.images=[],l?hn(l,u):d("No stream URL found","error")}else{r.isGalleryMode=!1;const l=await f.getBookmark(t);r.manga=l,console.log("[Reader] manga loaded, finding chapter..."),r.chapter=((n=l.chapters)==null?void 0:n.find(h=>h.number===parseFloat(e)))||{number:parseFloat(e)};const u=parseFloat(e);if(r._preloadCache&&r._preloadCache.mangaId===t&&r._preloadCache.chapterNum===u)console.log("[Reader] Using preloaded images for chapter",e),r.images=r._preloadCache.images||[],r._preloadCache=null;else{const h=s?`/bookmarks/${t}/chapters/${e}/reader-images?version=${encodeURIComponent(s)}`:`/bookmarks/${t}/chapters/${e}/reader-images`,y=await f.get(h);console.log("[Reader] images loaded, count:",(o=y.images)==null?void 0:o.length),r.images=y.images||[]}try{const h=await f.getChapterSettings(t,e);if(Yt(h))Jt(h);else try{const b=[...r.manga.downloadedChapters||[]].sort((_,M)=>_-M),x=parseFloat(e),E=b.indexOf(x),g=[];if(E!==-1){for(let _=E-1;_>=0;_--)g.push(b[_]);for(let _=E+1;_<b.length;_++)g.push(b[_])}const S=12;for(const _ of g.slice(0,S)){const M=await f.getChapterSettings(t,_);if(Yt(M)){Jt(M),console.log("[Reader] Inherited settings from chapter",_);break}}}catch(y){console.warn("Failed to inherit chapter settings",y)}}catch(h){console.warn("Failed to load chapter settings",h)}try{const h=await f.getTrophyPages(t,e);r.trophyPages=h||{}}catch(h){console.warn("Failed to load trophy pages",h)}try{const h=await f.getFavorites();r.allFavorites=h,r.favoriteLists=Object.keys(h.favorites||h||{})}catch(h){console.warn("Failed to load favorites",h)}}if(r.isStreamingMode)r.currentPage=0;else{const l=parseFloat(e),u=(c=(i=r.manga)==null?void 0:i.readingProgress)==null?void 0:c[l];if(u&&u.page<u.totalPages)if(r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.max(0,u.page-1);else{const h=Math.max(0,u.page-1),y=W();let b=0;for(let x=0;x<y.length;x++){const E=y[x],g=Array.isArray(E)?E:E.pages||[];if(g.includes(h)||g[0]>=h){b=x;break}b=x}r.currentPage=b}else r.currentPage=0,r._resumeScrollToPage=u.page-1;else r.currentPage=0}}catch(l){console.error("Error loading chapter:",l),d("Failed to load chapter","error")}if(!r.isStreamingMode){if(r.navigationDirection==="prev"&&r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.max(0,r.images.length-1);else{const l=W();r.currentPage=Math.max(0,l.length-1)}else if(r.navigationDirection==="next-linked"&&r.mode==="manga"&&r.images.length>1)if(r.singlePageMode)r.currentPage=1;else{const l=W();let u=0;for(let h=0;h<l.length;h++){const y=l[h];if((Array.isArray(y)?y:y.pages||[]).includes(1)){u=h;break}}r.currentPage=u}}r.navigationDirection=null,r.lastPageSingle&&!r.isStreamingMode&&await Ss(),r.loading=!1,Re(),r.isStreamingMode||dn(),r.mode==="webtoon"&&r._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const u=l.querySelectorAll("img");u[r._resumeScrollToPage]&&u[r._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete r._resumeScrollToPage},300)}async function hn(t,e){r._streamAbortController&&r._streamAbortController.abort(),r._streamAbortController=new AbortController;const{signal:s}=r._streamAbortController;try{let a="/api/scrapers/preview-images-stream?";e&&(a+=`scraper=${encodeURIComponent(e)}&`),a+=`url=${encodeURIComponent(t)}`;const n=localStorage.getItem("manga_auth_token"),o={};n&&(o.Authorization=`Bearer ${n}`),console.log("[Reader] Starting stream from:",a);const i=await fetch(a,{headers:o,signal:s});if(!i.ok)throw new Error(`Failed to start stream: ${i.statusText}`);const c=i.body.getReader(),l=new TextDecoder;let u="";for(;;){const{value:h,done:y}=await c.read();if(y||s.aborted)break;u+=l.decode(h,{stream:!0});const b=u.split(`

`);u=b.pop();let x=!1;for(const E of b)if(E.startsWith("data: ")){const g=E.substring(6);try{const S=JSON.parse(g);if(S.type==="metadata")r.manga.title=S.title,r.manga.alias=S.title,Re();else if(S.type==="image"){const _=`/api/scrapers/proxy-cover?url=${encodeURIComponent(S.url)}`;r.images.push(_),x=!0}else if(S.type==="error")d("Stream error: "+S.message,"error");else if(S.type==="done")break}catch(S){console.error("Parse error for SSE data:",S)}}x&&ge()}}catch(a){a.name!=="AbortError"&&(console.error("Preview stream error:",a),d("Stream failed: "+a.message,"error"))}finally{r._streamAbortController&&r._streamAbortController.signal===s&&(r._streamAbortController=null)}}async function mn(t=[]){console.log("[Reader] mount called with params:",t);let[e,s]=t,a=null;if(s&&s.includes("?")){const[o,i]=s.split("?");s=o,a=new URLSearchParams(i).get("version")}if(console.log("[Reader] mangaId:",e,"chapterNum:",s,"urlVersion:",a),!e||!s){R.go("/");return}const n=document.getElementById("app");if(r.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),r.images=[],r.singlePageMode=!1,r._resumeScrollToPage=null,r.nextChapterImage=null,r.nextChapterNum=null,n.innerHTML=Ee(),a)await ke(e,s,decodeURIComponent(a));else try{const o=await f.getBookmark(e),i=o.downloadedVersions||{},c=new Set(o.deletedChapterUrls||[]),l=i[parseFloat(s)];let u=[];if(Array.isArray(l)&&(u=l.filter(h=>!c.has(h))),u.length>1){const h=await un(u,s);if(h===null){R.go(`/manga/${e}`);return}await ke(e,s,h)}else u.length===1?await ke(e,s,u[0]):await ke(e,s)}catch(o){console.log("[Reader] Error in version check, falling back:",o),await ke(e,s)}if(n.innerHTML=Ee(),console.log("[Reader] render called, loading:",r.loading,"manga:",!!r.manga,"images:",r.images.length),Ze(),r.mode==="webtoon"&&r._resumeScrollToPage!=null){const o=r._resumeScrollToPage;r._resumeScrollToPage=null,setTimeout(()=>{const i=document.getElementById("reader-content");if(i){const c=i.querySelectorAll("img");c[o]&&c[o].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function gn(){console.log("[Reader] unmount called"),r._streamAbortController&&(r._streamAbortController.abort(),r._streamAbortController=null),r.isStreamingMode||(await Oe(),await ve()),document.body.classList.remove("reader-active"),document.removeEventListener("keydown",Ls),r.manga=null,r.chapter=null,r.images=[],r.loading=!0,r.singlePageMode=!1,r.isStreamingMode=!1,r._resumeScrollToPage=null,r._preloadCache=null}function Yt(t){return!!t&&(t.mode!==void 0||t.direction!==void 0||t.firstPageSingle!==void 0||t.lastPageSingle!==void 0||t.singlePageMode!==void 0)}function Jt(t){t&&(t.mode&&(r.mode=t.mode),t.direction&&(r.direction=t.direction),t.firstPageSingle!==void 0&&(r.firstPageSingle=t.firstPageSingle),t.lastPageSingle!==void 0&&(r.lastPageSingle=t.lastPageSingle),t.singlePageMode!==void 0&&(r.singlePageMode=t.singlePageMode))}async function ve(){if(!(!r.manga||!r.chapter||r.manga.id==="gallery"||r.isStreamingMode)&&!Z.isDemo)try{await f.updateChapterSettings(r.manga.id,r.chapter.number,{mode:r.mode,direction:r.direction,firstPageSingle:r.firstPageSingle,lastPageSingle:r.lastPageSingle,singlePageMode:r.singlePageMode})}catch(t){console.error("Failed to save settings:",t)}}async function _s(t){try{const e=await f.getBookmark(t),s=e.downloadedChapters||[],a=new Set(e.readChapters||[]),n=e.readingProgress||{},o=e.downloadedVersions||{},i=[...s].sort((l,u)=>l-u);let c=null;for(const l of i){const u=n[l];if(u&&u.page<u.totalPages&&!a.has(l)){c=l;break}}if(c===null){for(const l of i)if(!a.has(l)){c=l;break}}if(c===null&&i.length>0&&(c=i[0]),c!==null){const l=o[c]||[],u=Array.isArray(l)?l[0]:l,h=u?`?version=${encodeURIComponent(u)}`:"";R.go(`/read/${t}/${c}${h}`)}else d("No downloaded chapters to read","info")}catch(e){d("Failed to continue reading: "+e.message,"error")}}const fn={mount:mn,unmount:gn,render:Ee,continueReading:_s},qe=50;let v={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1,offlineChapters:new Set,isAutoOffline:!1,volumesCollapsed:!1};const Bs=t=>`volumes_collapsed_${t}`;function vn(t){var s;const e=localStorage.getItem(Bs(t==null?void 0:t.id));return e!==null?e==="1":(((s=t==null?void 0:t.volumes)==null?void 0:s.length)||0)>8}function yn(t){if(!(t.autoCheck===!0))return`<button class="btn btn-secondary" id="schedule-btn">${p("alarm-clock")} Schedule</button>`;const s=t.checkSchedule==="weekly"?`${(t.checkDay||"monday").charAt(0).toUpperCase()+(t.checkDay||"monday").slice(1)} ${t.checkTime||"06:00"}`:t.checkSchedule==="daily"?`Daily ${t.checkTime||"06:00"}`:"Every 6h";return`<button class="btn btn-primary" id="schedule-btn">${p("alarm-clock")} ${s}</button>`}function bn(t){const e=t.autoCheck===!0,s=t.checkSchedule||"daily",a=t.checkDay||"monday",n=t.checkTime||"06:00",o=t.autoDownload||!1;return`
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
  `}function Ct(){var I;if(v.loading)return`
      ${te()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=v.manga;if(!t)return`
      ${te()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.chapters||[],a=new Set(t.downloadedChapters||[]),n=new Set(t.readChapters||[]),o=new Set(s.map(w=>w.number)).size,i=new Set(t.excludedChapters||[]),c=new Set(t.deletedChapterUrls||[]),l=t.volumes||[],u=new Set;l.forEach(w=>{(w.chapters||[]).forEach(L=>u.add(L))});let h;v.filter==="hidden"?h=s.filter(w=>i.has(w.number)||c.has(w.url)):h=s.filter(w=>!i.has(w.number)&&!c.has(w.url));const y=h.filter(w=>!u.has(w.number));let b=[];if(v.activeVolume){const w=new Set(v.activeVolume.chapters||[]);b=h.filter(L=>w.has(L.number))}else b=y;const x=new Map;b.forEach(w=>{x.has(w.number)||x.set(w.number,[]),x.get(w.number).push(w)});let E=Array.from(x.entries()).sort((w,L)=>w[0]-L[0]);v.filter==="downloaded"?E=E.filter(([w])=>a.has(w)):v.filter==="not-downloaded"?E=E.filter(([w])=>!a.has(w)):v.filter==="main"?E=E.filter(([w])=>Number.isInteger(w)):v.filter==="extra"&&(E=E.filter(([w])=>!Number.isInteger(w)));const g=Math.max(1,Math.ceil(E.length/qe));v.currentPage>=g&&(v.currentPage=Math.max(0,g-1));const S=v.currentPage*qe,M=[...E.slice(S,S+qe)].reverse(),F=x.size,q=[...x.keys()].filter(w=>a.has(w)).length;n.size;let C="";if(v.activeVolume){const w=v.activeVolume;let L=null;w.local_cover?L=`/api/public/covers/${t.id}/${encodeURIComponent(w.local_cover.split(/[/\\]/).pop())}`:w.cover&&(L=w.cover),C=`
      ${te()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${L?`<img src="${L}" alt="${w.name}">`:ie("book")}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${t.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${w.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${F} Chapters</span>
                ${q>0?`<span class="meta-item downloaded">${q} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${t.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${v.manageChapters?"Done Managing":`${p("plus")} Add Chapters`}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${w.id}">${p("pencil")} Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const w=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover;C=`
        ${te()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${w?`<img src="${w}" alt="${e}">`:ie("book")}
              </div>
              <div class="manga-detail-info">
                <h1>${e}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${t.website||"Local"}</span>
                  <span class="meta-item" title="${o} distinct chapters across ${((I=t.chapters)==null?void 0:I.length)||0} version rows">${o} Chapters</span>
                  ${a.size>0?`<span class="meta-item downloaded">${a.size} Downloaded</span>`:""}
                  ${n.size>0?`<span class="meta-item">${n.size} Read</span>`:""}
                </div>
                ${(t.artists||[]).length>0||(t.categories||[]).length>0?`
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(t.artists||[]).length>0?`
                    <span class="meta-label">Author:</span>
                    ${t.artists.map(L=>`<a href="#//" class="artist-link" data-artist="${L}">${L}</a>`).join(", ")}
                  `:""}
                  ${(t.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(t.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${t.categories.map(L=>`<span class="tag">${L}</span>`).join("")}
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
              ${yn(t)}
            </div>
            ${t.description?`<p class="manga-description">${t.description}</p>`:""}
            ${v.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">${p("package")} CBZ Files (${v.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${v.cbzFiles.map(L=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${L.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${L.chapterNumber?`Chapter ${L.chapterNumber}`:"Unknown chapter"}
                        ${L.isExtracted?` | ${p("check")} Extracted`:""}
                      </div>
                    </div>
                    <button class="btn btn-small ${L.isExtracted?"btn-secondary":"btn-primary"}" 
                            data-cbz-path="${encodeURIComponent(L.path)}" 
                            data-cbz-chapter="${L.chapterNumber||1}"
                            data-cbz-extracted="${L.isExtracted}">
                      ${L.isExtracted?"Re-Extract":"Extract"}
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
        
        ${v.activeVolume?v.manageChapters?Cn(t,y):"":xn(t,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${v.filter==="all"?"active":""}" data-filter="all">
                All (${x.size})
              </button>
              <button class="filter-btn ${v.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${q})
              </button>
              <button class="filter-btn ${v.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${v.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${g>1?Xt(g):""}
          
          <div class="chapter-list">
            ${M.map(([w,L])=>En(w,L,a,n,t)).join("")}
          </div>
          
          ${g>1?Xt(g):""}
        </div>
      ${$n()}
    </div>
  `}function wn(){const t=v.manga;if(!t)return"";const e=t.alias||t.title;return`
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
  `}function kn(){const t=v.manga;return t?`
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
  `:""}function $n(){var e,s;const t=v.manga;return`
    ${t?bn(t):""}
    ${Un()}
    ${wn()}
    ${kn()}

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
  `}function En(t,e,s,a,n){var q,C,I,w;const o=s.has(t),i=a.has(t),c=!Number.isInteger(t),l=((q=n.downloadedVersions)==null?void 0:q[t])||[],u=new Set(n.deletedChapterUrls||[]),h=e.filter(L=>v.filter==="hidden"?!0:!u.has(L.url)),y=!!v.activeVolume,b=n.chapterSettings||{},x=y?!0:!!((C=b[t])!=null&&C.locked);let E=h;if(y||x){const L=h.filter(m=>Array.isArray(l)?l.includes(m.url):l===m.url);E=L.length>0?L:h}E.sort((L,m)=>{const $=Array.isArray(l)?l.includes(L.url):l===L.url;return((Array.isArray(l)?l.includes(m.url):l===m.url)?1:0)-($?1:0)});const g=E.length>1,S=(I=E[0])!=null&&I.url?encodeURIComponent(E[0].url):null,_=["chapter-item",o?"downloaded":"",i?"read":"",c?"extra":""].filter(Boolean).join(" "),M=g?`
    <div class="versions-dropdown hidden" id="versions-${t}">
      ${E.map(L=>{const m=encodeURIComponent(L.url),$=Array.isArray(l)?l.includes(L.url):l===L.url,B=L.url.startsWith("local://");return`
          <div class="version-row ${$?"downloaded":""}"
               data-version-url="${m}" data-num="${t}">
            <span class="version-title" style="cursor: pointer; flex: 1;">${L.title||L.releaseGroup||"Version"}${B?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}</span>
            <div class="version-actions">
              ${$?`<button class="btn-icon small success" data-action="read-version" data-num="${t}" data-url="${m}">${p("play",{title:"Read"})}</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${t}" data-url="${m}">${p("trash-2",{title:"Delete version"})}</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${t}" data-url="${m}">${p("download",{title:"Download"})}</button>`}
              ${u.has(L.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${t}" data-url="${m}" title="Restore Version">${p("undo-2",{title:"Restore version"})}</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${t}" data-url="${m}" title="Hide Version">${p("eye-off",{title:"Hide version"})}</button>`}
            </div>
          </div>
        `}).join("")}
    </div>
  `:"",F=(n.excludedChapters||[]).includes(t);return`
    <div class="chapter-group" data-chapter="${t}">
      <div class="${_}" data-num="${t}" style="${F?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${t}</span>
        <span class="chapter-title">
          ${E[0]?E[0].title!==`Chapter ${t}`?E[0].title:"":e[0].title}
          ${F?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
        </span>
        ${c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${F?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${t}" title="Restore Chapter">${p("undo-2",{title:"Restore chapter"})}</button>`:y?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${v.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${t}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${x?"locked":""}"
                        data-action="lock" data-num="${t}"
                        title="${x?"Unlock":"Lock"}">
                  ${x?p("lock",{title:"Locked"}):p("lock-open",{title:"Unlocked"})}
                </button>`}
          ${!F&&S?u.has((w=E[0])==null?void 0:w.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${t}" data-url="${S}" title="Unhide Chapter">${p("undo-2",{title:"Unhide chapter"})}</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${t}" data-url="${S}" title="Hide Chapter">${p("eye-off",{title:"Hide chapter"})}</button>`:""}
          <button class="btn-icon small ${i?"success":"muted"}"
                  data-action="read" data-num="${t}"
                  title="${i?"Mark unread":"Mark read"}">
            ${i?p("eye",{title:"Read"}):p("circle",{title:"Unread"})}
          </button>
          ${o?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${t}" data-url="${S}" title="Delete Files">${p("trash-2",{title:"Delete files"})}</button>
         <button class="btn-icon small ${v.offlineChapters.has(t)?"success":""}" data-action="offline-save" data-num="${t}" title="${v.offlineChapters.has(t)?"Remove offline copy":"Save for offline reading"}">
           ${v.offlineChapters.has(t)?p("wifi-off",{title:"Available offline"}):p("hard-drive",{title:"Save offline"})}
         </button>`:`<button class="btn-icon small ${o?"success":""}"
              data-action="download" data-num="${t}"
              title="${o?"Downloaded":"Download"}">
          ${o?p("check",{title:"Downloaded"}):p("download",{title:"Download"})}
        </button>`}
          ${g?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${t}">
              ${h.length} ${p("chevron-down")}
            </button>
          `:""}
        </div>
      </div>
      ${M}
    </div>
  `}function Xt(t){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${v.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${v.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${v.currentPage+1} of ${t}</span>
      <button class="btn btn-icon" data-page="next" ${v.currentPage>=t-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${v.currentPage>=t-1?"disabled":""}>»</button>
    </div>
  `}function Cn(t,e){return e.length===0?`
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
  `}function xn(t,e){var i;const s=t.volumes||[];if(s.length===0)return"";const a=s.map(c=>{const l=c.chapters||[],u=l.filter(h=>e.has(h)).length;return`
      <div class="volume-card" data-volume-id="${c.id}">
        <div class="volume-cover">
          ${c.cover?`<img src="${c.cover}" alt="${c.name}">`:ie("book")}
          <div class="volume-badges">
            <span class="badge badge-chapters">${l.length} ch</span>
            ${u>0?`<span class="badge badge-downloaded">${u}</span>`:""}
          </div>
        </div>
        <div class="volume-info">
          <div class="volume-name">${c.name}</div>
        </div>
      </div>
    `}).join(""),n=v.volumesCollapsed,o=s.reduce((c,l)=>c+(l.chapters||[]).filter(u=>e.has(u)).length,0);return`
    <div class="volumes-section${n?" collapsed":""}">
      <div class="volumes-header">
        <button class="volumes-toggle" id="volumes-toggle-btn"
                aria-expanded="${!n}" aria-controls="volumes-grid"
                title="${n?"Expand volumes":"Collapse volumes"}">
          ${p(n?"chevron-down":"chevron-up")}
          <h2>Volumes</h2>
          <span class="volumes-count">${s.length}</span>
          ${n&&o>0?`<span class="badge badge-downloaded">${o} downloaded</span>`:""}
        </button>
        <button class="btn btn-secondary btn-small" id="add-volume-btn">${p("plus")} Add Volume</button>
      </div>
      <div class="volumes-grid" id="volumes-grid">
        ${a||(((i=t.chapters)==null?void 0:i.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function Sn(){var a,n,o,i,c,l,u,h,y,b,x,E,g,S,_,M,F,q,C,I,w,L;const t=document.getElementById("app"),e=v.manga;if(!e)return;(a=document.getElementById("back-btn"))==null||a.addEventListener("click",()=>R.go("/")),(n=document.getElementById("back-library-btn"))==null||n.addEventListener("click",()=>R.go("/")),t.querySelectorAll(".artist-link").forEach(m=>{m.addEventListener("click",async $=>{$.preventDefault();const B=m.dataset.artist;if(!B)return;localStorage.setItem("library_search",B),localStorage.removeItem("library_artist_filter");let A=null;try{const T=e.website;if(T&&T!=="Local"){const z=(window._scrapersList||(window._scrapersList=(await f.get("/scrapers/list")).scrapers)||[]).find(P=>P.name===T);z&&z.supportsBrowse&&(A=T)}}catch{}A?(localStorage.setItem("library_search_author",B),localStorage.setItem("library_search_author_source",A)):(localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source")),R.go("/")})}),(o=document.getElementById("continue-btn"))==null||o.addEventListener("click",()=>{_s(e.id)}),(i=document.getElementById("download-all-btn"))==null||i.addEventListener("click",()=>{const m=document.getElementById("download-all-modal");m&&m.classList.add("open")}),(c=document.getElementById("confirm-download-all-btn"))==null||c.addEventListener("click",async()=>{var m;try{d("Queueing downloads...","info");const $=document.getElementsByName("download-version-mode");let B="single";for(const T of $)T.checked&&(B=T.value);(m=document.getElementById("download-all-modal"))==null||m.classList.remove("open");const A=await f.post(`/bookmarks/${e.id}/download`,{all:!0,versionMode:B});A.chaptersCount>0?d(`Download queued: ${A.chaptersCount} versions`,"success"):d("Already have these chapters downloaded","info")}catch($){d("Failed to download: "+$.message,"error")}}),(l=document.getElementById("check-updates-btn"))==null||l.addEventListener("click",async()=>{try{d("Checking for updates...","info"),await f.post(`/bookmarks/${e.id}/quick-check`),d("Check complete!","success")}catch(m){d("Check failed: "+m.message,"error")}}),(u=document.getElementById("schedule-btn"))==null||u.addEventListener("click",()=>{const m=document.getElementById("schedule-modal");m&&m.classList.add("open")}),(h=document.getElementById("schedule-type"))==null||h.addEventListener("change",m=>{const $=document.getElementById("schedule-day-group");$&&($.style.display=m.target.value==="weekly"?"":"none")}),(y=document.getElementById("save-schedule-btn"))==null||y.addEventListener("click",async()=>{var m;try{const $=document.getElementById("schedule-type").value,B=document.getElementById("schedule-day").value,A=document.getElementById("schedule-time").value,T=document.getElementById("auto-download-toggle").checked;await f.updateAutoCheckSchedule(e.id,{enabled:!0,schedule:$,day:B,time:A,autoDownload:T}),v.manga.checkSchedule=$,v.manga.checkDay=B,v.manga.checkTime=A,v.manga.autoDownload=T,(m=document.getElementById("schedule-modal"))==null||m.classList.remove("open"),H([e.id]),d("Schedule updated","success")}catch($){d("Failed to save schedule: "+$.message,"error")}}),(b=document.getElementById("disable-schedule-btn"))==null||b.addEventListener("click",async()=>{var m;try{await f.toggleAutoCheck(e.id,!1),v.manga.autoCheck=!1,v.manga.checkSchedule=null,v.manga.checkDay=null,v.manga.checkTime=null,v.manga.nextCheck=null,(m=document.getElementById("schedule-modal"))==null||m.classList.remove("open"),H([e.id]),d("Auto-check disabled","success")}catch($){d("Failed to disable: "+$.message,"error")}}),(x=document.getElementById("refresh-btn"))==null||x.addEventListener("click",async()=>{const m=document.getElementById("refresh-btn");try{m.disabled=!0,m.innerHTML=`${p("loader",{spin:!0})} Checking...`,d("Checking for updates...","info"),await f.post(`/bookmarks/${e.id}/check`),await G(e.id),H([e.id]),d("Check complete!","success")}catch($){d("Check failed: "+$.message,"error"),m&&(m.disabled=!1,m.innerHTML=`${p("refresh-cw")} Refresh`)}}),(E=document.getElementById("scan-folder-btn"))==null||E.addEventListener("click",async()=>{var $,B;const m=document.getElementById("scan-folder-btn");try{m.disabled=!0,m.innerHTML=`${p("loader",{spin:!0})} Scanning...`,d("Scanning folder...","info");const A=await f.scanBookmark(e.id);await G(e.id),H([e.id]);const T=(($=A.addedChapters)==null?void 0:$.length)||0,O=((B=A.removedChapters)==null?void 0:B.length)||0;T>0||O>0?d(`Scan complete: ${T} added, ${O} removed`,"success"):d("Scan complete: No changes","info")}catch(A){d("Scan failed: "+A.message,"error")}finally{m&&(m.disabled=!1,m.innerHTML=`${p("folder")} Scan Folder`)}}),document.querySelectorAll("[data-cbz-path]").forEach(m=>{m.addEventListener("click",async()=>{const $=decodeURIComponent(m.dataset.cbzPath),B=parseInt(m.dataset.cbzChapter)||1,A=m.dataset.cbzExtracted==="true",T=prompt("Enter chapter number for extraction:",String(B));if(!T)return;const O=parseFloat(T);if(isNaN(O)){d("Invalid chapter number","error");return}try{m.disabled=!0,m.textContent="Extracting...",d("Extracting CBZ...","info"),await f.extractCbz(e.id,$,O,{forceReExtract:A}),d("CBZ extracted successfully!","success"),await G(e.id),H([e.id])}catch(z){d("Extract failed: "+z.message,"error")}finally{m.disabled=!1,m.textContent=A?"Re-Extract":"Extract"}})}),(g=document.getElementById("edit-btn"))==null||g.addEventListener("click",async()=>{const m=document.getElementById("edit-manga-modal");if(m){document.getElementById("edit-alias-input").value=e.alias||"",window._selectedCoverPath=null;try{const[$,B]=await Promise.all([f.getAllArtists(),f.getAllCategories()]),A=document.getElementById("artist-list"),T=document.getElementById("category-list");window._allArtists=$,window._allCategories=B,A&&(A.innerHTML=$.map(P=>`<option value="${P}">`).join("")),T&&(T.innerHTML=B.map(P=>`<option value="${P}">`).join(""));const O=document.getElementById("edit-artist-input"),z=document.getElementById("edit-categories-input");O==null||O.addEventListener("input",()=>{const P=O.value.toLowerCase(),D=O.value.lastIndexOf(","),j=O.value.substring(D+1).trim().toLowerCase();if(j.length>0&&window._allArtists){const V=window._allArtists.filter(X=>X.toLowerCase().includes(j));if(A&&V.length>0){const X=D>=0?O.value.substring(0,D+1)+" ":"";A.innerHTML=V.map(we=>`<option value="${X}${we}">`).join("")}}}),z==null||z.addEventListener("input",()=>{const P=z.value.lastIndexOf(","),D=z.value.substring(P+1).trim().toLowerCase();if(D.length>0&&window._allCategories){const j=window._allCategories.filter(V=>V.toLowerCase().includes(D));if(T&&j.length>0){const V=P>=0?z.value.substring(0,P+1)+" ":"";T.innerHTML=j.map(X=>`<option value="${V}${X}">`).join("")}}})}catch($){console.error("Failed to load artists/categories:",$)}m.classList.add("open")}}),(S=document.getElementById("save-manga-btn"))==null||S.addEventListener("click",async()=>{var m;try{const $=document.getElementById("edit-alias-input").value.trim(),B=document.getElementById("edit-artist-input").value.trim(),A=document.getElementById("edit-categories-input").value.trim(),T=B?B.split(",").map(z=>z.trim()).filter(z=>z):[],O=A?A.split(",").map(z=>z.trim()).filter(z=>z):[];await f.updateBookmark(e.id,{alias:$||null}),await f.setBookmarkArtists(e.id,T),await f.setBookmarkCategories(e.id,O),window._selectedCoverPath&&await f.setBookmarkCoverFromImage(e.id,window._selectedCoverPath),v.manga.alias=$||null,v.manga.artists=T,v.manga.categories=O,(m=document.getElementById("edit-manga-modal"))==null||m.classList.remove("open"),H([e.id]),d("Manga updated","success")}catch($){d("Failed to update: "+$.message,"error")}}),(_=document.getElementById("change-cover-btn"))==null||_.addEventListener("click",async()=>{try{d("Loading images...","info");const m=await f.getFolderImages(e.id);if(m.length===0){d("No images found in manga folder","warning");return}const $=document.createElement("div");$.id="cover-select-modal",$.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",$.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${m.slice(0,50).map(B=>`
              <div class="cover-option" data-path="${B.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(B.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${m.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${m.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild($),document.getElementById("close-cover-modal").addEventListener("click",()=>$.remove()),$.addEventListener("click",B=>{B.target===$&&$.remove()}),$.querySelectorAll(".cover-option").forEach(B=>{B.addEventListener("click",()=>{window._selectedCoverPath=B.dataset.path;const A=document.getElementById("cover-preview");A&&(A.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),$.remove(),d("Cover selected","success")})})}catch(m){d("Failed to load images: "+m.message,"error")}}),(M=document.getElementById("delete-manga-btn"))==null||M.addEventListener("click",()=>{const m=document.getElementById("delete-manga-modal");m&&m.classList.add("open")}),(F=document.getElementById("confirm-delete-manga-btn"))==null||F.addEventListener("click",async()=>{var $,B;const m=(($=document.getElementById("delete-files-toggle"))==null?void 0:$.checked)||!1;try{await f.deleteBookmark(e.id,m),(B=document.getElementById("delete-manga-modal"))==null||B.classList.remove("open"),d("Manga deleted","success"),R.go("/")}catch(A){d("Failed to delete: "+A.message,"error")}}),(q=document.getElementById("quick-check-btn"))==null||q.addEventListener("click",async()=>{const m=document.getElementById("quick-check-btn");try{m.disabled=!0,m.innerHTML=`${p("loader",{spin:!0})} Checking...`,d("Quick checking for updates...","info");const $=await f.post(`/bookmarks/${e.id}/quick-check`);await G(e.id),H([e.id]),$.newChaptersCount>0?d(`Found ${$.newChaptersCount} new chapter(s)!`,"success"):d("No new chapters found","info")}catch($){d("Quick check failed: "+$.message,"error")}finally{m&&(m.disabled=!1,m.innerHTML=`${p("zap")} Quick Check`)}}),(C=document.getElementById("source-label"))==null||C.addEventListener("click",async()=>{const m=document.getElementById("migrate-source-modal");if(m){m.classList.add("open");const $=document.getElementById("migrate-search-scraper");if($&&$.options.length<=1)try{const B=await f.get("/scrapers/list");if(B.success){const A=B.scrapers.filter(T=>T.supportsSearch);$.innerHTML='<option value="all">All Sources</option>'+A.map(T=>`<option value="${T.name}">${T.name}</option>`).join(""),$.value="all"}}catch(B){console.warn("Failed to load scrapers:",B)}}});const s=async()=>{var O,z,P;const m=(z=(O=document.getElementById("migrate-search-input"))==null?void 0:O.value)==null?void 0:z.trim(),$=(P=document.getElementById("migrate-search-scraper"))==null?void 0:P.value;if(!m)return;const B=document.getElementById("migrate-search-loading"),A=document.getElementById("migrate-search-results"),T=document.getElementById("migrate-results-grid");B.style.display="block",A.style.display="none";try{const j=(await f.get(`/scrapers/search?q=${encodeURIComponent(m)}&scraper=${encodeURIComponent($)}`)).results||[];j.length===0?T.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(T.innerHTML=j.map(V=>{var we;const X=(we=V.cover)!=null&&we.startsWith("/covers/")?V.cover:V.cover?`/api/scrapers/proxy-cover?url=${encodeURIComponent(V.cover)}`:"";return`
            <div class="manga-card migrate-result-card" data-url="${V.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${X?be(X,"Cover",{kind:"series",self:!0}):ie("series")}
                ${V.chapterCount?`<div class="manga-card-badges"><span class="badge badge-chapters">${V.chapterCount} ch</span></div>`:""}
              </div>
              <div class="manga-card-title" title="${V.title}" style="font-size: 0.8rem; padding: 4px;">${V.title}</div>
            </div>
          `}).join(""),T.querySelectorAll(".migrate-result-card").forEach(V=>{V.addEventListener("click",()=>{var we;const X=V.dataset.url;document.getElementById("migrate-url-input").value=X,T.querySelectorAll(".migrate-result-card").forEach(Ps=>Ps.style.outline=""),V.style.outline="2px solid var(--color-primary)",d(`Selected: ${(we=V.querySelector(".manga-card-title"))==null?void 0:we.textContent}`,"info")})})),B.style.display="none",A.style.display="block"}catch(D){B.style.display="none",d("Search failed: "+D.message,"error")}};(I=document.getElementById("migrate-search-btn"))==null||I.addEventListener("click",s),(w=document.getElementById("migrate-search-input"))==null||w.addEventListener("keydown",m=>{m.key==="Enter"&&s()}),(L=document.getElementById("confirm-migrate-btn"))==null||L.addEventListener("click",async()=>{var B,A,T;const m=(A=(B=document.getElementById("migrate-url-input"))==null?void 0:B.value)==null?void 0:A.trim();if(!m){d("Please enter a URL","warning");return}const $=document.getElementById("confirm-migrate-btn");try{$.disabled=!0,$.textContent="Migrating...",d("Migrating source...","info");const O=await f.migrateSource(e.id,m);d(`Migrated! ${O.migratedChapters} chapters preserved as local`,"success"),d("Running full check on new source...","info"),await f.post(`/bookmarks/${e.id}/check`),(T=document.getElementById("migrate-source-modal"))==null||T.classList.remove("open"),await G(e.id),H([e.id]),d("Source migration complete!","success")}catch(O){d("Migration failed: "+O.message,"error")}finally{$&&($.disabled=!1,$.textContent="Migrate Source")}}),t.querySelectorAll(".filter-btn").forEach(m=>{m.addEventListener("click",()=>{v.filter=m.dataset.filter,v.currentPage=0,H([e.id])})}),t.querySelectorAll("[data-page]").forEach(m=>{m.addEventListener("click",()=>{const $=m.dataset.page,B=Math.ceil(v.manga.chapters.length/qe);switch($){case"first":v.currentPage=0;break;case"prev":v.currentPage=Math.max(0,v.currentPage-1);break;case"next":v.currentPage=Math.min(B-1,v.currentPage+1);break;case"last":v.currentPage=B-1;break}H([e.id])})}),t.querySelectorAll(".chapter-item").forEach(m=>{m.addEventListener("click",$=>{var T;if($.target.closest(".chapter-actions"))return;const B=parseFloat(m.dataset.num);if((e.downloadedChapters||[]).includes(B)){const O=((T=e.downloadedVersions)==null?void 0:T[B])||[],z=Array.isArray(O)?O[0]:O;z?R.go(`/read/${e.id}/${B}?version=${encodeURIComponent(z)}`):R.go(`/read/${e.id}/${B}`)}else d("Chapter not downloaded","info")})}),t.querySelectorAll("[data-action]").forEach(m=>{m.addEventListener("click",async $=>{$.stopPropagation();const B=m.dataset.action,A=parseFloat(m.dataset.num),T=m.dataset.url?decodeURIComponent(m.dataset.url):null;switch(B){case"lock":await In(A);break;case"read":await Ln(A);break;case"download":await _n(A);break;case"versions":Bn(A);break;case"read-version":R.go(`/read/${e.id}/${A}?version=${encodeURIComponent(T)}`);break;case"download-version":await An(A,T);break;case"delete-version":await Mn(A,T);break;case"hide-version":await Pn(A,T);break;case"restore-version":await Tn(A,T);break;case"restore-chapter":await Rn(A);break;case"delete-chapter":await qn(A,T);break;case"hide-chapter":await Dn(A,T);break;case"unhide-chapter":await Nn(A,T);break}})}),t.querySelectorAll(".version-row .version-title").forEach(m=>{m.addEventListener("click",$=>{$.stopPropagation();const B=m.closest(".version-row"),A=parseFloat(B.dataset.num),T=B.dataset.versionUrl?decodeURIComponent(B.dataset.versionUrl):null;B.classList.contains("downloaded")&&T?R.go(`/read/${e.id}/${A}?version=${encodeURIComponent(T)}`):d("Version not downloaded yet","info")})}),t.querySelectorAll(".volume-card").forEach(m=>{m.addEventListener("click",()=>{const $=m.dataset.volumeId;R.go(`/manga/${e.id}/volume/${$}`)})}),Vn(t),fe(),oe.subscribeToManga(e.id)}async function In(t){var n;const e=v.manga,s=((n=e.chapterSettings)==null?void 0:n[t])||{},a=!s.locked;try{a?await f.lockChapter(e.id,t):await f.unlockChapter(e.id,t),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[t]={...s,locked:a},d(a?"Chapter locked":"Chapter unlocked","success"),H([e.id])}catch(o){d("Failed: "+o.message,"error")}}async function Ln(t){const e=v.manga,s=new Set(e.readChapters||[]),a=s.has(t);try{await f.post(`/bookmarks/${e.id}/chapters/${t}/read`,{read:!a}),a?s.delete(t):s.add(t),e.readChapters=[...s],d(a?"Marked unread":"Marked read","success"),H([e.id])}catch(n){d("Failed: "+n.message,"error")}}async function _n(t){const e=v.manga,s=new Set(e.deletedChapterUrls||[]),a=(e.chapters||[]).find(n=>n.number===t&&!s.has(n.url));try{d(`Downloading chapter ${t}...`,"info"),a?await f.post(`/bookmarks/${e.id}/download-version`,{chapterNumber:t,url:a.url}):await f.post(`/bookmarks/${e.id}/download`,{chapters:[t]}),d("Download queued!","success")}catch(n){d("Failed: "+n.message,"error")}}function Bn(t){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${t}`&&s.classList.add("hidden")});const e=document.getElementById(`versions-${t}`);e&&e.classList.toggle("hidden")}async function An(t,e){const s=v.manga;try{d("Downloading version...","info"),await f.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:t,url:e}),d("Download queued!","success")}catch(a){d("Failed: "+a.message,"error")}}async function Mn(t,e){const s=v.manga;try{await f.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),d("Version deleted","success"),await G(s.id),H([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function Pn(t,e){const s=v.manga;try{await f.hideVersion(s.id,t,e),d("Version hidden","success"),await G(s.id),H([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function Tn(t,e){const s=v.manga;try{await f.unhideVersion(s.id,t,e),d("Version restored","success"),await G(s.id),H([s.id])}catch(a){d("Failed to restore version: "+a.message,"error")}}async function Rn(t){const e=v.manga;try{await f.unexcludeChapter(e.id,t),d("Chapter restored","success"),await G(e.id),H([e.id])}catch(s){d("Failed to restore chapter: "+s.message,"error")}}async function qn(t,e){const s=v.manga;if(confirm("Delete this chapter's files from disk?"))try{await f.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),d("Chapter files deleted","success"),await G(s.id),H([s.id])}catch(a){d("Failed to delete: "+a.message,"error")}}async function Dn(t,e){const s=v.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await f.hideVersion(s.id,t,e),d("Chapter hidden","success"),await G(s.id),H([s.id])}catch(a){d("Failed to hide chapter: "+a.message,"error")}}async function Nn(t,e){const s=v.manga;try{await f.unhideVersion(s.id,t,e),d("Chapter unhidden","success"),await G(s.id),H([s.id])}catch(a){d("Failed to unhide chapter: "+a.message,"error")}}async function G(t){try{const[e,s]=await Promise.all([f.getBookmark(t),Z.isDemo?Promise.resolve([]):ae.loadCategories()]);if(v.manga=e,v.categories=s,v.loading=!1,v.volumesCollapsed=vn(e),e.website==="Local")try{const o=await f.getCbzFiles(t);v.cbzFiles=o||[]}catch(o){console.error("Failed to load CBZ files:",o),v.cbzFiles=[]}else v.cbzFiles=[];const a=new Set((e.chapters||[]).map(o=>o.number)).size,n=Math.ceil(a/qe);v.currentPage=Math.max(0,n-1),v.activeVolumeId?v.activeVolume=(e.volumes||[]).find(o=>o.id===v.activeVolumeId):v.activeVolume=null}catch{d("Failed to load manga","error"),v.loading=!1}}async function H(t=[]){const[e,s,a]=t;if(!e){R.go("/");return}v.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!v.manga||v.manga.id!==e?(v.loading=!0,v.manga=null,n.innerHTML=Ct(),await G(e)):v.activeVolumeId?v.activeVolume=(v.manga.volumes||[]).find(o=>o.id===v.activeVolumeId):v.activeVolume=null,n.innerHTML=Ct(),Sn()}function Fn(){v.manga&&oe.unsubscribeFromManga(v.manga.id),v.manga=null,v.loading=!0}const On={mount:H,unmount:Fn,render:Ct};function Un(){return`
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
  `}function Vn(t){const e=v.manga;if(!e)return;const s=t.querySelector("#volumes-toggle-btn");s&&s.addEventListener("click",()=>{v.volumesCollapsed=!v.volumesCollapsed,localStorage.setItem(Bs(e.id),v.volumesCollapsed?"1":"0");const g=t.querySelector(".volumes-section");g==null||g.classList.toggle("collapsed",v.volumesCollapsed),s.setAttribute("aria-expanded",String(!v.volumesCollapsed)),s.title=v.volumesCollapsed?"Expand volumes":"Collapse volumes";const S=s.querySelector("svg");S&&(S.outerHTML=p(v.volumesCollapsed?"chevron-down":"chevron-up"))});const a=t.querySelector("#add-volume-btn"),n=t.querySelector("#add-volume-modal"),o=t.querySelector("#add-volume-submit-btn");a&&n&&a.addEventListener("click",()=>{n.classList.add("open"),t.querySelector("#add-volume-name-input").focus()}),n==null||n.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(g=>{g.addEventListener("click",()=>n.classList.remove("open"))}),o&&o.addEventListener("click",async()=>{const g=t.querySelector("#add-volume-name-input").value.trim();if(!g)return d("Please enter a volume name","error");try{o.disabled=!0,o.textContent="Creating...",await f.createVolume(e.id,g),d("Volume created successfully!","success"),n.classList.remove("open"),t.querySelector("#add-volume-name-input").value="",await G(e.id),H([e.id])}catch(S){d("Failed to create volume: "+S.message,"error")}finally{o.disabled=!1,o.textContent="Create Volume"}});const i=t.querySelector("#manage-chapters-btn");i&&i.addEventListener("click",()=>{v.manageChapters=!v.manageChapters,H([e.id,"volume",v.activeVolumeId])}),t.querySelectorAll(".add-to-vol-btn").forEach(g=>{g.addEventListener("click",async()=>{const S=parseFloat(g.dataset.num),_=v.activeVolume;if(_)try{g.disabled=!0,g.textContent="...";const M=_.chapters||[];if(M.includes(S))return;const F=[...M,S].sort((q,C)=>q-C);await f.updateVolumeChapters(e.id,_.id,F),d(`Chapter ${S} added to volume`,"success"),await G(e.id),H([e.id,"volume",_.id])}catch(M){d("Failed to add chapter: "+M.message,"error"),g.disabled=!1,g.textContent="Add"}})}),t.querySelectorAll(".remove-from-vol-btn").forEach(g=>{g.addEventListener("click",async S=>{S.stopPropagation();const _=parseFloat(g.dataset.num),M=v.activeVolume;if(M)try{g.disabled=!0,g.textContent="...";const q=(M.chapters||[]).filter(C=>C!==_);await f.updateVolumeChapters(e.id,M.id,q),d(`Chapter ${_} removed from volume`,"success"),await G(e.id),H([e.id,"volume",M.id])}catch(F){d("Failed to remove chapter: "+F.message,"error"),g.disabled=!1,g.textContent="×"}})});const c=t.querySelector("#edit-vol-btn"),l=t.querySelector("#edit-volume-modal");c&&l&&c.addEventListener("click",()=>{const g=c.dataset.volId,S=e.volumes.find(_=>_.id===g);S&&(t.querySelector("#volume-name-input").value=S.name,l.dataset.editingVolId=g,l.classList.add("open"))});const u=t.querySelector("#save-volume-btn");u&&u.addEventListener("click",async()=>{const g=l.dataset.editingVolId,S=t.querySelector("#volume-name-input").value.trim();if(!S)return d("Volume name cannot be empty","error");try{await f.renameVolume(e.id,g,S),d("Volume renamed","success"),l.classList.remove("open"),await G(e.id),H([e.id,"volume",g])}catch(_){d(_.message,"error")}});const h=t.querySelector("#delete-volume-btn");h&&h.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const g=l.dataset.editingVolId;try{await f.deleteVolume(e.id,g),d("Volume deleted","success"),l.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch(S){d(S.message,"error")}});const y=t.querySelector("#vol-cover-upload-btn");if(y){let g=document.getElementById("vol-cover-input-hidden");g||(g=document.createElement("input"),g.type="file",g.id="vol-cover-input-hidden",g.accept="image/*",g.style.display="none",document.body.appendChild(g),g.addEventListener("change",async S=>{const _=S.target.files[0];if(!_)return;const M=g.dataset.mangaId,F=g.dataset.volId,q=document.getElementById("vol-cover-upload-btn");if(g.value="",!(!M||!F))try{q&&(q.disabled=!0,q.textContent="Uploading..."),await f.uploadVolumeCover(M,F,_),d("Cover uploaded","success"),await G(M),H([M,"volume",F])}catch(C){d("Upload failed: "+C.message,"error")}finally{q&&(q.disabled=!1,q.innerHTML=`${p("upload")} Upload Image`)}})),y.addEventListener("click",()=>{g.dataset.mangaId=e.id,g.dataset.volId=l.dataset.editingVolId||"",g.click()})}const b=t.querySelector("#vol-cover-selector-btn"),x=t.querySelector("#cover-selector-modal");b&&x&&b.addEventListener("click",async()=>{const g=x.querySelector("#cover-chapter-select");g.innerHTML='<option value="">Select a chapter...</option>';const S=t.querySelector("#edit-volume-modal"),_=S?S.dataset.editingVolId:null;let M=[...e.chapters||[]];if(_){const q=e.volumes.find(C=>C.id===_);if(q&&q.chapters){const C=new Set(q.chapters);M=M.filter(I=>C.has(I.number))}}M.sort((q,C)=>q.number-C.number);const F=new Set;M.forEach(q=>{if(!F.has(q.number)){F.add(q.number);const C=document.createElement("option");C.value=q.number,C.textContent=`Chapter ${q.number}`,g.appendChild(C)}}),M.length>0&&(g.value=M[0].number,Zt(e.id,M[0].number)),x.classList.add("open")});const E=t.querySelector("#cover-chapter-select");E&&E.addEventListener("change",g=>{g.target.value&&Zt(e.id,g.target.value)}),t.querySelectorAll(".modal-close, .modal-close-btn").forEach(g=>{g.addEventListener("click",()=>{g.closest(".modal").classList.remove("open")})}),t.querySelectorAll(".modal-overlay").forEach(g=>{g.addEventListener("click",()=>{g.closest(".modal").classList.remove("open")})})}async function Zt(t,e){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await f.getChapterImages(t,e)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(o=>{const i=document.createElement("div");i.className="cover-grid-item",i.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",i.innerHTML=`<img src="${o}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,i.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=o.split("/").pop();Hn(l,e,c)}),s.appendChild(i)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function Hn(t,e,s){const a=v.manga,n=document.getElementById("edit-volume-modal"),o=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const i=n.dataset.editingVolId;if(!i)throw new Error("No volume selected");await f.setVolumeCoverFromChapter(a.id,i,e,t),d("Volume cover updated","success"),o.classList.remove("open"),n.classList.remove("open"),await G(a.id),H([a.id,"volume",i])}else{await f.setMangaCoverFromChapter(a.id,e,t),d("Series cover updated","success"),o.classList.remove("open"),await G(a.id);const i=window.location.hash.replace("#","");v.activeVolumeId?H([a.id,"volume",v.activeVolumeId]):H([a.id])}}catch(i){d("Failed to set cover: "+i.message,"error")}}let le={series:null,loading:!0};function Le(){if(le.loading)return`
      ${te("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=le.series;if(!t)return`
      ${te("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.entries||[],a=s.reduce((o,i)=>o+(i.chapter_count||0),0);let n=null;if(s.length>0){const o=s[0];o.local_cover&&o.bookmark_id?n=`/api/public/covers/${o.bookmark_id}/${encodeURIComponent(o.local_cover.split(/[/\\]/).pop())}`:o.localCover&&o.bookmark_id?n=`/api/public/covers/${o.bookmark_id}/${encodeURIComponent(o.localCover.split(/[/\\]/).pop())}`:o.cover&&(n=o.cover)}return`
    ${te("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?be(n,e,{kind:"series"}):ie("series")}
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
            ${s.map((o,i)=>zn(o,i,s.length)).join("")}
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
  `}function zn(t,e,s){var o;const a=t.alias||t.title;let n=null;return t.local_cover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.local_cover.split(/[/\\]/).pop())}`:t.localCover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(n=t.cover),`
    <div class="series-entry-card" data-id="${t.bookmark_id}" data-order="${t.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${e+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${t.bookmark_id}" ${e===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${t.bookmark_id}" ${e===s-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?be(n,a,{kind:"book"}):ie("book")}
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${t.chapter_count||0} ch</span>
          ${((o=t.downloadedChapters)==null?void 0:o.length)>0?`<span class="badge badge-downloaded">${t.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${t.bookmark_id}" data-entryid="${t.id}" title="Use as series cover">${p("image",{title:"Use as series cover"})}</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${a}</div>
      </div>
    </div>
  `}function nt(){var l,u,h;const t=document.getElementById("app"),e=le.series;(l=document.getElementById("back-btn"))==null||l.addEventListener("click",()=>R.go("/")),(u=document.getElementById("back-library-btn"))==null||u.addEventListener("click",()=>R.go("/")),t.querySelectorAll(".series-entry-card").forEach(y=>{y.addEventListener("click",b=>{if(b.target.closest("[data-action]"))return;const x=y.dataset.id;R.go(`/manga/${x}`)})}),t.querySelectorAll("[data-action]").forEach(y=>{y.addEventListener("click",async b=>{b.stopPropagation();const x=y.dataset.action,E=y.dataset.id;switch(x){case"move-up":await es(E,-1);break;case"move-down":await es(E,1);break;case"set-cover":const g=y.dataset.entryid;await jn(g);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),o=document.getElementById("available-bookmarks-list"),i=document.getElementById("confirm-add-entry-btn");let c=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),o&&(o.innerHTML=""),a.classList.add("open");const y=await f.getAvailableBookmarksForSeries();c=y,y.length===0?(n&&(n.placeholder="No available manga found"),i.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),o&&(o.innerHTML=y.map(b=>`<option value="${(b.alias||b.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),i.disabled=!1)}catch{d("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),i.addEventListener("click",async()=>{const y=n?n.value:"",b=c.find(E=>(E.alias||E.title||"")===y);if(!b){d("Please select a valid manga from the list","warning");return}const x=b.id;try{i.disabled=!0,i.textContent="Adding...",await f.addSeriesEntry(e.id,x),d("Manga added to series","success"),a.classList.remove("open"),await rt(e.id),t.innerHTML=Le(),nt()}catch(E){d("Failed to add manga: "+E.message,"error")}finally{i.disabled=!1,i.textContent="Add to Series"}})),(h=document.getElementById("edit-series-btn"))==null||h.addEventListener("click",()=>{d("Edit series coming soon","info")})}async function es(t,e){const s=le.series;if(!s)return;const a=s.entries||[],n=a.findIndex(c=>c.bookmark_id===t);if(n===-1)return;const o=n+e;if(o<0||o>=a.length)return;const i=a.map(c=>c.bookmark_id);[i[n],i[o]]=[i[o],i[n]];try{await f.post(`/series/${s.id}/reorder`,{order:i}),d("Order updated","success"),await rt(s.id);const c=document.getElementById("app");c.innerHTML=Le(),nt()}catch(c){d("Failed to reorder: "+c.message,"error")}}async function jn(t){const e=le.series;if(e)try{await f.setSeriesCover(e.id,t),d("Series cover updated","success"),await rt(e.id);const s=document.getElementById("app");s.innerHTML=Le(),nt()}catch(s){d("Failed to set cover: "+s.message,"error")}}async function rt(t){try{const e=await f.get(`/series/${t}`);le.series=e,le.loading=!1}catch{d("Failed to load series","error"),le.loading=!1}}async function Qn(t=[]){const[e]=t;if(!e){R.go("/");return}const s=document.getElementById("app");le.loading=!0,le.series=null,s.innerHTML=Le(),await rt(e),s.innerHTML=Le(),nt()}function Wn(){le.series=null,le.loading=!0}const Gn={mount:Qn,unmount:Wn,render:Le},Kn={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
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
        `;try{const s=await f.get("/settings")||{},a=document.getElementById("settings-form"),n=document.getElementById("settings-loader");s.theme&&(document.getElementById("theme").value=s.theme),n.style.display="none",a.style.display="block",a.addEventListener("submit",async o=>{o.preventDefault();const i=new FormData(a),c={};for(const[l,u]of i.entries())c[l]=u;try{await f.post("/settings/bulk",c),d("Settings saved successfully"),c.theme}catch(l){console.error(l),d("Failed to save settings","error")}})}catch(s){console.error(s),document.getElementById("settings-loader").textContent="Error loading settings"}}},Yn={mount:async t=>{const e=document.getElementById("app");if(!Z.isAdmin){e.innerHTML=`
                ${te()}
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
        `,document.querySelectorAll(".admin-tab").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(a=>a.classList.remove("active")),s.classList.add("active"),document.querySelectorAll(".admin-section").forEach(a=>a.style.display="none"),document.getElementById(`admin-section-${s.dataset.section}`).style.display=""})}),await Promise.all([Ke(),Jn(),Xn()])}};async function Ke(){const t=document.getElementById("admin-section-users");try{const e=await f.listUsers();t.innerHTML=`
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
                                <td>${xt(s.username)}${s.id===((a=Z.user)==null?void 0:a.id)?' <span class="badge">you</span>':""}</td>
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
        `,t.querySelectorAll("tr[data-user-id]").forEach(s=>{const a=Number(s.dataset.userId),n=async()=>{try{await f.updateUser(a,{role:s.querySelector(".user-role").value,canDownload:s.querySelector(".user-can-download").checked,canEdit:s.querySelector(".user-can-edit").checked}),d("User updated","success")}catch(o){d(o.message,"error"),Ke()}};s.querySelector(".user-role").addEventListener("change",n),s.querySelector(".user-can-download").addEventListener("change",n),s.querySelector(".user-can-edit").addEventListener("change",n),s.querySelector(".user-reset-pw").addEventListener("click",async()=>{const o=prompt("New password for this user:");if(o)try{await f.updateUser(a,{password:o}),d("Password reset","success")}catch(i){d(i.message,"error")}}),s.querySelector(".user-delete").addEventListener("click",async()=>{if(confirm("Delete this user?"))try{await f.deleteUser(a),d("User deleted","success"),Ke()}catch(o){d(o.message,"error")}})}),document.getElementById("add-user-form").addEventListener("submit",async s=>{s.preventDefault();try{await f.createUser({username:document.getElementById("new-username").value.trim(),password:document.getElementById("new-password").value,role:document.getElementById("new-role").value,canDownload:document.getElementById("new-can-download").checked,canEdit:document.getElementById("new-can-edit").checked}),d("User created","success"),Ke()}catch(a){d(a.message,"error")}})}catch(e){console.error(e),t.innerHTML='<div class="error">Failed to load users</div>'}}async function Jn(){const t=document.getElementById("admin-section-demo");try{const e=await f.getBookmarks();t.innerHTML=`
            <h2>Demo Content</h2>
            <p class="admin-demo-warning">
                Checked series are visible to <strong>anyone</strong> on the public demo page
                (<code>/demo.html</code>) — no login needed, covers included. Only downloaded
                chapters are readable there. Be deliberate about adult titles.
            </p>
            <input type="search" id="demo-filter" placeholder="Filter series..." class="admin-demo-filter">
            <ul class="admin-demo-list">
                ${e.map(s=>`
                    <li data-title="${xt((s.alias||s.title||"").toLowerCase())}">
                        <label>
                            <input type="checkbox" class="demo-toggle" data-id="${s.id}" ${s.isDemo?"checked":""}>
                            <span>${xt(s.alias||s.title)}</span>
                            <span class="badge">${s.downloadedCount||0} downloaded</span>
                        </label>
                    </li>
                `).join("")}
            </ul>
        `,t.querySelectorAll(".demo-toggle").forEach(s=>{s.addEventListener("change",async()=>{try{await f.toggleDemo(s.dataset.id,s.checked),d(s.checked?"Added to demo":"Removed from demo","success")}catch(a){s.checked=!s.checked,d(a.message,"error")}})}),document.getElementById("demo-filter").addEventListener("input",s=>{const a=s.target.value.toLowerCase();t.querySelectorAll(".admin-demo-list li").forEach(n=>{n.style.display=n.dataset.title.includes(a)?"":"none"})})}catch(e){console.error(e),t.innerHTML='<div class="error">Failed to load bookmarks</div>'}}function xt(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}async function Xn(){try{const t=await f.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
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
        `,e.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;St(n),e.querySelectorAll(".table-link").forEach(o=>o.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(t){console.error(t),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function St(t,e=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${t}...</div>`;try{const i=await f.get(`/admin/tables/${t}?page=${e}&limit=50`);if(!i.rows||i.rows.length===0){s.innerHTML=`
                <h2>${t}</h2>
                <div class="empty-state">No records found</div>
            `;return}const c=Object.keys(i.rows[0]);s.innerHTML=`
            <div class="table-header">
                <h2>${t}</h2>
                <div class="table-actions">
                    <span class="page-info">
                        Page ${i.pagination.page+1} of ${i.pagination.totalPages} 
                        (${i.pagination.total} records)
                    </span>
                    <div class="pagination">
                        <button ${e===0?"disabled":""} id="prev-page">Previous</button>
                        <button ${!i.pagination.hasMore&&e>=i.pagination.totalPages-1?"disabled":""} id="next-page">Next</button>
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
                                ${c.map(u=>{const h=l[u];let y=h;return h===null?y='<span class="null">NULL</span>':typeof h=="object"?y=JSON.stringify(h):String(h).length>100&&(y=String(h).substring(0,100)+"..."),`<td>${y}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>St(t,e-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>St(t,e+1))}catch(o){console.error(o),s.innerHTML=`<div class="error">Failed to load data for ${t}</div>`}}let Y={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function Zn(t,e){let s=null;if(e.length>0){const n=e[0];if(n.imagePaths&&n.imagePaths.length>0){const o=n.imagePaths[0];let i;typeof o=="string"?i=o:o&&typeof o=="object"&&(i=o.filename||o.path||o.name||o.url,i&&i.includes("/")&&(i=i.split("/").pop()),i&&i.includes("\\")&&(i=i.split("\\").pop())),i&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(i)}`)}}const a=e.reduce((n,o)=>{var i;return n+(((i=o.imagePaths)==null?void 0:i.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${t}">
      <div class="manga-card-cover">
        ${s?be(s,t,{kind:"folder"}):ie("folder")}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function er(t){const e=Y.bookmarks.find(s=>s.id===t);return e?e.alias||e.title:t}function tr(t){const e=Y.bookmarks.find(s=>s.id===t);if(e&&e.seriesId){const s=Y.series.find(a=>a.id===e.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function sr(t,e,s,a=!1){return`
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
  `}function ar(){const t={};console.log("Building trophy groups from:",Y.trophyPages);for(const e of Object.keys(Y.trophyPages)){const s=Y.trophyPages[e];let a=0;for(const[o,i]of Object.entries(s))a+=Object.keys(i).length;if(console.log(`Manga ${e}: ${a} trophies`),a===0)continue;const n=tr(e);if(n)t[n.id]||(t[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),t[n.id].count+=a,t[n.id].mangaIds.push(e);else{const o=er(e);console.log(`No series for ${e}, using name: ${o}`),t[e]={name:o,isSeries:!1,count:a,mangaIds:[e]}}}return console.log("Trophy groups result:",t),t}function tt(){if(Y.loading)return`
      ${te("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:t,listOrder:e}=Y.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${Y.activeTab==="galleries"?"active":""}" data-tab="galleries">
        ${p("folder")} Galleries
      </button>
      <button class="tab-btn ${Y.activeTab==="trophies"?"active":""}" data-tab="trophies">
        ${p("trophy")} Trophies
      </button>
    </div>
  `;let a="";if(Y.activeTab==="galleries")e.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${e.map(o=>{const i=t&&t[o]||[];return Zn(o,i)}).join("")}
        </div>
      `;else{const n=ar(),o=Object.keys(n);o.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${o.map(c=>{const l=n[c];return sr(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${te("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function As(){fe();const t=document.getElementById("app");t.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{Y.activeTab=s.dataset.tab,t.innerHTML=tt(),As()})}),t.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;R.go(`/read/gallery/${encodeURIComponent(a)}`)})}),t.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?R.go(`/read/trophies/series-${a}/🏆`):R.go(`/read/trophies/${a}/🏆`)})})}async function nr(){try{const[t,e,s,a]=await Promise.all([ae.loadFavorites(),f.get("/trophy-pages"),ae.loadBookmarks(),ae.loadSeries()]);Y.favorites=t||{favorites:{},listOrder:[]},Y.trophyPages=e||{},Y.bookmarks=s||[],Y.series=a||[],Y.loading=!1}catch(t){console.error("Failed to load favorites:",t),d("Failed to load favorites","error"),Y.loading=!1}}async function rr(){console.log("[Favorites] mount called"),Y.loading=!0;const t=document.getElementById("app");t.innerHTML=tt(),await nr(),console.log("[Favorites] Data loaded, rendering..."),t.innerHTML=tt(),console.log("[Favorites] Calling setupListeners..."),As(),console.log("[Favorites] setupListeners complete")}function or(){}const ir={mount:rr,unmount:or,render:tt};let U={downloads:{},queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,showEmptyChecks:!1,collapsed:{active:!1,scheduled:!1,completed:!1,history:!0}},Ye=null,se={};function Nt(t){if(!t)return"Never";const e=Date.now()-new Date(t).getTime(),s=Math.floor(e/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function lr(t){if(!t)return"Not scheduled";const e=new Date(t).getTime()-Date.now();if(e<=0)return"Running now...";const s=Math.floor(e/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const o=Math.floor(a/24),i=a%24;return`in ${o}d ${i}h`}function Ms(t){switch(t){case"download":return p("download");case"scrape":return p("search");case"scan":return p("folder");default:return p("settings")}}function Ft(t){switch(t){case"running":return"var(--color-success)";case"queued":case"pending":return"var(--color-warning)";case"paused":return"var(--color-info)";case"complete":return"var(--color-success)";case"error":case"failed":case"cancelled":return"var(--color-error)";default:return"var(--text-secondary)"}}function Ot(t){switch(t){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return t}}function cr(t){return!t||t==="default"?"Default (6h)":t==="daily"?"Daily":t==="weekly"?"Weekly":t}function dr(){const t=U.autoCheck;return t?`
    <div class="queue-inline-header">
      <span class="text-muted">${t.enabledCount} monitored · Last: ${Nt(t.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">${p("play")} Run All Now</button>
    </div>
  `:""}function ur(t){const e=t.nextCheck?lr(t.nextCheck):"Not set",s=t.nextCheck&&new Date(t.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${t.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${p("book-open")}</span>
          <div>
            <div class="task-title">${t.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${cr(t.schedule)}${t.schedule==="weekly"&&t.day?` · ${t.day.charAt(0).toUpperCase()+t.day.slice(1)}`:""}${(t.schedule==="daily"||t.schedule==="weekly")&&t.time?` · ${t.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?`${p("alarm-clock")} Due now`:e}</span>
        </div>
      </div>
    </div>
  `}function ts(t,e){const s=e.total>0?Math.round(e.completed/e.total*100):0,a=e.status==="running"||e.status==="queued",n=e.status==="paused";return`
    <div class="queue-card task-card" data-task-id="${t}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${p("download")}</span>
          <div>
            <div class="task-title">${e.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${Ft(e.status)}">${Ot(e.status)}</div>
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
  `}function pr(t){const e=t.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Ms(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${Ft(t.status)}">${Ot(t.status)}</div>
          </div>
        </div>
      </div>
      ${t.started_at?`<div class="queue-card-body"><small>Started: ${Nt(t.started_at)}</small></div>`:""}
    </div>
  `}function hr(t){const e=t.data||{},s=t.result||{};let a="";return t.type==="scrape"?s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${t.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>'):(t.type==="scan"||t.type==="scan-local")&&s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`),`
    <div class="queue-card task-card history-card" data-history-id="${t.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Ms(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${Ft(t.status)}">${Ot(t.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${t.completed_at?`<div class="queue-card-body"><small>Completed: ${Nt(t.completed_at)}</small></div>`:""}
    </div>
  `}function mr(){var c;const t=Object.entries(U.downloads),e=t.filter(([,l])=>l.status!=="complete"),s=t.filter(([,l])=>l.status==="complete"),a=new Set(e.map(([,l])=>l.bookmarkId).filter(Boolean)),n=U.queueTasks.filter(l=>{var u;return!(l.type==="download"&&((u=l.data)!=null&&u.mangaId)&&a.has(l.data.mangaId))}),o=e.length+n.length,i=((c=U.autoCheck)==null?void 0:c.schedules)||[];return`
    ${te("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>${p("list-checks")} Task Queue</h2>
        ${o>0?`<span class="queue-badge">${o} active</span>`:""}
      </div>

      ${e.length>0||n.length>0?`
        <div class="queue-section ${U.collapsed.active?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${e.map(([l,u])=>ts(l,u)).join("")}
            ${n.map(l=>pr(l)).join("")}
          </div>
        </div>
      `:""}

      ${i.length>0?`
        <div class="queue-section ${U.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${i.length})
            </h3>
            ${dr()}
          </div>
          <div class="queue-section-content">
            ${i.map(l=>ur(l)).join("")}
          </div>
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section ${U.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${s.map(([l,u])=>ts(l,u)).join("")}
          </div>
        </div>
      `:""}

      ${U.historyTasks&&U.historyTasks.length>0?(()=>{const l=y=>{if(y.type!=="scrape")return!1;const b=y.result||{};return(y.status==="complete"||y.status==="completed")&&(b.newChaptersCount===0||b.updated===!1)},u=U.historyTasks.filter(l).length,h=U.showEmptyChecks?U.historyTasks:U.historyTasks.filter(y=>!l(y));return`
        <div class="queue-section ${U.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${u>0?`
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${U.showEmptyChecks?"Hide":"Show"} checks with no new chapters">
                    ${U.showEmptyChecks?`${p("chevron-up")} Hide`:`${p("chevron-down")} Show`} empty checks (${u})
                  </button>
                `:""}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  ${p("trash-2")} Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${h.length>0?h.map(y=>hr(y)).join(""):`
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${u>0?`${u} empty check(s) hidden.`:""}</p>
                  </div>
                `}
            </div>
        </div>
      `})():""}

      ${e.length===0&&n.length===0&&s.length===0&&i.length===0&&(!U.historyTasks||U.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">${p("check")}</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function $e(){try{const[t,e,s,a]=await Promise.all([f.getDownloads().catch(()=>({})),f.getQueueTasks().catch(()=>[]),f.getQueueHistory(50).catch(()=>[]),f.getAutoCheckStatus().catch(()=>null)]);U.downloads=t||{},U.queueTasks=e||[],U.historyTasks=s||[],U.autoCheck=a,U.loading=!1}catch(t){console.error("[Queue] Failed to load data:",t),U.loading=!1}}function ue(){const t=document.getElementById("app");t&&(t.innerHTML=mr(),gr())}function gr(){fe(),document.querySelectorAll("[data-toggle]").forEach(a=>{a.addEventListener("click",n=>{const o=a.dataset.toggle;U.collapsed[o]=!U.collapsed[o],ue()})});const t=document.getElementById("run-autocheck-btn");t&&t.addEventListener("click",async()=>{t.disabled=!0,t.innerHTML=`${p("loader",{spin:!0})} Running...`;try{d("Auto-check started...","info");const a=await f.runAutoCheck();d(`Check complete: ${a.checked} checked, ${a.updated} updated`,"success"),await $e(),ue()}catch(a){d("Auto-check failed: "+a.message,"error"),t.disabled=!1,t.innerHTML=`${p("play")} Run Now`}});const e=document.getElementById("clear-history-btn");e&&e.addEventListener("click",async a=>{if(a.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await f.clearQueueHistory(),d("History cleared","success"),await $e(),ue()}catch(n){d(`Failed to clear history: ${n.message}`,"error")}});const s=document.getElementById("toggle-empty-checks-btn");s&&s.addEventListener("click",a=>{a.stopPropagation(),U.showEmptyChecks=!U.showEmptyChecks,ue()}),document.querySelectorAll(".scheduled-manga-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.mangaId;n&&(window.location.hash=`#/manga/${n}`)})}),document.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const o=a.dataset.action,i=a.dataset.task;try{o==="pause"?(await f.pauseDownload(i),d("Download paused","info")):o==="resume"?(await f.resumeDownload(i),d("Download resumed","info")):o==="cancel"&&confirm("Cancel this download?")&&(await f.cancelDownload(i),d("Download cancelled","info")),await $e(),ue()}catch(c){d(`Action failed: ${c.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.historyId,o=document.getElementById(`task-details-${n}`);o&&o.classList.toggle("hidden")})})}async function fr(){U.loading=!0;const t=document.getElementById("app");t.innerHTML=`
    ${te("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>${p("list-checks")} Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,fe(),await $e(),ue(),Ye=setInterval(async()=>{await $e(),ue()},5e3),se.downloadProgress=e=>{e.taskId&&U.downloads[e.taskId]&&(Object.assign(U.downloads[e.taskId],e),ue())},se.downloadCompleted=e=>{$e().then(ue)},se.queueUpdated=e=>{$e().then(ue)},oe.on(pe.DOWNLOAD_PROGRESS,se.downloadProgress),oe.on(pe.DOWNLOAD_COMPLETED,se.downloadCompleted),oe.on(pe.QUEUE_UPDATED,se.queueUpdated)}function vr(){Ye&&(clearInterval(Ye),Ye=null),se.downloadProgress&&oe.off(pe.DOWNLOAD_PROGRESS,se.downloadProgress),se.downloadCompleted&&oe.off(pe.DOWNLOAD_COMPLETED,se.downloadCompleted),se.queueUpdated&&oe.off(pe.QUEUE_UPDATED,se.queueUpdated),se={}}const yr={mount:fr,unmount:vr};class br{constructor(){this.container=null,this.scrapers=[],this.currentQuery="",this.currentTarget="all",this.isSearching=!1,this.results=[],this.viewMode="main",this.browseScraper=null,this.browseQuery="english",this.browseSort="popular-today",this.browsePage=1,this.browseTotalPages=1,this.isBrowsing=!1,this.browseResults=[],this.previewInfo=null,this.previewImages=[],this.previewIndex=0,this.infoAbortController=null}async mount(e){this.container=document.getElementById("app"),document.body.className="scrapers-mode";const s=new URLSearchParams(window.location.hash.split("?")[1]||""),a=s.get("browse"),n=s.get("q");a&&(this.browseScraper=a,this.viewMode="browse",this.browseQuery=n||this.browseQuery,this.browseSort="popular",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1),this.updateView(),await this.loadScrapers(),this.viewMode==="browse"&&this.browseScraper?this.performBrowse():n&&(this.currentQuery=n,this.updateView(),this.performSearch())}unmount(){this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.container.innerHTML="",document.body.className=""}async loadScrapers(){try{const e=await f.get("/scrapers/list");e.success&&(this.scrapers=e.scrapers,this.updateView())}catch(e){console.error("Failed to load scrapers",e)}}updateView(){this.render(),this.renderScraperList(),(this.results.length>0||this.isSearching)&&this.renderResults(),this.bindEvents()}render(){this.container.innerHTML=`
      ${te()}
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
    `,fe()}renderScraperList(){const e=document.getElementById("scraper-cards-list");if(!e)return;if(this.scrapers.length===0){e.innerHTML=`
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
      `);e.innerHTML=a.join("")}getDomainIcon(e){const s=e.toLowerCase();return s.includes("comix")?p("library"):s.includes("mangahere")?p("book-open"):s.includes("nhentai")?p("shield-alert"):s.includes("chained")?p("link"):p("globe")}bindEvents(){const e=document.getElementById("scraper-search-form");e&&e.addEventListener("submit",b=>{b.preventDefault();const x=document.getElementById("scraper-query");x&&x.value.trim()&&(this.currentQuery=x.value.trim(),this.performSearch())});const s=document.getElementById("clear-target-btn");s&&s.addEventListener("click",()=>{this.currentTarget="all",this.updateView();const b=document.getElementById("scraper-query");b&&b.focus()}),document.querySelectorAll(".scraper-search-card-btn").forEach(b=>{b.addEventListener("click",x=>{const E=x.target.dataset.scraper;this.currentTarget=E;const g=document.getElementById("scraper-query");g&&(this.currentQuery=g.value.trim()),this.updateView();const S=document.getElementById("scraper-query");S&&(S.focus(),window.scrollTo({top:0,behavior:"smooth"}),this.currentQuery&&this.performSearch())})}),document.querySelectorAll(".scraper-browse-card-btn").forEach(b=>{b.addEventListener("click",x=>{const E=x.target.dataset.scraper;this.browseScraper=E,this.viewMode="browse",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1,this.updateView(),this.performBrowse()})});const a=document.getElementById("exit-browse-btn");a&&a.addEventListener("click",()=>{this.viewMode="main",this.updateView()});const n=document.getElementById("browse-apply-btn");n&&n.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse()});const o=document.getElementById("browse-refresh-btn");o&&o.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse(!1,!0)});const i=document.getElementById("browse-query");i&&i.addEventListener("keypress",b=>{b.key==="Enter"&&n.click()});const c=document.getElementById("browse-load-more-btn");c&&c.addEventListener("click",()=>{!this.isBrowsing&&this.browsePage<this.browseTotalPages&&(this.browsePage++,this.performBrowse(!0))});const l=document.getElementById("preview-close-btn");l&&l.addEventListener("click",()=>{this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),document.getElementById("preview-info-modal").style.display="none"});const u=document.getElementById("preview-add-btn");u&&u.addEventListener("click",()=>{this.previewInfo&&this.previewInfo.url&&this.openAddModal(this.previewInfo.url,u)});const h=document.getElementById("preview-read-btn");h&&h.addEventListener("click",()=>{h.disabled||(this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.openTempReader())});const y=document.getElementById("temp-reader-close");y&&y.addEventListener("click",()=>{document.getElementById("temp-reader-overlay").style.display="none"})}async performSearch(){const e=document.getElementById("scraper-results-container"),s=document.getElementById("scraper-search-btn");if(!e||!s)return;this.isSearching=!0,e.style.display="block",s.textContent="Searching...",s.disabled=!0;const a=this.currentTarget==="all"?"all sites":this.currentTarget;e.innerHTML=`
      <div class="loading-state" style="margin-top: 2rem;">
        <div class="spinner"></div>
        <p>Searching ${a} for "${this.currentQuery}"...</p>
        <p class="subtitle">This may take a minute...</p>
      </div>
    `;try{const n=await f.get(`/scrapers/search?q=${encodeURIComponent(this.currentQuery)}&scraper=${encodeURIComponent(this.currentTarget)}`);if(n.success)this.results=n.results||[],this.renderResults();else throw new Error(n.error||"Failed to search scrapers")}catch(n){console.error("Search error",n),e.innerHTML=`<div class="error-state" style="margin-top: 2rem;">Failed to perform search: ${n.message}</div>`}finally{this.isSearching=!1,s.textContent="Search",s.disabled=!1}}renderResults(){const e=document.getElementById("scraper-results-container");if(!e)return;if(this.results.length===0){e.innerHTML=`
        <div class="empty-state" style="margin-top: 2rem;">
          <div class="empty-icon">${p("search-x")}</div>
          <p>No results found for "${this.currentQuery}".</p>
        </div>
      `;return}let s='<div class="library-grid" style="margin-top: 2rem;">';this.results.forEach(a=>{const n=a.cover||"";let o="";n.startsWith("/covers/")?o=n:n&&(o=`/api/scrapers/proxy-cover?url=${encodeURIComponent(n)}`);const i=o?be(o,"Cover",{kind:"series",self:!0}):ie("series");s+=`
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
      `}),s+="</div>",e.innerHTML=s,setTimeout(()=>{document.querySelectorAll(".scraper-result-card").forEach(a=>{a.addEventListener("click",n=>{n.target.closest(".add-from-search-btn")||window.open(a.dataset.url,"_blank")})}),document.querySelectorAll(".add-from-search-btn").forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation();const o=n.target.dataset.url;this.openAddModal(o,n.target)})})},100)}async _addToLibraryAndWait(e){const s=await f.addBookmark(e);if(!s.jobId)throw new Error("No job ID returned");return new Promise((a,n)=>{const o=setInterval(async()=>{try{const c=(await f.getQueueHistory(20)).find(l=>l.id===s.jobId);c&&(c.status==="completed"?(clearInterval(o),c.result&&c.result.bookmark?a(c.result.bookmark):n(new Error("Job completed but returned no bookmark"))):c.status==="failed"&&(clearInterval(o),n(new Error(c.error))))}catch{}},1e3)})}async openAddModal(e,s){const a=s?s.textContent:"+ Add to Library";s&&(s.textContent="Adding...");try{const n=await this._addToLibraryAndWait(e);document.getElementById("preview-info-modal").style.display="none",window.location.hash=`#/manga/${n.id}`}catch(n){alert("Error adding manga: "+n.message)}finally{s&&(s.textContent=a)}}async performBrowse(e=!1,s=!1){const a=document.getElementById("browse-results-container"),n=document.getElementById("browse-load-more-btn"),o=document.getElementById("browse-loading-indicator"),i=document.getElementById("browse-pagination");if(a){this.isBrowsing=!0,e?(n.style.display="none",o.style.display="block",document.getElementById("browse-loading-page").textContent=this.browsePage):(a.innerHTML=`
        <div class="loading-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="spinner"></div>
          <p>Browsing ${this.browseScraper}...</p>
        </div>
      `,i.style.display="none");try{let c=`/scrapers/browse?scraper=${encodeURIComponent(this.browseScraper)}&q=${encodeURIComponent(this.browseQuery)}&sort=${encodeURIComponent(this.browseSort)}&page=${this.browsePage}`;s&&(c+="&refresh=true");const l=await f.get(c);if(l.success)e?this.browseResults=[...this.browseResults,...l.results||[]]:this.browseResults=l.results||[],this.browseTotalPages=l.totalPages||1,this.renderBrowseResults(e);else throw new Error(l.error||"Failed to browse")}catch(c){console.error("Browse error",c),e?alert("Failed to load more results: "+c.message):a.innerHTML=`<div class="error-state" style="grid-column: 1/-1; margin-top: 2rem;">Failed to load browse results: ${c.message}</div>`}finally{this.isBrowsing=!1,e&&(n.style.display="inline-block",o.style.display="none")}}}renderBrowseResults(e){const s=document.getElementById("browse-results-container"),a=document.getElementById("browse-pagination");if(this.browseResults.length===0){s.innerHTML=`
        <div class="empty-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="empty-icon">${p("search-x")}</div>
          <p>No results found.</p>
        </div>
      `,a.style.display="none";return}let n="";this.browseResults.forEach((o,i)=>{const c=o.cover||"";let l="";c.startsWith("/covers/")?l=c:c&&(l=`/api/scrapers/proxy-cover?url=${encodeURIComponent(c)}`);const u=l?be(l,"Cover",{kind:"series",self:!0}):ie("series");n+=`
        <div class="manga-card browse-result-card" data-index="${i}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${u}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${o.website||this.browseScraper}</span>
            </div>
          </div>
          <div class="manga-card-title" title="${o.title}">${o.title}</div>
        </div>
      `}),s.innerHTML=n,this.browsePage<this.browseTotalPages?a.style.display="block":a.style.display="none",setTimeout(()=>{document.querySelectorAll(".browse-result-card").forEach(o=>{o.addEventListener("click",()=>{const i=parseInt(o.dataset.index),c=this.browseResults[i];c&&this.openInfoModal(c)})})},100)}async openInfoModal(e){this.infoAbortController&&this.infoAbortController.abort(),this.infoAbortController=new AbortController;const s=this.infoAbortController.signal,a=document.getElementById("preview-info-modal"),n=document.getElementById("preview-info-body"),o=document.getElementById("preview-read-btn");this.previewInfo=e,a.style.display="flex",n.innerHTML=`
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
         <div style="flex: 0 0 200px; max-width: 100%;">
            <div class="manga-card-cover" style="height: 280px; border-radius: 8px;">
               ${e.cover?`<img src="${e.cover.startsWith("/covers/")?e.cover:"/api/scrapers/proxy-cover?url="+encodeURIComponent(e.cover)}" style="width: 100%; height: 100%; object-fit: cover;">`:ie("series")}
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
    `,this._setReadBtnEnabled(o,!1);try{const i=await f.get(`/scrapers/info?url=${encodeURIComponent(e.url)}`,{signal:s});if(i.success&&i.info){this.previewInfo={...this.previewInfo,...i.info};let c="";i.info.tags&&i.info.tags.length>0&&(c=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Tags</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${i.info.tags.map(u=>`<span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); font-weight: normal; font-size: 0.75rem;">${u}</span>`).join("")}
                 </div>
               </div>
             `);let l="";i.info.artists&&i.info.artists.length>0&&(l=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Artists</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${i.info.artists.map(u=>`<span class="badge badge-chapters">${u}</span>`).join("")}
                 </div>
               </div>
             `),document.getElementById("preview-extended-info").innerHTML=`
             <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; background: var(--bg-color); padding: 1rem; border-radius: 8px;">
               <div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Pages / Ch</div>
                  <div style="font-weight: bold;">${i.info.pageCount||i.info.totalChapters||"?"}</div>
               </div>
               ${i.info.displayId?`
                 <div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Gallery ID</div>
                    <div style="font-weight: bold;">${i.info.displayId}</div>
                 </div>
               `:""}
             </div>
             ${l}
             ${c}
          `,this._setReadBtnEnabled(o,!0)}else document.getElementById("preview-extended-info").innerHTML='<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>',(this.previewInfo.galleryId||this.previewInfo.url)&&this._setReadBtnEnabled(o,!0)}catch(i){if(i.name==="AbortError"||s.aborted){console.log("Scraper details fetch aborted successfully.");return}console.error("Info error:",i),document.getElementById("preview-extended-info").innerHTML=`<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${i.message}</p>`,this._setReadBtnEnabled(o,!0)}}_setReadBtnEnabled(e,s){e&&(e.disabled=!s,e.style.opacity=s?"1":"0.5",e.style.cursor=s?"pointer":"not-allowed",e.style.pointerEvents=s?"auto":"none")}async openTempReader(){if(!this.previewInfo||!this.previewInfo.url&&!this.previewInfo.galleryId)return;const e=this.previewInfo.url||`https://nhentai.net/g/${this.previewInfo.galleryId}/`,s=this.browseScraper||this.previewInfo.website;sessionStorage.setItem("streamPreviewUrl",e),sessionStorage.setItem("streamPreviewTitle",this.previewInfo.title||"Preview"),s?sessionStorage.setItem("streamPreviewScraper",s):sessionStorage.removeItem("streamPreviewScraper"),document.getElementById("preview-info-modal").style.display="none",window.location.hash="#/read/stream/preview"}}const wr=new br;class kr{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,s){this.routes.set(e,s)}async navigate(){console.log("[Router] navigate called");const s=(window.location.hash.slice(1)||"/").split("?")[0],[a,...n]=s.split("/").filter(Boolean),o=`/${a||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let i=this.routes.get(o);!i&&this.routes.has("/")&&(i=this.routes.get("/")),i&&(this.currentRoute=o,this.currentView=i,i.mount&&(console.log("[Router] calling mount on view module"),await i.mount(n)),fe())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),fe())}}const R=new kr;R.register("/",Wa);R.register("/manga",On);R.register("/read",fn);R.register("/series",Gn);R.register("/settings",Kn);R.register("/admin",Yn);R.register("/favorites",ir);R.register("/queue",yr);R.register("/scrapers",wr);export{pe as S,oe as a,R as r,Cr as s};
