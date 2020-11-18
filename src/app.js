import { Table } from "sc-game-base";

import appConfigs from "./app-configs";
import { Bot, GameCron } from "./crons";
import gameSettings from "./game-settings";
import { DiceRandom } from "./helpers";
import { bets, tmpBets } from "./models/vip-sicbo-bets";
import VipSicboRounds from "./models/vip-sicbo-rounds";
import Startup from "./startup";

const generateResult = () => {
    const result = DiceRandom.random();

    return result;
};

const settlementRuleEntries = Object.entries({
    odd: (result) => result % 2 === 1,
    even: (result) => result % 2 === 0,
    big: (result) => result > 3,
    small: (result) => result <= 3,
    "1point": (result) => result === 1,
    "2points": (result) => result === 2,
    "3points": (result) => result === 3,
    "4points": (result) => result === 4,
    "5points": (result) => result === 5,
    "6points": (result) => result === 6,
});

const getSettlementResult = (roundResult) => {
    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(roundResult);

        return result;
    }, {});
};

const run = async () => {
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);

    const definition = new Table.TableGameDefinition(
        gameSettings,
        generateResult,
        getSettlementResult,
        VipSicboRounds,
        bets,
        tmpBets,
        null
    );

    const gameCron = new GameCron(definition, gameData, new Bot(definition, gameData));
    const startup = new Startup(appConfigs, definition, gameData, gameCron);
    const app = new Table.TableGameApp(appConfigs, definition, gameData, startup);

    await app.run();
};

run();
