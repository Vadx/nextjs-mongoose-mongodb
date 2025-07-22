import { Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface ITask extends Document {
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskRequest {
  title: string
  description?: string
  status?: 'pending' | 'in-progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
}

// export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}