export const strToNumQSProps = (queryStrings: any, props: string[]) => {
    props.forEach(prop => {
        if (queryStrings[prop]) {
            queryStrings[prop] = +queryStrings[prop];
        }
    });
    return queryStrings;
};
