import AuthorSample from './AuthorSample';
import Message from '../messages/Message';
import { v4 } from 'uuid';

class MessageSample {

    public MARTIGNAS_CHURCH_MESSAGE = new Message(
        v4(), 'Messe tous les dimanches', AuthorSample.LOUISE, true, new Date());

    public MARTIGNAS_SCHOOL_MESSAGE = new Message(
        v4(), 'Recherche volontaires pour la kermess',
        AuthorSample.MARTIN, false, new Date(), new Date());

    public MARTIGNAS_TOWNHALL_MESSAGE = new Message(
        v4(), 'Horraires d\'ouverture', AuthorSample.ELODIE, false, new Date(), new Date());
}

export default MessageSample;
