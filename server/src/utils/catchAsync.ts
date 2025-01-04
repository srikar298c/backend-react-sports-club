import { Request, Response, NextFunction } from 'express';



const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error) => {
      // Pass the error to the next middleware (error handler)
      next(error);
    });
  };
};

export default catchAsync;
