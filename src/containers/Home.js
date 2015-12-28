import React, { Component } from 'react'

import { connect } from 'react-redux'
import { loadMultiTaggedArticles, loadArticles } from '../actions/articles'
import Daily from '../components/Daily'
import Features from '../components/Features'
import Footer from '../components/Footer'
import DesktopNavBar from '../components/DesktopNavBar'
import MobileNavBar from '../components/MobileNavBar'
import SystemError from '../components/SystemError'
import TopNews from '../components/TopNews'
if (process.env.BROWSER) {
  require('./Home.css')
}

function loadData(props, cats) {
  let params = []
  cats.forEach((cat) => {
    if (!props.articles[cat]) {
      params.push(cat)
    }
  })
  if (params.length > 0) {
    props.loadMultiTaggedArticles(params)
  }
}

export default class Home extends Component {
  static fetchData({ store }) {
    let params = [ 'hp-projects', 'review', 'feature' ]
    return store.dispatch(loadMultiTaggedArticles(params))
  }

  constructor(props, context) {
    super(props, context)
    this.loadMoreFeatureArticles = this.loadMoreFeatureArticles.bind(this)
    this.params = [ 'hp-projects', 'review', 'feature' ]
  }

  componentWillMount() {
    loadData(this.props, this.params)
  }

  componentWillReceiveProps(nextProps) {
    loadData(nextProps, this.params)
  }

  loadMoreFeatureArticles() {
    const maxResults = 10
    const features = this.props.articles['hp-projects'] || {
      items: [],
      hasMore: true
    }
    if (features.hasMore) {
      let page = Math.floor(features.items.length / maxResults)  + 1
      this.props.loadArticles('hp-projects', maxResults, page)
    }
  }

  render() {
    const { articles } = this.props
    const { device } = this.context
    const topnews_num = 5
    let topnewsItems = articles.feature && articles.feature.items || []
    let feature = articles['hp-projects'] || {
      hasMore: true
    }
    let featureItems = feature.items || []
    let dailyItems = articles.review && articles.review.items || []
    if (Array.isArray(topnewsItems)) {
      if (topnewsItems.length < topnews_num) {
        let less = topnews_num - topnewsItems.length
        topnewsItems = topnewsItems.concat(featureItems.slice(0, less))
        featureItems = featureItems.slice(less)
      } else {
        topnewsItems = topnewsItems.slice(0,topnews_num)
      }
    }

    const NavBar = device === 'desktop' ? DesktopNavBar : MobileNavBar
    if (topnewsItems || featureItems) {
      return (
        <div>
          <NavBar bgStyle="light"/>
          <TopNews topnews={topnewsItems} />
          <Daily daily={dailyItems} />
          <Features
            features={featureItems}
            hasMore={feature.hasMore}
            loadMore={this.loadMoreFeatureArticles}
          />
          {this.props.children}
          <Footer/>
        </div>
      )
    } else {
      return ( <SystemError/> )
    }
  }
}

function mapStateToProps(state) {
  return { articles: state.articles }
}

Home.contextTypes = {
  device: React.PropTypes.string
}

export { Home }
export default connect(mapStateToProps, { loadMultiTaggedArticles, loadArticles })(Home)
