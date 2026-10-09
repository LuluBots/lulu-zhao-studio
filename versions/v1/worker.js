export default {async fetch(request,env){
 const response=await env.ORIGINAL.fetch(request);
 if(!response.headers.get('content-type')?.includes('text/html'))return response;
 return new HTMLRewriter().on('body',{element(el){el.append('<nav aria-label="Website versions" style="position:fixed;right:16px;bottom:16px;z-index:99999;padding:10px 15px;background:#fffef6;color:#254d50;border:1px solid #b5c8bb;border-radius:24px;font:12px Arial,sans-serif;box-shadow:0 3px 16px #0002">V1 · Original &nbsp; <a style="color:inherit" href="https://luluzhao.me/versions/">Version history ↗</a></nav>',{html:true})}}).transform(response);
}};
