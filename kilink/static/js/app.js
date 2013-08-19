var app = angular.module("linkode", []);
var linkode_id = '';
var current_revno = '';
var node_list = '';

app.config(function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {templateUrl: 'static/html/_new.html', controller:'newCtrl'}).
        when('/about', {templateUrl: 'static/html/_about.html'}).
        when('/tools', {templateUrl: 'static/html/_tools.html'}).
        otherwise({redirectTo: '/'});
});

app.controller('newCtrl', function($http, $scope){
    $scope.button_text = 'Create linkode';
    $scope.content = '';
    $scope.text_type = '';
    $scope.node_list = '';
    $scope.tree_info = '';

    $scope.submit = function()
    {
        if(linkode_id == "" && current_revno == "")
        {
            $.ajax({
                type: "POST",
                async: true,
                url: "/api/1/linkodes/",
                data: { content: $scope.content, text_type: $scope.text_type }
            }).success(function(response){
                $scope.linkode_id = response['linkode_id'];
                $scope.revno = response['revno'];
                $scope.button_text = 'Save new version';
                $scope.get_tree();
                linkode_id = response['linkode_id'];
                current_revno = response['revno'];
                console.log($scope.content);
                $scope.$apply();
            });
        }
        else
        {
            $.ajax({
                type: "POST",
                async: true,
                url: "/api/1/linkodes/"+$scope.linkode_id,
                data: { content: $scope.content, text_type: $scope.text_type, parent: $scope.revno }
            }).success(function(response){
                $scope.revno = response['revno'];
                $scope.get_tree();
                current_revno = response['revno'];
                console.log($scope.content);
                $scope.$apply();
            });
        }
    }

    $scope.get_tree = function()
    {
        $.ajax({
            type: "GET",
            async: true,
            url: "/api/1/linkodes/"+$scope.linkode_id+"/"+$scope.revno+"/tree"
        }).success(function(response){
            $scope.node_list = response;
            $scope.tree_info = $scope.node_list.tree_info;
            node_list = $scope.tree_info;
            $scope.$apply();
        });
    }
});
