<template>
  <div class="lobby-container">
    <div class="main-content">
      <!-- Left Column: Empty Space -->
      <div class="left-placeholder">
        <!-- This column is intentionally left empty for future features. -->
      </div>

      <!-- Center Column: Feed -->
      <div class="feed-column">
        <DramaCarousel />
        <CreatePost />
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <!-- Right Column: Trends -->
      <div class="trends-column">
        <TrendsSidebar />
      </div>

      <!-- The fourth column for right-side spacing is handled by the grid layout -->
    </div>
  </div>
</template>

<script>
import DramaCarousel from '../components/DramaCarousel.vue';
import CreatePost from '../components/CreatePost.vue';
import PostCard from '../components/PostCard.vue';
import TrendsSidebar from '../components/TrendsSidebar.vue';
import { NConfigProvider, NMessageProvider } from 'naive-ui';


export default {
  name: 'Lobby',
  components: {
    DramaCarousel,
    CreatePost,
    PostCard,
    TrendsSidebar,
    NConfigProvider,
    NMessageProvider
  },
  data() {
    return {
      // Dummy data for posts
      posts: [
        {
          id: 1,
          author: {
            name: 'Jane Doe',
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
          },
          timestamp: '2 hours ago',
          content: 'Just finished watching "Queen of Tears"! The chemistry between the leads is just off the charts. What a rollercoaster of emotions! 😭💖 #QueenOfTears',
          imageUrl: 'https://i.mydramalist.com/X0k82_4f.jpg',
          likes: 125,
          comments: 23,
        },
        {
          id: 2,
          author: {
            name: 'John Smith',
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
          },
          timestamp: '5 hours ago',
          content: 'Can we talk about the soundtrack of "Lovely Runner"? Every song is a bop and fits the scenes so perfectly. 🎶 #LovelyRunnerOST',
          imageUrl: null,
          likes: 88,
          comments: 12,
        },
      ],
    };
  },
};
</script>

<style scoped>
.lobby-container {
  background-color: #fef9f8; /* Very light, soft pink/beige background */
  min-height: calc(100vh - 64px); /* Full height minus nav bar */
  padding: 24px 0; /* Vertical padding only */
}

.main-content {
  display: grid;
  max-width: 1400px; /* Increase max-width for the whole layout */
  margin: 0 auto;
  padding: 0 24px; /* Padding on the sides of the container */
  gap: 24px;
}

/* Default to single column for mobile */
.feed-column, .trends-column {
  width: 100%;
}

.left-placeholder, .trends-column {
  display: none; /* Hide placeholders and trends on mobile */
}

/* Medium screens and up (tablet) */
@media (min-width: 1024px) {
  .main-content {
    /* Four-column layout */
    /* col1: placeholder | col2: feed | col3: trends | col4: placeholder */
    grid-template-columns: 1fr 3.5fr 1.5fr 1fr;
    gap: 24px;
  }
  
  .left-placeholder {
      grid-column: 1 / 2;
      display: block;
  }

  .feed-column {
    grid-column: 2 / 3;
  }

  .trends-column {
    grid-column: 3 / 4;
    display: block;
  }
  /* The 4th column is implicitly empty, creating the right-side space */
}

</style>