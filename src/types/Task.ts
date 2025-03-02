export interface Course {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO string format
  completed: boolean;
  courseId?: string;
  submissionLink?: string;
}

export type TaskStatus = 'completed' | 'far' | 'approaching' | 'near' | 'urgent' | 'overdue';