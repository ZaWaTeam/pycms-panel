<template>
  <v-card title="Add New Post" height="80vh">
    <div class="post-form-container">
      <form @submit.prevent="submitNewPost" class="form-container">
        <div class="left-form-column">
          <label>
            <input v-model="newPost.title" placeholder="Enter title here" class="form-input-field" required/>
          </label>
          <label>
            Content
            <QuillEditor theme="snow" v-model="newPost.content" class="form-input-field quill-editor-height" required/>
          </label>
        </div>
        <div class="right-form-column">
          <VCard title="Publish">
            <label>
              <input type="file" @change="uploadFiles" multiple class="form-input-field"/>
            </label>
            <AppSelect
              :items="groupItems"
              label="Standard"
            />
            <label>
              Is Editor
              <input type="checkbox" v-model="newPost.is_editor" class="form-input-field"/>
            </label>
            <label>
              Slug
              <input v-model="newPost.slug" placeholder="Slug" class="form-input-field" required/>
            </label>
            <label>
              Category
              <select v-model="newPost.category" class="form-input-field">
                <option v-for="category in postCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </label>
          </VCard>
          <button type="submit" class="submit-button">Submit</button>
          <button type="button" class="move-to-trash-button">Move to Trash</button>
          {{ groupItems }}
        </div>
      </form>
    </div>
  </v-card>
</template>

<script>
import { createApp, onMounted, ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useStore } from 'vuex'

const app = createApp()
app.component('QuillEditor', QuillEditor)

export default {
  data() {
    return {
      newPost: {
        id: null,
        title: '',
        content: '',
        thumbnails: [],
        is_editor: false,
        slug: '',
        category: null,
        allow_comments: true,
        allow_comment_perms: [],
        allow_comment_groups: [],
        allow_comment_groups_empty_nobody: false,
        author: null,
        edited_by: null,
        hide_author: false,
        status: '',
        access_groups: [],
        created_at: null,
        updated_at: null,
      },
      postCategories: [],
      expanded: false,
      selected: [],
    }
  },

  setup() {
    const store = useStore()
    const groupItems = ref([])

    onMounted(async () => {
      await store.dispatch('fetchGroups')
      groupItems.value = store.state.groups
    })

    const submitNewPost = () => {
      store.dispatch('submitPost', newPost.value)
    }

    const uploadFiles = (event) => {
      newPost.value.thumbnails = Array.from(event.target.files)
    }
    return {
      groupItems,
      submitNewPost,
      uploadFiles,
    }
  },
}
</script>

<style scoped>
.form-container {
  display: flex;
}

.left-form-column {
  flex: 2;
  padding: 0px 24px 24px 24px;
}

.right-form-column {
  flex: 1;
  padding: 0px 24px 24px 24px;
}

.form-input-field {
  display: block;
  padding: 10px;
  margin: 0px 0;
  border: 1px solid #ccc;
  border-radius: 2px;
  box-sizing: border-box;
  width: 100%;
}

.quill-editor-height {
  height: calc(100vh - 150px);
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.move-to-trash-button {
  background-color: red;
  color: white;
  padding: 10px 20px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
