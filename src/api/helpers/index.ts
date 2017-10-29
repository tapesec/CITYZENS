export const latitudeLongitude = (queryStrings : any) : boolean => {
    if (
        /^(-?[0-9]+\.[0-9]+)$/.test(queryStrings.north) &&
        /^(-?[0-9]+\.[0-9]+)$/.test(queryStrings.west) &&
        /^(-?[0-9]+\.[0-9]+)$/.test(queryStrings.south) &&
        /^(-?[0-9]+\.[0-9]+)$/.test(queryStrings.east)
    ) {
        return true;
    }
    return false;
};
