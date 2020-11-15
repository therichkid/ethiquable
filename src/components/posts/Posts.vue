<template>
  <div>
    <LoadingSkeleton type="posts" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getPosts(page)" />

    <v-row v-if="!isLoading && !loadingError && posts.length">
      <v-col class="d-flex" v-bind="breakpointProps" v-if="type === 'home'">
        <v-card dark hover to="/shopfinder" class="d-flex flex-column" color="primary" style="width: 100%">
          <v-card-title class="justify-center">
            <h3 class="headline">Hier finden Sie uns:</h3>
          </v-card-title>
          <v-img
            src="@/assets/map/shopfinder.jpg"
            maxHeight="300px"
            alt="Shop-Finder"
            style="margin: 0 25px; border-radius: 5px"
          ></v-img>
          <v-card-text>
            <div style="text-align: justify">
              Finden Sie Geschäfte in Ihrer Nähe, bei denen Sie ETHIQUABLE-Produkte kaufen können.
            </div>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-icon>mdi-chevron-right</v-icon>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col class="d-flex" v-for="article in posts" :key="article.id" v-bind="breakpointProps">
        <v-card hover :to="`/magazin/${article.slug}`" class="d-flex flex-column" style="width: 100%">
          <v-img
            :src="article.featuredImage.source"
            :maxHeight="type === 'home' ? '200px' : '250px'"
            :alt="article.featuredImage.title"
          >
          </v-img>
          <v-card-title>
            <h3 class="headline">{{ article.title }}</h3>
          </v-card-title>
          <v-card-text>
            <div v-html="article.excerpt" style="text-align: justify"></div>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-icon>mdi-chevron-right</v-icon>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <NoContentYet v-if="!isLoading && !loadingError && !posts.length" />
  </div>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import NoContentYet from "@/components/partials/NoContentYet";
const LoadingError = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    NoContentYet
  },

  props: {
    page: Number,
    type: String
  },

  data() {
    return {
      posts: [],
      breakpointProps: {}
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.postsLoading;
    },
    loadingError() {
      return this.$store.state.postsLoadingError;
    }
  },

  watch: {
    $route() {
      this.getPosts(this.page);
    }
  },

  methods: {
    async getPosts(page) {
      const postsFetched = this.$store.getters.getFetchedPosts(page);
      let posts;
      if (postsFetched[0]) {
        // Already fetched
        posts = postsFetched[1];
      } else {
        // Not fetched yet
        posts = (await this.$store.dispatch("fetchPosts", page).catch(error => console.error(error))) || [];
      }
      if (this.type === "home") {
        posts = posts.slice(0, 3).forEach(post => {
          let excerpt = post.excerpt.slice(0, 150);
          if (post.excerpt.length > 150) {
            excerpt += "...";
          }
          this.posts.push({ ...post, excerpt });
        });
      } else {
        this.posts = posts;
      }
      this.$emit("postPagesInit", this.$store.state.totalPostPages);
    },
    addProps() {
      if (this.type === "home") {
        this.breakpointProps = {
          cols: 12,
          sm: 4,
          md: 3
        };
      } else {
        this.breakpointProps = {
          cols: 12,
          sm: 6,
          md: 4
        };
      }
    }
  },

  created() {
    this.getPosts(this.page);
  },

  mounted() {
    this.addProps();
  }
};
</script>

<style></style>
