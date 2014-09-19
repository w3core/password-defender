/**
 * PasswordDefender :pd:
 * 
 * PasswordDefender is the tiny bookmark script which allows to create unique strong
 * one-side password for each unique site by using your master password.
 *
 * Features
 * --------
 * + A unique one-way password for each site by using your single master password.
 * + The generated password is extra strong and long independently by length of master password.
 * + Does not require any registration, storage and any extentions.
 * + Cross browser support.
 * + Offline mode support.
 * + Extra simple for usage.
 * 
 * Installation
 * ------------
 * 1. Create new bookmark in most visible space of your browser
 * 2. Set name of the bookmark as "Password"
 * 3. Copy to the clipboard content of "bookmark.js" file.
 * 4. Set location URL of the bookmark (paste from clipboard)
 * 
 * Usage
 * -----
 * 1. Open "sign-in" or "sign-up" page of any site
 * 2. Tap to the "Password" bookmark
 * 3. You can see the "Password" widget in left-top side of page
 * 4. Enter your master password to the password field of the widget
 * 5. Tap to the password field on "sign-in" or "sign-up" form of the page
 * 6. Tap to the [▸] button on the widget 
 *    (encrypted password will be inserted to the password field)
 * 
 * Building (optional)
 * -------------------
 * 1. Minify "src/script.js"
 * 2. Encode minified script by using URI scheme
 * 3. Wrap minified and encoded script "javascript:void(SOURCE)"
 * 4. Save as "bookmark.js"
 * 
 * @version 2014.09.19
 * 
 * @url http://w3core.github.io/password-defender
 * @license BSD License
 * @author Max Chuhryaev
 * 
 * @constructor
 * @uses https://github.com/emn178/js-sha512
 * @uses http://javascript-minifier.com/
 * @uses http://meyerweb.com/eric/tools/dencoder/
 * 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

(!new function(HTML,self,document,location,unescape,encodeURIComponent,userAgent,String,alert,setTimeout){

 if(self.$_pd_$!=null) return self.$_pd_$.show();

 var that=this,click='click',CLOSE,NAME,PASSPHRASE,VIEW,HERE,MSG;

 function __construct () {
  initEscapeHandler();
  initPasswordFieldHandler();
  handle('submit', DOM(), function(e){
   var o = opts();
   if (!o) return false;
   if (isStandalone()) return VIEW.click();
   if (!HERE) return alert('Please, set focus to password field where the password should to be pasted and then press "PASTE" button');
   HERE.focus();
   setTimeout(function(){
    HERE.value = make(o.name,o.pwd);
   },100);
  });
  initNameFieldHandler();
  initMasterPasswordFieldHandler();
  show();
 }

 function DOM () {
  var s = self.$_pd_$;
  if (s == null) {
   var _ = {'opera':'-o-','firefox':'-moz-','webkit':'-webkit-'};
   var ua = userAgent.match(/opera|firefox|webkit/);
   var pfx = ua && ua[0] && _[ua[0]]?_[ua[0]]:'';
   var html = HTML
    .replace(/-R-/g, '_'+(Math.random().toString().substr(2) + (new Date).getTime()))
    .replace(/-P-/g, pfx)
    ;
   s = HTML2DOM(html)[0];
   NAME = s.querySelector('.nm');
   PASSPHRASE = s.querySelector('.pwd');
   MSG =  s.querySelector('.msg');
   s.show = show;
   CLOSE = s.querySelector('.cls');
   if (CLOSE) handle(click, CLOSE, hide);
   VIEW = s.querySelector('.view');
   if (VIEW) handle(click, VIEW, function(){
    var o = opts();
    if (!o) return false;
    prompt('Your password is:', make(o.name,o.pwd));
   });
   self.$_pd_$ = s;
  }
  return s;
 }

 function show () {
  document.body.appendChild(DOM());
  PASSPHRASE.focus();
 }

 function hide () {
  if (DOM().parentNode) {
   DOM().parentNode.removeChild(DOM());
   PASSPHRASE.value = '';
  }
 }

 function message (html) {
  if (!MSG) return;
  MSG.innerHTML = html?String(html):'';
  MSG.style.display = html?'block':'none';
 }

 function opts () {
  var o = {};
  if (!NAME.value || !NAME.value.length) {
   alert ('Please, enter site name or URL');
   if (NAME) NAME.focus();
   return !1;
  }
  o.name = parseSubDomain(NAME.value);
  if (!PASSPHRASE || !PASSPHRASE.value || !PASSPHRASE.value.length) {
   alert ('Please, enter your password');
   if (PASSPHRASE) PASSPHRASE.focus();
   return !1;
  }
  o.pwd = PASSPHRASE.value;
  return o;
 }

 function isStandalone () { return (DOM() && DOM().standalone); }

 function initNameFieldHandler () {
  function update () {NAME.value = !!NAME.value.length?parseSubDomain(NAME.value):(!isStandalone()?parseSubDomain():NAME.value)}
  handle('blur', NAME, update);
  update();
  resizable(NAME);
 }

 function initMasterPasswordFieldHandler () {
  handle('keyup', PASSPHRASE, function(){
   setTimeout(function(){
    if (PASSPHRASE.value.match(/[^\x00-\x7F]/)) message('Regional characters detected in your master password.<br>Be sure that you are using correct keyboard layout.');
    else message();    
   },20);
  });
 }

 function initPasswordFieldHandler () {
  handle(click, document.body, function(){
   if (
     document.activeElement
     && document.activeElement.type
     && document.activeElement.type.toLowerCase() == 'password'
     && document.activeElement != PASSPHRASE
   ) HERE = document.activeElement;
  });
 }

 function initEscapeHandler () {
  handle('keydown', document, function(e){
   if (e.keyCode == 27) hide();
  });
 }

 function make (name, passphrase) {
  var passwd = unescape(encodeURIComponent(passphrase));
  var result = that.sha512(passwd).toString();
  var sum = 0;
  for (var i=0; i<passwd.length; i++) sum += passwd.charCodeAt(i);
  var i = (sum % 61) + 32;
  result = that.sha512(result.substr(0,i) + name + result.substr(i) + String.fromCharCode( '0x'+sum%251 )).toString();
  result = result.substr(0+sum%31, 32*3);
  return passFromHash(result, 32);
 }

 function passFromHash (hash,passLength) {
  // hash.lenght must be >= passLength * HEX2CHAR
  var HEX2CHAR = 3;
  var CHARS = 'abcdefghijklmnoprstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!$@_-~ ';
  var result = '';
  for (var i = 0; i<passLength; i++) {
   var partText = hash.substring(i*HEX2CHAR,(i+1)*HEX2CHAR);
   var partVal  = parseInt(partText,16);
   if (isNaN(partVal)) { throw('code:1'); } // Too short hash string
   if (partVal < 0) { throw('code:2'); } // Invalid hash string
   result += '' + CHARS.charAt(partVal % CHARS.length);
  }
  return result;
 }

 function parseSubDomain (url) {
  var v = decodeURIComponent(parseDomain(arguments.length ? String(url) : location.href));
  if (v.match(/^(\d{1,3}\.){3}\d{1,3}$/)) return v;
  var prefix = 'pda.m.mob.mobile.tablet.tab.account.accounts.auth.login.my.mail.new';
  var suffix = 'aero.asia.biz.cat.com.coop.edu.gov.info.int.jobs.mil.mobi.name.net.org.pro.tel.xxx.today.ac.ad.ae.af.ag.ai.al.am.an.ao.aq.ar.as.at.au.aw.ax.az.ba.bb.bd.be.bf.bg.bh.bi.bj.bm.bn.bo.br.bs.bt.bv.bw.by.bz.ca.cc.cd.cf.cg.ch.ci.ck.cl.cm.cn.co.cr.cs.cu.cv.cw.cx.cy.cz.dd.de.dj.dk.dm.do.dz.ec.ee.eg.eh.er.es.et.eu.fi.fj.fk.fm.fo.fr.ga.gb.gd.ge.gf.gg.gh.gi.gl.gm.gn.gp.gq.gr.gs.gt.gu.gw.gy.hk.hm.hn.hr.ht.hu.id.ie.il.im.in.io.iq.ir.is.it.je.jm.jo.jp.ke.kg.kh.ki.km.kn.kp.kr.kw.ky.kz.la.lb.lc.li.lk.lr.ls.lt.lu.lv.ly.ma.mc.md.me.mg.mh.mk.ml.mm.mn.mo.mp.mq.mr.ms.mt.mu.mv.mw.mx.my.mz.na.nc.ne.nf.ng.ni.nl.no.np.nr.nu.nz.om.pa.pe.pf.pg.ph.pk.pl.pm.pn.pr.ps.pt.pw.py.qa.re.ro.rs.ru.rw.sa.sb.sc.sd.se.sg.sh.si.sj.sk.sl.sm.sn.so.sr.ss.st.su.sv.sx.sy.sz.tc.td.tf.tg.th.tj.tk.tl.tm.tn.to.tp.tr.tt.tv.tw.tz.ua.ug.uk.us.uy.uz.va.vc.ve.vg.vi.vn.vu.wf.ws.ye.yt.yu.za.zm.zw';
  prefix = new RegExp('^('+prefix.split('.').join('|')+')\\.');
  suffix = new RegExp('\\.('+suffix.split('.').join('|')+')$');
  v = v.replace(suffix,'').replace(suffix,'');
  if (v.split('.').length > 1) v = v.replace(prefix,'');
  v = v.split('.');
  return v[v.length-1];
 }

 function parseDomain (url) {
  var url = arguments.length ? String(url) : location.href;
  if (userAgent.match(/(opera|chrome)/g) && url.match(/^[0-9.]+$/)) return url; // Blink engine bugfix
  url = url.match(/^[htfps]{3,5}\:\/\//i) ? url : (location.protocol + '//' + url);
  var a = document.createElement('a');
  a.href = url;
  return a.hostname.replace(/^www\./i, '');
 }

 function HTML2DOM (str) {
  var d = document.createElement('div');
  d.innerHTML = str;
  var r = [], o = d.childNodes;
  for (var i=0; i<o.length; i++) r.push(o[i].nodeType === 3 ? o[i].cloneNode(false) : o[i]);
  for (var i=r.length-1; i>=0; i--) if (r[i].parentNode) r[i].parentNode.removeChild(r[i]);
  return r;
 }

 function resizable (el, factor) {
  var int = Number(factor) || 7;
  function resize() {el.style.width = ((el.value.length+1) * int) + 'px'}
  var e = 'keyup.keypress.focus.blur.change'.split('.');
  for (var i in e) handle(e[i], el, resize);
  resize();
 }

 function handle (event, node, fn, capture) {node.addEventListener(event, fn, !!capture)}

 __construct();

(function(m,K){var a=function(a,h){this.high=a|0;this.low=h|0},z='0123456789abcdef'.split(''),E={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,a:10,b:11,c:12,d:13,e:14,f:15,A:10,B:11,C:12,D:13,E:14,F:15},J=[new a(1116352408,3609767458),new a(1899447441,602891725),new a(3049323471,3964484399),new a(3921009573,2173295548),new a(961987163,4081628472),new a(1508970993,3053834265),new a(2453635748,2937671579),new a(2870763221,3664609560),new a(3624381080,2734883394),new a(310598401,1164996542),new a(607225278,
1323610764),new a(1426881987,3590304994),new a(1925078388,4068182383),new a(2162078206,991336113),new a(2614888103,633803317),new a(3248222580,3479774868),new a(3835390401,2666613458),new a(4022224774,944711139),new a(264347078,2341262773),new a(604807628,2007800933),new a(770255983,1495990901),new a(1249150122,1856431235),new a(1555081692,3175218132),new a(1996064986,2198950837),new a(2554220882,3999719339),new a(2821834349,766784016),new a(2952996808,2566594879),new a(3210313671,3203337956),new a(3336571891,
1034457026),new a(3584528711,2466948901),new a(113926993,3758326383),new a(338241895,168717936),new a(666307205,1188179964),new a(773529912,1546045734),new a(1294757372,1522805485),new a(1396182291,2643833823),new a(1695183700,2343527390),new a(1986661051,1014477480),new a(2177026350,1206759142),new a(2456956037,344077627),new a(2730485921,1290863460),new a(2820302411,3158454273),new a(3259730800,3505952657),new a(3345764771,106217008),new a(3516065817,3606008344),new a(3600352804,1432725776),new a(4094571909,
1467031594),new a(275423344,851169720),new a(430227734,3100823752),new a(506948616,1363258195),new a(659060556,3750685593),new a(883997877,3785050280),new a(958139571,3318307427),new a(1322822218,3812723403),new a(1537002063,2003034995),new a(1747873779,3602036899),new a(1955562222,1575990012),new a(2024104815,1125592928),new a(2227730452,2716904306),new a(2361852424,442776044),new a(2428436474,593698344),new a(2756734187,3733110249),new a(3204031479,2999351573),new a(3329325298,3815920427),new a(3391569614,
3928383900),new a(3515267271,566280711),new a(3940187606,3454069534),new a(4118630271,4000239992),new a(116418474,1914138554),new a(174292421,2731055270),new a(289380356,3203993006),new a(460393269,320620315),new a(685471733,587496836),new a(852142971,1086792851),new a(1017036298,365543100),new a(1126000580,2618297676),new a(1288033470,3409855158),new a(1501505948,4234509866),new a(1607167915,987167468),new a(1816402316,1246189591)],k=function(a){return q(a,512)},F=function(a){return q(a,384)},G=
function(a){return q(a,256)},H=function(a){return q(a,224)},q=function(b,h){var f;a:{for(f=b.length;f--;)if(127<b.charCodeAt(f)){f=!0;break a}f=!1}if(f){var e=encodeURIComponent(b);f=[];for(var d=0,c=0,g=e.length;d<g;++d){var n=e.charCodeAt(d);f[c>>2]=37==n?f[c>>2]|(E[e.charAt(++d)]<<4|E[e.charAt(++d)])<<(3-c%4<<3):f[c>>2]|n<<(3-c%4<<3);++c}e=(c+16>>7)+1<<5;d=c>>2;f[d]|=128<<(3-c%4<<3);for(d+=1;d<e;++d)f[d]=0;f[e-1]=c<<3;c=[];for(d=0;d<e;d+=2)c[d>>1]=new a(f[d],f[d+1]);f=c}else{e=b.length;f=(e+16>>
7)+1<<5;d=[];for(c=0;c<f;++c)d[c]=0;for(c=0;c<e;++c)d[c>>2]|=b.charCodeAt(c)<<(3-c%4<<3);d[c>>2]|=128<<(3-c%4<<3);d[f-1]=e<<3;e=[];for(c=0;c<f;c+=2)e[c>>1]=new a(d[c],d[c+1]);f=e}if(512==h)var l=new a(1779033703,4089235720),k=new a(3144134277,2227873595),s=new a(1013904242,4271175723),t=new a(2773480762,1595750129),u=new a(1359893119,2917565137),v=new a(2600822924,725511199),w=new a(528734635,4215389547),x=new a(1541459225,327033209);else 384==h?(l=new a(3418070365,3238371032),k=new a(1654270250,
914150663),s=new a(2438529370,812702999),t=new a(355462360,4144912697),u=new a(1731405415,4290775857),v=new a(2394180231,1750603025),w=new a(3675008525,1694076839),x=new a(1203062813,3204075428)):256==h?(l=new a(573645204,4230739756),k=new a(2673172387,3360449730),s=new a(596883563,1867755857),t=new a(2520282905,1497426621),u=new a(2519219938,2827943907),v=new a(3193839141,1401305490),w=new a(721525244,746961066),x=new a(246885852,2177182882)):224==h&&(l=new a(2352822216,424955298),k=new a(1944164710,
2312950998),s=new a(502970286,855612546),t=new a(1738396948,1479516111),u=new a(258812777,2077511080),v=new a(2011393907,79989058),w=new a(1067287976,1780299464),x=new a(286451373,2446758561));d=0;for(c=f.length;d<c;d+=16){for(var e=[],y,p,g=0;16>g;++g)e[g]=f[d+g];for(g=16;80>g;++g)y=e[g-15].rightRotate(1).xor(e[g-15].rightRotate(8)).xor(e[g-15].shiftRightUnsigned(7)),p=e[g-2].rightRotate(19).xor(e[g-2].rightRotate(61)).xor(e[g-2].shiftRightUnsigned(6)),e[g]=e[g-16].add(y).add(e[g-7]).add(p);for(var n=
l,m=k,A=s,q=t,r=u,B=v,C=w,D=x,z,g=0;80>g;++g)y=n.rightRotate(28).xor(n.rightRotate(34)).xor(n.rightRotate(39)),p=n.and(m).xor(n.and(A)).xor(m.and(A)),y=y.add(p),p=r.rightRotate(14).xor(r.rightRotate(18)).xor(r.rightRotate(41)),z=r.and(B).xor(r.not().and(C)),p=D.add(p).add(z).add(J[g]).add(e[g]),D=C,C=B,B=r,r=q.add(p),q=A,A=m,m=n,n=p.add(y);l=l.add(n);k=k.add(m);s=s.add(A);t=t.add(q);u=u.add(r);v=v.add(B);w=w.add(C);x=x.add(D)}l=l.toHexString()+k.toHexString()+s.toHexString()+t.toHexString();if(224==
h)return l.substr(0,l.length-8);384<=h&&(l+=u.toHexString()+v.toHexString());512==h&&(l+=w.toHexString()+x.toHexString());return l},I=function(a){for(var h='',f=0;4>f;f++)var e=3-f<<3,h=h+(z[a>>e+4&15]+z[a>>e&15]);return h};a.prototype.and=function(b){return new a(this.high&b.high,this.low&b.low)};a.prototype.xor=function(b){return new a(this.high^b.high,this.low^b.low)};a.prototype.not=function(){return new a(~this.high,~this.low)};a.prototype.shiftRightUnsigned=function(b){b&=63;return 0==b?new a(this.high,
this.low):32>b?new a(this.high>>>b,this.low>>>b|this.high<<32-b):32==b?new a(0,this.high):new a(0,this.high>>>b-32)};a.prototype.rightRotate=function(b){b&=63;return 0==b?new a(this.high,this.low):32>b?new a(this.high>>>b|this.low<<32-b,this.low>>>b|this.high<<32-b):32==b?new a(this.low,this.high):new a(this.low>>>b-32|this.high<<64-b,this.high>>>b-32|this.low<<64-b)};a.prototype.add=function(b){var h=(this.low&65535)+(b.low&65535),f=(this.low>>>16)+(b.low>>>16)+(h>>>16),e=(this.high&65535)+(b.high&
65535)+(f>>>16);return new a((this.high>>>16)+(b.high>>>16)+(e>>>16)<<16|e&65535,f<<16|h&65535)};a.prototype.toHexString=function(){return I(this.high)+I(this.low)};'undefined'!=typeof module?(k.sha512=k,k.sha384=F,k.sha512_256=G,k.sha512_224=H,module.exports=k):m&&(m.sha512=k,m.sha384=F,m.sha512_256=G,m.sha512_224=H)})(this);

}(
    "<form id=-R- action='javascript:void(0)'>"
  + "<button type=button class=cls title='Close [ESC]'>&times;</button>"
  + "<style>"
  + "#-R- :focus{outline:none}#-R- ::-moz-focus-inner{border:0}"
  + "#-R-{z-index:9999999999;display:block;position:fixed;top:0;left:0;margin:0;padding:0;border-radius:0 0 3px 0;box-shadow:0 0 200px 100px #fff;width:auto;height:auto;white-space:nowrap;font-size:0;line-height:0}"
  + "#-R- *{position:relative;height:32px;min-height:initial;border-radius:0;vertical-align:middle;box-sizing:border-box;box-shadow:none;margin:0 0 0 -1px;text-decoration:none;text-transform:none;border:1px solid #4173c9;padding:0;color:#fff}"
  + "#-R-:before {content:'';display:block;position:absolute;width:100%;height:100%;box-shadow:0 1px 2px rgba(0,0,0,.5);border-radius:0 0 3px 0}"
  + "#-R- input{z-index:1;display:inline-block;width:160px;background:#f3f3f3;text-shadow:1px 1px 0 #fff;font:normal normal 13px arial,sans-serif;line-height:30px;text-align:center;color:#333;box-shadow:inset 0px 1px 6px rgba(0,0,0,.3)}"
  + "#-R- button,#-R- label{z-index:2;cursor:pointer;display:inline-block;font:normal bold 16px arial,sans-serif;width:32px;line-height:28px;text-shadow:0 -1px 0 rgba(0,0,0,.5);background:-moz-linear-gradient(top,#5e8ee4 0,#4173c9 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#5e8ee4),color-stop(100%,#4173c9));background:-webkit-linear-gradient(top,#5e8ee4 0,#4173c9 100%);background:-o-linear-gradient(top,#5e8ee4 0,#4173c9 100%);background:-ms-linear-gradient(top,#5e8ee4 0,#4173c9 100%);background:linear-gradient(to bottom,#5e8ee4 0,#4173c9 100%)}"
  + "#-R- button:hover,#-R- label:hover,#-R- .msg{border-color:#396bbc;background:-moz-linear-gradient(top,#5587d7 0,#396bbc 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#5587d7),color-stop(100%,#396bbc));background:-webkit-linear-gradient(top,#5587d7 0,#396bbc 100%);background:-o-linear-gradient(top,#5587d7 0,#396bbc 100%);background:-ms-linear-gradient(top,#5587d7 0,#396bbc 100%);background:linear-gradient(to bottom,#5587d7 0,#396bbc 100%)}"
  + "#-R- button:active{box-shadow:inset 0 2px 4px rgba(0,0,0,.24)}#-R->:last-child{border-radius:0 0 2px 0}"
  + "#-R- .msg{display:none;position:absolute;font:normal normal 11px arial;white-space:normal;top:100%;left:30px;padding:2px 4px;height:auto;width:160px;border-radius:3px;margin:6px 0 0;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,.5);text-shadow:0 -1px 0 rgba(0,0,0,.3);-P-animation:-R- .5s infinite ease alternate}"
  + "#-R- .msg:before{content:'';position:absolute;left:50%;top:-6px;margin:0 0 0 -5px;display:block;width:0;height:0;border-style:solid;border-width:0 5px 6px 5px;border-color:transparent transparent #5587d7 transparent}"
  + "#-R- label{width:auto;padding:0 0 0 6px}"
  + "#-R- .nm{cursor:pointer;background:transparent;border:0;height:30px;margin-left:6px;color:#fff;text-align:left;text-shadow:0 -1px 0 rgba(0,0,0,.5);box-shadow:none;-P-transition:width .3s,min-width .3s;-P-animation:-R-nm .5s infinite linear alternate}"
  + "#-R- .nm:focus{cursor:initial;min-width:160px!important;background:#f3f3f3;text-align:center;text-shadow:1px 1px 0 #fff;box-shadow:inset 0px 1px 6px rgba(0,0,0,.3);color:#333;-P-animation:none}"
  + "@-P-keyframes -R-{from{-P-transform:translateY(0)}to{-P-transform:translateY(10px)}}"
  + "@-P-keyframes -R-nm{from{opacity:1}to{opacity:.3}}"
  + "</style>"
  + "<input class=pwd type=password placeholder='Enter your password'>"
  + "<label title='Enter site name or URL'>@<input class=nm type=text placeholder='Enter site name or URL'></label>"
  + "<i class=msg></i>"
  + "<button type=button class=view title='Show encrypted password'>&odot;</button>"
  + "<button type=submit title='Paste encrypted password to active password field'>&#9658;</button>"
  + "</form>"
  , self
  , document
  , location
  , unescape
  , encodeURIComponent
  , navigator.userAgent.toLowerCase()
  , String
  , alert
  , setTimeout
));