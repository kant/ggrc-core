/* !
  Copyright (C) 2017 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import {exportGroup as Component, exportPanel} from '../export';

describe('GGRC.Components.exportGroup', function () {
  'use strict';

  describe('events', function () {
    describe('inserted() method', function () {
      var method;  // the method under test
      var that;

      beforeEach(function () {
        that = {
          addPanel: jasmine.createSpy()
        };
        method = Component.prototype.events.inserted.bind(that);
      });
      it('calls addPanel with proper arguments', function () {
        method();
        expect(that.addPanel).toHaveBeenCalledWith(jasmine.objectContaining({
          type: 'Program',
          isSnapshots: undefined
        }));
      });
    });
    describe('addPanel() method', function () {
      var method;  // the method under test
      var data;
      var viewModel;

      beforeEach(function () {
        viewModel = new can.Map({
          _index: 0,
          panels: {
            items: []
          }
        });
        method = Component.prototype.events.addPanel.bind({
          viewModel: viewModel
        });
      });
      it('adds panel with "Program" type if data.type is undefined',
        function () {
          data = {};
          method(data);
          expect(viewModel.attr('panels.items')[0].type).toEqual('Program');
        });
      it('adds panel with type from data if it is defined',
        function () {
          data = {type: 'Audit'};
          method(data);
          expect(viewModel.attr('panels.items')[0].type).toEqual('Audit');
        });
      it('adds panel with snapshot_type equal to data.type and' +
      ' type equal to "Snapshot" if it is snapshot', function () {
        data = {
          type: 'Control',
          isSnapshots: 'true'
        };
        method(data);
        expect(viewModel.attr('panels.items')[0].type).toEqual('Snapshot');
        expect(viewModel.attr('panels.items')[0].snapshot_type)
          .toEqual('Control');
      });
    });
  });
});

describe('GGRC.Components.exportPanel', function () {
  'use strict';

  var viewModel;
  var modelAttributeDefenitions = {
    Assessment: [
      {
        display_name: 'Code',
        type: 'property',
        import_only: false,
      },
      {
        display_name: 'Title',
        type: 'unknowType',
      },
      {
        display_name: 'DisplayName',
        type: 'property',
        // should not be added
        import_only: true,
      },
      {
        display_name: 'map:risk versions',
        type: 'mapping',
      },
      {
        // should not be added
        display_name: 'unmap:vendor versions',
        type: 'mapping',
      },
      {
        display_name: 'LCA #1',
        type: 'object_custom',
      },
    ],
  };

  beforeAll(function () {
    viewModel = new (can.Map.extend(exportPanel.prototype.viewModel));
  });

  describe('refreshItems functions', function () {
    var refreshItemsFunction;

    beforeEach(function () {
      var panelModel = new can.Map({
        attributes: new can.List(),
        localAttributes: new can.List(),
        mappings: new can.List(),
        type: 'Assessment',
      });

      viewModel.attr('item', panelModel);
      refreshItemsFunction = viewModel.refreshItems
        .bind(viewModel);

      spyOn(viewModel, 'getModelAttributeDefenitions').and
        .returnValue(modelAttributeDefenitions[viewModel.attr('item.type')]);
    });

    it('refreshItems function should set item', function () {
      var mappingsItem;
      var attributesItem;

      refreshItemsFunction();

      mappingsItem = viewModel.attr('item.mappings')[0];
      attributesItem = viewModel.attr('item.attributes')[0];

      expect(viewModel.attr('item.mappings').length).toEqual(1);
      expect(viewModel.attr('item.attributes').length).toEqual(2);
      expect(viewModel.attr('item.localAttributes').length).toEqual(1);

      expect(mappingsItem.display_name).toEqual('map:risk versions');
      expect(attributesItem.display_name).toEqual('Code');
    });
  });

  describe('filterModelAttributes functions', function () {
    var filterModelAttributesFunc;

    beforeEach(function () {
      filterModelAttributesFunc = viewModel.filterModelAttributes
        .bind(viewModel);
    });

    it('filterModelAttributes should return TRUE', function () {
      var item = modelAttributeDefenitions.Assessment[0];
      var predicate = item.type !== 'mapping';

      expect(filterModelAttributesFunc(item, predicate))
        .toBe(true);
    });

    it('filterModelAttributes should return FALSE. Wrong predicate',
      function () {
        var item = modelAttributeDefenitions.Assessment[0];
        var predicate = item.type === 'mapping';

        expect(filterModelAttributesFunc(item, predicate))
          .toBe(false);
      }
    );

    it('filterModelAttributes should return FALSE. import_only is true',
      function () {
        var item = modelAttributeDefenitions.Assessment[2];
        var predicate = item.type === 'mapping';

        expect(filterModelAttributesFunc(item, predicate))
          .toBe(false);
      }
    );

    it('filterModelAttributes should return FALSE. unmapped item',
      function () {
        var item = modelAttributeDefenitions.Assessment[4];
        var predicate = item.type === 'mapping';

        expect(filterModelAttributesFunc(item, predicate))
          .toBe(false);
      }
    );
  });
});
