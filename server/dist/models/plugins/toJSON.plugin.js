"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = void 0;
const toJSON = (data) => {
    const result = { ...data };
    // Remove private fields, if marked (e.g., define a private fields array)
    const privateFields = ['password']; // Add other private fields here
    privateFields.forEach((field) => delete result[field]);
    //   // Map `_id` to `id` (Prisma uses `id` directly, so this is for reference)
    //   if (result._id) {
    //     result.id = result._id.toString();
    //     delete result._id;
    //   }
    // Remove metadata fields if present
    delete result.__v;
    delete result.createdAt;
    delete result.updatedAt;
    return result;
};
exports.toJSON = toJSON;
