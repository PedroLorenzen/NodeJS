import bcrypt from "bcrypt";

const saltRounds = 14;
const plaintextPassword = "Hunter123";
const passwordHash =
  "$2b$14$0lPQTl8OvU/PEoUkxfH9M./lv..pm24PrPZm/uiGIkaCcOTqYOdXi";

await bcrypt.hash(plaintextPassword, saltRounds);
await bcrypt.compare(plaintextPassword, passwordHash);
