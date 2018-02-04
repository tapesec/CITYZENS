import CitySample from './CitySample';
import Address from '../hotspot/Address';

class AddressSample {
    public static TOWNHALL_ADDRESS : Address =
    new Address('1 place de la Mairie', CitySample.MARTIGNAS.name);
    public static CHURCH_ADDRESS : Address =
    new Address('2 rue Saint Martin', CitySample.MARTIGNAS.name);
    public static SCHOOL_ADDRESS : Address =
    new Address('4 rue Louis Blanc', CitySample.MARTIGNAS.name);
    public static RANDOM_MERIGNAC_ADDRESS : Address =
    new Address('12 rue de l\'Aubépine', CitySample.MERIGNAC.name);
    public static TOEDIT_ADDRESS : Address =
    new Address('2 place des éditions galimard', CitySample.MARTIGNAS.name);
    public static ACCIDENT_ADDRES : Address =
    new Address('6 avenue de Verdin', CitySample.MARTIGNAS.name);
}

export default AddressSample;
