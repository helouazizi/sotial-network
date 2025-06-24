"use client"

import { createContext } from "react"
import { User } from "../types/user"

export const UserContext = createContext<User | null>(null)

export default function UserProvider() {

}