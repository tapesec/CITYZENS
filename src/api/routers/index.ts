import * as restify from 'restify';
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:import-name
import hotspotRepositoryInMemory from '../../domain/cityLife/infrastructure/HotspotRepositoryInMemory';
import HotspotRouter from './HotspotRouter';
import HotspotCtrl from '../controllers/HotspotCtrl';

export const init = (server : restify.Server) => {
    const routers = [];
    routers.push(new HotspotRouter(new HotspotCtrl(hotspotRepositoryInMemory)));
    routers.forEach(r => r.bind(server));
};
