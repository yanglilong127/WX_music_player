import { converToStarArray, http } from '../../../../utils/util.js';
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navigateTile: "",  //导航条文字
    dataUrl: "",   //获取电影的地址
    retMovieNums: 0,  //返回了多少条电影数据
    movies: [],  //所有电影数据
    no_more: false  //没有更多数据了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dataUrl = app.globalData.doubanNginx;  //豆瓣代理
    var category = options.category;
    switch (category) {
      case '正在热映':
        dataUrl += '/v2/movie/in_theaters';
        break;
      case '即将上映':
        dataUrl += '/v2/movie/coming_soon';
        break;
      case '豆瓣Top250':
        dataUrl += '/v2/movie/top250';
        break;
    };
    this.setData({
      navigateTile: category,
      dataUrl: dataUrl
    });
    http(dataUrl, this.processDoubanData);

  },

  //处理豆瓣返回的电影数据
  processDoubanData: function (moviesDouban) {
    var movies = [];
    if (moviesDouban.subjects.length > 0) {
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
      movies = [...this.data.movies, ...movies];  //将之前和新加载的电影数据合并
      this.setData({
        no_more: false,
        movies: movies,
        retMovieNums: movies.length  //返回的电影总长度
      });
    } else {
      this.setData({
        no_more: true
      });
    };
    wx.stopPullDownRefresh(); //停止刷新
  },

  //点击电影，查看每个电影的详情
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;  //电影的ID
    wx.navigateTo({
      url: '../movie_detail/movie_detail?id=' + movieId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (event) {
    //动态设置导航条标题
    wx.setNavigationBarTitle({
      title: this.data.navigateTile
    });
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
    console.log('下拉刷新')
    var dataUrl = this.data.dataUrl;
    this.data.movies = [];  //清空电影数组
    http(dataUrl, this.processDoubanData);
  },

  /**
   * 页面上拉触底事件的处理函数,滚动条滑倒到底部时触发
   */
  onReachBottom: function () {
    var dataUrl = this.data.dataUrl + "?start=" + this.data.retMovieNums;
    http(dataUrl, this.processDoubanData);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})