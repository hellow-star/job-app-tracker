export function notFound(req, res) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(err, req, res, next) {
  console.error("❌", err);
  const status = err.statusCode || 500;
  const message = err.expose ? err.message : (status < 500 ? err.message : "Server error");
  res.status(status).json({ error: message });
}