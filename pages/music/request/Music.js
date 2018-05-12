import { http } from '../../../utils/util.js';
//获取应用实例
const app = getApp();

class Music_request {
  constructor() {
    var kugouApi = app.globalData.kugouApi;
    this.kugouMusic = {
      // 搜索框关键词搜索接口
      searchtip: kugouApi+ "/getSearchTip",
      // 搜索接口
      songsearch: kugouApi+ "/song_search_v2",
      // 获取歌曲接口,走我的阿里云代理
      //play: "http://www.kugou.com/yy/index.php"
      play: kugouApi+ "/play"
    }
  }

  //根据关键词搜索
  getSearchTip(inp_tip, that) {
    wx.showNavigationBarLoading();  //显示加载头部效果
    http(this.kugouMusic.searchtip, function(res){
      that.setData({
        keyword_resultList: res.data[0].RecordDatas
      });
      wx.hideNavigationBarLoading();
    }, { keyword : inp_tip} , 'POST')
  }

  // 点击搜索事件, keyword为关键字
  getSongInfo(that, songName, page=1){
    wx.showNavigationBarLoading();  //显示加载头部效果
    const requestData = {
      page,
      pagesize: 20,
      keyword: songName,
      platform: "WebFilter",
      userid: -1,
      iscorrection: 1,
      privilege_filter: 0,
      filter: 2
    };
    //请求数据
    var url = this.kugouMusic.songsearch;
    http(url, function (res) {
      const data = res.data;
      //console.log(data)
      if (res.status === 1) {
        var searchCount = data.total;  //数据总条数
        var totalPage = Math.ceil(searchCount / 20); //数据分页数目
        var song_resultList = data.lists.map(function(element){
          return {
            SongName: element.SongName,
            SingerName: element.SingerName,
            FileName: element.FileName,
            album_id: element.AlbumID,
            hash: element.FileHash
          }
        });
        var data_list = [...that.data.song_resultList, ...song_resultList];
        that.setData({
          song_resultList: data_list,
          totalPage: totalPage,
          searchCount: searchCount
        }); 
      }
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, requestData)

  }

  //点击音乐播放，获取该音乐的地址信息
  getMusicPlayInfo(that, hash, album_id, callback){
    const requestData = {
      r: "play/getdata",
      hash,
      album_id
    };
    wx.showNavigationBarLoading();  //显示加载头部效果
    http(this.kugouMusic.play, function (res) {
      console.log(res);
      if(res.status ==1){
        var data = res.data;
        if(typeof(callback)=='function'){
          callback(data);
        }
      }
      /* that.setData({
        keyword_resultList: res.data[0].RecordDatas
      }); */
      wx.hideNavigationBarLoading();
    }, requestData)
  }

}


module.exports = {
  Music_request
}