import React from 'react'
import { Text } from 'react-native'
import Tabs from 'react-native-tabs'
import styles from './styles'

const TabsBar = (props) => {

  const { page, onSelect } = props
  return (
    <Tabs
      selected={page}
      style={styles.tabbar}
      selectedStyle={{color:'black'}} onSelect={tab => onSelect(tab)}>

      <Text
        style={styles.playingtab}
        name="playing">Now Playing</Text>
      <Text
        style={styles.playingtab}
        name="rated">Top Rated</Text>

    </Tabs>
  )

  TabsBar.propTypes = {
    page: React.PropTypes.string,
    onSelect: React.PropTypes.func,
  };

  TabsBar.defaultProps = {
    page: 'playing',
    onSelect: () => console.log('on tab change')
  };
}

export default TabsBar
