import { commands, Event, EventEmitter, Uri } from 'vscode';
import { APIState, PublishEvent } from '../@types/git';
import {
	API,
	Branch,
	BranchQuery,
	Change,
	Commit,
	CommitOptions,
	FetchOptions,
	IGit,
	InputBox,
	LogOptions,
	Ref,
	Remote,
	Repository,
	RepositoryState,
	RepositoryUIState,
	Submodule,
} from '../api/api';
import { ISessionState } from '../common/sessionState';
import { ITelemetry } from '../common/telemetry';
import { CredentialStore } from '../github/credentials';
import { GitHubRepository } from '../github/githubRepository';
import { PullRequestModel } from '../github/pullRequestModel';
import { ByteLegendRemote, getByteLegendRemote } from './remote';

let defaultByteLegendRemote: ByteLegendRemote;

export async function getDefaultByteLegendRemote(): Promise<ByteLegendRemote> {
	if (defaultByteLegendRemote) {
		return defaultByteLegendRemote;
	} else {
		const context: any = await commands.executeCommand('bytelegend.getContext');
		return await getByteLegendRemote(context.getOwner(), context.getRepo());
	}
}

export async function fetchPullRequestModel(
	htmlUrl: string, // https://github.com/owner/repo/pull/1
	credentialStore: CredentialStore,
	telemetry: ITelemetry,
	sessionState: ISessionState,
): Promise<PullRequestModel> {
	const ownerAndRepo = substringBeforeLast(substringAfter(htmlUrl, 'github.com/'), '/pull');
	const remote = await getByteLegendRemote(substringBeforeLast(ownerAndRepo, '/'), substringAfter(ownerAndRepo, '/'));
	const repo = new GitHubRepository(remote, credentialStore, telemetry, sessionState);
	return (await repo.getPullRequest(parseInt(substringAfterLast(htmlUrl, '/')))) as PullRequestModel;
}

export async function registerByteLegendGitProvider(gitApi: API) {
	const context: any = commands.executeCommand('bytelegend.getContext');
	gitApi.registerGitProvider(new ByteLegendGit(new ByteLegendGitRepository(await getDefaultByteLegendRemote())));
}

function substringBeforeLast(str: string, target: string) {
	const index = str.lastIndexOf(target);
	return index == -1 ? str : str.substring(0, index);
}

function substringAfterLast(str: string, target: string) {
	const index = str.lastIndexOf(target);
	return index == -1 ? str : str.substring(index + target.length);
}

function substringAfter(str: string, target: string) {
	const index = str.indexOf(target);
	return index == -1 ? str : str.substring(index + target.length);
}

class ByteLegendRepositoryState implements RepositoryState {
	HEAD: Branch | undefined;
	refs: Ref[];
	public get remotes(): Remote[] {
		return this._remotes;
	}
	submodules: Submodule[];
	rebaseCommit: Commit | undefined;
	mergeChanges: Change[];
	indexChanges: Change[];
	workingTreeChanges: Change[];
	private _onDidChange = new EventEmitter<void>();
	readonly onDidChange: Event<void> = this._onDidChange.event;

	constructor(private readonly _remotes: Remote[]) {}
}

class ByteLegendGitRepository implements Repository {
	inputBox: InputBox;
	rootUri: Uri;
	state: RepositoryState;
	ui: RepositoryUIState;

