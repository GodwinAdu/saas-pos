"use server"

import { cookies } from "next/headers";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { fetchUser } from "../actions/user.actions";

export async function currentUser() {
    try {
        const cookiesStore = await cookies();
        const tokenValue = cookiesStore.get("token");

        if (!tokenValue || !tokenValue.value) {
            return null;
        }

        const decode = jwt.verify(tokenValue.value, process.env.TOKEN_SECRET_KEY!);

        // Check if the token is of type JwtPayload
        if (!decode || typeof decode === "string") {
            return null;
        }

        const user = await fetchUser(decode.id);

        if (!user) {
            return null;
        }

        return user;

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return null;
        }

        console.error("Error decoding token", error);
        return null;
    }
}
