export const radioTracks = [
  { src: '/audio/bach.mp3', title: 'Prelude in C major, BWV 846', composer: 'J. S. Bach' },
  { src: '/audio/beethoven.mp3', title: 'Für Elise, WoO 59', composer: 'Ludwig van Beethoven' },
  { src: '/audio/pachelbel.mp3', title: 'Canon in D', composer: 'Johann Pachelbel' },
  { src: '/audio/mozart.mp3', title: 'Ah, vous dirai-je, maman, K. 265 (theme)', composer: 'Wolfgang Amadeus Mozart' },
  { src: '/audio/grieg.mp3', title: 'In the Hall of the Mountain King', composer: 'Edvard Grieg' },
  { src: '/audio/brahms.mp3', title: 'Wiegenlied, Op. 49, No. 4', composer: 'Johannes Brahms' },
  { src: '/audio/ode-to-joy.mp3', title: 'Ode to Joy (Symphony No. 9)', composer: 'Ludwig van Beethoven' },
  { src: '/audio/dvorak.mp3', title: 'Largo (Symphony No. 9, From the New World)', composer: 'Antonín Dvořák' },
];

export function nextRadioTrack(current: number, count: number) {
  if (count < 1) return -1;
  if (current < 0 || current >= count) return 0;
  return (current + 1) % count;
}
