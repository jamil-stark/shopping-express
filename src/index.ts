import { AppDataSource } from "./data-source";
import { RegisterDTO } from "./dto/request/register.dto";
import { User } from "./entity/User";
import * as express from "express";
import { Request, Response } from "express";
import { PasswordHash } from "./security/passwordHash";
import { AuthenticationDTO } from "./dto/response/authentication.dto";
import { UserDTO } from "./dto/response/user.dto";
import { JWT } from "./security/jwt";

const app = express();
const port = 4000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    const userRepositoy = AppDataSource.getRepository(User);

    app.post("/register", async (req: Request, res: Response) => {
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

        authenticationDTO.status = 201;
        authenticationDTO.token = await JWT.generateToken(user);
        authenticationDTO.message = "User registered successfully";
        authenticationDTO.data = userDTO;
        res.status(201).json(authenticationDTO);


      }
    });
  })
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server started on port ${port}`));
