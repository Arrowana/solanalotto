(function(e){function t(t){for(var n,c,o=t[0],u=t[1],s=t[2],p=0,f=[];p<o.length;p++)c=o[p],Object.prototype.hasOwnProperty.call(a,c)&&a[c]&&f.push(a[c][0]),a[c]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);l&&l(t);while(f.length)f.shift()();return i.push.apply(i,s||[]),r()}function r(){for(var e,t=0;t<i.length;t++){for(var r=i[t],n=!0,o=1;o<r.length;o++){var u=r[o];0!==a[u]&&(n=!1)}n&&(i.splice(t--,1),e=c(c.s=r[0]))}return e}var n={},a={app:0},i=[];function c(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,c),r.l=!0,r.exports}c.m=e,c.c=n,c.d=function(e,t,r){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(c.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)c.d(r,n,function(t){return e[t]}.bind(null,n));return r},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/solanalotto/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],u=o.push.bind(o);o.push=t,o=o.slice();for(var s=0;s<o.length;s++)t(o[s]);var l=u;i.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},1:function(e,t){},2:function(e,t){},"25dc":function(e,t,r){"use strict";r("c54c")},3:function(e,t){},4:function(e,t){},"56d7":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",{style:{background:e.$vuetify.theme.themes["dark"].background},attrs:{id:"app"}},[n("v-app-bar",{attrs:{app:""}},[n("v-row",{staticClass:"mt-6"},[n("v-col",[n("v-toolbar-title",[e._v("Solanalotto")])],1),n("v-col"),n("v-col",[n("v-select",{attrs:{label:"Cluster",items:e.clusters},model:{value:e.cluster,callback:function(t){e.cluster=t},expression:"cluster"}})],1)],1)],1),n("v-spacer"),n("v-main",[n("v-container",[n("v-img",{staticClass:"mx-lg-auto",attrs:{src:r("b0e8"),"max-width":"25%"}})],1),n("v-container",[n("v-text-field",{attrs:{label:"Account private key","error-messages":e.privateKeyError?[e.privateKeyError]:[],rules:e.privateKeyRules},model:{value:e.privateKey,callback:function(t){e.privateKey=t},expression:"privateKey"}}),n("v-checkbox",{attrs:{label:"Choose program ID"},model:{value:e.customProgramId,callback:function(t){e.customProgramId=t},expression:"customProgramId"}}),e.customProgramId?n("v-text-field",{attrs:{label:"Custom program ID"},model:{value:e.programId,callback:function(t){e.programId=t},expression:"programId"}}):e._e(),null!==e.sol?n("p",[e._v(e._s(e.sol)+" SOL")]):n("p",[e._v("Enter private key to reveal SOL balance")])],1),n("v-container",[n("CreateLottery",{attrs:{privateKey:e.privateKey,programId:e.programId}})],1),n("v-container",[n("v-row",[n("Lotteries",{attrs:{lotteries:e.lotteries,userAccountPubkey:e.userAccountPubkey},on:{enter:e.onEnter,receive:e.onReceive}})],1)],1)],1)],1)},i=[],c=(r("b64b"),r("96cf"),r("1da1")),o=r("64b9"),u=r("8721"),s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("h1",[e._v("New lottery")]),r("v-text-field",{attrs:{label:"Ticket price",type:"number"},model:{value:e.ticketPrice,callback:function(t){e.ticketPrice=e._n(t)},expression:"ticketPrice"}}),e._v(" SOL "),r("v-btn",{attrs:{disabled:!e.canCreate()},on:{click:e.create}},[e._v("Create")]),e.canCreate()?e._e():r("p",[e._v("Private key and program id required")])],1)},l=[],p={data:function(){return{ticketPrice:1}},props:{privateKey:{type:String,required:!0},programId:{type:String,required:!0}},methods:{create:function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(u["e"])(this.$props.privateKey,this.$data.ticketPrice,this.$props.programId);case 2:t=e.sent,console.log("lotteryInfo: ".concat(t.ticketPrice));case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),canCreate:function(){return""!==this.$propsprivateKey&&""!==this.$props.programId}}},f=p,d=r("2877"),m=r("6544"),v=r.n(m),b=r("8336"),h=r("8654"),g=Object(d["a"])(f,s,l,!1,null,null,null),y=g.exports;v()(g,{VBtn:b["a"],VTextField:h["a"]});var k=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",[r("h1",[e._v("Lotteries")]),r("p",[e._v(" Ongoing lotteries ")]),e._l(e.lotteries,(function(t,n){return r("v-card",{key:n,staticClass:"m-6",attrs:{tile:""}},[r("v-card-title",[e._v("Lottery account "),r("a",{attrs:{href:"https://explorer.solana.com/address/"+t.lotteryAccountPubkey+"?customUrl=http://127.0.0.1:8899&cluster=custom"}},[e._v(e._s(t.lotteryAccountPubkey.slice(0,8))+"...")])]),r("v-list-item",[e._v("Ticket price: "+e._s(t.ticketPrice/e.LAMPORTS_PER_SOL)+" SOL")]),r("v-list-item",[e._v("Winnings: "+e._s(t.ticketPrice/e.LAMPORTS_PER_SOL*t.max_entrant_count)+" SOL")]),r("v-list-item",[e._v("Entrants: "+e._s(t.entrants.length)+"/"+e._s(t.max_entrant_count))]),t.winnerAccountPubkey?r("v-list-item",[e._v("Winner "),r("a",{attrs:{href:""}},[e._v(e._s(t.winnerAccountPubkey))])]):e._e(),r("v-card-actions",[e.userAccountPubkey&&e.userAccountPubkey===t.winnerAccountPubkey?r("v-btn",{attrs:{color:"green lighten-1"},on:{click:function(r){return e.receive(t)}}},[e._v("Claim")]):e._e(),!e.userAccountPubkey||t.winnerAccountPubkey||t.entrants.includes(e.userAccountPubkey)?e._e():r("v-btn",{on:{click:function(r){return e.enter(t)}}},[e._v("Enter")]),t.entrants.includes(e.userAccountPubkey)?r("v-btn",{attrs:{disabled:""}},[e._v("Entered")]):e._e()],1)],1)})),0==e.lotteries.length?r("p",[e._v("No lottery")]):e._e()],2)},w=[],x={props:["lotteries","userAccountPubkey"],data:function(){return{LAMPORTS_PER_SOL:o["c"]}},methods:{enter:function(e){this.$emit("enter",e)},receive:function(e){this.$emit("receive",e)}}},P=x,_=(r("25dc"),r("b0af")),A=r("99d9"),I=r("a523"),O=r("da13"),R=Object(d["a"])(P,k,w,!1,null,"19f0ddea",null),j=R.exports;v()(R,{VBtn:b["a"],VCard:_["a"],VCardActions:A["a"],VCardTitle:A["b"],VContainer:I["a"],VListItem:O["a"]});var K={devnet:{url:"https://devnet.solana.com",programId:"3zAfBWGppVofNk9Cqfziob3QTLT2BPECmpmj2P66eWNJ"},localnet:{url:"http://127.0.0.1:8899",programId:"72MgRTDhBWRveLLJn7D1uz21D4bW76PJd6q1oFGVxbmK"}},S={name:"App",data:function(){return{cluster:"localnet",userAccount:null,userAccountInfo:null,privateKey:"",privateKeyError:null,programId:"",lotteries:[],privateKeyRules:[function(e){return"Required."|!!e}],customProgramId:!1}},components:{CreateLottery:y,Lotteries:j},watch:{cluster:{immediate:!0,handler:function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(Object(u["a"])(K[t].url),!this.userAccountInfo){e.next=5;break}return e.next=4,Object(u["c"])(this.userAccount);case 4:this.userAccountInfo=e.sent;case 5:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},customProgramId:{immediate:!0,handler:function(e){e||(this.programId=K[this.cluster].programId)}},programId:{immediate:!0,handler:function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.fetchLotteries();case 2:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},privateKey:function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.privateKeyError=null,this.userAccount=null,e.prev=2,this.userAccount=Object(u["f"])(t),e.next=6,Object(u["c"])(this.userAccount);case 6:this.userAccountInfo=e.sent,e.next=12;break;case 9:e.prev=9,e.t0=e["catch"](2),this.privateKeyError=e.t0.message;case 12:case"end":return e.stop()}}),e,this,[[2,9]])})));function t(t){return e.apply(this,arguments)}return t}()},computed:{userAccountPubkey:function(){var e;return null===(e=this.userAccount)||void 0===e?void 0:e.publicKey.toBase58()},sol:function(){var e;return(null===(e=this.userAccountInfo)||void 0===e?void 0:e.lamports)/o["c"]},clusters:function(){return Object.keys(K)},theme:function(){return this.$vuetify.theme.dark?"dark":"light"}},methods:{onEnter:function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(t){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(u["b"])(this.privateKey,t.lotteryAccountPubkey,this.programId);case 2:return r=e.sent,console.log(r),e.next=6,this.fetchLotteries();case 6:return e.next=8,Object(u["c"])(this.userAccount);case 8:this.userAccountInfo=e.sent;case 9:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),onReceive:function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(t){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(u["g"])(this.privateKey,t.lotteryAccountPubkey,this.programId);case 2:return r=e.sent,console.log(r),e.next=6,this.fetchLotteries();case 6:return e.next=8,Object(u["c"])(this.userAccount);case 8:this.userAccountInfo=e.sent;case 9:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),fetchLotteries:function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(u["d"])(this.$data.programId);case 2:t=e.sent,console.log(t),this.lotteries=t;case 5:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}},C=S,L=r("7496"),T=r("40dc"),V=r("ac7c"),E=r("62ad"),B=r("adda"),$=r("f6c4"),W=r("0fd9"),G=r("b974"),z=r("2fa4"),M=r("2a7f"),q=Object(d["a"])(C,a,i,!1,null,null,null),D=q.exports;v()(q,{VApp:L["a"],VAppBar:T["a"],VCheckbox:V["a"],VCol:E["a"],VContainer:I["a"],VImg:B["a"],VMain:$["a"],VRow:W["a"],VSelect:G["a"],VSpacer:z["a"],VTextField:h["a"],VToolbarTitle:M["a"]});var J=r("f309"),N=r("fcf4");n["a"].use(J["a"]);var F=new J["a"]({theme:{dark:!0,themes:{dark:{background:N["a"].shades.black}}}});n["a"].config.productionTip=!1,new n["a"]({vuetify:F,render:function(e){return e(D)}}).$mount("#app")},8721:function(e,t,r){"use strict";(function(e){r.d(t,"a",(function(){return s})),r.d(t,"f",(function(){return l})),r.d(t,"c",(function(){return p})),r.d(t,"e",(function(){return f})),r.d(t,"b",(function(){return d})),r.d(t,"g",(function(){return m})),r.d(t,"d",(function(){return h}));r("99af"),r("4de4"),r("d81d"),r("d3b7"),r("ac1f"),r("1276"),r("96cf");var n=r("1da1"),a=r("64b9"),i=r("399f"),c=r.n(i),o=r("c4c1"),u=new a["b"]("http://localhost:8899","singleGossip"),s=function(e){u=new a["b"](e,"singleGossip")},l=function(e){var t=e.split(",").map((function(e){return parseInt(e)}));return new a["a"](t)},p=function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,u.getAccountInfo(t.publicKey,"singleGossip");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),f=function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(r,n,i){var c,s,l,p,f,d,m,v,h,g;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return c=r.split(",").map((function(e){return parseInt(e)})),s=new a["a"](c),console.log("initializer pubKey: ".concat(s.publicKey.toBase58())),l=new a["d"](i),p=new a["a"],t.t0=a["f"],t.t1=s.publicKey,t.t2=p.publicKey,t.t3=o["a"].span,t.next=11,u.getMinimumBalanceForRentExemption(o["a"].span,"singleGossip");case 11:return t.t4=t.sent,t.t5=n*a["c"],t.t6=t.t4+t.t5,t.t7=l,t.t8={fromPubkey:t.t1,newAccountPubkey:t.t2,space:t.t3,lamports:t.t6,programId:t.t7},f=t.t0.createAccount.call(t.t0,t.t8),d=e.concat([e.from([0]),s.publicKey.toBuffer()]),m=new a["h"]({programId:l,keys:[{pubkey:p.publicKey,isSigner:!1,isWritable:!0},{pubkey:a["e"],isSigner:!1,isWritable:!1}],data:d}),v=(new a["g"]).add(f,m),t.next=22,u.sendTransaction(v,[s,p],{skipPreflight:!1,preflightCommitment:"singleGossip"});case 22:return h=t.sent,console.log("Tx signature: ".concat(h)),t.next=26,new Promise((function(e){return setTimeout(e,1e3)}));case 26:return t.next=28,u.getAccountInfo(p.publicKey,"singleGossip");case 28:return g=t.sent,t.abrupt("return",b(p.publicKey,g));case 30:case"end":return t.stop()}}),t)})));return function(e,r,n){return t.apply(this,arguments)}}(),d=function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(r,n,i){var c,o,s,l,p,f,d,m;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return c=r.split(",").map((function(e){return parseInt(e)})),o=new a["a"](c),s=new a["d"](n),l=new a["d"](i),p=new a["h"]({programId:l,keys:[{pubkey:o.publicKey,isSigner:!0,isWritable:!1},{pubkey:s,isSigner:!1,isWritable:!0},{pubkey:a["f"].programId,isSigner:!1,isWritable:!1}],data:e.from([1])}),f=(new a["g"]).add(p),t.next=8,u.sendTransaction(f,[o],{skipPreflight:!1,preflightCommitment:"singleGossip"});case 8:return d=t.sent,console.log("Tx signature: ".concat(d)),t.next=12,new Promise((function(e){return setTimeout(e,1e3)}));case 12:return t.next=14,u.getAccountInfo(s,"singleGossip");case 14:return m=t.sent,t.abrupt("return",b(s,m));case 16:case"end":return t.stop()}}),t)})));return function(e,r,n){return t.apply(this,arguments)}}(),m=function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(r,n,i){var c,o,s,l,p,f,d;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return c=r.split(",").map((function(e){return parseInt(e)})),o=new a["a"](c),s=new a["d"](n),l=new a["d"](i),p=new a["h"]({programId:l,keys:[{pubkey:o.publicKey,isSigner:!0,isWritable:!1},{pubkey:s,isSigner:!1,isWritable:!0}],data:e.from([2])}),f=(new a["g"]).add(p),t.next=8,u.sendTransaction(f,[o],{skipPreflight:!1,preflightCommitment:"singleGossip"});case 8:d=t.sent,console.log("Tx signature: ".concat(d));case 10:case"end":return t.stop()}}),t)})));return function(e,r,n){return t.apply(this,arguments)}}(),v="11111111111111111111111111111111",b=function(e,t){var r=o["a"].decode(t.data),n=new a["d"](r.winnerAccountPubkey).toBase58(),i=r.entrants.map((function(e){return new a["d"](e).toBase58()})).filter((function(e){return e!==v}));return{lotteryAccountPubkey:e.toBase58(),isInitialized:!!r.isInitialized,initializerAccountPubkey:new a["d"](r.initializerPubkey).toBase58(),ticketPrice:new c.a(r.ticketPrice,10,"le").toNumber(),winnerAccountPubkey:n!=v?n:null,entrants:i,max_entrant_count:5}},h=function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){var r,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=new a["d"](t),e.next=3,u.getProgramAccounts(r,"singleGossip");case 3:return n=e.sent,e.abrupt("return",n.map((function(e){var t=e.pubkey,r=e.account;return b(t,r)})));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}).call(this,r("1c35").Buffer)},b0e8:function(e,t,r){e.exports=r.p+"img/solanalotto-neon.ac35fa38.jpeg"},c4c1:function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));var n=r("901e"),a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"publicKey";return n["blob"](32,e)},i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"uint64";return n["blob"](8,e)},c=5,o=n["struct"]([n["u8"]("isInitialized"),a("initializerPubkey"),i("ticketPrice"),a("winnerAccountPubkey"),n["seq"](a(),c,"entrants")])},c54c:function(e,t,r){}});
//# sourceMappingURL=app.13f4421c.js.map