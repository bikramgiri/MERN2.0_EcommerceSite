import User from "./database/models/userModel";
import bcrypt from "bcrypt";

const adminSeeder = async () => {
  // Your seeding logic here
  const [data] = await User.findAll({
    where: {
      role: "admin",
    },
  });
  if (!data) {
    await User.create({
      username: "admin",
      email: "admin@gmail.com",
      password: await bcrypt.hash("adminpassword", 8),
      role: "admin",
    });
      console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
};

export default adminSeeder;
