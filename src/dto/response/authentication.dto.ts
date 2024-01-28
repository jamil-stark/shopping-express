import { UserDTO } from "./user.dto";

export class AuthenticationDTO {
    status: number;
    token: string;
    refreshToken: string;
    message: string;
    data: UserDTO;    
}