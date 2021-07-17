import {Conversation, Message, Role, User} from "../models";
import {LoginDto} from "../dto/LoginDto";
import {CreateConversationDto} from "../dto/CreateConversationDto";
import {SendMessageDto} from "../dto/SendMessageDto";
import {ForbiddenError, UserInputError} from "apollo-server-express";

export default class ChatService {

    async getAllConversationsByUserId(id: string): Promise<Conversation[]> {
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

    async login(loginDto: LoginDto): Promise<User> {
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

    async createConversation(createConversationDto: CreateConversationDto): Promise<Conversation> {
        const user = await User.findOneOrFail(createConversationDto.userId);
        if (user.role === Role.Support) {
            throw new ForbiddenError("An admin can not create conversation")
        }
        const conversation = Conversation.create({customerId: user.id, messages: []});
        await conversation.save();

        return await Conversation.findOneOrFail(conversation.id, {relations: ['customer', 'messages', 'messages.user']});
    }

    async sendMessage(sendMessageDto: SendMessageDto): Promise<Message> {
        const message = Message.create(sendMessageDto);
        await message.save();
        return await Message.findOneOrFail(message.id, {relations: ['user']});
    }
}
