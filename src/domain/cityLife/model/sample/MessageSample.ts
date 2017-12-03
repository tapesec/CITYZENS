import HotspotSample from './HotspotSample';
import HotspotId from '../hotspot/HotspotId';
import AuthorSample from './AuthorSample';
import Message from '../messages/Message';
import { v4 } from 'uuid';

class MessageSample {

    public static MARTIGNAS_CHURCH_MESSAGE = new Message(
        v4(),
        'Messe tous les dimanches',
        `You see? It\'s curious. Ted did figure it out - time travel.
        And when we get back, we gonna tell everyone.
        How it's possible, how it's done, what the dangers are.
        But then why fifty years in the future when the spacecraft encounters a
        black hole does the computer call it an 'unknown entry event'?
        Why don't they know? If they don't know, that means we never told anyone.
        And if we never told anyone it means we never made it back. Hence we die down here.
        Just as a matter of deductive logic.`,
        AuthorSample.LOUISE, true, new HotspotId(HotspotSample.CHURCH.id), new Date());

    public static MARTIGNAS_SCHOOL_MESSAGE = new Message(
        v4(), 'Recherche volontaires pour la kermess',
        `The path of the righteous man is beset on all sides by the iniquities of the selfish
        and the tyranny of evil men. Blessed is he who, in the name of charity and good will,
        shepherds the weak through the valley of darkness,
        for he is truly his brother's keeper and the finder of lost children. And I will
        strike down upon thee with great vengeance and furious anger those who would attempt
        to poison and destroy My brothers.
        And you will know My name is the Lord when I lay My vengeance upon thee.`,
        AuthorSample.MARTIN, false, new HotspotId(HotspotSample.SCHOOL.id), new Date(), new Date());

    public static MARTIGNAS_TOWNHALL_MESSAGE = new Message(
        v4(), 'Horraires d\'ouverture',
        `Your bones don't break, mine do. That's clear.
        Your cells react to bacteria and viruses differently than mine.
        You don't get sick, I do. That's also clear.
        But for some reason, you and I react the exact same way to water.
        We swallow it too fast, we choke. We get some in our lungs, we drown.
        However unreal it may seem, we are connected, you and I.
        We're on the same curve, just on opposite ends.`,
        AuthorSample.ELODIE,
        false, new HotspotId(HotspotSample.TOWNHALL.id), new Date(), new Date());
}

export default MessageSample;
