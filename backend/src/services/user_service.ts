import {list_users} from "../interfaces/user_interface";

const db = require('../database').promise();

export default class UserService {
    async getUsers(): Promise<list_users> {
        try {
            const [list_users] = await db.query('SELECT * FROM user');
            return list_users;
        } catch (err) {
            console.error(err);
            return err;
        }
    }
}
