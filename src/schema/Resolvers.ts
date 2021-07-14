import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import {User} from "../models";
import {UserInputError} from 'apollo-server-errors';
import {CreateUserDto} from "../dto/CreateUserDto";

@Resolver()
export class Resolvers {

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        return await User.find();

    }

    @Mutation(() => User)
    async createUser(@Arg("createUserDto", {validate: true}) createUserDto: CreateUserDto): Promise<User> {
        try {
            const user = await User.create(createUserDto);
            await user.save();
            return user;
        } catch (error) {
            throw new UserInputError("Something went wrong")
        }
    }
}
