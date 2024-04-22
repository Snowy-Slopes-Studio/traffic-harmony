class EventListener {
    constructor() {
        this.eventslistened = {};
    }

    /**
     * Add an event listener
     * @param {string} event name of the event
     * @param {function} callback function to be called when the event is dispatched
     */
    addEventListener(event, callback) {
        if (!this.eventslistened[event]) {
            this.eventslistened[event] = [];
        }
        this.eventslistened[event].push(callback);
    }

    /**
     * Dispatch an event
     * @param {string} event name of the event
     */
    dispatchEvent(event) {
        if (this.eventslistened[event]) {
            this.eventslistened[event].forEach(callback => callback());
        }
    }

    /**
     * Remove an event listener
     * @param {string} event name of the event
     */
    removeEventListener(event) {
        delete this.eventslistened[event];
    }
}

export { EventListener };