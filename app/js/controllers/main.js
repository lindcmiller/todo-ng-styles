'use strict';

var todoApp = angular.module("todoApp", []);

todoApp.controller('TodoController', function($scope, $http, $q) {

  $scope.todos = [];

  var loadTodos = function() {
    $http.get('/api/v1/todos')
      .then(function(response) {
        $scope.loaded = true;
        $scope.todos = response.data.todos;
      }, function() {
        console.log("Cannot load to-dos.");
      });
  };

  loadTodos();

  $scope.addTodo = function() {
    $http.post('/api/v1/todos', {
      title: $scope.todo,
      is_completed: false
    }).then(function(response) {
      $scope.todos.push(response.data.todo);
      $scope.todo = "";
    }, function(err) {
      console.log("Could not add this to-do.");
    });
  };

  $scope.editTodo = function(todo) {
    todo.editing = true;
  };

  $scope.updateTodo = function(todo) {
    todo.editing = false;
    $http.put('/api/v1/todos/' + todo.id, todo)
    .catch(function(err) {
      console.log("Could not update this to-do.");
    });
  };

// sort todos nav on bottom

// # of total todos
  $scope.getTotalTodos = function() {
    return $scope.todos.length;
  };

// all todos -- need all completed and incompleted

  $scope.showAllTodos = function() {
    return $scope.todos;
  };

// active todos
  $scope.showActive = function() {
    $scope.todos = $scope.todos.filter(function(todo) {
      loadTodos();
      return !todo.is_completed;
    });
  };

// completed todos
  $scope.showCompleted = function() {
    $scope.todos = $scope.todos.filter(function(todo) {
      return todo.is_completed;
    });
  };

// permanently clear completed todos = delete from api
  $scope.clearCompleted = function() {
    var completedTodos = [];
    for(var completedIndex = 0; completedIndex < $scope.todos.length; completedIndex++) {
      if ($scope.todos[completedIndex].is_completed){
        completedTodos.push($scope.todos[completedIndex]);
      }
    }

    var promises = completedTodos.map(function(todo) {
      return $http.delete('/api/v1/todos/' + todo.id)
        .catch(function(err) {
          console.log("Could not delete completed to-dos.");
        });
    });

    $q.all(promises)
    .then(loadTodos);

  }

});
