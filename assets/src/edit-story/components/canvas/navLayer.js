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
 * External dependencies
 */
import { memo, useRef, useCallback } from 'react';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { ContextMenu } from '../../../design-system';
import { ALL_FOCUSABLE_SELECTOR } from '../../constants';
import { useQuickActions } from '../../app/highlights';
import DirectionAware from '../directionAware';
import Header from '../header';
import Carousel from '../carousel';
import {
  Layer,
  HeadArea,
  CarouselArea,
  Z_INDEX,
  QuickActionsArea,
} from './layout';

function NavLayer() {
  const carouselAreaRef = useRef(null);
  const headAreaRef = useRef(null);
  const enableQuickActionMenu = useFeature('enableQuickActionMenus');
  const quickActions = useQuickActions();

  const handleQuickMenuDismiss = useCallback(({ isAscending }) => {
    const nextAreaRef = isAscending ? headAreaRef : carouselAreaRef;
    const focusableChildren = nextAreaRef.current?.querySelectorAll(
      ALL_FOCUSABLE_SELECTOR
    );
    const nextFocusableChildIndex = isAscending
      ? focusableChildren?.length - 1
      : 0;
    focusableChildren?.[nextFocusableChildIndex]?.focus();
  }, []);

  return (
    <Layer
      pointerEvents="none"
      zIndex={Z_INDEX.NAV}
      onMouseDown={(evt) => evt.stopPropagation()}
    >
      <HeadArea pointerEvents="initial" ref={headAreaRef}>
        <Header />
      </HeadArea>
      {enableQuickActionMenu && quickActions.length && (
        <DirectionAware>
          <QuickActionsArea>
            <ContextMenu
              isAlwaysVisible
              isIconMenu
              items={quickActions}
              onDismiss={handleQuickMenuDismiss}
            />
          </QuickActionsArea>
        </DirectionAware>
      )}
      <CarouselArea pointerEvents="initial" ref={carouselAreaRef}>
        <Carousel />
      </CarouselArea>
    </Layer>
  );
}

export default memo(NavLayer);
