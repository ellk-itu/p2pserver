import config from "./config";

export default (section: string) => {
  return `http${config.SECURE && "s"}://${config.HOST}/docs/api#/${section}`;
};
