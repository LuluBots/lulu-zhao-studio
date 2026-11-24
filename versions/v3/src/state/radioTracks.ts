export const radioTracks = [
  { src: '/audio/bach.mp3', title: 'Prelude in C major, BWV 846', composer: 'J. S. Bach' },
  { src: '/audio/beethoven.mp3', title: 'Für Elise, WoO 59', composer: 'Ludwig van Beethoven' },
  { src: '/audio/pachelbel.mp3', title: 'Canon in D', composer: 'Johann Pachelbel' },
];
/** Uniform choice among all tracks except the current one. */
export function nextRadioTrack(current:number,count:number,random=Math.random){
 if(count<1)return -1;if(count===1)return 0;
 if(current<0||current>=count)return Math.min(count-1,Math.floor(random()*count));
 const choice=Math.min(count-2,Math.floor(random()*(count-1)));
 return choice>=current?choice+1:choice;
}
