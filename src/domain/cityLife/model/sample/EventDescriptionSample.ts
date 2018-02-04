import EventDescription from './../../../../domain/cityLife/model/hotspot/EventDescription';

class EventDescriptionSample {
    public static MATCH_DESCRIPTION = new EventDescription(
        'Un matche va se dérouler entre Oberyn et La Montagne pour décider du destin de tyrion',
        new Date('December 25, 2020 12:00:00'),
    );
}

export default EventDescriptionSample;
