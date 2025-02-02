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
 * Internal dependencies
 */
import { Container } from './container';
import { Canvas } from './canvas';
import { GridView } from './gridView';
import { Carousel } from './carousel';
import { Library } from './library';
import { Inspector } from './inspector';
import { Header } from './header';
/**
 * The complete editor container, including library, canvas, inspector, etc.
 */
export class Editor extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get canvas() {
    return this._get(
      this.getByRole('region', { name: 'Canvas' }),
      'canvas',
      Canvas
    );
  }

  get titleBar() {
    return this._get(
      this.getByRole('group', { name: /^Story canvas header$/ }),
      'titleBar',
      Header
    );
  }

  get library() {
    return this._get(
      this.getByRole('region', { name: 'Library' }),
      'library',
      Library
    );
  }

  get inspector() {
    return this._get(
      this.getByRole('region', { name: 'Inspector' }),
      'inspector',
      Inspector
    );
  }

  get carousel() {
    return this._get(
      this.getByRole('region', { name: 'Page Carousel' }),
      'carousel',
      Carousel
    );
  }

  get gridView() {
    return this._get(
      this.getByRoleIn(this.node.ownerDocument, 'region', {
        name: 'Grid View',
      }),
      'gridView',
      GridView
    );
  }
}
