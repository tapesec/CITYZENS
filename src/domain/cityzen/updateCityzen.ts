import Cityzen from './Cityzen';
import ImageLocation from '../hotspot/ImageLocation';

const updateCityzen = (cityzenToUpdate: Cityzen, requestPayload: any): Cityzen => {
    if (requestPayload.description !== undefined) {
        cityzenToUpdate.editDescription(requestPayload.description);
    }
    if (requestPayload.pictureCityzen !== undefined) {
        cityzenToUpdate.editPictureLocation(new ImageLocation(requestPayload.pictureCityzen));
    }
    return cityzenToUpdate;
};

export default updateCityzen;
