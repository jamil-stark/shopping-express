import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RegisterDTO } from "../dto/request/register.dto";
import { GeneralDTO } from "../dto/response/general.tdo";
import { User } from "../entity/User";
import { PasswordHash } from "../security/passwordHash";
import { UserDTO } from "../dto/response/user.dto";
import { UserResponse } from "../utilities/userReponse";
import { LoginDTO } from "../dto/request/login.dto";
import { JWT } from "../security/jwt";
import { TokenBodyDto } from "../dto/request/tokenBody.dto";

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
      try {
        await userRepositoy.save(user);
        const userResponse = new UserResponse();
        await userResponse.loginAndCreateUserResponse(
          res,
          201,
          "User Created Successfully!",
          user
        );
        console.log("User created successfully!");
      } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async getAllUsers(req: Request, res: Response) {
    const userRepositoy = AppDataSource.getRepository(User);
    const users = await userRepositoy.find();
    const generalDTO: GeneralDTO = new GeneralDTO();
    generalDTO.status = 200;
    generalDTO.message = "Users Retrieved Successfully!";
    const userDTOs: UserDTO[] = [];
    users.forEach((user) => {
      const userDTO = new UserDTO();
      userDTO.username = user.username;
      userDTO.fullname = user.fullname;
      userDTO.email = user.email;
      userDTO.role = user.role;
      userDTO.dateCreated = user.dateCreated;
      userDTOs.push(userDTO);
    });
    generalDTO.data = userDTOs;
    res.status(200).json(generalDTO);
  }

  async login(req: Request, res: Response) {
    const userRepositoy = AppDataSource.getRepository(User);
    const body: LoginDTO = req.body;
    if (!body.username || !body.password) {
      res.status(400).json({ message: "Please provide all required fields" });
      console.log("Wrong fields");
      return;
    }
    const user = await userRepositoy.findOneBy({ username: body.username });
    if (!user) {
      res.status(400).json({ message: "Invalid Credentials!" });
      console.log("Invalid Credentials!");
      return;
    }
    if (!(await PasswordHash.comparePassword(body.password, user.password))) {
      res.status(400).json({ message: "Invalid Credentials!" });
      console.log("Invalid Credentials!");
      return;
    }
    const userResponse = new UserResponse();
    await userResponse.loginAndCreateUserResponse(
      res,
      200,
      "Login Successful!",
      user
    );
    console.log("Login Successful!");
  }

  async getUserByToken(req: Request, res: Response) {
    const body: TokenBodyDto = req.body;
    if (!body.token){
      res.status(400).json({ message: "Please provide all required fields" });
    }
    const user = await JWT.getUserByToken(body.token);
    if (!user) {
      res.status(400).json({ message: "Invalid Token!" });
      console.log("Invalid Token!");
      return;
    }
    const userResponse = new UserResponse();
    await userResponse.userResponse(res, 200, "User Retrieved Successfully!", user);
    console.log("User Retrieved Successfully!");
}
}