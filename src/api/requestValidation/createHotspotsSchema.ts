import * as validation from './constant';
import { HotspotType, HotspotIconType } from './../../domain/cityLife/model/hotspot/Hotspot';
// tslint:disable:object-literal-key-quotes
// tslint:disable:quotemark
// tslint:disable:trailing-comma

export default () => {
    return {
        title: 'POST /hotspots body validation',
        type: 'object',
        oneOf: [WallHotspotSchema, EventHotspotSchema, AlertHotspotSchema],
    };
};

export {
    requiredWallHotspotProperties,
    requiredEventHotspotProperties,
    requiredAlertHotspotProperties,
};

const hotspotSchema = {
    required: ['cityId', 'position', 'type', 'iconType'],
    properties: {
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
    },
};

const requiredWallHotspotProperties = [...hotspotSchema.required, 'title', 'scope'];

const WallHotspotSchema = {
    required: requiredWallHotspotProperties,
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
            enum: [HotspotType.WallMessage],
        },
        iconType: {
            type: 'string',
            enum: [HotspotIconType.Wall],
        },
    },
    additionalProperties: false,
};

const requiredEventHotspotProperties = [
    ...hotspotSchema.required,
    'title',
    'scope',
    'dateEnd',
    'description',
];

const EventHotspotSchema = {
    required: requiredEventHotspotProperties,
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
        description: {
            type: 'string',
        },
        dateEnd: {
            type: 'string',
        },
        type: {
            type: 'string',
            enum: [HotspotType.Event],
        },
        iconType: {
            type: 'string',
            enum: [HotspotIconType.Event],
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
