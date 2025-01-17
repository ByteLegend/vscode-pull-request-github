/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react';
import { PullRequest } from '../common/cache';

import { AddComment, CommentView } from '../components/comment';
import { Header } from '../components/header';
import { Timeline } from '../components/timeline';

export const Overview = (pr: PullRequest) => (
	<>
		<div id="title" className="title">
			<div className="details">
				<Header {...pr} />
			</div>
		</div>
		{/* <Sidebar {...pr} /> */}
		<div id="main">
			<div id="description">
				<CommentView isPRDescription {...pr} />
			</div>
			<Timeline events={pr.events} />
			{/* <StatusChecksSection pr={pr} isSimple={false} /> */}
			<AddComment {...pr} />
		</div>
	</>
);
