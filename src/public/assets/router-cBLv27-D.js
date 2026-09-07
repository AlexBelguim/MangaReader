import{a as g}from"./api-B0UJ7-_t.js";const Ae=Object.create(null);Ae.open="0";Ae.close="1";Ae.ping="2";Ae.pong="3";Ae.message="4";Ae.upgrade="5";Ae.noop="6";const mt=Object.create(null);Object.keys(Ae).forEach(e=>{mt[Ae[e]]=e});const Qt={type:"error",data:"parser error"},aa=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",na=typeof ArrayBuffer=="function",ra=e=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(e):e&&e.buffer instanceof ArrayBuffer,vs=({type:e,data:t},s,a)=>aa&&t instanceof Blob?s?a(t):Ns(t,a):na&&(t instanceof ArrayBuffer||ra(t))?s?a(t):Ns(new Blob([t]),a):a(Ae[e]+(t||"")),Ns=(e,t)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];t("b"+(a||""))},s.readAsDataURL(e)};function Fs(e){return e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}let Ut;function Ja(e,t){if(aa&&e.data instanceof Blob)return e.data.arrayBuffer().then(Fs).then(t);if(na&&(e.data instanceof ArrayBuffer||ra(e.data)))return t(Fs(e.data));vs(e,!1,s=>{Ut||(Ut=new TextEncoder),t(Ut.encode(s))})}const Os="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",et=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let e=0;e<Os.length;e++)et[Os.charCodeAt(e)]=e;const Ya=e=>{let t=e.length*.75,s=e.length,a,n=0,r,i,l,c;e[e.length-1]==="="&&(t--,e[e.length-2]==="="&&t--);const d=new ArrayBuffer(t),u=new Uint8Array(d);for(a=0;a<s;a+=4)r=et[e.charCodeAt(a)],i=et[e.charCodeAt(a+1)],l=et[e.charCodeAt(a+2)],c=et[e.charCodeAt(a+3)],u[n++]=r<<2|i>>4,u[n++]=(i&15)<<4|l>>2,u[n++]=(l&3)<<6|c&63;return d},Xa=typeof ArrayBuffer=="function",ys=(e,t)=>{if(typeof e!="string")return{type:"message",data:oa(e,t)};const s=e.charAt(0);return s==="b"?{type:"message",data:Za(e.substring(1),t)}:mt[s]?e.length>1?{type:mt[s],data:e.substring(1)}:{type:mt[s]}:Qt},Za=(e,t)=>{if(Xa){const s=Ya(e);return oa(s,t)}else return{base64:!0,data:e}},oa=(e,t)=>{switch(t){case"blob":return e instanceof Blob?e:new Blob([e]);case"arraybuffer":default:return e instanceof ArrayBuffer?e:e.buffer}},ia="",en=(e,t)=>{const s=e.length,a=new Array(s);let n=0;e.forEach((r,i)=>{vs(r,!1,l=>{a[i]=l,++n===s&&t(a.join(ia))})})},tn=(e,t)=>{const s=e.split(ia),a=[];for(let n=0;n<s.length;n++){const r=ys(s[n],t);if(a.push(r),r.type==="error")break}return a};function sn(){return new TransformStream({transform(e,t){Ja(e,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const r=new DataView(n.buffer);r.setUint8(0,126),r.setUint16(1,a)}else{n=new Uint8Array(9);const r=new DataView(n.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(a))}e.data&&typeof e.data!="string"&&(n[0]|=128),t.enqueue(n),t.enqueue(s)})}})}let Vt;function dt(e){return e.reduce((t,s)=>t+s.length,0)}function ut(e,t){if(e[0].length===t)return e.shift();const s=new Uint8Array(t);let a=0;for(let n=0;n<t;n++)s[n]=e[0][a++],a===e[0].length&&(e.shift(),a=0);return e.length&&a<e[0].length&&(e[0]=e[0].slice(a)),s}function an(e,t){Vt||(Vt=new TextDecoder);const s=[];let a=0,n=-1,r=!1;return new TransformStream({transform(i,l){for(s.push(i);;){if(a===0){if(dt(s)<1)break;const c=ut(s,1);r=(c[0]&128)===128,n=c[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(dt(s)<2)break;const c=ut(s,2);n=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),a=3}else if(a===2){if(dt(s)<8)break;const c=ut(s,8),d=new DataView(c.buffer,c.byteOffset,c.length),u=d.getUint32(0);if(u>Math.pow(2,21)-1){l.enqueue(Qt);break}n=u*Math.pow(2,32)+d.getUint32(4),a=3}else{if(dt(s)<n)break;const c=ut(s,n);l.enqueue(ys(r?c:Vt.decode(c),t)),a=0}if(n===0||n>e){l.enqueue(Qt);break}}}})}const la=4;function ne(e){if(e)return nn(e)}function nn(e){for(var t in ne.prototype)e[t]=ne.prototype[t];return e}ne.prototype.on=ne.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+e]=this._callbacks["$"+e]||[]).push(t),this};ne.prototype.once=function(e,t){function s(){this.off(e,s),t.apply(this,arguments)}return s.fn=t,this.on(e,s),this};ne.prototype.off=ne.prototype.removeListener=ne.prototype.removeAllListeners=ne.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+e];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+e],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===t||a.fn===t){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+e],this};ne.prototype.emit=function(e){this._callbacks=this._callbacks||{};for(var t=new Array(arguments.length-1),s=this._callbacks["$"+e],a=1;a<arguments.length;a++)t[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,t)}return this};ne.prototype.emitReserved=ne.prototype.emit;ne.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks["$"+e]||[]};ne.prototype.hasListeners=function(e){return!!this.listeners(e).length};const Pt=typeof Promise=="function"&&typeof Promise.resolve=="function"?t=>Promise.resolve().then(t):(t,s)=>s(t,0),we=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),rn="arraybuffer";function ca(e,...t){return t.reduce((s,a)=>(e.hasOwnProperty(a)&&(s[a]=e[a]),s),{})}const on=we.setTimeout,ln=we.clearTimeout;function qt(e,t){t.useNativeTimers?(e.setTimeoutFn=on.bind(we),e.clearTimeoutFn=ln.bind(we)):(e.setTimeoutFn=we.setTimeout.bind(we),e.clearTimeoutFn=we.clearTimeout.bind(we))}const cn=1.33;function dn(e){return typeof e=="string"?un(e):Math.ceil((e.byteLength||e.size)*cn)}function un(e){let t=0,s=0;for(let a=0,n=e.length;a<n;a++)t=e.charCodeAt(a),t<128?s+=1:t<2048?s+=2:t<55296||t>=57344?s+=3:(a++,s+=4);return s}function da(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function pn(e){let t="";for(let s in e)e.hasOwnProperty(s)&&(t.length&&(t+="&"),t+=encodeURIComponent(s)+"="+encodeURIComponent(e[s]));return t}function hn(e){let t={},s=e.split("&");for(let a=0,n=s.length;a<n;a++){let r=s[a].split("=");t[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return t}class mn extends Error{constructor(t,s,a){super(t),this.description=s,this.context=a,this.type="TransportError"}}class bs extends ne{constructor(t){super(),this.writable=!1,qt(this,t),this.opts=t,this.query=t.query,this.socket=t.socket,this.supportsBinary=!t.forceBase64}onError(t,s,a){return super.emitReserved("error",new mn(t,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(t){this.readyState==="open"&&this.write(t)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(t){const s=ys(t,this.socket.binaryType);this.onPacket(s)}onPacket(t){super.emitReserved("packet",t)}onClose(t){this.readyState="closed",super.emitReserved("close",t)}pause(t){}createUri(t,s={}){return t+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const t=this.opts.hostname;return t.indexOf(":")===-1?t:"["+t+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(t){const s=pn(t);return s.length?"?"+s:""}}class gn extends bs{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(t){this.readyState="pausing";const s=()=>{this.readyState="paused",t()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(t){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};tn(t,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const t=()=>{this.write([{type:"close"}])};this.readyState==="open"?t():this.once("open",t)}write(t){this.writable=!1,en(t,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const t=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=da()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(t,s)}}let ua=!1;try{ua=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const fn=ua;function vn(){}class yn extends gn{constructor(t){if(super(t),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&t.hostname!==location.hostname||a!==t.port}}doWrite(t,s){const a=this.request({method:"POST",data:t});a.on("success",s),a.on("error",(n,r)=>{this.onError("xhr post error",n,r)})}doPoll(){const t=this.request();t.on("data",this.onData.bind(this)),t.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=t}}class Me extends ne{constructor(t,s,a){super(),this.createRequest=t,qt(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var t;const s=ca(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(t=this._opts.cookieJar)===null||t===void 0||t.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=Me.requestsCount++,Me.requests[this._index]=this)}_onError(t){this.emitReserved("error",t,this._xhr),this._cleanup(!0)}_cleanup(t){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=vn,t)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Me.requests[this._index],this._xhr=null}}_onLoad(){const t=this._xhr.responseText;t!==null&&(this.emitReserved("data",t),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Me.requestsCount=0;Me.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Us);else if(typeof addEventListener=="function"){const e="onpagehide"in we?"pagehide":"unload";addEventListener(e,Us,!1)}}function Us(){for(let e in Me.requests)Me.requests.hasOwnProperty(e)&&Me.requests[e].abort()}const bn=function(){const e=pa({xdomain:!1});return e&&e.responseType!==null}();class wn extends yn{constructor(t){super(t);const s=t&&t.forceBase64;this.supportsBinary=bn&&!s}request(t={}){return Object.assign(t,{xd:this.xd},this.opts),new Me(pa,this.uri(),t)}}function pa(e){const t=e.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!t||fn))return new XMLHttpRequest}catch{}if(!t)try{return new we[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const ha=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class $n extends bs{get name(){return"websocket"}doOpen(){const t=this.uri(),s=this.opts.protocols,a=ha?{}:ca(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(t,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=t=>this.onClose({description:"websocket connection closed",context:t}),this.ws.onmessage=t=>this.onData(t.data),this.ws.onerror=t=>this.onError("websocket error",t)}write(t){this.writable=!1;for(let s=0;s<t.length;s++){const a=t[s],n=s===t.length-1;vs(a,this.supportsBinary,r=>{try{this.doWrite(a,r)}catch{}n&&Pt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const t=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=da()),this.supportsBinary||(s.b64=1),this.createUri(t,s)}}const Ht=we.WebSocket||we.MozWebSocket;class kn extends $n{createSocket(t,s,a){return ha?new Ht(t,s,a):s?new Ht(t,s):new Ht(t)}doWrite(t,s){this.ws.send(s)}}class En extends bs{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(t){return this.emitReserved("error",t)}this._transport.closed.then(()=>{this.onClose()}).catch(t=>{this.onError("webtransport error",t)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(t=>{const s=an(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=t.readable.pipeThrough(s).getReader(),n=sn();n.readable.pipeTo(t.writable),this._writer=n.writable.getWriter();const r=()=>{a.read().then(({done:l,value:c})=>{l||(this.onPacket(c),r())}).catch(l=>{})};r();const i={type:"open"};this.query.sid&&(i.data=`{"sid":"${this.query.sid}"}`),this._writer.write(i).then(()=>this.onOpen())})})}write(t){this.writable=!1;for(let s=0;s<t.length;s++){const a=t[s],n=s===t.length-1;this._writer.write(a).then(()=>{n&&Pt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var t;(t=this._transport)===null||t===void 0||t.close()}}const Sn={websocket:kn,webtransport:En,polling:wn},Cn=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,xn=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Gt(e){if(e.length>8e3)throw"URI too long";const t=e,s=e.indexOf("["),a=e.indexOf("]");s!=-1&&a!=-1&&(e=e.substring(0,s)+e.substring(s,a).replace(/:/g,";")+e.substring(a,e.length));let n=Cn.exec(e||""),r={},i=14;for(;i--;)r[xn[i]]=n[i]||"";return s!=-1&&a!=-1&&(r.source=t,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=Ln(r,r.path),r.queryKey=In(r,r.query),r}function Ln(e,t){const s=/\/{2,9}/g,a=t.replace(s,"/").split("/");return(t.slice(0,1)=="/"||t.length===0)&&a.splice(0,1),t.slice(-1)=="/"&&a.splice(a.length-1,1),a}function In(e,t){const s={};return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,r){n&&(s[n]=r)}),s}const Wt=typeof addEventListener=="function"&&typeof removeEventListener=="function",gt=[];Wt&&addEventListener("offline",()=>{gt.forEach(e=>e())},!1);class De extends ne{constructor(t,s){if(super(),this.binaryType=rn,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,t&&typeof t=="object"&&(s=t,t=null),t){const a=Gt(t);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=Gt(s.host).host);qt(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=hn(this.opts.query)),Wt&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},gt.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(t){const s=Object.assign({},this.opts.query);s.EIO=la,s.transport=t,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[t]);return new this._transportsByName[t](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const t=this.opts.rememberUpgrade&&De.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(t);s.open(),this.setTransport(s)}setTransport(t){this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",De.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",t),this.emitReserved("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=t.data,this._onError(s);break;case"message":this.emitReserved("data",t.data),this.emitReserved("message",t.data);break}}onHandshake(t){this.emitReserved("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this._pingInterval=t.pingInterval,this._pingTimeout=t.pingTimeout,this._maxPayload=t.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const t=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+t,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},t),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const t=this._getWritablePackets();this.transport.send(t),this._prevBufferLen=t.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=dn(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const t=Date.now()>this._pingTimeoutTime;return t&&(this._pingTimeoutTime=0,Pt(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),t}write(t,s,a){return this._sendPacket("message",t,s,a),this}send(t,s,a){return this._sendPacket("message",t,s,a),this}_sendPacket(t,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const r={type:t,data:s,options:a};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),n&&this.once("flush",n),this.flush()}close(){const t=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),t()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():t()}):this.upgrading?a():t()),this}_onError(t){if(De.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",t),this._onClose("transport error",t)}_onClose(t,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Wt&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=gt.indexOf(this._offlineEventListener);a!==-1&&gt.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",t,s),this.writeBuffer=[],this._prevBufferLen=0}}}De.protocol=la;class Bn extends De{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let t=0;t<this._upgrades.length;t++)this._probe(this._upgrades[t])}_probe(t){let s=this.createTransport(t),a=!1;De.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",m=>{if(!a)if(m.type==="pong"&&m.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;De.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(u(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const f=new Error("probe error");f.transport=s.name,this.emitReserved("upgradeError",f)}}))};function r(){a||(a=!0,u(),s.close(),s=null)}const i=m=>{const f=new Error("probe error: "+m);f.transport=s.name,r(),this.emitReserved("upgradeError",f)};function l(){i("transport closed")}function c(){i("socket closed")}function d(m){s&&m.name!==s.name&&r()}const u=()=>{s.removeListener("open",n),s.removeListener("error",i),s.removeListener("close",l),this.off("close",c),this.off("upgrading",d)};s.once("open",n),s.once("error",i),s.once("close",l),this.once("close",c),this.once("upgrading",d),this._upgrades.indexOf("webtransport")!==-1&&t!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(t){this._upgrades=this._filterUpgrades(t.upgrades),super.onHandshake(t)}_filterUpgrades(t){const s=[];for(let a=0;a<t.length;a++)~this.transports.indexOf(t[a])&&s.push(t[a]);return s}}let Mn=class extends Bn{constructor(t,s={}){const a=typeof t=="object"?t:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>Sn[n]).filter(n=>!!n)),super(t,a)}};function An(e,t="",s){let a=e;s=s||typeof location<"u"&&location,e==null&&(e=s.protocol+"//"+s.host),typeof e=="string"&&(e.charAt(0)==="/"&&(e.charAt(1)==="/"?e=s.protocol+e:e=s.host+e),/^(https?|wss?):\/\//.test(e)||(typeof s<"u"?e=s.protocol+"//"+e:e="https://"+e),a=Gt(e)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const r=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+r+":"+a.port+t,a.href=a.protocol+"://"+r+(s&&s.port===a.port?"":":"+a.port),a}const Tn=typeof ArrayBuffer=="function",_n=e=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(e):e.buffer instanceof ArrayBuffer,ma=Object.prototype.toString,Pn=typeof Blob=="function"||typeof Blob<"u"&&ma.call(Blob)==="[object BlobConstructor]",qn=typeof File=="function"||typeof File<"u"&&ma.call(File)==="[object FileConstructor]";function ws(e){return Tn&&(e instanceof ArrayBuffer||_n(e))||Pn&&e instanceof Blob||qn&&e instanceof File}function ft(e,t){if(!e||typeof e!="object")return!1;if(Array.isArray(e)){for(let s=0,a=e.length;s<a;s++)if(ft(e[s]))return!0;return!1}if(ws(e))return!0;if(e.toJSON&&typeof e.toJSON=="function"&&arguments.length===1)return ft(e.toJSON(),!0);for(const s in e)if(Object.prototype.hasOwnProperty.call(e,s)&&ft(e[s]))return!0;return!1}function Rn(e){const t=[],s=e.data,a=e;return a.data=Kt(s,t),a.attachments=t.length,{packet:a,buffers:t}}function Kt(e,t){if(!e)return e;if(ws(e)){const s={_placeholder:!0,num:t.length};return t.push(e),s}else if(Array.isArray(e)){const s=new Array(e.length);for(let a=0;a<e.length;a++)s[a]=Kt(e[a],t);return s}else if(typeof e=="object"&&!(e instanceof Date)){const s={};for(const a in e)Object.prototype.hasOwnProperty.call(e,a)&&(s[a]=Kt(e[a],t));return s}return e}function Dn(e,t){return e.data=Jt(e.data,t),delete e.attachments,e}function Jt(e,t){if(!e)return e;if(e&&e._placeholder===!0){if(typeof e.num=="number"&&e.num>=0&&e.num<t.length)return t[e.num];throw new Error("illegal attachments")}else if(Array.isArray(e))for(let s=0;s<e.length;s++)e[s]=Jt(e[s],t);else if(typeof e=="object")for(const s in e)Object.prototype.hasOwnProperty.call(e,s)&&(e[s]=Jt(e[s],t));return e}const Nn=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var Q;(function(e){e[e.CONNECT=0]="CONNECT",e[e.DISCONNECT=1]="DISCONNECT",e[e.EVENT=2]="EVENT",e[e.ACK=3]="ACK",e[e.CONNECT_ERROR=4]="CONNECT_ERROR",e[e.BINARY_EVENT=5]="BINARY_EVENT",e[e.BINARY_ACK=6]="BINARY_ACK"})(Q||(Q={}));class Fn{constructor(t){this.replacer=t}encode(t){return(t.type===Q.EVENT||t.type===Q.ACK)&&ft(t)?this.encodeAsBinary({type:t.type===Q.EVENT?Q.BINARY_EVENT:Q.BINARY_ACK,nsp:t.nsp,data:t.data,id:t.id}):[this.encodeAsString(t)]}encodeAsString(t){let s=""+t.type;return(t.type===Q.BINARY_EVENT||t.type===Q.BINARY_ACK)&&(s+=t.attachments+"-"),t.nsp&&t.nsp!=="/"&&(s+=t.nsp+","),t.id!=null&&(s+=t.id),t.data!=null&&(s+=JSON.stringify(t.data,this.replacer)),s}encodeAsBinary(t){const s=Rn(t),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class $s extends ne{constructor(t){super(),this.reviver=t}add(t){let s;if(typeof t=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(t);const a=s.type===Q.BINARY_EVENT;a||s.type===Q.BINARY_ACK?(s.type=a?Q.EVENT:Q.ACK,this.reconstructor=new On(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(ws(t)||t.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(t),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+t)}decodeString(t){let s=0;const a={type:Number(t.charAt(0))};if(Q[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===Q.BINARY_EVENT||a.type===Q.BINARY_ACK){const r=s+1;for(;t.charAt(++s)!=="-"&&s!=t.length;);const i=t.substring(r,s);if(i!=Number(i)||t.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(i)}if(t.charAt(s+1)==="/"){const r=s+1;for(;++s&&!(t.charAt(s)===","||s===t.length););a.nsp=t.substring(r,s)}else a.nsp="/";const n=t.charAt(s+1);if(n!==""&&Number(n)==n){const r=s+1;for(;++s;){const i=t.charAt(s);if(i==null||Number(i)!=i){--s;break}if(s===t.length)break}a.id=Number(t.substring(r,s+1))}if(t.charAt(++s)){const r=this.tryParse(t.substr(s));if($s.isPayloadValid(a.type,r))a.data=r;else throw new Error("invalid payload")}return a}tryParse(t){try{return JSON.parse(t,this.reviver)}catch{return!1}}static isPayloadValid(t,s){switch(t){case Q.CONNECT:return Vs(s);case Q.DISCONNECT:return s===void 0;case Q.CONNECT_ERROR:return typeof s=="string"||Vs(s);case Q.EVENT:case Q.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&Nn.indexOf(s[0])===-1);case Q.ACK:case Q.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class On{constructor(t){this.packet=t,this.buffers=[],this.reconPack=t}takeBinaryData(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){const s=Dn(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function Vs(e){return Object.prototype.toString.call(e)==="[object Object]"}const Un=Object.freeze(Object.defineProperty({__proto__:null,Decoder:$s,Encoder:Fn,get PacketType(){return Q}},Symbol.toStringTag,{value:"Module"}));function Se(e,t,s){return e.on(t,s),function(){e.off(t,s)}}const Vn=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class ga extends ne{constructor(t,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=t,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const t=this.io;this.subs=[Se(t,"open",this.onopen.bind(this)),Se(t,"packet",this.onpacket.bind(this)),Se(t,"error",this.onerror.bind(this)),Se(t,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...t){return t.unshift("message"),this.emit.apply(this,t),this}emit(t,...s){var a,n,r;if(Vn.hasOwnProperty(t))throw new Error('"'+t.toString()+'" is a reserved event name');if(s.unshift(t),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const i={type:Q.EVENT,data:s};if(i.options={},i.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const u=this.ids++,m=s.pop();this._registerAckCallback(u,m),i.id=u}const l=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,c=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!l||(c?(this.notifyOutgoingListeners(i),this.packet(i)):this.sendBuffer.push(i)),this.flags={},this}_registerAckCallback(t,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[t]=s;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[t];for(let l=0;l<this.sendBuffer.length;l++)this.sendBuffer[l].id===t&&this.sendBuffer.splice(l,1);s.call(this,new Error("operation has timed out"))},n),i=(...l)=>{this.io.clearTimeoutFn(r),s.apply(this,l)};i.withError=!0,this.acks[t]=i}emitWithAck(t,...s){return new Promise((a,n)=>{const r=(i,l)=>i?n(i):a(l);r.withError=!0,s.push(r),this.emit(t,...s)})}_addToQueue(t){let s;typeof t[t.length-1]=="function"&&(s=t.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:t,flags:Object.assign({fromQueue:!0},this.flags)};t.push((n,...r)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...r)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(t=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!t||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(t){t.nsp=this.nsp,this.io._packet(t)}onopen(){typeof this.auth=="function"?this.auth(t=>{this._sendConnectPacket(t)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(t){this.packet({type:Q.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},t):t})}onerror(t){this.connected||this.emitReserved("connect_error",t)}onclose(t,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",t,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(t=>{if(!this.sendBuffer.some(a=>String(a.id)===t)){const a=this.acks[t];delete this.acks[t],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(t){if(t.nsp===this.nsp)switch(t.type){case Q.CONNECT:t.data&&t.data.sid?this.onconnect(t.data.sid,t.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case Q.EVENT:case Q.BINARY_EVENT:this.onevent(t);break;case Q.ACK:case Q.BINARY_ACK:this.onack(t);break;case Q.DISCONNECT:this.ondisconnect();break;case Q.CONNECT_ERROR:this.destroy();const a=new Error(t.data.message);a.data=t.data.data,this.emitReserved("connect_error",a);break}}onevent(t){const s=t.data||[];t.id!=null&&s.push(this.ack(t.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(t){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,t)}super.emit.apply(this,t),this._pid&&t.length&&typeof t[t.length-1]=="string"&&(this._lastOffset=t[t.length-1])}ack(t){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:Q.ACK,id:t,data:n}))}}onack(t){const s=this.acks[t.id];typeof s=="function"&&(delete this.acks[t.id],s.withError&&t.data.unshift(null),s.apply(this,t.data))}onconnect(t,s){this.id=t,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(t=>this.emitEvent(t)),this.receiveBuffer=[],this.sendBuffer.forEach(t=>{this.notifyOutgoingListeners(t),this.packet(t)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(t=>t()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:Q.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(t){return this.flags.compress=t,this}get volatile(){return this.flags.volatile=!0,this}timeout(t){return this.flags.timeout=t,this}onAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(t),this}prependAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(t),this}offAny(t){if(!this._anyListeners)return this;if(t){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(t===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(t),this}prependAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(t),this}offAnyOutgoing(t){if(!this._anyOutgoingListeners)return this;if(t){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(t===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(t){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,t.data)}}}function Ye(e){e=e||{},this.ms=e.min||100,this.max=e.max||1e4,this.factor=e.factor||2,this.jitter=e.jitter>0&&e.jitter<=1?e.jitter:0,this.attempts=0}Ye.prototype.duration=function(){var e=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var t=Math.random(),s=Math.floor(t*this.jitter*e);e=Math.floor(t*10)&1?e+s:e-s}return Math.min(e,this.max)|0};Ye.prototype.reset=function(){this.attempts=0};Ye.prototype.setMin=function(e){this.ms=e};Ye.prototype.setMax=function(e){this.max=e};Ye.prototype.setJitter=function(e){this.jitter=e};class Yt extends ne{constructor(t,s){var a;super(),this.nsps={},this.subs=[],t&&typeof t=="object"&&(s=t,t=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,qt(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new Ye({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=t;const n=s.parser||Un;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(t){return arguments.length?(this._reconnection=!!t,t||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(t){return t===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=t,this)}reconnectionDelay(t){var s;return t===void 0?this._reconnectionDelay:(this._reconnectionDelay=t,(s=this.backoff)===null||s===void 0||s.setMin(t),this)}randomizationFactor(t){var s;return t===void 0?this._randomizationFactor:(this._randomizationFactor=t,(s=this.backoff)===null||s===void 0||s.setJitter(t),this)}reconnectionDelayMax(t){var s;return t===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=t,(s=this.backoff)===null||s===void 0||s.setMax(t),this)}timeout(t){return arguments.length?(this._timeout=t,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(t){if(~this._readyState.indexOf("open"))return this;this.engine=new Mn(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=Se(s,"open",function(){a.onopen(),t&&t()}),r=l=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",l),t?t(l):this.maybeReconnectOnOpen()},i=Se(s,"error",r);if(this._timeout!==!1){const l=this._timeout,c=this.setTimeoutFn(()=>{n(),r(new Error("timeout")),s.close()},l);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(n),this.subs.push(i),this}connect(t){return this.open(t)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const t=this.engine;this.subs.push(Se(t,"ping",this.onping.bind(this)),Se(t,"data",this.ondata.bind(this)),Se(t,"error",this.onerror.bind(this)),Se(t,"close",this.onclose.bind(this)),Se(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(t){try{this.decoder.add(t)}catch(s){this.onclose("parse error",s)}}ondecoded(t){Pt(()=>{this.emitReserved("packet",t)},this.setTimeoutFn)}onerror(t){this.emitReserved("error",t)}socket(t,s){let a=this.nsps[t];return a?this._autoConnect&&!a.active&&a.connect():(a=new ga(this,t,s),this.nsps[t]=a),a}_destroy(t){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(t){const s=this.encoder.encode(t);for(let a=0;a<s.length;a++)this.engine.write(s[a],t.options)}cleanup(){this.subs.forEach(t=>t()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(t,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",t,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{t.skipReconnect||(this.emitReserved("reconnect_attempt",t.backoff.attempts),!t.skipReconnect&&t.open(n=>{n?(t._reconnecting=!1,t.reconnect(),this.emitReserved("reconnect_error",n)):t.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const t=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",t)}}const Xe={};function vt(e,t){typeof e=="object"&&(t=e,e=void 0),t=t||{};const s=An(e,t.path||"/socket.io"),a=s.source,n=s.id,r=s.path,i=Xe[n]&&r in Xe[n].nsps,l=t.forceNew||t["force new connection"]||t.multiplex===!1||i;let c;return l?c=new Yt(a,t):(Xe[n]||(Xe[n]=new Yt(a,t)),c=Xe[n]),s.query&&!t.query&&(t.query=s.queryKey),c.socket(s.path,t)}Object.assign(vt,{Manager:Yt,Socket:ga,io:vt,connect:vt});class Hn{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var t;(t=this.socket)!=null&&t.connected||(this.socket=vt({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(t){var s;this.subscribedMangas.add(t),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",t)}unsubscribeFromManga(t){var s;this.subscribedMangas.delete(t),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",t)}on(t,s){this.listeners.has(t)||this.listeners.set(t,new Set),this.listeners.get(t).add(s),this.socket&&this.socket.on(t,s)}off(t,s){this.listeners.has(t)&&this.listeners.get(t).delete(s),this.socket&&this.socket.off(t,s)}emit(t,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(t,s)}}const ae={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone",SITE_CHALLENGE:"site:challenge",SITE_CHALLENGE_CLEARED:"site:challenge-cleared",SITE_SESSION:"site:session",TORRENT_UPDATE:"torrent:update"},ee=new Hn,me={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},Ce=new Set,te=new Map,tt=new Map;function jn(e){return me[e]}function zn(e,t){me[e]=t,Ce.add(e),lt(e)}function Qn(e,t){return tt.has(e)||tt.set(e,new Set),tt.get(e).add(t),()=>{var s;return(s=tt.get(e))==null?void 0:s.delete(t)}}function lt(e){const t=tt.get(e);t&&t.forEach(s=>s(me[e]))}function st(e){Ce.delete(e),te.delete(e)}function Gn(e){return Ce.has(e)}async function at(e=!1){if(!e&&Ce.has("bookmarks"))return me.bookmarks;if(te.has("bookmarks"))return te.get("bookmarks");const t=g.getBookmarks().then(s=>(me.bookmarks=s||[],Ce.add("bookmarks"),te.delete("bookmarks"),lt("bookmarks"),me.bookmarks)).catch(s=>{throw te.delete("bookmarks"),s});return te.set("bookmarks",t),t}async function Wn(e=!1){if(!e&&Ce.has("series"))return me.series;if(te.has("series"))return te.get("series");const t=g.get("/series").then(s=>(me.series=s||[],Ce.add("series"),te.delete("series"),lt("series"),me.series)).catch(s=>{throw te.delete("series"),s});return te.set("series",t),t}async function Kn(e=!1){if(!e&&Ce.has("categories"))return me.categories;if(te.has("categories"))return te.get("categories");const t=g.get("/categories").then(s=>(me.categories=s.categories||[],Ce.add("categories"),te.delete("categories"),lt("categories"),me.categories)).catch(s=>{throw te.delete("categories"),s});return te.set("categories",t),t}async function Jn(e=!1){if(!e&&Ce.has("favorites"))return me.favorites;if(te.has("favorites"))return te.get("favorites");const t=g.getFavorites().then(s=>(me.favorites=s||{favorites:{},listOrder:[]},Ce.add("favorites"),te.delete("favorites"),lt("favorites"),me.favorites)).catch(s=>{throw te.delete("favorites"),s});return te.set("favorites",t),t}function Yn(){ee.on(ae.MANGA_UPDATED,()=>{st("bookmarks"),at(!0)}),ee.on(ae.MANGA_ADDED,()=>{st("bookmarks"),at(!0)}),ee.on(ae.MANGA_DELETED,()=>{st("bookmarks"),at(!0)}),ee.on(ae.DOWNLOAD_COMPLETED,()=>{st("bookmarks"),at(!0)})}Yn();const fe={get:jn,set:zn,subscribe:Qn,invalidate:st,isLoaded:Gn,loadBookmarks:at,loadSeries:Wn,loadCategories:Kn,loadFavorites:Jn};function p(e,t="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${t}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}const Xn={library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',"book-open":'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',"book-marked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',"layout-grid":'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',check:'<path d="M20 6 9 17l-5-5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',"trash-2":'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',"undo-2":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',scissors:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',play:'<polygon points="6 3 20 12 6 21 6 3"/>',pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',"hard-drive":'<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',package:'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"eye-off":'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',circle:'<circle cx="12" cy="12" r="10"/>',lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',"lock-open":'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',"triangle-alert":'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',"shield-alert":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',"circle-help":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',"traffic-cone":'<path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"/><path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"/><path d="M13.9 3.5a1.93 1.93 0 0 0-3.8 0L6.1 19.5a1.93 1.93 0 0 0 1.9 2.5h8a1.93 1.93 0 0 0 1.9-2.5z"/><path d="M2 21h20"/>',sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',"alarm-clock":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',loader:'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',"search-x":'<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',"list-checks":'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',"log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',sliders:'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',"chevron-up":'<path d="m18 15-6-6-6 6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"chevron-left":'<path d="m15 18-6-6 6-6"/>',"chevron-right":'<path d="m9 18 6-6-6-6"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',images:'<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>',"columns-2":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',"rectangle-vertical":'<rect width="12" height="20" x="6" y="2" rx="2"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',"arrow-left-right":'<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',"refresh-cw":'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>',"rotate-cw":'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"message-circle":'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'};function h(e,t={}){const s=Xn[e];if(!s)return console.warn("[icons] unknown icon:",e),"";const{size:a,cls:n="",title:r,spin:i=!1}=t,l=["icon",i?"icon-spin":"",n].filter(Boolean).join(" "),c=a?` width="${a}" height="${a}"`:"",d=r?` role="img" aria-label="${String(r).replace(/"/g,"&quot;")}"`:' aria-hidden="true"';return`<svg class="${l}"${c} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${d}>${s}</svg>`}function ye(e="book"){return`<div class="placeholder" data-icon="${e}"></div>`}function _e(e,t,s={}){const{kind:a="book",self:n=!1,attrs:r=""}=s,i=String(t??"").replace(/"/g,"&quot;"),l=`<div class=&quot;placeholder&quot; data-icon=&quot;${a}&quot;></div>`,c=n?"this.outerHTML":"this.parentElement.innerHTML";return`<img src="${e}" alt="${i}" loading="lazy"${r?" "+r:""} onerror="${c}='${l}'">`}const Hs=`${h("folder")} Scan Folder`,js=`${h("loader",{spin:!0})} Scanning...`;async function Zn(e,t,s){try{e&&(e.disabled=!0,e.innerHTML=js),t&&(t.innerHTML=js),p("Scanning downloads folder...","info");const n=(await g.scanLibrary()).found||[];if(n.length===0){p("Scan complete: No new manga found","info"),s&&s();return}er(n,s)}catch(a){p("Scan failed: "+a.message,"error")}finally{e&&(e.disabled=!1,e.innerHTML=Hs),t&&(t.innerHTML=Hs)}}async function er(e,t){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),r=Array.from(n).map(c=>c.dataset.folder);if(r.length===0){p("No folders selected","warning");return}const i=document.getElementById("import-all-btn");i.disabled=!0,i.textContent="Importing...";let l=0;for(const c of r)try{await g.importLocalManga(c),l++}catch(d){console.error("Failed to import",c,d)}s.remove(),p(`Imported ${l} manga`,"success"),t&&t()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function tr(e={}){const{size:t,stroke:s="currentColor",accent:a="var(--accent-primary, #E03A2F)",strokeWidth:n=2,cls:r=""}=e,i=t?` width="${t}" height="${t}"`:"";return`<svg class="${`logo-mark ${r}`.trim()}"${i} viewBox="0 0 24 24" fill="none" stroke="${s}" stroke-width="${n}" stroke-linejoin="round" aria-hidden="true"><polygon points="3,3 10.5,3 8.5,21 3,21"/><polygon points="13,3 21,3 21,10.5 12.17,10.5" fill="${a}" stroke="${a}"/><polygon points="11.89,13 21,13 21,21 11,21"/></svg>`}function zs(){return`${tr()}<span class="logo-text">Manga<span>Reader</span></span>`}const Y={user:null,get isAdmin(){var e;return((e=this.user)==null?void 0:e.role)==="admin"},get isDemo(){var e;return((e=this.user)==null?void 0:e.role)==="demo"},get canDownload(){var e;return this.isAdmin||!this.isDemo&&!!((e=this.user)!=null&&e.canDownload)},get canEdit(){var e;return this.isAdmin||!this.isDemo&&!!((e=this.user)!=null&&e.canEdit)}};function Ri(e){Y.user=e||null}function he(e="manga"){if(Y.isDemo)return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${zs()}</a>
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
  `;const t=Y.isAdmin?`<a href="#/admin" class="btn btn-secondary" title="Admin">${h("wrench",{title:"Admin"})}</a>`:"",s=Y.isAdmin?`<a href="#/admin" class="mobile-menu-item">${h("wrench")} Admin</a>`:"",a=Y.canDownload?`<button class="btn btn-secondary" id="scan-btn">${h("folder")} Scan Folder</button>`:"",n=Y.canDownload?`<button class="mobile-menu-item" id="mobile-scan-btn">${h("folder")} Scan Folder</button>`:"",r=Y.canEdit?e==="series"?`<button class="btn btn-primary" id="add-series-btn">${h("plus")} Add Series</button>`:`<button class="btn btn-primary" id="add-manga-btn">${h("plus")} Add Manga</button>`:"",i=Y.canEdit?e==="series"?`<button class="mobile-menu-item primary" id="mobile-add-series-btn">${h("plus")} Add Series</button>`:`<button class="mobile-menu-item primary" id="mobile-add-btn">${h("plus")} Add Manga</button>`:"";return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${zs()}</a>
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
  `}function Pe(){const e=document.querySelector("header");if(e&&e.dataset.listenersBound)return;e&&(e.dataset.listenersBound="true");const t=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");t&&s&&t.addEventListener("click",()=>{s.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),r=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",r),n&&n.addEventListener("click",r);const i=document.getElementById("demo-exit-btn");i&&i.addEventListener("click",y=>{y.preventDefault(),localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"}),document.querySelectorAll("[data-view]").forEach(y=>{y.addEventListener("click",()=>{const C=y.dataset.view;localStorage.setItem("library_view_mode",C),document.querySelectorAll("[data-view]").forEach(S=>{S.classList.toggle("active",S.dataset.view===C)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:C}}))})});const l=document.querySelector(".logo");l&&l.addEventListener("click",y=>{localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),fe.loadBookmarks(!0).catch(()=>{}),window.dispatchEvent(new CustomEvent("clearFilters"))});const c=document.getElementById("favorites-btn"),d=document.getElementById("mobile-favorites-btn"),u=y=>{y.preventDefault(),F.go("/favorites")};c&&c.addEventListener("click",u),d&&d.addEventListener("click",u);const m=document.getElementById("queue-nav-btn");m&&m.addEventListener("click",y=>{y.preventDefault(),F.go("/queue")});const f=document.getElementById("add-manga-btn"),E=document.getElementById("mobile-add-btn"),x=()=>{document.getElementById("add-modal")||(sessionStorage.setItem("open_add_modal","1"),F.go("/"))};f&&f.addEventListener("click",x),E&&E.addEventListener("click",x);const b=document.getElementById("scan-btn"),L=document.getElementById("mobile-scan-btn");if(b||L){const y=()=>{Zn(b,L,async()=>{await fe.loadBookmarks(!0),F.reload()})};b&&b.addEventListener("click",y),L&&L.addEventListener("click",y)}}const Et={series:"any",downloads:"any",reading:"any",source:"any",monitor:"any"};function sr(){try{const e=JSON.parse(localStorage.getItem("library_filters")||"{}");return{...Et,...e&&typeof e=="object"?e:{}}}catch{return{...Et}}}let B={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",searchAuthor:localStorage.getItem("library_search_author")||null,searchAuthorSource:localStorage.getItem("library_search_author_source")||null,sortBy:localStorage.getItem("library_sort")||"updated",filters:sr(),viewMode:"manga",loading:!0},St=[],Ne=null;function ar(){localStorage.setItem("library_filters",JSON.stringify(B.filters))}function nr(e){var i,l,c;const t=new Set(e.excludedChapters||[]),s=new Set((e.chapters||[]).filter(d=>!t.has(d.number)).map(d=>d.number)).size||e.uniqueChapters||0,a=e.downloadedCount??((i=e.downloadedChapters)==null?void 0:i.length)??0,n=e.readCount??((l=e.readChapters)==null?void 0:l.length)??0,r=(e.updatedCount??((c=e.updatedChapters)==null?void 0:c.length)??0)>0;return{total:s,downloaded:a,read:n,updates:r}}const rr=[{key:"series",label:"Series",options:[{value:"none",label:"Not in a series",test:e=>!e.series},{value:"in",label:"In a series",test:e=>!!e.series}]},{key:"downloads",label:"Downloads",options:[{value:"none",label:"Nothing downloaded",test:(e,t)=>t.downloaded===0},{value:"partial",label:"Partly downloaded",test:(e,t)=>t.downloaded>0&&t.downloaded<t.total},{value:"complete",label:"Fully downloaded",test:(e,t)=>t.total>0&&t.downloaded>=t.total}]},{key:"reading",label:"Reading",options:[{value:"unread",label:"Not started",test:(e,t)=>t.read===0},{value:"progress",label:"In progress",test:(e,t)=>t.read>0&&t.read<t.total},{value:"finished",label:"Finished",test:(e,t)=>t.total>0&&t.read>=t.total},{value:"updates",label:"New chapters",test:(e,t)=>t.updates}]},{key:"source",label:"Source",options:[]},{key:"monitor",label:"Auto-check",options:[{value:"on",label:"On",test:e=>!!e.autoCheck},{value:"off",label:"Off",test:e=>!e.autoCheck}]}];function or(){const t=[...new Set(B.bookmarks.filter(s=>s.source!=="local"&&s.website).map(s=>s.website))].sort().map(s=>({value:`site:${s}`,label:s,test:a=>a.source!=="local"&&a.website===s}));return B.bookmarks.some(s=>s.source==="local")&&t.unshift({value:"local",label:"Local files",test:s=>s.source==="local"}),t}function fa(){return rr.map(e=>e.key==="source"?{...e,options:or()}:e)}function va(){return Object.values(B.filters).filter(e=>e&&e!=="any").length}function ir(e){const s=fa().map(a=>({g:a,option:a.options.find(n=>n.value===B.filters[a.key])})).filter(a=>a.option);return s.length===0?e:e.filter(a=>{const n=nr(a);return s.every(({option:r})=>r.test(a,n))})}function Ct(e){return String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}function lr(e){return[...e].sort((t,s)=>{var a,n;switch(B.sortBy){case"az":return(t.alias||t.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(t.alias||t.title);case"lastread":return(s.lastReadAt||"").localeCompare(t.lastReadAt||"");case"chapters":{const r=((a=t.chapters)==null?void 0:a.length)||t.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-r}case"updated":default:return(s.updatedAt||"").localeCompare(t.updatedAt||"")}})}function Rt(){let e=B.bookmarks;const t=(Array.isArray(B.categories)?B.categories:[]).filter(s=>typeof s=="object"?s.isNsfw:!1).map(s=>s.name);if(B.activeCategory==="__nsfw__"?e=e.filter(s=>(s.categories||[]).some(a=>t.includes(a))):B.activeCategory?e=e.filter(s=>(s.categories||[]).includes(B.activeCategory)):t.length>0&&(e=e.filter(s=>!(s.categories||[]).some(a=>t.includes(a)))),B.artistFilter&&(e=e.filter(s=>(s.artists||[]).includes(B.artistFilter))),B.searchQuery){const s=B.searchQuery.toLowerCase();e=e.filter(a=>(a.title||"").toLowerCase().includes(s)||(a.alias||"").toLowerCase().includes(s)||(a.artists||[]).some(n=>n.toLowerCase().includes(s)))}return e=ir(e),lr(e)}function cr(e){const t=va(),s=fa().filter(a=>a.options.length>0);return`
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
              <button type="button" class="filter-chip ${B.filters[a.key]==="any"||!B.filters[a.key]?"active":""}" data-group="${a.key}" data-value="any">Any</button>
              ${a.options.map(n=>`<button type="button" class="filter-chip ${B.filters[a.key]===n.value?"active":""}" data-group="${a.key}" data-value="${Ct(n.value)}">${Ct(n.label)}</button>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    <span class="library-count" id="library-count" title="Shown / in library">${e} / ${B.bookmarks.length}</span>
  `}function Qs(){const e=document.getElementById("library-grid");if(!e)return;const t=Rt();e.innerHTML=t.map(Dt).join("")||Nt();const s=document.getElementById("library-count");s&&(s.textContent=`${t.length} / ${B.bookmarks.length}`);const a=va(),n=document.getElementById("library-filter-btn");n&&(n.classList.toggle("has-filter",a>0),n.innerHTML=`${h("sliders")} Filter${a?` · ${a}`:""}`);const r=document.getElementById("library-filter-reset");r&&(r.hidden=a===0),document.querySelectorAll("#library-filter-menu .filter-chip").forEach(i=>{const l=B.filters[i.dataset.group]||"any";i.classList.toggle("active",i.dataset.value===l)})}function Dt(e){var u,m,f;const t=e.alias||e.title,s=e.downloadedCount??((u=e.downloadedChapters)==null?void 0:u.length)??0,a=new Set(e.excludedChapters||[]),n=(e.chapters||[]).filter(E=>!a.has(E.number)),r=new Set(n.map(E=>E.number)).size||e.uniqueChapters||0,i=e.readCount??((m=e.readChapters)==null?void 0:m.length)??0,l=(e.updatedCount??((f=e.updatedChapters)==null?void 0:f.length)??0)>0,c=e.localCover?`/api/public/covers/${e.id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover,d=e.source==="local";return`
    <div class="manga-card" data-id="${e.id}">
      <div class="manga-card-cover">
        ${c?_e(c,t,{kind:d?"local":"book"}):ye(d?"local":"book")}
        <div class="manga-card-badges">
          ${i>0?`<span class="badge badge-read" title="Read">${i}</span>`:""}
          <span class="badge badge-chapters" title="Total">${r}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${l?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${e.autoCheck?`<span class="badge badge-monitored" title="Auto-check enabled">${h("alarm-clock",{title:"Auto-check enabled"})}</span>`:""}
          ${B.activeCategory==="Favorites"?`<span class="badge badge-play" title="Click to Read">${h("play",{title:"Click to Read"})}</span>`:""}
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function Nt(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function dr(e){var n;const t=e.alias||e.title,s=((n=e.entries)==null?void 0:n.length)||e.entry_count||0;let a=null;return e.localCover&&e.coverBookmarkId?a=`/api/public/covers/${e.coverBookmarkId}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover&&(a=e.cover),`
    <div class="manga-card series-card" data-series-id="${e.id}">
      <div class="manga-card-cover">
        ${a?_e(a,t,{kind:"series"}):ye("series")}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${s} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function xt(){const e=localStorage.getItem("library_view_mode");if(e&&e!==B.viewMode&&(B.viewMode=e),B.activeCategory==="Favorites")return F.go("/favorites"),"";let t="";if(B.viewMode==="series"){const s=B.series.map(dr).join("");t=`
      <div class="library-grid" id="library-grid">
        ${B.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const s=Rt(),n=B.searchAuthor&&B.searchQuery===B.searchAuthor?`
      <div class="manga-card search-sources-card" id="search-sources-card" title="Search online sources for ${Ct(B.searchAuthor)}"
           style="display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed var(--border-color, #3a3a4a);background:transparent;min-height:220px;text-align:center;">
        <div style="padding:1rem;color:var(--text-muted, #9aa);">
          <div style="font-size:2.5rem;line-height:1;margin-bottom:.5rem;">＋</div>
          <div style="font-size:.85rem;">Search sources for<br><strong style="color:var(--text-color, #fff);">${Ct(B.searchAuthor)}</strong></div>
        </div>
      </div>`:"",r=s.map(Dt).join("")+n;t=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">${h("search")}</span>
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
        ${cr(s.length)}
      </div>
      ${B.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">${h("palette")}</span>
          <span class="artist-filter-name">${B.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${B.loading?'<div class="loading-spinner"></div>':r||Nt()}
      </div>
    `}return`
    ${he(B.viewMode)}
    <div class="container">
      ${t}
    </div>
    ${ur()}
    ${hr()}
    ${mr()}
  `}function ur(){const{activeCategory:e}=B,s=(Array.isArray(B.categories)?B.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=s.some(n=>n.isNsfw);return`
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
    ${pr()}
      `}function pr(){const t=(Array.isArray(B.categories)?B.categories:[]).map(s=>typeof s=="object"?s:{name:s,isNsfw:!1});return`
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
  `}function hr(){return`
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
      `}function mr(){return`
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
      `}function Xt(){B.activeCategory=null,B.artistFilter=null,B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,B.filters={...Et},localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),localStorage.removeItem("library_filters"),be()}function gr(){const e=document.getElementById("library-filter-btn"),t=document.getElementById("library-filter-menu");!e||!t||(e.addEventListener("click",s=>{s.stopPropagation();const a=t.classList.toggle("hidden")===!1;e.setAttribute("aria-expanded",String(a))}),t.addEventListener("click",s=>{s.stopPropagation();const a=s.target.closest(".filter-chip");if(a){B.filters[a.dataset.group]=a.dataset.value,ar(),Qs();return}s.target.closest("#library-filter-reset")&&(B.filters={...Et},localStorage.removeItem("library_filters"),Qs())}),Ne&&document.removeEventListener("click",Ne),Ne=s=>{!t.classList.contains("hidden")&&!s.target.closest("#library-filter")&&(t.classList.add("hidden"),e.setAttribute("aria-expanded","false"))},document.addEventListener("click",Ne))}async function Zt(e){const t=e.target.closest(".manga-card");if(t){if(t.classList.contains("gallery-card")){const n=t.dataset.gallery;F.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=t.dataset.id,a=t.dataset.seriesId;if(a){F.go(`/series/${a}`);return}if(s){if(B.activeCategory==="Favorites"){const n=B.bookmarks.find(r=>r.id===s);if(n){let r=n.last_read_chapter;if(!r&&n.chapters&&n.chapters.length>0&&(r=[...n.chapters].sort((l,c)=>l.number-c.number)[0].number),r){F.go(`/read/${s}/${r}`);return}else p("No chapters available to read","warning")}}F.go(`/manga/${s}`)}}}function ya(){var V,N,W,K,se;const e=document.getElementById("app");e.removeEventListener("click",Zt),e.addEventListener("click",Zt),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",v=>{B.viewMode=v.detail.mode;const I=document.getElementById("app");I.innerHTML=xt(),ya(),Pe()}));const t=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");t&&s&&(t.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",v=>{const I=v.target.closest(".category-menu-item");if(I){const T=I.dataset.category||null;fr(T),s.classList.add("hidden")}})),(V=document.getElementById("manage-categories-btn"))==null||V.addEventListener("click",v=>{v.stopPropagation();const I=document.getElementById("manage-categories-modal");I&&I.classList.add("open")}),(N=document.getElementById("close-manage-categories-btn"))==null||N.addEventListener("click",()=>{var v;(v=document.getElementById("manage-categories-modal"))==null||v.classList.remove("open")}),(W=document.querySelector("#manage-categories-modal .modal-overlay"))==null||W.addEventListener("click",()=>{var v;(v=document.getElementById("manage-categories-modal"))==null||v.classList.remove("open")}),(K=document.querySelector("#manage-categories-modal .modal-close"))==null||K.addEventListener("click",()=>{var v;(v=document.getElementById("manage-categories-modal"))==null||v.classList.remove("open")}),(se=document.getElementById("add-category-btn"))==null||se.addEventListener("click",async()=>{var T;const v=document.getElementById("new-category-input"),I=(T=v==null?void 0:v.value)==null?void 0:T.trim();if(I)try{await g.post("/categories",{name:I}),v.value="",p("Category added","success"),await Qe(!0),be()}catch(q){p("Failed: "+q.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(v=>{v.addEventListener("change",async I=>{const T=v.dataset.category;try{await g.put(`/categories/${encodeURIComponent(T)}/nsfw`,{isNsfw:v.checked}),p(`${T} ${v.checked?"marked as 18+":"unmarked"}`,"success"),await Qe(!0),be()}catch(q){p("Failed: "+q.message,"error"),v.checked=!v.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(v=>{v.addEventListener("click",async()=>{const I=v.dataset.category;if(confirm(`Delete category "${I}"?`))try{await g.delete(`/categories/${encodeURIComponent(I)}`),p("Category deleted","success"),B.activeCategory===I&&(B.activeCategory=null,localStorage.removeItem("library_active_category")),await Qe(!0),be()}catch(T){p("Failed: "+T.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{B.artistFilter=null,localStorage.removeItem("library_artist_filter"),be()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",v=>{var T;B.searchQuery=v.target.value,localStorage.setItem("library_search",v.target.value),B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source");const I=document.getElementById("library-grid");if(I){const q=Rt();I.innerHTML=q.map(Dt).join("")||Nt();const M=document.getElementById("search-clear");!M&&B.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(T=document.getElementById("search-clear"))==null||T.addEventListener("click",()=>{B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),n.value="",be()})):M&&!B.searchQuery&&M.remove()}}),B.searchQuery&&n.focus());const r=document.getElementById("search-clear");r&&r.addEventListener("click",()=>{B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),be()});const i=document.getElementById("search-sources-card");i&&i.addEventListener("click",()=>{const v=B.searchAuthor||B.searchQuery,I=B.searchAuthorSource||"nhentai.net";v&&(window.location.hash=`#/scrapers?browse=${encodeURIComponent(I)}&q=${encodeURIComponent(v)}`)});const l=document.getElementById("library-sort");l&&l.addEventListener("change",v=>{B.sortBy=v.target.value,localStorage.setItem("library_sort",B.sortBy),be()}),gr(),window.removeEventListener("clearFilters",Xt),window.addEventListener("clearFilters",Xt);const c=document.getElementById("add-manga-btn"),d=document.getElementById("mobile-add-btn"),u=document.getElementById("add-modal"),m=document.getElementById("add-modal-close"),f=document.getElementById("add-modal-cancel"),E=document.getElementById("add-modal-submit"),x=document.getElementById("mobile-menu"),b=()=>{x&&x.classList.add("hidden"),u&&u.classList.add("open")};c&&c.addEventListener("click",b),d&&d.addEventListener("click",b),m&&m.addEventListener("click",()=>u.classList.remove("open")),f&&f.addEventListener("click",()=>u.classList.remove("open")),E&&E.addEventListener("click",async()=>{const v=document.getElementById("manga-url"),I=v.value.trim();if(!I){p("Please enter a URL","error");return}try{E.disabled=!0,E.textContent="Adding...",await g.addBookmark(I),p("Manga added successfully!","success"),u.classList.remove("open"),v.value="",await Qe(),be()}catch(T){p("Failed to add manga: "+T.message,"error")}finally{E.disabled=!1,E.textContent="Add"}});const L=document.getElementById("add-series-btn"),y=document.getElementById("mobile-add-series-btn"),C=document.getElementById("add-series-modal"),S=document.getElementById("add-series-modal-close"),_=document.getElementById("add-series-modal-cancel"),R=document.getElementById("add-series-modal-submit"),O=document.getElementById("mobile-menu");if((L||y)&&C){const v=()=>{O&&O.classList.add("hidden"),C.classList.add("open")};L&&L.addEventListener("click",v),y&&y.addEventListener("click",v)}S&&S.addEventListener("click",()=>C.classList.remove("open")),_&&_.addEventListener("click",()=>C.classList.remove("open")),R&&R.addEventListener("click",async()=>{const v=document.getElementById("series-title"),I=document.getElementById("series-alias"),T=v.value.trim(),q=I.value.trim();if(!T){p("Please enter a title","error");return}try{R.disabled=!0,R.textContent="Creating...",await g.createSeries(T,q),p("Series created successfully!","success"),C.classList.remove("open"),v.value="",I.value="",await Qe(!0),be()}catch(M){p("Failed to create series: "+M.message,"error")}finally{R.disabled=!1,R.textContent="Create"}});const w=C==null?void 0:C.querySelector(".modal-overlay");w&&w.addEventListener("click",()=>C.classList.remove("open"));const $=document.getElementById("empty-add-btn");$&&u&&$.addEventListener("click",()=>u.classList.add("open"));const A=document.getElementById("empty-add-series-btn");A&&C&&A.addEventListener("click",()=>C.classList.add("open"));const D=u==null?void 0:u.querySelector(".modal-overlay");D&&D.addEventListener("click",()=>u.classList.remove("open")),Pe()}function fr(e){B.activeCategory=e,e?localStorage.setItem("library_active_category",e):localStorage.removeItem("library_active_category"),be()}async function Qe(e=!1){try{if(Y.isDemo){const[r,i]=await Promise.all([fe.loadBookmarks(e),fe.loadSeries(e)]);B.bookmarks=r,B.categories=[],B.series=i,B.favorites={favorites:{},listOrder:[]},B.loading=!1;return}const[t,s,a,n]=await Promise.all([fe.loadBookmarks(e),fe.loadCategories(e),fe.loadSeries(e),fe.loadFavorites(e)]);B.bookmarks=t,B.categories=s,B.series=a,B.favorites=n,B.loading=!1}catch{p("Failed to load library","error"),B.loading=!1}}async function be(){var t;const e=document.getElementById("app");if(Y.isDemo)B.activeCategory=null,B.artistFilter=null,B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null;else{const s=localStorage.getItem("library_active_category");B.activeCategory!==s&&(B.activeCategory=s);const a=localStorage.getItem("library_artist_filter")||null;B.artistFilter!==a&&(B.artistFilter=a);const n=localStorage.getItem("library_search")||"";B.searchQuery!==n&&(B.searchQuery=n),B.searchAuthor=localStorage.getItem("library_search_author")||null,B.searchAuthorSource=localStorage.getItem("library_search_author_source")||null}B.loading&&(e.innerHTML=xt()),B.bookmarks.length===0&&B.loading&&await Qe(),e.innerHTML=xt(),ya(),sessionStorage.getItem("open_add_modal")&&(sessionStorage.removeItem("open_add_modal"),(t=document.getElementById("add-modal"))==null||t.classList.add("open")),St.forEach(s=>s()),St=[fe.subscribe("bookmarks",s=>{B.bookmarks=s;const a=document.getElementById("library-grid");if(a){const n=Rt();a.innerHTML=n.map(Dt).join("")||Nt()}})]}function vr(){const e=document.getElementById("app");e&&e.removeEventListener("click",Zt),window.removeEventListener("clearFilters",Xt),Ne&&(document.removeEventListener("click",Ne),Ne=null),St.forEach(t=>t()),St=[]}const yr={mount:be,unmount:vr,render:xt},br="manga-offline",wr=1,Ve="images",de="chapters";let pt=null;function ct(){return new Promise((e,t)=>{if(pt)return e(pt);const s=indexedDB.open(br,wr);s.onupgradeneeded=a=>{const n=a.target.result;n.objectStoreNames.contains(Ve)||n.createObjectStore(Ve),n.objectStoreNames.contains(de)||n.createObjectStore(de)},s.onsuccess=()=>{pt=s.result,e(pt)},s.onerror=()=>t(s.error)})}function He(e,t){return ct().then(s=>new Promise((a,n)=>{const l=s.transaction(e,"readonly").objectStore(e).get(t);l.onsuccess=()=>a(l.result),l.onerror=()=>n(l.error)}))}function es(e,t,s){return ct().then(a=>new Promise((n,r)=>{const c=a.transaction(e,"readwrite").objectStore(e).put(s,t);c.onsuccess=()=>n(),c.onerror=()=>r(c.error)}))}function ts(e,t){return ct().then(s=>new Promise((a,n)=>{const l=s.transaction(e,"readwrite").objectStore(e).delete(t);l.onsuccess=()=>a(),l.onerror=()=>n(l.error)}))}function ks(e){return ct().then(t=>new Promise((s,a)=>{const i=t.transaction(e,"readonly").objectStore(e).getAllKeys();i.onsuccess=()=>s(i.result),i.onerror=()=>a(i.error)}))}function Ke(e,t){return`${e}:${t}`}function Es(e,t,s){return`${e}:${t}:${s}`}function $r(e){const t=e.split(":");return{mangaId:t[0],chapterNum:parseFloat(t[1])}}async function Ss(e,t,s=null){const a=await g.get(`/bookmarks/${e}/chapters/${t}/reader-images`);if(!a||!a.images||a.images.length===0)throw new Error("No images found for this chapter");const n=a.images,r=n.length;let i=0;const l=g.getToken();for(let d=0;d<n.length;d++){const u=typeof n[d]=="string"?n[d]:n[d].url,m=u.startsWith("http")?u:`${window.location.origin}${u}`;try{const f=await fetch(m,{headers:l?{Authorization:`Bearer ${l}`}:{}});if(!f.ok)throw new Error(`HTTP ${f.status}`);const E=await f.blob();await es(Ve,Es(e,t,u),E),i++,s&&s(i,r)}catch(f){console.error(`[Offline] Failed to cache image ${d+1}/${r}:`,f)}}const c={mangaId:e,chapterNum:t,imageUrls:n.map(d=>typeof d=="string"?d:d.url),savedAt:Date.now(),imageCount:i};return await es(de,Ke(e,t),c),{success:!0,imageCount:i}}async function kr(e,t){const s=await He(de,Ke(e,t));if(!s)return null;const a=[];for(const n of s.imageUrls){const r=await He(Ve,Es(e,t,n));if(r)a.push(URL.createObjectURL(r));else return a.forEach(i=>URL.revokeObjectURL(i)),null}return a}async function ba(e,t){const s=await He(de,Ke(e,t));if(s&&s.imageUrls)for(const a of s.imageUrls)await ts(Ve,Es(e,t,a));await ts(de,Ke(e,t))}async function Er(e,t){if(!await He(de,Ke(e,t)))return!1;await ba(e,t);try{return await Ss(e,t),!0}catch(a){return console.warn("[Offline] Could not re-save chapter after edit:",a),!1}}async function Sr(e,t){return!!await He(de,Ke(e,t))}async function Cr(){const e=await ks(de),t=[];for(const s of e){if(s.startsWith("auto-offline-"))continue;const a=await He(de,s);a&&t.push(a)}return t}async function wa(e){const t=await ks(de),s=[];for(const a of t)if(!a.startsWith("auto-offline-")&&a.startsWith(`${e}:`)){const{chapterNum:n}=$r(a);s.push(n)}return s}async function xr(){if(navigator.storage&&navigator.storage.estimate){const e=await navigator.storage.estimate();return{used:e.usage||0,quota:e.quota||0,usedMB:((e.usage||0)/(1024*1024)).toFixed(1),quotaMB:((e.quota||0)/(1024*1024)).toFixed(0)}}return{used:0,quota:0,usedMB:"0",quotaMB:"Unknown"}}async function Lr(){const e=await ct();await new Promise((t,s)=>{const r=e.transaction(Ve,"readwrite").objectStore(Ve).clear();r.onsuccess=t,r.onerror=s}),await new Promise((t,s)=>{const r=e.transaction(de,"readwrite").objectStore(de).clear();r.onsuccess=t,r.onerror=s})}async function Ir(e,t){t?await es(de,`auto-offline-${e}`,{enabled:!0,mangaId:e}):await ts(de,`auto-offline-${e}`)}async function Br(e){const t=await He(de,`auto-offline-${e}`);return!!(t!=null&&t.enabled)}async function Mr(){return(await ks(de)).filter(t=>t.startsWith("auto-offline-")).map(t=>t.replace("auto-offline-",""))}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",async e=>{var t;if(((t=e.data)==null?void 0:t.type)==="sync-offline"){const s=e.data.mangaId;console.log(`[Offline] Auto-sync triggered for manga ${s}`);try{await $a(s)}catch(a){console.error("[Offline] Auto-sync failed:",a)}}});async function $a(e){try{const t=await g.getBookmark(e);if(!t)return;const s=t.downloadedChapters||[],a=await wa(e),n=s.filter(r=>!a.includes(r));console.log(`[Offline] ${n.length} new chapters to sync for ${t.alias||t.title}`);for(const r of n)await Ss(e,r),console.log(`[Offline] Auto-synced chapter ${r}`)}catch(t){console.error("[Offline] Sync error:",t)}}const Ar={saveChapterOffline:Ss,getOfflineChapter:kr,deleteOfflineChapter:ba,refreshOfflineChapter:Er,isChapterOffline:Sr,getOfflineChapters:Cr,getOfflineChaptersForManga:wa,getStorageUsage:xr,clearAllOfflineData:Lr,setAutoOffline:Ir,isAutoOffline:Br,getAutoOfflineManga:Mr,syncNewChaptersForManga:$a},Tr=e=>String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");let o={manga:null,chapter:null,versionUrl:null,images:[],trophyPages:{},mode:"manga",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!0,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null,isStreamingMode:!1,_streamAbortController:null,isVolumeMode:!1,volume:null};function Cs(e,t=o.manga){if(!e||!t)return"";const s=(t.chapters||[]).find(n=>n.url===e),a=[];return s&&(s.releaseGroup?a.push(s.releaseGroup):s.title&&s.title!==`Chapter ${s.number}`&&a.push(s.title)),e.startsWith("local://")&&a.push("Local"),a.join(" · ")}function xs(e){var s,a;const t=(a=(s=o.manga)==null?void 0:s.downloadedVersions)==null?void 0:a[e];return Array.isArray(t)?t:t?[t]:[]}function _r(){var t;const e=xs((t=o.chapter)==null?void 0:t.number);return e.length<2||!o.versionUrl?"":Cs(o.versionUrl)||`Version ${e.indexOf(o.versionUrl)+1}`}function ka(){if(!o.manga||!o.chapter||!o.allFavorites||!o.allFavorites.favorites)return!1;if(o.isCollectionMode)return!0;let t=[ns()];if(o.mode==="manga"&&!o.singlePageMode){const n=ie()[o.currentPage];n&&Array.isArray(n)?t=n:n&&n.pages&&(t=n.pages)}const s=t.map(a=>{const n=it(o.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in o.allFavorites.favorites){const n=o.allFavorites.favorites[a];if(Array.isArray(n)){for(const r of n)if(r.mangaId===o.manga.id&&r.chapterNum===o.chapter.number&&r.imagePaths)for(const i of r.imagePaths){const l=typeof i=="string"?i:(i==null?void 0:i.filename)||(i==null?void 0:i.path);for(const c of s)if(c&&c.filename===l)return!0}}}return!1}function ss(){const e=document.getElementById("favorites-btn");e&&(ka()?e.classList.add("active"):e.classList.remove("active"))}function Oe(){var m,f;if(o.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!o.manga||!o.images.length&&!o.isStreamingMode)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const e=o.manga.alias||o.manga.title,t=(m=o.chapter)==null?void 0:m.number,s=o.isCollectionMode||o.isStreamingMode?"":_r(),a=!o.isCollectionMode&&!o.isStreamingMode&&xs(t).length>1,r=ie().length,i=o.images.length;let l,c;o.mode==="webtoon"?(l=i-1,c=`${i} pages`):o.singlePageMode?(l=i-1,c=`${o.currentPage+1} / ${i}`):(l=r-1,c=`${o.currentPage+1} / ${r}`);const d=ka(),u=xa();return`
    <div class="reader ${o.mode}-mode ${o.showControls?"":"controls-hidden"}">
      <!-- Unified Top Bar -->
      <div class="reader-bar">
        <button class="reader-bar-btn close-btn" id="reader-close-btn" title="Back">×</button>
        <div class="reader-title">
          <span class="manga-name">${e}</span>
          ${o.isStreamingMode?"":o.isVolumeMode?`<span class="chapter-name" title="Volume release">${Tr(((f=o.volume)==null?void 0:f.name)||"Volume")}</span>`:`<span class="chapter-name">Ch. ${t}${s?` · <span class="version-label" title="Version being read">${s}</span>`:""}</span>`}
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
        ${o.isCollectionMode?Ea():o.mode==="webtoon"?Sa():Ca()}
      </div>
      
      <!-- Footer -->
      <div class="reader-footer">
        ${o.isStreamingMode?"":`
        <button class="btn btn-secondary" id="prev-chapter-btn">← Prev</button>
        `}
        <div class="page-slider-container">
          ${o.mode!=="webtoon"?`
          <input type="range" class="page-slider" id="page-slider"
            min="0" max="${l}" value="${o.currentPage}"
          >
          `:""}
          <span class="page-indicator" id="page-indicator">${c}</span>
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
  `}function Ea(){const e=o.mode==="manga";if(e&&!o.singlePageMode){const t=o.images[o.currentPage];if(!t)return"";const s=t.urls||[t.url],a=t.displayMode||"single";return t.displaySide,a==="double"&&s.length>=2?`
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
  `}function Ca(){if(o.singlePageMode)return Pr();const t=ie()[o.currentPage];if(!t)return"";if(t.type==="link"){const s=t.pages[0],a=o.images[s],n=typeof a=="string"?a:a.url,r=o.trophyPages[s];return`
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
  `}function Pr(){const e=o.currentPage,t=o.trophyPages[e];if(t&&!t.isSingle&&t.pages&&t.pages.length===2){const[r,i]=t.pages,l=o.images[r],c=o.images[i],d=typeof l=="string"?l:l==null?void 0:l.url,u=typeof c=="string"?c:c==null?void 0:c.url;if(d&&u)return`
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
  `}function ie(){const e=[],t=o.images.length;let s=0;if(o.isCollectionMode){for(let n=0;n<t;n++)e.push([n]);return e}let a=!o.firstPageSingle;for(;s<t;){const n=o.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[r,i]=n.pages;e.push([r,i]),s=Math.max(r,i)+1}else e.push([s]),s++;continue}if(!a){a=!0,e.push([s]),s++;continue}if(o.lastPageSingle&&s===t-1){o.nextChapterImage?e.push({type:"link",pages:[s],nextImage:o.nextChapterImage,nextChapter:o.nextChapterNum}):e.push([s]),s++;break}s+1<t?o.trophyPages[s+1]?(e.push([s]),s++):o.lastPageSingle&&s+1===t-1?(e.push([s]),o.nextChapterImage?e.push({type:"link",pages:[s+1],nextImage:o.nextChapterImage,nextChapter:o.nextChapterNum}):e.push([s+1]),s+=2):(e.push([s,s+1]),s+=2):(e.push([s]),s++)}return e}function xa(){if(o.singlePageMode)return!!o.trophyPages[o.currentPage];const t=ie()[o.currentPage];return t?(Array.isArray(t)?t:t.pages||[]).some(a=>!!o.trophyPages[a]):!1}function Ls(){if(o.singlePageMode)return[o.currentPage];const t=ie()[o.currentPage];return t?Array.isArray(t)?t:t.pages||[]:[]}async function qr(){if(!o.manga||!o.chapter||o.isCollectionMode)return;const e=Ls();if(e.length===0)return;if(e.some(s=>!!o.trophyPages[s])){const s=[...e];if(o.singlePageMode){const a=o.trophyPages[o.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete o.trophyPages[a]),p(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=e,a=o.singlePageMode||e.length===1;if(!o.singlePageMode&&e.length===2){const r=await Ta(e,"Mark as trophy");if(!r)return;s=r.pages,a=r.pages.length===1}s.forEach(r=>{o.trophyPages[r]={isSingle:a,pages:[...s]}});const n=a?"single":"double";p(`Page${s.length>1?"s":""} marked as trophy (${n})`,"success")}try{await g.saveTrophyPages(o.manga.id,o.chapter.number,o.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}Te(),La()}function La(){const e=document.getElementById("trophy-btn");if(e){const t=xa();e.classList.toggle("active",t),e.title=t?"Unmark trophy":"Mark as trophy"}}function Ia(){var a;if(!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode||!o.images.length)return null;const e=o.images.length;let t=1,s=!1;if(o.mode==="manga"){const n=Ls();n.length>0&&(t=Math.min(...n)+1),s=n.includes(e-1)}else{const n=document.getElementById("reader-content");if(n){const r=[...n.querySelectorAll("img")],i=n.scrollTop;let l=0;r.forEach((u,m)=>{i>=l&&(t=m+1),l+=u.offsetHeight});const c=n.scrollHeight>n.clientHeight+10,d=r.length>0&&r.every(u=>u.complete&&u.naturalHeight>0);s=c?i+n.clientHeight>=n.scrollHeight-4:d}}return s&&(t=e),{mangaId:o.manga.id,chapterNumber:o.chapter.number,volumeId:o.isVolumeMode?(a=o.volume)==null?void 0:a.id:null,currentPage:t,totalPages:e}}async function je(e=Ia()){var t,s;if(!(!e||Y.isDemo)){if(e.volumeId){try{if(await g.saveVolumeProgress(e.mangaId,e.volumeId,e.currentPage,e.totalPages),e.currentPage>=e.totalPages&&((t=o.manga)==null?void 0:t.id)===e.mangaId&&o.volume){const a=new Set(o.manga.readChapters||[]);for(const n of o.volume.chapters||[])a.add(n);o.manga.readChapters=[...a]}}catch(a){console.error("Failed to save volume progress:",a)}return}try{if(await g.updateReadingProgress(e.mangaId,e.chapterNumber,e.currentPage,e.totalPages),e.currentPage>=e.totalPages&&((s=o.manga)==null?void 0:s.id)===e.mangaId){const a=new Set(o.manga.readChapters||[]);a.add(e.chapterNumber),o.manga.readChapters=[...a]}}catch(a){console.error("Failed to save progress:",a)}}}let Fe=null;function Ba(){Fe&&clearTimeout(Fe),Fe=setTimeout(()=>{Fe=null,je()},1500)}function Lt(){var s,a,n,r,i,l,c,d,u,m,f,E,x,b,L,y,C,S,_,R,O;const e=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{o.isStreamingMode||(await je(),await Re()),o.isStreamingMode?F.go("/scrapers"):o.manga&&o.manga.id!=="gallery"?F.go(`/manga/${o.manga.id}`):F.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{F.go(o.isStreamingMode?"/scrapers":"/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var w;(w=document.getElementById("reader-settings"))==null||w.classList.toggle("hidden")}),(r=document.getElementById("close-settings-btn"))==null||r.addEventListener("click",()=>{var w;(w=document.getElementById("reader-settings"))==null||w.classList.add("hidden")}),(i=document.getElementById("single-page-btn"))==null||i.addEventListener("click",()=>{if(o.singlePageMode){const w=ie();let $=0;for(let A=0;A<w.length;A++)if(w[A].includes(o.currentPage)){$=A;break}o.singlePageMode=!1,o.currentPage=$}else{const $=ie()[o.currentPage];o.singlePageMode=!0,o.currentPage=$?$[0]:0}localStorage.setItem("reader_single_page",o.singlePageMode?"1":"0"),Ge()}),(l=document.getElementById("trophy-btn"))==null||l.addEventListener("click",()=>{qr()}),e.querySelectorAll("[data-mode]").forEach(w=>{w.addEventListener("click",()=>{var D,V;const $=w.dataset.mode;let A=ns();if(o.mode=$,localStorage.setItem("reader_mode",o.mode),$==="webtoon")o.currentPage=A;else if(o.singlePageMode)o.currentPage=A;else{const N=ie();let W=0;for(let K=0;K<N.length;K++)if(N[K].includes(A)){W=K;break}o.currentPage=W}(D=o.manga)!=null&&D.id&&((V=o.chapter)!=null&&V.number)&&Re(),Ge(),$==="webtoon"&&setTimeout(()=>{const N=document.getElementById("reader-content");if(N){const W=N.querySelectorAll("img");W[A]&&W[A].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),e.querySelectorAll("[data-direction]").forEach(w=>{w.addEventListener("click",async()=>{var $,A;o.direction=w.dataset.direction,localStorage.setItem("reader_direction",o.direction),($=o.manga)!=null&&$.id&&((A=o.chapter)!=null&&A.number)&&await Re(),Ge()})}),(c=document.getElementById("first-page-single"))==null||c.addEventListener("change",async w=>{o.firstPageSingle=w.target.checked,await Re(),Te()}),(d=document.getElementById("last-page-single"))==null||d.addEventListener("change",async w=>{var $,A;o.lastPageSingle=w.target.checked,await Re(),o.lastPageSingle&&(($=o.manga)!=null&&$.id)&&((A=o.chapter)!=null&&A.number)?await Ma():(o.nextChapterImage=null,o.nextChapterNum=null),Te()}),(u=document.getElementById("zoom-slider"))==null||u.addEventListener("input",w=>{o.zoom=parseInt(w.target.value);const $=document.getElementById("reader-content");$&&($.style.zoom=`${o.zoom}%`)});const t=document.getElementById("page-slider");if(t&&(t.addEventListener("input",w=>{const $=parseInt(w.target.value),A=document.getElementById("page-indicator");A&&(o.singlePageMode?A.textContent=`${$+1} / ${o.images.length}`:A.textContent=`${$+1} / ${ie().length}`)}),t.addEventListener("change",w=>{o.currentPage=parseInt(w.target.value),Te()})),o.mode==="manga"){const w=document.getElementById("reader-content");w==null||w.addEventListener("click",$=>{var N;if($.target.closest("button, a, .link-overlay"))return;const A=w.getBoundingClientRect(),V=($.clientX-A.left)/A.width;V<.3?rs():V>.7?yt():(o.showControls=!o.showControls,(N=document.querySelector(".reader"))==null||N.classList.toggle("controls-hidden",!o.showControls))})}document.addEventListener("keydown",_a),(m=document.getElementById("prev-chapter-btn"))==null||m.addEventListener("click",()=>It(-1)),(f=document.getElementById("next-chapter-btn"))==null||f.addEventListener("click",()=>It(1)),o.mode==="webtoon"&&((E=document.getElementById("reader-content"))==null||E.addEventListener("click",()=>{var w;o.showControls=!o.showControls,(w=document.querySelector(".reader"))==null||w.classList.toggle("controls-hidden",!o.showControls)}),(x=document.getElementById("reader-content"))==null||x.addEventListener("scroll",Ba,{passive:!0})),(b=document.getElementById("rotate-btn"))==null||b.addEventListener("click",async()=>{const w=jt();if(!(!w||!o.manga||!o.chapter))try{p("Rotating...","info");const $=await ht().rotate(w);$.images&&(await zt($.images),p("Page rotated","success"))}catch($){p("Rotate failed: "+$.message,"error")}}),(L=document.getElementById("swap-btn"))==null||L.addEventListener("click",async()=>{const $=ie()[o.currentPage];if(!$||$.length!==2||!o.manga||!o.chapter){p("Select a spread with 2 pages to swap","info");return}const A=it(o.images[$[0]]),D=it(o.images[$[1]]);if(!(!A||!D))try{p("Swapping...","info");const V=await ht().swap(A,D);V.images&&(await zt(V.images),p("Pages swapped","success"))}catch(V){p("Swap failed: "+V.message,"error")}}),(y=document.getElementById("split-btn"))==null||y.addEventListener("click",async()=>{const w=jt();if(!w||!o.manga||!o.chapter||!confirm("Split this page into halves? This is permanent."))return;const $=document.getElementById("split-btn");try{p("Preparing to split...","info"),$&&($.disabled=!0),o.images=[],o.loading=!0,e.innerHTML=Oe(),await new Promise(D=>setTimeout(D,2e3)),p("Splitting page...","info");const A=await ht().split(w);$&&($.disabled=!1),await qe(o.manga.id,Gs(),o.versionUrl),e.innerHTML=Oe(),Lt(),Te(),A.warning?p(A.warning,"warning"):p("Page split into halves","success")}catch(A){$&&($.disabled=!1),p("Split failed: "+A.message,"error"),await qe(o.manga.id,Gs(),o.versionUrl),e.innerHTML=Oe(),Lt()}}),(C=document.getElementById("delete-page-btn"))==null||C.addEventListener("click",async()=>{const w=jt();if(!(!w||!o.manga||!o.chapter)&&confirm(`Delete page "${w}" permanently? This cannot be undone.`))try{p("Deleting...","info");const $=await ht().remove(w);$.images&&(await zt($.images),p("Page deleted","success"))}catch($){p("Delete failed: "+$.message,"error")}}),(S=document.getElementById("favorites-btn"))==null||S.addEventListener("click",async()=>{try{const A=await g.getFavorites();o.allFavorites=A,o.favoriteLists=Object.keys(A.favorites||A||{})}catch(A){console.error("Failed to load favorites",A),p("Failed to load favorites","error");return}let $=[ns()];if(o.mode==="manga"&&!o.singlePageMode){const D=ie()[o.currentPage];D&&Array.isArray(D)?$=D:D&&D.pages&&($=D.pages)}if($.length>1){const A=await Ta($,"Select Page for Favorites");if(!A)return;$=A.pages}Or($)}),(_=document.getElementById("version-btn"))==null||_.addEventListener("click",()=>{Nr()}),(R=document.getElementById("fullscreen-btn"))==null||R.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{p("Fullscreen not supported","info")})}),(O=document.getElementById("stream-add-lib-btn"))==null||O.addEventListener("click",async()=>{var A;const w=document.getElementById("stream-add-lib-btn");if(!((A=o.manga)!=null&&A._streamUrl)){p("No URL to add","error");return}const $=w.innerHTML;w.innerHTML=h("loader",{spin:!0}),w.disabled=!0;try{const D=await g.addBookmark(o.manga._streamUrl);if(!D.jobId)throw new Error("No job ID returned");p("Adding to library...","info");const V=setInterval(async()=>{var N;try{const K=(await g.getQueueHistory(20)).find(se=>se.id===D.jobId);K&&(K.status==="completed"?(clearInterval(V),(N=K.result)!=null&&N.bookmark&&(p("Added to library!","success"),w.innerHTML=h("check"),w.title="Added! Click to view",w.disabled=!1,w.onclick=()=>{F.go(`/manga/${K.result.bookmark.id}`)})):K.status==="failed"&&(clearInterval(V),p("Failed to add: "+(K.error||"Unknown error"),"error"),w.innerHTML=$,w.disabled=!1))}catch{}},1500)}catch(D){p("Failed to add: "+D.message,"error"),w.innerHTML=$,w.disabled=!1}}),document.body.classList.add("reader-active")}function as(e){return-(1e3+(Number(e==null?void 0:e.number)||0))}async function Rr(e,t){const s=as(t.volume);try{let a=await g.getChapterSettings(e,s);!Bt(a)&&t.prev&&(a=await g.getChapterSettings(e,as(t.prev))),Bt(a)&&os(a)}catch(a){console.warn("Failed to load volume settings",a)}try{o.trophyPages=await g.getTrophyPages(e,s)||{}}catch{o.trophyPages={}}}function ht(){const e=o.manga.id;if(o.isVolumeMode){const s=o.volume.id;return{rotate:a=>g.rotateVolumePage(e,s,a,90),swap:(a,n)=>g.swapVolumePages(e,s,a,n),split:a=>g.splitVolumePage(e,s,a),remove:a=>g.deleteVolumePage(e,s,a)}}const t=o.chapter.number;return{rotate:s=>g.rotatePage(e,t,s,90,o.versionUrl),swap:(s,a)=>g.swapPages(e,t,s,a,o.versionUrl),split:s=>g.splitPage(e,t,s,o.versionUrl),remove:s=>g.deletePage(e,t,s,o.versionUrl)}}function Gs(){return o.isVolumeMode?`volume:${o.volume.id}`:o.chapter.number}function it(e){var n;const t=typeof e=="string"?e:(e==null?void 0:e.url)||((n=e==null?void 0:e.urls)==null?void 0:n[0]);if(!t)return null;const a=t.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function jt(){const e=Ls();return e.length===0?null:it(o.images[e[0]])}async function zt(e){var s,a;(s=o.manga)!=null&&s.id&&((a=o.chapter)!=null&&a.number)&&!o.isStreamingMode&&!o.isVolumeMode&&Ar.refreshOfflineChapter(o.manga.id,o.chapter.number).then(n=>{n&&console.log("[Reader] Refreshed offline copy after page edit")}).catch(n=>console.warn("[Reader] Offline refresh failed:",n));const t=Date.now();if(o.images=e.map(n=>{const r=typeof n=="string"?n:n==null?void 0:n.url;if(!r)return n;const i=r+(r.includes("?")?"&":"?")+`_t=${t}`;return typeof n=="string"?i:{...n,url:i}}),o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.min(o.currentPage,o.images.length-1);else{const n=ie();o.currentPage=Math.min(o.currentPage,n.length-1)}o.currentPage=Math.max(0,o.currentPage),Te()}async function Ma(){var e,t;if(!(!((e=o.manga)!=null&&e.id)||!((t=o.chapter)!=null&&t.number)||o.isVolumeMode))try{const s=await g.getNextChapterPreview(o.manga.id,o.chapter.number);o.nextChapterImage=s.firstImage||null,o.nextChapterNum=s.nextChapter||null}catch{o.nextChapterImage=null,o.nextChapterNum=null}}async function Dr(){var r,i;if(!((r=o.manga)!=null&&r.id)||!((i=o.chapter)!=null&&i.number)||o.isCollectionMode||o.isVolumeMode)return;const t=[...o.manga.downloadedChapters||[]].sort((l,c)=>l-c),s=t.indexOf(o.chapter.number);if(s<0||s>=t.length-1)return;const a=t[s+1],n=o.manga.id;if(!(o._preloadCache&&o._preloadCache.chapterNum===a&&o._preloadCache.mangaId===n))try{const c=(o.manga.downloadedVersions||{})[a]||[],d=Array.isArray(c)?c[0]:c,u=d?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(d)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,f=(await g.get(u)).images||[];if(f.length===0)return;const E=f.map(x=>{const b=new Image,L=typeof x=="string"?x:x.url;return L&&(b.src=L),b});o._preloadCache={chapterNum:a,mangaId:n,images:f,imageObjects:E,versionUrl:d},console.log(`[Reader] Preloaded ${f.length} images for chapter ${a}`)}catch(l){console.warn("[Reader] Failed to preload next chapter:",l)}}function Aa(e,t,s=o.manga,a=[],n={}){return new Promise(r=>{const i=document.createElement("div");i.className="version-modal-overlay",i.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${t} has ${e.length} versions</h3>
                <p>${n.allowKeep?"Switch version, or keep one and delete the rest:":"Select which version to read:"}</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const l=i.querySelector(".version-list");e.forEach((c,d)=>{const u=document.createElement("button");u.className="version-item";const m=n.current&&n.current===c;m&&u.classList.add("current");const f=(Cs(c,s)||`Version ${d+1}`)+(m?" (reading)":""),E=a.find(y=>y.url===c),x=[];if(E!=null&&E.imageCount&&x.push(`${E.imageCount} pages`),E!=null&&E.folder&&x.push(E.folder),u.innerHTML=`<span class="version-item-title"></span>${x.length?'<span class="version-item-meta"></span>':""}`,u.querySelector(".version-item-title").textContent=f,x.length&&(u.querySelector(".version-item-meta").textContent=x.join(" · ")),u.title=c,u.addEventListener("click",()=>{i.remove(),r(c)}),!n.allowKeep){l.appendChild(u);return}const b=document.createElement("div");b.className="version-item-row",b.appendChild(u);const L=document.createElement("button");L.className="version-item-keep",L.textContent="Keep only",L.title="Delete every other downloaded version of this chapter",L.addEventListener("click",()=>{i.remove(),r({keep:c})}),b.appendChild(L),l.appendChild(b)}),i.querySelector(".version-cancel").addEventListener("click",()=>{i.remove(),r(null)}),i.addEventListener("click",c=>{c.target===i&&(i.remove(),r(null))}),document.body.appendChild(i)})}async function Nr(){if(!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode)return;const e=o.chapter.number,t=xs(e);if(t.length<2)return;let s=[];try{s=(await g.getChapterVersions(o.manga.id,e)).versions||[]}catch{}const a=await Aa(t,e,o.manga,s,{current:o.versionUrl,allowKeep:!0});if(a){if(typeof a=="string"){a!==o.versionUrl&&(await je(),F.go(`/read/${o.manga.id}/${e}?version=${encodeURIComponent(a)}`));return}a.keep&&await Fr(e,a.keep,t)}}async function Fr(e,t,s){var l;const a=s.filter(c=>c!==t),n=Cs(t)||"this version";if(!confirm(`Keep only "${n}" and delete the other ${a.length} downloaded version${a.length>1?"s":""} of chapter ${e}?`))return;const r=o.manga.id;let i=0;for(const c of a)try{await g.deleteChapterVersion(r,e,c)}catch(d){i++,p("Failed to delete a version: "+d.message,"error")}i===0&&p("Other versions deleted","success");try{const c=await g.getBookmark(r);((l=o.manga)==null?void 0:l.id)===r&&(o.manga=c)}catch{}t!==o.versionUrl?F.go(`/read/${r}/${e}?version=${encodeURIComponent(t)}`):Ge()}function Or(e){if(!o.manga||!o.chapter)return;const t=e.map(c=>{const d=it(o.images[c]);return d?{filename:d}:null}).filter(Boolean),s=c=>{if(!o.allFavorites||!o.allFavorites.favorites)return-1;const d=o.allFavorites.favorites[c];if(!Array.isArray(d))return-1;for(let u=0;u<d.length;u++){const m=d[u];if(m.mangaId===o.manga.id&&m.chapterNum===o.chapter.number&&m.imagePaths)for(const f of m.imagePaths){const E=typeof f=="string"?f:(f==null?void 0:f.filename)||(f==null?void 0:f.path);for(const x of t)if(x&&x.filename===E)return u}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";o.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',o.favoriteLists.forEach(c=>{const u=s(c)!==-1;n+=`
                <button class="page-picker-option list-option ${u?"active-list":""}" data-list="${c}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${c}</span>
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
    `,a.appendChild(r),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),ss()}),a.addEventListener("click",c=>{c.target===a&&(a.remove(),ss())}),a.querySelectorAll(".list-option").forEach(c=>{c.addEventListener("click",async()=>{const d=c.dataset.list,u=s(d),m=u!==-1;c.style.opacity="0.5",c.style.pointerEvents="none";try{if(m){await g.removeFavoriteItem(d,u);const f=await g.getFavorites();o.allFavorites=f,c.classList.remove("active-list"),c.querySelector("span:last-child").innerHTML=h("plus")}else{const f=e.length>1?"double":"single",E={mangaId:o.manga.id,chapterNum:o.chapter.number,title:`${o.manga.alias||o.manga.title} Ch.${o.chapter.number} p${e[0]+1}`,imagePaths:t,displayMode:f,displaySide:o.direction==="rtl"?"right":"left"};await g.addFavoriteItem(d,E);const x=await g.getFavorites();o.allFavorites=x,c.classList.add("active-list"),c.querySelector("span:last-child").innerHTML=h("check")}}catch(f){console.error(f)}finally{c.style.opacity="1",c.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function Ta(e,t){return new Promise(s=>{const[a,n]=e,r=o.images[a],i=o.images[n],l=typeof r=="string"?r:r==null?void 0:r.url,c=typeof i=="string"?i:i==null?void 0:i.url,d=o.direction==="rtl",u=d?n:a,m=d?a:n,f=d?c:l,E=d?l:c,x=document.createElement("div");x.className="page-picker-overlay",x.innerHTML=`
            <div class="page-picker-modal">
                <h3>${t}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${u+1}">
                        <img src="${f}" alt="Page ${u+1}">
                        <span class="page-picker-label">Page ${u+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${m+1}">
                        <img src="${E}" alt="Page ${m+1}">
                        <span class="page-picker-label">Page ${m+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    ${h("columns-2")} Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const b=L=>{x.remove(),s(L)};x.querySelectorAll(".page-picker-option").forEach(L=>{L.addEventListener("click",()=>{const y=L.dataset.choice;y==="left"?b({pages:[u]}):y==="right"?b({pages:[m]}):y==="both"&&b({pages:e})})}),x.querySelector(".page-picker-cancel").addEventListener("click",()=>b(null)),x.addEventListener("click",L=>{L.target===x&&b(null)}),document.body.appendChild(x)})}function ns(){if(o.mode==="webtoon"){const e=document.getElementById("reader-content");if(e){const t=e.querySelectorAll("img");if(t.length>0){const s=e.scrollTop;if(s>10){let a=0;for(let n=0;n<t.length;n++){const r=t[n].offsetHeight;if(a+r>s)return n;a+=r}}}}return 0}else{if(o.singlePageMode)return o.currentPage;{const t=ie()[o.currentPage];return t&&t.length>0?t[0]:0}}}function _a(e){var t;if(!(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")){if(e.key==="Escape"){const s=(t=o.manga)==null?void 0:t.id;Promise.all([je(),Re()]).finally(()=>{s&&F.go(`/manga/${s}`)});return}if(o.mode==="manga")e.key==="ArrowLeft"?o.direction==="rtl"?yt():rs():e.key==="ArrowRight"?o.direction==="rtl"?rs():yt():e.key===" "&&(e.preventDefault(),yt());else if(o.mode==="webtoon"&&e.key===" "){e.preventDefault();const s=document.getElementById("reader-content");if(s){const a=s.clientHeight*.8;s.scrollBy({top:e.shiftKey?-a:a,behavior:"smooth"})}}}}function yt(){const e=ie(),t=o.singlePageMode?o.images.length-1:e.length-1;if(o.currentPage<t)o.currentPage++,Te();else{const s=e[o.currentPage],a=s&&s.type==="link";je(),a&&(o.navigationDirection="next-linked"),It(1)}}function rs(){o.currentPage>0?(o.currentPage--,Te()):It(-1)}function Te(){const e=document.getElementById("reader-content");if(e){e.innerHTML=o.isCollectionMode?Ea():o.mode==="webtoon"?Sa():Ca();const t=document.getElementById("page-indicator");t&&(o.singlePageMode?t.textContent=`${o.currentPage+1} / ${o.images.length}`:t.textContent=`${o.currentPage+1} / ${ie().length}`);const s=document.getElementById("page-slider");s&&(s.value=o.currentPage,s.max=o.singlePageMode?o.images.length-1:ie().length-1),La(),ss(),o.mode==="manga"&&Ba()}}function Ge(){const e=document.getElementById("app");e&&(e.innerHTML=Oe(),Lt())}async function It(e){var r,i;if(console.log("[Nav] navigateChapter called with delta:",e),o.isStreamingMode)return;if(!o.manga||!o.chapter){console.log("[Nav] early return - no manga or chapter");return}if(await je(),await Re(),o.isVolumeMode){const l=e>0?(r=o.volume)==null?void 0:r.next:(i=o.volume)==null?void 0:i.prev;l?(o.navigationDirection=e<0?"prev":null,F.go(`/read/${o.manga.id}/volume/${l.id}`)):p(e>0?"Last volume":"First volume","info");return}const s=[...o.manga.downloadedChapters||[]].sort((l,c)=>l-c),a=s.indexOf(o.chapter.number),n=a+e;if(console.log("[Nav]",{delta:e,chapterNumber:o.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length){o.navigationDirection||(o.navigationDirection=e<0?"prev":null);const l=s[n],d=(o.manga.downloadedVersions||{})[l]||[],u=Array.isArray(d)?d[0]:d,m=u?`?version=${encodeURIComponent(u)}`:"";console.log("[Nav] Calling router.go with:",`/read/${o.manga.id}/${l}${m}`),F.go(`/read/${o.manga.id}/${l}${m}`)}else p(e>0?"Last chapter":"First chapter","info")}async function qe(e,t,s){var a,n,r,i,l;console.log("[Reader] loadData called:",{mangaId:e,chapterNum:t,versionUrl:s});try{o.mode=localStorage.getItem("reader_mode")||"manga",o.direction=localStorage.getItem("reader_direction")||"rtl",o.singlePageMode=localStorage.getItem("reader_single_page")!=="0",o.firstPageSingle=!0,o.lastPageSingle=!1,o.versionUrl=null,o.isVolumeMode=!1,o.volume=null;let c=null;if(String(t).startsWith("volume:")){const d=String(t).slice(7);o.isVolumeMode=!0,o.isCollectionMode=!1,o.isGalleryMode=!1,o.isStreamingMode=!1;const u=await g.getBookmark(e);o.manga=u;const m=await g.getVolumePages(e,d);o.volume={...m.volume,prev:m.prev||null,next:m.next||null},o.chapter={number:as(m.volume),title:m.volume.name,volumeId:d},o.images=m.images||[],c=m.progress&&!m.progress.finished?m.progress:null,await Rr(e,m)}else if(e==="gallery"){const d=decodeURIComponent(t),m=((a=(await g.getFavorites()).favorites)==null?void 0:a[d])||[];o.images=[];for(const f of m){const E=f.imagePaths||[],x=[];for(const b of E){let L;typeof b=="string"?L=b:b&&typeof b=="object"&&(L=b.filename||b.path||b.name||b.url,L&&L.includes("/")&&(L=L.split("/").pop()),L&&L.includes("\\")&&(L=L.split("\\").pop())),L&&x.push(`/api/public/chapter-images/${f.mangaId}/${f.chapterNum}/${encodeURIComponent(L)}`)}x.length>0&&o.images.push({urls:x,displayMode:f.displayMode||"single",displaySide:f.displaySide||"left"})}o.manga={id:"gallery",title:d,alias:d},o.chapter={number:"Gallery"},o.isGalleryMode=!0,o.isCollectionMode=!0,o.images.length===0&&p("Gallery is empty","warning")}else if(e==="trophies"){const d=t;let u=[],m="Trophies";if(d.startsWith("series-")){const f=d.replace("series-",""),x=(await store.loadSeries()).find(y=>y.id===f);m=x?x.alias||x.title:"Series Trophies";const L=(await store.loadBookmarks()).filter(y=>y.seriesId===f);for(const y of L){const C=await g.getTrophyPagesAll(y.id);for(const S in C)if(!(parseFloat(S)<0))for(const _ in C[S]){const R=C[S][_],w=(await g.getChapterImages(y.id,S)).images[_],$=typeof w=="string"?w.split("/").pop():(w==null?void 0:w.filename)||(w==null?void 0:w.path);u.push({mangaId:y.id,chapterNum:S,imagePaths:[{filename:$}],displayMode:R.isSingle?"single":"double",displaySide:"left"})}}}else{const f=await g.getBookmark(d);m=f?f.alias||f.title:"Manga Trophies";const E=await g.getTrophyPagesAll(d);for(const x in E)if(!(parseFloat(x)<0))for(const b in E[x]){const L=E[x][b],C=(await g.getChapterImages(d,x)).images[b],S=typeof C=="string"?C.split("/").pop():(C==null?void 0:C.filename)||(C==null?void 0:C.path);u.push({mangaId:d,chapterNum:x,imagePaths:[{filename:decodeURIComponent(S)}],displayMode:L.isSingle?"single":"double",displaySide:"left"})}}o.images=u.map(f=>{const E=f.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${f.mangaId}/${f.chapterNum}/${encodeURIComponent(E)}`],displayMode:f.displayMode,displaySide:f.displaySide}}),o.manga={id:"trophies",title:m,alias:m},o.chapter={number:"🏆"},o.isCollectionMode=!0,o.isGalleryMode=!1}else if(e==="stream"){o.isStreamingMode=!0,o.isCollectionMode=!1,o.isGalleryMode=!1,o.singlePageMode=!0;const d=sessionStorage.getItem("streamPreviewUrl"),u=sessionStorage.getItem("streamPreviewScraper"),m=sessionStorage.getItem("streamPreviewTitle")||"Preview";o.manga={id:"stream",title:m,alias:m,_streamUrl:d},o.chapter={number:1},o.images=[],d?Ur(d,u):p("No stream URL found","error")}else{o.isGalleryMode=!1;const d=await g.getBookmark(e);o.manga=d,console.log("[Reader] manga loaded, finding chapter..."),o.chapter=((n=d.chapters)==null?void 0:n.find(m=>m.number===parseFloat(t)))||{number:parseFloat(t)};const u=parseFloat(t);if(o._preloadCache&&o._preloadCache.mangaId===e&&o._preloadCache.chapterNum===u)console.log("[Reader] Using preloaded images for chapter",t),o.images=o._preloadCache.images||[],o.versionUrl=s||o._preloadCache.versionUrl||null,o._preloadCache=null;else{o.versionUrl=s||null;const m=s?`/bookmarks/${e}/chapters/${t}/reader-images?version=${encodeURIComponent(s)}`:`/bookmarks/${e}/chapters/${t}/reader-images`,f=await g.get(m);console.log("[Reader] images loaded, count:",(r=f.images)==null?void 0:r.length),o.images=f.images||[]}try{const m=await g.getChapterSettings(e,t);if(Bt(m))os(m);else try{const E=[...o.manga.downloadedChapters||[]].sort((C,S)=>C-S),x=parseFloat(t),b=E.indexOf(x),L=[];if(b!==-1){for(let C=b-1;C>=0;C--)L.push(E[C]);for(let C=b+1;C<E.length;C++)L.push(E[C])}const y=12;for(const C of L.slice(0,y)){const S=await g.getChapterSettings(e,C);if(Bt(S)){os(S),console.log("[Reader] Inherited settings from chapter",C);break}}}catch(f){console.warn("Failed to inherit chapter settings",f)}}catch(m){console.warn("Failed to load chapter settings",m)}try{const m=await g.getTrophyPages(e,t);o.trophyPages=m||{}}catch(m){console.warn("Failed to load trophy pages",m)}try{const m=await g.getFavorites();o.allFavorites=m,o.favoriteLists=Object.keys(m.favorites||m||{})}catch(m){console.warn("Failed to load favorites",m)}}if(o.isStreamingMode)o.currentPage=0;else{const d=parseFloat(t),u=o.isVolumeMode?c:(l=(i=o.manga)==null?void 0:i.readingProgress)==null?void 0:l[d];if(u&&u.page<u.totalPages)if(o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.max(0,u.page-1);else{const m=Math.max(0,u.page-1),f=ie();let E=0;for(let x=0;x<f.length;x++){const b=f[x],L=Array.isArray(b)?b:b.pages||[];if(L.includes(m)||L[0]>=m){E=x;break}E=x}o.currentPage=E}else o.currentPage=0,o._resumeScrollToPage=u.page-1;else o.currentPage=0}}catch(c){console.error("Error loading chapter:",c),p("Failed to load chapter","error")}if(!o.isStreamingMode){if(o.navigationDirection==="prev"&&o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.max(0,o.images.length-1);else{const c=ie();o.currentPage=Math.max(0,c.length-1)}else if(o.navigationDirection==="next-linked"&&o.mode==="manga"&&o.images.length>1)if(o.singlePageMode)o.currentPage=1;else{const c=ie();let d=0;for(let u=0;u<c.length;u++){const m=c[u];if((Array.isArray(m)?m:m.pages||[]).includes(1)){d=u;break}}o.currentPage=d}}o.navigationDirection=null,o.lastPageSingle&&!o.isStreamingMode&&await Ma(),o.loading=!1,Ge(),o.isStreamingMode||Dr(),o.mode==="webtoon"&&o._resumeScrollToPage&&setTimeout(()=>{const c=document.getElementById("reader-content");if(c){const d=c.querySelectorAll("img");d[o._resumeScrollToPage]&&d[o._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete o._resumeScrollToPage},300)}async function Ur(e,t){o._streamAbortController&&o._streamAbortController.abort(),o._streamAbortController=new AbortController;const{signal:s}=o._streamAbortController;try{let a="/api/scrapers/preview-images-stream?";t&&(a+=`scraper=${encodeURIComponent(t)}&`),a+=`url=${encodeURIComponent(e)}`;const n=localStorage.getItem("manga_auth_token"),r={};n&&(r.Authorization=`Bearer ${n}`),console.log("[Reader] Starting stream from:",a);const i=await fetch(a,{headers:r,signal:s});if(!i.ok)throw new Error(`Failed to start stream: ${i.statusText}`);const l=i.body.getReader(),c=new TextDecoder;let d="";for(;;){const{value:u,done:m}=await l.read();if(m||s.aborted)break;d+=c.decode(u,{stream:!0});const f=d.split(`

`);d=f.pop();let E=!1;for(const x of f)if(x.startsWith("data: ")){const b=x.substring(6);try{const L=JSON.parse(b);if(L.type==="metadata")o.manga.title=L.title,o.manga.alias=L.title,Ge();else if(L.type==="image"){const y=`/api/scrapers/proxy-cover?url=${encodeURIComponent(L.url)}`;o.images.push(y),E=!0}else if(L.type==="error")p("Stream error: "+L.message,"error");else if(L.type==="done")break}catch(L){console.error("Parse error for SSE data:",L)}}E&&Te()}}catch(a){a.name!=="AbortError"&&(console.error("Preview stream error:",a),p("Stream failed: "+a.message,"error"))}finally{o._streamAbortController&&o._streamAbortController.signal===s&&(o._streamAbortController=null)}}async function Vr(e=[]){console.log("[Reader] mount called with params:",e);let[t,s]=e,a=null;if(s&&s.includes("?")){const[r,i]=s.split("?");s=r,a=new URLSearchParams(i).get("version")}else{const r=window.location.hash.split("?")[1];r&&(a=new URLSearchParams(r).get("version"))}if(console.log("[Reader] mangaId:",t,"chapterNum:",s,"urlVersion:",a),!t||!s){F.go("/");return}const n=document.getElementById("app");if(o.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),o.images=[],o.singlePageMode=!1,o._resumeScrollToPage=null,o.nextChapterImage=null,o.nextChapterNum=null,n.innerHTML=Oe(),s==="volume"&&e[2])await qe(t,`volume:${e[2]}`);else if(a)await qe(t,s,decodeURIComponent(a));else try{const r=await g.getBookmark(t),i=r.downloadedVersions||{},l=new Set(r.deletedChapterUrls||[]),c=i[parseFloat(s)];let d=[];if(Array.isArray(c)&&(d=c.filter(u=>!l.has(u))),d.length>1){let u=[];try{u=(await g.getChapterVersions(t,s)).versions||[]}catch{}const m=await Aa(d,s,r,u);if(m===null){F.go(`/manga/${t}`);return}await qe(t,s,m)}else d.length===1?await qe(t,s,d[0]):await qe(t,s)}catch(r){console.log("[Reader] Error in version check, falling back:",r),await qe(t,s)}if(n.innerHTML=Oe(),console.log("[Reader] render called, loading:",o.loading,"manga:",!!o.manga,"images:",o.images.length),Lt(),o.mode==="webtoon"&&o._resumeScrollToPage!=null){const r=o._resumeScrollToPage;o._resumeScrollToPage=null,setTimeout(()=>{const i=document.getElementById("reader-content");if(i){const l=i.querySelectorAll("img");l[r]&&l[r].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function Hr(){console.log("[Reader] unmount called"),o._streamAbortController&&(o._streamAbortController.abort(),o._streamAbortController=null),Fe&&(clearTimeout(Fe),Fe=null);const e=Ia(),t=Pa();document.body.classList.remove("reader-active"),document.removeEventListener("keydown",_a),o.manga=null,o.chapter=null,o.versionUrl=null,o.images=[],o.loading=!0,o.singlePageMode=!1,o.isStreamingMode=!1,o._resumeScrollToPage=null,o._preloadCache=null,await je(e),await Re(t)}function Bt(e){return!!e&&(e.mode!==void 0||e.direction!==void 0||e.firstPageSingle!==void 0||e.lastPageSingle!==void 0)}function os(e){e&&(e.mode&&(o.mode=e.mode),e.direction&&(o.direction=e.direction),e.firstPageSingle!==void 0&&(o.firstPageSingle=e.firstPageSingle),e.lastPageSingle!==void 0&&(o.lastPageSingle=e.lastPageSingle))}function Pa(){return!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode?null:{mangaId:o.manga.id,chapterNumber:o.chapter.number,settings:{mode:o.mode,direction:o.direction,firstPageSingle:o.firstPageSingle,lastPageSingle:o.lastPageSingle}}}async function Re(e=Pa()){if(!(!e||Y.isDemo))try{await g.updateChapterSettings(e.mangaId,e.chapterNumber,e.settings)}catch(t){console.error("Failed to save settings:",t)}}async function qa(e){try{const t=await g.getBookmark(e),s=t.downloadedChapters||[],a=new Set(t.readChapters||[]),n=t.readingProgress||{},r=t.downloadedVersions||{},i=[...s].sort((c,d)=>c-d);let l=null;for(const c of i){const d=n[c];if(d&&d.page<d.totalPages&&!a.has(c)){l=c;break}}if(l===null){for(const c of i)if(!a.has(c)){l=c;break}}if(l===null&&i.length>0&&(l=i[0]),l!==null){const c=r[l]||[],d=Array.isArray(c)?c[0]:c,u=d?`?version=${encodeURIComponent(d)}`:"";F.go(`/read/${e}/${l}${u}`)}else p("No downloaded chapters to read","info")}catch(t){p("Failed to continue reading: "+t.message,"error")}}const jr={mount:Vr,unmount:Hr,render:Oe,continueReading:qa},Ra="torrent-search-modal",zr=3e3;let Ws=0,bt=null;function xe(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Mt(e){if(!e)return"";const t=["B","KB","MB","GB","TB"];let s=0,a=e;for(;a>=1024&&s<t.length-1;)a/=1024,s++;return`${a<10&&s>0?a.toFixed(1):Math.round(a)} ${t[s]}`}function Qr(e){if(!e)return"";const t=Math.floor((Date.now()-new Date(e).getTime())/864e5);return t<1?"today":t<30?`${t}d`:t<365?`${Math.floor(t/30)}mo`:`${Math.floor(t/365)}y`}function Gr(e){return e?e.volume!==null&&e.volume!==void 0?e.volumeEnd?`Vol. ${e.volume}–${e.volumeEnd}`:`Vol. ${e.volume}`:e.chapter!==null&&e.chapter!==void 0?e.chapterEnd?`Ch. ${e.chapter}–${e.chapterEnd}`:`Ch. ${e.chapter}`:"":""}function Wr(e){switch(e.status){case"grabbing":return{kind:"pending",text:"Fetching the release for qBittorrent…"};case"downloading":{const t=Math.round((e.progress||0)*100);return{kind:"ok",text:`Downloading in qBittorrent${t?` · ${t}%`:""} · progress on the Queue page`,done:!0}}case"completed":return{kind:"ok",text:"Downloaded, waiting for import",done:!0};case"importing":return{kind:"ok",text:"Importing into the library…",done:!0};case"imported":return{kind:"ok",text:"Imported",done:!0};case"failed":return{kind:"error",text:`Failed: ${e.error||"unknown error"}`,done:!0,retry:!0};case"removed":return{kind:"error",text:"Removed from qBittorrent",done:!0,retry:!0};default:return{kind:"pending",text:e.status}}}function wt(){var e;(e=document.getElementById(Ra))==null||e.remove(),document.removeEventListener("keydown",Da),bt&&(bt(),bt=null)}function Da(e){e.key==="Escape"&&wt()}async function Na({query:e="",bookmarkId:t=null,bookmarkTitle:s="",library:a=null,onGrabbed:n}={}){const r=++Ws;wt();let i;try{i=await g.getTorrentStatus()}catch{i={prowlarr:!1,qbittorrent:!1}}if(r!==Ws)return;if(!i.prowlarr||!i.qbittorrent){p("Set up Prowlarr and qBittorrent under Settings > Torrents first","info");return}const l=document.createElement("div");l.id=Ra,l.className="modal open torrent-modal";const c=t?`<div class="torrent-target">Releases go to <strong>${xe(s)}</strong> and are imported as volumes when they finish.</div>`:`<div class="torrent-target">
             <label>Add to
               <select id="torrent-target-select">
                 <option value="">New series (named after the release)</option>
                 ${(a||[]).map($=>`<option value="${xe($.id)}">${xe($.alias||$.title)}</option>`).join("")}
               </select>
             </label>
           </div>`;l.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${h("download")} Find volume releases</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body">
                <form class="torrent-search-form" id="torrent-search-form">
                    <input type="text" id="torrent-query" value="${xe(e)}" placeholder="Title to search the indexers for" autocomplete="off">
                    <button type="submit" class="btn btn-primary">Search</button>
                </form>
                ${c}
                <div class="torrent-results" id="torrent-results"><div class="torrent-hint">Searches every indexer enabled in Prowlarr. Volume releases show their volume number when the name says it.</div></div>
            </div>
        </div>
    `,document.body.appendChild(l),document.addEventListener("keydown",Da),l.querySelector(".modal-overlay").addEventListener("click",wt),l.querySelector('[data-act="close"]').addEventListener("click",wt);const d=l.querySelector("#torrent-results"),u=l.querySelector("#torrent-query");let m=[];const f=new Map;let E=null;const x=($,A,D)=>{const V=d.querySelector(`.torrent-row-status[data-index="${$}"]`);V&&(V.className=`torrent-row-status ${A}`,V.textContent=D)},b=($,A,D,V)=>{const N=d.querySelector(`.torrent-grab[data-index="${$}"]`);N&&(N.textContent=A,N.disabled=!D,N.classList.toggle("btn-primary",V),N.classList.toggle("btn-secondary",!V))},L=$=>{if(Array.isArray($)){for(const[A,D]of f){let V=$.find(W=>W.hash===D.hash);if(V||(V=$.filter(W=>W.releaseTitle===D.title).sort((W,K)=>String(K.addedAt||"").localeCompare(String(W.addedAt||"")))[0]),!V)continue;D.hash=V.hash;const N=Wr(V);x(A,N.kind,N.text),N.retry?b(A,"Grab again",!0,!0):N.done&&b(A,"Grabbed",!1,!1),N.done&&(D.done=!0)}[...f.values()].some(A=>!A.done)||_()}},y=$=>L($==null?void 0:$.torrents),C=async()=>{try{const $=await g.getTorrentDownloads();L($.torrents)}catch{}},S=()=>{E||(E=setInterval(C,zr))},_=()=>{E&&(clearInterval(E),E=null)};ee.on(ae.TORRENT_UPDATE,y),bt=()=>{ee.off(ae.TORRENT_UPDATE,y),_()};const R=$=>{if(m=$,f.clear(),_(),$.length===0){d.innerHTML='<div class="torrent-hint">No releases found. Try a shorter title.</div>';return}d.innerHTML=`
            <table class="torrent-table">
                <thead><tr><th>Release</th><th>Vol.</th><th>Size</th><th>Seeds</th><th>Indexer</th><th>Age</th><th></th></tr></thead>
                <tbody>
                ${$.map((A,D)=>{var V;return`
                    <tr>
                        <td class="torrent-title" title="${xe(A.title)}">
                            <div>${xe(A.title)}${(V=A.parsed)!=null&&V.digital?' <span class="badge badge-downloaded">Digital</span>':""}${A.infoUrl?` <a href="${xe(A.infoUrl)}" target="_blank" rel="noopener" class="torrent-info-link" title="Open on the indexer">${h("globe")}</a>`:""}</div>
                            <div class="torrent-row-status" data-index="${D}"></div>
                        </td>
                        <td>${xe(Gr(A.parsed))}</td>
                        <td>${Mt(A.size)}</td>
                        <td class="${(A.seeders??0)===0?"torrent-dead":""}">${A.seeders??"?"}</td>
                        <td>${xe(A.indexer)}</td>
                        <td>${Qr(A.publishDate)}</td>
                        <td>${A.hasDownload===!1?'<span class="text-muted" title="The indexer gave no download link">No link</span>':`<button class="btn btn-sm btn-primary torrent-grab" data-index="${D}">Grab</button>`}</td>
                    </tr>`}).join("")}
                </tbody>
            </table>`,d.querySelectorAll(".torrent-grab").forEach(A=>A.addEventListener("click",()=>w(parseInt(A.dataset.index,10),A)))},O=async()=>{const $=u.value.trim();if($){d.innerHTML=`<div class="torrent-hint">${h("loader",{spin:!0})} Searching the indexers…</div>`;try{const A=await g.searchTorrents($);R(A.results||[])}catch(A){d.innerHTML=`<div class="torrent-hint error">${xe(A.message)}</div>`}}},w=async($,A)=>{var W,K;const D=m[$];if(!D)return;const V=l.querySelector("#torrent-target-select"),N=t||V&&V.value||null;A.disabled=!0,A.textContent="Sending…",x($,"pending","Sending to qBittorrent…");try{const se=await g.grabTorrent(D.id,{bookmarkId:N,newSeriesTitle:N?null:((W=D.parsed)==null?void 0:W.title)||null});f.set($,{hash:(K=se.torrent)==null?void 0:K.hash,title:D.title,done:!1}),b($,"Grabbed",!1,!1),se.torrent&&L([se.torrent]),S(),typeof n=="function"&&n(se.torrent)}catch(se){b($,"Grab again",!0,!0),x($,"error",`Failed: ${se.message}`)}};l.querySelector("#torrent-search-form").addEventListener("submit",$=>{$.preventDefault(),O()}),e?O():u.focus()}const Fa="volume-manager-modal";function Ze(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function is(){var e;(e=document.getElementById(Fa))==null||e.remove(),document.removeEventListener("keydown",Oa)}function Oa(e){e.key==="Escape"&&is()}function Kr(e){if(e.kind==="release")return`${e.source==="torrent"?"Torrent":"Archive"} release · ${e.pageCount||0} pages`;const t=(e.chapters||[]).length;return`Chapter collection · ${t} chapter${t===1?"":"s"}`}function Jr(e,{onChanged:t}={}){is();let s=[...e.volumes||[]],a=!1;const n=document.createElement("div");n.id=Fa,n.className="modal open torrent-modal",n.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${h("settings")} Manage volumes</h2>
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
    `,document.body.appendChild(n),document.addEventListener("keydown",Oa);const r=n.querySelector("#vm-body"),i=n.querySelector("#vm-delete"),l=n.querySelector("#vm-save"),c=()=>{is(),a&&typeof t=="function"&&t()};n.querySelector(".modal-overlay").addEventListener("click",c),n.querySelectorAll('[data-act="close"]').forEach(y=>y.addEventListener("click",c));const d=()=>{var y,C;r.innerHTML=s.length===0?'<div class="torrent-hint">No volumes left.</div>':`
            <div class="review-tools">
                <button type="button" class="btn btn-sm btn-secondary" id="vm-all">Select all</button>
                <button type="button" class="btn btn-sm btn-secondary" id="vm-none">Select none</button>
                <span class="torrent-hint">Edit a name or number and press Save. Deleting a release volume removes its pages from disk.</span>
            </div>
            <table class="torrent-table volume-manager-table">
                <thead><tr><th></th><th></th><th>No.</th><th>Name</th><th>Kind</th><th>Order</th><th></th></tr></thead>
                <tbody>
                ${s.map((S,_)=>`
                    <tr data-id="${Ze(S.id)}">
                        <td><input type="checkbox" class="vm-pick"></td>
                        <td>${S.cover?`<img class="vm-cover" src="${Ze(S.cover)}" alt="">`:`<span class="vm-cover vm-cover-empty">${h("book")}</span>`}</td>
                        <td><input type="number" step="any" min="0" class="vm-number" value="${S.number??""}" placeholder="–"></td>
                        <td><input type="text" class="vm-name" value="${Ze(S.name)}"></td>
                        <td class="vm-kind">${Ze(Kr(S))}</td>
                        <td class="vm-order">
                            <button type="button" class="btn-icon small vm-move" data-dir="up" title="Move up" ${_===0?"disabled":""}>${h("chevron-up")}</button>
                            <button type="button" class="btn-icon small vm-move" data-dir="down" title="Move down" ${_===s.length-1?"disabled":""}>${h("chevron-down")}</button>
                        </td>
                        <td><button type="button" class="btn-icon small danger vm-delete-one" title="Delete this volume">${h("trash-2")}</button></td>
                    </tr>`).join("")}
                </tbody>
            </table>
            <div id="vm-result"></div>`,(y=r.querySelector("#vm-all"))==null||y.addEventListener("click",()=>{r.querySelectorAll(".vm-pick").forEach(S=>{S.checked=!0}),E()}),(C=r.querySelector("#vm-none"))==null||C.addEventListener("click",()=>{r.querySelectorAll(".vm-pick").forEach(S=>{S.checked=!1}),E()}),r.querySelectorAll(".vm-move").forEach(S=>S.addEventListener("click",()=>b(S.closest("tr").dataset.id,S.dataset.dir))),r.querySelectorAll(".vm-delete-one").forEach(S=>S.addEventListener("click",()=>L([S.closest("tr").dataset.id]))),E()},u=()=>[...r.querySelectorAll("tr[data-id]")],m=()=>u().map(y=>{const C=s.find(w=>w.id===y.dataset.id),S=y.querySelector(".vm-name").value.trim(),_=y.querySelector(".vm-number").value,R=_===""?null:parseFloat(_),O={};return S&&S!==C.name&&(O.name=S),R!==null&&Number.isFinite(R)&&R!==C.number&&(O.number=R),{id:C.id,patch:O,tr:y}}).filter(y=>Object.keys(y.patch).length>0),f=()=>u().filter(y=>y.querySelector(".vm-pick").checked).map(y=>y.dataset.id),E=()=>{const y=f().length;i.disabled=y===0,i.textContent=y?`Delete ${y} selected`:"Delete selected";const C=m().length;l.disabled=C===0,l.textContent=C?`Save ${C} change${C===1?"":"s"}`:"Save changes"};r.addEventListener("input",E),r.addEventListener("change",E);const x=async()=>{const y=await g.getBookmark(e.id);s=[...(y.bookmark||y).volumes||[]],d()},b=async(y,C)=>{try{await g.reorderVolume(e.id,y,C),a=!0,await x()}catch(S){p(`Could not move: ${S.message}`,"error")}},L=async y=>{const C=s.filter(O=>y.includes(O.id));if(C.length===0)return;const S=C.filter(O=>O.kind==="release").length,_=C.length===1?`“${C[0].name}”`:`${C.length} volumes`,R=S?` ${S===C.length?C.length===1?"Its":"Their":`${S} of them are releases; their`} pages are removed from disk.`:"";if(confirm(`Delete ${_}?${R}`))try{const O=await g.bulkDeleteVolumes(e.id,y);a=!0,p(`Deleted ${O.deleted} volume${O.deleted===1?"":"s"}`,"success"),await x()}catch(O){p(`Delete failed: ${O.message}`,"error")}};i.addEventListener("click",()=>L(f())),l.addEventListener("click",async()=>{const y=m();if(y.length===0)return;l.disabled=!0,l.textContent="Saving…";const C=[];for(const S of y)try{await g.updateVolume(e.id,S.id,S.patch),a=!0}catch(_){const R=s.find(O=>O.id===S.id);C.push(`${(R==null?void 0:R.name)||S.id}: ${_.message}`)}if(C.length?p(C.join(" · "),"error"):p(`Saved ${y.length} change${y.length===1?"":"s"}`,"success"),await x(),C.length){const S=r.querySelector("#vm-result");S&&(S.innerHTML=`<ul class="task-error-list">${C.map(Ze).map(_=>`<li>${_}</li>`).join("")}</ul>`)}}),d()}const ot=50;let k={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1,mergeMode:!1,mergeSelection:new Set,mergeTargetTouched:!1,mergeTitleTouched:!1,offlineChapters:new Set,isAutoOffline:!1,volumesCollapsed:!1};const Ua=e=>`volumes_collapsed_${e}`;function Yr(e){var s;const t=localStorage.getItem(Ua(e==null?void 0:e.id));return t!==null?t==="1":(((s=e==null?void 0:e.volumes)==null?void 0:s.length)||0)>8}function Xr(e){if(!(e.autoCheck===!0))return`<button class="btn btn-secondary" id="schedule-btn">${h("alarm-clock")} Schedule</button>`;const s=e.checkSchedule==="weekly"?`${(e.checkDay||"monday").charAt(0).toUpperCase()+(e.checkDay||"monday").slice(1)} ${e.checkTime||"06:00"}`:e.checkSchedule==="daily"?`Daily ${e.checkTime||"06:00"}`:"Every 6h";return`<button class="btn btn-primary" id="schedule-btn">${h("alarm-clock")} ${s}</button>`}function Zr(e){const t=e.autoCheck===!0,s=e.checkSchedule||"daily",a=e.checkDay||"monday",n=e.checkTime||"06:00",r=e.autoDownload||!1;return`
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
  `}function ls(){var O;if(k.loading)return`
      ${he()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const e=k.manga;if(!e)return`
      ${he()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const t=e.alias||e.title,s=e.chapters||[],a=new Set(e.downloadedChapters||[]),n=new Set(e.readChapters||[]),r=new Set(s.map(w=>w.number)).size,i=new Set(e.excludedChapters||[]),l=new Set(e.deletedChapterUrls||[]),c=e.volumes||[],d=new Set;c.forEach(w=>{(w.chapters||[]).forEach($=>d.add($))});let u;k.filter==="hidden"?u=s.filter(w=>i.has(w.number)||l.has(w.url)):u=s.filter(w=>!i.has(w.number)&&!l.has(w.url));const m=u.filter(w=>!d.has(w.number));let f=[];if(k.activeVolume){const w=new Set(k.activeVolume.chapters||[]);f=u.filter($=>w.has($.number))}else f=m;const E=new Map;f.forEach(w=>{E.has(w.number)||E.set(w.number,[]),E.get(w.number).push(w)});let x=Array.from(E.entries()).sort((w,$)=>w[0]-$[0]);k.filter==="downloaded"?x=x.filter(([w])=>a.has(w)):k.filter==="not-downloaded"?x=x.filter(([w])=>!a.has(w)):k.filter==="main"?x=x.filter(([w])=>Number.isInteger(w)):k.filter==="extra"&&(x=x.filter(([w])=>!Number.isInteger(w)));const b=Math.max(1,Math.ceil(x.length/ot));k.currentPage>=b&&(k.currentPage=Math.max(0,b-1));const L=k.currentPage*ot,C=[...x.slice(L,L+ot)].reverse(),S=E.size,_=[...E.keys()].filter(w=>a.has(w)).length;n.size;let R="";if(k.activeVolume){const w=k.activeVolume;let $=null;w.local_cover?$=`/api/public/covers/${e.id}/${encodeURIComponent(w.local_cover.split(/[/\\]/).pop())}`:w.cover&&($=w.cover),R=`
      ${he()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${$?`<img src="${$}" alt="${w.name}">`:ye("book")}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${e.id}" class="text-muted" style="text-decoration:none;">← ${t}</a>
              </div>
              <h1>${Ue(w.name)}</h1>
              <div class="manga-detail-meta">
                ${w.kind==="release"?`<span class="meta-item">${w.source==="torrent"?"Torrent":"Archive"} release · ${w.pageCount} pages</span>${w.releaseName?`<span class="meta-item text-muted" title="${We(w.releaseName)}">${Ue(w.releaseName)}</span>`:""}`:""}
                <span class="meta-item">${S} Chapters</span>
                ${_>0?`<span class="meta-item downloaded">${_} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 ${w.kind==="release"?`<button class="btn btn-primary" id="read-volume-btn" data-vol-id="${w.id}">${h("play")} Read volume</button>`:""}
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${e.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${k.manageChapters?"Done Managing":`${h("plus")} Add Chapters`}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${w.id}">${h("pencil")} Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const w=e.localCover?`/api/public/covers/${e.id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover;R=`
        ${he()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${w?`<img src="${w}" alt="${t}">`:ye("book")}
              </div>
              <div class="manga-detail-info">
                <h1>${t}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${e.website||"Local"}</span>
                  <span class="meta-item" title="${r} distinct chapters across ${((O=e.chapters)==null?void 0:O.length)||0} version rows">${r} Chapters</span>
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
              ${Y.canDownload?`<button class="btn btn-secondary" id="find-volumes-btn" title="Search the torrent indexers for volume releases of this title">${h("package")} Find volumes</button>`:""}
              <button class="btn btn-secondary" id="anilist-track-btn" style="display:none;">${h("link")} Track</button>
              ${(e.volumes||[]).length===0?'<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>':""}
              ${Xr(e)}
            </div>
            ${e.description?`<p class="manga-description">${e.description}</p>`:""}
            ${k.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">${h("package")} CBZ Files (${k.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${k.cbzFiles.map($=>`
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
    ${R}
        
        ${k.activeVolume?k.manageChapters?lo(e,m):"":co(e,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${k.filter==="all"?"active":""}" data-filter="all">
                All (${E.size})
              </button>
              <button class="filter-btn ${k.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${_})
              </button>
              <button class="filter-btn ${k.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${k.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
              ${!k.activeVolume&&Y.canEdit?`
              <button class="filter-btn merge-mode-btn ${k.mergeMode?"active":""}" id="merge-mode-btn" title="Combine downloaded chapters into one, e.g. 12.1 + 12.2 + 12.3 into chapter 12">
                ${h("link")} Combine
              </button>`:""}
            </div>
          </div>

          ${k.mergeMode?ro(e):""}

          ${b>1?Ks(b):""}
          
          <div class="chapter-list">
            ${C.map(([w,$])=>oo(w,$,a,n,e)).join("")}
          </div>
          
          ${b>1?Ks(b):""}
        </div>
      ${no()}
    </div>
  `}function eo(){const e=k.manga;if(!e)return"";const t=e.alias||e.title;return`
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
  `}function to(){const e=k.manga;return e?`
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
  `:""}function so(){const e=k.manga;return e?`
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
  `:""}async function At(){var s,a;const e=document.getElementById("anilist-track-btn"),t=k.manga;if(t)try{const n=await g.anilistStatus();if(!(n!=null&&n.configured)||!(n!=null&&n.connected)||((s=k.manga)==null?void 0:s.id)!==t.id){e&&(e.style.display="none");return}const{mapping:r}=await g.anilistGetMapping(t.id);if(((a=k.manga)==null?void 0:a.id)!==t.id)return;e&&(e.style.display="",e.style.borderColor=r?"var(--accent-primary)":"",e.innerHTML=r?`${h("check")} Tracked`:`${h("link")} Track`,e.title=r?`Linked to ${r.anilist_title}`:"Link this manga to AniList"),ao(r,t)}catch(n){console.warn("Failed to load AniList state:",n),e&&(e.style.display="none")}}function ao(e,t){var n,r,i;const s=document.getElementById("anilist-tracked-view"),a=document.getElementById("anilist-search-view");if(!(!s||!a)){if(!e){s.style.display="none",s.innerHTML="",a.style.display="";return}a.style.display="none",s.style.display="",s.innerHTML=`
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
  `,(n=document.getElementById("anilist-sync-toggle"))==null||n.addEventListener("change",async l=>{try{await g.anilistSetSyncEnabled(t.id,l.target.checked),p(l.target.checked?"AniList sync enabled":"AniList sync disabled","success")}catch(c){l.target.checked=!l.target.checked,p("Failed to update sync: "+c.message,"error")}}),(r=document.getElementById("anilist-relink-btn"))==null||r.addEventListener("click",()=>{s.style.display="none",a.style.display=""}),(i=document.getElementById("anilist-unlink-btn"))==null||i.addEventListener("click",async()=>{if(confirm(`Unlink "${e.anilist_title}" from AniList?`))try{await g.anilistUnmap(t.id),p("Unlinked from AniList","success"),At()}catch(l){p("Failed to unlink: "+l.message,"error")}})}}function no(){var t,s;const e=k.manga;return`
    ${e?Zr(e):""}
    ${Po()}
    ${eo()}
    ${to()}
    ${so()}

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
  `}function Va(e,t){if(t.length===0)return"";const s=Math.min(...t),a=Math.floor(s);return!(e.chapters||[]).some(r=>r.number===a)||t.includes(a)?a:s}function ro(e){const t=[...k.mergeSelection].sort((a,n)=>a-n),s=Va(e,t);return`
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
  `}function oo(e,t,s,a,n){var K,se,v,I,T,q;const r=s.has(e),i=a.has(e),l=!Number.isInteger(e),c=((K=n.mergedChapters)==null?void 0:K[e])||null,d=((se=n.downloadedVersions)==null?void 0:se[e])||[],u=new Set(n.deletedChapterUrls||[]),m=t.filter(M=>k.filter==="hidden"?!0:!u.has(M.url)),f=!!k.activeVolume,E=n.chapterSettings||{},x=f?!0:!!((v=E[e])!=null&&v.locked);let b=m;if(f||x){const M=m.filter(U=>Array.isArray(d)?d.includes(U.url):d===U.url);b=M.length>0?M:m}b.sort((M,U)=>{const G=Array.isArray(d)?d.includes(M.url):d===M.url;return((Array.isArray(d)?d.includes(U.url):d===U.url)?1:0)-(G?1:0)});const L=((I=n.chapterFolders)==null?void 0:I[e])||[],y=L.filter(M=>!M.url),C=L.reduce((M,U)=>Math.max(M,U.imageCount),0),S=M=>M.imageCount<3||C>=6&&M.imageCount<C/2,_=M=>L.find(U=>U.url===M)||null,R=L.filter(M=>M.url&&S(M)),O=b.length>1||y.length>0,w=(T=b[0])!=null&&T.url?encodeURIComponent(b[0].url):null,$=["chapter-item",r?"downloaded":"",i?"read":"",l?"extra":""].filter(Boolean).join(" "),A=Array.isArray(d)?d:d?[d]:[],D=A.length,V=O?`
    <div class="versions-dropdown hidden" id="versions-${e}">
      ${b.map(M=>{const U=encodeURIComponent(M.url),G=A.includes(M.url),re=M.url.startsWith("local://"),z=M.title&&M.title!==`Chapter ${e}`?M.title:"",oe=z||M.releaseGroup||"Version",J=[z&&M.releaseGroup?M.releaseGroup:"",io(M.uploadedAt)].filter(Boolean).join(" · ");return`
          <div class="version-row ${G?"downloaded":""}"
               data-version-url="${U}" data-num="${e}">
            <span class="version-title" style="cursor: pointer; flex: 1;" title="${We(M.url)}">${Ue(oe)}${re?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}${J?`<span class="version-meta">${Ue(J)}</span>`:""}${(()=>{const Z=G?_(M.url):null;if(!Z)return"";const pe=S(Z);return`<span class="version-meta version-pages ${pe?"warn":""}" title="${We(Z.folder)}">${Z.imageCount} pages${pe?" - incomplete?":""}</span>`})()}</span>
            <div class="version-actions">
              ${G?`<button class="btn-icon small success" data-action="read-version" data-num="${e}" data-url="${U}">${h("play",{title:"Read"})}</button>
                   ${D>1?`<button class="btn-icon small" data-action="keep-version" data-num="${e}" data-url="${U}" title="Keep only this version (delete the other ${D-1})">${h("check",{title:"Keep only this version"})}</button>`:""}
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${e}" data-url="${U}">${h("trash-2",{title:"Delete version"})}</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${e}" data-url="${U}">${h("download",{title:"Download"})}</button>`}
              ${u.has(M.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${e}" data-url="${U}" title="Restore Version">${h("undo-2",{title:"Restore version"})}</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${e}" data-url="${U}" title="Hide Version">${h("eye-off",{title:"Hide version"})}</button>`}
            </div>
          </div>
        `}).join("")}
      ${y.map(M=>`
          <div class="version-row orphan" data-num="${e}">
            <span class="version-title" title="${We(M.folder)}">Leftover folder on disk<span class="version-meta">${Ue(M.folder)} · ${M.imageCount} pages</span></span>
            <div class="version-actions">
              <button class="btn-icon small danger" data-action="delete-folder" data-num="${e}" data-folder="${encodeURIComponent(M.folder)}">${h("trash-2",{title:"Delete this folder from disk"})}</button>
            </div>
          </div>`).join("")}
    </div>
  `:"",N=(n.excludedChapters||[]).includes(e),W=k.mergeMode&&r&&!N&&!c;return`
    <div class="chapter-group" data-chapter="${e}">
      <div class="${$}" data-num="${e}" style="${N?"opacity: 0.7":""}">
        ${k.mergeMode?`<input type="checkbox" class="merge-pick" data-num="${e}" ${k.mergeSelection.has(e)?"checked":""} ${W?"":"disabled"} title="${W?"Combine this chapter":c?"Already a combined chapter":"Only downloaded chapters can be combined"}">`:""}
        <span class="chapter-number">Ch. ${e}</span>
        <span class="chapter-title">
          ${b[0]?b[0].title!==`Chapter ${e}`?b[0].title:"":t[0].title}
          ${N?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
          ${R.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="A downloaded version of this chapter has only ${R[0].imageCount} pages">${R[0].imageCount} pages</span>`:""}
          ${y.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="${y.length} folder(s) on disk not linked to any downloaded version - open the versions list to delete">${y.length} leftover folder${y.length>1?"s":""}</span>`:""}
        </span>
        ${c?`<span class="chapter-tag merged" title="Combined from ${c.sources.map(M=>`Ch. ${M}`).join(", ")}">Combined</span>`:l?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${c&&!N?`<button class="btn-icon small" data-action="split-chapter" data-num="${e}" title="Split back into ${c.sources.map(M=>`Ch. ${M}`).join(", ")}">${h("scissors",{title:"Split"})}</button>`:""}
          ${N?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${e}" title="Restore Chapter">${h("undo-2",{title:"Restore chapter"})}</button>`:f?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${k.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${e}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${x?"locked":""}"
                        data-action="lock" data-num="${e}"
                        title="${x?"Unlock":"Lock"}">
                  ${x?h("lock",{title:"Locked"}):h("lock-open",{title:"Unlocked"})}
                </button>`}
          ${!N&&w?u.has((q=b[0])==null?void 0:q.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${e}" data-url="${w}" title="Unhide Chapter">${h("undo-2",{title:"Unhide chapter"})}</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${e}" data-url="${w}" title="Hide Chapter">${h("eye-off",{title:"Hide chapter"})}</button>`:""}
          <button class="btn-icon small ${i?"success":"muted"}"
                  data-action="read" data-num="${e}"
                  title="${i?"Mark unread":"Mark read"}">
            ${i?h("eye",{title:"Read"}):h("circle",{title:"Unread"})}
          </button>
          ${r?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${e}" data-url="${w}" title="Delete Files">${h("trash-2",{title:"Delete files"})}</button>
         <button class="btn-icon small ${k.offlineChapters.has(e)?"success":""}" data-action="offline-save" data-num="${e}" title="${k.offlineChapters.has(e)?"Remove offline copy":"Save for offline reading"}">
           ${k.offlineChapters.has(e)?h("wifi-off",{title:"Available offline"}):h("hard-drive",{title:"Save offline"})}
         </button>`:`<button class="btn-icon small ${r?"success":""}"
              data-action="download" data-num="${e}"
              title="${r?"Downloaded":"Download"}">
          ${r?h("check",{title:"Downloaded"}):h("download",{title:"Download"})}
        </button>`}
          ${O?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${e}" title="${m.length} versions, ${D} downloaded">
              ${D>1?`${D}/`:""}${m.length} ${h("chevron-down")}
            </button>
          `:""}
        </div>
      </div>
      ${V}
    </div>
  `}function io(e){if(!e)return"";const t=new Date(e);return isNaN(t.getTime())?String(e).slice(0,10):t.toISOString().slice(0,10)}function Ue(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function We(e){return Ue(e).replace(/"/g,"&quot;")}function Ks(e){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${k.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${k.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${k.currentPage+1} of ${e}</span>
      <button class="btn btn-icon" data-page="next" ${k.currentPage>=e-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${k.currentPage>=e-1?"disabled":""}>»</button>
    </div>
  `}function lo(e,t){return t.length===0?`
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
  `}function co(e,t){var i;const s=e.volumes||[];if(s.length===0)return"";const a=s.map(l=>{const c=l.chapters||[],d=c.filter(m=>t.has(m)).length,u=l.kind==="release";return`
      <div class="volume-card${u?" volume-release":""}" data-volume-id="${l.id}" title="${u?We(`Volume release · ${l.pageCount} pages${l.releaseName?` · ${l.releaseName}`:""}`):`${c.length} chapters`}">
        <div class="volume-cover">
          ${l.cover?`<img src="${l.cover}" alt="${We(l.name)}">`:ye("book")}
          <div class="volume-badges">
            ${u?`<span class="badge badge-release">${l.pageCount} pages</span>${c.length?`<span class="badge badge-chapters">${c.length} ch</span>`:""}`:`<span class="badge badge-chapters">${c.length} ch</span>${d>0?`<span class="badge badge-downloaded">${d}</span>`:""}`}
          </div>
          ${u?`<button class="volume-read-btn" data-read-volume="${l.id}" title="Read this volume">${h("play",{title:"Read"})}</button>`:""}
        </div>
        <div class="volume-info">
          <div class="volume-name">${Ue(l.name)}</div>
          <div class="volume-kind">${u?`${l.source==="torrent"?"Torrent":"Archive"} release`:"Chapter collection"}</div>
        </div>
      </div>
    `}).join(""),n=k.volumesCollapsed,r=s.reduce((l,c)=>l+(c.chapters||[]).filter(d=>t.has(d)).length,0);return`
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
        <button class="btn btn-secondary btn-small" id="manage-volumes-btn" title="Rename, renumber, reorder or delete volumes">${h("settings")} Manage</button>
        <button class="btn btn-secondary btn-small" id="add-volume-btn">${h("plus")} Add Volume</button>
      </div>
      <div class="volumes-grid" id="volumes-grid">
        ${a||(((i=e.chapters)==null?void 0:i.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function uo(){var n,r,i,l,c,d,u,m,f,E,x,b,L,y,C,S,_,R,O,w,$,A,D,V,N,W,K,se;const e=document.getElementById("app"),t=k.manga;if(!t)return;(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>F.go("/")),(r=document.getElementById("back-library-btn"))==null||r.addEventListener("click",()=>F.go("/")),e.querySelectorAll(".artist-link").forEach(v=>{v.addEventListener("click",async I=>{I.preventDefault();const T=v.dataset.artist;if(!T)return;localStorage.setItem("library_search",T),localStorage.removeItem("library_artist_filter");let q=null;try{const M=t.website;if(M&&M!=="Local"){const G=(window._scrapersList||(window._scrapersList=(await g.get("/scrapers/list")).scrapers)||[]).find(re=>re.name===M);G&&G.supportsBrowse&&(q=M)}}catch{}q?(localStorage.setItem("library_search_author",T),localStorage.setItem("library_search_author_source",q)):(localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source")),F.go("/")})}),(i=document.getElementById("continue-btn"))==null||i.addEventListener("click",()=>{qa(t.id)}),(l=document.getElementById("download-all-btn"))==null||l.addEventListener("click",()=>{const v=document.getElementById("download-all-modal");v&&v.classList.add("open")}),(c=document.getElementById("confirm-download-all-btn"))==null||c.addEventListener("click",async()=>{var v;try{p("Queueing downloads...","info");const I=document.getElementsByName("download-version-mode");let T="single";for(const M of I)M.checked&&(T=M.value);(v=document.getElementById("download-all-modal"))==null||v.classList.remove("open");const q=await g.post(`/bookmarks/${t.id}/download`,{all:!0,versionMode:T});q.chaptersCount>0?p(`Download queued: ${q.chaptersCount} versions`,"success"):p("Already have these chapters downloaded","info")}catch(I){p("Failed to download: "+I.message,"error")}}),(d=document.getElementById("check-updates-btn"))==null||d.addEventListener("click",async()=>{try{p("Checking for updates...","info"),await g.post(`/bookmarks/${t.id}/quick-check`),p("Check complete!","success")}catch(v){p("Check failed: "+v.message,"error")}}),(u=document.getElementById("schedule-btn"))==null||u.addEventListener("click",()=>{const v=document.getElementById("schedule-modal");v&&v.classList.add("open")}),(m=document.getElementById("schedule-type"))==null||m.addEventListener("change",v=>{const I=document.getElementById("schedule-day-group");I&&(I.style.display=v.target.value==="weekly"?"":"none")}),(f=document.getElementById("save-schedule-btn"))==null||f.addEventListener("click",async()=>{var v;try{const I=document.getElementById("schedule-type").value,T=document.getElementById("schedule-day").value,q=document.getElementById("schedule-time").value,M=document.getElementById("auto-download-toggle").checked;await g.updateAutoCheckSchedule(t.id,{enabled:!0,schedule:I,day:T,time:q,autoDownload:M}),k.manga.checkSchedule=I,k.manga.checkDay=T,k.manga.checkTime=q,k.manga.autoDownload=M,(v=document.getElementById("schedule-modal"))==null||v.classList.remove("open"),j([t.id]),p("Schedule updated","success")}catch(I){p("Failed to save schedule: "+I.message,"error")}}),(E=document.getElementById("disable-schedule-btn"))==null||E.addEventListener("click",async()=>{var v;try{await g.toggleAutoCheck(t.id,!1),k.manga.autoCheck=!1,k.manga.checkSchedule=null,k.manga.checkDay=null,k.manga.checkTime=null,k.manga.nextCheck=null,(v=document.getElementById("schedule-modal"))==null||v.classList.remove("open"),j([t.id]),p("Auto-check disabled","success")}catch(I){p("Failed to disable: "+I.message,"error")}}),(x=document.getElementById("refresh-btn"))==null||x.addEventListener("click",async()=>{const v=document.getElementById("refresh-btn");try{v.disabled=!0,v.innerHTML=`${h("loader",{spin:!0})} Checking...`,p("Checking for updates...","info"),await g.post(`/bookmarks/${t.id}/check`),await X(t.id),j([t.id]),p("Check complete!","success")}catch(I){p("Check failed: "+I.message,"error"),v&&(v.disabled=!1,v.innerHTML=`${h("refresh-cw")} Refresh`)}}),(b=document.getElementById("scan-folder-btn"))==null||b.addEventListener("click",async()=>{var I,T;const v=document.getElementById("scan-folder-btn");try{v.disabled=!0,v.innerHTML=`${h("loader",{spin:!0})} Scanning...`,p("Scanning folder...","info");const q=await g.scanBookmark(t.id);await X(t.id),j([t.id]);const M=((I=q.addedChapters)==null?void 0:I.length)||0,U=((T=q.removedChapters)==null?void 0:T.length)||0;M>0||U>0?p(`Scan complete: ${M} added, ${U} removed`,"success"):p("Scan complete: No changes","info")}catch(q){p("Scan failed: "+q.message,"error")}finally{v&&(v.disabled=!1,v.innerHTML=`${h("folder")} Scan Folder`)}}),document.querySelectorAll("[data-cbz-path]").forEach(v=>{v.addEventListener("click",async()=>{const I=decodeURIComponent(v.dataset.cbzPath),T=parseInt(v.dataset.cbzChapter)||1,q=v.dataset.cbzExtracted==="true",M=prompt("Enter chapter number for extraction:",String(T));if(!M)return;const U=parseFloat(M);if(isNaN(U)){p("Invalid chapter number","error");return}try{v.disabled=!0,v.textContent="Extracting...",p("Extracting CBZ...","info"),await g.extractCbz(t.id,I,U,{forceReExtract:q}),p("CBZ extracted successfully!","success"),await X(t.id),j([t.id])}catch(G){p("Extract failed: "+G.message,"error")}finally{v.disabled=!1,v.textContent=q?"Re-Extract":"Extract"}})}),(L=document.getElementById("edit-btn"))==null||L.addEventListener("click",async()=>{const v=document.getElementById("edit-manga-modal");if(v){document.getElementById("edit-alias-input").value=t.alias||"",window._selectedCoverPath=null;try{const[I,T]=await Promise.all([g.getAllArtists(),g.getAllCategories()]),q=document.getElementById("artist-list"),M=document.getElementById("category-list");window._allArtists=I,window._allCategories=T,q&&(q.innerHTML=I.map(re=>`<option value="${re}">`).join("")),M&&(M.innerHTML=T.map(re=>`<option value="${re}">`).join(""));const U=document.getElementById("edit-artist-input"),G=document.getElementById("edit-categories-input");U==null||U.addEventListener("input",()=>{const re=U.value.toLowerCase(),z=U.value.lastIndexOf(","),oe=U.value.substring(z+1).trim().toLowerCase();if(oe.length>0&&window._allArtists){const J=window._allArtists.filter(Z=>Z.toLowerCase().includes(oe));if(q&&J.length>0){const Z=z>=0?U.value.substring(0,z+1)+" ":"";q.innerHTML=J.map(pe=>`<option value="${Z}${pe}">`).join("")}}}),G==null||G.addEventListener("input",()=>{const re=G.value.lastIndexOf(","),z=G.value.substring(re+1).trim().toLowerCase();if(z.length>0&&window._allCategories){const oe=window._allCategories.filter(J=>J.toLowerCase().includes(z));if(M&&oe.length>0){const J=re>=0?G.value.substring(0,re+1)+" ":"";M.innerHTML=oe.map(Z=>`<option value="${J}${Z}">`).join("")}}})}catch(I){console.error("Failed to load artists/categories:",I)}v.classList.add("open")}}),(y=document.getElementById("save-manga-btn"))==null||y.addEventListener("click",async()=>{var v;try{const I=document.getElementById("edit-alias-input").value.trim(),T=document.getElementById("edit-artist-input").value.trim(),q=document.getElementById("edit-categories-input").value.trim(),M=T?T.split(",").map(G=>G.trim()).filter(G=>G):[],U=q?q.split(",").map(G=>G.trim()).filter(G=>G):[];await g.updateBookmark(t.id,{alias:I||null}),await g.setBookmarkArtists(t.id,M),await g.setBookmarkCategories(t.id,U),window._selectedCoverPath&&await g.setBookmarkCoverFromImage(t.id,window._selectedCoverPath),k.manga.alias=I||null,k.manga.artists=M,k.manga.categories=U,(v=document.getElementById("edit-manga-modal"))==null||v.classList.remove("open"),j([t.id]),p("Manga updated","success")}catch(I){p("Failed to update: "+I.message,"error")}}),(C=document.getElementById("change-cover-btn"))==null||C.addEventListener("click",async()=>{try{p("Loading images...","info");const v=await g.getFolderImages(t.id);if(v.length===0){p("No images found in manga folder","warning");return}const I=document.createElement("div");I.id="cover-select-modal",I.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",I.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${v.slice(0,50).map(T=>`
              <div class="cover-option" data-path="${T.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(T.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${v.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${v.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(I),document.getElementById("close-cover-modal").addEventListener("click",()=>I.remove()),I.addEventListener("click",T=>{T.target===I&&I.remove()}),I.querySelectorAll(".cover-option").forEach(T=>{T.addEventListener("click",()=>{window._selectedCoverPath=T.dataset.path;const q=document.getElementById("cover-preview");q&&(q.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),I.remove(),p("Cover selected","success")})})}catch(v){p("Failed to load images: "+v.message,"error")}}),(S=document.getElementById("delete-manga-btn"))==null||S.addEventListener("click",()=>{const v=document.getElementById("delete-manga-modal");v&&v.classList.add("open")}),(_=document.getElementById("confirm-delete-manga-btn"))==null||_.addEventListener("click",async()=>{var I,T;const v=((I=document.getElementById("delete-files-toggle"))==null?void 0:I.checked)||!1;try{await g.deleteBookmark(t.id,v),(T=document.getElementById("delete-manga-modal"))==null||T.classList.remove("open"),p("Manga deleted","success"),F.go("/")}catch(q){p("Failed to delete: "+q.message,"error")}}),(R=document.getElementById("quick-check-btn"))==null||R.addEventListener("click",async()=>{const v=document.getElementById("quick-check-btn");try{v.disabled=!0,v.innerHTML=`${h("loader",{spin:!0})} Checking...`,p("Quick checking for updates...","info");const I=await g.post(`/bookmarks/${t.id}/quick-check`);await X(t.id),j([t.id]),I.newChaptersCount>0?p(`Found ${I.newChaptersCount} new chapter(s)!`,"success"):p("No new chapters found","info")}catch(I){p("Quick check failed: "+I.message,"error")}finally{v&&(v.disabled=!1,v.innerHTML=`${h("zap")} Quick Check`)}}),(O=document.getElementById("source-label"))==null||O.addEventListener("click",async()=>{const v=document.getElementById("migrate-source-modal");if(v){v.classList.add("open");const I=document.getElementById("migrate-search-scraper");if(I&&I.options.length<=1)try{const T=await g.get("/scrapers/list");if(T.success){const q=T.scrapers.filter(M=>M.supportsSearch);I.innerHTML='<option value="all">All Sources</option>'+q.map(M=>`<option value="${M.name}">${M.name}</option>`).join(""),I.value="all"}}catch(T){console.warn("Failed to load scrapers:",T)}}});const s=async()=>{var U,G,re;const v=(G=(U=document.getElementById("migrate-search-input"))==null?void 0:U.value)==null?void 0:G.trim(),I=(re=document.getElementById("migrate-search-scraper"))==null?void 0:re.value;if(!v)return;const T=document.getElementById("migrate-search-loading"),q=document.getElementById("migrate-search-results"),M=document.getElementById("migrate-results-grid");T.style.display="block",q.style.display="none";try{const oe=(await g.get(`/scrapers/search?q=${encodeURIComponent(v)}&scraper=${encodeURIComponent(I)}`)).results||[];oe.length===0?M.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(M.innerHTML=oe.map(J=>{var pe;const Z=(pe=J.cover)!=null&&pe.startsWith("/covers/")?J.cover:J.cover?`/api/scrapers/proxy-cover?url=${encodeURIComponent(J.cover)}`:"";return`
            <div class="manga-card migrate-result-card" data-url="${J.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${Z?_e(Z,"Cover",{kind:"series",self:!0}):ye("series")}
                ${J.chapterCount?`<div class="manga-card-badges"><span class="badge badge-chapters">${J.chapterCount} ch</span></div>`:""}
              </div>
              <div class="manga-card-title" title="${J.title}" style="font-size: 0.8rem; padding: 4px;">${J.title}</div>
            </div>
          `}).join(""),M.querySelectorAll(".migrate-result-card").forEach(J=>{J.addEventListener("click",()=>{var pe;const Z=J.dataset.url;document.getElementById("migrate-url-input").value=Z,M.querySelectorAll(".migrate-result-card").forEach(ze=>ze.style.outline=""),J.style.outline="2px solid var(--color-primary)",p(`Selected: ${(pe=J.querySelector(".manga-card-title"))==null?void 0:pe.textContent}`,"info")})})),T.style.display="none",q.style.display="block"}catch(z){T.style.display="none",p("Search failed: "+z.message,"error")}};(w=document.getElementById("migrate-search-btn"))==null||w.addEventListener("click",s),($=document.getElementById("migrate-search-input"))==null||$.addEventListener("keydown",v=>{v.key==="Enter"&&s()}),(A=document.getElementById("confirm-migrate-btn"))==null||A.addEventListener("click",async()=>{var T,q,M;const v=(q=(T=document.getElementById("migrate-url-input"))==null?void 0:T.value)==null?void 0:q.trim();if(!v){p("Please enter a URL","warning");return}const I=document.getElementById("confirm-migrate-btn");try{I.disabled=!0,I.textContent="Migrating...",p("Migrating source...","info");const U=await g.migrateSource(t.id,v);p(`Migrated! ${U.migratedChapters} chapters preserved as local`,"success"),p("Running full check on new source...","info"),await g.post(`/bookmarks/${t.id}/check`),(M=document.getElementById("migrate-source-modal"))==null||M.classList.remove("open"),await X(t.id),j([t.id]),p("Source migration complete!","success")}catch(U){p("Migration failed: "+U.message,"error")}finally{I&&(I.disabled=!1,I.textContent="Migrate Source")}}),(D=document.getElementById("anilist-track-btn"))==null||D.addEventListener("click",()=>{var v;(v=document.getElementById("anilist-modal"))==null||v.classList.add("open"),At()});const a=async()=>{var M,U;const v=(U=(M=document.getElementById("anilist-search-input"))==null?void 0:M.value)==null?void 0:U.trim();if(!v)return;const I=document.getElementById("anilist-search-loading"),T=document.getElementById("anilist-search-results"),q=document.getElementById("anilist-results-list");I.style.display="block",T.style.display="none";try{const re=(await g.anilistSearch(v)).results||[];re.length===0?q.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(q.innerHTML=re.map(z=>{var Z,pe,ze,Ps,qs,Rs,Ds;const oe=((Z=z.title)==null?void 0:Z.romaji)||((pe=z.title)==null?void 0:pe.english)||((ze=z.title)==null?void 0:ze.native)||"Unknown",J=(Ps=z.title)!=null&&Ps.english&&z.title.english!==oe?z.title.english:(qs=z.title)!=null&&qs.native&&z.title.native!==oe?z.title.native:"";return`
            <div style="display: flex; gap: 10px; align-items: center; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 8px;">
              ${(Rs=z.coverImage)!=null&&Rs.medium?`<img src="${z.coverImage.medium}" alt="" style="width: 48px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">`:""}
              <div style="flex: 1; min-width: 0;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${oe}"><strong>${oe}</strong></div>
                <div class="text-muted" style="font-size: 0.8em;">
                  ${[J,z.format,(Ds=z.startDate)==null?void 0:Ds.year,`${z.chapters??"?"} ch`].filter(Boolean).join(" • ")}
                </div>
              </div>
              <button class="btn btn-small btn-primary anilist-link-result-btn" data-id="${z.id}" data-title="${oe.replace(/"/g,"&quot;")}">Link</button>
            </div>
          `}).join(""),q.querySelectorAll(".anilist-link-result-btn").forEach(z=>{z.addEventListener("click",async()=>{var oe,J;try{z.disabled=!0,z.textContent="Linking...";const Z=await g.anilistMap(t.id,Number(z.dataset.id)),pe=((oe=Z.mapping)==null?void 0:oe.anilist_title)||z.dataset.title,ze=(J=Z.pull)!=null&&J.markedUpTo?` — pulled progress up to ch. ${Z.pull.markedUpTo}`:"";p(`Linked to AniList: ${pe}${ze}`,"success"),At()}catch(Z){z.disabled=!1,z.textContent="Link",p("Failed to link: "+Z.message,"error")}})})),I.style.display="none",T.style.display="block"}catch(G){I.style.display="none",p("AniList search failed: "+G.message,"error")}};(V=document.getElementById("anilist-search-btn"))==null||V.addEventListener("click",a),(N=document.getElementById("anilist-search-input"))==null||N.addEventListener("keydown",v=>{v.key==="Enter"&&a()}),e.querySelectorAll(".filter-btn[data-filter]").forEach(v=>{v.addEventListener("click",()=>{k.filter=v.dataset.filter,k.currentPage=0,j([t.id])})}),Bo(e,t),e.querySelectorAll("[data-page]").forEach(v=>{v.addEventListener("click",()=>{const I=v.dataset.page,T=Math.ceil(k.manga.chapters.length/ot);switch(I){case"first":k.currentPage=0;break;case"prev":k.currentPage=Math.max(0,k.currentPage-1);break;case"next":k.currentPage=Math.min(T-1,k.currentPage+1);break;case"last":k.currentPage=T-1;break}j([t.id])})}),e.querySelectorAll(".chapter-item").forEach(v=>{v.addEventListener("click",I=>{var M;if(I.target.closest(".chapter-actions"))return;const T=parseFloat(v.dataset.num);if((t.downloadedChapters||[]).includes(T)){const U=((M=t.downloadedVersions)==null?void 0:M[T])||[],G=Array.isArray(U)?U[0]:U;G?F.go(`/read/${t.id}/${T}?version=${encodeURIComponent(G)}`):F.go(`/read/${t.id}/${T}`)}else p("Chapter not downloaded","info")})}),e.querySelectorAll("[data-action]").forEach(v=>{v.addEventListener("click",async I=>{I.stopPropagation();const T=v.dataset.action,q=parseFloat(v.dataset.num),M=v.dataset.url?decodeURIComponent(v.dataset.url):null;switch(T){case"lock":await po(q);break;case"read":await fo(q);break;case"download":await vo(q);break;case"versions":yo(q);break;case"read-version":F.go(`/read/${t.id}/${q}?version=${encodeURIComponent(M)}`);break;case"download-version":await $o(q,M);break;case"delete-version":await ko(q,M);break;case"keep-version":await wo(q,M);break;case"delete-folder":await bo(q,decodeURIComponent(v.dataset.folder||""));break;case"hide-version":await Eo(q,M);break;case"restore-version":await So(q,M);break;case"restore-chapter":await Co(q);break;case"delete-chapter":await xo(q,M);break;case"hide-chapter":await Lo(q,M);break;case"unhide-chapter":await Io(q,M);break;case"split-chapter":await Ao(q);break}})}),e.querySelectorAll('[data-action="read"], [data-action="hide-chapter"], [data-action="delete-chapter"]').forEach(v=>{mo(v,()=>go(v.dataset.action,parseFloat(v.dataset.num)))}),e.querySelectorAll(".version-row .version-title").forEach(v=>{v.addEventListener("click",I=>{I.stopPropagation();const T=v.closest(".version-row"),q=parseFloat(T.dataset.num),M=T.dataset.versionUrl?decodeURIComponent(T.dataset.versionUrl):null;T.classList.contains("downloaded")&&M?F.go(`/read/${t.id}/${q}?version=${encodeURIComponent(M)}`):p("Version not downloaded yet","info")})}),e.querySelectorAll(".volume-card").forEach(v=>{v.addEventListener("click",()=>{const I=v.dataset.volumeId;F.go(`/manga/${t.id}/volume/${I}`)})}),e.querySelectorAll("[data-read-volume]").forEach(v=>{v.addEventListener("click",I=>{I.stopPropagation(),F.go(`/read/${t.id}/volume/${v.dataset.readVolume}`)})}),(W=e.querySelector("#read-volume-btn"))==null||W.addEventListener("click",v=>{F.go(`/read/${t.id}/volume/${v.currentTarget.dataset.volId}`)}),(K=e.querySelector("#find-volumes-btn"))==null||K.addEventListener("click",()=>{Na({query:t.alias||t.title,bookmarkId:t.id,bookmarkTitle:t.alias||t.title})}),(se=e.querySelector("#manage-volumes-btn"))==null||se.addEventListener("click",()=>{Jr(t,{onChanged:async()=>{await X(t.id),j([t.id])}})}),qo(e),Pe(),ee.subscribeToManga(t.id)}async function po(e){var n;const t=k.manga,s=((n=t.chapterSettings)==null?void 0:n[e])||{},a=!s.locked;try{a?await g.lockChapter(t.id,e):await g.unlockChapter(t.id,e),t.chapterSettings||(t.chapterSettings={}),t.chapterSettings[e]={...s,locked:a},p(a?"Chapter locked":"Chapter unlocked","success"),j([t.id])}catch(r){p("Failed: "+r.message,"error")}}const ho=550;function mo(e,t){let s=null,a=!1;const n=()=>{clearTimeout(s),s=null,e.classList.remove("pressing")};e.addEventListener("pointerdown",r=>{r.button!==void 0&&r.button!==0||(a=!1,n(),e.classList.add("pressing"),s=setTimeout(()=>{a=!0,e.classList.remove("pressing"),t()},ho))}),e.addEventListener("pointerup",n),e.addEventListener("pointerleave",n),e.addEventListener("pointercancel",n),e.addEventListener("contextmenu",r=>r.preventDefault()),e.addEventListener("click",r=>{a&&(a=!1,r.preventDefault(),r.stopImmediatePropagation())},!0)}async function go(e,t){const s=k.manga;if(!s||!Number.isFinite(t))return;const a=`chapter ${t}`,n=(r,i)=>`${r} ${i}${r===1?"":"s"}`;try{if(e==="read"){if(!confirm(`Mark every chapter up to ${a} as read?`))return;await g.markChaptersReadUpTo(s.id,t),p(`Marked read up to ${a}`,"success")}else if(e==="hide-chapter"){if(!confirm(`Hide every chapter up to ${a}? Their downloaded files are removed too. Locked chapters and chapters in a volume stay.`))return;const r=await g.bulkHideChapters(s.id,t);p(`Hid ${n(r.hidden,"chapter version")}${r.skipped?`, ${r.skipped} protected`:""}`,"success")}else if(e==="delete-chapter"){if(!confirm(`Delete the downloaded files of every chapter up to ${a}? Locked chapters stay.`))return;const r=confirm(`Also hide those chapters, up to ${a}?`),i=await g.bulkDeleteChapters(s.id,t,r);p(`Deleted ${n(i.deleted,"chapter")}${r?`, hid ${i.hidden}`:""}${i.skipped?`, ${i.skipped} skipped`:""}`,"success")}else return;await X(s.id),j([s.id])}catch(r){p("Failed: "+r.message,"error")}}async function fo(e){const t=k.manga,s=new Set(t.readChapters||[]),a=s.has(e);try{await g.post(`/bookmarks/${t.id}/chapters/${e}/read`,{isRead:!a}),a?s.delete(e):s.add(e),t.readChapters=[...s],p(a?"Marked unread":"Marked read","success"),j([t.id])}catch(n){p("Failed: "+n.message,"error")}}async function vo(e){const t=k.manga,s=new Set(t.deletedChapterUrls||[]),a=(t.chapters||[]).find(n=>n.number===e&&!s.has(n.url));try{p(`Downloading chapter ${e}...`,"info");let n;a?n=await g.post(`/bookmarks/${t.id}/download-version`,{chapterNumber:e,url:a.url}):n=await g.post(`/bookmarks/${t.id}/download`,{chapters:[e]}),p("Download queued!","success"),Ha(n==null?void 0:n.taskId,`Chapter ${e}`)}catch(n){p("Failed: "+n.message,"error")}}function yo(e){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${e}`&&s.classList.add("hidden")});const t=document.getElementById(`versions-${e}`);t&&t.classList.toggle("hidden")}async function bo(e,t){const s=k.manga;if(t&&confirm(`Delete the folder "${t}" from disk?`))try{await g.deleteChapterFolder(s.id,e,t),p("Folder deleted","success"),await X(s.id),j([s.id])}catch(a){p("Failed: "+a.message,"error")}}function Ha(e,t){var r;if(!e)return;const s=(r=k.manga)==null?void 0:r.id,a=Date.now(),n=async()=>{var u,m;if(Date.now()-a>30*60*1e3)return;let i;try{i=await g.getDownloadProgress(e)}catch{return}if(!i)return;if(!["complete","error","cancelled"].includes(i.status)){setTimeout(n,3e3);return}const c=i.errors||[],d=(i.completedChapters||[]).length>0&&i.status!=="error";i.status==="cancelled"?p(`${t}: download cancelled`,"info"):d?c.length?p(`${t} downloaded with problems: ${c[0].error}`,"warning"):p(`${t} downloaded${i.pages?` (${i.pages} pages)`:""}`,"success"):p(`${t} failed: ${((u=c[0])==null?void 0:u.error)||"unknown error"}`,"error"),((m=k.manga)==null?void 0:m.id)===s&&window.location.hash.startsWith(`#/manga/${s}`)&&(await X(s),j([s]))};setTimeout(n,3e3)}async function wo(e,t){var l;const s=k.manga,a=((l=s.downloadedVersions)==null?void 0:l[e])||[],r=(Array.isArray(a)?a:[a]).filter(c=>c&&c!==t);if(r.length===0){p("This is the only downloaded version","info");return}if(!confirm(`Delete the other ${r.length} downloaded version${r.length>1?"s":""} of chapter ${e}?`))return;let i=0;for(const c of r)try{await g.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:c})})}catch(d){i++,p("Failed to delete a version: "+d.message,"error")}i===0&&p("Other versions deleted","success"),await X(s.id),j([s.id])}async function $o(e,t){const s=k.manga;try{p("Downloading version...","info");const a=await g.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:e,url:t});p("Download queued!","success"),Ha(a==null?void 0:a.taskId,`Chapter ${e}`)}catch(a){p("Failed: "+a.message,"error")}}async function ko(e,t){const s=k.manga;try{await g.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:t})}),p("Version deleted","success"),await X(s.id),j([s.id])}catch(a){p("Failed: "+a.message,"error")}}async function Eo(e,t){const s=k.manga;try{await g.hideVersion(s.id,e,t),p("Version hidden","success"),await X(s.id),j([s.id])}catch(a){p("Failed: "+a.message,"error")}}async function So(e,t){const s=k.manga;try{await g.unhideVersion(s.id,e,t),p("Version restored","success"),await X(s.id),j([s.id])}catch(a){p("Failed to restore version: "+a.message,"error")}}async function Co(e){const t=k.manga;try{await g.unexcludeChapter(t.id,e),p("Chapter restored","success"),await X(t.id),j([t.id])}catch(s){p("Failed to restore chapter: "+s.message,"error")}}async function xo(e,t){const s=k.manga;if(confirm("Delete this chapter's files from disk?"))try{await g.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:t})}),p("Chapter files deleted","success"),await X(s.id),j([s.id])}catch(a){p("Failed to delete: "+a.message,"error")}}async function Lo(e,t){const s=k.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await g.hideVersion(s.id,e,t),p("Chapter hidden","success"),await X(s.id),j([s.id])}catch(a){p("Failed to hide chapter: "+a.message,"error")}}async function Io(e,t){const s=k.manga;try{await g.unhideVersion(s.id,e,t),p("Chapter unhidden","success"),await X(s.id),j([s.id])}catch(a){p("Failed to unhide chapter: "+a.message,"error")}}function Bo(e,t){var r,i;const s=e.querySelector("#merge-mode-btn");if(s&&s.addEventListener("click",()=>{k.mergeMode=!k.mergeMode,k.mergeSelection=new Set,k.mergeTargetTouched=!1,k.mergeTitleTouched=!1,j([t.id])}),!k.mergeMode)return;e.querySelectorAll(".merge-pick").forEach(l=>{l.addEventListener("click",c=>c.stopPropagation()),l.addEventListener("change",c=>{c.stopPropagation();const d=parseFloat(l.dataset.num);l.checked?k.mergeSelection.add(d):k.mergeSelection.delete(d),Mo(t)})});const a=e.querySelector("#merge-target"),n=e.querySelector("#merge-title");a==null||a.addEventListener("input",()=>{k.mergeTargetTouched=!0,!k.mergeTitleTouched&&n&&(n.value=a.value!==""?`Chapter ${a.value}`:"")}),n==null||n.addEventListener("input",()=>{k.mergeTitleTouched=!0}),(r=e.querySelector("#merge-cancel"))==null||r.addEventListener("click",()=>{k.mergeMode=!1,k.mergeSelection=new Set,j([t.id])}),(i=e.querySelector("#merge-submit"))==null||i.addEventListener("click",async()=>{var f;const l=[...k.mergeSelection].sort((E,x)=>E-x),c=parseFloat(a==null?void 0:a.value);if(l.length===0)return p("Tick the chapters to combine first","info");if(!Number.isFinite(c))return p("Give the combined chapter a number","error");const d=(n==null?void 0:n.value.trim())||`Chapter ${c}`,u=!!((f=e.querySelector("#merge-delete-sources"))!=null&&f.checked);if(u&&!confirm(`Remove the original folders of ${l.map(E=>`Ch. ${E}`).join(", ")} after combining? Splitting later will need them downloaded again.`))return;const m=e.querySelector("#merge-submit");m.disabled=!0,m.textContent="Combining…";try{const E=await g.mergeChapters(t.id,{sources:l,target:c,title:d,deleteSources:u});p(`Chapter ${E.target}: ${E.pageCount} pages from ${l.length} chapter${l.length===1?"":"s"}`,"success"),k.mergeMode=!1,k.mergeSelection=new Set,await X(t.id),j([t.id])}catch(E){p("Combine failed: "+E.message,"error"),m.disabled=!1,m.textContent="Combine"}})}function Mo(e){const t=[...k.mergeSelection].sort((l,c)=>l-c),s=document.getElementById("merge-picked");s&&(s.textContent=t.length?`Picked in page order: ${t.map(l=>`Ch. ${l}`).join(", ")}`:"Tick the downloaded chapters to combine (pages follow chapter order).");const a=document.getElementById("merge-submit");a&&(a.disabled=t.length===0);const n=Va(e,t),r=document.getElementById("merge-target"),i=document.getElementById("merge-title");r&&!k.mergeTargetTouched&&(r.value=n),i&&!k.mergeTitleTouched&&(i.value=n!==""?`Chapter ${n}`:"")}async function Ao(e){var r;const t=k.manga,s=(r=t==null?void 0:t.mergedChapters)==null?void 0:r[e];if(!s)return;const a=s.sources.map(i=>`Ch. ${i}`).join(", "),n=s.sources.includes(e)?` Chapter ${e}'s own pages were folded into the combined folder, so it will need downloading again.`:"";if(confirm(`Split chapter ${e} back into ${a}? The combined folder is deleted; the other originals come back as they are on disk.${n}`))try{await g.unmergeChapter(t.id,e),p(`Chapter ${e} split into ${a}`,"success"),await X(t.id),j([t.id])}catch(i){p("Split failed: "+i.message,"error")}}async function X(e){try{const[t,s]=await Promise.all([g.getBookmark(e),Y.isDemo?Promise.resolve([]):fe.loadCategories()]);if(k.manga=t,k.categories=s,k.loading=!1,k.volumesCollapsed=Yr(t),t.website==="Local")try{const r=await g.getCbzFiles(e);k.cbzFiles=r||[]}catch(r){console.error("Failed to load CBZ files:",r),k.cbzFiles=[]}else k.cbzFiles=[];const a=new Set((t.chapters||[]).map(r=>r.number)).size,n=Math.ceil(a/ot);k.currentPage=Math.max(0,n-1),k.activeVolumeId?k.activeVolume=(t.volumes||[]).find(r=>r.id===k.activeVolumeId):k.activeVolume=null}catch{p("Failed to load manga","error"),k.loading=!1}}async function j(e=[]){const[t,s,a]=e;if(!t){F.go("/");return}k.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!k.manga||k.manga.id!==t?(k.loading=!0,k.manga=null,n.innerHTML=ls(),await X(t)):k.activeVolumeId?k.activeVolume=(k.manga.volumes||[]).find(r=>r.id===k.activeVolumeId):k.activeVolume=null,n.innerHTML=ls(),uo(),At()}function To(){k.manga&&ee.unsubscribeFromManga(k.manga.id),k.manga=null,k.loading=!0}const _o={mount:j,unmount:To,render:ls};function Po(){return`
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
  `}function qo(e){const t=k.manga;if(!t)return;const s=e.querySelector("#volumes-toggle-btn");s&&s.addEventListener("click",()=>{k.volumesCollapsed=!k.volumesCollapsed,localStorage.setItem(Ua(t.id),k.volumesCollapsed?"1":"0");const b=e.querySelector(".volumes-section");b==null||b.classList.toggle("collapsed",k.volumesCollapsed),s.setAttribute("aria-expanded",String(!k.volumesCollapsed)),s.title=k.volumesCollapsed?"Expand volumes":"Collapse volumes";const L=s.querySelector("svg");L&&(L.outerHTML=h(k.volumesCollapsed?"chevron-down":"chevron-up"))});const a=e.querySelector("#add-volume-btn"),n=e.querySelector("#add-volume-modal"),r=e.querySelector("#add-volume-submit-btn");a&&n&&a.addEventListener("click",()=>{n.classList.add("open"),e.querySelector("#add-volume-name-input").focus()}),n==null||n.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(b=>{b.addEventListener("click",()=>n.classList.remove("open"))}),r&&r.addEventListener("click",async()=>{const b=e.querySelector("#add-volume-name-input").value.trim();if(!b)return p("Please enter a volume name","error");try{r.disabled=!0,r.textContent="Creating...",await g.createVolume(t.id,b),p("Volume created successfully!","success"),n.classList.remove("open"),e.querySelector("#add-volume-name-input").value="",await X(t.id),j([t.id])}catch(L){p("Failed to create volume: "+L.message,"error")}finally{r.disabled=!1,r.textContent="Create Volume"}});const i=e.querySelector("#manage-chapters-btn");i&&i.addEventListener("click",()=>{k.manageChapters=!k.manageChapters,j([t.id,"volume",k.activeVolumeId])}),e.querySelectorAll(".add-to-vol-btn").forEach(b=>{b.addEventListener("click",async()=>{const L=parseFloat(b.dataset.num),y=k.activeVolume;if(y)try{b.disabled=!0,b.textContent="...";const C=y.chapters||[];if(C.includes(L))return;const S=[...C,L].sort((_,R)=>_-R);await g.updateVolumeChapters(t.id,y.id,S),p(`Chapter ${L} added to volume`,"success"),await X(t.id),j([t.id,"volume",y.id])}catch(C){p("Failed to add chapter: "+C.message,"error"),b.disabled=!1,b.textContent="Add"}})}),e.querySelectorAll(".remove-from-vol-btn").forEach(b=>{b.addEventListener("click",async L=>{L.stopPropagation();const y=parseFloat(b.dataset.num),C=k.activeVolume;if(C)try{b.disabled=!0,b.textContent="...";const _=(C.chapters||[]).filter(R=>R!==y);await g.updateVolumeChapters(t.id,C.id,_),p(`Chapter ${y} removed from volume`,"success"),await X(t.id),j([t.id,"volume",C.id])}catch(S){p("Failed to remove chapter: "+S.message,"error"),b.disabled=!1,b.textContent="×"}})});const l=e.querySelector("#edit-vol-btn"),c=e.querySelector("#edit-volume-modal");l&&c&&l.addEventListener("click",()=>{const b=l.dataset.volId,L=t.volumes.find(y=>y.id===b);L&&(e.querySelector("#volume-name-input").value=L.name,c.dataset.editingVolId=b,c.classList.add("open"))});const d=e.querySelector("#save-volume-btn");d&&d.addEventListener("click",async()=>{const b=c.dataset.editingVolId,L=e.querySelector("#volume-name-input").value.trim();if(!L)return p("Volume name cannot be empty","error");try{await g.renameVolume(t.id,b,L),p("Volume renamed","success"),c.classList.remove("open"),await X(t.id),j([t.id,"volume",b])}catch(y){p(y.message,"error")}});const u=e.querySelector("#delete-volume-btn");u&&u.addEventListener("click",async()=>{var C;const b=(((C=k.manga)==null?void 0:C.volumes)||[]).find(S=>S.id===c.dataset.editingVolId),L=(b==null?void 0:b.kind)==="release"?`Delete "${b.name}"? Its ${b.pageCount||""} pages are removed from disk. Chapters assigned to it stay in the library.`:"Are you sure you want to delete this volume? Chapters will remain in the library.";if(!confirm(L))return;const y=c.dataset.editingVolId;try{await g.deleteVolume(t.id,y),p("Volume deleted","success"),c.classList.remove("open"),window.location.hash=`#/manga/${t.id}`}catch(S){p(S.message,"error")}});const m=e.querySelector("#vol-cover-upload-btn");if(m){let b=document.getElementById("vol-cover-input-hidden");b||(b=document.createElement("input"),b.type="file",b.id="vol-cover-input-hidden",b.accept="image/*",b.style.display="none",document.body.appendChild(b),b.addEventListener("change",async L=>{const y=L.target.files[0];if(!y)return;const C=b.dataset.mangaId,S=b.dataset.volId,_=document.getElementById("vol-cover-upload-btn");if(b.value="",!(!C||!S))try{_&&(_.disabled=!0,_.textContent="Uploading..."),await g.uploadVolumeCover(C,S,y),p("Cover uploaded","success"),await X(C),j([C,"volume",S])}catch(R){p("Upload failed: "+R.message,"error")}finally{_&&(_.disabled=!1,_.innerHTML=`${h("upload")} Upload Image`)}})),m.addEventListener("click",()=>{b.dataset.mangaId=t.id,b.dataset.volId=c.dataset.editingVolId||"",b.click()})}const f=e.querySelector("#vol-cover-selector-btn"),E=e.querySelector("#cover-selector-modal");f&&E&&f.addEventListener("click",async()=>{const b=E.querySelector("#cover-chapter-select");b.innerHTML='<option value="">Select a chapter...</option>';const L=e.querySelector("#edit-volume-modal"),y=L?L.dataset.editingVolId:null;let C=[...t.chapters||[]];if(y){const _=t.volumes.find(R=>R.id===y);if(_&&_.chapters){const R=new Set(_.chapters);C=C.filter(O=>R.has(O.number))}}C.sort((_,R)=>_.number-R.number);const S=new Set;C.forEach(_=>{if(!S.has(_.number)){S.add(_.number);const R=document.createElement("option");R.value=_.number,R.textContent=`Chapter ${_.number}`,b.appendChild(R)}}),C.length>0&&(b.value=C[0].number,Js(t.id,C[0].number)),E.classList.add("open")});const x=e.querySelector("#cover-chapter-select");x&&x.addEventListener("change",b=>{b.target.value&&Js(t.id,b.target.value)}),e.querySelectorAll(".modal-close, .modal-close-btn").forEach(b=>{b.addEventListener("click",()=>{b.closest(".modal").classList.remove("open")})}),e.querySelectorAll(".modal-overlay").forEach(b=>{b.addEventListener("click",()=>{b.closest(".modal").classList.remove("open")})})}async function Js(e,t){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await g.getChapterImages(e,t)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(r=>{const i=document.createElement("div");i.className="cover-grid-item",i.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",i.innerHTML=`<img src="${r}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,i.addEventListener("click",()=>{const l=document.querySelector('input[name="cover-target"]:checked').value,c=r.split("/").pop();Ro(c,t,l)}),s.appendChild(i)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function Ro(e,t,s){const a=k.manga,n=document.getElementById("edit-volume-modal"),r=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const i=n.dataset.editingVolId;if(!i)throw new Error("No volume selected");await g.setVolumeCoverFromChapter(a.id,i,t,e),p("Volume cover updated","success"),r.classList.remove("open"),n.classList.remove("open"),await X(a.id),j([a.id,"volume",i])}else{await g.setMangaCoverFromChapter(a.id,t,e),p("Series cover updated","success"),r.classList.remove("open"),await X(a.id);const i=window.location.hash.replace("#","");k.activeVolumeId?j([a.id,"volume",k.activeVolumeId]):j([a.id])}}catch(i){p("Failed to set cover: "+i.message,"error")}}let $e={series:null,loading:!0};function Je(){if($e.loading)return`
      ${he("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const e=$e.series;if(!e)return`
      ${he("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const t=e.alias||e.title,s=e.entries||[],a=s.reduce((r,i)=>r+(i.chapter_count||0),0);let n=null;if(s.length>0){const r=s[0];r.local_cover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.local_cover.split(/[/\\]/).pop())}`:r.localCover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.localCover.split(/[/\\]/).pop())}`:r.cover&&(n=r.cover)}return`
    ${he("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?_e(n,t,{kind:"series"}):ye("series")}
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
            ${s.map((r,i)=>Do(r,i,s.length)).join("")}
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
  `}function Do(e,t,s){var r;const a=e.alias||e.title;let n=null;return e.local_cover?n=`/api/public/covers/${e.bookmark_id}/${encodeURIComponent(e.local_cover.split(/[/\\]/).pop())}`:e.localCover?n=`/api/public/covers/${e.bookmark_id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover&&(n=e.cover),`
    <div class="series-entry-card" data-id="${e.bookmark_id}" data-order="${e.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${t+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${e.bookmark_id}" ${t===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${e.bookmark_id}" ${t===s-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?_e(n,a,{kind:"book"}):ye("book")}
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
  `}function Ft(){var c,d,u;const e=document.getElementById("app"),t=$e.series;(c=document.getElementById("back-btn"))==null||c.addEventListener("click",()=>F.go("/")),(d=document.getElementById("back-library-btn"))==null||d.addEventListener("click",()=>F.go("/")),e.querySelectorAll(".series-entry-card").forEach(m=>{m.addEventListener("click",f=>{if(f.target.closest("[data-action]"))return;const E=m.dataset.id;F.go(`/manga/${E}`)})}),e.querySelectorAll("[data-action]").forEach(m=>{m.addEventListener("click",async f=>{f.stopPropagation();const E=m.dataset.action,x=m.dataset.id;switch(E){case"move-up":await Ys(x,-1);break;case"move-down":await Ys(x,1);break;case"set-cover":const b=m.dataset.entryid;await No(b);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),r=document.getElementById("available-bookmarks-list"),i=document.getElementById("confirm-add-entry-btn");let l=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),r&&(r.innerHTML=""),a.classList.add("open");const m=await g.getAvailableBookmarksForSeries();l=m,m.length===0?(n&&(n.placeholder="No available manga found"),i.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),r&&(r.innerHTML=m.map(f=>`<option value="${(f.alias||f.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),i.disabled=!1)}catch{p("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),i.addEventListener("click",async()=>{const m=n?n.value:"",f=l.find(x=>(x.alias||x.title||"")===m);if(!f){p("Please select a valid manga from the list","warning");return}const E=f.id;try{i.disabled=!0,i.textContent="Adding...",await g.addSeriesEntry(t.id,E),p("Manga added to series","success"),a.classList.remove("open"),await Ot(t.id),e.innerHTML=Je(),Ft()}catch(x){p("Failed to add manga: "+x.message,"error")}finally{i.disabled=!1,i.textContent="Add to Series"}})),(u=document.getElementById("edit-series-btn"))==null||u.addEventListener("click",()=>{p("Edit series coming soon","info")})}async function Ys(e,t){const s=$e.series;if(!s)return;const a=s.entries||[],n=a.findIndex(l=>l.bookmark_id===e);if(n===-1)return;const r=n+t;if(r<0||r>=a.length)return;const i=a.map(l=>l.bookmark_id);[i[n],i[r]]=[i[r],i[n]];try{await g.post(`/series/${s.id}/reorder`,{order:i}),p("Order updated","success"),await Ot(s.id);const l=document.getElementById("app");l.innerHTML=Je(),Ft()}catch(l){p("Failed to reorder: "+l.message,"error")}}async function No(e){const t=$e.series;if(t)try{await g.setSeriesCover(t.id,e),p("Series cover updated","success"),await Ot(t.id);const s=document.getElementById("app");s.innerHTML=Je(),Ft()}catch(s){p("Failed to set cover: "+s.message,"error")}}async function Ot(e){try{const t=await g.get(`/series/${e}`);$e.series=t,$e.loading=!1}catch{p("Failed to load series","error"),$e.loading=!1}}async function Fo(e=[]){const[t]=e;if(!t){F.go("/");return}const s=document.getElementById("app");$e.loading=!0,$e.series=null,s.innerHTML=Je(),await Ot(t),s.innerHTML=Je(),Ft()}function Oo(){$e.series=null,$e.loading=!0}const Uo={mount:Fo,unmount:Oo,render:Je},Vo={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};function cs(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ho(){return`
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
    `}async function jo(){const e=c=>document.getElementById(c),t=e("tor-path-mappings");if(!t)return;const s=c=>{t.innerHTML=c.length?c.map((d,u)=>`
                <div class="tor-mapping" data-index="${u}">
                    <input type="text" class="tor-map-from" value="${cs(d.from)}" placeholder="qBittorrent path, e.g. /downloads">
                    <span class="tor-map-arrow">→</span>
                    <input type="text" class="tor-map-to" value="${cs(d.to)}" placeholder="path this app sees, e.g. /app/torrents">
                    <button type="button" class="btn-icon small danger tor-map-remove" title="Remove">×</button>
                </div>`).join(""):'<p class="settings-hint">No mappings.</p>',t.querySelectorAll(".tor-map-remove").forEach(d=>d.addEventListener("click",()=>{d.closest(".tor-mapping").remove(),t.querySelector(".tor-mapping")||s([])}))},a=()=>[...t.querySelectorAll(".tor-mapping")].map(c=>({from:c.querySelector(".tor-map-from").value.trim(),to:c.querySelector(".tor-map-to").value.trim()})),n=()=>a().filter(c=>c.from&&c.to),r=()=>({prowlarr:{baseUrl:e("tor-prowlarr-url").value.trim(),apiKey:e("tor-prowlarr-key").value},qbittorrent:{baseUrl:e("tor-qbt-url").value.trim(),username:e("tor-qbt-user").value.trim(),password:e("tor-qbt-pass").value,category:e("tor-qbt-category").value.trim()||"manga",savePath:e("tor-qbt-savepath").value.trim()},pathMappings:n(),autoImport:e("tor-auto-import").checked}),i=(c,d,u)=>{c.textContent=u,c.className=`torrents-test-result ${d?"ok":"error"}`};try{const{settings:c}=await g.getTorrentSettings();e("tor-prowlarr-url").value=c.prowlarr.baseUrl||"",e("tor-prowlarr-key").value=c.prowlarr.apiKey||"",e("tor-qbt-url").value=c.qbittorrent.baseUrl||"",e("tor-qbt-user").value=c.qbittorrent.username||"",e("tor-qbt-pass").value=c.qbittorrent.password||"",e("tor-qbt-category").value=c.qbittorrent.category||"manga",e("tor-qbt-savepath").value=c.qbittorrent.savePath||"",e("tor-auto-import").checked=c.autoImport!==!1,s(c.pathMappings||[])}catch(c){s([]),i(e("tor-save-result"),!1,`Could not load torrent settings: ${c.message}`)}e("tor-add-mapping").addEventListener("click",()=>s([...a(),{from:"",to:""}]));const l=async(c,d,u)=>{d.disabled=!0,u.textContent="Testing…",u.className="torrents-test-result";try{const{result:m}=await g.testTorrentService(c,r()[c]);c==="prowlarr"?i(u,!0,`Connected: ${m.appName} ${m.version}${m.indexers!==null?`, ${m.indexers} indexer${m.indexers===1?"":"s"} enabled`:""}`):i(u,!0,`Connected: qBittorrent ${m.version}${m.savePath?`, default save path ${m.savePath}`:""}`)}catch(m){i(u,!1,m.message)}finally{d.disabled=!1}};e("tor-test-prowlarr").addEventListener("click",c=>l("prowlarr",c.currentTarget,e("tor-prowlarr-result"))),e("tor-test-qbt").addEventListener("click",c=>l("qbittorrent",c.currentTarget,e("tor-qbt-result"))),e("tor-save").addEventListener("click",async c=>{const d=c.currentTarget;d.disabled=!0;try{const{settings:u}=await g.saveTorrentSettings(r());e("tor-prowlarr-key").value=u.prowlarr.apiKey||"",e("tor-qbt-pass").value=u.qbittorrent.password||"",i(e("tor-save-result"),!0,"Saved"),p("Torrent settings saved","success")}catch(u){i(e("tor-save-result"),!1,u.message)}finally{d.disabled=!1}})}const zo={mount:async e=>{const t=document.getElementById("app");t.innerHTML=`
            ${he()}
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

                    ${Y.isAdmin?Ho():""}
                </div>
            </div>
        `;let s={};try{const y=await g.get("/settings")||{};s=y;const C=document.getElementById("settings-form"),S=document.getElementById("settings-loader");y.theme&&(document.getElementById("theme").value=y.theme),S.style.display="none",C.style.display="",C.addEventListener("submit",async _=>{_.preventDefault();const R=new FormData(C),O={};for(const[w,$]of R.entries())O[w]=$;try{await g.post("/settings/bulk",O),p("Settings saved successfully"),O.theme}catch(w){console.error(w),p("Failed to save settings","error")}})}catch(y){console.error(y),document.getElementById("settings-loader").textContent="Error loading settings"}window.location.hash.includes("anilist=connected")&&p("AniList connected");const a=document.getElementById("anilist-group"),n=document.getElementById("anilist-status"),r=document.getElementById("anilist-connect"),i=document.getElementById("anilist-sync"),l=document.getElementById("anilist-disconnect"),c=document.getElementById("anilist-sync-result"),d=async()=>{a.style.display="block";try{const y=await g.anilistStatus();y.configured?y.connected?(n.textContent=`Connected as ${y.anilistUsername||"AniList user"}.`,r.style.display="none",i.style.display="",l.style.display=""):(n.textContent="Not connected. Link your AniList account to sync reading progress.",r.style.display="",i.style.display="none",l.style.display="none"):(n.textContent="Not configured — set ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET in .env and restart the server.",r.style.display="none",i.style.display="none",l.style.display="none")}catch(y){console.error(y),n.textContent="Failed to load AniList status — is the server running the latest code?"}};r.addEventListener("click",async()=>{try{const{url:y}=await g.anilistAuthUrl();window.location.href=y}catch(y){p(y.message||"Failed to start AniList connection","error")}}),l.addEventListener("click",async()=>{try{await g.anilistDisconnect(),p("AniList disconnected"),d()}catch{p("Failed to disconnect","error")}}),i.addEventListener("click",async()=>{i.disabled=!0,n.textContent="Syncing from AniList…";try{const y=await g.anilistPull();y.updated.length===0?c.textContent="Everything already up to date.":c.innerHTML="<ul>"+y.updated.map(C=>`<li>${C.title} — marked read up to chapter ${C.markedUpTo}</li>`).join("")+"</ul>",p(`AniList sync: ${y.updated.length} manga updated`)}catch(y){c.textContent="",p(y.message||"AniList sync failed","error")}finally{i.disabled=!1,d()}}),d(),Y.isAdmin&&jo();const u={...Vo,...s.slideshow||{}};u.disabledMangaIds=[...u.disabledMangaIds||[]];const m=document.getElementById("slideshow-interval"),f=document.getElementById("slideshow-shuffle"),E=document.getElementById("slideshow-lists"),x=document.getElementById("slideshow-trophies"),b=document.getElementById("slideshow-manga-list");m.value=String(u.intervalMs),m.value||(m.value="8000"),f.checked=!!u.shuffle,E.checked=!!u.includeLists,x.checked=!!u.includeTrophies;const L=async()=>{if(!Y.isDemo)try{await g.post("/settings",{key:"slideshow",value:u})}catch(y){console.error(y),p("Failed to save slideshow settings","error")}};m.addEventListener("change",()=>{u.intervalMs=parseInt(m.value,10)||8e3,L()}),f.addEventListener("change",()=>{u.shuffle=f.checked,L()}),E.addEventListener("change",()=>{u.includeLists=E.checked,L()}),x.addEventListener("change",()=>{u.includeTrophies=x.checked,L()}),document.getElementById("slideshow-start").addEventListener("click",()=>{var y,C;(C=(y=document.documentElement).requestFullscreen)==null||C.call(y).catch(()=>{}),F.go("/slideshow")});try{const y=await g.getAllVolumes();if(y.length===0)b.innerHTML=`<p class="settings-hint">No manga with volumes yet — create volumes from a manga's page first.</p>`;else{const C=new Set(u.disabledMangaIds);b.innerHTML=y.map(S=>{const _=cs(S.alias||S.title),R=S.volumes.filter($=>$.cover).length,O=S.localCover?`/api/public/covers/${S.id}/${encodeURIComponent(S.localCover.split(/[/\\]/).pop())}`:S.cover,w=R===0;return`
                        <label class="slideshow-manga-row${w?" no-covers":""}" title="${w?"No volume covers yet":_}">
                            <input type="checkbox" data-manga-id="${S.id}" ${!C.has(S.id)&&!w?"checked":""} ${w?"disabled":""}>
                            <span class="slideshow-manga-thumb">${O?_e(O,_,{kind:"book"}):ye("book")}</span>
                            <span class="slideshow-manga-info">
                                <span class="slideshow-manga-name">${_}</span>
                                <span class="slideshow-manga-meta">${S.volumes.length} volume${S.volumes.length===1?"":"s"} · ${R} cover${R===1?"":"s"}</span>
                            </span>
                        </label>
                    `}).join(""),b.addEventListener("change",S=>{const _=S.target.closest("input[data-manga-id]");if(!_)return;const R=_.dataset.mangaId;_.checked?u.disabledMangaIds=u.disabledMangaIds.filter(O=>O!==R):u.disabledMangaIds.includes(R)||u.disabledMangaIds.push(R),L()})}}catch(y){console.error(y),b.innerHTML='<p class="settings-hint">Failed to load manga list.</p>'}}},Qo={mount:async e=>{const t=document.getElementById("app");if(!Y.isAdmin){t.innerHTML=`
                ${he()}
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
        `,document.querySelectorAll(".admin-tab").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(a=>a.classList.remove("active")),s.classList.add("active"),document.querySelectorAll(".admin-section").forEach(a=>a.style.display="none"),document.getElementById(`admin-section-${s.dataset.section}`).style.display=""})}),await Promise.all([$t(),Go(),Wo()])}};async function $t(){const e=document.getElementById("admin-section-users");try{const t=await g.listUsers();e.innerHTML=`
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
                                <td>${ds(s.username)}${s.id===((a=Y.user)==null?void 0:a.id)?' <span class="badge">you</span>':""}</td>
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
        `,e.querySelectorAll("tr[data-user-id]").forEach(s=>{const a=Number(s.dataset.userId),n=async()=>{try{await g.updateUser(a,{role:s.querySelector(".user-role").value,canDownload:s.querySelector(".user-can-download").checked,canEdit:s.querySelector(".user-can-edit").checked}),p("User updated","success")}catch(r){p(r.message,"error"),$t()}};s.querySelector(".user-role").addEventListener("change",n),s.querySelector(".user-can-download").addEventListener("change",n),s.querySelector(".user-can-edit").addEventListener("change",n),s.querySelector(".user-reset-pw").addEventListener("click",async()=>{const r=prompt("New password for this user:");if(r)try{await g.updateUser(a,{password:r}),p("Password reset","success")}catch(i){p(i.message,"error")}}),s.querySelector(".user-delete").addEventListener("click",async()=>{if(confirm("Delete this user?"))try{await g.deleteUser(a),p("User deleted","success"),$t()}catch(r){p(r.message,"error")}})}),document.getElementById("add-user-form").addEventListener("submit",async s=>{s.preventDefault();try{await g.createUser({username:document.getElementById("new-username").value.trim(),password:document.getElementById("new-password").value,role:document.getElementById("new-role").value,canDownload:document.getElementById("new-can-download").checked,canEdit:document.getElementById("new-can-edit").checked}),p("User created","success"),$t()}catch(a){p(a.message,"error")}})}catch(t){console.error(t),e.innerHTML='<div class="error">Failed to load users</div>'}}async function Go(){const e=document.getElementById("admin-section-demo");try{const t=await g.getBookmarks();e.innerHTML=`
            <h2>Demo Content</h2>
            <p class="admin-demo-warning">
                Checked series are visible to <strong>anyone</strong> on the public demo page
                (<code>/demo.html</code>) — no login needed, covers included. Only downloaded
                chapters are readable there. Be deliberate about adult titles.
            </p>
            <input type="search" id="demo-filter" placeholder="Filter series..." class="admin-demo-filter">
            <ul class="admin-demo-list">
                ${t.map(s=>`
                    <li data-title="${ds((s.alias||s.title||"").toLowerCase())}">
                        <label>
                            <input type="checkbox" class="demo-toggle" data-id="${s.id}" ${s.isDemo?"checked":""}>
                            <span>${ds(s.alias||s.title)}</span>
                            <span class="badge">${s.downloadedCount||0} downloaded</span>
                        </label>
                    </li>
                `).join("")}
            </ul>
        `,e.querySelectorAll(".demo-toggle").forEach(s=>{s.addEventListener("change",async()=>{try{await g.toggleDemo(s.dataset.id,s.checked),p(s.checked?"Added to demo":"Removed from demo","success")}catch(a){s.checked=!s.checked,p(a.message,"error")}})}),document.getElementById("demo-filter").addEventListener("input",s=>{const a=s.target.value.toLowerCase();e.querySelectorAll(".admin-demo-list li").forEach(n=>{n.style.display=n.dataset.title.includes(a)?"":"none"})})}catch(t){console.error(t),e.innerHTML='<div class="error">Failed to load bookmarks</div>'}}function ds(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Wo(){try{const e=await g.get("/admin/tables"),t=document.getElementById("admin-sidebar");t.innerHTML=`
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
        `,t.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;us(n),t.querySelectorAll(".table-link").forEach(r=>r.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(e){console.error(e),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function us(e,t=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${e}...</div>`;try{const i=await g.get(`/admin/tables/${e}?page=${t}&limit=50`);if(!i.rows||i.rows.length===0){s.innerHTML=`
                <h2>${e}</h2>
                <div class="empty-state">No records found</div>
            `;return}const l=Object.keys(i.rows[0]);s.innerHTML=`
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
                            ${l.map(c=>`<th>${c}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${i.rows.map(c=>`
                            <tr>
                                ${l.map(d=>{const u=c[d];let m=u;return u===null?m='<span class="null">NULL</span>':typeof u=="object"?m=JSON.stringify(u):String(u).length>100&&(m=String(u).substring(0,100)+"..."),`<td>${m}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>us(e,t-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>us(e,t+1))}catch(r){console.error(r),s.innerHTML=`<div class="error">Failed to load data for ${e}</div>`}}let le={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function Ko(e,t){let s=null;if(t.length>0){const n=t[0];if(n.imagePaths&&n.imagePaths.length>0){const r=n.imagePaths[0];let i;typeof r=="string"?i=r:r&&typeof r=="object"&&(i=r.filename||r.path||r.name||r.url,i&&i.includes("/")&&(i=i.split("/").pop()),i&&i.includes("\\")&&(i=i.split("\\").pop())),i&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(i)}`)}}const a=t.reduce((n,r)=>{var i;return n+(((i=r.imagePaths)==null?void 0:i.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${e}">
      <div class="manga-card-cover">
        ${s?_e(s,e,{kind:"folder"}):ye("folder")}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function Jo(e){const t=le.bookmarks.find(s=>s.id===e);return t?t.alias||t.title:e}function Yo(e){const t=le.bookmarks.find(s=>s.id===e);if(t&&t.seriesId){const s=le.series.find(a=>a.id===t.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function Xo(e,t,s,a=!1){return`
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
  `}function Zo(){const e={};console.log("Building trophy groups from:",le.trophyPages);for(const t of Object.keys(le.trophyPages)){const s=le.trophyPages[t];let a=0;for(const[r,i]of Object.entries(s))a+=Object.keys(i).length;if(console.log(`Manga ${t}: ${a} trophies`),a===0)continue;const n=Yo(t);if(n)e[n.id]||(e[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),e[n.id].count+=a,e[n.id].mangaIds.push(t);else{const r=Jo(t);console.log(`No series for ${t}, using name: ${r}`),e[t]={name:r,isSeries:!1,count:a,mangaIds:[t]}}}return console.log("Trophy groups result:",e),e}function Tt(){if(le.loading)return`
      ${he("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:e,listOrder:t}=le.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${le.activeTab==="galleries"?"active":""}" data-tab="galleries">
        ${h("folder")} Galleries
      </button>
      <button class="tab-btn ${le.activeTab==="trophies"?"active":""}" data-tab="trophies">
        ${h("trophy")} Trophies
      </button>
    </div>
  `;let a="";if(le.activeTab==="galleries")t.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${t.map(r=>{const i=e&&e[r]||[];return Ko(r,i)}).join("")}
        </div>
      `;else{const n=Zo(),r=Object.keys(n);r.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${r.map(l=>{const c=n[l];return Xo(l,c.name,c.count,c.isSeries)}).join("")}
        </div>
      `}return`
    ${he("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function ja(){Pe();const e=document.getElementById("app");e.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{le.activeTab=s.dataset.tab,e.innerHTML=Tt(),ja()})}),e.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;F.go(`/read/gallery/${encodeURIComponent(a)}`)})}),e.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?F.go(`/read/trophies/series-${a}/🏆`):F.go(`/read/trophies/${a}/🏆`)})})}async function ei(){try{const[e,t,s,a]=await Promise.all([fe.loadFavorites(),g.get("/trophy-pages"),fe.loadBookmarks(),fe.loadSeries()]);le.favorites=e||{favorites:{},listOrder:[]},le.trophyPages=t||{},le.bookmarks=s||[],le.series=a||[],le.loading=!1}catch(e){console.error("Failed to load favorites:",e),p("Failed to load favorites","error"),le.loading=!1}}async function ti(){console.log("[Favorites] mount called"),le.loading=!0;const e=document.getElementById("app");e.innerHTML=Tt(),await ei(),console.log("[Favorites] Data loaded, rendering..."),e.innerHTML=Tt(),console.log("[Favorites] Calling setupListeners..."),ja(),console.log("[Favorites] setupListeners complete")}function si(){}const ai={mount:ti,unmount:si,render:Tt},_t="site-challenge-banner",za="site-cookie-modal",Is=new Set;function ue(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Bs(e,t){window.open(t||`https://${e}/`,"_blank","noopener")}function nt(){const e=document.getElementById(za);e&&e.remove(),document.removeEventListener("keydown",Qa)}function Qa(e){e.key==="Escape"&&nt()}function ni(e,t){var n;const s=((n=t.session)==null?void 0:n.cookieCount)??0,a=t.probe;return a&&a.ok?{kind:"ok",html:`<strong>${ue(e)} accepted the cookies.</strong> ${s} saved; update checks for this site resume.
                   Downloads that stopped on the check can be retried from the <a href="#/queue">Task Queue</a>.`}:a&&!a.ok&&a.error?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but the server could not load ${ue(e)} to test them.</strong>
                   ${ue(a.error)}. Retry a download to find out whether they work.`}:a&&!a.ok?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but ${ue(e)} still shows its check to the server.</strong>
                   Usually one of: the check was done on a different network than the server (the cookie can be tied to the
                   IP address), or in a different browser than the identity filled in above. Complete the check again from a
                   device on the server's network, export the cookies right away, make sure the identity is that browser's,
                   and paste again.${a.error?`<br><small>${ue(a.error)}</small>`:""}`}:{kind:"ok",html:`<strong>Saved ${s} cookie${s===1?"":"s"}.</strong> The site could not be tested right now; retry your download to find out.`}}function Ms({site:e,url:t,stale:s=!1,onImported:a}={}){if(!e)return;if(!Y.isAdmin){p("Only an admin can hand site cookies to the scraper","error");return}nt();const n=navigator.userAgent||"",r=document.createElement("div");r.id=za,r.className="modal open site-cookie-modal",r.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Hand ${ue(e)}'s cookies to the scraper</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="site-cookie-body">
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
    `,document.body.appendChild(r),document.addEventListener("keydown",Qa);const i=r.querySelector("#site-cookie-input"),l=r.querySelector("#site-cookie-ua"),c=r.querySelector("#site-cookie-result"),d=r.querySelector('[data-act="save"]'),u=(f,E)=>{c.className=`site-cookie-result ${f}`,c.innerHTML=E,c.hidden=!1};r.querySelector(".modal-overlay").addEventListener("click",nt),r.querySelectorAll('[data-act="close"]').forEach(f=>f.addEventListener("click",nt)),r.querySelector('[data-act="open"]').addEventListener("click",()=>Bs(e,t));let m=!1;d.addEventListener("click",async()=>{var E;if(m)return;const f=i.value.trim();if(!f){u("error","Paste the cookies first."),i.focus();return}m=!0,d.disabled=!0,d.textContent="Saving & testing…",c.hidden=!0;try{const x=await g.importSiteSession(e,f,l.value.trim()),{kind:b,html:L}=ni(e,x),y=x.ignored||{},C=[];y.foreign&&C.push(`${y.foreign} for other sites`),y.expired&&C.push(`${y.expired} already expired`),y.invalid&&C.push(`${y.invalid} unreadable`),u(b,L+(C.length?`<br><small>Skipped: ${C.join(", ")}.</small>`:"")),i.value="",typeof a=="function"&&a(x),(E=x.probe)!=null&&E.ok&&(p(`${e}: cookies accepted, checks resume`,"success"),setTimeout(nt,2500))}catch(x){u("error",ue(x.message||"Import failed"))}finally{m=!1,d.disabled=!1,d.textContent="Save & test"}}),i.focus()}function ri(e){var n;let t=document.getElementById(_t);t||(t=document.createElement("div"),t.id=_t,t.className="site-challenge-banner",document.body.appendChild(t)),t.dataset.site=e.site;const s=Y.isAdmin;let a=e.sessionStale?`<strong>${ue(e.site)}</strong> no longer accepts the cookies handed over earlier. Complete its verification check again and paste fresh ones.`:`<strong>${ue(e.site)}</strong> is asking for a human verification check. Automatic update checks for this site are paused and downloads stop at the first blocked chapter until someone completes it and hands over its cookies.`;s||(a+=" Ask an admin to do that."),t.innerHTML=`
        <div class="site-challenge-text">${a}</div>
        <div class="site-challenge-actions">
            <button class="btn btn-primary btn-sm" data-act="open">${s?"1. ":""}Open ${ue(e.site)}</button>
            ${s?'<button class="btn btn-primary btn-sm" data-act="import">2. Paste cookies</button>':""}
            <button class="btn btn-secondary btn-sm" data-act="retry" title="Resume without handing over cookies. Only works if the site stopped asking.">Retry anyway</button>
            <button class="site-challenge-close" data-act="close" title="Hide">×</button>
        </div>
    `,t.querySelector('[data-act="open"]').addEventListener("click",()=>Bs(e.site,e.url)),(n=t.querySelector('[data-act="import"]'))==null||n.addEventListener("click",()=>{Ms({site:e.site,url:e.url,stale:!!e.sessionStale})}),t.querySelector('[data-act="retry"]').addEventListener("click",async()=>{try{await g.clearSiteChallenge(e.site),p(`${e.site}: checks resumed. If the puzzle comes back, hand over its cookies instead.`,"info")}catch(r){p("Failed: "+r.message,"error")}ps()}),t.querySelector('[data-act="close"]').addEventListener("click",()=>{Is.add(e.site),ps()}),t.classList.add("show")}function ps(){const e=document.getElementById(_t);e&&e.remove()}function Xs(e){!e||Is.has(e.site)||ri(e)}async function Di(){ee.on("site:challenge",e=>{Is.delete(e.site),Xs(e)}),ee.on("site:challenge-cleared",({site:e})=>{const t=document.getElementById(_t);t&&t.dataset.site===e&&ps()});try{const t=((await g.getSiteStatus()).challenges||[])[0];t&&Xs(t)}catch{}}const hs="import-review-modal";function ve(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function oi(e){const t=e.parsed||{};return t.volume!==null&&t.volume!==void 0?t.volumeEnd?`name says volumes ${t.volume}–${t.volumeEnd}`:`name says volume ${t.volume}`:t.chapter!==null&&t.chapter!==void 0?t.chapterEnd?`name says chapters ${t.chapter}–${t.chapterEnd}`:`name says chapter ${t.chapter}`:"no number in the name"}function rt(){var e;(e=document.getElementById(hs))==null||e.remove(),document.removeEventListener("keydown",Ga)}function Ga(e){e.key==="Escape"&&rt()}async function ii(e,{onImported:t}={}){var E,x,b,L,y,C;rt();const s=document.createElement("div");s.id=hs,s.className="modal open torrent-modal",s.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${h("list-checks")} Review import</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body" id="review-body"><div class="torrent-hint">${h("loader",{spin:!0})} Reading the download…</div></div>
            <div class="modal-footer" id="review-footer" hidden></div>
        </div>
    `,document.body.appendChild(s),document.addEventListener("keydown",Ga),s.querySelector(".modal-overlay").addEventListener("click",rt),s.querySelector('[data-act="close"]').addEventListener("click",rt);const a=s.querySelector("#review-body"),n=s.querySelector("#review-footer");let r;try{r=await g.getTorrentContents(e.hash)}catch(S){a.innerHTML=`<div class="torrent-hint error">${ve(S.message)}</div>`;return}if(!document.getElementById(hs))return;let i=[];if(!r.bookmarkId)try{const S=await g.getBookmarks();i=(S.bookmarks||S||[]).map(_=>({id:_.id,title:_.alias||_.title})).sort((_,R)=>_.title.localeCompare(R.title))}catch{}const l=r.items||[],c=new Map((((E=r.existing)==null?void 0:E.volumes)||[]).map(S=>[Number(S.number),S.name])),d=new Set((((x=r.existing)==null?void 0:x.chapters)||[]).map(Number));a.innerHTML=`
        <div class="torrent-target">
            <strong>${ve(r.releaseName||e.name)}</strong> · ${l.length} item${l.length===1?"":"s"}
            ${r.bookmarkId?` · into <strong>${ve(r.bookmarkTitle)}</strong>`:` · into <label>
                    <select id="review-target">
                        <option value="">New series “${ve(r.newSeriesTitle||e.name)}”</option>
                        ${i.map(S=>`<option value="${ve(S.id)}">${ve(S.title)}</option>`).join("")}
                    </select></label>`}
        </div>
        ${l.length===0?'<div class="torrent-hint">Nothing importable in this download: no .cbz/.zip archives or image folders.</div>':`
        <div class="review-tools">
            <button type="button" class="btn btn-sm btn-secondary" id="review-all">Select all</button>
            <button type="button" class="btn btn-sm btn-secondary" id="review-none">Select none</button>
            <span class="torrent-hint">Untick what you don't want. Change Volume/Chapter and the number where the name was read wrongly.</span>
        </div>
        <table class="torrent-table review-table">
            <thead><tr><th></th><th>File</th><th>Size</th><th>Import as</th><th>Number</th><th></th></tr></thead>
            <tbody>
            ${l.map((S,_)=>`
                <tr data-index="${_}">
                    <td><input type="checkbox" class="rv-pick" checked></td>
                    <td class="torrent-title">
                        <div>${S.kind==="dir"?h("folder"):h("package")} ${ve(S.name)}</div>
                        <div class="torrent-row-status">${ve(oi(S))}</div>
                    </td>
                    <td>${S.kind==="dir"?`${S.pages??"?"} pages`:Mt(S.size)}</td>
                    <td>
                        <select class="rv-as">
                            <option value="volume" ${S.as==="volume"?"selected":""}>Volume</option>
                            <option value="chapter" ${S.as==="chapter"?"selected":""} ${S.kind==="dir"?"disabled":""}>Chapter</option>
                        </select>
                    </td>
                    <td><input type="number" step="any" min="0" class="rv-num" value="${S.number??""}"></td>
                    <td class="rv-warn"></td>
                </tr>`).join("")}
            </tbody>
        </table>`}
        ${(b=r.unsupported)!=null&&b.length?`<div class="torrent-hint">Cannot import: ${r.unsupported.map(ve).join(", ")} (only .cbz/.zip and image folders).</div>`:""}
        <div id="review-result"></div>
    `;const u=()=>[...a.querySelectorAll("tr[data-index]")],m=S=>({index:parseInt(S.dataset.index,10),picked:S.querySelector(".rv-pick").checked,as:S.querySelector(".rv-as").value,number:parseFloat(S.querySelector(".rv-num").value)}),f=()=>{const S=u().map(m),_=new Map;for(const w of S){if(!w.picked||!Number.isFinite(w.number))continue;const $=`${w.as}:${w.number}`;_.set($,(_.get($)||0)+1)}let R=0;for(const w of u()){const $=m(w),A=w.querySelector(".rv-warn"),D=[];$.picked&&(R++,Number.isFinite($.number)?(_.get(`${$.as}:${$.number}`)>1&&D.push(`same ${$.as} number as another file`),$.as==="volume"&&c.has($.number)&&D.push(`replaces ${c.get($.number)}`),$.as==="chapter"&&d.has($.number)&&D.push(`replaces downloaded chapter ${$.number}`)):D.push("needs a number")),A.textContent=D.join(" · "),w.classList.toggle("rv-skipped",!$.picked)}const O=n.querySelector("#review-import");O&&(O.disabled=R===0,O.textContent=`Import ${R} selected`)};a.addEventListener("change",f),a.addEventListener("input",f),(L=a.querySelector("#review-all"))==null||L.addEventListener("click",()=>{u().forEach(S=>{S.querySelector(".rv-pick").checked=!0}),f()}),(y=a.querySelector("#review-none"))==null||y.addEventListener("click",()=>{u().forEach(S=>{S.querySelector(".rv-pick").checked=!1}),f()}),n.hidden=!1,n.innerHTML=`
        <span class="torrent-hint">Existing volumes with the same number are replaced.</span>
        <span class="spacer"></span>
        <button type="button" class="btn btn-secondary" data-act="close">Cancel</button>
        ${l.length?'<button type="button" class="btn btn-primary" id="review-import">Import</button>':""}
    `,n.querySelector('[data-act="close"]').addEventListener("click",rt),f(),(C=n.querySelector("#review-import"))==null||C.addEventListener("click",async()=>{var $,A,D,V;const S=n.querySelector("#review-import"),_=u().map(m),R=_.map(N=>({path:l[N.index].path,as:N.picked?N.as:"skip",number:N.number})),O=_.filter(N=>N.picked);if(O.length===0)return;if(O.some(N=>!Number.isFinite(N.number))){p("Every selected item needs a number","error");return}const w=r.bookmarkId||(($=a.querySelector("#review-target"))==null?void 0:$.value)||null;S.disabled=!0,S.textContent="Importing…",a.querySelectorAll("input, select, button").forEach(N=>{N.disabled=!0});try{const N=await g.importTorrent(e.hash,w,R),W=((A=N.summary)==null?void 0:A.volumes)||[],K=((D=N.summary)==null?void 0:D.chapters)||[],se=((V=N.summary)==null?void 0:V.skipped)||[];a.querySelector("#review-result").innerHTML=`
                <div class="torrent-row-status ok">${h("check")} Imported ${W.length} volume${W.length===1?"":"s"}${W.length?` (${W.map(v=>ve(v.name)).join(", ")})`:""}${K.length?` and ${K.length} chapter${K.length===1?"":"s"}`:""}.</div>
                ${se.length?`<ul class="task-error-list">${se.map(v=>`<li>${ve(v)}</li>`).join("")}</ul>`:""}
                <a href="#/manga/${ve(N.bookmarkId)}" class="btn btn-sm btn-secondary">Open the series</a>
            `,S.textContent="Done",n.querySelector('[data-act="close"]').textContent="Close",typeof t=="function"&&t(N)}catch(N){a.querySelectorAll("input, select, button").forEach(W=>{W.disabled=!1}),a.querySelector("#review-result").innerHTML=`<div class="torrent-row-status error">Import failed: ${ve(N.message)}</div>`,S.disabled=!1,f()}})}let H={downloads:{},torrents:[],queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,showEmptyChecks:!1,collapsed:{torrents:!1,active:!1,scheduled:!1,completed:!1,history:!0}},kt=null,ce={};function As(e){if(!e)return"Never";const t=Date.now()-new Date(e).getTime(),s=Math.floor(t/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function li(e){if(!e)return"Not scheduled";const t=new Date(e).getTime()-Date.now();if(t<=0)return"Running now...";const s=Math.floor(t/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const r=Math.floor(a/24),i=a%24;return`in ${r}d ${i}h`}function Wa(e){switch(e){case"download":return h("download");case"scrape":return h("search");case"scan":return h("folder");default:return h("settings")}}function Ts(e){switch(e){case"running":return"var(--color-success)";case"queued":case"pending":return"var(--color-warning)";case"paused":return"var(--color-info)";case"complete":return"var(--color-success)";case"error":case"failed":case"cancelled":return"var(--color-error)";default:return"var(--text-secondary)"}}function _s(e){switch(e){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return e}}function ci(e){return!e||e==="default"?"Default (6h)":e==="daily"?"Daily":e==="weekly"?"Weekly":e}function di(){const e=H.autoCheck;return e?`
    <div class="queue-inline-header">
      <span class="text-muted">${e.enabledCount} monitored · Last: ${As(e.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">${h("play")} Run All Now</button>
    </div>
  `:""}function ui(e){const t=e.nextCheck?li(e.nextCheck):"Not set",s=e.nextCheck&&new Date(e.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${e.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${h("book-open")}</span>
          <div>
            <div class="task-title">${e.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${ci(e.schedule)}${e.schedule==="weekly"&&e.day?` · ${e.day.charAt(0).toUpperCase()+e.day.slice(1)}`:""}${(e.schedule==="daily"||e.schedule==="weekly")&&e.time?` · ${e.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?`${h("alarm-clock")} Due now`:t}</span>
        </div>
      </div>
    </div>
  `}function Ee(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Zs(e,t){const s=t.total>0?Math.round(t.completed/t.total*100):0,a=t.status==="running"||t.status==="queued",n=t.status==="paused",r=t.errors&&t.errors.length>0,i=!a&&!n&&r&&(t.chapterUrls||[]).length>0;return`
    <div class="queue-card task-card" data-task-id="${e}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${h("download")}</span>
          <div>
            <div class="task-title">${t.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${Ts(t.status)}">${_s(t.status)}</div>
          </div>
        </div>
        <div class="task-actions">
          ${a?`<button class="btn btn-sm btn-icon" data-action="pause" data-task="${e}" title="Pause">${h("pause",{title:"Pause"})}</button>`:""}
          ${n?`<button class="btn btn-sm btn-icon" data-action="resume" data-task="${e}" title="Resume">${h("play",{title:"Resume"})}</button>`:""}
          ${a||n?`<button class="btn btn-sm btn-icon btn-danger" data-action="cancel" data-task="${e}" title="Cancel">✕</button>`:""}
        </div>
      </div>
      <div class="queue-card-body">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${s}%"></div>
          <span class="progress-text">${t.completed} / ${t.total} chapters (${s}%)</span>
        </div>
        ${t.current?`<div class="task-current">Currently: Chapter ${t.current}</div>`:""}
        ${t.errors&&t.errors.length>0?`
          <div class="task-errors">${h("triangle-alert")} ${t.errors.length} error(s)</div>
          <ul class="task-error-list">${t.errors.slice(0,5).map(l=>`<li>${typeof l.chapter=="number"?`Ch. ${l.chapter}: `:""}${Ee(l.error)}</li>`).join("")}</ul>`:""}
        ${t.challenge?(()=>{const l=Ee(t.challenge.site),c=Ee(t.challenge.url||`https://${t.challenge.site}/`),d=Y.isAdmin;return`
          <div class="task-challenge">
            <span>${t.challenge.sessionStale?`${l} no longer accepts the cookies handed over earlier. Complete its check again, paste fresh cookies, then retry.`:`${l} wants a human verification check. Complete it in your browser, hand over its cookies, then retry here.`}${d?"":" (An admin has to hand the cookies over.)"}</span>
            <button class="btn btn-sm btn-primary" data-action="open-site" data-site="${l}" data-url="${c}">${d?"1. ":""}Open ${l}</button>
            ${d?`<button class="btn btn-sm btn-primary" data-action="import-cookies" data-site="${l}" data-url="${c}" data-stale="${t.challenge.sessionStale?"1":""}">2. Paste cookies</button>`:""}
            <button class="btn btn-sm btn-secondary" data-action="retry" data-task="${e}">${d?"3. ":""}Retry download</button>
          </div>`})():i?`
          <div class="task-challenge">
            <button class="btn btn-sm btn-secondary" data-action="retry" data-task="${e}">Retry failed chapters</button>
          </div>`:""}
      </div>
    </div>
  `}function pi(e){switch(e.status){case"downloading":return/paused|stopped/i.test(e.state||"")?"Paused":/queued|metaDL|checking/i.test(e.state||"")?"Waiting":"Downloading";case"grabbing":return"Fetching the release for qBittorrent";case"completed":return e.autoImport?"Downloaded, importing soon":"Downloaded";case"importing":return"Importing";case"imported":return"Imported";case"failed":return"Failed";case"removed":return"Removed from qBittorrent";default:return e.status}}function hi(e){return e.status==="imported"?"var(--success)":e.status==="failed"||e.status==="removed"?"var(--error)":e.status==="importing"||e.status==="completed"||e.status==="grabbing"?"var(--warning)":"var(--text-secondary)"}function mi(e){return!e||e<=0||e>=864e4?"":e<60?`${e}s`:e<3600?`${Math.round(e/60)}m`:`${Math.floor(e/3600)}h ${Math.round(e%3600/60)}m`}function gi(e){var d,u,m,f;const t=Math.round((e.progress||0)*100),s=e.status==="downloading",a=s&&/paused|stopped/i.test(e.state||""),n=["completed","failed","imported"].includes(e.status)&&(e.progress||0)>=1,r=e.bookmarkId?`<a href="#/manga/${Ee(e.bookmarkId)}">open series</a>`:e.newSeriesTitle?`new series “${Ee(e.newSeriesTitle)}”`:"",i=e.importResult,l=i?[(d=i.volumes)!=null&&d.length?`${i.volumes.length} volume${i.volumes.length===1?"":"s"} (${i.volumes.map(E=>E.name).join(", ")})`:"",(u=i.chapters)!=null&&u.length?`${i.chapters.length} chapter${i.chapters.length===1?"":"s"}`:"",(m=i.skipped)!=null&&m.length?`${i.skipped.length} skipped`:""].filter(Boolean).join(" · "):"",c=[Mt(e.size),s&&e.dlspeed?`${Mt(e.dlspeed)}/s`:"",s?mi(e.eta):"",e.indexer||""].filter(Boolean).join(" · ");return`
    <div class="queue-card task-card torrent-card" data-hash="${Ee(e.hash)}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${h("download")}</span>
          <div>
            <div class="task-title" title="${Ee(e.releaseTitle||e.name)}">${Ee(e.name||e.releaseTitle)}</div>
            <div class="task-status" style="color: ${hi(e)}">${pi(e)}${r?` · ${r}`:""}</div>
          </div>
        </div>
        <div class="task-actions">
          ${s&&!a?`<button class="btn btn-sm btn-icon" data-taction="pause" title="Pause">${h("pause",{title:"Pause"})}</button>`:""}
          ${a?`<button class="btn btn-sm btn-icon" data-taction="resume" title="Resume">${h("play",{title:"Resume"})}</button>`:""}
          ${n?`<button class="btn btn-sm btn-secondary" data-taction="review" title="Choose what to import, and as what">${e.status==="imported"?"Import again":"Review import"}</button>${e.status==="imported"?"":`<button class="btn btn-sm btn-secondary" data-taction="import" title="Import everything at the detected numbers">${e.status==="failed"?"Retry import":"Import all"}</button>`}`:""}
          <button class="btn btn-sm btn-icon btn-danger" data-taction="remove" title="${["imported","grabbing"].includes(e.status)?"Remove from this list":"Remove from qBittorrent and this list"}">✕</button>
        </div>
      </div>
      <div class="queue-card-body">
        ${["imported","grabbing"].includes(e.status)?`<div class="task-current">${c}</div>`:`
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${t}%"></div>
          <span class="progress-text">${t}%${c?` · ${c}`:""}</span>
        </div>`}
        ${l?`<div class="task-current">${h("check")} ${Ee(l)}</div>`:""}
        ${(f=i==null?void 0:i.skipped)!=null&&f.length?`<ul class="task-error-list">${i.skipped.slice(0,4).map(E=>`<li>${Ee(E)}</li>`).join("")}</ul>`:""}
        ${e.error?`<div class="task-errors">${h("triangle-alert")} ${Ee(e.error)}</div>`:""}
      </div>
    </div>
  `}function fi(e){const t=e.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Wa(e.type)}</span>
          <div>
            <div class="task-title">${t.description||t.mangaTitle||e.type}</div>
            <div class="task-status" style="color: ${Ts(e.status)}">${_s(e.status)}</div>
          </div>
        </div>
      </div>
      ${e.started_at?`<div class="queue-card-body"><small>Started: ${As(e.started_at)}</small></div>`:""}
    </div>
  `}function vi(e){const t=e.data||{},s=e.result||{};let a="";if(e.type==="scrape")s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${e.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>');else if(e.type==="scan"||e.type==="scan-local")s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`);else if(e.type==="download"){if(e.status==="failed"&&e.error)a=`<div class="task-subtext" style="color: var(--color-error, #e05555);">${e.error}</div>`;else if(s.downloaded!==void 0){const n=[`${s.downloaded} chapter${s.downloaded===1?"":"s"} downloaded`];s.pages&&n.push(`${s.pages} pages`),s.failed&&n.push(`${s.failed} failed`);const r=(s.errors||[]).filter(i=>i.partial);r.length&&n.push(`${r.length} with missing pages`),a=`<div class="task-subtext" style="color: var(--text-secondary);">${n.join(" · ")}</div>`}}return`
    <div class="queue-card task-card history-card" data-history-id="${e.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Wa(e.type)}</span>
          <div>
            <div class="task-title">${t.description||t.mangaTitle||e.type}</div>
            <div class="task-status" style="color: ${Ts(e.status)}">${_s(e.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${e.completed_at?`<div class="queue-card-body"><small>Completed: ${As(e.completed_at)}</small></div>`:""}
    </div>
  `}function yi(){var c;const e=Object.entries(H.downloads),t=e.filter(([,d])=>d.status!=="complete"),s=e.filter(([,d])=>d.status==="complete"),a=new Set(t.map(([,d])=>d.bookmarkId).filter(Boolean)),n=H.queueTasks.filter(d=>{var u;return!(d.type==="download"&&((u=d.data)!=null&&u.mangaId)&&a.has(d.data.mangaId))}),r=H.torrents.filter(d=>["downloading","completed","importing"].includes(d.status)),i=t.length+n.length+r.length,l=((c=H.autoCheck)==null?void 0:c.schedules)||[];return`
    ${he("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>${h("list-checks")} Task Queue</h2>
        ${i>0?`<span class="queue-badge">${i} active</span>`:""}
      </div>

      ${H.torrents.length>0?`
        <div class="queue-section ${H.collapsed.torrents?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="torrents">
            <span class="collapse-icon">▼</span> Torrents (${r.length} active)
          </h3>
          <div class="queue-section-content">
            ${H.torrents.map(gi).join("")}
          </div>
        </div>
      `:""}

      ${t.length>0||n.length>0?`
        <div class="queue-section ${H.collapsed.active?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${t.map(([d,u])=>Zs(d,u)).join("")}
            ${n.map(d=>fi(d)).join("")}
          </div>
        </div>
      `:""}

      ${l.length>0?`
        <div class="queue-section ${H.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${l.length})
            </h3>
            ${di()}
          </div>
          <div class="queue-section-content">
            ${l.map(d=>ui(d)).join("")}
          </div>
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section ${H.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${s.map(([d,u])=>Zs(d,u)).join("")}
          </div>
        </div>
      `:""}

      ${H.historyTasks&&H.historyTasks.length>0?(()=>{const d=f=>{if(f.type!=="scrape")return!1;const E=f.result||{};return(f.status==="complete"||f.status==="completed")&&(E.newChaptersCount===0||E.updated===!1)},u=H.historyTasks.filter(d).length,m=H.showEmptyChecks?H.historyTasks:H.historyTasks.filter(f=>!d(f));return`
        <div class="queue-section ${H.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${u>0?`
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${H.showEmptyChecks?"Hide":"Show"} checks with no new chapters">
                    ${H.showEmptyChecks?`${h("chevron-up")} Hide`:`${h("chevron-down")} Show`} empty checks (${u})
                  </button>
                `:""}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  ${h("trash-2")} Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${m.length>0?m.map(f=>vi(f)).join(""):`
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${u>0?`${u} empty check(s) hidden.`:""}</p>
                  </div>
                `}
            </div>
        </div>
      `})():""}

      ${t.length===0&&n.length===0&&s.length===0&&l.length===0&&(!H.historyTasks||H.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">${h("check")}</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function Be(){try{const[e,t,s,a,n]=await Promise.all([g.getDownloads().catch(()=>({})),g.getQueueTasks().catch(()=>[]),g.getQueueHistory(50).catch(()=>[]),g.getAutoCheckStatus().catch(()=>null),g.getTorrentDownloads().catch(()=>({torrents:[]}))]);H.downloads=e||{},H.torrents=(n==null?void 0:n.torrents)||[],H.queueTasks=t||[],H.historyTasks=s||[],H.autoCheck=a,H.loading=!1}catch(e){console.error("[Queue] Failed to load data:",e),H.loading=!1}}function ge(){const e=document.getElementById("app");e&&(e.innerHTML=yi(),bi())}function bi(){Pe(),document.querySelectorAll("[data-toggle]").forEach(a=>{a.addEventListener("click",n=>{const r=a.dataset.toggle;H.collapsed[r]=!H.collapsed[r],ge()})});const e=document.getElementById("run-autocheck-btn");e&&e.addEventListener("click",async()=>{e.disabled=!0,e.innerHTML=`${h("loader",{spin:!0})} Running...`;try{p("Auto-check started...","info");const a=await g.runAutoCheck();p(`Check complete: ${a.checked} checked, ${a.updated} updated`,"success"),await Be(),ge()}catch(a){p("Auto-check failed: "+a.message,"error"),e.disabled=!1,e.innerHTML=`${h("play")} Run Now`}});const t=document.getElementById("clear-history-btn");t&&t.addEventListener("click",async a=>{if(a.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await g.clearQueueHistory(),p("History cleared","success"),await Be(),ge()}catch(n){p(`Failed to clear history: ${n.message}`,"error")}});const s=document.getElementById("toggle-empty-checks-btn");s&&s.addEventListener("click",a=>{a.stopPropagation(),H.showEmptyChecks=!H.showEmptyChecks,ge()}),document.querySelectorAll(".scheduled-manga-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.mangaId;n&&(window.location.hash=`#/manga/${n}`)})}),document.querySelectorAll(".torrent-card [data-taction]").forEach(a=>{a.addEventListener("click",async n=>{var c,d,u,m;n.stopPropagation();const r=a.closest(".torrent-card").dataset.hash,i=H.torrents.find(f=>f.hash===r),l=a.dataset.taction;try{if(l==="pause")await g.pauseTorrent(r);else if(l==="resume")await g.resumeTorrent(r);else if(l==="review"){ii(i,{onImported:async()=>{await Be(),ge()}});return}else if(l==="import"){a.disabled=!0,a.textContent="Importing…";const f=await g.importTorrent(r),E=((d=(c=f.summary)==null?void 0:c.volumes)==null?void 0:d.length)||0,x=((m=(u=f.summary)==null?void 0:u.chapters)==null?void 0:m.length)||0;p(`Imported ${E} volume${E===1?"":"s"}${x?` and ${x} chapter${x===1?"":"s"}`:""}`,"success")}else if(l==="remove"){const f=i&&["imported","removed"].includes(i.status);if(!f&&!confirm(`Remove "${(i==null?void 0:i.name)||"this torrent"}" from qBittorrent and stop tracking it?`))return;const E=!f&&confirm("Also delete its downloaded files from disk?");await g.removeTorrent(r,{deleteFiles:E,fromClient:!f}),p("Torrent removed","info")}await Be(),ge()}catch(f){p(`Action failed: ${f.message}`,"error"),await Be(),ge()}})}),document.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const r=a.dataset.action,i=a.dataset.task;if(r==="open-site"){Bs(a.dataset.site,a.dataset.url);return}if(r==="import-cookies"){Ms({site:a.dataset.site,url:a.dataset.url,stale:a.dataset.stale==="1"});return}try{if(r==="pause")await g.pauseDownload(i),p("Download paused","info");else if(r==="resume")await g.resumeDownload(i),p("Download resumed","info");else if(r==="cancel")confirm("Cancel this download?")&&(await g.cancelDownload(i),p("Download cancelled","info"));else if(r==="retry"){const l=await g.retryDownload(i);p(`Retrying ${l.chapters.length} chapter${l.chapters.length===1?"":"s"}`,"info")}await Be(),ge()}catch(l){p(`Action failed: ${l.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.historyId,r=document.getElementById(`task-details-${n}`);r&&r.classList.toggle("hidden")})})}async function wi(){H.loading=!0;const e=document.getElementById("app");e.innerHTML=`
    ${he("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>${h("list-checks")} Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,Pe(),await Be(),ge(),kt=setInterval(async()=>{await Be(),ge()},5e3),ce.downloadProgress=t=>{t.taskId&&H.downloads[t.taskId]&&(Object.assign(H.downloads[t.taskId],t),ge())},ce.downloadCompleted=t=>{Be().then(ge)},ce.queueUpdated=t=>{Be().then(ge)},ce.torrentUpdate=t=>{Array.isArray(t==null?void 0:t.torrents)&&(H.torrents=t.torrents,ge())},ee.on(ae.DOWNLOAD_PROGRESS,ce.downloadProgress),ee.on(ae.DOWNLOAD_COMPLETED,ce.downloadCompleted),ee.on(ae.QUEUE_UPDATED,ce.queueUpdated),ee.on(ae.TORRENT_UPDATE,ce.torrentUpdate)}function $i(){kt&&(clearInterval(kt),kt=null),ce.downloadProgress&&ee.off(ae.DOWNLOAD_PROGRESS,ce.downloadProgress),ce.downloadCompleted&&ee.off(ae.DOWNLOAD_COMPLETED,ce.downloadCompleted),ce.queueUpdated&&ee.off(ae.QUEUE_UPDATED,ce.queueUpdated),ce.torrentUpdate&&ee.off(ae.TORRENT_UPDATE,ce.torrentUpdate),ce={}}const ki={mount:wi,unmount:$i};function Le(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ei(e){if(!e)return"";const t=Math.floor((Date.now()-new Date(e).getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t}m ago`;const s=Math.floor(t/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}class Si{constructor(){this.container=null,this.scrapers=[],this.siteStatus={challenges:[],sessions:[]},this.onSiteStatusChange=null,this.currentQuery="",this.currentTarget="all",this.isSearching=!1,this.results=[],this.viewMode="main",this.browseScraper=null,this.browseQuery="",this.browseSort="popular",this.browsePage=1,this.browseTotalPages=1,this.isBrowsing=!1,this.browseResults=[],this.previewInfo=null,this.previewImages=[],this.previewIndex=0,this.infoAbortController=null}async mount(t){this.container=document.getElementById("app"),document.body.className="scrapers-mode";const s=new URLSearchParams(window.location.hash.split("?")[1]||""),a=s.get("browse"),n=s.get("q");a&&(this.browseScraper=a,this.viewMode="browse",this.browseQuery=n||"",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1),this.updateView(),this.onSiteStatusChange=()=>this.loadSiteStatus(),ee.on(ae.SITE_SESSION,this.onSiteStatusChange),ee.on(ae.SITE_CHALLENGE,this.onSiteStatusChange),ee.on(ae.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),await this.loadScrapers(),this.viewMode==="browse"&&this.browseScraper?(a&&(this.startBrowse(a,{query:n||null}),this.updateView()),this.performBrowse()):n&&(this.currentQuery=n,this.updateView(),this.performSearch())}unmount(){this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.onSiteStatusChange&&(ee.off(ae.SITE_SESSION,this.onSiteStatusChange),ee.off(ae.SITE_CHALLENGE,this.onSiteStatusChange),ee.off(ae.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),this.onSiteStatusChange=null),this.container.innerHTML="",document.body.className=""}async loadScrapers(){try{const[t,s]=await Promise.all([g.get("/scrapers/list"),g.getSiteStatus().catch(()=>({challenges:[],sessions:[]}))]);this.siteStatus=s||{challenges:[],sessions:[]},t.success&&(this.scrapers=t.scrapers,this.updateView())}catch(t){console.error("Failed to load scrapers",t)}}async loadSiteStatus(){try{this.siteStatus=await g.getSiteStatus()}catch{return}document.getElementById("scraper-cards-list")&&(this.renderScraperList(),this.bindCardEvents())}sessionFor(t){return(this.siteStatus.sessions||[]).find(s=>s.site===t)||null}browseConfig(t=this.browseScraper){const s=this.scrapers.find(n=>n.name===t),a=s&&s.browseOptions;return{sorts:a&&a.sorts&&a.sorts.length?a.sorts:[{value:"popular",label:"Popular"}],defaultSort:a&&a.defaultSort||"popular",defaultQuery:a&&a.defaultQuery||"",queryLabel:a&&a.queryLabel||"Search",queryPlaceholder:a&&a.queryPlaceholder||"Optional: title to search for"}}startBrowse(t,{query:s=null,sort:a=null}={}){const n=this.browseConfig(t);this.browseScraper=t,this.viewMode="browse",this.browseQuery=s??n.defaultQuery,this.browseSort=a&&n.sorts.some(r=>r.value===a)?a:n.defaultSort,this.browsePage=1,this.browseResults=[],this.browseTotalPages=1}challengeFor(t){return(this.siteStatus.challenges||[]).find(s=>s.site===t)||null}renderSessionRow(t){if(!t.supportsSession)return"";const s=this.sessionFor(t.name),a=this.challengeFor(t.name);let n;if(s&&s.stale)n=`<span class="capability-pill capability-soon" title="${Le(s.staleReason||"The site showed its check again")}">${h("triangle-alert")} Rejected, paste fresh</span>`;else if(s&&s.cookieCount===0)n=`<span class="capability-pill capability-soon" title="Every saved cookie has expired">${h("triangle-alert")} Expired, paste fresh</span>`;else if(s){const r=Ei(s.updatedAt||s.importedAt),i=Y.isAdmin?`${(s.cookieNames||[]).join(", ")}${s.userAgent?`
${s.userAgent}`:""}`:"";n=`<span class="capability-pill capability-yes" title="${Le(i)}">✓ ${s.cookieCount} cookie${s.cookieCount===1?"":"s"}${r?` · ${r}`:""}</span>`}else a?n=`<span class="capability-pill capability-soon">${h("triangle-alert")} Check pending</span>`:n='<span class="capability-pill capability-no">None</span>';return`
      <div class="capability-row">
        <span class="capability-label" title="Cookies from a browser that completed the site's human check">${h("lock-open")} Session</span>
        <span class="scraper-session-cell">
          ${n}
          ${s&&Y.isAdmin?`<button type="button" class="scraper-session-forget" data-scraper="${Le(t.name)}" title="Forget these cookies">Forget</button>`:""}
        </span>
      </div>`}bindCardEvents(){document.querySelectorAll(".scraper-search-card-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper;this.currentTarget=a;const n=document.getElementById("scraper-query");n&&(this.currentQuery=n.value.trim()),this.updateView();const r=document.getElementById("scraper-query");r&&(r.focus(),window.scrollTo({top:0,behavior:"smooth"}),this.currentQuery&&this.performSearch())})}),document.querySelectorAll(".scraper-browse-card-btn").forEach(t=>{t.addEventListener("click",s=>{this.startBrowse(s.currentTarget.dataset.scraper),this.updateView(),this.performBrowse()})}),document.querySelectorAll(".scraper-session-card-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper,n=this.challengeFor(a),r=this.sessionFor(a),i=!!r&&(r.stale||r.cookieCount===0);Ms({site:a,url:n==null?void 0:n.url,stale:i,onImported:()=>this.loadSiteStatus()})})}),document.querySelectorAll(".scraper-session-forget").forEach(t=>{t.addEventListener("click",async s=>{const a=s.currentTarget.dataset.scraper;if(confirm(`Forget the saved ${a} cookies? The scraper goes back to its own identity.`))try{(await g.forgetSiteSession(a)).purged===null?p(`${a}: cookies forgotten, but they may stay in the scraper browser until it restarts`,"warning"):p(`${a}: saved cookies forgotten`,"info"),await this.loadSiteStatus()}catch(n){p(`Failed: ${n.message}`,"error")}})})}updateView(){this.render(),this.renderScraperList(),(this.results.length>0||this.isSearching)&&this.renderResults(),this.bindEvents()}render(){this.container.innerHTML=`
      ${he()}
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
                ${Y.canDownload?`<button type="button" class="btn btn-secondary" id="torrent-search-btn" title="Search the torrent indexers (Prowlarr) for volume releases">${h("package")} Volumes</button>`:""}
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
            <label>${Le(this.browseConfig().queryLabel)}</label>
            <input type="text" id="browse-query" class="browse-input" value="${Le(this.browseQuery)}" placeholder="${Le(this.browseConfig().queryPlaceholder)}">
          </div>
          <div class="browse-form-group" style="min-width: 150px;">
            <label>Sort By</label>
            <select id="browse-sort" class="browse-select">
              ${this.browseConfig().sorts.map(t=>`<option value="${Le(t.value)}" ${this.browseSort===t.value?"selected":""}>${Le(t.label)}</option>`).join("")}
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
    `,Pe()}renderScraperList(){const t=document.getElementById("scraper-cards-list");if(!t)return;if(this.scrapers.length===0){t.innerHTML=`
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
            ${n.supportsSession&&Y.isAdmin?`
            <button
              class="btn btn-secondary scraper-session-card-btn"
              data-scraper="${Le(n.name)}"
              title="Hand over cookies from a browser that completed ${Le(n.name)}'s human check"
            >${h("lock-open")} Cookies</button>`:""}
          </div>

        </div>
      `);t.innerHTML=a.join("")}getDomainIcon(t){const s=t.toLowerCase();return s.includes("comix")?h("library"):s.includes("mangahere")?h("book-open"):s.includes("nhentai")?h("shield-alert"):s.includes("chained")?h("link"):h("globe")}bindEvents(){const t=document.getElementById("scraper-search-form");t&&t.addEventListener("submit",E=>{E.preventDefault();const x=document.getElementById("scraper-query");x&&x.value.trim()&&(this.currentQuery=x.value.trim(),this.performSearch())});const s=document.getElementById("torrent-search-btn");s&&s.addEventListener("click",async()=>{var b;const E=(((b=document.getElementById("scraper-query"))==null?void 0:b.value)||"").trim();let x=[];try{const L=await g.getBookmarks();x=(Array.isArray(L)?L:L.bookmarks||[]).map(y=>({id:y.id,title:y.title,alias:y.alias})).sort((y,C)=>(y.alias||y.title).localeCompare(C.alias||C.title))}catch{}Na({query:E,library:x})});const a=document.getElementById("clear-target-btn");a&&a.addEventListener("click",()=>{this.currentTarget="all",this.updateView();const E=document.getElementById("scraper-query");E&&E.focus()}),this.bindCardEvents();const n=document.getElementById("exit-browse-btn");n&&n.addEventListener("click",()=>{this.viewMode="main",this.updateView()});const r=document.getElementById("browse-apply-btn");r&&r.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse()});const i=document.getElementById("browse-refresh-btn");i&&i.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse(!1,!0)});const l=document.getElementById("browse-query");l&&l.addEventListener("keypress",E=>{E.key==="Enter"&&r.click()});const c=document.getElementById("browse-load-more-btn");c&&c.addEventListener("click",()=>{!this.isBrowsing&&this.browsePage<this.browseTotalPages&&(this.browsePage++,this.performBrowse(!0))});const d=document.getElementById("preview-close-btn");d&&d.addEventListener("click",()=>{this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),document.getElementById("preview-info-modal").style.display="none"});const u=document.getElementById("preview-add-btn");u&&u.addEventListener("click",()=>{this.previewInfo&&this.previewInfo.url&&this.openAddModal(this.previewInfo.url,u)});const m=document.getElementById("preview-read-btn");m&&m.addEventListener("click",()=>{m.disabled||(this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.openTempReader())});const f=document.getElementById("temp-reader-close");f&&f.addEventListener("click",()=>{document.getElementById("temp-reader-overlay").style.display="none"})}async performSearch(){const t=document.getElementById("scraper-results-container"),s=document.getElementById("scraper-search-btn");if(!t||!s)return;this.isSearching=!0,t.style.display="block",s.textContent="Searching...",s.disabled=!0;const a=this.currentTarget==="all"?"all sites":this.currentTarget;t.innerHTML=`
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
      `;return}let s='<div class="library-grid" style="margin-top: 2rem;">';this.results.forEach(a=>{const n=a.cover||"";let r="";n.startsWith("/covers/")?r=n:n&&(r=`/api/scrapers/proxy-cover?url=${encodeURIComponent(n)}`);const i=r?_e(r,"Cover",{kind:"series",self:!0}):ye("series");s+=`
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
      `}),s+="</div>",t.innerHTML=s,setTimeout(()=>{document.querySelectorAll(".scraper-result-card").forEach(a=>{a.addEventListener("click",n=>{n.target.closest(".add-from-search-btn")||window.open(a.dataset.url,"_blank")})}),document.querySelectorAll(".add-from-search-btn").forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation();const r=n.target.dataset.url;this.openAddModal(r,n.target)})})},100)}async _addToLibraryAndWait(t){const s=await g.addBookmark(t);if(!s.jobId)throw new Error("No job ID returned");return new Promise((a,n)=>{const r=setInterval(async()=>{try{const l=(await g.getQueueHistory(20)).find(c=>c.id===s.jobId);l&&(l.status==="completed"?(clearInterval(r),l.result&&l.result.bookmark?a(l.result.bookmark):n(new Error("Job completed but returned no bookmark"))):l.status==="failed"&&(clearInterval(r),n(new Error(l.error))))}catch{}},1e3)})}async openAddModal(t,s){const a=s?s.textContent:"+ Add to Library";s&&(s.textContent="Adding...");try{const n=await this._addToLibraryAndWait(t);document.getElementById("preview-info-modal").style.display="none",window.location.hash=`#/manga/${n.id}`}catch(n){alert("Error adding manga: "+n.message)}finally{s&&(s.textContent=a)}}async performBrowse(t=!1,s=!1){const a=document.getElementById("browse-results-container"),n=document.getElementById("browse-load-more-btn"),r=document.getElementById("browse-loading-indicator"),i=document.getElementById("browse-pagination");if(a){this.isBrowsing=!0,t?(n.style.display="none",r.style.display="block",document.getElementById("browse-loading-page").textContent=this.browsePage):(a.innerHTML=`
        <div class="loading-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="spinner"></div>
          <p>Browsing ${this.browseScraper}...</p>
        </div>
      `,i.style.display="none");try{let l=`/scrapers/browse?scraper=${encodeURIComponent(this.browseScraper)}&q=${encodeURIComponent(this.browseQuery)}&sort=${encodeURIComponent(this.browseSort)}&page=${this.browsePage}`;s&&(l+="&refresh=true");const c=await g.get(l);if(c.success)t?this.browseResults=[...this.browseResults,...c.results||[]]:this.browseResults=c.results||[],this.browseTotalPages=c.totalPages||1,this.renderBrowseResults(t);else throw new Error(c.error||"Failed to browse")}catch(l){console.error("Browse error",l),t?alert("Failed to load more results: "+l.message):a.innerHTML=`<div class="error-state" style="grid-column: 1/-1; margin-top: 2rem;">Failed to load browse results: ${l.message}</div>`}finally{this.isBrowsing=!1,t&&(n.style.display="inline-block",r.style.display="none")}}}renderBrowseResults(t){const s=document.getElementById("browse-results-container"),a=document.getElementById("browse-pagination");if(this.browseResults.length===0){s.innerHTML=`
        <div class="empty-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="empty-icon">${h("search-x")}</div>
          <p>No results found.</p>
        </div>
      `,a.style.display="none";return}let n="";this.browseResults.forEach((r,i)=>{const l=r.cover||"";let c="";l.startsWith("/covers/")?c=l:l&&(c=`/api/scrapers/proxy-cover?url=${encodeURIComponent(l)}`);const d=c?_e(c,"Cover",{kind:"series",self:!0}):ye("series");n+=`
        <div class="manga-card browse-result-card" data-index="${i}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${d}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${r.website||this.browseScraper}</span>
            </div>
          </div>
          <div class="manga-card-title" title="${r.title}">${r.title}</div>
        </div>
      `}),s.innerHTML=n,this.browsePage<this.browseTotalPages?a.style.display="block":a.style.display="none",setTimeout(()=>{document.querySelectorAll(".browse-result-card").forEach(r=>{r.addEventListener("click",()=>{const i=parseInt(r.dataset.index),l=this.browseResults[i];l&&this.openInfoModal(l)})})},100)}async openInfoModal(t){var i;this.infoAbortController&&this.infoAbortController.abort(),this.infoAbortController=new AbortController;const s=this.infoAbortController.signal,a=document.getElementById("preview-info-modal"),n=document.getElementById("preview-info-body"),r=document.getElementById("preview-read-btn");this.previewInfo=t,a.style.display="flex",n.innerHTML=`
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
         <div style="flex: 0 0 200px; max-width: 100%;">
            <div class="manga-card-cover" style="height: 280px; border-radius: 8px;">
               ${t.cover?`<img src="${t.cover.startsWith("/covers/")?t.cover:"/api/scrapers/proxy-cover?url="+encodeURIComponent(t.cover)}" style="width: 100%; height: 100%; object-fit: cover;">`:ye("series")}
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
    `,this._setReadBtnEnabled(r,!1);try{const l=await g.get(`/scrapers/info?url=${encodeURIComponent(t.url)}`,{signal:s});if(l.success&&l.info){this.previewInfo={...this.previewInfo,...l.info},Array.isArray(l.info.chapters)&&l.info.chapters.length>1&&((i=l.info.chapters[0])!=null&&i.url)&&(this.previewInfo.readUrl=l.info.chapters[0].url);let c="";l.info.tags&&l.info.tags.length>0&&(c=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Tags</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${l.info.tags.map(u=>`<span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); font-weight: normal; font-size: 0.75rem;">${u}</span>`).join("")}
                 </div>
               </div>
             `);let d="";l.info.artists&&l.info.artists.length>0&&(d=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Artists</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${l.info.artists.map(u=>`<span class="badge badge-chapters">${u}</span>`).join("")}
                 </div>
               </div>
             `),document.getElementById("preview-extended-info").innerHTML=`
             <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; background: var(--bg-color); padding: 1rem; border-radius: 8px;">
               <div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Pages / Ch</div>
                  <div style="font-weight: bold;">${l.info.pageCount||l.info.totalChapters||"?"}</div>
               </div>
               ${l.info.displayId?`
                 <div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Gallery ID</div>
                    <div style="font-weight: bold;">${l.info.displayId}</div>
                 </div>
               `:""}
             </div>
             ${d}
             ${c}
          `,this._setReadBtnEnabled(r,!0)}else document.getElementById("preview-extended-info").innerHTML='<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>',(this.previewInfo.galleryId||this.previewInfo.url)&&this._setReadBtnEnabled(r,!0)}catch(l){if(l.name==="AbortError"||s.aborted){console.log("Scraper details fetch aborted successfully.");return}console.error("Info error:",l),document.getElementById("preview-extended-info").innerHTML=`<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${l.message}</p>`,this._setReadBtnEnabled(r,!0)}}_setReadBtnEnabled(t,s){t&&(t.disabled=!s,t.style.opacity=s?"1":"0.5",t.style.cursor=s?"pointer":"not-allowed",t.style.pointerEvents=s?"auto":"none")}async openTempReader(){if(!this.previewInfo||!this.previewInfo.url&&!this.previewInfo.galleryId)return;const t=this.previewInfo.readUrl||this.previewInfo.url||`https://nhentai.net/g/${this.previewInfo.galleryId}/`,s=this.browseScraper||this.previewInfo.website;sessionStorage.setItem("streamPreviewUrl",t),sessionStorage.setItem("streamPreviewTitle",this.previewInfo.title||"Preview"),s?sessionStorage.setItem("streamPreviewScraper",s):sessionStorage.removeItem("streamPreviewScraper"),document.getElementById("preview-info-modal").style.display="none",window.location.hash="#/read/stream/preview"}}const Ci=new Si,ea={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};let P=null;function xi(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ta(e,t=0){for(let s=e.length-1;s>t;s--){const a=t+Math.floor(Math.random()*(s-t+1));[e[s],e[a]]=[e[a],e[s]]}}function Li(e){let t;return typeof e=="string"?t=e:e&&typeof e=="object"&&(t=e.filename||e.path||e.name||e.url),t?(t.includes("/")&&(t=t.split("/").pop()),t.includes("\\")&&(t=t.split("\\").pop()),t):null}function Ii(e){return h(e==="gallery"?"folder":e==="trophy"?"trophy":"book-open")}function Bi(e,t){const s=[];for(const a of e){if(t.has(a.id))continue;const n=a.alias||a.title;for(const r of a.volumes)r.cover&&s.push({url:r.cover,title:n,subtitle:r.name,kind:"volume"})}return s}async function Mi(){var a,n;const e=await g.getFavorites(),t=(a=e.listOrder)!=null&&a.length?e.listOrder:Object.keys(e.favorites||{}),s=[];for(const r of t)for(const i of((n=e.favorites)==null?void 0:n[r])||[])for(const l of i.imagePaths||[]){const c=Li(l);c&&s.push({url:`/api/public/chapter-images/${i.mangaId}/${i.chapterNum}/${encodeURIComponent(c)}`,title:r,subtitle:i.mangaTitle?`${i.mangaTitle} · Ch. ${i.chapterNum}`:`Ch. ${i.chapterNum}`,kind:"gallery"})}return s}async function Ai(e){const t=await g.get("/trophy-pages"),s=await fe.loadBookmarks().catch(()=>[]),a=r=>{const i=s.find(l=>l.id===r);return i?i.alias||i.title:"Trophies"},n=[];for(const[r,i]of Object.entries(t||{}))if(!e.has(r))for(const[l,c]of Object.entries(i||{})){const d=Object.keys(c||{});if(d.length===0)continue;let u;try{u=(await g.getChapterImages(r,l)).images||[]}catch{continue}for(const m of d){const f=u[m];if(!f)continue;let E=typeof f=="string"?f.split("/").pop():(f==null?void 0:f.filename)||(f==null?void 0:f.path);if(E){try{E=decodeURIComponent(E)}catch{}n.push({url:`/api/public/chapter-images/${r}/${l}/${encodeURIComponent(E)}`,title:a(r),subtitle:`Ch. ${l} · Trophy`,kind:"trophy"})}}}return n}function Ka(){P&&(clearTimeout(P.timer),P.playing&&P.slides.length>1&&(P.timer=setTimeout(()=>Ie(P.index+1),P.config.intervalMs)))}function ms(){if(!P)return;const e=P.slides[P.index],t=document.getElementById("ss-counter"),s=document.getElementById("ss-title"),a=document.getElementById("ss-subtitle");t&&(t.textContent=P.slides.length?`${P.index+1} / ${P.slides.length}`:""),s&&e&&(s.innerHTML=`${Ii(e.kind)} ${xi(e.title)}`),a&&e&&(a.textContent=e.subtitle||"")}function Ie(e){if(!P||P.slides.length===0)return;const t=(e%P.slides.length+P.slides.length)%P.slides.length;P.index=t;const s=P.slides[t],a=++P.loadToken,n=1-P.activeLayer,r=P.layers[n],i=P.layers[P.activeLayer];r.onload=()=>{if(!(!P||a!==P.loadToken)&&(P.activeLayer=n,r.classList.add("active"),i.classList.remove("active"),ms(),Ka(),P.slides.length>1)){const l=P.slides[(t+1)%P.slides.length];l&&(new Image().src=l.url)}},r.onerror=()=>{if(!(!P||a!==P.loadToken)){if(P.slides.splice(t,1),P.slides.length===0){fs();return}Ie(t)}},r.src=s.url,ms()}function sa(e){if(!P)return;P.playing=e;const t=document.getElementById("ss-play");t&&(t.innerHTML=h(e?"pause":"play")),Ka()}function ke(){if(!P)return;const e=document.getElementById("slideshow");e&&(e.classList.remove("controls-hidden"),clearTimeout(P.hideTimer),P.hideTimer=setTimeout(()=>{var t;(t=document.getElementById("slideshow"))==null||t.classList.add("controls-hidden")},3e3))}function gs(){F.go("/settings")}function fs(){var t;const e=document.getElementById("slideshow");e&&(e.innerHTML=`
        <div class="slideshow-empty">
            ${h("images",{size:48})}
            <p>Nothing to show yet — add covers to your volumes, or enable galleries and trophies in Settings.</p>
            <button id="ss-empty-back" class="btn btn-primary">Back to Settings</button>
        </div>
    `,(t=document.getElementById("ss-empty-back"))==null||t.addEventListener("click",gs))}const Ti={mount:async()=>{const e=document.getElementById("app");e.innerHTML=`
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
        `;const t=document.getElementById("ss-stage");P={slides:[],index:0,playing:!0,timer:null,hideTimer:null,loadToken:0,activeLayer:0,layers:[...t.querySelectorAll(".slideshow-img")],config:{...ea},keyHandler:null,moveHandler:null},document.getElementById("ss-exit").addEventListener("click",gs),document.getElementById("ss-prev").addEventListener("click",()=>{Ie(P.index-1),ke()}),document.getElementById("ss-next").addEventListener("click",()=>{Ie(P.index+1),ke()}),document.getElementById("ss-play").addEventListener("click",()=>{sa(!P.playing),ke()}),document.getElementById("ss-fullscreen").addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>p("Fullscreen not supported","info"))}),t.addEventListener("click",c=>{const d=c.clientX/window.innerWidth;if(d<.3)Ie(P.index-1),ke();else if(d>.7)Ie(P.index+1),ke();else{const u=document.getElementById("slideshow");u.classList.contains("controls-hidden")?ke():(clearTimeout(P.hideTimer),u.classList.add("controls-hidden"))}}),P.keyHandler=c=>{if(P)switch(c.key){case"ArrowLeft":Ie(P.index-1),ke();break;case"ArrowRight":Ie(P.index+1),ke();break;case" ":c.preventDefault(),sa(!P.playing),ke();break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});break;case"Escape":document.fullscreenElement||gs();break}},document.addEventListener("keydown",P.keyHandler),P.moveHandler=()=>ke(),document.addEventListener("mousemove",P.moveHandler),ke();let s={};try{s=await g.get("/settings")||{}}catch{}P.config={...ea,...s.slideshow||{}};const a=new Set(P.config.disabledMangaIds||[]);let n=[];try{n=await g.getAllVolumes()}catch(c){console.error(c)}P.slides=Bi(n,a),P.config.shuffle&&ta(P.slides,-1);const r=document.getElementById("ss-loading");P.slides.length>0&&(r==null||r.remove(),Ie(0));const i=c=>{var u;if(!P||c.length===0)return;const d=P.slides.length===0;P.slides.push(...c),P.config.shuffle&&ta(P.slides,d?-1:P.index),d?((u=document.getElementById("ss-loading"))==null||u.remove(),Ie(0)):ms()},l=[];P.config.includeLists&&l.push(Mi().then(i).catch(c=>console.warn("Slideshow: galleries unavailable",c))),P.config.includeTrophies&&l.push(Ai(a).then(i).catch(c=>console.warn("Slideshow: trophies unavailable",c))),P.slides.length===0&&(l.length===0?fs():Promise.allSettled(l).then(()=>{P&&P.slides.length===0&&fs()}))},unmount:()=>{P&&(clearTimeout(P.timer),clearTimeout(P.hideTimer),document.removeEventListener("keydown",P.keyHandler),document.removeEventListener("mousemove",P.moveHandler),document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),P=null)}};class _i{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(t,s){this.routes.set(t,s)}async navigate(){console.log("[Router] navigate called");const s=(window.location.hash.slice(1)||"/").split("?")[0],[a,...n]=s.split("/").filter(Boolean),r=`/${a||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let i=this.routes.get(r);!i&&this.routes.has("/")&&(i=this.routes.get("/")),i&&(this.currentRoute=r,this.currentView=i,i.mount&&(console.log("[Router] calling mount on view module"),await i.mount(n)),Pe())}go(t){window.location.hash=t}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),Pe())}}const F=new _i;F.register("/",yr);F.register("/manga",_o);F.register("/read",jr);F.register("/series",Uo);F.register("/settings",zo);F.register("/admin",Qo);F.register("/favorites",ai);F.register("/queue",ki);F.register("/scrapers",Ci);F.register("/slideshow",Ti);export{ae as S,ee as a,Di as i,F as r,Ri as s};
