import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class Helper {
  public static async getUserEntityById(id: number) {
    try {
      const userRepositoy = AppDataSource.getRepository(User);
      const user = await userRepositoy.findOneBy({ id: id });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("Error during getting user:", error);
    }
  }
}
