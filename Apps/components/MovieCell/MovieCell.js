import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Image from 'react-native-image-progress'
import * as Progress from 'react-native-progress'
import styles from './styles'

const MovieCell = (props) => {

  const { posterPath, originalTitle, overview, onPress } = props

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{flexDirection:'row', backgroundColor: '#f1b344'}} >
        <Image
          indicator={Progress.Bar}
          style={{height: 150, flex: 0.3, margin: 10, resizeMode: 'contain'}}
          source={{uri: 'https://image.tmdb.org/t/p/w342' + posterPath}}
        />
        <View style={{flex: 0.7}}>
          <Text style={styles.title}>{originalTitle}</Text>
          <Text style={styles.description} numberOfLines={5}>{overview}</Text>
        </View>
      </View>
  </TouchableOpacity>
  )

  MovieCell.propTypes = {
    posterPath: React.PropTypes.string,
    originalTitle: React.PropTypes.string,
    overview: React.PropTypes.string,
    onPress: React.PropTypes.func
  }

  MovieCell.defaultProps = {
    posterPath: '',
    originalTitle: '',
    overview: '',
    onPress: (data) => console.log('On Item Click')
  };

}

export default MovieCell
