import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";
import { v4 as uuidv4 } from "uuid";
import * as moment from "moment";
import { AppDataSource } from "../data-source";

export class JWT {
  private static JWT_SECRET = "705559333";
  public static async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    const jwtid = uuidv4();
    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: "1h",
      jwtid: jwtid,
      subject: user.username,
    });
    const refreshToken = await this.generateRefreshToken(user, jwtid);
    return { token, refreshToken };
  }

  private static async generateRefreshToken(user: User, jwtid: string) {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.jwtid = jwtid;
    refreshToken.expiryDate = moment().add(10, "d").toDate();
    const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    await refreshTokenRepository.save(refreshToken);
    return refreshToken.id;
  }
}
