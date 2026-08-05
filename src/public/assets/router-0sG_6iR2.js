import{a as m}from"./api-C0riDQi_.js";const be=Object.create(null);be.open="0";be.close="1";be.ping="2";be.pong="3";be.message="4";be.upgrade="5";be.noop="6";const Ke=Object.create(null);Object.keys(be).forEach(t=>{Ke[be[t]]=t});const vt={type:"error",data:"parser error"},ps=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",hs=typeof ArrayBuffer=="function",ms=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,Tt=({type:t,data:e},s,a)=>ps&&e instanceof Blob?s?a(e):Jt(e,a):hs&&(e instanceof ArrayBuffer||ms(e))?s?a(e):Jt(new Blob([e]),a):a(be[t]+(e||"")),Jt=(t,e)=>{const s=new FileReader;return s.onload=function(){const a=s.result.split(",")[1];e("b"+(a||""))},s.readAsDataURL(t)};function Xt(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let pt;function Hs(t,e){if(ps&&t.data instanceof Blob)return t.data.arrayBuffer().then(Xt).then(e);if(hs&&(t.data instanceof ArrayBuffer||ms(t.data)))return e(Xt(t.data));Tt(t,!1,s=>{pt||(pt=new TextEncoder),e(pt.encode(s))})}const Zt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",qe=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<Zt.length;t++)qe[Zt.charCodeAt(t)]=t;const zs=t=>{let e=t.length*.75,s=t.length,a,n=0,i,o,c,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const u=new ArrayBuffer(e),h=new Uint8Array(u);for(a=0;a<s;a+=4)i=qe[t.charCodeAt(a)],o=qe[t.charCodeAt(a+1)],c=qe[t.charCodeAt(a+2)],l=qe[t.charCodeAt(a+3)],h[n++]=i<<2|o>>4,h[n++]=(o&15)<<4|c>>2,h[n++]=(c&3)<<6|l&63;return u},js=typeof ArrayBuffer=="function",Pt=(t,e)=>{if(typeof t!="string")return{type:"message",data:gs(t,e)};const s=t.charAt(0);return s==="b"?{type:"message",data:Qs(t.substring(1),e)}:Ke[s]?t.length>1?{type:Ke[s],data:t.substring(1)}:{type:Ke[s]}:vt},Qs=(t,e)=>{if(js){const s=zs(t);return gs(s,e)}else return{base64:!0,data:t}},gs=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},fs="",Ws=(t,e)=>{const s=t.length,a=new Array(s);let n=0;t.forEach((i,o)=>{Tt(i,!1,c=>{a[o]=c,++n===s&&e(a.join(fs))})})},Gs=(t,e)=>{const s=t.split(fs),a=[];for(let n=0;n<s.length;n++){const i=Pt(s[n],e);if(a.push(i),i.type==="error")break}return a};function Ks(){return new TransformStream({transform(t,e){Hs(t,s=>{const a=s.length;let n;if(a<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,a);else if(a<65536){n=new Uint8Array(3);const i=new DataView(n.buffer);i.setUint8(0,126),i.setUint16(1,a)}else{n=new Uint8Array(9);const i=new DataView(n.buffer);i.setUint8(0,127),i.setBigUint64(1,BigInt(a))}t.data&&typeof t.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(s)})}})}let ht;function Qe(t){return t.reduce((e,s)=>e+s.length,0)}function We(t,e){if(t[0].length===e)return t.shift();const s=new Uint8Array(e);let a=0;for(let n=0;n<e;n++)s[n]=t[0][a++],a===t[0].length&&(t.shift(),a=0);return t.length&&a<t[0].length&&(t[0]=t[0].slice(a)),s}function Ys(t,e){ht||(ht=new TextDecoder);const s=[];let a=0,n=-1,i=!1;return new TransformStream({transform(o,c){for(s.push(o);;){if(a===0){if(Qe(s)<1)break;const l=We(s,1);i=(l[0]&128)===128,n=l[0]&127,n<126?a=3:n===126?a=1:a=2}else if(a===1){if(Qe(s)<2)break;const l=We(s,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),a=3}else if(a===2){if(Qe(s)<8)break;const l=We(s,8),u=new DataView(l.buffer,l.byteOffset,l.length),h=u.getUint32(0);if(h>Math.pow(2,21)-1){c.enqueue(vt);break}n=h*Math.pow(2,32)+u.getUint32(4),a=3}else{if(Qe(s)<n)break;const l=We(s,n);c.enqueue(Pt(i?l:ht.decode(l),e)),a=0}if(n===0||n>t){c.enqueue(vt);break}}}})}const vs=4;function Y(t){if(t)return Js(t)}function Js(t){for(var e in Y.prototype)t[e]=Y.prototype[e];return t}Y.prototype.on=Y.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this};Y.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this};Y.prototype.off=Y.prototype.removeListener=Y.prototype.removeAllListeners=Y.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+t];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var a,n=0;n<s.length;n++)if(a=s[n],a===e||a.fn===e){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+t],this};Y.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),s=this._callbacks["$"+t],a=1;a<arguments.length;a++)e[a-1]=arguments[a];if(s){s=s.slice(0);for(var a=0,n=s.length;a<n;++a)s[a].apply(this,e)}return this};Y.prototype.emitReserved=Y.prototype.emit;Y.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};Y.prototype.hasListeners=function(t){return!!this.listeners(t).length};const lt=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,s)=>s(e,0),de=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Xs="arraybuffer";function ys(t,...e){return e.reduce((s,a)=>(t.hasOwnProperty(a)&&(s[a]=t[a]),s),{})}const Zs=de.setTimeout,ea=de.clearTimeout;function ct(t,e){e.useNativeTimers?(t.setTimeoutFn=Zs.bind(de),t.clearTimeoutFn=ea.bind(de)):(t.setTimeoutFn=de.setTimeout.bind(de),t.clearTimeoutFn=de.clearTimeout.bind(de))}const ta=1.33;function sa(t){return typeof t=="string"?aa(t):Math.ceil((t.byteLength||t.size)*ta)}function aa(t){let e=0,s=0;for(let a=0,n=t.length;a<n;a++)e=t.charCodeAt(a),e<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(a++,s+=4);return s}function bs(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function na(t){let e="";for(let s in t)t.hasOwnProperty(s)&&(e.length&&(e+="&"),e+=encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e}function ra(t){let e={},s=t.split("&");for(let a=0,n=s.length;a<n;a++){let i=s[a].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}class ia extends Error{constructor(e,s,a){super(e),this.description=s,this.context=a,this.type="TransportError"}}class Rt extends Y{constructor(e){super(),this.writable=!1,ct(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,s,a){return super.emitReserved("error",new ia(e,s,a)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const s=Pt(e,this.socket.binaryType);this.onPacket(s)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,s={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const s=na(e);return s.length?"?"+s:""}}class oa extends Rt{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const s=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let a=0;this._polling&&(a++,this.once("pollComplete",function(){--a||s()})),this.writable||(a++,this.once("drain",function(){--a||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const s=a=>{if(this.readyState==="opening"&&a.type==="open"&&this.onOpen(),a.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(a)};Gs(e,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Ws(e,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=bs()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(e,s)}}let ws=!1;try{ws=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const la=ws;function ca(){}class da extends oa{constructor(e){if(super(e),typeof location<"u"){const s=location.protocol==="https:";let a=location.port;a||(a=s?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||a!==e.port}}doWrite(e,s){const a=this.request({method:"POST",data:e});a.on("success",s),a.on("error",(n,i)=>{this.onError("xhr post error",n,i)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(s,a)=>{this.onError("xhr poll error",s,a)}),this.pollXhr=e}}class ye extends Y{constructor(e,s,a){super(),this.createRequest=e,ct(this,a),this._opts=a,this._method=a.method||"GET",this._uri=s,this._data=a.data!==void 0?a.data:null,this._create()}_create(){var e;const s=ys(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const a=this._xhr=this.createRequest(s);try{a.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){a.setDisableHeaderCheck&&a.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&a.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{a.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{a.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(a),"withCredentials"in a&&(a.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(a.timeout=this._opts.requestTimeout),a.onreadystatechange=()=>{var n;a.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(a.getResponseHeader("set-cookie"))),a.readyState===4&&(a.status===200||a.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof a.status=="number"?a.status:0)},0))},a.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=ye.requestsCount++,ye.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=ca,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete ye.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}ye.requestsCount=0;ye.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",es);else if(typeof addEventListener=="function"){const t="onpagehide"in de?"pagehide":"unload";addEventListener(t,es,!1)}}function es(){for(let t in ye.requests)ye.requests.hasOwnProperty(t)&&ye.requests[t].abort()}const ua=function(){const t=ks({xdomain:!1});return t&&t.responseType!==null}();class pa extends da{constructor(e){super(e);const s=e&&e.forceBase64;this.supportsBinary=ua&&!s}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new ye(ks,this.uri(),e)}}function ks(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||la))return new XMLHttpRequest}catch{}if(!e)try{return new de[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const $s=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class ha extends Rt{get name(){return"websocket"}doOpen(){const e=this.uri(),s=this.opts.protocols,a=$s?{}:ys(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(a.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,s,a)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;Tt(a,this.supportsBinary,i=>{try{this.doWrite(a,i)}catch{}n&&lt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=bs()),this.supportsBinary||(s.b64=1),this.createUri(e,s)}}const mt=de.WebSocket||de.MozWebSocket;class ma extends ha{createSocket(e,s,a){return $s?new mt(e,s,a):s?new mt(e,s):new mt(e)}doWrite(e,s){this.ws.send(s)}}class ga extends Rt{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const s=Ys(Number.MAX_SAFE_INTEGER,this.socket.binaryType),a=e.readable.pipeThrough(s).getReader(),n=Ks();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const i=()=>{a.read().then(({done:c,value:l})=>{c||(this.onPacket(l),i())}).catch(c=>{})};i();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const a=e[s],n=s===e.length-1;this._writer.write(a).then(()=>{n&&lt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const fa={websocket:ma,webtransport:ga,polling:pa},va=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,ya=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function yt(t){if(t.length>8e3)throw"URI too long";const e=t,s=t.indexOf("["),a=t.indexOf("]");s!=-1&&a!=-1&&(t=t.substring(0,s)+t.substring(s,a).replace(/:/g,";")+t.substring(a,t.length));let n=va.exec(t||""),i={},o=14;for(;o--;)i[ya[o]]=n[o]||"";return s!=-1&&a!=-1&&(i.source=e,i.host=i.host.substring(1,i.host.length-1).replace(/;/g,":"),i.authority=i.authority.replace("[","").replace("]","").replace(/;/g,":"),i.ipv6uri=!0),i.pathNames=ba(i,i.path),i.queryKey=wa(i,i.query),i}function ba(t,e){const s=/\/{2,9}/g,a=e.replace(s,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&a.splice(0,1),e.slice(-1)=="/"&&a.splice(a.length-1,1),a}function wa(t,e){const s={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,n,i){n&&(s[n]=i)}),s}const bt=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ye=[];bt&&addEventListener("offline",()=>{Ye.forEach(t=>t())},!1);class Ee extends Y{constructor(e,s){if(super(),this.binaryType=Xs,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(s=e,e=null),e){const a=yt(e);s.hostname=a.host,s.secure=a.protocol==="https"||a.protocol==="wss",s.port=a.port,a.query&&(s.query=a.query)}else s.host&&(s.hostname=yt(s.host).host);ct(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(a=>{const n=a.prototype.name;this.transports.push(n),this._transportsByName[n]=a}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=ra(this.opts.query)),bt&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ye.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const s=Object.assign({},this.opts.query);s.EIO=vs,s.transport=e,this.id&&(s.sid=this.id);const a=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](a)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Ee.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(e);s.open(),this.setTransport(s)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",Ee.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=e.data,this._onError(s);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let a=0;a<this.writeBuffer.length;a++){const n=this.writeBuffer[a].data;if(n&&(s+=sa(n)),a>0&&s>this._maxPayload)return this.writeBuffer.slice(0,a);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,lt(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,s,a){return this._sendPacket("message",e,s,a),this}send(e,s,a){return this._sendPacket("message",e,s,a),this}_sendPacket(e,s,a,n){if(typeof s=="function"&&(n=s,s=void 0),typeof a=="function"&&(n=a,a=null),this.readyState==="closing"||this.readyState==="closed")return;a=a||{},a.compress=a.compress!==!1;const i={type:e,data:s,options:a};this.emitReserved("packetCreate",i),this.writeBuffer.push(i),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),e()},a=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?a():e()}):this.upgrading?a():e()),this}_onError(e){if(Ee.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),bt&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const a=Ye.indexOf(this._offlineEventListener);a!==-1&&Ye.splice(a,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,s),this.writeBuffer=[],this._prevBufferLen=0}}}Ee.protocol=vs;class ka extends Ee{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let s=this.createTransport(e),a=!1;Ee.priorWebsocketSuccess=!1;const n=()=>{a||(s.send([{type:"ping",data:"probe"}]),s.once("packet",v=>{if(!a)if(v.type==="pong"&&v.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;Ee.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{a||this.readyState!=="closed"&&(h(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const w=new Error("probe error");w.transport=s.name,this.emitReserved("upgradeError",w)}}))};function i(){a||(a=!0,h(),s.close(),s=null)}const o=v=>{const w=new Error("probe error: "+v);w.transport=s.name,i(),this.emitReserved("upgradeError",w)};function c(){o("transport closed")}function l(){o("socket closed")}function u(v){s&&v.name!==s.name&&i()}const h=()=>{s.removeListener("open",n),s.removeListener("error",o),s.removeListener("close",c),this.off("close",l),this.off("upgrading",u)};s.once("open",n),s.once("error",o),s.once("close",c),this.once("close",l),this.once("upgrading",u),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{a||s.open()},200):s.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const s=[];for(let a=0;a<e.length;a++)~this.transports.indexOf(e[a])&&s.push(e[a]);return s}}let $a=class extends ka{constructor(e,s={}){const a=typeof e=="object"?e:s;(!a.transports||a.transports&&typeof a.transports[0]=="string")&&(a.transports=(a.transports||["polling","websocket","webtransport"]).map(n=>fa[n]).filter(n=>!!n)),super(e,a)}};function Ea(t,e="",s){let a=t;s=s||typeof location<"u"&&location,t==null&&(t=s.protocol+"//"+s.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=s.protocol+t:t=s.host+t),/^(https?|wss?):\/\//.test(t)||(typeof s<"u"?t=s.protocol+"//"+t:t="https://"+t),a=yt(t)),a.port||(/^(http|ws)$/.test(a.protocol)?a.port="80":/^(http|ws)s$/.test(a.protocol)&&(a.port="443")),a.path=a.path||"/";const i=a.host.indexOf(":")!==-1?"["+a.host+"]":a.host;return a.id=a.protocol+"://"+i+":"+a.port+e,a.href=a.protocol+"://"+i+(s&&s.port===a.port?"":":"+a.port),a}const Ca=typeof ArrayBuffer=="function",xa=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Es=Object.prototype.toString,Sa=typeof Blob=="function"||typeof Blob<"u"&&Es.call(Blob)==="[object BlobConstructor]",La=typeof File=="function"||typeof File<"u"&&Es.call(File)==="[object FileConstructor]";function qt(t){return Ca&&(t instanceof ArrayBuffer||xa(t))||Sa&&t instanceof Blob||La&&t instanceof File}function Je(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let s=0,a=t.length;s<a;s++)if(Je(t[s]))return!0;return!1}if(qt(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return Je(t.toJSON(),!0);for(const s in t)if(Object.prototype.hasOwnProperty.call(t,s)&&Je(t[s]))return!0;return!1}function Ia(t){const e=[],s=t.data,a=t;return a.data=wt(s,e),a.attachments=e.length,{packet:a,buffers:e}}function wt(t,e){if(!t)return t;if(qt(t)){const s={_placeholder:!0,num:e.length};return e.push(t),s}else if(Array.isArray(t)){const s=new Array(t.length);for(let a=0;a<t.length;a++)s[a]=wt(t[a],e);return s}else if(typeof t=="object"&&!(t instanceof Date)){const s={};for(const a in t)Object.prototype.hasOwnProperty.call(t,a)&&(s[a]=wt(t[a],e));return s}return t}function _a(t,e){return t.data=kt(t.data,e),delete t.attachments,t}function kt(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let s=0;s<t.length;s++)t[s]=kt(t[s],e);else if(typeof t=="object")for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(t[s]=kt(t[s],e));return t}const Ba=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var F;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(F||(F={}));class Aa{constructor(e){this.replacer=e}encode(e){return(e.type===F.EVENT||e.type===F.ACK)&&Je(e)?this.encodeAsBinary({type:e.type===F.EVENT?F.BINARY_EVENT:F.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let s=""+e.type;return(e.type===F.BINARY_EVENT||e.type===F.BINARY_ACK)&&(s+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(s+=e.nsp+","),e.id!=null&&(s+=e.id),e.data!=null&&(s+=JSON.stringify(e.data,this.replacer)),s}encodeAsBinary(e){const s=Ia(e),a=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(a),n}}class Dt extends Y{constructor(e){super(),this.reviver=e}add(e){let s;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(e);const a=s.type===F.BINARY_EVENT;a||s.type===F.BINARY_ACK?(s.type=a?F.EVENT:F.ACK,this.reconstructor=new Ma(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(qt(e)||e.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(e),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let s=0;const a={type:Number(e.charAt(0))};if(F[a.type]===void 0)throw new Error("unknown packet type "+a.type);if(a.type===F.BINARY_EVENT||a.type===F.BINARY_ACK){const i=s+1;for(;e.charAt(++s)!=="-"&&s!=e.length;);const o=e.substring(i,s);if(o!=Number(o)||e.charAt(s)!=="-")throw new Error("Illegal attachments");a.attachments=Number(o)}if(e.charAt(s+1)==="/"){const i=s+1;for(;++s&&!(e.charAt(s)===","||s===e.length););a.nsp=e.substring(i,s)}else a.nsp="/";const n=e.charAt(s+1);if(n!==""&&Number(n)==n){const i=s+1;for(;++s;){const o=e.charAt(s);if(o==null||Number(o)!=o){--s;break}if(s===e.length)break}a.id=Number(e.substring(i,s+1))}if(e.charAt(++s)){const i=this.tryParse(e.substr(s));if(Dt.isPayloadValid(a.type,i))a.data=i;else throw new Error("invalid payload")}return a}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,s){switch(e){case F.CONNECT:return ts(s);case F.DISCONNECT:return s===void 0;case F.CONNECT_ERROR:return typeof s=="string"||ts(s);case F.EVENT:case F.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&Ba.indexOf(s[0])===-1);case F.ACK:case F.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Ma{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const s=_a(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function ts(t){return Object.prototype.toString.call(t)==="[object Object]"}const Ta=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Dt,Encoder:Aa,get PacketType(){return F}},Symbol.toStringTag,{value:"Module"}));function me(t,e,s){return t.on(e,s),function(){t.off(e,s)}}const Pa=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Cs extends Y{constructor(e,s,a){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=s,a&&a.auth&&(this.auth=a.auth),this._opts=Object.assign({},a),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[me(e,"open",this.onopen.bind(this)),me(e,"packet",this.onpacket.bind(this)),me(e,"error",this.onerror.bind(this)),me(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...s){var a,n,i;if(Pa.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(s.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const o={type:F.EVENT,data:s};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const h=this.ids++,v=s.pop();this._registerAckCallback(h,v),o.id=h}const c=(n=(a=this.io.engine)===null||a===void 0?void 0:a.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((i=this.io.engine)===null||i===void 0)&&i._hasPingExpired());return this.flags.volatile&&!c||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,s){var a;const n=(a=this.flags.timeout)!==null&&a!==void 0?a:this._opts.ackTimeout;if(n===void 0){this.acks[e]=s;return}const i=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===e&&this.sendBuffer.splice(c,1);s.call(this,new Error("operation has timed out"))},n),o=(...c)=>{this.io.clearTimeoutFn(i),s.apply(this,c)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...s){return new Promise((a,n)=>{const i=(o,c)=>o?n(o):a(c);i.withError=!0,s.push(i),this.emit(e,...s)})}_addToQueue(e){let s;typeof e[e.length-1]=="function"&&(s=e.pop());const a={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...i)=>(this._queue[0],n!==null?a.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...i)),a.pending=!1,this._drainQueue())),this._queue.push(a),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!e||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:F.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(a=>String(a.id)===e)){const a=this.acks[e];delete this.acks[e],a.withError&&a.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case F.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case F.EVENT:case F.BINARY_EVENT:this.onevent(e);break;case F.ACK:case F.BINARY_ACK:this.onack(e);break;case F.DISCONNECT:this.ondisconnect();break;case F.CONNECT_ERROR:this.destroy();const a=new Error(e.data.message);a.data=e.data.data,this.emitReserved("connect_error",a);break}}onevent(e){const s=e.data||[];e.id!=null&&s.push(this.ack(e.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const a of s)a.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const s=this;let a=!1;return function(...n){a||(a=!0,s.packet({type:F.ACK,id:e,data:n}))}}onack(e){const s=this.acks[e.id];typeof s=="function"&&(delete this.acks[e.id],s.withError&&e.data.unshift(null),s.apply(this,e.data))}onconnect(e,s){this.id=e,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:F.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const s=this._anyListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const s=this._anyOutgoingListeners;for(let a=0;a<s.length;a++)if(e===s[a])return s.splice(a,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const a of s)a.apply(this,e.data)}}}function Pe(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}Pe.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),s=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+s:t-s}return Math.min(t,this.max)|0};Pe.prototype.reset=function(){this.attempts=0};Pe.prototype.setMin=function(t){this.ms=t};Pe.prototype.setMax=function(t){this.max=t};Pe.prototype.setJitter=function(t){this.jitter=t};class $t extends Y{constructor(e,s){var a;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(s=e,e=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,ct(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((a=s.randomizationFactor)!==null&&a!==void 0?a:.5),this.backoff=new Pe({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=e;const n=s.parser||Ta;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var s;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(s=this.backoff)===null||s===void 0||s.setMin(e),this)}randomizationFactor(e){var s;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(s=this.backoff)===null||s===void 0||s.setJitter(e),this)}reconnectionDelayMax(e){var s;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(s=this.backoff)===null||s===void 0||s.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new $a(this.uri,this.opts);const s=this.engine,a=this;this._readyState="opening",this.skipReconnect=!1;const n=me(s,"open",function(){a.onopen(),e&&e()}),i=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),e?e(c):this.maybeReconnectOnOpen()},o=me(s,"error",i);if(this._timeout!==!1){const c=this._timeout,l=this.setTimeoutFn(()=>{n(),i(new Error("timeout")),s.close()},c);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(me(e,"ping",this.onping.bind(this)),me(e,"data",this.ondata.bind(this)),me(e,"error",this.onerror.bind(this)),me(e,"close",this.onclose.bind(this)),me(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(s){this.onclose("parse error",s)}}ondecoded(e){lt(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,s){let a=this.nsps[e];return a?this._autoConnect&&!a.active&&a.connect():(a=new Cs(this,e,s),this.nsps[e]=a),a}_destroy(e){const s=Object.keys(this.nsps);for(const a of s)if(this.nsps[a].active)return;this._close()}_packet(e){const s=this.encoder.encode(e);for(let a=0;a<s.length;a++)this.engine.write(s[a],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,s){var a;this.cleanup(),(a=this.engine)===null||a===void 0||a.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const a=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},s);this.opts.autoUnref&&a.unref(),this.subs.push(()=>{this.clearTimeoutFn(a)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Re={};function Xe(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const s=Ea(t,e.path||"/socket.io"),a=s.source,n=s.id,i=s.path,o=Re[n]&&i in Re[n].nsps,c=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return c?l=new $t(a,e):(Re[n]||(Re[n]=new $t(a,e)),l=Re[n]),s.query&&!e.query&&(e.query=s.queryKey),l.socket(s.path,e)}Object.assign(Xe,{Manager:$t,Socket:Cs,io:Xe,connect:Xe});class Ra{constructor(){this.socket=null,this.listeners=new Map,this.subscribedMangas=new Set}connect(){var e;(e=this.socket)!=null&&e.connected||(this.socket=Xe({autoConnect:!0,reconnection:!0,reconnectionDelay:1e3,reconnectionAttempts:10}),this.socket.on("connect",()=>{console.log("[Socket] Connected:",this.socket.id),this.subscribedMangas.forEach(s=>{this.socket.emit("subscribe:manga",s)}),this.socket.emit("subscribe:global")}),this.socket.on("disconnect",s=>{console.log("[Socket] Disconnected:",s)}),this.socket.on("connect_error",s=>{console.error("[Socket] Connection error:",s.message)}))}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}subscribeToManga(e){var s;this.subscribedMangas.add(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("subscribe:manga",e)}unsubscribeFromManga(e){var s;this.subscribedMangas.delete(e),(s=this.socket)!=null&&s.connected&&this.socket.emit("unsubscribe:manga",e)}on(e,s){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(s),this.socket&&this.socket.on(e,s)}off(e,s){this.listeners.has(e)&&this.listeners.get(e).delete(s),this.socket&&this.socket.off(e,s)}emit(e,s){var a;(a=this.socket)!=null&&a.connected&&this.socket.emit(e,s)}}const ve={CHAPTER_DOWNLOADED:"chapter:downloaded",CHAPTER_HIDDEN:"chapter:hidden",CHAPTER_UNHIDDEN:"chapter:unhidden",MANGA_UPDATED:"manga:updated",MANGA_ADDED:"manga:added",MANGA_DELETED:"manga:deleted",DOWNLOAD_PROGRESS:"download:progress",DOWNLOAD_COMPLETED:"download:completed",QUEUE_UPDATED:"queue:updated",ACTION_RECORDED:"action:recorded",ACTION_UNDONE:"action:undone"},ue=new Ra,re={bookmarks:[],series:[],categories:[],favorites:{favorites:{},listOrder:[]}},ge=new Set,W=new Map,De=new Map;function qa(t){return re[t]}function Da(t,e){re[t]=e,ge.add(t),He(t)}function Na(t,e){return De.has(t)||De.set(t,new Set),De.get(t).add(e),()=>{var s;return(s=De.get(t))==null?void 0:s.delete(e)}}function He(t){const e=De.get(t);e&&e.forEach(s=>s(re[t]))}function Ne(t){ge.delete(t),W.delete(t)}function Fa(t){return ge.has(t)}async function Fe(t=!1){if(!t&&ge.has("bookmarks"))return re.bookmarks;if(W.has("bookmarks"))return W.get("bookmarks");const e=m.getBookmarks().then(s=>(re.bookmarks=s||[],ge.add("bookmarks"),W.delete("bookmarks"),He("bookmarks"),re.bookmarks)).catch(s=>{throw W.delete("bookmarks"),s});return W.set("bookmarks",e),e}async function Ua(t=!1){if(!t&&ge.has("series"))return re.series;if(W.has("series"))return W.get("series");const e=m.get("/series").then(s=>(re.series=s||[],ge.add("series"),W.delete("series"),He("series"),re.series)).catch(s=>{throw W.delete("series"),s});return W.set("series",e),e}async function Oa(t=!1){if(!t&&ge.has("categories"))return re.categories;if(W.has("categories"))return W.get("categories");const e=m.get("/categories").then(s=>(re.categories=s.categories||[],ge.add("categories"),W.delete("categories"),He("categories"),re.categories)).catch(s=>{throw W.delete("categories"),s});return W.set("categories",e),e}async function Va(t=!1){if(!t&&ge.has("favorites"))return re.favorites;if(W.has("favorites"))return W.get("favorites");const e=m.getFavorites().then(s=>(re.favorites=s||{favorites:{},listOrder:[]},ge.add("favorites"),W.delete("favorites"),He("favorites"),re.favorites)).catch(s=>{throw W.delete("favorites"),s});return W.set("favorites",e),e}function Ha(){ue.on(ve.MANGA_UPDATED,()=>{Ne("bookmarks"),Fe(!0)}),ue.on(ve.MANGA_ADDED,()=>{Ne("bookmarks"),Fe(!0)}),ue.on(ve.MANGA_DELETED,()=>{Ne("bookmarks"),Fe(!0)}),ue.on(ve.DOWNLOAD_COMPLETED,()=>{Ne("bookmarks"),Fe(!0)})}Ha();const oe={get:qa,set:Da,subscribe:Na,invalidate:Ne,isLoaded:Fa,loadBookmarks:Fe,loadSeries:Ua,loadCategories:Oa,loadFavorites:Va};function d(t,e="info"){document.querySelectorAll(".toast").forEach(n=>{n.classList.contains("show")&&n.classList.remove("show")});const a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=t,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}const za={library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',"book-open":'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',"book-marked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',"layout-grid":'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',check:'<path d="M20 6 9 17l-5-5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',"trash-2":'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',"undo-2":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',scissors:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',play:'<polygon points="6 3 20 12 6 21 6 3"/>',pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',"hard-drive":'<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',package:'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"eye-off":'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',circle:'<circle cx="12" cy="12" r="10"/>',lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',"lock-open":'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',"triangle-alert":'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',"shield-alert":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',"circle-help":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',"traffic-cone":'<path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"/><path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"/><path d="M13.9 3.5a1.93 1.93 0 0 0-3.8 0L6.1 19.5a1.93 1.93 0 0 0 1.9 2.5h8a1.93 1.93 0 0 0 1.9-2.5z"/><path d="M2 21h20"/>',sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',"alarm-clock":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',loader:'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',"search-x":'<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',"list-checks":'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',"log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',sliders:'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',"chevron-up":'<path d="m18 15-6-6-6 6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"columns-2":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',"rectangle-vertical":'<rect width="12" height="20" x="6" y="2" rx="2"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',"arrow-left-right":'<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',"refresh-cw":'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>',"rotate-cw":'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"message-circle":'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'};function p(t,e={}){const s=za[t];if(!s)return console.warn("[icons] unknown icon:",t),"";const{size:a,cls:n="",title:i,spin:o=!1}=e,c=["icon",o?"icon-spin":"",n].filter(Boolean).join(" "),l=a?` width="${a}" height="${a}"`:"",u=i?` role="img" aria-label="${String(i).replace(/"/g,"&quot;")}"`:' aria-hidden="true"';return`<svg class="${c}"${l} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${u}>${s}</svg>`}function pe(t="book"){return`<div class="placeholder" data-icon="${t}"></div>`}function Ce(t,e,s={}){const{kind:a="book",self:n=!1,attrs:i=""}=s,o=String(e??"").replace(/"/g,"&quot;"),c=`<div class=&quot;placeholder&quot; data-icon=&quot;${a}&quot;></div>`,l=n?"this.outerHTML":"this.parentElement.innerHTML";return`<img src="${t}" alt="${o}" loading="lazy"${i?" "+i:""} onerror="${l}='${c}'">`}const ss=`${p("folder")} Scan Folder`,as=`${p("loader",{spin:!0})} Scanning...`;async function ja(t,e,s){try{t&&(t.disabled=!0,t.innerHTML=as),e&&(e.innerHTML=as),d("Scanning downloads folder...","info");const n=(await m.scanLibrary()).found||[];if(n.length===0){d("Scan complete: No new manga found","info"),s&&s();return}Qa(n,s)}catch(a){d("Scan failed: "+a.message,"error")}finally{t&&(t.disabled=!1,t.innerHTML=ss),e&&(e.innerHTML=ss)}}async function Qa(t,e){const s=document.createElement("div");s.id="import-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";const a=document.createElement("div");a.style.cssText="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;",a.innerHTML=`
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
  `,s.appendChild(a),document.body.appendChild(s),document.getElementById("import-cancel-btn").addEventListener("click",()=>{s.remove()}),document.getElementById("import-all-btn").addEventListener("click",async()=>{const n=document.querySelectorAll(".import-checkbox:checked"),i=Array.from(n).map(l=>l.dataset.folder);if(i.length===0){d("No folders selected","warning");return}const o=document.getElementById("import-all-btn");o.disabled=!0,o.textContent="Importing...";let c=0;for(const l of i)try{await m.importLocalManga(l),c++}catch(u){console.error("Failed to import",l,u)}s.remove(),d(`Imported ${c} manga`,"success"),e&&e()}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}function Wa(t={}){const{size:e,stroke:s="currentColor",accent:a="var(--accent-primary, #E03A2F)",strokeWidth:n=2,cls:i=""}=t,o=e?` width="${e}" height="${e}"`:"";return`<svg class="${`logo-mark ${i}`.trim()}"${o} viewBox="0 0 24 24" fill="none" stroke="${s}" stroke-width="${n}" stroke-linejoin="round" aria-hidden="true"><polygon points="3,3 10.5,3 8.5,21 3,21"/><polygon points="13,3 21,3 21,10.5 12.17,10.5" fill="${a}" stroke="${a}"/><polygon points="11.89,13 21,13 21,21 11,21"/></svg>`}function ns(){return`${Wa()}<span class="logo-text">Manga<span>Reader</span></span>`}const ae={user:null,get isAdmin(){var t;return((t=this.user)==null?void 0:t.role)==="admin"},get isDemo(){var t;return((t=this.user)==null?void 0:t.role)==="demo"},get canDownload(){var t;return this.isAdmin||!this.isDemo&&!!((t=this.user)!=null&&t.canDownload)},get canEdit(){var t;return this.isAdmin||!this.isDemo&&!!((t=this.user)!=null&&t.canEdit)}};function Rr(t){ae.user=t||null}function ne(t="manga"){if(ae.isDemo)return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${ns()}</a>
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
  `;const e=ae.isAdmin?`<a href="#/admin" class="btn btn-secondary" title="Admin">${p("wrench",{title:"Admin"})}</a>`:"",s=ae.isAdmin?`<a href="#/admin" class="mobile-menu-item">${p("wrench")} Admin</a>`:"",a=ae.canDownload?`<button class="btn btn-secondary" id="scan-btn">${p("folder")} Scan Folder</button>`:"",n=ae.canDownload?`<button class="mobile-menu-item" id="mobile-scan-btn">${p("folder")} Scan Folder</button>`:"",i=ae.canEdit?t==="series"?`<button class="btn btn-primary" id="add-series-btn">${p("plus")} Add Series</button>`:`<button class="btn btn-primary" id="add-manga-btn">${p("plus")} Add Manga</button>`:"",o=ae.canEdit?t==="series"?`<button class="mobile-menu-item primary" id="mobile-add-series-btn">${p("plus")} Add Series</button>`:`<button class="mobile-menu-item primary" id="mobile-add-btn">${p("plus")} Add Manga</button>`:"";return`
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${ns()}</a>
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
  `}function ke(){const t=document.querySelector("header");if(t&&t.dataset.listenersBound)return;t&&(t.dataset.listenersBound="true");const e=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");e&&s&&e.addEventListener("click",()=>{s.classList.toggle("hidden")});const a=document.getElementById("logout-btn"),n=document.getElementById("mobile-logout-btn"),i=()=>{localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"};a&&a.addEventListener("click",i),n&&n.addEventListener("click",i);const o=document.getElementById("demo-exit-btn");o&&o.addEventListener("click",A=>{A.preventDefault(),localStorage.removeItem("manga_auth_token"),window.location.href="/login.html"}),document.querySelectorAll("[data-view]").forEach(A=>{A.addEventListener("click",()=>{const T=A.dataset.view;localStorage.setItem("library_view_mode",T),document.querySelectorAll("[data-view]").forEach(U=>{U.classList.toggle("active",U.dataset.view===T)}),window.dispatchEvent(new CustomEvent("viewModeChange",{detail:{mode:T}}))})});const c=document.querySelector(".logo");c&&c.addEventListener("click",A=>{localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),oe.loadBookmarks(!0).catch(()=>{}),window.dispatchEvent(new CustomEvent("clearFilters"))});const l=document.getElementById("favorites-btn"),u=document.getElementById("mobile-favorites-btn"),h=A=>{A.preventDefault(),R.go("/favorites")};l&&l.addEventListener("click",h),u&&u.addEventListener("click",h);const v=document.getElementById("queue-nav-btn");v&&v.addEventListener("click",A=>{A.preventDefault(),R.go("/queue")});const w=document.getElementById("add-manga-btn"),x=document.getElementById("mobile-add-btn"),E=()=>{document.getElementById("add-modal")||(sessionStorage.setItem("open_add_modal","1"),R.go("/"))};w&&w.addEventListener("click",E),x&&x.addEventListener("click",E);const g=document.getElementById("scan-btn"),S=document.getElementById("mobile-scan-btn");if(g||S){const A=()=>{ja(g,S,async()=>{await oe.loadBookmarks(!0),R.reload()})};g&&g.addEventListener("click",A),S&&S.addEventListener("click",A)}}let $={bookmarks:[],series:[],favorites:{favorites:{},listOrder:[]},activeCategory:localStorage.getItem("library_active_category")||null,artistFilter:null,searchQuery:localStorage.getItem("library_search")||"",searchAuthor:localStorage.getItem("library_search_author")||null,searchAuthorSource:localStorage.getItem("library_search_author_source")||null,sortBy:localStorage.getItem("library_sort")||"updated",viewMode:"manga",loading:!0},st=[];function rs(t){return String(t).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}function Ga(t){return[...t].sort((e,s)=>{var a,n;switch($.sortBy){case"az":return(e.alias||e.title).localeCompare(s.alias||s.title);case"za":return(s.alias||s.title).localeCompare(e.alias||e.title);case"lastread":return(s.lastReadAt||"").localeCompare(e.lastReadAt||"");case"chapters":{const i=((a=e.chapters)==null?void 0:a.length)||e.uniqueChapters||0;return(((n=s.chapters)==null?void 0:n.length)||s.uniqueChapters||0)-i}case"updated":default:return(s.updatedAt||"").localeCompare(e.updatedAt||"")}})}function Nt(){let t=$.bookmarks;const e=(Array.isArray($.categories)?$.categories:[]).filter(s=>typeof s=="object"?s.isNsfw:!1).map(s=>s.name);if($.activeCategory==="__nsfw__"?t=t.filter(s=>(s.categories||[]).some(a=>e.includes(a))):$.activeCategory?t=t.filter(s=>(s.categories||[]).includes($.activeCategory)):e.length>0&&(t=t.filter(s=>!(s.categories||[]).some(a=>e.includes(a)))),$.artistFilter&&(t=t.filter(s=>(s.artists||[]).includes($.artistFilter))),$.searchQuery){const s=$.searchQuery.toLowerCase();t=t.filter(a=>(a.title||"").toLowerCase().includes(s)||(a.alias||"").toLowerCase().includes(s)||(a.artists||[]).some(n=>n.toLowerCase().includes(s)))}return Ga(t)}function Ft(t){var h,v,w;const e=t.alias||t.title,s=t.downloadedCount??((h=t.downloadedChapters)==null?void 0:h.length)??0,a=new Set(t.excludedChapters||[]),n=(t.chapters||[]).filter(x=>!a.has(x.number)),i=new Set(n.map(x=>x.number)).size||t.uniqueChapters||0,o=t.readCount??((v=t.readChapters)==null?void 0:v.length)??0,c=(t.updatedCount??((w=t.updatedChapters)==null?void 0:w.length)??0)>0,l=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover,u=t.source==="local";return`
    <div class="manga-card" data-id="${t.id}">
      <div class="manga-card-cover">
        ${l?Ce(l,e,{kind:u?"local":"book"}):pe(u?"local":"book")}
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
  `}function Ut(){return`
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `}function Ka(t){var n;const e=t.alias||t.title,s=((n=t.entries)==null?void 0:n.length)||t.entry_count||0;let a=null;return t.localCover&&t.coverBookmarkId?a=`/api/public/covers/${t.coverBookmarkId}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(a=t.cover),`
    <div class="manga-card series-card" data-series-id="${t.id}">
      <div class="manga-card-cover">
        ${a?Ce(a,e,{kind:"series"}):pe("series")}
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${s} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${e}</div>
    </div>
  `}function at(){const t=localStorage.getItem("library_view_mode");if(t&&t!==$.viewMode&&($.viewMode=t),$.activeCategory==="Favorites")return R.go("/favorites"),"";let e="";if($.viewMode==="series"){const s=$.series.map(Ka).join("");e=`
      <div class="library-grid" id="library-grid">
        ${$.loading?'<div class="loading-spinner"></div>':s||'<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>'}
      </div>
    `}else{const s=Nt(),n=$.searchAuthor&&$.searchQuery===$.searchAuthor?`
      <div class="manga-card search-sources-card" id="search-sources-card" title="Search online sources for ${rs($.searchAuthor)}"
           style="display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed var(--border-color, #3a3a4a);background:transparent;min-height:220px;text-align:center;">
        <div style="padding:1rem;color:var(--text-muted, #9aa);">
          <div style="font-size:2.5rem;line-height:1;margin-bottom:.5rem;">＋</div>
          <div style="font-size:.85rem;">Search sources for<br><strong style="color:var(--text-color, #fff);">${rs($.searchAuthor)}</strong></div>
        </div>
      </div>`:"",i=s.map(Ft).join("")+n;e=`
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
        ${$.loading?'<div class="loading-spinner"></div>':i||Ut()}
      </div>
    `}return`
    ${ne($.viewMode)}
    <div class="container">
      ${e}
    </div>
    ${Ya()}
    ${Xa()}
    ${Za()}
  `}function Ya(){const{activeCategory:t}=$,s=(Array.isArray($.categories)?$.categories:[]).map(n=>typeof n=="object"?n:{name:n,isNsfw:!1}),a=s.some(n=>n.isNsfw);return`
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
    ${Ja()}
      `}function Ja(){const e=(Array.isArray($.categories)?$.categories:[]).map(s=>typeof s=="object"?s:{name:s,isNsfw:!1});return`
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
  `}function Xa(){return`
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
      `}function Za(){return`
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
      `}function Et(){$.activeCategory=null,$.artistFilter=null,$.searchQuery="",$.searchAuthor=null,$.searchAuthorSource=null,localStorage.removeItem("library_active_category"),localStorage.removeItem("library_artist_filter"),localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),ce()}async function Ct(t){const e=t.target.closest(".manga-card");if(e){if(e.classList.contains("gallery-card")){const n=e.dataset.gallery;R.go(`/read/gallery/${encodeURIComponent(n)}`);return}const s=e.dataset.id,a=e.dataset.seriesId;if(a){R.go(`/series/${a}`);return}if(s){if($.activeCategory==="Favorites"){const n=$.bookmarks.find(i=>i.id===s);if(n){let i=n.last_read_chapter;if(!i&&n.chapters&&n.chapters.length>0&&(i=[...n.chapters].sort((c,l)=>c.number-l.number)[0].number),i){R.go(`/read/${s}/${i}`);return}else d("No chapters available to read","warning")}}R.go(`/manga/${s}`)}}}function xs(){var se,Z,y,I,M;const t=document.getElementById("app");t.removeEventListener("click",Ct),t.addEventListener("click",Ct),window._libraryViewModeListenerSet||(window._libraryViewModeListenerSet=!0,window.addEventListener("viewModeChange",b=>{$.viewMode=b.detail.mode;const L=document.getElementById("app");L.innerHTML=at(),xs(),ke()}));const e=document.getElementById("category-fab-btn"),s=document.getElementById("category-fab-menu");e&&s&&(e.addEventListener("click",()=>{s.classList.toggle("hidden")}),s.addEventListener("click",b=>{const L=b.target.closest(".category-menu-item");if(L){const P=L.dataset.category||null;en(P),s.classList.add("hidden")}})),(se=document.getElementById("manage-categories-btn"))==null||se.addEventListener("click",b=>{b.stopPropagation();const L=document.getElementById("manage-categories-modal");L&&L.classList.add("open")}),(Z=document.getElementById("close-manage-categories-btn"))==null||Z.addEventListener("click",()=>{var b;(b=document.getElementById("manage-categories-modal"))==null||b.classList.remove("open")}),(y=document.querySelector("#manage-categories-modal .modal-overlay"))==null||y.addEventListener("click",()=>{var b;(b=document.getElementById("manage-categories-modal"))==null||b.classList.remove("open")}),(I=document.querySelector("#manage-categories-modal .modal-close"))==null||I.addEventListener("click",()=>{var b;(b=document.getElementById("manage-categories-modal"))==null||b.classList.remove("open")}),(M=document.getElementById("add-category-btn"))==null||M.addEventListener("click",async()=>{var P;const b=document.getElementById("new-category-input"),L=(P=b==null?void 0:b.value)==null?void 0:P.trim();if(L)try{await m.post("/categories",{name:L}),b.value="",d("Category added","success"),await Ae(!0),ce()}catch(N){d("Failed: "+N.message,"error")}}),document.querySelectorAll(".nsfw-toggle").forEach(b=>{b.addEventListener("change",async L=>{const P=b.dataset.category;try{await m.put(`/categories/${encodeURIComponent(P)}/nsfw`,{isNsfw:b.checked}),d(`${P} ${b.checked?"marked as 18+":"unmarked"}`,"success"),await Ae(!0),ce()}catch(N){d("Failed: "+N.message,"error"),b.checked=!b.checked}})}),document.querySelectorAll(".delete-category-btn").forEach(b=>{b.addEventListener("click",async()=>{const L=b.dataset.category;if(confirm(`Delete category "${L}"?`))try{await m.delete(`/categories/${encodeURIComponent(L)}`),d("Category deleted","success"),$.activeCategory===L&&($.activeCategory=null,localStorage.removeItem("library_active_category")),await Ae(!0),ce()}catch(P){d("Failed: "+P.message,"error")}})});const a=document.getElementById("artist-filter-badge");a&&a.addEventListener("click",()=>{$.artistFilter=null,localStorage.removeItem("library_artist_filter"),ce()});const n=document.getElementById("library-search");n&&(n.addEventListener("input",b=>{var P;$.searchQuery=b.target.value,localStorage.setItem("library_search",b.target.value),$.searchAuthor=null,$.searchAuthorSource=null,localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source");const L=document.getElementById("library-grid");if(L){const N=Nt();L.innerHTML=N.map(Ft).join("")||Ut();const Q=document.getElementById("search-clear");!Q&&$.searchQuery?(n.parentElement.insertAdjacentHTML("beforeend",'<button class="search-clear" id="search-clear">×</button>'),(P=document.getElementById("search-clear"))==null||P.addEventListener("click",()=>{$.searchQuery="",$.searchAuthor=null,$.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),n.value="",ce()})):Q&&!$.searchQuery&&Q.remove()}}),$.searchQuery&&n.focus());const i=document.getElementById("search-clear");i&&i.addEventListener("click",()=>{$.searchQuery="",$.searchAuthor=null,$.searchAuthorSource=null,localStorage.removeItem("library_search"),localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source"),ce()});const o=document.getElementById("search-sources-card");o&&o.addEventListener("click",()=>{const b=$.searchAuthor||$.searchQuery,L=$.searchAuthorSource||"nhentai.net";b&&(window.location.hash=`#/scrapers?browse=${encodeURIComponent(L)}&q=${encodeURIComponent(b)}`)});const c=document.getElementById("library-sort");c&&c.addEventListener("change",b=>{$.sortBy=b.target.value,localStorage.setItem("library_sort",$.sortBy),ce()}),window.removeEventListener("clearFilters",Et),window.addEventListener("clearFilters",Et);const l=document.getElementById("add-manga-btn"),u=document.getElementById("mobile-add-btn"),h=document.getElementById("add-modal"),v=document.getElementById("add-modal-close"),w=document.getElementById("add-modal-cancel"),x=document.getElementById("add-modal-submit"),E=document.getElementById("mobile-menu"),g=()=>{E&&E.classList.add("hidden"),h&&h.classList.add("open")};l&&l.addEventListener("click",g),u&&u.addEventListener("click",g),v&&v.addEventListener("click",()=>h.classList.remove("open")),w&&w.addEventListener("click",()=>h.classList.remove("open")),x&&x.addEventListener("click",async()=>{const b=document.getElementById("manga-url"),L=b.value.trim();if(!L){d("Please enter a URL","error");return}try{x.disabled=!0,x.textContent="Adding...",await m.addBookmark(L),d("Manga added successfully!","success"),h.classList.remove("open"),b.value="",await Ae(),ce()}catch(P){d("Failed to add manga: "+P.message,"error")}finally{x.disabled=!1,x.textContent="Add"}});const S=document.getElementById("add-series-btn"),A=document.getElementById("mobile-add-series-btn"),T=document.getElementById("add-series-modal"),U=document.getElementById("add-series-modal-close"),q=document.getElementById("add-series-modal-cancel"),C=document.getElementById("add-series-modal-submit"),_=document.getElementById("mobile-menu");if((S||A)&&T){const b=()=>{_&&_.classList.add("hidden"),T.classList.add("open")};S&&S.addEventListener("click",b),A&&A.addEventListener("click",b)}U&&U.addEventListener("click",()=>T.classList.remove("open")),q&&q.addEventListener("click",()=>T.classList.remove("open")),C&&C.addEventListener("click",async()=>{const b=document.getElementById("series-title"),L=document.getElementById("series-alias"),P=b.value.trim(),N=L.value.trim();if(!P){d("Please enter a title","error");return}try{C.disabled=!0,C.textContent="Creating...",await m.createSeries(P,N),d("Series created successfully!","success"),T.classList.remove("open"),b.value="",L.value="",await Ae(!0),ce()}catch(Q){d("Failed to create series: "+Q.message,"error")}finally{C.disabled=!1,C.textContent="Create"}});const k=T==null?void 0:T.querySelector(".modal-overlay");k&&k.addEventListener("click",()=>T.classList.remove("open"));const B=document.getElementById("empty-add-btn");B&&h&&B.addEventListener("click",()=>h.classList.add("open"));const D=document.getElementById("empty-add-series-btn");D&&T&&D.addEventListener("click",()=>T.classList.add("open"));const j=h==null?void 0:h.querySelector(".modal-overlay");j&&j.addEventListener("click",()=>h.classList.remove("open")),ke()}function en(t){$.activeCategory=t,t?localStorage.setItem("library_active_category",t):localStorage.removeItem("library_active_category"),ce()}async function Ae(t=!1){try{if(ae.isDemo){const[i,o]=await Promise.all([oe.loadBookmarks(t),oe.loadSeries(t)]);$.bookmarks=i,$.categories=[],$.series=o,$.favorites={favorites:{},listOrder:[]},$.loading=!1;return}const[e,s,a,n]=await Promise.all([oe.loadBookmarks(t),oe.loadCategories(t),oe.loadSeries(t),oe.loadFavorites(t)]);$.bookmarks=e,$.categories=s,$.series=a,$.favorites=n,$.loading=!1}catch{d("Failed to load library","error"),$.loading=!1}}async function ce(){var e;const t=document.getElementById("app");if(ae.isDemo)$.activeCategory=null,$.artistFilter=null,$.searchQuery="",$.searchAuthor=null,$.searchAuthorSource=null;else{const s=localStorage.getItem("library_active_category");$.activeCategory!==s&&($.activeCategory=s);const a=localStorage.getItem("library_artist_filter")||null;$.artistFilter!==a&&($.artistFilter=a);const n=localStorage.getItem("library_search")||"";$.searchQuery!==n&&($.searchQuery=n),$.searchAuthor=localStorage.getItem("library_search_author")||null,$.searchAuthorSource=localStorage.getItem("library_search_author_source")||null}$.loading&&(t.innerHTML=at()),$.bookmarks.length===0&&$.loading&&await Ae(),t.innerHTML=at(),xs(),sessionStorage.getItem("open_add_modal")&&(sessionStorage.removeItem("open_add_modal"),(e=document.getElementById("add-modal"))==null||e.classList.add("open")),st.forEach(s=>s()),st=[oe.subscribe("bookmarks",s=>{$.bookmarks=s;const a=document.getElementById("library-grid");if(a){const n=Nt();a.innerHTML=n.map(Ft).join("")||Ut()}})]}function tn(){const t=document.getElementById("app");t&&t.removeEventListener("click",Ct),window.removeEventListener("clearFilters",Et),st.forEach(e=>e()),st=[]}const sn={mount:ce,unmount:tn,render:at},an="manga-offline",nn=1,Ie="images",te="chapters";let Ge=null;function ze(){return new Promise((t,e)=>{if(Ge)return t(Ge);const s=indexedDB.open(an,nn);s.onupgradeneeded=a=>{const n=a.target.result;n.objectStoreNames.contains(Ie)||n.createObjectStore(Ie),n.objectStoreNames.contains(te)||n.createObjectStore(te)},s.onsuccess=()=>{Ge=s.result,t(Ge)},s.onerror=()=>e(s.error)})}function _e(t,e){return ze().then(s=>new Promise((a,n)=>{const c=s.transaction(t,"readonly").objectStore(t).get(e);c.onsuccess=()=>a(c.result),c.onerror=()=>n(c.error)}))}function xt(t,e,s){return ze().then(a=>new Promise((n,i)=>{const l=a.transaction(t,"readwrite").objectStore(t).put(s,e);l.onsuccess=()=>n(),l.onerror=()=>i(l.error)}))}function St(t,e){return ze().then(s=>new Promise((a,n)=>{const c=s.transaction(t,"readwrite").objectStore(t).delete(e);c.onsuccess=()=>a(),c.onerror=()=>n(c.error)}))}function Ot(t){return ze().then(e=>new Promise((s,a)=>{const o=e.transaction(t,"readonly").objectStore(t).getAllKeys();o.onsuccess=()=>s(o.result),o.onerror=()=>a(o.error)}))}function Me(t,e){return`${t}:${e}`}function Vt(t,e,s){return`${t}:${e}:${s}`}function rn(t){const e=t.split(":");return{mangaId:e[0],chapterNum:parseFloat(e[1])}}async function Ht(t,e,s=null){const a=await m.get(`/bookmarks/${t}/chapters/${e}/reader-images`);if(!a||!a.images||a.images.length===0)throw new Error("No images found for this chapter");const n=a.images,i=n.length;let o=0;const c=m.getToken();for(let u=0;u<n.length;u++){const h=typeof n[u]=="string"?n[u]:n[u].url,v=h.startsWith("http")?h:`${window.location.origin}${h}`;try{const w=await fetch(v,{headers:c?{Authorization:`Bearer ${c}`}:{}});if(!w.ok)throw new Error(`HTTP ${w.status}`);const x=await w.blob();await xt(Ie,Vt(t,e,h),x),o++,s&&s(o,i)}catch(w){console.error(`[Offline] Failed to cache image ${u+1}/${i}:`,w)}}const l={mangaId:t,chapterNum:e,imageUrls:n.map(u=>typeof u=="string"?u:u.url),savedAt:Date.now(),imageCount:o};return await xt(te,Me(t,e),l),{success:!0,imageCount:o}}async function on(t,e){const s=await _e(te,Me(t,e));if(!s)return null;const a=[];for(const n of s.imageUrls){const i=await _e(Ie,Vt(t,e,n));if(i)a.push(URL.createObjectURL(i));else return a.forEach(o=>URL.revokeObjectURL(o)),null}return a}async function Ss(t,e){const s=await _e(te,Me(t,e));if(s&&s.imageUrls)for(const a of s.imageUrls)await St(Ie,Vt(t,e,a));await St(te,Me(t,e))}async function ln(t,e){if(!await _e(te,Me(t,e)))return!1;await Ss(t,e);try{return await Ht(t,e),!0}catch(a){return console.warn("[Offline] Could not re-save chapter after edit:",a),!1}}async function cn(t,e){return!!await _e(te,Me(t,e))}async function dn(){const t=await Ot(te),e=[];for(const s of t){if(s.startsWith("auto-offline-"))continue;const a=await _e(te,s);a&&e.push(a)}return e}async function Ls(t){const e=await Ot(te),s=[];for(const a of e)if(!a.startsWith("auto-offline-")&&a.startsWith(`${t}:`)){const{chapterNum:n}=rn(a);s.push(n)}return s}async function un(){if(navigator.storage&&navigator.storage.estimate){const t=await navigator.storage.estimate();return{used:t.usage||0,quota:t.quota||0,usedMB:((t.usage||0)/(1024*1024)).toFixed(1),quotaMB:((t.quota||0)/(1024*1024)).toFixed(0)}}return{used:0,quota:0,usedMB:"0",quotaMB:"Unknown"}}async function pn(){const t=await ze();await new Promise((e,s)=>{const i=t.transaction(Ie,"readwrite").objectStore(Ie).clear();i.onsuccess=e,i.onerror=s}),await new Promise((e,s)=>{const i=t.transaction(te,"readwrite").objectStore(te).clear();i.onsuccess=e,i.onerror=s})}async function hn(t,e){e?await xt(te,`auto-offline-${t}`,{enabled:!0,mangaId:t}):await St(te,`auto-offline-${t}`)}async function mn(t){const e=await _e(te,`auto-offline-${t}`);return!!(e!=null&&e.enabled)}async function gn(){return(await Ot(te)).filter(e=>e.startsWith("auto-offline-")).map(e=>e.replace("auto-offline-",""))}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",async t=>{var e;if(((e=t.data)==null?void 0:e.type)==="sync-offline"){const s=t.data.mangaId;console.log(`[Offline] Auto-sync triggered for manga ${s}`);try{await Is(s)}catch(a){console.error("[Offline] Auto-sync failed:",a)}}});async function Is(t){try{const e=await m.getBookmark(t);if(!e)return;const s=e.downloadedChapters||[],a=await Ls(t),n=s.filter(i=>!a.includes(i));console.log(`[Offline] ${n.length} new chapters to sync for ${e.alias||e.title}`);for(const i of n)await Ht(t,i),console.log(`[Offline] Auto-synced chapter ${i}`)}catch(e){console.error("[Offline] Sync error:",e)}}const fn={saveChapterOffline:Ht,getOfflineChapter:on,deleteOfflineChapter:Ss,refreshOfflineChapter:ln,isChapterOffline:cn,getOfflineChapters:dn,getOfflineChaptersForManga:Ls,getStorageUsage:un,clearAllOfflineData:pn,setAutoOffline:hn,isAutoOffline:mn,getAutoOfflineManga:gn,syncNewChaptersForManga:Is};let r={manga:null,chapter:null,images:[],trophyPages:{},mode:"manga",direction:"rtl",firstPageSingle:!0,lastPageSingle:!1,singlePageMode:!0,currentPage:0,zoom:100,loading:!0,showControls:!0,isGalleryMode:!1,isCollectionMode:!1,favoriteLists:[],allFavorites:null,navigationDirection:null,nextChapterImage:null,nextChapterNum:null,_preloadCache:null,isStreamingMode:!1,_streamAbortController:null};function _s(){if(!r.manga||!r.chapter||!r.allFavorites||!r.allFavorites.favorites)return!1;if(r.isCollectionMode)return!0;let e=[It()];if(r.mode==="manga"&&!r.singlePageMode){const n=G()[r.currentPage];n&&Array.isArray(n)?e=n:n&&n.pages&&(e=n.pages)}const s=e.map(a=>{const n=Ve(r.images[a]);return n?{filename:n}:null}).filter(Boolean);for(const a in r.allFavorites.favorites){const n=r.allFavorites.favorites[a];if(Array.isArray(n)){for(const i of n)if(i.mangaId===r.manga.id&&i.chapterNum===r.chapter.number&&i.imagePaths)for(const o of i.imagePaths){const c=typeof o=="string"?o:(o==null?void 0:o.filename)||(o==null?void 0:o.path);for(const l of s)if(l&&l.filename===c)return!0}}}return!1}function Lt(){const t=document.getElementById("favorites-btn");t&&(_s()?t.classList.add("active"):t.classList.remove("active"))}function Le(){var u;if(r.loading)return`
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;if(!r.manga||!r.images.length&&!r.isStreamingMode)return`
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;const t=r.manga.alias||r.manga.title,e=(u=r.chapter)==null?void 0:u.number,a=G().length,n=r.images.length;let i,o;r.mode==="webtoon"?(i=n-1,o=`${n} pages`):r.singlePageMode?(i=n-1,o=`${r.currentPage+1} / ${n}`):(i=a-1,o=`${r.currentPage+1} / ${a}`);const c=_s(),l=Ts();return`
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
        ${r.isCollectionMode?Bs():r.mode==="webtoon"?As():Ms()}
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
  `}function Bs(){const t=r.mode==="manga";if(t&&!r.singlePageMode){const e=r.images[r.currentPage];if(!e)return"";const s=e.urls||[e.url],a=e.displayMode||"single";return e.displaySide,a==="double"&&s.length>=2?`
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
  `}function As(){return`
    <div class="webtoon-pages">
      ${r.images.map((t,e)=>{const s=typeof t=="string"?t:t.url,a=r.trophyPages[e];return`
        <div class="webtoon-page ${a?"trophy-page":""}" data-page="${e}">
          ${a?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
          <img src="${s}" alt="Page ${e+1}" loading="lazy">
        </div>
      `}).join("")}
    </div>
  `}function Ms(){if(r.singlePageMode)return vn();const e=G()[r.currentPage];if(!e)return"";if(e.type==="link"){const s=e.pages[0],a=r.images[s],n=typeof a=="string"?a:a.url,i=r.trophyPages[s];return`
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
  `}function vn(){const t=r.currentPage,e=r.trophyPages[t];if(e&&!e.isSingle&&e.pages&&e.pages.length===2){const[i,o]=e.pages,c=r.images[i],l=r.images[o],u=typeof c=="string"?c:c==null?void 0:c.url,h=typeof l=="string"?l:l==null?void 0:l.url;if(u&&h)return`
            <div class="manga-spread ${r.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">${p("trophy")}</div><img src="${u}" alt="Page ${i+1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">${p("trophy")}</div><img src="${h}" alt="Page ${o+1}"></div>
            </div>
            `}const s=r.images[t];if(!s)return"";const a=typeof s=="string"?s:s.url,n=r.trophyPages[t];return`
    <div class="manga-spread single ${r.direction}">
      <div class="manga-page ${n?"trophy-page":""}">
        ${n?`<div class="trophy-indicator">${p("trophy")}</div>`:""}
        <img src="${a}" alt="Page ${t+1}">
      </div>
    </div>
  `}function G(){const t=[],e=r.images.length;let s=0;if(r.isCollectionMode){for(let n=0;n<e;n++)t.push([n]);return t}let a=!r.firstPageSingle;for(;s<e;){const n=r.trophyPages[s];if(n){if(!n.isSingle&&n.pages&&n.pages.length===2){const[i,o]=n.pages;t.push([i,o]),s=Math.max(i,o)+1}else t.push([s]),s++;continue}if(!a){a=!0,t.push([s]),s++;continue}if(r.lastPageSingle&&s===e-1){r.nextChapterImage?t.push({type:"link",pages:[s],nextImage:r.nextChapterImage,nextChapter:r.nextChapterNum}):t.push([s]),s++;break}s+1<e?r.trophyPages[s+1]?(t.push([s]),s++):r.lastPageSingle&&s+1===e-1?(t.push([s]),r.nextChapterImage?t.push({type:"link",pages:[s+1],nextImage:r.nextChapterImage,nextChapter:r.nextChapterNum}):t.push([s+1]),s+=2):(t.push([s,s+1]),s+=2):(t.push([s]),s++)}return t}function Ts(){if(r.singlePageMode)return!!r.trophyPages[r.currentPage];const e=G()[r.currentPage];return e?(Array.isArray(e)?e:e.pages||[]).some(a=>!!r.trophyPages[a]):!1}function Ps(){if(r.singlePageMode)return[r.currentPage];const e=G()[r.currentPage];return e?Array.isArray(e)?e:e.pages||[]:[]}async function yn(){if(!r.manga||!r.chapter||r.isCollectionMode)return;const t=Ps();if(t.length===0)return;if(t.some(s=>!!r.trophyPages[s])){const s=[...t];if(r.singlePageMode){const a=r.trophyPages[r.currentPage];a&&!a.isSingle&&a.pages&&a.pages.length>1&&(s.length=0,s.push(...a.pages))}s.forEach(a=>delete r.trophyPages[a]),d(`Page${s.length>1?"s":""} unmarked as trophy`,"info")}else{let s=t,a=r.singlePageMode||t.length===1;if(!r.singlePageMode&&t.length===2){const i=await Ds(t,"Mark as trophy");if(!i)return;s=i.pages,a=i.pages.length===1}s.forEach(i=>{r.trophyPages[i]={isSingle:a,pages:[...s]}});const n=a?"single":"double";d(`Page${s.length>1?"s":""} marked as trophy (${n})`,"success")}try{await m.saveTrophyPages(r.manga.id,r.chapter.number,r.trophyPages)}catch(s){console.error("Failed to save trophy pages:",s)}we(),Rs()}function Rs(){const t=document.getElementById("trophy-btn");if(t){const e=Ts();t.classList.toggle("active",e),t.title=e?"Unmark trophy":"Mark as trophy"}}async function je(){if(!r.manga||!r.chapter||r.isCollectionMode||!r.images.length)return;let t=1;if(r.mode==="manga")if(r.singlePageMode)t=r.currentPage+1;else{const s=G()[r.currentPage];s&&s.length>0&&(t=s[0]+1)}else{const e=document.getElementById("reader-content");if(e){const s=e.querySelectorAll("img"),a=e.scrollTop;let n=0;s.forEach((i,o)=>{a>=n&&(t=o+1),n+=i.offsetHeight})}}try{if(ae.isDemo)return;await m.updateReadingProgress(r.manga.id,r.chapter.number,t,r.images.length)}catch(e){console.error("Failed to save progress:",e)}}function nt(){var s,a,n,i,o,c,l,u,h,v,w,x,E,g,S,A,T,U,q;const t=document.getElementById("app");(s=document.getElementById("reader-close-btn"))==null||s.addEventListener("click",async()=>{r.isStreamingMode||(await je(),await $e()),r.isStreamingMode?R.go("/scrapers"):r.manga&&r.manga.id!=="gallery"?R.go(`/manga/${r.manga.id}`):R.go("/")}),(a=document.getElementById("reader-back-btn"))==null||a.addEventListener("click",()=>{R.go(r.isStreamingMode?"/scrapers":"/")}),(n=document.getElementById("reader-settings-btn"))==null||n.addEventListener("click",()=>{var C;(C=document.getElementById("reader-settings"))==null||C.classList.toggle("hidden")}),(i=document.getElementById("close-settings-btn"))==null||i.addEventListener("click",()=>{var C;(C=document.getElementById("reader-settings"))==null||C.classList.add("hidden")}),(o=document.getElementById("single-page-btn"))==null||o.addEventListener("click",()=>{var C,_;if(r.singlePageMode){const k=G();let B=0;for(let D=0;D<k.length;D++)if(k[D].includes(r.currentPage)){B=D;break}r.singlePageMode=!1,r.currentPage=B}else{const B=G()[r.currentPage];r.singlePageMode=!0,r.currentPage=B?B[0]:0}localStorage.setItem("reader_single_page",r.singlePageMode?"1":"0"),(C=r.manga)!=null&&C.id&&((_=r.chapter)!=null&&_.number)&&$e(),Ue()}),(c=document.getElementById("trophy-btn"))==null||c.addEventListener("click",()=>{yn()}),t.querySelectorAll("[data-mode]").forEach(C=>{C.addEventListener("click",()=>{var B,D;const _=C.dataset.mode;let k=It();if(r.mode=_,localStorage.setItem("reader_mode",r.mode),_==="webtoon")r.currentPage=k;else if(r.singlePageMode)r.currentPage=k;else{const j=G();let se=0;for(let Z=0;Z<j.length;Z++)if(j[Z].includes(k)){se=Z;break}r.currentPage=se}(B=r.manga)!=null&&B.id&&((D=r.chapter)!=null&&D.number)&&$e(),Ue(),_==="webtoon"&&setTimeout(()=>{const j=document.getElementById("reader-content");if(j){const se=j.querySelectorAll("img");se[k]&&se[k].scrollIntoView({behavior:"auto",block:"start"})}},100)})}),t.querySelectorAll("[data-direction]").forEach(C=>{C.addEventListener("click",async()=>{var _,k;r.direction=C.dataset.direction,localStorage.setItem("reader_direction",r.direction),(_=r.manga)!=null&&_.id&&((k=r.chapter)!=null&&k.number)&&await $e(),Ue()})}),(l=document.getElementById("first-page-single"))==null||l.addEventListener("change",async C=>{r.firstPageSingle=C.target.checked,await $e(),we()}),(u=document.getElementById("last-page-single"))==null||u.addEventListener("change",async C=>{var _,k;r.lastPageSingle=C.target.checked,await $e(),r.lastPageSingle&&((_=r.manga)!=null&&_.id)&&((k=r.chapter)!=null&&k.number)?await qs():(r.nextChapterImage=null,r.nextChapterNum=null),we()}),(h=document.getElementById("zoom-slider"))==null||h.addEventListener("input",C=>{r.zoom=parseInt(C.target.value);const _=document.getElementById("reader-content");_&&(_.style.zoom=`${r.zoom}%`)});const e=document.getElementById("page-slider");if(e&&(e.addEventListener("input",C=>{const _=parseInt(C.target.value),k=document.getElementById("page-indicator");k&&(r.singlePageMode?k.textContent=`${_+1} / ${r.images.length}`:k.textContent=`${_+1} / ${G().length}`)}),e.addEventListener("change",C=>{r.currentPage=parseInt(C.target.value),we()})),r.mode==="manga"){const C=document.getElementById("reader-content");C==null||C.addEventListener("click",_=>{var j;if(_.target.closest("button, a, .link-overlay"))return;const k=C.getBoundingClientRect(),D=(_.clientX-k.left)/k.width;D<.3?_t():D>.7?Ze():(r.showControls=!r.showControls,(j=document.querySelector(".reader"))==null||j.classList.toggle("controls-hidden",!r.showControls))})}document.addEventListener("keydown",Ns),(v=document.getElementById("prev-chapter-btn"))==null||v.addEventListener("click",()=>rt(-1)),(w=document.getElementById("next-chapter-btn"))==null||w.addEventListener("click",()=>rt(1)),r.mode==="webtoon"&&((x=document.getElementById("reader-content"))==null||x.addEventListener("click",()=>{var C;r.showControls=!r.showControls,(C=document.querySelector(".reader"))==null||C.classList.toggle("controls-hidden",!r.showControls)})),(E=document.getElementById("rotate-btn"))==null||E.addEventListener("click",async()=>{const C=gt();if(!(!C||!r.manga||!r.chapter))try{d("Rotating...","info");const _=await m.rotatePage(r.manga.id,r.chapter.number,C);_.images&&(await ft(_.images),d("Page rotated","success"))}catch(_){d("Rotate failed: "+_.message,"error")}}),(g=document.getElementById("swap-btn"))==null||g.addEventListener("click",async()=>{const _=G()[r.currentPage];if(!_||_.length!==2||!r.manga||!r.chapter){d("Select a spread with 2 pages to swap","info");return}const k=Ve(r.images[_[0]]),B=Ve(r.images[_[1]]);if(!(!k||!B))try{d("Swapping...","info");const D=await m.swapPages(r.manga.id,r.chapter.number,k,B);D.images&&(await ft(D.images),d("Pages swapped","success"))}catch(D){d("Swap failed: "+D.message,"error")}}),(S=document.getElementById("split-btn"))==null||S.addEventListener("click",async()=>{const C=gt();if(!C||!r.manga||!r.chapter||!confirm("Split this page into halves? This is permanent."))return;const _=document.getElementById("split-btn");try{d("Preparing to split...","info"),_&&(_.disabled=!0),r.images=[],r.loading=!0,t.innerHTML=Le(),await new Promise(B=>setTimeout(B,2e3)),d("Splitting page...","info");const k=await m.splitPage(r.manga.id,r.chapter.number,C);_&&(_.disabled=!1),await xe(r.manga.id,r.chapter.number,r.chapter.versionUrl),t.innerHTML=Le(),nt(),we(),k.warning?d(k.warning,"warning"):d("Page split into halves","success")}catch(k){_&&(_.disabled=!1),d("Split failed: "+k.message,"error"),await xe(r.manga.id,r.chapter.number,r.chapter.versionUrl),t.innerHTML=Le(),nt()}}),(A=document.getElementById("delete-page-btn"))==null||A.addEventListener("click",async()=>{const C=gt();if(!(!C||!r.manga||!r.chapter)&&confirm(`Delete page "${C}" permanently? This cannot be undone.`))try{d("Deleting...","info");const _=await m.deletePage(r.manga.id,r.chapter.number,C);_.images&&(await ft(_.images),d("Page deleted","success"))}catch(_){d("Delete failed: "+_.message,"error")}}),(T=document.getElementById("favorites-btn"))==null||T.addEventListener("click",async()=>{try{const k=await m.getFavorites();r.allFavorites=k,r.favoriteLists=Object.keys(k.favorites||k||{})}catch(k){console.error("Failed to load favorites",k),d("Failed to load favorites","error");return}let _=[It()];if(r.mode==="manga"&&!r.singlePageMode){const B=G()[r.currentPage];B&&Array.isArray(B)?_=B:B&&B.pages&&(_=B.pages)}if(_.length>1){const k=await Ds(_,"Select Page for Favorites");if(!k)return;_=k.pages}kn(_)}),(U=document.getElementById("fullscreen-btn"))==null||U.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{d("Fullscreen not supported","info")})}),(q=document.getElementById("stream-add-lib-btn"))==null||q.addEventListener("click",async()=>{var k;const C=document.getElementById("stream-add-lib-btn");if(!((k=r.manga)!=null&&k._streamUrl)){d("No URL to add","error");return}const _=C.innerHTML;C.innerHTML=p("loader",{spin:!0}),C.disabled=!0;try{const B=await m.addBookmark(r.manga._streamUrl);if(!B.jobId)throw new Error("No job ID returned");d("Adding to library...","info");const D=setInterval(async()=>{var j;try{const Z=(await m.getQueueHistory(20)).find(y=>y.id===B.jobId);Z&&(Z.status==="completed"?(clearInterval(D),(j=Z.result)!=null&&j.bookmark&&(d("Added to library!","success"),C.innerHTML=p("check"),C.title="Added! Click to view",C.disabled=!1,C.onclick=()=>{R.go(`/manga/${Z.result.bookmark.id}`)})):Z.status==="failed"&&(clearInterval(D),d("Failed to add: "+(Z.error||"Unknown error"),"error"),C.innerHTML=_,C.disabled=!1))}catch{}},1500)}catch(B){d("Failed to add: "+B.message,"error"),C.innerHTML=_,C.disabled=!1}}),document.body.classList.add("reader-active")}function Ve(t){var n;const e=typeof t=="string"?t:(t==null?void 0:t.url)||((n=t==null?void 0:t.urls)==null?void 0:n[0]);if(!e)return null;const a=e.split("?")[0].split("/");return decodeURIComponent(a[a.length-1])}function gt(){const t=Ps();return t.length===0?null:Ve(r.images[t[0]])}async function ft(t){var s,a;(s=r.manga)!=null&&s.id&&((a=r.chapter)!=null&&a.number)&&!r.isStreamingMode&&fn.refreshOfflineChapter(r.manga.id,r.chapter.number).then(n=>{n&&console.log("[Reader] Refreshed offline copy after page edit")}).catch(n=>console.warn("[Reader] Offline refresh failed:",n));const e=Date.now();if(r.images=t.map(n=>{const i=typeof n=="string"?n:n==null?void 0:n.url;if(!i)return n;const o=i+(i.includes("?")?"&":"?")+`_t=${e}`;return typeof n=="string"?o:{...n,url:o}}),r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.min(r.currentPage,r.images.length-1);else{const n=G();r.currentPage=Math.min(r.currentPage,n.length-1)}r.currentPage=Math.max(0,r.currentPage),we()}async function qs(){var t,e;if(!(!((t=r.manga)!=null&&t.id)||!((e=r.chapter)!=null&&e.number)))try{const s=await m.getNextChapterPreview(r.manga.id,r.chapter.number);r.nextChapterImage=s.firstImage||null,r.nextChapterNum=s.nextChapter||null}catch{r.nextChapterImage=null,r.nextChapterNum=null}}async function bn(){var i,o;if(!((i=r.manga)!=null&&i.id)||!((o=r.chapter)!=null&&o.number)||r.isCollectionMode)return;const e=[...r.manga.downloadedChapters||[]].sort((c,l)=>c-l),s=e.indexOf(r.chapter.number);if(s<0||s>=e.length-1)return;const a=e[s+1],n=r.manga.id;if(!(r._preloadCache&&r._preloadCache.chapterNum===a&&r._preloadCache.mangaId===n))try{const l=(r.manga.downloadedVersions||{})[a]||[],u=Array.isArray(l)?l[0]:l,h=u?`/bookmarks/${n}/chapters/${a}/reader-images?version=${encodeURIComponent(u)}`:`/bookmarks/${n}/chapters/${a}/reader-images`,w=(await m.get(h)).images||[];if(w.length===0)return;const x=w.map(E=>{const g=new Image,S=typeof E=="string"?E:E.url;return S&&(g.src=S),g});r._preloadCache={chapterNum:a,mangaId:n,images:w,imageObjects:x,versionUrl:u},console.log(`[Reader] Preloaded ${w.length} images for chapter ${a}`)}catch(c){console.warn("[Reader] Failed to preload next chapter:",c)}}function wn(t,e){return new Promise(s=>{const a=document.createElement("div");a.className="version-modal-overlay",a.innerHTML=`
            <div class="version-modal">
                <h3>Chapter ${e} has ${t.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;const n=a.querySelector(".version-list");t.forEach((i,o)=>{const c=document.createElement("button");c.className="version-item",c.textContent=`Version ${o+1}`,c.addEventListener("click",()=>{a.remove(),s(i)}),n.appendChild(c)}),a.querySelector(".version-cancel").addEventListener("click",()=>{a.remove(),s(null)}),a.addEventListener("click",i=>{i.target===a&&(a.remove(),s(null))}),document.body.appendChild(a)})}function kn(t){if(!r.manga||!r.chapter)return;const e=t.map(l=>{const u=Ve(r.images[l]);return u?{filename:u}:null}).filter(Boolean),s=l=>{if(!r.allFavorites||!r.allFavorites.favorites)return-1;const u=r.allFavorites.favorites[l];if(!Array.isArray(u))return-1;for(let h=0;h<u.length;h++){const v=u[h];if(v.mangaId===r.manga.id&&v.chapterNum===r.chapter.number&&v.imagePaths)for(const w of v.imagePaths){const x=typeof w=="string"?w:(w==null?void 0:w.filename)||(w==null?void 0:w.path);for(const E of e)if(E&&E.filename===x)return h}}return-1},a=document.createElement("div");a.className="page-picker-overlay";let n="";r.favoriteLists.length===0?n='<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>':(n='<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">',r.favoriteLists.forEach(l=>{const h=s(l)!==-1;n+=`
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
    `,a.appendChild(i),a.querySelector(".page-picker-cancel").addEventListener("click",()=>{a.remove(),Lt()}),a.addEventListener("click",l=>{l.target===a&&(a.remove(),Lt())}),a.querySelectorAll(".list-option").forEach(l=>{l.addEventListener("click",async()=>{const u=l.dataset.list,h=s(u),v=h!==-1;l.style.opacity="0.5",l.style.pointerEvents="none";try{if(v){await m.removeFavoriteItem(u,h);const w=await m.getFavorites();r.allFavorites=w,l.classList.remove("active-list"),l.querySelector("span:last-child").innerHTML=p("plus")}else{const w=t.length>1?"double":"single",x={mangaId:r.manga.id,chapterNum:r.chapter.number,title:`${r.manga.alias||r.manga.title} Ch.${r.chapter.number} p${t[0]+1}`,imagePaths:e,displayMode:w,displaySide:r.direction==="rtl"?"right":"left"};await m.addFavoriteItem(u,x);const E=await m.getFavorites();r.allFavorites=E,l.classList.add("active-list"),l.querySelector("span:last-child").innerHTML=p("check")}}catch(w){console.error(w)}finally{l.style.opacity="1",l.style.pointerEvents="auto"}})}),document.body.appendChild(a)}function Ds(t,e){return new Promise(s=>{const[a,n]=t,i=r.images[a],o=r.images[n],c=typeof i=="string"?i:i==null?void 0:i.url,l=typeof o=="string"?o:o==null?void 0:o.url,u=r.direction==="rtl",h=u?n:a,v=u?a:n,w=u?l:c,x=u?c:l,E=document.createElement("div");E.className="page-picker-overlay",E.innerHTML=`
            <div class="page-picker-modal">
                <h3>${e}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${h+1}">
                        <img src="${w}" alt="Page ${h+1}">
                        <span class="page-picker-label">Page ${h+1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${v+1}">
                        <img src="${x}" alt="Page ${v+1}">
                        <span class="page-picker-label">Page ${v+1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    ${p("columns-2")} Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;const g=S=>{E.remove(),s(S)};E.querySelectorAll(".page-picker-option").forEach(S=>{S.addEventListener("click",()=>{const A=S.dataset.choice;A==="left"?g({pages:[h]}):A==="right"?g({pages:[v]}):A==="both"&&g({pages:t})})}),E.querySelector(".page-picker-cancel").addEventListener("click",()=>g(null)),E.addEventListener("click",S=>{S.target===E&&g(null)}),document.body.appendChild(E)})}function It(){if(r.mode==="webtoon"){const t=document.getElementById("reader-content");if(t){const e=t.querySelectorAll("img");if(e.length>0){const s=t.scrollTop;if(s>10){let a=0;for(let n=0;n<e.length;n++){const i=e[n].offsetHeight;if(a+i>s)return n;a+=i}}}}return 0}else{if(r.singlePageMode)return r.currentPage;{const e=G()[r.currentPage];return e&&e.length>0?e[0]:0}}}function Ns(t){if(!(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA")){if(t.key==="Escape"){je(),r.manga&&R.go(`/manga/${r.manga.id}`);return}if(r.mode==="manga")t.key==="ArrowLeft"?r.direction==="rtl"?Ze():_t():t.key==="ArrowRight"?r.direction==="rtl"?_t():Ze():t.key===" "&&(t.preventDefault(),Ze());else if(r.mode==="webtoon"&&t.key===" "){t.preventDefault();const e=document.getElementById("reader-content");if(e){const s=e.clientHeight*.8;e.scrollBy({top:t.shiftKey?-s:s,behavior:"smooth"})}}}}function Ze(){const t=G(),e=r.singlePageMode?r.images.length-1:t.length-1;if(r.currentPage<e)r.currentPage++,we();else{const s=t[r.currentPage],a=s&&s.type==="link";je(),a&&(r.navigationDirection="next-linked"),rt(1)}}function _t(){r.currentPage>0?(r.currentPage--,we()):rt(-1)}function we(){const t=document.getElementById("reader-content");if(t){t.innerHTML=r.isCollectionMode?Bs():r.mode==="webtoon"?As():Ms();const e=document.getElementById("page-indicator");e&&(r.singlePageMode?e.textContent=`${r.currentPage+1} / ${r.images.length}`:e.textContent=`${r.currentPage+1} / ${G().length}`);const s=document.getElementById("page-slider");s&&(s.value=r.currentPage,s.max=r.singlePageMode?r.images.length-1:G().length-1),Rs(),Lt()}}function Ue(){const t=document.getElementById("app");t&&(t.innerHTML=Le(),nt())}async function rt(t){if(console.log("[Nav] navigateChapter called with delta:",t),r.isStreamingMode)return;if(!r.manga||!r.chapter){console.log("[Nav] early return - no manga or chapter");return}await je(),await $e();const s=[...r.manga.downloadedChapters||[]].sort((i,o)=>i-o),a=s.indexOf(r.chapter.number),n=a+t;if(console.log("[Nav]",{delta:t,chapterNumber:r.chapter.number,sorted:s,currentIdx:a,newIdx:n}),n>=0&&n<s.length){r.navigationDirection||(r.navigationDirection=t<0?"prev":null);const i=s[n],c=(r.manga.downloadedVersions||{})[i]||[],l=Array.isArray(c)?c[0]:c,u=l?`?version=${encodeURIComponent(l)}`:"";console.log("[Nav] Calling router.go with:",`/read/${r.manga.id}/${i}${u}`),R.go(`/read/${r.manga.id}/${i}${u}`)}else d(t>0?"Last chapter":"First chapter","info")}async function xe(t,e,s){var a,n,i,o,c;console.log("[Reader] loadData called:",{mangaId:t,chapterNum:e,versionUrl:s});try{if(r.mode=localStorage.getItem("reader_mode")||"manga",r.direction=localStorage.getItem("reader_direction")||"rtl",r.singlePageMode=localStorage.getItem("reader_single_page")!=="0",t==="gallery"){const l=decodeURIComponent(e),h=((a=(await m.getFavorites()).favorites)==null?void 0:a[l])||[];r.images=[];for(const v of h){const w=v.imagePaths||[],x=[];for(const E of w){let g;typeof E=="string"?g=E:E&&typeof E=="object"&&(g=E.filename||E.path||E.name||E.url,g&&g.includes("/")&&(g=g.split("/").pop()),g&&g.includes("\\")&&(g=g.split("\\").pop())),g&&x.push(`/api/public/chapter-images/${v.mangaId}/${v.chapterNum}/${encodeURIComponent(g)}`)}x.length>0&&r.images.push({urls:x,displayMode:v.displayMode||"single",displaySide:v.displaySide||"left"})}r.manga={id:"gallery",title:l,alias:l},r.chapter={number:"Gallery"},r.isGalleryMode=!0,r.isCollectionMode=!0,r.images.length===0&&d("Gallery is empty","warning")}else if(t==="trophies"){const l=e;let u=[],h="Trophies";if(l.startsWith("series-")){const v=l.replace("series-",""),x=(await store.loadSeries()).find(S=>S.id===v);h=x?x.alias||x.title:"Series Trophies";const g=(await store.loadBookmarks()).filter(S=>S.seriesId===v);for(const S of g){const A=await m.getTrophyPagesAll(S.id);for(const T in A)for(const U in A[T]){const q=A[T][U],_=(await m.getChapterImages(S.id,T)).images[U],k=typeof _=="string"?_.split("/").pop():(_==null?void 0:_.filename)||(_==null?void 0:_.path);u.push({mangaId:S.id,chapterNum:T,imagePaths:[{filename:k}],displayMode:q.isSingle?"single":"double",displaySide:"left"})}}}else{const v=await m.getBookmark(l);h=v?v.alias||v.title:"Manga Trophies";const w=await m.getTrophyPagesAll(l);for(const x in w)for(const E in w[x]){const g=w[x][E],A=(await m.getChapterImages(l,x)).images[E],T=typeof A=="string"?A.split("/").pop():(A==null?void 0:A.filename)||(A==null?void 0:A.path);u.push({mangaId:l,chapterNum:x,imagePaths:[{filename:decodeURIComponent(T)}],displayMode:g.isSingle?"single":"double",displaySide:"left"})}}r.images=u.map(v=>{const w=v.imagePaths[0].filename;return{urls:[`/api/public/chapter-images/${v.mangaId}/${v.chapterNum}/${encodeURIComponent(w)}`],displayMode:v.displayMode,displaySide:v.displaySide}}),r.manga={id:"trophies",title:h,alias:h},r.chapter={number:"🏆"},r.isCollectionMode=!0,r.isGalleryMode=!1}else if(t==="stream"){r.isStreamingMode=!0,r.isCollectionMode=!1,r.isGalleryMode=!1,r.singlePageMode=!0;const l=sessionStorage.getItem("streamPreviewUrl"),u=sessionStorage.getItem("streamPreviewScraper"),h=sessionStorage.getItem("streamPreviewTitle")||"Preview";r.manga={id:"stream",title:h,alias:h,_streamUrl:l},r.chapter={number:1},r.images=[],l?$n(l,u):d("No stream URL found","error")}else{r.isGalleryMode=!1;const l=await m.getBookmark(t);r.manga=l,console.log("[Reader] manga loaded, finding chapter..."),r.chapter=((n=l.chapters)==null?void 0:n.find(h=>h.number===parseFloat(e)))||{number:parseFloat(e)};const u=parseFloat(e);if(r._preloadCache&&r._preloadCache.mangaId===t&&r._preloadCache.chapterNum===u)console.log("[Reader] Using preloaded images for chapter",e),r.images=r._preloadCache.images||[],r._preloadCache=null;else{const h=s?`/bookmarks/${t}/chapters/${e}/reader-images?version=${encodeURIComponent(s)}`:`/bookmarks/${t}/chapters/${e}/reader-images`,v=await m.get(h);console.log("[Reader] images loaded, count:",(i=v.images)==null?void 0:i.length),r.images=v.images||[]}try{const h=await m.getChapterSettings(t,e);if(is(h))os(h);else try{const w=[...r.manga.downloadedChapters||[]].sort((A,T)=>A-T),x=parseFloat(e),E=w.indexOf(x),g=[];if(E!==-1){for(let A=E-1;A>=0;A--)g.push(w[A]);for(let A=E+1;A<w.length;A++)g.push(w[A])}const S=12;for(const A of g.slice(0,S)){const T=await m.getChapterSettings(t,A);if(is(T)){os(T),console.log("[Reader] Inherited settings from chapter",A);break}}}catch(v){console.warn("Failed to inherit chapter settings",v)}}catch(h){console.warn("Failed to load chapter settings",h)}try{const h=await m.getTrophyPages(t,e);r.trophyPages=h||{}}catch(h){console.warn("Failed to load trophy pages",h)}try{const h=await m.getFavorites();r.allFavorites=h,r.favoriteLists=Object.keys(h.favorites||h||{})}catch(h){console.warn("Failed to load favorites",h)}}if(r.isStreamingMode)r.currentPage=0;else{const l=parseFloat(e),u=(c=(o=r.manga)==null?void 0:o.readingProgress)==null?void 0:c[l];if(u&&u.page<u.totalPages)if(r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.max(0,u.page-1);else{const h=Math.max(0,u.page-1),v=G();let w=0;for(let x=0;x<v.length;x++){const E=v[x],g=Array.isArray(E)?E:E.pages||[];if(g.includes(h)||g[0]>=h){w=x;break}w=x}r.currentPage=w}else r.currentPage=0,r._resumeScrollToPage=u.page-1;else r.currentPage=0}}catch(l){console.error("Error loading chapter:",l),d("Failed to load chapter","error")}if(!r.isStreamingMode){if(r.navigationDirection==="prev"&&r.mode==="manga")if(r.singlePageMode)r.currentPage=Math.max(0,r.images.length-1);else{const l=G();r.currentPage=Math.max(0,l.length-1)}else if(r.navigationDirection==="next-linked"&&r.mode==="manga"&&r.images.length>1)if(r.singlePageMode)r.currentPage=1;else{const l=G();let u=0;for(let h=0;h<l.length;h++){const v=l[h];if((Array.isArray(v)?v:v.pages||[]).includes(1)){u=h;break}}r.currentPage=u}}r.navigationDirection=null,r.lastPageSingle&&!r.isStreamingMode&&await qs(),r.loading=!1,Ue(),r.isStreamingMode||bn(),r.mode==="webtoon"&&r._resumeScrollToPage&&setTimeout(()=>{const l=document.getElementById("reader-content");if(l){const u=l.querySelectorAll("img");u[r._resumeScrollToPage]&&u[r._resumeScrollToPage].scrollIntoView({behavior:"auto",block:"start"})}delete r._resumeScrollToPage},300)}async function $n(t,e){r._streamAbortController&&r._streamAbortController.abort(),r._streamAbortController=new AbortController;const{signal:s}=r._streamAbortController;try{let a="/api/scrapers/preview-images-stream?";e&&(a+=`scraper=${encodeURIComponent(e)}&`),a+=`url=${encodeURIComponent(t)}`;const n=localStorage.getItem("manga_auth_token"),i={};n&&(i.Authorization=`Bearer ${n}`),console.log("[Reader] Starting stream from:",a);const o=await fetch(a,{headers:i,signal:s});if(!o.ok)throw new Error(`Failed to start stream: ${o.statusText}`);const c=o.body.getReader(),l=new TextDecoder;let u="";for(;;){const{value:h,done:v}=await c.read();if(v||s.aborted)break;u+=l.decode(h,{stream:!0});const w=u.split(`

`);u=w.pop();let x=!1;for(const E of w)if(E.startsWith("data: ")){const g=E.substring(6);try{const S=JSON.parse(g);if(S.type==="metadata")r.manga.title=S.title,r.manga.alias=S.title,Ue();else if(S.type==="image"){const A=`/api/scrapers/proxy-cover?url=${encodeURIComponent(S.url)}`;r.images.push(A),x=!0}else if(S.type==="error")d("Stream error: "+S.message,"error");else if(S.type==="done")break}catch(S){console.error("Parse error for SSE data:",S)}}x&&we()}}catch(a){a.name!=="AbortError"&&(console.error("Preview stream error:",a),d("Stream failed: "+a.message,"error"))}finally{r._streamAbortController&&r._streamAbortController.signal===s&&(r._streamAbortController=null)}}async function En(t=[]){console.log("[Reader] mount called with params:",t);let[e,s]=t,a=null;if(s&&s.includes("?")){const[i,o]=s.split("?");s=i,a=new URLSearchParams(o).get("version")}if(console.log("[Reader] mangaId:",e,"chapterNum:",s,"urlVersion:",a),!e||!s){R.go("/");return}const n=document.getElementById("app");if(r.loading=!0,console.log("[Reader] loading set to true, calling loadData..."),r.images=[],r.singlePageMode=!1,r._resumeScrollToPage=null,r.nextChapterImage=null,r.nextChapterNum=null,n.innerHTML=Le(),a)await xe(e,s,decodeURIComponent(a));else try{const i=await m.getBookmark(e),o=i.downloadedVersions||{},c=new Set(i.deletedChapterUrls||[]),l=o[parseFloat(s)];let u=[];if(Array.isArray(l)&&(u=l.filter(h=>!c.has(h))),u.length>1){const h=await wn(u,s);if(h===null){R.go(`/manga/${e}`);return}await xe(e,s,h)}else u.length===1?await xe(e,s,u[0]):await xe(e,s)}catch(i){console.log("[Reader] Error in version check, falling back:",i),await xe(e,s)}if(n.innerHTML=Le(),console.log("[Reader] render called, loading:",r.loading,"manga:",!!r.manga,"images:",r.images.length),nt(),r.mode==="webtoon"&&r._resumeScrollToPage!=null){const i=r._resumeScrollToPage;r._resumeScrollToPage=null,setTimeout(()=>{const o=document.getElementById("reader-content");if(o){const c=o.querySelectorAll("img");c[i]&&c[i].scrollIntoView({behavior:"auto",block:"start"})}},300)}}async function Cn(){console.log("[Reader] unmount called"),r._streamAbortController&&(r._streamAbortController.abort(),r._streamAbortController=null),r.isStreamingMode||(await je(),await $e()),document.body.classList.remove("reader-active"),document.removeEventListener("keydown",Ns),r.manga=null,r.chapter=null,r.images=[],r.loading=!0,r.singlePageMode=!1,r.isStreamingMode=!1,r._resumeScrollToPage=null,r._preloadCache=null}function is(t){return!!t&&(t.mode!==void 0||t.direction!==void 0||t.firstPageSingle!==void 0||t.lastPageSingle!==void 0||t.singlePageMode!==void 0)}function os(t){t&&(t.mode&&(r.mode=t.mode),t.direction&&(r.direction=t.direction),t.firstPageSingle!==void 0&&(r.firstPageSingle=t.firstPageSingle),t.lastPageSingle!==void 0&&(r.lastPageSingle=t.lastPageSingle),t.singlePageMode!==void 0&&(r.singlePageMode=t.singlePageMode))}async function $e(){if(!(!r.manga||!r.chapter||r.manga.id==="gallery"||r.isStreamingMode)&&!ae.isDemo)try{await m.updateChapterSettings(r.manga.id,r.chapter.number,{mode:r.mode,direction:r.direction,firstPageSingle:r.firstPageSingle,lastPageSingle:r.lastPageSingle,singlePageMode:r.singlePageMode})}catch(t){console.error("Failed to save settings:",t)}}async function Fs(t){try{const e=await m.getBookmark(t),s=e.downloadedChapters||[],a=new Set(e.readChapters||[]),n=e.readingProgress||{},i=e.downloadedVersions||{},o=[...s].sort((l,u)=>l-u);let c=null;for(const l of o){const u=n[l];if(u&&u.page<u.totalPages&&!a.has(l)){c=l;break}}if(c===null){for(const l of o)if(!a.has(l)){c=l;break}}if(c===null&&o.length>0&&(c=o[0]),c!==null){const l=i[c]||[],u=Array.isArray(l)?l[0]:l,h=u?`?version=${encodeURIComponent(u)}`:"";R.go(`/read/${t}/${c}${h}`)}else d("No downloaded chapters to read","info")}catch(e){d("Failed to continue reading: "+e.message,"error")}}const xn={mount:En,unmount:Cn,render:Le,continueReading:Fs},Oe=50;let f={manga:null,categories:[],currentPage:0,filter:"all",loading:!0,selectionMode:!1,selected:new Set,activeVolume:null,activeVolumeId:null,cbzFiles:[],manageChapters:!1,offlineChapters:new Set,isAutoOffline:!1,volumesCollapsed:!1};const Us=t=>`volumes_collapsed_${t}`;function Sn(t){var s;const e=localStorage.getItem(Us(t==null?void 0:t.id));return e!==null?e==="1":(((s=t==null?void 0:t.volumes)==null?void 0:s.length)||0)>8}function Ln(t){if(!(t.autoCheck===!0))return`<button class="btn btn-secondary" id="schedule-btn">${p("alarm-clock")} Schedule</button>`;const s=t.checkSchedule==="weekly"?`${(t.checkDay||"monday").charAt(0).toUpperCase()+(t.checkDay||"monday").slice(1)} ${t.checkTime||"06:00"}`:t.checkSchedule==="daily"?`Daily ${t.checkTime||"06:00"}`:"Every 6h";return`<button class="btn btn-primary" id="schedule-btn">${p("alarm-clock")} ${s}</button>`}function In(t){const e=t.autoCheck===!0,s=t.checkSchedule||"daily",a=t.checkDay||"monday",n=t.checkTime||"06:00",i=t.autoDownload||!1;return`
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
  `}function Bt(){var _;if(f.loading)return`
      ${ne()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=f.manga;if(!t)return`
      ${ne()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.chapters||[],a=new Set(t.downloadedChapters||[]),n=new Set(t.readChapters||[]),i=new Set(s.map(k=>k.number)).size,o=new Set(t.excludedChapters||[]),c=new Set(t.deletedChapterUrls||[]),l=t.volumes||[],u=new Set;l.forEach(k=>{(k.chapters||[]).forEach(B=>u.add(B))});let h;f.filter==="hidden"?h=s.filter(k=>o.has(k.number)||c.has(k.url)):h=s.filter(k=>!o.has(k.number)&&!c.has(k.url));const v=h.filter(k=>!u.has(k.number));let w=[];if(f.activeVolume){const k=new Set(f.activeVolume.chapters||[]);w=h.filter(B=>k.has(B.number))}else w=v;const x=new Map;w.forEach(k=>{x.has(k.number)||x.set(k.number,[]),x.get(k.number).push(k)});let E=Array.from(x.entries()).sort((k,B)=>k[0]-B[0]);f.filter==="downloaded"?E=E.filter(([k])=>a.has(k)):f.filter==="not-downloaded"?E=E.filter(([k])=>!a.has(k)):f.filter==="main"?E=E.filter(([k])=>Number.isInteger(k)):f.filter==="extra"&&(E=E.filter(([k])=>!Number.isInteger(k)));const g=Math.max(1,Math.ceil(E.length/Oe));f.currentPage>=g&&(f.currentPage=Math.max(0,g-1));const S=f.currentPage*Oe,T=[...E.slice(S,S+Oe)].reverse(),U=x.size,q=[...x.keys()].filter(k=>a.has(k)).length;n.size;let C="";if(f.activeVolume){const k=f.activeVolume;let B=null;k.local_cover?B=`/api/public/covers/${t.id}/${encodeURIComponent(k.local_cover.split(/[/\\]/).pop())}`:k.cover&&(B=k.cover),C=`
      ${ne()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${B?`<img src="${B}" alt="${k.name}">`:pe("book")}
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${t.id}" class="text-muted" style="text-decoration:none;">← ${e}</a>
              </div>
              <h1>${k.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${U} Chapters</span>
                ${q>0?`<span class="meta-item downloaded">${q} Downloaded</span>`:""}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${t.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${f.manageChapters?"Done Managing":`${p("plus")} Add Chapters`}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${k.id}">${p("pencil")} Edit Volume</button>
               </div>
            </div>
          </div>
      `}else{const k=t.localCover?`/api/public/covers/${t.id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover;C=`
        ${ne()}
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
                  <span class="meta-item" title="${i} distinct chapters across ${((_=t.chapters)==null?void 0:_.length)||0} version rows">${i} Chapters</span>
                  ${a.size>0?`<span class="meta-item downloaded">${a.size} Downloaded</span>`:""}
                  ${n.size>0?`<span class="meta-item">${n.size} Read</span>`:""}
                </div>
                ${(t.artists||[]).length>0||(t.categories||[]).length>0?`
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(t.artists||[]).length>0?`
                    <span class="meta-label">Author:</span>
                    ${t.artists.map(B=>`<a href="#//" class="artist-link" data-artist="${B}">${B}</a>`).join(", ")}
                  `:""}
                  ${(t.categories||[]).length>0?`
                    <span class="meta-label" style="margin-left: ${(t.artists||[]).length>0?"16px":"0"};">Tags:</span>
                    ${t.categories.map(B=>`<span class="tag">${B}</span>`).join("")}
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
              ${Ln(t)}
            </div>
            ${t.description?`<p class="manga-description">${t.description}</p>`:""}
            ${f.cbzFiles.length>0?`
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">${p("package")} CBZ Files (${f.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${f.cbzFiles.map(B=>`
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${B.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${B.chapterNumber?`Chapter ${B.chapterNumber}`:"Unknown chapter"}
                        ${B.isExtracted?` | ${p("check")} Extracted`:""}
                      </div>
                    </div>
                    <button class="btn btn-small ${B.isExtracted?"btn-secondary":"btn-primary"}" 
                            data-cbz-path="${encodeURIComponent(B.path)}" 
                            data-cbz-chapter="${B.chapterNumber||1}"
                            data-cbz-extracted="${B.isExtracted}">
                      ${B.isExtracted?"Re-Extract":"Extract"}
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
        
        ${f.activeVolume?f.manageChapters?Rn(t,v):"":qn(t,a)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${f.filter==="all"?"active":""}" data-filter="all">
                All (${x.size})
              </button>
              <button class="filter-btn ${f.filter==="downloaded"?"active":""}" data-filter="downloaded">
                Downloaded (${q})
              </button>
              <button class="filter-btn ${f.filter==="not-downloaded"?"active":""}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${f.filter==="hidden"?"active":""}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${g>1?ls(g):""}
          
          <div class="chapter-list">
            ${T.map(([k,B])=>Pn(k,B,a,n,t)).join("")}
          </div>
          
          ${g>1?ls(g):""}
        </div>
      ${Tn()}
    </div>
  `}function _n(){const t=f.manga;if(!t)return"";const e=t.alias||t.title;return`
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
  `}function Bn(){const t=f.manga;return t?`
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
  `:""}function An(){const t=f.manga;return t?`
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
  `:""}async function it(){var s,a;const t=document.getElementById("anilist-track-btn"),e=f.manga;if(e)try{const n=await m.anilistStatus();if(!(n!=null&&n.configured)||!(n!=null&&n.connected)||((s=f.manga)==null?void 0:s.id)!==e.id){t&&(t.style.display="none");return}const{mapping:i}=await m.anilistGetMapping(e.id);if(((a=f.manga)==null?void 0:a.id)!==e.id)return;t&&(t.style.display="",t.style.borderColor=i?"var(--accent-primary)":"",t.innerHTML=i?`${p("check")} Tracked`:`${p("link")} Track`,t.title=i?`Linked to ${i.anilist_title}`:"Link this manga to AniList"),Mn(i,e)}catch(n){console.warn("Failed to load AniList state:",n),t&&(t.style.display="none")}}function Mn(t,e){var n,i,o;const s=document.getElementById("anilist-tracked-view"),a=document.getElementById("anilist-search-view");if(!(!s||!a)){if(!t){s.style.display="none",s.innerHTML="",a.style.display="";return}a.style.display="none",s.style.display="",s.innerHTML=`
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
  `,(n=document.getElementById("anilist-sync-toggle"))==null||n.addEventListener("change",async c=>{try{await m.anilistSetSyncEnabled(e.id,c.target.checked),d(c.target.checked?"AniList sync enabled":"AniList sync disabled","success")}catch(l){c.target.checked=!c.target.checked,d("Failed to update sync: "+l.message,"error")}}),(i=document.getElementById("anilist-relink-btn"))==null||i.addEventListener("click",()=>{s.style.display="none",a.style.display=""}),(o=document.getElementById("anilist-unlink-btn"))==null||o.addEventListener("click",async()=>{if(confirm(`Unlink "${t.anilist_title}" from AniList?`))try{await m.anilistUnmap(e.id),d("Unlinked from AniList","success"),it()}catch(c){d("Failed to unlink: "+c.message,"error")}})}}function Tn(){var e,s;const t=f.manga;return`
    ${t?In(t):""}
    ${Xn()}
    ${_n()}
    ${Bn()}
    ${An()}

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
  `}function Pn(t,e,s,a,n){var q,C,_,k;const i=s.has(t),o=a.has(t),c=!Number.isInteger(t),l=((q=n.downloadedVersions)==null?void 0:q[t])||[],u=new Set(n.deletedChapterUrls||[]),h=e.filter(B=>f.filter==="hidden"?!0:!u.has(B.url)),v=!!f.activeVolume,w=n.chapterSettings||{},x=v?!0:!!((C=w[t])!=null&&C.locked);let E=h;if(v||x){const B=h.filter(D=>Array.isArray(l)?l.includes(D.url):l===D.url);E=B.length>0?B:h}E.sort((B,D)=>{const j=Array.isArray(l)?l.includes(B.url):l===B.url;return((Array.isArray(l)?l.includes(D.url):l===D.url)?1:0)-(j?1:0)});const g=E.length>1,S=(_=E[0])!=null&&_.url?encodeURIComponent(E[0].url):null,A=["chapter-item",i?"downloaded":"",o?"read":"",c?"extra":""].filter(Boolean).join(" "),T=g?`
    <div class="versions-dropdown hidden" id="versions-${t}">
      ${E.map(B=>{const D=encodeURIComponent(B.url),j=Array.isArray(l)?l.includes(B.url):l===B.url,se=B.url.startsWith("local://");return`
          <div class="version-row ${j?"downloaded":""}"
               data-version-url="${D}" data-num="${t}">
            <span class="version-title" style="cursor: pointer; flex: 1;">${B.title||B.releaseGroup||"Version"}${se?' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>':""}</span>
            <div class="version-actions">
              ${j?`<button class="btn-icon small success" data-action="read-version" data-num="${t}" data-url="${D}">${p("play",{title:"Read"})}</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${t}" data-url="${D}">${p("trash-2",{title:"Delete version"})}</button>`:`<button class="btn-icon small" data-action="download-version" data-num="${t}" data-url="${D}">${p("download",{title:"Download"})}</button>`}
              ${u.has(B.url)?`<button class="btn-icon small warning" data-action="restore-version" data-num="${t}" data-url="${D}" title="Restore Version">${p("undo-2",{title:"Restore version"})}</button>`:`<button class="btn-icon small" data-action="hide-version" data-num="${t}" data-url="${D}" title="Hide Version">${p("eye-off",{title:"Hide version"})}</button>`}
            </div>
          </div>
        `}).join("")}
    </div>
  `:"",U=(n.excludedChapters||[]).includes(t);return`
    <div class="chapter-group" data-chapter="${t}">
      <div class="${A}" data-num="${t}" style="${U?"opacity: 0.7":""}">
        <span class="chapter-number">Ch. ${t}</span>
        <span class="chapter-title">
          ${E[0]?E[0].title!==`Chapter ${t}`?E[0].title:"":e[0].title}
          ${U?'<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>':""}
        </span>
        ${c?'<span class="chapter-tag">Extra</span>':""}
        <div class="chapter-actions">
          ${U?`<button class="btn-icon small warning" data-action="restore-chapter" data-num="${t}" title="Restore Chapter">${p("undo-2",{title:"Restore chapter"})}</button>`:v?`<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${f.manageChapters?`<button class="btn-icon small danger remove-from-vol-btn" data-num="${t}" title="Remove from Volume">×</button>`:""}
          </div>`:`<button class="btn-icon small lock-btn ${x?"locked":""}"
                        data-action="lock" data-num="${t}"
                        title="${x?"Unlock":"Lock"}">
                  ${x?p("lock",{title:"Locked"}):p("lock-open",{title:"Unlocked"})}
                </button>`}
          ${!U&&S?u.has((k=E[0])==null?void 0:k.url)?`<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${t}" data-url="${S}" title="Unhide Chapter">${p("undo-2",{title:"Unhide chapter"})}</button>`:`<button class="btn-icon small" data-action="hide-chapter" data-num="${t}" data-url="${S}" title="Hide Chapter">${p("eye-off",{title:"Hide chapter"})}</button>`:""}
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
  `}function ls(t){return`
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${f.currentPage===0?"disabled":""}>«</button>
      <button class="btn btn-icon" data-page="prev" ${f.currentPage===0?"disabled":""}>‹</button>
      <span class="pagination-info">Page ${f.currentPage+1} of ${t}</span>
      <button class="btn btn-icon" data-page="next" ${f.currentPage>=t-1?"disabled":""}>›</button>
      <button class="btn btn-icon" data-page="last" ${f.currentPage>=t-1?"disabled":""}>»</button>
    </div>
  `}function Rn(t,e){return e.length===0?`
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
  `}function qn(t,e){var o;const s=t.volumes||[];if(s.length===0)return"";const a=s.map(c=>{const l=c.chapters||[],u=l.filter(h=>e.has(h)).length;return`
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
    `}).join(""),n=f.volumesCollapsed,i=s.reduce((c,l)=>c+(l.chapters||[]).filter(u=>e.has(u)).length,0);return`
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
  `}function Dn(){var n,i,o,c,l,u,h,v,w,x,E,g,S,A,T,U,q,C,_,k,B,D,j,se,Z;const t=document.getElementById("app"),e=f.manga;if(!e)return;(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>R.go("/")),(i=document.getElementById("back-library-btn"))==null||i.addEventListener("click",()=>R.go("/")),t.querySelectorAll(".artist-link").forEach(y=>{y.addEventListener("click",async I=>{I.preventDefault();const M=y.dataset.artist;if(!M)return;localStorage.setItem("library_search",M),localStorage.removeItem("library_artist_filter");let b=null;try{const L=e.website;if(L&&L!=="Local"){const N=(window._scrapersList||(window._scrapersList=(await m.get("/scrapers/list")).scrapers)||[]).find(Q=>Q.name===L);N&&N.supportsBrowse&&(b=L)}}catch{}b?(localStorage.setItem("library_search_author",M),localStorage.setItem("library_search_author_source",b)):(localStorage.removeItem("library_search_author"),localStorage.removeItem("library_search_author_source")),R.go("/")})}),(o=document.getElementById("continue-btn"))==null||o.addEventListener("click",()=>{Fs(e.id)}),(c=document.getElementById("download-all-btn"))==null||c.addEventListener("click",()=>{const y=document.getElementById("download-all-modal");y&&y.classList.add("open")}),(l=document.getElementById("confirm-download-all-btn"))==null||l.addEventListener("click",async()=>{var y;try{d("Queueing downloads...","info");const I=document.getElementsByName("download-version-mode");let M="single";for(const L of I)L.checked&&(M=L.value);(y=document.getElementById("download-all-modal"))==null||y.classList.remove("open");const b=await m.post(`/bookmarks/${e.id}/download`,{all:!0,versionMode:M});b.chaptersCount>0?d(`Download queued: ${b.chaptersCount} versions`,"success"):d("Already have these chapters downloaded","info")}catch(I){d("Failed to download: "+I.message,"error")}}),(u=document.getElementById("check-updates-btn"))==null||u.addEventListener("click",async()=>{try{d("Checking for updates...","info"),await m.post(`/bookmarks/${e.id}/quick-check`),d("Check complete!","success")}catch(y){d("Check failed: "+y.message,"error")}}),(h=document.getElementById("schedule-btn"))==null||h.addEventListener("click",()=>{const y=document.getElementById("schedule-modal");y&&y.classList.add("open")}),(v=document.getElementById("schedule-type"))==null||v.addEventListener("change",y=>{const I=document.getElementById("schedule-day-group");I&&(I.style.display=y.target.value==="weekly"?"":"none")}),(w=document.getElementById("save-schedule-btn"))==null||w.addEventListener("click",async()=>{var y;try{const I=document.getElementById("schedule-type").value,M=document.getElementById("schedule-day").value,b=document.getElementById("schedule-time").value,L=document.getElementById("auto-download-toggle").checked;await m.updateAutoCheckSchedule(e.id,{enabled:!0,schedule:I,day:M,time:b,autoDownload:L}),f.manga.checkSchedule=I,f.manga.checkDay=M,f.manga.checkTime=b,f.manga.autoDownload=L,(y=document.getElementById("schedule-modal"))==null||y.classList.remove("open"),H([e.id]),d("Schedule updated","success")}catch(I){d("Failed to save schedule: "+I.message,"error")}}),(x=document.getElementById("disable-schedule-btn"))==null||x.addEventListener("click",async()=>{var y;try{await m.toggleAutoCheck(e.id,!1),f.manga.autoCheck=!1,f.manga.checkSchedule=null,f.manga.checkDay=null,f.manga.checkTime=null,f.manga.nextCheck=null,(y=document.getElementById("schedule-modal"))==null||y.classList.remove("open"),H([e.id]),d("Auto-check disabled","success")}catch(I){d("Failed to disable: "+I.message,"error")}}),(E=document.getElementById("refresh-btn"))==null||E.addEventListener("click",async()=>{const y=document.getElementById("refresh-btn");try{y.disabled=!0,y.innerHTML=`${p("loader",{spin:!0})} Checking...`,d("Checking for updates...","info"),await m.post(`/bookmarks/${e.id}/check`),await K(e.id),H([e.id]),d("Check complete!","success")}catch(I){d("Check failed: "+I.message,"error"),y&&(y.disabled=!1,y.innerHTML=`${p("refresh-cw")} Refresh`)}}),(g=document.getElementById("scan-folder-btn"))==null||g.addEventListener("click",async()=>{var I,M;const y=document.getElementById("scan-folder-btn");try{y.disabled=!0,y.innerHTML=`${p("loader",{spin:!0})} Scanning...`,d("Scanning folder...","info");const b=await m.scanBookmark(e.id);await K(e.id),H([e.id]);const L=((I=b.addedChapters)==null?void 0:I.length)||0,P=((M=b.removedChapters)==null?void 0:M.length)||0;L>0||P>0?d(`Scan complete: ${L} added, ${P} removed`,"success"):d("Scan complete: No changes","info")}catch(b){d("Scan failed: "+b.message,"error")}finally{y&&(y.disabled=!1,y.innerHTML=`${p("folder")} Scan Folder`)}}),document.querySelectorAll("[data-cbz-path]").forEach(y=>{y.addEventListener("click",async()=>{const I=decodeURIComponent(y.dataset.cbzPath),M=parseInt(y.dataset.cbzChapter)||1,b=y.dataset.cbzExtracted==="true",L=prompt("Enter chapter number for extraction:",String(M));if(!L)return;const P=parseFloat(L);if(isNaN(P)){d("Invalid chapter number","error");return}try{y.disabled=!0,y.textContent="Extracting...",d("Extracting CBZ...","info"),await m.extractCbz(e.id,I,P,{forceReExtract:b}),d("CBZ extracted successfully!","success"),await K(e.id),H([e.id])}catch(N){d("Extract failed: "+N.message,"error")}finally{y.disabled=!1,y.textContent=b?"Re-Extract":"Extract"}})}),(S=document.getElementById("edit-btn"))==null||S.addEventListener("click",async()=>{const y=document.getElementById("edit-manga-modal");if(y){document.getElementById("edit-alias-input").value=e.alias||"",window._selectedCoverPath=null;try{const[I,M]=await Promise.all([m.getAllArtists(),m.getAllCategories()]),b=document.getElementById("artist-list"),L=document.getElementById("category-list");window._allArtists=I,window._allCategories=M,b&&(b.innerHTML=I.map(Q=>`<option value="${Q}">`).join("")),L&&(L.innerHTML=M.map(Q=>`<option value="${Q}">`).join(""));const P=document.getElementById("edit-artist-input"),N=document.getElementById("edit-categories-input");P==null||P.addEventListener("input",()=>{const Q=P.value.toLowerCase(),O=P.value.lastIndexOf(","),ee=P.value.substring(O+1).trim().toLowerCase();if(ee.length>0&&window._allArtists){const z=window._allArtists.filter(J=>J.toLowerCase().includes(ee));if(b&&z.length>0){const J=O>=0?P.value.substring(0,O+1)+" ":"";b.innerHTML=z.map(le=>`<option value="${J}${le}">`).join("")}}}),N==null||N.addEventListener("input",()=>{const Q=N.value.lastIndexOf(","),O=N.value.substring(Q+1).trim().toLowerCase();if(O.length>0&&window._allCategories){const ee=window._allCategories.filter(z=>z.toLowerCase().includes(O));if(L&&ee.length>0){const z=Q>=0?N.value.substring(0,Q+1)+" ":"";L.innerHTML=ee.map(J=>`<option value="${z}${J}">`).join("")}}})}catch(I){console.error("Failed to load artists/categories:",I)}y.classList.add("open")}}),(A=document.getElementById("save-manga-btn"))==null||A.addEventListener("click",async()=>{var y;try{const I=document.getElementById("edit-alias-input").value.trim(),M=document.getElementById("edit-artist-input").value.trim(),b=document.getElementById("edit-categories-input").value.trim(),L=M?M.split(",").map(N=>N.trim()).filter(N=>N):[],P=b?b.split(",").map(N=>N.trim()).filter(N=>N):[];await m.updateBookmark(e.id,{alias:I||null}),await m.setBookmarkArtists(e.id,L),await m.setBookmarkCategories(e.id,P),window._selectedCoverPath&&await m.setBookmarkCoverFromImage(e.id,window._selectedCoverPath),f.manga.alias=I||null,f.manga.artists=L,f.manga.categories=P,(y=document.getElementById("edit-manga-modal"))==null||y.classList.remove("open"),H([e.id]),d("Manga updated","success")}catch(I){d("Failed to update: "+I.message,"error")}}),(T=document.getElementById("change-cover-btn"))==null||T.addEventListener("click",async()=>{try{d("Loading images...","info");const y=await m.getFolderImages(e.id);if(y.length===0){d("No images found in manga folder","warning");return}const I=document.createElement("div");I.id="cover-select-modal",I.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;",I.innerHTML=`
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${y.slice(0,50).map(M=>`
              <div class="cover-option" data-path="${M.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(M.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join("")}
          </div>
          ${y.length>50?`<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${y.length} images</p>`:""}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `,document.body.appendChild(I),document.getElementById("close-cover-modal").addEventListener("click",()=>I.remove()),I.addEventListener("click",M=>{M.target===I&&I.remove()}),I.querySelectorAll(".cover-option").forEach(M=>{M.addEventListener("click",()=>{window._selectedCoverPath=M.dataset.path;const b=document.getElementById("cover-preview");b&&(b.innerHTML=`<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`),I.remove(),d("Cover selected","success")})})}catch(y){d("Failed to load images: "+y.message,"error")}}),(U=document.getElementById("delete-manga-btn"))==null||U.addEventListener("click",()=>{const y=document.getElementById("delete-manga-modal");y&&y.classList.add("open")}),(q=document.getElementById("confirm-delete-manga-btn"))==null||q.addEventListener("click",async()=>{var I,M;const y=((I=document.getElementById("delete-files-toggle"))==null?void 0:I.checked)||!1;try{await m.deleteBookmark(e.id,y),(M=document.getElementById("delete-manga-modal"))==null||M.classList.remove("open"),d("Manga deleted","success"),R.go("/")}catch(b){d("Failed to delete: "+b.message,"error")}}),(C=document.getElementById("quick-check-btn"))==null||C.addEventListener("click",async()=>{const y=document.getElementById("quick-check-btn");try{y.disabled=!0,y.innerHTML=`${p("loader",{spin:!0})} Checking...`,d("Quick checking for updates...","info");const I=await m.post(`/bookmarks/${e.id}/quick-check`);await K(e.id),H([e.id]),I.newChaptersCount>0?d(`Found ${I.newChaptersCount} new chapter(s)!`,"success"):d("No new chapters found","info")}catch(I){d("Quick check failed: "+I.message,"error")}finally{y&&(y.disabled=!1,y.innerHTML=`${p("zap")} Quick Check`)}}),(_=document.getElementById("source-label"))==null||_.addEventListener("click",async()=>{const y=document.getElementById("migrate-source-modal");if(y){y.classList.add("open");const I=document.getElementById("migrate-search-scraper");if(I&&I.options.length<=1)try{const M=await m.get("/scrapers/list");if(M.success){const b=M.scrapers.filter(L=>L.supportsSearch);I.innerHTML='<option value="all">All Sources</option>'+b.map(L=>`<option value="${L.name}">${L.name}</option>`).join(""),I.value="all"}}catch(M){console.warn("Failed to load scrapers:",M)}}});const s=async()=>{var P,N,Q;const y=(N=(P=document.getElementById("migrate-search-input"))==null?void 0:P.value)==null?void 0:N.trim(),I=(Q=document.getElementById("migrate-search-scraper"))==null?void 0:Q.value;if(!y)return;const M=document.getElementById("migrate-search-loading"),b=document.getElementById("migrate-search-results"),L=document.getElementById("migrate-results-grid");M.style.display="block",b.style.display="none";try{const ee=(await m.get(`/scrapers/search?q=${encodeURIComponent(y)}&scraper=${encodeURIComponent(I)}`)).results||[];ee.length===0?L.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(L.innerHTML=ee.map(z=>{var le;const J=(le=z.cover)!=null&&le.startsWith("/covers/")?z.cover:z.cover?`/api/scrapers/proxy-cover?url=${encodeURIComponent(z.cover)}`:"";return`
            <div class="manga-card migrate-result-card" data-url="${z.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${J?Ce(J,"Cover",{kind:"series",self:!0}):pe("series")}
                ${z.chapterCount?`<div class="manga-card-badges"><span class="badge badge-chapters">${z.chapterCount} ch</span></div>`:""}
              </div>
              <div class="manga-card-title" title="${z.title}" style="font-size: 0.8rem; padding: 4px;">${z.title}</div>
            </div>
          `}).join(""),L.querySelectorAll(".migrate-result-card").forEach(z=>{z.addEventListener("click",()=>{var le;const J=z.dataset.url;document.getElementById("migrate-url-input").value=J,L.querySelectorAll(".migrate-result-card").forEach(Be=>Be.style.outline=""),z.style.outline="2px solid var(--color-primary)",d(`Selected: ${(le=z.querySelector(".manga-card-title"))==null?void 0:le.textContent}`,"info")})})),M.style.display="none",b.style.display="block"}catch(O){M.style.display="none",d("Search failed: "+O.message,"error")}};(k=document.getElementById("migrate-search-btn"))==null||k.addEventListener("click",s),(B=document.getElementById("migrate-search-input"))==null||B.addEventListener("keydown",y=>{y.key==="Enter"&&s()}),(D=document.getElementById("confirm-migrate-btn"))==null||D.addEventListener("click",async()=>{var M,b,L;const y=(b=(M=document.getElementById("migrate-url-input"))==null?void 0:M.value)==null?void 0:b.trim();if(!y){d("Please enter a URL","warning");return}const I=document.getElementById("confirm-migrate-btn");try{I.disabled=!0,I.textContent="Migrating...",d("Migrating source...","info");const P=await m.migrateSource(e.id,y);d(`Migrated! ${P.migratedChapters} chapters preserved as local`,"success"),d("Running full check on new source...","info"),await m.post(`/bookmarks/${e.id}/check`),(L=document.getElementById("migrate-source-modal"))==null||L.classList.remove("open"),await K(e.id),H([e.id]),d("Source migration complete!","success")}catch(P){d("Migration failed: "+P.message,"error")}finally{I&&(I.disabled=!1,I.textContent="Migrate Source")}}),(j=document.getElementById("anilist-track-btn"))==null||j.addEventListener("click",()=>{var y;(y=document.getElementById("anilist-modal"))==null||y.classList.add("open"),it()});const a=async()=>{var L,P;const y=(P=(L=document.getElementById("anilist-search-input"))==null?void 0:L.value)==null?void 0:P.trim();if(!y)return;const I=document.getElementById("anilist-search-loading"),M=document.getElementById("anilist-search-results"),b=document.getElementById("anilist-results-list");I.style.display="block",M.style.display="none";try{const Q=(await m.anilistSearch(y)).results||[];Q.length===0?b.innerHTML='<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>':(b.innerHTML=Q.map(O=>{var J,le,Be,Wt,Gt,Kt,Yt;const ee=((J=O.title)==null?void 0:J.romaji)||((le=O.title)==null?void 0:le.english)||((Be=O.title)==null?void 0:Be.native)||"Unknown",z=(Wt=O.title)!=null&&Wt.english&&O.title.english!==ee?O.title.english:(Gt=O.title)!=null&&Gt.native&&O.title.native!==ee?O.title.native:"";return`
            <div style="display: flex; gap: 10px; align-items: center; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 8px;">
              ${(Kt=O.coverImage)!=null&&Kt.medium?`<img src="${O.coverImage.medium}" alt="" style="width: 48px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">`:""}
              <div style="flex: 1; min-width: 0;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${ee}"><strong>${ee}</strong></div>
                <div class="text-muted" style="font-size: 0.8em;">
                  ${[z,O.format,(Yt=O.startDate)==null?void 0:Yt.year,`${O.chapters??"?"} ch`].filter(Boolean).join(" • ")}
                </div>
              </div>
              <button class="btn btn-small btn-primary anilist-link-result-btn" data-id="${O.id}" data-title="${ee.replace(/"/g,"&quot;")}">Link</button>
            </div>
          `}).join(""),b.querySelectorAll(".anilist-link-result-btn").forEach(O=>{O.addEventListener("click",async()=>{var ee,z;try{O.disabled=!0,O.textContent="Linking...";const J=await m.anilistMap(e.id,Number(O.dataset.id)),le=((ee=J.mapping)==null?void 0:ee.anilist_title)||O.dataset.title,Be=(z=J.pull)!=null&&z.markedUpTo?` — pulled progress up to ch. ${J.pull.markedUpTo}`:"";d(`Linked to AniList: ${le}${Be}`,"success"),it()}catch(J){O.disabled=!1,O.textContent="Link",d("Failed to link: "+J.message,"error")}})})),I.style.display="none",M.style.display="block"}catch(N){I.style.display="none",d("AniList search failed: "+N.message,"error")}};(se=document.getElementById("anilist-search-btn"))==null||se.addEventListener("click",a),(Z=document.getElementById("anilist-search-input"))==null||Z.addEventListener("keydown",y=>{y.key==="Enter"&&a()}),t.querySelectorAll(".filter-btn").forEach(y=>{y.addEventListener("click",()=>{f.filter=y.dataset.filter,f.currentPage=0,H([e.id])})}),t.querySelectorAll("[data-page]").forEach(y=>{y.addEventListener("click",()=>{const I=y.dataset.page,M=Math.ceil(f.manga.chapters.length/Oe);switch(I){case"first":f.currentPage=0;break;case"prev":f.currentPage=Math.max(0,f.currentPage-1);break;case"next":f.currentPage=Math.min(M-1,f.currentPage+1);break;case"last":f.currentPage=M-1;break}H([e.id])})}),t.querySelectorAll(".chapter-item").forEach(y=>{y.addEventListener("click",I=>{var L;if(I.target.closest(".chapter-actions"))return;const M=parseFloat(y.dataset.num);if((e.downloadedChapters||[]).includes(M)){const P=((L=e.downloadedVersions)==null?void 0:L[M])||[],N=Array.isArray(P)?P[0]:P;N?R.go(`/read/${e.id}/${M}?version=${encodeURIComponent(N)}`):R.go(`/read/${e.id}/${M}`)}else d("Chapter not downloaded","info")})}),t.querySelectorAll("[data-action]").forEach(y=>{y.addEventListener("click",async I=>{I.stopPropagation();const M=y.dataset.action,b=parseFloat(y.dataset.num),L=y.dataset.url?decodeURIComponent(y.dataset.url):null;switch(M){case"lock":await Nn(b);break;case"read":await Fn(b);break;case"download":await Un(b);break;case"versions":On(b);break;case"read-version":R.go(`/read/${e.id}/${b}?version=${encodeURIComponent(L)}`);break;case"download-version":await Vn(b,L);break;case"delete-version":await Hn(b,L);break;case"hide-version":await zn(b,L);break;case"restore-version":await jn(b,L);break;case"restore-chapter":await Qn(b);break;case"delete-chapter":await Wn(b,L);break;case"hide-chapter":await Gn(b,L);break;case"unhide-chapter":await Kn(b,L);break}})}),t.querySelectorAll(".version-row .version-title").forEach(y=>{y.addEventListener("click",I=>{I.stopPropagation();const M=y.closest(".version-row"),b=parseFloat(M.dataset.num),L=M.dataset.versionUrl?decodeURIComponent(M.dataset.versionUrl):null;M.classList.contains("downloaded")&&L?R.go(`/read/${e.id}/${b}?version=${encodeURIComponent(L)}`):d("Version not downloaded yet","info")})}),t.querySelectorAll(".volume-card").forEach(y=>{y.addEventListener("click",()=>{const I=y.dataset.volumeId;R.go(`/manga/${e.id}/volume/${I}`)})}),Zn(t),ke(),ue.subscribeToManga(e.id)}async function Nn(t){var n;const e=f.manga,s=((n=e.chapterSettings)==null?void 0:n[t])||{},a=!s.locked;try{a?await m.lockChapter(e.id,t):await m.unlockChapter(e.id,t),e.chapterSettings||(e.chapterSettings={}),e.chapterSettings[t]={...s,locked:a},d(a?"Chapter locked":"Chapter unlocked","success"),H([e.id])}catch(i){d("Failed: "+i.message,"error")}}async function Fn(t){const e=f.manga,s=new Set(e.readChapters||[]),a=s.has(t);try{await m.post(`/bookmarks/${e.id}/chapters/${t}/read`,{isRead:!a}),a?s.delete(t):s.add(t),e.readChapters=[...s],d(a?"Marked unread":"Marked read","success"),H([e.id])}catch(n){d("Failed: "+n.message,"error")}}async function Un(t){const e=f.manga,s=new Set(e.deletedChapterUrls||[]),a=(e.chapters||[]).find(n=>n.number===t&&!s.has(n.url));try{d(`Downloading chapter ${t}...`,"info"),a?await m.post(`/bookmarks/${e.id}/download-version`,{chapterNumber:t,url:a.url}):await m.post(`/bookmarks/${e.id}/download`,{chapters:[t]}),d("Download queued!","success")}catch(n){d("Failed: "+n.message,"error")}}function On(t){document.querySelectorAll(".versions-dropdown").forEach(s=>{s.id!==`versions-${t}`&&s.classList.add("hidden")});const e=document.getElementById(`versions-${t}`);e&&e.classList.toggle("hidden")}async function Vn(t,e){const s=f.manga;try{d("Downloading version...","info"),await m.post(`/bookmarks/${s.id}/download-version`,{chapterNumber:t,url:e}),d("Download queued!","success")}catch(a){d("Failed: "+a.message,"error")}}async function Hn(t,e){const s=f.manga;try{await m.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),d("Version deleted","success"),await K(s.id),H([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function zn(t,e){const s=f.manga;try{await m.hideVersion(s.id,t,e),d("Version hidden","success"),await K(s.id),H([s.id])}catch(a){d("Failed: "+a.message,"error")}}async function jn(t,e){const s=f.manga;try{await m.unhideVersion(s.id,t,e),d("Version restored","success"),await K(s.id),H([s.id])}catch(a){d("Failed to restore version: "+a.message,"error")}}async function Qn(t){const e=f.manga;try{await m.unexcludeChapter(e.id,t),d("Chapter restored","success"),await K(e.id),H([e.id])}catch(s){d("Failed to restore chapter: "+s.message,"error")}}async function Wn(t,e){const s=f.manga;if(confirm("Delete this chapter's files from disk?"))try{await m.request(`/bookmarks/${s.id}/chapters`,{method:"DELETE",body:JSON.stringify({chapterNumber:t,url:e})}),d("Chapter files deleted","success"),await K(s.id),H([s.id])}catch(a){d("Failed to delete: "+a.message,"error")}}async function Gn(t,e){const s=f.manga;if(confirm("Hide this chapter? It will be moved to the Hidden filter."))try{await m.hideVersion(s.id,t,e),d("Chapter hidden","success"),await K(s.id),H([s.id])}catch(a){d("Failed to hide chapter: "+a.message,"error")}}async function Kn(t,e){const s=f.manga;try{await m.unhideVersion(s.id,t,e),d("Chapter unhidden","success"),await K(s.id),H([s.id])}catch(a){d("Failed to unhide chapter: "+a.message,"error")}}async function K(t){try{const[e,s]=await Promise.all([m.getBookmark(t),ae.isDemo?Promise.resolve([]):oe.loadCategories()]);if(f.manga=e,f.categories=s,f.loading=!1,f.volumesCollapsed=Sn(e),e.website==="Local")try{const i=await m.getCbzFiles(t);f.cbzFiles=i||[]}catch(i){console.error("Failed to load CBZ files:",i),f.cbzFiles=[]}else f.cbzFiles=[];const a=new Set((e.chapters||[]).map(i=>i.number)).size,n=Math.ceil(a/Oe);f.currentPage=Math.max(0,n-1),f.activeVolumeId?f.activeVolume=(e.volumes||[]).find(i=>i.id===f.activeVolumeId):f.activeVolume=null}catch{d("Failed to load manga","error"),f.loading=!1}}async function H(t=[]){const[e,s,a]=t;if(!e){R.go("/");return}f.activeVolumeId=s==="volume"?a:null;const n=document.getElementById("app");!f.manga||f.manga.id!==e?(f.loading=!0,f.manga=null,n.innerHTML=Bt(),await K(e)):f.activeVolumeId?f.activeVolume=(f.manga.volumes||[]).find(i=>i.id===f.activeVolumeId):f.activeVolume=null,n.innerHTML=Bt(),Dn(),it()}function Yn(){f.manga&&ue.unsubscribeFromManga(f.manga.id),f.manga=null,f.loading=!0}const Jn={mount:H,unmount:Yn,render:Bt};function Xn(){return`
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
  `}function Zn(t){const e=f.manga;if(!e)return;const s=t.querySelector("#volumes-toggle-btn");s&&s.addEventListener("click",()=>{f.volumesCollapsed=!f.volumesCollapsed,localStorage.setItem(Us(e.id),f.volumesCollapsed?"1":"0");const g=t.querySelector(".volumes-section");g==null||g.classList.toggle("collapsed",f.volumesCollapsed),s.setAttribute("aria-expanded",String(!f.volumesCollapsed)),s.title=f.volumesCollapsed?"Expand volumes":"Collapse volumes";const S=s.querySelector("svg");S&&(S.outerHTML=p(f.volumesCollapsed?"chevron-down":"chevron-up"))});const a=t.querySelector("#add-volume-btn"),n=t.querySelector("#add-volume-modal"),i=t.querySelector("#add-volume-submit-btn");a&&n&&a.addEventListener("click",()=>{n.classList.add("open"),t.querySelector("#add-volume-name-input").focus()}),n==null||n.querySelectorAll(".modal-close, .modal-close-btn, .modal-overlay").forEach(g=>{g.addEventListener("click",()=>n.classList.remove("open"))}),i&&i.addEventListener("click",async()=>{const g=t.querySelector("#add-volume-name-input").value.trim();if(!g)return d("Please enter a volume name","error");try{i.disabled=!0,i.textContent="Creating...",await m.createVolume(e.id,g),d("Volume created successfully!","success"),n.classList.remove("open"),t.querySelector("#add-volume-name-input").value="",await K(e.id),H([e.id])}catch(S){d("Failed to create volume: "+S.message,"error")}finally{i.disabled=!1,i.textContent="Create Volume"}});const o=t.querySelector("#manage-chapters-btn");o&&o.addEventListener("click",()=>{f.manageChapters=!f.manageChapters,H([e.id,"volume",f.activeVolumeId])}),t.querySelectorAll(".add-to-vol-btn").forEach(g=>{g.addEventListener("click",async()=>{const S=parseFloat(g.dataset.num),A=f.activeVolume;if(A)try{g.disabled=!0,g.textContent="...";const T=A.chapters||[];if(T.includes(S))return;const U=[...T,S].sort((q,C)=>q-C);await m.updateVolumeChapters(e.id,A.id,U),d(`Chapter ${S} added to volume`,"success"),await K(e.id),H([e.id,"volume",A.id])}catch(T){d("Failed to add chapter: "+T.message,"error"),g.disabled=!1,g.textContent="Add"}})}),t.querySelectorAll(".remove-from-vol-btn").forEach(g=>{g.addEventListener("click",async S=>{S.stopPropagation();const A=parseFloat(g.dataset.num),T=f.activeVolume;if(T)try{g.disabled=!0,g.textContent="...";const q=(T.chapters||[]).filter(C=>C!==A);await m.updateVolumeChapters(e.id,T.id,q),d(`Chapter ${A} removed from volume`,"success"),await K(e.id),H([e.id,"volume",T.id])}catch(U){d("Failed to remove chapter: "+U.message,"error"),g.disabled=!1,g.textContent="×"}})});const c=t.querySelector("#edit-vol-btn"),l=t.querySelector("#edit-volume-modal");c&&l&&c.addEventListener("click",()=>{const g=c.dataset.volId,S=e.volumes.find(A=>A.id===g);S&&(t.querySelector("#volume-name-input").value=S.name,l.dataset.editingVolId=g,l.classList.add("open"))});const u=t.querySelector("#save-volume-btn");u&&u.addEventListener("click",async()=>{const g=l.dataset.editingVolId,S=t.querySelector("#volume-name-input").value.trim();if(!S)return d("Volume name cannot be empty","error");try{await m.renameVolume(e.id,g,S),d("Volume renamed","success"),l.classList.remove("open"),await K(e.id),H([e.id,"volume",g])}catch(A){d(A.message,"error")}});const h=t.querySelector("#delete-volume-btn");h&&h.addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this volume? Chapters will remain in the library."))return;const g=l.dataset.editingVolId;try{await m.deleteVolume(e.id,g),d("Volume deleted","success"),l.classList.remove("open"),window.location.hash=`#/manga/${e.id}`}catch(S){d(S.message,"error")}});const v=t.querySelector("#vol-cover-upload-btn");if(v){let g=document.getElementById("vol-cover-input-hidden");g||(g=document.createElement("input"),g.type="file",g.id="vol-cover-input-hidden",g.accept="image/*",g.style.display="none",document.body.appendChild(g),g.addEventListener("change",async S=>{const A=S.target.files[0];if(!A)return;const T=g.dataset.mangaId,U=g.dataset.volId,q=document.getElementById("vol-cover-upload-btn");if(g.value="",!(!T||!U))try{q&&(q.disabled=!0,q.textContent="Uploading..."),await m.uploadVolumeCover(T,U,A),d("Cover uploaded","success"),await K(T),H([T,"volume",U])}catch(C){d("Upload failed: "+C.message,"error")}finally{q&&(q.disabled=!1,q.innerHTML=`${p("upload")} Upload Image`)}})),v.addEventListener("click",()=>{g.dataset.mangaId=e.id,g.dataset.volId=l.dataset.editingVolId||"",g.click()})}const w=t.querySelector("#vol-cover-selector-btn"),x=t.querySelector("#cover-selector-modal");w&&x&&w.addEventListener("click",async()=>{const g=x.querySelector("#cover-chapter-select");g.innerHTML='<option value="">Select a chapter...</option>';const S=t.querySelector("#edit-volume-modal"),A=S?S.dataset.editingVolId:null;let T=[...e.chapters||[]];if(A){const q=e.volumes.find(C=>C.id===A);if(q&&q.chapters){const C=new Set(q.chapters);T=T.filter(_=>C.has(_.number))}}T.sort((q,C)=>q.number-C.number);const U=new Set;T.forEach(q=>{if(!U.has(q.number)){U.add(q.number);const C=document.createElement("option");C.value=q.number,C.textContent=`Chapter ${q.number}`,g.appendChild(C)}}),T.length>0&&(g.value=T[0].number,cs(e.id,T[0].number)),x.classList.add("open")});const E=t.querySelector("#cover-chapter-select");E&&E.addEventListener("change",g=>{g.target.value&&cs(e.id,g.target.value)}),t.querySelectorAll(".modal-close, .modal-close-btn").forEach(g=>{g.addEventListener("click",()=>{g.closest(".modal").classList.remove("open")})}),t.querySelectorAll(".modal-overlay").forEach(g=>{g.addEventListener("click",()=>{g.closest(".modal").classList.remove("open")})})}async function cs(t,e){const s=document.getElementById("cover-images-grid");if(s){s.innerHTML='<div class="loading-center"><div class="loading-spinner"></div></div>';try{const n=(await m.getChapterImages(t,e)).images||[];if(s.innerHTML="",n.length===0){s.innerHTML='<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';return}n.forEach(i=>{const o=document.createElement("div");o.className="cover-grid-item",o.style.cssText="cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;",o.innerHTML=`<img src="${i}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`,o.addEventListener("click",()=>{const c=document.querySelector('input[name="cover-target"]:checked').value,l=i.split("/").pop();er(l,e,c)}),s.appendChild(o)})}catch(a){s.innerHTML=`<div style="color:var(--danger); padding:20px;">Error: ${a.message}</div>`}}}async function er(t,e,s){const a=f.manga,n=document.getElementById("edit-volume-modal"),i=document.getElementById("cover-selector-modal");if(confirm(`Set this image as ${s} cover?`))try{if(s==="volume"){const o=n.dataset.editingVolId;if(!o)throw new Error("No volume selected");await m.setVolumeCoverFromChapter(a.id,o,e,t),d("Volume cover updated","success"),i.classList.remove("open"),n.classList.remove("open"),await K(a.id),H([a.id,"volume",o])}else{await m.setMangaCoverFromChapter(a.id,e,t),d("Series cover updated","success"),i.classList.remove("open"),await K(a.id);const o=window.location.hash.replace("#","");f.activeVolumeId?H([a.id,"volume",f.activeVolumeId]):H([a.id])}}catch(o){d("Failed to set cover: "+o.message,"error")}}let he={series:null,loading:!0};function Te(){if(he.loading)return`
      ${ne("series")}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;const t=he.series;if(!t)return`
      ${ne("series")}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;const e=t.alias||t.title,s=t.entries||[],a=s.reduce((i,o)=>i+(o.chapter_count||0),0);let n=null;if(s.length>0){const i=s[0];i.local_cover&&i.bookmark_id?n=`/api/public/covers/${i.bookmark_id}/${encodeURIComponent(i.local_cover.split(/[/\\]/).pop())}`:i.localCover&&i.bookmark_id?n=`/api/public/covers/${i.bookmark_id}/${encodeURIComponent(i.localCover.split(/[/\\]/).pop())}`:i.cover&&(n=i.cover)}return`
    ${ne("series")}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${n?Ce(n,e,{kind:"series"}):pe("series")}
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
            ${s.map((i,o)=>tr(i,o,s.length)).join("")}
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
  `}function tr(t,e,s){var i;const a=t.alias||t.title;let n=null;return t.local_cover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.local_cover.split(/[/\\]/).pop())}`:t.localCover?n=`/api/public/covers/${t.bookmark_id}/${encodeURIComponent(t.localCover.split(/[/\\]/).pop())}`:t.cover&&(n=t.cover),`
    <div class="series-entry-card" data-id="${t.bookmark_id}" data-order="${t.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${e+1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${t.bookmark_id}" ${e===0?"disabled":""}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${t.bookmark_id}" ${e===s-1?"disabled":""}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${n?Ce(n,a,{kind:"book"}):pe("book")}
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
  `}function dt(){var l,u,h;const t=document.getElementById("app"),e=he.series;(l=document.getElementById("back-btn"))==null||l.addEventListener("click",()=>R.go("/")),(u=document.getElementById("back-library-btn"))==null||u.addEventListener("click",()=>R.go("/")),t.querySelectorAll(".series-entry-card").forEach(v=>{v.addEventListener("click",w=>{if(w.target.closest("[data-action]"))return;const x=v.dataset.id;R.go(`/manga/${x}`)})}),t.querySelectorAll("[data-action]").forEach(v=>{v.addEventListener("click",async w=>{w.stopPropagation();const x=v.dataset.action,E=v.dataset.id;switch(x){case"move-up":await ds(E,-1);break;case"move-down":await ds(E,1);break;case"set-cover":const g=v.dataset.entryid;await sr(g);break}})});const s=document.getElementById("add-entry-btn"),a=document.getElementById("add-entry-modal"),n=document.getElementById("available-bookmarks-input"),i=document.getElementById("available-bookmarks-list"),o=document.getElementById("confirm-add-entry-btn");let c=[];s&&a&&(s.addEventListener("click",async()=>{try{s.disabled=!0,n&&(n.value="",n.placeholder="Loading...",n.disabled=!0),i&&(i.innerHTML=""),a.classList.add("open");const v=await m.getAvailableBookmarksForSeries();c=v,v.length===0?(n&&(n.placeholder="No available manga found"),o.disabled=!0):(n&&(n.placeholder="Select or type a manga...",n.disabled=!1),i&&(i.innerHTML=v.map(w=>`<option value="${(w.alias||w.title||"").replace(/"/g,"&quot;")}"></option>`).join("")),o.disabled=!1)}catch{d("Failed to load available manga","error"),a.classList.remove("open")}finally{s.disabled=!1}}),o.addEventListener("click",async()=>{const v=n?n.value:"",w=c.find(E=>(E.alias||E.title||"")===v);if(!w){d("Please select a valid manga from the list","warning");return}const x=w.id;try{o.disabled=!0,o.textContent="Adding...",await m.addSeriesEntry(e.id,x),d("Manga added to series","success"),a.classList.remove("open"),await ut(e.id),t.innerHTML=Te(),dt()}catch(E){d("Failed to add manga: "+E.message,"error")}finally{o.disabled=!1,o.textContent="Add to Series"}})),(h=document.getElementById("edit-series-btn"))==null||h.addEventListener("click",()=>{d("Edit series coming soon","info")})}async function ds(t,e){const s=he.series;if(!s)return;const a=s.entries||[],n=a.findIndex(c=>c.bookmark_id===t);if(n===-1)return;const i=n+e;if(i<0||i>=a.length)return;const o=a.map(c=>c.bookmark_id);[o[n],o[i]]=[o[i],o[n]];try{await m.post(`/series/${s.id}/reorder`,{order:o}),d("Order updated","success"),await ut(s.id);const c=document.getElementById("app");c.innerHTML=Te(),dt()}catch(c){d("Failed to reorder: "+c.message,"error")}}async function sr(t){const e=he.series;if(e)try{await m.setSeriesCover(e.id,t),d("Series cover updated","success"),await ut(e.id);const s=document.getElementById("app");s.innerHTML=Te(),dt()}catch(s){d("Failed to set cover: "+s.message,"error")}}async function ut(t){try{const e=await m.get(`/series/${t}`);he.series=e,he.loading=!1}catch{d("Failed to load series","error"),he.loading=!1}}async function ar(t=[]){const[e]=t;if(!e){R.go("/");return}const s=document.getElementById("app");he.loading=!0,he.series=null,s.innerHTML=Te(),await ut(e),s.innerHTML=Te(),dt()}function nr(){he.series=null,he.loading=!0}const rr={mount:ar,unmount:nr,render:Te},ir={mount:async t=>{const e=document.getElementById("app");e.innerHTML=`
            ${ne()}
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
        `;try{const u=await m.get("/settings")||{},h=document.getElementById("settings-form"),v=document.getElementById("settings-loader");u.theme&&(document.getElementById("theme").value=u.theme),v.style.display="none",h.style.display="",h.addEventListener("submit",async w=>{w.preventDefault();const x=new FormData(h),E={};for(const[g,S]of x.entries())E[g]=S;try{await m.post("/settings/bulk",E),d("Settings saved successfully"),E.theme}catch(g){console.error(g),d("Failed to save settings","error")}})}catch(u){console.error(u),document.getElementById("settings-loader").textContent="Error loading settings"}window.location.hash.includes("anilist=connected")&&d("AniList connected");const s=document.getElementById("anilist-group"),a=document.getElementById("anilist-status"),n=document.getElementById("anilist-connect"),i=document.getElementById("anilist-sync"),o=document.getElementById("anilist-disconnect"),c=document.getElementById("anilist-sync-result"),l=async()=>{s.style.display="block";try{const u=await m.anilistStatus();u.configured?u.connected?(a.textContent=`Connected as ${u.anilistUsername||"AniList user"}.`,n.style.display="none",i.style.display="",o.style.display=""):(a.textContent="Not connected. Link your AniList account to sync reading progress.",n.style.display="",i.style.display="none",o.style.display="none"):(a.textContent="Not configured — set ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET in .env and restart the server.",n.style.display="none",i.style.display="none",o.style.display="none")}catch(u){console.error(u),a.textContent="Failed to load AniList status — is the server running the latest code?"}};n.addEventListener("click",async()=>{try{const{url:u}=await m.anilistAuthUrl();window.location.href=u}catch(u){d(u.message||"Failed to start AniList connection","error")}}),o.addEventListener("click",async()=>{try{await m.anilistDisconnect(),d("AniList disconnected"),l()}catch{d("Failed to disconnect","error")}}),i.addEventListener("click",async()=>{i.disabled=!0,a.textContent="Syncing from AniList…";try{const u=await m.anilistPull();u.updated.length===0?c.textContent="Everything already up to date.":c.innerHTML="<ul>"+u.updated.map(h=>`<li>${h.title} — marked read up to chapter ${h.markedUpTo}</li>`).join("")+"</ul>",d(`AniList sync: ${u.updated.length} manga updated`)}catch(u){c.textContent="",d(u.message||"AniList sync failed","error")}finally{i.disabled=!1,l()}}),l()}},or={mount:async t=>{const e=document.getElementById("app");if(!ae.isAdmin){e.innerHTML=`
                ${ne()}
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
        `,document.querySelectorAll(".admin-tab").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(a=>a.classList.remove("active")),s.classList.add("active"),document.querySelectorAll(".admin-section").forEach(a=>a.style.display="none"),document.getElementById(`admin-section-${s.dataset.section}`).style.display=""})}),await Promise.all([et(),lr(),cr()])}};async function et(){const t=document.getElementById("admin-section-users");try{const e=await m.listUsers();t.innerHTML=`
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
                                <td>${At(s.username)}${s.id===((a=ae.user)==null?void 0:a.id)?' <span class="badge">you</span>':""}</td>
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
        `,t.querySelectorAll("tr[data-user-id]").forEach(s=>{const a=Number(s.dataset.userId),n=async()=>{try{await m.updateUser(a,{role:s.querySelector(".user-role").value,canDownload:s.querySelector(".user-can-download").checked,canEdit:s.querySelector(".user-can-edit").checked}),d("User updated","success")}catch(i){d(i.message,"error"),et()}};s.querySelector(".user-role").addEventListener("change",n),s.querySelector(".user-can-download").addEventListener("change",n),s.querySelector(".user-can-edit").addEventListener("change",n),s.querySelector(".user-reset-pw").addEventListener("click",async()=>{const i=prompt("New password for this user:");if(i)try{await m.updateUser(a,{password:i}),d("Password reset","success")}catch(o){d(o.message,"error")}}),s.querySelector(".user-delete").addEventListener("click",async()=>{if(confirm("Delete this user?"))try{await m.deleteUser(a),d("User deleted","success"),et()}catch(i){d(i.message,"error")}})}),document.getElementById("add-user-form").addEventListener("submit",async s=>{s.preventDefault();try{await m.createUser({username:document.getElementById("new-username").value.trim(),password:document.getElementById("new-password").value,role:document.getElementById("new-role").value,canDownload:document.getElementById("new-can-download").checked,canEdit:document.getElementById("new-can-edit").checked}),d("User created","success"),et()}catch(a){d(a.message,"error")}})}catch(e){console.error(e),t.innerHTML='<div class="error">Failed to load users</div>'}}async function lr(){const t=document.getElementById("admin-section-demo");try{const e=await m.getBookmarks();t.innerHTML=`
            <h2>Demo Content</h2>
            <p class="admin-demo-warning">
                Checked series are visible to <strong>anyone</strong> on the public demo page
                (<code>/demo.html</code>) — no login needed, covers included. Only downloaded
                chapters are readable there. Be deliberate about adult titles.
            </p>
            <input type="search" id="demo-filter" placeholder="Filter series..." class="admin-demo-filter">
            <ul class="admin-demo-list">
                ${e.map(s=>`
                    <li data-title="${At((s.alias||s.title||"").toLowerCase())}">
                        <label>
                            <input type="checkbox" class="demo-toggle" data-id="${s.id}" ${s.isDemo?"checked":""}>
                            <span>${At(s.alias||s.title)}</span>
                            <span class="badge">${s.downloadedCount||0} downloaded</span>
                        </label>
                    </li>
                `).join("")}
            </ul>
        `,t.querySelectorAll(".demo-toggle").forEach(s=>{s.addEventListener("change",async()=>{try{await m.toggleDemo(s.dataset.id,s.checked),d(s.checked?"Added to demo":"Removed from demo","success")}catch(a){s.checked=!s.checked,d(a.message,"error")}})}),document.getElementById("demo-filter").addEventListener("input",s=>{const a=s.target.value.toLowerCase();t.querySelectorAll(".admin-demo-list li").forEach(n=>{n.style.display=n.dataset.title.includes(a)?"":"none"})})}catch(e){console.error(e),t.innerHTML='<div class="error">Failed to load bookmarks</div>'}}function At(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}async function cr(){try{const t=await m.get("/admin/tables"),e=document.getElementById("admin-sidebar");e.innerHTML=`
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
        `,e.querySelectorAll(".table-link").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=a.currentTarget.dataset.table;Mt(n),e.querySelectorAll(".table-link").forEach(i=>i.classList.remove("active")),a.currentTarget.classList.add("active")})})}catch(t){console.error(t),document.getElementById("admin-sidebar").innerHTML='<div class="error">Failed to load tables</div>'}}async function Mt(t,e=0){var a,n;const s=document.getElementById("admin-main");s.innerHTML=`<div class="loader">Loading ${t}...</div>`;try{const o=await m.get(`/admin/tables/${t}?page=${e}&limit=50`);if(!o.rows||o.rows.length===0){s.innerHTML=`
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
                                ${c.map(u=>{const h=l[u];let v=h;return h===null?v='<span class="null">NULL</span>':typeof h=="object"?v=JSON.stringify(h):String(h).length>100&&(v=String(h).substring(0,100)+"..."),`<td>${v}</td>`}).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `,(a=document.getElementById("prev-page"))==null||a.addEventListener("click",()=>Mt(t,e-1)),(n=document.getElementById("next-page"))==null||n.addEventListener("click",()=>Mt(t,e+1))}catch(i){console.error(i),s.innerHTML=`<div class="error">Failed to load data for ${t}</div>`}}let X={favorites:{favorites:{},listOrder:[]},trophyPages:{},bookmarks:[],series:[],loading:!0,activeTab:"galleries"};function dr(t,e){let s=null;if(e.length>0){const n=e[0];if(n.imagePaths&&n.imagePaths.length>0){const i=n.imagePaths[0];let o;typeof i=="string"?o=i:i&&typeof i=="object"&&(o=i.filename||i.path||i.name||i.url,o&&o.includes("/")&&(o=o.split("/").pop()),o&&o.includes("\\")&&(o=o.split("\\").pop())),o&&(s=`/api/public/chapter-images/${n.mangaId}/${n.chapterNum}/${encodeURIComponent(o)}`)}}const a=e.reduce((n,i)=>{var o;return n+(((o=i.imagePaths)==null?void 0:o.length)||0)},0);return`
    <div class="manga-card gallery-card" data-gallery="${t}">
      <div class="manga-card-cover">
        ${s?Ce(s,t,{kind:"folder"}):pe("folder")}
        <div class="manga-card-badges">
            <span class="badge badge-series">${a} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${t}</div>
    </div>
  `}function ur(t){const e=X.bookmarks.find(s=>s.id===t);return e?e.alias||e.title:t}function pr(t){const e=X.bookmarks.find(s=>s.id===t);if(e&&e.seriesId){const s=X.series.find(a=>a.id===e.seriesId);if(s)return{id:s.id,name:s.alias||s.title}}return null}function hr(t,e,s,a=!1){return`
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
  `}function mr(){const t={};console.log("Building trophy groups from:",X.trophyPages);for(const e of Object.keys(X.trophyPages)){const s=X.trophyPages[e];let a=0;for(const[i,o]of Object.entries(s))a+=Object.keys(o).length;if(console.log(`Manga ${e}: ${a} trophies`),a===0)continue;const n=pr(e);if(n)t[n.id]||(t[n.id]={name:n.name,isSeries:!0,count:0,mangaIds:[]}),t[n.id].count+=a,t[n.id].mangaIds.push(e);else{const i=ur(e);console.log(`No series for ${e}, using name: ${i}`),t[e]={name:i,isSeries:!1,count:a,mangaIds:[e]}}}return console.log("Trophy groups result:",t),t}function ot(){if(X.loading)return`
      ${ne("manga")}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;const{favorites:t,listOrder:e}=X.favorites,s=`
    <div class="favorites-tabs">
      <button class="tab-btn ${X.activeTab==="galleries"?"active":""}" data-tab="galleries">
        ${p("folder")} Galleries
      </button>
      <button class="tab-btn ${X.activeTab==="trophies"?"active":""}" data-tab="trophies">
        ${p("trophy")} Trophies
      </button>
    </div>
  `;let a="";if(X.activeTab==="galleries")e.length===0?a=`
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${e.map(i=>{const o=t&&t[i]||[];return dr(i,o)}).join("")}
        </div>
      `;else{const n=mr(),i=Object.keys(n);i.length===0?a=`
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `:a=`
        <div class="library-grid">
          ${i.map(c=>{const l=n[c];return hr(c,l.name,l.count,l.isSeries)}).join("")}
        </div>
      `}return`
    ${ne("manga")}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${s}
      ${a}
    </div>
  `}function Os(){ke();const t=document.getElementById("app");t.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{X.activeTab=s.dataset.tab,t.innerHTML=ot(),Os()})}),t.querySelectorAll(".gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.gallery;R.go(`/read/gallery/${encodeURIComponent(a)}`)})}),t.querySelectorAll(".trophy-gallery-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.trophyId;s.dataset.isSeries==="true"?R.go(`/read/trophies/series-${a}/🏆`):R.go(`/read/trophies/${a}/🏆`)})})}async function gr(){try{const[t,e,s,a]=await Promise.all([oe.loadFavorites(),m.get("/trophy-pages"),oe.loadBookmarks(),oe.loadSeries()]);X.favorites=t||{favorites:{},listOrder:[]},X.trophyPages=e||{},X.bookmarks=s||[],X.series=a||[],X.loading=!1}catch(t){console.error("Failed to load favorites:",t),d("Failed to load favorites","error"),X.loading=!1}}async function fr(){console.log("[Favorites] mount called"),X.loading=!0;const t=document.getElementById("app");t.innerHTML=ot(),await gr(),console.log("[Favorites] Data loaded, rendering..."),t.innerHTML=ot(),console.log("[Favorites] Calling setupListeners..."),Os(),console.log("[Favorites] setupListeners complete")}function vr(){}const yr={mount:fr,unmount:vr,render:ot};let V={downloads:{},queueTasks:[],historyTasks:[],autoCheck:null,loading:!0,showEmptyChecks:!1,collapsed:{active:!1,scheduled:!1,completed:!1,history:!0}},tt=null,ie={};function zt(t){if(!t)return"Never";const e=Date.now()-new Date(t).getTime(),s=Math.floor(e/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);return a<24?`${a}h ${s%60}m ago`:`${Math.floor(a/24)}d ago`}function br(t){if(!t)return"Not scheduled";const e=new Date(t).getTime()-Date.now();if(e<=0)return"Running now...";const s=Math.floor(e/6e4);if(s<60)return`in ${s}m`;const a=Math.floor(s/60),n=s%60;if(a<24)return`in ${a}h ${n}m`;const i=Math.floor(a/24),o=a%24;return`in ${i}d ${o}h`}function Vs(t){switch(t){case"download":return p("download");case"scrape":return p("search");case"scan":return p("folder");default:return p("settings")}}function jt(t){switch(t){case"running":return"var(--color-success)";case"queued":case"pending":return"var(--color-warning)";case"paused":return"var(--color-info)";case"complete":return"var(--color-success)";case"error":case"failed":case"cancelled":return"var(--color-error)";default:return"var(--text-secondary)"}}function Qt(t){switch(t){case"running":return"● Running";case"queued":case"pending":return"◌ Queued";case"paused":return"❚❚ Paused";case"complete":return"✓ Complete";case"error":case"failed":return"✗ Failed";case"cancelled":return"✗ Cancelled";default:return t}}function wr(t){return!t||t==="default"?"Default (6h)":t==="daily"?"Daily":t==="weekly"?"Weekly":t}function kr(){const t=V.autoCheck;return t?`
    <div class="queue-inline-header">
      <span class="text-muted">${t.enabledCount} monitored · Last: ${zt(t.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">${p("play")} Run All Now</button>
    </div>
  `:""}function $r(t){const e=t.nextCheck?br(t.nextCheck):"Not set",s=t.nextCheck&&new Date(t.nextCheck)<=new Date;return`
    <div class="queue-card scheduled-manga-card ${s?"due":""}" data-manga-id="${t.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${p("book-open")}</span>
          <div>
            <div class="task-title">${t.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${wr(t.schedule)}${t.schedule==="weekly"&&t.day?` · ${t.day.charAt(0).toUpperCase()+t.day.slice(1)}`:""}${(t.schedule==="daily"||t.schedule==="weekly")&&t.time?` · ${t.time}`:""}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${s?"text-success":""}">${s?`${p("alarm-clock")} Due now`:e}</span>
        </div>
      </div>
    </div>
  `}function us(t,e){const s=e.total>0?Math.round(e.completed/e.total*100):0,a=e.status==="running"||e.status==="queued",n=e.status==="paused";return`
    <div class="queue-card task-card" data-task-id="${t}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${p("download")}</span>
          <div>
            <div class="task-title">${e.mangaTitle||"Download"}</div>
            <div class="task-status" style="color: ${jt(e.status)}">${Qt(e.status)}</div>
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
  `}function Er(t){const e=t.data||{};return`
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Vs(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${jt(t.status)}">${Qt(t.status)}</div>
          </div>
        </div>
      </div>
      ${t.started_at?`<div class="queue-card-body"><small>Started: ${zt(t.started_at)}</small></div>`:""}
    </div>
  `}function Cr(t){const e=t.data||{},s=t.result||{};let a="";return t.type==="scrape"?s.newChaptersCount!==void 0&&s.newChaptersCount>0?(a=`<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${s.newChaptersCount} new chapters</div>`,s.newChapters&&Array.isArray(s.newChapters)&&(a+=`<div class="task-details hidden" id="task-details-${t.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${s.newChapters.map(n=>`<li>Ch. ${n.number}: ${n.url}</li>`).join("")}
                    </ul>
                </div>`)):(s.newChaptersCount===0||s.updated===!1)&&(a='<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>'):(t.type==="scan"||t.type==="scan-local")&&s.count!==void 0&&(a=`<div class="task-subtext">Scanned ${s.count} local chapters</div>`),`
    <div class="queue-card task-card history-card" data-history-id="${t.id}" style="cursor: ${a.includes("task-details")?"pointer":"default"}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${Vs(t.type)}</span>
          <div>
            <div class="task-title">${e.description||e.mangaTitle||t.type}</div>
            <div class="task-status" style="color: ${jt(t.status)}">${Qt(t.status)}</div>
            ${a}
          </div>
        </div>
      </div>
      ${t.completed_at?`<div class="queue-card-body"><small>Completed: ${zt(t.completed_at)}</small></div>`:""}
    </div>
  `}function xr(){var c;const t=Object.entries(V.downloads),e=t.filter(([,l])=>l.status!=="complete"),s=t.filter(([,l])=>l.status==="complete"),a=new Set(e.map(([,l])=>l.bookmarkId).filter(Boolean)),n=V.queueTasks.filter(l=>{var u;return!(l.type==="download"&&((u=l.data)!=null&&u.mangaId)&&a.has(l.data.mangaId))}),i=e.length+n.length,o=((c=V.autoCheck)==null?void 0:c.schedules)||[];return`
    ${ne("manga")}
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
            ${e.map(([l,u])=>us(l,u)).join("")}
            ${n.map(l=>Er(l)).join("")}
          </div>
        </div>
      `:""}

      ${o.length>0?`
        <div class="queue-section ${V.collapsed.scheduled?"collapsed":""}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${o.length})
            </h3>
            ${kr()}
          </div>
          <div class="queue-section-content">
            ${o.map(l=>$r(l)).join("")}
          </div>
        </div>
      `:""}

      ${s.length>0?`
        <div class="queue-section ${V.collapsed.completed?"collapsed":""}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${s.map(([l,u])=>us(l,u)).join("")}
          </div>
        </div>
      `:""}

      ${V.historyTasks&&V.historyTasks.length>0?(()=>{const l=v=>{if(v.type!=="scrape")return!1;const w=v.result||{};return(v.status==="complete"||v.status==="completed")&&(w.newChaptersCount===0||w.updated===!1)},u=V.historyTasks.filter(l).length,h=V.showEmptyChecks?V.historyTasks:V.historyTasks.filter(v=>!l(v));return`
        <div class="queue-section ${V.collapsed.history?"collapsed":""}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${u>0?`
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${V.showEmptyChecks?"Hide":"Show"} checks with no new chapters">
                    ${V.showEmptyChecks?`${p("chevron-up")} Hide`:`${p("chevron-down")} Show`} empty checks (${u})
                  </button>
                `:""}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  ${p("trash-2")} Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${h.length>0?h.map(v=>Cr(v)).join(""):`
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${u>0?`${u} empty check(s) hidden.`:""}</p>
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
  `}async function Se(){try{const[t,e,s,a]=await Promise.all([m.getDownloads().catch(()=>({})),m.getQueueTasks().catch(()=>[]),m.getQueueHistory(50).catch(()=>[]),m.getAutoCheckStatus().catch(()=>null)]);V.downloads=t||{},V.queueTasks=e||[],V.historyTasks=s||[],V.autoCheck=a,V.loading=!1}catch(t){console.error("[Queue] Failed to load data:",t),V.loading=!1}}function fe(){const t=document.getElementById("app");t&&(t.innerHTML=xr(),Sr())}function Sr(){ke(),document.querySelectorAll("[data-toggle]").forEach(a=>{a.addEventListener("click",n=>{const i=a.dataset.toggle;V.collapsed[i]=!V.collapsed[i],fe()})});const t=document.getElementById("run-autocheck-btn");t&&t.addEventListener("click",async()=>{t.disabled=!0,t.innerHTML=`${p("loader",{spin:!0})} Running...`;try{d("Auto-check started...","info");const a=await m.runAutoCheck();d(`Check complete: ${a.checked} checked, ${a.updated} updated`,"success"),await Se(),fe()}catch(a){d("Auto-check failed: "+a.message,"error"),t.disabled=!1,t.innerHTML=`${p("play")} Run Now`}});const e=document.getElementById("clear-history-btn");e&&e.addEventListener("click",async a=>{if(a.stopPropagation(),confirm("Are you sure you want to clear the task history?"))try{await m.clearQueueHistory(),d("History cleared","success"),await Se(),fe()}catch(n){d(`Failed to clear history: ${n.message}`,"error")}});const s=document.getElementById("toggle-empty-checks-btn");s&&s.addEventListener("click",a=>{a.stopPropagation(),V.showEmptyChecks=!V.showEmptyChecks,fe()}),document.querySelectorAll(".scheduled-manga-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.mangaId;n&&(window.location.hash=`#/manga/${n}`)})}),document.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const i=a.dataset.action,o=a.dataset.task;try{i==="pause"?(await m.pauseDownload(o),d("Download paused","info")):i==="resume"?(await m.resumeDownload(o),d("Download resumed","info")):i==="cancel"&&confirm("Cancel this download?")&&(await m.cancelDownload(o),d("Download cancelled","info")),await Se(),fe()}catch(c){d(`Action failed: ${c.message}`,"error")}})}),document.querySelectorAll(".history-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.historyId,i=document.getElementById(`task-details-${n}`);i&&i.classList.toggle("hidden")})})}async function Lr(){V.loading=!0;const t=document.getElementById("app");t.innerHTML=`
    ${ne("manga")}
    <div class="container queue-container">
      <div class="queue-header"><h2>${p("list-checks")} Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `,ke(),await Se(),fe(),tt=setInterval(async()=>{await Se(),fe()},5e3),ie.downloadProgress=e=>{e.taskId&&V.downloads[e.taskId]&&(Object.assign(V.downloads[e.taskId],e),fe())},ie.downloadCompleted=e=>{Se().then(fe)},ie.queueUpdated=e=>{Se().then(fe)},ue.on(ve.DOWNLOAD_PROGRESS,ie.downloadProgress),ue.on(ve.DOWNLOAD_COMPLETED,ie.downloadCompleted),ue.on(ve.QUEUE_UPDATED,ie.queueUpdated)}function Ir(){tt&&(clearInterval(tt),tt=null),ie.downloadProgress&&ue.off(ve.DOWNLOAD_PROGRESS,ie.downloadProgress),ie.downloadCompleted&&ue.off(ve.DOWNLOAD_COMPLETED,ie.downloadCompleted),ie.queueUpdated&&ue.off(ve.QUEUE_UPDATED,ie.queueUpdated),ie={}}const _r={mount:Lr,unmount:Ir};class Br{constructor(){this.container=null,this.scrapers=[],this.currentQuery="",this.currentTarget="all",this.isSearching=!1,this.results=[],this.viewMode="main",this.browseScraper=null,this.browseQuery="english",this.browseSort="popular-today",this.browsePage=1,this.browseTotalPages=1,this.isBrowsing=!1,this.browseResults=[],this.previewInfo=null,this.previewImages=[],this.previewIndex=0,this.infoAbortController=null}async mount(e){this.container=document.getElementById("app"),document.body.className="scrapers-mode";const s=new URLSearchParams(window.location.hash.split("?")[1]||""),a=s.get("browse"),n=s.get("q");a&&(this.browseScraper=a,this.viewMode="browse",this.browseQuery=n||this.browseQuery,this.browseSort="popular",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1),this.updateView(),await this.loadScrapers(),this.viewMode==="browse"&&this.browseScraper?this.performBrowse():n&&(this.currentQuery=n,this.updateView(),this.performSearch())}unmount(){this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.container.innerHTML="",document.body.className=""}async loadScrapers(){try{const e=await m.get("/scrapers/list");e.success&&(this.scrapers=e.scrapers,this.updateView())}catch(e){console.error("Failed to load scrapers",e)}}updateView(){this.render(),this.renderScraperList(),(this.results.length>0||this.isSearching)&&this.renderResults(),this.bindEvents()}render(){this.container.innerHTML=`
      ${ne()}
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
    `,ke()}renderScraperList(){const e=document.getElementById("scraper-cards-list");if(!e)return;if(this.scrapers.length===0){e.innerHTML=`
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
      `);e.innerHTML=a.join("")}getDomainIcon(e){const s=e.toLowerCase();return s.includes("comix")?p("library"):s.includes("mangahere")?p("book-open"):s.includes("nhentai")?p("shield-alert"):s.includes("chained")?p("link"):p("globe")}bindEvents(){const e=document.getElementById("scraper-search-form");e&&e.addEventListener("submit",w=>{w.preventDefault();const x=document.getElementById("scraper-query");x&&x.value.trim()&&(this.currentQuery=x.value.trim(),this.performSearch())});const s=document.getElementById("clear-target-btn");s&&s.addEventListener("click",()=>{this.currentTarget="all",this.updateView();const w=document.getElementById("scraper-query");w&&w.focus()}),document.querySelectorAll(".scraper-search-card-btn").forEach(w=>{w.addEventListener("click",x=>{const E=x.target.dataset.scraper;this.currentTarget=E;const g=document.getElementById("scraper-query");g&&(this.currentQuery=g.value.trim()),this.updateView();const S=document.getElementById("scraper-query");S&&(S.focus(),window.scrollTo({top:0,behavior:"smooth"}),this.currentQuery&&this.performSearch())})}),document.querySelectorAll(".scraper-browse-card-btn").forEach(w=>{w.addEventListener("click",x=>{const E=x.target.dataset.scraper;this.browseScraper=E,this.viewMode="browse",this.browsePage=1,this.browseResults=[],this.browseTotalPages=1,this.updateView(),this.performBrowse()})});const a=document.getElementById("exit-browse-btn");a&&a.addEventListener("click",()=>{this.viewMode="main",this.updateView()});const n=document.getElementById("browse-apply-btn");n&&n.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse()});const i=document.getElementById("browse-refresh-btn");i&&i.addEventListener("click",()=>{this.browseQuery=document.getElementById("browse-query").value.trim(),this.browseSort=document.getElementById("browse-sort").value,this.browsePage=1,this.browseResults=[],this.performBrowse(!1,!0)});const o=document.getElementById("browse-query");o&&o.addEventListener("keypress",w=>{w.key==="Enter"&&n.click()});const c=document.getElementById("browse-load-more-btn");c&&c.addEventListener("click",()=>{!this.isBrowsing&&this.browsePage<this.browseTotalPages&&(this.browsePage++,this.performBrowse(!0))});const l=document.getElementById("preview-close-btn");l&&l.addEventListener("click",()=>{this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),document.getElementById("preview-info-modal").style.display="none"});const u=document.getElementById("preview-add-btn");u&&u.addEventListener("click",()=>{this.previewInfo&&this.previewInfo.url&&this.openAddModal(this.previewInfo.url,u)});const h=document.getElementById("preview-read-btn");h&&h.addEventListener("click",()=>{h.disabled||(this.infoAbortController&&(this.infoAbortController.abort(),this.infoAbortController=null),this.openTempReader())});const v=document.getElementById("temp-reader-close");v&&v.addEventListener("click",()=>{document.getElementById("temp-reader-overlay").style.display="none"})}async performSearch(){const e=document.getElementById("scraper-results-container"),s=document.getElementById("scraper-search-btn");if(!e||!s)return;this.isSearching=!0,e.style.display="block",s.textContent="Searching...",s.disabled=!0;const a=this.currentTarget==="all"?"all sites":this.currentTarget;e.innerHTML=`
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
      `;return}let s='<div class="library-grid" style="margin-top: 2rem;">';this.results.forEach(a=>{const n=a.cover||"";let i="";n.startsWith("/covers/")?i=n:n&&(i=`/api/scrapers/proxy-cover?url=${encodeURIComponent(n)}`);const o=i?Ce(i,"Cover",{kind:"series",self:!0}):pe("series");s+=`
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
      `,a.style.display="none";return}let n="";this.browseResults.forEach((i,o)=>{const c=i.cover||"";let l="";c.startsWith("/covers/")?l=c:c&&(l=`/api/scrapers/proxy-cover?url=${encodeURIComponent(c)}`);const u=l?Ce(l,"Cover",{kind:"series",self:!0}):pe("series");n+=`
        <div class="manga-card browse-result-card" data-index="${o}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${u}
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
    `,this._setReadBtnEnabled(i,!1);try{const o=await m.get(`/scrapers/info?url=${encodeURIComponent(e.url)}`,{signal:s});if(o.success&&o.info){this.previewInfo={...this.previewInfo,...o.info};let c="";o.info.tags&&o.info.tags.length>0&&(c=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Tags</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${o.info.tags.map(u=>`<span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); font-weight: normal; font-size: 0.75rem;">${u}</span>`).join("")}
                 </div>
               </div>
             `);let l="";o.info.artists&&o.info.artists.length>0&&(l=`
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Artists</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${o.info.artists.map(u=>`<span class="badge badge-chapters">${u}</span>`).join("")}
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
          `,this._setReadBtnEnabled(i,!0)}else document.getElementById("preview-extended-info").innerHTML='<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>',(this.previewInfo.galleryId||this.previewInfo.url)&&this._setReadBtnEnabled(i,!0)}catch(o){if(o.name==="AbortError"||s.aborted){console.log("Scraper details fetch aborted successfully.");return}console.error("Info error:",o),document.getElementById("preview-extended-info").innerHTML=`<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${o.message}</p>`,this._setReadBtnEnabled(i,!0)}}_setReadBtnEnabled(e,s){e&&(e.disabled=!s,e.style.opacity=s?"1":"0.5",e.style.cursor=s?"pointer":"not-allowed",e.style.pointerEvents=s?"auto":"none")}async openTempReader(){if(!this.previewInfo||!this.previewInfo.url&&!this.previewInfo.galleryId)return;const e=this.previewInfo.url||`https://nhentai.net/g/${this.previewInfo.galleryId}/`,s=this.browseScraper||this.previewInfo.website;sessionStorage.setItem("streamPreviewUrl",e),sessionStorage.setItem("streamPreviewTitle",this.previewInfo.title||"Preview"),s?sessionStorage.setItem("streamPreviewScraper",s):sessionStorage.removeItem("streamPreviewScraper"),document.getElementById("preview-info-modal").style.display="none",window.location.hash="#/read/stream/preview"}}const Ar=new Br;class Mr{constructor(){this.routes=new Map,this.currentRoute=null,this.currentView=null}init(){window.addEventListener("hashchange",()=>this.navigate()),this.navigate()}register(e,s){this.routes.set(e,s)}async navigate(){console.log("[Router] navigate called");const s=(window.location.hash.slice(1)||"/").split("?")[0],[a,...n]=s.split("/").filter(Boolean),i=`/${a||""}`;this.currentView&&this.currentView.unmount&&(console.log("[Router] calling unmount on current view"),this.currentView.unmount());let o=this.routes.get(i);!o&&this.routes.has("/")&&(o=this.routes.get("/")),o&&(this.currentRoute=i,this.currentView=o,o.mount&&(console.log("[Router] calling mount on view module"),await o.mount(n)),ke())}go(e){window.location.hash=e}back(){window.history.back()}reload(){this.currentView&&this.currentView.mount&&(this.currentView.mount(),ke())}}const R=new Mr;R.register("/",sn);R.register("/manga",Jn);R.register("/read",xn);R.register("/series",rr);R.register("/settings",ir);R.register("/admin",or);R.register("/favorites",yr);R.register("/queue",_r);R.register("/scrapers",Ar);export{ve as S,ue as a,R as r,Rr as s};
