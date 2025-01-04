"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const paginate = async (model, filter = {}, options = {}) => {
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
exports.paginate = paginate;
