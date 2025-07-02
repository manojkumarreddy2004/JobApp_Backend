import Joi from "joi";

// CREATE JOB SCHEMA
export const createOrUpdateJobSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  location: Joi.string().min(3).max(100).required(),
});


// JOB ID PARAM Schema
export const jobIdParamSchema = Joi.object({
  jobId: Joi.number().integer().required()
});

//Location Query param Schema
export const locationQuerySchema = Joi.object({
  location: Joi.string().min(2).max(100).required()
});

//Job Application Dat Schema
export const jobApplicationSchema = Joi.object({
  resume_url: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "Resume URL is required",
      "string.uri": "Resume URL must be a valid URI",
    }),
  current_location: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Current location is required",
      "string.min": "Location must be at least 2 characters long",
      "string.max": "Location must be under 100 characters",
    }),
});

