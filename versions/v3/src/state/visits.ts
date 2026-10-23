// Counts browser visitors without names, IP addresses, cookies or third-party scripts.
export function recordVisit(){
 if(location.hostname==='localhost'||location.hostname==='127.0.0.1')return;
 try{
  const day=new Date().toISOString().slice(0,10),key='rally-counted-day';
  if(sessionStorage.getItem(key)===day)return;
  let visitor=localStorage.getItem('rally-visitor');if(!visitor){visitor=crypto.randomUUID();localStorage.setItem('rally-visitor',visitor)}
  // Mark before requesting: React StrictMode must not submit twice.
  sessionStorage.setItem(key,day);
  void fetch('/api/visit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitor}),keepalive:true}).then(response=>{if(!response.ok)sessionStorage.removeItem(key)}).catch(()=>sessionStorage.removeItem(key));
 }catch{/* Storage restrictions never prevent entry. */}
}
