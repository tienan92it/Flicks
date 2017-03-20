import React from 'react'
import { TextInput, Text } from 'react-native'
import styles from './styles'

const SearchBar = (props) => {
  const { searchText, onChange } = props

  return (
    <TextInput
       style={styles.searchBar}
       value={searchText}
       onChange={onChange}
       placeholder='Search' />
  )

  SearchBar.propTypes = {
    searchText: React.PropTypes.string,
    onChange: React.PropTypes.func
  };

  SearchBar.defaultProps = {
    searchText: '',
    onChange: () => console.log('On Text Change')
  };
}

export default SearchBar
