import {Arg, Mutation, Query, Resolver, Root, Subscription} from 'type-graphql';
import {Conversation, Message, Role, User} from "../models";
import {LoginDto} from "../dto/LoginDto";
import {CreateConversationDto} from "../dto/CreateConversationDto";
import {SendMessageDto} from "../dto/SendMessageDto";
import {withFilter} from 'graphql-subscriptions';
import ChatService from "../services/ChatService";
import {PubSub} from "apollo-server";

const pubSub = new PubSub();

@Resolver()
export class Resolvers {
    private chatService: ChatService;

    constructor() {
        this.chatService = new ChatService();
    }

    @Query(() => [Conversation])
    getAllConversationsByUserId(@Arg("id") id: string): Promise<Conversation[]> {
        return this.chatService.getAllConversationsByUserId(id);
    }

    @Mutation(() => User)
    login(@Arg("loginDto", {validate: true}) loginDto: LoginDto): Promise<User> {
        return this.chatService.login(loginDto);
    }

    @Mutation(() => Conversation)
    async createConversation(@Arg("createConversationDto", {validate: true}) createConversationDto: CreateConversationDto): Promise<Conversation> {
        const conversation = await this.chatService.createConversation(createConversationDto);
        await pubSub.publish(`NEW_CONVERSATION`, conversation);
        return conversation;
    }

    @Mutation(() => Message)
    async sendMessage(@Arg("sendMessageDto", {validate: true}) sendMessageDto: SendMessageDto): Promise<Message> {
        const message = await this.chatService.sendMessage(sendMessageDto);
        await pubSub.publish(`NEW_MESSAGE`, message);
        return this.chatService.sendMessage(sendMessageDto);
    }

    @Subscription({
        subscribe: withFilter(() => pubSub.asyncIterator([`NEW_MESSAGE`]),
            (payload: Message, variables) => {
                return payload.conversationId === variables.conversationId;
            }),
        nullable: true,
    })
    newMessage(@Root() message: Message, @Arg("conversationId") conversationId: string): Message {
        return message;
    }

    @Subscription({
        subscribe: withFilter(() => pubSub.asyncIterator([`NEW_CONVERSATION`]),
            async (payload: Conversation, variables) => {
                return (await User.findOneOrFail(variables.userId)).role === Role.Support;
            }),
        nullable: true,
    })
    newConversation(@Root() conversation: Conversation, @Arg("userId") userId: string): Conversation {
        return conversation;
    }

}
