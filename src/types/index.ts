export type Song = { id: number; title: string; dateUpload: string };
export type Reading = { id: number; book: string; chapter: string; verses: string };
export type Month = { name: string; theme: string; bgColor: string; textColor: string };
export type Day = {
  id: number;
  date: string;
  dayName: string;
  title?: string;
  songs: Song[];
  readings: Reading[];
  month: Month;
};