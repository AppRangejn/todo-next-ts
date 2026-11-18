import { Task } from '@/db/models';
import { getAuthUser } from '@/lib/auth';
import { errorHandler } from '@/lib/errorHandler';
import { validateBody } from '@/lib/validateBody';
import { updateTaskSchema } from '@/validation/taskSchemas';
import createError from 'http-errors';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const parseTaskId = (rawId: string): number => {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw createError(400, 'Invalid task ID');
  }
  return id;
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const user = getAuthUser(req);
    const { id } = await params;
    const taskId = parseTaskId(id);

    const body = await req.json();
    const validData = await validateBody(updateTaskSchema, body);

    const task = await Task.findOne({
      where: { id: taskId, userId: user.userId },
    });

    if (!task) {
      throw createError(404, 'Task not found');
    }

    await task.update(validData);

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const user = getAuthUser(req);
    const { id } = await params;
    const taskId = parseTaskId(id);

    const deletedCount = await Task.destroy({
      where: { id: taskId, userId: user.userId },
    });

    if (!deletedCount) {
      throw createError(404, 'Task not found');
    }

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
