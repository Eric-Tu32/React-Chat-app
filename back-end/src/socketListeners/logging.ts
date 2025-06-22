import { Rooms, Users, Id_to_token } from "../dataBase"

export const db_status = () => {
    const room_len = Object.keys(Rooms).length
    const user_len = Object.keys(Users).length
    const token_mapping_len = Object.keys(Id_to_token).length
    console.log("DB_status")
    console.log("   - Total rooms: ", room_len)
    console.log("   - Total users (map align): ", user_len, user_len === token_mapping_len)
}