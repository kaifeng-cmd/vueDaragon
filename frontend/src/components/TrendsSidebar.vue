<template>
  <div class="trends-sidebar">
    <!-- Trends for You Section -->
    <n-card title="Trends for You" :bordered="false" class="sidebar-card">
      <div v-for="trend in trends" :key="trend.topic" class="trend-item">
        <span class="trend-topic">{{ trend.topic }}</span>
        <span class="trend-posts">{{ trend.posts }} posts</span>
      </div>
    </n-card>

    <!-- Who to Follow Section -->
    <n-card title="Who to Follow" :bordered="false" class="sidebar-card">
      <div v-for="user in usersToFollow" :key="user.name" class="follow-item">
        <div class="follow-user-info">
          <n-avatar round :src="user.avatarUrl" size="small" />
          <div class="follow-user-details">
            <span class="follow-user-name">{{ user.name }}</span>
            <span class="follow-user-handle">@{{ user.handle }}</span>
          </div>
        </div>
        <n-button size="small" strong secondary type="primary">Follow</n-button>
      </div>
    </n-card>
  </div>
</template>

<script>
import { NCard, NAvatar, NButton } from 'naive-ui';

export default {
  name: 'TrendsSidebar',
  components: {
    NCard,
    NAvatar,
    NButton,
  },
  data() {
    return {
      trends: [
        { topic: '#QueenOfTears', posts: '125k' },
        { topic: '#LovelyRunner', posts: '98k' },
        { topic: '#MarryMyHusband', posts: '76k' },
        { topic: '#Goblin', posts: '55k' },
      ],
      usersToFollow: [
        { name: 'Kim Soo Hyun', handle: 'soohyun_k', avatarUrl: 'https://i.mydramalist.com/RPEz4_5c.jpg' },
        { name: 'Park Seo Joon', handle: 'bn_sj2013', avatarUrl: 'https://i.mydramalist.com/B7q2B_5c.jpg' },
        { name: 'IU', handle: 'dlwlrma', avatarUrl: 'https://i.mydramalist.com/DUE36_5c.jpg' },
      ],
    };
  },
};
</script>

<style scoped>
.trends-sidebar {
  width: 100%;
  max-width: 300px; /* Adjust as needed */
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-card {
  background-color: #fdf6f8; /* Light pinkish white */
  border-radius: 12px;
}

.trend-item {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

.trend-topic {
  font-weight: 600;
  color: #333;
}

.trend-posts {
  font-size: 0.8rem;
  color: #888;
}

.follow-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.follow-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.follow-user-details {
  display: flex;
  flex-direction: column;
}

.follow-user-name {
  font-weight: 600;
}

.follow-user-handle {
  font-size: 0.85rem;
  color: #777;
}
</style> 