import assert from 'node:assert/strict';
if(!process.env.TEST_DEMO_PASSWORD)throw Error('Set TEST_DEMO_PASSWORD before running tests');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4000';
async function req(path,method='GET',body,token){return fetch(base+'/api'+path,{method,headers:{...(body!==undefined?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});}
let failed=0;async function test(name,fn){try{await fn();console.log('PASS',name)}catch(e){failed++;console.error('FAIL',name,e.message)}}
async function status(p,expected){const r=await p;assert.equal(r.status,expected);return r;}
await test('Health',async()=>{assert.equal((await (await status(req('/health'),200)).json()).ok,true)});
await test('Unauthenticated dashboard blocked',()=>status(req('/dashboard'),401));
await test('Invalid token blocked',()=>status(req('/dashboard','GET',undefined,'invalid'),401));
await test('Invalid login input blocked',()=>status(req('/login','POST',{email:{},password:'x'}),400));
await test('Wrong password blocked',()=>status(req('/login','POST',{email:'admin@demo.test',password:'incorrect'}),401));
for(const role of ['admin','doctor','receptionist']){await test(role+' permissions',async()=>{const r=await status(req('/login','POST',{email:role+'@demo.test',password:process.env.TEST_DEMO_PASSWORD}),200);const {token,role:actual}=await r.json();assert.equal(actual,role);await status(req('/dashboard','GET',undefined,token),200);await status(req('/queue','GET',undefined,token),200);await status(req('/prescriptions','GET',undefined,token),role==='receptionist'?403:200);if(role!=='admin')await status(req('/doctors','POST',{},token),403);if(role!=='doctor')await status(req('/prescriptions','POST',{},token),403);});}
console.log(failed?`${failed} test groups failed`:'All test groups passed');process.exitCode=failed?1:0;
