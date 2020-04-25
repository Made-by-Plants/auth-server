import passportjs from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { User } from "../user/user.entity";

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
  new BearerStrategy(function (token, done) {
    console.log({ token });
    return done("Invalid Token");
    // User.query()
    //   .where("token", token)
    //   .first()
    //   .eager("roles")
    //   .then(function (user) {
    //     if (!user) {
    //       return done("Invalid Token");
    //     }
    //     if (!user.active) {
    //       return done("User is inactive");
    //     }
    //     return done(null, user);
    //   })
    //   .catch(function (err) {
    //     done(err);
    //   });
  })
);

export const passport = passportjs;
