const env = {
    "NODE_ENV": "development",
    "HTTP_PORT": 3000,
    "AUTH_0_URL": "https://cityzens.eu.auth0.com",
    "AUTH_0_CLIENT_ID": "d6Q0N2GkFv6UbXT46ZHxAfFIUMDtdFTT",
    "AUTH_0_CLIENT_SECRET": "jGzkCi4qh9Km-4RBj0OvSz8nJjweBwyUrnjR0F1E8jQdqeg-K9sqPACSMu97UqGw",
    "AUTH_0_AUDIENCE": "https://cityzens.eu.auth0.com/api/v2/",
    "JWT_SECRET": "oRoglHSH768FNkUNE500H5qp01xnkjJe"
};

module.exports = {
  apps : [{
    name        : "cityzen-api",
    script      : "npm",
    args: "start",
    watch       : true,
    ignore_watch: ['./build', '.git'],
    env
  }]
}

exports.env = env;
