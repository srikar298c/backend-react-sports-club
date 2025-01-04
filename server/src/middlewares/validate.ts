import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: any) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Parse and validate request
      const validated = schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      // Transform numericId to number if present in params
      if (validated.params?.userId) {
        validated.params.userId = parseInt(validated.params.userId, 10);
      }

      // Attach validated data to request
      req.params = validated.params || req.params;
      req.query = validated.query || req.query;
      req.body = validated.body || req.body;

      next();
    } catch (error) {
      next(error); // Pass validation errors to the error handler
    }
  };
