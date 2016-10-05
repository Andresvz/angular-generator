
 angular.module('app', [])

.controller('AppCtrl', ['$scope', '$sce', function($scope, $sce) {
  $scope.general = {}
  $scope.fields = [];

  $scope.addField = () => {
    $scope.field.name = $scope.field.name.trim();
    $scope.fields.push($scope.field);
    $scope.field = { isReq : false };
    $scope.showFieldForm = false;
  };

  $scope.removeField = (idx) => { $scope.fields.splice(idx, 1) };

  $scope.generate = () => {
    let controllerCode = getControllerMarkup();
    let serviceCode = getServiceMarkup();
    let HTMLCode = getHTMLMarkup();

    $scope.controllerMarkup = $sce.trustAsHtml(
      Prism.highlight(controllerCode, Prism.languages.javascript)
    );
    $scope.serviceMarkup = $sce.trustAsHtml(
      Prism.highlight(serviceCode, Prism.languages.javascript)
    );
    $scope.HTMLMarkup = $sce.trustAsHtml(
      Prism.highlight(HTMLCode, Prism.languages.markup)
    );
  };

  function getHTMLMarkup(){
    const HTMLFields = $scope.fields.map((item) => {
      let input = '';
      if(item.type=='textarea') {
        input = `<textarea name="${item.name}" class="form-control" ng-model="${$scope.general.entityName}Data.${item.name}"${item.isReq ? ' required' : ''}></textarea>`;
      } else {
        input = ` <input type="${item.type}" name="${item.name}" class="form-control" ng-model="${$scope.general.entityName}Data.${item.name}"${item.isReq ? ' required' : ''}>`;
      }

      return `
       <div class="form-group">
         <label for="${item.name}" class="col-sm-2 control-label">${item.name}</label>
         <div class="col-sm-10">
           ${input}
         </div>
       </div>
      `; 
    }).join('');

    const code = `
    <form class="form-horizontal" name="${$scope.general.entityName}Form" novalidate>
      ${HTMLFields}
       <div class="form-group">
         <div class="col-sm-offset-2 col-sm-8">
           <button type="button" class="btn bg-red btn-flat" ng-click="cancel()"> 
            <i class="glyphicon glyphicon-ban-circle"></i> Cancel 
           </button>
           <button type="button" class="btn btn-success" ng-disabled="${$scope.general.entityName}Form.$invalid" ng-click="save()">
            <i class="glyphicon glyphicon-ok"></i> Save 
           </button>
         </div>
       </div>
     </form>
    `;
    return code;
  }

  function getControllerMarkup(){
    const moduleName = $scope.general.moduleName || 'app.'+$scope.general.entityName;
    let code = `
    angular.module('${moduleName}')
      .controller('${$scope.general.entityName}Ctrl', ['$scope', function($scope) {

       \t$scope.save = function (){
          ${$scope.general.entityName}Service.create($scope.${$scope.general.entityName}Data, function(response){
            console.log(response);
          });
        }

    }]);
    `;
    return code;
  }

  function getServiceMarkup(){
    const moduleName = $scope.general.moduleName || 'app.'+$scope.general.entityName;
    let code = `
    angular.module('${moduleName}')
      .service('${$scope.general.entityName}Service', ['$http', function($http) {
       \tthis.url = '${$scope.general.apiUrl}'; 

       \tthis.handleError = function(data){
          console.log(data);
        }

       \tthis.create = function(data, callback){
          return $http.post(this.url, data).then(callback, this.handleError){
        }
    }]);
      `;
      return code;
  }

}]);

    this.create= function(data, callback, errorCallback){
      return $http.post(this.url, data).then(callback, errorCallback);
    };
