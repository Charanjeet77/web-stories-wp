/*
 * Copyright 2020 Google LLC
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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useRef } from 'react';

/**
 * Internal dependencies
 */
import {
  CardGrid,
  CardGridItem,
  CardTitle,
  CardPreviewContainer,
  ActionLabel,
  StoryMenu,
} from '../../../components';
import {
  StoriesPropType,
  StoryMenuPropType,
  UsersPropType,
  PageSizePropType,
  RenameStoryPropType,
  DateSettingsPropType,
} from '../../../types';
import { STORY_STATUS, STORY_CONTEXT_MENU_ACTIONS } from '../../../constants';
import { getRelativeDisplayDate } from '../../../utils';

export const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StoryGrid = styled(CardGrid)`
  width: ${({ theme }) =>
    `calc(100% - ${theme.standardViewContentGutter.desktop}px)`};

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    width: ${({ theme }) =>
      `calc(100% - ${theme.standardViewContentGutter.min}px)`};
  }
`;

const StoryGridView = ({
  stories,
  users,
  centerActionLabelByStatus,
  bottomActionLabel,
  isSavedTemplate,
  pageSize,
  storyMenu,
  renameStory,
  dateSettings,
  previewStory,
}) => {
  const gridRef = useRef();

  return (
    <StoryGrid
      pageSize={pageSize}
      ref={gridRef}
      ariaLabel={__('Grid view of stories', 'web-stories')}
    >
      {stories.map((story) => {
        const titleRenameProps = renameStory
          ? {
              editMode: renameStory?.id === story?.id,
              onEditComplete: (newTitle) =>
                renameStory?.handleOnRenameStory(story, newTitle),
              onEditCancel: renameStory?.handleCancelRename,
            }
          : {};

        const storyMenuItems = storyMenu.menuItems.map((menuItem) => {
          if (menuItem.value === STORY_CONTEXT_MENU_ACTIONS.OPEN_STORY_LINK) {
            return { ...menuItem, url: story.link };
          }
          return menuItem;
        });

        return (
          <CardGridItem
            key={story.id}
            data-testid={`story-grid-item-${story.id}`}
          >
            <CardPreviewContainer
              pageSize={pageSize}
              story={story}
              centerAction={{
                targetAction: (e) => previewStory(e, story),
                label: centerActionLabelByStatus[story.status],
              }}
              bottomAction={{
                targetAction: story.bottomTargetAction,
                label: bottomActionLabel,
              }}
              containerAction={(e) => previewStory(e, story)}
            />
            <DetailRow>
              <CardTitle
                title={story.title}
                titleLink={story.editStoryLink}
                status={story?.status}
                id={story.id}
                secondaryTitle={
                  isSavedTemplate
                    ? __('Google', 'web-stories')
                    : users[story.author]?.name
                }
                displayDate={
                  story?.status === STORY_STATUS.DRAFT
                    ? getRelativeDisplayDate(story?.modified, dateSettings)
                    : getRelativeDisplayDate(story?.created, dateSettings)
                }
                {...titleRenameProps}
              />

              <StoryMenu
                onMoreButtonSelected={storyMenu.handleMenuToggle}
                contextMenuId={storyMenu.contextMenuId}
                onMenuItemSelected={storyMenu.handleMenuItemSelected}
                story={story}
                menuItems={storyMenuItems}
              />
            </DetailRow>
          </CardGridItem>
        );
      })}
    </StoryGrid>
  );
};

StoryGridView.propTypes = {
  isTemplate: PropTypes.bool,
  isSavedTemplate: PropTypes.bool,
  stories: StoriesPropType,
  users: UsersPropType,
  centerActionLabelByStatus: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.string),
    PropTypes.bool,
  ]),
  bottomActionLabel: ActionLabel,
  pageSize: PageSizePropType.isRequired,
  previewStory: PropTypes.func,
  storyMenu: StoryMenuPropType,
  renameStory: RenameStoryPropType,
  dateSettings: DateSettingsPropType,
};

export default StoryGridView;
