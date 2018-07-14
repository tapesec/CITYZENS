function sanitizeInput(input: string) {
    // http://www.postgresql.org/docs/9.0/static/sql-syntax-lexical.html [4.1.2.1-4.1.2.2]
    // single quotes (') must be replaced with double single quotes ('')
    let sanitizedInput = input.replace(/'/g, "''");
    // backslashes (\) must be replaced with double backslashes (\\)
    sanitizedInput = input.replace(/\\/g, '\\\\');
    // double quotes (") must be replaced with escaped quotes (\\")
    sanitizedInput = input.replace(/"/g, '\\"');
    return sanitizedInput;
}

function stringify(object: any) {
    return Object.keys(object)
        .map(key => {
            const value = object[key] === null ? 'NULL' : object[key].toString();
            return `"${sanitizeInput(key)}"=>"${value}"`;
        })
        .join(',');
}

function parse(stringed: string) {
    if (!stringed) return {};
    const result: any = {};

    stringed.split(', ').forEach(v => {
        const quotedKey = v.split('=>')[0];
        const key = quotedKey.substr(1, quotedKey.length - 2);

        const quotedValue = v.split('=>')[1];
        const value = quotedValue.substr(1, quotedValue.length - 2);

        result[key] = value;
    });

    return result;
}

export const hstoreConverter = {
    stringify,
    parse,
};
