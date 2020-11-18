import { helpers } from "sc-common";
import { Table } from "sc-game-base";

import constants from "../constants";

export default class Bot extends Table.TableGameBot {
    constructor(definition, gameData) {
        super(definition, gameData, null);

        this.betChoiceRatio = { MainOpts: 50, SubOpts: 30, rareOpts: 20 };

        this.mainOpts = ["big", "small"];
        this.subOpts = ["1point", "2points", "3points", "4points", "5points", "6points"];
        this.rareOpts = ["odd", "even"];

        this.smallTicketRatio = 70;
        this.smallTickets = 0;
        this.resetAllBets();
    }

    async resetAllBotData() {
        await super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {
            big: 0,
            small: 0,
            odd: 0,
            even: 0,
            "1point": 0,
            "2points": 0,
            "3points": 0,
            "4points": 0,
            "5points": 0,
            "6points": 0,
        };

        this.smallTickets = 0;
    }

    getBetChoice(bot) {
        const totalBotBet = this.getAllBetAmount();

        const betChoiceRatios = [
            {
                group: this.mainOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.mainOpts) * 100) / totalBotBet < this.betChoiceRatio.MainOpts,
            },
            {
                group: this.subOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.subOpts) * 100) / totalBotBet < this.betChoiceRatio.SubOpts,
            },
            {
                group: this.rareOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.rareOpts) * 100) / totalBotBet < this.betChoiceRatio.rareOpts,
            },
        ];

        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));

        const choice =
            underRatioGroups.length > 0
                ? this.getRandomChoiceFromGroup(underRatioGroups[0].group)
                : this.getRandomChoiceFromGroup(this.mainOpts);

        const previousUniqueChoices = bot.choices.filter((betChoice) => this.mainOpts.includes(betChoice));

        return previousUniqueChoices.length > 0 ? previousUniqueChoices[0] : choice;
    }

    getMaxBet(bot, choice) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const maxBetPerChoice = gameConfigs.choices_maxbet[choice];
        const botMaxBet = gameConfigs.bot_maxbet;
        let maxBet = Math.min(maxBetPerChoice, botMaxBet);

        const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
        const maxBetOfSmallTicket = Math.min(minBet * 50, botMaxBet * 0.3, maxBetPerChoice);
        maxBet = isSmallTicket ? maxBetOfSmallTicket : maxBet;

        return Math.max(maxBet, minBet);
    }

    getRandomChoiceFromGroup(group) {
        const randomIndex = (Math.random() * group.length) >> 0;
        return group[randomIndex];
    }

    getTotalAmountOnChoiceGroup(choices) {
        let total = 0;
        choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    getTotalAmountOfBotOnChoiceGroup(bot, choices) {
        let total = 0;
        choices.forEach((choice) => (total += bot.betOnChoices[choice]));

        return total;
    }

    getAllBetAmount() {
        let total = 0;
        this.definition.choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    isSmallTicket(amount) {
        return amount <= this.getMinBet() * 50;
    }

    updateBotInRoomData(bot, choice, amount, balance) {
        super.updateBotInRoomData(bot, choice, amount, balance);

        this.allBets[choice] = this.allBets[choice] ? this.allBets[choice] + amount : amount;
        this.smallTickets += this.isSmallTicket(amount) ? 1 : 0;
    }

    convertAmountToChip(amount) {
        const chipList = constants.chips.filter((chip) => amount % chip === 0);

        return chipList.length > 0 ? chipList[0] : this.getMinBet();
    }
}
