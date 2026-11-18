import { Task } from '@/db/models';
import { getAuthUser } from '@/lib/auth';
import { errorHandler } from '@/lib/errorHandler';
import { validateBody } from '@/lib/validateBody';
import { ALLOWED_STATUSES, TaskStatus } from '@/utils/constants';
import { createTaskSchema } from '@/validation/taskSchemas';
import createError from 'http-errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');

    const whereClause: { userId: number; status?: TaskStatus } = {
      userId: user.userId,
    };

    if (statusParam) {
      if (!ALLOWED_STATUSES.includes(statusParam as TaskStatus)) {
        throw createError(400, 'Invalid status filter');
      }
      whereClause.status = statusParam as TaskStatus;
    }

    const tasks = await Task.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    const body = await req.json();
    const validData = await validateBody(createTaskSchema, body);

    const newTask = await Task.create({
      ...validData,
      userId: user.userId,
    });

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
}
