<template>
  <n-card class="post-card" :bordered="false">
    <template #header>
      <div class="author-info">
        <n-avatar round :src="post.author.avatarUrl" />
        <div class="author-details">
          <span class="author-name">{{ post.author.name }}</span>
          <span class="post-timestamp">{{ post.timestamp }}</span>
        </div>
      </div>
    </template>

    <p class="post-content">{{ post.content }}</p>
    
    <div v-if="post.imageUrl" class="post-image-container">
      <img :src="post.imageUrl" alt="Post image" class="post-image" />
    </div>

    <template #action>
      <div class="post-actions">
        <n-button text class="action-button">
          <template #icon><n-icon :component="Heart" /></template>
          {{ post.likes }}
        </n-button>
        <n-button text class="action-button">
          <template #icon><n-icon :component="MessageCircle" /></template>
          {{ post.comments }}
        </n-button>
        <n-button text class="action-button">
          <template #icon><n-icon :component="Share2" /></template>
          Share
        </n-button>
      </div>
    </template>
  </n-card>
</template>

<script>
import { NCard, NAvatar, NButton, NIcon } from 'naive-ui';
import { Heart, MessageCircle, Share2 } from 'lucide-vue-next';

export default {
  name: 'PostCard',
  components: {
    NCard,
    NAvatar,
    NButton,
    NIcon,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // For Lucide icons
      Heart,
      MessageCircle,
      Share2,
    };
  },
};
</script>

<style scoped>
.post-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #333;
}

.post-timestamp {
  font-size: 0.8rem;
  color: #888;
}

.post-content {
  color: #555;
  line-height: 1.6;
  margin-bottom: 16px;
}

.post-image-container {
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.action-button {
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
}

.action-button:hover {
  color: #ff8fab;
}
</style> 