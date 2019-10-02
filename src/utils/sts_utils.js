const AWS = require("aws-sdk");

module.exports = {
	assumeRole: async function (accountId) {
		let sts = new AWS.STS();
		return new Promise(function(resolve, reject) {
			sts.assumeRole({
				RoleArn: `arn:aws:iam::${accountId}:role/CustomerLogsWriteRole`,
				RoleSessionName: "AssumeCrossAccountRole",
				DurationSeconds: 900,
			}, function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}
};