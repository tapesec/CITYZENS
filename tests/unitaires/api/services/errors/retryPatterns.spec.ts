import * as TypeMoq from 'typemoq';
import * as Chai from 'chai';
import retryPromise from '../../../../../src/api/services/errors/retryPromise';

describe('RetryPatterns', () => {

    let call: TypeMoq.IMock<() => Promise<any>>;

    beforeEach(() => {
        call = TypeMoq.Mock.ofType<() => Promise<any>>();
        call
            .setup(x => x())
            .returns(() => Promise.resolve<any>(0));
    });

    it('Should act like a normal call (succes on the first try).', async () => {
        const result = await retryPromise(call.object);

        Chai.expect(result).to.be.equal(0);
        call.verify(x => x(), TypeMoq.Times.once());
    });

    it('Should retry 3 times before a success.', async () => {
        let n = 3;

        call.reset();
        call
            .setup(x => x())
            .returns(() => {
                n = n - 1;
                if (n !== 0) {
                    return Promise.reject(1);
                }
                return Promise.resolve<number>(0);
            });

        const result = await retryPromise(call.object, { delayMultiple: 1 });

        Chai.expect(result).to.be.equal(0);
        call.verify(x => x(), TypeMoq.Times.exactly(3));
    });


    it('Should retry 5 times and finally fail.', async () => {

        call.reset();
        call
            .setup(x => x())
            .returns(() => {
                return Promise.reject('');
            });

        let failed = false;
        try {
            await retryPromise(call.object, { delayMultiple: 1 });
        } catch (err) {
            failed = true;
        }

        Chai.assert(failed, 'Did not fail.');
        call.verify(x => x(), TypeMoq.Times.exactly(5));
    });
});
