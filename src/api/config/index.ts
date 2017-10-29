const httpPort = parseInt(process.env.HTTP_PORT, 10);

export default {
    server: {
        httpPort,
    },
};
