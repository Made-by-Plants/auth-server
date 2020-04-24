import { check, validationResult, body } from "express-validator";
import { getConnection } from "typeorm";
import { User } from "./user/user.entity";

export const AppRoutes = [
  {
    method: "post",
    path: "/signup",
    validations: [
      check("username").isEmail(),
      check("password").isLength({ min: 5 }),
      check("confirmPassword").isLength({ min: 5 }),
    ],
    implementation: async (req, res) => {
      await body("confirmPassword")
        .equals(req.body.password)
        .withMessage("passwords do not match")
        .run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const users = await User.find();

      res.status(200).send({ users });
    },
  },
];
