const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//将数字转为数组 例如 45
/**用于五星好评组件
 * 45 => [1,1,1,1,0.5]
 * 40 => [1,1,1,1,0]
 * 35 => [1,1,1,0.5,0]
 * **/
function converToStarArray(nums) {
  var nums = Number(nums);  //将其转为数字
  var num_array = [];
  for (var i = 1; i <= 5; i++) {
    if (nums >= 10) {
      num_array.push(1);
    } else if (nums >= 5) {
      num_array.push(0.5);
    } else {
      num_array.push(0);
    }
    nums = nums - 10;
  }
  return num_array;
}


//将主演数组转为字符串
function convertToCastString(casts) {
  var cast_array = [];  //主演数组
  for (var i = 0; i < casts.length; i++) {
    var name = casts[i].name;
    cast_array.push(name);
  }
  return cast_array.join(' / ');
};


function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
};

//网络请求
function http(url, callBack, data, method = 'GET') {
  wx.request({
    url: url,
    method: method,
    data: data,
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

module.exports = {
  formatTime: formatTime,
  http,
  converToStarArray,
  convertToCastString,
  convertToCastInfos
}
