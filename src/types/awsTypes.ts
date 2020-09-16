export interface AwsLogEvent {
	id: string;
	timestamp: number;
	message: string;
}

export interface AwsLogSubscriptionEvent {
	messageType: string;
	owner: string;
	logGroup: string;
	logStream: string;
	subscriptionFilters: string[];
	logEvents: AwsLogEvent[];
}
