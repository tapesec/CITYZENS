import AlertHotspot from './../../../../domain/cityLife/model/hotspot/AlertHotspot';
import AlertMessageSample from './../../../../domain/cityLife/model/sample/AlertMessageSample';
import HotspotBuilderSample from './HotspotBuilderSample';

class AlertHotspotSample {
    public static ACCIDENT: AlertHotspot = new AlertHotspot(
        HotspotBuilderSample.ACCIDENT_HOTSPOT_BUILDER,
        AlertMessageSample.ACCIDENT_MESSAGE,
    );
}

export default AlertHotspotSample;
