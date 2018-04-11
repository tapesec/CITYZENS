import AlertHotspot from './../../../../domain/cityLife/model/hotspot/AlertHotspot';
import AlertMessageSample from './../../../../domain/cityLife/model/sample/AlertMessageSample';
import HotspotBuilderSample from './HotspotBuilderSample';
import PertinenceScore from './../../model/hotspot/PertinenceScore';
import VoterList from './../../model/hotspot/VoterList';

class AlertHotspotSample {
    public static ACCIDENT: AlertHotspot = new AlertHotspot(
        HotspotBuilderSample.ACCIDENT_HOTSPOT_BUILDER,
        AlertMessageSample.ACCIDENT_MESSAGE,
        new PertinenceScore(0, 0),
        new VoterList(),
    );

    public static TOEDIT_CAMELOT: AlertHotspot = new AlertHotspot(
        HotspotBuilderSample.TOEDIT_CAMELOT_HOTSTPOT_BUILDER,
        AlertMessageSample.CAMELOT_MESSAGE,
        new PertinenceScore(58420, 1754),
        new VoterList([['Karadoc', true], ['Perceval', false]]),
    );
}

export default AlertHotspotSample;
