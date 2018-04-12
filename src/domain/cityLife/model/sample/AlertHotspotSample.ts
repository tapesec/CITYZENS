import AlertHotspot from './../../../../domain/cityLife/model/hotspot/AlertHotspot';
import AlertMessageSample from './../../../../domain/cityLife/model/sample/AlertMessageSample';
import HotspotBuilderSample from './HotspotBuilderSample';
import PertinenceScore from './../../model/hotspot/PertinenceScore';
import VoterList from './../../model/hotspot/VoterList';
import ImageLocation from '../hotspot/ImageLocation';

class AlertHotspotSample {
    public static ACCIDENT: AlertHotspot = new AlertHotspot(
        HotspotBuilderSample.ACCIDENT_HOTSPOT_BUILDER,
        AlertMessageSample.ACCIDENT_MESSAGE,
        new ImageLocation('https://cdn.filestackcontent.com/XMLTLsrBQY2uwNWpAIq1'),
        new PertinenceScore(0, 0),
        new VoterList(),
    );

    public static TOEDIT_CAMELOT: AlertHotspot = new AlertHotspot(
        HotspotBuilderSample.TOEDIT_CAMELOT_HOTSTPOT_BUILDER,
        AlertMessageSample.CAMELOT_MESSAGE,
        new ImageLocation(),
        new PertinenceScore(58420, 1754),
        new VoterList([['Karadoc', true], ['Perceval', false]]),
    );

    public static TO_READ_ALERT_HOTSPOT_FOR_TU: AlertHotspot = new AlertHotspot(
        HotspotBuilderSample.ACCIDENT_HOTSPOT_BUILDER,
        AlertMessageSample.ACCIDENT_MESSAGE,
        new ImageLocation(),
        new PertinenceScore(58420, 1754),
        new VoterList([['Karadoc', true], ['Perceval', false]]),
    );
}

export default AlertHotspotSample;
