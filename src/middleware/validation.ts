import type { Request, Response, NextFunction } from "express";
import  { z, ZodError } from "zod";

// Validate request body
export const validateBody = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validateData = schema.parse(req.body)

            req.body = validateData

            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                error: 'Validation failed',
                details: error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
                })
            }
            next(error) // Unexpected error, pass to error handler
        }
    }
}

// Validate URL parameters
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid parameters',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(error)
    }
  }
}

// Validate query parameters
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(error)
    }
  }
}