export const slideShow = {
    title: 'SlideShow schema.',
    type: 'object',
    required: ['type', 'images'],
    propreties: {
        type: {
            type: 'number',
        },
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

export const widget = {
    title: 'Widget base schema.',
    type: 'object',
    required: ['type'],
    oneOf: [slideShow],
    propreties: {
        type: {
            type: 'number',
        },
    },
};

export const widgetsResponse = {
    title: 'response from GET /hotspots/${hotspotId}/wdigets/${type}.',
    type: 'array',
    items: {
        ...widget,
    },
};
