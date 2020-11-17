import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment-reworked";

const modelName = "VipSicbo_phien";

const settlementResultSchema = new mongoose.Schema(
    {
        big: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
        odd: { type: Boolean, default: false },
        even: { type: Boolean, default: false },
        "1point": { type: Boolean, default: false },
        "2points": { type: Boolean, default: false },
        "3points": { type: Boolean, default: false },
        "4points": { type: Boolean, default: false },
        "5points": { type: Boolean, default: false },
        "6points": { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    result: { type: Number },
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
});

Schema.plugin(autoIncrement.MongooseAutoIncrementID.plugin, { modelName, field: "id" });

export default mongoose.model(modelName, Schema);
