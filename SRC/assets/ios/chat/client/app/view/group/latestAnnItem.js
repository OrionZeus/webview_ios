_$define("chat/client/app/view/group/latestAnnItem", function (require, exports, module){
"use strict";
/**
 * 群聊天最近群公告项
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
// ================================================ 导入
var event_1 = require("../../../../../pi/widget/event");
var widget_1 = require("../../../../../pi/widget/widget");
var message_s_1 = require("../../../../server/data/db/message.s");
var logger_1 = require("../../../../utils/logger");
var util_1 = require("../../../../utils/util");
var store = require("../../data/store");
var WIDGET_NAME = module.id.replace(/\//g, '-');
var logger = new logger_1.Logger(WIDGET_NAME);

var LatestAnnounceItem = function (_widget_1$Widget) {
    _inherits(LatestAnnounceItem, _widget_1$Widget);

    function LatestAnnounceItem() {
        _classCallCheck(this, LatestAnnounceItem);

        var _this = _possibleConstructorReturn(this, (LatestAnnounceItem.__proto__ || Object.getPrototypeOf(LatestAnnounceItem)).apply(this, arguments));

        _this.props = {
            gid: null,
            aIncId: '',
            announce: null,
            noticeTitle: ''
        };
        return _this;
    }

    _createClass(LatestAnnounceItem, [{
        key: "setProps",
        value: function setProps(props) {
            _get(LatestAnnounceItem.prototype.__proto__ || Object.getPrototypeOf(LatestAnnounceItem.prototype), "setProps", this).call(this, props);
            this.props.announce = store.getStore("announceHistoryMap/" + this.props.aIncId, new message_s_1.Announcement());
            if (this.props.announce.msg) {
                var notice = util_1.depCopy(this.props.announce.msg);
                this.props.noticeTitle = JSON.parse(notice).title;
            }
        }
    }, {
        key: "firstPaint",
        value: function firstPaint() {
            var _this2 = this;

            _get(LatestAnnounceItem.prototype.__proto__ || Object.getPrototypeOf(LatestAnnounceItem.prototype), "firstPaint", this).call(this);
            // 当公告消息撤回 更新map
            store.register("announceHistoryMap", function () {
                _this2.setProps(_this2.props);
                _this2.paint();
            });
        }
        // 关闭公告

    }, {
        key: "closeAnnounce",
        value: function closeAnnounce(e) {
            event_1.notify(e.node, 'ev-close-announce', {});
        }
    }]);

    return LatestAnnounceItem;
}(widget_1.Widget);

exports.LatestAnnounceItem = LatestAnnounceItem;
})