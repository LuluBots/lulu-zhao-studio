export const radioTracks=['/audio/court-bossa.mp3','/audio/court-riley.mp3','/audio/court-wallpaper.mp3'];
/** Uniform choice among all tracks except the current one. */
export function nextRadioTrack(current:number,count:number,random=Math.random){
 if(count<1)return -1;if(count===1)return 0;
 if(current<0||current>=count)return Math.min(count-1,Math.floor(random()*count));
 const choice=Math.min(count-2,Math.floor(random()*(count-1)));
 return choice>=current?choice+1:choice;
}
