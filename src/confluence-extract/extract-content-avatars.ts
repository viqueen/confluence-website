/**
 * Copyright 2025 Hasnae Rehioui
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import { Output } from '../common';
import { Api, Content } from '../confluence-api';

const extractContentAvatars = async (
    confluence: Api,
    output: Output,
    content: Content
) => {
    const createdBy = content.history?.createdBy;
    if (!createdBy) return;
    const accountId = crypto
        .createHash('sha512')
        .update(createdBy.accountId)
        .digest('hex');
    const avatarFile = path.resolve(
        output.site.assets.avatars,
        `${accountId}-avatar`
    );
    if (fs.existsSync(avatarFile)) return;
    const { stream } = await confluence.getAttachmentData({
        prefix: '',
        targetUrl: createdBy.profilePicture.path
    });
    const file = fs.createWriteStream(avatarFile);
    stream.pipe(file);
    const symlink = path.resolve(output.site.assets.avatars, accountId);
    if (fs.existsSync(symlink)) return;
    fs.symlinkSync(avatarFile, symlink);
};

export { extractContentAvatars };
