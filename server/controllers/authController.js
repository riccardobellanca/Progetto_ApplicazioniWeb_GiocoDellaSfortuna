import { createUser, rejectIfFindUserByUsername } from "../dao/UserDAO.js";
import passport from "../auth/passport-config.js";

export const register = async (req) => {
  const { username, password } = req.body;
  try {
    await rejectIfFindUserByUsername(username);
    const result = await createUser(username, password);
    const user = {
      userId: result.userId,
      username: result.username,
    };

    await new Promise((resolve, reject) => {
      req.login(user, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return {
      success: true,
      data: user,
    };
  } catch (err) {
    return {
      success: false,
      data: err,
    };
  }
};

export const login = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return reject(err);
      if (!user)
        return resolve({ success: false, data: { code: 401, message: info } });

      req.login(user, (err) => {
        if (err) {
          return resolve({
            success: false,
            data: { code: 500, message: "Impossibile effettuare il login" },
          });
        }
        return resolve({ success: true, data: req.user });
      });
    })(req, res, next);
  });
};
