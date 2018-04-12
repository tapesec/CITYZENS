import { isNumber } from 'util';

export const strToNumQSProps = (queryStrings: any, props: string[]) => {
    props.forEach(prop => {
        if (queryStrings[prop]) {
            if (!isNaN(+queryStrings[prop])) queryStrings[prop] = +queryStrings[prop];
        }
    });
    return queryStrings;
};

export const isUuid = (isIdParam: string) => {
    const uuidRegex = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/,
        'i',
    );
    return uuidRegex.test(isIdParam);
};
