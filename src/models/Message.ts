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
    id: string;

    @Field(()=> Date)
    @CreateDateColumn()
    date: Date;

    @Field(()=> String)
    @Column()
    @Length(1, 200)
    content: string;

    @Field(()=> String)
    @Column({ nullable: true })
    userId: string

    @Field(()=> User, { nullable: true })
    @ManyToOne(() => User, { nullable: true })
    user: User | undefined;

    @Field(()=> String)
    @Column({ nullable: true })
    conversationId: string

    @Field(()=> Conversation)
    @ManyToOne(() => Conversation, conversation => conversation.messages)
    conversation: Conversation | undefined;
}
