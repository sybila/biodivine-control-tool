/** Object for managing counters in the stats of the controllable and the phenotype editors. */
class CountWidget {
    constructor(widget, startCount = 0) {
        this.statWidget = widget;
        this.count = startCount;
    }

    /** Update data shown in the countWidget. */
    updateCount() {
        this.statWidget.textContent = this.count;
    }

    /** Increments this.count and updates it if update is set to true. */
    increment() {
        this.count += 1;
    }

    /** Decrements this.count and updates it if update is set to true. */
    decrement() {
        this.count -= 1;
    }

    /** Resets countWidget and count to 0. */
    clear() {
        this.count = 0;
        this.updateCount();
    }
}