import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { deleteSavedResult, getSavedResult } from '@/services/saved-results-service';

export const GET = async (_request: Request, { params }: { params: Promise<{ id: string }> }) =>
	Response.json(await getSavedResult((await params).id));

export const DELETE = auth(async (request, { params }) =>
	NextResponse.json(await deleteSavedResult((await params)?.id as string, request.auth?.user.id))
);
