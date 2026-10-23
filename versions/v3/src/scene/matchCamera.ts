import { OrthographicCamera } from 'three';
/** Parallel projection in both modes: orbit remains free, opposite court edges
 * never converge as the visitor changes the viewing distance or aspect ratio. */
export function createMatchCamera(){return new OrthographicCamera(-1,1,1,-1,.1,180)}
export function frameMatchCamera(camera:OrthographicCamera,width:number,height:number){
 camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;
 camera.zoom=Math.min(width/28,height/27);camera.updateProjectionMatrix();
}
