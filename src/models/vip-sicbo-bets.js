import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    big: { type: Number, default: 0 },
    small: { type: Number, default: 0 },
    odd: { type: Number, default: 0 },
    even: { type: Number, default: 0 },
    "1point": { type: Number, default: 0 },
    "2points": { type: Number, default: 0 },
    "3points": { type: Number, default: 0 },
    "4points": { type: Number, default: 0 },
    "5points": { type: Number, default: 0 },
    "6points": { type: Number, default: 0 },

    thanhtoan: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    memberId: { type: Number },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
});

const bets = mongoose.model("VipSicBo_cuoc", schema);
const tmpBets = mongoose.model("VipSicBo_tmpcuoc", schema);

export { bets, tmpBets };
