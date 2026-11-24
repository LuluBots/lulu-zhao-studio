import type { MouseEvent } from 'react';

export function dismissOnBackdrop(event:MouseEvent<HTMLDialogElement>, dismiss:()=>void) {
  event.stopPropagation();
  if (event.target !== event.currentTarget) return;
  const {left,right,top,bottom}=event.currentTarget.getBoundingClientRect();
  if (event.clientX<left || event.clientX>right || event.clientY<top || event.clientY>bottom) dismiss();
}
