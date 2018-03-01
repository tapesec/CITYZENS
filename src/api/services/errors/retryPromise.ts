
const defaultOpts = {
    retries: 5,
    delayBase: 2,
    delayMultiple: 100,
    delayCustom: undefined as number[],
};

const sleep = (ms: number): Promise<{}> => {
    return new Promise(r => setTimeout(r, ms));
};

export default async <T>(call: () => Promise<T>, _opts?: any): Promise<T> => {
    const opts = _opts || defaultOpts;

    const retries = opts.retries ? opts.retries : defaultOpts.retries;
    const delayBase = opts.delayBase ? opts.delayBase : defaultOpts.delayBase;
    const delayMultiple = opts.delayMultiple
        ? opts.delayMultiple
        : defaultOpts.delayMultiple; // in ms.

    // just a quick check to make sure the array passed is of good dimensions.
    const delayCustom =
        (opts.delayCustom instanceof Array &&
         opts.delayCustom.length() === retries)
            ? opts.delayCustom
            : defaultOpts.delayCustom;

    let result: T;
    let err: any;

    let lastDelay = delayMultiple;

    for (let i = 0; i < retries; i += 1) {
        try {
            result = (await call());
            return result;
        } catch (error) {
            err = error;
            await sleep(lastDelay);

            lastDelay *= delayBase;
            if (delayCustom) {
                lastDelay = delayCustom[i];
            }
        }
    }

    throw err;
};
