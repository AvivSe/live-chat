import {Field, InputType} from "type-graphql";

@InputType()
export class SendMessageDto {

    @Field(() => String)
    userId: string;

    @Field(() => String)
    conversationId: string;


    @Field(() => String)
    content: string;
}
