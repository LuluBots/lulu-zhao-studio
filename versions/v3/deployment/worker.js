export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/api/visit'){
  if(request.method!=='POST')return new Response(null,{status:405});
  if(request.headers.get('Origin')!==url.origin)return new Response(null,{status:403});
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return new Response(null,{status:415});
  const raw=await request.text();if(raw.length>150)return new Response(null,{status:413});
  let visitor;try{visitor=JSON.parse(raw).visitor}catch{return new Response(null,{status:400})}
  if(typeof visitor!=='string'||! /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(visitor))return new Response(null,{status:400});
  const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(visitor));
  const id=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
  const day=new Date().toISOString().slice(0,10);
  const key=`day:${day}:${id}`;
  if(!await env.VISITORS.get(key)){
   const writes=[env.VISITORS.put(key,'1',{expirationTtl:34560000})];
   if(!await env.VISITORS.get(`visitor:${id}`))writes.push(env.VISITORS.put(`visitor:${id}`,day));
   await Promise.all(writes);
  }
  return new Response(null,{status:204,headers:{'Cache-Control':'no-store'}});
 }

 if(url.pathname==='/versions/v0'||url.pathname==='/versions/v0/')return Response.redirect('https://v0.luluzhao.me/',302);
 if(/^\/(research|publications|about|blog|photography)(\/|$)/.test(url.pathname))return Response.redirect('https://v1.luluzhao.me'+url.pathname+url.search,302);
 if(url.pathname==='/versions/v1'||url.pathname==='/versions/v1/')return Response.redirect('https://v1.luluzhao.me/',302);
 if(url.pathname==='/versions/v2'||url.pathname==='/versions/v2/')return Response.redirect('https://v2.luluzhao.me/',302);
 if(url.pathname==='/versions/v3'||url.pathname==='/versions/v3/')return Response.redirect('https://luluzhao.me/',302);
 const response=await env.ASSETS.fetch(new Request(url,request));const headers=new Headers(response.headers);
 headers.set('X-Content-Type-Options','nosniff');headers.set('Referrer-Policy','strict-origin-when-cross-origin');headers.set('Strict-Transport-Security','max-age=31536000; includeSubDomains');
 return new Response(response.body,{status:response.status,headers});
}};
