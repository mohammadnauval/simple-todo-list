

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Item extends Component {
  	render() {
    	return (
    		<View key={this.props.keyval} style={styles.item}>
    			<Text style={styles.itemText}>
    				{this.props.value.task}
    			</Text>

    			{this.props.completed ? <Icon name="check-circle" onPress={this.props.checkItemMethod} style={styles.checkIcon} /> : <Icon name="check-circle-o" onPress={this.props.checkItemMethod} style={styles.checkIcon} />}

    			<Icon name="trash" onPress={this.props.deleteItemMethod} style={styles.deleteIcon}>
				</Icon>

    		</View>
   		);
  	}
}

const styles = StyleSheet.create({
	item: {
		backgroundColor: '#fff',
		padding: 5,
		borderRadius: 5,
		marginBottom: 5,
		flexDirection: 'row',
	},
	itemText: {
		flex: 0.7,
		paddingRight: 5,
	},
	checkIcon: {
		marginRight: 8,
	},
	deleteIcon: {
	}
});

