import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";
import { v4 as uuidv4 } from "uuid";
import * as moment from "moment";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";

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

  public static async verifyToken(req: Request, res: Response) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized Missing Token" });
      return;
    }
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET);
      const userRepositoy = AppDataSource.getRepository(User);
      const user = await userRepositoy.findOneBy({ id: decoded["id"] });
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      req.body.user = user;
      console.log(req.body);
      return true;
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
  }
  

  public static async getUserByToken(token: string) {
    try{
    const decoded = jwt.verify(token, this.JWT_SECRET);
    const userRepositoy = AppDataSource.getRepository(User);
    const user = await userRepositoy.findOneBy({ id: decoded["id"] });
    if (!user) {
      return null;
    }
    return user;
  }catch (error) {
    return null;
}
  }
}
