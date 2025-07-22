import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/db'
import Task from '@/models/Task'
import { authOptions } from '@/lib/auth'
import { taskSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const tasks = await Task.find({ userId: session.user.email }).sort({ createdAt: -1 })
    
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = taskSchema.parse(body)

    await dbConnect()

    const task = new Task({
      ...validatedData,
      userId: session.user.email,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
    })

    const savedTask = await task.save()
    
    return NextResponse.json(savedTask, { status: 201 })
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
