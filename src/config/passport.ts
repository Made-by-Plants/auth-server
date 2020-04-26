import passportjs from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../user/user.entity";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { key } from "./jwt";
import { UnauthorizedError } from "routing-controllers";
passportjs.serializeUser((user: User, done) => {
  done(null, user.id);
});

passportjs.deserializeUser((id, done) => {
  User.findOneOrFail(String(id))
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err, null));
});

passportjs.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) => {
      User.authPassword(username, password)
        .then((user) => done(null, user))
        .catch(done);
    }
  )
);

passportjs.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: key,
      algorithms: ["RS512"],
    },
    (jwtPayload, done) => {
      User.findOneOrFail(jwtPayload.sub, { relations: ["roles"] })
        .then((user) => {
          if (user) return done(null, user);
          done(null, false);
        })
        .catch(() => {
          throw new UnauthorizedError();
        })
        .catch(done);
    }
  )
);

export const passport = passportjs;
