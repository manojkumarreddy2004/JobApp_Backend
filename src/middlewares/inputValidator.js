
//Validates the data recieved from the http body middleware
export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      details: error.details.map((d) => d.message),
    });
  }
  next();
};

//Validates the data recieved from the http Path Parameters middleware
export const validatePathParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};
//Validates the data recieved from the http Query Parameters middleware
export const validateQueryParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};
