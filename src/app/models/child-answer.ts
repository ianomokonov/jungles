export interface ChildAnswer {
  id: number;
  isCorrect: boolean;
  answerId: number;
  variantId?: number;
  tryCount: number;
}
