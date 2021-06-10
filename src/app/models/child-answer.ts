export interface ChildAnswer {
  id: number;
  isCorrect: boolean;
  isSolved: boolean;
  answerId: number;
  variantId?: number;
  tryCount: number;
}
