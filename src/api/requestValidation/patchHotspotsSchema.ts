import * as validation from './constant';
// tslint:disable:object-literal-key-quotes
// tslint:disable:quotemark
// tslint:disable:trailing-comma
export default () => {
    return {
        title: 'PATCH /hotspots body validation',
        type: 'object',
        anyOf: [patchMediaHotspotSchema, patchAlertHotspotSchema],
    };
};

export const patchMediaHotspotSchema = {
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

export const patchAlertHotspotSchema = {
    anyOf: [{ required: ['message'] }, { required: ['pictureDescription'] }],
    properties: {
        message: {
            type: 'string',
        },
        pictureDescription: {
            type: 'string',
            maxLength: validation.ASSETS_URL_MAX_LENGTH,
        },
    },
    additionalProperties: false,
};
