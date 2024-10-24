import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { deleteSavedResult, getSavedResult } from '@/services/saved-results-service';

export const GET = async (_request: Request, { params }: { params: { id: string } }) =>
	Response.json(await getSavedResult(params.id));

export const DELETE = auth(async (request, { params }) =>
	NextResponse.json(await deleteSavedResult(params?.id as string, request.auth?.user.id))
);
