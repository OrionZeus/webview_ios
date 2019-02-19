_$define("earn/server/data/guessingConstant", function (require, exports, module){
"use strict";
/**
 * 竞猜活动常量配置
 */

Object.defineProperty(exports, "__esModule", { value: true });
// 主场队编号
exports.HOST_TEAM_NUM = 1;
// 客场队编号
exports.GUEST_TEAM_NUM = 2;
// 比赛结果
exports.RESULT_NOT_EXIST = 0;
exports.RESULT_TEAM1_WIN = 1;
exports.RESULT_TEAM2_WIN = 2;
exports.COMPETITION_HAS_CANCLED = 3;
// 结算状态
exports.NOT_SETTLE_YET = 0;
exports.GUESSING_IS_SETTLING = 1;
exports.GUESSING_HAS_SETTLED = 2;
// 支付状态
exports.NOT_PAY_YET = 0;
exports.IS_PAYING_NOW = 1;
exports.BILL_ALREADY_PAY = 2;
// 单场竞猜最小投注
exports.EACH_GUESSING_MIN = 10; // 0.1ST
// 单场竞猜投注上限
exports.EACH_GUESSING_LIMIT = 1000; // 10ST
// 单场比赛总投注上限
exports.EACH_COMPETITION_LIMIT = 2000; // 20ST
// 初始奖池上限
exports.INIT_JACKPOTS_MAX = 5000; // 50ST
})