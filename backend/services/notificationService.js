const admin = require("firebase-admin");

const sendNotification = async (token, title, message) => {
    const res = await admin.messaging().sendEachForMulticast({
        tokens: token,
        notification: {
            title: title,
            body: message,
        }
    });
    if (res.failureCount > 0) {
        console.log(res.responses[0].error);
        return false;
    }
    return true;
};

module.exports = {
    sendNotification
};

