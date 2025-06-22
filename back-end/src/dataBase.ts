import { User, Room } from '@shared/types'

export var Rooms: Record<string, Room> = {};
export var Users: Record<string, User> = {};
export var Id_to_token: Record<string, string> = {};