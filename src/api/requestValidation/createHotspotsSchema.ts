import * as validation from './constant';
import { HotspotType, HotspotIconType } from './../../domain/cityLife/model/hotspot/Hotspot';
// tslint:disable:object-literal-key-quotes
// tslint:disable:quotemark
// tslint:disable:trailing-comma

export default () => {
    return {
        "title": "POST /hotspots body validation",
        "type": "object",
        "anyOf": [
            WallHotspotSchema,
            EventHotspotSchema,
        ]
    };
};

export { requiredWallHotspotProperties, requiredEventHotspotProperties };

const hotspotSchema = {
    "required": ["cityId", "position", "type", "iconType"],
    "properties": {
        "cityId": {
            "type": "string"
        },
        "position": {
            "type": "object",
            "properties": {
                "latitude": {
                    "type": "number"
                },
                "longitude": {
                    "type": "number"
                }
            },
            "required": ["latitude", "longitude"]
        },
        "address": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "city": {
                    "type": "string"
                }
            },
            "required": ["name", "city"]
        },
        "type": {
            "type": "string",
            "enum": [HotspotType.WallMessage, HotspotType.Event]
        },
        "iconType": {
            "type": "string",
            "enum": [HotspotIconType.Wall, HotspotIconType.Event]
        }
    }
};

const requiredWallHotspotProperties = [...hotspotSchema.required, "title", "scope"];

const WallHotspotSchema = {
    "required": [...hotspotSchema.required, "title", "scope"],
    "properties": {
        ...hotspotSchema.properties,
        "scope": {
            "type": "string",
            "enum": ["public", "private"]
        },
        "title": {
            "type": "string",
            "maxLength": validation.TITLE_MAX_LENGTH
        }
    },
    "additionalProperties": false
};

const requiredEventHotspotProperties = [...hotspotSchema.required, "title", "scope", "dateEnd"];

const EventHotspotSchema = {
    "required": [...hotspotSchema.required, "title", "scope", "dateEnd"],
    "properties": {
        ...hotspotSchema.properties,
        "scope": {
            "type": "string",
            "enum": ["public", "private"]
        },
        "title": {
            "type": "string",
            "maxLength": validation.TITLE_MAX_LENGTH
        },
        "dateEnd": {
            "type": "string",
        }
    },
    "additionalProperties": false
};
