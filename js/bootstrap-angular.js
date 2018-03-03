(function() {

customDirectives = angular.module('customDirectives', []);
customDirectives.directive('customTabs', function () {
    return {
        restrict: 'A',
        template: '\
            <ul class="nav nav-tabs">\
              <li class="active"><a href="#{{contentBaseId}}-1" data-toggle="tab">Tab 1</a></li>\
              <li><a href="#{{contentBaseId}}-2" data-toggle="tab">Tab 2</a></li>\
              <li><a href="#{{contentBaseId}}-3" data-toggle="tab">Tab 3</a></li>\
              <li><a href="#{{contentBaseId}}-4" data-toggle="tab">Tab 4</a></li>\
            </ul>\
            <div class="tab-content">\
              <div class="tab-pane active" id="{{contentBaseId}}-1">Tab 1 sample content</div>\
              <div class="tab-pane" id="{{contentBaseId}}-2">Tab 2 sample content</div>\
              <div class="tab-pane" id="{{contentBaseId}}-3">Tab 3 sample content</div>\
              <div class="tab-pane" id="{{contentBaseId}}-4">Tab 4 sample content</div>\
            </div>',
        link: function(scope, el, attrs){
            scope.contentBaseId = attrs.tabsBaseId;
        }
    };
});

angular.module('CustomComponents', ['customDirectives']);

})();