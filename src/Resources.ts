/**
 * @author Arse09
 * @license MIT (LICENSE.md)
 */

export class Ticker {
    private _delta = 0;
    private _elapsed = 0;

    private startTime: number;
    private lastTime: number;

    constructor(startTime: number = performance.now()) {
        this.startTime = startTime;
        this.lastTime = startTime;
    }

    update(currentTime: number = performance.now()) {
        this._delta = (currentTime - this.lastTime) / 1000;
        this._elapsed = (currentTime - this.startTime) / 1000;
        this.lastTime = currentTime;
    }

    /**
     * @unit seconds
     */
    get delta() {
        return this._delta;
    }

    /**
     * @unit seconds
     */
    get elapsed() {
        return this._elapsed;
    }
}

export class Resources {
    [K: string]: any; 
    public readonly ticker: Ticker = new Ticker();
}
