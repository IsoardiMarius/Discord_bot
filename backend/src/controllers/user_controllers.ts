import UserService from "../services/user_service";


exports.get_users = (req, res) => {
     new UserService().getUsers()
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            res.json(err.message);
        });
}