import {Firehose} from "aws-sdk";
import {int} from "aws-sdk/clients/datapipeline";

type FirehoseRequest = Firehose.Record[];

export class FirehoseDataForTesting {
    private static requests: FirehoseRequest[] = []
    private static pendingFailedRequests: number = 0

    static addRequest = (request: FirehoseRequest): void => {
        FirehoseDataForTesting.requests.push(request)
    }
    static getRequests = () => FirehoseDataForTesting.requests

    static reset = () => {
        FirehoseDataForTesting.requests = []
    }

    static failedForTheNext = (times: int): void => {
        FirehoseDataForTesting.pendingFailedRequests = times
    }

    static isFailInNextRequest = (): boolean => {
        if(FirehoseDataForTesting.pendingFailedRequests > 0) {
            FirehoseDataForTesting.pendingFailedRequests--;
            return true;
        }
        return false;
    }
}



export class AwsFirehoseClient {
    private static createFhResponse = (recordsCount: number, failed: boolean) => {
        let records = [];
        for(let i = 0; i < recordsCount; i++) {
            let record = {RecordId: i}
            if(failed) {
                record = {
                    ...record,
                    // @ts-ignore
                    ErrorCode: "ServiceUnavailableException",
                    ErrorMessage: "ServiceUnavailableException bla bla bla"
                }
            }
            records.push(record)
        }
        return {"FailedPutCount": failed ? records.length : 0, "RequestResponses": records}
    }
    putRecordBatch(params: Firehose.PutRecordBatchInput): any {
        FirehoseDataForTesting.addRequest(params.Records)
        const failed = FirehoseDataForTesting.isFailInNextRequest();
        return {
            promise: async () => {
                return AwsFirehoseClient.createFhResponse(params.Records.length, failed)
            }
        }
    }


}

