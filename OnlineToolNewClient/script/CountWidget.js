class CountWidget {
    constructor(widget, startCount = 0) {
        this.statWidget = widget;
        this.count = startCount;
    }

    // Update data shown in the countWidget.
    updateCount() {
        this.statWidget.textContent = this.count;
    }

    // Increments this.count and updates it if update is set to true.
    increment(update = true) {
        this.count += 1;

        if (update) {
            this.updateCount();
        }
    }

    // Decrements this.count and updates it if update is set to true.
    decrement(update = true) {
        this.count -= 1;

        if (update) {
            this.updateCount();
        }
    }

    // Resets countWidget and count to 0. 
    clear() {
        this.count = 0;
        this.updateCount();
    }
}