import { http, converToStarArray, convertToCastString, convertToCastInfos } from '../../../../utils/util.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var doubanUrl = app.globalData.doubanNginx;
    var movieId = options.id; //电影的ID
    var detailUrl = doubanUrl + '/v2/movie/subject/' + movieId;
    http(detailUrl, this.processDoubanData);
  },

  //处理豆瓣返回的电影数据
  processDoubanData: function (data) {
    var score = data.rating.average + '';
    if (!data) {
      return;
    };
    var director = {  //导演数据
      avatar: '',
      name: '',
      id: ''
    };
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large

      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "", //电影海报
      country: data.countries[0],   //国家
      title: data.title,   //中文名
      originalTitle: data.original_title,  //原名
      wishCount: data.wish_count,  //想看人数
      commentCount: data.comments_count,  //端平数量
      year: data.year,   //年代
      generes: data.genres.join("、"),  //影片类型
      stars: converToStarArray(data.rating.stars),  //几星好评
      score: score.length == 1 ? data.rating.average + '.0' : data.rating.average,  //评分
      director: director,  //导演
      casts: convertToCastString(data.casts),  //主演
      castsInfo: convertToCastInfos(data.casts),
      summary: data.summary  //简介
    };
    this.setData({ movie: movie });

  },

  /*查看图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
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
})