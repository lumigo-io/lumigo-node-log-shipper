import { STS } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError } from "aws-sdk/lib/error";

export async function assumeRole(
	accountId: string
): Promise<PromiseResult<STS.Types.AssumeRoleResponse, AWSError>> {
	let sts = new STS();
	return await sts
		.assumeRole({
			RoleArn: `arn:aws:iam::${accountId}:role/CustomerLogsWriteRole`,
			RoleSessionName: "AssumeCrossAccountRole",
			DurationSeconds: 900
		})
		.promise();
}
