'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
   .controller('MyCtrl1', [function() { }])

  .controller('MyCtrl2', [function() { }])

   .controller('LoginCtrl', ['$scope', 'loginService', function($scope, loginService) {
//      $scope.email = null;
//      $scope.pass = null;
//      $scope.confirm = null;
//      $scope.createMode = false;
      $scope.email = 'wulf@firebase.com';
      $scope.pass = '123';
      $scope.confirm = '123';
      $scope.createMode = true;

      $scope.login = function(callback) {
         $scope.err = null;
         loginService.login($scope.email, $scope.pass, '/account', function(err, user) {
            $scope.err = err||null;
            typeof(callback) === 'function' && callback(err, user);
         });
      };

      $scope.createAccount = function() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         else {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if( err ) {
                  console.log('err', err); //debug
                  $scope.err = err;
               }
               else {
                  console.log('logging in'); //debug
                  // must be logged in before I can write to my profile
                  $scope.login(function(err) {
                     if( !err ) {
                        console.log('logged in', err, user); //debug
                        loginService.createProfile(user.id, user.email);
                     }
                  });
               }
            });
         }
      };
   }])

   .controller('AccountCtrl', ['$scope', 'loginService', 'angularFire', 'FBURL', '$timeout', function($scope, loginService, angularFire, FBURL, $timeout) {

      angularFire(FBURL+'/users/'+$scope.auth.id, $scope, 'user', {});

      $scope.logout = function() {
         loginService.logout('/login');
      };

      $scope.oldpass = null;
      $scope.newpass = null;
      $scope.confirm = null;

      function reset() {
         $scope.err = null;
         $scope.msg = null;
      }

      $scope.updatePassword = function() {
         console.log('updating pass', $scope.auth); //debug
         reset();
         loginService.changePassword(buildPwdParms());
      };

      $scope.$watch('oldpass', reset);
      $scope.$watch('newpass', reset);
      $scope.$watch('confirm', reset);

      function buildPwdParms() {
         return {
            email: $scope.auth.email,
            oldpass: $scope.oldpass,
            newpass: $scope.newpass,
            confirm: $scope.confirm,
            callback: function(err) {
               console.log('updated', err); //debug
               if( err ) {
                  $scope.err = err;
               }
               else {
                  $scope.msg = 'Password updated!';
               }
            }
         }
      }

   }]);