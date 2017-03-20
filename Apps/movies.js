import React, { Component } from 'react';
import {
  AppRegistry, StyleSheet, Text, View, ListView, StatusBar, Navigator,
  RefreshControl, ActivityIndicator, Dimensions
} from 'react-native';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

import api from './lib/api.js'
import MovieCell from './components/MovieCell'
import SearchBar from './components/SearchBar'
import TabsBar from './components/TabsBar'

// We can use this to make the overlay fill the entire width
var { width, height } = Dimensions.get('window');

export default class Movies extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      rawData: [],
      searchText: '',
      page: 'playing',
      refreshing: false,
      animating: false
    };
  }

  componentDidMount() {
    this.getMoviesFromApiAsync()
  }

  getMoviesFromApiAsync() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([]),
      rawData: [],
      animating: true
    })
    api.getMovies()
      .then((responseJson) => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseJson.results),
            rawData: responseJson.results,
            refreshing: false,
            animating: false
          })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setSearchText(event) {
    let searchText = event.nativeEvent.text
    let moviesLength = this.state.rawData.length
    let filteredMovies = this.state.rawData.filter(movie =>
      ~movie.original_title.toLowerCase().indexOf(searchText.toLowerCase())
      || ~movie.overview.toLowerCase().indexOf(searchText.toLowerCase()))

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(filteredMovies),
      searchText: searchText
    });
  }

  onTabClicked(el) {
    if (el.props.name !== this.state.page) {
      this.setState({
        page: el.props.name,
        searchText: ''
      })
      switch (el.props.name) {
        case 'playing':
            this.getMoviesFromApiAsync()
          break
        case 'rated':
          this.getRatedMovies()
          break
        default:
      }
    }
  }

  getRatedMovies() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([]),
      rawData: [],
      animating: true
    })
    api.getMovies()
      .then((responseJson) => {
        let ratedMovies = responseJson.results.filter(movie => movie.vote_average > 7)
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(ratedMovies),
            rawData: ratedMovies,
            refreshing: false,
            animating: false
          })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onMovieClick(data, navigator) {
    navigator.push({data: data, index: 'MovieDetail'})
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    });
    if (this.state.page == 'playing') {
      this.getMoviesFromApiAsync()
    } else {
      this.getRatedMovies()
    }
  }

  render() {

    const routes = [
      {data: 'List Movies', index: 'ListMovies'},
      {data: 'Movie Detail', index: 'MovieDetail'},
    ];

    return (
      <View style={{flexDirection:'column', backgroundColor: '#f1b344', flex: 1}}>
        <StatusBar
          hidden={false}
          barStyle="dark-content" />

        <ActivityIndicator
            animating={this.state.animating}
            color='#000000'
            style={styles.loadingIndicator}
            size="large" />

        <Navigator
          ref={(navigator) => {this.navigator = navigator}}
          initialRoute={routes[0]}
          initialRouteStack={routes}
          renderScene={this.renderScene.bind(this)}
          navigationBar={
             <Navigator.NavigationBar
               routeMapper={{
                 LeftButton: (route, navigator, index, navState) =>
                  {
                    if (route.index == 'ListMovies') {
                      return;
                    } else {
                      return (
                        <Text style={{paddingLeft: 20, paddingTop: 15}}
                          onPress={() => navigator.pop()}>Back</Text>
                      )
                    }
                  },
                 RightButton: (route, navigator, index, navState) =>
                   { return; },
                 Title: (route, navigator, index, navState) =>
                   {
                     if (route.index == 'ListMovies') {
                       return (
                          <SearchBar
                            searchText={this.state.searchText}
                            onChange={this.setSearchText.bind(this)}/>);
                      } else {
                        return
                      }
                  },
               }}
               style={{backgroundColor: '#f1ba5e'}}
             />
          }
        />

        <TabsBar
          page={this.state.page}
          onSelect={tab => this.onTabClicked(tab)}/>
    </View>
    );
  }

  // To navigate to page based on page ID
  renderScene(route, navigator) {
    switch (route.index) {
      case 'ListMovies':
          return (
          <ListView style={{marginTop: 65, marginBottom: 50}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
                tintColor="#ff0000"
                title="Loading..."
                titleColor="gray"
                colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor="#ffff00" />
              }
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            navigator={navigator}
            renderRow={(rowData) => <MovieCell posterPath={rowData.poster_path}
                                              originalTitle={rowData.original_title}
                                              overview={rowData.overview}
                                              onPress={() => this.onMovieClick(rowData, navigator)}/>}
            renderSeparator={this.renderSeparator}
          />
        )
        break
      case 'MovieDetail':
        return (
          <View style={{flex: 1, marginTop: 50, marginBottom: 50, flexDirection: 'column-reverse'}}
            navigator={navigator}>
            <Image
              indicator={Progress.CircleSnail}
              style={{flex: 1, resizeMode: 'cover'}}
              source={{uri: 'https://image.tmdb.org/t/p/original' + route.data.poster_path}}
            />
            <View style={styles.detailContainer}>
              <Text style={[styles.detail, {fontSize: 20, fontWeight: 'bold', marginBottom: 20}]}>{route.data.title}</Text>
              <Text style={styles.detail}>{route.data.release_date}</Text>
              <Text style={styles.detail}>Vote: {route.data.vote_average}</Text>
              <Text style={[styles.detail, {fontWeight: 'bold'}]}>{route.data.overview}</Text>
            </View>
          </View>
        )
        break
      default:
    }
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
            height: 1,
            backgroundColor: '#dabc89'
          }}
        />
    )
  }
}


var styles = StyleSheet.create({
  detail: {
    color: '#ffffff'
  },
  detailContainer: {
    flexDirection: 'column',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    justifyContent: 'center',
    margin: 20
  },
  loadingIndicator: {
    width: width,
    height: height,
    backgroundColor: '#ff000000',
    borderRadius: 5,
    position: 'absolute',
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
