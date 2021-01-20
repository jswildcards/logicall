const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        SERVER_HOST: "localhost:3000",
      },
    };
  }

  return {
    env: {
      SERVER_HOST: "localhost",
    },
  };
};
