import {Field, InputType} from "type-graphql";
import {IsAlphanumeric, Length} from "class-validator";

@InputType()
export class CreateConversationDto {

    @Field(() => String)
    userId: string;

}
