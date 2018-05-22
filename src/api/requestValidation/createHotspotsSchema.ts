import { HotspotIconType, HotspotType } from './../../domain/cityLife/model/hotspot/Hotspot';
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
    required: ['cityId', 'position', 'type', 'iconType', 'address', 'createdAt'],
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
        createdAt: {
            type: 'string',
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
        dateEnd: {
            type: 'string',
        },
        type: {
            type: 'string',
            enum: [HotspotType.Event, HotspotType.WallMessage],
        },
        iconType: {
            type: 'string',
            enum: [HotspotIconType.Event, HotspotIconType.Wall],
        },
        avatarIconUrl: {
            type: 'string',
            maxLength: validation.ASSETS_URL_MAX_LENGTH,
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
        alertHotspotImgLocation: {
            type: 'string',
            maxLength: validation.ASSETS_URL_MAX_LENGTH,
        },
        iconType: {
            type: 'string',
            enum: [
                HotspotIconType.Accident,
                HotspotIconType.Destruction,
                HotspotIconType.Handicap,
                HotspotIconType.RoadWorks,
            ],
        },
    },
    additionalProperties: false,
};
