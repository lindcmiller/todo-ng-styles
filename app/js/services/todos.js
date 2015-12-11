var todoApp = angular.module('todoApp');

todoApp.service('TodoService', function($http) {

  this.todos = [];

  this.loadTodos = function() {
    return $http.get('/api/v1/todos')
      .then(function(response) {
        return response.data.todos;
      }, function() {
        console.log("Cannot load to-dos.");
      });
  };

  this.addTodo = function(todo) {
    return $http.post('/api/v1/todos', {
      title: todo,
      is_completed: false
    }).catch(function(err) {
      console.log("Could not add this to-do.");
    });
  };

  this.updateTodo = function(todo) {
    return $http.put('/api/v1/todos/' + todo.id, todo)
    .catch(function(err) {
      console.log("Could not update this to-do.");
    });
  };

  this.deleteTodo = function(todo) {
    return $http.delete('/api/v1/todos/' + todo.id)
    .catch(function(err) {
      console.log("Could not delete to-do.");
    });
  };

});
