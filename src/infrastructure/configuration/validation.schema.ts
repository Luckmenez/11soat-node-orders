import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  PRODUCTS_SERVICE_URL: Joi.string().required(),
  DATABASE_URL: Joi.string().when('NODE_ENV', {
    is: Joi.valid('staging', 'production'),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  PRODUCTS_SERVICE_TIMEOUT: Joi.number().default(5000),
});
