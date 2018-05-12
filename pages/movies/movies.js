import { converToStarArray, http } from '../../utils/util.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},  //传电影的数据   */
    searchData: {},  //搜索结果
    containerShow: true,  //初始是电影显示
    searchTempShow: false,  //搜索结果隐藏
    searchText: ''  //搜索输入框的文字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //https://douban.uieee.com,  https://moody-jellyfish-18.localtunnel.me
    var doubanProxy = app.globalData.doubanNginx;  //豆瓣代理
    var inTheatersUrl = doubanProxy + '/v2/movie/in_theaters?count=3';   //正在热映
    var comingSoonUrl = doubanProxy + '/v2/movie/coming_soon?count=3';   //即将热映
    var top250Url = doubanProxy + '/v2/movie/top250?count=3';   //Top250 

    http(inTheatersUrl, function (data) {
      this.processDoubanData(data, "inTheaters", "正在热映");
    }.bind(this));
    http(comingSoonUrl, function (data) {
      this.processDoubanData(data, "comingSoon", "即将上映");
    }.bind(this));
    http(top250Url, function (data) {
      this.processDoubanData(data, "top250", "豆瓣Top250");
    }.bind(this));
  },

  //处理豆瓣返回的电影数据
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var i = 0; i < moviesDouban.subjects.length; i++) {
      var subject = moviesDouban.subjects[i];
      var title = subject.title;  //电影名
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
      }
      var score = subject.rating.average.toString();
      score = (score.length > 1) ? score : (score + ".0");
      var large_img = subject.images.large;  //图片地址
      var movieId = subject.id;  //影片id
      var stars = subject.rating.stars;  //记性好评
      var temp = {
        title: title,
        score: score,
        cover_img_url: large_img,
        movieId: movieId,
        stars: converToStarArray(stars)
      }
      movies.push(temp);
    };
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },

  //搜索输入框输入内容时
  onBindInput: function (event) {
    var inp_text = event.detail.value.trim(); //输入框的值
    var inp_chacha = inp_text ? true : false;  //搜索那儿的叉叉按钮显示隐藏
    this.setData({
      searchTempShow: inp_chacha
    });
  },

  //输入框输入完成
  onBindConfirm: function (event) {
    var inp_text = event.detail.value.trim(); //输入框的值
    var searchUrl = app.globalData.doubanNginx + '/v2/movie/search?q=' + inp_text;
    if (inp_text) {
      http(searchUrl, function (data) {
        this.processDoubanData(data, "searchData", "正在热映");
      }.bind(this));
      this.setData({
        containerShow: false,
        searchTempShow: true
      });
    } else {
      this.setData({
        containerShow: true,
        searchTempShow: false
      });
    }
  },

  //点击叉叉按钮，使输入框为空
  onCancelImgTap: function (event) {
    this.setData({
      searchText: '',
      searchTempShow: false,
      containerShow: true
    });
  },

  //点击查看更多电影
  onMoreMovie: function (event) {
    //电影分类 正在热映 
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'templates/more_movie/more_movie?category=' + category
    });
  },

  //点击电影，查看每个电影的详情
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;  //电影的ID
    wx.navigateTo({
      url: 'templates/movie_detail/movie_detail?id=' + movieId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var doubanProxy = app.globalData.doubanNginx;  //豆瓣代理
    var inTheatersUrl = doubanProxy + '/v2/movie/in_theaters?count=3';   //正在热映
    var comingSoonUrl = doubanProxy + '/v2/movie/coming_soon?count=3';   //即将热映
    var top250Url = doubanProxy + '/v2/movie/top250?count=3';   //Top250 

    http(inTheatersUrl, function (data) {
      this.processDoubanData(data, "inTheaters", "正在热映");
    }.bind(this));
    http(comingSoonUrl, function (data) {
      this.processDoubanData(data, "comingSoon", "即将上映");
    }.bind(this));
    http(top250Url, function (data) {
      this.processDoubanData(data, "top250", "豆瓣Top250");
    }.bind(this));
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});