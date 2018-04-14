import * as validation from './constant';
// tslint:disable:object-literal-key-quotes
// tslint:disable:quotemark
// tslint:disable:trailing-comma
export default () => {
    return {
        title: 'PATCH /hotspots body validation',
        type: 'object',
        anyOf: [WallHotspotSchema, EventHotspotSchema, AlertHotspotSchema],
    };
};

const WallHotspotSchema = {
    anyOf: [{ required: ['title'] }, { required: ['scope'] }, { required: ['avatarIconUrl'] }],
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
    },
    additionalProperties: false,
};

const EventHotspotSchema = {
    anyOf: [
        { required: ['title'] },
        { required: ['scope'] },
        { required: ['dateEnd'] },
        { required: ['description'] },
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
        description: {
            type: 'string',
        },
        avatarIconUrl: {
            type: 'string',
            maxLength: validation.ASSETS_URL_MAX_LENGTH,
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
