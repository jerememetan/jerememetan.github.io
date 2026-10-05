const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync,readFileSync } = require('node:fs');
const path = require('node:path');
const source = path.join(__dirname, '..', 'sky.js');
const sky = existsSync(source) ? require(source) : {};

test('sky follows every local-time boundary', () => {
  assert.equal(typeof sky.modeForHour,'function','sky module not implemented');
  for(const [hour,mode] of [[0,'night'],[4.99,'night'],[5,'dawn'],[9.99,'dawn'],[10,'day'],[16.99,'day'],[17,'sunset'],[19.99,'sunset'],[20,'night'],[23.99,'night']]) assert.equal(sky.modeForHour(hour),mode);
});
test('framing preserves celestial focal points on narrow and wide screens', () => {
  assert.equal(typeof sky.placement,'function','sky framing not implemented');
  for(const width of [114,138,480,640,960])for(const mode of ['dawn','day','sunset','night']){
    const p=sky.placement(width,300,1672,310,mode);
    const focal=mode==='dawn'||mode==='sunset'?.08:mode==='day'?.92:.91;
    assert.ok(p.x+p.width*focal>0&&p.x+p.width*focal<width);
    assert.ok(p.x<=0&&p.x+p.width>=width);
    assert.ok(p.height>=300);
  }
});
// Canvas is a browser API; record paint calls to test the real renderer in Node.
function surface(){
  const paints=[];
  const context={createLinearGradient:()=>({addColorStop(){}})};
  for(const name of ['clearRect','fillRect','drawImage','save','restore','translate','scale']) context[name]=(...args)=>paints.push({name,args});
  const canvas={clientWidth:1280,clientHeight:800,width:0,height:0,dataset:{},getContext:()=>context};
  return {canvas,paints};
}
function renderer(image={complete:true,naturalWidth:1672}){
  assert.equal(typeof sky.create,'function','sky renderer not implemented');
  const s=surface();return {...s,renderer:sky.create(s.canvas,{image})};
}
test('renderer selects only its requested artwork panel', () => {
  for(const [hour,y]of [[6,0],[12,315],[18,0],[22,631]]){
    const s=renderer();s.renderer.draw(0,hour);
    const draw=s.paints.find(p=>p.name==='drawImage');
    assert.equal(draw.args[2],y);assert.equal(s.canvas.dataset.mode,sky.modeForHour(hour));
  }
});
test('paused frames are reused; motion and local-time changes repaint', () => {
  const s=renderer();s.renderer.draw(0,12);const initial=s.paints.length;
  s.renderer.draw(0,12);assert.equal(s.paints.length,initial);
  s.renderer.draw(.05,12);assert.ok(s.paints.length>initial);
  const moving=s.paints.length;s.renderer.draw(.06,12);assert.equal(s.paints.length,moving);
  s.renderer.draw(.06,22);assert.ok(s.paints.length>moving);assert.equal(s.canvas.dataset.mode,'night');
});
test('failed image still paints a fallback and resize invalidates cache', () => {
  const s=renderer({complete:true,naturalWidth:0});s.renderer.draw(0,12);
  assert.ok(s.paints.some(p=>p.name==='fillRect'));assert.ok(!s.paints.some(p=>p.name==='drawImage'));
  const count=s.paints.length;s.canvas.clientWidth=390;s.renderer.draw(0,12);
  assert.ok(s.paints.length>count);assert.equal(s.canvas.width,146);
});
test('image load replaces fallback even when ambience is paused', () => {
  const image={complete:false,naturalWidth:0};const s=renderer(image);s.renderer.draw(0,12);
  image.complete=true;image.naturalWidth=1672;s.renderer.draw(0,12);
  assert.ok(s.paints.some(p=>p.name==='drawImage'));
});
test('sky is decorative, loaded before the room and shares ambience control', () => {
  const root=path.join(__dirname,'..');
  const html=readFileSync(path.join(root,'index.html'),'utf8');
  const room=readFileSync(path.join(root,'room.js'),'utf8');
  assert.match(html,/<canvas id="sky" aria-hidden="true"><\/canvas>/);
  assert.ok(html.indexOf('src="sky.js')<html.indexOf('src="room.js'));
  assert.match(room,/sky\.draw\(clock \/ 1000\)/);
  assert.doesNotMatch(room,/rect\(0, 0, view.width, view.height, "#263a45"\)/);
  assert.match(room,/reduced\.addEventListener\("change"/);
});
