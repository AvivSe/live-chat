import {Arg, Args, Mutation, Query, Resolver, Root, Subscription} from 'type-graphql';
import {Conversation, Message, Role, User} from "../models";
import {LoginDto} from "../dto/LoginDto";
import {CreateConversationDto} from "../dto/CreateConversationDto";
import {ForbiddenError, UserInputError} from "apollo-server-express";
import {SendMessageDto} from "../dto/SendMessageDto";
import {PubSub} from "apollo-server";
import {withFilter} from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
export class Resolvers {

    @Query(() => [Conversation])
    async getAllConversationsByUserId(@Arg("id") id: string): Promise<Conversation[]> {
        const user = await User.findOneOrFail(id);
        let conversations;
        if (user.role === Role.Customer) {
            conversations = await Conversation.find({
                where: {customerId: id},
                relations: ['customer', 'messages', 'messages.user']
            });
        } else {
            conversations = await Conversation.find({
                relations: ['customer', 'messages', 'messages.user']
            });
        }

        return conversations;

    }

    @Mutation(() => User)
    async login(@Arg("loginDto", {validate: true}) loginDto: LoginDto): Promise<User> {
        let user = await User.findOne({where: [{username: loginDto.username}]});
        if (!user) {
            user = await User.create(loginDto);
            await user.save();
        } else {
            if (user.role === Role.Customer && loginDto.role === Role.Support) {
                throw new UserInputError("Customers cannot access admin mode")
            }
        }
        return user
    }

    @Mutation(() => Conversation)
    async createConversation(@Arg("createConversationDto", {validate: true}) createConversationDto: CreateConversationDto): Promise<Conversation> {
        const user = await User.findOneOrFail(createConversationDto.userId);
        if (user.role === Role.Support) {
            throw new ForbiddenError("An admin can not create conversation")
        }
        const conversation = Conversation.create({customerId: user.id, messages: []});
        await conversation.save();

        const populatedConversation = await Conversation.findOneOrFail(conversation.id, {relations: ['customer', 'messages', 'messages.user']});

        await pubSub.publish(`NEW_CONVERSATION`, populatedConversation);

        return populatedConversation;
    }

    @Mutation(() => Message)
    async sendMessage(@Arg("sendMessageDto", {validate: true}) sendMessageDto: SendMessageDto): Promise<Message> {
        const message = Message.create(sendMessageDto);
        await message.save();
        const populatedMessage = await Message.findOneOrFail(message.id, {relations: ['user']})

        await pubSub.publish(`NEW_MESSAGE`, populatedMessage);

        return populatedMessage;
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
                // TODO: ONLY ADMIN
                return (await User.findOneOrFail(variables.userId)).role === Role.Support;
            }),
        nullable: true,
    })
    newConversation(@Root() conversation: Conversation, @Arg("userId") userId: string): Conversation {
        return conversation;
    }

}
