export default <K, V>(map: Map<K, V>) => {
    const object: any = {};

    map.forEach((v, k) => {
        object[k.toString()] = v;
    });

    return object;
};
