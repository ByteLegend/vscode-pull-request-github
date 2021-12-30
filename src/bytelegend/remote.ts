import { Remote } from '../api/api';
import { Protocol } from '../common/protocol';
import { IRemote } from '../common/remote';
import { AuthProvider } from '../github/credentials';

export class ByteLegendRemote implements IRemote, Remote {
	public constructor(readonly owner: string, readonly repositoryName: string) {}
	public get name(): string {
		return `${this.owner}/${this.repositoryName}`;
	}
	fetchUrl?: string | undefined;
	pushUrl?: string | undefined;
	isReadOnly: boolean = true;
	public get remoteName(): string {
		return `${this.owner}/${this.repositoryName}`;
	}
	public get url(): string {
		return `https://github.com/${this.owner}/${this.repositoryName}`;
	}
	public get gitProtocol(): Protocol {
		return new Protocol(`https://github.com/${this.owner}/${this.repositoryName}.git`);
	}
	public get host(): string {
		return 'ghapi.bytelegend.com';
	}
	public get normalizedHost(): string {
		throw new Error('normalizedHost not implemented.');
	}
	public get authProviderId(): AuthProvider {
		return AuthProvider.github;
	}
	equals(remote: IRemote): boolean {
		return this.url === remote.url;
	}
}

export async function getByteLegendRemote(owner: string, repo: string): Promise<ByteLegendRemote> {
	return new ByteLegendRemote(owner, repo);
}
