import Message from '../hotspot/Message';
import MessageId from '../hotspot/MessageId';
import AuthorSample from './AuthorSample';
import MediaHotspotsSample from './MediaHotspotSample';
class MessageSample {
    public static MARTIGNAS_CHURCH_MESSAGE = new Message(
        new MessageId('b17234e7-7a91-4bec-b68d-281333871538'),
        'Messe tous les dimanches',
        `You see? It\'s curious. Ted did figure it out - time travel.
        And when we get back, we gonna tell everyone.
        How it's possible, how it's done, what the dangers are.
        But then why fifty years in the future when the spacecraft encounters a
        black hole does the computer call it an 'unknown entry event'?
        Why don't they know? If they don't know, that means we never told anyone.
        And if we never told anyone it means we never made it back. Hence we die down here.
        Just as a matter of deductive logic.`,
        AuthorSample.LOUISE,
        true,
        MediaHotspotsSample.CHURCH.id,
        undefined,
        new Date(),
        new Date(),
    );

    public static MARTIGNAS_SCHOOL_MESSAGE = new Message(
        new MessageId('a5b45da8-140c-4565-a81f-970c265ee750'),
        'Recherche volontaires pour la kermess',
        `Pour cette nouvelle édition de la kermess de l'école,
        nous cherchons des volontaires pour tenir les stands.
        Nous avons besoins aussi d'une friteuse et d'une machine à barbapapa.\n\n
        Voici encore du texte pour voir ce que ça donne le test de différentes polices
         de caractères.\n\n
         Il était une fois un marchand de foie qui vendait du foie dans la ville de Foix,
         il se dit mafois c'est bien la première et la dernière fois que je vendrai du foie
         dans la ville de Foix.`,
        AuthorSample.MARTIN,
        false,
        MediaHotspotsSample.SCHOOL.id,
        undefined,
        new Date(),
        new Date(),
    );

    public static MARTIGNAS_TOWNHALL_MESSAGE = new Message(
        new MessageId('7cee17c4-4bc7-4160-944a-17e1bbcc2c9d'),
        "Horraires d'ouverture",
        `Your bones don't break, mine do. That's clear.
        Your cells react to bacteria and viruses differently than mine.
        You don't get sick, I do. That's also clear.
        But for some reason, you and I react the exact same way to water.
        We swallow it too fast, we choke. We get some in our lungs, we drown.
        However unreal it may seem, we are connected, you and I.
        We're on the same curve, just on opposite ends.`,
        AuthorSample.ELODIE,
        false,
        MediaHotspotsSample.TOWNHALL.id,
        undefined,
        new Date(),
        new Date(),
    );

    public static SIMCITY_TOEDIT_MESSAGE = new Message(
        new MessageId('c6ece8ef-7f8e-4d35-b54a-009be9214e68'),
        'A title that will be edit',
        `Your bones don't break, mine do. That's clear.
        Your cells react to bacteria and viruses differently than mine.
        You don't get sick, I do. That's also clear.
        But for some reason, you and I react the exact same way to water.
        We swallow it too fast, we choke. We get some in our lungs, we drown.
        However unreal it may seem, we are connected, you and I.
        We're on the same curve, just on opposite ends.`,
        AuthorSample.ELODIE,
        false,
        MediaHotspotsSample.TOEDIT.id,
        undefined,
        new Date(),
        new Date(),
    );
}

export default MessageSample;
