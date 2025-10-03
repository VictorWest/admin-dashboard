"use server"

let token: { userId: string, accessToken: string, expires_in: string } = { userId: "", accessToken: "", expires_in: "" }

export async function storeToken (userId: string, accessToken: string, expires_in: string) {
    token = { userId, accessToken, expires_in }
}

export async function getToken() { return token }