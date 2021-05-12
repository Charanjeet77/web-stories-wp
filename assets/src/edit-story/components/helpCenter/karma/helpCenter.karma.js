/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { waitFor, within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';

describe('Help Center integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    // We're closing the help center in local storage in the fixture.
    // Here we want to restore the initial state of it, so expanding it before running tests.
    await fixture.events.click(fixture.editor.helpCenter.toggleButton);
    // we want to make sure the quick tips are visible before continuing.
    // eslint-disable-next-line jasmine/no-expect-in-setup-teardown
    waitFor(() => expect(fixture.editor.helpCenter.quickTips).toBeTruthy());
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Help Center default navigation', () => {
    it('should show Help Center by default for a new user with 8 unread tips', async () => {
      const { quickTips, toggleButton } = await fixture.editor.helpCenter;
      expect(quickTips).toBeDefined();

      expect(toggleButton).toHaveTextContent('Help8');
    });

    it('should navigate to the second tip on click and update unread count to 7', async () => {
      const { quickTips, toggleButton } = await fixture.editor.helpCenter;
      const { getByRole, getByText } = within(quickTips);

      const cropTip = getByRole('button', { name: 'Crop selected element' });

      await fixture.events.click(cropTip);

      const exposedCropTip = getByText(
        /^Double click any image or video element to enter edit mode/
      );
      expect(exposedCropTip).toBeDefined();

      waitFor(() => expect(toggleButton).toHaveTextContent('Help7'));
    });
  });

  describe('Help Center cursor interaction', () => {
    it('should toggle the Help Center closed and open again with cursor', async () => {
      const { quickTips, toggleButton } = fixture.editor.helpCenter;
      expect(quickTips).toBeDefined();

      await fixture.events.click(toggleButton);
      await fixture.events.sleep(300);
      expect(fixture.editor.helpCenter.quickTips).toBeNull();

      await fixture.events.click(toggleButton);
      await fixture.events.sleep(300);
      expect(fixture.editor.helpCenter.quickTips).toBeDefined();
    });

    it('should close the Help Center when the "close" button is clicked', async () => {
      const { getByRole } = within(fixture.editor.helpCenter.quickTips);

      const closeButton = getByRole('button', { name: /Close/ });
      expect(closeButton).toBeTruthy();
      await fixture.events.click(closeButton);
      await fixture.events.sleep(300);
      expect(fixture.editor.helpCenter.quickTips).toBeNull();
    });

    it('should update remaining unread tips as they are clicked through', async () => {
      const { quickTips, toggleButton } = fixture.editor.helpCenter;
      expect(toggleButton).toHaveTextContent('Help8');

      const { getByLabelText } = within(quickTips);

      const mainMenu = getByLabelText('Help Center Main Menu');
      expect(mainMenu).toBeTruthy();

      const { queryAllByRole } = within(mainMenu);

      const tips = queryAllByRole('button');

      await fixture.events.click(tips[0]);

      // click through all tips
      waitFor(() => {
        expect(toggleButton).toHaveTextContent('Help7');
      });

      const nextButton = fixture.screen.getByRole('button', { name: /^Next$/ });
      expect(nextButton).toBeTruthy();

      await fixture.events.click(nextButton);
      waitFor(() => {
        expect(toggleButton).toHaveTextContent('Help6');
      });

      await fixture.events.click(nextButton);
      waitFor(() => {
        expect(toggleButton).toHaveTextContent('Help5');
      });

      await fixture.events.click(nextButton);
      waitFor(() => {
        expect(toggleButton).toHaveTextContent('Help4');
      });

      await fixture.events.click(nextButton);
      waitFor(() => {
        expect(toggleButton).toHaveTextContent('Help3');
      });

      await fixture.events.click(nextButton);
      waitFor(() => {
        expect(toggleButton).toHaveTextContent('Help2');
      });

      await fixture.events.click(nextButton);
      waitFor(() => {
        expect(nextButton.getAttribute('disabled')).toBeNull();
        expect(toggleButton).toHaveTextContent('Help1');
      });

      await fixture.events.click(nextButton);
      waitFor(() => {
        expect(toggleButton).toHaveTextContent('Help');
      });

      await fixture.events.click(nextButton);

      // disabled is null before this, we're just seeing it's present.
      waitFor(() => expect(nextButton.getAttribute('disabled')).toBe(''));

      // now that we have gone through all the tips we should see a "done" screen
      expect(
        fixture.screen.getByText(/^You’re caught up with quick tips/)
      ).toBeDefined();
    });
  });

  describe('Help Center keyboard interaction', () => {
    it('should toggle the Help Center closed and open again with keyboard', async () => {
      const { quickTips, toggleButton } = fixture.editor.helpCenter;
      expect(quickTips).toBeDefined();

      await fixture.events.focus(toggleButton);
      await fixture.events.keyboard.press('Enter');
      await fixture.events.sleep(300);
      expect(fixture.editor.helpCenter.quickTips).toBeNull();

      await fixture.events.keyboard.press('Enter');
      await fixture.events.sleep(300);
      expect(fixture.editor.helpCenter.quickTips).toBeDefined();
    });

    it('should close the Help Center when pressing enter on the "close" button', async () => {
      const { getByRole } = within(fixture.editor.helpCenter.quickTips);

      const closeButton = getByRole('button', { name: /Close/ });
      expect(closeButton).toBeTruthy();
      await fixture.events.focus(closeButton);
      await fixture.events.keyboard.press('Enter');
      await fixture.events.sleep(300);
      expect(fixture.editor.helpCenter.quickTips).toBeNull();
    });

    it('should navigate quick tips with tab and enter', async () => {
      const { quickTips, toggleButton } = fixture.editor.helpCenter;
      expect(quickTips).toBeDefined();
      const { getByLabelText, getByText } = within(quickTips);

      const mainMenu = getByLabelText('Help Center Main Menu');
      expect(mainMenu).toBeTruthy();

      const { queryAllByRole } = within(mainMenu);

      const tips = queryAllByRole('button');
      // confirm that there are 8 buttons present in this section
      expect(tips.length).toBe(8);

      await fixture.events.focus(tips[0]);
      // confirm our starting spot is accurate
      expect(document.activeElement).toBe(tips[0]);
      // tab to the third item
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      expect(document.activeElement).toBe(tips[2]);

      await fixture.events.keyboard.press('Enter');

      const exposedCropTip = getByText(
        /^Select a shape from the Shape menu to create a frame/
      );
      expect(exposedCropTip).toBeDefined();
      expect(toggleButton).toHaveTextContent('Help7');
    });
  });
});
