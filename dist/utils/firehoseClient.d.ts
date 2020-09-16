import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError } from "aws-sdk/lib/error";
export declare class FirehoseClient {
    private readonly streamName;
    private readonly accountId;
    private firehose?;
    constructor(streamName: string, accountId: string);
    private getFirehoseClient;
    putRecordsBatch(records: any): Promise<number>;
    validFirehoseEvent(event: any): boolean;
    pushToFirehose(records: any, streamName: any): Promise<PromiseResult<AWS.Firehose.Types.PutRecordBatchOutput, AWSError>>;
    convertToFirehoseEvents(events: any[]): any[];
    handleRetryItems(allRecords: any[], retryItems: any[]): any[];
    parseFirehoseProblematicRecords(records: any[]): any[];
}
