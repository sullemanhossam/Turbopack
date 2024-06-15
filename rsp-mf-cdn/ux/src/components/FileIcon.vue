<template>
  <div
    class="file-icon"
    v-bind:class="{ 'file-icon--img': thumb }"
    @click="$emit('preview')"
  >
    <div v-if="isLoader" class="img-wrapper">
      <ImageLodaer class="image-loader" />
    </div>
    <div class="img-wrapper" v-else-if="isFolder">
      <Icon class="file-icon--folder" family="fas" name="folder" />
    </div>
    <div v-else-if="!thumb || thumb === '' || error" class="img-wrapper">
      <div
        class="file-format"
        v-if="format"
        v-bind:class="{ [`file-format--${format}`]: format }"
      >
        <component v-bind:is="`${format}Icon`" />
      </div>
      <Base />
    </div>
    <ImageComponent v-else :src="thumb" @error="error = true" />
    <div class="overlay d-none"></div>
    <div class="status">
      <slot name="status" />
    </div>
  </div>
</template>
<script>
import Base from '../assets/file/base.svg';
import Loader from '../assets/loader.gif';
import ImageComponent from './ImageComponent.vue';
import ImageLodaer from './ImageLoader';
import Icon from './Icon';
import axios from 'axios';

import pdfIcon from '../assets/file/format-pdf.svg';
import txtIcon from '../assets/file/format-text.svg';
import zipIcon from '../assets/file/format-zip.svg';
import imgIcon from '../assets/file/format-img.svg';
import audioIcon from '../assets/file/format-audio.svg';
import videoIcon from '../assets/file/format-video.svg';
import wordIcon from '../assets/file/format-word.svg';
import excelIcon from '../assets/file/format-excel.svg';
import powerpointIcon from '../assets/file/format-powerpoint.svg';

import { getFileType } from '../utils';

export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    thumb: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'medium',
    },
    isLoader: {
      type: Boolean,
      default: false,
    },
    isFolder: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      blob: null,
      loading: true,
      error: false,
    };
  },
  mounted() {
    this.blob = Loader;
  },
  methods: {
    onLoadImage(e) {
      this.$set(this, 'loading', false);
    },
    onError() {
      this.$set(this, 'error', true);
      this.$set(this, 'loading', false);
    },
  },
  watch: {
    thumb: function (newVal, oldVal) {
      if (newVal) {
        this.$set(this, 'error', false);
        this.$set(this, 'loading', true);
      }
    },
  },
  computed: {
    format() {
      return getFileType(this.name);
    },
  },
  components: {
    Base,
    pdfIcon,
    txtIcon,
    zipIcon,
    audioIcon,
    imgIcon,
    videoIcon,
    wordIcon,
    excelIcon,
    powerpointIcon,
    ImageLodaer,
    ImageComponent,
    Icon,
  },
};
</script>
