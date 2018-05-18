import FilestackService from '../filestack/FilestackService';

class SlideshowService {
    constructor(protected filestackService: FilestackService) {}
    async removeImage(oldWidgetsImagesId: string[], newWidgetsImagesId: string[]) {
        try {
            const idsToRemoveFromFilestack = oldWidgetsImagesId.filter(
                x => !newWidgetsImagesId.includes(x),
            );

            await Promise.all(
                idsToRemoveFromFilestack.map(async fileId => {
                    await this.filestackService.remove(fileId);
                }),
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default SlideshowService;
