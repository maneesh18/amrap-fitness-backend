import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function validateDTO(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error: ValidationError) => ({
        property: error.property,
        constraints: error.constraints,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: formattedErrors,
      });
    }

    req.body = dto;
    next();
  };
}

