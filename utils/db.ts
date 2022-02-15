const { Deta } = require("deta"); // import Deta

export const getDB = () => {
  const deta = Deta(process.env.DETA_PROJECT_KEY);
  return deta.Base(process.env.DETA_DB_NAME);
};
