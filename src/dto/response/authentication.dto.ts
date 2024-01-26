import { UserDTO } from "./user.dto";

export class AuthenticationDTO {
    status: number;
    token: string;
    message: string;
    data: UserDTO;    
}