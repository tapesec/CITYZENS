import AlertMessage from '../AlertMessage';

class AlertMessageSample {
    public static ACCIDENT_MESSAGE = new AlertMessage(
        'Un accident est survenue entre un 4x4 et une smart, des debris son encore présent.',
        new Date(),
    );
    public static CAMELOT_MESSAGE = new AlertMessage(
        'Une invasion bourgonde arrive sur les cotes est, les chevaliers Perceval et Karadoc ' +
            'iront en reconnaissances et meneront les troupes du Pays de Galle.',
        new Date(650, 5),
    );
}

export default AlertMessageSample;
