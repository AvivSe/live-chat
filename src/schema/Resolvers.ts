import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import {Conversation, Message, Role, User} from "../models";
import {LoginDto} from "../dto/LoginDto";
import {CreateConversationDto} from "../dto/CreateConversationDto";
import {ForbiddenError, UserInputError} from "apollo-server-express";
import {SendMessageDto} from "../dto/SendMessageDto";

@Resolver()
export class Resolvers {

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        return await User.find();

    }

    @Query(() => [Conversation])
    async getAllConversationsByUserId(@Arg("id") id: string): Promise<Conversation[]> {
        const user = await User.findOneOrFail(id);
        let conversations;
        if (user.role === Role.Customer) {
            conversations = await Conversation.find({
                where: {customerId: id},
                relations: ['support', 'customer', 'messages', 'messages.user']
            });
        } else {
            conversations = await Conversation.find({
                relations: ['support', 'customer', 'messages', 'messages.user']
            });
        }

        return conversations;

    }

    @Mutation(() => User)
    async login(@Arg("loginDto", {validate: true}) loginDto: LoginDto): Promise<User> {
        try {
            let user = await User.findOne({where: [{username: loginDto.username}]})
            if (!user) {
                user = await User.create(loginDto);
                await user.save();
            }
            return user;
        } catch (error) {
            throw new UserInputError("Something went wrong")
        }
    }

    @Mutation(() => Conversation)
    async createConversation(@Arg("createConversationDto", {validate: true}) createConversationDto: CreateConversationDto): Promise<Conversation> {
        const user = await User.findOneOrFail(createConversationDto.userId);
        if (user.role === Role.Support) {
            throw new ForbiddenError("An admin can not create conversation")
        }
        const conversation = Conversation.create({customerId: user.id, messages: []});
        await conversation.save();

        return conversation;
    }

    @Mutation(() => Message)
    async sendMessage(@Arg("sendMessageDto", {validate: true}) sendMessageDto: SendMessageDto): Promise<Message> {
        const message = Message.create(sendMessageDto)
        await message.save();
        return message;
    }
}
