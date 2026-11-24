import config from "./config";

export default () => {
  process.on("uncaughtException", (err) => {
    if (config.LOGGING) console.error("Uncaught Exception:", err);

    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    if (config.LOGGING)
      console.error("Unhandled Rejection at:", promise, "reason:", reason);

    process.exit(1);
  });
};
