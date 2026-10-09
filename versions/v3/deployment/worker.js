export default {async fetch(request,env){
 const url=new URL(request.url);
 if(/^\/(research|publications|about|blog|photography)(\/|$)/.test(url.pathname))return Response.redirect('https://v1.luluzhao.me'+url.pathname+url.search,302);
 if(url.pathname==='/versions/v1'||url.pathname==='/versions/v1/')return Response.redirect('https://v1.luluzhao.me/',302);
 if(url.pathname==='/versions/v2'||url.pathname==='/versions/v2/')return Response.redirect('https://v2.luluzhao.me/',302);
 if(url.pathname==='/versions/v3'||url.pathname==='/versions/v3/')return Response.redirect('https://luluzhao.me/',302);
 const response=await env.ASSETS.fetch(new Request(url,request));const headers=new Headers(response.headers);
 headers.set('X-Content-Type-Options','nosniff');headers.set('Referrer-Policy','strict-origin-when-cross-origin');headers.set('Strict-Transport-Security','max-age=31536000; includeSubDomains');
 return new Response(response.body,{status:response.status,headers});
}};
