import Content from '../hotspot/Content';

class ContentSample {
    public static MARTIGNAS_TOWNHALL_MESSAGE = new Content('Horraires d\'ouverture', new Date());
    public static MARTIGNAS_SCHOOL_MESSAGE = new Content(
        'Recherche volontaires pour la kermess',
        new Date(),
    );
    public static CHURCH_MESSAGE = new Content(
        'Messe tous les dimanches',
        new Date(),
    );
    public static MARTIGNAS_TOEDIT_MESSAGE = new Content('Horraires d\'ouverture', new Date());
}

export default ContentSample;
