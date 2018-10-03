export const signinSchema = {
    title: 'POST /auth/token',
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
        },
        password: {
            type: 'string',
        },
    },
};

export const signupSchema = {
    title: 'POST /signup',
    type: 'object',
    required: ['email', 'password', 'username'],
    properties: {
        email: {
            type: 'string',
        },
        password: {
            type: 'string',
        },
        username: {
            type: 'string',
        },
    },
};
