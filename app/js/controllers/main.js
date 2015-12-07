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
    for(var index = 0; index < $scope.todos.length; index++) {
      if($scope.todos[index].editing == true) {
        $scope.todos[index].editing = false;
      }
    }
    todo.editing = true;
  };

  $scope.updateTodo = function(todo) {
    todo.editing = false;
    $http.put('/api/v1/todos/' + todo.id, todo)
    .catch(function(err) {
      console.log("Could not update this to-do.");
    });
  };

  $scope.deleteTodo = function(todo) {
    $http.delete('/api/v1/todos/' + todo.id)
      .catch(function(err) {
        console.log("Could not delete this to-do.");
      });
    loadTodos();
  };

// sort todos nav on bottom

// # of total remaining todos
  $scope.getTotalIncompleteTodos = function() {
    var incompleteTodos = [];
    for(var incompleteIndex = 0; incompleteIndex < $scope.todos.length; incompleteIndex++) {
      if ($scope.todos[incompleteIndex].is_completed-true){
        incompleteTodos.push($scope.todos[incompleteIndex]);
      }
    }
    return incompleteTodos.length;
  };

// add style for selected sort
//
  $scope.selectedFilter = "All";

  $scope.selectSort = function(filter) {
    $scope.selectedFilter = filter;

  };

// all todos -- both complete and incomplete

  $scope.showAllTodos = function() {
    loadTodos();
    return $scope.todos;
  };

// active todos
  $scope.showActive = function() {
    $http.get('/api/v1/todos')
      .then(function(response) {
        $scope.loaded = true;
        $scope.todos = response.data.todos;
        $scope.todos = $scope.todos.filter(function(todo) {
          return !todo.is_completed;
      }, function() {
        console.log("Cannot load to-dos.");
      });
    });
  };

// completed todos
  $scope.showCompleted = function() {
    $http.get('/api/v1/todos')
      .then(function(response) {
        $scope.loaded = true;
        $scope.todos = response.data.todos;
        $scope.todos = $scope.todos.filter(function(todo) {
          return todo.is_completed;
      }, function() {
        console.log("Cannot load to-dos.");
      });
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

  };

// keep item completed upon page refresh

  $scope.markCompleted = function(todo) {
    todo.is_completed = true;
    $http.put('/api/v1/todos/' + todo.id, todo)
      .catch(function(err) {
        console.log("Could not mark this to-do complete.");
    });
  };

// keep item incomplete upon page refresh

  $scope.markIncomplete = function(todo) {
    todo.is_completed = false;
    $http.put('/api/v1/todos/' + todo.id, todo)
      .catch(function(err) {
        console.log("Could not mark this to-do incomplete.");
    });
  };

// mark all todos complete or incomplete by clicking carot character
  var allMarkedComplete = false;
  $scope.markAllTodos = function(todo) {
    $scope.todos.forEach(function(todo) {
      if(allMarkedComplete == false) {
        $scope.markCompleted(todo);
      } else {
        $scope.markIncomplete(todo);
      }
    });
    allMarkedComplete = !allMarkedComplete;
    loadTodos();
  };

});
