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
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listFiles } = require('@labset/fs-directory');

const sourcePath = path.resolve(process.cwd(), 'src');
const distPath = path.resolve(process.cwd(), 'dist');

listFiles(sourcePath, {
    fileFilter: (file) => file.name.endsWith('.css'),
    directoryFilter: () => true,
}).map((file) => {
    const dest = file.replaceAll(sourcePath, distPath);
    fs.copyFileSync(file, dest);
});
