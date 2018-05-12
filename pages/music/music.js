import { Music_request} from './request/Music.js';
var musicRequest = new Music_request();
const backgroundAudioManager = wx.getBackgroundAudioManager();

//获取应用实例
const app = getApp();
var images_url = app.globalData.kugouApi+'/music_player_images';  //远程图片地址

Page({
  data: {
    new_active: true,  //是否点击了新歌菜单
    imgUrls: [images_url + '/music/banner1.jpg', images_url + '/music/banner2.jpg', images_url+'/music/banner3.jpg'],
    input_val: '',
    keyword: '',  //搜索关键词
    keyword_resultList: [],  // 根据关键词搜索得到的结果列表
    song_resultList: [],   //歌曲列表
    page : 1,  //歌曲第几页
    totalPage: 0,       // 总页数
    searchCount: 0,  //搜索到的结果有多少条数据
    isPlayIndex:-1,  //正在播放音乐的序号
    isPlaying: false,  //音乐是否在播放
    isPause: true, //音乐是否暂停
    music_data: {},   //获取音乐数据
    bottom_song_info: {  //底部旋转的一些信息
      img:'',
      song_name: '',
      singer_name:''
    }
  },

  onLoad: function (options) {
    this.setMusicMonitor();  //设置音乐监听情况
  },

  //搜索输入框输入内容时
  input_search_music: function (event) {
    var that = this;
    var inp_val = event.detail.value.trim();
    this.setData({
      input_val: inp_val
    });
    if(inp_val){
      musicRequest.getSearchTip(inp_val,that)
    }else{
      this.setData({
        keyword_resultList: []
      });
    }
  },

  //第一次搜索音乐
  search_music:function(event){
    this.setData({ 
      song_resultList:[]
    });
    var keyword = event.currentTarget.dataset.keyword;  //关键词
    //console.log(keyword)
    if(keyword){
      musicRequest.getSongInfo(this, keyword);
      //隐藏下拉列表框
      this.setData({
        keyword_resultList: [],
        keyword: keyword,
        page: 1
      });
    }
  },

  //点击音乐列表播放音乐
  musicPlay:function(event){
    var index = event.currentTarget.dataset.index;  //歌曲序列号
    var album_id = event.currentTarget.dataset.album_id;  //
    var hash = event.currentTarget.dataset.hash;  //hash值
    var song_name = event.currentTarget.dataset.song_name;  //歌曲名
    var singer_name = event.currentTarget.dataset.singer_name;  //歌手
    this.setData({
      isPlayIndex: index
    });
    musicRequest.getMusicPlayInfo(this, hash, album_id, this.music_start_play);
  },

  //音乐开始播放
  music_start_play:function(data){
    backgroundAudioManager.title = data.audio_name;  //音频标题
    //backgroundAudioManager.epname = '此时此刻';  //专辑名，
    backgroundAudioManager.singer = data.author_name; //歌手名
    backgroundAudioManager.coverImgUrl = data.img;  //封面图url，
    backgroundAudioManager.src = data.play_url; // 音频的数据源，设置了 src 之后会自动播放
    this.setData({
      music_data: data,
      isPlaying: true,
      isPause: false,
      bottom_song_info:{
        img: data.img,
        song_name: data.audio_name,
        singer_name: data.author_name
      }
    });
    app.globalData.g_isPlayingMusic = true;

  },

  //监听音乐播放情况
  setMusicMonitor: function () {
    //注意这里一定要用这个这个API，不然真机没法生效
    //监听音乐播放
    backgroundAudioManager.onPlay(function () {
      this.setData({
        isPlaying: true,
        isPause: false
      });
      app.globalData.g_isPlayingMusic = true;
    }.bind(this));
    //监听音乐暂停
    backgroundAudioManager.onPause(function () {
      console.log('音乐暂停')
      this.setData({
        isPause: true
      });
      app.globalData.g_isPlayingMusic = false;
    }.bind(this));
    //音乐结束停止
    backgroundAudioManager.onEnded(function () {
      this.setData({
        isPause: true
      });
      app.globalData.g_isPlayingMusic = false; 
      //音乐停止总盯播放下一首
      var index = this.data.isPlayIndex + 1;  //歌曲序列号
      this.change_music(index);
    }.bind(this));
  },

  //切歌
  change_music(index){
    if (!this.data.song_resultList){
      return;
    }
    if (index > this.data.song_resultList.length - 1) {
      index = 0;  //跳到第一首
    }else if(index == -1){
      //跳到最后一首
      index = this.data.song_resultList.length - 1;
    }
    var album_id = this.data.song_resultList[index].album_id;  //
    var hash = this.data.song_resultList[index].hash;  //hash值
    var song_name = this.data.song_resultList[index].SongName;  //歌曲名
    var singer_name = this.data.song_resultList[index].SingerName;  //歌手
    this.setData({
      isPlayIndex: index
    });
    musicRequest.getMusicPlayInfo(this, hash, album_id, this.music_start_play);
  },

  //点击音乐播放按钮/暂停
  onMusicTap: function (event) {
    if (this.data.isPause){
      backgroundAudioManager.play();  //暂停播放
    }else{
      backgroundAudioManager.pause();  //暂停音乐
    }
  },
  //点击上一首
  onPlayPrev:function(){
    var index = this.data.isPlayIndex - 1;  //歌曲序列号
    this.change_music(index);
  },
  //点击上一首
  onPlayNext: function () {
    var index = this.data.isPlayIndex + 1;  //歌曲序列号
    this.change_music(index);
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var keyword = this.data.keyword; //关键词
    this.setData({
      song_resultList: [],
      page: 1
    });
    if (keyword) {
      musicRequest.getSongInfo(this, keyword);
    }else{
      wx.stopPullDownRefresh(); //停止下拉刷新
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var keyword = this.data.keyword; //关键词
    var page = this.data.page + 1;
    if (keyword) {
      musicRequest.getSongInfo(this, keyword, page);
    }
  },

  //点击搜索框的叉叉按钮
  delete_search:function(event){
    this.setData({
      input_val: '',
      keyword_resultList:[]
    });
  }
});
