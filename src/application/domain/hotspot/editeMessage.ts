import Message from './Message';

export default (message: Message, payload: any): Message => {
    if (payload.title !== undefined) {
        message.changeTitle(payload.title);
    }
    if (payload.body !== undefined) {
        message.editBody(payload.body);
    }
    if (payload.pinned !== undefined) {
        if (message.pinned !== payload.pinned) message.togglePinMode();
    }
    return message;
};
