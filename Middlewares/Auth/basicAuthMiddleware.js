const User = require("../../Models/Auth/User");
const bcrypt = require("bcrypt");

async function validate(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).json({ message: "Brak dostępu." });
  }

  // Parsowanie headera Authorization
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  let user = await User.findOne({
    username: username,
  });

  if (!user) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(404).json({ error: "Użytkownik nie istnieje." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).json({ error: "Niepoprawne hasło." });
  } else {
    return next();
  }
}

module.exports = {
  validate,
};
