import * as validation from './constant';
import { HotspotType, HotspotIconType } from './../../domain/cityLife/model/hotspot/Hotspot';
// tslint:disable:object-literal-key-quotes
// tslint:disable:quotemark
// tslint:disable:trailing-comma

export { requiredMediaHotspotProperties, requiredAlertHotspotProperties };

const hotspotSchema = {
    required: [
        'id',
        'cityId',
        'position',
        'type',
        'iconType',
        'views',
        'address',
        'createdAt',
        'avatarIconUrl',
    ],
    properties: {
        id: {
            type: 'string',
        },
        cityId: {
            type: 'string',
        },
        createdAt: {
            type: 'string',
        },
        author: {
            type: 'object',
            properties: {
                pseudo: {
                    type: 'string',
                },
                id: {
                    type: 'string',
                },
            },
            required: ['pseudo', 'id'],
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
        views: {
            type: 'number',
        },
        avatarIconUrl: {
            type: 'string',
            maxLength: validation.ASSETS_URL_MAX_LENGTH,
        },
    },
};
const requiredMediaHotspotProperties = [
    ...hotspotSchema.required,
    'title',
    'scope',
    'slug',
    'members',
    'slideShow',
];

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
        slug: {
            type: 'string',
        },
        dateEnd: {
            type: 'string',
        },
        type: {
            type: 'string',
            enum: [HotspotType.Media],
        },
        iconType: {
            type: 'string',
            enum: [HotspotIconType.Event, HotspotIconType.Wall],
        },
        members: {
            type: 'array',
            items: {
                type: 'string',
            },
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

const requiredAlertHotspotProperties = [
    ...hotspotSchema.required,
    'message',
    'voterList',
    'pertinence',
];

const AlertHotspotSchema = {
    required: requiredAlertHotspotProperties,
    properties: {
        ...hotspotSchema.properties,
        message: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    maxLength: validation.ALERT_MESSAGE_MAX_LENGTH,
                },
                updatedAt: {
                    type: 'string',
                },
            },
            required: ['content'],
        },
        type: {
            type: 'string',
            enum: [HotspotType.Alert],
        },
        imageDescriptionLocation: {
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
        voterList: {
            type: 'array',
            items: {
                type: 'array',
                items: [
                    {
                        type: 'string',
                    },
                    {
                        type: 'boolean',
                    },
                ],
            },
        },
        pertinence: {
            type: 'object',
            properties: {
                agree: {
                    type: 'number',
                },
                disagree: {
                    type: 'number',
                },
            },
            required: ['agree', 'disagree'],
        },
    },
    additionalProperties: false,
};

export const alertHotspotSchema = {
    ...AlertHotspotSchema,
    type: 'object',
};

export const mediaHotspotSchema = {
    ...MediaHotspotSchema,
    type: 'object',
};
