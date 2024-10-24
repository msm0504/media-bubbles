import { getSourceLists } from '@/services/source-list-service';

export const GET = async () => Response.json(await getSourceLists());
