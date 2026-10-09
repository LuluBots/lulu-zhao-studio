import { useLayoutEffect, type RefObject } from 'react';
import type { ScreenAnchor } from '../scene/SkyVisitors';
export function useAnchoredDialog(ref:RefObject<HTMLDialogElement|null>,open:boolean,anchor?:ScreenAnchor|null){
 useLayoutEffect(()=>{
  const node=ref.current;if(!node||!open)return;
  const place=()=>{const width=node.offsetWidth,height=node.offsetHeight,margin=16;const a=anchor??{x:innerWidth*.5,y:innerHeight*.42};
   const left=Math.max(margin,Math.min(innerWidth-width-margin,a.x+18));
   const top=Math.max(margin,Math.min(innerHeight-height-margin,a.y-height*.35));
   node.style.inset=`${top}px auto auto ${left}px`;node.style.margin='0';node.style.setProperty('--entry-origin-x',`${a.x-left}px`);node.style.setProperty('--entry-origin-y',`${a.y-top}px`);
  };const frame=requestAnimationFrame(place);window.addEventListener('resize',place);const observer=new ResizeObserver(place);observer.observe(node);
  return ()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',place);observer.disconnect()};
 },[ref,open,anchor]);
}
