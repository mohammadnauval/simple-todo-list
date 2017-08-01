"use-strict";

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	StatusBar,
	TextInput,
	ScrollView,
	TouchableOpacity,
	AsyncStorage,
} from 'react-native';
import Activity from './Activity';

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			todo: [],					// array of uncompleted activities.
			todoArrayIsEmpty: true,
			completed: [],				// array of completed activities.
			completedArrayIsEmpty: true,
			activity: '',				// stocking text written in text field to be inserted into one of two arrays above.
		}
	}

	async componentDidMount() {
		try {
			value = await AsyncStorage.getItem("todo");
			if (value !== null) {
				parsedTodo = JSON.parse(value);
				this.setState({todo: parsedTodo});
				if (this.state.todo.length != 0) {
					this.setState({todoArrayIsEmpty: false});
				}
			}			
		} catch (error) {
		}

		try {
			value = await AsyncStorage.getItem("completed");
			if (value !== null) {
				parsedtodo = JSON.parse(value);
				this.setState({completed: parsedtodo});
				if (this.state.completed.length != 0) {
					this.setState({completedArrayIsEmpty: false});
				}
			}
		} catch (error) {
		}
	}

	async updateTodoDataStorage() {
		try {
			await AsyncStorage.setItem("todo", JSON.stringify(this.state.todo));
		} catch (error) {
		}
	}

	async updateCompletedDataStorage() {
		try {
			await AsyncStorage.setItem("completed", JSON.stringify(this.state.completed));
		} catch (error) {
		}
	}

	newActivityButtonPressed() {
		activity = this.state.activity;
		this.setState({activity: ''});
		this.addActivity("todo", activity);
	}

  	addActivity(target, activity) {
  		if (target == "todo") {
  			this.state.todo.unshift({'task': activity});
  			this.setState({todo: this.state.todo});
  			this.updateTodoDataStorage();
  			if (this.state.todo.length == 1) {
  				this.state.todoArrayIsEmpty = false;
  			}
  		} else if (target == "completed") {
  			this.state.completed.unshift({'task': activity});
  			this.setState({completed: this.state.completed});
  			this.updateCompletedDataStorage();
  			if (this.state.completed.length == 1) {
  				this.state.completedArrayIsEmpty = false;
  			}
  		}
  	}

  	deleteActivity(source, activityKey) {
  		console.log("test");
  		if (source == "todo") {
  			this.state.todo.splice(activityKey, 1);
  			this.setState({todo: this.state.todo});
  			this.updateTodoDataStorage();
  			if (this.state.todo.length == 0) {
  				this.setState({todoArrayIsEmpty: true});
  			}
  		} else if (source == "completed") {
  			this.state.completed.splice(activityKey, 1);
  			this.setState({completed: this.state.completed});
  			this.updateCompletedDataStorage();
  			if (this.state.completed.length == 0) {
  				this.setState({completedArrayIsEmpty: true});
  			}
  		}
  	}

  	completeItem(activityKey) {
  		var task = this.state.todo[activityKey].task;
  		this.deleteActivity("todo", activityKey);
  		this.addActivity("completed", task);
  	}

  	uncompleteItem(activityKey) {
  		var task = this.state.completed[activityKey].task;
  		this.deleteActivity("completed", activityKey);
  		this.addActivity("todo", task);
  	}

  	checkActivityButtonPressed(source, activityKey) {
  		if (source == 'todo') {
  			this.completeItem(activityKey);
  		} else {
  			this.uncompleteItem(activityKey);
  		}
  	}

  	render() {
  		let todo = this.state.todo.map((val, key) => {
  			return ( 
	  			<Activity
	  				completed={false} 
	  				key={key} 
	  				keyval={key} 
	  				value={val} 
	  				deleteActivityMethod={() => this.deleteActivity("todo", key)} 
	  				checkActivityMethod={() => this.checkActivityButtonPressed("todo", key)} 
				/>
			);
  		});

  		let completed = this.state.completed.map((val, key) => {
  			return (
  				<Activity 
					completed={true} 
					key={key} 
					keyval={key} 
					value={val} 
					deleteActivityMethod={() => this.deleteActivity("completed", key)} 
					checkActivityMethod={() => this.checkActivityButtonPressed("completed", key)} 
				/>
			);
  		});

    	return (
      		<View style={styles.container}>
      			<StatusBar barStyle="default" />
        		
        		<View style={styles.header}>
        			<TextInput onChangeText={(text) => this.setState({activity: text})} style={styles.textInput} value={this.state.activity}
        				placeholder='Enter a new activity' placeholderTextColor='white'>

        			</TextInput>
        			<TouchableOpacity onPress={() => this.newActivityButtonPressed()} style={styles.addButton}>
						<Text style={styles.addButtonText}>+</Text>
					</TouchableOpacity>
        		</View>

        		<ScrollView style={styles.scrollContainer}>
        			<View style={styles.todo}>
        				{this.state.todoArrayIsEmpty ? <Text style={styles.message}>You have no uncompleted tasks.</Text> : todo}
        			</View>
        			<View style={styles.completed}>
        				{this.state.completedArrayIsEmpty ? <Text style={styles.message}>You have not completed a task yet.</Text>: completed}
        			</View>
        		</ScrollView>
				
      		</View>
   		);
  	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 64,
		flex: 1,
		backgroundColor: '#eff2f7',
	},
	header: {
		backgroundColor: '#ef47ec',
		borderRadius: 5,
		height: 60,
		paddingTop: 10,
		paddingRight: 5,
		paddingBottom: 10,
		paddingLeft: 5,
	},
	textInput: {
		height: 40,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
		borderTopRightRadius: 20,
		borderBottomRightRadius: 20,
		paddingLeft: 5,
		paddingRight: 40,
	},
	addButton: {
		height: 40,
		width: 40,
		borderRadius: 40,
		position: 'absolute',
		right: 5,
		top: 10,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 10,
	},
	addButtonText: {
		height: 20,
	},
	scrollContainer: {
		flex: 1,
		padding: 10,
	},
	todo: {
		borderBottomColor: 'black',
		borderBottomWidth: 0.3,
	},
	completed: {
		marginTop: 5,
	},
	message: {
		textAlign: 'center',
		marginBottom: 5,
	}
});

