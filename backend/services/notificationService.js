const admin = require("firebase-admin");

const sendNotification = async (token, title, message) => {
    try {
        // Ensure token is an array
        const tokens = Array.isArray(token) ? token : [token];

        // Filter out any invalid tokens
        const validTokens = tokens.filter(t => t && typeof t === 'string' && t.length > 0);

        if (validTokens.length === 0) {
            console.log('No valid tokens provided');
            return false;
        }

        const messagePayload = {
            tokens: validTokens,
            notification: {
                title: title,
                body: message,
            },
            android: {
                priority: 'high',
            },
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                    },
                },
                headers: {
                    'apns-priority': '10',
                },
            },
        };

        const response = await admin.messaging().sendEachForMulticast(messagePayload);

        if (response.failureCount > 0) {
            console.error('Failed to send to some tokens:', response.responses);
            // Log details for each failure
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.error(`Failed to send to token ${validTokens[idx]}:`, resp.error);
                }
            });
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
};

module.exports = {
    sendNotification
};

