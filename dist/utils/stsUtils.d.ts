import { STS } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError } from "aws-sdk/lib/error";
export declare function assumeRole(accountId: string): Promise<PromiseResult<STS.Types.AssumeRoleResponse, AWSError>>;
