import {Field, ID, ObjectType} from 'type-graphql';
import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import {Length} from "class-validator";
import {Conversation} from "./Conversation";
import {User} from "./User";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string | undefined;

    @Field(()=> Date)
    @CreateDateColumn()
    date: Date | undefined;

    @Column()
    @Length(1, 200)
    content: string;

    @Column({ nullable: true })
    userId: string

    @ManyToOne(() => User, { nullable: true })
    user: User | undefined;

    @Column({ nullable: true })
    conversationId: string

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    conversation: Conversation | undefined;

    constructor(content: string, userId: string, conversationId: string) {
        super();
        this.conversationId = conversationId;
        this.userId = userId;
        this.content = content;
    }
}
