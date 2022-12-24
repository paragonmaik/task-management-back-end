export class HttpException extends Error {
	public status: number;

	constructor(status: number, message: string) {
		if (typeof status !== 'number') {
			throw new Error(
				`Status in HttpException need to be a NUMBER instead of ${(typeof status).toUpperCase()}`
			);
		}

		if (typeof message !== 'string') {
			throw new Error(
				`Message in HttpException need to be a STRING instead of ${(typeof message).toUpperCase()}`
			);
		}

		super(message);
		this.status = status;
	}
}
