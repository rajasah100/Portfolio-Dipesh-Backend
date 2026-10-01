import multer from "multer";

export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large. The limit is 5 MB."
        : err.code === "LIMIT_UNEXPECTED_FILE"
        ? `Too many files, or unexpected field "${err.field}".`
        : err.message;
    return res.status(400).json({ message });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Some fields need fixing.",
      fields: Object.fromEntries(
        Object.entries(err.errors).map(([key, value]) => [key, value.message])
      ),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid value for ${err.path}.` });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "That record already exists." });
  }

  // Cloudinary upload errors arrive as { http_code, message }.
  if (err.http_code) {
    const message =
      err.http_code === 403
        ? "Cloudinary: this API key has no upload permission. Create a new key with full access in the Cloudinary console and put it in backend/.env."
        : err.http_code === 401
        ? "Cloudinary: API key or secret in backend/.env is wrong."
        : `Cloudinary: ${err.message}`;
    return res.status(502).json({ message });
  }

  const status =
    err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(status).json({
    message: err.message || "Something went wrong on the server.",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
