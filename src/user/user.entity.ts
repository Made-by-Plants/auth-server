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

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ name: "name" })
  public username!: string;

  @Column()
  public password!: string;

  @ManyToMany((type) => Role, (role) => role.users)
  @JoinTable({
    name: "user_role",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
  })
  roles!: Promise<Role[]>;

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    const salt = bcrypt.genSaltSync();
    this.password = await bcrypt.hash(this.password, salt);
  }

  public async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public getJwt() {
    const claim = {
      name: this.username,
      // iat: Math.floor(Date.now() / 1000),
      "https://hasura.io/jwt/claims": this.getHasuraClaims(),
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

  async getRoles() {
    return (await this.roles).map((el) => el.name).concat("user");
  }
}
