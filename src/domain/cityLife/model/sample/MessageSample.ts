import WallHotspotSample from './WallHotspotSample';
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
        AuthorSample.LOUISE, true, new HotspotId(WallHotspotSample.CHURCH.id), new Date());

    public static MARTIGNAS_SCHOOL_MESSAGE = new Message(
        v4(), 'Recherche volontaires pour la kermess',
        `Pour cette nouvelle édition de la kermess de l'école,
        nous cherchons des volontaires pour tenir les stands.
        Nous avons besoins aussi d'une friteuse et d'une machine à barbapapa.\n\n
        Voici encore du texte pour voir ce que ça donne le test de différentes polices
         de caractères.\n\n
         Il était une fois un marchand de foie qui vendait du foie dans la ville de Foix,
         il se dit mafois c'est bien la première et la dernière fois que je vendrai du foie
         dans la ville de Foix.`,
        AuthorSample.MARTIN, false, new HotspotId(WallHotspotSample.SCHOOL.id),
        new Date(), new Date());

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
        false, new HotspotId(WallHotspotSample.TOWNHALL.id), new Date(), new Date());

    public static SIMCITY_TOEDIT_MESSAGE = new Message(
        v4(), 'A title that will be edit',
        `Your bones don't break, mine do. That's clear.
        Your cells react to bacteria and viruses differently than mine.
        You don't get sick, I do. That's also clear.
        But for some reason, you and I react the exact same way to water.
        We swallow it too fast, we choke. We get some in our lungs, we drown.
        However unreal it may seem, we are connected, you and I.
        We're on the same curve, just on opposite ends.`,
        AuthorSample.ELODIE,
        false, new HotspotId(WallHotspotSample.TOEDIT.id), new Date(), new Date());
}

export default MessageSample;
