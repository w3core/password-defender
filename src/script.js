/**
 * CryptoPass
 * 
 * CryptoPass is the tiny bookmark script which allows to create unique strong
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
 * @version 2014.09.03
 * 
 * @url http://w3core.github.io/cryptopass
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

(new function(HTML,self,document,location,unescape,encodeURIComponent){

 if(self.$_cryptopass_$!=null) return self.$_cryptopass_$.show();

 var that=this,HERE,PASSPHRASE;

 function __construct () {
  initEscapeHandler();
  initPasswordFieldHandler();
  DOM().addEventListener('submit', function(e){
   if (!PASSPHRASE.value.length) {
    alert('Please, enter your password');
    PASSPHRASE.focus();
    return false;
   }
   if (!HERE) return alert('Please, set focus to password field where the password should to be pasted and then press "PASTE" button.');
   HERE.focus();
   setTimeout(function(){
    HERE.value = make(PASSPHRASE.value);
   },100);
  }, false);
  show();
 }

 function DOM () {
  var s = self.$_cryptopass_$;
  if (s == null) {
   s = HTML2DOM(HTML.replace(/ROOT/g, '_'+(Math.random().toString().substr(2) + (new Date).getTime())))[0];
   PASSPHRASE = s.querySelector('[name=passphrase]');
   s.show = show;
   var close = s.querySelector('[name=close]');
   if (close) close.addEventListener('click', hide, false);
   var preview = s.querySelector('[name=preview]');
   if (preview) preview.addEventListener('click', function(){
    prompt('Your password is:', make(PASSPHRASE.value));
   }, false);
   self.$_cryptopass_$ = s;
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

 function initPasswordFieldHandler () {
  document.body.addEventListener('click', function(){
   if (document.activeElement && document.activeElement.type == 'password' && document.activeElement != PASSPHRASE) HERE = document.activeElement;
  }, false);
 }

 function initEscapeHandler () {
  document.addEventListener('keydown', function (e) {
   if (e.keyCode == 27) hide();
  }, false);
 }

 function make (passphrase) {
  var passwd = unescape(encodeURIComponent(passphrase));
  var result = that.sha512(passwd).toString();
  var name = parseSubDomain();
  var sum = 0;
  for (var i=0; i<passwd.length; i++) sum += passwd.charCodeAt(i);
  var i = (sum % 61) + 32;
  result = that.sha512(result.substr(0,i) + name + result.substr(i) + String.fromCharCode( '0x'+sum%251 )).toString();
  return btoa(result).substr(64+sum%31, 32);
 }

 function parseSubDomain (url) {
  return parseDomain(url).split('.')[0];
 }

 function parseDomain (url) {
  var url = url ? String(url) : location.href;
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

 __construct();

(function(m,K){var a=function(a,h){this.high=a|0;this.low=h|0},z="0123456789abcdef".split(""),E={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,a:10,b:11,c:12,d:13,e:14,f:15,A:10,B:11,C:12,D:13,E:14,F:15},J=[new a(1116352408,3609767458),new a(1899447441,602891725),new a(3049323471,3964484399),new a(3921009573,2173295548),new a(961987163,4081628472),new a(1508970993,3053834265),new a(2453635748,2937671579),new a(2870763221,3664609560),new a(3624381080,2734883394),new a(310598401,1164996542),new a(607225278,
1323610764),new a(1426881987,3590304994),new a(1925078388,4068182383),new a(2162078206,991336113),new a(2614888103,633803317),new a(3248222580,3479774868),new a(3835390401,2666613458),new a(4022224774,944711139),new a(264347078,2341262773),new a(604807628,2007800933),new a(770255983,1495990901),new a(1249150122,1856431235),new a(1555081692,3175218132),new a(1996064986,2198950837),new a(2554220882,3999719339),new a(2821834349,766784016),new a(2952996808,2566594879),new a(3210313671,3203337956),new a(3336571891,
1034457026),new a(3584528711,2466948901),new a(113926993,3758326383),new a(338241895,168717936),new a(666307205,1188179964),new a(773529912,1546045734),new a(1294757372,1522805485),new a(1396182291,2643833823),new a(1695183700,2343527390),new a(1986661051,1014477480),new a(2177026350,1206759142),new a(2456956037,344077627),new a(2730485921,1290863460),new a(2820302411,3158454273),new a(3259730800,3505952657),new a(3345764771,106217008),new a(3516065817,3606008344),new a(3600352804,1432725776),new a(4094571909,
1467031594),new a(275423344,851169720),new a(430227734,3100823752),new a(506948616,1363258195),new a(659060556,3750685593),new a(883997877,3785050280),new a(958139571,3318307427),new a(1322822218,3812723403),new a(1537002063,2003034995),new a(1747873779,3602036899),new a(1955562222,1575990012),new a(2024104815,1125592928),new a(2227730452,2716904306),new a(2361852424,442776044),new a(2428436474,593698344),new a(2756734187,3733110249),new a(3204031479,2999351573),new a(3329325298,3815920427),new a(3391569614,
3928383900),new a(3515267271,566280711),new a(3940187606,3454069534),new a(4118630271,4000239992),new a(116418474,1914138554),new a(174292421,2731055270),new a(289380356,3203993006),new a(460393269,320620315),new a(685471733,587496836),new a(852142971,1086792851),new a(1017036298,365543100),new a(1126000580,2618297676),new a(1288033470,3409855158),new a(1501505948,4234509866),new a(1607167915,987167468),new a(1816402316,1246189591)],k=function(a){return q(a,512)},F=function(a){return q(a,384)},G=
function(a){return q(a,256)},H=function(a){return q(a,224)},q=function(b,h){var f;a:{for(f=b.length;f--;)if(127<b.charCodeAt(f)){f=!0;break a}f=!1}if(f){var e=encodeURIComponent(b);f=[];for(var d=0,c=0,g=e.length;d<g;++d){var n=e.charCodeAt(d);f[c>>2]=37==n?f[c>>2]|(E[e.charAt(++d)]<<4|E[e.charAt(++d)])<<(3-c%4<<3):f[c>>2]|n<<(3-c%4<<3);++c}e=(c+16>>7)+1<<5;d=c>>2;f[d]|=128<<(3-c%4<<3);for(d+=1;d<e;++d)f[d]=0;f[e-1]=c<<3;c=[];for(d=0;d<e;d+=2)c[d>>1]=new a(f[d],f[d+1]);f=c}else{e=b.length;f=(e+16>>
7)+1<<5;d=[];for(c=0;c<f;++c)d[c]=0;for(c=0;c<e;++c)d[c>>2]|=b.charCodeAt(c)<<(3-c%4<<3);d[c>>2]|=128<<(3-c%4<<3);d[f-1]=e<<3;e=[];for(c=0;c<f;c+=2)e[c>>1]=new a(d[c],d[c+1]);f=e}if(512==h)var l=new a(1779033703,4089235720),k=new a(3144134277,2227873595),s=new a(1013904242,4271175723),t=new a(2773480762,1595750129),u=new a(1359893119,2917565137),v=new a(2600822924,725511199),w=new a(528734635,4215389547),x=new a(1541459225,327033209);else 384==h?(l=new a(3418070365,3238371032),k=new a(1654270250,
914150663),s=new a(2438529370,812702999),t=new a(355462360,4144912697),u=new a(1731405415,4290775857),v=new a(2394180231,1750603025),w=new a(3675008525,1694076839),x=new a(1203062813,3204075428)):256==h?(l=new a(573645204,4230739756),k=new a(2673172387,3360449730),s=new a(596883563,1867755857),t=new a(2520282905,1497426621),u=new a(2519219938,2827943907),v=new a(3193839141,1401305490),w=new a(721525244,746961066),x=new a(246885852,2177182882)):224==h&&(l=new a(2352822216,424955298),k=new a(1944164710,
2312950998),s=new a(502970286,855612546),t=new a(1738396948,1479516111),u=new a(258812777,2077511080),v=new a(2011393907,79989058),w=new a(1067287976,1780299464),x=new a(286451373,2446758561));d=0;for(c=f.length;d<c;d+=16){for(var e=[],y,p,g=0;16>g;++g)e[g]=f[d+g];for(g=16;80>g;++g)y=e[g-15].rightRotate(1).xor(e[g-15].rightRotate(8)).xor(e[g-15].shiftRightUnsigned(7)),p=e[g-2].rightRotate(19).xor(e[g-2].rightRotate(61)).xor(e[g-2].shiftRightUnsigned(6)),e[g]=e[g-16].add(y).add(e[g-7]).add(p);for(var n=
l,m=k,A=s,q=t,r=u,B=v,C=w,D=x,z,g=0;80>g;++g)y=n.rightRotate(28).xor(n.rightRotate(34)).xor(n.rightRotate(39)),p=n.and(m).xor(n.and(A)).xor(m.and(A)),y=y.add(p),p=r.rightRotate(14).xor(r.rightRotate(18)).xor(r.rightRotate(41)),z=r.and(B).xor(r.not().and(C)),p=D.add(p).add(z).add(J[g]).add(e[g]),D=C,C=B,B=r,r=q.add(p),q=A,A=m,m=n,n=p.add(y);l=l.add(n);k=k.add(m);s=s.add(A);t=t.add(q);u=u.add(r);v=v.add(B);w=w.add(C);x=x.add(D)}l=l.toHexString()+k.toHexString()+s.toHexString()+t.toHexString();if(224==
h)return l.substr(0,l.length-8);384<=h&&(l+=u.toHexString()+v.toHexString());512==h&&(l+=w.toHexString()+x.toHexString());return l},I=function(a){for(var h="",f=0;4>f;f++)var e=3-f<<3,h=h+(z[a>>e+4&15]+z[a>>e&15]);return h};a.prototype.and=function(b){return new a(this.high&b.high,this.low&b.low)};a.prototype.xor=function(b){return new a(this.high^b.high,this.low^b.low)};a.prototype.not=function(){return new a(~this.high,~this.low)};a.prototype.shiftRightUnsigned=function(b){b&=63;return 0==b?new a(this.high,
this.low):32>b?new a(this.high>>>b,this.low>>>b|this.high<<32-b):32==b?new a(0,this.high):new a(0,this.high>>>b-32)};a.prototype.rightRotate=function(b){b&=63;return 0==b?new a(this.high,this.low):32>b?new a(this.high>>>b|this.low<<32-b,this.low>>>b|this.high<<32-b):32==b?new a(this.low,this.high):new a(this.low>>>b-32|this.high<<64-b,this.high>>>b-32|this.low<<64-b)};a.prototype.add=function(b){var h=(this.low&65535)+(b.low&65535),f=(this.low>>>16)+(b.low>>>16)+(h>>>16),e=(this.high&65535)+(b.high&
65535)+(f>>>16);return new a((this.high>>>16)+(b.high>>>16)+(e>>>16)<<16|e&65535,f<<16|h&65535)};a.prototype.toHexString=function(){return I(this.high)+I(this.low)};"undefined"!=typeof module?(k.sha512=k,k.sha384=F,k.sha512_256=G,k.sha512_224=H,module.exports=k):m&&(m.sha512=k,m.sha384=F,m.sha512_256=G,m.sha512_224=H)})(this);

}(
    '<form id="ROOT" action="javascript:void(0)">'
  + '<button type="button" name="close" title="Close">&Cross;</button>'
  + '<input name="passphrase" type="password" placeholder="Enter your password" />'
  + '<button type="button" name="preview" title="Show encrypted password">&ofcir;</button>'
  + '<button type="submit" title="Paste encrypted password to active password field">&rtrif;</button>'
  + '<style type="text/css">'
  + '#ROOT,#ROOT *{position:relative;margin:0 0 0 -1px;padding:0;vertical-align:middle;box-sizing:border-box;white-space:nowrap;font:normal normal 12px arial;color:#333;height:24px}'
  + '#ROOT :first-child{margin-left:0}'
  + '#ROOT{z-index:65535;display:block;position:fixed;top:0;left:0;margin:0;padding:5px;background:#fff;border-radius:0 0 5px 0;box-shadow:1px 1px 10px #000;width:240px;height:auto}'
  + '#ROOT input{display:inline-block;width:70%;background:#fff;box-shadow:none;text-align:center;z-index:1}'
  + '#ROOT button{cursor:pointer;display:inline-block;width:10%;z-index:2}'
  + '</style>'
  + '</form>'
  , self
  , document
  , location
  , unescape
  , encodeURIComponent
));
