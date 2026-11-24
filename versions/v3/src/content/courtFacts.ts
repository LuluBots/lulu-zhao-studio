export const courtFacts = [
  {end: -1, x: -4.1, title: 'Home-court advantage', text: 'I live next to the tennis courts. If I show up late, I definitely can’t blame the commute.'},
  {end: -1, x: 4.1, title: 'Open invitation', text: 'Want to hit sometime? “Research meeting with rackets” looks perfectly respectable on a calendar.'},
  {end: 1, x: -4.1, title: 'Off the court', text: 'Tennis gets its own website. My other sports would like a word.'},
  {end: 1, x: 4.1, title: 'The GOAT debate', text: 'As a researcher, I welcome competing hypotheses. As a Djokovic fan, I’ve already made up my mind.'},
] as const;
export type CourtFact = typeof courtFacts[number];
