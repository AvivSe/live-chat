import {Field, ID, InputType, ObjectType, registerEnumType} from 'type-graphql';
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn,} from 'typeorm';

export enum Role {
    Customer,
    Support
}

registerEnumType(Role, {
    name: "Role",
    description: "Customer/Support",
});

@Entity()
@ObjectType()
@InputType()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ unique: true })
    username: string;

    @Field(() => Role)
    @Column()
    role: Role;

    constructor(username: string, role: Role) {
        super();
        this.username = username;
        this.role = role;
    }
}
