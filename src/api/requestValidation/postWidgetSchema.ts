export const postSlideShow = {
    title: 'Post SlideShow.',
    type: 'object',
    required: ['images'],
    properties: {
        images: {
            type: 'array',
            items: [
                {
                    type: 'array',
                    items: [{ type: 'string' }, { type: 'string' }],
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
