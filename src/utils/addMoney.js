const User = require('../models/User');

module.exports = async (id, amt) => {
    const query = {
        userId: id.toString(),
    };
    let user = await User.findOne(query);

    if (!user) {
        return "nah";
    };

    user.balance += amt;
    await user.save();

    console.log(user)
}
