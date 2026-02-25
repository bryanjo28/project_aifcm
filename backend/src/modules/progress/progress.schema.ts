export type IProgress = {
  id: number;
  user: number;
  lesson: number;
  completed: boolean;
  watchedSeconds?: number;
  completedAt?: Date;
};