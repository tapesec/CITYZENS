import * as validation from './constant';
// tslint:disable:object-literal-key-quotes
// tslint:disable:quotemark
// tslint:disable:trailing-comma
export default () => {
    return {
        title: 'PATCH /hotspots body validation',
        type: 'object',
        anyOf: [WallHotspotSchema, MediaHotspotSchema, AlertHotspotSchema],
    };
};

const WallHotspotSchema = {
    anyOf: [
        { required: ['title'] },
        { required: ['scope'] },
        { required: ['slideShow'] },
        { required: ['avatarIconUrl'] },
    ],
    properties: {
        scope: {
            type: 'string',
            enum: ['public', 'private'],
        },
        title: {
            type: 'string',
            maxLength: validation.TITLE_MAX_LENGTH,
        },
        avatarIconUrl: {
            type: 'string',
            maxLength: validation.ASSETS_URL_MAX_LENGTH,
        },
        slideShow: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
    additionalProperties: false,
};

const MediaHotspotSchema = {
    anyOf: [
        { required: ['title'] },
        { required: ['scope'] },
        { required: ['dateEnd'] },
        { required: ['slideShow'] },
        { required: ['avatarIconUrl'] },
    ],
    properties: {
        scope: {
            type: 'string',
            enum: ['public', 'private'],
        },
        title: {
            type: 'string',
            maxLength: validation.TITLE_MAX_LENGTH,
        },
        dateEnd: {
            type: 'string',
        },
        avatarIconUrl: {
            type: 'string',
            maxLength: validation.ASSETS_URL_MAX_LENGTH,
        },
        slideShow: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
    additionalProperties: false,
};

const AlertHotspotSchema = {
    anyOf: [{ required: ['message'] }, { required: ['alertHotspotImgLocation'] }],
    properties: {
        message: {
            type: 'string',
        },
        alertHotspotImgLocation: {
            type: 'string',
            maxLength: validation.ASSETS_URL_MAX_LENGTH,
        },
    },
    additionalProperties: false,
};
