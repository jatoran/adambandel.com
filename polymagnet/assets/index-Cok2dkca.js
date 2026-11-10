(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Kc=25.4,tt=.75*Kc,Tt=.125*Kc,Qs=14,Ne=2*tt/Qs,Fa=Ne*.43,re=.15,gi=.85,Vt={background:658707,north:15099751,south:3770341,unwritten:2831168,nickel:12831187,film:1185568,steel:9279398,force:15905076,field:12572927,scan:14676479,copper:13208139,dark:2304565,glass:10470632,good:828172,warning:16429593},Wt={north:"#e66767",south:"#3987e5",unwritten:"#2b3340",seriesPoly:"#199e70",seriesConv:"#898781",inkSecondary:"#c3c2b7",inkMuted:"#898781",grid:"#262b35",axis:"#3a404c",surface:"#10141c"};function _i(i,t,e){return i<t?t:i>e?e:i}function xi(i){return _i(i,0,1)}function ht(i,t,e){return i+(t-i)*e}function ve(i,t,e){return xi((i-t)/(e-t))}function Vf(i){const t=xi(i);return t*t*(3-2*t)}function Vn(i){const t=xi(i);return t*t*t}function Nd(i){const t=1-xi(i);return 1-t*t*t}function X(i,t,e,n=Vf){return n(ve(i,t,e))}function ye(i,t,e,n,s){return Math.min(X(i,t,e),1-X(i,n,s))}function Wf(i,t,e){return i<=0?1:Math.exp(-2.7*i)*Math.cos(2*Math.PI*t*i)}function Ea(i,t,e){const n=(i-t)/e;return n<=0?0:n>=1.6?1:1-Math.exp(-5.5*n)*Math.cos(9*n)}const Th=[1,1,1,-1,-1,1,-1],Fd=[1,1,1,1,1,-1,-1,1,1,-1,1,-1,1];function qn(i,t){const e=new Int8Array(i.count);for(let n=0;n<i.count;n++)e[n]=Math.sign(t(i.x[n],i.z[n],n));return e}function Zc(i,t){const e=Math.atan2(t,i);return e<0?e+2*Math.PI:e}function Xf(i){return new Int8Array(i.count)}function qf(i){return qn(i,()=>1)}function rn(i){return i.map(t=>-t)}const Yf=2;function $f(i){const t=Yf*Ne;return qn(i,(e,n)=>Math.floor(Math.hypot(e,n)/t)%2===0?1:-1)}function Kf(i){return qn(i,(t,e,n)=>{const s=Math.floor(i.col[n]/2),r=Math.floor(i.row[n]/2);return Th[s]*Th[r]})}const jl=Fd.length;function Zf(i){const t=1.2*Ne,e=2*Math.PI/jl;return qn(i,(n,s)=>Math.hypot(n,s)<t?0:Fd[Math.floor(Zc(n,s)/e)%jl])}const Od=4.6*Ne,Jf=2;function Bd(i){return qn(i,(t,e,n)=>Math.hypot(t,e)<Od||Math.floor(i.col[n]/Jf)%2===0?1:-1)}function jf(i){const t=Bd(i);return qn(i,(e,n,s)=>Math.hypot(e,n)<Od?-t[s]:t[s])}const zd=8,Qf=2*Ne,tp=4.6*Ne;function ep(i){const t=2*Math.PI/zd;return qn(i,(e,n)=>{const s=Math.hypot(e,n);if(s<Qf)return 0;const r=Math.floor(Zc(e,n)/t),o=s<tp?1:0;return(r+o)%2===0?1:-1})}function kd(i,t,e=0,n=tt){const s=2*Math.PI/t;return qn(i,(r,o)=>{const a=Math.hypot(r,o);if(a<e||a>n)return 0;const l=Zc(r,o),c=l%s;return Math.min(c,s-c)*a<.2*Ne?0:Math.floor(l/s)%2===0?1:-1})}function Ah(i,t,e){return qn(i,(n,s,r)=>t[Math.floor(i.col[r]/2)]*e[Math.floor(i.row[r]/2)])}function np(i){return[Ah(i,[1,-1,-1,1,-1,1,1],[-1,1,1,-1,1,-1,-1]),Ah(i,[1,-1,1,-1,1,-1,1],[1,-1,1,-1,1,-1,1])]}function ip(i,t=1){return qn(i,(e,n,s)=>Math.floor(i.col[s]/t)%2===0?1:-1)}function sp(i){return qn(i,t=>t<0?1:-1)}function rp(i,t,e,n=Ne/2){if(Math.hypot(i,t)>tt)return 0;const s=i*Math.cos(e)-t*Math.sin(e);return Math.max(-1,Math.min(1,-s/(n/2)))}const sn={fixed:1.6,dial:3.2};function Me(i,t){const{x:e,y:n}=i,s=e.length-1;if(t<=e[0])return n[0];if(t>=e[s])return n[s];let r=0,o=s;for(;o-r>1;){const l=r+o>>1;e[l]<=t?r=l:o=l}const a=(t-e[r])/(e[o]-e[r]);return n[r]+(n[o]-n[r])*a}function kn(i,t,e=1){return{x:Float32Array.from(i),y:Float32Array.from(t,n=>n*e)}}function Fi(i,t,e){return Array.from({length:e},(n,s)=>i+(t-i)*s/(e-1))}function Ql(i,t,e){return Array.from({length:e},(n,s)=>i+(t-i)*(s/(e-1))**2)}const jn=5,Kr=Ne/jn,ba=.55*Kr,wa=1.7*Ne,qa=ba*ba,op=wa*wa,ap=1/(jn*jn),Rh=-2*Kr;class Jc{constructor(t){this.capacity=t,this.data=new Float32Array(t*4)}data;count=0;clear(){this.count=0}push(t,e,n,s){if(this.count>=this.capacity)throw new Error(`ChargeSet capacity ${this.capacity} exceeded`);const r=this.count*4;this.data[r]=t,this.data[r+1]=e,this.data[r+2]=n,this.data[r+3]=s,this.count++}addMagnet(t,e,n,s,r,o,a,l=Tt,c=1){const u=Math.cos(o),h=Math.sin(o);for(let d=0;d<t.count;d++){const f=e[d]*c;if(f===0)continue;const g=t.x[d],_=t.z[d],m=n+g*u+_*h,p=r-g*h+_*u;this.push(m,s,p,f),this.push(m,s+a*l,p,-f)}}addImages(t){const e=this.count;for(let n=0;n<e;n++){const s=n*4;this.push(this.data[s],2*t-this.data[s+1],this.data[s+2],-this.data[s+3])}}}const lp=new Float64Array(3);function or(i,t,e,n,s=lp){const r=i.data;let o=0,a=0,l=0;for(let c=0,u=i.count*4;c<u;c+=4){const h=t-r[c],d=e-r[c+1],f=n-r[c+2],g=r[c+3],_=h*h+d*d+f*f;if(_>op){const S=g/((_+qa)*Math.sqrt(_+qa));o+=h*S,a+=d*S,l+=f*S;continue}const m=g*ap,p=d*d+qa;for(let S=0;S<jn;S++){const x=h-(Rh+S*Kr),v=x*x+p;for(let w=0;w<jn;w++){const A=f-(Rh+w*Kr),C=v+A*A,I=m/(C*Math.sqrt(C));o+=x*I,a+=d*I,l+=A*I}}}return s[0]=o,s[1]=a,s[2]=l,Math.sqrt(o*o+a*a+l*l)}const fi=3;function Ya(i,t,e){let n=Number.POSITIVE_INFINITY;for(const s of i){const r=Math.max(s.x0-t,0,t-s.x1),o=Math.max(s.y0-e,0,e-s.y1);n=Math.min(n,Math.hypot(r,o))}return n}const Yn=new Float64Array(3);function cp(i,t,e,n,s,r){const[o,a,l,c]=n.bounds,u=n.slabMargin;let h=t,d=e,f=0,g=0;const _=(m,p,S)=>{s[g*fi]=m,s[g*fi+1]=p,s[g*fi+2]=S,g++};for(;g<r;){const m=Math.log10(or(i,h,d,n.z,Yn)+1e-12),p=Math.hypot(Yn[0],Yn[1]);if(_(h,d,m),p<n.minField||f>n.maxLength||g>=r)break;const S=Ya(n.slabs,h,d)-u,x=Math.min(.35+.04*f,1.8,Math.max(.12,.6*S)),v=h+Yn[0]/p*x/2,w=d+Yn[1]/p*x/2;if(Ya(n.slabs,v,w)<=u){_(v,w,m);break}or(i,v,w,n.z,Yn);const A=Math.hypot(Yn[0],Yn[1]);if(A<n.minField||(h+=Yn[0]/A*x,d+=Yn[1]/A*x,f+=x,h<o||h>l||d<a||d>c))break;if(Ya(n.slabs,h,d)<=u){_(h,d,m);break}}return g}const Rt=128,yi=Ne/2,wn=Rt/2,Ch=wn-Qs,Zr=2*Math.PI,Hd=new Float64Array(wn),Gd=new Float64Array(wn),Vd=new Uint16Array(Rt);{const i=Math.log2(Rt);for(let t=0;t<wn;t++)Hd[t]=Math.cos(Zr*t/Rt),Gd[t]=Math.sin(Zr*t/Rt);for(let t=0;t<Rt;t++){let e=0;for(let n=0;n<i;n++)t&1<<n&&(e|=1<<i-1-n);Vd[t]=e}}function Ph(i,t,e){for(let s=0;s<Rt;s++){const r=Vd[s];if(r>s){const o=i[s];i[s]=i[r],i[r]=o;const a=t[s];t[s]=t[r],t[r]=a}}const n=e?1:-1;for(let s=2;s<=Rt;s<<=1){const r=s>>1,o=Rt/s;for(let a=0;a<Rt;a+=s)for(let l=0;l<r;l++){const c=Hd[l*o],u=n*Gd[l*o],h=a+l,d=h+r,f=i[d]*c-t[d]*u,g=i[d]*u+t[d]*c;i[d]=i[h]-f,t[d]=t[h]-g,i[h]+=f,t[h]+=g}}}const Es=new Float64Array(Rt),bs=new Float64Array(Rt);function da(i,t,e){for(let n=0;n<Rt;n++){const s=n*Rt;for(let r=0;r<Rt;r++)Es[r]=i[s+r],bs[r]=t[s+r];Ph(Es,bs,e);for(let r=0;r<Rt;r++)i[s+r]=Es[r],t[s+r]=bs[r]}for(let n=0;n<Rt;n++){for(let s=0;s<Rt;s++)Es[s]=i[s*Rt+n],bs[s]=t[s*Rt+n];Ph(Es,bs,e);for(let s=0;s<Rt;s++)i[s*Rt+n]=Es[s],t[s*Rt+n]=bs[s]}if(e){const n=1/(Rt*Rt);for(let s=0;s<i.length;s++)i[s]*=n,t[s]*=n}}function Lh(i){return(i+.5-wn)*yi}function pi(i,t){const e=new Float32Array(Rt*Rt);for(let n=0;n<i.count;n++){const s=t[n]*gi;if(s===0)continue;const r=Ch+2*i.col[n],o=Ch+2*i.row[n];e[o*Rt+r]=s,e[o*Rt+r+1]=s,e[(o+1)*Rt+r]=s,e[(o+1)*Rt+r+1]=s}return e}function Ih(i){const t=new Float32Array(Rt*Rt),e=Math.ceil(tt/yi)+1;for(let n=wn-e;n<wn+e;n++){const s=Lh(n);for(let r=wn-e;r<wn+e;r++){const o=Lh(r);Math.hypot(o,s)<=tt&&(t[n*Rt+r]=i(o,s))}}return t}function zn(i){const t=Float64Array.from(i),e=new Float64Array(Rt*Rt);return da(t,e,!1),{re:t,im:e}}const Hi=new Float64Array(Rt),tc=new Float64Array(Rt);for(let i=0;i<Rt;i++){const t=i<wn?i:i-Rt;Hi[i]=Zr*t/(Rt*yi),tc[i]=i===wn?0:Hi[i]}const Wd=Zr*yi*yi/(Rt*Rt);function jc(i,t){return 1-Math.exp(-i*t)}function Qc(i,t,e,n=Tt){const s=Rt*Rt,r=new Float64Array(s),o=new Float64Array(s);for(let l=0;l<Rt;l++)for(let c=0;c<Rt;c++){const u=l*Rt+c,h=Math.hypot(Hi[c],Hi[l]),d=jc(h,n);o[u]=h,r[u]=(i.re[u]*t.re[u]+i.im[u]*t.im[u])*d*d}const a=new Float64Array(e.length);for(let l=0;l<e.length;l++){const c=e[l];let u=0;for(let h=0;h<s;h++){const d=r[h];d!==0&&(u+=d*Math.exp(-o[h]*c))}a[l]=-Wd*u}return a}function Dh(i,t,e=Tt){const n={re:i.re.map(r=>-r),im:i.im.map(r=>-r)},s=Float64Array.from(t,r=>2*r);return Qc(i,n,s,e)}function hp(i,t){let e=0;for(let n=0;n<Rt;n++)for(let s=0;s<Rt;s++){const r=n*Rt+s,o=Math.hypot(Hi[s],Hi[n]);if(o===0)continue;let a=0,l=0,c=0;for(const u of i){const h=Math.exp(-o*c)*jc(o,u.thickness);a+=u.spectrum.re[r]*h,l+=u.spectrum.im[r]*h,c+=u.thickness}e+=(a*a+l*l)*Math.exp(-2*o*t)}return Wd*e}function Wr(i,t,e=Tt){const n=Rt*Rt,s=new Float64Array(n),r=new Float64Array(n),o=new Float64Array(n),a=new Float64Array(n),l=new Float64Array(n),c=new Float64Array(n);for(let u=0;u<Rt;u++)for(let h=0;h<Rt;h++){const d=u*Rt+h,f=Math.hypot(Hi[h],Hi[u]);if(f===0)continue;const g=jc(f,e),_=Zr*Math.exp(-f*t)*g*g,m=i.re[d]*_,p=i.im[d]*_;s[d]=m,r[d]=p;const S=tc[h]/f,x=tc[u]/f;o[d]=S*p,a[d]=-S*m,l[d]=x*p,c[d]=-x*m}return da(s,r,!0),da(o,a,!0),da(l,c,!0),{dx:Float32Array.from(o),dy:Float32Array.from(s),dz:Float32Array.from(l)}}function ao(i){return(i%Rt+Rt)%Rt}function $a(i,t,e){const n=t/yi+wn-.5,s=e/yi+wn-.5,r=Math.floor(n),o=Math.floor(s),a=n-r,l=s-o,c=ao(r),u=ao(r+1),h=ao(o)*Rt,d=ao(o+1)*Rt;return i[h+c]*(1-a)*(1-l)+i[h+u]*a*(1-l)+i[d+c]*(1-a)*l+i[d+u]*a*l}const Si=Ne/4,up=[[-Si,-Si],[Si,-Si],[-Si,Si],[Si,Si]];function Hn(i,t,e,n,s,r){const o=Math.cos(r),a=Math.sin(r),l=yi*yi;let c=0,u=0,h=0,d=0;for(let f=0;f<t.count;f++){const g=e[f]*gi;if(g!==0)for(const[_,m]of up){const p=t.x[f]+_,S=t.z[f]+m,x=p*o+S*a,v=-p*a+S*o,w=x+n,A=v+s,C=g*$a(i.dx,w,A),I=g*$a(i.dy,w,A),b=g*$a(i.dz,w,A);c+=C,u+=I,h+=b,d+=v*C-x*b}}return{fx:c*l,fz:h*l,attract:-u*l,torque:d*l}}const fa=Math.PI/180,Bn=.6*Kc,Uh=4,dp=2.2*Ne,Xs=.26*2*tt,ws={light:.03,heavy:.3},fp=.22;function lo(i,t=fp){const e=2*t*i,n=1-i*i,s=Math.sqrt((1+e*e)/(n*n+e*e)),r=Math.atan2(e,n)-Math.atan2(e,1);return{gain:s,lag:r}}const pp=3.2*Ne,kr=5*Ne,co={coarse:{poles:4,height:4.5},fine:{poles:8,height:3.2}},Er=.5;function Nh(i,t,e){const n=kd(i,t,pp),s=t/2,r=Math.round(360/Er),o=new Float64Array(r),a=new Jc(2*i.count),l=new Float64Array(3);for(let v=0;v<r;v++)a.clear(),a.addMagnet(i,n,0,0,0,v*Er*fa,-1,Tt,gi),or(a,kr,e,0,l),o[v]=l[1];let c=0,u=0;for(let v=0;v<r;v++){const w=2*Math.PI*s*v/r;c+=o[v]*Math.cos(w),u+=o[v]*Math.sin(w)}const h=2*Math.hypot(c,u)/r,d=Math.atan2(u,c),f=90/s,g=Math.round(f/Er),_=[],m=[],p=[],S=[];let x=0;for(let v=0;v<=r;v++){const w=o[v%r]/h,A=o[(v-g+r)%r]/h,C=s*v*Er*fa;let I=Math.atan2(A,w)+d-C;I-=2*Math.PI*Math.round(I/(2*Math.PI));const b=I/fa/s;_.push(v*Er),m.push(w),p.push(A),S.push(b),x=Math.max(x,Math.abs(b))}return{pattern:n,pairs:s,height:e,quarterDeg:f,a:kn(_,m),b:kn(_,p),error:kn(_,S),maxErrorDeg:x}}const Zn={poleSaturation:2.4,ndfeb:1.15,ferrite:.38},Ka=7.5;function Za(i,t){const e=i*t/Zn.poleSaturation;return(Zn.poleSaturation*e/(1+e**4)**.25/Zn.ndfeb)**2}const mp=.9/4;function Ja(i){return mp*i}function gp(i,t,e){const n=kd(i,Uh,dp),s=zn(pi(i,n)),r=rn(n),o=Ql(re,34,110),a=Qc(s,zn(pi(i,r)),o,Bn),l=Wr(s,re,Bn),c=Hn(l,i,r,0,0,0).attract,u=Fi(-90,90,181),h=u.map(k=>Hn(l,i,r,0,0,k*fa).attract),d=kn(o,a,1/a[0]),f=np(i),g=Wr(zn(pi(i,rn(t))),re),_=Hn(g,i,t,0,0,0).attract,m=Fi(-16,16,129),p=[f[0],f[1],t],S=p.map(k=>kn(m,m.map(Y=>Hn(g,i,k,Y,0,0).attract),1/_)),x=p.map(k=>Hn(g,i,k,0,0,0).attract/_),v=k=>{let Y=e.x[e.x.length-1];for(let O=1;O<e.x.length;O++)if(e.y[O-1]>0&&e.y[O]<=0){Y=e.x[O];break}for(;Y>.2&&Me(e,Y)<k;)Y-=.002;return Y},w=k=>(Me(e,k-.05)-Me(e,k+.05))/.1,A=v(ws.light),C=v(ws.heavy),I=(k,Y)=>Math.sqrt(w(k)/Y),b=I(C,ws.heavy)/I(A,ws.light),M=Fi(1,9,81),L=(Zn.poleSaturation/Zn.ndfeb)**2,z=Za(Zn.ferrite,Ka),F=Fi(0,40,41),V=2*tt,q=Ne;return{patterns:{coupler:n,decoys:f,fineStripes:ip(i,1)},coupler:{pull:d,hold:kn(u,h,1/c),releaseAngleDeg:180/Uh,pullAtCapture:Me(d,Xs)},keyed:{hold:S,seated:x},isolation:{gap:{light:A,heavy:C},heavyResonance:b,fixedSpringResonance:Math.sqrt(ws.light/ws.heavy)},encoder:{coarse:Nh(i,co.coarse.poles,co.coarse.height),fine:Nh(i,co.fine.poles,co.fine.height)},concentration:{ndfeb:kn(M,M.map(k=>Za(Zn.ndfeb,k))),ferrite:kn(M,M.map(k=>Za(Zn.ferrite,k))),plateau:L,ferriteBare:(Zn.ferrite/Zn.ndfeb)**2,design:{ratio:Ka,density:z,emitArea:1/z,collectArea:Ka/z}},iron:{thickness:kn(F,F.map(Ja)),conventional:{poleWidth:V,thickness:Ja(V)},written:{poleWidth:q,thickness:Ja(q)},ratio:q/V}}}const _p=.35*Ne;function vp(){const i=[],t=[],e=[],n=[],s=tt-_p;for(let l=0;l<Qs;l++)for(let c=0;c<Qs;c++){const u=(c+.5-Qs/2)*Ne,h=(l+.5-Qs/2)*Ne;Math.hypot(u,h)<=s&&(i.push(u),t.push(h),e.push(c),n.push(l))}const r=i.length,o=Array.from({length:r},(l,c)=>c);o.sort((l,c)=>n[l]!==n[c]?n[l]-n[c]:n[l]%2===0?e[l]-e[c]:e[c]-e[l]);const a=new Int16Array(r);return o.forEach((l,c)=>{a[l]=c}),{count:r,x:Float32Array.from(i),z:Float32Array.from(t),col:Int16Array.from(e),row:Int16Array.from(n),printOrder:Int16Array.from(o),rank:a}}const ho=Math.PI/180,Ta=[.8660254,.5],qs=2.6,pa=.6,qi=kn;function Fh(){return typeof performance<"u"?performance.now():Date.now()}function xp(){const i={},t=(h,d)=>{const f=Fh(),g=d();return i[h]=Math.round((Fh()-f)*10)/10,g},e=vp(),n={blank:Xf(e),uniform:qf(e),attach:$f(e),align:Kf(e),latch:Zf(e),springBase:Bd(e),springMate:jf(e),torque:ep(e),switchLayer:sp(e)},s=t("attach",()=>{const h=Ql(re,8,72),d=Dh(zn(Ih(()=>1)),h),f=Dh(zn(pi(e,n.attach)),h),g=1/d[0];return{conventional:qi(h,d,g),polymagnet:qi(h,f,g),ratioAtContact:f[0]/d[0]}}),r=t("align",()=>{const h=Wr(zn(pi(e,n.align)),re),d=rn(n.align),f=Fi(-18,18,145),g=f.map(p=>Hn(h,e,d,p*Ta[0],p*Ta[1],0).attract),_=Hn(h,e,d,0,0,0).attract;let m=0;return f.forEach((p,S)=>{Math.abs(p)>4&&(m=Math.max(m,g[S]/_))}),{hold:qi(f,g,1/_),sidelobe:m}}),o=t("latch",()=>{const h=Wr(zn(pi(e,n.latch)),re),d=rn(n.latch),f=Fi(-70,70,141),g=f.map(S=>Hn(h,e,d,0,0,S*ho).attract),_=Hn(h,e,d,0,0,0).attract,m=360/jl,p=Hn(h,e,d,0,0,m*ho).attract/_;return{hold:qi(f,g,1/_),releaseAngleDeg:m,holdAtRelease:p}}),a=t("spring",()=>{const h=Ql(re,16,96),d=Qc(zn(pi(e,n.springBase)),zn(pi(e,n.springMate)),h),f=Array.from(d,p=>-p),g=1/Math.abs(f[0]);let _=Number.NaN;for(let p=1;p<h.length;p++)if(f[p-1]>0&&f[p]<=0){const S=f[p-1]/(f[p-1]-f[p]);_=h[p-1]+(h[p]-h[p-1])*S;break}const m=Math.max(0,...f.map(p=>-p*g));return{net:qi(h,f,g),equilibriumGap:_,maxAttract:m}}),l=t("torque",()=>{const h=Wr(zn(pi(e,n.torque)),qs),d=rn(n.torque),f=360/(zd/2),g=Fi(-f,f,181),_=g.map(S=>Hn(h,e,d,0,0,-S*ho).torque);let m=0,p=0;return g.forEach((S,x)=>{S>0&&S<f/2&&_[x]>m&&(m=_[x],p=S)}),{coupling:qi(g,_,1/m),pullOutAngleDeg:p,periodDeg:f}}),c=t("switch",()=>{const h=Fi(0,180,37),d=p=>zn(Ih((S,x)=>rp(S,x,p))),f=d(0),{fixed:g,dial:_}=sn,m=h.map(p=>hp([{spectrum:f,thickness:g},{spectrum:d(p*ho),thickness:_},{spectrum:f,thickness:g}],pa));return{hold:qi(h,m,1/m[0]),offFraction:m[m.length-1]/m[0]}}),u=t("applications",()=>gp(e,n.align,a.net));return{lattice:e,patterns:n,attach:s,align:r,latch:o,spring:a,torque:l,switching:c,applications:u,timingsMs:i}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const th="171",yp=0,Oh=1,Mp=2,Xd=1,Sp=2,hi=3,Gi=0,on=1,Qe=2,Bi=0,ir=1,Aa=2,Bh=3,zh=4,Ep=5,ds=100,bp=101,wp=102,Tp=103,Ap=104,Rp=200,Cp=201,Pp=202,Lp=203,ec=204,nc=205,Ip=206,Dp=207,Up=208,Np=209,Fp=210,Op=211,Bp=212,zp=213,kp=214,ic=0,sc=1,rc=2,ar=3,oc=4,ac=5,lc=6,cc=7,qd=0,Hp=1,Gp=2,zi=0,Vp=1,Wp=2,Xp=3,Yd=4,qp=5,Yp=6,$p=7,$d=300,lr=301,cr=302,hc=303,uc=304,Oa=306,dc=1e3,ps=1001,fc=1002,an=1003,Kp=1004,uo=1005,fn=1006,ja=1007,ms=1008,Qn=1009,Kd=1010,Zd=1011,Jr=1012,eh=1013,gs=1014,Wn=1015,mr=1016,nh=1017,ih=1018,hr=1020,Jd=35902,jd=1021,Qd=1022,Tn=1023,tf=1024,ef=1025,sr=1026,ur=1027,sh=1028,rh=1029,nf=1030,oh=1031,ah=1033,ma=33776,ga=33777,_a=33778,va=33779,pc=35840,mc=35841,gc=35842,_c=35843,vc=36196,xc=37492,yc=37496,Mc=37808,Sc=37809,Ec=37810,bc=37811,wc=37812,Tc=37813,Ac=37814,Rc=37815,Cc=37816,Pc=37817,Lc=37818,Ic=37819,Dc=37820,Uc=37821,xa=36492,Nc=36494,Fc=36495,sf=36283,Oc=36284,Bc=36285,zc=36286,Zp=3200,Jp=3201,rf=0,jp=1,Ni="",En="srgb",dr="srgb-linear",Ra="linear",pe="srgb",Ts=7680,kh=519,Qp=512,tm=513,em=514,of=515,nm=516,im=517,sm=518,rm=519,Hh=35044,Gh="300 es",mi=2e3,Ca=2001;class gr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const $e=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Qa=Math.PI/180,kc=180/Math.PI;function _r(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return($e[i&255]+$e[i>>8&255]+$e[i>>16&255]+$e[i>>24&255]+"-"+$e[t&255]+$e[t>>8&255]+"-"+$e[t>>16&15|64]+$e[t>>24&255]+"-"+$e[e&63|128]+$e[e>>8&255]+"-"+$e[e>>16&255]+$e[e>>24&255]+$e[n&255]+$e[n>>8&255]+$e[n>>16&255]+$e[n>>24&255]).toLowerCase()}function Zt(i,t,e){return Math.max(t,Math.min(e,i))}function om(i,t){return(i%t+t)%t}function tl(i,t,e){return(1-e)*i+e*t}function br(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function hn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class lt{constructor(t=0,e=0){lt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yt{constructor(t,e,n,s,r,o,a,l,c){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],S=s[1],x=s[4],v=s[7],w=s[2],A=s[5],C=s[8];return r[0]=o*_+a*S+l*w,r[3]=o*m+a*x+l*A,r[6]=o*p+a*v+l*C,r[1]=c*_+u*S+h*w,r[4]=c*m+u*x+h*A,r[7]=c*p+u*v+h*C,r[2]=d*_+f*S+g*w,r[5]=d*m+f*x+g*A,r[8]=d*p+f*v+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,d=a*l-u*r,f=c*r-o*l,g=e*h+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=h*_,t[1]=(s*c-u*n)*_,t[2]=(a*n-s*o)*_,t[3]=d*_,t[4]=(u*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(el.makeScale(t,e)),this}rotate(t){return this.premultiply(el.makeRotation(-t)),this}translate(t,e){return this.premultiply(el.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const el=new Yt;function af(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Pa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function am(){const i=Pa("canvas");return i.style.display="block",i}const Vh={};function Ys(i){i in Vh||(Vh[i]=!0,console.warn(i))}function lm(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function cm(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function hm(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Wh=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xh=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function um(){const i={enabled:!0,workingColorSpace:dr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===pe&&(s.r=vi(s.r),s.g=vi(s.g),s.b=vi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===pe&&(s.r=rr(s.r),s.g=rr(s.g),s.b=rr(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ni?Ra:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[dr]:{primaries:t,whitePoint:n,transfer:Ra,toXYZ:Wh,fromXYZ:Xh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:En},outputColorSpaceConfig:{drawingBufferColorSpace:En}},[En]:{primaries:t,whitePoint:n,transfer:pe,toXYZ:Wh,fromXYZ:Xh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:En}}}),i}const se=um();function vi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function rr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let As;class dm{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{As===void 0&&(As=Pa("canvas")),As.width=t.width,As.height=t.height;const n=As.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=As}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Pa("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=vi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(vi(e[n]/255)*255):e[n]=vi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let fm=0;class lf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=_r(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(nl(s[o].image)):r.push(nl(s[o]))}else r=nl(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function nl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?dm.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let pm=0;class ln extends gr{constructor(t=ln.DEFAULT_IMAGE,e=ln.DEFAULT_MAPPING,n=ps,s=ps,r=fn,o=ms,a=Tn,l=Qn,c=ln.DEFAULT_ANISOTROPY,u=Ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pm++}),this.uuid=_r(),this.name="",this.source=new lf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new lt(0,0),this.repeat=new lt(1,1),this.center=new lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==$d)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case dc:t.x=t.x-Math.floor(t.x);break;case ps:t.x=t.x<0?0:1;break;case fc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case dc:t.y=t.y-Math.floor(t.y);break;case ps:t.y=t.y<0?0:1;break;case fc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=$d;ln.DEFAULT_ANISOTROPY=1;class he{constructor(t=0,e=0,n=0,s=1){he.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,v=(f+1)/2,w=(p+1)/2,A=(u+d)/4,C=(h+_)/4,I=(g+m)/4;return x>v&&x>w?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=A/n,r=C/n):v>w?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=A/s,r=I/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=C/r,s=I/r),this.set(n,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(h-_)/S,this.z=(d-u)/S,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this.w=Zt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this.w=Zt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class mm extends gr{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new he(0,0,t,e),this.scissorTest=!1,this.viewport=new he(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new ln(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new lf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Vi extends mm{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class cf extends ln{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=an,this.minFilter=an,this.wrapR=ps,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class gm extends ln{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=an,this.minFilter=an,this.wrapR=ps,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class no{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(h!==_||l!==d||c!==f||u!==g){let m=1-a;const p=l*d+c*f+u*g+h*_,S=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),A=Math.atan2(w,p*S);m=Math.sin(m*A)/w,a=Math.sin(a*A)/w}const v=a*S;if(l=l*m+d*v,c=c*m+f*v,u=u*m+g*v,h=h*m+_*v,m===1-a){const w=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=w,c*=w,u*=w,h*=w}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+u*h+l*f-c*d,t[e+1]=l*g+u*d+c*h-a*f,t[e+2]=c*g+u*f+a*d-l*h,t[e+3]=u*g-a*h-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>h){const f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-n-h);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Zt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(t=0,e=0,n=0){P.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(qh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(qh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),u=2*(a*e-r*s),h=2*(r*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return il.copy(this).projectOnVector(t),this.sub(il)}reflect(t){return this.sub(il.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const il=new P,qh=new no;class Ms{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Un):Un.fromBufferAttribute(r,o),Un.applyMatrix4(t.matrixWorld),this.expandByPoint(Un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),fo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fo.copy(n.boundingBox)),fo.applyMatrix4(t.matrixWorld),this.union(fo)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Un),Un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(wr),po.subVectors(this.max,wr),Rs.subVectors(t.a,wr),Cs.subVectors(t.b,wr),Ps.subVectors(t.c,wr),Ei.subVectors(Cs,Rs),bi.subVectors(Ps,Cs),Yi.subVectors(Rs,Ps);let e=[0,-Ei.z,Ei.y,0,-bi.z,bi.y,0,-Yi.z,Yi.y,Ei.z,0,-Ei.x,bi.z,0,-bi.x,Yi.z,0,-Yi.x,-Ei.y,Ei.x,0,-bi.y,bi.x,0,-Yi.y,Yi.x,0];return!sl(e,Rs,Cs,Ps,po)||(e=[1,0,0,0,1,0,0,0,1],!sl(e,Rs,Cs,Ps,po))?!1:(mo.crossVectors(Ei,bi),e=[mo.x,mo.y,mo.z],sl(e,Rs,Cs,Ps,po))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(si),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const si=[new P,new P,new P,new P,new P,new P,new P,new P],Un=new P,fo=new Ms,Rs=new P,Cs=new P,Ps=new P,Ei=new P,bi=new P,Yi=new P,wr=new P,po=new P,mo=new P,$i=new P;function sl(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){$i.fromArray(i,r);const a=s.x*Math.abs($i.x)+s.y*Math.abs($i.y)+s.z*Math.abs($i.z),l=t.dot($i),c=e.dot($i),u=n.dot($i);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const _m=new Ms,Tr=new P,rl=new P;class vr{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):_m.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Tr.subVectors(t,this.center);const e=Tr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Tr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(rl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Tr.copy(t.center).add(rl)),this.expandByPoint(Tr.copy(t.center).sub(rl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ri=new P,ol=new P,go=new P,wi=new P,al=new P,_o=new P,ll=new P;class vm{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ri)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ri.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ri.copy(this.origin).addScaledVector(this.direction,e),ri.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ol.copy(t).add(e).multiplyScalar(.5),go.copy(e).sub(t).normalize(),wi.copy(this.origin).sub(ol);const r=t.distanceTo(e)*.5,o=-this.direction.dot(go),a=wi.dot(this.direction),l=-wi.dot(go),c=wi.lengthSq(),u=Math.abs(1-o*o);let h,d,f,g;if(u>0)if(h=o*l-a,d=o*a-l,g=r*u,h>=0)if(d>=-g)if(d<=g){const _=1/u;h*=_,d*=_,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(ol).addScaledVector(go,d),f}intersectSphere(t,e){ri.subVectors(t.center,this.origin);const n=ri.dot(this.direction),s=ri.dot(ri)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,ri)!==null}intersectTriangle(t,e,n,s,r){al.subVectors(e,t),_o.subVectors(n,t),ll.crossVectors(al,_o);let o=this.direction.dot(ll),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;wi.subVectors(this.origin,t);const l=a*this.direction.dot(_o.crossVectors(wi,_o));if(l<0)return null;const c=a*this.direction.dot(al.cross(wi));if(c<0||l+c>o)return null;const u=-a*wi.dot(ll);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class fe{constructor(t,e,n,s,r,o,a,l,c,u,h,d,f,g,_,m){fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,u,h,d,f,g,_,m)}set(t,e,n,s,r,o,a,l,c,u,h,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ls.setFromMatrixColumn(t,0).length(),r=1/Ls.setFromMatrixColumn(t,1).length(),o=1/Ls.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=o*u,f=o*h,g=a*u,_=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-a*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*u,f=l*h,g=c*u,_=c*h;e[0]=d+_*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=f*a-g,e[6]=_+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*u,f=l*h,g=c*u,_=c*h;e[0]=d-_*a,e[4]=-o*h,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*u,e[9]=_-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*u,f=o*h,g=a*u,_=a*h;e[0]=l*u,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*h,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*u,e[4]=_-d*h,e[8]=g*h+f,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*h+g,e[10]=d-_*h}else if(t.order==="XZY"){const d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+_,e[5]=o*u,e[9]=f*h-g,e[2]=g*h-f,e[6]=a*u,e[10]=_*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(xm,t,ym)}lookAt(t,e,n){const s=this.elements;return vn.subVectors(t,e),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),Ti.crossVectors(n,vn),Ti.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),Ti.crossVectors(n,vn)),Ti.normalize(),vo.crossVectors(vn,Ti),s[0]=Ti.x,s[4]=vo.x,s[8]=vn.x,s[1]=Ti.y,s[5]=vo.y,s[9]=vn.y,s[2]=Ti.z,s[6]=vo.z,s[10]=vn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],S=n[3],x=n[7],v=n[11],w=n[15],A=s[0],C=s[4],I=s[8],b=s[12],M=s[1],L=s[5],z=s[9],F=s[13],V=s[2],q=s[6],k=s[10],Y=s[14],O=s[3],ot=s[7],xt=s[11],wt=s[15];return r[0]=o*A+a*M+l*V+c*O,r[4]=o*C+a*L+l*q+c*ot,r[8]=o*I+a*z+l*k+c*xt,r[12]=o*b+a*F+l*Y+c*wt,r[1]=u*A+h*M+d*V+f*O,r[5]=u*C+h*L+d*q+f*ot,r[9]=u*I+h*z+d*k+f*xt,r[13]=u*b+h*F+d*Y+f*wt,r[2]=g*A+_*M+m*V+p*O,r[6]=g*C+_*L+m*q+p*ot,r[10]=g*I+_*z+m*k+p*xt,r[14]=g*b+_*F+m*Y+p*wt,r[3]=S*A+x*M+v*V+w*O,r[7]=S*C+x*L+v*q+w*ot,r[11]=S*I+x*z+v*k+w*xt,r[15]=S*b+x*F+v*Y+w*wt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*h-s*c*h-r*a*d+n*c*d+s*a*f-n*l*f)+_*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*u-r*l*u)+m*(+e*c*h-e*a*f-r*o*h+n*o*f+r*a*u-n*c*u)+p*(-s*a*u-e*l*h+e*a*d+s*o*h-n*o*d+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],S=h*m*c-_*d*c+_*l*f-a*m*f-h*l*p+a*d*p,x=g*d*c-u*m*c-g*l*f+o*m*f+u*l*p-o*d*p,v=u*_*c-g*h*c+g*a*f-o*_*f-u*a*p+o*h*p,w=g*h*l-u*_*l-g*a*d+o*_*d+u*a*m-o*h*m,A=e*S+n*x+s*v+r*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/A;return t[0]=S*C,t[1]=(_*d*r-h*m*r-_*s*f+n*m*f+h*s*p-n*d*p)*C,t[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*p+n*l*p)*C,t[3]=(h*l*r-a*d*r-h*s*c+n*d*c+a*s*f-n*l*f)*C,t[4]=x*C,t[5]=(u*m*r-g*d*r+g*s*f-e*m*f-u*s*p+e*d*p)*C,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*p-e*l*p)*C,t[7]=(o*d*r-u*l*r+u*s*c-e*d*c-o*s*f+e*l*f)*C,t[8]=v*C,t[9]=(g*h*r-u*_*r-g*n*f+e*_*f+u*n*p-e*h*p)*C,t[10]=(o*_*r-g*a*r+g*n*c-e*_*c-o*n*p+e*a*p)*C,t[11]=(u*a*r-o*h*r-u*n*c+e*h*c+o*n*f-e*a*f)*C,t[12]=w*C,t[13]=(u*_*s-g*h*s+g*n*d-e*_*d-u*n*m+e*h*m)*C,t[14]=(g*a*s-o*_*s-g*n*l+e*_*l+o*n*m-e*a*m)*C,t[15]=(o*h*s-u*a*s+u*n*l-e*h*l-o*n*d+e*a*d)*C,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,h=a+a,d=r*c,f=r*u,g=r*h,_=o*u,m=o*h,p=a*h,S=l*c,x=l*u,v=l*h,w=n.x,A=n.y,C=n.z;return s[0]=(1-(_+p))*w,s[1]=(f+v)*w,s[2]=(g-x)*w,s[3]=0,s[4]=(f-v)*A,s[5]=(1-(d+p))*A,s[6]=(m+S)*A,s[7]=0,s[8]=(g+x)*C,s[9]=(m-S)*C,s[10]=(1-(d+_))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ls.set(s[0],s[1],s[2]).length();const o=Ls.set(s[4],s[5],s[6]).length(),a=Ls.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Nn.copy(this);const c=1/r,u=1/o,h=1/a;return Nn.elements[0]*=c,Nn.elements[1]*=c,Nn.elements[2]*=c,Nn.elements[4]*=u,Nn.elements[5]*=u,Nn.elements[6]*=u,Nn.elements[8]*=h,Nn.elements[9]*=h,Nn.elements[10]*=h,e.setFromRotationMatrix(Nn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=mi){const l=this.elements,c=2*r/(e-t),u=2*r/(n-s),h=(e+t)/(e-t),d=(n+s)/(n-s);let f,g;if(a===mi)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ca)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=mi){const l=this.elements,c=1/(e-t),u=1/(n-s),h=1/(o-r),d=(e+t)*c,f=(n+s)*u;let g,_;if(a===mi)g=(o+r)*h,_=-2*h;else if(a===Ca)g=r*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ls=new P,Nn=new fe,xm=new P(0,0,0),ym=new P(1,1,1),Ti=new P,vo=new P,vn=new P,Yh=new fe,$h=new no;class ti{constructor(t=0,e=0,n=0,s=ti.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Zt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Yh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Yh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return $h.setFromEuler(this),this.setFromQuaternion($h,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ti.DEFAULT_ORDER="XYZ";class hf{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Mm=0;const Kh=new P,Is=new no,oi=new fe,xo=new P,Ar=new P,Sm=new P,Em=new no,Zh=new P(1,0,0),Jh=new P(0,1,0),jh=new P(0,0,1),Qh={type:"added"},bm={type:"removed"},Ds={type:"childadded",child:null},cl={type:"childremoved",child:null};class We extends gr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Mm++}),this.uuid=_r(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=We.DEFAULT_UP.clone();const t=new P,e=new ti,n=new no,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new Yt}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=We.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=We.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Is.setFromAxisAngle(t,e),this.quaternion.multiply(Is),this}rotateOnWorldAxis(t,e){return Is.setFromAxisAngle(t,e),this.quaternion.premultiply(Is),this}rotateX(t){return this.rotateOnAxis(Zh,t)}rotateY(t){return this.rotateOnAxis(Jh,t)}rotateZ(t){return this.rotateOnAxis(jh,t)}translateOnAxis(t,e){return Kh.copy(t).applyQuaternion(this.quaternion),this.position.add(Kh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Zh,t)}translateY(t){return this.translateOnAxis(Jh,t)}translateZ(t){return this.translateOnAxis(jh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(oi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?xo.copy(t):xo.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?oi.lookAt(Ar,xo,this.up):oi.lookAt(xo,Ar,this.up),this.quaternion.setFromRotationMatrix(oi),s&&(oi.extractRotation(s.matrixWorld),Is.setFromRotationMatrix(oi),this.quaternion.premultiply(Is.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Qh),Ds.child=t,this.dispatchEvent(Ds),Ds.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(bm),cl.child=t,this.dispatchEvent(cl),cl.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),oi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),oi.multiply(t.parent.matrixWorld)),t.applyMatrix4(oi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Qh),Ds.child=t,this.dispatchEvent(Ds),Ds.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ar,t,Sm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ar,Em,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}We.DEFAULT_UP=new P(0,1,0);We.DEFAULT_MATRIX_AUTO_UPDATE=!0;We.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Fn=new P,ai=new P,hl=new P,li=new P,Us=new P,Ns=new P,tu=new P,ul=new P,dl=new P,fl=new P,pl=new he,ml=new he,gl=new he;class Gn{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Fn.subVectors(t,e),s.cross(Fn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Fn.subVectors(s,e),ai.subVectors(n,e),hl.subVectors(t,e);const o=Fn.dot(Fn),a=Fn.dot(ai),l=Fn.dot(hl),c=ai.dot(ai),u=ai.dot(hl),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-a*u)*d,g=(o*u-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,li)===null?!1:li.x>=0&&li.y>=0&&li.x+li.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,li)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,li.x),l.addScaledVector(o,li.y),l.addScaledVector(a,li.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return pl.setScalar(0),ml.setScalar(0),gl.setScalar(0),pl.fromBufferAttribute(t,e),ml.fromBufferAttribute(t,n),gl.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(pl,r.x),o.addScaledVector(ml,r.y),o.addScaledVector(gl,r.z),o}static isFrontFacing(t,e,n,s){return Fn.subVectors(n,e),ai.subVectors(t,e),Fn.cross(ai).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Fn.subVectors(this.c,this.b),ai.subVectors(this.a,this.b),Fn.cross(ai).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Gn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Gn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Gn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Gn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Gn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Us.subVectors(s,n),Ns.subVectors(r,n),ul.subVectors(t,n);const l=Us.dot(ul),c=Ns.dot(ul);if(l<=0&&c<=0)return e.copy(n);dl.subVectors(t,s);const u=Us.dot(dl),h=Ns.dot(dl);if(u>=0&&h<=u)return e.copy(s);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(Us,o);fl.subVectors(t,r);const f=Us.dot(fl),g=Ns.dot(fl);if(g>=0&&f<=g)return e.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Ns,a);const m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return tu.subVectors(r,s),a=(h-u)/(h-u+(f-g)),e.copy(s).addScaledVector(tu,a);const p=1/(m+_+d);return o=_*p,a=d*p,e.copy(n).addScaledVector(Us,o).addScaledVector(Ns,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const uf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ai={h:0,s:0,l:0},yo={h:0,s:0,l:0};function _l(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=En){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=se.workingColorSpace){if(t=om(t,1),e=Zt(e,0,1),n=Zt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=_l(o,r,t+1/3),this.g=_l(o,r,t),this.b=_l(o,r,t-1/3)}return se.toWorkingColorSpace(this,s),this}setStyle(t,e=En){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=En){const n=uf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=vi(t.r),this.g=vi(t.g),this.b=vi(t.b),this}copyLinearToSRGB(t){return this.r=rr(t.r),this.g=rr(t.g),this.b=rr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=En){return se.fromWorkingColorSpace(Ke.copy(this),t),Math.round(Zt(Ke.r*255,0,255))*65536+Math.round(Zt(Ke.g*255,0,255))*256+Math.round(Zt(Ke.b*255,0,255))}getHexString(t=En){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.fromWorkingColorSpace(Ke.copy(this),e);const n=Ke.r,s=Ke.g,r=Ke.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=se.workingColorSpace){return se.fromWorkingColorSpace(Ke.copy(this),e),t.r=Ke.r,t.g=Ke.g,t.b=Ke.b,t}getStyle(t=En){se.fromWorkingColorSpace(Ke.copy(this),t);const e=Ke.r,n=Ke.g,s=Ke.b;return t!==En?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Ai),this.setHSL(Ai.h+t,Ai.s+e,Ai.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ai),t.getHSL(yo);const n=tl(Ai.h,yo.h,e),s=tl(Ai.s,yo.s,e),r=tl(Ai.l,yo.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ke=new Bt;Bt.NAMES=uf;let wm=0;class io extends gr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:wm++}),this.uuid=_r(),this.name="",this.type="Material",this.blending=ir,this.side=Gi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ec,this.blendDst=nc,this.blendEquation=ds,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=ar,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=kh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ts,this.stencilZFail=Ts,this.stencilZPass=Ts,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ir&&(n.blending=this.blending),this.side!==Gi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ec&&(n.blendSrc=this.blendSrc),this.blendDst!==nc&&(n.blendDst=this.blendDst),this.blendEquation!==ds&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ar&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==kh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ts&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ts&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ts&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Le extends io{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ti,this.combine=qd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Re=new P,Mo=new lt;class pn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Hh,this.updateRanges=[],this.gpuType=Wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Mo.fromBufferAttribute(this,e),Mo.applyMatrix3(t),this.setXY(e,Mo.x,Mo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix3(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix4(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyNormalMatrix(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.transformDirection(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=br(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=hn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=br(e,this.array)),e}setX(t,e){return this.normalized&&(e=hn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=br(e,this.array)),e}setY(t,e){return this.normalized&&(e=hn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=br(e,this.array)),e}setZ(t,e){return this.normalized&&(e=hn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=br(e,this.array)),e}setW(t,e){return this.normalized&&(e=hn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=hn(e,this.array),n=hn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=hn(e,this.array),n=hn(n,this.array),s=hn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=hn(e,this.array),n=hn(n,this.array),s=hn(s,this.array),r=hn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Hh&&(t.usage=this.usage),t}}class df extends pn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ff extends pn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class _e extends pn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Tm=0;const Cn=new fe,vl=new We,Fs=new P,xn=new Ms,Rr=new Ms,ze=new P;class gn extends gr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tm++}),this.uuid=_r(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(af(t)?ff:df)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Yt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Cn.makeRotationFromQuaternion(t),this.applyMatrix4(Cn),this}rotateX(t){return Cn.makeRotationX(t),this.applyMatrix4(Cn),this}rotateY(t){return Cn.makeRotationY(t),this.applyMatrix4(Cn),this}rotateZ(t){return Cn.makeRotationZ(t),this.applyMatrix4(Cn),this}translate(t,e,n){return Cn.makeTranslation(t,e,n),this.applyMatrix4(Cn),this}scale(t,e,n){return Cn.makeScale(t,e,n),this.applyMatrix4(Cn),this}lookAt(t){return vl.lookAt(t),vl.updateMatrix(),this.applyMatrix4(vl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fs).negate(),this.translate(Fs.x,Fs.y,Fs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new _e(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ms);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];xn.setFromBufferAttribute(r),this.morphTargetsRelative?(ze.addVectors(this.boundingBox.min,xn.min),this.boundingBox.expandByPoint(ze),ze.addVectors(this.boundingBox.max,xn.max),this.boundingBox.expandByPoint(ze)):(this.boundingBox.expandByPoint(xn.min),this.boundingBox.expandByPoint(xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(xn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Rr.setFromBufferAttribute(a),this.morphTargetsRelative?(ze.addVectors(xn.min,Rr.min),xn.expandByPoint(ze),ze.addVectors(xn.max,Rr.max),xn.expandByPoint(ze)):(xn.expandByPoint(Rr.min),xn.expandByPoint(Rr.max))}xn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)ze.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ze));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)ze.fromBufferAttribute(a,c),l&&(Fs.fromBufferAttribute(t,c),ze.add(Fs)),s=Math.max(s,n.distanceToSquared(ze))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let I=0;I<n.count;I++)a[I]=new P,l[I]=new P;const c=new P,u=new P,h=new P,d=new lt,f=new lt,g=new lt,_=new P,m=new P;function p(I,b,M){c.fromBufferAttribute(n,I),u.fromBufferAttribute(n,b),h.fromBufferAttribute(n,M),d.fromBufferAttribute(r,I),f.fromBufferAttribute(r,b),g.fromBufferAttribute(r,M),u.sub(c),h.sub(c),f.sub(d),g.sub(d);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(L),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(L),a[I].add(_),a[b].add(_),a[M].add(_),l[I].add(m),l[b].add(m),l[M].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let I=0,b=S.length;I<b;++I){const M=S[I],L=M.start,z=M.count;for(let F=L,V=L+z;F<V;F+=3)p(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const x=new P,v=new P,w=new P,A=new P;function C(I){w.fromBufferAttribute(s,I),A.copy(w);const b=a[I];x.copy(b),x.sub(w.multiplyScalar(w.dot(b))).normalize(),v.crossVectors(A,b);const L=v.dot(l[I])<0?-1:1;o.setXYZW(I,x.x,x.y,x.z,L)}for(let I=0,b=S.length;I<b;++I){const M=S[I],L=M.start,z=M.count;for(let F=L,V=L+z;F<V;F+=3)C(t.getX(F+0)),C(t.getX(F+1)),C(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new pn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new P,r=new P,o=new P,a=new P,l=new P,c=new P,u=new P,h=new P;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ze.fromBufferAttribute(t,e),ze.normalize(),t.setXYZ(e,ze.x,ze.y,ze.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let p=0;p<u;p++)d[g++]=c[f++]}return new pn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new gn,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const eu=new fe,Ki=new vm,So=new vr,nu=new P,Eo=new P,bo=new P,wo=new P,xl=new P,To=new P,iu=new P,Ao=new P;class gt extends We{constructor(t=new gn,e=new Le){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){To.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(xl.fromBufferAttribute(h,t),o?To.addScaledVector(xl,u):To.addScaledVector(xl.sub(e),u))}e.add(To)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),So.copy(n.boundingSphere),So.applyMatrix4(r),Ki.copy(t.ray).recast(t.near),!(So.containsPoint(Ki.origin)===!1&&(Ki.intersectSphere(So,nu)===null||Ki.origin.distanceToSquared(nu)>(t.far-t.near)**2))&&(eu.copy(r).invert(),Ki.copy(t.ray).applyMatrix4(eu),!(n.boundingBox!==null&&Ki.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ki)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=S,w=x;v<w;v+=3){const A=a.getX(v),C=a.getX(v+1),I=a.getX(v+2);s=Ro(this,p,t,n,c,u,h,A,C,I),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const S=a.getX(m),x=a.getX(m+1),v=a.getX(m+2);s=Ro(this,o,t,n,c,u,h,S,x,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),x=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=S,w=x;v<w;v+=3){const A=v,C=v+1,I=v+2;s=Ro(this,p,t,n,c,u,h,A,C,I),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const S=m,x=m+1,v=m+2;s=Ro(this,o,t,n,c,u,h,S,x,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Am(i,t,e,n,s,r,o,a){let l;if(t.side===on?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Gi,a),l===null)return null;Ao.copy(a),Ao.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Ao);return c<e.near||c>e.far?null:{distance:c,point:Ao.clone(),object:i}}function Ro(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Eo),i.getVertexPosition(l,bo),i.getVertexPosition(c,wo);const u=Am(i,t,e,n,Eo,bo,wo,iu);if(u){const h=new P;Gn.getBarycoord(iu,Eo,bo,wo,h),s&&(u.uv=Gn.getInterpolatedAttribute(s,a,l,c,h,new lt)),r&&(u.uv1=Gn.getInterpolatedAttribute(r,a,l,c,h,new lt)),o&&(u.normal=Gn.getInterpolatedAttribute(o,a,l,c,h,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new P,materialIndex:0};Gn.getNormal(Eo,bo,wo,d.normal),u.face=d,u.barycoord=h}return u}class Xe extends gn{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new _e(c,3)),this.setAttribute("normal",new _e(u,3)),this.setAttribute("uv",new _e(h,2));function g(_,m,p,S,x,v,w,A,C,I,b){const M=v/C,L=w/I,z=v/2,F=w/2,V=A/2,q=C+1,k=I+1;let Y=0,O=0;const ot=new P;for(let xt=0;xt<k;xt++){const wt=xt*L-F;for(let Xt=0;Xt<q;Xt++){const ae=Xt*M-z;ot[_]=ae*S,ot[m]=wt*x,ot[p]=V,c.push(ot.x,ot.y,ot.z),ot[_]=0,ot[m]=0,ot[p]=A>0?1:-1,u.push(ot.x,ot.y,ot.z),h.push(Xt/C),h.push(1-xt/I),Y+=1}}for(let xt=0;xt<I;xt++)for(let wt=0;wt<C;wt++){const Xt=d+wt+q*xt,ae=d+wt+q*(xt+1),Z=d+(wt+1)+q*(xt+1),rt=d+(wt+1)+q*xt;l.push(Xt,ae,rt),l.push(ae,Z,rt),O+=6}a.addGroup(f,O,b),f+=O,d+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xe(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function fr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function nn(i){const t={};for(let e=0;e<i.length;e++){const n=fr(i[e]);for(const s in n)t[s]=n[s]}return t}function Rm(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function pf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}const Cm={clone:fr,merge:nn};var Pm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Lm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Xn extends io{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pm,this.fragmentShader=Lm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=fr(t.uniforms),this.uniformsGroups=Rm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class mf extends We{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=mi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ri=new P,su=new lt,ru=new lt;class bn extends mf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=kc*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Qa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return kc*2*Math.atan(Math.tan(Qa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ri.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ri.x,Ri.y).multiplyScalar(-t/Ri.z),Ri.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ri.x,Ri.y).multiplyScalar(-t/Ri.z)}getViewSize(t,e){return this.getViewBounds(t,su,ru),e.subVectors(ru,su)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Qa*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Os=-90,Bs=1;class Im extends We{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new bn(Os,Bs,t,e);s.layers=this.layers,this.add(s);const r=new bn(Os,Bs,t,e);r.layers=this.layers,this.add(r);const o=new bn(Os,Bs,t,e);o.layers=this.layers,this.add(o);const a=new bn(Os,Bs,t,e);a.layers=this.layers,this.add(a);const l=new bn(Os,Bs,t,e);l.layers=this.layers,this.add(l);const c=new bn(Os,Bs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===mi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ca)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class gf extends ln{constructor(t,e,n,s,r,o,a,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:lr,super(t,e,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Dm extends Vi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new gf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:fn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Xe(5,5,5),r=new Xn({name:"CubemapFromEquirect",uniforms:fr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:on,blending:Bi});r.uniforms.tEquirect.value=e;const o=new gt(s,r),a=e.minFilter;return e.minFilter===ms&&(e.minFilter=fn),new Im(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class lh extends We{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ti,this.environmentIntensity=1,this.environmentRotation=new ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class ch extends ln{constructor(t=null,e=1,n=1,s,r,o,a,l,c=an,u=an,h,d){super(null,o,a,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ou extends pn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const zs=new fe,au=new fe,Co=[],lu=new Ms,Um=new fe,Cr=new gt,Pr=new vr;class _f extends gt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ou(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Um)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ms),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,zs),lu.copy(t.boundingBox).applyMatrix4(zs),this.boundingBox.union(lu)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new vr),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,zs),Pr.copy(t.boundingSphere).applyMatrix4(zs),this.boundingSphere.union(Pr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Cr.geometry=this.geometry,Cr.material=this.material,Cr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Pr.copy(this.boundingSphere),Pr.applyMatrix4(n),t.ray.intersectsSphere(Pr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,zs),au.multiplyMatrices(n,zs),Cr.matrixWorld=au,Cr.raycast(t,Co);for(let o=0,a=Co.length;o<a;o++){const l=Co[o];l.instanceId=r,l.object=this,e.push(l)}Co.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new ou(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ch(new Float32Array(s*this.count),s,this.count,sh,Wn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}const yl=new P,Nm=new P,Fm=new Yt;class os{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=yl.subVectors(n,e).cross(Nm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(yl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Fm.getNormalMatrix(t),s=this.coplanarPoint(yl).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zi=new vr,Po=new P;class hh{constructor(t=new os,e=new os,n=new os,s=new os,r=new os,o=new os){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=mi){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],h=s[6],d=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],S=s[13],x=s[14],v=s[15];if(n[0].setComponents(l-r,d-c,m-f,v-p).normalize(),n[1].setComponents(l+r,d+c,m+f,v+p).normalize(),n[2].setComponents(l+o,d+u,m+g,v+S).normalize(),n[3].setComponents(l-o,d-u,m-g,v-S).normalize(),n[4].setComponents(l-a,d-h,m-_,v-x).normalize(),e===mi)n[5].setComponents(l+a,d+h,m+_,v+x).normalize();else if(e===Ca)n[5].setComponents(a,h,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Zi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Zi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Zi)}intersectsSprite(t){return Zi.center.set(0,0,0),Zi.radius=.7071067811865476,Zi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Zi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Po.x=s.normal.x>0?t.max.x:t.min.x,Po.y=s.normal.y>0?t.max.y:t.min.y,Po.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Po)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ne extends We{constructor(){super(),this.isGroup=!0,this.type="Group"}}class vf extends ln{constructor(t,e,n,s,r,o,a,l,c,u=sr){if(u!==sr&&u!==ur)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===sr&&(n=gs),n===void 0&&u===ur&&(n=hr),super(null,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:an,this.minFilter=l!==void 0?l:an,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ni{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const u=n[s],d=n[s+1]-u,f=(o-u)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new lt:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new P,s=[],r=[],o=[],a=new P,l=new fe;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Zt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Zt(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class uh extends ni{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new lt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Om extends uh{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function dh(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let d=(o-r)/c-(a-r)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Lo=new P,Ml=new dh,Sl=new dh,El=new dh;class fh extends ni{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new P){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(Lo.subVectors(s[0],s[1]).add(s[0]),c=Lo);const h=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(Lo.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Lo),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Ml.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,g,_,m),Sl.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,g,_,m),El.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,g,_,m)}else this.curveType==="catmullrom"&&(Ml.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),Sl.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),El.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(Ml.calc(l),Sl.calc(l),El.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function cu(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function Bm(i,t){const e=1-i;return e*e*t}function zm(i,t){return 2*(1-i)*i*t}function km(i,t){return i*i*t}function Xr(i,t,e,n){return Bm(i,t)+zm(i,e)+km(i,n)}function Hm(i,t){const e=1-i;return e*e*e*t}function Gm(i,t){const e=1-i;return 3*e*e*i*t}function Vm(i,t){return 3*(1-i)*i*i*t}function Wm(i,t){return i*i*i*t}function qr(i,t,e,n,s){return Hm(i,t)+Gm(i,e)+Vm(i,n)+Wm(i,s)}class xf extends ni{constructor(t=new lt,e=new lt,n=new lt,s=new lt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new lt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(qr(t,s.x,r.x,o.x,a.x),qr(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Xm extends ni{constructor(t=new P,e=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(qr(t,s.x,r.x,o.x,a.x),qr(t,s.y,r.y,o.y,a.y),qr(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class yf extends ni{constructor(t=new lt,e=new lt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new lt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new lt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class qm extends ni{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Mf extends ni{constructor(t=new lt,e=new lt,n=new lt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new lt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Xr(t,s.x,r.x,o.x),Xr(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Sf extends ni{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Xr(t,s.x,r.x,o.x),Xr(t,s.y,r.y,o.y),Xr(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ef extends ni{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new lt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(cu(a,l.x,c.x,u.x,h.x),cu(a,l.y,c.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new lt().fromArray(s))}return this}}var La=Object.freeze({__proto__:null,ArcCurve:Om,CatmullRomCurve3:fh,CubicBezierCurve:xf,CubicBezierCurve3:Xm,EllipseCurve:uh,LineCurve:yf,LineCurve3:qm,QuadraticBezierCurve:Mf,QuadraticBezierCurve3:Sf,SplineCurve:Ef});class Ym extends ni{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new La[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new La[s.type]().fromJSON(s))}return this}}class Ia extends Ym{constructor(t){super(),this.type="Path",this.currentPoint=new lt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new yf(this.currentPoint.clone(),new lt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Mf(this.currentPoint.clone(),new lt(t,e),new lt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new xf(this.currentPoint.clone(),new lt(t,e),new lt(n,s),new lt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Ef(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new uh(t,e,n,s,r,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ph extends gn{constructor(t=[new lt(0,-.5),new lt(.5,0),new lt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Zt(s,0,Math.PI*2);const r=[],o=[],a=[],l=[],c=[],u=1/e,h=new P,d=new lt,f=new P,g=new P,_=new P;let m=0,p=0;for(let S=0;S<=t.length-1;S++)switch(S){case 0:m=t[S+1].x-t[S].x,p=t[S+1].y-t[S].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:m=t[S+1].x-t[S].x,p=t[S+1].y-t[S].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(g)}for(let S=0;S<=e;S++){const x=n+S*u*s,v=Math.sin(x),w=Math.cos(x);for(let A=0;A<=t.length-1;A++){h.x=t[A].x*v,h.y=t[A].y,h.z=t[A].x*w,o.push(h.x,h.y,h.z),d.x=S/e,d.y=A/(t.length-1),a.push(d.x,d.y);const C=l[3*A+0]*v,I=l[3*A+1],b=l[3*A+0]*w;c.push(C,I,b)}}for(let S=0;S<e;S++)for(let x=0;x<t.length-1;x++){const v=x+S*t.length,w=v,A=v+t.length,C=v+t.length+1,I=v+1;r.push(w,A,I),r.push(C,I,A)}this.setIndex(r),this.setAttribute("position",new _e(o,3)),this.setAttribute("uv",new _e(a,2)),this.setAttribute("normal",new _e(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ph(t.points,t.segments,t.phiStart,t.phiLength)}}class _s extends gn{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new P,u=new lt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const f=n+h/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[d]/t+1)/2,u.y=(o[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new _e(o,3)),this.setAttribute("normal",new _e(a,3)),this.setAttribute("uv",new _e(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _s(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ve extends gn{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;S(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new _e(h,3)),this.setAttribute("normal",new _e(d,3)),this.setAttribute("uv",new _e(f,2));function S(){const v=new P,w=new P;let A=0;const C=(e-t)/n;for(let I=0;I<=r;I++){const b=[],M=I/r,L=M*(e-t)+t;for(let z=0;z<=s;z++){const F=z/s,V=F*l+a,q=Math.sin(V),k=Math.cos(V);w.x=L*q,w.y=-M*n+m,w.z=L*k,h.push(w.x,w.y,w.z),v.set(q,C,k).normalize(),d.push(v.x,v.y,v.z),f.push(F,1-M),b.push(g++)}_.push(b)}for(let I=0;I<s;I++)for(let b=0;b<r;b++){const M=_[b][I],L=_[b+1][I],z=_[b+1][I+1],F=_[b][I+1];(t>0||b!==0)&&(u.push(M,L,F),A+=3),(e>0||b!==r-1)&&(u.push(L,z,F),A+=3)}c.addGroup(p,A,0),p+=A}function x(v){const w=g,A=new lt,C=new P;let I=0;const b=v===!0?t:e,M=v===!0?1:-1;for(let z=1;z<=s;z++)h.push(0,m*M,0),d.push(0,M,0),f.push(.5,.5),g++;const L=g;for(let z=0;z<=s;z++){const V=z/s*l+a,q=Math.cos(V),k=Math.sin(V);C.x=b*k,C.y=m*M,C.z=b*q,h.push(C.x,C.y,C.z),d.push(0,M,0),A.x=q*.5+.5,A.y=k*.5*M+.5,f.push(A.x,A.y),g++}for(let z=0;z<s;z++){const F=w+z,V=L+z;v===!0?u.push(V,V+1,F):u.push(V+1,V,F),I+=3}c.addGroup(p,I,v===!0?1:2),p+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ve(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ba extends Ve{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ba(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class so extends Ia{constructor(t){super(t),this.uuid=_r(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Ia().fromJSON(s))}return this}}const $m={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=bf(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,u,h,d,f;if(n&&(r=Qm(i,t,r,e)),i.length>80*e){a=c=i[0],l=u=i[1];for(let g=e;g<s;g+=e)h=i[g],d=i[g+1],h<a&&(a=h),d<l&&(l=d),h>c&&(c=h),d>u&&(u=d);f=Math.max(c-a,u-l),f=f!==0?32767/f:0}return jr(r,o,e,a,l,f,0),o}};function bf(i,t,e,n,s){let r,o;if(s===hg(i,t,e,n)>0)for(r=t;r<e;r+=n)o=hu(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=hu(r,i[r],i[r+1],o);return o&&za(o,o.next)&&(to(o),o=o.next),o}function vs(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(za(e,e.next)||xe(e.prev,e,e.next)===0)){if(to(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function jr(i,t,e,n,s,r,o){if(!i)return;!o&&r&&sg(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?Zm(i,n,s,r):Km(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),to(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Jm(vs(i),t,e),jr(i,t,e,n,s,r,2)):o===2&&jm(i,t,e,n,s,r):jr(vs(i),t,e,n,s,r,1);break}}}function Km(i){const t=i.prev,e=i,n=i.next;if(xe(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,u=s<r?s<o?s:o:r<o?r:o,h=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&tr(s,a,r,l,o,c,g.x,g.y)&&xe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Zm(i,t,e,n){const s=i.prev,r=i,o=i.next;if(xe(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,u=s.y,h=r.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,g=u<h?u<d?u:d:h<d?h:d,_=a>l?a>c?a:c:l>c?l:c,m=u>h?u>d?u:d:h>d?h:d,p=Hc(f,g,t,e,n),S=Hc(_,m,t,e,n);let x=i.prevZ,v=i.nextZ;for(;x&&x.z>=p&&v&&v.z<=S;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&tr(a,u,l,h,c,d,x.x,x.y)&&xe(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&tr(a,u,l,h,c,d,v.x,v.y)&&xe(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&tr(a,u,l,h,c,d,x.x,x.y)&&xe(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=S;){if(v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&tr(a,u,l,h,c,d,v.x,v.y)&&xe(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Jm(i,t,e){let n=i;do{const s=n.prev,r=n.next.next;!za(s,r)&&wf(s,n,n.next,r)&&Qr(s,r)&&Qr(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),to(n),to(n.next),n=i=r),n=n.next}while(n!==i);return vs(n)}function jm(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&ag(o,a)){let l=Tf(o,a);o=vs(o,o.next),l=vs(l,l.next),jr(o,t,e,n,s,r,0),jr(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Qm(i,t,e,n){const s=[];let r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=bf(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(og(c));for(s.sort(tg),r=0;r<s.length;r++)e=eg(s[r],e);return e}function tg(i,t){return i.x-t.x}function eg(i,t){const e=ng(i,t);if(!e)return t;const n=Tf(e,i);return vs(n,n.next),vs(e,e.next)}function ng(i,t){let e=t,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,l=s.x,c=s.y;let u=1/0,h;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&tr(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(h=Math.abs(o-e.y)/(r-e.x),Qr(e,i)&&(h<u||h===u&&(e.x>s.x||e.x===s.x&&ig(s,e)))&&(s=e,u=h)),e=e.next;while(e!==a);return s}function ig(i,t){return xe(i.prev,i,t.prev)<0&&xe(t.next,i,i.next)<0}function sg(i,t,e,n){let s=i;do s.z===0&&(s.z=Hc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,rg(s)}function rg(i){let t,e,n,s,r,o,a,l,c=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(o>1);return i}function Hc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function og(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function tr(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function ag(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!lg(i,t)&&(Qr(i,t)&&Qr(t,i)&&cg(i,t)&&(xe(i.prev,i,t.prev)||xe(i,t.prev,t))||za(i,t)&&xe(i.prev,i,i.next)>0&&xe(t.prev,t,t.next)>0)}function xe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function za(i,t){return i.x===t.x&&i.y===t.y}function wf(i,t,e,n){const s=Do(xe(i,t,e)),r=Do(xe(i,t,n)),o=Do(xe(e,n,i)),a=Do(xe(e,n,t));return!!(s!==r&&o!==a||s===0&&Io(i,e,t)||r===0&&Io(i,n,t)||o===0&&Io(e,i,n)||a===0&&Io(e,t,n))}function Io(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Do(i){return i>0?1:i<0?-1:0}function lg(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&wf(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Qr(i,t){return xe(i.prev,i,i.next)<0?xe(i,t,i.next)>=0&&xe(i,i.prev,t)>=0:xe(i,t,i.prev)<0||xe(i,i.next,t)<0}function cg(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Tf(i,t){const e=new Gc(i.i,i.x,i.y),n=new Gc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function hu(i,t,e,n){const s=new Gc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function to(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Gc(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function hg(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Yr{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Yr.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];uu(t),du(n,t);let o=t.length;e.forEach(uu);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,du(n,e[l]);const a=$m.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function uu(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function du(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class xr extends gn{constructor(t=new so([new lt(.5,.5),new lt(-.5,.5),new lt(-.5,-.5),new lt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new _e(s,3)),this.setAttribute("uv",new _e(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,h=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,S=e.UVGenerator!==void 0?e.UVGenerator:ug;let x,v=!1,w,A,C,I;p&&(x=p.getSpacedPoints(u),v=!0,d=!1,w=p.computeFrenetFrames(u,!1),A=new P,C=new P,I=new P),d||(m=0,f=0,g=0,_=0);const b=a.extractPoints(c);let M=b.shape;const L=b.holes;if(!Yr.isClockWise(M)){M=M.reverse();for(let j=0,st=L.length;j<st;j++){const R=L[j];Yr.isClockWise(R)&&(L[j]=R.reverse())}}const F=Yr.triangulateShape(M,L),V=M;for(let j=0,st=L.length;j<st;j++){const R=L[j];M=M.concat(R)}function q(j,st,R){return st||console.error("THREE.ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(st,R)}const k=M.length,Y=F.length;function O(j,st,R){let Lt,et,Mt;const at=j.x-st.x,Ft=j.y-st.y,_t=R.x-j.x,T=R.y-j.y,y=at*at+Ft*Ft,B=at*T-Ft*_t;if(Math.abs(B)>Number.EPSILON){const $=Math.sqrt(y),Q=Math.sqrt(_t*_t+T*T),K=st.x-Ft/$,Pt=st.y+at/$,dt=R.x-T/Q,yt=R.y+_t/Q,Jt=((dt-K)*T-(yt-Pt)*_t)/(at*T-Ft*_t);Lt=K+at*Jt-j.x,et=Pt+Ft*Jt-j.y;const it=Lt*Lt+et*et;if(it<=2)return new lt(Lt,et);Mt=Math.sqrt(it/2)}else{let $=!1;at>Number.EPSILON?_t>Number.EPSILON&&($=!0):at<-Number.EPSILON?_t<-Number.EPSILON&&($=!0):Math.sign(Ft)===Math.sign(T)&&($=!0),$?(Lt=-Ft,et=at,Mt=Math.sqrt(y)):(Lt=at,et=Ft,Mt=Math.sqrt(y/2))}return new lt(Lt/Mt,et/Mt)}const ot=[];for(let j=0,st=V.length,R=st-1,Lt=j+1;j<st;j++,R++,Lt++)R===st&&(R=0),Lt===st&&(Lt=0),ot[j]=O(V[j],V[R],V[Lt]);const xt=[];let wt,Xt=ot.concat();for(let j=0,st=L.length;j<st;j++){const R=L[j];wt=[];for(let Lt=0,et=R.length,Mt=et-1,at=Lt+1;Lt<et;Lt++,Mt++,at++)Mt===et&&(Mt=0),at===et&&(at=0),wt[Lt]=O(R[Lt],R[Mt],R[at]);xt.push(wt),Xt=Xt.concat(wt)}for(let j=0;j<m;j++){const st=j/m,R=f*Math.cos(st*Math.PI/2),Lt=g*Math.sin(st*Math.PI/2)+_;for(let et=0,Mt=V.length;et<Mt;et++){const at=q(V[et],ot[et],Lt);ct(at.x,at.y,-R)}for(let et=0,Mt=L.length;et<Mt;et++){const at=L[et];wt=xt[et];for(let Ft=0,_t=at.length;Ft<_t;Ft++){const T=q(at[Ft],wt[Ft],Lt);ct(T.x,T.y,-R)}}}const ae=g+_;for(let j=0;j<k;j++){const st=d?q(M[j],Xt[j],ae):M[j];v?(C.copy(w.normals[0]).multiplyScalar(st.x),A.copy(w.binormals[0]).multiplyScalar(st.y),I.copy(x[0]).add(C).add(A),ct(I.x,I.y,I.z)):ct(st.x,st.y,0)}for(let j=1;j<=u;j++)for(let st=0;st<k;st++){const R=d?q(M[st],Xt[st],ae):M[st];v?(C.copy(w.normals[j]).multiplyScalar(R.x),A.copy(w.binormals[j]).multiplyScalar(R.y),I.copy(x[j]).add(C).add(A),ct(I.x,I.y,I.z)):ct(R.x,R.y,h/u*j)}for(let j=m-1;j>=0;j--){const st=j/m,R=f*Math.cos(st*Math.PI/2),Lt=g*Math.sin(st*Math.PI/2)+_;for(let et=0,Mt=V.length;et<Mt;et++){const at=q(V[et],ot[et],Lt);ct(at.x,at.y,h+R)}for(let et=0,Mt=L.length;et<Mt;et++){const at=L[et];wt=xt[et];for(let Ft=0,_t=at.length;Ft<_t;Ft++){const T=q(at[Ft],wt[Ft],Lt);v?ct(T.x,T.y+x[u-1].y,x[u-1].x+R):ct(T.x,T.y,h+R)}}}Z(),rt();function Z(){const j=s.length/3;if(d){let st=0,R=k*st;for(let Lt=0;Lt<Y;Lt++){const et=F[Lt];It(et[2]+R,et[1]+R,et[0]+R)}st=u+m*2,R=k*st;for(let Lt=0;Lt<Y;Lt++){const et=F[Lt];It(et[0]+R,et[1]+R,et[2]+R)}}else{for(let st=0;st<Y;st++){const R=F[st];It(R[2],R[1],R[0])}for(let st=0;st<Y;st++){const R=F[st];It(R[0]+k*u,R[1]+k*u,R[2]+k*u)}}n.addGroup(j,s.length/3-j,0)}function rt(){const j=s.length/3;let st=0;Ct(V,st),st+=V.length;for(let R=0,Lt=L.length;R<Lt;R++){const et=L[R];Ct(et,st),st+=et.length}n.addGroup(j,s.length/3-j,1)}function Ct(j,st){let R=j.length;for(;--R>=0;){const Lt=R;let et=R-1;et<0&&(et=j.length-1);for(let Mt=0,at=u+m*2;Mt<at;Mt++){const Ft=k*Mt,_t=k*(Mt+1),T=st+Lt+Ft,y=st+et+Ft,B=st+et+_t,$=st+Lt+_t;Ht(T,y,B,$)}}}function ct(j,st,R){l.push(j),l.push(st),l.push(R)}function It(j,st,R){Ot(j),Ot(st),Ot(R);const Lt=s.length/3,et=S.generateTopUV(n,s,Lt-3,Lt-2,Lt-1);te(et[0]),te(et[1]),te(et[2])}function Ht(j,st,R,Lt){Ot(j),Ot(st),Ot(Lt),Ot(st),Ot(R),Ot(Lt);const et=s.length/3,Mt=S.generateSideWallUV(n,s,et-6,et-3,et-2,et-1);te(Mt[0]),te(Mt[1]),te(Mt[3]),te(Mt[1]),te(Mt[2]),te(Mt[3])}function Ot(j){s.push(l[j*3+0]),s.push(l[j*3+1]),s.push(l[j*3+2])}function te(j){r.push(j.x),r.push(j.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return dg(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new La[s.type]().fromJSON(s)),new xr(n,t.options)}}const ug={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],u=t[s*3+1];return[new lt(r,o),new lt(a,l),new lt(c,u)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],u=t[n*3+1],h=t[n*3+2],d=t[s*3],f=t[s*3+1],g=t[s*3+2],_=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new lt(o,1-l),new lt(c,1-h),new lt(d,1-g),new lt(_,1-p)]:[new lt(a,1-l),new lt(u,1-h),new lt(f,1-g),new lt(m,1-p)]}};function dg(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class xs extends gn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=t/a,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<u;p++){const S=p*d-o;for(let x=0;x<c;x++){const v=x*h-r;g.push(v,-S,0),_.push(0,0,1),m.push(x/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<a;S++){const x=S+c*p,v=S+c*(p+1),w=S+1+c*(p+1),A=S+1+c*p;f.push(x,v,A),f.push(v,w,A)}this.setIndex(f),this.setAttribute("position",new _e(g,3)),this.setAttribute("normal",new _e(_,3)),this.setAttribute("uv",new _e(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xs(t.width,t.height,t.widthSegments,t.heightSegments)}}class yr extends gn{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new P,d=new P,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const S=[],x=p/n;let v=0;p===0&&o===0?v=.5/e:p===n&&l===Math.PI&&(v=-.5/e);for(let w=0;w<=e;w++){const A=w/e;h.x=-t*Math.cos(s+A*r)*Math.sin(o+x*a),h.y=t*Math.cos(o+x*a),h.z=t*Math.sin(s+A*r)*Math.sin(o+x*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),m.push(A+v,1-x),S.push(c++)}u.push(S)}for(let p=0;p<n;p++)for(let S=0;S<e;S++){const x=u[p][S+1],v=u[p][S],w=u[p+1][S],A=u[p+1][S+1];(p!==0||o>0)&&f.push(x,v,A),(p!==n-1||l<Math.PI)&&f.push(v,w,A)}this.setIndex(f),this.setAttribute("position",new _e(g,3)),this.setAttribute("normal",new _e(_,3)),this.setAttribute("uv",new _e(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ka extends gn{constructor(t=new Sf(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new P,l=new P,c=new lt;let u=new P;const h=[],d=[],f=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new _e(h,3)),this.setAttribute("normal",new _e(d,3)),this.setAttribute("uv",new _e(f,2));function _(){for(let x=0;x<e;x++)m(x);m(r===!1?e:0),S(),p()}function m(x){u=t.getPointAt(x/e,u);const v=o.normals[x],w=o.binormals[x];for(let A=0;A<=s;A++){const C=A/s*Math.PI*2,I=Math.sin(C),b=-Math.cos(C);l.x=b*v.x+I*w.x,l.y=b*v.y+I*w.y,l.z=b*v.z+I*w.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=u.x+n*l.x,a.y=u.y+n*l.y,a.z=u.z+n*l.z,h.push(a.x,a.y,a.z)}}function p(){for(let x=1;x<=e;x++)for(let v=1;v<=s;v++){const w=(s+1)*(x-1)+(v-1),A=(s+1)*x+(v-1),C=(s+1)*x+v,I=(s+1)*(x-1)+v;g.push(w,A,I),g.push(A,C,I)}}function S(){for(let x=0;x<=e;x++)for(let v=0;v<=s;v++)c.x=x/e,c.y=v/s,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new ka(new La[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class De extends io{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rf,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ti,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class fg extends De{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new lt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Zt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Bt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Bt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Bt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class pg extends io{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Zp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class mg extends io{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class mh extends We{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Bt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class gg extends mh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(We.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const bl=new fe,fu=new P,pu=new P;class Af{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new lt(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new hh,this._frameExtents=new lt(1,1),this._viewportCount=1,this._viewports=[new he(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;fu.setFromMatrixPosition(t.matrixWorld),e.position.copy(fu),pu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(pu),e.updateMatrixWorld(),bl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(bl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const mu=new fe,Lr=new P,wl=new P;class _g extends Af{constructor(){super(new bn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new lt(4,2),this._viewportCount=6,this._viewports=[new he(2,1,1,1),new he(0,1,1,1),new he(3,1,1,1),new he(1,1,1,1),new he(3,0,1,1),new he(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Lr.setFromMatrixPosition(t.matrixWorld),n.position.copy(Lr),wl.copy(n.position),wl.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(wl),n.updateMatrixWorld(),s.makeTranslation(-Lr.x,-Lr.y,-Lr.z),mu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mu)}}class vg extends mh{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new _g}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class gh extends mf{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class xg extends Af{constructor(){super(new gh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class gu extends mh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(We.DEFAULT_UP),this.updateMatrix(),this.target=new We,this.shadow=new xg}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class yg extends bn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}function _u(i,t,e,n){const s=Mg(n);switch(e){case jd:return i*t;case tf:return i*t;case ef:return i*t*2;case sh:return i*t/s.components*s.byteLength;case rh:return i*t/s.components*s.byteLength;case nf:return i*t*2/s.components*s.byteLength;case oh:return i*t*2/s.components*s.byteLength;case Qd:return i*t*3/s.components*s.byteLength;case Tn:return i*t*4/s.components*s.byteLength;case ah:return i*t*4/s.components*s.byteLength;case ma:case ga:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case _a:case va:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case mc:case _c:return Math.max(i,16)*Math.max(t,8)/4;case pc:case gc:return Math.max(i,8)*Math.max(t,8)/2;case vc:case xc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case yc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Mc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Sc:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ec:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case bc:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case wc:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Tc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ac:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Rc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Cc:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Pc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Lc:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ic:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Dc:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Uc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case xa:case Nc:case Fc:return Math.ceil(i/4)*Math.ceil(t/4)*16;case sf:case Oc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Bc:case zc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Mg(i){switch(i){case Qn:case Kd:return{byteLength:1,components:1};case Jr:case Zd:case mr:return{byteLength:2,components:1};case nh:case ih:return{byteLength:2,components:4};case gs:case eh:case Wn:return{byteLength:4,components:1};case Jd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:th}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=th);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Rf(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Sg(i){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){const g=h[d],_=h[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){const _=h[f];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Eg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,wg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Tg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ag=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Rg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Pg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Ig=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Dg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ug=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ng=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Fg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Og=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Bg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,zg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,kg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Wg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Xg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,qg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Yg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,$g=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Kg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,jg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qg="gl_FragColor = linearToOutputTexel( gl_FragColor );",t0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,e0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,n0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,i0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,s0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,r0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,o0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,a0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,l0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,c0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,h0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,u0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,d0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,f0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,p0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,m0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,g0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,v0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,x0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,y0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,M0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,S0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,E0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,b0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,w0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,T0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,A0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,R0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,C0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,P0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,L0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,I0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,D0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,U0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,N0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,F0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,O0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,B0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,z0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,k0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,H0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,G0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,V0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,W0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,X0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,q0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Y0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,K0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Z0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,J0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,j0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Q0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,t_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,e_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,n_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,i_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,s_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,r_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,o_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,a_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,l_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,c_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,h_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,u_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,d_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,f_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,p_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,m_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,g_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,__=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,v_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,x_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,y_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,M_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const S_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,E_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,b_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,w_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,T_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,A_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,R_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,C_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,P_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,L_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,I_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,D_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,U_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,N_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,F_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,O_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,B_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,z_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,k_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,H_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,G_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,V_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,W_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,X_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,q_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Y_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,K_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Z_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,J_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,j_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Q_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,tv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ev=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Kt={alphahash_fragment:Eg,alphahash_pars_fragment:bg,alphamap_fragment:wg,alphamap_pars_fragment:Tg,alphatest_fragment:Ag,alphatest_pars_fragment:Rg,aomap_fragment:Cg,aomap_pars_fragment:Pg,batching_pars_vertex:Lg,batching_vertex:Ig,begin_vertex:Dg,beginnormal_vertex:Ug,bsdfs:Ng,iridescence_fragment:Fg,bumpmap_pars_fragment:Og,clipping_planes_fragment:Bg,clipping_planes_pars_fragment:zg,clipping_planes_pars_vertex:kg,clipping_planes_vertex:Hg,color_fragment:Gg,color_pars_fragment:Vg,color_pars_vertex:Wg,color_vertex:Xg,common:qg,cube_uv_reflection_fragment:Yg,defaultnormal_vertex:$g,displacementmap_pars_vertex:Kg,displacementmap_vertex:Zg,emissivemap_fragment:Jg,emissivemap_pars_fragment:jg,colorspace_fragment:Qg,colorspace_pars_fragment:t0,envmap_fragment:e0,envmap_common_pars_fragment:n0,envmap_pars_fragment:i0,envmap_pars_vertex:s0,envmap_physical_pars_fragment:m0,envmap_vertex:r0,fog_vertex:o0,fog_pars_vertex:a0,fog_fragment:l0,fog_pars_fragment:c0,gradientmap_pars_fragment:h0,lightmap_pars_fragment:u0,lights_lambert_fragment:d0,lights_lambert_pars_fragment:f0,lights_pars_begin:p0,lights_toon_fragment:g0,lights_toon_pars_fragment:_0,lights_phong_fragment:v0,lights_phong_pars_fragment:x0,lights_physical_fragment:y0,lights_physical_pars_fragment:M0,lights_fragment_begin:S0,lights_fragment_maps:E0,lights_fragment_end:b0,logdepthbuf_fragment:w0,logdepthbuf_pars_fragment:T0,logdepthbuf_pars_vertex:A0,logdepthbuf_vertex:R0,map_fragment:C0,map_pars_fragment:P0,map_particle_fragment:L0,map_particle_pars_fragment:I0,metalnessmap_fragment:D0,metalnessmap_pars_fragment:U0,morphinstance_vertex:N0,morphcolor_vertex:F0,morphnormal_vertex:O0,morphtarget_pars_vertex:B0,morphtarget_vertex:z0,normal_fragment_begin:k0,normal_fragment_maps:H0,normal_pars_fragment:G0,normal_pars_vertex:V0,normal_vertex:W0,normalmap_pars_fragment:X0,clearcoat_normal_fragment_begin:q0,clearcoat_normal_fragment_maps:Y0,clearcoat_pars_fragment:$0,iridescence_pars_fragment:K0,opaque_fragment:Z0,packing:J0,premultiplied_alpha_fragment:j0,project_vertex:Q0,dithering_fragment:t_,dithering_pars_fragment:e_,roughnessmap_fragment:n_,roughnessmap_pars_fragment:i_,shadowmap_pars_fragment:s_,shadowmap_pars_vertex:r_,shadowmap_vertex:o_,shadowmask_pars_fragment:a_,skinbase_vertex:l_,skinning_pars_vertex:c_,skinning_vertex:h_,skinnormal_vertex:u_,specularmap_fragment:d_,specularmap_pars_fragment:f_,tonemapping_fragment:p_,tonemapping_pars_fragment:m_,transmission_fragment:g_,transmission_pars_fragment:__,uv_pars_fragment:v_,uv_pars_vertex:x_,uv_vertex:y_,worldpos_vertex:M_,background_vert:S_,background_frag:E_,backgroundCube_vert:b_,backgroundCube_frag:w_,cube_vert:T_,cube_frag:A_,depth_vert:R_,depth_frag:C_,distanceRGBA_vert:P_,distanceRGBA_frag:L_,equirect_vert:I_,equirect_frag:D_,linedashed_vert:U_,linedashed_frag:N_,meshbasic_vert:F_,meshbasic_frag:O_,meshlambert_vert:B_,meshlambert_frag:z_,meshmatcap_vert:k_,meshmatcap_frag:H_,meshnormal_vert:G_,meshnormal_frag:V_,meshphong_vert:W_,meshphong_frag:X_,meshphysical_vert:q_,meshphysical_frag:Y_,meshtoon_vert:$_,meshtoon_frag:K_,points_vert:Z_,points_frag:J_,shadow_vert:j_,shadow_frag:Q_,sprite_vert:tv,sprite_frag:ev},ut={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},Jn={basic:{uniforms:nn([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:nn([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:nn([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:nn([ut.common,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.roughnessmap,ut.metalnessmap,ut.fog,ut.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:nn([ut.common,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.gradientmap,ut.fog,ut.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:nn([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:nn([ut.points,ut.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:nn([ut.common,ut.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:nn([ut.common,ut.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:nn([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:nn([ut.sprite,ut.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:nn([ut.common,ut.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:nn([ut.lights,ut.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};Jn.physical={uniforms:nn([Jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const Uo={r:0,b:0,g:0},Ji=new ti,nv=new fe;function iv(i,t,e,n,s,r,o){const a=new Bt(0);let l=r===!0?0:1,c,u,h=null,d=0,f=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?e:t).get(v)),v}function _(x){let v=!1;const w=g(x);w===null?p(a,l):w&&w.isColor&&(p(w,1),v=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,v){const w=g(v);w&&(w.isCubeTexture||w.mapping===Oa)?(u===void 0&&(u=new gt(new Xe(1,1,1),new Xn({name:"BackgroundCubeMaterial",uniforms:fr(Jn.backgroundCube.uniforms),vertexShader:Jn.backgroundCube.vertexShader,fragmentShader:Jn.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,C,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Ji.copy(v.backgroundRotation),Ji.x*=-1,Ji.y*=-1,Ji.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Ji.y*=-1,Ji.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(nv.makeRotationFromEuler(Ji)),u.material.toneMapped=se.getTransfer(w.colorSpace)!==pe,(h!==w||d!==w.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=w,d=w.version,f=i.toneMapping),u.layers.enableAll(),x.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new gt(new xs(2,2),new Xn({name:"BackgroundMaterial",uniforms:fr(Jn.background.uniforms),vertexShader:Jn.background.vertexShader,fragmentShader:Jn.background.fragmentShader,side:Gi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=se.getTransfer(w.colorSpace)!==pe,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(h!==w||d!==w.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,h=w,d=w.version,f=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,v){x.getRGB(Uo,pf(i)),n.buffers.color.setClear(Uo.r,Uo.g,Uo.b,v,o)}function S(){u!==void 0&&(u.geometry.dispose(),u.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),l=v,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(a,l)},render:_,addToRenderList:m,dispose:S}}function sv(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(M,L,z,F,V){let q=!1;const k=h(F,z,L);r!==k&&(r=k,c(r.object)),q=f(M,F,z,V),q&&g(M,F,z,V),V!==null&&t.update(V,i.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,v(M,L,z,F),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function h(M,L,z){const F=z.wireframe===!0;let V=n[M.id];V===void 0&&(V={},n[M.id]=V);let q=V[L.id];q===void 0&&(q={},V[L.id]=q);let k=q[F];return k===void 0&&(k=d(l()),q[F]=k),k}function d(M){const L=[],z=[],F=[];for(let V=0;V<e;V++)L[V]=0,z[V]=0,F[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:F,object:M,attributes:{},index:null}}function f(M,L,z,F){const V=r.attributes,q=L.attributes;let k=0;const Y=z.getAttributes();for(const O in Y)if(Y[O].location>=0){const xt=V[O];let wt=q[O];if(wt===void 0&&(O==="instanceMatrix"&&M.instanceMatrix&&(wt=M.instanceMatrix),O==="instanceColor"&&M.instanceColor&&(wt=M.instanceColor)),xt===void 0||xt.attribute!==wt||wt&&xt.data!==wt.data)return!0;k++}return r.attributesNum!==k||r.index!==F}function g(M,L,z,F){const V={},q=L.attributes;let k=0;const Y=z.getAttributes();for(const O in Y)if(Y[O].location>=0){let xt=q[O];xt===void 0&&(O==="instanceMatrix"&&M.instanceMatrix&&(xt=M.instanceMatrix),O==="instanceColor"&&M.instanceColor&&(xt=M.instanceColor));const wt={};wt.attribute=xt,xt&&xt.data&&(wt.data=xt.data),V[O]=wt,k++}r.attributes=V,r.attributesNum=k,r.index=F}function _(){const M=r.newAttributes;for(let L=0,z=M.length;L<z;L++)M[L]=0}function m(M){p(M,0)}function p(M,L){const z=r.newAttributes,F=r.enabledAttributes,V=r.attributeDivisors;z[M]=1,F[M]===0&&(i.enableVertexAttribArray(M),F[M]=1),V[M]!==L&&(i.vertexAttribDivisor(M,L),V[M]=L)}function S(){const M=r.newAttributes,L=r.enabledAttributes;for(let z=0,F=L.length;z<F;z++)L[z]!==M[z]&&(i.disableVertexAttribArray(z),L[z]=0)}function x(M,L,z,F,V,q,k){k===!0?i.vertexAttribIPointer(M,L,z,V,q):i.vertexAttribPointer(M,L,z,F,V,q)}function v(M,L,z,F){_();const V=F.attributes,q=z.getAttributes(),k=L.defaultAttributeValues;for(const Y in q){const O=q[Y];if(O.location>=0){let ot=V[Y];if(ot===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(ot=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(ot=M.instanceColor)),ot!==void 0){const xt=ot.normalized,wt=ot.itemSize,Xt=t.get(ot);if(Xt===void 0)continue;const ae=Xt.buffer,Z=Xt.type,rt=Xt.bytesPerElement,Ct=Z===i.INT||Z===i.UNSIGNED_INT||ot.gpuType===eh;if(ot.isInterleavedBufferAttribute){const ct=ot.data,It=ct.stride,Ht=ot.offset;if(ct.isInstancedInterleavedBuffer){for(let Ot=0;Ot<O.locationSize;Ot++)p(O.location+Ot,ct.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let Ot=0;Ot<O.locationSize;Ot++)m(O.location+Ot);i.bindBuffer(i.ARRAY_BUFFER,ae);for(let Ot=0;Ot<O.locationSize;Ot++)x(O.location+Ot,wt/O.locationSize,Z,xt,It*rt,(Ht+wt/O.locationSize*Ot)*rt,Ct)}else{if(ot.isInstancedBufferAttribute){for(let ct=0;ct<O.locationSize;ct++)p(O.location+ct,ot.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let ct=0;ct<O.locationSize;ct++)m(O.location+ct);i.bindBuffer(i.ARRAY_BUFFER,ae);for(let ct=0;ct<O.locationSize;ct++)x(O.location+ct,wt/O.locationSize,Z,xt,wt*rt,wt/O.locationSize*ct*rt,Ct)}}else if(k!==void 0){const xt=k[Y];if(xt!==void 0)switch(xt.length){case 2:i.vertexAttrib2fv(O.location,xt);break;case 3:i.vertexAttrib3fv(O.location,xt);break;case 4:i.vertexAttrib4fv(O.location,xt);break;default:i.vertexAttrib1fv(O.location,xt)}}}}S()}function w(){I();for(const M in n){const L=n[M];for(const z in L){const F=L[z];for(const V in F)u(F[V].object),delete F[V];delete L[z]}delete n[M]}}function A(M){if(n[M.id]===void 0)return;const L=n[M.id];for(const z in L){const F=L[z];for(const V in F)u(F[V].object),delete F[V];delete L[z]}delete n[M.id]}function C(M){for(const L in n){const z=n[L];if(z[M.id]===void 0)continue;const F=z[M.id];for(const V in F)u(F[V].object),delete F[V];delete z[M.id]}}function I(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:I,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function rv(i,t,e){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),e.update(u,n,h))}function a(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];e.update(f,n,1)}function l(c,u,h,d){if(h===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function ov(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==Tn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const I=C===mr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==Qn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Wn&&!I)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:w,maxSamples:A}}function av(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new os,a=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||s;return s=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const S=r?0:n,x=S*4;let v=p.clippingState||null;l.value=v,v=u(g,d,x,f);for(let w=0;w!==x;++w)v[w]=e[w];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,f,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,S=d.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,v=f;x!==_;++x,v+=4)o.copy(h[x]).applyMatrix4(S,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function lv(i){let t=new WeakMap;function e(o,a){return a===hc?o.mapping=lr:a===uc&&(o.mapping=cr),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===hc||a===uc)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Dm(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const er=4,vu=[.125,.215,.35,.446,.526,.582],fs=20,Tl=new gh,xu=new Bt;let Al=null,Rl=0,Cl=0,Pl=!1;const as=(1+Math.sqrt(5))/2,ks=1/as,yu=[new P(-as,ks,0),new P(as,ks,0),new P(-ks,0,as),new P(ks,0,as),new P(0,as,-ks),new P(0,as,ks),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class Vc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Al=this._renderer.getRenderTarget(),Rl=this._renderer.getActiveCubeFace(),Cl=this._renderer.getActiveMipmapLevel(),Pl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Eu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Su(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Al,Rl,Cl),this._renderer.xr.enabled=Pl,t.scissorTest=!1,No(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===lr||t.mapping===cr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Al=this._renderer.getRenderTarget(),Rl=this._renderer.getActiveCubeFace(),Cl=this._renderer.getActiveMipmapLevel(),Pl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:fn,minFilter:fn,generateMipmaps:!1,type:mr,format:Tn,colorSpace:dr,depthBuffer:!1},s=Mu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Mu(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=cv(r)),this._blurMaterial=hv(r,t,e)}return s}_compileMaterial(t){const e=new gt(this._lodPlanes[0],t);this._renderer.compile(e,Tl)}_sceneToCubeUV(t,e,n,s){const a=new bn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(xu),u.toneMapping=zi,u.autoClear=!1;const f=new Le({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1}),g=new gt(new Xe,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(xu),_=!0);for(let p=0;p<6;p++){const S=p%3;S===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):S===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const x=this._cubeSize;No(s,S*x,p>2?x:0,x,x),u.setRenderTarget(s),_&&u.render(g,a),u.render(t,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=h,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===lr||t.mapping===cr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Eu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Su());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new gt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;No(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Tl)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=yu[(s-r-1)%yu.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new gt(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*fs-1),_=r/g,m=isFinite(r)?1+Math.floor(u*_):fs;m>fs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${fs}`);const p=[];let S=0;for(let C=0;C<fs;++C){const I=C/_,b=Math.exp(-I*I/2);p.push(b),C===0?S+=b:C<m&&(S+=2*b)}for(let C=0;C<p.length;C++)p[C]=p[C]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;const v=this._sizeLods[s],w=3*v*(s>x-er?s-x+er:0),A=4*(this._cubeSize-v);No(e,w,A,3*v,2*v),l.setRenderTarget(e),l.render(h,Tl)}}function cv(i){const t=[],e=[],n=[];let s=i;const r=i-er+1+vu.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-er?l=vu[o-i+er-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,_=3,m=2,p=1,S=new Float32Array(_*g*f),x=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let A=0;A<f;A++){const C=A%3*2/3-1,I=A>2?0:-1,b=[C,I,0,C+2/3,I,0,C+2/3,I+1,0,C,I,0,C+2/3,I+1,0,C,I+1,0];S.set(b,_*g*A),x.set(d,m*g*A);const M=[A,A,A,A,A,A];v.set(M,p*g*A)}const w=new gn;w.setAttribute("position",new pn(S,_)),w.setAttribute("uv",new pn(x,m)),w.setAttribute("faceIndex",new pn(v,p)),t.push(w),s>er&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Mu(i,t,e){const n=new Vi(i,t,e);return n.texture.mapping=Oa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function No(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function hv(i,t,e){const n=new Float32Array(fs),s=new P(0,1,0);return new Xn({name:"SphericalGaussianBlur",defines:{n:fs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function Su(){return new Xn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function Eu(){return new Xn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function _h(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function uv(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===hc||l===uc,u=l===lr||l===cr;if(c||u){let h=t.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Vc(i)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return c&&f&&f.height>0||u&&f&&s(f)?(e===null&&(e=new Vc(i)),h=c?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function dv(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ys("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function fv(i,t,e,n){const s={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,g=h.attributes.position;let _=0;if(f!==null){const S=f.array;_=f.version;for(let x=0,v=S.length;x<v;x+=3){const w=S[x+0],A=S[x+1],C=S[x+2];d.push(w,A,A,C,C,w)}}else if(g!==void 0){const S=g.array;_=g.version;for(let x=0,v=S.length/3-1;x<v;x+=3){const w=x+0,A=x+1,C=x+2;d.push(w,A,A,C,C,w)}}else return;const m=new(af(d)?ff:df)(d,1);m.version=_;const p=r.get(h);p&&t.remove(p),r.set(h,m)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function pv(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),e.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*o,g),e.update(f,n,g))}function u(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function h(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let S=0;S<g;S++)p+=f[S]*_[S];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function mv(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function gv(i,t,e){const n=new WeakMap,s=new he;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let M=function(){I.dispose(),n.delete(a),a.removeEventListener("dispose",M)};var f=M;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],S=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let w=a.attributes.position.count*v,A=1;w>t.maxTextureSize&&(A=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const C=new Float32Array(w*A*4*h),I=new cf(C,w,A,h);I.type=Wn,I.needsUpdate=!0;const b=v*4;for(let L=0;L<h;L++){const z=p[L],F=S[L],V=x[L],q=w*A*4*L;for(let k=0;k<z.count;k++){const Y=k*b;g===!0&&(s.fromBufferAttribute(z,k),C[q+Y+0]=s.x,C[q+Y+1]=s.y,C[q+Y+2]=s.z,C[q+Y+3]=0),_===!0&&(s.fromBufferAttribute(F,k),C[q+Y+4]=s.x,C[q+Y+5]=s.y,C[q+Y+6]=s.z,C[q+Y+7]=0),m===!0&&(s.fromBufferAttribute(V,k),C[q+Y+8]=s.x,C[q+Y+9]=s.y,C[q+Y+10]=s.z,C[q+Y+11]=V.itemSize===4?s.w:1)}}d={count:h,texture:I,size:new lt(w,A)},n.set(a,d),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function _v(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=t.get(l,u);if(s.get(h)!==c&&(t.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}const Cf=new ln,bu=new vf(1,1),Pf=new cf,Lf=new gm,If=new gf,wu=[],Tu=[],Au=new Float32Array(16),Ru=new Float32Array(9),Cu=new Float32Array(4);function Mr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=wu[s];if(r===void 0&&(r=new Float32Array(s),wu[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Fe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Oe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ha(i,t){let e=Tu[t];e===void 0&&(e=new Int32Array(t),Tu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function vv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function xv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;i.uniform2fv(this.addr,t),Oe(e,t)}}function yv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Fe(e,t))return;i.uniform3fv(this.addr,t),Oe(e,t)}}function Mv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;i.uniform4fv(this.addr,t),Oe(e,t)}}function Sv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Fe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Oe(e,t)}else{if(Fe(e,n))return;Cu.set(n),i.uniformMatrix2fv(this.addr,!1,Cu),Oe(e,n)}}function Ev(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Fe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Oe(e,t)}else{if(Fe(e,n))return;Ru.set(n),i.uniformMatrix3fv(this.addr,!1,Ru),Oe(e,n)}}function bv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Fe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Oe(e,t)}else{if(Fe(e,n))return;Au.set(n),i.uniformMatrix4fv(this.addr,!1,Au),Oe(e,n)}}function wv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Tv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;i.uniform2iv(this.addr,t),Oe(e,t)}}function Av(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Fe(e,t))return;i.uniform3iv(this.addr,t),Oe(e,t)}}function Rv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;i.uniform4iv(this.addr,t),Oe(e,t)}}function Cv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Pv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;i.uniform2uiv(this.addr,t),Oe(e,t)}}function Lv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Fe(e,t))return;i.uniform3uiv(this.addr,t),Oe(e,t)}}function Iv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;i.uniform4uiv(this.addr,t),Oe(e,t)}}function Dv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(bu.compareFunction=of,r=bu):r=Cf,e.setTexture2D(t||r,s)}function Uv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Lf,s)}function Nv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||If,s)}function Fv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Pf,s)}function Ov(i){switch(i){case 5126:return vv;case 35664:return xv;case 35665:return yv;case 35666:return Mv;case 35674:return Sv;case 35675:return Ev;case 35676:return bv;case 5124:case 35670:return wv;case 35667:case 35671:return Tv;case 35668:case 35672:return Av;case 35669:case 35673:return Rv;case 5125:return Cv;case 36294:return Pv;case 36295:return Lv;case 36296:return Iv;case 35678:case 36198:case 36298:case 36306:case 35682:return Dv;case 35679:case 36299:case 36307:return Uv;case 35680:case 36300:case 36308:case 36293:return Nv;case 36289:case 36303:case 36311:case 36292:return Fv}}function Bv(i,t){i.uniform1fv(this.addr,t)}function zv(i,t){const e=Mr(t,this.size,2);i.uniform2fv(this.addr,e)}function kv(i,t){const e=Mr(t,this.size,3);i.uniform3fv(this.addr,e)}function Hv(i,t){const e=Mr(t,this.size,4);i.uniform4fv(this.addr,e)}function Gv(i,t){const e=Mr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Vv(i,t){const e=Mr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Wv(i,t){const e=Mr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Xv(i,t){i.uniform1iv(this.addr,t)}function qv(i,t){i.uniform2iv(this.addr,t)}function Yv(i,t){i.uniform3iv(this.addr,t)}function $v(i,t){i.uniform4iv(this.addr,t)}function Kv(i,t){i.uniform1uiv(this.addr,t)}function Zv(i,t){i.uniform2uiv(this.addr,t)}function Jv(i,t){i.uniform3uiv(this.addr,t)}function jv(i,t){i.uniform4uiv(this.addr,t)}function Qv(i,t,e){const n=this.cache,s=t.length,r=Ha(e,s);Fe(n,r)||(i.uniform1iv(this.addr,r),Oe(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Cf,r[o])}function tx(i,t,e){const n=this.cache,s=t.length,r=Ha(e,s);Fe(n,r)||(i.uniform1iv(this.addr,r),Oe(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Lf,r[o])}function ex(i,t,e){const n=this.cache,s=t.length,r=Ha(e,s);Fe(n,r)||(i.uniform1iv(this.addr,r),Oe(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||If,r[o])}function nx(i,t,e){const n=this.cache,s=t.length,r=Ha(e,s);Fe(n,r)||(i.uniform1iv(this.addr,r),Oe(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Pf,r[o])}function ix(i){switch(i){case 5126:return Bv;case 35664:return zv;case 35665:return kv;case 35666:return Hv;case 35674:return Gv;case 35675:return Vv;case 35676:return Wv;case 5124:case 35670:return Xv;case 35667:case 35671:return qv;case 35668:case 35672:return Yv;case 35669:case 35673:return $v;case 5125:return Kv;case 36294:return Zv;case 36295:return Jv;case 36296:return jv;case 35678:case 36198:case 36298:case 36306:case 35682:return Qv;case 35679:case 36299:case 36307:return tx;case 35680:case 36300:case 36308:case 36293:return ex;case 36289:case 36303:case 36311:case 36292:return nx}}class sx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Ov(e.type)}}class rx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ix(e.type)}}class ox{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Ll=/(\w+)(\])?(\[|\.)?/g;function Pu(i,t){i.seq.push(t),i.map[t.id]=t}function ax(i,t,e){const n=i.name,s=n.length;for(Ll.lastIndex=0;;){const r=Ll.exec(n),o=Ll.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Pu(e,c===void 0?new sx(a,i,t):new rx(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new ox(a),Pu(e,h)),e=h}}}class ya{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);ax(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Lu(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const lx=37297;let cx=0;function hx(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Iu=new Yt;function ux(i){se._getMatrix(Iu,se.workingColorSpace,i);const t=`mat3( ${Iu.elements.map(e=>e.toFixed(4))} )`;switch(se.getTransfer(i)){case Ra:return[t,"LinearTransferOETF"];case pe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Du(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+hx(i.getShaderSource(t),o)}else return s}function dx(i,t){const e=ux(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function fx(i,t){let e;switch(t){case Vp:e="Linear";break;case Wp:e="Reinhard";break;case Xp:e="Cineon";break;case Yd:e="ACESFilmic";break;case Yp:e="AgX";break;case $p:e="Neutral";break;case qp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Fo=new P;function px(){se.getLuminanceCoefficients(Fo);const i=Fo.x.toFixed(4),t=Fo.y.toFixed(4),e=Fo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function mx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hr).join(`
`)}function gx(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function _x(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Hr(i){return i!==""}function Uu(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const vx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wc(i){return i.replace(vx,yx)}const xx=new Map;function yx(i,t){let e=Kt[t];if(e===void 0){const n=xx.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Wc(e)}const Mx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fu(i){return i.replace(Mx,Sx)}function Sx(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ou(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Ex(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Xd?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Sp?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===hi&&(t="SHADOWMAP_TYPE_VSM"),t}function bx(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case lr:case cr:t="ENVMAP_TYPE_CUBE";break;case Oa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function wx(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case cr:t="ENVMAP_MODE_REFRACTION";break}return t}function Tx(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case qd:t="ENVMAP_BLENDING_MULTIPLY";break;case Hp:t="ENVMAP_BLENDING_MIX";break;case Gp:t="ENVMAP_BLENDING_ADD";break}return t}function Ax(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Rx(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Ex(e),c=bx(e),u=wx(e),h=Tx(e),d=Ax(e),f=mx(e),g=gx(r),_=s.createProgram();let m,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Hr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Hr).join(`
`),p.length>0&&(p+=`
`)):(m=[Ou(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hr).join(`
`),p=[Ou(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==zi?"#define TONE_MAPPING":"",e.toneMapping!==zi?Kt.tonemapping_pars_fragment:"",e.toneMapping!==zi?fx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,dx("linearToOutputTexel",e.outputColorSpace),px(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Hr).join(`
`)),o=Wc(o),o=Uu(o,e),o=Nu(o,e),a=Wc(a),a=Uu(a,e),a=Nu(a,e),o=Fu(o),a=Fu(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Gh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Gh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=S+m+o,v=S+p+a,w=Lu(s,s.VERTEX_SHADER,x),A=Lu(s,s.FRAGMENT_SHADER,v);s.attachShader(_,w),s.attachShader(_,A),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(L){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(_).trim(),F=s.getShaderInfoLog(w).trim(),V=s.getShaderInfoLog(A).trim();let q=!0,k=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,w,A);else{const Y=Du(s,w,"vertex"),O=Du(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+z+`
`+Y+`
`+O)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(F===""||V==="")&&(k=!1);k&&(L.diagnostics={runnable:q,programLog:z,vertexShader:{log:F,prefix:m},fragmentShader:{log:V,prefix:p}})}s.deleteShader(w),s.deleteShader(A),I=new ya(s,_),b=_x(s,_)}let I;this.getUniforms=function(){return I===void 0&&C(this),I};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,lx)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=cx++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=A,this}let Cx=0;class Px{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Lx(t),e.set(t,n)),n}}class Lx{constructor(t){this.id=Cx++,this.code=t,this.usedTimes=0}}function Ix(i,t,e,n,s,r,o){const a=new hf,l=new Px,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,M,L,z,F){const V=z.fog,q=F.geometry,k=b.isMeshStandardMaterial?z.environment:null,Y=(b.isMeshStandardMaterial?e:t).get(b.envMap||k),O=Y&&Y.mapping===Oa?Y.image.height:null,ot=g[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const xt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,wt=xt!==void 0?xt.length:0;let Xt=0;q.morphAttributes.position!==void 0&&(Xt=1),q.morphAttributes.normal!==void 0&&(Xt=2),q.morphAttributes.color!==void 0&&(Xt=3);let ae,Z,rt,Ct;if(ot){const ue=Jn[ot];ae=ue.vertexShader,Z=ue.fragmentShader}else ae=b.vertexShader,Z=b.fragmentShader,l.update(b),rt=l.getVertexShaderID(b),Ct=l.getFragmentShaderID(b);const ct=i.getRenderTarget(),It=i.state.buffers.depth.getReversed(),Ht=F.isInstancedMesh===!0,Ot=F.isBatchedMesh===!0,te=!!b.map,j=!!b.matcap,st=!!Y,R=!!b.aoMap,Lt=!!b.lightMap,et=!!b.bumpMap,Mt=!!b.normalMap,at=!!b.displacementMap,Ft=!!b.emissiveMap,_t=!!b.metalnessMap,T=!!b.roughnessMap,y=b.anisotropy>0,B=b.clearcoat>0,$=b.dispersion>0,Q=b.iridescence>0,K=b.sheen>0,Pt=b.transmission>0,dt=y&&!!b.anisotropyMap,yt=B&&!!b.clearcoatMap,Jt=B&&!!b.clearcoatNormalMap,it=B&&!!b.clearcoatRoughnessMap,Et=Q&&!!b.iridescenceMap,Nt=Q&&!!b.iridescenceThicknessMap,zt=K&&!!b.sheenColorMap,bt=K&&!!b.sheenRoughnessMap,Qt=!!b.specularMap,$t=!!b.specularColorMap,me=!!b.specularIntensityMap,D=Pt&&!!b.transmissionMap,ft=Pt&&!!b.thicknessMap,W=!!b.gradientMap,J=!!b.alphaMap,vt=b.alphaTest>0,mt=!!b.alphaHash,qt=!!b.extensions;let Se=zi;b.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&(Se=i.toneMapping);const Ye={shaderID:ot,shaderType:b.type,shaderName:b.name,vertexShader:ae,fragmentShader:Z,defines:b.defines,customVertexShaderID:rt,customFragmentShaderID:Ct,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Ot,batchingColor:Ot&&F._colorsTexture!==null,instancing:Ht,instancingColor:Ht&&F.instanceColor!==null,instancingMorph:Ht&&F.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ct===null?i.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:dr,alphaToCoverage:!!b.alphaToCoverage,map:te,matcap:j,envMap:st,envMapMode:st&&Y.mapping,envMapCubeUVHeight:O,aoMap:R,lightMap:Lt,bumpMap:et,normalMap:Mt,displacementMap:d&&at,emissiveMap:Ft,normalMapObjectSpace:Mt&&b.normalMapType===jp,normalMapTangentSpace:Mt&&b.normalMapType===rf,metalnessMap:_t,roughnessMap:T,anisotropy:y,anisotropyMap:dt,clearcoat:B,clearcoatMap:yt,clearcoatNormalMap:Jt,clearcoatRoughnessMap:it,dispersion:$,iridescence:Q,iridescenceMap:Et,iridescenceThicknessMap:Nt,sheen:K,sheenColorMap:zt,sheenRoughnessMap:bt,specularMap:Qt,specularColorMap:$t,specularIntensityMap:me,transmission:Pt,transmissionMap:D,thicknessMap:ft,gradientMap:W,opaque:b.transparent===!1&&b.blending===ir&&b.alphaToCoverage===!1,alphaMap:J,alphaTest:vt,alphaHash:mt,combine:b.combine,mapUv:te&&_(b.map.channel),aoMapUv:R&&_(b.aoMap.channel),lightMapUv:Lt&&_(b.lightMap.channel),bumpMapUv:et&&_(b.bumpMap.channel),normalMapUv:Mt&&_(b.normalMap.channel),displacementMapUv:at&&_(b.displacementMap.channel),emissiveMapUv:Ft&&_(b.emissiveMap.channel),metalnessMapUv:_t&&_(b.metalnessMap.channel),roughnessMapUv:T&&_(b.roughnessMap.channel),anisotropyMapUv:dt&&_(b.anisotropyMap.channel),clearcoatMapUv:yt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Jt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:it&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Nt&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:zt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:bt&&_(b.sheenRoughnessMap.channel),specularMapUv:Qt&&_(b.specularMap.channel),specularColorMapUv:$t&&_(b.specularColorMap.channel),specularIntensityMapUv:me&&_(b.specularIntensityMap.channel),transmissionMapUv:D&&_(b.transmissionMap.channel),thicknessMapUv:ft&&_(b.thicknessMap.channel),alphaMapUv:J&&_(b.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Mt||y),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!q.attributes.uv&&(te||J),fog:!!V,useFog:b.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:It,skinning:F.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:wt,morphTextureStride:Xt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Se,decodeVideoTexture:te&&b.map.isVideoTexture===!0&&se.getTransfer(b.map.colorSpace)===pe,decodeVideoTextureEmissive:Ft&&b.emissiveMap.isVideoTexture===!0&&se.getTransfer(b.emissiveMap.colorSpace)===pe,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Qe,flipSided:b.side===on,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:qt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(qt&&b.extensions.multiDraw===!0||Ot)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Ye.vertexUv1s=c.has(1),Ye.vertexUv2s=c.has(2),Ye.vertexUv3s=c.has(3),c.clear(),Ye}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const L in b.defines)M.push(L),M.push(b.defines[L]);return b.isRawShaderMaterial===!1&&(S(M,b),x(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function S(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),b.push(a.mask)}function v(b){const M=g[b.type];let L;if(M){const z=Jn[M];L=Cm.clone(z.uniforms)}else L=b.uniforms;return L}function w(b,M){let L;for(let z=0,F=u.length;z<F;z++){const V=u[z];if(V.cacheKey===M){L=V,++L.usedTimes;break}}return L===void 0&&(L=new Rx(i,M,b,r),u.push(L)),L}function A(b){if(--b.usedTimes===0){const M=u.indexOf(b);u[M]=u[u.length-1],u.pop(),b.destroy()}}function C(b){l.remove(b)}function I(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:A,releaseShaderCache:C,programs:u,dispose:I}}function Dx(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Ux(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Bu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function zu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(h,d,f,g,_,m){let p=i[t];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},i[t]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),t++,p}function a(h,d,f,g,_,m){const p=o(h,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(h,d,f,g,_,m){const p=o(h,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(h,d){e.length>1&&e.sort(h||Ux),n.length>1&&n.sort(d||Bu),s.length>1&&s.sort(d||Bu)}function u(){for(let h=t,d=i.length;h<d;h++){const f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function Nx(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new zu,i.set(n,[o])):s>=r.length?(o=new zu,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Fx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new Bt};break;case"SpotLight":e={position:new P,direction:new P,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function Ox(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Bx=0;function zx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function kx(i){const t=new Fx,e=Ox(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new fe,o=new fe;function a(c){let u=0,h=0,d=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,S=0,x=0,v=0,w=0,A=0,C=0;c.sort(zx);for(let b=0,M=c.length;b<M;b++){const L=c[b],z=L.color,F=L.intensity,V=L.distance,q=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=z.r*F,h+=z.g*F,d+=z.b*F;else if(L.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(L.sh.coefficients[k],F);C++}else if(L.isDirectionalLight){const k=t.get(L);if(k.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Y=L.shadow,O=e.get(L);O.shadowIntensity=Y.intensity,O.shadowBias=Y.bias,O.shadowNormalBias=Y.normalBias,O.shadowRadius=Y.radius,O.shadowMapSize=Y.mapSize,n.directionalShadow[f]=O,n.directionalShadowMap[f]=q,n.directionalShadowMatrix[f]=L.shadow.matrix,S++}n.directional[f]=k,f++}else if(L.isSpotLight){const k=t.get(L);k.position.setFromMatrixPosition(L.matrixWorld),k.color.copy(z).multiplyScalar(F),k.distance=V,k.coneCos=Math.cos(L.angle),k.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),k.decay=L.decay,n.spot[_]=k;const Y=L.shadow;if(L.map&&(n.spotLightMap[w]=L.map,w++,Y.updateMatrices(L),L.castShadow&&A++),n.spotLightMatrix[_]=Y.matrix,L.castShadow){const O=e.get(L);O.shadowIntensity=Y.intensity,O.shadowBias=Y.bias,O.shadowNormalBias=Y.normalBias,O.shadowRadius=Y.radius,O.shadowMapSize=Y.mapSize,n.spotShadow[_]=O,n.spotShadowMap[_]=q,v++}_++}else if(L.isRectAreaLight){const k=t.get(L);k.color.copy(z).multiplyScalar(F),k.halfWidth.set(L.width*.5,0,0),k.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=k,m++}else if(L.isPointLight){const k=t.get(L);if(k.color.copy(L.color).multiplyScalar(L.intensity),k.distance=L.distance,k.decay=L.decay,L.castShadow){const Y=L.shadow,O=e.get(L);O.shadowIntensity=Y.intensity,O.shadowBias=Y.bias,O.shadowNormalBias=Y.normalBias,O.shadowRadius=Y.radius,O.shadowMapSize=Y.mapSize,O.shadowCameraNear=Y.camera.near,O.shadowCameraFar=Y.camera.far,n.pointShadow[g]=O,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=L.shadow.matrix,x++}n.point[g]=k,g++}else if(L.isHemisphereLight){const k=t.get(L);k.skyColor.copy(L.color).multiplyScalar(F),k.groundColor.copy(L.groundColor).multiplyScalar(F),n.hemi[p]=k,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ut.LTC_FLOAT_1,n.rectAreaLTC2=ut.LTC_FLOAT_2):(n.rectAreaLTC1=ut.LTC_HALF_1,n.rectAreaLTC2=ut.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const I=n.hash;(I.directionalLength!==f||I.pointLength!==g||I.spotLength!==_||I.rectAreaLength!==m||I.hemiLength!==p||I.numDirectionalShadows!==S||I.numPointShadows!==x||I.numSpotShadows!==v||I.numSpotMaps!==w||I.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=v+w-A,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,I.directionalLength=f,I.pointLength=g,I.spotLength=_,I.rectAreaLength=m,I.hemiLength=p,I.numDirectionalShadows=S,I.numPointShadows=x,I.numSpotShadows=v,I.numSpotMaps=w,I.numLightProbes=C,n.version=Bx++)}function l(c,u){let h=0,d=0,f=0,g=0,_=0;const m=u.matrixWorldInverse;for(let p=0,S=c.length;p<S;p++){const x=c[p];if(x.isDirectionalLight){const v=n.directional[h];v.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),h++}else if(x.isSpotLight){const v=n.spot[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const v=n.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function ku(i){const t=new kx(i),e=[],n=[];function s(u){c.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Hx(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new ku(i),t.set(s,[a])):r>=o.length?(a=new ku(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const Gx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Wx(i,t,e){let n=new hh;const s=new lt,r=new lt,o=new he,a=new pg({depthPacking:Jp}),l=new mg,c={},u=e.maxTextureSize,h={[Gi]:on,[on]:Gi,[Qe]:Qe},d=new Xn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new lt},radius:{value:4}},vertexShader:Gx,fragmentShader:Vx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new gn;g.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new gt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xd;let p=this.type;this.render=function(A,C,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const b=i.getRenderTarget(),M=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),z=i.state;z.setBlending(Bi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const F=p!==hi&&this.type===hi,V=p===hi&&this.type!==hi;for(let q=0,k=A.length;q<k;q++){const Y=A[q],O=Y.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);const ot=O.getFrameExtents();if(s.multiply(ot),r.copy(O.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ot.x),s.x=r.x*ot.x,O.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ot.y),s.y=r.y*ot.y,O.mapSize.y=r.y)),O.map===null||F===!0||V===!0){const wt=this.type!==hi?{minFilter:an,magFilter:an}:{};O.map!==null&&O.map.dispose(),O.map=new Vi(s.x,s.y,wt),O.map.texture.name=Y.name+".shadowMap",O.camera.updateProjectionMatrix()}i.setRenderTarget(O.map),i.clear();const xt=O.getViewportCount();for(let wt=0;wt<xt;wt++){const Xt=O.getViewport(wt);o.set(r.x*Xt.x,r.y*Xt.y,r.x*Xt.z,r.y*Xt.w),z.viewport(o),O.updateMatrices(Y,wt),n=O.getFrustum(),v(C,I,O.camera,Y,this.type)}O.isPointLightShadow!==!0&&this.type===hi&&S(O,I),O.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,M,L)};function S(A,C){const I=t.update(_);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Vi(s.x,s.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,I,d,_,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,I,f,_,null)}function x(A,C,I,b){let M=null;const L=I.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(L!==void 0)M=L;else if(M=I.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const z=M.uuid,F=C.uuid;let V=c[z];V===void 0&&(V={},c[z]=V);let q=V[F];q===void 0&&(q=M.clone(),V[F]=q,C.addEventListener("dispose",w)),M=q}if(M.visible=C.visible,M.wireframe=C.wireframe,b===hi?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:h[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,I.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const z=i.properties.get(M);z.light=I}return M}function v(A,C,I,b,M){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===hi)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,A.matrixWorld);const F=t.update(A),V=A.material;if(Array.isArray(V)){const q=F.groups;for(let k=0,Y=q.length;k<Y;k++){const O=q[k],ot=V[O.materialIndex];if(ot&&ot.visible){const xt=x(A,ot,b,M);A.onBeforeShadow(i,A,C,I,F,xt,O),i.renderBufferDirect(I,null,F,xt,A,O),A.onAfterShadow(i,A,C,I,F,xt,O)}}}else if(V.visible){const q=x(A,V,b,M);A.onBeforeShadow(i,A,C,I,F,q,null),i.renderBufferDirect(I,null,F,q,A,null),A.onAfterShadow(i,A,C,I,F,q,null)}}const z=A.children;for(let F=0,V=z.length;F<V;F++)v(z[F],C,I,b,M)}function w(A){A.target.removeEventListener("dispose",w);for(const I in c){const b=c[I],M=A.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const Xx={[ic]:sc,[rc]:lc,[oc]:cc,[ar]:ac,[sc]:ic,[lc]:rc,[cc]:oc,[ac]:ar};function qx(i,t){function e(){let D=!1;const ft=new he;let W=null;const J=new he(0,0,0,0);return{setMask:function(vt){W!==vt&&!D&&(i.colorMask(vt,vt,vt,vt),W=vt)},setLocked:function(vt){D=vt},setClear:function(vt,mt,qt,Se,Ye){Ye===!0&&(vt*=Se,mt*=Se,qt*=Se),ft.set(vt,mt,qt,Se),J.equals(ft)===!1&&(i.clearColor(vt,mt,qt,Se),J.copy(ft))},reset:function(){D=!1,W=null,J.set(-1,0,0,0)}}}function n(){let D=!1,ft=!1,W=null,J=null,vt=null;return{setReversed:function(mt){if(ft!==mt){const qt=t.get("EXT_clip_control");ft?qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.ZERO_TO_ONE_EXT):qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.NEGATIVE_ONE_TO_ONE_EXT);const Se=vt;vt=null,this.setClear(Se)}ft=mt},getReversed:function(){return ft},setTest:function(mt){mt?ct(i.DEPTH_TEST):It(i.DEPTH_TEST)},setMask:function(mt){W!==mt&&!D&&(i.depthMask(mt),W=mt)},setFunc:function(mt){if(ft&&(mt=Xx[mt]),J!==mt){switch(mt){case ic:i.depthFunc(i.NEVER);break;case sc:i.depthFunc(i.ALWAYS);break;case rc:i.depthFunc(i.LESS);break;case ar:i.depthFunc(i.LEQUAL);break;case oc:i.depthFunc(i.EQUAL);break;case ac:i.depthFunc(i.GEQUAL);break;case lc:i.depthFunc(i.GREATER);break;case cc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}J=mt}},setLocked:function(mt){D=mt},setClear:function(mt){vt!==mt&&(ft&&(mt=1-mt),i.clearDepth(mt),vt=mt)},reset:function(){D=!1,W=null,J=null,vt=null,ft=!1}}}function s(){let D=!1,ft=null,W=null,J=null,vt=null,mt=null,qt=null,Se=null,Ye=null;return{setTest:function(ue){D||(ue?ct(i.STENCIL_TEST):It(i.STENCIL_TEST))},setMask:function(ue){ft!==ue&&!D&&(i.stencilMask(ue),ft=ue)},setFunc:function(ue,In,ii){(W!==ue||J!==In||vt!==ii)&&(i.stencilFunc(ue,In,ii),W=ue,J=In,vt=ii)},setOp:function(ue,In,ii){(mt!==ue||qt!==In||Se!==ii)&&(i.stencilOp(ue,In,ii),mt=ue,qt=In,Se=ii)},setLocked:function(ue){D=ue},setClear:function(ue){Ye!==ue&&(i.clearStencil(ue),Ye=ue)},reset:function(){D=!1,ft=null,W=null,J=null,vt=null,mt=null,qt=null,Se=null,Ye=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,S=null,x=null,v=null,w=null,A=null,C=new Bt(0,0,0),I=0,b=!1,M=null,L=null,z=null,F=null,V=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,Y=0;const O=i.getParameter(i.VERSION);O.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(O)[1]),k=Y>=1):O.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),k=Y>=2);let ot=null,xt={};const wt=i.getParameter(i.SCISSOR_BOX),Xt=i.getParameter(i.VIEWPORT),ae=new he().fromArray(wt),Z=new he().fromArray(Xt);function rt(D,ft,W,J){const vt=new Uint8Array(4),mt=i.createTexture();i.bindTexture(D,mt),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let qt=0;qt<W;qt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(ft,0,i.RGBA,1,1,J,0,i.RGBA,i.UNSIGNED_BYTE,vt):i.texImage2D(ft+qt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,vt);return mt}const Ct={};Ct[i.TEXTURE_2D]=rt(i.TEXTURE_2D,i.TEXTURE_2D,1),Ct[i.TEXTURE_CUBE_MAP]=rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ct[i.TEXTURE_2D_ARRAY]=rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ct[i.TEXTURE_3D]=rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ct(i.DEPTH_TEST),o.setFunc(ar),et(!1),Mt(Oh),ct(i.CULL_FACE),R(Bi);function ct(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function It(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function Ht(D,ft){return h[D]!==ft?(i.bindFramebuffer(D,ft),h[D]=ft,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ft),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ft),!0):!1}function Ot(D,ft){let W=f,J=!1;if(D){W=d.get(ft),W===void 0&&(W=[],d.set(ft,W));const vt=D.textures;if(W.length!==vt.length||W[0]!==i.COLOR_ATTACHMENT0){for(let mt=0,qt=vt.length;mt<qt;mt++)W[mt]=i.COLOR_ATTACHMENT0+mt;W.length=vt.length,J=!0}}else W[0]!==i.BACK&&(W[0]=i.BACK,J=!0);J&&i.drawBuffers(W)}function te(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const j={[ds]:i.FUNC_ADD,[bp]:i.FUNC_SUBTRACT,[wp]:i.FUNC_REVERSE_SUBTRACT};j[Tp]=i.MIN,j[Ap]=i.MAX;const st={[Rp]:i.ZERO,[Cp]:i.ONE,[Pp]:i.SRC_COLOR,[ec]:i.SRC_ALPHA,[Fp]:i.SRC_ALPHA_SATURATE,[Up]:i.DST_COLOR,[Ip]:i.DST_ALPHA,[Lp]:i.ONE_MINUS_SRC_COLOR,[nc]:i.ONE_MINUS_SRC_ALPHA,[Np]:i.ONE_MINUS_DST_COLOR,[Dp]:i.ONE_MINUS_DST_ALPHA,[Op]:i.CONSTANT_COLOR,[Bp]:i.ONE_MINUS_CONSTANT_COLOR,[zp]:i.CONSTANT_ALPHA,[kp]:i.ONE_MINUS_CONSTANT_ALPHA};function R(D,ft,W,J,vt,mt,qt,Se,Ye,ue){if(D===Bi){_===!0&&(It(i.BLEND),_=!1);return}if(_===!1&&(ct(i.BLEND),_=!0),D!==Ep){if(D!==m||ue!==b){if((p!==ds||v!==ds)&&(i.blendEquation(i.FUNC_ADD),p=ds,v=ds),ue)switch(D){case ir:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Aa:i.blendFunc(i.ONE,i.ONE);break;case Bh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case zh:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case ir:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Aa:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Bh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case zh:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}S=null,x=null,w=null,A=null,C.set(0,0,0),I=0,m=D,b=ue}return}vt=vt||ft,mt=mt||W,qt=qt||J,(ft!==p||vt!==v)&&(i.blendEquationSeparate(j[ft],j[vt]),p=ft,v=vt),(W!==S||J!==x||mt!==w||qt!==A)&&(i.blendFuncSeparate(st[W],st[J],st[mt],st[qt]),S=W,x=J,w=mt,A=qt),(Se.equals(C)===!1||Ye!==I)&&(i.blendColor(Se.r,Se.g,Se.b,Ye),C.copy(Se),I=Ye),m=D,b=!1}function Lt(D,ft){D.side===Qe?It(i.CULL_FACE):ct(i.CULL_FACE);let W=D.side===on;ft&&(W=!W),et(W),D.blending===ir&&D.transparent===!1?R(Bi):R(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),r.setMask(D.colorWrite);const J=D.stencilWrite;a.setTest(J),J&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Ft(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ct(i.SAMPLE_ALPHA_TO_COVERAGE):It(i.SAMPLE_ALPHA_TO_COVERAGE)}function et(D){M!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),M=D)}function Mt(D){D!==yp?(ct(i.CULL_FACE),D!==L&&(D===Oh?i.cullFace(i.BACK):D===Mp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):It(i.CULL_FACE),L=D}function at(D){D!==z&&(k&&i.lineWidth(D),z=D)}function Ft(D,ft,W){D?(ct(i.POLYGON_OFFSET_FILL),(F!==ft||V!==W)&&(i.polygonOffset(ft,W),F=ft,V=W)):It(i.POLYGON_OFFSET_FILL)}function _t(D){D?ct(i.SCISSOR_TEST):It(i.SCISSOR_TEST)}function T(D){D===void 0&&(D=i.TEXTURE0+q-1),ot!==D&&(i.activeTexture(D),ot=D)}function y(D,ft,W){W===void 0&&(ot===null?W=i.TEXTURE0+q-1:W=ot);let J=xt[W];J===void 0&&(J={type:void 0,texture:void 0},xt[W]=J),(J.type!==D||J.texture!==ft)&&(ot!==W&&(i.activeTexture(W),ot=W),i.bindTexture(D,ft||Ct[D]),J.type=D,J.texture=ft)}function B(){const D=xt[ot];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Q(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function K(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Pt(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function dt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function yt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Jt(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function it(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Et(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Nt(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function zt(D){ae.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),ae.copy(D))}function bt(D){Z.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Z.copy(D))}function Qt(D,ft){let W=c.get(ft);W===void 0&&(W=new WeakMap,c.set(ft,W));let J=W.get(D);J===void 0&&(J=i.getUniformBlockIndex(ft,D.name),W.set(D,J))}function $t(D,ft){const J=c.get(ft).get(D);l.get(ft)!==J&&(i.uniformBlockBinding(ft,J,D.__bindingPointIndex),l.set(ft,J))}function me(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ot=null,xt={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,S=null,x=null,v=null,w=null,A=null,C=new Bt(0,0,0),I=0,b=!1,M=null,L=null,z=null,F=null,V=null,ae.set(0,0,i.canvas.width,i.canvas.height),Z.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ct,disable:It,bindFramebuffer:Ht,drawBuffers:Ot,useProgram:te,setBlending:R,setMaterial:Lt,setFlipSided:et,setCullFace:Mt,setLineWidth:at,setPolygonOffset:Ft,setScissorTest:_t,activeTexture:T,bindTexture:y,unbindTexture:B,compressedTexImage2D:$,compressedTexImage3D:Q,texImage2D:Et,texImage3D:Nt,updateUBOMapping:Qt,uniformBlockBinding:$t,texStorage2D:Jt,texStorage3D:it,texSubImage2D:K,texSubImage3D:Pt,compressedTexSubImage2D:dt,compressedTexSubImage3D:yt,scissor:zt,viewport:bt,reset:me}}function Yx(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new lt,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,y){return f?new OffscreenCanvas(T,y):Pa("canvas")}function _(T,y,B){let $=1;const Q=_t(T);if((Q.width>B||Q.height>B)&&($=B/Math.max(Q.width,Q.height)),$<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const K=Math.floor($*Q.width),Pt=Math.floor($*Q.height);h===void 0&&(h=g(K,Pt));const dt=y?g(K,Pt):h;return dt.width=K,dt.height=Pt,dt.getContext("2d").drawImage(T,0,0,K,Pt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+K+"x"+Pt+")."),dt}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){i.generateMipmap(T)}function S(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(T,y,B,$,Q=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let K=y;if(y===i.RED&&(B===i.FLOAT&&(K=i.R32F),B===i.HALF_FLOAT&&(K=i.R16F),B===i.UNSIGNED_BYTE&&(K=i.R8)),y===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(K=i.R8UI),B===i.UNSIGNED_SHORT&&(K=i.R16UI),B===i.UNSIGNED_INT&&(K=i.R32UI),B===i.BYTE&&(K=i.R8I),B===i.SHORT&&(K=i.R16I),B===i.INT&&(K=i.R32I)),y===i.RG&&(B===i.FLOAT&&(K=i.RG32F),B===i.HALF_FLOAT&&(K=i.RG16F),B===i.UNSIGNED_BYTE&&(K=i.RG8)),y===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(K=i.RG8UI),B===i.UNSIGNED_SHORT&&(K=i.RG16UI),B===i.UNSIGNED_INT&&(K=i.RG32UI),B===i.BYTE&&(K=i.RG8I),B===i.SHORT&&(K=i.RG16I),B===i.INT&&(K=i.RG32I)),y===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(K=i.RGB8UI),B===i.UNSIGNED_SHORT&&(K=i.RGB16UI),B===i.UNSIGNED_INT&&(K=i.RGB32UI),B===i.BYTE&&(K=i.RGB8I),B===i.SHORT&&(K=i.RGB16I),B===i.INT&&(K=i.RGB32I)),y===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),B===i.UNSIGNED_INT&&(K=i.RGBA32UI),B===i.BYTE&&(K=i.RGBA8I),B===i.SHORT&&(K=i.RGBA16I),B===i.INT&&(K=i.RGBA32I)),y===i.RGB&&B===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),y===i.RGBA){const Pt=Q?Ra:se.getTransfer($);B===i.FLOAT&&(K=i.RGBA32F),B===i.HALF_FLOAT&&(K=i.RGBA16F),B===i.UNSIGNED_BYTE&&(K=Pt===pe?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function v(T,y){let B;return T?y===null||y===gs||y===hr?B=i.DEPTH24_STENCIL8:y===Wn?B=i.DEPTH32F_STENCIL8:y===Jr&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===gs||y===hr?B=i.DEPTH_COMPONENT24:y===Wn?B=i.DEPTH_COMPONENT32F:y===Jr&&(B=i.DEPTH_COMPONENT16),B}function w(T,y){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==an&&T.minFilter!==fn?Math.log2(Math.max(y.width,y.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?y.mipmaps.length:1}function A(T){const y=T.target;y.removeEventListener("dispose",A),I(y),y.isVideoTexture&&u.delete(y)}function C(T){const y=T.target;y.removeEventListener("dispose",C),M(y)}function I(T){const y=n.get(T);if(y.__webglInit===void 0)return;const B=T.source,$=d.get(B);if($){const Q=$[y.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&b(T),Object.keys($).length===0&&d.delete(B)}n.remove(T)}function b(T){const y=n.get(T);i.deleteTexture(y.__webglTexture);const B=T.source,$=d.get(B);delete $[y.__cacheKey],o.memory.textures--}function M(T){const y=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(y.__webglFramebuffer[$]))for(let Q=0;Q<y.__webglFramebuffer[$].length;Q++)i.deleteFramebuffer(y.__webglFramebuffer[$][Q]);else i.deleteFramebuffer(y.__webglFramebuffer[$]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[$])}else{if(Array.isArray(y.__webglFramebuffer))for(let $=0;$<y.__webglFramebuffer.length;$++)i.deleteFramebuffer(y.__webglFramebuffer[$]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let $=0;$<y.__webglColorRenderbuffer.length;$++)y.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[$]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const B=T.textures;for(let $=0,Q=B.length;$<Q;$++){const K=n.get(B[$]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),o.memory.textures--),n.remove(B[$])}n.remove(T)}let L=0;function z(){L=0}function F(){const T=L;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),L+=1,T}function V(T){const y=[];return y.push(T.wrapS),y.push(T.wrapT),y.push(T.wrapR||0),y.push(T.magFilter),y.push(T.minFilter),y.push(T.anisotropy),y.push(T.internalFormat),y.push(T.format),y.push(T.type),y.push(T.generateMipmaps),y.push(T.premultiplyAlpha),y.push(T.flipY),y.push(T.unpackAlignment),y.push(T.colorSpace),y.join()}function q(T,y){const B=n.get(T);if(T.isVideoTexture&&at(T),T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){const $=T.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(B,T,y);return}}e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+y)}function k(T,y){const B=n.get(T);if(T.version>0&&B.__version!==T.version){Z(B,T,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+y)}function Y(T,y){const B=n.get(T);if(T.version>0&&B.__version!==T.version){Z(B,T,y);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+y)}function O(T,y){const B=n.get(T);if(T.version>0&&B.__version!==T.version){rt(B,T,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+y)}const ot={[dc]:i.REPEAT,[ps]:i.CLAMP_TO_EDGE,[fc]:i.MIRRORED_REPEAT},xt={[an]:i.NEAREST,[Kp]:i.NEAREST_MIPMAP_NEAREST,[uo]:i.NEAREST_MIPMAP_LINEAR,[fn]:i.LINEAR,[ja]:i.LINEAR_MIPMAP_NEAREST,[ms]:i.LINEAR_MIPMAP_LINEAR},wt={[Qp]:i.NEVER,[rm]:i.ALWAYS,[tm]:i.LESS,[of]:i.LEQUAL,[em]:i.EQUAL,[sm]:i.GEQUAL,[nm]:i.GREATER,[im]:i.NOTEQUAL};function Xt(T,y){if(y.type===Wn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===fn||y.magFilter===ja||y.magFilter===uo||y.magFilter===ms||y.minFilter===fn||y.minFilter===ja||y.minFilter===uo||y.minFilter===ms)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,ot[y.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,ot[y.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,ot[y.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,xt[y.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,xt[y.minFilter]),y.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,wt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===an||y.minFilter!==uo&&y.minFilter!==ms||y.type===Wn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function ae(T,y){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,y.addEventListener("dispose",A));const $=y.source;let Q=d.get($);Q===void 0&&(Q={},d.set($,Q));const K=V(y);if(K!==T.__cacheKey){Q[K]===void 0&&(Q[K]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),Q[K].usedTimes++;const Pt=Q[T.__cacheKey];Pt!==void 0&&(Q[T.__cacheKey].usedTimes--,Pt.usedTimes===0&&b(y)),T.__cacheKey=K,T.__webglTexture=Q[K].texture}return B}function Z(T,y,B){let $=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&($=i.TEXTURE_3D);const Q=ae(T,y),K=y.source;e.bindTexture($,T.__webglTexture,i.TEXTURE0+B);const Pt=n.get(K);if(K.version!==Pt.__version||Q===!0){e.activeTexture(i.TEXTURE0+B);const dt=se.getPrimaries(se.workingColorSpace),yt=y.colorSpace===Ni?null:se.getPrimaries(y.colorSpace),Jt=y.colorSpace===Ni||dt===yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Jt);let it=_(y.image,!1,s.maxTextureSize);it=Ft(y,it);const Et=r.convert(y.format,y.colorSpace),Nt=r.convert(y.type);let zt=x(y.internalFormat,Et,Nt,y.colorSpace,y.isVideoTexture);Xt($,y);let bt;const Qt=y.mipmaps,$t=y.isVideoTexture!==!0,me=Pt.__version===void 0||Q===!0,D=K.dataReady,ft=w(y,it);if(y.isDepthTexture)zt=v(y.format===ur,y.type),me&&($t?e.texStorage2D(i.TEXTURE_2D,1,zt,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,zt,it.width,it.height,0,Et,Nt,null));else if(y.isDataTexture)if(Qt.length>0){$t&&me&&e.texStorage2D(i.TEXTURE_2D,ft,zt,Qt[0].width,Qt[0].height);for(let W=0,J=Qt.length;W<J;W++)bt=Qt[W],$t?D&&e.texSubImage2D(i.TEXTURE_2D,W,0,0,bt.width,bt.height,Et,Nt,bt.data):e.texImage2D(i.TEXTURE_2D,W,zt,bt.width,bt.height,0,Et,Nt,bt.data);y.generateMipmaps=!1}else $t?(me&&e.texStorage2D(i.TEXTURE_2D,ft,zt,it.width,it.height),D&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,it.width,it.height,Et,Nt,it.data)):e.texImage2D(i.TEXTURE_2D,0,zt,it.width,it.height,0,Et,Nt,it.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){$t&&me&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ft,zt,Qt[0].width,Qt[0].height,it.depth);for(let W=0,J=Qt.length;W<J;W++)if(bt=Qt[W],y.format!==Tn)if(Et!==null)if($t){if(D)if(y.layerUpdates.size>0){const vt=_u(bt.width,bt.height,y.format,y.type);for(const mt of y.layerUpdates){const qt=bt.data.subarray(mt*vt/bt.data.BYTES_PER_ELEMENT,(mt+1)*vt/bt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,W,0,0,mt,bt.width,bt.height,1,Et,qt)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,W,0,0,0,bt.width,bt.height,it.depth,Et,bt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,W,zt,bt.width,bt.height,it.depth,0,bt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else $t?D&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,W,0,0,0,bt.width,bt.height,it.depth,Et,Nt,bt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,W,zt,bt.width,bt.height,it.depth,0,Et,Nt,bt.data)}else{$t&&me&&e.texStorage2D(i.TEXTURE_2D,ft,zt,Qt[0].width,Qt[0].height);for(let W=0,J=Qt.length;W<J;W++)bt=Qt[W],y.format!==Tn?Et!==null?$t?D&&e.compressedTexSubImage2D(i.TEXTURE_2D,W,0,0,bt.width,bt.height,Et,bt.data):e.compressedTexImage2D(i.TEXTURE_2D,W,zt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):$t?D&&e.texSubImage2D(i.TEXTURE_2D,W,0,0,bt.width,bt.height,Et,Nt,bt.data):e.texImage2D(i.TEXTURE_2D,W,zt,bt.width,bt.height,0,Et,Nt,bt.data)}else if(y.isDataArrayTexture)if($t){if(me&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ft,zt,it.width,it.height,it.depth),D)if(y.layerUpdates.size>0){const W=_u(it.width,it.height,y.format,y.type);for(const J of y.layerUpdates){const vt=it.data.subarray(J*W/it.data.BYTES_PER_ELEMENT,(J+1)*W/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,J,it.width,it.height,1,Et,Nt,vt)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,Et,Nt,it.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,zt,it.width,it.height,it.depth,0,Et,Nt,it.data);else if(y.isData3DTexture)$t?(me&&e.texStorage3D(i.TEXTURE_3D,ft,zt,it.width,it.height,it.depth),D&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,Et,Nt,it.data)):e.texImage3D(i.TEXTURE_3D,0,zt,it.width,it.height,it.depth,0,Et,Nt,it.data);else if(y.isFramebufferTexture){if(me)if($t)e.texStorage2D(i.TEXTURE_2D,ft,zt,it.width,it.height);else{let W=it.width,J=it.height;for(let vt=0;vt<ft;vt++)e.texImage2D(i.TEXTURE_2D,vt,zt,W,J,0,Et,Nt,null),W>>=1,J>>=1}}else if(Qt.length>0){if($t&&me){const W=_t(Qt[0]);e.texStorage2D(i.TEXTURE_2D,ft,zt,W.width,W.height)}for(let W=0,J=Qt.length;W<J;W++)bt=Qt[W],$t?D&&e.texSubImage2D(i.TEXTURE_2D,W,0,0,Et,Nt,bt):e.texImage2D(i.TEXTURE_2D,W,zt,Et,Nt,bt);y.generateMipmaps=!1}else if($t){if(me){const W=_t(it);e.texStorage2D(i.TEXTURE_2D,ft,zt,W.width,W.height)}D&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Et,Nt,it)}else e.texImage2D(i.TEXTURE_2D,0,zt,Et,Nt,it);m(y)&&p($),Pt.__version=K.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function rt(T,y,B){if(y.image.length!==6)return;const $=ae(T,y),Q=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+B);const K=n.get(Q);if(Q.version!==K.__version||$===!0){e.activeTexture(i.TEXTURE0+B);const Pt=se.getPrimaries(se.workingColorSpace),dt=y.colorSpace===Ni?null:se.getPrimaries(y.colorSpace),yt=y.colorSpace===Ni||Pt===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const Jt=y.isCompressedTexture||y.image[0].isCompressedTexture,it=y.image[0]&&y.image[0].isDataTexture,Et=[];for(let J=0;J<6;J++)!Jt&&!it?Et[J]=_(y.image[J],!0,s.maxCubemapSize):Et[J]=it?y.image[J].image:y.image[J],Et[J]=Ft(y,Et[J]);const Nt=Et[0],zt=r.convert(y.format,y.colorSpace),bt=r.convert(y.type),Qt=x(y.internalFormat,zt,bt,y.colorSpace),$t=y.isVideoTexture!==!0,me=K.__version===void 0||$===!0,D=Q.dataReady;let ft=w(y,Nt);Xt(i.TEXTURE_CUBE_MAP,y);let W;if(Jt){$t&&me&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ft,Qt,Nt.width,Nt.height);for(let J=0;J<6;J++){W=Et[J].mipmaps;for(let vt=0;vt<W.length;vt++){const mt=W[vt];y.format!==Tn?zt!==null?$t?D&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,0,0,mt.width,mt.height,zt,mt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,Qt,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$t?D&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,0,0,mt.width,mt.height,zt,bt,mt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,Qt,mt.width,mt.height,0,zt,bt,mt.data)}}}else{if(W=y.mipmaps,$t&&me){W.length>0&&ft++;const J=_t(Et[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ft,Qt,J.width,J.height)}for(let J=0;J<6;J++)if(it){$t?D&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Et[J].width,Et[J].height,zt,bt,Et[J].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Qt,Et[J].width,Et[J].height,0,zt,bt,Et[J].data);for(let vt=0;vt<W.length;vt++){const qt=W[vt].image[J].image;$t?D&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,0,0,qt.width,qt.height,zt,bt,qt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,Qt,qt.width,qt.height,0,zt,bt,qt.data)}}else{$t?D&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,zt,bt,Et[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Qt,zt,bt,Et[J]);for(let vt=0;vt<W.length;vt++){const mt=W[vt];$t?D&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,0,0,zt,bt,mt.image[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,Qt,zt,bt,mt.image[J])}}}m(y)&&p(i.TEXTURE_CUBE_MAP),K.__version=Q.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function Ct(T,y,B,$,Q,K){const Pt=r.convert(B.format,B.colorSpace),dt=r.convert(B.type),yt=x(B.internalFormat,Pt,dt,B.colorSpace),Jt=n.get(y),it=n.get(B);if(it.__renderTarget=y,!Jt.__hasExternalTextures){const Et=Math.max(1,y.width>>K),Nt=Math.max(1,y.height>>K);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?e.texImage3D(Q,K,yt,Et,Nt,y.depth,0,Pt,dt,null):e.texImage2D(Q,K,yt,Et,Nt,0,Pt,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),Mt(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Q,it.__webglTexture,0,et(y)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,Q,it.__webglTexture,K),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ct(T,y,B){if(i.bindRenderbuffer(i.RENDERBUFFER,T),y.depthBuffer){const $=y.depthTexture,Q=$&&$.isDepthTexture?$.type:null,K=v(y.stencilBuffer,Q),Pt=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=et(y);Mt(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,dt,K,y.width,y.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,dt,K,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,K,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Pt,i.RENDERBUFFER,T)}else{const $=y.textures;for(let Q=0;Q<$.length;Q++){const K=$[Q],Pt=r.convert(K.format,K.colorSpace),dt=r.convert(K.type),yt=x(K.internalFormat,Pt,dt,K.colorSpace),Jt=et(y);B&&Mt(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Jt,yt,y.width,y.height):Mt(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Jt,yt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,yt,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function It(T,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(y.depthTexture);$.__renderTarget=y,(!$.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),q(y.depthTexture,0);const Q=$.__webglTexture,K=et(y);if(y.depthTexture.format===sr)Mt(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(y.depthTexture.format===ur)Mt(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Ht(T){const y=n.get(T),B=T.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==T.depthTexture){const $=T.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),$){const Q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,$.removeEventListener("dispose",Q)};$.addEventListener("dispose",Q),y.__depthDisposeCallback=Q}y.__boundDepthTexture=$}if(T.depthTexture&&!y.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");It(y.__webglFramebuffer,T)}else if(B){y.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[$]),y.__webglDepthbuffer[$]===void 0)y.__webglDepthbuffer[$]=i.createRenderbuffer(),ct(y.__webglDepthbuffer[$],T,!1);else{const Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=y.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,K)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),ct(y.__webglDepthbuffer,T,!1);else{const $=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,Q)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(T,y,B){const $=n.get(T);y!==void 0&&Ct($.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Ht(T)}function te(T){const y=T.texture,B=n.get(T),$=n.get(y);T.addEventListener("dispose",C);const Q=T.textures,K=T.isWebGLCubeRenderTarget===!0,Pt=Q.length>1;if(Pt||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=y.version,o.memory.textures++),K){B.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer[dt]=[];for(let yt=0;yt<y.mipmaps.length;yt++)B.__webglFramebuffer[dt][yt]=i.createFramebuffer()}else B.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer=[];for(let dt=0;dt<y.mipmaps.length;dt++)B.__webglFramebuffer[dt]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(Pt)for(let dt=0,yt=Q.length;dt<yt;dt++){const Jt=n.get(Q[dt]);Jt.__webglTexture===void 0&&(Jt.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&Mt(T)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let dt=0;dt<Q.length;dt++){const yt=Q[dt];B.__webglColorRenderbuffer[dt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[dt]);const Jt=r.convert(yt.format,yt.colorSpace),it=r.convert(yt.type),Et=x(yt.internalFormat,Jt,it,yt.colorSpace,T.isXRRenderTarget===!0),Nt=et(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,Et,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.RENDERBUFFER,B.__webglColorRenderbuffer[dt])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),ct(B.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Xt(i.TEXTURE_CUBE_MAP,y);for(let dt=0;dt<6;dt++)if(y.mipmaps&&y.mipmaps.length>0)for(let yt=0;yt<y.mipmaps.length;yt++)Ct(B.__webglFramebuffer[dt][yt],T,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,yt);else Ct(B.__webglFramebuffer[dt],T,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);m(y)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Pt){for(let dt=0,yt=Q.length;dt<yt;dt++){const Jt=Q[dt],it=n.get(Jt);e.bindTexture(i.TEXTURE_2D,it.__webglTexture),Xt(i.TEXTURE_2D,Jt),Ct(B.__webglFramebuffer,T,Jt,i.COLOR_ATTACHMENT0+dt,i.TEXTURE_2D,0),m(Jt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(dt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(dt,$.__webglTexture),Xt(dt,y),y.mipmaps&&y.mipmaps.length>0)for(let yt=0;yt<y.mipmaps.length;yt++)Ct(B.__webglFramebuffer[yt],T,y,i.COLOR_ATTACHMENT0,dt,yt);else Ct(B.__webglFramebuffer,T,y,i.COLOR_ATTACHMENT0,dt,0);m(y)&&p(dt),e.unbindTexture()}T.depthBuffer&&Ht(T)}function j(T){const y=T.textures;for(let B=0,$=y.length;B<$;B++){const Q=y[B];if(m(Q)){const K=S(T),Pt=n.get(Q).__webglTexture;e.bindTexture(K,Pt),p(K),e.unbindTexture()}}}const st=[],R=[];function Lt(T){if(T.samples>0){if(Mt(T)===!1){const y=T.textures,B=T.width,$=T.height;let Q=i.COLOR_BUFFER_BIT;const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Pt=n.get(T),dt=y.length>1;if(dt)for(let yt=0;yt<y.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pt.__webglFramebuffer);for(let yt=0;yt<y.length;yt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),dt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Pt.__webglColorRenderbuffer[yt]);const Jt=n.get(y[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Jt,0)}i.blitFramebuffer(0,0,B,$,0,0,B,$,Q,i.NEAREST),l===!0&&(st.length=0,R.length=0,st.push(i.COLOR_ATTACHMENT0+yt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(st.push(K),R.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,R)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),dt)for(let yt=0;yt<y.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,Pt.__webglColorRenderbuffer[yt]);const Jt=n.get(y[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,Jt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const y=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function et(T){return Math.min(s.maxSamples,T.samples)}function Mt(T){const y=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function at(T){const y=o.render.frame;u.get(T)!==y&&(u.set(T,y),T.update())}function Ft(T,y){const B=T.colorSpace,$=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==dr&&B!==Ni&&(se.getTransfer(B)===pe?($!==Tn||Q!==Qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),y}function _t(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=z,this.setTexture2D=q,this.setTexture2DArray=k,this.setTexture3D=Y,this.setTextureCube=O,this.rebindTextures=Ot,this.setupRenderTarget=te,this.updateRenderTargetMipmap=j,this.updateMultisampleRenderTarget=Lt,this.setupDepthRenderbuffer=Ht,this.setupFrameBufferTexture=Ct,this.useMultisampledRTT=Mt}function $x(i,t){function e(n,s=Ni){let r;const o=se.getTransfer(s);if(n===Qn)return i.UNSIGNED_BYTE;if(n===nh)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ih)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Jd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Kd)return i.BYTE;if(n===Zd)return i.SHORT;if(n===Jr)return i.UNSIGNED_SHORT;if(n===eh)return i.INT;if(n===gs)return i.UNSIGNED_INT;if(n===Wn)return i.FLOAT;if(n===mr)return i.HALF_FLOAT;if(n===jd)return i.ALPHA;if(n===Qd)return i.RGB;if(n===Tn)return i.RGBA;if(n===tf)return i.LUMINANCE;if(n===ef)return i.LUMINANCE_ALPHA;if(n===sr)return i.DEPTH_COMPONENT;if(n===ur)return i.DEPTH_STENCIL;if(n===sh)return i.RED;if(n===rh)return i.RED_INTEGER;if(n===nf)return i.RG;if(n===oh)return i.RG_INTEGER;if(n===ah)return i.RGBA_INTEGER;if(n===ma||n===ga||n===_a||n===va)if(o===pe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ma)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===_a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ma)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ga)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===_a)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===va)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===pc||n===mc||n===gc||n===_c)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===pc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===mc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===gc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===_c)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===vc||n===xc||n===yc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===vc||n===xc)return o===pe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===yc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Mc||n===Sc||n===Ec||n===bc||n===wc||n===Tc||n===Ac||n===Rc||n===Cc||n===Pc||n===Lc||n===Ic||n===Dc||n===Uc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Mc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Sc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ec)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===bc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===wc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Tc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ac)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Rc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Cc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Pc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Lc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ic)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Dc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Uc)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===xa||n===Nc||n===Fc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===xa)return o===pe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Nc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Fc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sf||n===Oc||n===Bc||n===zc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===xa)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Oc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Bc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===zc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===hr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Kx={type:"move"};class Il{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ne,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ne,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ne,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Kx)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ne;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Zx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Jx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class jx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new ln,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Xn({vertexShader:Zx,fragmentShader:Jx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new gt(new xs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Qx extends gr{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null;const _=new jx,m=e.getContextAttributes();let p=null,S=null;const x=[],v=[],w=new lt;let A=null;const C=new bn;C.viewport=new he;const I=new bn;I.viewport=new he;const b=[C,I],M=new yg;let L=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let rt=x[Z];return rt===void 0&&(rt=new Il,x[Z]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(Z){let rt=x[Z];return rt===void 0&&(rt=new Il,x[Z]=rt),rt.getGripSpace()},this.getHand=function(Z){let rt=x[Z];return rt===void 0&&(rt=new Il,x[Z]=rt),rt.getHandSpace()};function F(Z){const rt=v.indexOf(Z.inputSource);if(rt===-1)return;const Ct=x[rt];Ct!==void 0&&(Ct.update(Z.inputSource,Z.frame,c||o),Ct.dispatchEvent({type:Z.type,data:Z.inputSource}))}function V(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",q);for(let Z=0;Z<x.length;Z++){const rt=v[Z];rt!==null&&(v[Z]=null,x[Z].disconnect(rt))}L=null,z=null,_.reset(),t.setRenderTarget(p),f=null,d=null,h=null,s=null,S=null,ae.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",V),s.addEventListener("inputsourceschange",q),m.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(w),s.renderState.layers===void 0){const rt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,rt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new Vi(f.framebufferWidth,f.framebufferHeight,{format:Tn,type:Qn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let rt=null,Ct=null,ct=null;m.depth&&(ct=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,rt=m.stencil?ur:sr,Ct=m.stencil?hr:gs);const It={colorFormat:e.RGBA8,depthFormat:ct,scaleFactor:r};h=new XRWebGLBinding(s,e),d=h.createProjectionLayer(It),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),S=new Vi(d.textureWidth,d.textureHeight,{format:Tn,type:Qn,depthTexture:new vf(d.textureWidth,d.textureHeight,Ct,void 0,void 0,void 0,void 0,void 0,void 0,rt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),ae.setContext(s),ae.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function q(Z){for(let rt=0;rt<Z.removed.length;rt++){const Ct=Z.removed[rt],ct=v.indexOf(Ct);ct>=0&&(v[ct]=null,x[ct].disconnect(Ct))}for(let rt=0;rt<Z.added.length;rt++){const Ct=Z.added[rt];let ct=v.indexOf(Ct);if(ct===-1){for(let Ht=0;Ht<x.length;Ht++)if(Ht>=v.length){v.push(Ct),ct=Ht;break}else if(v[Ht]===null){v[Ht]=Ct,ct=Ht;break}if(ct===-1)break}const It=x[ct];It&&It.connect(Ct)}}const k=new P,Y=new P;function O(Z,rt,Ct){k.setFromMatrixPosition(rt.matrixWorld),Y.setFromMatrixPosition(Ct.matrixWorld);const ct=k.distanceTo(Y),It=rt.projectionMatrix.elements,Ht=Ct.projectionMatrix.elements,Ot=It[14]/(It[10]-1),te=It[14]/(It[10]+1),j=(It[9]+1)/It[5],st=(It[9]-1)/It[5],R=(It[8]-1)/It[0],Lt=(Ht[8]+1)/Ht[0],et=Ot*R,Mt=Ot*Lt,at=ct/(-R+Lt),Ft=at*-R;if(rt.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Ft),Z.translateZ(at),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),It[10]===-1)Z.projectionMatrix.copy(rt.projectionMatrix),Z.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const _t=Ot+at,T=te+at,y=et-Ft,B=Mt+(ct-Ft),$=j*te/T*_t,Q=st*te/T*_t;Z.projectionMatrix.makePerspective(y,B,$,Q,_t,T),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ot(Z,rt){rt===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(rt.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let rt=Z.near,Ct=Z.far;_.texture!==null&&(_.depthNear>0&&(rt=_.depthNear),_.depthFar>0&&(Ct=_.depthFar)),M.near=I.near=C.near=rt,M.far=I.far=C.far=Ct,(L!==M.near||z!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),L=M.near,z=M.far),C.layers.mask=Z.layers.mask|2,I.layers.mask=Z.layers.mask|4,M.layers.mask=C.layers.mask|I.layers.mask;const ct=Z.parent,It=M.cameras;ot(M,ct);for(let Ht=0;Ht<It.length;Ht++)ot(It[Ht],ct);It.length===2?O(M,C,I):M.projectionMatrix.copy(C.projectionMatrix),xt(Z,M,ct)};function xt(Z,rt,Ct){Ct===null?Z.matrix.copy(rt.matrixWorld):(Z.matrix.copy(Ct.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(rt.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(rt.projectionMatrix),Z.projectionMatrixInverse.copy(rt.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=kc*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let wt=null;function Xt(Z,rt){if(u=rt.getViewerPose(c||o),g=rt,u!==null){const Ct=u.views;f!==null&&(t.setRenderTargetFramebuffer(S,f.framebuffer),t.setRenderTarget(S));let ct=!1;Ct.length!==M.cameras.length&&(M.cameras.length=0,ct=!0);for(let Ht=0;Ht<Ct.length;Ht++){const Ot=Ct[Ht];let te=null;if(f!==null)te=f.getViewport(Ot);else{const st=h.getViewSubImage(d,Ot);te=st.viewport,Ht===0&&(t.setRenderTargetTextures(S,st.colorTexture,d.ignoreDepthValues?void 0:st.depthStencilTexture),t.setRenderTarget(S))}let j=b[Ht];j===void 0&&(j=new bn,j.layers.enable(Ht),j.viewport=new he,b[Ht]=j),j.matrix.fromArray(Ot.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(Ot.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(te.x,te.y,te.width,te.height),Ht===0&&(M.matrix.copy(j.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ct===!0&&M.cameras.push(j)}const It=s.enabledFeatures;if(It&&It.includes("depth-sensing")){const Ht=h.getDepthInformation(Ct[0]);Ht&&Ht.isValid&&Ht.texture&&_.init(t,Ht,s.renderState)}}for(let Ct=0;Ct<x.length;Ct++){const ct=v[Ct],It=x[Ct];ct!==null&&It!==void 0&&It.update(ct,rt,c||o)}wt&&wt(Z,rt),rt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:rt}),g=null}const ae=new Rf;ae.setAnimationLoop(Xt),this.setAnimationLoop=function(Z){wt=Z},this.dispose=function(){}}}const ji=new ti,ty=new fe;function ey(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,pf(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,S,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),h(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,S,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===on&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===on&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=t.get(p),x=S.envMap,v=S.envMapRotation;x&&(m.envMap.value=x,ji.copy(v),ji.x*=-1,ji.y*=-1,ji.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ji.y*=-1,ji.z*=-1),m.envMapRotation.value.setFromMatrix4(ty.makeRotationFromEuler(ji)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===on&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const S=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ny(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,x){const v=x.program;n.uniformBlockBinding(S,v)}function c(S,x){let v=s[S.id];v===void 0&&(g(S),v=u(S),s[S.id]=v,S.addEventListener("dispose",m));const w=x.program;n.updateUBOMapping(S,w);const A=t.render.frame;r[S.id]!==A&&(d(S),r[S.id]=A)}function u(S){const x=h();S.__bindingPointIndex=x;const v=i.createBuffer(),w=S.__size,A=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,w,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,v),v}function h(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const x=s[S.id],v=S.uniforms,w=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let A=0,C=v.length;A<C;A++){const I=Array.isArray(v[A])?v[A]:[v[A]];for(let b=0,M=I.length;b<M;b++){const L=I[b];if(f(L,A,b,w)===!0){const z=L.__offset,F=Array.isArray(L.value)?L.value:[L.value];let V=0;for(let q=0;q<F.length;q++){const k=F[q],Y=_(k);typeof k=="number"||typeof k=="boolean"?(L.__data[0]=k,i.bufferSubData(i.UNIFORM_BUFFER,z+V,L.__data)):k.isMatrix3?(L.__data[0]=k.elements[0],L.__data[1]=k.elements[1],L.__data[2]=k.elements[2],L.__data[3]=0,L.__data[4]=k.elements[3],L.__data[5]=k.elements[4],L.__data[6]=k.elements[5],L.__data[7]=0,L.__data[8]=k.elements[6],L.__data[9]=k.elements[7],L.__data[10]=k.elements[8],L.__data[11]=0):(k.toArray(L.__data,V),V+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(S,x,v,w){const A=S.value,C=x+"_"+v;if(w[C]===void 0)return typeof A=="number"||typeof A=="boolean"?w[C]=A:w[C]=A.clone(),!0;{const I=w[C];if(typeof A=="number"||typeof A=="boolean"){if(I!==A)return w[C]=A,!0}else if(I.equals(A)===!1)return I.copy(A),!0}return!1}function g(S){const x=S.uniforms;let v=0;const w=16;for(let C=0,I=x.length;C<I;C++){const b=Array.isArray(x[C])?x[C]:[x[C]];for(let M=0,L=b.length;M<L;M++){const z=b[M],F=Array.isArray(z.value)?z.value:[z.value];for(let V=0,q=F.length;V<q;V++){const k=F[V],Y=_(k),O=v%w,ot=O%Y.boundary,xt=O+ot;v+=ot,xt!==0&&w-xt<Y.storage&&(v+=w-xt),z.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=v,v+=Y.storage}}}const A=v%w;return A>0&&(v+=w-A),S.__size=v,S.__cache={},this}function _(S){const x={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(x.boundary=4,x.storage=4):S.isVector2?(x.boundary=8,x.storage=8):S.isVector3||S.isColor?(x.boundary=16,x.storage=12):S.isVector4?(x.boundary=16,x.storage=16):S.isMatrix3?(x.boundary=48,x.storage=48):S.isMatrix4?(x.boundary=64,x.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),x}function m(S){const x=S.target;x.removeEventListener("dispose",m);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const S in s)i.deleteBuffer(s[S]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}class iy{constructor(t={}){const{canvas:e=am(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const S=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=En,this.toneMapping=zi,this.toneMappingExposure=1;const v=this;let w=!1,A=0,C=0,I=null,b=-1,M=null;const L=new he,z=new he;let F=null;const V=new Bt(0);let q=0,k=e.width,Y=e.height,O=1,ot=null,xt=null;const wt=new he(0,0,k,Y),Xt=new he(0,0,k,Y);let ae=!1;const Z=new hh;let rt=!1,Ct=!1;const ct=new fe,It=new fe,Ht=new P,Ot=new he,te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let j=!1;function st(){return I===null?O:1}let R=n;function Lt(E,U){return e.getContext(E,U)}try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${th}`),e.addEventListener("webglcontextlost",J,!1),e.addEventListener("webglcontextrestored",vt,!1),e.addEventListener("webglcontextcreationerror",mt,!1),R===null){const U="webgl2";if(R=Lt(U,E),R===null)throw Lt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let et,Mt,at,Ft,_t,T,y,B,$,Q,K,Pt,dt,yt,Jt,it,Et,Nt,zt,bt,Qt,$t,me,D;function ft(){et=new dv(R),et.init(),$t=new $x(R,et),Mt=new ov(R,et,t,$t),at=new qx(R,et),Mt.reverseDepthBuffer&&d&&at.buffers.depth.setReversed(!0),Ft=new mv(R),_t=new Dx,T=new Yx(R,et,at,_t,Mt,$t,Ft),y=new lv(v),B=new uv(v),$=new Sg(R),me=new sv(R,$),Q=new fv(R,$,Ft,me),K=new _v(R,Q,$,Ft),zt=new gv(R,Mt,T),it=new av(_t),Pt=new Ix(v,y,B,et,Mt,me,it),dt=new ey(v,_t),yt=new Nx,Jt=new Hx(et),Nt=new iv(v,y,B,at,K,f,l),Et=new Wx(v,K,Mt),D=new ny(R,Ft,Mt,at),bt=new rv(R,et,Ft),Qt=new pv(R,et,Ft),Ft.programs=Pt.programs,v.capabilities=Mt,v.extensions=et,v.properties=_t,v.renderLists=yt,v.shadowMap=Et,v.state=at,v.info=Ft}ft();const W=new Qx(v,R);this.xr=W,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const E=et.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=et.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(E){E!==void 0&&(O=E,this.setSize(k,Y,!1))},this.getSize=function(E){return E.set(k,Y)},this.setSize=function(E,U,H=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=E,Y=U,e.width=Math.floor(E*O),e.height=Math.floor(U*O),H===!0&&(e.style.width=E+"px",e.style.height=U+"px"),this.setViewport(0,0,E,U)},this.getDrawingBufferSize=function(E){return E.set(k*O,Y*O).floor()},this.setDrawingBufferSize=function(E,U,H){k=E,Y=U,O=H,e.width=Math.floor(E*H),e.height=Math.floor(U*H),this.setViewport(0,0,E,U)},this.getCurrentViewport=function(E){return E.copy(L)},this.getViewport=function(E){return E.copy(wt)},this.setViewport=function(E,U,H,G){E.isVector4?wt.set(E.x,E.y,E.z,E.w):wt.set(E,U,H,G),at.viewport(L.copy(wt).multiplyScalar(O).round())},this.getScissor=function(E){return E.copy(Xt)},this.setScissor=function(E,U,H,G){E.isVector4?Xt.set(E.x,E.y,E.z,E.w):Xt.set(E,U,H,G),at.scissor(z.copy(Xt).multiplyScalar(O).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(E){at.setScissorTest(ae=E)},this.setOpaqueSort=function(E){ot=E},this.setTransparentSort=function(E){xt=E},this.getClearColor=function(E){return E.copy(Nt.getClearColor())},this.setClearColor=function(){Nt.setClearColor.apply(Nt,arguments)},this.getClearAlpha=function(){return Nt.getClearAlpha()},this.setClearAlpha=function(){Nt.setClearAlpha.apply(Nt,arguments)},this.clear=function(E=!0,U=!0,H=!0){let G=0;if(E){let N=!1;if(I!==null){const nt=I.texture.format;N=nt===ah||nt===oh||nt===rh}if(N){const nt=I.texture.type,pt=nt===Qn||nt===gs||nt===Jr||nt===hr||nt===nh||nt===ih,St=Nt.getClearColor(),At=Nt.getClearAlpha(),kt=St.r,Gt=St.g,Dt=St.b;pt?(g[0]=kt,g[1]=Gt,g[2]=Dt,g[3]=At,R.clearBufferuiv(R.COLOR,0,g)):(_[0]=kt,_[1]=Gt,_[2]=Dt,_[3]=At,R.clearBufferiv(R.COLOR,0,_))}else G|=R.COLOR_BUFFER_BIT}U&&(G|=R.DEPTH_BUFFER_BIT),H&&(G|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",J,!1),e.removeEventListener("webglcontextrestored",vt,!1),e.removeEventListener("webglcontextcreationerror",mt,!1),Nt.dispose(),yt.dispose(),Jt.dispose(),_t.dispose(),y.dispose(),B.dispose(),K.dispose(),me.dispose(),D.dispose(),Pt.dispose(),W.dispose(),W.removeEventListener("sessionstart",xh),W.removeEventListener("sessionend",yh),Wi.stop()};function J(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function vt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const E=Ft.autoReset,U=Et.enabled,H=Et.autoUpdate,G=Et.needsUpdate,N=Et.type;ft(),Ft.autoReset=E,Et.enabled=U,Et.autoUpdate=H,Et.needsUpdate=G,Et.type=N}function mt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function qt(E){const U=E.target;U.removeEventListener("dispose",qt),Se(U)}function Se(E){Ye(E),_t.remove(E)}function Ye(E){const U=_t.get(E).programs;U!==void 0&&(U.forEach(function(H){Pt.releaseProgram(H)}),E.isShaderMaterial&&Pt.releaseShaderCache(E))}this.renderBufferDirect=function(E,U,H,G,N,nt){U===null&&(U=te);const pt=N.isMesh&&N.matrixWorld.determinant()<0,St=Bf(E,U,H,G,N);at.setMaterial(G,pt);let At=H.index,kt=1;if(G.wireframe===!0){if(At=Q.getWireframeAttribute(H),At===void 0)return;kt=2}const Gt=H.drawRange,Dt=H.attributes.position;let ee=Gt.start*kt,le=(Gt.start+Gt.count)*kt;nt!==null&&(ee=Math.max(ee,nt.start*kt),le=Math.min(le,(nt.start+nt.count)*kt)),At!==null?(ee=Math.max(ee,0),le=Math.min(le,At.count)):Dt!=null&&(ee=Math.max(ee,0),le=Math.min(le,Dt.count));const Ae=le-ee;if(Ae<0||Ae===1/0)return;me.setup(N,G,St,H,At);let Ee,ie=bt;if(At!==null&&(Ee=$.get(At),ie=Qt,ie.setIndex(Ee)),N.isMesh)G.wireframe===!0?(at.setLineWidth(G.wireframeLinewidth*st()),ie.setMode(R.LINES)):ie.setMode(R.TRIANGLES);else if(N.isLine){let Ut=G.linewidth;Ut===void 0&&(Ut=1),at.setLineWidth(Ut*st()),N.isLineSegments?ie.setMode(R.LINES):N.isLineLoop?ie.setMode(R.LINE_LOOP):ie.setMode(R.LINE_STRIP)}else N.isPoints?ie.setMode(R.POINTS):N.isSprite&&ie.setMode(R.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)ie.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(et.get("WEBGL_multi_draw"))ie.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Ut=N._multiDrawStarts,He=N._multiDrawCounts,ce=N._multiDrawCount,Dn=At?$.get(At).bytesPerElement:1,Ss=_t.get(G).currentProgram.getUniforms();for(let _n=0;_n<ce;_n++)Ss.setValue(R,"_gl_DrawID",_n),ie.render(Ut[_n]/Dn,He[_n])}else if(N.isInstancedMesh)ie.renderInstances(ee,Ae,N.count);else if(H.isInstancedBufferGeometry){const Ut=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,He=Math.min(H.instanceCount,Ut);ie.renderInstances(ee,Ae,He)}else ie.render(ee,Ae)};function ue(E,U,H){E.transparent===!0&&E.side===Qe&&E.forceSinglePass===!1?(E.side=on,E.needsUpdate=!0,oo(E,U,H),E.side=Gi,E.needsUpdate=!0,oo(E,U,H),E.side=Qe):oo(E,U,H)}this.compile=function(E,U,H=null){H===null&&(H=E),p=Jt.get(H),p.init(U),x.push(p),H.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),E!==H&&E.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();const G=new Set;return E.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const nt=N.material;if(nt)if(Array.isArray(nt))for(let pt=0;pt<nt.length;pt++){const St=nt[pt];ue(St,H,N),G.add(St)}else ue(nt,H,N),G.add(nt)}),x.pop(),p=null,G},this.compileAsync=function(E,U,H=null){const G=this.compile(E,U,H);return new Promise(N=>{function nt(){if(G.forEach(function(pt){_t.get(pt).currentProgram.isReady()&&G.delete(pt)}),G.size===0){N(E);return}setTimeout(nt,10)}et.get("KHR_parallel_shader_compile")!==null?nt():setTimeout(nt,10)})};let In=null;function ii(E){In&&In(E)}function xh(){Wi.stop()}function yh(){Wi.start()}const Wi=new Rf;Wi.setAnimationLoop(ii),typeof self<"u"&&Wi.setContext(self),this.setAnimationLoop=function(E){In=E,W.setAnimationLoop(E),E===null?Wi.stop():Wi.start()},W.addEventListener("sessionstart",xh),W.addEventListener("sessionend",yh),this.render=function(E,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(U),U=W.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,U,I),p=Jt.get(E,x.length),p.init(U),x.push(p),It.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Z.setFromProjectionMatrix(It),Ct=this.localClippingEnabled,rt=it.init(this.clippingPlanes,Ct),m=yt.get(E,S.length),m.init(),S.push(m),W.enabled===!0&&W.isPresenting===!0){const nt=v.xr.getDepthSensingMesh();nt!==null&&Wa(nt,U,-1/0,v.sortObjects)}Wa(E,U,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(ot,xt),j=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,j&&Nt.addToRenderList(m,E),this.info.render.frame++,rt===!0&&it.beginShadows();const H=p.state.shadowsArray;Et.render(H,E,U),rt===!0&&it.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=m.opaque,N=m.transmissive;if(p.setupLights(),U.isArrayCamera){const nt=U.cameras;if(N.length>0)for(let pt=0,St=nt.length;pt<St;pt++){const At=nt[pt];Sh(G,N,E,At)}j&&Nt.render(E);for(let pt=0,St=nt.length;pt<St;pt++){const At=nt[pt];Mh(m,E,At,At.viewport)}}else N.length>0&&Sh(G,N,E,U),j&&Nt.render(E),Mh(m,E,U);I!==null&&(T.updateMultisampleRenderTarget(I),T.updateRenderTargetMipmap(I)),E.isScene===!0&&E.onAfterRender(v,E,U),me.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],rt===!0&&it.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function Wa(E,U,H,G){if(E.visible===!1)return;if(E.layers.test(U.layers)){if(E.isGroup)H=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(U);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Z.intersectsSprite(E)){G&&Ot.setFromMatrixPosition(E.matrixWorld).applyMatrix4(It);const pt=K.update(E),St=E.material;St.visible&&m.push(E,pt,St,H,Ot.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Z.intersectsObject(E))){const pt=K.update(E),St=E.material;if(G&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ot.copy(E.boundingSphere.center)):(pt.boundingSphere===null&&pt.computeBoundingSphere(),Ot.copy(pt.boundingSphere.center)),Ot.applyMatrix4(E.matrixWorld).applyMatrix4(It)),Array.isArray(St)){const At=pt.groups;for(let kt=0,Gt=At.length;kt<Gt;kt++){const Dt=At[kt],ee=St[Dt.materialIndex];ee&&ee.visible&&m.push(E,pt,ee,H,Ot.z,Dt)}}else St.visible&&m.push(E,pt,St,H,Ot.z,null)}}const nt=E.children;for(let pt=0,St=nt.length;pt<St;pt++)Wa(nt[pt],U,H,G)}function Mh(E,U,H,G){const N=E.opaque,nt=E.transmissive,pt=E.transparent;p.setupLightsView(H),rt===!0&&it.setGlobalState(v.clippingPlanes,H),G&&at.viewport(L.copy(G)),N.length>0&&ro(N,U,H),nt.length>0&&ro(nt,U,H),pt.length>0&&ro(pt,U,H),at.buffers.depth.setTest(!0),at.buffers.depth.setMask(!0),at.buffers.color.setMask(!0),at.setPolygonOffset(!1)}function Sh(E,U,H,G){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[G.id]===void 0&&(p.state.transmissionRenderTarget[G.id]=new Vi(1,1,{generateMipmaps:!0,type:et.has("EXT_color_buffer_half_float")||et.has("EXT_color_buffer_float")?mr:Qn,minFilter:ms,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:se.workingColorSpace}));const nt=p.state.transmissionRenderTarget[G.id],pt=G.viewport||L;nt.setSize(pt.z,pt.w);const St=v.getRenderTarget();v.setRenderTarget(nt),v.getClearColor(V),q=v.getClearAlpha(),q<1&&v.setClearColor(16777215,.5),v.clear(),j&&Nt.render(H);const At=v.toneMapping;v.toneMapping=zi;const kt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),p.setupLightsView(G),rt===!0&&it.setGlobalState(v.clippingPlanes,G),ro(E,H,G),T.updateMultisampleRenderTarget(nt),T.updateRenderTargetMipmap(nt),et.has("WEBGL_multisampled_render_to_texture")===!1){let Gt=!1;for(let Dt=0,ee=U.length;Dt<ee;Dt++){const le=U[Dt],Ae=le.object,Ee=le.geometry,ie=le.material,Ut=le.group;if(ie.side===Qe&&Ae.layers.test(G.layers)){const He=ie.side;ie.side=on,ie.needsUpdate=!0,Eh(Ae,H,G,Ee,ie,Ut),ie.side=He,ie.needsUpdate=!0,Gt=!0}}Gt===!0&&(T.updateMultisampleRenderTarget(nt),T.updateRenderTargetMipmap(nt))}v.setRenderTarget(St),v.setClearColor(V,q),kt!==void 0&&(G.viewport=kt),v.toneMapping=At}function ro(E,U,H){const G=U.isScene===!0?U.overrideMaterial:null;for(let N=0,nt=E.length;N<nt;N++){const pt=E[N],St=pt.object,At=pt.geometry,kt=G===null?pt.material:G,Gt=pt.group;St.layers.test(H.layers)&&Eh(St,U,H,At,kt,Gt)}}function Eh(E,U,H,G,N,nt){E.onBeforeRender(v,U,H,G,N,nt),E.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),N.onBeforeRender(v,U,H,G,E,nt),N.transparent===!0&&N.side===Qe&&N.forceSinglePass===!1?(N.side=on,N.needsUpdate=!0,v.renderBufferDirect(H,U,G,N,E,nt),N.side=Gi,N.needsUpdate=!0,v.renderBufferDirect(H,U,G,N,E,nt),N.side=Qe):v.renderBufferDirect(H,U,G,N,E,nt),E.onAfterRender(v,U,H,G,N,nt)}function oo(E,U,H){U.isScene!==!0&&(U=te);const G=_t.get(E),N=p.state.lights,nt=p.state.shadowsArray,pt=N.state.version,St=Pt.getParameters(E,N.state,nt,U,H),At=Pt.getProgramCacheKey(St);let kt=G.programs;G.environment=E.isMeshStandardMaterial?U.environment:null,G.fog=U.fog,G.envMap=(E.isMeshStandardMaterial?B:y).get(E.envMap||G.environment),G.envMapRotation=G.environment!==null&&E.envMap===null?U.environmentRotation:E.envMapRotation,kt===void 0&&(E.addEventListener("dispose",qt),kt=new Map,G.programs=kt);let Gt=kt.get(At);if(Gt!==void 0){if(G.currentProgram===Gt&&G.lightsStateVersion===pt)return wh(E,St),Gt}else St.uniforms=Pt.getUniforms(E),E.onBeforeCompile(St,v),Gt=Pt.acquireProgram(St,At),kt.set(At,Gt),G.uniforms=St.uniforms;const Dt=G.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Dt.clippingPlanes=it.uniform),wh(E,St),G.needsLights=kf(E),G.lightsStateVersion=pt,G.needsLights&&(Dt.ambientLightColor.value=N.state.ambient,Dt.lightProbe.value=N.state.probe,Dt.directionalLights.value=N.state.directional,Dt.directionalLightShadows.value=N.state.directionalShadow,Dt.spotLights.value=N.state.spot,Dt.spotLightShadows.value=N.state.spotShadow,Dt.rectAreaLights.value=N.state.rectArea,Dt.ltc_1.value=N.state.rectAreaLTC1,Dt.ltc_2.value=N.state.rectAreaLTC2,Dt.pointLights.value=N.state.point,Dt.pointLightShadows.value=N.state.pointShadow,Dt.hemisphereLights.value=N.state.hemi,Dt.directionalShadowMap.value=N.state.directionalShadowMap,Dt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Dt.spotShadowMap.value=N.state.spotShadowMap,Dt.spotLightMatrix.value=N.state.spotLightMatrix,Dt.spotLightMap.value=N.state.spotLightMap,Dt.pointShadowMap.value=N.state.pointShadowMap,Dt.pointShadowMatrix.value=N.state.pointShadowMatrix),G.currentProgram=Gt,G.uniformsList=null,Gt}function bh(E){if(E.uniformsList===null){const U=E.currentProgram.getUniforms();E.uniformsList=ya.seqWithValue(U.seq,E.uniforms)}return E.uniformsList}function wh(E,U){const H=_t.get(E);H.outputColorSpace=U.outputColorSpace,H.batching=U.batching,H.batchingColor=U.batchingColor,H.instancing=U.instancing,H.instancingColor=U.instancingColor,H.instancingMorph=U.instancingMorph,H.skinning=U.skinning,H.morphTargets=U.morphTargets,H.morphNormals=U.morphNormals,H.morphColors=U.morphColors,H.morphTargetsCount=U.morphTargetsCount,H.numClippingPlanes=U.numClippingPlanes,H.numIntersection=U.numClipIntersection,H.vertexAlphas=U.vertexAlphas,H.vertexTangents=U.vertexTangents,H.toneMapping=U.toneMapping}function Bf(E,U,H,G,N){U.isScene!==!0&&(U=te),T.resetTextureUnits();const nt=U.fog,pt=G.isMeshStandardMaterial?U.environment:null,St=I===null?v.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:dr,At=(G.isMeshStandardMaterial?B:y).get(G.envMap||pt),kt=G.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Gt=!!H.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Dt=!!H.morphAttributes.position,ee=!!H.morphAttributes.normal,le=!!H.morphAttributes.color;let Ae=zi;G.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Ae=v.toneMapping);const Ee=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ie=Ee!==void 0?Ee.length:0,Ut=_t.get(G),He=p.state.lights;if(rt===!0&&(Ct===!0||E!==M)){const tn=E===M&&G.id===b;it.setState(G,E,tn)}let ce=!1;G.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==He.state.version||Ut.outputColorSpace!==St||N.isBatchedMesh&&Ut.batching===!1||!N.isBatchedMesh&&Ut.batching===!0||N.isBatchedMesh&&Ut.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Ut.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Ut.instancing===!1||!N.isInstancedMesh&&Ut.instancing===!0||N.isSkinnedMesh&&Ut.skinning===!1||!N.isSkinnedMesh&&Ut.skinning===!0||N.isInstancedMesh&&Ut.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Ut.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Ut.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Ut.instancingMorph===!1&&N.morphTexture!==null||Ut.envMap!==At||G.fog===!0&&Ut.fog!==nt||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==it.numPlanes||Ut.numIntersection!==it.numIntersection)||Ut.vertexAlphas!==kt||Ut.vertexTangents!==Gt||Ut.morphTargets!==Dt||Ut.morphNormals!==ee||Ut.morphColors!==le||Ut.toneMapping!==Ae||Ut.morphTargetsCount!==ie)&&(ce=!0):(ce=!0,Ut.__version=G.version);let Dn=Ut.currentProgram;ce===!0&&(Dn=oo(G,U,N));let Ss=!1,_n=!1,Sr=!1;const ge=Dn.getUniforms(),An=Ut.uniforms;if(at.useProgram(Dn.program)&&(Ss=!0,_n=!0,Sr=!0),G.id!==b&&(b=G.id,_n=!0),Ss||M!==E){at.buffers.depth.getReversed()?(ct.copy(E.projectionMatrix),cm(ct),hm(ct),ge.setValue(R,"projectionMatrix",ct)):ge.setValue(R,"projectionMatrix",E.projectionMatrix),ge.setValue(R,"viewMatrix",E.matrixWorldInverse);const cn=ge.map.cameraPosition;cn!==void 0&&cn.setValue(R,Ht.setFromMatrixPosition(E.matrixWorld)),Mt.logarithmicDepthBuffer&&ge.setValue(R,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ge.setValue(R,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,_n=!0,Sr=!0)}if(N.isSkinnedMesh){ge.setOptional(R,N,"bindMatrix"),ge.setOptional(R,N,"bindMatrixInverse");const tn=N.skeleton;tn&&(tn.boneTexture===null&&tn.computeBoneTexture(),ge.setValue(R,"boneTexture",tn.boneTexture,T))}N.isBatchedMesh&&(ge.setOptional(R,N,"batchingTexture"),ge.setValue(R,"batchingTexture",N._matricesTexture,T),ge.setOptional(R,N,"batchingIdTexture"),ge.setValue(R,"batchingIdTexture",N._indirectTexture,T),ge.setOptional(R,N,"batchingColorTexture"),N._colorsTexture!==null&&ge.setValue(R,"batchingColorTexture",N._colorsTexture,T));const Rn=H.morphAttributes;if((Rn.position!==void 0||Rn.normal!==void 0||Rn.color!==void 0)&&zt.update(N,H,Dn),(_n||Ut.receiveShadow!==N.receiveShadow)&&(Ut.receiveShadow=N.receiveShadow,ge.setValue(R,"receiveShadow",N.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(An.envMap.value=At,An.flipEnvMap.value=At.isCubeTexture&&At.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&U.environment!==null&&(An.envMapIntensity.value=U.environmentIntensity),_n&&(ge.setValue(R,"toneMappingExposure",v.toneMappingExposure),Ut.needsLights&&zf(An,Sr),nt&&G.fog===!0&&dt.refreshFogUniforms(An,nt),dt.refreshMaterialUniforms(An,G,O,Y,p.state.transmissionRenderTarget[E.id]),ya.upload(R,bh(Ut),An,T)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(ya.upload(R,bh(Ut),An,T),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ge.setValue(R,"center",N.center),ge.setValue(R,"modelViewMatrix",N.modelViewMatrix),ge.setValue(R,"normalMatrix",N.normalMatrix),ge.setValue(R,"modelMatrix",N.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const tn=G.uniformsGroups;for(let cn=0,Xa=tn.length;cn<Xa;cn++){const Xi=tn[cn];D.update(Xi,Dn),D.bind(Xi,Dn)}}return Dn}function zf(E,U){E.ambientLightColor.needsUpdate=U,E.lightProbe.needsUpdate=U,E.directionalLights.needsUpdate=U,E.directionalLightShadows.needsUpdate=U,E.pointLights.needsUpdate=U,E.pointLightShadows.needsUpdate=U,E.spotLights.needsUpdate=U,E.spotLightShadows.needsUpdate=U,E.rectAreaLights.needsUpdate=U,E.hemisphereLights.needsUpdate=U}function kf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(E,U,H){_t.get(E.texture).__webglTexture=U,_t.get(E.depthTexture).__webglTexture=H;const G=_t.get(E);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=H===void 0,G.__autoAllocateDepthBuffer||et.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,U){const H=_t.get(E);H.__webglFramebuffer=U,H.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(E,U=0,H=0){I=E,A=U,C=H;let G=!0,N=null,nt=!1,pt=!1;if(E){const At=_t.get(E);if(At.__useDefaultFramebuffer!==void 0)at.bindFramebuffer(R.FRAMEBUFFER,null),G=!1;else if(At.__webglFramebuffer===void 0)T.setupRenderTarget(E);else if(At.__hasExternalTextures)T.rebindTextures(E,_t.get(E.texture).__webglTexture,_t.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Dt=E.depthTexture;if(At.__boundDepthTexture!==Dt){if(Dt!==null&&_t.has(Dt)&&(E.width!==Dt.image.width||E.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(E)}}const kt=E.texture;(kt.isData3DTexture||kt.isDataArrayTexture||kt.isCompressedArrayTexture)&&(pt=!0);const Gt=_t.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Gt[U])?N=Gt[U][H]:N=Gt[U],nt=!0):E.samples>0&&T.useMultisampledRTT(E)===!1?N=_t.get(E).__webglMultisampledFramebuffer:Array.isArray(Gt)?N=Gt[H]:N=Gt,L.copy(E.viewport),z.copy(E.scissor),F=E.scissorTest}else L.copy(wt).multiplyScalar(O).floor(),z.copy(Xt).multiplyScalar(O).floor(),F=ae;if(at.bindFramebuffer(R.FRAMEBUFFER,N)&&G&&at.drawBuffers(E,N),at.viewport(L),at.scissor(z),at.setScissorTest(F),nt){const At=_t.get(E.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+U,At.__webglTexture,H)}else if(pt){const At=_t.get(E.texture),kt=U||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,At.__webglTexture,H||0,kt)}b=-1},this.readRenderTargetPixels=function(E,U,H,G,N,nt,pt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=_t.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pt!==void 0&&(St=St[pt]),St){at.bindFramebuffer(R.FRAMEBUFFER,St);try{const At=E.texture,kt=At.format,Gt=At.type;if(!Mt.textureFormatReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Mt.textureTypeReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=E.width-G&&H>=0&&H<=E.height-N&&R.readPixels(U,H,G,N,$t.convert(kt),$t.convert(Gt),nt)}finally{const At=I!==null?_t.get(I).__webglFramebuffer:null;at.bindFramebuffer(R.FRAMEBUFFER,At)}}},this.readRenderTargetPixelsAsync=async function(E,U,H,G,N,nt,pt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let St=_t.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pt!==void 0&&(St=St[pt]),St){const At=E.texture,kt=At.format,Gt=At.type;if(!Mt.textureFormatReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Mt.textureTypeReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=E.width-G&&H>=0&&H<=E.height-N){at.bindFramebuffer(R.FRAMEBUFFER,St);const Dt=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Dt),R.bufferData(R.PIXEL_PACK_BUFFER,nt.byteLength,R.STREAM_READ),R.readPixels(U,H,G,N,$t.convert(kt),$t.convert(Gt),0);const ee=I!==null?_t.get(I).__webglFramebuffer:null;at.bindFramebuffer(R.FRAMEBUFFER,ee);const le=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await lm(R,le,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Dt),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,nt),R.deleteBuffer(Dt),R.deleteSync(le),nt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,U=null,H=0){E.isTexture!==!0&&(Ys("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,E=arguments[1]);const G=Math.pow(2,-H),N=Math.floor(E.image.width*G),nt=Math.floor(E.image.height*G),pt=U!==null?U.x:0,St=U!==null?U.y:0;T.setTexture2D(E,0),R.copyTexSubImage2D(R.TEXTURE_2D,H,0,0,pt,St,N,nt),at.unbindTexture()};const Hf=R.createFramebuffer(),Gf=R.createFramebuffer();this.copyTextureToTexture=function(E,U,H=null,G=null,N=0,nt=null){E.isTexture!==!0&&(Ys("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,E=arguments[1],U=arguments[2],nt=arguments[3]||0,H=null),nt===null&&(N!==0?(Ys("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),nt=N,N=0):nt=0);let pt,St,At,kt,Gt,Dt,ee,le,Ae;const Ee=E.isCompressedTexture?E.mipmaps[nt]:E.image;if(H!==null)pt=H.max.x-H.min.x,St=H.max.y-H.min.y,At=H.isBox3?H.max.z-H.min.z:1,kt=H.min.x,Gt=H.min.y,Dt=H.isBox3?H.min.z:0;else{const Rn=Math.pow(2,-N);pt=Math.floor(Ee.width*Rn),St=Math.floor(Ee.height*Rn),E.isDataArrayTexture?At=Ee.depth:E.isData3DTexture?At=Math.floor(Ee.depth*Rn):At=1,kt=0,Gt=0,Dt=0}G!==null?(ee=G.x,le=G.y,Ae=G.z):(ee=0,le=0,Ae=0);const ie=$t.convert(U.format),Ut=$t.convert(U.type);let He;U.isData3DTexture?(T.setTexture3D(U,0),He=R.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(T.setTexture2DArray(U,0),He=R.TEXTURE_2D_ARRAY):(T.setTexture2D(U,0),He=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,U.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,U.unpackAlignment);const ce=R.getParameter(R.UNPACK_ROW_LENGTH),Dn=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Ss=R.getParameter(R.UNPACK_SKIP_PIXELS),_n=R.getParameter(R.UNPACK_SKIP_ROWS),Sr=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,Ee.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Ee.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,kt),R.pixelStorei(R.UNPACK_SKIP_ROWS,Gt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Dt);const ge=E.isDataArrayTexture||E.isData3DTexture,An=U.isDataArrayTexture||U.isData3DTexture;if(E.isDepthTexture){const Rn=_t.get(E),tn=_t.get(U),cn=_t.get(Rn.__renderTarget),Xa=_t.get(tn.__renderTarget);at.bindFramebuffer(R.READ_FRAMEBUFFER,cn.__webglFramebuffer),at.bindFramebuffer(R.DRAW_FRAMEBUFFER,Xa.__webglFramebuffer);for(let Xi=0;Xi<At;Xi++)ge&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,_t.get(E).__webglTexture,N,Dt+Xi),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,_t.get(U).__webglTexture,nt,Ae+Xi)),R.blitFramebuffer(kt,Gt,pt,St,ee,le,pt,St,R.DEPTH_BUFFER_BIT,R.NEAREST);at.bindFramebuffer(R.READ_FRAMEBUFFER,null),at.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(N!==0||E.isRenderTargetTexture||_t.has(E)){const Rn=_t.get(E),tn=_t.get(U);at.bindFramebuffer(R.READ_FRAMEBUFFER,Hf),at.bindFramebuffer(R.DRAW_FRAMEBUFFER,Gf);for(let cn=0;cn<At;cn++)ge?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Rn.__webglTexture,N,Dt+cn):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Rn.__webglTexture,N),An?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,tn.__webglTexture,nt,Ae+cn):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,tn.__webglTexture,nt),N!==0?R.blitFramebuffer(kt,Gt,pt,St,ee,le,pt,St,R.COLOR_BUFFER_BIT,R.NEAREST):An?R.copyTexSubImage3D(He,nt,ee,le,Ae+cn,kt,Gt,pt,St):R.copyTexSubImage2D(He,nt,ee,le,kt,Gt,pt,St);at.bindFramebuffer(R.READ_FRAMEBUFFER,null),at.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else An?E.isDataTexture||E.isData3DTexture?R.texSubImage3D(He,nt,ee,le,Ae,pt,St,At,ie,Ut,Ee.data):U.isCompressedArrayTexture?R.compressedTexSubImage3D(He,nt,ee,le,Ae,pt,St,At,ie,Ee.data):R.texSubImage3D(He,nt,ee,le,Ae,pt,St,At,ie,Ut,Ee):E.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,nt,ee,le,pt,St,ie,Ut,Ee.data):E.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,nt,ee,le,Ee.width,Ee.height,ie,Ee.data):R.texSubImage2D(R.TEXTURE_2D,nt,ee,le,pt,St,ie,Ut,Ee);R.pixelStorei(R.UNPACK_ROW_LENGTH,ce),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Dn),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ss),R.pixelStorei(R.UNPACK_SKIP_ROWS,_n),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Sr),nt===0&&U.generateMipmaps&&R.generateMipmap(He),at.unbindTexture()},this.copyTextureToTexture3D=function(E,U,H=null,G=null,N=0){return E.isTexture!==!0&&(Ys("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,G=arguments[1]||null,E=arguments[2],U=arguments[3],N=arguments[4]||0),Ys('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,U,H,G,N)},this.initRenderTarget=function(E){_t.get(E).__webglFramebuffer===void 0&&T.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?T.setTextureCube(E,0):E.isData3DTexture?T.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?T.setTexture2DArray(E,0):T.setTexture2D(E,0),at.unbindTexture()},this.resetState=function(){A=0,C=0,I=null,at.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=se._getDrawingBufferColorSpace(t),e.unpackColorSpace=se._getUnpackColorSpace()}}const sy=new Bt(Vt.north),ry=new Bt(Vt.south),Hu=new Bt(Vt.unwritten),oy=new Bt(16777215),ay=new _s(Fa,20).rotateX(-Math.PI/2),Dl=new Bt,Gu=new fe;function Ir(i,t,e){const n=new De({color:i,metalness:t,roughness:e});return n.userData={metalness:t,roughness:e},n}class oe{constructor(t,e){this.lattice=t;const n=e.style??"printed";this.thickness=e.thickness??Tt,this.bodyDir=e.faceUp?-1:1;const s=this.bodyDir,r=this.thickness;if(n==="printed"){const o=Ir(Vt.nickel,.95,.28),a=new gt(new Ve(tt,tt,r,72),o);a.position.y=s*r/2,a.renderOrder=1,this.bodyMaterials.push(o),this.group.add(a),this.film=new gt(new _s(tt-.25,72).rotateX(-Math.PI/2),new Le({color:Vt.film,side:Qe,transparent:!0})),this.film.position.y=-s*.02,this.film.renderOrder=2,this.group.add(this.film),this.dots=new _f(ay,new Le({side:Qe,toneMapped:!1,transparent:!0}),t.count);for(let l=0;l<t.count;l++)Gu.makeTranslation(t.x[l],-s*.05,t.z[l]),this.dots.setMatrixAt(l,Gu),this.dots.setColorAt(l,Hu);this.dots.instanceMatrix.needsUpdate=!0,this.dots.renderOrder=3,this.group.add(this.dots)}else if(n==="conventional"){const o=Ir(Vt.north,.25,.42),a=Ir(Vt.south,.25,.42),l=new Ve(tt,tt,r/2,72),c=new gt(l,o),u=new gt(l,a);c.position.y=s*r/4,u.position.y=s*3*r/4,this.bodyMaterials.push(o,a),this.group.add(c,u)}else{const o=Ir(Vt.north,.3,.45),a=Ir(Vt.south,.3,.45),l=r-.22,c=new gt(new Ve(tt,tt,l,48,1,!1,Math.PI,Math.PI),o),u=new gt(new Ve(tt,tt,l,48,1,!1,0,Math.PI),a);c.position.y=u.position.y=s*r/2,this.bodyMaterials.push(o,a),this.group.add(c,u)}if(e.indexMark){const o=new gt(new Xe(.9,r*.5,.45),new Le({color:15265010,toneMapped:!1}));o.position.set(tt-.35,s*r/2,0),this.group.add(o)}this.scan=new gt(new Xe(.55,.55,2*tt+3),new Le({color:Vt.scan,toneMapped:!1,transparent:!0,opacity:.95})),this.scan.position.y=-s*.9,this.scan.visible=!1,this.group.add(this.scan)}group=new ne;thickness;bodyMaterials=[];dots=null;film=null;scan;bodyDir;paintSites(t,e){if(this.dots){for(let n=0;n<this.lattice.count;n++){const s=t(n);Dl.copy(s>0?sy:s<0?ry:Hu);const r=e?e(n):0;r>0&&Dl.lerp(oy,Math.min(1,r)),this.dots.setColorAt(n,Dl)}this.dots.instanceColor&&(this.dots.instanceColor.needsUpdate=!0)}}setOpacity(t){const e=t>=.995;for(const n of this.bodyMaterials)n.transparent=!e,n.opacity=t,n.depthWrite=e,n.metalness=e?n.userData.metalness:.15,n.roughness=e?n.userData.roughness:.55;this.film&&(this.film.visible=e,this.film.material.depthWrite=e)}setScan(t){this.scan.visible=t!==null,t!==null&&(this.scan.position.x=t)}}function Xc(i,t,e){const n=new gt(new Xe(i,e,t),new De({color:Vt.steel,metalness:.9,roughness:.42}));return n.position.y=-e/2,n}class ys{constructor(t=Vt.force,e=.55){this.radius=e;const n=new Le({color:t,toneMapped:!1});this.shaft=new gt(new Ve(e,e,1,16),n),this.head=new gt(new Ba(e*2.6,e*5,20),n),this.group.add(this.shaft,this.head)}group=new ne;shaft;head;set(t,e,n){const s=this.radius*5;if(this.group.visible=n>s*.6,!this.group.visible)return;const r=Math.max(.01,n-s);this.group.position.copy(t),this.group.quaternion.setFromUnitVectors(ly,e),this.shaft.scale.y=r,this.shaft.position.y=r/2,this.head.position.y=r+s/2}}const ly=new P(0,1,0),cy={lead:2.2,pace:1.3,tail:1.2},Vu=[.2,.8],hy=1,Wu=.65,Xu=[.55,.1];function uy(i,t){return t.lead+i*t.pace+t.tail}function dy(i,t,e){return _i((i-e.lead)/e.pace,0,t)}function qu(i,t){return t.lead+i*t.pace}function fy(i,t,e){if(t.length===0)return{index:-1,opacity:0,lines:[]};const n=c=>c===0?hy:qu(t[c].at,e);let s=0;for(let c=1;c<t.length;c++)i>=n(c)&&(s=c);const r=n(s),o=X(i,r,r+Wu),a=s+1<t.length?X(i,n(s+1)-Xu[0],n(s+1)-Xu[1]):0,l=t[s].lines.map(c=>{if(c.at===void 0)return 1;const u=Math.max(r,qu(c.at,e));return X(i,u,u+Wu)});return{index:s,opacity:Math.min(o,1-a),lines:l}}class Be{constructor(t){this.world=t,this.group.visible=!1,t.stage.scene.add(this.group)}pacing=cy;group=new ne;get duration(){return uy(this.script,this.pacing)}setVisible(t){this.group.visible=t}update(t){this.draw(dy(t,this.script,this.pacing),t)}caption(t,e){const n=fy(t,e,this.pacing);if(n.index<0){this.world.hud.setCaption([]);return}const s=e[n.index];this.world.hud.setCaption(s.lines,n.lines,s.tag??"",n.opacity)}}const py=()=>0;function Te(i){return{polarity:t=>i[t],flash:py,scanX:null}}function Mi(i,t,e,n,s,r){if(n<=s)return Te(t);if(n>=r)return Te(e);const o=-tt-1.5+ve(n,s,r)*(2*tt+3);return{polarity:a=>i.x[a]<o?e[a]:t[a],flash:a=>{const l=o-i.x[a];return l>=0&&l<7?Math.exp(-l/2.2)*.9:0},scanX:o}}function we(i,t){i.paintSites(t.polarity,t.flash),i.setScan(t.scanX)}function qe(i,t,e){for(let n=0;n<t.count;n++)i.site(t.x[n],t.z[n],e.polarity(n),e.flash(n));e.scanX!==null&&i.scan(e.scanX)}function Ie(i,t=.25,e=.5){return X(i,t,t+e)}const mn=Math.PI/180,Ln="Written Pattern, Face View",$s=[.2,1],Ma=3,ls=Ma+1.1,Ul=ls+1.1,Oo=2.2,my=[{at:0,lines:[{text:"A coded pair has one strong match."},{text:"Released nearby, the part pulls itself to a single position and orientation, with no fixture and no power.",at:$s[1]}]}];class gy extends Be{id="align";title="Align: Self-Positioning";script=7.8;base;part;baseFrom;baseTo;constructor(t){super(t),this.base=new oe(t.lattice,{faceUp:!0}),this.part=new oe(t.lattice,{faceUp:!1,indexMark:!0}),this.part.setOpacity(.38),this.baseFrom=rn(t.physics.patterns.attach),this.baseTo=rn(t.physics.patterns.align),this.group.add(this.base.group,this.part.group)}pose(t){if(t<Ma){const n=X(t,$s[1],Ma);return{offset:ht(8.4,7,n),gap:ht(14,Oo,n),yaw:ht(38,31,n)}}if(t<ls){const n=Ea(t,Ma,.5);return{offset:7*(1-n),gap:ht(Oo,re,xi(n)),yaw:31*(1-n)}}if(t<Ul){const n=X(t,ls,ls+.45),s=X(t,ls+.6,Ul),r=X(t,ls+.05,ls+.85);return{offset:ht(0,-7.4,r),gap:ht(ht(re,9,n),Oo,s),yaw:ht(0,-47,r)}}const e=Ea(t,Ul,.5);return{offset:-7.4*(1-e),gap:ht(Oo,re,xi(e)),yaw:-47*(1-e)}}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=this.pose(t);n.orbit([0,3,0],178,ht(22,12,e/this.duration),33),this.part.group.position.set(a.offset*Ta[0],a.gap,a.offset*Ta[1]),this.part.group.rotation.y=a.yaw*mn;const l=Mi(o,r.patterns.attach,r.patterns.align,t,$s[0],$s[1]);we(this.part,l),we(this.base,Mi(o,this.baseFrom,this.baseTo,t,$s[0],$s[1])),this.caption(e,my),s.setPanels(1,1),s.inset.begin(Ln),s.inset.disc(),qe(s.inset,o,l);const c=r.align.hold;s.chart.draw({title:"Holding Force vs. Lateral Offset",xLabel:"Offset from the matched position (mm)",yLabel:"Holding force (relative)",xRange:[-18,18],yRange:[-.25,1.08],xTicks:[-15,-10,-5,0,5,10,15].map(d=>({value:d,label:String(d)})),yTicks:[0,.5,1].map(d=>({value:d,label:String(d)})),series:[{label:"Coded pair",color:Wt.seriesPoly,xs:c.x,ys:c.y}],markers:[{series:0,x:a.offset,y:Me(c,a.offset)}]});const u=a.gap<re+.05&&Math.abs(a.offset)<.15,h=Ie(t,1);s.label("align-base","Mating code",-20,-4,6,{anchor:"left",opacity:h}),s.label("align-part",u?"Seated":"Coded part",this.part.group.position.x,a.gap+13,-14,{anchor:"above",detail:u?"one position, one orientation":"",opacity:h})}}function Oi(i=Vt.steel,t=.38){return new De({color:i,metalness:.9,roughness:t})}function ei(i=Vt.dark,t=.55){return new De({color:i,metalness:.45,roughness:t})}function ke(i,t,e,n){return new gt(new Xe(i,t,e),n)}function ki(i,t,e,n=24){return new gt(new Ve(i,i,t,n),e)}function Df(i,t,e,n){const s=new so;s.absarc(0,0,t,0,2*Math.PI,!1);const r=new Ia;r.absarc(0,0,i,0,2*Math.PI,!0),s.holes.push(r);const o=new xr(s,{depth:e,bevelEnabled:!1,curveSegments:48});return o.rotateX(-Math.PI/2),new gt(o,n)}function pr(i){const t=new ne,e=new De({color:Vt.dark,metalness:.7,roughness:.4}),n=new De({color:Vt.copper,metalness:.95,roughness:.3}),s=new gt(new Ve(2.6,.7,3.2,24),n);s.position.y=1.6;const r=new gt(new Ve(2.6,2.6,9,24),e);r.position.y=3.2+4.5;const o=new gt(new Ve(.8,.8,22,12),e);o.position.y=12.2+11;const a=new gt(new yr(1.5,16,12),new Le({color:Vt.scan,toneMapped:!1,transparent:!0}));return t.add(s,r,o,a),i===-1&&(t.rotation.x=Math.PI),{group:t,pulse:a}}function vh(i,t){i.pulse.scale.setScalar(.4+1.5*t),i.pulse.material.opacity=t}function eo(){const i=new ne,t=new gt(new Xe(8,.8,8),new De({color:1849904,metalness:.2,roughness:.6})),e=new gt(new Xe(3.6,1,3.6),new De({color:Vt.dark,metalness:.5,roughness:.4}));e.position.y=.9;const n=new Le({color:Vt.good,toneMapped:!1}),s=new gt(new yr(.75,12,8),n);return s.position.set(2.6,.9,2.6),i.add(t,e,s),{group:i,led:n}}const un=[-46,0,46],_y=tt+.6,Gr={halfWidth:75,halfDepth:28},Bo=[.3,.9],Dr=[1.1,2.3],Ur=[1.75,2],Nl=[2.3,2.6],cs=[3.2,3.9],Fl=4.1,vy=.42,xy=.55,je=6.2,qc=.75,Ks=.95,Qi=je+2*Ks+qc,Ol=1.3,yy=18,Yu=1,My=[{at:0,lines:[{text:"Magnetized parts fight the assembler: they pull at each other, at tools and at loose steel."}]},{at:cs[0]-.1,lines:[{text:"Unmagnetized blanks go in like any other part."},{text:"The magnetizer then writes each one in place, after assembly.",at:je-.6}],tag:"CMR-patented process"}];function Sy(){const i=new so;i.moveTo(-75,-28),i.lineTo(Gr.halfWidth,-28),i.lineTo(Gr.halfWidth,Gr.halfDepth),i.lineTo(-75,Gr.halfDepth),i.closePath();for(const e of un){const n=new Ia;n.absarc(e,0,_y,0,2*Math.PI,!0),i.holes.push(n)}const t=new xr(i,{depth:Tt,bevelEnabled:!1,curveSegments:48});return t.rotateX(-Math.PI/2),t.translate(0,-Tt,0),new gt(t,ei(4608094,.5))}function Ey(){const i=new ne,t=Oi(12173515,.3),e=ki(Yu,9,t,12);e.rotation.z=Math.PI/2;const n=ki(1.9,1.3,t,16);return n.rotation.z=Math.PI/2,n.position.x=5.1,e.position.y=n.position.y=Yu,i.add(e,n),i}class by extends Be{id="assemble";title="Magnetization After Assembly";script=Qi+1.05;live=new ne;placed;carried;screw=Ey();blanks;upper=pr(1);lower=pr(-1);constructor(t){super(t);const{lattice:e}=t;this.placed=new oe(e,{faceUp:!0,style:"conventional"}),this.carried=new oe(e,{faceUp:!0,style:"conventional"}),this.live.add(this.placed.group,this.carried.group,this.screw),this.blanks=un.map(()=>new oe(e,{faceUp:!0})),this.group.add(Sy(),this.live,...this.blanks.map(n=>n.group),this.upper.group,this.lower.group)}written(t,e){return this.world.lattice.count*ve(e,je+t*Ks,je+t*Ks+qc)}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=r.patterns.attach;n.orbit([0,2,0],262,ht(-14,6,e/this.duration),30);const l=X(t,cs[0],cs[1]);this.live.visible=l<1,this.live.position.set(-70*l,80*l,0),this.placed.group.position.set(un[0],ht(26,0,X(t,Bo[0],Bo[1])),0);const c=Tt+re,u=ht(-124,un[1],ve(Math.min(t,Ur[0]),Dr[0],Dr[1])),h=Vn(ve(t,Ur[0],Ur[1]));this.carried.group.visible=t>=Dr[0],this.carried.group.position.set(ht(u,un[0],h),ht(yy,c,h),0);const d=Vn(ve(t,Nl[0],Nl[1]));this.screw.position.set(ht(-14,-40,d),ht(0,c,d)+5*Math.sin(Math.PI*d),ht(23.8,9,d)),this.screw.rotation.y=.9*d,this.blanks.forEach((z,F)=>{const V=Fl+F*vy;z.group.visible=t>=V,z.group.position.set(un[F],ht(30,0,X(t,V,V+xy)),0)});const f=_i(Math.floor((t-je)/Ks),0,un.length-1),g=this.blanks.map((z,F)=>{const V=this.written(F,t),q=V>0&&V<o.count,k={polarity:Y=>o.rank[Y]<V?a[Y]:0,flash:Y=>{const O=V-o.rank[Y];return q&&O>=0?Math.exp(-O*.3):0},scanX:null};return we(z,k),k}),_=this.written(f,t),m=_i(_,0,o.count-1),p=o.printOrder[Math.floor(m)],S=o.printOrder[Math.min(o.count-1,Math.floor(m)+1)],x=m-Math.floor(m);let v=un[f]+ht(o.x[p],o.x[S],x),w=ht(o.z[p],o.z[S],x);if(_>=o.count&&f<un.length-1){const z=o.printOrder[0],F=X(t,je+f*Ks+qc,je+(f+1)*Ks);v=ht(v,un[f+1]+o.x[z],F),w=ht(w,o.z[z],F)}const A=X(t,je-.5,je),C=X(t,Qi,Qi+.7),I=ht(34,0,A)+44*C;this.upper.group.position.set(v,Ol+I,w),this.lower.group.position.set(v,-Tt-Ol-I,w);const b=_>0&&_<o.count?Math.exp(-x*2.4):0;for(const z of[this.upper,this.lower])vh(z,b),z.group.visible=t>je-.5&&C<1;this.caption(e,My),s.setPanels(0,X(t,je-.5,je)),s.inset.begin(Ln),s.inset.disc(),qe(s.inset,o,g[f]);const M=Gr.halfDepth,L=t<Ur[1]?"Magnetized parts":t<Nl[1]?"Pulled onto its neighbour":"Loose steel is pulled in too";s.label("assemble-live",L,un[0],-Tt-3,M,{anchor:"below",detail:t<Ur[1]?"live from the first step":"",opacity:ye(t,Bo[1],Bo[1]+.3,cs[0]-.1,cs[0]+.2)}),s.label("assemble-intended","Meant for this pocket",un[1],5,0,{anchor:"above",opacity:ye(t,Dr[0],Dr[0]+.3,cs[0]-.3,cs[0])}),s.label("assemble-blanks","Unmagnetized blanks",un[1],-Tt-3,M,{anchor:"below",detail:"no pull on each other or on tools",opacity:ye(t,Fl+.2,Fl+.6,je-.7,je-.4)}),s.label("assemble-heads","Magnetizer",v,Ol+I+13,w,{anchor:"right",detail:"writes each part in place",opacity:ye(t,je-.2,je+.1,Qi-.2,Qi+.1)}),s.label("assemble-done","Assembled, then magnetized",un[1],-Tt-3,M,{anchor:"below",opacity:X(t,Qi+.3,Qi+.7)})}}const Yc=2048,Da=6,$u=256,Ku=96,Bl=150,wy=.22,Zu=1,Ju=.8,Ua=-3.05,Uf=-.35,Ty=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,Ay=`
precision highp float;
uniform highp sampler2D uCharges;
uniform int uCount;
uniform vec4 uRect;
uniform float uZ;
uniform float uEps2;
uniform float uNear2;
uniform float uSubPitch;
uniform vec2 uLog;
varying vec2 vUv;
void main() {
  vec3 p = vec3(uRect.x + vUv.x * uRect.z, uRect.y + vUv.y * uRect.w, uZ);
  vec3 h = vec3(0.0);
  float first = -0.5 * float(${jn} - 1) * uSubPitch;
  for (int i = 0; i < ${Yc}; i++) {
    if (i >= uCount) break;
    vec4 c = texelFetch(uCharges, ivec2(i, 0), 0);
    vec3 d = p - c.xyz;
    float r2 = dot(d, d);
    if (r2 > uNear2) {
      float s2 = r2 + uEps2;
      h += c.w * d * inversesqrt(s2) / s2;
    } else {
      // Near a maxel: spread its charge over the maxel's square (see physics/pointField.ts).
      float share = c.w / float(${jn} * ${jn});
      for (int a = 0; a < ${jn}; a++) {
        for (int b = 0; b < ${jn}; b++) {
          vec3 s = d - vec3(first + float(a) * uSubPitch, 0.0, first + float(b) * uSubPitch);
          float s2 = dot(s, s) + uEps2;
          h += share * s * inversesqrt(s2) / s2;
        }
      }
    }
  }
  float level = (log(length(h) + 1e-12) * 0.4342945 - uLog.x) / (uLog.y - uLog.x);
  gl_FragColor = vec4(vec3(clamp(level, 0.0, 1.0)), 1.0);
}`,Ry=`
varying vec2 vUv;
varying vec2 vPlane;
uniform vec4 uRect;
void main() {
  vUv = uv;
  vPlane = uRect.xy + uv * uRect.zw;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Cy=`
precision highp float;
uniform sampler2D uField;
uniform vec3 uColor;
uniform float uGain;
uniform vec4 uSlabs[${Da}];
uniform int uSlabCount;
varying vec2 vUv;
varying vec2 vPlane;
void main() {
  float level = texture2D(uField, vUv).r;
  // Compress the top of the range so the strongest field near a face does not wash out the part.
  float glow = pow(level, 2.6);
  glow = glow / (1.0 + 1.3 * glow);
  // Fade toward the slice border so the quad has no visible edge.
  vec2 edge = smoothstep(vec2(0.0), vec2(0.16), vUv) * smoothstep(vec2(0.0), vec2(0.16), 1.0 - vUv);
  glow *= edge.x * edge.y;
  // No glow inside magnet bodies and plates.
  for (int i = 0; i < ${Da}; i++) {
    if (i >= uSlabCount) break;
    vec4 s = uSlabs[i];
    float inside = step(s.x, vPlane.x) * step(vPlane.x, s.y) * step(s.z, vPlane.y) * step(vPlane.y, s.w);
    glow *= 1.0 - inside;
  }
  // Ordered noise hides banding in the dark gradient.
  float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  gl_FragColor = vec4(uColor * max(0.0, glow * uGain + noise * 0.006), 1.0);
}`,Py=`
attribute float aAlpha;
attribute float aArc;
varying float vAlpha;
varying float vArc;
void main() {
  vAlpha = aAlpha;
  vArc = aArc;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Ly=`
precision highp float;
uniform vec3 uColor;
uniform float uTime;
uniform float uReveal;
uniform float uOpacity;
varying float vAlpha;
varying float vArc;
void main() {
  // Dashes drift along the line from north to south.
  float phase = fract(vArc * 0.16 - uTime * 0.85);
  float dash = mix(0.42, 1.0, smoothstep(0.0, 0.18, phase) * (1.0 - smoothstep(0.62, 1.0, phase)));
  float revealed = 1.0 - smoothstep(uReveal - 4.0, uReveal, vArc);
  gl_FragColor = vec4(uColor * vAlpha * dash * revealed * uOpacity, 1.0);
}`;class Ga{group=new ne;charges=new Jc(Yc);slabs=[];bounds;z;chargeTexture;target;computeScene=new lh;computeCamera=new gh(-1,1,1,-1,0,1);computeMaterial;glowMaterial;glow;lineMaterial;lines;linePositions;lineAlpha;lineArc;trace=new Float32Array(Bl*fi);lineKey=null;glowDirty=!0;constructor(t){this.bounds=t.bounds,this.z=t.z??0;const[e,n,s,r]=this.bounds,o=s-e,a=r-n,l=new he(e,n,o,a);this.chargeTexture=new ch(this.charges.data,Yc,1,Tn,Wn),this.chargeTexture.minFilter=an,this.chargeTexture.magFilter=an;const c=Math.max(8,Math.round($u*a/o));this.target=new Vi($u,c,{type:t.floatTargets?mr:Qn,minFilter:fn,magFilter:fn,depthBuffer:!1}),this.computeMaterial=new Xn({vertexShader:Ty,fragmentShader:Ay,depthTest:!1,depthWrite:!1,uniforms:{uCharges:{value:this.chargeTexture},uCount:{value:0},uRect:{value:l},uZ:{value:this.z},uEps2:{value:ba*ba},uNear2:{value:wa*wa},uSubPitch:{value:Kr},uLog:{value:new lt(Ua,Uf)}}}),this.computeScene.add(new gt(new xs(2,2),this.computeMaterial)),this.glowMaterial=new Xn({vertexShader:Ry,fragmentShader:Cy,transparent:!0,blending:Aa,depthWrite:!1,side:Qe,uniforms:{uField:{value:this.target.texture},uColor:{value:new Bt(Vt.field)},uGain:{value:Zu},uRect:{value:l},uSlabs:{value:Array.from({length:Da},()=>new he)},uSlabCount:{value:0}}}),this.glow=new gt(new xs(o,a),this.glowMaterial),this.glow.position.set(e+o/2,n+a/2,this.z),this.glow.renderOrder=6,this.group.add(this.glow);const u=Ku*(Bl-1)*6;this.linePositions=new Float32Array(u*3),this.lineAlpha=new Float32Array(u),this.lineArc=new Float32Array(u);const h=new gn;h.setAttribute("position",new pn(this.linePositions,3)),h.setAttribute("aAlpha",new pn(this.lineAlpha,1)),h.setAttribute("aArc",new pn(this.lineArc,1)),h.setDrawRange(0,0),h.boundingSphere=new vr(new P(e+o/2,n+a/2,this.z),Math.hypot(o,a)),this.lineMaterial=new Xn({vertexShader:Py,fragmentShader:Ly,transparent:!0,blending:Aa,depthWrite:!1,side:Qe,uniforms:{uColor:{value:new Bt(Vt.field)},uTime:{value:0},uReveal:{value:1e6},uOpacity:{value:1}}}),this.lines=new gt(h,this.lineMaterial),this.lines.renderOrder=7,this.group.add(this.lines)}begin(){this.charges.clear(),this.slabs.length=0,this.glowDirty=!0}addSlab(t,e,n,s){this.slabs.length<Da&&this.slabs.push({x0:t,x1:e,y0:n,y1:s})}magnitudeAt(t,e){return or(this.charges,t,e,this.z)}commit(t,e){const n=this.glowMaterial.uniforms.uSlabs.value;this.slabs.forEach((s,r)=>n[r].set(s.x0,s.x1,s.y0,s.y1)),this.glowMaterial.uniforms.uSlabCount.value=this.slabs.length,this.computeMaterial.uniforms.uCount.value=this.charges.count,this.chargeTexture.needsUpdate=!0,t!==null&&t!==this.lineKey&&(this.lineKey=t,this.retrace(e))}setLook(t,e={}){this.lineMaterial.uniforms.uTime.value=t,this.lineMaterial.uniforms.uReveal.value=e.reveal??1e6,this.lineMaterial.uniforms.uOpacity.value=e.lines??1,this.glowMaterial.uniforms.uGain.value=Zu*(e.glow??1),this.lines.visible=(e.lines??1)>.001,this.glow.visible=(e.glow??1)>.001}render(t){if(!this.glowDirty||!this.glow.visible)return;this.glowDirty=!1;const e=t.getRenderTarget();t.setRenderTarget(this.target),t.render(this.computeScene,this.computeCamera),t.setRenderTarget(e)}retrace(t){const e={z:this.z,bounds:this.bounds,slabs:this.slabs,slabMargin:Ju*.6,maxLength:150,minField:10**(Ua-.25)},n=new Float64Array(3);let s=0,r=0;for(const a of t)for(let l=0;l<a.count&&r<Ku;l++){const c=a.x0+(l+.5)/a.count*(a.x1-a.x0),u=a.y+a.normal*Ju,h=or(this.charges,c,u,this.z,n);if(n[1]*a.normal<=h*.25)continue;const d=cp(this.charges,c,u,e,this.trace.subarray(fi),Bl-1);d<3||(this.trace[0]=c,this.trace[1]=a.y,this.trace[2]=this.trace[fi+2],s=this.writeRibbon(d+1,s),r++)}const o=this.lines.geometry;o.setDrawRange(0,s),o.attributes.position.needsUpdate=!0,o.attributes.aAlpha.needsUpdate=!0,o.attributes.aArc.needsUpdate=!0}writeRibbon(t,e){const n=this.trace,s=wy/2;let r=e,o=0,a=n[0],l=n[1],c=ju(n[2]),u=0,h=0,d=0;for(let f=1;f<t;f++){const g=n[f*fi],_=n[f*fi+1],m=ju(n[f*fi+2]),p=g-a,S=_-l,x=Math.hypot(p,S)||1e-6,v=-S/x*s,w=p/x*s;f===1&&(h=v,d=w),o+=x,r=this.put(r,a+h,l+d,c,u),r=this.put(r,a-h,l-d,c,u),r=this.put(r,g+v,_+w,m,o),r=this.put(r,a-h,l-d,c,u),r=this.put(r,g-v,_-w,m,o),r=this.put(r,g+v,_+w,m,o),a=g,l=_,c=m,u=o,h=v,d=w}return r}put(t,e,n,s,r){const o=t*3;return this.linePositions[o]=e,this.linePositions[o+1]=n,this.linePositions[o+2]=this.z,this.lineAlpha[t]=s,this.lineArc[t]=r,t+1}}function ju(i){const t=(i-Ua)/(Uf-Ua);return .03+.97*(t<0?0:t>1?1:t)**1.7}function Va(i,t){const{conventional:e,polymagnet:n}=i.attach,s=(t.polymagnetReveal??0)>0;return{title:"Holding Force on Steel vs. Gap",xLabel:"Gap to steel (mm)",yLabel:"Holding force (relative)",xRange:[0,8],yRange:[0,3.6],xTicks:[0,2,4,6,8].map(r=>({value:r,label:String(r)})),yTicks:[0,1,2,3].map(r=>({value:r,label:r===0?"0":`${r}x`})),series:[{label:"Conventional",color:Wt.seriesConv,xs:e.x,ys:e.y,reveal:t.conventionalReveal??1},...s?[{label:"Polymagnet",color:Wt.seriesPoly,xs:n.x,ys:n.y,reveal:t.polymagnetReveal}]:[]],markers:t.markers}}const jt=36,Iy=15,zo=[.5,2],Qu=2.5,ko=5,td=5.6,Dy=3,zl=8.5,Mn=6,ts=tt+10,es=3,ed=new P(0,1,0),Uy=[{at:0,lines:[{text:"Same size and same grade as the conventional magnet, with 2.7 to 3.4 times the holding force on steel."}],tag:"CMR-measured"},{at:Mn,lines:[{text:"The written field closes through the target at the surface instead of spreading into the surroundings."},{text:"Nearby electronics see far less of it.",at:Mn+1.3}]}];class Ny extends Be{id="attach";title="Attach: Holding Force and Field Containment";script=10.5;conventional;polymagnet;field;seeds;pullConventional=new ys;pullPolymagnet=new ys;sensors=[eo(),eo()];detachTime;from=new P;sensorReference=1;constructor(t){super(t),this.conventional=new oe(t.lattice,{faceUp:!1,style:"conventional"}),this.polymagnet=new oe(t.lattice,{faceUp:!1}),this.polymagnet.setOpacity(.45),we(this.polymagnet,Te(t.physics.patterns.attach)),this.conventional.group.position.x=-jt,this.polymagnet.group.position.x=jt;const e=Xc(58,46,.8),n=Xc(58,46,.8);e.position.x=-jt,n.position.x=jt,this.field=new Ga({bounds:[-104,-1,104,74],floatTargets:t.floatTargets});const s=(a,l,c)=>({y:l,normal:c,x0:a-tt+.6,x1:a+tt-.6,count:22}),r=(a,l)=>({y:0,normal:1,x0:a,x1:l,count:7});this.seeds=[s(-jt,0,1),s(-jt,0,-1),s(jt,0,1),s(jt,0,-1),r(-jt-tt-22,-jt-tt-.5),r(-jt+tt+.5,-jt+tt+16),r(jt-tt-16,jt-tt-.5),r(jt+tt+.5,jt+tt+22)],this.sensors[0].group.position.set(-jt-ts,es,0),this.sensors[1].group.position.set(jt+ts,es,0),this.group.add(this.conventional.group,this.polymagnet.group,e,n,this.field.group,this.pullConventional.group,this.pullPolymagnet.group,this.sensors[0].group,this.sensors[1].group);let o=Qu;for(;o<ko&&this.pull(o)<1;)o+=.005;this.detachTime=o,this.describeField(re,re,"reference"),this.sensorReference=this.field.magnitudeAt(-jt-ts,es+1)}pull(t){return Dy*X(t,Qu,ko)}descent(t){return ht(Iy,re,Vn(ve(t,zo[0],zo[1])))}conventionalGap(t){return t<this.detachTime?this.descent(t):t<Mn-.1?ht(re,13,Nd(ve(t,this.detachTime,this.detachTime+.55))):ht(13,re,Vn(ve(t,Mn-.1,Mn+.7)))}lineOpacity(t){const e=[[zo[0],zo[1]],[this.detachTime,this.detachTime+.55],[Mn-.1,Mn+.7]];let n=1;for(const[s,r]of e)n=Math.min(n,1-ye(t,s-.2,s,r+.05,r+.4));return n}describeField(t,e,n){const{lattice:s,physics:r}=this.world;this.field.begin(),this.field.charges.addMagnet(s,r.patterns.uniform,-jt,t,0,0,1),this.field.charges.addMagnet(s,r.patterns.attach,jt,e,0,0,1,Tt,gi),this.field.charges.addImages(0),this.field.addSlab(-200,200,-50,0),this.field.addSlab(-jt-tt,-jt+tt,t,t+Tt),this.field.addSlab(jt-tt,jt+tt,e,e+Tt),this.seeds[0].y=t+Tt,this.seeds[1].y=t,this.seeds[2].y=e+Tt,this.seeds[3].y=e,this.field.commit(n,this.seeds)}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=this.conventionalGap(t),l=this.descent(t),c=this.pull(t),u=t>=this.detachTime;n.orbit([0,9,0],268,ht(-5,5,e/this.duration),ht(23,19,X(t,5.4,7))),this.conventional.group.position.y=a,this.polymagnet.group.position.y=l;const h=this.lineOpacity(t);this.describeField(a,l,h>.01?`${Math.round(a*4)}:${Math.round(l*4)}`:null),this.field.setLook(e,{lines:h,glow:ht(.8,1.2,X(t,Mn-.4,Mn+.6))});const d=1-X(t,td,td+.5),f=u?1-X(t,this.detachTime+.1,this.detachTime+.6):Math.min(c,1);this.from.set(-jt,a+Tt+.8,0),this.pullConventional.set(this.from,ed,f*zl),this.from.set(jt,l+Tt+.8,0),this.pullPolymagnet.set(this.from,ed,c*d*zl);const g=X(t,Mn+.3,Mn+.9),_=[this.field.magnitudeAt(-jt-ts,es+1)/this.sensorReference,this.field.magnitudeAt(jt+ts,es+1)/this.sensorReference];this.sensors.forEach((p,S)=>{p.group.visible=g>.01,p.led.color.setHex(_[S]>.35?Vt.warning:Vt.good)}),this.caption(e,Uy),s.setPanels(1,1),s.inset.begin(Ln),s.inset.disc(),qe(s.inset,o,Te(r.patterns.attach)),s.chart.draw(Va(r,{polymagnetReveal:1,markers:[{series:0,x:a,y:Me(r.attach.conventional,a)},{series:1,x:l,y:Me(r.attach.polymagnet,l)}]}));const m=Ie(t);s.label("name-conventional","Conventional",-jt,-1.2,24,{anchor:"below",opacity:m}),s.label("name-polymagnet","Polymagnet",jt,-1.2,24,{anchor:"below",detail:"same size, same grade",opacity:m}),s.label("release","Releases",-jt,a+Tt+12,0,{anchor:"above",detail:"at 1x pull",opacity:Math.min(X(t,this.detachTime,this.detachTime+.3),1-X(t,Mn-.5,Mn-.1))}),s.label("holds","Still holding",jt,l+Tt+c*zl+5,0,{anchor:"above",detail:"2.7x to 3.4x, measured",opacity:Math.min(X(t,ko-.5,ko),d)}),s.label("sensor-conventional","Nearby sensor",-jt-ts,es+3,0,{anchor:"above",detail:_[0]>.35?"disturbed":"quiet",status:_[0]>.35?"warning":"good",opacity:g}),s.label("sensor-polymagnet","Nearby sensor",jt+ts,es+3,0,{anchor:"above",detail:_[1]>.35?"disturbed":"quiet",status:_[1]>.35?"warning":"good",opacity:g})}prepare(){this.field.render(this.world.stage.renderer)}}const nd=.4,id=1.2,sd=1.9,rd=.22,Ho=.7;function Go(i,t){i.style.opacity=t.toFixed(3),i.style.transform=`translateY(${((1-t)*.8).toFixed(3)}rem)`}function Vo(i,t){const e=i.querySelector(t);if(!e)throw new Error(`The card overlay is missing its ${t} element`);return e}class od extends Be{constructor(t,e){super(t),this.spec=e,this.id=e.id,this.title=e.heading,this.script=e.seconds;const n=t.hud.cardElement;this.heading=Vo(n,"#card-heading"),this.lead=Vo(n,"#card-lead"),this.list=Vo(n,"#card-items"),this.brand=Vo(n,"#card-brand")}id;title;script;pacing={lead:0,pace:1,tail:0};heading;lead;list;brand;setVisible(t){super.setVisible(t),this.world.hud.setCard(t),t&&this.fill()}fill(){this.heading.textContent=this.spec.heading,this.lead.textContent=this.spec.lead??"",this.list.replaceChildren(...(this.spec.items??[]).map(t=>{const e=document.createElement("li");return e.textContent=t,e})),this.brand.style.display=this.spec.brand?"":"none"}draw(t){const{stage:e,hud:n}=this.world;e.orbit([0,0,0],240,0,30),n.setCaption([]),n.setPanels(0,0),Go(this.heading,X(t,nd,nd+Ho)),Go(this.lead,X(t,id,id+Ho));const s=this.list.children;for(let o=0;o<s.length;o++){const a=sd+o*rd;Go(s[o],X(t,a,a+Ho))}const r=sd+s.length*rd+.4;Go(this.brand,X(t,r,r+Ho))}}const ci=33,Wo={width:136,depth:62},Hs=[1.2,2.8],Xo=[1.4,3.4],hs=[4.9,5.9],qo=15,Pe={width:20,height:30,depth:40,bottom:4},Ui={inner:5,outer:9},ad=new P(0,1,0),Fy=[{at:0,lines:[{text:"Steel pole pieces gather a magnet's flux over a wide face and deliver it through a small one."},{text:"The force per unit area at the small face rises well above what the magnet gives alone.",at:2.9}],tag:"CMR patent US 8,917,154"},{at:hs[0]-.6,lines:[{text:"So a design can reach its hold with less rare-earth material, or with none: this one uses ferrite."}]}];function ld(i,t){const e=Pe.width/2,n=Pe.bottom+Pe.height,s=new so,r=[[e,n],[e+6,n],[e+6,12],[Ui.outer,0],[Ui.inner,0],[e,Pe.bottom+1]];(i===1?r:r.map(([l,c])=>[-l,c]).reverse()).forEach(([l,c],u)=>u===0?s.moveTo(l,c):s.lineTo(l,c)),s.closePath();const a=new xr(s,{depth:Pe.depth,bevelEnabled:!1});return a.translate(0,0,-40/2),new gt(a,t)}class Oy extends Be{id="concentrate";title="Flux Concentration: Rare-Earth Reduction";script=8.4;pullRareEarth=new ys;pullFerrite=new ys;paths;feet;from=new P;constructor(t){super(t);const e=Xc(Wo.width,Wo.depth,3),n=new oe(t.lattice,{faceUp:!1,style:"conventional"});n.group.position.set(-ci,re,0);const s=new ne;s.position.x=ci;const r=ke(Pe.width,Pe.height,Pe.depth,ei(5063740,.75));r.position.y=Pe.bottom+Pe.height/2;for(const[c,u]of[[-1,Vt.north],[1,Vt.south]]){const h=ke(.5,Pe.height-2,Pe.depth+.4,ei(u,.6));h.position.set(c*(Pe.width/2-.3),r.position.y,0),s.add(h)}const o=Oi(11121344,.36);s.add(r,ld(-1,o),ld(1,o)),this.paths=new Le({color:Vt.field,toneMapped:!1,transparent:!0,opacity:0}),this.feet=new Le({color:Vt.field,toneMapped:!1,transparent:!0,opacity:0});const a=Pe.depth/2+.5,l=Pe.width/2;for(const c of[-1,1]){for(const[h,d]of[[30,.8],[23,.5],[16,.2]]){const f=l+6*d,g=new fh([new P(c*(l+.4),h,a),new P(c*f,h-2.6,a),new P(c*f,Math.min(12.5,h-5.5),a),new P(c*(Ui.inner+.4+3.4*d),1.4,a),new P(c*(Ui.inner+.3+3.4*d),.2,a)],!1,"centripetal");s.add(new gt(new ka(g,48,.24,8),this.paths))}const u=ke(Ui.outer-Ui.inner,.5,Pe.depth,this.feet);u.position.set(c*((Ui.outer+Ui.inner)/2),.25,0),s.add(u)}this.group.add(e,n.group,s,this.pullRareEarth.group,this.pullFerrite.group)}draw(t,e){const{stage:n,hud:s,physics:r}=this.world,o=r.applications.concentration;n.orbit([0,10,0],236,ht(-14,6,e/this.duration),19),this.paths.opacity=.9*X(t,Hs[0],Hs[1]),this.feet.opacity=.85*X(t,Hs[1]-.6,Hs[1]+.2);const a=X(t,hs[0],hs[1]);this.from.set(-ci,re+Tt+.8,0),this.pullRareEarth.set(this.from,ad,a*qo),this.from.set(ci,Pe.bottom+Pe.height+.8,0),this.pullFerrite.set(this.from,ad,a*qo),this.caption(e,Fy),s.setPanels(X(t,Xo[0]-.5,Xo[0]),0);const l=X(t,Xo[0],Xo[1]);s.chart.draw({title:"Force Density vs. Flux Concentration",xLabel:"Collecting area / emitting area",yLabel:"Force per unit area (relative)",xRange:[1,9],yRange:[0,4.8],xTicks:[1,3,5,7,9].map(h=>({value:h,label:`${h}x`})),yTicks:[0,1,2,3,4].map(h=>({value:h,label:h===0?"0":`${h}x`})),series:[{label:"Ferrite source",color:Wt.seriesPoly,xs:o.ferrite.x,ys:o.ferrite.y,reveal:l},{label:"Rare-earth source",color:Wt.seriesConv,xs:o.ndfeb.x,ys:o.ndfeb.y,reveal:l}],markers:l>.99?[{series:0,x:o.design.ratio,y:o.design.density},{series:1,x:1,y:o.ndfeb.y[0]}]:[]});const c=Ie(t,.2);s.label("concentrate-rare","Rare-earth magnet",-ci,-5,Wo.depth/2,{anchor:"below",detail:"bare face on steel",opacity:c}),s.label("concentrate-ferrite","Ferrite with pole pieces",ci,-5,Wo.depth/2,{anchor:"below",detail:"no rare-earth material",opacity:c}),s.label("concentrate-gather","Flux gathered over the pole face",ci-25,27,20,{anchor:"left",detail:"and delivered through a small foot",opacity:Math.min(X(t,Hs[0]+.4,Hs[0]+.9),1-X(t,hs[0]-.9,hs[0]-.5))});const u=X(t,hs[1]-.1,hs[1]+.3);s.label("concentrate-hold-rare","Holds",-ci,re+Tt+qo+6,0,{anchor:"above",detail:"the test load",opacity:u}),s.label("concentrate-hold-ferrite","Holds",ci,Pe.bottom+Pe.height+qo+6,0,{anchor:"above",detail:"the same load",opacity:u})}}const By=[{at:0,lines:[{text:"A conventional magnet has one pole on each face."},{text:"Its field spreads into the space around it, and its behavior is fixed when it is made.",at:1.8}]}];class zy extends Be{id="conventional";title="Conventional Magnet";script=5;field;seeds;constructor(t){super(t);const e=new oe(t.lattice,{faceUp:!0,style:"conventional"});this.field=new Ga({bounds:[-64,-48,64,54],floatTargets:t.floatTargets}),this.group.add(e.group,this.field.group),this.field.begin(),this.field.charges.addMagnet(t.lattice,t.physics.patterns.uniform,0,0,0,0,-1),this.field.addSlab(-tt,tt,-Tt,0),this.seeds=[{y:0,normal:1,x0:-tt+.8,x1:tt-.8,count:13},{y:-Tt,normal:-1,x0:-tt+.8,x1:tt-.8,count:13}],this.field.commit("static",this.seeds)}draw(t,e){const{stage:n,hud:s,physics:r}=this.world;n.orbit([0,2,0],215,ht(-16,8,e/this.duration),15),this.field.setLook(e,{reveal:ht(0,170,X(t,.5,3)),glow:X(t,.3,1.8)}),this.caption(e,By),s.setPanels(X(t,1,1.5),1),s.inset.begin(Ln),s.inset.disc(),s.inset.solid(1),s.chart.draw(Va(r,{conventionalReveal:X(t,1.4,3.2)}));const o=Ie(t,.2);s.label("north","North pole",0,2,-tt,{anchor:"above",opacity:o}),s.label("south","South pole",0,-Tt-2,tt,{anchor:"below",opacity:o}),s.label("stray","Field reaches well beyond the part",44,22,0,{anchor:"right",opacity:X(t,2.8,3.5)})}prepare(){this.field.render(this.world.stage.renderer)}}const cd=[.5,2.3],Ci=2.7,ui=3.5,en=[5.2,6.2],On=[7,8],Gs=8.2,ky=46,hd=22,Hy=60,Gy=5,Vy=14,kl=2*tt,Wy=[{at:0,lines:[{text:"NASA's cryogenic fluid coupler uses patterned magnets to pull its two halves together and latch them."},{text:"Turning one half through a set angle releases it.",at:ui+.3}]},{at:en[1]+.7,lines:[{text:"NASA measured 45 lbf to mate this coupler without the magnets, and 0 to 22 lbf with them."},{text:"The figure depends on the magnet pattern.",at:On[0]+.2}],tag:"NASA-published, AIAA SciTech 2024"}];class Xy extends Be{id="coupler";title="Cryogenic Fluid Coupler: Self-Mating Connection";script=9.6;free;freeHalf=new ne;fluid;pullByDiameter;releaseTime;constructor(t){super(t);const{lattice:e,physics:n}=t,s=n.applications.patterns.coupler,r=new oe(e,{faceUp:!0,thickness:Bn});we(r,Te(rn(s))),this.free=new oe(e,{faceUp:!1,thickness:Bn,indexMark:!0}),this.free.setOpacity(.34),we(this.free,Te(s));const o=Oi(Vt.steel,.34),a=new De({color:Vt.glass,metalness:.1,roughness:.2,transparent:!0,opacity:.3,depthWrite:!1});this.fluid=new Le({color:9430271,toneMapped:!1,transparent:!0,opacity:0});const l=f=>{const g=new ne,_=Df(tt+.4,tt+3.4,Bn-1.5,o);_.position.y=f===1?1.5:-Bn;const m=ki(tt+7,3,o,48);m.position.y=f*(Bn+1.5);const p=ki(6.5,58,a,32);p.position.y=f*(Bn+3+29),p.renderOrder=6;const S=ki(3.4,58,this.fluid,20);return S.position.copy(p.position),g.add(_,m,p,S),g},c=new ne;c.add(r.group,l(-1)),this.freeHalf.add(this.free.group,l(1));const u=new ne;u.rotation.z=-Math.PI/2,u.add(c,this.freeHalf),this.group.add(u);const h=n.applications.coupler.pull;this.pullByDiameter=kn(Array.from(h.x,f=>f/kl),h.y);let d=en[0];for(;d<en[1]&&Me(n.applications.coupler.hold,this.yaw(d))>.02;)d+=.005;this.releaseTime=d}yaw(t){return t<en[0]?Vy*(1-Vn(ve(t,Ci,ui))):Hy*(X(t,en[0],en[1])-X(t,On[0],On[1]))}gap(t){return t<Ci?ht(ky,Xs,X(t,cd[0],cd[1])):t<this.releaseTime?ht(Xs,re,Vn(ve(t,Ci,ui))):t<On[0]?ht(re,hd,Nd(ve(t,this.releaseTime,this.releaseTime+.8))):t<Gs?ht(hd,Xs,X(t,On[0],On[1])):ht(Xs,re,Vn(ve(t,Gs,Gs+.8)))}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,{coupler:a,patterns:l}=r.applications,c=this.gap(t),u=this.yaw(t),h=t<en[0]?Gy*(1-Vn(ve(t,Ci,ui))):0;n.orbit([14,0,0],244,ht(30,20,e/this.duration),15),this.freeHalf.position.set(0,c,h),this.free.group.rotation.y=u*mn;const d=c<re+.05&&Math.abs(u)<1;this.fluid.opacity=.85*Math.max(ye(t,ui+.1,ui+.6,en[0]-.2,en[0]+.1),X(t,Gs+.9,Gs+1.3)),this.caption(e,Wy),s.inset.begin(Ln),s.inset.disc(0,u*mn),qe(s.inset,o,Te(l.coupler));const f=t>=en[0]-.3&&t<On[1],g=Math.min(1-ye(t,en[0]-.6,en[0]-.35,en[0]-.25,en[0]),1-ye(t,On[1]-.3,On[1]-.05,On[1]+.05,On[1]+.3));if(s.setPanels(g,1),f)s.chart.draw({title:"Holding Force vs. Turn of One Half",xLabel:"Turn from the latched position (degrees)",yLabel:"Holding force (relative)",xRange:[0,90],yRange:[-1.1,1.1],xTicks:[0,30,60,90].map(p=>({value:p,label:String(p)})),yTicks:[-1,0,1].map(p=>({value:p,label:String(p)})),series:[{label:"Coupler pair",color:Wt.seriesPoly,xs:a.hold.x,ys:a.hold.y}],markers:[{series:0,x:u,y:Me(a.hold,u)}],zones:[{x0:0,x1:36,label:"Holds"},{x0:54,x1:90,label:"Pushes apart"}]});else{const p=c/kl;s.chart.draw({title:"Magnetic Pull vs. Separation",xLabel:"Separation (magnet diameters)",yLabel:"Pull (relative)",xRange:[0,.8],yRange:[0,1.08],xTicks:[0,.2,.4,.6,.8].map(S=>({value:S,label:String(S)})),yTicks:[0,.5,1].map(S=>({value:S,label:String(S)})),series:[{label:"Coupler pair",color:Wt.seriesPoly,xs:this.pullByDiameter.x,ys:this.pullByDiameter.y}],markers:[{series:0,x:p,y:Me(this.pullByDiameter,p)}],reference:{x:Xs/kl,label:"Let go here"}})}const _=Math.min(Ie(t,.2),1-X(t,Ci-.3,Ci));s.label("coupler-fixed","Fixed half",-Bn-24,-11,0,{anchor:"below",opacity:_}),s.label("coupler-free","Free half",c+Bn+24,-11,h,{anchor:"below",opacity:_}),s.label("coupler-magnets","Patterned magnets",c/2,tt+6,0,{anchor:"above",detail:"from CMR, under a NASA contract",opacity:_}),s.label("coupler-letgo","Let go",c+Bn+10,tt+8,0,{anchor:"above",detail:"about an inch apart on NASA's coupler",opacity:ye(t,Ci-.25,Ci,ui-.1,ui+.2)});const m=t>=this.releaseTime&&t<Gs?"Released":d?"Latched":t>=en[0]&&t<this.releaseTime?"Turning":"";s.label("coupler-status",m,0,tt+8,0,{anchor:"above",detail:m==="Latched"?"fluid flows through the centre":m==="Turning"?`${Math.round(u)} degrees`:"",opacity:m?Ie(t,ui):0})}}const Hl=.8,qy=36,Ue=[5,5.8],ud=.6,Yy=[{at:0,lines:[{text:"A written track turns under a magnetic sensor, which reads the passing poles as a wave."},{text:"Two readings a quarter wave apart give the angle, with no contact and no optics.",at:2}]},{at:Ue[0]-.4,lines:[{text:"Rewritten with twice the poles, the same blank reads the angle more finely."}]}];class $y extends Be{id="encoder";title="Position Sensing: Written Encoder Track";script=8.6;disc;sensors=[eo(),eo()];constructor(t){super(t),this.disc=new oe(t.lattice,{faceUp:!0,indexMark:!0}),this.group.add(this.disc.group);const e=ei(3752527,.5);for(const n of this.sensors){n.group.rotation.x=Math.PI,n.group.scale.setScalar(ud);const s=ke(44,1.2,3,e);s.position.set(24,-1.2,0),n.group.add(s),this.group.add(n.group)}}angle(t){const e=Math.max(0,t-Hl);return qy*(e-.3*(1-Math.exp(-e/.3)))}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,{coarse:a,fine:l}=r.applications.encoder,c=X(t,Ue[0],Ue[1]),u=t<(Ue[0]+Ue[1])/2?a:l,h=this.angle(t),d=h%360;n.orbit([2,2,0],172,ht(-24,-8,e/this.duration),38),this.disc.group.rotation.y=h*mn;const f=Mi(o,a.pattern,l.pattern,t,Ue[0],Ue[1]);we(this.disc,f);const g=ht(a.height,l.height,c)+1.4*ud,_=ht(a.quarterDeg,l.quarterDeg,c)*mn;this.sensors[0].group.position.set(kr,g,0),this.sensors[0].group.rotation.y=0,this.sensors[1].group.position.set(kr*Math.cos(_),g,-kr*Math.sin(_)),this.sensors[1].group.rotation.y=-_;const m=Me(u.a,d),p=Me(u.b,d),S=d+Me(u.error,d);this.caption(e,Yy),s.setPanels(1-ye(t,Ue[0]-.15,Ue[0]+.15,Ue[1]-.15,Ue[1]+.15),1),s.inset.begin(Ln),s.inset.disc(0,h*mn),qe(s.inset,o,f);const x=h%180;s.chart.draw({title:"Sensor Signals vs. Rotation",xLabel:"Rotation (degrees)",yLabel:"Signal (relative)",xRange:[0,180],yRange:[-1.3,1.3],xTicks:[0,45,90,135,180].map(w=>({value:w,label:String(w)})),yTicks:[-1,0,1].map(w=>({value:w,label:String(w)})),series:[{label:"Sensor A",color:Wt.seriesPoly,xs:u.a.x,ys:u.a.y},{label:"Sensor B",color:Wt.seriesConv,xs:u.b.x,ys:u.b.y}],markers:[{series:0,x,y:m},{series:1,x,y:p}]});const v=Math.min(Ie(t,.2),1-ye(t,Ue[0]-.2,Ue[0],Ue[1],Ue[1]+.2));s.label("encoder-sensors","Sensor A and sensor B",kr+22,g+3,0,{anchor:"right",detail:"a quarter wave apart",opacity:v}),s.label("encoder-read",`Angle read: ${Math.round((S%360+360)%360)} degrees`,-30,3,10,{anchor:"left",detail:`true angle: ${Math.round(d)} degrees`,opacity:Math.min(X(t,Hl+1.2,Hl+1.7),v)}),s.label("encoder-rewrite","Rewriting the track",0,12,0,{anchor:"above",detail:"twice the poles",opacity:ye(t,Ue[0]-.1,Ue[0]+.1,Ue[1],Ue[1]+.25)})}}const Pn=[1,5.2],dn=[5.6,6.8],Pi=[7.2,9.4],dd=.3,Gl=20,fd=4,pd=.9,Ky=.8,Yo=Tt+1.6,Zy=[{at:0,lines:[{text:"A payload floats on the magnetic gap, kept centred by guide rods."},{text:"Slow motion of the structure passes straight to it. Faster vibration barely reaches it, with no power.",at:3.3}]},{at:dn[0]-.2,lines:[{text:"A payload ten times heavier rides lower, where the gap is stiffer."},{text:"Its isolation band shifts far less than it would on a coil spring.",at:dn[1]+.2}]}],$o=Array.from({length:121},(i,t)=>.25*2**(t/24));class Jy extends Be{id="isolation";title="Vibration Isolation: Floating Payload";script=9.8;table=new ne;floating=new ne;light=new ne;heavy;lightCurve;heavyCurve;constructor(t){super(t);const{lattice:e,physics:n}=t,s=new oe(e,{faceUp:!0});we(s,Te(n.patterns.springBase));const r=new oe(e,{faceUp:!1});we(r,Te(n.patterns.springMate));const o=ke(104,3,70,ei(Vt.dark,.55));o.position.y=-Tt-1.5,this.table.add(s.group,o);for(const h of[1,-1]){const d=ki(.9,46,Oi(Vt.steel,.3),14);d.position.set(h*31,23-Tt,0),this.table.add(d)}const a=ke(72,1.6,46,Oi(11186879,.4));a.position.y=Tt+.8;const l=ke(24,15,18,ei(2896703,.5));l.position.y=Yo+7.5;const c=ki(5.2,9,Oi(8226708,.25),24);c.rotation.x=Math.PI/2,c.position.set(0,Yo+8,13),this.light.add(l,c),this.heavy=ke(50,26,36,Oi(5989490,.5)),this.floating.add(r.group,a,this.light,this.heavy),this.group.add(this.table,this.floating);const u=n.applications.isolation.heavyResonance;this.lightCurve={x:$o.map(Math.log2),y:$o.map(h=>lo(h).gain)},this.heavyCurve={x:$o.map(Math.log2),y:$o.map(h=>lo(h/u).gain)}}ratio(t){return t>=Pi[0]?fd:dd*Gl**ve(t,Pn[0],Pn[1])}phase(t){if(t>=Pi[0])return 2*Math.PI*pd*fd*(t-Pi[0]);const e=Pn[1]-Pn[0],n=Gl**ve(t,Pn[0],Pn[1])-1;return 2*Math.PI*pd*dd*e*n/Math.log(Gl)}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=r.applications.isolation,l=t>=Pi[0],c=this.ratio(t),u=this.phase(t),h=Ky*Math.max(ye(t,Pn[0],Pn[0]+.4,Pn[1]-.3,Pn[1]),ye(t,Pi[0],Pi[0]+.4,Pi[1]-.3,Pi[1])),d=lo(l?c/a.heavyResonance:c),f=h*Math.sin(u),g=h*d.gain*Math.sin(u-d.lag),_=X(t,dn[0]+.7,dn[1]),m=ht(a.gap.light,a.gap.heavy,_)-.35*Math.sin(Math.PI*_)*(1-_);n.orbit([0,12,0],196,ht(24,14,e/this.duration),9),this.table.position.y=f,this.floating.position.y=m+g;const p=X(t,dn[0],dn[0]+.55);this.light.position.set(74*p,30*Math.sin(Math.PI*p/2),0),this.light.visible=p<1;const S=X(t,dn[0]+.35,dn[0]+.95);this.heavy.position.y=Yo+13+44*(1-S),this.heavy.visible=S>0,this.caption(e,Zy),s.setPanels(1,1),s.inset.begin(Ln),s.inset.disc(),qe(s.inset,o,Te(r.patterns.springMate));const x=X(t,dn[0]+.6,dn[1]+.2);s.chart.draw({title:"Motion Passed to the Payload vs. Frequency",xLabel:"Vibration frequency (multiple of the resonance)",yLabel:"Payload motion (relative to base)",xRange:[-2,3],yRange:[0,2.8],xTicks:[.25,.5,1,2,4,8].map(A=>({value:Math.log2(A),label:`${A}x`})),yTicks:[0,1,2].map(A=>({value:A,label:String(A)})),series:[{label:"Light payload",color:Wt.seriesPoly,xs:this.lightCurve.x,ys:this.lightCurve.y},...x>0?[{label:"Ten times heavier",color:Wt.seriesConv,xs:this.heavyCurve.x,ys:this.heavyCurve.y,reveal:x}]:[]],markers:h>.02?[l?{series:1,x:Math.log2(c),y:lo(c/a.heavyResonance).gain}:{series:0,x:Math.log2(c),y:d.gain}]:[]});const v=m+g+Yo+(l||S>.5?30:19),w=l?"isolated":c<.7?"rides along with the base":c<Math.SQRT2?"near resonance: moves more than the base":d.gain>.5?"moves less than the base":"isolated";s.label("isolation-payload","Payload",0,v,0,{anchor:"above",detail:h>.05?w:"",opacity:Math.min(Ie(t,.3),1-ye(t,dn[0]-.1,dn[0]+.1,dn[1]-.2,dn[1]))}),s.label("isolation-base","Structure",56,-Tt-4,0,{anchor:"right",detail:h>.05?c<.7?"moving slowly":c<Math.SQRT2?"moving at the resonance":"vibrating fast":"",opacity:Ie(t,.3)}),s.label("isolation-rods","Guide rods",31,44-Tt,0,{anchor:"right",opacity:Math.min(Ie(t,.3),1-X(t,Pn[0]+.6,Pn[0]+1.1))})}}const $n=2.4,Sn=.6,Nr=.6,jy=1,ns=[1.15,1.5],Fr=1.95,Ko=2.55,Qy=.4,tM=22,Zo=15,Vl=50,eM=new P(0,1,0),nM=[{at:0,lines:[{text:"These three parts are the same size and shape. Each carries a different code."},{text:"Offered to the same mount, a wrong code barely holds.",at:Sn-.1}]},{at:Sn+2*$n-.5,lines:[{text:"Only the matching code latches."},{text:"Suited to payload mounts, interlocks and tamper-evident closures.",at:Sn+2*$n+1.7}]}];class iM extends Be{id="keyed";title="Keyed Interface: Coded Engagement";script=Sn+2*$n+3.2;parts=[];codes;pull=new ys;from=new P;constructor(t){super(t);const{lattice:e,physics:n}=t,s=new oe(e,{faceUp:!0,indexMark:!0});we(s,Te(rn(n.patterns.align))),this.group.add(s.group,this.pull.group),this.codes=[...n.applications.patterns.decoys,n.patterns.align];for(const r of this.codes){const o=new oe(e,{faceUp:!1,indexMark:!0});o.setOpacity(.38),we(o,Te(r)),this.parts.push(o),this.group.add(o.group)}}waiting(t){return[62,4,8-Vl*t]}rejected(t){return[-62,3,4-Vl*t]}pose(t,e){const n=e-(Sn+t*$n),[s,r,o]=this.waiting(t);if(n<=0)return{x:s,y:r,z:o,pull:0,lifted:!1};const a=t===this.codes.length-1,l=X(n,0,Nr),c=Math.sin(Math.PI*l)*10;if(n<Nr)return{x:ht(s,0,l),y:ht(r,Zo,l)+c,z:ht(o,0,l),pull:0,lifted:!1};const u=a?xi(Ea(n,Nr+.12,.3)):Vn(ve(n,Nr,jy)),h=ht(Zo,re,u),d=X(n,ns[0],ns[1]);if(a||n<ns[1])return{x:0,y:h,z:0,pull:d,lifted:!1};const f=X(n,ns[1],Fr),g=X(n,Fr,Ko),[_,m,p]=this.rejected(t);return{x:ht(0,_,g),y:ht(ht(re,Zo+3,f),m,g)+Math.sin(Math.PI*g)*8,z:ht(0,p,g),pull:1-X(n,Fr-.2,Fr+.15),lifted:!0}}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=r.applications.keyed;n.orbit([0,4,0],236,ht(18,8,e/this.duration),34);const l=Math.max(0,Math.min(this.codes.length-1,Math.floor((t-Sn)/$n)));let c=0,u=!1;this.parts.forEach((_,m)=>{const p=this.pose(m,t);_.group.position.set(p.x,p.y,p.z),m===l&&(c=p.pull,u=p.lifted,this.from.set(p.x,p.y+Tt+.8,p.z))}),this.pull.set(this.from,eM,c*(Qy*tM+3)),this.caption(e,nM),s.setPanels(1,1),s.inset.begin("Codes, Face View",2),s.inset.disc(0,0,"Mount"),qe(s.inset,o,Te(rn(r.patterns.align))),s.inset.disc(1,0,"Part offered"),qe(s.inset,o,Te(this.codes[l]));const h=_=>X(t,Sn+_*$n+Nr,Sn+_*$n+ns[1]);s.chart.draw({title:"Holding Force vs. Position on the Mount",xLabel:"Offset from the centre of the mount (mm)",yLabel:"Holding force (relative)",xRange:[-16,16],yRange:[-.25,1.08],xTicks:[-15,-10,-5,0,5,10,15].map(_=>({value:_,label:String(_)})),yTicks:[0,.5,1].map(_=>({value:_,label:String(_)})),series:[{label:"Matching code",color:Wt.seriesPoly,xs:a.hold[2].x,ys:a.hold[2].y,reveal:h(2)},{label:"Other codes",color:Wt.seriesConv,xs:a.hold[0].x,ys:a.hold[0].y,reveal:h(0)},{label:"",color:Wt.seriesConv,xs:a.hold[1].x,ys:a.hold[1].y,reveal:h(1)}],markers:h(l)>.99?[{series:l===2?0:l+1,x:0,y:Me(a.hold[l],0)}]:[]});const d=t-(Sn+l*$n),f=l===this.codes.length-1,g=f?"Latches":u?"Comes away":"Barely holds";s.label("keyed-verdict",g,0,Zo+22,0,{anchor:"above",detail:f?"the matching code":"a wrong code",opacity:Math.min(X(d,ns[0],ns[0]+.25),f?1:1-X(d,Fr,Ko-.2))}),s.label("keyed-mount","Mount",-24,-4,8,{anchor:"left",opacity:Ie(t,.2)}),s.label("keyed-queue","Parts to try",62,8,8-2*Vl-tt-4,{anchor:"above",opacity:Math.min(Ie(t,.2),1-X(t,Sn+2*$n,Sn+2*$n+.4))}),s.label("keyed-rejects","Wrong codes",-62,0,4+tt+3,{anchor:"below",opacity:X(t,Sn+Ko-.3,Sn+Ko+.2)})}}const Jo=[.2,1],Wl=[1,1.8],Xl=1.9,Zs=[3.9,5.1],Li=5.9,jo=6.7,md=.35,sM=22,rM=new P(0,1,0),oM=[{at:0,lines:[{text:"The latch holds at full force only where the codes match."},{text:"A small twist drops the force and the part lifts free.",at:Zs[0]-1}]}];class aM extends Be{id="latch";title="Latch: Twist to Release";script=7.7;base;part;baseFrom;baseTo;pull=new ys;releaseTime;from=new P;constructor(t){super(t),this.base=new oe(t.lattice,{faceUp:!0,indexMark:!0}),this.part=new oe(t.lattice,{faceUp:!1,indexMark:!0}),this.part.setOpacity(.38),this.baseFrom=rn(t.physics.patterns.align),this.baseTo=rn(t.physics.patterns.latch),this.group.add(this.base.group,this.part.group,this.pull.group);let e=Zs[0];for(;e<Zs[1]&&Me(t.physics.latch.hold,this.twist(e))>md;)e+=.005;this.releaseTime=e}twist(t){const e=this.world.physics.latch.releaseAngleDeg;return t<Li?e*X(t,Zs[0],Zs[1]):e*(1-X(t,Li,jo))}gap(t){return t<Wl[1]?ht(12,re,Vn(ve(t,Wl[0],Wl[1]))):t<this.releaseTime?re:t<Li?ht(re,15,Vn(ve(t,this.releaseTime,this.releaseTime+.9))):t<jo?ht(15,2,X(t,Li,jo)):ht(2,re,xi(Ea(t,jo,.4)))}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=this.twist(t),l=this.gap(t);n.orbit([0,4,0],178,ht(-20,-10,e/this.duration),32),this.part.group.position.y=l,this.part.group.rotation.y=a*mn;const c=Mi(o,r.patterns.align,r.patterns.latch,t,Jo[0],Jo[1]);we(this.part,c),we(this.base,Mi(o,this.baseFrom,this.baseTo,t,Jo[0],Jo[1]));const u=Math.min(X(t,Xl,Xl+.7),1-X(t,Li-.6,Li-.2));this.from.set(0,l+Tt+.8,0),this.pull.set(this.from,rM,u*md*sM+u*3),this.caption(e,oM),s.setPanels(1,1),s.inset.begin(Ln),s.inset.disc(),qe(s.inset,o,c);const h=r.latch.hold;s.chart.draw({title:"Holding Force vs. Twist",xLabel:"Twist from the matched position (degrees)",yLabel:"Holding force (relative)",xRange:[-70,70],yRange:[-.3,1.08],xTicks:[-60,-30,0,30,60].map(g=>({value:g,label:String(g)})),yTicks:[0,.5,1].map(g=>({value:g,label:String(g)})),series:[{label:"Coded latch",color:Wt.seriesPoly,xs:h.x,ys:h.y}],markers:[{series:0,x:a,y:Me(h,a)}]});const d=l<re+.05,f=t<this.releaseTime?d&&u>.5?"Holds against the pull":"":t<Li?"Released":d?"Latched again":"";s.label("latch-status",f,0,l+Tt+16,0,{anchor:"above",detail:t>=Zs[0]&&t<Li?`twist ${Math.round(a)} degrees`:"",opacity:f?Ie(t,Xl):0})}}const Kn=[2.4,3.4],lM=1.25,cM=0,hM=14,uM=[{at:0,lines:[{text:"In NASA flight tests, a magnetic release carried a glider under a small aircraft."},{text:"On command the hold drops, and the magnets give the glider a push as it leaves.",at:Kn[0]-1.1}]},{at:Kn[1]+1.3,lines:[{text:"The mechanism released five times out of five."}],tag:"NASA-published, 2022"}],Nf=Tt+4,Di=9.5;function dM(){const i=new ne;i.position.y=Nf;const t=ei(12897496,.5),e=ei(3752527,.5),n=[[-74,.8],[-66,2.6],[-40,5.6],[-10,8.6],[20,Di],[48,8.8],[64,6.6],[74,3.6],[78,.4]].map(([g,_])=>new lt(_,g)),s=new gt(new ph(n,40),t);s.rotation.z=-Math.PI/2,s.position.y=Di;const r=new gt(new yr(1,24,16),e);r.scale.set(15,4.6,6.4),r.position.set(36,2*Di-2.2,0);const o=ke(30,2.2,196,t);o.position.set(14,2*Di+1.4,0);const a=ke(15,1.4,62,t);a.position.set(-65,Di+2,0);const l=ke(15,22,1.4,t);l.position.set(-67,Di+12,0),l.rotation.z=.28;const c=ke(26,4.6,12,e);c.position.set(0,-2.2,0);const u=new ne;u.position.set(78.6,Di,0);const h=new gt(new _s(27,48),new Le({color:10466508,transparent:!0,opacity:.12,side:Qe,depthWrite:!1}));h.rotation.y=Math.PI/2;const d=new De({color:3752527,transparent:!0,opacity:.55,roughness:.5}),f=new gt(new Ba(3.4,8,20),e);return f.rotation.z=-Math.PI/2,f.position.x=2.6,u.add(h,ke(.7,54,3.4,d),f),i.add(s,r,o,a,l,c,u),{group:i,propeller:u}}function fM(){const i=new ne,t=ei(14869994,.45),e=ki(4.6,40,t,20);e.rotation.z=Math.PI/2;const n=new gt(new yr(4.6,20,14),t);n.position.x=20;const s=new ne;s.position.y=-Tt-5.2,s.add(e,n);const r=new so;[[12,0],[-16,70],[-25,70],[-9,0],[-25,-70],[-16,-70]].forEach(([c,u],h)=>h===0?r.moveTo(c,u):r.lineTo(c,u)),r.closePath();const a=new xr(r,{depth:1.3,bevelEnabled:!1});a.rotateX(-Math.PI/2);const l=new gt(a,t);return l.position.y=-Tt-2.4,i.add(s,l),i}class pM extends Be{id="release";title="Flight Release Mechanism";script=7.4;flight=new ne;carried=new ne;releaseMagnet;propeller;streaks=[];releaseTime;constructor(t){super(t);const{lattice:e,physics:n}=t,s=n.patterns.latch;this.releaseMagnet=new oe(e,{faceUp:!1,indexMark:!0}),we(this.releaseMagnet,Te(s)),this.releaseMagnet.group.position.y=cM;const r=new oe(e,{faceUp:!0,indexMark:!0});we(r,Te(rn(s))),r.group.position.y=-re;const o=dM();this.propeller=o.propeller,this.carried.add(r.group,fM()),this.flight.add(o.group,this.releaseMagnet.group),this.group.add(this.flight,this.carried);const a=new Le({color:10466508,transparent:!0,opacity:.2});for(let c=0;c<hM;c++){const u=ke(26+c%3*12,.35,.35,a);this.streaks.push(u),this.group.add(u)}let l=Kn[0];for(;l<Kn[1]&&Me(n.latch.hold,this.twist(l))>0;)l+=.005;this.releaseTime=l}twist(t){return this.world.physics.latch.releaseAngleDeg*lM*X(t,Kn[0],Kn[1])}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=this.twist(t),l=r.latch.hold;n.orbit([-8,-8,0],330,ht(28,44,e/this.duration),15);const c=1.6*Math.sin(e*1.5),u=.025*Math.sin(e*1.1);this.flight.position.y=c,this.flight.rotation.x=u,this.propeller.rotation.x=e*34,this.releaseMagnet.group.rotation.y=a*mn;const h=Math.max(0,t-this.releaseTime),d=44*(1-Math.exp(-1.6*h))+2.5*h,f=62*(1-Math.exp(-1.1*h))+4*h,g=1.2*Math.sin(e*1.2+1)*X(h,.6,1.6);this.carried.position.set(-f,c*Math.exp(-3*h)-d+g,0),this.carried.rotation.x=u*Math.exp(-3*h),this.carried.rotation.z=-.1*X(h,.1,.7)+.07*X(h,.9,2.2),this.streaks.forEach((p,S)=>{const x=S*.618%1,v=(S*53+e*(120+S%4*30))%420-210;p.position.set(-v,46-120*x+6*Math.sin(S),-110+S*97%220)}),this.caption(e,uM),s.setPanels(1,1),s.inset.begin(Ln),s.inset.disc(0,a*mn),qe(s.inset,o,Te(r.patterns.latch)),s.chart.draw({title:"Holding Force vs. Turn of the Release Magnet",xLabel:"Turn from the latched position (degrees)",yLabel:"Holding force (relative)",xRange:[0,40],yRange:[-.3,1.08],xTicks:[0,10,20,30,40].map(p=>({value:p,label:String(p)})),yTicks:[0,.5,1].map(p=>({value:p,label:String(p)})),series:[{label:"Release pair",color:Wt.seriesPoly,xs:l.x,ys:l.y}],markers:[{series:0,x:a,y:Me(l,a)}],zones:[{x0:0,x1:16,label:"Holds"},{x0:28,x1:40,label:"Pushes away"}]});const _=Math.min(Ie(t,.2),1-X(t,Kn[0]-.4,Kn[0]));s.label("release-carrier","Carrier aircraft",30,c+Nf+2*Di+16,0,{anchor:"above",opacity:_}),s.label("release-glider","Glider",-20,c-Tt-6,70,{anchor:"below",opacity:_}),s.label("release-magnets","Patterned magnets",tt+2,c,0,{anchor:"right",detail:"from CMR, under a NASA contract",opacity:_});const m=h>0;s.label("release-status",m?"Released":"Release command",tt+2,c,0,{anchor:"right",detail:m?"pushed clear of the carrier":`release magnet turning: ${Math.round(a)} degrees`,opacity:Math.min(X(t,Kn[0],Kn[0]+.3),1-X(h,1.2,1.7))})}}const Ze=50,Vr=41,ql=Vr+2*tt+6,is=2*tt+6,Qo=[1.2,2.2],gd=[1.8,2.8],ta=[3.3,4.6],ea=[4.9,5.7],di=[6.5,7.9],mM=9,gM=[{at:0,lines:[{text:"Behind a conventional rotor magnet, thick back-iron carries each pole's flux across to the next magnet."},{text:"Finely written poles close their flux between neighbours, so a thin shunt plate is enough.",at:2.9}],tag:"CMR patent US 8,957,751"},{at:di[0]-.6,lines:[{text:"The rotor sheds most of its iron. Fine poles suit couplings and machines with a small working gap."}]}];class _M extends Be{id="shunt";title="Rotor Lightweighting: Shunt Plate in Place of Back-Iron";script=8.8;lifted=[];paths;removed;removedMaterial;thick;thin;constructor(t){super(t);const{lattice:e,physics:n}=t,s=n.applications.iron;this.thick=s.conventional.thickness,this.thin=s.written.thickness;const r=Oi(Vt.steel,.42),o=ke(ql,this.thick,is,r);o.position.set(-Ze,-this.thick/2,0);const a=new oe(e,{faceUp:!0,style:"conventional"});a.group.position.set(-Ze-Vr/2,Tt,0);const l=new oe(e,{faceUp:!1,style:"conventional"});l.group.position.set(-Ze+Vr/2,0,0);const c=ke(ql,this.thin,is,r);c.position.set(Ze,-this.thin/2,0);const u=[-1,1].map(d=>{const f=new oe(e,{faceUp:!0});return we(f,Te(n.applications.patterns.fineStripes)),f.group.position.set(Ze+d*Vr/2,Tt,0),f});for(const d of[a,l,...u]){const f=new ne;f.add(d.group),this.lifted.push(f),this.group.add(f)}this.paths=new Le({color:Vt.field,toneMapped:!1,transparent:!0,opacity:0});const h=is/2+.4;for(const[d,f]of[[-9,.26],[0,.52],[9,.78]]){const g=-Vr/2-d,_=new fh([new P(-Ze+g,-.3,h),new P(-Ze+g*.86,-this.thick*f*.82,h),new P(-Ze,-this.thick*f,h),new P(-Ze-g*.86,-this.thick*f*.82,h),new P(-Ze-g,-.3,h)]);this.group.add(new gt(new ka(_,48,.32,8),this.paths))}this.removedMaterial=new De({color:Vt.steel,metalness:.2,roughness:.6,transparent:!0,opacity:0,depthWrite:!1}),this.removed=ke(ql,this.thick-this.thin,is,this.removedMaterial),this.group.add(o,c,this.removed)}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=r.applications.iron;n.orbit([0,-1,0],304,ht(-9,5,e/this.duration),21);const l=mM*(X(t,Qo[0],Qo[1])-X(t,ea[0],ea[1]));for(const m of this.lifted)m.position.y=l;this.paths.opacity=.9*ye(t,gd[0],gd[1],ea[0]-.2,ea[0]+.3);const c=ye(t,di[0],di[0]+.4,di[1]-.5,di[1]),u=16*X(t,di[0]+.5,di[1]);this.removedMaterial.opacity=.34*c,this.removed.visible=c>.001,this.removed.position.set(Ze,-this.thin-(this.thick-this.thin)/2-u,0),this.caption(e,gM),s.setPanels(X(t,ta[0]-.5,ta[0]),1),s.inset.begin("Magnet Faces",2),s.inset.disc(0,0,"Conventional"),s.inset.solid(1),s.inset.disc(1,0,"Written"),qe(s.inset,o,Te(r.applications.patterns.fineStripes));const h=X(t,ta[0],ta[1]),d=Array.from(a.thickness.y,m=>m/a.conventional.thickness);s.chart.draw({title:"Iron Needed Behind the Poles vs. Pole Width",xLabel:"Pole width (mm)",yLabel:"Iron thickness (relative)",xRange:[0,40],yRange:[0,1.15],xTicks:[0,10,20,30,40].map(m=>({value:m,label:String(m)})),yTicks:[0,.5,1].map(m=>({value:m,label:String(m)})),series:[{label:"Iron needed",color:Wt.seriesPoly,xs:a.thickness.x,ys:d,reveal:h}],markers:h>.99?[{series:0,x:a.written.poleWidth,y:a.ratio},{series:0,x:a.conventional.poleWidth,y:1}]:[],zones:h>.99?[{x0:6,x1:18,label:"Written"},{x0:30,x1:40,label:"Conventional"}]:[]});const f=Ie(t,.2),g=Tt+l+7;s.label("shunt-conventional","Conventional rotor magnets",-Ze,g,0,{anchor:"above",detail:"one pole per magnet",opacity:f}),s.label("shunt-written","Written rotor magnets",Ze,g,0,{anchor:"above",detail:"poles one maxel wide",opacity:f});const _=ye(t,Qo[1]-.3,Qo[1]+.2,di[0]-.5,di[0]-.1);s.label("shunt-backiron","Back-iron",-Ze,-this.thick-3,is/2,{anchor:"below",detail:"carries a whole pole's flux to the next magnet",opacity:_}),s.label("shunt-plate","Shunt plate",Ze,-this.thin-3,is/2,{anchor:"below",detail:"each pole's flux closes with its neighbour",opacity:_}),s.label("shunt-removed","Iron no longer needed",Ze,-this.thick-4-u,is/2,{anchor:"below",opacity:c})}}const na=[.2,1],Sa=1,ss=[2.9,3.6],ia=4.1,Ge=[5.6,9],_d=1.1,vM=.03,xM=new P(0,-1,0),yM=[{at:0,lines:[{text:"Short-range repulsion and long-range attraction balance at a designed gap."},{text:"The part floats there, pushed back when pressed and pulled back when lifted.",at:Sa+.75}]},{at:Ge[0],lines:[{text:"The same gap isolates the part from vibration in the structure beneath it, with no power."}]}];class MM extends Be{id="spring";title="Spring: Non-Contact Suspension";script=9.4;base;part;baseGroup=new ne;press=new ys;baseFrom;partFrom;hoverGap;from=new P;constructor(t){super(t);const{lattice:e,physics:n}=t;this.base=new oe(e,{faceUp:!0}),this.part=new oe(e,{faceUp:!1}),this.baseFrom=rn(n.patterns.latch),this.partFrom=n.patterns.latch;const s=new gt(new Ve(.75,.75,46,16),new De({color:Vt.steel,metalness:.9,roughness:.3}));s.position.y=23-Tt-6;const r=new gt(new Xe(62,2.4,50),new De({color:Vt.dark,metalness:.5,roughness:.55}));r.position.y=-Tt-1.2,this.baseGroup.add(this.base.group,s,r),this.group.add(this.baseGroup,this.part.group,this.press.group);const o=n.spring.net;let a=n.spring.equilibriumGap;for(;a>.3&&Me(o,a)<vM;)a-=.01;this.hoverGap=a}baseHeight(t){return .85*ye(t,Ge[0],Ge[0]+.4,Ge[1]-.4,Ge[1])*Math.sin(2*Math.PI*7.5*(t-Ge[0]))}partHeight(t){const e=this.hoverGap;if(t<ss[0]){const r=t-(Sa+.7),o=r>0?.6*Math.exp(-5*r)*Math.sin(2*Math.PI*2.6*r)*(1-X(t,ss[0]-.3,ss[0])):0;return ht(15,e,X(t,Sa,Sa+.7))-o}if(t<ia)return ht(e,_d,X(t,ss[0],ss[1]));const n=e+(_d-e)*Wf(t-ia,2.8),s=ye(t,Ge[0],Ge[0]+.4,Ge[1]-.4,Ge[1]);return n+.07*s*Math.sin(2*Math.PI*1.6*(t-Ge[0]))}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=this.baseHeight(t),l=this.partHeight(t),c=l-a;n.orbit([0,4,0],165,ht(20,12,e/this.duration),11),this.baseGroup.position.y=a,this.part.group.position.y=l;const u=Mi(o,this.partFrom,r.patterns.springMate,t,na[0],na[1]);we(this.part,u),we(this.base,Mi(o,this.baseFrom,r.patterns.springBase,t,na[0],na[1]));const h=Math.min(X(t,ss[0]-.3,ss[0]+.2),1-X(t,ia-.1,ia+.1));this.from.set(0,l+Tt+13,0),this.press.set(this.from,xM,h*12),this.caption(e,yM),s.setPanels(1,1),s.inset.begin(Ln),s.inset.disc(),qe(s.inset,o,u);const d=r.spring.net,f=r.spring.equilibriumGap;s.chart.draw({title:"Net Force vs. Gap",xLabel:"Gap between the parts (mm)",yLabel:"Net force (relative)",xRange:[0,12],yRange:[-.12,.42],xTicks:[0,2,4,6,8,10,12].map(g=>({value:g,label:String(g)})),yTicks:[0,.2,.4].map(g=>({value:g,label:String(g)})),series:[{label:"Spring pair",color:Wt.seriesPoly,xs:d.x,ys:d.y}],markers:[{series:0,x:c,y:Me(d,c)}],zones:[{x0:0,x1:f,label:"Repels"},{x0:f,x1:12,label:"Attracts"}],reference:{x:f,label:"Balance gap"}}),s.label("rail","Guide rail",0,24,0,{anchor:"right",detail:"keeps the part centred",opacity:Math.min(Ie(t,1.2),1-X(t,Ge[0]-.6,Ge[0]-.1))}),s.label("payload","Part: steady",21,l+2,0,{anchor:"right",opacity:X(t,Ge[0]+.2,Ge[0]+.7)}),s.label("base","Base: vibrating",33,-Tt-2,0,{anchor:"right",opacity:X(t,Ge[0]+.2,Ge[0]+.7)})}}function SM(i,t,e){i.width=220,i.height=220;const s=i.getContext("2d");if(!s)return;const r=(220/2-6)/tt;s.beginPath(),s.arc(220/2,220/2,220/2-6,0,2*Math.PI),s.fillStyle="#0c1017",s.fill(),s.strokeStyle=Wt.axis,s.lineWidth=2,s.stroke();for(let o=0;o<t.count;o++)s.beginPath(),s.arc(220/2+t.x[o]*r,220/2+t.z[o]*r,Fa*r,0,2*Math.PI),s.fillStyle=e[o]>0?Wt.north:e[o]<0?Wt.south:Wt.unwritten,s.fill()}function sa(i,t){i.style.opacity=t.toFixed(3),i.style.transform=`translateY(${((1-t)*.8).toFixed(3)}rem)`}function ra(i,t){const e=i.querySelector(t);if(!e)throw new Error(`The summary overlay is missing its ${t} element`);return e}const vd=.4,EM=1.3,bM=.32,xd=3.9,yd=5,oa=.7;class wM extends Be{id="summary";title="Programmable Magnet Behaviors";script=9;pacing={lead:0,pace:1,tail:0};heading;sentence;brand;tiles=[];constructor(t){super(t);const{lattice:e,physics:n,hud:s}=t;this.heading=ra(s.summaryElement,"h2"),this.sentence=ra(s.summaryElement,"p"),this.brand=ra(s.summaryElement,".brand");const r=[["Attach",n.patterns.attach],["Align",n.patterns.align],["Latch",n.patterns.latch],["Spring",n.patterns.springBase],["Torque Transfer",n.patterns.torque],["Switchable Hold",n.patterns.switchLayer]],o=ra(s.summaryElement,".tiles");for(const[a,l]of r){const c=document.createElement("div");c.className="tile";const u=document.createElement("canvas");SM(u,e,l);const h=document.createElement("div");h.className="tile-label",h.textContent=a,c.append(u,h),o.appendChild(c),this.tiles.push(c)}}setVisible(t){super.setVisible(t),t||this.world.hud.setSummary(0)}draw(t){const{stage:e,hud:n}=this.world;e.orbit([0,0,0],240,0,30),n.setCaption([]),n.setPanels(0,0),n.setSummary(1),sa(this.heading,X(t,vd,vd+oa)),this.tiles.forEach((s,r)=>{const o=EM+r*bM;sa(s,X(t,o,o+oa))}),sa(this.sentence,X(t,xd,xd+oa)),sa(this.brand,X(t,yd,yd+oa))}}const Js=[1.7,3.2],Md=[5,6.4],TM=.3,AM=420,aa=2*sn.fixed+sn.dial,RM=[{at:0,lines:[{text:"Turning one written layer against the others cancels the external field."},{text:"The hold switches off and back on with no power.",at:Js[1]+.3}],tag:"CMR patent US 8,760,251"}];class CM extends Be{id="switch";title="Switchable Hold";script=7.5;dial;part;field;seeds;dropTime;constructor(t){super(t);const{lattice:e}=t,n=new oe(e,{faceUp:!1,style:"layer",thickness:sn.fixed});this.dial=new oe(e,{faceUp:!1,style:"layer",thickness:sn.dial,indexMark:!0});const s=new oe(e,{faceUp:!1,style:"layer",thickness:sn.fixed});this.dial.group.position.y=sn.fixed,s.group.position.y=sn.fixed+sn.dial;const r=new De({color:Vt.dark,metalness:.6,roughness:.45}),o=new gt(new Ve(1.8,1.8,30,20),r);o.position.y=aa+15,this.part=new gt(new Xe(34,7,26),new De({color:Vt.steel,metalness:.9,roughness:.4})),this.field=new Ga({bounds:[-62,-44,62,44],floatTargets:t.floatTargets}),this.seeds=[{y:0,normal:-1,x0:-tt+.7,x1:tt-.7,count:16},{y:aa,normal:1,x0:-tt+.7,x1:tt-.7,count:16}],this.group.add(n.group,this.dial.group,s.group,o,this.part,this.field.group);let a=Js[0];for(;a<Js[1]&&Me(t.physics.switching.hold,this.angle(a))>TM;)a+=.005;this.dropTime=a}angle(t){return 180*(X(t,Js[0],Js[1])-X(t,Md[0],Md[1]))}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=this.angle(t),l=r.patterns.switchLayer,c=r.switching.hold,u=Me(c,a);n.orbit([0,-5,0],176,ht(-22,-10,e/this.duration),13),this.dial.group.rotation.y=a*mn;const h=Math.max(0,t-this.dropTime);this.part.position.y=-pa-3.5-.5*AM*h*h,this.part.rotation.z=.25*h*h,this.part.visible=this.part.position.y>-90,this.field.begin(),this.field.charges.addMagnet(o,l,0,0,0,0,1,sn.fixed,gi),this.field.charges.addMagnet(o,l,0,sn.fixed,0,a*mn,1,sn.dial,gi),this.field.charges.addMagnet(o,l,0,sn.fixed+sn.dial,0,0,1,sn.fixed,gi),this.field.addSlab(-tt,tt,0,aa),this.part.visible&&h===0&&this.field.addSlab(-17,17,-pa-7,-pa);const d=X(u,.08,.3);this.field.commit(d>.01?`s${Math.round(a/6)}:${h===0?1:0}`:null,this.seeds),this.field.setLook(e,{lines:d,glow:1.2}),this.caption(e,RM),s.setPanels(1,1),s.inset.begin("Layer Alignment, Face View",2),s.inset.disc(0,0,"Fixed layers"),qe(s.inset,o,Te(l)),s.inset.disc(1,a*mn,"Dial layer"),qe(s.inset,o,Te(l)),s.chart.draw({title:"Holding Force vs. Dial Rotation",xLabel:"Dial rotation (degrees)",yLabel:"Holding force (relative)",xRange:[0,180],yRange:[0,1.08],xTicks:[0,45,90,135,180].map(g=>({value:g,label:String(g)})),yTicks:[0,.5,1].map(g=>({value:g,label:String(g)})),series:[{label:"Layer stack",color:Wt.seriesPoly,xs:c.x,ys:c.y}],markers:[{series:0,x:a,y:u}],zones:[{x0:0,x1:40,label:"On"},{x0:140,x1:180,label:"Off"}]});const f=a<1?t<Js[0]?"On: layers aligned":"On again: layers aligned":a>179?"Off: fields cancel":"Turning the middle layer";s.label("switch-state",f,26,aa/2,0,{anchor:"right",opacity:Ie(t,.4)}),s.label("switch-part","Steel part",0,this.part.position.y-4.5,13,{anchor:"below",detail:h>0?"released":"held",opacity:Math.min(Ie(t,.4),1-X(h,.25,.45))})}prepare(){this.field.render(this.world.stage.renderer)}}const Sd=[.5,2.6],Ed=[1.4,2.8],us=[3.1,3.8],yn=[4,5.6],Ce=[6.5,8.7],bd=14,Yl=1.3,be=96,PM=1,Vs=16,LM=2.4,IM=[{at:0,lines:[{text:"A pattern is laid out in design software and can go to simulation before anything is made."}]},{at:us[0]-.35,lines:[{text:"The same design goes to the magnetizer as a production file and is written in seconds."},{text:"A field scanner then maps the written part, to check it against the design.",at:Ce[0]-.7}]}],wd=new Bt(Vt.north),Td=new Bt(Vt.south),Ad=new fe;function $l(i){return tt-(i+.5)/be*2*tt}class DM extends Be{id="thread";title="Design to Magnet: Software, Write, Verify";script=Ce[1]+1;magnet;target;designRank;sheet=new ne;sheetDots;sheetMaterials;upper=pr(1);lower=pr(-1);probe=eo();map;mapPlane;mapInside;mapKey="";constructor(t){super(t);const{lattice:e,physics:n}=t;this.target=n.patterns.attach,this.magnet=new oe(e,{faceUp:!0});const s=Array.from({length:e.count},(x,v)=>v),r=x=>Math.hypot(e.x[x],e.z[x]);s.sort((x,v)=>r(x)-r(v)||Math.atan2(e.z[x],e.x[x])-Math.atan2(e.z[v],e.x[v])),this.designRank=new Int16Array(e.count),s.forEach((x,v)=>{this.designRank[x]=v});const o=new Le({side:Qe,toneMapped:!1,transparent:!0,depthWrite:!1}),a=new Le({color:Vt.field,toneMapped:!1,transparent:!0,depthWrite:!1}),l=new Le({color:1384495,side:Qe,transparent:!0,depthWrite:!1});this.sheetMaterials=[o,a,l],this.sheetDots=new _f(new _s(Fa,20).rotateX(-Math.PI/2),o,e.count);for(let x=0;x<e.count;x++)this.sheetDots.setColorAt(x,this.target[x]>0?wd:Td);this.sheetDots.position.y=.06,this.sheetDots.renderOrder=6;const c=new gt(new _s(tt,72).rotateX(-Math.PI/2),l);c.renderOrder=5;const u=Df(tt-.4,tt,.12,a);u.renderOrder=6,this.sheet.add(c,u,this.sheetDots),this.probe.group.rotation.x=Math.PI;const h=ke(30,1.2,3,ei(3752527,.5));h.position.set(17,-1.2,0),this.probe.group.add(h);const d=new Jc(2*e.count);d.addMagnet(e,this.target,0,0,0,0,-1,Tt,gi);const f=new Float64Array(3),g=new Float32Array(be*be);let _=0;for(let x=0;x<be;x++)for(let v=0;v<be;v++){const w=(v+.5)/be*2*tt-tt;or(d,w,PM,$l(x),f),g[x*be+v]=f[1],_=Math.max(_,Math.abs(f[1]))}const m=new Uint8Array(be*be*4);this.mapInside=new Uint8Array(be*be);const p=new Bt(1053981),S=new Bt;for(let x=0;x<be;x++)for(let v=0;v<be;v++){const w=x*be+v,A=(v+.5)/be*2*tt-tt,C=g[w]/_;S.copy(p).lerp(C>0?wd:Td,Math.min(1,Math.abs(C))**.7).convertLinearToSRGB(),m[4*w]=Math.round(255*S.r),m[4*w+1]=Math.round(255*S.g),m[4*w+2]=Math.round(255*S.b),this.mapInside[w]=Math.hypot(A,$l(x))<=tt-.3?255:0}this.map=new ch(m,be,be,Tn),this.map.colorSpace=En,this.map.magFilter=fn,this.map.minFilter=fn,this.mapPlane=new gt(new xs(2*tt,2*tt).rotateX(-Math.PI/2),new Le({map:this.map,transparent:!0,toneMapped:!1,depthWrite:!1})),this.mapPlane.position.y=.14,this.mapPlane.renderOrder=4,this.group.add(this.magnet.group,this.mapPlane,this.sheet,this.upper.group,this.lower.group,this.probe.group)}revealMap(t,e){const n=`${t}:${Math.round(e*be)}`;if(n===this.mapKey)return;this.mapKey=n;const s=this.map.image.data;for(let r=0;r<be;r++){const o=Math.floor(($l(r)+tt)/(2*tt)*Vs);for(let a=0;a<be;a++){const l=r*be+a,c=(a+.5)/be,u=o<t||o===t&&(t%2===0?c<=e:c>=e);s[4*l+3]=u?this.mapInside[l]:0}}this.map.needsUpdate=!0}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=this.target;n.orbit([0,3,0],190,ht(18,2,e/this.duration),ht(34,47,X(t,Ce[0]-.7,Ce[0]+.5)));const l=o.count*X(t,Sd[0],Sd[1]);for(let O=0;O<o.count;O++){const ot=xi(l-this.designRank[O]);Ad.makeScale(ot,1,ot).setPosition(o.x[O],0,o.z[O]),this.sheetDots.setMatrixAt(O,Ad)}this.sheetDots.instanceMatrix.needsUpdate=!0;const c=Math.min(Ie(t,.15,.4),1-X(t,us[1]-.3,us[1]+.1));this.sheet.position.y=ht(bd,.4,X(t,us[0],us[1])),this.sheet.visible=c>.001,this.sheetMaterials[0].opacity=c,this.sheetMaterials[1].opacity=.8*c,this.sheetMaterials[2].opacity=.45*c;const u=o.count*ve(t,yn[0],yn[1]),h=t>yn[0]&&t<yn[1],d={polarity:O=>o.rank[O]<u?a[O]:0,flash:O=>{const ot=u-o.rank[O];return h&&ot>=0?Math.exp(-ot*.4):0},scanX:null};we(this.magnet,d);const f=_i(u,0,o.count-1),g=o.printOrder[Math.floor(f)],_=o.printOrder[Math.min(o.count-1,Math.floor(f)+1)],m=f-Math.floor(f),p=ht(o.x[g],o.x[_],m),S=ht(o.z[g],o.z[_],m),x=X(t,yn[0]-.5,yn[0]),v=X(t,yn[1],yn[1]+.6),w=ht(34,0,x)+44*v;this.upper.group.position.set(p,Yl+w,S),this.lower.group.position.set(p,-Tt-Yl-w,S);for(const O of[this.upper,this.lower])vh(O,h?Math.exp(-m*2.6):0),O.group.visible=t>yn[0]-.5&&v<1;const A=ve(t,Ce[0],Ce[1])*Vs,C=Math.min(Vs-1,Math.floor(A)),I=A>=Vs?1:A-C,b=C%2===0?I:1-I,M=t>=Ce[1];t<Ce[0]?this.revealMap(-1,0):M?this.revealMap(Vs,0):this.revealMap(C,b),this.mapPlane.visible=t>=Ce[0];const L=X(t,Ce[0]-.5,Ce[0]),z=X(t,Ce[1],Ce[1]+.5),F=ht(-tt,tt,b),V=ht(-tt,tt,(C+.5)/Vs),q=LM+ht(30,0,L)+36*z;this.probe.group.position.set(F,q,V),this.probe.group.visible=t>Ce[0]-.5&&z<1,this.caption(e,IM),s.setPanels(1,1),s.inset.begin("Design, Face View"),s.inset.disc(),qe(s.inset,o,{polarity:O=>this.designRank[O]<l?a[O]:0,flash:()=>0,scanX:null});const k=Va(r,{polymagnetReveal:X(t,Ed[0],Ed[1])});s.chart.draw({...k,title:"Simulated Holding Force on Steel vs. Gap",series:k.series.map((O,ot)=>ot===1?{...O,label:"This design"}:O)});const Y=ye(t,.4,.8,us[0]-.2,us[0]+.1);s.label("thread-design","Design",0,bd+4,-tt,{anchor:"above",detail:"laid out in software",opacity:Y}),s.label("thread-blank","Blank",-tt-3,-Tt/2,6,{anchor:"left",detail:"standard magnet material",opacity:Y}),s.label("thread-heads","Magnetizer",p,Yl+w+13,S,{anchor:"right",detail:"driven by the design file",opacity:ye(t,yn[0]-.1,yn[0]+.2,yn[1]-.3,yn[1])}),s.label("thread-scanner","Field scanner",F+34,q+2,V,{anchor:"right",detail:"maps the field over the face",opacity:ye(t,Ce[0]-.1,Ce[0]+.2,Ce[1]-.2,Ce[1]+.1)}),s.label("thread-map","Field map",0,7,-tt,{anchor:"above",detail:"to check against the design",opacity:X(t,Ce[1]+.3,Ce[1]+.7)})}}const la=[.2,1],rs=[1,2.2],js=[5.1,5.6],Or=6.2,UM=js[0]-1.2,NM=250,Kl=8,FM=[{at:0,lines:[{text:"Matching tracks on two discs transmit torque across a sealed wall, with no shaft seal, no contact and no wear."}]},{at:UM,lines:[{text:"On overload the coupling slips and re-engages instead of breaking."}]}];class OM extends Be{id="torque";title="Torque Transfer Through a Sealed Wall";script=7.9;driver;follower;driverSpin=new ne;followerSpin=new ne;driverFrom;followerFrom;followerTo;constructor(t){super(t);const{lattice:e,physics:n}=t;this.driver=new oe(e,{faceUp:!0,indexMark:!0}),this.follower=new oe(e,{faceUp:!1,indexMark:!0}),this.follower.setOpacity(.38),this.driverFrom=n.patterns.springBase,this.followerFrom=n.patterns.springMate,this.followerTo=rn(n.patterns.torque);const s=new De({color:Vt.steel,metalness:.9,roughness:.32}),r=new De({color:3884114,metalness:.6,roughness:.45}),o=new gt(new Ve(2.6,2.6,26,20),s);o.position.y=-Tt-13,this.driverSpin.add(this.driver.group,o);const a=new gt(new Xe(24,18,24),r);a.position.y=-Tt-26-9;const l=new gt(new Ve(2.2,2.2,16,20),s);l.position.y=Tt+8;const c=new gt(new Ve(4.2,4.2,5,24),s);c.position.y=Tt+18.5,this.follower.group.add(l,c);for(let d=0;d<5;d++){const f=new gt(new Xe(13,4.4,1.1),s),g=new ne;g.rotation.y=d*2*Math.PI/5,f.position.set(10,Tt+18.5,0),f.rotation.x=.5,g.add(f),this.follower.group.add(g)}this.followerSpin.position.y=qs,this.followerSpin.add(this.follower.group);const u=new gt(new Xe(60,1.5,54),new fg({color:Vt.glass,metalness:0,roughness:.12,transparent:!0,opacity:.2,depthWrite:!1}));u.position.y=qs/2,u.renderOrder=5;const h=new ne;h.rotation.z=-Math.PI/2,h.add(this.driverSpin,a,this.followerSpin,u),this.group.add(h)}driverAngle(t){const e=rs[1]-rs[0],n=ve(t,rs[0],rs[1]),s=(n*n*n-n*n*n*n/2)*e;return NM*(s+Math.max(0,t-rs[1]))}loadAngle(t){const{pullOutAngleDeg:e,periodDeg:n}=this.world.physics.torque,s=Kl*X(t,rs[0],rs[1]),r=(e-Kl)*X(t,js[0],js[1]),o=(n+Kl-e)*X(t,js[1],Or);return s+r+o}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,{coupling:a,periodDeg:l}=r.torque,c=this.driverAngle(t),u=this.loadAngle(t);n.orbit([3,0,0],196,ht(34,24,e/this.duration),17),this.driverSpin.rotation.y=c*mn,this.followerSpin.rotation.y=(c-u)*mn,we(this.driver,Mi(o,this.driverFrom,r.patterns.torque,t,la[0],la[1]));const h=Mi(o,this.followerFrom,this.followerTo,t,la[0],la[1]);we(this.follower,h),this.caption(e,FM),s.setPanels(1,1),s.inset.begin(Ln),s.inset.disc(),qe(s.inset,o,h);const d=((u+l/2)%l+l)%l-l/2;s.chart.draw({title:"Transmitted Torque vs. Load Angle",xLabel:"Follower lag behind the driver (degrees)",yLabel:"Torque (relative)",xRange:[-l/2,l/2],yRange:[-1.15,1.15],xTicks:[-45,-30,-15,0,15,30,45].map(g=>({value:g,label:String(g)})),yTicks:[-1,0,1].map(g=>({value:g,label:String(g)})),series:[{label:"Coupling",color:Wt.seriesPoly,xs:a.x,ys:a.y}],markers:[{series:0,x:d,y:Me(a,d)}],reference:{x:r.torque.pullOutAngleDeg,label:"Pull-out"}});const f=Ie(t,1);s.label("torque-driver","Drive side",-Tt-30,-15,0,{anchor:"below",opacity:f}),s.label("torque-wall","Sealed wall",qs/2,32,0,{anchor:"above",opacity:f}),s.label("torque-follower","Sealed side",qs+Tt+19,-17,0,{anchor:"below",detail:"impeller turns with no shaft through the wall",opacity:f}),s.label("torque-slip","Overload",qs+Tt+19,19,0,{anchor:"above",detail:t<Or?"slipping":"re-engaged",status:t<Or?"warning":"good",opacity:Math.min(X(t,js[0],js[0]+.3),1-X(t,Or+.9,Or+1.4))})}}const Br=.7,ca=5.1,Zl=1.3,BM=[{at:0,lines:[{text:"The magnetizer writes the field into standard magnet material as pixels called maxels."},{text:"The pattern is designed in software and written in seconds, with no mold or tooling.",at:3}]}];class zM extends Be{id="write";title="Writing the Magnetic Pattern";script=7;magnet;field;upper=pr(1);lower=pr(-1);partial;seeds;constructor(t){super(t),this.magnet=new oe(t.lattice,{faceUp:!0}),this.field=new Ga({bounds:[-64,-48,64,54],floatTargets:t.floatTargets}),this.partial=new Int8Array(t.lattice.count),this.seeds=[{y:0,normal:1,x0:-tt+.6,x1:tt-.6,count:26},{y:-Tt,normal:-1,x0:-tt+.6,x1:tt-.6,count:26}],this.group.add(this.magnet.group,this.field.group,this.upper.group,this.lower.group)}written(t){const e=ve(t,Br,ca);return this.world.lattice.count*(.07*e+.93*e**2.4)}draw(t,e){const{stage:n,hud:s,physics:r,lattice:o}=this.world,a=r.patterns.attach,l=this.written(t),c=t>Br&&t<ca;n.orbit([0,0,0],190,ht(20,4,X(e,0,this.duration)),ht(44,21,X(t,3.8,6.6)));const u={polarity:w=>o.rank[w]<l?a[w]:0,flash:w=>{const A=l-o.rank[w];return c&&A>=0?Math.exp(-A*.55):0},scanX:null};we(this.magnet,u);const h=_i(l,0,o.count-1),d=o.printOrder[Math.floor(h)],f=o.printOrder[Math.min(o.count-1,Math.floor(h)+1)],g=h-Math.floor(h),_=ht(o.x[d],o.x[f],g),m=ht(o.z[d],o.z[f],g),p=X(t,.1,Br),S=X(t,ca,ca+.9),x=ht(26,0,p)+40*S;this.upper.group.position.set(_,Zl+x,m),this.lower.group.position.set(_,-Tt-Zl-x,m);const v=c?Math.exp(-g*3.2):0;for(const w of[this.upper,this.lower])vh(w,v),w.group.visible=S<1;for(let w=0;w<o.count;w++)this.partial[w]=o.rank[w]<l?a[w]:0;this.field.begin(),this.field.charges.addMagnet(o,this.partial,0,0,0,0,-1,Tt,gi),this.field.addSlab(-tt,tt,-Tt,0),this.field.commit(`w${Math.floor(l/4)}`,this.seeds),this.field.setLook(e,{glow:X(t,Br,Br+1)}),this.caption(e,BM),s.setPanels(1,1),s.inset.begin(Ln),s.inset.disc(),qe(s.inset,o,u),s.chart.draw(Va(r,{polymagnetReveal:X(t,4.4,6.3)})),s.label("heads","Print heads",_,Zl+x+13,m,{anchor:"right",detail:"matched pair, above and below",opacity:Math.min(X(t,.5,1.1),1-X(t,4.2,4.8))}),s.label("contained","Field stays close to the face",23,7,0,{anchor:"right",opacity:X(t,5.4,6.1)})}prepare(){this.field.render(this.world.stage.renderer)}}const kM=2e3,HM=2e3,GM="polymagnet-reel.log-tail",VM=300,Ff=`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,$r=[];let Na=[],WM=0,$c;function Of(){try{localStorage.setItem(GM,JSON.stringify($r.slice(-VM)))}catch{}}async function XM(){if($c=void 0,!!Na.length){Na=[],Of();return}}const qM=typeof window<"u";function YM(){if(!qM){Na=[];return}$c===void 0&&($c=window.setTimeout(()=>void XM(),HM))}function ha(i,t,e,n){const s={ts:new Date().toISOString(),level:i,component:t,event:e,session:Ff,seq:WM++,...n};$r.push(s),$r.length>kM&&$r.shift(),console[i==="debug"?"debug":i](`[reel] ${t}.${e}`,n??""),Na.push(s),YM()}const de={session:Ff,debug:(i,t,e)=>ha("debug",i,t,e),info:(i,t,e)=>ha("info",i,t,e),warn:(i,t,e)=>ha("warn",i,t,e),error:(i,t,e)=>ha("error",i,t,e),entries:()=>$r};function Rd(i){return i instanceof Error?{message:i.message,stack:i.stack}:{message:String(i)}}function $M(){window.addEventListener("error",i=>{de.error("window","uncaught_error",{...Rd(i.error??i.message),source:i.filename,line:i.lineno})}),window.addEventListener("unhandledrejection",i=>{de.error("window","unhandled_rejection",Rd(i.reason))}),window.addEventListener("pagehide",()=>{de.info("app","page_hide"),Of()})}const Cd=.22;class KM{constructor(t){this.chapters=t;let e=0;for(const n of t)this.starts.push(e),e+=n.duration,n.setVisible(!1);this.duration=e}starts=[];duration;time=0;playing=!1;speed=1;loop="none";active=-1;listeners=new Set;onChange(t){this.listeners.add(t)}emit(){const t=this.state();for(const e of this.listeners)e(t)}state(){const{index:t,local:e}=this.locate(this.time);return{time:this.time,playing:this.playing,speed:this.speed,loop:this.loop,chapterIndex:t,chapterTime:e}}locate(t){const e=_i(t,0,this.duration);let n=this.chapters.length-1;for(let s=0;s<this.chapters.length;s++)if(e<this.starts[s]+this.chapters[s].duration){n=s;break}return{index:n,local:e-this.starts[n]}}dip(){const{index:t,local:e}=this.locate(this.time),n=this.chapters[t].duration-e,s=t>0?e:Number.POSITIVE_INFINITY,r=t<this.chapters.length-1?n:Number.POSITIVE_INFINITY,o=Math.min(s,r);return o>=Cd?0:1-o/Cd}play(){this.playing||(this.time>=this.duration&&(this.time=0),this.playing=!0,de.info("timeline","play",{time:Pd(this.time)}),this.emit())}pause(){this.playing&&(this.playing=!1,de.info("timeline","pause",{time:Pd(this.time)}),this.emit())}toggle(){this.playing?this.pause():this.play()}seek(t){this.time=_i(t,0,this.duration),this.emit()}seekChapter(t){const e=_i(t,0,this.chapters.length-1);this.time=this.starts[e],de.info("timeline","seek_chapter",{chapter:this.chapters[e].id}),this.emit()}nextChapter(){this.seekChapter(this.locate(this.time).index+1)}previousChapter(){const{index:t,local:e}=this.locate(this.time);this.seekChapter(e>1?t:t-1)}setLoop(t){this.loop=t,de.info("timeline","set_loop",{mode:t}),this.emit()}setSpeed(t){this.speed=t,de.info("timeline","set_speed",{speed:t}),this.emit()}tick(t){if(!this.playing)return;const e=this.locate(this.time);let n=this.time+t*this.speed;if(this.loop==="chapter"){const s=this.starts[e.index],r=s+this.chapters[e.index].duration;n>=r&&(n=s+(n-s)%(r-s))}else n>=this.duration&&(this.loop==="all"?n%=this.duration:(n=this.duration,this.playing=!1,de.info("timeline","finished")));this.time=n,this.emit()}apply(){const{index:t,local:e}=this.locate(this.time);t!==this.active&&(this.active>=0&&this.chapters[this.active].setVisible(!1),this.chapters[t].setVisible(!0),de.info("timeline","chapter_enter",{chapter:this.chapters[t].id,index:t}),this.active=t);const n=this.chapters[t];return n.update(e),n}}function Pd(i){return Math.round(i*100)/100}const Ld='system-ui, -apple-system, "Segoe UI", sans-serif';class ZM{constructor(t,e){this.canvas=t,this.titleElement=e;const n=t.getContext("2d");if(!n)throw new Error("2D canvas context unavailable for the chart");this.ctx=n,this.tooltip=document.createElement("div"),this.tooltip.className="chart-tooltip",this.tooltip.hidden=!0,t.parentElement?.appendChild(this.tooltip),t.addEventListener("pointermove",s=>{const r=t.getBoundingClientRect();this.hoverX=s.clientX-r.left,this.spec&&this.draw(this.spec)}),t.addEventListener("pointerleave",()=>{this.hoverX=null,this.tooltip.hidden=!0,this.spec&&this.draw(this.spec)})}ctx;tooltip;spec=null;hoverX=null;width=0;height=0;plot={x:0,y:0,w:0,h:0};fit(){const t=Math.min(window.devicePixelRatio||1,2),e=this.canvas.clientWidth,n=this.canvas.clientHeight;e===this.width&&n===this.height&&this.canvas.width===Math.round(e*t)||(this.width=e,this.height=n,this.canvas.width=Math.round(e*t),this.canvas.height=Math.round(n*t),this.ctx.setTransform(t,0,0,t,0,0))}draw(t){this.spec=t,this.fit();const e=this.ctx,{width:n,height:s}=this;if(n<40||s<40)return;this.titleElement.textContent!==t.title&&(this.titleElement.textContent=t.title,this.canvas.setAttribute("aria-label",`${t.title}. ${t.yLabel} against ${t.xLabel}.`)),e.clearRect(0,0,n,s);const r=Math.max(10,Math.round(s*.058)),o=t.series.filter(_=>_.label!==""),a=o.length>1?r+10:2,l={x:r*3.1,y:a+4,w:n-r*3.1-10,h:s-a-4-r*2.9};this.plot=l;const[c,u]=t.xRange,[h,d]=t.yRange,f=_=>l.x+(_-c)/(u-c)*l.w,g=_=>l.y+l.h-(_-h)/(d-h)*l.h;if(o.length>1){e.font=`${r}px ${Ld}`,e.textBaseline="middle",e.textAlign="left";let _=l.x;for(const m of o)e.strokeStyle=m.color,e.lineWidth=2,e.lineCap="round",e.beginPath(),e.moveTo(_,r/2+2),e.lineTo(_+16,r/2+2),e.stroke(),e.fillStyle=Wt.inkSecondary,e.fillText(m.label,_+22,r/2+3),_+=22+e.measureText(m.label).width+18}e.lineWidth=1,e.font=`${r}px ${Ld}`,e.fillStyle=Wt.inkMuted,e.textAlign="right",e.textBaseline="middle";for(const _ of t.yTicks){const m=Math.round(g(_.value))+.5;e.strokeStyle=_.value===0?Wt.axis:Wt.grid,e.beginPath(),e.moveTo(l.x,m),e.lineTo(l.x+l.w,m),e.stroke(),e.fillText(_.label,l.x-6,m)}e.textAlign="center",e.textBaseline="top";for(const _ of t.xTicks)e.fillText(_.label,f(_.value),l.y+l.h+5);if(e.strokeStyle=Wt.axis,e.beginPath(),e.moveTo(l.x+.5,l.y),e.lineTo(l.x+.5,l.y+l.h),e.stroke(),e.fillStyle=Wt.inkMuted,e.fillText(t.xLabel,l.x+l.w/2,l.y+l.h+r+9),e.save(),e.translate(r*.2,l.y+l.h/2),e.rotate(-Math.PI/2),e.textBaseline="top",e.fillText(t.yLabel,0,0),e.restore(),t.zones){e.textBaseline="bottom",e.textAlign="center",e.fillStyle=Wt.inkMuted;for(const _ of t.zones)e.fillText(_.label,(f(_.x0)+f(_.x1))/2,l.y+l.h-4)}if(t.reference){const _=Math.round(f(t.reference.x))+.5;e.strokeStyle=Wt.axis,e.beginPath(),e.moveTo(_,l.y),e.lineTo(_,l.y+l.h),e.stroke(),e.fillStyle=Wt.inkSecondary,e.textAlign=_>l.x+l.w*.6?"right":"left",e.textBaseline="top",e.fillText(t.reference.label,_+(e.textAlign==="right"?-6:6),l.y+2)}e.save(),e.beginPath(),e.rect(l.x,l.y-2,l.w+2,l.h+4),e.clip(),e.lineWidth=2,e.lineJoin="round",e.lineCap="round";for(const _ of t.series){const m=_.xs.length,p=Math.max(0,Math.min(m,Math.ceil(m*(_.reveal??1))));if(!(p<2)){e.strokeStyle=_.color,e.beginPath();for(let S=0;S<p;S++){const x=f(_.xs[S]),v=g(_.ys[S]);S===0?e.moveTo(x,v):e.lineTo(x,v)}e.stroke()}}e.restore();for(const _ of t.markers??[]){const m=t.series[_.series];if(!m)continue;const p=f(Math.min(u,Math.max(c,_.x))),S=g(Math.min(d,Math.max(h,_.y)));e.beginPath(),e.arc(p,S,7,0,2*Math.PI),e.fillStyle=Wt.surface,e.fill(),e.beginPath(),e.arc(p,S,5,0,2*Math.PI),e.fillStyle=m.color,e.fill()}this.drawHover(t,f,g)}drawHover(t,e,n){const{plot:s,ctx:r}=this;if(this.hoverX===null||this.hoverX<s.x||this.hoverX>s.x+s.w){this.tooltip.hidden=!0;return}const[o,a]=t.xRange,l=o+(this.hoverX-s.x)/s.w*(a-o);r.strokeStyle=Wt.inkMuted,r.lineWidth=1,r.beginPath(),r.moveTo(Math.round(this.hoverX)+.5,s.y),r.lineTo(Math.round(this.hoverX)+.5,s.y+s.h),r.stroke();const c=[];for(const h of t.series){const d=h.label===""?null:JM(h,l);d!==null&&(r.beginPath(),r.arc(e(l),n(d),4,0,2*Math.PI),r.fillStyle=h.color,r.fill(),c.push(`<div><span class="key" style="background:${h.color}"></span>${h.label}: <b>${d.toFixed(2)}</b></div>`))}this.tooltip.innerHTML=`<div class="head">${t.xLabel}: ${l.toFixed(1)}</div>${c.join("")}`,this.tooltip.hidden=!1;const u=this.hoverX>s.x+s.w*.55;this.tooltip.style.left=u?"":`${this.hoverX+12}px`,this.tooltip.style.right=u?`${this.width-this.hoverX+12}px`:"",this.tooltip.style.top=`${s.y+6}px`}}function JM(i,t){const{xs:e,ys:n}=i,s=e.length;if(s<2||t<e[0]||t>e[s-1])return null;for(let r=1;r<s;r++)if(t<=e[r]){const o=(t-e[r-1])/(e[r]-e[r-1]||1);return n[r-1]+(n[r]-n[r-1])*o}return n[s-1]}class jM{constructor(t,e){this.canvas=t,this.titleElement=e;const n=t.getContext("2d");if(!n)throw new Error("2D canvas context unavailable for the pattern inset");this.ctx=n}ctx;width=0;height=0;cells=1;cx=0;cy=0;scale=1;rotation=0;begin(t,e=1){this.titleElement.textContent!==t&&(this.titleElement.textContent=t);const n=Math.min(window.devicePixelRatio||1,2),s=this.canvas.clientWidth,r=this.canvas.clientHeight;(s!==this.width||r!==this.height||this.canvas.width!==Math.round(s*n))&&(this.width=s,this.height=r,this.canvas.width=Math.round(s*n),this.canvas.height=Math.round(r*n)),this.ctx.setTransform(n,0,0,n,0,0),this.ctx.clearRect(0,0,s,r),this.cells=e}disc(t=0,e=0,n){const s=this.ctx,r=this.width/this.cells,o=this.cells>1?18:0,a=Math.min(r,this.height-o)/2-6;this.cx=r*(t+.5),this.cy=(this.height-o)/2,this.scale=a/tt,this.rotation=e,s.beginPath(),s.arc(this.cx,this.cy,a,0,2*Math.PI),s.fillStyle="#0c1017",s.fill(),s.lineWidth=1,s.strokeStyle=Wt.axis,s.stroke(),n&&(s.font='11px system-ui, -apple-system, "Segoe UI", sans-serif',s.fillStyle=Wt.inkMuted,s.textAlign="center",s.textBaseline="bottom",s.fillText(n,this.cx,this.height-1))}site(t,e,n,s=0){const r=Math.cos(this.rotation),o=Math.sin(this.rotation),a=t*r+e*o,l=-t*o+e*r,c=this.ctx;c.beginPath(),c.arc(this.cx+a*this.scale,this.cy+l*this.scale,Fa*this.scale,0,2*Math.PI),c.fillStyle=n>0?Wt.north:n<0?Wt.south:Wt.unwritten,c.fill(),s>.02&&(c.globalAlpha=Math.min(1,s),c.fillStyle="#ffffff",c.fill(),c.globalAlpha=1)}solid(t){const e=this.ctx;e.beginPath(),e.arc(this.cx,this.cy,tt*this.scale-4,0,2*Math.PI),e.fillStyle=t>0?Wt.north:t<0?Wt.south:Wt.unwritten,e.fill()}scan(t){const e=this.ctx,n=this.cx+t*this.scale,s=Math.sqrt(Math.max(0,tt*tt-t*t))*this.scale;s<=0||(e.strokeStyle="#dff1ff",e.lineWidth=2,e.beginPath(),e.moveTo(n,this.cy-s),e.lineTo(n,this.cy+s),e.stroke())}}function Je(i){const t=document.getElementById(i);if(!t)throw new Error(`HUD element #${i} is missing from index.html`);return t}function zr(i,t){i.textContent!==t&&(i.textContent=t)}function nr(i,t,e){i.style[t]!==e&&(i.style[t]=e)}function Id(i,t){nr(i,"opacity",t.toFixed(3)),nr(i,"transform",`translateY(${((1-t)*.7).toFixed(3)}rem)`)}class QM{constructor(t){this.stage=t,this.chart=new ZM(Je("chart-canvas"),Je("chart-title")),this.inset=new jM(Je("pattern-canvas"),Je("pattern-title"))}chart;inset;chapterBlock=Je("chapter");chapterIndex=Je("chapter-index");chapterTitle=Je("chapter-title");captionBlock=Je("caption");caption=Je("caption-text");captionTag=Je("caption-tag");captionKey="";chartPanel=Je("panel-chart");insetPanel=Je("panel-pattern");labelLayer=Je("labels");dipLayer=Je("dip");summary=Je("summary");card=Je("card");labels=new Map;setChapter(t,e,n,s=1){zr(this.chapterIndex,`${String(t+1).padStart(2,"0")} / ${String(e).padStart(2,"0")}`),zr(this.chapterTitle,n),Id(this.chapterBlock,s)}setCaption(t,e=[],n="",s=1){const r=t.map(o=>o.text).join(`
`);r!==this.captionKey&&(this.captionKey=r,this.caption.replaceChildren(...t.map(o=>{const a=document.createElement("span");return a.className="sentence",a.textContent=o.text,a})));for(let o=0;o<t.length;o++)nr(this.caption.children[o],"opacity",(e[o]??1).toFixed(3));zr(this.captionTag,n),this.captionTag.hidden=n==="",nr(this.captionTag,"opacity",(e[t.length-1]??1).toFixed(3)),Id(this.captionBlock,t.length===0?0:s)}setPanels(t,e){nr(this.chartPanel,"opacity",t.toFixed(3)),nr(this.insetPanel,"opacity",e.toFixed(3))}setDip(t){this.dipLayer.style.opacity=t.toFixed(3)}setSummary(t){this.summary.style.opacity=t.toFixed(3),this.summary.classList.toggle("off",t<=.001)}get summaryElement(){return this.summary}setCard(t){this.card.classList.toggle("off",!t)}get cardElement(){return this.card}beginLabels(){for(const t of this.labels.values())t.used=!1}label(t,e,n,s,r,o={}){let a=this.labels.get(t);if(!a){const d=document.createElement("div");d.className="label",d.innerHTML='<span class="dot"></span><span class="main"></span><span class="detail"></span>',this.labelLayer.appendChild(d),a={node:d,used:!1},this.labels.set(t,a)}a.used=!0;const{node:l}=a,c=this.stage.project(n,s,r),u=c.visible?o.opacity??1:0;if(l.style.opacity=u.toFixed(3),u<=.001)return;zr(l.children[1],e),zr(l.children[2],o.detail??"");const h=l.children[0];h.className=o.status?`dot ${o.status}`:"dot",l.dataset.anchor=o.anchor??"above",l.style.transform=`translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px)`}endLabels(){for(const t of this.labels.values())t.used||(t.node.style.opacity="0")}}const Jl=[.5,1,1.5],tS=2600,Dd=1/60;function Ii(i){const t=document.getElementById(i);if(!t)throw new Error(`Transport element #${i} is missing from index.html`);return t}function Ud(i){const t=Math.max(0,i);return`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,"0")}`}class eS{constructor(t,e){if(this.timeline=t,!e){this.root.hidden=!0;return}t.chapters.forEach((s,r)=>{const o=document.createElement("div");o.className="segment",o.style.flexGrow=String(s.duration),o.title=`${r+1}. ${s.title}`,this.track.appendChild(o),this.segments.push(o)}),this.playButton.addEventListener("click",()=>t.toggle()),this.loopButton.addEventListener("click",()=>this.cycleLoop()),this.speedButton.addEventListener("click",()=>this.cycleSpeed()),this.fullscreenButton.addEventListener("click",()=>this.toggleFullscreen()),this.track.addEventListener("pointerdown",s=>{this.scrubbing=!0,this.wasPlaying=t.playing,t.pause(),this.track.setPointerCapture(s.pointerId),this.scrubTo(s.clientX),de.info("transport","scrub_start",{time:Math.round(t.time*100)/100})}),this.track.addEventListener("pointermove",s=>{this.scrubbing&&this.scrubTo(s.clientX)});const n=s=>{this.scrubbing&&(this.scrubbing=!1,this.track.releasePointerCapture(s.pointerId),de.info("transport","scrub_end",{time:Math.round(t.time*100)/100}),this.wasPlaying&&t.play())};this.track.addEventListener("pointerup",n),this.track.addEventListener("pointercancel",n),window.addEventListener("keydown",s=>this.onKey(s)),window.addEventListener("pointermove",()=>this.wake()),t.onChange(s=>this.render(s)),this.render(t.state()),this.wake()}root=Ii("transport");playButton=Ii("btn-play");loopButton=Ii("btn-loop");speedButton=Ii("btn-speed");fullscreenButton=Ii("btn-fullscreen");track=Ii("scrub-track");fill=Ii("scrub-fill");time=Ii("time-readout");segments=[];hideTimer;scrubbing=!1;wasPlaying=!1;pinned=!1;scrubTo(t){const e=this.track.getBoundingClientRect(),n=Math.min(1,Math.max(0,(t-e.left)/e.width));this.timeline.seek(n*this.timeline.duration)}cycleLoop(){const t=["none","chapter","all"];this.timeline.setLoop(t[(t.indexOf(this.timeline.loop)+1)%t.length])}cycleSpeed(){this.timeline.setSpeed(Jl[(Jl.indexOf(this.timeline.speed)+1)%Jl.length])}toggleFullscreen(){de.info("transport","toggle_fullscreen",{entering:!document.fullscreenElement}),document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(t=>{de.warn("transport","fullscreen_refused",{message:String(t)})})}onKey(t){if(t.metaKey||t.ctrlKey||t.altKey)return;const e=this.timeline,n=t.key;if(n===" ")e.toggle();else if(n==="ArrowRight")e.nextChapter();else if(n==="ArrowLeft")e.previousChapter();else if(n==="l"||n==="L")e.setLoop(e.loop==="chapter"?"none":"chapter");else if(n==="f"||n==="F")this.toggleFullscreen();else if(n==="h"||n==="H")this.pinned=!this.pinned,this.root.classList.toggle("hidden",this.pinned),de.info("transport","toggle_controls",{hidden:this.pinned});else if(n==="."||n===",")e.pause(),e.seek(e.time+(n==="."?Dd:-Dd));else if(n>="1"&&n<="9"){const s=Number(n)-1;s<e.chapters.length&&e.seekChapter(s)}else return;t.preventDefault(),this.wake()}wake(){this.pinned||(this.root.classList.remove("idle"),document.body.classList.remove("idle"),window.clearTimeout(this.hideTimer),this.hideTimer=window.setTimeout(()=>{this.timeline.playing&&!this.scrubbing&&(this.root.classList.add("idle"),document.body.classList.add("idle"))},tS))}render(t){const e=this.timeline;this.fill.style.width=`${t.time/e.duration*100}%`,this.time.textContent=`${Ud(t.time)} / ${Ud(e.duration)}`,this.playButton.textContent=t.playing?"Pause":t.time>=e.duration?"Replay":"Play",this.loopButton.textContent=t.loop==="chapter"?"Loop: chapter":t.loop==="all"?"Loop: all":"Loop: off",this.loopButton.classList.toggle("on",t.loop!=="none"),this.speedButton.textContent=`${t.speed}x`,this.segments.forEach((n,s)=>n.classList.toggle("current",s===t.chapterIndex)),t.playing||this.wake()}}class nS extends lh{constructor(){super();const t=new Xe;t.deleteAttribute("uv");const e=new De({side:on}),n=new De,s=new vg(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new gt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const o=new gt(t,n);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);const a=new gt(t,n);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);const l=new gt(t,n);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);const c=new gt(t,n);c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),this.add(c);const u=new gt(t,n);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);const h=new gt(t,n);h.position.set(-2.193,-.369,-5.547),h.rotation.set(0,.516,0),h.scale.set(3.875,3.487,2.986),this.add(h);const d=new gt(t,Ws(50));d.position.set(-16.116,14.37,8.208),d.scale.set(.1,2.428,2.739),this.add(d);const f=new gt(t,Ws(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);const g=new gt(t,Ws(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);const _=new gt(t,Ws(43));_.position.set(-.462,8.89,14.52),_.scale.set(4.38,5.441,.088),this.add(_);const m=new gt(t,Ws(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const p=new gt(t,Ws(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Ws(i){const t=new Le;return t.color.setScalar(i),t}const iS=.1,sS=.045;class rS{constructor(t,e){this.canvas=t,this.fixedPixelRatio=e,this.renderer=new iy({canvas:t,antialias:!0,powerPreference:"high-performance"}),this.renderer.toneMapping=Yd,this.renderer.toneMappingExposure=1.05,this.scene.background=new Bt(Vt.background);const n=new Vc(this.renderer);this.scene.environment=n.fromScene(new nS,.04).texture,this.scene.environmentIntensity=.55,n.dispose();const s=new gu(16777215,1.6);s.position.set(40,90,70);const r=new gu(10336511,.5);r.position.set(-70,30,-40),this.scene.add(s,r,new gg(14674175,724500,.35)),t.addEventListener("webglcontextlost",a=>{a.preventDefault(),de.error("stage","webgl_context_lost")}),t.addEventListener("webglcontextrestored",()=>de.warn("stage","webgl_context_restored"));const o=this.renderer.getContext();de.info("stage","renderer_ready",{maxTextureSize:this.renderer.capabilities.maxTextureSize,floatTargets:this.supportsFloatTargets(),vendor:o.getParameter(o.VENDOR),renderer:o.getParameter(o.RENDERER)}),this.resize()}renderer;scene=new lh;camera=new bn(30,16/9,1,2e3);width=1;height=1;target=new P;projected=new P;supportsFloatTargets(){const t=this.renderer.extensions;return t.has("EXT_color_buffer_float")||t.has("EXT_color_buffer_half_float")}resize(){const t=Math.max(1,window.innerWidth),e=Math.max(1,window.innerHeight);t===this.width&&e===this.height||(this.width=t,this.height=e,this.renderer.setPixelRatio(this.fixedPixelRatio??Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.setViewOffset(t,e,t*iS,e*sS,t,e),this.camera.updateProjectionMatrix(),de.info("stage","resize",{width:t,height:e,pixelRatio:this.renderer.getPixelRatio()}))}orbit(t,e,n,s,r=30){const o=n*Math.PI/180,a=s*Math.PI/180;this.target.set(t[0],t[1],t[2]),this.camera.position.set(t[0]+e*Math.cos(a)*Math.sin(o),t[1]+e*Math.sin(a),t[2]+e*Math.cos(a)*Math.cos(o)),this.camera.fov!==r&&(this.camera.fov=r,this.camera.updateProjectionMatrix()),this.camera.lookAt(this.target),this.camera.updateMatrixWorld()}project(t,e,n){return this.projected.set(t,e,n).project(this.camera),{x:(this.projected.x*.5+.5)*this.width,y:(-this.projected.y*.5+.5)*this.height,visible:this.projected.z>-1&&this.projected.z<1}}render(){this.renderer.render(this.scene,this.camera)}}const ua=[{id:"conventional",section:"behaviors",make:i=>new zy(i)},{id:"write",section:"behaviors",make:i=>new zM(i)},{id:"attach",section:"behaviors",make:i=>new Ny(i)},{id:"align",section:"behaviors",make:i=>new gy(i)},{id:"latch",section:"behaviors",make:i=>new aM(i)},{id:"spring",section:"behaviors",make:i=>new MM(i)},{id:"torque",section:"behaviors",make:i=>new OM(i)},{id:"switch",section:"behaviors",make:i=>new CM(i)},{id:"summary",section:"behaviors",make:i=>new wM(i)},{id:"applications",section:"applications",make:i=>new od(i,{id:"applications",heading:"Applications",lead:"The same writing process, applied to nine engineering problems.",seconds:4.6})},{id:"coupler",section:"applications",make:i=>new Xy(i)},{id:"release",section:"applications",make:i=>new pM(i)},{id:"keyed",section:"applications",make:i=>new iM(i)},{id:"isolation",section:"applications",make:i=>new Jy(i)},{id:"encoder",section:"applications",make:i=>new $y(i)},{id:"concentrate",section:"applications",make:i=>new Oy(i)},{id:"shunt",section:"applications",make:i=>new _M(i)},{id:"assemble",section:"applications",make:i=>new by(i)},{id:"thread",section:"applications",make:i=>new DM(i)},{id:"closing",section:"applications",make:i=>new od(i,{id:"closing",heading:"Applications Shown",items:["Cryogenic Fluid Coupler","Flight Release Mechanism","Keyed Interface","Vibration Isolation","Position Sensing","Flux Concentration","Rotor Lightweighting","Magnetization After Assembly","Design to Magnet"],brand:!0,seconds:8})}];function oS(i){const t=i.get("chapters");if(t){const n=t.split(",").map(o=>o.trim()).filter(Boolean),s=n.filter(o=>!ua.some(a=>a.id===o));s.length>0&&de.warn("app","unknown_chapters_param",{unknown:s});const r=n.flatMap(o=>ua.filter(a=>a.id===o));if(r.length>0)return r}const e=i.get("reel");return e==="behaviors"||e==="applications"?ua.filter(n=>n.section===e):(e&&e!=="all"&&de.warn("app","unknown_reel_param",{reel:e}),ua)}function aS(){const i=new URLSearchParams(window.location.search),t=i.get("capture")==="1",e=!t&&i.get("ui")!=="0";document.body.classList.toggle("capture",t),de.info("app","start",{url:window.location.pathname+window.location.search,userAgent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`,devicePixelRatio:window.devicePixelRatio,capture:t});const n=xp();de.info("physics","ready",{sites:n.lattice.count,timingsMs:n.timingsMs,attachRatio:Number(n.attach.ratioAtContact.toFixed(3)),alignSidelobe:Number(n.align.sidelobe.toFixed(3)),latchHoldAtRelease:Number(n.latch.holdAtRelease.toFixed(3)),springBalanceGapMm:Number(n.spring.equilibriumGap.toFixed(2)),torquePullOutDeg:n.torque.pullOutAngleDeg,switchOffFraction:Number(n.switching.offFraction.toFixed(4))});const s=document.getElementById("stage");if(!(s instanceof HTMLCanvasElement))throw new Error("The #stage canvas is missing from index.html");const r=new rS(s,t?1:null),o=new QM(r),a={stage:r,hud:o,physics:n,lattice:n.lattice,floatTargets:r.supportsFloatTargets()},l=oS(i).map(w=>w.make(a)),c=new KM(l);new eS(c,e);const u=performance.now();for(const w of l)w.setVisible(!0),o.beginLabels(),w.update(w.duration/2),o.endLabels(),w.prepare?.(),r.render(),w.setVisible(!1);o.beginLabels(),o.endLabels(),de.info("app","warm_up",{ms:Math.round(performance.now()-u)});const h=()=>{r.resize(),o.beginLabels();const w=c.apply(),{index:A,local:C}=c.locate(c.time);o.setChapter(A,l.length,w.title,X(C,Vu[0],Vu[1])),o.endLabels(),o.setDip(c.dip()),w.prepare?.(),r.render()},d=i.get("chapter");if(d){const w=l.findIndex(C=>C.id===d),A=w>=0?w:Number(d)-1;Number.isInteger(A)&&A>=0&&A<l.length?c.seekChapter(A):de.warn("app","unknown_chapter_param",{chapter:d})}const f=Number(i.get("t"));i.has("t")&&Number.isFinite(f)&&c.seek(f);const g=i.get("loop");(g==="chapter"||g==="all")&&c.setLoop(g);const _=Number(i.get("speed"));i.has("speed")&&_>0&&_<=4&&c.setSpeed(_),window.__reel={duration:c.duration,chapters:l.map((w,A)=>({id:w.id,title:w.title,start:c.starts[A],duration:w.duration})),seek(w){c.pause(),c.seek(w),h()},play:()=>c.play(),pause:()=>c.pause(),state:()=>c.state(),logs:()=>de.entries()},h(),document.getElementById("boot")?.classList.add("done"),de.info("app","ready",{duration:c.duration,chapters:l.map(w=>w.id)}),!t&&i.get("autoplay")!=="0"&&c.play();let m=performance.now(),p=0,S=m,x=0;const v=w=>{const A=Math.min(.1,(w-m)/1e3);if(m=w,c.tick(A),h(),p++,p===120){const C=(w-S)/p;c.playing&&C>34&&w-x>1e4&&(x=w,de.warn("perf","slow_frames",{averageMs:Number(C.toFixed(1)),chapter:l[c.locate(c.time).index].id})),p=0,S=w}requestAnimationFrame(v)};requestAnimationFrame(v)}$M();try{aS()}catch(i){const t=i instanceof Error?i.message:String(i);de.error("app","start_failed",{message:t,stack:i instanceof Error?i.stack:void 0});const e=document.getElementById("boot");e&&(e.classList.remove("done"),e.textContent=`The reel could not start.
${t}`)}
