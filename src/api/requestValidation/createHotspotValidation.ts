export const createHospotSchema = {
    // tslint:disable:object-literal-key-quotes
    // tslint:disable:quotemark
    // tslint:disable:trailing-comma
    "title": "POST /hotspot body validation",
    "type": "object",
    "required": ["position", "title", "message", "scope", "id_city"],
    "properties": {
        "title": {
            "type": "string"
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
