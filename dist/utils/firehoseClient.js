"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirehoseClient = void 0;
var AWS = require("aws-sdk");
var REGION = process.env.AWS_REGION || "us-west-2";
var ALLOW_RETRY_ERROR_CODES = ["ServiceUnavailableException", "InternalFailure"];
var stsUtils = require("../utils/sts_utils");
var MAX_RETRY_COUNT = 3;
var MAX_ITEM_SIZE = 1048576;
var MAX_FIREHOSE_BATCH_SIZE = 250;
var FirehoseClient = (function () {
    function FirehoseClient(streamName, accountId) {
        this.streamName = streamName;
        this.accountId = accountId;
        AWS.config.update({ region: REGION });
    }
    FirehoseClient.prototype.getFirehoseClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stsResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, stsUtils.assumeRole(this.accountId)];
                    case 1:
                        stsResponse = _a.sent();
                        return [2, new AWS.Firehose({
                                "region": REGION,
                                "accessKeyId": stsResponse.Credentials.AccessKeyId,
                                "secretAccessKey": stsResponse.Credentials.SecretAccessKey,
                                "sessionToken": stsResponse.Credentials.SessionToken
                            })];
                }
            });
        });
    };
    FirehoseClient.prototype.putRecordsBatch = function (records) {
        return __awaiter(this, void 0, void 0, function () {
            var recordsToWrite, numberOfRecords, rawEvents, event, retryCounter, response, retryItems, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recordsToWrite = [];
                        numberOfRecords = 0;
                        rawEvents = records;
                        _a.label = 1;
                    case 1:
                        if (!(rawEvents.length > 0)) return [3, 9];
                        event = rawEvents.pop();
                        if (!this.validFirehoseEvent(event)) {
                            return [3, 1];
                        }
                        recordsToWrite.push(event);
                        if (!(rawEvents.length === 0 || recordsToWrite.length === MAX_FIREHOSE_BATCH_SIZE)) return [3, 8];
                        retryCounter = 0;
                        _a.label = 2;
                    case 2:
                        if (!(retryCounter < MAX_RETRY_COUNT)) return [3, 7];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4, this.pushToFirehose(this.convertToFirehoseEvents(recordsToWrite), this.streamName)];
                    case 4:
                        response = _a.sent();
                        numberOfRecords += recordsToWrite.length - response["FailedPutCount"];
                        if (response["FailedPutCount"] === 0) {
                            return [3, 7];
                        }
                        retryItems = this.parseFirehoseProblematicRecords(response["RequestResponses"]);
                        recordsToWrite = this.handleRetryItems(recordsToWrite, retryItems);
                        retryCounter++;
                        return [3, 6];
                    case 5:
                        ex_1 = _a.sent();
                        retryCounter++;
                        return [3, 6];
                    case 6: return [3, 2];
                    case 7:
                        recordsToWrite = [];
                        _a.label = 8;
                    case 8: return [3, 1];
                    case 9: return [2, numberOfRecords];
                }
            });
        });
    };
    FirehoseClient.prototype.validFirehoseEvent = function (event) {
        var eventSize = JSON.stringify(event).length;
        return eventSize < MAX_ITEM_SIZE;
    };
    FirehoseClient.prototype.pushToFirehose = function (records, streamName) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = {
                            DeliveryStreamName: streamName,
                            Records: records,
                        };
                        if (!!this.firehose) return [3, 2];
                        _a = this;
                        return [4, this.getFirehoseClient()];
                    case 1:
                        _a.firehose = _b.sent();
                        _b.label = 2;
                    case 2: return [4, this.firehose.putRecordBatch(params).promise()];
                    case 3: return [2, _b.sent()];
                }
            });
        });
    };
    FirehoseClient.prototype.convertToFirehoseEvents = function (events) {
        var firehoseRecords = [];
        events.forEach(function (event) {
            try {
                var eventAsString = JSON.stringify(event);
                if (eventAsString != null) {
                    eventAsString += ",";
                    firehoseRecords.push({ "Data": eventAsString });
                }
            }
            catch (ex) {
            }
        });
        return firehoseRecords;
    };
    FirehoseClient.prototype.handleRetryItems = function (allRecords, retryItems) {
        var retryBatch = [];
        retryItems.forEach(function (item) {
            retryBatch.push(allRecords[item]);
        });
        return retryBatch;
    };
    FirehoseClient.prototype.parseFirehoseProblematicRecords = function (records) {
        var retryItems = [];
        records.forEach(function (record, index) {
            if (record.hasOwnProperty("ErrorCode")) {
                if (ALLOW_RETRY_ERROR_CODES.includes(record["ErrorCode"])) {
                    retryItems.push(index);
                }
            }
        });
        return retryItems;
    };
    return FirehoseClient;
}());
exports.FirehoseClient = FirehoseClient;
//# sourceMappingURL=firehoseClient.js.map