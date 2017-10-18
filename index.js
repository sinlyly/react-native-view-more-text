import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

const emptyFunc = ()=>{};

export default class ViewMoreText extends Component {

  constructor() {
    super();
    this.resetData();
    isTruncated: false;
    originalHeight: 0;
    shouldShowMore: false; 
    contentHeight: 0;
    isInit: false;
    this.state = {
      numberOfLines: null,
      opacity: 0
    }
  }

  componentDidUpdate(){
    if(this.state.numberOfLines === null){
      (this.props.afterExpand || emptyFunc)();
    } else {
      (this.props.afterCollapse || emptyFunc)();
    }
  }

  resetData(){
    this.isTruncated = false;
    this.originalHeight = 0;
    this.shouldShowMore = false;
    this.isInit = false;
  }

  componentWillReceiveProps(){
    this.resetData();

    this.setState({
      numberOfLines: null,
      opacity: 0
    })
  }

  onLayout(event){
    const {x, y, width, height} = event.nativeEvent.layout;

    if(height === 0 || this.state.opacity === 1) return false;

    this.setOriginalHeight(height);
    this.checkTextTruncated(height);
    if(this.state.numberOfLines === this.props.numberOfLines){
      this.setState({
        opacity: 1
      })
    }
  }
  
  setOriginalHeight(height){
    if(this.originalHeight === 0){
      this.originalHeight = height;

      this.setState({
        numberOfLines: this.props.numberOfLines
      })
    }
  }

  checkTextTruncated(height){
    if(height < this.originalHeight){
      this.shouldShowMore = true;
    }
  }

  onPressMore(){
    this.setState({
      numberOfLines: null
    });
  }

  onPressLess(){
    this.setState({
      numberOfLines: this.props.numberOfLines
    })
  }

  renderViewMore(){
    return (
      <Text onPress={this.onPressMore}>
        View More
      </Text>
    )
  }
  
  renderViewLess(){
    return (
      <Text onPress={this.onPressLess}>
        View Less
      </Text>
    )
  }

  renderFooter(){
    let {
      numberOfLines
    } = this.state;

    if (this.shouldShowMore === true){
      if(numberOfLines > 0) {
        return (this.props.renderViewMore || this.renderViewMore)(this.onPressMore);
      } else {
        return (this.props.renderViewLess || this.renderViewLess)(this.onPressLess);
      }
    }
  }

  render(){

    return (
      <View onLayout={this.onLayout} style={{opacity: this.state.opacity}}>
        <Text
          numberOfLines={this.state.numberOfLines}>
          {this.props.children}
        </Text>
        {this.renderFooter()}

        {
          this.state.numberOfLines &&
          <View style={{width: 1, height: 1}}></View>
        }

      </View>
    )
  }

}

ViewMoreText.propTypes = {
  renderViewMore: PropTypes.func,
  renderViewLess: PropTypes.func,
  afterCollapse: PropTypes.func,
  afterExpand: PropTypes.func,
  numberOfLines: PropTypes.number.isRequired
};


