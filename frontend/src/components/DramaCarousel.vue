<template>
  <n-card class="carousel-card" :bordered="false">
    <n-carousel
      :space-between="20"
      draggable
      autoplay
      :interval="4000"
      dot-type="line"
      dot-placement="bottom"
    >
      <img
        v-for="drama in dramas"
        :key="drama.id"
        class="carousel-img"
        :src="drama.imageUrl"
        :alt="drama.title"
      />
    </n-carousel>
  </n-card>
</template>

<script>
import { NCarousel, NCard } from 'naive-ui';

export default {
  name: 'DramaCarousel',
  components: {
    NCarousel,
    NCard
  },
  data() {
    return {
      dramas: [
        { id: 1, title: 'Queen of Tears', imageUrl: 'https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fwp-content%2Fblogs.dir%2F6%2Ffiles%2F2022%2F12%2F2022-best-kdramas-tv-shows-netflix-1.jpg?q=90&w=1400&cbr=1&fit=max' },
        { id: 2, title: 'Lovely Runner', imageUrl: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474592bap/thuc-tinh-awaken-787636.jpg' },
        { id: 3, title: 'Marry My Husband', imageUrl: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474592avZ/ban-chat-cua-lang-man-be-melodramatic-787653.jpg' },
        { id: 4, title: 'Goblin', imageUrl: 'https://cdn.mos.cms.futurecdn.net/PTndhvg9oPfqr6hXrbiECN-1024-80.png.webp' },
        { id: 5, title: 'Goblin', imageUrl: 'https://cdn.mos.cms.futurecdn.net/jmu8jp5mmA4XyqXrGHCnwf-1024-80.jpeg.webp' },
        { id: 6, title: 'Goblin', imageUrl: 'https://cdn.mos.cms.futurecdn.net/KHhefvjUaJZhLb5SucNvS3-1024-80.jpeg.webp' },
        { id: 7, title: 'Goblin', imageUrl: 'https://cdn.mos.cms.futurecdn.net/s6doi7xQnHzMyC9HA6BEkV-1024-80.jpeg.webp' },
      ],
    };
  },
};
</script>

<style scoped>
.carousel-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  padding: 0; /* Remove default card padding */
}
.carousel-img {
  width: 100%;
  height: 230px; /* You can adjust this height */
  object-fit: cover;
  border-radius: 12px; /* Rounded corners for the images */
}
</style> 