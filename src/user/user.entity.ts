import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "../role/role.entity";
import { key } from "../config/jwt";
import { MinLength } from "class-validator";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ name: "name" })
  @MinLength(5, { groups: ["signup"] })
  public username!: string;

  @Column()
  @MinLength(5, { groups: ["signup"] })
  public password!: string;

  @Column({ name: "created_at" })
  public createdAt!: Date;

  @ManyToMany((_type) => Role, (role) => role.users)
  @JoinTable({
    name: "user_role",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
  })
  roles!: Promise<Role[]>;

  @BeforeInsert()
  public hashPassword(): void {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
  }

  public async verifyPassword(password: string): Promise<boolean> {
    console.log("COMPARRING PASSWORD");
    return bcrypt.compare(password, this.password);
  }

  public async getUser() {
    return {
      id: this.id,
      name: this.username,
      roles: await this.getRoles(),
      token: await this.getJwt(),
    };
  }

  public async getJwt() {
    const claim = {
      name: this.username,
      // iat: Math.floor(Date.now() / 1000),
      "https://hasura.io/jwt/claims": await this.getHasuraClaims(),
    };
    return jwt.sign(claim, key, {
      subject: this.id,
      expiresIn: "30d",
      algorithm: "RS512",
    });
  }

  public async getHasuraClaims() {
    return {
      "x-hasura-allowed-roles": await this.getRoles(),
      "x-hasura-default-role": "user",
      "x-hasura-user-id": `${this.id}`,
      // 'x-hasura-org-id': '123',
      // 'x-hasura-custom': 'custom-value'
    };
  }

  public async getRoles() {
    return (await this.roles).map((role) => role.name).concat("user");
  }
}
