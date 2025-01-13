const User = require("../../Models/User");
const bcrypt = require("bcrypt");

async function register(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ error: "Niepoprawne request body." });
  }

  const { username, password } = req.body;

  if (await User.findOne({ username: username })) {
    return res.status(400).json({ error: "Użytkownik istnieje." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  let user = new User();
  user.username = username;
  user.password = hashedPassword;
  await user.save();
  return res.status(200).json({ message: "Użytkonik został dodany." });
}

module.exports = {
  register,
};
