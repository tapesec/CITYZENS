import Hotspot from './domain/cityLife/Hotspot';
import { v4 } from 'uuid';

import PositionSample from './domain/cityLife/PositionSample';

const hostspot = new Hotspot(v4(), PositionSample.MARTIGNAS_NORTH_OUEST);
console.log(JSON.stringify(hostspot));
