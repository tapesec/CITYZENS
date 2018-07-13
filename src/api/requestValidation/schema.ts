import * as validation from './constant';
// tslint:disable:object-literal-key-quotes
// tslint:disable:quotemark
// tslint:disable:trailing-comma
export const getHotspots = {
    title: 'GET /hotspots by area',
    type: 'object',
    oneOf: [
        {
            required: ['north', 'west', 'south', 'east'],
            properties: {
                north: {
                    type: 'number',
                },
                west: {
                    type: 'number',
                },
                south: {
                    type: 'number',
                },
                east: {
                    type: 'number',
                },
            },
            additionalProperties: false,
        },
        {
            required: ['insee'],
            properties: {
                insee: {
                    type: 'string',
                },
            },
            additionalProperties: false,
        },
    ],
};

export const getHotspotId = {
    title: 'GET /hotspots/{hotspotId} by id',
    type: 'object',
    additionalProperties: false,
    properties: {},
};

export const createMessageSchema = {
    title: 'POST /hotspots/{hotspotId}/messages body validation',
    type: 'object',
    required: ['body'],
    properties: {
        title: {
            type: 'string',
            maxLength: validation.TITLE_MAX_LENGTH,
        },
        body: {
            type: 'string',
            maxLength: validation.MESSAGE_BODY_MAX_LENGTH,
        },
        pinned: {
            type: 'boolean',
        },
        parentId: {
            type: 'string',
        },
    },
};

export const patchMessageSchema = {
    title: 'POST /hotspots/{hotspotId}/messages body validation',
    type: 'object',
    anyOf: [{ required: ['title'] }, { required: ['body'] }, { required: ['pinned'] }],
    properties: {
        title: {
            type: 'string',
            maxLength: validation.TITLE_MAX_LENGTH,
        },
        body: {
            type: 'string',
            maxLength: validation.MESSAGE_BODY_MAX_LENGTH,
        },
        pinned: {
            type: 'boolean',
        },
    },
};

export const postMemberSchema = {
    title: 'POST /hotspots/{hotspotId}/members body validation',
    type: 'object',
    required: ['memberId'],
    properties: {
        memberId: {
            type: 'string',
        },
    },
};

export const postPertinenceSchema = {
    title: 'method=POST url=/hotspots/{hotspotId}/pertinence body validation',
    type: 'object',
    required: ['agree'],
    properties: {
        agree: {
            type: 'boolean',
        },
    },
    additionalProperties: false,
};

export const getMessageSchemaQuery = {
    type: 'object',
    properties: {
        count: {
            type: 'string',
            enum: ['true', 'false', ''],
        },
        messages: {
            type: 'string',
        },
    },
    dependencies: {
        count: ['messages'],
        messages: ['count'],
    },
    additionalProperties: false,
};

export const cityzensDbSchema = {
    title: "Schema of the postgre's table cityzens",
    type: 'object',
    required: ['user_id', 'email', 'password', 'is_admin', 'pseudo', 'picture_cityzen'],
    properties: {
        user_id: {
            type: 'string',
        },
        pseudo: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
        email_verified: {
            type: 'boolean',
        },
        password: {
            type: ['string', 'null'],
        },
        is_admin: {
            type: 'boolean',
        },
        picture_cityzen: {
            type: 'string',
        },
        picture_extern: {
            type: ['string', 'null'],
        },
        favorites_hotspots: {
            type: ['array', 'null'],
            items: {
                type: 'string',
            },
        },
    },
    additionalProperties: false,
};
