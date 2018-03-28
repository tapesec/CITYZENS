const nanos = () => {
    const hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
};
const seconds = () => {
    return nanos() / 1000000000;
};
const millis = (time: number) => {
    return nanos() / 1000000;
};

export default nanos;

export { seconds, millis, nanos };
