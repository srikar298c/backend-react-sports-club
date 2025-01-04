export const toJSON = <T extends Record<string, any>>(data: T): T => {
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
  // delete result.id;
  delete result.verificationCode;
  delete result.phone;
  delete result.phoneVerified;
  return result;
};
