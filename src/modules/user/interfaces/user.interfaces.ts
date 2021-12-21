import { IUser } from "../models/user.model";

export type IDbName = {
    dbName:string;
}

type ITokenUser = Pick<IUser, "id" | "email">;

export type IUserTokenPayload = ITokenUser & IDbName;
