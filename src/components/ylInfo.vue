<template>
    <transition name="side">
        <div v-if="data" class="yl-info">
            <div class="img" :style="`backgroundImage: url(${img})`"></div>
            <div class="right">
                <div class="name">{{current.Name}}</div>
                <div class="ele">{{current.FiveEle.join(',')}}</div>
                <div class="time">{{time}}</div>
            </div>
        </div>
    </transition>
</template>

<script>
import tempdata from '../lib/tempdata';
import {getTime} from '../lib/util'
export default {
    name: "ylInfo",
    props: {
        data: {
            type: Object,
            default () {
                return null
            }
        }
    },
    data () {
        return {
            time: ''
        }
    },
    computed: {
        current () {
            if (this.data) {
                const {sprite_id} = this.data
                return tempdata.Data.find(({Id}) => Id === sprite_id)
            }
            return null
        },
        img () {
            if (this.current) {
                return tempdata.Url + this.current.SmallImgPath
            }
            return ''
        }
    },
    watch: {
        data (v) {
            this.getTime()
        }
    },
    created() {
        setInterval(() => {
            this.getTime()
        }, 1000)
    },
    mounted() {
    },
    methods: {
        getTime () {
            this.time = this.data ? getTime(this.data) : '已失效'
        }
    }
}
</script>

<style scoped="" lang="less">
.yl-info {
    z-index: 9999999;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 250px;
    background-color: #fff;
    display: flex;
    align-items: flex-start;
    padding: 20px 30px;
    .img {
        width: 80px;
        height: 80px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        margin-right: 30px;
    }
    .right {
        .name {
            font-size: 16px;
        }
        .ele {
            font-size: 12px;
        }
        .time {
            font-size: 15px;
            padding-top: 15px;
            color: #1E90FF;
        }
    }
}
</style>