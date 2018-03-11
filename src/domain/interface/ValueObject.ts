export default interface ValueObject {
    isEqual: (other: ValueObject) => boolean;
    toString(): any;
};
