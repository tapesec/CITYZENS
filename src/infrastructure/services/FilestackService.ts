import FilestackApi from '../libs/FilestackApi';

class FilestackService {
    constructor(protected filestackApi: FilestackApi) {}
    async removeImages(imagesId: string[]) {
        try {
            await Promise.all(
                imagesId.map(async fileId => {
                    await this.filestackApi.remove(fileId);
                }),
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default FilestackService;
