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
import { expect, browser } from '@wdio/globals';

describe('Confluence Website', () => {
    const setup = async () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'browser'.
        await browser.setWindowSize(1600, 1200);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'browser'.
        await browser.url('http://localhost:3000/');
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'browser'.
        await browser.waitUntil(
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'browser'.
            async () => (await browser.getTitle()) === '/website - Git',
            {
                timeout: 5000,
                timeoutMsg: 'expected title to be different after 5s'
            }
        );
    };
    it('should save some screenshots', async () => {
        await setup();
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'browser'.
        await browser.saveScreen('home-page');
    });

    it('should compare successfully with a baseline', async () => {
        await setup();
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'browser'.
        const result = await browser.checkScreen('home-page', {
            rawMisMatchPercentage: 5,
            ignoreAntialiasing: true
        });
        expect(result).toEqual(0);
    });
});
