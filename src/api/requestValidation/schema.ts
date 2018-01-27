import * as validation from './constant';
// tslint:disable:object-literal-key-quotes
// tslint:disable:quotemark
// tslint:disable:trailing-comma
export const getHotspots = {
    "title": "GET /hotspots by area",
    "type": "object",
    "oneOf": [
        {
            "required": ["north", "west", "south", "east"],
            "properties": {
                "north": {
                    "type": "number"
                },
                "west": {
                    "type": "number"
                },
                "south": {
                    "type": "number"
                },
                "east": {
                    "type": "number"
                },
            },
            "additionalProperties": false
        },
        {
            "required": ["insee"],
            "properties": {
                "insee": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        }
    ],

};

export const getHotspotId = {
    "title": "GET /hotspots/{hotspotId} by id",
    "type": "object",
    "additionalProperties": false,
    "properties": {}
};


export const createMessageSchema = {
    "title": "POST /hotspots/{hotspotId}/messages body validation",
    "type": "object",
    "required": ["title", "body"],
    "properties": {
        "title": {
            "type": "string",
            "maxLength": validation.TITLE_MAX_LENGTH
        },
        "body": {
            "type": "string",
            "maxLength": validation.MESSAGE_BODY_MAX_LENGTH
        },
        "pinned": {
            "type": "boolean"
        }
    }
};

export const patchMessageSchema = {
    "title": "POST /hotspots/{hotspotId}/messages body validation",
    "type": "object",
    "anyOf": [
        { "required": ["title"] },
        { "required": ["body"] },
        { "required": ["pinned"] },
    ],
    "properties": {
        "title": {
            "type": "string",
            "maxLength": validation.TITLE_MAX_LENGTH
        },
        "body": {
            "type": "string",
            "maxLength": validation.MESSAGE_BODY_MAX_LENGTH
        },
        "pinned": {
            "type": "boolean"
        }
    }
};
