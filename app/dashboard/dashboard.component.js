
angular.
	module('dashboardModule').
	component('dashboard', {
		templateUrl: 'dashboard/dashboard.template.html',
		controller: DashboardController	
	});

function DashboardController($scope,$http) {
	var self = this;

	$scope.finished_loading = false;
	$scope.error_loading_page = false;
	$scope.message_list = [];
	self.editor_data = '';
	$scope.analysing_code = false;

	window.onbeforeunload = function () {		
		$scope.change_lang($scope.selected_lang)		
	};	

	$http.get(apiUrl + '/analyze/available-lang')
		.then( (resp) => {
			if ( resp.status == 200 ){				
				$scope.available_lang = resp.data.lang_list
				$scope.selected_lang = $scope.available_lang[0]
				$scope.finished_loading = true;
				$scope.change_lang($scope.selected_lang);
			}
			else{
				throw Error('API Error')
			}
		})
		.catch( (err) => {
			$scope.error_loading_page = true;
			console.log("Error Occured fetching language list", err)
		})

	$scope.change_lang = function(lang,overwrite = false){

		var temp = { 
			[$scope.selected_lang] : {
				editor_data : self.editor_data,
				message_list : $scope.message_list 
			}
		}

		var data = localStorage.getItem('code');		
		try{
			data = JSON.parse(data)
			if ( !data ){
				throw Error()
			}
		}catch{
			data = {}
			self.editor_data = ''
		}		
		
		if ( lang != $scope.selected_lang || overwrite ){
			data = Object.assign(data,temp)
		}				

		if ( data[lang] ){
			self.editor_data = data[lang]['editor_data']
			$scope.message_list = data[lang]['message_list']
		}else{
			self.editor_data = ''
		}

		localStorage.setItem('code',JSON.stringify(data))
		
		$scope.selected_lang = lang;			

	}

	$scope.analyze_code = function(){		
		$scope.analysing_code = true;
		if ( self.editor_data && self.editor_data != '' ){
			
			let payload = {
				'data' : self.editor_data
			}			
			
			$http.post(apiUrl + '/analyze/' + $scope.selected_lang, payload)
				.then( (resp) => {					
					if ( resp.status == 200 ){
						$scope.message_list = resp.data.message
					}else{
						throw Error('Error analyzing code')
					}
					$scope.analysing_code = false;
					$scope.change_lang($scope.selected_lang,true)
				})
				.catch( (err) => {					
					$scope.analysing_code = false;
				})			
		}else{
			$scope.analysing_code = false;
		}		
	}
}