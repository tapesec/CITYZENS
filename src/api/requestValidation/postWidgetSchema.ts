export const postSlideShow = {
    title: 'Post SlideShow.',
    type: 'object',
    required: ['images', 'type'],
    properties: {
        type: {
            type: 'number',
        },
        images: {
            type: 'array',
            items: [
                {
                    type: 'array',
                    minItems: 2,
                    items: [{ type: 'string' }, { type: 'string' }],
                    additionalItems: false,
                },
            ],
        },
    },
};

export const anyOnePostWidget = {
    title: 'AnyOnePostWidget.',
    type: 'object',
    required: ['type'],
    oneOf: [postSlideShow],
    properties: {
        type: {
            type: 'number',
        },
    },
};
