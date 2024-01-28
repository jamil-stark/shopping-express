import { AuthenticationDTO } from "../dto/response/authentication.dto";
import { UserDTO } from "../dto/response/user.dto";
import { JWT } from "../security/jwt";
export class UserResponse {
    async createUserDTOAndRespond(res, status, message, user) {
    const authenticationDTO = new AuthenticationDTO();
    const userDTO = new UserDTO();
    userDTO.username = user.username;
    userDTO.fullname = user.fullname;
    userDTO.email = user.email;
    userDTO.role = user.role;
    userDTO.dateCreated = user.dateCreated;

    authenticationDTO.status = status;
    authenticationDTO.token = await JWT.generateToken(user);
    authenticationDTO.message = message;
    authenticationDTO.data = userDTO;

    res.status(status).json(authenticationDTO);
}
}