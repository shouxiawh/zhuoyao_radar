/*
 * @Date: 2019-05-11 15:02:18
 * @Last Modified time: 2019-05-11 15:02:18
 * @Desc: mixins
 */

import {getTime} from '../lib/util'

module.exports = {
  methods: {
    exportPosition: function() {
      var pos = this.$prompt('请输入标签', '缓存位置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: value => {
          if (value.length == 0) return '请输入标签';
          return true;
        }
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的邮箱是: ' + value
        });
      });
    },
    importPosition: function() {},
    /**
     * 初始化地图
     */
    initMap() {
      this.map = new qq.maps.Map(document.getElementById('qmap'), {
        center: new qq.maps.LatLng(
          this.location.latitude,
          this.location.longitude
        ),
        disableDoubleClickZoom: true,
        zoom: 15 // 地图的中心地理坐标。
      });

      qq.maps.event.addListener(this.map, 'click', this.clickMap);
      qq.maps.event.addListener(
        this.map,
        'center_changed',
        this.mapCenterChanged
      );
      qq.maps.event.addListener(
          this.map,
          'dblclick',
          () => {
            console.log('dblclick')
            this.getYaolingInfo()
          }
      );
    },
    /**
     * 地图点击事件
     */
    clickMap(e) {
      if (!this.settings.auto_search)
        this.notify('位置已重置,请重新筛选');
      this.location.longitude = e.latLng.lng;
      this.location.latitude = e.latLng.lat;
      var icon = new qq.maps.MarkerImage(
        'src/assets/images/notify-arrow.png',
        null,
        null,
        null,
        new qq.maps.Size(40, 40)
      );
      if (this.clickMarker) {
        this.clickMarker.setPosition(
          new qq.maps.LatLng(e.latLng.lat, e.latLng.lng)
        );
      } else {
        this.clickMarker = new qq.maps.Marker({
          position: new qq.maps.LatLng(e.latLng.lat, e.latLng.lng),
          map: this.map
        });
        this.clickMarker.setIcon(icon);
      }
      this.poly.yl = null
      this.poly.click = this.buildPolyline(this.location, this.poly.click, '#3A5FCD')
      if (this.settings.auto_search) {
        this.getYaolingInfo();
      }
    },
    /**
     * 根据妖灵信息在地图上打个标记
     */
    addMarkers(yl) {
      const icon = new qq.maps.MarkerImage(this.getHeadImagePath(yl), null, null, null, new qq.maps.Size(40, 40))
      const position = new qq.maps.LatLng(yl.latitude / 1e6, yl.longtitude / 1e6);
      const marker = new qq.maps.Marker({position, map: this.map});
      // 标记的点击事件
      qq.maps.event.addListener(marker, 'click', () => {
        this.$set(this.poly, 'yl', yl)
      });
      marker.setIcon(icon);
      const label = this.getLabel(position, yl)
      // 展示倒计时
      this.markers.push({
        position,
        marker,
        label,
        yl
      });
    },
    // 展示倒计时
    getLabel (position, yl) {
      let label = null
      // 展示倒计时
      if (this.settings.show_time) {
        label = new qq.maps.Label({
          position,
          offset: new qq.maps.Size(-20, 5),
          map: this.map,
          content: getTime(yl),
          style: {
            border: 'none',
            backgroundColor: 'rgba(255,255,255,.7)'
          }
        });
      }
      return label
    },
    /**
     * 根据妖灵信息在地图上打个标记
     */
    addMarkersBak(yl) {
      let headImage = this.getHeadImagePath(yl);

      var time = new Date((yl.gentime + yl.lifetime) * 1000) - new Date();
      var second = time / 1000;
      var minute = Math.floor(second / 60);
      var second = Math.floor(second % 60);

      var fintime = minute + '分' + second + '秒';

      // new icon
      let icon = new qq.maps.MarkerImage(
          headImage,
          null,
          null,
          null,
          new qq.maps.Size(40, 40)
      );
      let position = new qq.maps.LatLng(yl.latitude / 1e6, yl.longtitude / 1e6);
      let marker = new qq.maps.Marker({
        position: position,
        map: this.map
      });
      // 标记的点击事件
      qq.maps.event.addListener(marker, 'click', () => {
        this.$set(this.poly, 'yl', yl)
      });
      marker.setIcon(icon);
      this.markers.push(marker);

      // 展示倒计时
      if (this.settings.show_time) {
        let labelMarker = new qq.maps.Label({
          position: position,
          offset: new qq.maps.Size(-20, 5),
          map: this.map,
          content: fintime,
          style: {
            border: 'none',
            backgroundColor: 'rgba(255,255,255,.7)'
          }
        });
        this.markers.push(labelMarker);
      }
    },
    /**
     * 清除标记
     */
    clearAllMarkers() {
      // for (var i = 0; i < this.markers.length; i++) {
      //   this.markers[i].setMap(null);
      // }
      // this.markers = [];
    },
    refreshMarker () {
      // console.log('refreshMarker', this.markers)
      this.markers = this.markers.filter(it => it)
      for (let i = 0; i < this.markers.length; i++) {
        const {position, marker, label, yl} = this.markers[i]
        const content = getTime(yl)
        if (!content) {
          marker.setMap(null)
          if (label) label.setMap(null)
          this.markers[i] = null
        } else {
          if (label) label.setContent(content)
          // this.markers[i].label = this.getLabel(position, yl)
        }
      }
    }
  }
};
