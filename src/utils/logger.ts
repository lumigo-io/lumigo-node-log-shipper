const LOG_PREFIX = "[LUMIGO]";
const isDebug = (): boolean => !!process.env.LUMIGO_DEBUG;

export const logDebug = (message: string, obj?: any): void => {
	if (isDebug()) {
		if (obj) {
			console.log(`${LOG_PREFIX} - ${message}`, obj);
		} else {
			console.log(`${LOG_PREFIX} - ${message}`, obj);
		}
	}
};
