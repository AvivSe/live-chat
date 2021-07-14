import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Message} from "./Message";
import {User} from "./User";

@Entity()
@ObjectType()
export class Conversation extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string ;

    @Field(() => String)
    @Column({ nullable: true })
    customerId: string;

    @Field(() => User)
    @ManyToOne(() => User, { nullable: true })
    customer: User;

    @Field(() => String)
    @Column({ nullable: true })
    supportId: string;

    @Field(() => String)
    @ManyToOne(() => User, { nullable: true })
    support: User;

    @Field(() => [Message])
    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

}
