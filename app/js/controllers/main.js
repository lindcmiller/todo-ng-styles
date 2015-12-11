var todoApp = angular.module('todoApp');

todoApp.controller('TodosController', function($scope, $q, TodoService) {

  $scope.todos = [];

  var loadTodos = function() {
    TodoService.loadTodos()
      .then(function(todos) {
        $scope.loaded = true;
        $scope.todos = todos;
      });
  };

  loadTodos();

  $scope.editTodo = function(todo) {
    for(var index = 0; index < $scope.todos.length; index++) {
      if($scope.todos[index].editing == true) {
        $scope.todos[index].editing = false;
      }
    }
    todo.editing = true;
  };

  $scope.updateTodo = function(todo) {
    TodoService.updateTodo(todo)
      .then(function() {
        todo.editing = false;
        loadTodos();
      });
  };

  $scope.addTodo = function() {
    TodoService.addTodo($scope.todo)
    .then(function() {
      $scope.todo = "";
      loadTodos();
    });

  };

  $scope.deleteTodo = function(todo) {
    TodoService.deleteTodo(todo)
      .then(function() {
        loadTodos();
      });
  };

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

// sort todos nav on bottom

$scope.getTodos = function() {
  if($scope.selectedFilter == 'All') {
    return $scope.todos;
  } else if($scope.selectedFilter == 'Active') {
    return $scope.todos.filter(function(todo) {
      return !todo.is_completed;
    });
  } else if($scope.selectedFilter == 'Completed') {
    return $scope.todos.filter(function(todo) {
      return todo.is_completed;
    });
  }
};

// add border for selected filter

  $scope.selectedFilter = "All";
  $scope.selectSort = function(filter) {
    $scope.selectedFilter = filter;
  };

// change completion status

$scope.markCompleted = function(todo) {
  todo.is_completed = true;
  TodoService.updateTodo(todo);
};

$scope.markIncomplete = function(todo) {
  todo.is_completed = false;
  TodoService.updateTodo(todo);
};

// create array to hold all completed todos


// function createCompletedTodosArray() {
//   var completeTodos = [];
//   for(var completeIndex = 0; completeIndex < $scope.todos.length; completeIndex++) {
//     if ($scope.todos[completeIndex].is_completed-false){
//       completeTodos.push($scope.todos[completeIndex]);
//     }
//   }
// };

// counter for show/hide of the 'clear completed' button

$scope.getTotalCompleteTodos = function() {
  var completeTodos = [];
  for(var completeIndex = 0; completeIndex < $scope.todos.length; completeIndex++) {
    if ($scope.todos[completeIndex].is_completed-false){
      completeTodos.push($scope.todos[completeIndex]);
    }
  }
  return completeTodos.length;
};

$scope.clearCompleted = function() {
  var completeTodos = [];
  for(var completeIndex = 0; completeIndex < $scope.todos.length; completeIndex++) {
    if ($scope.todos[completeIndex].is_completed-false){
      completeTodos.push($scope.todos[completeIndex]);
    }
  }
  
  var promises = completeTodos.map(function(todo) {
    TodoService.deleteTodo(todo);
  });

  $q.all(promises)
  .then(loadTodos());

};

// mark all todos complete or incomplete by clicking carot character
//
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
    TodoService.loadTodos();
  };

});
