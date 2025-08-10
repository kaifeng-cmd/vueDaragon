<template>
  <n-card class="create-post-card" :bordered="false">
    <template #header>
      <div class="header-content">
        <n-avatar
          round
          size="medium"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        />
        <span class="header-title">Create a New Post</span>
      </div>
    </template>
    
    <n-input
      v-model:value="postContent"
      type="textarea"
      placeholder="Share your K-Drama thoughts..."
      :autosize="{ minRows: 3 }"
      class="post-textarea"
    />
    
    <template #action>
      <div class="actions">
        <div class="action-icons">
          <n-icon :component="Image" size="20" class="action-icon" />
          <n-icon :component="Film" size="20" class="action-icon" />
          <n-icon :component="Smile" size="20" class="action-icon" />
        </div>
        <n-button type="primary" strong @click="submitPost">
          Post
        </n-button>
      </div>
    </template>
  </n-card>
</template>

<script setup>
import { ref } from 'vue';
import { NCard, NInput, NButton, NAvatar, NIcon } from 'naive-ui';
import { Image, Film, Smile } from 'lucide-vue-next';

defineOptions({
  name: 'CreatePost'
});

const postContent = ref('');

const submitPost = () => {
  if (!postContent.value.trim()) {
    // Here you can add a notification from naive-ui if you want
    console.log('Post content is empty');
    return;
  }
  console.log('Posting content:', postContent.value);
  // In a real app, you would emit an event to the parent component
  // defineEmits(['new-post']);
  // emit('new-post', postContent.value);
  postContent.value = ''; // Clear input after posting
};
</script>

<style scoped>
.create-post-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title {
  font-weight: 600;
  color: #333;
}

.post-textarea {
  background-color: #fafafa;
  border-radius: 8px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-icons {
  display: flex;
  gap: 16px;
  color: #888;
}

.action-icon {
  cursor: pointer;
  transition: color 0.3s;
}

.action-icon:hover {
  color: #ff8fab; /* A pinkish color for hover */
}
</style>
