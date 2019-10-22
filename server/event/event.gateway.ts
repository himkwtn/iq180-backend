import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import {
    IN_EVENT,
    JoinEvent,
    EditEvent,
    InChatMessageEvent,
    ReadyEvent,
    AnswerEvent,
} from './in-events';
import { EventService } from './event.service';
import { SocketClient } from './event.type';

@WebSocketGateway()
export class EventGateway implements OnGatewayDisconnect {
    constructor(private readonly eventService: EventService) {}

    @SubscribeMessage(IN_EVENT.JOIN)
    join(client: SocketClient, input: JoinEvent) {
        this.eventService.receiveEvent(client, IN_EVENT.JOIN, input);
    }

    @SubscribeMessage(IN_EVENT.LEAVE)
    leave(client: SocketClient) {
        this.eventService.receiveEvent(client, IN_EVENT.LEAVE);
    }

    @SubscribeMessage(IN_EVENT.EDIT)
    edit(client: SocketClient, input: EditEvent) {
        this.eventService.receiveEvent(client, IN_EVENT.EDIT, input);
    }

    @SubscribeMessage(IN_EVENT.CHAT_MESSAGE)
    chatMessage(client: SocketClient, input: InChatMessageEvent) {
        this.eventService.receiveEvent(client, IN_EVENT.CHAT_MESSAGE, input);
    }

    @SubscribeMessage(IN_EVENT.READY)
    ready(client: SocketClient, input: ReadyEvent) {
        this.eventService.receiveEvent(client, IN_EVENT.READY, input);
    }

    @SubscribeMessage(IN_EVENT.START)
    start(client: SocketClient) {
        this.eventService.receiveEvent(client, IN_EVENT.START);
    }

    @SubscribeMessage(IN_EVENT.ANSWER)
    answer(client: SocketClient, input: AnswerEvent) {
        this.eventService.receiveEvent(client, IN_EVENT.ANSWER, input);
    }

    handleDisconnect(client: SocketClient) {
        this.eventService.receiveEvent(client, IN_EVENT.LEAVE);
    }
}
