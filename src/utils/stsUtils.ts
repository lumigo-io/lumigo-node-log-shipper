import { STS } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError } from "aws-sdk/lib/error";

export async function assumeRole(
	targetAccountId: string,
	targetEnv: string
): Promise<PromiseResult<STS.Types.AssumeRoleResponse, AWSError>> {
	let sts = new STS();
	return await sts
		.assumeRole({
			RoleArn: `arn:aws:iam::${targetAccountId}:role/${targetEnv}-CustomerLogsWriteRole`,
			RoleSessionName: "AssumeCrossAccountRole",
			DurationSeconds: 900
		})
		.promise();
}
