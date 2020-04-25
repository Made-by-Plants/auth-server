import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity("role")
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public name!: string;

  @ManyToMany((_type) => User, (user) => user.roles)
  users!: Promise<User>[];
}
