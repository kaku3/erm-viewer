(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{197:function(t,e,n){var content=n(255);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(81).default)("dc093880",content,!0,{sourceMap:!1})},208:function(t,e,n){"use strict";var r={name:"DefaultLayout",data:function(){return{}}},o=n(73),c=n(102),l=n.n(c),d=n(279),f=n(280),component=Object(o.a)(r,(function(){var t=this.$createElement,e=this._self._c||t;return e("v-app",[e("v-main",[e("Nuxt")],1)],1)}),[],!1,null,null,null);e.a=component.exports;l()(component,{VApp:d.a,VMain:f.a})},225:function(t,e,n){n(226),t.exports=n(227)},254:function(t,e,n){"use strict";n(197)},255:function(t,e,n){var r=n(80)(!1);r.push([t.i,"h1[data-v-35e10596]{font-size:20px}",""]),t.exports=r},56:function(t,e,n){"use strict";var r={name:"EmptyLayout",layout:"empty",props:{error:{type:Object,default:null}},data:function(){return{pageNotFound:"404 Not Found",otherError:"An error occurred"}},head:function(){return{title:404===this.error.statusCode?this.pageNotFound:this.otherError}}},o=(n(254),n(73)),c=n(102),l=n.n(c),d=n(279),component=Object(o.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",{attrs:{dark:""}},[404===t.error.statusCode?n("h1",[t._v("\n    "+t._s(t.pageNotFound)+"\n  ")]):n("h1",[t._v("\n    "+t._s(t.otherError)+"\n  ")]),t._v(" "),n("NuxtLink",{attrs:{to:"/"}},[t._v("\n    Home page\n  ")])],1)}),[],!1,null,"35e10596",null);e.a=component.exports;l()(component,{VApp:d.a})}},[[225,10,5,11]]]);