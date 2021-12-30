/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Repository } from '../api/api';
import { AuthProvider } from '../github/credentials';
import { getEnterpriseUri } from '../github/utils';
import { Protocol } from './protocol';

export interface IRemote {
	readonly remoteName: string;
	readonly url: string;
	readonly gitProtocol: Protocol;
	readonly host: string;
	readonly owner: string;
	readonly repositoryName: string;
	readonly normalizedHost: string;
	readonly authProviderId: AuthProvider;
	equals(remote: IRemote): boolean;
}

export class Remote implements IRemote {
	public get host(): string {
		return this.gitProtocol.host;
	}
	public get owner(): string {
		return this.gitProtocol.owner;
	}
	public get repositoryName(): string {
		return this.gitProtocol.repositoryName;
	}

	public get normalizedHost(): string {
		const normalizedUri = this.gitProtocol.normalizeUri();
		return `${normalizedUri!.scheme}://${normalizedUri!.authority}`;
	}

	public get authProviderId(): AuthProvider {
		return this.host === getEnterpriseUri()?.authority ? AuthProvider['github-enterprise'] : AuthProvider.github;
	}

	constructor(
		public readonly remoteName: string,
		public readonly url: string,
		public readonly gitProtocol: Protocol,
	) {}

	equals(remote: Remote): boolean {
		if (this.remoteName !== remote.remoteName) {
			return false;
		}
		if (this.host !== remote.host) {
			return false;
		}
		if (this.owner !== remote.owner) {
			return false;
		}
		if (this.repositoryName !== remote.repositoryName) {
			return false;
		}

		return true;
	}
}

export function parseRemote(remoteName: string, url: string, originalProtocol?: Protocol): Remote | null {
	if (!url) {
		return null;
	}
	const gitProtocol = new Protocol(url);
	if (originalProtocol) {
		gitProtocol.update({
			type: originalProtocol.type,
		});
	}

	if (gitProtocol.host) {
		return new Remote(remoteName, url, gitProtocol);
	}

	return null;
}

export function parseRepositoryRemotes(repository: Repository): Remote[] {
	const remotes: Remote[] = [];
	for (const r of repository.state.remotes) {
		const urls: string[] =[];
		if (r.fetchUrl) {
			urls.push(r.fetchUrl);
		}
		if (r.pushUrl && r.pushUrl !== r.fetchUrl) {
			urls.push(r.pushUrl);
		}
		urls.forEach(url => {
			const remote = parseRemote(r.name, url);
			if (remote) {
				remotes.push(remote);
			}
		});
	}
	return remotes;
}