	constructor(remote: ByteLegendRemote) {
		this.state = new ByteLegendRepositoryState([remote]);
		this.rootUri = Uri.parse('github1s:/').with({
			authority: `${remote.owner}+${remote.repositoryName}+main`
		});
	}
	getConfigs(): Promise<{ key: string; value: string }[]> {
		console.trace(new Error());
		throw new Error('Method not implemented: getConfigs');
	}
	getConfig(key: string): Promise<string> {
		console.trace(new Error());
		throw new Error('Method not implemented: getConfig');
	}
	setConfig(key: string, value: string): Promise<string> {
		console.trace(new Error());
		throw new Error('Method not implemented: setConfig');
	}
	getGlobalConfig(key: string): Promise<string> {
		console.trace(new Error());
		throw new Error('Method not implemented: getGlobalConfig');
	}
	getObjectDetails(treeish: string, path: string): Promise<{ mode: string; object: string; size: number }> {
		console.trace(new Error());
		throw new Error('Method not implemented: getObjectDetails');
	}
	detectObjectType(object: string): Promise<{ mimetype: string; encoding?: string | undefined }> {
		console.trace(new Error());
		throw new Error('Method not implemented: detectObjectType');
	}
	buffer(ref: string, path: string): Promise<Buffer> {
		console.trace(new Error());
		throw new Error('Method not implemented: buffer');
	}
	show(ref: string, path: string): Promise<string> {
		console.trace(new Error());
		throw new Error('Method not implemented: show');
	}
	getCommit(ref: string): Promise<Commit> {
		console.trace(new Error());
		throw new Error('Method not implemented: getCommit');
	}
	clean(paths: string[]): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: clean');
	}
	apply(patch: string, reverse?: boolean): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: apply');
	}
	diff(cached?: boolean): Promise<string> {
		console.trace(new Error());
		throw new Error('Method not implemented: diff');
	}
	diffWithHEAD(): Promise<Change[]>;
	diffWithHEAD(path: string): Promise<string>;
	diffWithHEAD(path?: any): Promise<string> | Promise<import('../api/api').Change[]> {
		console.trace(new Error());
		throw new Error('Method not implemented: diffWithHEAD');
	}
	diffWith(ref: string): Promise<Change[]>;
	diffWith(ref: string, path: string): Promise<string>;
	diffWith(ref: any, path?: any): Promise<string> | Promise<import('../api/api').Change[]> {
		console.trace(new Error());
		throw new Error('Method not implemented: diffWith');
	}
	diffIndexWithHEAD(): Promise<Change[]>;
	diffIndexWithHEAD(path: string): Promise<string>;
	diffIndexWithHEAD(path?: any): Promise<string> | Promise<import('../api/api').Change[]> {
		console.trace(new Error());
		throw new Error('Method not implemented: diffIndexWithHEAD');
	}
	diffIndexWith(ref: string): Promise<Change[]>;
	diffIndexWith(ref: string, path: string): Promise<string>;
	diffIndexWith(ref: any, path?: any): Promise<string> | Promise<import('../api/api').Change[]> {
		console.trace(new Error());
		throw new Error('Method not implemented: diffIndexWith');
	}
	diffBlobs(object1: string, object2: string): Promise<string> {
		console.trace(new Error());
		throw new Error('Method not implemented: diffBlobs');
	}
	diffBetween(ref1: string, ref2: string): Promise<Change[]>;
	diffBetween(ref1: string, ref2: string, path: string): Promise<string>;
	diffBetween(ref1: any, ref2: any, path?: any): Promise<string> | Promise<import('../api/api').Change[]> {
		console.trace(new Error());
		throw new Error('Method not implemented: diffBetween');
	}
	hashObject(data: string): Promise<string> {
		console.trace(new Error());
		throw new Error('Method not implemented: hashObject');
	}
	createBranch(name: string, checkout: boolean, ref?: string): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: createBranch');
	}
	deleteBranch(name: string, force?: boolean): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: deleteBranch');
	}
	getBranch(name: string): Promise<Branch> {
		console.trace(new Error());
		throw new Error('Method not implemented: getBranch');
	}
	getBranches(query: BranchQuery): Promise<Ref[]> {
		console.trace(new Error());
		throw new Error('Method not implemented: getBranches');
	}
	setBranchUpstream(name: string, upstream: string): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: setBranchUpstream');
	}
	getMergeBase(ref1: string, ref2: string): Promise<string> {
		console.trace(new Error());
		throw new Error('Method not implemented: getMergeBase');
	}
	status(): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: status');
	}
	checkout(treeish: string): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: checkout');
	}
	addRemote(name: string, url: string): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: addRemote');
	}
	removeRemote(name: string): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: removeRemote');
	}
	renameRemote(name: string, newName: string): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: renameRemote');
	}
	fetch(options?: FetchOptions): Promise<void>;
	fetch(remote?: string, ref?: string, depth?: number): Promise<void>;
	fetch(remote?: any, ref?: any, depth?: any): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: fetch');
	}
	pull(unshallow?: boolean): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: pull');
	}
	push(remoteName?: string, branchName?: string, setUpstream?: boolean): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: push');
	}
	blame(path: string): Promise<string> {
		console.trace(new Error());
		throw new Error('Method not implemented: blame');
	}
	log(options?: LogOptions): Promise<Commit[]> {
		console.trace(new Error());
		throw new Error('Method not implemented: log');
	}
	commit(message: string, opts?: CommitOptions): Promise<void> {
		console.trace(new Error());
		throw new Error('Method not implemented: commit');
	}
}

class ByteLegendGit implements IGit {
	constructor(private readonly _repository: ByteLegendGitRepository) {}
	get repositories(): Repository[] {
		return [this._repository];
	}

	get state(): APIState {
		return 'initialized';
	}
	private _onDidOpenRepository = new EventEmitter<Repository>();
	readonly onDidOpenRepository: Event<Repository> = this._onDidOpenRepository.event;
	private _onDidCloseRepository = new EventEmitter<Repository>();
	readonly onDidCloseRepository: Event<Repository> = this._onDidCloseRepository.event;
	private _onDidChangeState = new EventEmitter<APIState>();
	readonly onDidChangeState: Event<APIState> = this._onDidChangeState.event;
	private _onDidPublish = new EventEmitter<PublishEvent>();
	readonly onDidPublish: Event<PublishEvent> = this._onDidPublish.event;
}
