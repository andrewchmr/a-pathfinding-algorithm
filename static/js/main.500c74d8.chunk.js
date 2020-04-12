(this["webpackJsonpa-pathfinding-algorithm"]=this["webpackJsonpa-pathfinding-algorithm"]||[]).push([[0],{14:function(e,t,n){},17:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(8),o=n.n(a);n(14),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var i=n(4),u=n(1),l={cols:30,rows:30,width:window.innerWidth,height:window.innerHeight},f=function(e){var t=e.path;return c.a.createElement("path",{strokeWidth:y/2,strokeLinecap:"round",d:function(e,t,n){if(e.length>0){for(var r="M".concat(e[0].i*t+t/2,",").concat(e[0].j*n+n/2),c="",a=1;a<e.length;a++)c+="L".concat(e[a].i*t+t/2,",").concat(e[a].j*n+n/2);return"".concat(r).concat(c)}return""}(t,y,k),fill:"none",stroke:"purple"})},h=l.width,s=l.height,v=function(e){var t=e.children,n="".concat(-h/2+S," ").concat(-s/2+x," ").concat(2*h," ").concat(2*s);return c.a.createElement("svg",{viewBox:n},t)},p=function(e){var t=e.i,n=e.j,r=e.color;return c.a.createElement("rect",{x:t*y,y:n*k,width:y,height:k,fill:r})},g=function(e){var t=e.cells,n=e.color;return c.a.createElement("g",null,t.map((function(e){return c.a.createElement(p,{i:e.i,j:e.j,color:n,key:"".concat(e.i,"-").concat(e.j)})})))},d=function(e){var t=e.i,n=e.j;return c.a.createElement("ellipse",{fill:"white",cx:t*y+y/2,cy:n*k+k/2,rx:y/4,ry:k/4})},j=function(e){var t=e.grid;return c.a.createElement("g",null,t.map((function(e){return e.filter((function(e){return e.wall})).map((function(e){return c.a.createElement(d,{i:e.i,j:e.j,key:"".concat(e.i,"-").concat(e.j)})}))})))},m=l.cols,w=l.rows,b=l.height,E=l.width,O=E>b?b:E,y=O/m,k=O/w,S=E>b?-O/2:0,x=E>b?0:-O/4,M=function(e){var t=e.grid,n=e.openSet,r=e.closedSet,a=e.path;return c.a.createElement(v,null,c.a.createElement(j,{grid:t}),c.a.createElement(g,{cells:n,color:"yellow"}),c.a.createElement(g,{cells:r,color:"lightgrey"}),c.a.createElement(p,{i:w-1,j:m-1,color:"lime"}),c.a.createElement(f,{path:a}))},W=n(5),A=l.cols,B=l.rows,I=function(){var e=Object(r.useState)(S()),t=Object(u.a)(e,2),n=t[0],a=t[1],o=Object(r.useState)([n[0][0]]),l=Object(u.a)(o,2),f=l[0],h=l[1],s=Object(r.useState)([]),v=Object(u.a)(s,2),p=v[0],g=v[1],d=Object(r.useState)([]),j=Object(u.a)(d,2),m=j[0],w=j[1],b=Object(r.useState)(!0),E=Object(u.a)(b,2),O=E[0],y=E[1];function k(e,t,n){var r=[];return e<A-1&&r.push(n[e+1][t]),e>0&&r.push(n[e-1][t]),t<B-1&&r.push(n[e][t+1]),t>0&&r.push(n[e][t-1]),e>0&&t>0&&r.push(n[e-1][t-1]),e<A-1&&t>0&&r.push(n[e+1][t-1]),e>0&&t<B-1&&r.push(n[e-1][t+1]),e<A-1&&t<B-1&&r.push(n[e+1][t+1]),r}function S(){for(var e=[],t=0;t<A;t++)e[t]=new Array(B);for(var n=0;n<A;n++)for(var r=0;r<B;r++)e[n][r]={i:n,j:r,wall:Math.random()<.4,f:0,g:0,h:0,neighbors:[],previous:void 0};for(var c=0;c<A;c++)for(var a=0;a<B;a++)e[c][a].neighbors=k(c,a,e);return e[0][0].wall=!1,e[A-1][B-1].wall=!1,e}function x(e,t){for(var n=e.length-1;n>=0;n--)e[n]===t&&e.splice(n,1)}function I(e,t){return Math.abs(e.i-t.i)+Math.abs(e.j-t.j)}function J(){y(!1),setTimeout((function(){var e=S();a(e),g([]),h([].concat([e[0][0]])),y(!0)}),1e3)}function L(e){var t=[],n=e;for(t.push(n);n.previous;)t.push(n.previous),n=n.previous;return t}return function(e,t){var n=Object(r.useRef)();Object(r.useEffect)((function(){n.current=e}),[e]),Object(r.useEffect)((function(){if(null!==t){var e=Object(W.setInterval)((function(){n.current()}),t);return function(){return Object(W.clearInterval)(e)}}}),[t])}((function(){return function(){if(!(n&&f.length>0))return void J();!function(){var e=Object(i.a)(f),t=Object(i.a)(p),r=n[A-1][B-1],c=function(){var e=0;return f.forEach((function(t,n){t.f<f[e].f&&(e=n)})),e}(),a=e[c];if(o=a,u=r,o.i===u.i&&o.j===u.j)return void function(e,t,n){x(e,n),h(e),g([].concat(Object(i.a)(t),[n])),w(L(n)),J()}(e,t,a);var o,u;x(e,a),t.push(a),function(e,t,n,r){n.neighbors.forEach((function(c){if(!t.includes(c)&&!c.wall){var a=n.g+I(c,n),o=!1;e.includes(c)?a<c.g&&(c.g=a,o=!0):(c.g=a,o=!0,e.push(c)),o&&(c.h=I(c,r),c.f=c.g+c.h,c.previous=n)}}))}(e,t,a,r),h(e),g(t),w(L(a))}()}()}),O?100:null),c.a.createElement(M,{grid:n,openSet:f,closedSet:p,path:m})},J=function(){return c.a.createElement("div",null,c.a.createElement("h2",null,"A* Pathfinding Algorithm"),c.a.createElement(I,null))};o.a.render(c.a.createElement(J,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},9:function(e,t,n){e.exports=n(17)}},[[9,1,2]]]);
//# sourceMappingURL=main.500c74d8.chunk.js.map