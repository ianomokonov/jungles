import { Answer } from './answer';

export interface Variant {
  id: number;
  name: string;
  answers: Answer[];
  isNull?: boolean;
}
