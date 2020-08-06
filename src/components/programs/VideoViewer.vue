<template>
  <div class="video-container">
    <video width="100%" controls>
      <source :src="cardContent[0]" type="video/mp4">
    </video>
  </div>
</template>

<script>
  export default {
    props: ['cardContent'],
  }
</script>

<style scoped>
  .video-container, video {
    width: 100%;
    height: 100%;
    background-color: black;
  }

  video {
    object-fit: contain;
  }

  .button-move {
    position: absolute;
    top: 40%;
    background-color: rgba(150, 150, 150, 0.2);
    font-family: monospace;
    font-size: 40px;
    z-index: 1000;
    padding: 16px;
    cursor: pointer;
  }

  .button-move:hover {
    box-shadow: 0 0 0 2px orange;
    color: orange;
  }

  .move-left {
    left: 0;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .move-right {
    right: 0;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }

</style>
