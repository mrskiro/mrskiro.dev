// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const createJiti = require("jiti");
const jiti = createJiti(__filename);
const { env } = jiti("./src/env");

const URL = env.SITE_URL;

if (!URL) {
  throw new Error("not exist site url");
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: URL,
  generateRobotsTxt: true,
};
