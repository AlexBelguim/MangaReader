import{a as v}from"./api-BPljbFn_.js";const oe=Object.create(null);oe.open="0";oe.close="1";oe.ping="2";oe.pong="3";oe.message="4";oe.upgrade="5";oe.noop="6";const Pe=Object.create(null);Object.keys(oe).forEach(s=>{Pe[oe[s]]=s});const Ze={type:"error",data:"parser error"},Tt=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Mt=typeof ArrayBuffer=="function",Rt=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s&&s.buffer instanceof ArrayBuffer,ht=({type:s,data:e},t,a)=>Tt&&e instanceof Blob?t?a(e):$t(e,a):Mt&&(e instanceof ArrayBuffer||Rt(e))?t?a(e):$t(new Blob([e]),a):a(oe[s]+(e||"")),$t=(s,e)=>{const t=new FileReader;return t.onload=function(){const a=t.result.split(",")[1];e("b"+(a||""))},t.readAsDataURL(s)};function xt(s){return s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new Uint8Array(s.buffer,s.byteOffset,s.byteLength)}let Ge;function os(s,e){if(Tt&&s.data instanceof Blob)return s.data.arrayBuffer().then(xt).then(e);if(Mt&&(s.data instanceof ArrayBuffer||Rt(s.data)))return e(xt(s.data));ht(s,!1,t=>{Ge||(Ge=new TextEncoder),e(Ge.encode(t))})}const St="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ee=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let s=0;s<St.length;s++)Ee[St.charCodeAt(s)]=s;const rs=s=>{let e=s.length*.75,t=s.length,a,n=0,o,r,d,l;s[s.length-1]==="="&&(e--,s[s.length-2]==="="&&e--);const p=new ArrayBuffer(e),y=new Uint8Array(p);for(a=0;a<t;a+=4)o=Ee[s.charCodeAt(a)],r=Ee[s.charCodeAt(a+1)],d=Ee[s.charCodeAt(a+2)],l=Ee[s.charCodeAt(a+3)],y[n++]=o<<2|r>>4,y[n++]=(r&15)<<4|d>>2,y[n++]=(d&3)<<6|l&63;return p},ls=typeof ArrayBuffer=="function",pt=(s,e)=>{if(typeof s!="string")return{type:"message",data:Dt(s,e)};const t=s.charAt(0);return t==="b"?{type:"message",data:cs(s.substring(1),e)}:Pe[t]?s.length>1?{type:Pe[t],data:s.substring(1)}:{type:Pe[t]}:Ze},cs=(s,e)=>{if(ls){const t=rs(s);return Dt(t,e)}else return{base64:!0,data:s}},Dt=(s,e)=>{switch(e){case"blob":return s instanceof Blob?s:new Blob([s]);case"arraybuffer":default:return s instanceof ArrayBuffer?s:s.buffer}},Nt="",ds=(s,e)=>{const t=s.length,a=new Array(t);let n=0;s.forEach((o,r)=>{ht(o,!1,d=>{a[r]=d,++n===t&&e(a.join(Nt))})})},us=(s,e)=>{const t=s.split(Nt),a=[];for(let n=0;n<t.length;n++){const o=pt(t[n],e);if(a.push(o),o.type==="error")break}return a};function hs(){return new TransformStream({transform(s,e){os(s,t=>{const a=t.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const o=new DataView(n.buffer);o.setUint8(0,126),o.setUint16(1,a)}else{n=new Uint8Array(9);const o=new DataView(n.buffer);o.setUint8(0,127),o.setBigUint64(1,BigInt(a))}s.data&&typeof s.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(t)})}})}let Ke;function Be(s){return s.reduce((e,t)=>e+t.length,0)}function Ae(s,e){if(s[0].length===e)return s.shift();const t=new Uint8Array(e);let a=0;for(let n=0;n<e;n++)t[n]=s[0][a++],a===s[0].length&&(s.shift(),a=0);return s.length&&a<s[0].length&&(s[0]=s[0].slice(a)),t}function ps(s,e){Ke||(Ke=new TextDecoder);const t=[];let a=0,n=-1,o=!1;return new TransformStream({transform(r,d){for(t.push(r);;){if(a===0){if(Be(t)<1)break;const l=Ae(t,1);o=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(Be(t)<2)break;const l=Ae(t,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(Be(t)<8)break;const l=Ae(t,8),p=new DataView(l.buffer,l.byteOffset,l.length),y=p.getUint32(0);if(y>Math.pow(2,21)-1){d.enqueue(Ze);break}n=y*Math.pow(2,32)+p.getUint32(4),a=3}else{if(Be(t)<n)break;const l=Ae(t,n);d.enqueue(pt(o?l:Ke.decode(l),e)),a=0}if(n===0||n>s){d.enqueue(Ze);break}}}})}const qt=4;function j(s){if(s)return ms(s)}function ms(s){for(var e in j.prototype)s[e]=j.prototype[e];return s}j.prototype.on=j.prototype.addEventListener=function(s,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+s]=this._callbacks["$"+s]||[]).push(e),this};j.prototype.once=function(s,e){function t(){this.off(s,t),e.apply(this,arguments)}return t.fn=e,this.on(s,t),this};j.prototype.off=j.prototype.removeListener=j.prototype.removeAllListeners=j.prototype.removeEventListener=function(s,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+s];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+s],this;for(var a,n=0;n<t.length;n++)if(a=t[n],a===e||a.fn===e){t.splice(n,1);break}return t.length===0&&delete this._callbacks["$"+s],this};j.prototype.emit=function(s){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+s],a=1;a<arguments.length;a++)e[a-1]=arguments[a];if(t){t=t.slice(0);for(var a=0,n=t.length;a<n;++a)t[a].apply(this,e)}return this};j.prototype.emitReserved=j.prototype.emit;j.prototype.listeners=function(s){return this._callbacks=this._callbacks||{},this._callbacks["$"+s]||[]};j.prototype.hasListeners=function(s){return!!this.listeners(s).length};const ze=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),X=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),gs="arraybuffer";function Ft(s,...e){return e.reduce((t,a)=>(s.hasOwnProperty(a)&&(t[a]=s[a]),t),{})}const fs=X.setTimeout,vs=X.clearTimeout;function je(s,e){e.useNativeTimers?(s.setTimeoutFn=fs.bind(X),s.clearTimeoutFn=vs.bind(X)):(s.setTimeoutFn=X.setTimeout.bind(X),s.clearTimeoutFn=X.clearTimeout.bind(X))}const ys=1.33;function bs(s){return typeof s=="string"?ws(s):Math.ceil((s.byteLength||s.size)*ys)}function ws(s){let e=0,t=0;for(let a=0,n=s.length;a<n;a++)e=s.charCodeAt(a),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(a++,t+=4);return t}function Ot(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function ks(s){let e="";for(let t in s)s.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(s[t]));return e}function Es(s){let e={},t=s.split("&");for(let a=0,n=t.length;a<n;a++){let o=t[a].split("=");e[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}return e}class Cs extends Error{constructor(e,t,a){super(e),this.description=t,this.context=a,this.type="TransportError"}}class mt extends j{constructor(e){super(),this.writable=!1,je(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,a){return super.emitReserved("error",new Cs(e,t,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=pt(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=ks(e);return t.length?"?"+t:""}}class $s extends mt{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||t()})),this.writable||(a++,this.once("drain",function(){--a||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};us(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,ds(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=Ot()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let Vt=!1;try{Vt=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const xs=Vt;function Ss(){}class Ls extends $s{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let a=location.port;a||(a=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||a!==e.port}}doWrite(e,t){const a=this.request({method:"POST",data:e});a.on("success",t),a.on("error",(n,o)=>{this.onError("xhr post error",n,o)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,a)=>{this.onError("xhr poll error",t,a)}),this.pollXhr=e}}class ie extends j{constructor(e,t,a){super(),this.createRequest=e,je(this,a),this._opts=a,this._method=a.method||"GET",this._uri=t,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var e;const t=Ft(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(t);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=ie.requestsCount++,ie.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Ss,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete ie.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}ie.requestsCount=0;ie.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Lt);else if(typeof addEventListener=="function"){const s="onpagehide"in X?"pagehide":"unload";addEventListener(s,Lt,!1)}}function Lt(){for(let s in ie.requests)ie.requests.hasOwnProperty(s)&&ie.requests[s].abort()}const _s=function(){const s=Ut({xdomain:!1});return s&&s.responseType!==null}();class Is extends Ls{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=_s&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new ie(Ut,this.uri(),e)}}function Ut(s){const e=s.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||xs))return new XMLHttpRequest}catch{}if(!e)try{return new X[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Ht=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Bs extends mt{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,a=Ht?{}:Ft(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const a=e[t],n=t===e.length-1;ht(a,this.supportsBinary,o=>{try{this.doWrite(a,o)}catch{}n&&ze(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=Ot()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Ye=X.WebSocket||X.MozWebSocket;class As extends Bs{createSocket(e,t,a){return Ht?new Ye(e,t,a):t?new Ye(e,t):new Ye(e)}doWrite(e,t){this.ws.send(t)}}class Ps extends mt{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=ps(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=e.readable.pipeThrough(t).getReader(),n=hs();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const o=()=>{a.read().then(({done:d,value:l})=>{d||(this.onPacket(l),o())}).catch(d=>{})};o();const r={type:"open"};this.query.sid&&(r.data=`{"sid":"${this.query.sid}"}`),this._writer.write(r).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const a=e[t],n=t===e.length-1;this._writer.write(a).then(()=>{n&&ze(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Ts={websocket:As,webtransport:Ps,polling:Is},Ms=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Rs=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function et(s){if(s.length>8e3)throw"URI too long";const e=s,t=s.indexOf("["),a=s.indexOf("]");t!=-1&&a!=-1&&(s=s.substring(0,t)+s.substring(t,a).replace(/:/g,";")+s.substring(a,s.length));let n=Ms.exec(s||""),o={},r=14;for(;r--;)o[Rs[r]]=n[r]||"";return t!=-1&&a!=-1&&(o.source=e,o.host=o.host.substring(1,o.host.length-1).replace(/;/g,":"),o.authority=o.authority.replace("[","").replace("]","").replace(/;/g,":"),o.ipv6uri=!0),o.pathNames=Ds(o,o.path),o.queryKey=Ns(o,o.query),o}function Ds(s,e){const t=/\/{2,9}/g,a=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&a.splice(0,1),e.slice(-1)=="/"&&a.splice(a.length-1,1),a}function Ns(s,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,o){n&&(t[n]=o)}),t}const tt=typeof addEventListener=="function"&&typeof removeEventListener=="function",Te=[];tt&&addEventListener("offline",()=>{Te.forEach(s=>s())},!1);class de extends j{constructor(e,t){if(super(),this.binaryType=gs,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const a=et(e);t.hostname=a.host,t.secure=a.protocol==="https"||a.protocol==="wss",t.port=a.port,a.query&&(t.query=a.query)}else t.host&&(t.hostname=et(t.host).host);je(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Es(this.opts.query)),tt&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Te.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=qt,t.transport=e,this.id&&(t.sid=this.id);const a=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&de.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",de.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(t+=bs(n)),a>0&&t>this._maxPayload)return this.writeBuffer.slice(0,a);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,ze(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,a){return this._sendPacket("message",e,t,a),this}send(e,t,a){return this._sendPacket("message",e,t,a),this}_sendPacket(e,t,a,n){if(typeof t=="function"&&(n=t,t=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const o={type:e,data:t,options:a};this.emitReserved("packetCreate",o),this.writeBuffer.push(o),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},a=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():e()}):this.upgrading?a():e()),this}_onError(e){if(de.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),tt&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=Te.indexOf(this._offlineEventListener);a!==-1&&Te.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}de.protocol=qt;class qs extends de{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),a=!1;de.priorWebsocketSuccess=!1;const n=()=>{a||(t.send([{type:"ping",data:"probe"}]),t.once("packet",C=>{if(!a)if(C.type==="pong"&&C.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;de.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(y(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const h=new Error("probe error");h.transport=t.name,this.emitReserved("upgradeError",h)}}))};function o(){a||(a=!0,y(),t.close(),t=null)}const r=C=>{const h=new Error("probe error: "+C);h.transport=t.name,o(),this.emitReserved("upgradeError",h)};function d(){r("transport closed")}function l(){r("socket closed")}function p(C){t&&C.name!==t.name&&o()}const y=()=>{t.removeListener("open",n),t.removeListener("error",r),t.removeListener("close",d),this.off("close",l),this.off("upgrading",p)};t.once("open",n),t.once("error",r),t.once("close",d),this.once("close",l),this.once("upgrading",p),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{a||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let a=0;a<e.length;a++)~this.transports.indexOf(e[a])&&t.push(e[a]);return t}}let Fs=class extends qs{constructor(e,t={}){const a=typeof e=="object"?e:t;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>Ts[n]).filter(n=>!!n)),super(e,a)}};function Os(s,e="",t){let a=s;t=t||typeof location<"u"&&location,s==null&&(s=t.protocol+"//"+t.host),typeof s=="string"&&(s.charAt(0)==="/"&&(s.charAt(1)==="/"?s=t.protocol+s:s=t.host+s),/^(https?|wss?):\/\//.test(s)||(typeof t<"u"?s=t.protocol+"//"+s:s="https://"+s),a=et(s)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const o=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+o+":"+a.port+e,a.href=a.protocol+"://"+o+(t&&t.port===a.port?"":":"+a.port),a}const Vs=typeof ArrayBuffer=="function",Us=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s.buffer instanceof ArrayBuffer,zt=Object.prototype.toString,Hs=typeof Blob=="function"||typeof Blob<"u"&&zt.call(Blob)==="[object BlobConstructor]",zs=typeof File=="function"||typeof File<"u"&&zt.call(File)==="[object FileConstructor]";function gt(s){return Vs&&(s instanceof ArrayBuffer||Us(s))||Hs&&s instanceof Blob||zs&&s instanceof File}function Me(s,e){if(!s||typeof s!="object")return!1;if(Array.isArray(s)){for(let t=0,a=s.length;t<a;t++)if(Me(s[t]))return!0;return!1}if(gt(s))return!0;if(s.toJSON&&typeof s.toJSON=="function"&&arguments.length===1)return Me(s.toJSON(),!0);for(const t in s)if(Object.prototype.hasOwnProperty.call(s,t)&&Me(s[t]))return!0;return!1}function js(s){const e=[],t=s.data,a=s;return a.data=st(t,e),a.attachments=e.length,{packet:a,buffers:e}}function st(s,e){if(!s)return s;if(gt(s)){const t={_placeholder:!0,num:e.length};return e.push(s),t}else if(Array.isArray(s)){const t=new Array(s.length);for(let a=0;a<s.length;a++)t[a]=st(s[a],e);return t}else if(typeof s=="object"&&!(s instanceof Date)){const t={};for(const a in s)Object.prototype.hasOwnProperty.call(s,a)&&(t[a]=st(s[a],e));return t}return s}function Qs(s,e){return s.data=at(s.data,e),delete s.attachments,s}function at(s,e){if(!s)return s;if(s&&s._placeholder===!0){if(typeof s.num=="number"&&s.num>=0&&s.num<e.length)return e[s.num];throw new Error("illegal attachments")}else if(Array.isArray(s))for(let t=0;t<s.length;t++)s[t]=at(s[t],e);else if(typeof s=="object")for(const t in s)Object.prototype.hasOwnProperty.call(s,t)&&(s[t]=at(s[t],e));return s}const Ws=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var R;(function(s){s[s.CONNECT=0]="CONNECT",s[s.DISCONNECT=1]="DISCONNECT",s[s.EVENT=2]="EVENT",s[s.ACK=3]="ACK",s[s.CONNECT_ERROR=4]="CONNECT_ERROR",s[s.BINARY_EVENT=5]="BINARY_EVENT",s[s.BINARY_ACK=6]="BINARY_ACK"})(R||(R={}));class Gs{constructor(e){this.replacer=e}encode(e){return(e.type===R.EVENT||e.type===R.ACK)&&Me(e)?this.encodeAsBinary({type:e.type===R.EVENT?R.BINARY_EVENT:R.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===R.BINARY_EVENT||e.type===R.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=js(e),a=this.encodeAsString(t.packet),n=t.buffers;return n.unshift(a),n}}class ft extends j{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const a=t.type===R.BINARY_EVENT;a||t.type===R.BINARY_ACK?(t.type=a?R.EVENT:R.ACK,this.reconstructor=new Ks(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(gt(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const a={type:Number(e.charAt(0))};if(R[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===R.BINARY_EVENT||a.type===R.BINARY_ACK){const o=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const r=e.substring(o,t);if(r!=Number(r)||e.charAt(t)!=="-")throw new Error("Illegal attachments");a.attachments=Number(r)}if(e.charAt(t+1)==="/"){const o=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););a.nsp=e.substring(o,t)}else a.nsp="/";const n=e.charAt(t+1);if(n!==""&&Number(n)==n){const o=t+1;for(;++t;){const r=e.charAt(t);if(r==null||Number(r)!=r){--t;break}if(t===e.length)break}a.id=Number(e.substring(o,t+1))}if(e.charAt(++t)){const o=this.tryParse(e.substr(t));if(ft.isPayloadValid(a.type,o))a.data=o;else throw new Error("invalid payload")}return a}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case R.CONNECT:return _t(t);case R.DISCONNECT:return t===void 0;case R.CONNECT_ERROR:return typeof t=="string"||_t(t);case R.EVENT:case R.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&Ws.indexOf(t[0])===-1);case R.ACK:case R.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Ks{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Qs(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function _t(s){return Object.prototype.toString.call(s)==="[object Object]"}const Ys=Object.freeze(Object.defineProperty({__proto__:null,Decoder:ft,Encoder:Gs,get PacketType(){return R}},Symbol.toStringTag,{value:"Module"}));function se(s,e,t){return s.on(e,t),function(){s.off(e,t)}}const Js=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class jt extends j{constructor(e,t,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[se(e,"open",this.onopen.bind(this)),se(e,"packet",this.onpacket.bind(this)),se(e,"error",this.onerror.bind(this)),se(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var a,n,o;if(Js.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const r={type:R.EVENT,data:t};if(r.options={},r.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const y=this.ids++,C=t.pop();this._registerAckCallback(y,C),r.id=y}const d=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((o=this.io.engine)===null||o===void 0)&&o._hasPingExpired());return this.flags.volatile&&!d||(l?(this.notifyOutgoingListeners(r),this.packet(r)):this.sendBuffer.push(r)),this.flags={},this}_registerAckCallback(e,t){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[e]=t;return}const o=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let d=0;d<this.sendBuffer.length;d++)this.sendBuffer[d].id===e&&this.sendBuffer.splice(d,1);t.call(this,new Error("operation has timed out"))},n),r=(...d)=>{this.io.clearTimeoutFn(o),t.apply(this,d)};r.withError=!0,this.acks[e]=r}emitWithAck(e,...t){return new Promise((a,n)=>{const o=(r,d)=>r?n(r):a(d);o.withError=!0,t.push(o),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...o)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(n)):(this._queue.shift(),t&&t(null,...o)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:R.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(a=>String(a.id)===e)){const a=this.acks[e];delete this.acks[e],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case R.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case R.EVENT:case R.BINARY_EVENT:this.onevent(e);break;case R.ACK:case R.BINARY_ACK:this.onack(e);break;case R.DISCONNECT:this.ondisconnect();break;case R.CONNECT_ERROR:this.destroy();const a=new Error(e.data.message);a.data=e.data.data,this.emitReserved("connect_error",a);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const a of t)a.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let a=!1;return function(...n){a||(a=!0,t.packet({type:R.ACK,id:e,data:n}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:R.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let a=0;a<t.length;a++)if(e===t[a])return t.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let a=0;a<t.length;a++)if(e===t[a])return t.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const a of t)a.apply(this,e.data)}}}function be(s){s=s||{},this.ms=s.min||100,this.max=s.max||1e4,this.factor=s.factor||2,this.jitter=s.jitter>0&&s.jitter<=1?s.jitter:0,this.attempts=0}be.prototype.duration=function(){var s=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*s);s=Math.floor(e*10)&1?s+t:s-t}return Math.min(s,this.max)|0};be.prototype.reset=function(){this.attempts=0};be.prototype.setMin=function(s){this.ms=s};be.prototype.setMax=function(s){this.max=s};be.prototype.setJitter=function(s){this.jitter=s};class nt extends j{constructor(e,t){var a;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,je(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((a=t.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new be({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const n=t.parser||Ys;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Fs(this.uri,this.opts);const t=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=se(t,"open",function(){a.onopen(),e&&e()}),o=d=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",d),e?e(d):this.maybeReconnectOnOpen()},r=se(t,"error",o);if(this._timeout!==!1){const d=this._timeout,l=this.setTimeoutFn(()=>{n(),o(new Error("timeout")),t.close()},d);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(se(e,"ping",this.onping.bind(this)),se(e,"data",this.ondata.bind(this)),se(e,"error",this.onerror.bind(this)),se(e,"close",this.onclose.bind(this)),se(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){ze(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let a=this.nsps[e];return a?this._autoConnect&&!a.active&&a.connect():(a=new jt(this,e,t),this.nsps[e]=a),a}_destroy(e){const t=Object.keys(this.nsps);for(const a of t)if(this.nsps[a].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let a=0;a<t.length;a++)this.engine.write(t[a],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},t);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const ke={};function Re(s,e){typeof s=="object"&&(e=s,s=void 0),e=e||{};const t=Os(s,e.path||"/socket.io"),a=t.source,n=t.id,o=t.path,r=ke[n]&&o in ke[n].nsps,d=e.forceNew||e["force new connection"]||e.multiplex===!1||r;let l;return d?l=new nt(a,e):(ke[n]||(ke[n]=new nt(a,e)),l=ke[n]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(Re,{Manager:nt,Socket:jt,io:Re,connect:Re});class Xs{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=Re({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(t=>{this.socket.emit("subscribe:manga",t)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",t=>{console.log("[Socket] Disconnected:",t)}),this.socket.on("connect_error",t=>{console.error("[Socket] Connection error:",t.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var t;this.subscribedMangas.add(e),(t=this.socket)!=null&&t.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var t;this.subscribedMangas.delete(e),(t=this.socket)!=null&&t.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,t){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),this.socket&&this.socket.on(e,t)}off(e,t){this.listeners.has(e)&&this.listeners.get(e).delete(t),this.socket&&this.socket.off(e,t)}emit(e,t){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(e,t)}}const Q={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone"},V=new Xs,K={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},ae=new Set,U=new Map,Ce=new Map;function Zs(s){return K[s]}function ea(s,e){K[s]=e,ae.add(s),_e(s)}function ta(s,e){return Ce.has(s)||Ce.set(s,new Set),Ce.get(s).add(e),()=>{var t;return(t=Ce.get(s))==null?void 0:t.delete(e)}}function _e(s){const e=Ce.get(s);e&&e.forEach(t=>t(K[s]))}function $e(s){ae.delete(s),U.delete(s)}function sa(s){return ae.has(s)}async function xe(s=!1){if(!s&&ae.has("bookmarks"))return K.bookmarks;if(U.has("bookmarks"))return U.get("bookmarks");const e=v.getBookmarks().then(t=>(K.bookmarks=t||[],ae.add("bookmarks"),U.delete("bookmarks"),_e("bookmarks"),K.bookmarks)).catch(t=>{throw U.delete("bookmarks"),t});return U.set("bookmarks",e),e}async function aa(s=!1){if(!s&&ae.has("series"))return K.series;if(U.has("series"))return U.get("series");const e=v.get("/series").then(t=>(K.series=t||[],ae.add("series"),U.delete("series"),_e("series"),K.series)).catch(t=>{throw U.delete("series"),t});return U.set("series",e),e}async function na(s=!1){if(!s&&ae.has("categories"))return K.categories;if(U.has("categories"))return U.get("categories");const e=v.get("/categories").then(t=>(K.categories=t.categories||[],ae.add("categories"),U.delete("categories"),_e("categories"),K.categories)).catch(t=>{throw U.delete("categories"),t});return U.set("categories",e),e}async function ia(s=!1){if(!s&&ae.has("favorites"))return K.favorites;if(U.has("favorites"))return U.get("favorites");const e=v.getFavorites().then(t=>(K.favorites=t||{favorites:{},listOrder:[]},ae.add("favorites"),U.delete("favorites"),_e("favorites"),K.favorites)).catch(t=>{throw U.delete("favorites"),t});return U.set("favorites",e),e}function oa(){V.on(Q.MANGA_UPDATED,()=>{$e("bookmarks"),xe(!0)}),V.on(Q.MANGA_ADDED,()=>{$e("bookmarks"),xe(!0)}),V.on(Q.MANGA_DELETED,()=>{$e("bookmarks"),xe(!0)}),V.on(Q.DOWNLOAD_COMPLETED,()=>{$e("bookmarks"),xe(!0)})}oa();const ne={get:Zs,set:ea,subscribe:ta,invalidate:$e,isLoaded:sa,loadBookmarks:xe,loadSeries:aa,loadCategories:na,loadFavorites:ia};function u(s,e="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=s,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}async function ra(s,e,t){try{s&&(s.disabled=!0,s.textContent="Scanning..."),e&&(e.textContent="Scanning..."),u("Scanning downloads folder...","info");const n=(await v.scanLibrary()).found||[];if(n.length===0){u("Scan complete: No new manga found","info"),t&&t();return}la(n,t)}catch(a){u("Scan failed: "+a.message,"error")}finally{s&&(s.disabled=!1,s.textContent="📁 Scan Folder"),e&&(e.textContent="📁 Scan Folder")}}async function la(s,e){const t=document.createElement("div");t.id="import-modal-overlay",t.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,t.appendChild(a),document.body.appendChild(t),document.getElementById("import-cancel-btn").addEventListener("click",()=>{t.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),o=Array.from(n).map(l=>l.dataset.folder);if(o.length===0){u("No folders selected","warning");return}const r=document.getElementById("import-all-btn");r.disabled=!0,r.textContent="Importing...";let d=0;for(const l of o)try{await v.importLocalManga(l),d++}catch(p){console.error("Failed to import",l,p)}t.remove(),u(`Imported ${d} manga`,"success"),e&&e()}),t.addEventListener("click",n=>{n.target===t&&t.remove()})}function Z(s="manga"){return`
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
          <a href="#/admin" class="btn btn-secondary" title="Admin">🔧</a>
          <a href="#/settings" class="btn btn-secondary" title="Settings">⚙️</a>
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
        <a href="#/admin" class="mobile-menu-item">🔧 Admin</a>
        <a href="#/settings" class="mobile-menu-item">⚙️ Settings</a>
      </div>
    </header>
  `}function ue(){const s=document.querySelector("header");if(s&&s.dataset.listenersBound)return;s&&(s.dataset.listenersBound="true");const e=document.getElementById("hamburger-btn"),t=document.getElementById("mobile-menu");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),o=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",o),n&&n.addEventListener("click",o),document.querySelectorAll("[data-view]").forEach(k=>{k.addEventListener("click",()=>{const g=k.dataset.view;localStorage.setItem("library_view_mode",g),document.querySelectorAll("[data-view]").forEach($=>{$.classList.toggle("active",$.dataset.view===g)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:g}}))})});const r=document.querySelector(".logo");r&&r.addEventListener("click",k=>{localStorage.removeItem("library_active_category"),window.dispatchEvent(new CustomEvent("clearFilters"))});const d=document.getElementById("favorites-btn"),l=document.getElementById("mobile-favorites-btn"),p=k=>{k.preventDefault(),P.go("/favorites")};d&&d.addEventListener("click",p),l&&l.addEventListener("click",p);const y=document.getElementById("queue-nav-btn");y&&y.addEventListener("click",k=>{k.preventDefault(),P.go("/queue")});const C=document.getElementById("scan-btn"),h=document.getElementById("mobile-scan-btn");if(C||h){const k=()=>{ra(C,h,async()=>{await ne.loadBookmarks(!0),P.reload()})};C&&C.addEventListener("click",k),h&&h.addEventListener("click",k)}}let E={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0},Fe=[];function vt(s){return[...s].sort((e,t)=>{var a,n;switch(E.sortBy){case"az":return(e.alias||e.title).localeCompare(t.alias||t.title);case"za":return(t.alias||t.title).localeCompare(e.alias||e.title);case"lastread":return(t.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const o=((a=e.chapters)==null?void 0:a.length)||e.uniqueChapters||0;return(((n=t.chapters)==null?void 0:n.length)||t.uniqueChapters||0)-o}case"updated":default:return(t.updatedAt||"").localeCompare(e.updatedAt||"")}})}function yt(s){var y,C,h;const e=s.alias||s.title,t=s.downloadedCount??((y=s.downloadedChapters)==null?void 0:y.length)??0,a=new Set(s.excludedChapters||[]),n=(s.chapters||[]).filter(k=>!a.has(k.number)),o=new Set(n.map(k=>k.number)).size||s.uniqueChapters||0,r=s.readCount??((C=s.readChapters)==null?void 0:C.length)??0,d=(s.updatedCount??((h=s.updatedChapters)==null?void 0:h.length)??0)>0,l=s.localCover?`/api/public/covers/${s.id}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover,p=s.source==="local";return`
    <div class="manga-card" data-id="${s.id}">
      <div class="manga-card-cover">
        ${l?`<img src="${l}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:`<div class="placeholder">${p?"💾":"📚"}</div>`}
        <div class="manga-card-badges">
          ${r>0?`<span class="badge badge-read" title="Read">${r}</span>`:""}
          <span class="badge badge-chapters" title="Total">${o}</span>
          ${t>0?`<span class="badge badge-downloaded" title="Downloaded">${t}</span>`:""}
          ${d?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${s.autoCheck?'<span class="badge badge-monitored" title="Auto-check enabled">⏰</span>':""}
          ${E.activeCategory==="Favorites"?'<span class="badge badge-play" title="Click to Read">▶</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function bt(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function ca(s){var n;const e=s.alias||s.title,t=((n=s.entries)==null?void 0:n.length)||s.entry_count||0;let a=null;return s.localCover&&s.coverBookmarkId?a=`/api/public/covers/${s.coverBookmarkId}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover&&(a=s.cover),`
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
  `}function Oe(){const s=localStorage.getItem("library_view_mode");if(s&&s!==E.viewMode&&(E.viewMode=s),E.activeCategory==="Favorites")return P.go("/favorites"),"";let e="";if(E.viewMode==="series"){const t=E.series.map(ca).join("");e=`
      <div class="library-grid" id="library-grid">
        ${E.loading?'<div class="loading-spinner"></div>':t||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{let t=E.bookmarks;const a=(Array.isArray(E.categories)?E.categories:[]).filter(o=>typeof o=="object"?o.isNsfw:!1).map(o=>o.name);if(E.activeCategory==="__nsfw__"?t=t.filter(o=>(o.categories||[]).some(r=>a.includes(r))):E.activeCategory?t=t.filter(o=>(o.categories||[]).includes(E.activeCategory)):a.length>0&&(t=t.filter(o=>!(o.categories||[]).some(r=>a.includes(r)))),E.artistFilter&&(t=t.filter(o=>(o.artists||[]).includes(E.artistFilter))),E.searchQuery){const o=E.searchQuery.toLowerCase();t=t.filter(r=>(r.title||"").toLowerCase().includes(o)||(r.alias||"").toLowerCase().includes(o)||(r.artists||[]).some(d=>d.toLowerCase().includes(o)))}t=vt(t);const n=t.map(yt).join("");e=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" id="library-search" placeholder="Search manga or author..." value="${E.searchQuery}" autocomplete="off">
          ${E.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${E.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${E.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${E.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${E.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${E.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
      </div>
      ${E.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">🎨</span>
          <span class="artist-filter-name">${E.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${E.loading?'<div class="loading-spinner"></div>':n||bt()}
      </div>
    `}return`
    ${Z(E.viewMode)}
    <div class="container">
      ${e}
    </div>
    ${da()}
    ${ha()}
    ${pa()}
  `}function da(){const{activeCategory:s}=E,t=(Array.isArray(E.categories)?E.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=t.some(n=>n.isNsfw);return`
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
    ${ua()}
      `}function ua(){const e=(Array.isArray(E.categories)?E.categories:[]).map(t=>typeof t=="object"?t:{name:t,isNsfw:!1});return`
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
  `}function ha(){return`
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
      `}function pa(){return`
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
      `}function it(){E.activeCategory=null,E.artistFilter=null,E.searchQuery="",localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),J()}async function ot(s){const e=s.target.closest(".manga-card");if(e){if(e.classList.contains("gallery-card")){const n=e.dataset.gallery;P.go(`/read/gallery/${encodeURIComponent(n)}`);return}const t=e.dataset.id,a=e.dataset.seriesId;if(a){P.go(`/series/${a}`);return}if(t){if(E.activeCategory==="Favorites"){const n=E.bookmarks.find(o=>o.id===t);if(n){let o=n.last_read_chapter;if(!o&&n.chapters&&n.chapters.length>0&&(o=[...n.chapters].sort((d,l)=>d.number-l.number)[0].number),o){P.go(`/read/${t}/${o}`);return}else u("No chapters available to read","warning")}}P.go(`/manga/${t}`)}}}function Qt(){var I,M,O,te,re;const s=document.getElementById("app");s.removeEventListener("click",ot),s.addEventListener("click",ot),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",A=>{E.viewMode=A.detail.mode;const D=document.getElementById("app");D.innerHTML=Oe(),Qt(),ue()}));const e=document.getElementById("category-fab-btn"),t=document.getElementById("category-fab-menu");e&&t&&(e.addEventListener("click",()=>{t.classList.toggle("hidden")}),t.addEventListener("click",A=>{const D=A.target.closest(".category-menu-item");if(D){const F=D.dataset.category||null;ma(F),t.classList.add("hidden")}})),(I=document.getElementById("manage-categories-btn"))==null||I.addEventListener("click",A=>{A.stopPropagation();const D=document.getElementById("manage-categories-modal");D&&D.classList.add("open")}),(M=document.getElementById("close-manage-categories-btn"))==null||M.addEventListener("click",()=>{var A;(A=document.getElementById("manage-categories-modal"))==null||A.classList.remove("open")}),(O=document.querySelector("#manage-categories-modal .modal-overlay"))==null||O.addEventListener("click",()=>{var A;(A=document.getElementById("manage-categories-modal"))==null||A.classList.remove("open")}),(te=document.querySelector("#manage-categories-modal .modal-close"))==null||te.addEventListener("click",()=>{var A;(A=document.getElementById("manage-categories-modal"))==null||A.classList.remove("open")}),(re=document.getElementById("add-category-btn"))==null||re.addEventListener("click",async()=>{var F;const A=document.getElementById("new-category-input"),D=(F=A==null?void 0:A.value)==null?void 0:F.trim();if(D)try{await v.post("/categories",{name:D}),A.value="",u("Category added","success"),await ve(!0),J()}catch(G){u("Failed: "+G.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(A=>{A.addEventListener("change",async D=>{const F=A.dataset.category;try{await v.put(`/categories/${encodeURIComponent(F)}/nsfw`,{isNsfw:A.checked}),u(`${F} ${A.checked?"marked as 18+":"unmarked"}`,"success"),await ve(!0),J()}catch(G){u("Failed: "+G.message,"error"),A.checked=!A.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(A=>{A.addEventListener("click",async()=>{const D=A.dataset.category;if(confirm(`Delete category "${D}"?`))try{await v.delete(`/categories/${encodeURIComponent(D)}`),u("Category deleted","success"),E.activeCategory===D&&(E.activeCategory=null,localStorage.removeItem("library_active_category")),await ve(!0),J()}catch(F){u("Failed: "+F.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{E.artistFilter=null,J()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",A=>{var F;E.searchQuery=A.target.value,localStorage.setItem("library_search",A.target.value);const D=document.getElementById("library-grid");if(D){let G=E.activeCategory?E.bookmarks.filter(fe=>(fe.categories||[]).includes(E.activeCategory)):E.bookmarks;if(E.artistFilter&&(G=G.filter(fe=>(fe.artists||[]).includes(E.artistFilter))),E.searchQuery){const fe=E.searchQuery.toLowerCase();G=G.filter(Ct=>(Ct.title||"").toLowerCase().includes(fe)||(Ct.alias||"").toLowerCase().includes(fe))}G=vt(G),D.innerHTML=G.map(yt).join("")||bt();const we=document.getElementById("search-clear");!we&&E.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(F=document.getElementById("search-clear"))==null||F.addEventListener("click",()=>{E.searchQuery="",localStorage.removeItem("library_search"),n.value="",J()})):we&&!E.searchQuery&&we.remove()}}),E.searchQuery&&n.focus());const o=document.getElementById("search-clear");o&&o.addEventListener("click",()=>{E.searchQuery="",J()});const r=document.getElementById("library-sort");r&&r.addEventListener("change",A=>{E.sortBy=A.target.value,localStorage.setItem("library_sort",E.sortBy),J()}),window.removeEventListener("clearFilters",it),window.addEventListener("clearFilters",it);const d=document.getElementById("add-manga-btn"),l=document.getElementById("mobile-add-btn"),p=document.getElementById("add-modal"),y=document.getElementById("add-modal-close"),C=document.getElementById("add-modal-cancel"),h=document.getElementById("add-modal-submit"),k=document.getElementById("mobile-menu"),g=()=>{k&&k.classList.add("hidden"),p&&p.classList.add("open")};d&&d.addEventListener("click",g),l&&l.addEventListener("click",g),y&&y.addEventListener("click",()=>p.classList.remove("open")),C&&C.addEventListener("click",()=>p.classList.remove("open")),h&&h.addEventListener("click",async()=>{const A=document.getElementById("manga-url"),D=A.value.trim();if(!D){u("Please enter a URL","error");return}try{h.disabled=!0,h.textContent="Adding...",await v.addBookmark(D),u("Manga added successfully!","success"),p.classList.remove("open"),A.value="",await ve(),J()}catch(F){u("Failed to add manga: "+F.message,"error")}finally{h.disabled=!1,h.textContent="Add"}});const $=document.getElementById("add-series-btn"),_=document.getElementById("mobile-add-series-btn"),L=document.getElementById("add-series-modal"),T=document.getElementById("add-series-modal-close"),B=document.getElementById("add-series-modal-cancel"),b=document.getElementById("add-series-modal-submit"),x=document.getElementById("mobile-menu");if(($||_)&&L){const A=()=>{x&&x.classList.add("hidden"),L.classList.add("open")};$&&$.addEventListener("click",A),_&&_.addEventListener("click",A)}T&&T.addEventListener("click",()=>L.classList.remove("open")),B&&B.addEventListener("click",()=>L.classList.remove("open")),b&&b.addEventListener("click",async()=>{const A=document.getElementById("series-title"),D=document.getElementById("series-alias"),F=A.value.trim(),G=D.value.trim();if(!F){u("Please enter a title","error");return}try{b.disabled=!0,b.textContent="Creating...",await v.createSeries(F,G),u("Series created successfully!","success"),L.classList.remove("open"),A.value="",D.value="",await ve(!0),J()}catch(we){u("Failed to create series: "+we.message,"error")}finally{b.disabled=!1,b.textContent="Create"}});const c=L==null?void 0:L.querySelector(".modal-overlay");c&&c.addEventListener("click",()=>L.classList.remove("open"));const m=document.getElementById("empty-add-btn");m&&p&&m.addEventListener("click",()=>p.classList.add("open"));const w=document.getElementById("empty-add-series-btn");w&&L&&w.addEventListener("click",()=>L.classList.add("open"));const S=p==null?void 0:p.querySelector(".modal-overlay");S&&S.addEventListener("click",()=>p.classList.remove("open")),ue()}function ma(s){E.activeCategory=s,s?localStorage.setItem("library_active_category",s):localStorage.removeItem("library_active_category"),J()}async function ve(s=!1){try{const[e,t,a,n]=await Promise.all([ne.loadBookmarks(s),ne.loadCategories(s),ne.loadSeries(s),ne.loadFavorites(s)]);E.bookmarks=e,E.categories=t,E.series=a,E.favorites=n,E.loading=!1}catch{u("Failed to load library","error"),E.loading=!1}}async function J(){const s=document.getElementById("app"),e=localStorage.getItem("library_active_category");E.activeCategory!==e&&(E.activeCategory=e);const t=localStorage.getItem("library_artist_filter");t&&E.artistFilter!==t&&(E.artistFilter=t);const a=localStorage.getItem("library_search")||"";E.searchQuery!==a&&(E.searchQuery=a),E.loading&&(s.innerHTML=Oe()),E.bookmarks.length===0&&E.loading&&await ve(),s.innerHTML=Oe(),Qt(),Fe.forEach(n=>n()),Fe=[ne.subscribe("bookmarks",n=>{E.bookmarks=n;const o=document.getElementById("library-grid");if(o){let r=E.activeCategory?E.bookmarks.filter(d=>(d.categories||[]).includes(E.activeCategory)):E.bookmarks;if(E.artistFilter&&(r=r.filter(d=>(d.artists||[]).includes(E.artistFilter))),E.searchQuery){const d=E.searchQuery.toLowerCase();r=r.filter(l=>(l.title||"").toLowerCase().includes(d)||(l.alias||"").toLowerCase().includes(d))}r=vt(r),o.innerHTML=r.map(yt).join("")||bt()}})]}function ga(){const s=document.getElementById("app");s&&s.removeEventListener("click",ot),window.removeEventListener("clearFilters",it),Fe.forEach(e=>e()),Fe=[]}const fa={mount:J,unmount:ga,render:Oe};let i={manga:null,chapter:null,images:[],trophyPages:{},mode:"webtoon",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!1,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null};function Wt(){if(!i.manga||!i.chapter||!i.allFavorites||!i.allFavorites.favorites)return!1;if(i.isCollectionMode)return!0;let e=[lt()];if(i.mode==="manga"&&!i.singlePageMode){const n=H()[i.currentPage];n&&Array.isArray(n)?e=n:n&&n.pages&&(e=n.pages)}const t=e.map(a=>{const n=Le(i.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in i.allFavorites.favorites){const n=i.allFavorites.favorites[a];if(Array.isArray(n)){for(const o of n)if(o.mangaId===i.manga.id&&o.chapterNum===i.chapter.number&&o.imagePaths)for(const r of o.imagePaths){const d=typeof r=="string"?r:(r==null?void 0:r.filename)||(r==null?void 0:r.path);for(const l of t)if(l&&l.filename===d)return!0}}}return!1}function rt(){const s=document.getElementById("favorites-btn");s&&(Wt()?s.classList.add("active"):s.classList.remove("active"))}function ge(){var p;if(i.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!i.manga||!i.images.length)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const s=i.manga.alias||i.manga.title,e=(p=i.chapter)==null?void 0:p.number,a=H().length,n=i.images.length;let o,r;i.mode==="webtoon"?(o=n-1,r=`${n} pages`):i.singlePageMode?(o=n-1,r=`${i.currentPage+1} / ${n}`):(o=a-1,r=`${i.currentPage+1} / ${a}`);const d=Wt(),l=Jt();return`
    <div class="reader ${i.mode}-mode ${i.showControls?"":"controls-hidden"}">
      <!-- Unified Top Bar -->
      <div class="reader-bar">
        <button class="reader-bar-btn close-btn" id="reader-close-btn" title="Back">×</button>
        <div class="reader-title">
          <span class="manga-name">${s}</span>
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
        ${i.isCollectionMode?Gt():i.mode==="webtoon"?Kt():Yt()}
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
  `}function Gt(){const s=i.mode==="manga";if(s&&!i.singlePageMode){const e=i.images[i.currentPage];if(!e)return"";const t=e.urls||[e.url],a=e.displayMode||"single";return e.displaySide,a==="double"&&t.length>=2?`
            <div class="manga-spread collection-spread ${i.direction} double-page">
              <div class="manga-page"><img src="${t[0]}" alt="Page A"></div>
              <div class="manga-page"><img src="${t[1]}" alt="Page B"></div>
            </div>
            `:`
            <div class="manga-spread collection-spread single ${i.direction}">
              <div class="manga-page"><img src="${t[0]}" alt="Page"></div>
            </div>
            `}return`
    <div class="${s?"manga-spread single "+i.direction:"gallery-pages"}">
      ${(s?[i.images[i.currentPage]]:i.images).map((e,t)=>{if(!e)return"";const a=e.displayMode||"single",n=e.displaySide||"left",o=e.urls||[e.url];return a==="double"&&o.length>=2?`
            <div class="gallery-page double-page side-${n} ${s?"manga-page":""}" data-page="${t}">
              <img src="${o[0]}" alt="Page ${t+1}A" loading="lazy">
              <img src="${o[1]}" alt="Page ${t+1}B" loading="lazy">
            </div>
          `:`
            <div class="gallery-page single-page ${s?"manga-page":""}" data-page="${t}">
              <img src="${o[0]}" alt="Page ${t+1}" loading="lazy">
            </div>
          `}).join("")}
    </div>
  `}function Kt(){return`
    <div class="webtoon-pages">
      ${i.images.map((s,e)=>{const t=typeof s=="string"?s:s.url,a=i.trophyPages[e];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${e}">
          ${a?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${t}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function Yt(){if(i.singlePageMode)return va();const e=H()[i.currentPage];if(!e)return"";if(e.type==="link"){const t=e.pages[0],a=i.images[t],n=typeof a=="string"?a:a.url,o=i.trophyPages[t];return`
        <div class="manga-spread ${i.direction}">
          <div class="manga-page ${o?"trophy-page":""}">
            ${o?'<div class="trophy-indicator">🏆</div>':""}
            <img src="${n}" alt="Page ${t+1}">
          </div>
          <div class="manga-page link-page" id="link-page">
            <div class="link-overlay">Ch. ${e.nextChapter} →</div>
            <img src="${e.nextImage}" alt="Next chapter preview">
          </div>
        </div>
      `}return`
    <div class="manga-spread ${i.direction}">
      ${e.map(t=>{const a=i.images[t],n=typeof a=="string"?a:a.url,o=i.trophyPages[t];return`
        <div class="manga-page ${o?"trophy-page":""}">
          ${o?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${n}" alt="Page ${t+1}">
        </div>
      `}).join("")}
    </div>
  `}function va(){const s=i.currentPage,e=i.trophyPages[s];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[o,r]=e.pages,d=i.images[o],l=i.images[r],p=typeof d=="string"?d:d==null?void 0:d.url,y=typeof l=="string"?l:l==null?void 0:l.url;if(p&&y)return`
            <div class="manga-spread ${i.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${p}" alt="Page ${o+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${y}" alt="Page ${r+1}"></div>
            </div>
            `}const t=i.images[s];if(!t)return"";const a=typeof t=="string"?t:t.url,n=i.trophyPages[s];return`
    <div class="manga-spread single ${i.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?'<div class="trophy-indicator">🏆</div>':""}
        <img src="${a}" alt="Page ${s+1}">
      </div>
    </div>
  `}function H(){const s=[],e=i.images.length;let t=0;if(i.isCollectionMode){for(let n=0;n<e;n++)s.push([n]);return s}let a=!i.firstPageSingle;for(;t<e;){const n=i.trophyPages[t];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[o,r]=n.pages;s.push([o,r]),t=Math.max(o,r)+1}else s.push([t]),t++;continue}if(!a){a=!0,s.push([t]),t++;continue}if(i.lastPageSingle&&t===e-1){i.nextChapterImage?s.push({type:"link",pages:[t],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):s.push([t]),t++;break}t+1<e?i.trophyPages[t+1]?(s.push([t]),t++):i.lastPageSingle&&t+1===e-1?(s.push([t]),i.nextChapterImage?s.push({type:"link",pages:[t+1],nextImage:i.nextChapterImage,nextChapter:i.nextChapterNum}):s.push([t+1]),t+=2):(s.push([t,t+1]),t+=2):(s.push([t]),t++)}return s}function Jt(){if(i.singlePageMode)return!!i.trophyPages[i.currentPage];const e=H()[i.currentPage];return e?(Array.isArray(e)?e:e.pages||[]).some(a=>!!i.trophyPages[a]):!1}function Xt(){if(i.singlePageMode)return[i.currentPage];const e=H()[i.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function ya(){if(!i.manga||!i.chapter||i.isCollectionMode)return;const s=Xt();if(s.length===0)return;if(s.some(t=>!!i.trophyPages[t])){const t=[...s];if(i.singlePageMode){const a=i.trophyPages[i.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(t.length=0,t.push(...a.pages))}t.forEach(a=>delete i.trophyPages[a]),u(`Page${t.length>1?"s":""} unmarked as trophy`,"info")}else{let t=s,a=i.singlePageMode||s.length===1;if(!i.singlePageMode&&s.length===2){const o=await ts(s,"Mark as trophy 🏆");if(!o)return;t=o.pages,a=o.pages.length===1}t.forEach(o=>{i.trophyPages[o]={isSingle:a,pages:[...t]}});const n=a?"single":"double";u(`Page${t.length>1?"s":""} marked as trophy (${n}) 🏆`,"success")}try{await v.saveTrophyPages(i.manga.id,i.chapter.number,i.trophyPages)}catch(t){console.error("Failed to save trophy pages:",t)}ce(),Zt()}function Zt(){const s=document.getElementById("trophy-btn");if(s){const e=Jt();s.classList.toggle("active",e),s.title=e?"Unmark trophy":"Mark as trophy"}}async function Ie(){if(!i.manga||!i.chapter||i.isCollectionMode||!i.images.length)return;let s=1;if(i.mode==="manga")if(i.singlePageMode)s=i.currentPage+1;else{const t=H()[i.currentPage];t&&t.length>0&&(s=t[0]+1)}else{const e=document.getElementById("reader-content");if(e){const t=e.querySelectorAll("img"),a=e.scrollTop;let n=0;t.forEach((o,r)=>{a>=n&&(s=r+1),n+=o.offsetHeight})}}try{await v.updateReadingProgress(i.manga.id,i.chapter.number,s,i.images.length)}catch(e){console.error("Failed to save progress:",e)}}function Ve(){var t,a,n,o,r,d,l,p,y,C,h,k,g,$,_,L,T,B;const s=document.getElementById("app");(t=document.getElementById("reader-close-btn"))==null||t.addEventListener("click",async()=>{await Ie(),await pe(),i.manga&&i.manga.id!=="gallery"?P.go(`/manga/${i.manga.id}`):P.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{P.go("/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var b;(b=document.getElementById("reader-settings"))==null||b.classList.toggle("hidden")}),(o=document.getElementById("close-settings-btn"))==null||o.addEventListener("click",()=>{var b;(b=document.getElementById("reader-settings"))==null||b.classList.add("hidden")}),(r=document.getElementById("single-page-btn"))==null||r.addEventListener("click",()=>{if(i.singlePageMode){const b=H();let x=0;for(let c=0;c<b.length;c++)if(b[c].includes(i.currentPage)){x=c;break}i.singlePageMode=!1,i.currentPage=x}else{const x=H()[i.currentPage];i.singlePageMode=!0,i.currentPage=x?x[0]:0}Ne()}),(d=document.getElementById("trophy-btn"))==null||d.addEventListener("click",()=>{ya()}),s.querySelectorAll("[data-mode]").forEach(b=>{b.addEventListener("click",()=>{var m,w;const x=b.dataset.mode;let c=lt();if(i.mode=x,localStorage.setItem("reader_mode",i.mode),x==="webtoon")i.currentPage=c;else if(i.singlePageMode)i.currentPage=c;else{const S=H();let I=0;for(let M=0;M<S.length;M++)if(S[M].includes(c)){I=M;break}i.currentPage=I}(m=i.manga)!=null&&m.id&&((w=i.chapter)!=null&&w.number)&&pe(),Ne(),x==="webtoon"&&setTimeout(()=>{const S=document.getElementById("reader-content");if(S){const I=S.querySelectorAll("img");I[c]&&I[c].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),s.querySelectorAll("[data-direction]").forEach(b=>{b.addEventListener("click",async()=>{var x,c;i.direction=b.dataset.direction,localStorage.setItem("reader_direction",i.direction),(x=i.manga)!=null&&x.id&&((c=i.chapter)!=null&&c.number)&&await pe(),Ne()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async b=>{i.firstPageSingle=b.target.checked,await pe(),ce()}),(p=document.getElementById("last-page-single"))==null||p.addEventListener("change",async b=>{var x,c;i.lastPageSingle=b.target.checked,await pe(),i.lastPageSingle&&((x=i.manga)!=null&&x.id)&&((c=i.chapter)!=null&&c.number)?await es():(i.nextChapterImage=null,i.nextChapterNum=null),ce()}),(y=document.getElementById("zoom-slider"))==null||y.addEventListener("input",b=>{i.zoom=parseInt(b.target.value);const x=document.getElementById("reader-content");x&&(x.style.zoom=`${i.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",b=>{const x=parseInt(b.target.value),c=document.getElementById("page-indicator");c&&(i.singlePageMode?c.textContent=`${x+1} / ${i.images.length}`:c.textContent=`${x+1} / ${H().length}`)}),e.addEventListener("change",b=>{i.currentPage=parseInt(b.target.value),ce()})),i.mode==="manga"){const b=document.getElementById("reader-content");b==null||b.addEventListener("click",x=>{var S;if(x.target.closest("button, a, .link-overlay"))return;const c=b.getBoundingClientRect(),w=(x.clientX-c.left)/c.width;w<.3?ct():w>.7?De():(i.showControls=!i.showControls,(S=document.querySelector(".reader"))==null||S.classList.toggle("controls-hidden",!i.showControls))})}document.addEventListener("keydown",ss),(C=document.getElementById("prev-chapter-btn"))==null||C.addEventListener("click",()=>Ue(-1)),(h=document.getElementById("next-chapter-btn"))==null||h.addEventListener("click",()=>Ue(1)),i.mode==="webtoon"&&((k=document.getElementById("reader-content"))==null||k.addEventListener("click",()=>{var b;i.showControls=!i.showControls,(b=document.querySelector(".reader"))==null||b.classList.toggle("controls-hidden",!i.showControls)})),(g=document.getElementById("rotate-btn"))==null||g.addEventListener("click",async()=>{const b=Je();if(!(!b||!i.manga||!i.chapter))try{u("Rotating...","info");const x=await v.rotatePage(i.manga.id,i.chapter.number,b);x.images&&(await Xe(x.images),u("Page rotated","success"))}catch(x){u("Rotate failed: "+x.message,"error")}}),($=document.getElementById("swap-btn"))==null||$.addEventListener("click",async()=>{const x=H()[i.currentPage];if(!x||x.length!==2||!i.manga||!i.chapter){u("Select a spread with 2 pages to swap","info");return}const c=Le(i.images[x[0]]),m=Le(i.images[x[1]]);if(!(!c||!m))try{u("Swapping...","info");const w=await v.swapPages(i.manga.id,i.chapter.number,c,m);w.images&&(await Xe(w.images),u("Pages swapped","success"))}catch(w){u("Swap failed: "+w.message,"error")}}),(_=document.getElementById("split-btn"))==null||_.addEventListener("click",async()=>{const b=Je();if(!b||!i.manga||!i.chapter||!confirm("Split this page into halves? This is permanent."))return;const x=document.getElementById("split-btn");try{u("Preparing to split...","info"),x&&(x.disabled=!0),i.images=[],i.loading=!0,s.innerHTML=ge(),await new Promise(m=>setTimeout(m,2e3)),u("Splitting page...","info");const c=await v.splitPage(i.manga.id,i.chapter.number,b);x&&(x.disabled=!1),await he(i.manga.id,i.chapter.number,i.chapter.versionUrl),s.innerHTML=ge(),Ve(),ce(),c.warning?u(c.warning,"warning"):u("Page split into halves","success")}catch(c){x&&(x.disabled=!1),u("Split failed: "+c.message,"error"),await he(i.manga.id,i.chapter.number,i.chapter.versionUrl),s.innerHTML=ge(),Ve()}}),(L=document.getElementById("delete-page-btn"))==null||L.addEventListener("click",async()=>{const b=Je();if(!(!b||!i.manga||!i.chapter)&&confirm(`Delete page "${b}" permanently? This cannot be undone.`))try{u("Deleting...","info");const x=await v.deletePage(i.manga.id,i.chapter.number,b);x.images&&(await Xe(x.images),u("Page deleted","success"))}catch(x){u("Delete failed: "+x.message,"error")}}),(T=document.getElementById("favorites-btn"))==null||T.addEventListener("click",async()=>{try{const c=await v.getFavorites();i.allFavorites=c,i.favoriteLists=Object.keys(c.favorites||c||{})}catch(c){console.error("Failed to load favorites",c),u("Failed to load favorites","error");return}let x=[lt()];if(i.mode==="manga"&&!i.singlePageMode){const m=H()[i.currentPage];m&&Array.isArray(m)?x=m:m&&m.pages&&(x=m.pages)}if(x.length>1){const c=await ts(x,"Select Page for Favorites ⭐");if(!c)return;x=c.pages}ka(x)}),(B=document.getElementById("fullscreen-btn"))==null||B.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{u("Fullscreen not supported","info")})}),document.body.classList.add("reader-active")}function Le(s){var n;const e=typeof s=="string"?s:(s==null?void 0:s.url)||((n=s==null?void 0:s.urls)==null?void 0:n[0]);if(!e)return null;const a=e.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function Je(){const s=Xt();return s.length===0?null:Le(i.images[s[0]])}async function Xe(s){const e=Date.now();if(i.images=s.map(t=>t+(t.includes("?")?"&":"?")+`_t=${e}`),i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.min(i.currentPage,i.images.length-1);else{const t=H();i.currentPage=Math.min(i.currentPage,t.length-1)}i.currentPage=Math.max(0,i.currentPage),ce()}async function es(){var s,e;if(!(!((s=i.manga)!=null&&s.id)||!((e=i.chapter)!=null&&e.number)))try{const t=await v.getNextChapterPreview(i.manga.id,i.chapter.number);i.nextChapterImage=t.firstImage||null,i.nextChapterNum=t.nextChapter||null}catch{i.nextChapterImage=null,i.nextChapterNum=null}}async function ba(){var o,r;if(!((o=i.manga)!=null&&o.id)||!((r=i.chapter)!=null&&r.number)||i.isCollectionMode)return;const e=[...i.manga.downloadedChapters||[]].sort((d,l)=>d-l),t=e.indexOf(i.chapter.number);if(t<0||t>=e.length-1)return;const a=e[t+1],n=i.manga.id;if(!(i._preloadCache&&i._preloadCache.chapterNum===a&&i._preloadCache.mangaId===n))try{const l=(i.manga.downloadedVersions||{})[a]||[],p=Array.isArray(l)?l[0]:l,y=p?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(p)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,h=(await v.get(y)).images||[];if(h.length===0)return;const k=h.map(g=>{const $=new Image,_=typeof g=="string"?g:g.url;return _&&($.src=_),$});i._preloadCache={chapterNum:a,mangaId:n,images:h,imageObjects:k,versionUrl:p},console.log(`[Reader] Preloaded ${h.length} images for chapter ${a}`)}catch(d){console.warn("[Reader] Failed to preload next chapter:",d)}}function wa(s,e){return new Promise(t=>{const a=document.createElement("div");a.className="version-modal-overlay",a.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${s.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const n=a.querySelector(".version-list");s.forEach((o,r)=>{const d=document.createElement("button");d.className="version-item",d.textContent=`Version ${r+1}`,d.addEventListener("click",()=>{a.remove(),t(o)}),n.appendChild(d)}),a.querySelector(".version-cancel").addEventListener("click",()=>{a.remove(),t(null)}),a.addEventListener("click",o=>{o.target===a&&(a.remove(),t(null))}),document.body.appendChild(a)})}function ka(s){if(!i.manga||!i.chapter)return;const e=s.map(l=>{const p=Le(i.images[l]);return p?{filename:p}:null}).filter(Boolean),t=l=>{if(!i.allFavorites||!i.allFavorites.favorites)return-1;const p=i.allFavorites.favorites[l];if(!Array.isArray(p))return-1;for(let y=0;y<p.length;y++){const C=p[y];if(C.mangaId===i.manga.id&&C.chapterNum===i.chapter.number&&C.imagePaths)for(const h of C.imagePaths){const k=typeof h=="string"?h:(h==null?void 0:h.filename)||(h==null?void 0:h.path);for(const g of e)if(g&&g.filename===k)return y}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";i.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',i.favoriteLists.forEach(l=>{const y=t(l)!==-1;n+=`
                <button class="page-picker-option list-option ${y?"active-list":""}" data-list="${l}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${l}</span>
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
    `,a.appendChild(o),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),rt()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),rt())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const p=l.dataset.list,y=t(p),C=y!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(C){await v.removeFavoriteItem(p,y);const h=await v.getFavorites();i.allFavorites=h,l.classList.remove("active-list"),l.querySelector("span:last-child").textContent="➕"}else{const h=s.length>1?"double":"single",k={mangaId:i.manga.id,chapterNum:i.chapter.number,title:`${i.manga.alias||i.manga.title} Ch.${i.chapter.number} p${s[0]+1}`,imagePaths:e,displayMode:h,displaySide:i.direction==="rtl"?"right":"left"};await v.addFavoriteItem(p,k);const g=await v.getFavorites();i.allFavorites=g,l.classList.add("active-list"),l.querySelector("span:last-child").textContent="✅"}}catch(h){console.error(h)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function ts(s,e){return new Promise(t=>{const[a,n]=s,o=i.images[a],r=i.images[n],d=typeof o=="string"?o:o==null?void 0:o.url,l=typeof r=="string"?r:r==null?void 0:r.url,p=i.direction==="rtl",y=p?n:a,C=p?a:n,h=p?l:d,k=p?d:l,g=document.createElement("div");g.className="page-picker-overlay",g.innerHTML=`
            <div class="page-picker-modal">
                <h3>${e}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${y+1}">
                        <img src="${h}" alt="Page ${y+1}">
                        <span class="page-picker-label">Page ${y+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${C+1}">
                        <img src="${k}" alt="Page ${C+1}">
                        <span class="page-picker-label">Page ${C+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    📖 Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const $=_=>{g.remove(),t(_)};g.querySelectorAll(".page-picker-option").forEach(_=>{_.addEventListener("click",()=>{const L=_.dataset.choice;L==="left"?$({pages:[y]}):L==="right"?$({pages:[C]}):L==="both"&&$({pages:s})})}),g.querySelector(".page-picker-cancel").addEventListener("click",()=>$(null)),g.addEventListener("click",_=>{_.target===g&&$(null)}),document.body.appendChild(g)})}function lt(){if(i.mode==="webtoon"){const s=document.getElementById("reader-content");if(s){const e=s.querySelectorAll("img");if(e.length>0){const t=s.scrollTop;if(t>10){let a=0;for(let n=0;n<e.length;n++){const o=e[n].offsetHeight;if(a+o>t)return n;a+=o}}}}return 0}else{if(i.singlePageMode)return i.currentPage;{const e=H()[i.currentPage];return e&&e.length>0?e[0]:0}}}function ss(s){if(!(s.target.tagName==="INPUT"||s.target.tagName==="TEXTAREA")){if(s.key==="Escape"){Ie(),i.manga&&P.go(`/manga/${i.manga.id}`);return}if(i.mode==="manga")s.key==="ArrowLeft"?i.direction==="rtl"?De():ct():s.key==="ArrowRight"?i.direction==="rtl"?ct():De():s.key===" "&&(s.preventDefault(),De());else if(i.mode==="webtoon"&&s.key===" "){s.preventDefault();const e=document.getElementById("reader-content");if(e){const t=e.clientHeight*.8;e.scrollBy({top:s.shiftKey?-t:t,behavior:"smooth"})}}}}function De(){const s=H(),e=i.singlePageMode?i.images.length-1:s.length-1;if(i.currentPage<e)i.currentPage++,ce();else{const t=s[i.currentPage],a=t&&t.type==="link";Ie(),a&&(i.navigationDirection="next-linked"),Ue(1)}}function ct(){i.currentPage>0?(i.currentPage--,ce()):Ue(-1)}function ce(){const s=document.getElementById("reader-content");if(s){s.innerHTML=i.isCollectionMode?Gt():i.mode==="webtoon"?Kt():Yt();const e=document.getElementById("page-indicator");e&&(i.singlePageMode?e.textContent=`${i.currentPage+1} / ${i.images.length}`:e.textContent=`${i.currentPage+1} / ${H().length}`);const t=document.getElementById("page-slider");t&&(t.value=i.currentPage,t.max=i.singlePageMode?i.images.length-1:H().length-1),Zt(),rt()}}function Ne(){const s=document.getElementById("app");s&&(s.innerHTML=ge(),Ve())}async function Ue(s){if(console.log("[Nav] navigateChapter called with delta:",s),!i.manga||!i.chapter){console.log("[Nav] early return - no manga or chapter");return}await Ie(),await pe();const t=[...i.manga.downloadedChapters||[]].sort((o,r)=>o-r),a=t.indexOf(i.chapter.number),n=a+s;if(console.log("[Nav]",{delta:s,chapterNumber:i.chapter.number,sorted:t,currentIdx:a,newIdx:n}),n>=0&&n<t.length){i.navigationDirection||(i.navigationDirection=s<0?"prev":null);const o=t[n],d=(i.manga.downloadedVersions||{})[o]||[],l=Array.isArray(d)?d[0]:d,p=l?`?version=${encodeURIComponent(l)}`:"";console.log("[Nav] Calling router.go with:",`/read/${i.manga.id}/${o}${p}`),P.go(`/read/${i.manga.id}/${o}${p}`)}else u(s>0?"Last chapter":"First chapter","info")}async function he(s,e,t){var a,n,o,r,d;console.log("[Reader] loadData called:",{mangaId:s,chapterNum:e,versionUrl:t});try{if(i.mode=localStorage.getItem("reader_mode")||"webtoon",i.direction=localStorage.getItem("reader_direction")||"rtl",s==="gallery"){const y=decodeURIComponent(e),h=((a=(await v.getFavorites()).favorites)==null?void 0:a[y])||[];i.images=[];for(const k of h){const g=k.imagePaths||[],$=[];for(const _ of g){let L;typeof _=="string"?L=_:_&&typeof _=="object"&&(L=_.filename||_.path||_.name||_.url,L&&L.includes("/")&&(L=L.split("/").pop()),L&&L.includes("\\")&&(L=L.split("\\").pop())),L&&$.push(`/api/public/chapter-images/${k.mangaId}/${k.chapterNum}/${encodeURIComponent(L)}`)}$.length>0&&i.images.push({urls:$,displayMode:k.displayMode||"single",displaySide:k.displaySide||"left"})}i.manga={id:"gallery",title:y,alias:y},i.chapter={number:"Gallery"},i.isGalleryMode=!0,i.isCollectionMode=!0,i.images.length===0&&u("Gallery is empty","warning")}else if(s==="trophies"){const y=e;let C=[],h="Trophies";if(y.startsWith("series-")){const k=y.replace("series-",""),$=(await store.loadSeries()).find(T=>T.id===k);h=$?$.alias||$.title:"Series Trophies";const L=(await store.loadBookmarks()).filter(T=>T.seriesId===k);for(const T of L){const B=await v.getTrophyPagesAll(T.id);for(const b in B)for(const x in B[b]){const c=B[b][x],w=(await v.getChapterImages(T.id,b)).images[x],S=typeof w=="string"?w.split("/").pop():(w==null?void 0:w.filename)||(w==null?void 0:w.path);C.push({mangaId:T.id,chapterNum:b,imagePaths:[{filename:S}],displayMode:c.isSingle?"single":"double",displaySide:"left"})}}}else{const k=await v.getBookmark(y);h=k?k.alias||k.title:"Manga Trophies";const g=await v.getTrophyPagesAll(y);for(const $ in g)for(const _ in g[$]){const L=g[$][_],B=(await v.getChapterImages(y,$)).images[_],b=typeof B=="string"?B.split("/").pop():(B==null?void 0:B.filename)||(B==null?void 0:B.path);C.push({mangaId:y,chapterNum:$,imagePaths:[{filename:decodeURIComponent(b)}],displayMode:L.isSingle?"single":"double",displaySide:"left"})}}i.images=C.map(k=>{const g=k.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${k.mangaId}/${k.chapterNum}/${encodeURIComponent(g)}`],displayMode:k.displayMode,displaySide:k.displaySide}}),i.manga={id:"trophies",title:h,alias:h},i.chapter={number:"🏆"},i.isCollectionMode=!0,i.isGalleryMode=!1}else{i.isGalleryMode=!1;const y=await v.getBookmark(s);i.manga=y,console.log("[Reader] manga loaded, finding chapter..."),i.chapter=((n=y.chapters)==null?void 0:n.find(h=>h.number===parseFloat(e)))||{number:parseFloat(e)};const C=parseFloat(e);if(i._preloadCache&&i._preloadCache.mangaId===s&&i._preloadCache.chapterNum===C)console.log("[Reader] Using preloaded images for chapter",e),i.images=i._preloadCache.images||[],i._preloadCache=null;else{const h=t?`/bookmarks/${s}/chapters/${e}/reader-images?version=${encodeURIComponent(t)}`:`/bookmarks/${s}/chapters/${e}/reader-images`,k=await v.get(h);console.log("[Reader] images loaded, count:",(o=k.images)==null?void 0:o.length),i.images=k.images||[]}try{const h=await v.getChapterSettings(s,e);if(h&&(h.mode||h.direction||h.firstPageSingle!==void 0||h.lastPageSingle!==void 0))h.mode&&(i.mode=h.mode),h.direction&&(i.direction=h.direction),h.firstPageSingle!==void 0&&(i.firstPageSingle=h.firstPageSingle),h.lastPageSingle!==void 0&&(i.lastPageSingle=h.lastPageSingle);else try{const $=[...i.manga.downloadedChapters||[]].sort((B,b)=>B-b),_=parseFloat(e),L=$.indexOf(_),T=[];L>0&&T.push($[L-1]),L<$.length-1&&T.push($[L+1]);for(const B of T){const b=await v.getChapterSettings(s,B);if(b&&(b.mode||b.direction||b.firstPageSingle!==void 0||b.lastPageSingle!==void 0)){b.mode&&(i.mode=b.mode),b.direction&&(i.direction=b.direction),b.firstPageSingle!==void 0&&(i.firstPageSingle=b.firstPageSingle),b.lastPageSingle!==void 0&&(i.lastPageSingle=b.lastPageSingle),console.log("[Reader] Inherited settings from chapter",B);break}}}catch(g){console.warn("Failed to inherit chapter settings",g)}}catch(h){console.warn("Failed to load chapter settings",h)}try{const h=await v.getTrophyPages(s,e);i.trophyPages=h||{}}catch(h){console.warn("Failed to load trophy pages",h)}try{const h=await v.getFavorites();i.allFavorites=h,i.favoriteLists=Object.keys(h.favorites||h||{})}catch(h){console.warn("Failed to load favorites",h)}}const l=parseFloat(e),p=(d=(r=i.manga)==null?void 0:r.readingProgress)==null?void 0:d[l];if(p&&p.page<p.totalPages)if(i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,p.page-1);else{const y=Math.max(0,p.page-1),C=H();let h=0;for(let k=0;k<C.length;k++){const g=C[k],$=Array.isArray(g)?g:g.pages||[];if($.includes(y)||$[0]>=y){h=k;break}h=k}i.currentPage=h}else i.currentPage=0,i._resumeScrollToPage=p.page-1;else i.currentPage=0}catch(l){console.error("Error loading chapter:",l),u("Failed to load chapter","error")}if(i.navigationDirection==="prev"&&i.mode==="manga")if(i.singlePageMode)i.currentPage=Math.max(0,i.images.length-1);else{const l=H();i.currentPage=Math.max(0,l.length-1)}else if(i.navigationDirection==="next-linked"&&i.mode==="manga"&&i.images.length>1)if(i.singlePageMode)i.currentPage=1;else{const l=H();let p=0;for(let y=0;y<l.length;y++){const C=l[y];if((Array.isArray(C)?C:C.pages||[]).includes(1)){p=y;break}}i.currentPage=p}i.navigationDirection=null,i.lastPageSingle&&await es(),i.loading=!1,Ne(),ba(),i.mode==="webtoon"&&i._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const p=l.querySelectorAll("img");p[i._resumeScrollToPage]&&p[i._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete i._resumeScrollToPage},300)}async function Ea(s=[]){console.log("[Reader] mount called with params:",s);let[e,t]=s,a=null;if(t&&t.includes("?")){const[o,r]=t.split("?");t=o,a=new URLSearchParams(r).get("version")}if(console.log("[Reader] mangaId:",e,"chapterNum:",t,"urlVersion:",a),!e||!t){P.go("/");return}const n=document.getElementById("app");if(i.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),i.images=[],i.singlePageMode=!1,i._resumeScrollToPage=null,i.nextChapterImage=null,i.nextChapterNum=null,n.innerHTML=ge(),a)await he(e,t,decodeURIComponent(a));else try{const o=await v.getBookmark(e),r=o.downloadedVersions||{},d=new Set(o.deletedChapterUrls||[]),l=r[parseFloat(t)];let p=[];if(Array.isArray(l)&&(p=l.filter(y=>!d.has(y))),p.length>1){const y=await wa(p,t);if(y===null){P.go(`/manga/${e}`);return}await he(e,t,y)}else p.length===1?await he(e,t,p[0]):await he(e,t)}catch(o){console.log("[Reader] Error in version check, falling back:",o),await he(e,t)}if(n.innerHTML=ge(),console.log("[Reader] render called, loading:",i.loading,"manga:",!!i.manga,"images:",i.images.length),Ve(),i.mode==="webtoon"&&i._resumeScrollToPage!=null){const o=i._resumeScrollToPage;i._resumeScrollToPage=null,setTimeout(()=>{const r=document.getElementById("reader-content");if(r){const d=r.querySelectorAll("img");d[o]&&d[o].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function Ca(){console.log("[Reader] unmount called"),await Ie(),await pe(),document.body.classList.remove("reader-active"),document.removeEventListener("keydown",ss),i.manga=null,i.chapter=null,i.images=[],i.loading=!0,i.singlePageMode=!1,i._resumeScrollToPage=null,i._preloadCache=null}async function pe(){if(!(!i.manga||!i.chapter||i.manga.id==="gallery"))try{await v.updateChapterSettings(i.manga.id,i.chapter.number,{mode:i.mode,direction:i.direction,firstPageSingle:i.firstPageSingle,lastPageSingle:i.lastPageSingle})}catch(s){console.error("Failed to save settings:",s)}}async function as(s){try{const e=await v.getBookmark(s),t=e.downloadedChapters||[],a=new Set(e.readChapters||[]),n=e.readingProgress||{},o=e.downloadedVersions||{},r=[...t].sort((l,p)=>l-p);let d=null;for(const l of r){const p=n[l];if(p&&p.page<p.totalPages&&!a.has(l)){d=l;break}}if(d===null){for(const l of r)if(!a.has(l)){d=l;break}}if(d===null&&r.length>0&&(d=r[0]),d!==null){const l=o[d]||[],p=Array.isArray(l)?l[0]:l,y=p?`?version=${encodeURIComponent(p)}`:"";P.go(`/read/${s}/${d}${y}`)}else u("No downloaded chapters to read","info")}catch(e){u("Failed to continue reading: "+e.message,"error")}}const $a={mount:Ea,unmount:Ca,render:ge,continueReading:as},Se=50;let f={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1};function xa(s){return s.autoCheck===!0?`<button class="btn btn-primary" id="schedule-btn">⏰ ${s.checkSchedule==="weekly"?`${(s.checkDay||"monday").charAt(0).toUpperCase()+(s.checkDay||"monday").slice(1)} ${s.checkTime||"06:00"}`:s.checkSchedule==="daily"?`Daily ${s.checkTime||"06:00"}`:"Every 6h"}</button>`:'<button class="btn btn-secondary" id="schedule-btn">⏰ Schedule</button>'}function Sa(s){const e=s.autoCheck===!0,t=s.checkSchedule||"daily",a=s.checkDay||"monday",n=s.checkTime||"06:00",o=s.autoDownload||!1;return`
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
  `}function dt(){var x;if(f.loading)return`
      ${Z()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const s=f.manga;if(!s)return`
      ${Z()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=s.alias||s.title,t=s.chapters||[],a=new Set(s.downloadedChapters||[]),n=new Set(s.readChapters||[]),o=new Set(s.excludedChapters||[]),r=new Set(s.deletedChapterUrls||[]),d=s.volumes||[],l=new Set;d.forEach(c=>{(c.chapters||[]).forEach(m=>l.add(m))});let p;f.filter==="hidden"?p=t.filter(c=>o.has(c.number)||r.has(c.url)):p=t.filter(c=>!o.has(c.number)&&!r.has(c.url));const y=p.filter(c=>!l.has(c.number));let C=[];if(f.activeVolume){const c=new Set(f.activeVolume.chapters||[]);C=p.filter(m=>c.has(m.number))}else C=y;const h=new Map;C.forEach(c=>{h.has(c.number)||h.set(c.number,[]),h.get(c.number).push(c)});let k=Array.from(h.entries()).sort((c,m)=>c[0]-m[0]);f.filter==="downloaded"?k=k.filter(([c])=>a.has(c)):f.filter==="not-downloaded"?k=k.filter(([c])=>!a.has(c)):f.filter==="main"?k=k.filter(([c])=>Number.isInteger(c)):f.filter==="extra"&&(k=k.filter(([c])=>!Number.isInteger(c)));const g=Math.max(1,Math.ceil(k.length/Se));f.currentPage>=g&&(f.currentPage=Math.max(0,g-1));const $=f.currentPage*Se,L=[...k.slice($,$+Se)].reverse(),T=h.size,B=[...h.keys()].filter(c=>a.has(c)).length;n.size;let b="";if(f.activeVolume){const c=f.activeVolume;let m=null;c.local_cover?m=`/api/public/covers/${s.id}/${encodeURIComponent(c.local_cover.split(/[/\\]/).pop())}`:c.cover&&(m=c.cover),b=`
      ${Z()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${m?`<img src="${m}" alt="${c.name}">`:'<div class="placeholder">📚</div>'}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${s.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${c.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${T} Chapters</span>
                ${B>0?`<span class="meta-item downloaded">${B} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${s.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${f.manageChapters?"Done Managing":"➕ Add Chapters"}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${c.id}">✏️ Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const c=s.localCover?`/api/public/covers/${s.id}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover;b=`
        ${Z()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${c?`<img src="${c}" alt="${e}">`:'<div class="placeholder">📚</div>'}
              </div>
              <div class="manga-detail-info">
                <h1>${e}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${s.website||"Local"}</span>
                  <span class="meta-item">${((x=s.chapters)==null?void 0:x.length)||0} Total Chapters</span>
                  ${a.size>0?`<span class="meta-item downloaded">${a.size} Downloaded</span>`:""}
                  ${n.size>0?`<span class="meta-item">${n.size} Read</span>`:""}
                </div>
                ${(s.artists||[]).length>0||(s.categories||[]).length>0?`
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(s.artists||[]).length>0?`
                    <span class="meta-label">Author:</span>
                    ${s.artists.map(m=>`<a href="#//" class="artist-link" data-artist="${m}">${m}</a>`).join(", ")}
                  `:""}
                  ${(s.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(s.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${s.categories.map(m=>`<span class="tag">${m}</span>`).join("")}
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
              <button class="btn btn-secondary" id="edit-btn">✏️ Edit</button>
              ${(s.volumes||[]).length===0?'<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>':""}
              ${xa(s)}
            </div>
            ${s.description?`<p class="manga-description">${s.description}</p>`:""}
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
        
        ${f.activeVolume?f.manageChapters?Aa(s,y):"":Pa(s,a)}
        
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
          
          ${g>1?It(g):""}
          
          <div class="chapter-list">
            ${L.map(([c,m])=>Ba(c,m,a,n,s)).join("")}
          </div>
          
          ${g>1?It(g):""}
        </div>
      ${Ia()}
    </div>
  `}function La(){const s=f.manga;return s?`
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
  `:""}function _a(){const s=f.manga;return s?`
    <div class="modal" id="migrate-source-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h2>🔄 Change Source</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Current source: <strong>${s.website||"Local"}</strong></p>
          <p class="text-muted" style="font-size: 0.85em; margin-bottom: 12px;">Enter the new URL for this manga. Downloaded chapters will be preserved as local versions.</p>
          <div class="form-group">
            <label for="migrate-url-input">New Manga URL</label>
            <input type="url" id="migrate-url-input" placeholder="https://..." style="width: 100%;">
          </div>
          <p class="text-muted" style="font-size: 0.8em;">Current URL: <code style="word-break:break-all;">${s.url}</code></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-migrate-btn">Migrate Source</button>
        </div>
      </div>
    </div>
  `:""}function Ia(){var e,t;const s=f.manga;return`
    ${s?Sa(s):""}
    ${Ga()}
    ${La()}
    ${_a()}

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
  `}function Ba(s,e,t,a,n){var b,x,c,m;const o=t.has(s),r=a.has(s),d=!Number.isInteger(s),l=((b=n.downloadedVersions)==null?void 0:b[s])||[],p=new Set(n.deletedChapterUrls||[]),y=e.filter(w=>f.filter==="hidden"?!0:!p.has(w.url)),C=!!f.activeVolume;let h=y;C&&(h=y.filter(w=>Array.isArray(l)?l.includes(w.url):l===w.url)),h.sort((w,S)=>{const I=Array.isArray(l)?l.includes(w.url):l===w.url;return((Array.isArray(l)?l.includes(S.url):l===S.url)?1:0)-(I?1:0)});const k=h.length>1,g=(x=h[0])!=null&&x.url?encodeURIComponent(h[0].url):null,$=n.chapterSettings||{},_=C?!0:(c=$[s])==null?void 0:c.locked,L=["chapter-item",o?"downloaded":"",r?"read":"",d?"extra":""].filter(Boolean).join(" "),T=k?`
    <div class="versions-dropdown hidden" id="versions-${s}">
      ${h.map(w=>{const S=encodeURIComponent(w.url),I=Array.isArray(l)?l.includes(w.url):l===w.url,M=w.url.startsWith("local://");return`
          <div class="version-row ${I?"downloaded":""}"
               data-version-url="${S}" data-num="${s}">
            <span class="version-title" style="cursor: pointer; flex: 1;">${w.title||w.releaseGroup||"Version"}${M?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}</span>
            <div class="version-actions">
              ${I?`<button class="btn-icon small success" data-action="read-version" data-num="${s}" data-url="${S}">▶</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${s}" data-url="${S}">🗑️</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${s}" data-url="${S}">↓</button>`}
              ${p.has(w.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${s}" data-url="${S}" title="Restore Version">↩️</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${s}" data-url="${S}" title="Hide Version">👁️‍🗨️</button>`}
            </div>
          </div>
        `}).join("")}
    </div>
  `:"",B=(n.excludedChapters||[]).includes(s);return`
    <div class="chapter-group" data-chapter="${s}">
      <div class="${L}" data-num="${s}" style="${B?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${s}</span>
        <span class="chapter-title">
          ${h[0]?h[0].title!==`Chapter ${s}`?h[0].title:"":e[0].title}
          ${B?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
        </span>
        ${d?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${B?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${s}" title="Restore Chapter">↩️</button>`:C?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${f.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${s}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${_?"locked":""}"
                        data-action="lock" data-num="${s}"
                        title="${_?"Unlock":"Lock"}">
                  ${_?"🔒":"🔓"}
                </button>`}
          ${!B&&g?p.has((m=h[0])==null?void 0:m.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${s}" data-url="${g}" title="Unhide Chapter">↩️</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${s}" data-url="${g}" title="Hide Chapter">👁️‍🗨️</button>`:""}
          <button class="btn-icon small ${r?"success":"muted"}"
                  data-action="read" data-num="${s}"
                  title="${r?"Mark unread":"Mark read"}">
            ${r?"👁️":"○"}
          </button>
          ${o?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${s}" data-url="${g}" title="Delete Files">🗑️</button>`:`<button class="btn-icon small ${o?"success":""}"
              data-action="download" data-num="${s}"
              title="${o?"Downloaded":"Download"}">
          ${o?"✓":"↓"}
        </button>`}
          ${k?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${s}">
              ${y.length} ▼
            </button>
          `:""}
        </div>
      </div>
      ${T}
    </div>
  `}function It(s){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${f.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${f.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${f.currentPage+1} of ${s}</span>
      <button class="btn btn-icon" data-page="next" ${f.currentPage>=s-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${f.currentPage>=s-1?"disabled":""}>»</button>
    </div>
  `}function Aa(s,e){return e.length===0?`
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
  `}function Pa(s,e){var n;const t=s.volumes||[];return t.length===0?"":`
    <div class="volumes-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="margin: 0;">Volumes</h2>
        <button class="btn btn-secondary btn-small" id="add-volume-btn">+ Add Volume</button>
      </div>
      <div class="volumes-grid">
        ${t.map(o=>{const r=o.chapters||[],d=r.filter(l=>e.has(l)).length;return`
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
    `}).join("")||(((n=s.chapters)==null?void 0:n.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function Ta(){var t,a,n,o,r,d,l,p,y,C,h,k,g,$,_,L,T,B,b,x;const s=document.getElementById("app"),e=f.manga;e&&((t=document.getElementById("back-btn"))==null||t.addEventListener("click",()=>P.go("/")),(a=document.getElementById("back-library-btn"))==null||a.addEventListener("click",()=>P.go("/")),s.querySelectorAll(".artist-link").forEach(c=>{c.addEventListener("click",m=>{m.preventDefault();const w=c.dataset.artist;w&&(localStorage.setItem("library_search",w),localStorage.removeItem("library_artist_filter"),P.go("/"))})}),(n=document.getElementById("continue-btn"))==null||n.addEventListener("click",()=>{as(e.id)}),(o=document.getElementById("download-all-btn"))==null||o.addEventListener("click",()=>{const c=document.getElementById("download-all-modal");c&&c.classList.add("open")}),(r=document.getElementById("confirm-download-all-btn"))==null||r.addEventListener("click",async()=>{var c;try{u("Queueing downloads...","info");const m=document.getElementsByName("download-version-mode");let w="single";for(const I of m)I.checked&&(w=I.value);(c=document.getElementById("download-all-modal"))==null||c.classList.remove("open");const S=await v.post(`/bookmarks/${e.id}/download`,{all:!0,versionMode:w});S.chaptersCount>0?u(`Download queued: ${S.chaptersCount} versions`,"success"):u("Already have these chapters downloaded","info")}catch(m){u("Failed to download: "+m.message,"error")}}),(d=document.getElementById("check-updates-btn"))==null||d.addEventListener("click",async()=>{try{u("Checking for updates...","info"),await v.post(`/bookmarks/${e.id}/quick-check`),u("Check complete!","success")}catch(c){u("Check failed: "+c.message,"error")}}),(l=document.getElementById("schedule-btn"))==null||l.addEventListener("click",()=>{const c=document.getElementById("schedule-modal");c&&c.classList.add("open")}),(p=document.getElementById("schedule-type"))==null||p.addEventListener("change",c=>{const m=document.getElementById("schedule-day-group");m&&(m.style.display=c.target.value==="weekly"?"":"none")}),(y=document.getElementById("save-schedule-btn"))==null||y.addEventListener("click",async()=>{var c;try{const m=document.getElementById("schedule-type").value,w=document.getElementById("schedule-day").value,S=document.getElementById("schedule-time").value,I=document.getElementById("auto-download-toggle").checked;await v.updateAutoCheckSchedule(e.id,{enabled:!0,schedule:m,day:w,time:S,autoDownload:I}),f.manga.checkSchedule=m,f.manga.checkDay=w,f.manga.checkTime=S,f.manga.autoDownload=I,(c=document.getElementById("schedule-modal"))==null||c.classList.remove("open"),N([e.id]),u("Schedule updated","success")}catch(m){u("Failed to save schedule: "+m.message,"error")}}),(C=document.getElementById("disable-schedule-btn"))==null||C.addEventListener("click",async()=>{var c;try{await v.toggleAutoCheck(e.id,!1),f.manga.autoCheck=!1,f.manga.checkSchedule=null,f.manga.checkDay=null,f.manga.checkTime=null,f.manga.nextCheck=null,(c=document.getElementById("schedule-modal"))==null||c.classList.remove("open"),N([e.id]),u("Auto-check disabled","success")}catch(m){u("Failed to disable: "+m.message,"error")}}),(h=document.getElementById("refresh-btn"))==null||h.addEventListener("click",async()=>{const c=document.getElementById("refresh-btn");try{c.disabled=!0,c.textContent="⏳ Checking...",u("Checking for updates...","info"),await v.post(`/bookmarks/${e.id}/check`),await z(e.id),N([e.id]),u("Check complete!","success")}catch(m){u("Check failed: "+m.message,"error"),c&&(c.disabled=!1,c.textContent="🔄 Refresh")}}),(k=document.getElementById("scan-folder-btn"))==null||k.addEventListener("click",async()=>{var m,w;const c=document.getElementById("scan-folder-btn");try{c.disabled=!0,c.textContent="⏳ Scanning...",u("Scanning folder...","info");const S=await v.scanBookmark(e.id);await z(e.id),N([e.id]);const I=((m=S.addedChapters)==null?void 0:m.length)||0,M=((w=S.removedChapters)==null?void 0:w.length)||0;I>0||M>0?u(`Scan complete: ${I} added, ${M} removed`,"success"):u("Scan complete: No changes","info")}catch(S){u("Scan failed: "+S.message,"error")}finally{c&&(c.disabled=!1,c.textContent="📁 Scan Folder")}}),document.querySelectorAll("[data-cbz-path]").forEach(c=>{c.addEventListener("click",async()=>{const m=decodeURIComponent(c.dataset.cbzPath),w=parseInt(c.dataset.cbzChapter)||1,S=c.dataset.cbzExtracted==="true",I=prompt("Enter chapter number for extraction:",String(w));if(!I)return;const M=parseFloat(I);if(isNaN(M)){u("Invalid chapter number","error");return}try{c.disabled=!0,c.textContent="Extracting...",u("Extracting CBZ...","info"),await v.extractCbz(e.id,m,M,{forceReExtract:S}),u("CBZ extracted successfully!","success"),await z(e.id),N([e.id])}catch(O){u("Extract failed: "+O.message,"error")}finally{c.disabled=!1,c.textContent=S?"Re-Extract":"Extract"}})}),(g=document.getElementById("edit-btn"))==null||g.addEventListener("click",async()=>{const c=document.getElementById("edit-manga-modal");if(c){document.getElementById("edit-alias-input").value=e.alias||"",window._selectedCoverPath=null;try{const[m,w]=await Promise.all([v.getAllArtists(),v.getAllCategories()]),S=document.getElementById("artist-list"),I=document.getElementById("category-list");window._allArtists=m,window._allCategories=w,S&&(S.innerHTML=m.map(te=>`<option value="${te}">`).join("")),I&&(I.innerHTML=w.map(te=>`<option value="${te}">`).join(""));const M=document.getElementById("edit-artist-input"),O=document.getElementById("edit-categories-input");M==null||M.addEventListener("input",()=>{const te=M.value.toLowerCase(),re=M.value.lastIndexOf(","),A=M.value.substring(re+1).trim().toLowerCase();if(A.length>0&&window._allArtists){const D=window._allArtists.filter(F=>F.toLowerCase().includes(A));if(S&&D.length>0){const F=re>=0?M.value.substring(0,re+1)+" ":"";S.innerHTML=D.map(G=>`<option value="${F}${G}">`).join("")}}}),O==null||O.addEventListener("input",()=>{const te=O.value.lastIndexOf(","),re=O.value.substring(te+1).trim().toLowerCase();if(re.length>0&&window._allCategories){const A=window._allCategories.filter(D=>D.toLowerCase().includes(re));if(I&&A.length>0){const D=te>=0?O.value.substring(0,te+1)+" ":"";I.innerHTML=A.map(F=>`<option value="${D}${F}">`).join("")}}})}catch(m){console.error("Failed to load artists/categories:",m)}c.classList.add("open")}}),($=document.getElementById("save-manga-btn"))==null||$.addEventListener("click",async()=>{var c;try{const m=document.getElementById("edit-alias-input").value.trim(),w=document.getElementById("edit-artist-input").value.trim(),S=document.getElementById("edit-categories-input").value.trim(),I=w?w.split(",").map(O=>O.trim()).filter(O=>O):[],M=S?S.split(",").map(O=>O.trim()).filter(O=>O):[];await v.updateBookmark(e.id,{alias:m||null}),await v.setBookmarkArtists(e.id,I),await v.setBookmarkCategories(e.id,M),window._selectedCoverPath&&await v.setBookmarkCoverFromImage(e.id,window._selectedCoverPath),f.manga.alias=m||null,f.manga.artists=I,f.manga.categories=M,(c=document.getElementById("edit-manga-modal"))==null||c.classList.remove("open"),N([e.id]),u("Manga updated","success")}catch(m){u("Failed to update: "+m.message,"error")}}),(_=document.getElementById("change-cover-btn"))==null||_.addEventListener("click",async()=>{try{u("Loading images...","info");const c=await v.getFolderImages(e.id);if(c.length===0){u("No images found in manga folder","warning");return}const m=document.createElement("div");m.id="cover-select-modal",m.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",m.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${c.slice(0,50).map(w=>`
              <div class="cover-option" data-path="${w.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(w.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${c.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${c.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(m),document.getElementById("close-cover-modal").addEventListener("click",()=>m.remove()),m.addEventListener("click",w=>{w.target===m&&m.remove()}),m.querySelectorAll(".cover-option").forEach(w=>{w.addEventListener("click",()=>{window._selectedCoverPath=w.dataset.path;const S=document.getElementById("cover-preview");S&&(S.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),m.remove(),u("Cover selected","success")})})}catch(c){u("Failed to load images: "+c.message,"error")}}),(L=document.getElementById("delete-manga-btn"))==null||L.addEventListener("click",()=>{const c=document.getElementById("delete-manga-modal");c&&c.classList.add("open")}),(T=document.getElementById("confirm-delete-manga-btn"))==null||T.addEventListener("click",async()=>{var m,w;const c=((m=document.getElementById("delete-files-toggle"))==null?void 0:m.checked)||!1;try{await v.deleteBookmark(e.id,c),(w=document.getElementById("delete-manga-modal"))==null||w.classList.remove("open"),u("Manga deleted","success"),P.go("/")}catch(S){u("Failed to delete: "+S.message,"error")}}),(B=document.getElementById("quick-check-btn"))==null||B.addEventListener("click",async()=>{const c=document.getElementById("quick-check-btn");try{c.disabled=!0,c.textContent="⏳ Checking...",u("Quick checking for updates...","info");const m=await v.post(`/bookmarks/${e.id}/quick-check`);await z(e.id),N([e.id]),m.newChaptersCount>0?u(`Found ${m.newChaptersCount} new chapter(s)!`,"success"):u("No new chapters found","info")}catch(m){u("Quick check failed: "+m.message,"error")}finally{c&&(c.disabled=!1,c.textContent="⚡ Quick Check")}}),(b=document.getElementById("source-label"))==null||b.addEventListener("click",()=>{const c=document.getElementById("migrate-source-modal");c&&c.classList.add("open")}),(x=document.getElementById("confirm-migrate-btn"))==null||x.addEventListener("click",async()=>{var w,S,I;const c=(S=(w=document.getElementById("migrate-url-input"))==null?void 0:w.value)==null?void 0:S.trim();if(!c){u("Please enter a URL","warning");return}const m=document.getElementById("confirm-migrate-btn");try{m.disabled=!0,m.textContent="Migrating...",u("Migrating source...","info");const M=await v.migrateSource(e.id,c);u(`Migrated! ${M.migratedChapters} chapters preserved as local`,"success"),u("Running full check on new source...","info"),await v.post(`/bookmarks/${e.id}/check`),(I=document.getElementById("migrate-source-modal"))==null||I.classList.remove("open"),await z(e.id),N([e.id]),u("Source migration complete!","success")}catch(M){u("Migration failed: "+M.message,"error")}finally{m&&(m.disabled=!1,m.textContent="Migrate Source")}}),s.querySelectorAll(".filter-btn").forEach(c=>{c.addEventListener("click",()=>{f.filter=c.dataset.filter,f.currentPage=0,N([e.id])})}),s.querySelectorAll("[data-page]").forEach(c=>{c.addEventListener("click",()=>{const m=c.dataset.page,w=Math.ceil(f.manga.chapters.length/Se);switch(m){case"first":f.currentPage=0;break;case"prev":f.currentPage=Math.max(0,f.currentPage-1);break;case"next":f.currentPage=Math.min(w-1,f.currentPage+1);break;case"last":f.currentPage=w-1;break}N([e.id])})}),s.querySelectorAll(".chapter-item").forEach(c=>{c.addEventListener("click",m=>{var I;if(m.target.closest(".chapter-actions"))return;const w=parseFloat(c.dataset.num);if((e.downloadedChapters||[]).includes(w)){const M=((I=e.downloadedVersions)==null?void 0:I[w])||[],O=Array.isArray(M)?M[0]:M;O?P.go(`/read/${e.id}/${w}?version=${encodeURIComponent(O)}`):P.go(`/read/${e.id}/${w}`)}else u("Chapter not downloaded","info")})}),s.querySelectorAll("[data-action]").forEach(c=>{c.addEventListener("click",async m=>{m.stopPropagation();const w=c.dataset.action,S=parseFloat(c.dataset.num),I=c.dataset.url?decodeURIComponent(c.dataset.url):null;switch(w){case"lock":await Ma(S);break;case"read":await Ra(S);break;case"download":await Da(S);break;case"versions":Na(S);break;case"read-version":P.go(`/read/${e.id}/${S}?version=${encodeURIComponent(I)}`);break;case"download-version":await qa(S,I);break;case"delete-version":await Fa(S,I);break;case"hide-version":await Oa(S,I);break;case"restore-version":await Va(S,I);break;case"restore-chapter":await Ua(S);break;case"delete-chapter":await Ha(S,I);break;case"hide-chapter":await za(S,I);break;case"unhide-chapter":await ja(S,I);break}})}),s.querySelectorAll(".version-row .version-title").forEach(c=>{c.addEventListener("click",m=>{m.stopPropagation();const w=c.closest(".version-row"),S=parseFloat(w.dataset.num),I=w.dataset.versionUrl?decodeURIComponent(w.dataset.versionUrl):null;w.classList.contains("downloaded")&&I?P.go(`/read/${e.id}/${S}?version=${encodeURIComponent(I)}`):u("Version not downloaded yet","info")})}),s.querySelectorAll(".volume-card").forEach(c=>{c.addEventListener("click",()=>{const m=c.dataset.volumeId;P.go(`/manga/${e.id}/volume/${m}`)})}),Ka(s),ue(),V.subscribeToManga(e.id))}async function Ma(s){var n;const e=f.manga,t=((n=e.chapterSettings)==null?void 0:n[s])||{},a=!t.locked;try{a?await v.lockChapter(e.id,s):await v.unlockChapter(e.id,s),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[s]={...t,locked:a},u(a?"Chapter locked":"Chapter unlocked","success"),N([e.id])}catch(o){u("Failed: "+o.message,"error")}}async function Ra(s){const e=f.manga,t=new Set(e.readChapters||[]),a=t.has(s);try{await v.post(`/bookmarks/${e.id}/chapters/${s}/read`,{read:!a}),a?t.delete(s):t.add(s),e.readChapters=[...t],u(a?"Marked unread":"Marked read","success"),N([e.id])}catch(n){u("Failed: "+n.message,"error")}}async function Da(s){const e=f.manga,t=new Set(e.deletedChapterUrls||[]),a=(e.chapters||[]).find(n=>n.number===s&&!t.has(n.url));try{u(`Downloading chapter ${s}...`,"info"),a?await v.post(`/bookmarks/${e.id}/download-version`,{chapterNumber:s,url:a.url}):await v.post(`/bookmarks/${e.id}/download`,{chapters:[s]}),u("Download queued!","success")}catch(n){u("Failed: "+n.message,"error")}}function Na(s){document.querySelectorAll(".versions-dropdown").forEach(t=>{t.id!==`versions-${s}`&&t.classList.add("hidden")});const e=document.getElementById(`versions-${s}`);e&&e.classList.toggle("hidden")}async function qa(s,e){const t=f.manga;try{u("Downloading version...","info"),await v.post(`/bookmarks/${t.id}/download-version`,{chapterNumber:s,url:e}),u("Download queued!","success")}catch(a){u("Failed: "+a.message,"error")}}async function Fa(s,e){const t=f.manga;try{await v.request(`/bookmarks/${t.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:s,url:e})}),u("Version deleted","success"),await z(t.id),N([t.id])}catch(a){u("Failed: "+a.message,"error")}}async function Oa(s,e){const t=f.manga;try{await v.hideVersion(t.id,s,e),u("Version hidden","success"),await z(t.id),N([t.id])}catch(a){u("Failed: "+a.message,"error")}}async function Va(s,e){const t=f.manga;try{await v.unhideVersion(t.id,s,e),u("Version restored","success"),await z(t.id),N([t.id])}catch(a){u("Failed to restore version: "+a.message,"error")}}async function Ua(s){const e=f.manga;try{await v.unexcludeChapter(e.id,s),u("Chapter restored","success"),await z(e.id),N([e.id])}catch(t){u("Failed to restore chapter: "+t.message,"error")}}async function Ha(s,e){const t=f.manga;if(confirm("Delete this chapter's files from disk?"))try{await v.request(`/bookmarks/${t.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:s,url:e})}),u("Chapter files deleted","success"),await z(t.id),N([t.id])}catch(a){u("Failed to delete: "+a.message,"error")}}async function za(s,e){const t=f.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await v.hideVersion(t.id,s,e),u("Chapter hidden","success"),await z(t.id),N([t.id])}catch(a){u("Failed to hide chapter: "+a.message,"error")}}async function ja(s,e){const t=f.manga;try{await v.unhideVersion(t.id,s,e),u("Chapter unhidden","success"),await z(t.id),N([t.id])}catch(a){u("Failed to unhide chapter: "+a.message,"error")}}async function z(s){try{const[e,t]=await Promise.all([v.getBookmark(s),ne.loadCategories()]);if(f.manga=e,f.categories=t,f.loading=!1,e.website==="Local")try{const o=await v.getCbzFiles(s);f.cbzFiles=o||[]}catch(o){console.error("Failed to load CBZ files:",o),f.cbzFiles=[]}else f.cbzFiles=[];const a=new Set((e.chapters||[]).map(o=>o.number)).size,n=Math.ceil(a/Se);f.currentPage=Math.max(0,n-1),f.activeVolumeId?f.activeVolume=(e.volumes||[]).find(o=>o.id===f.activeVolumeId):f.activeVolume=null}catch{u("Failed to load manga","error"),f.loading=!1}}async function N(s=[]){const[e,t,a]=s;if(!e){P.go("/");return}f.activeVolumeId=t==="volume"?a:null;const n=document.getElementById("app");!f.manga||f.manga.id!==e?(f.loading=!0,f.manga=null,n.innerHTML=dt(),await z(e)):f.activeVolumeId?f.activeVolume=(f.manga.volumes||[]).find(o=>o.id===f.activeVolumeId):f.activeVolume=null,n.innerHTML=dt(),Ta()}function Qa(){f.manga&&V.unsubscribeFromManga(f.manga.id),f.manga=null,f.loading=!0}const Wa={mount:N,unmount:Qa,render:dt};function Ga(){return`
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
  `}function Ka(s){const e=f.manga;if(!e)return;const t=s.querySelector("#add-volume-btn"),a=s.querySelector("#add-volume-modal"),n=s.querySelector("#add-volume-submit-btn");t&&a&&t.addEventListener("click",()=>{a.classList.add("open"),s.querySelector("#add-volume-name-input").focus()}),a==null||a.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(g=>{g.addEventListener("click",()=>a.classList.remove("open"))}),n&&n.addEventListener("click",async()=>{const g=s.querySelector("#add-volume-name-input").value.trim();if(!g)return u("Please enter a volume name","error");try{n.disabled=!0,n.textContent="Creating...",await v.createVolume(e.id,g),u("Volume created successfully!","success"),a.classList.remove("open"),s.querySelector("#add-volume-name-input").value="",await z(e.id),N([e.id])}catch($){u("Failed to create volume: "+$.message,"error")}finally{n.disabled=!1,n.textContent="Create Volume"}});const o=s.querySelector("#manage-chapters-btn");o&&o.addEventListener("click",()=>{f.manageChapters=!f.manageChapters,N([e.id,"volume",f.activeVolumeId])}),s.querySelectorAll(".add-to-vol-btn").forEach(g=>{g.addEventListener("click",async()=>{const $=parseFloat(g.dataset.num),_=f.activeVolume;if(_)try{g.disabled=!0,g.textContent="...";const L=_.chapters||[];if(L.includes($))return;const T=[...L,$].sort((B,b)=>B-b);await v.updateVolumeChapters(e.id,_.id,T),u(`Chapter ${$} added to volume`,"success"),await z(e.id),N([e.id,"volume",_.id])}catch(L){u("Failed to add chapter: "+L.message,"error"),g.disabled=!1,g.textContent="Add"}})}),s.querySelectorAll(".remove-from-vol-btn").forEach(g=>{g.addEventListener("click",async $=>{$.stopPropagation();const _=parseFloat(g.dataset.num),L=f.activeVolume;if(L)try{g.disabled=!0,g.textContent="...";const B=(L.chapters||[]).filter(b=>b!==_);await v.updateVolumeChapters(e.id,L.id,B),u(`Chapter ${_} removed from volume`,"success"),await z(e.id),N([e.id,"volume",L.id])}catch(T){u("Failed to remove chapter: "+T.message,"error"),g.disabled=!1,g.textContent="×"}})});const r=s.querySelector("#edit-vol-btn"),d=s.querySelector("#edit-volume-modal");r&&d&&r.addEventListener("click",()=>{const g=r.dataset.volId,$=e.volumes.find(_=>_.id===g);$&&(s.querySelector("#volume-name-input").value=$.name,d.dataset.editingVolId=g,d.classList.add("open"))});const l=s.querySelector("#save-volume-btn");l&&l.addEventListener("click",async()=>{const g=d.dataset.editingVolId,$=s.querySelector("#volume-name-input").value.trim();if(!$)return u("Volume name cannot be empty","error");try{await v.renameVolume(e.id,g,$),u("Volume renamed","success"),d.classList.remove("open"),await z(e.id),N([e.id,"volume",g])}catch(_){u(_.message,"error")}});const p=s.querySelector("#delete-volume-btn");p&&p.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const g=d.dataset.editingVolId;try{await v.deleteVolume(e.id,g),u("Volume deleted","success"),d.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch($){u($.message,"error")}});const y=s.querySelector("#vol-cover-upload-btn");if(y){let g=document.getElementById("vol-cover-input-hidden");g||(g=document.createElement("input"),g.type="file",g.id="vol-cover-input-hidden",g.accept="image/*",g.style.display="none",document.body.appendChild(g),g.addEventListener("change",async $=>{const _=$.target.files[0];if(!_)return;const L=d.dataset.editingVolId;if(L)try{g.value="",y.disabled=!0,y.textContent="Uploading...",await v.uploadVolumeCover(e.id,L,_),u("Cover uploaded","success"),await z(e.id),N([e.id,"volume",L])}catch(T){u("Upload failed: "+T.message,"error")}finally{y.disabled=!1,y.innerHTML="📤 Upload Image"}})),y.addEventListener("click",()=>g.click())}const C=s.querySelector("#vol-cover-selector-btn"),h=s.querySelector("#cover-selector-modal");C&&h&&C.addEventListener("click",async()=>{const g=h.querySelector("#cover-chapter-select");g.innerHTML='<option value="">Select a chapter...</option>';const $=s.querySelector("#edit-volume-modal"),_=$?$.dataset.editingVolId:null;let L=[...e.chapters||[]];if(_){const B=e.volumes.find(b=>b.id===_);if(B&&B.chapters){const b=new Set(B.chapters);L=L.filter(x=>b.has(x.number))}}L.sort((B,b)=>B.number-b.number);const T=new Set;L.forEach(B=>{if(!T.has(B.number)){T.add(B.number);const b=document.createElement("option");b.value=B.number,b.textContent=`Chapter ${B.number}`,g.appendChild(b)}}),L.length>0&&(g.value=L[0].number,Bt(e.id,L[0].number)),h.classList.add("open")});const k=s.querySelector("#cover-chapter-select");k&&k.addEventListener("change",g=>{g.target.value&&Bt(e.id,g.target.value)}),s.querySelectorAll(".modal-close, .modal-close-btn").forEach(g=>{g.addEventListener("click",()=>{g.closest(".modal").classList.remove("open")})}),s.querySelectorAll(".modal-overlay").forEach(g=>{g.addEventListener("click",()=>{g.closest(".modal").classList.remove("open")})})}async function Bt(s,e){const t=document.getElementById("cover-images-grid");if(t){t.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await v.getChapterImages(s,e)).images||[];if(t.innerHTML="",n.length===0){t.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(o=>{const r=document.createElement("div");r.className="cover-grid-item",r.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",r.innerHTML=`<img src="${o}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,r.addEventListener("click",()=>{const d=document.querySelector('input[name="cover-target"]:checked').value,l=o.split("/").pop();Ya(l,e,d)}),t.appendChild(r)})}catch(a){t.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function Ya(s,e,t){const a=f.manga,n=document.getElementById("edit-volume-modal"),o=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${t} cover?`))try{if(t==="volume"){const r=n.dataset.editingVolId;if(!r)throw new Error("No volume selected");await v.setVolumeCoverFromChapter(a.id,r,e,s),u("Volume cover updated","success"),o.classList.remove("open"),n.classList.remove("open"),await z(a.id),N([a.id,"volume",r])}else{await v.setMangaCoverFromChapter(a.id,e,s),u("Series cover updated","success"),o.classList.remove("open"),await z(a.id);const r=window.location.hash.replace("#","");f.activeVolumeId?N([a.id,"volume",f.activeVolumeId]):N([a.id])}}catch(r){u("Failed to set cover: "+r.message,"error")}}let ee={series:null,loading:!0};function ye(){if(ee.loading)return`
      ${Z("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const s=ee.series;if(!s)return`
      ${Z("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=s.alias||s.title,t=s.entries||[],a=t.reduce((o,r)=>o+(r.chapter_count||0),0);let n=null;if(t.length>0){const o=t[0];o.local_cover&&o.bookmark_id?n=`/api/public/covers/${o.bookmark_id}/${encodeURIComponent(o.local_cover.split(/[/\\]/).pop())}`:o.localCover&&o.bookmark_id?n=`/api/public/covers/${o.bookmark_id}/${encodeURIComponent(o.localCover.split(/[/\\]/).pop())}`:o.cover&&(n=o.cover)}return`
    ${Z("series")}
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
            ${t.map((o,r)=>Ja(o,r,t.length)).join("")}
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
  `}function Ja(s,e,t){var o;const a=s.alias||s.title;let n=null;return s.local_cover?n=`/api/public/covers/${s.bookmark_id}/${encodeURIComponent(s.local_cover.split(/[/\\]/).pop())}`:s.localCover?n=`/api/public/covers/${s.bookmark_id}/${encodeURIComponent(s.localCover.split(/[/\\]/).pop())}`:s.cover&&(n=s.cover),`
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
          ${((o=s.downloadedChapters)==null?void 0:o.length)>0?`<span class="badge badge-downloaded">${s.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${s.bookmark_id}" data-entryid="${s.id}" title="Use as series cover">🖼️</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${a}</div>
      </div>
    </div>
  `}function Qe(){var l,p,y;const s=document.getElementById("app"),e=ee.series;(l=document.getElementById("back-btn"))==null||l.addEventListener("click",()=>P.go("/")),(p=document.getElementById("back-library-btn"))==null||p.addEventListener("click",()=>P.go("/")),s.querySelectorAll(".series-entry-card").forEach(C=>{C.addEventListener("click",h=>{if(h.target.closest("[data-action]"))return;const k=C.dataset.id;P.go(`/manga/${k}`)})}),s.querySelectorAll("[data-action]").forEach(C=>{C.addEventListener("click",async h=>{h.stopPropagation();const k=C.dataset.action,g=C.dataset.id;switch(k){case"move-up":await At(g,-1);break;case"move-down":await At(g,1);break;case"set-cover":const $=C.dataset.entryid;await Xa($);break}})});const t=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),o=document.getElementById("available-bookmarks-list"),r=document.getElementById("confirm-add-entry-btn");let d=[];t&&a&&(t.addEventListener("click",async()=>{try{t.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),o&&(o.innerHTML=""),a.classList.add("open");const C=await v.getAvailableBookmarksForSeries();d=C,C.length===0?(n&&(n.placeholder="No available manga found"),r.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),o&&(o.innerHTML=C.map(h=>`<option value="${(h.alias||h.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),r.disabled=!1)}catch{u("Failed to load available manga","error"),a.classList.remove("open")}finally{t.disabled=!1}}),r.addEventListener("click",async()=>{const C=n?n.value:"",h=d.find(g=>(g.alias||g.title||"")===C);if(!h){u("Please select a valid manga from the list","warning");return}const k=h.id;try{r.disabled=!0,r.textContent="Adding...",await v.addSeriesEntry(e.id,k),u("Manga added to series","success"),a.classList.remove("open"),await We(e.id),s.innerHTML=ye(),Qe()}catch(g){u("Failed to add manga: "+g.message,"error")}finally{r.disabled=!1,r.textContent="Add to Series"}})),(y=document.getElementById("edit-series-btn"))==null||y.addEventListener("click",()=>{u("Edit series coming soon","info")})}async function At(s,e){const t=ee.series;if(!t)return;const a=t.entries||[],n=a.findIndex(d=>d.bookmark_id===s);if(n===-1)return;const o=n+e;if(o<0||o>=a.length)return;const r=a.map(d=>d.bookmark_id);[r[n],r[o]]=[r[o],r[n]];try{await v.post(`/series/${t.id}/reorder`,{order:r}),u("Order updated","success"),await We(t.id);const d=document.getElementById("app");d.innerHTML=ye(),Qe()}catch(d){u("Failed to reorder: "+d.message,"error")}}async function Xa(s){const e=ee.series;if(e)try{await v.setSeriesCover(e.id,s),u("Series cover updated","success"),await We(e.id);const t=document.getElementById("app");t.innerHTML=ye(),Qe()}catch(t){u("Failed to set cover: "+t.message,"error")}}async function We(s){try{const e=await v.get(`/series/${s}`);ee.series=e,ee.loading=!1}catch{u("Failed to load series","error"),ee.loading=!1}}async function Za(s=[]){const[e]=s;if(!e){P.go("/");return}const t=document.getElementById("app");ee.loading=!0,ee.series=null,t.innerHTML=ye(),await We(e),t.innerHTML=ye(),Qe()}function en(){ee.series=null,ee.loading=!0}const tn={mount:Za,unmount:en,render:ye},sn={mount:async s=>{const e=document.getElementById("app");e.innerHTML=`
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
        `;try{const t=await v.get("/settings")||{},a=document.getElementById("settings-form"),n=document.getElementById("settings-loader");t.theme&&(document.getElementById("theme").value=t.theme),n.style.display="none",a.style.display="block",a.addEventListener("submit",async o=>{o.preventDefault();const r=new FormData(a),d={};for(const[l,p]of r.entries())d[l]=p;try{await v.post("/settings/bulk",d),u("Settings saved successfully"),d.theme}catch(l){console.error(l),u("Failed to save settings","error")}})}catch(t){console.error(t),document.getElementById("settings-loader").textContent="Error loading settings"}}},an={mount:async s=>{const e=document.getElementById("app");e.innerHTML=`
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
        `,await nn()}};async function nn(){try{const s=await v.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
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
        `,e.querySelectorAll(".table-link").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;ut(n),e.querySelectorAll(".table-link").forEach(o=>o.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(s){console.error(s),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function ut(s,e=0){var a,n;const t=document.getElementById("admin-main");t.innerHTML=`<div class="loader">Loading ${s}...</div>`;try{const r=await v.get(`/admin/tables/${s}?page=${e}&limit=50`);if(!r.rows||r.rows.length===0){t.innerHTML=`
                <h2>${s}</h2>
                <div class="empty-state">No records found</div>
            `;return}const d=Object.keys(r.rows[0]);t.innerHTML=`
            <div class="table-header">
                <h2>${s}</h2>
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
                                ${d.map(p=>{const y=l[p];let C=y;return y===null?C='<span class="null">NULL</span>':typeof y=="object"?C=JSON.stringify(y):String(y).length>100&&(C=String(y).substring(0,100)+"..."),`<td>${C}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>ut(s,e-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>ut(s,e+1))}catch(o){console.error(o),t.innerHTML=`<div class="error">Failed to load data for ${s}</div>`}}let W={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function on(s,e){let t=null;if(e.length>0){const n=e[0];if(n.imagePaths&&n.imagePaths.length>0){const o=n.imagePaths[0];let r;typeof o=="string"?r=o:o&&typeof o=="object"&&(r=o.filename||o.path||o.name||o.url,r&&r.includes("/")&&(r=r.split("/").pop()),r&&r.includes("\\")&&(r=r.split("\\").pop())),r&&(t=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(r)}`)}}const a=e.reduce((n,o)=>{var r;return n+(((r=o.imagePaths)==null?void 0:r.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${s}">
      <div class="manga-card-cover">
        ${t?`<img src="${t}" alt="${s}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📁</div>'">`:'<div class="placeholder">📁</div>'}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${s}</div>
    </div>
  `}function rn(s){const e=W.bookmarks.find(t=>t.id===s);return e?e.alias||e.title:s}function ln(s){const e=W.bookmarks.find(t=>t.id===s);if(e&&e.seriesId){const t=W.series.find(a=>a.id===e.seriesId);if(t)return{id:t.id,name:t.alias||t.title}}return null}function cn(s,e,t,a=!1){return`
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
  `}function dn(){const s={};console.log("Building trophy groups from:",W.trophyPages);for(const e of Object.keys(W.trophyPages)){const t=W.trophyPages[e];let a=0;for(const[o,r]of Object.entries(t))a+=Object.keys(r).length;if(console.log(`Manga ${e}: ${a} trophies`),a===0)continue;const n=ln(e);if(n)s[n.id]||(s[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),s[n.id].count+=a,s[n.id].mangaIds.push(e);else{const o=rn(e);console.log(`No series for ${e}, using name: ${o}`),s[e]={name:o,isSeries:!1,count:a,mangaIds:[e]}}}return console.log("Trophy groups result:",s),s}function He(){if(W.loading)return`
      ${Z("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:s,listOrder:e}=W.favorites,t=`
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
          ${e.map(o=>{const r=s&&s[o]||[];return on(o,r)}).join("")}
        </div>
      `;else{const n=dn(),o=Object.keys(n);o.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${o.map(d=>{const l=n[d];return cn(d,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${Z("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${t}
      ${a}
    </div>
  `}function ns(){ue();const s=document.getElementById("app");s.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",()=>{W.activeTab=t.dataset.tab,s.innerHTML=He(),ns()})}),s.querySelectorAll(".gallery-card").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.gallery;P.go(`/read/gallery/${encodeURIComponent(a)}`)})}),s.querySelectorAll(".trophy-gallery-card").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trophyId;t.dataset.isSeries==="true"?P.go(`/read/trophies/series-${a}/🏆`):P.go(`/read/trophies/${a}/🏆`)})})}async function un(){try{const[s,e,t,a]=await Promise.all([ne.loadFavorites(),v.get("/trophy-pages"),ne.loadBookmarks(),ne.loadSeries()]);W.favorites=s||{favorites:{},listOrder:[]},W.trophyPages=e||{},W.bookmarks=t||[],W.series=a||[],W.loading=!1}catch(s){console.error("Failed to load favorites:",s),u("Failed to load favorites","error"),W.loading=!1}}async function hn(){console.log("[Favorites] mount called"),W.loading=!0;const s=document.getElementById("app");s.innerHTML=He(),await un(),console.log("[Favorites] Data loaded, rendering..."),s.innerHTML=He(),console.log("[Favorites] Calling setupListeners..."),ns(),console.log("[Favorites] setupListeners complete")}function pn(){}const mn={mount:hn,unmount:pn,render:He};let q={downloads:{},queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,collapsed:{active:!1,scheduled:!1,completed:!1,history:!0}},qe=null,Y={};function wt(s){if(!s)return"Never";const e=Date.now()-new Date(s).getTime(),t=Math.floor(e/6e4);if(t<1)return"Just now";if(t<60)return`${t}m ago`;const a=Math.floor(t/60);return a<24?`${a}h ${t%60}m ago`:`${Math.floor(a/24)}d ago`}function gn(s){if(!s)return"Not scheduled";const e=new Date(s).getTime()-Date.now();if(e<=0)return"Running now...";const t=Math.floor(e/6e4);if(t<60)return`in ${t}m`;const a=Math.floor(t/60),n=t%60;if(a<24)return`in ${a}h ${n}m`;const o=Math.floor(a/24),r=a%24;return`in ${o}d ${r}h`}function is(s){switch(s){case"download":return"📥";case"scrape":return"🔍";case"scan":return"📁";default:return"⚙️"}}function kt(s){switch(s){case"running":return"var(--color-success, #4caf50)";case"queued":case"pending":return"var(--color-warning, #ff9800)";case"paused":return"var(--color-info, #2196f3)";case"complete":return"var(--color-success, #4caf50)";case"error":case"failed":case"cancelled":return"var(--color-error, #f44336)";default:return"var(--text-secondary, #999)"}}function Et(s){switch(s){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return s}}function fn(s){return!s||s==="default"?"Default (6h)":s==="daily"?"Daily":s==="weekly"?"Weekly":s}function vn(){const s=q.autoCheck;return s?`
    <div class="queue-inline-header">
      <span class="text-muted">${s.enabledCount} monitored · Last: ${wt(s.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">▶ Run All Now</button>
    </div>
  `:""}function yn(s){const e=s.nextCheck?gn(s.nextCheck):"Not set",t=s.nextCheck&&new Date(s.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${t?"due":""}" data-manga-id="${s.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📖</span>
          <div>
            <div class="task-title">${s.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${fn(s.schedule)}${s.schedule==="weekly"&&s.day?` · ${s.day.charAt(0).toUpperCase()+s.day.slice(1)}`:""}${(s.schedule==="daily"||s.schedule==="weekly")&&s.time?` · ${s.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${t?"text-success":""}">${t?"⏳ Due now":e}</span>
        </div>
      </div>
    </div>
  `}function Pt(s,e){const t=e.total>0?Math.round(e.completed/e.total*100):0,a=e.status==="running"||e.status==="queued",n=e.status==="paused";return`
    <div class="queue-card task-card" data-task-id="${s}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📥</span>
          <div>
            <div class="task-title">${e.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${kt(e.status)}">${Et(e.status)}</div>
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
  `}function bn(s){const e=s.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${is(s.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||s.type}</div>
            <div class="task-status" style="color: ${kt(s.status)}">${Et(s.status)}</div>
          </div>
        </div>
      </div>
      ${s.started_at?`<div class="queue-card-body"><small>Started: ${wt(s.started_at)}</small></div>`:""}
    </div>
  `}function wn(s){const e=s.data||{},t=s.result||{};let a="";return s.type==="scrape"?t.newChaptersCount!==void 0&&t.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${t.newChaptersCount} new chapters</div>`,t.newChapters&&Array.isArray(t.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${s.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${t.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(t.newChaptersCount===0||t.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>'):(s.type==="scan"||s.type==="scan-local")&&t.count!==void 0&&(a=`<div class="task-subtext">Scanned ${t.count} local chapters</div>`),`
    <div class="queue-card task-card history-card" data-history-id="${s.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${is(s.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||s.type}</div>
            <div class="task-status" style="color: ${kt(s.status)}">${Et(s.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${s.completed_at?`<div class="queue-card-body"><small>Completed: ${wt(s.completed_at)}</small></div>`:""}
    </div>
  `}function kn(){var d;const s=Object.entries(q.downloads),e=s.filter(([,l])=>l.status!=="complete"),t=s.filter(([,l])=>l.status==="complete"),a=new Set(e.map(([,l])=>l.bookmarkId).filter(Boolean)),n=q.queueTasks.filter(l=>{var p;return!(l.type==="download"&&((p=l.data)!=null&&p.mangaId)&&a.has(l.data.mangaId))}),o=e.length+n.length,r=((d=q.autoCheck)==null?void 0:d.schedules)||[];return`
    ${Z("manga")}
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
            ${e.map(([l,p])=>Pt(l,p)).join("")}
            ${n.map(l=>bn(l)).join("")}
          </div>
        </div>
      `:""}

      ${r.length>0?`
        <div class="queue-section ${q.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${r.length})
            </h3>
            ${vn()}
          </div>
          <div class="queue-section-content">
            ${r.map(l=>yn(l)).join("")}
          </div>
        </div>
      `:""}

      ${t.length>0?`
        <div class="queue-section ${q.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${t.map(([l,p])=>Pt(l,p)).join("")}
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
                ${q.historyTasks.map(l=>wn(l)).join("")}
            </div>
        </div>
      `:""}

      ${e.length===0&&n.length===0&&t.length===0&&r.length===0&&(!q.historyTasks||q.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">✨</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function me(){try{const[s,e,t,a]=await Promise.all([v.getDownloads().catch(()=>({})),v.getQueueTasks().catch(()=>[]),v.getQueueHistory(50).catch(()=>[]),v.getAutoCheckStatus().catch(()=>null)]);q.downloads=s||{},q.queueTasks=e||[],q.historyTasks=t||[],q.autoCheck=a,q.loading=!1}catch(s){console.error("[Queue] Failed to load data:",s),q.loading=!1}}function le(){const s=document.getElementById("app");s&&(s.innerHTML=kn(),En())}function En(){ue(),document.querySelectorAll("[data-toggle]").forEach(t=>{t.addEventListener("click",a=>{const n=t.dataset.toggle;q.collapsed[n]=!q.collapsed[n],le()})});const s=document.getElementById("run-autocheck-btn");s&&s.addEventListener("click",async()=>{s.disabled=!0,s.textContent="⏳ Running...";try{u("Auto-check started...","info");const t=await v.runAutoCheck();u(`Check complete: ${t.checked} checked, ${t.updated} updated`,"success"),await me(),le()}catch(t){u("Auto-check failed: "+t.message,"error"),s.disabled=!1,s.textContent="▶ Run Now"}});const e=document.getElementById("clear-history-btn");e&&e.addEventListener("click",async t=>{if(t.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await v.clearQueueHistory(),u("History cleared","success"),await me(),le()}catch(a){u(`Failed to clear history: ${a.message}`,"error")}}),document.querySelectorAll(".scheduled-manga-card").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.mangaId;a&&(window.location.hash=`#/manga/${a}`)})}),document.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",async a=>{a.stopPropagation();const n=t.dataset.action,o=t.dataset.task;try{n==="pause"?(await v.pauseDownload(o),u("Download paused","info")):n==="resume"?(await v.resumeDownload(o),u("Download resumed","info")):n==="cancel"&&confirm("Cancel this download?")&&(await v.cancelDownload(o),u("Download cancelled","info")),await me(),le()}catch(r){u(`Action failed: ${r.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.historyId,n=document.getElementById(`task-details-${a}`);n&&n.classList.toggle("hidden")})})}async function Cn(){q.loading=!0;const s=document.getElementById("app");s.innerHTML=`
    ${Z("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>📋 Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,ue(),await me(),le(),qe=setInterval(async()=>{await me(),le()},5e3),Y.downloadProgress=e=>{e.taskId&&q.downloads[e.taskId]&&(Object.assign(q.downloads[e.taskId],e),le())},Y.downloadCompleted=e=>{me().then(le)},Y.queueUpdated=e=>{me().then(le)},V.on(Q.DOWNLOAD_PROGRESS,Y.downloadProgress),V.on(Q.DOWNLOAD_COMPLETED,Y.downloadCompleted),V.on(Q.QUEUE_UPDATED,Y.queueUpdated)}function $n(){qe&&(clearInterval(qe),qe=null),Y.downloadProgress&&V.off(Q.DOWNLOAD_PROGRESS,Y.downloadProgress),Y.downloadCompleted&&V.off(Q.DOWNLOAD_COMPLETED,Y.downloadCompleted),Y.queueUpdated&&V.off(Q.QUEUE_UPDATED,Y.queueUpdated),Y={}}const xn={mount:Cn,unmount:$n};class Sn{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,t){this.routes.set(e,t)}async navigate(){console.log("[Router] navigate called");const e=window.location.hash.slice(1)||"/",[t,...a]=e.split("/").filter(Boolean),n=`/${t||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let o=this.routes.get(n);!o&&this.routes.has("/")&&(o=this.routes.get("/")),o&&(this.currentRoute=n,this.currentView=o,o.mount&&(console.log("[Router] calling mount on view module"),await o.mount(a)),ue())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),ue())}}const P=new Sn;P.register("/",fa);P.register("/manga",Wa);P.register("/read",$a);P.register("/series",tn);P.register("/settings",sn);P.register("/admin",an);P.register("/favorites",mn);P.register("/queue",xn);class Ln{constructor(){this.currentView=null,this.mangaCache=new Map}async init(){if(console.log("[App] Initializing..."),!v.isAuthenticated()){window.location.href="/login.html";return}V.connect(),this.setupSocketListeners(),P.init(),this.hideLoading(),console.log("[App] Ready")}setupSocketListeners(){V.on(Q.CHAPTER_DOWNLOADED,e=>{console.log("[Socket] Chapter downloaded:",e),this.onChapterUpdate(e)}),V.on(Q.CHAPTER_HIDDEN,e=>{console.log("[Socket] Chapter hidden:",e),this.onChapterUpdate(e)}),V.on(Q.CHAPTER_UNHIDDEN,e=>{console.log("[Socket] Chapter unhidden:",e),this.onChapterUpdate(e)}),V.on(Q.MANGA_UPDATED,e=>{console.log("[Socket] Manga updated:",e),this.onMangaUpdate(e)}),V.on(Q.DOWNLOAD_PROGRESS,e=>{this.onDownloadProgress(e)}),V.on(Q.DOWNLOAD_COMPLETED,e=>{console.log("[Socket] Download completed:",e),this.showToast(`Downloaded: ${e.chapterNumber}`,"success")}),V.on(Q.QUEUE_UPDATED,e=>{this.onQueueUpdate(e)}),V.on(Q.ACTION_RECORDED,e=>{console.log("[Socket] Action recorded:",e),this.updateUndoButton()}),V.on(Q.ACTION_UNDONE,e=>{console.log("[Socket] Action undone:",e),this.showToast("Action undone","info"),this.updateUndoButton()})}onChapterUpdate(e){window.dispatchEvent(new CustomEvent("chapter:update",{detail:e}))}onMangaUpdate(e){this.mangaCache.delete(e.mangaId),window.dispatchEvent(new CustomEvent("manga:update",{detail:e}))}onDownloadProgress(e){window.dispatchEvent(new CustomEvent("download:progress",{detail:e}))}onQueueUpdate(e){window.dispatchEvent(new CustomEvent("queue:update",{detail:e}))}async updateUndoButton(){try{const{undoableCount:e}=await v.getActions({limit:1}),t=document.getElementById("undo-btn");if(t){t.style.display=e>0?"flex":"none";const a=t.querySelector(".count");a&&(a.textContent=e)}}catch{}}showToast(e,t="info"){const a=document.createElement("div");a.className=`toast toast-${t}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}hideLoading(){const e=document.querySelector(".loading-screen");e&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),300))}}const _n=new Ln;document.addEventListener("DOMContentLoaded",()=>_n.init());
