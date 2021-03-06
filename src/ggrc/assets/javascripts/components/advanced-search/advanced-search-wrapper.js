/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

import StateUtils from '../../plugins/utils/state-utils';

(function (can, GGRC) {
  'use strict';

  GGRC.Components('advancedSearchWrapper', {
    tag: 'advanced-search-wrapper',
    viewModel: can.Map.extend({
      define: {
        hasStatusFilter: {
          get: function () {
            return StateUtils.hasFilter(this.attr('modelName'));
          }
        }
      },
      modelName: null,
      modelDisplayName: null,
      filterItems: [],
      mappingItems: [],
      statusItem: GGRC.Utils.AdvancedSearch.create.state(),
      relevantTo: [],
      availableAttributes: function () {
        var available = GGRC.Utils.TreeView.getColumnsForModel(
          this.attr('modelName'),
          null,
          true
        ).available;
        return available;
      },
      addFilterAttribute: function () {
        var items = this.attr('filterItems');
        if (items.length) {
          items.push(GGRC.Utils.AdvancedSearch.create.operator('AND'));
        }
        items.push(GGRC.Utils.AdvancedSearch.create.attribute());
      },
      addMappingFilter: function () {
        var items = this.attr('mappingItems');
        if (items.length) {
          items.push(GGRC.Utils.AdvancedSearch.create.operator('AND'));
        }
        items.push(GGRC.Utils.AdvancedSearch.create.mappingCriteria());
      },
      resetFilters: function () {
        this.attr('filterItems', []);
        this.attr('mappingItems', []);
        this.attr('statusItem.value', {});
      }
    }),
    events: {
      '{viewModel} modelName': function () {
        this.viewModel.resetFilters();
      }
    }
  });
})(window.can, window.GGRC);
