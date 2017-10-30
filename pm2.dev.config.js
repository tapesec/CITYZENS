const env = {
    "NODE_ENV": "development",
    "HTTP_PORT": 3000
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
