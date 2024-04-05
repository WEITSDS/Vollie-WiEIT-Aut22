import { setCompleteShift } from "./api/userApi";

const timers: { [id: string]: NodeJS.Timeout } = {};

export default class Timer {
    private userId: string;
    private shiftId: string;
    private shiftEnd: Date;

    constructor(userId: string, shiftId: string, shiftEnd: Date) {
        this.userId = userId;
        this.shiftId = shiftId;
        this.shiftEnd = shiftEnd;
    }

    public start() {
        const id = JSON.stringify({ userId: this.userId, shiftId: this.shiftId });

        if (!timers[id]) {
            timers[id] = setInterval(() => {
                if (new Date() > new Date(this.shiftEnd)) {
                    clearInterval(timers[id]);
                    delete timers[id];
                    void this.handleShiftComplete();
                }
            }, 60000);
        }
    }

    private handleShiftComplete = async () => {
        try {
            await setCompleteShift(this.userId, this.shiftId, "complete"); // update database
        } catch (error) {
            console.log(error);
        }
    };

    public stop() {
        //
    }
}
