export interface Course {
  id: string;
  name: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  submissionLink?: string;
  completed: boolean;
  courseId?: string;
  priority?: 'low' | 'medium' | 'high';
}

export type TaskStatus = 'completed' | 'far' | 'approaching' | 'near' | 'urgent' | 'overdue';