import { HotspotType } from '../../application/domain/hotspot/Hotspot';
import * as validation from './constant';
// tslint:disable:object-literal-key-quotes
// tslint:disable:quotemark
// tslint:disable:trailing-comma

export default () => {
    return {
        title: 'POST /hotspots body validation',
        type: 'object',
        oneOf: [MediaHotspotSchema, AlertHotspotSchema],
    };
};

export { requiredMediaHotspotProperties, requiredAlertHotspotProperties };

const hotspotSchema = {
    required: ['cityId', 'position', 'type', 'address'],
    properties: {
        address: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
                city: {
                    type: 'string',
                },
            },
            required: ['name', 'city'],
        },
        cityId: {
            type: 'string',
        },
        position: {
            type: 'object',
            properties: {
                latitude: {
                    type: 'number',
                },
                longitude: {
                    type: 'number',
                },
            },
            required: ['latitude', 'longitude'],
        },
        avatarIconUrl: {
            type: 'string',
            maxLength: validation.ASSETS_URL_MAX_LENGTH,
        },
    },
};

const requiredMediaHotspotProperties = [...hotspotSchema.required, 'title', 'scope'];

const MediaHotspotSchema = {
    required: requiredMediaHotspotProperties,
    properties: {
        ...hotspotSchema.properties,
        scope: {
            type: 'string',
            enum: ['public', 'private'],
        },
        title: {
            type: 'string',
            maxLength: validation.TITLE_MAX_LENGTH,
        },
        type: {
            type: 'string',
            enum: [HotspotType.Media],
        },
    },
    additionalProperties: false,
};

const requiredAlertHotspotProperties = [...hotspotSchema.required, 'message'];

const AlertHotspotSchema = {
    required: requiredAlertHotspotProperties,
    properties: {
        ...hotspotSchema.properties,
        message: {
            type: 'string',
            maxLength: validation.ALERT_MESSAGE_MAX_LENGTH,
        },
        type: {
            type: 'string',
            enum: [HotspotType.Alert],
        },
        pictureDescription: {
            type: 'string',
            maxLength: validation.ASSETS_URL_MAX_LENGTH,
        },
    },
    additionalProperties: false,
};
