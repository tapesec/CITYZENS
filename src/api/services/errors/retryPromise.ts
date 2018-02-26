
export default <T>(call: any, opts: any): Promise<T> => {
    const retries = opts.retries;

    return new Promise<T>(async (resolve, reject) => {
        let err;
        for (let i = 0; i < retries; i += 1) {
            try {
                await call().then((r: T) => {
                    resolve(r);
                });
                return;
            } catch (error) {
                err = error;
            }
        }
        reject(err);
    });

};
