import{a as f}from"./api-DWtk1J1Q.js";const _e=Object.create(null);_e.open="0";_e.close="1";_e.ping="2";_e.pong="3";_e.message="4";_e.upgrade="5";_e.noop="6";const Mt=Object.create(null);Object.keys(_e).forEach(e=>{Mt[_e[e]]=e});const ds={type:"error",data:"parser error"},va=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",ya=typeof ArrayBuffer=="function",ba=e=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(e):e&&e.buffer instanceof ArrayBuffer,_s=({type:e,data:t},s,a)=>va&&t instanceof Blob?s?a(t):Ks(t,a):ya&&(t instanceof ArrayBuffer||ba(t))?s?a(t):Ks(new Blob([t]),a):a(_e[e]+(t||"")),Ks=(e,t)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];t("b"+(a||""))},s.readAsDataURL(e)};function Ys(e){return e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}let rs;function gn(e,t){if(va&&e.data instanceof Blob)return e.data.arrayBuffer().then(Ys).then(t);if(ya&&(e.data instanceof ArrayBuffer||ba(e.data)))return t(Ys(e.data));_s(e,!1,s=>{rs||(rs=new TextEncoder),t(rs.encode(s))})}const Js="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",pt=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let e=0;e<Js.length;e++)pt[Js.charCodeAt(e)]=e;const fn=e=>{let t=e.length*.75,s=e.length,a,n=0,r,i,c,l;e[e.length-1]==="="&&(t--,e[e.length-2]==="="&&t--);const d=new ArrayBuffer(t),p=new Uint8Array(d);for(a=0;a<s;a+=4)r=pt[e.charCodeAt(a)],i=pt[e.charCodeAt(a+1)],c=pt[e.charCodeAt(a+2)],l=pt[e.charCodeAt(a+3)],p[n++]=r<<2|i>>4,p[n++]=(i&15)<<4|c>>2,p[n++]=(c&3)<<6|l&63;return d},vn=typeof ArrayBuffer=="function",Ps=(e,t)=>{if(typeof e!="string")return{type:"message",data:wa(e,t)};const s=e.charAt(0);return s==="b"?{type:"message",data:yn(e.substring(1),t)}:Mt[s]?e.length>1?{type:Mt[s],data:e.substring(1)}:{type:Mt[s]}:ds},yn=(e,t)=>{if(vn){const s=fn(e);return wa(s,t)}else return{base64:!0,data:e}},wa=(e,t)=>{switch(t){case"blob":return e instanceof Blob?e:new Blob([e]);case"arraybuffer":default:return e instanceof ArrayBuffer?e:e.buffer}},$a="",bn=(e,t)=>{const s=e.length,a=new Array(s);let n=0;e.forEach((r,i)=>{_s(r,!1,c=>{a[i]=c,++n===s&&t(a.join($a))})})},wn=(e,t)=>{const s=e.split($a),a=[];for(let n=0;n<s.length;n++){const r=Ps(s[n],t);if(a.push(r),r.type==="error")break}return a};function $n(){return new TransformStream({transform(e,t){gn(e,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const r=new DataView(n.buffer);r.setUint8(0,126),r.setUint16(1,a)}else{n=new Uint8Array(9);const r=new DataView(n.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(a))}e.data&&typeof e.data!="string"&&(n[0]|=128),t.enqueue(n),t.enqueue(s)})}})}let os;function Ct(e){return e.reduce((t,s)=>t+s.length,0)}function xt(e,t){if(e[0].length===t)return e.shift();const s=new Uint8Array(t);let a=0;for(let n=0;n<t;n++)s[n]=e[0][a++],a===e[0].length&&(e.shift(),a=0);return e.length&&a<e[0].length&&(e[0]=e[0].slice(a)),s}function kn(e,t){os||(os=new TextDecoder);const s=[];let a=0,n=-1,r=!1;return new TransformStream({transform(i,c){for(s.push(i);;){if(a===0){if(Ct(s)<1)break;const l=xt(s,1);r=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(Ct(s)<2)break;const l=xt(s,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(Ct(s)<8)break;const l=xt(s,8),d=new DataView(l.buffer,l.byteOffset,l.length),p=d.getUint32(0);if(p>Math.pow(2,21)-1){c.enqueue(ds);break}n=p*Math.pow(2,32)+d.getUint32(4),a=3}else{if(Ct(s)<n)break;const l=xt(s,n);c.enqueue(Ps(r?l:os.decode(l),t)),a=0}if(n===0||n>e){c.enqueue(ds);break}}}})}const ka=4;function ce(e){if(e)return En(e)}function En(e){for(var t in ce.prototype)e[t]=ce.prototype[t];return e}ce.prototype.on=ce.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+e]=this._callbacks["$"+e]||[]).push(t),this};ce.prototype.once=function(e,t){function s(){this.off(e,s),t.apply(this,arguments)}return s.fn=t,this.on(e,s),this};ce.prototype.off=ce.prototype.removeListener=ce.prototype.removeAllListeners=ce.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+e];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+e],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===t||a.fn===t){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+e],this};ce.prototype.emit=function(e){this._callbacks=this._callbacks||{};for(var t=new Array(arguments.length-1),s=this._callbacks["$"+e],a=1;a<arguments.length;a++)t[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,t)}return this};ce.prototype.emitReserved=ce.prototype.emit;ce.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks["$"+e]||[]};ce.prototype.hasListeners=function(e){return!!this.listeners(e).length};const Wt=typeof Promise=="function"&&typeof Promise.resolve=="function"?t=>Promise.resolve().then(t):(t,s)=>s(t,0),Ee=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Sn="arraybuffer";function Ea(e,...t){return t.reduce((s,a)=>(e.hasOwnProperty(a)&&(s[a]=e[a]),s),{})}const Cn=Ee.setTimeout,xn=Ee.clearTimeout;function Kt(e,t){t.useNativeTimers?(e.setTimeoutFn=Cn.bind(Ee),e.clearTimeoutFn=xn.bind(Ee)):(e.setTimeoutFn=Ee.setTimeout.bind(Ee),e.clearTimeoutFn=Ee.clearTimeout.bind(Ee))}const Ln=1.33;function In(e){return typeof e=="string"?Mn(e):Math.ceil((e.byteLength||e.size)*Ln)}function Mn(e){let t=0,s=0;for(let a=0,n=e.length;a<n;a++)t=e.charCodeAt(a),t<128?s+=1:t<2048?s+=2:t<55296||t>=57344?s+=3:(a++,s+=4);return s}function Sa(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Tn(e){let t="";for(let s in e)e.hasOwnProperty(s)&&(t.length&&(t+="&"),t+=encodeURIComponent(s)+"="+encodeURIComponent(e[s]));return t}function Bn(e){let t={},s=e.split("&");for(let a=0,n=s.length;a<n;a++){let r=s[a].split("=");t[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return t}class An extends Error{constructor(t,s,a){super(t),this.description=s,this.context=a,this.type="TransportError"}}class qs extends ce{constructor(t){super(),this.writable=!1,Kt(this,t),this.opts=t,this.query=t.query,this.socket=t.socket,this.supportsBinary=!t.forceBase64}onError(t,s,a){return super.emitReserved("error",new An(t,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(t){this.readyState==="open"&&this.write(t)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(t){const s=Ps(t,this.socket.binaryType);this.onPacket(s)}onPacket(t){super.emitReserved("packet",t)}onClose(t){this.readyState="closed",super.emitReserved("close",t)}pause(t){}createUri(t,s={}){return t+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const t=this.opts.hostname;return t.indexOf(":")===-1?t:"["+t+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(t){const s=Tn(t);return s.length?"?"+s:""}}class _n extends qs{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(t){this.readyState="pausing";const s=()=>{this.readyState="paused",t()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(t){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};wn(t,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const t=()=>{this.write([{type:"close"}])};this.readyState==="open"?t():this.once("open",t)}write(t){this.writable=!1,bn(t,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const t=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=Sa()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(t,s)}}let Ca=!1;try{Ca=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Pn=Ca;function qn(){}class Rn extends _n{constructor(t){if(super(t),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&t.hostname!==location.hostname||a!==t.port}}doWrite(t,s){const a=this.request({method:"POST",data:t});a.on("success",s),a.on("error",(n,r)=>{this.onError("xhr post error",n,r)})}doPoll(){const t=this.request();t.on("data",this.onData.bind(this)),t.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=t}}class Ae extends ce{constructor(t,s,a){super(),this.createRequest=t,Kt(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var t;const s=Ea(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(t=this._opts.cookieJar)===null||t===void 0||t.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=Ae.requestsCount++,Ae.requests[this._index]=this)}_onError(t){this.emitReserved("error",t,this._xhr),this._cleanup(!0)}_cleanup(t){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=qn,t)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ae.requests[this._index],this._xhr=null}}_onLoad(){const t=this._xhr.responseText;t!==null&&(this.emitReserved("data",t),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Ae.requestsCount=0;Ae.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Xs);else if(typeof addEventListener=="function"){const e="onpagehide"in Ee?"pagehide":"unload";addEventListener(e,Xs,!1)}}function Xs(){for(let e in Ae.requests)Ae.requests.hasOwnProperty(e)&&Ae.requests[e].abort()}const Dn=function(){const e=xa({xdomain:!1});return e&&e.responseType!==null}();class Nn extends Rn{constructor(t){super(t);const s=t&&t.forceBase64;this.supportsBinary=Dn&&!s}request(t={}){return Object.assign(t,{xd:this.xd},this.opts),new Ae(xa,this.uri(),t)}}function xa(e){const t=e.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!t||Pn))return new XMLHttpRequest}catch{}if(!t)try{return new Ee[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const La=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Fn extends qs{get name(){return"websocket"}doOpen(){const t=this.uri(),s=this.opts.protocols,a=La?{}:Ea(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(t,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=t=>this.onClose({description:"websocket connection closed",context:t}),this.ws.onmessage=t=>this.onData(t.data),this.ws.onerror=t=>this.onError("websocket error",t)}write(t){this.writable=!1;for(let s=0;s<t.length;s++){const a=t[s],n=s===t.length-1;_s(a,this.supportsBinary,r=>{try{this.doWrite(a,r)}catch{}n&&Wt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const t=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=Sa()),this.supportsBinary||(s.b64=1),this.createUri(t,s)}}const is=Ee.WebSocket||Ee.MozWebSocket;class On extends Fn{createSocket(t,s,a){return La?new is(t,s,a):s?new is(t,s):new is(t)}doWrite(t,s){this.ws.send(s)}}class Un extends qs{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(t){return this.emitReserved("error",t)}this._transport.closed.then(()=>{this.onClose()}).catch(t=>{this.onError("webtransport error",t)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(t=>{const s=kn(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=t.readable.pipeThrough(s).getReader(),n=$n();n.readable.pipeTo(t.writable),this._writer=n.writable.getWriter();const r=()=>{a.read().then(({done:c,value:l})=>{c||(this.onPacket(l),r())}).catch(c=>{})};r();const i={type:"open"};this.query.sid&&(i.data=`{"sid":"${this.query.sid}"}`),this._writer.write(i).then(()=>this.onOpen())})})}write(t){this.writable=!1;for(let s=0;s<t.length;s++){const a=t[s],n=s===t.length-1;this._writer.write(a).then(()=>{n&&Wt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var t;(t=this._transport)===null||t===void 0||t.close()}}const Hn={websocket:On,webtransport:Un,polling:Nn},Vn=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,jn=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function us(e){if(e.length>8e3)throw"URI too long";const t=e,s=e.indexOf("["),a=e.indexOf("]");s!=-1&&a!=-1&&(e=e.substring(0,s)+e.substring(s,a).replace(/:/g,";")+e.substring(a,e.length));let n=Vn.exec(e||""),r={},i=14;for(;i--;)r[jn[i]]=n[i]||"";return s!=-1&&a!=-1&&(r.source=t,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=zn(r,r.path),r.queryKey=Qn(r,r.query),r}function zn(e,t){const s=/\/{2,9}/g,a=t.replace(s,"/").split("/");return(t.slice(0,1)=="/"||t.length===0)&&a.splice(0,1),t.slice(-1)=="/"&&a.splice(a.length-1,1),a}function Qn(e,t){const s={};return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,r){n&&(s[n]=r)}),s}const ps=typeof addEventListener=="function"&&typeof removeEventListener=="function",Tt=[];ps&&addEventListener("offline",()=>{Tt.forEach(e=>e())},!1);class He extends ce{constructor(t,s){if(super(),this.binaryType=Sn,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,t&&typeof t=="object"&&(s=t,t=null),t){const a=us(t);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=us(s.host).host);Kt(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Bn(this.opts.query)),ps&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Tt.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(t){const s=Object.assign({},this.opts.query);s.EIO=ka,s.transport=t,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[t]);return new this._transportsByName[t](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const t=this.opts.rememberUpgrade&&He.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(t);s.open(),this.setTransport(s)}setTransport(t){this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",He.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",t),this.emitReserved("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=t.data,this._onError(s);break;case"message":this.emitReserved("data",t.data),this.emitReserved("message",t.data);break}}onHandshake(t){this.emitReserved("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this._pingInterval=t.pingInterval,this._pingTimeout=t.pingTimeout,this._maxPayload=t.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const t=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+t,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},t),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const t=this._getWritablePackets();this.transport.send(t),this._prevBufferLen=t.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=In(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const t=Date.now()>this._pingTimeoutTime;return t&&(this._pingTimeoutTime=0,Wt(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),t}write(t,s,a){return this._sendPacket("message",t,s,a),this}send(t,s,a){return this._sendPacket("message",t,s,a),this}_sendPacket(t,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const r={type:t,data:s,options:a};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),n&&this.once("flush",n),this.flush()}close(){const t=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),t()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():t()}):this.upgrading?a():t()),this}_onError(t){if(He.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",t),this._onClose("transport error",t)}_onClose(t,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ps&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=Tt.indexOf(this._offlineEventListener);a!==-1&&Tt.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",t,s),this.writeBuffer=[],this._prevBufferLen=0}}}He.protocol=ka;class Gn extends He{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let t=0;t<this._upgrades.length;t++)this._probe(this._upgrades[t])}_probe(t){let s=this.createTransport(t),a=!1;He.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",u=>{if(!a)if(u.type==="pong"&&u.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;He.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(p(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const g=new Error("probe error");g.transport=s.name,this.emitReserved("upgradeError",g)}}))};function r(){a||(a=!0,p(),s.close(),s=null)}const i=u=>{const g=new Error("probe error: "+u);g.transport=s.name,r(),this.emitReserved("upgradeError",g)};function c(){i("transport closed")}function l(){i("socket closed")}function d(u){s&&u.name!==s.name&&r()}const p=()=>{s.removeListener("open",n),s.removeListener("error",i),s.removeListener("close",c),this.off("close",l),this.off("upgrading",d)};s.once("open",n),s.once("error",i),s.once("close",c),this.once("close",l),this.once("upgrading",d),this._upgrades.indexOf("webtransport")!==-1&&t!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(t){this._upgrades=this._filterUpgrades(t.upgrades),super.onHandshake(t)}_filterUpgrades(t){const s=[];for(let a=0;a<t.length;a++)~this.transports.indexOf(t[a])&&s.push(t[a]);return s}}let Wn=class extends Gn{constructor(t,s={}){const a=typeof t=="object"?t:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>Hn[n]).filter(n=>!!n)),super(t,a)}};function Kn(e,t="",s){let a=e;s=s||typeof location<"u"&&location,e==null&&(e=s.protocol+"//"+s.host),typeof e=="string"&&(e.charAt(0)==="/"&&(e.charAt(1)==="/"?e=s.protocol+e:e=s.host+e),/^(https?|wss?):\/\//.test(e)||(typeof s<"u"?e=s.protocol+"//"+e:e="https://"+e),a=us(e)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const r=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+r+":"+a.port+t,a.href=a.protocol+"://"+r+(s&&s.port===a.port?"":":"+a.port),a}const Yn=typeof ArrayBuffer=="function",Jn=e=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(e):e.buffer instanceof ArrayBuffer,Ia=Object.prototype.toString,Xn=typeof Blob=="function"||typeof Blob<"u"&&Ia.call(Blob)==="[object BlobConstructor]",Zn=typeof File=="function"||typeof File<"u"&&Ia.call(File)==="[object FileConstructor]";function Rs(e){return Yn&&(e instanceof ArrayBuffer||Jn(e))||Xn&&e instanceof Blob||Zn&&e instanceof File}function Bt(e,t){if(!e||typeof e!="object")return!1;if(Array.isArray(e)){for(let s=0,a=e.length;s<a;s++)if(Bt(e[s]))return!0;return!1}if(Rs(e))return!0;if(e.toJSON&&typeof e.toJSON=="function"&&arguments.length===1)return Bt(e.toJSON(),!0);for(const s in e)if(Object.prototype.hasOwnProperty.call(e,s)&&Bt(e[s]))return!0;return!1}function er(e){const t=[],s=e.data,a=e;return a.data=hs(s,t),a.attachments=t.length,{packet:a,buffers:t}}function hs(e,t){if(!e)return e;if(Rs(e)){const s={_placeholder:!0,num:t.length};return t.push(e),s}else if(Array.isArray(e)){const s=new Array(e.length);for(let a=0;a<e.length;a++)s[a]=hs(e[a],t);return s}else if(typeof e=="object"&&!(e instanceof Date)){const s={};for(const a in e)Object.prototype.hasOwnProperty.call(e,a)&&(s[a]=hs(e[a],t));return s}return e}function tr(e,t){return e.data=ms(e.data,t),delete e.attachments,e}function ms(e,t){if(!e)return e;if(e&&e._placeholder===!0){if(typeof e.num=="number"&&e.num>=0&&e.num<t.length)return t[e.num];throw new Error("illegal attachments")}else if(Array.isArray(e))for(let s=0;s<e.length;s++)e[s]=ms(e[s],t);else if(typeof e=="object")for(const s in e)Object.prototype.hasOwnProperty.call(e,s)&&(e[s]=ms(e[s],t));return e}const sr=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var K;(function(e){e[e.CONNECT=0]="CONNECT",e[e.DISCONNECT=1]="DISCONNECT",e[e.EVENT=2]="EVENT",e[e.ACK=3]="ACK",e[e.CONNECT_ERROR=4]="CONNECT_ERROR",e[e.BINARY_EVENT=5]="BINARY_EVENT",e[e.BINARY_ACK=6]="BINARY_ACK"})(K||(K={}));class ar{constructor(t){this.replacer=t}encode(t){return(t.type===K.EVENT||t.type===K.ACK)&&Bt(t)?this.encodeAsBinary({type:t.type===K.EVENT?K.BINARY_EVENT:K.BINARY_ACK,nsp:t.nsp,data:t.data,id:t.id}):[this.encodeAsString(t)]}encodeAsString(t){let s=""+t.type;return(t.type===K.BINARY_EVENT||t.type===K.BINARY_ACK)&&(s+=t.attachments+"-"),t.nsp&&t.nsp!=="/"&&(s+=t.nsp+","),t.id!=null&&(s+=t.id),t.data!=null&&(s+=JSON.stringify(t.data,this.replacer)),s}encodeAsBinary(t){const s=er(t),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class Ds extends ce{constructor(t){super(),this.reviver=t}add(t){let s;if(typeof t=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(t);const a=s.type===K.BINARY_EVENT;a||s.type===K.BINARY_ACK?(s.type=a?K.EVENT:K.ACK,this.reconstructor=new nr(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(Rs(t)||t.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(t),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+t)}decodeString(t){let s=0;const a={type:Number(t.charAt(0))};if(K[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===K.BINARY_EVENT||a.type===K.BINARY_ACK){const r=s+1;for(;t.charAt(++s)!=="-"&&s!=t.length;);const i=t.substring(r,s);if(i!=Number(i)||t.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(i)}if(t.charAt(s+1)==="/"){const r=s+1;for(;++s&&!(t.charAt(s)===","||s===t.length););a.nsp=t.substring(r,s)}else a.nsp="/";const n=t.charAt(s+1);if(n!==""&&Number(n)==n){const r=s+1;for(;++s;){const i=t.charAt(s);if(i==null||Number(i)!=i){--s;break}if(s===t.length)break}a.id=Number(t.substring(r,s+1))}if(t.charAt(++s)){const r=this.tryParse(t.substr(s));if(Ds.isPayloadValid(a.type,r))a.data=r;else throw new Error("invalid payload")}return a}tryParse(t){try{return JSON.parse(t,this.reviver)}catch{return!1}}static isPayloadValid(t,s){switch(t){case K.CONNECT:return Zs(s);case K.DISCONNECT:return s===void 0;case K.CONNECT_ERROR:return typeof s=="string"||Zs(s);case K.EVENT:case K.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&sr.indexOf(s[0])===-1);case K.ACK:case K.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class nr{constructor(t){this.packet=t,this.buffers=[],this.reconPack=t}takeBinaryData(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){const s=tr(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function Zs(e){return Object.prototype.toString.call(e)==="[object Object]"}const rr=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Ds,Encoder:ar,get PacketType(){return K}},Symbol.toStringTag,{value:"Module"}));function xe(e,t,s){return e.on(t,s),function(){e.off(t,s)}}const or=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Ma extends ce{constructor(t,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=t,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const t=this.io;this.subs=[xe(t,"open",this.onopen.bind(this)),xe(t,"packet",this.onpacket.bind(this)),xe(t,"error",this.onerror.bind(this)),xe(t,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...t){return t.unshift("message"),this.emit.apply(this,t),this}emit(t,...s){var a,n,r;if(or.hasOwnProperty(t))throw new Error('"'+t.toString()+'" is a reserved event name');if(s.unshift(t),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const i={type:K.EVENT,data:s};if(i.options={},i.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const p=this.ids++,u=s.pop();this._registerAckCallback(p,u),i.id=p}const c=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(i),this.packet(i)):this.sendBuffer.push(i)),this.flags={},this}_registerAckCallback(t,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[t]=s;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[t];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===t&&this.sendBuffer.splice(c,1);s.call(this,new Error("operation has timed out"))},n),i=(...c)=>{this.io.clearTimeoutFn(r),s.apply(this,c)};i.withError=!0,this.acks[t]=i}emitWithAck(t,...s){return new Promise((a,n)=>{const r=(i,c)=>i?n(i):a(c);r.withError=!0,s.push(r),this.emit(t,...s)})}_addToQueue(t){let s;typeof t[t.length-1]=="function"&&(s=t.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:t,flags:Object.assign({fromQueue:!0},this.flags)};t.push((n,...r)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...r)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(t=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!t||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(t){t.nsp=this.nsp,this.io._packet(t)}onopen(){typeof this.auth=="function"?this.auth(t=>{this._sendConnectPacket(t)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(t){this.packet({type:K.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},t):t})}onerror(t){this.connected||this.emitReserved("connect_error",t)}onclose(t,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",t,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(t=>{if(!this.sendBuffer.some(a=>String(a.id)===t)){const a=this.acks[t];delete this.acks[t],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(t){if(t.nsp===this.nsp)switch(t.type){case K.CONNECT:t.data&&t.data.sid?this.onconnect(t.data.sid,t.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case K.EVENT:case K.BINARY_EVENT:this.onevent(t);break;case K.ACK:case K.BINARY_ACK:this.onack(t);break;case K.DISCONNECT:this.ondisconnect();break;case K.CONNECT_ERROR:this.destroy();const a=new Error(t.data.message);a.data=t.data.data,this.emitReserved("connect_error",a);break}}onevent(t){const s=t.data||[];t.id!=null&&s.push(this.ack(t.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(t){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,t)}super.emit.apply(this,t),this._pid&&t.length&&typeof t[t.length-1]=="string"&&(this._lastOffset=t[t.length-1])}ack(t){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:K.ACK,id:t,data:n}))}}onack(t){const s=this.acks[t.id];typeof s=="function"&&(delete this.acks[t.id],s.withError&&t.data.unshift(null),s.apply(this,t.data))}onconnect(t,s){this.id=t,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(t=>this.emitEvent(t)),this.receiveBuffer=[],this.sendBuffer.forEach(t=>{this.notifyOutgoingListeners(t),this.packet(t)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(t=>t()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:K.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(t){return this.flags.compress=t,this}get volatile(){return this.flags.volatile=!0,this}timeout(t){return this.flags.timeout=t,this}onAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(t),this}prependAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(t),this}offAny(t){if(!this._anyListeners)return this;if(t){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(t===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(t),this}prependAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(t),this}offAnyOutgoing(t){if(!this._anyOutgoingListeners)return this;if(t){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(t===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(t){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,t.data)}}}function ot(e){e=e||{},this.ms=e.min||100,this.max=e.max||1e4,this.factor=e.factor||2,this.jitter=e.jitter>0&&e.jitter<=1?e.jitter:0,this.attempts=0}ot.prototype.duration=function(){var e=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var t=Math.random(),s=Math.floor(t*this.jitter*e);e=Math.floor(t*10)&1?e+s:e-s}return Math.min(e,this.max)|0};ot.prototype.reset=function(){this.attempts=0};ot.prototype.setMin=function(e){this.ms=e};ot.prototype.setMax=function(e){this.max=e};ot.prototype.setJitter=function(e){this.jitter=e};class gs extends ce{constructor(t,s){var a;super(),this.nsps={},this.subs=[],t&&typeof t=="object"&&(s=t,t=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,Kt(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new ot({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=t;const n=s.parser||rr;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(t){return arguments.length?(this._reconnection=!!t,t||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(t){return t===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=t,this)}reconnectionDelay(t){var s;return t===void 0?this._reconnectionDelay:(this._reconnectionDelay=t,(s=this.backoff)===null||s===void 0||s.setMin(t),this)}randomizationFactor(t){var s;return t===void 0?this._randomizationFactor:(this._randomizationFactor=t,(s=this.backoff)===null||s===void 0||s.setJitter(t),this)}reconnectionDelayMax(t){var s;return t===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=t,(s=this.backoff)===null||s===void 0||s.setMax(t),this)}timeout(t){return arguments.length?(this._timeout=t,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(t){if(~this._readyState.indexOf("open"))return this;this.engine=new Wn(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=xe(s,"open",function(){a.onopen(),t&&t()}),r=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),t?t(c):this.maybeReconnectOnOpen()},i=xe(s,"error",r);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{n(),r(new Error("timeout")),s.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(i),this}connect(t){return this.open(t)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const t=this.engine;this.subs.push(xe(t,"ping",this.onping.bind(this)),xe(t,"data",this.ondata.bind(this)),xe(t,"error",this.onerror.bind(this)),xe(t,"close",this.onclose.bind(this)),xe(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(t){try{this.decoder.add(t)}catch(s){this.onclose("parse error",s)}}ondecoded(t){Wt(()=>{this.emitReserved("packet",t)},this.setTimeoutFn)}onerror(t){this.emitReserved("error",t)}socket(t,s){let a=this.nsps[t];return a?this._autoConnect&&!a.active&&a.connect():(a=new Ma(this,t,s),this.nsps[t]=a),a}_destroy(t){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(t){const s=this.encoder.encode(t);for(let a=0;a<s.length;a++)this.engine.write(s[a],t.options)}cleanup(){this.subs.forEach(t=>t()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(t,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",t,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{t.skipReconnect||(this.emitReserved("reconnect_attempt",t.backoff.attempts),!t.skipReconnect&&t.open(n=>{n?(t._reconnecting=!1,t.reconnect(),this.emitReserved("reconnect_error",n)):t.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const t=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",t)}}const ct={};function bt(e,t){typeof e=="object"&&(t=e,e=void 0),t=t||{};const s=Kn(e,t.path||"/socket.io"),a=s.source,n=s.id,r=s.path,i=ct[n]&&r in ct[n].nsps,c=t.forceNew||t["force new connection"]||t.multiplex===!1||i;let l;return c?l=new gs(a,t):(ct[n]||(ct[n]=new gs(a,t)),l=ct[n]),s.query&&!t.query&&(t.query=s.queryKey),l.socket(s.path,t)}Object.assign(bt,{Manager:gs,Socket:Ma,io:bt,connect:bt});class ir{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var t;(t=this.socket)!=null&&t.connected||(this.socket=bt({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(t){var s;this.subscribedMangas.add(t),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",t)}unsubscribeFromManga(t){var s;this.subscribedMangas.delete(t),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",t)}on(t,s){this.listeners.has(t)||this.listeners.set(t,new Set),this.listeners.get(t).add(s),this.socket&&this.socket.on(t,s)}off(t,s){this.listeners.has(t)&&this.listeners.get(t).delete(s),this.socket&&this.socket.off(t,s)}emit(t,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(t,s)}}const oe={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone",SITE_CHALLENGE:"site:challenge",SITE_CHALLENGE_CLEARED:"site:challenge-cleared",SITE_SESSION:"site:session",TORRENT_UPDATE:"torrent:update",IMPORT_PROGRESS:"import:progress"},se=new ir,ve={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},Le=new Set,le=new Map,ht=new Map;function lr(e){return ve[e]}function cr(e,t){ve[e]=t,Le.add(e),Et(e)}function dr(e,t){return ht.has(e)||ht.set(e,new Set),ht.get(e).add(t),()=>{var s;return(s=ht.get(e))==null?void 0:s.delete(t)}}function Et(e){const t=ht.get(e);t&&t.forEach(s=>s(ve[e]))}function mt(e){Le.delete(e),le.delete(e)}function ur(e){return Le.has(e)}async function gt(e=!1){if(!e&&Le.has("bookmarks"))return ve.bookmarks;if(le.has("bookmarks"))return le.get("bookmarks");const t=f.getBookmarks().then(s=>(ve.bookmarks=s||[],Le.add("bookmarks"),le.delete("bookmarks"),Et("bookmarks"),ve.bookmarks)).catch(s=>{throw le.delete("bookmarks"),s});return le.set("bookmarks",t),t}async function pr(e=!1){if(!e&&Le.has("series"))return ve.series;if(le.has("series"))return le.get("series");const t=f.get("/series").then(s=>(ve.series=s||[],Le.add("series"),le.delete("series"),Et("series"),ve.series)).catch(s=>{throw le.delete("series"),s});return le.set("series",t),t}async function hr(e=!1){if(!e&&Le.has("categories"))return ve.categories;if(le.has("categories"))return le.get("categories");const t=f.get("/categories").then(s=>(ve.categories=s.categories||[],Le.add("categories"),le.delete("categories"),Et("categories"),ve.categories)).catch(s=>{throw le.delete("categories"),s});return le.set("categories",t),t}async function mr(e=!1){if(!e&&Le.has("favorites"))return ve.favorites;if(le.has("favorites"))return le.get("favorites");const t=f.getFavorites().then(s=>(ve.favorites=s||{favorites:{},listOrder:[]},Le.add("favorites"),le.delete("favorites"),Et("favorites"),ve.favorites)).catch(s=>{throw le.delete("favorites"),s});return le.set("favorites",t),t}function gr(){se.on(oe.MANGA_UPDATED,()=>{mt("bookmarks"),gt(!0)}),se.on(oe.MANGA_ADDED,()=>{mt("bookmarks"),gt(!0)}),se.on(oe.MANGA_DELETED,()=>{mt("bookmarks"),gt(!0)}),se.on(oe.DOWNLOAD_COMPLETED,()=>{mt("bookmarks"),gt(!0)})}gr();const be={get:lr,set:cr,subscribe:dr,invalidate:mt,isLoaded:ur,loadBookmarks:gt,loadSeries:pr,loadCategories:hr,loadFavorites:mr};function h(e,t="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${t}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}const fr={library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',"book-open":'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',"book-marked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',"layout-grid":'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',"circle-plus":'<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',check:'<path d="M20 6 9 17l-5-5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',"trash-2":'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',"undo-2":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',scissors:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',play:'<polygon points="6 3 20 12 6 21 6 3"/>',pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',"hard-drive":'<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',package:'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"eye-off":'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',circle:'<circle cx="12" cy="12" r="10"/>',lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',"lock-open":'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',"triangle-alert":'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',"shield-alert":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',"circle-help":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',"traffic-cone":'<path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"/><path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"/><path d="M13.9 3.5a1.93 1.93 0 0 0-3.8 0L6.1 19.5a1.93 1.93 0 0 0 1.9 2.5h8a1.93 1.93 0 0 0 1.9-2.5z"/><path d="M2 21h20"/>',sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',"alarm-clock":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',loader:'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',"search-x":'<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',"list-checks":'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',"log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',sliders:'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',"chevron-up":'<path d="m18 15-6-6-6 6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"chevron-left":'<path d="m15 18-6-6 6-6"/>',"chevron-right":'<path d="m9 18 6-6-6-6"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',images:'<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>',"columns-2":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',"rectangle-vertical":'<rect width="12" height="20" x="6" y="2" rx="2"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',"arrow-left-right":'<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',"refresh-cw":'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>',"rotate-cw":'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"message-circle":'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'};function m(e,t={}){const s=fr[e];if(!s)return console.warn("[icons] unknown icon:",e),"";const{size:a,cls:n="",title:r,spin:i=!1}=t,c=["icon",i?"icon-spin":"",n].filter(Boolean).join(" "),l=a?` width="${a}" height="${a}"`:"",d=r?` role="img" aria-label="${String(r).replace(/"/g,"&quot;")}"`:' aria-hidden="true"';return`<svg class="${c}"${l} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${d}>${s}</svg>`}function we(e="book"){return`<div class="placeholder" data-icon="${e}"></div>`}function Re(e,t,s={}){const{kind:a="book",self:n=!1,attrs:r=""}=s,i=String(t??"").replace(/"/g,"&quot;"),c=`<div class=&quot;placeholder&quot; data-icon=&quot;${a}&quot;></div>`,l=n?"this.outerHTML":"this.parentElement.innerHTML";return`<img src="${e}" alt="${i}" loading="lazy"${r?" "+r:""} onerror="${l}='${c}'">`}const ea=`${m("folder")} Scan Folder`,ta=`${m("loader",{spin:!0})} Scanning...`;async function vr(e,t,s){try{e&&(e.disabled=!0,e.innerHTML=ta),t&&(t.innerHTML=ta),h("Scanning downloads folder...","info");const n=(await f.scanLibrary()).found||[];if(n.length===0){h("Scan complete: No new manga found","info"),s&&s();return}yr(n,s)}catch(a){h("Scan failed: "+a.message,"error")}finally{e&&(e.disabled=!1,e.innerHTML=ea),t&&(t.innerHTML=ea)}}async function yr(e,t){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),r=Array.from(n).map(l=>l.dataset.folder);if(r.length===0){h("No folders selected","warning");return}const i=document.getElementById("import-all-btn");i.disabled=!0,i.textContent="Importing...";let c=0;for(const l of r)try{await f.importLocalManga(l),c++}catch(d){console.error("Failed to import",l,d)}s.remove(),h(`Imported ${c} manga`,"success"),t&&t()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function br(e={}){const{size:t,stroke:s="currentColor",accent:a="var(--accent-primary, #E03A2F)",strokeWidth:n=2,cls:r=""}=e,i=t?` width="${t}" height="${t}"`:"";return`<svg class="${`logo-mark ${r}`.trim()}"${i} viewBox="0 0 24 24" fill="none" stroke="${s}" stroke-width="${n}" stroke-linejoin="round" aria-hidden="true"><polygon points="3,3 10.5,3 8.5,21 3,21"/><polygon points="13,3 21,3 21,10.5 12.17,10.5" fill="${a}" stroke="${a}"/><polygon points="11.89,13 21,13 21,21 11,21"/></svg>`}function sa(){return`${br()}<span class="logo-text">Manga<span>Reader</span></span>`}const X={user:null,get isAdmin(){var e;return((e=this.user)==null?void 0:e.role)==="admin"},get isDemo(){var e;return((e=this.user)==null?void 0:e.role)==="demo"},get canDownload(){var e;return this.isAdmin||!this.isDemo&&!!((e=this.user)!=null&&e.canDownload)},get canEdit(){var e;return this.isAdmin||!this.isDemo&&!!((e=this.user)!=null&&e.canEdit)}};function vl(e){X.user=e||null}function fe(e="manga"){if(X.isDemo)return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${sa()}</a>
        <div class="header-actions">
          <div class="view-toggle">
            <button class="view-toggle-btn ${e==="manga"?"active":""}" data-view="manga" title="Manga view">${m("library",{title:"Manga view"})}</button>
            <button class="view-toggle-btn ${e==="series"?"active":""}" data-view="series" title="Series view">${m("book-open",{title:"Series view"})}</button>
          </div>
          <span class="demo-badge">Demo</span>
          <a href="/login.html" class="btn btn-secondary" id="demo-exit-btn" title="Exit the demo">${m("log-out",{title:"Exit the demo"})} Exit</a>
        </div>
      </div>
    </header>
  `;const t=X.isAdmin?`<a href="#/admin" class="btn btn-secondary" title="Admin">${m("wrench",{title:"Admin"})}</a>`:"",s=X.isAdmin?`<a href="#/admin" class="mobile-menu-item">${m("wrench")} Admin</a>`:"",a=X.canDownload?`<button class="btn btn-secondary" id="scan-btn">${m("folder")} Scan Folder</button>`:"",n=X.canDownload?`<button class="mobile-menu-item" id="mobile-scan-btn">${m("folder")} Scan Folder</button>`:"",r=X.canEdit?e==="series"?`<button class="btn btn-primary" id="add-series-btn">${m("plus")} Add Series</button>`:`<button class="btn btn-primary" id="add-manga-btn">${m("plus")} Add Manga</button>`:"",i=X.canEdit?e==="series"?`<button class="mobile-menu-item primary" id="mobile-add-series-btn">${m("plus")} Add Series</button>`:`<button class="mobile-menu-item primary" id="mobile-add-btn">${m("plus")} Add Manga</button>`:"";return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${sa()}</a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${e==="manga"?"active":""}" data-view="manga" title="Manga view">${m("library",{title:"Manga view"})}</button>
            <button class="view-toggle-btn ${e==="series"?"active":""}" data-view="series" title="Series view">${m("book-open",{title:"Series view"})}</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">${m("star")} Favorites</button>
          <a href="#/queue" class="btn btn-secondary" id="queue-nav-btn" title="Task Queue">${m("list-checks")} Queue</a>
          ${a}
          ${r}
          <button class="btn btn-secondary" id="logout-btn" title="Log out">${m("log-out",{title:"Log out"})}</button>
          <a href="#/scrapers" class="btn btn-secondary" title="Search Scrapers">${m("search",{title:"Search Scrapers"})}</a>
          ${t}
          <a href="#/settings" class="btn btn-secondary" title="Settings">${m("settings",{title:"Settings"})}</a>
        </div>
        <button class="hamburger-btn mobile-only" id="hamburger-btn">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu hidden" id="mobile-menu">
        <div class="mobile-view-toggle">
          <button class="view-toggle-btn ${e==="manga"?"active":""}" data-view="manga">${m("library")} Manga</button>
          <button class="view-toggle-btn ${e==="series"?"active":""}" data-view="series">${m("book-open")} Series</button>
        </div>
        <button class="mobile-menu-item" id="mobile-favorites-btn">${m("star")} Favorites</button>
        <a href="#/queue" class="mobile-menu-item">${m("list-checks")} Task Queue</a>
        ${n}
        ${i}
        <button class="mobile-menu-item" id="mobile-logout-btn">${m("log-out")} Logout</button>
        <a href="#/scrapers" class="mobile-menu-item">${m("search")} Scrapers</a>
        ${s}
        <a href="#/settings" class="mobile-menu-item">${m("settings")} Settings</a>
      </div>
    </header>
  `}function De(){const e=document.querySelector("header");if(e&&e.dataset.listenersBound)return;e&&(e.dataset.listenersBound="true");const t=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");t&&s&&t.addEventListener("click",()=>{s.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),r=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",r),n&&n.addEventListener("click",r);const i=document.getElementById("demo-exit-btn");i&&i.addEventListener("click",w=>{w.preventDefault(),localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"}),document.querySelectorAll("[data-view]").forEach(w=>{w.addEventListener("click",()=>{const x=w.dataset.view;localStorage.setItem("library_view_mode",x),document.querySelectorAll("[data-view]").forEach(T=>{T.classList.toggle("active",T.dataset.view===x)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:x}}))})});const c=document.querySelector(".logo");c&&c.addEventListener("click",w=>{localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),be.loadBookmarks(!0).catch(()=>{}),window.dispatchEvent(new CustomEvent("clearFilters"))});const l=document.getElementById("favorites-btn"),d=document.getElementById("mobile-favorites-btn"),p=w=>{w.preventDefault(),H.go("/favorites")};l&&l.addEventListener("click",p),d&&d.addEventListener("click",p);const u=document.getElementById("queue-nav-btn");u&&u.addEventListener("click",w=>{w.preventDefault(),H.go("/queue")});const g=document.getElementById("add-manga-btn"),$=document.getElementById("mobile-add-btn"),v=()=>{document.getElementById("add-modal")||(sessionStorage.setItem("open_add_modal","1"),H.go("/"))};g&&g.addEventListener("click",v),$&&$.addEventListener("click",v);const y=document.getElementById("scan-btn"),L=document.getElementById("mobile-scan-btn");if(y||L){const w=()=>{vr(y,L,async()=>{await be.loadBookmarks(!0),H.reload()})};y&&y.addEventListener("click",w),L&&L.addEventListener("click",w)}}const Dt={series:"any",downloads:"any",reading:"any",source:"any",monitor:"any"};function wr(){try{const e=JSON.parse(localStorage.getItem("library_filters")||"{}");return{...Dt,...e&&typeof e=="object"?e:{}}}catch{return{...Dt}}}let B={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",searchAuthor:localStorage.getItem("library_search_author")||null,searchAuthorSource:localStorage.getItem("library_search_author_source")||null,sortBy:localStorage.getItem("library_sort")||"updated",filters:wr(),viewMode:"manga",loading:!0},Nt=[],je=null;function $r(){localStorage.setItem("library_filters",JSON.stringify(B.filters))}function kr(e){var i,c,l;const t=new Set(e.excludedChapters||[]),s=new Set((e.chapters||[]).filter(d=>!t.has(d.number)).map(d=>d.number)).size||e.uniqueChapters||0,a=e.downloadedCount??((i=e.downloadedChapters)==null?void 0:i.length)??0,n=e.readCount??((c=e.readChapters)==null?void 0:c.length)??0,r=(e.updatedCount??((l=e.updatedChapters)==null?void 0:l.length)??0)>0;return{total:s,downloaded:a,read:n,updates:r}}const Er=[{key:"series",label:"Series",options:[{value:"none",label:"Not in a series",test:e=>!e.series},{value:"in",label:"In a series",test:e=>!!e.series}]},{key:"downloads",label:"Downloads",options:[{value:"none",label:"Nothing downloaded",test:(e,t)=>t.downloaded===0},{value:"partial",label:"Partly downloaded",test:(e,t)=>t.downloaded>0&&t.downloaded<t.total},{value:"complete",label:"Fully downloaded",test:(e,t)=>t.total>0&&t.downloaded>=t.total}]},{key:"reading",label:"Reading",options:[{value:"unread",label:"Not started",test:(e,t)=>t.read===0},{value:"progress",label:"In progress",test:(e,t)=>t.read>0&&t.read<t.total},{value:"finished",label:"Finished",test:(e,t)=>t.total>0&&t.read>=t.total},{value:"updates",label:"New chapters",test:(e,t)=>t.updates}]},{key:"source",label:"Source",options:[]},{key:"monitor",label:"Auto-check",options:[{value:"on",label:"On",test:e=>!!e.autoCheck},{value:"off",label:"Off",test:e=>!e.autoCheck}]}];function Sr(){const t=[...new Set(B.bookmarks.filter(s=>s.source!=="local"&&s.website).map(s=>s.website))].sort().map(s=>({value:`site:${s}`,label:s,test:a=>a.source!=="local"&&a.website===s}));return B.bookmarks.some(s=>s.source==="local")&&t.unshift({value:"local",label:"Local files",test:s=>s.source==="local"}),t}function Ta(){return Er.map(e=>e.key==="source"?{...e,options:Sr()}:e)}function Ba(){return Object.values(B.filters).filter(e=>e&&e!=="any").length}function Cr(e){const s=Ta().map(a=>({g:a,option:a.options.find(n=>n.value===B.filters[a.key])})).filter(a=>a.option);return s.length===0?e:e.filter(a=>{const n=kr(a);return s.every(({option:r})=>r.test(a,n))})}function Ft(e){return String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}function xr(e){return[...e].sort((t,s)=>{var a,n;switch(B.sortBy){case"az":return(t.alias||t.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(t.alias||t.title);case"lastread":return(s.lastReadAt||"").localeCompare(t.lastReadAt||"");case"chapters":{const r=((a=t.chapters)==null?void 0:a.length)||t.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-r}case"updated":default:return(s.updatedAt||"").localeCompare(t.updatedAt||"")}})}function Yt(){let e=B.bookmarks;const t=(Array.isArray(B.categories)?B.categories:[]).filter(s=>typeof s=="object"?s.isNsfw:!1).map(s=>s.name);if(B.activeCategory==="__nsfw__"?e=e.filter(s=>(s.categories||[]).some(a=>t.includes(a))):B.activeCategory?e=e.filter(s=>(s.categories||[]).includes(B.activeCategory)):t.length>0&&(e=e.filter(s=>!(s.categories||[]).some(a=>t.includes(a)))),B.artistFilter&&(e=e.filter(s=>(s.artists||[]).includes(B.artistFilter))),B.searchQuery){const s=B.searchQuery.toLowerCase();e=e.filter(a=>(a.title||"").toLowerCase().includes(s)||(a.alias||"").toLowerCase().includes(s)||(a.artists||[]).some(n=>n.toLowerCase().includes(s)))}return e=Cr(e),xr(e)}function Lr(e){const t=Ba(),s=Ta().filter(a=>a.options.length>0);return`
    <div class="library-filter" id="library-filter">
      <button type="button" class="library-filter-btn ${t?"has-filter":""}" id="library-filter-btn" aria-haspopup="true" aria-expanded="false">
        ${m("sliders")} Filter${t?` · ${t}`:""}
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
              ${a.options.map(n=>`<button type="button" class="filter-chip ${B.filters[a.key]===n.value?"active":""}" data-group="${a.key}" data-value="${Ft(n.value)}">${Ft(n.label)}</button>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    <span class="library-count" id="library-count" title="Shown / in library">${e} / ${B.bookmarks.length}</span>
  `}function aa(){const e=document.getElementById("library-grid");if(!e)return;const t=Yt();e.innerHTML=t.map(Jt).join("")||Xt();const s=document.getElementById("library-count");s&&(s.textContent=`${t.length} / ${B.bookmarks.length}`);const a=Ba(),n=document.getElementById("library-filter-btn");n&&(n.classList.toggle("has-filter",a>0),n.innerHTML=`${m("sliders")} Filter${a?` · ${a}`:""}`);const r=document.getElementById("library-filter-reset");r&&(r.hidden=a===0),document.querySelectorAll("#library-filter-menu .filter-chip").forEach(i=>{const c=B.filters[i.dataset.group]||"any";i.classList.toggle("active",i.dataset.value===c)})}function Jt(e){var p,u,g;const t=e.alias||e.title,s=e.downloadedCount??((p=e.downloadedChapters)==null?void 0:p.length)??0,a=new Set(e.excludedChapters||[]),n=(e.chapters||[]).filter($=>!a.has($.number)),r=new Set(n.map($=>$.number)).size||e.uniqueChapters||0,i=e.readCount??((u=e.readChapters)==null?void 0:u.length)??0,c=(e.updatedCount??((g=e.updatedChapters)==null?void 0:g.length)??0)>0,l=e.localCover?`/api/public/covers/${e.id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover,d=e.source==="local";return`
    <div class="manga-card" data-id="${e.id}">
      <div class="manga-card-cover">
        ${l?Re(l,t,{kind:d?"local":"book"}):we(d?"local":"book")}
        <div class="manga-card-badges">
          ${i>0?`<span class="badge badge-read" title="Read">${i}</span>`:""}
          <span class="badge badge-chapters" title="Total">${r}</span>
          ${s>0?`<span class="badge badge-downloaded" title="Downloaded">${s}</span>`:""}
          ${c?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${e.autoCheck?`<span class="badge badge-monitored" title="Auto-check enabled">${m("alarm-clock",{title:"Auto-check enabled"})}</span>`:""}
          ${B.activeCategory==="Favorites"?`<span class="badge badge-play" title="Click to Read">${m("play",{title:"Click to Read"})}</span>`:""}
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function Xt(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function Ir(e){var n;const t=e.alias||e.title,s=((n=e.entries)==null?void 0:n.length)||e.entry_count||0;let a=null;return e.localCover&&e.coverBookmarkId?a=`/api/public/covers/${e.coverBookmarkId}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover&&(a=e.cover),`
    <div class="manga-card series-card" data-series-id="${e.id}">
      <div class="manga-card-cover">
        ${a?Re(a,t,{kind:"series"}):we("series")}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${s} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function Ot(){const e=localStorage.getItem("library_view_mode");if(e&&e!==B.viewMode&&(B.viewMode=e),B.activeCategory==="Favorites")return H.go("/favorites"),"";let t="";if(B.viewMode==="series"){const s=B.series.map(Ir).join("");t=`
      <div class="library-grid" id="library-grid">
        ${B.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const s=Yt(),n=B.searchAuthor&&B.searchQuery===B.searchAuthor?`
      <div class="manga-card search-sources-card" id="search-sources-card" title="Search online sources for ${Ft(B.searchAuthor)}"
           style="display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed var(--border-color, #3a3a4a);background:transparent;min-height:220px;text-align:center;">
        <div style="padding:1rem;color:var(--text-muted, #9aa);">
          <div style="font-size:2.5rem;line-height:1;margin-bottom:.5rem;">＋</div>
          <div style="font-size:.85rem;">Search sources for<br><strong style="color:var(--text-color, #fff);">${Ft(B.searchAuthor)}</strong></div>
        </div>
      </div>`:"",r=s.map(Jt).join("")+n;t=`
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">${m("search")}</span>
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
        ${Lr(s.length)}
      </div>
      ${B.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">${m("palette")}</span>
          <span class="artist-filter-name">${B.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${B.loading?'<div class="loading-spinner"></div>':r||Xt()}
      </div>
    `}return`
    ${fe(B.viewMode)}
    <div class="container">
      ${t}
    </div>
    ${Mr()}
    ${Br()}
    ${Ar()}
  `}function Mr(){const{activeCategory:e}=B,s=(Array.isArray(B.categories)?B.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=s.some(n=>n.isNsfw);return`
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${e?"has-filter":""}" id="category-fab-btn">
        ${e==="__nsfw__"?m("shield-alert",{title:"18+"}):e||m("tag",{title:"Filter by category"})}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn" title="Manage categories">${m("settings",{title:"Manage categories"})}</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${e?"":"active"}" data-category="">All</button>
          ${a?`<button class="category-menu-item ${e==="__nsfw__"?"active":""}" data-category="__nsfw__" style="color: var(--error);">${m("shield-alert")} All 18+</button>`:""}
          ${s.map(n=>`
            <button class="category-menu-item ${e===n.name?"active":""}" data-category="${n.name}">
              ${n.name}${n.isNsfw?' <span style="color:var(--error);font-size:0.75em;">18+</span>':""}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    ${Tr()}
      `}function Tr(){const t=(Array.isArray(B.categories)?B.categories:[]).map(s=>typeof s=="object"?s:{name:s,isNsfw:!1});return`
    <div class="modal" id="manage-categories-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 450px;">
        <div class="modal-header">
          <h2>${m("settings")} Manage Categories</h2>
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
                  <button class="btn-icon small danger delete-category-btn" data-category="${s.name}" title="Delete">${m("trash-2",{title:"Delete"})}</button>
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
  `}function Br(){return`
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
      `}function Ar(){return`
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
      `}function fs(){B.activeCategory=null,B.artistFilter=null,B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,B.filters={...Dt},localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),localStorage.removeItem("library_filters"),ke()}function _r(){const e=document.getElementById("library-filter-btn"),t=document.getElementById("library-filter-menu");!e||!t||(e.addEventListener("click",s=>{s.stopPropagation();const a=t.classList.toggle("hidden")===!1;e.setAttribute("aria-expanded",String(a))}),t.addEventListener("click",s=>{s.stopPropagation();const a=s.target.closest(".filter-chip");if(a){B.filters[a.dataset.group]=a.dataset.value,$r(),aa();return}s.target.closest("#library-filter-reset")&&(B.filters={...Dt},localStorage.removeItem("library_filters"),aa())}),je&&document.removeEventListener("click",je),je=s=>{!t.classList.contains("hidden")&&!s.target.closest("#library-filter")&&(t.classList.add("hidden"),e.setAttribute("aria-expanded","false"))},document.addEventListener("click",je))}async function vs(e){const t=e.target.closest(".manga-card");if(t){if(t.classList.contains("gallery-card")){const n=t.dataset.gallery;H.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=t.dataset.id,a=t.dataset.seriesId;if(a){H.go(`/series/${a}`);return}if(s){if(B.activeCategory==="Favorites"){const n=B.bookmarks.find(r=>r.id===s);if(n){let r=n.last_read_chapter;if(!r&&n.chapters&&n.chapters.length>0&&(r=[...n.chapters].sort((c,l)=>c.number-l.number)[0].number),r){H.go(`/read/${s}/${r}`);return}else h("No chapters available to read","warning")}}H.go(`/manga/${s}`)}}}function Aa(){var O,V,ee,G,Z;const e=document.getElementById("app");e.removeEventListener("click",vs),e.addEventListener("click",vs),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",U=>{B.viewMode=U.detail.mode;const C=document.getElementById("app");C.innerHTML=Ot(),Aa(),De()}));const t=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");t&&s&&(t.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",U=>{const C=U.target.closest(".category-menu-item");if(C){const A=C.dataset.category||null;Pr(A),s.classList.add("hidden")}})),(O=document.getElementById("manage-categories-btn"))==null||O.addEventListener("click",U=>{U.stopPropagation();const C=document.getElementById("manage-categories-modal");C&&C.classList.add("open")}),(V=document.getElementById("close-manage-categories-btn"))==null||V.addEventListener("click",()=>{var U;(U=document.getElementById("manage-categories-modal"))==null||U.classList.remove("open")}),(ee=document.querySelector("#manage-categories-modal .modal-overlay"))==null||ee.addEventListener("click",()=>{var U;(U=document.getElementById("manage-categories-modal"))==null||U.classList.remove("open")}),(G=document.querySelector("#manage-categories-modal .modal-close"))==null||G.addEventListener("click",()=>{var U;(U=document.getElementById("manage-categories-modal"))==null||U.classList.remove("open")}),(Z=document.getElementById("add-category-btn"))==null||Z.addEventListener("click",async()=>{var A;const U=document.getElementById("new-category-input"),C=(A=U==null?void 0:U.value)==null?void 0:A.trim();if(C)try{await f.post("/categories",{name:C}),U.value="",h("Category added","success"),await Ze(!0),ke()}catch(R){h("Failed: "+R.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(U=>{U.addEventListener("change",async C=>{const A=U.dataset.category;try{await f.put(`/categories/${encodeURIComponent(A)}/nsfw`,{isNsfw:U.checked}),h(`${A} ${U.checked?"marked as 18+":"unmarked"}`,"success"),await Ze(!0),ke()}catch(R){h("Failed: "+R.message,"error"),U.checked=!U.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(U=>{U.addEventListener("click",async()=>{const C=U.dataset.category;if(confirm(`Delete category "${C}"?`))try{await f.delete(`/categories/${encodeURIComponent(C)}`),h("Category deleted","success"),B.activeCategory===C&&(B.activeCategory=null,localStorage.removeItem("library_active_category")),await Ze(!0),ke()}catch(A){h("Failed: "+A.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{B.artistFilter=null,localStorage.removeItem("library_artist_filter"),ke()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",U=>{var A;B.searchQuery=U.target.value,localStorage.setItem("library_search",U.target.value),B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source");const C=document.getElementById("library-grid");if(C){const R=Yt();C.innerHTML=R.map(Jt).join("")||Xt();const D=document.getElementById("search-clear");!D&&B.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(A=document.getElementById("search-clear"))==null||A.addEventListener("click",()=>{B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),n.value="",ke()})):D&&!B.searchQuery&&D.remove()}}),B.searchQuery&&n.focus());const r=document.getElementById("search-clear");r&&r.addEventListener("click",()=>{B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),ke()});const i=document.getElementById("search-sources-card");i&&i.addEventListener("click",()=>{const U=B.searchAuthor||B.searchQuery,C=B.searchAuthorSource||"nhentai.net";U&&(window.location.hash=`#/scrapers?browse=${encodeURIComponent(C)}&q=${encodeURIComponent(U)}`)});const c=document.getElementById("library-sort");c&&c.addEventListener("change",U=>{B.sortBy=U.target.value,localStorage.setItem("library_sort",B.sortBy),ke()}),_r(),window.removeEventListener("clearFilters",fs),window.addEventListener("clearFilters",fs);const l=document.getElementById("add-manga-btn"),d=document.getElementById("mobile-add-btn"),p=document.getElementById("add-modal"),u=document.getElementById("add-modal-close"),g=document.getElementById("add-modal-cancel"),$=document.getElementById("add-modal-submit"),v=document.getElementById("mobile-menu"),y=()=>{v&&v.classList.add("hidden"),p&&p.classList.add("open")};l&&l.addEventListener("click",y),d&&d.addEventListener("click",y),u&&u.addEventListener("click",()=>p.classList.remove("open")),g&&g.addEventListener("click",()=>p.classList.remove("open")),$&&$.addEventListener("click",async()=>{const U=document.getElementById("manga-url"),C=U.value.trim();if(!C){h("Please enter a URL","error");return}try{$.disabled=!0,$.textContent="Adding...",await f.addBookmark(C),h("Manga added successfully!","success"),p.classList.remove("open"),U.value="",await Ze(),ke()}catch(A){h("Failed to add manga: "+A.message,"error")}finally{$.disabled=!1,$.textContent="Add"}});const L=document.getElementById("add-series-btn"),w=document.getElementById("mobile-add-series-btn"),x=document.getElementById("add-series-modal"),T=document.getElementById("add-series-modal-close"),k=document.getElementById("add-series-modal-cancel"),I=document.getElementById("add-series-modal-submit"),N=document.getElementById("mobile-menu");if((L||w)&&x){const U=()=>{N&&N.classList.add("hidden"),x.classList.add("open")};L&&L.addEventListener("click",U),w&&w.addEventListener("click",U)}T&&T.addEventListener("click",()=>x.classList.remove("open")),k&&k.addEventListener("click",()=>x.classList.remove("open")),I&&I.addEventListener("click",async()=>{const U=document.getElementById("series-title"),C=document.getElementById("series-alias"),A=U.value.trim(),R=C.value.trim();if(!A){h("Please enter a title","error");return}try{I.disabled=!0,I.textContent="Creating...",await f.createSeries(A,R),h("Series created successfully!","success"),x.classList.remove("open"),U.value="",C.value="",await Ze(!0),ke()}catch(D){h("Failed to create series: "+D.message,"error")}finally{I.disabled=!1,I.textContent="Create"}});const E=x==null?void 0:x.querySelector(".modal-overlay");E&&E.addEventListener("click",()=>x.classList.remove("open"));const b=document.getElementById("empty-add-btn");b&&p&&b.addEventListener("click",()=>p.classList.add("open"));const M=document.getElementById("empty-add-series-btn");M&&x&&M.addEventListener("click",()=>x.classList.add("open"));const _=p==null?void 0:p.querySelector(".modal-overlay");_&&_.addEventListener("click",()=>p.classList.remove("open")),De()}function Pr(e){B.activeCategory=e,e?localStorage.setItem("library_active_category",e):localStorage.removeItem("library_active_category"),ke()}async function Ze(e=!1){try{if(X.isDemo){const[r,i]=await Promise.all([be.loadBookmarks(e),be.loadSeries(e)]);B.bookmarks=r,B.categories=[],B.series=i,B.favorites={favorites:{},listOrder:[]},B.loading=!1;return}const[t,s,a,n]=await Promise.all([be.loadBookmarks(e),be.loadCategories(e),be.loadSeries(e),be.loadFavorites(e)]);B.bookmarks=t,B.categories=s,B.series=a,B.favorites=n,B.loading=!1}catch{h("Failed to load library","error"),B.loading=!1}}async function ke(){var t;const e=document.getElementById("app");if(X.isDemo)B.activeCategory=null,B.artistFilter=null,B.searchQuery="",B.searchAuthor=null,B.searchAuthorSource=null;else{const s=localStorage.getItem("library_active_category");B.activeCategory!==s&&(B.activeCategory=s);const a=localStorage.getItem("library_artist_filter")||null;B.artistFilter!==a&&(B.artistFilter=a);const n=localStorage.getItem("library_search")||"";B.searchQuery!==n&&(B.searchQuery=n),B.searchAuthor=localStorage.getItem("library_search_author")||null,B.searchAuthorSource=localStorage.getItem("library_search_author_source")||null}B.loading&&(e.innerHTML=Ot()),B.bookmarks.length===0&&B.loading&&await Ze(),e.innerHTML=Ot(),Aa(),sessionStorage.getItem("open_add_modal")&&(sessionStorage.removeItem("open_add_modal"),(t=document.getElementById("add-modal"))==null||t.classList.add("open")),Nt.forEach(s=>s()),Nt=[be.subscribe("bookmarks",s=>{B.bookmarks=s;const a=document.getElementById("library-grid");if(a){const n=Yt();a.innerHTML=n.map(Jt).join("")||Xt()}})]}function qr(){const e=document.getElementById("app");e&&e.removeEventListener("click",vs),window.removeEventListener("clearFilters",fs),je&&(document.removeEventListener("click",je),je=null),Nt.forEach(t=>t()),Nt=[]}const Rr={mount:ke,unmount:qr,render:Ot},Dr="manga-offline",Nr=1,We="images",pe="chapters";let Lt=null;function St(){return new Promise((e,t)=>{if(Lt)return e(Lt);const s=indexedDB.open(Dr,Nr);s.onupgradeneeded=a=>{const n=a.target.result;n.objectStoreNames.contains(We)||n.createObjectStore(We),n.objectStoreNames.contains(pe)||n.createObjectStore(pe)},s.onsuccess=()=>{Lt=s.result,e(Lt)},s.onerror=()=>t(s.error)})}function Ke(e,t){return St().then(s=>new Promise((a,n)=>{const c=s.transaction(e,"readonly").objectStore(e).get(t);c.onsuccess=()=>a(c.result),c.onerror=()=>n(c.error)}))}function ys(e,t,s){return St().then(a=>new Promise((n,r)=>{const l=a.transaction(e,"readwrite").objectStore(e).put(s,t);l.onsuccess=()=>n(),l.onerror=()=>r(l.error)}))}function bs(e,t){return St().then(s=>new Promise((a,n)=>{const c=s.transaction(e,"readwrite").objectStore(e).delete(t);c.onsuccess=()=>a(),c.onerror=()=>n(c.error)}))}function Ns(e){return St().then(t=>new Promise((s,a)=>{const i=t.transaction(e,"readonly").objectStore(e).getAllKeys();i.onsuccess=()=>s(i.result),i.onerror=()=>a(i.error)}))}function nt(e,t){return`${e}:${t}`}function Fs(e,t,s){return`${e}:${t}:${s}`}function Fr(e){const t=e.split(":");return{mangaId:t[0],chapterNum:parseFloat(t[1])}}async function Os(e,t,s=null){const a=await f.get(`/bookmarks/${e}/chapters/${t}/reader-images`);if(!a||!a.images||a.images.length===0)throw new Error("No images found for this chapter");const n=a.images,r=n.length;let i=0;const c=f.getToken();for(let d=0;d<n.length;d++){const p=typeof n[d]=="string"?n[d]:n[d].url,u=p.startsWith("http")?p:`${window.location.origin}${p}`;try{const g=await fetch(u,{headers:c?{Authorization:`Bearer ${c}`}:{}});if(!g.ok)throw new Error(`HTTP ${g.status}`);const $=await g.blob();await ys(We,Fs(e,t,p),$),i++,s&&s(i,r)}catch(g){console.error(`[Offline] Failed to cache image ${d+1}/${r}:`,g)}}const l={mangaId:e,chapterNum:t,imageUrls:n.map(d=>typeof d=="string"?d:d.url),savedAt:Date.now(),imageCount:i};return await ys(pe,nt(e,t),l),{success:!0,imageCount:i}}async function Or(e,t){const s=await Ke(pe,nt(e,t));if(!s)return null;const a=[];for(const n of s.imageUrls){const r=await Ke(We,Fs(e,t,n));if(r)a.push(URL.createObjectURL(r));else return a.forEach(i=>URL.revokeObjectURL(i)),null}return a}async function _a(e,t){const s=await Ke(pe,nt(e,t));if(s&&s.imageUrls)for(const a of s.imageUrls)await bs(We,Fs(e,t,a));await bs(pe,nt(e,t))}async function Ur(e,t){if(!await Ke(pe,nt(e,t)))return!1;await _a(e,t);try{return await Os(e,t),!0}catch(a){return console.warn("[Offline] Could not re-save chapter after edit:",a),!1}}async function Hr(e,t){return!!await Ke(pe,nt(e,t))}async function Vr(){const e=await Ns(pe),t=[];for(const s of e){if(s.startsWith("auto-offline-"))continue;const a=await Ke(pe,s);a&&t.push(a)}return t}async function Pa(e){const t=await Ns(pe),s=[];for(const a of t)if(!a.startsWith("auto-offline-")&&a.startsWith(`${e}:`)){const{chapterNum:n}=Fr(a);s.push(n)}return s}async function jr(){if(navigator.storage&&navigator.storage.estimate){const e=await navigator.storage.estimate();return{used:e.usage||0,quota:e.quota||0,usedMB:((e.usage||0)/(1024*1024)).toFixed(1),quotaMB:((e.quota||0)/(1024*1024)).toFixed(0)}}return{used:0,quota:0,usedMB:"0",quotaMB:"Unknown"}}async function zr(){const e=await St();await new Promise((t,s)=>{const r=e.transaction(We,"readwrite").objectStore(We).clear();r.onsuccess=t,r.onerror=s}),await new Promise((t,s)=>{const r=e.transaction(pe,"readwrite").objectStore(pe).clear();r.onsuccess=t,r.onerror=s})}async function Qr(e,t){t?await ys(pe,`auto-offline-${e}`,{enabled:!0,mangaId:e}):await bs(pe,`auto-offline-${e}`)}async function Gr(e){const t=await Ke(pe,`auto-offline-${e}`);return!!(t!=null&&t.enabled)}async function Wr(){return(await Ns(pe)).filter(t=>t.startsWith("auto-offline-")).map(t=>t.replace("auto-offline-",""))}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",async e=>{var t;if(((t=e.data)==null?void 0:t.type)==="sync-offline"){const s=e.data.mangaId;console.log(`[Offline] Auto-sync triggered for manga ${s}`);try{await qa(s)}catch(a){console.error("[Offline] Auto-sync failed:",a)}}});async function qa(e){try{const t=await f.getBookmark(e);if(!t)return;const s=t.downloadedChapters||[],a=await Pa(e),n=s.filter(r=>!a.includes(r));console.log(`[Offline] ${n.length} new chapters to sync for ${t.alias||t.title}`);for(const r of n)await Os(e,r),console.log(`[Offline] Auto-synced chapter ${r}`)}catch(t){console.error("[Offline] Sync error:",t)}}const Kr={saveChapterOffline:Os,getOfflineChapter:Or,deleteOfflineChapter:_a,refreshOfflineChapter:Ur,isChapterOffline:Hr,getOfflineChapters:Vr,getOfflineChaptersForManga:Pa,getStorageUsage:jr,clearAllOfflineData:zr,setAutoOffline:Qr,isAutoOffline:Gr,getAutoOfflineManga:Wr,syncNewChaptersForManga:qa},Yr=e=>String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");let o={manga:null,chapter:null,versionUrl:null,images:[],trophyPages:{},mode:"manga",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!0,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null,isStreamingMode:!1,_streamAbortController:null,isVolumeMode:!1,volume:null};function Us(e,t=o.manga){if(!e||!t)return"";const s=(t.chapters||[]).find(n=>n.url===e),a=[];return s&&(s.releaseGroup?a.push(s.releaseGroup):s.title&&s.title!==`Chapter ${s.number}`&&a.push(s.title)),e.startsWith("local://")&&a.push("Local"),a.join(" · ")}function Hs(e){var s,a;const t=(a=(s=o.manga)==null?void 0:s.downloadedVersions)==null?void 0:a[e];return Array.isArray(t)?t:t?[t]:[]}function Jr(){var t;const e=Hs((t=o.chapter)==null?void 0:t.number);return e.length<2||!o.versionUrl?"":Us(o.versionUrl)||`Version ${e.indexOf(o.versionUrl)+1}`}function Ra(){if(!o.manga||!o.chapter||!o.allFavorites||!o.allFavorites.favorites)return!1;if(o.isCollectionMode)return!0;let t=[ks()];if(o.mode==="manga"&&!o.singlePageMode){const n=de()[o.currentPage];n&&Array.isArray(n)?t=n:n&&n.pages&&(t=n.pages)}const s=t.map(a=>{const n=$t(o.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in o.allFavorites.favorites){const n=o.allFavorites.favorites[a];if(Array.isArray(n)){for(const r of n)if(r.mangaId===o.manga.id&&r.chapterNum===o.chapter.number&&r.imagePaths)for(const i of r.imagePaths){const c=typeof i=="string"?i:(i==null?void 0:i.filename)||(i==null?void 0:i.path);for(const l of s)if(l&&l.filename===c)return!0}}}return!1}function ws(){const e=document.getElementById("favorites-btn");e&&(Ra()?e.classList.add("active"):e.classList.remove("active"))}function Qe(){var u,g;if(o.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!o.manga||!o.images.length&&!o.isStreamingMode)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const e=o.manga.alias||o.manga.title,t=(u=o.chapter)==null?void 0:u.number,s=o.isCollectionMode||o.isStreamingMode?"":Jr(),a=!o.isCollectionMode&&!o.isStreamingMode&&Hs(t).length>1,r=de().length,i=o.images.length;let c,l;o.mode==="webtoon"?(c=i-1,l=`${i} pages`):o.singlePageMode?(c=i-1,l=`${o.currentPage+1} / ${i}`):(c=r-1,l=`${o.currentPage+1} / ${r}`);const d=Ra(),p=Oa();return`
    <div class="reader ${o.mode}-mode ${o.showControls?"":"controls-hidden"}">
      <!-- Unified Top Bar -->
      <div class="reader-bar">
        <button class="reader-bar-btn close-btn" id="reader-close-btn" title="Back">×</button>
        <div class="reader-title">
          <span class="manga-name">${e}</span>
          ${o.isStreamingMode?"":o.isVolumeMode?`<span class="chapter-name" title="Volume release">${Yr(((g=o.volume)==null?void 0:g.name)||"Volume")}</span>`:`<span class="chapter-name">Ch. ${t}${s?` · <span class="version-label" title="Version being read">${s}</span>`:""}</span>`}
        </div>
        ${o.isCollectionMode?"":`
        <div class="reader-bar-tools" id="reader-toolbar">
          ${o.isStreamingMode?`
          <button class="reader-bar-btn" id="stream-add-lib-btn" title="Add to Library">${m("download",{title:"Add to Library"})}</button>
          <span class="reader-bar-divider"></span>
          `:`
          ${o.isVolumeMode?"":`<button class="reader-bar-btn ${d?"active":""}" id="favorites-btn" title="Add to favorites">${m("star",{title:"Add to favorites"})}</button>`}

          <button class="reader-bar-btn" id="rotate-btn" title="Rotate 90° CW">${m("rotate-cw",{title:"Rotate 90 degrees clockwise"})}</button>
          ${o.mode==="manga"&&!o.singlePageMode?`
            <button class="reader-bar-btn" id="swap-btn" title="Swap pages in spread">${m("arrow-left-right",{title:"Swap pages in spread"})}</button>
          `:""}
          ${o.singlePageMode||o.mode==="webtoon"?`
            <button class="reader-bar-btn" id="split-btn" title="Split wide image into halves">${m("scissors",{title:"Split wide image into halves"})}</button>
          `:""}
          <span class="reader-bar-divider"></span>
          `}
          ${o.mode==="manga"?`
            <button class="reader-bar-btn ${o.singlePageMode?"active":""}" id="single-page-btn" title="${o.singlePageMode?"Switch to double page":"Switch to single page"}">
              ${o.singlePageMode?m("rectangle-vertical"):m("columns-2")}
            </button>
            ${o.isStreamingMode?"":`
            <button class="reader-bar-btn ${p?"active":""}" id="trophy-btn" title="${p?"Unmark trophy":"Mark as trophy"}">${m("trophy")}</button>
            `}
          `:""}
          ${a?`<button class="reader-bar-btn" id="version-btn" title="Switch version / keep only one">${m("list",{title:"Versions"})}</button>`:""}
          <button class="reader-bar-btn" id="fullscreen-btn" title="Toggle fullscreen">${m("maximize",{title:"Toggle fullscreen"})}</button>
          <button class="reader-bar-btn" id="reader-settings-btn" title="Settings">${m("settings",{title:"Settings"})}</button>
        </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${o.mode==="webtoon"?`zoom: ${o.zoom}%`:""}">
        ${o.isCollectionMode?Da():o.mode==="webtoon"?Na():Fa()}
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
  `}function Da(){const e=o.mode==="manga";if(e&&!o.singlePageMode){const t=o.images[o.currentPage];if(!t)return"";const s=t.urls||[t.url],a=t.displayMode||"single";return t.displaySide,a==="double"&&s.length>=2?`
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
  `}function Na(){return`
    <div class="webtoon-pages">
      ${o.images.map((e,t)=>{const s=typeof e=="string"?e:e.url,a=o.trophyPages[t];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${t}">
          ${a?`<div class="trophy-indicator">${m("trophy")}</div>`:""}
          <img src="${s}" alt="Page ${t+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function Fa(){if(o.singlePageMode)return Xr();const t=de()[o.currentPage];if(!t)return"";if(t.type==="link"){const s=t.pages[0],a=o.images[s],n=typeof a=="string"?a:a.url,r=o.trophyPages[s];return`
        <div class="manga-spread ${o.direction}">
          <div class="manga-page ${r?"trophy-page":""}">
            ${r?`<div class="trophy-indicator">${m("trophy")}</div>`:""}
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
          ${r?`<div class="trophy-indicator">${m("trophy")}</div>`:""}
          <img src="${n}" alt="Page ${s+1}">
        </div>
      `}).join("")}
    </div>
  `}function Xr(){const e=o.currentPage,t=o.trophyPages[e];if(t&&!t.isSingle&&t.pages&&t.pages.length===2){const[r,i]=t.pages,c=o.images[r],l=o.images[i],d=typeof c=="string"?c:c==null?void 0:c.url,p=typeof l=="string"?l:l==null?void 0:l.url;if(d&&p)return`
            <div class="manga-spread ${o.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">${m("trophy")}</div><img src="${d}" alt="Page ${r+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">${m("trophy")}</div><img src="${p}" alt="Page ${i+1}"></div>
            </div>
            `}const s=o.images[e];if(!s)return"";const a=typeof s=="string"?s:s.url,n=o.trophyPages[e];return`
    <div class="manga-spread single ${o.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?`<div class="trophy-indicator">${m("trophy")}</div>`:""}
        <img src="${a}" alt="Page ${e+1}">
      </div>
    </div>
  `}function de(){const e=[],t=o.images.length;let s=0;if(o.isCollectionMode){for(let n=0;n<t;n++)e.push([n]);return e}let a=!o.firstPageSingle;for(;s<t;){const n=o.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[r,i]=n.pages;e.push([r,i]),s=Math.max(r,i)+1}else e.push([s]),s++;continue}if(!a){a=!0,e.push([s]),s++;continue}if(o.lastPageSingle&&s===t-1){o.nextChapterImage?e.push({type:"link",pages:[s],nextImage:o.nextChapterImage,nextChapter:o.nextChapterNum}):e.push([s]),s++;break}s+1<t?o.trophyPages[s+1]?(e.push([s]),s++):o.lastPageSingle&&s+1===t-1?(e.push([s]),o.nextChapterImage?e.push({type:"link",pages:[s+1],nextImage:o.nextChapterImage,nextChapter:o.nextChapterNum}):e.push([s+1]),s+=2):(e.push([s,s+1]),s+=2):(e.push([s]),s++)}return e}function Oa(){if(o.singlePageMode)return!!o.trophyPages[o.currentPage];const t=de()[o.currentPage];return t?(Array.isArray(t)?t:t.pages||[]).some(a=>!!o.trophyPages[a]):!1}function Vs(){if(o.singlePageMode)return[o.currentPage];const t=de()[o.currentPage];return t?Array.isArray(t)?t:t.pages||[]:[]}async function Zr(){if(!o.manga||!o.chapter||o.isCollectionMode)return;const e=Vs();if(e.length===0)return;if(e.some(s=>!!o.trophyPages[s])){const s=[...e];if(o.singlePageMode){const a=o.trophyPages[o.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete o.trophyPages[a]),h(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=e,a=o.singlePageMode||e.length===1;if(!o.singlePageMode&&e.length===2){const r=await Qa(e,"Mark as trophy");if(!r)return;s=r.pages,a=r.pages.length===1}s.forEach(r=>{o.trophyPages[r]={isSingle:a,pages:[...s]}});const n=a?"single":"double";h(`Page${s.length>1?"s":""} marked as trophy (${n})`,"success")}try{await f.saveTrophyPages(o.manga.id,o.chapter.number,o.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}qe(),Ua()}function Ua(){const e=document.getElementById("trophy-btn");if(e){const t=Oa();e.classList.toggle("active",t),e.title=t?"Unmark trophy":"Mark as trophy"}}function Ha(){var a;if(!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode||!o.images.length)return null;const e=o.images.length;let t=1,s=!1;if(o.mode==="manga"){const n=Vs();n.length>0&&(t=Math.min(...n)+1),s=n.includes(e-1)}else{const n=document.getElementById("reader-content");if(n){const r=[...n.querySelectorAll("img")],i=n.scrollTop;let c=0;r.forEach((p,u)=>{i>=c&&(t=u+1),c+=p.offsetHeight});const l=n.scrollHeight>n.clientHeight+10,d=r.length>0&&r.every(p=>p.complete&&p.naturalHeight>0);s=l?i+n.clientHeight>=n.scrollHeight-4:d}}return s&&(t=e),{mangaId:o.manga.id,chapterNumber:o.chapter.number,volumeId:o.isVolumeMode?(a=o.volume)==null?void 0:a.id:null,currentPage:t,totalPages:e}}async function Ye(e=Ha()){var t,s;if(!(!e||X.isDemo)){if(e.volumeId){try{if(await f.saveVolumeProgress(e.mangaId,e.volumeId,e.currentPage,e.totalPages),e.currentPage>=e.totalPages&&((t=o.manga)==null?void 0:t.id)===e.mangaId&&o.volume){const a=new Set(o.manga.readChapters||[]);for(const n of o.volume.chapters||[])a.add(n);o.manga.readChapters=[...a]}}catch(a){console.error("Failed to save volume progress:",a)}return}try{if(await f.updateReadingProgress(e.mangaId,e.chapterNumber,e.currentPage,e.totalPages),e.currentPage>=e.totalPages&&((s=o.manga)==null?void 0:s.id)===e.mangaId){const a=new Set(o.manga.readChapters||[]);a.add(e.chapterNumber),o.manga.readChapters=[...a]}}catch(a){console.error("Failed to save progress:",a)}}}let ze=null;function Va(){ze&&clearTimeout(ze),ze=setTimeout(()=>{ze=null,Ye()},1500)}function Ut(){var s,a,n,r,i,c,l,d,p,u,g,$,v,y,L,w,x,T,k,I,N;const e=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{o.isStreamingMode||(await Ye(),await Ue()),o.isStreamingMode?H.go("/scrapers"):o.manga&&o.manga.id!=="gallery"?H.go(`/manga/${o.manga.id}`):H.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{H.go(o.isStreamingMode?"/scrapers":"/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var E;(E=document.getElementById("reader-settings"))==null||E.classList.toggle("hidden")}),(r=document.getElementById("close-settings-btn"))==null||r.addEventListener("click",()=>{var E;(E=document.getElementById("reader-settings"))==null||E.classList.add("hidden")}),(i=document.getElementById("single-page-btn"))==null||i.addEventListener("click",()=>{if(o.singlePageMode){const E=de();let b=0;for(let M=0;M<E.length;M++)if(E[M].includes(o.currentPage)){b=M;break}o.singlePageMode=!1,o.currentPage=b}else{const b=de()[o.currentPage];o.singlePageMode=!0,o.currentPage=b?b[0]:0}localStorage.setItem("reader_single_page",o.singlePageMode?"1":"0"),tt()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{Zr()}),e.querySelectorAll("[data-mode]").forEach(E=>{E.addEventListener("click",()=>{var _,O;const b=E.dataset.mode;let M=ks();if(o.mode=b,localStorage.setItem("reader_mode",o.mode),b==="webtoon")o.currentPage=M;else if(o.singlePageMode)o.currentPage=M;else{const V=de();let ee=0;for(let G=0;G<V.length;G++)if(V[G].includes(M)){ee=G;break}o.currentPage=ee}(_=o.manga)!=null&&_.id&&((O=o.chapter)!=null&&O.number)&&Ue(),tt(),b==="webtoon"&&setTimeout(()=>{const V=document.getElementById("reader-content");if(V){const ee=V.querySelectorAll("img");ee[M]&&ee[M].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),e.querySelectorAll("[data-direction]").forEach(E=>{E.addEventListener("click",async()=>{var b,M;o.direction=E.dataset.direction,localStorage.setItem("reader_direction",o.direction),(b=o.manga)!=null&&b.id&&((M=o.chapter)!=null&&M.number)&&await Ue(),tt()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async E=>{o.firstPageSingle=E.target.checked,await Ue(),qe()}),(d=document.getElementById("last-page-single"))==null||d.addEventListener("change",async E=>{var b,M;o.lastPageSingle=E.target.checked,await Ue(),o.lastPageSingle&&((b=o.manga)!=null&&b.id)&&((M=o.chapter)!=null&&M.number)?await ja():(o.nextChapterImage=null,o.nextChapterNum=null),qe()}),(p=document.getElementById("zoom-slider"))==null||p.addEventListener("input",E=>{o.zoom=parseInt(E.target.value);const b=document.getElementById("reader-content");b&&(b.style.zoom=`${o.zoom}%`)});const t=document.getElementById("page-slider");if(t&&(t.addEventListener("input",E=>{const b=parseInt(E.target.value),M=document.getElementById("page-indicator");M&&(o.singlePageMode?M.textContent=`${b+1} / ${o.images.length}`:M.textContent=`${b+1} / ${de().length}`)}),t.addEventListener("change",E=>{o.currentPage=parseInt(E.target.value),qe()})),o.mode==="manga"){const E=document.getElementById("reader-content");E==null||E.addEventListener("click",b=>{var V;if(b.target.closest("button, a, .link-overlay"))return;const M=E.getBoundingClientRect(),O=(b.clientX-M.left)/M.width;O<.3?Es():O>.7?At():(o.showControls=!o.showControls,(V=document.querySelector(".reader"))==null||V.classList.toggle("controls-hidden",!o.showControls))})}document.addEventListener("keydown",Ga),(u=document.getElementById("prev-chapter-btn"))==null||u.addEventListener("click",()=>Ht(-1)),(g=document.getElementById("next-chapter-btn"))==null||g.addEventListener("click",()=>Ht(1)),o.mode==="webtoon"&&(($=document.getElementById("reader-content"))==null||$.addEventListener("click",()=>{var E;o.showControls=!o.showControls,(E=document.querySelector(".reader"))==null||E.classList.toggle("controls-hidden",!o.showControls)}),(v=document.getElementById("reader-content"))==null||v.addEventListener("scroll",Va,{passive:!0})),(y=document.getElementById("rotate-btn"))==null||y.addEventListener("click",async()=>{const E=ls();if(!(!E||!o.manga||!o.chapter))try{h("Rotating...","info");const b=await It().rotate(E);b.images&&(await cs(b.images),h("Page rotated","success"))}catch(b){h("Rotate failed: "+b.message,"error")}}),(L=document.getElementById("swap-btn"))==null||L.addEventListener("click",async()=>{const b=de()[o.currentPage];if(!b||b.length!==2||!o.manga||!o.chapter){h("Select a spread with 2 pages to swap","info");return}const M=$t(o.images[b[0]]),_=$t(o.images[b[1]]);if(!(!M||!_))try{h("Swapping...","info");const O=await It().swap(M,_);O.images&&(await cs(O.images),h("Pages swapped","success"))}catch(O){h("Swap failed: "+O.message,"error")}}),(w=document.getElementById("split-btn"))==null||w.addEventListener("click",async()=>{const E=ls();if(!E||!o.manga||!o.chapter||!confirm("Split this page into halves? This is permanent."))return;const b=document.getElementById("split-btn");try{h("Preparing to split...","info"),b&&(b.disabled=!0),o.images=[],o.loading=!0,e.innerHTML=Qe(),await new Promise(_=>setTimeout(_,2e3)),h("Splitting page...","info");const M=await It().split(E);b&&(b.disabled=!1),await Oe(o.manga.id,na(),o.versionUrl),e.innerHTML=Qe(),Ut(),qe(),M.warning?h(M.warning,"warning"):h("Page split into halves","success")}catch(M){b&&(b.disabled=!1),h("Split failed: "+M.message,"error"),await Oe(o.manga.id,na(),o.versionUrl),e.innerHTML=Qe(),Ut()}}),(x=document.getElementById("delete-page-btn"))==null||x.addEventListener("click",async()=>{const E=ls();if(!(!E||!o.manga||!o.chapter)&&confirm(`Delete page "${E}" permanently? This cannot be undone.`))try{h("Deleting...","info");const b=await It().remove(E);b.images&&(await cs(b.images),h("Page deleted","success"))}catch(b){h("Delete failed: "+b.message,"error")}}),(T=document.getElementById("favorites-btn"))==null||T.addEventListener("click",async()=>{try{const M=await f.getFavorites();o.allFavorites=M,o.favoriteLists=Object.keys(M.favorites||M||{})}catch(M){console.error("Failed to load favorites",M),h("Failed to load favorites","error");return}let b=[ks()];if(o.mode==="manga"&&!o.singlePageMode){const _=de()[o.currentPage];_&&Array.isArray(_)?b=_:_&&_.pages&&(b=_.pages)}if(b.length>1){const M=await Qa(b,"Select Page for Favorites");if(!M)return;b=M.pages}no(b)}),(k=document.getElementById("version-btn"))==null||k.addEventListener("click",()=>{so()}),(I=document.getElementById("fullscreen-btn"))==null||I.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{h("Fullscreen not supported","info")})}),(N=document.getElementById("stream-add-lib-btn"))==null||N.addEventListener("click",async()=>{var M;const E=document.getElementById("stream-add-lib-btn");if(!((M=o.manga)!=null&&M._streamUrl)){h("No URL to add","error");return}const b=E.innerHTML;E.innerHTML=m("loader",{spin:!0}),E.disabled=!0;try{const _=await f.addBookmark(o.manga._streamUrl);if(!_.jobId)throw new Error("No job ID returned");h("Adding to library...","info");const O=setInterval(async()=>{var V;try{const G=(await f.getQueueHistory(20)).find(Z=>Z.id===_.jobId);G&&(G.status==="completed"?(clearInterval(O),(V=G.result)!=null&&V.bookmark&&(h("Added to library!","success"),E.innerHTML=m("check"),E.title="Added! Click to view",E.disabled=!1,E.onclick=()=>{H.go(`/manga/${G.result.bookmark.id}`)})):G.status==="failed"&&(clearInterval(O),h("Failed to add: "+(G.error||"Unknown error"),"error"),E.innerHTML=b,E.disabled=!1))}catch{}},1500)}catch(_){h("Failed to add: "+_.message,"error"),E.innerHTML=b,E.disabled=!1}}),document.body.classList.add("reader-active")}function $s(e){return-(1e3+(Number(e==null?void 0:e.number)||0))}async function eo(e,t){const s=$s(t.volume);try{let a=await f.getChapterSettings(e,s);!Vt(a)&&t.prev&&(a=await f.getChapterSettings(e,$s(t.prev))),Vt(a)&&Ss(a)}catch(a){console.warn("Failed to load volume settings",a)}try{o.trophyPages=await f.getTrophyPages(e,s)||{}}catch{o.trophyPages={}}}function It(){const e=o.manga.id;if(o.isVolumeMode){const s=o.volume.id;return{rotate:a=>f.rotateVolumePage(e,s,a,90),swap:(a,n)=>f.swapVolumePages(e,s,a,n),split:a=>f.splitVolumePage(e,s,a),remove:a=>f.deleteVolumePage(e,s,a)}}const t=o.chapter.number;return{rotate:s=>f.rotatePage(e,t,s,90,o.versionUrl),swap:(s,a)=>f.swapPages(e,t,s,a,o.versionUrl),split:s=>f.splitPage(e,t,s,o.versionUrl),remove:s=>f.deletePage(e,t,s,o.versionUrl)}}function na(){return o.isVolumeMode?`volume:${o.volume.id}`:o.chapter.number}function $t(e){var n;const t=typeof e=="string"?e:(e==null?void 0:e.url)||((n=e==null?void 0:e.urls)==null?void 0:n[0]);if(!t)return null;const a=t.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function ls(){const e=Vs();return e.length===0?null:$t(o.images[e[0]])}async function cs(e){var s,a;(s=o.manga)!=null&&s.id&&((a=o.chapter)!=null&&a.number)&&!o.isStreamingMode&&!o.isVolumeMode&&Kr.refreshOfflineChapter(o.manga.id,o.chapter.number).then(n=>{n&&console.log("[Reader] Refreshed offline copy after page edit")}).catch(n=>console.warn("[Reader] Offline refresh failed:",n));const t=Date.now();if(o.images=e.map(n=>{const r=typeof n=="string"?n:n==null?void 0:n.url;if(!r)return n;const i=r+(r.includes("?")?"&":"?")+`_t=${t}`;return typeof n=="string"?i:{...n,url:i}}),o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.min(o.currentPage,o.images.length-1);else{const n=de();o.currentPage=Math.min(o.currentPage,n.length-1)}o.currentPage=Math.max(0,o.currentPage),qe()}async function ja(){var e,t;if(!(!((e=o.manga)!=null&&e.id)||!((t=o.chapter)!=null&&t.number)||o.isVolumeMode))try{const s=await f.getNextChapterPreview(o.manga.id,o.chapter.number);o.nextChapterImage=s.firstImage||null,o.nextChapterNum=s.nextChapter||null}catch{o.nextChapterImage=null,o.nextChapterNum=null}}async function to(){var r,i;if(!((r=o.manga)!=null&&r.id)||!((i=o.chapter)!=null&&i.number)||o.isCollectionMode||o.isVolumeMode)return;const t=[...o.manga.downloadedChapters||[]].sort((c,l)=>c-l),s=t.indexOf(o.chapter.number);if(s<0||s>=t.length-1)return;const a=t[s+1],n=o.manga.id;if(!(o._preloadCache&&o._preloadCache.chapterNum===a&&o._preloadCache.mangaId===n))try{const l=(o.manga.downloadedVersions||{})[a]||[],d=Array.isArray(l)?l[0]:l,p=d?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(d)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,g=(await f.get(p)).images||[];if(g.length===0)return;const $=g.map(v=>{const y=new Image,L=typeof v=="string"?v:v.url;return L&&(y.src=L),y});o._preloadCache={chapterNum:a,mangaId:n,images:g,imageObjects:$,versionUrl:d},console.log(`[Reader] Preloaded ${g.length} images for chapter ${a}`)}catch(c){console.warn("[Reader] Failed to preload next chapter:",c)}}function za(e,t,s=o.manga,a=[],n={}){return new Promise(r=>{const i=document.createElement("div");i.className="version-modal-overlay",i.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${t} has ${e.length} versions</h3>
                <p>${n.allowKeep?"Switch version, or keep one and delete the rest:":"Select which version to read:"}</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const c=i.querySelector(".version-list");e.forEach((l,d)=>{const p=document.createElement("button");p.className="version-item";const u=n.current&&n.current===l;u&&p.classList.add("current");const g=(Us(l,s)||`Version ${d+1}`)+(u?" (reading)":""),$=a.find(w=>w.url===l),v=[];if($!=null&&$.imageCount&&v.push(`${$.imageCount} pages`),$!=null&&$.folder&&v.push($.folder),p.innerHTML=`<span class="version-item-title"></span>${v.length?'<span class="version-item-meta"></span>':""}`,p.querySelector(".version-item-title").textContent=g,v.length&&(p.querySelector(".version-item-meta").textContent=v.join(" · ")),p.title=l,p.addEventListener("click",()=>{i.remove(),r(l)}),!n.allowKeep){c.appendChild(p);return}const y=document.createElement("div");y.className="version-item-row",y.appendChild(p);const L=document.createElement("button");L.className="version-item-keep",L.textContent="Keep only",L.title="Delete every other downloaded version of this chapter",L.addEventListener("click",()=>{i.remove(),r({keep:l})}),y.appendChild(L),c.appendChild(y)}),i.querySelector(".version-cancel").addEventListener("click",()=>{i.remove(),r(null)}),i.addEventListener("click",l=>{l.target===i&&(i.remove(),r(null))}),document.body.appendChild(i)})}async function so(){if(!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode)return;const e=o.chapter.number,t=Hs(e);if(t.length<2)return;let s=[];try{s=(await f.getChapterVersions(o.manga.id,e)).versions||[]}catch{}const a=await za(t,e,o.manga,s,{current:o.versionUrl,allowKeep:!0});if(a){if(typeof a=="string"){a!==o.versionUrl&&(await Ye(),H.go(`/read/${o.manga.id}/${e}?version=${encodeURIComponent(a)}`));return}a.keep&&await ao(e,a.keep,t)}}async function ao(e,t,s){var c;const a=s.filter(l=>l!==t),n=Us(t)||"this version";if(!confirm(`Keep only "${n}" and delete the other ${a.length} downloaded version${a.length>1?"s":""} of chapter ${e}?`))return;const r=o.manga.id;let i=0;for(const l of a)try{await f.deleteChapterVersion(r,e,l)}catch(d){i++,h("Failed to delete a version: "+d.message,"error")}i===0&&h("Other versions deleted","success");try{const l=await f.getBookmark(r);((c=o.manga)==null?void 0:c.id)===r&&(o.manga=l)}catch{}t!==o.versionUrl?H.go(`/read/${r}/${e}?version=${encodeURIComponent(t)}`):tt()}function no(e){if(!o.manga||!o.chapter)return;const t=e.map(l=>{const d=$t(o.images[l]);return d?{filename:d}:null}).filter(Boolean),s=l=>{if(!o.allFavorites||!o.allFavorites.favorites)return-1;const d=o.allFavorites.favorites[l];if(!Array.isArray(d))return-1;for(let p=0;p<d.length;p++){const u=d[p];if(u.mangaId===o.manga.id&&u.chapterNum===o.chapter.number&&u.imagePaths)for(const g of u.imagePaths){const $=typeof g=="string"?g:(g==null?void 0:g.filename)||(g==null?void 0:g.path);for(const v of t)if(v&&v.filename===$)return p}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";o.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',o.favoriteLists.forEach(l=>{const p=s(l)!==-1;n+=`
                <button class="page-picker-option list-option ${p?"active-list":""}" data-list="${l}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${l}</span>
                    <span style="font-size: 1.2em;">${m(p?"check":"plus")}</span>
                </button>
            `}),n+="</div>"),a.innerHTML=`
        <div class="page-picker-modal" style="width: 90%; max-width: 400px;">
            <h3>${m("star")} Favorites</h3>
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
    `,a.appendChild(r),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),ws()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),ws())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const d=l.dataset.list,p=s(d),u=p!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(u){await f.removeFavoriteItem(d,p);const g=await f.getFavorites();o.allFavorites=g,l.classList.remove("active-list"),l.querySelector("span:last-child").innerHTML=m("plus")}else{const g=e.length>1?"double":"single",$={mangaId:o.manga.id,chapterNum:o.chapter.number,title:`${o.manga.alias||o.manga.title} Ch.${o.chapter.number} p${e[0]+1}`,imagePaths:t,displayMode:g,displaySide:o.direction==="rtl"?"right":"left"};await f.addFavoriteItem(d,$);const v=await f.getFavorites();o.allFavorites=v,l.classList.add("active-list"),l.querySelector("span:last-child").innerHTML=m("check")}}catch(g){console.error(g)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function Qa(e,t){return new Promise(s=>{const[a,n]=e,r=o.images[a],i=o.images[n],c=typeof r=="string"?r:r==null?void 0:r.url,l=typeof i=="string"?i:i==null?void 0:i.url,d=o.direction==="rtl",p=d?n:a,u=d?a:n,g=d?l:c,$=d?c:l,v=document.createElement("div");v.className="page-picker-overlay",v.innerHTML=`
            <div class="page-picker-modal">
                <h3>${t}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${p+1}">
                        <img src="${g}" alt="Page ${p+1}">
                        <span class="page-picker-label">Page ${p+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${u+1}">
                        <img src="${$}" alt="Page ${u+1}">
                        <span class="page-picker-label">Page ${u+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    ${m("columns-2")} Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const y=L=>{v.remove(),s(L)};v.querySelectorAll(".page-picker-option").forEach(L=>{L.addEventListener("click",()=>{const w=L.dataset.choice;w==="left"?y({pages:[p]}):w==="right"?y({pages:[u]}):w==="both"&&y({pages:e})})}),v.querySelector(".page-picker-cancel").addEventListener("click",()=>y(null)),v.addEventListener("click",L=>{L.target===v&&y(null)}),document.body.appendChild(v)})}function ks(){if(o.mode==="webtoon"){const e=document.getElementById("reader-content");if(e){const t=e.querySelectorAll("img");if(t.length>0){const s=e.scrollTop;if(s>10){let a=0;for(let n=0;n<t.length;n++){const r=t[n].offsetHeight;if(a+r>s)return n;a+=r}}}}return 0}else{if(o.singlePageMode)return o.currentPage;{const t=de()[o.currentPage];return t&&t.length>0?t[0]:0}}}function Ga(e){var t;if(!(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")){if(e.key==="Escape"){const s=(t=o.manga)==null?void 0:t.id;Promise.all([Ye(),Ue()]).finally(()=>{s&&H.go(`/manga/${s}`)});return}if(o.mode==="manga")e.key==="ArrowLeft"?o.direction==="rtl"?At():Es():e.key==="ArrowRight"?o.direction==="rtl"?Es():At():e.key===" "&&(e.preventDefault(),At());else if(o.mode==="webtoon"&&e.key===" "){e.preventDefault();const s=document.getElementById("reader-content");if(s){const a=s.clientHeight*.8;s.scrollBy({top:e.shiftKey?-a:a,behavior:"smooth"})}}}}function At(){const e=de(),t=o.singlePageMode?o.images.length-1:e.length-1;if(o.currentPage<t)o.currentPage++,qe();else{const s=e[o.currentPage],a=s&&s.type==="link";Ye(),a&&(o.navigationDirection="next-linked"),Ht(1)}}function Es(){o.currentPage>0?(o.currentPage--,qe()):Ht(-1)}function qe(){const e=document.getElementById("reader-content");if(e){e.innerHTML=o.isCollectionMode?Da():o.mode==="webtoon"?Na():Fa();const t=document.getElementById("page-indicator");t&&(o.singlePageMode?t.textContent=`${o.currentPage+1} / ${o.images.length}`:t.textContent=`${o.currentPage+1} / ${de().length}`);const s=document.getElementById("page-slider");s&&(s.value=o.currentPage,s.max=o.singlePageMode?o.images.length-1:de().length-1),Ua(),ws(),o.mode==="manga"&&Va()}}function tt(){const e=document.getElementById("app");e&&(e.innerHTML=Qe(),Ut())}async function Ht(e){var r,i;if(console.log("[Nav] navigateChapter called with delta:",e),o.isStreamingMode)return;if(!o.manga||!o.chapter){console.log("[Nav] early return - no manga or chapter");return}if(await Ye(),await Ue(),o.isVolumeMode){const c=e>0?(r=o.volume)==null?void 0:r.next:(i=o.volume)==null?void 0:i.prev;c?(o.navigationDirection=e<0?"prev":null,H.go(`/read/${o.manga.id}/volume/${c.id}`)):h(e>0?"Last volume":"First volume","info");return}const s=[...o.manga.downloadedChapters||[]].sort((c,l)=>c-l),a=s.indexOf(o.chapter.number),n=a+e;if(console.log("[Nav]",{delta:e,chapterNumber:o.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length){o.navigationDirection||(o.navigationDirection=e<0?"prev":null);const c=s[n],d=(o.manga.downloadedVersions||{})[c]||[],p=Array.isArray(d)?d[0]:d,u=p?`?version=${encodeURIComponent(p)}`:"";console.log("[Nav] Calling router.go with:",`/read/${o.manga.id}/${c}${u}`),H.go(`/read/${o.manga.id}/${c}${u}`)}else h(e>0?"Last chapter":"First chapter","info")}async function Oe(e,t,s){var a,n,r,i,c;console.log("[Reader] loadData called:",{mangaId:e,chapterNum:t,versionUrl:s});try{o.mode=localStorage.getItem("reader_mode")||"manga",o.direction=localStorage.getItem("reader_direction")||"rtl",o.singlePageMode=localStorage.getItem("reader_single_page")!=="0",o.firstPageSingle=!0,o.lastPageSingle=!1,o.versionUrl=null,o.isVolumeMode=!1,o.volume=null;let l=null;if(String(t).startsWith("volume:")){const d=String(t).slice(7);o.isVolumeMode=!0,o.isCollectionMode=!1,o.isGalleryMode=!1,o.isStreamingMode=!1;const p=await f.getBookmark(e);o.manga=p;const u=await f.getVolumePages(e,d);o.volume={...u.volume,prev:u.prev||null,next:u.next||null},o.chapter={number:$s(u.volume),title:u.volume.name,volumeId:d},o.images=u.images||[],l=u.progress&&!u.progress.finished?u.progress:null,await eo(e,u)}else if(e==="gallery"){const d=decodeURIComponent(t),u=((a=(await f.getFavorites()).favorites)==null?void 0:a[d])||[];o.images=[];for(const g of u){const $=g.imagePaths||[],v=[];for(const y of $){let L;typeof y=="string"?L=y:y&&typeof y=="object"&&(L=y.filename||y.path||y.name||y.url,L&&L.includes("/")&&(L=L.split("/").pop()),L&&L.includes("\\")&&(L=L.split("\\").pop())),L&&v.push(`/api/public/chapter-images/${g.mangaId}/${g.chapterNum}/${encodeURIComponent(L)}`)}v.length>0&&o.images.push({urls:v,displayMode:g.displayMode||"single",displaySide:g.displaySide||"left"})}o.manga={id:"gallery",title:d,alias:d},o.chapter={number:"Gallery"},o.isGalleryMode=!0,o.isCollectionMode=!0,o.images.length===0&&h("Gallery is empty","warning")}else if(e==="trophies"){const d=t;let p=[],u="Trophies";if(d.startsWith("series-")){const g=d.replace("series-",""),v=(await store.loadSeries()).find(w=>w.id===g);u=v?v.alias||v.title:"Series Trophies";const L=(await store.loadBookmarks()).filter(w=>w.seriesId===g);for(const w of L){const x=await f.getTrophyPagesAll(w.id);for(const T in x)if(!(parseFloat(T)<0))for(const k in x[T]){const I=x[T][k],E=(await f.getChapterImages(w.id,T)).images[k],b=typeof E=="string"?E.split("/").pop():(E==null?void 0:E.filename)||(E==null?void 0:E.path);p.push({mangaId:w.id,chapterNum:T,imagePaths:[{filename:b}],displayMode:I.isSingle?"single":"double",displaySide:"left"})}}}else{const g=await f.getBookmark(d);u=g?g.alias||g.title:"Manga Trophies";const $=await f.getTrophyPagesAll(d);for(const v in $)if(!(parseFloat(v)<0))for(const y in $[v]){const L=$[v][y],x=(await f.getChapterImages(d,v)).images[y],T=typeof x=="string"?x.split("/").pop():(x==null?void 0:x.filename)||(x==null?void 0:x.path);p.push({mangaId:d,chapterNum:v,imagePaths:[{filename:decodeURIComponent(T)}],displayMode:L.isSingle?"single":"double",displaySide:"left"})}}o.images=p.map(g=>{const $=g.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${g.mangaId}/${g.chapterNum}/${encodeURIComponent($)}`],displayMode:g.displayMode,displaySide:g.displaySide}}),o.manga={id:"trophies",title:u,alias:u},o.chapter={number:"🏆"},o.isCollectionMode=!0,o.isGalleryMode=!1}else if(e==="stream"){o.isStreamingMode=!0,o.isCollectionMode=!1,o.isGalleryMode=!1,o.singlePageMode=!0;const d=sessionStorage.getItem("streamPreviewUrl"),p=sessionStorage.getItem("streamPreviewScraper"),u=sessionStorage.getItem("streamPreviewTitle")||"Preview";o.manga={id:"stream",title:u,alias:u,_streamUrl:d},o.chapter={number:1},o.images=[],d?ro(d,p):h("No stream URL found","error")}else{o.isGalleryMode=!1;const d=await f.getBookmark(e);o.manga=d,console.log("[Reader] manga loaded, finding chapter..."),o.chapter=((n=d.chapters)==null?void 0:n.find(u=>u.number===parseFloat(t)))||{number:parseFloat(t)};const p=parseFloat(t);if(o._preloadCache&&o._preloadCache.mangaId===e&&o._preloadCache.chapterNum===p)console.log("[Reader] Using preloaded images for chapter",t),o.images=o._preloadCache.images||[],o.versionUrl=s||o._preloadCache.versionUrl||null,o._preloadCache=null;else{o.versionUrl=s||null;const u=s?`/bookmarks/${e}/chapters/${t}/reader-images?version=${encodeURIComponent(s)}`:`/bookmarks/${e}/chapters/${t}/reader-images`,g=await f.get(u);console.log("[Reader] images loaded, count:",(r=g.images)==null?void 0:r.length),o.images=g.images||[]}try{const u=await f.getChapterSettings(e,t);if(Vt(u))Ss(u);else try{const $=[...o.manga.downloadedChapters||[]].sort((x,T)=>x-T),v=parseFloat(t),y=$.indexOf(v),L=[];if(y!==-1){for(let x=y-1;x>=0;x--)L.push($[x]);for(let x=y+1;x<$.length;x++)L.push($[x])}const w=12;for(const x of L.slice(0,w)){const T=await f.getChapterSettings(e,x);if(Vt(T)){Ss(T),console.log("[Reader] Inherited settings from chapter",x);break}}}catch(g){console.warn("Failed to inherit chapter settings",g)}}catch(u){console.warn("Failed to load chapter settings",u)}try{const u=await f.getTrophyPages(e,t);o.trophyPages=u||{}}catch(u){console.warn("Failed to load trophy pages",u)}try{const u=await f.getFavorites();o.allFavorites=u,o.favoriteLists=Object.keys(u.favorites||u||{})}catch(u){console.warn("Failed to load favorites",u)}}if(o.isStreamingMode)o.currentPage=0;else{const d=parseFloat(t),p=o.isVolumeMode?l:(c=(i=o.manga)==null?void 0:i.readingProgress)==null?void 0:c[d];if(p&&p.page<p.totalPages)if(o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.max(0,p.page-1);else{const u=Math.max(0,p.page-1),g=de();let $=0;for(let v=0;v<g.length;v++){const y=g[v],L=Array.isArray(y)?y:y.pages||[];if(L.includes(u)||L[0]>=u){$=v;break}$=v}o.currentPage=$}else o.currentPage=0,o._resumeScrollToPage=p.page-1;else o.currentPage=0}}catch(l){console.error("Error loading chapter:",l),h("Failed to load chapter","error")}if(!o.isStreamingMode){if(o.navigationDirection==="prev"&&o.mode==="manga")if(o.singlePageMode)o.currentPage=Math.max(0,o.images.length-1);else{const l=de();o.currentPage=Math.max(0,l.length-1)}else if(o.navigationDirection==="next-linked"&&o.mode==="manga"&&o.images.length>1)if(o.singlePageMode)o.currentPage=1;else{const l=de();let d=0;for(let p=0;p<l.length;p++){const u=l[p];if((Array.isArray(u)?u:u.pages||[]).includes(1)){d=p;break}}o.currentPage=d}}o.navigationDirection=null,o.lastPageSingle&&!o.isStreamingMode&&await ja(),o.loading=!1,tt(),o.isStreamingMode||to(),o.mode==="webtoon"&&o._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const d=l.querySelectorAll("img");d[o._resumeScrollToPage]&&d[o._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete o._resumeScrollToPage},300)}async function ro(e,t){o._streamAbortController&&o._streamAbortController.abort(),o._streamAbortController=new AbortController;const{signal:s}=o._streamAbortController;try{let a="/api/scrapers/preview-images-stream?";t&&(a+=`scraper=${encodeURIComponent(t)}&`),a+=`url=${encodeURIComponent(e)}`;const n=localStorage.getItem("manga_auth_token"),r={};n&&(r.Authorization=`Bearer ${n}`),console.log("[Reader] Starting stream from:",a);const i=await fetch(a,{headers:r,signal:s});if(!i.ok)throw new Error(`Failed to start stream: ${i.statusText}`);const c=i.body.getReader(),l=new TextDecoder;let d="";for(;;){const{value:p,done:u}=await c.read();if(u||s.aborted)break;d+=l.decode(p,{stream:!0});const g=d.split(`

`);d=g.pop();let $=!1;for(const v of g)if(v.startsWith("data: ")){const y=v.substring(6);try{const L=JSON.parse(y);if(L.type==="metadata")o.manga.title=L.title,o.manga.alias=L.title,tt();else if(L.type==="image"){const w=`/api/scrapers/proxy-cover?url=${encodeURIComponent(L.url)}`;o.images.push(w),$=!0}else if(L.type==="error")h("Stream error: "+L.message,"error");else if(L.type==="done")break}catch(L){console.error("Parse error for SSE data:",L)}}$&&qe()}}catch(a){a.name!=="AbortError"&&(console.error("Preview stream error:",a),h("Stream failed: "+a.message,"error"))}finally{o._streamAbortController&&o._streamAbortController.signal===s&&(o._streamAbortController=null)}}async function oo(e=[]){console.log("[Reader] mount called with params:",e);let[t,s]=e,a=null;if(s&&s.includes("?")){const[r,i]=s.split("?");s=r,a=new URLSearchParams(i).get("version")}else{const r=window.location.hash.split("?")[1];r&&(a=new URLSearchParams(r).get("version"))}if(console.log("[Reader] mangaId:",t,"chapterNum:",s,"urlVersion:",a),!t||!s){H.go("/");return}const n=document.getElementById("app");if(o.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),o.images=[],o.singlePageMode=!1,o._resumeScrollToPage=null,o.nextChapterImage=null,o.nextChapterNum=null,n.innerHTML=Qe(),s==="volume"&&e[2])await Oe(t,`volume:${e[2]}`);else if(a)await Oe(t,s,decodeURIComponent(a));else try{const r=await f.getBookmark(t),i=r.downloadedVersions||{},c=new Set(r.deletedChapterUrls||[]),l=i[parseFloat(s)];let d=[];if(Array.isArray(l)&&(d=l.filter(p=>!c.has(p))),d.length>1){let p=[];try{p=(await f.getChapterVersions(t,s)).versions||[]}catch{}const u=await za(d,s,r,p);if(u===null){H.go(`/manga/${t}`);return}await Oe(t,s,u)}else d.length===1?await Oe(t,s,d[0]):await Oe(t,s)}catch(r){console.log("[Reader] Error in version check, falling back:",r),await Oe(t,s)}if(n.innerHTML=Qe(),console.log("[Reader] render called, loading:",o.loading,"manga:",!!o.manga,"images:",o.images.length),Ut(),o.mode==="webtoon"&&o._resumeScrollToPage!=null){const r=o._resumeScrollToPage;o._resumeScrollToPage=null,setTimeout(()=>{const i=document.getElementById("reader-content");if(i){const c=i.querySelectorAll("img");c[r]&&c[r].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function io(){console.log("[Reader] unmount called"),o._streamAbortController&&(o._streamAbortController.abort(),o._streamAbortController=null),ze&&(clearTimeout(ze),ze=null);const e=Ha(),t=Wa();document.body.classList.remove("reader-active"),document.removeEventListener("keydown",Ga),o.manga=null,o.chapter=null,o.versionUrl=null,o.images=[],o.loading=!0,o.singlePageMode=!1,o.isStreamingMode=!1,o._resumeScrollToPage=null,o._preloadCache=null,await Ye(e),await Ue(t)}function Vt(e){return!!e&&(e.mode!==void 0||e.direction!==void 0||e.firstPageSingle!==void 0||e.lastPageSingle!==void 0)}function Ss(e){e&&(e.mode&&(o.mode=e.mode),e.direction&&(o.direction=e.direction),e.firstPageSingle!==void 0&&(o.firstPageSingle=e.firstPageSingle),e.lastPageSingle!==void 0&&(o.lastPageSingle=e.lastPageSingle))}function Wa(){return!o.manga||!o.chapter||o.isCollectionMode||o.isStreamingMode?null:{mangaId:o.manga.id,chapterNumber:o.chapter.number,settings:{mode:o.mode,direction:o.direction,firstPageSingle:o.firstPageSingle,lastPageSingle:o.lastPageSingle}}}async function Ue(e=Wa()){if(!(!e||X.isDemo))try{await f.updateChapterSettings(e.mangaId,e.chapterNumber,e.settings)}catch(t){console.error("Failed to save settings:",t)}}async function Ka(e){try{const t=await f.getBookmark(e),s=t.downloadedChapters||[],a=new Set(t.readChapters||[]),n=t.readingProgress||{},r=t.downloadedVersions||{},i=[...s].sort((l,d)=>l-d);let c=null;for(const l of i){const d=n[l];if(d&&d.page<d.totalPages&&!a.has(l)){c=l;break}}if(c===null){for(const l of i)if(!a.has(l)){c=l;break}}if(c===null&&i.length>0&&(c=i[0]),c!==null){const l=r[c]||[],d=Array.isArray(l)?l[0]:l,p=d?`?version=${encodeURIComponent(d)}`:"";H.go(`/read/${e}/${c}${p}`)}else h("No downloaded chapters to read","info")}catch(t){h("Failed to continue reading: "+t.message,"error")}}const lo={mount:oo,unmount:io,render:Qe,continueReading:Ka},Ya="torrent-search-modal",co=3e3;let ra=0,_t=null;function Ie(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function kt(e){if(!e)return"";const t=["B","KB","MB","GB","TB"];let s=0,a=e;for(;a>=1024&&s<t.length-1;)a/=1024,s++;return`${a<10&&s>0?a.toFixed(1):Math.round(a)} ${t[s]}`}function uo(e){if(!e)return"";const t=Math.floor((Date.now()-new Date(e).getTime())/864e5);return t<1?"today":t<30?`${t}d`:t<365?`${Math.floor(t/30)}mo`:`${Math.floor(t/365)}y`}function po(e){return e?e.volume!==null&&e.volume!==void 0?e.volumeEnd?`Vol. ${e.volume}–${e.volumeEnd}`:`Vol. ${e.volume}`:e.chapter!==null&&e.chapter!==void 0?e.chapterEnd?`Ch. ${e.chapter}–${e.chapterEnd}`:`Ch. ${e.chapter}`:"":""}function ho(e){switch(e.status){case"grabbing":return{kind:"pending",text:"Fetching the release for qBittorrent…"};case"downloading":{const t=Math.round((e.progress||0)*100);return{kind:"ok",text:`Downloading in qBittorrent${t?` · ${t}%`:""} · progress on the Queue page`,done:!0}}case"completed":return{kind:"ok",text:"Downloaded, waiting for import",done:!0};case"importing":return{kind:"ok",text:"Importing into the library…",done:!0};case"imported":return{kind:"ok",text:"Imported",done:!0};case"failed":return{kind:"error",text:`Failed: ${e.error||"unknown error"}`,done:!0,retry:!0};case"removed":return{kind:"error",text:"Removed from qBittorrent",done:!0,retry:!0};default:return{kind:"pending",text:e.status}}}function Pt(){var e;(e=document.getElementById(Ya))==null||e.remove(),document.removeEventListener("keydown",Ja),_t&&(_t(),_t=null)}function Ja(e){e.key==="Escape"&&Pt()}async function Xa({query:e="",bookmarkId:t=null,bookmarkTitle:s="",library:a=null,onGrabbed:n}={}){const r=++ra;Pt();let i;try{i=await f.getTorrentStatus()}catch{i={prowlarr:!1,qbittorrent:!1}}if(r!==ra)return;if(!i.prowlarr||!i.qbittorrent){h("Set up Prowlarr and qBittorrent under Settings > Torrents first","info");return}const c=document.createElement("div");c.id=Ya,c.className="modal open torrent-modal";const l=t?`<div class="torrent-target">Releases go to <strong>${Ie(s)}</strong> and are imported as volumes when they finish.</div>`:`<div class="torrent-target">
             <label>Add to
               <select id="torrent-target-select">
                 <option value="">New series (named after the release)</option>
                 ${(a||[]).map(b=>`<option value="${Ie(b.id)}">${Ie(b.alias||b.title)}</option>`).join("")}
               </select>
             </label>
           </div>`;c.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${m("download")} Find volume releases</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body">
                <form class="torrent-search-form" id="torrent-search-form">
                    <input type="text" id="torrent-query" value="${Ie(e)}" placeholder="Title to search the indexers for" autocomplete="off">
                    <button type="submit" class="btn btn-primary">Search</button>
                </form>
                ${l}
                <div class="torrent-results" id="torrent-results"><div class="torrent-hint">Searches every indexer enabled in Prowlarr. Volume releases show their volume number when the name says it.</div></div>
            </div>
        </div>
    `,document.body.appendChild(c),document.addEventListener("keydown",Ja),c.querySelector(".modal-overlay").addEventListener("click",Pt),c.querySelector('[data-act="close"]').addEventListener("click",Pt);const d=c.querySelector("#torrent-results"),p=c.querySelector("#torrent-query");let u=[];const g=new Map;let $=null;const v=(b,M,_)=>{const O=d.querySelector(`.torrent-row-status[data-index="${b}"]`);O&&(O.className=`torrent-row-status ${M}`,O.textContent=_)},y=(b,M,_,O)=>{const V=d.querySelector(`.torrent-grab[data-index="${b}"]`);V&&(V.textContent=M,V.disabled=!_,V.classList.toggle("btn-primary",O),V.classList.toggle("btn-secondary",!O))},L=b=>{if(Array.isArray(b)){for(const[M,_]of g){let O=b.find(ee=>ee.hash===_.hash);if(O||(O=b.filter(ee=>ee.releaseTitle===_.title).sort((ee,G)=>String(G.addedAt||"").localeCompare(String(ee.addedAt||"")))[0]),!O)continue;_.hash=O.hash;const V=ho(O);v(M,V.kind,V.text),V.retry?y(M,"Grab again",!0,!0):V.done&&y(M,"Grabbed",!1,!1),V.done&&(_.done=!0)}[...g.values()].some(M=>!M.done)||k()}},w=b=>L(b==null?void 0:b.torrents),x=async()=>{try{const b=await f.getTorrentDownloads();L(b.torrents)}catch{}},T=()=>{$||($=setInterval(x,co))},k=()=>{$&&(clearInterval($),$=null)};se.on(oe.TORRENT_UPDATE,w),_t=()=>{se.off(oe.TORRENT_UPDATE,w),k()};const I=b=>{if(u=b,g.clear(),k(),b.length===0){d.innerHTML='<div class="torrent-hint">No releases found. Try a shorter title.</div>';return}d.innerHTML=`
            <table class="torrent-table">
                <thead><tr><th>Release</th><th>Vol.</th><th>Size</th><th>Seeds</th><th>Indexer</th><th>Age</th><th></th></tr></thead>
                <tbody>
                ${b.map((M,_)=>{var O;return`
                    <tr>
                        <td class="torrent-title" title="${Ie(M.title)}">
                            <div>${Ie(M.title)}${(O=M.parsed)!=null&&O.digital?' <span class="badge badge-downloaded">Digital</span>':""}${M.infoUrl?` <a href="${Ie(M.infoUrl)}" target="_blank" rel="noopener" class="torrent-info-link" title="Open on the indexer">${m("globe")}</a>`:""}</div>
                            <div class="torrent-row-status" data-index="${_}"></div>
                        </td>
                        <td>${Ie(po(M.parsed))}</td>
                        <td>${kt(M.size)}</td>
                        <td class="${(M.seeders??0)===0?"torrent-dead":""}">${M.seeders??"?"}</td>
                        <td>${Ie(M.indexer)}</td>
                        <td>${uo(M.publishDate)}</td>
                        <td>${M.hasDownload===!1?'<span class="text-muted" title="The indexer gave no download link">No link</span>':`<button class="btn btn-sm btn-primary torrent-grab" data-index="${_}">Grab</button>`}</td>
                    </tr>`}).join("")}
                </tbody>
            </table>`,d.querySelectorAll(".torrent-grab").forEach(M=>M.addEventListener("click",()=>E(parseInt(M.dataset.index,10),M)))},N=async()=>{const b=p.value.trim();if(b){d.innerHTML=`<div class="torrent-hint">${m("loader",{spin:!0})} Searching the indexers…</div>`;try{const M=await f.searchTorrents(b);I(M.results||[])}catch(M){d.innerHTML=`<div class="torrent-hint error">${Ie(M.message)}</div>`}}},E=async(b,M)=>{var ee,G;const _=u[b];if(!_)return;const O=c.querySelector("#torrent-target-select"),V=t||O&&O.value||null;M.disabled=!0,M.textContent="Sending…",v(b,"pending","Sending to qBittorrent…");try{const Z=await f.grabTorrent(_.id,{bookmarkId:V,newSeriesTitle:V?null:((ee=_.parsed)==null?void 0:ee.title)||null});g.set(b,{hash:(G=Z.torrent)==null?void 0:G.hash,title:_.title,done:!1}),y(b,"Grabbed",!1,!1),Z.torrent&&L([Z.torrent]),T(),typeof n=="function"&&n(Z.torrent)}catch(Z){y(b,"Grab again",!0,!0),v(b,"error",`Failed: ${Z.message}`)}};c.querySelector("#torrent-search-form").addEventListener("submit",b=>{b.preventDefault(),N()}),e?N():p.focus()}const Cs="chapter-pages-modal";function Fe(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function mo(e){try{const t=String(e).split("?")[0];return decodeURIComponent(t.slice(t.lastIndexOf("/")+1))}catch{return String(e).slice(String(e).lastIndexOf("/")+1)}}function ft(){var e;(e=document.getElementById(Cs))==null||e.remove(),document.removeEventListener("keydown",Za)}function Za(e){e.key==="Escape"&&ft()}function go({mangaId:e,num:t,title:s="",versions:a=[],versionUrl:n=null,onChanged:r}={}){var k,I,N,E;ft();const i=a.filter(b=>b.url);let c=n&&i.some(b=>b.url===n)?n:((k=i[0])==null?void 0:k.url)??null;const l=document.createElement("div");l.id=Cs,l.className="modal open chapter-pages-modal",l.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${m("images")} Chapter ${Fe(t)}${s?` · ${Fe(s)}`:""}</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="chapter-pages-toolbar">
                ${i.length>1?`<label class="chapter-pages-version">Version
                    <select id="cp-version">${i.map(b=>`<option value="${Fe(b.url)}" ${b.url===c?"selected":""}>${Fe(b.label||b.folder)} · ${b.imageCount} pages</option>`).join("")}</select>
                </label>`:`<span class="torrent-hint" id="cp-folder">${Fe(((I=i[0])==null?void 0:I.folder)||((N=a[0])==null?void 0:N.folder)||"")}</span>`}
                <span class="spacer"></span>
                <span class="torrent-hint" id="cp-count"></span>
                <button type="button" class="btn btn-sm btn-secondary" id="cp-read" title="Open in the reader">${m("play")} Read</button>
            </div>
            <div class="chapter-pages-hint">Rotate, cut a double page in two, swap two pages (pick one, then the other) or delete. Changes are made to the files on disk right away.</div>
            <div class="chapter-pages-body" id="cp-body"><div class="torrent-hint">${m("loader",{spin:!0})} Loading pages…</div></div>
        </div>
    `,document.body.appendChild(l),document.addEventListener("keydown",Za),l.querySelector(".modal-overlay").addEventListener("click",ft),l.querySelector('[data-act="close"]').addEventListener("click",ft);const d=l.querySelector("#cp-body"),p=l.querySelector("#cp-count");let u=[],g=null,$=!1,v=!1;const y=b=>{u=(b||[]).map(M=>typeof M=="string"?M:M==null?void 0:M.url).filter(Boolean)},L=()=>{if(p.textContent=`${u.length} page${u.length===1?"":"s"}`,u.length===0){d.innerHTML='<div class="torrent-hint">No pages on disk for this version.</div>';return}d.innerHTML=`<div class="chapter-pages-grid">${u.map((b,M)=>{const _=mo(b),O=g===_;return`
            <figure class="chapter-page ${O?"picked":""}" data-name="${Fe(_)}">
                <img src="${Fe(b)}${b.includes("?")?"&":"?"}t=${Date.now()}" alt="Page ${M+1}" loading="lazy" decoding="async">
                <figcaption>
                    <span class="chapter-page-num">${M+1}</span>
                    <span class="chapter-page-tools">
                        <button type="button" class="btn-icon small" data-tool="rotate" title="Rotate 90°">${m("rotate-cw")}</button>
                        <button type="button" class="btn-icon small" data-tool="split" title="Cut this page in two">${m("columns-2")}</button>
                        <button type="button" class="btn-icon small ${O?"success":""}" data-tool="swap" title="${O?"Cancel swap":g?"Swap with the picked page":"Swap: pick this page, then another"}">${m("arrow-left-right")}</button>
                        <button type="button" class="btn-icon small danger" data-tool="delete" title="Delete this page">${m("trash-2")}</button>
                    </span>
                </figcaption>
            </figure>`}).join("")}</div>`},w=async()=>{if(!c){d.innerHTML=`<div class="torrent-hint">${a.length?"This folder is not linked to a downloaded version, so its pages cannot be edited here. Use the versions list on the chapter row to delete it.":"This chapter has no pages on disk."}</div>`,p.textContent="";return}try{const b=await f.getReaderImages(e,t,c);y(b.images),L()}catch(b){d.innerHTML=`<div class="torrent-hint error">${Fe(b.message)}</div>`}},x=async(b,M)=>{if(!$){$=!0,d.classList.add("busy");try{const _=await M();v=!0,_&&Array.isArray(_.images)?(y(_.images),L()):await w()}catch(_){h(`${b} failed: ${_.message}`,"error")}finally{$=!1,d.classList.remove("busy")}}};d.addEventListener("click",async b=>{var V;const M=b.target.closest("[data-tool]");if(!M)return;const _=(V=M.closest(".chapter-page"))==null?void 0:V.dataset.name;if(!_)return;const O=M.dataset.tool;if(O==="rotate")return x("Rotate",()=>f.rotatePage(e,t,_,90,c));if(O==="split")return x("Split",()=>f.splitPage(e,t,_,c));if(O==="delete")return confirm(`Delete page "${_}" from disk?`)?x("Delete",()=>f.deletePage(e,t,_,c)):void 0;if(O==="swap"){if(g===_){g=null,L();return}if(!g){g=_,L();return}const ee=g;return g=null,x("Swap",()=>f.swapPages(e,t,ee,_,c))}}),(E=l.querySelector("#cp-version"))==null||E.addEventListener("change",b=>{c=b.target.value,g=null,w()}),l.querySelector("#cp-read").addEventListener("click",()=>{ft(),window.location.hash=`#/read/${e}/${t}${c?`?version=${encodeURIComponent(c)}`:""}`});const T=new MutationObserver(()=>{document.getElementById(Cs)||(T.disconnect(),v&&typeof r=="function"&&r())});T.observe(document.body,{childList:!0}),w()}const jt="import-review-modal";function ye(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function fo(e){const t=e.parsed||{};return t.volume!==null&&t.volume!==void 0?t.volumeEnd?`name says volumes ${t.volume}–${t.volumeEnd}`:`name says volume ${t.volume}`:t.chapter!==null&&t.chapter!==void 0?t.chapterEnd?`name says chapters ${t.chapter}–${t.chapterEnd}`:`name says chapter ${t.chapter}`:"no number in the name"}const oa=e=>new Promise(t=>setTimeout(t,e));async function vo(e,t){if(!e.importId)return e;for(;;){if(!document.getElementById(jt))return null;let s;try{s=await f.getImport(e.importId)}catch{await oa(2e3);continue}if(s.status==="done")return{bookmarkId:s.bookmarkId,summary:s.summary};if(s.status==="failed")throw new Error(s.error||"Import failed");const a=s.status==="queued"?"Queued behind other tasks…":`Importing ${Math.min(s.done+1,s.total||s.done+1)} of ${s.total||"?"}${s.current?`: ${ye(s.current)}`:""}`;t.innerHTML=`
            <div class="torrent-row-status">${m("loader",{spin:!0})} ${a}</div>
            <div class="torrent-hint">You can close this dialog; the import carries on and shows on the <a href="#/queue">Queue</a> page.</div>`,await oa(1500)}}function vt(){var e;(e=document.getElementById(jt))==null||e.remove(),document.removeEventListener("keydown",en)}function en(e){e.key==="Escape"&&vt()}async function tn(e,{onImported:t}={}){var y,L,w,x,T,k;const s=e,a=!e.hash;vt();const n=document.createElement("div");n.id=jt,n.className="modal open torrent-modal",n.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${m("list-checks")} Review import</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body" id="review-body"><div class="torrent-hint">${m("loader",{spin:!0})} Reading the download…</div></div>
            <div class="modal-footer" id="review-footer" hidden></div>
        </div>
    `,document.body.appendChild(n),document.addEventListener("keydown",en),n.querySelector(".modal-overlay").addEventListener("click",vt),n.querySelector('[data-act="close"]').addEventListener("click",vt);const r=n.querySelector("#review-body"),i=n.querySelector("#review-footer");let c;try{c=a?await f.getFolderContents(e.path,e.bookmarkId||null):await f.getTorrentContents(s.hash)}catch(I){r.innerHTML=`<div class="torrent-hint error">${ye(I.message)}</div>`;return}if(!document.getElementById(jt))return;let l=[];if(!c.bookmarkId)try{const I=await f.getBookmarks();l=(I.bookmarks||I||[]).map(N=>({id:N.id,title:N.alias||N.title})).sort((N,E)=>N.title.localeCompare(E.title))}catch{}const d=c.items||[],p=new Map((((y=c.existing)==null?void 0:y.volumes)||[]).map(I=>[Number(I.number),I.name])),u=new Set((((L=c.existing)==null?void 0:L.chapters)||[]).map(Number));r.innerHTML=`
        <div class="torrent-target">
            <strong>${ye(c.releaseName||s.name)}</strong> · ${d.length} item${d.length===1?"":"s"}
            ${c.bookmarkId?` · into <strong>${ye(c.bookmarkTitle)}</strong>`:` · into <label>
                    <select id="review-target">
                        <option value="">New series “${ye(c.newSeriesTitle||s.name)}”</option>
                        ${l.map(I=>`<option value="${ye(I.id)}">${ye(I.title)}</option>`).join("")}
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
                        <div>${I.kind==="dir"?m("folder"):m("package")} ${ye(I.name)}</div>
                        <div class="torrent-row-status">${ye(fo(I))}</div>
                    </td>
                    <td>${I.kind==="dir"?`${I.pages??"?"} pages`:kt(I.size)}</td>
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
        ${(w=c.unsupported)!=null&&w.length?`<div class="torrent-hint">Cannot import: ${c.unsupported.map(ye).join(", ")} (only .cbz/.zip and image folders).</div>`:""}
        <div id="review-result"></div>
    `;const g=()=>[...r.querySelectorAll("tr[data-index]")],$=I=>({index:parseInt(I.dataset.index,10),picked:I.querySelector(".rv-pick").checked,as:I.querySelector(".rv-as").value,number:parseFloat(I.querySelector(".rv-num").value)}),v=()=>{const I=g().map($),N=new Map;for(const M of I){if(!M.picked||!Number.isFinite(M.number))continue;const _=`${M.as}:${M.number}`;N.set(_,(N.get(_)||0)+1)}let E=0;for(const M of g()){const _=$(M),O=M.querySelector(".rv-warn"),V=[];_.picked&&(E++,Number.isFinite(_.number)?(N.get(`${_.as}:${_.number}`)>1&&V.push(`same ${_.as} number as another file`),_.as==="volume"&&p.has(_.number)&&V.push(`replaces ${p.get(_.number)}`),_.as==="chapter"&&u.has(_.number)&&V.push(`replaces downloaded chapter ${_.number}`)):V.push("needs a number")),O.textContent=V.join(" · "),M.classList.toggle("rv-skipped",!_.picked)}const b=i.querySelector("#review-import");b&&(b.disabled=E===0,b.textContent=`Import ${E} selected`)};r.addEventListener("change",v),r.addEventListener("input",v),(x=r.querySelector("#review-all"))==null||x.addEventListener("click",()=>{g().forEach(I=>{I.querySelector(".rv-pick").checked=!0}),v()}),(T=r.querySelector("#review-none"))==null||T.addEventListener("click",()=>{g().forEach(I=>{I.querySelector(".rv-pick").checked=!1}),v()}),i.hidden=!1,i.innerHTML=`
        <span class="torrent-hint">Existing volumes with the same number are replaced.</span>
        <span class="spacer"></span>
        <button type="button" class="btn btn-secondary" data-act="close">Cancel</button>
        ${d.length?'<button type="button" class="btn btn-primary" id="review-import">Import</button>':""}
    `,i.querySelector('[data-act="close"]').addEventListener("click",vt),v(),(k=i.querySelector("#review-import"))==null||k.addEventListener("click",async()=>{var _,O,V,ee;const I=i.querySelector("#review-import"),N=g().map($),E=N.map(G=>({path:d[G.index].path,as:G.picked?G.as:"skip",number:G.number})),b=N.filter(G=>G.picked);if(b.length===0)return;if(b.some(G=>!Number.isFinite(G.number))){h("Every selected item needs a number","error");return}const M=c.bookmarkId||((_=r.querySelector("#review-target"))==null?void 0:_.value)||null;I.disabled=!0,I.textContent="Importing…",r.querySelectorAll("input, select, button").forEach(G=>{G.disabled=!0});try{const G=a?await f.importFolder({path:e.path,bookmarkId:M,newSeriesTitle:c.newSeriesTitle||e.name,selection:E}):await f.importTorrent(s.hash,M,E);I.textContent="Importing…",i.querySelector('[data-act="close"]').textContent="Close";const Z=await vo(G,r.querySelector("#review-result"));if(!Z)return;const U=((O=Z.summary)==null?void 0:O.volumes)||[],C=((V=Z.summary)==null?void 0:V.chapters)||[],A=((ee=Z.summary)==null?void 0:ee.skipped)||[];r.querySelector("#review-result").innerHTML=`
                <div class="torrent-row-status ok">${m("check")} Imported ${U.length} volume${U.length===1?"":"s"}${U.length?` (${U.map(R=>ye(R.name)).join(", ")})`:""}${C.length?` and ${C.length} chapter${C.length===1?"":"s"}`:""}.</div>
                ${A.length?`<ul class="task-error-list">${A.map(R=>`<li>${ye(R)}</li>`).join("")}</ul>`:""}
                <a href="#/manga/${ye(Z.bookmarkId)}" class="btn btn-sm btn-secondary">Open the series</a>
            `,I.textContent="Done",i.querySelector('[data-act="close"]').textContent="Close",typeof t=="function"&&t(Z)}catch(G){r.querySelectorAll("input, select, button").forEach(Z=>{Z.disabled=!1}),r.querySelector("#review-result").innerHTML=`<div class="torrent-row-status error">Import failed: ${ye(G.message)}</div>`,I.disabled=!1,v()}})}const sn="folder-import-modal";function Pe(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function yt(){var e;(e=document.getElementById(sn))==null||e.remove(),document.removeEventListener("keydown",an)}function an(e){e.key==="Escape"&&yt()}function yo({bookmarkId:e=null,bookmarkTitle:t="",onImported:s}={}){yt();const a=document.createElement("div");a.id=sn,a.className="modal open torrent-modal folder-import-modal",a.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${m("folder")} Import from folder${t?` into ${Pe(t)}`:""}</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body">
                <p class="torrent-hint">Pick a release folder (or a single .cbz/.zip) that is already on disk. Only the torrent save path and the path mappings from Settings can be browsed. Nothing is downloaded and the source files are left as they are.</p>
                <div class="folder-crumbs" id="fi-crumbs"></div>
                <div class="folder-list" id="fi-list"><div class="torrent-hint">${m("loader",{spin:!0})} Loading…</div></div>
            </div>
            <div class="modal-footer">
                <span class="torrent-hint" id="fi-current"></span>
                <span class="spacer"></span>
                <button type="button" class="btn btn-secondary" data-act="close">Cancel</button>
                <button type="button" class="btn btn-primary" id="fi-import" disabled>Import this folder</button>
            </div>
        </div>
    `,document.body.appendChild(a),document.addEventListener("keydown",an),a.querySelector(".modal-overlay").addEventListener("click",yt),a.querySelectorAll('[data-act="close"]').forEach(u=>u.addEventListener("click",yt));const n=a.querySelector("#fi-crumbs"),r=a.querySelector("#fi-list"),i=a.querySelector("#fi-current"),c=a.querySelector("#fi-import");let l=null;const d=u=>{l=u,c.disabled=!u,c.textContent=(u==null?void 0:u.kind)==="archive"?"Import this archive":"Import this folder",i.textContent=u?u.path:"",r.querySelectorAll(".folder-entry").forEach(g=>g.classList.toggle("picked",!!u&&g.dataset.path===u.path))},p=async u=>{r.innerHTML=`<div class="torrent-hint">${m("loader",{spin:!0})} Loading…</div>`;let g;try{g=await f.browseImportFolders(u)}catch(v){r.innerHTML=`<div class="torrent-hint error">${Pe(v.message)}</div>`,n.innerHTML="",d(null);return}g.path,n.innerHTML=g.path?`<button type="button" class="btn btn-sm btn-secondary" data-go="">${m("hard-drive")} Roots</button>
               ${g.parent?`<button type="button" class="btn btn-sm btn-secondary" data-go="${Pe(g.parent)}">${m("chevron-left")} Up</button>`:""}
               <span class="folder-path" title="${Pe(g.path)}">${Pe(g.path)}</span>`:'<span class="folder-path">Folders this app may import from</span>',n.querySelectorAll("[data-go]").forEach(v=>v.addEventListener("click",()=>p(v.dataset.go||null)));const $=g.entries||[];r.innerHTML=$.length?$.map(v=>`
                <div class="folder-entry ${v.exists===!1?"missing":""}" data-path="${Pe(v.path)}" data-kind="${v.kind}" data-name="${Pe(v.name)}">
                    <span class="folder-entry-icon">${v.kind==="dir"?m("folder"):m("package")}</span>
                    <span class="folder-entry-name">${Pe(v.name)}${v.exists===!1?" <small>(not found on this machine)</small>":""}</span>
                    <span class="folder-entry-meta">${v.kind==="archive"?kt(v.size):""}</span>
                    ${v.kind==="dir"&&v.exists!==!1?`<button type="button" class="btn btn-sm btn-secondary" data-open="${Pe(v.path)}">Open</button>`:""}
                </div>`).join(""):'<div class="torrent-hint">Empty: no sub-folders and no .cbz/.zip files here.</div>',r.querySelectorAll("[data-open]").forEach(v=>v.addEventListener("click",y=>{y.stopPropagation(),p(v.dataset.open)})),r.querySelectorAll(".folder-entry").forEach(v=>{v.addEventListener("click",()=>{v.classList.contains("missing")||d({path:v.dataset.path,name:v.dataset.name,kind:v.dataset.kind})}),v.addEventListener("dblclick",()=>{v.dataset.kind==="dir"&&!v.classList.contains("missing")&&p(v.dataset.path)})}),d(g.path&&!g.roots.includes(g.path)?{path:g.path,name:g.path.split(/[\\/]/).pop(),kind:"dir"}:null)};c.addEventListener("click",()=>{if(!l)return;const u={path:l.path,name:l.name,bookmarkId:e,bookmarkTitle:t};yt(),tn(u,{onImported:s})}),p(null)}const nn="volume-manager-modal";function dt(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function xs(){var e;(e=document.getElementById(nn))==null||e.remove(),document.removeEventListener("keydown",rn)}function rn(e){e.key==="Escape"&&xs()}function bo(e){if(e.kind==="release")return`${e.source==="torrent"?"Torrent":"Archive"} release · ${e.pageCount||0} pages`;const t=(e.chapters||[]).length;return`Chapter collection · ${t} chapter${t===1?"":"s"}`}function wo(e,{onChanged:t}={}){xs();let s=[...e.volumes||[]],a=!1;const n=document.createElement("div");n.id=nn,n.className="modal open torrent-modal",n.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${m("settings")} Manage volumes</h2>
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
    `,document.body.appendChild(n),document.addEventListener("keydown",rn);const r=n.querySelector("#vm-body"),i=n.querySelector("#vm-delete"),c=n.querySelector("#vm-save"),l=()=>{xs(),a&&typeof t=="function"&&t()};n.querySelector(".modal-overlay").addEventListener("click",l),n.querySelectorAll('[data-act="close"]').forEach(w=>w.addEventListener("click",l));const d=()=>{var w,x;r.innerHTML=s.length===0?'<div class="torrent-hint">No volumes left.</div>':`
            <div class="review-tools">
                <button type="button" class="btn btn-sm btn-secondary" id="vm-all">Select all</button>
                <button type="button" class="btn btn-sm btn-secondary" id="vm-none">Select none</button>
                <span class="torrent-hint">Edit a name or number and press Save. Deleting a release volume removes its pages from disk.</span>
            </div>
            <table class="torrent-table volume-manager-table">
                <thead><tr><th></th><th></th><th>No.</th><th>Name</th><th>Kind</th><th>Order</th><th></th></tr></thead>
                <tbody>
                ${s.map((T,k)=>`
                    <tr data-id="${dt(T.id)}">
                        <td><input type="checkbox" class="vm-pick"></td>
                        <td>${T.cover?`<img class="vm-cover" src="${dt(T.cover)}" alt="">`:`<span class="vm-cover vm-cover-empty">${m("book")}</span>`}</td>
                        <td><input type="number" step="any" min="0" class="vm-number" value="${T.number??""}" placeholder="–"></td>
                        <td><input type="text" class="vm-name" value="${dt(T.name)}"></td>
                        <td class="vm-kind">${dt(bo(T))}</td>
                        <td class="vm-order">
                            <button type="button" class="btn-icon small vm-move" data-dir="up" title="Move up" ${k===0?"disabled":""}>${m("chevron-up")}</button>
                            <button type="button" class="btn-icon small vm-move" data-dir="down" title="Move down" ${k===s.length-1?"disabled":""}>${m("chevron-down")}</button>
                        </td>
                        <td><button type="button" class="btn-icon small danger vm-delete-one" title="Delete this volume">${m("trash-2")}</button></td>
                    </tr>`).join("")}
                </tbody>
            </table>
            <div id="vm-result"></div>`,(w=r.querySelector("#vm-all"))==null||w.addEventListener("click",()=>{r.querySelectorAll(".vm-pick").forEach(T=>{T.checked=!0}),$()}),(x=r.querySelector("#vm-none"))==null||x.addEventListener("click",()=>{r.querySelectorAll(".vm-pick").forEach(T=>{T.checked=!1}),$()}),r.querySelectorAll(".vm-move").forEach(T=>T.addEventListener("click",()=>y(T.closest("tr").dataset.id,T.dataset.dir))),r.querySelectorAll(".vm-delete-one").forEach(T=>T.addEventListener("click",()=>L([T.closest("tr").dataset.id]))),$()},p=()=>[...r.querySelectorAll("tr[data-id]")],u=()=>p().map(w=>{const x=s.find(E=>E.id===w.dataset.id),T=w.querySelector(".vm-name").value.trim(),k=w.querySelector(".vm-number").value,I=k===""?null:parseFloat(k),N={};return T&&T!==x.name&&(N.name=T),I!==null&&Number.isFinite(I)&&I!==x.number&&(N.number=I),{id:x.id,patch:N,tr:w}}).filter(w=>Object.keys(w.patch).length>0),g=()=>p().filter(w=>w.querySelector(".vm-pick").checked).map(w=>w.dataset.id),$=()=>{const w=g().length;i.disabled=w===0,i.textContent=w?`Delete ${w} selected`:"Delete selected";const x=u().length;c.disabled=x===0,c.textContent=x?`Save ${x} change${x===1?"":"s"}`:"Save changes"};r.addEventListener("input",$),r.addEventListener("change",$);const v=async()=>{const w=await f.getBookmark(e.id);s=[...(w.bookmark||w).volumes||[]],d()},y=async(w,x)=>{try{await f.reorderVolume(e.id,w,x),a=!0,await v()}catch(T){h(`Could not move: ${T.message}`,"error")}},L=async w=>{const x=s.filter(N=>w.includes(N.id));if(x.length===0)return;const T=x.filter(N=>N.kind==="release").length,k=x.length===1?`“${x[0].name}”`:`${x.length} volumes`,I=T?` ${T===x.length?x.length===1?"Its":"Their":`${T} of them are releases; their`} pages are removed from disk.`:"";if(confirm(`Delete ${k}?${I}`))try{const N=await f.bulkDeleteVolumes(e.id,w);a=!0,h(`Deleted ${N.deleted} volume${N.deleted===1?"":"s"}`,"success"),await v()}catch(N){h(`Delete failed: ${N.message}`,"error")}};i.addEventListener("click",()=>L(g())),c.addEventListener("click",async()=>{const w=u();if(w.length===0)return;c.disabled=!0,c.textContent="Saving…";const x=[];for(const T of w)try{await f.updateVolume(e.id,T.id,T.patch),a=!0}catch(k){const I=s.find(N=>N.id===T.id);x.push(`${(I==null?void 0:I.name)||T.id}: ${k.message}`)}if(x.length?h(x.join(" · "),"error"):h(`Saved ${w.length} change${w.length===1?"":"s"}`,"success"),await v(),x.length){const T=r.querySelector("#vm-result");T&&(T.innerHTML=`<ul class="task-error-list">${x.map(dt).map(k=>`<li>${k}</li>`).join("")}</ul>`)}}),d()}const wt=50;let S={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1,mergeMode:!1,mergeSelection:new Set,mergeTargetTouched:!1,mergeTitleTouched:!1,offlineChapters:new Set,isAutoOffline:!1,volumesCollapsed:!1};const on=e=>`volumes_collapsed_${e}`;function $o(e){var s;const t=localStorage.getItem(on(e==null?void 0:e.id));return t!==null?t==="1":(((s=e==null?void 0:e.volumes)==null?void 0:s.length)||0)>8}function ko(e){if(!(e.autoCheck===!0))return`<button class="btn btn-secondary" id="schedule-btn">${m("alarm-clock")} Schedule</button>`;const s=e.checkSchedule==="weekly"?`${(e.checkDay||"monday").charAt(0).toUpperCase()+(e.checkDay||"monday").slice(1)} ${e.checkTime||"06:00"}`:e.checkSchedule==="daily"?`Daily ${e.checkTime||"06:00"}`:"Every 6h";return`<button class="btn btn-primary" id="schedule-btn">${m("alarm-clock")} ${s}</button>`}function Eo(e){const t=e.autoCheck===!0,s=e.checkSchedule||"daily",a=e.checkDay||"monday",n=e.checkTime||"06:00",r=e.autoDownload||!1;return`
    <div class="modal" id="schedule-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${m("alarm-clock")} Auto-Check Schedule</h2>
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
  `}function Ls(){var N;if(S.loading)return`
      ${fe()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const e=S.manga;if(!e)return`
      ${fe()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const t=e.alias||e.title,s=e.chapters||[],a=new Set(e.downloadedChapters||[]),n=new Set(e.readChapters||[]),r=new Set(s.map(E=>E.number)).size,i=new Set(e.excludedChapters||[]),c=new Set(e.deletedChapterUrls||[]),l=e.volumes||[],d=new Set;l.forEach(E=>{(E.chapters||[]).forEach(b=>d.add(b))});let p;S.filter==="hidden"?p=s.filter(E=>i.has(E.number)||c.has(E.url)):p=s.filter(E=>!i.has(E.number)&&!c.has(E.url));const u=p.filter(E=>!d.has(E.number));let g=[];if(S.activeVolume){const E=new Set(S.activeVolume.chapters||[]);g=p.filter(b=>E.has(b.number))}else g=u;const $=new Map;g.forEach(E=>{$.has(E.number)||$.set(E.number,[]),$.get(E.number).push(E)});let v=Array.from($.entries()).sort((E,b)=>E[0]-b[0]);S.filter==="downloaded"?v=v.filter(([E])=>a.has(E)):S.filter==="not-downloaded"?v=v.filter(([E])=>!a.has(E)):S.filter==="main"?v=v.filter(([E])=>Number.isInteger(E)):S.filter==="extra"&&(v=v.filter(([E])=>!Number.isInteger(E)));const y=Math.max(1,Math.ceil(v.length/wt));S.currentPage>=y&&(S.currentPage=Math.max(0,y-1));const L=S.currentPage*wt,x=[...v.slice(L,L+wt)].reverse(),T=$.size,k=[...$.keys()].filter(E=>a.has(E)).length;n.size;let I="";if(S.activeVolume){const E=S.activeVolume;let b=null;E.local_cover?b=`/api/public/covers/${e.id}/${encodeURIComponent(E.local_cover.split(/[/\\]/).pop())}`:E.cover&&(b=E.cover),I=`
      ${fe()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${b?`<img src="${b}" alt="${E.name}">`:we("book")}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${e.id}" class="text-muted" style="text-decoration:none;">← ${t}</a>
              </div>
              <h1>${Ge(E.name)}</h1>
              <div class="manga-detail-meta">
                ${E.kind==="release"?`<span class="meta-item">${E.source==="torrent"?"Torrent":"Archive"} release · ${E.pageCount} pages</span>${E.releaseName?`<span class="meta-item text-muted" title="${st(E.releaseName)}">${Ge(E.releaseName)}</span>`:""}`:""}
                <span class="meta-item">${T} Chapters</span>
                ${k>0?`<span class="meta-item downloaded">${k} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 ${E.kind==="release"?`<button class="btn btn-primary" id="read-volume-btn" data-vol-id="${E.id}">${m("play")} Read volume</button>`:""}
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${e.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${S.manageChapters?"Done Managing":`${m("plus")} Add Chapters`}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${E.id}">${m("pencil")} Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const E=e.localCover?`/api/public/covers/${e.id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover;I=`
        ${fe()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${E?`<img src="${E}" alt="${t}">`:we("book")}
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
                    ${e.artists.map(b=>`<a href="#//" class="artist-link" data-artist="${b}">${b}</a>`).join(", ")}
                  `:""}
                  ${(e.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(e.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${e.categories.map(b=>`<span class="tag">${b}</span>`).join("")}
                  `:""}
                </div>
                `:""}
                <div class="manga-detail-actions">
                  <button class="btn btn-primary" id="continue-btn">
                    ${m("play")} ${e.lastReadChapter?"Continue":"Start"} Reading
                  </button>
              <button class="btn btn-secondary" id="download-all-btn">
                ${m("download")} Download All
              </button>
              <button class="btn btn-secondary" id="refresh-btn">${m("refresh-cw")} Refresh</button>
              ${e.website!=="Local"?`<button class="btn btn-secondary" id="quick-check-btn">${m("zap")} Quick Check</button>`:""}
              ${e.website==="Local"?`<button class="btn btn-secondary" id="scan-folder-btn">${m("folder")} Scan Folder</button>`:""}
              <button class="btn btn-secondary " id="auto-offline-btn" title="Auto-save new chapters offline for reading without internet">
                ${m("wifi-off")} Auto-Offline
              </button>
              <button class="btn btn-secondary" id="edit-btn">${m("pencil")} Edit</button>
              ${X.canDownload?`<button class="btn btn-secondary" id="find-volumes-btn" title="Search the torrent indexers for volume releases of this title">${m("package")} Find volumes</button>`:""}
              ${X.canDownload?`<button class="btn btn-secondary" id="import-folder-btn" title="Import a release that is already on disk (torrent folder), without downloading it again">${m("folder")} Import from folder</button>`:""}
              <button class="btn btn-secondary" id="anilist-track-btn" style="display:none;">${m("link")} Track</button>
              ${(e.volumes||[]).length===0?'<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>':""}
              ${ko(e)}
            </div>
            ${e.description?`<p class="manga-description">${e.description}</p>`:""}
            ${S.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">${m("package")} CBZ Files (${S.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${S.cbzFiles.map(b=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${b.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${b.chapterNumber?`Chapter ${b.chapterNumber}`:"Unknown chapter"}
                        ${b.isExtracted?` | ${m("check")} Extracted`:""}
                      </div>
                    </div>
                    <button class="btn btn-small ${b.isExtracted?"btn-secondary":"btn-primary"}" 
                            data-cbz-path="${encodeURIComponent(b.path)}" 
                            data-cbz-chapter="${b.chapterNumber||1}"
                            data-cbz-extracted="${b.isExtracted}">
                      ${b.isExtracted?"Re-Extract":"Extract"}
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
        
        ${S.activeVolume?S.manageChapters?Ao(e,u):"":_o(e,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${S.filter==="all"?"active":""}" data-filter="all">
                All (${$.size})
              </button>
              <button class="filter-btn ${S.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${k})
              </button>
              <button class="filter-btn ${S.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${S.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
              ${!S.activeVolume&&X.canEdit?`
              <button class="filter-btn merge-mode-btn ${S.mergeMode?"active":""}" id="merge-mode-btn" title="Combine downloaded chapters into one, e.g. 12.1 + 12.2 + 12.3 into chapter 12">
                ${m("link")} Combine
              </button>`:""}
            </div>
          </div>

          ${S.mergeMode?Mo(e):""}

          ${y>1?ia(y):""}
          
          <div class="chapter-list">
            ${x.map(([E,b])=>To(E,b,a,n,e)).join("")}
          </div>
          
          ${y>1?ia(y):""}
        </div>
      ${Io()}
    </div>
  `}function So(){const e=S.manga;if(!e)return"";const t=e.alias||e.title;return`
    <div class="modal" id="delete-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 420px;">
        <div class="modal-header">
          <h2>${m("trash-2")} Delete Manga</h2>
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
  `}function Co(){const e=S.manga;return e?`
    <div class="modal" id="migrate-source-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
          <h2>${m("refresh-cw")} Change Source</h2>
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
              <button class="btn btn-secondary" id="migrate-search-btn">${m("search")} Search</button>
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
  `:""}function xo(){const e=S.manga;return e?`
    <div class="modal" id="anilist-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h2>${m("link")} AniList Tracking</h2>
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
                <button class="btn btn-secondary" id="anilist-search-btn">${m("search")} Search</button>
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
  `:""}async function zt(){var s,a;const e=document.getElementById("anilist-track-btn"),t=S.manga;if(t)try{const n=await f.anilistStatus();if(!(n!=null&&n.configured)||!(n!=null&&n.connected)||((s=S.manga)==null?void 0:s.id)!==t.id){e&&(e.style.display="none");return}const{mapping:r}=await f.anilistGetMapping(t.id);if(((a=S.manga)==null?void 0:a.id)!==t.id)return;e&&(e.style.display="",e.style.borderColor=r?"var(--accent-primary)":"",e.innerHTML=r?`${m("check")} Tracked`:`${m("link")} Track`,e.title=r?`Linked to ${r.anilist_title}`:"Link this manga to AniList"),Lo(r,t)}catch(n){console.warn("Failed to load AniList state:",n),e&&(e.style.display="none")}}function Lo(e,t){var n,r,i;const s=document.getElementById("anilist-tracked-view"),a=document.getElementById("anilist-search-view");if(!(!s||!a)){if(!e){s.style.display="none",s.innerHTML="",a.style.display="";return}a.style.display="none",s.style.display="",s.innerHTML=`
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
  `,(n=document.getElementById("anilist-sync-toggle"))==null||n.addEventListener("change",async c=>{try{await f.anilistSetSyncEnabled(t.id,c.target.checked),h(c.target.checked?"AniList sync enabled":"AniList sync disabled","success")}catch(l){c.target.checked=!c.target.checked,h("Failed to update sync: "+l.message,"error")}}),(r=document.getElementById("anilist-relink-btn"))==null||r.addEventListener("click",()=>{s.style.display="none",a.style.display=""}),(i=document.getElementById("anilist-unlink-btn"))==null||i.addEventListener("click",async()=>{if(confirm(`Unlink "${e.anilist_title}" from AniList?`))try{await f.anilistUnmap(t.id),h("Unlinked from AniList","success"),zt()}catch(c){h("Failed to unlink: "+c.message,"error")}})}}function Io(){var t,s;const e=S.manga;return`
    ${e?Eo(e):""}
    ${ai()}
    ${So()}
    ${Co()}
    ${xo()}

    <!-- Edit Manga Modal -->
    <div class="modal" id="edit-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${m("pencil")} Edit Manga</h2>
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
          <button class="btn btn-danger" id="delete-manga-btn" style="margin-right:auto;">${m("trash-2")} Delete</button>
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
  `}function ln(e,t){if(t.length===0)return"";const s=Math.min(...t),a=Math.floor(s);return!(e.chapters||[]).some(r=>r.number===a)||t.includes(a)?a:s}function Mo(e){const t=[...S.mergeSelection].sort((a,n)=>a-n),s=ln(e,t);return`
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
  `}function To(e,t,s,a,n){var C,A,R,D,F,W,Y,ne;const r=s.has(e),i=a.has(e),c=!Number.isInteger(e),l=((C=n.mergedChapters)==null?void 0:C[e])||null,d=((A=n.downloadedVersions)==null?void 0:A[e])||[],p=new Set(n.deletedChapterUrls||[]),u=t.filter(P=>S.filter==="hidden"?!0:!p.has(P.url)),g=!!S.activeVolume,$=n.chapterSettings||{},v=g?!0:!!((R=$[e])!=null&&R.locked);let y=u;if(g||v){const P=u.filter(z=>Array.isArray(d)?d.includes(z.url):d===z.url);y=P.length>0?P:u}y.sort((P,z)=>{const J=Array.isArray(d)?d.includes(P.url):d===P.url;return((Array.isArray(d)?d.includes(z.url):d===z.url)?1:0)-(J?1:0)});const L=((D=n.chapterFolders)==null?void 0:D[e])||[],w=L.filter(P=>!P.url),x=L.reduce((P,z)=>Math.max(P,z.imageCount),0),T=P=>P.imageCount<3||x>=6&&P.imageCount<x/2,k=P=>L.find(z=>z.url===P)||null,I=L.filter(P=>P.url&&T(P)),N=y.length>1||w.length>0,E=(F=y[0])!=null&&F.url?encodeURIComponent(y[0].url):null,b=["chapter-item",r?"downloaded":"",i?"read":"",c?"extra":""].filter(Boolean).join(" "),M=Array.isArray(d)?d:d?[d]:[],_=M.length,O=k((W=y[0])==null?void 0:W.url)||L.find(P=>P.url)||L[0]||null,V=O?O.imageCount:((Y=n.downloadedPageCounts)==null?void 0:Y[e])??null,ee=r&&V!==null?`<button class="chapter-pages-pill ${O&&T(O)?"warn":""}" data-action="pages" data-num="${e}" ${O!=null&&O.url?`data-url="${encodeURIComponent(O.url)}"`:""} title="${V} pages - view and edit them">${m("images")} ${V}</button>`:"",G=N?`
    <div class="versions-dropdown hidden" id="versions-${e}">
      ${y.map(P=>{const z=encodeURIComponent(P.url),J=M.includes(P.url),ae=P.url.startsWith("local://"),he=P.title&&P.title!==`Chapter ${e}`?P.title:"",Ne=he||P.releaseGroup||"Version",it=[he&&P.releaseGroup?P.releaseGroup:"",Bo(P.uploadedAt)].filter(Boolean).join(" · ");return`
          <div class="version-row ${J?"downloaded":""}"
               data-version-url="${z}" data-num="${e}">
            <span class="version-title" style="cursor: pointer; flex: 1;" title="${st(P.url)}">${Ge(Ne)}${ae?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}${it?`<span class="version-meta">${Ge(it)}</span>`:""}${(()=>{const Ve=J?k(P.url):null;if(!Ve)return"";const lt=T(Ve);return`<span class="version-meta version-pages ${lt?"warn":""}" title="${st(Ve.folder)}">${Ve.imageCount} pages${lt?" - incomplete?":""}</span>`})()}</span>
            <div class="version-actions">
              ${J?`<button class="btn-icon small success" data-action="read-version" data-num="${e}" data-url="${z}">${m("play",{title:"Read"})}</button>
                   ${_>1?`<button class="btn-icon small" data-action="keep-version" data-num="${e}" data-url="${z}" title="Keep only this version (delete the other ${_-1})">${m("check",{title:"Keep only this version"})}</button>`:""}
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${e}" data-url="${z}">${m("trash-2",{title:"Delete version"})}</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${e}" data-url="${z}">${m("download",{title:"Download"})}</button>`}
              ${p.has(P.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${e}" data-url="${z}" title="Restore Version">${m("undo-2",{title:"Restore version"})}</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${e}" data-url="${z}" title="Hide Version">${m("eye-off",{title:"Hide version"})}</button>`}
            </div>
          </div>
        `}).join("")}
      ${w.map(P=>`
          <div class="version-row orphan" data-num="${e}">
            <span class="version-title" title="${st(P.folder)}">Leftover folder on disk<span class="version-meta">${Ge(P.folder)} · ${P.imageCount} pages</span></span>
            <div class="version-actions">
              <button class="btn-icon small danger" data-action="delete-folder" data-num="${e}" data-folder="${encodeURIComponent(P.folder)}">${m("trash-2",{title:"Delete this folder from disk"})}</button>
            </div>
          </div>`).join("")}
    </div>
  `:"",Z=(n.excludedChapters||[]).includes(e),U=S.mergeMode&&r&&!Z&&!l;return`
    <div class="chapter-group" data-chapter="${e}">
      <div class="${b}" data-num="${e}" style="${Z?"opacity: 0.7":""}">
        ${S.mergeMode?`<input type="checkbox" class="merge-pick" data-num="${e}" ${S.mergeSelection.has(e)?"checked":""} ${U?"":"disabled"} title="${U?"Combine this chapter":l?"Already a combined chapter":"Only downloaded chapters can be combined"}">`:""}
        <span class="chapter-number">Ch. ${e}</span>
        <span class="chapter-title">
          ${y[0]?y[0].title!==`Chapter ${e}`?y[0].title:"":t[0].title}
          ${Z?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
          ${I.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="A downloaded version of this chapter has only ${I[0].imageCount} pages">${I[0].imageCount} pages</span>`:""}
          ${w.length?`<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em" title="${w.length} folder(s) on disk not linked to any downloaded version - open the versions list to delete">${w.length} leftover folder${w.length>1?"s":""}</span>`:""}
        </span>
        ${l?`<span class="chapter-tag merged" title="Combined from ${l.sources.map(P=>`Ch. ${P}`).join(", ")}">Combined</span>`:c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${ee}
          ${l&&!Z?`<button class="btn-icon small" data-action="split-chapter" data-num="${e}" title="Split back into ${l.sources.map(P=>`Ch. ${P}`).join(", ")}">${m("scissors",{title:"Split"})}</button>`:""}
          ${Z?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${e}" title="Restore Chapter">${m("undo-2",{title:"Restore chapter"})}</button>`:g?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${S.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${e}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${v?"locked":""}"
                        data-action="lock" data-num="${e}"
                        title="${v?"Unlock":"Lock"}">
                  ${v?m("lock",{title:"Locked"}):m("lock-open",{title:"Unlocked"})}
                </button>`}
          ${!Z&&E?p.has((ne=y[0])==null?void 0:ne.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${e}" data-url="${E}" title="Unhide Chapter">${m("undo-2",{title:"Unhide chapter"})}</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${e}" data-url="${E}" title="Hide Chapter">${m("eye-off",{title:"Hide chapter"})}</button>`:""}
          <button class="btn-icon small ${i?"success":"muted"}"
                  data-action="read" data-num="${e}"
                  title="${i?"Mark unread":"Mark read"}">
            ${i?m("eye",{title:"Read"}):m("circle",{title:"Unread"})}
          </button>
          ${r?`<button class="btn-icon small danger" data-action="delete-chapter" data-num="${e}" data-url="${E}" title="Delete Files">${m("trash-2",{title:"Delete files"})}</button>
         <button class="btn-icon small ${S.offlineChapters.has(e)?"success":""}" data-action="offline-save" data-num="${e}" title="${S.offlineChapters.has(e)?"Remove offline copy":"Save for offline reading"}">
           ${S.offlineChapters.has(e)?m("wifi-off",{title:"Available offline"}):m("hard-drive",{title:"Save offline"})}
         </button>`:`<button class="btn-icon small ${r?"success":""}"
              data-action="download" data-num="${e}"
              title="${r?"Downloaded":"Download"}">
          ${r?m("check",{title:"Downloaded"}):m("download",{title:"Download"})}
        </button>`}
          ${N?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${e}" title="${u.length} versions, ${_} downloaded">
              ${_>1?`${_}/`:""}${u.length} ${m("chevron-down")}
            </button>
          `:""}
        </div>
      </div>
      ${G}
    </div>
  `}function Bo(e){if(!e)return"";const t=new Date(e);return isNaN(t.getTime())?String(e).slice(0,10):t.toISOString().slice(0,10)}function Ge(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function st(e){return Ge(e).replace(/"/g,"&quot;")}function ia(e){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${S.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${S.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${S.currentPage+1} of ${e}</span>
      <button class="btn btn-icon" data-page="next" ${S.currentPage>=e-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${S.currentPage>=e-1?"disabled":""}>»</button>
    </div>
  `}function Ao(e,t){return t.length===0?`
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
  `}function _o(e,t){var i;const s=e.volumes||[];if(s.length===0)return"";const a=s.map(c=>{const l=c.chapters||[],d=l.filter(u=>t.has(u)).length,p=c.kind==="release";return`
      <div class="volume-card${p?" volume-release":""}" data-volume-id="${c.id}" title="${p?st(`Volume release · ${c.pageCount} pages${c.releaseName?` · ${c.releaseName}`:""}`):`${l.length} chapters`}">
        <div class="volume-cover">
          ${c.cover?`<img src="${c.cover}" alt="${st(c.name)}">`:we("book")}
          <div class="volume-badges">
            ${p?`<span class="badge badge-release">${c.pageCount} pages</span>${l.length?`<span class="badge badge-chapters">${l.length} ch</span>`:""}`:`<span class="badge badge-chapters">${l.length} ch</span>${d>0?`<span class="badge badge-downloaded">${d}</span>`:""}`}
          </div>
          ${p?`<button class="volume-read-btn" data-read-volume="${c.id}" title="Read this volume">${m("play",{title:"Read"})}</button>`:""}
        </div>
        <div class="volume-info">
          <div class="volume-name">${Ge(c.name)}</div>
          <div class="volume-kind">${p?`${c.source==="torrent"?"Torrent":"Archive"} release`:"Chapter collection"}</div>
        </div>
      </div>
    `}).join(""),n=S.volumesCollapsed,r=s.reduce((c,l)=>c+(l.chapters||[]).filter(d=>t.has(d)).length,0);return`
    <div class="volumes-section${n?" collapsed":""}">
      <div class="volumes-header">
        <button class="volumes-toggle" id="volumes-toggle-btn"
                aria-expanded="${!n}" aria-controls="volumes-grid"
                title="${n?"Expand volumes":"Collapse volumes"}">
          ${m(n?"chevron-down":"chevron-up")}
          <h2>Volumes</h2>
          <span class="volumes-count">${s.length}</span>
          ${n&&r>0?`<span class="badge badge-downloaded">${r} downloaded</span>`:""}
        </button>
        <div class="volumes-actions">
          <button class="btn btn-secondary btn-icon volumes-action-btn" id="manage-volumes-btn"
                  title="Manage volumes: rename, renumber, reorder or delete" aria-label="Manage volumes">${m("settings")}</button>
          <button class="btn btn-secondary btn-icon volumes-action-btn volumes-add-btn" id="add-volume-btn"
                  title="Add a volume" aria-label="Add volume">${m("circle-plus")}</button>
        </div>
      </div>
      <div class="volumes-grid" id="volumes-grid">
        ${a||(((i=e.chapters)==null?void 0:i.length)>0?'<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>':"")}
      </div>
    </div>
  `}function Po(){var n,r,i,c,l,d,p,u,g,$,v,y,L,w,x,T,k,I,N,E,b,M,_,O,V,ee,G,Z,U;const e=document.getElementById("app"),t=S.manga;if(!t)return;(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>H.go("/")),(r=document.getElementById("back-library-btn"))==null||r.addEventListener("click",()=>H.go("/")),e.querySelectorAll(".artist-link").forEach(C=>{C.addEventListener("click",async A=>{A.preventDefault();const R=C.dataset.artist;if(!R)return;localStorage.setItem("library_search",R),localStorage.removeItem("library_artist_filter");let D=null;try{const F=t.website;if(F&&F!=="Local"){const Y=(window._scrapersList||(window._scrapersList=(await f.get("/scrapers/list")).scrapers)||[]).find(ne=>ne.name===F);Y&&Y.supportsBrowse&&(D=F)}}catch{}D?(localStorage.setItem("library_search_author",R),localStorage.setItem("library_search_author_source",D)):(localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source")),H.go("/")})}),(i=document.getElementById("continue-btn"))==null||i.addEventListener("click",()=>{Ka(t.id)}),(c=document.getElementById("download-all-btn"))==null||c.addEventListener("click",()=>{const C=document.getElementById("download-all-modal");C&&C.classList.add("open")}),(l=document.getElementById("confirm-download-all-btn"))==null||l.addEventListener("click",async()=>{var C;try{h("Queueing downloads...","info");const A=document.getElementsByName("download-version-mode");let R="single";for(const F of A)F.checked&&(R=F.value);(C=document.getElementById("download-all-modal"))==null||C.classList.remove("open");const D=await f.post(`/bookmarks/${t.id}/download`,{all:!0,versionMode:R});D.chaptersCount>0?h(`Download queued: ${D.chaptersCount} versions`,"success"):h("Already have these chapters downloaded","info")}catch(A){h("Failed to download: "+A.message,"error")}}),(d=document.getElementById("check-updates-btn"))==null||d.addEventListener("click",async()=>{try{h("Checking for updates...","info"),await f.post(`/bookmarks/${t.id}/quick-check`),h("Check complete!","success")}catch(C){h("Check failed: "+C.message,"error")}}),(p=document.getElementById("schedule-btn"))==null||p.addEventListener("click",()=>{const C=document.getElementById("schedule-modal");C&&C.classList.add("open")}),(u=document.getElementById("schedule-type"))==null||u.addEventListener("change",C=>{const A=document.getElementById("schedule-day-group");A&&(A.style.display=C.target.value==="weekly"?"":"none")}),(g=document.getElementById("save-schedule-btn"))==null||g.addEventListener("click",async()=>{var C;try{const A=document.getElementById("schedule-type").value,R=document.getElementById("schedule-day").value,D=document.getElementById("schedule-time").value,F=document.getElementById("auto-download-toggle").checked;await f.updateAutoCheckSchedule(t.id,{enabled:!0,schedule:A,day:R,time:D,autoDownload:F}),S.manga.checkSchedule=A,S.manga.checkDay=R,S.manga.checkTime=D,S.manga.autoDownload=F,(C=document.getElementById("schedule-modal"))==null||C.classList.remove("open"),Q([t.id]),h("Schedule updated","success")}catch(A){h("Failed to save schedule: "+A.message,"error")}}),($=document.getElementById("disable-schedule-btn"))==null||$.addEventListener("click",async()=>{var C;try{await f.toggleAutoCheck(t.id,!1),S.manga.autoCheck=!1,S.manga.checkSchedule=null,S.manga.checkDay=null,S.manga.checkTime=null,S.manga.nextCheck=null,(C=document.getElementById("schedule-modal"))==null||C.classList.remove("open"),Q([t.id]),h("Auto-check disabled","success")}catch(A){h("Failed to disable: "+A.message,"error")}}),(v=document.getElementById("refresh-btn"))==null||v.addEventListener("click",async()=>{const C=document.getElementById("refresh-btn");try{C.disabled=!0,C.innerHTML=`${m("loader",{spin:!0})} Checking...`,h("Checking for updates...","info"),await f.post(`/bookmarks/${t.id}/check`),await te(t.id),Q([t.id]),h("Check complete!","success")}catch(A){h("Check failed: "+A.message,"error"),C&&(C.disabled=!1,C.innerHTML=`${m("refresh-cw")} Refresh`)}}),(y=document.getElementById("scan-folder-btn"))==null||y.addEventListener("click",async()=>{var A,R;const C=document.getElementById("scan-folder-btn");try{C.disabled=!0,C.innerHTML=`${m("loader",{spin:!0})} Scanning...`,h("Scanning folder...","info");const D=await f.scanBookmark(t.id);await te(t.id),Q([t.id]);const F=((A=D.addedChapters)==null?void 0:A.length)||0,W=((R=D.removedChapters)==null?void 0:R.length)||0;F>0||W>0?h(`Scan complete: ${F} added, ${W} removed`,"success"):h("Scan complete: No changes","info")}catch(D){h("Scan failed: "+D.message,"error")}finally{C&&(C.disabled=!1,C.innerHTML=`${m("folder")} Scan Folder`)}}),document.querySelectorAll("[data-cbz-path]").forEach(C=>{C.addEventListener("click",async()=>{const A=decodeURIComponent(C.dataset.cbzPath),R=parseInt(C.dataset.cbzChapter)||1,D=C.dataset.cbzExtracted==="true",F=prompt("Enter chapter number for extraction:",String(R));if(!F)return;const W=parseFloat(F);if(isNaN(W)){h("Invalid chapter number","error");return}try{C.disabled=!0,C.textContent="Extracting...",h("Extracting CBZ...","info"),await f.extractCbz(t.id,A,W,{forceReExtract:D}),h("CBZ extracted successfully!","success"),await te(t.id),Q([t.id])}catch(Y){h("Extract failed: "+Y.message,"error")}finally{C.disabled=!1,C.textContent=D?"Re-Extract":"Extract"}})}),(L=document.getElementById("edit-btn"))==null||L.addEventListener("click",async()=>{const C=document.getElementById("edit-manga-modal");if(C){document.getElementById("edit-alias-input").value=t.alias||"",window._selectedCoverPath=null;try{const[A,R]=await Promise.all([f.getAllArtists(),f.getAllCategories()]),D=document.getElementById("artist-list"),F=document.getElementById("category-list");window._allArtists=A,window._allCategories=R,D&&(D.innerHTML=A.map(ne=>`<option value="${ne}">`).join("")),F&&(F.innerHTML=R.map(ne=>`<option value="${ne}">`).join(""));const W=document.getElementById("edit-artist-input"),Y=document.getElementById("edit-categories-input");W==null||W.addEventListener("input",()=>{const ne=W.value.toLowerCase(),P=W.value.lastIndexOf(","),z=W.value.substring(P+1).trim().toLowerCase();if(z.length>0&&window._allArtists){const J=window._allArtists.filter(ae=>ae.toLowerCase().includes(z));if(D&&J.length>0){const ae=P>=0?W.value.substring(0,P+1)+" ":"";D.innerHTML=J.map(he=>`<option value="${ae}${he}">`).join("")}}}),Y==null||Y.addEventListener("input",()=>{const ne=Y.value.lastIndexOf(","),P=Y.value.substring(ne+1).trim().toLowerCase();if(P.length>0&&window._allCategories){const z=window._allCategories.filter(J=>J.toLowerCase().includes(P));if(F&&z.length>0){const J=ne>=0?Y.value.substring(0,ne+1)+" ":"";F.innerHTML=z.map(ae=>`<option value="${J}${ae}">`).join("")}}})}catch(A){console.error("Failed to load artists/categories:",A)}C.classList.add("open")}}),(w=document.getElementById("save-manga-btn"))==null||w.addEventListener("click",async()=>{var C;try{const A=document.getElementById("edit-alias-input").value.trim(),R=document.getElementById("edit-artist-input").value.trim(),D=document.getElementById("edit-categories-input").value.trim(),F=R?R.split(",").map(Y=>Y.trim()).filter(Y=>Y):[],W=D?D.split(",").map(Y=>Y.trim()).filter(Y=>Y):[];await f.updateBookmark(t.id,{alias:A||null}),await f.setBookmarkArtists(t.id,F),await f.setBookmarkCategories(t.id,W),window._selectedCoverPath&&await f.setBookmarkCoverFromImage(t.id,window._selectedCoverPath),S.manga.alias=A||null,S.manga.artists=F,S.manga.categories=W,(C=document.getElementById("edit-manga-modal"))==null||C.classList.remove("open"),Q([t.id]),h("Manga updated","success")}catch(A){h("Failed to update: "+A.message,"error")}}),(x=document.getElementById("change-cover-btn"))==null||x.addEventListener("click",async()=>{try{h("Loading images...","info");const C=await f.getFolderImages(t.id);if(C.length===0){h("No images found in manga folder","warning");return}const A=document.createElement("div");A.id="cover-select-modal",A.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",A.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${C.slice(0,50).map(R=>`
              <div class="cover-option" data-path="${R.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(R.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${C.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${C.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(A),document.getElementById("close-cover-modal").addEventListener("click",()=>A.remove()),A.addEventListener("click",R=>{R.target===A&&A.remove()}),A.querySelectorAll(".cover-option").forEach(R=>{R.addEventListener("click",()=>{window._selectedCoverPath=R.dataset.path;const D=document.getElementById("cover-preview");D&&(D.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),A.remove(),h("Cover selected","success")})})}catch(C){h("Failed to load images: "+C.message,"error")}}),(T=document.getElementById("delete-manga-btn"))==null||T.addEventListener("click",()=>{const C=document.getElementById("delete-manga-modal");C&&C.classList.add("open")}),(k=document.getElementById("confirm-delete-manga-btn"))==null||k.addEventListener("click",async()=>{var A,R;const C=((A=document.getElementById("delete-files-toggle"))==null?void 0:A.checked)||!1;try{await f.deleteBookmark(t.id,C),(R=document.getElementById("delete-manga-modal"))==null||R.classList.remove("open"),h("Manga deleted","success"),H.go("/")}catch(D){h("Failed to delete: "+D.message,"error")}}),(I=document.getElementById("quick-check-btn"))==null||I.addEventListener("click",async()=>{const C=document.getElementById("quick-check-btn");try{C.disabled=!0,C.innerHTML=`${m("loader",{spin:!0})} Checking...`,h("Quick checking for updates...","info");const A=await f.post(`/bookmarks/${t.id}/quick-check`);await te(t.id),Q([t.id]),A.newChaptersCount>0?h(`Found ${A.newChaptersCount} new chapter(s)!`,"success"):h("No new chapters found","info")}catch(A){h("Quick check failed: "+A.message,"error")}finally{C&&(C.disabled=!1,C.innerHTML=`${m("zap")} Quick Check`)}}),(N=document.getElementById("source-label"))==null||N.addEventListener("click",async()=>{const C=document.getElementById("migrate-source-modal");if(C){C.classList.add("open");const A=document.getElementById("migrate-search-scraper");if(A&&A.options.length<=1)try{const R=await f.get("/scrapers/list");if(R.success){const D=R.scrapers.filter(F=>F.supportsSearch);A.innerHTML='<option value="all">All Sources</option>'+D.map(F=>`<option value="${F.name}">${F.name}</option>`).join(""),A.value="all"}}catch(R){console.warn("Failed to load scrapers:",R)}}});const s=async()=>{var W,Y,ne;const C=(Y=(W=document.getElementById("migrate-search-input"))==null?void 0:W.value)==null?void 0:Y.trim(),A=(ne=document.getElementById("migrate-search-scraper"))==null?void 0:ne.value;if(!C)return;const R=document.getElementById("migrate-search-loading"),D=document.getElementById("migrate-search-results"),F=document.getElementById("migrate-results-grid");R.style.display="block",D.style.display="none";try{const z=(await f.get(`/scrapers/search?q=${encodeURIComponent(C)}&scraper=${encodeURIComponent(A)}`)).results||[];z.length===0?F.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(F.innerHTML=z.map(J=>{var he;const ae=(he=J.cover)!=null&&he.startsWith("/covers/")?J.cover:J.cover?`/api/scrapers/proxy-cover?url=${encodeURIComponent(J.cover)}`:"";return`
            <div class="manga-card migrate-result-card" data-url="${J.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${ae?Re(ae,"Cover",{kind:"series",self:!0}):we("series")}
                ${J.chapterCount?`<div class="manga-card-badges"><span class="badge badge-chapters">${J.chapterCount} ch</span></div>`:""}
              </div>
              <div class="manga-card-title" title="${J.title}" style="font-size: 0.8rem; padding: 4px;">${J.title}</div>
            </div>
          `}).join(""),F.querySelectorAll(".migrate-result-card").forEach(J=>{J.addEventListener("click",()=>{var he;const ae=J.dataset.url;document.getElementById("migrate-url-input").value=ae,F.querySelectorAll(".migrate-result-card").forEach(Ne=>Ne.style.outline=""),J.style.outline="2px solid var(--color-primary)",h(`Selected: ${(he=J.querySelector(".manga-card-title"))==null?void 0:he.textContent}`,"info")})})),R.style.display="none",D.style.display="block"}catch(P){R.style.display="none",h("Search failed: "+P.message,"error")}};(E=document.getElementById("migrate-search-btn"))==null||E.addEventListener("click",s),(b=document.getElementById("migrate-search-input"))==null||b.addEventListener("keydown",C=>{C.key==="Enter"&&s()}),(M=document.getElementById("confirm-migrate-btn"))==null||M.addEventListener("click",async()=>{var R,D,F;const C=(D=(R=document.getElementById("migrate-url-input"))==null?void 0:R.value)==null?void 0:D.trim();if(!C){h("Please enter a URL","warning");return}const A=document.getElementById("confirm-migrate-btn");try{A.disabled=!0,A.textContent="Migrating...",h("Migrating source...","info");const W=await f.migrateSource(t.id,C);h(`Migrated! ${W.migratedChapters} chapters preserved as local`,"success"),h("Running full check on new source...","info"),await f.post(`/bookmarks/${t.id}/check`),(F=document.getElementById("migrate-source-modal"))==null||F.classList.remove("open"),await te(t.id),Q([t.id]),h("Source migration complete!","success")}catch(W){h("Migration failed: "+W.message,"error")}finally{A&&(A.disabled=!1,A.textContent="Migrate Source")}}),(_=document.getElementById("anilist-track-btn"))==null||_.addEventListener("click",()=>{var C;(C=document.getElementById("anilist-modal"))==null||C.classList.add("open"),zt()});const a=async()=>{var F,W;const C=(W=(F=document.getElementById("anilist-search-input"))==null?void 0:F.value)==null?void 0:W.trim();if(!C)return;const A=document.getElementById("anilist-search-loading"),R=document.getElementById("anilist-search-results"),D=document.getElementById("anilist-results-list");A.style.display="block",R.style.display="none";try{const ne=(await f.anilistSearch(C)).results||[];ne.length===0?D.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(D.innerHTML=ne.map(P=>{var ae,he,Ne,it,Ve,lt,Ws;const z=((ae=P.title)==null?void 0:ae.romaji)||((he=P.title)==null?void 0:he.english)||((Ne=P.title)==null?void 0:Ne.native)||"Unknown",J=(it=P.title)!=null&&it.english&&P.title.english!==z?P.title.english:(Ve=P.title)!=null&&Ve.native&&P.title.native!==z?P.title.native:"";return`
            <div style="display: flex; gap: 10px; align-items: center; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 8px;">
              ${(lt=P.coverImage)!=null&&lt.medium?`<img src="${P.coverImage.medium}" alt="" style="width: 48px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">`:""}
              <div style="flex: 1; min-width: 0;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${z}"><strong>${z}</strong></div>
                <div class="text-muted" style="font-size: 0.8em;">
                  ${[J,P.format,(Ws=P.startDate)==null?void 0:Ws.year,`${P.chapters??"?"} ch`].filter(Boolean).join(" • ")}
                </div>
              </div>
              <button class="btn btn-small btn-primary anilist-link-result-btn" data-id="${P.id}" data-title="${z.replace(/"/g,"&quot;")}">Link</button>
            </div>
          `}).join(""),D.querySelectorAll(".anilist-link-result-btn").forEach(P=>{P.addEventListener("click",async()=>{var z,J;try{P.disabled=!0,P.textContent="Linking...";const ae=await f.anilistMap(t.id,Number(P.dataset.id)),he=((z=ae.mapping)==null?void 0:z.anilist_title)||P.dataset.title,Ne=(J=ae.pull)!=null&&J.markedUpTo?` — pulled progress up to ch. ${ae.pull.markedUpTo}`:"";h(`Linked to AniList: ${he}${Ne}`,"success"),zt()}catch(ae){P.disabled=!1,P.textContent="Link",h("Failed to link: "+ae.message,"error")}})})),A.style.display="none",R.style.display="block"}catch(Y){A.style.display="none",h("AniList search failed: "+Y.message,"error")}};(O=document.getElementById("anilist-search-btn"))==null||O.addEventListener("click",a),(V=document.getElementById("anilist-search-input"))==null||V.addEventListener("keydown",C=>{C.key==="Enter"&&a()}),e.querySelectorAll(".filter-btn[data-filter]").forEach(C=>{C.addEventListener("click",()=>{S.filter=C.dataset.filter,S.currentPage=0,Q([t.id])})}),Xo(e,t),e.querySelectorAll("[data-page]").forEach(C=>{C.addEventListener("click",()=>{const A=C.dataset.page,R=Math.ceil(S.manga.chapters.length/wt);switch(A){case"first":S.currentPage=0;break;case"prev":S.currentPage=Math.max(0,S.currentPage-1);break;case"next":S.currentPage=Math.min(R-1,S.currentPage+1);break;case"last":S.currentPage=R-1;break}Q([t.id])})}),e.querySelectorAll(".chapter-item").forEach(C=>{C.addEventListener("click",A=>{var F;if(A.target.closest(".chapter-actions"))return;const R=parseFloat(C.dataset.num);if((t.downloadedChapters||[]).includes(R)){const W=((F=t.downloadedVersions)==null?void 0:F[R])||[],Y=Array.isArray(W)?W[0]:W;Y?H.go(`/read/${t.id}/${R}?version=${encodeURIComponent(Y)}`):H.go(`/read/${t.id}/${R}`)}else h("Chapter not downloaded","info")})}),e.querySelectorAll("[data-action]").forEach(C=>{C.addEventListener("click",async A=>{var W;A.stopPropagation();const R=C.dataset.action,D=parseFloat(C.dataset.num),F=C.dataset.url?decodeURIComponent(C.dataset.url):null;switch(R){case"lock":await qo(D);break;case"read":await Fo(D);break;case"download":await Oo(D);break;case"versions":Uo(D);break;case"pages":{const Y=t.chapters.filter(P=>P.number===D),ne=P=>{const z=Y.find(ae=>ae.url===P);return z&&((z.title&&z.title!==`Chapter ${D}`?z.title:"")||z.releaseGroup)||null};go({mangaId:t.id,num:D,title:ne(F)||"",versions:(((W=t.chapterFolders)==null?void 0:W[D])||[]).map(P=>({...P,label:ne(P.url)})),versionUrl:F,onChanged:async()=>{await te(t.id),Q([t.id])}});break}case"read-version":H.go(`/read/${t.id}/${D}?version=${encodeURIComponent(F)}`);break;case"download-version":await jo(D,F);break;case"delete-version":await zo(D,F);break;case"keep-version":await Vo(D,F);break;case"delete-folder":await Ho(D,decodeURIComponent(C.dataset.folder||""));break;case"hide-version":await Qo(D,F);break;case"restore-version":await Go(D,F);break;case"restore-chapter":await Wo(D);break;case"delete-chapter":await Ko(D,F);break;case"hide-chapter":await Yo(D,F);break;case"unhide-chapter":await Jo(D,F);break;case"split-chapter":await ei(D);break}})}),e.querySelectorAll('[data-action="read"], [data-action="hide-chapter"], [data-action="delete-chapter"]').forEach(C=>{Do(C,()=>No(C.dataset.action,parseFloat(C.dataset.num)))}),e.querySelectorAll(".version-row .version-title").forEach(C=>{C.addEventListener("click",A=>{A.stopPropagation();const R=C.closest(".version-row"),D=parseFloat(R.dataset.num),F=R.dataset.versionUrl?decodeURIComponent(R.dataset.versionUrl):null;R.classList.contains("downloaded")&&F?H.go(`/read/${t.id}/${D}?version=${encodeURIComponent(F)}`):h("Version not downloaded yet","info")})}),e.querySelectorAll(".volume-card").forEach(C=>{C.addEventListener("click",()=>{const A=C.dataset.volumeId;H.go(`/manga/${t.id}/volume/${A}`)})}),e.querySelectorAll("[data-read-volume]").forEach(C=>{C.addEventListener("click",A=>{A.stopPropagation(),H.go(`/read/${t.id}/volume/${C.dataset.readVolume}`)})}),(ee=e.querySelector("#read-volume-btn"))==null||ee.addEventListener("click",C=>{H.go(`/read/${t.id}/volume/${C.currentTarget.dataset.volId}`)}),(G=e.querySelector("#import-folder-btn"))==null||G.addEventListener("click",()=>{yo({bookmarkId:t.id,bookmarkTitle:t.alias||t.title,onImported:async()=>{await te(t.id),Q([t.id])}})}),(Z=e.querySelector("#find-volumes-btn"))==null||Z.addEventListener("click",()=>{Xa({query:t.alias||t.title,bookmarkId:t.id,bookmarkTitle:t.alias||t.title})}),(U=e.querySelector("#manage-volumes-btn"))==null||U.addEventListener("click",()=>{wo(t,{onChanged:async()=>{await te(t.id),Q([t.id])}})}),ni(e),De(),se.subscribeToManga(t.id)}async function qo(e){var n;const t=S.manga,s=((n=t.chapterSettings)==null?void 0:n[e])||{},a=!s.locked;try{a?await f.lockChapter(t.id,e):await f.unlockChapter(t.id,e),t.chapterSettings||(t.chapterSettings={}),t.chapterSettings[e]={...s,locked:a},h(a?"Chapter locked":"Chapter unlocked","success"),Q([t.id])}catch(r){h("Failed: "+r.message,"error")}}const Ro=550;function Do(e,t){let s=null,a=!1;const n=()=>{clearTimeout(s),s=null,e.classList.remove("pressing")};e.addEventListener("pointerdown",r=>{r.button!==void 0&&r.button!==0||(a=!1,n(),e.classList.add("pressing"),s=setTimeout(()=>{a=!0,e.classList.remove("pressing"),t()},Ro))}),e.addEventListener("pointerup",n),e.addEventListener("pointerleave",n),e.addEventListener("pointercancel",n),e.addEventListener("contextmenu",r=>r.preventDefault()),e.addEventListener("click",r=>{a&&(a=!1,r.preventDefault(),r.stopImmediatePropagation())},!0)}async function No(e,t){const s=S.manga;if(!s||!Number.isFinite(t))return;const a=`chapter ${t}`,n=(r,i)=>`${r} ${i}${r===1?"":"s"}`;try{if(e==="read"){if(!confirm(`Mark every chapter up to ${a} as read?`))return;await f.markChaptersReadUpTo(s.id,t),h(`Marked read up to ${a}`,"success")}else if(e==="hide-chapter"){if(!confirm(`Hide every chapter up to ${a}? Their downloaded files are removed too. Locked chapters and chapters in a volume stay.`))return;const r=await f.bulkHideChapters(s.id,t);h(`Hid ${n(r.hidden,"chapter version")}${r.skipped?`, ${r.skipped} protected`:""}`,"success")}else if(e==="delete-chapter"){if(!confirm(`Delete the downloaded files of every chapter up to ${a}? Locked chapters stay.`))return;const r=confirm(`Also hide those chapters, up to ${a}?`),i=await f.bulkDeleteChapters(s.id,t,r);h(`Deleted ${n(i.deleted,"chapter")}${r?`, hid ${i.hidden}`:""}${i.skipped?`, ${i.skipped} skipped`:""}`,"success")}else return;await te(s.id),Q([s.id])}catch(r){h("Failed: "+r.message,"error")}}async function Fo(e){const t=S.manga,s=new Set(t.readChapters||[]),a=s.has(e);try{await f.post(`/bookmarks/${t.id}/chapters/${e}/read`,{isRead:!a}),a?s.delete(e):s.add(e),t.readChapters=[...s],h(a?"Marked unread":"Marked read","success"),Q([t.id])}catch(n){h("Failed: "+n.message,"error")}}async function Oo(e){const t=S.manga,s=new Set(t.deletedChapterUrls||[]),a=(t.chapters||[]).find(n=>n.number===e&&!s.has(n.url));try{h(`Downloading chapter ${e}...`,"info");let n;a?n=await f.post(`/bookmarks/${t.id}/download-version`,{chapterNumber:e,url:a.url}):n=await f.post(`/bookmarks/${t.id}/download`,{chapters:[e]}),h("Download queued!","success"),cn(n==null?void 0:n.taskId,`Chapter ${e}`)}catch(n){h("Failed: "+n.message,"error")}}function Uo(e){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${e}`&&s.classList.add("hidden")});const t=document.getElementById(`versions-${e}`);t&&t.classList.toggle("hidden")}async function Ho(e,t){const s=S.manga;if(t&&confirm(`Delete the folder "${t}" from disk?`))try{await f.deleteChapterFolder(s.id,e,t),h("Folder deleted","success"),await te(s.id),Q([s.id])}catch(a){h("Failed: "+a.message,"error")}}function cn(e,t){var r;if(!e)return;const s=(r=S.manga)==null?void 0:r.id,a=Date.now(),n=async()=>{var p,u;if(Date.now()-a>30*60*1e3)return;let i;try{i=await f.getDownloadProgress(e)}catch{return}if(!i)return;if(!["complete","error","cancelled"].includes(i.status)){setTimeout(n,3e3);return}const l=i.errors||[],d=(i.completedChapters||[]).length>0&&i.status!=="error";i.status==="cancelled"?h(`${t}: download cancelled`,"info"):d?l.length?h(`${t} downloaded with problems: ${l[0].error}`,"warning"):h(`${t} downloaded${i.pages?` (${i.pages} pages)`:""}`,"success"):h(`${t} failed: ${((p=l[0])==null?void 0:p.error)||"unknown error"}`,"error"),((u=S.manga)==null?void 0:u.id)===s&&window.location.hash.startsWith(`#/manga/${s}`)&&(await te(s),Q([s]))};setTimeout(n,3e3)}async function Vo(e,t){var c;const s=S.manga,a=((c=s.downloadedVersions)==null?void 0:c[e])||[],r=(Array.isArray(a)?a:[a]).filter(l=>l&&l!==t);if(r.length===0){h("This is the only downloaded version","info");return}if(!confirm(`Delete the other ${r.length} downloaded version${r.length>1?"s":""} of chapter ${e}?`))return;let i=0;for(const l of r)try{await f.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:l})})}catch(d){i++,h("Failed to delete a version: "+d.message,"error")}i===0&&h("Other versions deleted","success"),await te(s.id),Q([s.id])}async function jo(e,t){const s=S.manga;try{h("Downloading version...","info");const a=await f.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:e,url:t});h("Download queued!","success"),cn(a==null?void 0:a.taskId,`Chapter ${e}`)}catch(a){h("Failed: "+a.message,"error")}}async function zo(e,t){const s=S.manga;try{await f.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:t})}),h("Version deleted","success"),await te(s.id),Q([s.id])}catch(a){h("Failed: "+a.message,"error")}}async function Qo(e,t){const s=S.manga;try{await f.hideVersion(s.id,e,t),h("Version hidden","success"),await te(s.id),Q([s.id])}catch(a){h("Failed: "+a.message,"error")}}async function Go(e,t){const s=S.manga;try{await f.unhideVersion(s.id,e,t),h("Version restored","success"),await te(s.id),Q([s.id])}catch(a){h("Failed to restore version: "+a.message,"error")}}async function Wo(e){const t=S.manga;try{await f.unexcludeChapter(t.id,e),h("Chapter restored","success"),await te(t.id),Q([t.id])}catch(s){h("Failed to restore chapter: "+s.message,"error")}}async function Ko(e,t){const s=S.manga;if(confirm("Delete this chapter's files from disk?"))try{await f.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:e,url:t})}),h("Chapter files deleted","success"),await te(s.id),Q([s.id])}catch(a){h("Failed to delete: "+a.message,"error")}}async function Yo(e,t){const s=S.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await f.hideVersion(s.id,e,t),h("Chapter hidden","success"),await te(s.id),Q([s.id])}catch(a){h("Failed to hide chapter: "+a.message,"error")}}async function Jo(e,t){const s=S.manga;try{await f.unhideVersion(s.id,e,t),h("Chapter unhidden","success"),await te(s.id),Q([s.id])}catch(a){h("Failed to unhide chapter: "+a.message,"error")}}function Xo(e,t){var r,i;const s=e.querySelector("#merge-mode-btn");if(s&&s.addEventListener("click",()=>{S.mergeMode=!S.mergeMode,S.mergeSelection=new Set,S.mergeTargetTouched=!1,S.mergeTitleTouched=!1,Q([t.id])}),!S.mergeMode)return;e.querySelectorAll(".merge-pick").forEach(c=>{c.addEventListener("click",l=>l.stopPropagation()),c.addEventListener("change",l=>{l.stopPropagation();const d=parseFloat(c.dataset.num);c.checked?S.mergeSelection.add(d):S.mergeSelection.delete(d),Zo(t)})});const a=e.querySelector("#merge-target"),n=e.querySelector("#merge-title");a==null||a.addEventListener("input",()=>{S.mergeTargetTouched=!0,!S.mergeTitleTouched&&n&&(n.value=a.value!==""?`Chapter ${a.value}`:"")}),n==null||n.addEventListener("input",()=>{S.mergeTitleTouched=!0}),(r=e.querySelector("#merge-cancel"))==null||r.addEventListener("click",()=>{S.mergeMode=!1,S.mergeSelection=new Set,Q([t.id])}),(i=e.querySelector("#merge-submit"))==null||i.addEventListener("click",async()=>{var g;const c=[...S.mergeSelection].sort(($,v)=>$-v),l=parseFloat(a==null?void 0:a.value);if(c.length===0)return h("Tick the chapters to combine first","info");if(!Number.isFinite(l))return h("Give the combined chapter a number","error");const d=(n==null?void 0:n.value.trim())||`Chapter ${l}`,p=!!((g=e.querySelector("#merge-delete-sources"))!=null&&g.checked);if(p&&!confirm(`Remove the original folders of ${c.map($=>`Ch. ${$}`).join(", ")} after combining? Splitting later will need them downloaded again.`))return;const u=e.querySelector("#merge-submit");u.disabled=!0,u.textContent="Combining…";try{const $=await f.mergeChapters(t.id,{sources:c,target:l,title:d,deleteSources:p});h(`Chapter ${$.target}: ${$.pageCount} pages from ${c.length} chapter${c.length===1?"":"s"}`,"success"),S.mergeMode=!1,S.mergeSelection=new Set,await te(t.id),Q([t.id])}catch($){h("Combine failed: "+$.message,"error"),u.disabled=!1,u.textContent="Combine"}})}function Zo(e){const t=[...S.mergeSelection].sort((c,l)=>c-l),s=document.getElementById("merge-picked");s&&(s.textContent=t.length?`Picked in page order: ${t.map(c=>`Ch. ${c}`).join(", ")}`:"Tick the downloaded chapters to combine (pages follow chapter order).");const a=document.getElementById("merge-submit");a&&(a.disabled=t.length===0);const n=ln(e,t),r=document.getElementById("merge-target"),i=document.getElementById("merge-title");r&&!S.mergeTargetTouched&&(r.value=n),i&&!S.mergeTitleTouched&&(i.value=n!==""?`Chapter ${n}`:"")}async function ei(e){var r;const t=S.manga,s=(r=t==null?void 0:t.mergedChapters)==null?void 0:r[e];if(!s)return;const a=s.sources.map(i=>`Ch. ${i}`).join(", "),n=s.sources.includes(e)?` Chapter ${e}'s own pages were folded into the combined folder, so it will need downloading again.`:"";if(confirm(`Split chapter ${e} back into ${a}? The combined folder is deleted; the other originals come back as they are on disk.${n}`))try{await f.unmergeChapter(t.id,e),h(`Chapter ${e} split into ${a}`,"success"),await te(t.id),Q([t.id])}catch(i){h("Split failed: "+i.message,"error")}}async function te(e){try{const[t,s]=await Promise.all([f.getBookmark(e),X.isDemo?Promise.resolve([]):be.loadCategories()]);if(S.manga=t,S.categories=s,S.loading=!1,S.volumesCollapsed=$o(t),t.website==="Local")try{const r=await f.getCbzFiles(e);S.cbzFiles=r||[]}catch(r){console.error("Failed to load CBZ files:",r),S.cbzFiles=[]}else S.cbzFiles=[];const a=new Set((t.chapters||[]).map(r=>r.number)).size,n=Math.ceil(a/wt);S.currentPage=Math.max(0,n-1),S.activeVolumeId?S.activeVolume=(t.volumes||[]).find(r=>r.id===S.activeVolumeId):S.activeVolume=null}catch{h("Failed to load manga","error"),S.loading=!1}}async function Q(e=[]){const[t,s,a]=e;if(!t){H.go("/");return}S.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!S.manga||S.manga.id!==t?(S.loading=!0,S.manga=null,n.innerHTML=Ls(),await te(t)):S.activeVolumeId?S.activeVolume=(S.manga.volumes||[]).find(r=>r.id===S.activeVolumeId):S.activeVolume=null,n.innerHTML=Ls(),Po(),zt()}function ti(){S.manga&&se.unsubscribeFromManga(S.manga.id),S.manga=null,S.loading=!0}const si={mount:Q,unmount:ti,render:Ls};function ai(){return`
    <div class="modal" id="add-volume-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${m("package")} Add New Volume</h2>
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
  `}function ni(e){const t=S.manga;if(!t)return;const s=e.querySelector("#volumes-toggle-btn");s&&s.addEventListener("click",()=>{S.volumesCollapsed=!S.volumesCollapsed,localStorage.setItem(on(t.id),S.volumesCollapsed?"1":"0");const y=e.querySelector(".volumes-section");y==null||y.classList.toggle("collapsed",S.volumesCollapsed),s.setAttribute("aria-expanded",String(!S.volumesCollapsed)),s.title=S.volumesCollapsed?"Expand volumes":"Collapse volumes";const L=s.querySelector("svg");L&&(L.outerHTML=m(S.volumesCollapsed?"chevron-down":"chevron-up"))});const a=e.querySelector("#add-volume-btn"),n=e.querySelector("#add-volume-modal"),r=e.querySelector("#add-volume-submit-btn");a&&n&&a.addEventListener("click",()=>{n.classList.add("open"),e.querySelector("#add-volume-name-input").focus()}),n==null||n.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(y=>{y.addEventListener("click",()=>n.classList.remove("open"))}),r&&r.addEventListener("click",async()=>{const y=e.querySelector("#add-volume-name-input").value.trim();if(!y)return h("Please enter a volume name","error");try{r.disabled=!0,r.textContent="Creating...",await f.createVolume(t.id,y),h("Volume created successfully!","success"),n.classList.remove("open"),e.querySelector("#add-volume-name-input").value="",await te(t.id),Q([t.id])}catch(L){h("Failed to create volume: "+L.message,"error")}finally{r.disabled=!1,r.textContent="Create Volume"}});const i=e.querySelector("#manage-chapters-btn");i&&i.addEventListener("click",()=>{S.manageChapters=!S.manageChapters,Q([t.id,"volume",S.activeVolumeId])}),e.querySelectorAll(".add-to-vol-btn").forEach(y=>{y.addEventListener("click",async()=>{const L=parseFloat(y.dataset.num),w=S.activeVolume;if(w)try{y.disabled=!0,y.textContent="...";const x=w.chapters||[];if(x.includes(L))return;const T=[...x,L].sort((k,I)=>k-I);await f.updateVolumeChapters(t.id,w.id,T),h(`Chapter ${L} added to volume`,"success"),await te(t.id),Q([t.id,"volume",w.id])}catch(x){h("Failed to add chapter: "+x.message,"error"),y.disabled=!1,y.textContent="Add"}})}),e.querySelectorAll(".remove-from-vol-btn").forEach(y=>{y.addEventListener("click",async L=>{L.stopPropagation();const w=parseFloat(y.dataset.num),x=S.activeVolume;if(x)try{y.disabled=!0,y.textContent="...";const k=(x.chapters||[]).filter(I=>I!==w);await f.updateVolumeChapters(t.id,x.id,k),h(`Chapter ${w} removed from volume`,"success"),await te(t.id),Q([t.id,"volume",x.id])}catch(T){h("Failed to remove chapter: "+T.message,"error"),y.disabled=!1,y.textContent="×"}})});const c=e.querySelector("#edit-vol-btn"),l=e.querySelector("#edit-volume-modal");c&&l&&c.addEventListener("click",()=>{const y=c.dataset.volId,L=t.volumes.find(w=>w.id===y);L&&(e.querySelector("#volume-name-input").value=L.name,l.dataset.editingVolId=y,l.classList.add("open"))});const d=e.querySelector("#save-volume-btn");d&&d.addEventListener("click",async()=>{const y=l.dataset.editingVolId,L=e.querySelector("#volume-name-input").value.trim();if(!L)return h("Volume name cannot be empty","error");try{await f.renameVolume(t.id,y,L),h("Volume renamed","success"),l.classList.remove("open"),await te(t.id),Q([t.id,"volume",y])}catch(w){h(w.message,"error")}});const p=e.querySelector("#delete-volume-btn");p&&p.addEventListener("click",async()=>{var x;const y=(((x=S.manga)==null?void 0:x.volumes)||[]).find(T=>T.id===l.dataset.editingVolId),L=(y==null?void 0:y.kind)==="release"?`Delete "${y.name}"? Its ${y.pageCount||""} pages are removed from disk. Chapters assigned to it stay in the library.`:"Are you sure you want to delete this volume? Chapters will remain in the library.";if(!confirm(L))return;const w=l.dataset.editingVolId;try{await f.deleteVolume(t.id,w),h("Volume deleted","success"),l.classList.remove("open"),window.location.hash=`#/manga/${t.id}`}catch(T){h(T.message,"error")}});const u=e.querySelector("#vol-cover-upload-btn");if(u){let y=document.getElementById("vol-cover-input-hidden");y||(y=document.createElement("input"),y.type="file",y.id="vol-cover-input-hidden",y.accept="image/*",y.style.display="none",document.body.appendChild(y),y.addEventListener("change",async L=>{const w=L.target.files[0];if(!w)return;const x=y.dataset.mangaId,T=y.dataset.volId,k=document.getElementById("vol-cover-upload-btn");if(y.value="",!(!x||!T))try{k&&(k.disabled=!0,k.textContent="Uploading..."),await f.uploadVolumeCover(x,T,w),h("Cover uploaded","success"),await te(x),Q([x,"volume",T])}catch(I){h("Upload failed: "+I.message,"error")}finally{k&&(k.disabled=!1,k.innerHTML=`${m("upload")} Upload Image`)}})),u.addEventListener("click",()=>{y.dataset.mangaId=t.id,y.dataset.volId=l.dataset.editingVolId||"",y.click()})}const g=e.querySelector("#vol-cover-selector-btn"),$=e.querySelector("#cover-selector-modal");g&&$&&g.addEventListener("click",async()=>{const y=$.querySelector("#cover-chapter-select");y.innerHTML='<option value="">Select a chapter...</option>';const L=e.querySelector("#edit-volume-modal"),w=L?L.dataset.editingVolId:null;let x=[...t.chapters||[]];if(w){const k=t.volumes.find(I=>I.id===w);if(k&&k.chapters){const I=new Set(k.chapters);x=x.filter(N=>I.has(N.number))}}x.sort((k,I)=>k.number-I.number);const T=new Set;x.forEach(k=>{if(!T.has(k.number)){T.add(k.number);const I=document.createElement("option");I.value=k.number,I.textContent=`Chapter ${k.number}`,y.appendChild(I)}}),x.length>0&&(y.value=x[0].number,la(t.id,x[0].number)),$.classList.add("open")});const v=e.querySelector("#cover-chapter-select");v&&v.addEventListener("change",y=>{y.target.value&&la(t.id,y.target.value)}),e.querySelectorAll(".modal-close, .modal-close-btn").forEach(y=>{y.addEventListener("click",()=>{y.closest(".modal").classList.remove("open")})}),e.querySelectorAll(".modal-overlay").forEach(y=>{y.addEventListener("click",()=>{y.closest(".modal").classList.remove("open")})})}async function la(e,t){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await f.getChapterImages(e,t)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(r=>{const i=document.createElement("div");i.className="cover-grid-item",i.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",i.innerHTML=`<img src="${r}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,i.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=r.split("/").pop();ri(l,t,c)}),s.appendChild(i)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function ri(e,t,s){const a=S.manga,n=document.getElementById("edit-volume-modal"),r=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const i=n.dataset.editingVolId;if(!i)throw new Error("No volume selected");await f.setVolumeCoverFromChapter(a.id,i,t,e),h("Volume cover updated","success"),r.classList.remove("open"),n.classList.remove("open"),await te(a.id),Q([a.id,"volume",i])}else{await f.setMangaCoverFromChapter(a.id,t,e),h("Series cover updated","success"),r.classList.remove("open"),await te(a.id);const i=window.location.hash.replace("#","");S.activeVolumeId?Q([a.id,"volume",S.activeVolumeId]):Q([a.id])}}catch(i){h("Failed to set cover: "+i.message,"error")}}let Se={series:null,loading:!0};function rt(){if(Se.loading)return`
      ${fe("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const e=Se.series;if(!e)return`
      ${fe("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const t=e.alias||e.title,s=e.entries||[],a=s.reduce((r,i)=>r+(i.chapter_count||0),0);let n=null;if(s.length>0){const r=s[0];r.local_cover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.local_cover.split(/[/\\]/).pop())}`:r.localCover&&r.bookmark_id?n=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.localCover.split(/[/\\]/).pop())}`:r.cover&&(n=r.cover)}return`
    ${fe("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?Re(n,t,{kind:"series"}):we("series")}
          </div>
          <div class="series-detail-info">
            <h1>${t}</h1>
            <div class="series-detail-meta">
              <span class="meta-item">${s.length} Entries</span>
              <span class="meta-item">${a} Total Chapters</span>
            </div>
            <div class="series-detail-actions">
              <button class="btn btn-secondary" id="add-entry-btn">+ Add Entry</button>
              <button class="btn btn-secondary" id="edit-series-btn">${m("pencil")} Edit</button>
              <button class="btn btn-secondary" id="back-library-btn">← Library</button>
            </div>
          </div>
        </div>
        
        <div class="series-entries-section">
          <h2>Entries</h2>
          <div class="series-entries-grid">
            ${s.map((r,i)=>oi(r,i,s.length)).join("")}
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
  `}function oi(e,t,s){var r;const a=e.alias||e.title;let n=null;return e.local_cover?n=`/api/public/covers/${e.bookmark_id}/${encodeURIComponent(e.local_cover.split(/[/\\]/).pop())}`:e.localCover?n=`/api/public/covers/${e.bookmark_id}/${encodeURIComponent(e.localCover.split(/[/\\]/).pop())}`:e.cover&&(n=e.cover),`
    <div class="series-entry-card" data-id="${e.bookmark_id}" data-order="${e.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${t+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${e.bookmark_id}" ${t===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${e.bookmark_id}" ${t===s-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?Re(n,a,{kind:"book"}):we("book")}
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${e.chapter_count||0} ch</span>
          ${((r=e.downloadedChapters)==null?void 0:r.length)>0?`<span class="badge badge-downloaded">${e.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${e.bookmark_id}" data-entryid="${e.id}" title="Use as series cover">${m("image",{title:"Use as series cover"})}</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${a}</div>
      </div>
    </div>
  `}function Zt(){var l,d,p;const e=document.getElementById("app"),t=Se.series;(l=document.getElementById("back-btn"))==null||l.addEventListener("click",()=>H.go("/")),(d=document.getElementById("back-library-btn"))==null||d.addEventListener("click",()=>H.go("/")),e.querySelectorAll(".series-entry-card").forEach(u=>{u.addEventListener("click",g=>{if(g.target.closest("[data-action]"))return;const $=u.dataset.id;H.go(`/manga/${$}`)})}),e.querySelectorAll("[data-action]").forEach(u=>{u.addEventListener("click",async g=>{g.stopPropagation();const $=u.dataset.action,v=u.dataset.id;switch($){case"move-up":await ca(v,-1);break;case"move-down":await ca(v,1);break;case"set-cover":const y=u.dataset.entryid;await ii(y);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),r=document.getElementById("available-bookmarks-list"),i=document.getElementById("confirm-add-entry-btn");let c=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),r&&(r.innerHTML=""),a.classList.add("open");const u=await f.getAvailableBookmarksForSeries();c=u,u.length===0?(n&&(n.placeholder="No available manga found"),i.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),r&&(r.innerHTML=u.map(g=>`<option value="${(g.alias||g.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),i.disabled=!1)}catch{h("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),i.addEventListener("click",async()=>{const u=n?n.value:"",g=c.find(v=>(v.alias||v.title||"")===u);if(!g){h("Please select a valid manga from the list","warning");return}const $=g.id;try{i.disabled=!0,i.textContent="Adding...",await f.addSeriesEntry(t.id,$),h("Manga added to series","success"),a.classList.remove("open"),await es(t.id),e.innerHTML=rt(),Zt()}catch(v){h("Failed to add manga: "+v.message,"error")}finally{i.disabled=!1,i.textContent="Add to Series"}})),(p=document.getElementById("edit-series-btn"))==null||p.addEventListener("click",()=>{h("Edit series coming soon","info")})}async function ca(e,t){const s=Se.series;if(!s)return;const a=s.entries||[],n=a.findIndex(c=>c.bookmark_id===e);if(n===-1)return;const r=n+t;if(r<0||r>=a.length)return;const i=a.map(c=>c.bookmark_id);[i[n],i[r]]=[i[r],i[n]];try{await f.post(`/series/${s.id}/reorder`,{order:i}),h("Order updated","success"),await es(s.id);const c=document.getElementById("app");c.innerHTML=rt(),Zt()}catch(c){h("Failed to reorder: "+c.message,"error")}}async function ii(e){const t=Se.series;if(t)try{await f.setSeriesCover(t.id,e),h("Series cover updated","success"),await es(t.id);const s=document.getElementById("app");s.innerHTML=rt(),Zt()}catch(s){h("Failed to set cover: "+s.message,"error")}}async function es(e){try{const t=await f.get(`/series/${e}`);Se.series=t,Se.loading=!1}catch{h("Failed to load series","error"),Se.loading=!1}}async function li(e=[]){const[t]=e;if(!t){H.go("/");return}const s=document.getElementById("app");Se.loading=!0,Se.series=null,s.innerHTML=rt(),await es(t),s.innerHTML=rt(),Zt()}function ci(){Se.series=null,Se.loading=!0}const di={mount:li,unmount:ci,render:rt},ui={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};function Te(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function pi(){return`
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
                <button type="button" class="btn btn-secondary btn-sm" id="tor-add-mapping">${m("plus")} Add mapping</button>
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
    `}function hi(){return`
        <div class="settings-group" id="cleanup-group">
            <h2>Downloads folder</h2>
            <p class="settings-hint">Find folders on disk that nothing in the library refers to any more: chapter versions whose download was removed, volumes that were deleted, series folders left behind by a renamed alias, and unfinished imports. Scanning changes nothing; you choose what to delete.</p>
            <div class="settings-actions torrents-actions">
                <button type="button" class="btn btn-secondary" id="cleanup-scan">${m("search")} Scan for leftovers</button>
                <span class="torrents-test-result" id="cleanup-summary"></span>
            </div>
            <div id="cleanup-results"></div>
        </div>
    `}async function mi(){const e=p=>document.getElementById(p),t=e("cleanup-scan"),s=e("cleanup-summary"),a=e("cleanup-results");if(!t)return;const n=p=>{if(!p)return"0 B";const u=["B","KB","MB","GB","TB"];let g=0,$=p;for(;$>=1024&&g<u.length-1;)$/=1024,g++;return`${$.toFixed($>=100||g===0?0:1)} ${u[g]}`},r={series:"Series folder",chapter:"Chapter folder",volume:"Volume folder",temp:"Unfinished import"},i=()=>[...a.querySelectorAll(".cl-pick:checked")].map(p=>p.value),c=()=>{const p=a.querySelector("#cleanup-delete");if(!p)return;const u=i().length;p.disabled=u===0,p.textContent=u?`Delete ${u} selected`:"Delete selected"},l=p=>{if(!p.groups.length){a.innerHTML='<p class="settings-hint">Nothing left over. Every folder on disk is in use.</p>';return}a.innerHTML=`
            <div class="review-tools">
                <button type="button" class="btn btn-sm btn-secondary" id="cleanup-all">Select all</button>
                <button type="button" class="btn btn-sm btn-secondary" id="cleanup-none">Select none</button>
                <span class="spacer"></span>
                <button type="button" class="btn btn-sm btn-danger" id="cleanup-delete" disabled>Delete selected</button>
            </div>
            ${p.groups.map(u=>`
                <div class="cleanup-group">
                    <div class="cleanup-series">${m("book-open")} ${Te(u.series)}${u.bookmarkIds.length?"":" <small>(no series in the library)</small>"}</div>
                    ${u.items.map(g=>`
                        <label class="cleanup-item">
                            <input type="checkbox" class="cl-pick" value="${Te(g.path)}">
                            <span class="cleanup-kind">${r[g.kind]||g.kind}</span>
                            <span class="cleanup-name" title="${Te(g.path)}">${Te(g.name)}</span>
                            <span class="cleanup-note">${Te(g.note)}</span>
                            <span class="cleanup-size">${n(g.size)}</span>
                        </label>`).join("")}
                </div>`).join("")}
            <div id="cleanup-result"></div>
        `,a.querySelector("#cleanup-all").addEventListener("click",()=>{a.querySelectorAll(".cl-pick").forEach(u=>{u.checked=!0}),c()}),a.querySelector("#cleanup-none").addEventListener("click",()=>{a.querySelectorAll(".cl-pick").forEach(u=>{u.checked=!1}),c()}),a.addEventListener("change",c),a.querySelector("#cleanup-delete").addEventListener("click",async()=>{const u=i();if(!u.length)return;const g=p.groups.flatMap(v=>v.items).filter(v=>u.includes(v.path)).reduce((v,y)=>v+y.size,0);if(!confirm(`Delete ${u.length} folder${u.length===1?"":"s"} from disk (${n(g)})? This cannot be undone.`))return;const $=a.querySelector("#cleanup-delete");$.disabled=!0,$.textContent="Deleting…";try{const v=await f.removeDownloadLeftovers(u);h(`Deleted ${v.removed.length} folder${v.removed.length===1?"":"s"}, freed ${n(v.freed)}`,"success"),v.skipped.length&&(a.querySelector("#cleanup-result").innerHTML=`<ul class="task-error-list">${v.skipped.map(y=>`<li>${Te(y.path)}: ${Te(y.reason)}</li>`).join("")}</ul>`),await d()}catch(v){h(`Delete failed: ${v.message}`,"error"),c()}})},d=async()=>{t.disabled=!0,s.textContent="Scanning…";try{const p=await f.getDownloadLeftovers();s.textContent=p.totalItems?`${p.totalItems} leftover${p.totalItems===1?"":"s"}, ${n(p.totalSize)}`:"Nothing left over",l(p)}catch(p){s.textContent=`Scan failed: ${p.message}`}finally{t.disabled=!1}};t.addEventListener("click",d)}async function gi(){const e=l=>document.getElementById(l),t=e("tor-path-mappings");if(!t)return;const s=l=>{t.innerHTML=l.length?l.map((d,p)=>`
                <div class="tor-mapping" data-index="${p}">
                    <input type="text" class="tor-map-from" value="${Te(d.from)}" placeholder="qBittorrent path, e.g. /downloads">
                    <span class="tor-map-arrow">→</span>
                    <input type="text" class="tor-map-to" value="${Te(d.to)}" placeholder="path this app sees, e.g. /app/torrents">
                    <button type="button" class="btn-icon small danger tor-map-remove" title="Remove">×</button>
                </div>`).join(""):'<p class="settings-hint">No mappings.</p>',t.querySelectorAll(".tor-map-remove").forEach(d=>d.addEventListener("click",()=>{d.closest(".tor-mapping").remove(),t.querySelector(".tor-mapping")||s([])}))},a=()=>[...t.querySelectorAll(".tor-mapping")].map(l=>({from:l.querySelector(".tor-map-from").value.trim(),to:l.querySelector(".tor-map-to").value.trim()})),n=()=>a().filter(l=>l.from&&l.to),r=()=>({prowlarr:{baseUrl:e("tor-prowlarr-url").value.trim(),apiKey:e("tor-prowlarr-key").value},qbittorrent:{baseUrl:e("tor-qbt-url").value.trim(),username:e("tor-qbt-user").value.trim(),password:e("tor-qbt-pass").value,category:e("tor-qbt-category").value.trim()||"manga",savePath:e("tor-qbt-savepath").value.trim()},pathMappings:n(),autoImport:e("tor-auto-import").checked}),i=(l,d,p)=>{l.textContent=p,l.className=`torrents-test-result ${d?"ok":"error"}`};try{const{settings:l}=await f.getTorrentSettings();e("tor-prowlarr-url").value=l.prowlarr.baseUrl||"",e("tor-prowlarr-key").value=l.prowlarr.apiKey||"",e("tor-qbt-url").value=l.qbittorrent.baseUrl||"",e("tor-qbt-user").value=l.qbittorrent.username||"",e("tor-qbt-pass").value=l.qbittorrent.password||"",e("tor-qbt-category").value=l.qbittorrent.category||"manga",e("tor-qbt-savepath").value=l.qbittorrent.savePath||"",e("tor-auto-import").checked=l.autoImport!==!1,s(l.pathMappings||[])}catch(l){s([]),i(e("tor-save-result"),!1,`Could not load torrent settings: ${l.message}`)}e("tor-add-mapping").addEventListener("click",()=>s([...a(),{from:"",to:""}]));const c=async(l,d,p)=>{d.disabled=!0,p.textContent="Testing…",p.className="torrents-test-result";try{const{result:u}=await f.testTorrentService(l,r()[l]);l==="prowlarr"?i(p,!0,`Connected: ${u.appName} ${u.version}${u.indexers!==null?`, ${u.indexers} indexer${u.indexers===1?"":"s"} enabled`:""}`):i(p,!0,`Connected: qBittorrent ${u.version}${u.savePath?`, default save path ${u.savePath}`:""}`)}catch(u){i(p,!1,u.message)}finally{d.disabled=!1}};e("tor-test-prowlarr").addEventListener("click",l=>c("prowlarr",l.currentTarget,e("tor-prowlarr-result"))),e("tor-test-qbt").addEventListener("click",l=>c("qbittorrent",l.currentTarget,e("tor-qbt-result"))),e("tor-save").addEventListener("click",async l=>{const d=l.currentTarget;d.disabled=!0;try{const{settings:p}=await f.saveTorrentSettings(r());e("tor-prowlarr-key").value=p.prowlarr.apiKey||"",e("tor-qbt-pass").value=p.qbittorrent.password||"",i(e("tor-save-result"),!0,"Saved"),h("Torrent settings saved","success")}catch(p){i(e("tor-save-result"),!1,p.message)}finally{d.disabled=!1}})}const fi={mount:async e=>{const t=document.getElementById("app");t.innerHTML=`
            ${fe()}
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
                            <button id="slideshow-start" class="btn btn-primary">${m("images")} Start Slideshow</button>
                        </div>
                    </div>

                    ${X.isAdmin?pi():""}
                    ${X.isAdmin?hi():""}
                </div>
            </div>
        `;let s={};try{const w=await f.get("/settings")||{};s=w;const x=document.getElementById("settings-form"),T=document.getElementById("settings-loader");w.theme&&(document.getElementById("theme").value=w.theme),T.style.display="none",x.style.display="",x.addEventListener("submit",async k=>{k.preventDefault();const I=new FormData(x),N={};for(const[E,b]of I.entries())N[E]=b;try{await f.post("/settings/bulk",N),h("Settings saved successfully"),N.theme}catch(E){console.error(E),h("Failed to save settings","error")}})}catch(w){console.error(w),document.getElementById("settings-loader").textContent="Error loading settings"}window.location.hash.includes("anilist=connected")&&h("AniList connected");const a=document.getElementById("anilist-group"),n=document.getElementById("anilist-status"),r=document.getElementById("anilist-connect"),i=document.getElementById("anilist-sync"),c=document.getElementById("anilist-disconnect"),l=document.getElementById("anilist-sync-result"),d=async()=>{a.style.display="block";try{const w=await f.anilistStatus();w.configured?w.connected?(n.textContent=`Connected as ${w.anilistUsername||"AniList user"}.`,r.style.display="none",i.style.display="",c.style.display=""):(n.textContent="Not connected. Link your AniList account to sync reading progress.",r.style.display="",i.style.display="none",c.style.display="none"):(n.textContent="Not configured — set ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET in .env and restart the server.",r.style.display="none",i.style.display="none",c.style.display="none")}catch(w){console.error(w),n.textContent="Failed to load AniList status — is the server running the latest code?"}};r.addEventListener("click",async()=>{try{const{url:w}=await f.anilistAuthUrl();window.location.href=w}catch(w){h(w.message||"Failed to start AniList connection","error")}}),c.addEventListener("click",async()=>{try{await f.anilistDisconnect(),h("AniList disconnected"),d()}catch{h("Failed to disconnect","error")}}),i.addEventListener("click",async()=>{i.disabled=!0,n.textContent="Syncing from AniList…";try{const w=await f.anilistPull();w.updated.length===0?l.textContent="Everything already up to date.":l.innerHTML="<ul>"+w.updated.map(x=>`<li>${x.title} — marked read up to chapter ${x.markedUpTo}</li>`).join("")+"</ul>",h(`AniList sync: ${w.updated.length} manga updated`)}catch(w){l.textContent="",h(w.message||"AniList sync failed","error")}finally{i.disabled=!1,d()}}),d(),X.isAdmin&&gi(),X.isAdmin&&mi();const p={...ui,...s.slideshow||{}};p.disabledMangaIds=[...p.disabledMangaIds||[]];const u=document.getElementById("slideshow-interval"),g=document.getElementById("slideshow-shuffle"),$=document.getElementById("slideshow-lists"),v=document.getElementById("slideshow-trophies"),y=document.getElementById("slideshow-manga-list");u.value=String(p.intervalMs),u.value||(u.value="8000"),g.checked=!!p.shuffle,$.checked=!!p.includeLists,v.checked=!!p.includeTrophies;const L=async()=>{if(!X.isDemo)try{await f.post("/settings",{key:"slideshow",value:p})}catch(w){console.error(w),h("Failed to save slideshow settings","error")}};u.addEventListener("change",()=>{p.intervalMs=parseInt(u.value,10)||8e3,L()}),g.addEventListener("change",()=>{p.shuffle=g.checked,L()}),$.addEventListener("change",()=>{p.includeLists=$.checked,L()}),v.addEventListener("change",()=>{p.includeTrophies=v.checked,L()}),document.getElementById("slideshow-start").addEventListener("click",()=>{var w,x;(x=(w=document.documentElement).requestFullscreen)==null||x.call(w).catch(()=>{}),H.go("/slideshow")});try{const w=await f.getAllVolumes();if(w.length===0)y.innerHTML=`<p class="settings-hint">No manga with volumes yet — create volumes from a manga's page first.</p>`;else{const x=new Set(p.disabledMangaIds);y.innerHTML=w.map(T=>{const k=Te(T.alias||T.title),I=T.volumes.filter(b=>b.cover).length,N=T.localCover?`/api/public/covers/${T.id}/${encodeURIComponent(T.localCover.split(/[/\\]/).pop())}`:T.cover,E=I===0;return`
                        <label class="slideshow-manga-row${E?" no-covers":""}" title="${E?"No volume covers yet":k}">
                            <input type="checkbox" data-manga-id="${T.id}" ${!x.has(T.id)&&!E?"checked":""} ${E?"disabled":""}>
                            <span class="slideshow-manga-thumb">${N?Re(N,k,{kind:"book"}):we("book")}</span>
                            <span class="slideshow-manga-info">
                                <span class="slideshow-manga-name">${k}</span>
                                <span class="slideshow-manga-meta">${T.volumes.length} volume${T.volumes.length===1?"":"s"} · ${I} cover${I===1?"":"s"}</span>
                            </span>
                        </label>
                    `}).join(""),y.addEventListener("change",T=>{const k=T.target.closest("input[data-manga-id]");if(!k)return;const I=k.dataset.mangaId;k.checked?p.disabledMangaIds=p.disabledMangaIds.filter(N=>N!==I):p.disabledMangaIds.includes(I)||p.disabledMangaIds.push(I),L()})}}catch(w){console.error(w),y.innerHTML='<p class="settings-hint">Failed to load manga list.</p>'}}},vi={mount:async e=>{const t=document.getElementById("app");if(!X.isAdmin){t.innerHTML=`
                ${fe()}
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
        `,document.querySelectorAll(".admin-tab").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(a=>a.classList.remove("active")),s.classList.add("active"),document.querySelectorAll(".admin-section").forEach(a=>a.style.display="none"),document.getElementById(`admin-section-${s.dataset.section}`).style.display=""})}),await Promise.all([qt(),yi(),bi()])}};async function qt(){const e=document.getElementById("admin-section-users");try{const t=await f.listUsers();e.innerHTML=`
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
                                <td>${Is(s.username)}${s.id===((a=X.user)==null?void 0:a.id)?' <span class="badge">you</span>':""}</td>
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
        `,e.querySelectorAll("tr[data-user-id]").forEach(s=>{const a=Number(s.dataset.userId),n=async()=>{try{await f.updateUser(a,{role:s.querySelector(".user-role").value,canDownload:s.querySelector(".user-can-download").checked,canEdit:s.querySelector(".user-can-edit").checked}),h("User updated","success")}catch(r){h(r.message,"error"),qt()}};s.querySelector(".user-role").addEventListener("change",n),s.querySelector(".user-can-download").addEventListener("change",n),s.querySelector(".user-can-edit").addEventListener("change",n),s.querySelector(".user-reset-pw").addEventListener("click",async()=>{const r=prompt("New password for this user:");if(r)try{await f.updateUser(a,{password:r}),h("Password reset","success")}catch(i){h(i.message,"error")}}),s.querySelector(".user-delete").addEventListener("click",async()=>{if(confirm("Delete this user?"))try{await f.deleteUser(a),h("User deleted","success"),qt()}catch(r){h(r.message,"error")}})}),document.getElementById("add-user-form").addEventListener("submit",async s=>{s.preventDefault();try{await f.createUser({username:document.getElementById("new-username").value.trim(),password:document.getElementById("new-password").value,role:document.getElementById("new-role").value,canDownload:document.getElementById("new-can-download").checked,canEdit:document.getElementById("new-can-edit").checked}),h("User created","success"),qt()}catch(a){h(a.message,"error")}})}catch(t){console.error(t),e.innerHTML='<div class="error">Failed to load users</div>'}}async function yi(){const e=document.getElementById("admin-section-demo");try{const t=await f.getBookmarks();e.innerHTML=`
            <h2>Demo Content</h2>
            <p class="admin-demo-warning">
                Checked series are visible to <strong>anyone</strong> on the public demo page
                (<code>/demo.html</code>) — no login needed, covers included. Only downloaded
                chapters are readable there. Be deliberate about adult titles.
            </p>
            <input type="search" id="demo-filter" placeholder="Filter series..." class="admin-demo-filter">
            <ul class="admin-demo-list">
                ${t.map(s=>`
                    <li data-title="${Is((s.alias||s.title||"").toLowerCase())}">
                        <label>
                            <input type="checkbox" class="demo-toggle" data-id="${s.id}" ${s.isDemo?"checked":""}>
                            <span>${Is(s.alias||s.title)}</span>
                            <span class="badge">${s.downloadedCount||0} downloaded</span>
                        </label>
                    </li>
                `).join("")}
            </ul>
        `,e.querySelectorAll(".demo-toggle").forEach(s=>{s.addEventListener("change",async()=>{try{await f.toggleDemo(s.dataset.id,s.checked),h(s.checked?"Added to demo":"Removed from demo","success")}catch(a){s.checked=!s.checked,h(a.message,"error")}})}),document.getElementById("demo-filter").addEventListener("input",s=>{const a=s.target.value.toLowerCase();e.querySelectorAll(".admin-demo-list li").forEach(n=>{n.style.display=n.dataset.title.includes(a)?"":"none"})})}catch(t){console.error(t),e.innerHTML='<div class="error">Failed to load bookmarks</div>'}}function Is(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function bi(){try{const e=await f.get("/admin/tables"),t=document.getElementById("admin-sidebar");t.innerHTML=`
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
        `,t.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;Ms(n),t.querySelectorAll(".table-link").forEach(r=>r.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(e){console.error(e),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function Ms(e,t=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${e}...</div>`;try{const i=await f.get(`/admin/tables/${e}?page=${t}&limit=50`);if(!i.rows||i.rows.length===0){s.innerHTML=`
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
                                ${c.map(d=>{const p=l[d];let u=p;return p===null?u='<span class="null">NULL</span>':typeof p=="object"?u=JSON.stringify(p):String(p).length>100&&(u=String(p).substring(0,100)+"..."),`<td>${u}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>Ms(e,t-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>Ms(e,t+1))}catch(r){console.error(r),s.innerHTML=`<div class="error">Failed to load data for ${e}</div>`}}let ue={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function wi(e,t){let s=null;if(t.length>0){const n=t[0];if(n.imagePaths&&n.imagePaths.length>0){const r=n.imagePaths[0];let i;typeof r=="string"?i=r:r&&typeof r=="object"&&(i=r.filename||r.path||r.name||r.url,i&&i.includes("/")&&(i=i.split("/").pop()),i&&i.includes("\\")&&(i=i.split("\\").pop())),i&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(i)}`)}}const a=t.reduce((n,r)=>{var i;return n+(((i=r.imagePaths)==null?void 0:i.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${e}">
      <div class="manga-card-cover">
        ${s?Re(s,e,{kind:"folder"}):we("folder")}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function $i(e){const t=ue.bookmarks.find(s=>s.id===e);return t?t.alias||t.title:e}function ki(e){const t=ue.bookmarks.find(s=>s.id===e);if(t&&t.seriesId){const s=ue.series.find(a=>a.id===t.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function Ei(e,t,s,a=!1){return`
    <div class="manga-card trophy-gallery-card" data-trophy-id="${e}" data-is-series="${a}">
      <div class="manga-card-cover">
        <div class="placeholder trophy-placeholder" data-icon="trophy"></div>
        <div class="manga-card-badges">
            <span class="badge badge-trophy">${m("trophy")} ${s}</span>
            ${a?'<span class="badge badge-series">Series</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function Si(){const e={};console.log("Building trophy groups from:",ue.trophyPages);for(const t of Object.keys(ue.trophyPages)){const s=ue.trophyPages[t];let a=0;for(const[r,i]of Object.entries(s))a+=Object.keys(i).length;if(console.log(`Manga ${t}: ${a} trophies`),a===0)continue;const n=ki(t);if(n)e[n.id]||(e[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),e[n.id].count+=a,e[n.id].mangaIds.push(t);else{const r=$i(t);console.log(`No series for ${t}, using name: ${r}`),e[t]={name:r,isSeries:!1,count:a,mangaIds:[t]}}}return console.log("Trophy groups result:",e),e}function Qt(){if(ue.loading)return`
      ${fe("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:e,listOrder:t}=ue.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${ue.activeTab==="galleries"?"active":""}" data-tab="galleries">
        ${m("folder")} Galleries
      </button>
      <button class="tab-btn ${ue.activeTab==="trophies"?"active":""}" data-tab="trophies">
        ${m("trophy")} Trophies
      </button>
    </div>
  `;let a="";if(ue.activeTab==="galleries")t.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${t.map(r=>{const i=e&&e[r]||[];return wi(r,i)}).join("")}
        </div>
      `;else{const n=Si(),r=Object.keys(n);r.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${r.map(c=>{const l=n[c];return Ei(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${fe("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function dn(){De();const e=document.getElementById("app");e.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{ue.activeTab=s.dataset.tab,e.innerHTML=Qt(),dn()})}),e.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;H.go(`/read/gallery/${encodeURIComponent(a)}`)})}),e.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?H.go(`/read/trophies/series-${a}/🏆`):H.go(`/read/trophies/${a}/🏆`)})})}async function Ci(){try{const[e,t,s,a]=await Promise.all([be.loadFavorites(),f.get("/trophy-pages"),be.loadBookmarks(),be.loadSeries()]);ue.favorites=e||{favorites:{},listOrder:[]},ue.trophyPages=t||{},ue.bookmarks=s||[],ue.series=a||[],ue.loading=!1}catch(e){console.error("Failed to load favorites:",e),h("Failed to load favorites","error"),ue.loading=!1}}async function xi(){console.log("[Favorites] mount called"),ue.loading=!0;const e=document.getElementById("app");e.innerHTML=Qt(),await Ci(),console.log("[Favorites] Data loaded, rendering..."),e.innerHTML=Qt(),console.log("[Favorites] Calling setupListeners..."),dn(),console.log("[Favorites] setupListeners complete")}function Li(){}const Ii={mount:xi,unmount:Li,render:Qt},Mi="site-assist-modal",Ti="/assist",Bi=1,Ai=2,_i=4,Pi=8,da=["left","middle","right"];let at=null;function Je(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ut(e){return(e.altKey?Bi:0)|(e.ctrlKey?Ai:0)|(e.metaKey?_i:0)|(e.shiftKey?Pi:0)}function Xe(){if(!at)return;const{socket:e,modal:t,site:s,onKey:a}=at;at=null,document.removeEventListener("keydown",a,!0),document.removeEventListener("keyup",a,!0);try{e.emit("assist:stop",{site:s})}catch{}try{e.disconnect()}catch{}t.remove()}function ts({site:e,url:t,reason:s,onSolved:a}={}){if(!e)return;if(!X.isAdmin){h("Only an admin can solve a site check for the scraper","error");return}Xe();const n=document.createElement("div");n.id=Mi,n.className="modal open site-assist-modal",n.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Solve ${Je(e)}'s check here</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="site-assist-body">
                <p class="site-assist-intro">
                    ${s==="expired"?`${Je(e)}'s verification cookies ran out, so its work is on hold.`:`${Je(e)} wants a person to pass its check before the scraper may continue.`}
                    Below is the scraper's own browser on the server. Complete the check in it, the way you would
                    in your browser (drag, click, type). When ${Je(e)} accepts it, the scraper keeps the cookies and
                    every waiting download or check resumes by itself.
                </p>
                <div class="site-assist-status" id="site-assist-status" data-status="connecting">Connecting…</div>
                <div class="site-assist-stage" id="site-assist-stage">
                    <canvas id="site-assist-canvas" width="1024" height="720" tabindex="0" aria-label="${Je(e)} in the scraper's browser"></canvas>
                    <div class="site-assist-overlay" id="site-assist-overlay">Waiting for the first picture…</div>
                </div>
                <div class="site-assist-hint">
                    Click the picture first so your keyboard goes to it. Escape closes this window.
                    Not working? <a href="#" data-act="paste">Paste cookies from your own browser</a> instead,
                    or <a href="#" data-act="open">open ${Je(e)}</a> yourself.
                </div>
            </div>
            <div class="site-assist-footer">
                <button type="button" class="btn btn-secondary" data-act="close">Close</button>
            </div>
        </div>
    `,document.body.appendChild(n);const r=n.querySelector("#site-assist-canvas"),i=r.getContext("2d"),c=n.querySelector("#site-assist-status"),l=n.querySelector("#site-assist-overlay"),d=(k,I)=>{c.dataset.status=k,c.textContent=I||""},p=bt(Ti,{auth:{token:f.getToken()},reconnection:!0,reconnectionAttempts:3,reconnectionDelay:1e3});let u=!1,g=!1;const $=new Image;let v=null;$.onload=()=>{if((r.width!==$.naturalWidth||r.height!==$.naturalHeight)&&(r.width=$.naturalWidth,r.height=$.naturalHeight),i.drawImage($,0,0),v){const k=v;v=null,$.src=k}},$.onerror=()=>{v=null},p.on("connect",()=>{d("connecting",`Opening ${e} in the scraper's browser…`),p.emit("assist:start",{site:e},k=>{(!k||!k.ok)&&(d("error",(k==null?void 0:k.error)||"The check could not be opened"),l.textContent=(k==null?void 0:k.error)||"The check could not be opened",l.hidden=!1)})}),p.on("connect_error",k=>{d("error",`Not connected: ${k.message}`),l.textContent=`Not connected: ${k.message}`,l.hidden=!1}),p.on("assist:state",k=>{!k||k.site!==e||(k.status==="streaming"&&(u=!0,l.hidden=!0),d(k.status,k.message),k.status==="solved"?(u=!1,h(`${e}: check passed, waiting work resumes`,"success"),typeof a=="function"&&a(),setTimeout(Xe,2500)):k.status==="ended"?(u=!1,g=!0,l.textContent=k.message||"The window was closed.",l.hidden=!1,k.reason!=="solved"&&d("ended",k.message)):k.status==="error"&&(l.textContent=k.message,l.hidden=!1))}),p.on("assist:frame",k=>{if(!k||k.site!==e||g)return;const I=`data:image/jpeg;base64,${k.data}`;$.complete&&!v?$.src=I:v=I,u||(u=!0,l.hidden=!0)});const y=k=>{const I=r.getBoundingClientRect(),N=(k.clientX-I.left)*(r.width/I.width),E=(k.clientY-I.top)*(r.height/I.height);return{x:Math.round(N),y:Math.round(E)}},L=k=>{u&&!g&&p.emit("assist:input",{site:e,...k})};let w=null;const x=()=>{w&&(L(w),w=null)};r.addEventListener("pointerdown",k=>{k.preventDefault(),r.focus(),r.setPointerCapture(k.pointerId);const{x:I,y:N}=y(k);L({type:"mousedown",x:I,y:N,button:da[k.button]||"left",buttons:k.buttons,clickCount:1,modifiers:ut(k)})}),r.addEventListener("pointermove",k=>{const{x:I,y:N}=y(k),E=!w;w={type:"mousemove",x:I,y:N,button:k.buttons&1?"left":k.buttons&2?"right":"none",buttons:k.buttons,modifiers:ut(k)},E&&requestAnimationFrame(x)}),r.addEventListener("pointerup",k=>{k.preventDefault(),x();const{x:I,y:N}=y(k);L({type:"mouseup",x:I,y:N,button:da[k.button]||"left",buttons:k.buttons,clickCount:1,modifiers:ut(k)});try{r.releasePointerCapture(k.pointerId)}catch{}}),r.addEventListener("pointercancel",k=>{const{x:I,y:N}=y(k);L({type:"mouseup",x:I,y:N,button:"left",buttons:0,clickCount:1})}),r.addEventListener("wheel",k=>{k.preventDefault();const{x:I,y:N}=y(k);L({type:"wheel",x:I,y:N,deltaX:k.deltaX,deltaY:k.deltaY,modifiers:ut(k)})},{passive:!1}),r.addEventListener("contextmenu",k=>k.preventDefault());const T=k=>{if(!at||at.modal!==n)return;if(k.key==="Escape"){k.type==="keydown"&&Xe();return}if(document.activeElement!==r)return;k.preventDefault(),k.stopPropagation();const I=k.key.length===1&&!k.ctrlKey&&!k.metaKey;L({type:k.type,key:k.key,code:k.code,keyCode:k.keyCode,text:I?k.key:void 0,modifiers:ut(k)})};document.addEventListener("keydown",T,!0),document.addEventListener("keyup",T,!0),n.querySelector(".modal-overlay").addEventListener("click",Xe),n.querySelectorAll('[data-act="close"]').forEach(k=>k.addEventListener("click",Xe)),n.querySelector('[data-act="paste"]').addEventListener("click",k=>{k.preventDefault(),Xe(),as({site:e,url:t,stale:s==="expired"||s==="rejected"})}),n.querySelector('[data-act="open"]').addEventListener("click",k=>{k.preventDefault(),ss(e,t)}),at={site:e,socket:p,modal:n,onKey:T},r.focus()}const un="site-cookie-modal",js=new Set;function me(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ss(e,t){window.open(t||`https://${e}/`,"_blank","noopener")}function et(){const e=document.getElementById(un);e&&e.remove(),document.removeEventListener("keydown",pn)}function pn(e){e.key==="Escape"&&et()}function qi(e,t){var n;const s=((n=t.session)==null?void 0:n.cookieCount)??0,a=t.probe;return a&&a.ok?{kind:"ok",html:`<strong>${me(e)} accepted the cookies.</strong> ${s} saved; downloads and checks that were
                   waiting for this site resume by themselves (see the <a href="#/queue">Task Queue</a>).`}:a&&!a.ok&&a.error?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but the server could not load ${me(e)} to test them.</strong>
                   ${me(a.error)}. Retry a download to find out whether they work.`}:a&&!a.ok?{kind:"warn",html:`<strong>Saved ${s} cookie${s===1?"":"s"}, but ${me(e)} still shows its check to the server.</strong>
                   Usually one of: the check was done on a different network than the server (the cookie can be tied to the
                   IP address), or in a different browser than the identity filled in above. Complete the check again from a
                   device on the server's network, export the cookies right away, make sure the identity is that browser's,
                   and paste again.${a.error?`<br><small>${me(a.error)}</small>`:""}`}:{kind:"ok",html:`<strong>Saved ${s} cookie${s===1?"":"s"}.</strong> The site could not be tested right now; retry your download to find out.`}}function as({site:e,url:t,stale:s=!1,onImported:a}={}){if(!e)return;if(!X.isAdmin){h("Only an admin can hand site cookies to the scraper","error");return}et();const n=navigator.userAgent||"",r=document.createElement("div");r.id=un,r.className="modal open site-cookie-modal",r.innerHTML=`
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Hand ${me(e)}'s cookies to the scraper</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="site-cookie-body">
                <div class="site-cookie-alt">
                    Easier: <button type="button" class="btn btn-sm btn-primary" data-act="assist">Solve it here</button>
                    passes the check inside the scraper's own browser, so nothing needs copying and the cookies fit
                    the scraper's identity and network. Use the steps below when that does not work.
                </div>
                <ol class="site-cookie-steps">
                    <li><button type="button" class="btn btn-sm btn-secondary" data-act="open">Open ${me(e)}</button>
                        and complete its "verify you're human" check.
                        ${s?`If no puzzle appears, that browser is still trusted: export its cookies anyway (the site
                        may have renewed them), or clear the site's cookies in that browser to get the puzzle back.`:""}</li>
                    <li>Copy the cookies ${me(e)} gave that browser, right after the check. Easiest: the
                        <strong>Cookie-Editor</strong> extension (Chrome, Edge, Firefox): open it on the ${me(e)} tab,
                        choose <em>Export</em>, then <em>JSON</em> or <em>Header String</em>. A Netscape <code>cookies.txt</code>
                        export works too. (The browser console's <code>document.cookie</code> does not: it hides the cookie that matters.)</li>
                    <li>Paste them here and save. The server then loads ${me(e)} once to see whether it is trusted.</li>
                </ol>
                <div class="form-group">
                    <label for="site-cookie-input">Cookies for ${me(e)}</label>
                    <textarea id="site-cookie-input" rows="5" spellcheck="false" autocomplete="off" autocapitalize="off"
                        placeholder='[{"name": "...", "value": "..."}]   or   name=value; name2=value2'></textarea>
                </div>
                <div class="form-group site-cookie-ua">
                    <label for="site-cookie-ua">Identity (user agent) of the browser that completed the check</label>
                    <input type="text" id="site-cookie-ua" value="${me(n)}" spellcheck="false" autocomplete="off">
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
    `,document.body.appendChild(r),document.addEventListener("keydown",pn);const i=r.querySelector("#site-cookie-input"),c=r.querySelector("#site-cookie-ua"),l=r.querySelector("#site-cookie-result"),d=r.querySelector('[data-act="save"]'),p=(g,$)=>{l.className=`site-cookie-result ${g}`,l.innerHTML=$,l.hidden=!1};r.querySelector(".modal-overlay").addEventListener("click",et),r.querySelectorAll('[data-act="close"]').forEach(g=>g.addEventListener("click",et)),r.querySelector('[data-act="open"]').addEventListener("click",()=>ss(e,t)),r.querySelector('[data-act="assist"]').addEventListener("click",()=>{et(),ts({site:e,url:t,reason:s?"rejected":"check",onSolved:a})});let u=!1;d.addEventListener("click",async()=>{var $;if(u)return;const g=i.value.trim();if(!g){p("error","Paste the cookies first."),i.focus();return}u=!0,d.disabled=!0,d.textContent="Saving & testing…",l.hidden=!0;try{const v=await f.importSiteSession(e,g,c.value.trim()),{kind:y,html:L}=qi(e,v),w=v.ignored||{},x=[];w.foreign&&x.push(`${w.foreign} for other sites`),w.expired&&x.push(`${w.expired} already expired`),w.invalid&&x.push(`${w.invalid} unreadable`),p(y,L+(x.length?`<br><small>Skipped: ${x.join(", ")}.</small>`:"")),i.value="",typeof a=="function"&&a(v),($=v.probe)!=null&&$.ok&&(h(`${e}: cookies accepted, checks resume`,"success"),setTimeout(et,2500))}catch(v){p("error",me(v.message||"Import failed"))}finally{u=!1,d.disabled=!1,d.textContent="Save & test"}}),i.focus()}const ua="site-challenge-banners",ns=new Map;function Ri(e){const t=`<strong>${me(e.site)}</strong>`,s=" Its downloads and update checks wait in the queue and resume by themselves once the check is passed.";return e.reason==="expired"?`${t}'s verification cookies expired.${s}`:e.sessionStale?`${t} no longer accepts the cookies handed over earlier.${s}`:`${t} is asking for a human verification check.${s}`}function Di(e){var n,r,i;const t=X.isAdmin,s=document.createElement("div");s.className="site-challenge-banner",s.dataset.site=e.site;const a=e.waiting?` <span class="site-challenge-waiting">${e.waiting} task${e.waiting===1?"":"s"} waiting</span>`:"";return s.innerHTML=`
        <div class="site-challenge-text">${Ri(e)}${t?"":" Ask an admin to pass it."}${a}</div>
        <div class="site-challenge-actions">
            ${t?'<button class="btn btn-primary btn-sm" data-act="assist">Solve it here</button>':""}
            ${t?'<button class="btn btn-secondary btn-sm" data-act="import" title="Complete the check in your own browser and paste its cookies">Paste cookies</button>':`<button class="btn btn-primary btn-sm" data-act="open">Open ${me(e.site)}</button>`}
            <button class="btn btn-secondary btn-sm" data-act="retry" title="Resume without solving. Only works if the site stopped asking.">Retry anyway</button>
            <button class="site-challenge-close" data-act="close" title="Hide">×</button>
        </div>
    `,(n=s.querySelector('[data-act="assist"]'))==null||n.addEventListener("click",()=>{ts({site:e.site,url:e.url,reason:e.reason||(e.sessionStale?"rejected":"check")})}),(r=s.querySelector('[data-act="open"]'))==null||r.addEventListener("click",()=>ss(e.site,e.url)),(i=s.querySelector('[data-act="import"]'))==null||i.addEventListener("click",()=>{as({site:e.site,url:e.url,stale:!!e.sessionStale||e.reason==="expired"})}),s.querySelector('[data-act="retry"]').addEventListener("click",async()=>{try{await f.clearSiteChallenge(e.site),h(`${e.site}: waiting work resumes. If the puzzle comes back, solve it instead.`,"info")}catch(c){h("Failed: "+c.message,"error")}ns.delete(e.site),Gt()}),s.querySelector('[data-act="close"]').addEventListener("click",()=>{js.add(e.site),Gt()}),s}function Gt(){let e=document.getElementById(ua);const t=[...ns.values()].filter(s=>!js.has(s.site));if(t.length===0){e&&e.remove();return}e||(e=document.createElement("div"),e.id=ua,e.className="site-challenge-banners",document.body.appendChild(e)),e.replaceChildren(...t.map(Di))}function pa(e){!e||!e.site||(ns.set(e.site,e),Gt())}function Ni(e){ns.delete(e),Gt()}async function yl(){se.on("site:challenge",e=>{js.delete(e.site),pa(e)}),se.on("site:challenge-cleared",({site:e})=>Ni(e));try{const e=await f.getSiteStatus();for(const t of e.challenges||[])pa(t)}catch{}}let j={downloads:{},torrents:[],imports:[],queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,showEmptyChecks:!1,collapsed:{torrents:!1,imports:!1,active:!1,scheduled:!1,completed:!1,history:!0}},Rt=null,ie={};function zs(e){if(!e)return"Never";const t=Date.now()-new Date(e).getTime(),s=Math.floor(t/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function Fi(e){if(!e)return"Not scheduled";const t=new Date(e).getTime()-Date.now();if(t<=0)return"Running now...";const s=Math.floor(t/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const r=Math.floor(a/24),i=a%24;return`in ${r}d ${i}h`}function hn(e){switch(e){case"download":return m("download");case"scrape":return m("search");case"scan":return m("folder");default:return m("settings")}}function Qs(e){switch(e){case"running":return"var(--color-success)";case"queued":case"pending":case"waiting":return"var(--color-warning)";case"paused":return"var(--color-info)";case"complete":return"var(--color-success)";case"error":case"failed":case"cancelled":return"var(--color-error)";default:return"var(--text-secondary)"}}function Gs(e){switch(e){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"waiting":return"⏳ Waiting for site";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return e}}function Oi(e){return!e||e==="default"?"Default (6h)":e==="daily"?"Daily":e==="weekly"?"Weekly":e}function Ui(){const e=j.autoCheck;return e?`
    <div class="queue-inline-header">
      <span class="text-muted">${e.enabledCount} monitored · Last: ${zs(e.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">${m("play")} Run All Now</button>
    </div>
  `:""}function Hi(e){const t=e.nextCheck?Fi(e.nextCheck):"Not set",s=e.nextCheck&&new Date(e.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${e.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${m("book-open")}</span>
          <div>
            <div class="task-title">${e.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${Oi(e.schedule)}${e.schedule==="weekly"&&e.day?` · ${e.day.charAt(0).toUpperCase()+e.day.slice(1)}`:""}${(e.schedule==="daily"||e.schedule==="weekly")&&e.time?` · ${e.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?`${m("alarm-clock")} Due now`:t}</span>
        </div>
      </div>
    </div>
  `}function re(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Vi(e){const t=e.challenge||{},s=re(e.waitingFor||t.site||e.site||"the site"),a=re(t.url||`https://${e.waitingFor||t.site||e.site}/`),n=X.isAdmin,r=t.reason||(t.sessionStale?"rejected":"check");return`
    <div class="task-challenge task-waiting">
      <span>${r==="expired"?`${s}'s verification cookies expired. Solve its check again; this download continues where it stopped.`:t.sessionStale?`${s} no longer accepts the saved cookies. Solve its check again; this download continues where it stopped.`:`${s} wants a human verification check. Once it is passed, this download continues where it stopped.`}${n?"":" (An admin has to pass it.)"}</span>
      ${n?`<button class="btn btn-sm btn-primary" data-action="solve" data-site="${s}" data-url="${a}" data-reason="${r}">Solve it here</button>`:""}
      ${n?`<button class="btn btn-sm btn-secondary" data-action="import-cookies" data-site="${s}" data-url="${a}" data-stale="${t.sessionStale||r==="expired"?"1":""}">Paste cookies</button>`:`<button class="btn btn-sm btn-secondary" data-action="open-site" data-site="${s}" data-url="${a}">Open ${s}</button>`}
    </div>`}function ha(e,t){const s=t.total>0?Math.round(t.completed/t.total*100):0,a=t.status==="waiting",n=t.status==="running"||t.status==="queued"||a,r=t.status==="paused",i=(t.errors||[]).filter(d=>!d.waiting),c=i.length>0,l=!n&&!r&&c&&(t.chapterUrls||[]).length>0;return`
    <div class="queue-card task-card" data-task-id="${e}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${m("download")}</span>
          <div>
            <div class="task-title">${t.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${Qs(t.status)}">${Gs(t.status)}</div>
          </div>
        </div>
        <div class="task-actions">
          ${n&&!a?`<button class="btn btn-sm btn-icon" data-action="pause" data-task="${e}" title="Pause">${m("pause",{title:"Pause"})}</button>`:""}
          ${r?`<button class="btn btn-sm btn-icon" data-action="resume" data-task="${e}" title="Resume">${m("play",{title:"Resume"})}</button>`:""}
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
          <div class="task-errors">${m("triangle-alert")} ${i.length} error(s)</div>
          <ul class="task-error-list">${i.slice(0,5).map(d=>`<li>${typeof d.chapter=="number"?`Ch. ${d.chapter}: `:""}${re(d.error)}</li>`).join("")}</ul>`:""}
        ${a?Vi(t):l?`
          <div class="task-challenge">
            <button class="btn btn-sm btn-secondary" data-action="retry" data-task="${e}">Retry failed chapters</button>
          </div>`:""}
      </div>
    </div>
  `}function ji(e){switch(e.status){case"downloading":return/paused|stopped/i.test(e.state||"")?"Paused":/queued|metaDL|checking/i.test(e.state||"")?"Waiting":"Downloading";case"grabbing":return"Fetching the release for qBittorrent";case"completed":return e.autoImport?"Downloaded, importing soon":"Downloaded";case"importing":return"Importing";case"imported":return"Imported";case"failed":return"Failed";case"removed":return"Removed from qBittorrent";default:return e.status}}function zi(e){return e.status==="imported"?"var(--success)":e.status==="failed"||e.status==="removed"?"var(--error)":e.status==="importing"||e.status==="completed"||e.status==="grabbing"?"var(--warning)":"var(--text-secondary)"}function Qi(e){return!e||e<=0||e>=864e4?"":e<60?`${e}s`:e<3600?`${Math.round(e/60)}m`:`${Math.floor(e/3600)}h ${Math.round(e%3600/60)}m`}function Gi(e){var d,p,u,g;const t=Math.round((e.progress||0)*100),s=e.status==="downloading",a=s&&/paused|stopped/i.test(e.state||""),n=["completed","failed","imported"].includes(e.status)&&(e.progress||0)>=1,r=e.bookmarkId?`<a href="#/manga/${re(e.bookmarkId)}">open series</a>`:e.newSeriesTitle?`new series “${re(e.newSeriesTitle)}”`:"",i=e.importResult,c=i?[(d=i.volumes)!=null&&d.length?`${i.volumes.length} volume${i.volumes.length===1?"":"s"} (${i.volumes.map($=>$.name).join(", ")})`:"",(p=i.chapters)!=null&&p.length?`${i.chapters.length} chapter${i.chapters.length===1?"":"s"}`:"",(u=i.skipped)!=null&&u.length?`${i.skipped.length} skipped`:""].filter(Boolean).join(" · "):"",l=[kt(e.size),s&&e.dlspeed?`${kt(e.dlspeed)}/s`:"",s?Qi(e.eta):"",e.indexer||""].filter(Boolean).join(" · ");return`
    <div class="queue-card task-card torrent-card" data-hash="${re(e.hash)}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${m("download")}</span>
          <div>
            <div class="task-title" title="${re(e.releaseTitle||e.name)}">${re(e.name||e.releaseTitle)}</div>
            <div class="task-status" style="color: ${zi(e)}">${ji(e)}${r?` · ${r}`:""}</div>
          </div>
        </div>
        <div class="task-actions">
          ${s&&!a?`<button class="btn btn-sm btn-icon" data-taction="pause" title="Pause">${m("pause",{title:"Pause"})}</button>`:""}
          ${a?`<button class="btn btn-sm btn-icon" data-taction="resume" title="Resume">${m("play",{title:"Resume"})}</button>`:""}
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
        ${c?`<div class="task-current">${m("check")} ${re(c)}</div>`:""}
        ${(g=i==null?void 0:i.skipped)!=null&&g.length?`<ul class="task-error-list">${i.skipped.slice(0,4).map($=>`<li>${re($)}</li>`).join("")}</ul>`:""}
        ${e.error?`<div class="task-errors">${m("triangle-alert")} ${re(e.error)}</div>`:""}
      </div>
    </div>
  `}function Wi(e){switch(e.status){case"queued":return"◌ Queued";case"running":return"● Importing";case"done":return"✓ Imported";case"failed":return"✗ Failed";default:return e.status}}function Ki(e){return e.status==="done"?"var(--color-success)":e.status==="failed"?"var(--color-error)":"var(--color-warning)"}function Yi(e){var c,l,d,p;const t=e.total||0,s=e.status==="done"?t:e.done||0,a=t>0?Math.round(s/t*100):e.status==="done"?100:0,n=e.summary,r=n?[(c=n.volumes)!=null&&c.length?`${n.volumes.length} volume${n.volumes.length===1?"":"s"} (${n.volumes.map(u=>u.name).join(", ")})`:"",(l=n.chapters)!=null&&l.length?`${n.chapters.length} chapter${n.chapters.length===1?"":"s"}`:"",(d=n.skipped)!=null&&d.length?`${n.skipped.length} skipped`:""].filter(Boolean).join(" · "):"",i=e.bookmarkId?`<a href="#/manga/${re(e.bookmarkId)}">${re(e.bookmarkTitle||"open series")}</a>`:e.bookmarkTitle?`new series “${re(e.bookmarkTitle)}”`:"";return`
    <div class="queue-card task-card import-card" data-import-id="${re(e.id)}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${m(e.path?"folder":"package")}</span>
          <div>
            <div class="task-title" title="${re(e.path||e.title)}">${re(e.title)}</div>
            <div class="task-status" style="color: ${Ki(e)}">${Wi(e)}${i?` · into ${i}`:""}</div>
          </div>
        </div>
      </div>
      <div class="queue-card-body">
        ${e.status==="running"||e.status==="queued"?`
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${a}%"></div>
            <span class="progress-text">${t?`${s} / ${t} items (${a}%)`:"Starting…"}</span>
          </div>
          ${e.current?`<div class="task-current">Currently: ${re(e.current)}</div>`:""}`:""}
        ${e.status==="done"&&r?`<div class="task-current">${re(r)}</div>`:""}
        ${e.status==="done"&&((p=n==null?void 0:n.skipped)!=null&&p.length)?`<ul class="task-error-list">${n.skipped.slice(0,5).map(u=>`<li>${re(u)}</li>`).join("")}</ul>`:""}
        ${e.status==="failed"?`<div class="task-errors">${m("triangle-alert")} ${re(e.error||"Import failed")}</div>`:""}
      </div>
    </div>
  `}function Ji(e){const t=e.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${hn(e.type)}</span>
          <div>
            <div class="task-title">${t.description||t.mangaTitle||e.type}</div>
            <div class="task-status" style="color: ${Qs(e.status)}">${Gs(e.status)}</div>
          </div>
        </div>
      </div>
      ${e.status==="waiting"&&e.error?`<div class="queue-card-body"><div class="task-challenge task-waiting"><span>${re(e.error)}</span></div></div>`:e.started_at?`<div class="queue-card-body"><small>Started: ${zs(e.started_at)}</small></div>`:""}
    </div>
  `}function Xi(e){const t=e.data||{},s=e.result||{};let a="";if(e.type==="scrape")s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${e.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>');else if(e.type==="scan"||e.type==="scan-local")s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`);else if(e.type==="download"){if(e.status==="failed"&&e.error)a=`<div class="task-subtext" style="color: var(--color-error, #e05555);">${e.error}</div>`;else if(s.downloaded!==void 0){const n=[`${s.downloaded} chapter${s.downloaded===1?"":"s"} downloaded`];s.pages&&n.push(`${s.pages} pages`),s.failed&&n.push(`${s.failed} failed`);const r=(s.errors||[]).filter(i=>i.partial);r.length&&n.push(`${r.length} with missing pages`),a=`<div class="task-subtext" style="color: var(--text-secondary);">${n.join(" · ")}</div>`}}return`
    <div class="queue-card task-card history-card" data-history-id="${e.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${hn(e.type)}</span>
          <div>
            <div class="task-title">${t.description||t.mangaTitle||e.type}</div>
            <div class="task-status" style="color: ${Qs(e.status)}">${Gs(e.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${e.completed_at?`<div class="queue-card-body"><small>Completed: ${zs(e.completed_at)}</small></div>`:""}
    </div>
  `}function Zi(){var p;const e=Object.entries(j.downloads),t=e.filter(([,u])=>u.status!=="complete"),s=e.filter(([,u])=>u.status==="complete"),a=new Set(t.map(([,u])=>u.bookmarkId).filter(Boolean)),n=j.queueTasks.filter(u=>{var g;return!(u.type==="download"&&((g=u.data)!=null&&g.mangaId)&&a.has(u.data.mangaId))}),r=j.torrents.filter(u=>["downloading","completed","importing"].includes(u.status)),i=j.imports.filter(u=>u.status==="running"||u.status==="queued"),c=n.filter(u=>u.type!=="import"),l=t.length+c.length+r.length+i.length,d=((p=j.autoCheck)==null?void 0:p.schedules)||[];return`
    ${fe("manga")}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>${m("list-checks")} Task Queue</h2>
        ${l>0?`<span class="queue-badge">${l} active</span>`:""}
      </div>

      ${j.torrents.length>0?`
        <div class="queue-section ${j.collapsed.torrents?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="torrents">
            <span class="collapse-icon">▼</span> Torrents (${r.length} active)
          </h3>
          <div class="queue-section-content">
            ${j.torrents.map(Gi).join("")}
          </div>
        </div>
      `:""}

      ${j.imports.length>0?`
        <div class="queue-section ${j.collapsed.imports?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="imports">
            <span class="collapse-icon">▼</span> Imports (${i.length} active)
          </h3>
          <div class="queue-section-content">
            ${j.imports.map(Yi).join("")}
          </div>
        </div>
      `:""}

      ${t.length>0||c.length>0?`
        <div class="queue-section ${j.collapsed.active?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${t.map(([u,g])=>ha(u,g)).join("")}
            ${c.map(u=>Ji(u)).join("")}
          </div>
        </div>
      `:""}

      ${d.length>0?`
        <div class="queue-section ${j.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${d.length})
            </h3>
            ${Ui()}
          </div>
          <div class="queue-section-content">
            ${d.map(u=>Hi(u)).join("")}
          </div>
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section ${j.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${s.map(([u,g])=>ha(u,g)).join("")}
          </div>
        </div>
      `:""}

      ${j.historyTasks&&j.historyTasks.length>0?(()=>{const u=v=>{if(v.type!=="scrape")return!1;const y=v.result||{};return(v.status==="complete"||v.status==="completed")&&(y.newChaptersCount===0||y.updated===!1)},g=j.historyTasks.filter(u).length,$=j.showEmptyChecks?j.historyTasks:j.historyTasks.filter(v=>!u(v));return`
        <div class="queue-section ${j.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${g>0?`
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${j.showEmptyChecks?"Hide":"Show"} checks with no new chapters">
                    ${j.showEmptyChecks?`${m("chevron-up")} Hide`:`${m("chevron-down")} Show`} empty checks (${g})
                  </button>
                `:""}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  ${m("trash-2")} Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${$.length>0?$.map(v=>Xi(v)).join(""):`
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${g>0?`${g} empty check(s) hidden.`:""}</p>
                  </div>
                `}
            </div>
        </div>
      `})():""}

      ${t.length===0&&n.length===0&&s.length===0&&d.length===0&&(!j.historyTasks||j.historyTasks.length===0)?`
        <div class="queue-empty">
          <div class="empty-icon">${m("check")}</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      `:""}
    </div>
  `}async function Be(){try{const[e,t,s,a,n,r]=await Promise.all([f.getDownloads().catch(()=>({})),f.getQueueTasks().catch(()=>[]),f.getQueueHistory(50).catch(()=>[]),f.getAutoCheckStatus().catch(()=>null),f.getTorrentDownloads().catch(()=>({torrents:[]})),f.getImports().catch(()=>({imports:[]}))]);j.downloads=e||{},j.torrents=(n==null?void 0:n.torrents)||[],j.imports=(r==null?void 0:r.imports)||[],j.queueTasks=t||[],j.historyTasks=s||[],j.autoCheck=a,j.loading=!1}catch(e){console.error("[Queue] Failed to load data:",e),j.loading=!1}}function ge(){const e=document.getElementById("app");e&&(e.innerHTML=Zi(),el())}function el(){De(),document.querySelectorAll("[data-toggle]").forEach(a=>{a.addEventListener("click",n=>{const r=a.dataset.toggle;j.collapsed[r]=!j.collapsed[r],ge()})});const e=document.getElementById("run-autocheck-btn");e&&e.addEventListener("click",async()=>{e.disabled=!0,e.innerHTML=`${m("loader",{spin:!0})} Running...`;try{h("Auto-check started...","info");const a=await f.runAutoCheck();h(`Check complete: ${a.checked} checked, ${a.updated} updated`,"success"),await Be(),ge()}catch(a){h("Auto-check failed: "+a.message,"error"),e.disabled=!1,e.innerHTML=`${m("play")} Run Now`}});const t=document.getElementById("clear-history-btn");t&&t.addEventListener("click",async a=>{if(a.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await f.clearQueueHistory(),h("History cleared","success"),await Be(),ge()}catch(n){h(`Failed to clear history: ${n.message}`,"error")}});const s=document.getElementById("toggle-empty-checks-btn");s&&s.addEventListener("click",a=>{a.stopPropagation(),j.showEmptyChecks=!j.showEmptyChecks,ge()}),document.querySelectorAll(".scheduled-manga-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.mangaId;n&&(window.location.hash=`#/manga/${n}`)})}),document.querySelectorAll(".torrent-card [data-taction]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const r=a.closest(".torrent-card").dataset.hash,i=j.torrents.find(l=>l.hash===r),c=a.dataset.taction;try{if(c==="pause")await f.pauseTorrent(r);else if(c==="resume")await f.resumeTorrent(r);else if(c==="review"){tn(i,{onImported:async()=>{await Be(),ge()}});return}else if(c==="import")a.disabled=!0,a.textContent="Queued…",await f.importTorrent(r),h("Import queued; its progress shows under Imports","info");else if(c==="remove"){const l=i&&["imported","removed"].includes(i.status);if(!l&&!confirm(`Remove "${(i==null?void 0:i.name)||"this torrent"}" from qBittorrent and stop tracking it?`))return;const d=!l&&confirm("Also delete its downloaded files from disk?");await f.removeTorrent(r,{deleteFiles:d,fromClient:!l}),h("Torrent removed","info")}await Be(),ge()}catch(l){h(`Action failed: ${l.message}`,"error"),await Be(),ge()}})}),document.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const r=a.dataset.action,i=a.dataset.task;if(r==="open-site"){ss(a.dataset.site,a.dataset.url);return}if(r==="import-cookies"){as({site:a.dataset.site,url:a.dataset.url,stale:a.dataset.stale==="1"});return}if(r==="solve"){ts({site:a.dataset.site,url:a.dataset.url,reason:a.dataset.reason});return}try{if(r==="pause")await f.pauseDownload(i),h("Download paused","info");else if(r==="resume")await f.resumeDownload(i),h("Download resumed","info");else if(r==="cancel")confirm("Cancel this download?")&&(await f.cancelDownload(i),h("Download cancelled","info"));else if(r==="retry"){const c=await f.retryDownload(i);h(`Retrying ${c.chapters.length} chapter${c.chapters.length===1?"":"s"}`,"info")}await Be(),ge()}catch(c){h(`Action failed: ${c.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.historyId,r=document.getElementById(`task-details-${n}`);r&&r.classList.toggle("hidden")})})}async function tl(){j.loading=!0;const e=document.getElementById("app");e.innerHTML=`
    ${fe("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>${m("list-checks")} Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,De(),await Be(),ge(),Rt=setInterval(async()=>{await Be(),ge()},5e3),ie.downloadProgress=t=>{t.taskId&&j.downloads[t.taskId]&&(Object.assign(j.downloads[t.taskId],t),ge())},ie.downloadCompleted=t=>{Be().then(ge)},ie.queueUpdated=t=>{Be().then(ge)},ie.torrentUpdate=t=>{Array.isArray(t==null?void 0:t.torrents)&&(j.torrents=t.torrents,ge())},ie.importProgress=t=>{if(!(t!=null&&t.id))return;const s=j.imports.findIndex(a=>a.id===t.id);s>=0?j.imports[s]=t:j.imports.unshift(t),ge()},se.on(oe.IMPORT_PROGRESS,ie.importProgress),se.on(oe.DOWNLOAD_PROGRESS,ie.downloadProgress),se.on(oe.DOWNLOAD_COMPLETED,ie.downloadCompleted),se.on(oe.QUEUE_UPDATED,ie.queueUpdated),se.on(oe.TORRENT_UPDATE,ie.torrentUpdate)}function sl(){Rt&&(clearInterval(Rt),Rt=null),ie.downloadProgress&&se.off(oe.DOWNLOAD_PROGRESS,ie.downloadProgress),ie.downloadCompleted&&se.off(oe.DOWNLOAD_COMPLETED,ie.downloadCompleted),ie.queueUpdated&&se.off(oe.QUEUE_UPDATED,ie.queueUpdated),ie.torrentUpdate&&se.off(oe.TORRENT_UPDATE,ie.torrentUpdate),ie.importProgress&&se.off(oe.IMPORT_PROGRESS,ie.importProgress),ie={}}const al={mount:tl,unmount:sl};function $e(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function nl(e){if(!e)return"";const t=Math.floor((Date.now()-new Date(e).getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t}m ago`;const s=Math.floor(t/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}class rl{constructor(){this.container=null,this.scrapers=[],this.siteStatus={challenges:[],sessions:[]},this.onSiteStatusChange=null,this.currentQuery="",this.currentTarget="all",this.isSearching=!1,this.results=[],this.viewMode="main",this.browseScraper=null,this.browseQuery="",this.browseSort="popular",this.browsePage=1,this.browseTotalPages=1,this.isBrowsing=!1,this.browseResults=[],this.previewInfo=null,this.previewImages=[],this.previewIndex=0,this.infoAbortController=null}async mount(t){this.container=document.getElementById("app"),document.body.className="scrapers-mode";const s=new URLSearchParams(window.location.hash.split("?")[1]||""),a=s.get("browse"),n=s.get("q");a&&(this.browseScraper=a,this.viewMode="browse",this.browseQuery=n||"",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1),this.updateView(),this.onSiteStatusChange=()=>this.loadSiteStatus(),se.on(oe.SITE_SESSION,this.onSiteStatusChange),se.on(oe.SITE_CHALLENGE,this.onSiteStatusChange),se.on(oe.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),await this.loadScrapers(),this.viewMode==="browse"&&this.browseScraper?(a&&(this.startBrowse(a,{query:n||null}),this.updateView()),this.performBrowse()):n&&(this.currentQuery=n,this.updateView(),this.performSearch())}unmount(){this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.onSiteStatusChange&&(se.off(oe.SITE_SESSION,this.onSiteStatusChange),se.off(oe.SITE_CHALLENGE,this.onSiteStatusChange),se.off(oe.SITE_CHALLENGE_CLEARED,this.onSiteStatusChange),this.onSiteStatusChange=null),this.container.innerHTML="",document.body.className=""}async loadScrapers(){try{const[t,s]=await Promise.all([f.get("/scrapers/list"),f.getSiteStatus().catch(()=>({challenges:[],sessions:[]}))]);this.siteStatus=s||{challenges:[],sessions:[]},t.success&&(this.scrapers=t.scrapers,this.updateView())}catch(t){console.error("Failed to load scrapers",t)}}async loadSiteStatus(){try{this.siteStatus=await f.getSiteStatus()}catch{return}document.getElementById("scraper-cards-list")&&(this.renderScraperList(),this.bindCardEvents())}sessionFor(t){return(this.siteStatus.sessions||[]).find(s=>s.site===t)||null}browseConfig(t=this.browseScraper){const s=this.scrapers.find(n=>n.name===t),a=s&&s.browseOptions;return{sorts:a&&a.sorts&&a.sorts.length?a.sorts:[{value:"popular",label:"Popular"}],defaultSort:a&&a.defaultSort||"popular",defaultQuery:a&&a.defaultQuery||"",queryLabel:a&&a.queryLabel||"Search",queryPlaceholder:a&&a.queryPlaceholder||"Optional: title to search for"}}startBrowse(t,{query:s=null,sort:a=null}={}){const n=this.browseConfig(t);this.browseScraper=t,this.viewMode="browse",this.browseQuery=s??n.defaultQuery,this.browseSort=a&&n.sorts.some(r=>r.value===a)?a:n.defaultSort,this.browsePage=1,this.browseResults=[],this.browseTotalPages=1}challengeFor(t){return(this.siteStatus.challenges||[]).find(s=>s.site===t)||null}renderSessionRow(t){if(!t.supportsSession)return"";const s=this.sessionFor(t.name),a=this.challengeFor(t.name);let n;if(s&&s.stale)n=`<span class="capability-pill capability-soon" title="${$e(s.staleReason||"The site showed its check again")}">${m("triangle-alert")} Rejected, solve again</span>`;else if(s&&s.cookieCount===0)n=`<span class="capability-pill capability-soon" title="Every saved cookie has expired">${m("triangle-alert")} Expired, solve again</span>`;else if(s){const r=nl(s.updatedAt||s.importedAt),i=X.isAdmin?`${(s.cookieNames||[]).join(", ")}${s.userAgent?`
${s.userAgent}`:""}`:"";n=`<span class="capability-pill capability-yes" title="${$e(i)}">✓ ${s.cookieCount} cookie${s.cookieCount===1?"":"s"}${r?` · ${r}`:""}</span>`}else a?n=`<span class="capability-pill capability-soon">${m("triangle-alert")} Check pending</span>`:n='<span class="capability-pill capability-no">None</span>';return`
      <div class="capability-row">
        <span class="capability-label" title="Cookies from a browser that completed the site's human check">${m("lock-open")} Session</span>
        <span class="scraper-session-cell">
          ${n}
          ${s&&X.isAdmin?`<button type="button" class="scraper-session-forget" data-scraper="${$e(t.name)}" title="Forget these cookies">Forget</button>`:""}
        </span>
      </div>`}bindCardEvents(){document.querySelectorAll(".scraper-search-card-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper;this.currentTarget=a;const n=document.getElementById("scraper-query");n&&(this.currentQuery=n.value.trim()),this.updateView();const r=document.getElementById("scraper-query");r&&(r.focus(),window.scrollTo({top:0,behavior:"smooth"}),this.currentQuery&&this.performSearch())})}),document.querySelectorAll(".scraper-browse-card-btn").forEach(t=>{t.addEventListener("click",s=>{this.startBrowse(s.currentTarget.dataset.scraper),this.updateView(),this.performBrowse()})}),document.querySelectorAll(".scraper-session-card-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper,n=this.challengeFor(a),r=this.sessionFor(a),i=!!r&&(r.stale||r.cookieCount===0);as({site:a,url:n==null?void 0:n.url,stale:i,onImported:()=>this.loadSiteStatus()})})}),document.querySelectorAll(".scraper-session-solve-btn").forEach(t=>{t.addEventListener("click",s=>{const a=s.currentTarget.dataset.scraper,n=this.challengeFor(a),r=this.sessionFor(a),i=(n==null?void 0:n.reason)||(r&&(r.stale||r.cookieCount===0)?"rejected":"check");ts({site:a,url:n==null?void 0:n.url,reason:i,onSolved:()=>this.loadSiteStatus()})})}),document.querySelectorAll(".scraper-session-forget").forEach(t=>{t.addEventListener("click",async s=>{const a=s.currentTarget.dataset.scraper;if(confirm(`Forget the saved ${a} cookies? The scraper goes back to its own identity.`))try{(await f.forgetSiteSession(a)).purged===null?h(`${a}: cookies forgotten, but they may stay in the scraper browser until it restarts`,"warning"):h(`${a}: saved cookies forgotten`,"info"),await this.loadSiteStatus()}catch(n){h(`Failed: ${n.message}`,"error")}})})}updateView(){this.render(),this.renderScraperList(),(this.results.length>0||this.isSearching)&&this.renderResults(),this.bindEvents()}render(){this.container.innerHTML=`
      ${fe()}
      <div class="view-container scrapers-container" style="${this.viewMode==="main"?"":"display: none;"}">
        <div class="view-header">
          <h1>${m("plug")} Scrapers</h1>
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
                ${X.canDownload?`<button type="button" class="btn btn-secondary" id="torrent-search-btn" title="Search the torrent indexers (Prowlarr) for volume releases">${m("package")} Volumes</button>`:""}
              </div>
            </form>
          </div>

          <div id="scraper-results-container" class="scraper-results${this.results.length>0||this.isSearching?"":" scraper-results--hidden"}">
             <div class="empty-state">
               <div class="empty-icon">${m("search-x")}</div>
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
             ${this.browseScraper?this.getDomainIcon(this.browseScraper):m("globe")} Browse: ${this.browseScraper}
          </h1>
        </div>

        <div class="browse-controls-box">
          <div class="browse-form-group" style="flex: 1; min-width: 200px;">
            <label>${$e(this.browseConfig().queryLabel)}</label>
            <input type="text" id="browse-query" class="browse-input" value="${$e(this.browseQuery)}" placeholder="${$e(this.browseConfig().queryPlaceholder)}">
          </div>
          <div class="browse-form-group" style="min-width: 150px;">
            <label>Sort By</label>
            <select id="browse-sort" class="browse-select">
              ${this.browseConfig().sorts.map(t=>`<option value="${$e(t.value)}" ${this.browseSort===t.value?"selected":""}>${$e(t.label)}</option>`).join("")}
            </select>
          </div>
          <div class="browse-actions" style="display: flex; gap: 8px;">
            <button id="browse-apply-btn" class="btn btn-primary">Apply Filters</button>
            <button id="browse-refresh-btn" class="btn btn-secondary" title="Bypass cache and reload fresh results">${m("refresh-cw")} Refresh</button>
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
              <button id="preview-read-btn" class="btn btn-primary" style="background: var(--success);">${m("book-open")} Read Now</button>
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
    `,De()}renderScraperList(){const t=document.getElementById("scraper-cards-list");if(!t)return;if(this.scrapers.length===0){t.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">${m("plug")}</div>
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
              <span class="capability-label">${m("search")} Search</span>
              ${n.canSearch?'<span class="capability-pill capability-yes">✓ Supported</span>':'<span class="capability-pill capability-no">✗ Not available</span>'}
            </div>
            <div class="capability-row">
              <span class="capability-label">${m("plus")} Adding</span>
              <span class="capability-pill capability-yes">✓ Supported</span>
            </div>
            <div class="capability-row">
              <span class="capability-label">${m("book-open")} Browsing</span>
              ${n.canBrowse?'<span class="capability-pill capability-yes">✓ Supported</span>':`<span class="capability-pill capability-soon">${m("traffic-cone")} Coming soon</span>`}
            </div>
            ${this.renderSessionRow(n)}
          </div>

          <div class="scraper-card-footer">
            <button
              class="btn btn-secondary scraper-search-card-btn"
              data-scraper="${n.name}"
              ${n.canSearch?"":"disabled"}
              title="${n.canSearch?`Search in ${n.name}`:"Search not supported"}"
            >${m("search")} Search</button>
            <button
              class="btn btn-secondary scraper-browse-card-btn"
              data-scraper="${n.name}"
              ${n.canBrowse?"":"disabled"}
              title="${n.canBrowse?`Browse ${n.name}`:"Browsing coming soon"}"
            >${m("book-open")} Browse</button>
            ${n.supportsSession&&X.isAdmin?`
            <button
              class="btn btn-secondary scraper-session-solve-btn"
              data-scraper="${$e(n.name)}"
              title="Pass ${$e(n.name)}'s human check inside the scraper's own browser"
            >${m("lock-open")} Solve check</button>
            <button
              class="btn btn-secondary scraper-session-card-btn"
              data-scraper="${$e(n.name)}"
              title="Hand over cookies from a browser that completed ${$e(n.name)}'s human check"
            >Cookies</button>`:""}
          </div>

        </div>
      `);t.innerHTML=a.join("")}getDomainIcon(t){const s=t.toLowerCase();return s.includes("comix")?m("library"):s.includes("mangahere")?m("book-open"):s.includes("nhentai")?m("shield-alert"):s.includes("chained")?m("link"):m("globe")}bindEvents(){const t=document.getElementById("scraper-search-form");t&&t.addEventListener("submit",$=>{$.preventDefault();const v=document.getElementById("scraper-query");v&&v.value.trim()&&(this.currentQuery=v.value.trim(),this.performSearch())});const s=document.getElementById("torrent-search-btn");s&&s.addEventListener("click",async()=>{var y;const $=(((y=document.getElementById("scraper-query"))==null?void 0:y.value)||"").trim();let v=[];try{const L=await f.getBookmarks();v=(Array.isArray(L)?L:L.bookmarks||[]).map(w=>({id:w.id,title:w.title,alias:w.alias})).sort((w,x)=>(w.alias||w.title).localeCompare(x.alias||x.title))}catch{}Xa({query:$,library:v})});const a=document.getElementById("clear-target-btn");a&&a.addEventListener("click",()=>{this.currentTarget="all",this.updateView();const $=document.getElementById("scraper-query");$&&$.focus()}),this.bindCardEvents();const n=document.getElementById("exit-browse-btn");n&&n.addEventListener("click",()=>{this.viewMode="main",this.updateView()});const r=document.getElementById("browse-apply-btn");r&&r.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse()});const i=document.getElementById("browse-refresh-btn");i&&i.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse(!1,!0)});const c=document.getElementById("browse-query");c&&c.addEventListener("keypress",$=>{$.key==="Enter"&&r.click()});const l=document.getElementById("browse-load-more-btn");l&&l.addEventListener("click",()=>{!this.isBrowsing&&this.browsePage<this.browseTotalPages&&(this.browsePage++,this.performBrowse(!0))});const d=document.getElementById("preview-close-btn");d&&d.addEventListener("click",()=>{this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),document.getElementById("preview-info-modal").style.display="none"});const p=document.getElementById("preview-add-btn");p&&p.addEventListener("click",()=>{this.previewInfo&&this.previewInfo.url&&this.openAddModal(this.previewInfo.url,p)});const u=document.getElementById("preview-read-btn");u&&u.addEventListener("click",()=>{u.disabled||(this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.openTempReader())});const g=document.getElementById("temp-reader-close");g&&g.addEventListener("click",()=>{document.getElementById("temp-reader-overlay").style.display="none"})}async performSearch(){const t=document.getElementById("scraper-results-container"),s=document.getElementById("scraper-search-btn");if(!t||!s)return;this.isSearching=!0,t.style.display="block",s.textContent="Searching...",s.disabled=!0;const a=this.currentTarget==="all"?"all sites":this.currentTarget;t.innerHTML=`
      <div class="loading-state" style="margin-top: 2rem;">
        <div class="spinner"></div>
        <p>Searching ${a} for "${this.currentQuery}"...</p>
        <p class="subtitle">This may take a minute...</p>
      </div>
    `;try{const n=await f.get(`/scrapers/search?q=${encodeURIComponent(this.currentQuery)}&scraper=${encodeURIComponent(this.currentTarget)}`);if(n.success)this.results=n.results||[],this.renderResults();else throw new Error(n.error||"Failed to search scrapers")}catch(n){console.error("Search error",n),t.innerHTML=`<div class="error-state" style="margin-top: 2rem;">Failed to perform search: ${n.message}</div>`}finally{this.isSearching=!1,s.textContent="Search",s.disabled=!1}}renderResults(){const t=document.getElementById("scraper-results-container");if(!t)return;if(this.results.length===0){t.innerHTML=`
        <div class="empty-state" style="margin-top: 2rem;">
          <div class="empty-icon">${m("search-x")}</div>
          <p>No results found for "${this.currentQuery}".</p>
        </div>
      `;return}let s='<div class="library-grid" style="margin-top: 2rem;">';this.results.forEach(a=>{const n=a.cover||"";let r="";n.startsWith("/covers/")?r=n:n&&(r=`/api/scrapers/proxy-cover?url=${encodeURIComponent(n)}`);const i=r?Re(r,"Cover",{kind:"series",self:!0}):we("series");s+=`
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
      `}),s+="</div>",t.innerHTML=s,setTimeout(()=>{document.querySelectorAll(".scraper-result-card").forEach(a=>{a.addEventListener("click",n=>{n.target.closest(".add-from-search-btn")||window.open(a.dataset.url,"_blank")})}),document.querySelectorAll(".add-from-search-btn").forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation();const r=n.target.dataset.url;this.openAddModal(r,n.target)})})},100)}async _addToLibraryAndWait(t){const s=await f.addBookmark(t);if(!s.jobId)throw new Error("No job ID returned");return new Promise((a,n)=>{const r=setInterval(async()=>{try{const c=(await f.getQueueHistory(20)).find(l=>l.id===s.jobId);c&&(c.status==="completed"?(clearInterval(r),c.result&&c.result.bookmark?a(c.result.bookmark):n(new Error("Job completed but returned no bookmark"))):c.status==="failed"&&(clearInterval(r),n(new Error(c.error))))}catch{}},1e3)})}async openAddModal(t,s){const a=s?s.textContent:"+ Add to Library";s&&(s.textContent="Adding...");try{const n=await this._addToLibraryAndWait(t);document.getElementById("preview-info-modal").style.display="none",window.location.hash=`#/manga/${n.id}`}catch(n){alert("Error adding manga: "+n.message)}finally{s&&(s.textContent=a)}}async performBrowse(t=!1,s=!1){const a=document.getElementById("browse-results-container"),n=document.getElementById("browse-load-more-btn"),r=document.getElementById("browse-loading-indicator"),i=document.getElementById("browse-pagination");if(a){this.isBrowsing=!0,t?(n.style.display="none",r.style.display="block",document.getElementById("browse-loading-page").textContent=this.browsePage):(a.innerHTML=`
        <div class="loading-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="spinner"></div>
          <p>Browsing ${this.browseScraper}...</p>
        </div>
      `,i.style.display="none");try{let c=`/scrapers/browse?scraper=${encodeURIComponent(this.browseScraper)}&q=${encodeURIComponent(this.browseQuery)}&sort=${encodeURIComponent(this.browseSort)}&page=${this.browsePage}`;s&&(c+="&refresh=true");const l=await f.get(c);if(l.success)t?this.browseResults=[...this.browseResults,...l.results||[]]:this.browseResults=l.results||[],this.browseTotalPages=l.totalPages||1,this.renderBrowseResults(t);else throw new Error(l.error||"Failed to browse")}catch(c){console.error("Browse error",c),t?alert("Failed to load more results: "+c.message):a.innerHTML=`<div class="error-state" style="grid-column: 1/-1; margin-top: 2rem;">Failed to load browse results: ${c.message}</div>`}finally{this.isBrowsing=!1,t&&(n.style.display="inline-block",r.style.display="none")}}}renderBrowseResults(t){const s=document.getElementById("browse-results-container"),a=document.getElementById("browse-pagination");if(this.browseResults.length===0){s.innerHTML=`
        <div class="empty-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="empty-icon">${m("search-x")}</div>
          <p>No results found.</p>
        </div>
      `,a.style.display="none";return}let n="";this.browseResults.forEach((r,i)=>{const c=r.cover||"";let l="";c.startsWith("/covers/")?l=c:c&&(l=`/api/scrapers/proxy-cover?url=${encodeURIComponent(c)}`);const d=l?Re(l,"Cover",{kind:"series",self:!0}):we("series");n+=`
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
               ${t.cover?`<img src="${t.cover.startsWith("/covers/")?t.cover:"/api/scrapers/proxy-cover?url="+encodeURIComponent(t.cover)}" style="width: 100%; height: 100%; object-fit: cover;">`:we("series")}
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
    `,this._setReadBtnEnabled(r,!1);try{const c=await f.get(`/scrapers/info?url=${encodeURIComponent(t.url)}`,{signal:s});if(c.success&&c.info){this.previewInfo={...this.previewInfo,...c.info},Array.isArray(c.info.chapters)&&c.info.chapters.length>1&&((i=c.info.chapters[0])!=null&&i.url)&&(this.previewInfo.readUrl=c.info.chapters[0].url);let l="";c.info.tags&&c.info.tags.length>0&&(l=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Tags</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${c.info.tags.map(p=>`<span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); font-weight: normal; font-size: 0.75rem;">${p}</span>`).join("")}
                 </div>
               </div>
             `);let d="";c.info.artists&&c.info.artists.length>0&&(d=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Artists</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${c.info.artists.map(p=>`<span class="badge badge-chapters">${p}</span>`).join("")}
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
          `,this._setReadBtnEnabled(r,!0)}else document.getElementById("preview-extended-info").innerHTML='<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>',(this.previewInfo.galleryId||this.previewInfo.url)&&this._setReadBtnEnabled(r,!0)}catch(c){if(c.name==="AbortError"||s.aborted){console.log("Scraper details fetch aborted successfully.");return}console.error("Info error:",c),document.getElementById("preview-extended-info").innerHTML=`<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${c.message}</p>`,this._setReadBtnEnabled(r,!0)}}_setReadBtnEnabled(t,s){t&&(t.disabled=!s,t.style.opacity=s?"1":"0.5",t.style.cursor=s?"pointer":"not-allowed",t.style.pointerEvents=s?"auto":"none")}async openTempReader(){if(!this.previewInfo||!this.previewInfo.url&&!this.previewInfo.galleryId)return;const t=this.previewInfo.readUrl||this.previewInfo.url||`https://nhentai.net/g/${this.previewInfo.galleryId}/`,s=this.browseScraper||this.previewInfo.website;sessionStorage.setItem("streamPreviewUrl",t),sessionStorage.setItem("streamPreviewTitle",this.previewInfo.title||"Preview"),s?sessionStorage.setItem("streamPreviewScraper",s):sessionStorage.removeItem("streamPreviewScraper"),document.getElementById("preview-info-modal").style.display="none",window.location.hash="#/read/stream/preview"}}const ol=new rl,ma={disabledMangaIds:[],includeLists:!1,includeTrophies:!1,intervalMs:8e3,shuffle:!1};let q=null;function il(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ga(e,t=0){for(let s=e.length-1;s>t;s--){const a=t+Math.floor(Math.random()*(s-t+1));[e[s],e[a]]=[e[a],e[s]]}}function ll(e){let t;return typeof e=="string"?t=e:e&&typeof e=="object"&&(t=e.filename||e.path||e.name||e.url),t?(t.includes("/")&&(t=t.split("/").pop()),t.includes("\\")&&(t=t.split("\\").pop()),t):null}function cl(e){return m(e==="gallery"?"folder":e==="trophy"?"trophy":"book-open")}function dl(e,t){const s=[];for(const a of e){if(t.has(a.id))continue;const n=a.alias||a.title;for(const r of a.volumes)r.cover&&s.push({url:r.cover,title:n,subtitle:r.name,kind:"volume"})}return s}async function ul(){var a,n;const e=await f.getFavorites(),t=(a=e.listOrder)!=null&&a.length?e.listOrder:Object.keys(e.favorites||{}),s=[];for(const r of t)for(const i of((n=e.favorites)==null?void 0:n[r])||[])for(const c of i.imagePaths||[]){const l=ll(c);l&&s.push({url:`/api/public/chapter-images/${i.mangaId}/${i.chapterNum}/${encodeURIComponent(l)}`,title:r,subtitle:i.mangaTitle?`${i.mangaTitle} · Ch. ${i.chapterNum}`:`Ch. ${i.chapterNum}`,kind:"gallery"})}return s}async function pl(e){const t=await f.get("/trophy-pages"),s=await be.loadBookmarks().catch(()=>[]),a=r=>{const i=s.find(c=>c.id===r);return i?i.alias||i.title:"Trophies"},n=[];for(const[r,i]of Object.entries(t||{}))if(!e.has(r))for(const[c,l]of Object.entries(i||{})){const d=Object.keys(l||{});if(d.length===0)continue;let p;try{p=(await f.getChapterImages(r,c)).images||[]}catch{continue}for(const u of d){const g=p[u];if(!g)continue;let $=typeof g=="string"?g.split("/").pop():(g==null?void 0:g.filename)||(g==null?void 0:g.path);if($){try{$=decodeURIComponent($)}catch{}n.push({url:`/api/public/chapter-images/${r}/${c}/${encodeURIComponent($)}`,title:a(r),subtitle:`Ch. ${c} · Trophy`,kind:"trophy"})}}}return n}function mn(){q&&(clearTimeout(q.timer),q.playing&&q.slides.length>1&&(q.timer=setTimeout(()=>Me(q.index+1),q.config.intervalMs)))}function Ts(){if(!q)return;const e=q.slides[q.index],t=document.getElementById("ss-counter"),s=document.getElementById("ss-title"),a=document.getElementById("ss-subtitle");t&&(t.textContent=q.slides.length?`${q.index+1} / ${q.slides.length}`:""),s&&e&&(s.innerHTML=`${cl(e.kind)} ${il(e.title)}`),a&&e&&(a.textContent=e.subtitle||"")}function Me(e){if(!q||q.slides.length===0)return;const t=(e%q.slides.length+q.slides.length)%q.slides.length;q.index=t;const s=q.slides[t],a=++q.loadToken,n=1-q.activeLayer,r=q.layers[n],i=q.layers[q.activeLayer];r.onload=()=>{if(!(!q||a!==q.loadToken)&&(q.activeLayer=n,r.classList.add("active"),i.classList.remove("active"),Ts(),mn(),q.slides.length>1)){const c=q.slides[(t+1)%q.slides.length];c&&(new Image().src=c.url)}},r.onerror=()=>{if(!(!q||a!==q.loadToken)){if(q.slides.splice(t,1),q.slides.length===0){As();return}Me(t)}},r.src=s.url,Ts()}function fa(e){if(!q)return;q.playing=e;const t=document.getElementById("ss-play");t&&(t.innerHTML=m(e?"pause":"play")),mn()}function Ce(){if(!q)return;const e=document.getElementById("slideshow");e&&(e.classList.remove("controls-hidden"),clearTimeout(q.hideTimer),q.hideTimer=setTimeout(()=>{var t;(t=document.getElementById("slideshow"))==null||t.classList.add("controls-hidden")},3e3))}function Bs(){H.go("/settings")}function As(){var t;const e=document.getElementById("slideshow");e&&(e.innerHTML=`
        <div class="slideshow-empty">
            ${m("images",{size:48})}
            <p>Nothing to show yet — add covers to your volumes, or enable galleries and trophies in Settings.</p>
            <button id="ss-empty-back" class="btn btn-primary">Back to Settings</button>
        </div>
    `,(t=document.getElementById("ss-empty-back"))==null||t.addEventListener("click",Bs))}const hl={mount:async()=>{const e=document.getElementById("app");e.innerHTML=`
            <div class="slideshow" id="slideshow">
                <div class="slideshow-stage" id="ss-stage">
                    <img class="slideshow-img" alt="">
                    <img class="slideshow-img" alt="">
                </div>
                <div class="slideshow-ui">
                    <div class="slideshow-topbar">
                        <button class="slideshow-btn" id="ss-exit" title="Exit slideshow">${m("x")}</button>
                        <div class="slideshow-counter" id="ss-counter"></div>
                        <button class="slideshow-btn" id="ss-fullscreen" title="Toggle fullscreen">${m("maximize")}</button>
                    </div>
                    <div class="slideshow-bottombar">
                        <div class="slideshow-caption">
                            <div class="slideshow-title" id="ss-title"></div>
                            <div class="slideshow-subtitle" id="ss-subtitle"></div>
                        </div>
                        <div class="slideshow-transport">
                            <button class="slideshow-btn" id="ss-prev" title="Previous">${m("chevron-left")}</button>
                            <button class="slideshow-btn" id="ss-play" title="Pause">${m("pause")}</button>
                            <button class="slideshow-btn" id="ss-next" title="Next">${m("chevron-right")}</button>
                        </div>
                    </div>
                </div>
                <div class="slideshow-loading" id="ss-loading">${m("loader",{spin:!0})} Loading covers…</div>
            </div>
        `;const t=document.getElementById("ss-stage");q={slides:[],index:0,playing:!0,timer:null,hideTimer:null,loadToken:0,activeLayer:0,layers:[...t.querySelectorAll(".slideshow-img")],config:{...ma},keyHandler:null,moveHandler:null},document.getElementById("ss-exit").addEventListener("click",Bs),document.getElementById("ss-prev").addEventListener("click",()=>{Me(q.index-1),Ce()}),document.getElementById("ss-next").addEventListener("click",()=>{Me(q.index+1),Ce()}),document.getElementById("ss-play").addEventListener("click",()=>{fa(!q.playing),Ce()}),document.getElementById("ss-fullscreen").addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>h("Fullscreen not supported","info"))}),t.addEventListener("click",l=>{const d=l.clientX/window.innerWidth;if(d<.3)Me(q.index-1),Ce();else if(d>.7)Me(q.index+1),Ce();else{const p=document.getElementById("slideshow");p.classList.contains("controls-hidden")?Ce():(clearTimeout(q.hideTimer),p.classList.add("controls-hidden"))}}),q.keyHandler=l=>{if(q)switch(l.key){case"ArrowLeft":Me(q.index-1),Ce();break;case"ArrowRight":Me(q.index+1),Ce();break;case" ":l.preventDefault(),fa(!q.playing),Ce();break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});break;case"Escape":document.fullscreenElement||Bs();break}},document.addEventListener("keydown",q.keyHandler),q.moveHandler=()=>Ce(),document.addEventListener("mousemove",q.moveHandler),Ce();let s={};try{s=await f.get("/settings")||{}}catch{}q.config={...ma,...s.slideshow||{}};const a=new Set(q.config.disabledMangaIds||[]);let n=[];try{n=await f.getAllVolumes()}catch(l){console.error(l)}q.slides=dl(n,a),q.config.shuffle&&ga(q.slides,-1);const r=document.getElementById("ss-loading");q.slides.length>0&&(r==null||r.remove(),Me(0));const i=l=>{var p;if(!q||l.length===0)return;const d=q.slides.length===0;q.slides.push(...l),q.config.shuffle&&ga(q.slides,d?-1:q.index),d?((p=document.getElementById("ss-loading"))==null||p.remove(),Me(0)):Ts()},c=[];q.config.includeLists&&c.push(ul().then(i).catch(l=>console.warn("Slideshow: galleries unavailable",l))),q.config.includeTrophies&&c.push(pl(a).then(i).catch(l=>console.warn("Slideshow: trophies unavailable",l))),q.slides.length===0&&(c.length===0?As():Promise.allSettled(c).then(()=>{q&&q.slides.length===0&&As()}))},unmount:()=>{q&&(clearTimeout(q.timer),clearTimeout(q.hideTimer),document.removeEventListener("keydown",q.keyHandler),document.removeEventListener("mousemove",q.moveHandler),document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),q=null)}};class ml{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(t,s){this.routes.set(t,s)}async navigate(){console.log("[Router] navigate called");const s=(window.location.hash.slice(1)||"/").split("?")[0],[a,...n]=s.split("/").filter(Boolean),r=`/${a||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let i=this.routes.get(r);!i&&this.routes.has("/")&&(i=this.routes.get("/")),i&&(this.currentRoute=r,this.currentView=i,i.mount&&(console.log("[Router] calling mount on view module"),await i.mount(n)),De())}go(t){window.location.hash=t}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),De())}}const H=new ml;H.register("/",Rr);H.register("/manga",si);H.register("/read",lo);H.register("/series",di);H.register("/settings",fi);H.register("/admin",vi);H.register("/favorites",Ii);H.register("/queue",al);H.register("/scrapers",ol);H.register("/slideshow",hl);export{oe as S,se as a,yl as i,H as r,vl as s};
