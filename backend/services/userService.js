const transformUserForResponse = (user) => {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role[0],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    personalInfo: {
      fullName: user.personalInfo.fullName,
      dateOfBirth: user.personalInfo.dateOfBirth,
      address: user.personalInfo.address,
    },
    profilePicture: user.profilePicture,
    isActive: user.isActive,
  };
};
module.exports = {
  transformUserForResponse,
};
