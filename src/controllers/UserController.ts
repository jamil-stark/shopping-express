import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RegisterDTO } from "../dto/request/register.dto";
import { User } from "../entity/User";
import { PasswordHash } from "../security/passwordHash";
import { AuthenticationDTO } from "../dto/response/authentication.dto";
import { UserDTO } from "../dto/response/user.dto";
import { JWT } from "../security/jwt";

export class UserController {
  async register(req: Request, res: Response) {
    const userRepositoy = AppDataSource.getRepository(User);
    const body: RegisterDTO = req.body;
    if (!body.username || !body.password || !body.fullname || !body.email) {
        res.status(400).json({ message: "Please provide all required fields" });
        return;
      }
      if (await userRepositoy.findOneBy({ username: body.username })) {
        res.status(400).json({ message: "User already exists" });
        return;
      } else if (await userRepositoy.findOneBy({ email: body.email })) {
        res.status(400).json({ message: "Email already exists" });
        return;
      } else {
        const user = new User();
        user.username = body.username;
        user.fullname = body.fullname;
        user.email = body.email;
        user.password = await PasswordHash.hashPassword(body.password);
        user.role = "user";
        await userRepositoy.save(user);
        const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
        const userDTO = new UserDTO();
        userDTO.username = user.username;
        userDTO.fullname = user.fullname;
        userDTO.email = user.email;
        userDTO.role = user.role;
        userDTO.dateCreated = user.dateCreated;

        authenticationDTO.status = 201;
        authenticationDTO.token = await JWT.generateToken(user);
        authenticationDTO.message = "User Created Successfully!";
        authenticationDTO.data = userDTO;
        res.status(201).json(authenticationDTO);
        }
    }
}
        // res.send("Hello World");
