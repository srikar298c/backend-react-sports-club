import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

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

      // Attach validated data to a custom property
      (req as any).validated = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors, // Provide details about what failed
        });
      } else {
        next(error); // Pass non-validation errors to the error handler
      }
    }
  };
