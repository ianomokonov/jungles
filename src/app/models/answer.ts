export interface Answer {
  id: number;
  name: string;
  image?: string;
  isCorrect?: boolean;
  isIncorrect?: boolean;

  isNull?: boolean;
}
