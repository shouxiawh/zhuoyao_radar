<template>
  <div class="filter-wrapper">
      <div class="input-group">
          <el-input v-model="input" placeholder="请输入关键字"></el-input>
          <div class="checks">
              <el-checkbox v-model="only">仅选</el-checkbox>
              <el-checkbox :value="filter.length === tempdata.Data.length" @change="toggleAll">全选</el-checkbox>
          </div>
      </div>
      <div class="filter-group">
          <div v-for="item in list" :key="item.Id" class="filter-item">
              <div class="icon" :style="{backgroundImage: `url(${tempdata.Url + item.SmallImgPath})`}"></div>
              <div class="text">{{item.Name}}</div>
              <el-switch :value="filter.includes(item.Id)" @change="change(item.Id)"> </el-switch>
          </div>
      </div>
  </div>
</template>

<script>
import tempdata from '../lib/tempdata';
import { setLocalStorage } from '../lib/util';
export default {
  props: {
    filter: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data() {
    return {
      only: false,
      tempdata,
      input: ''
    }
  },
  computed: {
    list () {
      let data = tempdata.Data
      if (this.input) {
        data = data.filter(({Name}) => Name.includes(this.input))
      }
      if (this.only) {
        data = data.filter(({Id}) => this.filter.includes(Id))
      }
      return data
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    change (id) {
      const index = this.filter.findIndex((item) => item === id)
      if (index > -1) {
        this.filter.splice(index, 1)
      } else {
        this.filter.push(id)
      }
      setLocalStorage('radar_filter', this.filter)
    },
    toggleAll () {
      const add = this.filter.length !== this.tempdata.Data.length
      this.filter.splice(0, this.filter.length)
      if (add) this.tempdata.Data.forEach(({Id}) => this.filter.push(Id))
      setLocalStorage('radar_filter', this.filter)
    }
  },
  components: {}
}
</script>

<style scoped="" lang="less">
.filter-wrapper {
    .input-group {
        padding: 10px;
        display: flex;
        align-items: center;
        .el-input {
            width: 0;
            flex: auto;
        }
        .checks {
            display: flex;
            flex-direction: column;
            padding-left: 10px;
            width: 60px;
        }
    }
    .filter-group{
        padding-left: 10px;
        padding-bottom: 10px;
        height: calc(100vh - 380px);
        overflow-y: scroll;
    }
    .filter-item {
        display: flex;
        align-items: center;
        &:nth-child(odd) {
            background-color: #F3F4F8;
        }
        .icon {
            width: 20px;
            height: 20px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        }
        .text {
            line-height: 2em;
            padding-left: 10px;
            flex: auto;
        }
    }
}

</style>
