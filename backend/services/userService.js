const transformUserForResponse = (user) => {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role[0],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

}
module.exports = {
    transformUserForResponse,
}