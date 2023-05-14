<template>
  <v-card title="Add New Post" height="80vh">
    <div class="post-form">
      <form @submit.prevent="submitPost" class="form-container">
        <div class="left-column">
          <label>
            <input v-model="post.title" placeholder="Enter title here" class="input-field" required/>
          </label>
          <label>
            Content
            <QuillEditor theme="snow" v-model="post.content" class="input-field quill-height" required/>
          </label>
        </div>
        <div class="right-column">

          <v-card title="Publish" class="vcard" @click="expanded = !expanded">
            <v-divider></v-divider>
            <v-card-title>
              {{ name }}
            </v-card-title>
            <v-expand-transition>
              <v-card-text v-show="expanded">
                <label>
                  <input type="file" @change="handleFileUpload" multiple class="input-field"/>
                </label>
                <label>
                  Is Editor
                  <input type="checkbox" v-model="post.is_editor" class="input-field"/>
                </label>
                <label>
                  Slug
                  <input v-model="post.slug" placeholder="Slug" class="input-field" required/>
                </label>
                <label>
                  Category
                  <select v-model="post.category" class="input-field">
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{
                        category.name
                      }}
                    </option>
                  </select>
                </label>
                <!-- Add more fields as needed -->
              </v-card-text>
            </v-expand-transition>
          </v-card>
          <!-- Continue for all fields -->
          <button type="submit" class="submit-button">Submit</button>
          <button type="button" class="move-to-trash-button">Move to Trash</button>
        </div>
      </form>
    </div>
  </v-card>

</template>

<script>
import { createApp } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const app = createApp()
app.component('QuillEditor', QuillEditor)
export default {
  data() {
    return {
      post: {
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
      categories: [], // This could come from your API
      expanded: false,
    }
  },
  methods: {
    submitPost() {
      // Send `this.post` to your API
    },
    handleFileUpload(event) {
      this.post.thumbnails = Array.from(event.target.files)
    },
    moveToTrash() {
      // Add your logic here for moving to trash
      console.log("Item moved to trash")
    },
  },
  mounted() {
    this.categories = [{
      id: 1,
      name: "a",
    }, {
      id: 2,
      name: "b",
    }]
  },

}
</script>

<style scoped>
.form-container {
  display: flex;
}

.left-column {
  flex: 2;
  padding: 0px 24px 24px 24px; /* top right bottom left */
}

.right-column {
  flex: 1;
  padding: 0px 24px 24px 24px; /* top right bottom left */
}


.input-field {
  display: block;
  padding: 10px;
  margin: 0px 0;
  border: 1px solid #ccc;
  border-radius: 2px;
  box-sizing: border-box;
  width: 100%;

}

.quill-height {
  height: calc(100vh - 150px); /* Adjust based on your requirements */
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
