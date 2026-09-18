var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(e){throw n=[e],e}},s=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,o)=>(o=n==null?{}:e(i(n)),c(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n)),u=(e=>typeof require<`u`?require:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof require<`u`?require:e)[t]}):e)(function(e){if(typeof require<`u`)return require.apply(this,arguments);throw Error('Calling `require` for "'+e+"\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.")});(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var d=o((()=>{})),f=o((()=>{})),p=o((()=>{})),m=o((()=>{})),h=o((()=>{})),g=o((()=>{})),_=o((()=>{})),v,y,b=o((()=>{v=class{constructor(){this.subscribers=new Set,this.state={user:{id:`usr_pro`,name:`Elena Rostova`,email:`elena@designstudio.io`,credits:450,plan_id:`PROFESSIONAL`,role:`user`},currentView:`studio`,activeSeoTool:null,project:{id:`proj_default`,name:`Creative Project 01`,active_tool:`tool_gradient_extract`},originalImage:null,originalImageUrl:null,originalFileName:`sample-artwork.png`,originalWidth:1200,originalHeight:800,batchAssets:[],activeTool:`tool_gradient_extract`,processedResult:null,compareMode:`slider`,zoom:100,sliderPos:50,pan:{x:0,y:0},isPanning:!1,isProcessing:!1,processingMessage:``,processingProgress:0,jobId:null,undoStack:[],redoStack:[],params:{gradientColors:[`#6366f1`,`#06b6d4`,`#ec4899`,`#8b5cf6`],gradientType:`linear`,gradientAngle:135,gradientBlur:0,gradientOpacity:100,upscaleResolution:`4K`,upscaleSharpness:75,upscaleDetail:60,upscaleNoiseReduction:30,grainPreset:`classic`,grainAmount:45,grainSize:2,grainSoftness:3,grainContrast:30,grainOpacity:60,glassPreset:`1`,glassRefraction:35,glassDistortion:25,glassTransparency:75,glassBlur:2,glassReflection:40,glassLight:50,glassDepth:20,glassDensity:15,glassEdgeDistortion:20,glassTint:`#6366f1`,makerSystem:1,makerType:`linear`,makerNoise:15,vectorColors:8,vectorDetail:60,vectorSmoothness:60,vectorThreshold:128,vectorSimplification:2,vectorRemoveWhite:!0,bgTolerance:25,bgFeather:2,bgShadowPreserve:!0,bgEdgeRefine:50,sheetLayout:`1`,sheetColumns:4,sheetRows:4,sheetPadding:20,sheetMargin:30,sheetBackground:`transparent`,sheetLabels:!1,packStyle:`flat`,packSize:512},theme:localStorage.getItem(`cf_theme`)||`dark`}}getState(){return this.state}setState(e){(e.params||e.activeTool)&&(this.state.undoStack.length>20&&this.state.undoStack.shift(),this.state.undoStack.push({activeTool:this.state.activeTool,params:JSON.parse(JSON.stringify(this.state.params))}),this.state.redoStack=[]),this.state={...this.state,...e},this.notify()}setParam(e,t){this.setState({params:{...this.state.params,[e]:t}})}undo(){if(this.state.undoStack.length===0)return;let e=this.state.undoStack.pop();this.state.redoStack.push({activeTool:this.state.activeTool,params:JSON.parse(JSON.stringify(this.state.params))}),this.state.activeTool=e.activeTool,this.state.params=e.params,this.notify()}redo(){if(this.state.redoStack.length===0)return;let e=this.state.redoStack.pop();this.state.undoStack.push({activeTool:this.state.activeTool,params:JSON.parse(JSON.stringify(this.state.params))}),this.state.activeTool=e.activeTool,this.state.params=e.params,this.notify()}subscribe(e){return this.subscribers.add(e),()=>this.subscribers.delete(e)}notify(){for(let e of this.subscribers)e(this.state)}},y=new v})),x,S,C=o((()=>{x=class{constructor(){this.baseUrl=``,this.token=localStorage.getItem(`cf_token`)||`usr_pro`}setToken(e){this.token=e,e?localStorage.setItem(`cf_token`,e):localStorage.removeItem(`cf_token`)}async request(e,t={}){let n={...t.headers||{}};this.token&&(n.Authorization=`Bearer ${this.token}`,n[`x-user-id`]=this.token),t.body instanceof FormData||(n[`Content-Type`]=`application/json`);let r=await fetch(`${this.baseUrl}${e}`,{...t,headers:n}),i=await r.json().catch(()=>({}));if(!r.ok)throw Error(i.error||`HTTP error ${r.status}`);return i}async getMe(){return this.request(`/api/auth/me`)}async login(e,t){let n=await this.request(`/api/auth/login`,{method:`POST`,body:JSON.stringify({email:e,password:t})});return n.token&&this.setToken(n.token),n}async switchDemo(e){let t=await this.request(`/api/auth/switch-demo`,{method:`POST`,body:JSON.stringify({role:e})});return t.token&&this.setToken(t.token),t}async getProjects(){return this.request(`/api/projects`)}async getProject(e){return this.request(`/api/projects/${e}`)}async createProject(e,t){return this.request(`/api/projects`,{method:`POST`,body:JSON.stringify({name:e,initialAssetId:t})})}async updateProject(e,t){return this.request(`/api/projects/${e}`,{method:`PATCH`,body:JSON.stringify(t)})}async duplicateProject(e){return this.request(`/api/projects/${e}/duplicate`,{method:`POST`})}async deleteProject(e){return this.request(`/api/projects/${e}`,{method:`DELETE`})}async uploadFiles(e,t=null){let n=new FormData;for(let t of e)n.append(`images`,t);return t&&n.append(`projectId`,t),this.request(`/api/assets/upload`,{method:`POST`,body:n})}async startProcess(e,t){return this.request(`/api/process/${e}`,{method:`POST`,body:JSON.stringify(t)})}async getJob(e){return this.request(`/api/jobs/${e}`)}async getJobs(){return this.request(`/api/jobs`)}async saveExport(e){return this.request(`/api/exports/save-asset`,{method:`POST`,body:JSON.stringify(e)})}async getExports(){return this.request(`/api/exports`)}async getAdminOverview(){return this.request(`/api/admin/overview`)}async getAdminUsers(e){return this.request(`/api/admin/users${e?`?search=`+encodeURIComponent(e):``}`)}async updateAdminUser(e,t){return this.request(`/api/admin/users/${e}`,{method:`PATCH`,body:JSON.stringify(t)})}async getAdminTools(){return this.request(`/api/admin/tools`)}async updateAdminTool(e,t){return this.request(`/api/admin/tools/${e}`,{method:`PATCH`,body:JSON.stringify(t)})}async triggerBackup(){return this.request(`/api/admin/backup`,{method:`POST`})}async getHealth(){return this.request(`/api/health`)}},S=new x}));function w(){let e=document.createElement(`canvas`);e.width=1200,e.height=800;let t=e.getContext(`2d`);t.fillStyle=`#0a0b12`,t.fillRect(0,0,1200,800);let n=t.createRadialGradient(300,250,0,300,250,450);n.addColorStop(0,`rgba(99, 102, 241, 0.55)`),n.addColorStop(.6,`rgba(6, 182, 212, 0.2)`),n.addColorStop(1,`transparent`),t.fillStyle=n,t.fillRect(0,0,1200,800);let r=t.createRadialGradient(900,550,0,900,550,400);r.addColorStop(0,`rgba(236, 72, 153, 0.45)`),r.addColorStop(.7,`rgba(139, 92, 246, 0.15)`),r.addColorStop(1,`transparent`),t.fillStyle=r,t.fillRect(0,0,1200,800),t.save(),t.translate(600,400),t.rotate(Math.PI/6);let i=t.createLinearGradient(-180,-180,180,180);i.addColorStop(0,`#06b6d4`),i.addColorStop(.5,`#6366f1`),i.addColorStop(1,`#ec4899`),t.beginPath();for(let e=0;e<6;e++){let n=e*Math.PI/3,r=Math.cos(n)*190,i=Math.sin(n)*190;e===0?t.moveTo(r,i):t.lineTo(r,i)}t.closePath(),t.fillStyle=i,t.shadowColor=`rgba(99, 102, 241, 0.5)`,t.shadowBlur=40,t.fill(),t.restore(),t.save(),t.translate(600,400);let a=t.createLinearGradient(-100,-100,100,100);a.addColorStop(0,`#ffffff`),a.addColorStop(.4,`#a5f3fc`),a.addColorStop(1,`#818cf8`),t.beginPath(),t.moveTo(0,-130),t.lineTo(100,0),t.lineTo(0,130),t.lineTo(-100,0),t.closePath(),t.fillStyle=a,t.shadowColor=`rgba(6, 182, 212, 0.7)`,t.shadowBlur=30,t.fill(),t.beginPath(),t.moveTo(0,-130),t.lineTo(0,130),t.moveTo(-100,0),t.lineTo(100,0),t.strokeStyle=`rgba(255, 255, 255, 0.7)`,t.lineWidth=2.5,t.stroke(),t.restore(),t.font=`bold 36px "Plus Jakarta Sans", sans-serif`,t.fillStyle=`#ffffff`,t.textAlign=`center`,t.shadowColor=`rgba(0, 0, 0, 0.8)`,t.shadowBlur=10,t.fillText(`CREATIVEFORGE AI`,600,620),t.font=`600 16px "Plus Jakarta Sans", sans-serif`,t.fillStyle=`#22d3ee`,t.letterSpacing=`3px`,t.fillText(`STUDIO MASTER ASSET`,600,655);let o=new Image;return o.src=e.toDataURL(`image/png`),{canvas:e,img:o}}var T=o((()=>{})),E,D,O=o((()=>{E=class{constructor(){this.container=null,this.init()}init(){this.container||(this.container=document.createElement(`div`),this.container.className=`toast-container`,document.body.appendChild(this.container))}show(e,t=`info`,n=3500){this.init();let r=document.createElement(`div`);r.className=`toast-item toast-${t}`;let i=``;i=t===`success`?`<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>`:t===`error`?`<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>`:`<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,r.innerHTML=`
      <div style="color: ${t===`success`?`var(--status-success)`:t===`error`?`var(--status-danger)`:`var(--accent-secondary)`}; display:flex;">
        ${i}
      </div>
      <span style="font-weight: 500;">${e}</span>
    `,this.container.appendChild(r),setTimeout(()=>{r.style.opacity=`0`,r.style.transform=`translateY(10px)`,r.style.transition=`all 0.3s ease`,setTimeout(()=>r.remove(),300)},n)}success(e,t){this.show(e,`success`,t)}error(e,t){this.show(e,`error`,t)}info(e,t){this.show(e,`info`,t)}},D=new E})),k,A=o((()=>{k=class e{static async exportWithPpi(e,t=`png`,n=300,r=.95){let i=t===`jpg`||t===`jpeg`?`image/jpeg`:`image/png`,a=await(await new Promise(t=>e.toBlob(t,i,r))).arrayBuffer();if(i===`image/png`){let e=this.embedPngPpi(new Uint8Array(a),n);return new Blob([e],{type:`image/png`})}{let e=this.embedJpegPpi(new Uint8Array(a),n);return new Blob([e],{type:`image/jpeg`})}}static embedPngPpi(e,t=300){let n=Math.round(t/.0254);if(e[0]!==137||e[1]!==80||e[2]!==78||e[3]!==71)return e;let r=16+(e[8]<<24|e[9]<<16|e[10]<<8|e[11])+4,i=new Uint8Array(21),a=new DataView(i.buffer);a.setUint32(0,9),i[4]=112,i[5]=72,i[6]=89,i[7]=115,a.setUint32(8,n),a.setUint32(12,n),i[16]=1;let o=this.crc32(i.subarray(4,17));a.setUint32(17,o);for(let t=r;t<e.length-8;t++)if(e[t]===112&&e[t+1]===72&&e[t+2]===89&&e[t+3]===115){let n=t-4;return e.set(i,n),e}let s=new Uint8Array(e.length+i.length);return s.set(e.subarray(0,r),0),s.set(i,r),s.set(e.subarray(r),r+i.length),s}static embedJpegPpi(e,t=300){if(e[0]!==255||e[1]!==216)return e;if(e[2]===255&&e[3]===224&&e[6]===74&&e[7]===70&&e[8]===73&&e[9]===70&&e[10]===0)return e[13]=1,e[14]=t>>8&255,e[15]=t&255,e[16]=t>>8&255,e[17]=t&255,e;let n=new Uint8Array([255,224,0,16,74,70,73,70,0,1,1,1,t>>8&255,t&255,t>>8&255,t&255,0,0]),r=new Uint8Array(e.length+n.length);return r.set(e.subarray(0,2),0),r.set(n,2),r.set(e.subarray(2),2+n.length),r}static crcTable=(()=>{let e=new Uint32Array(256);for(let t=0;t<256;t++){let n=t;for(let e=0;e<8;e++)n=n&1?3988292384^n>>>1:n>>>1;e[t]=n}return e})();static crc32(t){let n=4294967295,r=e.crcTable;for(let e=0;e<t.length;e++)n=r[(n^t[e])&255]^n>>>8;return(n^4294967295)>>>0}}})),j=s(((e,t)=>{(function(n){typeof e==`object`&&t!==void 0?t.exports=n():typeof define==`function`&&define.amd?define([],n):(typeof window<`u`?window:typeof global<`u`?global:typeof self<`u`?self:this).JSZip=n()})(function(){return function e(t,n,r){function i(o,s){if(!n[o]){if(!t[o]){var c=typeof u==`function`&&u;if(!s&&c)return c(o,!0);if(a)return a(o,!0);var l=Error(`Cannot find module '`+o+`'`);throw l.code=`MODULE_NOT_FOUND`,l}var d=n[o]={exports:{}};t[o][0].call(d.exports,function(e){var n=t[o][1][e];return i(n||e)},d,d.exports,e,t,n,r)}return n[o].exports}for(var a=typeof u==`function`&&u,o=0;o<r.length;o++)i(r[o]);return i}({1:[function(e,t,n){var r=e(`./utils`),i=e(`./support`),a=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=`;n.encode=function(e){for(var t,n,i,o,s,c,l,u=[],d=0,f=e.length,p=f,m=r.getTypeOf(e)!==`string`;d<e.length;)p=f-d,i=m?(t=e[d++],n=d<f?e[d++]:0,d<f?e[d++]:0):(t=e.charCodeAt(d++),n=d<f?e.charCodeAt(d++):0,d<f?e.charCodeAt(d++):0),o=t>>2,s=(3&t)<<4|n>>4,c=1<p?(15&n)<<2|i>>6:64,l=2<p?63&i:64,u.push(a.charAt(o)+a.charAt(s)+a.charAt(c)+a.charAt(l));return u.join(``)},n.decode=function(e){var t,n,r,o,s,c,l=0,u=0,d=`data:`;if(e.substr(0,d.length)===d)throw Error(`Invalid base64 input, it looks like a data url.`);var f,p=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,``)).length/4;if(e.charAt(e.length-1)===a.charAt(64)&&p--,e.charAt(e.length-2)===a.charAt(64)&&p--,p%1!=0)throw Error(`Invalid base64 input, bad content length.`);for(f=i.uint8array?new Uint8Array(0|p):Array(0|p);l<e.length;)t=a.indexOf(e.charAt(l++))<<2|(o=a.indexOf(e.charAt(l++)))>>4,n=(15&o)<<4|(s=a.indexOf(e.charAt(l++)))>>2,r=(3&s)<<6|(c=a.indexOf(e.charAt(l++))),f[u++]=t,s!==64&&(f[u++]=n),c!==64&&(f[u++]=r);return f}},{"./support":30,"./utils":32}],2:[function(e,t,n){var r=e(`./external`),i=e(`./stream/DataWorker`),a=e(`./stream/Crc32Probe`),o=e(`./stream/DataLengthProbe`);function s(e,t,n,r,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=n,this.compression=r,this.compressedContent=i}s.prototype={getContentWorker:function(){var e=new i(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new o(`data_length`)),t=this;return e.on(`end`,function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw Error(`Bug : uncompressed data size mismatch`)}),e},getCompressedWorker:function(){return new i(r.Promise.resolve(this.compressedContent)).withStreamInfo(`compressedSize`,this.compressedSize).withStreamInfo(`uncompressedSize`,this.uncompressedSize).withStreamInfo(`crc32`,this.crc32).withStreamInfo(`compression`,this.compression)}},s.createWorkerFrom=function(e,t,n){return e.pipe(new a).pipe(new o(`uncompressedSize`)).pipe(t.compressWorker(n)).pipe(new o(`compressedSize`)).withStreamInfo(`compression`,t)},t.exports=s},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,n){var r=e(`./stream/GenericWorker`);n.STORE={magic:`\0\0`,compressWorker:function(){return new r(`STORE compression`)},uncompressWorker:function(){return new r(`STORE decompression`)}},n.DEFLATE=e(`./flate`)},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,n){var r=e(`./utils`),i=function(){for(var e,t=[],n=0;n<256;n++){e=n;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t}();t.exports=function(e,t){return e!==void 0&&e.length?r.getTypeOf(e)===`string`?function(e,t,n,r){var a=i,o=r+n;e^=-1;for(var s=r;s<o;s++)e=e>>>8^a[255&(e^t.charCodeAt(s))];return-1^e}(0|t,e,e.length,0):function(e,t,n,r){var a=i,o=r+n;e^=-1;for(var s=r;s<o;s++)e=e>>>8^a[255&(e^t[s])];return-1^e}(0|t,e,e.length,0):0}},{"./utils":32}],5:[function(e,t,n){n.base64=!1,n.binary=!1,n.dir=!1,n.createFolders=!0,n.date=null,n.compression=null,n.compressionOptions=null,n.comment=null,n.unixPermissions=null,n.dosPermissions=null},{}],6:[function(e,t,n){var r=null;r=typeof Promise<`u`?Promise:e(`lie`),t.exports={Promise:r}},{lie:37}],7:[function(e,t,n){var r=typeof Uint8Array<`u`&&typeof Uint16Array<`u`&&typeof Uint32Array<`u`,i=e(`pako`),a=e(`./utils`),o=e(`./stream/GenericWorker`),s=r?`uint8array`:`array`;function c(e,t){o.call(this,`FlateWorker/`+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}n.magic=`\b\0`,a.inherits(c,o),c.prototype.processChunk=function(e){this.meta=e.meta,this._pako===null&&this._createPako(),this._pako.push(a.transformTo(s,e.data),!1)},c.prototype.flush=function(){o.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},c.prototype.cleanUp=function(){o.prototype.cleanUp.call(this),this._pako=null},c.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var e=this;this._pako.onData=function(t){e.push({data:t,meta:e.meta})}},n.compressWorker=function(e){return new c(`Deflate`,e)},n.uncompressWorker=function(){return new c(`Inflate`,{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,n){function r(e,t){var n,r=``;for(n=0;n<t;n++)r+=String.fromCharCode(255&e),e>>>=8;return r}function i(e,t,n,i,o,u){var d,f,p=e.file,m=e.compression,h=u!==s.utf8encode,g=a.transformTo(`string`,u(p.name)),_=a.transformTo(`string`,s.utf8encode(p.name)),v=p.comment,y=a.transformTo(`string`,u(v)),b=a.transformTo(`string`,s.utf8encode(v)),x=_.length!==p.name.length,S=b.length!==v.length,C=``,w=``,T=``,E=p.dir,D=p.date,O={crc32:0,compressedSize:0,uncompressedSize:0};t&&!n||(O.crc32=e.crc32,O.compressedSize=e.compressedSize,O.uncompressedSize=e.uncompressedSize);var k=0;t&&(k|=8),h||!x&&!S||(k|=2048);var A=0,j=0;E&&(A|=16),o===`UNIX`?(j=798,A|=function(e,t){var n=e;return e||(n=t?16893:33204),(65535&n)<<16}(p.unixPermissions,E)):(j=20,A|=function(e){return 63&(e||0)}(p.dosPermissions)),d=D.getUTCHours(),d<<=6,d|=D.getUTCMinutes(),d<<=5,d|=D.getUTCSeconds()/2,f=D.getUTCFullYear()-1980,f<<=4,f|=D.getUTCMonth()+1,f<<=5,f|=D.getUTCDate(),x&&(w=r(1,1)+r(c(g),4)+_,C+=`up`+r(w.length,2)+w),S&&(T=r(1,1)+r(c(y),4)+b,C+=`uc`+r(T.length,2)+T);var M=``;return M+=`
\0`,M+=r(k,2),M+=m.magic,M+=r(d,2),M+=r(f,2),M+=r(O.crc32,4),M+=r(O.compressedSize,4),M+=r(O.uncompressedSize,4),M+=r(g.length,2),M+=r(C.length,2),{fileRecord:l.LOCAL_FILE_HEADER+M+g+C,dirRecord:l.CENTRAL_FILE_HEADER+r(j,2)+M+r(y.length,2)+`\0\0\0\0`+r(A,4)+r(i,4)+g+C+y}}var a=e(`../utils`),o=e(`../stream/GenericWorker`),s=e(`../utf8`),c=e(`../crc32`),l=e(`../signature`);function u(e,t,n,r){o.call(this,`ZipFileWorker`),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=n,this.encodeFileName=r,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}a.inherits(u,o),u.prototype.push=function(e){var t=e.meta.percent||0,n=this.entriesCount,r=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,o.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:n?(t+100*(n-r-1))/n:100}}))},u.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var n=i(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:n.fileRecord,meta:{percent:0}})}else this.accumulate=!0},u.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,n=i(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(n.dirRecord),t)this.push({data:function(e){return l.DATA_DESCRIPTOR+r(e.crc32,4)+r(e.compressedSize,4)+r(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:n.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},u.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var n=this.bytesWritten-e,i=function(e,t,n,i,o){var s=a.transformTo(`string`,o(i));return l.CENTRAL_DIRECTORY_END+`\0\0\0\0`+r(e,2)+r(e,2)+r(t,4)+r(n,4)+r(s.length,2)+s}(this.dirRecords.length,n,e,this.zipComment,this.encodeFileName);this.push({data:i,meta:{percent:100}})},u.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},u.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on(`data`,function(e){t.processChunk(e)}),e.on(`end`,function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on(`error`,function(e){t.error(e)}),this},u.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},u.prototype.error=function(e){var t=this._sources;if(!o.prototype.error.call(this,e))return!1;for(var n=0;n<t.length;n++)try{t[n].error(e)}catch{}return!0},u.prototype.lock=function(){o.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=u},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,n){var r=e(`../compressions`),i=e(`./ZipFileWorker`);n.generateWorker=function(e,t,n){var a=new i(t.streamFiles,n,t.platform,t.encodeFileName),o=0;try{e.forEach(function(e,n){o++;var i=function(e,t){var n=e||t,i=r[n];if(!i)throw Error(n+` is not a valid compression method !`);return i}(n.options.compression,t.compression),s=n.options.compressionOptions||t.compressionOptions||{},c=n.dir,l=n.date;n._compressWorker(i,s).withStreamInfo(`file`,{name:e,dir:c,date:l,comment:n.comment||``,unixPermissions:n.unixPermissions,dosPermissions:n.dosPermissions}).pipe(a)}),a.entriesCount=o}catch(e){a.error(e)}return a}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,n){function r(){if(!(this instanceof r))return new r;if(arguments.length)throw Error(`The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.`);this.files=Object.create(null),this.comment=null,this.root=``,this.clone=function(){var e=new r;for(var t in this)typeof this[t]!=`function`&&(e[t]=this[t]);return e}}(r.prototype=e(`./object`)).loadAsync=e(`./load`),r.support=e(`./support`),r.defaults=e(`./defaults`),r.version=`3.10.2`,r.loadAsync=function(e,t){return new r().loadAsync(e,t)},r.external=e(`./external`),t.exports=r},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,n){var r=e(`./utils`),i=e(`./external`),a=e(`./utf8`),o=e(`./zipEntries`),s=e(`./stream/Crc32Probe`),c=e(`./nodejsUtils`);function l(e){return new i.Promise(function(t,n){var r=e.decompressed.getContentWorker().pipe(new s);r.on(`error`,function(e){n(e)}).on(`end`,function(){r.streamInfo.crc32===e.decompressed.crc32?t():n(Error(`Corrupted zip : CRC32 mismatch`))}).resume()})}t.exports=function(e,t){var n=this;return t=r.extend(t||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:a.utf8decode}),c.isNode&&c.isStream(e)?i.Promise.reject(Error(`JSZip can't accept a stream when loading a zip file.`)):r.prepareContent(`the loaded zip file`,e,!0,t.optimizedBinaryString,t.base64).then(function(e){var n=new o(t);return n.load(e),n}).then(function(e){var n=[i.Promise.resolve(e)],r=e.files;if(t.checkCRC32)for(var a=0;a<r.length;a++)n.push(l(r[a]));return i.Promise.all(n)}).then(function(e){for(var i=e.shift(),a=i.files,o=0;o<a.length;o++){var s=a[o],c=s.fileNameStr,l=r.resolve(s.fileNameStr);n.file(l,s.decompressed,{binary:!0,optimizedBinaryString:!0,date:s.date,dir:s.dir,comment:s.fileCommentStr.length?s.fileCommentStr:null,unixPermissions:s.unixPermissions,dosPermissions:s.dosPermissions,createFolders:t.createFolders}),s.dir||(n.file(l).unsafeOriginalName=c)}return i.zipComment.length&&(n.comment=i.zipComment),n})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,n){var r=e(`../utils`),i=e(`../stream/GenericWorker`);function a(e,t){i.call(this,`Nodejs stream input adapter for `+e),this._upstreamEnded=!1,this._bindStream(t)}r.inherits(a,i),a.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on(`data`,function(e){t.push({data:e,meta:{percent:0}})}).on(`error`,function(e){t.isPaused?this.generatedError=e:t.error(e)}).on(`end`,function(){t.isPaused?t._upstreamEnded=!0:t.end()})},a.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=a},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,n){var r=e(`readable-stream`).Readable;function i(e,t,n){r.call(this,t),this._helper=e;var i=this;e.on(`data`,function(e,t){i.push(e)||i._helper.pause(),n&&n(t)}).on(`error`,function(e){i.emit(`error`,e)}).on(`end`,function(){i.push(null)})}e(`../utils`).inherits(i,r),i.prototype._read=function(){this._helper.resume()},t.exports=i},{"../utils":32,"readable-stream":16}],14:[function(e,t,n){t.exports={isNode:typeof Buffer<`u`,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if(typeof e==`number`)throw Error(`The "data" argument must not be a number`);return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&typeof e.on==`function`&&typeof e.pause==`function`&&typeof e.resume==`function`}}},{}],15:[function(e,t,n){function r(e,t,n){var r,i=a.getTypeOf(t),s=a.extend(n||{},c);s.date=s.date||new Date,s.compression!==null&&(s.compression=s.compression.toUpperCase()),typeof s.unixPermissions==`string`&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=h(e)),s.createFolders&&(r=m(e))&&g.call(this,r,!0);var d=i===`string`&&!1===s.binary&&!1===s.base64;n&&n.binary!==void 0||(s.binary=!d),(t instanceof l&&t.uncompressedSize===0||s.dir||!t||t.length===0)&&(s.base64=!1,s.binary=!0,t=``,s.compression=`STORE`,i=`string`);var _=null;_=t instanceof l||t instanceof o?t:f.isNode&&f.isStream(t)?new p(e,t):a.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var v=new u(e,_,s);this.files[e]=v}var i=e(`./utf8`),a=e(`./utils`),o=e(`./stream/GenericWorker`),s=e(`./stream/StreamHelper`),c=e(`./defaults`),l=e(`./compressedObject`),u=e(`./zipObject`),d=e(`./generate`),f=e(`./nodejsUtils`),p=e(`./nodejs/NodejsStreamInputAdapter`),m=function(e){e.slice(-1)===`/`&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf(`/`);return 0<t?e.substring(0,t):``},h=function(e){return e.slice(-1)!==`/`&&(e+=`/`),e},g=function(e,t){return t=t===void 0?c.createFolders:t,e=h(e),this.files[e]||r.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function _(e){return Object.prototype.toString.call(e)===`[object RegExp]`}t.exports={load:function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},forEach:function(e){var t,n,r;for(t in this.files)r=this.files[t],(n=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(n,r)},filter:function(e){var t=[];return this.forEach(function(n,r){e(n,r)&&t.push(r)}),t},file:function(e,t,n){if(arguments.length!==1)return e=this.root+e,r.call(this,e,t,n),this;if(_(e)){var i=e;return this.filter(function(e,t){return!t.dir&&i.test(e)})}var a=this.files[this.root+e];return a&&!a.dir?a:null},folder:function(e){if(!e)return this;if(_(e))return this.filter(function(t,n){return n.dir&&e.test(t)});var t=this.root+e,n=g.call(this,t),r=this.clone();return r.root=n.name,r},remove:function(e){e=this.root+e;var t=this.files[e];if(t||=(e.slice(-1)!==`/`&&(e+=`/`),this.files[e]),t&&!t.dir)delete this.files[e];else for(var n=this.filter(function(t,n){return n.name.slice(0,e.length)===e}),r=0;r<n.length;r++)delete this.files[n[r].name];return this},generate:function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},generateInternalStream:function(e){var t,n={};try{if((n=a.extend(e||{},{streamFiles:!1,compression:`STORE`,compressionOptions:null,type:``,platform:`DOS`,comment:null,mimeType:`application/zip`,encodeFileName:i.utf8encode})).type=n.type.toLowerCase(),n.compression=n.compression.toUpperCase(),n.type===`binarystring`&&(n.type=`string`),!n.type)throw Error(`No output type specified.`);a.checkSupport(n.type),n.platform!==`darwin`&&n.platform!==`freebsd`&&n.platform!==`linux`&&n.platform!==`sunos`||(n.platform=`UNIX`),n.platform===`win32`&&(n.platform=`DOS`);var r=n.comment||this.comment||``;t=d.generateWorker(this,n,r)}catch(e){(t=new o(`error`)).error(e)}return new s(t,n.type||`string`,n.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e||={}).type||(e.type=`nodebuffer`),this.generateInternalStream(e).toNodejsStream(t)}}},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,n){t.exports=e(`stream`)},{stream:void 0}],17:[function(e,t,n){var r=e(`./DataReader`);function i(e){r.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e(`../utils`).inherits(i,r),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),n=e.charCodeAt(1),r=e.charCodeAt(2),i=e.charCodeAt(3),a=this.length-4;0<=a;--a)if(this.data[a]===t&&this.data[a+1]===n&&this.data[a+2]===r&&this.data[a+3]===i)return a-this.zero;return-1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),n=e.charCodeAt(1),r=e.charCodeAt(2),i=e.charCodeAt(3),a=this.readData(4);return t===a[0]&&n===a[1]&&r===a[2]&&i===a[3]},i.prototype.readData=function(e){if(this.checkOffset(e),e===0)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,t,n){var r=e(`../utils`);function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw Error(`End of data reached (data length = `+this.length+`, asked index = `+e+`). Corrupted zip ?`)},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(){},readInt:function(e){var t,n=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)n=(n<<8)+this.byteAt(t);return this.index+=e,n},readString:function(e){return r.transformTo(`string`,this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i},{"../utils":32}],19:[function(e,t,n){var r=e(`./Uint8ArrayReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,n){var r=e(`./DataReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,t,n){var r=e(`./ArrayReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.readData=function(e){if(this.checkOffset(e),e===0)return new Uint8Array;var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,n){var r=e(`../utils`),i=e(`../support`),a=e(`./ArrayReader`),o=e(`./StringReader`),s=e(`./NodeBufferReader`),c=e(`./Uint8ArrayReader`);t.exports=function(e){var t=r.getTypeOf(e);return r.checkSupport(t),t!==`string`||i.uint8array?t===`nodebuffer`?new s(e):i.uint8array?new c(r.transformTo(`uint8array`,e)):new a(r.transformTo(`array`,e)):new o(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,n){n.LOCAL_FILE_HEADER=`PK`,n.CENTRAL_FILE_HEADER=`PK`,n.CENTRAL_DIRECTORY_END=`PK`,n.ZIP64_CENTRAL_DIRECTORY_LOCATOR=`PK\x07`,n.ZIP64_CENTRAL_DIRECTORY_END=`PK`,n.DATA_DESCRIPTOR=`PK\x07\b`},{}],24:[function(e,t,n){var r=e(`./GenericWorker`),i=e(`../utils`);function a(e){r.call(this,`ConvertWorker to `+e),this.destType=e}i.inherits(a,r),a.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta})},t.exports=a},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,n){var r=e(`./GenericWorker`),i=e(`../crc32`);function a(){r.call(this,`Crc32Probe`),this.withStreamInfo(`crc32`,0)}e(`../utils`).inherits(a,r),a.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=a},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,n){var r=e(`../utils`),i=e(`./GenericWorker`);function a(e){i.call(this,`DataLengthProbe for `+e),this.propName=e,this.withStreamInfo(e,0)}r.inherits(a,i),a.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}i.prototype.processChunk.call(this,e)},t.exports=a},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,n){var r=e(`../utils`),i=e(`./GenericWorker`);function a(e){i.call(this,`DataWorker`);var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type=``,this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=r.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}r.inherits(a,i),a.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},a.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,r.delay(this._tickAndRepeat,[],this)),!0)},a.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(r.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},a.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case`string`:e=this.data.substring(this.index,t);break;case`uint8array`:e=this.data.subarray(this.index,t);break;case`array`:case`nodebuffer`:e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=a},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,n){function r(e){this.name=e||`default`,this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}r.prototype={push:function(e){this.emit(`data`,e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit(`end`),this.cleanUp(),this.isFinished=!0}catch(e){this.emit(`error`,e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit(`error`,e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var n=0;n<this._listeners[e].length;n++)this._listeners[e][n].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw Error(`The stream '`+this+`' has already been used.`);this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on(`data`,function(e){t.processChunk(e)}),e.on(`end`,function(){t.end()}),e.on(`error`,function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw Error(`The stream '`+this+`' has already been used.`);this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e=`Worker `+this.name;return this.previous?this.previous+` -> `+e:e}},t.exports=r},{}],29:[function(e,t,n){var r=e(`../utils`),i=e(`./ConvertWorker`),a=e(`./GenericWorker`),o=e(`../base64`),s=e(`../support`),c=e(`../external`),l=null;if(s.nodestream)try{l=e(`../nodejs/NodejsStreamOutputAdapter`)}catch{}function u(e,t){return new c.Promise(function(n,i){var a=[],s=e._internalType,c=e._outputType,l=e._mimeType;e.on(`data`,function(e,n){a.push(e),t&&t(n)}).on(`error`,function(e){a=[],i(e)}).on(`end`,function(){try{n(function(e,t,n){switch(e){case`blob`:return r.newBlob(r.transformTo(`arraybuffer`,t),n);case`base64`:return o.encode(t);default:return r.transformTo(e,t)}}(c,function(e,t){var n,r=0,i=null,a=0;for(n=0;n<t.length;n++)a+=t[n].length;switch(e){case`string`:return t.join(``);case`array`:return Array.prototype.concat.apply([],t);case`uint8array`:for(i=new Uint8Array(a),n=0;n<t.length;n++)i.set(t[n],r),r+=t[n].length;return i;case`nodebuffer`:return Buffer.concat(t);default:throw Error(`concat : unsupported type '`+e+`'`)}}(s,a),l))}catch(e){i(e)}a=[]}).resume()})}function d(e,t,n){var o=t;switch(t){case`blob`:case`arraybuffer`:o=`uint8array`;break;case`base64`:o=`string`}try{this._internalType=o,this._outputType=t,this._mimeType=n,r.checkSupport(o),this._worker=e.pipe(new i(o)),e.lock()}catch(e){this._worker=new a(`error`),this._worker.error(e)}}d.prototype={accumulate:function(e){return u(this,e)},on:function(e,t){var n=this;return e===`data`?this._worker.on(e,function(e){t.call(n,e.data,e.meta)}):this._worker.on(e,function(){r.delay(t,arguments,n)}),this},resume:function(){return r.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(r.checkSupport(`nodestream`),this._outputType!==`nodebuffer`)throw Error(this._outputType+` is not supported by this method`);return new l(this,{objectMode:this._outputType!==`nodebuffer`},e)}},t.exports=d},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,n){if(n.base64=!0,n.array=!0,n.string=!0,n.arraybuffer=typeof ArrayBuffer<`u`&&typeof Uint8Array<`u`,n.nodebuffer=typeof Buffer<`u`,n.uint8array=typeof Uint8Array<`u`,typeof ArrayBuffer>`u`)n.blob=!1;else{var r=new ArrayBuffer(0);try{n.blob=new Blob([r],{type:`application/zip`}).size===0}catch{try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(r),n.blob=i.getBlob(`application/zip`).size===0}catch{n.blob=!1}}}try{n.nodestream=!!e(`readable-stream`).Readable}catch{n.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,n){for(var r=e(`./utils`),i=e(`./support`),a=e(`./nodejsUtils`),o=e(`./stream/GenericWorker`),s=Array(256),c=0;c<256;c++)s[c]=252<=c?6:248<=c?5:240<=c?4:224<=c?3:192<=c?2:1;s[254]=s[254]=1;function l(){o.call(this,`utf-8 decode`),this.leftOver=null}function u(){o.call(this,`utf-8 encode`)}n.utf8encode=function(e){return i.nodebuffer?a.newBufferFrom(e,`utf-8`):function(e){var t,n,r,a,o,s=e.length,c=0;for(a=0;a<s;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(r=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(r-56320),a++),c+=n<128?1:n<2048?2:n<65536?3:4;for(t=i.uint8array?new Uint8Array(c):Array(c),a=o=0;o<c;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(r=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(r-56320),a++),n<128?t[o++]=n:(n<2048?t[o++]=192|n>>>6:(n<65536?t[o++]=224|n>>>12:(t[o++]=240|n>>>18,t[o++]=128|n>>>12&63),t[o++]=128|n>>>6&63),t[o++]=128|63&n);return t}(e)},n.utf8decode=function(e){return i.nodebuffer?r.transformTo(`nodebuffer`,e).toString(`utf-8`):function(e){var t,n,i,a,o=e.length,c=Array(2*o);for(t=n=0;t<o;)if((i=e[t++])<128)c[n++]=i;else if(4<(a=s[i]))c[n++]=65533,t+=a-1;else{for(i&=a===2?31:a===3?15:7;1<a&&t<o;)i=i<<6|63&e[t++],a--;1<a?c[n++]=65533:i<65536?c[n++]=i:(i-=65536,c[n++]=55296|i>>10&1023,c[n++]=56320|1023&i)}return c.length!==n&&(c.subarray?c=c.subarray(0,n):c.length=n),r.applyFromCharCode(c)}(e=r.transformTo(i.uint8array?`uint8array`:`array`,e))},r.inherits(l,o),l.prototype.processChunk=function(e){var t=r.transformTo(i.uint8array?`uint8array`:`array`,e.data);if(this.leftOver&&this.leftOver.length){if(i.uint8array){var a=t;(t=new Uint8Array(a.length+this.leftOver.length)).set(this.leftOver,0),t.set(a,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var o=function(e,t){var n;for((t||=e.length)>e.length&&(t=e.length),n=t-1;0<=n&&(192&e[n])==128;)n--;return n<0||n===0?t:n+s[e[n]]>t?n:t}(t),c=t;o!==t.length&&(i.uint8array?(c=t.subarray(0,o),this.leftOver=t.subarray(o,t.length)):(c=t.slice(0,o),this.leftOver=t.slice(o,t.length))),this.push({data:n.utf8decode(c),meta:e.meta})},l.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:n.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},n.Utf8DecodeWorker=l,r.inherits(u,o),u.prototype.processChunk=function(e){this.push({data:n.utf8encode(e.data),meta:e.meta})},n.Utf8EncodeWorker=u},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,n){var r=e(`./support`),i=e(`./base64`),a=e(`./nodejsUtils`),o=e(`./external`);function s(e){return e}function c(e,t){for(var n=0;n<e.length;++n)t[n]=255&e.charCodeAt(n);return t}e(`setimmediate`),n.newBlob=function(e,t){n.checkSupport(`blob`);try{return new Blob([e],{type:t})}catch{try{var r=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return r.append(e),r.getBlob(t)}catch{throw Error(`Bug : can't construct the Blob.`)}}};var l={stringifyByChunk:function(e,t,n){var r=[],i=0,a=e.length;if(a<=n)return String.fromCharCode.apply(null,e);for(;i<a;)t===`array`||t===`nodebuffer`?r.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+n,a)))):r.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+n,a)))),i+=n;return r.join(``)},stringifyByChar:function(e){for(var t=``,n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t},applyCanBeUsed:{uint8array:function(){try{return r.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return r.nodebuffer&&String.fromCharCode.apply(null,a.allocBuffer(1)).length===1}catch{return!1}}()}};function u(e){var t=65536,r=n.getTypeOf(e),i=!0;if(r===`uint8array`?i=l.applyCanBeUsed.uint8array:r===`nodebuffer`&&(i=l.applyCanBeUsed.nodebuffer),i)for(;1<t;)try{return l.stringifyByChunk(e,r,t)}catch{t=Math.floor(t/2)}return l.stringifyByChar(e)}function d(e,t){for(var n=0;n<e.length;n++)t[n]=e[n];return t}n.applyFromCharCode=u;var f={};f.string={string:s,array:function(e){return c(e,Array(e.length))},arraybuffer:function(e){return f.string.uint8array(e).buffer},uint8array:function(e){return c(e,new Uint8Array(e.length))},nodebuffer:function(e){return c(e,a.allocBuffer(e.length))}},f.array={string:u,array:s,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return a.newBufferFrom(e)}},f.arraybuffer={string:function(e){return u(new Uint8Array(e))},array:function(e){return d(new Uint8Array(e),Array(e.byteLength))},arraybuffer:s,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return a.newBufferFrom(new Uint8Array(e))}},f.uint8array={string:u,array:function(e){return d(e,Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:s,nodebuffer:function(e){return a.newBufferFrom(e)}},f.nodebuffer={string:u,array:function(e){return d(e,Array(e.length))},arraybuffer:function(e){return f.nodebuffer.uint8array(e).buffer},uint8array:function(e){return d(e,new Uint8Array(e.length))},nodebuffer:s},n.transformTo=function(e,t){return t||=``,e?(n.checkSupport(e),f[n.getTypeOf(t)][e](t)):t},n.resolve=function(e){for(var t=e.split(`/`),n=[],r=0;r<t.length;r++){var i=t[r];i===`.`||i===``&&r!==0&&r!==t.length-1||(i===`..`?n.pop():n.push(i))}return n.join(`/`)},n.getTypeOf=function(e){if(typeof e==`string`)return`string`;var t=Object.prototype.toString.call(e);return t===`[object Array]`?`array`:r.nodebuffer&&a.isBuffer(e)?`nodebuffer`:r.uint8array&&t===`[object Uint8Array]`?`uint8array`:r.arraybuffer&&t===`[object ArrayBuffer]`?`arraybuffer`:void 0},n.checkSupport=function(e){if(!r[e.toLowerCase()])throw Error(e+` is not supported by this platform`)},n.MAX_VALUE_16BITS=65535,n.MAX_VALUE_32BITS=-1,n.pretty=function(e){var t,n,r=``;for(n=0;n<(e||``).length;n++)r+=`\\x`+((t=e.charCodeAt(n))<16?`0`:``)+t.toString(16).toUpperCase();return r},n.delay=function(e,t,n){setImmediate(function(){e.apply(n||null,t||[])})},n.inherits=function(e,t){function n(){}n.prototype=t.prototype,e.prototype=new n},n.extend=function(){var e,t,n={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&n[t]===void 0&&(n[t]=arguments[e][t]);return n},n.prepareContent=function(e,t,a,s,l){return o.Promise.resolve(t).then(function(t){return r.blob&&(t instanceof Blob||[`[object File]`,`[object Blob]`].indexOf(Object.prototype.toString.call(t))!==-1)?Blob.prototype.arrayBuffer===void 0?typeof FileReader<`u`?new o.Promise(function(e,n){var r=new FileReader;r.onload=function(t){e(t.target.result)},r.onerror=function(e){n(e.target.error)},r.readAsArrayBuffer(t)}):o.Promise.reject(Error(e+` is a Blob, but we have no way of reading it.`)):t.arrayBuffer():t}).then(function(t){var u=n.getTypeOf(t);return u?(u===`arraybuffer`?t=n.transformTo(`uint8array`,t):u===`string`&&(l?t=i.decode(t):a&&!0!==s&&(t=function(e){return c(e,r.uint8array?new Uint8Array(e.length):Array(e.length))}(t))),t):o.Promise.reject(Error(`Can't read the data of '`+e+`'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?`))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,n){var r=e(`./reader/readerFor`),i=e(`./utils`),a=e(`./signature`),o=e(`./zipEntry`),s=e(`./support`);function c(e){this.files=[],this.loadOptions=e}c.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw Error(`Corrupted zip or bug: unexpected signature (`+i.pretty(t)+`, expected `+i.pretty(e)+`)`)}},isSignature:function(e,t){var n=this.reader.index;this.reader.setIndex(e);var r=this.reader.readString(4)===t;return this.reader.setIndex(n),r},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=s.uint8array?`uint8array`:`array`,n=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(n)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,n,r=this.zip64EndOfCentralSize-44;0<r;)e=this.reader.readInt(2),t=this.reader.readInt(4),n=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:n}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw Error(`Multi-volumes zip are not supported`)},readLocalFiles:function(){for(var e=0,t;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(a.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);)(e=new o({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw Error(`Corrupted zip or bug: expected `+this.centralDirRecords+` records in central dir, got `+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);if(e<0)throw this.isSignature(0,a.LOCAL_FILE_HEADER)?Error(`Corrupted zip: can't find end of central directory`):Error(`Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html`);this.reader.setIndex(e);var t=e;if(this.checkSignature(a.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw Error(`Corrupted zip: can't find the ZIP64 end of central directory locator`);if(this.reader.setIndex(e),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,a.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw Error(`Corrupted zip: can't find the ZIP64 end of central directory`);this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var n=this.centralDirOffset+this.centralDirSize;this.zip64&&(n+=20,n+=12+this.zip64EndOfCentralSize);var r=t-n;if(0<r)this.isSignature(t,a.CENTRAL_FILE_HEADER)||(this.reader.zero=r);else if(r<0)throw Error(`Corrupted zip: missing `+Math.abs(r)+` bytes.`)},prepareReader:function(e){this.reader=r(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=c},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,n){var r=e(`./reader/readerFor`),i=e(`./utils`),a=e(`./compressedObject`),o=e(`./crc32`),s=e(`./utf8`),c=e(`./compressions`),l=e(`./support`);function u(e,t){this.options=e,this.loadOptions=t}u.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(e){var t,n;if(e.skip(22),this.fileNameLength=e.readInt(2),n=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(n),this.compressedSize===-1||this.uncompressedSize===-1)throw Error(`Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)`);if((t=function(e){for(var t in c)if(Object.prototype.hasOwnProperty.call(c,t)&&c[t].magic===e)return c[t];return null}(this.compressionMethod))===null)throw Error(`Corrupted zip : compression `+i.pretty(this.compressionMethod)+` unknown (inner file : `+i.transformTo(`string`,this.fileName)+`)`);this.decompressed=new a(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw Error(`Encrypted zip are not supported`);e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),e==0&&(this.dosPermissions=63&this.externalFileAttributes),e==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!==`/`||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=r(this.extraFields[1].value);this.uncompressedSize===i.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===i.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===i.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===i.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(e){var t,n,r,i=e.index+this.extraFieldsLength;for(this.extraFields||={};e.index+4<i;)t=e.readInt(2),n=e.readInt(2),r=e.readData(n),this.extraFields[t]={id:t,length:n,value:r};e.setIndex(i)},handleUTF8:function(){var e=l.uint8array?`uint8array`:`array`;if(this.useUTF8())this.fileNameStr=s.utf8decode(this.fileName),this.fileCommentStr=s.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(t!==null)this.fileNameStr=t;else{var n=i.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(n)}var r=this.findExtraFieldUnicodeComment();if(r!==null)this.fileCommentStr=r;else{var a=i.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(a)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=r(e.value);return t.readInt(1)===1&&o(this.fileName)===t.readInt(4)?s.utf8decode(t.readData(e.length-5)):null}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=r(e.value);return t.readInt(1)===1&&o(this.fileComment)===t.readInt(4)?s.utf8decode(t.readData(e.length-5)):null}return null}},t.exports=u},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,n){function r(e,t,n){this.name=e,this.dir=n.dir,this.date=n.date,this.comment=n.comment,this.unixPermissions=n.unixPermissions,this.dosPermissions=n.dosPermissions,this._data=t,this._dataBinary=n.binary,this.options={compression:n.compression,compressionOptions:n.compressionOptions}}var i=e(`./stream/StreamHelper`),a=e(`./stream/DataWorker`),o=e(`./utf8`),s=e(`./compressedObject`),c=e(`./stream/GenericWorker`);r.prototype={internalStream:function(e){var t=null,n=`string`;try{if(!e)throw Error(`No output type specified.`);var r=(n=e.toLowerCase())===`string`||n===`text`;n!==`binarystring`&&n!==`text`||(n=`string`),t=this._decompressWorker();var a=!this._dataBinary;a&&!r&&(t=t.pipe(new o.Utf8EncodeWorker)),!a&&r&&(t=t.pipe(new o.Utf8DecodeWorker))}catch(e){(t=new c(`error`)).error(e)}return new i(t,n,``)},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||`nodebuffer`).toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof s&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var n=this._decompressWorker();return this._dataBinary||(n=n.pipe(new o.Utf8EncodeWorker)),s.createWorkerFrom(n,e,t)},_decompressWorker:function(){return this._data instanceof s?this._data.getContentWorker():this._data instanceof c?this._data:new a(this._data)}};for(var l=[`asText`,`asBinary`,`asNodeBuffer`,`asUint8Array`,`asArrayBuffer`],u=function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},d=0;d<l.length;d++)r.prototype[l[d]]=u;t.exports=r},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,t,n){(function(e){var n,r,i=e.MutationObserver||e.WebKitMutationObserver;if(i){var a=0,o=new i(u),s=e.document.createTextNode(``);o.observe(s,{characterData:!0}),n=function(){s.data=a=++a%2}}else if(e.setImmediate||e.MessageChannel===void 0)n=`document`in e&&`onreadystatechange`in e.document.createElement(`script`)?function(){var t=e.document.createElement(`script`);t.onreadystatechange=function(){u(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(u,0)};else{var c=new e.MessageChannel;c.port1.onmessage=u,n=function(){c.port2.postMessage(0)}}var l=[];function u(){var e,t;r=!0;for(var n=l.length;n;){for(t=l,l=[],e=-1;++e<n;)t[e]();n=l.length}r=!1}t.exports=function(e){l.push(e)!==1||r||n()}}).call(this,typeof global<`u`?global:typeof self<`u`?self:typeof window<`u`?window:{})},{}],37:[function(e,t,n){var r=e(`immediate`);function i(){}var a={},o=[`REJECTED`],s=[`FULFILLED`],c=[`PENDING`];function l(e){if(typeof e!=`function`)throw TypeError(`resolver must be a function`);this.state=c,this.queue=[],this.outcome=void 0,e!==i&&p(this,e)}function u(e,t,n){this.promise=e,typeof t==`function`&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),typeof n==`function`&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}function d(e,t,n){r(function(){var r;try{r=t(n)}catch(t){return a.reject(e,t)}r===e?a.reject(e,TypeError(`Cannot resolve promise with itself`)):a.resolve(e,r)})}function f(e){var t=e&&e.then;if(e&&(typeof e==`object`||typeof e==`function`)&&typeof t==`function`)return function(){t.apply(e,arguments)}}function p(e,t){var n=!1;function r(t){n||(n=!0,a.reject(e,t))}function i(t){n||(n=!0,a.resolve(e,t))}var o=m(function(){t(i,r)});o.status===`error`&&r(o.value)}function m(e,t){var n={};try{n.value=e(t),n.status=`success`}catch(e){n.status=`error`,n.value=e}return n}(t.exports=l).prototype.finally=function(e){if(typeof e!=`function`)return this;var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n})},function(n){return t.resolve(e()).then(function(){throw n})})},l.prototype.catch=function(e){return this.then(null,e)},l.prototype.then=function(e,t){if(typeof e!=`function`&&this.state===s||typeof t!=`function`&&this.state===o)return this;var n=new this.constructor(i);return this.state===c?this.queue.push(new u(n,e,t)):d(n,this.state===s?e:t,this.outcome),n},u.prototype.callFulfilled=function(e){a.resolve(this.promise,e)},u.prototype.otherCallFulfilled=function(e){d(this.promise,this.onFulfilled,e)},u.prototype.callRejected=function(e){a.reject(this.promise,e)},u.prototype.otherCallRejected=function(e){d(this.promise,this.onRejected,e)},a.resolve=function(e,t){var n=m(f,t);if(n.status===`error`)return a.reject(e,n.value);var r=n.value;if(r)p(e,r);else{e.state=s,e.outcome=t;for(var i=-1,o=e.queue.length;++i<o;)e.queue[i].callFulfilled(t)}return e},a.reject=function(e,t){e.state=o,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e},l.resolve=function(e){return e instanceof this?e:a.resolve(new this(i),e)},l.reject=function(e){var t=new this(i);return a.reject(t,e)},l.all=function(e){var t=this;if(Object.prototype.toString.call(e)!==`[object Array]`)return this.reject(TypeError(`must be an array`));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var o=Array(n),s=0,c=-1,l=new this(i);++c<n;)u(e[c],c);return l;function u(e,i){t.resolve(e).then(function(e){o[i]=e,++s!==n||r||(r=!0,a.resolve(l,o))},function(e){r||(r=!0,a.reject(l,e))})}},l.race=function(e){var t=this;if(Object.prototype.toString.call(e)!==`[object Array]`)return this.reject(TypeError(`must be an array`));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var o=-1,s=new this(i);++o<n;)c=e[o],t.resolve(c).then(function(e){r||(r=!0,a.resolve(s,e))},function(e){r||(r=!0,a.reject(s,e))});var c;return s}},{immediate:36}],38:[function(e,t,n){var r={};(0,e(`./lib/utils/common`).assign)(r,e(`./lib/deflate`),e(`./lib/inflate`),e(`./lib/zlib/constants`)),t.exports=r},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,n){var r=e(`./zlib/deflate`),i=e(`./utils/common`),a=e(`./utils/strings`),o=e(`./zlib/messages`),s=e(`./zlib/zstream`),c=Object.prototype.toString,l=0,u=-1,d=0,f=8;function p(e){if(!(this instanceof p))return new p(e);this.options=i.assign({level:u,method:f,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:``},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg=``,this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var n=r.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(n!==l)throw Error(o[n]);if(t.header&&r.deflateSetHeader(this.strm,t.header),t.dictionary){var m=typeof t.dictionary==`string`?a.string2buf(t.dictionary):c.call(t.dictionary)===`[object ArrayBuffer]`?new Uint8Array(t.dictionary):t.dictionary;if((n=r.deflateSetDictionary(this.strm,m))!==l)throw Error(o[n]);this._dict_set=!0}}function m(e,t){var n=new p(t);if(n.push(e,!0),n.err)throw n.msg||o[n.err];return n.result}p.prototype.push=function(e,t){var n,o,s=this.strm,u=this.options.chunkSize;if(this.ended)return!1;o=t===~~t?t:!0===t?4:0,s.input=typeof e==`string`?a.string2buf(e):c.call(e)===`[object ArrayBuffer]`?new Uint8Array(e):e,s.next_in=0,s.avail_in=s.input.length;do{if(s.avail_out===0&&(s.output=new i.Buf8(u),s.next_out=0,s.avail_out=u),(n=r.deflate(s,o))!==1&&n!==l)return this.onEnd(n),!(this.ended=!0);s.avail_out!==0&&(s.avail_in!==0||o!==4&&o!==2)||(this.options.to===`string`?this.onData(a.buf2binstring(i.shrinkBuf(s.output,s.next_out))):this.onData(i.shrinkBuf(s.output,s.next_out)))}while((0<s.avail_in||s.avail_out===0)&&n!==1);return o===4?(n=r.deflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===l):o!==2||(this.onEnd(l),!(s.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){e===l&&(this.result=this.options.to===`string`?this.chunks.join(``):i.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},n.Deflate=p,n.deflate=m,n.deflateRaw=function(e,t){return(t||={}).raw=!0,m(e,t)},n.gzip=function(e,t){return(t||={}).gzip=!0,m(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,n){var r=e(`./zlib/inflate`),i=e(`./utils/common`),a=e(`./utils/strings`),o=e(`./zlib/constants`),s=e(`./zlib/messages`),c=e(`./zlib/zstream`),l=e(`./zlib/gzheader`),u=Object.prototype.toString;function d(e){if(!(this instanceof d))return new d(e);this.options=i.assign({chunkSize:16384,windowBits:0,to:``},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,t.windowBits===0&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&!(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg=``,this.ended=!1,this.chunks=[],this.strm=new c,this.strm.avail_out=0;var n=r.inflateInit2(this.strm,t.windowBits);if(n!==o.Z_OK)throw Error(s[n]);this.header=new l,r.inflateGetHeader(this.strm,this.header)}function f(e,t){var n=new d(t);if(n.push(e,!0),n.err)throw n.msg||s[n.err];return n.result}d.prototype.push=function(e,t){var n,s,c,l,d,f,p=this.strm,m=this.options.chunkSize,h=this.options.dictionary,g=!1;if(this.ended)return!1;s=t===~~t?t:!0===t?o.Z_FINISH:o.Z_NO_FLUSH,p.input=typeof e==`string`?a.binstring2buf(e):u.call(e)===`[object ArrayBuffer]`?new Uint8Array(e):e,p.next_in=0,p.avail_in=p.input.length;do{if(p.avail_out===0&&(p.output=new i.Buf8(m),p.next_out=0,p.avail_out=m),(n=r.inflate(p,o.Z_NO_FLUSH))===o.Z_NEED_DICT&&h&&(f=typeof h==`string`?a.string2buf(h):u.call(h)===`[object ArrayBuffer]`?new Uint8Array(h):h,n=r.inflateSetDictionary(this.strm,f)),n===o.Z_BUF_ERROR&&!0===g&&(n=o.Z_OK,g=!1),n!==o.Z_STREAM_END&&n!==o.Z_OK)return this.onEnd(n),!(this.ended=!0);p.next_out&&(p.avail_out!==0&&n!==o.Z_STREAM_END&&(p.avail_in!==0||s!==o.Z_FINISH&&s!==o.Z_SYNC_FLUSH)||(this.options.to===`string`?(c=a.utf8border(p.output,p.next_out),l=p.next_out-c,d=a.buf2string(p.output,c),p.next_out=l,p.avail_out=m-l,l&&i.arraySet(p.output,p.output,c,l,0),this.onData(d)):this.onData(i.shrinkBuf(p.output,p.next_out)))),p.avail_in===0&&p.avail_out===0&&(g=!0)}while((0<p.avail_in||p.avail_out===0)&&n!==o.Z_STREAM_END);return n===o.Z_STREAM_END&&(s=o.Z_FINISH),s===o.Z_FINISH?(n=r.inflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===o.Z_OK):s!==o.Z_SYNC_FLUSH||(this.onEnd(o.Z_OK),!(p.avail_out=0))},d.prototype.onData=function(e){this.chunks.push(e)},d.prototype.onEnd=function(e){e===o.Z_OK&&(this.result=this.options.to===`string`?this.chunks.join(``):i.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},n.Inflate=d,n.inflate=f,n.inflateRaw=function(e,t){return(t||={}).raw=!0,f(e,t)},n.ungzip=f},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,n){var r=typeof Uint8Array<`u`&&typeof Uint16Array<`u`&&typeof Int32Array<`u`;n.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var n=t.shift();if(n){if(typeof n!=`object`)throw TypeError(n+`must be non-object`);for(var r in n)n.hasOwnProperty(r)&&(e[r]=n[r])}}return e},n.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,n,r,i){if(t.subarray&&e.subarray)e.set(t.subarray(n,n+r),i);else for(var a=0;a<r;a++)e[i+a]=t[n+a]},flattenChunks:function(e){for(var t=r=0,n=e.length,r,i,a,o;t<n;t++)r+=e[t].length;for(o=new Uint8Array(r),t=i=0,n=e.length;t<n;t++)a=e[t],o.set(a,i),i+=a.length;return o}},a={arraySet:function(e,t,n,r,i){for(var a=0;a<r;a++)e[i+a]=t[n+a]},flattenChunks:function(e){return[].concat.apply([],e)}};n.setTyped=function(e){e?(n.Buf8=Uint8Array,n.Buf16=Uint16Array,n.Buf32=Int32Array,n.assign(n,i)):(n.Buf8=Array,n.Buf16=Array,n.Buf32=Array,n.assign(n,a))},n.setTyped(r)},{}],42:[function(e,t,n){var r=e(`./common`),i=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch{i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{a=!1}for(var o=new r.Buf8(256),s=0;s<256;s++)o[s]=252<=s?6:248<=s?5:240<=s?4:224<=s?3:192<=s?2:1;function c(e,t){if(t<65537&&(e.subarray&&a||!e.subarray&&i))return String.fromCharCode.apply(null,r.shrinkBuf(e,t));for(var n=``,o=0;o<t;o++)n+=String.fromCharCode(e[o]);return n}o[254]=o[254]=1,n.string2buf=function(e){var t,n,i,a,o,s=e.length,c=0;for(a=0;a<s;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(i=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(i-56320),a++),c+=n<128?1:n<2048?2:n<65536?3:4;for(t=new r.Buf8(c),a=o=0;o<c;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(i=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(i-56320),a++),n<128?t[o++]=n:(n<2048?t[o++]=192|n>>>6:(n<65536?t[o++]=224|n>>>12:(t[o++]=240|n>>>18,t[o++]=128|n>>>12&63),t[o++]=128|n>>>6&63),t[o++]=128|63&n);return t},n.buf2binstring=function(e){return c(e,e.length)},n.binstring2buf=function(e){for(var t=new r.Buf8(e.length),n=0,i=t.length;n<i;n++)t[n]=e.charCodeAt(n);return t},n.buf2string=function(e,t){var n,r,i,a,s=t||e.length,l=Array(2*s);for(n=r=0;n<s;)if((i=e[n++])<128)l[r++]=i;else if(4<(a=o[i]))l[r++]=65533,n+=a-1;else{for(i&=a===2?31:a===3?15:7;1<a&&n<s;)i=i<<6|63&e[n++],a--;1<a?l[r++]=65533:i<65536?l[r++]=i:(i-=65536,l[r++]=55296|i>>10&1023,l[r++]=56320|1023&i)}return c(l,r)},n.utf8border=function(e,t){var n;for((t||=e.length)>e.length&&(t=e.length),n=t-1;0<=n&&(192&e[n])==128;)n--;return n<0||n===0?t:n+o[e[n]]>t?n:t}},{"./common":41}],43:[function(e,t,n){t.exports=function(e,t,n,r){for(var i=65535&e|0,a=e>>>16&65535|0,o=0;n!==0;){for(n-=o=2e3<n?2e3:n;a=a+(i=i+t[r++]|0)|0,--o;);i%=65521,a%=65521}return i|a<<16|0}},{}],44:[function(e,t,n){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,n){var r=function(){for(var e,t=[],n=0;n<256;n++){e=n;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t}();t.exports=function(e,t,n,i){var a=r,o=i+n;e^=-1;for(var s=i;s<o;s++)e=e>>>8^a[255&(e^t[s])];return-1^e}},{}],46:[function(e,t,n){var r,i=e(`../utils/common`),a=e(`./trees`),o=e(`./adler32`),s=e(`./crc32`),c=e(`./messages`),l=0,u=4,d=0,f=-2,p=-1,m=4,h=2,g=8,_=9,v=286,y=30,b=19,x=2*v+1,S=15,C=3,w=258,T=w+C+1,E=42,D=113,O=1,k=2,A=3,j=4;function M(e,t){return e.msg=c[t],t}function N(e){return(e<<1)-(4<e?9:0)}function P(e){for(var t=e.length;0<=--t;)e[t]=0}function F(e){var t=e.state,n=t.pending;n>e.avail_out&&(n=e.avail_out),n!==0&&(i.arraySet(e.output,t.pending_buf,t.pending_out,n,e.next_out),e.next_out+=n,t.pending_out+=n,e.total_out+=n,e.avail_out-=n,t.pending-=n,t.pending===0&&(t.pending_out=0))}function I(e,t){a._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm)}function L(e,t){e.pending_buf[e.pending++]=t}function R(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function z(e,t){var n,r,i=e.max_chain_length,a=e.strstart,o=e.prev_length,s=e.nice_match,c=e.strstart>e.w_size-T?e.strstart-(e.w_size-T):0,l=e.window,u=e.w_mask,d=e.prev,f=e.strstart+w,p=l[a+o-1],m=l[a+o];e.prev_length>=e.good_match&&(i>>=2),s>e.lookahead&&(s=e.lookahead);do if(l[(n=t)+o]===m&&l[n+o-1]===p&&l[n]===l[a]&&l[++n]===l[a+1]){a+=2,n++;do;while(l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&a<f);if(r=w-(f-a),a=f-w,o<r){if(e.match_start=t,s<=(o=r))break;p=l[a+o-1],m=l[a+o]}}while((t=d[t&u])>c&&--i!=0);return o<=e.lookahead?o:e.lookahead}function B(e){var t,n,r,a,c,l,u,d,f,p,m=e.w_size;do{if(a=e.window_size-e.lookahead-e.strstart,e.strstart>=m+(m-T)){for(i.arraySet(e.window,e.window,m,m,0),e.match_start-=m,e.strstart-=m,e.block_start-=m,t=n=e.hash_size;r=e.head[--t],e.head[t]=m<=r?r-m:0,--n;);for(t=n=m;r=e.prev[--t],e.prev[t]=m<=r?r-m:0,--n;);a+=m}if(e.strm.avail_in===0)break;if(l=e.strm,u=e.window,d=e.strstart+e.lookahead,f=a,p=void 0,p=l.avail_in,f<p&&(p=f),n=p===0?0:(l.avail_in-=p,i.arraySet(u,l.input,l.next_in,p,d),l.state.wrap===1?l.adler=o(l.adler,u,p,d):l.state.wrap===2&&(l.adler=s(l.adler,u,p,d)),l.next_in+=p,l.total_in+=p,p),e.lookahead+=n,e.lookahead+e.insert>=C)for(c=e.strstart-e.insert,e.ins_h=e.window[c],e.ins_h=(e.ins_h<<e.hash_shift^e.window[c+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[c+C-1])&e.hash_mask,e.prev[c&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=c,c++,e.insert--,!(e.lookahead+e.insert<C)););}while(e.lookahead<T&&e.strm.avail_in!==0)}function V(e,t){for(var n,r;;){if(e.lookahead<T){if(B(e),e.lookahead<T&&t===l)return O;if(e.lookahead===0)break}if(n=0,e.lookahead>=C&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),n!==0&&e.strstart-n<=e.w_size-T&&(e.match_length=z(e,n)),e.match_length>=C){if(r=a._tr_tally(e,e.strstart-e.match_start,e.match_length-C),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=C){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,--e.match_length!=0;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask}else r=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(r&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=e.strstart<C-1?e.strstart:C-1,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}function H(e,t){for(var n,r,i;;){if(e.lookahead<T){if(B(e),e.lookahead<T&&t===l)return O;if(e.lookahead===0)break}if(n=0,e.lookahead>=C&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=C-1,n!==0&&e.prev_length<e.max_lazy_match&&e.strstart-n<=e.w_size-T&&(e.match_length=z(e,n),e.match_length<=5&&(e.strategy===1||e.match_length===C&&4096<e.strstart-e.match_start)&&(e.match_length=C-1)),e.prev_length>=C&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-C,r=a._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-C),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),--e.prev_length!=0;);if(e.match_available=0,e.match_length=C-1,e.strstart++,r&&(I(e,!1),e.strm.avail_out===0))return O}else if(e.match_available){if((r=a._tr_tally(e,0,e.window[e.strstart-1]))&&I(e,!1),e.strstart++,e.lookahead--,e.strm.avail_out===0)return O}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&=(r=a._tr_tally(e,0,e.window[e.strstart-1]),0),e.insert=e.strstart<C-1?e.strstart:C-1,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}function U(e,t,n,r,i){this.good_length=e,this.max_lazy=t,this.nice_length=n,this.max_chain=r,this.func=i}function W(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=g,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new i.Buf16(2*x),this.dyn_dtree=new i.Buf16(2*(2*y+1)),this.bl_tree=new i.Buf16(2*(2*b+1)),P(this.dyn_ltree),P(this.dyn_dtree),P(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new i.Buf16(S+1),this.heap=new i.Buf16(2*v+1),P(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new i.Buf16(2*v+1),P(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=h,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?E:D,e.adler=t.wrap===2?0:1,t.last_flush=l,a._tr_init(t),d):M(e,f)}function K(e){var t=G(e);return t===d&&function(e){e.window_size=2*e.w_size,P(e.head),e.max_lazy_match=r[e.level].max_lazy,e.good_match=r[e.level].good_length,e.nice_match=r[e.level].nice_length,e.max_chain_length=r[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=C-1,e.match_available=0,e.ins_h=0}(e.state),t}function q(e,t,n,r,a,o){if(!e)return f;var s=1;if(t===p&&(t=6),r<0?(s=0,r=-r):15<r&&(s=2,r-=16),a<1||_<a||n!==g||r<8||15<r||t<0||9<t||o<0||m<o)return M(e,f);r===8&&(r=9);var c=new W;return(e.state=c).strm=e,c.wrap=s,c.gzhead=null,c.w_bits=r,c.w_size=1<<c.w_bits,c.w_mask=c.w_size-1,c.hash_bits=a+7,c.hash_size=1<<c.hash_bits,c.hash_mask=c.hash_size-1,c.hash_shift=~~((c.hash_bits+C-1)/C),c.window=new i.Buf8(2*c.w_size),c.head=new i.Buf16(c.hash_size),c.prev=new i.Buf16(c.w_size),c.lit_bufsize=1<<a+6,c.pending_buf_size=4*c.lit_bufsize,c.pending_buf=new i.Buf8(c.pending_buf_size),c.d_buf=1*c.lit_bufsize,c.l_buf=3*c.lit_bufsize,c.level=t,c.strategy=o,c.method=n,K(e)}r=[new U(0,0,0,0,function(e,t){var n=65535;for(n>e.pending_buf_size-5&&(n=e.pending_buf_size-5);;){if(e.lookahead<=1){if(B(e),e.lookahead===0&&t===l)return O;if(e.lookahead===0)break}e.strstart+=e.lookahead,e.lookahead=0;var r=e.block_start+n;if((e.strstart===0||e.strstart>=r)&&(e.lookahead=e.strstart-r,e.strstart=r,I(e,!1),e.strm.avail_out===0)||e.strstart-e.block_start>=e.w_size-T&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):(e.strstart>e.block_start&&(I(e,!1),e.strm.avail_out),O)}),new U(4,4,8,4,V),new U(4,5,16,8,V),new U(4,6,32,32,V),new U(4,4,16,16,H),new U(8,16,32,32,H),new U(8,16,128,128,H),new U(8,32,128,256,H),new U(32,128,258,1024,H),new U(32,258,258,4096,H)],n.deflateInit=function(e,t){return q(e,t,g,15,8,0)},n.deflateInit2=q,n.deflateReset=K,n.deflateResetKeep=G,n.deflateSetHeader=function(e,t){return e&&e.state&&e.state.wrap===2?(e.state.gzhead=t,d):f},n.deflate=function(e,t){var n,i,o,c;if(!e||!e.state||5<t||t<0)return e?M(e,f):f;if(i=e.state,!e.output||!e.input&&e.avail_in!==0||i.status===666&&t!==u)return M(e,e.avail_out===0?-5:f);if(i.strm=e,n=i.last_flush,i.last_flush=t,i.status===E){if(i.wrap===2)e.adler=0,L(i,31),L(i,139),L(i,8),i.gzhead?(L(i,+!!i.gzhead.text+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),L(i,255&i.gzhead.time),L(i,i.gzhead.time>>8&255),L(i,i.gzhead.time>>16&255),L(i,i.gzhead.time>>24&255),L(i,i.level===9?2:2<=i.strategy||i.level<2?4:0),L(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(L(i,255&i.gzhead.extra.length),L(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(e.adler=s(e.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(L(i,0),L(i,0),L(i,0),L(i,0),L(i,0),L(i,i.level===9?2:2<=i.strategy||i.level<2?4:0),L(i,3),i.status=D);else{var p=g+(i.w_bits-8<<4)<<8;p|=(2<=i.strategy||i.level<2?0:i.level<6?1:i.level===6?2:3)<<6,i.strstart!==0&&(p|=32),p+=31-p%31,i.status=D,R(i,p),i.strstart!==0&&(R(i,e.adler>>>16),R(i,65535&e.adler)),e.adler=1}}if(i.status===69){if(i.gzhead.extra){for(o=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending!==i.pending_buf_size));)L(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73}if(i.status===73){if(i.gzhead.name){o=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending===i.pending_buf_size)){c=1;break}c=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,L(i,c)}while(c!==0);i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),c===0&&(i.gzindex=0,i.status=91)}else i.status=91}if(i.status===91){if(i.gzhead.comment){o=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending===i.pending_buf_size)){c=1;break}c=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,L(i,c)}while(c!==0);i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),c===0&&(i.status=103)}else i.status=103}if(i.status===103&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&F(e),i.pending+2<=i.pending_buf_size&&(L(i,255&e.adler),L(i,e.adler>>8&255),e.adler=0,i.status=D)):i.status=D),i.pending!==0){if(F(e),e.avail_out===0)return i.last_flush=-1,d}else if(e.avail_in===0&&N(t)<=N(n)&&t!==u)return M(e,-5);if(i.status===666&&e.avail_in!==0)return M(e,-5);if(e.avail_in!==0||i.lookahead!==0||t!==l&&i.status!==666){var m=i.strategy===2?function(e,t){for(var n;;){if(e.lookahead===0&&(B(e),e.lookahead===0)){if(t===l)return O;break}if(e.match_length=0,n=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,n&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}(i,t):i.strategy===3?function(e,t){for(var n,r,i,o,s=e.window;;){if(e.lookahead<=w){if(B(e),e.lookahead<=w&&t===l)return O;if(e.lookahead===0)break}if(e.match_length=0,e.lookahead>=C&&0<e.strstart&&(r=s[i=e.strstart-1])===s[++i]&&r===s[++i]&&r===s[++i]){o=e.strstart+w;do;while(r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&i<o);e.match_length=w-(o-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=C?(n=a._tr_tally(e,1,e.match_length-C),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(n=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),n&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}(i,t):r[i.level].func(i,t);if(m!==A&&m!==j||(i.status=666),m===O||m===A)return e.avail_out===0&&(i.last_flush=-1),d;if(m===k&&(t===1?a._tr_align(i):t!==5&&(a._tr_stored_block(i,0,0,!1),t===3&&(P(i.head),i.lookahead===0&&(i.strstart=0,i.block_start=0,i.insert=0))),F(e),e.avail_out===0))return i.last_flush=-1,d}return t===u?i.wrap<=0?1:(i.wrap===2?(L(i,255&e.adler),L(i,e.adler>>8&255),L(i,e.adler>>16&255),L(i,e.adler>>24&255),L(i,255&e.total_in),L(i,e.total_in>>8&255),L(i,e.total_in>>16&255),L(i,e.total_in>>24&255)):(R(i,e.adler>>>16),R(i,65535&e.adler)),F(e),0<i.wrap&&(i.wrap=-i.wrap),i.pending===0?1:d):d},n.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==E&&t!==69&&t!==73&&t!==91&&t!==103&&t!==D&&t!==666?M(e,f):(e.state=null,t===D?M(e,-3):d):f},n.deflateSetDictionary=function(e,t){var n,r,a,s,c,l,u,p,m=t.length;if(!e||!e.state||(s=(n=e.state).wrap)===2||s===1&&n.status!==E||n.lookahead)return f;for(s===1&&(e.adler=o(e.adler,t,m,0)),n.wrap=0,m>=n.w_size&&(s===0&&(P(n.head),n.strstart=0,n.block_start=0,n.insert=0),p=new i.Buf8(n.w_size),i.arraySet(p,t,m-n.w_size,n.w_size,0),t=p,m=n.w_size),c=e.avail_in,l=e.next_in,u=e.input,e.avail_in=m,e.next_in=0,e.input=t,B(n);n.lookahead>=C;){for(r=n.strstart,a=n.lookahead-(C-1);n.ins_h=(n.ins_h<<n.hash_shift^n.window[r+C-1])&n.hash_mask,n.prev[r&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=r,r++,--a;);n.strstart=r,n.lookahead=C-1,B(n)}return n.strstart+=n.lookahead,n.block_start=n.strstart,n.insert=n.lookahead,n.lookahead=0,n.match_length=n.prev_length=C-1,n.match_available=0,e.next_in=l,e.input=u,e.avail_in=c,n.wrap=s,d},n.deflateInfo=`pako deflate (from Nodeca project)`},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,n){t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name=``,this.comment=``,this.hcrc=0,this.done=!1}},{}],48:[function(e,t,n){t.exports=function(e,t){var n=e.state,r=e.next_in,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T=e.input,E;i=r+(e.avail_in-5),a=e.next_out,E=e.output,o=a-(t-e.avail_out),s=a+(e.avail_out-257),c=n.dmax,l=n.wsize,u=n.whave,d=n.wnext,f=n.window,p=n.hold,m=n.bits,h=n.lencode,g=n.distcode,_=(1<<n.lenbits)-1,v=(1<<n.distbits)-1;e:do{m<15&&(p+=T[r++]<<m,m+=8,p+=T[r++]<<m,m+=8),y=h[p&_];t:for(;;){if(p>>>=b=y>>>24,m-=b,(b=y>>>16&255)==0)E[a++]=65535&y;else{if(!(16&b)){if(!(64&b)){y=h[(65535&y)+(p&(1<<b)-1)];continue t}if(32&b){n.mode=12;break e}e.msg=`invalid literal/length code`,n.mode=30;break e}x=65535&y,(b&=15)&&(m<b&&(p+=T[r++]<<m,m+=8),x+=p&(1<<b)-1,p>>>=b,m-=b),m<15&&(p+=T[r++]<<m,m+=8,p+=T[r++]<<m,m+=8),y=g[p&v];r:for(;;){if(p>>>=b=y>>>24,m-=b,!(16&(b=y>>>16&255))){if(!(64&b)){y=g[(65535&y)+(p&(1<<b)-1)];continue r}e.msg=`invalid distance code`,n.mode=30;break e}if(S=65535&y,m<(b&=15)&&(p+=T[r++]<<m,(m+=8)<b&&(p+=T[r++]<<m,m+=8)),c<(S+=p&(1<<b)-1)){e.msg=`invalid distance too far back`,n.mode=30;break e}if(p>>>=b,m-=b,(b=a-o)<S){if(u<(b=S-b)&&n.sane){e.msg=`invalid distance too far back`,n.mode=30;break e}if(w=f,(C=0)===d){if(C+=l-b,b<x){for(x-=b;E[a++]=f[C++],--b;);C=a-S,w=E}}else if(d<b){if(C+=l+d-b,(b-=d)<x){for(x-=b;E[a++]=f[C++],--b;);if(C=0,d<x){for(x-=b=d;E[a++]=f[C++],--b;);C=a-S,w=E}}}else if(C+=d-b,b<x){for(x-=b;E[a++]=f[C++],--b;);C=a-S,w=E}for(;2<x;)E[a++]=w[C++],E[a++]=w[C++],E[a++]=w[C++],x-=3;x&&(E[a++]=w[C++],1<x&&(E[a++]=w[C++]))}else{for(C=a-S;E[a++]=E[C++],E[a++]=E[C++],E[a++]=E[C++],2<(x-=3););x&&(E[a++]=E[C++],1<x&&(E[a++]=E[C++]))}break}}break}}while(r<i&&a<s);r-=x=m>>3,p&=(1<<(m-=x<<3))-1,e.next_in=r,e.next_out=a,e.avail_in=r<i?i-r+5:5-(r-i),e.avail_out=a<s?s-a+257:257-(a-s),n.hold=p,n.bits=m}},{}],49:[function(e,t,n){var r=e(`../utils/common`),i=e(`./adler32`),a=e(`./crc32`),o=e(`./inffast`),s=e(`./inftrees`),c=1,l=2,u=0,d=-2,f=1,p=852,m=592;function h(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function g(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function _(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg=``,t.wrap&&(e.adler=1&t.wrap),t.mode=f,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new r.Buf32(p),t.distcode=t.distdyn=new r.Buf32(m),t.sane=1,t.back=-1,u):d}function v(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,_(e)):d}function y(e,t){var n,r;return e&&e.state?(r=e.state,t<0?(n=0,t=-t):(n=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?d:(r.window!==null&&r.wbits!==t&&(r.window=null),r.wrap=n,r.wbits=t,v(e))):d}function b(e,t){var n,r;return e?(r=new g,(e.state=r).window=null,(n=y(e,t))!==u&&(e.state=null),n):d}var x,S,C=!0;function w(e){if(C){var t;for(x=new r.Buf32(512),S=new r.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(s(c,e.lens,0,288,x,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;s(l,e.lens,0,32,S,0,e.work,{bits:5}),C=!1}e.lencode=x,e.lenbits=9,e.distcode=S,e.distbits=5}function T(e,t,n,i){var a,o=e.state;return o.window===null&&(o.wsize=1<<o.wbits,o.wnext=0,o.whave=0,o.window=new r.Buf8(o.wsize)),i>=o.wsize?(r.arraySet(o.window,t,n-o.wsize,o.wsize,0),o.wnext=0,o.whave=o.wsize):(i<(a=o.wsize-o.wnext)&&(a=i),r.arraySet(o.window,t,n-i,a,o.wnext),(i-=a)?(r.arraySet(o.window,t,n-i,i,0),o.wnext=i,o.whave=o.wsize):(o.wnext+=a,o.wnext===o.wsize&&(o.wnext=0),o.whave<o.wsize&&(o.whave+=a))),0}n.inflateReset=v,n.inflateReset2=y,n.inflateResetKeep=_,n.inflateInit=function(e){return b(e,15)},n.inflateInit2=b,n.inflate=function(e,t){var n,p,m,g,_,v,y,b,x,S,C,E,D,O,k,A,j,M,N,P,F,I,L,R,z=0,B=new r.Buf8(4),V=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&e.avail_in!==0)return d;(n=e.state).mode===12&&(n.mode=13),_=e.next_out,m=e.output,y=e.avail_out,g=e.next_in,p=e.input,v=e.avail_in,b=n.hold,x=n.bits,S=v,C=y,I=u;e:for(;;)switch(n.mode){case f:if(n.wrap===0){n.mode=13;break}for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(2&n.wrap&&b===35615){B[n.check=0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0),x=b=0,n.mode=2;break}if(n.flags=0,n.head&&(n.head.done=!1),!(1&n.wrap)||(((255&b)<<8)+(b>>8))%31){e.msg=`incorrect header check`,n.mode=30;break}if((15&b)!=8){e.msg=`unknown compression method`,n.mode=30;break}if(x-=4,F=8+(15&(b>>>=4)),n.wbits===0)n.wbits=F;else if(F>n.wbits){e.msg=`invalid window size`,n.mode=30;break}n.dmax=1<<F,e.adler=n.check=1,n.mode=512&b?10:12,x=b=0;break;case 2:for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(n.flags=b,(255&n.flags)!=8){e.msg=`unknown compression method`,n.mode=30;break}if(57344&n.flags){e.msg=`unknown header flags set`,n.mode=30;break}n.head&&(n.head.text=b>>8&1),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0,n.mode=3;case 3:for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.head&&(n.head.time=b),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,B[2]=b>>>16&255,B[3]=b>>>24&255,n.check=a(n.check,B,4,0)),x=b=0,n.mode=4;case 4:for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.head&&(n.head.xflags=255&b,n.head.os=b>>8),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0,n.mode=5;case 5:if(1024&n.flags){for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.length=b,n.head&&(n.head.extra_len=b),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0}else n.head&&(n.head.extra=null);n.mode=6;case 6:if(1024&n.flags&&(v<(E=n.length)&&(E=v),E&&(n.head&&(F=n.head.extra_len-n.length,n.head.extra||(n.head.extra=Array(n.head.extra_len)),r.arraySet(n.head.extra,p,g,E,F)),512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,n.length-=E),n.length))break e;n.length=0,n.mode=7;case 7:if(2048&n.flags){if(v===0)break e;for(E=0;F=p[g+E++],n.head&&F&&n.length<65536&&(n.head.name+=String.fromCharCode(F)),F&&E<v;);if(512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,F)break e}else n.head&&(n.head.name=null);n.length=0,n.mode=8;case 8:if(4096&n.flags){if(v===0)break e;for(E=0;F=p[g+E++],n.head&&F&&n.length<65536&&(n.head.comment+=String.fromCharCode(F)),F&&E<v;);if(512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,F)break e}else n.head&&(n.head.comment=null);n.mode=9;case 9:if(512&n.flags){for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b!==(65535&n.check)){e.msg=`header crc mismatch`,n.mode=30;break}x=b=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),e.adler=n.check=0,n.mode=12;break;case 10:for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}e.adler=n.check=h(b),x=b=0,n.mode=11;case 11:if(n.havedict===0)return e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,2;e.adler=n.check=1,n.mode=12;case 12:if(t===5||t===6)break e;case 13:if(n.last){b>>>=7&x,x-=7&x,n.mode=27;break}for(;x<3;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}switch(n.last=1&b,--x,3&(b>>>=1)){case 0:n.mode=14;break;case 1:if(w(n),n.mode=20,t!==6)break;b>>>=2,x-=2;break e;case 2:n.mode=17;break;case 3:e.msg=`invalid block type`,n.mode=30}b>>>=2,x-=2;break;case 14:for(b>>>=7&x,x-=7&x;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if((65535&b)!=(b>>>16^65535)){e.msg=`invalid stored block lengths`,n.mode=30;break}if(n.length=65535&b,x=b=0,n.mode=15,t===6)break e;case 15:n.mode=16;case 16:if(E=n.length){if(v<E&&(E=v),y<E&&(E=y),E===0)break e;r.arraySet(m,p,g,E,_),v-=E,g+=E,y-=E,_+=E,n.length-=E;break}n.mode=12;break;case 17:for(;x<14;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(n.nlen=257+(31&b),b>>>=5,x-=5,n.ndist=1+(31&b),b>>>=5,x-=5,n.ncode=4+(15&b),b>>>=4,x-=4,286<n.nlen||30<n.ndist){e.msg=`too many length or distance symbols`,n.mode=30;break}n.have=0,n.mode=18;case 18:for(;n.have<n.ncode;){for(;x<3;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.lens[V[n.have++]]=7&b,b>>>=3,x-=3}for(;n.have<19;)n.lens[V[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,L={bits:n.lenbits},I=s(0,n.lens,0,19,n.lencode,0,n.work,L),n.lenbits=L.bits,I){e.msg=`invalid code lengths set`,n.mode=30;break}n.have=0,n.mode=19;case 19:for(;n.have<n.nlen+n.ndist;){for(;A=(z=n.lencode[b&(1<<n.lenbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(j<16)b>>>=k,x-=k,n.lens[n.have++]=j;else{if(j===16){for(R=k+2;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b>>>=k,x-=k,n.have===0){e.msg=`invalid bit length repeat`,n.mode=30;break}F=n.lens[n.have-1],E=3+(3&b),b>>>=2,x-=2}else if(j===17){for(R=k+3;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}x-=k,F=0,E=3+(7&(b>>>=k)),b>>>=3,x-=3}else{for(R=k+7;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}x-=k,F=0,E=11+(127&(b>>>=k)),b>>>=7,x-=7}if(n.have+E>n.nlen+n.ndist){e.msg=`invalid bit length repeat`,n.mode=30;break}for(;E--;)n.lens[n.have++]=F}}if(n.mode===30)break;if(n.lens[256]===0){e.msg=`invalid code -- missing end-of-block`,n.mode=30;break}if(n.lenbits=9,L={bits:n.lenbits},I=s(c,n.lens,0,n.nlen,n.lencode,0,n.work,L),n.lenbits=L.bits,I){e.msg=`invalid literal/lengths set`,n.mode=30;break}if(n.distbits=6,n.distcode=n.distdyn,L={bits:n.distbits},I=s(l,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,L),n.distbits=L.bits,I){e.msg=`invalid distances set`,n.mode=30;break}if(n.mode=20,t===6)break e;case 20:n.mode=21;case 21:if(6<=v&&258<=y){e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,o(e,C),_=e.next_out,m=e.output,y=e.avail_out,g=e.next_in,p=e.input,v=e.avail_in,b=n.hold,x=n.bits,n.mode===12&&(n.back=-1);break}for(n.back=0;A=(z=n.lencode[b&(1<<n.lenbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(A&&!(240&A)){for(M=k,N=A,P=j;A=(z=n.lencode[P+((b&(1<<M+N)-1)>>M)])>>>16&255,j=65535&z,!(M+(k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}b>>>=M,x-=M,n.back+=M}if(b>>>=k,x-=k,n.back+=k,n.length=j,A===0){n.mode=26;break}if(32&A){n.back=-1,n.mode=12;break}if(64&A){e.msg=`invalid literal/length code`,n.mode=30;break}n.extra=15&A,n.mode=22;case 22:if(n.extra){for(R=n.extra;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.length+=b&(1<<n.extra)-1,b>>>=n.extra,x-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=23;case 23:for(;A=(z=n.distcode[b&(1<<n.distbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(!(240&A)){for(M=k,N=A,P=j;A=(z=n.distcode[P+((b&(1<<M+N)-1)>>M)])>>>16&255,j=65535&z,!(M+(k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}b>>>=M,x-=M,n.back+=M}if(b>>>=k,x-=k,n.back+=k,64&A){e.msg=`invalid distance code`,n.mode=30;break}n.offset=j,n.extra=15&A,n.mode=24;case 24:if(n.extra){for(R=n.extra;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.offset+=b&(1<<n.extra)-1,b>>>=n.extra,x-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){e.msg=`invalid distance too far back`,n.mode=30;break}n.mode=25;case 25:if(y===0)break e;if(E=C-y,n.offset>E){if((E=n.offset-E)>n.whave&&n.sane){e.msg=`invalid distance too far back`,n.mode=30;break}D=E>n.wnext?(E-=n.wnext,n.wsize-E):n.wnext-E,E>n.length&&(E=n.length),O=n.window}else O=m,D=_-n.offset,E=n.length;for(y<E&&(E=y),y-=E,n.length-=E;m[_++]=O[D++],--E;);n.length===0&&(n.mode=21);break;case 26:if(y===0)break e;m[_++]=n.length,y--,n.mode=21;break;case 27:if(n.wrap){for(;x<32;){if(v===0)break e;v--,b|=p[g++]<<x,x+=8}if(C-=y,e.total_out+=C,n.total+=C,C&&(e.adler=n.check=n.flags?a(n.check,m,C,_-C):i(n.check,m,C,_-C)),C=y,(n.flags?b:h(b))!==n.check){e.msg=`incorrect data check`,n.mode=30;break}x=b=0}n.mode=28;case 28:if(n.wrap&&n.flags){for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b!==(4294967295&n.total)){e.msg=`incorrect length check`,n.mode=30;break}x=b=0}n.mode=29;case 29:I=1;break e;case 30:I=-3;break e;case 31:return-4;default:return d}return e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,(n.wsize||C!==e.avail_out&&n.mode<30&&(n.mode<27||t!==4))&&T(e,e.output,e.next_out,C-e.avail_out)?(n.mode=31,-4):(S-=e.avail_in,C-=e.avail_out,e.total_in+=S,e.total_out+=C,n.total+=C,n.wrap&&C&&(e.adler=n.check=n.flags?a(n.check,m,C,e.next_out-C):i(n.check,m,C,e.next_out-C)),e.data_type=n.bits+(n.last?64:0)+(n.mode===12?128:0)+(n.mode===20||n.mode===15?256:0),(S==0&&C===0||t===4)&&I===u&&(I=-5),I)},n.inflateEnd=function(e){if(!e||!e.state)return d;var t=e.state;return t.window&&=null,e.state=null,u},n.inflateGetHeader=function(e,t){var n;return e&&e.state&&2&(n=e.state).wrap?((n.head=t).done=!1,u):d},n.inflateSetDictionary=function(e,t){var n,r=t.length;return e&&e.state?(n=e.state).wrap!==0&&n.mode!==11?d:n.mode===11&&i(1,t,r,0)!==n.check?-3:T(e,t,r,r)?(n.mode=31,-4):(n.havedict=1,u):d},n.inflateInfo=`pako inflate (from Nodeca project)`},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,n){var r=e(`../utils/common`),i=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],a=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],o=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],s=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,n,c,l,u,d,f){var p,m,h,g,_,v,y,b,x,S=f.bits,C=0,w=0,T=0,E=0,D=0,O=0,k=0,A=0,j=0,M=0,N=null,P=0,F=new r.Buf16(16),I=new r.Buf16(16),L=null,R=0;for(C=0;C<=15;C++)F[C]=0;for(w=0;w<c;w++)F[t[n+w]]++;for(D=S,E=15;1<=E&&F[E]===0;E--);if(E<D&&(D=E),E===0)return l[u++]=20971520,l[u++]=20971520,f.bits=1,0;for(T=1;T<E&&F[T]===0;T++);for(D<T&&(D=T),C=A=1;C<=15;C++)if(A<<=1,(A-=F[C])<0)return-1;if(0<A&&(e===0||E!==1))return-1;for(I[1]=0,C=1;C<15;C++)I[C+1]=I[C]+F[C];for(w=0;w<c;w++)t[n+w]!==0&&(d[I[t[n+w]]++]=w);if(v=e===0?(N=L=d,19):e===1?(N=i,P-=257,L=a,R-=257,256):(N=o,L=s,-1),C=T,_=u,k=w=M=0,h=-1,g=(j=1<<(O=D))-1,e===1&&852<j||e===2&&592<j)return 1;for(;;){for(y=C-k,x=d[w]<v?(b=0,d[w]):d[w]>v?(b=L[R+d[w]],N[P+d[w]]):(b=96,0),p=1<<C-k,T=m=1<<O;l[_+(M>>k)+(m-=p)]=y<<24|b<<16|x|0,m!==0;);for(p=1<<C-1;M&p;)p>>=1;if(p===0?M=0:(M&=p-1,M+=p),w++,--F[C]==0){if(C===E)break;C=t[n+d[w]]}if(D<C&&(M&g)!==h){for(k===0&&(k=D),_+=T,A=1<<(O=C-k);O+k<E&&!((A-=F[O+k])<=0);)O++,A<<=1;if(j+=1<<O,e===1&&852<j||e===2&&592<j)return 1;l[h=M&g]=D<<24|O<<16|_-u|0}}return M!==0&&(l[_+M]=C-k<<24|4194304),f.bits=D,0}},{"../utils/common":41}],51:[function(e,t,n){t.exports={2:`need dictionary`,1:`stream end`,0:``,"-1":`file error`,"-2":`stream error`,"-3":`data error`,"-4":`insufficient memory`,"-5":`buffer error`,"-6":`incompatible version`}},{}],52:[function(e,t,n){var r=e(`../utils/common`),i=0,a=1;function o(e){for(var t=e.length;0<=--t;)e[t]=0}var s=0,c=29,l=256,u=l+1+c,d=30,f=19,p=2*u+1,m=15,h=16,g=7,_=256,v=16,y=17,b=18,x=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],S=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],C=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],w=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],T=Array(2*(u+2));o(T);var E=Array(2*d);o(E);var D=Array(512);o(D);var O=Array(256);o(O);var k=Array(c);o(k);var A,j,M,N=Array(d);function P(e,t,n,r,i){this.static_tree=e,this.extra_bits=t,this.extra_base=n,this.elems=r,this.max_length=i,this.has_stree=e&&e.length}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function I(e){return e<256?D[e]:D[256+(e>>>7)]}function L(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function R(e,t,n){e.bi_valid>h-n?(e.bi_buf|=t<<e.bi_valid&65535,L(e,e.bi_buf),e.bi_buf=t>>h-e.bi_valid,e.bi_valid+=n-h):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=n)}function z(e,t,n){R(e,n[2*t],n[2*t+1])}function B(e,t){for(var n=0;n|=1&e,e>>>=1,n<<=1,0<--t;);return n>>>1}function V(e,t,n){var r,i,a=Array(m+1),o=0;for(r=1;r<=m;r++)a[r]=o=o+n[r-1]<<1;for(i=0;i<=t;i++){var s=e[2*i+1];s!==0&&(e[2*i]=B(a[s]++,s))}}function H(e){for(var t=0;t<u;t++)e.dyn_ltree[2*t]=0;for(t=0;t<d;t++)e.dyn_dtree[2*t]=0;for(t=0;t<f;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*_]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function U(e){8<e.bi_valid?L(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function W(e,t,n,r){var i=2*t,a=2*n;return e[i]<e[a]||e[i]===e[a]&&r[t]<=r[n]}function G(e,t,n){for(var r=e.heap[n],i=n<<1;i<=e.heap_len&&(i<e.heap_len&&W(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!W(t,r,e.heap[i],e.depth));)e.heap[n]=e.heap[i],n=i,i<<=1;e.heap[n]=r}function K(e,t,n){var r,i,a,o,s=0;if(e.last_lit!==0)for(;r=e.pending_buf[e.d_buf+2*s]<<8|e.pending_buf[e.d_buf+2*s+1],i=e.pending_buf[e.l_buf+s],s++,r===0?z(e,i,t):(z(e,(a=O[i])+l+1,t),(o=x[a])!==0&&R(e,i-=k[a],o),z(e,a=I(--r),n),(o=S[a])!==0&&R(e,r-=N[a],o)),s<e.last_lit;);z(e,_,t)}function q(e,t){var n,r,i,a=t.dyn_tree,o=t.stat_desc.static_tree,s=t.stat_desc.has_stree,c=t.stat_desc.elems,l=-1;for(e.heap_len=0,e.heap_max=p,n=0;n<c;n++)a[2*n]===0?a[2*n+1]=0:(e.heap[++e.heap_len]=l=n,e.depth[n]=0);for(;e.heap_len<2;)a[2*(i=e.heap[++e.heap_len]=l<2?++l:0)]=1,e.depth[i]=0,e.opt_len--,s&&(e.static_len-=o[2*i+1]);for(t.max_code=l,n=e.heap_len>>1;1<=n;n--)G(e,a,n);for(i=c;n=e.heap[1],e.heap[1]=e.heap[e.heap_len--],G(e,a,1),r=e.heap[1],e.heap[--e.heap_max]=n,e.heap[--e.heap_max]=r,a[2*i]=a[2*n]+a[2*r],e.depth[i]=(e.depth[n]>=e.depth[r]?e.depth[n]:e.depth[r])+1,a[2*n+1]=a[2*r+1]=i,e.heap[1]=i++,G(e,a,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var n,r,i,a,o,s,c=t.dyn_tree,l=t.max_code,u=t.stat_desc.static_tree,d=t.stat_desc.has_stree,f=t.stat_desc.extra_bits,h=t.stat_desc.extra_base,g=t.stat_desc.max_length,_=0;for(a=0;a<=m;a++)e.bl_count[a]=0;for(c[2*e.heap[e.heap_max]+1]=0,n=e.heap_max+1;n<p;n++)g<(a=c[2*c[2*(r=e.heap[n])+1]+1]+1)&&(a=g,_++),c[2*r+1]=a,l<r||(e.bl_count[a]++,o=0,h<=r&&(o=f[r-h]),s=c[2*r],e.opt_len+=s*(a+o),d&&(e.static_len+=s*(u[2*r+1]+o)));if(_!==0){do{for(a=g-1;e.bl_count[a]===0;)a--;e.bl_count[a]--,e.bl_count[a+1]+=2,e.bl_count[g]--,_-=2}while(0<_);for(a=g;a!==0;a--)for(r=e.bl_count[a];r!==0;)l<(i=e.heap[--n])||(c[2*i+1]!==a&&(e.opt_len+=(a-c[2*i+1])*c[2*i],c[2*i+1]=a),r--)}}(e,t),V(a,l,e.bl_count)}function J(e,t,n){var r,i,a=-1,o=t[1],s=0,c=7,l=4;for(o===0&&(c=138,l=3),t[2*(n+1)+1]=65535,r=0;r<=n;r++)i=o,o=t[2*(r+1)+1],++s<c&&i===o||(s<l?e.bl_tree[2*i]+=s:i===0?s<=10?e.bl_tree[2*y]++:e.bl_tree[2*b]++:(i!==a&&e.bl_tree[2*i]++,e.bl_tree[2*v]++),a=i,l=(s=0)===o?(c=138,3):i===o?(c=6,3):(c=7,4))}function Y(e,t,n){var r,i,a=-1,o=t[1],s=0,c=7,l=4;for(o===0&&(c=138,l=3),r=0;r<=n;r++)if(i=o,o=t[2*(r+1)+1],!(++s<c&&i===o)){if(s<l)for(;z(e,i,e.bl_tree),--s!=0;);else i===0?s<=10?(z(e,y,e.bl_tree),R(e,s-3,3)):(z(e,b,e.bl_tree),R(e,s-11,7)):(i!==a&&(z(e,i,e.bl_tree),s--),z(e,v,e.bl_tree),R(e,s-3,2));a=i,l=(s=0)===o?(c=138,3):i===o?(c=6,3):(c=7,4)}}o(N);var X=!1;function Z(e,t,n,i){R(e,(s<<1)+ +!!i,3),function(e,t,n,i){U(e),i&&(L(e,n),L(e,~n)),r.arraySet(e.pending_buf,e.window,t,n,e.pending),e.pending+=n}(e,t,n,!0)}n._tr_init=function(e){X||=(function(){var e,t,n,r,i,a=Array(m+1);for(r=n=0;r<c-1;r++)for(k[r]=n,e=0;e<1<<x[r];e++)O[n++]=r;for(O[n-1]=r,r=i=0;r<16;r++)for(N[r]=i,e=0;e<1<<S[r];e++)D[i++]=r;for(i>>=7;r<d;r++)for(N[r]=i<<7,e=0;e<1<<S[r]-7;e++)D[256+i++]=r;for(t=0;t<=m;t++)a[t]=0;for(e=0;e<=143;)T[2*e+1]=8,e++,a[8]++;for(;e<=255;)T[2*e+1]=9,e++,a[9]++;for(;e<=279;)T[2*e+1]=7,e++,a[7]++;for(;e<=287;)T[2*e+1]=8,e++,a[8]++;for(V(T,u+1,a),e=0;e<d;e++)E[2*e+1]=5,E[2*e]=B(e,5);A=new P(T,x,l+1,u,m),j=new P(E,S,0,d,m),M=new P([],C,0,f,g)}(),!0),e.l_desc=new F(e.dyn_ltree,A),e.d_desc=new F(e.dyn_dtree,j),e.bl_desc=new F(e.bl_tree,M),e.bi_buf=0,e.bi_valid=0,H(e)},n._tr_stored_block=Z,n._tr_flush_block=function(e,t,n,r){var o,s,c=0;0<e.level?(e.strm.data_type===2&&(e.strm.data_type=function(e){var t,n=4093624447;for(t=0;t<=31;t++,n>>>=1)if(1&n&&e.dyn_ltree[2*t]!==0)return i;if(e.dyn_ltree[18]!==0||e.dyn_ltree[20]!==0||e.dyn_ltree[26]!==0)return a;for(t=32;t<l;t++)if(e.dyn_ltree[2*t]!==0)return a;return i}(e)),q(e,e.l_desc),q(e,e.d_desc),c=function(e){var t;for(J(e,e.dyn_ltree,e.l_desc.max_code),J(e,e.dyn_dtree,e.d_desc.max_code),q(e,e.bl_desc),t=f-1;3<=t&&e.bl_tree[2*w[t]+1]===0;t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),o=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=o&&(o=s)):o=s=n+5,n+4<=o&&t!==-1?Z(e,t,n,r):e.strategy===4||s===o?(R(e,2+ +!!r,3),K(e,T,E)):(R(e,4+ +!!r,3),function(e,t,n,r){var i;for(R(e,t-257,5),R(e,n-1,5),R(e,r-4,4),i=0;i<r;i++)R(e,e.bl_tree[2*w[i]+1],3);Y(e,e.dyn_ltree,t-1),Y(e,e.dyn_dtree,n-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,c+1),K(e,e.dyn_ltree,e.dyn_dtree)),H(e),r&&U(e)},n._tr_tally=function(e,t,n){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&n,e.last_lit++,t===0?e.dyn_ltree[2*n]++:(e.matches++,t--,e.dyn_ltree[2*(O[n]+l+1)]++,e.dyn_dtree[2*I(t)]++),e.last_lit===e.lit_bufsize-1},n._tr_align=function(e){R(e,2,3),z(e,_,T),function(e){e.bi_valid===16?(L(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}(e)}},{"../utils/common":41}],53:[function(e,t,n){t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg=``,this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,n){(function(e){(function(e,t){if(!e.setImmediate){var n,r,i,a,o=1,s={},c=!1,l=e.document,u=Object.getPrototypeOf&&Object.getPrototypeOf(e);u=u&&u.setTimeout?u:e,n={}.toString.call(e.process)===`[object process]`?function(e){process.nextTick(function(){f(e)})}:function(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage(``,`*`),e.onmessage=n,t}}()?(a=`setImmediate$`+Math.random()+`$`,e.addEventListener?e.addEventListener(`message`,p,!1):e.attachEvent(`onmessage`,p),function(t){e.postMessage(a+t,`*`)}):e.MessageChannel?((i=new MessageChannel).port1.onmessage=function(e){f(e.data)},function(e){i.port2.postMessage(e)}):l&&`onreadystatechange`in l.createElement(`script`)?(r=l.documentElement,function(e){var t=l.createElement(`script`);t.onreadystatechange=function(){f(e),t.onreadystatechange=null,r.removeChild(t),t=null},r.appendChild(t)}):function(e){setTimeout(f,0,e)},u.setImmediate=function(e){typeof e!=`function`&&(e=Function(``+e));for(var t=Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];return s[o]={callback:e,args:t},n(o),o++},u.clearImmediate=d}function d(e){delete s[e]}function f(e){if(c)setTimeout(f,0,e);else{var n=s[e];if(n){c=!0;try{(function(e){var n=e.callback,r=e.args;switch(r.length){case 0:n();break;case 1:n(r[0]);break;case 2:n(r[0],r[1]);break;case 3:n(r[0],r[1],r[2]);break;default:n.apply(t,r)}})(n)}finally{d(e),c=!1}}}}function p(t){t.source===e&&typeof t.data==`string`&&t.data.indexOf(a)===0&&f(+t.data.slice(a.length))}})(typeof self>`u`?e===void 0?this:e:self)}).call(this,typeof global<`u`?global:typeof self<`u`?self:typeof window<`u`?window:{})},{}]},{},[10])(10)})})),M,N=o((()=>{M=class{static async trace(e,t={}){let{colors:n=8,detail:r=60,smoothness:i=50,threshold:a=128,removeWhiteBg:o=!0,simplification:s=2}=t,c=e.naturalWidth||e.width||800,l=e.naturalHeight||e.height||600,u=Math.min(1,640/Math.max(c,l)),d=Math.round(c*u),f=Math.round(l*u),p=document.createElement(`canvas`);p.width=d,p.height=f;let m=p.getContext(`2d`,{willReadFrequently:!0});m.drawImage(e,0,0,d,f);let h=m.getImageData(0,0,d,f).data,g=d*f,_=this.quantizePalette(h,n,o),v=_.length,y=new Int8Array(g);y.fill(-1);for(let e=0;e<g;e++){let t=e*4;if(h[t+3]<30)continue;let n=h[t],r=h[t+1],i=h[t+2];if(o&&n>240&&r>240&&i>240)continue;let a=-1,s=3025;for(let e=0;e<v;e++){let t=_[e],o=n-t.r,c=r-t.g,l=i-t.b,u=o*o+c*c+l*l;u<s&&(s=u,a=e)}y[e]=a}let b=[],x=new Uint8Array(g);for(let e=0;e<v;e++){let t=_[e],n=!1;for(let t=0;t<g;t++)y[t]===e?(x[t]=1,n=!0):x[t]=0;if(!n)continue;let a=this.extractContours(x,d,f,r);if(a.length>0){let n=this.contoursToSvgPath(a,d,f,c,l,i,s);n&&b.push({d:n,fill:this.rgbToHex(t.r,t.g,t.b),colorIndex:e})}}let S=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c} ${l}" width="${c}" height="${l}">\n`;S+=`  <g id="creativeforge-vector-layers">
`;for(let e of b)S+=`    <path d="${e.d}" fill="${e.fill}" />\n`;return S+=`  </g>
</svg>`,{svgString:S,pathCount:b.length,colors:_.map(e=>this.rgbToHex(e.r,e.g,e.b)),width:c,height:l}}static quantizePalette(e,t,n){let r={};for(let t=0;t<e.length;t+=64){if(e[t+3]<50)continue;let i=e[t]>>5<<5,a=e[t+1]>>5<<5,o=e[t+2]>>5<<5;if(n&&i>224&&a>224&&o>224)continue;let s=i<<16|a<<8|o;r[s]=(r[s]||0)+1}let i=Object.entries(r).sort((e,t)=>t[1]-e[1]).slice(0,t);return i.length===0?[{r:99,g:102,b:241},{r:6,g:182,b:212}]:i.map(([e])=>{let t=parseInt(e,10);return{r:t>>16&255,g:t>>8&255,b:t&255}})}static extractContours(e,t,n,r){let i=Math.max(3,Math.round(30-r/100*25)),a=new Uint8Array(t*n),o=[],s=r>70?1:2;for(let r=1;r<n-1;r+=s){let c=r*t;for(let l=1;l<t-1;l+=s){let s=c+l;if(e[s]&&!a[s]&&(!e[s-1]||!e[s+1]||!e[s-t]||!e[s+t])){let s=this.tracePolygon(e,a,l,r,t,n);s.length>=i&&o.push(s)}}}return o}static tracePolygon(e,t,n,r,i,a){let o=[],s=n,c=r,l=0,u=0,d=[1,0,-1,0],f=[0,1,0,-1];for(;u<800;){o.push({x:s,y:c}),t[c*i+s]=1,u++;let p=!1;for(let t=0;t<4;t++){let n=(l+3+t)%4,r=s+d[n],o=c+f[n];if(r>=0&&r<i&&o>=0&&o<a&&e[o*i+r]){s=r,c=o,l=n,p=!0;break}}if(!p||s===n&&c===r&&u>3)break}return o}static contoursToSvgPath(e,t,n,r,i,a,o){let s=r/t,c=i/n,l=``;for(let t of e){if(t.length<3)continue;let e=Math.max(1,Math.round(o)),n=[];for(let r=0;r<t.length;r+=e)n.push({x:+(t[r].x*s).toFixed(1),y:+(t[r].y*c).toFixed(1)});if(!(n.length<3)){if(l+=`M ${n[0].x} ${n[0].y} `,a>20){for(let e=1;e<n.length-1;e++){let t=((n[e].x+n[e+1].x)/2).toFixed(1),r=((n[e].y+n[e+1].y)/2).toFixed(1);l+=`Q ${n[e].x} ${n[e].y}, ${t} ${r} `}l+=`Z `}else{for(let e=1;e<n.length;e++)l+=`L ${n[e].x} ${n[e].y} `;l+=`Z `}}}return l.trim()}static rgbToHex(e,t,n){return`#`+[e,t,n].map(e=>{let t=Math.min(255,Math.max(0,e)).toString(16);return t.length===1?`0`+t:t}).join(``)}}})),P,F=o((()=>{P=class{static resolutions={"2K":{width:2560,height:1440,label:`2K QHD (2560 x 1440)`,ppi:150},"4K":{width:3840,height:2160,label:`4K Ultra HD (3840 x 2160)`,ppi:300},"6K":{width:6144,height:3456,label:`6K Master (6144 x 3456)`,ppi:300},"8K":{width:7680,height:4320,label:`8K Cinema (7680 x 4320)`,ppi:300},"300PPI":{width:4500,height:3e3,label:`300 PPI Print Master (4500 x 3000 @ 300 DPI)`,ppi:300}};static process(e,t=`4K`,n={}){let{sharpness:r=75,detailEnhancement:i=60,noiseReduction:a=30,texturePreservation:o=80,artifactReduction:s=40}=n,c=e.naturalWidth||e.width||1280,l=e.naturalHeight||e.height||720,u=c/l,d=this.resolutions[t]||this.resolutions[`4K`],f,p;u>=1?(f=d.width,p=Math.round(d.width/u)):(p=d.height,f=Math.round(d.height*u));let m=document.createElement(`canvas`);m.width=c,m.height=l,m.getContext(`2d`).drawImage(e,0,0,c,l);let h=c,g=l;for(;h*2<f&&g*2<p;){let e=h*2,t=g*2,n=document.createElement(`canvas`);n.width=e,n.height=t;let r=n.getContext(`2d`);r.imageSmoothingQuality=`high`,r.drawImage(m,0,0,e,t),m=n,h=e,g=t}let _=document.createElement(`canvas`);_.width=f,_.height=p;let v=_.getContext(`2d`);return v.imageSmoothingQuality=`high`,v.drawImage(m,0,0,f,p),(r>0||i>0)&&this.applyUnsharpMask(v,f,p,r,i),_}static applyUnsharpMask(e,t,n,r,i){let a=e.getImageData(0,0,t,n),o=a.data,s=r/100*.7+i/100*.3,c=1+4*s,l=-s;for(let e=1;e<n-1;e+=2){let n=e*t;for(let r=1;r<t-1;r+=2){let i=(n+r)*4;for(let a=0;a<3;a++){let s=o[i+a]*c+(o[((e-1)*t+r)*4+a]+o[((e+1)*t+r)*4+a]+o[(n+(r-1))*4+a]+o[(n+(r+1))*4+a])*l;o[i+a]=Math.min(255,Math.max(0,s))}}}e.putImageData(a,0,0)}static getPrintDimensions(e,t,n=300){let r=(e/n).toFixed(1),i=(t/n).toFixed(1),a=(e/n*2.54).toFixed(1),o=(t/n*2.54).toFixed(1);return{inches:`${r}" × ${i}"`,cm:`${a} × ${o} cm`}}}})),I,L=o((()=>{I=class{static process(e,t={}){let{targetColor:n={r:255,g:255,b:255},tolerance:r=25,feather:i=2,shadowPreservation:a=!0}=t,o=e.naturalWidth||e.width||800,s=e.naturalHeight||e.height||600,c=document.createElement(`canvas`);c.width=o,c.height=s;let l=c.getContext(`2d`,{willReadFrequently:!0});l.drawImage(e,0,0,o,s);let u=l.getImageData(0,0,o,s),d=u.data,f=new Uint32Array(d.buffer),p=r/100*160,m=p*p,h=Math.max(1,i/10*40),g=(p+h)*(p+h),_=n.r,v=n.g,y=n.b;for(let e=0;e<f.length;e++){let t=e*4,n=d[t+3];if(n===0)continue;let r=d[t],i=d[t+1],o=d[t+2],s=r-_,c=i-v,l=o-y,u=s*s+c*c+l*l;if(u<m){if(a){let t=299*r+587*i+114*o>>10;if(t<230){let n=Math.round((1-t/255)*115);f[e]=n<<24}else f[e]=0}else f[e]=0}else if(u<g){let e=(Math.sqrt(u)-p)/h;d[t+3]=n*e|0}}return l.putImageData(u,0,0),c}}})),R,z=o((()=>{R=class e{static presets={1:{name:`Fractal Glass 1 (Soft Transparent Glass)`,refraction:25,distortion:15,transparency:80,blur:2,reflection:30,light:40,depth:10,density:12,edgeDistortion:10,tint:`rgba(255,255,255,0.08)`},2:{name:`Fractal Glass 2 (Crystal Refraction Glass)`,refraction:60,distortion:45,transparency:65,blur:1,reflection:70,light:80,depth:35,density:20,edgeDistortion:50,tint:`rgba(200,240,255,0.15)`},3:{name:`Fractal Glass 3 (Complex Fractured Glass)`,refraction:75,distortion:70,transparency:60,blur:3,reflection:65,light:50,depth:60,density:35,edgeDistortion:80,tint:`rgba(180,200,255,0.12)`},"3.1":{name:`Fractal Glass 3.1 (Fine Fractal Distortion)`,refraction:40,distortion:85,transparency:70,blur:1,reflection:50,light:65,depth:25,density:65,edgeDistortion:35,tint:`rgba(230,220,255,0.14)`},"3.2":{name:`Fractal Glass 3.2 (Deep Refraction & Layered Glass)`,refraction:90,distortion:60,transparency:55,blur:4,reflection:85,light:75,depth:80,density:18,edgeDistortion:70,tint:`rgba(160,210,255,0.2)`},"3.3":{name:`Fractal Glass 3.3 (Premium Abstract Glass Distortion)`,refraction:85,distortion:95,transparency:50,blur:3,reflection:90,light:90,depth:90,density:40,edgeDistortion:90,tint:`rgba(255,200,240,0.18)`}};static LUT_SIZE=4096;static LUT_MASK=4095;static sinLUT=new Float32Array(4096);static cosLUT=new Float32Array(4096);static isLutReady=(()=>{let t=Math.PI*2/4096;for(let n=0;n<4096;n++)e.sinLUT[n]=Math.sin(n*t),e.cosLUT[n]=Math.cos(n*t);return!0})();static fastSin(t){let n=(4096/(Math.PI*2)*t|0)&4095;return e.sinLUT[n]}static fastCos(t){let n=(4096/(Math.PI*2)*t|0)&4095;return e.cosLUT[n]}static render(e,t=`1`,n={}){let r={...this.presets[t]||this.presets[1],...n},i=e.naturalWidth||e.width||800,a=e.naturalHeight||e.height||600,o=document.createElement(`canvas`);o.width=i,o.height=a;let s=o.getContext(`2d`,{willReadFrequently:!0}),c=document.createElement(`canvas`);c.width=i,c.height=a;let l=c.getContext(`2d`,{willReadFrequently:!0});l.drawImage(e,0,0,i,a);let u=l.getImageData(0,0,i,a),d=new Uint32Array(u.data.buffer),f=s.createImageData(i,a),p=new Uint32Array(f.data.buffer),m=f.data,h=r.refraction/100,g=r.distortion/100,_=Math.max(2,r.density),v=Math.max(16,180/(_/10)|0),y=h*5|0,b=this.fastSin,x=this.fastCos;for(let e=0;e<a;e++){let n=e*i,o=e/a;for(let s=0;s<i;s++){let c=s/i,l=0,f=0;if(t===`1`)l=b(e*.02+c*4)*(h*14),f=x(s*.02+o*4)*(h*14);else if(t===`2`){let t=s%v-(v>>1),n=e%v-(v>>1);l=t/v*(h*25)+b(s*.05)*5,f=n/v*(h*25)+x(e*.05)*5}else if(t===`3`){let t=s%60-30,n=e%60-30;l=t/30*(h*28*g),f=n/30*(h*28*g)}else if(t===`3.1`)l=(b(s*.15)+x(e*.2))*(g*18),f=(x(s*.2)-b(e*.15))*(g*18);else if(t===`3.2`){let t=b(e*.015+s*.01)*20,n=x(e*.04-s*.03)*15;l=(t+n)*h,f=(t-n)*h}else{let t=i>>1,n=a>>1,r=s-t,o=e-n,c=Math.sqrt(r*r+o*o)*.005*g;l=x(c)*(h*30),f=b(c)*(h*30)}let _=Math.min(i-1,Math.max(0,s+l|0)),S=Math.min(a-1,Math.max(0,e+f|0));if(y>0){let e=Math.min(i-1,Math.max(0,_+y)),t=Math.min(i-1,Math.max(0,_-y)),a=(S*i+e)*4,o=(S*i+_)*4,c=(S*i+t)*4,d=(n+s)*4,p=Math.min(60,Math.abs(l+f)*(r.light*.02)|0);m[d]=Math.min(255,u.data[a]+p),m[d+1]=Math.min(255,u.data[o+1]+p),m[d+2]=Math.min(255,u.data[c+2]+p),m[d+3]=u.data[o+3]}else p[n+s]=d[S*i+_]}}return s.putImageData(f,0,0),r.tint&&(s.fillStyle=r.tint,s.fillRect(0,0,i,a)),o}}})),B,V=o((()=>{B=class{static presets={fine:{name:`Fine Grain (35mm Modern)`,amount:25,size:1,softness:2,contrast:15,opacity:40,texture:20,randomness:50},classic:{name:`Classic Film (16mm Kodak)`,amount:45,size:2,softness:3,contrast:30,opacity:60,texture:40,randomness:70},cinematic:{name:`Cinematic Anamorphic`,amount:35,size:2,softness:4,contrast:45,opacity:50,texture:60,randomness:60},vintage:{name:`Vintage 1970s Silver Halide`,amount:65,size:3,softness:5,contrast:50,opacity:75,texture:70,randomness:85},heavy:{name:`Heavy Grain (8mm Gritty)`,amount:85,size:4,softness:2,contrast:70,opacity:90,texture:85,randomness:95}};static noiseTileCache=new Map;static getOrCreateNoiseTile(e,t,n,r){let i=`${e}_${t}_${n}_${r}`;if(this.noiseTileCache.has(i))return this.noiseTileCache.get(i);let a=document.createElement(`canvas`);a.width=256,a.height=256;let o=a.getContext(`2d`),s=o.createImageData(256,256),c=new Uint32Array(s.data.buffer),l=e/100,u=t/100,d=Math.round(n/100*.75*255),f=123456789,p=()=>(f^=f<<13,f^=f>>17,f^=f<<5,(f>>>0)/4294967296);for(let e=0;e<c.length;e++){let t=128+(p()+p()+p()-1.5)*1.5*(l*90),n=Math.min(255,Math.max(0,Math.round(128+(t-128)*(1+u))));c[e]=d<<24|n<<16|n<<8|n}if(o.putImageData(s,0,0),this.noiseTileCache.size>20){let e=this.noiseTileCache.keys().next().value;this.noiseTileCache.delete(e)}return this.noiseTileCache.set(i,a),a}static render(e,t=`classic`,n={}){let r={...this.presets[t]||this.presets.classic,...n},i=e.naturalWidth||e.width||800,a=e.naturalHeight||e.height||600,o=document.createElement(`canvas`);o.width=i,o.height=a;let s=o.getContext(`2d`,{alpha:!1,desynchronized:!0});s.drawImage(e,0,0,i,a);let c=this.getOrCreateNoiseTile(r.amount,r.contrast,r.opacity,r.size);return s.save(),s.globalCompositeOperation=`overlay`,r.softness>2&&(s.filter=`blur(${(r.softness/3).toFixed(1)}px)`),s.fillStyle=s.createPattern(c,`repeat`),s.fillRect(0,0,i,a),s.restore(),o}}})),H,U=o((()=>{H=class{static extractPalette(e,t=5){let n=document.createElement(`canvas`);n.width=100,n.height=100;let r=n.getContext(`2d`,{willReadFrequently:!0});r.drawImage(e,0,0,100,100);let i=r.getImageData(0,0,100,100).data,a={};for(let e=0;e<i.length;e+=16){if(i[e+3]<128)continue;let t=`${Math.round(i[e]/32)*32},${Math.round(i[e+1]/32)*32},${Math.round(i[e+2]/32)*32}`;a[t]=(a[t]||0)+1}let o=Object.entries(a).sort((e,t)=>t[1]-e[1]).slice(0,t);return o.length===0?[`#6366f1`,`#06b6d4`,`#ec4899`,`#8b5cf6`]:o.map(([e])=>{let[t,n,r]=e.split(`,`).map(Number);return this.rgbToHex(t,n,r)})}static renderGradientCanvas(e={}){let{colors:t=[`#6366f1`,`#06b6d4`,`#ec4899`],type:n=`linear`,angle:r=135,blur:i=0,opacity:a=100,width:o=1200,height:s=800,noise:c=0,makerSystem:l=1}=e,u=document.createElement(`canvas`);u.width=o,u.height=s;let d=u.getContext(`2d`);if(d.globalAlpha=a/100,n===`mesh`||l===3)this.drawMeshGradient(d,o,s,t,i);else if(n===`radial`){let e=o/2,n=s/2,r=Math.hypot(e,n),i=d.createRadialGradient(e,n,0,e,n,r);t.forEach((e,n)=>{i.addColorStop(n/(t.length-1||1),e)}),d.fillStyle=i,d.fillRect(0,0,o,s)}else{let e=r*Math.PI/180,n=o/2-Math.cos(e)*o/2,i=s/2-Math.sin(e)*s/2,a=o/2+Math.cos(e)*o/2,c=s/2+Math.sin(e)*s/2,l=d.createLinearGradient(n,i,a,c);t.forEach((e,n)=>{l.addColorStop(n/(t.length-1||1),e)}),d.fillStyle=l,d.fillRect(0,0,o,s)}if(i>0||n===`soft`||n===`blur`){let e=i||(n===`soft`?30:60),t=document.createElement(`canvas`);t.width=o,t.height=s,t.getContext(`2d`).drawImage(u,0,0),d.filter=`blur(${e}px)`,d.drawImage(t,0,0),d.filter=`none`}return(l===4||c>0)&&this.applyTextureAndLighting(d,o,s,c||15),u}static drawMeshGradient(e,t,n,r,i){e.fillStyle=r[0]||`#6366f1`,e.fillRect(0,0,t,n),[{x:t*.2,y:n*.2,r:Math.min(t,n)*.6,color:r[1]||`#06b6d4`},{x:t*.8,y:n*.3,r:Math.min(t,n)*.7,color:r[2]||`#ec4899`},{x:t*.3,y:n*.8,r:Math.min(t,n)*.65,color:r[3]||`#8b5cf6`},{x:t*.85,y:n*.85,r:Math.min(t,n)*.55,color:r[0]||`#3b82f6`}].forEach(r=>{let i=e.createRadialGradient(r.x,r.y,0,r.x,r.y,r.r);i.addColorStop(0,r.color),i.addColorStop(1,`transparent`),e.fillStyle=i,e.fillRect(0,0,t,n)})}static applyTextureAndLighting(e,t,n,r){let i=t/2,a=n/2,o=e.createRadialGradient(i,a,0,i,a,Math.hypot(i,a));o.addColorStop(0,`rgba(255, 255, 255, 0.15)`),o.addColorStop(.6,`transparent`),o.addColorStop(1,`rgba(0, 0, 0, 0.35)`),e.fillStyle=o,e.fillRect(0,0,t,n);let s=document.createElement(`canvas`);s.width=200,s.height=200;let c=s.getContext(`2d`),l=c.createImageData(200,200);for(let e=0;e<l.data.length;e+=4){let t=Math.random()*255;l.data[e]=t,l.data[e+1]=t,l.data[e+2]=t,l.data[e+3]=r/100*45}c.putImageData(l,0,0),e.save(),e.globalCompositeOperation=`overlay`,e.fillStyle=e.createPattern(s,`repeat`),e.fillRect(0,0,t,n),e.restore()}static getCssGradient(e,t,n){return e===`radial`?`radial-gradient(circle at center, ${n.join(`, `)})`:`linear-gradient(${t}deg, ${n.join(`, `)})`}static rgbToHex(e,t,n){return`#`+[e,t,n].map(e=>{let t=Math.min(255,Math.max(0,e)).toString(16);return t.length===1?`0`+t:t}).join(``)}}})),W,G=o((()=>{W=class{static layouts={1:{name:`Icon Sheet 1 (Minimal Grid)`,columns:4,rows:4,padding:16,margin:24,iconSize:64,background:`transparent`,showBorder:!1,cardBg:`transparent`},2:{name:`Icon Sheet 2 (Professional Marketplace)`,columns:4,rows:3,padding:24,margin:40,iconSize:80,background:`#0f1117`,showBorder:!0,cardBg:`#181b24`,badge:`MARKETPLACE READY`},3:{name:`Icon Sheet 3 (Premium Presentation Sheet)`,columns:3,rows:2,padding:36,margin:48,iconSize:96,background:`linear-gradient(135deg, #111319 0%, #1e1b2e 100%)`,showBorder:!0,cardBg:`rgba(255, 255, 255, 0.04)`,accentGlow:!0}};static render(e,t=`1`,n={}){let r={...this.layouts[t]||this.layouts[1],...n},i=parseInt(r.columns||4,10),a=parseInt(r.rows||Math.ceil((e.length||16)/i),10),o=parseInt(r.iconSize||72,10),s=parseInt(r.padding||20,10),c=parseInt(r.margin||30,10),l=o+s*2,u=o+s*2+(r.showLabels?24:0),d=i*l+c*2,f=a*u+c*2+(t===`3`?60:0),p=document.createElement(`canvas`);p.width=d,p.height=f;let m=p.getContext(`2d`);if(r.background&&r.background!==`transparent`){if(r.background.includes(`gradient`)){let e=m.createLinearGradient(0,0,d,f);e.addColorStop(0,`#10121a`),e.addColorStop(1,`#1c192d`),m.fillStyle=e}else m.fillStyle=r.background;m.fillRect(0,0,d,f)}let h=c;t===`3`&&(m.font=`bold 20px "Plus Jakarta Sans", sans-serif`,m.fillStyle=`#ffffff`,m.fillText(`CREATIVEFORGE ICON SYSTEM`,c,c+24),m.font=`12px "Plus Jakarta Sans", sans-serif`,m.fillStyle=`#94a3b8`,m.fillText(`${i}x${a} Vector Spec • Non-destructive Asset Suite`,c,c+46),h+=60);let g=0;for(let t=0;t<a;t++)for(let n=0;n<i;n++){let i=c+n*l,a=h+t*u;(r.showBorder||r.cardBg!==`transparent`)&&(m.save(),m.fillStyle=r.cardBg||`transparent`,m.strokeStyle=`rgba(255, 255, 255, 0.08)`,m.lineWidth=1,this.roundRect(m,i+4,a+4,l-8,u-8,8,!0,r.showBorder),m.restore());let d=e[g%e.length];if(d){let e=i+(l-o)/2,t=a+s;m.drawImage(d,e,t,o,o),r.showLabels&&(m.font=`11px monospace`,m.fillStyle=`#94a3b8`,m.textAlign=`center`,m.fillText(`icon_${String(g+1).padStart(2,`0`)}`,i+l/2,a+u-10),m.textAlign=`start`)}g++}return p}static roundRect(e,t,n,r,i,a,o,s){e.beginPath(),e.moveTo(t+a,n),e.lineTo(t+r-a,n),e.quadraticCurveTo(t+r,n,t+r,n+a),e.lineTo(t+r,n+i-a),e.quadraticCurveTo(t+r,n+i,t+r-a,n+i),e.lineTo(t+a,n+i),e.quadraticCurveTo(t,n+i,t,n+i-a),e.lineTo(t,n+a),e.quadraticCurveTo(t,n,t+a,n),e.closePath(),o&&e.fill(),s&&e.stroke()}}})),K,q,J=o((()=>{K=l(j()),N(),L(),G(),A(),q=class{static styles=[`outline`,`filled`,`flat`,`minimal`,`monochrome`,`gradient`,`3d`,`rounded`];static applyStyle(e,t=`flat`,n=512){let r=document.createElement(`canvas`);r.width=n,r.height=n;let i=r.getContext(`2d`),a=I.process(e,{tolerance:20}),o=n*.12,s=n-o*2;if(t===`rounded`||t===`3d`){if(i.save(),t===`3d`){let e=i.createLinearGradient(0,0,n,n);e.addColorStop(0,`#2d3345`),e.addColorStop(1,`#131620`),i.fillStyle=e,i.shadowColor=`rgba(0,0,0,0.6)`,i.shadowBlur=24,i.shadowOffsetY=12}else i.fillStyle=`#1e212b`;this.roundRect(i,o*.5,o*.5,n-o,n-o,n*.22,!0,!1),i.restore()}if(t===`outline`)i.drawImage(a,o,o,s,s),i.globalCompositeOperation=`source-in`,i.fillStyle=`#06b6d4`,i.fillRect(0,0,n,n),i.globalCompositeOperation=`source-over`;else if(t===`monochrome`)i.drawImage(a,o,o,s,s),i.globalCompositeOperation=`source-in`,i.fillStyle=`#ffffff`,i.fillRect(0,0,n,n),i.globalCompositeOperation=`source-over`;else if(t===`gradient`){i.drawImage(a,o,o,s,s),i.globalCompositeOperation=`source-in`;let e=i.createLinearGradient(0,0,n,n);e.addColorStop(0,`#6366f1`),e.addColorStop(.5,`#06b6d4`),e.addColorStop(1,`#ec4899`),i.fillStyle=e,i.fillRect(0,0,n,n),i.globalCompositeOperation=`source-over`}else if(t===`minimal`){let e=n*.22;i.drawImage(a,e,e,n-e*2,n-e*2)}else i.drawImage(a,o,o,s,s);return r}static async generateZipPack(e,t=`flat`,n=`creativeforge-icon-pack`,r=()=>{}){let i=new K.default,a=i.folder(`png`),o=i.folder(`svg`);r(10,`Normalizing icons and applying style...`);let s=[],c=[64,128,256,512];for(let n=0;n<e.length;n++){let i=e[n],l=this.applyStyle(i,t,512);s.push(l);let u=`icon_${String(n+1).padStart(2,`0`)}`;for(let e of c){let t=document.createElement(`canvas`);t.width=e,t.height=e;let n=t.getContext(`2d`);n.imageSmoothingQuality=`high`,n.drawImage(l,0,0,e,e);let r=await(await k.exportWithPpi(t,`png`,300)).arrayBuffer();a.file(`${u}_${e}x${e}_300ppi.png`,r)}let d=await M.trace(l,{colors:6,smoothness:70});o.file(`${u}.svg`,d.svgString),r(10+Math.round((n+1)/e.length*60),`Generated icon ${n+1} of ${e.length}...`)}r(75,`Generating master 300 PPI icon sheet...`);let l=W.render(s,`2`,{columns:4}),u=await(await k.exportWithPpi(l,`png`,300)).arrayBuffer();i.file(`icon-sheet-preview-300ppi.png`,u),i.file(`README.txt`,`CreativeForge AI — Icon Pack\nStyle: ${t.toUpperCase()}\nGenerated: ${new Date().toISOString()}\nContains: PNG (64, 128, 256, 512px), Authentic Vector SVGs, Master Sheet.\nhttps://creativeforge.ai\n`),r(90,`Compressing ZIP package...`);let d=await i.generateAsync({type:`blob`},e=>{r(90+Math.round(e.percent*.1),`Compressing ZIP package...`)});return r(100,`Done!`),d}static roundRect(e,t,n,r,i,a,o,s){e.beginPath(),e.moveTo(t+a,n),e.lineTo(t+r-a,n),e.quadraticCurveTo(t+r,n,t+r,n+a),e.lineTo(t+r,n+i-a),e.quadraticCurveTo(t+r,n+i,t+r-a,n+i),e.lineTo(t+a,n+i),e.quadraticCurveTo(t,n+i,t,n+i-a),e.lineTo(t,n+a),e.quadraticCurveTo(t,n,t+a,n),e.closePath(),o&&e.fill(),s&&e.stroke()}}})),Y,X,Z=o((()=>{Y=l(j()),N(),F(),L(),z(),V(),U(),G(),J(),A(),X=class{static async processSingleAsset(e,t,n){let r,i=`asset`;if(e instanceof File||e instanceof Blob){i=e.name||`image`;let t=URL.createObjectURL(e);r=new Image,r.src=t,await r.decode(),URL.revokeObjectURL(t)}else if(e instanceof HTMLImageElement)r=e,i=r.getAttribute(`data-name`)||`image`;else throw Error(`Unsupported asset format for batch processing`);let a=i.replace(/\.[^/.]+$/,``),o=null,s=null;if(t===`tool_vector_convert`||t===`tool_vector_trace`){let e=await M.trace(r,{colors:n.vectorColors||8,detail:n.vectorDetail||60,smoothness:n.vectorSmoothness||60,removeWhiteBg:n.vectorRemoveWhite!==!1});s=e.svgString,o=document.createElement(`canvas`),o.width=e.width,o.height=e.height;let t=o.getContext(`2d`),i=new Image,a=new Blob([s],{type:`image/svg+xml;charset=utf-8`}),c=URL.createObjectURL(a);i.src=c,await i.decode(),t.drawImage(i,0,0),URL.revokeObjectURL(c)}else if(t===`tool_upscaler`)o=P.process(r,n.upscaleResolution||`300PPI`,{sharpness:n.upscaleSharpness||75,detailEnhancement:n.upscaleDetail||60,noiseReduction:n.upscaleNoiseReduction||30});else if(t.includes(`remove`)||t.includes(`transparent`))o=I.process(r,{tolerance:n.bgTolerance||25,feather:n.bgFeather||2,shadowPreservation:n.bgShadowPreserve!==!1});else if(t.startsWith(`tool_fractal_glass`)){let e=t.replace(`tool_fractal_glass_`,``).replace(`_`,`.`),i=null;if(n.glassTint){let e=n.glassTint;i=`rgba(${parseInt(e.slice(1,3),16)||99},${parseInt(e.slice(3,5),16)||102},${parseInt(e.slice(5,7),16)||241},0.16)`}o=R.render(r,e,{refraction:n.glassRefraction||40,distortion:n.glassDistortion||30,transparency:n.glassTransparency||70,light:n.glassLight||50,tint:i})}else if(t===`tool_film_grain`)o=B.render(r,n.grainPreset||`classic`,{amount:n.grainAmount||45,size:n.grainSize||2,contrast:n.grainContrast||30});else if(t===`tool_gradient_extract`||t.startsWith(`tool_gradient_maker`)){let e=t.startsWith(`tool_gradient_maker`),i=e?parseInt(t.replace(`tool_gradient_maker_`,``),10):1;o=H.renderGradientCanvas({colors:n.gradientColors||[`#6366f1`,`#06b6d4`,`#ec4899`],type:n.gradientType||`linear`,angle:n.gradientAngle||135,blur:n.gradientBlur||0,noise:n.makerNoise||15,makerSystem:e?i:void 0,width:r.naturalWidth||1200,height:r.naturalHeight||800})}else if(t===`tool_icon_pack`)o=q.applyStyle(r,n.packStyle||`flat`,512);else if(t.startsWith(`tool_icon_sheet`)){let e=t.replace(`tool_icon_sheet_`,``);o=W.render([r],e,{columns:n.sheetColumns||4,padding:n.sheetPadding||20,showLabels:n.sheetLabels||!1})}else o=document.createElement(`canvas`),o.width=r.naturalWidth||800,o.height=r.naturalHeight||600,o.getContext(`2d`).drawImage(r,0,0);return{baseName:a,pngBlob:await k.exportWithPpi(o,`png`,300),svgString:s,width:o.width,height:o.height}}static async runBatch({files:e,tool:t,params:n={},concurrency:r=4,onProgress:i=()=>{}}){let a=e.length,o=0,s=0,c=Date.now(),l=new Y.default,u=l.folder(`300ppi_images`),d=t===`tool_vector_convert`||t===`tool_vector_trace`,f=d?l.folder(`svg_vectors`):null,p={generator:`CreativeForge AI — Batch Studio Engine`,timestamp:new Date().toISOString(),toolApplied:t,resolutionDpi:300,totalFiles:a,items:[]};i({current:0,total:a,percent:0,currentFileName:`Starting batch pipeline...`,status:`Initializing 300 PPI batch engine for ${a} images...`,speed:0});let m=0,h=async()=>{for(;m<a;){let r=m++,l=e[r],h=l.name||`image_${String(r+1).padStart(3,`0`)}.png`;try{let e=await this.processSingleAsset(l,t,n),r=await e.pngBlob.arrayBuffer(),i=`${e.baseName}_${t.replace(`tool_`,``)}_300ppi.png`;u.file(i,r),d&&e.svgString&&f&&f.file(`${e.baseName}.svg`,e.svgString),p.items.push({originalName:h,outputName:i,width:e.width,height:e.height,ppi:300,hasSvg:!!e.svgString}),o++}catch(e){console.warn(`[Batch Error on item ${h}]:`,e),s++}let g=(Date.now()-c)/1e3,_=g>0?(o/g).toFixed(1):0,v=Math.min(92,Math.round((o+s)/a*92));i({current:o+s,total:a,percent:v,currentFileName:h,status:`Processed ${o} of ${a} images (${_} img/sec @ 300 PPI)`,speed:parseFloat(_)}),await new Promise(e=>setTimeout(e,0))}},g=[],_=Math.min(r,a);for(let e=0;e<_;e++)g.push(h());await Promise.all(g),l.file(`batch-manifest.json`,JSON.stringify(p,null,2)),l.file(`README.txt`,[`====================================================`,`CreativeForge AI — High-Resolution 300 PPI Batch Export`,`====================================================`,`Tool Applied: ${t.replace(`tool_`,``).toUpperCase()}`,`Total Assets Processed: ${o}`,`Print Density: 300 PPI (pHYs standard print calibration embedded)`,`Generated: ${new Date().toISOString()}`,`====================================================`,`https://creativeforge.ai`].join(`
`)),i({current:a,total:a,percent:95,currentFileName:`Packaging ZIP...`,status:`Packaging all ${o} assets into 300 PPI master ZIP...`,speed:0});let v=await l.generateAsync({type:`blob`,compression:`DEFLATE`,compressionOptions:{level:6}},e=>{let t=95+Math.round(e.percent*.05);i({current:a,total:a,percent:Math.min(100,t),currentFileName:`Compressing archive...`,status:`Compressing ZIP archive (${e.percent.toFixed(0)}%)...`,speed:0})});return i({current:a,total:a,percent:100,currentFileName:`Complete!`,status:`Successfully completed ${o} images @ 300 PPI!`,speed:0}),{zipBlob:v,total:a,processed:o,failed:s,durationMs:Date.now()-c}}}})),Q,ee=o((()=>{b(),C(),O(),A(),Z(),Q=class e{static generateDemo500Batch(){let e=[],t=[`#6366f1`,`#06b6d4`,`#ec4899`,`#10b981`,`#f59e0b`,`#8b5cf6`,`#3b82f6`];for(let n=1;n<=500;n++){let r=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#121622"/><circle cx="300" cy="200" r="130" fill="${t[n%t.length]}" opacity="0.85"/><text x="300" y="208" fill="#ffffff" font-size="28" font-family="sans-serif" font-weight="bold" text-anchor="middle">ASSET #${n}</text><text x="300" y="240" fill="rgba(255,255,255,0.7)" font-size="14" font-family="sans-serif" text-anchor="middle">CreativeForge 300 PPI Batch</text></svg>`,i=new Blob([r],{type:`image/svg+xml`});i.name=`batch_asset_${String(n).padStart(3,`0`)}.svg`,e.push(i)}return e}static openUploadModal(t){let n=document.createElement(`div`);n.className=`modal-backdrop`,n.innerHTML=`
      <div class="modal-container" style="max-width: 580px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:6px; background:var(--accent-gradient-glow); display:flex; align-items:center; justify-content:center; color:var(--accent-secondary);">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            </div>
            <div>
              <h3 class="modal-title">Universal Asset Upload</h3>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:700;">SUPPORTS UP TO 500+ FILES IN BATCH</div>
            </div>
          </div>
          <button class="btn-icon" id="btn-close-modal">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">
            Upload single or batch images (up to 500+ simultaneously). Transform across any CreativeForge tool and export with embedded 300 PPI print metadata.
          </p>

          <div id="modal-dropzone" class="canvas-empty-state" style="padding: 26px; margin-bottom: 14px; width: 100%;">
            <div class="empty-state-icon" style="width: 44px; height: 44px; font-size: 1.3rem;">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            </div>
            <h4 style="font-size: 0.95rem; margin-bottom: 4px;">Drag & drop images here (up to 500+)</h4>
            <p style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 12px;">JPG, PNG, WEBP, or SVG • Full Batch Pipeline</p>
            <div style="display:flex; justify-content:center; gap:8px;">
              <button class="btn btn-secondary btn-sm" id="btn-browse-files">Browse Local Files</button>
              <button class="btn btn-glass btn-sm" id="btn-load-500-demo" style="border-color:var(--accent-primary); color:var(--accent-primary);" title="Instant 500 demo images generator">
                ⚡ Demo 500-Batch
              </button>
            </div>
            <input type="file" id="modal-file-input" multiple accept="image/jpeg,image/png,image/webp,image/svg+xml" style="display:none;" />
          </div>

          <!-- Dynamic Batch Notification Card -->
          <div id="batch-stats-card" style="display:none; background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.3); border-radius:8px; padding:10px 14px; margin-bottom:12px; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700; color:var(--text-primary); font-size:0.85rem;" id="batch-stats-title">⚡ Batch Queue: 500 Images Selected</div>
              <div style="font-size:0.72rem; color:var(--text-muted);" id="batch-stats-subtitle">Ready for Parallel 300 PPI Processing & Master ZIP Export</div>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-fast-batch-start" style="padding:4px 10px; font-size:0.75rem;">
              Process All 500 ⚡
            </button>
          </div>

          <div id="upload-preview-list" style="display: flex; flex-direction: column; gap: 6px; max-height: 160px; overflow-y: auto;"></div>

          <div id="upload-progress-container" style="display: none; margin-top: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px;">
              <span id="upload-progress-status">Syncing batch assets & preserving originals...</span>
              <span id="upload-progress-percent">0%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
              <div id="upload-progress-bar" style="width: 0%; height: 100%; background: var(--accent-gradient); transition: width 0.2s;"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-upload">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btn-confirm-upload" disabled>Start Creative Workspace</button>
        </div>
      </div>
    `,document.body.appendChild(n);let r=[],i=n.querySelector(`#modal-dropzone`),a=n.querySelector(`#modal-file-input`),o=n.querySelector(`#upload-preview-list`),s=n.querySelector(`#btn-confirm-upload`),c=n.querySelector(`#upload-progress-container`),l=n.querySelector(`#upload-progress-bar`),u=n.querySelector(`#upload-progress-percent`),d=n.querySelector(`#batch-stats-card`),f=n.querySelector(`#batch-stats-title`),p=n.querySelector(`#btn-fast-batch-start`),m=n.querySelector(`#btn-load-500-demo`),h=()=>n.remove();n.querySelector(`#btn-close-modal`).onclick=h,n.querySelector(`#btn-cancel-upload`).onclick=h,n.querySelector(`#btn-browse-files`).onclick=()=>a.click(),i.onclick=e=>{e.target.id!==`btn-browse-files`&&e.target.id!==`btn-load-500-demo`&&a.click()},m.onclick=t=>{t.stopPropagation(),g(e.generateDemo500Batch()),D.success(`Generated 500 demo image assets in batch queue!`)},i.ondragover=e=>{e.preventDefault(),i.classList.add(`drag-active`)},i.ondragleave=()=>i.classList.remove(`drag-active`),i.ondrop=e=>{e.preventDefault(),i.classList.remove(`drag-active`),e.dataTransfer.files.length&&g(Array.from(e.dataTransfer.files))},a.onchange=()=>{a.files.length&&g(Array.from(a.files))};function g(t){if(r=t.filter(e=>e.type.startsWith(`image/`)||e.name.endsWith(`.svg`)),r.length===0){D.error(`Please upload valid image files (JPG, PNG, WEBP, SVG)`);return}o.innerHTML=``,r.length>1?(d.style.display=`flex`,f.textContent=`⚡ Batch Mode: ${r.length} Images Selected`,p.textContent=`Process All ${r.length} ⚡`,p.onclick=()=>{h(),e.openBatchModal(r)},s.textContent=`Open Batch Workspace (${r.length} Images)`):(d.style.display=`none`,s.textContent=`Start Creative Workspace`);let n=Math.min(r.length,12);for(let e=0;e<n;e++){let t=r[e],n=document.createElement(`div`);n.style.cssText=`display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:var(--bg-tertiary); border-radius:6px; font-size:0.78rem;`,n.innerHTML=`
          <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
            <span style="color:var(--accent-secondary); font-weight:700;">#${e+1}</span>
            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:260px;">${t.name}</span>
          </div>
          <span style="color:var(--text-muted); font-size:0.72rem;">${((t.size||5e3)/1024).toFixed(1)} KB</span>
        `,o.appendChild(n)}if(r.length>n){let e=document.createElement(`div`);e.style.cssText=`text-align:center; padding:6px; font-size:0.75rem; color:var(--accent-secondary); font-weight:600;`,e.textContent=`...and ${r.length-n} more images queued for 300 PPI batch processing`,o.appendChild(e)}s.disabled=!1}s.onclick=async()=>{if(r.length===0)return;s.disabled=!0,c.style.display=`block`;let e=r[0],n=new FileReader;n.onload=async n=>{let i=new Image;i.src=n.target.result,await i.decode(),l.style.width=`60%`,u.textContent=`60%`;try{let e=y.getState().project,t=r.slice(0,50);S.uploadFiles(t,e?.id).catch(()=>{})}catch{}l.style.width=`100%`,u.textContent=`100%`,y.setState({originalImage:i,originalImageUrl:i.src,originalFileName:e.name,originalWidth:i.naturalWidth||i.width||1200,originalHeight:i.naturalHeight||i.height||800,batchAssets:r}),D.success(`Loaded ${r.length>1?`${r.length} images`:`"${e.name}"`} into Creative Studio!`),h(),t&&t(i)},n.readAsDataURL(e)}}static openBatchModal(e,t=`tool_upscaler`,n=null,r=null){if(!e||e.length===0){D.error(`No images available for batch processing.`);return}let i=y.getState(),a=t||i.activeTool||`tool_upscaler`;n||{...i.params};let o=document.createElement(`div`);o.className=`modal-backdrop`,o.innerHTML=`
      <div class="modal-container" style="max-width: 640px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:32px; height:32px; border-radius:8px; background:var(--accent-gradient-glow); display:flex; align-items:center; justify-content:center; color:var(--accent-secondary); font-size:1.1rem; font-weight:700;">
              ⚡
            </div>
            <div>
              <h3 class="modal-title">Batch Creative Studio (${e.length} Images)</h3>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:700; letter-spacing:0.5px;">
                HIGH-RESOLUTION 300 PPI PARALLEL PROCESSING & BULK EXPORT
              </div>
            </div>
          </div>
          <button class="btn-icon" id="btn-close-batch">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="modal-body">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:16px;">
            <div style="background:var(--bg-tertiary); padding:12px; border-radius:8px; border:1px solid var(--border-subtle);">
              <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Batch Queue</div>
              <div style="font-size:1.1rem; font-weight:700; color:var(--text-primary);">${e.length} Images Queued</div>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:600; margin-top:2px;">Parallel 4x Worker Pool</div>
            </div>
            <div style="background:rgba(6,182,212,0.1); padding:12px; border-radius:8px; border:1px solid rgba(6,182,212,0.3);">
              <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Print Output Standard</div>
              <div style="font-size:1.1rem; font-weight:700; color:var(--accent-secondary);">300 PPI Master</div>
              <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">pHYs & JFIF Encoded / Lossless</div>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label">Select Creative Studio Tool for All ${e.length} Images</label>
            <select id="batch-tool-select" style="width:100%; font-weight:600;">
              <option value="tool_upscaler" ${a===`tool_upscaler`?`selected`:``}>AI Image Upscaler (✦ 300 PPI Print Master)</option>
              <option value="tool_vector_convert" ${a.includes(`vector`)?`selected`:``}>Image → Vector (Authentic Scalable SVG + 300 PPI)</option>
              <option value="tool_bg_remove_white" ${a.includes(`bg_`)||a.includes(`remove`)?`selected`:``}>Remove Background (Transparent 300 PPI PNG)</option>
              <option value="tool_film_grain" ${a===`tool_film_grain`?`selected`:``}>Film Grain Engine (35mm Analog Texture 300 PPI)</option>
              <option value="tool_fractal_glass_1" ${a.includes(`fractal`)?`selected`:``}>Fractal Glass Shader (Prism Distortion 300 PPI)</option>
              <option value="tool_gradient_extract" ${a.includes(`gradient`)?`selected`:``}>Image → Gradient Artwork (Multi-Stop 300 PPI)</option>
              <option value="tool_icon_pack" ${a===`tool_icon_pack`?`selected`:``}>Icon Pack Generator (Multi-Scale 300 PPI Icons)</option>
            </select>
          </div>

          <!-- Progress Section -->
          <div style="background:var(--bg-tertiary); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; margin-top:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span id="batch-spinner" style="display:none; width:14px; height:14px; border:2px solid var(--accent-secondary); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></span>
                <span id="batch-status-text" style="font-size:0.85rem; font-weight:600;">Ready to start processing ${e.length} assets</span>
              </div>
              <span id="batch-pct-badge" style="font-family:var(--font-mono); font-size:1.1rem; font-weight:700; color:var(--accent-secondary);">0%</span>
            </div>

            <div style="width:100%; height:8px; background:var(--bg-primary); border-radius:4px; overflow:hidden; margin-bottom:10px;">
              <div id="batch-progress-bar" style="width:0%; height:100%; background:var(--accent-gradient); transition:width 0.15s ease-out;"></div>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">
              <span id="batch-counter-text">0 / ${e.length} Images</span>
              <span id="batch-speed-text">0.0 img/sec @ 300 PPI</span>
            </div>

            <!-- Live Stream Log Viewport -->
            <div id="batch-log-view" style="margin-top:12px; max-height:120px; overflow-y:auto; font-family:var(--font-mono); font-size:0.72rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:4px; background:rgba(0,0,0,0.3); padding:8px 10px; border-radius:6px;">
              <div>[Ready] Click "Start Batch Processing" below to process all ${e.length} images.</div>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="justify-content:space-between;">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-batch">Close</button>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-primary btn-sm" id="btn-start-batch" style="box-shadow:0 0 15px rgba(99,102,241,0.4);">
              ⚡ Run ${e.length}-Image Batch Processing
            </button>
            <button class="btn btn-primary btn-sm" id="btn-download-batch-zip" style="display:none; background:var(--accent-cyan); color:#000; font-weight:700;">
              📦 Download ${e.length} Assets ZIP (300 PPI)
            </button>
          </div>
        </div>
      </div>
    `,document.body.appendChild(o);let s=()=>o.remove();o.querySelector(`#btn-close-batch`).onclick=s,o.querySelector(`#btn-cancel-batch`).onclick=s;let c=o.querySelector(`#batch-tool-select`),l=o.querySelector(`#btn-start-batch`),u=o.querySelector(`#btn-download-batch-zip`),d=o.querySelector(`#batch-progress-bar`),f=o.querySelector(`#batch-pct-badge`),p=o.querySelector(`#batch-status-text`),m=o.querySelector(`#batch-counter-text`),h=o.querySelector(`#batch-speed-text`),g=o.querySelector(`#batch-spinner`),_=o.querySelector(`#batch-log-view`),v=null;l.onclick=async()=>{l.disabled=!0,c.disabled=!0,g.style.display=`inline-block`,_.innerHTML=`<div>[Starting] Pipeline initialized for ${e.length} images...</div>`;let t=c.value,n={...y.getState().params};try{let i=await X.runBatch({files:e,tool:t,params:n,concurrency:4,onProgress:({current:e,total:t,percent:n,currentFileName:r,status:i,speed:a})=>{d.style.width=`${n}%`,f.textContent=`${n}%`,p.textContent=i,m.textContent=`${e} / ${t} Images`,h.textContent=`${a} img/sec @ 300 PPI`;let o=document.createElement(`div`);o.textContent=`✓ [${String(e).padStart(3,`0`)}] ${r} → 300 PPI`,_.appendChild(o),_.children.length>50&&_.removeChild(_.children[0]),_.scrollTop=_.scrollHeight}});v=i.zipBlob,g.style.display=`none`,l.style.display=`none`,u.style.display=`inline-flex`;let a=URL.createObjectURL(v),o=document.createElement(`a`);o.href=a;let s=`creativeforge-batch-${e.length}-assets-300ppi.zip`;o.download=s,document.body.appendChild(o),o.click(),document.body.removeChild(o),D.success(`Processed all ${e.length} images & downloaded 300 PPI Master ZIP!`),u.onclick=()=>{let e=URL.createObjectURL(v),t=document.createElement(`a`);t.href=e,t.download=s,document.body.appendChild(t),t.click(),document.body.removeChild(t)},r&&r(i)}catch(e){g.style.display=`none`,l.disabled=!1,c.disabled=!1,D.error(`Batch processing failed: `+e.message)}}}static openExportModal(e,t=null){let n=y.getState(),r=n.activeTool,i=n.originalFileName?n.originalFileName.replace(/\.[^/.]+$/,``):`creativeforge`,a=e?.width||1200,o=e?.height||800,s=document.createElement(`div`);s.className=`modal-backdrop`,s.innerHTML=`
      <div class="modal-container" style="max-width: 520px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:6px; background:var(--accent-gradient-glow); display:flex; align-items:center; justify-content:center; color:var(--accent-secondary);">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </div>
            <div>
              <h3 class="modal-title">Export Creative Asset</h3>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:600;">HIGH-RESOLUTION 300 PPI PRINT ENGINE</div>
            </div>
          </div>
          <button class="btn-icon" id="btn-close-export">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="control-group">
            <label class="control-label">File Name</label>
            <input type="text" id="export-filename" value="${i}-${r.replace(`tool_`,``)}" style="width:100%;" />
          </div>

          <div class="control-group">
            <label class="control-label">Export Format</label>
            <select id="export-format" style="width:100%;">
              <option value="png" selected>PNG (Lossless 300 PPI Master Print)</option>
              <option value="jpg">JPG (High-Density 300 DPI Photo)</option>
              ${t||r.includes(`vector`)?`<option value="svg">SVG (Authentic Scalable Vector Paths)</option>`:``}
              ${r.includes(`icon`)?`<option value="zip">ZIP (Full Multi-Size Icon Pack)</option>`:``}
            </select>
          </div>

          <div class="control-group">
            <label class="control-label">Print Density & Resolution (PPI/DPI)</label>
            <select id="export-ppi" style="width:100%;">
              <option value="300" selected>300 PPI (Professional Print Standard - Photoshop & Press Ready)</option>
              <option value="150">150 PPI (Medium Density / Retina Web)</option>
              <option value="72">72 PPI (Legacy Standard Web Display)</option>
            </select>
          </div>

          <div class="control-group">
            <label class="control-label">Output Pixel Resolution</label>
            <select id="export-resolution" style="width:100%;">
              <option value="original" selected>Original Canvas (${a} × ${o} px)</option>
              <option value="2K">2K QHD (2560 × 1440 px)</option>
              <option value="4K">4K Ultra HD (3840 × 2160 px)</option>
              <option value="8K">8K Master Cinema (7680 × 4320 px)</option>
              <option value="300PPI">300 PPI Ultra Print Master (4500 × 3000 px)</option>
            </select>
          </div>

          <!-- Live Physical Print Dimensions Calculator -->
          <div id="print-calc-card" style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.25); padding:14px; border-radius:8px; font-size:0.8rem; margin-top:14px;">
            <div style="font-weight:700; color:var(--text-primary); margin-bottom:4px;">Print Dimensions @ <span id="calc-ppi-badge">300</span> PPI:</div>
            <div id="calc-dim-text" style="color:var(--accent-secondary); font-family:var(--font-mono); font-weight:600;">
              ${(a/300).toFixed(1)}" × ${(o/300).toFixed(1)}" (${(a/300*2.54).toFixed(1)} × ${(o/300*2.54).toFixed(1)} cm)
            </div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">
              PNG pHYs and JPEG JFIF physical density metadata will be embedded into the downloaded binary.
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-export">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btn-download-export">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download 300 PPI Asset
          </button>
        </div>
      </div>
    `,document.body.appendChild(s);let c=()=>s.remove();s.querySelector(`#btn-close-export`).onclick=c,s.querySelector(`#btn-cancel-export`).onclick=c;let l=s.querySelector(`#export-ppi`),u=s.querySelector(`#export-resolution`),d=s.querySelector(`#calc-ppi-badge`),f=s.querySelector(`#calc-dim-text`),p=()=>{let e=parseInt(l.value,10);d.textContent=e;let t=a,n=o,r=u.value;r===`2K`?(t=2560,n=Math.round(o/a*2560)):r===`4K`?(t=3840,n=Math.round(o/a*3840)):r===`8K`?(t=7680,n=Math.round(o/a*7680)):r===`300PPI`&&(t=4500,n=Math.round(o/a*4500));let i=(t/e).toFixed(1),s=(n/e).toFixed(1),c=(t/e*2.54).toFixed(1),p=(n/e*2.54).toFixed(1);f.textContent=`${t} × ${n} px → ${i}" × ${s}" (${c} × ${p} cm)`};l.onchange=p,u.onchange=p,s.querySelector(`#btn-download-export`).onclick=async()=>{let r=s.querySelector(`#export-filename`).value.trim()||`export`,i=s.querySelector(`#export-format`).value,d=parseInt(l.value,10),f=u.value,p=`${r}.${i}`,m=null;if(i===`svg`&&t)m=new Blob([t],{type:`image/svg+xml;charset=utf-8`});else{let t=e;if(f!==`original`){let n=a,r=o;f===`2K`?(n=2560,r=Math.round(o/a*2560)):f===`4K`?(n=3840,r=Math.round(o/a*3840)):f===`8K`?(n=7680,r=Math.round(o/a*7680)):f===`300PPI`&&(n=4500,r=Math.round(o/a*4500)),t=document.createElement(`canvas`),t.width=n,t.height=r;let i=t.getContext(`2d`);i.imageSmoothingQuality=`high`,i.drawImage(e,0,0,n,r)}m=await k.exportWithPpi(t,i,d,.95)}if(m){let e=URL.createObjectURL(m),t=document.createElement(`a`);t.href=e,t.download=p,document.body.appendChild(t),t.click(),document.body.removeChild(t);try{await S.saveExport({filename:p,dataBase64:e,format:i,resolution:`${f}_${d}PPI`,projectId:n.project?.id})}catch{}D.success(`Exported ${p} with ${d} PPI print metadata!`),c()}}}static openAuthModal(e){let t=document.createElement(`div`);t.className=`modal-backdrop`,t.innerHTML=`
      <div class="modal-container" style="max-width: 440px;">
        <div class="modal-header">
          <h3 class="modal-title">Switch Demo SaaS Account</h3>
          <button class="btn-icon" id="btn-close-auth">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:18px;">
            Test the application using pre-configured role profiles to evaluate user, pro designer, and admin permissions.
          </p>

          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn-secondary" id="auth-role-pro" style="justify-content:space-between; padding:12px 16px;">
              <div style="text-align:left;">
                <div style="font-weight:700;">Elena Rostova (Pro Plan)</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">450 Credits • 8K Exports • All Pro Features</div>
              </div>
              <span class="badge badge-indigo">PRO</span>
            </button>

            <button class="btn btn-secondary" id="auth-role-admin" style="justify-content:space-between; padding:12px 16px;">
              <div style="text-align:left;">
                <div style="font-weight:700;">Admin CreativeForge</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Full Platform Management & Analytics Access</div>
              </div>
              <span class="badge badge-cyan">ADMIN</span>
            </button>

            <button class="btn btn-secondary" id="auth-role-free" style="justify-content:space-between; padding:12px 16px;">
              <div style="text-align:left;">
                <div style="font-weight:700;">Alex Vance (Free Tier)</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">10 Credits • 2K Max Export</div>
              </div>
              <span class="badge badge-warning">FREE</span>
            </button>
          </div>
        </div>
      </div>
    `,document.body.appendChild(t);let n=()=>t.remove();t.querySelector(`#btn-close-auth`).onclick=n;let r=async t=>{try{let r=await S.switchDemo(t);y.setState({user:r.user}),D.success(`Signed in as ${r.user.name} (${r.user.role.toUpperCase()})`),n(),e&&e(r.user)}catch(e){D.error(e.message)}};t.querySelector(`#auth-role-pro`).onclick=()=>r(`pro`),t.querySelector(`#auth-role-admin`).onclick=()=>r(`admin`),t.querySelector(`#auth-role-free`).onclick=()=>r(`free`)}}})),$,te=o((()=>{b(),C(),O(),ee(),N(),z(),V(),U(),L(),G(),J(),F(),A(),$=class{constructor(e){this.container=e,this.canvas=null,this.processedCanvas=null,this.processedSvg=null,this.isDraggingSlider=!1,this.isPanning=!1,this.startPan={x:0,y:0},this.toolCache=new Map,this.rafPending=!1,this.currentBatchIndex=0}render(){let e=y.getState(),t=e.user,n=e.project,r=e.batchAssets||[];this.container.innerHTML=`
      <div class="studio-container">
        <!-- TOP TOOLBAR -->
        <header class="studio-navbar">
          <div class="studio-nav-brand">
            <div class="brand-logo">CF</div>
            <div class="brand-title">
              <span>CreativeForge AI</span>
              <span class="brand-subtitle">AI Creative Studio</span>
            </div>
            <input type="text" id="project-name-input" class="studio-project-title-input" value="${n.name}" title="Click to rename project" />
          </div>

          <div class="studio-nav-center">
            <button class="btn btn-glass btn-sm" id="btn-top-upload" title="Universal Upload">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              Upload
            </button>
            <button class="btn btn-icon btn-sm" id="btn-undo" title="Undo (Ctrl+Z)"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a5 5 0 015 5v2m-15-7l4-4m-4 4l4 4"/></svg></button>
            <button class="btn btn-icon btn-sm" id="btn-redo" title="Redo (Ctrl+Y)"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4"/></svg></button>
            <div style="width:1px; height:16px; background:var(--border-medium); margin:0 2px;"></div>
            <button class="btn btn-icon btn-sm" id="btn-reset" title="Reset Changes"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg></button>
            <div style="width:1px; height:16px; background:var(--border-medium); margin:0 2px;"></div>
            <!-- Compare Mode Toggle -->
            <button class="btn btn-sm ${e.compareMode===`slider`?`btn-primary`:`btn-glass`}" id="btn-mode-slider" title="Interactive Slider Compare">Slider</button>
            <button class="btn btn-sm ${e.compareMode===`split`?`btn-primary`:`btn-glass`}" id="btn-mode-split" title="Split Screen">Split</button>
            <button class="btn btn-sm ${e.compareMode===`side-by-side`?`btn-primary`:`btn-glass`}" id="btn-mode-side" title="Side by Side">Side-by-Side</button>
          </div>

          <div class="studio-nav-right">
            <div class="credit-pill" id="user-credits-pill" title="Remaining Credits">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>${t.credits} Credits</span>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-save-project">Save Project</button>
            ${r.length>1?`
              <button class="btn btn-glass btn-sm" id="btn-top-batch-export" style="border-color:var(--accent-secondary); color:var(--accent-secondary); font-weight:700;" title="Batch Export all ${r.length} assets in 300 PPI ZIP">
                ⚡ Batch (${r.length})
              </button>
            `:``}
            <button class="btn btn-primary btn-sm" id="btn-top-export">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Export
            </button>
            <button class="btn btn-icon btn-sm" id="btn-switch-account" title="Switch Demo Account (Free/Pro/Admin)">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </button>
          </div>
        </header>

        <!-- STUDIO WORKSPACE BODY -->
        <div class="studio-body">
          <!-- LEFT SIDEBAR: TOOL DIRECTORY -->
          <aside class="studio-sidebar-left" id="studio-sidebar-left">
            <div class="tool-category-group">
              <div class="tool-category-header">
                <span>IMAGE STUDIO</span>
                <span class="badge badge-indigo">9 Tools</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_gradient_extract`?`active`:``}" data-tool="tool_gradient_extract">
                <span class="tool-item-icon">◈</span>
                <span>Image → Gradient</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_upscaler`?`active`:``}" data-tool="tool_upscaler">
                <span class="tool-item-icon">⚡</span>
                <span>AI Image Upscaler</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_film_grain`?`active`:``}" data-tool="tool_film_grain">
                <span class="tool-item-icon">🎞</span>
                <span>Film Grain Engine</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_fractal_glass_1`?`active`:``}" data-tool="tool_fractal_glass_1">
                <span class="tool-item-icon">❄</span>
                <span>Fractal Glass 1</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_fractal_glass_2`?`active`:``}" data-tool="tool_fractal_glass_2">
                <span class="tool-item-icon">❄</span>
                <span>Fractal Glass 2</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_fractal_glass_3`?`active`:``}" data-tool="tool_fractal_glass_3">
                <span class="tool-item-icon">❄</span>
                <span>Fractal Glass 3</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_fractal_glass_3_1`?`active`:``}" data-tool="tool_fractal_glass_3_1">
                <span class="tool-item-icon">❄</span>
                <span>Fractal Glass 3.1</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_fractal_glass_3_2`?`active`:``}" data-tool="tool_fractal_glass_3_2">
                <span class="tool-item-icon">❄</span>
                <span>Fractal Glass 3.2</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_fractal_glass_3_3`?`active`:``}" data-tool="tool_fractal_glass_3_3">
                <span class="tool-item-icon">❄</span>
                <span>Fractal Glass 3.3</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_gradient_maker_1`?`active`:``}" data-tool="tool_gradient_maker_1">
                <span class="tool-item-icon">✦</span>
                <span>Gradient Maker 1</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_gradient_maker_2`?`active`:``}" data-tool="tool_gradient_maker_2">
                <span class="tool-item-icon">✦</span>
                <span>Gradient Maker 2</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_gradient_maker_3`?`active`:``}" data-tool="tool_gradient_maker_3">
                <span class="tool-item-icon">✦</span>
                <span>Gradient Maker 3</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_gradient_maker_4`?`active`:``}" data-tool="tool_gradient_maker_4">
                <span class="tool-item-icon">✦</span>
                <span>Gradient Maker 4</span>
              </div>
            </div>

            <div class="tool-category-group" style="border-top: 1px solid var(--border-subtle); margin-top: 6px;">
              <div class="tool-category-header">
                <span>VECTOR & ICON STUDIO</span>
                <span class="badge badge-cyan">8 Tools</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_vector_convert`?`active`:``}" data-tool="tool_vector_convert">
                <span class="tool-item-icon">⬡</span>
                <span>Image → Vector (SVG)</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_vector_trace`?`active`:``}" data-tool="tool_vector_trace">
                <span class="tool-item-icon">⟡</span>
                <span>Vector Trace</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_bg_remove_white`?`active`:``}" data-tool="tool_bg_remove_white">
                <span class="tool-item-icon">✂</span>
                <span>Remove White Background</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_bg_transparent`?`active`:``}" data-tool="tool_bg_transparent">
                <span class="tool-item-icon">▨</span>
                <span>Transparent Background</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_icon_sheet_1`?`active`:``}" data-tool="tool_icon_sheet_1">
                <span class="tool-item-icon">田</span>
                <span>Icon Sheet 1 (Minimal)</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_icon_sheet_2`?`active`:``}" data-tool="tool_icon_sheet_2">
                <span class="tool-item-icon">田</span>
                <span>Icon Sheet 2 (Marketplace)</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_icon_sheet_3`?`active`:``}" data-tool="tool_icon_sheet_3">
                <span class="tool-item-icon">田</span>
                <span>Icon Sheet 3 (Presentation)</span>
              </div>
              <div class="tool-nav-item ${e.activeTool===`tool_icon_pack`?`active`:``}" data-tool="tool_icon_pack">
                <span class="tool-item-icon">📦</span>
                <span>Icon Pack Maker (ZIP)</span>
              </div>
            </div>
          </aside>

          <!-- CENTER CANVAS VIEWPORT -->
          <main class="studio-canvas-container" id="canvas-container">
            ${r.length>1?`
              <!-- Dynamic Batch Processing & Queue Bar -->
              <div class="batch-queue-bar" id="studio-batch-bar" style="display:flex; align-items:center; justify-content:space-between; background:rgba(18,20,29,0.95); border:1px solid rgba(99,102,241,0.3); border-radius:10px; padding:8px 14px; margin-bottom:12px; width:100%; box-sizing:border-box; box-shadow:0 4px 20px rgba(0,0,0,0.5);">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="badge badge-cyan" style="font-weight:700; padding:3px 8px;">⚡ BATCH QUEUE (${r.length})</span>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <button class="btn btn-icon btn-sm" id="btn-batch-prev" title="Previous Image in Batch">◀</button>
                    <span style="font-size:0.75rem; color:var(--text-secondary); font-family:var(--font-mono);" id="batch-current-index-text">
                      #${this.currentBatchIndex+1} of ${r.length}: <strong>${r[this.currentBatchIndex]?.name||e.originalFileName}</strong>
                    </span>
                    <button class="btn btn-icon btn-sm" id="btn-batch-next" title="Next Image in Batch">▶</button>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button class="btn btn-primary btn-sm" id="btn-launch-batch-process" style="box-shadow:0 0 15px rgba(99,102,241,0.4);">
                    ⚡ Batch Process & Export All ${r.length} (300 PPI ZIP)
                  </button>
                </div>
              </div>
            `:``}
            <div id="canvas-viewport" class="canvas-viewport-wrapper">
              <!-- Rendered dynamically -->
            </div>

            <!-- Floating Viewport Controls -->
            <div class="canvas-floating-bar">
              <button class="btn-icon btn-sm" id="btn-zoom-out" title="Zoom Out">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
              </button>
              <span class="zoom-indicator" id="zoom-text">${e.zoom}%</span>
              <button class="btn-icon btn-sm" id="btn-zoom-in" title="Zoom In">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              </button>
              <div style="width:1px; height:16px; background:var(--border-medium); margin:0 4px;"></div>
              <button class="btn btn-glass btn-sm" id="btn-fit-screen">Fit</button>
              <button class="btn btn-glass btn-sm" id="btn-reset-zoom">100%</button>
            </div>
          </main>

          <!-- RIGHT PANEL: DYNAMIC INSPECTOR -->
          <aside class="studio-panel-right" id="studio-panel-right">
            <!-- Rendered by renderInspector() -->
          </aside>
        </div>
      </div>
    `,this.bindEvents(),this.renderInspector(),this.updateProcessing()}bindEvents(){let e=y.getState().batchAssets||[];if(e.length>1){let t=()=>{Q.openBatchModal(e,y.getState().activeTool,y.getState().params)},n=this.container.querySelector(`#btn-launch-batch-process`);n&&(n.onclick=t);let r=this.container.querySelector(`#btn-top-batch-export`);r&&(r.onclick=t);let i=this.container.querySelector(`#btn-batch-prev`),a=this.container.querySelector(`#btn-batch-next`),o=t=>{this.currentBatchIndex=(t+e.length)%e.length;let n=e[this.currentBatchIndex],r=new FileReader;r.onload=async t=>{let r=new Image;r.src=t.target.result,await r.decode(),y.setState({originalImage:r,originalImageUrl:r.src,originalFileName:n.name,originalWidth:r.naturalWidth||r.width||1200,originalHeight:r.naturalHeight||r.height||800}),this.renderInspector(),this.updateProcessing(!0);let i=this.container.querySelector(`#batch-current-index-text`);i&&(i.innerHTML=`#${this.currentBatchIndex+1} of ${e.length}: <strong>${n.name}</strong>`)},r.readAsDataURL(n)};i&&(i.onclick=()=>o(this.currentBatchIndex-1)),a&&(a.onclick=()=>o(this.currentBatchIndex+1))}let t=this.container.querySelector(`#project-name-input`);t.onchange=()=>{let e=t.value.trim()||`Untitled Project`;y.setState({project:{...y.getState().project,name:e}}),D.info(`Project renamed to "${e}"`)},this.container.querySelector(`#btn-top-upload`).onclick=()=>{Q.openUploadModal(()=>{this.render()})},this.container.querySelector(`#btn-undo`).onclick=()=>{y.undo(),this.renderInspector(),this.updateProcessing(),D.info(`Undo`)},this.container.querySelector(`#btn-redo`).onclick=()=>{y.redo(),this.renderInspector(),this.updateProcessing(),D.info(`Redo`)},this.container.querySelector(`#btn-reset`).onclick=()=>{this.updateProcessing(),D.info(`Reset to original parameters`)};let n=e=>{y.setState({compareMode:e}),this.container.querySelector(`#btn-mode-slider`).className=`btn btn-sm ${e===`slider`?`btn-primary`:`btn-glass`}`,this.container.querySelector(`#btn-mode-split`).className=`btn btn-sm ${e===`split`?`btn-primary`:`btn-glass`}`,this.container.querySelector(`#btn-mode-side`).className=`btn btn-sm ${e===`side-by-side`?`btn-primary`:`btn-glass`}`,this.updateCanvasDisplay()};this.container.querySelector(`#btn-mode-slider`).onclick=()=>n(`slider`),this.container.querySelector(`#btn-mode-split`).onclick=()=>n(`split`),this.container.querySelector(`#btn-mode-side`).onclick=()=>n(`side-by-side`),this.container.querySelector(`#btn-save-project`).onclick=async()=>{let{project:e,activeTool:t,params:n}=y.getState();try{await S.updateProject(e.id,{name:e.name,active_tool:t,tool_settings:n}),D.success(`Project "${e.name}" saved!`)}catch{D.success(`Project "${e.name}" saved locally!`)}},this.container.querySelector(`#btn-top-export`).onclick=()=>{this.processedCanvas?Q.openExportModal(this.processedCanvas,this.processedSvg):D.error(`No processed asset to export yet.`)},this.container.querySelector(`#btn-switch-account`).onclick=()=>{Q.openAuthModal(e=>{this.container.querySelector(`#user-credits-pill span`).textContent=`${e.credits} Credits`})};let r=this.container.querySelectorAll(`.tool-nav-item`);r.forEach(e=>{e.onclick=()=>{r.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`);let t=e.getAttribute(`data-tool`);y.setState({activeTool:t}),this.renderInspector(),this.updateProcessing()}});let i=this.container.querySelector(`#zoom-text`),a=()=>{let e=y.getState().zoom;i.textContent=`${e}%`;let t=this.container.querySelector(`#canvas-viewport`);t&&(t.style.transform=`scale(${e/100})`)};this.container.querySelector(`#btn-zoom-in`).onclick=()=>{let e=y.getState().zoom;e<400&&y.setState({zoom:e+25}),a()},this.container.querySelector(`#btn-zoom-out`).onclick=()=>{let e=y.getState().zoom;e>25&&y.setState({zoom:e-25}),a()},this.container.querySelector(`#btn-reset-zoom`).onclick=()=>{y.setState({zoom:100}),a()},this.container.querySelector(`#btn-fit-screen`).onclick=()=>{y.setState({zoom:85}),a()}}renderInspector(){let e=this.container.querySelector(`#studio-panel-right`),t=y.getState(),n=t.activeTool,r=t.params,i=``;if(n===`tool_gradient_extract`)i=`
        <div class="panel-header">
          <span class="panel-title">Image → Gradient</span>
          <span class="badge badge-indigo">1 Credit</span>
        </div>
        <div class="panel-content">
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:14px;">
            Extracts dominant color harmony from the image and generates multi-stop gradients.
          </p>

          <div class="control-group">
            <div class="control-label"><span>Gradient Type</span></div>
            <select id="param-gradient-type" style="width:100%;">
              <option value="linear" ${r.gradientType===`linear`?`selected`:``}>Linear Gradient</option>
              <option value="radial" ${r.gradientType===`radial`?`selected`:``}>Radial Gradient</option>
              <option value="mesh" ${r.gradientType===`mesh`?`selected`:``}>Mesh Gradient</option>
              <option value="soft" ${r.gradientType===`soft`?`selected`:``}>Soft Gradient</option>
              <option value="blur" ${r.gradientType===`blur`?`selected`:``}>Blur Gradient</option>
            </select>
          </div>

          <div class="control-group">
            <div class="control-label">
              <span>Color Harmony Stops</span>
              <div style="display:flex; gap:4px;">
                <button class="btn btn-glass btn-sm" id="btn-add-color-stop" style="padding:2px 8px;" title="Add color stop">+ Add</button>
                <button class="btn btn-glass btn-sm" id="btn-random-colors" style="padding:2px 8px;" title="Randomize color palette">🎲 Random</button>
                <button class="btn btn-glass btn-sm" id="btn-regen-palette" style="padding:2px 8px;" title="Extract colors from image">Re-Extract</button>
              </div>
            </div>
            <div class="color-swatch-list" id="palette-swatches" style="display:flex; flex-wrap:wrap; gap:8px;">
              ${r.gradientColors.map((e,t)=>`
                <div style="position:relative; display:inline-flex; align-items:center;">
                  <input type="color" class="color-swatch" value="${e}" data-index="${t}" title="Stop ${t+1}: ${e}" />
                  ${r.gradientColors.length>2?`<button class="btn-remove-stop" data-remove-index="${t}" title="Remove stop" style="position:absolute; top:-5px; right:-5px; width:15px; height:15px; border-radius:50%; background:var(--accent-danger, #ef4444); color:#fff; border:1px solid #fff; font-size:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; line-height:1;">×</button>`:``}
                </div>
              `).join(``)}
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Gradient Angle</span><span class="control-value" id="val-angle">${r.gradientAngle}°</span></div>
            <input type="range" class="range-slider" id="param-angle" min="0" max="360" value="${r.gradientAngle}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Blur Softness</span><span class="control-value" id="val-blur">${r.gradientBlur}px</span></div>
            <input type="range" class="range-slider" id="param-blur" min="0" max="100" value="${r.gradientBlur}" />
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:20px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Generate Gradient
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `;else if(n===`tool_upscaler`){let e=t.originalWidth||1200,n=t.originalHeight||800,a=r.upscaleResolution===`300PPI`?4500:r.upscaleResolution===`8K`?7680:r.upscaleResolution===`6K`?6144:r.upscaleResolution===`4K`?3840:2560,o=Math.round(n/e*a);i=`
        <div class="panel-header">
          <span class="panel-title">AI Image Upscaler</span>
          <span class="badge badge-cyan">3 Credits</span>
        </div>
        <div class="panel-content">
          <div style="background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.3); border-radius:8px; padding:12px; margin-bottom:16px; font-size:0.75rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span>Source: <strong>${e} × ${n} px</strong></span>
              <span class="badge badge-indigo">72 PPI Standard</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:var(--accent-secondary); font-weight:700;">
              <span>Target: <strong>${a} × ${o} px</strong></span>
              <span class="badge badge-cyan">300 PPI Print Ready</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-muted); margin-top:6px;">
              Print Dimension: ${(a/300).toFixed(1)}" × ${(o/300).toFixed(1)}" (${(a/300*2.54).toFixed(1)} × ${(o/300*2.54).toFixed(1)} cm)
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Resolution Mode & Print Density</span></div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; margin-bottom:6px;">
              ${[`2K`,`4K`,`6K`].map(e=>`
                <button class="btn btn-sm ${r.upscaleResolution===e?`btn-primary`:`btn-secondary`}" data-res="${e}">${e}</button>
              `).join(``)}
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1.3fr; gap:6px;">
              <button class="btn btn-sm ${r.upscaleResolution===`8K`?`btn-primary`:`btn-secondary`}" data-res="8K">8K Cinema</button>
              <button class="btn btn-sm ${r.upscaleResolution===`300PPI`?`btn-primary`:`btn-secondary`}" data-res="300PPI" style="border-color:var(--accent-primary);">
                ✦ 300 PPI Master
              </button>
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Sharpness & Edge Clarity</span><span class="control-value">${r.upscaleSharpness}%</span></div>
            <input type="range" class="range-slider" id="param-sharpness" min="0" max="100" value="${r.upscaleSharpness}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Detail Enhancement</span><span class="control-value">${r.upscaleDetail}%</span></div>
            <input type="range" class="range-slider" id="param-detail" min="0" max="100" value="${r.upscaleDetail}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Noise & Grain Reduction</span><span class="control-value">${r.upscaleNoiseReduction}%</span></div>
            <input type="range" class="range-slider" id="param-noise-red" min="0" max="100" value="${r.upscaleNoiseReduction}" />
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:16px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Process 300 PPI Upscale
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `}else if(n===`tool_film_grain`)i=`
        <div class="panel-header">
          <span class="panel-title">Film Grain Engine</span>
          <span class="badge badge-indigo">1 Credit</span>
        </div>
        <div class="panel-content">
          <div class="control-group">
            <div class="control-label"><span>Film Emulsion Presets</span></div>
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:6px;">
              ${Object.keys(B.presets).map(e=>`
                <button class="btn btn-sm ${r.grainPreset===e?`btn-primary`:`btn-secondary`}" data-grain-preset="${e}">
                  ${B.presets[e].name.split(` `)[0]}
                </button>
              `).join(``)}
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Grain Amount</span><span class="control-value">${r.grainAmount}%</span></div>
            <input type="range" class="range-slider" id="param-grain-amount" min="0" max="100" value="${r.grainAmount}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Grain Size</span><span class="control-value">${r.grainSize}x</span></div>
            <input type="range" class="range-slider" id="param-grain-size" min="1" max="5" value="${r.grainSize}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Tonal Contrast</span><span class="control-value">${r.grainContrast}%</span></div>
            <input type="range" class="range-slider" id="param-grain-contrast" min="0" max="100" value="${r.grainContrast}" />
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:20px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Apply Analog Texture
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `;else if(n.startsWith(`tool_fractal_glass`)){let e=n.replace(`tool_fractal_glass_`,``).replace(`_`,`.`);i=`
        <div class="panel-header">
          <span class="panel-title">Fractal Glass</span>
          <span class="badge badge-cyan">2 Credits</span>
        </div>
        <div class="panel-content">
          <div style="font-size:0.8rem; color:var(--accent-secondary); font-weight:700; margin-bottom:12px;">
            ${R.presets[e]?.name||`Fractal Glass`}
          </div>

          <div class="control-group">
            <div class="control-label"><span>Refraction Strength</span><span class="control-value">${r.glassRefraction}%</span></div>
            <input type="range" class="range-slider" id="param-glass-refraction" min="0" max="100" value="${r.glassRefraction}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Fractal Distortion</span><span class="control-value">${r.glassDistortion}%</span></div>
            <input type="range" class="range-slider" id="param-glass-distortion" min="0" max="100" value="${r.glassDistortion}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Transparency</span><span class="control-value">${r.glassTransparency}%</span></div>
            <input type="range" class="range-slider" id="param-glass-transparency" min="10" max="100" value="${r.glassTransparency}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Specular Light Reflection</span><span class="control-value">${r.glassLight}%</span></div>
            <input type="range" class="range-slider" id="param-glass-light" min="0" max="100" value="${r.glassLight}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Color Tint Overlay</span></div>
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="color" id="param-glass-tint" value="${r.glassTint||`#6366f1`}" class="color-swatch" style="width:36px; height:36px;" />
              <span style="font-size:0.75rem; color:var(--text-muted);">Prism Glass Tint Color</span>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:16px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Render Glass Shader
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `}else if(n.startsWith(`tool_gradient_maker`)){let e=parseInt(n.replace(`tool_gradient_maker_`,``),10);i=`
        <div class="panel-header">
          <span class="panel-title">Gradient Maker ${e}</span>
          <span class="badge badge-indigo">1 Credit</span>
        </div>
        <div class="panel-content">
          <div class="control-group">
            <div class="control-label">
              <span>Color Stops</span>
              <button class="btn btn-glass btn-sm" id="btn-add-maker-stop" style="padding:2px 8px;">+ Add Stop</button>
            </div>
            <div class="color-swatch-list" style="display:flex; flex-wrap:wrap; gap:8px;">
              ${r.gradientColors.map((e,t)=>`
                <div style="position:relative; display:inline-flex; align-items:center;">
                  <input type="color" class="color-swatch" value="${e}" data-index="${t}" title="Stop ${t+1}: ${e}" />
                  ${r.gradientColors.length>2?`<button class="btn-remove-stop" data-remove-index="${t}" title="Remove stop" style="position:absolute; top:-5px; right:-5px; width:15px; height:15px; border-radius:50%; background:var(--accent-danger, #ef4444); color:#fff; border:1px solid #fff; font-size:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; line-height:1;">×</button>`:``}
                </div>
              `).join(``)}
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Gradient Angle</span><span class="control-value">${r.gradientAngle}°</span></div>
            <input type="range" class="range-slider" id="param-angle" min="0" max="360" value="${r.gradientAngle}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Texture / Noise Grain</span><span class="control-value">${r.makerNoise}%</span></div>
            <input type="range" class="range-slider" id="param-maker-noise" min="0" max="50" value="${r.makerNoise}" />
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:20px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Generate System ${e}
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `}else n===`tool_vector_convert`||n===`tool_vector_trace`?i=`
        <div class="panel-header">
          <span class="panel-title">Image → Vector (SVG)</span>
          <span class="badge badge-cyan">2 Credits</span>
        </div>
        <div class="panel-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <p style="font-size:0.8rem; color:var(--text-secondary); margin:0;">
              Traces raster pixels into true scalable SVG &lt;path&gt; vectors.
            </p>
            <span class="badge badge-indigo" id="vector-path-count-badge">Vector Ready</span>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Color Quantization</span><span class="control-value">${r.vectorColors} Colors</span></div>
            <input type="range" class="range-slider" id="param-vec-colors" min="2" max="16" value="${r.vectorColors}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Curve Smoothness</span><span class="control-value">${r.vectorSmoothness}%</span></div>
            <input type="range" class="range-slider" id="param-vec-smooth" min="0" max="100" value="${r.vectorSmoothness}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Detail Level</span><span class="control-value">${r.vectorDetail}%</span></div>
            <input type="range" class="range-slider" id="param-vec-detail" min="20" max="95" value="${r.vectorDetail}" />
          </div>

          <div class="control-group" style="display:flex; align-items:center; justify-content:space-between; margin-top:12px;">
            <span style="font-size:0.8rem; font-weight:600;">Transparent Background</span>
            <label class="switch">
              <input type="checkbox" id="param-vec-remove-white" ${r.vectorRemoveWhite?`checked`:``} />
              <span class="switch-slider"></span>
            </label>
          </div>

          <div style="display:grid; grid-template-columns: 1.2fr 1fr 1fr; gap:6px; margin-top:18px;">
            <button class="btn btn-primary btn-sm" id="btn-process-tool">
              Trace Vector
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-quick-download-svg" title="Download pure SVG vector code">
              SVG Vector ↓
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-quick-export-300" title="Download 300 PPI Raster Preview">
              300 PPI ↓
            </button>
          </div>
        </div>
      `:n.includes(`remove`)||n.includes(`transparent`)?i=`
        <div class="panel-header">
          <span class="panel-title">Remove Background</span>
          <span class="badge badge-green">1 Credit</span>
        </div>
        <div class="panel-content">
          <div class="control-group">
            <div class="control-label"><span>Color Tolerance</span><span class="control-value">${r.bgTolerance}%</span></div>
            <input type="range" class="range-slider" id="param-bg-tolerance" min="5" max="80" value="${r.bgTolerance}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Edge Feathering</span><span class="control-value">${r.bgFeather}px</span></div>
            <input type="range" class="range-slider" id="param-bg-feather" min="0" max="10" value="${r.bgFeather}" />
          </div>

          <div class="control-group" style="display:flex; align-items:center; justify-content:space-between;">
            <span style="font-size:0.8rem; font-weight:600;">Preserve Contact Shadows</span>
            <label class="switch">
              <input type="checkbox" id="param-bg-shadow" ${r.bgShadowPreserve?`checked`:``} />
              <span class="switch-slider"></span>
            </label>
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:20px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Remove Background
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `:n.startsWith(`tool_icon_sheet`)?i=`
        <div class="panel-header">
          <span class="panel-title">Icon Sheet Maker ${n.replace(`tool_icon_sheet_`,``)}</span>
          <span class="badge badge-indigo">2 Credits</span>
        </div>
        <div class="panel-content">
          <div class="control-group">
            <div class="control-label"><span>Grid Columns</span><span class="control-value">${r.sheetColumns}</span></div>
            <input type="range" class="range-slider" id="param-sheet-cols" min="2" max="8" value="${r.sheetColumns}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Padding Spacing</span><span class="control-value">${r.sheetPadding}px</span></div>
            <input type="range" class="range-slider" id="param-sheet-padding" min="8" max="60" value="${r.sheetPadding}" />
          </div>

          <div class="control-group" style="display:flex; align-items:center; justify-content:space-between;">
            <span style="font-size:0.8rem; font-weight:600;">Include Text Labels</span>
            <label class="switch">
              <input type="checkbox" id="param-sheet-labels" ${r.sheetLabels?`checked`:``} />
              <span class="switch-slider"></span>
            </label>
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:20px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Build Icon Sheet
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `:n===`tool_icon_pack`&&(i=`
        <div class="panel-header">
          <span class="panel-title">Icon Pack Maker</span>
          <span class="badge badge-cyan">4 Credits</span>
        </div>
        <div class="panel-content">
          <div class="control-group">
            <div class="control-label"><span>Icon Style Transformation</span></div>
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:6px;">
              ${q.styles.map(e=>`
                <button class="btn btn-sm ${r.packStyle===e?`btn-primary`:`btn-secondary`}" data-pack-style="${e}">
                  ${e.toUpperCase()}
                </button>
              `).join(``)}
            </div>
          </div>

          <div style="background:var(--bg-tertiary); padding:12px; border-radius:8px; font-size:0.75rem; color:var(--text-secondary); margin-top:14px; border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-secondary); font-weight:700; margin-bottom:4px;">✦ 300 PPI Print & Web Icons</div>
            Generates individual PNGs (64, 128, 256, 512px @ 300 PPI), pure vector SVGs, master sheet, and bundles everything into a ZIP.
          </div>

          <button class="btn btn-primary" id="btn-process-tool" style="width:100%; margin-top:20px;">
            Generate & Download 300 PPI ZIP Pack
          </button>
        </div>
      `);e.innerHTML=i,this.bindInspectorEvents()}bindInspectorEvents(){let e=this.container.querySelector(`#studio-panel-right`),t=e.querySelector(`#btn-process-tool`);t&&(t.onclick=()=>this.executeCurrentTool());let n=e.querySelector(`#btn-quick-export-300`);n&&(n.onclick=async()=>{if(this.processedCanvas||await this.updateProcessing(!0),this.processedCanvas)try{let e=await k.exportWithPpi(this.processedCanvas,`png`,300),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`creativeforge-${y.getState().activeTool.replace(`tool_`,``)}-300ppi-${Date.now()}.png`,document.body.appendChild(n),n.click(),document.body.removeChild(n),D.success(`Downloaded High-Resolution 300 PPI Print Master PNG!`)}catch(e){D.error(`Export error: `+e.message)}});let r=e.querySelector(`#param-gradient-type`);r&&(r.onchange=e=>{y.setParam(`gradientType`,e.target.value),this.updateProcessing(!0),D.info(`Gradient type switched to ${e.target.value}`)}),e.querySelectorAll(`.color-swatch`).forEach(e=>{e.id!==`param-glass-tint`&&(e.oninput=e=>{let t=parseInt(e.target.getAttribute(`data-index`),10);if(!isNaN(t)){let n=[...y.getState().params.gradientColors];n[t]=e.target.value,y.setParam(`gradientColors`,n),this.scheduleProcessing()}},e.onchange=()=>{this.updateProcessing(!0)})}),e.querySelectorAll(`.btn-remove-stop`).forEach(e=>{e.onclick=t=>{t.stopPropagation();let n=parseInt(e.getAttribute(`data-remove-index`),10),r=[...y.getState().params.gradientColors];r.length>2&&(r.splice(n,1),y.setParam(`gradientColors`,r),this.renderInspector(),this.updateProcessing(!0),D.info(`Removed color stop`))}}),e.querySelectorAll(`.range-slider`).forEach(e=>{e.oninput=t=>{let n=t.target.id,r=parseInt(t.target.value,10),i=e.parentElement?.querySelector(`.control-value`);i&&(i.textContent=n===`param-angle`?`${r}°`:n===`param-grain-size`?`${r}x`:n.includes(`blur`)||n.includes(`feather`)||n.includes(`padding`)?`${r}px`:n===`param-vec-colors`?`${r} Colors`:n===`param-sheet-cols`?`${r}`:`${r}%`),n===`param-angle`?y.state.params.gradientAngle=r:n===`param-blur`?y.state.params.gradientBlur=r:n===`param-sharpness`?y.state.params.upscaleSharpness=r:n===`param-detail`?y.state.params.upscaleDetail=r:n===`param-noise-red`?y.state.params.upscaleNoiseReduction=r:n===`param-grain-amount`?y.state.params.grainAmount=r:n===`param-grain-size`?y.state.params.grainSize=r:n===`param-grain-contrast`?y.state.params.grainContrast=r:n===`param-glass-refraction`?y.state.params.glassRefraction=r:n===`param-glass-distortion`?y.state.params.glassDistortion=r:n===`param-glass-transparency`?y.state.params.glassTransparency=r:n===`param-glass-light`?y.state.params.glassLight=r:n===`param-vec-colors`?y.state.params.vectorColors=r:n===`param-vec-smooth`?y.state.params.vectorSmoothness=r:n===`param-vec-detail`?y.state.params.vectorDetail=r:n===`param-bg-tolerance`?y.state.params.bgTolerance=r:n===`param-bg-feather`?y.state.params.bgFeather=r:n===`param-sheet-cols`?y.state.params.sheetColumns=r:n===`param-sheet-padding`?y.state.params.sheetPadding=r:n===`param-maker-noise`&&(y.state.params.makerNoise=r),this.scheduleProcessing()},e.onchange=()=>{this.updateProcessing(!0)}}),e.querySelectorAll(`.switch input`).forEach(e=>{e.onchange=e=>{let t=e.target.id;t===`param-vec-remove-white`&&y.setParam(`vectorRemoveWhite`,e.target.checked),t===`param-bg-shadow`&&y.setParam(`bgShadowPreserve`,e.target.checked),t===`param-sheet-labels`&&y.setParam(`sheetLabels`,e.target.checked),this.updateProcessing(!0)}}),e.querySelectorAll(`[data-res]`).forEach(e=>{e.onclick=()=>{y.setParam(`upscaleResolution`,e.getAttribute(`data-res`)),this.renderInspector(),this.updateProcessing(!0)}}),e.querySelectorAll(`[data-grain-preset]`).forEach(e=>{e.onclick=()=>{let t=e.getAttribute(`data-grain-preset`),n=B.presets[t];y.setParam(`grainPreset`,t),n&&(y.setParam(`grainAmount`,n.amount),y.setParam(`grainSize`,n.size),y.setParam(`grainContrast`,n.contrast)),this.renderInspector(),this.updateProcessing(!0)}}),e.querySelectorAll(`[data-pack-style]`).forEach(e=>{e.onclick=()=>{y.setParam(`packStyle`,e.getAttribute(`data-pack-style`)),this.renderInspector(),this.updateProcessing(!0)}});let i=e.querySelector(`#btn-add-color-stop`)||e.querySelector(`#btn-add-maker-stop`);i&&(i.onclick=()=>{let e=y.getState().params.gradientColors;if(e.length<8){let t=`#`+Math.floor(Math.random()*16777215).toString(16).padStart(6,`0`);y.setParam(`gradientColors`,[...e,t]),this.renderInspector(),this.updateProcessing(!0),D.success(`Added color stop!`)}else D.info(`Maximum 8 color stops reached.`)});let a=e.querySelector(`#btn-random-colors`);a&&(a.onclick=()=>{let e=Array.from({length:4},()=>`#`+Math.floor(Math.random()*16777215).toString(16).padStart(6,`0`));y.setParam(`gradientColors`,e),this.renderInspector(),this.updateProcessing(!0),D.success(`Randomized color palette!`)});let o=e.querySelector(`#param-glass-tint`);o&&(o.oninput=e=>{y.setParam(`glassTint`,e.target.value),this.scheduleProcessing()},o.onchange=e=>{y.setParam(`glassTint`,e.target.value),this.updateProcessing(!0),D.info(`Updated glass prism tint`)});let s=e.querySelector(`#btn-quick-download-svg`);s&&(s.onclick=()=>{if(this.processedSvg){let e=new Blob([this.processedSvg],{type:`image/svg+xml;charset=utf-8`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`creativeforge-vector-${Date.now()}.svg`,document.body.appendChild(n),n.click(),document.body.removeChild(n),D.success(`Downloaded authentic vector SVG file!`)}else this.executeCurrentTool()});let c=e.querySelector(`#btn-regen-palette`);c&&(c.onclick=()=>{let e=y.getState().originalImage;if(e){let t=H.extractPalette(e,4);y.setParam(`gradientColors`,t),this.renderInspector(),this.updateProcessing(!0),D.success(`Extracted new color harmony!`)}})}scheduleProcessing(){this.rafPending||(this.rafPending=!0,requestAnimationFrame(()=>{this.rafPending=!1,this.updateProcessing(!0)}))}async executeCurrentTool(){let e=y.getState(),t=e.activeTool,n=e.originalImage;if(!n){Q.openUploadModal();return}if(D.info(`Processing ${t.replace(`tool_`,``)}...`),t===`tool_icon_pack`)try{let t=await q.generateZipPack([n],e.params.packStyle,`creativeforge-icons`,()=>{}),r=URL.createObjectURL(t),i=document.createElement(`a`);i.href=r,i.download=`creativeforge-icon-pack-${e.params.packStyle}-300ppi.zip`,i.click(),D.success(`Icon Pack 300 PPI ZIP package generated and downloaded!`)}catch(e){D.error(`Failed to generate ZIP: `+e.message)}else await this.updateProcessing(!0),D.success(`Asset processed and updated on canvas!`)}async updateProcessing(e=!1){let t=y.getState(),n=t.originalImage;if(!n)return;let r=t.activeTool,i=t.params,a=`${r}_${i.grainPreset||``}_${i.upscaleResolution||``}_${i.packStyle||``}_${i.sheetLayout||``}`;if(!e&&this.toolCache.has(a)){let e=this.toolCache.get(a);this.processedCanvas=e.canvas,this.processedSvg=e.svg,this.updateCanvasDisplay();return}let o=null,s=null;if(r===`tool_gradient_extract`)o=H.renderGradientCanvas({colors:i.gradientColors,type:i.gradientType,angle:i.gradientAngle,blur:i.gradientBlur,width:t.originalWidth,height:t.originalHeight});else if(r===`tool_upscaler`)o=P.process(n,i.upscaleResolution,{sharpness:i.upscaleSharpness,detailEnhancement:i.upscaleDetail,noiseReduction:i.upscaleNoiseReduction});else if(r===`tool_film_grain`)o=B.render(n,i.grainPreset,{amount:i.grainAmount,size:i.grainSize,contrast:i.grainContrast});else if(r.startsWith(`tool_fractal_glass`)){let e=r.replace(`tool_fractal_glass_`,``).replace(`_`,`.`),t=null;if(i.glassTint){let e=i.glassTint;t=`rgba(${parseInt(e.slice(1,3),16)||99},${parseInt(e.slice(3,5),16)||102},${parseInt(e.slice(5,7),16)||241},0.16)`}o=R.render(n,e,{refraction:i.glassRefraction,distortion:i.glassDistortion,transparency:i.glassTransparency,light:i.glassLight,tint:t})}else if(r.startsWith(`tool_gradient_maker`)){let e=parseInt(r.replace(`tool_gradient_maker_`,``),10);o=H.renderGradientCanvas({colors:i.gradientColors,angle:i.gradientAngle,noise:i.makerNoise,makerSystem:e,width:t.originalWidth,height:t.originalHeight})}else if(r===`tool_vector_convert`||r===`tool_vector_trace`){let e=await M.trace(n,{colors:i.vectorColors,detail:i.vectorDetail,smoothness:i.vectorSmoothness,removeWhiteBg:i.vectorRemoveWhite});s=e.svgString,o=document.createElement(`canvas`),o.width=e.width,o.height=e.height;let t=o.getContext(`2d`),r=new Image,a=new Blob([s],{type:`image/svg+xml;charset=utf-8`});r.src=URL.createObjectURL(a),await r.decode(),t.drawImage(r,0,0);let c=this.container.querySelector(`#vector-path-count-badge`);c&&e.pathCount&&(c.textContent=`${e.pathCount} Paths (SVG)`,c.className=`badge badge-green`)}else if(r.includes(`remove`)||r.includes(`transparent`))o=I.process(n,{tolerance:i.bgTolerance,feather:i.bgFeather,shadowPreservation:i.bgShadowPreserve});else if(r.startsWith(`tool_icon_sheet`)){let e=r.replace(`tool_icon_sheet_`,``);o=W.render([n],e,{columns:i.sheetColumns,padding:i.sheetPadding,showLabels:i.sheetLabels})}else r===`tool_icon_pack`&&(o=q.applyStyle(n,i.packStyle,512));if(this.processedCanvas=o,this.processedSvg=s,o){if(this.toolCache.size>15){let e=this.toolCache.keys().next().value;this.toolCache.delete(e)}this.toolCache.set(a,{canvas:o,svg:s})}this.updateCanvasDisplay()}updateCanvasDisplay(){let e=this.container.querySelector(`#canvas-viewport`);if(!e)return;let t=y.getState(),n=t.originalImage,r=this.processedCanvas;if(!n){e.innerHTML=`
        <div class="canvas-empty-state" id="viewport-dropzone">
          <div class="empty-state-icon">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          </div>
          <h3 style="font-size:1.2rem; margin-bottom:8px;">Upload Image to Start</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:18px;">
            Drag & drop your source graphic or click to select.
          </p>
          <button class="btn btn-primary btn-sm" id="btn-browse-empty">Select Image</button>
        </div>
      `,e.querySelector(`#btn-browse-empty`).onclick=()=>Q.openUploadModal(),e.querySelector(`#viewport-dropzone`).onclick=()=>Q.openUploadModal();return}let i=t.compareMode,a=t.sliderPos;if(i===`side-by-side`){e.innerHTML=`
        <div class="compare-side-by-side">
          <div class="side-card">
            <span class="side-card-title">Original Source</span>
            <img src="${n.src}" class="canvas-element" alt="Original" />
          </div>
          <div class="side-card canvas-checkerboard" id="proc-card-slot">
            <span class="side-card-title">CreativeForge Processed (300 PPI Master)</span>
          </div>
        </div>
      `;let t=e.querySelector(`#proc-card-slot`);t&&r&&(r.className=`canvas-element`,t.appendChild(r))}else if(i===`split`){e.innerHTML=`
        <div class="compare-slider-container canvas-checkerboard" id="split-wrap">
          <div id="proc-canvas-holder" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;"></div>
          <div class="compare-layer-before" style="width: 50%;">
            <img src="${n.src}" class="canvas-element" id="orig-layer" alt="Original Source" style="width: 100vw; max-width: none;" />
          </div>
          <div class="compare-divider-handle" style="left: 50%; pointer-events:none;">
            <div class="compare-handle-knob" style="font-size:0.65rem; padding:2px 8px; width:auto; border-radius:12px;">50 / 50 SPLIT</div>
          </div>
          <div style="position:absolute; top:12px; left:12px; z-index:30;" class="badge badge-indigo">ORIGINAL SOURCE</div>
          <div style="position:absolute; top:12px; right:12px; z-index:30;" class="badge badge-cyan">CREATIVEFORGE ENHANCED</div>
        </div>
      `;let t=e.querySelector(`#proc-canvas-holder`);t&&r&&(r.className=`canvas-element`,t.appendChild(r));let i=e.querySelector(`#orig-layer`);requestAnimationFrame(()=>{r&&i&&(i.style.width=`${r.clientWidth}px`,i.style.height=`${r.clientHeight}px`)})}else{e.innerHTML=`
        <div class="compare-slider-container canvas-checkerboard" id="slider-wrap">
          <!-- Processed Layer Container -->
          <div id="proc-canvas-holder" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;"></div>

          <!-- Original Layer (Top clipped by slider position) -->
          <div class="compare-layer-before" id="orig-layer-clip" style="width: ${a}%;">
            <img src="${n.src}" class="canvas-element" id="orig-layer" alt="Original Source" style="width: 100vw; max-width: none;" />
          </div>

          <!-- Draggable Divider with GPU transform acceleration -->
          <div class="compare-divider-handle" id="slider-handle" style="left: ${a}%;">
            <div class="compare-handle-knob">◀ ▶</div>
          </div>
        </div>
      `;let t=e.querySelector(`#proc-canvas-holder`);t&&r&&(r.className=`canvas-element`,t.appendChild(r)),this.initSliderEvents(e)}}initSliderEvents(e){let t=e.querySelector(`#slider-wrap`),n=e.querySelector(`#slider-handle`),r=e.querySelector(`#orig-layer-clip`),i=e.querySelector(`#orig-layer`),a=this.processedCanvas;if(!t||!n)return;requestAnimationFrame(()=>{a&&i&&(i.style.width=`${a.clientWidth}px`,i.style.height=`${a.clientHeight}px`)});let o=!1,s=e=>{o||(o=!0,requestAnimationFrame(()=>{o=!1;let i=t.getBoundingClientRect(),a=Math.max(0,Math.min(e-i.left,i.width)),s=Math.max(0,Math.min(100,a/i.width*100));n.style.left=`${s}%`,r.style.width=`${s}%`,y.state.sliderPos=s}))};n.onmousedown=e=>{e.preventDefault(),this.isDraggingSlider=!0,window.onmousemove=e=>{this.isDraggingSlider&&s(e.clientX)},window.onmouseup=()=>{this.isDraggingSlider=!1,window.onmousemove=null}},t.onclick=e=>{e.target!==n&&!n.contains(e.target)&&s(e.clientX)}}}})),ne,re=o((()=>{b(),ne=class{constructor(e,t){this.container=e,this.onNavigateStudio=t}render(e=null){if(e){this.renderToolSeoPage(e);return}this.container.innerHTML=`
      <div class="landing-container">
        <!-- TOP NAVIGATION -->
        <nav class="landing-nav">
          <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" id="nav-brand-home">
            <div class="brand-logo">CF</div>
            <div class="brand-title">
              <span>CreativeForge AI</span>
              <span class="brand-subtitle">AI Creative Studio</span>
            </div>
          </div>

          <div class="landing-nav-links">
            <a href="#features" class="landing-nav-link">Features</a>
            <a href="#tools" class="landing-nav-link">Creative Tools</a>
            <a href="#pricing" class="landing-nav-link">Pricing</a>
            <a href="#faq" class="landing-nav-link">FAQ</a>
            <span class="landing-nav-link" id="nav-open-dashboard" style="cursor:pointer;">User Dashboard</span>
            <span class="landing-nav-link" id="nav-open-admin" style="cursor:pointer; color:var(--accent-tertiary);">Admin Panel</span>
          </div>

          <div style="display:flex; align-items:center; gap:12px;">
            <button class="btn btn-primary" id="btn-hero-launch">Launch Creative Studio</button>
          </div>
        </nav>

        <!-- HERO SECTION -->
        <header class="hero-section">
          <div class="hero-glow-bg"></div>
          <div class="hero-badge">
            <span class="badge badge-indigo">✦ Next-Generation Creative Architecture</span>
          </div>
          <h1 class="hero-headline">
            Transform Images Into Professional Creative Assets
          </h1>
          <p class="hero-subheadline">
            AI-powered image enhancement, gradients, glass effects, vector conversion and icon creation — all in one unified, non-destructive creative workspace.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" id="btn-hero-start">Start Creating Free</button>
            <button class="btn btn-glass btn-lg" id="btn-hero-explore">Explore Studio Suite</button>
          </div>

          <!-- Interactive Workspace Showcase Mockup -->
          <div class="hero-preview-frame">
            <div style="background:var(--bg-tertiary); padding:10px 16px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-subtle);">
              <div style="display:flex; gap:6px;">
                <div style="width:10px; height:10px; border-radius:50%; background:#ef4444;"></div>
                <div style="width:10px; height:10px; border-radius:50%; background:#f59e0b;"></div>
                <div style="width:10px; height:10px; border-radius:50%; background:#10b981;"></div>
              </div>
              <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">creativeforge.ai/studio/workspace</span>
              <span class="badge badge-cyan">LIVE STUDIO PREVIEW</span>
            </div>
            <div style="padding:24px; display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; text-align:center;">
                <div style="font-size:1.8rem; margin-bottom:8px;">⬡</div>
                <strong style="font-size:0.9rem;">Authentic Vector SVG</strong>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Raster to pure &lt;path&gt; nodes</p>
              </div>
              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; text-align:center;">
                <div style="font-size:1.8rem; margin-bottom:8px;">❄</div>
                <strong style="font-size:0.9rem;">Fractal Glass Shaders</strong>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">6 Refractive crystal distortion presets</p>
              </div>
              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; text-align:center;">
                <div style="font-size:1.8rem; margin-bottom:8px;">⚡</div>
                <strong style="font-size:0.9rem;">AI Multi-Scale Upscaler</strong>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">2K to 8K resolution synthesis</p>
              </div>
              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; text-align:center;">
                <div style="font-size:1.8rem; margin-bottom:8px;">📦</div>
                <strong style="font-size:0.9rem;">Icon Pack Generator</strong>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">8 styles + Multi-size ZIP download</p>
              </div>
            </div>
          </div>
        </header>

        <!-- FEATURES SECTION -->
        <section class="features-section" id="features">
          <div class="section-header">
            <span class="badge badge-cyan" style="margin-bottom:8px;">Creative Architecture</span>
            <h2 class="section-title">One Image. Infinite Creative Assets.</h2>
            <p class="section-subtitle">
              Upload once. The non-destructive pipeline preserves your source asset while generating vectors, gradients, film grain, and icon packages simultaneously.
            </p>
          </div>

          <div class="features-grid" id="tools">
            <div class="feature-card" data-seo-tool="image-to-vector">
              <div class="feature-card-icon">⬡</div>
              <h3 class="feature-card-title">Image → Vector (SVG)</h3>
              <p class="feature-card-desc">
                High-precision contour extraction with Bézier curve smoothing that generates valid, lightweight, infinite-resolution SVG paths.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Vector Tool →</button>
            </div>

            <div class="feature-card" data-seo-tool="image-upscaler">
              <div class="feature-card-icon">⚡</div>
              <h3 class="feature-card-title">AI Image Upscaler</h3>
              <p class="feature-card-desc">
                Upscale graphics to 2K, 4K, 6K, and 8K with high-frequency unsharp masking, texture recovery, and modular AI API abstraction.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Upscaler Tool →</button>
            </div>

            <div class="feature-card" data-seo-tool="fractal-glass">
              <div class="feature-card-icon">❄</div>
              <h3 class="feature-card-title">Fractal Glass (6 Presets)</h3>
              <p class="feature-card-desc">
                Soft transparent glass, crystalline refractions, fractured shards, fine fractals, and layered dispersion shaders.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Glass Tool →</button>
            </div>

            <div class="feature-card" data-seo-tool="gradient-maker">
              <div class="feature-card-icon">◈</div>
              <h3 class="feature-card-title">Gradient Maker & Extractor</h3>
              <p class="feature-card-desc">
                Dominant color harmony extraction, mesh orbs, multi-color palettes, and organic textured lighting systems.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Gradient Tool →</button>
            </div>

            <div class="feature-card" data-seo-tool="background-remover">
              <div class="feature-card-icon">✂</div>
              <h3 class="feature-card-title">Remove White Background</h3>
              <p class="feature-card-desc">
                Intelligent color distance detection, smooth edge feathering, and contact shadow preservation for pure transparent cutouts.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Cutout Tool →</button>
            </div>

            <div class="feature-card" data-seo-tool="icon-pack-maker">
              <div class="feature-card-icon">📦</div>
              <h3 class="feature-card-title">Icon Sheet & Pack Maker</h3>
              <p class="feature-card-desc">
                Transform any artwork into 8 icon styles (Outline, Flat, 3D, Gradient, Rounded) and package into multi-resolution ZIP archives.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Icon Pack Tool →</button>
            </div>
          </div>
        </section>

        <!-- PRICING SECTION -->
        <section class="pricing-section" id="pricing">
          <div class="section-header">
            <span class="badge badge-indigo" style="margin-bottom:8px;">Transparent SaaS Pricing</span>
            <h2 class="section-title">Scale Your Creative Velocity</h2>
            <p class="section-subtitle">Flexible credit plans tailored for creators, studios, and engineering teams.</p>
          </div>

          <div class="pricing-grid">
            <div class="pricing-card">
              <span class="pricing-name">Free Starter</span>
              <div class="pricing-price">$0 <span class="pricing-period">/ month</span></div>
              <p style="font-size:0.8rem; color:var(--text-secondary);">Essential creative tools for exploration</p>
              <ul class="pricing-features">
                <li class="pricing-feature-item">✓ 10 Monthly Credits</li>
                <li class="pricing-feature-item">✓ 2K Max Resolution</li>
                <li class="pricing-feature-item">✓ Watermark-Free Preview</li>
                <li class="pricing-feature-item">✓ 3 Active Projects</li>
              </ul>
              <button class="btn btn-secondary" id="btn-plan-free">Get Started</button>
            </div>

            <div class="pricing-card">
              <span class="pricing-name">Creator</span>
              <div class="pricing-price">$19 <span class="pricing-period">/ month</span></div>
              <p style="font-size:0.8rem; color:var(--text-secondary);">For designers and visual content creators</p>
              <ul class="pricing-features">
                <li class="pricing-feature-item">✓ 100 Monthly Credits</li>
                <li class="pricing-feature-item">✓ 4K Ultra HD Export</li>
                <li class="pricing-feature-item">✓ All Fractal Glass Presets</li>
                <li class="pricing-feature-item">✓ Batch Processing</li>
              </ul>
              <button class="btn btn-secondary" id="btn-plan-creator">Upgrade to Creator</button>
            </div>

            <div class="pricing-card featured">
              <div style="position:absolute; top:12px; right:16px;">
                <span class="badge badge-indigo">MOST POPULAR</span>
              </div>
              <span class="pricing-name">Professional</span>
              <div class="pricing-price">$49 <span class="pricing-period">/ month</span></div>
              <p style="font-size:0.8rem; color:var(--text-secondary);">Full creative suite for production agencies</p>
              <ul class="pricing-features">
                <li class="pricing-feature-item">✓ 500 Monthly Credits</li>
                <li class="pricing-feature-item">✓ 8K Master Resolution</li>
                <li class="pricing-feature-item">✓ SVG Vector Tracing & Export</li>
                <li class="pricing-feature-item">✓ Full Icon Pack ZIP Studio</li>
                <li class="pricing-feature-item">✓ High-Speed Queue Priority</li>
              </ul>
              <button class="btn btn-primary" id="btn-plan-pro">Launch Professional</button>
            </div>

            <div class="pricing-card">
              <span class="pricing-name">Business Studio</span>
              <div class="pricing-price">$129 <span class="pricing-period">/ month</span></div>
              <p style="font-size:0.8rem; color:var(--text-secondary);">High volume enterprise infrastructure</p>
              <ul class="pricing-features">
                <li class="pricing-feature-item">✓ 2,500 Monthly Credits</li>
                <li class="pricing-feature-item">✓ Unlimited Projects</li>
                <li class="pricing-feature-item">✓ Dedicated AI Compute</li>
                <li class="pricing-feature-item">✓ Automated Nightly Backups</li>
              </ul>
              <button class="btn btn-secondary" id="btn-plan-business">Contact Sales</button>
            </div>
          </div>
        </section>

        <!-- FAQ SECTION -->
        <section class="seo-tool-faq" id="faq">
          <div class="section-header">
            <h2 class="section-title">Frequently Asked Questions</h2>
          </div>
          <div class="faq-item">
            <div class="faq-question">How does non-destructive editing work in CreativeForge?</div>
            <div class="faq-answer">
              When you upload an image, CreativeForge stores the original file in secure immutable storage. Any tool operation (vectors, gradients, glass effects) renders in isolated layers without modifying the original source. You can create 20 different asset variations from a single upload.
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">Are exported SVGs true vector paths?</div>
            <div class="faq-answer">
              Yes! Unlike basic editors that embed base64 PNGs into SVG files, CreativeForge's Vectorizer analyzes contours and generates authentic mathematical &lt;path&gt; Bézier curves that can be opened and edited in Figma, Adobe Illustrator, or Inkscape.
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">Can I connect external AI models like Replicate or Stability AI?</div>
            <div class="faq-answer">
              Yes. CreativeForge includes a modular AIProvider abstraction layer on the backend. You can provide your API key in the environment configuration to route requests to cloud AI models seamlessly.
            </div>
          </div>
        </section>
      </div>
    `,this.bindEvents()}renderToolSeoPage(e){let t={"image-to-vector":{title:`Image to Vector (SVG) Converter Online`,tagline:`Authentic Vector Path Tracing Engine`,desc:`Convert JPG, PNG, and WEBP raster images into infinite-resolution SVG vectors with color quantization and Bézier curve smoothing.`,toolId:`tool_vector_convert`,faqs:[{q:`What is the advantage of SVG vector tracing?`,a:`SVG files can be scaled to billboard size without losing any sharpness or crispness.`},{q:`Can I edit the vector paths in Illustrator or Figma?`,a:`Yes, all paths are exported as standard SVG path elements.`}]},"image-upscaler":{title:`AI Image Upscaler & Resolution Enhancer`,tagline:`2K, 4K, 6K, and 8K Resolution Synthesis`,desc:`Enlarge low-resolution photos and illustrations without pixelation using high-frequency edge reconstruction and noise reduction.`,toolId:`tool_upscaler`,faqs:[{q:`What resolutions are supported?`,a:`You can upscale images up to 8K Cinema (7680 x 4320).`},{q:`Does it preserve fine textures?`,a:`Yes, the high-frequency unsharp mask preserves subtle surface details.`}]},"fractal-glass":{title:`Fractal Glass & Refractive Distortion Studio`,tagline:`6 Procedural Crystalline Shader Presets`,desc:`Create ultra-modern glassmorphism effects, crystal refractions, fractured polygonal shards, and chromatic dispersion.`,toolId:`tool_fractal_glass_1`,faqs:[{q:`How many presets are available?`,a:`CreativeForge features 6 unique glass engines from Soft Glass to Abstract Dispersion.`}]},"gradient-maker":{title:`AI Image to Gradient & Mesh Palette Generator`,tagline:`Multi-Color Linear, Radial, and Fluid Mesh Gradients`,desc:`Extract color harmony from uploaded photos or synthesize beautiful CSS & SVG mesh gradients with organic lighting.`,toolId:`tool_gradient_extract`,faqs:[{q:`Can I export gradients as CSS?`,a:`Yes, you can export CSS linear gradients, radial gradients, or download high-res PNGs.`}]},"background-remover":{title:`Remove White & Custom Backgrounds Intelligently`,tagline:`Precision Alpha Cutouts with Shadow Preservation`,desc:`Isolate subjects and logos with smooth feathering and subtle contact shadow retention.`,toolId:`tool_bg_remove_white`,faqs:[{q:`Does it support transparent PNG export?`,a:`Yes, all cutouts are exported as lossless transparent PNGs.`}]},"icon-pack-maker":{title:`Icon Pack Maker & Icon Sheet Generator`,tagline:`8 Visual Styles + Multi-Resolution ZIP Package`,desc:`Generate complete icon sets with Outline, Flat, 3D, Gradient, and Monochrome styling bundled with SVGs and PNGs in a single ZIP.`,toolId:`tool_icon_pack`,faqs:[{q:`What sizes are included in the ZIP pack?`,a:`64px, 128px, 256px, and 512px PNGs plus master SVGs and presentation sheets.`}]}},n=t[e]||t[`image-to-vector`];this.container.innerHTML=`
      <div class="landing-container">
        <nav class="landing-nav">
          <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" id="nav-brand-seo">
            <div class="brand-logo">CF</div>
            <div class="brand-title">
              <span>CreativeForge AI</span>
              <span class="brand-subtitle">AI Creative Studio</span>
            </div>
          </div>
          <button class="btn btn-primary" id="btn-seo-launch">Launch Studio</button>
        </nav>

        <div class="seo-tool-header">
          <div class="seo-tool-tagline">${n.tagline}</div>
          <h1 style="font-size:2.8rem; font-weight:800; margin-bottom:16px;">${n.title}</h1>
          <p style="font-size:1.1rem; color:var(--text-secondary); max-width:720px; margin:0 auto 28px;">
            ${n.desc}
          </p>
          <button class="btn btn-primary btn-lg" id="btn-seo-open-tool">Open ${n.title.split(` `)[0]} in Studio →</button>
        </div>

        <section class="seo-tool-faq">
          <div class="section-header">
            <h2 class="section-title">Frequently Asked Questions</h2>
          </div>
          ${n.faqs.map(e=>`
            <div class="faq-item">
              <div class="faq-question">${e.q}</div>
              <div class="faq-answer">${e.a}</div>
            </div>
          `).join(``)}
        </section>
      </div>
    `,this.container.querySelector(`#nav-brand-seo`).onclick=()=>this.render(null),this.container.querySelector(`#btn-seo-launch`).onclick=()=>this.onNavigateStudio(),this.container.querySelector(`#btn-seo-open-tool`).onclick=()=>{y.setState({activeTool:n.toolId}),this.onNavigateStudio()}}bindEvents(){let e=()=>this.onNavigateStudio();this.container.querySelectorAll(`#btn-hero-launch, #btn-hero-start, #btn-hero-explore, #btn-plan-pro, #btn-plan-free, #btn-plan-creator, #btn-plan-business`).forEach(t=>{t.onclick=e});let t=this.container.querySelector(`#nav-open-dashboard`);t&&(t.onclick=()=>y.setState({currentView:`dashboard`}));let n=this.container.querySelector(`#nav-open-admin`);n&&(n.onclick=()=>y.setState({currentView:`admin`})),this.container.querySelectorAll(`[data-seo-tool]`).forEach(e=>{e.onclick=()=>{let t=e.getAttribute(`data-seo-tool`);this.render(t)}})}}})),ie,ae=o((()=>{b(),C(),O(),ie=class{constructor(e,t){this.container=e,this.onOpenStudio=t,this.projects=[],this.jobs=[],this.currentTab=`projects`}async loadData(){try{let e=await S.getProjects();this.projects=e.projects||[];let t=await S.getJobs();this.jobs=t.jobs||[]}catch(e){console.warn(`Dashboard data fetch note:`,e)}this.render()}render(){let e=y.getState().user;this.container.innerHTML=`
      <div class="dashboard-page">
        <!-- Top Nav -->
        <header class="landing-nav">
          <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" id="dash-brand-home">
            <div class="brand-logo">CF</div>
            <div class="brand-title">
              <span>CreativeForge AI</span>
              <span class="brand-subtitle">User Workspace Dashboard</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:14px;">
            <button class="btn btn-secondary btn-sm" id="btn-dash-landing">Public Website</button>
            <button class="btn btn-primary btn-sm" id="btn-dash-studio">Open Creative Studio →</button>
          </div>
        </header>

        <div class="dashboard-container">
          <!-- Header -->
          <div class="dashboard-header">
            <div class="dashboard-title-area">
              <h1>Welcome back, ${e.name}</h1>
              <p>Plan: <span style="color:var(--accent-secondary); font-weight:700;">${e.plan_id}</span> • Manage your creative assets, projects, and processing queue.</p>
            </div>
            <button class="btn btn-primary" id="btn-new-project-dash">+ New Project</button>
          </div>

          <!-- Metric Cards -->
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-header"><span>Total Projects</span><span>📁</span></div>
              <div class="metric-value">${this.projects.length}</div>
              <div class="metric-subtext">Active creative workspaces</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Processing Jobs</span><span>⚡</span></div>
              <div class="metric-value">${this.jobs.length}</div>
              <div class="metric-subtext">Completed & queued operations</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Remaining Credits</span><span>💎</span></div>
              <div class="metric-value" style="color:#818cf8;">${e.credits}</div>
              <div class="metric-subtext">Renews monthly on ${e.plan_id}</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Storage Used</span><span>☁</span></div>
              <div class="metric-value">14.2 MB</div>
              <div class="metric-subtext">Non-destructive cloud cache</div>
            </div>
          </div>

          <!-- Tab Bar -->
          <div class="dashboard-tabs">
            <div class="dash-tab ${this.currentTab===`projects`?`active`:``}" id="tab-btn-projects">Recent Projects</div>
            <div class="dash-tab ${this.currentTab===`history`?`active`:``}" id="tab-btn-history">Processing History (${this.jobs.length})</div>
          </div>

          <!-- Tab 1: Projects Grid -->
          <div id="tab-content-projects" style="${this.currentTab===`projects`?``:`display:none;`}">
            <div class="projects-grid">
              ${this.projects.map(e=>`
                <div class="project-card">
                  <div class="project-thumbnail">
                    ${e.thumbnail?`<img src="${e.thumbnail}" alt="${e.name}" />`:`
                      <div style="font-size:2.5rem; color:var(--text-muted);">✦</div>
                    `}
                  </div>
                  <div class="project-card-body">
                    <h3 class="project-card-title">${e.name}</h3>
                    <div class="project-card-meta">
                      <span>${new Date(e.created_at).toLocaleDateString()}</span>
                      <span class="badge badge-indigo">${e.assetCount||1} Assets</span>
                    </div>
                    <div class="project-card-actions">
                      <button class="btn btn-primary btn-sm btn-open-project" data-proj-id="${e.id}">Open Studio</button>
                      <div style="display:flex; gap:6px;">
                        <button class="btn btn-secondary btn-sm btn-dup-project" data-proj-id="${e.id}" title="Duplicate">Copy</button>
                        <button class="btn btn-secondary btn-sm btn-del-project" data-proj-id="${e.id}" style="color:var(--status-danger);" title="Delete">✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              `).join(``)}
            </div>
          </div>

          <!-- Tab 2: Processing Jobs History Table -->
          <div id="tab-content-history" style="${this.currentTab===`history`?``:`display:none;`}">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Creative Tool</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.jobs.length===0?`
                    <tr><td colspan="5" style="text-align:center; padding:30px;">No processing jobs yet. Launch the studio to transform assets.</td></tr>
                  `:this.jobs.map(e=>`
                    <tr>
                      <td style="font-family:var(--font-mono); font-size:0.75rem;">${e.id}</td>
                      <td><strong>${e.tool.replace(`tool_`,``)}</strong></td>
                      <td><span class="status-pill status-${e.status}">${e.status}</span></td>
                      <td>${new Date(e.created_at).toLocaleString()}</td>
                      <td>
                        <button class="btn btn-secondary btn-sm btn-open-job-studio" data-tool="${e.tool}">Reopen Tool</button>
                      </td>
                    </tr>
                  `).join(``)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `,this.bindEvents()}bindEvents(){this.container.querySelector(`#dash-brand-home`).onclick=()=>y.setState({currentView:`landing`}),this.container.querySelector(`#btn-dash-landing`).onclick=()=>y.setState({currentView:`landing`}),this.container.querySelector(`#btn-dash-studio`).onclick=()=>this.onOpenStudio(),this.container.querySelector(`#btn-new-project-dash`).onclick=async()=>{let e=prompt(`Enter new project name:`,`Studio Artwork `+(this.projects.length+1));if(e){let t=await S.createProject(e);y.setState({project:t.project}),D.success(`Project "${e}" created!`),this.onOpenStudio()}};let e=this.container.querySelector(`#tab-btn-projects`),t=this.container.querySelector(`#tab-btn-history`),n=this.container.querySelector(`#tab-content-projects`),r=this.container.querySelector(`#tab-content-history`);e.onclick=()=>{this.currentTab=`projects`,e.classList.add(`active`),t.classList.remove(`active`),n.style.display=`block`,r.style.display=`none`},t.onclick=()=>{this.currentTab=`history`,t.classList.add(`active`),e.classList.remove(`active`),r.style.display=`block`,n.style.display=`none`},this.container.querySelectorAll(`.btn-open-project`).forEach(e=>{e.onclick=e=>{let t=e.target.getAttribute(`data-proj-id`),n=this.projects.find(e=>e.id===t);n&&y.setState({project:n}),this.onOpenStudio()}}),this.container.querySelectorAll(`.btn-dup-project`).forEach(e=>{e.onclick=async e=>{let t=e.target.getAttribute(`data-proj-id`);await S.duplicateProject(t),D.success(`Project duplicated!`),this.loadData()}}),this.container.querySelectorAll(`.btn-del-project`).forEach(e=>{e.onclick=async e=>{let t=e.target.getAttribute(`data-proj-id`);confirm(`Are you sure you want to delete this project?`)&&(await S.deleteProject(t),D.success(`Project removed.`),this.loadData())}}),this.container.querySelectorAll(`.btn-open-job-studio`).forEach(e=>{e.onclick=e=>{let t=e.target.getAttribute(`data-tool`);y.setState({activeTool:t}),this.onOpenStudio()}})}}})),oe,se=o((()=>{b(),C(),O(),oe=class{constructor(e,t){this.container=e,this.onOpenStudio=t,this.overview=null,this.users=[],this.tools=[],this.currentTab=`overview`}async loadData(){try{this.overview=await S.getAdminOverview();let e=await S.getAdminUsers();this.users=e.users||[];let t=await S.getAdminTools();this.tools=t.tools||[]}catch(e){console.warn(`Admin fetch notice:`,e)}this.render()}render(){let e=this.overview||{metrics:{totalUsers:3,totalProjects:2,totalJobs:0,estimatedMrr:178,storageUsedMb:14.2},queue:{active:0,queued:0,completed:0,failed:0},storage:{totalMb:14.2},backup:{enabled:!0,backupCount:1},mostUsedTools:[]};this.container.innerHTML=`
      <div class="dashboard-page">
        <!-- Top Nav -->
        <header class="landing-nav">
          <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" id="admin-brand-home">
            <div class="brand-logo" style="background:linear-gradient(135deg, #ec4899, #f59e0b);">CF</div>
            <div class="brand-title">
              <span>CreativeForge Admin Console</span>
              <span class="brand-subtitle" style="color:var(--accent-tertiary);">Platform Operations & Control</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:14px;">
            <button class="btn btn-secondary btn-sm" id="btn-admin-dashboard">User Dashboard</button>
            <button class="btn btn-primary btn-sm" id="btn-admin-studio">Open Creative Studio →</button>
          </div>
        </header>

        <div class="dashboard-container">
          <!-- Admin Banner -->
          <div class="admin-badge-strip">
            <span style="font-size:1.3rem;">🛡</span>
            <div style="flex:1;">
              <strong>Admin Mode Active:</strong> You have system-level permissions to configure credits, enable/disable tools, trigger automated backups, and inspect the real-time background job queue.
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-trigger-backup">Trigger Backup Now</button>
          </div>

          <!-- Overview Stats -->
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-header"><span>Monthly Run Rate</span><span>💰</span></div>
              <div class="metric-value" style="color:#34d399;">$${e.metrics.estimatedMrr}</div>
              <div class="metric-subtext">Active SaaS subscriptions</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Registered Users</span><span>👥</span></div>
              <div class="metric-value">${e.metrics.totalUsers}</div>
              <div class="metric-subtext">Creators & enterprise accounts</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Active Queue Workers</span><span>⚙</span></div>
              <div class="metric-value" style="color:#818cf8;">${e.queue.active} Active / ${e.queue.queued} Queued</div>
              <div class="metric-subtext">3 Max concurrent tasks</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Storage Footprint</span><span>💾</span></div>
              <div class="metric-value">${e.metrics.storageUsedMb} MB</div>
              <div class="metric-subtext">Originals, SVGs & ZIP packages</div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="dashboard-tabs">
            <div class="dash-tab ${this.currentTab===`overview`?`active`:``}" id="adm-tab-ov">System Overview</div>
            <div class="dash-tab ${this.currentTab===`users`?`active`:``}" id="adm-tab-users">User Accounts (${this.users.length})</div>
            <div class="dash-tab ${this.currentTab===`tools`?`active`:``}" id="adm-tab-tools">Tools & Credit Pricing (${this.tools.length})</div>
          </div>

          <!-- Tab Content 1: System Overview & Analytics -->
          <div id="adm-content-ov" style="${this.currentTab===`overview`?``:`display:none;`}">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-bottom:30px;">
              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:10px; padding:20px;">
                <h3 style="font-size:1.1rem; margin-bottom:14px;">Automated Backup Status</h3>
                <div style="font-size:0.85rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:8px;">
                  <div>Automated Daily Backups: <strong style="color:var(--status-success);">Enabled (Every 24h)</strong></div>
                  <div>Retention Period: <strong>30 Days</strong></div>
                  <div>Total Snapshots: <strong>${e.backup?.backupCount||1}</strong></div>
                  <div>Storage Driver: <strong>Local Disk / S3 Object Compatible</strong></div>
                </div>
              </div>

              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:10px; padding:20px;">
                <h3 style="font-size:1.1rem; margin-bottom:14px;">AI Provider Abstraction Layer</h3>
                <div style="font-size:0.85rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:8px;">
                  <div>Active Provider: <strong>Mock / Local Engine Mode</strong></div>
                  <div>API Key Hook: <strong>Extensible via AI_PROVIDER_API_KEY</strong></div>
                  <div>Supported Cloud Models: <strong>Replicate (Real-ESRGAN), Stability AI</strong></div>
                  <div>Fallback Status: <strong style="color:var(--status-success);">Operational (Deterministic bicubic/potrace)</strong></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Content 2: Users Management Table -->
          <div id="adm-content-users" style="${this.currentTab===`users`?``:`display:none;`}">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Plan</th>
                    <th>Credits Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.users.map(e=>`
                    <tr>
                      <td><strong>${e.name}</strong></td>
                      <td>${e.email}</td>
                      <td><span class="badge ${e.role===`admin`?`badge-cyan`:`badge-indigo`}">${e.role.toUpperCase()}</span></td>
                      <td><span class="badge badge-warning">${e.plan_id}</span></td>
                      <td>
                        <span style="font-family:var(--font-mono); font-weight:700;">${e.credits}</span>
                      </td>
                      <td>
                        <button class="btn btn-secondary btn-sm btn-adjust-credits" data-user-id="${e.id}" data-credits="${e.credits}">+ Adjust Credits</button>
                      </td>
                    </tr>
                  `).join(``)}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab Content 3: Tools Configuration & Credit Consumption -->
          <div id="adm-content-tools" style="${this.currentTab===`tools`?``:`display:none;`}">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Tool Name</th>
                    <th>Category</th>
                    <th>Credit Cost</th>
                    <th>Status</th>
                    <th>Quick Edit</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.tools.map(e=>`
                    <tr>
                      <td><strong>${e.name}</strong></td>
                      <td><span class="badge badge-indigo">${e.category.toUpperCase()}</span></td>
                      <td>
                        <span style="font-family:var(--font-mono); font-weight:700;">${e.credit_cost} Credits</span>
                      </td>
                      <td>
                        <span class="status-pill ${e.enabled?`status-completed`:`status-failed`}">
                          ${e.enabled?`Enabled`:`Disabled`}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-secondary btn-sm btn-edit-tool" data-tool-id="${e.id}" data-cost="${e.credit_cost}" data-enabled="${e.enabled}">
                          Edit Cost / State
                        </button>
                      </td>
                    </tr>
                  `).join(``)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `,this.bindEvents()}bindEvents(){this.container.querySelector(`#admin-brand-home`).onclick=()=>y.setState({currentView:`landing`}),this.container.querySelector(`#btn-admin-dashboard`).onclick=()=>y.setState({currentView:`dashboard`}),this.container.querySelector(`#btn-admin-studio`).onclick=()=>this.onOpenStudio();let e=this.container.querySelector(`#btn-trigger-backup`);e&&(e.onclick=async()=>{try{let e=await S.triggerBackup();D.success(`Backup created: ${e.backup.filename} (${e.backup.size_kb} KB)`)}catch{D.error(`Failed to trigger backup`)}});let t=this.container.querySelector(`#adm-tab-ov`),n=this.container.querySelector(`#adm-tab-users`),r=this.container.querySelector(`#adm-tab-tools`),i=this.container.querySelector(`#adm-content-ov`),a=this.container.querySelector(`#adm-content-users`),o=this.container.querySelector(`#adm-content-tools`);t.onclick=()=>{this.currentTab=`overview`,t.classList.add(`active`),n.classList.remove(`active`),r.classList.remove(`active`),i.style.display=`block`,a.style.display=`none`,o.style.display=`none`},n.onclick=()=>{this.currentTab=`users`,n.classList.add(`active`),t.classList.remove(`active`),r.classList.remove(`active`),a.style.display=`block`,i.style.display=`none`,o.style.display=`none`},r.onclick=()=>{this.currentTab=`tools`,r.classList.add(`active`),t.classList.remove(`active`),n.classList.remove(`active`),o.style.display=`block`,i.style.display=`none`,a.style.display=`none`},this.container.querySelectorAll(`.btn-adjust-credits`).forEach(e=>{e.onclick=async e=>{let t=e.target.getAttribute(`data-user-id`),n=e.target.getAttribute(`data-credits`),r=prompt(`Set new credit balance for user:`,n);r!==null&&(await S.updateAdminUser(t,{credits:parseInt(r,10)}),D.success(`User credits updated!`),this.loadData())}}),this.container.querySelectorAll(`.btn-edit-tool`).forEach(e=>{e.onclick=async e=>{let t=e.target.getAttribute(`data-tool-id`),n=e.target.getAttribute(`data-cost`),r=prompt(`Set credit cost for tool:`,n);r!==null&&(await S.updateAdminTool(t,{credit_cost:parseInt(r,10)}),D.success(`Tool credit consumption updated!`),this.loadData())}})}}}));s((()=>{d(),f(),p(),m(),h(),g(),_(),b(),C(),T(),te(),re(),ae(),se();var e=new class{constructor(){this.appRoot=document.getElementById(`app`),this.studioView=null,this.landingView=null,this.dashboardView=null,this.adminView=null,this.lastRenderedView=null}async init(){let{canvas:e,img:t}=w();y.setState({originalImage:t,originalImageUrl:t.src,originalFileName:`cyber-prism-artwork.png`,originalWidth:1200,originalHeight:800});try{let e=await S.getMe();e.user&&y.setState({user:e.user})}catch{console.log(`[Offline/Demo User Active]`)}this.studioView=new $(this.appRoot),this.landingView=new ne(this.appRoot,()=>{y.setState({currentView:`studio`})}),this.dashboardView=new ie(this.appRoot,()=>{y.setState({currentView:`studio`})}),this.adminView=new oe(this.appRoot,()=>{y.setState({currentView:`studio`})}),y.subscribe(e=>{e.currentView!==this.lastRenderedView&&this.renderCurrentView(e.currentView)});let n=window.location.pathname.replace(/^\//,``);[`image-upscaler`,`image-to-vector`,`background-remover`,`gradient-maker`,`icon-pack-maker`,`fractal-glass`].includes(n)?y.setState({currentView:`landing`,activeSeoTool:n}):y.setState({currentView:`studio`}),this.renderCurrentView(y.getState().currentView),this.bindGlobalShortcuts()}renderCurrentView(e){this.lastRenderedView=e,window.scrollTo(0,0),e===`landing`?this.landingView.render(y.getState().activeSeoTool):e===`dashboard`?this.dashboardView.loadData():e===`admin`?this.adminView.loadData():this.studioView.render()}bindGlobalShortcuts(){window.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`z`&&!e.shiftKey&&(e.preventDefault(),y.undo(),this.studioView&&y.getState().currentView===`studio`&&(this.studioView.renderInspector(),this.studioView.updateProcessing())),(e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()===`y`||e.shiftKey&&e.key.toLowerCase()===`z`)&&(e.preventDefault(),y.redo(),this.studioView&&y.getState().currentView===`studio`&&(this.studioView.renderInspector(),this.studioView.updateProcessing()))})}};document.addEventListener(`DOMContentLoaded`,()=>{e.init()})}))();