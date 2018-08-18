import Cityzen from '../../../domain/cityzens/model/Cityzen';

const updateCityzen = (cityzenToUpdate: Cityzen, requestPayload: any): Cityzen => {
    if (requestPayload.description !== undefined) {
        cityzenToUpdate.editDescription(requestPayload.description);
    }
    return cityzenToUpdate;
};

export default updateCityzen;
