const showNotification = (title, message) => {
    new Notification(title, {
        body: message
    });
};

export default showNotification;
