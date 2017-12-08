import * as validation from './constant';
// tslint:disable:object-literal-key-quotes
// tslint:disable:quotemark
// tslint:disable:trailing-comma
export const createHospotSchema = {
    "title": "POST /hotspots body validation",
    "type": "object",
    "required": ["position", "title", "message", "scope", "id_city"],
    "properties": {
        "title": {
            "type": "string",
            "maxLength": validation.TITLE_MAX_LENGTH
        },
        "id_city": {
            "type": "string"
        },
        "message": {
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
        "scope": {
            "type": "string",
            "enum": ["public", "private"]
        }
    }
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
