import{a as w}from"./api-BR1iiO1w.js";const z=Object.create(null);z.open="0";z.close="1";z.ping="2";z.pong="3";z.message="4";z.upgrade="5";z.noop="6";const le=Object.create(null);Object.keys(z).forEach(n=>{le[z[n]]=n});const Le={type:"error",data:"parser error"},Ze=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",et=typeof ArrayBuffer=="function",tt=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,Ne=({type:n,data:e},t,s)=>Ze&&e instanceof Blob?t?s(e):je(e,s):et&&(e instanceof ArrayBuffer||tt(e))?t?s(e):je(new Blob([e]),s):s(z[n]+(e||"")),je=(n,e)=>{const t=new FileReader;return t.onload=function(){const s=t.result.split(",")[1];e("b"+(s||""))},t.readAsDataURL(n)};function Ge(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let we;function Lt(n,e){if(Ze&&n.data instanceof Blob)return n.data.arrayBuffer().then(Ge).then(e);if(et&&(n.data instanceof ArrayBuffer||tt(n.data)))return e(Ge(n.data));Ne(n,!1,t=>{we||(we=new TextEncoder),e(we.encode(t))})}const We="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",te=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<We.length;n++)te[We.charCodeAt(n)]=n;const Pt=n=>{let e=n.length*.75,t=n.length,s,i=0,r,o,c,l;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const y=new ArrayBuffer(e),u=new Uint8Array(y);for(s=0;s<t;s+=4)r=te[n.charCodeAt(s)],o=te[n.charCodeAt(s+1)],c=te[n.charCodeAt(s+2)],l=te[n.charCodeAt(s+3)],u[i++]=r<<2|o>>4,u[i++]=(o&15)<<4|c>>2,u[i++]=(c&3)<<6|l&63;return y},It=typeof ArrayBuffer=="function",De=(n,e)=>{if(typeof n!="string")return{type:"message",data:nt(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:Bt(n.substring(1),e)}:le[t]?n.length>1?{type:le[t],data:n.substring(1)}:{type:le[t]}:Le},Bt=(n,e)=>{if(It){const t=Pt(n);return nt(t,e)}else return{base64:!0,data:n}},nt=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},st="",Tt=(n,e)=>{const t=n.length,s=new Array(t);let i=0;n.forEach((r,o)=>{Ne(r,!1,c=>{s[o]=c,++i===t&&e(s.join(st))})})},At=(n,e)=>{const t=n.split(st),s=[];for(let i=0;i<t.length;i++){const r=De(t[i],e);if(s.push(r),r.type==="error")break}return s};function xt(){return new TransformStream({transform(n,e){Lt(n,t=>{const s=t.length;let i;if(s<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,s);else if(s<65536){i=new Uint8Array(3);const r=new DataView(i.buffer);r.setUint8(0,126),r.setUint16(1,s)}else{i=new Uint8Array(9);const r=new DataView(i.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(s))}n.data&&typeof n.data!="string"&&(i[0]|=128),e.enqueue(i),e.enqueue(t)})}})}let Ee;function ae(n){return n.reduce((e,t)=>e+t.length,0)}function re(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let s=0;for(let i=0;i<e;i++)t[i]=n[0][s++],s===n[0].length&&(n.shift(),s=0);return n.length&&s<n[0].length&&(n[0]=n[0].slice(s)),t}function Rt(n,e){Ee||(Ee=new TextDecoder);const t=[];let s=0,i=-1,r=!1;return new TransformStream({transform(o,c){for(t.push(o);;){if(s===0){if(ae(t)<1)break;const l=re(t,1);r=(l[0]&128)===128,i=l[0]&127,i<126?s=3:i===126?s=1:s=2}else if(s===1){if(ae(t)<2)break;const l=re(t,2);i=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),s=3}else if(s===2){if(ae(t)<8)break;const l=re(t,8),y=new DataView(l.buffer,l.byteOffset,l.length),u=y.getUint32(0);if(u>Math.pow(2,21)-1){c.enqueue(Le);break}i=u*Math.pow(2,32)+y.getUint32(4),s=3}else{if(ae(t)<i)break;const l=re(t,i);c.enqueue(De(r?l:Ee.decode(l),e)),s=0}if(i===0||i>n){c.enqueue(Le);break}}}})}const it=4;function I(n){if(n)return Mt(n)}function Mt(n){for(var e in I.prototype)n[e]=I.prototype[e];return n}I.prototype.on=I.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};I.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};I.prototype.off=I.prototype.removeListener=I.prototype.removeAllListeners=I.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var s,i=0;i<t.length;i++)if(s=t[i],s===e||s.fn===e){t.splice(i,1);break}return t.length===0&&delete this._callbacks["$"+n],this};I.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],s=1;s<arguments.length;s++)e[s-1]=arguments[s];if(t){t=t.slice(0);for(var s=0,i=t.length;s<i;++s)t[s].apply(this,e)}return this};I.prototype.emitReserved=I.prototype.emit;I.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};I.prototype.hasListeners=function(n){return!!this.listeners(n).length};const ye=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),D=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Ot="arraybuffer";function at(n,...e){return e.reduce((t,s)=>(n.hasOwnProperty(s)&&(t[s]=n[s]),t),{})}const Nt=D.setTimeout,Dt=D.clearTimeout;function be(n,e){e.useNativeTimers?(n.setTimeoutFn=Nt.bind(D),n.clearTimeoutFn=Dt.bind(D)):(n.setTimeoutFn=D.setTimeout.bind(D),n.clearTimeoutFn=D.clearTimeout.bind(D))}const Ft=1.33;function Vt(n){return typeof n=="string"?qt(n):Math.ceil((n.byteLength||n.size)*Ft)}function qt(n){let e=0,t=0;for(let s=0,i=n.length;s<i;s++)e=n.charCodeAt(s),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(s++,t+=4);return t}function rt(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Ut(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function Ht(n){let e={},t=n.split("&");for(let s=0,i=t.length;s<i;s++){let r=t[s].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class zt extends Error{constructor(e,t,s){super(e),this.description=t,this.context=s,this.type="TransportError"}}class Fe extends I{constructor(e){super(),this.writable=!1,be(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,s){return super.emitReserved("error",new zt(e,t,s)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=De(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Ut(e);return t.length?"?"+t:""}}class jt extends Fe{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let s=0;this._polling&&(s++,this.once("pollComplete",function(){--s||t()})),this.writable||(s++,this.once("drain",function(){--s||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=s=>{if(this.readyState==="opening"&&s.type==="open"&&this.onOpen(),s.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(s)};At(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Tt(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=rt()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let ot=!1;try{ot=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Gt=ot;function Wt(){}class Qt extends jt{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let s=location.port;s||(s=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||s!==e.port}}doWrite(e,t){const s=this.request({method:"POST",data:e});s.on("success",t),s.on("error",(i,r)=>{this.onError("xhr post error",i,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,s)=>{this.onError("xhr poll error",t,s)}),this.pollXhr=e}}class H extends I{constructor(e,t,s){super(),this.createRequest=e,be(this,s),this._opts=s,this._method=s.method||"GET",this._uri=t,this._data=s.data!==void 0?s.data:null,this._create()}_create(){var e;const t=at(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const s=this._xhr=this.createRequest(t);try{s.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){s.setDisableHeaderCheck&&s.setDisableHeaderCheck(!0);for(let i in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(i)&&s.setRequestHeader(i,this._opts.extraHeaders[i])}}catch{}if(this._method==="POST")try{s.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{s.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(s),"withCredentials"in s&&(s.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(s.timeout=this._opts.requestTimeout),s.onreadystatechange=()=>{var i;s.readyState===3&&((i=this._opts.cookieJar)===null||i===void 0||i.parseCookies(s.getResponseHeader("set-cookie"))),s.readyState===4&&(s.status===200||s.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof s.status=="number"?s.status:0)},0))},s.send(this._data)}catch(i){this.setTimeoutFn(()=>{this._onError(i)},0);return}typeof document<"u"&&(this._index=H.requestsCount++,H.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Wt,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete H.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}H.requestsCount=0;H.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Qe);else if(typeof addEventListener=="function"){const n="onpagehide"in D?"pagehide":"unload";addEventListener(n,Qe,!1)}}function Qe(){for(let n in H.requests)H.requests.hasOwnProperty(n)&&H.requests[n].abort()}const Kt=function(){const n=ct({xdomain:!1});return n&&n.responseType!==null}();class Yt extends Qt{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Kt&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new H(ct,this.uri(),e)}}function ct(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Gt))return new XMLHttpRequest}catch{}if(!e)try{return new D[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const lt=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Jt extends Fe{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,s=lt?{}:at(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(s.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,s)}catch(i){return this.emitReserved("error",i)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],i=t===e.length-1;Ne(s,this.supportsBinary,r=>{try{this.doWrite(s,r)}catch{}i&&ye(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=rt()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const ke=D.WebSocket||D.MozWebSocket;class Xt extends Jt{createSocket(e,t,s){return lt?new ke(e,t,s):t?new ke(e,t):new ke(e)}doWrite(e,t){this.ws.send(t)}}class Zt extends Fe{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Rt(Number.MAX_SAFE_INTEGER,this.socket.binaryType),s=e.readable.pipeThrough(t).getReader(),i=xt();i.readable.pipeTo(e.writable),this._writer=i.writable.getWriter();const r=()=>{s.read().then(({done:c,value:l})=>{c||(this.onPacket(l),r())}).catch(c=>{})};r();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],i=t===e.length-1;this._writer.write(s).then(()=>{i&&ye(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const en={websocket:Xt,webtransport:Zt,polling:Yt},tn=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,nn=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Pe(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),s=n.indexOf("]");t!=-1&&s!=-1&&(n=n.substring(0,t)+n.substring(t,s).replace(/:/g,";")+n.substring(s,n.length));let i=tn.exec(n||""),r={},o=14;for(;o--;)r[nn[o]]=i[o]||"";return t!=-1&&s!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=sn(r,r.path),r.queryKey=an(r,r.query),r}function sn(n,e){const t=/\/{2,9}/g,s=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&s.splice(0,1),e.slice(-1)=="/"&&s.splice(s.length-1,1),s}function an(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(s,i,r){i&&(t[i]=r)}),t}const Ie=typeof addEventListener=="function"&&typeof removeEventListener=="function",de=[];Ie&&addEventListener("offline",()=>{de.forEach(n=>n())},!1);class Q extends I{constructor(e,t){if(super(),this.binaryType=Ot,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const s=Pe(e);t.hostname=s.host,t.secure=s.protocol==="https"||s.protocol==="wss",t.port=s.port,s.query&&(t.query=s.query)}else t.host&&(t.hostname=Pe(t.host).host);be(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(s=>{const i=s.prototype.name;this.transports.push(i),this._transportsByName[i]=s}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Ht(this.opts.query)),Ie&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},de.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=it,t.transport=e,this.id&&(t.sid=this.id);const s=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](s)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Q.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",Q.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let s=0;s<this.writeBuffer.length;s++){const i=this.writeBuffer[s].data;if(i&&(t+=Vt(i)),s>0&&t>this._maxPayload)return this.writeBuffer.slice(0,s);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,ye(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,s){return this._sendPacket("message",e,t,s),this}send(e,t,s){return this._sendPacket("message",e,t,s),this}_sendPacket(e,t,s,i){if(typeof t=="function"&&(i=t,t=void 0),typeof s=="function"&&(i=s,s=null),this.readyState==="closing"||this.readyState==="closed")return;s=s||{},s.compress=s.compress!==!1;const r={type:e,data:t,options:s};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),i&&this.once("flush",i),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},s=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?s():e()}):this.upgrading?s():e()),this}_onError(e){if(Q.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Ie&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const s=de.indexOf(this._offlineEventListener);s!==-1&&de.splice(s,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}Q.protocol=it;class rn extends Q{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),s=!1;Q.priorWebsocketSuccess=!1;const i=()=>{s||(t.send([{type:"ping",data:"probe"}]),t.once("packet",f=>{if(!s)if(f.type==="pong"&&f.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;Q.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{s||this.readyState!=="closed"&&(u(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const b=new Error("probe error");b.transport=t.name,this.emitReserved("upgradeError",b)}}))};function r(){s||(s=!0,u(),t.close(),t=null)}const o=f=>{const b=new Error("probe error: "+f);b.transport=t.name,r(),this.emitReserved("upgradeError",b)};function c(){o("transport closed")}function l(){o("socket closed")}function y(f){t&&f.name!==t.name&&r()}const u=()=>{t.removeListener("open",i),t.removeListener("error",o),t.removeListener("close",c),this.off("close",l),this.off("upgrading",y)};t.once("open",i),t.once("error",o),t.once("close",c),this.once("close",l),this.once("upgrading",y),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{s||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let s=0;s<e.length;s++)~this.transports.indexOf(e[s])&&t.push(e[s]);return t}}let on=class extends rn{constructor(e,t={}){const s=typeof e=="object"?e:t;(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(i=>en[i]).filter(i=>!!i)),super(e,s)}};function cn(n,e="",t){let s=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),s=Pe(n)),s.port||(/^(http|ws)$/.test(s.protocol)?s.port="80":/^(http|ws)s$/.test(s.protocol)&&(s.port="443")),s.path=s.path||"/";const r=s.host.indexOf(":")!==-1?"["+s.host+"]":s.host;return s.id=s.protocol+"://"+r+":"+s.port+e,s.href=s.protocol+"://"+r+(t&&t.port===s.port?"":":"+s.port),s}const ln=typeof ArrayBuffer=="function",dn=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,dt=Object.prototype.toString,un=typeof Blob=="function"||typeof Blob<"u"&&dt.call(Blob)==="[object BlobConstructor]",hn=typeof File=="function"||typeof File<"u"&&dt.call(File)==="[object FileConstructor]";function Ve(n){return ln&&(n instanceof ArrayBuffer||dn(n))||un&&n instanceof Blob||hn&&n instanceof File}function ue(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,s=n.length;t<s;t++)if(ue(n[t]))return!0;return!1}if(Ve(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return ue(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&ue(n[t]))return!0;return!1}function pn(n){const e=[],t=n.data,s=n;return s.data=Be(t,e),s.attachments=e.length,{packet:s,buffers:e}}function Be(n,e){if(!n)return n;if(Ve(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let s=0;s<n.length;s++)t[s]=Be(n[s],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=Be(n[s],e));return t}return n}function gn(n,e){return n.data=Te(n.data,e),delete n.attachments,n}function Te(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=Te(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=Te(n[t],e));return n}const mn=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var k;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(k||(k={}));class fn{constructor(e){this.replacer=e}encode(e){return(e.type===k.EVENT||e.type===k.ACK)&&ue(e)?this.encodeAsBinary({type:e.type===k.EVENT?k.BINARY_EVENT:k.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===k.BINARY_EVENT||e.type===k.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=pn(e),s=this.encodeAsString(t.packet),i=t.buffers;return i.unshift(s),i}}class qe extends I{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const s=t.type===k.BINARY_EVENT;s||t.type===k.BINARY_ACK?(t.type=s?k.EVENT:k.ACK,this.reconstructor=new vn(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(Ve(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const s={type:Number(e.charAt(0))};if(k[s.type]===void 0)throw new Error("unknown packet type "+s.type);if(s.type===k.BINARY_EVENT||s.type===k.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(r,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");s.attachments=Number(o)}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););s.nsp=e.substring(r,t)}else s.nsp="/";const i=e.charAt(t+1);if(i!==""&&Number(i)==i){const r=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}s.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(qe.isPayloadValid(s.type,r))s.data=r;else throw new Error("invalid payload")}return s}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case k.CONNECT:return Ke(t);case k.DISCONNECT:return t===void 0;case k.CONNECT_ERROR:return typeof t=="string"||Ke(t);case k.EVENT:case k.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&mn.indexOf(t[0])===-1);case k.ACK:case k.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class vn{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=gn(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function Ke(n){return Object.prototype.toString.call(n)==="[object Object]"}const yn=Object.freeze(Object.defineProperty({__proto__:null,Decoder:qe,Encoder:fn,get PacketType(){return k}},Symbol.toStringTag,{value:"Module"}));function V(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const bn=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class ut extends I{constructor(e,t,s){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,s&&s.auth&&(this.auth=s.auth),this._opts=Object.assign({},s),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[V(e,"open",this.onopen.bind(this)),V(e,"packet",this.onpacket.bind(this)),V(e,"error",this.onerror.bind(this)),V(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var s,i,r;if(bn.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const o={type:k.EVENT,data:t};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const u=this.ids++,f=t.pop();this._registerAckCallback(u,f),o.id=u}const c=(i=(s=this.io.engine)===null||s===void 0?void 0:s.transport)===null||i===void 0?void 0:i.writable,l=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,t){var s;const i=(s=this.flags.timeout)!==null&&s!==void 0?s:this._opts.ackTimeout;if(i===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===e&&this.sendBuffer.splice(c,1);t.call(this,new Error("operation has timed out"))},i),o=(...c)=>{this.io.clearTimeoutFn(r),t.apply(this,c)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...t){return new Promise((s,i)=>{const r=(o,c)=>o?i(o):s(c);r.withError=!0,t.push(r),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const s={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((i,...r)=>(this._queue[0],i!==null?s.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(i)):(this._queue.shift(),t&&t(null,...r)),s.pending=!1,this._drainQueue())),this._queue.push(s),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:k.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(s=>String(s.id)===e)){const s=this.acks[e];delete this.acks[e],s.withError&&s.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case k.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case k.EVENT:case k.BINARY_EVENT:this.onevent(e);break;case k.ACK:case k.BINARY_ACK:this.onack(e);break;case k.DISCONNECT:this.ondisconnect();break;case k.CONNECT_ERROR:this.destroy();const s=new Error(e.data.message);s.data=e.data.data,this.emitReserved("connect_error",s);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const s of t)s.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let s=!1;return function(...i){s||(s=!0,t.packet({type:k.ACK,id:e,data:i}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:k.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const s of t)s.apply(this,e.data)}}}function Z(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}Z.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};Z.prototype.reset=function(){this.attempts=0};Z.prototype.setMin=function(n){this.ms=n};Z.prototype.setMax=function(n){this.max=n};Z.prototype.setJitter=function(n){this.jitter=n};class Ae extends I{constructor(e,t){var s;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,be(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((s=t.randomizationFactor)!==null&&s!==void 0?s:.5),this.backoff=new Z({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const i=t.parser||yn;this.encoder=new i.Encoder,this.decoder=new i.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new on(this.uri,this.opts);const t=this.engine,s=this;this._readyState="opening",this.skipReconnect=!1;const i=V(t,"open",function(){s.onopen(),e&&e()}),r=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),e?e(c):this.maybeReconnectOnOpen()},o=V(t,"error",r);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{i(),r(new Error("timeout")),t.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(i),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(V(e,"ping",this.onping.bind(this)),V(e,"data",this.ondata.bind(this)),V(e,"error",this.onerror.bind(this)),V(e,"close",this.onclose.bind(this)),V(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){ye(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let s=this.nsps[e];return s?this._autoConnect&&!s.active&&s.connect():(s=new ut(this,e,t),this.nsps[e]=s),s}_destroy(e){const t=Object.keys(this.nsps);for(const s of t)if(this.nsps[s].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let s=0;s<t.length;s++)this.engine.write(t[s],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var s;this.cleanup(),(s=this.engine)===null||s===void 0||s.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const s=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(i=>{i?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",i)):e.onreconnect()}))},t);this.opts.autoUnref&&s.unref(),this.subs.push(()=>{this.clearTimeoutFn(s)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const ee={};function he(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=cn(n,e.path||"/socket.io"),s=t.source,i=t.id,r=t.path,o=ee[i]&&r in ee[i].nsps,c=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return c?l=new Ae(s,e):(ee[i]||(ee[i]=new Ae(s,e)),l=ee[i]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(he,{Manager:Ae,Socket:ut,io:he,connect:he});class wn{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=he({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(t=>{this.socket.emit("subscribe:manga",t)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",t=>{console.log("[Socket] Disconnected:",t)}),this.socket.on("connect_error",t=>{console.error("[Socket] Connection error:",t.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var t;this.subscribedMangas.add(e),(t=this.socket)!=null&&t.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var t;this.subscribedMangas.delete(e),(t=this.socket)!=null&&t.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,t){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),this.socket&&this.socket.on(e,t)}off(e,t){this.listeners.has(e)&&this.listeners.get(e).delete(t),this.socket&&this.socket.off(e,t)}emit(e,t){var s;(s=this.socket)!=null&&s.connected&&this.socket.emit(e,t)}}const j={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone"},N=new wn;function q(n="manga"){return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">📚 Manga<span>Reader</span></a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${n==="manga"?"active":""}" data-view="manga" title="Manga view">📚</button>
            <button class="view-toggle-btn ${n==="series"?"active":""}" data-view="series" title="Series view">📖</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">⭐ Favorites</button>
          <button class="btn btn-secondary" id="scan-btn">📁 Scan Folder</button>
          <button class="btn btn-primary" id="add-manga-btn">+ Add Manga</button>
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
          <button class="view-toggle-btn ${n==="manga"?"active":""}" data-view="manga">📚 Manga</button>
          <button class="view-toggle-btn ${n==="series"?"active":""}" data-view="series">📖 Series</button>
        </div>
        <button class="mobile-menu-item" id="mobile-favorites-btn">⭐ Favorites</button>
        <button class="mobile-menu-item" id="mobile-scan-btn">📁 Scan Folder</button>
        <button class="mobile-menu-item primary" id="mobile-add-btn">+ Add Manga</button>
        <button class="mobile-menu-item" id="mobile-logout-btn">🚪 Logout</button>
        <a href="#/admin" class="mobile-menu-item">🔧 Admin</a>
        <a href="#/settings" class="mobile-menu-item">⚙️ Settings</a>
      </div>
    </header>
  `}function se(){const n=document.getElementById("hamburger-btn"),e=document.getElementById("mobile-menu");n&&e&&n.addEventListener("click",()=>{e.classList.toggle("hidden")});const t=document.getElementById("logout-btn"),s=document.getElementById("mobile-logout-btn"),i=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};t&&t.addEventListener("click",i),s&&s.addEventListener("click",i),document.querySelectorAll("[data-view]").forEach(o=>{o.addEventListener("click",()=>{const c=o.dataset.view;localStorage.setItem("library_view_mode",c),document.querySelectorAll("[data-view]").forEach(l=>{l.classList.toggle("active",l.dataset.view===c)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:c}}))})});const r=document.querySelector(".logo");r&&r.addEventListener("click",o=>{localStorage.removeItem("library_active_category"),window.dispatchEvent(new CustomEvent("clearFilters"))})}function p(n,e="info"){document.querySelectorAll(".toast").forEach(i=>{i.classList.contains("show")&&i.classList.remove("show")});const s=document.createElement("div");s.className=`toast toast-${e}`,s.textContent=n,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("show")),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},3e3)}let m={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:"",sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0};function ht(n){return[...n].sort((e,t)=>{var s,i;switch(m.sortBy){case"az":return(e.alias||e.title).localeCompare(t.alias||t.title);case"za":return(t.alias||t.title).localeCompare(e.alias||e.title);case"lastread":return(t.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const r=((s=e.chapters)==null?void 0:s.length)||e.uniqueChapters||0;return(((i=t.chapters)==null?void 0:i.length)||t.uniqueChapters||0)-r}case"updated":default:return(t.updatedAt||"").localeCompare(e.updatedAt||"")}})}function pt(n){var u,f,b;const e=n.alias||n.title,t=n.downloadedCount??((u=n.downloadedChapters)==null?void 0:u.length)??0,s=new Set(n.excludedChapters||[]),i=(n.chapters||[]).filter(E=>!s.has(E.number)),r=new Set(i.map(E=>E.number)).size||n.uniqueChapters||0,o=n.readCount??((f=n.readChapters)==null?void 0:f.length)??0,c=(n.updatedCount??((b=n.updatedChapters)==null?void 0:b.length)??0)>0,l=n.localCover?`/api/public/covers/${n.id}/${encodeURIComponent(n.localCover.split(/[/\\]/).pop())}`:n.cover,y=n.source==="local";return`
    <div class="manga-card" data-id="${n.id}">
      <div class="manga-card-cover">
        ${l?`<img src="${l}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:`<div class="placeholder">${y?"💾":"📚"}</div>`}
        <div class="manga-card-badges">
          ${o>0?`<span class="badge badge-read" title="Read">${o}</span>`:""}
          <span class="badge badge-chapters" title="Total">${r}</span>
          ${t>0?`<span class="badge badge-downloaded" title="Downloaded">${t}</span>`:""}
          ${c?'<span class="badge badge-warning" title="Updates available">!</span>':""}
          ${n.autoCheck?'<span class="badge badge-monitored" title="Monitored">🔔</span>':""}
          ${m.activeCategory==="Favorites"?'<span class="badge badge-play" title="Click to Read">▶</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function gt(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function En(n){var i;const e=n.alias||n.title,t=((i=n.entries)==null?void 0:i.length)||n.entry_count||0;let s=null;return n.localCover&&n.coverBookmarkId?s=`/api/public/covers/${n.coverBookmarkId}/${encodeURIComponent(n.localCover.split(/[/\\]/).pop())}`:n.cover&&(s=n.cover),`
    <div class="manga-card series-card" data-series-id="${n.id}">
      <div class="manga-card-cover">
        ${s?`<img src="${s}" alt="${e}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>'}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${t} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function pe(){const n=localStorage.getItem("library_view_mode");if(n&&n!==m.viewMode&&(m.viewMode=n),m.viewMode==="series"){const s=m.series.map(En).join("");return`
        ${q(m.viewMode)}
<div class="container">
  <div class="library-grid" id="library-grid">
    ${m.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p></div>'}
  </div>
</div>
`}if(m.activeCategory==="Favorites")return $.go("/favorites"),"";let e=m.activeCategory?m.bookmarks.filter(s=>(s.categories||[]).includes(m.activeCategory)):m.bookmarks;if(m.artistFilter&&(e=e.filter(s=>(s.artists||[]).includes(m.artistFilter))),m.searchQuery){const s=m.searchQuery.toLowerCase();e=e.filter(i=>(i.title||"").toLowerCase().includes(s)||(i.alias||"").toLowerCase().includes(s))}e=ht(e);const t=e.map(pt).join("");return`
    ${q(m.viewMode)}
    <div class="container">
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" id="library-search" placeholder="Search manga..." value="${m.searchQuery}" autocomplete="off">
          ${m.searchQuery?'<button class="search-clear" id="search-clear">×</button>':""}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${m.sortBy==="updated"?"selected":""}>Recently Updated</option>
          <option value="az" ${m.sortBy==="az"?"selected":""}>A → Z</option>
          <option value="za" ${m.sortBy==="za"?"selected":""}>Z → A</option>
          <option value="lastread" ${m.sortBy==="lastread"?"selected":""}>Last Read</option>
          <option value="chapters" ${m.sortBy==="chapters"?"selected":""}>Most Chapters</option>
        </select>
      </div>
      ${m.artistFilter?`
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">🎨</span>
          <span class="artist-filter-name">${m.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      `:""}
      <div class="library-grid" id="library-grid">
        ${m.loading?'<div class="loading-spinner"></div>':t||gt()}
      </div>
    </div>
    ${kn()}
    ${$n()}
    `}function kn(){const{activeCategory:n}=m,e=Array.isArray(m.categories)?m.categories:[];return`
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${n?"has-filter":""}" id="category-fab-btn">
        ${n||"🏷️"}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn">⚙️</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${n?"":"active"}" data-category="">All</button>
          ${e.map(t=>`
            <button class="category-menu-item ${n===t?"active":""}" data-category="${t}">
              ${t}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
      `}function $n(){return`
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
      `}function xe(){m.activeCategory=null,m.artistFilter=null,localStorage.removeItem("library_active_category"),G()}function mt(){document.getElementById("app").addEventListener("click",L=>{const h=L.target.closest(".manga-card");if(h){if(h.classList.contains("gallery-card")){const P=h.dataset.gallery;$.go(`/ read / gallery / ${encodeURIComponent(P)} `);return}const d=h.dataset.id,v=h.dataset.seriesId;if(v){$.go(`/ series / ${v} `);return}if(d){if(m.activeCategory==="Favorites"){const P=m.bookmarks.find(S=>S.id===d);if(P){let S=P.last_read_chapter;if(!S&&P.chapters&&P.chapters.length>0&&(S=[...P.chapters].sort((K,J)=>K.number-J.number)[0].number),S){$.go(`/ read / ${d}/${S}`);return}else p("No chapters available to read","warning")}}$.go(`/manga/${d}`)}}}),se();const e=document.getElementById("favorites-btn"),t=document.getElementById("scan-btn");document.getElementById("quick-check-btn");const s=document.getElementById("mobile-favorites-btn"),i=document.getElementById("mobile-scan-btn");document.getElementById("mobile-quick-check-btn");const r=()=>{m.activeCategory==="Favorites"?$e(null):$e("Favorites")};e&&e.addEventListener("click",r),s&&s.addEventListener("click",r);const o=async()=>{try{t&&(t.disabled=!0,t.textContent="Scanning..."),i&&(i.textContent="Scanning..."),p("Scanning downloads folder...","info"),await w.scanLibrary(),p("Scan complete. Refreshing...","success"),await Re(),G()}catch(L){p("Scan failed: "+L.message,"error")}finally{t&&(t.disabled=!1,t.textContent="📁 Scan Folder"),i&&(i.textContent="📁 Scan Folder")}};t&&t.addEventListener("click",o),i&&i.addEventListener("click",o),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",L=>{m.viewMode=L.detail.mode;const h=document.getElementById("app");h.innerHTML=pe(),mt(),se()}));const c=document.getElementById("category-fab-btn"),l=document.getElementById("category-fab-menu");c&&l&&(c.addEventListener("click",()=>{l.classList.toggle("hidden")}),l.addEventListener("click",L=>{const h=L.target.closest(".category-menu-item");if(h){const d=h.dataset.category||null;$e(d),l.classList.add("hidden")}}));const y=document.getElementById("artist-filter-badge");y&&y.addEventListener("click",()=>{m.artistFilter=null,G()});const u=document.getElementById("library-search");u&&(u.addEventListener("input",L=>{var d;m.searchQuery=L.target.value;const h=document.getElementById("library-grid");if(h){let v=m.activeCategory?m.bookmarks.filter(S=>(S.categories||[]).includes(m.activeCategory)):m.bookmarks;if(m.artistFilter&&(v=v.filter(S=>(S.artists||[]).includes(m.artistFilter))),m.searchQuery){const S=m.searchQuery.toLowerCase();v=v.filter(R=>(R.title||"").toLowerCase().includes(S)||(R.alias||"").toLowerCase().includes(S))}v=ht(v),h.innerHTML=v.map(pt).join("")||gt();const P=document.getElementById("search-clear");!P&&m.searchQuery?(u.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(d=document.getElementById("search-clear"))==null||d.addEventListener("click",()=>{m.searchQuery="",u.value="",G()})):P&&!m.searchQuery&&P.remove()}}),m.searchQuery&&u.focus());const f=document.getElementById("search-clear");f&&f.addEventListener("click",()=>{m.searchQuery="",G()});const b=document.getElementById("library-sort");b&&b.addEventListener("change",L=>{m.sortBy=L.target.value,localStorage.setItem("library_sort",m.sortBy),G()}),window.removeEventListener("clearFilters",xe),window.addEventListener("clearFilters",xe);const E=document.getElementById("add-manga-btn"),C=document.getElementById("add-modal"),_=document.getElementById("add-modal-close"),T=document.getElementById("add-modal-cancel"),x=document.getElementById("add-modal-submit");E&&C&&E.addEventListener("click",()=>C.classList.add("open")),_&&_.addEventListener("click",()=>C.classList.remove("open")),T&&T.addEventListener("click",()=>C.classList.remove("open")),x&&x.addEventListener("click",async()=>{const L=document.getElementById("manga-url"),h=L.value.trim();if(!h){p("Please enter a URL","error");return}try{x.disabled=!0,x.textContent="Adding...",await w.addBookmark(h),p("Manga added successfully!","success"),C.classList.remove("open"),L.value="",await Re(),G()}catch(d){p("Failed to add manga: "+d.message,"error")}finally{x.disabled=!1,x.textContent="Add"}});const F=document.getElementById("empty-add-btn");F&&C&&F.addEventListener("click",()=>C.classList.add("open"));const O=C==null?void 0:C.querySelector(".modal-overlay");O&&O.addEventListener("click",()=>C.classList.remove("open"))}function $e(n){m.activeCategory=n,n?localStorage.setItem("library_active_category",n):localStorage.removeItem("library_active_category"),G()}async function Re(){try{const[n,e,t,s]=await Promise.all([w.getBookmarks(),w.get("/categories"),w.get("/series"),w.getFavorites()]);m.bookmarks=n,m.categories=e.categories||[],m.series=t||[],m.favorites=s||{favorites:{},listOrder:[]},m.loading=!1}catch{p("Failed to load library","error"),m.loading=!1}}async function G(){const n=document.getElementById("app"),e=localStorage.getItem("library_active_category");m.activeCategory!==e&&(m.activeCategory=e),m.loading&&(n.innerHTML=pe()),m.bookmarks.length===0&&m.loading&&await Re(),n.innerHTML=pe(),mt()}function Cn(){window.removeEventListener("clearFilters",xe)}const _n={mount:G,unmount:Cn,render:pe};let a={manga:null,chapter:null,images:[],trophyPages:{},mode:"webtoon",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!1,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,favoriteLists:[],navigationDirection:null,nextChapterImage:null,nextChapterNum:null};function ge(){var l;if(a.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!a.manga||!a.images.length)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const n=a.manga.alias||a.manga.title,e=(l=a.chapter)==null?void 0:l.number,s=A().length,i=a.images.length;let r,o;a.mode==="webtoon"?(r=i-1,o=`${i} pages`):a.singlePageMode?(r=i-1,o=`${a.currentPage+1} / ${i}`):(r=s-1,o=`${a.currentPage+1} / ${s}`);const c=yt();return`
    <div class="reader ${a.mode}-mode ${a.showControls?"":"controls-hidden"}">
      <!-- Header -->
      <div class="reader-header">
        <button class="btn-icon" id="reader-close-btn">×</button>
        <div class="reader-title">
          <span class="manga-name">${n}</span>
          <span class="chapter-name">Ch. ${e}</span>
        </div>
        <div class="reader-header-actions">
          ${a.isGalleryMode?"":`
          ${a.mode==="manga"?`
            <button class="btn-icon ${a.singlePageMode?"active":""}" id="single-page-btn" title="${a.singlePageMode?"Switch to double page":"Switch to single page"}">
              ${a.singlePageMode?"1️⃣":"2️⃣"}
            </button>
            <button class="btn-icon ${c?"active":""}" id="trophy-btn" title="${c?"Unmark trophy":"Mark as trophy"}">🏆</button>
          `:""}
          <button class="btn-icon" id="fullscreen-btn" title="Toggle fullscreen">⛶</button>
          <button class="btn-icon" id="reader-settings-btn">⚙️</button>
          `}
        </div>
      </div>
      
      <!-- Page Manipulation Toolbar -->
      ${a.isGalleryMode?"":`
      <div class="reader-toolbar" id="reader-toolbar">
        <button class="btn-icon toolbar-btn" id="rotate-btn" title="Rotate 90° CW">🔄</button>
        ${a.mode==="manga"&&!a.singlePageMode?`
          <button class="btn-icon toolbar-btn" id="swap-btn" title="Swap pages in spread">⇄</button>
        `:""}
        ${a.singlePageMode||a.mode==="webtoon"?`
          <button class="btn-icon toolbar-btn" id="split-btn" title="Split wide image into halves">✂️</button>
        `:""}
        <button class="btn-icon toolbar-btn danger" id="delete-page-btn" title="Delete page">🗑️</button>
        <div class="favorites-btn-wrapper">
          <button class="btn-icon toolbar-btn" id="favorites-btn" title="Add to favorites">⭐</button>
          <div class="favorites-dropdown hidden" id="favorites-dropdown">
            <div class="favorites-dropdown-title">Add to list:</div>
            <div class="favorites-dropdown-list" id="favorites-list-items"></div>
          </div>
        </div>
      </div>
      `}
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${a.mode==="webtoon"?`zoom: ${a.zoom}%`:""}">
        ${a.isGalleryMode?Sn():a.mode==="webtoon"?ft():vt()}
      </div>
      
      <!-- Footer -->
      <div class="reader-footer">
        <button class="btn btn-secondary" id="prev-chapter-btn">← Prev</button>
        <div class="page-slider-container">
          ${a.mode!=="webtoon"?`
          <input type="range" class="page-slider" id="page-slider"
            min="0" max="${r}" value="${a.currentPage}"
          >
          `:""}
          <span class="page-indicator" id="page-indicator">${o}</span>
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
              <button class="btn ${a.mode==="webtoon"?"btn-primary":"btn-secondary"}" data-mode="webtoon">Webtoon</button>
              <button class="btn ${a.mode==="manga"?"btn-primary":"btn-secondary"}" data-mode="manga">Manga</button>
            </div>
          </div>
          ${a.mode==="webtoon"?`
          <div class="setting-row">
            <label>Zoom: ${a.zoom}%</label>
            <input type="range" min="50" max="200" value="${a.zoom}" id="zoom-slider">
          </div>
          `:`
          <div class="setting-row">
            <label>Direction</label>
            <div class="btn-group">
              <button class="btn ${a.direction==="rtl"?"btn-primary":"btn-secondary"}" data-direction="rtl">RTL ←</button>
              <button class="btn ${a.direction==="ltr"?"btn-primary":"btn-secondary"}" data-direction="ltr">→ LTR</button>
            </div>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="first-page-single" ${a.firstPageSingle?"checked":""}> First Page Single
            </label>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="last-page-single" ${a.lastPageSingle?"checked":""}> Last Page Single
            </label>
          </div>
          </div>
          `}
          <button class="btn btn-secondary" id="close-settings-btn">Close</button>
        </div>
      </div>
    </div>
  `}function Sn(){return`
    <div class="gallery-pages">
      ${a.images.map((n,e)=>{const t=n.displayMode||"single",s=n.displaySide||"left",i=n.urls||[n.url];return t==="double"&&i.length>=2?`
            <div class="gallery-page double-page side-${s}" data-page="${e}">
              <img src="${i[0]}" alt="Page ${e+1}A" loading="lazy">
              <img src="${i[1]}" alt="Page ${e+1}B" loading="lazy">
            </div>
          `:`
            <div class="gallery-page single-page" data-page="${e}">
              <img src="${i[0]}" alt="Page ${e+1}" loading="lazy">
            </div>
          `}).join("")}
    </div>
  `}function ft(){return`
    <div class="webtoon-pages">
      ${a.images.map((n,e)=>{const t=typeof n=="string"?n:n.url,s=a.trophyPages[e];return`
        <div class="webtoon-page ${s?"trophy-page":""}" data-page="${e}">
          ${s?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${t}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function vt(){if(a.singlePageMode)return Ln();const e=A()[a.currentPage];if(!e)return"";if(e.type==="link"){const t=e.pages[0],s=a.images[t],i=typeof s=="string"?s:s.url,r=a.trophyPages[t];return`
        <div class="manga-spread ${a.direction}">
          <div class="manga-page ${r?"trophy-page":""}">
            ${r?'<div class="trophy-indicator">🏆</div>':""}
            <img src="${i}" alt="Page ${t+1}">
          </div>
          <div class="manga-page link-page" id="link-page">
            <div class="link-overlay">Ch. ${e.nextChapter} →</div>
            <img src="${e.nextImage}" alt="Next chapter preview">
          </div>
        </div>
      `}return`
    <div class="manga-spread ${a.direction}">
      ${e.map(t=>{const s=a.images[t],i=typeof s=="string"?s:s.url,r=a.trophyPages[t];return`
        <div class="manga-page ${r?"trophy-page":""}">
          ${r?'<div class="trophy-indicator">🏆</div>':""}
          <img src="${i}" alt="Page ${t+1}">
        </div>
      `}).join("")}
    </div>
  `}function Ln(){const n=a.currentPage,e=a.trophyPages[n];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[r,o]=e.pages,c=a.images[r],l=a.images[o],y=typeof c=="string"?c:c==null?void 0:c.url,u=typeof l=="string"?l:l==null?void 0:l.url;if(y&&u)return`
            <div class="manga-spread ${a.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${y}" alt="Page ${r+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${u}" alt="Page ${o+1}"></div>
            </div>
            `}const t=a.images[n];if(!t)return"";const s=typeof t=="string"?t:t.url,i=a.trophyPages[n];return`
    <div class="manga-spread single ${a.direction}">
      <div class="manga-page ${i?"trophy-page":""}">
        ${i?'<div class="trophy-indicator">🏆</div>':""}
        <img src="${s}" alt="Page ${n+1}">
      </div>
    </div>
  `}function A(){const n=[],e=a.images.length;let t=0;for(a.firstPageSingle&&e>0&&(n.push([0]),t=1);t<e;){if(a.trophyPages[t]){n.push([t]),t++;continue}if(a.lastPageSingle&&t===e-1){a.nextChapterImage?n.push({type:"link",pages:[t],nextImage:a.nextChapterImage,nextChapter:a.nextChapterNum}):n.push([t]),t++;break}t+1<e?a.trophyPages[t+1]?(n.push([t]),t++):a.lastPageSingle&&t+1===e-1?(n.push([t]),a.nextChapterImage?n.push({type:"link",pages:[t+1],nextImage:a.nextChapterImage,nextChapter:a.nextChapterNum}):n.push([t+1]),t+=2):(n.push([t,t+1]),t+=2):(n.push([t]),t++)}return n}function yt(){if(a.singlePageMode)return!!a.trophyPages[a.currentPage];const e=A()[a.currentPage];return e?e.some(t=>!!a.trophyPages[t]):!1}function Ue(){if(a.singlePageMode)return[a.currentPage];const e=A()[a.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function Pn(){if(!a.manga||!a.chapter||a.isGalleryMode)return;const n=Ue();if(n.length===0)return;const e=n.some(s=>!!a.trophyPages[s]),t=a.singlePageMode||n.length===1;if(e){const s=[...n];if(a.singlePageMode){const i=a.trophyPages[a.currentPage];i&&!i.isSingle&&i.pages&&i.pages.length>1&&(s.length=0,s.push(...i.pages))}s.forEach(i=>delete a.trophyPages[i]),p(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{n.forEach(i=>{a.trophyPages[i]={isSingle:t,pages:[...n]}});const s=t?"single":"double";p(`Page${n.length>1?"s":""} marked as trophy (${s}) 🏆`,"success")}try{await w.saveTrophyPages(a.manga.id,a.chapter.number,a.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}Y(),bt()}function bt(){const n=document.getElementById("trophy-btn");if(n){const e=yt();n.classList.toggle("active",e),n.title=e?"Unmark trophy":"Mark as trophy"}}async function X(){if(!a.manga||!a.chapter||a.isGalleryMode||!a.images.length)return;let n=1;if(a.mode==="manga")if(a.singlePageMode)n=a.currentPage+1;else{const t=A()[a.currentPage];t&&t.length>0&&(n=t[0]+1)}else{const e=document.getElementById("reader-content");if(e){const t=e.querySelectorAll("img"),s=e.scrollTop;let i=0;t.forEach((r,o)=>{s>=i&&(n=o+1),i+=r.offsetHeight})}}try{await w.updateReadingProgress(a.manga.id,a.chapter.number,n,a.images.length)}catch(e){console.error("Failed to save progress:",e)}}function wt(){var t,s,i,r,o,c,l,y,u,f,b,E,C,_,T,x,F,O,L;const n=document.getElementById("app");(t=document.getElementById("reader-close-btn"))==null||t.addEventListener("click",async()=>{await X(),a.manga&&a.manga.id!=="gallery"?$.go(`/manga/${a.manga.id}`):$.go("/")}),(s=document.getElementById("reader-back-btn"))==null||s.addEventListener("click",()=>{$.go("/")}),(i=document.getElementById("reader-settings-btn"))==null||i.addEventListener("click",()=>{var h;(h=document.getElementById("reader-settings"))==null||h.classList.toggle("hidden")}),(r=document.getElementById("close-settings-btn"))==null||r.addEventListener("click",()=>{var h;(h=document.getElementById("reader-settings"))==null||h.classList.add("hidden")}),(o=document.getElementById("single-page-btn"))==null||o.addEventListener("click",()=>{if(a.singlePageMode){const h=A();let d=0;for(let v=0;v<h.length;v++)if(h[v].includes(a.currentPage)){d=v;break}a.singlePageMode=!1,a.currentPage=d}else{const d=A()[a.currentPage];a.singlePageMode=!0,a.currentPage=d?d[0]:0}_e()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{Pn()}),n.querySelectorAll("[data-mode]").forEach(h=>{h.addEventListener("click",()=>{var P,S;const d=h.dataset.mode;let v=Tn();if(a.mode=d,localStorage.setItem("reader_mode",a.mode),d==="webtoon")a.currentPage=v;else if(a.singlePageMode)a.currentPage=v;else{const R=A();let K=0;for(let J=0;J<R.length;J++)if(R[J].includes(v)){K=J;break}a.currentPage=K}(P=a.manga)!=null&&P.id&&((S=a.chapter)!=null&&S.number)&&ce(),_e(),d==="webtoon"&&setTimeout(()=>{const R=document.getElementById("reader-content");if(R){const K=R.querySelectorAll("img");K[v]&&K[v].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),n.querySelectorAll("[data-direction]").forEach(h=>{h.addEventListener("click",async()=>{var d,v;a.direction=h.dataset.direction,localStorage.setItem("reader_direction",a.direction),(d=a.manga)!=null&&d.id&&((v=a.chapter)!=null&&v.number)&&await ce(),_e()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async h=>{a.firstPageSingle=h.target.checked,await ce(),Y()}),(y=document.getElementById("last-page-single"))==null||y.addEventListener("change",async h=>{var d,v;a.lastPageSingle=h.target.checked,await ce(),a.lastPageSingle&&((d=a.manga)!=null&&d.id)&&((v=a.chapter)!=null&&v.number)?await Et():(a.nextChapterImage=null,a.nextChapterNum=null),Y()}),(u=document.getElementById("zoom-slider"))==null||u.addEventListener("input",h=>{a.zoom=parseInt(h.target.value);const d=document.getElementById("reader-content");d&&(d.style.zoom=`${a.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",h=>{const d=parseInt(h.target.value),v=document.getElementById("page-indicator");v&&(a.singlePageMode?v.textContent=`${d+1} / ${a.images.length}`:v.textContent=`${d+1} / ${A().length}`)}),e.addEventListener("change",h=>{a.currentPage=parseInt(h.target.value),Y()})),a.mode==="manga"){const h=document.getElementById("reader-content");h==null||h.addEventListener("click",d=>{const v=h.getBoundingClientRect();d.clientX-v.left<v.width/2?Ct():$t()})}document.addEventListener("keydown",kt),(f=document.getElementById("prev-chapter-btn"))==null||f.addEventListener("click",()=>fe(-1)),(b=document.getElementById("next-chapter-btn"))==null||b.addEventListener("click",()=>fe(1)),a.mode==="webtoon"&&((E=document.getElementById("reader-content"))==null||E.addEventListener("click",()=>{var h;a.showControls=!a.showControls,(h=document.querySelector(".reader"))==null||h.classList.toggle("controls-hidden",!a.showControls)})),(C=document.getElementById("rotate-btn"))==null||C.addEventListener("click",async()=>{const h=Ce();if(!(!h||!a.manga||!a.chapter))try{p("Rotating...","info");const d=await w.rotatePage(a.manga.id,a.chapter.number,h);d.images&&(await oe(d.images),p("Page rotated","success"))}catch(d){p("Rotate failed: "+d.message,"error")}}),(_=document.getElementById("swap-btn"))==null||_.addEventListener("click",async()=>{const d=A()[a.currentPage];if(!d||d.length!==2||!a.manga||!a.chapter){p("Select a spread with 2 pages to swap","info");return}const v=me(a.images[d[0]]),P=me(a.images[d[1]]);if(!(!v||!P))try{p("Swapping...","info");const S=await w.swapPages(a.manga.id,a.chapter.number,v,P);S.images&&(await oe(S.images),p("Pages swapped","success"))}catch(S){p("Swap failed: "+S.message,"error")}}),(T=document.getElementById("split-btn"))==null||T.addEventListener("click",async()=>{const h=Ce();if(!(!h||!a.manga||!a.chapter)&&confirm("Split this page into left and right halves? This is permanent."))try{p("Splitting...","info");const d=await w.splitPage(a.manga.id,a.chapter.number,h);d.images&&(await oe(d.images),p("Page split into halves","success"))}catch(d){p("Split failed: "+d.message,"error")}}),(x=document.getElementById("delete-page-btn"))==null||x.addEventListener("click",async()=>{const h=Ce();if(!(!h||!a.manga||!a.chapter)&&confirm(`Delete page "${h}" permanently? This cannot be undone.`))try{p("Deleting...","info");const d=await w.deletePage(a.manga.id,a.chapter.number,h);d.images&&(await oe(d.images),p("Page deleted","success"))}catch(d){p("Delete failed: "+d.message,"error")}}),(F=document.getElementById("favorites-btn"))==null||F.addEventListener("click",async()=>{const h=document.getElementById("favorites-dropdown");if(!h)return;if(h.classList.contains("hidden"))try{const v=await w.getFavorites(),P=Object.keys(v.favorites||v||{});a.favoriteLists=P;const S=document.getElementById("favorites-list-items");S&&(P.length===0?S.innerHTML='<div class="favorites-dropdown-empty">No lists yet</div>':(S.innerHTML=P.map(R=>`<button class="favorites-dropdown-item" data-list="${R}">${R}</button>`).join(""),S.querySelectorAll(".favorites-dropdown-item").forEach(R=>{R.addEventListener("click",async()=>{await In(R.dataset.list),h.classList.add("hidden")})})))}catch(v){p("Failed to load favorites: "+v.message,"error");return}h.classList.toggle("hidden")}),document.addEventListener("click",h=>{const d=document.getElementById("favorites-dropdown"),v=document.getElementById("favorites-btn");d&&!d.contains(h.target)&&h.target!==v&&d.classList.add("hidden")}),(O=document.getElementById("fullscreen-btn"))==null||O.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{p("Fullscreen not supported","info")})}),(L=document.getElementById("link-page"))==null||L.addEventListener("click",()=>{a.nextChapterNum&&a.manga&&(X(),a.navigationDirection="next-linked",$.go(`/read/${a.manga.id}/${a.nextChapterNum}`))}),document.body.classList.add("reader-active")}function me(n){var i;const e=typeof n=="string"?n:(n==null?void 0:n.url)||((i=n==null?void 0:n.urls)==null?void 0:i[0]);if(!e)return null;const s=e.split("?")[0].split("/");return decodeURIComponent(s[s.length-1])}function Ce(){const n=Ue();return n.length===0?null:me(a.images[n[0]])}async function oe(n){const e=Date.now();if(a.images=n.map(t=>t+(t.includes("?")?"&":"?")+`_t=${e}`),a.mode==="manga")if(a.singlePageMode)a.currentPage=Math.min(a.currentPage,a.images.length-1);else{const t=A();a.currentPage=Math.min(a.currentPage,t.length-1)}a.currentPage=Math.max(0,a.currentPage),Y()}async function In(n){if(!a.manga||!a.chapter)return;const e=Ue();if(e.length===0){p("No page selected","info");return}const t=e.map(r=>{const o=me(a.images[r]);return o?{filename:o}:null}).filter(Boolean),s=e.length>1?"double":"single",i={mangaId:a.manga.id,chapterNum:a.chapter.number,title:`${a.manga.alias||a.manga.title} Ch.${a.chapter.number} p${e[0]+1}`,imagePaths:t,displayMode:s,displaySide:a.direction==="rtl"?"right":"left"};try{await w.addFavoriteItem(n,i),p(`Added to "${n}" ⭐`,"success")}catch(r){p("Failed to add favorite: "+r.message,"error")}}async function Et(){var n,e;if(!(!((n=a.manga)!=null&&n.id)||!((e=a.chapter)!=null&&e.number)))try{const t=await w.getNextChapterPreview(a.manga.id,a.chapter.number);a.nextChapterImage=t.firstImage||null,a.nextChapterNum=t.nextChapter||null}catch{a.nextChapterImage=null,a.nextChapterNum=null}}function Bn(n,e){return new Promise(t=>{const s=document.createElement("div");s.className="version-modal-overlay",s.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${n.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const i=s.querySelector(".version-list");n.forEach((r,o)=>{const c=document.createElement("button");c.className="version-item",c.textContent=`Version ${o+1}`,c.addEventListener("click",()=>{s.remove(),t(r)}),i.appendChild(c)}),s.querySelector(".version-cancel").addEventListener("click",()=>{s.remove(),t(null)}),s.addEventListener("click",r=>{r.target===s&&(s.remove(),t(null))}),document.body.appendChild(s)})}function Tn(){if(a.mode==="webtoon"){const n=document.getElementById("reader-content");if(n){const e=n.querySelectorAll("img");if(e.length>0){const t=n.scrollTop;if(t>10){let s=0;for(let i=0;i<e.length;i++){const r=e[i].offsetHeight;if(s+r>t)return i;s+=r}}}}return 0}else{if(a.singlePageMode)return a.currentPage;{const e=A()[a.currentPage];return e&&e.length>0?e[0]:0}}}function kt(n){if(n.key==="Escape"){X(),a.manga&&$.go(`/manga/${a.manga.id}`);return}a.mode==="manga"&&(n.key==="ArrowLeft"?Ct():n.key==="ArrowRight"&&$t())}function $t(){const n=a.singlePageMode?a.images.length-1:A().length-1;a.currentPage<n?(a.currentPage++,Y()):(X(),fe(1))}function Ct(){a.currentPage>0?(a.currentPage--,Y()):fe(-1)}function Y(){const n=document.getElementById("reader-content");if(n){n.innerHTML=a.mode==="webtoon"?ft():vt();const e=document.getElementById("page-indicator");e&&(a.singlePageMode?e.textContent=`${a.currentPage+1} / ${a.images.length}`:e.textContent=`${a.currentPage+1} / ${A().length}`);const t=document.getElementById("page-slider");t&&(t.value=a.currentPage,t.max=a.singlePageMode?a.images.length-1:A().length-1),bt()}}function _e(){const n=document.getElementById("app");n&&(n.innerHTML=ge(),wt())}async function fe(n){if(!a.manga||!a.chapter)return;await X();const t=[...a.manga.downloadedChapters||[]].sort((r,o)=>r-o),i=t.indexOf(a.chapter.number)+n;i>=0&&i<t.length?(a.navigationDirection=n<0?"prev":null,$.go(`/read/${a.manga.id}/${t[i]}`)):p(n>0?"Last chapter":"First chapter","info")}async function Se(n,e,t){var s,i;try{if(a.mode=localStorage.getItem("reader_mode")||"webtoon",a.direction=localStorage.getItem("reader_direction")||"rtl",n==="gallery"){const r=decodeURIComponent(e),c=(await w.getFavorites()).favorites[r]||[];a.images=[];for(const l of c){const y=l.imagePaths||[],u=[];for(const f of y){let b;typeof f=="string"?b=f:f&&typeof f=="object"&&(b=f.filename||f.path||f.name||f.url,b&&b.includes("/")&&(b=b.split("/").pop()),b&&b.includes("\\")&&(b=b.split("\\").pop())),b&&u.push(`/api/public/chapter-images/${l.mangaId}/${l.chapterNum}/${encodeURIComponent(b)}`)}u.length>0&&a.images.push({urls:u,displayMode:l.displayMode||"single",displaySide:l.displaySide||"left"})}a.manga={id:"gallery",title:r,alias:r},a.chapter={number:"Gallery"},a.isGalleryMode=!0,a.images.length===0&&p("Gallery is empty","warning")}else{a.isGalleryMode=!1;const r=await w.getBookmark(n);a.manga=r,a.chapter=((s=r.chapters)==null?void 0:s.find(u=>u.number===parseFloat(e)))||{number:parseFloat(e)};const o=t?`/bookmarks/${n}/chapters/${e}/images?versionUrl=${encodeURIComponent(t)}`:`/bookmarks/${n}/chapters/${e}/images`,c=await w.get(o);a.images=c.images||[];try{const u=await w.getChapterSettings(n,e);u&&(u.mode&&(a.mode=u.mode),u.direction&&(a.direction=u.direction),u.firstPageSingle!==void 0&&(a.firstPageSingle=u.firstPageSingle),u.lastPageSingle!==void 0&&(a.lastPageSingle=u.lastPageSingle))}catch(u){console.warn("Failed to load chapter settings",u)}try{const u=await w.getTrophyPages(n,e);a.trophyPages=u||{}}catch(u){a.trophyPages={},console.warn("Failed to load trophy pages",u)}const l=parseFloat(e),y=(i=r.readingProgress)==null?void 0:i[l];if(y&&y.page<y.totalPages)if(a.mode==="manga")if(a.singlePageMode)a.currentPage=Math.max(0,y.page-1);else{const u=Math.max(0,y.page-1),f=A();let b=0;for(let E=0;E<f.length;E++){const C=f[E],_=Array.isArray(C)?C:C.pages||[];if(_.includes(u)||_[0]>=u){b=E;break}b=E}a.currentPage=b}else a.currentPage=0,a._resumeScrollToPage=y.page-1;else a.currentPage=0}if(a.navigationDirection==="prev"&&a.mode==="manga"){if(a.singlePageMode)a.currentPage=Math.max(0,a.images.length-1);else{const r=A();a.currentPage=Math.max(0,r.length-1)}a.navigationDirection=null}else a.navigationDirection==="next-linked"&&a.mode==="manga"&&(a.currentPage=a.firstPageSingle?1:0),a.navigationDirection=null;a.lastPageSingle&&await Et(),a.loading=!1}catch(r){console.error("Failed to load chapter:",r),p("Failed to load chapter: "+(r.message||"Unknown error"),"error"),a.loading=!1}}async function An(n=[]){console.log("[Reader] mount called with params:",n);const[e,t]=n;if(!e||!t){$.go("/");return}const s=document.getElementById("app");a.loading=!0,a.images=[],a.singlePageMode=!1,a._resumeScrollToPage=null,a.nextChapterImage=null,a.nextChapterNum=null,s.innerHTML=ge();try{const i=await w.getBookmark(e),r=i.downloadedVersions||{},o=new Set(i.deletedChapterUrls||[]),c=r[parseFloat(t)];let l=[];if(Array.isArray(c)&&(l=c.filter(y=>!o.has(y))),l.length>1){const y=await Bn(l,t);if(y===null){$.go(`/manga/${e}`);return}await Se(e,t,y)}else await Se(e,t)}catch{await Se(e,t)}if(s.innerHTML=ge(),wt(),a.mode==="webtoon"&&a._resumeScrollToPage!=null){const i=a._resumeScrollToPage;a._resumeScrollToPage=null,setTimeout(()=>{const r=document.getElementById("reader-content");if(r){const o=r.querySelectorAll("img");o[i]&&o[i].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function xn(){await X(),document.body.classList.remove("reader-active"),document.removeEventListener("keydown",kt),a.manga=null,a.chapter=null,a.images=[],a.loading=!0,a.singlePageMode=!1,a._resumeScrollToPage=null}async function ce(){if(!(!a.manga||!a.chapter||a.manga.id==="gallery"))try{await w.updateChapterSettings(a.manga.id,a.chapter.number,{mode:a.mode,direction:a.direction,firstPageSingle:a.firstPageSingle,lastPageSingle:a.lastPageSingle})}catch(n){console.error("Failed to save settings:",n)}}async function _t(n){try{const e=await w.getBookmark(n),t=e.downloadedChapters||[],s=new Set(e.readChapters||[]),i=e.readingProgress||{},r=[...t].sort((c,l)=>c-l);let o=null;for(const c of r){const l=i[c];if(l&&l.page<l.totalPages&&!s.has(c)){o=c;break}}if(o===null){for(const c of r)if(!s.has(c)){o=c;break}}o===null&&r.length>0&&(o=r[0]),o!==null?$.go(`/read/${n}/${o}`):p("No downloaded chapters to read","info")}catch(e){p("Failed to continue reading: "+e.message,"error")}}const Rn={mount:An,unmount:xn,render:ge,continueReading:_t},ne=50;let g={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null};function Me(){var h;if(g.loading)return`
      ${q()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const n=g.manga;if(!n)return`
      ${q()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=n.alias||n.title,t=n.chapters||[],s=new Set(n.downloadedChapters||[]),i=new Set(n.readChapters||[]),r=new Set(n.excludedChapters||[]),o=new Set(n.deletedChapterUrls||[]),c=n.volumes||[],l=new Set;c.forEach(d=>{(d.chapters||[]).forEach(v=>l.add(v))});let y;g.filter==="hidden"?y=t.filter(d=>r.has(d.number)||o.has(d.url)):y=t.filter(d=>!r.has(d.number)&&!o.has(d.url));const u=y.filter(d=>!l.has(d.number));let f=[];if(g.activeVolume){const d=new Set(g.activeVolume.chapters||[]);f=y.filter(v=>d.has(v.number))}else f=u;const b=new Map;f.forEach(d=>{b.has(d.number)||b.set(d.number,[]),b.get(d.number).push(d)});let E=Array.from(b.entries()).sort((d,v)=>d[0]-v[0]);g.filter==="downloaded"?E=E.filter(([d])=>s.has(d)):g.filter==="not-downloaded"?E=E.filter(([d])=>!s.has(d)):g.filter==="main"?E=E.filter(([d])=>Number.isInteger(d)):g.filter==="extra"&&(E=E.filter(([d])=>!Number.isInteger(d)));const C=Math.max(1,Math.ceil(E.length/ne));g.currentPage>=C&&(g.currentPage=Math.max(0,C-1));const _=g.currentPage*ne,x=[...E.slice(_,_+ne)].reverse(),F=b.size,O=[...b.keys()].filter(d=>s.has(d)).length;i.size;let L="";if(g.activeVolume){const d=g.activeVolume;let v=null;d.local_cover?v=`/api/public/covers/${n.id}/${encodeURIComponent(d.local_cover.split(/[/\\]/).pop())}`:d.cover&&(v=d.cover),L=`
      ${q()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${v?`<img src="${v}" alt="${d.name}">`:'<div class="placeholder">📚</div>'}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${n.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${d.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${F} Chapters</span>
                ${O>0?`<span class="meta-item downloaded">${O} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${n.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${d.id}">✏️ Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const d=n.localCover?`/api/public/covers/${n.id}/${encodeURIComponent(n.localCover.split(/[/\\]/).pop())}`:n.cover;L=`
        ${q()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${d?`<img src="${d}" alt="${e}">`:'<div class="placeholder">📚</div>'}
              </div>
              <div class="manga-detail-info">
                <h1>${e}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent">${n.website||"Local"}</span>
                  <span class="meta-item">${((h=n.chapters)==null?void 0:h.length)||0} Total Chapters</span>
                  ${s.size>0?`<span class="meta-item downloaded">${s.size} Downloaded</span>`:""}
                  ${i.size>0?`<span class="meta-item">${i.size} Read</span>`:""}
                </div>
                <div class="manga-detail-actions">
                  <button class="btn btn-primary" id="continue-btn">
                    ▶ ${n.lastReadChapter?"Continue":"Start"} Reading
                  </button>
              <button class="btn btn-secondary" id="download-all-btn">
                ↓ Download All
              </button>
              <button class="btn btn-secondary" id="refresh-btn">🔄 Refresh</button>
              <button class="btn btn-secondary" id="edit-btn">✏️ Edit</button>
            </div>
            ${n.description?`<p class="manga-description">${n.description}</p>`:""}
            <div class="manga-tags">
              ${(n.tags||[]).map(v=>`<span class="tag">${v}</span>`).join("")}
            </div>
          </div>
        </div>
      `}return`
    ${L}
        
        ${g.activeVolume?"":Nn(n,s)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${g.filter==="all"?"active":""}" data-filter="all">
                All (${b.size})
              </button>
              <button class="filter-btn ${g.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${O})
              </button>
              <button class="filter-btn ${g.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${g.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${C>1?Ye(C):""}
          
          <div class="chapter-list">
            ${x.map(([d,v])=>On(d,v,s,i,n)).join("")}
          </div>
          
          ${C>1?Ye(C):""}
        </div>
      ${Mn()}
    </div>
  `}function Mn(){return`
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
  `}function On(n,e,t,s,i){var O,L;const r=t.has(n),o=s.has(n),c=!Number.isInteger(n),l=((O=i.downloadedVersions)==null?void 0:O[n])||[],y=new Set(i.deletedChapterUrls||[]),u=e.filter(h=>g.filter==="hidden"?!0:!y.has(h.url)),f=!!g.activeVolume;let b=u;f&&(b=u.filter(h=>Array.isArray(l)?l.includes(h.url):l===h.url));const E=b.length>1,C=i.chapterSettings||{},_=f?!0:(L=C[n])==null?void 0:L.locked,T=["chapter-item",r?"downloaded":"",o?"read":"",c?"extra":""].filter(Boolean).join(" "),x=E?`
    <div class="versions-dropdown hidden" id="versions-${n}">
      ${b.map(h=>{const d=encodeURIComponent(h.url),v=Array.isArray(l)?l.includes(h.url):l===h.url;return`
          <div class="version-row ${v?"downloaded":""}"
               data-version-url="${d}" data-num="${n}">
            <span class="version-title">${h.title||h.releaseGroup||"Version"}</span>
            <div class="version-actions">
              ${v?`<button class="btn-icon small success" data-action="read-version" data-num="${n}" data-url="${d}">▶</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${n}" data-url="${d}">🗑️</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${n}" data-url="${d}">↓</button>`}
              ${y.has(h.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${n}" data-url="${d}" title="Restore Version">↩️</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${n}" data-url="${d}" title="Hide Version">👁️‍🗨️</button>`}
            </div>
          </div>
        `}).join("")}
    </div>
  `:"",F=(i.excludedChapters||[]).includes(n);return`
    <div class="chapter-group" data-chapter="${n}">
      <div class="${T}" data-num="${n}" style="${F?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${n}</span>
        <span class="chapter-title">
          ${b[0]?b[0].title!==`Chapter ${n}`?b[0].title:"":e[0].title}
          ${F?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
        </span>
        ${c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${F?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${n}" title="Restore Chapter">↩️</button>`:f?'<span style="margin-right:8px; opacity:0.5; font-size:0.8em">Vol</span>':`<button class="btn-icon small lock-btn ${_?"locked":""}"
                        data-action="lock" data-num="${n}"
                        title="${_?"Unlock":"Lock"}">
                  ${_?"🔒":"🔓"}
                </button>`}       <button class="btn-icon small ${o?"success":"muted"}"
                  data-action="read" data-num="${n}"
                  title="${o?"Mark unread":"Mark read"}">
            ${o?"👁️":"○"}
          </button>
          <button class="btn-icon small ${r?"success":""}"
                  data-action="download" data-num="${n}"
                  title="${r?"Downloaded":"Download"}">
            ${r?"✓":"↓"}
          </button>
          ${E?`
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${n}">
              ${u.length} ▼
            </button>
          `:""}
        </div>
      </div>
      ${x}
    </div>
  `}function Ye(n){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${g.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${g.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${g.currentPage+1} of ${n}</span>
      <button class="btn btn-icon" data-page="next" ${g.currentPage>=n-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${g.currentPage>=n-1?"disabled":""}>»</button>
    </div>
  `}function Nn(n,e){const t=n.volumes||[];return t.length===0?"":`
    <div class="volumes-section">
      <h2>Volumes</h2>
      <div class="volumes-grid">
        ${t.map(i=>{const r=i.chapters||[],o=r.filter(c=>e.has(c)).length;return`
      <div class="volume-card" data-volume-id="${i.id}">
        <div class="volume-cover">
          ${i.cover?`<img src="${i.cover}" alt="${i.name}">`:'<div class="placeholder">📚</div>'}
          <div class="volume-badges">
            <span class="badge badge-chapters">${r.length} ch</span>
            ${o>0?`<span class="badge badge-downloaded">${o}</span>`:""}
          </div>
        </div>
        <div class="volume-info">
          <div class="volume-name">${i.name}</div>
        </div>
      </div>
    `}).join("")}
      </div>
    </div>
  `}function Dn(){var t,s,i,r,o;const n=document.getElementById("app"),e=g.manga;e&&((t=document.getElementById("back-btn"))==null||t.addEventListener("click",()=>$.go("/")),(s=document.getElementById("back-library-btn"))==null||s.addEventListener("click",()=>$.go("/")),(i=document.getElementById("continue-btn"))==null||i.addEventListener("click",()=>{_t(e.id)}),(r=document.getElementById("download-all-btn"))==null||r.addEventListener("click",async()=>{try{p("Queueing downloads...","info"),p("Download queued!","success")}catch(c){p("Failed to download: "+c.message,"error")}}),(o=document.getElementById("check-updates-btn"))==null||o.addEventListener("click",async()=>{try{p("Checking for updates...","info"),await w.post(`/bookmarks/${e.id}/quick-check`),p("Check complete!","success")}catch(c){p("Check failed: "+c.message,"error")}}),n.querySelectorAll(".filter-btn").forEach(c=>{c.addEventListener("click",()=>{g.filter=c.dataset.filter,g.currentPage=0,M([e.id])})}),n.querySelectorAll("[data-page]").forEach(c=>{c.addEventListener("click",()=>{const l=c.dataset.page,y=Math.ceil(g.manga.chapters.length/ne);switch(l){case"first":g.currentPage=0;break;case"prev":g.currentPage=Math.max(0,g.currentPage-1);break;case"next":g.currentPage=Math.min(y-1,g.currentPage+1);break;case"last":g.currentPage=y-1;break}M([e.id])})}),n.querySelectorAll(".chapter-item").forEach(c=>{c.addEventListener("click",l=>{if(l.target.closest(".chapter-actions"))return;const y=parseFloat(c.dataset.num);(e.downloadedChapters||[]).includes(y)?$.go(`/read/${e.id}/${y}`):p("Chapter not downloaded","info")})}),n.querySelectorAll("[data-action]").forEach(c=>{c.addEventListener("click",async l=>{l.stopPropagation();const y=c.dataset.action,u=parseFloat(c.dataset.num),f=c.dataset.url?decodeURIComponent(c.dataset.url):null;switch(y){case"lock":await Fn(u);break;case"read":await Vn(u);break;case"download":await qn(u);break;case"versions":Un(u);break;case"read-version":$.go(`/read/${e.id}/${u}?version=${encodeURIComponent(f)}`);break;case"download-version":await Hn(u,f);break;case"delete-version":await zn(u,f);break;case"hide-version":await jn(u,f);break;case"restore-version":await Gn(u,f);break;case"restore-chapter":await Wn(u);break}})}),n.querySelectorAll(".volume-card").forEach(c=>{c.addEventListener("click",()=>{const l=c.dataset.volumeId;$.go(`/manga/${e.id}/volume/${l}`)})}),Yn(n),N.subscribeToManga(e.id))}async function Fn(n){var i;const e=g.manga,t=((i=e.chapterSettings)==null?void 0:i[n])||{},s=!t.locked;try{s?await w.lockChapter(e.id,n):await w.unlockChapter(e.id,n),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[n]={...t,locked:s},p(s?"Chapter locked":"Chapter unlocked","success"),M([e.id])}catch(r){p("Failed: "+r.message,"error")}}async function Vn(n){const e=g.manga,t=new Set(e.readChapters||[]),s=t.has(n);try{await w.post(`/bookmarks/${e.id}/chapters/${n}/read`,{read:!s}),s?t.delete(n):t.add(n),e.readChapters=[...t],p(s?"Marked unread":"Marked read","success"),M([e.id])}catch(i){p("Failed: "+i.message,"error")}}async function qn(n){const e=g.manga;try{p(`Downloading chapter ${n}...`,"info"),await w.post(`/bookmarks/${e.id}/download`,{chapter:n}),p("Download queued!","success")}catch(t){p("Failed: "+t.message,"error")}}function Un(n){document.querySelectorAll(".versions-dropdown").forEach(t=>{t.id!==`versions-${n}`&&t.classList.add("hidden")});const e=document.getElementById(`versions-${n}`);e&&e.classList.toggle("hidden")}async function Hn(n,e){const t=g.manga;try{p("Downloading version...","info"),await w.post(`/bookmarks/${t.id}/download`,{chapter:n,url:e}),p("Download queued!","success")}catch(s){p("Failed: "+s.message,"error")}}async function zn(n,e){const t=g.manga;if(confirm("Delete this version from disk?"))try{await w.delete(`/bookmarks/${t.id}/chapters/${n}/version?url=${encodeURIComponent(e)}`),p("Version deleted","success"),await W(t.id),M([t.id])}catch(s){p("Failed: "+s.message,"error")}}async function jn(n,e){const t=g.manga;try{await w.hideVersion(t.id,n,e),p("Version hidden","success"),await W(t.id),M([t.id])}catch(s){p("Failed: "+s.message,"error")}}async function Gn(n,e){const t=g.manga;try{await w.unhideVersion(t.id,n,e),p("Version restored","success"),await W(t.id),M([t.id])}catch(s){p("Failed to restore version: "+s.message,"error")}}async function Wn(n){const e=g.manga;try{await w.unexcludeChapter(e.id,n),p("Chapter restored","success"),await W(e.id),M([e.id])}catch(t){p("Failed to restore chapter: "+t.message,"error")}}async function W(n){try{const[e,t]=await Promise.all([w.getBookmark(n),w.get("/categories")]);g.manga=e,g.categories=t.categories||[],g.loading=!1;const s=new Set((e.chapters||[]).map(r=>r.number)).size,i=Math.ceil(s/ne);g.currentPage=Math.max(0,i-1),g.activeVolumeId?g.activeVolume=(e.volumes||[]).find(r=>r.id===g.activeVolumeId):g.activeVolume=null}catch{p("Failed to load manga","error"),g.loading=!1}}async function M(n=[]){const[e,t,s]=n;if(!e){$.go("/");return}g.activeVolumeId=t==="volume"?s:null;const i=document.getElementById("app");!g.manga||g.manga.id!==e?(g.loading=!0,g.manga=null,i.innerHTML=Me(),await W(e)):g.activeVolumeId?g.activeVolume=(g.manga.volumes||[]).find(r=>r.id===g.activeVolumeId):g.activeVolume=null,i.innerHTML=Me(),Dn()}function Qn(){g.manga&&N.unsubscribeFromManga(g.manga.id),g.manga=null,g.loading=!0}const Kn={mount:M,unmount:Qn,render:Me};function Yn(n){const e=g.manga;if(!e)return;const t=n.querySelector("#edit-vol-btn"),s=n.querySelector("#edit-volume-modal");t&&s&&t.addEventListener("click",()=>{const u=t.dataset.volId,f=e.volumes.find(b=>b.id===u);f&&(n.querySelector("#volume-name-input").value=f.name,s.dataset.editingVolId=u,s.classList.add("open"))});const i=n.querySelector("#save-volume-btn");i&&i.addEventListener("click",async()=>{const u=s.dataset.editingVolId,f=n.querySelector("#volume-name-input").value.trim();if(!f)return p("Volume name cannot be empty","error");try{await w.renameVolume(e.id,u,f),p("Volume renamed","success"),s.classList.remove("open"),await W(e.id),M([e.id,"volume",u])}catch(b){p(b.message,"error")}});const r=n.querySelector("#delete-volume-btn");r&&r.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const u=s.dataset.editingVolId;try{await w.deleteVolume(e.id,u),p("Volume deleted","success"),s.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch(f){p(f.message,"error")}});const o=n.querySelector("#vol-cover-upload-btn");if(o){let u=document.getElementById("vol-cover-input-hidden");u||(u=document.createElement("input"),u.type="file",u.id="vol-cover-input-hidden",u.accept="image/*",u.style.display="none",document.body.appendChild(u),u.addEventListener("change",async f=>{const b=f.target.files[0];if(!b)return;const E=s.dataset.editingVolId;if(!E)return;const C=new FormData;C.append("cover",b);try{await fetch(`/api/bookmarks/${e.id}/volumes/${E}/cover`,{method:"POST",body:C,headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}),p("Cover uploaded","success"),await W(e.id),M([e.id,"volume",E])}catch(_){p("Upload failed: "+_.message,"error")}})),o.addEventListener("click",()=>u.click())}const c=n.querySelector("#vol-cover-selector-btn"),l=n.querySelector("#cover-selector-modal");c&&l&&c.addEventListener("click",async()=>{const u=l.querySelector("#cover-chapter-select");u.innerHTML='<option value="">Select a chapter...</option>';const f=n.querySelector("#edit-volume-modal"),b=f?f.dataset.editingVolId:null;let E=[...e.chapters||[]];if(b){const _=e.volumes.find(T=>T.id===b);if(_&&_.chapters){const T=new Set(_.chapters);E=E.filter(x=>T.has(x.number))}}E.sort((_,T)=>_.number-T.number);const C=new Set;E.forEach(_=>{if(!C.has(_.number)){C.add(_.number);const T=document.createElement("option");T.value=_.number,T.textContent=`Chapter ${_.number}`,u.appendChild(T)}}),E.length>0&&(u.value=E[0].number,Je(e.id,E[0].number)),l.classList.add("open")});const y=n.querySelector("#cover-chapter-select");y&&y.addEventListener("change",u=>{u.target.value&&Je(e.id,u.target.value)}),n.querySelectorAll(".modal-close, .modal-close-btn").forEach(u=>{u.addEventListener("click",()=>{u.closest(".modal").classList.remove("open")})}),n.querySelectorAll(".modal-overlay").forEach(u=>{u.addEventListener("click",()=>{u.closest(".modal").classList.remove("open")})})}async function Je(n,e){const t=document.getElementById("cover-images-grid");if(t){t.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const i=(await w.getChapterImages(n,e)).images||[];if(t.innerHTML="",i.length===0){t.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}i.forEach(r=>{const o=document.createElement("div");o.className="cover-grid-item",o.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",o.innerHTML=`<img src="${r}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,o.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=r.split("/").pop();Jn(l,e,c)}),t.appendChild(o)})}catch(s){t.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${s.message}</div>`}}}async function Jn(n,e,t){const s=g.manga,i=document.getElementById("edit-volume-modal"),r=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${t} cover?`))try{if(t==="volume"){const o=i.dataset.editingVolId;if(!o)throw new Error("No volume selected");await w.setVolumeCoverFromChapter(s.id,o,e,n),p("Volume cover updated","success"),r.classList.remove("open"),i.classList.remove("open"),await W(s.id),M([s.id,"volume",o])}else{await w.setMangaCoverFromChapter(s.id,e,n),p("Series cover updated","success"),r.classList.remove("open"),await W(s.id);const o=window.location.hash.replace("#","");g.activeVolumeId?M([s.id,"volume",g.activeVolumeId]):M([s.id])}}catch(o){p("Failed to set cover: "+o.message,"error")}}let U={series:null,loading:!0};function ie(){if(U.loading)return`
      ${q("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const n=U.series;if(!n)return`
      ${q("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=n.alias||n.title,t=n.entries||[],s=t.reduce((r,o)=>r+(o.chapter_count||0),0);let i=null;if(t.length>0){const r=t[0];r.local_cover&&r.bookmark_id?i=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.local_cover.split(/[/\\]/).pop())}`:r.localCover&&r.bookmark_id?i=`/api/public/covers/${r.bookmark_id}/${encodeURIComponent(r.localCover.split(/[/\\]/).pop())}`:r.cover&&(i=r.cover)}return`
    ${q("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${i?`<img src="${i}" alt="${e}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`:'<div class="placeholder">📖</div>'}
          </div>
          <div class="series-detail-info">
            <h1>${e}</h1>
            <div class="series-detail-meta">
              <span class="meta-item">${t.length} Entries</span>
              <span class="meta-item">${s} Total Chapters</span>
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
            ${t.map((r,o)=>Xn(r,o,t.length)).join("")}
          </div>
        </div>
      </div>
    </div>
  `}function Xn(n,e,t){var r;const s=n.alias||n.title;let i=null;return n.local_cover?i=`/api/public/covers/${n.bookmark_id}/${encodeURIComponent(n.local_cover.split(/[/\\]/).pop())}`:n.localCover?i=`/api/public/covers/${n.bookmark_id}/${encodeURIComponent(n.localCover.split(/[/\\]/).pop())}`:n.cover&&(i=n.cover),`
    <div class="series-entry-card" data-id="${n.bookmark_id}" data-order="${n.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${e+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${n.bookmark_id}" ${e===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${n.bookmark_id}" ${e===t-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${i?`<img src="${i}" alt="${s}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`:'<div class="placeholder">📚</div>'}
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${n.chapter_count||0} ch</span>
          ${((r=n.downloadedChapters)==null?void 0:r.length)>0?`<span class="badge badge-downloaded">${n.downloadedChapters.length}</span>`:""}
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${n.bookmark_id}" title="Use as series cover">🖼️</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${s}</div>
      </div>
    </div>
  `}function He(){var e,t,s,i;const n=document.getElementById("app");(e=document.getElementById("back-btn"))==null||e.addEventListener("click",()=>$.go("/")),(t=document.getElementById("back-library-btn"))==null||t.addEventListener("click",()=>$.go("/")),n.querySelectorAll(".series-entry-card").forEach(r=>{r.addEventListener("click",o=>{if(o.target.closest("[data-action]"))return;const c=r.dataset.id;$.go(`/manga/${c}`)})}),n.querySelectorAll("[data-action]").forEach(r=>{r.addEventListener("click",async o=>{o.stopPropagation();const c=r.dataset.action,l=r.dataset.id;switch(c){case"move-up":await Xe(l,-1);break;case"move-down":await Xe(l,1);break;case"set-cover":await Zn(l);break}})}),(s=document.getElementById("add-entry-btn"))==null||s.addEventListener("click",()=>{p("Add entry modal coming soon","info")}),(i=document.getElementById("edit-series-btn"))==null||i.addEventListener("click",()=>{p("Edit series coming soon","info")})}async function Xe(n,e){const t=U.series;if(!t)return;const s=t.entries||[],i=s.findIndex(c=>c.bookmark_id===n);if(i===-1)return;const r=i+e;if(r<0||r>=s.length)return;const o=s.map(c=>c.bookmark_id);[o[i],o[r]]=[o[r],o[i]];try{await w.post(`/series/${t.id}/reorder`,{order:o}),p("Order updated","success"),await ze(t.id);const c=document.getElementById("app");c.innerHTML=ie(),He()}catch(c){p("Failed to reorder: "+c.message,"error")}}async function Zn(n){const e=U.series;if(e)try{await w.post(`/series/${e.id}/cover`,{bookmark_id:n}),p("Series cover updated","success"),await ze(e.id);const t=document.getElementById("app");t.innerHTML=ie(),He()}catch(t){p("Failed to set cover: "+t.message,"error")}}async function ze(n){try{const e=await w.get(`/series/${n}`);U.series=e,U.loading=!1}catch{p("Failed to load series","error"),U.loading=!1}}async function es(n=[]){const[e]=n;if(!e){$.go("/");return}const t=document.getElementById("app");U.loading=!0,U.series=null,t.innerHTML=ie(),await ze(e),t.innerHTML=ie(),He()}function ts(){U.series=null,U.loading=!0}const ns={mount:es,unmount:ts,render:ie},ss={mount:async n=>{const e=document.getElementById("app");e.innerHTML=`
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
        `;try{const t=await w.get("/settings")||{},s=document.getElementById("settings-form"),i=document.getElementById("settings-loader");t.theme&&(document.getElementById("theme").value=t.theme),i.style.display="none",s.style.display="block",s.addEventListener("submit",async r=>{r.preventDefault();const o=new FormData(s),c={};for(const[l,y]of o.entries())c[l]=y;try{await w.post("/settings/bulk",c),p("Settings saved successfully"),c.theme}catch(l){console.error(l),p("Failed to save settings","error")}})}catch(t){console.error(t),document.getElementById("settings-loader").textContent="Error loading settings"}}},is={mount:async n=>{const e=document.getElementById("app");e.innerHTML=`
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
        `,await as()}};async function as(){try{const n=await w.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
            <h3>Tables</h3>
            <ul class="table-list">
                ${n.tables.map(t=>`
                    <li>
                        <a href="#/admin/tables/${t.name}" class="table-link" data-table="${t.name}">
                            ${t.name} <span class="badge">${t.rowCount}</span>
                        </a>
                    </li>
                `).join("")}
            </ul>
        `,e.querySelectorAll(".table-link").forEach(t=>{t.addEventListener("click",s=>{s.preventDefault();const i=s.currentTarget.dataset.table;Oe(i),e.querySelectorAll(".table-link").forEach(r=>r.classList.remove("active")),s.currentTarget.classList.add("active")})})}catch(n){console.error(n),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function Oe(n,e=0){var s,i;const t=document.getElementById("admin-main");t.innerHTML=`<div class="loader">Loading ${n}...</div>`;try{const o=await w.get(`/admin/tables/${n}?page=${e}&limit=50`);if(!o.rows||o.rows.length===0){t.innerHTML=`
                <h2>${n}</h2>
                <div class="empty-state">No records found</div>
            `;return}const c=Object.keys(o.rows[0]);t.innerHTML=`
            <div class="table-header">
                <h2>${n}</h2>
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
                                ${c.map(y=>{const u=l[y];let f=u;return u===null?f='<span class="null">NULL</span>':typeof u=="object"?f=JSON.stringify(u):String(u).length>100&&(f=String(u).substring(0,100)+"..."),`<td>${f}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(s=document.getElementById("prev-page"))==null||s.addEventListener("click",()=>Oe(n,e-1)),(i=document.getElementById("next-page"))==null||i.addEventListener("click",()=>Oe(n,e+1))}catch(r){console.error(r),t.innerHTML=`<div class="error">Failed to load data for ${n}</div>`}}let B={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function rs(n,e){let t=null;if(e.length>0){const i=e[0];if(i.imagePaths&&i.imagePaths.length>0){const r=i.imagePaths[0];let o;typeof r=="string"?o=r:r&&typeof r=="object"&&(o=r.filename||r.path||r.name||r.url,o&&o.includes("/")&&(o=o.split("/").pop()),o&&o.includes("\\")&&(o=o.split("\\").pop())),o&&(t=`/api/public/chapter-images/${i.mangaId}/${i.chapterNum}/${encodeURIComponent(o)}`)}}const s=e.reduce((i,r)=>{var o;return i+(((o=r.imagePaths)==null?void 0:o.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${n}">
      <div class="manga-card-cover">
        ${t?`<img src="${t}" alt="${n}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📁</div>'">`:'<div class="placeholder">📁</div>'}
        <div class="manga-card-badges">
            <span class="badge badge-series">${s} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${n}</div>
    </div>
  `}function os(n){const e=B.bookmarks.find(t=>t.id===n);return e?e.alias||e.title:n}function cs(n){const e=B.bookmarks.find(t=>t.id===n);if(e&&e.seriesId){const t=B.series.find(s=>s.id===e.seriesId);if(t)return{id:t.id,name:t.alias||t.title}}return null}function ls(n,e,t,s=!1){return`
    <div class="manga-card trophy-gallery-card" data-trophy-id="${n}" data-is-series="${s}">
      <div class="manga-card-cover">
        <div class="placeholder trophy-placeholder">🏆</div>
        <div class="manga-card-badges">
            <span class="badge badge-trophy">🏆 ${t}</span>
            ${s?'<span class="badge badge-series">Series</span>':""}
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function ds(){const n={};console.log("Building trophy groups from:",B.trophyPages);for(const e of Object.keys(B.trophyPages)){const t=B.trophyPages[e];let s=0;for(const[r,o]of Object.entries(t))s+=Object.keys(o).length;if(console.log(`Manga ${e}: ${s} trophies`),s===0)continue;const i=cs(e);if(i)n[i.id]||(n[i.id]={name:i.name,isSeries:!0,count:0,mangaIds:[]}),n[i.id].count+=s,n[i.id].mangaIds.push(e);else{const r=os(e);console.log(`No series for ${e}, using name: ${r}`),n[e]={name:r,isSeries:!1,count:s,mangaIds:[e]}}}return console.log("Trophy groups result:",n),n}function ve(){if(B.loading)return`
      ${q("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:n,listOrder:e}=B.favorites,t=`
    <div class="favorites-tabs">
      <button class="tab-btn ${B.activeTab==="galleries"?"active":""}" data-tab="galleries">
        📁 Galleries
      </button>
      <button class="tab-btn ${B.activeTab==="trophies"?"active":""}" data-tab="trophies">
        🏆 Trophies
      </button>
    </div>
  `;let s="";if(B.activeTab==="galleries")e.length===0?s=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:s=`
        <div class="library-grid">
          ${e.map(r=>{const o=n&&n[r]||[];return rs(r,o)}).join("")}
        </div>
      `;else{const i=ds(),r=Object.keys(i);r.length===0?s=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:s=`
        <div class="library-grid">
          ${r.map(c=>{const l=i[c];return ls(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${q("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${t}
      ${s}
    </div>
  `}function St(){se();const n=document.getElementById("app");n.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",()=>{B.activeTab=t.dataset.tab,n.innerHTML=ve(),St()})});const e=n.querySelectorAll(".gallery-card");console.log("[Favorites] Found gallery cards:",e.length),e.forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.gallery;console.log("[Favorites] Gallery clicked:",s),$.go(`/read/gallery/${encodeURIComponent(s)}`)})}),n.querySelectorAll(".trophy-gallery-card").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.trophyId;t.dataset.isSeries==="true"?$.go(`/series/${s}`):$.go(`/manga/${s}`)})})}async function us(){try{const[n,e,t,s]=await Promise.all([w.getFavorites(),w.get("/trophy-pages"),w.getBookmarks(),w.getSeries()]);B.favorites=n||{favorites:{},listOrder:[]},B.trophyPages=e||{},B.bookmarks=t||[],B.series=s||[],B.loading=!1}catch(n){console.error("Failed to load favorites:",n),p("Failed to load favorites","error"),B.loading=!1}}async function hs(){console.log("[Favorites] mount called"),B.loading=!0;const n=document.getElementById("app");n.innerHTML=ve(),await us(),console.log("[Favorites] Data loaded, rendering..."),n.innerHTML=ve(),console.log("[Favorites] Calling setupListeners..."),St(),console.log("[Favorites] setupListeners complete")}function ps(){}const gs={mount:hs,unmount:ps,render:ve};class ms{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,t){this.routes.set(e,t)}async navigate(){const e=window.location.hash.slice(1)||"/",[t,...s]=e.split("/").filter(Boolean),i=`/${t||""}`;this.currentView&&this.currentView.unmount&&this.currentView.unmount();let r=this.routes.get(i);!r&&this.routes.has("/")&&(r=this.routes.get("/")),r&&(this.currentRoute=i,this.currentView=r,r.mount&&await r.mount(s),se())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),se())}}const $=new ms;$.register("/",_n);$.register("/manga",Kn);$.register("/read",Rn);$.register("/series",ns);$.register("/settings",ss);$.register("/admin",is);$.register("/favorites",gs);class fs{constructor(){this.currentView=null,this.mangaCache=new Map}async init(){if(console.log("[App] Initializing..."),!w.isAuthenticated()){window.location.href="/login.html";return}N.connect(),this.setupSocketListeners(),$.init(),this.hideLoading(),console.log("[App] Ready")}setupSocketListeners(){N.on(j.CHAPTER_DOWNLOADED,e=>{console.log("[Socket] Chapter downloaded:",e),this.onChapterUpdate(e)}),N.on(j.CHAPTER_HIDDEN,e=>{console.log("[Socket] Chapter hidden:",e),this.onChapterUpdate(e)}),N.on(j.CHAPTER_UNHIDDEN,e=>{console.log("[Socket] Chapter unhidden:",e),this.onChapterUpdate(e)}),N.on(j.MANGA_UPDATED,e=>{console.log("[Socket] Manga updated:",e),this.onMangaUpdate(e)}),N.on(j.DOWNLOAD_PROGRESS,e=>{this.onDownloadProgress(e)}),N.on(j.DOWNLOAD_COMPLETED,e=>{console.log("[Socket] Download completed:",e),this.showToast(`Downloaded: ${e.chapterNumber}`,"success")}),N.on(j.QUEUE_UPDATED,e=>{this.onQueueUpdate(e)}),N.on(j.ACTION_RECORDED,e=>{console.log("[Socket] Action recorded:",e),this.updateUndoButton()}),N.on(j.ACTION_UNDONE,e=>{console.log("[Socket] Action undone:",e),this.showToast("Action undone","info"),this.updateUndoButton()})}onChapterUpdate(e){window.dispatchEvent(new CustomEvent("chapter:update",{detail:e}))}onMangaUpdate(e){this.mangaCache.delete(e.mangaId),window.dispatchEvent(new CustomEvent("manga:update",{detail:e}))}onDownloadProgress(e){window.dispatchEvent(new CustomEvent("download:progress",{detail:e}))}onQueueUpdate(e){window.dispatchEvent(new CustomEvent("queue:update",{detail:e}))}async updateUndoButton(){try{const{undoableCount:e}=await w.getActions({limit:1}),t=document.getElementById("undo-btn");if(t){t.style.display=e>0?"flex":"none";const s=t.querySelector(".count");s&&(s.textContent=e)}}catch{}}showToast(e,t="info"){const s=document.createElement("div");s.className=`toast toast-${t}`,s.textContent=e,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("show")),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},3e3)}hideLoading(){const e=document.querySelector(".loading-screen");e&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),300))}}const vs=new fs;document.addEventListener("DOMContentLoaded",()=>vs.init());
