import {Field, InputType} from "type-graphql";
import {Role} from "../models";
import {IsAlphanumeric, IsEnum, Length} from "class-validator";

@InputType()
export class CreateUserDto {

    @Field(() => String)
    @IsAlphanumeric()
    @Length(2, 60)
    username: string;

    @Field(() => Role)
    @IsEnum(Role)
    role: Role;
}
