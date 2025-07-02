import Joi from 'joi';

export const registerUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('job_seeker', 'job_poster').required()
  });
  
  export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });