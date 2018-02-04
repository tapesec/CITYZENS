import AlertMessage from './../../../../domain/cityLife/model/hotspot/AlertMessage';


class AlertMessageSample {
    public static ACCIDENT_MESSAGE = new AlertMessage(
        'Un accident est survenue entre un 4x4 et une smart, des debris son encore présent.',
        new Date(),
    );
}

export default AlertMessageSample;
