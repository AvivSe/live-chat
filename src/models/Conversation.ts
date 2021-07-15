import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Message} from "./Message";
import {User} from "./User";

@Entity()
@ObjectType()
export class Conversation extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => String)
    @Column({nullable: true})
    customerId: string;

    @Field(() => User)
    @ManyToOne(() => User, {nullable: true})
    customer: User;

    @Field(() => String, {nullable: true})
    @Column({nullable: true})
    supportId: string;

    @Field(() => User, {nullable: true})
    @ManyToOne(() => User, {nullable: true})
    support: User;

    @Field(() => [Message], {nullable: true})
    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

}
