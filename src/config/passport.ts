import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { User } from "../user/user.entity";

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    function (username, password, done) {
      User.findOneOrFail({ username }, { relations: ["roles"] })
        .then(async function (user) {
          if (!user) {
            return done("Unknown user");
          }
          // if (!user.active) {
          //   return done("User is inactive");
          // }
          const validPassword = await user.verifyPassword(password);
          if (!validPassword) {
            return done("Invalid password");
          }
          return done(null, user);
        })
        .catch(function (err) {
          done(err);
        });
    }
  )
);

passport.use(
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

module.exports = passport;
