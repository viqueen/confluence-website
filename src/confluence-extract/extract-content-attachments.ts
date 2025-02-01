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
import fs from 'fs';
import path from 'path';

import { Output } from '../common';
import { toExtension } from '../common/helpers';
import { Api, Content } from '../confluence-api';

const extractContentAttachments = (
    confluence: Api,
    output: Output,
    content: Content
): Promise<void[]> => {
    const attachments = content.children?.attachment?.results ?? [];
    return Promise.all(
        attachments.map(async (attachment) => {
            return confluence
                .getAttachmentData({
                    prefix: '/wiki',
                    targetUrl: attachment._links.download
                })
                .then(({ stream }) => {
                    const fileExtension = toExtension(
                        attachment.extensions.mediaType
                    );
                    const filePath = path.resolve(
                        output.site.attachments,
                        `${attachment.extensions.fileId}.${fileExtension}`
                    );
                    if (fileExtension !== '') {
                        const symlink = path.resolve(
                            output.site.attachments,
                            attachment.extensions.fileId
                        );
                        if (!fs.existsSync(symlink)) {
                            fs.symlinkSync(filePath, symlink);
                        }
                    }
                    const file = fs.createWriteStream(filePath);
                    return stream.pipe(file);
                })
                .catch(console.error);
        })
    );
};

export { extractContentAttachments };
