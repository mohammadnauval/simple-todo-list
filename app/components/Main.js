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
import Item from './Item';
import Hr from 'react-native-hr';

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			todoItems: [],
			completedItems: [],
			itemText: '',
		}
	}

	async componentDidMount() {
		try {
			value = await AsyncStorage.getItem('todoItems');
			if (value !== null) {
				parsedTodoItems = JSON.parse(value);
				this.setState({todoItems: parsedTodoItems});
			}
		} catch (error) {
		}

		try {
			value = await AsyncStorage.getItem('completedItems');
			if (value !== null) {
				parsedTodoItems = JSON.parse(value);
				this.setState({completedItems: parsedTodoItems});
			}
		} catch (error) {
		}
	}

	async updateTodoItemsDataStorage() {
		try {
			await AsyncStorage.setItem('todoItems', JSON.stringify(this.state.todoItems));
		} catch (error) {
		}
	}

	async updateCompletedItemsDataStorage() {
		try {
			await AsyncStorage.setItem('completedItems', JSON.stringify(this.state.completedItems));
		} catch (error) {
		}
	}

  	addItem(target) {
  		if (target == 'todoItems') {
  			this.state.todoItems.unshift({'task': this.state.itemText});
  			this.setState({todoItems: this.state.todoItems});
  			this.setState({itemText: ''});
  			this.updateTodoItemsDataStorage();
  		} else if (target == 'completedItems') {
  			this.state.completedItems.unshift({'task': this.state.itemText});
  			this.setState({completedItems: this.state.completedItems});
  			this.setState({itemText: ''});
  			this.updateCompletedItemsDataStorage();
  		}
  	}

  	deleteItem(key, source) {
  		if (source == 'todoItems') {
  			this.state.todoItems.splice(key, 1);
  			this.setState({todoItems: this.state.todoItems});
  			this.updateTodoItemsDataStorage();
  		} else if (source == 'completedItems') {
  			this.state.completedItems.splice(key, 1);
  			this.setState({completedItems: this.state.completedItems});
  			this.updateCompletedItemsDataStorage();
  		}
  	}

  	checkItem(key, source) {
  		if (source == 'todoItems') {
  			this.completeItem(key);
  		} else {
  			this.uncompleteItem(key);
  		}
  	}

  	completeItem(key) {
  		var task = this.state.todoItems[key].task;
  		this.deleteItem(key, "todoItems");
  		this.state.completedItems.unshift({'task': task});
  		this.setState({completedItems: this.state.completedItems});
  		this.updateTodoItemsDataStorage();
  		this.updateCompletedItemsDataStorage();
  	}

  	uncompleteItem(key) {
  		var task = this.state.completedItems[key].task;
  		this.deleteItem(key, "completedItems")
  		this.state.todoItems.unshift({'task': task});
  		this.setState({todoItems: this.state.todoItems});
  		this.updateTodoItemsDataStorage();
  		this.updateCompletedItemsDataStorage();
  	}

  	render() {
  		let todoItems = this.state.todoItems.map((val, key) => {
  			return <Item completed={false} key={key} keyval={key} value={val} deleteItemMethod={() => this.deleteItem(key, 'todoItems')} checkItemMethod={() => this.checkItem(key, "todoItems")}/>
  		});

  		let completedItems = this.state.completedItems.map((val, key) => {
  			return <Item completed={true} key={key} keyval={key} value={val} deleteItemMethod={() => this.deleteItem(key, 'completedItems')} checkItemMethod={() => this.checkItem(key, "completedItems")}/>
  		});

    	return (
      		<View style={styles.container}>
      			<StatusBar barStyle="default" />
        		
        		<View style={styles.header}>
        			<TextInput onChangeText={(text) => this.setState({itemText: text})} style={styles.textInput} value={this.state.itemText}
        				placeholder='Enter a new activity' placeholderTextColor='white'>

        			</TextInput>
        			<TouchableOpacity onPress={() => this.addItem('todoItems')} style={styles.addButton}>
						<Text style={styles.addButtonText}>+</Text>
					</TouchableOpacity>
        		</View>

        		<ScrollView style={styles.scrollContainer}>
        			<View style={styles.todoItems}>
        				{todoItems}
        			</View>
        			<View style={styles.completedItems}>
        				{completedItems}
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
	todoItems: {
		borderBottomColor: 'black',
		borderBottomWidth: 0.3,
	},
	completedItems: {
		marginTop: 5,
	},
	hr: {
		marginTop: 100,
	}
});

