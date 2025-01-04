import { PrismaClient } from '@prisma/client';
import { config } from './config/config';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.prisma.databaseUrl, 
    },
  },
});

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string; // e.g., 'field:asc,field2:desc'
}

interface PaginatedResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export const paginate = async <T>(
  model: keyof PrismaClient,
  filter: Record<string, any> = {},
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> => {
  const { page = 1, limit = 10, sortBy = 'createdAt:asc' } = options;

  // Parse sorting options
  const sortCriteria = sortBy.split(',').map((sortOption) => {
    const [field, order] = sortOption.split(':');
    return { [field]: order === 'desc' ? 'desc' : 'asc' };
  });

  const skip = (page - 1) * limit;

  // @ts-ignore
  const totalResults = await prisma[model].count({ where: filter });
  // @ts-ignore
  const results = await prisma[model].findMany({
    where: filter,
    take: limit,
    skip,
    orderBy: sortCriteria,
  });

  const totalPages = Math.ceil(totalResults / limit);

  return {
    results,
    page,
    limit,
    totalPages,
    totalResults,
  };
};
