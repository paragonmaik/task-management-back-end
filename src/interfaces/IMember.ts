export interface IMember {
	userName: string;
	email: string;
	role: 'member' | 'owner';
	_id?: string;
}
