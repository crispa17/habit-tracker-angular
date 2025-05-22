export interface Habit {
  id: string;
  title: string;
  description?: string;
  completedDays: string[]; // ISO date strings
  createdAt: string;
  monthlyGoal?: number;
}
