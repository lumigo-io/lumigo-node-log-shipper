import {AwsFirehoseClient, FirehoseDataForTesting} from "./firehoseMocker";

const noop = () => {};

export class AwsMocker {
    static applyMock = () => {
        jest.mock('aws-sdk', () => {
            return {
                Firehose: AwsFirehoseClient,
                config: {
                    update: noop
                }
            };
        });
    };
    static resetAll = () => {
        FirehoseDataForTesting.reset();
    }
}

