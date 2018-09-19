import { isNumber } from 'util';

export const strToNumQSProps = (queryStrings: any, props: string[]) => {
    props.forEach(prop => {
        if (queryStrings[prop]) {
            if (!isNaN(+queryStrings[prop])) queryStrings[prop] = +queryStrings[prop];
        }
    });
    return queryStrings;
};

