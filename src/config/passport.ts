import passportjs from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../user/user.entity";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { key } from "./jwt";
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
      User.findOne({ username }, { relations: ["roles"] })
        .then(async function (user) {
          const failMessage = "invalid username or password";
          if (!user) return done(failMessage);
          const validPassword = await user.verifyPassword(password);
          if (!validPassword) return done(failMessage);
          return done(null, user);
        })
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
      User.findOne(jwtPayload.sub, { relations: ["roles"] })
        .then((user) => {
          if (user) return done(null, user);
          done(null, false);
        })
        .catch(done);
    }
  )
);

export const passport = passportjs;
