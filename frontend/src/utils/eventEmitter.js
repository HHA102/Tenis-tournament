class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event to subscribe to
     * @param {Function} callback - Function to be called when event occurs
     * @returns {Function} - Function to unsubscribe from the event
     */
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);

        // Return unsubscribe function
        return () => {
            this.off(eventName, callback);
        };
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event to unsubscribe from
     * @param {Function} callback - Function to remove from event listeners
     */
    off(eventName, callback) {
        if (!this.events[eventName]) return;

        this.events[eventName] = this.events[eventName].filter(
            (cb) => cb !== callback
        );

        // Clean up empty event arrays
        if (this.events[eventName].length === 0) {
            delete this.events[eventName];
        }
    }

    /**
     * Emit an event with optional data
     * @param {string} eventName - Name of the event to emit
     * @param {*} data - Optional data to pass to event listeners
     */
    emit(eventName, data) {
        if (!this.events[eventName]) return;

        this.events[eventName].forEach((callback) => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${eventName}:`, error);
            }
        });
    }

    /**
     * Subscribe to an event once
     * @param {string} eventName - Name of the event to subscribe to
     * @param {Function} callback - Function to be called when event occurs
     */
    once(eventName, callback) {
        const onceCallback = (...args) => {
            callback(...args);
            this.off(eventName, onceCallback);
        };

        this.on(eventName, onceCallback);
    }

    /**
     * Remove all event listeners
     * @param {string} [eventName] - Optional event name to clear specific event
     */
    clear(eventName) {
        if (eventName) {
            delete this.events[eventName];
        } else {
            this.events = {};
        }
    }

    /**
     * Get all registered event names
     * @returns {string[]} Array of event names
     */
    eventNames() {
        return Object.keys(this.events);
    }

    /**
     * Get number of listeners for an event
     * @param {string} eventName - Name of the event
     * @returns {number} Number of listeners
     */
    listenerCount(eventName) {
        return this.events[eventName] ? this.events[eventName].length : 0;
    }
}

// Create a singleton instance
const eventEmitter = new EventEmitter();

export default eventEmitter; 